import {
  LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA,
  LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K,
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR,
  LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM
} from './land-hydrology-thermal.mjs?v=0.79.0-r79.1';
import {
  LAND_SURFACE_ROOT_ZONE_THERMAL_RECEIPT_SCHEMA,
  landSurfaceRootZoneThermalReceiptValid
} from './surface-root-zone-thermal.mjs?v=0.79.0-r79.1';

export const LAND_ROOT_DEEP_WATER_THERMAL_PROPOSAL_SCHEMA =
  'axm.foundation-planet.land-root-deep-water-thermal-proposal/v1';
export const LAND_ROOT_DEEP_WATER_THERMAL_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-root-deep-water-thermal-receipt/v1';
export const LAND_ROOT_DEEP_WATER_THERMAL_CLOSURE_SCHEMA =
  'axm.foundation-planet.land-root-deep-water-thermal-closure/v1';
export const LAND_ROOT_DEEP_WATER_THERMAL_CLOSURE_POLICY_SCHEMA =
  'axm.foundation-planet.land-root-deep-water-thermal-closure-policy/v1';
export const LAND_ROOT_DEEP_WATER_THERMAL_RESPONSE_TIMESCALE_DAYS = 12;
export const LAND_ROOT_DEEP_WATER_MINIMUM_TEMPERATURE_C = -2;
export const LAND_ROOT_DEEP_WATER_MAXIMUM_TEMPERATURE_C = 45;

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

export function landRootDeepWaterThermalProposalValid(proposal) {
  return digestValid(proposal,
    LAND_ROOT_DEEP_WATER_THERMAL_PROPOSAL_SCHEMA);
}

export function landRootDeepWaterThermalReceiptValid(receipt) {
  return digestValid(receipt,
    LAND_ROOT_DEEP_WATER_THERMAL_RECEIPT_SCHEMA);
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
    schema: LAND_ROOT_DEEP_WATER_THERMAL_CLOSURE_SCHEMA,
    policy: {
      schema: LAND_ROOT_DEEP_WATER_THERMAL_CLOSURE_POLICY_SCHEMA,
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

export function planLandRootDeepWaterThermalExchange(column,
  landHydrologyThermalReceipt, surfaceRootZoneThermalReceipt,
  durationDays, context = {}) {
  const reservoirs = column?.land?.hydrologyThermal?.reservoirs;
  if (column?.kind !== 'land' || !reservoirs?.rootZone ||
      !reservoirs?.deepSoil) {
    throw new Error('Root-deep-water thermal planning requires a land column');
  }
  if (!digestValid(landHydrologyThermalReceipt,
      LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA) ||
      !landSurfaceRootZoneThermalReceiptValid(
        surfaceRootZoneThermalReceipt)) {
    throw new Error('Root-deep-water thermal planning requires intact current source receipts');
  }
  const duration = finite(durationDays);
  if (!(duration > 0) || duration > 1.000001) {
    throw new Error('Root-deep-water thermal planning requires a bounded positive duration');
  }
  if (surfaceRootZoneThermalReceipt.schema !==
        LAND_SURFACE_ROOT_ZONE_THERMAL_RECEIPT_SCHEMA ||
      surfaceRootZoneThermalReceipt.sourceLandHydrologyThermal
        ?.receiptDigest !== landHydrologyThermalReceipt.digest ||
      surfaceRootZoneThermalReceipt.sourceLandHydrologyThermal
        ?.stepId !== landHydrologyThermalReceipt.stepId ||
      !ownersMatch(reservoirs.rootZone,
        surfaceRootZoneThermalReceipt.finalRootZoneOwner) ||
      !ownersMatch(reservoirs.deepSoil,
        landHydrologyThermalReceipt.finalOwners?.deepSoil)) {
    throw new Error('Root-deep-water thermal planning is detached from the current owners');
  }

  const initialRootZoneOwner = clone(reservoirs.rootZone);
  const initialDeepSoilOwner = clone(reservoirs.deepSoil);
  const rootZoneHeatCapacityJm2K = heatCapacity(initialRootZoneOwner);
  const deepSoilHeatCapacityJm2K = heatCapacity(initialDeepSoilOwner);
  const responseFraction = 1 - Math.exp(-duration /
    LAND_ROOT_DEEP_WATER_THERMAL_RESPONSE_TIMESCALE_DAYS);
  const jointHeatCapacityJm2K = rootZoneHeatCapacityJm2K > 0 &&
      deepSoilHeatCapacityJm2K > 0
    ? rootZoneHeatCapacityJm2K * deepSoilHeatCapacityJm2K /
      (rootZoneHeatCapacityJm2K + deepSoilHeatCapacityJm2K)
    : 0;
  const requestedHeatToDeepSoilJm2 = jointHeatCapacityJm2K *
    (initialRootZoneOwner.waterTemperatureC -
      initialDeepSoilOwner.waterTemperatureC) * responseFraction;
  const minimumHeatToDeepFromDeepEnvelopeJm2 =
    deepSoilHeatCapacityJm2K *
      (LAND_ROOT_DEEP_WATER_MINIMUM_TEMPERATURE_C -
        initialDeepSoilOwner.waterTemperatureC);
  const maximumHeatToDeepFromDeepEnvelopeJm2 =
    deepSoilHeatCapacityJm2K *
      (LAND_ROOT_DEEP_WATER_MAXIMUM_TEMPERATURE_C -
        initialDeepSoilOwner.waterTemperatureC);
  const minimumHeatToDeepFromRootEnvelopeJm2 =
    rootZoneHeatCapacityJm2K *
      (initialRootZoneOwner.waterTemperatureC -
        LAND_ROOT_DEEP_WATER_MAXIMUM_TEMPERATURE_C);
  const maximumHeatToDeepFromRootEnvelopeJm2 =
    rootZoneHeatCapacityJm2K *
      (initialRootZoneOwner.waterTemperatureC -
        LAND_ROOT_DEEP_WATER_MINIMUM_TEMPERATURE_C);
  const minimumHeatToDeepSoilJm2 = Math.max(
    minimumHeatToDeepFromDeepEnvelopeJm2,
    minimumHeatToDeepFromRootEnvelopeJm2);
  const maximumHeatToDeepSoilJm2 = Math.min(
    maximumHeatToDeepFromDeepEnvelopeJm2,
    maximumHeatToDeepFromRootEnvelopeJm2);
  const appliedHeatToDeepSoilJm2 = rootZoneHeatCapacityJm2K > 0 &&
      deepSoilHeatCapacityJm2K > 0
    ? clamp(requestedHeatToDeepSoilJm2,
      minimumHeatToDeepSoilJm2, maximumHeatToDeepSoilJm2)
    : 0;
  const proposal = {
    schema: LAND_ROOT_DEEP_WATER_THERMAL_PROPOSAL_SCHEMA,
    stepId: String(context.stepId ||
      `${surfaceRootZoneThermalReceipt.stepId}:root-deep-water-plan`),
    durationDays: Number(duration),
    sourceLandHydrologyThermal: {
      schema: landHydrologyThermalReceipt.schema,
      receiptDigest: landHydrologyThermalReceipt.digest,
      stepId: landHydrologyThermalReceipt.stepId
    },
    sourceSurfaceRootZoneThermal: {
      schema: surfaceRootZoneThermalReceipt.schema,
      receiptDigest: surfaceRootZoneThermalReceipt.digest,
      stepId: surfaceRootZoneThermalReceipt.stepId
    },
    initialRootZoneOwner,
    initialDeepSoilOwner,
    response: {
      mode: 'bounded-two-water-owner-bulk-response',
      responseTimescaleDays:
        LAND_ROOT_DEEP_WATER_THERMAL_RESPONSE_TIMESCALE_DAYS,
      responseFraction: Number(responseFraction),
      rootZoneWaterHeatCapacityJm2K: Number(rootZoneHeatCapacityJm2K),
      deepSoilWaterHeatCapacityJm2K: Number(deepSoilHeatCapacityJm2K),
      jointHeatCapacityJm2K: Number(jointHeatCapacityJm2K)
    },
    requestedHeatToDeepSoilJm2: Number(requestedHeatToDeepSoilJm2),
    minimumHeatToDeepSoilJm2: Number(minimumHeatToDeepSoilJm2),
    maximumHeatToDeepSoilJm2: Number(maximumHeatToDeepSoilJm2),
    appliedHeatToDeepSoilJm2: Number(appliedHeatToDeepSoilJm2),
    thermalEnvelopeLimiterJm2: Number(
      appliedHeatToDeepSoilJm2 - requestedHeatToDeepSoilJm2),
    truth: {
      existingRootZoneAndDeepSoilWaterOwnersOnly: true,
      twoOwnerEquilibriumNotCrossed: true,
      bothWaterTemperatureEnvelopesApplied: true,
      rootZoneWaterUnchangedByThisProposal: true,
      deepSoilWaterUnchangedByThisProposal: true,
      bulkResponseParameterized: true,
      deepSoilWaterThermalExchangeModeled: true,
      resolvedSolidSoilConduction: false,
      groundwaterThermalExchangeModeledByThisProposal: false,
      phaseChangeModeledByThisProposal: false,
      geothermalForcingModeledByThisProposal: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  proposal.digest = stableDigest(proposal);
  return clone(proposal);
}

export function applyLandRootDeepWaterThermalExchange(column, proposal,
  landHydrologyThermalReceipt, surfaceRootZoneThermalReceipt,
  context = {}) {
  const reservoirs = column?.land?.hydrologyThermal?.reservoirs;
  if (column?.kind !== 'land' || !reservoirs?.rootZone ||
      !reservoirs?.deepSoil) {
    throw new Error('Root-deep-water thermal application requires a land column');
  }
  if (!landRootDeepWaterThermalProposalValid(proposal) ||
      !digestValid(landHydrologyThermalReceipt,
        LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA) ||
      !landSurfaceRootZoneThermalReceiptValid(
        surfaceRootZoneThermalReceipt)) {
    throw new Error('Root-deep-water thermal application requires intact current source evidence');
  }
  const heatToDeepSoilJm2 = Number(proposal.appliedHeatToDeepSoilJm2);
  const sourcesBound =
    proposal.sourceLandHydrologyThermal?.receiptDigest ===
      landHydrologyThermalReceipt.digest &&
    proposal.sourceLandHydrologyThermal?.stepId ===
      landHydrologyThermalReceipt.stepId &&
    proposal.sourceSurfaceRootZoneThermal?.receiptDigest ===
      surfaceRootZoneThermalReceipt.digest &&
    proposal.sourceSurfaceRootZoneThermal?.stepId ===
      surfaceRootZoneThermalReceipt.stepId &&
    column.land.lastSurfaceRootZoneThermalReceipt?.digest ===
      surfaceRootZoneThermalReceipt.digest &&
    surfaceRootZoneThermalReceipt.sourceLandHydrologyThermal
      ?.receiptDigest === landHydrologyThermalReceipt.digest &&
    ownersMatch(proposal.initialRootZoneOwner, reservoirs.rootZone) &&
    ownersMatch(proposal.initialRootZoneOwner,
      surfaceRootZoneThermalReceipt.finalRootZoneOwner) &&
    ownersMatch(proposal.initialDeepSoilOwner, reservoirs.deepSoil) &&
    ownersMatch(proposal.initialDeepSoilOwner,
      landHydrologyThermalReceipt.finalOwners?.deepSoil);
  if (!sourcesBound) {
    throw new Error('Root-deep-water thermal source evidence is detached');
  }

  const initialRootZoneOwner = clone(reservoirs.rootZone);
  const initialDeepSoilOwner = clone(reservoirs.deepSoil);
  const rootZoneHeatCapacityJm2K = heatCapacity(initialRootZoneOwner);
  const deepSoilHeatCapacityJm2K = heatCapacity(initialDeepSoilOwner);
  const finalRootZoneHeatJm2 =
    finite(initialRootZoneOwner.sensibleHeatJm2) - heatToDeepSoilJm2;
  const finalDeepSoilHeatJm2 =
    finite(initialDeepSoilOwner.sensibleHeatJm2) + heatToDeepSoilJm2;
  const finalRootZoneTemperatureC = rootZoneHeatCapacityJm2K > 0
    ? finalRootZoneHeatJm2 / rootZoneHeatCapacityJm2K
    : initialRootZoneOwner.waterTemperatureC;
  const finalDeepSoilTemperatureC = deepSoilHeatCapacityJm2K > 0
    ? finalDeepSoilHeatJm2 / deepSoilHeatCapacityJm2K
    : initialDeepSoilOwner.waterTemperatureC;
  if ([finalRootZoneTemperatureC, finalDeepSoilTemperatureC]
      .some(value => value <
        LAND_ROOT_DEEP_WATER_MINIMUM_TEMPERATURE_C - 1e-12 || value >
        LAND_ROOT_DEEP_WATER_MAXIMUM_TEMPERATURE_C + 1e-12)) {
    throw new Error('Root-deep-water exchange exceeds the liquid-water temperature envelope');
  }
  const finalRootZoneOwner = {
    trackedWaterMm: Number(initialRootZoneOwner.trackedWaterMm),
    sensibleHeatJm2: rootZoneHeatCapacityJm2K > 0
      ? Number(finalRootZoneHeatJm2) : 0,
    waterTemperatureC: Number(finalRootZoneTemperatureC)
  };
  const finalDeepSoilOwner = {
    trackedWaterMm: Number(initialDeepSoilOwner.trackedWaterMm),
    sensibleHeatJm2: deepSoilHeatCapacityJm2K > 0
      ? Number(finalDeepSoilHeatJm2) : 0,
    waterTemperatureC: Number(finalDeepSoilTemperatureC)
  };
  const pairedTransferClosure = closure([
    -heatToDeepSoilJm2,
    heatToDeepSoilJm2
  ]);
  const rootZoneOwnerClosure = closure([
    finalRootZoneOwner.sensibleHeatJm2,
    -initialRootZoneOwner.sensibleHeatJm2,
    heatToDeepSoilJm2
  ]);
  const deepSoilOwnerClosure = closure([
    finalDeepSoilOwner.sensibleHeatJm2,
    -initialDeepSoilOwner.sensibleHeatJm2,
    -heatToDeepSoilJm2
  ]);
  const combinedOwnerClosure = closure([
    finalRootZoneOwner.sensibleHeatJm2,
    finalDeepSoilOwner.sensibleHeatJm2,
    -initialRootZoneOwner.sensibleHeatJm2,
    -initialDeepSoilOwner.sensibleHeatJm2
  ]);
  if (!pairedTransferClosure.closed || !rootZoneOwnerClosure.closed ||
      !deepSoilOwnerClosure.closed || !combinedOwnerClosure.closed) {
    throw new Error('Root-deep-water thermal exchange did not close');
  }
  const stepId = String(context.stepId ||
    `${proposal.stepId}:application`);
  const receipt = {
    schema: LAND_ROOT_DEEP_WATER_THERMAL_RECEIPT_SCHEMA,
    stepId,
    status: Math.abs(heatToDeepSoilJm2) <=
        LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J
      ? 'no-material-root-deep-water-heat-transfer'
      : heatToDeepSoilJm2 > 0
        ? 'root-zone-water-heat-debited-to-deep-soil-water'
        : 'deep-soil-water-heat-debited-to-root-zone-water',
    sourceProposal: {
      schema: proposal.schema,
      receiptDigest: proposal.digest,
      stepId: proposal.stepId,
      proposal: clone(proposal)
    },
    sourceLandHydrologyThermal:
      clone(proposal.sourceLandHydrologyThermal),
    sourceSurfaceRootZoneThermal:
      clone(proposal.sourceSurfaceRootZoneThermal),
    transfer: {
      transferId: `${stepId}:paired-sensible-heat`,
      direction: heatToDeepSoilJm2 > 0
        ? 'root-zone-water-to-deep-soil-water'
        : heatToDeepSoilJm2 < 0
          ? 'deep-soil-water-to-root-zone-water' : 'none',
      signedHeatToDeepSoilJm2: Number(heatToDeepSoilJm2),
      signedRootZoneOwnerHeatJm2: Number(-heatToDeepSoilJm2),
      signedDeepSoilOwnerHeatJm2: Number(heatToDeepSoilJm2),
      rootZoneOwnerKind:
        'persistent-land-hydrology-root-zone-water-thermal-owner',
      deepSoilOwnerKind:
        'persistent-land-hydrology-deep-soil-water-thermal-owner',
      senderOwnerDebited: true,
      receiverOwnerCredited: true
    },
    initialRootZoneOwner,
    finalRootZoneOwner,
    initialDeepSoilOwner,
    finalDeepSoilOwner,
    pairedTransferClosure,
    rootZoneOwnerClosure,
    deepSoilOwnerClosure,
    combinedOwnerClosure,
    truth: {
      existingRootZoneAndDeepSoilWaterOwnersPaired: true,
      signedRootZoneOwnerEntryApplied: true,
      signedDeepSoilOwnerEntryApplied: true,
      rootZoneWaterUnchangedByThisOrgan: true,
      deepSoilWaterUnchangedByThisOrgan: true,
      bothWaterTemperatureEnvelopesRespected: true,
      sourceReceiptsExactlyBound: true,
      scaleAwareNumericClosure: true,
      measuredResidualsPreserved: true,
      fixedAbsoluteToleranceOnly: false,
      bulkResponseParameterized: true,
      deepSoilWaterThermalExchangeModeled: true,
      resolvedSolidSoilConduction: false,
      groundwaterThermalExchangeModeledByThisOrgan: false,
      phaseChangeModeledByThisOrgan: false,
      geothermalForcingModeledByThisOrgan: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  receipt.digest = stableDigest(receipt);
  reservoirs.rootZone = clone(finalRootZoneOwner);
  reservoirs.deepSoil = clone(finalDeepSoilOwner);
  column.land.lastRootDeepWaterThermalReceipt = clone(receipt);
  column.land.rootDeepWaterThermalMigrationCheckpoint = false;
  return clone(receipt);
}

export function rootDeepWaterThermalDescription() {
  return {
    proposalSchema: LAND_ROOT_DEEP_WATER_THERMAL_PROPOSAL_SCHEMA,
    receiptSchema: LAND_ROOT_DEEP_WATER_THERMAL_RECEIPT_SCHEMA,
    closureSchema: LAND_ROOT_DEEP_WATER_THERMAL_CLOSURE_SCHEMA,
    closurePolicySchema:
      LAND_ROOT_DEEP_WATER_THERMAL_CLOSURE_POLICY_SCHEMA,
    responseTimescaleDays:
      LAND_ROOT_DEEP_WATER_THERMAL_RESPONSE_TIMESCALE_DAYS,
    waterTemperatureEnvelopeC: {
      minimum: LAND_ROOT_DEEP_WATER_MINIMUM_TEMPERATURE_C,
      maximum: LAND_ROOT_DEEP_WATER_MAXIMUM_TEMPERATURE_C
    },
    bulkResponseParameterized: true,
    deepSoilWaterThermalExchangeModeled: true,
    resolvedSolidSoilConduction: false,
    groundwaterThermalExchangeModeledByThisOrgan: false,
    phaseChangeModeledByThisOrgan: false,
    geothermalForcingModeledByThisOrgan: false,
    scientificCalibrationClaimed: false,
    globalUnloadedBoundaryClaimed: false
  };
}
