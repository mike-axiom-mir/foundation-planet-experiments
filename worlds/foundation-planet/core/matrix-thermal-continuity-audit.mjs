import {
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
} from './land-hydrology-thermal.mjs?v=0.87.0-r87.1';
import {
  LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA,
  landMatrixThermalAggregateReceiptValid
} from './matrix-thermal-aggregate.mjs?v=0.87.0-r87.1';
import {
  LAND_MATRIX_THERMAL_CONTINUITY_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_CONTINUITY_CLOSURE_SCHEMA,
  LAND_MATRIX_THERMAL_CONTINUITY_CLOSURE_POLICY_SCHEMA,
  landMatrixThermalContinuityReceiptValid
} from './matrix-thermal-continuity.mjs?v=0.87.0-r87.1';

const clone = value => JSON.parse(JSON.stringify(value));
const finite = value => Number.isFinite(Number(value));
const same = (left, right, tolerance = 1e-12) =>
  finite(left) && finite(right) &&
  Math.abs(Number(left) - Number(right)) <= tolerance;
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const round = (value, digits = 12) => Number(Number(value).toFixed(digits));

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

function closureValid(stored, expectedOperands) {
  const operands = expectedOperands.map(Number);
  const residual = operands.reduce((sum, value) => sum + value, 0);
  const scale = operands.reduce((sum, value) => sum + Math.abs(value), 0);
  const numericTolerance = round(Math.max(
    LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    scale * Number.EPSILON * LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
  ));
  const valid = stored?.schema ===
      LAND_MATRIX_THERMAL_CONTINUITY_CLOSURE_SCHEMA &&
    stored?.policy?.schema ===
      LAND_MATRIX_THERMAL_CONTINUITY_CLOSURE_POLICY_SCHEMA &&
    stored.policy.kind === 'energy' &&
    stored.policy.absoluteFloor ===
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J &&
    stored.policy.ulpFactor === LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR &&
    exact(stored.signedOperands, operands) &&
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
    id: 'land-matrix-thermal-temporal-continuity',
    required: true,
    status,
    statement: 'Consecutive R86 receipts preserve the exact three-owner handoff and close current external entries across time without state mutation or reconstructed heat.',
    detail
  };
}

export function auditLandMatrixThermalContinuity(column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column?.land?.lastMatrixThermalContinuityReceipt;
  if (!receipt) {
    const checkpoint =
      column?.land?.matrixThermalContinuityMigrationCheckpoint === true;
    const awaiting =
      column?.land?.matrixThermalContinuityAwaitingPriorAggregate === true;
    return result(column?.stepCount <= 1 || checkpoint || awaiting
      ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'v48-to-v49 migration preserves R86 without inventing historical R87 evidence'
        : awaiting
          ? 'one prior aggregate is still required before temporal continuity can be earned'
          : column?.stepCount <= 1
            ? 'fewer than two aggregate-producing land steps have completed'
            : 'a temporally eligible land column is missing the R87 continuity receipt'
    });
  }

  const previous = receipt.sourceReceipts?.previousAggregate;
  const current = receipt.sourceReceipts?.currentAggregate;
  const sourceReceiptsValid =
    previous?.schema === LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA &&
    current?.schema === LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA &&
    landMatrixThermalAggregateReceiptValid(previous) &&
    landMatrixThermalAggregateReceiptValid(current) &&
    digestValid(previous) && digestValid(current);
  const sourceBindingsValid = sourceReceiptsValid &&
    receipt.sources?.previousAggregate?.schema ===
      LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA &&
    receipt.sources.previousAggregate.receiptDigest === previous.digest &&
    receipt.sources.previousAggregate.stepId === previous.stepId &&
    receipt.sources.previousAggregate.stepOrdinal === previous.stepOrdinal &&
    receipt.sources?.currentAggregate?.schema ===
      LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA &&
    receipt.sources.currentAggregate.receiptDigest === current.digest &&
    receipt.sources.currentAggregate.stepId === current.stepId &&
    receipt.sources.currentAggregate.stepOrdinal === current.stepOrdinal &&
    column?.land?.lastMatrixThermalAggregateReceipt?.digest === current.digest;
  const sequentialStepsValid = sourceReceiptsValid &&
    current.stepOrdinal === previous.stepOrdinal + 1 &&
    receipt.previousStepOrdinal === previous.stepOrdinal &&
    receipt.currentStepOrdinal === current.stepOrdinal;
  const ownerHandoffValid = sourceReceiptsValid &&
    exact(previous.finalOwners?.deepSubsurface,
      current.initialOwners?.deepSubsurface) &&
    exact(previous.finalOwners?.vadose, current.initialOwners?.vadose) &&
    exact(previous.finalOwners?.aquifer, current.initialOwners?.aquifer) &&
    exact(receipt.ownerHandoff?.previousFinalOwners,
      previous.finalOwners) &&
    exact(receipt.ownerHandoff?.currentInitialOwners,
      current.initialOwners) && receipt.ownerHandoff?.exact === true &&
    exact(receipt.finalOwners, current.finalOwners) &&
    exact(column?.land?.deepSubsurfaceMatrixThermal?.owner,
      current.finalOwners?.deepSubsurface) &&
    exact(column?.land?.vadoseMatrixThermal?.owner,
      current.finalOwners?.vadose) &&
    exact(column?.land?.aquiferMatrixThermal?.owner,
      current.finalOwners?.aquifer);

  const external = current?.externalMatrixEntries || {};
  const externalEntriesValid =
    [external.groundwaterAquiferJm2, external.deepSoilSubsurfaceJm2,
      external.surfaceSubsurfaceJm2, external.totalJm2].every(finite) &&
    same(external.totalJm2,
      Number(external.groundwaterAquiferJm2) +
      Number(external.deepSoilSubsurfaceJm2) +
      Number(external.surfaceSubsurfaceJm2),
    LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    exact(receipt.currentExternalEntries, external) &&
    exact(receipt.currentNativeInternalEntries,
      current.nativeInternalEntries) &&
    current.nativeInternalTransferClosure?.closed === true;
  const closure = closureValid(receipt.temporalAggregateClosure, [
    current?.finalOwners?.deepSubsurface?.sensibleHeatJm2,
    current?.finalOwners?.vadose?.sensibleHeatJm2,
    current?.finalOwners?.aquifer?.sensibleHeatJm2,
    -Number(previous?.finalOwners?.deepSubsurface?.sensibleHeatJm2),
    -Number(previous?.finalOwners?.vadose?.sensibleHeatJm2),
    -Number(previous?.finalOwners?.aquifer?.sensibleHeatJm2),
    -Number(external.groundwaterAquiferJm2),
    -Number(external.deepSoilSubsurfaceJm2),
    -Number(external.surfaceSubsurfaceJm2)
  ]);
  const truthValid =
    receipt.schema === LAND_MATRIX_THERMAL_CONTINUITY_RECEIPT_SCHEMA &&
    digestValid(receipt) && landMatrixThermalContinuityReceiptValid(receipt) &&
    column?.budget?.matrixThermalContinuity?.digest === receipt.digest &&
    column?.land?.matrixThermalContinuityMigrationCheckpoint === false &&
    column?.land?.matrixThermalContinuityAwaitingPriorAggregate === false &&
    receipt.truth?.consecutiveAggregateSourcesBound === true &&
    receipt.truth?.previousFinalToCurrentInitialOwnersExact === true &&
    receipt.truth?.currentExternalEntriesOnly === true &&
    receipt.truth?.nativeCurrentTransfersInternalOnly === true &&
    receipt.truth?.threeMatrixTemporalEnergyClosed === true &&
    receipt.truth?.physicalOwnersMutatedByThisLedger === false &&
    receipt.truth?.retiredDirectDeepAquiferTransferCounted === false &&
    receipt.truth?.legacyCompatibilityEvidenceCounted === false &&
    receipt.truth?.historicalHeatReconstructed === false &&
    receipt.truth?.externalHeatSourceAdded === false &&
    receipt.truth?.resolvedConductionClaimed === false &&
    receipt.truth?.geothermalForcingModeledByThisLedger === false &&
    receipt.truth?.scientificCalibrationClaimed === false &&
    receipt.truth?.globalUnloadedBoundaryClaimed === false &&
    column?.truth?.matrixThermalContinuityEnergyClosed === true &&
    column?.truth?.matrixThermalContinuityOwnerChainExact === true;
  const valid = sourceBindingsValid && sequentialStepsValid &&
    ownerHandoffValid && externalEntriesValid && closure.valid && truthValid;
  return result(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt?.schema || null,
    sourceReceiptsValid,
    sourceBindingsValid,
    sequentialStepsValid,
    sourceStepOrdinals: [previous?.stepOrdinal, current?.stepOrdinal],
    ownerHandoffValid,
    externalEntriesValid,
    closure,
    historicalHeatReconstructed: false,
    physicalOwnersMutated: false,
    truthValid
  });
}
