import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_ENDOWMENT_REQUIREMENT_SCHEMA,
  MATRIX_INITIAL_ENDOWMENT_STATE_KEYS,
  landMatrixThermalHistoricalSourceRequirementsReceiptValid
} from './matrix-thermal-historical-source-requirements.mjs?v=0.96.0-r96.1';
import {
  LAND_MATRIX_THERMAL_INITIAL_ENDOWMENT_RECEIPT_SCHEMA
} from './matrix-thermal-initial-endowment.mjs?v=0.96.0-r96.1';

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

function expectedRequirement(source) {
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_ENDOWMENT_REQUIREMENT_SCHEMA,
    configuredEndowment: {
      initialStates: clone(source.initialStates),
      thermalCoordinate: clone(source.thermalCoordinate)
    },
    configuredEndowmentBinding: {
      sourceReceiptSchema:
        LAND_MATRIX_THERMAL_INITIAL_ENDOWMENT_RECEIPT_SCHEMA,
      sourceReceiptDigest: source.digest,
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

function result(status, detail) {
  return {
    id: 'land-matrix-thermal-historical-source-requirements',
    required: true,
    status,
    statement: 'The exact configured R90 three-matrix endowment has one unresolved historical-source and sender-debit evidence requirement without assumed source cardinality or invented physical authority.',
    detail
  };
}

export function auditLandMatrixThermalHistoricalSourceRequirements(column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land
    ?.matrixThermalHistoricalSourceRequirementsReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalHistoricalSourceRequirementsMigrationCheckpoint === true;
    return result(checkpoint ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'the source lineage does not retain an exact R90 configured matrix-endowment source'
        : 'a current loaded-land lineage is missing its matrix historical-source evidence requirement'
    });
  }
  const source = receipt.sourceReceipt;
  const sourceIntegrity = digestValid(source) &&
    receipt.source?.schema ===
      LAND_MATRIX_THERMAL_INITIAL_ENDOWMENT_RECEIPT_SCHEMA &&
    receipt.source?.receiptDigest === source?.digest &&
    column.land?.matrixThermalInitialEndowmentReceipt?.digest ===
      source?.digest;
  const requirementExact = exact(receipt.requirement,
    expectedRequirement(source));
  const evidenceBoundaryEmpty =
    receipt.requirement?.evidenceSlots?.historicalPhysicalSourceOwner ===
      null &&
    receipt.requirement?.evidenceSlots
      ?.historicalSourceOwnerDebitReceipt === null &&
    receipt.requirement?.resolutionStatus === 'UNRESOLVED' &&
    receipt.requirement?.physicalSourceOwnerCardinalityResolved === false &&
    receipt.requirement?.sourceOwnerDebitReceiptCardinalityResolved ===
      false &&
    Object.values(receipt.requirement?.admissionCriteria || {})
      .every(value => value === false);
  const summaryExact = exact(receipt.summary, {
    configuredMatrixOwnerCount: 3,
    requiredEndowmentEvidenceBundleCount: 1,
    admittedHistoricalPhysicalSourceEvidenceBundleCount: 0,
    admittedHistoricalSourceOwnerDebitEvidenceBundleCount: 0,
    unresolvedRequirementCount: 1,
    physicalSourceOwnerCardinalityResolved: false,
    sourceOwnerDebitReceiptCardinalityResolved: false,
    allRequirementsOutstanding: true
  });
  const truthValid =
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
    receipt.truth?.globalUnloadedBoundaryClaimed === false &&
    column.truth?.matrixThermalHistoricalSourceRequirementsDeclared ===
      true &&
    column.truth?.matrixThermalHistoricalPhysicalSourceOwnerResolved ===
      false &&
    column.truth?.matrixThermalHistoricalPhysicalSourceOwnerDebited === false;
  const persistenceBound = column.land
      ?.matrixThermalHistoricalSourceRequirementsMigrationCheckpoint ===
        false &&
    column.budget?.matrixThermalHistoricalSourceRequirements?.digest ===
      receipt.digest;
  const structuralValid =
    landMatrixThermalHistoricalSourceRequirementsReceiptValid(receipt);
  const valid = receipt.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_RECEIPT_SCHEMA &&
    structuralValid && sourceIntegrity && requirementExact &&
    evidenceBoundaryEmpty && summaryExact && truthValid && persistenceBound;
  return result(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt.schema || null,
    structuralValid,
    sourceIntegrity,
    requirementExact,
    evidenceBoundaryEmpty,
    summaryExact,
    truthValid,
    persistenceBound,
    configuredStateKeys: [...MATRIX_INITIAL_ENDOWMENT_STATE_KEYS],
    physicalSourceOwnerCardinalityResolved: false,
    sourceOwnerDebitReceiptCardinalityResolved: false,
    historicalPhysicalSourceOwnerResolved: false,
    historicalPhysicalSourceOwnerDebited: false
  });
}
