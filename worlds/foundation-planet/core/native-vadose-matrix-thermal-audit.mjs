import {
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
} from './land-hydrology-thermal.mjs?v=0.85.0-r85.1';
import {
  LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA,
  LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C,
  LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C,
  landGroundwaterAquiferMatrixThermalReceiptValid
} from './groundwater-aquifer-matrix-thermal.mjs?v=0.85.0-r85.1';
import {
  LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C,
  LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C
} from './deep-soil-subsurface-matrix-thermal.mjs?v=0.85.0-r85.1';
import {
  LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
  landSurfaceSubsurfaceMatrixThermalReceiptValid
} from './surface-subsurface-matrix-thermal.mjs?v=0.85.0-r85.1';
import {
  landDeepAquiferMatrixThermalReceiptValid
} from './deep-aquifer-matrix-thermal.mjs?v=0.85.0-r85.1';
import {
  LAND_VADOSE_MATRIX_THERMAL_STATE_SCHEMA,
  LAND_NATIVE_VADOSE_MATRIX_THERMAL_PROPOSAL_SCHEMA,
  LAND_NATIVE_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA,
  LAND_VADOSE_MATRIX_THERMAL_CLOSURE_SCHEMA,
  LAND_VADOSE_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA,
  LAND_VADOSE_MATRIX_MINIMUM_TEMPERATURE_C,
  LAND_VADOSE_MATRIX_MAXIMUM_TEMPERATURE_C,
  landVadoseMatrixThermalReceiptValid,
  landNativeVadoseMatrixThermalProposalValid,
  landNativeVadoseMatrixThermalReceiptValid,
  vadoseMatrixThermalParameters
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

function digestValid(value) {
  if (!value || typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
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

function pairResponse(firstOwner, secondOwner, timescaleDays, durationDays) {
  const firstCapacity = Number(firstOwner.heatCapacityJm2K);
  const secondCapacity = Number(secondOwner.heatCapacityJm2K);
  const jointCapacity = firstCapacity * secondCapacity /
    (firstCapacity + secondCapacity);
  const responseFraction = 1 - Math.exp(-durationDays / timescaleDays);
  return {
    firstHeatCapacityJm2K: firstCapacity,
    secondHeatCapacityJm2K: secondCapacity,
    jointHeatCapacityJm2K: jointCapacity,
    effectiveResponseTimescaleDays: Number(timescaleDays),
    responseFraction,
    requestedHeatToSecondJm2: jointCapacity *
      (Number(firstOwner.temperatureC) - Number(secondOwner.temperatureC)) *
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

function closureValid(stored, expectedOperands) {
  const operands = expectedOperands.map(Number);
  const residual = operands.reduce((sum, value) => sum + value, 0);
  const scale = operands.reduce((sum, value) => sum + Math.abs(value), 0);
  const numericTolerance = round(Math.max(
    LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    scale * Number.EPSILON * LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
  ));
  const valid = stored?.schema ===
      LAND_VADOSE_MATRIX_THERMAL_CLOSURE_SCHEMA &&
    stored?.policy?.schema ===
      LAND_VADOSE_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA &&
    stored.policy.kind === 'energy' &&
    stored.policy.absoluteFloor ===
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J &&
    stored.policy.ulpFactor ===
      LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR &&
    JSON.stringify(stored.signedOperands) === JSON.stringify(operands) &&
    same(stored.residual, residual,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(stored.numericTolerance, numericTolerance) &&
    stored.measuredResidualPreserved === true &&
    stored.closed === (Math.abs(residual) <= numericTolerance) &&
    stored.closed === true;
  return { valid, residual, numericTolerance };
}

function result(status, detail) {
  return {
    id: 'land-native-vadose-matrix-thermal-owner-lineage',
    required: true,
    status,
    statement: 'The current deep and aquifer matrix owners exchange heat only through the persistent intervening vadose owner; no direct deep-aquifer transfer or compensating reversal is applied.',
    detail
  };
}

export function auditLandNativeVadoseMatrixThermal(column) {
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
        ? 'v46-to-v47 migration preserves current owner state without inventing historical R85 evidence'
        : column?.stepCount === 0
          ? 'land column has not stepped yet'
          : 'a stepped current land column is missing native vadose evidence'
    });
  }
  const proposal = receipt.sourceProposal?.proposal;
  const sourceR82 = column?.land?.lastSurfaceSubsurfaceMatrixThermalReceipt;
  const sourceR80 = column?.land?.aquiferMatrixThermal?.lastStepReceipt;
  const initialDeep = receipt.initialDeepSubsurfaceMatrixOwner || {};
  const initialVadose = receipt.initialVadoseMatrixOwner || {};
  const initialAquifer = receipt.initialAquiferMatrixOwner || {};
  const finalDeep = receipt.finalDeepSubsurfaceMatrixOwner || {};
  const finalVadose = receipt.finalVadoseMatrixOwner || {};
  const finalAquifer = receipt.finalAquiferMatrixOwner || {};
  const geometry = vadoseMatrixThermalParameters(column.substrate);
  const storedGeometry = receipt.geometry || {};

  const sourceLineageValid =
    receipt.schema === LAND_NATIVE_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    landNativeVadoseMatrixThermalReceiptValid(receipt) &&
    proposal?.schema ===
      LAND_NATIVE_VADOSE_MATRIX_THERMAL_PROPOSAL_SCHEMA &&
    landNativeVadoseMatrixThermalProposalValid(proposal) &&
    receipt.sourceProposal?.receiptDigest === proposal.digest &&
    receipt.sourceProposal?.stepId === proposal.stepId &&
    sourceR82?.schema ===
      LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    landSurfaceSubsurfaceMatrixThermalReceiptValid(sourceR82) &&
    sourceR80?.schema ===
      LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    landGroundwaterAquiferMatrixThermalReceiptValid(sourceR80) &&
    receipt.sourceSurfaceSubsurfaceMatrixThermal?.receiptDigest ===
      sourceR82.digest &&
    receipt.sourceSurfaceSubsurfaceMatrixThermal?.stepId === sourceR82.stepId &&
    receipt.sourceGroundwaterAquiferMatrixThermal?.receiptDigest ===
      sourceR80.digest &&
    receipt.sourceGroundwaterAquiferMatrixThermal?.stepId === sourceR80.stepId &&
    column?.land?.lastDeepAquiferMatrixThermalReceipt == null &&
    column?.budget?.deepAquiferMatrixThermal == null;

  const geometryValid = geometry.effectiveDepthM > 0 &&
    geometry.deepInterfaceCoincident === true &&
    geometry.aquiferInterfaceCoincident === true &&
    geometry.ownerIntervalsOverlap === false &&
    Object.keys(geometry).every(key =>
      typeof geometry[key] === 'number'
        ? same(storedGeometry[key], geometry[key], 1e-9)
        : storedGeometry[key] === geometry[key]) &&
    same(initialVadose.upperBoundaryDepthM,
      geometry.upperBoundaryDepthM) &&
    same(initialVadose.lowerBoundaryDepthM,
      geometry.lowerBoundaryDepthM) &&
    same(initialVadose.heatCapacityJm2K,
      geometry.heatCapacityJm2K, 1e-6);

  const duration = Number(proposal?.durationDays);
  const expectedDeepResponse = pairResponse(initialDeep, initialVadose,
    geometry.deepInterfaceResponseTimescaleDays, duration);
  const expectedAquiferResponse = pairResponse(initialVadose, initialAquifer,
    geometry.aquiferInterfaceResponseTimescaleDays, duration);
  const requestedDeepVadose = expectedDeepResponse.requestedHeatToSecondJm2;
  const requestedVadoseAquifer =
    expectedAquiferResponse.requestedHeatToSecondJm2;
  const expectedLimiter = Math.min(
    envelopeScale(Number(initialDeep.sensibleHeatJm2),
      -requestedDeepVadose, Number(initialDeep.heatCapacityJm2K),
      LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C,
      LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C),
    envelopeScale(Number(initialVadose.sensibleHeatJm2),
      requestedDeepVadose - requestedVadoseAquifer,
      Number(initialVadose.heatCapacityJm2K),
      LAND_VADOSE_MATRIX_MINIMUM_TEMPERATURE_C,
      LAND_VADOSE_MATRIX_MAXIMUM_TEMPERATURE_C),
    envelopeScale(Number(initialAquifer.sensibleHeatJm2),
      requestedVadoseAquifer, Number(initialAquifer.heatCapacityJm2K),
      LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C,
      LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C)
  );
  const deepVadose = Number(
    receipt.transfers?.deepVadose?.signedHeatToVadoseMatrixJm2);
  const vadoseAquifer = Number(
    receipt.transfers?.vadoseAquifer?.signedHeatToAquiferMatrixJm2);
  const responseValid = [
    ['firstHeatCapacityJm2K', expectedDeepResponse,
      proposal?.deepVadoseResponse],
    ['secondHeatCapacityJm2K', expectedDeepResponse,
      proposal?.deepVadoseResponse],
    ['jointHeatCapacityJm2K', expectedDeepResponse,
      proposal?.deepVadoseResponse],
    ['effectiveResponseTimescaleDays', expectedDeepResponse,
      proposal?.deepVadoseResponse],
    ['responseFraction', expectedDeepResponse,
      proposal?.deepVadoseResponse],
    ['requestedHeatToSecondJm2', expectedDeepResponse,
      proposal?.deepVadoseResponse],
    ['firstHeatCapacityJm2K', expectedAquiferResponse,
      proposal?.vadoseAquiferResponse],
    ['secondHeatCapacityJm2K', expectedAquiferResponse,
      proposal?.vadoseAquiferResponse],
    ['jointHeatCapacityJm2K', expectedAquiferResponse,
      proposal?.vadoseAquiferResponse],
    ['effectiveResponseTimescaleDays', expectedAquiferResponse,
      proposal?.vadoseAquiferResponse],
    ['responseFraction', expectedAquiferResponse,
      proposal?.vadoseAquiferResponse],
    ['requestedHeatToSecondJm2', expectedAquiferResponse,
      proposal?.vadoseAquiferResponse]
  ].every(([key, expected, stored]) => same(stored?.[key], expected[key],
    key === 'requestedHeatToSecondJm2'
      ? LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J
      : key.includes('Capacity') ? 1e-6 : 1e-12)) &&
    same(proposal?.requestedHeatToVadoseFromDeepJm2,
      requestedDeepVadose,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.requestedHeatToAquiferFromVadoseJm2,
      requestedVadoseAquifer,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.envelopeLimiterFraction, expectedLimiter) &&
    same(proposal?.appliedHeatToVadoseFromDeepJm2,
      requestedDeepVadose * expectedLimiter,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.appliedHeatToAquiferFromVadoseJm2,
      requestedVadoseAquifer * expectedLimiter,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(deepVadose, proposal?.appliedHeatToVadoseFromDeepJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(vadoseAquifer, proposal?.appliedHeatToAquiferFromVadoseJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);

  const ownerBindingsValid =
    deepOwnersMatch(sourceR82?.finalDeepSubsurfaceMatrixOwner, initialDeep) &&
    aquiferOwnersMatch(sourceR80?.finalAquiferMatrixOwner, initialAquifer) &&
    vadoseOwnersMatch(proposal?.initialVadoseMatrixOwner, initialVadose) &&
    deepOwnersMatch(proposal?.initialDeepSubsurfaceMatrixOwner, initialDeep) &&
    aquiferOwnersMatch(proposal?.initialAquiferMatrixOwner, initialAquifer) &&
    deepOwnersMatch(column?.land?.deepSubsurfaceMatrixThermal?.owner,
      finalDeep) &&
    vadoseOwnersMatch(column?.land?.vadoseMatrixThermal?.owner, finalVadose) &&
    aquiferOwnersMatch(column?.land?.aquiferMatrixThermal?.owner, finalAquifer) &&
    same(finalDeep.sensibleHeatJm2,
      Number(initialDeep.sensibleHeatJm2) - deepVadose,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(finalVadose.sensibleHeatJm2,
      Number(initialVadose.sensibleHeatJm2) + deepVadose - vadoseAquifer,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(finalAquifer.sensibleHeatJm2,
      Number(initialAquifer.sensibleHeatJm2) + vadoseAquifer,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);

  const transferEntriesValid =
    same(receipt.transfers?.deepVadose?.signedDeepOwnerHeatJm2,
      -deepVadose,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(receipt.transfers?.deepVadose?.signedVadoseOwnerHeatJm2,
      deepVadose,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(receipt.transfers?.vadoseAquifer?.signedVadoseOwnerHeatJm2,
      -vadoseAquifer,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(receipt.transfers?.vadoseAquifer?.signedAquiferOwnerHeatJm2,
      vadoseAquifer,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(receipt.transfers?.signedDeepOwnerHeatJm2, -deepVadose,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(receipt.transfers?.signedVadoseOwnerHeatJm2,
      deepVadose - vadoseAquifer,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(receipt.transfers?.signedAquiferOwnerHeatJm2, vadoseAquifer,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);

  const closures = {
    deepVadose: closureValid(receipt.deepVadoseTransferClosure,
      [-deepVadose, deepVadose]),
    vadoseAquifer: closureValid(receipt.vadoseAquiferTransferClosure,
      [-vadoseAquifer, vadoseAquifer]),
    deep: closureValid(receipt.deepOwnerClosure,
      [finalDeep.sensibleHeatJm2, -initialDeep.sensibleHeatJm2,
        deepVadose]),
    vadose: closureValid(receipt.vadoseOwnerClosure,
      [finalVadose.sensibleHeatJm2, -initialVadose.sensibleHeatJm2,
        -deepVadose + vadoseAquifer]),
    aquifer: closureValid(receipt.aquiferOwnerClosure,
      [finalAquifer.sensibleHeatJm2, -initialAquifer.sensibleHeatJm2,
        -vadoseAquifer]),
    combined: closureValid(receipt.combinedOwnerClosure,
      [finalDeep.sensibleHeatJm2, finalVadose.sensibleHeatJm2,
        finalAquifer.sensibleHeatJm2, -initialDeep.sensibleHeatJm2,
        -initialVadose.sensibleHeatJm2,
        -initialAquifer.sensibleHeatJm2])
  };
  const closuresValid = Object.values(closures).every(item => item.valid);

  const compatibility = column?.land?.matrixThermalCompatibility;
  const compatibilityValid = !compatibility ||
    (compatibility.schema ===
        'axm.foundation-planet.matrix-thermal-compatibility/v1' &&
      compatibility.historicalHeatReconstructed === false &&
      (!compatibility.legacyR83Receipt ||
        (digestValid(compatibility.legacyR83Receipt) &&
          landDeepAquiferMatrixThermalReceiptValid(
            compatibility.legacyR83Receipt))) &&
      (!compatibility.legacyR84Receipt ||
        (digestValid(compatibility.legacyR84Receipt) &&
          landVadoseMatrixThermalReceiptValid(
            compatibility.legacyR84Receipt))));

  const truthValid =
    state?.schema === LAND_VADOSE_MATRIX_THERMAL_STATE_SCHEMA &&
    state.lastStepReceipt?.digest === receipt.digest &&
    column?.budget?.vadoseMatrixThermal?.digest === receipt.digest &&
    receipt.truth?.persistentVadoseMatrixSensibleHeatOwner === true &&
    receipt.truth?.currentR82AndR80SourcesBound === true &&
    receipt.truth?.directDeepAquiferTransferApplied === false &&
    receipt.truth?.directTransferReversalApplied === false &&
    receipt.truth?.signedThreeOwnerEntriesApplied === true &&
    receipt.truth?.externalHeatSourceAdded === false &&
    receipt.truth?.resolvedInterMatrixConduction === false &&
    receipt.truth?.geothermalForcingModeledByThisOrgan === false &&
    receipt.truth?.scientificCalibrationClaimed === false &&
    proposal?.truth?.directDeepAquiferTransferApplied === false &&
    proposal?.truth?.directTransferReversalApplied === false &&
    column?.truth?.persistentVadoseMatrixSensibleHeatOwner === true &&
    column?.truth?.vadoseMatrixMediatedSensibleHeatExchange === true &&
    column?.truth?.directDeepAquiferMatrixThermalRuntimeApplied === false &&
    column?.truth?.directDeepAquiferMatrixThermalRuntimeRetired === true &&
    column?.truth?.resolvedSubsurfaceConduction === false &&
    column?.truth?.resolvedAquiferConduction === false &&
    column?.truth?.geothermalForcingModeled === false;

  const valid = sourceLineageValid && geometryValid && responseValid &&
    ownerBindingsValid && transferEntriesValid && closuresValid &&
    compatibilityValid && truthValid;
  return result(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt?.schema || null,
    sourceLineageValid,
    geometryValid,
    responseRecomputationValid: responseValid,
    ownerBindingsValid,
    transferEntriesValid,
    closures,
    compatibilityValid,
    legacyR83ReceiptPreserved: Boolean(compatibility?.legacyR83Receipt),
    legacyR84ReceiptPreserved: Boolean(compatibility?.legacyR84Receipt),
    directDeepAquiferTransferApplied: false,
    directTransferReversalApplied: false,
    truthValid
  });
}
