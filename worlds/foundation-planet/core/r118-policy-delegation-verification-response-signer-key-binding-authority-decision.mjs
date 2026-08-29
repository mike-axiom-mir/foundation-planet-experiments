import {
  HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
  HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-root-admission-request.mjs?v=0.118.0-r118.1';
import {
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-request.mjs?v=0.118.0-r118.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestContractReceiptValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestPacketValid
} from './r117-policy-delegation-verification-response-signer-key-binding-request.mjs?v=0.118.0-r118.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signer-key-binding-authority-decision-integrity-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ROUTE_PROJECTION_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signer-key-binding-authority-decision-integrity-route-projection/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signer-key-binding-caller-supplied-policy-descriptor/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_ENVELOPE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signer-key-binding-authority-decision-envelope/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REVOCATION_SNAPSHOT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signer-key-binding-revocation-snapshot/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_SIGNATURE_INPUT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signer-key-binding-authority-signature-input/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ASSESSMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signer-key-binding-authority-decision-integrity-assessment/v1';

export const
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_DECISION_SIGNATURE_VERIFY_CAPABILITY_ID =
    'integrity.host-governance.policy-key.delegation.verification.response.signer-key.binding-decision.signature.verify';
export const
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_DECISION_REVOCATION_VERIFY_CAPABILITY_ID =
    'integrity.host-governance.policy-key.delegation.verification.response.signer-key.binding-decision.revocation.verify';

const SIGNATURE_ALGORITHM = 'Ed25519';
const PUBLIC_KEY_FORMAT = 'raw-ed25519-32-byte';
const ED25519_RAW_PUBLIC_KEY_BYTES = 32;
const ED25519_SIGNATURE_BYTES = 64;
const UNKNOWN = 'UNKNOWN';
const NOT_AUTHORIZED = 'NOT_AUTHORIZED';
const NATIVE_EMISSION_MODE =
  'native-from-intact-r117-response-signer-key-binding-request-contract';
const ALLOWED_ACTIONS = ['BIND', 'HOLD', 'REJECT'];
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
const unique = values => new Set(values).size === values.length;
const sorted = values => exact(values, [...values].sort());

async function sha256ForBytes(bytes) {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return 'sha256:' + Array.from(new Uint8Array(digest), value =>
    value.toString(16).padStart(2, '0')).join('');
}

function expectedRouteProjection(sourceContract) {
  const sourceProjection = sourceContract.responseSignerKeyBindingRouteProjection;
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ROUTE_PROJECTION_SCHEMA,
    sourceRouteProjectionDigest: stableDigest(sourceProjection),
    sourceRouteCount: sourceProjection.sourceRouteCount,
    eligibleRouteCount: sourceProjection.eligibleRouteCount,
    authorityReviewRouteExcludedCount:
      sourceProjection.authorityReviewRouteExcludedCount,
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

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
  receipt, sourceContract = null, sourceR116Contract = null,
  sourceR115Contract = null, sourceR114Contract = null,
  sourceR113Contract = null) {
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'source',
        'bindingDecisionIntegrityRouteProjection', 'emission', 'digest']) ||
      !exactKeys(receipt.source, ['schema', 'receiptDigest']) ||
      !exactKeys(receipt.bindingDecisionIntegrityRouteProjection,
        ['schema', 'sourceRouteProjectionDigest', 'sourceRouteCount',
          'eligibleRouteCount', 'authorityReviewRouteExcludedCount',
          'implementedCapabilityProjectionDigest',
          'requiredCapabilityProjectionDigest', 'truthProjectionDigest']) ||
      !exactKeys(receipt.emission, ['mode']) ||
      receipt.source.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA ||
      !fnvDigest(receipt.source.receiptDigest)) return false;
  const projection = sourceContract === null
    ? receipt.bindingDecisionIntegrityRouteProjection
    : expectedRouteProjection(sourceContract);
  const sourceExact = sourceContract === null ||
    (sourceR116Contract && sourceR115Contract && sourceR114Contract &&
      sourceR113Contract &&
      landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestContractReceiptValid(
        sourceContract, sourceR116Contract, sourceR115Contract,
        sourceR114Contract, sourceR113Contract) &&
      exact(receipt.source, sourceRef(sourceContract)) &&
      exact(receipt.bindingDecisionIntegrityRouteProjection, projection));
  const projectionExact = projection.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ROUTE_PROJECTION_SCHEMA &&
    fnvDigest(projection.sourceRouteProjectionDigest) &&
    fnvDigest(projection.implementedCapabilityProjectionDigest) &&
    fnvDigest(projection.requiredCapabilityProjectionDigest) &&
    fnvDigest(projection.truthProjectionDigest) &&
    projection.sourceRouteCount === 28 && projection.eligibleRouteCount === 24 &&
    projection.authorityReviewRouteExcludedCount === 4;
  return sourceExact && projectionExact && receipt.status ===
      'BINDING_DECISION_INTEGRITY_PROJECTION_ONLY' &&
    receipt.emission.mode === NATIVE_EMISSION_MODE;
}

export function
createLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceipt(
  sourceContract, sourceR116Contract, sourceR115Contract,
  sourceR114Contract, sourceR113Contract) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestContractReceiptValid(
      sourceContract, sourceR116Contract, sourceR115Contract,
      sourceR114Contract, sourceR113Contract)) {
    throw new Error(
      'Binding-decision integrity contract needs the exact attached R117 response-signer-key-binding request contract');
  }
  const projection = expectedRouteProjection(sourceContract);
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
    status: 'BINDING_DECISION_INTEGRITY_PROJECTION_ONLY',
    source: sourceRef(sourceContract),
    bindingDecisionIntegrityRouteProjection: projection,
    emission: {
      mode: NATIVE_EMISSION_MODE
    }
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      receipt, sourceContract, sourceR116Contract, sourceR115Contract,
      sourceR114Contract, sourceR113Contract)) {
    throw new Error('Binding-decision integrity contract failed validation');
  }
  return receipt;
}

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingCallerSuppliedPolicyDescriptorValid(
  policy, contract = null, packet = null) {
  if (!digestValid(policy,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA) ||
      !exactKeys(policy, ['schema', 'status', 'sourceContract',
        'sourceRequestPacket', 'policyId', 'policyRevision',
        'claimedReviewSeatId', 'decisionKey', 'revocationKey', 'validity',
        'truth', 'digest']) ||
      !exactKeys(policy.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(policy.sourceRequestPacket, ['schema', 'receiptDigest']) ||
      !exactKeys(policy.decisionKey, ['keyId', 'publicKeySha256']) ||
      !exactKeys(policy.revocationKey, ['keyId', 'publicKeySha256']) ||
      !exactKeys(policy.validity, ['validFrom', 'expiresAt',
        'maximumDecisionAgeSeconds', 'maximumRevocationSnapshotAgeSeconds']) ||
      !exactKeys(policy.truth, ['callerSuppliedPolicyTrusted',
        'policyKeyDelegationVerified', 'hostAuthorityEvidenceAuthenticated',
        'responseSignerKeyBound', 'rawAuthorityPublicKeysPersisted',
        'worldMutationPerformed'])) return false;
  const structural = policy.status ===
      'CALLER_SUPPLIED_UNTRUSTED_RESPONSE_SIGNER_KEY_BINDING_DECISION_POLICY_FOR_SIGNATURE_INTEGRITY_ONLY' &&
    policy.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(policy.sourceContract.receiptDigest) &&
    policy.sourceRequestPacket.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA &&
    fnvDigest(policy.sourceRequestPacket.receiptDigest) &&
    nonEmptyText(policy.policyId, 256) &&
    Number.isInteger(policy.policyRevision) && policy.policyRevision > 0 &&
    nonEmptyText(policy.claimedReviewSeatId, 256) &&
    nonEmptyText(policy.decisionKey.keyId, 256) &&
    sha256Digest(policy.decisionKey.publicKeySha256) &&
    nonEmptyText(policy.revocationKey.keyId, 256) &&
    sha256Digest(policy.revocationKey.publicKeySha256) &&
    policy.decisionKey.publicKeySha256 !== policy.revocationKey.publicKeySha256 &&
    isoTimestamp(policy.validity.validFrom) &&
    isoTimestamp(policy.validity.expiresAt) &&
    Date.parse(policy.validity.expiresAt) > Date.parse(policy.validity.validFrom) &&
    Date.parse(policy.validity.expiresAt) - Date.parse(policy.validity.validFrom) <=
      7 * 24 * 60 * 60 * 1000 &&
    Number.isInteger(policy.validity.maximumDecisionAgeSeconds) &&
    policy.validity.maximumDecisionAgeSeconds > 0 &&
    policy.validity.maximumDecisionAgeSeconds <= 24 * 60 * 60 &&
    Number.isInteger(policy.validity.maximumRevocationSnapshotAgeSeconds) &&
    policy.validity.maximumRevocationSnapshotAgeSeconds > 0 &&
    policy.validity.maximumRevocationSnapshotAgeSeconds <= 24 * 60 * 60 &&
    exact(policy.truth, {
      callerSuppliedPolicyTrusted: false,
      policyKeyDelegationVerified: false,
      hostAuthorityEvidenceAuthenticated: false,
      responseSignerKeyBound: false,
      rawAuthorityPublicKeysPersisted: false,
      worldMutationPerformed: false
    });
  if (!structural || contract === null) return structural;
  return packet &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      contract) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestPacketValid(
      packet) &&
    exact(policy.sourceContract, sourceRef(contract)) &&
    exact(policy.sourceRequestPacket, sourceRef(packet)) &&
    policy.decisionKey.publicKeySha256 !==
      packet.requestedSignerKeyBinding.publicKeySha256 &&
    policy.revocationKey.publicKeySha256 !==
      packet.requestedSignerKeyBinding.publicKeySha256;
}

export function
createLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingCallerSuppliedPolicyDescriptor(
  contract, packet, input) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      contract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestPacketValid(
        packet) ||
      !exactKeys(input, ['policyId', 'policyRevision', 'claimedReviewSeatId',
        'decisionKeyId', 'decisionPublicKeySha256', 'revocationKeyId',
        'revocationPublicKeySha256', 'validFrom', 'expiresAt',
        'maximumDecisionAgeSeconds', 'maximumRevocationSnapshotAgeSeconds'])) {
    throw new Error(
      'Caller-supplied binding-decision policy needs exact R118/R117 sources and bounded policy input');
  }
  const policy = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA,
    status:
      'CALLER_SUPPLIED_UNTRUSTED_RESPONSE_SIGNER_KEY_BINDING_DECISION_POLICY_FOR_SIGNATURE_INTEGRITY_ONLY',
    sourceContract: sourceRef(contract),
    sourceRequestPacket: sourceRef(packet),
    policyId: input.policyId,
    policyRevision: input.policyRevision,
    claimedReviewSeatId: input.claimedReviewSeatId,
    decisionKey: {
      keyId: input.decisionKeyId,
      publicKeySha256: input.decisionPublicKeySha256
    },
    revocationKey: {
      keyId: input.revocationKeyId,
      publicKeySha256: input.revocationPublicKeySha256
    },
    validity: {
      validFrom: input.validFrom,
      expiresAt: input.expiresAt,
      maximumDecisionAgeSeconds: input.maximumDecisionAgeSeconds,
      maximumRevocationSnapshotAgeSeconds:
        input.maximumRevocationSnapshotAgeSeconds
    },
    truth: {
      callerSuppliedPolicyTrusted: false,
      policyKeyDelegationVerified: false,
      hostAuthorityEvidenceAuthenticated: false,
      responseSignerKeyBound: false,
      rawAuthorityPublicKeysPersisted: false,
      worldMutationPerformed: false
    }
  };
  policy.digest = stableDigest(policy);
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingCallerSuppliedPolicyDescriptorValid(
      policy, contract, packet)) {
    throw new Error('Caller-supplied binding-decision policy failed validation');
  }
  return policy;
}

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionEnvelopeValid(
  envelope, contract = null, packet = null, policy = null) {
  if (!digestValid(envelope,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_ENVELOPE_SCHEMA) ||
      !exactKeys(envelope, ['schema', 'status', 'sourceContract',
        'sourceRequestPacket', 'sourcePolicyDescriptor', 'decisionId',
        'issuedAt', 'expiresAt', 'nonce', 'claimedAuthority',
        'requestBindingDigest', 'requestedSignerKeyBinding', 'action',
        'reasonCode', 'actualEffects', 'truth', 'digest']) ||
      !exactKeys(envelope.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(envelope.sourceRequestPacket, ['schema', 'receiptDigest']) ||
      !exactKeys(envelope.sourcePolicyDescriptor, ['schema', 'receiptDigest']) ||
      !exactKeys(envelope.claimedAuthority,
        ['claimedReviewSeatId', 'decisionKeyId']) ||
      !exactKeys(envelope.actualEffects,
        ['applyBinding', 'configureRegistry', 'persist',
          'worldMutationPerformed'])) return false;
  const structural = envelope.status ===
      'UNTRUSTED_RESPONSE_SIGNER_KEY_BINDING_ACTION_RECORDED_FOR_SIGNATURE_INTEGRITY_ONLY' &&
    envelope.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(envelope.sourceContract.receiptDigest) &&
    envelope.sourceRequestPacket.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA &&
    fnvDigest(envelope.sourceRequestPacket.receiptDigest) &&
    envelope.sourcePolicyDescriptor.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA &&
    fnvDigest(envelope.sourcePolicyDescriptor.receiptDigest) &&
    nonEmptyText(envelope.decisionId, 256) && isoTimestamp(envelope.issuedAt) &&
    isoTimestamp(envelope.expiresAt) &&
    Date.parse(envelope.expiresAt) > Date.parse(envelope.issuedAt) &&
    nonEmptyText(envelope.nonce, 256) &&
    nonEmptyText(envelope.claimedAuthority.claimedReviewSeatId, 256) &&
    nonEmptyText(envelope.claimedAuthority.decisionKeyId, 256) &&
    fnvDigest(envelope.requestBindingDigest) &&
    envelope.requestedSignerKeyBinding &&
      typeof envelope.requestedSignerKeyBinding === 'object' &&
    ALLOWED_ACTIONS.includes(envelope.action) &&
    nonEmptyText(envelope.reasonCode, 256) &&
    exact(envelope.actualEffects, {
      applyBinding: false,
      configureRegistry: false,
      persist: false,
      worldMutationPerformed: false
    }) && exact(envelope.truth, {
      decisionActionIsUntrustedClaim: true,
      callerSuppliedPolicyTrusted: false,
      policyKeyDelegationVerified: false,
      hostAuthorityEvidenceAuthenticated: false,
      requestedBindActionAppliesBinding: false,
      responseSignerKeyBound: false,
      hostRegistryConfigured: false,
      worldMutationPerformed: false
    });
  if (!structural || contract === null) return structural;
  return packet && policy &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      contract) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestPacketValid(
      packet) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingCallerSuppliedPolicyDescriptorValid(
      policy, contract, packet) &&
    exact(envelope.sourceContract, sourceRef(contract)) &&
    exact(envelope.sourceRequestPacket, sourceRef(packet)) &&
    exact(envelope.sourcePolicyDescriptor, sourceRef(policy)) &&
    envelope.claimedAuthority.claimedReviewSeatId ===
      policy.claimedReviewSeatId &&
    envelope.claimedAuthority.decisionKeyId === policy.decisionKey.keyId &&
    Date.parse(envelope.issuedAt) >= Date.parse(policy.validity.validFrom) &&
    Date.parse(envelope.expiresAt) <= Date.parse(policy.validity.expiresAt) &&
    Date.parse(envelope.expiresAt) - Date.parse(envelope.issuedAt) <=
      policy.validity.maximumDecisionAgeSeconds * 1000 &&
    Date.parse(envelope.issuedAt) >= Date.parse(packet.requestedAt) &&
    Date.parse(envelope.expiresAt) <= Date.parse(packet.expiresAt) &&
    envelope.requestBindingDigest ===
      stableDigest(packet.requestedSignerKeyBinding) &&
    exact(envelope.requestedSignerKeyBinding,
      packet.requestedSignerKeyBinding);
}

export function
createLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionEnvelope(
  contract, packet, policy, input) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      contract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestPacketValid(
        packet) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingCallerSuppliedPolicyDescriptorValid(
        policy, contract, packet) ||
      !exactKeys(input, ['decisionId', 'issuedAt', 'expiresAt', 'nonce',
        'claimedReviewSeatId', 'action', 'reasonCode']) ||
      !ALLOWED_ACTIONS.includes(input.action) ||
      !nonEmptyText(input.reasonCode, 256)) {
    throw new Error(
      'Binding-decision envelope needs exact R118/R117/policy sources and one bounded non-applying action');
  }
  const envelope = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_ENVELOPE_SCHEMA,
    status:
      'UNTRUSTED_RESPONSE_SIGNER_KEY_BINDING_ACTION_RECORDED_FOR_SIGNATURE_INTEGRITY_ONLY',
    sourceContract: sourceRef(contract),
    sourceRequestPacket: sourceRef(packet),
    sourcePolicyDescriptor: sourceRef(policy),
    decisionId: input.decisionId,
    issuedAt: input.issuedAt,
    expiresAt: input.expiresAt,
    nonce: input.nonce,
    claimedAuthority: {
      claimedReviewSeatId: input.claimedReviewSeatId,
      decisionKeyId: policy.decisionKey.keyId
    },
    requestBindingDigest: stableDigest(packet.requestedSignerKeyBinding),
    requestedSignerKeyBinding: clone(packet.requestedSignerKeyBinding),
    action: input.action,
    reasonCode: input.reasonCode,
    actualEffects: {
      applyBinding: false,
      configureRegistry: false,
      persist: false,
      worldMutationPerformed: false
    },
    truth: {
      decisionActionIsUntrustedClaim: true,
      callerSuppliedPolicyTrusted: false,
      policyKeyDelegationVerified: false,
      hostAuthorityEvidenceAuthenticated: false,
      requestedBindActionAppliesBinding: false,
      responseSignerKeyBound: false,
      hostRegistryConfigured: false,
      worldMutationPerformed: false
    }
  };
  envelope.digest = stableDigest(envelope);
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionEnvelopeValid(
      envelope, contract, packet, policy)) {
    throw new Error('Binding-decision envelope failed validation');
  }
  return envelope;
}

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRevocationSnapshotValid(
  snapshot, contract = null, policy = null) {
  if (!digestValid(snapshot,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REVOCATION_SNAPSHOT_SCHEMA) ||
      !exactKeys(snapshot, ['schema', 'status', 'sourceContract',
        'sourcePolicyDescriptor', 'snapshotId', 'observedAt', 'expiresAt',
        'nonce', 'claimedAuthority', 'revokedDecisionDigests',
        'revokedDecisionNonces', 'revokedResponseSignerPublicKeySha256',
        'summary', 'truth', 'digest']) ||
      !exactKeys(snapshot.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(snapshot.sourcePolicyDescriptor, ['schema', 'receiptDigest']) ||
      !exactKeys(snapshot.claimedAuthority,
        ['claimedReviewSeatId', 'revocationKeyId'])) return false;
  const arrays = [snapshot.revokedDecisionDigests,
    snapshot.revokedDecisionNonces,
    snapshot.revokedResponseSignerPublicKeySha256];
  const structural = snapshot.status ===
      'UNTRUSTED_POLICY_REVOCATION_CLAIMS_RECORDED_FOR_SIGNATURE_INTEGRITY_ONLY' &&
    snapshot.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(snapshot.sourceContract.receiptDigest) &&
    snapshot.sourcePolicyDescriptor.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA &&
    fnvDigest(snapshot.sourcePolicyDescriptor.receiptDigest) &&
    nonEmptyText(snapshot.snapshotId, 256) &&
    isoTimestamp(snapshot.observedAt) && isoTimestamp(snapshot.expiresAt) &&
    Date.parse(snapshot.expiresAt) > Date.parse(snapshot.observedAt) &&
    nonEmptyText(snapshot.nonce, 256) &&
    nonEmptyText(snapshot.claimedAuthority.claimedReviewSeatId, 256) &&
    nonEmptyText(snapshot.claimedAuthority.revocationKeyId, 256) &&
    arrays.every(values => Array.isArray(values) && values.length <= 256 &&
      unique(values) && sorted(values)) &&
    snapshot.revokedDecisionDigests.every(fnvDigest) &&
    snapshot.revokedDecisionNonces.every(value => nonEmptyText(value, 256)) &&
    snapshot.revokedResponseSignerPublicKeySha256.every(sha256Digest) &&
    exact(snapshot.summary, {
      revokedDecisionDigestCount: snapshot.revokedDecisionDigests.length,
      revokedDecisionNonceCount: snapshot.revokedDecisionNonces.length,
      revokedResponseSignerPublicKeyCount:
        snapshot.revokedResponseSignerPublicKeySha256.length,
      persistedRevocationSnapshotCount: 0
    }) && exact(snapshot.truth, {
      revocationClaimsAreUntrusted: true,
      callerSuppliedPolicyTrusted: false,
      policyKeyDelegationVerified: false,
      responseSignerKeyBindingRevokedOrApplied: false,
      worldMutationPerformed: false
    });
  if (!structural || contract === null) return structural;
  return policy &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      contract) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingCallerSuppliedPolicyDescriptorValid(
      policy) && exact(snapshot.sourceContract, sourceRef(contract)) &&
    exact(snapshot.sourcePolicyDescriptor, sourceRef(policy)) &&
    snapshot.claimedAuthority.claimedReviewSeatId ===
      policy.claimedReviewSeatId &&
    snapshot.claimedAuthority.revocationKeyId === policy.revocationKey.keyId &&
    Date.parse(snapshot.observedAt) >= Date.parse(policy.validity.validFrom) &&
    Date.parse(snapshot.expiresAt) <= Date.parse(policy.validity.expiresAt) &&
    Date.parse(snapshot.expiresAt) - Date.parse(snapshot.observedAt) <=
      policy.validity.maximumRevocationSnapshotAgeSeconds * 1000;
}

export function
createLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRevocationSnapshot(
  contract, policy, input) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      contract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingCallerSuppliedPolicyDescriptorValid(
        policy) ||
      !exactKeys(input, ['snapshotId', 'observedAt', 'expiresAt', 'nonce',
        'claimedReviewSeatId', 'revokedDecisionDigests',
        'revokedDecisionNonces', 'revokedResponseSignerPublicKeySha256'])) {
    throw new Error(
      'Binding revocation snapshot needs exact R118/policy sources and bounded revocation claims');
  }
  const snapshot = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REVOCATION_SNAPSHOT_SCHEMA,
    status:
      'UNTRUSTED_POLICY_REVOCATION_CLAIMS_RECORDED_FOR_SIGNATURE_INTEGRITY_ONLY',
    sourceContract: sourceRef(contract),
    sourcePolicyDescriptor: sourceRef(policy),
    snapshotId: input.snapshotId,
    observedAt: input.observedAt,
    expiresAt: input.expiresAt,
    nonce: input.nonce,
    claimedAuthority: {
      claimedReviewSeatId: input.claimedReviewSeatId,
      revocationKeyId: policy.revocationKey.keyId
    },
    revokedDecisionDigests: [...input.revokedDecisionDigests].sort(),
    revokedDecisionNonces: [...input.revokedDecisionNonces].sort(),
    revokedResponseSignerPublicKeySha256:
      [...input.revokedResponseSignerPublicKeySha256].sort(),
    summary: {
      revokedDecisionDigestCount: input.revokedDecisionDigests.length,
      revokedDecisionNonceCount: input.revokedDecisionNonces.length,
      revokedResponseSignerPublicKeyCount:
        input.revokedResponseSignerPublicKeySha256.length,
      persistedRevocationSnapshotCount: 0
    },
    truth: {
      revocationClaimsAreUntrusted: true,
      callerSuppliedPolicyTrusted: false,
      policyKeyDelegationVerified: false,
      responseSignerKeyBindingRevokedOrApplied: false,
      worldMutationPerformed: false
    }
  };
  snapshot.digest = stableDigest(snapshot);
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRevocationSnapshotValid(
      snapshot, contract, policy)) {
    throw new Error('Binding revocation snapshot failed validation');
  }
  return snapshot;
}

export function
canonicalLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionText(
  envelope) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionEnvelopeValid(
      envelope)) throw new Error('Canonical binding-decision text needs a valid envelope');
  return JSON.stringify(envelope);
}

export function
canonicalLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRevocationSnapshotText(
  snapshot) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRevocationSnapshotValid(
      snapshot)) throw new Error('Canonical binding-revocation text needs a valid snapshot');
  return JSON.stringify(snapshot);
}

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthoritySignatureInputValid(
  input) {
  return exactKeys(input, ['schema', 'policyDescriptorDigest',
      'decisionEnvelopeDigest', 'revocationSnapshotDigest',
      'decisionPublicKeyRaw', 'decisionSignature', 'revocationPublicKeyRaw',
      'revocationSignature']) && input.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_SIGNATURE_INPUT_SCHEMA &&
    fnvDigest(input.policyDescriptorDigest) &&
    fnvDigest(input.decisionEnvelopeDigest) &&
    fnvDigest(input.revocationSnapshotDigest) &&
    input.decisionPublicKeyRaw instanceof Uint8Array &&
    input.decisionPublicKeyRaw.byteLength === ED25519_RAW_PUBLIC_KEY_BYTES &&
    input.decisionSignature instanceof Uint8Array &&
    input.decisionSignature.byteLength === ED25519_SIGNATURE_BYTES &&
    input.revocationPublicKeyRaw instanceof Uint8Array &&
    input.revocationPublicKeyRaw.byteLength === ED25519_RAW_PUBLIC_KEY_BYTES &&
    input.revocationSignature instanceof Uint8Array &&
    input.revocationSignature.byteLength === ED25519_SIGNATURE_BYTES;
}

function expectedAssessmentIssues(checks) {
  const issues = [];
  if (!checks.policyDescriptorDigestMatchesInput) {
    issues.push('policy-descriptor-digest-input-mismatch');
  }
  if (!checks.decisionPublicKeyMatchesPolicyDescriptor) {
    issues.push('decision-public-key-policy-mismatch');
  }
  if (!checks.revocationPublicKeyMatchesPolicyDescriptor) {
    issues.push('revocation-public-key-policy-mismatch');
  }
  if (!checks.decisionSignatureValid) {
    issues.push('binding-decision-detached-signature-invalid');
  }
  if (!checks.revocationSignatureValid) {
    issues.push('binding-revocation-detached-signature-invalid');
  }
  if (!checks.policyWindowCurrent) issues.push('policy-window-not-current');
  if (!checks.decisionWindowCurrent) issues.push('decision-window-not-current');
  if (!checks.revocationSnapshotWindowCurrent) {
    issues.push('revocation-snapshot-window-not-current');
  }
  if (!checks.authorityKeysSeparateFromClaimedResponseSignerKey) {
    issues.push('authority-key-collides-with-claimed-response-signer-key');
  }
  if (checks.decisionRevoked) issues.push('binding-decision-revoked');
  return issues;
}

const expectedAssessmentTruth = integrityPass => ({
  exactR118ContractBound: true,
  exactR117RequestPacketBound: true,
  exactCallerSuppliedPolicyDescriptorBound: true,
  exactBindingDecisionEnvelopeBound: true,
  exactRevocationSnapshotBound: true,
  detachedEd25519BindingDecisionVerificationPerformed: true,
  detachedEd25519RevocationSnapshotVerificationPerformed: true,
  decisionAndRevocationIntegrityPassed: integrityPass,
  validSignaturesMeanSuppliedPolicyKeyMatchOnly: true,
  callerSuppliedPolicyTrusted: false,
  policyKeyDelegationVerified: false,
  hostAuthorityEvidenceAuthenticated: false,
  requestedBindActionAppliesBinding: false,
  responseSignerKeyBound: false,
  hostRegistryConfigured: false,
  hostRegistryOriginAuthenticated: false,
  hostGovernanceTrustRootResolved: false,
  hostGovernanceAdmissionAuthorized: false,
  rawAuthorityPublicKeysPersisted: false,
  signatureBytesPersisted: false,
  policyDescriptorPersisted: false,
  bindingDecisionEnvelopePersisted: false,
  revocationSnapshotPersisted: false,
  integrityAssessmentPersisted: false,
  replayLedgerImplemented: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  worldMutationPerformed: false
});

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionIntegrityAssessmentValid(
  assessment) {
  if (!digestValid(assessment,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ASSESSMENT_SCHEMA) ||
      !exactKeys(assessment, ['schema', 'status', 'evaluatedAt',
        'sourceContract', 'sourceRequestPacket', 'sourcePolicyDescriptor',
        'sourceDecisionEnvelope', 'sourceRevocationSnapshot',
        'claimedAuthority', 'cryptographic', 'checks', 'requestedAction',
        'verdicts', 'issues', 'truth', 'digest']) ||
      !exactKeys(assessment.claimedAuthority,
        ['claimedReviewSeatId', 'decisionKeyId', 'revocationKeyId']) ||
      !exactKeys(assessment.cryptographic, ['signatureAlgorithm',
        'publicKeyFormat', 'decisionPublicKeySha256',
        'decisionSignatureSha256', 'revocationPublicKeySha256',
        'revocationSignatureSha256', 'canonicalDecisionCharacterCount',
        'canonicalRevocationSnapshotCharacterCount']) ||
      !exactKeys(assessment.checks,
        ['policyDescriptorDigestMatchesInput',
          'decisionPublicKeyMatchesPolicyDescriptor',
          'revocationPublicKeyMatchesPolicyDescriptor',
          'decisionSignatureValid', 'revocationSignatureValid',
          'policyWindowCurrent', 'decisionWindowCurrent',
          'revocationSnapshotWindowCurrent',
          'authorityKeysSeparateFromClaimedResponseSignerKey',
          'decisionRevoked']) ||
      !exactKeys(assessment.requestedAction,
        ['action', 'bindingApplied', 'registryConfigured']) ||
      !exactKeys(assessment.verdicts,
        ['bindingDecisionSignatureIntegrityVerdict',
          'bindingDecisionRevocationIntegrityVerdict',
          'decisionAndRevocationIntegrityVerdict',
          'callerSuppliedPolicyTrustVerdict',
          'policyKeyDelegationVerificationVerdict',
          'hostAuthorityEvidenceAuthenticationVerdict',
          'responseSignerKeyBindingVerdict',
          'hostResponderIdentityTrustVerdict',
          'hostRegistryConfigurationVerdict',
          'hostRegistryOriginAuthenticationVerdict',
          'hostGovernanceTrustRootResolutionVerdict',
          'hostGovernanceAdmissionVerdict']) ||
      !Array.isArray(assessment.issues)) return false;
  const sourceShape = value => exactKeys(value, ['schema', 'receiptDigest']) &&
    nonEmptyText(value.schema, 512) && fnvDigest(value.receiptDigest);
  if (![assessment.sourceContract, assessment.sourceRequestPacket,
    assessment.sourcePolicyDescriptor, assessment.sourceDecisionEnvelope,
    assessment.sourceRevocationSnapshot].every(sourceShape)) return false;
  const checks = assessment.checks;
  const integrityPass = checks.policyDescriptorDigestMatchesInput &&
    checks.decisionPublicKeyMatchesPolicyDescriptor &&
    checks.revocationPublicKeyMatchesPolicyDescriptor &&
    checks.decisionSignatureValid && checks.revocationSignatureValid &&
    checks.policyWindowCurrent && checks.decisionWindowCurrent &&
    checks.revocationSnapshotWindowCurrent &&
    checks.authorityKeysSeparateFromClaimedResponseSignerKey &&
    !checks.decisionRevoked;
  return assessment.status === (integrityPass
      ? 'BINDING_DECISION_AND_REVOCATION_INTEGRITY_PASS_UNDER_CALLER_SUPPLIED_UNTRUSTED_POLICY'
      : 'BINDING_DECISION_OR_REVOCATION_INTEGRITY_FAIL_UNDER_CALLER_SUPPLIED_UNTRUSTED_POLICY') &&
    isoTimestamp(assessment.evaluatedAt) &&
    Object.values(checks).every(value => typeof value === 'boolean') &&
    nonEmptyText(assessment.claimedAuthority.claimedReviewSeatId, 256) &&
    nonEmptyText(assessment.claimedAuthority.decisionKeyId, 256) &&
    nonEmptyText(assessment.claimedAuthority.revocationKeyId, 256) &&
    assessment.cryptographic.signatureAlgorithm === SIGNATURE_ALGORITHM &&
    assessment.cryptographic.publicKeyFormat === PUBLIC_KEY_FORMAT &&
    sha256Digest(assessment.cryptographic.decisionPublicKeySha256) &&
    sha256Digest(assessment.cryptographic.decisionSignatureSha256) &&
    sha256Digest(assessment.cryptographic.revocationPublicKeySha256) &&
    sha256Digest(assessment.cryptographic.revocationSignatureSha256) &&
    Number.isInteger(assessment.cryptographic.canonicalDecisionCharacterCount) &&
    assessment.cryptographic.canonicalDecisionCharacterCount > 0 &&
    Number.isInteger(
      assessment.cryptographic.canonicalRevocationSnapshotCharacterCount) &&
    assessment.cryptographic.canonicalRevocationSnapshotCharacterCount > 0 &&
    ALLOWED_ACTIONS.includes(assessment.requestedAction.action) &&
    assessment.requestedAction.bindingApplied === false &&
    assessment.requestedAction.registryConfigured === false &&
    assessment.verdicts.bindingDecisionSignatureIntegrityVerdict ===
      (checks.decisionSignatureValid ? 'PASS' : 'FAIL') &&
    assessment.verdicts.bindingDecisionRevocationIntegrityVerdict ===
      (checks.revocationSignatureValid ? 'PASS' : 'FAIL') &&
    assessment.verdicts.decisionAndRevocationIntegrityVerdict ===
      (integrityPass ? 'PASS' : 'FAIL') &&
    assessment.verdicts.callerSuppliedPolicyTrustVerdict ===
      'UNTRUSTED_CALLER_SUPPLIED' &&
    assessment.verdicts.policyKeyDelegationVerificationVerdict === UNKNOWN &&
    assessment.verdicts.hostAuthorityEvidenceAuthenticationVerdict === UNKNOWN &&
    assessment.verdicts.responseSignerKeyBindingVerdict === UNKNOWN &&
    assessment.verdicts.hostResponderIdentityTrustVerdict === UNKNOWN &&
    assessment.verdicts.hostRegistryConfigurationVerdict === UNKNOWN &&
    assessment.verdicts.hostRegistryOriginAuthenticationVerdict === UNKNOWN &&
    assessment.verdicts.hostGovernanceTrustRootResolutionVerdict === UNKNOWN &&
    assessment.verdicts.hostGovernanceAdmissionVerdict === NOT_AUTHORIZED &&
    exact(assessment.issues, expectedAssessmentIssues(checks)) &&
    exact(assessment.truth, expectedAssessmentTruth(integrityPass));
}

export async function
verifyLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionIntegrity(
  contract, packet, policy, decisionEnvelope, revocationSnapshot,
  signatureInput, evaluatedAt) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      contract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestPacketValid(
        packet) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingCallerSuppliedPolicyDescriptorValid(
        policy, contract, packet) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionEnvelopeValid(
        decisionEnvelope, contract, packet, policy) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRevocationSnapshotValid(
        revocationSnapshot, contract, policy) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthoritySignatureInputValid(
        signatureInput) || !isoTimestamp(evaluatedAt) ||
      signatureInput.policyDescriptorDigest !== policy.digest ||
      signatureInput.decisionEnvelopeDigest !== decisionEnvelope.digest ||
      signatureInput.revocationSnapshotDigest !== revocationSnapshot.digest) {
    throw new Error(
      'Binding-decision integrity verification needs exact R118/R117/policy/decision/revocation/signature sources');
  }
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error('Web Crypto SubtleCrypto is unavailable');
  const decisionPublicKeyRaw = new Uint8Array(
    signatureInput.decisionPublicKeyRaw);
  const decisionSignature = new Uint8Array(signatureInput.decisionSignature);
  const revocationPublicKeyRaw = new Uint8Array(
    signatureInput.revocationPublicKeyRaw);
  const revocationSignature = new Uint8Array(
    signatureInput.revocationSignature);
  const canonicalDecision =
    canonicalLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionText(
      decisionEnvelope);
  const canonicalRevocation =
    canonicalLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRevocationSnapshotText(
      revocationSnapshot);
  const decisionKey = await subtle.importKey('raw', decisionPublicKeyRaw,
    { name: SIGNATURE_ALGORITHM }, false, ['verify']);
  const revocationKey = await subtle.importKey('raw', revocationPublicKeyRaw,
    { name: SIGNATURE_ALGORITHM }, false, ['verify']);
  const decisionSignatureValid = await subtle.verify(
    { name: SIGNATURE_ALGORITHM }, decisionKey, decisionSignature,
    new TextEncoder().encode(canonicalDecision));
  const revocationSignatureValid = await subtle.verify(
    { name: SIGNATURE_ALGORITHM }, revocationKey, revocationSignature,
    new TextEncoder().encode(canonicalRevocation));
  const decisionPublicKeySha256 = await sha256ForBytes(decisionPublicKeyRaw);
  const decisionSignatureSha256 = await sha256ForBytes(decisionSignature);
  const revocationPublicKeySha256 = await sha256ForBytes(
    revocationPublicKeyRaw);
  const revocationSignatureSha256 = await sha256ForBytes(revocationSignature);
  const evaluationTime = Date.parse(evaluatedAt);
  const claimedResponseSignerKeySha256 =
    packet.requestedSignerKeyBinding.publicKeySha256;
  const decisionRevoked =
    revocationSnapshot.revokedDecisionDigests.includes(
      decisionEnvelope.digest) ||
    revocationSnapshot.revokedDecisionNonces.includes(decisionEnvelope.nonce) ||
    revocationSnapshot.revokedResponseSignerPublicKeySha256.includes(
      claimedResponseSignerKeySha256);
  const checks = {
    policyDescriptorDigestMatchesInput:
      signatureInput.policyDescriptorDigest === policy.digest,
    decisionPublicKeyMatchesPolicyDescriptor:
      decisionPublicKeySha256 === policy.decisionKey.publicKeySha256,
    revocationPublicKeyMatchesPolicyDescriptor:
      revocationPublicKeySha256 === policy.revocationKey.publicKeySha256,
    decisionSignatureValid,
    revocationSignatureValid,
    policyWindowCurrent:
      evaluationTime >= Date.parse(policy.validity.validFrom) &&
      evaluationTime <= Date.parse(policy.validity.expiresAt),
    decisionWindowCurrent:
      evaluationTime >= Date.parse(decisionEnvelope.issuedAt) &&
      evaluationTime <= Date.parse(decisionEnvelope.expiresAt),
    revocationSnapshotWindowCurrent:
      evaluationTime >= Date.parse(revocationSnapshot.observedAt) &&
      evaluationTime <= Date.parse(revocationSnapshot.expiresAt),
    authorityKeysSeparateFromClaimedResponseSignerKey:
      decisionPublicKeySha256 !== claimedResponseSignerKeySha256 &&
      revocationPublicKeySha256 !== claimedResponseSignerKeySha256,
    decisionRevoked
  };
  const integrityPass = checks.policyDescriptorDigestMatchesInput &&
    checks.decisionPublicKeyMatchesPolicyDescriptor &&
    checks.revocationPublicKeyMatchesPolicyDescriptor &&
    checks.decisionSignatureValid && checks.revocationSignatureValid &&
    checks.policyWindowCurrent && checks.decisionWindowCurrent &&
    checks.revocationSnapshotWindowCurrent &&
    checks.authorityKeysSeparateFromClaimedResponseSignerKey &&
    !checks.decisionRevoked;
  const assessment = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ASSESSMENT_SCHEMA,
    status: integrityPass
      ? 'BINDING_DECISION_AND_REVOCATION_INTEGRITY_PASS_UNDER_CALLER_SUPPLIED_UNTRUSTED_POLICY'
      : 'BINDING_DECISION_OR_REVOCATION_INTEGRITY_FAIL_UNDER_CALLER_SUPPLIED_UNTRUSTED_POLICY',
    evaluatedAt,
    sourceContract: sourceRef(contract),
    sourceRequestPacket: sourceRef(packet),
    sourcePolicyDescriptor: sourceRef(policy),
    sourceDecisionEnvelope: sourceRef(decisionEnvelope),
    sourceRevocationSnapshot: sourceRef(revocationSnapshot),
    claimedAuthority: {
      claimedReviewSeatId: policy.claimedReviewSeatId,
      decisionKeyId: policy.decisionKey.keyId,
      revocationKeyId: policy.revocationKey.keyId
    },
    cryptographic: {
      signatureAlgorithm: SIGNATURE_ALGORITHM,
      publicKeyFormat: PUBLIC_KEY_FORMAT,
      decisionPublicKeySha256,
      decisionSignatureSha256,
      revocationPublicKeySha256,
      revocationSignatureSha256,
      canonicalDecisionCharacterCount: canonicalDecision.length,
      canonicalRevocationSnapshotCharacterCount: canonicalRevocation.length
    },
    checks,
    requestedAction: {
      action: decisionEnvelope.action,
      bindingApplied: false,
      registryConfigured: false
    },
    verdicts: {
      bindingDecisionSignatureIntegrityVerdict:
        decisionSignatureValid ? 'PASS' : 'FAIL',
      bindingDecisionRevocationIntegrityVerdict:
        revocationSignatureValid ? 'PASS' : 'FAIL',
      decisionAndRevocationIntegrityVerdict: integrityPass ? 'PASS' : 'FAIL',
      callerSuppliedPolicyTrustVerdict: 'UNTRUSTED_CALLER_SUPPLIED',
      policyKeyDelegationVerificationVerdict: UNKNOWN,
      hostAuthorityEvidenceAuthenticationVerdict: UNKNOWN,
      responseSignerKeyBindingVerdict: UNKNOWN,
      hostResponderIdentityTrustVerdict: UNKNOWN,
      hostRegistryConfigurationVerdict: UNKNOWN,
      hostRegistryOriginAuthenticationVerdict: UNKNOWN,
      hostGovernanceTrustRootResolutionVerdict: UNKNOWN,
      hostGovernanceAdmissionVerdict: NOT_AUTHORIZED
    },
    issues: expectedAssessmentIssues(checks),
    truth: expectedAssessmentTruth(integrityPass)
  };
  assessment.digest = stableDigest(assessment);
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionIntegrityAssessmentValid(
      assessment)) {
    throw new Error('Binding-decision integrity assessment failed validation');
  }
  return assessment;
}

export function
matrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionIntegrityDescription() {
  return {
    contractReceiptSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
    routeProjectionSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ROUTE_PROJECTION_SCHEMA,
    callerSuppliedPolicyDescriptorSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA,
    authorityDecisionEnvelopeSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_ENVELOPE_SCHEMA,
    revocationSnapshotSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REVOCATION_SNAPSHOT_SCHEMA,
    authoritySignatureInputSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_SIGNATURE_INPUT_SCHEMA,
    integrityAssessmentSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ASSESSMENT_SCHEMA,
    bindingDecisionSignatureVerifyCapabilityId:
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_DECISION_SIGNATURE_VERIFY_CAPABILITY_ID,
    bindingDecisionRevocationVerifyCapabilityId:
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_DECISION_REVOCATION_VERIFY_CAPABILITY_ID,
    requiredPolicyKeyDelegationVerifyCapabilityId:
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
    requiredResponseSignerKeyBindCapabilityId:
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
    requiredHostRegistryConfigureCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
    requiredHostGovernanceTrustRootResolveCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
    requiredHostGovernanceAdmissionDecideCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID,
    callerSuppliedPolicyTrusted: false,
    policyKeyDelegationVerified: false,
    responseSignerKeyBindingImplemented: false,
    hostRegistryConfigurationImplemented: false,
    transientArtifactsPersisted: false,
    status:
      'TRANSIENT_DETACHED_BINDING_DECISION_AND_REVOCATION_SIGNATURE_INTEGRITY_AVAILABLE_UNDER_UNTRUSTED_POLICY_BINDING_REGISTRY_AND_AUTHORITY_STILL_MISSING'
  };
}
