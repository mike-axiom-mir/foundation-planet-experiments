import {
  HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
  HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-root-admission-request.mjs?v=0.115.0-r115.1';
import {
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-request.mjs?v=0.115.0-r115.1';
import {
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceiptValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestPacketValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-request.mjs?v=0.115.0-r115.1';
import {
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingCallerSuppliedPolicyDescriptorValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionEnvelopeValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRevocationSnapshotValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionIntegrityAssessmentValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-authority-decision-integrity.mjs?v=0.115.0-r115.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_ROUTE_PROJECTION_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_ENTRY_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_EVIDENCE_REQUIREMENT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_PACKET_SCHEMA,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-request.mjs?v=0.115.0-r115.1';

const clone = value => JSON.parse(JSON.stringify(value));
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const sourceRef = value => ({ schema: value.schema, receiptDigest: value.digest });

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

function expectedProjection(sourceR114Contract) {
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

function contractResult(status, detail) {
  return {
    id: 'land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-request-contract',
    required: true,
    status,
    statement: 'Exact R114/R113 custody may produce only a transient policy-key delegation-verification request preflight; it does not verify delegation, configure a host registry, authorize admission, bind a response signer, persist artifacts, or mutate the world.',
    detail
  };
}

export function
auditLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestContract(
  receipt, sourceR114Contract, sourceR113Contract) {
  if (!receipt || !sourceR114Contract || !sourceR113Contract) {
    return contractResult('FAIL', {
      reason: 'the transient R115 receipt and exact R114/R113 contracts are required'
    });
  }
  const sourcesValid =
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      sourceR114Contract, sourceR113Contract) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceiptValid(
      sourceR113Contract) &&
    sourceR114Contract.source.receiptDigest === sourceR113Contract.digest;
  const expected = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    status: 'POLICY_KEY_DELEGATION_VERIFICATION_REQUEST_PROJECTION_ONLY',
    sourceR114Contract: sourceRef(sourceR114Contract),
    sourceR113Contract: sourceRef(sourceR113Contract),
    delegationVerificationRouteProjection:
      expectedProjection(sourceR114Contract),
    emission: {
      mode: 'transient-from-exact-r114-and-r113-response-signer-key-binding-contracts'
    }
  };
  expected.digest = stableDigest(expected);
  const receiptDigestValid = digestValid(receipt,
    LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA);
  const exactProjection = sourcesValid && exact(receipt, expected);
  return contractResult(receiptDigestValid && exactProjection ? 'PASS' : 'FAIL', {
    sourcesValid,
    receiptDigestValid,
    exactProjection,
    sourceRouteCount:
      receipt.delegationVerificationRouteProjection?.sourceRouteCount ?? null,
    eligibleRouteCount:
      receipt.delegationVerificationRouteProjection?.eligibleRouteCount ?? null,
    authorityReviewRouteExcludedCount:
      receipt.delegationVerificationRouteProjection
        ?.authorityReviewRouteExcludedCount ?? null,
    requestCreateCapabilityProjected: true,
    policyKeyDelegationVerified: false,
    responseSignerKeyBound: false,
    persistedInEarthState: false,
    receiptDigest: receipt.digest || null
  });
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
  verdict: 'UNKNOWN'
});

function expectedRequirements() {
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
    verdict: 'UNKNOWN'
  });
  return [
    entry('DECISION_KEY', policy.decisionKey),
    entry('REVOCATION_KEY', policy.revocationKey)
  ];
}

function expectedRequest(request, contract, sourceR114Contract,
  sourceR113Packet, policy, decisionEnvelope, revocationSnapshot,
  integrityAssessment) {
  const scope = sourceR113Packet.requestedSignerKeyBinding.bindingScope;
  const requirements = expectedRequirements();
  const expected = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_PACKET_SCHEMA,
    status:
      'POLICY_KEY_DELEGATION_VERIFICATION_REQUEST_CREATED_NOT_TRANSMITTED',
    requestId: request.requestId,
    requestedAt: request.requestedAt,
    expiresAt: request.expiresAt,
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
      expectedDelegationRequests(request.requestId, sourceR113Packet, policy),
    evidenceRequirements: requirements,
    challenge: {
      nonce: request.challenge?.nonce,
      mustBeAnsweredByHostResolvedTrustRoot: true,
      replayLedgerRequired: true,
      consumed: false
    },
    delivery: {
      mode: 'NOT_TRANSMITTED_NO_AUTHENTICATED_HOST_POLICY_DELEGATION_ENDPOINT',
      endpoint: null,
      transportReceipt: null,
      recipientIdentityAuthenticationVerdict: 'UNKNOWN'
    },
    summary: {
      delegationVerificationRequestCount: 2,
      evidenceRequirementCount: 6,
      satisfiedEvidenceRequirementCount: 0,
      transmittedRequestCount: 0,
      verifiedPolicyKeyDelegationCount: 0,
      configuredHostRegistryCount: 0,
      resolvedTrustRootCount: 0,
      authorizedAdmissionCount: 0,
      boundResponseSignerKeyCount: 0,
      persistedRequestPacketCount: 0,
      worldMutationCount: 0
    },
    verdicts: {
      requestCreationVerdict: 'PASS_TRANSIENT_REQUEST_CREATED',
      sourceDecisionAndRevocationIntegrityVerdict: 'REPORTED_PASS_UNTRUSTED',
      requestDeliveryVerdict: 'NOT_PERFORMED',
      hostRegistryConfigurationVerdict: 'UNKNOWN',
      hostGovernanceTrustRootResolutionVerdict: 'UNKNOWN',
      policyKeyDelegationVerificationVerdict: 'UNKNOWN',
      hostGovernanceAdmissionVerdict: 'NOT_AUTHORIZED',
      responseSignerKeyBindingVerdict: 'UNKNOWN'
    },
    truth: {
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
    }
  };
  expected.digest = stableDigest(expected);
  return expected;
}

function requestResult(status, detail) {
  return {
    id: 'land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-request-packet',
    required: true,
    status,
    statement: 'The R115 packet must be exact-source-bound, short-lived, challenge-bearing, untransmitted, and fail closed with every host authority, delegation, admission, binding, persistence, and mutation claim unresolved.',
    detail
  };
}

export function
auditLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestPacket(
  request, contract, sourceR114Contract, sourceR113Contract,
  sourceR113Packet, policy, decisionEnvelope, revocationSnapshot,
  integrityAssessment) {
  if (![request, contract, sourceR114Contract, sourceR113Contract,
    sourceR113Packet, policy, decisionEnvelope, revocationSnapshot,
    integrityAssessment].every(Boolean)) {
    return requestResult('FAIL', {
      reason: 'the transient R115 packet and exact R115/R114/R113 inputs are required'
    });
  }
  const contractAudit =
    auditLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestContract(
      contract, sourceR114Contract, sourceR113Contract);
  const sourcesValid = contractAudit.status === 'PASS' &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestPacketValid(
      sourceR113Packet) &&
    exact(sourceR113Packet.sourceContract, sourceRef(sourceR113Contract)) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingCallerSuppliedPolicyDescriptorValid(
      policy, sourceR114Contract, sourceR113Packet) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionEnvelopeValid(
      decisionEnvelope, sourceR114Contract, sourceR113Packet, policy) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRevocationSnapshotValid(
      revocationSnapshot, sourceR114Contract, policy) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionIntegrityAssessmentValid(
      integrityAssessment);
  const assessmentRefsExact = sourcesValid &&
    exact(integrityAssessment.sourceContract, sourceRef(sourceR114Contract)) &&
    exact(integrityAssessment.sourceRequestPacket, sourceRef(sourceR113Packet)) &&
    exact(integrityAssessment.sourcePolicyDescriptor, sourceRef(policy)) &&
    exact(integrityAssessment.sourceDecisionEnvelope, sourceRef(decisionEnvelope)) &&
    exact(integrityAssessment.sourceRevocationSnapshot, sourceRef(revocationSnapshot));
  const sourceGateOpen = assessmentRefsExact &&
    integrityAssessment.verdicts
      .decisionAndRevocationIntegrityVerdict === 'PASS' &&
    integrityAssessment.issues.length === 0 &&
    integrityAssessment.requestedAction.action === 'BIND' &&
    integrityAssessment.requestedAction.bindingApplied === false;
  const requestedAt = Date.parse(request.requestedAt);
  const expiresAt = Date.parse(request.expiresAt);
  const latestSourceExpiry = Math.min(
    Date.parse(sourceR113Packet.expiresAt), Date.parse(policy.validity.expiresAt),
    Date.parse(decisionEnvelope.expiresAt),
    Date.parse(revocationSnapshot.expiresAt));
  const temporalBoundsValid = Number.isFinite(requestedAt) &&
    Number.isFinite(expiresAt) && expiresAt > requestedAt &&
    expiresAt - requestedAt <= 5 * 60 * 1000 &&
    requestedAt >= Date.parse(integrityAssessment.evaluatedAt) &&
    expiresAt <= latestSourceExpiry;
  const challengeUnique = typeof request.challenge?.nonce === 'string' &&
    request.challenge.nonce.length > 0 &&
    request.challenge.nonce !== decisionEnvelope.nonce &&
    request.challenge.nonce !== revocationSnapshot.nonce;
  const requestDigestValid = digestValid(request,
    LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_PACKET_SCHEMA);
  const expected = sourceGateOpen
    ? expectedRequest(request, contract, sourceR114Contract, sourceR113Packet,
      policy, decisionEnvelope, revocationSnapshot, integrityAssessment)
    : null;
  const exactPacket = expected !== null && exact(request, expected);
  const valid = sourcesValid && assessmentRefsExact && sourceGateOpen &&
    temporalBoundsValid && challengeUnique && requestDigestValid && exactPacket;
  return requestResult(valid ? 'PASS' : 'FAIL', {
    contractAuditStatus: contractAudit.status,
    sourcesValid,
    assessmentRefsExact,
    sourceGateOpen,
    temporalBoundsValid,
    challengeUnique,
    requestDigestValid,
    exactPacket,
    requestStatus: request.status || null,
    requestDeliveryMode: request.delivery?.mode || null,
    delegationVerificationRequestCount:
      request.summary?.delegationVerificationRequestCount ?? null,
    evidenceRequirementCount:
      request.summary?.evidenceRequirementCount ?? null,
    verifiedPolicyKeyDelegationCount:
      request.summary?.verifiedPolicyKeyDelegationCount ?? null,
    requestTransmitted:
      request.truth?.policyDelegationVerificationRequestTransmitted ?? null,
    policyKeyDelegationVerified:
      request.truth?.policyKeyDelegationVerified ?? null,
    responseSignerKeyBound: request.truth?.responseSignerKeyBound ?? null,
    persisted: request.truth?.persisted ?? null,
    worldMutationPerformed:
      request.truth?.worldMutationPerformed ?? null,
    requestDigest: request.digest || null
  });
}
