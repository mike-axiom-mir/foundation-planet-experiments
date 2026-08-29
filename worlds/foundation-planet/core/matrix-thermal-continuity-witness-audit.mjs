import {
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
} from './land-hydrology-thermal.mjs?v=0.88.0-r88.1';
import {
  LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA,
  landGroundwaterAquiferMatrixThermalReceiptValid
} from './groundwater-aquifer-matrix-thermal.mjs?v=0.88.0-r88.1';
import {
  LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
  landDeepSoilSubsurfaceMatrixThermalReceiptValid
} from './deep-soil-subsurface-matrix-thermal.mjs?v=0.88.0-r88.1';
import {
  LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
  landSurfaceSubsurfaceMatrixThermalReceiptValid
} from './surface-subsurface-matrix-thermal.mjs?v=0.88.0-r88.1';
import {
  LAND_NATIVE_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA,
  landNativeVadoseMatrixThermalReceiptValid
} from './vadose-matrix-thermal.mjs?v=0.88.0-r88.1';
import {
  LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_AGGREGATE_CLOSURE_SCHEMA,
  LAND_MATRIX_THERMAL_AGGREGATE_CLOSURE_POLICY_SCHEMA,
  landMatrixThermalAggregateReceiptValid
} from './matrix-thermal-aggregate.mjs?v=0.88.0-r88.1';
import {
  LAND_MATRIX_THERMAL_CONTINUITY_RECEIPT_SCHEMA,
  landMatrixThermalContinuityReceiptValid
} from './matrix-thermal-continuity.mjs?v=0.88.0-r88.1';
import {
  LAND_MATRIX_THERMAL_SOURCE_BUNDLE_SCHEMA,
  LAND_MATRIX_THERMAL_AGGREGATE_REPLAY_SCHEMA,
  LAND_MATRIX_THERMAL_CONTINUITY_WITNESS_RECEIPT_SCHEMA,
  landMatrixThermalSourceBundleValid,
  landMatrixThermalContinuityWitnessReceiptValid
} from './matrix-thermal-continuity-witness.mjs?v=0.88.0-r88.1';

const clone = value => JSON.parse(JSON.stringify(value));
const finite = value => Number.isFinite(Number(value));
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const same = (left, right, tolerance = 1e-12) =>
  finite(left) && finite(right) &&
  Math.abs(Number(left) - Number(right)) <= tolerance;
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

function stepOrdinal(stepId) {
  const match = String(stepId || '').match(/:(\d+)$/);
  return match ? Number(match[1]) : null;
}

function closureValid(stored, expectedOperands) {
  const operands = expectedOperands.map(Number);
  const residual = operands.reduce((sum, value) => sum + value, 0);
  const scale = operands.reduce((sum, value) => sum + Math.abs(value), 0);
  const numericTolerance = round(Math.max(
    LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    scale * Number.EPSILON * LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
  ));
  return stored?.schema === LAND_MATRIX_THERMAL_AGGREGATE_CLOSURE_SCHEMA &&
    stored?.policy?.schema ===
      LAND_MATRIX_THERMAL_AGGREGATE_CLOSURE_POLICY_SCHEMA &&
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
}

function bundleAudit(bundle, aggregate) {
  const receipts = bundle?.sourceReceipts || {};
  const r80 = receipts.groundwaterAquifer;
  const r81 = receipts.deepSoilSubsurface;
  const r82 = receipts.surfaceSubsurface;
  const r85 = receipts.nativeVadose;
  const sourceReceiptsValid =
    r80?.schema ===
      LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    landGroundwaterAquiferMatrixThermalReceiptValid(r80) &&
    digestValid(r80) &&
    r81?.schema ===
      LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    landDeepSoilSubsurfaceMatrixThermalReceiptValid(r81) &&
    digestValid(r81) &&
    r82?.schema ===
      LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    landSurfaceSubsurfaceMatrixThermalReceiptValid(r82) &&
    digestValid(r82) &&
    r85?.schema === LAND_NATIVE_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    landNativeVadoseMatrixThermalReceiptValid(r85) && digestValid(r85);
  const aggregateValid =
    aggregate?.schema === LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA &&
    landMatrixThermalAggregateReceiptValid(aggregate) &&
    digestValid(aggregate) &&
    bundle?.schema === LAND_MATRIX_THERMAL_SOURCE_BUNDLE_SCHEMA &&
    landMatrixThermalSourceBundleValid(bundle) && digestValid(bundle) &&
    bundle.aggregateBinding?.receiptDigest === aggregate.digest &&
    bundle.aggregateBinding?.stepId === aggregate.stepId &&
    bundle.aggregateBinding?.stepOrdinal === aggregate.stepOrdinal;
  const ordinals = [r80, r81, r82, r85].map(receipt =>
    stepOrdinal(receipt?.stepId));
  const oneStep = sourceReceiptsValid &&
    ordinals.every(Number.isInteger) && new Set(ordinals).size === 1 &&
    aggregate?.stepOrdinal === ordinals[0] &&
    bundle?.stepOrdinal === ordinals[0];
  const sourceBindingsExact = sourceReceiptsValid &&
    aggregate?.sources?.groundwaterAquifer?.receiptDigest === r80.digest &&
    aggregate.sources.groundwaterAquifer.stepId === r80.stepId &&
    aggregate.sources.deepSoilSubsurface?.receiptDigest === r81.digest &&
    aggregate.sources.deepSoilSubsurface.stepId === r81.stepId &&
    aggregate.sources.surfaceSubsurface?.receiptDigest === r82.digest &&
    aggregate.sources.surfaceSubsurface.stepId === r82.stepId &&
    aggregate.sources.nativeVadose?.receiptDigest === r85.digest &&
    aggregate.sources.nativeVadose.stepId === r85.stepId;
  const initialOwners = sourceReceiptsValid ? {
    deepSubsurface: r81.initialDeepSubsurfaceMatrixOwner,
    vadose: r85.initialVadoseMatrixOwner,
    aquifer: r80.initialAquiferMatrixOwner
  } : {};
  const finalOwners = sourceReceiptsValid ? {
    deepSubsurface: r85.finalDeepSubsurfaceMatrixOwner,
    vadose: r85.finalVadoseMatrixOwner,
    aquifer: r85.finalAquiferMatrixOwner
  } : {};
  const ownerChainExact = sourceReceiptsValid &&
    exact(r81.finalDeepSubsurfaceMatrixOwner,
      r82.initialDeepSubsurfaceMatrixOwner) &&
    exact(r82.finalDeepSubsurfaceMatrixOwner,
      r85.initialDeepSubsurfaceMatrixOwner) &&
    exact(r80.finalAquiferMatrixOwner,
      r85.initialAquiferMatrixOwner) &&
    exact(aggregate?.initialOwners, initialOwners) &&
    exact(aggregate?.finalOwners, finalOwners);
  const externalEntries = sourceReceiptsValid ? {
    groundwaterAquiferJm2: Number(
      r80.transfer.signedAquiferMatrixOwnerHeatJm2),
    deepSoilSubsurfaceJm2: Number(
      r81.transfer.signedDeepSubsurfaceMatrixOwnerHeatJm2),
    surfaceSubsurfaceJm2: Number(
      r82.transfer.signedDeepSubsurfaceMatrixOwnerHeatJm2)
  } : {};
  externalEntries.totalJm2 = Number(externalEntries.groundwaterAquiferJm2) +
    Number(externalEntries.deepSoilSubsurfaceJm2) +
    Number(externalEntries.surfaceSubsurfaceJm2);
  const internalEntries = sourceReceiptsValid ? {
    deepJm2: Number(r85.transfers.signedDeepOwnerHeatJm2),
    vadoseJm2: Number(r85.transfers.signedVadoseOwnerHeatJm2),
    aquiferJm2: Number(r85.transfers.signedAquiferOwnerHeatJm2)
  } : {};
  const entriesExact = sourceReceiptsValid &&
    exact(aggregate?.externalMatrixEntries, externalEntries) &&
    exact(aggregate?.nativeInternalEntries, internalEntries);
  const closuresExact = sourceReceiptsValid &&
    closureValid(aggregate?.nativeInternalTransferClosure, [
      internalEntries.deepJm2, internalEntries.vadoseJm2,
      internalEntries.aquiferJm2
    ]) && closureValid(aggregate?.aggregateOwnerClosure, [
      finalOwners.deepSubsurface.sensibleHeatJm2,
      finalOwners.vadose.sensibleHeatJm2,
      finalOwners.aquifer.sensibleHeatJm2,
      -Number(initialOwners.deepSubsurface.sensibleHeatJm2),
      -Number(initialOwners.vadose.sensibleHeatJm2),
      -Number(initialOwners.aquifer.sensibleHeatJm2),
      -Number(externalEntries.groundwaterAquiferJm2),
      -Number(externalEntries.deepSoilSubsurfaceJm2),
      -Number(externalEntries.surfaceSubsurfaceJm2)
    ]);
  return {
    schema: LAND_MATRIX_THERMAL_AGGREGATE_REPLAY_SCHEMA,
    sourceReceiptsValid,
    aggregateValid,
    oneStep,
    sourceBindingsExact,
    ownerChainExact,
    entriesExact,
    closuresExact,
    valid: sourceReceiptsValid && aggregateValid && oneStep &&
      sourceBindingsExact && ownerChainExact && entriesExact && closuresExact
  };
}

function result(status, detail) {
  return {
    id: 'land-matrix-thermal-source-complete-continuity',
    required: true,
    status,
    statement: 'Both R86 aggregates in current R87 continuity replay from exact retained R80, R81, R82, and R85 source receipts without state mutation or reconstructed heat.',
    detail
  };
}

export function auditLandMatrixThermalContinuityWitness(column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column?.land
    ?.lastMatrixThermalContinuityWitnessReceipt;
  if (!receipt) {
    const checkpoint = column?.land
      ?.matrixThermalContinuityWitnessMigrationCheckpoint === true;
    const awaiting = column?.land
      ?.matrixThermalContinuityWitnessAwaitingPriorBundle === true;
    return result(column?.stepCount <= 1 || checkpoint || awaiting
      ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'v49-to-v50 migration retains exact current sources without inventing an R88 witness'
        : awaiting
          ? 'one exact prior source bundle is still required'
          : column?.stepCount <= 1
            ? 'fewer than two aggregate-producing land steps have completed'
            : 'an eligible land column is missing its source-complete continuity witness'
    });
  }
  const continuity = receipt.sourceContinuityReceipt;
  const previousAggregate = continuity?.sourceReceipts?.previousAggregate;
  const currentAggregate = continuity?.sourceReceipts?.currentAggregate;
  const previousBundle = receipt.sourceBundles?.previous;
  const currentBundle = receipt.sourceBundles?.current;
  const previousReplay = bundleAudit(previousBundle, previousAggregate);
  const currentReplay = bundleAudit(currentBundle, currentAggregate);
  const continuityValid =
    continuity?.schema === LAND_MATRIX_THERMAL_CONTINUITY_RECEIPT_SCHEMA &&
    landMatrixThermalContinuityReceiptValid(continuity) &&
    digestValid(continuity) &&
    receipt.sources?.continuity?.receiptDigest === continuity.digest &&
    receipt.sources.continuity.stepId === continuity.stepId &&
    column?.land?.lastMatrixThermalContinuityReceipt?.digest ===
      continuity.digest;
  const bundleBindingsValid = previousReplay.valid && currentReplay.valid &&
    receipt.sources?.previousBundle?.digest === previousBundle.digest &&
    receipt.sources.previousBundle.stepOrdinal ===
      previousBundle.stepOrdinal &&
    receipt.sources?.currentBundle?.digest === currentBundle.digest &&
    receipt.sources.currentBundle.stepOrdinal === currentBundle.stepOrdinal &&
    previousBundle.aggregateBinding.receiptDigest ===
      previousAggregate.digest &&
    currentBundle.aggregateBinding.receiptDigest === currentAggregate.digest &&
    column?.land?.lastMatrixThermalSourceBundle?.digest ===
      currentBundle.digest;
  const replaySummariesExact =
    receipt.aggregateReplays?.previous?.schema ===
      LAND_MATRIX_THERMAL_AGGREGATE_REPLAY_SCHEMA &&
    receipt.aggregateReplays?.current?.schema ===
      LAND_MATRIX_THERMAL_AGGREGATE_REPLAY_SCHEMA &&
    receipt.aggregateReplays.previous.valid === previousReplay.valid &&
    receipt.aggregateReplays.current.valid === currentReplay.valid &&
    receipt.aggregateReplays.previous.aggregateReceiptDigest ===
      previousAggregate.digest &&
    receipt.aggregateReplays.current.aggregateReceiptDigest ===
      currentAggregate.digest &&
    receipt.aggregateReplays.previous.sourceBundleDigest ===
      previousBundle.digest &&
    receipt.aggregateReplays.current.sourceBundleDigest ===
      currentBundle.digest &&
    receipt.aggregateReplays.previous.stepOrdinal ===
      previousBundle.stepOrdinal &&
    receipt.aggregateReplays.current.stepOrdinal === currentBundle.stepOrdinal &&
    ['sourceReceiptsValid', 'sourceBindingsExact', 'oneStep',
      'ownerChainExact', 'entriesExact', 'closuresExact', 'valid']
      .every(key => receipt.aggregateReplays.previous[key] ===
        previousReplay[key] && receipt.aggregateReplays.current[key] ===
        currentReplay[key]);
  const currentColumnBindingsValid =
    column?.land?.lastMatrixThermalAggregateReceipt?.digest ===
      currentAggregate.digest &&
    column.land?.aquiferMatrixThermal?.lastStepReceipt?.digest ===
      currentBundle.sourceReceipts.groundwaterAquifer.digest &&
    column.land?.deepSubsurfaceMatrixThermal?.lastStepReceipt?.digest ===
      currentBundle.sourceReceipts.deepSoilSubsurface.digest &&
    column.land?.lastSurfaceSubsurfaceMatrixThermalReceipt?.digest ===
      currentBundle.sourceReceipts.surfaceSubsurface.digest &&
    column.land?.lastVadoseMatrixThermalReceipt?.digest ===
      currentBundle.sourceReceipts.nativeVadose.digest &&
    exact(column.land?.deepSubsurfaceMatrixThermal?.owner,
      currentAggregate.finalOwners.deepSubsurface) &&
    exact(column.land?.vadoseMatrixThermal?.owner,
      currentAggregate.finalOwners.vadose) &&
    exact(column.land?.aquiferMatrixThermal?.owner,
      currentAggregate.finalOwners.aquifer);
  const truthValid =
    receipt.schema ===
      LAND_MATRIX_THERMAL_CONTINUITY_WITNESS_RECEIPT_SCHEMA &&
    landMatrixThermalContinuityWitnessReceiptValid(receipt) &&
    digestValid(receipt) &&
    column?.budget?.matrixThermalContinuityWitness?.digest ===
      receipt.digest &&
    column?.land?.matrixThermalContinuityWitnessMigrationCheckpoint ===
      false &&
    column?.land?.matrixThermalContinuityWitnessAwaitingPriorBundle ===
      false &&
    receipt.truth?.previousAndCurrentSourceBundlesBound === true &&
    receipt.truth?.exactR80R81R82R85ReceiptsRetainedForBothSteps === true &&
    receipt.truth?.bothAggregatesReplayable === true &&
    receipt.truth?.continuityReceiptBound === true &&
    receipt.truth?.physicalOwnersMutatedByThisWitness === false &&
    receipt.truth?.retiredDirectDeepAquiferTransferCounted === false &&
    receipt.truth?.legacyCompatibilityEvidenceCounted === false &&
    receipt.truth?.externalHeatSourceAdded === false &&
    receipt.truth?.historicalHeatReconstructed === false &&
    receipt.truth?.resolvedConductionClaimed === false &&
    receipt.truth?.geothermalForcingModeledByThisWitness === false &&
    receipt.truth?.scientificCalibrationClaimed === false &&
    receipt.truth?.globalUnloadedBoundaryClaimed === false &&
    column?.truth?.matrixThermalContinuitySourceComplete === true &&
    column?.truth?.matrixThermalContinuityAggregatesReplayable === true;
  const valid = continuityValid && bundleBindingsValid &&
    replaySummariesExact && currentColumnBindingsValid && truthValid;
  return result(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt?.schema || null,
    continuityValid,
    bundleBindingsValid,
    previousReplay,
    currentReplay,
    replaySummariesExact,
    currentColumnBindingsValid,
    physicalOwnersMutated: false,
    historicalHeatReconstructed: false,
    truthValid
  });
}
