import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_PACKET_SCHEMA,
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestPacketValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-request.mjs?v=0.113.0-r113.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_ENVELOPE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureIntegrityContractReceiptValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseEnvelopeValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureAssessmentValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signature-integrity.mjs?v=0.113.0-r113.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-request-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_ROUTE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-route/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-request-packet/v1';

export const
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CREATE_CAPABILITY_ID =
    'authority.host-governance.trust-root.registry.configuration.response.signer-key.bind.request.create';
export const
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID =
    'authority.host-governance.trust-root.registry.configuration.response.signer-key.bind';

const UNKNOWN = 'UNKNOWN';
const NOT_AUTHORIZED = 'NOT_AUTHORIZED';
const NATIVE_EMISSION_MODE =
  'native-from-intact-r112-configuration-response-signature-integrity-contract';
const MIGRATION_EMISSION_MODE =
  'migration-from-exact-retained-r112-configuration-response-signature-integrity-contract';
const MAXIMUM_REQUEST_LIFETIME_MS = 15 * 60 * 1000;
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
  typeof value === 'string' && value.trim().length > 0 &&
    value.length <= maximum;
const isoTimestamp = value =>
  nonEmptyText(value, 64) && Number.isFinite(Date.parse(value));

function expectedRouteProjection(sourceContract) {
  const projection = sourceContract.configurationResponseSignatureIntegrityRoutes
    .map(route => ({
      sourceRouteId: route.routeId,
      eligible: route
        .eligibleForConfigurationResponseSignatureIntegrityVerification === true
    }));
  const eligible = projection.filter(route => route.eligible).length;
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_ROUTE_SCHEMA,
    sourceRouteProjectionDigest: stableDigest(projection),
    sourceRouteCount: projection.length,
    eligibleRouteCount: eligible,
    authorityReviewRouteExcludedCount: projection.length - eligible
  };
}

function expectedCapabilityBoundary() {
  return {
    implementedResponseSignerKeyBindingRequestCreateCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CREATE_CAPABILITY_ID,
    requiredResponseSignerKeyBindCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
    requiredHostRegistryConfigureCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
    sourceSignatureIntegrityVerdict: UNKNOWN,
    responseSignerKeyBindingVerdict: UNKNOWN,
    hostRegistryConfigurationVerdict: UNKNOWN,
    hostGovernanceAdmissionVerdict: NOT_AUTHORIZED
  };
}

function expectedSummary(projection) {
  return {
    sourceR112ConfigurationResponseSignatureIntegrityContractCount: 1,
    responseSignerKeyBindingRequestRouteCount: projection.sourceRouteCount,
    responseSignerKeyBindingRequestEligibleRouteCount:
      projection.eligibleRouteCount,
    authorityReviewRouteExcludedCount:
      projection.authorityReviewRouteExcludedCount,
    implementedResponseSignerKeyBindingRequestCreateRouteCount:
      projection.eligibleRouteCount,
    persistedResponseEnvelopeCount: 0,
    persistedSignatureAssessmentCount: 0,
    persistedResponseSignerKeyBindingRequestPacketCount: 0,
    transmittedResponseSignerKeyBindingRequestPacketCount: 0,
    boundResponseSignerKeyCount: 0,
    configuredHostRegistryCount: 0,
    configuredTrustRootCount: 0,
    responseSignerKeyBindingRequestCreationImplemented: true,
    responseSignerKeyBindingImplemented: false,
    hostRegistryConfigurationImplemented: false
  };
}

const expectedContractTruth = () => ({
  exactR112ConfigurationResponseSignatureIntegrityContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourResponseSignerKeyBindingRequestRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  exactR111ConfigurationRequestPacketRequired: true,
  exactR112ConfigurationResponseEnvelopeRequired: true,
  exactValidR112SignatureAssessmentRequired: true,
  responseSignerKeyBindingRequestCreationImplemented: true,
  responseSignerKeyBindingCapabilitySeparatedFromRequestCreation: true,
  signatureIntegrityPassTreatedAsReportedUntrustedSourceEvidence: true,
  callerSuppliedPublicKeyTrusted: false,
  claimedHostResponderIdentityTrusted: false,
  responseSignerKeyBound: false,
  hostRegistryConfigured: false,
  hostRegistryOriginAuthenticated: false,
  hostGovernanceTrustRootResolved: false,
  policyKeyDelegationVerified: false,
  hostGovernanceAdmissionAuthorized: false,
  receiptSignerKeyBound: false,
  provisioningReceiptVerified: false,
  hostTrustAnchorProvisioned: false,
  bindingEndpointDeclared: false,
  bindingRequestTransportImplemented: false,
  responseEnvelopePersisted: false,
  signatureAssessmentPersisted: false,
  responseSignerKeyBindingRequestPersisted: false,
  rawPublicKeyBytesPersisted: false,
  signatureBytesPersisted: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  worldMutationPerformed: false,
  heatTransferPerformed: false,
  historicalHeatReconstructed: false,
  absoluteThermodynamicEnergyClaimed: false,
  scientificCalibrationClaimed: false
});

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceiptValid(
  receipt, sourceContract = null) {
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
        'responseSignerKeyBindingRouteProjection', 'capabilityBoundary',
        'summary', 'emission', 'truth', 'digest']) ||
      !exactKeys(receipt.source, ['schema', 'receiptDigest']) ||
      !exactKeys(receipt.responseSignerKeyBindingRouteProjection,
        ['schema', 'sourceRouteProjectionDigest', 'sourceRouteCount',
          'eligibleRouteCount', 'authorityReviewRouteExcludedCount']) ||
      !exactKeys(receipt.capabilityBoundary,
        ['implementedResponseSignerKeyBindingRequestCreateCapabilityId',
          'requiredResponseSignerKeyBindCapabilityId',
          'requiredHostRegistryConfigureCapabilityId',
          'sourceSignatureIntegrityVerdict',
          'responseSignerKeyBindingVerdict',
          'hostRegistryConfigurationVerdict',
          'hostGovernanceAdmissionVerdict']) ||
      !exactKeys(receipt.emission, ['mode',
        'sourceWasExactRetainedR112ResponseSignatureIntegrityContractMigration']) ||
      receipt.source.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA ||
      !fnvDigest(receipt.source.receiptDigest)) return false;
  const projection = sourceContract === null
    ? receipt.responseSignerKeyBindingRouteProjection
    : expectedRouteProjection(sourceContract);
  const sourceExact = sourceContract === null ||
    (landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureIntegrityContractReceiptValid(
      sourceContract) &&
      exact(receipt.creationContext, sourceContract.creationContext) &&
      exact(receipt.source, sourceRef(sourceContract)) &&
      exact(receipt.responseSignerKeyBindingRouteProjection, projection));
  const routeBoundary = projection.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_ROUTE_SCHEMA &&
    fnvDigest(projection.sourceRouteProjectionDigest) &&
    projection.sourceRouteCount === 28 && projection.eligibleRouteCount === 24 &&
    projection.authorityReviewRouteExcludedCount === 4 &&
    exact(receipt.capabilityBoundary, expectedCapabilityBoundary());
  const migration = receipt.emission.mode === MIGRATION_EMISSION_MODE;
  return sourceExact && routeBoundary && receipt.status ===
      'RESPONSE_SIGNER_KEY_BINDING_REQUEST_ROUTING_AVAILABLE_WITHOUT_BINDING_ENDPOINT_TRANSPORT_REGISTRY_CONFIGURATION_OR_AUTHORITY_EFFECTS' &&
    exact(receipt.summary, expectedSummary(projection)) &&
    [NATIVE_EMISSION_MODE, MIGRATION_EMISSION_MODE]
      .includes(receipt.emission.mode) &&
    receipt.emission
      .sourceWasExactRetainedR112ResponseSignatureIntegrityContractMigration ===
        migration && exact(receipt.truth, expectedContractTruth());
}

export function
createLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceipt(
  creationContext, sourceContract, options = {}) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureIntegrityContractReceiptValid(
      sourceContract) || !exact(creationContext, sourceContract.creationContext)) {
    throw new Error(
      'Response-signer-key-binding request routing needs the exact attached R112 signature-integrity contract');
  }
  const projection = expectedRouteProjection(sourceContract);
  const migration = options
    .sourceWasExactRetainedR112ResponseSignatureIntegrityContractMigration === true;
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    status:
      'RESPONSE_SIGNER_KEY_BINDING_REQUEST_ROUTING_AVAILABLE_WITHOUT_BINDING_ENDPOINT_TRANSPORT_REGISTRY_CONFIGURATION_OR_AUTHORITY_EFFECTS',
    creationContext: clone(creationContext),
    source: sourceRef(sourceContract),
    responseSignerKeyBindingRouteProjection: projection,
    capabilityBoundary: expectedCapabilityBoundary(),
    summary: expectedSummary(projection),
    emission: {
      mode: migration ? MIGRATION_EMISSION_MODE : NATIVE_EMISSION_MODE,
      sourceWasExactRetainedR112ResponseSignatureIntegrityContractMigration:
        migration
    },
    truth: expectedContractTruth()
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceiptValid(
      receipt, sourceContract)) {
    throw new Error('Response-signer-key-binding request contract failed validation');
  }
  return receipt;
}

function expectedRequestedBinding(envelope, assessment) {
  return {
    requiredCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
    bindingScope: {
      claimedResponderId: envelope.claimedHostResponder.claimedResponderId,
      claimedSignerKeyId: envelope.claimedHostResponder.claimedSignerKeyId,
      governanceDomainId: envelope.configuration.governanceDomainId,
      worldId: envelope.configuration.worldId,
      lineageId: envelope.configuration.lineageId
    },
    publicKeySha256: assessment.cryptographic.publicKeySha256,
    keyMaterialForm: 'SHA256_COMMITMENT_ONLY',
    acceptableAuthorityOrigin: 'HOST_CONTROLLED_OUT_OF_BAND_BINDING',
    forbiddenAuthorityOrigin:
      'CALLER_RESPONSE_ENVELOPE_OR_SIGNATURE_INTEGRITY_PASS',
    rawPublicKeyIncluded: false,
    candidateMaySelfBind: false,
    performed: false
  };
}

function expectedDelivery() {
  return {
    mode: 'NOT_TRANSMITTED_NO_HOST_SIGNER_KEY_BINDING_ENDPOINT',
    endpoint: null,
    transportReceipt: null,
    recipientIdentityAuthenticationVerdict: UNKNOWN
  };
}

function expectedPacketSummary(envelope) {
  return {
    sourceR111ConfigurationRequestPacketCount: 1,
    sourceR112ConfigurationResponseEnvelopeCount: 1,
    sourceR112ValidSignatureAssessmentCount: 1,
    requestedSignerKeyBindingCount: 1,
    requestedGovernanceScopeBindingCount: 1,
    transmittedRequestCount: 0,
    boundResponseSignerKeyCount: 0,
    authenticatedHostResponderCount: 0,
    configuredHostRegistryCount: 0,
    configuredTrustRootCount: 0,
    trustRootDescriptorCount: envelope.configuration.trustRootDescriptors.length,
    persistedRequestPacketCount: 0,
    worldMutationCount: 0
  };
}

const expectedPacketTruth = () => ({
  exactR113ContractBound: true,
  exactR112SignatureIntegrityContractBound: true,
  exactR111ConfigurationRequestPacketBound: true,
  exactR112ConfigurationResponseEnvelopeBound: true,
  exactValidR112SignatureAssessmentBound: true,
  sourceSignatureIntegrityReportedPassUntrusted: true,
  responseSignerKeyBindingRequestCreated: true,
  responseSignerKeyBindingRequestTransmitted: false,
  hostSignerKeyBindingEndpointKnown: false,
  rawPublicKeyIncluded: false,
  signatureBytesIncluded: false,
  callerSuppliedPublicKeyTrusted: false,
  claimedHostResponderIdentityTrusted: false,
  responseSignerKeyBound: false,
  hostRegistryConfigured: false,
  hostRegistryOriginAuthenticated: false,
  hostGovernanceTrustRootResolved: false,
  policyKeyDelegationVerified: false,
  hostGovernanceAdmissionAuthorized: false,
  receiptSignerKeyBound: false,
  provisioningReceiptVerified: false,
  hostTrustAnchorProvisioned: false,
  persisted: false,
  worldMutationPerformed: false
});

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestPacketValid(
  packet, contract = null, sourceContract = null, requestPacket = null,
  envelope = null, assessment = null) {
  if (!digestValid(packet,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA) ||
      !exactKeys(packet, ['schema', 'status', 'bindingRequestId',
        'requestedAt', 'expiresAt', 'sourceContract',
        'sourceResponseSignatureIntegrityContract',
        'sourceConfigurationRequestPacket', 'sourceResponseEnvelope',
        'sourceSignatureAssessment', 'claimedHostResponder',
        'requestedSignerKeyBinding', 'delivery', 'summary', 'verdicts',
        'truth', 'digest']) ||
      !exactKeys(packet.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(packet.sourceResponseSignatureIntegrityContract,
        ['schema', 'receiptDigest']) ||
      !exactKeys(packet.sourceConfigurationRequestPacket,
        ['schema', 'receiptDigest']) ||
      !exactKeys(packet.sourceResponseEnvelope,
        ['schema', 'receiptDigest', 'responseId']) ||
      !exactKeys(packet.sourceSignatureAssessment,
        ['schema', 'receiptDigest', 'sourceVerdict']) ||
      !exactKeys(packet.claimedHostResponder,
        ['claimedResponderId', 'claimedSignerKeyId', 'claimedProducedAt']) ||
      !exactKeys(packet.requestedSignerKeyBinding,
        ['requiredCapabilityId', 'bindingScope', 'publicKeySha256',
          'keyMaterialForm', 'acceptableAuthorityOrigin',
          'forbiddenAuthorityOrigin', 'rawPublicKeyIncluded',
          'candidateMaySelfBind', 'performed']) ||
      !exactKeys(packet.requestedSignerKeyBinding?.bindingScope,
        ['claimedResponderId', 'claimedSignerKeyId', 'governanceDomainId',
          'worldId', 'lineageId']) ||
      !exactKeys(packet.delivery, ['mode', 'endpoint', 'transportReceipt',
        'recipientIdentityAuthenticationVerdict']) ||
      !exactKeys(packet.verdicts, ['bindingRequestCreationVerdict',
        'sourceSignatureIntegrityVerdict', 'bindingRequestDeliveryVerdict',
        'responseSignerKeyBindingVerdict',
        'hostResponderIdentityTrustVerdict',
        'hostRegistryConfigurationVerdict',
        'hostRegistryOriginAuthenticationVerdict',
        'hostGovernanceTrustRootResolutionVerdict',
        'policyKeyDelegationVerificationVerdict',
        'hostGovernanceAdmissionVerdict', 'receiptSignerKeyBindingVerdict',
        'provisioningReceiptVerificationVerdict',
        'hostTrustAnchorProvisioningVerdict'])) return false;
  const structural = packet.status ===
      'RESPONSE_SIGNER_KEY_BINDING_REQUEST_CREATED_NOT_TRANSMITTED' &&
    nonEmptyText(packet.bindingRequestId, 256) &&
    isoTimestamp(packet.requestedAt) && isoTimestamp(packet.expiresAt) &&
    Date.parse(packet.expiresAt) > Date.parse(packet.requestedAt) &&
    Date.parse(packet.expiresAt) - Date.parse(packet.requestedAt) <=
      MAXIMUM_REQUEST_LIFETIME_MS &&
    packet.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(packet.sourceContract.receiptDigest) &&
    packet.sourceResponseSignatureIntegrityContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(packet.sourceResponseSignatureIntegrityContract.receiptDigest) &&
    packet.sourceConfigurationRequestPacket.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_PACKET_SCHEMA &&
    fnvDigest(packet.sourceConfigurationRequestPacket.receiptDigest) &&
    packet.sourceResponseEnvelope.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_ENVELOPE_SCHEMA &&
    fnvDigest(packet.sourceResponseEnvelope.receiptDigest) &&
    nonEmptyText(packet.sourceResponseEnvelope.responseId, 256) &&
    packet.sourceSignatureAssessment.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA &&
    fnvDigest(packet.sourceSignatureAssessment.receiptDigest) &&
    packet.sourceSignatureAssessment.sourceVerdict ===
      'REPORTED_PASS_UNTRUSTED' &&
    nonEmptyText(packet.claimedHostResponder.claimedResponderId, 256) &&
    nonEmptyText(packet.claimedHostResponder.claimedSignerKeyId, 256) &&
    isoTimestamp(packet.claimedHostResponder.claimedProducedAt) &&
    packet.requestedSignerKeyBinding.requiredCapabilityId ===
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID &&
    nonEmptyText(
      packet.requestedSignerKeyBinding.bindingScope.claimedResponderId, 256) &&
    nonEmptyText(
      packet.requestedSignerKeyBinding.bindingScope.claimedSignerKeyId, 256) &&
    nonEmptyText(
      packet.requestedSignerKeyBinding.bindingScope.governanceDomainId, 256) &&
    nonEmptyText(packet.requestedSignerKeyBinding.bindingScope.worldId, 256) &&
    nonEmptyText(
      packet.requestedSignerKeyBinding.bindingScope.lineageId, 512) &&
    sha256Digest(packet.requestedSignerKeyBinding.publicKeySha256) &&
    packet.requestedSignerKeyBinding.keyMaterialForm ===
      'SHA256_COMMITMENT_ONLY' &&
    packet.requestedSignerKeyBinding.acceptableAuthorityOrigin ===
      'HOST_CONTROLLED_OUT_OF_BAND_BINDING' &&
    packet.requestedSignerKeyBinding.forbiddenAuthorityOrigin ===
      'CALLER_RESPONSE_ENVELOPE_OR_SIGNATURE_INTEGRITY_PASS' &&
    packet.requestedSignerKeyBinding.rawPublicKeyIncluded === false &&
    packet.requestedSignerKeyBinding.candidateMaySelfBind === false &&
    packet.requestedSignerKeyBinding.performed === false &&
    exact(packet.delivery, expectedDelivery()) &&
    exact(packet.verdicts, {
      bindingRequestCreationVerdict: 'PASS_TRANSIENT_REQUEST_CREATED',
      sourceSignatureIntegrityVerdict: 'REPORTED_PASS_UNTRUSTED',
      bindingRequestDeliveryVerdict: 'NOT_PERFORMED',
      responseSignerKeyBindingVerdict: UNKNOWN,
      hostResponderIdentityTrustVerdict: UNKNOWN,
      hostRegistryConfigurationVerdict: UNKNOWN,
      hostRegistryOriginAuthenticationVerdict: UNKNOWN,
      hostGovernanceTrustRootResolutionVerdict: UNKNOWN,
      policyKeyDelegationVerificationVerdict: UNKNOWN,
      hostGovernanceAdmissionVerdict: NOT_AUTHORIZED,
      receiptSignerKeyBindingVerdict: UNKNOWN,
      provisioningReceiptVerificationVerdict: UNKNOWN,
      hostTrustAnchorProvisioningVerdict: UNKNOWN
    }) && exact(packet.truth, expectedPacketTruth());
  if (!structural || contract === null) return structural;
  if (!sourceContract || !requestPacket || !envelope || !assessment ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceiptValid(
        contract, sourceContract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestPacketValid(
        requestPacket) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseEnvelopeValid(
        envelope, sourceContract, requestPacket) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureAssessmentValid(
        assessment) || assessment.cryptographic.signatureValid !== true ||
      assessment.verdicts.signatureIntegrityVerdict !== 'PASS') return false;
  return exact(packet.sourceContract, sourceRef(contract)) &&
    exact(packet.sourceResponseSignatureIntegrityContract,
      sourceRef(sourceContract)) &&
    exact(packet.sourceConfigurationRequestPacket, sourceRef(requestPacket)) &&
    exact(packet.sourceResponseEnvelope, {
      ...sourceRef(envelope), responseId: envelope.responseId
    }) &&
    exact(packet.sourceSignatureAssessment, {
      ...sourceRef(assessment), sourceVerdict: 'REPORTED_PASS_UNTRUSTED'
    }) &&
    contract.source.receiptDigest === sourceContract.digest &&
    sourceContract.source.receiptDigest ===
      requestPacket.sourceContract.receiptDigest &&
    assessment.sourceContract.receiptDigest === sourceContract.digest &&
    assessment.sourceConfigurationRequestPacket.receiptDigest ===
      requestPacket.digest &&
    assessment.sourceResponseEnvelope.receiptDigest === envelope.digest &&
    exact(packet.claimedHostResponder, envelope.claimedHostResponder) &&
    exact(packet.requestedSignerKeyBinding,
      expectedRequestedBinding(envelope, assessment)) &&
    Date.parse(packet.requestedAt) >=
      Date.parse(envelope.claimedHostResponder.claimedProducedAt) &&
    Date.parse(packet.expiresAt) <= Date.parse(requestPacket.expiresAt) &&
    exact(packet.summary, expectedPacketSummary(envelope));
}

export function
createLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestPacket(
  contract, sourceContract, requestPacket, envelope, assessment, input) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceiptValid(
      contract, sourceContract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestPacketValid(
        requestPacket) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseEnvelopeValid(
        envelope, sourceContract, requestPacket) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureAssessmentValid(
        assessment) || assessment.cryptographic.signatureValid !== true ||
      assessment.verdicts.signatureIntegrityVerdict !== 'PASS' ||
      !exactKeys(input, ['bindingRequestId', 'requestedAt', 'expiresAt'])) {
    throw new Error(
      'Response-signer-key-binding request needs exact R113/R112/R111 sources and a valid reported R112 assessment without raw key, signature, endpoint, transport, binding, registry, or authority material');
  }
  const packet = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA,
    status: 'RESPONSE_SIGNER_KEY_BINDING_REQUEST_CREATED_NOT_TRANSMITTED',
    bindingRequestId: input.bindingRequestId,
    requestedAt: input.requestedAt,
    expiresAt: input.expiresAt,
    sourceContract: sourceRef(contract),
    sourceResponseSignatureIntegrityContract: sourceRef(sourceContract),
    sourceConfigurationRequestPacket: sourceRef(requestPacket),
    sourceResponseEnvelope: {
      ...sourceRef(envelope), responseId: envelope.responseId
    },
    sourceSignatureAssessment: {
      ...sourceRef(assessment), sourceVerdict: 'REPORTED_PASS_UNTRUSTED'
    },
    claimedHostResponder: clone(envelope.claimedHostResponder),
    requestedSignerKeyBinding: expectedRequestedBinding(envelope, assessment),
    delivery: expectedDelivery(),
    summary: expectedPacketSummary(envelope),
    verdicts: {
      bindingRequestCreationVerdict: 'PASS_TRANSIENT_REQUEST_CREATED',
      sourceSignatureIntegrityVerdict: 'REPORTED_PASS_UNTRUSTED',
      bindingRequestDeliveryVerdict: 'NOT_PERFORMED',
      responseSignerKeyBindingVerdict: UNKNOWN,
      hostResponderIdentityTrustVerdict: UNKNOWN,
      hostRegistryConfigurationVerdict: UNKNOWN,
      hostRegistryOriginAuthenticationVerdict: UNKNOWN,
      hostGovernanceTrustRootResolutionVerdict: UNKNOWN,
      policyKeyDelegationVerificationVerdict: UNKNOWN,
      hostGovernanceAdmissionVerdict: NOT_AUTHORIZED,
      receiptSignerKeyBindingVerdict: UNKNOWN,
      provisioningReceiptVerificationVerdict: UNKNOWN,
      hostTrustAnchorProvisioningVerdict: UNKNOWN
    },
    truth: expectedPacketTruth()
  };
  packet.digest = stableDigest(packet);
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestPacketValid(
      packet, contract, sourceContract, requestPacket, envelope, assessment)) {
    throw new Error('Response-signer-key-binding request packet failed validation');
  }
  return packet;
}

export function
matrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestDescription() {
  return {
    contractReceiptSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    routeSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_ROUTE_SCHEMA,
    requestPacketSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA,
    responseSignerKeyBindingRequestCreateCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CREATE_CAPABILITY_ID,
    requiredResponseSignerKeyBindCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
    requiredHostRegistryConfigureCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
    status:
      'TRANSIENT_RESPONSE_SIGNER_KEY_BINDING_REQUEST_AVAILABLE_NOT_TRANSMITTED_BINDING_REGISTRY_AND_AUTHORITY_STILL_MISSING'
  };
}
