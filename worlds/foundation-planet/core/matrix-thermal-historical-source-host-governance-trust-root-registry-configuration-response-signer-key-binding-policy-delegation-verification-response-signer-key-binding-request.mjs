import {
  HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
  HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-root-admission-request.mjs?v=0.117.0-r117.1';
import {
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-request.mjs?v=0.117.0-r117.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceiptValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-request.mjs?v=0.117.0-r117.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-authority-decision-integrity.mjs?v=0.117.0-r117.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_PACKET_SCHEMA,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestContractReceiptValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestPacketValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-request.mjs?v=0.117.0-r117.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_ENVELOPE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureIntegrityContractReceiptValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseEnvelopeValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureAssessmentValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signature-integrity.mjs?v=0.117.0-r117.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signer-key-binding-request-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_ROUTE_PROJECTION_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signer-key-binding-route-projection/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signer-key-binding-request-packet/v1';

export const
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CREATE_CAPABILITY_ID =
    'contract.host-governance.policy-key.delegation.verification.response.signer-key.binding.request.create';
export const
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID =
    'authority.host-governance.policy-key.delegation.verification.response.signer-key.bind';

const UNKNOWN = 'UNKNOWN';
const NOT_AUTHORIZED = 'NOT_AUTHORIZED';
const MAXIMUM_REQUEST_LIFETIME_MS = 5 * 60 * 1000;
const NATIVE_EMISSION_MODE =
  'transient-from-exact-r116-r115-r114-r113-response-signature-custody';
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

function expectedRouteProjection(sourceR116Contract) {
  const sourceProjection =
    sourceR116Contract.responseSignatureIntegrityRouteProjection;
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_ROUTE_PROJECTION_SCHEMA,
    sourceR116RouteProjectionDigest: stableDigest(sourceProjection),
    sourceRouteCount: sourceProjection.sourceRouteCount,
    eligibleRouteCount: sourceProjection.eligibleRouteCount,
    authorityReviewRouteExcludedCount:
      sourceProjection.authorityReviewRouteExcludedCount,
    implementedCapabilityProjectionDigest: stableDigest([
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CREATE_CAPABILITY_ID
    ]),
    requiredCapabilityProjectionDigest: stableDigest([
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
      HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
      HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID,
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID
    ]),
    truthProjectionDigest: stableDigest({
      requestCreationOnly: true,
      sourceSignatureIntegrityReportedPassUntrusted: true,
      signedResponseClaimsAcceptedAsAuthority: false,
      requestTransmitted: false,
      responseSignerTrusted: false,
      responseSignerKeyBound: false,
      hostRegistryConfigured: false,
      hostGovernanceTrustRootResolved: false,
      policyKeyDelegationVerified: false,
      hostGovernanceAdmissionAuthorized: false,
      transientArtifactsPersisted: false,
      worldMutationPerformed: false
    })
  };
}

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestContractReceiptValid(
  receipt, sourceR116Contract = null, sourceR115Contract = null,
  sourceR114Contract = null, sourceR113Contract = null) {
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'sourceR116Contract',
        'sourceR115Contract', 'sourceR114Contract', 'sourceR113Contract',
        'responseSignerKeyBindingRouteProjection', 'emission', 'digest']) ||
      ![receipt.sourceR116Contract, receipt.sourceR115Contract,
        receipt.sourceR114Contract, receipt.sourceR113Contract]
        .every(value => exactKeys(value, ['schema', 'receiptDigest'])) ||
      !exactKeys(receipt.responseSignerKeyBindingRouteProjection,
        ['schema', 'sourceR116RouteProjectionDigest', 'sourceRouteCount',
          'eligibleRouteCount', 'authorityReviewRouteExcludedCount',
          'implementedCapabilityProjectionDigest',
          'requiredCapabilityProjectionDigest', 'truthProjectionDigest']) ||
      !exactKeys(receipt.emission, ['mode']) ||
      receipt.sourceR116Contract.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA ||
      receipt.sourceR115Contract.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA ||
      receipt.sourceR114Contract.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA ||
      receipt.sourceR113Contract.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA ||
      ![receipt.sourceR116Contract, receipt.sourceR115Contract,
        receipt.sourceR114Contract, receipt.sourceR113Contract]
        .every(value => fnvDigest(value.receiptDigest))) return false;
  const projection = sourceR116Contract === null
    ? receipt.responseSignerKeyBindingRouteProjection
    : expectedRouteProjection(sourceR116Contract);
  const projectionValid = projection.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_ROUTE_PROJECTION_SCHEMA &&
    fnvDigest(projection.sourceR116RouteProjectionDigest) &&
    fnvDigest(projection.implementedCapabilityProjectionDigest) &&
    fnvDigest(projection.requiredCapabilityProjectionDigest) &&
    fnvDigest(projection.truthProjectionDigest) &&
    projection.sourceRouteCount === 28 && projection.eligibleRouteCount === 24 &&
    projection.authorityReviewRouteExcludedCount === 4;
  const sourcesExact = sourceR116Contract === null ||
    (sourceR115Contract && sourceR114Contract && sourceR113Contract &&
      landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureIntegrityContractReceiptValid(
        sourceR116Contract, sourceR115Contract, sourceR114Contract,
        sourceR113Contract) &&
      landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestContractReceiptValid(
        sourceR115Contract, sourceR114Contract, sourceR113Contract) &&
      landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
        sourceR114Contract, sourceR113Contract) &&
      landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceiptValid(
        sourceR113Contract) &&
      exact(receipt.sourceR116Contract, sourceRef(sourceR116Contract)) &&
      exact(receipt.sourceR115Contract, sourceRef(sourceR115Contract)) &&
      exact(receipt.sourceR114Contract, sourceRef(sourceR114Contract)) &&
      exact(receipt.sourceR113Contract, sourceRef(sourceR113Contract)) &&
      exact(receipt.responseSignerKeyBindingRouteProjection, projection));
  return projectionValid && sourcesExact && receipt.status ===
      'POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PROJECTION_ONLY' &&
    receipt.emission.mode === NATIVE_EMISSION_MODE;
}

export function
createLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestContractReceipt(
  sourceR116Contract, sourceR115Contract, sourceR114Contract,
  sourceR113Contract) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureIntegrityContractReceiptValid(
      sourceR116Contract, sourceR115Contract, sourceR114Contract,
      sourceR113Contract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestContractReceiptValid(
        sourceR115Contract, sourceR114Contract, sourceR113Contract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
        sourceR114Contract, sourceR113Contract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceiptValid(
        sourceR113Contract)) {
    throw new Error(
      'Delegation-verification response signer-key-binding request needs exact R116/R115/R114/R113 contracts');
  }
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    status:
      'POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PROJECTION_ONLY',
    sourceR116Contract: sourceRef(sourceR116Contract),
    sourceR115Contract: sourceRef(sourceR115Contract),
    sourceR114Contract: sourceRef(sourceR114Contract),
    sourceR113Contract: sourceRef(sourceR113Contract),
    responseSignerKeyBindingRouteProjection:
      expectedRouteProjection(sourceR116Contract),
    emission: { mode: NATIVE_EMISSION_MODE }
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestContractReceiptValid(
      receipt, sourceR116Contract, sourceR115Contract, sourceR114Contract,
      sourceR113Contract)) {
    throw new Error(
      'Delegation-verification response signer-key-binding request contract failed validation');
  }
  return receipt;
}

function expectedRequestedBinding(request, envelope, assessment) {
  const target = request.hostGovernanceTarget;
  return {
    requiredCapabilityId:
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
    bindingScope: {
      governanceDomainId: target.governanceDomainId,
      worldId: target.worldId,
      lineageId: target.lineageId,
      claimedResponderId: envelope.claimedHostResponder.claimedResponderId,
      claimedSignerKeyId: envelope.claimedHostResponder.claimedSignerKeyId
    },
    sourceResponseEnvelopeDigest: envelope.digest,
    publicKeySha256: assessment.cryptographic.publicKeySha256,
    keyMaterialForm: 'SHA256_COMMITMENT_ONLY',
    acceptableAuthorityOrigin:
      'HOST_CONTROLLED_OUT_OF_BAND_BINDING_AFTER_HOST_DELEGATION_VERIFICATION',
    forbiddenAuthorityOrigin:
      'CALLER_RESPONSE_SIGNATURE_PASS_OR_CLAIMED_VERIFIED_RESULTS',
    rawPublicKeyIncluded: false,
    candidateMaySelfBind: false,
    performed: false
  };
}

const expectedDelivery = () => ({
  mode:
    'NOT_TRANSMITTED_NO_AUTHENTICATED_HOST_DELEGATION_RESPONSE_SIGNER_BINDING_ENDPOINT',
  endpoint: null,
  transportReceipt: null,
  recipientIdentityAuthenticationVerdict: UNKNOWN
});

function expectedSummary(envelope) {
  return {
    sourceR115RequestPacketCount: 1,
    sourceR116ResponseEnvelopeCount: 1,
    sourceR116ValidSignatureAssessmentCount: 1,
    sourceClaimedVerifiedResultCount:
      envelope.summary.claimedVerifiedResultCount,
    sourceAcceptedVerifiedPolicyKeyDelegationCount: 0,
    requestedResponseSignerKeyBindingCount: 1,
    requestedGovernanceScopeBindingCount: 1,
    transmittedRequestCount: 0,
    boundResponseSignerKeyCount: 0,
    authenticatedHostResponderCount: 0,
    configuredHostRegistryCount: 0,
    resolvedTrustRootCount: 0,
    verifiedPolicyKeyDelegationCount: 0,
    authorizedAdmissionCount: 0,
    persistedRequestPacketCount: 0,
    worldMutationCount: 0
  };
}

const expectedVerdicts = () => ({
  bindingRequestCreationVerdict: 'PASS_TRANSIENT_REQUEST_CREATED',
  sourceSignatureIntegrityVerdict: 'REPORTED_PASS_UNTRUSTED',
  sourcePolicyKeyDelegationVerificationVerdict: UNKNOWN,
  bindingRequestDeliveryVerdict: 'NOT_PERFORMED',
  responseSignerKeyBindingVerdict: UNKNOWN,
  hostResponderIdentityTrustVerdict: UNKNOWN,
  hostRegistryConfigurationVerdict: UNKNOWN,
  hostGovernanceTrustRootResolutionVerdict: UNKNOWN,
  policyKeyDelegationVerificationVerdict: UNKNOWN,
  hostGovernanceAdmissionVerdict: NOT_AUTHORIZED
});

const expectedTruth = () => ({
  exactR117ContractBound: true,
  exactR116SignatureIntegrityContractBound: true,
  exactR115RequestPacketBound: true,
  exactR116ResponseEnvelopeBound: true,
  exactValidR116SignatureAssessmentBound: true,
  sourceResponseEnvelopeDigestBound: true,
  sourceSignatureIntegrityReportedPassUntrusted: true,
  signedResponseClaimsAcceptedAsAuthority: false,
  responseSignerKeyBindingRequestCreated: true,
  responseSignerKeyBindingRequestTransmitted: false,
  authenticatedHostBindingEndpointKnown: false,
  rawPublicKeyIncluded: false,
  signatureBytesIncluded: false,
  callerSuppliedResponseSignerTrusted: false,
  claimedHostResponderIdentityTrusted: false,
  responseSignerKeyBound: false,
  hostRegistryConfigured: false,
  hostGovernanceTrustRootResolved: false,
  policyKeyDelegationVerified: false,
  hostGovernanceAdmissionAuthorized: false,
  persisted: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  worldMutationPerformed: false
});

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestPacketValid(
  packet, contract = null, sourceR116Contract = null,
  sourceR115Contract = null, sourceR114Contract = null,
  sourceR113Contract = null, request = null, envelope = null,
  assessment = null) {
  if (!digestValid(packet,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA) ||
      !exactKeys(packet, ['schema', 'status', 'bindingRequestId',
        'requestedAt', 'expiresAt', 'sourceContract',
        'sourceR116SignatureIntegrityContract', 'sourceR115RequestPacket',
        'sourceR116ResponseEnvelope', 'sourceR116SignatureAssessment',
        'claimedHostResponder', 'requestedSignerKeyBinding', 'delivery',
        'summary', 'verdicts', 'truth', 'digest']) ||
      ![packet.sourceContract, packet.sourceR116SignatureIntegrityContract,
        packet.sourceR115RequestPacket].every(value => exactKeys(value,
          ['schema', 'receiptDigest'])) ||
      !exactKeys(packet.sourceR116ResponseEnvelope,
        ['schema', 'receiptDigest', 'responseId']) ||
      !exactKeys(packet.sourceR116SignatureAssessment,
        ['schema', 'receiptDigest', 'sourceVerdict']) ||
      !exactKeys(packet.claimedHostResponder, ['claimedResponderId',
        'claimedSignerKeyId', 'claimedProducedAt']) ||
      !exactKeys(packet.requestedSignerKeyBinding,
        ['requiredCapabilityId', 'bindingScope',
          'sourceResponseEnvelopeDigest', 'publicKeySha256',
          'keyMaterialForm', 'acceptableAuthorityOrigin',
          'forbiddenAuthorityOrigin', 'rawPublicKeyIncluded',
          'candidateMaySelfBind', 'performed']) ||
      !exactKeys(packet.requestedSignerKeyBinding.bindingScope,
        ['governanceDomainId', 'worldId', 'lineageId',
          'claimedResponderId', 'claimedSignerKeyId']) ||
      !exactKeys(packet.delivery, ['mode', 'endpoint', 'transportReceipt',
        'recipientIdentityAuthenticationVerdict']) ||
      !exactKeys(packet.verdicts, ['bindingRequestCreationVerdict',
        'sourceSignatureIntegrityVerdict',
        'sourcePolicyKeyDelegationVerificationVerdict',
        'bindingRequestDeliveryVerdict', 'responseSignerKeyBindingVerdict',
        'hostResponderIdentityTrustVerdict',
        'hostRegistryConfigurationVerdict',
        'hostGovernanceTrustRootResolutionVerdict',
        'policyKeyDelegationVerificationVerdict',
        'hostGovernanceAdmissionVerdict'])) return false;
  const structural = packet.status ===
      'POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CREATED_NOT_TRANSMITTED' &&
    nonEmptyText(packet.bindingRequestId, 256) &&
    isoTimestamp(packet.requestedAt) && isoTimestamp(packet.expiresAt) &&
    Date.parse(packet.expiresAt) > Date.parse(packet.requestedAt) &&
    Date.parse(packet.expiresAt) - Date.parse(packet.requestedAt) <=
      MAXIMUM_REQUEST_LIFETIME_MS &&
    packet.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(packet.sourceContract.receiptDigest) &&
    packet.sourceR116SignatureIntegrityContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(packet.sourceR116SignatureIntegrityContract.receiptDigest) &&
    packet.sourceR115RequestPacket.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_REQUEST_PACKET_SCHEMA &&
    fnvDigest(packet.sourceR115RequestPacket.receiptDigest) &&
    packet.sourceR116ResponseEnvelope.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_ENVELOPE_SCHEMA &&
    fnvDigest(packet.sourceR116ResponseEnvelope.receiptDigest) &&
    nonEmptyText(packet.sourceR116ResponseEnvelope.responseId, 256) &&
    packet.sourceR116SignatureAssessment.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA &&
    fnvDigest(packet.sourceR116SignatureAssessment.receiptDigest) &&
    packet.sourceR116SignatureAssessment.sourceVerdict ===
      'REPORTED_PASS_UNTRUSTED' &&
    Object.values(packet.claimedHostResponder)
      .every(value => nonEmptyText(value, 512)) &&
    isoTimestamp(packet.claimedHostResponder.claimedProducedAt) &&
    packet.requestedSignerKeyBinding.requiredCapabilityId ===
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID &&
    Object.values(packet.requestedSignerKeyBinding.bindingScope)
      .every(value => nonEmptyText(value, 512)) &&
    fnvDigest(packet.requestedSignerKeyBinding.sourceResponseEnvelopeDigest) &&
    sha256Digest(packet.requestedSignerKeyBinding.publicKeySha256) &&
    packet.requestedSignerKeyBinding.keyMaterialForm ===
      'SHA256_COMMITMENT_ONLY' &&
    packet.requestedSignerKeyBinding.acceptableAuthorityOrigin ===
      'HOST_CONTROLLED_OUT_OF_BAND_BINDING_AFTER_HOST_DELEGATION_VERIFICATION' &&
    packet.requestedSignerKeyBinding.forbiddenAuthorityOrigin ===
      'CALLER_RESPONSE_SIGNATURE_PASS_OR_CLAIMED_VERIFIED_RESULTS' &&
    packet.requestedSignerKeyBinding.rawPublicKeyIncluded === false &&
    packet.requestedSignerKeyBinding.candidateMaySelfBind === false &&
    packet.requestedSignerKeyBinding.performed === false &&
    exact(packet.delivery, expectedDelivery()) &&
    exact(packet.verdicts, expectedVerdicts()) &&
    exact(packet.truth, expectedTruth());
  if (!structural || contract === null) return structural;
  if (!sourceR116Contract || !sourceR115Contract || !sourceR114Contract ||
      !sourceR113Contract || !request || !envelope || !assessment ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestContractReceiptValid(
        contract, sourceR116Contract, sourceR115Contract, sourceR114Contract,
        sourceR113Contract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestPacketValid(
        request) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseEnvelopeValid(
        envelope, sourceR116Contract, request) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureAssessmentValid(
        assessment, sourceR116Contract, request, envelope) ||
      assessment.cryptographic.signatureValid !== true ||
      assessment.verdicts.detachedSignatureIntegrityVerdict !== 'PASS' ||
      assessment.verdicts.trustedResponseSignerKeyBindingVerdict !== UNKNOWN ||
      assessment.verdicts.policyKeyDelegationVerificationVerdict !== UNKNOWN ||
      assessment.issues.length !== 0) return false;
  return exact(packet.sourceContract, sourceRef(contract)) &&
    exact(packet.sourceR116SignatureIntegrityContract,
      sourceRef(sourceR116Contract)) &&
    exact(packet.sourceR115RequestPacket, sourceRef(request)) &&
    exact(packet.sourceR116ResponseEnvelope, {
      ...sourceRef(envelope), responseId: envelope.responseId
    }) &&
    exact(packet.sourceR116SignatureAssessment, {
      ...sourceRef(assessment), sourceVerdict: 'REPORTED_PASS_UNTRUSTED'
    }) &&
    contract.sourceR116Contract.receiptDigest === sourceR116Contract.digest &&
    contract.sourceR115Contract.receiptDigest === sourceR115Contract.digest &&
    sourceR116Contract.sourceR115Contract.receiptDigest ===
      sourceR115Contract.digest &&
    request.sourceContract.receiptDigest === sourceR115Contract.digest &&
    envelope.sourceContract.receiptDigest === sourceR116Contract.digest &&
    envelope.sourceRequestPacket.receiptDigest === request.digest &&
    assessment.sourceContract.receiptDigest === sourceR116Contract.digest &&
    assessment.sourceRequestPacket.receiptDigest === request.digest &&
    assessment.sourceResponseEnvelope.receiptDigest === envelope.digest &&
    exact(packet.claimedHostResponder, envelope.claimedHostResponder) &&
    exact(packet.requestedSignerKeyBinding,
      expectedRequestedBinding(request, envelope, assessment)) &&
    Date.parse(packet.requestedAt) >=
      Date.parse(envelope.claimedHostResponder.claimedProducedAt) &&
    Date.parse(packet.expiresAt) <= Date.parse(request.expiresAt) &&
    exact(packet.summary, expectedSummary(envelope));
}

export function
createLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestPacket(
  contract, sourceR116Contract, sourceR115Contract, sourceR114Contract,
  sourceR113Contract, request, envelope, assessment, input) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestContractReceiptValid(
      contract, sourceR116Contract, sourceR115Contract, sourceR114Contract,
      sourceR113Contract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestPacketValid(
        request) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseEnvelopeValid(
        envelope, sourceR116Contract, request) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureAssessmentValid(
        assessment, sourceR116Contract, request, envelope) ||
      assessment.cryptographic.signatureValid !== true ||
      assessment.verdicts.detachedSignatureIntegrityVerdict !== 'PASS' ||
      assessment.verdicts.trustedResponseSignerKeyBindingVerdict !== UNKNOWN ||
      assessment.verdicts.policyKeyDelegationVerificationVerdict !== UNKNOWN ||
      assessment.issues.length !== 0 ||
      !exactKeys(input, ['bindingRequestId', 'requestedAt', 'expiresAt'])) {
    throw new Error(
      'Delegation-verification response signer-key-binding request needs exact R117/R116/R115/R114/R113 sources and a valid reported R116 assessment without raw key, signature, endpoint, transport, binding, or authority material');
  }
  const packet = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA,
    status:
      'POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CREATED_NOT_TRANSMITTED',
    bindingRequestId: input.bindingRequestId,
    requestedAt: input.requestedAt,
    expiresAt: input.expiresAt,
    sourceContract: sourceRef(contract),
    sourceR116SignatureIntegrityContract: sourceRef(sourceR116Contract),
    sourceR115RequestPacket: sourceRef(request),
    sourceR116ResponseEnvelope: {
      ...sourceRef(envelope), responseId: envelope.responseId
    },
    sourceR116SignatureAssessment: {
      ...sourceRef(assessment), sourceVerdict: 'REPORTED_PASS_UNTRUSTED'
    },
    claimedHostResponder: clone(envelope.claimedHostResponder),
    requestedSignerKeyBinding:
      expectedRequestedBinding(request, envelope, assessment),
    delivery: expectedDelivery(),
    summary: expectedSummary(envelope),
    verdicts: expectedVerdicts(),
    truth: expectedTruth()
  };
  packet.digest = stableDigest(packet);
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestPacketValid(
      packet, contract, sourceR116Contract, sourceR115Contract,
      sourceR114Contract, sourceR113Contract, request, envelope, assessment)) {
    throw new Error(
      'Delegation-verification response signer-key-binding request packet failed validation');
  }
  return packet;
}

export function
matrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestDescription() {
  return {
    contractReceiptSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    routeProjectionSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_ROUTE_PROJECTION_SCHEMA,
    requestPacketSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA,
    requestCreateCapabilityId:
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CREATE_CAPABILITY_ID,
    requiredResponseSignerKeyBindCapabilityId:
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
    requiredHostRegistryConfigureCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
    requiredTrustRootResolveCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
    requiredPolicyKeyDelegationVerifyCapabilityId:
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
    requiredAdmissionDecideCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID,
    requestTransmitted: false,
    callerSuppliedResponseSignerTrusted: false,
    signedResponseClaimsAcceptedAsAuthority: false,
    hostRegistryConfigured: false,
    hostGovernanceTrustRootResolutionImplemented: false,
    policyKeyDelegationVerificationImplemented: false,
    hostGovernanceAdmissionImplemented: false,
    responseSignerKeyBindingImplemented: false,
    transientArtifactsPersisted: false,
    mutatesWorld: false,
    status:
      'TRANSIENT_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_AVAILABLE_NOT_TRANSMITTED_AUTHORITY_AND_BINDING_STILL_MISSING'
  };
}
