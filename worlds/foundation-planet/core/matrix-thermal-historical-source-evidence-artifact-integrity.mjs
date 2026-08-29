import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_INTAKE_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_CANDIDATE_PACKAGE_SCHEMA,
  landMatrixThermalHistoricalSourceEvidenceIntakeContractReceiptValid,
  landMatrixThermalHistoricalSourceEvidenceCandidatePackageEnvelopeValid,
  assessLandMatrixThermalHistoricalSourceEvidenceCandidatePackage
} from './matrix-thermal-historical-source-evidence-intake.mjs?v=0.100.0-r100.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_INTEGRITY_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-evidence-artifact-integrity-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_INTEGRITY_ROUTE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-evidence-artifact-integrity-route/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_BYTE_INPUT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-evidence-artifact-byte-input/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_INTEGRITY_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-evidence-artifact-integrity-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_PACKAGE_INTEGRITY_ASSESSMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-evidence-package-integrity-assessment/v1';

export const HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_MAX_BYTES = 4 * 1024 * 1024;
export const HISTORICAL_SOURCE_EVIDENCE_PACKAGE_MAX_BYTES = 32 * 1024 * 1024;

const NATIVE_EMISSION_MODE = 'native-from-intact-r99-evidence-intake';
const MIGRATION_EMISSION_MODE =
  'migration-from-exact-retained-r99-evidence-intake';
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

function sha256Digest(value) {
  return typeof value === 'string' && /^sha256:[a-f0-9]{64}$/.test(value);
}

function fnvDigest(value) {
  return typeof value === 'string' && /^fnv1a32:[a-f0-9]{8}$/.test(value);
}

function expectedRoutes(intakeContract) {
  return intakeContract.intakeSlots.map(slot => {
    const eligible = slot.candidateSubmissionAllowed === true &&
      slot.requestBinding?.gapType === 'EVIDENCE';
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_INTEGRITY_ROUTE_SCHEMA,
      routeId: `historical-source-artifact-integrity:${slot.slotId}`,
      intakeSlotId: slot.slotId,
      requestBinding: clone(slot.requestBinding),
      eligibleForArtifactIntegrityCheck: eligible,
      artifactByteInputSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_BYTE_INPUT_SCHEMA
        : null,
      digestAlgorithm: eligible ? 'SHA-256' : null,
      maximumArtifactBytes: eligible
        ? HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_MAX_BYTES : 0,
      verificationAction: eligible
        ? 'COMPARE_INERT_BYTES_TO_CLAIMED_SHA256'
        : 'NO_BYTE_VERIFICATION_AUTHORITY_REVIEW_ONLY',
      artifactSupply: null,
      artifactIntegrityReceipt: null,
      artifactIntegrityVerdict: UNKNOWN,
      observationAuthenticityVerdict: UNKNOWN,
      provenanceVerdict: UNKNOWN,
      physicalMeaningReviewVerdict: UNKNOWN,
      admissionVerdict: NOT_AUTHORIZED
    };
  });
}

function expectedSummary(routes) {
  return {
    sourceIntakeContractCount: 1,
    integrityRouteCount: 28,
    evidenceArtifactIntegrityRouteCount: routes.filter(route =>
      route.eligibleForArtifactIntegrityCheck).length,
    authorityReviewRouteExcludedCount: routes.filter(route =>
      !route.eligibleForArtifactIntegrityCheck).length,
    maximumArtifactBytes: HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_MAX_BYTES,
    maximumPackageBytes: HISTORICAL_SOURCE_EVIDENCE_PACKAGE_MAX_BYTES,
    suppliedArtifactCount: 0,
    artifactIntegrityReceiptCount: 0,
    matchingArtifactDigestCount: 0,
    mismatchingArtifactDigestCount: 0,
    persistedArtifactByteCount: 0,
    persistedIntegrityAssessmentCount: 0,
    artifactByteIntegrityVerificationImplemented: true,
    observationAuthenticityVerificationImplemented: false,
    provenanceVerificationImplemented: false,
    physicalMeaningReviewImplemented: false,
    candidateAdmissionPathImplemented: false
  };
}

const expectedTruth = () => ({
  exactR99IntakeContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourEvidenceArtifactIntegrityRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  sha256ByteComparisonImplemented: true,
  artifactByteInputResourceBounded: true,
  artifactBytesPersisted: false,
  integrityAssessmentsPersisted: false,
  artifactContentParsingImplemented: false,
  artifactContentExecutionImplemented: false,
  observationAuthenticityVerificationImplemented: false,
  provenanceVerificationImplemented: false,
  physicalMeaningReviewImplemented: false,
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
});

export function
landMatrixThermalHistoricalSourceEvidenceArtifactIntegrityContractReceiptValid(
  receipt) {
  const intakeContract = receipt?.sourceIntakeContract;
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_INTEGRITY_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
        'sourceIntakeContract', 'integrityRoutes', 'summary', 'emission',
        'truth', 'digest']) ||
      !exactKeys(receipt.source, ['schema', 'receiptDigest']) ||
      !exactKeys(receipt.emission,
        ['mode', 'sourceWasExactRetainedEvidenceMigration']) ||
      !landMatrixThermalHistoricalSourceEvidenceIntakeContractReceiptValid(
        intakeContract)) return false;
  const routes = expectedRoutes(intakeContract);
  const migration = receipt.emission?.mode === MIGRATION_EMISSION_MODE;
  return receipt.status ===
      'artifact-byte-integrity-check-available-without-evidence-verification-or-admission' &&
    exact(receipt.creationContext, intakeContract.creationContext) &&
    receipt.source?.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_INTAKE_CONTRACT_RECEIPT_SCHEMA &&
    receipt.source?.receiptDigest === intakeContract.digest &&
    exact(receipt.integrityRoutes, routes) &&
    exact(receipt.summary, expectedSummary(routes)) &&
    [NATIVE_EMISSION_MODE, MIGRATION_EMISSION_MODE]
      .includes(receipt.emission?.mode) &&
    receipt.emission.sourceWasExactRetainedEvidenceMigration === migration &&
    exact(receipt.truth, expectedTruth());
}

export function
createLandMatrixThermalHistoricalSourceEvidenceArtifactIntegrityContractReceipt(
  creationContext, intakeContract, options = {}) {
  if (!landMatrixThermalHistoricalSourceEvidenceIntakeContractReceiptValid(
      intakeContract) || !exact(creationContext,
      intakeContract?.creationContext)) {
    throw new Error(
      'Artifact-integrity contract needs the exact attached R99 intake contract');
  }
  const routes = expectedRoutes(intakeContract);
  const migration = options.sourceWasExactRetainedEvidenceMigration === true;
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
    status:
      'artifact-byte-integrity-check-available-without-evidence-verification-or-admission',
    creationContext: clone(creationContext),
    source: {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_INTAKE_CONTRACT_RECEIPT_SCHEMA,
      receiptDigest: intakeContract.digest
    },
    sourceIntakeContract: clone(intakeContract),
    integrityRoutes: routes,
    summary: expectedSummary(routes),
    emission: {
      mode: migration ? MIGRATION_EMISSION_MODE : NATIVE_EMISSION_MODE,
      sourceWasExactRetainedEvidenceMigration: migration
    },
    truth: expectedTruth()
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalHistoricalSourceEvidenceArtifactIntegrityContractReceiptValid(
      receipt)) {
    throw new Error('Historical-source artifact-integrity contract failed validation');
  }
  return receipt;
}

function artifactByteInputValid(input) {
  return exactKeys(input, ['schema', 'requestId', 'bytes']) &&
    input.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_BYTE_INPUT_SCHEMA &&
    typeof input.requestId === 'string' && input.requestId.length > 0 &&
    input.bytes instanceof Uint8Array;
}

export async function sha256DigestForHistoricalSourceEvidenceBytes(bytes) {
  if (!(bytes instanceof Uint8Array)) {
    throw new Error('Artifact integrity requires Uint8Array bytes');
  }
  if (!globalThis.crypto?.subtle?.digest) {
    throw new Error('SHA-256 runtime unavailable');
  }
  const immutableCopy = new Uint8Array(bytes);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', immutableCopy);
  return `sha256:${Array.from(new Uint8Array(digest))
    .map(value => value.toString(16).padStart(2, '0')).join('')}`;
}

export function
landMatrixThermalHistoricalSourceEvidenceArtifactIntegrityReceiptValid(
  receipt) {
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_INTEGRITY_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'requestId', 'candidatePackageDigest',
        'claimedContentDigest', 'computedContentDigest', 'byteLength',
        'digestAlgorithm', 'integrityVerdict', 'artifactBytesReadForDigest',
        'contentParsed', 'contentExecuted', 'observationAuthenticityVerified',
        'provenanceVerified', 'physicalMeaningVerified',
        'admissionAuthorized', 'persisted', 'digest'])) return false;
  const matches = receipt.claimedContentDigest === receipt.computedContentDigest;
  return typeof receipt.requestId === 'string' && receipt.requestId.length > 0 &&
    fnvDigest(receipt.candidatePackageDigest) &&
    sha256Digest(receipt.claimedContentDigest) &&
    sha256Digest(receipt.computedContentDigest) &&
    Number.isInteger(receipt.byteLength) && receipt.byteLength >= 0 &&
    receipt.byteLength <= HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_MAX_BYTES &&
    receipt.digestAlgorithm === 'SHA-256' &&
    receipt.integrityVerdict ===
      (matches ? 'CONTENT_DIGEST_MATCH' : 'CONTENT_DIGEST_MISMATCH') &&
    receipt.artifactBytesReadForDigest === true &&
    receipt.contentParsed === false && receipt.contentExecuted === false &&
    receipt.observationAuthenticityVerified === false &&
    receipt.provenanceVerified === false &&
    receipt.physicalMeaningVerified === false &&
    receipt.admissionAuthorized === false && receipt.persisted === false;
}

const assessmentTruth = (artifactByteIntegrityVerified,
  artifactBytesReadForDigestOnly) => ({
  artifactByteIntegrityVerified,
  artifactBytesReadForDigestOnly,
  artifactContentParsed: false,
  artifactContentExecuted: false,
  observationAuthenticityVerified: false,
  provenanceVerified: false,
  physicalMeaningVerified: false,
  evidenceVerified: false,
  authoritySelfAttestationAccepted: false,
  candidateAdmissionPerformed: false,
  artifactBytesPersisted: false,
  assessmentPersisted: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  worldMutationPerformed: false
});

function createAssessment({ contract, candidatePackage, structuralAssessment,
  status, issues, inputs, receipts }) {
  const matching = receipts.filter(receipt =>
    receipt.integrityVerdict === 'CONTENT_DIGEST_MATCH').length;
  const mismatching = receipts.filter(receipt =>
    receipt.integrityVerdict === 'CONTENT_DIGEST_MISMATCH').length;
  const pass = status ===
    'ARTIFACT_DIGESTS_MATCH_CLAIMS_WITHOUT_EVIDENCE_VERIFICATION';
  const assessment = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_PACKAGE_INTEGRITY_ASSESSMENT_SCHEMA,
    status,
    sourceContract: {
      schema: contract.schema,
      receiptDigest: contract.digest
    },
    candidatePackage: {
      schema: LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_CANDIDATE_PACKAGE_SCHEMA,
      receiptDigest: candidatePackage?.digest || null
    },
    structuralAssessmentDigest: structuralAssessment?.digest || null,
    artifactInputCount: inputs.length,
    artifactIntegrityReceiptCount: receipts.length,
    totalArtifactByteLength: inputs.reduce((total, input) =>
      total + (input?.bytes instanceof Uint8Array ? input.bytes.byteLength : 0), 0),
    matchingArtifactDigestCount: matching,
    mismatchingArtifactDigestCount: mismatching,
    artifactIntegrityReceipts: receipts,
    issues,
    artifactByteIntegrityVerdict: pass ? 'PASS' : 'FAIL',
    observationAuthenticityVerdict: UNKNOWN,
    provenanceVerdict: UNKNOWN,
    physicalMeaningReviewVerdict: UNKNOWN,
    evidenceVerificationVerdict: UNKNOWN,
    admissionVerdict: NOT_AUTHORIZED,
    truth: assessmentTruth(pass, receipts.length > 0)
  };
  assessment.digest = stableDigest(assessment);
  return assessment;
}

export function
landMatrixThermalHistoricalSourceEvidencePackageIntegrityAssessmentValid(
  assessment) {
  if (!digestValid(assessment,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_PACKAGE_INTEGRITY_ASSESSMENT_SCHEMA) ||
      !exactKeys(assessment, ['schema', 'status', 'sourceContract',
        'candidatePackage', 'structuralAssessmentDigest',
        'artifactInputCount', 'artifactIntegrityReceiptCount',
        'totalArtifactByteLength', 'matchingArtifactDigestCount',
        'mismatchingArtifactDigestCount', 'artifactIntegrityReceipts',
        'issues', 'artifactByteIntegrityVerdict',
        'observationAuthenticityVerdict', 'provenanceVerdict',
        'physicalMeaningReviewVerdict', 'evidenceVerificationVerdict',
        'admissionVerdict', 'truth', 'digest']) ||
      !exactKeys(assessment.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(assessment.candidatePackage, ['schema', 'receiptDigest']) ||
      !Array.isArray(assessment.artifactIntegrityReceipts) ||
      !Array.isArray(assessment.issues) ||
      !assessment.artifactIntegrityReceipts.every(
        landMatrixThermalHistoricalSourceEvidenceArtifactIntegrityReceiptValid)) {
    return false;
  }
  const pass = assessment.status ===
    'ARTIFACT_DIGESTS_MATCH_CLAIMS_WITHOUT_EVIDENCE_VERIFICATION';
  const mismatch = assessment.status === 'ARTIFACT_DIGEST_MISMATCH';
  const refused = assessment.status === 'REFUSED_ARTIFACT_INTEGRITY_INPUT';
  const matching = assessment.artifactIntegrityReceipts.filter(receipt =>
    receipt.integrityVerdict === 'CONTENT_DIGEST_MATCH').length;
  const mismatching = assessment.artifactIntegrityReceipts.length - matching;
  const receiptBytes = assessment.artifactIntegrityReceipts.reduce(
    (total, receipt) => total + receipt.byteLength, 0);
  const exactStatusShape = refused
    ? assessment.issues.length > 0 &&
      assessment.artifactIntegrityReceipts.length === 0
    : assessment.issues.length === 0 &&
      assessment.artifactIntegrityReceipts.length > 0 &&
      fnvDigest(assessment.structuralAssessmentDigest) &&
      fnvDigest(assessment.candidatePackage.receiptDigest) &&
      assessment.artifactInputCount ===
        assessment.artifactIntegrityReceipts.length &&
      assessment.totalArtifactByteLength === receiptBytes &&
      assessment.totalArtifactByteLength <=
        HISTORICAL_SOURCE_EVIDENCE_PACKAGE_MAX_BYTES &&
      assessment.artifactIntegrityReceipts.every(receipt =>
        receipt.candidatePackageDigest ===
          assessment.candidatePackage.receiptDigest) &&
      (pass ? mismatching === 0 : mismatch && mismatching > 0);
  return [pass, mismatch, refused].filter(Boolean).length === 1 &&
    assessment.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(assessment.sourceContract.receiptDigest) &&
    assessment.candidatePackage.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_CANDIDATE_PACKAGE_SCHEMA &&
    (assessment.candidatePackage.receiptDigest === null ||
      fnvDigest(assessment.candidatePackage.receiptDigest)) &&
    (assessment.structuralAssessmentDigest === null ||
      fnvDigest(assessment.structuralAssessmentDigest)) &&
    Number.isInteger(assessment.artifactInputCount) &&
      assessment.artifactInputCount >= 0 &&
    Number.isInteger(assessment.artifactIntegrityReceiptCount) &&
      assessment.artifactIntegrityReceiptCount >= 0 &&
    Number.isInteger(assessment.totalArtifactByteLength) &&
      assessment.totalArtifactByteLength >= 0 &&
    Number.isInteger(assessment.matchingArtifactDigestCount) &&
      assessment.matchingArtifactDigestCount >= 0 &&
    Number.isInteger(assessment.mismatchingArtifactDigestCount) &&
      assessment.mismatchingArtifactDigestCount >= 0 &&
    assessment.issues.every(issue =>
      typeof issue === 'string' && issue.length > 0) &&
    exactStatusShape &&
    assessment.artifactIntegrityReceiptCount ===
      assessment.artifactIntegrityReceipts.length &&
    assessment.matchingArtifactDigestCount === matching &&
    assessment.mismatchingArtifactDigestCount === mismatching &&
    assessment.artifactByteIntegrityVerdict === (pass ? 'PASS' : 'FAIL') &&
    assessment.observationAuthenticityVerdict === UNKNOWN &&
    assessment.provenanceVerdict === UNKNOWN &&
    assessment.physicalMeaningReviewVerdict === UNKNOWN &&
    assessment.evidenceVerificationVerdict === UNKNOWN &&
    assessment.admissionVerdict === NOT_AUTHORIZED &&
    exact(assessment.truth,
      assessmentTruth(pass, assessment.artifactIntegrityReceipts.length > 0));
}

export async function
verifyLandMatrixThermalHistoricalSourceEvidenceCandidatePackageArtifacts(
  contract, candidatePackage, artifactInputs = []) {
  if (!landMatrixThermalHistoricalSourceEvidenceArtifactIntegrityContractReceiptValid(
      contract)) {
    throw new Error('Artifact verification needs an exact valid R100 contract');
  }
  const intakeContract = contract.sourceIntakeContract;
  const envelopeValid =
    landMatrixThermalHistoricalSourceEvidenceCandidatePackageEnvelopeValid(
      candidatePackage);
  const structuralAssessment = envelopeValid
    ? assessLandMatrixThermalHistoricalSourceEvidenceCandidatePackage(
      intakeContract, candidatePackage)
    : null;
  const issues = [];
  if (!envelopeValid) issues.push('candidate-package-envelope-invalid');
  if (envelopeValid && !structuralAssessment?.structurallyReviewable) {
    issues.push('candidate-package-not-structurally-reviewable');
  }
  if (!Array.isArray(artifactInputs)) {
    issues.push('artifact-inputs-not-array');
    artifactInputs = [];
  }
  const inputs = artifactInputs;
  const inputByRequest = new Map();
  for (const input of inputs) {
    if (!artifactByteInputValid(input)) {
      issues.push('artifact-byte-input-invalid');
      continue;
    }
    if (inputByRequest.has(input.requestId)) {
      issues.push(`duplicate-artifact-input:${input.requestId}`);
      continue;
    }
    if (input.bytes.byteLength >
        HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_MAX_BYTES) {
      issues.push(`artifact-byte-limit-exceeded:${input.requestId}`);
    }
    inputByRequest.set(input.requestId, input);
  }
  const candidateItems = envelopeValid ? candidatePackage.items : [];
  const candidateRequestIds = new Set(candidateItems.map(item => item.requestId));
  for (const item of candidateItems) {
    if (!inputByRequest.has(item.requestId)) {
      issues.push(`artifact-input-missing:${item.requestId}`);
    }
  }
  for (const requestId of inputByRequest.keys()) {
    if (!candidateRequestIds.has(requestId)) {
      issues.push(`artifact-input-not-in-candidate-package:${requestId}`);
    }
  }
  const totalBytes = inputs.reduce((total, input) =>
    total + (input?.bytes instanceof Uint8Array ? input.bytes.byteLength : 0), 0);
  if (totalBytes > HISTORICAL_SOURCE_EVIDENCE_PACKAGE_MAX_BYTES) {
    issues.push('artifact-package-byte-limit-exceeded');
  }
  if (issues.length > 0) {
    return createAssessment({ contract, candidatePackage,
      structuralAssessment, status: 'REFUSED_ARTIFACT_INTEGRITY_INPUT',
      issues, inputs, receipts: [] });
  }
  const receipts = [];
  for (const item of candidateItems) {
    const input = inputByRequest.get(item.requestId);
    const computedContentDigest =
      await sha256DigestForHistoricalSourceEvidenceBytes(input.bytes);
    const receipt = {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_INTEGRITY_RECEIPT_SCHEMA,
      requestId: item.requestId,
      candidatePackageDigest: candidatePackage.digest,
      claimedContentDigest: item.claimedContentDigest,
      computedContentDigest,
      byteLength: input.bytes.byteLength,
      digestAlgorithm: 'SHA-256',
      integrityVerdict: computedContentDigest === item.claimedContentDigest
        ? 'CONTENT_DIGEST_MATCH' : 'CONTENT_DIGEST_MISMATCH',
      artifactBytesReadForDigest: true,
      contentParsed: false,
      contentExecuted: false,
      observationAuthenticityVerified: false,
      provenanceVerified: false,
      physicalMeaningVerified: false,
      admissionAuthorized: false,
      persisted: false
    };
    receipt.digest = stableDigest(receipt);
    receipts.push(receipt);
  }
  const mismatch = receipts.some(receipt =>
    receipt.integrityVerdict === 'CONTENT_DIGEST_MISMATCH');
  return createAssessment({ contract, candidatePackage, structuralAssessment,
    status: mismatch ? 'ARTIFACT_DIGEST_MISMATCH' :
      'ARTIFACT_DIGESTS_MATCH_CLAIMS_WITHOUT_EVIDENCE_VERIFICATION',
    issues: [], inputs, receipts });
}

export function
matrixThermalHistoricalSourceEvidenceArtifactIntegrityDescription() {
  return {
    contractReceiptSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
    integrityRouteSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_INTEGRITY_ROUTE_SCHEMA,
    artifactByteInputSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_BYTE_INPUT_SCHEMA,
    artifactIntegrityReceiptSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_INTEGRITY_RECEIPT_SCHEMA,
    packageIntegrityAssessmentSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_PACKAGE_INTEGRITY_ASSESSMENT_SCHEMA,
    digestAlgorithm: 'SHA-256',
    maximumArtifactBytes: HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_MAX_BYTES,
    maximumPackageBytes: HISTORICAL_SOURCE_EVIDENCE_PACKAGE_MAX_BYTES,
    artifactByteIntegrityVerificationImplemented: true,
    observationAuthenticityVerificationImplemented: false,
    provenanceVerificationImplemented: false,
    physicalMeaningReviewImplemented: false,
    artifactContentParsingImplemented: false,
    artifactContentExecutionImplemented: false,
    artifactPersistenceImplemented: false,
    assessmentPersistenceImplemented: false,
    candidateAdmissionPathImplemented: false,
    authorityGrantPathImplemented: false,
    mutatesState: false
  };
}
