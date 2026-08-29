import {
  HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
  HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-root-admission-request.mjs?v=0.116.0-r116.1';
import {
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-request.mjs?v=0.116.0-r116.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceiptValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-request.mjs?v=0.116.0-r116.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-authority-decision-integrity.mjs?v=0.116.0-r116.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_PACKET_SCHEMA,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestContractReceiptValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestPacketValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-request.mjs?v=0.116.0-r116.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signature-integrity-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INTEGRITY_ROUTE_PROJECTION_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signature-integrity-route-projection/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_RESULT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-result/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_ENVELOPE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-envelope/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INPUT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signature-input/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signature-assessment/v1';

export const
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_VERIFY_CAPABILITY_ID =
    'integrity.host-governance.policy-key.delegation.verification.response.signature.verify';

const UNKNOWN = 'UNKNOWN';
const NOT_AUTHORIZED = 'NOT_AUTHORIZED';
const SIGNATURE_ALGORITHM = 'Ed25519';
const PUBLIC_KEY_FORMAT = 'raw-ed25519-32-byte';
const ED25519_RAW_PUBLIC_KEY_BYTES = 32;
const ED25519_SIGNATURE_BYTES = 64;
const MAXIMUM_CANONICAL_RESPONSE_CHARACTERS = 24000;
const NATIVE_EMISSION_MODE =
  'transient-from-exact-r115-r114-r113-policy-delegation-verification-request-custody';
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
  return 'fnv1a32:' + (hash >>> 0).toString(16).padStart(8, '0');
}

function digestValid(value, schema) {
  if (value?.schema !== schema || typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

const sourceRef = value => ({ schema: value.schema, receiptDigest: value.digest });
const fnvDigest = value => typeof value === 'string' &&
  /^fnv1a32:[a-f0-9]{8}$/.test(value);
const sha256Digest = value => typeof value === 'string' &&
  /^sha256:[a-f0-9]{64}$/.test(value);
const nonEmptyText = (value, maximum = 4096) =>
  typeof value === 'string' && value.trim().length > 0 && value.length <= maximum;
const isoTimestamp = value =>
  nonEmptyText(value, 64) && Number.isFinite(Date.parse(value));

function expectedRouteProjection(sourceR115Contract) {
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

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureIntegrityContractReceiptValid(
  receipt, sourceR115Contract = null, sourceR114Contract = null,
  sourceR113Contract = null) {
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'sourceR115Contract',
        'sourceR114Contract', 'sourceR113Contract',
        'responseSignatureIntegrityRouteProjection', 'emission', 'digest']) ||
      ![receipt.sourceR115Contract, receipt.sourceR114Contract,
        receipt.sourceR113Contract].every(value => exactKeys(value,
          ['schema', 'receiptDigest'])) ||
      !exactKeys(receipt.responseSignatureIntegrityRouteProjection,
        ['schema', 'sourceR115RouteProjectionDigest', 'sourceRouteCount',
          'eligibleRouteCount', 'authorityReviewRouteExcludedCount',
          'implementedCapabilityProjectionDigest',
          'requiredCapabilityProjectionDigest', 'truthProjectionDigest']) ||
      !exactKeys(receipt.emission, ['mode']) ||
      receipt.sourceR115Contract.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA ||
      receipt.sourceR114Contract.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA ||
      receipt.sourceR113Contract.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA ||
      ![receipt.sourceR115Contract, receipt.sourceR114Contract,
        receipt.sourceR113Contract].every(value => fnvDigest(value.receiptDigest))) {
    return false;
  }
  const projection = sourceR115Contract === null
    ? receipt.responseSignatureIntegrityRouteProjection
    : expectedRouteProjection(sourceR115Contract);
  const projectionValid = projection.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INTEGRITY_ROUTE_PROJECTION_SCHEMA &&
    fnvDigest(projection.sourceR115RouteProjectionDigest) &&
    fnvDigest(projection.implementedCapabilityProjectionDigest) &&
    fnvDigest(projection.requiredCapabilityProjectionDigest) &&
    fnvDigest(projection.truthProjectionDigest) &&
    projection.sourceRouteCount === 28 && projection.eligibleRouteCount === 24 &&
    projection.authorityReviewRouteExcludedCount === 4;
  const sourcesExact = sourceR115Contract === null ||
    (sourceR114Contract && sourceR113Contract &&
      landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestContractReceiptValid(
        sourceR115Contract, sourceR114Contract, sourceR113Contract) &&
      landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
        sourceR114Contract, sourceR113Contract) &&
      landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceiptValid(
        sourceR113Contract) &&
      exact(receipt.sourceR115Contract, sourceRef(sourceR115Contract)) &&
      exact(receipt.sourceR114Contract, sourceRef(sourceR114Contract)) &&
      exact(receipt.sourceR113Contract, sourceRef(sourceR113Contract)) &&
      exact(receipt.responseSignatureIntegrityRouteProjection, projection));
  return projectionValid && sourcesExact && receipt.status ===
      'POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INTEGRITY_PROJECTION_ONLY' &&
    receipt.emission.mode === NATIVE_EMISSION_MODE;
}

export function
createLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureIntegrityContractReceipt(
  sourceR115Contract, sourceR114Contract, sourceR113Contract) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestContractReceiptValid(
      sourceR115Contract, sourceR114Contract, sourceR113Contract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
        sourceR114Contract, sourceR113Contract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceiptValid(
        sourceR113Contract)) {
    throw new Error(
      'Delegation-verification response signature integrity needs exact R115/R114/R113 contracts');
  }
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
    status:
      'POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INTEGRITY_PROJECTION_ONLY',
    sourceR115Contract: sourceRef(sourceR115Contract),
    sourceR114Contract: sourceRef(sourceR114Contract),
    sourceR113Contract: sourceRef(sourceR113Contract),
    responseSignatureIntegrityRouteProjection:
      expectedRouteProjection(sourceR115Contract),
    emission: { mode: NATIVE_EMISSION_MODE }
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureIntegrityContractReceiptValid(
      receipt, sourceR115Contract, sourceR114Contract, sourceR113Contract)) {
    throw new Error(
      'Delegation-verification response signature-integrity contract failed validation');
  }
  return receipt;
}

function claimedResultInputValid(value) {
  return exactKeys(value, ['requestEntryId', 'claimedDelegationVerdict',
      'claimedDelegationChainDigest', 'claimedTrustRootId',
      'claimedRegistryVersion']) && nonEmptyText(value.requestEntryId, 512) &&
    ['CLAIMED_VERIFIED', 'CLAIMED_REJECTED', 'CLAIMED_UNKNOWN']
      .includes(value.claimedDelegationVerdict) &&
    sha256Digest(value.claimedDelegationChainDigest) &&
    nonEmptyText(value.claimedTrustRootId, 256) &&
    Number.isInteger(value.claimedRegistryVersion) &&
    value.claimedRegistryVersion > 0;
}

function expectedResults(request, inputResults) {
  return request.delegationVerificationRequests.map(requestEntry => {
    const input = inputResults.find(item =>
      item.requestEntryId === requestEntry.requestEntryId);
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_RESULT_SCHEMA,
      requestEntryId: requestEntry.requestEntryId,
      keyRole: requestEntry.keyRole,
      keyId: requestEntry.keyId,
      publicKeySha256: requestEntry.publicKeySha256,
      delegatedScope: clone(requestEntry.delegatedScope),
      claimedDelegationVerdict: input.claimedDelegationVerdict,
      claimedDelegationChainDigest: input.claimedDelegationChainDigest,
      claimedTrustRoot: {
        trustRootId: input.claimedTrustRootId,
        registryVersion: input.claimedRegistryVersion
      },
      status: 'CALLER_SUPPLIED_UNAUTHENTICATED_DELEGATION_CLAIM',
      authorityApplied: false
    };
  });
}

function resultShapeValid(value) {
  return exactKeys(value, ['schema', 'requestEntryId', 'keyRole', 'keyId',
      'publicKeySha256', 'delegatedScope', 'claimedDelegationVerdict',
      'claimedDelegationChainDigest', 'claimedTrustRoot', 'status',
      'authorityApplied']) && exactKeys(value.delegatedScope,
      ['governanceDomainId', 'worldId', 'lineageId', 'claimedResponderId',
        'claimedSignerKeyId', 'requestedAction']) &&
    exactKeys(value.claimedTrustRoot, ['trustRootId', 'registryVersion']) &&
    value.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_RESULT_SCHEMA &&
    nonEmptyText(value.requestEntryId, 512) &&
    ['DECISION_KEY', 'REVOCATION_KEY'].includes(value.keyRole) &&
    nonEmptyText(value.keyId, 256) && sha256Digest(value.publicKeySha256) &&
    Object.values(value.delegatedScope)
      .every(item => nonEmptyText(item, 512)) &&
    value.delegatedScope.requestedAction === 'BIND' &&
    ['CLAIMED_VERIFIED', 'CLAIMED_REJECTED', 'CLAIMED_UNKNOWN']
      .includes(value.claimedDelegationVerdict) &&
    sha256Digest(value.claimedDelegationChainDigest) &&
    nonEmptyText(value.claimedTrustRoot.trustRootId, 256) &&
    Number.isInteger(value.claimedTrustRoot.registryVersion) &&
    value.claimedTrustRoot.registryVersion > 0 &&
    value.status === 'CALLER_SUPPLIED_UNAUTHENTICATED_DELEGATION_CLAIM' &&
    value.authorityApplied === false;
}

function expectedEnvelopeSummary(results) {
  const count = verdict => results.filter(result =>
    result.claimedDelegationVerdict === verdict).length;
  return {
    resultCount: results.length,
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

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseEnvelopeValid(
  envelope, contract = null, request = null) {
  if (!digestValid(envelope,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_ENVELOPE_SCHEMA) ||
      !exactKeys(envelope, ['schema', 'status', 'sourceContract',
        'sourceRequestPacket', 'responseId', 'claimedHostResponder',
        'challengeResponse', 'results', 'summary', 'truth', 'digest']) ||
      !exactKeys(envelope.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(envelope.sourceRequestPacket, ['schema', 'receiptDigest']) ||
      !exactKeys(envelope.claimedHostResponder, ['claimedResponderId',
        'claimedSignerKeyId', 'claimedProducedAt']) ||
      !exactKeys(envelope.challengeResponse, ['requestChallengeNonce',
        'responseNonce', 'replayLedgerReceipt', 'challengeEchoMatched',
        'hostAuthenticated']) || !Array.isArray(envelope.results) ||
      envelope.results.length !== 2 || !envelope.results.every(resultShapeValid) ||
      !exactKeys(envelope.summary, ['resultCount',
        'claimedVerifiedResultCount', 'claimedRejectedResultCount',
        'claimedUnknownResultCount', 'authenticatedHostEvidenceCount',
        'verifiedPolicyKeyDelegationCount', 'transmittedRequestCount',
        'responseTransportReceiptCount', 'persistedResponseCount',
        'worldMutationCount']) ||
      envelope.sourceContract.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA ||
      envelope.sourceRequestPacket.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_PACKET_SCHEMA ||
      !fnvDigest(envelope.sourceContract.receiptDigest) ||
      !fnvDigest(envelope.sourceRequestPacket.receiptDigest)) return false;
  const structural = envelope.status ===
      'CALLER_SUPPLIED_UNAUTHENTICATED_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE' &&
    nonEmptyText(envelope.responseId, 256) &&
    Object.values(envelope.claimedHostResponder)
      .every(item => nonEmptyText(item, 512)) &&
    isoTimestamp(envelope.claimedHostResponder.claimedProducedAt) &&
    nonEmptyText(envelope.challengeResponse.requestChallengeNonce, 256) &&
    nonEmptyText(envelope.challengeResponse.responseNonce, 256) &&
    envelope.challengeResponse.replayLedgerReceipt === null &&
    envelope.challengeResponse.challengeEchoMatched === true &&
    envelope.challengeResponse.hostAuthenticated === false &&
    exact(envelope.summary, expectedEnvelopeSummary(envelope.results)) &&
    exact(envelope.truth, expectedEnvelopeTruth()) &&
    JSON.stringify(envelope).length <= MAXIMUM_CANONICAL_RESPONSE_CHARACTERS;
  if (!structural || contract === null) return structural;
  if (!request ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureIntegrityContractReceiptValid(
        contract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestPacketValid(
        request)) return false;
  const sourceEntries = request.delegationVerificationRequests;
  const resultsExact = envelope.results.every((result, index) => {
    const entry = sourceEntries[index];
    return result.requestEntryId === entry.requestEntryId &&
      result.keyRole === entry.keyRole && result.keyId === entry.keyId &&
      result.publicKeySha256 === entry.publicKeySha256 &&
      exact(result.delegatedScope, entry.delegatedScope);
  });
  return exact(envelope.sourceContract, sourceRef(contract)) &&
    exact(envelope.sourceRequestPacket, sourceRef(request)) && resultsExact &&
    exact(contract.sourceR115Contract, request.sourceContract) &&
    exact(contract.sourceR114Contract, request.sourceR114Contract) &&
    envelope.challengeResponse.requestChallengeNonce ===
      request.challenge.nonce &&
    envelope.challengeResponse.responseNonce !== request.challenge.nonce &&
    Date.parse(envelope.claimedHostResponder.claimedProducedAt) >=
      Date.parse(request.requestedAt) &&
    Date.parse(envelope.claimedHostResponder.claimedProducedAt) <=
      Date.parse(request.expiresAt);
}

export function
createLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseEnvelope(
  contract, request, input) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureIntegrityContractReceiptValid(
      contract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestPacketValid(
        request) || !exactKeys(input, ['responseId', 'claimedResponderId',
        'claimedSignerKeyId', 'claimedProducedAt', 'responseNonce', 'results']) ||
      !Array.isArray(input.results) || input.results.length !== 2 ||
      !input.results.every(claimedResultInputValid) ||
      new Set(input.results.map(item => item.requestEntryId)).size !== 2 ||
      !request.delegationVerificationRequests.every(entry =>
        input.results.some(item => item.requestEntryId === entry.requestEntryId))) {
    throw new Error(
      'Delegation-verification response needs exact R116/R115 sources and two bounded caller-supplied result claims');
  }
  const results = expectedResults(request, input.results);
  const envelope = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_ENVELOPE_SCHEMA,
    status:
      'CALLER_SUPPLIED_UNAUTHENTICATED_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE',
    sourceContract: sourceRef(contract),
    sourceRequestPacket: sourceRef(request),
    responseId: input.responseId,
    claimedHostResponder: {
      claimedResponderId: input.claimedResponderId,
      claimedSignerKeyId: input.claimedSignerKeyId,
      claimedProducedAt: input.claimedProducedAt
    },
    challengeResponse: {
      requestChallengeNonce: request.challenge.nonce,
      responseNonce: input.responseNonce,
      replayLedgerReceipt: null,
      challengeEchoMatched: true,
      hostAuthenticated: false
    },
    results,
    summary: expectedEnvelopeSummary(results),
    truth: expectedEnvelopeTruth()
  };
  envelope.digest = stableDigest(envelope);
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseEnvelopeValid(
      envelope, contract, request)) {
    throw new Error('Delegation-verification response envelope failed validation');
  }
  return envelope;
}

export function
canonicalLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseText(
  envelope) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseEnvelopeValid(
      envelope)) {
    throw new Error(
      'Canonical delegation-verification response text needs a valid envelope');
  }
  return JSON.stringify(envelope);
}

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureInputValid(
  input) {
  return exactKeys(input, ['schema', 'responseEnvelopeDigest',
      'publicKeyFormat', 'publicKeyRaw', 'signature']) &&
    input.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INPUT_SCHEMA &&
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

const expectedAssessmentVerdicts = signatureValid => ({
  responseEnvelopeStructuralVerdict: 'PASS',
  detachedSignatureIntegrityVerdict: signatureValid ? 'PASS' : 'FAIL',
  trustedResponseSignerKeyBindingVerdict: UNKNOWN,
  requestTransportVerdict: 'NOT_PROVEN',
  responseTransportVerdict: 'NOT_PROVEN',
  challengeAuthenticationVerdict: UNKNOWN,
  replayProtectionVerdict: UNKNOWN,
  hostRegistryConfigurationVerdict: UNKNOWN,
  hostGovernanceTrustRootResolutionVerdict: UNKNOWN,
  policyKeyDelegationVerificationVerdict: UNKNOWN,
  hostGovernanceAdmissionVerdict: NOT_AUTHORIZED,
  responseSignerKeyBindingVerdict: UNKNOWN
});

const expectedAssessmentTruth = signatureValid => ({
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

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureAssessmentValid(
  assessment, contract = null, request = null, envelope = null) {
  if (!digestValid(assessment,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA) ||
      !exactKeys(assessment, ['schema', 'status', 'sourceContract',
        'sourceRequestPacket', 'sourceResponseEnvelope', 'claimedHostResponder',
        'claimedResponseSummary', 'cryptographic', 'verdicts', 'issues',
        'truth', 'digest']) ||
      ![assessment.sourceContract, assessment.sourceRequestPacket,
        assessment.sourceResponseEnvelope].every(value => exactKeys(value,
          ['schema', 'receiptDigest'])) ||
      !exactKeys(assessment.claimedHostResponder, ['claimedResponderId',
        'claimedSignerKeyId', 'claimedProducedAt']) ||
      !exactKeys(assessment.claimedResponseSummary, ['resultCount',
        'claimedVerifiedResultCount', 'claimedRejectedResultCount',
        'claimedUnknownResultCount']) ||
      !exactKeys(assessment.cryptographic, ['signatureAlgorithm',
        'publicKeyFormat', 'publicKeyByteLength', 'signatureByteLength',
        'canonicalResponseCharacterCount', 'publicKeySha256',
        'signatureSha256', 'signatureValid']) ||
      !Array.isArray(assessment.issues)) return false;
  const signatureValid = assessment.cryptographic.signatureValid;
  const structural = typeof signatureValid === 'boolean' &&
    assessment.status === (signatureValid
      ? 'DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_VALID_WITH_UNTRUSTED_CALLER_SUPPLIED_KEY'
      : 'DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INVALID') &&
    Object.values(assessment.claimedHostResponder)
      .every(item => nonEmptyText(item, 512)) &&
    isoTimestamp(assessment.claimedHostResponder.claimedProducedAt) &&
    Object.values(assessment.claimedResponseSummary)
      .every(Number.isInteger) &&
    assessment.cryptographic.signatureAlgorithm === SIGNATURE_ALGORITHM &&
    assessment.cryptographic.publicKeyFormat === PUBLIC_KEY_FORMAT &&
    assessment.cryptographic.publicKeyByteLength ===
      ED25519_RAW_PUBLIC_KEY_BYTES &&
    assessment.cryptographic.signatureByteLength === ED25519_SIGNATURE_BYTES &&
    Number.isInteger(assessment.cryptographic.canonicalResponseCharacterCount) &&
    assessment.cryptographic.canonicalResponseCharacterCount > 0 &&
    assessment.cryptographic.canonicalResponseCharacterCount <=
      MAXIMUM_CANONICAL_RESPONSE_CHARACTERS &&
    sha256Digest(assessment.cryptographic.publicKeySha256) &&
    sha256Digest(assessment.cryptographic.signatureSha256) &&
    exact(assessment.verdicts, expectedAssessmentVerdicts(signatureValid)) &&
    exact(assessment.issues,
      signatureValid ? [] : ['detached-signature-invalid']) &&
    exact(assessment.truth, expectedAssessmentTruth(signatureValid));
  if (!structural || contract === null) return structural;
  return request && envelope &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureIntegrityContractReceiptValid(
      contract) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestPacketValid(
      request) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseEnvelopeValid(
      envelope, contract, request) &&
    exact(assessment.sourceContract, sourceRef(contract)) &&
    exact(assessment.sourceRequestPacket, sourceRef(request)) &&
    exact(assessment.sourceResponseEnvelope, sourceRef(envelope)) &&
    exact(assessment.claimedHostResponder, envelope.claimedHostResponder) &&
    exact(assessment.claimedResponseSummary, {
      resultCount: envelope.summary.resultCount,
      claimedVerifiedResultCount: envelope.summary.claimedVerifiedResultCount,
      claimedRejectedResultCount: envelope.summary.claimedRejectedResultCount,
      claimedUnknownResultCount: envelope.summary.claimedUnknownResultCount
    });
}

export async function
verifyLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignature(
  contract, sourceR115Contract, sourceR114Contract, sourceR113Contract,
  request, envelope, signatureInput) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureIntegrityContractReceiptValid(
      contract, sourceR115Contract, sourceR114Contract, sourceR113Contract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestPacketValid(
        request) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseEnvelopeValid(
        envelope, contract, request) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureInputValid(
        signatureInput) ||
      signatureInput.responseEnvelopeDigest !== envelope.digest) {
    throw new Error(
      'Delegation-verification response signature verification needs exact R116/R115/R114/R113, envelope, key, and signature inputs');
  }
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error('Web Crypto SubtleCrypto is unavailable');
  const publicKeyRaw = new Uint8Array(signatureInput.publicKeyRaw);
  const signature = new Uint8Array(signatureInput.signature);
  const canonicalText =
    canonicalLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseText(
      envelope);
  const publicKey = await subtle.importKey('raw', publicKeyRaw,
    { name: SIGNATURE_ALGORITHM }, false, ['verify']);
  const signatureValid = await subtle.verify({ name: SIGNATURE_ALGORITHM },
    publicKey, signature, new TextEncoder().encode(canonicalText));
  const assessment = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA,
    status: signatureValid
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
      signatureAlgorithm: SIGNATURE_ALGORITHM,
      publicKeyFormat: PUBLIC_KEY_FORMAT,
      publicKeyByteLength: publicKeyRaw.byteLength,
      signatureByteLength: signature.byteLength,
      canonicalResponseCharacterCount: canonicalText.length,
      publicKeySha256: await sha256ForBytes(publicKeyRaw),
      signatureSha256: await sha256ForBytes(signature),
      signatureValid
    },
    verdicts: expectedAssessmentVerdicts(signatureValid),
    issues: signatureValid ? [] : ['detached-signature-invalid'],
    truth: expectedAssessmentTruth(signatureValid)
  };
  assessment.digest = stableDigest(assessment);
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureAssessmentValid(
      assessment, contract, request, envelope)) {
    throw new Error(
      'Delegation-verification response signature assessment failed validation');
  }
  return assessment;
}

export function
matrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureIntegrityDescription() {
  return {
    contractReceiptSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
    routeProjectionSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INTEGRITY_ROUTE_PROJECTION_SCHEMA,
    responseResultSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_RESULT_SCHEMA,
    responseEnvelopeSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_ENVELOPE_SCHEMA,
    signatureInputSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INPUT_SCHEMA,
    signatureAssessmentSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA,
    signatureVerificationCapabilityId:
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_VERIFY_CAPABILITY_ID,
    requiredHostRegistryConfigureCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
    requiredTrustRootResolveCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
    requiredPolicyKeyDelegationVerifyCapabilityId:
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
    requiredAdmissionDecideCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID,
    requiredResponseSignerKeyBindCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
    signatureAlgorithm: SIGNATURE_ALGORITHM,
    publicKeyFormat: PUBLIC_KEY_FORMAT,
    maximumCanonicalResponseCharacters:
      MAXIMUM_CANONICAL_RESPONSE_CHARACTERS,
    detachedSignatureVerificationImplemented: true,
    callerSuppliedResponseSignerTrusted: false,
    requestTransmissionProven: false,
    responseTransportProven: false,
    challengeHostAuthenticationImplemented: false,
    replayProtectionImplemented: false,
    hostRegistryConfigurationImplemented: false,
    hostGovernanceTrustRootResolutionImplemented: false,
    policyKeyDelegationVerificationImplemented: false,
    hostGovernanceAdmissionImplemented: false,
    responseSignerKeyBindingImplemented: false,
    transientArtifactsPersisted: false,
    mutatesWorld: false,
    status:
      'TRANSIENT_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INTEGRITY_AVAILABLE_UNTRUSTED_CLAIMS_ONLY'
  };
}
