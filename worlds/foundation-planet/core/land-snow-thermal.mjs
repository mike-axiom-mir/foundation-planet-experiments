import {
  ATMOSPHERE_PRESSURE_COLUMN_SCHEMA,
  PRESSURE_COLUMN_DRY_AIR_HEAT_CAPACITY_J_KG_K,
  applyPressureColumnProjectionToLegacy,
  pressureColumnTotals
} from './pressure-column.mjs';
import {
  ATMOSPHERE_PRESSURE_COLUMN_DYNAMICS_SCHEMA
} from './pressure-dynamics.mjs';
import {
  MIN_NATIVE_LAYER_AIR_TEMPERATURE_C,
  MAX_NATIVE_LAYER_AIR_TEMPERATURE_C
} from './phase-thermal-envelope.mjs';
import {
  LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA
} from './land-hydrology-thermal.mjs?v=0.72.0-r72.1';
import {
  ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_RECEIPT_SCHEMA
} from './atmosphere-land-water-thermal.mjs?v=0.73.0-r73.1';

export const LAND_SNOW_THERMAL_STATE_SCHEMA =
  'axm.foundation-planet.land-snow-thermal-state/v1';
export const LAND_SNOW_THERMAL_STEP_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-snow-thermal-step-receipt/v1';
export const ATMOSPHERE_LAND_SNOW_THERMAL_RECEIPT_SCHEMA =
  'axm.foundation-planet.atmosphere-land-snow-thermal-receipt/v1';
export const LAND_SNOW_THERMAL_CLOSURE_SCHEMA =
  'axm.foundation-planet.land-snow-thermal-closure/v1';
export const LAND_SNOW_THERMAL_CLOSURE_POLICY_SCHEMA =
  'axm.foundation-planet.land-snow-thermal-closure-policy/v1';
export const LAND_SNOW_ICE_SPECIFIC_HEAT_J_KG_K = 2_108;
export const LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J = 1;
export const LAND_SNOW_THERMAL_ENERGY_ULP_FACTOR = 8;
export const LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM = 1e-9;
export const LAND_SNOW_THERMAL_WATER_ULP_FACTOR = 8;

const EARTH_CRYOSPHERE_PHASE_SCHEMA =
  'axm.foundation-planet.cryosphere-phase-receipt/v1';
const STANDARD_GRAVITY_MPS2 = 9.80665;
const MINIMUM_SNOW_TEMPERATURE_C = -80;
const MAXIMUM_SNOW_TEMPERATURE_C = 0;
const finite = (value, fallback = 0) => Number.isFinite(Number(value))
  ? Number(value) : fallback;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
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

function receiptDigestValid(receipt) {
  if (!receipt || typeof receipt.digest !== 'string') return false;
  const unsigned = clone(receipt);
  delete unsigned.digest;
  return stableDigest(unsigned) === receipt.digest;
}

function snowTemperature(value, fallback = 0) {
  return clamp(finite(value, fallback), MINIMUM_SNOW_TEMPERATURE_C,
    MAXIMUM_SNOW_TEMPERATURE_C);
}

function snowSensibleHeatJm2(waterMm, temperatureC) {
  return Math.max(0, finite(waterMm)) *
    LAND_SNOW_ICE_SPECIFIC_HEAT_J_KG_K *
    snowTemperature(temperatureC);
}

function owner(waterMm = 0, temperatureC = 0) {
  const trackedSnowWaterEquivalentMm = Math.max(0, finite(waterMm));
  const snowTemperatureC = snowTemperature(temperatureC);
  return {
    trackedSnowWaterEquivalentMm,
    sensibleHeatJm2: snowSensibleHeatJm2(
      trackedSnowWaterEquivalentMm, snowTemperatureC),
    snowTemperatureC
  };
}

function normalizeOwner(source, fallbackWaterMm = 0,
  fallbackTemperatureC = 0) {
  if (!source ||
      !Number.isFinite(Number(source.trackedSnowWaterEquivalentMm)) ||
      !Number.isFinite(Number(source.sensibleHeatJm2))) {
    return owner(fallbackWaterMm, fallbackTemperatureC);
  }
  const waterMm = Math.max(0,
    finite(source.trackedSnowWaterEquivalentMm));
  if (waterMm <= 1e-12) {
    return owner(0, source.snowTemperatureC ?? fallbackTemperatureC);
  }
  return owner(waterMm, finite(source.sensibleHeatJm2) /
    (waterMm * LAND_SNOW_ICE_SPECIFIC_HEAT_J_KG_K));
}

function stateTruth() {
  return {
    persistentLandSnowThermalOwner: true,
    snowfallSnowpackThermalReceiverCredited: true,
    snowmeltSensibleHeatSourceOwnerDebited: true,
    sublimationSensibleHeatSourceOwnerDebited: true,
    scaleAwareNumericClosure: true,
    measuredResidualsPreserved: true,
    fixedAbsoluteToleranceOnly: false,
    snowmeltLiquidReceiverSensibleHeatCredited: false,
    snowmeltColdContentWarmingOwnerDebited: false,
    latentHeatModeledByThisOrgan: false,
    resolvedSnowMicrophysics: false,
    scientificCalibrationClaimed: false
  };
}

function closure(kind, signedOperands) {
  const energy = kind === 'energy';
  const absoluteFloor = energy
    ? LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J
    : LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM;
  const ulpFactor = energy
    ? LAND_SNOW_THERMAL_ENERGY_ULP_FACTOR
    : LAND_SNOW_THERMAL_WATER_ULP_FACTOR;
  const unit = energy ? 'joules-per-square-metre' : 'millimetres-water';
  const operands = signedOperands.map(Number);
  const residual = operands.reduce((sum, value) => sum + value, 0);
  const numericTolerance = round(Math.max(absoluteFloor,
    operands.reduce((sum, value) => sum + Math.abs(value), 0) *
      Number.EPSILON * ulpFactor), 12);
  return {
    schema: LAND_SNOW_THERMAL_CLOSURE_SCHEMA,
    policy: {
      schema: LAND_SNOW_THERMAL_CLOSURE_POLICY_SCHEMA,
      kind,
      absoluteFloor,
      ulpFactor,
      scaleBasis:
        `sum-of-absolute-unrounded-signed-operands-${unit}`
    },
    signedOperands: operands,
    residual: Number(residual),
    numericTolerance,
    toleranceUtilization: round(Math.abs(residual) /
      numericTolerance, 12),
    closed: Math.abs(residual) <= numericTolerance,
    measuredResidualPreserved: true
  };
}

function addSnow(target, waterMm, temperatureC) {
  const addedWaterMm = Math.max(0, finite(waterMm));
  const addedHeatJm2 = snowSensibleHeatJm2(addedWaterMm,
    temperatureC);
  const finalWaterMm = target.trackedSnowWaterEquivalentMm +
    addedWaterMm;
  const finalHeatJm2 = target.sensibleHeatJm2 + addedHeatJm2;
  Object.assign(target, finalWaterMm > 1e-12
    ? owner(finalWaterMm, finalHeatJm2 /
      (finalWaterMm * LAND_SNOW_ICE_SPECIFIC_HEAT_J_KG_K))
    : owner(0, temperatureC));
  return {
    waterMm: Number(addedWaterMm),
    snowTemperatureC: Number(snowTemperature(temperatureC)),
    sensibleHeatJm2: Number(addedHeatJm2)
  };
}

function removeSnow(target, requestedWaterMm, transferId,
  destinationKind) {
  const requested = Math.max(0, finite(requestedWaterMm));
  const beforeWaterMm = target.trackedSnowWaterEquivalentMm;
  const beforeHeatJm2 = target.sensibleHeatJm2;
  const transferredWaterMm = Math.min(requested, beforeWaterMm);
  const fraction = beforeWaterMm > 1e-12
    ? transferredWaterMm / beforeWaterMm : 0;
  const sensibleHeatJm2 = beforeHeatJm2 * fraction;
  const temperatureC = beforeWaterMm > 1e-12
    ? snowTemperature(beforeHeatJm2 /
      (beforeWaterMm * LAND_SNOW_ICE_SPECIFIC_HEAT_J_KG_K))
    : target.snowTemperatureC;
  const finalWaterMm = beforeWaterMm - transferredWaterMm;
  const finalHeatJm2 = beforeHeatJm2 - sensibleHeatJm2;
  Object.assign(target, finalWaterMm > 1e-12
    ? owner(finalWaterMm, finalHeatJm2 /
      (finalWaterMm * LAND_SNOW_ICE_SPECIFIC_HEAT_J_KG_K))
    : owner(0, temperatureC));
  return {
    transferId,
    requestedWaterMm: Number(requested),
    transferredWaterMm: Number(transferredWaterMm),
    snowTemperatureC: Number(temperatureC),
    sensibleHeatJm2: Number(sensibleHeatJm2),
    sourceOwnerDebited: true,
    receiverOwnerCredited: false,
    destinationKind,
    requestedTransferAppliedExactly: Math.abs(
      transferredWaterMm - requested) <=
        LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM
  };
}

function nativeOwner(pressureColumn) {
  const layer = pressureColumn?.layers?.[0];
  if (!layer || !Number.isFinite(Number(layer.pressureThicknessHpa)) ||
      !Number.isFinite(Number(layer.airTemperatureC))) {
    throw new Error('Land snow thermal boundary requires native layer 0');
  }
  const dryAirMassKgM2 = Number(layer.pressureThicknessHpa) * 100 /
    STANDARD_GRAVITY_MPS2;
  const heatCapacityJm2K = dryAirMassKgM2 *
    PRESSURE_COLUMN_DRY_AIR_HEAT_CAPACITY_J_KG_K;
  return {
    layerId: String(layer.id),
    layerIndex: Number(layer.index),
    pressureThicknessHpa: Number(layer.pressureThicknessHpa),
    dryAirMassKgM2,
    heatCapacityJm2K,
    airTemperatureC: Number(layer.airTemperatureC),
    sensibleHeatJm2: heatCapacityJm2K * Number(layer.airTemperatureC)
  };
}

export function createLandSnowThermalState(snowWaterEquivalentMm = 0,
  snowTemperatureC = 0) {
  return {
    schema: LAND_SNOW_THERMAL_STATE_SCHEMA,
    migrationCheckpoint: false,
    migration: null,
    owner: owner(snowWaterEquivalentMm, snowTemperatureC),
    cumulativeSnowfallWaterMm: 0,
    cumulativeSnowmeltWaterMm: 0,
    cumulativeSublimationWaterMm: 0,
    lastStepReceipt: null,
    truth: stateTruth()
  };
}

export function normalizeLandSnowThermalState(source,
  snowWaterEquivalentMm = 0, fallbackTemperatureC = 0, options = {}) {
  if (source?.schema !== LAND_SNOW_THERMAL_STATE_SCHEMA) {
    const initialized = createLandSnowThermalState(
      snowWaterEquivalentMm, fallbackTemperatureC);
    initialized.migrationCheckpoint = true;
    initialized.migration = {
      status: 'initialized-current-snow-no-historical-heat',
      sourceEngineSchema: options.sourceEngineSchema || null,
      historicalHeatReconstructed: false,
      snowfallHistoryReconstructed: false
    };
    return initialized;
  }
  return {
    schema: LAND_SNOW_THERMAL_STATE_SCHEMA,
    migrationCheckpoint: source.migrationCheckpoint === true,
    migration: source.migration ? clone(source.migration) : null,
    owner: normalizeOwner(source.owner, snowWaterEquivalentMm,
      fallbackTemperatureC),
    cumulativeSnowfallWaterMm: Math.max(0,
      finite(source.cumulativeSnowfallWaterMm)),
    cumulativeSnowmeltWaterMm: Math.max(0,
      finite(source.cumulativeSnowmeltWaterMm)),
    cumulativeSublimationWaterMm: Math.max(0,
      finite(source.cumulativeSublimationWaterMm)),
    lastStepReceipt: source.lastStepReceipt?.schema ===
        LAND_SNOW_THERMAL_STEP_RECEIPT_SCHEMA &&
      receiptDigestValid(source.lastStepReceipt)
      ? clone(source.lastStepReceipt) : null,
    truth: stateTruth()
  };
}

export function advanceLandSnowThermal(source, context = {}) {
  const initialSnowWaterEquivalentMm = Math.max(0,
    finite(context.initialSnowWaterEquivalentMm));
  const finalSnowWaterEquivalentMm = Math.max(0,
    finite(context.finalSnowWaterEquivalentMm));
  const snowfallTemperatureC = snowTemperature(
    context.snowfallTemperatureC);
  const state = normalizeLandSnowThermalState(source,
    initialSnowWaterEquivalentMm, snowfallTemperatureC, context);
  if (Math.abs(state.owner.trackedSnowWaterEquivalentMm -
      initialSnowWaterEquivalentMm) >
        LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM) {
    throw new Error('Land snow thermal owner is detached from cryosphere water');
  }
  const migrationInitialization = state.migrationCheckpoint
    ? clone(state.migration) : null;
  state.migrationCheckpoint = false;
  const currentOwner = { ...state.owner };
  const initialOwner = clone(currentOwner);
  const stepId = String(context.stepId ||
    'unbound-land-snow-thermal-step');
  const snowfall = addSnow(currentOwner, context.snowfallMm,
    snowfallTemperatureC);
  const snowmelt = removeSnow(currentOwner, context.snowmeltMm,
    `${stepId}:snowmelt`, 'land-liquid-water-at-zero-celsius');
  const sublimation = removeSnow(currentOwner, context.sublimationMm,
    `${stepId}:sublimation`,
    'native-atmosphere-lowest-layer-sensible-heat-owner');
  if (Math.abs(currentOwner.trackedSnowWaterEquivalentMm -
      finalSnowWaterEquivalentMm) >
        LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM) {
    throw new Error('Land snow thermal flows do not bind final cryosphere water');
  }
  const finalOwner = clone(currentOwner);
  const waterClosure = closure('water', [
    finalOwner.trackedSnowWaterEquivalentMm,
    -initialOwner.trackedSnowWaterEquivalentMm,
    -snowfall.waterMm,
    snowmelt.transferredWaterMm,
    sublimation.transferredWaterMm
  ]);
  const energyClosure = closure('energy', [
    finalOwner.sensibleHeatJm2,
    -initialOwner.sensibleHeatJm2,
    -snowfall.sensibleHeatJm2,
    snowmelt.sensibleHeatJm2,
    sublimation.sensibleHeatJm2
  ]);
  const receipt = {
    schema: LAND_SNOW_THERMAL_STEP_RECEIPT_SCHEMA,
    stepId,
    status: snowfall.waterMm + snowmelt.transferredWaterMm +
      sublimation.transferredWaterMm >
        LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM
      ? 'land-snow-sensible-heat-advanced'
      : 'no-land-snow-boundary-transfer',
    migrationInitialization,
    snowfallTemperatureSource:
      'bounded-native-lowest-atmosphere-layer-temperature-proxy',
    initialOwner,
    finalOwner,
    snowfallInput: snowfall,
    snowmeltOutput: snowmelt,
    sublimationOutput: sublimation,
    waterClosure,
    energyClosure,
    unresolvedSnowmeltColdContent: {
      snowmeltWaterMm: Number(snowmelt.transferredWaterMm),
      snowpackSourceSensibleHeatJm2: Number(snowmelt.sensibleHeatJm2),
      liquidReceiverTemperatureC: 0,
      liquidReceiverSensibleHeatJm2: 0,
      coldContentWarmingRequiredJm2:
        Number(-snowmelt.sensibleHeatJm2),
      warmingEnergyOwnerDebited: false,
      liquidReceiverCredited: false,
      status: snowmelt.transferredWaterMm >
        LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM
        ? 'unresolved' : 'not-exercised'
    },
    truth: {
      ...stateTruth(),
      migrationInventedHistoricalHeat: false,
      ownerWaterBoundToCryosphere: true,
      requestedTransfersAppliedExactly:
        snowmelt.requestedTransferAppliedExactly &&
        sublimation.requestedTransferAppliedExactly,
      waterClosureClosed: waterClosure.closed,
      energyClosureClosed: energyClosure.closed
    }
  };
  receipt.digest = stableDigest(receipt);
  state.owner = finalOwner;
  state.cumulativeSnowfallWaterMm += snowfall.waterMm;
  state.cumulativeSnowmeltWaterMm += snowmelt.transferredWaterMm;
  state.cumulativeSublimationWaterMm +=
    sublimation.transferredWaterMm;
  state.lastStepReceipt = clone(receipt);
  state.truth = stateTruth();
  return {
    state: normalizeLandSnowThermalState(state,
      finalSnowWaterEquivalentMm, finalOwner.snowTemperatureC),
    receipt: clone(receipt)
  };
}

export function coupleAtmosphereLandSnowThermal(column,
  pressureDynamicsReceipt, cryospherePhaseReceipt,
  landHydrologyThermalReceipt, liquidBoundaryReceipt,
  snowThermalReceipt, context = {}) {
  if (column?.kind !== 'land' ||
      column?.atmosphere?.pressureColumn?.schema !==
        ATMOSPHERE_PRESSURE_COLUMN_SCHEMA) {
    throw new Error('Land snow thermal coupling requires a land column with a native atmosphere');
  }
  if (pressureDynamicsReceipt?.schema !==
      ATMOSPHERE_PRESSURE_COLUMN_DYNAMICS_SCHEMA ||
      cryospherePhaseReceipt?.schema !== EARTH_CRYOSPHERE_PHASE_SCHEMA ||
      landHydrologyThermalReceipt?.schema !==
        LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA ||
      !receiptDigestValid(landHydrologyThermalReceipt) ||
      liquidBoundaryReceipt?.schema !==
        ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_RECEIPT_SCHEMA ||
      !receiptDigestValid(liquidBoundaryReceipt) ||
      snowThermalReceipt?.schema !==
        LAND_SNOW_THERMAL_STEP_RECEIPT_SCHEMA ||
      !receiptDigestValid(snowThermalReceipt)) {
    throw new Error('Land snow thermal coupling requires intact current source receipts');
  }
  const snowfall = snowThermalReceipt.snowfallInput;
  const snowmelt = snowThermalReceipt.snowmeltOutput;
  const sublimation = snowThermalReceipt.sublimationOutput;
  const bindingsValid = Math.abs(Number(snowfall.waterMm) -
      finite(pressureDynamicsReceipt.surfaceSnowfallMm)) <=
        LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM &&
    Math.abs(Number(snowfall.waterMm) -
      finite(cryospherePhaseReceipt.snowfallMm)) <=
        LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM &&
    Math.abs(Number(snowmelt.transferredWaterMm) -
      finite(cryospherePhaseReceipt.snowmeltMm)) <=
        LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM &&
    Math.abs(Number(sublimation.transferredWaterMm) -
      finite(cryospherePhaseReceipt.snowSublimationMm)) <=
        LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM &&
    Math.abs(Number(snowmelt.transferredWaterMm) -
      finite(landHydrologyThermalReceipt.externalInputs?.snowmelt
        ?.waterMm)) <= LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM;
  if (!bindingsValid) {
    throw new Error('Land snow thermal source receipts are detached');
  }
  const initialOwner = nativeOwner(column.atmosphere.pressureColumn);
  const liquidFinalOwner = liquidBoundaryReceipt.finalNativeAtmosphereOwner;
  if (Math.abs(initialOwner.airTemperatureC -
      Number(liquidFinalOwner?.airTemperatureC)) > 1e-12 ||
      Math.abs(initialOwner.sensibleHeatJm2 -
      Number(liquidFinalOwner?.sensibleHeatJm2)) >
        LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) {
    throw new Error('Land snow thermal boundary is detached from liquid boundary owner');
  }
  const initialTotals = pressureColumnTotals(
    column.atmosphere.pressureColumn);
  const netAtmosphereSensibleHeatJm2 =
    Number(sublimation.sensibleHeatJm2) -
    Number(snowfall.sensibleHeatJm2);
  const requestedFinalAirTemperatureC = initialOwner.airTemperatureC +
    netAtmosphereSensibleHeatJm2 / initialOwner.heatCapacityJm2K;
  if (requestedFinalAirTemperatureC <
        MIN_NATIVE_LAYER_AIR_TEMPERATURE_C ||
      requestedFinalAirTemperatureC >
        MAX_NATIVE_LAYER_AIR_TEMPERATURE_C) {
    throw new Error('Land snow sensible-heat transfer exceeds native thermal headroom');
  }
  column.atmosphere.pressureColumn.layers[0].airTemperatureC =
    requestedFinalAirTemperatureC;
  applyPressureColumnProjectionToLegacy(column);
  const finalOwner = nativeOwner(column.atmosphere.pressureColumn);
  const finalTotals = pressureColumnTotals(column.atmosphere.pressureColumn);
  const ownerEnergyClosure = closure('energy', [
    finalOwner.sensibleHeatJm2,
    -initialOwner.sensibleHeatJm2,
    snowfall.sensibleHeatJm2,
    -sublimation.sensibleHeatJm2
  ]);
  const nativeMoistEnthalpyClosure = closure('energy', [
    finalTotals.moistEnthalpyJm2,
    -initialTotals.moistEnthalpyJm2,
    snowfall.sensibleHeatJm2,
    -sublimation.sensibleHeatJm2
  ]);
  if (!ownerEnergyClosure.closed || !nativeMoistEnthalpyClosure.closed) {
    throw new Error('Land snow atmosphere sensible-heat owner did not close');
  }
  const stepId = String(context.stepId ||
    `${snowThermalReceipt.stepId}:atmosphere-boundary`);
  const receipt = {
    schema: ATMOSPHERE_LAND_SNOW_THERMAL_RECEIPT_SCHEMA,
    stepId,
    status: snowfall.waterMm + sublimation.transferredWaterMm >
      LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM
      ? 'frozen-water-atmosphere-sensible-heat-transferred'
      : 'no-frozen-water-atmosphere-transfer',
    sourcePressureDynamics: {
      schema: pressureDynamicsReceipt.schema,
      receiptDigest: stableDigest(pressureDynamicsReceipt),
      surfaceSnowfallMm: Number(
        pressureDynamicsReceipt.surfaceSnowfallMm)
    },
    sourceCryospherePhase: {
      schema: cryospherePhaseReceipt.schema,
      receiptDigest: stableDigest(cryospherePhaseReceipt),
      snowfallMm: Number(cryospherePhaseReceipt.snowfallMm),
      snowmeltMm: Number(cryospherePhaseReceipt.snowmeltMm),
      snowSublimationMm: Number(
        cryospherePhaseReceipt.snowSublimationMm)
    },
    sourceLandHydrologyThermal: {
      schema: landHydrologyThermalReceipt.schema,
      receiptDigest: landHydrologyThermalReceipt.digest,
      stepId: landHydrologyThermalReceipt.stepId
    },
    sourceLiquidWaterThermalBoundary: {
      schema: liquidBoundaryReceipt.schema,
      receiptDigest: liquidBoundaryReceipt.digest,
      stepId: liquidBoundaryReceipt.stepId
    },
    sourceLandSnowThermal: {
      schema: snowThermalReceipt.schema,
      receiptDigest: snowThermalReceipt.digest,
      stepId: snowThermalReceipt.stepId
    },
    initialNativeAtmosphereOwner: initialOwner,
    finalNativeAtmosphereOwner: finalOwner,
    initialNativeMoistEnthalpyJm2: Number(
      initialTotals.moistEnthalpyJm2),
    finalNativeMoistEnthalpyJm2: Number(
      finalTotals.moistEnthalpyJm2),
    snowfallTransfer: {
      transferId: `${stepId}:snowfall`,
      waterMm: Number(snowfall.waterMm),
      snowTemperatureC: Number(snowfall.snowTemperatureC),
      sensibleHeatJm2: Number(snowfall.sensibleHeatJm2),
      sourceKind:
        'native-atmosphere-lowest-layer-sensible-heat-owner',
      destinationKind: 'persistent-land-snow-thermal-owner',
      sourceOwnerDebited: true,
      receiverOwnerCredited: true
    },
    sublimationTransfer: {
      transferId: `${stepId}:sublimation`,
      waterMm: Number(sublimation.transferredWaterMm),
      snowTemperatureC: Number(sublimation.snowTemperatureC),
      sensibleHeatJm2: Number(sublimation.sensibleHeatJm2),
      sourceKind: 'persistent-land-snow-thermal-owner',
      destinationKind:
        'native-atmosphere-lowest-layer-sensible-heat-owner',
      sourceOwnerDebited: true,
      receiverOwnerCredited: true
    },
    snowmeltTransfer: {
      transferId: snowmelt.transferId,
      waterMm: Number(snowmelt.transferredWaterMm),
      snowTemperatureC: Number(snowmelt.snowTemperatureC),
      sensibleHeatJm2: Number(snowmelt.sensibleHeatJm2),
      sourceOwnerDebited: true,
      liquidReceiverCredited: false,
      coldContentWarmingOwnerDebited: false
    },
    unresolvedSnowmeltColdContent: clone(
      snowThermalReceipt.unresolvedSnowmeltColdContent),
    netAtmosphereSensibleHeatJm2:
      Number(netAtmosphereSensibleHeatJm2),
    ownerEnergyClosure,
    nativeMoistEnthalpyClosure,
    truth: {
      persistentLandSnowThermalOwner: true,
      snowfallSensibleHeatSenderOwnerDebited: true,
      snowfallSnowpackThermalReceiverCredited: true,
      sublimationSensibleHeatSourceOwnerDebited: true,
      sublimationAtmosphereThermalReceiverCredited: true,
      snowmeltSensibleHeatSourceOwnerDebited: true,
      snowmeltLiquidReceiverSensibleHeatCredited: false,
      snowmeltColdContentWarmingOwnerDebited: false,
      nativeAtmosphereThermalOwnerClosed: true,
      nativeMoistEnthalpyAdjustmentClosed: true,
      nativeThermalEnvelopeRespected: true,
      sourceReceiptsExactlyBound: true,
      scaleAwareNumericClosure: true,
      measuredResidualsPreserved: true,
      fixedAbsoluteToleranceOnly: false,
      latentHeatModeledByThisOrgan: false,
      resolvedSnowMicrophysics: false,
      resolvedSnowfallTemperature: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  receipt.digest = stableDigest(receipt);
  column.atmosphere.lastLandSnowThermalBoundaryReceipt = clone(receipt);
  return clone(receipt);
}

export function landSnowThermalDescription() {
  return {
    stateSchema: LAND_SNOW_THERMAL_STATE_SCHEMA,
    stepReceiptSchema: LAND_SNOW_THERMAL_STEP_RECEIPT_SCHEMA,
    boundaryReceiptSchema: ATMOSPHERE_LAND_SNOW_THERMAL_RECEIPT_SCHEMA,
    closureSchema: LAND_SNOW_THERMAL_CLOSURE_SCHEMA,
    closurePolicySchema: LAND_SNOW_THERMAL_CLOSURE_POLICY_SCHEMA,
    iceSpecificHeatJKgK: LAND_SNOW_ICE_SPECIFIC_HEAT_J_KG_K,
    snowfallTemperatureSource:
      'bounded-native-lowest-atmosphere-layer-temperature-proxy',
    truth: {
      ...stateTruth(),
      snowfallSensibleHeatSenderOwnerDebited: true,
      sublimationAtmosphereThermalReceiverCredited: true,
      resolvedSnowfallTemperature: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
}
