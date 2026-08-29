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
import {
  LAND_AQUIFER_MATRIX_MINIMUM_EFFECTIVE_DEPTH_M,
  LAND_AQUIFER_MATRIX_MAXIMUM_EFFECTIVE_DEPTH_M
} from './groundwater-aquifer-matrix-thermal.mjs?v=0.81.0-r81.1';

export const LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA =
  'axm.foundation-planet.land-deep-subsurface-matrix-thermal-state/v1';
export const LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_PROPOSAL_SCHEMA =
  'axm.foundation-planet.land-deep-soil-subsurface-matrix-thermal-proposal/v1';
export const LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-deep-soil-subsurface-matrix-thermal-receipt/v1';
export const LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_CLOSURE_SCHEMA =
  'axm.foundation-planet.land-deep-soil-subsurface-matrix-thermal-closure/v1';
export const LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA =
  'axm.foundation-planet.land-deep-soil-subsurface-matrix-thermal-closure-policy/v1';
export const LAND_DEEP_SOIL_SUBSURFACE_MATRIX_RESPONSE_TIMESCALE_DAYS = 45;
export const LAND_DEEP_SUBSURFACE_MATRIX_VOLUMETRIC_HEAT_CAPACITY_J_M3_K =
  2e6;
export const LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_EFFECTIVE_DEPTH_M = .5;
export const LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_EFFECTIVE_DEPTH_M = 8;
export const LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C = -20;
export const LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C = 80;

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

export function landDeepSoilSubsurfaceMatrixThermalProposalValid(
  proposal) {
  return digestValid(proposal,
    LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_PROPOSAL_SCHEMA);
}

export function landDeepSoilSubsurfaceMatrixThermalReceiptValid(receipt) {
  return digestValid(receipt,
    LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA);
}

function same(left, right, tolerance = 1e-12) {
  return Number.isFinite(Number(left)) && Number.isFinite(Number(right)) &&
    Math.abs(Number(left) - Number(right)) <= tolerance;
}

function deepSoilOwnersMatch(left = {}, right = {}) {
  return same(left.trackedWaterMm, right.trackedWaterMm,
      LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(left.sensibleHeatJm2, right.sensibleHeatJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(left.waterTemperatureC, right.waterTemperatureC);
}

export function deepSubsurfaceMatrixThermalParameters(substrate = {}) {
  const surfaceOwnerLowerBoundaryDepthM = clamp(
    finite(substrate.soilDepthM, .3), .03, 5.5);
  const aquiferDepthM = clamp(finite(substrate.aquiferDepthM, 8), 8, 90);
  const aquiferMatrixEffectiveDepthM = clamp(aquiferDepthM * .25,
    LAND_AQUIFER_MATRIX_MINIMUM_EFFECTIVE_DEPTH_M,
    LAND_AQUIFER_MATRIX_MAXIMUM_EFFECTIVE_DEPTH_M);
  const aquiferMatrixUpperBoundaryDepthM = Math.max(
    surfaceOwnerLowerBoundaryDepthM,
    aquiferDepthM - aquiferMatrixEffectiveDepthM);
  const availableNonOverlappingThicknessM = Math.max(0,
    aquiferMatrixUpperBoundaryDepthM -
      surfaceOwnerLowerBoundaryDepthM);
  const effectiveDepthM = availableNonOverlappingThicknessM >=
      LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_EFFECTIVE_DEPTH_M
    ? clamp(availableNonOverlappingThicknessM * .25,
      LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_EFFECTIVE_DEPTH_M,
      Math.min(LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_EFFECTIVE_DEPTH_M,
        availableNonOverlappingThicknessM))
    : 0;
  const upperBoundaryDepthM = surfaceOwnerLowerBoundaryDepthM;
  const lowerBoundaryDepthM = upperBoundaryDepthM + effectiveDepthM;
  const separationToAquiferMatrixM = Math.max(0,
    aquiferMatrixUpperBoundaryDepthM - lowerBoundaryDepthM);
  const solidFraction = clamp(1 - finite(substrate.porosity, .46),
    .38, .94);
  const heatCapacityJm2K = effectiveDepthM * solidFraction *
    LAND_DEEP_SUBSURFACE_MATRIX_VOLUMETRIC_HEAT_CAPACITY_J_M3_K;
  return {
    mode: 'bounded-non-overlapping-deep-subsurface-mineral-matrix-capacity',
    surfaceOwnerLowerBoundaryDepthM:
      Number(surfaceOwnerLowerBoundaryDepthM),
    aquiferMatrixUpperBoundaryDepthM:
      Number(aquiferMatrixUpperBoundaryDepthM),
    availableNonOverlappingThicknessM:
      Number(availableNonOverlappingThicknessM),
    upperBoundaryDepthM: Number(upperBoundaryDepthM),
    lowerBoundaryDepthM: Number(lowerBoundaryDepthM),
    effectiveDepthM: Number(effectiveDepthM),
    separationToAquiferMatrixM: Number(separationToAquiferMatrixM),
    solidFraction: Number(solidFraction),
    volumetricHeatCapacityJm3K:
      LAND_DEEP_SUBSURFACE_MATRIX_VOLUMETRIC_HEAT_CAPACITY_J_M3_K,
    heatCapacityJm2K: Number(heatCapacityJm2K)
  };
}

function matrixOwner(parameters, temperatureC) {
  const temperature = clamp(finite(temperatureC),
    LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C,
    LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C);
  return {
    materialClass: 'parameterized-deep-subsurface-mineral-matrix',
    upperBoundaryDepthM: Number(parameters.upperBoundaryDepthM),
    lowerBoundaryDepthM: Number(parameters.lowerBoundaryDepthM),
    effectiveDepthM: Number(parameters.effectiveDepthM),
    separationToAquiferMatrixM:
      Number(parameters.separationToAquiferMatrixM),
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

export function createLandDeepSubsurfaceMatrixThermalState(substrate,
  temperatureC, options = {}) {
  const parameters = deepSubsurfaceMatrixThermalParameters(substrate);
  return {
    schema: LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA,
    parameterization: parameters,
    owner: matrixOwner(parameters, temperatureC),
    lastStepReceipt: null,
    migrationCheckpoint: options.migrationCheckpoint === true,
    migration: {
      historicalHeatReconstructed: false,
      initializedFromCurrentDeepSoilWaterTemperature:
        options.migrationCheckpoint === true,
      sourceEngineSchema: options.sourceEngineSchema || null
    },
    truth: {
      persistentDeepSubsurfaceMatrixSensibleHeatOwner: true,
      distinctFromLandSurfaceSensibleHeatOwner: true,
      distinctFromAquiferMatrixSensibleHeatOwner: true,
      intervalGeometryExplicit: true,
      bulkCapacityParameterized: true,
      resolvedSubsurfaceConduction: false,
      geothermalForcingModeled: false,
      scientificCalibrationClaimed: false
    }
  };
}

export function normalizeLandDeepSubsurfaceMatrixThermalState(state,
  substrate, deepSoilWaterTemperatureC, options = {}) {
  const expectedParameters = deepSubsurfaceMatrixThermalParameters(
    substrate);
  const expectedOwner = matrixOwner(expectedParameters,
    state?.owner?.temperatureC);
  const validStoredOwner = state?.schema ===
      LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA &&
    expectedParameters.effectiveDepthM > 0 &&
    matrixOwnersMatch(state.owner, expectedOwner);
  if (!validStoredOwner || options.preserveState !== true) {
    return createLandDeepSubsurfaceMatrixThermalState(substrate,
      deepSoilWaterTemperatureC, {
        migrationCheckpoint: options.migrationCheckpoint === true,
        sourceEngineSchema: options.sourceEngineSchema
      });
  }
  const normalized = clone(state);
  normalized.parameterization = expectedParameters;
  normalized.owner = expectedOwner;
  normalized.lastStepReceipt = options.preserveEvidence === true &&
      landDeepSoilSubsurfaceMatrixThermalReceiptValid(
        state.lastStepReceipt)
    ? clone(state.lastStepReceipt) : null;
  normalized.migrationCheckpoint = normalized.lastStepReceipt
    ? false : state.migrationCheckpoint === true;
  normalized.migration = {
    historicalHeatReconstructed: false,
    initializedFromCurrentDeepSoilWaterTemperature:
      normalized.migrationCheckpoint,
    sourceEngineSchema: normalized.migration?.sourceEngineSchema || null
  };
  normalized.truth = {
    persistentDeepSubsurfaceMatrixSensibleHeatOwner: true,
    distinctFromLandSurfaceSensibleHeatOwner: true,
    distinctFromAquiferMatrixSensibleHeatOwner: true,
    intervalGeometryExplicit: true,
    bulkCapacityParameterized: true,
    resolvedSubsurfaceConduction: false,
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
    schema: LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_CLOSURE_SCHEMA,
    policy: {
      schema:
        LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA,
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

export function planLandDeepSoilSubsurfaceMatrixThermalExchange(column,
  deepGroundwaterWaterThermalReceipt, durationDays, context = {}) {
  const reservoirs = column?.land?.hydrologyThermal?.reservoirs;
  const state = column?.land?.deepSubsurfaceMatrixThermal;
  if (column?.kind !== 'land' || !reservoirs?.deepSoil ||
      state?.schema !== LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA) {
    throw new Error('Deep-soil/subsurface-matrix planning requires a land column and persistent matrix owner');
  }
  if (!landDeepGroundwaterWaterThermalReceiptValid(
      deepGroundwaterWaterThermalReceipt)) {
    throw new Error('Deep-soil/subsurface-matrix planning requires intact current R79 evidence');
  }
  const duration = finite(durationDays);
  if (!(duration > 0) || duration > 1.000001) {
    throw new Error('Deep-soil/subsurface-matrix planning requires a bounded positive duration');
  }
  const expectedParameters = deepSubsurfaceMatrixThermalParameters(
    column.substrate);
  if (!(expectedParameters.effectiveDepthM > 0) ||
      !deepSoilOwnersMatch(reservoirs.deepSoil,
        deepGroundwaterWaterThermalReceipt.finalDeepSoilOwner) ||
      !matrixOwnersMatch(state.owner,
        matrixOwner(expectedParameters, state.owner.temperatureC))) {
    throw new Error('Deep-soil/subsurface-matrix planning is detached from the current non-overlapping owners');
  }

  const initialDeepSoilOwner = clone(reservoirs.deepSoil);
  const initialDeepSubsurfaceMatrixOwner = clone(state.owner);
  const deepSoilHeatCapacityJm2K = Math.max(0,
    finite(initialDeepSoilOwner.trackedWaterMm)) *
      LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K;
  const matrixHeatCapacityJm2K = Math.max(0,
    finite(initialDeepSubsurfaceMatrixOwner.heatCapacityJm2K));
  const responseFraction = 1 - Math.exp(-duration /
    LAND_DEEP_SOIL_SUBSURFACE_MATRIX_RESPONSE_TIMESCALE_DAYS);
  const jointHeatCapacityJm2K = deepSoilHeatCapacityJm2K > 0 &&
      matrixHeatCapacityJm2K > 0
    ? deepSoilHeatCapacityJm2K * matrixHeatCapacityJm2K /
      (deepSoilHeatCapacityJm2K + matrixHeatCapacityJm2K)
    : 0;
  const requestedHeatToDeepSoilJm2 = jointHeatCapacityJm2K *
    (initialDeepSubsurfaceMatrixOwner.temperatureC -
      initialDeepSoilOwner.waterTemperatureC) * responseFraction;
  const minimumHeatToDeepSoilJm2 = Math.max(
    deepSoilHeatCapacityJm2K *
      (LAND_DEEP_GROUNDWATER_WATER_MINIMUM_TEMPERATURE_C -
        initialDeepSoilOwner.waterTemperatureC),
    matrixHeatCapacityJm2K *
      (initialDeepSubsurfaceMatrixOwner.temperatureC -
        LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C));
  const maximumHeatToDeepSoilJm2 = Math.min(
    deepSoilHeatCapacityJm2K *
      (LAND_DEEP_GROUNDWATER_WATER_MAXIMUM_TEMPERATURE_C -
        initialDeepSoilOwner.waterTemperatureC),
    matrixHeatCapacityJm2K *
      (initialDeepSubsurfaceMatrixOwner.temperatureC -
        LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C));
  const appliedHeatToDeepSoilJm2 = deepSoilHeatCapacityJm2K > 0 &&
      matrixHeatCapacityJm2K > 0
    ? clamp(requestedHeatToDeepSoilJm2,
      minimumHeatToDeepSoilJm2, maximumHeatToDeepSoilJm2)
    : 0;
  const proposal = {
    schema: LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_PROPOSAL_SCHEMA,
    stepId: String(context.stepId ||
      `${deepGroundwaterWaterThermalReceipt.stepId}:deep-subsurface-matrix-plan`),
    durationDays: Number(duration),
    sourceDeepGroundwaterWaterThermal: {
      schema: LAND_DEEP_GROUNDWATER_WATER_THERMAL_RECEIPT_SCHEMA,
      receiptDigest: deepGroundwaterWaterThermalReceipt.digest,
      stepId: deepGroundwaterWaterThermalReceipt.stepId
    },
    initialDeepSoilOwner,
    initialDeepSubsurfaceMatrixOwner,
    geometry: clone(expectedParameters),
    response: {
      mode: 'bounded-deep-soil-water-subsurface-matrix-bulk-response',
      responseTimescaleDays:
        LAND_DEEP_SOIL_SUBSURFACE_MATRIX_RESPONSE_TIMESCALE_DAYS,
      responseFraction: Number(responseFraction),
      deepSoilWaterHeatCapacityJm2K: Number(deepSoilHeatCapacityJm2K),
      deepSubsurfaceMatrixHeatCapacityJm2K:
        Number(matrixHeatCapacityJm2K),
      jointHeatCapacityJm2K: Number(jointHeatCapacityJm2K)
    },
    requestedHeatToDeepSoilJm2: Number(requestedHeatToDeepSoilJm2),
    minimumHeatToDeepSoilJm2: Number(minimumHeatToDeepSoilJm2),
    maximumHeatToDeepSoilJm2: Number(maximumHeatToDeepSoilJm2),
    appliedHeatToDeepSoilJm2: Number(appliedHeatToDeepSoilJm2),
    thermalEnvelopeLimiterJm2: Number(
      appliedHeatToDeepSoilJm2 - requestedHeatToDeepSoilJm2),
    truth: {
      existingDeepSoilWaterAndSubsurfaceMatrixOwnersOnly: true,
      intervalBelowSurfaceOwner: true,
      intervalAboveAquiferMatrixOwner: true,
      ownerIntervalsDoNotOverlap: true,
      twoOwnerEquilibriumNotCrossed: true,
      bothTemperatureEnvelopesApplied: true,
      deepSoilWaterUnchangedByThisProposal: true,
      subsurfaceMatrixGeometryUnchangedByThisProposal: true,
      bulkResponseParameterized: true,
      resolvedSubsurfaceConduction: false,
      geothermalForcingModeledByThisProposal: false,
      phaseChangeModeledByThisProposal: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  proposal.digest = stableDigest(proposal);
  return clone(proposal);
}

export function applyLandDeepSoilSubsurfaceMatrixThermalExchange(column,
  proposal, deepGroundwaterWaterThermalReceipt, context = {}) {
  const reservoirs = column?.land?.hydrologyThermal?.reservoirs;
  const state = column?.land?.deepSubsurfaceMatrixThermal;
  if (column?.kind !== 'land' || !reservoirs?.deepSoil ||
      state?.schema !== LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA) {
    throw new Error('Deep-soil/subsurface-matrix application requires a land column and persistent matrix owner');
  }
  if (!landDeepSoilSubsurfaceMatrixThermalProposalValid(proposal) ||
      !landDeepGroundwaterWaterThermalReceiptValid(
        deepGroundwaterWaterThermalReceipt)) {
    throw new Error('Deep-soil/subsurface-matrix application requires intact current source evidence');
  }
  const sourcesBound =
    proposal.sourceDeepGroundwaterWaterThermal?.receiptDigest ===
      deepGroundwaterWaterThermalReceipt.digest &&
    proposal.sourceDeepGroundwaterWaterThermal?.stepId ===
      deepGroundwaterWaterThermalReceipt.stepId &&
    column.land.lastDeepGroundwaterWaterThermalReceipt?.digest ===
      deepGroundwaterWaterThermalReceipt.digest &&
    deepSoilOwnersMatch(proposal.initialDeepSoilOwner,
      reservoirs.deepSoil) &&
    deepSoilOwnersMatch(proposal.initialDeepSoilOwner,
      deepGroundwaterWaterThermalReceipt.finalDeepSoilOwner) &&
    matrixOwnersMatch(proposal.initialDeepSubsurfaceMatrixOwner,
      state.owner);
  if (!sourcesBound) {
    throw new Error('Deep-soil/subsurface-matrix source evidence is detached');
  }

  const heatToDeepSoilJm2 = Number(proposal.appliedHeatToDeepSoilJm2);
  const initialDeepSoilOwner = clone(reservoirs.deepSoil);
  const initialDeepSubsurfaceMatrixOwner = clone(state.owner);
  const deepSoilHeatCapacityJm2K = Math.max(0,
    finite(initialDeepSoilOwner.trackedWaterMm)) *
      LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K;
  const matrixHeatCapacityJm2K = Math.max(0,
    finite(initialDeepSubsurfaceMatrixOwner.heatCapacityJm2K));
  const finalDeepSoilHeatJm2 =
    finite(initialDeepSoilOwner.sensibleHeatJm2) + heatToDeepSoilJm2;
  const finalMatrixHeatJm2 =
    finite(initialDeepSubsurfaceMatrixOwner.sensibleHeatJm2) -
      heatToDeepSoilJm2;
  const finalDeepSoilTemperatureC = deepSoilHeatCapacityJm2K > 0
    ? finalDeepSoilHeatJm2 / deepSoilHeatCapacityJm2K
    : initialDeepSoilOwner.waterTemperatureC;
  const finalMatrixTemperatureC = matrixHeatCapacityJm2K > 0
    ? finalMatrixHeatJm2 / matrixHeatCapacityJm2K
    : initialDeepSubsurfaceMatrixOwner.temperatureC;
  if (finalDeepSoilTemperatureC <
        LAND_DEEP_GROUNDWATER_WATER_MINIMUM_TEMPERATURE_C - 1e-12 ||
      finalDeepSoilTemperatureC >
        LAND_DEEP_GROUNDWATER_WATER_MAXIMUM_TEMPERATURE_C + 1e-12 ||
      finalMatrixTemperatureC <
        LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C - 1e-12 ||
      finalMatrixTemperatureC >
        LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C + 1e-12) {
    throw new Error('Deep-soil/subsurface-matrix exchange exceeds a declared temperature envelope');
  }
  const finalDeepSoilOwner = {
    trackedWaterMm: Number(initialDeepSoilOwner.trackedWaterMm),
    sensibleHeatJm2: deepSoilHeatCapacityJm2K > 0
      ? Number(finalDeepSoilHeatJm2) : 0,
    waterTemperatureC: Number(finalDeepSoilTemperatureC)
  };
  const finalDeepSubsurfaceMatrixOwner = {
    ...clone(initialDeepSubsurfaceMatrixOwner),
    temperatureC: Number(finalMatrixTemperatureC),
    sensibleHeatJm2: matrixHeatCapacityJm2K > 0
      ? Number(finalMatrixHeatJm2) : 0
  };
  const pairedTransferClosure = closure([
    heatToDeepSoilJm2, -heatToDeepSoilJm2
  ]);
  const deepSoilOwnerClosure = closure([
    finalDeepSoilOwner.sensibleHeatJm2,
    -initialDeepSoilOwner.sensibleHeatJm2,
    -heatToDeepSoilJm2
  ]);
  const deepSubsurfaceMatrixOwnerClosure = closure([
    finalDeepSubsurfaceMatrixOwner.sensibleHeatJm2,
    -initialDeepSubsurfaceMatrixOwner.sensibleHeatJm2,
    heatToDeepSoilJm2
  ]);
  const combinedOwnerClosure = closure([
    finalDeepSoilOwner.sensibleHeatJm2,
    finalDeepSubsurfaceMatrixOwner.sensibleHeatJm2,
    -initialDeepSoilOwner.sensibleHeatJm2,
    -initialDeepSubsurfaceMatrixOwner.sensibleHeatJm2
  ]);
  if (!pairedTransferClosure.closed || !deepSoilOwnerClosure.closed ||
      !deepSubsurfaceMatrixOwnerClosure.closed ||
      !combinedOwnerClosure.closed) {
    throw new Error('Deep-soil/subsurface-matrix thermal exchange did not close');
  }
  const stepId = String(context.stepId ||
    `${proposal.stepId}:application`);
  const receipt = {
    schema: LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
    stepId,
    status: Math.abs(heatToDeepSoilJm2) <=
        LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J
      ? 'no-material-deep-soil-subsurface-matrix-heat-transfer'
      : heatToDeepSoilJm2 > 0
        ? 'subsurface-matrix-heat-debited-to-deep-soil-water'
        : 'deep-soil-water-heat-debited-to-subsurface-matrix',
    sourceProposal: {
      schema: proposal.schema,
      receiptDigest: proposal.digest,
      stepId: proposal.stepId,
      proposal: clone(proposal)
    },
    sourceDeepGroundwaterWaterThermal:
      clone(proposal.sourceDeepGroundwaterWaterThermal),
    geometry: clone(proposal.geometry),
    transfer: {
      transferId: `${stepId}:paired-sensible-heat`,
      direction: heatToDeepSoilJm2 > 0
        ? 'deep-subsurface-matrix-to-deep-soil-water'
        : heatToDeepSoilJm2 < 0
          ? 'deep-soil-water-to-deep-subsurface-matrix' : 'none',
      signedHeatToDeepSoilJm2: Number(heatToDeepSoilJm2),
      signedDeepSoilOwnerHeatJm2: Number(heatToDeepSoilJm2),
      signedDeepSubsurfaceMatrixOwnerHeatJm2:
        Number(-heatToDeepSoilJm2),
      deepSoilOwnerKind:
        'persistent-land-hydrology-deep-soil-water-thermal-owner',
      matrixOwnerKind:
        'persistent-parameterized-deep-subsurface-mineral-matrix-thermal-owner',
      senderOwnerDebited: true,
      receiverOwnerCredited: true
    },
    initialDeepSoilOwner,
    finalDeepSoilOwner,
    initialDeepSubsurfaceMatrixOwner,
    finalDeepSubsurfaceMatrixOwner,
    pairedTransferClosure,
    deepSoilOwnerClosure,
    deepSubsurfaceMatrixOwnerClosure,
    combinedOwnerClosure,
    migrationInitialization: {
      sourceWasNoHistoryCheckpoint: state.migrationCheckpoint === true,
      historicalHeatReconstructed: false
    },
    truth: {
      existingDeepSoilWaterAndSubsurfaceMatrixOwnersPaired: true,
      signedDeepSoilOwnerEntryApplied: true,
      signedDeepSubsurfaceMatrixOwnerEntryApplied: true,
      deepSoilWaterUnchangedByThisOrgan: true,
      subsurfaceMatrixGeometryUnchangedByThisOrgan: true,
      intervalBelowSurfaceOwner: true,
      intervalAboveAquiferMatrixOwner: true,
      ownerIntervalsDoNotOverlap: true,
      bothTemperatureEnvelopesRespected: true,
      sourceReceiptExactlyBound: true,
      scaleAwareNumericClosure: true,
      measuredResidualsPreserved: true,
      fixedAbsoluteToleranceOnly: false,
      bulkResponseParameterized: true,
      distinctFromLandSurfaceSensibleHeatOwner: true,
      distinctFromAquiferMatrixSensibleHeatOwner: true,
      resolvedSubsurfaceConduction: false,
      geothermalForcingModeledByThisOrgan: false,
      phaseChangeModeledByThisOrgan: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  receipt.digest = stableDigest(receipt);
  reservoirs.deepSoil = clone(finalDeepSoilOwner);
  state.owner = clone(finalDeepSubsurfaceMatrixOwner);
  state.lastStepReceipt = clone(receipt);
  state.migrationCheckpoint = false;
  state.migration = {
    historicalHeatReconstructed: false,
    initializedFromCurrentDeepSoilWaterTemperature: false,
    sourceEngineSchema: null
  };
  return clone(receipt);
}

export function deepSoilSubsurfaceMatrixThermalDescription() {
  return {
    stateSchema: LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA,
    proposalSchema:
      LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_PROPOSAL_SCHEMA,
    receiptSchema:
      LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
    closureSchema:
      LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_CLOSURE_SCHEMA,
    closurePolicySchema:
      LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA,
    responseTimescaleDays:
      LAND_DEEP_SOIL_SUBSURFACE_MATRIX_RESPONSE_TIMESCALE_DAYS,
    volumetricHeatCapacityJm3K:
      LAND_DEEP_SUBSURFACE_MATRIX_VOLUMETRIC_HEAT_CAPACITY_J_M3_K,
    effectiveDepthEnvelopeM: {
      minimum: LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_EFFECTIVE_DEPTH_M,
      maximum: LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_EFFECTIVE_DEPTH_M
    },
    deepSoilWaterTemperatureEnvelopeC: {
      minimum: LAND_DEEP_GROUNDWATER_WATER_MINIMUM_TEMPERATURE_C,
      maximum: LAND_DEEP_GROUNDWATER_WATER_MAXIMUM_TEMPERATURE_C
    },
    matrixTemperatureEnvelopeC: {
      minimum: LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C,
      maximum: LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C
    },
    persistentDeepSubsurfaceMatrixSensibleHeatOwner: true,
    distinctFromLandSurfaceSensibleHeatOwner: true,
    distinctFromAquiferMatrixSensibleHeatOwner: true,
    intervalGeometryExplicit: true,
    bulkResponseParameterized: true,
    resolvedSubsurfaceConduction: false,
    geothermalForcingModeledByThisOrgan: false,
    phaseChangeModeledByThisOrgan: false,
    scientificCalibrationClaimed: false,
    globalUnloadedBoundaryClaimed: false
  };
}
