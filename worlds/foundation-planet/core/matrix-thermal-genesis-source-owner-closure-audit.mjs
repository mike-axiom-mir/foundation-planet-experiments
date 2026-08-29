import {
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
} from './land-hydrology-thermal.mjs?v=0.92.0-r92.1';
import {
  LAND_MATRIX_THERMAL_SOURCE_OWNER_LEDGER_RECEIPT_SCHEMA
} from './matrix-thermal-source-owner-ledger.mjs?v=0.92.0-r92.1';
import {
  LAND_MATRIX_THERMAL_GENESIS_CONTINUITY_RECEIPT_SCHEMA
} from './matrix-thermal-genesis-continuity.mjs?v=0.92.0-r92.1';
import {
  LAND_MATRIX_THERMAL_GENESIS_SOURCE_OWNER_CLOSURE_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_GENESIS_SOURCE_OWNER_CLOSURE_SCHEMA,
  LAND_MATRIX_THERMAL_GENESIS_SOURCE_OWNER_CLOSURE_POLICY_SCHEMA
} from './matrix-thermal-genesis-source-owner-closure.mjs?v=0.92.0-r92.1';

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
  if (!value || typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function configuredOwners(genesisContinuity, sourceOwnerLedger) {
  return {
    counterpartSources: clone(sourceOwnerLedger?.initialOwners
      ?.counterpartSources || null),
    matrices: clone(genesisContinuity?.ownerHandoff
      ?.configuredGenesisOwners || null)
  };
}

function ownerValues(owners) {
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
  const values = ownerValues(owners);
  return values.every(Number.isFinite)
    ? values.reduce((sum, value) => sum + value, 0) : null;
}

function expectedClosure(initialOwners, finalOwners) {
  const signedOperands = [
    ...ownerValues(finalOwners),
    ...ownerValues(initialOwners).map(value => -value)
  ];
  if (!signedOperands.every(Number.isFinite)) return null;
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

function result(status, detail) {
  return {
    id: 'land-matrix-thermal-configured-genesis-first-step-expanded-owner-closure',
    required: true,
    status,
    statement: 'Exact R91 configured matrix genesis and the exact first-step R89 six-owner ledger form one closed expanded owner graph without attributing historical physical source ownership.',
    detail
  };
}

export function auditLandMatrixThermalGenesisSourceOwnerClosure(column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land
    ?.matrixThermalGenesisSourceOwnerClosureReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalGenesisSourceOwnerClosureMigrationCheckpoint === true;
    const awaiting = column.land
      ?.matrixThermalGenesisSourceOwnerClosureAwaitingFirstLedger === true &&
      column.stepCount === 0;
    return result(checkpoint || awaiting ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'the source save does not retain exact first-step R91 and R89 evidence'
        : awaiting
          ? 'the intact configured genesis is awaiting its first runtime source-owner ledger'
          : 'a stepped native v54 land column is missing its genesis source-owner closure receipt'
    });
  }
  const genesisContinuity = receipt.sourceReceipts?.genesisContinuity;
  const sourceOwnerLedger = receipt.sourceReceipts?.sourceOwnerLedger;
  const initialOwners = configuredOwners(genesisContinuity,
    sourceOwnerLedger);
  const finalOwners = clone(sourceOwnerLedger?.finalOwners || null);
  const closure = expectedClosure(initialOwners, finalOwners);
  const sourcesIntact =
    genesisContinuity?.schema ===
      LAND_MATRIX_THERMAL_GENESIS_CONTINUITY_RECEIPT_SCHEMA &&
    sourceOwnerLedger?.schema ===
      LAND_MATRIX_THERMAL_SOURCE_OWNER_LEDGER_RECEIPT_SCHEMA &&
    digestValid(genesisContinuity) && digestValid(sourceOwnerLedger) &&
    sourceOwnerLedger?.stepOrdinal === 1;
  const sourceBindingsExact = sourcesIntact &&
    receipt.sources?.genesisContinuity?.schema ===
      genesisContinuity.schema &&
    receipt.sources?.genesisContinuity?.receiptDigest ===
      genesisContinuity.digest &&
    receipt.sources?.genesisContinuity?.stepOrdinal === 1 &&
    receipt.sources?.sourceOwnerLedger?.schema ===
      sourceOwnerLedger.schema &&
    receipt.sources?.sourceOwnerLedger?.receiptDigest ===
      sourceOwnerLedger.digest &&
    receipt.sources?.sourceOwnerLedger?.stepOrdinal === 1;
  const creationContextBound =
    receipt.creationContext?.columnId === column.id &&
    receipt.creationContext?.columnId ===
      genesisContinuity?.creationContext?.columnId &&
    receipt.creationContext?.seed === column.seed &&
    receipt.creationContext?.seed ===
      genesisContinuity?.creationContext?.seed &&
    Number.isFinite(Number(receipt.creationContext?.initialDay)) &&
    receipt.creationContext?.initialDay ===
      genesisContinuity?.creationContext?.initialDay &&
    receipt.stepOrdinal === 1;
  const matrixHandoffExact = exact(
    genesisContinuity?.ownerHandoff?.firstStepInitialOwners,
    sourceOwnerLedger?.initialOwners?.matrices) &&
    exact(receipt.matrixHandoff?.configuredGenesisOwners,
      genesisContinuity?.ownerHandoff?.configuredGenesisOwners) &&
    exact(receipt.matrixHandoff?.firstStepInitialOwners,
      sourceOwnerLedger?.initialOwners?.matrices) &&
    receipt.matrixHandoff?.exact === true;
  const ownerGraphExact = exact(receipt.configuredInitialOwners,
      initialOwners) &&
    exact(receipt.firstStepFinalOwners, finalOwners) &&
    receipt.configuredInitialSensibleHeatJm2 === ownerTotal(initialOwners) &&
    receipt.firstStepFinalSensibleHeatJm2 === ownerTotal(finalOwners);
  const closureExact = closure != null &&
    exact(receipt.expandedGenesisFirstStepClosure, closure) &&
    closure.closed === true;
  const emissionValid = [
    'runtime-first-step-from-intact-r91-and-r89-evidence',
    'migration-from-exact-retained-r91-and-r89-first-step-evidence'
  ].includes(receipt.emission?.mode) &&
    receipt.emission?.sourceWasExactRetainedEvidenceMigration ===
      (receipt.emission?.mode ===
        'migration-from-exact-retained-r91-and-r89-first-step-evidence');
  const truthValid =
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
    receipt.truth?.globalUnloadedBoundaryClaimed === false &&
    column.truth
      ?.matrixThermalGenesisSourceOwnerHandoffExact === true &&
    column.truth
      ?.matrixThermalGenesisSourceOwnerEnergyClosed === true;
  const persistenceBound =
    column.land
      ?.matrixThermalGenesisSourceOwnerClosureMigrationCheckpoint === false &&
    column.land
      ?.matrixThermalGenesisSourceOwnerClosureAwaitingFirstLedger === false &&
    column.land?.matrixThermalGenesisContinuityReceipt?.digest ===
      genesisContinuity?.digest &&
    column.budget?.matrixThermalGenesisSourceOwnerClosure?.digest ===
      receipt.digest;
  const valid = receipt.schema ===
      LAND_MATRIX_THERMAL_GENESIS_SOURCE_OWNER_CLOSURE_RECEIPT_SCHEMA &&
    receipt.status ===
      'configured-genesis-through-first-runtime-step-expanded-owner-closure-bound' &&
    digestValid(receipt) && sourcesIntact && sourceBindingsExact &&
    creationContextBound && matrixHandoffExact && ownerGraphExact &&
    closureExact && emissionValid && truthValid && persistenceBound;
  return result(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt.schema || null,
    digestValid: digestValid(receipt),
    sourcesIntact,
    sourceBindingsExact,
    creationContextBound,
    matrixHandoffExact,
    ownerGraphExact,
    closureExact,
    emissionValid,
    truthValid,
    persistenceBound,
    closureResidualJm2: closure?.residual ?? null,
    closureToleranceJm2: closure?.numericTolerance ?? null,
    counterpartHistoricalInitializationProvenanceBound: false,
    historicalPhysicalSourceOwnerResolved: false,
    historicalPhysicalSourceOwnerDebited: false
  });
}
