import {
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
} from './land-hydrology-thermal.mjs?v=0.89.0-r89.1';
import {
  LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA,
  landGroundwaterAquiferMatrixThermalReceiptValid
} from './groundwater-aquifer-matrix-thermal.mjs?v=0.89.0-r89.1';
import {
  LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
  landDeepSoilSubsurfaceMatrixThermalReceiptValid
} from './deep-soil-subsurface-matrix-thermal.mjs?v=0.89.0-r89.1';
import {
  LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
  landSurfaceSubsurfaceMatrixThermalReceiptValid
} from './surface-subsurface-matrix-thermal.mjs?v=0.89.0-r89.1';
import {
  LAND_NATIVE_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA,
  landNativeVadoseMatrixThermalReceiptValid
} from './vadose-matrix-thermal.mjs?v=0.89.0-r89.1';
import {
  LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA,
  landMatrixThermalAggregateReceiptValid
} from './matrix-thermal-aggregate.mjs?v=0.89.0-r89.1';
import {
  LAND_MATRIX_THERMAL_SOURCE_BUNDLE_SCHEMA,
  landMatrixThermalSourceBundleValid
} from './matrix-thermal-continuity-witness.mjs?v=0.89.0-r89.1';

export const LAND_MATRIX_THERMAL_SOURCE_OWNER_CLOSURE_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-source-owner-closure/v1';
export const LAND_MATRIX_THERMAL_SOURCE_OWNER_CLOSURE_POLICY_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-source-owner-closure-policy/v1';
export const LAND_MATRIX_THERMAL_SOURCE_OWNER_LEDGER_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-source-owner-ledger-receipt/v1';

const clone = value => JSON.parse(JSON.stringify(value));
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const same = (left, right, tolerance = 1e-12) =>
  Number.isFinite(Number(left)) && Number.isFinite(Number(right)) &&
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

function closure(signedOperands) {
  const operands = signedOperands.map(Number);
  const residual = operands.reduce((sum, value) => sum + value, 0);
  const scale = operands.reduce((sum, value) => sum + Math.abs(value), 0);
  const numericTolerance = round(Math.max(
    LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    scale * Number.EPSILON * LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
  ));
  return {
    schema: LAND_MATRIX_THERMAL_SOURCE_OWNER_CLOSURE_SCHEMA,
    policy: {
      schema: LAND_MATRIX_THERMAL_SOURCE_OWNER_CLOSURE_POLICY_SCHEMA,
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

function currentStepEvidence(sourceBundle, aggregateReceipt) {
  const receipts = sourceBundle.sourceReceipts;
  const r80 = receipts.groundwaterAquifer;
  const r81 = receipts.deepSoilSubsurface;
  const r82 = receipts.surfaceSubsurface;
  const r85 = receipts.nativeVadose;
  const ordinals = [r80, r81, r82, r85].map(receipt =>
    stepOrdinal(receipt.stepId));
  const ordinalsExact = ordinals.every(Number.isInteger) &&
    new Set(ordinals).size === 1 &&
    sourceBundle.stepOrdinal === ordinals[0] &&
    aggregateReceipt.stepOrdinal === ordinals[0];
  const aggregateSourcesExact =
    aggregateReceipt.sources.groundwaterAquifer.receiptDigest ===
      r80.digest &&
    aggregateReceipt.sources.deepSoilSubsurface.receiptDigest ===
      r81.digest &&
    aggregateReceipt.sources.surfaceSubsurface.receiptDigest ===
      r82.digest &&
    aggregateReceipt.sources.nativeVadose.receiptDigest === r85.digest;
  const ownerChainExact =
    exact(r81.finalDeepSubsurfaceMatrixOwner,
      r82.initialDeepSubsurfaceMatrixOwner) &&
    exact(r82.finalDeepSubsurfaceMatrixOwner,
      r85.initialDeepSubsurfaceMatrixOwner) &&
    exact(r80.finalAquiferMatrixOwner,
      r85.initialAquiferMatrixOwner);
  const initialOwners = {
    counterpartSources: {
      groundwaterWater: clone(r80.initialGroundwaterOwner),
      deepSoilWater: clone(r81.initialDeepSoilOwner),
      surfaceSensibleHeat: clone(r82.initialSurfaceOwner)
    },
    matrices: clone(aggregateReceipt.initialOwners)
  };
  const finalOwners = {
    counterpartSources: {
      groundwaterWater: clone(r80.finalGroundwaterOwner),
      deepSoilWater: clone(r81.finalDeepSoilOwner),
      surfaceSensibleHeat: clone(r82.finalSurfaceOwner)
    },
    matrices: clone(aggregateReceipt.finalOwners)
  };
  const counterpartSourceEntries = {
    groundwaterWaterJm2: Number(
      r80.transfer.signedGroundwaterOwnerHeatJm2),
    deepSoilWaterJm2: Number(r81.transfer.signedDeepSoilOwnerHeatJm2),
    surfaceSensibleHeatJm2: Number(
      r82.transfer.signedSurfaceOwnerHeatJm2)
  };
  counterpartSourceEntries.totalJm2 =
    counterpartSourceEntries.groundwaterWaterJm2 +
    counterpartSourceEntries.deepSoilWaterJm2 +
    counterpartSourceEntries.surfaceSensibleHeatJm2;
  const matrixExternalEntries = clone(aggregateReceipt.externalMatrixEntries);
  const nativeInternalEntries = clone(aggregateReceipt.nativeInternalEntries);
  const pairedCounterpartClosures = {
    groundwaterAquifer: closure([
      counterpartSourceEntries.groundwaterWaterJm2,
      matrixExternalEntries.groundwaterAquiferJm2
    ]),
    deepSoilSubsurface: closure([
      counterpartSourceEntries.deepSoilWaterJm2,
      matrixExternalEntries.deepSoilSubsurfaceJm2
    ]),
    surfaceSubsurface: closure([
      counterpartSourceEntries.surfaceSensibleHeatJm2,
      matrixExternalEntries.surfaceSubsurfaceJm2
    ])
  };
  const nativeInternalTransferClosure = closure([
    nativeInternalEntries.deepJm2,
    nativeInternalEntries.vadoseJm2,
    nativeInternalEntries.aquiferJm2
  ]);
  const counterpartAggregateClosure = closure([
    counterpartSourceEntries.totalJm2,
    matrixExternalEntries.totalJm2
  ]);
  const expandedSixOwnerClosure = closure([
    finalOwners.counterpartSources.groundwaterWater.sensibleHeatJm2,
    finalOwners.counterpartSources.deepSoilWater.sensibleHeatJm2,
    finalOwners.counterpartSources.surfaceSensibleHeat.sensibleHeatJm2,
    finalOwners.matrices.deepSubsurface.sensibleHeatJm2,
    finalOwners.matrices.vadose.sensibleHeatJm2,
    finalOwners.matrices.aquifer.sensibleHeatJm2,
    -Number(initialOwners.counterpartSources.groundwaterWater.sensibleHeatJm2),
    -Number(initialOwners.counterpartSources.deepSoilWater.sensibleHeatJm2),
    -Number(initialOwners.counterpartSources.surfaceSensibleHeat.sensibleHeatJm2),
    -Number(initialOwners.matrices.deepSubsurface.sensibleHeatJm2),
    -Number(initialOwners.matrices.vadose.sensibleHeatJm2),
    -Number(initialOwners.matrices.aquifer.sensibleHeatJm2)
  ]);
  const ownersExact = exact(initialOwners.matrices,
      aggregateReceipt.initialOwners) &&
    exact(finalOwners.matrices, aggregateReceipt.finalOwners);
  const entriesExact =
    matrixExternalEntries.groundwaterAquiferJm2 ===
      r80.transfer.signedAquiferMatrixOwnerHeatJm2 &&
    matrixExternalEntries.deepSoilSubsurfaceJm2 ===
      r81.transfer.signedDeepSubsurfaceMatrixOwnerHeatJm2 &&
    matrixExternalEntries.surfaceSubsurfaceJm2 ===
      r82.transfer.signedDeepSubsurfaceMatrixOwnerHeatJm2 &&
    nativeInternalEntries.deepJm2 ===
      r85.transfers.signedDeepOwnerHeatJm2 &&
    nativeInternalEntries.vadoseJm2 ===
      r85.transfers.signedVadoseOwnerHeatJm2 &&
    nativeInternalEntries.aquiferJm2 ===
      r85.transfers.signedAquiferOwnerHeatJm2;
  const ownerDeltasExact = [
    [r80.finalGroundwaterOwner.sensibleHeatJm2 -
      r80.initialGroundwaterOwner.sensibleHeatJm2,
    counterpartSourceEntries.groundwaterWaterJm2],
    [r80.finalAquiferMatrixOwner.sensibleHeatJm2 -
      r80.initialAquiferMatrixOwner.sensibleHeatJm2,
    matrixExternalEntries.groundwaterAquiferJm2],
    [r81.finalDeepSoilOwner.sensibleHeatJm2 -
      r81.initialDeepSoilOwner.sensibleHeatJm2,
    counterpartSourceEntries.deepSoilWaterJm2],
    [r81.finalDeepSubsurfaceMatrixOwner.sensibleHeatJm2 -
      r81.initialDeepSubsurfaceMatrixOwner.sensibleHeatJm2,
    matrixExternalEntries.deepSoilSubsurfaceJm2],
    [r82.finalSurfaceOwner.sensibleHeatJm2 -
      r82.initialSurfaceOwner.sensibleHeatJm2,
    counterpartSourceEntries.surfaceSensibleHeatJm2],
    [r82.finalDeepSubsurfaceMatrixOwner.sensibleHeatJm2 -
      r82.initialDeepSubsurfaceMatrixOwner.sensibleHeatJm2,
    matrixExternalEntries.surfaceSubsurfaceJm2],
    [r85.finalDeepSubsurfaceMatrixOwner.sensibleHeatJm2 -
      r85.initialDeepSubsurfaceMatrixOwner.sensibleHeatJm2,
    nativeInternalEntries.deepJm2],
    [r85.finalVadoseMatrixOwner.sensibleHeatJm2 -
      r85.initialVadoseMatrixOwner.sensibleHeatJm2,
    nativeInternalEntries.vadoseJm2],
    [r85.finalAquiferMatrixOwner.sensibleHeatJm2 -
      r85.initialAquiferMatrixOwner.sensibleHeatJm2,
    nativeInternalEntries.aquiferJm2]
  ].every(([delta, entry]) => same(delta, entry,
    LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J));
  const closures = [
    ...Object.values(pairedCounterpartClosures),
    nativeInternalTransferClosure,
    counterpartAggregateClosure,
    expandedSixOwnerClosure
  ];
  return {
    ordinalsExact,
    aggregateSourcesExact,
    ownerChainExact,
    ownersExact,
    entriesExact,
    ownerDeltasExact,
    initialOwners,
    finalOwners,
    counterpartSourceEntries,
    matrixExternalEntries,
    nativeInternalEntries,
    pairedCounterpartClosures,
    nativeInternalTransferClosure,
    counterpartAggregateClosure,
    expandedSixOwnerClosure,
    closuresClosed: closures.every(item => item.closed === true)
  };
}

export function landMatrixThermalSourceOwnerLedgerReceiptValid(receipt) {
  return receipt?.schema ===
      LAND_MATRIX_THERMAL_SOURCE_OWNER_LEDGER_RECEIPT_SCHEMA &&
    typeof receipt.stepId === 'string' &&
    Number.isInteger(receipt.stepOrdinal) && receipt.stepOrdinal > 0 &&
    receipt.sources?.sourceBundle?.schema ===
      LAND_MATRIX_THERMAL_SOURCE_BUNDLE_SCHEMA &&
    receipt.sources?.aggregate?.schema ===
      LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA &&
    ['groundwaterAquifer', 'deepSoilSubsurface', 'surfaceSubsurface']
      .every(key => receipt.pairedCounterpartClosures?.[key]?.schema ===
        LAND_MATRIX_THERMAL_SOURCE_OWNER_CLOSURE_SCHEMA &&
        receipt.pairedCounterpartClosures[key].closed === true) &&
    receipt.nativeInternalTransferClosure?.closed === true &&
    receipt.counterpartAggregateClosure?.closed === true &&
    receipt.expandedSixOwnerClosure?.closed === true &&
    receipt.truth?.currentR88SourceBundleBound === true &&
    receipt.truth?.currentSourceOwnerCounterpartsPaired === true &&
    receipt.truth?.allSourceAndMatrixOwnerDeltasExact === true &&
    receipt.truth?.expandedSixOwnerEnergyClosed === true &&
    receipt.truth?.physicalOwnersMutatedByThisLedger === false &&
    receipt.truth?.historicalInitialMatrixEndowmentSourceResolved === false &&
    receipt.truth?.historicalHeatReconstructed === false &&
    digestValid(receipt);
}

export function createLandMatrixThermalSourceOwnerLedgerReceipt(column,
  sourceBundle, aggregateReceipt, context = {}) {
  if (column?.kind !== 'land' ||
      !landMatrixThermalSourceBundleValid(sourceBundle) ||
      !landMatrixThermalAggregateReceiptValid(aggregateReceipt) ||
      !sourceReceiptsValid(sourceBundle.sourceReceipts)) {
    throw new Error('Matrix thermal source-owner ledger requires intact current land evidence');
  }
  const bound = sourceBundle.aggregateBinding?.receiptDigest ===
      aggregateReceipt.digest &&
    sourceBundle.aggregateBinding?.stepId === aggregateReceipt.stepId &&
    column.land?.lastMatrixThermalSourceBundle?.digest ===
      sourceBundle.digest &&
    column.land?.lastMatrixThermalAggregateReceipt?.digest ===
      aggregateReceipt.digest;
  if (!bound) {
    throw new Error('Matrix thermal source-owner ledger evidence is detached');
  }
  const evidence = currentStepEvidence(sourceBundle, aggregateReceipt);
  if (!evidence.ordinalsExact || !evidence.aggregateSourcesExact ||
      !evidence.ownerChainExact || !evidence.ownersExact ||
      !evidence.entriesExact || !evidence.ownerDeltasExact ||
      !evidence.closuresClosed) {
    throw new Error('Matrix thermal source-owner ledger does not close its exact owner graph');
  }
  const receipt = {
    schema: LAND_MATRIX_THERMAL_SOURCE_OWNER_LEDGER_RECEIPT_SCHEMA,
    stepId: String(context.stepId ||
      `${column.id}:matrix-thermal-source-owner-ledger:${aggregateReceipt.stepOrdinal}`),
    stepOrdinal: aggregateReceipt.stepOrdinal,
    sources: {
      sourceBundle: {
        schema: LAND_MATRIX_THERMAL_SOURCE_BUNDLE_SCHEMA,
        digest: sourceBundle.digest,
        stepOrdinal: sourceBundle.stepOrdinal
      },
      aggregate: {
        schema: LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA,
        receiptDigest: aggregateReceipt.digest,
        stepId: aggregateReceipt.stepId,
        stepOrdinal: aggregateReceipt.stepOrdinal
      }
    },
    initialOwners: evidence.initialOwners,
    finalOwners: evidence.finalOwners,
    counterpartSourceEntries: evidence.counterpartSourceEntries,
    matrixExternalEntries: evidence.matrixExternalEntries,
    nativeInternalEntries: evidence.nativeInternalEntries,
    pairedCounterpartClosures: evidence.pairedCounterpartClosures,
    nativeInternalTransferClosure:
      evidence.nativeInternalTransferClosure,
    counterpartAggregateClosure: evidence.counterpartAggregateClosure,
    expandedSixOwnerClosure: evidence.expandedSixOwnerClosure,
    migrationInitialization: {
      sourceWasNoHistoryCheckpoint:
        context.sourceWasNoHistoryCheckpoint === true,
      historicalHeatReconstructed: false
    },
    truth: {
      currentR88SourceBundleBound: true,
      exactR80R81R82R85ReceiptsBound: true,
      currentSourceOwnerCounterpartsPaired: true,
      allSourceAndMatrixOwnerDeltasExact: true,
      groundwaterWaterCounterpartEntryApplied: true,
      deepSoilWaterCounterpartEntryApplied: true,
      surfaceSensibleHeatCounterpartEntryApplied: true,
      nativeVadoseTransfersInternalOnly: true,
      expandedSixOwnerEnergyClosed: true,
      scaleAwareNumericClosure: true,
      measuredResidualsPreserved: true,
      physicalOwnersMutatedByThisLedger: false,
      currentStepExternalHeatSourceAdded: false,
      historicalInitialMatrixEndowmentSourceResolved: false,
      historicalInitialMatrixEndowmentDebited: false,
      historicalHeatReconstructed: false,
      resolvedConductionClaimed: false,
      geothermalForcingModeledByThisLedger: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  receipt.digest = stableDigest(receipt);
  return receipt;
}

export function matrixThermalSourceOwnerLedgerDescription() {
  return {
    receiptSchema: LAND_MATRIX_THERMAL_SOURCE_OWNER_LEDGER_RECEIPT_SCHEMA,
    closureSchema: LAND_MATRIX_THERMAL_SOURCE_OWNER_CLOSURE_SCHEMA,
    closurePolicySchema:
      LAND_MATRIX_THERMAL_SOURCE_OWNER_CLOSURE_POLICY_SCHEMA,
    sourceRungs: [80, 81, 82, 85, 86, 88],
    currentStepOwners: [
      'groundwater-water', 'deep-soil-water', 'surface-sensible-heat',
      'deep-subsurface-matrix', 'vadose-matrix', 'aquifer-matrix'
    ],
    proves: [
      'R86 external matrix entries have equal-and-opposite current source-owner counterparts',
      'the expanded current-step six-owner graph closes without added heat'
    ],
    mutatesPhysicalOwners: false,
    historicalInitialMatrixEndowmentSourceResolved: false,
    historicalHeatReconstructed: false,
    resolvedConduction: false,
    geothermalForcing: false,
    scientificCalibration: false,
    globalUnloadedBoundary: false
  };
}
