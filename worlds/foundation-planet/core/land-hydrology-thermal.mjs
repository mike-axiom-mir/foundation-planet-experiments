export const LAND_HYDROLOGY_THERMAL_STATE_SCHEMA =
  'axm.foundation-planet.land-hydrology-thermal-state/v1';
export const LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-hydrology-thermal-step-receipt/v1';
export const LAND_HYDROLOGY_GROUNDWATER_TRANSPORT_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-hydrology-groundwater-thermal-transport-receipt/v1';
export const LAND_HYDROLOGY_THERMAL_CLOSURE_SCHEMA =
  'axm.foundation-planet.land-hydrology-thermal-closure/v1';
export const LAND_HYDROLOGY_THERMAL_CLOSURE_POLICY_SCHEMA =
  'axm.foundation-planet.land-hydrology-thermal-closure-policy/v1';
export const LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K = 4_184;
export const LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J = 1;
export const LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR = 8;
export const LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM = 1e-9;
export const LAND_HYDROLOGY_THERMAL_WATER_ULP_FACTOR = 8;

const MINIMUM_LIQUID_WATER_TEMPERATURE_C = -2;
const MAXIMUM_LIQUID_WATER_TEMPERATURE_C = 45;
const RESERVOIR_KEYS = Object.freeze([
  'surfacePonded',
  'rootZone',
  'deepSoil',
  'groundwater'
]);

const finite = (value, fallback = 0) => Number.isFinite(Number(value))
  ? Number(value) : fallback;
const clamp = (value, min = 0, max = 1) =>
  Math.max(min, Math.min(max, value));
const clone = value => JSON.parse(JSON.stringify(value));
const round = (value, digits = 12) =>
  Number(Number(value).toFixed(digits));

function stableDigest(value) {
  const text = JSON.stringify(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function liquidTemperature(value, fallback = 15) {
  return clamp(finite(value, fallback),
    MINIMUM_LIQUID_WATER_TEMPERATURE_C,
    MAXIMUM_LIQUID_WATER_TEMPERATURE_C);
}

function sensibleHeatJm2(waterMm, temperatureC) {
  return Math.max(0, finite(waterMm)) *
    LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K *
    liquidTemperature(temperatureC);
}

function reservoir(waterMm = 0, temperatureC = 15) {
  const trackedWaterMm = Math.max(0, finite(waterMm));
  const waterTemperatureC = liquidTemperature(temperatureC);
  return {
    trackedWaterMm,
    sensibleHeatJm2: sensibleHeatJm2(trackedWaterMm,
      waterTemperatureC),
    waterTemperatureC
  };
}

function normalizeReservoir(source, fallbackWaterMm = 0,
  fallbackTemperatureC = 15) {
  if (!source || !Number.isFinite(Number(source.trackedWaterMm)) ||
      !Number.isFinite(Number(source.sensibleHeatJm2))) {
    return reservoir(fallbackWaterMm, fallbackTemperatureC);
  }
  const trackedWaterMm = Math.max(0, finite(source.trackedWaterMm));
  if (trackedWaterMm <= 1e-12) {
    return reservoir(0, source.waterTemperatureC ?? fallbackTemperatureC);
  }
  const waterTemperatureC = liquidTemperature(
    finite(source.sensibleHeatJm2) /
      (trackedWaterMm * LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K),
    source.waterTemperatureC ?? fallbackTemperatureC);
  return reservoir(trackedWaterMm, waterTemperatureC);
}

function stateTruth() {
  return {
    persistentLandHydrologyThermalOwners: true,
    surfacePondedThermalOwner: true,
    rootZoneThermalOwner: true,
    deepSoilThermalOwner: true,
    groundwaterThermalOwner: true,
    internalWaterAndHeatTransfersPaired: true,
    loadedGroundwaterThermalTransportReady: true,
    runoffSourceThermalOwnersDebited: true,
    scaleAwareNumericClosure: true,
    measuredResidualsPreserved: true,
    fixedAbsoluteToleranceOnly: false,
    precipitationThermalSenderOwnerDebited: false,
    evaporationAtmosphereThermalReceiverCredited: false,
    resolvedFreezeThawState: false,
    latentHeatModeled: false,
    scientificCalibrationClaimed: false
  };
}

function closure(kind, signedOperands, applicable = true,
  reason = null) {
  const energy = kind === 'energy';
  const absoluteFloor = energy
    ? LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J
    : LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM;
  const ulpFactor = energy
    ? LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
    : LAND_HYDROLOGY_THERMAL_WATER_ULP_FACTOR;
  const unit = energy ? 'joules-per-square-metre' : 'millimetres-water';
  const policy = {
    schema: LAND_HYDROLOGY_THERMAL_CLOSURE_POLICY_SCHEMA,
    kind,
    absoluteFloor,
    ulpFactor,
    scaleBasis: `sum-of-absolute-unrounded-signed-operands-${unit}`
  };
  if (!applicable) {
    return {
      schema: LAND_HYDROLOGY_THERMAL_CLOSURE_SCHEMA,
      applicable: false,
      reason,
      policy,
      signedOperands: [],
      residual: null,
      numericTolerance: null,
      toleranceUtilization: null,
      closed: null,
      measuredResidualPreserved: false
    };
  }
  const operands = signedOperands.map(Number);
  const residual = operands.reduce((sum, value) => sum + value, 0);
  const absoluteOperandSum = operands.reduce((sum, value) =>
    sum + Math.abs(value), 0);
  const numericTolerance = round(Math.max(absoluteFloor,
    absoluteOperandSum * Number.EPSILON * ulpFactor), 12);
  return {
    schema: LAND_HYDROLOGY_THERMAL_CLOSURE_SCHEMA,
    applicable: true,
    policy,
    signedOperands: operands,
    residual: Number(residual),
    numericTolerance,
    toleranceUtilization: round(Math.abs(residual) /
      numericTolerance, 12),
    closed: Math.abs(residual) <= numericTolerance,
    measuredResidualPreserved: true
  };
}

function reservoirMap(water = {}, temperatures = {}) {
  return {
    surfacePonded: reservoir(water.surfacePondedMm,
      temperatures.surfacePondedTemperatureC),
    rootZone: reservoir(water.rootZoneMm,
      temperatures.rootZoneTemperatureC),
    deepSoil: reservoir(water.deepSoilMm,
      temperatures.deepSoilTemperatureC),
    groundwater: reservoir(water.groundwaterMm,
      temperatures.groundwaterTemperatureC)
  };
}

function ownerTotals(reservoirs) {
  return RESERVOIR_KEYS.reduce((totals, key) => ({
    waterMm: totals.waterMm + reservoirs[key].trackedWaterMm,
    sensibleHeatJm2: totals.sensibleHeatJm2 +
      reservoirs[key].sensibleHeatJm2
  }), { waterMm: 0, sensibleHeatJm2: 0 });
}

function ownerSnapshot(reservoirs) {
  return Object.fromEntries(RESERVOIR_KEYS.map(key => [key, {
    trackedWaterMm: Number(reservoirs[key].trackedWaterMm),
    sensibleHeatJm2: Number(reservoirs[key].sensibleHeatJm2),
    waterTemperatureC: Number(reservoirs[key].waterTemperatureC)
  }]));
}

function refreshTemperature(owner) {
  owner.trackedWaterMm = Math.max(0, finite(owner.trackedWaterMm));
  if (owner.trackedWaterMm <= 1e-12) {
    owner.trackedWaterMm = 0;
    owner.sensibleHeatJm2 = 0;
    return owner;
  }
  owner.waterTemperatureC = liquidTemperature(
    owner.sensibleHeatJm2 /
      (owner.trackedWaterMm *
        LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K),
    owner.waterTemperatureC);
  owner.sensibleHeatJm2 = sensibleHeatJm2(owner.trackedWaterMm,
    owner.waterTemperatureC);
  return owner;
}

function addWater(owner, waterMm, temperatureC) {
  const creditedWaterMm = Math.max(0, finite(waterMm));
  const creditedHeatJm2 = sensibleHeatJm2(creditedWaterMm,
    temperatureC);
  owner.trackedWaterMm += creditedWaterMm;
  owner.sensibleHeatJm2 += creditedHeatJm2;
  refreshTemperature(owner);
  return { waterMm: creditedWaterMm,
    sensibleHeatJm2: creditedHeatJm2,
    waterTemperatureC: liquidTemperature(temperatureC) };
}

function moveWater(reservoirs, sourceKey, destinationKey,
  requestedWaterMm, transferId, destinationKind) {
  const source = reservoirs[sourceKey];
  const requested = Math.max(0, finite(requestedWaterMm));
  const beforeWaterMm = source.trackedWaterMm;
  const beforeHeatJm2 = source.sensibleHeatJm2;
  const transferredWaterMm = Math.min(requested, beforeWaterMm);
  const transferredFraction = beforeWaterMm > 1e-12
    ? transferredWaterMm / beforeWaterMm : 0;
  const transferredSensibleHeatJm2 = beforeHeatJm2 *
    transferredFraction;
  source.trackedWaterMm -= transferredWaterMm;
  source.sensibleHeatJm2 -= transferredSensibleHeatJm2;
  refreshTemperature(source);
  if (destinationKey) {
    const destination = reservoirs[destinationKey];
    destination.trackedWaterMm += transferredWaterMm;
    destination.sensibleHeatJm2 += transferredSensibleHeatJm2;
    refreshTemperature(destination);
  }
  return {
    transferId,
    sourceOwner: sourceKey,
    destinationOwner: destinationKey,
    destinationKind,
    requestedWaterMm: Number(requested),
    transferredWaterMm: Number(transferredWaterMm),
    transferredSensibleHeatJm2: Number(transferredSensibleHeatJm2),
    waterTemperatureC: transferredWaterMm > 1e-12
      ? Number(liquidTemperature(transferredSensibleHeatJm2 /
        (transferredWaterMm *
          LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K)))
      : Number(source.waterTemperatureC),
    sourceOwnerDebited: true,
    receiverOwnerCredited: Boolean(destinationKey),
    requestedTransferAppliedExactly:
      Math.abs(transferredWaterMm - requested) <=
        LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM
  };
}

function aggregateTransfers(transfers) {
  const waterMm = transfers.reduce((sum, entry) =>
    sum + entry.transferredWaterMm, 0);
  const sensibleHeatJm2 = transfers.reduce((sum, entry) =>
    sum + entry.transferredSensibleHeatJm2, 0);
  return {
    waterMm: Number(waterMm),
    sensibleHeatJm2: Number(sensibleHeatJm2),
    waterTemperatureC: waterMm > 1e-12
      ? Number(liquidTemperature(sensibleHeatJm2 /
        (waterMm * LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K)))
      : 0,
    transferIds: transfers.map(entry => entry.transferId)
  };
}

export function createLandHydrologyThermalState(water = {},
  temperatures = {}) {
  return {
    schema: LAND_HYDROLOGY_THERMAL_STATE_SCHEMA,
    migrationCheckpoint: false,
    migration: null,
    reservoirs: reservoirMap(water, temperatures),
    cumulativeRunoffDebitedWaterMm: 0,
    cumulativeRunoffDebitedHeatJm2: 0,
    lastStepReceipt: null,
    lastGroundwaterTransportReceipt: null,
    truth: stateTruth()
  };
}

export function normalizeLandHydrologyThermalState(source,
  water = {}, temperatures = {}, options = {}) {
  if (source?.schema !== LAND_HYDROLOGY_THERMAL_STATE_SCHEMA) {
    const initialized = createLandHydrologyThermalState(water,
      temperatures);
    initialized.migrationCheckpoint = true;
    initialized.migration = {
      status: 'initialized-current-land-water-no-historical-heat',
      sourceEngineSchema: options.sourceEngineSchema || null,
      historicalHeatReconstructed: false
    };
    return initialized;
  }
  const fallback = reservoirMap(water, temperatures);
  return {
    schema: LAND_HYDROLOGY_THERMAL_STATE_SCHEMA,
    migrationCheckpoint: source.migrationCheckpoint === true,
    migration: source.migration ? clone(source.migration) : null,
    reservoirs: Object.fromEntries(RESERVOIR_KEYS.map(key => [key,
      normalizeReservoir(source.reservoirs?.[key],
        fallback[key].trackedWaterMm,
        fallback[key].waterTemperatureC)])),
    cumulativeRunoffDebitedWaterMm: Math.max(0,
      finite(source.cumulativeRunoffDebitedWaterMm)),
    cumulativeRunoffDebitedHeatJm2:
      finite(source.cumulativeRunoffDebitedHeatJm2),
    lastStepReceipt: source.lastStepReceipt?.schema ===
      LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA
      ? clone(source.lastStepReceipt) : null,
    lastGroundwaterTransportReceipt:
      source.lastGroundwaterTransportReceipt?.schema ===
        LAND_HYDROLOGY_GROUNDWATER_TRANSPORT_RECEIPT_SCHEMA
        ? clone(source.lastGroundwaterTransportReceipt) : null,
    truth: stateTruth()
  };
}

export function advanceLandHydrologyThermal(source, context = {}) {
  const initialWater = context.initialWater || {};
  const finalWater = context.finalWater || {};
  const temperatures = context.temperatures || {};
  const flows = context.flows || {};
  const state = normalizeLandHydrologyThermalState(source,
    initialWater, temperatures, context);
  const migrationInitialization = state.migrationCheckpoint
    ? clone(state.migration) : null;
  state.migrationCheckpoint = false;
  const reservoirs = Object.fromEntries(RESERVOIR_KEYS.map(key =>
    [key, { ...state.reservoirs[key] }]));
  const initialOwners = ownerSnapshot(reservoirs);
  const initialTotals = ownerTotals(reservoirs);
  const stepId = String(context.stepId ||
    'unbound-land-hydrology-thermal-step');

  const rainfall = addWater(reservoirs.surfacePonded,
    flows.rainfallMm, temperatures.rainfallTemperatureC);
  const snowmelt = addWater(reservoirs.surfacePonded,
    flows.snowmeltMm, temperatures.snowmeltTemperatureC ?? 0);
  const transfers = [];
  const move = (sourceKey, destinationKey, waterMm, suffix,
    destinationKind) => {
    const entry = moveWater(reservoirs, sourceKey, destinationKey,
      waterMm, `${stepId}:${suffix}`, destinationKind);
    transfers.push(entry);
    return entry;
  };

  move('surfacePonded', 'rootZone', flows.infiltrationMm,
    'infiltration', 'internal-land-water-owner');
  const surfaceRunoff = move('surfacePonded', null,
    flows.surfaceMobileRunoffMm, 'surface-runoff',
    'runoff-thermal-queue');
  const surfaceEvaporation = move('surfacePonded', null,
    flows.surfaceEvaporationMm, 'surface-evaporation',
    'unresolved-atmosphere-thermal-boundary');
  const rootEvaporation = move('rootZone', null,
    Math.max(0, finite(flows.transpirationMm)) +
      Math.max(0, finite(flows.bareSoilEvaporationMm)),
    'root-water-evapotranspiration',
    'unresolved-atmosphere-thermal-boundary');
  move('rootZone', 'deepSoil', flows.percolationMm,
    'percolation', 'internal-land-water-owner');
  const deepSoilSpill = move('deepSoil', null,
    flows.deepSoilSpillMm, 'deep-soil-spill-runoff',
    'runoff-thermal-queue');
  move('deepSoil', 'groundwater', flows.rechargeMm,
    'groundwater-recharge', 'internal-land-water-owner');
  const groundwaterOverflow = move('groundwater', null,
    flows.groundwaterOverflowMm, 'groundwater-overflow-baseflow',
    'runoff-thermal-queue');
  move('groundwater', 'rootZone', flows.capillaryRiseMm,
    'capillary-rise', 'internal-land-water-owner');
  const regularBaseflow = move('groundwater', null,
    flows.regularBaseflowMm, 'groundwater-baseflow',
    'runoff-thermal-queue');

  const surfaceRunoffSources = aggregateTransfers([
    surfaceRunoff, deepSoilSpill
  ]);
  const baseflowSources = aggregateTransfers([
    groundwaterOverflow, regularBaseflow
  ]);
  const evaporationOutputs = aggregateTransfers([
    surfaceEvaporation, rootEvaporation
  ]);
  const finalOwners = ownerSnapshot(reservoirs);
  const finalTotals = ownerTotals(reservoirs);
  const expectedFinalWater = {
    surfacePonded: Math.max(0, finite(finalWater.surfacePondedMm)),
    rootZone: Math.max(0, finite(finalWater.rootZoneMm)),
    deepSoil: Math.max(0, finite(finalWater.deepSoilMm)),
    groundwater: Math.max(0, finite(finalWater.groundwaterMm))
  };
  const ownerWaterResidualsMm = Object.fromEntries(
    RESERVOIR_KEYS.map(key => [key,
      Number(reservoirs[key].trackedWaterMm -
        expectedFinalWater[key]) ]));
  const waterClosure = closure('water', [
    finalTotals.waterMm,
    -initialTotals.waterMm,
    -rainfall.waterMm,
    -snowmelt.waterMm,
    surfaceRunoffSources.waterMm,
    baseflowSources.waterMm,
    evaporationOutputs.waterMm
  ]);
  const energyClosure = closure('energy', [
    finalTotals.sensibleHeatJm2,
    -initialTotals.sensibleHeatJm2,
    -rainfall.sensibleHeatJm2,
    -snowmelt.sensibleHeatJm2,
    surfaceRunoffSources.sensibleHeatJm2,
    baseflowSources.sensibleHeatJm2,
    evaporationOutputs.sensibleHeatJm2
  ]);
  const requestedTransfersAppliedExactly = transfers.every(entry =>
    entry.requestedTransferAppliedExactly === true);
  const ownerWaterBindingsClosed = Object.values(
    ownerWaterResidualsMm).every(residual => Math.abs(residual) <=
      LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM);
  const receipt = {
    schema: LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA,
    stepId,
    status: surfaceRunoffSources.waterMm + baseflowSources.waterMm >
      1e-12
      ? 'runoff-source-thermal-owners-debited'
      : 'no-generated-runoff',
    migrationInitialization,
    initialOwners,
    finalOwners,
    externalInputs: {
      rainfall,
      snowmelt,
      thermalSenderOwnerDebited: false
    },
    externalOutputs: {
      evaporation: evaporationOutputs,
      atmosphereThermalReceiverCredited: false
    },
    runoffSources: {
      surfaceRunoff: surfaceRunoffSources,
      baseflow: baseflowSources
    },
    transfers,
    ownerWaterResidualsMm,
    waterClosure,
    energyClosure,
    truth: {
      ...stateTruth(),
      migrationInventedHistoricalHeat: false,
      requestedTransfersAppliedExactly,
      ownerWaterBindingsClosed,
      waterClosureClosed: waterClosure.closed,
      energyClosureClosed: energyClosure.closed,
      runoffSourceThermalOwnersDebited:
        requestedTransfersAppliedExactly,
      runoffThermalQueueReceiverCreditBoundByGenerationReceipt:
        context.runoffThermalReceiverAvailable !== false
    }
  };
  receipt.digest = stableDigest(receipt);
  state.reservoirs = reservoirs;
  state.cumulativeRunoffDebitedWaterMm +=
    surfaceRunoffSources.waterMm + baseflowSources.waterMm;
  state.cumulativeRunoffDebitedHeatJm2 +=
    surfaceRunoffSources.sensibleHeatJm2 +
      baseflowSources.sensibleHeatJm2;
  state.lastStepReceipt = clone(receipt);
  state.truth = stateTruth();
  return {
    state: normalizeLandHydrologyThermalState(state,
      finalWater, temperatures),
    receipt: clone(receipt),
    runoffSources: clone(receipt.runoffSources)
  };
}

export function transportGroundwaterThermalOwners(columnsById,
  transfers = [], areas = new Map(), context = {}) {
  const routed = Array.isArray(transfers) ? transfers.filter(entry =>
    entry && finite(entry.amount) && Number(entry.amount) > 1e-12 &&
    columnsById.get(entry.donorId)?.land &&
    columnsById.get(entry.receiverId)?.land) : [];
  if (!routed.length) return null;
  const participatingIds = [...new Set(routed.flatMap(entry =>
    [entry.donorId, entry.receiverId]))].sort();
  const initialOwners = Object.fromEntries(participatingIds.map(id => {
    const column = columnsById.get(id);
    const owner = column.land.hydrologyThermal?.reservoirs?.groundwater;
    return [id, {
      trackedWaterMm: Number(owner?.trackedWaterMm),
      sensibleHeatJm2: Number(owner?.sensibleHeatJm2),
      waterTemperatureC: Number(owner?.waterTemperatureC),
      columnGroundwaterMm: Number(column.land.groundwaterStorageMm),
      areaM2: Number(areas.get(id))
    }];
  }));
  const waterDeltasKg = new Map();
  const heatDeltasJ = new Map();
  const transferReceipts = routed.map((entry, index) => {
    const donor = columnsById.get(entry.donorId);
    const owner = donor.land.hydrologyThermal.reservoirs.groundwater;
    const waterTemperatureC = liquidTemperature(
      owner.waterTemperatureC);
    const sensibleHeatJ = Number(entry.amount) *
      LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K *
      waterTemperatureC;
    waterDeltasKg.set(entry.donorId,
      (waterDeltasKg.get(entry.donorId) || 0) - Number(entry.amount));
    waterDeltasKg.set(entry.receiverId,
      (waterDeltasKg.get(entry.receiverId) || 0) + Number(entry.amount));
    heatDeltasJ.set(entry.donorId,
      (heatDeltasJ.get(entry.donorId) || 0) - sensibleHeatJ);
    heatDeltasJ.set(entry.receiverId,
      (heatDeltasJ.get(entry.receiverId) || 0) + sensibleHeatJ);
    return {
      transferId: `${String(context.stepId ||
        'loaded-groundwater-thermal')}:${index}:${entry.donorId}->${entry.receiverId}`,
      edgeId: entry.edgeId || null,
      donorId: entry.donorId,
      receiverId: entry.receiverId,
      waterKg: Number(entry.amount),
      waterTemperatureC: Number(waterTemperatureC),
      sensibleHeatJ: Number(sensibleHeatJ),
      sourceOwnerDebited: true,
      receiverOwnerCredited: true,
      sameWaterAsHydraulicTransfer: true,
      sourceOwnerWaterBound: sameWaterOwner(owner.trackedWaterMm,
        donor.land.groundwaterStorageMm)
    };
  });
  const initialWaterKg = participatingIds.reduce((sum, id) =>
    sum + initialOwners[id].trackedWaterMm * initialOwners[id].areaM2,
  0);
  const initialSensibleHeatJ = participatingIds.reduce((sum, id) =>
    sum + initialOwners[id].sensibleHeatJm2 * initialOwners[id].areaM2,
  0);
  for (const id of participatingIds) {
    const column = columnsById.get(id);
    const areaM2 = Math.max(1, finite(areas.get(id), 1));
    const owner = column.land.hydrologyThermal.reservoirs.groundwater;
    owner.trackedWaterMm = Math.max(0, owner.trackedWaterMm +
      finite(waterDeltasKg.get(id)) / areaM2);
    owner.sensibleHeatJm2 += finite(heatDeltasJ.get(id)) / areaM2;
    owner.waterTemperatureC = owner.trackedWaterMm > 1e-12
      ? liquidTemperature(owner.sensibleHeatJm2 /
        (owner.trackedWaterMm *
          LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K),
      owner.waterTemperatureC) : owner.waterTemperatureC;
    if (owner.trackedWaterMm <= 1e-12) {
      owner.trackedWaterMm = 0;
      owner.sensibleHeatJm2 = 0;
    }
  }
  const finalOwners = Object.fromEntries(participatingIds.map(id => {
    const owner = columnsById.get(id).land.hydrologyThermal
      .reservoirs.groundwater;
    return [id, {
      trackedWaterMm: Number(owner.trackedWaterMm),
      sensibleHeatJm2: Number(owner.sensibleHeatJm2),
      waterTemperatureC: Number(owner.waterTemperatureC),
      areaM2: Number(areas.get(id))
    }];
  }));
  const finalWaterKg = participatingIds.reduce((sum, id) =>
    sum + finalOwners[id].trackedWaterMm * finalOwners[id].areaM2,
  0);
  const finalSensibleHeatJ = participatingIds.reduce((sum, id) =>
    sum + finalOwners[id].sensibleHeatJm2 * finalOwners[id].areaM2,
  0);
  const receipt = {
    schema: LAND_HYDROLOGY_GROUNDWATER_TRANSPORT_RECEIPT_SCHEMA,
    stepId: String(context.stepId ||
      'unbound-loaded-groundwater-thermal'),
    participatingCellIds: participatingIds,
    initialOwners,
    finalOwners,
    transfers: transferReceipts,
    conservation: {
      initialWaterKg: Number(initialWaterKg),
      finalWaterKg: Number(finalWaterKg),
      waterResidualKg: Number(finalWaterKg - initialWaterKg),
      initialSensibleHeatJ: Number(initialSensibleHeatJ),
      finalSensibleHeatJ: Number(finalSensibleHeatJ),
      sensibleHeatResidualJ: Number(finalSensibleHeatJ -
        initialSensibleHeatJ)
    },
    truth: {
      persistentGroundwaterThermalOwners: true,
      exactHydraulicWaterTransfersBound: transferReceipts.every(entry =>
        entry.sourceOwnerWaterBound === true),
      senderDebitsAndReceiverCreditsPaired: true,
      waterConservative: Math.abs(finalWaterKg - initialWaterKg) <=
        Math.max(1e-6, (Math.abs(finalWaterKg) +
          Math.abs(initialWaterKg)) * Number.EPSILON * 8),
      sensibleHeatConservative: Math.abs(finalSensibleHeatJ -
        initialSensibleHeatJ) <= Math.max(1,
        (Math.abs(finalSensibleHeatJ) +
          Math.abs(initialSensibleHeatJ)) * Number.EPSILON * 8),
      scientificCalibrationClaimed: false
    }
  };
  receipt.digest = stableDigest(receipt);
  for (const id of participatingIds) {
    columnsById.get(id).land.hydrologyThermal
      .lastGroundwaterTransportReceipt = clone(receipt);
  }
  return clone(receipt);
}

function sameWaterOwner(a, b) {
  return Number.isFinite(Number(a)) && Number.isFinite(Number(b)) &&
    Math.abs(Number(a) - Number(b)) <=
      LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM;
}

export function landHydrologyThermalDescription() {
  return {
    stateSchema: LAND_HYDROLOGY_THERMAL_STATE_SCHEMA,
    stepReceiptSchema: LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA,
    groundwaterTransportReceiptSchema:
      LAND_HYDROLOGY_GROUNDWATER_TRANSPORT_RECEIPT_SCHEMA,
    closureSchema: LAND_HYDROLOGY_THERMAL_CLOSURE_SCHEMA,
    closurePolicySchema:
      LAND_HYDROLOGY_THERMAL_CLOSURE_POLICY_SCHEMA,
    reservoirs: [...RESERVOIR_KEYS],
    waterSpecificHeatJKgK:
      LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K,
    truth: stateTruth()
  };
}
