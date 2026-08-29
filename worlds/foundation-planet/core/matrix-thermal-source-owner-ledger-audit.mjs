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
import {
  LAND_MATRIX_THERMAL_SOURCE_OWNER_CLOSURE_SCHEMA,
  LAND_MATRIX_THERMAL_SOURCE_OWNER_CLOSURE_POLICY_SCHEMA,
  LAND_MATRIX_THERMAL_SOURCE_OWNER_LEDGER_RECEIPT_SCHEMA,
  landMatrixThermalSourceOwnerLedgerReceiptValid
} from './matrix-thermal-source-owner-ledger.mjs?v=0.89.0-r89.1';

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

function expectedClosure(signedOperands) {
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

function sourceReceiptValid(receipt, schema, validator) {
  return receipt?.schema === schema && validator(receipt) &&
    digestValid(receipt);
}

function result(status, detail) {
  return {
    id: 'land-matrix-thermal-expanded-source-owner-closure',
    required: true,
    status,
    statement: 'Current R80/R81/R82 matrix entries are paired with exact groundwater-water, deep-soil-water, and surface sensible-heat counterpart entries, and the expanded six-owner graph closes without added heat.',
    detail
  };
}

export function auditLandMatrixThermalSourceOwnerLedger(column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land?.lastMatrixThermalSourceOwnerLedgerReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalSourceOwnerLedgerMigrationCheckpoint === true;
    return result(column.stepCount <= 0 || checkpoint
      ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'v50-to-v51 migration preserves exact current evidence without inventing an R89 ledger'
        : column.stepCount <= 0
          ? 'no aggregate-producing land step has completed'
          : 'an eligible land column is missing its expanded source-owner ledger'
    });
  }
  const bundle = column.land?.lastMatrixThermalSourceBundle;
  const aggregate = column.land?.lastMatrixThermalAggregateReceipt;
  const sources = bundle?.sourceReceipts || {};
  const r80 = sources.groundwaterAquifer;
  const r81 = sources.deepSoilSubsurface;
  const r82 = sources.surfaceSubsurface;
  const r85 = sources.nativeVadose;
  const sourceReceiptsValid =
    sourceReceiptValid(r80,
      LAND_GROUNDWATER_AQUIFER_MATRIX_THERMAL_RECEIPT_SCHEMA,
      landGroundwaterAquiferMatrixThermalReceiptValid) &&
    sourceReceiptValid(r81,
      LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
      landDeepSoilSubsurfaceMatrixThermalReceiptValid) &&
    sourceReceiptValid(r82,
      LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
      landSurfaceSubsurfaceMatrixThermalReceiptValid) &&
    sourceReceiptValid(r85,
      LAND_NATIVE_VADOSE_MATRIX_THERMAL_RECEIPT_SCHEMA,
      landNativeVadoseMatrixThermalReceiptValid);
  const bundleValid = bundle?.schema ===
      LAND_MATRIX_THERMAL_SOURCE_BUNDLE_SCHEMA &&
    landMatrixThermalSourceBundleValid(bundle) && digestValid(bundle);
  const aggregateValid = aggregate?.schema ===
      LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA &&
    landMatrixThermalAggregateReceiptValid(aggregate) &&
    digestValid(aggregate);
  const ordinals = [r80, r81, r82, r85].map(item =>
    stepOrdinal(item?.stepId));
  const ordinalsExact = sourceReceiptsValid &&
    ordinals.every(Number.isInteger) && new Set(ordinals).size === 1 &&
    bundle?.stepOrdinal === ordinals[0] &&
    aggregate?.stepOrdinal === ordinals[0] &&
    receipt.stepOrdinal === ordinals[0];
  const bindingsExact = bundleValid && aggregateValid &&
    bundle.aggregateBinding?.receiptDigest === aggregate.digest &&
    bundle.aggregateBinding?.stepId === aggregate.stepId &&
    receipt.sources?.sourceBundle?.digest === bundle.digest &&
    receipt.sources.sourceBundle.stepOrdinal === bundle.stepOrdinal &&
    receipt.sources?.aggregate?.receiptDigest === aggregate.digest &&
    receipt.sources.aggregate.stepId === aggregate.stepId &&
    receipt.sources.aggregate.stepOrdinal === aggregate.stepOrdinal &&
    aggregate.sources?.groundwaterAquifer?.receiptDigest === r80?.digest &&
    aggregate.sources?.deepSoilSubsurface?.receiptDigest === r81?.digest &&
    aggregate.sources?.surfaceSubsurface?.receiptDigest === r82?.digest &&
    aggregate.sources?.nativeVadose?.receiptDigest === r85?.digest;
  const ownerChainExact = sourceReceiptsValid && aggregateValid &&
    exact(r81.finalDeepSubsurfaceMatrixOwner,
      r82.initialDeepSubsurfaceMatrixOwner) &&
    exact(r82.finalDeepSubsurfaceMatrixOwner,
      r85.initialDeepSubsurfaceMatrixOwner) &&
    exact(r80.finalAquiferMatrixOwner,
      r85.initialAquiferMatrixOwner);
  const initialOwners = sourceReceiptsValid && aggregateValid ? {
    counterpartSources: {
      groundwaterWater: r80.initialGroundwaterOwner,
      deepSoilWater: r81.initialDeepSoilOwner,
      surfaceSensibleHeat: r82.initialSurfaceOwner
    },
    matrices: aggregate.initialOwners
  } : null;
  const finalOwners = sourceReceiptsValid && aggregateValid ? {
    counterpartSources: {
      groundwaterWater: r80.finalGroundwaterOwner,
      deepSoilWater: r81.finalDeepSoilOwner,
      surfaceSensibleHeat: r82.finalSurfaceOwner
    },
    matrices: aggregate.finalOwners
  } : null;
  const counterpartEntries = sourceReceiptsValid ? {
    groundwaterWaterJm2: Number(
      r80.transfer.signedGroundwaterOwnerHeatJm2),
    deepSoilWaterJm2: Number(r81.transfer.signedDeepSoilOwnerHeatJm2),
    surfaceSensibleHeatJm2: Number(
      r82.transfer.signedSurfaceOwnerHeatJm2)
  } : null;
  if (counterpartEntries) {
    counterpartEntries.totalJm2 =
      counterpartEntries.groundwaterWaterJm2 +
      counterpartEntries.deepSoilWaterJm2 +
      counterpartEntries.surfaceSensibleHeatJm2;
  }
  const matrixEntries = aggregateValid
    ? aggregate.externalMatrixEntries : null;
  const nativeEntries = aggregateValid
    ? aggregate.nativeInternalEntries : null;
  const entriesExact = sourceReceiptsValid && aggregateValid &&
    matrixEntries.groundwaterAquiferJm2 ===
      r80.transfer.signedAquiferMatrixOwnerHeatJm2 &&
    matrixEntries.deepSoilSubsurfaceJm2 ===
      r81.transfer.signedDeepSubsurfaceMatrixOwnerHeatJm2 &&
    matrixEntries.surfaceSubsurfaceJm2 ===
      r82.transfer.signedDeepSubsurfaceMatrixOwnerHeatJm2 &&
    nativeEntries.deepJm2 === r85.transfers.signedDeepOwnerHeatJm2 &&
    nativeEntries.vadoseJm2 === r85.transfers.signedVadoseOwnerHeatJm2 &&
    nativeEntries.aquiferJm2 === r85.transfers.signedAquiferOwnerHeatJm2 &&
    exact(receipt.counterpartSourceEntries, counterpartEntries) &&
    exact(receipt.matrixExternalEntries, matrixEntries) &&
    exact(receipt.nativeInternalEntries, nativeEntries);
  const ownerDeltasExact = entriesExact && [
    [r80.finalGroundwaterOwner.sensibleHeatJm2 -
      r80.initialGroundwaterOwner.sensibleHeatJm2,
    counterpartEntries.groundwaterWaterJm2],
    [r80.finalAquiferMatrixOwner.sensibleHeatJm2 -
      r80.initialAquiferMatrixOwner.sensibleHeatJm2,
    matrixEntries.groundwaterAquiferJm2],
    [r81.finalDeepSoilOwner.sensibleHeatJm2 -
      r81.initialDeepSoilOwner.sensibleHeatJm2,
    counterpartEntries.deepSoilWaterJm2],
    [r81.finalDeepSubsurfaceMatrixOwner.sensibleHeatJm2 -
      r81.initialDeepSubsurfaceMatrixOwner.sensibleHeatJm2,
    matrixEntries.deepSoilSubsurfaceJm2],
    [r82.finalSurfaceOwner.sensibleHeatJm2 -
      r82.initialSurfaceOwner.sensibleHeatJm2,
    counterpartEntries.surfaceSensibleHeatJm2],
    [r82.finalDeepSubsurfaceMatrixOwner.sensibleHeatJm2 -
      r82.initialDeepSubsurfaceMatrixOwner.sensibleHeatJm2,
    matrixEntries.surfaceSubsurfaceJm2],
    [r85.finalDeepSubsurfaceMatrixOwner.sensibleHeatJm2 -
      r85.initialDeepSubsurfaceMatrixOwner.sensibleHeatJm2,
    nativeEntries.deepJm2],
    [r85.finalVadoseMatrixOwner.sensibleHeatJm2 -
      r85.initialVadoseMatrixOwner.sensibleHeatJm2,
    nativeEntries.vadoseJm2],
    [r85.finalAquiferMatrixOwner.sensibleHeatJm2 -
      r85.initialAquiferMatrixOwner.sensibleHeatJm2,
    nativeEntries.aquiferJm2]
  ].every(([delta, entry]) => same(delta, entry,
    LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J));
  const expectedClosures = entriesExact ? {
    paired: {
      groundwaterAquifer: expectedClosure([
        counterpartEntries.groundwaterWaterJm2,
        matrixEntries.groundwaterAquiferJm2
      ]),
      deepSoilSubsurface: expectedClosure([
        counterpartEntries.deepSoilWaterJm2,
        matrixEntries.deepSoilSubsurfaceJm2
      ]),
      surfaceSubsurface: expectedClosure([
        counterpartEntries.surfaceSensibleHeatJm2,
        matrixEntries.surfaceSubsurfaceJm2
      ])
    },
    native: expectedClosure([
      nativeEntries.deepJm2, nativeEntries.vadoseJm2,
      nativeEntries.aquiferJm2
    ]),
    counterpartAggregate: expectedClosure([
      counterpartEntries.totalJm2, matrixEntries.totalJm2
    ]),
    expanded: expectedClosure([
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
    ])
  } : null;
  const closuresExact = Boolean(expectedClosures) &&
    exact(receipt.pairedCounterpartClosures, expectedClosures.paired) &&
    exact(receipt.nativeInternalTransferClosure, expectedClosures.native) &&
    exact(receipt.counterpartAggregateClosure,
      expectedClosures.counterpartAggregate) &&
    exact(receipt.expandedSixOwnerClosure, expectedClosures.expanded) &&
    [...Object.values(expectedClosures.paired), expectedClosures.native,
      expectedClosures.counterpartAggregate, expectedClosures.expanded]
      .every(item => item.closed === true);
  const ownersExact = Boolean(initialOwners) && Boolean(finalOwners) &&
    exact(receipt.initialOwners, initialOwners) &&
    exact(receipt.finalOwners, finalOwners);
  const currentColumnBindingsExact = sourceReceiptsValid && aggregateValid &&
    exact(column.land?.hydrologyThermal?.reservoirs?.groundwater,
      r80.finalGroundwaterOwner) &&
    exact(column.land?.hydrologyThermal?.reservoirs?.deepSoil,
      r81.finalDeepSoilOwner) &&
    same(column.surface?.temperatureC, r82.finalSurfaceOwner.temperatureC) &&
    exact(column.land?.deepSubsurfaceMatrixThermal?.owner,
      aggregate.finalOwners.deepSubsurface) &&
    exact(column.land?.vadoseMatrixThermal?.owner,
      aggregate.finalOwners.vadose) &&
    exact(column.land?.aquiferMatrixThermal?.owner,
      aggregate.finalOwners.aquifer);
  const truthValid = receipt.schema ===
      LAND_MATRIX_THERMAL_SOURCE_OWNER_LEDGER_RECEIPT_SCHEMA &&
    landMatrixThermalSourceOwnerLedgerReceiptValid(receipt) &&
    digestValid(receipt) &&
    column.budget?.matrixThermalSourceOwnerLedger?.digest ===
      receipt.digest &&
    column.land?.matrixThermalSourceOwnerLedgerMigrationCheckpoint ===
      false &&
    receipt.truth?.currentR88SourceBundleBound === true &&
    receipt.truth?.exactR80R81R82R85ReceiptsBound === true &&
    receipt.truth?.currentSourceOwnerCounterpartsPaired === true &&
    receipt.truth?.allSourceAndMatrixOwnerDeltasExact === true &&
    receipt.truth?.expandedSixOwnerEnergyClosed === true &&
    receipt.truth?.physicalOwnersMutatedByThisLedger === false &&
    receipt.truth?.currentStepExternalHeatSourceAdded === false &&
    receipt.truth?.historicalInitialMatrixEndowmentSourceResolved === false &&
    receipt.truth?.historicalInitialMatrixEndowmentDebited === false &&
    receipt.truth?.historicalHeatReconstructed === false &&
    receipt.truth?.resolvedConductionClaimed === false &&
    receipt.truth?.geothermalForcingModeledByThisLedger === false &&
    receipt.truth?.scientificCalibrationClaimed === false &&
    receipt.truth?.globalUnloadedBoundaryClaimed === false &&
    column.truth?.matrixThermalSourceOwnerCounterpartsPaired === true &&
    column.truth?.matrixThermalExpandedSixOwnerEnergyClosed === true;
  const valid = sourceReceiptsValid && bundleValid && aggregateValid &&
    ordinalsExact && bindingsExact && ownerChainExact && entriesExact &&
    ownerDeltasExact && ownersExact && closuresExact &&
    currentColumnBindingsExact && truthValid;
  return result(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt.schema || null,
    sourceReceiptsValid,
    bundleValid,
    aggregateValid,
    ordinalsExact,
    bindingsExact,
    ownerChainExact,
    entriesExact,
    ownerDeltasExact,
    ownersExact,
    closuresExact,
    currentColumnBindingsExact,
    physicalOwnersMutated: false,
    historicalInitialMatrixEndowmentSourceResolved: false,
    historicalHeatReconstructed: false,
    truthValid
  });
}
