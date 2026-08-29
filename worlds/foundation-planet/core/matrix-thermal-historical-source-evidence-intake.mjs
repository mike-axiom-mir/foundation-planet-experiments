import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_READINESS_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ACQUISITION_REQUEST_SCHEMA,
  landMatrixThermalHistoricalSourceEvidenceReadinessReceiptValid
} from './matrix-thermal-historical-source-evidence-readiness.mjs?v=0.99.0-r99.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_INTAKE_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-evidence-intake-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_INTAKE_SLOT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-evidence-intake-slot/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_CANDIDATE_PACKAGE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-evidence-candidate-package/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_CANDIDATE_ITEM_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-evidence-candidate-item/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_STRUCTURAL_ASSESSMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-evidence-structural-assessment/v1';

const NATIVE_EMISSION_MODE =
  'native-from-intact-r98-evidence-readiness';
const MIGRATION_EMISSION_MODE =
  'migration-from-exact-retained-r98-evidence-readiness';
const CANDIDATE_ASSERTION_STATUS = 'CLAIMED_UNVERIFIED';
const UNKNOWN = 'UNKNOWN';
const NOT_AUTHORIZED = 'NOT_AUTHORIZED';
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

function digestValid(value, schema) {
  if (value?.schema !== schema || typeof value.digest !== 'string') {
    return false;
  }
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function nonEmptyText(value, maximum = 2048) {
  return typeof value === 'string' && value.trim().length > 0 &&
    value.length <= maximum;
}

function isoTimestamp(value) {
  return nonEmptyText(value, 64) && Number.isFinite(Date.parse(value));
}

function sha256Digest(value) {
  return typeof value === 'string' && /^sha256:[a-f0-9]{64}$/.test(value);
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
        candidateAssertionStatus: evidence
          ? CANDIDATE_ASSERTION_STATUS : null,
        candidateCanGrantAuthority: false,
        requiresIndependentVerification: evidence,
        requiresMikeTobiOrAxmReview: !evidence,
        submittedCandidateItem: null,
        verificationVerdict: UNKNOWN,
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

export function
landMatrixThermalHistoricalSourceEvidenceIntakeContractReceiptValid(receipt) {
  const readiness = receipt?.sourceReadiness;
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_INTAKE_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
        'sourceReadiness', 'intakeSlots', 'summary', 'emission', 'truth',
        'digest']) ||
      !exactKeys(receipt.source, ['schema', 'receiptDigest']) ||
      !exactKeys(receipt.emission,
        ['mode', 'sourceWasExactRetainedEvidenceMigration']) ||
      !exactKeys(receipt.truth, ['exactR98ReadinessBound',
        'allTwentyEightRequestsRouted',
        'candidateEvidenceStructuralIntakeImplemented',
        'candidatePackagesAreUntrustedData',
        'candidatePackagePersistenceImplemented',
        'evidenceContentLoadedOrExecuted', 'evidenceVerified',
        'authoritySelfAttestationAccepted',
        'candidateAdmissionPathImplemented', 'admissionAuthorityGranted',
        'historicalPhysicalSourceOwnersResolved',
        'historicalPhysicalSourceOwnersDebited',
        'crossBoundaryCardinalityInferencePerformed', 'ownerMutationPerformed',
        'heatTransferPerformed', 'historicalHeatReconstructed',
        'combinedPhysicalSourceGraphClaimed',
        'absoluteThermodynamicEnergyClaimed', 'resolvedConductionClaimed',
        'geothermalForcingModeled', 'scientificCalibrationClaimed',
        'globalUnloadedBoundaryClaimed']) ||
      !landMatrixThermalHistoricalSourceEvidenceReadinessReceiptValid(
        readiness)) return false;
  const slots = expectedSlots(readiness);
  const migration = receipt.emission?.mode === MIGRATION_EMISSION_MODE;
  return receipt.status ===
      'candidate-evidence-structural-intake-available-without-verification-or-admission' &&
    exact(receipt.creationContext, readiness.creationContext) &&
    receipt.source?.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_READINESS_RECEIPT_SCHEMA &&
    receipt.source?.receiptDigest === readiness.digest &&
    exact(receipt.intakeSlots, slots) &&
    exact(receipt.summary, expectedSummary(slots)) &&
    [NATIVE_EMISSION_MODE, MIGRATION_EMISSION_MODE]
      .includes(receipt.emission?.mode) &&
    receipt.emission.sourceWasExactRetainedEvidenceMigration === migration &&
    receipt.truth?.exactR98ReadinessBound === true &&
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
}

export function
createLandMatrixThermalHistoricalSourceEvidenceIntakeContractReceipt(
  context, readiness, options = {}) {
  if (!landMatrixThermalHistoricalSourceEvidenceReadinessReceiptValid(
      readiness) || !exact(context, readiness.creationContext)) {
    throw new Error(
      'Historical-source evidence intake needs the exact attached R98 readiness receipt');
  }
  const intakeSlots = expectedSlots(readiness);
  const migration = options.sourceWasExactRetainedEvidenceMigration === true;
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_INTAKE_CONTRACT_RECEIPT_SCHEMA,
    status:
      'candidate-evidence-structural-intake-available-without-verification-or-admission',
    creationContext: clone(readiness.creationContext),
    source: {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_READINESS_RECEIPT_SCHEMA,
      receiptDigest: readiness.digest
    },
    sourceReadiness: clone(readiness),
    intakeSlots,
    summary: expectedSummary(intakeSlots),
    emission: {
      mode: migration ? MIGRATION_EMISSION_MODE : NATIVE_EMISSION_MODE,
      sourceWasExactRetainedEvidenceMigration: migration
    },
    truth: {
      exactR98ReadinessBound: true,
      allTwentyEightRequestsRouted: true,
      candidateEvidenceStructuralIntakeImplemented: true,
      candidatePackagesAreUntrustedData: true,
      candidatePackagePersistenceImplemented: false,
      evidenceContentLoadedOrExecuted: false,
      evidenceVerified: false,
      authoritySelfAttestationAccepted: false,
      candidateAdmissionPathImplemented: false,
      admissionAuthorityGranted: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      crossBoundaryCardinalityInferencePerformed: false,
      ownerMutationPerformed: false,
      heatTransferPerformed: false,
      historicalHeatReconstructed: false,
      combinedPhysicalSourceGraphClaimed: false,
      absoluteThermodynamicEnergyClaimed: false,
      resolvedConductionClaimed: false,
      geothermalForcingModeled: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalHistoricalSourceEvidenceIntakeContractReceiptValid(
      receipt)) {
    throw new Error('Historical-source evidence intake contract failed validation');
  }
  return receipt;
}

function candidateItemValid(item) {
  return item?.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_CANDIDATE_ITEM_SCHEMA &&
    exactKeys(item, ['schema', 'requestId', 'criterionKey', 'capabilityId',
      'nativeEvidenceKind', 'expectedArtifactKind', 'claimedProducerId',
      'claimedObservationAt', 'sourcePointer', 'claimedContentDigest',
      'assertionStatus', 'verificationVerdict',
      'satisfiesAdmissionCriterion', 'admissionAuthorityGranted']) &&
    nonEmptyText(item.requestId) && nonEmptyText(item.capabilityId) &&
    nonEmptyText(item.claimedProducerId, 256) &&
    isoTimestamp(item.claimedObservationAt) &&
    nonEmptyText(item.sourcePointer) &&
    sha256Digest(item.claimedContentDigest) &&
    item.assertionStatus === CANDIDATE_ASSERTION_STATUS &&
    item.verificationVerdict === UNKNOWN &&
    item.satisfiesAdmissionCriterion === false &&
    item.admissionAuthorityGranted === false;
}

export function
landMatrixThermalHistoricalSourceEvidenceCandidatePackageEnvelopeValid(
  candidatePackage) {
  if (!digestValid(candidatePackage,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_CANDIDATE_PACKAGE_SCHEMA) ||
      !exactKeys(candidatePackage, ['schema', 'status', 'packageId',
        'claimedProducerId', 'claimedCreatedAt', 'sourceContract', 'items',
        'authorityDecisions', 'truth', 'digest']) ||
      !exactKeys(candidatePackage.sourceContract,
        ['schema', 'receiptDigest']) ||
      !exactKeys(candidatePackage.truth, ['candidateDataOnly',
        'contentLoadedOrExecuted', 'evidenceVerified',
        'authoritySelfAttestationAccepted', 'admissionAuthorityGranted',
        'candidateAdmissionPerformed', 'worldMutationPerformed']) ||
      !nonEmptyText(candidatePackage.packageId, 256) ||
      !nonEmptyText(candidatePackage.claimedProducerId, 256) ||
      !isoTimestamp(candidatePackage.claimedCreatedAt) ||
      !Array.isArray(candidatePackage.items) ||
      !Array.isArray(candidatePackage.authorityDecisions) ||
      candidatePackage.authorityDecisions.length !== 0 ||
      !candidatePackage.items.every(candidateItemValid)) return false;
  return candidatePackage.status === 'UNREVIEWED_CANDIDATE_DATA' &&
    candidatePackage.sourceContract?.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_INTAKE_CONTRACT_RECEIPT_SCHEMA &&
    nonEmptyText(candidatePackage.sourceContract?.receiptDigest) &&
    candidatePackage.truth?.candidateDataOnly === true &&
    candidatePackage.truth?.contentLoadedOrExecuted === false &&
    candidatePackage.truth?.evidenceVerified === false &&
    candidatePackage.truth?.authoritySelfAttestationAccepted === false &&
    candidatePackage.truth?.admissionAuthorityGranted === false &&
    candidatePackage.truth?.candidateAdmissionPerformed === false &&
    candidatePackage.truth?.worldMutationPerformed === false;
}

export function
createLandMatrixThermalHistoricalSourceEvidenceCandidatePackage(
  contract, input = {}) {
  if (!landMatrixThermalHistoricalSourceEvidenceIntakeContractReceiptValid(
      contract)) {
    throw new Error('Candidate package needs an exact valid R99 intake contract');
  }
  if (!nonEmptyText(input.packageId, 256) ||
      !nonEmptyText(input.claimedProducerId, 256) ||
      !isoTimestamp(input.claimedCreatedAt) || !Array.isArray(input.items)) {
    throw new Error('Candidate package metadata is incomplete');
  }
  const slots = new Map(contract.intakeSlots.map(slot =>
    [slot.requestBinding.requestId, slot]));
  const seen = new Set();
  const items = input.items.map(item => {
    const slot = slots.get(item?.requestId);
    if (!slot || !slot.candidateSubmissionAllowed ||
        slot.requestBinding.gapType !== 'EVIDENCE') {
      throw new Error('Candidate packages may target evidence slots only');
    }
    if (seen.has(item.requestId)) {
      throw new Error('Candidate packages may contain one item per request');
    }
    seen.add(item.requestId);
    if (!nonEmptyText(item.claimedProducerId, 256) ||
        !isoTimestamp(item.claimedObservationAt) ||
        !nonEmptyText(item.sourcePointer) ||
        !sha256Digest(item.claimedContentDigest)) {
      throw new Error('Candidate evidence item metadata is incomplete');
    }
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_CANDIDATE_ITEM_SCHEMA,
      requestId: slot.requestBinding.requestId,
      criterionKey: slot.requestBinding.criterionKey,
      capabilityId: slot.requestBinding.capabilityId,
      nativeEvidenceKind: slot.requestBinding.nativeEvidenceKind,
      expectedArtifactKind: slot.requestBinding.expectedArtifactKind,
      claimedProducerId: item.claimedProducerId,
      claimedObservationAt: item.claimedObservationAt,
      sourcePointer: item.sourcePointer,
      claimedContentDigest: item.claimedContentDigest,
      assertionStatus: CANDIDATE_ASSERTION_STATUS,
      verificationVerdict: UNKNOWN,
      satisfiesAdmissionCriterion: false,
      admissionAuthorityGranted: false
    };
  });
  const candidatePackage = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_CANDIDATE_PACKAGE_SCHEMA,
    status: 'UNREVIEWED_CANDIDATE_DATA',
    packageId: input.packageId,
    claimedProducerId: input.claimedProducerId,
    claimedCreatedAt: input.claimedCreatedAt,
    sourceContract: {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_INTAKE_CONTRACT_RECEIPT_SCHEMA,
      receiptDigest: contract.digest
    },
    items,
    authorityDecisions: [],
    truth: {
      candidateDataOnly: true,
      contentLoadedOrExecuted: false,
      evidenceVerified: false,
      authoritySelfAttestationAccepted: false,
      admissionAuthorityGranted: false,
      candidateAdmissionPerformed: false,
      worldMutationPerformed: false
    }
  };
  candidatePackage.digest = stableDigest(candidatePackage);
  if (!landMatrixThermalHistoricalSourceEvidenceCandidatePackageEnvelopeValid(
      candidatePackage)) {
    throw new Error('Candidate evidence package failed envelope validation');
  }
  return candidatePackage;
}

export function assessLandMatrixThermalHistoricalSourceEvidenceCandidatePackage(
  contract, candidatePackage) {
  if (!landMatrixThermalHistoricalSourceEvidenceIntakeContractReceiptValid(
      contract)) {
    throw new Error('Structural assessment needs an exact valid R99 contract');
  }
  const issues = [];
  const envelopeValid =
    landMatrixThermalHistoricalSourceEvidenceCandidatePackageEnvelopeValid(
      candidatePackage);
  if (!envelopeValid) issues.push('candidate-package-envelope-invalid');
  const sourceContractExact = envelopeValid &&
    candidatePackage.sourceContract.receiptDigest === contract.digest;
  if (envelopeValid && !sourceContractExact) {
    issues.push('candidate-package-contract-binding-mismatch');
  }
  const evidenceSlots = new Map(contract.intakeSlots
    .filter(slot => slot.candidateSubmissionAllowed)
    .map(slot => [slot.requestBinding.requestId, slot]));
  const seen = new Set();
  let structurallyMatchedItemCount = 0;
  if (envelopeValid) {
    for (const item of candidatePackage.items) {
      const slot = evidenceSlots.get(item.requestId);
      if (!slot) {
        issues.push(`request-not-candidate-evidence-slot:${item.requestId}`);
        continue;
      }
      if (seen.has(item.requestId)) {
        issues.push(`duplicate-request:${item.requestId}`);
        continue;
      }
      seen.add(item.requestId);
      if (item.capabilityId !== slot.requestBinding.capabilityId ||
          item.criterionKey !== slot.requestBinding.criterionKey ||
          item.nativeEvidenceKind !== slot.requestBinding.nativeEvidenceKind ||
          item.expectedArtifactKind !==
            slot.requestBinding.expectedArtifactKind) {
        issues.push(`request-binding-mismatch:${item.requestId}`);
        continue;
      }
      structurallyMatchedItemCount += 1;
    }
  }
  const submittedItemCount = envelopeValid ? candidatePackage.items.length : 0;
  const missingEvidenceItemCount = Math.max(0,
    evidenceSlots.size - structurallyMatchedItemCount);
  const structurallyReviewable = envelopeValid && sourceContractExact &&
    issues.length === 0 && structurallyMatchedItemCount > 0;
  const assessmentStatus = !structurallyReviewable
    ? 'REFUSED_OR_EMPTY_STRUCTURAL_INTAKE'
    : missingEvidenceItemCount === 0
      ? 'STRUCTURALLY_COMPLETE_AWAITING_VERIFICATION_AND_AUTHORITY'
      : 'PARTIAL_STRUCTURALLY_REVIEWABLE_AWAITING_MORE_EVIDENCE';
  const assessment = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_STRUCTURAL_ASSESSMENT_SCHEMA,
    assessmentStatus,
    sourceContract: {
      schema: contract.schema,
      receiptDigest: contract.digest
    },
    candidatePackageDigest: envelopeValid ? candidatePackage.digest : null,
    envelopeValid,
    sourceContractExact,
    structurallyReviewable,
    submittedItemCount,
    structurallyMatchedItemCount,
    missingEvidenceItemCount,
    authorityReviewSlotCount: 4,
    issues,
    evidenceVerificationVerdict: UNKNOWN,
    physicalMeaningReviewVerdict: UNKNOWN,
    admissionVerdict: NOT_AUTHORIZED,
    candidatePackagePersisted: false,
    evidenceContentLoadedOrExecuted: false,
    worldMutationPerformed: false,
    truth: {
      structuralAssessmentOnly: true,
      candidateClaimsRemainUnverified: true,
      authoritySelfAttestationAccepted: false,
      candidateAdmissionPerformed: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false
    }
  };
  assessment.digest = stableDigest(assessment);
  return assessment;
}

export function matrixThermalHistoricalSourceEvidenceIntakeDescription() {
  return {
    contractReceiptSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_INTAKE_CONTRACT_RECEIPT_SCHEMA,
    intakeSlotSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_INTAKE_SLOT_SCHEMA,
    candidatePackageSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_CANDIDATE_PACKAGE_SCHEMA,
    candidateItemSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_CANDIDATE_ITEM_SCHEMA,
    structuralAssessmentSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_STRUCTURAL_ASSESSMENT_SCHEMA,
    candidateAssertionStatus: CANDIDATE_ASSERTION_STATUS,
    evidenceVerificationVerdict: UNKNOWN,
    admissionVerdict: NOT_AUTHORIZED,
    candidatePackageStructuralAssessmentImplemented: true,
    candidatePackagePersistenceImplemented: false,
    candidateAdmissionPathImplemented: false,
    authorityGrantPathImplemented: false,
    mutatesState: false
  };
}
