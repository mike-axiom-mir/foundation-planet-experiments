import {
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
} from './land-hydrology-thermal.mjs?v=0.92.0-r92.1';
import {
  LAND_MATRIX_THERMAL_SOURCE_OWNER_LEDGER_RECEIPT_SCHEMA,
  landMatrixThermalSourceOwnerLedgerReceiptValid
} from './matrix-thermal-source-owner-ledger.mjs?v=0.92.0-r92.1';
import {
  LAND_MATRIX_THERMAL_GENESIS_CONTINUITY_RECEIPT_SCHEMA,
  landMatrixThermalGenesisContinuityReceiptValid
} from './matrix-thermal-genesis-continuity.mjs?v=0.92.0-r92.1';

export const LAND_MATRIX_THERMAL_GENESIS_SOURCE_OWNER_CLOSURE_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-genesis-source-owner-closure-receipt/v1';
export const LAND_MATRIX_THERMAL_GENESIS_SOURCE_OWNER_CLOSURE_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-genesis-source-owner-closure/v1';
export const LAND_MATRIX_THERMAL_GENESIS_SOURCE_OWNER_CLOSURE_POLICY_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-genesis-source-owner-closure-policy/v1';

const NATIVE_EMISSION_MODE =
  'runtime-first-step-from-intact-r91-and-r89-evidence';
const MIGRATION_EMISSION_MODE =
  'migration-from-exact-retained-r91-and-r89-first-step-evidence';
const clone = value => JSON.parse(JSON.stringify(value));
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
  if (value?.schema !==
      LAND_MATRIX_THERMAL_GENESIS_SOURCE_OWNER_CLOSURE_RECEIPT_SCHEMA ||
      typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function sourceBinding(receipt) {
  return {
    schema: receipt.schema,
    receiptDigest: receipt.digest,
    stepOrdinal: 1
  };
}

function configuredFirstStepOwners(genesisContinuity, sourceOwnerLedger) {
  return {
    counterpartSources: clone(sourceOwnerLedger.initialOwners
      .counterpartSources),
    matrices: clone(genesisContinuity.ownerHandoff.configuredGenesisOwners)
  };
}

function ownerHeatValues(owners) {
  return [
    owners?.counterpartSources?.groundwaterWater?.sensibleHeatJm2,
    owners?.counterpartSources?.deepSoilWater?.sensibleHeatJm2,
    owners?.counterpartSources?.surfaceSensibleHeat?.sensibleHeatJm2,
    owners?.matrices?.deepSubsurface?.sensibleHeatJm2,
    owners?.matrices?.vadose?.sensibleHeatJm2,
    owners?.matrices?.aquifer?.sensibleHeatJm2
  ].map(Number);
}

function ownerTotal(owners) {
  const values = ownerHeatValues(owners);
  if (!values.every(Number.isFinite)) {
    throw new Error('Matrix genesis source-owner closure has a non-finite owner');
  }
  return values.reduce((sum, value) => sum + value, 0);
}

function closure(configuredInitialOwners, firstStepFinalOwners) {
  const signedOperands = [
    ...ownerHeatValues(firstStepFinalOwners),
    ...ownerHeatValues(configuredInitialOwners).map(value => -value)
  ];
  if (!signedOperands.every(Number.isFinite)) {
    throw new Error('Matrix genesis source-owner closure has a non-finite operand');
  }
  const residual = signedOperands.reduce((sum, value) => sum + value, 0);
  const scale = signedOperands.reduce((sum, value) =>
    sum + Math.abs(value), 0);
  const numericTolerance = round(Math.max(
    LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    scale * Number.EPSILON * LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
  ));
  return {
    schema: LAND_MATRIX_THERMAL_GENESIS_SOURCE_OWNER_CLOSURE_SCHEMA,
    policy: {
      schema: LAND_MATRIX_THERMAL_GENESIS_SOURCE_OWNER_CLOSURE_POLICY_SCHEMA,
      kind: 'energy',
      absoluteFloor: LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
      ulpFactor: LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
    },
    signedOperands,
    residual,
    numericTolerance,
    measuredResidualPreserved: true,
    closed: Math.abs(residual) <= numericTolerance
  };
}

export function landMatrixThermalGenesisSourceOwnerClosureReceiptValid(
  receipt) {
  if (!digestValid(receipt) ||
      !landMatrixThermalGenesisContinuityReceiptValid(
        receipt.sourceReceipts?.genesisContinuity) ||
      !landMatrixThermalSourceOwnerLedgerReceiptValid(
        receipt.sourceReceipts?.sourceOwnerLedger) ||
      receipt.sourceReceipts.sourceOwnerLedger.stepOrdinal !== 1 ||
      receipt.stepOrdinal !== 1 ||
      ![NATIVE_EMISSION_MODE, MIGRATION_EMISSION_MODE]
        .includes(receipt.emission?.mode)) return false;
  const genesisContinuity = receipt.sourceReceipts.genesisContinuity;
  const sourceOwnerLedger = receipt.sourceReceipts.sourceOwnerLedger;
  const configuredInitialOwners = configuredFirstStepOwners(
    genesisContinuity, sourceOwnerLedger);
  const firstStepInitialOwners = sourceOwnerLedger.initialOwners;
  const firstStepFinalOwners = sourceOwnerLedger.finalOwners;
  const expectedClosure = closure(configuredInitialOwners,
    firstStepFinalOwners);
  const migrationEmission = receipt.emission.mode === MIGRATION_EMISSION_MODE;
  return receipt.status ===
      'configured-genesis-through-first-runtime-step-expanded-owner-closure-bound' &&
    receipt.creationContext?.columnId ===
      genesisContinuity.creationContext.columnId &&
    receipt.creationContext?.seed === genesisContinuity.creationContext.seed &&
    receipt.creationContext?.initialDay ===
      genesisContinuity.creationContext.initialDay &&
    receipt.sources?.genesisContinuity?.schema ===
      LAND_MATRIX_THERMAL_GENESIS_CONTINUITY_RECEIPT_SCHEMA &&
    receipt.sources.genesisContinuity.receiptDigest ===
      genesisContinuity.digest &&
    receipt.sources?.sourceOwnerLedger?.schema ===
      LAND_MATRIX_THERMAL_SOURCE_OWNER_LEDGER_RECEIPT_SCHEMA &&
    receipt.sources.sourceOwnerLedger.receiptDigest ===
      sourceOwnerLedger.digest &&
    exact(genesisContinuity.ownerHandoff.firstStepInitialOwners,
      sourceOwnerLedger.initialOwners.matrices) &&
    exact(receipt.matrixHandoff?.configuredGenesisOwners,
      genesisContinuity.ownerHandoff.configuredGenesisOwners) &&
    exact(receipt.matrixHandoff?.firstStepInitialOwners,
      sourceOwnerLedger.initialOwners.matrices) &&
    receipt.matrixHandoff?.exact === true &&
    exact(receipt.configuredInitialOwners, configuredInitialOwners) &&
    exact(receipt.firstStepFinalOwners, firstStepFinalOwners) &&
    receipt.configuredInitialSensibleHeatJm2 ===
      ownerTotal(configuredInitialOwners) &&
    receipt.firstStepFinalSensibleHeatJm2 ===
      ownerTotal(firstStepFinalOwners) &&
    exact(receipt.expandedGenesisFirstStepClosure, expectedClosure) &&
    expectedClosure.closed === true &&
    receipt.emission?.sourceWasExactRetainedEvidenceMigration ===
      migrationEmission &&
    receipt.truth?.exactR91GenesisContinuityBound === true &&
    receipt.truth?.exactFirstStepR89SourceOwnerLedgerBound === true &&
    receipt.truth?.configuredMatrixGenesisToR89InitialOwnersExact === true &&
    receipt.truth?.expandedSixOwnerGenesisToFirstStepEnergyClosed === true &&
    receipt.truth?.counterpartSourcesBeginAtFirstRuntimeStep === true &&
    receipt.truth?.counterpartHistoricalInitializationProvenanceBound ===
      false &&
    receipt.truth?.ownerMutationPerformed === false &&
    receipt.truth?.heatTransferPerformed === false &&
    receipt.truth?.historicalPhysicalSourceOwnerResolved === false &&
    receipt.truth?.historicalPhysicalSourceOwnerDebited === false &&
    receipt.truth?.historicalHeatReconstructed === false &&
    receipt.truth?.absoluteThermodynamicEnergyClaimed === false &&
    receipt.truth?.resolvedConductionClaimed === false &&
    receipt.truth?.geothermalForcingModeled === false &&
    receipt.truth?.scientificCalibrationClaimed === false &&
    receipt.truth?.globalUnloadedBoundaryClaimed === false;
}

export function createLandMatrixThermalGenesisSourceOwnerClosureReceipt(
  column, genesisContinuityReceipt, sourceOwnerLedgerReceipt, context = {}) {
  if (column?.kind !== 'land') {
    throw new Error('Matrix genesis source-owner closure requires a land column');
  }
  if (!landMatrixThermalGenesisContinuityReceiptValid(
      genesisContinuityReceipt) ||
      !landMatrixThermalSourceOwnerLedgerReceiptValid(
        sourceOwnerLedgerReceipt)) {
    throw new Error('Matrix genesis source-owner closure requires intact R91 and R89 sources');
  }
  if (sourceOwnerLedgerReceipt.stepOrdinal !== 1) {
    throw new Error('Matrix genesis source-owner closure requires the first runtime source-owner ledger');
  }
  if (column.land?.matrixThermalGenesisContinuityReceipt?.digest !==
      genesisContinuityReceipt.digest ||
      column.land?.lastMatrixThermalSourceOwnerLedgerReceipt?.digest !==
        sourceOwnerLedgerReceipt.digest) {
    throw new Error('Matrix genesis source-owner closure sources are detached from the column');
  }
  if (genesisContinuityReceipt.creationContext?.columnId !== column.id ||
      genesisContinuityReceipt.creationContext?.seed !== column.seed ||
      !exact(genesisContinuityReceipt.ownerHandoff?.firstStepInitialOwners,
        sourceOwnerLedgerReceipt.initialOwners?.matrices)) {
    throw new Error('Matrix genesis source-owner closure owner handoff is detached');
  }
  const configuredInitialOwners = configuredFirstStepOwners(
    genesisContinuityReceipt, sourceOwnerLedgerReceipt);
  const firstStepFinalOwners = clone(sourceOwnerLedgerReceipt.finalOwners);
  const expandedGenesisFirstStepClosure = closure(configuredInitialOwners,
    firstStepFinalOwners);
  if (!expandedGenesisFirstStepClosure.closed) {
    throw new Error('Matrix genesis source-owner expanded ledger does not close');
  }
  const sourceWasExactRetainedEvidenceMigration =
    context.sourceWasExactRetainedEvidenceMigration === true;
  const receipt = {
    schema: LAND_MATRIX_THERMAL_GENESIS_SOURCE_OWNER_CLOSURE_RECEIPT_SCHEMA,
    status:
      'configured-genesis-through-first-runtime-step-expanded-owner-closure-bound',
    creationContext: {
      columnId: column.id,
      seed: column.seed,
      initialDay: genesisContinuityReceipt.creationContext.initialDay
    },
    stepOrdinal: 1,
    sources: {
      genesisContinuity: sourceBinding(genesisContinuityReceipt),
      sourceOwnerLedger: sourceBinding(sourceOwnerLedgerReceipt)
    },
    sourceReceipts: {
      genesisContinuity: clone(genesisContinuityReceipt),
      sourceOwnerLedger: clone(sourceOwnerLedgerReceipt)
    },
    matrixHandoff: {
      configuredGenesisOwners: clone(genesisContinuityReceipt.ownerHandoff
        .configuredGenesisOwners),
      firstStepInitialOwners: clone(sourceOwnerLedgerReceipt.initialOwners
        .matrices),
      exact: true
    },
    configuredInitialOwners,
    firstStepFinalOwners,
    configuredInitialSensibleHeatJm2: ownerTotal(configuredInitialOwners),
    firstStepFinalSensibleHeatJm2: ownerTotal(firstStepFinalOwners),
    expandedGenesisFirstStepClosure,
    emission: {
      mode: sourceWasExactRetainedEvidenceMigration
        ? MIGRATION_EMISSION_MODE : NATIVE_EMISSION_MODE,
      sourceWasExactRetainedEvidenceMigration
    },
    truth: {
      exactR91GenesisContinuityBound: true,
      exactFirstStepR89SourceOwnerLedgerBound: true,
      configuredMatrixGenesisToR89InitialOwnersExact: true,
      expandedSixOwnerGenesisToFirstStepEnergyClosed: true,
      counterpartSourcesBeginAtFirstRuntimeStep: true,
      counterpartHistoricalInitializationProvenanceBound: false,
      ownerMutationPerformed: false,
      heatTransferPerformed: false,
      historicalPhysicalSourceOwnerResolved: false,
      historicalPhysicalSourceOwnerDebited: false,
      historicalHeatReconstructed: false,
      absoluteThermodynamicEnergyClaimed: false,
      resolvedConductionClaimed: false,
      geothermalForcingModeled: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalGenesisSourceOwnerClosureReceiptValid(receipt)) {
    throw new Error('Matrix genesis source-owner closure receipt failed self-validation');
  }
  return receipt;
}

export function matrixThermalGenesisSourceOwnerClosureDescription() {
  return {
    schema: LAND_MATRIX_THERMAL_GENESIS_SOURCE_OWNER_CLOSURE_RECEIPT_SCHEMA,
    closureSchema: LAND_MATRIX_THERMAL_GENESIS_SOURCE_OWNER_CLOSURE_SCHEMA,
    closurePolicySchema:
      LAND_MATRIX_THERMAL_GENESIS_SOURCE_OWNER_CLOSURE_POLICY_SCHEMA,
    proves: [
      'exact R91 configured-genesis continuity receipt is retained',
      'exact first-step R89 expanded six-owner ledger is retained',
      'configured matrix owners equal the first-step R89 initial matrix owners',
      'configured matrix genesis plus first-step counterpart sources close through the first-step final six owners'
    ],
    counterpartHistoricalInitializationProvenanceBound: false,
    historicalPhysicalSourceOwnerResolved: false,
    historicalPhysicalSourceOwnerDebited: false,
    absoluteThermodynamicEnergyClaimed: false,
    mutatesState: false
  };
}
