import {
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
} from './land-hydrology-thermal.mjs?v=0.87.0-r87.1';
import {
  LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA,
  landMatrixThermalAggregateReceiptValid
} from './matrix-thermal-aggregate.mjs?v=0.87.0-r87.1';

export const LAND_MATRIX_THERMAL_CONTINUITY_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-continuity-receipt/v1';
export const LAND_MATRIX_THERMAL_CONTINUITY_CLOSURE_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-continuity-closure/v1';
export const LAND_MATRIX_THERMAL_CONTINUITY_CLOSURE_POLICY_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-continuity-closure-policy/v1';

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

function closure(signedOperands) {
  const operands = signedOperands.map(Number);
  if (!operands.every(Number.isFinite)) {
    throw new Error('Matrix thermal continuity closure has a non-finite operand');
  }
  const residual = operands.reduce((sum, value) => sum + value, 0);
  const scale = operands.reduce((sum, value) => sum + Math.abs(value), 0);
  const numericTolerance = round(Math.max(
    LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    scale * Number.EPSILON * LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
  ));
  return {
    schema: LAND_MATRIX_THERMAL_CONTINUITY_CLOSURE_SCHEMA,
    policy: {
      schema: LAND_MATRIX_THERMAL_CONTINUITY_CLOSURE_POLICY_SCHEMA,
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

function sourceBinding(receipt) {
  return {
    schema: LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA,
    receiptDigest: receipt.digest,
    stepId: receipt.stepId,
    stepOrdinal: receipt.stepOrdinal
  };
}

function aggregateHeat(owners) {
  return Number(owners?.deepSubsurface?.sensibleHeatJm2) +
    Number(owners?.vadose?.sensibleHeatJm2) +
    Number(owners?.aquifer?.sensibleHeatJm2);
}

export function landMatrixThermalContinuityReceiptValid(receipt) {
  return receipt?.schema === LAND_MATRIX_THERMAL_CONTINUITY_RECEIPT_SCHEMA &&
    typeof receipt.stepId === 'string' &&
    Number.isInteger(receipt.previousStepOrdinal) &&
    Number.isInteger(receipt.currentStepOrdinal) &&
    receipt.previousStepOrdinal > 0 &&
    receipt.currentStepOrdinal === receipt.previousStepOrdinal + 1 &&
    receipt.sources?.previousAggregate?.schema ===
      LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA &&
    receipt.sources?.currentAggregate?.schema ===
      LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA &&
    receipt.sourceReceipts?.previousAggregate?.schema ===
      LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA &&
    receipt.sourceReceipts?.currentAggregate?.schema ===
      LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA &&
    receipt.ownerHandoff?.exact === true &&
    finite(receipt.initialAggregateSensibleHeatJm2) &&
    finite(receipt.finalAggregateSensibleHeatJm2) &&
    receipt.temporalAggregateClosure?.schema ===
      LAND_MATRIX_THERMAL_CONTINUITY_CLOSURE_SCHEMA &&
    receipt.temporalAggregateClosure?.closed === true &&
    receipt.truth?.consecutiveAggregateSourcesBound === true &&
    receipt.truth?.previousFinalToCurrentInitialOwnersExact === true &&
    receipt.truth?.currentExternalEntriesOnly === true &&
    receipt.truth?.nativeCurrentTransfersInternalOnly === true &&
    receipt.truth?.threeMatrixTemporalEnergyClosed === true &&
    receipt.truth?.physicalOwnersMutatedByThisLedger === false &&
    receipt.truth?.historicalHeatReconstructed === false &&
    receipt.truth?.externalHeatSourceAdded === false &&
    digestValid(receipt);
}

export function createLandMatrixThermalContinuityReceipt(column,
  previousAggregateReceipt, currentAggregateReceipt, context = {}) {
  if (column?.kind !== 'land') {
    throw new Error('Matrix thermal continuity ledger requires a land column');
  }
  if (!landMatrixThermalAggregateReceiptValid(previousAggregateReceipt) ||
      !landMatrixThermalAggregateReceiptValid(currentAggregateReceipt)) {
    throw new Error('Matrix thermal continuity ledger requires two intact aggregate receipts');
  }
  if (column.land?.lastMatrixThermalAggregateReceipt?.digest !==
      currentAggregateReceipt.digest) {
    throw new Error('Matrix thermal continuity current aggregate is detached from the column');
  }
  const previousStepOrdinal = Number(previousAggregateReceipt.stepOrdinal);
  const currentStepOrdinal = Number(currentAggregateReceipt.stepOrdinal);
  if (currentStepOrdinal !== previousStepOrdinal + 1) {
    throw new Error('Matrix thermal continuity aggregate steps are not consecutive');
  }

  const previousFinalOwners = previousAggregateReceipt.finalOwners;
  const currentInitialOwners = currentAggregateReceipt.initialOwners;
  const currentFinalOwners = currentAggregateReceipt.finalOwners;
  const handoffExact = exact(previousFinalOwners?.deepSubsurface,
    currentInitialOwners?.deepSubsurface) &&
    exact(previousFinalOwners?.vadose, currentInitialOwners?.vadose) &&
    exact(previousFinalOwners?.aquifer, currentInitialOwners?.aquifer);
  if (!handoffExact) {
    throw new Error('Matrix thermal continuity owner handoff is detached');
  }
  const currentOwnersBound =
    exact(column.land?.deepSubsurfaceMatrixThermal?.owner,
      currentFinalOwners?.deepSubsurface) &&
    exact(column.land?.vadoseMatrixThermal?.owner,
      currentFinalOwners?.vadose) &&
    exact(column.land?.aquiferMatrixThermal?.owner,
      currentFinalOwners?.aquifer);
  if (!currentOwnersBound) {
    throw new Error('Matrix thermal continuity current owners are detached');
  }

  const external = currentAggregateReceipt.externalMatrixEntries;
  const externalEntriesValid = [external?.groundwaterAquiferJm2,
    external?.deepSoilSubsurfaceJm2,
    external?.surfaceSubsurfaceJm2,
    external?.totalJm2].every(finite) &&
    Number(external.totalJm2) ===
      Number(external.groundwaterAquiferJm2) +
      Number(external.deepSoilSubsurfaceJm2) +
      Number(external.surfaceSubsurfaceJm2);
  if (!externalEntriesValid ||
      currentAggregateReceipt.nativeInternalTransferClosure?.closed !== true) {
    throw new Error('Matrix thermal continuity current entries are not intact');
  }

  const temporalAggregateClosure = closure([
    currentFinalOwners.deepSubsurface.sensibleHeatJm2,
    currentFinalOwners.vadose.sensibleHeatJm2,
    currentFinalOwners.aquifer.sensibleHeatJm2,
    -Number(previousFinalOwners.deepSubsurface.sensibleHeatJm2),
    -Number(previousFinalOwners.vadose.sensibleHeatJm2),
    -Number(previousFinalOwners.aquifer.sensibleHeatJm2),
    -Number(external.groundwaterAquiferJm2),
    -Number(external.deepSoilSubsurfaceJm2),
    -Number(external.surfaceSubsurfaceJm2)
  ]);
  if (!temporalAggregateClosure.closed) {
    throw new Error('Matrix thermal continuity energy ledger does not close');
  }

  const receipt = {
    schema: LAND_MATRIX_THERMAL_CONTINUITY_RECEIPT_SCHEMA,
    stepId: String(context.stepId ||
      `${column.id}:matrix-thermal-continuity:${currentStepOrdinal}`),
    previousStepOrdinal,
    currentStepOrdinal,
    sources: {
      previousAggregate: sourceBinding(previousAggregateReceipt),
      currentAggregate: sourceBinding(currentAggregateReceipt)
    },
    sourceReceipts: {
      previousAggregate: clone(previousAggregateReceipt),
      currentAggregate: clone(currentAggregateReceipt)
    },
    ownerHandoff: {
      previousFinalOwners: clone(previousFinalOwners),
      currentInitialOwners: clone(currentInitialOwners),
      exact: true
    },
    currentExternalEntries: clone(external),
    currentNativeInternalEntries: clone(
      currentAggregateReceipt.nativeInternalEntries),
    initialAggregateSensibleHeatJm2: aggregateHeat(previousFinalOwners),
    finalAggregateSensibleHeatJm2: aggregateHeat(currentFinalOwners),
    finalOwners: clone(currentFinalOwners),
    temporalAggregateClosure,
    migrationInitialization: {
      sourceWasNoHistoryCheckpoint:
        context.sourceWasNoHistoryCheckpoint === true,
      historicalHeatReconstructed: false
    },
    truth: {
      consecutiveAggregateSourcesBound: true,
      previousFinalToCurrentInitialOwnersExact: true,
      currentExternalEntriesOnly: true,
      nativeCurrentTransfersInternalOnly: true,
      threeMatrixTemporalEnergyClosed: true,
      physicalOwnersMutatedByThisLedger: false,
      retiredDirectDeepAquiferTransferCounted: false,
      legacyCompatibilityEvidenceCounted: false,
      historicalHeatReconstructed: false,
      externalHeatSourceAdded: false,
      resolvedConductionClaimed: false,
      geothermalForcingModeledByThisLedger: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  receipt.digest = stableDigest(receipt);
  return receipt;
}

export function matrixThermalContinuityDescription() {
  return {
    receiptSchema: LAND_MATRIX_THERMAL_CONTINUITY_RECEIPT_SCHEMA,
    closureSchema: LAND_MATRIX_THERMAL_CONTINUITY_CLOSURE_SCHEMA,
    closurePolicySchema:
      LAND_MATRIX_THERMAL_CONTINUITY_CLOSURE_POLICY_SCHEMA,
    sources: [
      'previous intact R86 aggregate receipt',
      'current intact R86 aggregate receipt'
    ],
    ownerHandoff:
      'exact previous-final to current-initial deep, vadose, and aquifer owners',
    externalEntries:
      'current R80 aquifer plus current R81 and R82 deep-matrix entries',
    internalEntries:
      'current R85 deep-vadose and vadose-aquifer entries remain internal',
    persistence: 'current receipt embeds both exact aggregate source receipts',
    mutatesPhysicalOwners: false,
    historicalHeatReconstructed: false,
    resolvedConduction: false,
    geothermalForcing: false,
    scientificCalibration: false,
    globalUnloadedBoundary: false
  };
}
