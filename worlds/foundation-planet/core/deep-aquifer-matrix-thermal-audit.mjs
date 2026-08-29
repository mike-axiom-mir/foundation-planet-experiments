import {
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
} from './land-hydrology-thermal.mjs?v=0.83.0-r83.1';
import {
  LAND_AQUIFER_MATRIX_THERMAL_STATE_SCHEMA,
  LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA,
  LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C,
  LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C
} from './groundwater-aquifer-matrix-thermal.mjs?v=0.83.0-r83.1';
import {
  LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA,
  LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C,
  LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C
} from './deep-soil-subsurface-matrix-thermal.mjs?v=0.83.0-r83.1';
import {
  LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA
} from './surface-subsurface-matrix-thermal.mjs?v=0.83.0-r83.1';
import {
  LAND_DEEP_AQUIFER_MATRIX_THERMAL_PROPOSAL_SCHEMA,
  LAND_DEEP_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA,
  LAND_DEEP_AQUIFER_MATRIX_THERMAL_CLOSURE_SCHEMA,
  LAND_DEEP_AQUIFER_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA,
  LAND_DEEP_AQUIFER_MATRIX_BASE_RESPONSE_TIMESCALE_DAYS,
  LAND_DEEP_AQUIFER_MATRIX_DISTANCE_SCALE_M
} from './deep-aquifer-matrix-thermal.mjs?v=0.83.0-r83.1';
import {
  LAND_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA,
  landVadoseMatrixThermalReceiptValid
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
      LAND_DEEP_AQUIFER_MATRIX_THERMAL_CLOSURE_SCHEMA &&
    actual?.policy?.schema ===
      LAND_DEEP_AQUIFER_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA &&
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

function result(status, detail) {
  return {
    id: 'land-deep-aquifer-matrix-thermal-owner-lineage',
    required: true,
    status,
    statement: 'The separated persistent deep-subsurface and aquifer-matrix sensible-heat owners exchange one distance-aware signed paired amount without changing owner geometry.',
    detail
  };
}

export function auditLandDeepAquiferMatrixThermal(column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column?.land?.lastDeepAquiferMatrixThermalReceipt;
  if (!receipt) {
    const checkpoint = column?.land
      ?.deepAquiferMatrixThermalMigrationCheckpoint === true;
    return result(column?.stepCount === 0 || checkpoint
      ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'v44-to-v45 migration preserves both current matrix owners without inventing historical R83 exchange evidence'
        : column?.stepCount === 0
          ? 'land column has not stepped yet'
          : 'a stepped current land column is missing its deep/aquifer-matrix thermal receipt'
    });
  }
  const proposal = receipt.sourceProposal?.proposal;
  const sourceR82 = column?.land?.lastSurfaceSubsurfaceMatrixThermalReceipt;
  const sourceR80 = column?.land?.aquiferMatrixThermal?.lastStepReceipt;
  const currentDeepOwner = column?.land?.deepSubsurfaceMatrixThermal
    ?.owner || {};
  const currentAquiferOwner = column?.land?.aquiferMatrixThermal
    ?.owner || {};
  const initialDeepOwner = receipt.initialDeepSubsurfaceMatrixOwner || {};
  const finalDeepOwner = receipt.finalDeepSubsurfaceMatrixOwner || {};
  const initialAquiferOwner = receipt.initialAquiferMatrixOwner || {};
  const finalAquiferOwner = receipt.finalAquiferMatrixOwner || {};
  const heatToAquiferJm2 = Number(
    receipt.transfer?.signedHeatToAquiferMatrixJm2);
  const downstreamVadoseReceipt = column?.land
    ?.lastVadoseMatrixThermalReceipt;

  const sourceLineageValid =
    column?.land?.deepSubsurfaceMatrixThermal?.schema ===
      LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA &&
    column?.land?.aquiferMatrixThermal?.schema ===
      LAND_AQUIFER_MATRIX_THERMAL_STATE_SCHEMA &&
    receipt.schema === LAND_DEEP_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    receiptDigestValid(receipt) &&
    column?.budget?.deepAquiferMatrixThermal?.digest === receipt.digest &&
    proposal?.schema === LAND_DEEP_AQUIFER_MATRIX_THERMAL_PROPOSAL_SCHEMA &&
    receiptDigestValid(proposal) &&
    receipt.sourceProposal?.receiptDigest === proposal.digest &&
    receipt.sourceProposal?.stepId === proposal.stepId &&
    sourceR82?.schema ===
      LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    receiptDigestValid(sourceR82) &&
    receipt.sourceSurfaceSubsurfaceMatrixThermal?.receiptDigest ===
      sourceR82.digest &&
    proposal.sourceSurfaceSubsurfaceMatrixThermal?.receiptDigest ===
      sourceR82.digest &&
    sourceR80?.schema ===
      LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    receiptDigestValid(sourceR80) &&
    receipt.sourceGroundwaterAquiferMatrixThermal?.receiptDigest ===
      sourceR80.digest &&
    proposal.sourceGroundwaterAquiferMatrixThermal?.receiptDigest ===
      sourceR80.digest;

  const surfaceLower = clamp(
    finite(column?.substrate?.soilDepthM, .3), .03, 5.5);
  const aquiferDepth = clamp(
    finite(column?.substrate?.aquiferDepthM, 8), 8, 90);
  const aquiferEffectiveDepth = clamp(aquiferDepth * .25, 2, 20);
  const aquiferUpper = Math.max(surfaceLower,
    aquiferDepth - aquiferEffectiveDepth);
  const expectedSeparation = aquiferUpper -
    Number(initialDeepOwner.lowerBoundaryDepthM);
  const effectiveTimescale =
    LAND_DEEP_AQUIFER_MATRIX_BASE_RESPONSE_TIMESCALE_DAYS *
    (1 + Math.max(0, expectedSeparation) /
      LAND_DEEP_AQUIFER_MATRIX_DISTANCE_SCALE_M);
  const geometryValid = receipt.geometry?.mode ===
      'explicit-separated-deep-and-aquifer-matrix-interface' &&
    proposal?.geometry?.mode === receipt.geometry.mode &&
    same(receipt.geometry.deepMatrixLowerBoundaryDepthM,
      initialDeepOwner.lowerBoundaryDepthM) &&
    same(receipt.geometry.aquiferMatrixUpperBoundaryDepthM,
      aquiferUpper) &&
    same(receipt.geometry.separationM, expectedSeparation) &&
    expectedSeparation >= 0 &&
    receipt.geometry.ownerIntervalsOverlap === false &&
    receipt.geometry.deepOwnerGeometryMatchesSubstrate === true &&
    receipt.geometry.aquiferOwnerGeometryMatchesSubstrate === true &&
    same(receipt.geometry.baseResponseTimescaleDays,
      LAND_DEEP_AQUIFER_MATRIX_BASE_RESPONSE_TIMESCALE_DAYS) &&
    same(receipt.geometry.distanceScaleM,
      LAND_DEEP_AQUIFER_MATRIX_DISTANCE_SCALE_M) &&
    same(receipt.geometry.effectiveResponseTimescaleDays,
      effectiveTimescale) &&
    same(initialDeepOwner.separationToAquiferMatrixM,
      expectedSeparation) &&
    same(initialAquiferOwner.effectiveDepthM,
      aquiferEffectiveDepth) &&
    same(finalDeepOwner.upperBoundaryDepthM,
      initialDeepOwner.upperBoundaryDepthM) &&
    same(finalDeepOwner.lowerBoundaryDepthM,
      initialDeepOwner.lowerBoundaryDepthM) &&
    same(finalDeepOwner.heatCapacityJm2K,
      initialDeepOwner.heatCapacityJm2K, 1e-6) &&
    same(finalAquiferOwner.effectiveDepthM,
      initialAquiferOwner.effectiveDepthM) &&
    same(finalAquiferOwner.heatCapacityJm2K,
      initialAquiferOwner.heatCapacityJm2K, 1e-6);

  const duration = Number(proposal?.durationDays);
  const deepCapacity = Number(initialDeepOwner.heatCapacityJm2K);
  const aquiferCapacity = Number(initialAquiferOwner.heatCapacityJm2K);
  const responseFraction = 1 - Math.exp(-duration / effectiveTimescale);
  const jointCapacity = deepCapacity > 0 && aquiferCapacity > 0
    ? deepCapacity * aquiferCapacity /
      (deepCapacity + aquiferCapacity) : 0;
  const requested = jointCapacity *
    (Number(initialDeepOwner.temperatureC) -
      Number(initialAquiferOwner.temperatureC)) * responseFraction;
  const minimum = Math.max(
    deepCapacity * (Number(initialDeepOwner.temperatureC) -
      LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C),
    aquiferCapacity * (LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C -
      Number(initialAquiferOwner.temperatureC)));
  const maximum = Math.min(
    deepCapacity * (Number(initialDeepOwner.temperatureC) -
      LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C),
    aquiferCapacity * (LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C -
      Number(initialAquiferOwner.temperatureC)));
  const expectedHeat = deepCapacity > 0 && aquiferCapacity > 0
    ? clamp(requested, minimum, maximum) : 0;
  const proposalValid = duration > 0 && duration <= 1.000001 &&
    proposal?.response?.mode ===
      'distance-aware-separated-matrix-bulk-response' &&
    same(proposal.response.baseResponseTimescaleDays,
      LAND_DEEP_AQUIFER_MATRIX_BASE_RESPONSE_TIMESCALE_DAYS) &&
    same(proposal.response.distanceScaleM,
      LAND_DEEP_AQUIFER_MATRIX_DISTANCE_SCALE_M) &&
    same(proposal.response.separationM, expectedSeparation) &&
    same(proposal.response.effectiveResponseTimescaleDays,
      effectiveTimescale) &&
    same(proposal.response.responseFraction, responseFraction) &&
    same(proposal.response.deepSubsurfaceMatrixHeatCapacityJm2K,
      deepCapacity, 1e-6) &&
    same(proposal.response.aquiferMatrixHeatCapacityJm2K,
      aquiferCapacity, 1e-6) &&
    same(proposal.response.jointHeatCapacityJm2K,
      jointCapacity, 1e-6) &&
    same(proposal.requestedHeatToAquiferMatrixJm2, requested,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal.minimumHeatToAquiferMatrixJm2, minimum,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal.maximumHeatToAquiferMatrixJm2, maximum,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal.appliedHeatToAquiferMatrixJm2, expectedHeat,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal.thermalEnvelopeLimiterJm2,
      expectedHeat - requested,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(heatToAquiferJm2, expectedHeat,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);

  const downstreamOwnerBindingValid = downstreamVadoseReceipt
    ? downstreamVadoseReceipt.schema ===
        LAND_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
      landVadoseMatrixThermalReceiptValid(downstreamVadoseReceipt) &&
      downstreamVadoseReceipt.sourceDeepAquiferMatrixThermal
        ?.receiptDigest === receipt.digest &&
      downstreamVadoseReceipt.sourceDeepAquiferMatrixThermal?.stepId ===
        receipt.stepId &&
      deepOwnersMatch(downstreamVadoseReceipt.initialPostR83DeepOwner,
        finalDeepOwner) &&
      aquiferOwnersMatch(
        downstreamVadoseReceipt.initialPostR83AquiferOwner,
        finalAquiferOwner) &&
      deepOwnersMatch(
        downstreamVadoseReceipt.finalDeepSubsurfaceMatrixOwner,
        currentDeepOwner) &&
      aquiferOwnersMatch(downstreamVadoseReceipt.finalAquiferMatrixOwner,
        currentAquiferOwner) &&
      downstreamVadoseReceipt.truth
        ?.r83DirectTransferExplicitlyReconciled === true &&
      downstreamVadoseReceipt.truth?.directTransferDoubleCounted === false
    : deepOwnersMatch(finalDeepOwner, currentDeepOwner) &&
      aquiferOwnersMatch(finalAquiferOwner, currentAquiferOwner);
  const ownerBindingsValid =
    deepOwnersMatch(sourceR82?.finalDeepSubsurfaceMatrixOwner,
      initialDeepOwner) &&
    aquiferOwnersMatch(sourceR80?.finalAquiferMatrixOwner,
      initialAquiferOwner) &&
    deepOwnersMatch(proposal?.initialDeepSubsurfaceMatrixOwner,
      initialDeepOwner) &&
    aquiferOwnersMatch(proposal?.initialAquiferMatrixOwner,
      initialAquiferOwner) &&
    downstreamOwnerBindingValid &&
    same(finalDeepOwner.sensibleHeatJm2,
      Number(initialDeepOwner.sensibleHeatJm2) - heatToAquiferJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(finalAquiferOwner.sensibleHeatJm2,
      Number(initialAquiferOwner.sensibleHeatJm2) + heatToAquiferJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(finalDeepOwner.sensibleHeatJm2,
      Number(finalDeepOwner.heatCapacityJm2K) *
        Number(finalDeepOwner.temperatureC),
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(finalAquiferOwner.sensibleHeatJm2,
      Number(finalAquiferOwner.heatCapacityJm2K) *
        Number(finalAquiferOwner.temperatureC),
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    Number(finalDeepOwner.temperatureC) >=
      LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C &&
    Number(finalDeepOwner.temperatureC) <=
      LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C &&
    Number(finalAquiferOwner.temperatureC) >=
      LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C &&
    Number(finalAquiferOwner.temperatureC) <=
      LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C;

  const paired = closureAudit(receipt.pairedTransferClosure, [
    -heatToAquiferJm2, heatToAquiferJm2
  ]);
  const deep = closureAudit(receipt.deepSubsurfaceMatrixOwnerClosure, [
    Number(finalDeepOwner.sensibleHeatJm2),
    -Number(initialDeepOwner.sensibleHeatJm2),
    heatToAquiferJm2
  ]);
  const aquifer = closureAudit(receipt.aquiferMatrixOwnerClosure, [
    Number(finalAquiferOwner.sensibleHeatJm2),
    -Number(initialAquiferOwner.sensibleHeatJm2),
    -heatToAquiferJm2
  ]);
  const combined = closureAudit(receipt.combinedOwnerClosure, [
    Number(finalDeepOwner.sensibleHeatJm2),
    Number(finalAquiferOwner.sensibleHeatJm2),
    -Number(initialDeepOwner.sensibleHeatJm2),
    -Number(initialAquiferOwner.sensibleHeatJm2)
  ]);

  const expectedDirection = heatToAquiferJm2 > 0
    ? 'deep-subsurface-matrix-to-aquifer-matrix'
    : heatToAquiferJm2 < 0
      ? 'aquifer-matrix-to-deep-subsurface-matrix' : 'none';
  const truthValid = receipt.transfer?.direction === expectedDirection &&
    same(receipt.transfer?.signedDeepSubsurfaceMatrixOwnerHeatJm2,
      -heatToAquiferJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(receipt.transfer?.signedAquiferMatrixOwnerHeatJm2,
      heatToAquiferJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    receipt.transfer?.senderOwnerDebited === true &&
    receipt.transfer?.receiverOwnerCredited === true &&
    receipt.truth?.existingDeepAndAquiferMatrixOwnersPaired === true &&
    receipt.truth?.exactR82AndR80SourcesBound === true &&
    receipt.truth?.explicitSeparationGeometryUsed === true &&
    receipt.truth?.ownerIntervalsOverlap === false &&
    receipt.truth?.signedDeepSubsurfaceMatrixOwnerEntryApplied === true &&
    receipt.truth?.signedAquiferMatrixOwnerEntryApplied === true &&
    receipt.truth?.deepSubsurfaceMatrixGeometryUnchangedByThisOrgan === true &&
    receipt.truth?.aquiferMatrixGeometryUnchangedByThisOrgan === true &&
    receipt.truth?.distanceAwareBulkResponseParameterized === true &&
    receipt.truth?.externalHeatSourceAdded === false &&
    receipt.truth?.resolvedInterMatrixConduction === false &&
    receipt.truth?.resolvedSubsurfaceConduction === false &&
    receipt.truth?.resolvedAquiferConduction === false &&
    receipt.truth?.geothermalForcingModeledByThisOrgan === false &&
    receipt.truth?.phaseChangeModeledByThisOrgan === false &&
    receipt.truth?.scientificCalibrationClaimed === false &&
    receipt.truth?.globalUnloadedBoundaryClaimed === false &&
    proposal.truth?.resolvedInterMatrixConduction === false &&
    proposal.truth?.geothermalForcingModeledByThisProposal === false &&
    proposal.truth?.scientificCalibrationClaimed === false &&
    column?.truth?.pairedDeepAquiferMatrixSensibleHeatExchange === true &&
    column?.truth?.deepAquiferMatrixSeparationGeometryBound === true &&
    column?.truth?.resolvedSubsurfaceConduction === false &&
    column?.truth?.resolvedAquiferConduction === false &&
    column?.truth?.geothermalForcingModeled === false;

  const valid = sourceLineageValid && geometryValid && proposalValid &&
    ownerBindingsValid && paired.valid && deep.valid && aquifer.valid &&
    combined.valid && truthValid;
  return result(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt?.schema || null,
    sourceLineageValid,
    geometryValid,
    proposalRecomputationValid: proposalValid,
    ownerBindingsValid,
    downstreamVadoseMatrixOwnerBindingValid:
      downstreamOwnerBindingValid,
    pairedTransferClosure: paired,
    deepSubsurfaceMatrixOwnerClosure: deep,
    aquiferMatrixOwnerClosure: aquifer,
    combinedOwnerClosure: combined,
    truthValid,
    truthChecks: {
      existingOwnersPaired:
        receipt.truth?.existingDeepAndAquiferMatrixOwnersPaired === true,
      sourcesBound: receipt.truth?.exactR82AndR80SourcesBound === true,
      separationBound:
        receipt.truth?.explicitSeparationGeometryUsed === true,
      distanceAware:
        receipt.truth?.distanceAwareBulkResponseParameterized === true,
      noExternalHeat: receipt.truth?.externalHeatSourceAdded === false,
      noResolvedInterMatrixConduction:
        receipt.truth?.resolvedInterMatrixConduction === false,
      noResolvedSubsurfaceConduction:
        receipt.truth?.resolvedSubsurfaceConduction === false,
      noResolvedAquiferConduction:
        receipt.truth?.resolvedAquiferConduction === false,
      noGeothermal:
        receipt.truth?.geothermalForcingModeledByThisOrgan === false,
      noCalibration: receipt.truth?.scientificCalibrationClaimed === false,
      columnPair:
        column?.truth?.pairedDeepAquiferMatrixSensibleHeatExchange === true,
      columnSeparation:
        column?.truth?.deepAquiferMatrixSeparationGeometryBound === true,
      columnNoSubsurfaceConduction:
        column?.truth?.resolvedSubsurfaceConduction === false,
      columnNoAquiferConduction:
        column?.truth?.resolvedAquiferConduction === false,
      columnNoGeothermal:
        column?.truth?.geothermalForcingModeled === false
    },
    separationM: Number(expectedSeparation),
    effectiveResponseTimescaleDays: Number(effectiveTimescale)
  });
}
