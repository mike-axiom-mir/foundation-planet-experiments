import {
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
} from './land-hydrology-thermal.mjs?v=0.83.0-r83.1';
import {
  LAND_AQUIFER_MATRIX_THERMAL_STATE_SCHEMA,
  LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA,
  LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C,
  LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C,
  aquiferMatrixThermalParameters,
  landGroundwaterAquiferMatrixThermalReceiptValid
} from './groundwater-aquifer-matrix-thermal.mjs?v=0.83.0-r83.1';
import {
  LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA,
  LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C,
  LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C,
  deepSubsurfaceMatrixThermalParameters
} from './deep-soil-subsurface-matrix-thermal.mjs?v=0.83.0-r83.1';
import {
  LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
  landSurfaceSubsurfaceMatrixThermalReceiptValid
} from './surface-subsurface-matrix-thermal.mjs?v=0.83.0-r83.1';

export const LAND_DEEP_AQUIFER_MATRIX_THERMAL_PROPOSAL_SCHEMA =
  'axm.foundation-planet.land-deep-aquifer-matrix-thermal-proposal/v1';
export const LAND_DEEP_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-deep-aquifer-matrix-thermal-receipt/v1';
export const LAND_DEEP_AQUIFER_MATRIX_THERMAL_CLOSURE_SCHEMA =
  'axm.foundation-planet.land-deep-aquifer-matrix-thermal-closure/v1';
export const LAND_DEEP_AQUIFER_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA =
  'axm.foundation-planet.land-deep-aquifer-matrix-thermal-closure-policy/v1';
export const LAND_DEEP_AQUIFER_MATRIX_BASE_RESPONSE_TIMESCALE_DAYS = 120;
export const LAND_DEEP_AQUIFER_MATRIX_DISTANCE_SCALE_M = 10;

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

function digestValid(value, schema) {
  if (value?.schema !== schema || typeof value.digest !== 'string') {
    return false;
  }
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

export function landDeepAquiferMatrixThermalProposalValid(proposal) {
  return digestValid(proposal,
    LAND_DEEP_AQUIFER_MATRIX_THERMAL_PROPOSAL_SCHEMA);
}

export function landDeepAquiferMatrixThermalReceiptValid(receipt) {
  return digestValid(receipt,
    LAND_DEEP_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA);
}

function same(left, right, tolerance = 1e-12) {
  return Number.isFinite(Number(left)) && Number.isFinite(Number(right)) &&
    Math.abs(Number(left) - Number(right)) <= tolerance;
}

function deepMatrixOwnersMatch(left = {}, right = {}) {
  return left.materialClass ===
      'parameterized-deep-subsurface-mineral-matrix' &&
    right.materialClass === left.materialClass &&
    same(left.upperBoundaryDepthM, right.upperBoundaryDepthM) &&
    same(left.lowerBoundaryDepthM, right.lowerBoundaryDepthM) &&
    same(left.effectiveDepthM, right.effectiveDepthM) &&
    same(left.separationToAquiferMatrixM,
      right.separationToAquiferMatrixM) &&
    same(left.solidFraction, right.solidFraction) &&
    same(left.volumetricHeatCapacityJm3K,
      right.volumetricHeatCapacityJm3K) &&
    same(left.heatCapacityJm2K, right.heatCapacityJm2K, 1e-6) &&
    same(left.temperatureC, right.temperatureC) &&
    same(left.sensibleHeatJm2, right.sensibleHeatJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);
}

function aquiferMatrixOwnersMatch(left = {}, right = {}) {
  return left.materialClass === 'parameterized-aquifer-mineral-matrix' &&
    right.materialClass === left.materialClass &&
    same(left.effectiveDepthM, right.effectiveDepthM) &&
    same(left.solidFraction, right.solidFraction) &&
    same(left.volumetricHeatCapacityJm3K,
      right.volumetricHeatCapacityJm3K) &&
    same(left.heatCapacityJm2K, right.heatCapacityJm2K, 1e-6) &&
    same(left.temperatureC, right.temperatureC) &&
    same(left.sensibleHeatJm2, right.sensibleHeatJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);
}

function gapGeometry(substrate = {}, deepOwner = {}, aquiferOwner = {}) {
  const deepParameters = deepSubsurfaceMatrixThermalParameters(substrate);
  const aquiferParameters = aquiferMatrixThermalParameters(substrate);
  const deepMatrixLowerBoundaryDepthM =
    Number(deepOwner.lowerBoundaryDepthM);
  const aquiferMatrixUpperBoundaryDepthM =
    Number(deepParameters.aquiferMatrixUpperBoundaryDepthM);
  const separationM = aquiferMatrixUpperBoundaryDepthM -
    deepMatrixLowerBoundaryDepthM;
  const effectiveResponseTimescaleDays =
    LAND_DEEP_AQUIFER_MATRIX_BASE_RESPONSE_TIMESCALE_DAYS *
    (1 + Math.max(0, separationM) /
      LAND_DEEP_AQUIFER_MATRIX_DISTANCE_SCALE_M);
  return {
    mode: 'explicit-separated-deep-and-aquifer-matrix-interface',
    deepMatrixLowerBoundaryDepthM,
    aquiferMatrixUpperBoundaryDepthM,
    separationM: Number(separationM),
    ownerIntervalsOverlap: separationM < -1e-12,
    deepOwnerGeometryMatchesSubstrate:
      same(deepOwner.lowerBoundaryDepthM,
        deepParameters.lowerBoundaryDepthM) &&
      same(deepOwner.separationToAquiferMatrixM,
        deepParameters.separationToAquiferMatrixM),
    aquiferOwnerGeometryMatchesSubstrate:
      same(aquiferOwner.effectiveDepthM,
        aquiferParameters.effectiveDepthM) &&
      same(aquiferOwner.heatCapacityJm2K,
        aquiferParameters.heatCapacityJm2K, 1e-6),
    baseResponseTimescaleDays:
      LAND_DEEP_AQUIFER_MATRIX_BASE_RESPONSE_TIMESCALE_DAYS,
    distanceScaleM: LAND_DEEP_AQUIFER_MATRIX_DISTANCE_SCALE_M,
    effectiveResponseTimescaleDays:
      Number(effectiveResponseTimescaleDays)
  };
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
    schema: LAND_DEEP_AQUIFER_MATRIX_THERMAL_CLOSURE_SCHEMA,
    policy: {
      schema: LAND_DEEP_AQUIFER_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA,
      kind: 'energy',
      absoluteFloor:
        LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
      ulpFactor: LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR,
      scaleBasis:
        'sum-of-absolute-unrounded-signed-operands-joules-per-square-metre'
    },
    signedOperands: operands,
    residual: Number(residual),
    numericTolerance,
    measuredResidualPreserved: true,
    closed: Math.abs(residual) <= numericTolerance
  };
}

export function planLandDeepAquiferMatrixThermalExchange(column,
  surfaceSubsurfaceMatrixThermalReceipt,
  groundwaterAquiferMatrixThermalReceipt, durationDays = 1,
  context = {}) {
  const deepState = column?.land?.deepSubsurfaceMatrixThermal;
  const aquiferState = column?.land?.aquiferMatrixThermal;
  if (column?.kind !== 'land' ||
      deepState?.schema !== LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA ||
      aquiferState?.schema !== LAND_AQUIFER_MATRIX_THERMAL_STATE_SCHEMA) {
    throw new Error('Deep/aquifer-matrix planning requires both persistent matrix owners');
  }
  if (!landSurfaceSubsurfaceMatrixThermalReceiptValid(
      surfaceSubsurfaceMatrixThermalReceipt) ||
      !landGroundwaterAquiferMatrixThermalReceiptValid(
        groundwaterAquiferMatrixThermalReceipt)) {
    throw new Error('Deep/aquifer-matrix planning requires intact current R82 and R80 evidence');
  }
  const duration = finite(durationDays);
  if (!(duration > 0 && duration <= 1.000001)) {
    throw new Error('Deep/aquifer-matrix planning requires a bounded positive duration');
  }
  const initialDeepSubsurfaceMatrixOwner = clone(deepState.owner || {});
  const initialAquiferMatrixOwner = clone(aquiferState.owner || {});
  const geometry = gapGeometry(column.substrate,
    initialDeepSubsurfaceMatrixOwner, initialAquiferMatrixOwner);
  if (!deepMatrixOwnersMatch(initialDeepSubsurfaceMatrixOwner,
      surfaceSubsurfaceMatrixThermalReceipt
        .finalDeepSubsurfaceMatrixOwner) ||
      !aquiferMatrixOwnersMatch(initialAquiferMatrixOwner,
        groundwaterAquiferMatrixThermalReceipt.finalAquiferMatrixOwner) ||
      geometry.ownerIntervalsOverlap ||
      geometry.deepOwnerGeometryMatchesSubstrate !== true ||
      geometry.aquiferOwnerGeometryMatchesSubstrate !== true) {
    throw new Error('Deep/aquifer-matrix planning is detached from the current separated owners');
  }
  const deepCapacity = Math.max(0,
    finite(initialDeepSubsurfaceMatrixOwner.heatCapacityJm2K));
  const aquiferCapacity = Math.max(0,
    finite(initialAquiferMatrixOwner.heatCapacityJm2K));
  const responseFraction = 1 - Math.exp(-duration /
    geometry.effectiveResponseTimescaleDays);
  const jointCapacity = deepCapacity > 0 && aquiferCapacity > 0
    ? deepCapacity * aquiferCapacity /
      (deepCapacity + aquiferCapacity) : 0;
  const requestedHeatToAquiferMatrixJm2 = jointCapacity *
    (initialDeepSubsurfaceMatrixOwner.temperatureC -
      initialAquiferMatrixOwner.temperatureC) * responseFraction;
  const minimumHeatToAquiferMatrixJm2 = Math.max(
    deepCapacity * (initialDeepSubsurfaceMatrixOwner.temperatureC -
      LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C),
    aquiferCapacity * (LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C -
      initialAquiferMatrixOwner.temperatureC));
  const maximumHeatToAquiferMatrixJm2 = Math.min(
    deepCapacity * (initialDeepSubsurfaceMatrixOwner.temperatureC -
      LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C),
    aquiferCapacity * (LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C -
      initialAquiferMatrixOwner.temperatureC));
  const appliedHeatToAquiferMatrixJm2 =
    deepCapacity > 0 && aquiferCapacity > 0
      ? clamp(requestedHeatToAquiferMatrixJm2,
        minimumHeatToAquiferMatrixJm2,
        maximumHeatToAquiferMatrixJm2) : 0;
  const proposal = {
    schema: LAND_DEEP_AQUIFER_MATRIX_THERMAL_PROPOSAL_SCHEMA,
    stepId: String(context.stepId ||
      `${surfaceSubsurfaceMatrixThermalReceipt.stepId}:deep-aquifer-plan`),
    sourceSurfaceSubsurfaceMatrixThermal: {
      schema: LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
      receiptDigest: surfaceSubsurfaceMatrixThermalReceipt.digest,
      stepId: surfaceSubsurfaceMatrixThermalReceipt.stepId
    },
    sourceGroundwaterAquiferMatrixThermal: {
      schema: LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA,
      receiptDigest: groundwaterAquiferMatrixThermalReceipt.digest,
      stepId: groundwaterAquiferMatrixThermalReceipt.stepId
    },
    geometry,
    durationDays: Number(duration),
    initialDeepSubsurfaceMatrixOwner,
    initialAquiferMatrixOwner,
    response: {
      mode: 'distance-aware-separated-matrix-bulk-response',
      baseResponseTimescaleDays:
        LAND_DEEP_AQUIFER_MATRIX_BASE_RESPONSE_TIMESCALE_DAYS,
      distanceScaleM: LAND_DEEP_AQUIFER_MATRIX_DISTANCE_SCALE_M,
      separationM: Number(geometry.separationM),
      effectiveResponseTimescaleDays:
        Number(geometry.effectiveResponseTimescaleDays),
      responseFraction: Number(responseFraction),
      deepSubsurfaceMatrixHeatCapacityJm2K: Number(deepCapacity),
      aquiferMatrixHeatCapacityJm2K: Number(aquiferCapacity),
      jointHeatCapacityJm2K: Number(jointCapacity)
    },
    requestedHeatToAquiferMatrixJm2:
      Number(requestedHeatToAquiferMatrixJm2),
    minimumHeatToAquiferMatrixJm2:
      Number(minimumHeatToAquiferMatrixJm2),
    maximumHeatToAquiferMatrixJm2:
      Number(maximumHeatToAquiferMatrixJm2),
    appliedHeatToAquiferMatrixJm2:
      Number(appliedHeatToAquiferMatrixJm2),
    thermalEnvelopeLimiterJm2: Number(
      appliedHeatToAquiferMatrixJm2 - requestedHeatToAquiferMatrixJm2),
    truth: {
      existingDeepAndAquiferMatrixOwnersOnly: true,
      exactR82AndR80SourcesBound: true,
      explicitSeparationGeometryUsed: true,
      ownerIntervalsOverlap: false,
      distanceAwareBulkResponseParameterized: true,
      deepSubsurfaceMatrixGeometryUnchangedByThisProposal: true,
      aquiferMatrixGeometryUnchangedByThisProposal: true,
      externalHeatSourceAdded: false,
      resolvedInterMatrixConduction: false,
      resolvedSubsurfaceConduction: false,
      resolvedAquiferConduction: false,
      geothermalForcingModeledByThisProposal: false,
      phaseChangeModeledByThisProposal: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  proposal.digest = stableDigest(proposal);
  return clone(proposal);
}

export function applyLandDeepAquiferMatrixThermalExchange(column,
  proposal, surfaceSubsurfaceMatrixThermalReceipt,
  groundwaterAquiferMatrixThermalReceipt, context = {}) {
  const deepState = column?.land?.deepSubsurfaceMatrixThermal;
  const aquiferState = column?.land?.aquiferMatrixThermal;
  if (column?.kind !== 'land' ||
      deepState?.schema !== LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA ||
      aquiferState?.schema !== LAND_AQUIFER_MATRIX_THERMAL_STATE_SCHEMA) {
    throw new Error('Deep/aquifer-matrix application requires both persistent matrix owners');
  }
  if (!landDeepAquiferMatrixThermalProposalValid(proposal) ||
      !landSurfaceSubsurfaceMatrixThermalReceiptValid(
        surfaceSubsurfaceMatrixThermalReceipt) ||
      !landGroundwaterAquiferMatrixThermalReceiptValid(
        groundwaterAquiferMatrixThermalReceipt)) {
    throw new Error('Deep/aquifer-matrix application requires intact current source evidence');
  }
  const currentDeepOwner = deepState.owner || {};
  const currentAquiferOwner = aquiferState.owner || {};
  const expectedGeometry = gapGeometry(column.substrate,
    currentDeepOwner, currentAquiferOwner);
  const sourcesBound = proposal.sourceSurfaceSubsurfaceMatrixThermal
      ?.receiptDigest === surfaceSubsurfaceMatrixThermalReceipt.digest &&
    proposal.sourceSurfaceSubsurfaceMatrixThermal?.stepId ===
      surfaceSubsurfaceMatrixThermalReceipt.stepId &&
    proposal.sourceGroundwaterAquiferMatrixThermal?.receiptDigest ===
      groundwaterAquiferMatrixThermalReceipt.digest &&
    proposal.sourceGroundwaterAquiferMatrixThermal?.stepId ===
      groundwaterAquiferMatrixThermalReceipt.stepId &&
    deepMatrixOwnersMatch(proposal.initialDeepSubsurfaceMatrixOwner,
      currentDeepOwner) &&
    deepMatrixOwnersMatch(proposal.initialDeepSubsurfaceMatrixOwner,
      surfaceSubsurfaceMatrixThermalReceipt
        .finalDeepSubsurfaceMatrixOwner) &&
    aquiferMatrixOwnersMatch(proposal.initialAquiferMatrixOwner,
      currentAquiferOwner) &&
    aquiferMatrixOwnersMatch(proposal.initialAquiferMatrixOwner,
      groundwaterAquiferMatrixThermalReceipt.finalAquiferMatrixOwner) &&
    same(proposal.geometry?.separationM,
      expectedGeometry.separationM) &&
    proposal.geometry?.ownerIntervalsOverlap === false &&
    expectedGeometry.ownerIntervalsOverlap === false;
  if (!sourcesBound) {
    throw new Error('Deep/aquifer-matrix source evidence is detached');
  }
  const initialDeepSubsurfaceMatrixOwner = clone(currentDeepOwner);
  const initialAquiferMatrixOwner = clone(currentAquiferOwner);
  const heatToAquiferMatrixJm2 = Number(
    proposal.appliedHeatToAquiferMatrixJm2);
  const deepCapacity = Number(
    initialDeepSubsurfaceMatrixOwner.heatCapacityJm2K);
  const aquiferCapacity = Number(
    initialAquiferMatrixOwner.heatCapacityJm2K);
  const proposedFinalDeepHeatJm2 = Number(
    initialDeepSubsurfaceMatrixOwner.sensibleHeatJm2) -
    heatToAquiferMatrixJm2;
  const proposedFinalAquiferHeatJm2 = Number(
    initialAquiferMatrixOwner.sensibleHeatJm2) +
    heatToAquiferMatrixJm2;
  const finalDeepTemperatureC = deepCapacity > 0
    ? proposedFinalDeepHeatJm2 / deepCapacity
    : initialDeepSubsurfaceMatrixOwner.temperatureC;
  const finalAquiferTemperatureC = aquiferCapacity > 0
    ? proposedFinalAquiferHeatJm2 / aquiferCapacity
    : initialAquiferMatrixOwner.temperatureC;
  const finalDeepHeatJm2 = deepCapacity > 0
    ? deepCapacity * finalDeepTemperatureC
    : proposedFinalDeepHeatJm2;
  const finalAquiferHeatJm2 = aquiferCapacity > 0
    ? aquiferCapacity * finalAquiferTemperatureC
    : proposedFinalAquiferHeatJm2;
  if (finalDeepTemperatureC <
      LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C - 1e-9 ||
      finalDeepTemperatureC >
        LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C + 1e-9 ||
      finalAquiferTemperatureC <
        LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C - 1e-9 ||
      finalAquiferTemperatureC >
        LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C + 1e-9) {
    throw new Error('Deep/aquifer-matrix exchange exceeds a declared temperature envelope');
  }
  const finalDeepSubsurfaceMatrixOwner = {
    ...clone(initialDeepSubsurfaceMatrixOwner),
    temperatureC: Number(finalDeepTemperatureC),
    sensibleHeatJm2: Number(finalDeepHeatJm2)
  };
  const finalAquiferMatrixOwner = {
    ...clone(initialAquiferMatrixOwner),
    temperatureC: Number(finalAquiferTemperatureC),
    sensibleHeatJm2: Number(finalAquiferHeatJm2)
  };
  const pairedTransferClosure = closure([
    -heatToAquiferMatrixJm2, heatToAquiferMatrixJm2
  ]);
  const deepSubsurfaceMatrixOwnerClosure = closure([
    finalDeepSubsurfaceMatrixOwner.sensibleHeatJm2,
    -initialDeepSubsurfaceMatrixOwner.sensibleHeatJm2,
    heatToAquiferMatrixJm2
  ]);
  const aquiferMatrixOwnerClosure = closure([
    finalAquiferMatrixOwner.sensibleHeatJm2,
    -initialAquiferMatrixOwner.sensibleHeatJm2,
    -heatToAquiferMatrixJm2
  ]);
  const combinedOwnerClosure = closure([
    finalDeepSubsurfaceMatrixOwner.sensibleHeatJm2,
    finalAquiferMatrixOwner.sensibleHeatJm2,
    -initialDeepSubsurfaceMatrixOwner.sensibleHeatJm2,
    -initialAquiferMatrixOwner.sensibleHeatJm2
  ]);
  if (!pairedTransferClosure.closed ||
      !deepSubsurfaceMatrixOwnerClosure.closed ||
      !aquiferMatrixOwnerClosure.closed ||
      !combinedOwnerClosure.closed) {
    throw new Error('Deep/aquifer-matrix thermal exchange did not close');
  }
  const stepId = String(context.stepId || `${proposal.stepId}:application`);
  const receipt = {
    schema: LAND_DEEP_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA,
    stepId,
    status: Math.abs(heatToAquiferMatrixJm2) <=
        LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J
      ? 'no-material-deep-aquifer-matrix-heat-transfer'
      : heatToAquiferMatrixJm2 > 0
        ? 'deep-subsurface-matrix-heat-debited-to-aquifer-matrix'
        : 'aquifer-matrix-heat-debited-to-deep-subsurface-matrix',
    sourceProposal: {
      schema: proposal.schema,
      receiptDigest: proposal.digest,
      stepId: proposal.stepId,
      proposal: clone(proposal)
    },
    sourceSurfaceSubsurfaceMatrixThermal:
      clone(proposal.sourceSurfaceSubsurfaceMatrixThermal),
    sourceGroundwaterAquiferMatrixThermal:
      clone(proposal.sourceGroundwaterAquiferMatrixThermal),
    geometry: clone(proposal.geometry),
    transfer: {
      transferId: `${stepId}:paired-sensible-heat`,
      direction: heatToAquiferMatrixJm2 > 0
        ? 'deep-subsurface-matrix-to-aquifer-matrix'
        : heatToAquiferMatrixJm2 < 0
          ? 'aquifer-matrix-to-deep-subsurface-matrix' : 'none',
      signedHeatToAquiferMatrixJm2: Number(heatToAquiferMatrixJm2),
      signedDeepSubsurfaceMatrixOwnerHeatJm2:
        Number(-heatToAquiferMatrixJm2),
      signedAquiferMatrixOwnerHeatJm2:
        Number(heatToAquiferMatrixJm2),
      deepSubsurfaceMatrixOwnerKind:
        'persistent-parameterized-deep-subsurface-mineral-matrix-thermal-owner',
      aquiferMatrixOwnerKind:
        'persistent-parameterized-aquifer-mineral-matrix-thermal-owner',
      senderOwnerDebited: true,
      receiverOwnerCredited: true
    },
    initialDeepSubsurfaceMatrixOwner,
    finalDeepSubsurfaceMatrixOwner,
    initialAquiferMatrixOwner,
    finalAquiferMatrixOwner,
    pairedTransferClosure,
    deepSubsurfaceMatrixOwnerClosure,
    aquiferMatrixOwnerClosure,
    combinedOwnerClosure,
    migrationInitialization: {
      sourceWasNoHistoryCheckpoint:
        column.land.deepAquiferMatrixThermalMigrationCheckpoint === true,
      historicalHeatReconstructed: false
    },
    truth: {
      existingDeepAndAquiferMatrixOwnersPaired: true,
      exactR82AndR80SourcesBound: true,
      explicitSeparationGeometryUsed: true,
      ownerIntervalsOverlap: false,
      signedDeepSubsurfaceMatrixOwnerEntryApplied: true,
      signedAquiferMatrixOwnerEntryApplied: true,
      deepSubsurfaceMatrixGeometryUnchangedByThisOrgan: true,
      aquiferMatrixGeometryUnchangedByThisOrgan: true,
      bothTemperatureEnvelopesRespected: true,
      scaleAwareNumericClosure: true,
      measuredResidualsPreserved: true,
      fixedAbsoluteToleranceOnly: false,
      distanceAwareBulkResponseParameterized: true,
      externalHeatSourceAdded: false,
      resolvedInterMatrixConduction: false,
      resolvedSubsurfaceConduction: false,
      resolvedAquiferConduction: false,
      geothermalForcingModeledByThisOrgan: false,
      phaseChangeModeledByThisOrgan: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  receipt.digest = stableDigest(receipt);
  deepState.owner = clone(finalDeepSubsurfaceMatrixOwner);
  aquiferState.owner = clone(finalAquiferMatrixOwner);
  column.land.lastDeepAquiferMatrixThermalReceipt = clone(receipt);
  column.land.deepAquiferMatrixThermalMigrationCheckpoint = false;
  return clone(receipt);
}

export function deepAquiferMatrixThermalDescription() {
  return {
    proposalSchema: LAND_DEEP_AQUIFER_MATRIX_THERMAL_PROPOSAL_SCHEMA,
    receiptSchema: LAND_DEEP_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA,
    closureSchema: LAND_DEEP_AQUIFER_MATRIX_THERMAL_CLOSURE_SCHEMA,
    closurePolicySchema:
      LAND_DEEP_AQUIFER_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA,
    baseResponseTimescaleDays:
      LAND_DEEP_AQUIFER_MATRIX_BASE_RESPONSE_TIMESCALE_DAYS,
    distanceScaleM: LAND_DEEP_AQUIFER_MATRIX_DISTANCE_SCALE_M,
    deepSubsurfaceMatrixTemperatureEnvelopeC: {
      minimum: LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C,
      maximum: LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C
    },
    aquiferMatrixTemperatureEnvelopeC: {
      minimum: LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C,
      maximum: LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C
    },
    explicitSeparationGeometryRequired: true,
    distanceAwareBulkResponseParameterized: true,
    resolvedInterMatrixConduction: false,
    resolvedSubsurfaceConduction: false,
    resolvedAquiferConduction: false,
    geothermalForcingModeledByThisOrgan: false,
    phaseChangeModeledByThisOrgan: false,
    scientificCalibrationClaimed: false,
    globalUnloadedBoundaryClaimed: false
  };
}
