import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_INTAKE_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_INTAKE_SLOT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_CANDIDATE_ITEM_SCHEMA
} from './matrix-thermal-historical-source-evidence-intake.mjs?v=0.99.0-r99.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_READINESS_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ACQUISITION_REQUEST_SCHEMA,
  landMatrixThermalHistoricalSourceEvidenceReadinessReceiptValid
} from './matrix-thermal-historical-source-evidence-readiness.mjs?v=0.99.0-r99.1';

const clone = value => JSON.parse(JSON.stringify(value));
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const exactKeys = (value, keys) => value && typeof value === 'object' &&
  exact(Object.keys(value).sort(), [...keys].sort());

function stableDigest(value) {
  const text = JSON.stringify(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function digestValid(receipt) {
  if (receipt?.schema !==
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_INTAKE_CONTRACT_RECEIPT_SCHEMA ||
      typeof receipt.digest !== 'string') return false;
  const unsigned = clone(receipt);
  delete unsigned.digest;
  return stableDigest(unsigned) === receipt.digest;
}

function expectedSlots(readiness) {
  return readiness.readinessRecords.flatMap(record =>
    record.acquisitionRequests.map(request => {
      const evidence = request.gapType === 'EVIDENCE';
      return {
        schema:
          LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_INTAKE_SLOT_SCHEMA,
        slotId: `historical-source-intake:${request.requestId}`,
        readinessRecordId: record.readinessRecordId,
        boundaryKey: record.boundaryKey,
        requirementKey: record.requirementKey,
        requirementShape: record.requirementShape,
        requestBinding: {
          requestSchema:
            LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ACQUISITION_REQUEST_SCHEMA,
          requestId: request.requestId,
          criterionKey: request.criterionKey,
          capabilityId: request.capabilityId,
          gapType: request.gapType,
          nativeEvidenceKind: request.nativeEvidenceKind,
          expectedArtifactKind: request.expectedArtifactKind
        },
        submissionChannel: evidence
          ? 'UNTRUSTED_CANDIDATE_EVIDENCE_ITEM'
          : 'MIKE_TOBI_OR_AXM_REVIEW_DECISION',
        candidateSubmissionAllowed: evidence,
        candidateItemSchema: evidence
          ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_CANDIDATE_ITEM_SCHEMA
          : null,
        candidateAssertionStatus: evidence ? 'CLAIMED_UNVERIFIED' : null,
        candidateCanGrantAuthority: false,
        requiresIndependentVerification: evidence,
        requiresMikeTobiOrAxmReview: !evidence,
        submittedCandidateItem: null,
        verificationVerdict: 'UNKNOWN',
        reviewDecision: null,
        admissionAuthorized: false
      };
    }));
}

function expectedSummary(slots) {
  return {
    sourceReadinessReceiptCount: 1,
    intakeSlotCount: 28,
    candidateEvidenceSubmissionSlotCount: slots.filter(slot =>
      slot.candidateSubmissionAllowed).length,
    authorityReviewSlotCount: slots.filter(slot =>
      slot.requiresMikeTobiOrAxmReview).length,
    submittedCandidateItemCount: 0,
    structurallyAcceptedCandidateItemCount: 0,
    verifiedEvidenceItemCount: 0,
    grantedAuthorityDecisionCount: 0,
    admittedHistoricalSourceCount: 0,
    admittedHistoricalDebitReceiptCount: 0,
    persistedCandidatePackageCount: 0,
    candidatePackageStructuralAssessmentImplemented: true,
    candidatePackagePersistenceImplemented: false,
    evidenceVerificationImplemented: false,
    candidateAdmissionPathImplemented: false,
    authorityGrantPathImplemented: false
  };
}

function result(status, detail) {
  return {
    id: 'land-matrix-thermal-historical-source-evidence-intake-contract',
    required: true,
    status,
    statement: 'Exact R98 gaps route to untrusted evidence-candidate or Mike/AXM review slots without persisting a candidate, verifying evidence, granting authority, or admitting a source.',
    detail
  };
}

export function auditLandMatrixThermalHistoricalSourceEvidenceIntakeContract(
  column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land
    ?.matrixThermalHistoricalSourceEvidenceIntakeContractReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalHistoricalSourceEvidenceIntakeContractMigrationCheckpoint ===
        true;
    return result(checkpoint ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'the source lineage does not retain an exact R98 readiness receipt'
        : 'a current loaded-land lineage is missing its R99 evidence-intake contract'
    });
  }
  const readiness = receipt.sourceReadiness;
  const attachedReadiness = column.land
    ?.matrixThermalHistoricalSourceEvidenceReadinessReceipt;
  const sourceIntegrity =
    landMatrixThermalHistoricalSourceEvidenceReadinessReceiptValid(
      readiness) && exact(readiness, attachedReadiness) &&
    receipt.source?.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_READINESS_RECEIPT_SCHEMA &&
    receipt.source?.receiptDigest === readiness?.digest;
  const slots = sourceIntegrity ? expectedSlots(readiness) : [];
  const slotsExact = sourceIntegrity && exact(receipt.intakeSlots, slots);
  const summaryExact = slotsExact &&
    exact(receipt.summary, expectedSummary(slots));
  const slotBoundaryIntact = receipt.intakeSlots?.length === 28 &&
    receipt.intakeSlots.filter(slot =>
      slot.candidateSubmissionAllowed).length === 24 &&
    receipt.intakeSlots.filter(slot =>
      slot.requiresMikeTobiOrAxmReview).length === 4 &&
    receipt.intakeSlots.every(slot =>
      slot.submittedCandidateItem === null &&
      slot.verificationVerdict === 'UNKNOWN' &&
      slot.reviewDecision === null &&
      slot.admissionAuthorized === false &&
      slot.candidateCanGrantAuthority === false);
  const truthValid = receipt.truth?.exactR98ReadinessBound === true &&
    receipt.truth?.allTwentyEightRequestsRouted === true &&
    receipt.truth?.candidateEvidenceStructuralIntakeImplemented === true &&
    receipt.truth?.candidatePackagesAreUntrustedData === true &&
    receipt.truth?.candidatePackagePersistenceImplemented === false &&
    receipt.truth?.evidenceContentLoadedOrExecuted === false &&
    receipt.truth?.evidenceVerified === false &&
    receipt.truth?.authoritySelfAttestationAccepted === false &&
    receipt.truth?.candidateAdmissionPathImplemented === false &&
    receipt.truth?.admissionAuthorityGranted === false &&
    receipt.truth?.historicalPhysicalSourceOwnersResolved === false &&
    receipt.truth?.historicalPhysicalSourceOwnersDebited === false &&
    receipt.truth?.crossBoundaryCardinalityInferencePerformed === false &&
    receipt.truth?.ownerMutationPerformed === false &&
    receipt.truth?.heatTransferPerformed === false &&
    receipt.truth?.historicalHeatReconstructed === false &&
    receipt.truth?.combinedPhysicalSourceGraphClaimed === false &&
    receipt.truth?.absoluteThermodynamicEnergyClaimed === false &&
    receipt.truth?.resolvedConductionClaimed === false &&
    receipt.truth?.geothermalForcingModeled === false &&
    receipt.truth?.scientificCalibrationClaimed === false &&
    receipt.truth?.globalUnloadedBoundaryClaimed === false;
  const persistenceBound = column.land
      ?.matrixThermalHistoricalSourceEvidenceIntakeContractMigrationCheckpoint ===
        false &&
    column.budget?.matrixThermalHistoricalSourceEvidenceIntakeContract
      ?.digest === receipt.digest;
  const structuralValid = digestValid(receipt) && sourceIntegrity &&
    exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
      'sourceReadiness', 'intakeSlots', 'summary', 'emission', 'truth',
      'digest']) &&
    exact(receipt.creationContext, readiness?.creationContext) &&
    slotsExact && summaryExact &&
    ['native-from-intact-r98-evidence-readiness',
      'migration-from-exact-retained-r98-evidence-readiness']
      .includes(receipt.emission?.mode) &&
    receipt.emission?.sourceWasExactRetainedEvidenceMigration ===
      receipt.emission?.mode.startsWith('migration-');
  const valid = structuralValid && slotBoundaryIntact && truthValid &&
    persistenceBound;
  return result(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt.schema || null,
    structuralValid,
    sourceIntegrity,
    slotsExact,
    summaryExact,
    slotBoundaryIntact,
    truthValid,
    persistenceBound,
    intakeSlotCount: receipt.summary?.intakeSlotCount ?? null,
    candidateEvidenceSubmissionSlotCount:
      receipt.summary?.candidateEvidenceSubmissionSlotCount ?? null,
    authorityReviewSlotCount:
      receipt.summary?.authorityReviewSlotCount ?? null,
    submittedCandidateItemCount:
      receipt.summary?.submittedCandidateItemCount ?? null,
    verifiedEvidenceItemCount:
      receipt.summary?.verifiedEvidenceItemCount ?? null,
    persistedCandidatePackageCount:
      receipt.summary?.persistedCandidatePackageCount ?? null,
    candidateAdmissionPathImplemented:
      receipt.summary?.candidateAdmissionPathImplemented ?? null
  });
}
