import {
  LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA,
  LAND_HYDROLOGY_GROUNDWATER_TRANSPORT_RECEIPT_SCHEMA,
  LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K,
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR,
  LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM
} from './land-hydrology-thermal.mjs?v=0.81.0-r81.1';
import {
  LAND_ROOT_DEEP_WATER_THERMAL_RECEIPT_SCHEMA
} from './root-deep-water-thermal.mjs?v=0.81.0-r81.1';
import {
  LAND_DEEP_GROUNDWATER_WATER_THERMAL_PROPOSAL_SCHEMA,
  LAND_DEEP_GROUNDWATER_WATER_THERMAL_RECEIPT_SCHEMA,
  LAND_DEEP_GROUNDWATER_WATER_THERMAL_CLOSURE_SCHEMA,
  LAND_DEEP_GROUNDWATER_WATER_THERMAL_CLOSURE_POLICY_SCHEMA,
  LAND_DEEP_GROUNDWATER_WATER_THERMAL_RESPONSE_TIMESCALE_DAYS,
  LAND_DEEP_GROUNDWATER_WATER_MINIMUM_TEMPERATURE_C,
  LAND_DEEP_GROUNDWATER_WATER_MAXIMUM_TEMPERATURE_C
} from './deep-groundwater-water-thermal.mjs?v=0.81.0-r81.1';

const LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-groundwater-aquifer-matrix-thermal-receipt/v1';
const LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-deep-soil-subsurface-matrix-thermal-receipt/v1';

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

function ownersMatch(left = {}, right = {}) {
  return same(left.trackedWaterMm, right.trackedWaterMm,
      LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(left.sensibleHeatJm2, right.sensibleHeatJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(left.waterTemperatureC, right.waterTemperatureC);
}

function result(status, detail) {
  return {
    id: 'land-deep-groundwater-water-thermal-owner-lineage',
    status,
    required: status !== 'NOT_APPLICABLE',
    statement: 'The persistent deep-soil-water and groundwater-water sensible-heat owners exchange one signed, paired amount without moving water.',
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
      LAND_DEEP_GROUNDWATER_WATER_THERMAL_CLOSURE_SCHEMA &&
    closure?.policy?.schema ===
      LAND_DEEP_GROUNDWATER_WATER_THERMAL_CLOSURE_POLICY_SCHEMA &&
    closure?.policy?.kind === 'energy' &&
    Number(closure?.policy?.absoluteFloor) ===
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J &&
    Number(closure?.policy?.ulpFactor) ===
      LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR &&
    closure?.policy?.scaleBasis ===
      'sum-of-absolute-unrounded-signed-operands-joules-per-square-metre' &&
    Array.isArray(embedded) && embedded.length === operands.length &&
    embedded.every((value, index) =>
      same(value, operands[index], 1e-6)) &&
    same(closure?.residual, residual, 1e-6) &&
    same(closure?.numericTolerance, tolerance) &&
    Number(closure?.toleranceUtilization) === utilization &&
    closure?.closed === (Math.abs(residual) <= tolerance) &&
    closure?.measuredResidualPreserved === true;
  return { valid, residual, tolerance, utilization };
}

export function auditLandDeepGroundwaterWaterThermal(column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', { kind: column?.kind || null });
  }
  const receipt = column?.land
    ?.lastDeepGroundwaterWaterThermalReceipt;
  if (!receipt) {
    const migrationCheckpoint = column?.land
      ?.deepGroundwaterWaterThermalMigrationCheckpoint === true;
    const unstepped = Number(column?.stepCount || 0) === 0;
    return result(migrationCheckpoint || unstepped
      ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: migrationCheckpoint
        ? 'v40-to-v41 migration preserves existing owners without inventing historical deep-groundwater-water exchange evidence'
        : unstepped
          ? 'the land column has not advanced yet'
          : 'a stepped current land column is missing its deep-groundwater-water thermal receipt',
      migrationCheckpoint,
      unstepped
    });
  }

  const proposal = receipt.sourceProposal?.proposal;
  const hydrologyStep = column?.land?.hydrologyThermal?.lastStepReceipt;
  const rootDeep = column?.land?.lastRootDeepWaterThermalReceipt;
  const groundwaterTransport = column?.land?.hydrologyThermal
    ?.lastGroundwaterTransportReceipt;
  const aquiferMatrixReceipt = column?.land?.aquiferMatrixThermal
    ?.lastStepReceipt;
  const subsurfaceMatrixReceipt = column?.land?.deepSubsurfaceMatrixThermal
    ?.lastStepReceipt;
  const currentDeepSoilOwner = column?.land?.hydrologyThermal?.reservoirs
    ?.deepSoil || {};
  const currentGroundwaterOwner = column?.land?.hydrologyThermal?.reservoirs
    ?.groundwater || {};
  const initialDeepSoilOwner = receipt.initialDeepSoilOwner || {};
  const finalDeepSoilOwner = receipt.finalDeepSoilOwner || {};
  const initialGroundwaterOwner = receipt.initialGroundwaterOwner || {};
  const finalGroundwaterOwner = receipt.finalGroundwaterOwner || {};
  const transfer = receipt.transfer || {};
  const signedHeatToGroundwaterJm2 = Number(
    transfer.signedHeatToGroundwaterJm2);

  const sourceLineageValid =
    receipt.schema ===
      LAND_DEEP_GROUNDWATER_WATER_THERMAL_RECEIPT_SCHEMA &&
    receiptDigestValid(receipt) &&
    column?.budget?.deepGroundwaterWaterThermal?.digest ===
      receipt.digest &&
    proposal?.schema ===
      LAND_DEEP_GROUNDWATER_WATER_THERMAL_PROPOSAL_SCHEMA &&
    receiptDigestValid(proposal) &&
    receipt.sourceProposal?.receiptDigest === proposal.digest &&
    receipt.sourceProposal?.stepId === proposal.stepId &&
    hydrologyStep?.schema ===
      LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA &&
    receiptDigestValid(hydrologyStep) &&
    receipt.sourceLandHydrologyThermal?.receiptDigest ===
      hydrologyStep.digest &&
    receipt.sourceLandHydrologyThermal?.stepId ===
      hydrologyStep.stepId &&
    rootDeep?.schema === LAND_ROOT_DEEP_WATER_THERMAL_RECEIPT_SCHEMA &&
    receiptDigestValid(rootDeep) &&
    receipt.sourceRootDeepWaterThermal?.receiptDigest ===
      rootDeep.digest &&
    receipt.sourceRootDeepWaterThermal?.stepId === rootDeep.stepId &&
    proposal?.sourceLandHydrologyThermal?.receiptDigest ===
      hydrologyStep.digest &&
    proposal?.sourceRootDeepWaterThermal?.receiptDigest ===
      rootDeep.digest;

  const deepSoilHeatCapacityJm2K =
    Number(proposal?.initialDeepSoilOwner?.trackedWaterMm) *
      LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K;
  const groundwaterHeatCapacityJm2K =
    Number(proposal?.initialGroundwaterOwner?.trackedWaterMm) *
      LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K;
  const responseFraction = 1 - Math.exp(
    -Number(proposal?.durationDays) /
      LAND_DEEP_GROUNDWATER_WATER_THERMAL_RESPONSE_TIMESCALE_DAYS);
  const jointHeatCapacityJm2K = deepSoilHeatCapacityJm2K > 0 &&
      groundwaterHeatCapacityJm2K > 0
    ? deepSoilHeatCapacityJm2K * groundwaterHeatCapacityJm2K /
      (deepSoilHeatCapacityJm2K + groundwaterHeatCapacityJm2K)
    : 0;
  const requestedHeatToGroundwaterJm2 = jointHeatCapacityJm2K *
    (Number(proposal?.initialDeepSoilOwner?.waterTemperatureC) -
      Number(proposal?.initialGroundwaterOwner?.waterTemperatureC)) *
      responseFraction;
  const minimumHeatToGroundwaterJm2 = Math.max(
    groundwaterHeatCapacityJm2K *
      (LAND_DEEP_GROUNDWATER_WATER_MINIMUM_TEMPERATURE_C -
        Number(proposal?.initialGroundwaterOwner?.waterTemperatureC)),
    deepSoilHeatCapacityJm2K *
      (Number(proposal?.initialDeepSoilOwner?.waterTemperatureC) -
        LAND_DEEP_GROUNDWATER_WATER_MAXIMUM_TEMPERATURE_C));
  const maximumHeatToGroundwaterJm2 = Math.min(
    groundwaterHeatCapacityJm2K *
      (LAND_DEEP_GROUNDWATER_WATER_MAXIMUM_TEMPERATURE_C -
        Number(proposal?.initialGroundwaterOwner?.waterTemperatureC)),
    deepSoilHeatCapacityJm2K *
      (Number(proposal?.initialDeepSoilOwner?.waterTemperatureC) -
        LAND_DEEP_GROUNDWATER_WATER_MINIMUM_TEMPERATURE_C));
  const expectedHeatToGroundwaterJm2 = deepSoilHeatCapacityJm2K > 0 &&
      groundwaterHeatCapacityJm2K > 0
    ? clamp(requestedHeatToGroundwaterJm2,
      minimumHeatToGroundwaterJm2, maximumHeatToGroundwaterJm2)
    : 0;
  const proposalRecomputationValid =
    Number(proposal?.durationDays) > 0 &&
    Number(proposal?.durationDays) <= 1.000001 &&
    ownersMatch(proposal?.initialDeepSoilOwner,
      initialDeepSoilOwner) &&
    ownersMatch(proposal?.initialGroundwaterOwner,
      initialGroundwaterOwner) &&
    same(proposal?.response?.responseTimescaleDays,
      LAND_DEEP_GROUNDWATER_WATER_THERMAL_RESPONSE_TIMESCALE_DAYS) &&
    same(proposal?.response?.responseFraction, responseFraction) &&
    same(proposal?.response?.deepSoilWaterHeatCapacityJm2K,
      deepSoilHeatCapacityJm2K, 1e-6) &&
    same(proposal?.response?.groundwaterWaterHeatCapacityJm2K,
      groundwaterHeatCapacityJm2K, 1e-6) &&
    same(proposal?.response?.jointHeatCapacityJm2K,
      jointHeatCapacityJm2K, 1e-6) &&
    same(proposal?.requestedHeatToGroundwaterJm2,
      requestedHeatToGroundwaterJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.minimumHeatToGroundwaterJm2,
      minimumHeatToGroundwaterJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.maximumHeatToGroundwaterJm2,
      maximumHeatToGroundwaterJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.appliedHeatToGroundwaterJm2,
      expectedHeatToGroundwaterJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.thermalEnvelopeLimiterJm2,
      expectedHeatToGroundwaterJm2 - requestedHeatToGroundwaterJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(signedHeatToGroundwaterJm2,
      expectedHeatToGroundwaterJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);

  const aquiferMatrixFollowsR79 = Boolean(aquiferMatrixReceipt) &&
    aquiferMatrixReceipt?.schema ===
      LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    receiptDigestValid(aquiferMatrixReceipt) &&
    aquiferMatrixReceipt.sourceDeepGroundwaterWaterThermal
      ?.receiptDigest === receipt.digest &&
    aquiferMatrixReceipt.sourceDeepGroundwaterWaterThermal?.stepId ===
      receipt.stepId &&
    ownersMatch(aquiferMatrixReceipt.initialGroundwaterOwner,
      finalGroundwaterOwner);
  const downstreamR79GroundwaterOwner = aquiferMatrixFollowsR79
    ? aquiferMatrixReceipt.finalGroundwaterOwner
    : finalGroundwaterOwner;
  const subsurfaceMatrixFollowsR79 = Boolean(subsurfaceMatrixReceipt) &&
    subsurfaceMatrixReceipt?.schema ===
      LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    receiptDigestValid(subsurfaceMatrixReceipt) &&
    subsurfaceMatrixReceipt.sourceDeepGroundwaterWaterThermal
      ?.receiptDigest === receipt.digest &&
    subsurfaceMatrixReceipt.sourceDeepGroundwaterWaterThermal?.stepId ===
      receipt.stepId &&
    ownersMatch(subsurfaceMatrixReceipt.initialDeepSoilOwner,
      finalDeepSoilOwner);
  const downstreamR79DeepSoilOwner = subsurfaceMatrixFollowsR79
    ? subsurfaceMatrixReceipt.finalDeepSoilOwner
    : finalDeepSoilOwner;
  const transportInitialOwner = groundwaterTransport?.initialOwners
    ?.[column?.id];
  const transportFinalOwner = groundwaterTransport?.finalOwners
    ?.[column?.id];
  const transportFollowsR79Lineage = Boolean(transportInitialOwner) &&
    ownersMatch(transportInitialOwner, downstreamR79GroundwaterOwner);
  const downstreamGroundwaterBindingValid = transportFollowsR79Lineage
    ? groundwaterTransport?.schema ===
        LAND_HYDROLOGY_GROUNDWATER_TRANSPORT_RECEIPT_SCHEMA &&
      receiptDigestValid(groundwaterTransport) &&
      ownersMatch(transportFinalOwner, currentGroundwaterOwner)
    : ownersMatch(downstreamR79GroundwaterOwner,
      currentGroundwaterOwner);
  const ownerBindingsValid =
    ownersMatch(rootDeep?.finalDeepSoilOwner,
      initialDeepSoilOwner) &&
    ownersMatch(hydrologyStep?.finalOwners?.groundwater,
      initialGroundwaterOwner) &&
    ownersMatch(downstreamR79DeepSoilOwner, currentDeepSoilOwner) &&
    downstreamGroundwaterBindingValid &&
    same(finalDeepSoilOwner.trackedWaterMm,
      initialDeepSoilOwner.trackedWaterMm,
      LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(finalGroundwaterOwner.trackedWaterMm,
      initialGroundwaterOwner.trackedWaterMm,
      LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(finalDeepSoilOwner.sensibleHeatJm2,
      Number(initialDeepSoilOwner.sensibleHeatJm2) -
        signedHeatToGroundwaterJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(finalGroundwaterOwner.sensibleHeatJm2,
      Number(initialGroundwaterOwner.sensibleHeatJm2) +
        signedHeatToGroundwaterJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    [finalDeepSoilOwner, finalGroundwaterOwner].every(owner =>
      Number(owner.waterTemperatureC) >=
        LAND_DEEP_GROUNDWATER_WATER_MINIMUM_TEMPERATURE_C &&
      Number(owner.waterTemperatureC) <=
        LAND_DEEP_GROUNDWATER_WATER_MAXIMUM_TEMPERATURE_C &&
      same(owner.sensibleHeatJm2,
        Number(owner.trackedWaterMm) *
          LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K *
          Number(owner.waterTemperatureC),
        LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J));

  const pairedTransferClosure = closureAudit(
    receipt.pairedTransferClosure, [
      -signedHeatToGroundwaterJm2,
      signedHeatToGroundwaterJm2
    ]);
  const deepSoilOwnerClosure = closureAudit(
    receipt.deepSoilOwnerClosure, [
      Number(finalDeepSoilOwner.sensibleHeatJm2),
      -Number(initialDeepSoilOwner.sensibleHeatJm2),
      signedHeatToGroundwaterJm2
    ]);
  const groundwaterOwnerClosure = closureAudit(
    receipt.groundwaterOwnerClosure, [
      Number(finalGroundwaterOwner.sensibleHeatJm2),
      -Number(initialGroundwaterOwner.sensibleHeatJm2),
      -signedHeatToGroundwaterJm2
    ]);
  const combinedOwnerClosure = closureAudit(
    receipt.combinedOwnerClosure, [
      Number(finalDeepSoilOwner.sensibleHeatJm2),
      Number(finalGroundwaterOwner.sensibleHeatJm2),
      -Number(initialDeepSoilOwner.sensibleHeatJm2),
      -Number(initialGroundwaterOwner.sensibleHeatJm2)
    ]);

  const expectedDirection = signedHeatToGroundwaterJm2 > 0
    ? 'deep-soil-water-to-groundwater-water'
    : signedHeatToGroundwaterJm2 < 0
      ? 'groundwater-water-to-deep-soil-water' : 'none';
  const truthValid =
    transfer.direction === expectedDirection &&
    same(transfer.signedDeepSoilOwnerHeatJm2,
      -signedHeatToGroundwaterJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(transfer.signedGroundwaterOwnerHeatJm2,
      signedHeatToGroundwaterJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    transfer.senderOwnerDebited === true &&
    transfer.receiverOwnerCredited === true &&
    receipt.truth?.existingDeepSoilAndGroundwaterWaterOwnersPaired ===
      true &&
    receipt.truth?.deepSoilWaterUnchangedByThisOrgan === true &&
    receipt.truth?.groundwaterWaterUnchangedByThisOrgan === true &&
    receipt.truth?.bulkResponseParameterized === true &&
    receipt.truth?.groundwaterWaterThermalExchangeModeled === true &&
    receipt.truth?.resolvedSolidSoilConduction === false &&
    receipt.truth?.resolvedAquiferConduction === false &&
    receipt.truth?.phaseChangeModeledByThisOrgan === false &&
    receipt.truth?.geothermalForcingModeledByThisOrgan === false &&
    receipt.truth?.scientificCalibrationClaimed === false &&
    receipt.truth?.globalUnloadedBoundaryClaimed === false &&
    proposal?.truth?.bulkResponseParameterized === true &&
    proposal?.truth?.groundwaterWaterThermalExchangeModeled === true &&
    proposal?.truth?.resolvedSolidSoilConduction === false &&
    proposal?.truth?.resolvedAquiferConduction === false &&
    column?.truth
      ?.pairedLandDeepSoilGroundwaterWaterSensibleHeatExchange === true &&
    column?.truth?.bulkDeepGroundwaterWaterThermalResponse === true &&
    column?.truth?.resolvedSoilConduction === false &&
    column?.truth?.groundwaterThermalExchangeModeled === true &&
    column?.truth?.geothermalForcingModeled === false;

  const valid = sourceLineageValid && proposalRecomputationValid &&
    ownerBindingsValid && pairedTransferClosure.valid &&
    deepSoilOwnerClosure.valid && groundwaterOwnerClosure.valid &&
    combinedOwnerClosure.valid && truthValid;
  return result(valid ? 'PASS' : 'FAIL', {
    expectedReceiptSchema:
      LAND_DEEP_GROUNDWATER_WATER_THERMAL_RECEIPT_SCHEMA,
    actualReceiptSchema: receipt?.schema || null,
    sourceLineageValid,
    proposalRecomputationValid,
    ownerBindingsValid,
    aquiferMatrixFollowsR79,
    subsurfaceMatrixFollowsR79,
    transportFollowsR79Lineage,
    transportFollowsR79: transportFollowsR79Lineage,
    downstreamGroundwaterBindingValid,
    pairedTransferClosure,
    deepSoilOwnerClosure,
    groundwaterOwnerClosure,
    combinedOwnerClosure,
    truthValid,
    signedHeatToGroundwaterJm2,
    initialDeepSoilTemperatureC:
      initialDeepSoilOwner.waterTemperatureC ?? null,
    finalDeepSoilTemperatureC:
      finalDeepSoilOwner.waterTemperatureC ?? null,
    initialGroundwaterTemperatureC:
      initialGroundwaterOwner.waterTemperatureC ?? null,
    finalGroundwaterTemperatureC:
      finalGroundwaterOwner.waterTemperatureC ?? null
  });
}
