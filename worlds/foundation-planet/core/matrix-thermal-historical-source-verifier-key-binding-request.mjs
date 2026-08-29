import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_REQUEST_PACKET_SCHEMA,
  landMatrixThermalHistoricalSourceObservationAuthenticityRequestPacketValid
} from './matrix-thermal-historical-source-observation-authenticity-request.mjs?v=0.103.0-r103.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_ENVELOPE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA,
  landMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseContractReceiptValid,
  landMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseEnvelopeValid,
  landMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseSignatureAssessmentValid,
  verifyLandMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseSignature
} from './matrix-thermal-historical-source-observation-authenticity-signed-response.mjs?v=0.103.0-r103.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-verifier-key-binding-request-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_ROUTE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-verifier-key-binding-route/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-verifier-key-binding-request/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_PACKET_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-verifier-key-binding-request-packet/v1';

export const VERIFIER_KEY_BINDING_CAPABILITY_ID =
  'trust.verifier-key.bind';
export const VERIFIER_IDENTITY_RESOLUTION_CAPABILITY_ID =
  'identity.verifier.claim.resolve';
export const VERIFIER_INDEPENDENCE_VERIFICATION_CAPABILITY_ID =
  'evidence.verifier.independence.verify';

const UNKNOWN = 'UNKNOWN';
const NOT_AUTHORIZED = 'NOT_AUTHORIZED';
const NATIVE_EMISSION_MODE =
  'native-from-intact-r102-signed-response-contract';
const MIGRATION_EMISSION_MODE =
  'migration-from-exact-retained-r102-signed-response-contract';
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

function expectedRoutes(signedResponseContract) {
  return signedResponseContract.signedResponseRoutes.map(sourceRoute => {
    const eligible = sourceRoute.eligibleForSignedResponse === true;
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_ROUTE_SCHEMA,
      routeId: `verifier-key-binding:${sourceRoute.routeId}`,
      sourceSignedResponseRouteId: sourceRoute.routeId,
      requestBinding: clone(sourceRoute.requestBinding),
      nativeProofPlan: clone(sourceRoute.nativeProofPlan),
      eligibleForVerifierKeyBindingRequest: eligible,
      sourceSignatureAssessmentSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA
        : null,
      verifierKeyBindingRequestSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_SCHEMA
        : null,
      verifierKeyBindingRequestPacketSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_PACKET_SCHEMA
        : null,
      requiredVerifierKeyBindingCapabilityId: eligible
        ? VERIFIER_KEY_BINDING_CAPABILITY_ID : null,
      requiredVerifierIdentityResolutionCapabilityId: eligible
        ? VERIFIER_IDENTITY_RESOLUTION_CAPABILITY_ID : null,
      requiredVerifierIndependenceVerificationCapabilityId: eligible
        ? VERIFIER_INDEPENDENCE_VERIFICATION_CAPABILITY_ID : null,
      claimedIdentifierComparisonAvailable: eligible,
      trustedVerifierRegistryConfigured: false,
      trustedVerifierKeyBinding: null,
      trustedVerifierIdentity: null,
      verifierIndependenceEvidence: [],
      bindingDecision: null,
      verifierKeyBindingVerdict: UNKNOWN,
      verifierIdentityVerdict: UNKNOWN,
      verifierIndependenceVerdict: UNKNOWN,
      observationAuthenticityVerdict: UNKNOWN,
      provenanceVerdict: UNKNOWN,
      physicalMeaningReviewVerdict: UNKNOWN,
      admissionVerdict: NOT_AUTHORIZED
    };
  });
}

function expectedContractSummary(routes) {
  return {
    sourceR102SignedResponseContractCount: 1,
    verifierKeyBindingRouteCount: 28,
    verifierKeyBindingRequestEligibleRouteCount: routes.filter(route =>
      route.eligibleForVerifierKeyBindingRequest).length,
    authorityReviewRouteExcludedCount: routes.filter(route =>
      !route.eligibleForVerifierKeyBindingRequest).length,
    verifierKeyBindingRequestPacketCount: 0,
    trustedVerifierRegistryCount: 0,
    trustedVerifierKeyBindingCount: 0,
    trustedVerifierIdentityCount: 0,
    verifiedIndependentVerifierCount: 0,
    verifiedAuthenticObservationCount: 0,
    persistedRequestPacketCount: 0,
    claimedIdentifierComparisonImplemented: true,
    verifierKeyBindingRequestPacketGenerationImplemented: true,
    verifierKeyBindingImplemented: false,
    verifierIdentityResolutionImplemented: false,
    verifierIndependenceVerificationImplemented: false,
    observationAuthenticityVerificationImplemented: false,
    physicalMeaningReviewImplemented: false,
    candidateAdmissionPathImplemented: false
  };
}

const expectedContractTruth = () => ({
  exactR102SignedResponseContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourVerifierKeyBindingRequestRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  nativeClaimProofPlansPreserved: true,
  signatureIntegrityPassRequiredBeforeRequest: true,
  claimedIdentifierComparisonImplemented: true,
  claimedIdentifierEqualityIsCounterevidenceOnly: true,
  claimedIdentifierInequalityNotIndependenceProof: true,
  verifierKeyBindingRequestPacketGenerationImplemented: true,
  trustedVerifierRegistryConfigured: false,
  trustedVerifierKeyBindingImplemented: false,
  trustedVerifierKeyBound: false,
  verifierIdentityResolutionImplemented: false,
  claimedVerifierIdentityTrusted: false,
  verifierIndependenceVerificationImplemented: false,
  verifierIndependenceEstablished: false,
  observationAuthenticityEvidenceVerified: false,
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
landMatrixThermalHistoricalSourceVerifierKeyBindingRequestContractReceiptValid(
  receipt) {
  const source = receipt?.sourceSignedResponseContract;
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
        'sourceSignedResponseContract', 'verifierKeyBindingRoutes', 'summary',
        'emission', 'truth', 'digest']) ||
      !exactKeys(receipt.source, ['schema', 'receiptDigest']) ||
      !exactKeys(receipt.emission,
        ['mode', 'sourceWasExactRetainedSignedResponseContractMigration']) ||
      !landMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseContractReceiptValid(
        source)) return false;
  const routes = expectedRoutes(source);
  const migration = receipt.emission?.mode === MIGRATION_EMISSION_MODE;
  return receipt.status ===
      'verifier-key-binding-and-independence-evidence-requests-available-without-trust-authenticity-or-admission' &&
    exact(receipt.creationContext, source.creationContext) &&
    receipt.source.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_CONTRACT_RECEIPT_SCHEMA &&
    receipt.source.receiptDigest === source.digest &&
    exact(receipt.verifierKeyBindingRoutes, routes) &&
    exact(receipt.summary, expectedContractSummary(routes)) &&
    [NATIVE_EMISSION_MODE, MIGRATION_EMISSION_MODE]
      .includes(receipt.emission.mode) &&
    receipt.emission.sourceWasExactRetainedSignedResponseContractMigration ===
      migration && exact(receipt.truth, expectedContractTruth());
}

export function
createLandMatrixThermalHistoricalSourceVerifierKeyBindingRequestContractReceipt(
  creationContext, signedResponseContract, options = {}) {
  if (!landMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseContractReceiptValid(
      signedResponseContract) ||
      !exact(creationContext, signedResponseContract?.creationContext)) {
    throw new Error(
      'Verifier-key-binding request contract needs the exact attached R102 signed-response contract');
  }
  const routes = expectedRoutes(signedResponseContract);
  const migration =
    options.sourceWasExactRetainedSignedResponseContractMigration === true;
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    status:
      'verifier-key-binding-and-independence-evidence-requests-available-without-trust-authenticity-or-admission',
    creationContext: clone(creationContext),
    source: {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_CONTRACT_RECEIPT_SCHEMA,
      receiptDigest: signedResponseContract.digest
    },
    sourceSignedResponseContract: clone(signedResponseContract),
    verifierKeyBindingRoutes: routes,
    summary: expectedContractSummary(routes),
    emission: {
      mode: migration ? MIGRATION_EMISSION_MODE : NATIVE_EMISSION_MODE,
      sourceWasExactRetainedSignedResponseContractMigration: migration
    },
    truth: expectedContractTruth()
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalHistoricalSourceVerifierKeyBindingRequestContractReceiptValid(
      receipt)) {
    throw new Error('Verifier-key-binding request contract failed validation');
  }
  return receipt;
}

function expectedBindingRequests(contract, sourceRequestPacket,
  responseEnvelope, signatureAssessment) {
  const requestById = new Map(sourceRequestPacket.verificationRequests.map(
    request => [request.requestId, request]));
  const routeByCandidateRequestId = new Map(contract.verifierKeyBindingRoutes
    .map(route => [route.requestBinding.requestId, route]));
  return responseEnvelope.results.map(result => {
    const sourceRequest = requestById.get(result.requestId);
    const route = routeByCandidateRequestId.get(result.candidateRequestId);
    if (!sourceRequest || !route?.eligibleForVerifierKeyBindingRequest ||
        sourceRequest.candidateRequestId !== result.candidateRequestId ||
        !exact(sourceRequest.proofPlan, route.nativeProofPlan)) {
      throw new Error(
        `No exact R103 key-binding route for ${result.requestId}`);
    }
    const identifierCollision = sourceRequest.claimedProducerId ===
      responseEnvelope.claimedVerifier.claimedVerifierId;
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_SCHEMA,
      requestId: `verifier-key-binding:${result.requestId}`,
      sourceObservationAuthenticityRequestId: result.requestId,
      candidateRequestId: result.candidateRequestId,
      candidateClaimedProducerId: sourceRequest.claimedProducerId,
      claimedVerifierId:
        responseEnvelope.claimedVerifier.claimedVerifierId,
      claimedVerifierKeyId:
        responseEnvelope.claimedVerifier.claimedVerifierKeyId,
      claimedVerifierProducedAt:
        responseEnvelope.claimedVerifier.claimedProducedAt,
      publicKeySha256: signatureAssessment.cryptographic.publicKeySha256,
      sourceSignatureAssessmentDigest: signatureAssessment.digest,
      signatureIntegrityVerdict: 'PASS',
      candidateProducerIdentifierMatchesClaimedVerifierId:
        identifierCollision,
      identifierComparisonVerdict: identifierCollision
        ? 'LITERAL_IDENTIFIER_COLLISION'
        : 'NO_LITERAL_IDENTIFIER_COLLISION_WITHOUT_INDEPENDENCE_PROOF',
      counterevidence: identifierCollision
        ? ['claimed-verifier-id-matches-candidate-producer-id']
        : ['claimed-identifier-inequality-does-not-prove-independence'],
      requiredVerifierKeyBindingCapabilityId:
        VERIFIER_KEY_BINDING_CAPABILITY_ID,
      requiredVerifierIdentityResolutionCapabilityId:
        VERIFIER_IDENTITY_RESOLUTION_CAPABILITY_ID,
      requiredVerifierIndependenceVerificationCapabilityId:
        VERIFIER_INDEPENDENCE_VERIFICATION_CAPABILITY_ID,
      trustedVerifierRegistryBinding: null,
      verifierIdentityEvidence: [],
      verifierIndependenceEvidence: [],
      bindingDecision: null,
      verifierKeyBindingVerdict: UNKNOWN,
      verifierIdentityVerdict: UNKNOWN,
      verifierIndependenceVerdict: UNKNOWN,
      observationAuthenticityVerdict: UNKNOWN,
      provenanceVerdict: UNKNOWN,
      physicalMeaningReviewVerdict: UNKNOWN,
      admissionVerdict: NOT_AUTHORIZED
    };
  });
}

function bindingRequestShapeValid(request) {
  if (!exactKeys(request, ['schema', 'requestId',
      'sourceObservationAuthenticityRequestId', 'candidateRequestId',
      'candidateClaimedProducerId', 'claimedVerifierId',
      'claimedVerifierKeyId', 'claimedVerifierProducedAt', 'publicKeySha256',
      'sourceSignatureAssessmentDigest', 'signatureIntegrityVerdict',
      'candidateProducerIdentifierMatchesClaimedVerifierId',
      'identifierComparisonVerdict', 'counterevidence',
      'requiredVerifierKeyBindingCapabilityId',
      'requiredVerifierIdentityResolutionCapabilityId',
      'requiredVerifierIndependenceVerificationCapabilityId',
      'trustedVerifierRegistryBinding', 'verifierIdentityEvidence',
      'verifierIndependenceEvidence', 'bindingDecision',
      'verifierKeyBindingVerdict', 'verifierIdentityVerdict',
      'verifierIndependenceVerdict', 'observationAuthenticityVerdict',
      'provenanceVerdict', 'physicalMeaningReviewVerdict',
      'admissionVerdict'])) return false;
  const collision =
    request.candidateProducerIdentifierMatchesClaimedVerifierId === true;
  return request.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_SCHEMA &&
    nonEmptyText(request.sourceObservationAuthenticityRequestId) &&
    request.requestId ===
      `verifier-key-binding:${request.sourceObservationAuthenticityRequestId}` &&
    nonEmptyText(request.candidateRequestId) &&
    nonEmptyText(request.candidateClaimedProducerId, 256) &&
    nonEmptyText(request.claimedVerifierId, 256) &&
    nonEmptyText(request.claimedVerifierKeyId, 256) &&
    isoTimestamp(request.claimedVerifierProducedAt) &&
    sha256Digest(request.publicKeySha256) &&
    fnvDigest(request.sourceSignatureAssessmentDigest) &&
    request.signatureIntegrityVerdict === 'PASS' &&
    request.identifierComparisonVerdict === (collision
      ? 'LITERAL_IDENTIFIER_COLLISION'
      : 'NO_LITERAL_IDENTIFIER_COLLISION_WITHOUT_INDEPENDENCE_PROOF') &&
    exact(request.counterevidence, collision
      ? ['claimed-verifier-id-matches-candidate-producer-id']
      : ['claimed-identifier-inequality-does-not-prove-independence']) &&
    request.requiredVerifierKeyBindingCapabilityId ===
      VERIFIER_KEY_BINDING_CAPABILITY_ID &&
    request.requiredVerifierIdentityResolutionCapabilityId ===
      VERIFIER_IDENTITY_RESOLUTION_CAPABILITY_ID &&
    request.requiredVerifierIndependenceVerificationCapabilityId ===
      VERIFIER_INDEPENDENCE_VERIFICATION_CAPABILITY_ID &&
    request.trustedVerifierRegistryBinding === null &&
    Array.isArray(request.verifierIdentityEvidence) &&
    request.verifierIdentityEvidence.length === 0 &&
    Array.isArray(request.verifierIndependenceEvidence) &&
    request.verifierIndependenceEvidence.length === 0 &&
    request.bindingDecision === null &&
    request.verifierKeyBindingVerdict === UNKNOWN &&
    request.verifierIdentityVerdict === UNKNOWN &&
    request.verifierIndependenceVerdict === UNKNOWN &&
    request.observationAuthenticityVerdict === UNKNOWN &&
    request.provenanceVerdict === UNKNOWN &&
    request.physicalMeaningReviewVerdict === UNKNOWN &&
    request.admissionVerdict === NOT_AUTHORIZED;
}

function packetSummary(requests) {
  return {
    verifierKeyBindingRequestCount: requests.length,
    literalCandidateProducerVerifierIdentifierCollisionCount: requests.filter(
      request =>
        request.candidateProducerIdentifierMatchesClaimedVerifierId).length,
    noLiteralIdentifierCollisionCount: requests.filter(request =>
      !request.candidateProducerIdentifierMatchesClaimedVerifierId).length,
    signatureIntegrityPassCount: 1,
    trustedVerifierRegistryBindingCount: 0,
    trustedVerifierKeyBindingCount: 0,
    trustedVerifierIdentityCount: 0,
    verifiedIndependentVerifierCount: 0,
    verifiedAuthenticObservationCount: 0,
    persistedRequestPacketCount: 0
  };
}

const expectedPacketTruth = () => ({
  exactR103VerifierKeyBindingRequestContractBound: true,
  exactR101RequestPacketBound: true,
  exactR102SignedResponseEnvelopeBound: true,
  exactR102SignatureAssessmentBound: true,
  detachedEd25519SignatureVerificationPerformed: true,
  signatureIntegrityVerified: true,
  signatureIntegrityPassMeansSuppliedKeyMatchOnly: true,
  claimedIdentifierComparisonPerformed: true,
  claimedIdentifierEqualityIsCounterevidenceOnly: true,
  claimedIdentifierInequalityNotIndependenceProof: true,
  callerSuppliedPublicKeyTrusted: false,
  trustedVerifierKeyBound: false,
  claimedVerifierIdentityTrusted: false,
  verifierIndependenceEstablished: false,
  observationAuthenticityEvidenceVerified: false,
  observationAuthenticityVerified: false,
  provenanceVerified: false,
  physicalMeaningVerified: false,
  evidenceVerified: false,
  authoritySelfAttestationAccepted: false,
  rawPublicKeyPersisted: false,
  signatureBytesPersisted: false,
  requestPacketPersisted: false,
  verificationDecisionPersisted: false,
  candidateAdmissionPerformed: false,
  admissionAuthorityGranted: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  worldMutationPerformed: false
});

export function
landMatrixThermalHistoricalSourceVerifierKeyBindingRequestPacketValid(
  packet, contract = null, sourceRequestPacket = null,
  responseEnvelope = null, signatureAssessment = null) {
  if (!digestValid(packet,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_PACKET_SCHEMA) ||
      !exactKeys(packet, ['schema', 'status', 'sourceContract',
        'sourceRequestPacket', 'sourceResponseEnvelope',
        'sourceSignatureAssessment', 'claimedVerifier', 'verifiedSignature',
        'verifierKeyBindingRequests', 'summary', 'truth', 'digest']) ||
      !exactKeys(packet.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(packet.sourceRequestPacket, ['schema', 'receiptDigest']) ||
      !exactKeys(packet.sourceResponseEnvelope,
        ['schema', 'receiptDigest']) ||
      !exactKeys(packet.sourceSignatureAssessment,
        ['schema', 'receiptDigest']) ||
      !exactKeys(packet.claimedVerifier,
        ['claimedVerifierId', 'claimedVerifierKeyId', 'claimedProducedAt']) ||
      !exactKeys(packet.verifiedSignature, ['signatureAlgorithm',
        'publicKeyFormat', 'publicKeySha256', 'signatureSha256',
        'signatureIntegrityVerdict']) ||
      !Array.isArray(packet.verifierKeyBindingRequests) ||
      packet.verifierKeyBindingRequests.length === 0 ||
      packet.verifierKeyBindingRequests.length > 24 ||
      !packet.verifierKeyBindingRequests.every(bindingRequestShapeValid)) {
    return false;
  }
  const collisionCount = packet.verifierKeyBindingRequests.filter(request =>
    request.candidateProducerIdentifierMatchesClaimedVerifierId).length;
  const structural = packet.status === (collisionCount > 0
      ? 'TRUST_BINDING_REQUIRED_WITH_CANDIDATE_PRODUCER_IDENTIFIER_COLLISION'
      : 'TRUST_BINDING_AND_INDEPENDENCE_EVIDENCE_REQUIRED') &&
    packet.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(packet.sourceContract.receiptDigest) &&
    packet.sourceRequestPacket.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_REQUEST_PACKET_SCHEMA &&
    fnvDigest(packet.sourceRequestPacket.receiptDigest) &&
    packet.sourceResponseEnvelope.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_ENVELOPE_SCHEMA &&
    fnvDigest(packet.sourceResponseEnvelope.receiptDigest) &&
    packet.sourceSignatureAssessment.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA &&
    fnvDigest(packet.sourceSignatureAssessment.receiptDigest) &&
    nonEmptyText(packet.claimedVerifier.claimedVerifierId, 256) &&
    nonEmptyText(packet.claimedVerifier.claimedVerifierKeyId, 256) &&
    isoTimestamp(packet.claimedVerifier.claimedProducedAt) &&
    packet.verifiedSignature.signatureAlgorithm === 'Ed25519' &&
    packet.verifiedSignature.publicKeyFormat === 'raw-ed25519-32-byte' &&
    sha256Digest(packet.verifiedSignature.publicKeySha256) &&
    sha256Digest(packet.verifiedSignature.signatureSha256) &&
    packet.verifiedSignature.signatureIntegrityVerdict === 'PASS' &&
    new Set(packet.verifierKeyBindingRequests.map(request =>
      request.requestId)).size === packet.verifierKeyBindingRequests.length &&
    exact(packet.summary,
      packetSummary(packet.verifierKeyBindingRequests)) &&
    exact(packet.truth, expectedPacketTruth());
  if (!structural || contract === null) return structural;
  if (!sourceRequestPacket || !responseEnvelope || !signatureAssessment ||
      !landMatrixThermalHistoricalSourceVerifierKeyBindingRequestContractReceiptValid(
        contract) ||
      !landMatrixThermalHistoricalSourceObservationAuthenticityRequestPacketValid(
        sourceRequestPacket) ||
      !landMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseEnvelopeValid(
        responseEnvelope, contract.sourceSignedResponseContract,
        sourceRequestPacket) ||
      !landMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseSignatureAssessmentValid(
        signatureAssessment) ||
      signatureAssessment.status !==
        'SIGNED_RESPONSE_SIGNATURE_VALID_WITH_UNTRUSTED_CALLER_SUPPLIED_KEY' ||
      signatureAssessment.verdicts.signatureIntegrityVerdict !== 'PASS') {
    return false;
  }
  let expectedRequests;
  try {
    expectedRequests = expectedBindingRequests(contract, sourceRequestPacket,
      responseEnvelope, signatureAssessment);
  } catch {
    return false;
  }
  return contract.source.receiptDigest ===
      contract.sourceSignedResponseContract.digest &&
    sourceRequestPacket.sourceContract.receiptDigest ===
      contract.sourceSignedResponseContract.sourceRequestContract.digest &&
    responseEnvelope.sourceContract.receiptDigest ===
      contract.sourceSignedResponseContract.digest &&
    responseEnvelope.sourceRequestPacket.receiptDigest ===
      sourceRequestPacket.digest &&
    signatureAssessment.sourceContract.receiptDigest ===
      contract.sourceSignedResponseContract.digest &&
    signatureAssessment.sourceRequestPacket.receiptDigest ===
      sourceRequestPacket.digest &&
    signatureAssessment.sourceResponseEnvelope.receiptDigest ===
      responseEnvelope.digest &&
    exact(packet.sourceContract, {
      schema: contract.schema,
      receiptDigest: contract.digest
    }) &&
    exact(packet.sourceRequestPacket, {
      schema: sourceRequestPacket.schema,
      receiptDigest: sourceRequestPacket.digest
    }) &&
    exact(packet.sourceResponseEnvelope, {
      schema: responseEnvelope.schema,
      receiptDigest: responseEnvelope.digest
    }) &&
    exact(packet.sourceSignatureAssessment, {
      schema: signatureAssessment.schema,
      receiptDigest: signatureAssessment.digest
    }) &&
    exact(packet.claimedVerifier, responseEnvelope.claimedVerifier) &&
    exact(packet.verifiedSignature, {
      signatureAlgorithm:
        signatureAssessment.cryptographic.signatureAlgorithm,
      publicKeyFormat: signatureAssessment.cryptographic.publicKeyFormat,
      publicKeySha256: signatureAssessment.cryptographic.publicKeySha256,
      signatureSha256: signatureAssessment.cryptographic.signatureSha256,
      signatureIntegrityVerdict: 'PASS'
    }) && exact(packet.verifierKeyBindingRequests, expectedRequests);
}

export async function
createLandMatrixThermalHistoricalSourceVerifierKeyBindingRequestPacket(
  contract, sourceRequestPacket, responseEnvelope, signatureInput) {
  if (!landMatrixThermalHistoricalSourceVerifierKeyBindingRequestContractReceiptValid(
      contract) ||
      !landMatrixThermalHistoricalSourceObservationAuthenticityRequestPacketValid(
        sourceRequestPacket) ||
      !landMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseEnvelopeValid(
        responseEnvelope, contract?.sourceSignedResponseContract,
        sourceRequestPacket)) {
    throw new Error(
      'Verifier-key-binding request packet needs exact R103, R101, and R102 sources');
  }
  const signatureAssessment =
    await verifyLandMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseSignature(
      contract.sourceSignedResponseContract, sourceRequestPacket,
      responseEnvelope, signatureInput);
  if (signatureAssessment.status !==
      'SIGNED_RESPONSE_SIGNATURE_VALID_WITH_UNTRUSTED_CALLER_SUPPLIED_KEY' ||
      signatureAssessment.verdicts.signatureIntegrityVerdict !== 'PASS') {
    throw new Error(
      'Verifier-key-binding requests require an actual R102 signature-integrity PASS');
  }
  const requests = expectedBindingRequests(contract, sourceRequestPacket,
    responseEnvelope, signatureAssessment);
  const collisionCount = requests.filter(request =>
    request.candidateProducerIdentifierMatchesClaimedVerifierId).length;
  const packet = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_PACKET_SCHEMA,
    status: collisionCount > 0
      ? 'TRUST_BINDING_REQUIRED_WITH_CANDIDATE_PRODUCER_IDENTIFIER_COLLISION'
      : 'TRUST_BINDING_AND_INDEPENDENCE_EVIDENCE_REQUIRED',
    sourceContract: {
      schema: contract.schema,
      receiptDigest: contract.digest
    },
    sourceRequestPacket: {
      schema: sourceRequestPacket.schema,
      receiptDigest: sourceRequestPacket.digest
    },
    sourceResponseEnvelope: {
      schema: responseEnvelope.schema,
      receiptDigest: responseEnvelope.digest
    },
    sourceSignatureAssessment: {
      schema: signatureAssessment.schema,
      receiptDigest: signatureAssessment.digest
    },
    claimedVerifier: clone(responseEnvelope.claimedVerifier),
    verifiedSignature: {
      signatureAlgorithm:
        signatureAssessment.cryptographic.signatureAlgorithm,
      publicKeyFormat: signatureAssessment.cryptographic.publicKeyFormat,
      publicKeySha256: signatureAssessment.cryptographic.publicKeySha256,
      signatureSha256: signatureAssessment.cryptographic.signatureSha256,
      signatureIntegrityVerdict: 'PASS'
    },
    verifierKeyBindingRequests: requests,
    summary: packetSummary(requests),
    truth: expectedPacketTruth()
  };
  packet.digest = stableDigest(packet);
  if (!landMatrixThermalHistoricalSourceVerifierKeyBindingRequestPacketValid(
      packet, contract, sourceRequestPacket, responseEnvelope,
      signatureAssessment)) {
    throw new Error('Verifier-key-binding request packet failed validation');
  }
  return packet;
}

export function
matrixThermalHistoricalSourceVerifierKeyBindingRequestDescription() {
  return {
    contractReceiptSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    routeSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_ROUTE_SCHEMA,
    requestSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_SCHEMA,
    requestPacketSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_PACKET_SCHEMA,
    verifierKeyBindingCapabilityId: VERIFIER_KEY_BINDING_CAPABILITY_ID,
    verifierIdentityResolutionCapabilityId:
      VERIFIER_IDENTITY_RESOLUTION_CAPABILITY_ID,
    verifierIndependenceVerificationCapabilityId:
      VERIFIER_INDEPENDENCE_VERIFICATION_CAPABILITY_ID,
    signatureIntegrityPassRequiredBeforeRequest: true,
    claimedIdentifierComparisonImplemented: true,
    claimedIdentifierEqualityIsCounterevidenceOnly: true,
    claimedIdentifierInequalityNotIndependenceProof: true,
    trustedVerifierRegistryConfigured: false,
    trustedVerifierKeyBindingImplemented: false,
    verifierIdentityResolutionImplemented: false,
    verifierIndependenceVerificationImplemented: false,
    observationAuthenticityVerificationImplemented: false,
    physicalMeaningReviewImplemented: false,
    requestPacketPersisted: false,
    candidateAdmissionPathImplemented: false,
    mutatesWorld: false
  };
}
