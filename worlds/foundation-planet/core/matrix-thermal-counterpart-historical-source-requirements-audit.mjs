import {
  LAND_MATRIX_THERMAL_COUNTERPART_HISTORICAL_SOURCE_REQUIREMENTS_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_COUNTERPART_HISTORICAL_SOURCE_OWNER_REQUIREMENT_SCHEMA,
  COUNTERPART_HISTORICAL_SOURCE_OWNER_KEYS,
  landMatrixThermalCounterpartHistoricalSourceRequirementsReceiptValid
} from './matrix-thermal-counterpart-historical-source-requirements.mjs?v=0.95.0-r95.1';
import {
  LAND_MATRIX_THERMAL_COUNTERPART_INITIAL_ENDOWMENT_RECEIPT_SCHEMA
} from './matrix-thermal-counterpart-initial-endowment.mjs?v=0.95.0-r95.1';

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
  if (!value || typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function expectedRequirement(ownerKey, owner, sourceReceipt) {
  return {
    schema:
      LAND_MATRIX_THERMAL_COUNTERPART_HISTORICAL_SOURCE_OWNER_REQUIREMENT_SCHEMA,
    ownerKey,
    configuredOwner: clone(owner),
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

function result(status, detail) {
  return {
    id: 'land-matrix-thermal-counterpart-historical-source-requirements',
    required: true,
    status,
    statement: 'Each configured R93 counterpart owner has an exact unresolved historical-source and sender-debit evidence requirement; no physical source, debit, or authority is invented.',
    detail
  };
}

export function
auditLandMatrixThermalCounterpartHistoricalSourceRequirements(column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land
    ?.matrixThermalCounterpartHistoricalSourceRequirementsReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalCounterpartHistoricalSourceRequirementsMigrationCheckpoint ===
        true;
    return result(checkpoint ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'the source lineage does not retain an exact R93 configured counterpart owner source'
        : 'a current loaded-land lineage is missing its historical-source evidence-requirements receipt'
    });
  }
  const source = receipt.sourceReceipt;
  const owners = source?.configuredOwners?.counterpartSources || {};
  const expectedRequirements = COUNTERPART_HISTORICAL_SOURCE_OWNER_KEYS
    .map(ownerKey => expectedRequirement(ownerKey, owners[ownerKey], source));
  const sourceIntegrity = digestValid(source) &&
    receipt.source?.schema ===
      LAND_MATRIX_THERMAL_COUNTERPART_INITIAL_ENDOWMENT_RECEIPT_SCHEMA &&
    receipt.source?.receiptDigest === source?.digest &&
    column.land?.matrixThermalCounterpartInitialEndowmentReceipt?.digest ===
      source?.digest;
  const requirementsExact = exact(receipt.requirements,
    expectedRequirements);
  const allEvidenceSlotsEmpty = Array.isArray(receipt.requirements) &&
    receipt.requirements.length === 3 && receipt.requirements.every(item =>
      item.evidenceSlots?.historicalPhysicalSourceOwner === null &&
      item.evidenceSlots?.historicalSourceOwnerDebitReceipt === null &&
      item.resolutionStatus === 'UNRESOLVED' &&
      Object.values(item.admissionCriteria || {}).every(value =>
        value === false));
  const summaryExact = exact(receipt.summary, {
    configuredOwnerCount: 3,
    requiredHistoricalPhysicalSourceOwnerCount: 3,
    requiredSourceOwnerDebitReceiptCount: 3,
    admittedHistoricalPhysicalSourceOwnerCount: 0,
    admittedSourceOwnerDebitReceiptCount: 0,
    unresolvedRequirementCount: 3,
    allRequirementsOutstanding: true
  });
  const truthValid =
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
    receipt.truth?.globalUnloadedBoundaryClaimed === false &&
    column.truth
      ?.matrixThermalCounterpartHistoricalSourceRequirementsDeclared === true &&
    column.truth
      ?.matrixThermalCounterpartHistoricalPhysicalSourceOwnersResolved ===
        false &&
    column.truth
      ?.matrixThermalCounterpartHistoricalPhysicalSourceOwnersDebited ===
        false;
  const persistenceBound = column.land
      ?.matrixThermalCounterpartHistoricalSourceRequirementsMigrationCheckpoint ===
        false &&
    column.budget
      ?.matrixThermalCounterpartHistoricalSourceRequirements?.digest ===
        receipt.digest;
  const structuralValid =
    landMatrixThermalCounterpartHistoricalSourceRequirementsReceiptValid(
      receipt);
  const valid = receipt.schema ===
      LAND_MATRIX_THERMAL_COUNTERPART_HISTORICAL_SOURCE_REQUIREMENTS_RECEIPT_SCHEMA &&
    structuralValid && sourceIntegrity && requirementsExact &&
    allEvidenceSlotsEmpty && summaryExact && truthValid && persistenceBound;
  return result(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt.schema || null,
    structuralValid,
    sourceIntegrity,
    requirementsExact,
    allEvidenceSlotsEmpty,
    summaryExact,
    truthValid,
    persistenceBound,
    configuredOwnerKeys: [...COUNTERPART_HISTORICAL_SOURCE_OWNER_KEYS],
    historicalPhysicalSourceOwnersResolved: false,
    historicalPhysicalSourceOwnersDebited: false
  });
}
