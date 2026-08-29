import {
  LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K,
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR,
  LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM
} from './land-hydrology-thermal.mjs?v=0.81.0-r81.1';
import {
  LAND_DEEP_GROUNDWATER_WATER_THERMAL_RECEIPT_SCHEMA,
  LAND_DEEP_GROUNDWATER_WATER_MINIMUM_TEMPERATURE_C,
  LAND_DEEP_GROUNDWATER_WATER_MAXIMUM_TEMPERATURE_C,
  landDeepGroundwaterWaterThermalReceiptValid
} from './deep-groundwater-water-thermal.mjs?v=0.81.0-r81.1';

export const LAND_AQUIFER_MATRIX_THERMAL_STATE_SCHEMA =
  'axm.foundation-planet.land-aquifer-matrix-thermal-state/v1';
export const LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_PROPOSAL_SCHEMA =
  'axm.foundation-planet.land-groundwater-aquifer-matrix-thermal-proposal/v1';
export const LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-groundwater-aquifer-matrix-thermal-receipt/v1';
export const LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_CLOSURE_SCHEMA =
  'axm.foundation-planet.land-groundwater-aquifer-matrix-thermal-closure/v1';
export const LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA =
  'axm.foundation-planet.land-groundwater-aquifer-matrix-thermal-closure-policy/v1';
export const LAND_GROUNDWATER_AQUIFER_MATRIX_RESPONSE_TIMESCALE_DAYS = 90;
export const LAND_AQUIFER_MATRIX_VOLUMETRIC_HEAT_CAPACITY_J_M3_K = 2e6;
export const LAND_AQUIFER_MATRIX_MINIMUM_EFFECTIVE_DEPTH_M = 2;
export const LAND_AQUIFER_MATRIX_MAXIMUM_EFFECTIVE_DEPTH_M = 20;
export const LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C = -20;
export const LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C = 80;

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

export function landGroundwaterAquiferMatrixThermalProposalValid(proposal) {
  return digestValid(proposal,
    LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_PROPOSAL_SCHEMA);
}

export function landGroundwaterAquiferMatrixThermalReceiptValid(receipt) {
  return digestValid(receipt,
    LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA);
}

function same(left, right, tolerance = 1e-12) {
  return Number.isFinite(Number(left)) && Number.isFinite(Number(right)) &&
    Math.abs(Number(left) - Number(right)) <= tolerance;
}

function groundwaterOwnersMatch(left = {}, right = {}) {
  return same(left.trackedWaterMm, right.trackedWaterMm,
      LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(left.sensibleHeatJm2, right.sensibleHeatJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(left.waterTemperatureC, right.waterTemperatureC);
}

export function aquiferMatrixThermalParameters(substrate = {}) {
  const effectiveDepthM = clamp(finite(substrate.aquiferDepthM) * .25,
    LAND_AQUIFER_MATRIX_MINIMUM_EFFECTIVE_DEPTH_M,
    LAND_AQUIFER_MATRIX_MAXIMUM_EFFECTIVE_DEPTH_M);
  const solidFraction = clamp(1 - finite(substrate.porosity, .46),
    .38, .94);
  const heatCapacityJm2K = effectiveDepthM * solidFraction *
    LAND_AQUIFER_MATRIX_VOLUMETRIC_HEAT_CAPACITY_J_M3_K;
  return {
    mode: 'bounded-aquifer-mineral-matrix-bulk-capacity',
    effectiveDepthM: Number(effectiveDepthM),
    solidFraction: Number(solidFraction),
    volumetricHeatCapacityJm3K:
      LAND_AQUIFER_MATRIX_VOLUMETRIC_HEAT_CAPACITY_J_M3_K,
    heatCapacityJm2K: Number(heatCapacityJm2K)
  };
}

function matrixOwner(parameters, temperatureC) {
  const temperature = clamp(finite(temperatureC),
    LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C,
    LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C);
  return {
    materialClass: 'parameterized-aquifer-mineral-matrix',
    effectiveDepthM: Number(parameters.effectiveDepthM),
    solidFraction: Number(parameters.solidFraction),
    volumetricHeatCapacityJm3K:
      Number(parameters.volumetricHeatCapacityJm3K),
    heatCapacityJm2K: Number(parameters.heatCapacityJm2K),
    temperatureC: Number(temperature),
    sensibleHeatJm2: Number(parameters.heatCapacityJm2K * temperature)
  };
}

function matrixOwnersMatch(left = {}, right = {}) {
  return left.materialClass === right.materialClass &&
    same(left.effectiveDepthM, right.effectiveDepthM) &&
    same(left.solidFraction, right.solidFraction) &&
    same(left.volumetricHeatCapacityJm3K,
      right.volumetricHeatCapacityJm3K) &&
    same(left.heatCapacityJm2K, right.heatCapacityJm2K, 1e-6) &&
    same(left.temperatureC, right.temperatureC) &&
    same(left.sensibleHeatJm2, right.sensibleHeatJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);
}

export function createLandAquiferMatrixThermalState(substrate,
  temperatureC, options = {}) {
  const parameters = aquiferMatrixThermalParameters(substrate);
  return {
    schema: LAND_AQUIFER_MATRIX_THERMAL_STATE_SCHEMA,
    parameterization: parameters,
    owner: matrixOwner(parameters, temperatureC),
    lastStepReceipt: null,
    migrationCheckpoint: options.migrationCheckpoint === true,
    migration: {
      historicalHeatReconstructed: false,
      initializedFromCurrentGroundwaterTemperature:
        options.migrationCheckpoint === true,
      sourceEngineSchema: options.sourceEngineSchema || null
    },
    truth: {
      persistentAquiferMatrixSensibleHeatOwner: true,
      distinctFromLandSurfaceSensibleHeatOwner: true,
      bulkCapacityParameterized: true,
      resolvedAquiferConduction: false,
      geothermalForcingModeled: false,
      scientificCalibrationClaimed: false
    }
  };
}

export function normalizeLandAquiferMatrixThermalState(state, substrate,
  groundwaterTemperatureC, options = {}) {
  const expectedParameters = aquiferMatrixThermalParameters(substrate);
  const expectedAtStoredTemperature = matrixOwner(expectedParameters,
    state?.owner?.temperatureC);
  const validStoredOwner = state?.schema ===
      LAND_AQUIFER_MATRIX_THERMAL_STATE_SCHEMA &&
    matrixOwnersMatch(state.owner, expectedAtStoredTemperature) &&
    Number(state.owner.temperatureC) >=
      LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C &&
    Number(state.owner.temperatureC) <=
      LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C;
  if (!validStoredOwner || options.preserveState !== true) {
    return createLandAquiferMatrixThermalState(substrate,
      groundwaterTemperatureC, {
        migrationCheckpoint: options.migrationCheckpoint === true,
        sourceEngineSchema: options.sourceEngineSchema
      });
  }
  const normalized = clone(state);
  normalized.parameterization = expectedParameters;
  normalized.owner = expectedAtStoredTemperature;
  normalized.lastStepReceipt =
    options.preserveEvidence === true &&
      landGroundwaterAquiferMatrixThermalReceiptValid(
        state.lastStepReceipt)
      ? clone(state.lastStepReceipt) : null;
  normalized.migrationCheckpoint = normalized.lastStepReceipt
    ? false : state.migrationCheckpoint === true;
  normalized.migration = {
    historicalHeatReconstructed: false,
    initializedFromCurrentGroundwaterTemperature:
      normalized.migrationCheckpoint,
    sourceEngineSchema: normalized.migration?.sourceEngineSchema || null
  };
  normalized.truth = {
    persistentAquiferMatrixSensibleHeatOwner: true,
    distinctFromLandSurfaceSensibleHeatOwner: true,
    bulkCapacityParameterized: true,
    resolvedAquiferConduction: false,
    geothermalForcingModeled: false,
    scientificCalibrationClaimed: false
  };
  return normalized;
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
    schema: LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_CLOSURE_SCHEMA,
    policy: {
      schema:
        LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA,
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

export function planLandGroundwaterAquiferMatrixThermalExchange(column,
  deepGroundwaterWaterThermalReceipt, durationDays, context = {}) {
  const reservoirs = column?.land?.hydrologyThermal?.reservoirs;
  const state = column?.land?.aquiferMatrixThermal;
  if (column?.kind !== 'land' || !reservoirs?.groundwater ||
      state?.schema !== LAND_AQUIFER_MATRIX_THERMAL_STATE_SCHEMA) {
    throw new Error('Groundwater-aquifer-matrix thermal planning requires a land column and persistent matrix owner');
  }
  if (!landDeepGroundwaterWaterThermalReceiptValid(
      deepGroundwaterWaterThermalReceipt)) {
    throw new Error('Groundwater-aquifer-matrix thermal planning requires intact current R79 evidence');
  }
  const duration = finite(durationDays);
  if (!(duration > 0) || duration > 1.000001) {
    throw new Error('Groundwater-aquifer-matrix thermal planning requires a bounded positive duration');
  }
  const expectedParameters = aquiferMatrixThermalParameters(
    column.substrate);
  if (!groundwaterOwnersMatch(reservoirs.groundwater,
      deepGroundwaterWaterThermalReceipt.finalGroundwaterOwner) ||
      !matrixOwnersMatch(state.owner,
        matrixOwner(expectedParameters, state.owner.temperatureC))) {
    throw new Error('Groundwater-aquifer-matrix thermal planning is detached from the current owners');
  }

  const initialGroundwaterOwner = clone(reservoirs.groundwater);
  const initialAquiferMatrixOwner = clone(state.owner);
  const groundwaterHeatCapacityJm2K = Math.max(0,
    finite(initialGroundwaterOwner.trackedWaterMm)) *
      LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K;
  const matrixHeatCapacityJm2K = Math.max(0,
    finite(initialAquiferMatrixOwner.heatCapacityJm2K));
  const responseFraction = 1 - Math.exp(-duration /
    LAND_GROUNDWATER_AQUIFER_MATRIX_RESPONSE_TIMESCALE_DAYS);
  const jointHeatCapacityJm2K = groundwaterHeatCapacityJm2K > 0 &&
      matrixHeatCapacityJm2K > 0
    ? groundwaterHeatCapacityJm2K * matrixHeatCapacityJm2K /
      (groundwaterHeatCapacityJm2K + matrixHeatCapacityJm2K)
    : 0;
  const requestedHeatToGroundwaterJm2 = jointHeatCapacityJm2K *
    (initialAquiferMatrixOwner.temperatureC -
      initialGroundwaterOwner.waterTemperatureC) * responseFraction;
  const minimumHeatToGroundwaterJm2 = Math.max(
    groundwaterHeatCapacityJm2K *
      (LAND_DEEP_GROUNDWATER_WATER_MINIMUM_TEMPERATURE_C -
        initialGroundwaterOwner.waterTemperatureC),
    matrixHeatCapacityJm2K *
      (initialAquiferMatrixOwner.temperatureC -
        LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C));
  const maximumHeatToGroundwaterJm2 = Math.min(
    groundwaterHeatCapacityJm2K *
      (LAND_DEEP_GROUNDWATER_WATER_MAXIMUM_TEMPERATURE_C -
        initialGroundwaterOwner.waterTemperatureC),
    matrixHeatCapacityJm2K *
      (initialAquiferMatrixOwner.temperatureC -
        LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C));
  const appliedHeatToGroundwaterJm2 = groundwaterHeatCapacityJm2K > 0 &&
      matrixHeatCapacityJm2K > 0
    ? clamp(requestedHeatToGroundwaterJm2,
      minimumHeatToGroundwaterJm2, maximumHeatToGroundwaterJm2)
    : 0;
  const proposal = {
    schema: LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_PROPOSAL_SCHEMA,
    stepId: String(context.stepId ||
      `${deepGroundwaterWaterThermalReceipt.stepId}:aquifer-matrix-plan`),
    durationDays: Number(duration),
    sourceDeepGroundwaterWaterThermal: {
      schema: deepGroundwaterWaterThermalReceipt.schema,
      receiptDigest: deepGroundwaterWaterThermalReceipt.digest,
      stepId: deepGroundwaterWaterThermalReceipt.stepId
    },
    initialGroundwaterOwner,
    initialAquiferMatrixOwner,
    response: {
      mode: 'bounded-groundwater-water-aquifer-matrix-bulk-response',
      responseTimescaleDays:
        LAND_GROUNDWATER_AQUIFER_MATRIX_RESPONSE_TIMESCALE_DAYS,
      responseFraction: Number(responseFraction),
      groundwaterWaterHeatCapacityJm2K:
        Number(groundwaterHeatCapacityJm2K),
      aquiferMatrixHeatCapacityJm2K: Number(matrixHeatCapacityJm2K),
      jointHeatCapacityJm2K: Number(jointHeatCapacityJm2K)
    },
    requestedHeatToGroundwaterJm2: Number(requestedHeatToGroundwaterJm2),
    minimumHeatToGroundwaterJm2: Number(minimumHeatToGroundwaterJm2),
    maximumHeatToGroundwaterJm2: Number(maximumHeatToGroundwaterJm2),
    appliedHeatToGroundwaterJm2: Number(appliedHeatToGroundwaterJm2),
    thermalEnvelopeLimiterJm2: Number(
      appliedHeatToGroundwaterJm2 - requestedHeatToGroundwaterJm2),
    truth: {
      existingGroundwaterWaterAndAquiferMatrixOwnersOnly: true,
      twoOwnerEquilibriumNotCrossed: true,
      bothTemperatureEnvelopesApplied: true,
      groundwaterWaterUnchangedByThisProposal: true,
      aquiferMatrixGeometryUnchangedByThisProposal: true,
      bulkResponseParameterized: true,
      aquiferMatrixThermalExchangeModeled: true,
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

export function applyLandGroundwaterAquiferMatrixThermalExchange(column,
  proposal, deepGroundwaterWaterThermalReceipt, context = {}) {
  const reservoirs = column?.land?.hydrologyThermal?.reservoirs;
  const state = column?.land?.aquiferMatrixThermal;
  if (column?.kind !== 'land' || !reservoirs?.groundwater ||
      state?.schema !== LAND_AQUIFER_MATRIX_THERMAL_STATE_SCHEMA) {
    throw new Error('Groundwater-aquifer-matrix thermal application requires a land column and persistent matrix owner');
  }
  if (!landGroundwaterAquiferMatrixThermalProposalValid(proposal) ||
      !landDeepGroundwaterWaterThermalReceiptValid(
        deepGroundwaterWaterThermalReceipt)) {
    throw new Error('Groundwater-aquifer-matrix thermal application requires intact current source evidence');
  }
  const sourcesBound =
    proposal.sourceDeepGroundwaterWaterThermal?.receiptDigest ===
      deepGroundwaterWaterThermalReceipt.digest &&
    proposal.sourceDeepGroundwaterWaterThermal?.stepId ===
      deepGroundwaterWaterThermalReceipt.stepId &&
    column.land.lastDeepGroundwaterWaterThermalReceipt?.digest ===
      deepGroundwaterWaterThermalReceipt.digest &&
    groundwaterOwnersMatch(proposal.initialGroundwaterOwner,
      reservoirs.groundwater) &&
    groundwaterOwnersMatch(proposal.initialGroundwaterOwner,
      deepGroundwaterWaterThermalReceipt.finalGroundwaterOwner) &&
    matrixOwnersMatch(proposal.initialAquiferMatrixOwner, state.owner);
  if (!sourcesBound) {
    throw new Error('Groundwater-aquifer-matrix thermal source evidence is detached');
  }

  const heatToGroundwaterJm2 = Number(
    proposal.appliedHeatToGroundwaterJm2);
  const initialGroundwaterOwner = clone(reservoirs.groundwater);
  const initialAquiferMatrixOwner = clone(state.owner);
  const groundwaterHeatCapacityJm2K = Math.max(0,
    finite(initialGroundwaterOwner.trackedWaterMm)) *
      LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K;
  const matrixHeatCapacityJm2K = Math.max(0,
    finite(initialAquiferMatrixOwner.heatCapacityJm2K));
  const finalGroundwaterHeatJm2 =
    finite(initialGroundwaterOwner.sensibleHeatJm2) +
      heatToGroundwaterJm2;
  const finalMatrixHeatJm2 =
    finite(initialAquiferMatrixOwner.sensibleHeatJm2) -
      heatToGroundwaterJm2;
  const finalGroundwaterTemperatureC = groundwaterHeatCapacityJm2K > 0
    ? finalGroundwaterHeatJm2 / groundwaterHeatCapacityJm2K
    : initialGroundwaterOwner.waterTemperatureC;
  const finalMatrixTemperatureC = matrixHeatCapacityJm2K > 0
    ? finalMatrixHeatJm2 / matrixHeatCapacityJm2K
    : initialAquiferMatrixOwner.temperatureC;
  if (finalGroundwaterTemperatureC <
        LAND_DEEP_GROUNDWATER_WATER_MINIMUM_TEMPERATURE_C - 1e-12 ||
      finalGroundwaterTemperatureC >
        LAND_DEEP_GROUNDWATER_WATER_MAXIMUM_TEMPERATURE_C + 1e-12 ||
      finalMatrixTemperatureC <
        LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C - 1e-12 ||
      finalMatrixTemperatureC >
        LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C + 1e-12) {
    throw new Error('Groundwater-aquifer-matrix exchange exceeds a declared temperature envelope');
  }
  const finalGroundwaterOwner = {
    trackedWaterMm: Number(initialGroundwaterOwner.trackedWaterMm),
    sensibleHeatJm2: groundwaterHeatCapacityJm2K > 0
      ? Number(finalGroundwaterHeatJm2) : 0,
    waterTemperatureC: Number(finalGroundwaterTemperatureC)
  };
  const finalAquiferMatrixOwner = {
    ...clone(initialAquiferMatrixOwner),
    temperatureC: Number(finalMatrixTemperatureC),
    sensibleHeatJm2: matrixHeatCapacityJm2K > 0
      ? Number(finalMatrixHeatJm2) : 0
  };
  const pairedTransferClosure = closure([
    heatToGroundwaterJm2,
    -heatToGroundwaterJm2
  ]);
  const groundwaterOwnerClosure = closure([
    finalGroundwaterOwner.sensibleHeatJm2,
    -initialGroundwaterOwner.sensibleHeatJm2,
    -heatToGroundwaterJm2
  ]);
  const aquiferMatrixOwnerClosure = closure([
    finalAquiferMatrixOwner.sensibleHeatJm2,
    -initialAquiferMatrixOwner.sensibleHeatJm2,
    heatToGroundwaterJm2
  ]);
  const combinedOwnerClosure = closure([
    finalGroundwaterOwner.sensibleHeatJm2,
    finalAquiferMatrixOwner.sensibleHeatJm2,
    -initialGroundwaterOwner.sensibleHeatJm2,
    -initialAquiferMatrixOwner.sensibleHeatJm2
  ]);
  if (!pairedTransferClosure.closed ||
      !groundwaterOwnerClosure.closed ||
      !aquiferMatrixOwnerClosure.closed || !combinedOwnerClosure.closed) {
    throw new Error('Groundwater-aquifer-matrix thermal exchange did not close');
  }
  const stepId = String(context.stepId ||
    `${proposal.stepId}:application`);
  const receipt = {
    schema: LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA,
    stepId,
    status: Math.abs(heatToGroundwaterJm2) <=
        LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J
      ? 'no-material-groundwater-aquifer-matrix-heat-transfer'
      : heatToGroundwaterJm2 > 0
        ? 'aquifer-matrix-heat-debited-to-groundwater-water'
        : 'groundwater-water-heat-debited-to-aquifer-matrix',
    sourceProposal: {
      schema: proposal.schema,
      receiptDigest: proposal.digest,
      stepId: proposal.stepId,
      proposal: clone(proposal)
    },
    sourceDeepGroundwaterWaterThermal:
      clone(proposal.sourceDeepGroundwaterWaterThermal),
    transfer: {
      transferId: `${stepId}:paired-sensible-heat`,
      direction: heatToGroundwaterJm2 > 0
        ? 'aquifer-matrix-to-groundwater-water'
        : heatToGroundwaterJm2 < 0
          ? 'groundwater-water-to-aquifer-matrix' : 'none',
      signedHeatToGroundwaterJm2: Number(heatToGroundwaterJm2),
      signedGroundwaterOwnerHeatJm2: Number(heatToGroundwaterJm2),
      signedAquiferMatrixOwnerHeatJm2: Number(-heatToGroundwaterJm2),
      groundwaterOwnerKind:
        'persistent-land-hydrology-groundwater-water-thermal-owner',
      aquiferMatrixOwnerKind:
        'persistent-parameterized-aquifer-mineral-matrix-thermal-owner',
      senderOwnerDebited: true,
      receiverOwnerCredited: true
    },
    initialGroundwaterOwner,
    finalGroundwaterOwner,
    initialAquiferMatrixOwner,
    finalAquiferMatrixOwner,
    pairedTransferClosure,
    groundwaterOwnerClosure,
    aquiferMatrixOwnerClosure,
    combinedOwnerClosure,
    migrationInitialization: {
      sourceWasNoHistoryCheckpoint: state.migrationCheckpoint === true,
      historicalHeatReconstructed: false
    },
    truth: {
      existingGroundwaterWaterAndAquiferMatrixOwnersPaired: true,
      signedGroundwaterOwnerEntryApplied: true,
      signedAquiferMatrixOwnerEntryApplied: true,
      groundwaterWaterUnchangedByThisOrgan: true,
      aquiferMatrixGeometryUnchangedByThisOrgan: true,
      bothTemperatureEnvelopesRespected: true,
      sourceReceiptExactlyBound: true,
      scaleAwareNumericClosure: true,
      measuredResidualsPreserved: true,
      fixedAbsoluteToleranceOnly: false,
      bulkResponseParameterized: true,
      aquiferMatrixThermalExchangeModeled: true,
      distinctFromLandSurfaceSensibleHeatOwner: true,
      resolvedAquiferConduction: false,
      geothermalForcingModeledByThisOrgan: false,
      phaseChangeModeledByThisOrgan: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  receipt.digest = stableDigest(receipt);
  reservoirs.groundwater = clone(finalGroundwaterOwner);
  state.owner = clone(finalAquiferMatrixOwner);
  state.lastStepReceipt = clone(receipt);
  state.migrationCheckpoint = false;
  state.migration = {
    historicalHeatReconstructed: false,
    initializedFromCurrentGroundwaterTemperature: false,
    sourceEngineSchema: null
  };
  return clone(receipt);
}

export function groundwaterAquiferMatrixThermalDescription() {
  return {
    stateSchema: LAND_AQUIFER_MATRIX_THERMAL_STATE_SCHEMA,
    proposalSchema:
      LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_PROPOSAL_SCHEMA,
    receiptSchema:
      LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA,
    closureSchema:
      LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_CLOSURE_SCHEMA,
    closurePolicySchema:
      LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA,
    responseTimescaleDays:
      LAND_GROUNDWATER_AQUIFER_MATRIX_RESPONSE_TIMESCALE_DAYS,
    aquiferMatrixVolumetricHeatCapacityJm3K:
      LAND_AQUIFER_MATRIX_VOLUMETRIC_HEAT_CAPACITY_J_M3_K,
    effectiveDepthEnvelopeM: {
      minimum: LAND_AQUIFER_MATRIX_MINIMUM_EFFECTIVE_DEPTH_M,
      maximum: LAND_AQUIFER_MATRIX_MAXIMUM_EFFECTIVE_DEPTH_M
    },
    groundwaterWaterTemperatureEnvelopeC: {
      minimum: LAND_DEEP_GROUNDWATER_WATER_MINIMUM_TEMPERATURE_C,
      maximum: LAND_DEEP_GROUNDWATER_WATER_MAXIMUM_TEMPERATURE_C
    },
    aquiferMatrixTemperatureEnvelopeC: {
      minimum: LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C,
      maximum: LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C
    },
    persistentAquiferMatrixSensibleHeatOwner: true,
    distinctFromLandSurfaceSensibleHeatOwner: true,
    bulkResponseParameterized: true,
    aquiferMatrixThermalExchangeModeled: true,
    resolvedAquiferConduction: false,
    geothermalForcingModeledByThisOrgan: false,
    phaseChangeModeledByThisOrgan: false,
    scientificCalibrationClaimed: false,
    globalUnloadedBoundaryClaimed: false
  };
}
