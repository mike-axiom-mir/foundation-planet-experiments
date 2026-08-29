import {
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
} from './land-hydrology-thermal.mjs?v=0.84.0-r84.1';
import {
  LAND_AQUIFER_MATRIX_THERMAL_STATE_SCHEMA,
  LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C,
  LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C,
  LAND_AQUIFER_MATRIX_MINIMUM_EFFECTIVE_DEPTH_M,
  LAND_AQUIFER_MATRIX_MAXIMUM_EFFECTIVE_DEPTH_M
} from './groundwater-aquifer-matrix-thermal.mjs?v=0.84.0-r84.1';
import {
  LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA,
  LAND_DEEP_SUBSURFACE_MATRIX_VOLUMETRIC_HEAT_CAPACITY_J_M3_K,
  LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C,
  LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C
} from './deep-soil-subsurface-matrix-thermal.mjs?v=0.84.0-r84.1';
import {
  LAND_DEEP_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA
} from './deep-aquifer-matrix-thermal.mjs?v=0.84.0-r84.1';
import {
  LAND_VADOSE_MATRIX_THERMAL_STATE_SCHEMA,
  LAND_VADOSE_MATRIX_THERMAL_PROPOSAL_SCHEMA,
  LAND_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA,
  LAND_VADOSE_MATRIX_THERMAL_CLOSURE_SCHEMA,
  LAND_VADOSE_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA,
  LAND_VADOSE_MATRIX_BASE_INTERFACE_RESPONSE_TIMESCALE_DAYS,
  LAND_VADOSE_MATRIX_INTERFACE_DISTANCE_SCALE_M,
  LAND_VADOSE_MATRIX_MINIMUM_TEMPERATURE_C,
  LAND_VADOSE_MATRIX_MAXIMUM_TEMPERATURE_C
} from './vadose-matrix-thermal.mjs?v=0.84.0-r84.1';

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

function receiptDigestValid(receipt) {
  if (!receipt || typeof receipt.digest !== 'string') return false;
  const unsigned = clone(receipt);
  delete unsigned.digest;
  return stableDigest(unsigned) === receipt.digest;
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

function closureAudit(actual, signedOperands) {
  const operands = signedOperands.map(Number);
  const residual = operands.reduce((sum, value) => sum + value, 0);
  const scale = operands.reduce((sum, value) =>
    sum + Math.abs(value), 0);
  const tolerance = round(Math.max(
    LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    scale * Number.EPSILON * LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
  ));
  const actualOperands = Array.isArray(actual?.signedOperands)
    ? actual.signedOperands : [];
  const valid = actual?.schema ===
      LAND_VADOSE_MATRIX_THERMAL_CLOSURE_SCHEMA &&
    actual?.policy?.schema ===
      LAND_VADOSE_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA &&
    actual.policy.kind === 'energy' &&
    same(actual.policy.absoluteFloor,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(actual.policy.ulpFactor,
      LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR) &&
    actual.policy.scaleBasis ===
      'sum-of-absolute-unrounded-signed-operands-joules-per-square-metre' &&
    actualOperands.length === operands.length &&
    actualOperands.every((value, index) =>
      same(value, operands[index],
        LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J)) &&
    same(actual.residual, residual,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(actual.numericTolerance, tolerance) &&
    actual.measuredResidualPreserved === true &&
    actual.closed === (Math.abs(residual) <= tolerance) &&
    actual.closed === true;
  return {
    valid,
    residual: Number(residual),
    tolerance,
    utilization: tolerance > 0 ? Math.abs(residual) / tolerance : 0
  };
}

function pairResponse(firstOwner, secondOwner, timescaleDays,
  durationDays) {
  const firstCapacity = Math.max(0,
    finite(firstOwner.heatCapacityJm2K));
  const secondCapacity = Math.max(0,
    finite(secondOwner.heatCapacityJm2K));
  const jointCapacity = firstCapacity > 0 && secondCapacity > 0
    ? firstCapacity * secondCapacity / (firstCapacity + secondCapacity)
    : 0;
  const responseFraction = 1 - Math.exp(-durationDays / timescaleDays);
  return {
    firstCapacity,
    secondCapacity,
    jointCapacity,
    responseFraction,
    requested: jointCapacity *
      (finite(firstOwner.temperatureC) - finite(secondOwner.temperatureC)) *
      responseFraction
  };
}

function envelopeScale(initialHeatJm2, deltaHeatJm2, heatCapacityJm2K,
  minimumTemperatureC, maximumTemperatureC) {
  if (!(heatCapacityJm2K > 0) || deltaHeatJm2 === 0) return 1;
  const minimumHeat = heatCapacityJm2K * minimumTemperatureC;
  const maximumHeat = heatCapacityJm2K * maximumTemperatureC;
  return deltaHeatJm2 > 0
    ? clamp((maximumHeat - initialHeatJm2) / deltaHeatJm2, 0, 1)
    : clamp((minimumHeat - initialHeatJm2) / deltaHeatJm2, 0, 1);
}

function result(status, detail) {
  return {
    id: 'land-vadose-matrix-thermal-owner-lineage',
    required: true,
    status,
    statement: 'The exact R83 gap is a persistent vadose mineral-matrix sensible-heat owner, and the R83 direct effect is explicitly reconciled before two conservative distance-aware interface transfers.',
    detail
  };
}

export function auditLandVadoseMatrixThermal(column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const state = column?.land?.vadoseMatrixThermal;
  const receipt = column?.land?.lastVadoseMatrixThermalReceipt;
  if (!receipt) {
    const checkpoint = state?.migrationCheckpoint === true;
    return result(column?.stepCount === 0 || checkpoint
      ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'v45-to-v46 migration creates the current vadose owner without inventing historical R84 mediation evidence'
        : column?.stepCount === 0
          ? 'land column has not stepped yet'
          : 'a stepped current land column is missing its vadose-matrix thermal receipt'
    });
  }
  const proposal = receipt.sourceProposal?.proposal;
  const sourceR83 = column?.land?.lastDeepAquiferMatrixThermalReceipt;
  const currentDeep = column?.land?.deepSubsurfaceMatrixThermal?.owner || {};
  const currentAquifer = column?.land?.aquiferMatrixThermal?.owner || {};
  const currentVadose = state?.owner || {};
  const initialPostR83Deep = receipt.initialPostR83DeepOwner || {};
  const initialPostR83Aquifer = receipt.initialPostR83AquiferOwner || {};
  const initialVadose = receipt.initialVadoseMatrixOwner || {};
  const mediatedDeep = receipt.mediatedInitialDeepOwner || {};
  const mediatedAquifer = receipt.mediatedInitialAquiferOwner || {};
  const finalDeep = receipt.finalDeepSubsurfaceMatrixOwner || {};
  const finalVadose = receipt.finalVadoseMatrixOwner || {};
  const finalAquifer = receipt.finalAquiferMatrixOwner || {};

  const sourceLineageValid =
    state?.schema === LAND_VADOSE_MATRIX_THERMAL_STATE_SCHEMA &&
    column?.land?.deepSubsurfaceMatrixThermal?.schema ===
      LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA &&
    column?.land?.aquiferMatrixThermal?.schema ===
      LAND_AQUIFER_MATRIX_THERMAL_STATE_SCHEMA &&
    receipt.schema === LAND_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    receiptDigestValid(receipt) &&
    column?.budget?.vadoseMatrixThermal?.digest === receipt.digest &&
    state.lastStepReceipt?.digest === receipt.digest &&
    proposal?.schema === LAND_VADOSE_MATRIX_THERMAL_PROPOSAL_SCHEMA &&
    receiptDigestValid(proposal) &&
    receipt.sourceProposal?.receiptDigest === proposal.digest &&
    receipt.sourceProposal?.stepId === proposal.stepId &&
    sourceR83?.schema ===
      LAND_DEEP_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    receiptDigestValid(sourceR83) &&
    receipt.sourceDeepAquiferMatrixThermal?.receiptDigest ===
      sourceR83.digest &&
    proposal.sourceDeepAquiferMatrixThermal?.receiptDigest ===
      sourceR83.digest &&
    receipt.sourceDeepAquiferMatrixThermal?.stepId === sourceR83.stepId;

  const surfaceLower = clamp(finite(column?.substrate?.soilDepthM, .3),
    .03, 5.5);
  const aquiferDepth = clamp(finite(column?.substrate?.aquiferDepthM, 8),
    8, 90);
  const aquiferEffectiveDepth = clamp(aquiferDepth * .25,
    LAND_AQUIFER_MATRIX_MINIMUM_EFFECTIVE_DEPTH_M,
    LAND_AQUIFER_MATRIX_MAXIMUM_EFFECTIVE_DEPTH_M);
  const aquiferUpper = Math.max(surfaceLower,
    aquiferDepth - aquiferEffectiveDepth);
  const upper = Number(mediatedDeep.lowerBoundaryDepthM);
  const lower = aquiferUpper;
  const thickness = lower - upper;
  const center = upper + thickness / 2;
  const deepCenter = Number(mediatedDeep.upperBoundaryDepthM) +
    Number(mediatedDeep.effectiveDepthM) / 2;
  const aquiferCenter = lower + aquiferEffectiveDepth / 2;
  const deepCenterDistance = center - deepCenter;
  const aquiferCenterDistance = aquiferCenter - center;
  const solidFraction = clamp(1 - finite(column?.substrate?.porosity, .46),
    .38, .94);
  const capacity = thickness * solidFraction *
    LAND_DEEP_SUBSURFACE_MATRIX_VOLUMETRIC_HEAT_CAPACITY_J_M3_K;
  const deepTimescale =
    LAND_VADOSE_MATRIX_BASE_INTERFACE_RESPONSE_TIMESCALE_DAYS *
    (1 + deepCenterDistance /
      LAND_VADOSE_MATRIX_INTERFACE_DISTANCE_SCALE_M);
  const aquiferTimescale =
    LAND_VADOSE_MATRIX_BASE_INTERFACE_RESPONSE_TIMESCALE_DAYS *
    (1 + aquiferCenterDistance /
      LAND_VADOSE_MATRIX_INTERFACE_DISTANCE_SCALE_M);
  const geometryValid = thickness > 0 &&
    receipt.geometry?.mode ===
      'exact-intervening-vadose-mineral-matrix-capacity' &&
    same(receipt.geometry.upperBoundaryDepthM, upper) &&
    same(receipt.geometry.lowerBoundaryDepthM, lower) &&
    same(receipt.geometry.effectiveDepthM, thickness) &&
    same(receipt.geometry.centerDepthM, center) &&
    same(receipt.geometry.deepMatrixLowerBoundaryDepthM, upper) &&
    same(receipt.geometry.aquiferMatrixUpperBoundaryDepthM, lower) &&
    receipt.geometry.deepInterfaceCoincident === true &&
    receipt.geometry.aquiferInterfaceCoincident === true &&
    receipt.geometry.ownerIntervalsOverlap === false &&
    same(receipt.geometry.solidFraction, solidFraction) &&
    same(receipt.geometry.volumetricHeatCapacityJm3K,
      LAND_DEEP_SUBSURFACE_MATRIX_VOLUMETRIC_HEAT_CAPACITY_J_M3_K) &&
    same(receipt.geometry.heatCapacityJm2K, capacity, 1e-6) &&
    same(receipt.geometry.deepInterfaceCenterDistanceM,
      deepCenterDistance) &&
    same(receipt.geometry.aquiferInterfaceCenterDistanceM,
      aquiferCenterDistance) &&
    same(receipt.geometry.deepInterfaceResponseTimescaleDays,
      deepTimescale) &&
    same(receipt.geometry.aquiferInterfaceResponseTimescaleDays,
      aquiferTimescale) &&
    same(proposal?.geometry?.effectiveDepthM, thickness) &&
    same(state?.parameterization?.effectiveDepthM, thickness) &&
    same(initialVadose.upperBoundaryDepthM, upper) &&
    same(initialVadose.lowerBoundaryDepthM, lower) &&
    same(initialVadose.heatCapacityJm2K, capacity, 1e-6) &&
    same(finalVadose.upperBoundaryDepthM, upper) &&
    same(finalVadose.lowerBoundaryDepthM, lower) &&
    same(finalVadose.heatCapacityJm2K, capacity, 1e-6);

  const sourceHeat = Number(sourceR83?.transfer
    ?.signedHeatToAquiferMatrixJm2);
  const reversal = -sourceHeat;
  const reconciliationValid =
    deepOwnersMatch(sourceR83?.finalDeepSubsurfaceMatrixOwner,
      initialPostR83Deep) &&
    aquiferOwnersMatch(sourceR83?.finalAquiferMatrixOwner,
      initialPostR83Aquifer) &&
    deepOwnersMatch(sourceR83?.initialDeepSubsurfaceMatrixOwner,
      mediatedDeep) &&
    aquiferOwnersMatch(sourceR83?.initialAquiferMatrixOwner,
      mediatedAquifer) &&
    deepOwnersMatch(proposal?.currentPostR83DeepOwner,
      initialPostR83Deep) &&
    aquiferOwnersMatch(proposal?.currentPostR83AquiferOwner,
      initialPostR83Aquifer) &&
    deepOwnersMatch(proposal?.mediatedInitialDeepOwner, mediatedDeep) &&
    aquiferOwnersMatch(proposal?.mediatedInitialAquiferOwner,
      mediatedAquifer) &&
    same(receipt.r83DirectTransferReconciliation
        ?.sourceSignedHeatToAquiferMatrixJm2, sourceHeat,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(receipt.r83DirectTransferReconciliation
        ?.signedReversalHeatToAquiferMatrixJm2, reversal,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(receipt.r83DirectTransferReconciliation
        ?.signedDeepOwnerHeatJm2, -reversal,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(receipt.r83DirectTransferReconciliation
        ?.signedAquiferOwnerHeatJm2, reversal,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    receipt.r83DirectTransferReconciliation
      ?.directTransferDoubleCounted === false;

  const duration = Number(proposal?.durationDays);
  const deepResponse = pairResponse(mediatedDeep, initialVadose,
    deepTimescale, duration);
  const aquiferResponse = pairResponse(initialVadose, mediatedAquifer,
    aquiferTimescale, duration);
  const requestedDeepToVadose = deepResponse.requested;
  const requestedVadoseToAquifer = aquiferResponse.requested;
  const requestedDeepDelta = -requestedDeepToVadose;
  const requestedVadoseDelta = requestedDeepToVadose -
    requestedVadoseToAquifer;
  const requestedAquiferDelta = requestedVadoseToAquifer;
  const scale = Math.min(
    envelopeScale(Number(mediatedDeep.sensibleHeatJm2),
      requestedDeepDelta, Number(mediatedDeep.heatCapacityJm2K),
      LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C,
      LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C),
    envelopeScale(Number(initialVadose.sensibleHeatJm2),
      requestedVadoseDelta, Number(initialVadose.heatCapacityJm2K),
      LAND_VADOSE_MATRIX_MINIMUM_TEMPERATURE_C,
      LAND_VADOSE_MATRIX_MAXIMUM_TEMPERATURE_C),
    envelopeScale(Number(mediatedAquifer.sensibleHeatJm2),
      requestedAquiferDelta, Number(mediatedAquifer.heatCapacityJm2K),
      LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C,
      LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C)
  );
  const appliedDeepToVadose = requestedDeepToVadose * scale;
  const appliedVadoseToAquifer = requestedVadoseToAquifer * scale;
  const responseValid = duration > 0 && duration <= 1.000001 &&
    proposal?.deepVadoseResponse?.mode ===
      'distance-aware-deep-vadose-matrix-bulk-interface-response' &&
    proposal?.vadoseAquiferResponse?.mode ===
      'distance-aware-vadose-aquifer-matrix-bulk-interface-response' &&
    same(proposal.deepVadoseResponse.effectiveResponseTimescaleDays,
      deepTimescale) &&
    same(proposal.deepVadoseResponse.responseFraction,
      deepResponse.responseFraction) &&
    same(proposal.deepVadoseResponse.jointHeatCapacityJm2K,
      deepResponse.jointCapacity, 1e-6) &&
    same(proposal.deepVadoseResponse.requestedHeatToSecondJm2,
      requestedDeepToVadose,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal.vadoseAquiferResponse.effectiveResponseTimescaleDays,
      aquiferTimescale) &&
    same(proposal.vadoseAquiferResponse.responseFraction,
      aquiferResponse.responseFraction) &&
    same(proposal.vadoseAquiferResponse.jointHeatCapacityJm2K,
      aquiferResponse.jointCapacity, 1e-6) &&
    same(proposal.vadoseAquiferResponse.requestedHeatToSecondJm2,
      requestedVadoseToAquifer,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal.requestedHeatToVadoseFromDeepJm2,
      requestedDeepToVadose,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal.requestedHeatToAquiferFromVadoseJm2,
      requestedVadoseToAquifer,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal.envelopeLimiterFraction, scale) &&
    same(proposal.appliedHeatToVadoseFromDeepJm2,
      appliedDeepToVadose,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal.appliedHeatToAquiferFromVadoseJm2,
      appliedVadoseToAquifer,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);

  const expectedFinalDeepHeat = Number(mediatedDeep.sensibleHeatJm2) -
    appliedDeepToVadose;
  const expectedFinalVadoseHeat = Number(initialVadose.sensibleHeatJm2) +
    appliedDeepToVadose - appliedVadoseToAquifer;
  const expectedFinalAquiferHeat =
    Number(mediatedAquifer.sensibleHeatJm2) + appliedVadoseToAquifer;
  const ownerBindingsValid = vadoseOwnersMatch(
      proposal?.initialVadoseMatrixOwner, initialVadose) &&
    deepOwnersMatch(finalDeep, currentDeep) &&
    vadoseOwnersMatch(finalVadose, currentVadose) &&
    aquiferOwnersMatch(finalAquifer, currentAquifer) &&
    same(finalDeep.sensibleHeatJm2, expectedFinalDeepHeat,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(finalVadose.sensibleHeatJm2, expectedFinalVadoseHeat,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(finalAquifer.sensibleHeatJm2, expectedFinalAquiferHeat,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(finalDeep.sensibleHeatJm2,
      Number(finalDeep.heatCapacityJm2K) * Number(finalDeep.temperatureC),
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(finalVadose.sensibleHeatJm2,
      Number(finalVadose.heatCapacityJm2K) *
        Number(finalVadose.temperatureC),
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(finalAquifer.sensibleHeatJm2,
      Number(finalAquifer.heatCapacityJm2K) *
        Number(finalAquifer.temperatureC),
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    Number(finalDeep.temperatureC) >=
      LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C &&
    Number(finalDeep.temperatureC) <=
      LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C &&
    Number(finalVadose.temperatureC) >=
      LAND_VADOSE_MATRIX_MINIMUM_TEMPERATURE_C &&
    Number(finalVadose.temperatureC) <=
      LAND_VADOSE_MATRIX_MAXIMUM_TEMPERATURE_C &&
    Number(finalAquifer.temperatureC) >=
      LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C &&
    Number(finalAquifer.temperatureC) <=
      LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C;

  const signedDeep = -reversal - appliedDeepToVadose;
  const signedVadose = appliedDeepToVadose - appliedVadoseToAquifer;
  const signedAquifer = reversal + appliedVadoseToAquifer;
  const transferEntriesValid =
    same(receipt.transfers?.deepVadose?.signedHeatToVadoseMatrixJm2,
      appliedDeepToVadose,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(receipt.transfers?.deepVadose?.signedDeepOwnerHeatJm2,
      -appliedDeepToVadose,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(receipt.transfers?.vadoseAquifer
        ?.signedHeatToAquiferMatrixJm2, appliedVadoseToAquifer,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(receipt.transfers?.vadoseAquifer?.signedVadoseOwnerHeatJm2,
      -appliedVadoseToAquifer,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(receipt.transfers?.signedDeepOwnerHeatJm2, signedDeep,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(receipt.transfers?.signedVadoseOwnerHeatJm2, signedVadose,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(receipt.transfers?.signedAquiferOwnerHeatJm2, signedAquifer,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);

  const r83Closure = closureAudit(receipt.r83ReconciliationClosure, [
    -reversal, reversal
  ]);
  const deepVadoseClosure = closureAudit(
    receipt.deepVadoseTransferClosure, [
      -appliedDeepToVadose, appliedDeepToVadose
    ]);
  const vadoseAquiferClosure = closureAudit(
    receipt.vadoseAquiferTransferClosure, [
      -appliedVadoseToAquifer, appliedVadoseToAquifer
    ]);
  const deepClosure = closureAudit(receipt.deepOwnerClosure, [
    Number(finalDeep.sensibleHeatJm2),
    -Number(initialPostR83Deep.sensibleHeatJm2),
    -signedDeep
  ]);
  const vadoseClosure = closureAudit(receipt.vadoseOwnerClosure, [
    Number(finalVadose.sensibleHeatJm2),
    -Number(initialVadose.sensibleHeatJm2),
    -signedVadose
  ]);
  const aquiferClosure = closureAudit(receipt.aquiferOwnerClosure, [
    Number(finalAquifer.sensibleHeatJm2),
    -Number(initialPostR83Aquifer.sensibleHeatJm2),
    -signedAquifer
  ]);
  const combinedClosure = closureAudit(receipt.combinedOwnerClosure, [
    Number(finalDeep.sensibleHeatJm2),
    Number(finalVadose.sensibleHeatJm2),
    Number(finalAquifer.sensibleHeatJm2),
    -Number(initialPostR83Deep.sensibleHeatJm2),
    -Number(initialVadose.sensibleHeatJm2),
    -Number(initialPostR83Aquifer.sensibleHeatJm2)
  ]);

  const truthValid =
    receipt.truth?.persistentVadoseMatrixSensibleHeatOwner === true &&
    receipt.truth?.exactR83SourceBound === true &&
    receipt.truth?.exactR83GapOwned === true &&
    receipt.truth?.exactCoincidentDeepAndAquiferInterfaces === true &&
    receipt.truth?.r83DirectTransferExplicitlyReconciled === true &&
    receipt.truth?.directTransferDoubleCounted === false &&
    receipt.truth?.signedThreeOwnerEntriesApplied === true &&
    receipt.truth?.allOwnerGeometryUnchangedByThisOrgan === true &&
    receipt.truth?.waterMovedByThisOrgan === false &&
    receipt.truth?.bothMediatedTransfersParameterized === true &&
    receipt.truth?.scaleAwareNumericClosure === true &&
    receipt.truth?.measuredResidualsPreserved === true &&
    receipt.truth?.fixedAbsoluteToleranceOnly === false &&
    receipt.truth?.externalHeatSourceAdded === false &&
    receipt.truth?.resolvedInterMatrixConduction === false &&
    receipt.truth?.resolvedSubsurfaceConduction === false &&
    receipt.truth?.resolvedAquiferConduction === false &&
    receipt.truth?.geothermalForcingModeledByThisOrgan === false &&
    receipt.truth?.phaseChangeModeledByThisOrgan === false &&
    receipt.truth?.scientificCalibrationClaimed === false &&
    receipt.truth?.globalUnloadedBoundaryClaimed === false &&
    proposal?.truth?.r83DirectTransferExplicitlyReconciled === true &&
    proposal?.truth?.directTransferDoubleCounted === false &&
    proposal?.truth?.resolvedInterMatrixConduction === false &&
    proposal?.truth?.scientificCalibrationClaimed === false &&
    state?.truth?.persistentVadoseMatrixSensibleHeatOwner === true &&
    column?.truth?.persistentVadoseMatrixSensibleHeatOwner === true &&
    column?.truth?.vadoseMatrixMediatedSensibleHeatExchange === true &&
    column?.truth?.r83DirectTransferDoubleCounted === false &&
    column?.truth?.resolvedSubsurfaceConduction === false &&
    column?.truth?.resolvedAquiferConduction === false &&
    column?.truth?.geothermalForcingModeled === false;

  const valid = sourceLineageValid && geometryValid &&
    reconciliationValid && responseValid && ownerBindingsValid &&
    transferEntriesValid && r83Closure.valid && deepVadoseClosure.valid &&
    vadoseAquiferClosure.valid && deepClosure.valid &&
    vadoseClosure.valid && aquiferClosure.valid &&
    combinedClosure.valid && truthValid;
  return result(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt?.schema || null,
    sourceLineageValid,
    geometryValid,
    r83ReconciliationValid: reconciliationValid,
    responseRecomputationValid: responseValid,
    ownerBindingsValid,
    transferEntriesValid,
    r83ReconciliationClosure: r83Closure,
    deepVadoseTransferClosure: deepVadoseClosure,
    vadoseAquiferTransferClosure: vadoseAquiferClosure,
    deepOwnerClosure: deepClosure,
    vadoseOwnerClosure: vadoseClosure,
    aquiferOwnerClosure: aquiferClosure,
    combinedOwnerClosure: combinedClosure,
    truthValid,
    truthChecks: {
      persistentOwner:
        receipt.truth?.persistentVadoseMatrixSensibleHeatOwner === true,
      exactGap: receipt.truth?.exactR83GapOwned === true,
      r83Reconciled:
        receipt.truth?.r83DirectTransferExplicitlyReconciled === true,
      noDoubleCount:
        receipt.truth?.directTransferDoubleCounted === false,
      noExternalHeat: receipt.truth?.externalHeatSourceAdded === false,
      noResolvedConduction:
        receipt.truth?.resolvedInterMatrixConduction === false,
      noGeothermal:
        receipt.truth?.geothermalForcingModeledByThisOrgan === false,
      noCalibration: receipt.truth?.scientificCalibrationClaimed === false,
      columnOwner:
        column?.truth?.persistentVadoseMatrixSensibleHeatOwner === true,
      columnMediation:
        column?.truth?.vadoseMatrixMediatedSensibleHeatExchange === true,
      columnNoDoubleCount:
        column?.truth?.r83DirectTransferDoubleCounted === false
    },
    vadoseThicknessM: Number(thickness),
    heatCapacityJm2K: Number(capacity),
    deepInterfaceResponseTimescaleDays: Number(deepTimescale),
    aquiferInterfaceResponseTimescaleDays: Number(aquiferTimescale)
  });
}
