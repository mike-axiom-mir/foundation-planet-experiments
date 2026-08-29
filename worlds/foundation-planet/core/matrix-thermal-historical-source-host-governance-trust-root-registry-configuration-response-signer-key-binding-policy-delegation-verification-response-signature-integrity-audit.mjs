import {
  HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
  HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-root-admission-request.mjs?v=0.116.0-r116.1';
import {
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-request.mjs?v=0.116.0-r116.1';
import {
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceiptValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-request.mjs?v=0.116.0-r116.1';
import {
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-authority-decision-integrity.mjs?v=0.116.0-r116.1';
import {
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestContractReceiptValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestPacketValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-request.mjs?v=0.116.0-r116.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INTEGRITY_ROUTE_PROJECTION_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_RESULT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_ENVELOPE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INPUT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_VERIFY_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signature-integrity.mjs?v=0.116.0-r116.1';

const clone = value => JSON.parse(JSON.stringify(value));
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const exactKeys = (value, keys) => value && typeof value === 'object' &&
  !Array.isArray(value) && exact(Object.keys(value).sort(), [...keys].sort());
const sourceRef = value => ({ schema: value.schema, receiptDigest: value.digest });
const sha256Digest = value => typeof value === 'string' &&
  /^sha256:[a-f0-9]{64}$/.test(value);
const nonEmptyText = (value, maximum = 4096) =>
  typeof value === 'string' && value.trim().length > 0 && value.length <= maximum;

function stableDigest(value) {
  const text = JSON.stringify(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return 'fnv1a32:' + (hash >>> 0).toString(16).padStart(8, '0');
}

function digestValid(value, schema) {
  if (value?.schema !== schema || typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function expectedProjection(sourceR115Contract) {
  const sourceProjection =
    sourceR115Contract.delegationVerificationRouteProjection;
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INTEGRITY_ROUTE_PROJECTION_SCHEMA,
    sourceR115RouteProjectionDigest: stableDigest(sourceProjection),
    sourceRouteCount: sourceProjection.sourceRouteCount,
    eligibleRouteCount: sourceProjection.eligibleRouteCount,
    authorityReviewRouteExcludedCount:
      sourceProjection.authorityReviewRouteExcludedCount,
    implementedCapabilityProjectionDigest: stableDigest([
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_VERIFY_CAPABILITY_ID
    ]),
    requiredCapabilityProjectionDigest: stableDigest([
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
      HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
      HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID,
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID
    ]),
    truthProjectionDigest: stableDigest({
      detachedSignatureVerificationOnly: true,
      callerSuppliedResponseSignerTrusted: false,
      sourceRequestTransmitted: false,
      responseTransportProven: false,
      challengeHostAuthenticated: false,
      replayProtectionVerified: false,
      hostRegistryConfigured: false,
      hostGovernanceTrustRootResolved: false,
      policyKeyDelegationVerified: false,
      hostGovernanceAdmissionAuthorized: false,
      responseSignerKeyBound: false,
      transientArtifactsPersisted: false,
      worldMutationPerformed: false
    })
  };
}

function contractResult(status, detail) {
  return {
    id: 'land-matrix-thermal-historical-source-host-governance-policy-key-delegation-verification-response-signature-integrity-contract',
    required: true,
    status,
    statement: 'R116 may verify only detached signature integrity for an exact-R115 caller-supplied response; transport, responder trust, challenge authentication, replay protection, delegation authority, admission, binding, persistence, and mutation remain unresolved.',
    detail
  };
}

export function
auditLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureIntegrityContract(
  receipt, sourceR115Contract, sourceR114Contract, sourceR113Contract) {
  if (![receipt, sourceR115Contract, sourceR114Contract,
    sourceR113Contract].every(Boolean)) {
    return contractResult('FAIL', {
      reason: 'the transient R116 receipt and exact R115/R114/R113 contracts are required'
    });
  }
  const sourcesValid =
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestContractReceiptValid(
      sourceR115Contract, sourceR114Contract, sourceR113Contract) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      sourceR114Contract, sourceR113Contract) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceiptValid(
      sourceR113Contract);
  const expected = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
    status:
      'POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INTEGRITY_PROJECTION_ONLY',
    sourceR115Contract: sourceRef(sourceR115Contract),
    sourceR114Contract: sourceRef(sourceR114Contract),
    sourceR113Contract: sourceRef(sourceR113Contract),
    responseSignatureIntegrityRouteProjection:
      expectedProjection(sourceR115Contract),
    emission: {
      mode:
        'transient-from-exact-r115-r114-r113-policy-delegation-verification-request-custody'
    }
  };
  expected.digest = stableDigest(expected);
  const receiptDigestValid = digestValid(receipt,
    LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA);
  const exactProjection = sourcesValid && exact(receipt, expected);
  return contractResult(receiptDigestValid && exactProjection ? 'PASS' : 'FAIL', {
    sourcesValid,
    receiptDigestValid,
    exactProjection,
    sourceRouteCount:
      receipt.responseSignatureIntegrityRouteProjection?.sourceRouteCount ?? null,
    eligibleRouteCount:
      receipt.responseSignatureIntegrityRouteProjection?.eligibleRouteCount ?? null,
    authorityReviewRouteExcludedCount:
      receipt.responseSignatureIntegrityRouteProjection
        ?.authorityReviewRouteExcludedCount ?? null,
    detachedSignatureVerificationProjected: true,
    policyKeyDelegationVerified: false,
    persistedInEarthState: false,
    receiptDigest: receipt.digest || null
  });
}

function expectedEnvelopeSummary(results) {
  const count = verdict => results.filter(result =>
    result.claimedDelegationVerdict === verdict).length;
  return {
    resultCount: 2,
    claimedVerifiedResultCount: count('CLAIMED_VERIFIED'),
    claimedRejectedResultCount: count('CLAIMED_REJECTED'),
    claimedUnknownResultCount: count('CLAIMED_UNKNOWN'),
    authenticatedHostEvidenceCount: 0,
    verifiedPolicyKeyDelegationCount: 0,
    transmittedRequestCount: 0,
    responseTransportReceiptCount: 0,
    persistedResponseCount: 0,
    worldMutationCount: 0
  };
}

const expectedEnvelopeTruth = () => ({
  exactR116ContractBound: true,
  exactR115RequestPacketBound: true,
  responseClaimsAreCallerSuppliedAndUnauthenticated: true,
  requestTransmissionProven: false,
  responseTransportProven: false,
  requestChallengeEchoed: true,
  challengeHostAuthenticated: false,
  replayProtectionVerified: false,
  callerSuppliedResponseSignerTrusted: false,
  hostRegistryConfigured: false,
  hostGovernanceTrustRootResolved: false,
  policyKeyDelegationVerified: false,
  hostGovernanceAdmissionAuthorized: false,
  responseSignerKeyBound: false,
  persisted: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  worldMutationPerformed: false
});

function resultIndependentlyValid(result, sourceEntry) {
  const expected = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_RESULT_SCHEMA,
    requestEntryId: sourceEntry.requestEntryId,
    keyRole: sourceEntry.keyRole,
    keyId: sourceEntry.keyId,
    publicKeySha256: sourceEntry.publicKeySha256,
    delegatedScope: clone(sourceEntry.delegatedScope),
    claimedDelegationVerdict: result.claimedDelegationVerdict,
    claimedDelegationChainDigest: result.claimedDelegationChainDigest,
    claimedTrustRoot: clone(result.claimedTrustRoot),
    status: 'CALLER_SUPPLIED_UNAUTHENTICATED_DELEGATION_CLAIM',
    authorityApplied: false
  };
  return exact(result, expected) &&
    ['CLAIMED_VERIFIED', 'CLAIMED_REJECTED', 'CLAIMED_UNKNOWN']
      .includes(result.claimedDelegationVerdict) &&
    sha256Digest(result.claimedDelegationChainDigest) &&
    exactKeys(result.claimedTrustRoot, ['trustRootId', 'registryVersion']) &&
    nonEmptyText(result.claimedTrustRoot.trustRootId, 256) &&
    Number.isInteger(result.claimedTrustRoot.registryVersion) &&
    result.claimedTrustRoot.registryVersion > 0;
}

function envelopeIndependentlyValid(envelope, contract, request) {
  if (!digestValid(envelope,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_ENVELOPE_SCHEMA) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestPacketValid(
        request) || !Array.isArray(envelope.results) ||
      envelope.results.length !== 2) return false;
  const expected = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_ENVELOPE_SCHEMA,
    status:
      'CALLER_SUPPLIED_UNAUTHENTICATED_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE',
    sourceContract: sourceRef(contract),
    sourceRequestPacket: sourceRef(request),
    responseId: envelope.responseId,
    claimedHostResponder: clone(envelope.claimedHostResponder),
    challengeResponse: {
      requestChallengeNonce: request.challenge.nonce,
      responseNonce: envelope.challengeResponse?.responseNonce,
      replayLedgerReceipt: null,
      challengeEchoMatched: true,
      hostAuthenticated: false
    },
    results: clone(envelope.results),
    summary: expectedEnvelopeSummary(envelope.results),
    truth: expectedEnvelopeTruth()
  };
  expected.digest = stableDigest(expected);
  return nonEmptyText(envelope.responseId, 256) &&
    exactKeys(envelope.claimedHostResponder, ['claimedResponderId',
      'claimedSignerKeyId', 'claimedProducedAt']) &&
    Number.isFinite(Date.parse(
      envelope.claimedHostResponder.claimedProducedAt)) &&
    Date.parse(envelope.claimedHostResponder.claimedProducedAt) >=
      Date.parse(request.requestedAt) &&
    Date.parse(envelope.claimedHostResponder.claimedProducedAt) <=
      Date.parse(request.expiresAt) &&
    nonEmptyText(envelope.challengeResponse?.responseNonce, 256) &&
    envelope.challengeResponse.responseNonce !== request.challenge.nonce &&
    envelope.results.every((result, index) =>
      resultIndependentlyValid(result,
        request.delegationVerificationRequests[index])) &&
    JSON.stringify(envelope).length <= 24000 && exact(envelope, expected);
}

function signatureInputValid(input) {
  return exactKeys(input, ['schema', 'responseEnvelopeDigest',
      'publicKeyFormat', 'publicKeyRaw', 'signature']) &&
    input.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INPUT_SCHEMA &&
    /^fnv1a32:[a-f0-9]{8}$/.test(input.responseEnvelopeDigest) &&
    input.publicKeyFormat === 'raw-ed25519-32-byte' &&
    input.publicKeyRaw instanceof Uint8Array &&
    input.publicKeyRaw.byteLength === 32 &&
    input.signature instanceof Uint8Array && input.signature.byteLength === 64;
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

const expectedVerdicts = signatureValid => ({
  responseEnvelopeStructuralVerdict: 'PASS',
  detachedSignatureIntegrityVerdict: signatureValid ? 'PASS' : 'FAIL',
  trustedResponseSignerKeyBindingVerdict: 'UNKNOWN',
  requestTransportVerdict: 'NOT_PROVEN',
  responseTransportVerdict: 'NOT_PROVEN',
  challengeAuthenticationVerdict: 'UNKNOWN',
  replayProtectionVerdict: 'UNKNOWN',
  hostRegistryConfigurationVerdict: 'UNKNOWN',
  hostGovernanceTrustRootResolutionVerdict: 'UNKNOWN',
  policyKeyDelegationVerificationVerdict: 'UNKNOWN',
  hostGovernanceAdmissionVerdict: 'NOT_AUTHORIZED',
  responseSignerKeyBindingVerdict: 'UNKNOWN'
});

const expectedTruth = signatureValid => ({
  exactR116ContractBound: true,
  exactR115RequestPacketBound: true,
  exactResponseEnvelopeBound: true,
  detachedSignatureValid: signatureValid,
  validSignatureMeansCallerSuppliedKeyMatchOnly: true,
  responseClaimsAcceptedAsAuthority: false,
  requestTransmissionProven: false,
  responseTransportProven: false,
  challengeHostAuthenticated: false,
  replayProtectionVerified: false,
  callerSuppliedResponseSignerTrusted: false,
  rawPublicKeyPersisted: false,
  signatureBytesPersisted: false,
  hostRegistryConfigured: false,
  hostGovernanceTrustRootResolved: false,
  policyKeyDelegationVerified: false,
  hostGovernanceAdmissionAuthorized: false,
  responseSignerKeyBound: false,
  persisted: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  worldMutationPerformed: false
});

function assessmentResult(status, detail) {
  return {
    id: 'land-matrix-thermal-historical-source-host-governance-policy-key-delegation-verification-response-signature-assessment',
    required: true,
    status,
    statement: 'The independent R116 audit must reproduce detached Ed25519 verification and reject any upgrade from signed caller claims to host authority, delegation verification, admission, binding, persistence, or mutation.',
    detail
  };
}

export async function
auditLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureAssessment(
  assessment, contract, sourceR115Contract, sourceR114Contract,
  sourceR113Contract, request, envelope, signatureInput) {
  if (![assessment, contract, sourceR115Contract, sourceR114Contract,
    sourceR113Contract, request, envelope, signatureInput].every(Boolean)) {
    return assessmentResult('FAIL', {
      reason: 'the R116 assessment and all exact sources/signature inputs are required'
    });
  }
  const contractAudit =
    auditLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureIntegrityContract(
      contract, sourceR115Contract, sourceR114Contract, sourceR113Contract);
  const requestValid = contractAudit.status === 'PASS' &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestPacketValid(
      request) && exact(request.sourceContract, sourceRef(sourceR115Contract)) &&
    exact(request.sourceR114Contract, sourceRef(sourceR114Contract));
  const envelopeValid = requestValid &&
    envelopeIndependentlyValid(envelope, contract, request);
  const signatureInputStructuralValid = signatureInputValid(signatureInput) &&
    signatureInput.responseEnvelopeDigest === envelope.digest;
  let independentlyVerifiedSignature = false;
  let publicKeySha256 = null;
  let signatureSha256 = null;
  let canonicalResponseCharacterCount = null;
  if (envelopeValid && signatureInputStructuralValid) {
    const subtle = globalThis.crypto?.subtle;
    if (!subtle) throw new Error('Web Crypto SubtleCrypto is unavailable');
    const publicKeyRaw = new Uint8Array(signatureInput.publicKeyRaw);
    const signature = new Uint8Array(signatureInput.signature);
    const canonicalText = JSON.stringify(envelope);
    const publicKey = await subtle.importKey('raw', publicKeyRaw,
      { name: 'Ed25519' }, false, ['verify']);
    independentlyVerifiedSignature = await subtle.verify({ name: 'Ed25519' },
      publicKey, signature, new TextEncoder().encode(canonicalText));
    publicKeySha256 = await sha256ForBytes(publicKeyRaw);
    signatureSha256 = await sha256ForBytes(signature);
    canonicalResponseCharacterCount = canonicalText.length;
  }
  const expected = envelopeValid && signatureInputStructuralValid ? {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA,
    status: independentlyVerifiedSignature
      ? 'DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_VALID_WITH_UNTRUSTED_CALLER_SUPPLIED_KEY'
      : 'DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INVALID',
    sourceContract: sourceRef(contract),
    sourceRequestPacket: sourceRef(request),
    sourceResponseEnvelope: sourceRef(envelope),
    claimedHostResponder: clone(envelope.claimedHostResponder),
    claimedResponseSummary: {
      resultCount: envelope.summary.resultCount,
      claimedVerifiedResultCount: envelope.summary.claimedVerifiedResultCount,
      claimedRejectedResultCount: envelope.summary.claimedRejectedResultCount,
      claimedUnknownResultCount: envelope.summary.claimedUnknownResultCount
    },
    cryptographic: {
      signatureAlgorithm: 'Ed25519',
      publicKeyFormat: 'raw-ed25519-32-byte',
      publicKeyByteLength: 32,
      signatureByteLength: 64,
      canonicalResponseCharacterCount,
      publicKeySha256,
      signatureSha256,
      signatureValid: independentlyVerifiedSignature
    },
    verdicts: expectedVerdicts(independentlyVerifiedSignature),
    issues: independentlyVerifiedSignature
      ? [] : ['detached-signature-invalid'],
    truth: expectedTruth(independentlyVerifiedSignature)
  } : null;
  if (expected) expected.digest = stableDigest(expected);
  const assessmentDigestValid = digestValid(assessment,
    LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA);
  const exactAssessment = expected !== null && exact(assessment, expected);
  const valid = contractAudit.status === 'PASS' && requestValid && envelopeValid &&
    signatureInputStructuralValid && assessmentDigestValid && exactAssessment;
  return assessmentResult(valid ? 'PASS' : 'FAIL', {
    contractAuditStatus: contractAudit.status,
    requestValid,
    envelopeValid,
    signatureInputStructuralValid,
    independentlyVerifiedSignature,
    assessmentDigestValid,
    exactAssessment,
    claimedVerifiedResultCount:
      assessment.claimedResponseSummary?.claimedVerifiedResultCount ?? null,
    detachedSignatureIntegrityVerdict:
      assessment.verdicts?.detachedSignatureIntegrityVerdict || null,
    policyKeyDelegationVerificationVerdict:
      assessment.verdicts?.policyKeyDelegationVerificationVerdict || null,
    hostGovernanceAdmissionVerdict:
      assessment.verdicts?.hostGovernanceAdmissionVerdict || null,
    responseSignerKeyBound:
      assessment.truth?.responseSignerKeyBound ?? null,
    persisted: assessment.truth?.persisted ?? null,
    worldMutationPerformed:
      assessment.truth?.worldMutationPerformed ?? null,
    assessmentDigest: assessment.digest || null
  });
}
