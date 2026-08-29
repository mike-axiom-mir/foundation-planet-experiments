import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_PACKET_SCHEMA,
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestContractReceiptValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestPacketValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-request.mjs?v=0.112.0-r112.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signature-integrity-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INTEGRITY_ROUTE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signature-integrity-route/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_ENVELOPE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-envelope/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INPUT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signature-input/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signature-assessment/v1';

export const
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_VERIFY_CAPABILITY_ID =
    'integrity.host-governance.trust-root.registry.configuration.response.signature.verify';
export const REGISTRY_CONFIGURATION_RESPONSE_MAX_CHARACTERS = 65_536;
export const REGISTRY_CONFIGURATION_RESPONSE_MAX_TRUST_ROOTS = 32;
export const ED25519_RAW_PUBLIC_KEY_BYTES = 32;
export const ED25519_SIGNATURE_BYTES = 64;

const SIGNATURE_ALGORITHM = 'Ed25519';
const PUBLIC_KEY_FORMAT = 'raw-ed25519-32-byte';
const NATIVE_EMISSION_MODE = 'native-from-intact-r111-configuration-request-contract';
const MIGRATION_EMISSION_MODE =
  'migration-from-exact-retained-r111-configuration-request-contract';
const UNKNOWN = 'UNKNOWN';
const NOT_AUTHORIZED = 'NOT_AUTHORIZED';
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

function expectedRoutes(sourceContract) {
  return sourceContract.registryConfigurationRequestRoutes.map(sourceRoute => {
    const eligible =
      sourceRoute.eligibleForHostRegistryConfigurationRequest === true;
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INTEGRITY_ROUTE_SCHEMA,
      routeId: `configuration-response-signature-integrity:${sourceRoute.routeId}`,
      sourceRegistryConfigurationRequestRouteId: sourceRoute.routeId,
      requestBinding: clone(sourceRoute.requestBinding),
      eligibleForConfigurationResponseSignatureIntegrityVerification: eligible,
      responseEnvelopeSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_ENVELOPE_SCHEMA
        : null,
      signatureInputSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INPUT_SCHEMA
        : null,
      signatureAssessmentSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA
        : null,
      implementedSignatureVerificationCapabilityId: eligible
        ? HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_VERIFY_CAPABILITY_ID
        : null,
      requiredHostRegistryConfigureCapabilityId: eligible
        ? HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID : null,
      signatureAlgorithm: eligible ? SIGNATURE_ALGORITHM : null,
      publicKeyFormat: eligible ? PUBLIC_KEY_FORMAT : null,
      maximumCanonicalResponseCharacters: eligible
        ? REGISTRY_CONFIGURATION_RESPONSE_MAX_CHARACTERS : 0,
      responseEnvelope: null,
      signatureAssessment: null,
      signatureIntegrityVerdict: eligible ? UNKNOWN : null,
      trustedHostSignerKeyVerdict: eligible ? UNKNOWN : null,
      hostResponderIdentityTrustVerdict: eligible ? UNKNOWN : null,
      hostRegistryConfigurationVerdict: eligible ? UNKNOWN : null,
      hostRegistryOriginAuthenticationVerdict: eligible ? UNKNOWN : null,
      hostGovernanceAdmissionVerdict: eligible ? NOT_AUTHORIZED : null
    };
  });
}

function expectedSummary(routes) {
  const eligible = routes.filter(route =>
    route.eligibleForConfigurationResponseSignatureIntegrityVerification).length;
  return {
    sourceR111ConfigurationRequestContractCount: 1,
    configurationResponseSignatureIntegrityRouteCount: routes.length,
    configurationResponseSignatureIntegrityEligibleRouteCount: eligible,
    authorityReviewRouteExcludedCount: routes.length - eligible,
    implementedSignatureVerificationRouteCount: eligible,
    configurationResponseEnvelopeCount: 0,
    signatureAssessmentCount: 0,
    signatureIntegrityPassCount: 0,
    trustedHostSignerKeyCount: 0,
    authenticatedHostResponderCount: 0,
    configuredHostRegistryCount: 0,
    configuredTrustRootCount: 0,
    persistedConfigurationResponseCount: 0,
    responseEnvelopeValidationImplemented: true,
    detachedSignatureVerificationImplemented: true,
    trustedHostSignerKeyBindingImplemented: false,
    hostResponderIdentityAuthenticationImplemented: false,
    hostRegistryConfigurationImplemented: false,
    candidateAdmissionPathImplemented: false
  };
}

const expectedContractTruth = () => ({
  exactR111ConfigurationRequestContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourConfigurationResponseIntegrityRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  exactR111ConfigurationRequestPacketRequired: true,
  responseEnvelopeValidationImplemented: true,
  detachedEd25519SignatureVerificationImplemented: true,
  callerSuppliedRawPublicKeyOnly: true,
  signatureIntegrityPassMeansSuppliedKeyMatchOnly: true,
  trustedHostSignerKeyBindingImplemented: false,
  callerSuppliedPublicKeyTrusted: false,
  claimedHostResponderIdentityTrusted: false,
  hostRegistryConfigurationCapabilityRequired: true,
  hostRegistryConfigured: false,
  hostRegistryOriginAuthenticated: false,
  hostGovernanceTrustRootResolved: false,
  policyKeyDelegationVerified: false,
  hostGovernanceAdmissionAuthorized: false,
  receiptSignerKeyBound: false,
  provisioningReceiptVerified: false,
  hostTrustAnchorProvisioned: false,
  configurationResponseEndpointDeclared: false,
  configurationResponseTransportImplemented: false,
  configurationResponseEnvelopePersisted: false,
  callerSuppliedPublicKeyBytesPersisted: false,
  signatureBytesPersisted: false,
  signatureAssessmentPersisted: false,
  hostRegistryPersistedInWorldState: false,
  rawTrustRootPublicKeysPersisted: false,
  rawPolicyPublicKeysPersisted: false,
  replayLedgerImplemented: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  worldMutationPerformed: false,
  heatTransferPerformed: false,
  historicalHeatReconstructed: false,
  absoluteThermodynamicEnergyClaimed: false,
  scientificCalibrationClaimed: false
});

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureIntegrityContractReceiptValid(
  receipt, sourceContract = null) {
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
        'configurationResponseSignatureIntegrityRoutes', 'summary', 'emission',
        'truth', 'digest']) ||
      !exactKeys(receipt.source, ['schema', 'receiptDigest']) ||
      !exactKeys(receipt.emission, ['mode',
        'sourceWasExactRetainedR111ConfigurationRequestContractMigration']) ||
      receipt.source.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_CONTRACT_RECEIPT_SCHEMA ||
      !fnvDigest(receipt.source.receiptDigest) ||
      !Array.isArray(receipt.configurationResponseSignatureIntegrityRoutes) ||
      receipt.configurationResponseSignatureIntegrityRoutes.length !== 28) {
    return false;
  }
  const routes = sourceContract === null
    ? receipt.configurationResponseSignatureIntegrityRoutes
    : expectedRoutes(sourceContract);
  const sourceExact = sourceContract === null ||
    (landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestContractReceiptValid(
      sourceContract) &&
      exact(receipt.creationContext, sourceContract.creationContext) &&
      exact(receipt.source, sourceRef(sourceContract)) &&
      exact(receipt.configurationResponseSignatureIntegrityRoutes, routes));
  const eligible = receipt.configurationResponseSignatureIntegrityRoutes
    .filter(route =>
      route?.eligibleForConfigurationResponseSignatureIntegrityVerification === true);
  const excluded = receipt.configurationResponseSignatureIntegrityRoutes
    .filter(route =>
      route?.eligibleForConfigurationResponseSignatureIntegrityVerification === false);
  const routeBoundary = eligible.length === 24 && excluded.length === 4 &&
    new Set(receipt.configurationResponseSignatureIntegrityRoutes.map(
      route => route?.routeId)).size === 28 &&
    eligible.every(route => route.schema ===
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INTEGRITY_ROUTE_SCHEMA &&
      route.implementedSignatureVerificationCapabilityId ===
        HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_VERIFY_CAPABILITY_ID &&
      route.requiredHostRegistryConfigureCapabilityId ===
        HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID &&
      route.signatureAlgorithm === SIGNATURE_ALGORITHM &&
      route.publicKeyFormat === PUBLIC_KEY_FORMAT &&
      route.signatureIntegrityVerdict === UNKNOWN &&
      route.trustedHostSignerKeyVerdict === UNKNOWN &&
      route.hostRegistryConfigurationVerdict === UNKNOWN &&
      route.hostGovernanceAdmissionVerdict === NOT_AUTHORIZED) &&
    excluded.every(route => route.schema ===
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INTEGRITY_ROUTE_SCHEMA &&
      route.implementedSignatureVerificationCapabilityId === null &&
      route.requiredHostRegistryConfigureCapabilityId === null &&
      route.signatureAlgorithm === null && route.publicKeyFormat === null &&
      route.signatureIntegrityVerdict === null &&
      route.hostRegistryConfigurationVerdict === null &&
      route.hostGovernanceAdmissionVerdict === null);
  const migration = receipt.emission.mode === MIGRATION_EMISSION_MODE;
  return sourceExact && routeBoundary && receipt.status ===
      'CONFIGURATION_RESPONSE_SIGNATURE_INTEGRITY_AVAILABLE_WITH_CALLER_SUPPLIED_UNTRUSTED_KEY_WITHOUT_REGISTRY_CONFIGURATION_OR_AUTHORITY_EFFECTS' &&
    exact(receipt.summary, expectedSummary(
      receipt.configurationResponseSignatureIntegrityRoutes)) &&
    [NATIVE_EMISSION_MODE, MIGRATION_EMISSION_MODE]
      .includes(receipt.emission.mode) &&
    receipt.emission
      .sourceWasExactRetainedR111ConfigurationRequestContractMigration ===
        migration && exact(receipt.truth, expectedContractTruth());
}

export function
createLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureIntegrityContractReceipt(
  creationContext, sourceContract, options = {}) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestContractReceiptValid(
      sourceContract) || !exact(creationContext, sourceContract.creationContext)) {
    throw new Error(
      'Configuration-response signature integrity needs the exact attached R111 request contract');
  }
  const routes = expectedRoutes(sourceContract);
  const migration = options
    .sourceWasExactRetainedR111ConfigurationRequestContractMigration === true;
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
    status:
      'CONFIGURATION_RESPONSE_SIGNATURE_INTEGRITY_AVAILABLE_WITH_CALLER_SUPPLIED_UNTRUSTED_KEY_WITHOUT_REGISTRY_CONFIGURATION_OR_AUTHORITY_EFFECTS',
    creationContext: clone(creationContext),
    source: sourceRef(sourceContract),
    configurationResponseSignatureIntegrityRoutes: routes,
    summary: expectedSummary(routes),
    emission: {
      mode: migration ? MIGRATION_EMISSION_MODE : NATIVE_EMISSION_MODE,
      sourceWasExactRetainedR111ConfigurationRequestContractMigration: migration
    },
    truth: expectedContractTruth()
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureIntegrityContractReceiptValid(
      receipt, sourceContract)) {
    throw new Error('Configuration-response signature-integrity contract failed validation');
  }
  return receipt;
}

function trustRootDescriptorsValid(value) {
  return Array.isArray(value) && value.length > 0 &&
    value.length <= REGISTRY_CONFIGURATION_RESPONSE_MAX_TRUST_ROOTS &&
    new Set(value.map(item => item?.trustRootIdentifier)).size === value.length &&
    value.every(item => exactKeys(item, ['trustRootIdentifier',
        'verificationMaterialFormat', 'verificationMaterialSha256']) &&
      nonEmptyText(item.trustRootIdentifier, 256) &&
      item.verificationMaterialFormat === 'sha256-commitment-only' &&
      sha256Digest(item.verificationMaterialSha256));
}

function configurationValid(configuration, requestPacket) {
  return exactKeys(configuration, ['configurationOrigin', 'registryIdentifier',
      'registryVersion', 'governanceDomainId', 'worldId', 'lineageId',
      'trustRootDescriptors', 'revocationStateIdentifier',
      'configurationEffectiveAt']) &&
    configuration.configurationOrigin ===
      'CALLER_SUPPLIED_UNAUTHENTICATED_HOST_CONFIGURATION' &&
    nonEmptyText(configuration.registryIdentifier, 256) &&
    nonEmptyText(configuration.registryVersion, 128) &&
    nonEmptyText(configuration.governanceDomainId, 256) &&
    nonEmptyText(configuration.worldId, 256) &&
    nonEmptyText(configuration.lineageId, 512) &&
    trustRootDescriptorsValid(configuration.trustRootDescriptors) &&
    nonEmptyText(configuration.revocationStateIdentifier, 256) &&
    isoTimestamp(configuration.configurationEffectiveAt) &&
    (!requestPacket ||
      (configuration.governanceDomainId ===
          requestPacket.hostGovernanceTarget.claimedGovernanceDomainId &&
        configuration.worldId === requestPacket.hostGovernanceTarget.worldId &&
        configuration.lineageId === requestPacket.hostGovernanceTarget.lineageId &&
        Date.parse(configuration.configurationEffectiveAt) >=
          Date.parse(requestPacket.requestedAt) &&
        Date.parse(configuration.configurationEffectiveAt) <=
          Date.parse(requestPacket.expiresAt)));
}

function expectedEnvelopeSummary(configuration) {
  return {
    registryDescriptorCount: 1,
    governanceScopeBindingCount: 1,
    trustRootDescriptorCount: configuration.trustRootDescriptors.length,
    revocationStateDescriptorCount: 1,
    authenticatedHostResponderCount: 0,
    trustedHostSignerKeyCount: 0,
    configuredHostRegistryCount: 0,
    configuredTrustRootCount: 0,
    worldMutationCount: 0
  };
}

const expectedEnvelopeTruth = () => ({
  exactR112SignatureIntegrityContractBound: true,
  exactR111ConfigurationRequestPacketBound: true,
  requestConfigurationTargetPreserved: true,
  responseEnvelopeCallerSupplied: true,
  responseEnvelopeHostAuthenticated: false,
  responseEnvelopeSignatureVerified: false,
  callerSuppliedPublicKeyTrusted: false,
  claimedHostResponderIdentityTrusted: false,
  hostRegistryConfigured: false,
  hostRegistryOriginAuthenticated: false,
  hostGovernanceTrustRootResolved: false,
  policyKeyDelegationVerified: false,
  hostGovernanceAdmissionAuthorized: false,
  receiptSignerKeyBound: false,
  provisioningReceiptVerified: false,
  hostTrustAnchorProvisioned: false,
  responseEnvelopePersisted: false,
  worldMutationPerformed: false
});

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseEnvelopeValid(
  envelope, contract = null, requestPacket = null) {
  if (!digestValid(envelope,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_ENVELOPE_SCHEMA) ||
      !exactKeys(envelope, ['schema', 'status', 'sourceContract',
        'sourceConfigurationRequestPacket', 'responseId', 'claimedHostResponder',
        'configuration', 'summary', 'truth', 'digest']) ||
      !exactKeys(envelope.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(envelope.sourceConfigurationRequestPacket,
        ['schema', 'receiptDigest']) ||
      !exactKeys(envelope.claimedHostResponder,
        ['claimedResponderId', 'claimedSignerKeyId', 'claimedProducedAt']) ||
      envelope.status !==
        'CALLER_SUPPLIED_UNAUTHENTICATED_HOST_REGISTRY_CONFIGURATION_RESPONSE' ||
      envelope.sourceContract.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA ||
      !fnvDigest(envelope.sourceContract.receiptDigest) ||
      envelope.sourceConfigurationRequestPacket.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_PACKET_SCHEMA ||
      !fnvDigest(envelope.sourceConfigurationRequestPacket.receiptDigest) ||
      !nonEmptyText(envelope.responseId, 256) ||
      !nonEmptyText(envelope.claimedHostResponder.claimedResponderId, 256) ||
      !nonEmptyText(envelope.claimedHostResponder.claimedSignerKeyId, 256) ||
      !isoTimestamp(envelope.claimedHostResponder.claimedProducedAt) ||
      !configurationValid(envelope.configuration, requestPacket) ||
      !exact(envelope.summary, expectedEnvelopeSummary(envelope.configuration)) ||
      !exact(envelope.truth, expectedEnvelopeTruth())) return false;
  const structural = JSON.stringify(envelope).length <=
    REGISTRY_CONFIGURATION_RESPONSE_MAX_CHARACTERS;
  if (!structural || contract === null) return structural;
  if (!requestPacket ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureIntegrityContractReceiptValid(
        contract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestPacketValid(
        requestPacket)) return false;
  return envelope.sourceContract.receiptDigest === contract.digest &&
    contract.source.receiptDigest === requestPacket.sourceContract.receiptDigest &&
    envelope.sourceConfigurationRequestPacket.receiptDigest ===
      requestPacket.digest &&
    Date.parse(envelope.claimedHostResponder.claimedProducedAt) >=
      Date.parse(requestPacket.requestedAt) &&
    Date.parse(envelope.claimedHostResponder.claimedProducedAt) <=
      Date.parse(requestPacket.expiresAt);
}

export function
createLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseEnvelope(
  contract, requestPacket, input) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureIntegrityContractReceiptValid(
      contract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestPacketValid(
        requestPacket) ||
      contract.source.receiptDigest !== requestPacket.sourceContract.receiptDigest ||
      !exactKeys(input, ['responseId', 'claimedResponderId',
        'claimedSignerKeyId', 'claimedProducedAt', 'configuration']) ||
      !configurationValid(input.configuration, requestPacket)) {
    throw new Error(
      'Configuration response needs exact R112/R111 sources and bounded caller-supplied unauthenticated configuration');
  }
  const envelope = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_ENVELOPE_SCHEMA,
    status:
      'CALLER_SUPPLIED_UNAUTHENTICATED_HOST_REGISTRY_CONFIGURATION_RESPONSE',
    sourceContract: sourceRef(contract),
    sourceConfigurationRequestPacket: sourceRef(requestPacket),
    responseId: input.responseId,
    claimedHostResponder: {
      claimedResponderId: input.claimedResponderId,
      claimedSignerKeyId: input.claimedSignerKeyId,
      claimedProducedAt: input.claimedProducedAt
    },
    configuration: clone(input.configuration),
    summary: expectedEnvelopeSummary(input.configuration),
    truth: expectedEnvelopeTruth()
  };
  envelope.digest = stableDigest(envelope);
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseEnvelopeValid(
      envelope, contract, requestPacket)) {
    throw new Error('Configuration-response envelope failed validation or budget');
  }
  return envelope;
}

export function
canonicalLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseText(
  envelope) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseEnvelopeValid(
      envelope)) {
    throw new Error('Canonical configuration-response text needs a valid envelope');
  }
  return JSON.stringify(envelope);
}

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureInputValid(
  input) {
  return exactKeys(input, ['schema', 'responseEnvelopeDigest',
      'publicKeyFormat', 'publicKeyRaw', 'signature']) &&
    input.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INPUT_SCHEMA &&
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
  exactR112SignatureIntegrityContractBound: true,
  exactR111ConfigurationRequestPacketBound: true,
  exactConfigurationResponseEnvelopeBound: true,
  detachedEd25519SignatureVerificationPerformed: true,
  signatureIntegrityVerified: signatureValid,
  signatureIntegrityPassMeansSuppliedKeyMatchOnly: true,
  callerSuppliedPublicKeyTrusted: false,
  claimedHostResponderIdentityTrusted: false,
  hostRegistryConfigured: false,
  hostRegistryOriginAuthenticated: false,
  hostGovernanceTrustRootResolved: false,
  policyKeyDelegationVerified: false,
  hostGovernanceAdmissionAuthorized: false,
  receiptSignerKeyBound: false,
  provisioningReceiptVerified: false,
  hostTrustAnchorProvisioned: false,
  publicKeyBytesPersisted: false,
  signatureBytesPersisted: false,
  responseEnvelopePersisted: false,
  signatureAssessmentPersisted: false,
  configurationDecisionPersisted: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  worldMutationPerformed: false
});

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureAssessmentValid(
  assessment) {
  if (!digestValid(assessment,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA) ||
      !exactKeys(assessment, ['schema', 'status', 'sourceContract',
        'sourceConfigurationRequestPacket', 'sourceResponseEnvelope',
        'claimedHostResponder', 'cryptographic', 'verdicts', 'issues', 'truth',
        'digest']) ||
      !exactKeys(assessment.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(assessment.sourceConfigurationRequestPacket,
        ['schema', 'receiptDigest']) ||
      !exactKeys(assessment.sourceResponseEnvelope,
        ['schema', 'receiptDigest']) ||
      !exactKeys(assessment.claimedHostResponder,
        ['claimedResponderId', 'claimedSignerKeyId', 'claimedProducedAt']) ||
      !exactKeys(assessment.cryptographic, ['signatureAlgorithm',
        'publicKeyFormat', 'publicKeyByteLength', 'signatureByteLength',
        'canonicalResponseCharacterCount', 'publicKeySha256',
        'signatureSha256', 'signatureValid']) ||
      !exactKeys(assessment.verdicts, ['responseEnvelopeStructuralVerdict',
        'signatureIntegrityVerdict', 'trustedHostSignerKeyBindingVerdict',
        'hostResponderIdentityTrustVerdict',
        'hostRegistryConfigurationVerdict',
        'hostRegistryOriginAuthenticationVerdict',
        'hostGovernanceTrustRootResolutionVerdict',
        'policyKeyDelegationVerificationVerdict',
        'hostGovernanceAdmissionVerdict']) ||
      !Array.isArray(assessment.issues)) return false;
  const valid = assessment.cryptographic.signatureValid === true;
  return assessment.status === (valid
      ? 'REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_VALID_WITH_UNTRUSTED_CALLER_SUPPLIED_KEY'
      : 'REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INVALID') &&
    assessment.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(assessment.sourceContract.receiptDigest) &&
    assessment.sourceConfigurationRequestPacket.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_PACKET_SCHEMA &&
    fnvDigest(assessment.sourceConfigurationRequestPacket.receiptDigest) &&
    assessment.sourceResponseEnvelope.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_ENVELOPE_SCHEMA &&
    fnvDigest(assessment.sourceResponseEnvelope.receiptDigest) &&
    nonEmptyText(assessment.claimedHostResponder.claimedResponderId, 256) &&
    nonEmptyText(assessment.claimedHostResponder.claimedSignerKeyId, 256) &&
    isoTimestamp(assessment.claimedHostResponder.claimedProducedAt) &&
    assessment.cryptographic.signatureAlgorithm === SIGNATURE_ALGORITHM &&
    assessment.cryptographic.publicKeyFormat === PUBLIC_KEY_FORMAT &&
    assessment.cryptographic.publicKeyByteLength === ED25519_RAW_PUBLIC_KEY_BYTES &&
    assessment.cryptographic.signatureByteLength === ED25519_SIGNATURE_BYTES &&
    Number.isInteger(
      assessment.cryptographic.canonicalResponseCharacterCount) &&
    assessment.cryptographic.canonicalResponseCharacterCount > 0 &&
    assessment.cryptographic.canonicalResponseCharacterCount <=
      REGISTRY_CONFIGURATION_RESPONSE_MAX_CHARACTERS &&
    sha256Digest(assessment.cryptographic.publicKeySha256) &&
    sha256Digest(assessment.cryptographic.signatureSha256) &&
    assessment.verdicts.responseEnvelopeStructuralVerdict === 'PASS' &&
    assessment.verdicts.signatureIntegrityVerdict === (valid ? 'PASS' : 'FAIL') &&
    assessment.verdicts.trustedHostSignerKeyBindingVerdict === UNKNOWN &&
    assessment.verdicts.hostResponderIdentityTrustVerdict === UNKNOWN &&
    assessment.verdicts.hostRegistryConfigurationVerdict === UNKNOWN &&
    assessment.verdicts.hostRegistryOriginAuthenticationVerdict === UNKNOWN &&
    assessment.verdicts.hostGovernanceTrustRootResolutionVerdict === UNKNOWN &&
    assessment.verdicts.policyKeyDelegationVerificationVerdict === UNKNOWN &&
    assessment.verdicts.hostGovernanceAdmissionVerdict === NOT_AUTHORIZED &&
    exact(assessment.issues, valid ? [] : ['detached-signature-invalid']) &&
    exact(assessment.truth, expectedAssessmentTruth(valid));
}

export async function
verifyLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignature(
  contract, requestPacket, envelope, signatureInput) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureIntegrityContractReceiptValid(
      contract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseEnvelopeValid(
        envelope, contract, requestPacket) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureInputValid(
        signatureInput) ||
      signatureInput.responseEnvelopeDigest !== envelope.digest) {
    throw new Error(
      'Configuration-response signature verification needs exact R112, R111, envelope, key, and signature inputs');
  }
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error('Web Crypto SubtleCrypto is unavailable');
  const publicKeyRaw = new Uint8Array(signatureInput.publicKeyRaw);
  const signature = new Uint8Array(signatureInput.signature);
  const canonicalText =
    canonicalLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseText(
      envelope);
  const publicKey = await subtle.importKey('raw', publicKeyRaw,
    { name: SIGNATURE_ALGORITHM }, false, ['verify']);
  const signatureValid = await subtle.verify({ name: SIGNATURE_ALGORITHM },
    publicKey, signature, new TextEncoder().encode(canonicalText));
  const assessment = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA,
    status: signatureValid
      ? 'REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_VALID_WITH_UNTRUSTED_CALLER_SUPPLIED_KEY'
      : 'REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INVALID',
    sourceContract: sourceRef(contract),
    sourceConfigurationRequestPacket: sourceRef(requestPacket),
    sourceResponseEnvelope: sourceRef(envelope),
    claimedHostResponder: clone(envelope.claimedHostResponder),
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
      trustedHostSignerKeyBindingVerdict: UNKNOWN,
      hostResponderIdentityTrustVerdict: UNKNOWN,
      hostRegistryConfigurationVerdict: UNKNOWN,
      hostRegistryOriginAuthenticationVerdict: UNKNOWN,
      hostGovernanceTrustRootResolutionVerdict: UNKNOWN,
      policyKeyDelegationVerificationVerdict: UNKNOWN,
      hostGovernanceAdmissionVerdict: NOT_AUTHORIZED
    },
    issues: signatureValid ? [] : ['detached-signature-invalid'],
    truth: expectedAssessmentTruth(signatureValid)
  };
  assessment.digest = stableDigest(assessment);
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureAssessmentValid(
      assessment)) {
    throw new Error('Configuration-response signature assessment failed validation');
  }
  return assessment;
}

export function
matrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureIntegrityDescription() {
  return {
    contractReceiptSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
    routeSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INTEGRITY_ROUTE_SCHEMA,
    responseEnvelopeSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_ENVELOPE_SCHEMA,
    signatureInputSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INPUT_SCHEMA,
    signatureAssessmentSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA,
    signatureVerificationCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_VERIFY_CAPABILITY_ID,
    requiredRegistryConfigureCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
    signatureAlgorithm: SIGNATURE_ALGORITHM,
    publicKeyFormat: PUBLIC_KEY_FORMAT,
    maximumCanonicalResponseCharacters:
      REGISTRY_CONFIGURATION_RESPONSE_MAX_CHARACTERS,
    detachedSignatureVerificationImplemented: true,
    trustedHostSignerKeyBindingImplemented: false,
    hostResponderIdentityAuthenticationImplemented: false,
    hostRegistryConfigurationImplemented: false,
    responsePersistenceImplemented: false,
    candidateAdmissionPathImplemented: false,
    mutatesWorld: false,
    status: 'EXPERIMENTAL'
  };
}
