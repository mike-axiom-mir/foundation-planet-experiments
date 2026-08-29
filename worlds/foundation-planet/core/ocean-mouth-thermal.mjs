import {
  RIVER_THERMAL_TRANSFER_SCHEMA,
  RIVER_WATER_SPECIFIC_HEAT_J_KG_K
} from './river-thermal.mjs?v=0.67.0-r67.1';

export const OCEAN_MOUTH_THERMAL_RECEIPT_SCHEMA =
  'axm.foundation-planet.ocean-mouth-thermal-receipt/v1';
export const OCEAN_MOUTH_THERMAL_ENERGY_CLOSURE_SCHEMA =
  'axm.foundation-planet.ocean-mouth-thermal-energy-closure/v1';
export const OCEAN_MOUTH_THERMAL_ENERGY_CLOSURE_POLICY_SCHEMA =
  'axm.foundation-planet.ocean-mouth-thermal-energy-closure-policy/v1';
export const OCEAN_MIXED_LAYER_VOLUMETRIC_HEAT_CAPACITY_J_M3_K =
  4.186e6;
export const OCEAN_MOUTH_THERMAL_ENERGY_ABSOLUTE_FLOOR_J = 1;
export const OCEAN_MOUTH_THERMAL_ENERGY_ULP_FACTOR = 8;

const finite = (value, fallback = 0) => Number.isFinite(Number(value))
  ? Number(value) : fallback;
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

export function oceanMouthThermalEnergyToleranceJ(
  signedOperandsJ = []) {
  const absoluteOperandSumJ = signedOperandsJ.reduce((sum, operand) =>
    sum + Math.abs(finite(operand)), 0);
  return round(Math.max(
    OCEAN_MOUTH_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    absoluteOperandSumJ * Number.EPSILON *
      OCEAN_MOUTH_THERMAL_ENERGY_ULP_FACTOR
  ), 12);
}

function energyClosure(signedOperandsJ) {
  const residualJ = signedOperandsJ.reduce((sum, operand) =>
    sum + finite(operand), 0);
  const numericToleranceJ = oceanMouthThermalEnergyToleranceJ(
    signedOperandsJ);
  const toleranceUtilization = round(
    Math.abs(residualJ) / numericToleranceJ, 12);
  return {
    schema: OCEAN_MOUTH_THERMAL_ENERGY_CLOSURE_SCHEMA,
    policy: {
      schema: OCEAN_MOUTH_THERMAL_ENERGY_CLOSURE_POLICY_SCHEMA,
      absoluteFloorJ: OCEAN_MOUTH_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
      ulpFactor: OCEAN_MOUTH_THERMAL_ENERGY_ULP_FACTOR,
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

function truth() {
  return {
    persistentOceanMixedLayerHeatOwner: true,
    exactRiverMouthSensibleHeatCredit: true,
    exactRiverMouthTransferId: true,
    sourceRiverThermalOwnerDebited: true,
    oceanReceiverThermalOwnerCredited: true,
    scaleAwareNumericEnergyClosure: true,
    measuredEnergyResidualPreserved: true,
    fixedAbsoluteEnergyToleranceOnly: false,
    fixedDepthMixedLayerHeatCapacity: true,
    riverWaterChangesMixedLayerHeatCapacity: false,
    resolvedMixedLayerDisplacement: false,
    resolvedMixedLayerEntrainment: false,
    resolvedVerticalOceanHeatTransport: false,
    resolvedFreezeThawState: false,
    latentHeatModeled: false,
    scientificCalibrationClaimed: false
  };
}

export function creditOceanMouthThermalOwner(oceanSource,
  surfaceTemperatureSource, transferSource, context = {}) {
  const ocean = oceanSource || {};
  const transfer = clone(transferSource || {});
  const destinationCellId = String(context.destinationCellId ||
    transfer.destinationId || '');
  const sourceReachId = String(context.sourceReachId ||
    transfer.sourceId || '');
  const areaM2 = finite(context.areaM2);
  const mixedLayerDepthM = finite(ocean.mixedLayerDepthM);
  if (!(areaM2 > 0) || !(mixedLayerDepthM > 0)) {
    throw new Error('Ocean mouth thermal credit requires positive area and mixed-layer depth');
  }
  if (transfer.schema !== RIVER_THERMAL_TRANSFER_SCHEMA ||
      transfer.kind !== 'river-to-ocean-mouth' ||
      !transfer.transferId) {
    throw new Error('Ocean mouth thermal credit requires a typed river-mouth transfer');
  }
  const heatCapacityJm2K =
    OCEAN_MIXED_LAYER_VOLUMETRIC_HEAT_CAPACITY_J_M3_K *
      mixedLayerDepthM;
  const heatCapacityJPerK = heatCapacityJm2K * areaM2;
  const initialWaterTemperatureC = finite(
    ocean.mixedLayerTemperatureC, finite(surfaceTemperatureSource, 15));
  const initialHeatContentJm2 = Number.isFinite(Number(
    ocean.heatContentJm2))
    ? Number(ocean.heatContentJm2)
    : initialWaterTemperatureC * heatCapacityJm2K;
  const initialSensibleHeatJ = initialHeatContentJm2 * areaM2;
  const riverWaterKg = Math.max(0, finite(transfer.waterKg));
  const riverWaterTemperatureC = finite(
    transfer.waterTemperatureC, 15);
  const creditedRiverSensibleHeatJ = finite(transfer.sensibleHeatJ);
  const independentlyRecomputedRiverSensibleHeatJ = riverWaterKg *
    RIVER_WATER_SPECIFIC_HEAT_J_KG_K * riverWaterTemperatureC;
  const transferHeatResidualJ = creditedRiverSensibleHeatJ -
    independentlyRecomputedRiverSensibleHeatJ;
  const transferHeatToleranceJ = oceanMouthThermalEnergyToleranceJ([
    creditedRiverSensibleHeatJ,
    -independentlyRecomputedRiverSensibleHeatJ
  ]);
  const finalSensibleHeatJ = initialSensibleHeatJ +
    creditedRiverSensibleHeatJ;
  const finalWaterTemperatureC = finalSensibleHeatJ /
    heatCapacityJPerK;
  const finalHeatContentJm2 = finalSensibleHeatJ / areaM2;
  const closure = energyClosure([
    finalSensibleHeatJ,
    -initialSensibleHeatJ,
    -creditedRiverSensibleHeatJ
  ]);
  const receipt = {
    schema: OCEAN_MOUTH_THERMAL_RECEIPT_SCHEMA,
    transferId: String(transfer.transferId),
    sourceReachId,
    destinationCellId,
    receiver: {
      kind: 'earth-system-ocean-mixed-layer',
      areaM2: Number(areaM2),
      mixedLayerDepthM: Number(mixedLayerDepthM),
      volumetricHeatCapacityJm3K:
        OCEAN_MIXED_LAYER_VOLUMETRIC_HEAT_CAPACITY_J_M3_K,
      heatCapacityJm2K: Number(heatCapacityJm2K),
      heatCapacityJPerK: Number(heatCapacityJPerK),
      initialWaterTemperatureC: Number(initialWaterTemperatureC),
      initialHeatContentJm2: Number(initialHeatContentJm2),
      initialSensibleHeatJ: Number(initialSensibleHeatJ),
      finalWaterTemperatureC: Number(finalWaterTemperatureC),
      finalHeatContentJm2: Number(finalHeatContentJm2),
      finalSensibleHeatJ: Number(finalSensibleHeatJ)
    },
    riverInput: {
      schema: transfer.schema,
      waterKg: Number(riverWaterKg),
      waterTemperatureC: Number(riverWaterTemperatureC),
      creditedSensibleHeatJ: Number(creditedRiverSensibleHeatJ),
      independentlyRecomputedSensibleHeatJ:
        Number(independentlyRecomputedRiverSensibleHeatJ),
      heatResidualJ: Number(transferHeatResidualJ),
      heatToleranceJ: Number(transferHeatToleranceJ),
      sourceProjectionDigest: transfer.sourceProjectionDigest || null,
      sourceThermalOwnerDebited:
        transfer.sourceThermalOwnerDebited === true
    },
    energyClosure: closure,
    truth: {
      ...truth(),
      transferHeatMatchesWaterAndTemperature:
        Math.abs(transferHeatResidualJ) <= transferHeatToleranceJ,
      sourceRiverThermalOwnerDebited:
        transfer.sourceThermalOwnerDebited === true,
      receiverEnergyClosureClosed: closure.conservationClosed
    }
  };
  receipt.digest = stableDigest(receipt);
  return {
    receiverState: {
      mixedLayerTemperatureC: Number(finalWaterTemperatureC),
      heatContentJm2: Number(finalHeatContentJm2),
      surfaceTemperatureC: Number(finalWaterTemperatureC)
    },
    receipt: clone(receipt)
  };
}

export function oceanMouthThermalDescription() {
  return {
    receiptSchema: OCEAN_MOUTH_THERMAL_RECEIPT_SCHEMA,
    energyClosureSchema: OCEAN_MOUTH_THERMAL_ENERGY_CLOSURE_SCHEMA,
    energyClosurePolicy: {
      schema: OCEAN_MOUTH_THERMAL_ENERGY_CLOSURE_POLICY_SCHEMA,
      absoluteFloorJ: OCEAN_MOUTH_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
      ulpFactor: OCEAN_MOUTH_THERMAL_ENERGY_ULP_FACTOR,
      scaleBasis: 'sum-of-absolute-unrounded-signed-operands-joules'
    },
    volumetricHeatCapacityJm3K:
      OCEAN_MIXED_LAYER_VOLUMETRIC_HEAT_CAPACITY_J_M3_K,
    processes: [
      'exact-river-mouth-sensible-heat-credit',
      'persistent-loaded-ocean-mixed-layer-heat-owner',
      'fixed-depth-mixed-layer-temperature-response'
    ],
    truth: truth()
  };
}
