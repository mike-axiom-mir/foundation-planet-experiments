import {
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
} from './land-hydrology-thermal.mjs?v=0.91.0-r91.1';
import {
  LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA,
  landMatrixThermalAggregateReceiptValid
} from './matrix-thermal-aggregate.mjs?v=0.91.0-r91.1';
import {
  LAND_MATRIX_THERMAL_INITIAL_ENDOWMENT_RECEIPT_SCHEMA,
  landMatrixThermalInitialEndowmentReceiptValid
} from './matrix-thermal-initial-endowment.mjs?v=0.91.0-r91.1';

export const LAND_MATRIX_THERMAL_GENESIS_CONTINUITY_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-genesis-continuity-receipt/v1';
export const LAND_MATRIX_THERMAL_GENESIS_CONTINUITY_CLOSURE_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-genesis-continuity-closure/v1';
export const LAND_MATRIX_THERMAL_GENESIS_CONTINUITY_CLOSURE_POLICY_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-genesis-continuity-closure-policy/v1';

const NATIVE_EMISSION_MODE = 'runtime-first-step-from-intact-r90-endowment';
const MIGRATION_EMISSION_MODE =
  'migration-from-exact-retained-r90-and-r86-sources';
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
  if (value?.schema !==
      LAND_MATRIX_THERMAL_GENESIS_CONTINUITY_RECEIPT_SCHEMA ||
      typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function sourceBinding(receipt) {
  return {
    schema: receipt.schema,
    receiptDigest: receipt.digest
  };
}

function genesisOwners(initialEndowmentReceipt) {
  return {
    deepSubsurface: clone(initialEndowmentReceipt.initialStates
      .deepSubsurface.owner),
    vadose: clone(initialEndowmentReceipt.initialStates.vadose.owner),
    aquifer: clone(initialEndowmentReceipt.initialStates.aquifer.owner)
  };
}

function aggregateHeat(owners) {
  return Number(owners.deepSubsurface.sensibleHeatJm2) +
    Number(owners.vadose.sensibleHeatJm2) +
    Number(owners.aquifer.sensibleHeatJm2);
}

function closure(configuredOwners, firstStepInitialOwners) {
  const signedOperands = [
    Number(firstStepInitialOwners.deepSubsurface.sensibleHeatJm2),
    Number(firstStepInitialOwners.vadose.sensibleHeatJm2),
    Number(firstStepInitialOwners.aquifer.sensibleHeatJm2),
    -Number(configuredOwners.deepSubsurface.sensibleHeatJm2),
    -Number(configuredOwners.vadose.sensibleHeatJm2),
    -Number(configuredOwners.aquifer.sensibleHeatJm2)
  ];
  if (!signedOperands.every(Number.isFinite)) {
    throw new Error('Matrix genesis continuity has a non-finite owner');
  }
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

export function landMatrixThermalGenesisContinuityReceiptValid(receipt) {
  if (!digestValid(receipt) ||
      !landMatrixThermalInitialEndowmentReceiptValid(
        receipt.sourceReceipts?.initialEndowment) ||
      !landMatrixThermalAggregateReceiptValid(
        receipt.sourceReceipts?.firstAggregate) ||
      receipt.sourceReceipts.firstAggregate.stepOrdinal !== 1 ||
      receipt.firstRuntimeStepOrdinal !== 1 ||
      ![NATIVE_EMISSION_MODE, MIGRATION_EMISSION_MODE]
        .includes(receipt.emission?.mode)) return false;
  const initialEndowment = receipt.sourceReceipts.initialEndowment;
  const firstAggregate = receipt.sourceReceipts.firstAggregate;
  const configuredOwners = genesisOwners(initialEndowment);
  const firstStepInitialOwners = firstAggregate.initialOwners;
  const expectedClosure = closure(configuredOwners, firstStepInitialOwners);
  const migrationEmission = receipt.emission.mode === MIGRATION_EMISSION_MODE;
  return receipt.status ===
      'configured-genesis-to-first-runtime-step-continuity-bound' &&
    receipt.creationContext?.columnId ===
      initialEndowment.creationContext.columnId &&
    receipt.creationContext?.seed === initialEndowment.creationContext.seed &&
    receipt.creationContext?.initialDay ===
      initialEndowment.creationContext.initialDay &&
    receipt.sources?.initialEndowment?.schema ===
      LAND_MATRIX_THERMAL_INITIAL_ENDOWMENT_RECEIPT_SCHEMA &&
    receipt.sources.initialEndowment.receiptDigest ===
      initialEndowment.digest &&
    receipt.sources?.firstAggregate?.schema ===
      LAND_MATRIX_THERMAL_AGGREGATE_RECEIPT_SCHEMA &&
    receipt.sources.firstAggregate.receiptDigest === firstAggregate.digest &&
    exact(receipt.ownerHandoff?.configuredGenesisOwners, configuredOwners) &&
    exact(receipt.ownerHandoff?.firstStepInitialOwners,
      firstStepInitialOwners) &&
    receipt.ownerHandoff?.exact === true &&
    exact(configuredOwners, firstStepInitialOwners) &&
    receipt.configuredGenesisSensibleHeatJm2 ===
      aggregateHeat(configuredOwners) &&
    receipt.firstStepInitialSensibleHeatJm2 ===
      aggregateHeat(firstStepInitialOwners) &&
    Array.isArray(receipt.unreceiptedIntervalEntries) &&
    receipt.unreceiptedIntervalEntries.length === 0 &&
    exact(receipt.genesisContinuityClosure, expectedClosure) &&
    expectedClosure.closed === true &&
    receipt.emission?.sourceWasExactRetainedEvidenceMigration ===
      migrationEmission &&
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
    receipt.truth?.globalUnloadedBoundaryClaimed === false;
}

export function createLandMatrixThermalGenesisContinuityReceipt(column,
  initialEndowmentReceipt, firstAggregateReceipt, context = {}) {
  if (column?.kind !== 'land') {
    throw new Error('Matrix genesis continuity requires a land column');
  }
  if (!landMatrixThermalInitialEndowmentReceiptValid(
      initialEndowmentReceipt) ||
      !landMatrixThermalAggregateReceiptValid(firstAggregateReceipt)) {
    throw new Error('Matrix genesis continuity requires intact R90 and R86 sources');
  }
  if (firstAggregateReceipt.stepOrdinal !== 1) {
    throw new Error('Matrix genesis continuity requires the first runtime aggregate');
  }
  if (column.land?.matrixThermalInitialEndowmentReceipt?.digest !==
      initialEndowmentReceipt.digest ||
      column.land?.lastMatrixThermalAggregateReceipt?.digest !==
        firstAggregateReceipt.digest) {
    throw new Error('Matrix genesis continuity sources are detached from the column');
  }
  if (initialEndowmentReceipt.creationContext?.columnId !== column.id ||
      initialEndowmentReceipt.creationContext?.seed !== column.seed) {
    throw new Error('Matrix genesis continuity creation context is detached');
  }
  const configuredOwners = genesisOwners(initialEndowmentReceipt);
  const firstStepInitialOwners = clone(firstAggregateReceipt.initialOwners);
  if (!exact(configuredOwners, firstStepInitialOwners)) {
    throw new Error('Matrix genesis owners do not match first-step initial owners');
  }
  const genesisContinuityClosure = closure(configuredOwners,
    firstStepInitialOwners);
  if (!genesisContinuityClosure.closed) {
    throw new Error('Matrix genesis continuity energy ledger does not close');
  }
  const sourceWasExactRetainedEvidenceMigration =
    context.sourceWasExactRetainedEvidenceMigration === true;
  const receipt = {
    schema: LAND_MATRIX_THERMAL_GENESIS_CONTINUITY_RECEIPT_SCHEMA,
    status: 'configured-genesis-to-first-runtime-step-continuity-bound',
    creationContext: {
      columnId: column.id,
      seed: column.seed,
      initialDay: initialEndowmentReceipt.creationContext.initialDay
    },
    firstRuntimeStepOrdinal: 1,
    sources: {
      initialEndowment: sourceBinding(initialEndowmentReceipt),
      firstAggregate: sourceBinding(firstAggregateReceipt)
    },
    sourceReceipts: {
      initialEndowment: clone(initialEndowmentReceipt),
      firstAggregate: clone(firstAggregateReceipt)
    },
    ownerHandoff: {
      configuredGenesisOwners: configuredOwners,
      firstStepInitialOwners,
      exact: true
    },
    configuredGenesisSensibleHeatJm2: aggregateHeat(configuredOwners),
    firstStepInitialSensibleHeatJm2: aggregateHeat(firstStepInitialOwners),
    unreceiptedIntervalEntries: [],
    genesisContinuityClosure,
    emission: {
      mode: sourceWasExactRetainedEvidenceMigration
        ? MIGRATION_EMISSION_MODE : NATIVE_EMISSION_MODE,
      sourceWasExactRetainedEvidenceMigration
    },
    truth: {
      configuredGenesisSourceBound: true,
      firstRuntimeAggregateSourceBound: true,
      genesisToFirstInitialOwnersExact: true,
      zeroUnreceiptedOwnerDeltaAcrossInterval: true,
      threeMatrixGenesisContinuityClosed: true,
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
  if (!landMatrixThermalGenesisContinuityReceiptValid(receipt)) {
    throw new Error('Matrix genesis continuity receipt failed self-validation');
  }
  return receipt;
}

export function matrixThermalGenesisContinuityDescription() {
  return {
    schema: LAND_MATRIX_THERMAL_GENESIS_CONTINUITY_RECEIPT_SCHEMA,
    closureSchema: LAND_MATRIX_THERMAL_GENESIS_CONTINUITY_CLOSURE_SCHEMA,
    closurePolicySchema:
      LAND_MATRIX_THERMAL_GENESIS_CONTINUITY_CLOSURE_POLICY_SCHEMA,
    proves: [
      'exact R90 configured genesis source receipt is retained',
      'exact R86 first-runtime-step aggregate source receipt is retained',
      'all three configured genesis owners equal first-step initial owners',
      'the genesis-to-first-step interval has zero unreceipted owner delta'
    ],
    historicalPhysicalSourceOwnerResolved: false,
    historicalPhysicalSourceOwnerDebited: false,
    absoluteThermodynamicEnergyClaimed: false,
    mutatesState: false
  };
}
