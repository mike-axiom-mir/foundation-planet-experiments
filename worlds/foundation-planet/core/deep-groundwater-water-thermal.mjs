import {
  LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA,
  LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K,
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR,
  LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM
} from './land-hydrology-thermal.mjs?v=0.79.0-r79.1';
import {
  LAND_ROOT_DEEP_WATER_THERMAL_RECEIPT_SCHEMA,
  landRootDeepWaterThermalReceiptValid
} from './root-deep-water-thermal.mjs?v=0.79.0-r79.1';

export const LAND_DEEP_GROUNDWATER_WATER_THERMAL_PROPOSAL_SCHEMA =
  'axm.foundation-planet.land-deep-groundwater-water-thermal-proposal/v1';
export const LAND_DEEP_GROUNDWATER_WATER_THERMAL_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-deep-groundwater-water-thermal-receipt/v1';
export const LAND_DEEP_GROUNDWATER_WATER_THERMAL_CLOSURE_SCHEMA =
  'axm.foundation-planet.land-deep-groundwater-water-thermal-closure/v1';
export const LAND_DEEP_GROUNDWATER_WATER_THERMAL_CLOSURE_POLICY_SCHEMA =
  'axm.foundation-planet.land-deep-groundwater-water-thermal-closure-policy/v1';
export const LAND_DEEP_GROUNDWATER_WATER_THERMAL_RESPONSE_TIMESCALE_DAYS = 30;
export const LAND_DEEP_GROUNDWATER_WATER_MINIMUM_TEMPERATURE_C = -2;
export const LAND_DEEP_GROUNDWATER_WATER_MAXIMUM_TEMPERATURE_C = 45;

const finite = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;
const clamp = (value, minimum, maximum) =>
  Math.max(minimum, Math.min(maximum, value));
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

function digestValid(receipt, schema) {
  if (receipt?.schema !== schema || typeof receipt.digest !== 'string') {
    return false;
  }
  const unsigned = clone(receipt);
  delete unsigned.digest;
  return stableDigest(unsigned) === receipt.digest;
}

export function landDeepGroundwaterWaterThermalProposalValid(proposal) {
  return digestValid(proposal,
    LAND_DEEP_GROUNDWATER_WATER_THERMAL_PROPOSAL_SCHEMA);
}

export function landDeepGroundwaterWaterThermalReceiptValid(receipt) {
  return digestValid(receipt,
    LAND_DEEP_GROUNDWATER_WATER_THERMAL_RECEIPT_SCHEMA);
}

function closure(signedOperands) {
  const operands = signedOperands.map(Number);
  const residual = operands.reduce((sum, value) => sum + value, 0);
  const scale = operands.reduce((sum, value) =>
    sum + Math.abs(value), 0);
  const numericTolerance = round(Math.max(
    LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    scale * Number.EPSILON * LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
  ));
  return {
    schema: LAND_DEEP_GROUNDWATER_WATER_THERMAL_CLOSURE_SCHEMA,
    policy: {
      schema: LAND_DEEP_GROUNDWATER_WATER_THERMAL_CLOSURE_POLICY_SCHEMA,
      kind: 'energy',
      absoluteFloor: LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
      ulpFactor: LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR,
      scaleBasis:
        'sum-of-absolute-unrounded-signed-operands-joules-per-square-metre'
    },
    signedOperands: operands,
    residual: Number(residual),
    numericTolerance,
    toleranceUtilization: round(Math.abs(residual) / numericTolerance),
    closed: Math.abs(residual) <= numericTolerance,
    measuredResidualPreserved: true
  };
}

function ownersMatch(left = {}, right = {}) {
  return Math.abs(finite(left.trackedWaterMm) -
      finite(right.trackedWaterMm)) <=
        LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM &&
    Math.abs(finite(left.sensibleHeatJm2) -
      finite(right.sensibleHeatJm2)) <=
        LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J &&
    Math.abs(finite(left.waterTemperatureC) -
      finite(right.waterTemperatureC)) <= 1e-12;
}

function heatCapacity(owner) {
  return Math.max(0, finite(owner?.trackedWaterMm)) *
    LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K;
}

export function planLandDeepGroundwaterWaterThermalExchange(column,
  landHydrologyThermalReceipt, rootDeepWaterThermalReceipt,
  durationDays, context = {}) {
  const reservoirs = column?.land?.hydrologyThermal?.reservoirs;
  if (column?.kind !== 'land' || !reservoirs?.deepSoil ||
      !reservoirs?.groundwater) {
    throw new Error('Deep-groundwater-water thermal planning requires a land column');
  }
  if (!digestValid(landHydrologyThermalReceipt,
      LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA) ||
      !landRootDeepWaterThermalReceiptValid(
        rootDeepWaterThermalReceipt)) {
    throw new Error('Deep-groundwater-water thermal planning requires intact current source receipts');
  }
  const duration = finite(durationDays);
  if (!(duration > 0) || duration > 1.000001) {
    throw new Error('Deep-groundwater-water thermal planning requires a bounded positive duration');
  }
  if (rootDeepWaterThermalReceipt.schema !==
        LAND_ROOT_DEEP_WATER_THERMAL_RECEIPT_SCHEMA ||
      rootDeepWaterThermalReceipt.sourceLandHydrologyThermal
        ?.receiptDigest !== landHydrologyThermalReceipt.digest ||
      rootDeepWaterThermalReceipt.sourceLandHydrologyThermal
        ?.stepId !== landHydrologyThermalReceipt.stepId ||
      !ownersMatch(reservoirs.deepSoil,
        rootDeepWaterThermalReceipt.finalDeepSoilOwner) ||
      !ownersMatch(reservoirs.groundwater,
        landHydrologyThermalReceipt.finalOwners?.groundwater)) {
    throw new Error('Deep-groundwater-water thermal planning is detached from the current owners');
  }

  const initialDeepSoilOwner = clone(reservoirs.deepSoil);
  const initialGroundwaterOwner = clone(reservoirs.groundwater);
  const deepSoilHeatCapacityJm2K = heatCapacity(initialDeepSoilOwner);
  const groundwaterHeatCapacityJm2K = heatCapacity(initialGroundwaterOwner);
  const responseFraction = 1 - Math.exp(-duration /
    LAND_DEEP_GROUNDWATER_WATER_THERMAL_RESPONSE_TIMESCALE_DAYS);
  const jointHeatCapacityJm2K = deepSoilHeatCapacityJm2K > 0 &&
      groundwaterHeatCapacityJm2K > 0
    ? deepSoilHeatCapacityJm2K * groundwaterHeatCapacityJm2K /
      (deepSoilHeatCapacityJm2K + groundwaterHeatCapacityJm2K)
    : 0;
  const requestedHeatToGroundwaterJm2 = jointHeatCapacityJm2K *
    (initialDeepSoilOwner.waterTemperatureC -
      initialGroundwaterOwner.waterTemperatureC) * responseFraction;
  const minimumHeatToGroundwaterFromGroundwaterEnvelopeJm2 =
    groundwaterHeatCapacityJm2K *
      (LAND_DEEP_GROUNDWATER_WATER_MINIMUM_TEMPERATURE_C -
        initialGroundwaterOwner.waterTemperatureC);
  const maximumHeatToGroundwaterFromGroundwaterEnvelopeJm2 =
    groundwaterHeatCapacityJm2K *
      (LAND_DEEP_GROUNDWATER_WATER_MAXIMUM_TEMPERATURE_C -
        initialGroundwaterOwner.waterTemperatureC);
  const minimumHeatToGroundwaterFromDeepEnvelopeJm2 =
    deepSoilHeatCapacityJm2K *
      (initialDeepSoilOwner.waterTemperatureC -
        LAND_DEEP_GROUNDWATER_WATER_MAXIMUM_TEMPERATURE_C);
  const maximumHeatToGroundwaterFromDeepEnvelopeJm2 =
    deepSoilHeatCapacityJm2K *
      (initialDeepSoilOwner.waterTemperatureC -
        LAND_DEEP_GROUNDWATER_WATER_MINIMUM_TEMPERATURE_C);
  const minimumHeatToGroundwaterJm2 = Math.max(
    minimumHeatToGroundwaterFromGroundwaterEnvelopeJm2,
    minimumHeatToGroundwaterFromDeepEnvelopeJm2);
  const maximumHeatToGroundwaterJm2 = Math.min(
    maximumHeatToGroundwaterFromGroundwaterEnvelopeJm2,
    maximumHeatToGroundwaterFromDeepEnvelopeJm2);
  const appliedHeatToGroundwaterJm2 = deepSoilHeatCapacityJm2K > 0 &&
      groundwaterHeatCapacityJm2K > 0
    ? clamp(requestedHeatToGroundwaterJm2,
      minimumHeatToGroundwaterJm2, maximumHeatToGroundwaterJm2)
    : 0;
  const proposal = {
    schema: LAND_DEEP_GROUNDWATER_WATER_THERMAL_PROPOSAL_SCHEMA,
    stepId: String(context.stepId ||
      `${rootDeepWaterThermalReceipt.stepId}:deep-groundwater-water-plan`),
    durationDays: Number(duration),
    sourceLandHydrologyThermal: {
      schema: landHydrologyThermalReceipt.schema,
      receiptDigest: landHydrologyThermalReceipt.digest,
      stepId: landHydrologyThermalReceipt.stepId
    },
    sourceRootDeepWaterThermal: {
      schema: rootDeepWaterThermalReceipt.schema,
      receiptDigest: rootDeepWaterThermalReceipt.digest,
      stepId: rootDeepWaterThermalReceipt.stepId
    },
    initialDeepSoilOwner,
    initialGroundwaterOwner,
    response: {
      mode: 'bounded-two-water-owner-bulk-response',
      responseTimescaleDays:
        LAND_DEEP_GROUNDWATER_WATER_THERMAL_RESPONSE_TIMESCALE_DAYS,
      responseFraction: Number(responseFraction),
      deepSoilWaterHeatCapacityJm2K: Number(deepSoilHeatCapacityJm2K),
      groundwaterWaterHeatCapacityJm2K:
        Number(groundwaterHeatCapacityJm2K),
      jointHeatCapacityJm2K: Number(jointHeatCapacityJm2K)
    },
    requestedHeatToGroundwaterJm2: Number(requestedHeatToGroundwaterJm2),
    minimumHeatToGroundwaterJm2: Number(minimumHeatToGroundwaterJm2),
    maximumHeatToGroundwaterJm2: Number(maximumHeatToGroundwaterJm2),
    appliedHeatToGroundwaterJm2: Number(appliedHeatToGroundwaterJm2),
    thermalEnvelopeLimiterJm2: Number(
      appliedHeatToGroundwaterJm2 - requestedHeatToGroundwaterJm2),
    truth: {
      existingDeepSoilAndGroundwaterWaterOwnersOnly: true,
      twoOwnerEquilibriumNotCrossed: true,
      bothWaterTemperatureEnvelopesApplied: true,
      deepSoilWaterUnchangedByThisProposal: true,
      groundwaterWaterUnchangedByThisProposal: true,
      bulkResponseParameterized: true,
      groundwaterWaterThermalExchangeModeled: true,
      resolvedSolidSoilConduction: false,
      resolvedAquiferConduction: false,
      phaseChangeModeledByThisProposal: false,
      geothermalForcingModeledByThisProposal: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  proposal.digest = stableDigest(proposal);
  return clone(proposal);
}

export function applyLandDeepGroundwaterWaterThermalExchange(column,
  proposal, landHydrologyThermalReceipt, rootDeepWaterThermalReceipt,
  context = {}) {
  const reservoirs = column?.land?.hydrologyThermal?.reservoirs;
  if (column?.kind !== 'land' || !reservoirs?.deepSoil ||
      !reservoirs?.groundwater) {
    throw new Error('Deep-groundwater-water thermal application requires a land column');
  }
  if (!landDeepGroundwaterWaterThermalProposalValid(proposal) ||
      !digestValid(landHydrologyThermalReceipt,
        LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA) ||
      !landRootDeepWaterThermalReceiptValid(
        rootDeepWaterThermalReceipt)) {
    throw new Error('Deep-groundwater-water thermal application requires intact current source evidence');
  }
  const heatToGroundwaterJm2 = Number(
    proposal.appliedHeatToGroundwaterJm2);
  const sourcesBound =
    proposal.sourceLandHydrologyThermal?.receiptDigest ===
      landHydrologyThermalReceipt.digest &&
    proposal.sourceLandHydrologyThermal?.stepId ===
      landHydrologyThermalReceipt.stepId &&
    proposal.sourceRootDeepWaterThermal?.receiptDigest ===
      rootDeepWaterThermalReceipt.digest &&
    proposal.sourceRootDeepWaterThermal?.stepId ===
      rootDeepWaterThermalReceipt.stepId &&
    column.land.lastRootDeepWaterThermalReceipt?.digest ===
      rootDeepWaterThermalReceipt.digest &&
    rootDeepWaterThermalReceipt.sourceLandHydrologyThermal
      ?.receiptDigest === landHydrologyThermalReceipt.digest &&
    ownersMatch(proposal.initialDeepSoilOwner, reservoirs.deepSoil) &&
    ownersMatch(proposal.initialDeepSoilOwner,
      rootDeepWaterThermalReceipt.finalDeepSoilOwner) &&
    ownersMatch(proposal.initialGroundwaterOwner,
      reservoirs.groundwater) &&
    ownersMatch(proposal.initialGroundwaterOwner,
      landHydrologyThermalReceipt.finalOwners?.groundwater);
  if (!sourcesBound) {
    throw new Error('Deep-groundwater-water thermal source evidence is detached');
  }

  const initialDeepSoilOwner = clone(reservoirs.deepSoil);
  const initialGroundwaterOwner = clone(reservoirs.groundwater);
  const deepSoilHeatCapacityJm2K = heatCapacity(initialDeepSoilOwner);
  const groundwaterHeatCapacityJm2K = heatCapacity(initialGroundwaterOwner);
  const finalDeepSoilHeatJm2 =
    finite(initialDeepSoilOwner.sensibleHeatJm2) -
      heatToGroundwaterJm2;
  const finalGroundwaterHeatJm2 =
    finite(initialGroundwaterOwner.sensibleHeatJm2) +
      heatToGroundwaterJm2;
  const finalDeepSoilTemperatureC = deepSoilHeatCapacityJm2K > 0
    ? finalDeepSoilHeatJm2 / deepSoilHeatCapacityJm2K
    : initialDeepSoilOwner.waterTemperatureC;
  const finalGroundwaterTemperatureC = groundwaterHeatCapacityJm2K > 0
    ? finalGroundwaterHeatJm2 / groundwaterHeatCapacityJm2K
    : initialGroundwaterOwner.waterTemperatureC;
  if ([finalDeepSoilTemperatureC, finalGroundwaterTemperatureC]
      .some(value => value <
        LAND_DEEP_GROUNDWATER_WATER_MINIMUM_TEMPERATURE_C - 1e-12 ||
        value > LAND_DEEP_GROUNDWATER_WATER_MAXIMUM_TEMPERATURE_C +
          1e-12)) {
    throw new Error('Deep-groundwater-water exchange exceeds the liquid-water temperature envelope');
  }
  const finalDeepSoilOwner = {
    trackedWaterMm: Number(initialDeepSoilOwner.trackedWaterMm),
    sensibleHeatJm2: deepSoilHeatCapacityJm2K > 0
      ? Number(finalDeepSoilHeatJm2) : 0,
    waterTemperatureC: Number(finalDeepSoilTemperatureC)
  };
  const finalGroundwaterOwner = {
    trackedWaterMm: Number(initialGroundwaterOwner.trackedWaterMm),
    sensibleHeatJm2: groundwaterHeatCapacityJm2K > 0
      ? Number(finalGroundwaterHeatJm2) : 0,
    waterTemperatureC: Number(finalGroundwaterTemperatureC)
  };
  const pairedTransferClosure = closure([
    -heatToGroundwaterJm2,
    heatToGroundwaterJm2
  ]);
  const deepSoilOwnerClosure = closure([
    finalDeepSoilOwner.sensibleHeatJm2,
    -initialDeepSoilOwner.sensibleHeatJm2,
    heatToGroundwaterJm2
  ]);
  const groundwaterOwnerClosure = closure([
    finalGroundwaterOwner.sensibleHeatJm2,
    -initialGroundwaterOwner.sensibleHeatJm2,
    -heatToGroundwaterJm2
  ]);
  const combinedOwnerClosure = closure([
    finalDeepSoilOwner.sensibleHeatJm2,
    finalGroundwaterOwner.sensibleHeatJm2,
    -initialDeepSoilOwner.sensibleHeatJm2,
    -initialGroundwaterOwner.sensibleHeatJm2
  ]);
  if (!pairedTransferClosure.closed || !deepSoilOwnerClosure.closed ||
      !groundwaterOwnerClosure.closed || !combinedOwnerClosure.closed) {
    throw new Error('Deep-groundwater-water thermal exchange did not close');
  }
  const stepId = String(context.stepId ||
    `${proposal.stepId}:application`);
  const receipt = {
    schema: LAND_DEEP_GROUNDWATER_WATER_THERMAL_RECEIPT_SCHEMA,
    stepId,
    status: Math.abs(heatToGroundwaterJm2) <=
        LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J
      ? 'no-material-deep-groundwater-water-heat-transfer'
      : heatToGroundwaterJm2 > 0
        ? 'deep-soil-water-heat-debited-to-groundwater-water'
        : 'groundwater-water-heat-debited-to-deep-soil-water',
    sourceProposal: {
      schema: proposal.schema,
      receiptDigest: proposal.digest,
      stepId: proposal.stepId,
      proposal: clone(proposal)
    },
    sourceLandHydrologyThermal:
      clone(proposal.sourceLandHydrologyThermal),
    sourceRootDeepWaterThermal:
      clone(proposal.sourceRootDeepWaterThermal),
    transfer: {
      transferId: `${stepId}:paired-sensible-heat`,
      direction: heatToGroundwaterJm2 > 0
        ? 'deep-soil-water-to-groundwater-water'
        : heatToGroundwaterJm2 < 0
          ? 'groundwater-water-to-deep-soil-water' : 'none',
      signedHeatToGroundwaterJm2: Number(heatToGroundwaterJm2),
      signedDeepSoilOwnerHeatJm2: Number(-heatToGroundwaterJm2),
      signedGroundwaterOwnerHeatJm2: Number(heatToGroundwaterJm2),
      deepSoilOwnerKind:
        'persistent-land-hydrology-deep-soil-water-thermal-owner',
      groundwaterOwnerKind:
        'persistent-land-hydrology-groundwater-water-thermal-owner',
      senderOwnerDebited: true,
      receiverOwnerCredited: true
    },
    initialDeepSoilOwner,
    finalDeepSoilOwner,
    initialGroundwaterOwner,
    finalGroundwaterOwner,
    pairedTransferClosure,
    deepSoilOwnerClosure,
    groundwaterOwnerClosure,
    combinedOwnerClosure,
    truth: {
      existingDeepSoilAndGroundwaterWaterOwnersPaired: true,
      signedDeepSoilOwnerEntryApplied: true,
      signedGroundwaterOwnerEntryApplied: true,
      deepSoilWaterUnchangedByThisOrgan: true,
      groundwaterWaterUnchangedByThisOrgan: true,
      bothWaterTemperatureEnvelopesRespected: true,
      sourceReceiptsExactlyBound: true,
      scaleAwareNumericClosure: true,
      measuredResidualsPreserved: true,
      fixedAbsoluteToleranceOnly: false,
      bulkResponseParameterized: true,
      groundwaterWaterThermalExchangeModeled: true,
      resolvedSolidSoilConduction: false,
      resolvedAquiferConduction: false,
      phaseChangeModeledByThisOrgan: false,
      geothermalForcingModeledByThisOrgan: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  receipt.digest = stableDigest(receipt);
  reservoirs.deepSoil = clone(finalDeepSoilOwner);
  reservoirs.groundwater = clone(finalGroundwaterOwner);
  column.land.lastDeepGroundwaterWaterThermalReceipt = clone(receipt);
  column.land.deepGroundwaterWaterThermalMigrationCheckpoint = false;
  return clone(receipt);
}

export function deepGroundwaterWaterThermalDescription() {
  return {
    proposalSchema:
      LAND_DEEP_GROUNDWATER_WATER_THERMAL_PROPOSAL_SCHEMA,
    receiptSchema: LAND_DEEP_GROUNDWATER_WATER_THERMAL_RECEIPT_SCHEMA,
    closureSchema: LAND_DEEP_GROUNDWATER_WATER_THERMAL_CLOSURE_SCHEMA,
    closurePolicySchema:
      LAND_DEEP_GROUNDWATER_WATER_THERMAL_CLOSURE_POLICY_SCHEMA,
    responseTimescaleDays:
      LAND_DEEP_GROUNDWATER_WATER_THERMAL_RESPONSE_TIMESCALE_DAYS,
    waterTemperatureEnvelopeC: {
      minimum: LAND_DEEP_GROUNDWATER_WATER_MINIMUM_TEMPERATURE_C,
      maximum: LAND_DEEP_GROUNDWATER_WATER_MAXIMUM_TEMPERATURE_C
    },
    bulkResponseParameterized: true,
    groundwaterWaterThermalExchangeModeled: true,
    resolvedSolidSoilConduction: false,
    resolvedAquiferConduction: false,
    phaseChangeModeledByThisOrgan: false,
    geothermalForcingModeledByThisOrgan: false,
    scientificCalibrationClaimed: false,
    globalUnloadedBoundaryClaimed: false
  };
}
