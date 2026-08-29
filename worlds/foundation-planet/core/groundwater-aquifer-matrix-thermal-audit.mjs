import {
  LAND_HYDROLOGY_GROUNDWATER_TRANSPORT_RECEIPT_SCHEMA,
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
  LAND_AQUIFER_MATRIX_THERMAL_STATE_SCHEMA,
  LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_PROPOSAL_SCHEMA,
  LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA,
  LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_CLOSURE_SCHEMA,
  LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA,
  LAND_GROUNDWATER_AQUIFER_MATRIX_RESPONSE_TIMESCALE_DAYS,
  LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C,
  LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C,
  aquiferMatrixThermalParameters
} from './groundwater-aquifer-matrix-thermal.mjs?v=0.81.0-r81.1';
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

function groundwaterOwnersMatch(left = {}, right = {}) {
  return same(left.trackedWaterMm, right.trackedWaterMm,
      LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(left.sensibleHeatJm2, right.sensibleHeatJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(left.waterTemperatureC, right.waterTemperatureC);
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

function result(status, detail) {
  return {
    id: 'land-groundwater-aquifer-matrix-thermal-owner-lineage',
    status,
    required: status !== 'NOT_APPLICABLE',
    statement: 'The persistent groundwater-water and parameterized aquifer-matrix sensible-heat owners exchange one signed, paired amount without moving groundwater water or changing matrix geometry.',
    detail
  };
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
      LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_CLOSURE_SCHEMA &&
    closure?.policy?.schema ===
      LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA &&
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

export function auditLandGroundwaterAquiferMatrixThermal(column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', { kind: column?.kind || null });
  }
  const state = column?.land?.aquiferMatrixThermal;
  const receipt = state?.lastStepReceipt;
  if (!receipt) {
    const migrationCheckpoint = state?.migrationCheckpoint === true;
    const unstepped = Number(column?.stepCount || 0) === 0;
    return result(migrationCheckpoint || unstepped
      ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: migrationCheckpoint
        ? 'v41-to-v42 migration initializes the matrix from current groundwater temperature without inventing historical exchange evidence'
        : unstepped
          ? 'the land column has not advanced yet'
          : 'a stepped current land column is missing its groundwater-aquifer-matrix thermal receipt',
      migrationCheckpoint,
      unstepped
    });
  }

  const proposal = receipt.sourceProposal?.proposal;
  const sourceR79 = column?.land?.lastDeepGroundwaterWaterThermalReceipt;
  const groundwaterTransport = column?.land?.hydrologyThermal
    ?.lastGroundwaterTransportReceipt;
  const currentGroundwaterOwner = column?.land?.hydrologyThermal
    ?.reservoirs?.groundwater || {};
  const currentMatrixOwner = state?.owner || {};
  const initialGroundwaterOwner = receipt.initialGroundwaterOwner || {};
  const finalGroundwaterOwner = receipt.finalGroundwaterOwner || {};
  const initialMatrixOwner = receipt.initialAquiferMatrixOwner || {};
  const finalMatrixOwner = receipt.finalAquiferMatrixOwner || {};
  const heatToGroundwaterJm2 = Number(
    receipt.transfer?.signedHeatToGroundwaterJm2);

  const sourceLineageValid =
    state?.schema === LAND_AQUIFER_MATRIX_THERMAL_STATE_SCHEMA &&
    receipt.schema ===
      LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    receiptDigestValid(receipt) &&
    column?.budget?.groundwaterAquiferMatrixThermal?.digest ===
      receipt.digest &&
    proposal?.schema ===
      LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_PROPOSAL_SCHEMA &&
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

  const expectedParameters = aquiferMatrixThermalParameters(
    column?.substrate);
  const groundwaterCapacity =
    Number(proposal?.initialGroundwaterOwner?.trackedWaterMm) *
      LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K;
  const matrixCapacity = Number(
    proposal?.initialAquiferMatrixOwner?.heatCapacityJm2K);
  const responseFraction = 1 - Math.exp(
    -Number(proposal?.durationDays) /
      LAND_GROUNDWATER_AQUIFER_MATRIX_RESPONSE_TIMESCALE_DAYS);
  const jointCapacity = groundwaterCapacity > 0 && matrixCapacity > 0
    ? groundwaterCapacity * matrixCapacity /
      (groundwaterCapacity + matrixCapacity) : 0;
  const requested = jointCapacity *
    (Number(proposal?.initialAquiferMatrixOwner?.temperatureC) -
      Number(proposal?.initialGroundwaterOwner?.waterTemperatureC)) *
      responseFraction;
  const minimum = Math.max(
    groundwaterCapacity *
      (LAND_DEEP_GROUNDWATER_WATER_MINIMUM_TEMPERATURE_C -
      Number(proposal?.initialGroundwaterOwner?.waterTemperatureC)),
    matrixCapacity *
      (Number(proposal?.initialAquiferMatrixOwner?.temperatureC) -
        LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C));
  const maximum = Math.min(
    groundwaterCapacity *
      (LAND_DEEP_GROUNDWATER_WATER_MAXIMUM_TEMPERATURE_C -
      Number(proposal?.initialGroundwaterOwner?.waterTemperatureC)),
    matrixCapacity *
      (Number(proposal?.initialAquiferMatrixOwner?.temperatureC) -
        LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C));
  const expectedHeat = groundwaterCapacity > 0 && matrixCapacity > 0
    ? clamp(requested, minimum, maximum) : 0;
  const parameterizationValid =
    same(initialMatrixOwner.effectiveDepthM,
      expectedParameters.effectiveDepthM) &&
    same(initialMatrixOwner.solidFraction,
      expectedParameters.solidFraction) &&
    same(initialMatrixOwner.volumetricHeatCapacityJm3K,
      expectedParameters.volumetricHeatCapacityJm3K) &&
    same(initialMatrixOwner.heatCapacityJm2K,
      expectedParameters.heatCapacityJm2K, 1e-6) &&
    initialMatrixOwner.materialClass ===
      'parameterized-aquifer-mineral-matrix';
  const proposalRecomputationValid =
    Number(proposal?.durationDays) > 0 &&
    Number(proposal?.durationDays) <= 1.000001 &&
    groundwaterOwnersMatch(proposal?.initialGroundwaterOwner,
      initialGroundwaterOwner) &&
    matrixOwnersMatch(proposal?.initialAquiferMatrixOwner,
      initialMatrixOwner) &&
    parameterizationValid &&
    same(proposal?.response?.responseTimescaleDays,
      LAND_GROUNDWATER_AQUIFER_MATRIX_RESPONSE_TIMESCALE_DAYS) &&
    same(proposal?.response?.responseFraction, responseFraction) &&
    same(proposal?.response?.groundwaterWaterHeatCapacityJm2K,
      groundwaterCapacity, 1e-6) &&
    same(proposal?.response?.aquiferMatrixHeatCapacityJm2K,
      matrixCapacity, 1e-6) &&
    same(proposal?.response?.jointHeatCapacityJm2K,
      jointCapacity, 1e-6) &&
    same(proposal?.requestedHeatToGroundwaterJm2, requested,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.minimumHeatToGroundwaterJm2, minimum,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.maximumHeatToGroundwaterJm2, maximum,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.appliedHeatToGroundwaterJm2, expectedHeat,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.thermalEnvelopeLimiterJm2,
      expectedHeat - requested,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(heatToGroundwaterJm2, expectedHeat,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);

  const transportInitial = groundwaterTransport?.initialOwners
    ?.[column?.id];
  const transportFinal = groundwaterTransport?.finalOwners?.[column?.id];
  const transportFollowsR80 = Boolean(transportInitial) &&
    groundwaterOwnersMatch(transportInitial, finalGroundwaterOwner);
  const downstreamBindingValid = transportFollowsR80
    ? groundwaterTransport?.schema ===
        LAND_HYDROLOGY_GROUNDWATER_TRANSPORT_RECEIPT_SCHEMA &&
      receiptDigestValid(groundwaterTransport) &&
      groundwaterOwnersMatch(transportFinal, currentGroundwaterOwner)
    : groundwaterOwnersMatch(finalGroundwaterOwner,
      currentGroundwaterOwner);
  const downstreamDeepAquiferReceipt = column?.land
    ?.lastDeepAquiferMatrixThermalReceipt;
  const downstreamVadoseReceipt = column?.land
    ?.lastVadoseMatrixThermalReceipt;
  const downstreamVadoseAquiferBindingValid = downstreamVadoseReceipt
    ? downstreamVadoseReceipt.schema ===
        LAND_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
      landVadoseMatrixThermalReceiptValid(downstreamVadoseReceipt) &&
      downstreamVadoseReceipt.sourceDeepAquiferMatrixThermal
        ?.receiptDigest === downstreamDeepAquiferReceipt?.digest &&
      matrixOwnersMatch(
        downstreamVadoseReceipt.initialPostR83AquiferOwner,
        downstreamDeepAquiferReceipt?.finalAquiferMatrixOwner) &&
      matrixOwnersMatch(downstreamVadoseReceipt.finalAquiferMatrixOwner,
        currentMatrixOwner) &&
      downstreamVadoseReceipt.truth
        ?.r83DirectTransferExplicitlyReconciled === true &&
      downstreamVadoseReceipt.truth?.directTransferDoubleCounted === false
    : matrixOwnersMatch(
      downstreamDeepAquiferReceipt?.finalAquiferMatrixOwner,
      currentMatrixOwner);
  const downstreamNativeVadoseAquiferBindingValid =
    downstreamVadoseReceipt?.schema ===
      LAND_NATIVE_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    landNativeVadoseMatrixThermalReceiptValid(downstreamVadoseReceipt) &&
    downstreamVadoseReceipt.sourceGroundwaterAquiferMatrixThermal
      ?.receiptDigest === receipt.digest &&
    downstreamVadoseReceipt.sourceGroundwaterAquiferMatrixThermal
      ?.stepId === receipt.stepId &&
    matrixOwnersMatch(downstreamVadoseReceipt.initialAquiferMatrixOwner,
      finalMatrixOwner) &&
    matrixOwnersMatch(downstreamVadoseReceipt.finalAquiferMatrixOwner,
      currentMatrixOwner) &&
    downstreamVadoseReceipt.truth?.directDeepAquiferTransferApplied ===
      false &&
    downstreamVadoseReceipt.truth?.directTransferReversalApplied === false;
  const downstreamAquiferMatrixBindingValid =
    downstreamNativeVadoseAquiferBindingValid ||
    (downstreamDeepAquiferReceipt
      ? downstreamDeepAquiferReceipt.schema ===
        LAND_DEEP_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA &&
      landDeepAquiferMatrixThermalReceiptValid(
        downstreamDeepAquiferReceipt) &&
      downstreamDeepAquiferReceipt
        .sourceGroundwaterAquiferMatrixThermal?.receiptDigest ===
          receipt.digest &&
      downstreamDeepAquiferReceipt
        .sourceGroundwaterAquiferMatrixThermal?.stepId === receipt.stepId &&
      matrixOwnersMatch(downstreamDeepAquiferReceipt
        .initialAquiferMatrixOwner, finalMatrixOwner) &&
      downstreamVadoseAquiferBindingValid
      : !downstreamVadoseReceipt &&
        matrixOwnersMatch(finalMatrixOwner, currentMatrixOwner));
  const ownerBindingsValid =
    groundwaterOwnersMatch(sourceR79?.finalGroundwaterOwner,
      initialGroundwaterOwner) &&
    downstreamAquiferMatrixBindingValid &&
    downstreamBindingValid &&
    same(finalGroundwaterOwner.trackedWaterMm,
      initialGroundwaterOwner.trackedWaterMm,
      LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(finalGroundwaterOwner.sensibleHeatJm2,
      Number(initialGroundwaterOwner.sensibleHeatJm2) +
        heatToGroundwaterJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(finalMatrixOwner.sensibleHeatJm2,
      Number(initialMatrixOwner.sensibleHeatJm2) -
        heatToGroundwaterJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(finalMatrixOwner.heatCapacityJm2K,
      initialMatrixOwner.heatCapacityJm2K, 1e-6) &&
    Number(finalGroundwaterOwner.waterTemperatureC) >=
      LAND_DEEP_GROUNDWATER_WATER_MINIMUM_TEMPERATURE_C &&
    Number(finalGroundwaterOwner.waterTemperatureC) <=
      LAND_DEEP_GROUNDWATER_WATER_MAXIMUM_TEMPERATURE_C &&
    Number(finalMatrixOwner.temperatureC) >=
      LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C &&
    Number(finalMatrixOwner.temperatureC) <=
      LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C;

  const paired = closureAudit(receipt.pairedTransferClosure,
    [heatToGroundwaterJm2, -heatToGroundwaterJm2]);
  const groundwater = closureAudit(receipt.groundwaterOwnerClosure, [
    Number(finalGroundwaterOwner.sensibleHeatJm2),
    -Number(initialGroundwaterOwner.sensibleHeatJm2),
    -heatToGroundwaterJm2
  ]);
  const matrix = closureAudit(receipt.aquiferMatrixOwnerClosure, [
    Number(finalMatrixOwner.sensibleHeatJm2),
    -Number(initialMatrixOwner.sensibleHeatJm2),
    heatToGroundwaterJm2
  ]);
  const combined = closureAudit(receipt.combinedOwnerClosure, [
    Number(finalGroundwaterOwner.sensibleHeatJm2),
    Number(finalMatrixOwner.sensibleHeatJm2),
    -Number(initialGroundwaterOwner.sensibleHeatJm2),
    -Number(initialMatrixOwner.sensibleHeatJm2)
  ]);

  const expectedDirection = heatToGroundwaterJm2 > 0
    ? 'aquifer-matrix-to-groundwater-water'
    : heatToGroundwaterJm2 < 0
      ? 'groundwater-water-to-aquifer-matrix' : 'none';
  const truthValid = receipt.transfer?.direction === expectedDirection &&
    same(receipt.transfer?.signedGroundwaterOwnerHeatJm2,
      heatToGroundwaterJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(receipt.transfer?.signedAquiferMatrixOwnerHeatJm2,
      -heatToGroundwaterJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    receipt.truth?.existingGroundwaterWaterAndAquiferMatrixOwnersPaired ===
      true &&
    receipt.truth?.groundwaterWaterUnchangedByThisOrgan === true &&
    receipt.truth?.aquiferMatrixGeometryUnchangedByThisOrgan === true &&
    receipt.truth?.bulkResponseParameterized === true &&
    receipt.truth?.aquiferMatrixThermalExchangeModeled === true &&
    receipt.truth?.distinctFromLandSurfaceSensibleHeatOwner === true &&
    receipt.truth?.resolvedAquiferConduction === false &&
    receipt.truth?.geothermalForcingModeledByThisOrgan === false &&
    receipt.truth?.scientificCalibrationClaimed === false &&
    state?.truth?.persistentAquiferMatrixSensibleHeatOwner === true &&
    state?.truth?.distinctFromLandSurfaceSensibleHeatOwner === true &&
    column?.truth?.persistentAquiferMatrixThermalOwner === true &&
    column?.truth?.pairedGroundwaterAquiferMatrixSensibleHeatExchange ===
      true &&
    column?.truth?.bulkGroundwaterAquiferMatrixThermalResponse === true &&
    column?.truth?.aquiferMatrixThermalExchangeModeled === true &&
    column?.truth?.resolvedAquiferConduction === false &&
    column?.truth?.geothermalForcingModeled === false;

  const valid = sourceLineageValid && proposalRecomputationValid &&
    ownerBindingsValid && paired.valid && groundwater.valid &&
    matrix.valid && combined.valid && truthValid;
  return result(valid ? 'PASS' : 'FAIL', {
    expectedReceiptSchema:
      LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA,
    actualReceiptSchema: receipt?.schema || null,
    sourceLineageValid,
    parameterizationValid,
    proposalRecomputationValid,
    ownerBindingsValid,
    transportFollowsR80,
    downstreamBindingValid,
    downstreamDeepAquiferMatrixOwnerBindingValid:
      downstreamAquiferMatrixBindingValid,
    pairedTransferClosure: paired,
    groundwaterOwnerClosure: groundwater,
    aquiferMatrixOwnerClosure: matrix,
    combinedOwnerClosure: combined,
    truthValid,
    signedHeatToGroundwaterJm2: heatToGroundwaterJm2,
    initialGroundwaterTemperatureC:
      initialGroundwaterOwner.waterTemperatureC ?? null,
    finalGroundwaterTemperatureC:
      finalGroundwaterOwner.waterTemperatureC ?? null,
    initialAquiferMatrixTemperatureC:
      initialMatrixOwner.temperatureC ?? null,
    finalAquiferMatrixTemperatureC:
      finalMatrixOwner.temperatureC ?? null
  });
}
