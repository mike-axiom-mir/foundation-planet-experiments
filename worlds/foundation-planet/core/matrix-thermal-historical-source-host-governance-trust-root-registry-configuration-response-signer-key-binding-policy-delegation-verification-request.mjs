import {
  HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
  HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-root-admission-request.mjs?v=0.115.0-r115.1';
import {
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-request.mjs?v=0.115.0-r115.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA,
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceiptValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestPacketValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-request.mjs?v=0.115.0-r115.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_ENVELOPE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REVOCATION_SNAPSHOT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ASSESSMENT_SCHEMA,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingCallerSuppliedPolicyDescriptorValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionEnvelopeValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRevocationSnapshotValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionIntegrityAssessmentValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-authority-decision-integrity.mjs?v=0.115.0-r115.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-request-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_ROUTE_PROJECTION_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-route-projection/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_ENTRY_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-request-entry/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_EVIDENCE_REQUIREMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-evidence-requirement/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_PACKET_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-request-packet/v1';

export const
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID =
    'contract.host-governance.policy-key.delegation.verification.request.create';

const UNKNOWN = 'UNKNOWN';
const NOT_AUTHORIZED = 'NOT_AUTHORIZED';
const MAXIMUM_REQUEST_LIFETIME_MS = 5 * 60 * 1000;
const NATIVE_EMISSION_MODE =
  'transient-from-exact-r114-and-r113-response-signer-key-binding-contracts';
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

function expectedRouteProjection(sourceR114Contract) {
  const sourceProjection =
    sourceR114Contract.bindingDecisionIntegrityRouteProjection;
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_ROUTE_PROJECTION_SCHEMA,
    sourceR114RouteProjectionDigest: stableDigest(sourceProjection),
    sourceRouteCount: sourceProjection.sourceRouteCount,
    eligibleRouteCount: sourceProjection.eligibleRouteCount,
    authorityReviewRouteExcludedCount:
      sourceProjection.authorityReviewRouteExcludedCount,
    implementedCapabilityProjectionDigest: stableDigest([
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID
    ]),
    requiredCapabilityProjectionDigest: stableDigest([
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
      HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
      HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID,
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID
    ]),
    truthProjectionDigest: stableDigest({
      requestCreationOnly: true,
      requestTransmitted: false,
      callerSuppliedPolicyTrusted: false,
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
landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestContractReceiptValid(
  receipt, sourceR114Contract = null, sourceR113Contract = null) {
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'sourceR114Contract',
        'sourceR113Contract', 'delegationVerificationRouteProjection',
        'emission', 'digest']) ||
      !exactKeys(receipt.sourceR114Contract, ['schema', 'receiptDigest']) ||
      !exactKeys(receipt.sourceR113Contract, ['schema', 'receiptDigest']) ||
      !exactKeys(receipt.delegationVerificationRouteProjection,
        ['schema', 'sourceR114RouteProjectionDigest', 'sourceRouteCount',
          'eligibleRouteCount', 'authorityReviewRouteExcludedCount',
          'implementedCapabilityProjectionDigest',
          'requiredCapabilityProjectionDigest', 'truthProjectionDigest']) ||
      !exactKeys(receipt.emission, ['mode']) ||
      receipt.sourceR114Contract.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA ||
      receipt.sourceR113Contract.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA ||
      !fnvDigest(receipt.sourceR114Contract.receiptDigest) ||
      !fnvDigest(receipt.sourceR113Contract.receiptDigest)) return false;
  const projection = sourceR114Contract === null
    ? receipt.delegationVerificationRouteProjection
    : expectedRouteProjection(sourceR114Contract);
  const projectionValid = projection.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_ROUTE_PROJECTION_SCHEMA &&
    fnvDigest(projection.sourceR114RouteProjectionDigest) &&
    fnvDigest(projection.implementedCapabilityProjectionDigest) &&
    fnvDigest(projection.requiredCapabilityProjectionDigest) &&
    fnvDigest(projection.truthProjectionDigest) &&
    projection.sourceRouteCount === 28 && projection.eligibleRouteCount === 24 &&
    projection.authorityReviewRouteExcludedCount === 4;
  const sourcesExact = sourceR114Contract === null ||
    (sourceR113Contract &&
      landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
        sourceR114Contract, sourceR113Contract) &&
      landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceiptValid(
        sourceR113Contract) &&
      sourceR114Contract.source.receiptDigest === sourceR113Contract.digest &&
      exact(receipt.sourceR114Contract, sourceRef(sourceR114Contract)) &&
      exact(receipt.sourceR113Contract, sourceRef(sourceR113Contract)) &&
      exact(receipt.delegationVerificationRouteProjection, projection));
  return projectionValid && sourcesExact && receipt.status ===
      'POLICY_KEY_DELEGATION_VERIFICATION_REQUEST_PROJECTION_ONLY' &&
    receipt.emission.mode === NATIVE_EMISSION_MODE;
}

export function
createLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestContractReceipt(
  sourceR114Contract, sourceR113Contract) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      sourceR114Contract, sourceR113Contract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceiptValid(
        sourceR113Contract) ||
      sourceR114Contract.source.receiptDigest !== sourceR113Contract.digest) {
    throw new Error(
      'Delegation-verification request contract needs exact attached R114 and R113 contracts');
  }
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    status: 'POLICY_KEY_DELEGATION_VERIFICATION_REQUEST_PROJECTION_ONLY',
    sourceR114Contract: sourceRef(sourceR114Contract),
    sourceR113Contract: sourceRef(sourceR113Contract),
    delegationVerificationRouteProjection:
      expectedRouteProjection(sourceR114Contract),
    emission: { mode: NATIVE_EMISSION_MODE }
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestContractReceiptValid(
      receipt, sourceR114Contract, sourceR113Contract)) {
    throw new Error('Delegation-verification request contract failed validation');
  }
  return receipt;
}

const requirement = (requirementId, requiredCapabilityId,
  acceptableEvidenceOrigin) => ({
  schema:
    LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_EVIDENCE_REQUIREMENT_SCHEMA,
  requirementId,
  requiredCapabilityId,
  acceptableEvidenceOrigin,
  forbiddenEvidenceOrigin:
    'CALLER_POLICY_DECISION_OR_INTEGRITY_ASSESSMENT_SELF_ASSERTION',
  satisfied: false,
  verdict: UNKNOWN
});

function expectedEvidenceRequirements() {
  return [
    requirement('host-registry-configuration',
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
      'AUTHENTICATED_HOST_REGISTRY_CONFIGURATION_RECEIPT'),
    requirement('host-trust-root-resolution',
      HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
      'HOST_RESOLVED_CURRENT_NON_REVOKED_TRUST_ROOT_RECEIPT'),
    requirement('decision-key-delegation-chain',
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
      'HOST_VERIFIED_DELEGATION_CHAIN_FROM_RESOLVED_TRUST_ROOT'),
    requirement('revocation-key-delegation-chain',
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
      'HOST_VERIFIED_DELEGATION_CHAIN_FROM_RESOLVED_TRUST_ROOT'),
    requirement('delegations-current-and-non-revoked',
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
      'HOST_AUTHENTICATED_REVOCATION_AND_VALIDITY_RECEIPT'),
    requirement('delegated-scope-covers-exact-r113-binding',
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
      'HOST_VERIFIED_EXACT_SCOPE_DELEGATION_RECEIPT')
  ];
}

function expectedDelegationRequests(requestId, packet, policy) {
  const scope = packet.requestedSignerKeyBinding.bindingScope;
  const delegatedScope = {
    governanceDomainId: scope.governanceDomainId,
    worldId: scope.worldId,
    lineageId: scope.lineageId,
    claimedResponderId: scope.claimedResponderId,
    claimedSignerKeyId: scope.claimedSignerKeyId,
    requestedAction: 'BIND'
  };
  const entry = (keyRole, key) => ({
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_ENTRY_SCHEMA,
    requestEntryId: `${requestId}:${keyRole.toLowerCase()}`,
    keyRole,
    keyId: key.keyId,
    publicKeySha256: key.publicKeySha256,
    requiredCapabilityId:
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
    delegatedScope: clone(delegatedScope),
    acceptableEvidenceOrigin:
      'HOST_RESOLVED_TRUST_ROOT_AND_HOST_AUTHENTICATED_DELEGATION_CHAIN',
    forbiddenEvidenceOrigin:
      'CALLER_POLICY_DECISION_OR_INTEGRITY_ASSESSMENT_SELF_ASSERTION',
    rawPublicKeyIncluded: false,
    verified: false,
    verdict: UNKNOWN
  });
  return [
    entry('DECISION_KEY', policy.decisionKey),
    entry('REVOCATION_KEY', policy.revocationKey)
  ];
}

const expectedDelivery = () => ({
  mode: 'NOT_TRANSMITTED_NO_AUTHENTICATED_HOST_POLICY_DELEGATION_ENDPOINT',
  endpoint: null,
  transportReceipt: null,
  recipientIdentityAuthenticationVerdict: UNKNOWN
});

function expectedSummary(requirements) {
  return {
    delegationVerificationRequestCount: 2,
    evidenceRequirementCount: requirements.length,
    satisfiedEvidenceRequirementCount: 0,
    transmittedRequestCount: 0,
    verifiedPolicyKeyDelegationCount: 0,
    configuredHostRegistryCount: 0,
    resolvedTrustRootCount: 0,
    authorizedAdmissionCount: 0,
    boundResponseSignerKeyCount: 0,
    persistedRequestPacketCount: 0,
    worldMutationCount: 0
  };
}

const expectedVerdicts = () => ({
  requestCreationVerdict: 'PASS_TRANSIENT_REQUEST_CREATED',
  sourceDecisionAndRevocationIntegrityVerdict: 'REPORTED_PASS_UNTRUSTED',
  requestDeliveryVerdict: 'NOT_PERFORMED',
  hostRegistryConfigurationVerdict: UNKNOWN,
  hostGovernanceTrustRootResolutionVerdict: UNKNOWN,
  policyKeyDelegationVerificationVerdict: UNKNOWN,
  hostGovernanceAdmissionVerdict: NOT_AUTHORIZED,
  responseSignerKeyBindingVerdict: UNKNOWN
});

const expectedTruth = () => ({
  exactR115ContractBound: true,
  exactR114ContractBound: true,
  exactR113RequestPacketBound: true,
  exactCallerSuppliedPolicyDescriptorBound: true,
  exactBindingDecisionEnvelopeBound: true,
  exactRevocationSnapshotBound: true,
  exactR114IntegrityAssessmentBound: true,
  sourceIntegrityReportedPassUnderUntrustedPolicy: true,
  policyDelegationVerificationRequestCreated: true,
  policyDelegationVerificationRequestTransmitted: false,
  authenticatedHostPolicyDelegationEndpointKnown: false,
  candidateMaySelfAuthorize: false,
  rawPublicKeysIncluded: false,
  signatureBytesIncluded: false,
  callerSuppliedPolicyTrusted: false,
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

function requirementShapeValid(value) {
  return exactKeys(value, ['schema', 'requirementId',
      'requiredCapabilityId', 'acceptableEvidenceOrigin',
      'forbiddenEvidenceOrigin', 'satisfied', 'verdict']) &&
    value.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_EVIDENCE_REQUIREMENT_SCHEMA &&
    nonEmptyText(value.requirementId, 256) &&
    nonEmptyText(value.requiredCapabilityId, 256) &&
    nonEmptyText(value.acceptableEvidenceOrigin, 256) &&
    value.forbiddenEvidenceOrigin ===
      'CALLER_POLICY_DECISION_OR_INTEGRITY_ASSESSMENT_SELF_ASSERTION' &&
    value.satisfied === false && value.verdict === UNKNOWN;
}

function delegationRequestShapeValid(value) {
  if (!exactKeys(value, ['schema', 'requestEntryId', 'keyRole', 'keyId',
      'publicKeySha256', 'requiredCapabilityId', 'delegatedScope',
      'acceptableEvidenceOrigin', 'forbiddenEvidenceOrigin',
      'rawPublicKeyIncluded', 'verified', 'verdict']) ||
      !exactKeys(value.delegatedScope, ['governanceDomainId', 'worldId',
        'lineageId', 'claimedResponderId', 'claimedSignerKeyId',
        'requestedAction'])) return false;
  return value.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_ENTRY_SCHEMA &&
    nonEmptyText(value.requestEntryId, 512) &&
    ['DECISION_KEY', 'REVOCATION_KEY'].includes(value.keyRole) &&
    nonEmptyText(value.keyId, 256) && sha256Digest(value.publicKeySha256) &&
    value.requiredCapabilityId ===
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID &&
    Object.values(value.delegatedScope).every(item => nonEmptyText(item, 512)) &&
    value.delegatedScope.requestedAction === 'BIND' &&
    value.acceptableEvidenceOrigin ===
      'HOST_RESOLVED_TRUST_ROOT_AND_HOST_AUTHENTICATED_DELEGATION_CHAIN' &&
    value.forbiddenEvidenceOrigin ===
      'CALLER_POLICY_DECISION_OR_INTEGRITY_ASSESSMENT_SELF_ASSERTION' &&
    value.rawPublicKeyIncluded === false && value.verified === false &&
    value.verdict === UNKNOWN;
}

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestPacketValid(
  request, contract = null, sourceR114Contract = null,
  sourceR113Contract = null, sourceR113Packet = null, policy = null,
  decisionEnvelope = null, revocationSnapshot = null,
  integrityAssessment = null) {
  if (!digestValid(request,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_PACKET_SCHEMA) ||
      !exactKeys(request, ['schema', 'status', 'requestId', 'requestedAt',
        'expiresAt', 'sourceContract', 'sourceR114Contract',
        'sourceR113RequestPacket', 'sourcePolicyDescriptor',
        'sourceDecisionEnvelope', 'sourceRevocationSnapshot',
        'sourceIntegrityAssessment', 'hostGovernanceTarget',
        'requestedSignerKeyBinding', 'candidatePolicy',
        'delegationVerificationRequests', 'evidenceRequirements',
        'challenge', 'delivery', 'summary', 'verdicts', 'truth', 'digest']) ||
      !exactKeys(request.hostGovernanceTarget, ['governanceDomainId',
        'worldId', 'lineageId', 'claimedResponderId', 'claimedSignerKeyId',
        'status']) ||
      !exactKeys(request.candidatePolicy, ['policyId', 'policyRevision',
        'claimedReviewSeatId', 'decisionKey', 'revocationKey',
        'trustVerdict']) ||
      !exactKeys(request.candidatePolicy.decisionKey,
        ['keyId', 'publicKeySha256']) ||
      !exactKeys(request.candidatePolicy.revocationKey,
        ['keyId', 'publicKeySha256']) ||
      !exactKeys(request.challenge, ['nonce',
        'mustBeAnsweredByHostResolvedTrustRoot', 'replayLedgerRequired',
        'consumed']) ||
      !Array.isArray(request.delegationVerificationRequests) ||
      !request.delegationVerificationRequests.every(
        delegationRequestShapeValid) ||
      !Array.isArray(request.evidenceRequirements) ||
      !request.evidenceRequirements.every(requirementShapeValid)) return false;
  const sourceShape = value => exactKeys(value, ['schema', 'receiptDigest']) &&
    nonEmptyText(value.schema, 512) && fnvDigest(value.receiptDigest);
  if (![request.sourceContract, request.sourceR114Contract,
    request.sourceR113RequestPacket, request.sourcePolicyDescriptor,
    request.sourceDecisionEnvelope, request.sourceRevocationSnapshot,
    request.sourceIntegrityAssessment].every(sourceShape)) return false;
  const structural = request.status ===
      'POLICY_KEY_DELEGATION_VERIFICATION_REQUEST_CREATED_NOT_TRANSMITTED' &&
    nonEmptyText(request.requestId, 256) && isoTimestamp(request.requestedAt) &&
    isoTimestamp(request.expiresAt) &&
    Date.parse(request.expiresAt) > Date.parse(request.requestedAt) &&
    Date.parse(request.expiresAt) - Date.parse(request.requestedAt) <=
      MAXIMUM_REQUEST_LIFETIME_MS &&
    request.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA &&
    request.sourceR114Contract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    request.sourceR113RequestPacket.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA &&
    request.sourcePolicyDescriptor.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA &&
    request.sourceDecisionEnvelope.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_ENVELOPE_SCHEMA &&
    request.sourceRevocationSnapshot.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REVOCATION_SNAPSHOT_SCHEMA &&
    request.sourceIntegrityAssessment.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ASSESSMENT_SCHEMA &&
    Object.values(request.hostGovernanceTarget)
      .every(value => nonEmptyText(value, 512)) &&
    request.hostGovernanceTarget.status ===
      'CLAIMED_SCOPE_NOT_HOST_AUTHENTICATED' &&
    nonEmptyText(request.candidatePolicy.policyId, 256) &&
    Number.isInteger(request.candidatePolicy.policyRevision) &&
    request.candidatePolicy.policyRevision > 0 &&
    nonEmptyText(request.candidatePolicy.claimedReviewSeatId, 256) &&
    nonEmptyText(request.candidatePolicy.decisionKey.keyId, 256) &&
    sha256Digest(request.candidatePolicy.decisionKey.publicKeySha256) &&
    nonEmptyText(request.candidatePolicy.revocationKey.keyId, 256) &&
    sha256Digest(request.candidatePolicy.revocationKey.publicKeySha256) &&
    request.candidatePolicy.trustVerdict === 'UNTRUSTED_CALLER_SUPPLIED' &&
    request.delegationVerificationRequests.length === 2 &&
    exact(request.evidenceRequirements, expectedEvidenceRequirements()) &&
    nonEmptyText(request.challenge.nonce, 256) &&
    request.challenge.mustBeAnsweredByHostResolvedTrustRoot === true &&
    request.challenge.replayLedgerRequired === true &&
    request.challenge.consumed === false &&
    exact(request.delivery, expectedDelivery()) &&
    exact(request.summary, expectedSummary(request.evidenceRequirements)) &&
    exact(request.verdicts, expectedVerdicts()) &&
    exact(request.truth, expectedTruth());
  if (!structural || contract === null) return structural;
  if (!sourceR114Contract || !sourceR113Contract || !sourceR113Packet || !policy ||
      !decisionEnvelope || !revocationSnapshot || !integrityAssessment ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestContractReceiptValid(
        contract, sourceR114Contract, sourceR113Contract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestPacketValid(
        sourceR113Packet) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingCallerSuppliedPolicyDescriptorValid(
        policy, sourceR114Contract, sourceR113Packet) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionEnvelopeValid(
        decisionEnvelope, sourceR114Contract, sourceR113Packet, policy) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRevocationSnapshotValid(
        revocationSnapshot, sourceR114Contract, policy) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionIntegrityAssessmentValid(
        integrityAssessment)) return false;
  const assessmentRefsExact =
    exact(integrityAssessment.sourceContract, sourceRef(sourceR114Contract)) &&
    exact(integrityAssessment.sourceRequestPacket, sourceRef(sourceR113Packet)) &&
    exact(integrityAssessment.sourcePolicyDescriptor, sourceRef(policy)) &&
    exact(integrityAssessment.sourceDecisionEnvelope,
      sourceRef(decisionEnvelope)) &&
    exact(integrityAssessment.sourceRevocationSnapshot,
      sourceRef(revocationSnapshot));
  const scope = sourceR113Packet.requestedSignerKeyBinding.bindingScope;
  const latestExpiry = Math.min(Date.parse(sourceR113Packet.expiresAt),
    Date.parse(policy.validity.expiresAt), Date.parse(decisionEnvelope.expiresAt),
    Date.parse(revocationSnapshot.expiresAt));
  return assessmentRefsExact &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceiptValid(
      sourceR113Contract) &&
    sourceR114Contract.source.receiptDigest === sourceR113Contract.digest &&
    exact(request.sourceContract, sourceRef(contract)) &&
    exact(request.sourceR114Contract, sourceRef(sourceR114Contract)) &&
    exact(request.sourceR113RequestPacket, sourceRef(sourceR113Packet)) &&
    exact(request.sourcePolicyDescriptor, sourceRef(policy)) &&
    exact(request.sourceDecisionEnvelope, sourceRef(decisionEnvelope)) &&
    exact(request.sourceRevocationSnapshot, sourceRef(revocationSnapshot)) &&
    exact(request.sourceIntegrityAssessment, sourceRef(integrityAssessment)) &&
    integrityAssessment.verdicts.decisionAndRevocationIntegrityVerdict ===
      'PASS' && integrityAssessment.issues.length === 0 &&
    integrityAssessment.requestedAction.action === 'BIND' &&
    integrityAssessment.requestedAction.bindingApplied === false &&
    Date.parse(request.requestedAt) >=
      Date.parse(integrityAssessment.evaluatedAt) &&
    Date.parse(request.expiresAt) <= latestExpiry &&
    request.challenge.nonce !== decisionEnvelope.nonce &&
    request.challenge.nonce !== revocationSnapshot.nonce &&
    exact(request.hostGovernanceTarget, {
      governanceDomainId: scope.governanceDomainId,
      worldId: scope.worldId,
      lineageId: scope.lineageId,
      claimedResponderId: scope.claimedResponderId,
      claimedSignerKeyId: scope.claimedSignerKeyId,
      status: 'CLAIMED_SCOPE_NOT_HOST_AUTHENTICATED'
    }) &&
    exact(request.requestedSignerKeyBinding,
      sourceR113Packet.requestedSignerKeyBinding) &&
    exact(request.candidatePolicy, {
      policyId: policy.policyId,
      policyRevision: policy.policyRevision,
      claimedReviewSeatId: policy.claimedReviewSeatId,
      decisionKey: clone(policy.decisionKey),
      revocationKey: clone(policy.revocationKey),
      trustVerdict: 'UNTRUSTED_CALLER_SUPPLIED'
    }) &&
    exact(request.delegationVerificationRequests,
      expectedDelegationRequests(request.requestId, sourceR113Packet, policy));
}

export function
createLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestPacket(
  contract, sourceR114Contract, sourceR113Contract, sourceR113Packet, policy,
  decisionEnvelope, revocationSnapshot, integrityAssessment, input) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestContractReceiptValid(
      contract, sourceR114Contract, sourceR113Contract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestPacketValid(
        sourceR113Packet) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingCallerSuppliedPolicyDescriptorValid(
        policy, sourceR114Contract, sourceR113Packet) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionEnvelopeValid(
        decisionEnvelope, sourceR114Contract, sourceR113Packet, policy) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRevocationSnapshotValid(
        revocationSnapshot, sourceR114Contract, policy) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionIntegrityAssessmentValid(
        integrityAssessment) ||
      !exactKeys(input, ['requestId', 'requestedAt', 'expiresAt',
        'challengeNonce'])) {
    throw new Error(
      'Delegation-verification request needs exact R115/R114/R113 transient sources and bounded input');
  }
  if (integrityAssessment.verdicts.decisionAndRevocationIntegrityVerdict !==
        'PASS' || integrityAssessment.issues.length !== 0 ||
      integrityAssessment.requestedAction.action !== 'BIND' ||
      integrityAssessment.requestedAction.bindingApplied !== false) {
    throw new Error(
      'Delegation-verification request requires an exact unapplied R114 BIND integrity PASS');
  }
  const scope = sourceR113Packet.requestedSignerKeyBinding.bindingScope;
  const requirements = expectedEvidenceRequirements();
  const request = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_PACKET_SCHEMA,
    status:
      'POLICY_KEY_DELEGATION_VERIFICATION_REQUEST_CREATED_NOT_TRANSMITTED',
    requestId: input.requestId,
    requestedAt: input.requestedAt,
    expiresAt: input.expiresAt,
    sourceContract: sourceRef(contract),
    sourceR114Contract: sourceRef(sourceR114Contract),
    sourceR113RequestPacket: sourceRef(sourceR113Packet),
    sourcePolicyDescriptor: sourceRef(policy),
    sourceDecisionEnvelope: sourceRef(decisionEnvelope),
    sourceRevocationSnapshot: sourceRef(revocationSnapshot),
    sourceIntegrityAssessment: sourceRef(integrityAssessment),
    hostGovernanceTarget: {
      governanceDomainId: scope.governanceDomainId,
      worldId: scope.worldId,
      lineageId: scope.lineageId,
      claimedResponderId: scope.claimedResponderId,
      claimedSignerKeyId: scope.claimedSignerKeyId,
      status: 'CLAIMED_SCOPE_NOT_HOST_AUTHENTICATED'
    },
    requestedSignerKeyBinding:
      clone(sourceR113Packet.requestedSignerKeyBinding),
    candidatePolicy: {
      policyId: policy.policyId,
      policyRevision: policy.policyRevision,
      claimedReviewSeatId: policy.claimedReviewSeatId,
      decisionKey: clone(policy.decisionKey),
      revocationKey: clone(policy.revocationKey),
      trustVerdict: 'UNTRUSTED_CALLER_SUPPLIED'
    },
    delegationVerificationRequests:
      expectedDelegationRequests(input.requestId, sourceR113Packet, policy),
    evidenceRequirements: requirements,
    challenge: {
      nonce: input.challengeNonce,
      mustBeAnsweredByHostResolvedTrustRoot: true,
      replayLedgerRequired: true,
      consumed: false
    },
    delivery: expectedDelivery(),
    summary: expectedSummary(requirements),
    verdicts: expectedVerdicts(),
    truth: expectedTruth()
  };
  request.digest = stableDigest(request);
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestPacketValid(
      request, contract, sourceR114Contract, sourceR113Contract,
      sourceR113Packet, policy, decisionEnvelope, revocationSnapshot,
      integrityAssessment)) {
    throw new Error('Delegation-verification request packet failed validation');
  }
  return request;
}

export function
matrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestDescription() {
  return {
    contractReceiptSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    routeProjectionSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_ROUTE_PROJECTION_SCHEMA,
    requestEntrySchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_ENTRY_SCHEMA,
    evidenceRequirementSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_EVIDENCE_REQUIREMENT_SCHEMA,
    requestPacketSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_PACKET_SCHEMA,
    requestCreateCapabilityId:
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID,
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
    requestTransmitted: false,
    callerSuppliedPolicyTrusted: false,
    hostRegistryConfigured: false,
    hostGovernanceTrustRootResolved: false,
    policyKeyDelegationVerified: false,
    hostGovernanceAdmissionAuthorized: false,
    responseSignerKeyBindingImplemented: false,
    transientArtifactsPersisted: false,
    status:
      'TRANSIENT_POLICY_KEY_DELEGATION_VERIFICATION_REQUEST_AVAILABLE_NOT_TRANSMITTED_AUTHORITY_AND_BINDING_STILL_MISSING'
  };
}
