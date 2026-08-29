import {
  LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA,
  LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K,
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR,
  LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM
} from './land-hydrology-thermal.mjs?v=0.81.0-r81.1';
import {
  LAND_SURFACE_ROOT_ZONE_THERMAL_RECEIPT_SCHEMA
} from './surface-root-zone-thermal.mjs?v=0.81.0-r81.1';
import {
  LAND_ROOT_DEEP_WATER_THERMAL_PROPOSAL_SCHEMA,
  LAND_ROOT_DEEP_WATER_THERMAL_RECEIPT_SCHEMA,
  LAND_ROOT_DEEP_WATER_THERMAL_CLOSURE_SCHEMA,
  LAND_ROOT_DEEP_WATER_THERMAL_CLOSURE_POLICY_SCHEMA,
  LAND_ROOT_DEEP_WATER_THERMAL_RESPONSE_TIMESCALE_DAYS,
  LAND_ROOT_DEEP_WATER_MINIMUM_TEMPERATURE_C,
  LAND_ROOT_DEEP_WATER_MAXIMUM_TEMPERATURE_C
} from './root-deep-water-thermal.mjs?v=0.81.0-r81.1';

const finite = value => Number.isFinite(Number(value));
const same = (left, right, tolerance = 1e-12) =>
  finite(left) && finite(right) &&
  Math.abs(Number(left) - Number(right)) <= tolerance;
const clone = value => JSON.parse(JSON.stringify(value));
const round = (value, digits = 12) =>
  Number(Number(value).toFixed(digits));
const clamp = (value, minimum, maximum) =>
  Math.max(minimum, Math.min(maximum, value));
const LAND_DEEP_GROUNDWATER_WATER_THERMAL_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-deep-groundwater-water-thermal-receipt/v1';
const LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-deep-soil-subsurface-matrix-thermal-receipt/v1';

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
    id: 'land-root-deep-water-thermal-owner-lineage',
    status,
    required: status !== 'NOT_APPLICABLE',
    statement: 'The persistent root-zone and deep-soil water sensible-heat owners exchange one signed, paired amount without moving water.',
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
    closure?.schema === LAND_ROOT_DEEP_WATER_THERMAL_CLOSURE_SCHEMA &&
    closure?.policy?.schema ===
      LAND_ROOT_DEEP_WATER_THERMAL_CLOSURE_POLICY_SCHEMA &&
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

export function auditLandRootDeepWaterThermal(column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', { kind: column?.kind || null });
  }
  const receipt = column?.land?.lastRootDeepWaterThermalReceipt;
  if (!receipt) {
    const migrationCheckpoint = column?.land
      ?.rootDeepWaterThermalMigrationCheckpoint === true;
    const unstepped = Number(column?.stepCount || 0) === 0;
    return result(migrationCheckpoint || unstepped
      ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: migrationCheckpoint
        ? 'v39-to-v40 migration preserves existing owners without inventing historical root-deep-water exchange evidence'
        : unstepped
          ? 'the land column has not advanced yet'
          : 'a stepped current land column is missing its root-deep-water thermal receipt',
      migrationCheckpoint,
      unstepped
    });
  }

  const proposal = receipt.sourceProposal?.proposal;
  const hydrologyStep = column?.land?.hydrologyThermal?.lastStepReceipt;
  const surfaceRoot = column?.land?.lastSurfaceRootZoneThermalReceipt;
  const currentRootZoneOwner = column?.land?.hydrologyThermal?.reservoirs
    ?.rootZone || {};
  const currentDeepSoilOwner = column?.land?.hydrologyThermal?.reservoirs
    ?.deepSoil || {};
  const deepGroundwaterReceipt = column?.land
    ?.lastDeepGroundwaterWaterThermalReceipt;
  const subsurfaceMatrixReceipt = column?.land?.deepSubsurfaceMatrixThermal
    ?.lastStepReceipt;
  const initialRootZoneOwner = receipt.initialRootZoneOwner || {};
  const finalRootZoneOwner = receipt.finalRootZoneOwner || {};
  const initialDeepSoilOwner = receipt.initialDeepSoilOwner || {};
  const finalDeepSoilOwner = receipt.finalDeepSoilOwner || {};
  const transfer = receipt.transfer || {};
  const signedHeatToDeepSoilJm2 = Number(
    transfer.signedHeatToDeepSoilJm2);

  const sourceLineageValid =
    receipt.schema === LAND_ROOT_DEEP_WATER_THERMAL_RECEIPT_SCHEMA &&
    receiptDigestValid(receipt) &&
    column?.budget?.rootDeepWaterThermal?.digest === receipt.digest &&
    proposal?.schema === LAND_ROOT_DEEP_WATER_THERMAL_PROPOSAL_SCHEMA &&
    receiptDigestValid(proposal) &&
    receipt.sourceProposal?.receiptDigest === proposal.digest &&
    receipt.sourceProposal?.stepId === proposal.stepId &&
    hydrologyStep?.schema ===
      LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA &&
    receiptDigestValid(hydrologyStep) &&
    receipt.sourceLandHydrologyThermal?.receiptDigest ===
      hydrologyStep.digest &&
    receipt.sourceLandHydrologyThermal?.stepId === hydrologyStep.stepId &&
    surfaceRoot?.schema ===
      LAND_SURFACE_ROOT_ZONE_THERMAL_RECEIPT_SCHEMA &&
    receiptDigestValid(surfaceRoot) &&
    receipt.sourceSurfaceRootZoneThermal?.receiptDigest ===
      surfaceRoot.digest &&
    receipt.sourceSurfaceRootZoneThermal?.stepId === surfaceRoot.stepId &&
    proposal?.sourceLandHydrologyThermal?.receiptDigest ===
      hydrologyStep.digest &&
    proposal?.sourceSurfaceRootZoneThermal?.receiptDigest ===
      surfaceRoot.digest;

  const rootZoneHeatCapacityJm2K =
    Number(proposal?.initialRootZoneOwner?.trackedWaterMm) *
      LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K;
  const deepSoilHeatCapacityJm2K =
    Number(proposal?.initialDeepSoilOwner?.trackedWaterMm) *
      LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K;
  const responseFraction = 1 - Math.exp(
    -Number(proposal?.durationDays) /
      LAND_ROOT_DEEP_WATER_THERMAL_RESPONSE_TIMESCALE_DAYS);
  const jointHeatCapacityJm2K = rootZoneHeatCapacityJm2K > 0 &&
      deepSoilHeatCapacityJm2K > 0
    ? rootZoneHeatCapacityJm2K * deepSoilHeatCapacityJm2K /
      (rootZoneHeatCapacityJm2K + deepSoilHeatCapacityJm2K)
    : 0;
  const requestedHeatToDeepSoilJm2 = jointHeatCapacityJm2K *
    (Number(proposal?.initialRootZoneOwner?.waterTemperatureC) -
      Number(proposal?.initialDeepSoilOwner?.waterTemperatureC)) *
      responseFraction;
  const minimumHeatToDeepSoilJm2 = Math.max(
    deepSoilHeatCapacityJm2K *
      (LAND_ROOT_DEEP_WATER_MINIMUM_TEMPERATURE_C -
        Number(proposal?.initialDeepSoilOwner?.waterTemperatureC)),
    rootZoneHeatCapacityJm2K *
      (Number(proposal?.initialRootZoneOwner?.waterTemperatureC) -
        LAND_ROOT_DEEP_WATER_MAXIMUM_TEMPERATURE_C));
  const maximumHeatToDeepSoilJm2 = Math.min(
    deepSoilHeatCapacityJm2K *
      (LAND_ROOT_DEEP_WATER_MAXIMUM_TEMPERATURE_C -
        Number(proposal?.initialDeepSoilOwner?.waterTemperatureC)),
    rootZoneHeatCapacityJm2K *
      (Number(proposal?.initialRootZoneOwner?.waterTemperatureC) -
        LAND_ROOT_DEEP_WATER_MINIMUM_TEMPERATURE_C));
  const expectedHeatToDeepSoilJm2 = rootZoneHeatCapacityJm2K > 0 &&
      deepSoilHeatCapacityJm2K > 0
    ? clamp(requestedHeatToDeepSoilJm2,
      minimumHeatToDeepSoilJm2, maximumHeatToDeepSoilJm2)
    : 0;
  const proposalRecomputationValid =
    ownersMatch(proposal?.initialRootZoneOwner,
      initialRootZoneOwner) &&
    ownersMatch(proposal?.initialDeepSoilOwner,
      initialDeepSoilOwner) &&
    same(proposal?.response?.responseTimescaleDays,
      LAND_ROOT_DEEP_WATER_THERMAL_RESPONSE_TIMESCALE_DAYS) &&
    same(proposal?.response?.responseFraction, responseFraction) &&
    same(proposal?.response?.rootZoneWaterHeatCapacityJm2K,
      rootZoneHeatCapacityJm2K, 1e-6) &&
    same(proposal?.response?.deepSoilWaterHeatCapacityJm2K,
      deepSoilHeatCapacityJm2K, 1e-6) &&
    same(proposal?.response?.jointHeatCapacityJm2K,
      jointHeatCapacityJm2K, 1e-6) &&
    same(proposal?.requestedHeatToDeepSoilJm2,
      requestedHeatToDeepSoilJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.minimumHeatToDeepSoilJm2,
      minimumHeatToDeepSoilJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.maximumHeatToDeepSoilJm2,
      maximumHeatToDeepSoilJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.appliedHeatToDeepSoilJm2,
      expectedHeatToDeepSoilJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.thermalEnvelopeLimiterJm2,
      expectedHeatToDeepSoilJm2 - requestedHeatToDeepSoilJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(signedHeatToDeepSoilJm2, expectedHeatToDeepSoilJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);

  const deepGroundwaterFollowsR78 = Boolean(deepGroundwaterReceipt) &&
    deepGroundwaterReceipt.schema ===
        LAND_DEEP_GROUNDWATER_WATER_THERMAL_RECEIPT_SCHEMA &&
    receiptDigestValid(deepGroundwaterReceipt) &&
    deepGroundwaterReceipt.sourceRootDeepWaterThermal
        ?.receiptDigest === receipt.digest &&
    deepGroundwaterReceipt.sourceRootDeepWaterThermal?.stepId ===
        receipt.stepId &&
    ownersMatch(deepGroundwaterReceipt.initialDeepSoilOwner,
      finalDeepSoilOwner);
  const downstreamR78DeepSoilOwner = deepGroundwaterFollowsR78
    ? deepGroundwaterReceipt.finalDeepSoilOwner : finalDeepSoilOwner;
  const subsurfaceMatrixFollowsR79 = deepGroundwaterFollowsR78 &&
    Boolean(subsurfaceMatrixReceipt) &&
    subsurfaceMatrixReceipt.schema ===
      LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    receiptDigestValid(subsurfaceMatrixReceipt) &&
    subsurfaceMatrixReceipt.sourceDeepGroundwaterWaterThermal
      ?.receiptDigest === deepGroundwaterReceipt.digest &&
    subsurfaceMatrixReceipt.sourceDeepGroundwaterWaterThermal?.stepId ===
      deepGroundwaterReceipt.stepId &&
    ownersMatch(subsurfaceMatrixReceipt.initialDeepSoilOwner,
      downstreamR78DeepSoilOwner);
  const finalDownstreamDeepSoilOwner = subsurfaceMatrixFollowsR79
    ? subsurfaceMatrixReceipt.finalDeepSoilOwner
    : downstreamR78DeepSoilOwner;
  const downstreamDeepSoilOwnerBindingValid =
    (!deepGroundwaterReceipt || deepGroundwaterFollowsR78) &&
    ownersMatch(finalDownstreamDeepSoilOwner, currentDeepSoilOwner);
  const ownerBindingsValid =
    ownersMatch(surfaceRoot?.finalRootZoneOwner,
      initialRootZoneOwner) &&
    ownersMatch(hydrologyStep?.finalOwners?.deepSoil,
      initialDeepSoilOwner) &&
    ownersMatch(finalRootZoneOwner, currentRootZoneOwner) &&
    downstreamDeepSoilOwnerBindingValid &&
    same(finalRootZoneOwner.trackedWaterMm,
      initialRootZoneOwner.trackedWaterMm,
      LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(finalDeepSoilOwner.trackedWaterMm,
      initialDeepSoilOwner.trackedWaterMm,
      LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(finalRootZoneOwner.sensibleHeatJm2,
      Number(initialRootZoneOwner.sensibleHeatJm2) -
        signedHeatToDeepSoilJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(finalDeepSoilOwner.sensibleHeatJm2,
      Number(initialDeepSoilOwner.sensibleHeatJm2) +
        signedHeatToDeepSoilJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    [finalRootZoneOwner, finalDeepSoilOwner].every(owner =>
      Number(owner.waterTemperatureC) >=
        LAND_ROOT_DEEP_WATER_MINIMUM_TEMPERATURE_C &&
      Number(owner.waterTemperatureC) <=
        LAND_ROOT_DEEP_WATER_MAXIMUM_TEMPERATURE_C &&
      same(owner.sensibleHeatJm2,
        Number(owner.trackedWaterMm) *
          LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K *
          Number(owner.waterTemperatureC),
        LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J));

  const pairedTransferClosure = closureAudit(
    receipt.pairedTransferClosure, [
      -signedHeatToDeepSoilJm2,
      signedHeatToDeepSoilJm2
    ]);
  const rootZoneOwnerClosure = closureAudit(
    receipt.rootZoneOwnerClosure, [
      Number(finalRootZoneOwner.sensibleHeatJm2),
      -Number(initialRootZoneOwner.sensibleHeatJm2),
      signedHeatToDeepSoilJm2
    ]);
  const deepSoilOwnerClosure = closureAudit(
    receipt.deepSoilOwnerClosure, [
      Number(finalDeepSoilOwner.sensibleHeatJm2),
      -Number(initialDeepSoilOwner.sensibleHeatJm2),
      -signedHeatToDeepSoilJm2
    ]);
  const combinedOwnerClosure = closureAudit(
    receipt.combinedOwnerClosure, [
      Number(finalRootZoneOwner.sensibleHeatJm2),
      Number(finalDeepSoilOwner.sensibleHeatJm2),
      -Number(initialRootZoneOwner.sensibleHeatJm2),
      -Number(initialDeepSoilOwner.sensibleHeatJm2)
    ]);

  const expectedDirection = signedHeatToDeepSoilJm2 > 0
    ? 'root-zone-water-to-deep-soil-water'
    : signedHeatToDeepSoilJm2 < 0
      ? 'deep-soil-water-to-root-zone-water' : 'none';
  const truthValid =
    transfer.direction === expectedDirection &&
    same(transfer.signedRootZoneOwnerHeatJm2,
      -signedHeatToDeepSoilJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(transfer.signedDeepSoilOwnerHeatJm2,
      signedHeatToDeepSoilJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    transfer.senderOwnerDebited === true &&
    transfer.receiverOwnerCredited === true &&
    receipt.truth?.existingRootZoneAndDeepSoilWaterOwnersPaired === true &&
    receipt.truth?.rootZoneWaterUnchangedByThisOrgan === true &&
    receipt.truth?.deepSoilWaterUnchangedByThisOrgan === true &&
    receipt.truth?.bulkResponseParameterized === true &&
    receipt.truth?.deepSoilWaterThermalExchangeModeled === true &&
    receipt.truth?.resolvedSolidSoilConduction === false &&
    receipt.truth?.groundwaterThermalExchangeModeledByThisOrgan === false &&
    receipt.truth?.phaseChangeModeledByThisOrgan === false &&
    receipt.truth?.geothermalForcingModeledByThisOrgan === false &&
    receipt.truth?.scientificCalibrationClaimed === false &&
    receipt.truth?.globalUnloadedBoundaryClaimed === false &&
    proposal?.truth?.bulkResponseParameterized === true &&
    proposal?.truth?.deepSoilWaterThermalExchangeModeled === true &&
    proposal?.truth?.resolvedSolidSoilConduction === false &&
    proposal?.truth?.groundwaterThermalExchangeModeledByThisProposal ===
      false &&
    column?.truth?.pairedLandRootZoneDeepSoilWaterSensibleHeatExchange ===
      true &&
    column?.truth?.bulkRootDeepWaterThermalResponse === true &&
    column?.truth?.resolvedSoilConduction === false &&
    column?.truth?.deepSoilThermalExchangeModeled === true &&
    column?.truth?.groundwaterThermalExchangeModeled ===
      (deepGroundwaterReceipt?.truth
        ?.groundwaterWaterThermalExchangeModeled === true);

  const valid = sourceLineageValid && proposalRecomputationValid &&
    ownerBindingsValid && pairedTransferClosure.valid &&
    rootZoneOwnerClosure.valid && deepSoilOwnerClosure.valid &&
    combinedOwnerClosure.valid && truthValid;
  return result(valid ? 'PASS' : 'FAIL', {
    expectedReceiptSchema: LAND_ROOT_DEEP_WATER_THERMAL_RECEIPT_SCHEMA,
    actualReceiptSchema: receipt?.schema || null,
    sourceLineageValid,
    proposalRecomputationValid,
    ownerBindingsValid,
    deepGroundwaterFollowsR78,
    subsurfaceMatrixFollowsR79,
    downstreamDeepSoilOwnerBindingValid,
    pairedTransferClosure,
    rootZoneOwnerClosure,
    deepSoilOwnerClosure,
    combinedOwnerClosure,
    truthValid,
    signedHeatToDeepSoilJm2,
    initialRootZoneTemperatureC:
      initialRootZoneOwner.waterTemperatureC ?? null,
    finalRootZoneTemperatureC:
      finalRootZoneOwner.waterTemperatureC ?? null,
    initialDeepSoilTemperatureC:
      initialDeepSoilOwner.waterTemperatureC ?? null,
    finalDeepSoilTemperatureC:
      finalDeepSoilOwner.waterTemperatureC ?? null
  });
}
