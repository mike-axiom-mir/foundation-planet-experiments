import {
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
} from './land-hydrology-thermal.mjs?v=0.86.0-r86.1';
import {
  LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA,
  landGroundwaterAquiferMatrixThermalReceiptValid
} from './groundwater-aquifer-matrix-thermal.mjs?v=0.86.0-r86.1';
import {
  LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
  landDeepSoilSubsurfaceMatrixThermalReceiptValid
} from './deep-soil-subsurface-matrix-thermal.mjs?v=0.86.0-r86.1';
import {
  LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
  landSurfaceSubsurfaceMatrixThermalReceiptValid
} from './surface-subsurface-matrix-thermal.mjs?v=0.86.0-r86.1';
import {
  LAND_NATIVE_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA,
  landNativeVadoseMatrixThermalReceiptValid
} from './vadose-matrix-thermal.mjs?v=0.86.0-r86.1';

export const LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-aggregate-receipt/v1';
export const LAND_MATRIX_THERMAL_AGGREGATE_CLOSURE_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-aggregate-closure/v1';
export const LAND_MATRIX_THERMAL_AGGREGATE_CLOSURE_POLICY_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-aggregate-closure-policy/v1';

const clone = value => JSON.parse(JSON.stringify(value));
const finite = value => Number.isFinite(Number(value));
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

function exact(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function stepOrdinal(stepId) {
  const match = String(stepId || '').match(/:(\d+)$/);
  return match ? Number(match[1]) : null;
}

function closure(signedOperands) {
  const operands = signedOperands.map(Number);
  if (!operands.every(Number.isFinite)) {
    throw new Error('Matrix thermal aggregate closure has a non-finite operand');
  }
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

function sourceBinding(schema, receipt) {
  return {
    schema,
    receiptDigest: receipt.digest,
    stepId: receipt.stepId
  };
}

export function landMatrixThermalAggregateReceiptValid(receipt) {
  return receipt?.schema === LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA &&
    typeof receipt.stepId === 'string' &&
    Number.isInteger(receipt.stepOrdinal) && receipt.stepOrdinal > 0 &&
    receipt.sources?.groundwaterAquifer?.schema ===
      LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    receipt.sources?.deepSoilSubsurface?.schema ===
      LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    receipt.sources?.surfaceSubsurface?.schema ===
      LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    receipt.sources?.nativeVadose?.schema ===
      LAND_NATIVE_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    [receipt.externalMatrixEntries?.groundwaterAquiferJm2,
      receipt.externalMatrixEntries?.deepSoilSubsurfaceJm2,
      receipt.externalMatrixEntries?.surfaceSubsurfaceJm2,
      receipt.externalMatrixEntries?.totalJm2,
      receipt.nativeInternalEntries?.deepJm2,
      receipt.nativeInternalEntries?.vadoseJm2,
      receipt.nativeInternalEntries?.aquiferJm2]
      .every(finite) &&
    receipt.nativeInternalTransferClosure?.schema ===
      LAND_MATRIX_THERMAL_AGGREGATE_CLOSURE_SCHEMA &&
    receipt.nativeInternalTransferClosure?.closed === true &&
    receipt.aggregateOwnerClosure?.schema ===
      LAND_MATRIX_THERMAL_AGGREGATE_CLOSURE_SCHEMA &&
    receipt.aggregateOwnerClosure?.closed === true &&
    receipt.truth?.currentR80R81R82R85SourcesBound === true &&
    receipt.truth?.nativeVadoseTransfersInternalOnly === true &&
    receipt.truth?.threeMatrixAggregateEnergyClosed === true &&
    receipt.truth?.physicalOwnersMutatedByThisLedger === false &&
    receipt.truth?.externalHeatSourceAdded === false &&
    receipt.truth?.historicalHeatReconstructed === false &&
    digestValid(receipt);
}

export function createLandMatrixThermalAggregateReceipt(column,
  groundwaterAquiferReceipt, deepSoilSubsurfaceReceipt,
  surfaceSubsurfaceReceipt, nativeVadoseReceipt, context = {}) {
  if (column?.kind !== 'land') {
    throw new Error('Matrix thermal aggregate ledger requires a land column');
  }
  if (!landGroundwaterAquiferMatrixThermalReceiptValid(
      groundwaterAquiferReceipt) ||
      !landDeepSoilSubsurfaceMatrixThermalReceiptValid(
        deepSoilSubsurfaceReceipt) ||
      !landSurfaceSubsurfaceMatrixThermalReceiptValid(
        surfaceSubsurfaceReceipt) ||
      !landNativeVadoseMatrixThermalReceiptValid(nativeVadoseReceipt)) {
    throw new Error('Matrix thermal aggregate ledger requires intact current source receipts');
  }
  const currentSourcesBound =
    column.land?.aquiferMatrixThermal?.lastStepReceipt?.digest ===
      groundwaterAquiferReceipt.digest &&
    column.land?.deepSubsurfaceMatrixThermal?.lastStepReceipt?.digest ===
      deepSoilSubsurfaceReceipt.digest &&
    column.land?.lastSurfaceSubsurfaceMatrixThermalReceipt?.digest ===
      surfaceSubsurfaceReceipt.digest &&
    column.land?.lastVadoseMatrixThermalReceipt?.digest ===
      nativeVadoseReceipt.digest &&
    column.land?.lastDeepAquiferMatrixThermalReceipt == null;
  if (!currentSourcesBound) {
    throw new Error('Matrix thermal aggregate source receipts are detached from the current column');
  }

  const ordinals = [groundwaterAquiferReceipt, deepSoilSubsurfaceReceipt,
    surfaceSubsurfaceReceipt, nativeVadoseReceipt]
    .map(receipt => stepOrdinal(receipt.stepId));
  if (!ordinals.every(Number.isInteger) || new Set(ordinals).size !== 1) {
    throw new Error('Matrix thermal aggregate sources do not share one current step ordinal');
  }

  const sourceChainBound =
    exact(deepSoilSubsurfaceReceipt.finalDeepSubsurfaceMatrixOwner,
      surfaceSubsurfaceReceipt.initialDeepSubsurfaceMatrixOwner) &&
    exact(surfaceSubsurfaceReceipt.finalDeepSubsurfaceMatrixOwner,
      nativeVadoseReceipt.initialDeepSubsurfaceMatrixOwner) &&
    exact(groundwaterAquiferReceipt.finalAquiferMatrixOwner,
      nativeVadoseReceipt.initialAquiferMatrixOwner) &&
    exact(column.land.deepSubsurfaceMatrixThermal.owner,
      nativeVadoseReceipt.finalDeepSubsurfaceMatrixOwner) &&
    exact(column.land.vadoseMatrixThermal.owner,
      nativeVadoseReceipt.finalVadoseMatrixOwner) &&
    exact(column.land.aquiferMatrixThermal.owner,
      nativeVadoseReceipt.finalAquiferMatrixOwner);
  if (!sourceChainBound) {
    throw new Error('Matrix thermal aggregate owner chain is detached');
  }

  const initialOwners = {
    deepSubsurface: clone(
      deepSoilSubsurfaceReceipt.initialDeepSubsurfaceMatrixOwner),
    vadose: clone(nativeVadoseReceipt.initialVadoseMatrixOwner),
    aquifer: clone(groundwaterAquiferReceipt.initialAquiferMatrixOwner)
  };
  const finalOwners = {
    deepSubsurface: clone(nativeVadoseReceipt
      .finalDeepSubsurfaceMatrixOwner),
    vadose: clone(nativeVadoseReceipt.finalVadoseMatrixOwner),
    aquifer: clone(nativeVadoseReceipt.finalAquiferMatrixOwner)
  };
  const externalMatrixEntries = {
    groundwaterAquiferJm2: Number(groundwaterAquiferReceipt.transfer
      .signedAquiferMatrixOwnerHeatJm2),
    deepSoilSubsurfaceJm2: Number(deepSoilSubsurfaceReceipt.transfer
      .signedDeepSubsurfaceMatrixOwnerHeatJm2),
    surfaceSubsurfaceJm2: Number(surfaceSubsurfaceReceipt.transfer
      .signedDeepSubsurfaceMatrixOwnerHeatJm2)
  };
  externalMatrixEntries.totalJm2 =
    externalMatrixEntries.groundwaterAquiferJm2 +
    externalMatrixEntries.deepSoilSubsurfaceJm2 +
    externalMatrixEntries.surfaceSubsurfaceJm2;
  const nativeInternalEntries = {
    deepJm2: Number(nativeVadoseReceipt.transfers
      .signedDeepOwnerHeatJm2),
    vadoseJm2: Number(nativeVadoseReceipt.transfers
      .signedVadoseOwnerHeatJm2),
    aquiferJm2: Number(nativeVadoseReceipt.transfers
      .signedAquiferOwnerHeatJm2)
  };
  const nativeInternalTransferClosure = closure([
    nativeInternalEntries.deepJm2,
    nativeInternalEntries.vadoseJm2,
    nativeInternalEntries.aquiferJm2
  ]);
  const aggregateOwnerClosure = closure([
    finalOwners.deepSubsurface.sensibleHeatJm2,
    finalOwners.vadose.sensibleHeatJm2,
    finalOwners.aquifer.sensibleHeatJm2,
    -initialOwners.deepSubsurface.sensibleHeatJm2,
    -initialOwners.vadose.sensibleHeatJm2,
    -initialOwners.aquifer.sensibleHeatJm2,
    -externalMatrixEntries.groundwaterAquiferJm2,
    -externalMatrixEntries.deepSoilSubsurfaceJm2,
    -externalMatrixEntries.surfaceSubsurfaceJm2
  ]);
  if (!nativeInternalTransferClosure.closed ||
      !aggregateOwnerClosure.closed) {
    throw new Error('Matrix thermal aggregate ledger does not close');
  }

  const receipt = {
    schema: LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA,
    stepId: String(context.stepId ||
      `${column.id}:matrix-thermal-aggregate:${ordinals[0]}`),
    stepOrdinal: ordinals[0],
    status: 'three-matrix-current-step-energy-reconciled',
    sources: {
      groundwaterAquifer: sourceBinding(
        LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA,
        groundwaterAquiferReceipt),
      deepSoilSubsurface: sourceBinding(
        LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
        deepSoilSubsurfaceReceipt),
      surfaceSubsurface: sourceBinding(
        LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
        surfaceSubsurfaceReceipt),
      nativeVadose: sourceBinding(
        LAND_NATIVE_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA,
        nativeVadoseReceipt)
    },
    initialOwners,
    externalMatrixEntries,
    nativeInternalEntries,
    finalOwners,
    nativeInternalTransferClosure,
    aggregateOwnerClosure,
    migrationInitialization: {
      sourceWasNoHistoryCheckpoint:
        column.land.matrixThermalAggregateMigrationCheckpoint === true,
      historicalHeatReconstructed: false
    },
    truth: {
      currentR80R81R82R85SourcesBound: true,
      exactSequentialOwnerChainBound: true,
      nativeVadoseTransfersInternalOnly: true,
      retiredDirectDeepAquiferTransferCounted: false,
      legacyCompatibilityEvidenceCounted: false,
      threeMatrixAggregateEnergyClosed: true,
      scaleAwareNumericClosure: true,
      measuredResidualsPreserved: true,
      fixedAbsoluteToleranceOnly: false,
      physicalOwnersMutatedByThisLedger: false,
      externalHeatSourceAdded: false,
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

export function matrixThermalAggregateDescription() {
  return {
    receiptSchema: LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA,
    closureSchema: LAND_MATRIX_THERMAL_AGGREGATE_CLOSURE_SCHEMA,
    closurePolicySchema:
      LAND_MATRIX_THERMAL_AGGREGATE_CLOSURE_POLICY_SCHEMA,
    sourceRungs: [80, 81, 82, 85],
    owners: ['deep-subsurface-matrix', 'vadose-matrix', 'aquifer-matrix'],
    closures: ['native-internal-transfer', 'three-matrix-aggregate-owner'],
    mutatesPhysicalOwners: false,
    countsRetiredDirectTransfer: false,
    countsLegacyCompatibilityEvidence: false,
    historicalHeatReconstructed: false,
    resolvedConductionClaimed: false,
    geothermalForcingModeled: false,
    scientificCalibrationClaimed: false,
    globalUnloadedBoundaryClaimed: false
  };
}
