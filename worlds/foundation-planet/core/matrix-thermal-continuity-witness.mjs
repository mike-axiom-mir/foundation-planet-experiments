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

export const LAND_MATRIX_THERMAL_SOURCE_BUNDLE_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-source-bundle/v1';
export const LAND_MATRIX_THERMAL_AGGREGATE_REPLAY_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-aggregate-replay/v1';
export const LAND_MATRIX_THERMAL_CONTINUITY_WITNESS_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-continuity-witness-receipt/v1';

const clone = value => JSON.parse(JSON.stringify(value));
const finite = value => Number.isFinite(Number(value));
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

function stepOrdinal(stepId) {
  const match = String(stepId || '').match(/:(\d+)$/);
  return match ? Number(match[1]) : null;
}

function closureExpected(signedOperands) {
  const operands = signedOperands.map(Number);
  const residual = operands.reduce((sum, value) => sum + value, 0);
  const scale = operands.reduce((sum, value) => sum + Math.abs(value), 0);
  const numericTolerance = round(Math.max(
    LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    scale * Number.EPSILON * LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
  ));
  return {
    schema: LAND_MATRIX_THERMAL_AGGREGATE_CLOSURE_SCHEMA,
    policy: {
      schema: LAND_MATRIX_THERMAL_AGGREGATE_CLOSURE_POLICY_SCHEMA,
      kind: 'energy',
      absoluteFloor: LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
      ulpFactor: LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
    },
    signedOperands: operands,
    residual,
    numericTolerance,
    measuredResidualPreserved: true,
    closed: Math.abs(residual) <= numericTolerance
  };
}

function sourceReceiptsValid(receipts = {}) {
  return receipts.groundwaterAquifer?.schema ===
      LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    landGroundwaterAquiferMatrixThermalReceiptValid(
      receipts.groundwaterAquifer) &&
    receipts.deepSoilSubsurface?.schema ===
      LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    landDeepSoilSubsurfaceMatrixThermalReceiptValid(
      receipts.deepSoilSubsurface) &&
    receipts.surfaceSubsurface?.schema ===
      LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    landSurfaceSubsurfaceMatrixThermalReceiptValid(
      receipts.surfaceSubsurface) &&
    receipts.nativeVadose?.schema ===
      LAND_NATIVE_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    landNativeVadoseMatrixThermalReceiptValid(receipts.nativeVadose);
}

function replayAggregate(bundle, aggregate) {
  const receipts = bundle?.sourceReceipts || {};
  const r80 = receipts.groundwaterAquifer;
  const r81 = receipts.deepSoilSubsurface;
  const r82 = receipts.surfaceSubsurface;
  const r85 = receipts.nativeVadose;
  const receiptsValid = sourceReceiptsValid(receipts);
  const ordinals = [r80, r81, r82, r85].map(receipt =>
    stepOrdinal(receipt?.stepId));
  const oneStep = receiptsValid && ordinals.every(Number.isInteger) &&
    new Set(ordinals).size === 1 && bundle.stepOrdinal === ordinals[0] &&
    aggregate?.stepOrdinal === ordinals[0];
  const sourceBindingsExact = receiptsValid &&
    aggregate?.sources?.groundwaterAquifer?.receiptDigest === r80.digest &&
    aggregate.sources.groundwaterAquifer.stepId === r80.stepId &&
    aggregate.sources.deepSoilSubsurface?.receiptDigest === r81.digest &&
    aggregate.sources.deepSoilSubsurface.stepId === r81.stepId &&
    aggregate.sources.surfaceSubsurface?.receiptDigest === r82.digest &&
    aggregate.sources.surfaceSubsurface.stepId === r82.stepId &&
    aggregate.sources.nativeVadose?.receiptDigest === r85.digest &&
    aggregate.sources.nativeVadose.stepId === r85.stepId;
  const expectedInitialOwners = receiptsValid ? {
    deepSubsurface: clone(r81.initialDeepSubsurfaceMatrixOwner),
    vadose: clone(r85.initialVadoseMatrixOwner),
    aquifer: clone(r80.initialAquiferMatrixOwner)
  } : null;
  const expectedFinalOwners = receiptsValid ? {
    deepSubsurface: clone(r85.finalDeepSubsurfaceMatrixOwner),
    vadose: clone(r85.finalVadoseMatrixOwner),
    aquifer: clone(r85.finalAquiferMatrixOwner)
  } : null;
  const ownerChainExact = receiptsValid &&
    exact(r81.finalDeepSubsurfaceMatrixOwner,
      r82.initialDeepSubsurfaceMatrixOwner) &&
    exact(r82.finalDeepSubsurfaceMatrixOwner,
      r85.initialDeepSubsurfaceMatrixOwner) &&
    exact(r80.finalAquiferMatrixOwner,
      r85.initialAquiferMatrixOwner) &&
    exact(aggregate?.initialOwners, expectedInitialOwners) &&
    exact(aggregate?.finalOwners, expectedFinalOwners);
  const expectedExternalEntries = receiptsValid ? {
    groundwaterAquiferJm2: Number(
      r80.transfer.signedAquiferMatrixOwnerHeatJm2),
    deepSoilSubsurfaceJm2: Number(
      r81.transfer.signedDeepSubsurfaceMatrixOwnerHeatJm2),
    surfaceSubsurfaceJm2: Number(
      r82.transfer.signedDeepSubsurfaceMatrixOwnerHeatJm2)
  } : null;
  if (expectedExternalEntries) {
    expectedExternalEntries.totalJm2 =
      expectedExternalEntries.groundwaterAquiferJm2 +
      expectedExternalEntries.deepSoilSubsurfaceJm2 +
      expectedExternalEntries.surfaceSubsurfaceJm2;
  }
  const expectedInternalEntries = receiptsValid ? {
    deepJm2: Number(r85.transfers.signedDeepOwnerHeatJm2),
    vadoseJm2: Number(r85.transfers.signedVadoseOwnerHeatJm2),
    aquiferJm2: Number(r85.transfers.signedAquiferOwnerHeatJm2)
  } : null;
  const entriesExact = receiptsValid &&
    exact(aggregate?.externalMatrixEntries, expectedExternalEntries) &&
    exact(aggregate?.nativeInternalEntries, expectedInternalEntries);
  const expectedNativeClosure = receiptsValid ? closureExpected([
    expectedInternalEntries.deepJm2,
    expectedInternalEntries.vadoseJm2,
    expectedInternalEntries.aquiferJm2
  ]) : null;
  const expectedAggregateClosure = receiptsValid ? closureExpected([
    expectedFinalOwners.deepSubsurface.sensibleHeatJm2,
    expectedFinalOwners.vadose.sensibleHeatJm2,
    expectedFinalOwners.aquifer.sensibleHeatJm2,
    -Number(expectedInitialOwners.deepSubsurface.sensibleHeatJm2),
    -Number(expectedInitialOwners.vadose.sensibleHeatJm2),
    -Number(expectedInitialOwners.aquifer.sensibleHeatJm2),
    -Number(expectedExternalEntries.groundwaterAquiferJm2),
    -Number(expectedExternalEntries.deepSoilSubsurfaceJm2),
    -Number(expectedExternalEntries.surfaceSubsurfaceJm2)
  ]) : null;
  const closuresExact = receiptsValid &&
    expectedNativeClosure.closed === true &&
    expectedAggregateClosure.closed === true &&
    exact(aggregate?.nativeInternalTransferClosure,
      expectedNativeClosure) &&
    exact(aggregate?.aggregateOwnerClosure, expectedAggregateClosure);
  const aggregateValid =
    landMatrixThermalAggregateReceiptValid(aggregate) &&
    digestValid(aggregate) &&
    bundle?.aggregateBinding?.schema ===
      LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA &&
    bundle.aggregateBinding.receiptDigest === aggregate.digest &&
    bundle.aggregateBinding.stepId === aggregate.stepId &&
    bundle.aggregateBinding.stepOrdinal === aggregate.stepOrdinal;
  const valid = aggregateValid && receiptsValid && oneStep &&
    sourceBindingsExact && ownerChainExact && entriesExact && closuresExact;
  return {
    schema: LAND_MATRIX_THERMAL_AGGREGATE_REPLAY_SCHEMA,
    aggregateReceiptDigest: aggregate?.digest || null,
    sourceBundleDigest: bundle?.digest || null,
    stepOrdinal: aggregate?.stepOrdinal || null,
    sourceReceiptsValid: receiptsValid,
    sourceBindingsExact,
    oneStep,
    ownerChainExact,
    entriesExact,
    closuresExact,
    valid
  };
}

export function landMatrixThermalSourceBundleValid(bundle) {
  return bundle?.schema === LAND_MATRIX_THERMAL_SOURCE_BUNDLE_SCHEMA &&
    Number.isInteger(bundle.stepOrdinal) && bundle.stepOrdinal > 0 &&
    bundle.aggregateBinding?.schema ===
      LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA &&
    typeof bundle.aggregateBinding.receiptDigest === 'string' &&
    typeof bundle.aggregateBinding.stepId === 'string' &&
    bundle.aggregateBinding.stepOrdinal === bundle.stepOrdinal &&
    sourceReceiptsValid(bundle.sourceReceipts) &&
    bundle.truth?.exactR80R81R82R85ReceiptsRetained === true &&
    bundle.truth?.historicalHeatReconstructed === false &&
    digestValid(bundle);
}

export function createLandMatrixThermalSourceBundle(column,
  aggregateReceipt, context = {}) {
  if (column?.kind !== 'land' ||
      !landMatrixThermalAggregateReceiptValid(aggregateReceipt)) {
    throw new Error('Matrix thermal source bundle requires a land column and intact aggregate');
  }
  const sourceReceipts = {
    groundwaterAquifer: clone(
      column.land?.aquiferMatrixThermal?.lastStepReceipt),
    deepSoilSubsurface: clone(
      column.land?.deepSubsurfaceMatrixThermal?.lastStepReceipt),
    surfaceSubsurface: clone(
      column.land?.lastSurfaceSubsurfaceMatrixThermalReceipt),
    nativeVadose: clone(column.land?.lastVadoseMatrixThermalReceipt)
  };
  if (!sourceReceiptsValid(sourceReceipts) ||
      column.land?.lastMatrixThermalAggregateReceipt?.digest !==
        aggregateReceipt.digest) {
    throw new Error('Matrix thermal source bundle is detached from current source evidence');
  }
  const bundle = {
    schema: LAND_MATRIX_THERMAL_SOURCE_BUNDLE_SCHEMA,
    stepOrdinal: aggregateReceipt.stepOrdinal,
    aggregateBinding: {
      schema: LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA,
      receiptDigest: aggregateReceipt.digest,
      stepId: aggregateReceipt.stepId,
      stepOrdinal: aggregateReceipt.stepOrdinal
    },
    sourceReceipts,
    migrationInitialization: {
      packagedFromExactCurrentEvidence:
        context.packagedFromExactCurrentEvidence === true,
      historicalHeatReconstructed: false
    },
    truth: {
      exactR80R81R82R85ReceiptsRetained: true,
      aggregateReplayableFromRetainedSources: true,
      physicalOwnersMutatedByThisBundle: false,
      historicalHeatReconstructed: false
    }
  };
  bundle.digest = stableDigest(bundle);
  const replay = replayAggregate(bundle, aggregateReceipt);
  if (!replay.valid) {
    throw new Error('Matrix thermal source bundle does not replay its aggregate');
  }
  return bundle;
}

export function landMatrixThermalContinuityWitnessReceiptValid(receipt) {
  return receipt?.schema ===
      LAND_MATRIX_THERMAL_CONTINUITY_WITNESS_RECEIPT_SCHEMA &&
    typeof receipt.stepId === 'string' &&
    Number.isInteger(receipt.previousStepOrdinal) &&
    receipt.currentStepOrdinal === receipt.previousStepOrdinal + 1 &&
    receipt.sources?.continuity?.schema ===
      LAND_MATRIX_THERMAL_CONTINUITY_RECEIPT_SCHEMA &&
    receipt.sourceContinuityReceipt?.schema ===
      LAND_MATRIX_THERMAL_CONTINUITY_RECEIPT_SCHEMA &&
    landMatrixThermalContinuityReceiptValid(
      receipt.sourceContinuityReceipt) &&
    landMatrixThermalSourceBundleValid(
      receipt.sourceBundles?.previous) &&
    landMatrixThermalSourceBundleValid(
      receipt.sourceBundles?.current) &&
    receipt.aggregateReplays?.previous?.valid === true &&
    receipt.aggregateReplays?.current?.valid === true &&
    receipt.truth?.previousAndCurrentSourceBundlesBound === true &&
    receipt.truth?.bothAggregatesReplayable === true &&
    receipt.truth?.physicalOwnersMutatedByThisWitness === false &&
    receipt.truth?.historicalHeatReconstructed === false &&
    digestValid(receipt);
}

export function createLandMatrixThermalContinuityWitnessReceipt(column,
  continuityReceipt, previousBundle, currentBundle, context = {}) {
  if (column?.kind !== 'land' ||
      !landMatrixThermalContinuityReceiptValid(continuityReceipt) ||
      !landMatrixThermalSourceBundleValid(previousBundle) ||
      !landMatrixThermalSourceBundleValid(currentBundle)) {
    throw new Error('Matrix thermal continuity witness requires intact land continuity and source bundles');
  }
  const previousAggregate =
    continuityReceipt.sourceReceipts.previousAggregate;
  const currentAggregate =
    continuityReceipt.sourceReceipts.currentAggregate;
  const previousReplay = replayAggregate(previousBundle,
    previousAggregate);
  const currentReplay = replayAggregate(currentBundle, currentAggregate);
  const bundlesBound = previousReplay.valid && currentReplay.valid &&
    previousBundle.stepOrdinal === continuityReceipt.previousStepOrdinal &&
    currentBundle.stepOrdinal === continuityReceipt.currentStepOrdinal &&
    column.land?.lastMatrixThermalSourceBundle?.digest ===
      currentBundle.digest &&
    column.land?.lastMatrixThermalContinuityReceipt?.digest ===
      continuityReceipt.digest &&
    column.land?.lastMatrixThermalAggregateReceipt?.digest ===
      currentAggregate.digest;
  if (!bundlesBound) {
    throw new Error('Matrix thermal continuity witness source bundles are detached');
  }
  const receipt = {
    schema: LAND_MATRIX_THERMAL_CONTINUITY_WITNESS_RECEIPT_SCHEMA,
    stepId: String(context.stepId ||
      `${column.id}:matrix-thermal-continuity-witness:${continuityReceipt.currentStepOrdinal}`),
    previousStepOrdinal: continuityReceipt.previousStepOrdinal,
    currentStepOrdinal: continuityReceipt.currentStepOrdinal,
    sources: {
      continuity: {
        schema: LAND_MATRIX_THERMAL_CONTINUITY_RECEIPT_SCHEMA,
        receiptDigest: continuityReceipt.digest,
        stepId: continuityReceipt.stepId
      },
      previousBundle: {
        schema: LAND_MATRIX_THERMAL_SOURCE_BUNDLE_SCHEMA,
        digest: previousBundle.digest,
        stepOrdinal: previousBundle.stepOrdinal
      },
      currentBundle: {
        schema: LAND_MATRIX_THERMAL_SOURCE_BUNDLE_SCHEMA,
        digest: currentBundle.digest,
        stepOrdinal: currentBundle.stepOrdinal
      }
    },
    sourceContinuityReceipt: clone(continuityReceipt),
    sourceBundles: {
      previous: clone(previousBundle),
      current: clone(currentBundle)
    },
    aggregateReplays: {
      previous: previousReplay,
      current: currentReplay
    },
    migrationInitialization: {
      sourceWasExactCurrentEvidenceCheckpoint:
        context.sourceWasExactCurrentEvidenceCheckpoint === true,
      historicalHeatReconstructed: false
    },
    truth: {
      previousAndCurrentSourceBundlesBound: true,
      exactR80R81R82R85ReceiptsRetainedForBothSteps: true,
      bothAggregatesReplayable: true,
      continuityReceiptBound: true,
      physicalOwnersMutatedByThisWitness: false,
      retiredDirectDeepAquiferTransferCounted: false,
      legacyCompatibilityEvidenceCounted: false,
      externalHeatSourceAdded: false,
      historicalHeatReconstructed: false,
      resolvedConductionClaimed: false,
      geothermalForcingModeledByThisWitness: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  receipt.digest = stableDigest(receipt);
  return receipt;
}

export function matrixThermalContinuityWitnessDescription() {
  return {
    sourceBundleSchema: LAND_MATRIX_THERMAL_SOURCE_BUNDLE_SCHEMA,
    aggregateReplaySchema: LAND_MATRIX_THERMAL_AGGREGATE_REPLAY_SCHEMA,
    receiptSchema:
      LAND_MATRIX_THERMAL_CONTINUITY_WITNESS_RECEIPT_SCHEMA,
    retainedSourceRungs: [80, 81, 82, 85],
    window: 'exact previous and current aggregate-producing steps',
    proves: [
      'both R86 aggregates replay from retained exact source receipts',
      'R87 binds the same previous and current R86 receipts'
    ],
    mutatesPhysicalOwners: false,
    historicalHeatReconstructed: false,
    resolvedConduction: false,
    geothermalForcing: false,
    scientificCalibration: false,
    globalUnloadedBoundary: false
  };
}
