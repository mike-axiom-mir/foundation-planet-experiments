import {
  LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K,
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR,
  LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM
} from './land-hydrology-thermal.mjs?v=0.81.0-r81.1';
import {
  LAND_DEEP_GROUNDWATER_WATER_THERMAL_RECEIPT_SCHEMA,
  LAND_DEEP_GROUNDWATER_WATER_MINIMUM_TEMPERATURE_C,
  LAND_DEEP_GROUNDWATER_WATER_MAXIMUM_TEMPERATURE_C
} from './deep-groundwater-water-thermal.mjs?v=0.81.0-r81.1';
import {
  LAND_AQUIFER_MATRIX_MINIMUM_EFFECTIVE_DEPTH_M,
  LAND_AQUIFER_MATRIX_MAXIMUM_EFFECTIVE_DEPTH_M
} from './groundwater-aquifer-matrix-thermal.mjs?v=0.81.0-r81.1';
import {
  LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA,
  LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_PROPOSAL_SCHEMA,
  LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
  LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_CLOSURE_SCHEMA,
  LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA,
  LAND_DEEP_SOIL_SUBSURFACE_MATRIX_RESPONSE_TIMESCALE_DAYS,
  LAND_DEEP_SUBSURFACE_MATRIX_VOLUMETRIC_HEAT_CAPACITY_J_M3_K,
  LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_EFFECTIVE_DEPTH_M,
  LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_EFFECTIVE_DEPTH_M,
  LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C,
  LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C
} from './deep-soil-subsurface-matrix-thermal.mjs?v=0.81.0-r81.1';
import {
  LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
  landSurfaceSubsurfaceMatrixThermalReceiptValid
} from './surface-subsurface-matrix-thermal.mjs?v=0.82.0-r82.1';
import {
  LAND_DEEP_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA,
  landDeepAquiferMatrixThermalReceiptValid
} from './deep-aquifer-matrix-thermal.mjs?v=0.83.0-r83.1';
import {
  LAND_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA,
  LAND_NATIVE_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA,
  landVadoseMatrixThermalReceiptValid,
  landNativeVadoseMatrixThermalReceiptValid
} from './vadose-matrix-thermal.mjs?v=0.85.0-r85.1';

const finite = value => Number.isFinite(Number(value));
const same = (left, right, tolerance = 1e-12) =>
  finite(left) && finite(right) &&
  Math.abs(Number(left) - Number(right)) <= tolerance;
const clone = value => JSON.parse(JSON.stringify(value));
const round = (value, digits = 12) =>
  Number(Number(value).toFixed(digits));
const clamp = (value, minimum, maximum) =>
  Math.max(minimum, Math.min(maximum, value));

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

function deepSoilOwnersMatch(left = {}, right = {}) {
  return same(left.trackedWaterMm, right.trackedWaterMm,
      LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(left.sensibleHeatJm2, right.sensibleHeatJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(left.waterTemperatureC, right.waterTemperatureC);
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

function result(status, detail) {
  return {
    id: 'land-deep-soil-subsurface-matrix-thermal-owner-lineage',
    status,
    required: status !== 'NOT_APPLICABLE',
    statement: 'The persistent deep-soil-water and parameterized non-overlapping deep-subsurface-matrix sensible-heat owners exchange one signed, paired amount without moving water or changing owner geometry.',
    detail
  };
}

function independentlyDeriveGeometry(substrate = {}) {
  const soilDepthM = clamp(finite(substrate.soilDepthM)
    ? Number(substrate.soilDepthM) : .3, .03, 5.5);
  const aquiferDepthM = clamp(finite(substrate.aquiferDepthM)
    ? Number(substrate.aquiferDepthM) : 8, 8, 90);
  const aquiferMatrixEffectiveDepthM = clamp(aquiferDepthM * .25,
    LAND_AQUIFER_MATRIX_MINIMUM_EFFECTIVE_DEPTH_M,
    LAND_AQUIFER_MATRIX_MAXIMUM_EFFECTIVE_DEPTH_M);
  const aquiferMatrixUpperBoundaryDepthM = Math.max(soilDepthM,
    aquiferDepthM - aquiferMatrixEffectiveDepthM);
  const availableNonOverlappingThicknessM = Math.max(0,
    aquiferMatrixUpperBoundaryDepthM - soilDepthM);
  const effectiveDepthM = availableNonOverlappingThicknessM >=
      LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_EFFECTIVE_DEPTH_M
    ? clamp(availableNonOverlappingThicknessM * .25,
      LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_EFFECTIVE_DEPTH_M,
      Math.min(LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_EFFECTIVE_DEPTH_M,
        availableNonOverlappingThicknessM))
    : 0;
  const upperBoundaryDepthM = soilDepthM;
  const lowerBoundaryDepthM = upperBoundaryDepthM + effectiveDepthM;
  const separationToAquiferMatrixM = Math.max(0,
    aquiferMatrixUpperBoundaryDepthM - lowerBoundaryDepthM);
  const porosity = finite(substrate.porosity)
    ? Number(substrate.porosity) : .46;
  const solidFraction = clamp(1 - porosity, .38, .94);
  return {
    mode: 'bounded-non-overlapping-deep-subsurface-mineral-matrix-capacity',
    surfaceOwnerLowerBoundaryDepthM: soilDepthM,
    aquiferMatrixUpperBoundaryDepthM,
    availableNonOverlappingThicknessM,
    upperBoundaryDepthM,
    lowerBoundaryDepthM,
    effectiveDepthM,
    separationToAquiferMatrixM,
    solidFraction,
    volumetricHeatCapacityJm3K:
      LAND_DEEP_SUBSURFACE_MATRIX_VOLUMETRIC_HEAT_CAPACITY_J_M3_K,
    heatCapacityJm2K: effectiveDepthM * solidFraction *
      LAND_DEEP_SUBSURFACE_MATRIX_VOLUMETRIC_HEAT_CAPACITY_J_M3_K
  };
}

function geometryMatches(actual = {}, expected = {}) {
  return actual.mode === expected.mode &&
    same(actual.surfaceOwnerLowerBoundaryDepthM,
      expected.surfaceOwnerLowerBoundaryDepthM) &&
    same(actual.aquiferMatrixUpperBoundaryDepthM,
      expected.aquiferMatrixUpperBoundaryDepthM) &&
    same(actual.availableNonOverlappingThicknessM,
      expected.availableNonOverlappingThicknessM) &&
    same(actual.upperBoundaryDepthM, expected.upperBoundaryDepthM) &&
    same(actual.lowerBoundaryDepthM, expected.lowerBoundaryDepthM) &&
    same(actual.effectiveDepthM, expected.effectiveDepthM) &&
    same(actual.separationToAquiferMatrixM,
      expected.separationToAquiferMatrixM) &&
    same(actual.solidFraction, expected.solidFraction) &&
    same(actual.volumetricHeatCapacityJm3K,
      expected.volumetricHeatCapacityJm3K) &&
    same(actual.heatCapacityJm2K, expected.heatCapacityJm2K, 1e-6);
}

function ownerGeometryMatches(owner = {}, expected = {}) {
  return owner.materialClass ===
      'parameterized-deep-subsurface-mineral-matrix' &&
    same(owner.upperBoundaryDepthM, expected.upperBoundaryDepthM) &&
    same(owner.lowerBoundaryDepthM, expected.lowerBoundaryDepthM) &&
    same(owner.effectiveDepthM, expected.effectiveDepthM) &&
    same(owner.separationToAquiferMatrixM,
      expected.separationToAquiferMatrixM) &&
    same(owner.solidFraction, expected.solidFraction) &&
    same(owner.volumetricHeatCapacityJm3K,
      expected.volumetricHeatCapacityJm3K) &&
    same(owner.heatCapacityJm2K, expected.heatCapacityJm2K, 1e-6);
}

function closureAudit(closure, signedOperands) {
  const operands = signedOperands.map(Number);
  const validOperands = operands.length > 0 && operands.every(finite);
  const residual = validOperands
    ? operands.reduce((sum, value) => sum + value, 0) : NaN;
  const tolerance = validOperands ? round(Math.max(
    LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    operands.reduce((sum, value) => sum + Math.abs(value), 0) *
      Number.EPSILON * LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
  )) : NaN;
  const utilization = validOperands
    ? round(Math.abs(residual) / tolerance) : NaN;
  const embedded = closure?.signedOperands;
  const valid = validOperands &&
    closure?.schema ===
      LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_CLOSURE_SCHEMA &&
    closure?.policy?.schema ===
      LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA &&
    closure?.policy?.kind === 'energy' &&
    Number(closure?.policy?.absoluteFloor) ===
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J &&
    Number(closure?.policy?.ulpFactor) ===
      LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR &&
    closure?.policy?.scaleBasis ===
      'sum-of-absolute-unrounded-signed-operands-joules-per-square-metre' &&
    Array.isArray(embedded) && embedded.length === operands.length &&
    embedded.every((value, index) => same(value, operands[index], 1e-6)) &&
    same(closure?.residual, residual, 1e-6) &&
    same(closure?.numericTolerance, tolerance) &&
    Number(closure?.toleranceUtilization) === utilization &&
    closure?.closed === (Math.abs(residual) <= tolerance) &&
    closure?.measuredResidualPreserved === true;
  return { valid, residual, tolerance, utilization };
}

export function auditLandDeepSoilSubsurfaceMatrixThermal(column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', { kind: column?.kind || null });
  }
  const state = column?.land?.deepSubsurfaceMatrixThermal;
  const receipt = state?.lastStepReceipt;
  if (!receipt) {
    const migrationCheckpoint = state?.migrationCheckpoint === true;
    const unstepped = Number(column?.stepCount || 0) === 0;
    return result(migrationCheckpoint || unstepped
      ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: migrationCheckpoint
        ? 'v42-to-v43 migration initializes the matrix from current deep-soil-water temperature without inventing historical exchange evidence'
        : unstepped
          ? 'the land column has not advanced yet'
          : 'a stepped current land column is missing its deep-soil/subsurface-matrix thermal receipt',
      migrationCheckpoint,
      unstepped
    });
  }

  const proposal = receipt.sourceProposal?.proposal;
  const sourceR79 = column?.land?.lastDeepGroundwaterWaterThermalReceipt;
  const currentDeepSoilOwner = column?.land?.hydrologyThermal
    ?.reservoirs?.deepSoil || {};
  const currentMatrixOwner = state?.owner || {};
  const initialDeepSoilOwner = receipt.initialDeepSoilOwner || {};
  const finalDeepSoilOwner = receipt.finalDeepSoilOwner || {};
  const initialMatrixOwner =
    receipt.initialDeepSubsurfaceMatrixOwner || {};
  const finalMatrixOwner = receipt.finalDeepSubsurfaceMatrixOwner || {};
  const heatToDeepSoilJm2 = Number(
    receipt.transfer?.signedHeatToDeepSoilJm2);

  const sourceLineageValid =
    state?.schema === LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA &&
    receipt.schema ===
      LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    receiptDigestValid(receipt) &&
    column?.budget?.deepSoilSubsurfaceMatrixThermal?.digest ===
      receipt.digest &&
    proposal?.schema ===
      LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_PROPOSAL_SCHEMA &&
    receiptDigestValid(proposal) &&
    receipt.sourceProposal?.receiptDigest === proposal.digest &&
    receipt.sourceProposal?.stepId === proposal.stepId &&
    sourceR79?.schema ===
      LAND_DEEP_GROUNDWATER_WATER_THERMAL_RECEIPT_SCHEMA &&
    receiptDigestValid(sourceR79) &&
    receipt.sourceDeepGroundwaterWaterThermal?.receiptDigest ===
      sourceR79.digest &&
    receipt.sourceDeepGroundwaterWaterThermal?.stepId ===
      sourceR79.stepId &&
    proposal?.sourceDeepGroundwaterWaterThermal?.receiptDigest ===
      sourceR79.digest;

  const expectedGeometry = independentlyDeriveGeometry(column.substrate);
  const geometryValid = expectedGeometry.effectiveDepthM >=
      LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_EFFECTIVE_DEPTH_M &&
    expectedGeometry.effectiveDepthM <=
      LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_EFFECTIVE_DEPTH_M &&
    expectedGeometry.upperBoundaryDepthM ===
      expectedGeometry.surfaceOwnerLowerBoundaryDepthM &&
    expectedGeometry.lowerBoundaryDepthM >
      expectedGeometry.upperBoundaryDepthM &&
    expectedGeometry.lowerBoundaryDepthM <=
      expectedGeometry.aquiferMatrixUpperBoundaryDepthM &&
    expectedGeometry.separationToAquiferMatrixM >= 0 &&
    geometryMatches(state.parameterization, expectedGeometry) &&
    geometryMatches(proposal?.geometry, expectedGeometry) &&
    geometryMatches(receipt?.geometry, expectedGeometry) &&
    ownerGeometryMatches(initialMatrixOwner, expectedGeometry) &&
    ownerGeometryMatches(finalMatrixOwner, expectedGeometry) &&
    ownerGeometryMatches(currentMatrixOwner, expectedGeometry);

  const deepSoilCapacity =
    Number(proposal?.initialDeepSoilOwner?.trackedWaterMm) *
      LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K;
  const matrixCapacity = Number(
    proposal?.initialDeepSubsurfaceMatrixOwner?.heatCapacityJm2K);
  const responseFraction = 1 - Math.exp(
    -Number(proposal?.durationDays) /
      LAND_DEEP_SOIL_SUBSURFACE_MATRIX_RESPONSE_TIMESCALE_DAYS);
  const jointCapacity = deepSoilCapacity > 0 && matrixCapacity > 0
    ? deepSoilCapacity * matrixCapacity /
      (deepSoilCapacity + matrixCapacity) : 0;
  const requested = jointCapacity *
    (Number(proposal?.initialDeepSubsurfaceMatrixOwner?.temperatureC) -
      Number(proposal?.initialDeepSoilOwner?.waterTemperatureC)) *
      responseFraction;
  const minimum = Math.max(
    deepSoilCapacity *
      (LAND_DEEP_GROUNDWATER_WATER_MINIMUM_TEMPERATURE_C -
      Number(proposal?.initialDeepSoilOwner?.waterTemperatureC)),
    matrixCapacity *
      (Number(proposal?.initialDeepSubsurfaceMatrixOwner?.temperatureC) -
        LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C));
  const maximum = Math.min(
    deepSoilCapacity *
      (LAND_DEEP_GROUNDWATER_WATER_MAXIMUM_TEMPERATURE_C -
      Number(proposal?.initialDeepSoilOwner?.waterTemperatureC)),
    matrixCapacity *
      (Number(proposal?.initialDeepSubsurfaceMatrixOwner?.temperatureC) -
        LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C));
  const expectedHeat = deepSoilCapacity > 0 && matrixCapacity > 0
    ? clamp(requested, minimum, maximum) : 0;
  const proposalRecomputationValid =
    Number(proposal?.durationDays) > 0 &&
    Number(proposal?.durationDays) <= 1.000001 &&
    deepSoilOwnersMatch(proposal?.initialDeepSoilOwner,
      initialDeepSoilOwner) &&
    matrixOwnersMatch(proposal?.initialDeepSubsurfaceMatrixOwner,
      initialMatrixOwner) &&
    geometryMatches(proposal?.geometry, expectedGeometry) &&
    same(proposal?.response?.responseTimescaleDays,
      LAND_DEEP_SOIL_SUBSURFACE_MATRIX_RESPONSE_TIMESCALE_DAYS) &&
    same(proposal?.response?.responseFraction, responseFraction) &&
    same(proposal?.response?.deepSoilWaterHeatCapacityJm2K,
      deepSoilCapacity, 1e-6) &&
    same(proposal?.response?.deepSubsurfaceMatrixHeatCapacityJm2K,
      matrixCapacity, 1e-6) &&
    same(proposal?.response?.jointHeatCapacityJm2K,
      jointCapacity, 1e-6) &&
    same(proposal?.requestedHeatToDeepSoilJm2, requested,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.minimumHeatToDeepSoilJm2, minimum,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.maximumHeatToDeepSoilJm2, maximum,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.appliedHeatToDeepSoilJm2, expectedHeat,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.thermalEnvelopeLimiterJm2, expectedHeat - requested,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(heatToDeepSoilJm2, expectedHeat,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);

  const downstreamSurfaceMatrixReceipt = column?.land
    ?.lastSurfaceSubsurfaceMatrixThermalReceipt;
  const downstreamDeepAquiferMatrixReceipt = column?.land
    ?.lastDeepAquiferMatrixThermalReceipt;
  const downstreamVadoseMatrixReceipt = column?.land
    ?.lastVadoseMatrixThermalReceipt;
  const downstreamVadoseDeepBindingValid = downstreamVadoseMatrixReceipt
    ? downstreamVadoseMatrixReceipt.schema ===
        LAND_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
      landVadoseMatrixThermalReceiptValid(
        downstreamVadoseMatrixReceipt) &&
      downstreamVadoseMatrixReceipt.sourceDeepAquiferMatrixThermal
        ?.receiptDigest === downstreamDeepAquiferMatrixReceipt?.digest &&
      matrixOwnersMatch(
        downstreamVadoseMatrixReceipt.initialPostR83DeepOwner,
        downstreamDeepAquiferMatrixReceipt
          ?.finalDeepSubsurfaceMatrixOwner) &&
      matrixOwnersMatch(
        downstreamVadoseMatrixReceipt.finalDeepSubsurfaceMatrixOwner,
        currentMatrixOwner) &&
      downstreamVadoseMatrixReceipt.truth
        ?.r83DirectTransferExplicitlyReconciled === true &&
      downstreamVadoseMatrixReceipt.truth
        ?.directTransferDoubleCounted === false
    : matrixOwnersMatch(downstreamDeepAquiferMatrixReceipt
      ?.finalDeepSubsurfaceMatrixOwner, currentMatrixOwner);
  const downstreamNativeVadoseDeepBindingValid =
    downstreamVadoseMatrixReceipt?.schema ===
      LAND_NATIVE_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    landNativeVadoseMatrixThermalReceiptValid(
      downstreamVadoseMatrixReceipt) &&
    downstreamVadoseMatrixReceipt.sourceSurfaceSubsurfaceMatrixThermal
      ?.receiptDigest === downstreamSurfaceMatrixReceipt?.digest &&
    matrixOwnersMatch(
      downstreamVadoseMatrixReceipt.initialDeepSubsurfaceMatrixOwner,
      downstreamSurfaceMatrixReceipt?.finalDeepSubsurfaceMatrixOwner) &&
    matrixOwnersMatch(
      downstreamVadoseMatrixReceipt.finalDeepSubsurfaceMatrixOwner,
      currentMatrixOwner) &&
    downstreamVadoseMatrixReceipt.truth?.directDeepAquiferTransferApplied ===
      false &&
    downstreamVadoseMatrixReceipt.truth?.directTransferReversalApplied ===
      false;
  const downstreamMatrixOwnerBindingValid =
    downstreamSurfaceMatrixReceipt
      ? downstreamSurfaceMatrixReceipt.schema ===
          LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
        landSurfaceSubsurfaceMatrixThermalReceiptValid(
          downstreamSurfaceMatrixReceipt) &&
        downstreamSurfaceMatrixReceipt
          .sourceDeepSoilSubsurfaceMatrixThermal?.receiptDigest ===
            receipt.digest &&
        downstreamSurfaceMatrixReceipt
          .sourceDeepSoilSubsurfaceMatrixThermal?.stepId ===
            receipt.stepId &&
        matrixOwnersMatch(downstreamSurfaceMatrixReceipt
          .initialDeepSubsurfaceMatrixOwner, finalMatrixOwner) &&
        matrixOwnersMatch(downstreamSurfaceMatrixReceipt
          .finalDeepSubsurfaceMatrixOwner,
          downstreamNativeVadoseDeepBindingValid
            ? downstreamVadoseMatrixReceipt.initialDeepSubsurfaceMatrixOwner
            : downstreamDeepAquiferMatrixReceipt
              ? downstreamDeepAquiferMatrixReceipt
                .initialDeepSubsurfaceMatrixOwner
              : currentMatrixOwner) &&
        (downstreamNativeVadoseDeepBindingValid ||
          (downstreamDeepAquiferMatrixReceipt
          ? downstreamDeepAquiferMatrixReceipt.schema ===
              LAND_DEEP_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA &&
            landDeepAquiferMatrixThermalReceiptValid(
              downstreamDeepAquiferMatrixReceipt) &&
            downstreamDeepAquiferMatrixReceipt
              .sourceSurfaceSubsurfaceMatrixThermal?.receiptDigest ===
                downstreamSurfaceMatrixReceipt.digest &&
            downstreamDeepAquiferMatrixReceipt
              .sourceSurfaceSubsurfaceMatrixThermal?.stepId ===
                downstreamSurfaceMatrixReceipt.stepId &&
            downstreamVadoseDeepBindingValid
          : !downstreamVadoseMatrixReceipt))
      : !downstreamDeepAquiferMatrixReceipt &&
        matrixOwnersMatch(finalMatrixOwner, currentMatrixOwner);
  const ownerBindingsValid =
    deepSoilOwnersMatch(sourceR79?.finalDeepSoilOwner,
      initialDeepSoilOwner) &&
    deepSoilOwnersMatch(finalDeepSoilOwner, currentDeepSoilOwner) &&
    downstreamMatrixOwnerBindingValid &&
    same(finalDeepSoilOwner.trackedWaterMm,
      initialDeepSoilOwner.trackedWaterMm,
      LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(finalDeepSoilOwner.sensibleHeatJm2,
      Number(initialDeepSoilOwner.sensibleHeatJm2) +
        heatToDeepSoilJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(finalMatrixOwner.sensibleHeatJm2,
      Number(initialMatrixOwner.sensibleHeatJm2) - heatToDeepSoilJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(finalMatrixOwner.heatCapacityJm2K,
      initialMatrixOwner.heatCapacityJm2K, 1e-6) &&
    Number(finalDeepSoilOwner.waterTemperatureC) >=
      LAND_DEEP_GROUNDWATER_WATER_MINIMUM_TEMPERATURE_C &&
    Number(finalDeepSoilOwner.waterTemperatureC) <=
      LAND_DEEP_GROUNDWATER_WATER_MAXIMUM_TEMPERATURE_C &&
    Number(finalMatrixOwner.temperatureC) >=
      LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C &&
    Number(finalMatrixOwner.temperatureC) <=
      LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C;

  const paired = closureAudit(receipt.pairedTransferClosure,
    [heatToDeepSoilJm2, -heatToDeepSoilJm2]);
  const deepSoil = closureAudit(receipt.deepSoilOwnerClosure, [
    Number(finalDeepSoilOwner.sensibleHeatJm2),
    -Number(initialDeepSoilOwner.sensibleHeatJm2),
    -heatToDeepSoilJm2
  ]);
  const matrix = closureAudit(receipt.deepSubsurfaceMatrixOwnerClosure, [
    Number(finalMatrixOwner.sensibleHeatJm2),
    -Number(initialMatrixOwner.sensibleHeatJm2),
    heatToDeepSoilJm2
  ]);
  const combined = closureAudit(receipt.combinedOwnerClosure, [
    Number(finalDeepSoilOwner.sensibleHeatJm2),
    Number(finalMatrixOwner.sensibleHeatJm2),
    -Number(initialDeepSoilOwner.sensibleHeatJm2),
    -Number(initialMatrixOwner.sensibleHeatJm2)
  ]);

  const expectedDirection = heatToDeepSoilJm2 > 0
    ? 'deep-subsurface-matrix-to-deep-soil-water'
    : heatToDeepSoilJm2 < 0
      ? 'deep-soil-water-to-deep-subsurface-matrix' : 'none';
  const truthValid = receipt.transfer?.direction === expectedDirection &&
    same(receipt.transfer?.signedDeepSoilOwnerHeatJm2,
      heatToDeepSoilJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(receipt.transfer?.signedDeepSubsurfaceMatrixOwnerHeatJm2,
      -heatToDeepSoilJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    receipt.truth?.existingDeepSoilWaterAndSubsurfaceMatrixOwnersPaired ===
      true &&
    receipt.truth?.deepSoilWaterUnchangedByThisOrgan === true &&
    receipt.truth?.subsurfaceMatrixGeometryUnchangedByThisOrgan === true &&
    receipt.truth?.intervalBelowSurfaceOwner === true &&
    receipt.truth?.intervalAboveAquiferMatrixOwner === true &&
    receipt.truth?.ownerIntervalsDoNotOverlap === true &&
    receipt.truth?.bulkResponseParameterized === true &&
    receipt.truth?.distinctFromLandSurfaceSensibleHeatOwner === true &&
    receipt.truth?.distinctFromAquiferMatrixSensibleHeatOwner === true &&
    receipt.truth?.resolvedSubsurfaceConduction === false &&
    receipt.truth?.geothermalForcingModeledByThisOrgan === false &&
    receipt.truth?.phaseChangeModeledByThisOrgan === false &&
    receipt.truth?.scientificCalibrationClaimed === false &&
    receipt.truth?.globalUnloadedBoundaryClaimed === false &&
    state?.truth?.persistentDeepSubsurfaceMatrixSensibleHeatOwner ===
      true &&
    state?.truth?.distinctFromLandSurfaceSensibleHeatOwner === true &&
    state?.truth?.distinctFromAquiferMatrixSensibleHeatOwner === true &&
    column?.truth?.persistentDeepSubsurfaceMatrixThermalOwner === true &&
    column?.truth?.pairedDeepSoilSubsurfaceMatrixSensibleHeatExchange ===
      true &&
    column?.truth?.bulkDeepSoilSubsurfaceMatrixThermalResponse === true &&
    column?.truth?.deepSubsurfaceOwnerIntervalsNonOverlapping === true &&
    column?.truth?.resolvedSubsurfaceConduction === false &&
    column?.truth?.geothermalForcingModeled === false;

  const valid = sourceLineageValid && geometryValid &&
    proposalRecomputationValid && ownerBindingsValid && paired.valid &&
    deepSoil.valid && matrix.valid && combined.valid && truthValid;
  return result(valid ? 'PASS' : 'FAIL', {
    expectedReceiptSchema:
      LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
    actualReceiptSchema: receipt?.schema || null,
    sourceLineageValid,
    geometryValid,
    proposalRecomputationValid,
    ownerBindingsValid,
    downstreamSurfaceMatrixOwnerBindingValid:
      downstreamMatrixOwnerBindingValid,
    downstreamDeepAquiferMatrixReceiptPresent:
      Boolean(downstreamDeepAquiferMatrixReceipt),
    pairedTransferClosure: paired,
    deepSoilOwnerClosure: deepSoil,
    deepSubsurfaceMatrixOwnerClosure: matrix,
    combinedOwnerClosure: combined,
    truthValid,
    signedHeatToDeepSoilJm2: heatToDeepSoilJm2,
    intervalDepthM: {
      upper: expectedGeometry.upperBoundaryDepthM,
      lower: expectedGeometry.lowerBoundaryDepthM,
      aquiferMatrixUpper: expectedGeometry.aquiferMatrixUpperBoundaryDepthM,
      separation: expectedGeometry.separationToAquiferMatrixM
    },
    initialDeepSoilTemperatureC:
      initialDeepSoilOwner.waterTemperatureC ?? null,
    finalDeepSoilTemperatureC:
      finalDeepSoilOwner.waterTemperatureC ?? null,
    initialDeepSubsurfaceMatrixTemperatureC:
      initialMatrixOwner.temperatureC ?? null,
    finalDeepSubsurfaceMatrixTemperatureC:
      finalMatrixOwner.temperatureC ?? null
  });
}
