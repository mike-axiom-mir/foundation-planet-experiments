export const RIVER_THERMAL_STATE_SCHEMA =
  'axm.foundation-planet.river-thermal-state/v1';
export const RIVER_THERMAL_RECEIPT_SCHEMA =
  'axm.foundation-planet.river-thermal-receipt/v2';
export const PREVIOUS_RIVER_THERMAL_RECEIPT_SCHEMA =
  'axm.foundation-planet.river-thermal-receipt/v1';
export const RIVER_THERMAL_PRE_ROUTE_PROJECTION_SCHEMA =
  'axm.foundation-planet.river-thermal-pre-route-projection/v1';
export const RIVER_THERMAL_TRANSFER_SCHEMA =
  'axm.foundation-planet.river-thermal-transfer/v2';
export const PREVIOUS_RIVER_THERMAL_TRANSFER_SCHEMA =
  'axm.foundation-planet.river-thermal-transfer/v1';
export const RIVER_THERMAL_ENERGY_CLOSURE_SCHEMA =
  'axm.foundation-planet.river-thermal-energy-closure/v1';
export const RIVER_THERMAL_ENERGY_CLOSURE_POLICY_SCHEMA =
  'axm.foundation-planet.river-thermal-energy-closure-policy/v1';
export const RIVER_WATER_SPECIFIC_HEAT_J_KG_K = 4_184;
export const RIVER_THERMAL_ENERGY_ABSOLUTE_FLOOR_J = 1;
export const RIVER_THERMAL_ENERGY_ULP_FACTOR = 8;

const MINIMUM_LIQUID_WATER_TEMPERATURE_C = -2;
const MAXIMUM_LIQUID_WATER_TEMPERATURE_C = 45;
const WATER_OWNER_NUMERIC_TOLERANCE_KG = 1e-6;
const finite = (value, fallback = 0) => Number.isFinite(Number(value))
  ? Number(value) : fallback;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const clone = value => JSON.parse(JSON.stringify(value));
const round = (value, digits = 9) => Number(Number(value).toFixed(digits));

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

function sensibleHeatJ(waterKg, temperatureC) {
  return Math.max(0, finite(waterKg)) *
    RIVER_WATER_SPECIFIC_HEAT_J_KG_K * liquidTemperature(temperatureC);
}

function truth() {
  return {
    persistentRiverWaterTemperatureState: true,
    persistentRiverSensibleHeatOwner: true,
    exactLoadedReachHeatAdvection: true,
    exactRunoffTransferIds: true,
    exactReachTransferIds: true,
    netFloodplainHeatExchangePaired: true,
    scaleAwareNumericEnergyClosure: true,
    measuredEnergyResidualPreserved: true,
    fixedAbsoluteEnergyToleranceOnly: false,
    retainedUnloadedBoundaryIsNontransfer: true,
    runoffSourceThermalOwnerDebited: true,
    oceanReceiverThermalOwnerCredited: true,
    externalThermalBoundaryOwnerDebited: false,
    resolvedGrossChannelFloodplainCounterflow: false,
    resolvedFreezeThawState: false,
    latentHeatModeled: false,
    scientificCalibrationClaimed: false
  };
}

export function riverThermalEnergyToleranceJ(signedOperandsJ = []) {
  const absoluteOperandSumJ = signedOperandsJ.reduce((sum, operand) =>
    sum + Math.abs(finite(operand)), 0);
  return round(Math.max(
    RIVER_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    absoluteOperandSumJ * Number.EPSILON *
      RIVER_THERMAL_ENERGY_ULP_FACTOR
  ), 12);
}

function energyClosure(signedOperandsJ) {
  const residualJ = signedOperandsJ.reduce((sum, operand) =>
    sum + finite(operand), 0);
  const numericToleranceJ = riverThermalEnergyToleranceJ(
    signedOperandsJ);
  const toleranceUtilization = round(
    Math.abs(residualJ) / numericToleranceJ, 12);
  return {
    schema: RIVER_THERMAL_ENERGY_CLOSURE_SCHEMA,
    applicable: true,
    policy: {
      schema: RIVER_THERMAL_ENERGY_CLOSURE_POLICY_SCHEMA,
      absoluteFloorJ: RIVER_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
      ulpFactor: RIVER_THERMAL_ENERGY_ULP_FACTOR,
      scaleBasis: 'sum-of-absolute-unrounded-signed-operands-joules'
    },
    sensibleHeat: {
      signedOperandsJ: signedOperandsJ.map(Number),
      residualJ: Number(residualJ),
      numericToleranceJ,
      toleranceUtilization,
      closed: Math.abs(residualJ) <= numericToleranceJ
    },
    identityCount: 1,
    maximumResidualJ: Math.abs(residualJ),
    maximumToleranceJ: numericToleranceJ,
    maximumToleranceUtilization: toleranceUtilization,
    conservationClosed: Math.abs(residualJ) <= numericToleranceJ,
    measuredResidualPreserved: true
  };
}

function migrationClosure(initializationHeatJ) {
  return {
    schema: RIVER_THERMAL_ENERGY_CLOSURE_SCHEMA,
    applicable: false,
    reason: 'pre-r67-river-heat-history-unobserved',
    policy: {
      schema: RIVER_THERMAL_ENERGY_CLOSURE_POLICY_SCHEMA,
      absoluteFloorJ: RIVER_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
      ulpFactor: RIVER_THERMAL_ENERGY_ULP_FACTOR,
      scaleBasis: 'sum-of-absolute-unrounded-signed-operands-joules'
    },
    initializationHeatJ: Number(initializationHeatJ),
    sensibleHeat: null,
    identityCount: 0,
    maximumResidualJ: null,
    maximumToleranceJ: null,
    maximumToleranceUtilization: null,
    conservationClosed: null,
    measuredResidualPreserved: false
  };
}

export function emptyRiverThermalState(options = {}) {
  const waterTemperatureC = liquidTemperature(
    options.initialWaterTemperatureC, 15);
  const trackedWaterKg = Math.max(0, finite(options.trackedWaterKg));
  return {
    schema: RIVER_THERMAL_STATE_SCHEMA,
    migrationCheckpoint: options.migrationCheckpoint === true,
    waterTemperatureC,
    trackedWaterKg,
    sensibleHeatJ: sensibleHeatJ(trackedWaterKg, waterTemperatureC),
    observedThermalDays: 0,
    dryDays: 0,
    cumulativeLandInletHeatJ: 0,
    cumulativeReachInflowHeatJ: 0,
    cumulativeReachOutflowHeatJ: 0,
    cumulativeFloodplainNetHeatJ: 0,
    cumulativeBoundaryHeatJ: 0,
    lastTransitionReceipt: null,
    truth: truth()
  };
}

export function normalizeRiverThermalState(source, options = {}) {
  if (source?.schema !== RIVER_THERMAL_STATE_SCHEMA) {
    return emptyRiverThermalState(options);
  }
  const trackedWaterKg = Math.max(0, finite(source.trackedWaterKg));
  let waterTemperatureC = liquidTemperature(source.waterTemperatureC, 15);
  let ownedSensibleHeatJ = finite(source.sensibleHeatJ,
    sensibleHeatJ(trackedWaterKg, waterTemperatureC));
  if (trackedWaterKg <= 1e-12) {
    ownedSensibleHeatJ = 0;
  } else {
    waterTemperatureC = liquidTemperature(ownedSensibleHeatJ /
      (trackedWaterKg * RIVER_WATER_SPECIFIC_HEAT_J_KG_K),
    waterTemperatureC);
    ownedSensibleHeatJ = sensibleHeatJ(trackedWaterKg, waterTemperatureC);
  }
  return {
    schema: RIVER_THERMAL_STATE_SCHEMA,
    migrationCheckpoint: source.migrationCheckpoint === true,
    waterTemperatureC,
    trackedWaterKg,
    sensibleHeatJ: ownedSensibleHeatJ,
    observedThermalDays: Math.max(0, finite(source.observedThermalDays)),
    dryDays: Math.max(0, finite(source.dryDays)),
    cumulativeLandInletHeatJ: finite(source.cumulativeLandInletHeatJ),
    cumulativeReachInflowHeatJ: finite(source.cumulativeReachInflowHeatJ),
    cumulativeReachOutflowHeatJ: finite(source.cumulativeReachOutflowHeatJ),
    cumulativeFloodplainNetHeatJ: finite(
      source.cumulativeFloodplainNetHeatJ),
    cumulativeBoundaryHeatJ: finite(source.cumulativeBoundaryHeatJ),
    lastTransitionReceipt: [RIVER_THERMAL_RECEIPT_SCHEMA,
      PREVIOUS_RIVER_THERMAL_RECEIPT_SCHEMA].includes(
      source.lastTransitionReceipt?.schema)
      ? clone(source.lastTransitionReceipt) : null,
    truth: truth()
  };
}

export function riverThermalSummary(source) {
  const state = normalizeRiverThermalState(source);
  return {
    migrationCheckpoint: state.migrationCheckpoint,
    waterTemperatureC: round(state.waterTemperatureC, 9),
    trackedWaterKg: round(state.trackedWaterKg, 6),
    sensibleHeatJ: round(state.sensibleHeatJ, 3),
    observedThermalDays: round(state.observedThermalDays, 8),
    dryDays: round(state.dryDays, 8),
    cumulativeLandInletHeatJ: round(state.cumulativeLandInletHeatJ, 3),
    cumulativeReachInflowHeatJ: round(state.cumulativeReachInflowHeatJ, 3),
    cumulativeReachOutflowHeatJ: round(state.cumulativeReachOutflowHeatJ, 3),
    cumulativeFloodplainNetHeatJ: round(
      state.cumulativeFloodplainNetHeatJ, 3),
    cumulativeBoundaryHeatJ: round(state.cumulativeBoundaryHeatJ, 3),
    lastEnergyResidualJ: state.lastTransitionReceipt?.energyClosure
      ?.sensibleHeat?.residualJ ?? null,
    lastEnergyToleranceJ: state.lastTransitionReceipt?.energyClosure
      ?.sensibleHeat?.numericToleranceJ ?? null,
    lastEnergyToleranceUtilization: state.lastTransitionReceipt
      ?.energyClosure?.sensibleHeat?.toleranceUtilization ?? null,
    truth: truth()
  };
}

export function riverThermalPreRouteProjection(source, context = {}) {
  const state = normalizeRiverThermalState(source, {
    migrationCheckpoint: context.migrationCheckpoint === true
  });
  const reachId = String(context.reachId || '');
  const currentWaterKg = Math.max(0, finite(context.currentWaterKg));
  const surfaceBoundaryTemperatureC = liquidTemperature(
    context.surfaceBoundaryTemperatureC, 15);
  const floodplainReceipt = context.floodplainThermalReceipt || null;
  const migrationFallback = state.migrationCheckpoint ||
    !state.lastTransitionReceipt;
  const toFloodplainWaterKg = migrationFallback ? 0 : Math.max(0,
    finite(floodplainReceipt?.channelExchange?.toFloodplainWaterKg));
  const fromFloodplainWaterKg = migrationFallback ? 0 : Math.max(0,
    finite(floodplainReceipt?.channelExchange?.fromFloodplainWaterKg));
  const heatToFloodplainJ = migrationFallback ? 0 : finite(
    floodplainReceipt?.channelExchange?.heatToFloodplainJ);
  const heatFromFloodplainJ = migrationFallback ? 0 : finite(
    floodplainReceipt?.channelExchange?.heatFromFloodplainJ);
  const expectedWaterKg = migrationFallback ? currentWaterKg :
    state.trackedWaterKg - toFloodplainWaterKg + fromFloodplainWaterKg;
  const expectedHeatJ = migrationFallback
    ? sensibleHeatJ(currentWaterKg, surfaceBoundaryTemperatureC)
    : state.sensibleHeatJ - heatToFloodplainJ + heatFromFloodplainJ;
  const waterTemperatureC = currentWaterKg > 1e-12
    ? liquidTemperature(expectedHeatJ /
      (currentWaterKg * RIVER_WATER_SPECIFIC_HEAT_J_KG_K),
    state.waterTemperatureC)
    : surfaceBoundaryTemperatureC;
  const projection = {
    schema: RIVER_THERMAL_PRE_ROUTE_PROJECTION_SCHEMA,
    reachId,
    status: migrationFallback
      ? 'migration-surface-fallback-no-historical-heat'
      : 'persistent-channel-after-net-floodplain-exchange',
    lineage: {
      previousReceiptDigest:
        state.lastTransitionReceipt?.digest || null,
      floodplainThermalReceiptDigest: floodplainReceipt?.digest || null
    },
    water: {
      initialTrackedKg: migrationFallback ? null : state.trackedWaterKg,
      toFloodplainKg: migrationFallback ? null : toFloodplainWaterKg,
      fromFloodplainKg: migrationFallback ? null : fromFloodplainWaterKg,
      projectedKg: currentWaterKg,
      expectedProjectedKg: migrationFallback ? null : expectedWaterKg,
      ownerResidualKg: migrationFallback ? null :
        currentWaterKg - expectedWaterKg,
      numericToleranceKg: migrationFallback ? null :
        WATER_OWNER_NUMERIC_TOLERANCE_KG
    },
    energy: {
      initialSensibleHeatJ: migrationFallback ? null : state.sensibleHeatJ,
      heatToFloodplainJ: migrationFallback ? null : heatToFloodplainJ,
      heatFromFloodplainJ: migrationFallback ? null : heatFromFloodplainJ,
      projectedSensibleHeatJ: Number(expectedHeatJ)
    },
    waterTemperatureC: Number(waterTemperatureC),
    applicable: !migrationFallback,
    truth: {
      ...truth(),
      migrationFallback,
      historicalHeatReconstructed: false,
      currentMaterialOwnerObserved: true,
      waterOwnerClosed: migrationFallback ? null :
        Math.abs(currentWaterKg - expectedWaterKg) <=
          WATER_OWNER_NUMERIC_TOLERANCE_KG,
      floodplainThermalReceiptBound: migrationFallback ? false :
        typeof floodplainReceipt?.digest === 'string'
    }
  };
  projection.digest = stableDigest(projection);
  return clone(projection);
}

function normalizedTransfers(source = [], fallbackKind) {
  return (Array.isArray(source) ? source : []).map(entry => {
    const waterKg = Math.max(0, finite(entry.waterKg));
    const waterTemperatureC = liquidTemperature(
      entry.waterTemperatureC, 15);
    return {
      schema: RIVER_THERMAL_TRANSFER_SCHEMA,
      transferId: String(entry.transferId || ''),
      kind: String(entry.kind || fallbackKind),
      sourceId: entry.sourceId == null ? null : String(entry.sourceId),
      destinationId: entry.destinationId == null
        ? null : String(entry.destinationId),
      waterKg: Number(waterKg),
      waterTemperatureC: Number(waterTemperatureC),
      sensibleHeatJ: sensibleHeatJ(waterKg, waterTemperatureC),
      sourceProjectionDigest: entry.sourceProjectionDigest == null
        ? null : String(entry.sourceProjectionDigest),
      sourceRunoffThermalReceiptDigest:
        entry.sourceRunoffThermalReceiptDigest == null
          ? null : String(entry.sourceRunoffThermalReceiptDigest),
      sourceThermalOwnerDebited:
        entry.sourceThermalOwnerDebited === true,
      receiverThermalOwnerCredited:
        entry.receiverThermalOwnerCredited === true,
      oceanReceiverThermalOwnerCredited:
        entry.oceanReceiverThermalOwnerCredited === true,
      oceanReceiverThermalReceiptDigest:
        entry.oceanReceiverThermalReceiptDigest == null
          ? null : String(entry.oceanReceiverThermalReceiptDigest),
      parameterizedRunoffTemperature:
        entry.parameterizedRunoffTemperature === true,
      persistentRunoffThermalTemperature:
        entry.persistentRunoffThermalTemperature === true
    };
  }).sort((a, b) => a.transferId.localeCompare(b.transferId));
}

function weightedTemperature(transfers, fallback) {
  const waterKg = transfers.reduce((sum, entry) => sum + entry.waterKg, 0);
  const heatJ = transfers.reduce((sum, entry) =>
    sum + entry.sensibleHeatJ, 0);
  return waterKg > 1e-12
    ? liquidTemperature(heatJ /
      (waterKg * RIVER_WATER_SPECIFIC_HEAT_J_KG_K), fallback)
    : null;
}

export function advanceRiverThermal(source, finalWaterSource,
  context = {}) {
  const state = normalizeRiverThermalState(source, {
    migrationCheckpoint: context.migrationCheckpoint === true
  });
  const finalWaterKg = Math.max(0, finite(finalWaterSource));
  const reachId = String(context.reachId || '');
  const startDay = round(finite(context.startDay), 8);
  const durationDays = finite(context.durationDays, 1);
  if (!(durationDays > 0) || durationDays > 1.000001) {
    throw new Error('River thermal step must be greater than zero and no longer than one day');
  }
  const surfaceBoundaryTemperatureC = liquidTemperature(
    context.surfaceBoundaryTemperatureC, 15);
  const relaxationTimescaleDays = clamp(finite(
    context.relaxationTimescaleDays, 2), .125, 120);
  const preRouteProjection = clone(context.preRouteProjection ||
    riverThermalPreRouteProjection(state, {
      reachId,
      currentWaterKg: state.trackedWaterKg,
      surfaceBoundaryTemperatureC
    }));
  const landInlets = normalizedTransfers(context.landInlets,
    'land-runoff-to-river');
  const reachInflows = normalizedTransfers(context.reachInflows,
    'river-reach-inflow');
  const routeOutflows = normalizedTransfers(context.routeOutflows,
    'river-reach-outflow');

  if (state.migrationCheckpoint) {
    const initializationHeatJ = sensibleHeatJ(finalWaterKg,
      surfaceBoundaryTemperatureC);
    state.migrationCheckpoint = false;
    state.waterTemperatureC = surfaceBoundaryTemperatureC;
    state.trackedWaterKg = finalWaterKg;
    state.sensibleHeatJ = initializationHeatJ;
    const receipt = {
      schema: RIVER_THERMAL_RECEIPT_SCHEMA,
      reachId,
      status: 'initialized-after-migration-no-historical-heat',
      startDay,
      durationDays: round(durationDays, 8),
      lineage: {
        previousReceiptDigest: null,
        preRouteProjectionDigest: preRouteProjection.digest || null
      },
      controls: {
        relaxationTimescaleDays: round(relaxationTimescaleDays, 9),
        relaxationFraction: null,
        specificHeatJkgK: RIVER_WATER_SPECIFIC_HEAT_J_KG_K,
        minimumLiquidWaterTemperatureC:
          MINIMUM_LIQUID_WATER_TEMPERATURE_C,
        maximumLiquidWaterTemperatureC:
          MAXIMUM_LIQUID_WATER_TEMPERATURE_C
      },
      water: {
        initialTrackedKg: null,
        finalTrackedKg: Number(finalWaterKg),
        landInletKg: null,
        reachInletKg: null,
        routeOutflowKg: null,
        toFloodplainKg: null,
        fromFloodplainKg: null,
        ownerResidualKg: null,
        numericToleranceKg: null
      },
      temperatures: {
        initialWaterTemperatureC: null,
        preRouteWaterTemperatureC: null,
        landInletWeightedTemperatureC: weightedTemperature(landInlets,
          surfaceBoundaryTemperatureC),
        reachInletWeightedTemperatureC: weightedTemperature(reachInflows,
          surfaceBoundaryTemperatureC),
        surfaceBoundaryTemperatureC:
          Number(surfaceBoundaryTemperatureC),
        mixedWaterTemperatureC: null,
        finalWaterTemperatureC: Number(surfaceBoundaryTemperatureC)
      },
      transfers: { landInlets, reachInflows, routeOutflows },
      energy: {
        initialSensibleHeatJ: null,
        landInletHeatJ: null,
        reachInletHeatJ: null,
        routeOutflowHeatJ: null,
        heatToFloodplainJ: null,
        heatFromFloodplainJ: null,
        externalBoundaryHeatJ: null,
        finalSensibleHeatJ: Number(initializationHeatJ)
      },
      energyClosure: migrationClosure(initializationHeatJ),
      truth: {
        ...truth(),
        migrationInventedHistoricalHeat: false,
        migrationTransfersObservedButNotHistoricallyClosed: true,
        energyClosureApplicable: false,
        currentMaterialOwnerObserved: true
      }
    };
    receipt.digest = stableDigest(receipt);
    state.lastTransitionReceipt = clone(receipt);
    return {
      state: normalizeRiverThermalState(state),
      receipt: clone(receipt)
    };
  }

  if (preRouteProjection.schema !==
      RIVER_THERMAL_PRE_ROUTE_PROJECTION_SCHEMA ||
      preRouteProjection.applicable !== true) {
    throw new Error('Active river thermal step requires an applicable pre-route projection');
  }
  const initialWaterKg = state.trackedWaterKg;
  const initialSensibleHeatJ = state.sensibleHeatJ;
  const toFloodplainWaterKg = Math.max(0, finite(
    preRouteProjection.water?.toFloodplainKg));
  const fromFloodplainWaterKg = Math.max(0, finite(
    preRouteProjection.water?.fromFloodplainKg));
  const heatToFloodplainJ = finite(
    preRouteProjection.energy?.heatToFloodplainJ);
  const heatFromFloodplainJ = finite(
    preRouteProjection.energy?.heatFromFloodplainJ);
  const preRouteWaterKg = Math.max(0, finite(
    preRouteProjection.water?.projectedKg));
  const preRouteSensibleHeatJ = finite(
    preRouteProjection.energy?.projectedSensibleHeatJ);
  const preRouteWaterTemperatureC = liquidTemperature(
    preRouteProjection.waterTemperatureC, state.waterTemperatureC);
  const landInletWaterKg = landInlets.reduce((sum, entry) =>
    sum + entry.waterKg, 0);
  const reachInletWaterKg = reachInflows.reduce((sum, entry) =>
    sum + entry.waterKg, 0);
  const routeOutflowWaterKg = routeOutflows.reduce((sum, entry) =>
    sum + entry.waterKg, 0);
  const landInletHeatJ = landInlets.reduce((sum, entry) =>
    sum + entry.sensibleHeatJ, 0);
  const reachInletHeatJ = reachInflows.reduce((sum, entry) =>
    sum + entry.sensibleHeatJ, 0);
  const routeOutflowHeatJ = routeOutflows.reduce((sum, entry) =>
    sum + entry.sensibleHeatJ, 0);
  const expectedFinalWaterKg = initialWaterKg - toFloodplainWaterKg +
    fromFloodplainWaterKg + landInletWaterKg + reachInletWaterKg -
    routeOutflowWaterKg;
  const waterOwnerResidualKg = finalWaterKg - expectedFinalWaterKg;
  const preBoundarySensibleHeatJ = preRouteSensibleHeatJ +
    landInletHeatJ + reachInletHeatJ - routeOutflowHeatJ;
  const mixedWaterTemperatureC = finalWaterKg > 1e-12
    ? liquidTemperature(preBoundarySensibleHeatJ /
      (finalWaterKg * RIVER_WATER_SPECIFIC_HEAT_J_KG_K),
    preRouteWaterTemperatureC)
    : surfaceBoundaryTemperatureC;
  const relaxationFraction = finalWaterKg > 1e-12
    ? 1 - Math.exp(-durationDays / relaxationTimescaleDays) : 0;
  const externalBoundaryHeatJ = finalWaterKg *
    RIVER_WATER_SPECIFIC_HEAT_J_KG_K *
    (surfaceBoundaryTemperatureC - mixedWaterTemperatureC) *
    relaxationFraction;
  const finalSensibleHeatJ = finalWaterKg > 1e-12
    ? preBoundarySensibleHeatJ + externalBoundaryHeatJ : 0;
  const finalWaterTemperatureC = finalWaterKg > 1e-12
    ? liquidTemperature(finalSensibleHeatJ /
      (finalWaterKg * RIVER_WATER_SPECIFIC_HEAT_J_KG_K),
    surfaceBoundaryTemperatureC) : surfaceBoundaryTemperatureC;
  const canonicalFinalSensibleHeatJ = sensibleHeatJ(finalWaterKg,
    finalWaterTemperatureC);
  const closure = energyClosure([
    canonicalFinalSensibleHeatJ,
    -initialSensibleHeatJ,
    heatToFloodplainJ,
    -heatFromFloodplainJ,
    -landInletHeatJ,
    -reachInletHeatJ,
    routeOutflowHeatJ,
    -externalBoundaryHeatJ
  ]);

  state.waterTemperatureC = finalWaterTemperatureC;
  state.trackedWaterKg = finalWaterKg;
  state.sensibleHeatJ = canonicalFinalSensibleHeatJ;
  if (finalWaterKg > 1e-12) state.observedThermalDays += durationDays;
  else state.dryDays += durationDays;
  state.cumulativeLandInletHeatJ += landInletHeatJ;
  state.cumulativeReachInflowHeatJ += reachInletHeatJ;
  state.cumulativeReachOutflowHeatJ += routeOutflowHeatJ;
  state.cumulativeFloodplainNetHeatJ +=
    heatFromFloodplainJ - heatToFloodplainJ;
  state.cumulativeBoundaryHeatJ += externalBoundaryHeatJ;
  const receipt = {
    schema: RIVER_THERMAL_RECEIPT_SCHEMA,
    reachId,
    status: finalWaterKg > 1e-12
      ? 'persistent-river-thermal-step' : 'dry-no-water-heat-storage',
    startDay,
    durationDays: round(durationDays, 8),
    lineage: {
      previousReceiptDigest: state.lastTransitionReceipt?.digest || null,
      preRouteProjectionDigest: preRouteProjection.digest,
      floodplainThermalReceiptDigest:
        preRouteProjection.lineage?.floodplainThermalReceiptDigest || null
    },
    controls: {
      relaxationTimescaleDays: round(relaxationTimescaleDays, 9),
      relaxationFraction: Number(relaxationFraction),
      specificHeatJkgK: RIVER_WATER_SPECIFIC_HEAT_J_KG_K,
      minimumLiquidWaterTemperatureC:
        MINIMUM_LIQUID_WATER_TEMPERATURE_C,
      maximumLiquidWaterTemperatureC:
        MAXIMUM_LIQUID_WATER_TEMPERATURE_C
    },
    water: {
      initialTrackedKg: Number(initialWaterKg),
      preRouteKg: Number(preRouteWaterKg),
      finalTrackedKg: Number(finalWaterKg),
      landInletKg: Number(landInletWaterKg),
      reachInletKg: Number(reachInletWaterKg),
      routeOutflowKg: Number(routeOutflowWaterKg),
      toFloodplainKg: Number(toFloodplainWaterKg),
      fromFloodplainKg: Number(fromFloodplainWaterKg),
      ownerResidualKg: Number(waterOwnerResidualKg),
      numericToleranceKg: WATER_OWNER_NUMERIC_TOLERANCE_KG
    },
    temperatures: {
      initialWaterTemperatureC: Number(state.lastTransitionReceipt
        ?.temperatures?.finalWaterTemperatureC ??
        (initialWaterKg > 1e-12 ? initialSensibleHeatJ /
          (initialWaterKg * RIVER_WATER_SPECIFIC_HEAT_J_KG_K) :
          surfaceBoundaryTemperatureC)),
      preRouteWaterTemperatureC: Number(preRouteWaterTemperatureC),
      landInletWeightedTemperatureC: weightedTemperature(landInlets,
        surfaceBoundaryTemperatureC),
      reachInletWeightedTemperatureC: weightedTemperature(reachInflows,
        preRouteWaterTemperatureC),
      surfaceBoundaryTemperatureC: Number(surfaceBoundaryTemperatureC),
      mixedWaterTemperatureC: Number(mixedWaterTemperatureC),
      finalWaterTemperatureC: Number(finalWaterTemperatureC)
    },
    transfers: { landInlets, reachInflows, routeOutflows },
    energy: {
      initialSensibleHeatJ: Number(initialSensibleHeatJ),
      preRouteSensibleHeatJ: Number(preRouteSensibleHeatJ),
      landInletHeatJ: Number(landInletHeatJ),
      reachInletHeatJ: Number(reachInletHeatJ),
      routeOutflowHeatJ: Number(routeOutflowHeatJ),
      heatToFloodplainJ: Number(heatToFloodplainJ),
      heatFromFloodplainJ: Number(heatFromFloodplainJ),
      externalBoundaryHeatJ: Number(externalBoundaryHeatJ),
      finalSensibleHeatJ: Number(canonicalFinalSensibleHeatJ)
    },
    energyClosure: closure,
    truth: {
      ...truth(),
      migrationInventedHistoricalHeat: false,
      energyClosureApplicable: true,
      currentMaterialOwnerObserved: true,
      waterOwnerClosed:
        Math.abs(waterOwnerResidualKg) <= WATER_OWNER_NUMERIC_TOLERANCE_KG,
      preRouteProjectionBound:
        preRouteProjection.digest === context.preRouteProjection?.digest,
      energyClosureClosed: closure.conservationClosed,
      allTransferIdsPresent: [...landInlets, ...reachInflows,
        ...routeOutflows].every(entry => entry.transferId.length > 0)
    }
  };
  receipt.digest = stableDigest(receipt);
  state.lastTransitionReceipt = clone(receipt);
  return {
    state: normalizeRiverThermalState(state),
    receipt: clone(receipt)
  };
}

export function riverThermalDescription() {
  return {
    stateSchema: RIVER_THERMAL_STATE_SCHEMA,
    transitionReceiptSchema: RIVER_THERMAL_RECEIPT_SCHEMA,
    previousTransitionReceiptSchema: PREVIOUS_RIVER_THERMAL_RECEIPT_SCHEMA,
    preRouteProjectionSchema: RIVER_THERMAL_PRE_ROUTE_PROJECTION_SCHEMA,
    transferSchema: RIVER_THERMAL_TRANSFER_SCHEMA,
    previousTransferSchema: PREVIOUS_RIVER_THERMAL_TRANSFER_SCHEMA,
    energyClosureSchema: RIVER_THERMAL_ENERGY_CLOSURE_SCHEMA,
    energyClosurePolicy: {
      schema: RIVER_THERMAL_ENERGY_CLOSURE_POLICY_SCHEMA,
      absoluteFloorJ: RIVER_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
      ulpFactor: RIVER_THERMAL_ENERGY_ULP_FACTOR,
      scaleBasis: 'sum-of-absolute-unrounded-signed-operands-joules'
    },
    waterSpecificHeatJkgK: RIVER_WATER_SPECIFIC_HEAT_J_KG_K,
    processes: [
      'persistent-loaded-river-water-temperature',
      'exact-persistent-land-runoff-and-reach-heat-advection',
      'exact-river-mouth-ocean-mixed-layer-heat-credit',
      'net-channel-floodplain-heat-pairing',
      'parameterized-external-boundary-heat-relaxation',
      'pre-r67-no-historical-river-heat-migration'
    ],
    truth: truth()
  };
}
