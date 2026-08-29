import {
  LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA,
  LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K,
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR,
  LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM
} from './land-hydrology-thermal.mjs?v=0.79.0-r79.1';
import {
  SURFACE_ENERGY_LEDGER_SCHEMA
} from './snowmelt-cold-content.mjs?v=0.79.0-r79.1';
import {
  LAND_SURFACE_SNOW_THERMAL_RECEIPT_SCHEMA
} from './surface-snow-thermal.mjs?v=0.79.0-r79.1';
import {
  LAND_SURFACE_ROOT_ZONE_THERMAL_PROPOSAL_SCHEMA,
  LAND_SURFACE_ROOT_ZONE_THERMAL_RECEIPT_SCHEMA,
  LAND_SURFACE_ROOT_ZONE_THERMAL_CLOSURE_SCHEMA,
  LAND_SURFACE_ROOT_ZONE_THERMAL_CLOSURE_POLICY_SCHEMA,
  LAND_SURFACE_ROOT_ZONE_THERMAL_RESPONSE_TIMESCALE_DAYS,
  LAND_SURFACE_ROOT_ZONE_MINIMUM_TEMPERATURE_C,
  LAND_SURFACE_ROOT_ZONE_MAXIMUM_TEMPERATURE_C
} from './surface-root-zone-thermal.mjs?v=0.79.0-r79.1';

const finite = value => Number.isFinite(Number(value));
const same = (left, right, tolerance = 1e-12) =>
  finite(left) && finite(right) &&
  Math.abs(Number(left) - Number(right)) <= tolerance;
const clone = value => JSON.parse(JSON.stringify(value));
const round = (value, digits = 12) =>
  Number(Number(value).toFixed(digits));
const clamp = (value, minimum, maximum) =>
  Math.max(minimum, Math.min(maximum, value));
const LAND_ROOT_DEEP_WATER_THERMAL_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-root-deep-water-thermal-receipt/v1';

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

function rootOwnersMatch(left = {}, right = {}) {
  return same(left.trackedWaterMm, right.trackedWaterMm,
      LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(left.sensibleHeatJm2, right.sensibleHeatJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(left.waterTemperatureC, right.waterTemperatureC);
}

function result(status, detail) {
  return {
    id: 'land-surface-root-zone-thermal-owner-lineage',
    status,
    required: status !== 'NOT_APPLICABLE',
    statement: 'The existing land surface and persistent root-zone water sensible-heat owners exchange one signed, paired amount without changing root-zone water.',
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
    closure?.schema === LAND_SURFACE_ROOT_ZONE_THERMAL_CLOSURE_SCHEMA &&
    closure?.policy?.schema ===
      LAND_SURFACE_ROOT_ZONE_THERMAL_CLOSURE_POLICY_SCHEMA &&
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

export function auditLandSurfaceRootZoneThermal(column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', { kind: column?.kind || null });
  }
  const receipt = column?.land?.lastSurfaceRootZoneThermalReceipt;
  if (!receipt) {
    const migrationCheckpoint = column?.land
      ?.surfaceRootZoneThermalMigrationCheckpoint === true;
    const unstepped = Number(column?.stepCount || 0) === 0;
    return result(migrationCheckpoint || unstepped
      ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: migrationCheckpoint
        ? 'v38-to-v39 migration preserves existing owners without inventing historical surface-root-zone exchange evidence'
        : unstepped
          ? 'the land column has not advanced yet'
          : 'a stepped current land column is missing its surface-root-zone thermal receipt',
      migrationCheckpoint,
      unstepped
    });
  }

  const proposal = receipt.sourceProposal?.proposal;
  const hydrologyStep = column?.land?.hydrologyThermal?.lastStepReceipt;
  const surfaceSnow = column?.land?.lastSurfaceSnowThermalReceipt;
  const energy = column?.budget?.energy;
  const embeddedEnergy = receipt.sourceSurfaceEnergyLedger || {};
  const transfer = receipt.transfer || {};
  const initialRootZoneOwner = receipt.initialRootZoneOwner || {};
  const finalRootZoneOwner = receipt.finalRootZoneOwner || {};
  const currentRootZoneOwner = column?.land?.hydrologyThermal?.reservoirs
    ?.rootZone || {};
  const rootDeepWaterReceipt = column?.land
    ?.lastRootDeepWaterThermalReceipt;
  const deepGroundwaterWaterReceipt = column?.land
    ?.lastDeepGroundwaterWaterThermalReceipt;
  const signedHeatToRootZoneJm2 = Number(
    transfer.signedHeatToRootZoneJm2);

  const sourceLineageValid =
    receipt.schema === LAND_SURFACE_ROOT_ZONE_THERMAL_RECEIPT_SCHEMA &&
    receiptDigestValid(receipt) &&
    column?.budget?.surfaceRootZoneThermal?.digest === receipt.digest &&
    proposal?.schema === LAND_SURFACE_ROOT_ZONE_THERMAL_PROPOSAL_SCHEMA &&
    receiptDigestValid(proposal) &&
    receipt.sourceProposal?.receiptDigest === proposal.digest &&
    receipt.sourceProposal?.stepId === proposal.stepId &&
    hydrologyStep?.schema ===
      LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA &&
    receiptDigestValid(hydrologyStep) &&
    receipt.sourceLandHydrologyThermal?.receiptDigest ===
      hydrologyStep.digest &&
    receipt.sourceLandHydrologyThermal?.stepId === hydrologyStep.stepId &&
    surfaceSnow?.schema === LAND_SURFACE_SNOW_THERMAL_RECEIPT_SCHEMA &&
    receiptDigestValid(surfaceSnow) &&
    receipt.sourceSurfaceSnowThermal?.receiptDigest ===
      surfaceSnow.digest &&
    receipt.sourceSurfaceSnowThermal?.stepId === surfaceSnow.stepId &&
    energy?.schema === SURFACE_ENERGY_LEDGER_SCHEMA &&
    embeddedEnergy.schema === energy.schema &&
    embeddedEnergy.stepId === energy.stepId;

  const surfaceHeatCapacityJm2K = 2.35e6 +
    Number(column?.substrate?.soilDepthM || 0) * 1.15e6;
  const rootZoneHeatCapacityJm2K =
    Number(proposal?.initialRootZoneOwner?.trackedWaterMm) *
      LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K;
  const responseFraction = 1 - Math.exp(
    -Number(proposal?.durationDays) /
      LAND_SURFACE_ROOT_ZONE_THERMAL_RESPONSE_TIMESCALE_DAYS);
  const jointHeatCapacityJm2K = rootZoneHeatCapacityJm2K > 0
    ? surfaceHeatCapacityJm2K * rootZoneHeatCapacityJm2K /
      (surfaceHeatCapacityJm2K + rootZoneHeatCapacityJm2K)
    : 0;
  const requestedHeatToRootZoneJm2 = jointHeatCapacityJm2K *
    (Number(proposal?.initialSurfaceOwner?.temperatureC) -
      Number(proposal?.initialRootZoneOwner?.waterTemperatureC)) *
      responseFraction;
  const minimumHeatToRootZoneJm2 = rootZoneHeatCapacityJm2K *
    (LAND_SURFACE_ROOT_ZONE_MINIMUM_TEMPERATURE_C -
      Number(proposal?.initialRootZoneOwner?.waterTemperatureC));
  const maximumHeatToRootZoneJm2 = rootZoneHeatCapacityJm2K *
    (LAND_SURFACE_ROOT_ZONE_MAXIMUM_TEMPERATURE_C -
      Number(proposal?.initialRootZoneOwner?.waterTemperatureC));
  const expectedHeatToRootZoneJm2 = rootZoneHeatCapacityJm2K > 0
    ? clamp(requestedHeatToRootZoneJm2,
      minimumHeatToRootZoneJm2, maximumHeatToRootZoneJm2)
    : 0;
  const proposalRecomputationValid =
    same(proposal?.initialSurfaceOwner?.heatCapacityJm2K,
      surfaceHeatCapacityJm2K, 1e-6) &&
    same(proposal?.initialSurfaceOwner?.sensibleHeatJm2,
      Number(proposal?.initialSurfaceOwner?.temperatureC) *
        surfaceHeatCapacityJm2K,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    rootOwnersMatch(proposal?.initialRootZoneOwner,
      initialRootZoneOwner) &&
    same(proposal?.response?.responseTimescaleDays,
      LAND_SURFACE_ROOT_ZONE_THERMAL_RESPONSE_TIMESCALE_DAYS) &&
    same(proposal?.response?.responseFraction, responseFraction) &&
    same(proposal?.response?.surfaceHeatCapacityJm2K,
      surfaceHeatCapacityJm2K, 1e-6) &&
    same(proposal?.response?.rootZoneWaterHeatCapacityJm2K,
      rootZoneHeatCapacityJm2K, 1e-6) &&
    same(proposal?.response?.jointHeatCapacityJm2K,
      jointHeatCapacityJm2K, 1e-6) &&
    same(proposal?.requestedHeatToRootZoneJm2,
      requestedHeatToRootZoneJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.minimumHeatToRootZoneJm2,
      minimumHeatToRootZoneJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.maximumHeatToRootZoneJm2,
      maximumHeatToRootZoneJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.appliedHeatToRootZoneJm2,
      expectedHeatToRootZoneJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.thermalEnvelopeLimiterJm2,
      expectedHeatToRootZoneJm2 - requestedHeatToRootZoneJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(signedHeatToRootZoneJm2, expectedHeatToRootZoneJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);

  const downstreamRootOwnerBindingValid = rootDeepWaterReceipt
    ? rootDeepWaterReceipt.schema ===
        LAND_ROOT_DEEP_WATER_THERMAL_RECEIPT_SCHEMA &&
      receiptDigestValid(rootDeepWaterReceipt) &&
      rootDeepWaterReceipt.sourceSurfaceRootZoneThermal
        ?.receiptDigest === receipt.digest &&
      rootDeepWaterReceipt.sourceSurfaceRootZoneThermal?.stepId ===
        receipt.stepId &&
      rootOwnersMatch(rootDeepWaterReceipt.initialRootZoneOwner,
        finalRootZoneOwner) &&
      rootOwnersMatch(rootDeepWaterReceipt.finalRootZoneOwner,
        currentRootZoneOwner)
    : rootOwnersMatch(finalRootZoneOwner, currentRootZoneOwner);
  const ownerBindingsValid =
    rootOwnersMatch(hydrologyStep?.finalOwners?.rootZone,
      initialRootZoneOwner) &&
    downstreamRootOwnerBindingValid &&
    same(finalRootZoneOwner.trackedWaterMm,
      initialRootZoneOwner.trackedWaterMm,
      LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(finalRootZoneOwner.sensibleHeatJm2,
      Number(initialRootZoneOwner.sensibleHeatJm2) +
        signedHeatToRootZoneJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(finalRootZoneOwner.sensibleHeatJm2,
      Number(finalRootZoneOwner.trackedWaterMm) *
        LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K *
        Number(finalRootZoneOwner.waterTemperatureC),
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    Number(finalRootZoneOwner.waterTemperatureC) >=
      LAND_SURFACE_ROOT_ZONE_MINIMUM_TEMPERATURE_C &&
    Number(finalRootZoneOwner.waterTemperatureC) <=
      LAND_SURFACE_ROOT_ZONE_MAXIMUM_TEMPERATURE_C;

  const energyBindingChecks = {
    embeddedSignedTransfer: same(
      embeddedEnergy.surfaceRootZoneSensibleHeatTransferJm2,
      signedHeatToRootZoneJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J),
    budgetSignedTransfer: same(
      energy.surfaceRootZoneSensibleHeatTransferJm2,
      signedHeatToRootZoneJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J),
    surfaceSnowSignedTransfer: same(
      surfaceSnow?.sourceSurfaceEnergyLedger
        ?.surfaceRootZoneSensibleHeatTransferJm2,
      signedHeatToRootZoneJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J),
    surfaceOwners: ['initialSurfaceSensibleHeatOwner',
      'finalSurfaceSensibleHeatOwner'].every(key =>
      same(embeddedEnergy[key]?.heatCapacityJm2K,
        energy[key]?.heatCapacityJm2K, 1e-6) &&
      same(embeddedEnergy[key]?.temperatureC,
        energy[key]?.temperatureC, 1e-6) &&
      same(embeddedEnergy[key]?.sensibleHeatJm2,
        energy[key]?.sensibleHeatJm2,
        LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J)),
    ledgerFields: ['surfaceFluxEnergyJm2', 'boundaryHeatEnergyJm2',
      'precipitationPhaseInputJm2', 'phaseStorageChangeJm2',
      'storageChangeJm2', 'snowmeltColdContentWarmingEnergyJm2',
      'surfaceSnowSensibleHeatTransferJm2', 'residualJm2']
      .every(key => same(embeddedEnergy[key], energy[key],
        LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J))
  };
  const energyBindingsValid = Object.values(energyBindingChecks)
    .every(Boolean);

  const pairedTransferClosure = closureAudit(
    receipt.pairedTransferClosure, [
      -signedHeatToRootZoneJm2,
      signedHeatToRootZoneJm2
    ]);
  const rootZoneOwnerClosure = closureAudit(
    receipt.rootZoneOwnerClosure, [
      Number(finalRootZoneOwner.sensibleHeatJm2),
      -Number(initialRootZoneOwner.sensibleHeatJm2),
      -signedHeatToRootZoneJm2
    ]);
  const surfaceEnergyClosure = closureAudit(
    receipt.surfaceEnergyClosure, [
      Number(embeddedEnergy.storageChangeJm2),
      -Number(embeddedEnergy.surfaceFluxEnergyJm2),
      -Number(embeddedEnergy.boundaryHeatEnergyJm2),
      -Number(embeddedEnergy.precipitationPhaseInputJm2),
      Number(embeddedEnergy.snowmeltColdContentWarmingEnergyJm2),
      Number(embeddedEnergy.surfaceSnowSensibleHeatTransferJm2),
      signedHeatToRootZoneJm2
    ]);

  const expectedDirection = signedHeatToRootZoneJm2 > 0
    ? 'land-surface-to-root-zone-water'
    : signedHeatToRootZoneJm2 < 0
      ? 'root-zone-water-to-land-surface' : 'none';
  const truthValid =
    transfer.direction === expectedDirection &&
    same(transfer.signedSurfaceOwnerHeatJm2,
      -signedHeatToRootZoneJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(transfer.signedRootZoneOwnerHeatJm2,
      signedHeatToRootZoneJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    transfer.senderOwnerDebited === true &&
    transfer.receiverOwnerCredited === true &&
    receipt.truth?.existingSurfaceAndRootZoneWaterOwnersPaired === true &&
    receipt.truth?.signedSurfaceLedgerEntryApplied === true &&
    receipt.truth?.signedRootZoneOwnerEntryApplied === true &&
    receipt.truth?.rootZoneWaterUnchangedByThisOrgan === true &&
    receipt.truth?.bulkResponseParameterized === true &&
    receipt.truth?.resolvedSoilConduction === false &&
    receipt.truth?.deepSoilThermalExchangeModeledByThisOrgan === false &&
    receipt.truth?.groundwaterThermalExchangeModeledByThisOrgan === false &&
    receipt.truth?.phaseChangeModeledByThisOrgan === false &&
    receipt.truth?.geothermalForcingModeledByThisOrgan === false &&
    receipt.truth?.scientificCalibrationClaimed === false &&
    receipt.truth?.globalUnloadedBoundaryClaimed === false &&
    proposal?.truth?.bulkResponseParameterized === true &&
    proposal?.truth?.resolvedSoilConduction === false &&
    proposal?.truth?.deepSoilThermalExchangeModeledByThisProposal === false &&
    proposal?.truth?.groundwaterThermalExchangeModeledByThisProposal ===
      false &&
    proposal?.truth?.phaseChangeModeledByThisProposal === false &&
    proposal?.truth?.geothermalForcingModeledByThisProposal === false &&
    proposal?.truth?.scientificCalibrationClaimed === false &&
    proposal?.truth?.globalUnloadedBoundaryClaimed === false &&
    column?.truth?.pairedLandSurfaceRootZoneSensibleHeatExchange === true &&
    column?.truth?.bulkSurfaceRootZoneThermalResponse === true &&
    column?.truth?.resolvedSoilConduction === false &&
    column?.truth?.deepSoilThermalExchangeModeled ===
      (rootDeepWaterReceipt?.truth
        ?.deepSoilWaterThermalExchangeModeled === true) &&
    column?.truth?.groundwaterThermalExchangeModeled ===
      (deepGroundwaterWaterReceipt?.truth
        ?.groundwaterWaterThermalExchangeModeled === true);

  const valid = sourceLineageValid && proposalRecomputationValid &&
    ownerBindingsValid && energyBindingsValid &&
    pairedTransferClosure.valid && rootZoneOwnerClosure.valid &&
    surfaceEnergyClosure.valid && truthValid;
  return result(valid ? 'PASS' : 'FAIL', {
    expectedReceiptSchema:
      LAND_SURFACE_ROOT_ZONE_THERMAL_RECEIPT_SCHEMA,
    actualReceiptSchema: receipt?.schema || null,
    sourceLineageValid,
    proposalRecomputationValid,
    ownerBindingsValid,
    downstreamRootOwnerBindingValid,
    energyBindingsValid,
    energyBindingChecks,
    pairedTransferClosure,
    rootZoneOwnerClosure,
    surfaceEnergyClosure,
    truthValid,
    signedHeatToRootZoneJm2,
    initialRootZoneTemperatureC:
      initialRootZoneOwner.waterTemperatureC ?? null,
    finalRootZoneTemperatureC:
      finalRootZoneOwner.waterTemperatureC ?? null
  });
}
