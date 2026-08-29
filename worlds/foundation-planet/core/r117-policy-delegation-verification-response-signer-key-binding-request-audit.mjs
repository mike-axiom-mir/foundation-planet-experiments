import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_ROUTE_PROJECTION_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CREATE_CAPABILITY_ID,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID
} from './r117-policy-delegation-verification-response-signer-key-binding-request.mjs?v=0.117.0-r117.1';
import {
  HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
  HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-root-admission-request.mjs?v=0.117.0-r117.1';
import {
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-request.mjs?v=0.117.0-r117.1';
import {
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceiptValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-request.mjs?v=0.117.0-r117.1';
import {
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-authority-decision-integrity.mjs?v=0.117.0-r117.1';
import {
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestContractReceiptValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestPacketValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-request.mjs?v=0.117.0-r117.1';
import {
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureIntegrityContractReceiptValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseEnvelopeValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureAssessmentValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signature-integrity.mjs?v=0.117.0-r117.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_AUDIT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signer-key-binding-request-contract-audit/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PACKET_AUDIT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signer-key-binding-request-packet-audit/v1';

const UNKNOWN = 'UNKNOWN';
const NOT_AUTHORIZED = 'NOT_AUTHORIZED';
const NATIVE_EMISSION_MODE =
  'transient-from-exact-r116-r115-r114-r113-response-signature-custody';
const clone = value => JSON.parse(JSON.stringify(value));
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);

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

const noRawKeySignatureOrEndpoint = value => {
  const forbidden = new Set(['publicKeyRaw', 'rawPublicKey', 'signature',
    'signatureBytes', 'endpointUrl', 'bindingEndpoint']);
  const visit = item => {
    if (!item || typeof item !== 'object') return true;
    if (Array.isArray(item)) return item.every(visit);
    return Object.entries(item).every(([key, child]) =>
      !forbidden.has(key) && visit(child));
  };
  return visit(value);
};

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

function reconstructedContract(sourceR116Contract, sourceR115Contract,
  sourceR114Contract, sourceR113Contract) {
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
  return receipt;
}

export function
auditLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestContract(
  receipt, sourceR116Contract, sourceR115Contract, sourceR114Contract,
  sourceR113Contract) {
  let expected = null;
  try {
    expected = reconstructedContract(sourceR116Contract, sourceR115Contract,
      sourceR114Contract, sourceR113Contract);
  } catch {}
  const checks = {
    receiptDigestValid: digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA),
    exactR116ContractValid:
      landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureIntegrityContractReceiptValid(
        sourceR116Contract, sourceR115Contract, sourceR114Contract,
        sourceR113Contract),
    exactR115ContractValid:
      landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestContractReceiptValid(
        sourceR115Contract, sourceR114Contract, sourceR113Contract),
    exactR114ContractValid:
      landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
        sourceR114Contract, sourceR113Contract),
    exactR113ContractValid:
      landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceiptValid(
        sourceR113Contract),
    exactIndependentReconstruction: expected !== null && exact(receipt, expected),
    routePartitionPreserved:
      receipt?.responseSignerKeyBindingRouteProjection?.sourceRouteCount === 28 &&
      receipt?.responseSignerKeyBindingRouteProjection?.eligibleRouteCount ===
        24 && receipt?.responseSignerKeyBindingRouteProjection
        ?.authorityReviewRouteExcludedCount === 4,
    requestCreationCapabilityOnly:
      receipt?.responseSignerKeyBindingRouteProjection
        ?.implementedCapabilityProjectionDigest === stableDigest([
          HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CREATE_CAPABILITY_ID
        ]),
    noRawKeySignatureOrEndpoint: noRawKeySignatureOrEndpoint(receipt)
  };
  const issues = Object.entries(checks)
    .filter(([, value]) => value !== true).map(([name]) => name);
  return {
    id:
      'land-matrix-thermal-historical-source-host-governance-policy-key-delegation-verification-response-signer-key-binding-request-contract',
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_AUDIT_SCHEMA,
    status: issues.length === 0 ? 'PASS' : 'FAIL',
    sourceReceiptDigest: receipt?.digest || null,
    checks,
    issues,
    verdict: issues.length === 0
      ? 'R117_CONTRACT_EXACT_TRANSIENT_AND_NON_AUTHORIZING'
      : 'R117_CONTRACT_NOT_PROVEN'
  };
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

function reconstructedPacket(packet, contract, sourceR116Contract, request,
  envelope, assessment) {
  const expected = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA,
    status:
      'POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CREATED_NOT_TRANSMITTED',
    bindingRequestId: packet.bindingRequestId,
    requestedAt: packet.requestedAt,
    expiresAt: packet.expiresAt,
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
  expected.digest = stableDigest(expected);
  return expected;
}

export function
auditLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestPacket(
  packet, contract, sourceR116Contract, sourceR115Contract,
  sourceR114Contract, sourceR113Contract, request, envelope, assessment) {
  let expected = null;
  try {
    expected = reconstructedPacket(packet, contract, sourceR116Contract,
      request, envelope, assessment);
  } catch {}
  const contractAudit =
    auditLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestContract(
      contract, sourceR116Contract, sourceR115Contract, sourceR114Contract,
      sourceR113Contract);
  const sourceChainValid = contractAudit.status === 'PASS' &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestPacketValid(
      request) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseEnvelopeValid(
      envelope, sourceR116Contract, request) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureAssessmentValid(
      assessment, sourceR116Contract, request, envelope);
  const requested = packet?.requestedSignerKeyBinding;
  const checks = {
    packetDigestValid: digestValid(packet,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA),
    sourceChainValid,
    exactIndependentReconstruction: expected !== null && exact(packet, expected),
    exactSourcesBound:
      packet?.sourceContract?.receiptDigest === contract?.digest &&
      packet?.sourceR116SignatureIntegrityContract?.receiptDigest ===
        sourceR116Contract?.digest &&
      packet?.sourceR115RequestPacket?.receiptDigest === request?.digest &&
      packet?.sourceR116ResponseEnvelope?.receiptDigest === envelope?.digest &&
      packet?.sourceR116SignatureAssessment?.receiptDigest ===
        assessment?.digest &&
      assessment?.sourceContract?.receiptDigest === sourceR116Contract?.digest &&
      assessment?.sourceRequestPacket?.receiptDigest === request?.digest &&
      assessment?.sourceResponseEnvelope?.receiptDigest === envelope?.digest,
    validSignatureReportedWithoutTrustOrDelegation:
      assessment?.cryptographic?.signatureValid === true &&
      assessment?.verdicts?.detachedSignatureIntegrityVerdict === 'PASS' &&
      assessment?.verdicts?.trustedResponseSignerKeyBindingVerdict === UNKNOWN &&
      assessment?.verdicts?.policyKeyDelegationVerificationVerdict === UNKNOWN &&
      packet?.sourceR116SignatureAssessment?.sourceVerdict ===
        'REPORTED_PASS_UNTRUSTED' &&
      packet?.verdicts?.sourceSignatureIntegrityVerdict ===
        'REPORTED_PASS_UNTRUSTED' &&
      packet?.verdicts?.sourcePolicyKeyDelegationVerificationVerdict === UNKNOWN,
    exactKeyCommitmentResponseAndScopeRequested:
      requested?.publicKeySha256 ===
        assessment?.cryptographic?.publicKeySha256 &&
      requested?.sourceResponseEnvelopeDigest === envelope?.digest &&
      requested?.bindingScope?.governanceDomainId ===
        request?.hostGovernanceTarget?.governanceDomainId &&
      requested?.bindingScope?.worldId ===
        request?.hostGovernanceTarget?.worldId &&
      requested?.bindingScope?.lineageId ===
        request?.hostGovernanceTarget?.lineageId &&
      requested?.bindingScope?.claimedResponderId ===
        envelope?.claimedHostResponder?.claimedResponderId &&
      requested?.bindingScope?.claimedSignerKeyId ===
        envelope?.claimedHostResponder?.claimedSignerKeyId &&
      requested?.rawPublicKeyIncluded === false &&
      requested?.candidateMaySelfBind === false && requested?.performed === false,
    boundedSourceWindow:
      Number.isFinite(Date.parse(packet?.requestedAt)) &&
      Number.isFinite(Date.parse(packet?.expiresAt)) &&
      Date.parse(packet.requestedAt) >=
        Date.parse(envelope?.claimedHostResponder?.claimedProducedAt) &&
      Date.parse(packet.expiresAt) <= Date.parse(request?.expiresAt) &&
      Date.parse(packet.expiresAt) > Date.parse(packet.requestedAt) &&
      Date.parse(packet.expiresAt) - Date.parse(packet.requestedAt) <=
        5 * 60 * 1000,
    untransmittedUnboundAndNonAuthorizing:
      packet?.delivery?.mode ===
        'NOT_TRANSMITTED_NO_AUTHENTICATED_HOST_DELEGATION_RESPONSE_SIGNER_BINDING_ENDPOINT' &&
      packet?.delivery?.endpoint === null &&
      packet?.delivery?.transportReceipt === null &&
      packet?.verdicts?.responseSignerKeyBindingVerdict === UNKNOWN &&
      packet?.verdicts?.hostGovernanceAdmissionVerdict === NOT_AUTHORIZED &&
      packet?.truth?.responseSignerKeyBound === false &&
      packet?.truth?.policyKeyDelegationVerified === false &&
      packet?.truth?.hostGovernanceAdmissionAuthorized === false &&
      packet?.truth?.persisted === false &&
      packet?.truth?.worldMutationPerformed === false,
    noRawKeySignatureOrEndpoint: noRawKeySignatureOrEndpoint(packet)
  };
  const issues = Object.entries(checks)
    .filter(([, value]) => value !== true).map(([name]) => name);
  return {
    id:
      'land-matrix-thermal-historical-source-host-governance-policy-key-delegation-verification-response-signer-key-binding-request-packet',
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PACKET_AUDIT_SCHEMA,
    status: issues.length === 0 ? 'PASS' : 'FAIL',
    sourcePacketDigest: packet?.digest || null,
    checks,
    issues,
    verdict: issues.length === 0
      ? 'TRANSIENT_R117_BINDING_REQUEST_EXACT_UNTRUSTED_AND_NON_AUTHORIZING'
      : 'TRANSIENT_R117_BINDING_REQUEST_NOT_PROVEN'
  };
}
