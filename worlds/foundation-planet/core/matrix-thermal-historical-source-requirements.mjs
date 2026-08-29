import {
  LAND_MATRIX_THERMAL_INITIAL_ENDOWMENT_RECEIPT_SCHEMA,
  landMatrixThermalInitialEndowmentReceiptValid
} from './matrix-thermal-initial-endowment.mjs?v=0.96.0-r96.1';

export const LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-historical-source-requirements-receipt/v1';
export const LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_ENDOWMENT_REQUIREMENT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-historical-source-endowment-requirement/v1';

export const MATRIX_INITIAL_ENDOWMENT_STATE_KEYS = Object.freeze([
  'deepSubsurface',
  'vadose',
  'aquifer'
]);

const NATIVE_EMISSION_MODE =
  'native-from-intact-r90-configured-matrix-endowment-source';
const MIGRATION_EMISSION_MODE =
  'migration-from-exact-retained-r90-configured-matrix-endowment-source';
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
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_RECEIPT_SCHEMA ||
      typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function expectedRequirement(sourceReceipt) {
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_ENDOWMENT_REQUIREMENT_SCHEMA,
    configuredEndowment: {
      initialStates: clone(sourceReceipt.initialStates),
      thermalCoordinate: clone(sourceReceipt.thermalCoordinate)
    },
    configuredEndowmentBinding: {
      sourceReceiptSchema:
        LAND_MATRIX_THERMAL_INITIAL_ENDOWMENT_RECEIPT_SCHEMA,
      sourceReceiptDigest: sourceReceipt.digest,
      statePaths: MATRIX_INITIAL_ENDOWMENT_STATE_KEYS.map(key =>
        `initialStates.${key}`),
      thermalCoordinatePath: 'thermalCoordinate'
    },
    evidenceSlots: {
      historicalPhysicalSourceOwner: null,
      historicalSourceOwnerDebitReceipt: null
    },
    admissionCriteria: {
      sourceOwnerStateBeforeEndowmentBound: false,
      independentSourceIdentityAndPhysicalScopeBound: false,
      compatibleEnergyCoordinateAndUnitsBound: false,
      senderDebitPreAndPostOwnerStatesBound: false,
      debitReceiverAllocationAcrossThreeMatrixOwnersBound: false,
      senderDebitAndThreeReceiverCreditsClosureBound: false,
      physicalMeaningAuthorityReviewed: false
    },
    missingEvidence: [
      'typed-persistent-source-owner-state-before-configured-matrix-endowment',
      'independent-source-owner-identity-and-physical-scope',
      'compatible-energy-coordinate-and-unit-declaration',
      'typed-sender-debit-with-exact-pre-and-post-owner-states',
      'receiver-allocation-bound-to-all-three-exact-r90-initial-states',
      'sender-debit-and-three-receiver-credit-closure',
      'declared-human-or-axm-physical-meaning-review'
    ],
    physicalSourceOwnerCardinalityResolved: false,
    sourceOwnerDebitReceiptCardinalityResolved: false,
    resolutionStatus: 'UNRESOLVED'
  };
}

function expectedSummary() {
  return {
    configuredMatrixOwnerCount: 3,
    requiredEndowmentEvidenceBundleCount: 1,
    admittedHistoricalPhysicalSourceEvidenceBundleCount: 0,
    admittedHistoricalSourceOwnerDebitEvidenceBundleCount: 0,
    unresolvedRequirementCount: 1,
    physicalSourceOwnerCardinalityResolved: false,
    sourceOwnerDebitReceiptCardinalityResolved: false,
    allRequirementsOutstanding: true
  };
}

export function
landMatrixThermalHistoricalSourceRequirementsReceiptValid(receipt) {
  if (!digestValid(receipt) ||
      !landMatrixThermalInitialEndowmentReceiptValid(
        receipt.sourceReceipt)) return false;
  const sourceReceipt = receipt.sourceReceipt;
  const migration = receipt.emission?.mode === MIGRATION_EMISSION_MODE;
  return receipt.status ===
      'matrix-endowment-historical-source-evidence-requirement-declared' &&
    receipt.creationContext?.columnId ===
      sourceReceipt.creationContext.columnId &&
    receipt.creationContext?.seed === sourceReceipt.creationContext.seed &&
    receipt.creationContext?.initialDay ===
      sourceReceipt.creationContext.initialDay &&
    receipt.source?.schema ===
      LAND_MATRIX_THERMAL_INITIAL_ENDOWMENT_RECEIPT_SCHEMA &&
    receipt.source?.receiptDigest === sourceReceipt.digest &&
    exact(receipt.requirement, expectedRequirement(sourceReceipt)) &&
    exact(receipt.summary, expectedSummary()) &&
    [NATIVE_EMISSION_MODE, MIGRATION_EMISSION_MODE]
      .includes(receipt.emission?.mode) &&
    receipt.emission.sourceWasExactRetainedEvidenceMigration === migration &&
    receipt.truth?.exactConfiguredMatrixEndowmentBound === true &&
    receipt.truth?.threeMatrixOwnerEvidenceRequirementDeclared === true &&
    receipt.truth?.historicalPhysicalSourceOwnerCandidatesProvided === false &&
    receipt.truth?.historicalSourceOwnerDebitReceiptsProvided === false &&
    receipt.truth?.historicalPhysicalSourceOwnerResolved === false &&
    receipt.truth?.historicalPhysicalSourceOwnerDebited === false &&
    receipt.truth?.physicalSourceOwnerCardinalityResolved === false &&
    receipt.truth?.sourceOwnerDebitReceiptCardinalityResolved === false &&
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

export function createLandMatrixThermalHistoricalSourceRequirementsReceipt(
  context, initialEndowmentReceipt, options = {}) {
  if (!landMatrixThermalInitialEndowmentReceiptValid(
      initialEndowmentReceipt) ||
      context?.columnId !== initialEndowmentReceipt.creationContext.columnId ||
      context?.seed !== initialEndowmentReceipt.creationContext.seed) {
    throw new Error('Matrix historical-source requirements need one intact attached R90 source');
  }
  const migration = options.sourceWasExactRetainedEvidenceMigration === true;
  const receipt = {
    schema: LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_RECEIPT_SCHEMA,
    status:
      'matrix-endowment-historical-source-evidence-requirement-declared',
    creationContext: {
      columnId: context.columnId,
      seed: context.seed,
      initialDay: initialEndowmentReceipt.creationContext.initialDay
    },
    source: {
      schema: LAND_MATRIX_THERMAL_INITIAL_ENDOWMENT_RECEIPT_SCHEMA,
      receiptDigest: initialEndowmentReceipt.digest
    },
    sourceReceipt: clone(initialEndowmentReceipt),
    requirement: expectedRequirement(initialEndowmentReceipt),
    summary: expectedSummary(),
    emission: {
      mode: migration ? MIGRATION_EMISSION_MODE : NATIVE_EMISSION_MODE,
      sourceWasExactRetainedEvidenceMigration: migration
    },
    truth: {
      exactConfiguredMatrixEndowmentBound: true,
      threeMatrixOwnerEvidenceRequirementDeclared: true,
      historicalPhysicalSourceOwnerCandidatesProvided: false,
      historicalSourceOwnerDebitReceiptsProvided: false,
      historicalPhysicalSourceOwnerResolved: false,
      historicalPhysicalSourceOwnerDebited: false,
      physicalSourceOwnerCardinalityResolved: false,
      sourceOwnerDebitReceiptCardinalityResolved: false,
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
  if (!landMatrixThermalHistoricalSourceRequirementsReceiptValid(receipt)) {
    throw new Error('Matrix historical-source requirements failed self-validation');
  }
  return receipt;
}

export function matrixThermalHistoricalSourceRequirementsDescription() {
  return {
    schema: LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_RECEIPT_SCHEMA,
    endowmentRequirementSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_ENDOWMENT_REQUIREMENT_SCHEMA,
    configuredStateKeys: [...MATRIX_INITIAL_ENDOWMENT_STATE_KEYS],
    requires: [
      'independently identified persistent physical source evidence existing before configured matrix endowment',
      'typed sender-debit evidence with exact pre-debit and post-debit owner state',
      'receiver allocation across the exact three R90 configured matrix owners and an independently reviewable closure',
      'declared human or AXM review of the proposed physical meaning'
    ],
    resolutionStatus: 'UNRESOLVED',
    physicalSourceOwnerCardinalityResolved: false,
    sourceOwnerDebitReceiptCardinalityResolved: false,
    historicalPhysicalSourceOwnerResolved: false,
    historicalPhysicalSourceOwnerDebited: false,
    inventsProvenance: false,
    mutatesState: false
  };
}
