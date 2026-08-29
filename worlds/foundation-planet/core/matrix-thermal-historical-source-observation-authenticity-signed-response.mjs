import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_REQUEST_PACKET_SCHEMA,
  landMatrixThermalHistoricalSourceObservationAuthenticityRequestContractReceiptValid,
  landMatrixThermalHistoricalSourceObservationAuthenticityRequestPacketValid
} from './matrix-thermal-historical-source-observation-authenticity-request.mjs?v=0.102.0-r102.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-observation-authenticity-signed-response-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_ROUTE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-observation-authenticity-signed-response-route/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_RESULT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-observation-authenticity-signed-response-result/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_ENVELOPE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-observation-authenticity-signed-response-envelope/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_SIGNATURE_INPUT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-observation-authenticity-signed-response-signature-input/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-observation-authenticity-signed-response-signature-assessment/v1';

export const SIGNED_RESPONSE_ENVELOPE_VALIDATION_CAPABILITY_ID =
  'evidence.observation-authenticity.response-envelope.validate';
export const SIGNED_RESPONSE_SIGNATURE_VERIFICATION_CAPABILITY_ID =
  'evidence.observation-authenticity.response-signature.verify';
export const TRUSTED_VERIFIER_KEY_BINDING_CAPABILITY_ID =
  'trust.verifier-key.bind';
export const SIGNED_RESPONSE_MAX_CHARACTERS = 65_536;
export const ED25519_RAW_PUBLIC_KEY_BYTES = 32;
export const ED25519_SIGNATURE_BYTES = 64;

const SIGNATURE_ALGORITHM = 'Ed25519';
const PUBLIC_KEY_FORMAT = 'raw-ed25519-32-byte';
const NATIVE_EMISSION_MODE = 'native-from-intact-r101-request-contract';
const MIGRATION_EMISSION_MODE =
  'migration-from-exact-retained-r101-request-contract';
const UNKNOWN = 'UNKNOWN';
const NOT_AUTHORIZED = 'NOT_AUTHORIZED';
const ALLOWED_CLAIMED_DECISIONS = [
  'AUTHENTIC',
  'NOT_AUTHENTIC',
  'INCONCLUSIVE'
];
const CLAIMED_PROOF_SURFACES = Object.freeze({
  persistence: 'save-restart-reload-comparison',
  'static structure': 'direct-source-and-schema-inspection',
  transport: 'sender-receiver-receipt-pair'
});
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

function expectedRoutes(requestContract) {
  return requestContract.authenticityRoutes.map(sourceRoute => {
    const eligible =
      sourceRoute.eligibleForObservationAuthenticityRequest === true;
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_ROUTE_SCHEMA,
      routeId: `signed-response:${sourceRoute.routeId}`,
      sourceAuthenticityRouteId: sourceRoute.routeId,
      requestBinding: clone(sourceRoute.requestBinding),
      nativeProofPlan: clone(sourceRoute.proofPlan),
      eligibleForSignedResponse: eligible,
      responseEnvelopeValidationCapabilityId: eligible
        ? SIGNED_RESPONSE_ENVELOPE_VALIDATION_CAPABILITY_ID : null,
      responseSignatureVerificationCapabilityId: eligible
        ? SIGNED_RESPONSE_SIGNATURE_VERIFICATION_CAPABILITY_ID : null,
      signedResponseEnvelopeSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_ENVELOPE_SCHEMA
        : null,
      signatureInputSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_SIGNATURE_INPUT_SCHEMA
        : null,
      signatureAssessmentSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA
        : null,
      signatureAlgorithm: eligible ? SIGNATURE_ALGORITHM : null,
      publicKeyFormat: eligible ? PUBLIC_KEY_FORMAT : null,
      maximumCanonicalResponseCharacters: eligible
        ? SIGNED_RESPONSE_MAX_CHARACTERS : 0,
      trustedVerifierKeyBindingCapabilityId: eligible
        ? TRUSTED_VERIFIER_KEY_BINDING_CAPABILITY_ID : null,
      trustedVerifierKeyBindingAvailable: false,
      claimedVerifierIdentity: null,
      signedResponseEnvelope: null,
      signatureAssessment: null,
      signatureIntegrityVerdict: UNKNOWN,
      trustedVerifierKeyVerdict: UNKNOWN,
      verifierIdentityTrustVerdict: UNKNOWN,
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
    sourceR101RequestContractCount: 1,
    signedResponseRouteCount: 28,
    signedResponseEligibleRouteCount: routes.filter(route =>
      route.eligibleForSignedResponse).length,
    authorityReviewRouteExcludedCount: routes.filter(route =>
      !route.eligibleForSignedResponse).length,
    signatureAlgorithmCount: new Set(routes.filter(route =>
      route.eligibleForSignedResponse).map(route =>
      route.signatureAlgorithm)).size,
    signedResponseEnvelopeCount: 0,
    signatureAssessmentCount: 0,
    signatureIntegrityPassCount: 0,
    trustedVerifierKeyCount: 0,
    trustedVerifierIdentityCount: 0,
    independentVerifierCount: 0,
    verifiedAuthenticObservationCount: 0,
    persistedResponseCount: 0,
    signedResponseEnvelopeValidationImplemented: true,
    detachedSignatureVerificationImplemented: true,
    trustedVerifierKeyBindingImplemented: false,
    observationAuthenticityVerificationImplemented: false,
    physicalMeaningReviewImplemented: false,
    candidateAdmissionPathImplemented: false
  };
}

const expectedContractTruth = () => ({
  exactR101RequestContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourSignedResponseRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  nativeClaimProofPlansPreserved: true,
  signedResponseEnvelopeValidationImplemented: true,
  detachedEd25519SignatureVerificationImplemented: true,
  callerSuppliedRawPublicKeyOnly: true,
  signatureIntegrityPassMeansSuppliedKeyMatchOnly: true,
  trustedVerifierKeyBindingImplemented: false,
  trustedVerifierKeyBound: false,
  claimedVerifierIdentityTrusted: false,
  verifierIndependenceEstablished: false,
  observationAuthenticityEvidenceVerified: false,
  observationAuthenticityVerified: false,
  provenanceVerified: false,
  physicalMeaningReviewImplemented: false,
  evidenceVerified: false,
  authoritySelfAttestationAccepted: false,
  signedResponsesPersisted: false,
  signatureAssessmentsPersisted: false,
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
landMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseContractReceiptValid(
  receipt) {
  const source = receipt?.sourceRequestContract;
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
        'sourceRequestContract', 'signedResponseRoutes', 'summary', 'emission',
        'truth', 'digest']) ||
      !exactKeys(receipt.source, ['schema', 'receiptDigest']) ||
      !exactKeys(receipt.emission,
        ['mode', 'sourceWasExactRetainedRequestContractMigration']) ||
      !landMatrixThermalHistoricalSourceObservationAuthenticityRequestContractReceiptValid(
        source)) return false;
  const routes = expectedRoutes(source);
  const migration = receipt.emission?.mode === MIGRATION_EMISSION_MODE;
  return receipt.status ===
      'signed-authenticity-response-integrity-contract-available-without-trusted-key-authenticity-or-admission' &&
    exact(receipt.creationContext, source.creationContext) &&
    receipt.source.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_REQUEST_CONTRACT_RECEIPT_SCHEMA &&
    receipt.source.receiptDigest === source.digest &&
    exact(receipt.signedResponseRoutes, routes) &&
    exact(receipt.summary, expectedContractSummary(routes)) &&
    [NATIVE_EMISSION_MODE, MIGRATION_EMISSION_MODE]
      .includes(receipt.emission.mode) &&
    receipt.emission.sourceWasExactRetainedRequestContractMigration ===
      migration && exact(receipt.truth, expectedContractTruth());
}

export function
createLandMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseContractReceipt(
  creationContext, requestContract, options = {}) {
  if (!landMatrixThermalHistoricalSourceObservationAuthenticityRequestContractReceiptValid(
      requestContract) ||
      !exact(creationContext, requestContract?.creationContext)) {
    throw new Error(
      'Signed-response contract needs the exact attached R101 request contract');
  }
  const routes = expectedRoutes(requestContract);
  const migration =
    options.sourceWasExactRetainedRequestContractMigration === true;
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_CONTRACT_RECEIPT_SCHEMA,
    status:
      'signed-authenticity-response-integrity-contract-available-without-trusted-key-authenticity-or-admission',
    creationContext: clone(creationContext),
    source: {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_REQUEST_CONTRACT_RECEIPT_SCHEMA,
      receiptDigest: requestContract.digest
    },
    sourceRequestContract: clone(requestContract),
    signedResponseRoutes: routes,
    summary: expectedContractSummary(routes),
    emission: {
      mode: migration ? MIGRATION_EMISSION_MODE : NATIVE_EMISSION_MODE,
      sourceWasExactRetainedRequestContractMigration: migration
    },
    truth: expectedContractTruth()
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseContractReceiptValid(
      receipt)) {
    throw new Error('Signed-response contract failed validation');
  }
  return receipt;
}

function requestMatchesContract(contract, request) {
  const route = contract.sourceRequestContract.authenticityRoutes.find(item =>
    item.requestBinding.requestId === request.candidateRequestId);
  return route?.eligibleForObservationAuthenticityRequest === true &&
    request.requestId ===
      `observation-authenticity:${route.requestBinding.requestId}` &&
    request.criterionKey === route.requestBinding.criterionKey &&
    request.sourceCapabilityId === route.requestBinding.capabilityId &&
    request.nativeEvidenceKind === route.requestBinding.nativeEvidenceKind &&
    request.expectedArtifactKind === route.requestBinding.expectedArtifactKind &&
    exact(request.proofPlan, route.proofPlan);
}

function resultShapeValid(result) {
  return exactKeys(result, ['schema', 'requestId', 'candidateRequestId',
      'nativeEvidenceKind', 'claimedProofSurface',
      'claimedEvidenceRecordDigest', 'claimedEvidenceSourcePointer',
      'claimedEvidenceObservedAt', 'claimedEvidenceSummary',
      'claimedObservationAuthenticityDecision', 'signatureIntegrityVerdict',
      'trustedVerifierKeyVerdict', 'verifierIdentityTrustVerdict',
      'verifierIndependenceVerdict', 'observationAuthenticityVerdict',
      'provenanceVerdict', 'physicalMeaningReviewVerdict',
      'admissionVerdict']) &&
    result.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_RESULT_SCHEMA &&
    nonEmptyText(result.requestId) &&
    nonEmptyText(result.candidateRequestId) &&
    Object.hasOwn(CLAIMED_PROOF_SURFACES, result.nativeEvidenceKind) &&
    result.claimedProofSurface ===
      CLAIMED_PROOF_SURFACES[result.nativeEvidenceKind] &&
    sha256Digest(result.claimedEvidenceRecordDigest) &&
    nonEmptyText(result.claimedEvidenceSourcePointer) &&
    isoTimestamp(result.claimedEvidenceObservedAt) &&
    nonEmptyText(result.claimedEvidenceSummary, 2048) &&
    ALLOWED_CLAIMED_DECISIONS.includes(
      result.claimedObservationAuthenticityDecision) &&
    result.signatureIntegrityVerdict === UNKNOWN &&
    result.trustedVerifierKeyVerdict === UNKNOWN &&
    result.verifierIdentityTrustVerdict === UNKNOWN &&
    result.verifierIndependenceVerdict === UNKNOWN &&
    result.observationAuthenticityVerdict === UNKNOWN &&
    result.provenanceVerdict === UNKNOWN &&
    result.physicalMeaningReviewVerdict === UNKNOWN &&
    result.admissionVerdict === NOT_AUTHORIZED;
}

function envelopeSummary(results) {
  return {
    resultCount: results.length,
    claimedAuthenticCount: results.filter(result =>
      result.claimedObservationAuthenticityDecision === 'AUTHENTIC').length,
    claimedNotAuthenticCount: results.filter(result =>
      result.claimedObservationAuthenticityDecision === 'NOT_AUTHENTIC').length,
    claimedInconclusiveCount: results.filter(result =>
      result.claimedObservationAuthenticityDecision === 'INCONCLUSIVE').length,
    claimedEvidenceRecordDescriptorCount: results.length,
    signatureIntegrityPassCount: 0,
    trustedVerifierKeyCount: 0,
    trustedVerifierIdentityCount: 0,
    independentVerifierCount: 0,
    verifiedAuthenticObservationCount: 0,
    persistedResponseCount: 0
  };
}

const expectedEnvelopeTruth = () => ({
  exactR102SignedResponseContractBound: true,
  exactR101RequestPacketBound: true,
  responseEnvelopeStructurallyValidated: true,
  claimedEvidenceDescriptorsOnly: true,
  detachedSignatureVerified: false,
  callerSuppliedPublicKeyTrusted: false,
  claimedVerifierIdentityTrusted: false,
  verifierIndependenceEstablished: false,
  observationAuthenticityEvidenceVerified: false,
  observationAuthenticityVerified: false,
  provenanceVerified: false,
  physicalMeaningVerified: false,
  evidenceVerified: false,
  authoritySelfAttestationAccepted: false,
  responseEnvelopePersisted: false,
  verificationDecisionPersisted: false,
  candidateAdmissionPerformed: false,
  admissionAuthorityGranted: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  worldMutationPerformed: false
});

export function
landMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseEnvelopeValid(
  envelope, contract = null, requestPacket = null) {
  if (!digestValid(envelope,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_ENVELOPE_SCHEMA) ||
      !exactKeys(envelope, ['schema', 'status', 'sourceContract',
        'sourceRequestPacket', 'responseId', 'claimedVerifier', 'results',
        'summary', 'truth', 'digest']) ||
      !exactKeys(envelope.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(envelope.sourceRequestPacket, ['schema', 'receiptDigest']) ||
      !exactKeys(envelope.claimedVerifier,
        ['claimedVerifierId', 'claimedVerifierKeyId', 'claimedProducedAt']) ||
      !Array.isArray(envelope.results) || !envelope.results.length ||
      envelope.results.length > 24 ||
      !envelope.results.every(resultShapeValid)) return false;
  const requestIds = envelope.results.map(result => result.requestId);
  const structural = envelope.status ===
      'UNTRUSTED_SIGNED_RESPONSE_AWAITING_SIGNATURE_INTEGRITY_CHECK_AND_TRUST' &&
    envelope.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(envelope.sourceContract.receiptDigest) &&
    envelope.sourceRequestPacket.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_REQUEST_PACKET_SCHEMA &&
    fnvDigest(envelope.sourceRequestPacket.receiptDigest) &&
    nonEmptyText(envelope.responseId, 256) &&
    nonEmptyText(envelope.claimedVerifier.claimedVerifierId, 256) &&
    nonEmptyText(envelope.claimedVerifier.claimedVerifierKeyId, 256) &&
    isoTimestamp(envelope.claimedVerifier.claimedProducedAt) &&
    new Set(requestIds).size === requestIds.length &&
    exact(envelope.summary, envelopeSummary(envelope.results)) &&
    exact(envelope.truth, expectedEnvelopeTruth()) &&
    JSON.stringify(envelope).length <= SIGNED_RESPONSE_MAX_CHARACTERS;
  if (!structural || contract === null) return structural;
  if (!requestPacket ||
      !landMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseContractReceiptValid(
        contract) ||
      !landMatrixThermalHistoricalSourceObservationAuthenticityRequestPacketValid(
        requestPacket) || requestPacket.sourceContract.receiptDigest !==
        contract.sourceRequestContract.digest ||
      envelope.sourceContract.receiptDigest !== contract.digest ||
      envelope.sourceRequestPacket.receiptDigest !== requestPacket.digest ||
      envelope.results.length !== requestPacket.verificationRequests.length) {
    return false;
  }
  const requestById = new Map(requestPacket.verificationRequests.map(request =>
    [request.requestId, request]));
  return requestPacket.verificationRequests.every(request =>
      requestMatchesContract(contract, request)) &&
    envelope.results.every(result => {
      const request = requestById.get(result.requestId);
      return request && result.candidateRequestId === request.candidateRequestId &&
        result.nativeEvidenceKind === request.nativeEvidenceKind;
    });
}

export function
createLandMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseEnvelope(
  contract, requestPacket, input) {
  if (!landMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseContractReceiptValid(
      contract) ||
      !landMatrixThermalHistoricalSourceObservationAuthenticityRequestPacketValid(
        requestPacket) || requestPacket.sourceContract.receiptDigest !==
        contract.sourceRequestContract.digest) {
    throw new Error(
      'Signed-response envelope needs an exact R102 contract and its R101 request packet');
  }
  if (!exactKeys(input, ['responseId', 'claimedVerifierId',
      'claimedVerifierKeyId', 'claimedProducedAt', 'results']) ||
      !nonEmptyText(input.responseId, 256) ||
      !nonEmptyText(input.claimedVerifierId, 256) ||
      !nonEmptyText(input.claimedVerifierKeyId, 256) ||
      !isoTimestamp(input.claimedProducedAt) ||
      !Array.isArray(input.results) ||
      input.results.length !== requestPacket.verificationRequests.length) {
    throw new Error(
      'Signed-response envelope input must cover each R101 request exactly once');
  }
  const suppliedByRequest = new Map();
  for (const result of input.results) {
    if (!exactKeys(result, ['requestId', 'claimedProofSurface',
        'claimedEvidenceRecordDigest', 'claimedEvidenceSourcePointer',
        'claimedEvidenceObservedAt', 'claimedEvidenceSummary',
        'claimedObservationAuthenticityDecision']) ||
        suppliedByRequest.has(result.requestId)) {
      throw new Error(
        'Signed-response envelope input must contain one exact result per request');
    }
    suppliedByRequest.set(result.requestId, result);
  }
  const results = requestPacket.verificationRequests.map(request => {
    if (!requestMatchesContract(contract, request)) {
      throw new Error('R101 request packet semantics do not match R102');
    }
    const supplied = suppliedByRequest.get(request.requestId);
    const result = {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_RESULT_SCHEMA,
      requestId: request.requestId,
      candidateRequestId: request.candidateRequestId,
      nativeEvidenceKind: request.nativeEvidenceKind,
      claimedProofSurface: supplied?.claimedProofSurface,
      claimedEvidenceRecordDigest: supplied?.claimedEvidenceRecordDigest,
      claimedEvidenceSourcePointer: supplied?.claimedEvidenceSourcePointer,
      claimedEvidenceObservedAt: supplied?.claimedEvidenceObservedAt,
      claimedEvidenceSummary: supplied?.claimedEvidenceSummary,
      claimedObservationAuthenticityDecision:
        supplied?.claimedObservationAuthenticityDecision,
      signatureIntegrityVerdict: UNKNOWN,
      trustedVerifierKeyVerdict: UNKNOWN,
      verifierIdentityTrustVerdict: UNKNOWN,
      verifierIndependenceVerdict: UNKNOWN,
      observationAuthenticityVerdict: UNKNOWN,
      provenanceVerdict: UNKNOWN,
      physicalMeaningReviewVerdict: UNKNOWN,
      admissionVerdict: NOT_AUTHORIZED
    };
    if (!resultShapeValid(result)) {
      throw new Error(
        `Signed-response result is invalid for ${request.requestId}`);
    }
    return result;
  });
  if (suppliedByRequest.size !== results.length) {
    throw new Error('Signed-response envelope contains an unknown request');
  }
  const envelope = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_ENVELOPE_SCHEMA,
    status:
      'UNTRUSTED_SIGNED_RESPONSE_AWAITING_SIGNATURE_INTEGRITY_CHECK_AND_TRUST',
    sourceContract: {
      schema: contract.schema,
      receiptDigest: contract.digest
    },
    sourceRequestPacket: {
      schema: requestPacket.schema,
      receiptDigest: requestPacket.digest
    },
    responseId: input.responseId,
    claimedVerifier: {
      claimedVerifierId: input.claimedVerifierId,
      claimedVerifierKeyId: input.claimedVerifierKeyId,
      claimedProducedAt: input.claimedProducedAt
    },
    results,
    summary: envelopeSummary(results),
    truth: expectedEnvelopeTruth()
  };
  envelope.digest = stableDigest(envelope);
  if (!landMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseEnvelopeValid(
      envelope, contract, requestPacket)) {
    throw new Error('Signed-response envelope failed validation or budget');
  }
  return envelope;
}

export function
canonicalLandMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseText(
  envelope) {
  if (!landMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseEnvelopeValid(
      envelope)) {
    throw new Error('Canonical signed-response text needs a valid envelope');
  }
  return JSON.stringify(envelope);
}

export function
landMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseSignatureInputValid(
  input) {
  return exactKeys(input, ['schema', 'responseEnvelopeDigest',
      'publicKeyFormat', 'publicKeyRaw', 'signature']) &&
    input.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_SIGNATURE_INPUT_SCHEMA &&
    fnvDigest(input.responseEnvelopeDigest) &&
    input.publicKeyFormat === PUBLIC_KEY_FORMAT &&
    input.publicKeyRaw instanceof Uint8Array &&
    input.publicKeyRaw.byteLength === ED25519_RAW_PUBLIC_KEY_BYTES &&
    input.signature instanceof Uint8Array &&
    input.signature.byteLength === ED25519_SIGNATURE_BYTES;
}

function bytesToHex(bytes) {
  return [...bytes].map(value => value.toString(16).padStart(2, '0')).join('');
}

async function sha256ForBytes(bytes) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error('Web Crypto SubtleCrypto is unavailable');
  const digest = await subtle.digest('SHA-256', bytes);
  return `sha256:${bytesToHex(new Uint8Array(digest))}`;
}

const expectedAssessmentTruth = signatureValid => ({
  exactR102SignedResponseContractBound: true,
  exactR101RequestPacketBound: true,
  exactSignedResponseEnvelopeBound: true,
  detachedEd25519SignatureVerificationPerformed: true,
  signatureIntegrityVerified: signatureValid,
  signatureIntegrityPassMeansSuppliedKeyMatchOnly: true,
  callerSuppliedPublicKeyTrusted: false,
  claimedVerifierIdentityTrusted: false,
  verifierIndependenceEstablished: false,
  observationAuthenticityEvidenceVerified: false,
  observationAuthenticityVerified: false,
  provenanceVerified: false,
  physicalMeaningVerified: false,
  evidenceVerified: false,
  authoritySelfAttestationAccepted: false,
  publicKeyBytesPersisted: false,
  signatureBytesPersisted: false,
  responseEnvelopePersisted: false,
  signatureAssessmentPersisted: false,
  verificationDecisionPersisted: false,
  candidateAdmissionPerformed: false,
  admissionAuthorityGranted: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  worldMutationPerformed: false
});

export function
landMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseSignatureAssessmentValid(
  assessment) {
  if (!digestValid(assessment,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA) ||
      !exactKeys(assessment, ['schema', 'status', 'sourceContract',
        'sourceRequestPacket', 'sourceResponseEnvelope', 'claimedVerifier',
        'cryptographic', 'verdicts', 'issues', 'truth', 'digest']) ||
      !exactKeys(assessment.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(assessment.sourceRequestPacket,
        ['schema', 'receiptDigest']) ||
      !exactKeys(assessment.sourceResponseEnvelope,
        ['schema', 'receiptDigest']) ||
      !exactKeys(assessment.claimedVerifier,
        ['claimedVerifierId', 'claimedVerifierKeyId', 'claimedProducedAt']) ||
      !exactKeys(assessment.cryptographic, ['signatureAlgorithm',
        'publicKeyFormat', 'publicKeyByteLength', 'signatureByteLength',
        'canonicalResponseCharacterCount', 'publicKeySha256',
        'signatureSha256', 'signatureValid']) ||
      !exactKeys(assessment.verdicts, ['responseEnvelopeStructuralVerdict',
        'signatureIntegrityVerdict', 'trustedVerifierKeyBindingVerdict',
        'claimedVerifierIdentityTrustVerdict',
        'verifierIndependenceVerdict', 'observationAuthenticityVerdict',
        'provenanceVerdict', 'physicalMeaningReviewVerdict',
        'evidenceVerificationVerdict', 'admissionVerdict']) ||
      !Array.isArray(assessment.issues)) return false;
  const valid = assessment.cryptographic.signatureValid === true;
  return assessment.status === (valid
      ? 'SIGNED_RESPONSE_SIGNATURE_VALID_WITH_UNTRUSTED_CALLER_SUPPLIED_KEY'
      : 'SIGNED_RESPONSE_SIGNATURE_INVALID') &&
    assessment.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(assessment.sourceContract.receiptDigest) &&
    assessment.sourceRequestPacket.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_REQUEST_PACKET_SCHEMA &&
    fnvDigest(assessment.sourceRequestPacket.receiptDigest) &&
    assessment.sourceResponseEnvelope.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_ENVELOPE_SCHEMA &&
    fnvDigest(assessment.sourceResponseEnvelope.receiptDigest) &&
    nonEmptyText(assessment.claimedVerifier.claimedVerifierId, 256) &&
    nonEmptyText(assessment.claimedVerifier.claimedVerifierKeyId, 256) &&
    isoTimestamp(assessment.claimedVerifier.claimedProducedAt) &&
    assessment.cryptographic.signatureAlgorithm === SIGNATURE_ALGORITHM &&
    assessment.cryptographic.publicKeyFormat === PUBLIC_KEY_FORMAT &&
    assessment.cryptographic.publicKeyByteLength ===
      ED25519_RAW_PUBLIC_KEY_BYTES &&
    assessment.cryptographic.signatureByteLength === ED25519_SIGNATURE_BYTES &&
    Number.isInteger(
      assessment.cryptographic.canonicalResponseCharacterCount) &&
    assessment.cryptographic.canonicalResponseCharacterCount > 0 &&
    assessment.cryptographic.canonicalResponseCharacterCount <=
      SIGNED_RESPONSE_MAX_CHARACTERS &&
    sha256Digest(assessment.cryptographic.publicKeySha256) &&
    sha256Digest(assessment.cryptographic.signatureSha256) &&
    assessment.verdicts.responseEnvelopeStructuralVerdict === 'PASS' &&
    assessment.verdicts.signatureIntegrityVerdict ===
      (valid ? 'PASS' : 'FAIL') &&
    assessment.verdicts.trustedVerifierKeyBindingVerdict === UNKNOWN &&
    assessment.verdicts.claimedVerifierIdentityTrustVerdict === UNKNOWN &&
    assessment.verdicts.verifierIndependenceVerdict === UNKNOWN &&
    assessment.verdicts.observationAuthenticityVerdict === UNKNOWN &&
    assessment.verdicts.provenanceVerdict === UNKNOWN &&
    assessment.verdicts.physicalMeaningReviewVerdict === UNKNOWN &&
    assessment.verdicts.evidenceVerificationVerdict === UNKNOWN &&
    assessment.verdicts.admissionVerdict === NOT_AUTHORIZED &&
    exact(assessment.issues, valid ? [] : ['detached-signature-invalid']) &&
    exact(assessment.truth, expectedAssessmentTruth(valid));
}

export async function
verifyLandMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseSignature(
  contract, requestPacket, envelope, signatureInput) {
  if (!landMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseContractReceiptValid(
      contract) ||
      !landMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseEnvelopeValid(
        envelope, contract, requestPacket) ||
      !landMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseSignatureInputValid(
        signatureInput) || signatureInput.responseEnvelopeDigest !==
        envelope.digest) {
    throw new Error(
      'Signed-response signature verification needs exact R102, R101, envelope, key, and signature inputs');
  }
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error('Web Crypto SubtleCrypto is unavailable');
  const publicKeyRaw = new Uint8Array(signatureInput.publicKeyRaw);
  const signature = new Uint8Array(signatureInput.signature);
  const canonicalText =
    canonicalLandMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseText(
      envelope);
  const canonicalBytes = new TextEncoder().encode(canonicalText);
  const publicKey = await subtle.importKey('raw', publicKeyRaw,
    { name: SIGNATURE_ALGORITHM }, false, ['verify']);
  const signatureValid = await subtle.verify({ name: SIGNATURE_ALGORITHM },
    publicKey, signature, canonicalBytes);
  const assessment = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA,
    status: signatureValid
      ? 'SIGNED_RESPONSE_SIGNATURE_VALID_WITH_UNTRUSTED_CALLER_SUPPLIED_KEY'
      : 'SIGNED_RESPONSE_SIGNATURE_INVALID',
    sourceContract: {
      schema: contract.schema,
      receiptDigest: contract.digest
    },
    sourceRequestPacket: {
      schema: requestPacket.schema,
      receiptDigest: requestPacket.digest
    },
    sourceResponseEnvelope: {
      schema: envelope.schema,
      receiptDigest: envelope.digest
    },
    claimedVerifier: clone(envelope.claimedVerifier),
    cryptographic: {
      signatureAlgorithm: SIGNATURE_ALGORITHM,
      publicKeyFormat: PUBLIC_KEY_FORMAT,
      publicKeyByteLength: publicKeyRaw.byteLength,
      signatureByteLength: signature.byteLength,
      canonicalResponseCharacterCount: canonicalText.length,
      publicKeySha256: await sha256ForBytes(publicKeyRaw),
      signatureSha256: await sha256ForBytes(signature),
      signatureValid
    },
    verdicts: {
      responseEnvelopeStructuralVerdict: 'PASS',
      signatureIntegrityVerdict: signatureValid ? 'PASS' : 'FAIL',
      trustedVerifierKeyBindingVerdict: UNKNOWN,
      claimedVerifierIdentityTrustVerdict: UNKNOWN,
      verifierIndependenceVerdict: UNKNOWN,
      observationAuthenticityVerdict: UNKNOWN,
      provenanceVerdict: UNKNOWN,
      physicalMeaningReviewVerdict: UNKNOWN,
      evidenceVerificationVerdict: UNKNOWN,
      admissionVerdict: NOT_AUTHORIZED
    },
    issues: signatureValid ? [] : ['detached-signature-invalid'],
    truth: expectedAssessmentTruth(signatureValid)
  };
  assessment.digest = stableDigest(assessment);
  if (!landMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseSignatureAssessmentValid(
      assessment)) {
    throw new Error('Signed-response signature assessment failed validation');
  }
  return assessment;
}

export function
matrixThermalHistoricalSourceObservationAuthenticitySignedResponseDescription() {
  return {
    contractReceiptSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_CONTRACT_RECEIPT_SCHEMA,
    routeSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_ROUTE_SCHEMA,
    resultSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_RESULT_SCHEMA,
    envelopeSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_ENVELOPE_SCHEMA,
    signatureInputSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_SIGNATURE_INPUT_SCHEMA,
    signatureAssessmentSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA,
    envelopeValidationCapabilityId:
      SIGNED_RESPONSE_ENVELOPE_VALIDATION_CAPABILITY_ID,
    signatureVerificationCapabilityId:
      SIGNED_RESPONSE_SIGNATURE_VERIFICATION_CAPABILITY_ID,
    trustedVerifierKeyBindingCapabilityId:
      TRUSTED_VERIFIER_KEY_BINDING_CAPABILITY_ID,
    signatureAlgorithm: SIGNATURE_ALGORITHM,
    publicKeyFormat: PUBLIC_KEY_FORMAT,
    maximumCanonicalResponseCharacters: SIGNED_RESPONSE_MAX_CHARACTERS,
    detachedSignatureVerificationImplemented: true,
    trustedVerifierKeyBindingImplemented: false,
    observationAuthenticityVerificationImplemented: false,
    physicalMeaningReviewImplemented: false,
    responsePersistenceImplemented: false,
    candidateAdmissionPathImplemented: false,
    mutatesWorld: false,
    status: 'EXPERIMENTAL'
  };
}
