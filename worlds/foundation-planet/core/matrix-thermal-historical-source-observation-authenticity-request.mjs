import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_INTAKE_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_CANDIDATE_PACKAGE_SCHEMA,
  landMatrixThermalHistoricalSourceEvidenceCandidatePackageEnvelopeValid,
  assessLandMatrixThermalHistoricalSourceEvidenceCandidatePackage
} from './matrix-thermal-historical-source-evidence-intake.mjs?v=0.101.0-r101.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_PACKAGE_INTEGRITY_ASSESSMENT_SCHEMA,
  landMatrixThermalHistoricalSourceEvidenceArtifactIntegrityContractReceiptValid,
  landMatrixThermalHistoricalSourceEvidencePackageIntegrityAssessmentValid
} from './matrix-thermal-historical-source-evidence-artifact-integrity.mjs?v=0.101.0-r101.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_REQUEST_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-observation-authenticity-request-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_ROUTE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-observation-authenticity-route/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_VERIFICATION_REQUEST_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-observation-authenticity-verification-request/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_REQUEST_PACKET_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-observation-authenticity-request-packet/v1';

export const OBSERVATION_AUTHENTICITY_VERIFICATION_CAPABILITY_ID =
  'evidence.observation.authenticity.verify';

const NATIVE_EMISSION_MODE = 'native-from-intact-r100-artifact-integrity';
const MIGRATION_EMISSION_MODE =
  'migration-from-exact-retained-r100-artifact-integrity';
const UNKNOWN = 'UNKNOWN';
const NOT_AUTHORIZED = 'NOT_AUTHORIZED';
const clone = value => JSON.parse(JSON.stringify(value));
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const exactKeys = (value, keys) => value && typeof value === 'object' &&
  !Array.isArray(value) && exact(Object.keys(value).sort(), [...keys].sort());

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

const fnvDigest = value => typeof value === 'string' &&
  /^fnv1a32:[a-f0-9]{8}$/.test(value);
const sha256Digest = value => typeof value === 'string' &&
  /^sha256:[a-f0-9]{64}$/.test(value);
const nonEmptyText = (value, maximum = 4096) =>
  typeof value === 'string' && value.trim().length > 0 &&
    value.length <= maximum;
const isoTimestamp = value =>
  nonEmptyText(value, 64) && Number.isFinite(Date.parse(value));

function proofPlanFor(nativeEvidenceKind) {
  if (nativeEvidenceKind === 'persistence') {
    return {
      claimKind: 'persistence',
      minimumEvidence: [
        'save-stop-or-restart-reload-and-compare-state'
      ],
      strongerEvidence: [
        'fresh-process-or-device-recovery-with-lineage-comparison'
      ],
      counterevidence: [
        'pre-restart-state-only',
        'artifact-digest-match-only',
        'candidate-producer-claim-only'
      ]
    };
  }
  if (nativeEvidenceKind === 'static structure') {
    return {
      claimKind: 'static structure',
      minimumEvidence: [
        'direct-source-artifact-and-declared-schema-inspection'
      ],
      strongerEvidence: [
        'independent-inventory-plus-digest-reconstruction'
      ],
      counterevidence: [
        'candidate-producer-claim-only',
        'artifact-digest-match-only',
        'runtime-success-without-source-identity-proof'
      ]
    };
  }
  if (nativeEvidenceKind === 'transport') {
    return {
      claimKind: 'transport',
      minimumEvidence: [
        'sender-and-receiver-receipts-tied-by-identifier'
      ],
      strongerEvidence: [
        'payload-digest-acknowledgement-and-applied-state-evidence'
      ],
      counterevidence: [
        'sender-receipt-only',
        'artifact-digest-match-only',
        'receiver-presence-without-application-proof'
      ]
    };
  }
  throw new Error(
    `No observation-authenticity evidence route for ${nativeEvidenceKind}`);
}

function expectedRoutes(artifactIntegrityContract) {
  return artifactIntegrityContract.integrityRoutes.map(integrityRoute => {
    const eligible = integrityRoute.eligibleForArtifactIntegrityCheck === true;
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_ROUTE_SCHEMA,
      routeId: `observation-authenticity:${integrityRoute.routeId}`,
      sourceIntegrityRouteId: integrityRoute.routeId,
      requestBinding: clone(integrityRoute.requestBinding),
      eligibleForObservationAuthenticityRequest: eligible,
      verificationCapabilityId: eligible
        ? OBSERVATION_AUTHENTICITY_VERIFICATION_CAPABILITY_ID : null,
      verificationRequestSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_VERIFICATION_REQUEST_SCHEMA
        : null,
      proofPlan: eligible
        ? proofPlanFor(integrityRoute.requestBinding.nativeEvidenceKind) : null,
      requiresIndependentVerifier: eligible,
      candidateCanSelfVerify: false,
      trustedVerifierIdentity: null,
      observedAuthenticityEvidence: [],
      verificationDecision: null,
      observationAuthenticityVerdict: UNKNOWN,
      provenanceVerdict: UNKNOWN,
      physicalMeaningReviewVerdict: UNKNOWN,
      admissionVerdict: NOT_AUTHORIZED
    };
  });
}

function expectedSummary(routes) {
  return {
    sourceArtifactIntegrityContractCount: 1,
    authenticityRouteCount: 28,
    observationAuthenticityRequestRouteCount: routes.filter(route =>
      route.eligibleForObservationAuthenticityRequest).length,
    authorityReviewRouteExcludedCount: routes.filter(route =>
      !route.eligibleForObservationAuthenticityRequest).length,
    nativeEvidenceKindCount: new Set(routes.filter(route =>
      route.eligibleForObservationAuthenticityRequest)
      .map(route => route.requestBinding.nativeEvidenceKind)).size,
    generatedRequestPacketCount: 0,
    observedAuthenticityEvidenceCount: 0,
    trustedVerifierIdentityCount: 0,
    verifierDecisionCount: 0,
    verifiedAuthenticObservationCount: 0,
    persistedRequestPacketCount: 0,
    observationAuthenticityRequestContractImplemented: true,
    observationAuthenticityVerificationImplemented: false,
    physicalMeaningReviewImplemented: false,
    candidateAdmissionPathImplemented: false
  };
}

const expectedContractTruth = () => ({
  exactR100ArtifactIntegrityContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourObservationAuthenticityRequestRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  nativeClaimEvidencePlansDeclared: true,
  requestPacketGenerationImplemented: true,
  independentVerifierRequired: true,
  candidateSelfVerificationAccepted: false,
  trustedVerifierRegistryConfigured: false,
  trustedVerifierIdentityBound: false,
  observationAuthenticityEvidenceObserved: false,
  observationAuthenticityVerificationImplemented: false,
  observationAuthenticityVerified: false,
  provenanceVerified: false,
  physicalMeaningReviewImplemented: false,
  evidenceVerified: false,
  authoritySelfAttestationAccepted: false,
  requestPacketsPersisted: false,
  verificationDecisionsPersisted: false,
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
landMatrixThermalHistoricalSourceObservationAuthenticityRequestContractReceiptValid(
  receipt) {
  const source = receipt?.sourceArtifactIntegrityContract;
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_REQUEST_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
        'sourceArtifactIntegrityContract', 'authenticityRoutes', 'summary',
        'emission', 'truth', 'digest']) ||
      !exactKeys(receipt.source, ['schema', 'receiptDigest']) ||
      !exactKeys(receipt.emission,
        ['mode', 'sourceWasExactRetainedArtifactIntegrityMigration']) ||
      !landMatrixThermalHistoricalSourceEvidenceArtifactIntegrityContractReceiptValid(
        source)) return false;
  const routes = expectedRoutes(source);
  const migration = receipt.emission?.mode === MIGRATION_EMISSION_MODE;
  return receipt.status ===
      'observation-authenticity-evidence-request-routing-available-without-verifier-decision-or-admission' &&
    exact(receipt.creationContext, source.creationContext) &&
    receipt.source.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    receipt.source.receiptDigest === source.digest &&
    exact(receipt.authenticityRoutes, routes) &&
    exact(receipt.summary, expectedSummary(routes)) &&
    [NATIVE_EMISSION_MODE, MIGRATION_EMISSION_MODE]
      .includes(receipt.emission.mode) &&
    receipt.emission.sourceWasExactRetainedArtifactIntegrityMigration ===
      migration &&
    exact(receipt.truth, expectedContractTruth());
}

export function
createLandMatrixThermalHistoricalSourceObservationAuthenticityRequestContractReceipt(
  creationContext, artifactIntegrityContract, options = {}) {
  if (!landMatrixThermalHistoricalSourceEvidenceArtifactIntegrityContractReceiptValid(
      artifactIntegrityContract) ||
      !exact(creationContext, artifactIntegrityContract?.creationContext)) {
    throw new Error(
      'Observation-authenticity request contract needs the exact attached R100 artifact-integrity contract');
  }
  const routes = expectedRoutes(artifactIntegrityContract);
  const migration =
    options.sourceWasExactRetainedArtifactIntegrityMigration === true;
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    status:
      'observation-authenticity-evidence-request-routing-available-without-verifier-decision-or-admission',
    creationContext: clone(creationContext),
    source: {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
      receiptDigest: artifactIntegrityContract.digest
    },
    sourceArtifactIntegrityContract: clone(artifactIntegrityContract),
    authenticityRoutes: routes,
    summary: expectedSummary(routes),
    emission: {
      mode: migration ? MIGRATION_EMISSION_MODE : NATIVE_EMISSION_MODE,
      sourceWasExactRetainedArtifactIntegrityMigration: migration
    },
    truth: expectedContractTruth()
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalHistoricalSourceObservationAuthenticityRequestContractReceiptValid(
      receipt)) {
    throw new Error(
      'Observation-authenticity request contract failed validation');
  }
  return receipt;
}

const expectedPacketTruth = () => ({
  exactR101RequestContractBound: true,
  exactR99CandidatePackageBound: true,
  exactR100MatchingArtifactIntegrityAssessmentBound: true,
  artifactDigestMatchRequiredBeforeRequest: true,
  nativeClaimEvidencePlansPreserved: true,
  independentVerifierRequired: true,
  candidateSelfVerificationAccepted: false,
  trustedVerifierIdentityBound: false,
  observationAuthenticityEvidenceObserved: false,
  observationAuthenticityVerified: false,
  provenanceVerified: false,
  physicalMeaningVerified: false,
  evidenceVerified: false,
  authoritySelfAttestationAccepted: false,
  requestPacketPersisted: false,
  verificationDecisionPersisted: false,
  candidateAdmissionPerformed: false,
  admissionAuthorityGranted: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  worldMutationPerformed: false
});

function expectedVerificationRequests(contract, candidatePackage,
  integrityAssessment) {
  const routeByRequest = new Map(contract.authenticityRoutes.map(route =>
    [route.requestBinding.requestId, route]));
  const receiptByRequest = new Map(
    integrityAssessment.artifactIntegrityReceipts.map(receipt =>
      [receipt.requestId, receipt]));
  return candidatePackage.items.map(item => {
    const route = routeByRequest.get(item.requestId);
    const integrityReceipt = receiptByRequest.get(item.requestId);
    if (!route?.eligibleForObservationAuthenticityRequest ||
        integrityReceipt?.integrityVerdict !== 'CONTENT_DIGEST_MATCH') {
      throw new Error(
        `No matching artifact-integrity evidence for ${item.requestId}`);
    }
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_VERIFICATION_REQUEST_SCHEMA,
      requestId: `observation-authenticity:${item.requestId}`,
      candidateRequestId: item.requestId,
      criterionKey: item.criterionKey,
      sourceCapabilityId: item.capabilityId,
      requiredVerificationCapabilityId:
        OBSERVATION_AUTHENTICITY_VERIFICATION_CAPABILITY_ID,
      nativeEvidenceKind: item.nativeEvidenceKind,
      expectedArtifactKind: item.expectedArtifactKind,
      claimedProducerId: item.claimedProducerId,
      claimedObservationAt: item.claimedObservationAt,
      sourcePointer: item.sourcePointer,
      claimedContentDigest: item.claimedContentDigest,
      artifactIntegrityReceiptDigest: integrityReceipt.digest,
      artifactIntegrityVerdict: 'CONTENT_DIGEST_MATCH',
      proofPlan: clone(route.proofPlan),
      requiresIndependentVerifier: true,
      candidateSelfVerificationAccepted: false,
      trustedVerifierIdentity: null,
      observedAuthenticityEvidence: [],
      verificationDecision: null,
      observationAuthenticityVerdict: UNKNOWN,
      provenanceVerdict: UNKNOWN,
      physicalMeaningReviewVerdict: UNKNOWN,
      admissionVerdict: NOT_AUTHORIZED
    };
  });
}

function packetSummary(requests) {
  return {
    verificationRequestCount: requests.length,
    persistenceClaimRequestCount: requests.filter(request =>
      request.nativeEvidenceKind === 'persistence').length,
    staticStructureClaimRequestCount: requests.filter(request =>
      request.nativeEvidenceKind === 'static structure').length,
    transportClaimRequestCount: requests.filter(request =>
      request.nativeEvidenceKind === 'transport').length,
    observedAuthenticityEvidenceCount: 0,
    trustedVerifierIdentityCount: 0,
    verifierDecisionCount: 0,
    verifiedAuthenticObservationCount: 0,
    persistedRequestPacketCount: 0
  };
}

function verificationRequestShapeValid(request) {
  if (!exactKeys(request, ['schema', 'requestId', 'candidateRequestId',
      'criterionKey', 'sourceCapabilityId',
      'requiredVerificationCapabilityId', 'nativeEvidenceKind',
      'expectedArtifactKind', 'claimedProducerId', 'claimedObservationAt',
      'sourcePointer', 'claimedContentDigest',
      'artifactIntegrityReceiptDigest', 'artifactIntegrityVerdict', 'proofPlan',
      'requiresIndependentVerifier', 'candidateSelfVerificationAccepted',
      'trustedVerifierIdentity', 'observedAuthenticityEvidence',
      'verificationDecision', 'observationAuthenticityVerdict',
      'provenanceVerdict', 'physicalMeaningReviewVerdict',
      'admissionVerdict'])) return false;
  let expectedPlan;
  try {
    expectedPlan = proofPlanFor(request.nativeEvidenceKind);
  } catch {
    return false;
  }
  return request.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_VERIFICATION_REQUEST_SCHEMA &&
    nonEmptyText(request.candidateRequestId) &&
    request.requestId ===
      `observation-authenticity:${request.candidateRequestId}` &&
    nonEmptyText(request.criterionKey) &&
    nonEmptyText(request.sourceCapabilityId) &&
    request.requiredVerificationCapabilityId ===
      OBSERVATION_AUTHENTICITY_VERIFICATION_CAPABILITY_ID &&
    nonEmptyText(request.expectedArtifactKind) &&
    nonEmptyText(request.claimedProducerId, 256) &&
    isoTimestamp(request.claimedObservationAt) &&
    nonEmptyText(request.sourcePointer) &&
    sha256Digest(request.claimedContentDigest) &&
    fnvDigest(request.artifactIntegrityReceiptDigest) &&
    request.artifactIntegrityVerdict === 'CONTENT_DIGEST_MATCH' &&
    exact(request.proofPlan, expectedPlan) &&
    request.requiresIndependentVerifier === true &&
    request.candidateSelfVerificationAccepted === false &&
    request.trustedVerifierIdentity === null &&
    Array.isArray(request.observedAuthenticityEvidence) &&
    request.observedAuthenticityEvidence.length === 0 &&
    request.verificationDecision === null &&
    request.observationAuthenticityVerdict === UNKNOWN &&
    request.provenanceVerdict === UNKNOWN &&
    request.physicalMeaningReviewVerdict === UNKNOWN &&
    request.admissionVerdict === NOT_AUTHORIZED;
}

export function
landMatrixThermalHistoricalSourceObservationAuthenticityRequestPacketValid(
  packet, contract = null, candidatePackage = null,
  integrityAssessment = null) {
  if (!digestValid(packet,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_REQUEST_PACKET_SCHEMA) ||
      !exactKeys(packet, ['schema', 'status', 'sourceContract',
        'candidatePackage', 'artifactIntegrityAssessment',
        'verificationRequests', 'summary', 'truth', 'digest']) ||
      !exactKeys(packet.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(packet.candidatePackage, ['schema', 'receiptDigest']) ||
      !exactKeys(packet.artifactIntegrityAssessment,
        ['schema', 'receiptDigest']) ||
      !Array.isArray(packet.verificationRequests) ||
      packet.verificationRequests.length === 0 ||
      !packet.verificationRequests.every(verificationRequestShapeValid)) {
    return false;
  }
  const requestIds = packet.verificationRequests.map(request =>
    request.candidateRequestId);
  const structurallyValid = packet.status ===
      'AWAITING_INDEPENDENT_OBSERVATION_AUTHENTICITY_EVIDENCE' &&
    packet.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_REQUEST_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(packet.sourceContract.receiptDigest) &&
    packet.candidatePackage.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_CANDIDATE_PACKAGE_SCHEMA &&
    fnvDigest(packet.candidatePackage.receiptDigest) &&
    packet.artifactIntegrityAssessment.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_PACKAGE_INTEGRITY_ASSESSMENT_SCHEMA &&
    fnvDigest(packet.artifactIntegrityAssessment.receiptDigest) &&
    new Set(requestIds).size === requestIds.length &&
    exact(packet.summary, packetSummary(packet.verificationRequests)) &&
    exact(packet.truth, expectedPacketTruth());
  if (!structurallyValid || contract === null) return structurallyValid;
  if (!candidatePackage || !integrityAssessment ||
      !landMatrixThermalHistoricalSourceObservationAuthenticityRequestContractReceiptValid(
        contract) ||
      !landMatrixThermalHistoricalSourceEvidenceCandidatePackageEnvelopeValid(
        candidatePackage) ||
      !landMatrixThermalHistoricalSourceEvidencePackageIntegrityAssessmentValid(
        integrityAssessment)) return false;
  let expectedRequests;
  try {
    expectedRequests = expectedVerificationRequests(contract, candidatePackage,
      integrityAssessment);
  } catch {
    return false;
  }
  return packet.sourceContract.receiptDigest === contract.digest &&
    packet.candidatePackage.receiptDigest === candidatePackage.digest &&
    packet.artifactIntegrityAssessment.receiptDigest ===
      integrityAssessment.digest &&
    candidatePackage.sourceContract.receiptDigest ===
      contract.sourceArtifactIntegrityContract.sourceIntakeContract.digest &&
    integrityAssessment.sourceContract.receiptDigest ===
      contract.sourceArtifactIntegrityContract.digest &&
    integrityAssessment.candidatePackage.receiptDigest ===
      candidatePackage.digest &&
    integrityAssessment.status ===
      'ARTIFACT_DIGESTS_MATCH_CLAIMS_WITHOUT_EVIDENCE_VERIFICATION' &&
    exact(packet.verificationRequests, expectedRequests);
}

export function
createLandMatrixThermalHistoricalSourceObservationAuthenticityRequestPacket(
  contract, candidatePackage, integrityAssessment) {
  if (!landMatrixThermalHistoricalSourceObservationAuthenticityRequestContractReceiptValid(
      contract)) {
    throw new Error(
      'Observation-authenticity request packet needs an exact valid R101 contract');
  }
  if (!landMatrixThermalHistoricalSourceEvidenceCandidatePackageEnvelopeValid(
      candidatePackage)) {
    throw new Error(
      'Observation-authenticity request packet needs a valid R99 candidate envelope');
  }
  const structuralAssessment =
    assessLandMatrixThermalHistoricalSourceEvidenceCandidatePackage(
      contract.sourceArtifactIntegrityContract.sourceIntakeContract,
      candidatePackage);
  if (!structuralAssessment.structurallyReviewable) {
    throw new Error(
      'Observation-authenticity request packet needs a structurally reviewable candidate');
  }
  if (!landMatrixThermalHistoricalSourceEvidencePackageIntegrityAssessmentValid(
      integrityAssessment) || integrityAssessment.status !==
      'ARTIFACT_DIGESTS_MATCH_CLAIMS_WITHOUT_EVIDENCE_VERIFICATION' ||
      integrityAssessment.sourceContract.receiptDigest !==
        contract.sourceArtifactIntegrityContract.digest ||
      integrityAssessment.candidatePackage.receiptDigest !==
        candidatePackage.digest) {
    throw new Error(
      'Observation-authenticity request packet needs the exact matching R100 artifact-integrity assessment');
  }
  const verificationRequests = expectedVerificationRequests(contract,
    candidatePackage, integrityAssessment);
  const packet = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_REQUEST_PACKET_SCHEMA,
    status: 'AWAITING_INDEPENDENT_OBSERVATION_AUTHENTICITY_EVIDENCE',
    sourceContract: {
      schema: contract.schema,
      receiptDigest: contract.digest
    },
    candidatePackage: {
      schema: candidatePackage.schema,
      receiptDigest: candidatePackage.digest
    },
    artifactIntegrityAssessment: {
      schema: integrityAssessment.schema,
      receiptDigest: integrityAssessment.digest
    },
    verificationRequests,
    summary: packetSummary(verificationRequests),
    truth: expectedPacketTruth()
  };
  packet.digest = stableDigest(packet);
  if (!landMatrixThermalHistoricalSourceObservationAuthenticityRequestPacketValid(
      packet, contract, candidatePackage, integrityAssessment)) {
    throw new Error(
      'Observation-authenticity request packet failed validation');
  }
  return packet;
}

export function
matrixThermalHistoricalSourceObservationAuthenticityRequestDescription() {
  return {
    contractReceiptSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    authenticityRouteSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_ROUTE_SCHEMA,
    verificationRequestSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_VERIFICATION_REQUEST_SCHEMA,
    requestPacketSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_REQUEST_PACKET_SCHEMA,
    requestedCapabilityId: OBSERVATION_AUTHENTICITY_VERIFICATION_CAPABILITY_ID,
    nativeClaimEvidencePlansDeclared: true,
    requestPacketGenerationImplemented: true,
    independentVerifierRequired: true,
    trustedVerifierRegistryConfigured: false,
    observationAuthenticityVerificationImplemented: false,
    physicalMeaningReviewImplemented: false,
    requestPacketPersistenceImplemented: false,
    verificationDecisionPersistenceImplemented: false,
    candidateAdmissionPathImplemented: false,
    mutatesWorld: false,
    status: 'EXPERIMENTAL'
  };
}
