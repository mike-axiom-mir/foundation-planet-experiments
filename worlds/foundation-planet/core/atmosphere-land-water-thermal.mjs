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
  LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA,
  LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K
} from './land-hydrology-thermal.mjs?v=0.72.0-r72.1';

export const ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_RECEIPT_SCHEMA =
  'axm.foundation-planet.atmosphere-land-liquid-water-thermal-receipt/v1';
export const ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_CLOSURE_SCHEMA =
  'axm.foundation-planet.atmosphere-land-liquid-water-thermal-closure/v1';
export const ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_CLOSURE_POLICY_SCHEMA =
  'axm.foundation-planet.atmosphere-land-liquid-water-thermal-closure-policy/v1';
export const ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_ENERGY_ABSOLUTE_FLOOR_J = 1;
export const ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_ENERGY_ULP_FACTOR = 8;
export const ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_WATER_TOLERANCE_MM = 1e-9;

const STANDARD_GRAVITY_MPS2 = 9.80665;
const finite = (value, fallback = 0) => Number.isFinite(Number(value))
  ? Number(value) : fallback;
const round = (value, digits = 12) =>
  Number(Number(value).toFixed(digits));
const clone = value => JSON.parse(JSON.stringify(value));

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

function energyClosure(signedOperandsJm2) {
  const operands = signedOperandsJm2.map(Number);
  const residualJm2 = operands.reduce((sum, value) => sum + value, 0);
  const absoluteOperandSumJm2 = operands.reduce((sum, value) =>
    sum + Math.abs(value), 0);
  const numericToleranceJm2 = round(Math.max(
    ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    absoluteOperandSumJm2 * Number.EPSILON *
      ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_ENERGY_ULP_FACTOR
  ));
  return {
    schema: ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_CLOSURE_SCHEMA,
    policy: {
      schema:
        ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_CLOSURE_POLICY_SCHEMA,
      absoluteFloorJm2:
        ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
      ulpFactor:
        ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_ENERGY_ULP_FACTOR,
      scaleBasis:
        'sum-of-absolute-unrounded-signed-operands-joules-per-square-metre'
    },
    signedOperandsJm2: operands,
    residualJm2: Number(residualJm2),
    numericToleranceJm2,
    toleranceUtilization: round(Math.abs(residualJm2) /
      numericToleranceJm2),
    closed: Math.abs(residualJm2) <= numericToleranceJm2,
    measuredResidualPreserved: true
  };
}

function nativeOwner(pressureColumn) {
  const layer = pressureColumn?.layers?.[0];
  if (!layer || !Number.isFinite(Number(layer.pressureThicknessHpa)) ||
      !Number.isFinite(Number(layer.airTemperatureC))) {
    throw new Error('Atmosphere-land thermal boundary requires native layer 0');
  }
  const dryAirMassKgM2 = Number(layer.pressureThicknessHpa) * 100 /
    STANDARD_GRAVITY_MPS2;
  const airTemperatureC = Number(layer.airTemperatureC);
  return {
    layerId: String(layer.id),
    layerIndex: Number(layer.index),
    pressureThicknessHpa: Number(layer.pressureThicknessHpa),
    dryAirMassKgM2,
    heatCapacityJm2K: dryAirMassKgM2 *
      PRESSURE_COLUMN_DRY_AIR_HEAT_CAPACITY_J_KG_K,
    airTemperatureC,
    sensibleHeatJm2: dryAirMassKgM2 *
      PRESSURE_COLUMN_DRY_AIR_HEAT_CAPACITY_J_KG_K * airTemperatureC
  };
}

function thermalTransfer({ transferId, waterMm, waterTemperatureC,
  sensibleHeatJm2, sourceKind, destinationKind }) {
  return {
    transferId,
    waterMm: Number(waterMm),
    waterTemperatureC: Number(waterTemperatureC),
    sensibleHeatJm2: Number(sensibleHeatJm2),
    sourceKind,
    destinationKind,
    sourceOwnerDebited: true,
    receiverOwnerCredited: true
  };
}

export function coupleAtmosphereLandLiquidWaterThermal(column,
  pressureDynamicsReceipt, landHydrologyThermalReceipt, context = {}) {
  if (column?.kind !== 'land' ||
      column?.atmosphere?.pressureColumn?.schema !==
        ATMOSPHERE_PRESSURE_COLUMN_SCHEMA) {
    throw new Error('Atmosphere-land liquid thermal coupling requires a land column with a native atmosphere');
  }
  if (pressureDynamicsReceipt?.schema !==
      ATMOSPHERE_PRESSURE_COLUMN_DYNAMICS_SCHEMA) {
    throw new Error('Atmosphere-land liquid thermal coupling requires the current pressure-dynamics receipt');
  }
  if (landHydrologyThermalReceipt?.schema !==
      LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA ||
      !receiptDigestValid(landHydrologyThermalReceipt)) {
    throw new Error('Atmosphere-land liquid thermal coupling requires an intact land thermal receipt');
  }

  const rainfall = landHydrologyThermalReceipt.externalInputs?.rainfall;
  const evaporation = landHydrologyThermalReceipt.externalOutputs?.evaporation;
  const rainfallWaterMm = Math.max(0, finite(rainfall?.waterMm));
  const rainfallTemperatureC = finite(rainfall?.waterTemperatureC);
  const rainfallSensibleHeatJm2 = finite(rainfall?.sensibleHeatJm2);
  const evaporationWaterMm = Math.max(0, finite(evaporation?.waterMm));
  const evaporationTemperatureC = finite(evaporation?.waterTemperatureC);
  const evaporationSensibleHeatJm2 = finite(evaporation?.sensibleHeatJm2);
  const expectedRainfallHeatJm2 = rainfallWaterMm *
    LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K * rainfallTemperatureC;
  const expectedEvaporationHeatJm2 = evaporationWaterMm *
    LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K * evaporationTemperatureC;
  const rainfallWaterBound = Math.abs(rainfallWaterMm -
    finite(pressureDynamicsReceipt.surfaceRainfallMm)) <=
      ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_WATER_TOLERANCE_MM;
  const rainfallHeatBound = Math.abs(rainfallSensibleHeatJm2 -
    expectedRainfallHeatJm2) <=
      ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_ENERGY_ABSOLUTE_FLOOR_J;
  const evaporationHeatBound = Math.abs(evaporationSensibleHeatJm2 -
    expectedEvaporationHeatJm2) <=
      ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_ENERGY_ABSOLUTE_FLOOR_J;
  if (!rainfallWaterBound || !rainfallHeatBound || !evaporationHeatBound) {
    throw new Error('Atmosphere-land liquid thermal source receipts are not exactly bound');
  }

  const initialOwner = nativeOwner(column.atmosphere.pressureColumn);
  const initialTotals = pressureColumnTotals(
    column.atmosphere.pressureColumn);
  const netAtmosphereSensibleHeatJm2 = evaporationSensibleHeatJm2 -
    rainfallSensibleHeatJm2;
  const requestedFinalAirTemperatureC = initialOwner.airTemperatureC +
    netAtmosphereSensibleHeatJm2 / initialOwner.heatCapacityJm2K;
  if (requestedFinalAirTemperatureC <
        MIN_NATIVE_LAYER_AIR_TEMPERATURE_C ||
      requestedFinalAirTemperatureC >
        MAX_NATIVE_LAYER_AIR_TEMPERATURE_C) {
    throw new Error('Atmosphere-land liquid sensible-heat transfer exceeds native thermal headroom');
  }
  column.atmosphere.pressureColumn.layers[0].airTemperatureC =
    requestedFinalAirTemperatureC;
  applyPressureColumnProjectionToLegacy(column);
  const finalOwner = nativeOwner(column.atmosphere.pressureColumn);
  const finalTotals = pressureColumnTotals(column.atmosphere.pressureColumn);
  const ownerEnergyClosure = energyClosure([
    finalOwner.sensibleHeatJm2,
    -initialOwner.sensibleHeatJm2,
    rainfallSensibleHeatJm2,
    -evaporationSensibleHeatJm2
  ]);
  const nativeMoistEnthalpyClosure = energyClosure([
    finalTotals.moistEnthalpyJm2,
    -initialTotals.moistEnthalpyJm2,
    rainfallSensibleHeatJm2,
    -evaporationSensibleHeatJm2
  ]);
  if (!ownerEnergyClosure.closed || !nativeMoistEnthalpyClosure.closed) {
    throw new Error('Atmosphere-land liquid sensible-heat owner did not close');
  }
  const stepId = String(context.stepId ||
    `${landHydrologyThermalReceipt.stepId}:atmosphere-land-liquid`);
  const rainfallTransfer = thermalTransfer({
    transferId: `${stepId}:rainfall`,
    waterMm: rainfallWaterMm,
    waterTemperatureC: rainfallTemperatureC,
    sensibleHeatJm2: rainfallSensibleHeatJm2,
    sourceKind: 'native-atmosphere-lowest-layer-sensible-heat-owner',
    destinationKind: 'land-surface-ponded-thermal-owner'
  });
  const evaporationTransfer = thermalTransfer({
    transferId: `${stepId}:liquid-evaporation`,
    waterMm: evaporationWaterMm,
    waterTemperatureC: evaporationTemperatureC,
    sensibleHeatJm2: evaporationSensibleHeatJm2,
    sourceKind: 'land-surface-and-root-water-thermal-owners',
    destinationKind: 'native-atmosphere-lowest-layer-sensible-heat-owner'
  });
  const receipt = {
    schema: ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_RECEIPT_SCHEMA,
    stepId,
    status: rainfallWaterMm + evaporationWaterMm >
      ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_WATER_TOLERANCE_MM
      ? 'liquid-water-sensible-heat-transferred'
      : 'no-liquid-water-boundary-transfer',
    sourcePressureDynamics: {
      schema: pressureDynamicsReceipt.schema,
      receiptDigest: stableDigest(pressureDynamicsReceipt),
      surfaceRainfallMm: Number(pressureDynamicsReceipt.surfaceRainfallMm),
      surfaceSnowfallMm: Number(pressureDynamicsReceipt.surfaceSnowfallMm)
    },
    sourceLandHydrologyThermal: {
      schema: landHydrologyThermalReceipt.schema,
      receiptDigest: landHydrologyThermalReceipt.digest,
      stepId: landHydrologyThermalReceipt.stepId
    },
    initialNativeAtmosphereOwner: initialOwner,
    finalNativeAtmosphereOwner: finalOwner,
    initialNativeMoistEnthalpyJm2: Number(initialTotals.moistEnthalpyJm2),
    finalNativeMoistEnthalpyJm2: Number(finalTotals.moistEnthalpyJm2),
    rainfallTransfer,
    evaporationTransfer,
    netAtmosphereSensibleHeatJm2: Number(netAtmosphereSensibleHeatJm2),
    ownerEnergyClosure,
    nativeMoistEnthalpyClosure,
    truth: {
      liquidRainfallAtmosphereThermalSenderOwnerDebited: true,
      liquidRainfallLandThermalReceiverOwnerCredited: true,
      liquidLandEvaporationThermalSenderOwnerDebited: true,
      liquidLandEvaporationAtmosphereThermalReceiverOwnerCredited: true,
      rainfallWaterAndHeatBoundToPressureAndLandReceipts: true,
      evaporationWaterAndHeatBoundToLandReceipt: true,
      nativeAtmosphereThermalOwnerClosed: true,
      nativeMoistEnthalpyAdjustmentClosed: true,
      nativeThermalEnvelopeRespected: true,
      measuredResidualsPreserved: true,
      scaleAwareNumericClosure: true,
      fixedAbsoluteToleranceOnly: false,
      snowfallSensibleHeatSenderOwnerDebited: false,
      snowmeltSensibleHeatSenderOwnerDebited: false,
      sublimationSensibleHeatSourceOwnerDebited: false,
      latentHeatModeledByThisOrgan: false,
      resolvedDropletThermodynamics: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  receipt.digest = stableDigest(receipt);
  column.atmosphere.lastLandWaterThermalBoundaryReceipt = clone(receipt);
  return clone(receipt);
}

export function atmosphereLandLiquidWaterThermalDescription() {
  return {
    receiptSchema:
      ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_RECEIPT_SCHEMA,
    closureSchema:
      ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_CLOSURE_SCHEMA,
    closurePolicySchema:
      ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_CLOSURE_POLICY_SCHEMA,
    waterSpecificHeatJKgK:
      LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K,
    nativeOwner: 'lowest-pressure-layer-dry-air-sensible-heat',
    truth: {
      liquidRainfallAtmosphereThermalSenderOwnerDebited: true,
      liquidLandEvaporationAtmosphereThermalReceiverOwnerCredited: true,
      snowfallSensibleHeatSenderOwnerDebited: false,
      snowmeltSensibleHeatSenderOwnerDebited: false,
      sublimationSensibleHeatSourceOwnerDebited: false,
      latentHeatModeledByThisOrgan: false,
      resolvedDropletThermodynamics: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
}
