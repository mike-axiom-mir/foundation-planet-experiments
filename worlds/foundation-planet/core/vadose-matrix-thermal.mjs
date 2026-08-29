import {
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
} from './land-hydrology-thermal.mjs?v=0.84.0-r84.1';
import {
  LAND_AQUIFER_MATRIX_THERMAL_STATE_SCHEMA,
  LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA,
  LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C,
  LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C,
  aquiferMatrixThermalParameters,
  landGroundwaterAquiferMatrixThermalReceiptValid
} from './groundwater-aquifer-matrix-thermal.mjs?v=0.84.0-r84.1';
import {
  LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA,
  LAND_DEEP_SUBSURFACE_MATRIX_VOLUMETRIC_HEAT_CAPACITY_J_M3_K,
  LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C,
  LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C,
  deepSubsurfaceMatrixThermalParameters
} from './deep-soil-subsurface-matrix-thermal.mjs?v=0.84.0-r84.1';
import {
  LAND_DEEP_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA,
  landDeepAquiferMatrixThermalReceiptValid
} from './deep-aquifer-matrix-thermal.mjs?v=0.84.0-r84.1';
import {
  LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
  landSurfaceSubsurfaceMatrixThermalReceiptValid
} from './surface-subsurface-matrix-thermal.mjs?v=0.85.0-r85.1';

export const LAND_VADOSE_MATRIX_THERMAL_STATE_SCHEMA =
  'axm.foundation-planet.land-vadose-matrix-thermal-state/v1';
export const LAND_VADOSE_MATRIX_THERMAL_PROPOSAL_SCHEMA =
  'axm.foundation-planet.land-vadose-matrix-thermal-proposal/v1';
export const LAND_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-vadose-matrix-thermal-receipt/v1';
export const LAND_VADOSE_MATRIX_THERMAL_CLOSURE_SCHEMA =
  'axm.foundation-planet.land-vadose-matrix-thermal-closure/v1';
export const LAND_VADOSE_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA =
  'axm.foundation-planet.land-vadose-matrix-thermal-closure-policy/v1';
export const LAND_NATIVE_VADOSE_MATRIX_THERMAL_PROPOSAL_SCHEMA =
  'axm.foundation-planet.land-native-vadose-matrix-thermal-proposal/v1';
export const LAND_NATIVE_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-native-vadose-matrix-thermal-receipt/v1';
export const LAND_VADOSE_MATRIX_BASE_INTERFACE_RESPONSE_TIMESCALE_DAYS = 75;
export const LAND_VADOSE_MATRIX_INTERFACE_DISTANCE_SCALE_M = 10;
export const LAND_VADOSE_MATRIX_MINIMUM_TEMPERATURE_C = -20;
export const LAND_VADOSE_MATRIX_MAXIMUM_TEMPERATURE_C = 80;

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

export function landVadoseMatrixThermalProposalValid(proposal) {
  return digestValid(proposal, LAND_VADOSE_MATRIX_THERMAL_PROPOSAL_SCHEMA);
}

export function landVadoseMatrixThermalReceiptValid(receipt) {
  return digestValid(receipt, LAND_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA);
}

export function landNativeVadoseMatrixThermalProposalValid(proposal) {
  return digestValid(proposal,
    LAND_NATIVE_VADOSE_MATRIX_THERMAL_PROPOSAL_SCHEMA);
}

export function landNativeVadoseMatrixThermalReceiptValid(receipt) {
  return digestValid(receipt,
    LAND_NATIVE_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA);
}

function same(left, right, tolerance = 1e-12) {
  return Number.isFinite(Number(left)) && Number.isFinite(Number(right)) &&
    Math.abs(Number(left) - Number(right)) <= tolerance;
}

function deepOwnersMatch(left = {}, right = {}) {
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

function aquiferOwnersMatch(left = {}, right = {}) {
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

export function vadoseMatrixThermalParameters(substrate = {}) {
  const deep = deepSubsurfaceMatrixThermalParameters(substrate);
  const aquifer = aquiferMatrixThermalParameters(substrate);
  const upperBoundaryDepthM = Number(deep.lowerBoundaryDepthM);
  const lowerBoundaryDepthM = Number(
    deep.aquiferMatrixUpperBoundaryDepthM);
  const effectiveDepthM = Math.max(0,
    lowerBoundaryDepthM - upperBoundaryDepthM);
  const centerDepthM = upperBoundaryDepthM + effectiveDepthM / 2;
  const deepCenterDepthM = Number(deep.upperBoundaryDepthM) +
    Number(deep.effectiveDepthM) / 2;
  const aquiferCenterDepthM = lowerBoundaryDepthM +
    Number(aquifer.effectiveDepthM) / 2;
  const solidFraction = Number(deep.solidFraction);
  const heatCapacityJm2K = effectiveDepthM * solidFraction *
    LAND_DEEP_SUBSURFACE_MATRIX_VOLUMETRIC_HEAT_CAPACITY_J_M3_K;
  const deepInterfaceCenterDistanceM = centerDepthM - deepCenterDepthM;
  const aquiferInterfaceCenterDistanceM = aquiferCenterDepthM -
    centerDepthM;
  return {
    mode: 'exact-intervening-vadose-mineral-matrix-capacity',
    upperBoundaryDepthM,
    lowerBoundaryDepthM,
    effectiveDepthM: Number(effectiveDepthM),
    centerDepthM: Number(centerDepthM),
    deepMatrixLowerBoundaryDepthM: Number(deep.lowerBoundaryDepthM),
    aquiferMatrixUpperBoundaryDepthM:
      Number(deep.aquiferMatrixUpperBoundaryDepthM),
    deepInterfaceCoincident: same(upperBoundaryDepthM,
      deep.lowerBoundaryDepthM),
    aquiferInterfaceCoincident: same(lowerBoundaryDepthM,
      deep.aquiferMatrixUpperBoundaryDepthM),
    ownerIntervalsOverlap: effectiveDepthM < -1e-12,
    solidFraction,
    volumetricHeatCapacityJm3K:
      LAND_DEEP_SUBSURFACE_MATRIX_VOLUMETRIC_HEAT_CAPACITY_J_M3_K,
    heatCapacityJm2K: Number(heatCapacityJm2K),
    deepInterfaceCenterDistanceM: Number(deepInterfaceCenterDistanceM),
    aquiferInterfaceCenterDistanceM:
      Number(aquiferInterfaceCenterDistanceM),
    deepInterfaceResponseTimescaleDays: Number(
      LAND_VADOSE_MATRIX_BASE_INTERFACE_RESPONSE_TIMESCALE_DAYS *
        (1 + deepInterfaceCenterDistanceM /
          LAND_VADOSE_MATRIX_INTERFACE_DISTANCE_SCALE_M)),
    aquiferInterfaceResponseTimescaleDays: Number(
      LAND_VADOSE_MATRIX_BASE_INTERFACE_RESPONSE_TIMESCALE_DAYS *
        (1 + aquiferInterfaceCenterDistanceM /
          LAND_VADOSE_MATRIX_INTERFACE_DISTANCE_SCALE_M))
  };
}

function vadoseOwner(parameters, temperatureC) {
  const temperature = clamp(finite(temperatureC),
    LAND_VADOSE_MATRIX_MINIMUM_TEMPERATURE_C,
    LAND_VADOSE_MATRIX_MAXIMUM_TEMPERATURE_C);
  return {
    materialClass: 'parameterized-intervening-vadose-mineral-matrix',
    upperBoundaryDepthM: Number(parameters.upperBoundaryDepthM),
    lowerBoundaryDepthM: Number(parameters.lowerBoundaryDepthM),
    effectiveDepthM: Number(parameters.effectiveDepthM),
    centerDepthM: Number(parameters.centerDepthM),
    solidFraction: Number(parameters.solidFraction),
    volumetricHeatCapacityJm3K:
      Number(parameters.volumetricHeatCapacityJm3K),
    heatCapacityJm2K: Number(parameters.heatCapacityJm2K),
    temperatureC: Number(temperature),
    sensibleHeatJm2: Number(parameters.heatCapacityJm2K * temperature)
  };
}

function vadoseOwnersMatch(left = {}, right = {}) {
  return left.materialClass ===
      'parameterized-intervening-vadose-mineral-matrix' &&
    right.materialClass === left.materialClass &&
    same(left.upperBoundaryDepthM, right.upperBoundaryDepthM) &&
    same(left.lowerBoundaryDepthM, right.lowerBoundaryDepthM) &&
    same(left.effectiveDepthM, right.effectiveDepthM) &&
    same(left.centerDepthM, right.centerDepthM) &&
    same(left.solidFraction, right.solidFraction) &&
    same(left.volumetricHeatCapacityJm3K,
      right.volumetricHeatCapacityJm3K) &&
    same(left.heatCapacityJm2K, right.heatCapacityJm2K, 1e-6) &&
    same(left.temperatureC, right.temperatureC) &&
    same(left.sensibleHeatJm2, right.sensibleHeatJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);
}

export function createLandVadoseMatrixThermalState(substrate,
  deepMatrixTemperatureC, aquiferMatrixTemperatureC, options = {}) {
  const parameters = vadoseMatrixThermalParameters(substrate);
  if (!(parameters.effectiveDepthM > 0)) {
    throw new Error('Vadose-matrix state requires a positive intervening interval');
  }
  const initialTemperatureC = (finite(deepMatrixTemperatureC) +
    finite(aquiferMatrixTemperatureC)) / 2;
  return {
    schema: LAND_VADOSE_MATRIX_THERMAL_STATE_SCHEMA,
    parameterization: parameters,
    owner: vadoseOwner(parameters, initialTemperatureC),
    lastStepReceipt: null,
    migrationCheckpoint: options.migrationCheckpoint === true,
    migration: {
      historicalHeatReconstructed: false,
      initializedFromCurrentAdjacentMatrixTemperatures:
        options.migrationCheckpoint === true,
      sourceEngineSchema: options.sourceEngineSchema || null
    },
    truth: {
      persistentVadoseMatrixSensibleHeatOwner: true,
      exactR83SeparationOwned: true,
      exactCoincidentDeepAndAquiferInterfaces: true,
      ownerIntervalsDoNotOverlap: true,
      bulkCapacityParameterized: true,
      resolvedInterMatrixConduction: false,
      geothermalForcingModeled: false,
      scientificCalibrationClaimed: false
    }
  };
}

export function normalizeLandVadoseMatrixThermalState(state, substrate,
  deepMatrixTemperatureC, aquiferMatrixTemperatureC, options = {}) {
  const expectedParameters = vadoseMatrixThermalParameters(substrate);
  const expectedOwner = vadoseOwner(expectedParameters,
    state?.owner?.temperatureC);
  const validStoredOwner = state?.schema ===
      LAND_VADOSE_MATRIX_THERMAL_STATE_SCHEMA &&
    expectedParameters.effectiveDepthM > 0 &&
    vadoseOwnersMatch(state.owner, expectedOwner);
  if (!validStoredOwner || options.preserveState !== true) {
    return createLandVadoseMatrixThermalState(substrate,
      deepMatrixTemperatureC, aquiferMatrixTemperatureC, {
        migrationCheckpoint: options.migrationCheckpoint === true,
        sourceEngineSchema: options.sourceEngineSchema
      });
  }
  const normalized = clone(state);
  normalized.parameterization = expectedParameters;
  normalized.owner = expectedOwner;
  normalized.lastStepReceipt = options.preserveEvidence === true &&
      (landVadoseMatrixThermalReceiptValid(state.lastStepReceipt) ||
        landNativeVadoseMatrixThermalReceiptValid(state.lastStepReceipt))
    ? clone(state.lastStepReceipt) : null;
  normalized.migrationCheckpoint = normalized.lastStepReceipt
    ? false : state.migrationCheckpoint === true;
  normalized.migration = {
    historicalHeatReconstructed: false,
    initializedFromCurrentAdjacentMatrixTemperatures:
      normalized.migrationCheckpoint,
    sourceEngineSchema: normalized.migration?.sourceEngineSchema || null
  };
  normalized.truth = {
    persistentVadoseMatrixSensibleHeatOwner: true,
    exactR83SeparationOwned: true,
    exactCoincidentDeepAndAquiferInterfaces: true,
    ownerIntervalsDoNotOverlap: true,
    bulkCapacityParameterized: true,
    resolvedInterMatrixConduction: false,
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
    schema: LAND_VADOSE_MATRIX_THERMAL_CLOSURE_SCHEMA,
    policy: {
      schema: LAND_VADOSE_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA,
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
    measuredResidualPreserved: true,
    closed: Math.abs(residual) <= numericTolerance
  };
}

function pairResponse(firstOwner, secondOwner, timescaleDays, durationDays) {
  const firstCapacity = Math.max(0,
    finite(firstOwner.heatCapacityJm2K));
  const secondCapacity = Math.max(0,
    finite(secondOwner.heatCapacityJm2K));
  const jointCapacity = firstCapacity > 0 && secondCapacity > 0
    ? firstCapacity * secondCapacity / (firstCapacity + secondCapacity)
    : 0;
  const responseFraction = 1 - Math.exp(-durationDays / timescaleDays);
  const requestedHeatToSecondJm2 = jointCapacity *
    (finite(firstOwner.temperatureC) - finite(secondOwner.temperatureC)) *
    responseFraction;
  return {
    firstHeatCapacityJm2K: Number(firstCapacity),
    secondHeatCapacityJm2K: Number(secondCapacity),
    jointHeatCapacityJm2K: Number(jointCapacity),
    effectiveResponseTimescaleDays: Number(timescaleDays),
    responseFraction: Number(responseFraction),
    requestedHeatToSecondJm2: Number(requestedHeatToSecondJm2)
  };
}

function envelopeScale(initialHeatJm2, deltaHeatJm2, heatCapacityJm2K,
  minimumTemperatureC, maximumTemperatureC) {
  if (!(heatCapacityJm2K > 0) || deltaHeatJm2 === 0) return 1;
  const minimumHeat = heatCapacityJm2K * minimumTemperatureC;
  const maximumHeat = heatCapacityJm2K * maximumTemperatureC;
  if (deltaHeatJm2 > 0) {
    return clamp((maximumHeat - initialHeatJm2) / deltaHeatJm2, 0, 1);
  }
  return clamp((minimumHeat - initialHeatJm2) / deltaHeatJm2, 0, 1);
}

export function planLandVadoseMatrixThermalMediation(column,
  deepAquiferMatrixThermalReceipt, durationDays = 1, context = {}) {
  const deepState = column?.land?.deepSubsurfaceMatrixThermal;
  const aquiferState = column?.land?.aquiferMatrixThermal;
  const vadoseState = column?.land?.vadoseMatrixThermal;
  if (column?.kind !== 'land' ||
      deepState?.schema !== LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA ||
      aquiferState?.schema !== LAND_AQUIFER_MATRIX_THERMAL_STATE_SCHEMA ||
      vadoseState?.schema !== LAND_VADOSE_MATRIX_THERMAL_STATE_SCHEMA) {
    throw new Error('Vadose-matrix planning requires all three persistent matrix owners');
  }
  if (!landDeepAquiferMatrixThermalReceiptValid(
      deepAquiferMatrixThermalReceipt)) {
    throw new Error('Vadose-matrix planning requires intact current R83 evidence');
  }
  const duration = finite(durationDays);
  if (!(duration > 0 && duration <= 1.000001)) {
    throw new Error('Vadose-matrix planning requires a bounded positive duration');
  }
  const currentPostR83DeepOwner = clone(deepState.owner || {});
  const currentPostR83AquiferOwner = clone(aquiferState.owner || {});
  const initialVadoseMatrixOwner = clone(vadoseState.owner || {});
  const mediatedInitialDeepOwner = clone(
    deepAquiferMatrixThermalReceipt.initialDeepSubsurfaceMatrixOwner || {});
  const mediatedInitialAquiferOwner = clone(
    deepAquiferMatrixThermalReceipt.initialAquiferMatrixOwner || {});
  const geometry = vadoseMatrixThermalParameters(column.substrate);
  if (!deepOwnersMatch(currentPostR83DeepOwner,
      deepAquiferMatrixThermalReceipt.finalDeepSubsurfaceMatrixOwner) ||
      !aquiferOwnersMatch(currentPostR83AquiferOwner,
        deepAquiferMatrixThermalReceipt.finalAquiferMatrixOwner) ||
      !vadoseOwnersMatch(initialVadoseMatrixOwner,
        vadoseOwner(geometry, initialVadoseMatrixOwner.temperatureC)) ||
      !deepOwnersMatch(mediatedInitialDeepOwner,
        deepAquiferMatrixThermalReceipt.initialDeepSubsurfaceMatrixOwner) ||
      !aquiferOwnersMatch(mediatedInitialAquiferOwner,
        deepAquiferMatrixThermalReceipt.initialAquiferMatrixOwner) ||
      !(geometry.effectiveDepthM > 0) ||
      geometry.deepInterfaceCoincident !== true ||
      geometry.aquiferInterfaceCoincident !== true ||
      !same(deepAquiferMatrixThermalReceipt.geometry?.separationM,
        geometry.effectiveDepthM)) {
    throw new Error('Vadose-matrix planning is detached from the exact R83 gap and owner handoff');
  }

  const sourceHeatToAquiferJm2 = Number(
    deepAquiferMatrixThermalReceipt.transfer
      ?.signedHeatToAquiferMatrixJm2);
  const signedReversalHeatToAquiferJm2 = -sourceHeatToAquiferJm2;
  const deepResponse = pairResponse(mediatedInitialDeepOwner,
    initialVadoseMatrixOwner,
    geometry.deepInterfaceResponseTimescaleDays, duration);
  const aquiferResponse = pairResponse(initialVadoseMatrixOwner,
    mediatedInitialAquiferOwner,
    geometry.aquiferInterfaceResponseTimescaleDays, duration);
  const requestedHeatToVadoseFromDeepJm2 =
    deepResponse.requestedHeatToSecondJm2;
  const requestedHeatToAquiferFromVadoseJm2 =
    aquiferResponse.requestedHeatToSecondJm2;
  const requestedDeepDeltaJm2 = -requestedHeatToVadoseFromDeepJm2;
  const requestedVadoseDeltaJm2 = requestedHeatToVadoseFromDeepJm2 -
    requestedHeatToAquiferFromVadoseJm2;
  const requestedAquiferDeltaJm2 = requestedHeatToAquiferFromVadoseJm2;
  const envelopeLimiterFraction = Math.min(
    envelopeScale(Number(mediatedInitialDeepOwner.sensibleHeatJm2),
      requestedDeepDeltaJm2,
      Number(mediatedInitialDeepOwner.heatCapacityJm2K),
      LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C,
      LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C),
    envelopeScale(Number(initialVadoseMatrixOwner.sensibleHeatJm2),
      requestedVadoseDeltaJm2,
      Number(initialVadoseMatrixOwner.heatCapacityJm2K),
      LAND_VADOSE_MATRIX_MINIMUM_TEMPERATURE_C,
      LAND_VADOSE_MATRIX_MAXIMUM_TEMPERATURE_C),
    envelopeScale(Number(mediatedInitialAquiferOwner.sensibleHeatJm2),
      requestedAquiferDeltaJm2,
      Number(mediatedInitialAquiferOwner.heatCapacityJm2K),
      LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C,
      LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C)
  );
  const appliedHeatToVadoseFromDeepJm2 =
    requestedHeatToVadoseFromDeepJm2 * envelopeLimiterFraction;
  const appliedHeatToAquiferFromVadoseJm2 =
    requestedHeatToAquiferFromVadoseJm2 * envelopeLimiterFraction;
  const proposal = {
    schema: LAND_VADOSE_MATRIX_THERMAL_PROPOSAL_SCHEMA,
    stepId: String(context.stepId ||
      `${deepAquiferMatrixThermalReceipt.stepId}:vadose-mediation-plan`),
    sourceDeepAquiferMatrixThermal: {
      schema: LAND_DEEP_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA,
      receiptDigest: deepAquiferMatrixThermalReceipt.digest,
      stepId: deepAquiferMatrixThermalReceipt.stepId
    },
    durationDays: Number(duration),
    geometry,
    currentPostR83DeepOwner,
    currentPostR83AquiferOwner,
    initialVadoseMatrixOwner,
    mediatedInitialDeepOwner,
    mediatedInitialAquiferOwner,
    r83DirectTransferReconciliation: {
      sourceSignedHeatToAquiferMatrixJm2:
        Number(sourceHeatToAquiferJm2),
      signedReversalHeatToAquiferMatrixJm2:
        Number(signedReversalHeatToAquiferJm2),
      signedDeepOwnerHeatJm2:
        Number(-signedReversalHeatToAquiferJm2),
      signedAquiferOwnerHeatJm2:
        Number(signedReversalHeatToAquiferJm2),
      directTransferDoubleCounted: false
    },
    deepVadoseResponse: {
      mode: 'distance-aware-deep-vadose-matrix-bulk-interface-response',
      ...deepResponse
    },
    vadoseAquiferResponse: {
      mode: 'distance-aware-vadose-aquifer-matrix-bulk-interface-response',
      ...aquiferResponse
    },
    requestedHeatToVadoseFromDeepJm2:
      Number(requestedHeatToVadoseFromDeepJm2),
    requestedHeatToAquiferFromVadoseJm2:
      Number(requestedHeatToAquiferFromVadoseJm2),
    envelopeLimiterFraction: Number(envelopeLimiterFraction),
    appliedHeatToVadoseFromDeepJm2:
      Number(appliedHeatToVadoseFromDeepJm2),
    appliedHeatToAquiferFromVadoseJm2:
      Number(appliedHeatToAquiferFromVadoseJm2),
    truth: {
      existingR83DeepAndAquiferOwnersBound: true,
      persistentInterveningVadoseMatrixOwnerBound: true,
      exactR83GapOwned: true,
      exactCoincidentInterfacesUsed: true,
      r83DirectTransferExplicitlyReconciled: true,
      directTransferDoubleCounted: false,
      threeOwnerEnergyConserved: true,
      distanceAwareBulkResponsesParameterized: true,
      ownerGeometryChangedByThisProposal: false,
      waterMovedByThisProposal: false,
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

export function applyLandVadoseMatrixThermalMediation(column, proposal,
  deepAquiferMatrixThermalReceipt, context = {}) {
  const deepState = column?.land?.deepSubsurfaceMatrixThermal;
  const aquiferState = column?.land?.aquiferMatrixThermal;
  const vadoseState = column?.land?.vadoseMatrixThermal;
  if (column?.kind !== 'land' ||
      deepState?.schema !== LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA ||
      aquiferState?.schema !== LAND_AQUIFER_MATRIX_THERMAL_STATE_SCHEMA ||
      vadoseState?.schema !== LAND_VADOSE_MATRIX_THERMAL_STATE_SCHEMA) {
    throw new Error('Vadose-matrix application requires all three persistent matrix owners');
  }
  if (!landVadoseMatrixThermalProposalValid(proposal) ||
      !landDeepAquiferMatrixThermalReceiptValid(
        deepAquiferMatrixThermalReceipt)) {
    throw new Error('Vadose-matrix application requires intact current source evidence');
  }
  const expectedProposal = planLandVadoseMatrixThermalMediation(column,
    deepAquiferMatrixThermalReceipt, proposal.durationDays, {
      stepId: proposal.stepId
    });
  if (expectedProposal.digest !== proposal.digest ||
      proposal.sourceDeepAquiferMatrixThermal?.receiptDigest !==
        deepAquiferMatrixThermalReceipt.digest ||
      column.land.lastDeepAquiferMatrixThermalReceipt?.digest !==
        deepAquiferMatrixThermalReceipt.digest) {
    throw new Error('Vadose-matrix source evidence or proposal is detached');
  }

  const initialPostR83DeepOwner = clone(deepState.owner);
  const initialPostR83AquiferOwner = clone(aquiferState.owner);
  const initialVadoseMatrixOwner = clone(vadoseState.owner);
  const mediatedInitialDeepOwner = clone(proposal.mediatedInitialDeepOwner);
  const mediatedInitialAquiferOwner = clone(
    proposal.mediatedInitialAquiferOwner);
  const reconciliation = proposal.r83DirectTransferReconciliation;
  const heatToVadoseFromDeepJm2 = Number(
    proposal.appliedHeatToVadoseFromDeepJm2);
  const heatToAquiferFromVadoseJm2 = Number(
    proposal.appliedHeatToAquiferFromVadoseJm2);
  const finalDeepHeatJm2 =
    Number(mediatedInitialDeepOwner.sensibleHeatJm2) -
      heatToVadoseFromDeepJm2;
  const finalVadoseHeatJm2 =
    Number(initialVadoseMatrixOwner.sensibleHeatJm2) +
      heatToVadoseFromDeepJm2 - heatToAquiferFromVadoseJm2;
  const finalAquiferHeatJm2 =
    Number(mediatedInitialAquiferOwner.sensibleHeatJm2) +
      heatToAquiferFromVadoseJm2;
  const finalDeepTemperatureC = finalDeepHeatJm2 /
    Number(mediatedInitialDeepOwner.heatCapacityJm2K);
  const finalVadoseTemperatureC = finalVadoseHeatJm2 /
    Number(initialVadoseMatrixOwner.heatCapacityJm2K);
  const finalAquiferTemperatureC = finalAquiferHeatJm2 /
    Number(mediatedInitialAquiferOwner.heatCapacityJm2K);
  if (finalDeepTemperatureC <
        LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C - 1e-9 ||
      finalDeepTemperatureC >
        LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C + 1e-9 ||
      finalVadoseTemperatureC <
        LAND_VADOSE_MATRIX_MINIMUM_TEMPERATURE_C - 1e-9 ||
      finalVadoseTemperatureC >
        LAND_VADOSE_MATRIX_MAXIMUM_TEMPERATURE_C + 1e-9 ||
      finalAquiferTemperatureC <
        LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C - 1e-9 ||
      finalAquiferTemperatureC >
        LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C + 1e-9) {
    throw new Error('Vadose-matrix mediation exceeds a declared temperature envelope');
  }
  const finalDeepSubsurfaceMatrixOwner = {
    ...clone(mediatedInitialDeepOwner),
    temperatureC: Number(finalDeepTemperatureC),
    sensibleHeatJm2: Number(
      Number(mediatedInitialDeepOwner.heatCapacityJm2K) *
        finalDeepTemperatureC)
  };
  const finalVadoseMatrixOwner = {
    ...clone(initialVadoseMatrixOwner),
    temperatureC: Number(finalVadoseTemperatureC),
    sensibleHeatJm2: Number(
      Number(initialVadoseMatrixOwner.heatCapacityJm2K) *
        finalVadoseTemperatureC)
  };
  const finalAquiferMatrixOwner = {
    ...clone(mediatedInitialAquiferOwner),
    temperatureC: Number(finalAquiferTemperatureC),
    sensibleHeatJm2: Number(
      Number(mediatedInitialAquiferOwner.heatCapacityJm2K) *
        finalAquiferTemperatureC)
  };
  const reversalToAquiferJm2 = Number(
    reconciliation.signedReversalHeatToAquiferMatrixJm2);
  const signedDeepOwnerHeatJm2 = -reversalToAquiferJm2 -
    heatToVadoseFromDeepJm2;
  const signedVadoseOwnerHeatJm2 = heatToVadoseFromDeepJm2 -
    heatToAquiferFromVadoseJm2;
  const signedAquiferOwnerHeatJm2 = reversalToAquiferJm2 +
    heatToAquiferFromVadoseJm2;
  const r83ReconciliationClosure = closure([
    -reversalToAquiferJm2, reversalToAquiferJm2
  ]);
  const deepVadoseTransferClosure = closure([
    -heatToVadoseFromDeepJm2, heatToVadoseFromDeepJm2
  ]);
  const vadoseAquiferTransferClosure = closure([
    -heatToAquiferFromVadoseJm2, heatToAquiferFromVadoseJm2
  ]);
  const deepOwnerClosure = closure([
    finalDeepSubsurfaceMatrixOwner.sensibleHeatJm2,
    -initialPostR83DeepOwner.sensibleHeatJm2,
    -signedDeepOwnerHeatJm2
  ]);
  const vadoseOwnerClosure = closure([
    finalVadoseMatrixOwner.sensibleHeatJm2,
    -initialVadoseMatrixOwner.sensibleHeatJm2,
    -signedVadoseOwnerHeatJm2
  ]);
  const aquiferOwnerClosure = closure([
    finalAquiferMatrixOwner.sensibleHeatJm2,
    -initialPostR83AquiferOwner.sensibleHeatJm2,
    -signedAquiferOwnerHeatJm2
  ]);
  const combinedOwnerClosure = closure([
    finalDeepSubsurfaceMatrixOwner.sensibleHeatJm2,
    finalVadoseMatrixOwner.sensibleHeatJm2,
    finalAquiferMatrixOwner.sensibleHeatJm2,
    -initialPostR83DeepOwner.sensibleHeatJm2,
    -initialVadoseMatrixOwner.sensibleHeatJm2,
    -initialPostR83AquiferOwner.sensibleHeatJm2
  ]);
  if (![r83ReconciliationClosure, deepVadoseTransferClosure,
    vadoseAquiferTransferClosure, deepOwnerClosure, vadoseOwnerClosure,
    aquiferOwnerClosure, combinedOwnerClosure].every(item => item.closed)) {
    throw new Error('Vadose-matrix mediation did not close');
  }
  const stepId = String(context.stepId || `${proposal.stepId}:application`);
  const receipt = {
    schema: LAND_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA,
    stepId,
    status: Math.abs(heatToVadoseFromDeepJm2) <=
        LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J &&
        Math.abs(heatToAquiferFromVadoseJm2) <=
          LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J
      ? 'no-material-vadose-matrix-heat-transfer'
      : 'r83-direct-transfer-reconciled-and-vadose-matrix-mediated',
    sourceProposal: {
      schema: proposal.schema,
      receiptDigest: proposal.digest,
      stepId: proposal.stepId,
      proposal: clone(proposal)
    },
    sourceDeepAquiferMatrixThermal:
      clone(proposal.sourceDeepAquiferMatrixThermal),
    geometry: clone(proposal.geometry),
    r83DirectTransferReconciliation: clone(reconciliation),
    transfers: {
      deepVadose: {
        transferId: `${stepId}:deep-vadose`,
        signedHeatToVadoseMatrixJm2:
          Number(heatToVadoseFromDeepJm2),
        signedDeepOwnerHeatJm2:
          Number(-heatToVadoseFromDeepJm2),
        signedVadoseOwnerHeatJm2:
          Number(heatToVadoseFromDeepJm2)
      },
      vadoseAquifer: {
        transferId: `${stepId}:vadose-aquifer`,
        signedHeatToAquiferMatrixJm2:
          Number(heatToAquiferFromVadoseJm2),
        signedVadoseOwnerHeatJm2:
          Number(-heatToAquiferFromVadoseJm2),
        signedAquiferOwnerHeatJm2:
          Number(heatToAquiferFromVadoseJm2)
      },
      signedDeepOwnerHeatJm2: Number(signedDeepOwnerHeatJm2),
      signedVadoseOwnerHeatJm2: Number(signedVadoseOwnerHeatJm2),
      signedAquiferOwnerHeatJm2: Number(signedAquiferOwnerHeatJm2)
    },
    initialPostR83DeepOwner,
    initialPostR83AquiferOwner,
    initialVadoseMatrixOwner,
    mediatedInitialDeepOwner,
    mediatedInitialAquiferOwner,
    finalDeepSubsurfaceMatrixOwner,
    finalVadoseMatrixOwner,
    finalAquiferMatrixOwner,
    r83ReconciliationClosure,
    deepVadoseTransferClosure,
    vadoseAquiferTransferClosure,
    deepOwnerClosure,
    vadoseOwnerClosure,
    aquiferOwnerClosure,
    combinedOwnerClosure,
    migrationInitialization: {
      sourceWasNoHistoryCheckpoint:
        vadoseState.migrationCheckpoint === true,
      historicalHeatReconstructed: false
    },
    truth: {
      persistentVadoseMatrixSensibleHeatOwner: true,
      exactR83SourceBound: true,
      exactR83GapOwned: true,
      exactCoincidentDeepAndAquiferInterfaces: true,
      r83DirectTransferExplicitlyReconciled: true,
      directTransferDoubleCounted: false,
      signedThreeOwnerEntriesApplied: true,
      allOwnerGeometryUnchangedByThisOrgan: true,
      waterMovedByThisOrgan: false,
      bothMediatedTransfersParameterized: true,
      allTemperatureEnvelopesRespected: true,
      scaleAwareNumericClosure: true,
      measuredResidualsPreserved: true,
      fixedAbsoluteToleranceOnly: false,
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
  vadoseState.owner = clone(finalVadoseMatrixOwner);
  vadoseState.lastStepReceipt = clone(receipt);
  vadoseState.migrationCheckpoint = false;
  column.land.lastVadoseMatrixThermalReceipt = clone(receipt);
  return clone(receipt);
}

export function planLandNativeVadoseMatrixThermalMediation(column,
  surfaceSubsurfaceMatrixThermalReceipt,
  groundwaterAquiferMatrixThermalReceipt, durationDays = 1, context = {}) {
  const deepState = column?.land?.deepSubsurfaceMatrixThermal;
  const aquiferState = column?.land?.aquiferMatrixThermal;
  const vadoseState = column?.land?.vadoseMatrixThermal;
  if (column?.kind !== 'land' ||
      deepState?.schema !== LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA ||
      aquiferState?.schema !== LAND_AQUIFER_MATRIX_THERMAL_STATE_SCHEMA ||
      vadoseState?.schema !== LAND_VADOSE_MATRIX_THERMAL_STATE_SCHEMA) {
    throw new Error('Native vadose mediation requires all three persistent matrix owners');
  }
  if (!landSurfaceSubsurfaceMatrixThermalReceiptValid(
      surfaceSubsurfaceMatrixThermalReceipt) ||
      !landGroundwaterAquiferMatrixThermalReceiptValid(
        groundwaterAquiferMatrixThermalReceipt)) {
    throw new Error('Native vadose mediation requires intact current R82 and R80 evidence');
  }
  const duration = finite(durationDays);
  if (!(duration > 0 && duration <= 1.000001)) {
    throw new Error('Native vadose mediation requires a bounded positive duration');
  }
  const initialDeepSubsurfaceMatrixOwner = clone(deepState.owner || {});
  const initialAquiferMatrixOwner = clone(aquiferState.owner || {});
  const initialVadoseMatrixOwner = clone(vadoseState.owner || {});
  const geometry = vadoseMatrixThermalParameters(column.substrate);
  if (!deepOwnersMatch(initialDeepSubsurfaceMatrixOwner,
      surfaceSubsurfaceMatrixThermalReceipt.finalDeepSubsurfaceMatrixOwner) ||
      !aquiferOwnersMatch(initialAquiferMatrixOwner,
        groundwaterAquiferMatrixThermalReceipt.finalAquiferMatrixOwner) ||
      !vadoseOwnersMatch(initialVadoseMatrixOwner,
        vadoseOwner(geometry, initialVadoseMatrixOwner.temperatureC)) ||
      !(geometry.effectiveDepthM > 0) ||
      geometry.deepInterfaceCoincident !== true ||
      geometry.aquiferInterfaceCoincident !== true ||
      geometry.ownerIntervalsOverlap !== false) {
    throw new Error('Native vadose mediation is detached from its exact owners or interfaces');
  }

  const deepResponse = pairResponse(initialDeepSubsurfaceMatrixOwner,
    initialVadoseMatrixOwner,
    geometry.deepInterfaceResponseTimescaleDays, duration);
  const aquiferResponse = pairResponse(initialVadoseMatrixOwner,
    initialAquiferMatrixOwner,
    geometry.aquiferInterfaceResponseTimescaleDays, duration);
  const requestedHeatToVadoseFromDeepJm2 =
    deepResponse.requestedHeatToSecondJm2;
  const requestedHeatToAquiferFromVadoseJm2 =
    aquiferResponse.requestedHeatToSecondJm2;
  const requestedDeepDeltaJm2 = -requestedHeatToVadoseFromDeepJm2;
  const requestedVadoseDeltaJm2 = requestedHeatToVadoseFromDeepJm2 -
    requestedHeatToAquiferFromVadoseJm2;
  const requestedAquiferDeltaJm2 = requestedHeatToAquiferFromVadoseJm2;
  const envelopeLimiterFraction = Math.min(
    envelopeScale(Number(initialDeepSubsurfaceMatrixOwner.sensibleHeatJm2),
      requestedDeepDeltaJm2,
      Number(initialDeepSubsurfaceMatrixOwner.heatCapacityJm2K),
      LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C,
      LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C),
    envelopeScale(Number(initialVadoseMatrixOwner.sensibleHeatJm2),
      requestedVadoseDeltaJm2,
      Number(initialVadoseMatrixOwner.heatCapacityJm2K),
      LAND_VADOSE_MATRIX_MINIMUM_TEMPERATURE_C,
      LAND_VADOSE_MATRIX_MAXIMUM_TEMPERATURE_C),
    envelopeScale(Number(initialAquiferMatrixOwner.sensibleHeatJm2),
      requestedAquiferDeltaJm2,
      Number(initialAquiferMatrixOwner.heatCapacityJm2K),
      LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C,
      LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C)
  );
  const proposal = {
    schema: LAND_NATIVE_VADOSE_MATRIX_THERMAL_PROPOSAL_SCHEMA,
    stepId: String(context.stepId ||
      `${column.id}:native-vadose-matrix-thermal-plan`),
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
    durationDays: Number(duration),
    geometry,
    initialDeepSubsurfaceMatrixOwner,
    initialVadoseMatrixOwner,
    initialAquiferMatrixOwner,
    deepVadoseResponse: {
      mode: 'distance-aware-deep-vadose-matrix-bulk-interface-response',
      ...deepResponse
    },
    vadoseAquiferResponse: {
      mode: 'distance-aware-vadose-aquifer-matrix-bulk-interface-response',
      ...aquiferResponse
    },
    requestedHeatToVadoseFromDeepJm2:
      Number(requestedHeatToVadoseFromDeepJm2),
    requestedHeatToAquiferFromVadoseJm2:
      Number(requestedHeatToAquiferFromVadoseJm2),
    envelopeLimiterFraction: Number(envelopeLimiterFraction),
    appliedHeatToVadoseFromDeepJm2:
      Number(requestedHeatToVadoseFromDeepJm2 * envelopeLimiterFraction),
    appliedHeatToAquiferFromVadoseJm2:
      Number(requestedHeatToAquiferFromVadoseJm2 * envelopeLimiterFraction),
    truth: {
      currentR82DeepMatrixOwnerBound: true,
      currentR80AquiferMatrixOwnerBound: true,
      persistentInterveningVadoseMatrixOwnerBound: true,
      exactCoincidentInterfacesUsed: true,
      directDeepAquiferTransferApplied: false,
      directTransferReversalApplied: false,
      threeOwnerEnergyConserved: true,
      distanceAwareBulkResponsesParameterized: true,
      ownerGeometryChangedByThisProposal: false,
      waterMovedByThisProposal: false,
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

export function applyLandNativeVadoseMatrixThermalMediation(column, proposal,
  surfaceSubsurfaceMatrixThermalReceipt,
  groundwaterAquiferMatrixThermalReceipt, context = {}) {
  if (!landNativeVadoseMatrixThermalProposalValid(proposal) ||
      !landSurfaceSubsurfaceMatrixThermalReceiptValid(
        surfaceSubsurfaceMatrixThermalReceipt) ||
      !landGroundwaterAquiferMatrixThermalReceiptValid(
        groundwaterAquiferMatrixThermalReceipt)) {
    throw new Error('Native vadose application requires intact current evidence');
  }
  const expectedProposal = planLandNativeVadoseMatrixThermalMediation(column,
    surfaceSubsurfaceMatrixThermalReceipt,
    groundwaterAquiferMatrixThermalReceipt, proposal.durationDays, {
      stepId: proposal.stepId
    });
  if (expectedProposal.digest !== proposal.digest ||
      column.land.lastSurfaceSubsurfaceMatrixThermalReceipt?.digest !==
        surfaceSubsurfaceMatrixThermalReceipt.digest ||
      column.land.aquiferMatrixThermal?.lastStepReceipt?.digest !==
        groundwaterAquiferMatrixThermalReceipt.digest) {
    throw new Error('Native vadose source evidence or proposal is detached');
  }

  const deepState = column.land.deepSubsurfaceMatrixThermal;
  const aquiferState = column.land.aquiferMatrixThermal;
  const vadoseState = column.land.vadoseMatrixThermal;
  const initialDeepSubsurfaceMatrixOwner = clone(deepState.owner);
  const initialVadoseMatrixOwner = clone(vadoseState.owner);
  const initialAquiferMatrixOwner = clone(aquiferState.owner);
  const heatToVadoseFromDeepJm2 = Number(
    proposal.appliedHeatToVadoseFromDeepJm2);
  const heatToAquiferFromVadoseJm2 = Number(
    proposal.appliedHeatToAquiferFromVadoseJm2);
  const finalDeepHeatJm2 =
    Number(initialDeepSubsurfaceMatrixOwner.sensibleHeatJm2) -
      heatToVadoseFromDeepJm2;
  const finalVadoseHeatJm2 =
    Number(initialVadoseMatrixOwner.sensibleHeatJm2) +
      heatToVadoseFromDeepJm2 - heatToAquiferFromVadoseJm2;
  const finalAquiferHeatJm2 =
    Number(initialAquiferMatrixOwner.sensibleHeatJm2) +
      heatToAquiferFromVadoseJm2;
  const finalDeepTemperatureC = finalDeepHeatJm2 /
    Number(initialDeepSubsurfaceMatrixOwner.heatCapacityJm2K);
  const finalVadoseTemperatureC = finalVadoseHeatJm2 /
    Number(initialVadoseMatrixOwner.heatCapacityJm2K);
  const finalAquiferTemperatureC = finalAquiferHeatJm2 /
    Number(initialAquiferMatrixOwner.heatCapacityJm2K);
  if (finalDeepTemperatureC <
        LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C - 1e-9 ||
      finalDeepTemperatureC >
        LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C + 1e-9 ||
      finalVadoseTemperatureC <
        LAND_VADOSE_MATRIX_MINIMUM_TEMPERATURE_C - 1e-9 ||
      finalVadoseTemperatureC >
        LAND_VADOSE_MATRIX_MAXIMUM_TEMPERATURE_C + 1e-9 ||
      finalAquiferTemperatureC <
        LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C - 1e-9 ||
      finalAquiferTemperatureC >
        LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C + 1e-9) {
    throw new Error('Native vadose mediation exceeds a declared temperature envelope');
  }
  const finalDeepSubsurfaceMatrixOwner = {
    ...clone(initialDeepSubsurfaceMatrixOwner),
    temperatureC: Number(finalDeepTemperatureC),
    sensibleHeatJm2: Number(finalDeepHeatJm2)
  };
  const finalVadoseMatrixOwner = {
    ...clone(initialVadoseMatrixOwner),
    temperatureC: Number(finalVadoseTemperatureC),
    sensibleHeatJm2: Number(finalVadoseHeatJm2)
  };
  const finalAquiferMatrixOwner = {
    ...clone(initialAquiferMatrixOwner),
    temperatureC: Number(finalAquiferTemperatureC),
    sensibleHeatJm2: Number(finalAquiferHeatJm2)
  };
  const signedDeepOwnerHeatJm2 = -heatToVadoseFromDeepJm2;
  const signedVadoseOwnerHeatJm2 = heatToVadoseFromDeepJm2 -
    heatToAquiferFromVadoseJm2;
  const signedAquiferOwnerHeatJm2 = heatToAquiferFromVadoseJm2;
  const deepVadoseTransferClosure = closure([
    -heatToVadoseFromDeepJm2, heatToVadoseFromDeepJm2
  ]);
  const vadoseAquiferTransferClosure = closure([
    -heatToAquiferFromVadoseJm2, heatToAquiferFromVadoseJm2
  ]);
  const deepOwnerClosure = closure([
    finalDeepSubsurfaceMatrixOwner.sensibleHeatJm2,
    -initialDeepSubsurfaceMatrixOwner.sensibleHeatJm2,
    -signedDeepOwnerHeatJm2
  ]);
  const vadoseOwnerClosure = closure([
    finalVadoseMatrixOwner.sensibleHeatJm2,
    -initialVadoseMatrixOwner.sensibleHeatJm2,
    -signedVadoseOwnerHeatJm2
  ]);
  const aquiferOwnerClosure = closure([
    finalAquiferMatrixOwner.sensibleHeatJm2,
    -initialAquiferMatrixOwner.sensibleHeatJm2,
    -signedAquiferOwnerHeatJm2
  ]);
  const combinedOwnerClosure = closure([
    finalDeepSubsurfaceMatrixOwner.sensibleHeatJm2,
    finalVadoseMatrixOwner.sensibleHeatJm2,
    finalAquiferMatrixOwner.sensibleHeatJm2,
    -initialDeepSubsurfaceMatrixOwner.sensibleHeatJm2,
    -initialVadoseMatrixOwner.sensibleHeatJm2,
    -initialAquiferMatrixOwner.sensibleHeatJm2
  ]);
  const closures = [deepVadoseTransferClosure,
    vadoseAquiferTransferClosure, deepOwnerClosure, vadoseOwnerClosure,
    aquiferOwnerClosure, combinedOwnerClosure];
  if (!closures.every(item => item.closed)) {
    throw new Error('Native vadose mediation did not close');
  }
  const stepId = String(context.stepId || `${proposal.stepId}:application`);
  const receipt = {
    schema: LAND_NATIVE_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA,
    stepId,
    status: Math.abs(heatToVadoseFromDeepJm2) <=
        LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J &&
        Math.abs(heatToAquiferFromVadoseJm2) <=
          LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J
      ? 'no-material-native-vadose-matrix-heat-transfer'
      : 'native-vadose-matrix-mediated',
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
    transfers: {
      deepVadose: {
        transferId: `${stepId}:deep-vadose`,
        signedHeatToVadoseMatrixJm2: Number(heatToVadoseFromDeepJm2),
        signedDeepOwnerHeatJm2: Number(-heatToVadoseFromDeepJm2),
        signedVadoseOwnerHeatJm2: Number(heatToVadoseFromDeepJm2)
      },
      vadoseAquifer: {
        transferId: `${stepId}:vadose-aquifer`,
        signedHeatToAquiferMatrixJm2:
          Number(heatToAquiferFromVadoseJm2),
        signedVadoseOwnerHeatJm2:
          Number(-heatToAquiferFromVadoseJm2),
        signedAquiferOwnerHeatJm2:
          Number(heatToAquiferFromVadoseJm2)
      },
      signedDeepOwnerHeatJm2: Number(signedDeepOwnerHeatJm2),
      signedVadoseOwnerHeatJm2: Number(signedVadoseOwnerHeatJm2),
      signedAquiferOwnerHeatJm2: Number(signedAquiferOwnerHeatJm2)
    },
    initialDeepSubsurfaceMatrixOwner,
    initialVadoseMatrixOwner,
    initialAquiferMatrixOwner,
    finalDeepSubsurfaceMatrixOwner,
    finalVadoseMatrixOwner,
    finalAquiferMatrixOwner,
    deepVadoseTransferClosure,
    vadoseAquiferTransferClosure,
    deepOwnerClosure,
    vadoseOwnerClosure,
    aquiferOwnerClosure,
    combinedOwnerClosure,
    migrationInitialization: {
      sourceWasNoHistoryCheckpoint:
        vadoseState.migrationCheckpoint === true,
      historicalHeatReconstructed: false,
      legacyCompatibilityEvidencePreserved: Boolean(
        column.land.matrixThermalCompatibility?.legacyR83Receipt ||
        column.land.matrixThermalCompatibility?.legacyR84Receipt)
    },
    truth: {
      persistentVadoseMatrixSensibleHeatOwner: true,
      currentR82AndR80SourcesBound: true,
      exactCoincidentDeepAndAquiferInterfaces: true,
      directDeepAquiferTransferApplied: false,
      directTransferReversalApplied: false,
      signedThreeOwnerEntriesApplied: true,
      allOwnerGeometryUnchangedByThisOrgan: true,
      waterMovedByThisOrgan: false,
      bothMediatedTransfersParameterized: true,
      allTemperatureEnvelopesRespected: true,
      scaleAwareNumericClosure: true,
      measuredResidualsPreserved: true,
      fixedAbsoluteToleranceOnly: false,
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
  vadoseState.owner = clone(finalVadoseMatrixOwner);
  vadoseState.lastStepReceipt = clone(receipt);
  vadoseState.migrationCheckpoint = false;
  column.land.lastVadoseMatrixThermalReceipt = clone(receipt);
  return clone(receipt);
}

export function vadoseMatrixThermalDescription() {
  return {
    stateSchema: LAND_VADOSE_MATRIX_THERMAL_STATE_SCHEMA,
    proposalSchema: LAND_VADOSE_MATRIX_THERMAL_PROPOSAL_SCHEMA,
    receiptSchema: LAND_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA,
    nativeProposalSchema: LAND_NATIVE_VADOSE_MATRIX_THERMAL_PROPOSAL_SCHEMA,
    nativeReceiptSchema: LAND_NATIVE_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA,
    closureSchema: LAND_VADOSE_MATRIX_THERMAL_CLOSURE_SCHEMA,
    closurePolicySchema: LAND_VADOSE_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA,
    baseInterfaceResponseTimescaleDays:
      LAND_VADOSE_MATRIX_BASE_INTERFACE_RESPONSE_TIMESCALE_DAYS,
    interfaceDistanceScaleM:
      LAND_VADOSE_MATRIX_INTERFACE_DISTANCE_SCALE_M,
    temperatureEnvelopeC: {
      minimum: LAND_VADOSE_MATRIX_MINIMUM_TEMPERATURE_C,
      maximum: LAND_VADOSE_MATRIX_MAXIMUM_TEMPERATURE_C
    },
    exactR83SeparationOwned: true,
    exactCoincidentDeepAndAquiferInterfaces: true,
    r83DirectTransferExplicitlyReconciled: true,
    currentRuntimeMode: 'native-vadose-mediation-without-direct-deep-aquifer-transfer',
    directDeepAquiferTransferAppliedByCurrentRuntime: false,
    directTransferReversalAppliedByCurrentRuntime: false,
    directTransferDoubleCounted: false,
    distanceAwareBulkResponsesParameterized: true,
    resolvedInterMatrixConduction: false,
    resolvedSubsurfaceConduction: false,
    resolvedAquiferConduction: false,
    geothermalForcingModeledByThisOrgan: false,
    phaseChangeModeledByThisOrgan: false,
    scientificCalibrationClaimed: false,
    globalUnloadedBoundaryClaimed: false
  };
}
