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
import {
  LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_AGGREGATE_CLOSURE_SCHEMA,
  LAND_MATRIX_THERMAL_AGGREGATE_CLOSURE_POLICY_SCHEMA,
  landMatrixThermalAggregateReceiptValid
} from './matrix-thermal-aggregate.mjs?v=0.86.0-r86.1';

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
  const valid = stored?.schema ===
      LAND_MATRIX_THERMAL_AGGREGATE_CLOSURE_SCHEMA &&
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
  return { valid, residual, numericTolerance };
}

function result(status, detail) {
  return {
    id: 'land-matrix-thermal-aggregate-owner-lineage',
    required: true,
    status,
    statement: 'The three persistent land matrix owners reconcile across exact current R80, R81, R82, and R85 evidence without counting the retired direct deep-aquifer path.',
    detail
  };
}

export function auditLandMatrixThermalAggregate(column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column?.land?.lastMatrixThermalAggregateReceipt;
  if (!receipt) {
    const checkpoint =
      column?.land?.matrixThermalAggregateMigrationCheckpoint === true;
    return result(column?.stepCount === 0 || checkpoint
      ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'v47-to-v48 migration preserves owners without inventing historical R86 evidence'
        : column?.stepCount === 0
          ? 'land column has not stepped yet'
          : 'a stepped current land column is missing the R86 aggregate receipt'
    });
  }

  const r80 = column?.land?.aquiferMatrixThermal?.lastStepReceipt;
  const r81 = column?.land?.deepSubsurfaceMatrixThermal?.lastStepReceipt;
  const r82 = column?.land?.lastSurfaceSubsurfaceMatrixThermalReceipt;
  const r85 = column?.land?.lastVadoseMatrixThermalReceipt;
  const sourceSchemasValid =
    r80?.schema ===
      LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    landGroundwaterAquiferMatrixThermalReceiptValid(r80) &&
    r81?.schema ===
      LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    landDeepSoilSubsurfaceMatrixThermalReceiptValid(r81) &&
    r82?.schema ===
      LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    landSurfaceSubsurfaceMatrixThermalReceiptValid(r82) &&
    r85?.schema === LAND_NATIVE_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA &&
    landNativeVadoseMatrixThermalReceiptValid(r85);
  const sourceBindingsValid = sourceSchemasValid &&
    receipt.sources?.groundwaterAquifer?.receiptDigest === r80.digest &&
    receipt.sources?.groundwaterAquifer?.stepId === r80.stepId &&
    receipt.sources?.deepSoilSubsurface?.receiptDigest === r81.digest &&
    receipt.sources?.deepSoilSubsurface?.stepId === r81.stepId &&
    receipt.sources?.surfaceSubsurface?.receiptDigest === r82.digest &&
    receipt.sources?.surfaceSubsurface?.stepId === r82.stepId &&
    receipt.sources?.nativeVadose?.receiptDigest === r85.digest &&
    receipt.sources?.nativeVadose?.stepId === r85.stepId;
  const ordinals = [r80, r81, r82, r85].map(item =>
    stepOrdinal(item?.stepId));
  const oneStepValid = ordinals.every(Number.isInteger) &&
    new Set(ordinals).size === 1 && receipt.stepOrdinal === ordinals[0];

  const ownerChainValid = sourceSchemasValid &&
    exact(r81.finalDeepSubsurfaceMatrixOwner,
      r82.initialDeepSubsurfaceMatrixOwner) &&
    exact(r82.finalDeepSubsurfaceMatrixOwner,
      r85.initialDeepSubsurfaceMatrixOwner) &&
    exact(r80.finalAquiferMatrixOwner,
      r85.initialAquiferMatrixOwner) &&
    exact(receipt.initialOwners?.deepSubsurface,
      r81.initialDeepSubsurfaceMatrixOwner) &&
    exact(receipt.initialOwners?.vadose,
      r85.initialVadoseMatrixOwner) &&
    exact(receipt.initialOwners?.aquifer,
      r80.initialAquiferMatrixOwner) &&
    exact(receipt.finalOwners?.deepSubsurface,
      r85.finalDeepSubsurfaceMatrixOwner) &&
    exact(receipt.finalOwners?.vadose,
      r85.finalVadoseMatrixOwner) &&
    exact(receipt.finalOwners?.aquifer,
      r85.finalAquiferMatrixOwner) &&
    exact(column?.land?.deepSubsurfaceMatrixThermal?.owner,
      receipt.finalOwners?.deepSubsurface) &&
    exact(column?.land?.vadoseMatrixThermal?.owner,
      receipt.finalOwners?.vadose) &&
    exact(column?.land?.aquiferMatrixThermal?.owner,
      receipt.finalOwners?.aquifer);

  const expectedExternal = {
    groundwaterAquiferJm2: Number(
      r80?.transfer?.signedAquiferMatrixOwnerHeatJm2),
    deepSoilSubsurfaceJm2: Number(
      r81?.transfer?.signedDeepSubsurfaceMatrixOwnerHeatJm2),
    surfaceSubsurfaceJm2: Number(
      r82?.transfer?.signedDeepSubsurfaceMatrixOwnerHeatJm2)
  };
  expectedExternal.totalJm2 =
    expectedExternal.groundwaterAquiferJm2 +
    expectedExternal.deepSoilSubsurfaceJm2 +
    expectedExternal.surfaceSubsurfaceJm2;
  const expectedInternal = {
    deepJm2: Number(r85?.transfers?.signedDeepOwnerHeatJm2),
    vadoseJm2: Number(r85?.transfers?.signedVadoseOwnerHeatJm2),
    aquiferJm2: Number(r85?.transfers?.signedAquiferOwnerHeatJm2)
  };
  const entriesValid = Object.keys(expectedExternal).every(key =>
    same(receipt.externalMatrixEntries?.[key], expectedExternal[key],
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J)) &&
    Object.keys(expectedInternal).every(key =>
      same(receipt.nativeInternalEntries?.[key], expectedInternal[key],
        LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J));

  const initial = receipt.initialOwners || {};
  const final = receipt.finalOwners || {};
  const closures = {
    nativeInternal: closureValid(receipt.nativeInternalTransferClosure, [
      expectedInternal.deepJm2,
      expectedInternal.vadoseJm2,
      expectedInternal.aquiferJm2
    ]),
    aggregate: closureValid(receipt.aggregateOwnerClosure, [
      final.deepSubsurface?.sensibleHeatJm2,
      final.vadose?.sensibleHeatJm2,
      final.aquifer?.sensibleHeatJm2,
      -Number(initial.deepSubsurface?.sensibleHeatJm2),
      -Number(initial.vadose?.sensibleHeatJm2),
      -Number(initial.aquifer?.sensibleHeatJm2),
      -expectedExternal.groundwaterAquiferJm2,
      -expectedExternal.deepSoilSubsurfaceJm2,
      -expectedExternal.surfaceSubsurfaceJm2
    ])
  };
  const closuresValid = Object.values(closures).every(item => item.valid);
  const truthValid =
    receipt.schema === LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA &&
    digestValid(receipt) && landMatrixThermalAggregateReceiptValid(receipt) &&
    column?.budget?.matrixThermalAggregate?.digest === receipt.digest &&
    column?.land?.matrixThermalAggregateMigrationCheckpoint === false &&
    column?.land?.lastDeepAquiferMatrixThermalReceipt == null &&
    column?.budget?.deepAquiferMatrixThermal == null &&
    receipt.truth?.currentR80R81R82R85SourcesBound === true &&
    receipt.truth?.exactSequentialOwnerChainBound === true &&
    receipt.truth?.nativeVadoseTransfersInternalOnly === true &&
    receipt.truth?.retiredDirectDeepAquiferTransferCounted === false &&
    receipt.truth?.legacyCompatibilityEvidenceCounted === false &&
    receipt.truth?.threeMatrixAggregateEnergyClosed === true &&
    receipt.truth?.physicalOwnersMutatedByThisLedger === false &&
    receipt.truth?.externalHeatSourceAdded === false &&
    receipt.truth?.historicalHeatReconstructed === false &&
    receipt.truth?.resolvedConductionClaimed === false &&
    receipt.truth?.geothermalForcingModeledByThisLedger === false &&
    receipt.truth?.scientificCalibrationClaimed === false &&
    receipt.truth?.globalUnloadedBoundaryClaimed === false &&
    column?.truth?.matrixThermalAggregateEnergyClosed === true &&
    column?.truth?.matrixThermalAggregateCountsRetiredDirectTransfer ===
      false;
  const valid = sourceBindingsValid && oneStepValid && ownerChainValid &&
    entriesValid && closuresValid && truthValid;
  return result(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt?.schema || null,
    sourceSchemasValid,
    sourceBindingsValid,
    oneStepValid,
    sourceStepOrdinals: ordinals,
    ownerChainValid,
    entriesValid,
    closures,
    retiredDirectTransferCounted: false,
    legacyCompatibilityEvidenceCounted: false,
    truthValid
  });
}
