import {
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
} from './land-hydrology-thermal.mjs?v=0.91.0-r91.1';
import {
  LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA
} from './matrix-thermal-aggregate.mjs?v=0.91.0-r91.1';
import {
  LAND_MATRIX_THERMAL_INITIAL_ENDOWMENT_RECEIPT_SCHEMA
} from './matrix-thermal-initial-endowment.mjs?v=0.91.0-r91.1';
import {
  LAND_MATRIX_THERMAL_GENESIS_CONTINUITY_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_GENESIS_CONTINUITY_CLOSURE_SCHEMA,
  LAND_MATRIX_THERMAL_GENESIS_CONTINUITY_CLOSURE_POLICY_SCHEMA
} from './matrix-thermal-genesis-continuity.mjs?v=0.91.0-r91.1';

const clone = value => JSON.parse(JSON.stringify(value));
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);
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

function genesisOwners(initialEndowment) {
  return {
    deepSubsurface: clone(initialEndowment?.initialStates
      ?.deepSubsurface?.owner || null),
    vadose: clone(initialEndowment?.initialStates?.vadose?.owner || null),
    aquifer: clone(initialEndowment?.initialStates?.aquifer?.owner || null)
  };
}

function aggregateHeat(owners) {
  const values = [owners?.deepSubsurface?.sensibleHeatJm2,
    owners?.vadose?.sensibleHeatJm2,
    owners?.aquifer?.sensibleHeatJm2].map(Number);
  return values.every(Number.isFinite)
    ? values.reduce((sum, value) => sum + value, 0) : null;
}

function expectedClosure(configuredOwners, firstStepInitialOwners) {
  const signedOperands = [
    firstStepInitialOwners?.deepSubsurface?.sensibleHeatJm2,
    firstStepInitialOwners?.vadose?.sensibleHeatJm2,
    firstStepInitialOwners?.aquifer?.sensibleHeatJm2,
    -Number(configuredOwners?.deepSubsurface?.sensibleHeatJm2),
    -Number(configuredOwners?.vadose?.sensibleHeatJm2),
    -Number(configuredOwners?.aquifer?.sensibleHeatJm2)
  ].map(Number);
  if (!signedOperands.every(Number.isFinite)) return null;
  const residual = signedOperands.reduce((sum, value) => sum + value, 0);
  const scale = signedOperands.reduce((sum, value) =>
    sum + Math.abs(value), 0);
  const numericTolerance = round(Math.max(
    LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    scale * Number.EPSILON * LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
  ));
  return {
    schema: LAND_MATRIX_THERMAL_GENESIS_CONTINUITY_CLOSURE_SCHEMA,
    policy: {
      schema: LAND_MATRIX_THERMAL_GENESIS_CONTINUITY_CLOSURE_POLICY_SCHEMA,
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
    id: 'land-matrix-thermal-genesis-to-first-step-continuity',
    required: true,
    status,
    statement: 'The configured R90 genesis owners hand off exactly to the R86 first-runtime-step initial owners with no unreceipted owner delta, without resolving a historical physical source owner or debit.',
    detail
  };
}

export function auditLandMatrixThermalGenesisContinuity(column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land?.matrixThermalGenesisContinuityReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalGenesisContinuityMigrationCheckpoint === true;
    const awaiting = column.land
      ?.matrixThermalGenesisContinuityAwaitingFirstAggregate === true &&
      column.stepCount === 0;
    return result(checkpoint || awaiting ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'the source save does not retain both exact R90 genesis and R86 first-step aggregate evidence'
        : awaiting
          ? 'the intact R90 genesis source is awaiting its first runtime aggregate'
          : 'a stepped native v53 land column is missing its genesis-continuity receipt'
    });
  }
  const initialEndowment = receipt.sourceReceipts?.initialEndowment;
  const firstAggregate = receipt.sourceReceipts?.firstAggregate;
  const configuredOwners = genesisOwners(initialEndowment);
  const firstStepInitialOwners = clone(firstAggregate?.initialOwners || null);
  const closure = expectedClosure(configuredOwners, firstStepInitialOwners);
  const sourcesIntact =
    initialEndowment?.schema ===
      LAND_MATRIX_THERMAL_INITIAL_ENDOWMENT_RECEIPT_SCHEMA &&
    firstAggregate?.schema === LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA &&
    digestValid(initialEndowment) && digestValid(firstAggregate) &&
    firstAggregate?.stepOrdinal === 1;
  const sourceBindingsExact = sourcesIntact &&
    receipt.sources?.initialEndowment?.schema === initialEndowment.schema &&
    receipt.sources?.initialEndowment?.receiptDigest ===
      initialEndowment.digest &&
    receipt.sources?.firstAggregate?.schema === firstAggregate.schema &&
    receipt.sources?.firstAggregate?.receiptDigest === firstAggregate.digest;
  const creationContextBound =
    receipt.creationContext?.columnId === column.id &&
    receipt.creationContext?.columnId ===
      initialEndowment?.creationContext?.columnId &&
    receipt.creationContext?.seed === column.seed &&
    receipt.creationContext?.seed === initialEndowment?.creationContext?.seed &&
    finite(receipt.creationContext?.initialDay) &&
    receipt.creationContext?.initialDay ===
      initialEndowment?.creationContext?.initialDay &&
    receipt.firstRuntimeStepOrdinal === 1;
  const ownerHandoffExact = exact(configuredOwners,
    firstStepInitialOwners) &&
    exact(receipt.ownerHandoff?.configuredGenesisOwners, configuredOwners) &&
    exact(receipt.ownerHandoff?.firstStepInitialOwners,
      firstStepInitialOwners) && receipt.ownerHandoff?.exact === true;
  const totalsExact =
    receipt.configuredGenesisSensibleHeatJm2 ===
      aggregateHeat(configuredOwners) &&
    receipt.firstStepInitialSensibleHeatJm2 ===
      aggregateHeat(firstStepInitialOwners);
  const zeroGapBound =
    Array.isArray(receipt.unreceiptedIntervalEntries) &&
    receipt.unreceiptedIntervalEntries.length === 0 &&
    closure != null && exact(receipt.genesisContinuityClosure, closure) &&
    closure.closed === true;
  const emissionValid = [
    'runtime-first-step-from-intact-r90-endowment',
    'migration-from-exact-retained-r90-and-r86-sources'
  ].includes(receipt.emission?.mode) &&
    receipt.emission?.sourceWasExactRetainedEvidenceMigration ===
      (receipt.emission?.mode ===
        'migration-from-exact-retained-r90-and-r86-sources');
  const truthValid =
    receipt.truth?.configuredGenesisSourceBound === true &&
    receipt.truth?.firstRuntimeAggregateSourceBound === true &&
    receipt.truth?.genesisToFirstInitialOwnersExact === true &&
    receipt.truth?.zeroUnreceiptedOwnerDeltaAcrossInterval === true &&
    receipt.truth?.threeMatrixGenesisContinuityClosed === true &&
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
    column.truth?.matrixThermalGenesisToFirstStepOwnersExact === true &&
    column.truth?.matrixThermalGenesisContinuityEnergyClosed === true;
  const persistenceBound =
    column.land?.matrixThermalGenesisContinuityMigrationCheckpoint === false &&
    column.land?.matrixThermalGenesisContinuityAwaitingFirstAggregate ===
      false &&
    column.land?.matrixThermalInitialEndowmentReceipt?.digest ===
      initialEndowment?.digest &&
    column.budget?.matrixThermalGenesisContinuity?.digest === receipt.digest;
  const valid = receipt.schema ===
      LAND_MATRIX_THERMAL_GENESIS_CONTINUITY_RECEIPT_SCHEMA &&
    receipt.status ===
      'configured-genesis-to-first-runtime-step-continuity-bound' &&
    digestValid(receipt) && sourcesIntact && sourceBindingsExact &&
    creationContextBound && ownerHandoffExact && totalsExact && zeroGapBound &&
    emissionValid && truthValid && persistenceBound;
  return result(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt.schema || null,
    digestValid: digestValid(receipt),
    sourcesIntact,
    sourceBindingsExact,
    creationContextBound,
    ownerHandoffExact,
    totalsExact,
    zeroGapBound,
    emissionValid,
    truthValid,
    persistenceBound,
    closureResidualJm2: closure?.residual ?? null,
    closureToleranceJm2: closure?.numericTolerance ?? null,
    historicalPhysicalSourceOwnerResolved: false,
    historicalPhysicalSourceOwnerDebited: false
  });
}
