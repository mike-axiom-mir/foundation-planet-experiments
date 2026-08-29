import {
  LAND_SNOW_THERMAL_STEP_RECEIPT_SCHEMA,
  LAND_SNOW_ICE_SPECIFIC_HEAT_J_KG_K,
  LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_SNOW_THERMAL_ENERGY_ULP_FACTOR,
  LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM
} from './land-snow-thermal.mjs?v=0.75.0-r75.1';
import {
  SURFACE_ENERGY_LEDGER_SCHEMA,
  LAND_SNOWMELT_COLD_CONTENT_RECEIPT_SCHEMA
} from './snowmelt-cold-content.mjs?v=0.76.0-r76.1';
import {
  LAND_SURFACE_SNOW_THERMAL_PROPOSAL_SCHEMA,
  LAND_SURFACE_SNOW_THERMAL_RECEIPT_SCHEMA,
  LAND_SURFACE_SNOW_THERMAL_CLOSURE_SCHEMA,
  LAND_SURFACE_SNOW_THERMAL_CLOSURE_POLICY_SCHEMA,
  LAND_SURFACE_SNOW_THERMAL_RESPONSE_TIMESCALE_DAYS,
  LAND_SURFACE_SNOW_MINIMUM_TEMPERATURE_C,
  LAND_SURFACE_SNOW_MAXIMUM_TEMPERATURE_C
} from './surface-snow-thermal.mjs?v=0.76.0-r76.1';

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
  return same(left.trackedSnowWaterEquivalentMm,
      right.trackedSnowWaterEquivalentMm,
      LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(left.sensibleHeatJm2, right.sensibleHeatJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(left.snowTemperatureC, right.snowTemperatureC);
}

function result(status, detail) {
  return {
    id: 'land-surface-snow-thermal-owner-lineage',
    status,
    required: status !== 'NOT_APPLICABLE',
    statement: 'The existing land surface and persistent snow sensible-heat owners exchange one signed, paired amount without changing snow water.',
    detail
  };
}

function closureAudit(closure, signedOperands) {
  const operands = signedOperands.map(Number);
  const validOperands = operands.length > 0 && operands.every(finite);
  const residual = validOperands
    ? operands.reduce((sum, value) => sum + value, 0) : NaN;
  const tolerance = validOperands ? round(Math.max(
    LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    operands.reduce((sum, value) => sum + Math.abs(value), 0) *
      Number.EPSILON * LAND_SNOW_THERMAL_ENERGY_ULP_FACTOR
  )) : NaN;
  const utilization = validOperands
    ? round(Math.abs(residual) / tolerance) : NaN;
  const embedded = closure?.signedOperands;
  const valid = validOperands &&
    closure?.schema === LAND_SURFACE_SNOW_THERMAL_CLOSURE_SCHEMA &&
    closure?.policy?.schema ===
      LAND_SURFACE_SNOW_THERMAL_CLOSURE_POLICY_SCHEMA &&
    closure?.policy?.kind === 'energy' &&
    Number(closure?.policy?.absoluteFloor) ===
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J &&
    Number(closure?.policy?.ulpFactor) ===
      LAND_SNOW_THERMAL_ENERGY_ULP_FACTOR &&
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

export function auditLandSurfaceSnowThermal(column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', { kind: column?.kind || null });
  }
  const receipt = column?.land?.lastSurfaceSnowThermalReceipt;
  if (!receipt) {
    const migrationCheckpoint = column?.land
      ?.surfaceSnowThermalMigrationCheckpoint === true;
    const unstepped = Number(column?.stepCount || 0) === 0;
    return result(migrationCheckpoint || unstepped
      ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: migrationCheckpoint
        ? 'v37-to-v38 migration preserves existing owners without inventing historical surface-snow exchange evidence'
        : unstepped
          ? 'the land column has not advanced yet'
          : 'a stepped current land column is missing its surface-snow thermal receipt',
      migrationCheckpoint,
      unstepped
    });
  }

  const proposal = receipt.sourceProposal?.proposal;
  const snowStep = column?.land?.snowThermal?.lastStepReceipt;
  const coldContent = column?.land?.lastSnowmeltColdContentReceipt;
  const energy = column?.budget?.energy;
  const embeddedEnergy = receipt.sourceSurfaceEnergyLedger || {};
  const transfer = receipt.transfer || {};
  const initialSnowOwner = receipt.initialSnowOwner || {};
  const finalSnowOwner = receipt.finalSnowOwner || {};
  const currentSnowOwner = column?.land?.snowThermal?.owner || {};
  const signedHeatToSnowJm2 = Number(transfer.signedHeatToSnowJm2);

  const sourceLineageValid =
    receipt.schema === LAND_SURFACE_SNOW_THERMAL_RECEIPT_SCHEMA &&
    receiptDigestValid(receipt) &&
    column?.budget?.surfaceSnowThermal?.digest === receipt.digest &&
    proposal?.schema === LAND_SURFACE_SNOW_THERMAL_PROPOSAL_SCHEMA &&
    receiptDigestValid(proposal) &&
    receipt.sourceProposal?.receiptDigest === proposal.digest &&
    receipt.sourceProposal?.stepId === proposal.stepId &&
    snowStep?.schema === LAND_SNOW_THERMAL_STEP_RECEIPT_SCHEMA &&
    receiptDigestValid(snowStep) &&
    proposal.sourceLandSnowThermal?.receiptDigest === snowStep.digest &&
    proposal.sourceLandSnowThermal?.stepId === snowStep.stepId &&
    receipt.sourceLandSnowThermal?.receiptDigest === snowStep.digest &&
    receipt.sourceLandSnowThermal?.stepId === snowStep.stepId &&
    coldContent?.schema ===
      LAND_SNOWMELT_COLD_CONTENT_RECEIPT_SCHEMA &&
    receiptDigestValid(coldContent) &&
    receipt.sourceSnowmeltColdContent?.receiptDigest ===
      coldContent.digest &&
    receipt.sourceSnowmeltColdContent?.stepId === coldContent.stepId &&
    energy?.schema === SURFACE_ENERGY_LEDGER_SCHEMA &&
    embeddedEnergy.schema === energy.schema &&
    embeddedEnergy.stepId === energy.stepId;

  const surfaceHeatCapacityJm2K = 2.35e6 +
    Number(column?.substrate?.soilDepthM || 0) * 1.15e6;
  const snowHeatCapacityJm2K =
    Number(initialSnowOwner.trackedSnowWaterEquivalentMm) *
      LAND_SNOW_ICE_SPECIFIC_HEAT_J_KG_K;
  const responseFraction = 1 - Math.exp(
    -Number(proposal?.durationDays) /
      LAND_SURFACE_SNOW_THERMAL_RESPONSE_TIMESCALE_DAYS);
  const jointHeatCapacityJm2K = snowHeatCapacityJm2K > 0
    ? surfaceHeatCapacityJm2K * snowHeatCapacityJm2K /
      (surfaceHeatCapacityJm2K + snowHeatCapacityJm2K)
    : 0;
  const requestedHeatToSnowJm2 = jointHeatCapacityJm2K *
    (Number(proposal?.initialSurfaceOwner?.temperatureC) -
      Number(initialSnowOwner.snowTemperatureC)) * responseFraction;
  const minimumHeatToSnowJm2 = snowHeatCapacityJm2K *
    (LAND_SURFACE_SNOW_MINIMUM_TEMPERATURE_C -
      Number(initialSnowOwner.snowTemperatureC));
  const maximumHeatToSnowJm2 = snowHeatCapacityJm2K *
    (LAND_SURFACE_SNOW_MAXIMUM_TEMPERATURE_C -
      Number(initialSnowOwner.snowTemperatureC));
  const expectedHeatToSnowJm2 = snowHeatCapacityJm2K > 0
    ? clamp(requestedHeatToSnowJm2,
      minimumHeatToSnowJm2, maximumHeatToSnowJm2)
    : 0;
  const proposalRecomputationValid =
    same(proposal?.initialSurfaceOwner?.heatCapacityJm2K,
      surfaceHeatCapacityJm2K, 1e-6) &&
    same(proposal?.initialSurfaceOwner?.sensibleHeatJm2,
      Number(proposal?.initialSurfaceOwner?.temperatureC) *
        surfaceHeatCapacityJm2K,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    ownersMatch(proposal?.initialSnowOwner, initialSnowOwner) &&
    same(proposal?.response?.responseTimescaleDays,
      LAND_SURFACE_SNOW_THERMAL_RESPONSE_TIMESCALE_DAYS) &&
    same(proposal?.response?.responseFraction, responseFraction) &&
    same(proposal?.response?.surfaceHeatCapacityJm2K,
      surfaceHeatCapacityJm2K, 1e-6) &&
    same(proposal?.response?.snowHeatCapacityJm2K,
      snowHeatCapacityJm2K, 1e-6) &&
    same(proposal?.response?.jointHeatCapacityJm2K,
      jointHeatCapacityJm2K, 1e-6) &&
    same(proposal?.requestedHeatToSnowJm2,
      requestedHeatToSnowJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.minimumHeatToSnowJm2,
      minimumHeatToSnowJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.maximumHeatToSnowJm2,
      maximumHeatToSnowJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.appliedHeatToSnowJm2,
      expectedHeatToSnowJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(proposal?.thermalEnvelopeLimiterJm2,
      expectedHeatToSnowJm2 - requestedHeatToSnowJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(signedHeatToSnowJm2, expectedHeatToSnowJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);

  const ownerBindingsValid =
    ownersMatch(snowStep?.finalOwner, initialSnowOwner) &&
    ownersMatch(finalSnowOwner, currentSnowOwner) &&
    same(finalSnowOwner.trackedSnowWaterEquivalentMm,
      initialSnowOwner.trackedSnowWaterEquivalentMm,
      LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(finalSnowOwner.sensibleHeatJm2,
      Number(initialSnowOwner.sensibleHeatJm2) +
        signedHeatToSnowJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(finalSnowOwner.sensibleHeatJm2,
      Number(finalSnowOwner.trackedSnowWaterEquivalentMm) *
        LAND_SNOW_ICE_SPECIFIC_HEAT_J_KG_K *
        Number(finalSnowOwner.snowTemperatureC),
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    Number(finalSnowOwner.snowTemperatureC) >=
      LAND_SURFACE_SNOW_MINIMUM_TEMPERATURE_C &&
    Number(finalSnowOwner.snowTemperatureC) <=
      LAND_SURFACE_SNOW_MAXIMUM_TEMPERATURE_C;

  const energyBindingChecks = {
    embeddedSignedTransfer: same(
      embeddedEnergy.surfaceSnowSensibleHeatTransferJm2,
      signedHeatToSnowJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J),
    budgetSignedTransfer: same(
      energy.surfaceSnowSensibleHeatTransferJm2,
      signedHeatToSnowJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J),
    coldContentSignedTransfer: same(
      coldContent?.sourceSurfaceEnergyLedger
      ?.surfaceSnowSensibleHeatTransferJm2,
    signedHeatToSnowJm2,
    LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J),
    rootZoneSignedTransfer: same(Number(embeddedEnergy
      .surfaceRootZoneSensibleHeatTransferJm2 || 0),
      Number(energy.surfaceRootZoneSensibleHeatTransferJm2 || 0),
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J),
    surfaceOwners: ['initialSurfaceSensibleHeatOwner',
      'finalSurfaceSensibleHeatOwner'].every(key =>
      same(embeddedEnergy[key]?.heatCapacityJm2K,
        energy[key]?.heatCapacityJm2K, 1e-6) &&
      same(embeddedEnergy[key]?.temperatureC,
        energy[key]?.temperatureC, 1e-6) &&
      same(embeddedEnergy[key]?.sensibleHeatJm2,
        energy[key]?.sensibleHeatJm2,
        LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J)),
    ledgerFields: ['surfaceFluxEnergyJm2', 'boundaryHeatEnergyJm2',
      'precipitationPhaseInputJm2', 'phaseStorageChangeJm2',
      'storageChangeJm2', 'snowmeltColdContentWarmingEnergyJm2',
      'residualJm2'].every(key => same(embeddedEnergy[key], energy[key],
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J))
  };
  const energyBindingsValid = Object.values(energyBindingChecks)
    .every(Boolean);

  const pairedTransferClosure = closureAudit(
    receipt.pairedTransferClosure, [
      -signedHeatToSnowJm2,
      signedHeatToSnowJm2
    ]);
  const snowOwnerClosure = closureAudit(
    receipt.snowOwnerClosure, [
      Number(finalSnowOwner.sensibleHeatJm2),
      -Number(initialSnowOwner.sensibleHeatJm2),
      -signedHeatToSnowJm2
    ]);
  const surfaceEnergyOperands = [
      Number(embeddedEnergy.storageChangeJm2),
      -Number(embeddedEnergy.surfaceFluxEnergyJm2),
      -Number(embeddedEnergy.boundaryHeatEnergyJm2),
      -Number(embeddedEnergy.precipitationPhaseInputJm2),
      Number(embeddedEnergy.snowmeltColdContentWarmingEnergyJm2),
      signedHeatToSnowJm2
    ];
  if (Object.prototype.hasOwnProperty.call(embeddedEnergy,
      'surfaceRootZoneSensibleHeatTransferJm2')) {
    surfaceEnergyOperands.push(Number(
      embeddedEnergy.surfaceRootZoneSensibleHeatTransferJm2));
  }
  const surfaceEnergyClosure = closureAudit(
    receipt.surfaceEnergyClosure, surfaceEnergyOperands);

  const expectedDirection = signedHeatToSnowJm2 > 0
    ? 'land-surface-to-snow'
    : signedHeatToSnowJm2 < 0
      ? 'land-snow-to-surface' : 'none';
  const truthValid =
    transfer.direction === expectedDirection &&
    same(transfer.signedSurfaceOwnerHeatJm2,
      -signedHeatToSnowJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(transfer.signedSnowOwnerHeatJm2,
      signedHeatToSnowJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    transfer.senderOwnerDebited === true &&
    transfer.receiverOwnerCredited === true &&
    receipt.truth?.existingSurfaceAndSnowOwnersPaired === true &&
    receipt.truth?.signedSurfaceLedgerEntryApplied === true &&
    receipt.truth?.signedSnowOwnerEntryApplied === true &&
    receipt.truth?.snowWaterUnchangedByThisOrgan === true &&
    receipt.truth?.bulkResponseParameterized === true &&
    receipt.truth?.resolvedSnowConduction === false &&
    receipt.truth?.meltMassChangedByThisOrgan === false &&
    receipt.truth?.fusionLatentHeatModeledByThisOrgan === false &&
    receipt.truth?.scientificCalibrationClaimed === false &&
    receipt.truth?.globalUnloadedBoundaryClaimed === false &&
    proposal?.truth?.bulkResponseParameterized === true &&
    proposal?.truth?.resolvedSnowConduction === false &&
    proposal?.truth?.meltMassChangedByThisProposal === false &&
    proposal?.truth?.fusionLatentHeatModeledByThisProposal === false &&
    proposal?.truth?.scientificCalibrationClaimed === false &&
    proposal?.truth?.globalUnloadedBoundaryClaimed === false &&
    column?.truth?.pairedLandSurfaceSnowSensibleHeatExchange === true &&
    column?.truth?.bulkSurfaceSnowThermalResponse === true &&
    column?.truth?.resolvedSnowConduction === false;

  const valid = sourceLineageValid && proposalRecomputationValid &&
    ownerBindingsValid && energyBindingsValid &&
    pairedTransferClosure.valid && snowOwnerClosure.valid &&
    surfaceEnergyClosure.valid && truthValid;
  return result(valid ? 'PASS' : 'FAIL', {
    expectedReceiptSchema: LAND_SURFACE_SNOW_THERMAL_RECEIPT_SCHEMA,
    actualReceiptSchema: receipt?.schema || null,
    sourceLineageValid,
    proposalRecomputationValid,
    ownerBindingsValid,
    energyBindingsValid,
    energyBindingChecks,
    pairedTransferClosure,
    snowOwnerClosure,
    surfaceEnergyClosure,
    truthValid,
    signedHeatToSnowJm2,
    initialSnowTemperatureC: initialSnowOwner.snowTemperatureC ?? null,
    finalSnowTemperatureC: finalSnowOwner.snowTemperatureC ?? null
  });
}
