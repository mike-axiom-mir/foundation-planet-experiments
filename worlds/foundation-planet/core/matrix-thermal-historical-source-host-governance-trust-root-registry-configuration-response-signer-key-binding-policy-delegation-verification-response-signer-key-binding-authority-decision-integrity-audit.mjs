import {
  HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
  HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-root-admission-request.mjs?v=0.118.0-r118.1';
import {
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-request.mjs?v=0.118.0-r118.1';
import {
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestContractReceiptValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestPacketValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signer-key-binding-request.mjs?v=0.118.0-r118.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ROUTE_PROJECTION_SCHEMA,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_DECISION_SIGNATURE_VERIFY_CAPABILITY_ID,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_DECISION_REVOCATION_VERIFY_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionIntegrityAssessmentValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionEnvelopeValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingCallerSuppliedPolicyDescriptorValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRevocationSnapshotValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signer-key-binding-authority-decision-integrity.mjs?v=0.118.0-r118.1';

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

function digestValid(value) {
  if (value?.schema !==
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA ||
      typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function expectedProjection(sourceContract) {
  const projection = sourceContract.responseSignerKeyBindingRouteProjection;
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ROUTE_PROJECTION_SCHEMA,
    sourceRouteProjectionDigest: stableDigest(projection),
    sourceRouteCount: projection.sourceRouteCount,
    eligibleRouteCount: projection.eligibleRouteCount,
    authorityReviewRouteExcludedCount:
      projection.authorityReviewRouteExcludedCount,
    implementedCapabilityProjectionDigest: stableDigest([
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_DECISION_SIGNATURE_VERIFY_CAPABILITY_ID,
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_DECISION_REVOCATION_VERIFY_CAPABILITY_ID
    ]),
    requiredCapabilityProjectionDigest: stableDigest([
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
      HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
      HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID
    ]),
    truthProjectionDigest: stableDigest({
      validSignaturesMeanSuppliedPolicyKeyMatchOnly: true,
      callerSuppliedPolicyTrusted: false,
      policyKeyDelegationVerified: false,
      responseSignerKeyBound: false,
      hostRegistryConfigured: false,
      hostGovernanceTrustRootResolved: false,
      hostGovernanceAdmissionAuthorized: false,
      transientArtifactsPersisted: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      worldMutationPerformed: false
    })
  };
}

function result(status, detail) {
  return {
    id: 'land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signer-key-binding-authority-decision-integrity-contract',
    required: true,
    status,
    statement: 'Exact R117 response-signer-key binding requests gain detached decision and revocation signature-integrity checks under an explicitly untrusted caller policy, while policy delegation, actual binding, registry configuration, authority, persistence, and mutation remain unresolved.',
    detail
  };
}

export function
auditLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionIntegrityContract(
  receipt, source, sourceR116Contract, sourceR115Contract,
  sourceR114Contract, sourceR113Contract) {
  if (!receipt || !source || !sourceR116Contract || !sourceR115Contract ||
      !sourceR114Contract || !sourceR113Contract) {
    return result('FAIL', {
      reason: 'the transient R118 projection and its exact R117 source are required'
    });
  }
  const sourceIntegrity =
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestContractReceiptValid(
      source, sourceR116Contract, sourceR115Contract, sourceR114Contract,
      sourceR113Contract) && exact(receipt.source, {
      schema: source.schema,
      receiptDigest: source.digest
    });
  const projection = sourceIntegrity ? expectedProjection(source) : null;
  const projectionExact = sourceIntegrity &&
    exact(receipt.bindingDecisionIntegrityRouteProjection, projection) &&
    projection.sourceRouteCount === 28 && projection.eligibleRouteCount === 24 &&
    projection.authorityReviewRouteExcludedCount === 4;
  const structuralValid = digestValid(receipt) && exactKeys(receipt,
    ['schema', 'status', 'source', 'bindingDecisionIntegrityRouteProjection',
      'emission', 'digest']) && exactKeys(receipt.emission, ['mode']) &&
    sourceIntegrity && receipt.status ===
      'BINDING_DECISION_INTEGRITY_PROJECTION_ONLY' &&
    receipt.emission?.mode ===
      'native-from-intact-r117-response-signer-key-binding-request-contract';
  const valid = structuralValid && projectionExact;
  return result(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt.schema || null,
    structuralValid,
    sourceIntegrity,
    projectionExact,
    persistedInEarthState: false,
    bindingDecisionIntegrityRouteCount:
      receipt.bindingDecisionIntegrityRouteProjection?.sourceRouteCount ?? null,
    bindingDecisionIntegrityEligibleRouteCount:
      receipt.bindingDecisionIntegrityRouteProjection?.eligibleRouteCount ?? null,
    authorityReviewRouteExcludedCount:
      receipt.bindingDecisionIntegrityRouteProjection
        ?.authorityReviewRouteExcludedCount ?? null,
    implementedCapabilityProjectionDigest:
      receipt.bindingDecisionIntegrityRouteProjection
        ?.implementedCapabilityProjectionDigest || null,
    requiredCapabilityProjectionDigest:
      receipt.bindingDecisionIntegrityRouteProjection
        ?.requiredCapabilityProjectionDigest || null,
    truthProjectionDigest:
      receipt.bindingDecisionIntegrityRouteProjection
        ?.truthProjectionDigest || null,
    transientArtifactsPersisted: false,
    responseSignerKeyBound: false,
    hostRegistryConfigured: false,
    emissionMode: receipt.emission?.mode || null,
    sourceResponseSignerKeyBindingRequestContractDigest:
      receipt.source?.receiptDigest || null,
    receiptDigest: receipt.digest || null
  });
}

export function
auditLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionIntegrityAssessment(
  assessment, contract, packet, policy, decisionEnvelope, revocationSnapshot) {
  const sourcesValid =
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestPacketValid(
      packet) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingCallerSuppliedPolicyDescriptorValid(
      policy, contract, packet) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionEnvelopeValid(
      decisionEnvelope, contract, packet, policy) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRevocationSnapshotValid(
      revocationSnapshot, contract, policy);
  const refsExact = sourcesValid && exact(assessment?.sourceContract,
      { schema: contract.schema, receiptDigest: contract.digest }) &&
    exact(assessment?.sourceRequestPacket,
      { schema: packet.schema, receiptDigest: packet.digest }) &&
    exact(assessment?.sourcePolicyDescriptor,
      { schema: policy.schema, receiptDigest: policy.digest }) &&
    exact(assessment?.sourceDecisionEnvelope,
      { schema: decisionEnvelope.schema, receiptDigest: decisionEnvelope.digest }) &&
    exact(assessment?.sourceRevocationSnapshot,
      { schema: revocationSnapshot.schema,
        receiptDigest: revocationSnapshot.digest });
  const valid = sourcesValid && refsExact &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionIntegrityAssessmentValid(
      assessment) && assessment.truth.responseSignerKeyBound === false &&
    assessment.truth.hostRegistryConfigured === false &&
    assessment.truth.policyKeyDelegationVerified === false &&
    assessment.verdicts.hostGovernanceAdmissionVerdict === 'NOT_AUTHORIZED';
  return {
    id: 'land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signer-key-binding-authority-decision-integrity-assessment',
    required: true,
    status: valid ? 'PASS' : 'FAIL',
    statement: 'The transient decision-integrity assessment must remain bound to exact R118/R117 caller inputs and cannot claim delegated policy authority, signer-key binding, registry configuration, admission, persistence, or mutation.',
    detail: {
      sourcesValid,
      refsExact,
      integrityAssessmentValid:
        landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionIntegrityAssessmentValid(
          assessment),
      decisionAndRevocationIntegrityVerdict:
        assessment?.verdicts?.decisionAndRevocationIntegrityVerdict || null,
      callerSuppliedPolicyTrustVerdict:
        assessment?.verdicts?.callerSuppliedPolicyTrustVerdict || null,
      responseSignerKeyBindingVerdict:
        assessment?.verdicts?.responseSignerKeyBindingVerdict || null,
      hostRegistryConfigurationVerdict:
        assessment?.verdicts?.hostRegistryConfigurationVerdict || null,
      hostGovernanceAdmissionVerdict:
        assessment?.verdicts?.hostGovernanceAdmissionVerdict || null
    }
  };
}
