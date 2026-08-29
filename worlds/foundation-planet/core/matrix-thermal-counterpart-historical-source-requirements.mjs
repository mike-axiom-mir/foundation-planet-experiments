import {
  LAND_MATRIX_THERMAL_COUNTERPART_INITIAL_ENDOWMENT_RECEIPT_SCHEMA,
  landMatrixThermalCounterpartInitialEndowmentReceiptValid
} from './matrix-thermal-counterpart-initial-endowment.mjs?v=0.95.0-r95.1';

export const
  LAND_MATRIX_THERMAL_COUNTERPART_HISTORICAL_SOURCE_REQUIREMENTS_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-counterpart-historical-source-requirements-receipt/v1';
export const
  LAND_MATRIX_THERMAL_COUNTERPART_HISTORICAL_SOURCE_OWNER_REQUIREMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-counterpart-historical-source-owner-requirement/v1';

export const COUNTERPART_HISTORICAL_SOURCE_OWNER_KEYS = Object.freeze([
  'groundwaterWater',
  'deepSoilWater',
  'surfaceSensibleHeat'
]);

const NATIVE_EMISSION_MODE =
  'native-from-intact-r93-configured-counterpart-owner-source';
const MIGRATION_EMISSION_MODE =
  'migration-from-exact-retained-r93-configured-counterpart-owner-source';
const clone = value => JSON.parse(JSON.stringify(value));
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);

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
      LAND_MATRIX_THERMAL_COUNTERPART_HISTORICAL_SOURCE_REQUIREMENTS_RECEIPT_SCHEMA ||
      typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function requirement(ownerKey, configuredOwner, sourceReceipt) {
  return {
    schema:
      LAND_MATRIX_THERMAL_COUNTERPART_HISTORICAL_SOURCE_OWNER_REQUIREMENT_SCHEMA,
    ownerKey,
    configuredOwner: clone(configuredOwner),
    configuredOwnerBinding: {
      sourceReceiptSchema:
        LAND_MATRIX_THERMAL_COUNTERPART_INITIAL_ENDOWMENT_RECEIPT_SCHEMA,
      sourceReceiptDigest: sourceReceipt.digest,
      ownerPath: `configuredOwners.counterpartSources.${ownerKey}`
    },
    evidenceSlots: {
      historicalPhysicalSourceOwner: null,
      historicalSourceOwnerDebitReceipt: null
    },
    admissionCriteria: {
      sourceOwnerStateBeforeEndowmentBound: false,
      independentSourceIdentityAndScopeBound: false,
      compatibleEnergyCoordinateAndUnitsBound: false,
      senderDebitPreAndPostOwnerStatesBound: false,
      debitReceiverConfiguredOwnerBound: false,
      senderDebitAndReceiverCreditClosureBound: false,
      physicalMeaningAuthorityReviewed: false
    },
    missingEvidence: [
      'typed-persistent-source-owner-state-before-configured-endowment',
      'independent-source-owner-identity-and-physical-scope',
      'compatible-energy-coordinate-and-unit-declaration',
      'typed-sender-debit-with-exact-pre-and-post-owner-states',
      'receiver-credit-bound-to-this-exact-configured-owner',
      'sender-debit-and-receiver-credit-closure',
      'declared-human-or-axm-physical-meaning-review'
    ],
    resolutionStatus: 'UNRESOLVED'
  };
}

function expectedRequirements(sourceReceipt) {
  const owners = sourceReceipt.configuredOwners.counterpartSources;
  return COUNTERPART_HISTORICAL_SOURCE_OWNER_KEYS.map(ownerKey =>
    requirement(ownerKey, owners[ownerKey], sourceReceipt));
}

function expectedSummary() {
  return {
    configuredOwnerCount: 3,
    requiredHistoricalPhysicalSourceOwnerCount: 3,
    requiredSourceOwnerDebitReceiptCount: 3,
    admittedHistoricalPhysicalSourceOwnerCount: 0,
    admittedSourceOwnerDebitReceiptCount: 0,
    unresolvedRequirementCount: 3,
    allRequirementsOutstanding: true
  };
}

export function
landMatrixThermalCounterpartHistoricalSourceRequirementsReceiptValid(receipt) {
  if (!digestValid(receipt) ||
      !landMatrixThermalCounterpartInitialEndowmentReceiptValid(
        receipt.sourceReceipt)) return false;
  const sourceReceipt = receipt.sourceReceipt;
  const migration = receipt.emission?.mode === MIGRATION_EMISSION_MODE;
  return receipt.status ===
      'counterpart-historical-physical-source-evidence-requirements-declared' &&
    receipt.creationContext?.columnId ===
      sourceReceipt.creationContext.columnId &&
    receipt.creationContext?.seed === sourceReceipt.creationContext.seed &&
    receipt.creationContext?.initialDay ===
      sourceReceipt.creationContext.initialDay &&
    receipt.source?.schema ===
      LAND_MATRIX_THERMAL_COUNTERPART_INITIAL_ENDOWMENT_RECEIPT_SCHEMA &&
    receipt.source?.receiptDigest === sourceReceipt.digest &&
    exact(receipt.requirements, expectedRequirements(sourceReceipt)) &&
    exact(receipt.summary, expectedSummary()) &&
    [NATIVE_EMISSION_MODE, MIGRATION_EMISSION_MODE]
      .includes(receipt.emission?.mode) &&
    receipt.emission.sourceWasExactRetainedEvidenceMigration === migration &&
    receipt.truth?.exactConfiguredCounterpartOwnersBound === true &&
    receipt.truth?.threeOwnerEvidenceRequirementsDeclared === true &&
    receipt.truth?.historicalPhysicalSourceOwnerCandidatesProvided === false &&
    receipt.truth?.historicalSourceOwnerDebitReceiptsProvided === false &&
    receipt.truth?.historicalPhysicalSourceOwnersResolved === false &&
    receipt.truth?.historicalPhysicalSourceOwnersDebited === false &&
    receipt.truth?.allRequirementsOutstanding === true &&
    receipt.truth?.ownerMutationPerformed === false &&
    receipt.truth?.heatTransferPerformed === false &&
    receipt.truth?.historicalHeatReconstructed === false &&
    receipt.truth?.combinedSixOwnerGraphClaimed === false &&
    receipt.truth?.absoluteThermodynamicEnergyClaimed === false &&
    receipt.truth?.resolvedConductionClaimed === false &&
    receipt.truth?.geothermalForcingModeled === false &&
    receipt.truth?.scientificCalibrationClaimed === false &&
    receipt.truth?.globalUnloadedBoundaryClaimed === false;
}

export function
createLandMatrixThermalCounterpartHistoricalSourceRequirementsReceipt(
  context, counterpartInitialEndowmentReceipt, options = {}) {
  if (!landMatrixThermalCounterpartInitialEndowmentReceiptValid(
      counterpartInitialEndowmentReceipt) ||
      context?.columnId !==
        counterpartInitialEndowmentReceipt.creationContext.columnId ||
      context?.seed !== counterpartInitialEndowmentReceipt.creationContext.seed) {
    throw new Error('Counterpart historical-source requirements need one intact attached R93 source');
  }
  const migration = options.sourceWasExactRetainedEvidenceMigration === true;
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_COUNTERPART_HISTORICAL_SOURCE_REQUIREMENTS_RECEIPT_SCHEMA,
    status:
      'counterpart-historical-physical-source-evidence-requirements-declared',
    creationContext: {
      columnId: context.columnId,
      seed: context.seed,
      initialDay:
        counterpartInitialEndowmentReceipt.creationContext.initialDay
    },
    source: {
      schema:
        LAND_MATRIX_THERMAL_COUNTERPART_INITIAL_ENDOWMENT_RECEIPT_SCHEMA,
      receiptDigest: counterpartInitialEndowmentReceipt.digest
    },
    sourceReceipt: clone(counterpartInitialEndowmentReceipt),
    requirements: expectedRequirements(counterpartInitialEndowmentReceipt),
    summary: expectedSummary(),
    emission: {
      mode: migration ? MIGRATION_EMISSION_MODE : NATIVE_EMISSION_MODE,
      sourceWasExactRetainedEvidenceMigration: migration
    },
    truth: {
      exactConfiguredCounterpartOwnersBound: true,
      threeOwnerEvidenceRequirementsDeclared: true,
      historicalPhysicalSourceOwnerCandidatesProvided: false,
      historicalSourceOwnerDebitReceiptsProvided: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      allRequirementsOutstanding: true,
      ownerMutationPerformed: false,
      heatTransferPerformed: false,
      historicalHeatReconstructed: false,
      combinedSixOwnerGraphClaimed: false,
      absoluteThermodynamicEnergyClaimed: false,
      resolvedConductionClaimed: false,
      geothermalForcingModeled: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalCounterpartHistoricalSourceRequirementsReceiptValid(
      receipt)) {
    throw new Error('Counterpart historical-source requirements failed self-validation');
  }
  return receipt;
}

export function
matrixThermalCounterpartHistoricalSourceRequirementsDescription() {
  return {
    schema:
      LAND_MATRIX_THERMAL_COUNTERPART_HISTORICAL_SOURCE_REQUIREMENTS_RECEIPT_SCHEMA,
    ownerRequirementSchema:
      LAND_MATRIX_THERMAL_COUNTERPART_HISTORICAL_SOURCE_OWNER_REQUIREMENT_SCHEMA,
    ownerKeys: [...COUNTERPART_HISTORICAL_SOURCE_OWNER_KEYS],
    requiresPerOwner: [
      'an independently identified persistent physical source owner existing before configured endowment',
      'a typed sender-debit receipt with exact pre-debit and post-debit owner states',
      'a receiver binding to the exact configured R93 owner and an independently reviewable closure',
      'declared human or AXM review of the proposed physical meaning'
    ],
    resolutionStatus: 'UNRESOLVED',
    historicalPhysicalSourceOwnersResolved: false,
    historicalPhysicalSourceOwnersDebited: false,
    inventsProvenance: false,
    mutatesState: false
  };
}
