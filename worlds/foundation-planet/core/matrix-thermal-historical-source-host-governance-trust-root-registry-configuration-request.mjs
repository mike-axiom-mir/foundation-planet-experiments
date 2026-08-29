import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_PACKET_SCHEMA,
  HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
  HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestPacketValid
} from './matrix-thermal-historical-source-host-governance-trust-root-admission-request.mjs?v=0.111.0-r111.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_PACKET_SCHEMA,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightContractReceiptValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightPacketValid
} from './matrix-thermal-historical-source-host-governance-trust-root-resolution-preflight.mjs?v=0.111.0-r111.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-request-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_ROUTE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-request-route/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUIREMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-requirement/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_PACKET_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-request-packet/v1';

export const
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_CREATE_CAPABILITY_ID =
    'authority.host-governance.trust-root.registry.configuration.request.create';
export const HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID =
  'authority.host-governance.trust-root.registry.configure';

const UNKNOWN = 'UNKNOWN';
const NOT_AUTHORIZED = 'NOT_AUTHORIZED';
const NATIVE_EMISSION_MODE =
  'native-from-intact-r110-trust-root-resolution-preflight-contract';
const MIGRATION_EMISSION_MODE =
  'migration-from-exact-retained-r110-trust-root-resolution-preflight-contract';
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
  return 'fnv1a32:' + (hash >>> 0).toString(16).padStart(8, '0');
}

function digestValid(value, schema) {
  if (value?.schema !== schema || typeof value.digest !== 'string') {
    return false;
  }
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

const nonEmptyText = (value, maximum = 4096) =>
  typeof value === 'string' && value.trim().length > 0 &&
    value.length <= maximum;
const isoTimestamp = value =>
  nonEmptyText(value, 64) && Number.isFinite(Date.parse(value));
const fnvDigest = value => typeof value === 'string' &&
  /^fnv1a32:[a-f0-9]{8}$/.test(value);
const hostWorldDigest = value => typeof value === 'string' &&
  /^[a-f0-9]{64}$/.test(value);
const sourceRef = value => ({ schema: value.schema, receiptDigest: value.digest });

function expectedRequirements() {
  const requirement = (requirementId, requestedFieldSet) => ({
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUIREMENT_SCHEMA,
    requirementId,
    requiredCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
    requestedFieldSet,
    acceptableOrigin: 'HOST_CONTROLLED_OUT_OF_BAND_CONFIGURATION',
    forbiddenOrigin: 'CALLER_PACKET_OR_CANDIDATE_KEY_SELF_ASSERTION',
    candidateMaySatisfy: false,
    provided: false,
    verdict: UNKNOWN
  });
  return [
    requirement('authenticated-registry-descriptor',
      ['registryIdentifier', 'registryVersion']),
    requirement('host-governance-scope-binding',
      ['governanceDomainId', 'worldId', 'lineageId']),
    requirement('authenticated-trust-root-set',
      ['trustRootIdentifiers', 'trustRootVerificationMaterial']),
    requirement('registry-revocation-and-version-policy',
      ['revocationStateIdentifier', 'configurationEffectiveAt'])
  ];
}

function expectedRoutes(sourceContract) {
  return sourceContract.resolutionPreflightRoutes.map(sourceRoute => {
    const eligible = sourceRoute
      .eligibleForHostGovernanceTrustRootResolutionPreflight === true;
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_ROUTE_SCHEMA,
      routeId:
        'host-governance-trust-root-registry-configuration-request:' +
          sourceRoute.routeId,
      sourceResolutionPreflightRouteId: sourceRoute.routeId,
      requestBinding: clone(sourceRoute.requestBinding),
      eligibleForHostRegistryConfigurationRequest: eligible,
      sourceResolutionPreflightPacketSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_PACKET_SCHEMA
        : null,
      registryConfigurationRequestPacketSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_PACKET_SCHEMA
        : null,
      implementedRegistryConfigurationRequestCreateCapabilityId: eligible
        ? HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_CREATE_CAPABILITY_ID
        : null,
      requiredHostRegistryConfigureCapabilityId: eligible
        ? HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID : null,
      requiredHostGovernanceTrustRootResolveCapabilityId: eligible
        ? HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID : null,
      requiredPolicyKeyDelegationVerifyCapabilityId: eligible
        ? HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID : null,
      requiredHostGovernanceTrustRootAdmissionDecideCapabilityId: eligible
        ? HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID : null,
      requiredReceiptSignerKeyBindingCapabilityId: eligible
        ? sourceRoute.requiredReceiptSignerKeyBindingCapabilityId : null,
      requiredProvisioningReceiptVerifyCapabilityId: eligible
        ? sourceRoute.requiredProvisioningReceiptVerifyCapabilityId : null,
      requiredHostTrustAnchorProvisionCapabilityId: eligible
        ? sourceRoute.requiredHostTrustAnchorProvisionCapabilityId : null,
      hostRegistryConfigurationVerdict: eligible ? UNKNOWN : null,
      hostGovernanceTrustRootResolutionVerdict: eligible ? UNKNOWN : null,
      policyKeyDelegationVerificationVerdict: eligible ? UNKNOWN : null,
      hostGovernanceAdmissionVerdict: eligible ? NOT_AUTHORIZED : null,
      hostTrustAnchorProvisioned: false
    };
  });
}

function expectedSummary(routes, requirements) {
  const eligible = routes.filter(route =>
    route.eligibleForHostRegistryConfigurationRequest).length;
  return {
    sourceR110ResolutionPreflightContractCount: 1,
    hostRegistryConfigurationRequestRouteCount: routes.length,
    hostRegistryConfigurationRequestEligibleRouteCount: eligible,
    authorityReviewRouteExcludedCount: routes.length - eligible,
    hostRegistryConfigurationRequirementCount: requirements.length,
    implementedRegistryConfigurationRequestCreateRouteCount: eligible,
    persistedRegistryConfigurationRequestPacketCount: 0,
    transmittedRegistryConfigurationRequestPacketCount: 0,
    configuredHostRegistryCount: 0,
    configuredTrustRootCount: 0,
    resolvedHostGovernanceTrustRootCount: 0,
    verifiedPolicyKeyDelegationCount: 0,
    hostGovernanceAdmissionDecisionCount: 0,
    trustedReceiptSignerKeyBindingCount: 0,
    verifiedProvisioningReceiptCount: 0,
    hostTrustAnchorCount: 0,
    registryConfigurationRequestCreationImplemented: true,
    hostRegistryConfigurationImplemented: false,
    hostGovernanceTrustRootResolutionImplemented: false,
    policyKeyDelegationVerificationImplemented: false,
    hostGovernanceTrustRootAdmissionDecisionImplemented: false,
    receiptSignerKeyBindingImplemented: false,
    provisioningReceiptVerificationImplemented: false,
    hostTrustAnchorProvisioningImplemented: false
  };
}

const expectedContractTruth = () => ({
  exactR110ResolutionPreflightContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourRegistryConfigurationRequestRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  exactR110ResolutionPreflightPacketRequired: true,
  exactR109AdmissionRequestPacketRequired: true,
  registryConfigurationRequestCreationImplemented: true,
  hostRegistryConfigurationCapabilitySeparatedFromTrustRootResolution: true,
  requestRequiresFailClosedR110Preflight: true,
  candidatePacketMaySupplyHostRegistry: false,
  candidatePacketMaySupplyTrustRoot: false,
  hostRegistryMustBeConfiguredOutOfBand: true,
  hostRegistryConfigured: false,
  hostRegistryOriginAuthenticated: false,
  hostGovernanceTrustRootResolved: false,
  hostIdentityAuthenticated: false,
  policyKeyDelegationVerified: false,
  hostGovernanceAdmissionAuthorized: false,
  receiptSignerKeyBindingImplemented: false,
  provisioningReceiptVerified: false,
  hostTrustAnchorProvisioned: false,
  configurationRequestEndpointDeclared: false,
  configurationRequestTransportImplemented: false,
  configurationRequestPacketPersisted: false,
  hostRegistryPersistedInWorldState: false,
  rawTrustRootPublicKeysPersisted: false,
  rawPolicyPublicKeysPersisted: false,
  signatureBytesPersisted: false,
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
landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestContractReceiptValid(
  receipt, sourceContract = null) {
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
        'registryConfigurationRequestRoutes', 'configurationRequirements',
        'summary', 'emission', 'truth', 'digest']) ||
      !exactKeys(receipt.source, ['schema', 'receiptDigest']) ||
      !exactKeys(receipt.emission, ['mode',
        'sourceWasExactRetainedR110ResolutionPreflightContractMigration']) ||
      receipt.source.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA ||
      !fnvDigest(receipt.source.receiptDigest) ||
      !Array.isArray(receipt.registryConfigurationRequestRoutes) ||
      receipt.registryConfigurationRequestRoutes.length !== 28) return false;
  const routes = sourceContract === null
    ? receipt.registryConfigurationRequestRoutes : expectedRoutes(sourceContract);
  const requirements = expectedRequirements();
  const migration = receipt.emission.mode === MIGRATION_EMISSION_MODE;
  const sourceExact = sourceContract === null ||
    (landMatrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightContractReceiptValid(
      sourceContract) &&
      exact(receipt.creationContext, sourceContract.creationContext) &&
      exact(receipt.source, sourceRef(sourceContract)) &&
      exact(receipt.registryConfigurationRequestRoutes, routes));
  const eligible = receipt.registryConfigurationRequestRoutes.filter(route =>
    route?.eligibleForHostRegistryConfigurationRequest === true);
  const excluded = receipt.registryConfigurationRequestRoutes.filter(route =>
    route?.eligibleForHostRegistryConfigurationRequest === false);
  const routeBoundary = eligible.length === 24 && excluded.length === 4 &&
    new Set(receipt.registryConfigurationRequestRoutes.map(
      route => route?.routeId)).size === 28 &&
    eligible.every(route => route.schema ===
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_ROUTE_SCHEMA &&
      route.implementedRegistryConfigurationRequestCreateCapabilityId ===
        HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_CREATE_CAPABILITY_ID &&
      route.requiredHostRegistryConfigureCapabilityId ===
        HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID &&
      route.hostRegistryConfigurationVerdict === UNKNOWN &&
      route.hostGovernanceTrustRootResolutionVerdict === UNKNOWN &&
      route.hostGovernanceAdmissionVerdict === NOT_AUTHORIZED &&
      route.hostTrustAnchorProvisioned === false) &&
    excluded.every(route => route.schema ===
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_ROUTE_SCHEMA &&
      route.implementedRegistryConfigurationRequestCreateCapabilityId ===
        null && route.requiredHostRegistryConfigureCapabilityId === null &&
      route.hostRegistryConfigurationVerdict === null &&
      route.hostGovernanceTrustRootResolutionVerdict === null &&
      route.hostGovernanceAdmissionVerdict === null &&
      route.hostTrustAnchorProvisioned === false);
  return sourceExact && routeBoundary && receipt.status ===
      'HOST_REGISTRY_CONFIGURATION_REQUEST_ROUTING_AVAILABLE_WITHOUT_CONFIGURATION_ENDPOINT_TRANSPORT_ROOT_OR_AUTHORITY_EFFECTS' &&
    exact(receipt.configurationRequirements, requirements) &&
    exact(receipt.summary, expectedSummary(
      receipt.registryConfigurationRequestRoutes, requirements)) &&
    [NATIVE_EMISSION_MODE, MIGRATION_EMISSION_MODE]
      .includes(receipt.emission.mode) &&
    receipt.emission
      .sourceWasExactRetainedR110ResolutionPreflightContractMigration ===
        migration && exact(receipt.truth, expectedContractTruth());
}

export function
createLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestContractReceipt(
  creationContext, sourceContract, options = {}) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightContractReceiptValid(
      sourceContract) || !exact(creationContext, sourceContract.creationContext)) {
    throw new Error(
      'Registry configuration request routing needs the exact attached R110 preflight contract');
  }
  const routes = expectedRoutes(sourceContract);
  const requirements = expectedRequirements();
  const migration = options
    .sourceWasExactRetainedR110ResolutionPreflightContractMigration === true;
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    status:
      'HOST_REGISTRY_CONFIGURATION_REQUEST_ROUTING_AVAILABLE_WITHOUT_CONFIGURATION_ENDPOINT_TRANSPORT_ROOT_OR_AUTHORITY_EFFECTS',
    creationContext: clone(creationContext),
    source: sourceRef(sourceContract),
    registryConfigurationRequestRoutes: routes,
    configurationRequirements: requirements,
    summary: expectedSummary(routes, requirements),
    emission: {
      mode: migration ? MIGRATION_EMISSION_MODE : NATIVE_EMISSION_MODE,
      sourceWasExactRetainedR110ResolutionPreflightContractMigration: migration
    },
    truth: expectedContractTruth()
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestContractReceiptValid(
      receipt, sourceContract)) {
    throw new Error('Registry configuration request contract failed validation');
  }
  return receipt;
}

function expectedRequestedConfiguration(requirements) {
  return {
    requiredCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
    configurationOrigin: 'HOST_CONTROLLED_OUT_OF_BAND_CONFIGURATION',
    registryIdentifier: null,
    registryVersion: null,
    configuredTrustRootCount: 0,
    requirements: clone(requirements),
    candidateMaySatisfy: false,
    hostGovernanceAuthorityRequired: true,
    performed: false
  };
}

function expectedDelivery() {
  return {
    mode: 'NOT_TRANSMITTED_NO_HOST_CONFIGURATION_ENDPOINT',
    endpoint: null,
    transportReceipt: null,
    recipientIdentityAuthenticationVerdict: UNKNOWN
  };
}

function expectedPacketSummary(admissionRequest) {
  return {
    sourceR110ResolutionPreflightPacketCount: 1,
    sourceR109AdmissionRequestPacketCount: 1,
    admissionRequestEntryCount: admissionRequest.admissionRequests.length,
    hostRegistryConfigurationRequirementCount:
      expectedRequirements().length,
    transmittedRequestCount: 0,
    configuredHostRegistryCount: 0,
    configuredTrustRootCount: 0,
    resolvedHostGovernanceTrustRootCount: 0,
    verifiedPolicyKeyDelegationCount: 0,
    hostGovernanceAdmissionDecisionCount: 0,
    appliedReceiptSignerKeyBindingCount: 0,
    verifiedProvisioningReceiptCount: 0,
    hostTrustAnchorCount: 0,
    worldMutationCount: 0
  };
}

const expectedPacketTruth = () => ({
  exactR111ContractBound: true,
  exactR110FailClosedPreflightPacketBound: true,
  exactR109AdmissionRequestPacketBound: true,
  configurationRequestCreated: true,
  configurationRequestTransmitted: false,
  hostConfigurationEndpointKnown: false,
  hostRecipientIdentityAuthenticated: false,
  candidatePacketSuppliesHostRegistry: false,
  candidatePacketSuppliesTrustRoot: false,
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
landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestPacketValid(
  packet, contract = null, preflightContract = null,
  preflightPacket = null, admissionRequest = null) {
  if (!digestValid(packet,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_PACKET_SCHEMA) ||
      !exactKeys(packet, ['schema', 'status', 'configurationRequestId',
        'requestedAt', 'expiresAt', 'sourceContract',
        'sourceResolutionPreflightContract', 'sourceResolutionPreflightPacket',
        'sourceAdmissionRequestPacket', 'hostGovernanceTarget',
        'requestedConfiguration', 'delivery', 'summary', 'verdicts', 'truth',
        'digest']) ||
      !exactKeys(packet.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(packet.sourceResolutionPreflightContract,
        ['schema', 'receiptDigest']) ||
      !exactKeys(packet.sourceResolutionPreflightPacket,
        ['schema', 'receiptDigest']) ||
      !exactKeys(packet.sourceAdmissionRequestPacket,
        ['schema', 'receiptDigest']) ||
      !exactKeys(packet.hostGovernanceTarget, ['claimedGovernanceDomainId',
        'worldId', 'lineageId', 'hostRevision', 'worldDigest', 'status']) ||
      !exactKeys(packet.verdicts, ['configurationRequestCreationVerdict',
        'sourceResolutionPreflightVerdict', 'hostRegistryAvailabilityVerdict',
        'configurationRequestDeliveryVerdict',
        'hostRegistryConfigurationVerdict',
        'hostRegistryOriginAuthenticationVerdict',
        'hostGovernanceTrustRootResolutionVerdict',
        'policyKeyDelegationVerificationVerdict',
        'hostGovernanceAdmissionVerdict', 'receiptSignerKeyBindingVerdict',
        'provisioningReceiptVerificationVerdict',
        'hostTrustAnchorProvisioningVerdict'])) return false;
  const structural = packet.status ===
      'HOST_REGISTRY_CONFIGURATION_REQUEST_CREATED_NOT_TRANSMITTED' &&
    nonEmptyText(packet.configurationRequestId, 256) &&
    isoTimestamp(packet.requestedAt) && isoTimestamp(packet.expiresAt) &&
    Date.parse(packet.expiresAt) > Date.parse(packet.requestedAt) &&
    Date.parse(packet.expiresAt) - Date.parse(packet.requestedAt) <=
      MAXIMUM_REQUEST_LIFETIME_MS &&
    packet.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(packet.sourceContract.receiptDigest) &&
    packet.sourceResolutionPreflightContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(packet.sourceResolutionPreflightContract.receiptDigest) &&
    packet.sourceResolutionPreflightPacket.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_PACKET_SCHEMA &&
    fnvDigest(packet.sourceResolutionPreflightPacket.receiptDigest) &&
    packet.sourceAdmissionRequestPacket.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_PACKET_SCHEMA &&
    fnvDigest(packet.sourceAdmissionRequestPacket.receiptDigest) &&
    nonEmptyText(packet.hostGovernanceTarget.claimedGovernanceDomainId, 256) &&
    nonEmptyText(packet.hostGovernanceTarget.worldId, 256) &&
    nonEmptyText(packet.hostGovernanceTarget.lineageId, 512) &&
    Number.isInteger(packet.hostGovernanceTarget.hostRevision) &&
    packet.hostGovernanceTarget.hostRevision >= 0 &&
    hostWorldDigest(packet.hostGovernanceTarget.worldDigest) &&
    packet.hostGovernanceTarget.status ===
      'CALLER_NAMED_TARGET_NOT_AUTHENTICATED' &&
    exact(packet.requestedConfiguration,
      expectedRequestedConfiguration(expectedRequirements())) &&
    exact(packet.delivery, expectedDelivery()) &&
    exact(packet.verdicts, {
      configurationRequestCreationVerdict: 'PASS_TRANSIENT_REQUEST_CREATED',
      sourceResolutionPreflightVerdict: 'PASS_FAIL_CLOSED',
      hostRegistryAvailabilityVerdict: 'FAIL_NOT_CONFIGURED',
      configurationRequestDeliveryVerdict: 'NOT_PERFORMED',
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
  if (!preflightContract || !preflightPacket || !admissionRequest ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestContractReceiptValid(
        contract, preflightContract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightPacketValid(
        preflightPacket, preflightContract, admissionRequest) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestPacketValid(
        admissionRequest)) return false;
  return packet.sourceContract.receiptDigest === contract.digest &&
    packet.sourceResolutionPreflightContract.receiptDigest ===
      preflightContract.digest &&
    packet.sourceResolutionPreflightPacket.receiptDigest ===
      preflightPacket.digest &&
    packet.sourceAdmissionRequestPacket.receiptDigest ===
      admissionRequest.digest &&
    contract.source.receiptDigest === preflightContract.digest &&
    preflightPacket.sourceContract.receiptDigest === preflightContract.digest &&
    preflightPacket.sourceAdmissionRequestPacket.receiptDigest ===
      admissionRequest.digest &&
    Date.parse(packet.requestedAt) >= Date.parse(preflightPacket.evaluatedAt) &&
    Date.parse(packet.expiresAt) <= Date.parse(admissionRequest.expiresAt) &&
    exact(packet.hostGovernanceTarget, admissionRequest.hostGovernanceTarget) &&
    exact(packet.summary, expectedPacketSummary(admissionRequest));
}

export function
createLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestPacket(
  contract, preflightContract, preflightPacket, admissionRequest, input) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestContractReceiptValid(
      contract, preflightContract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightPacketValid(
        preflightPacket, preflightContract, admissionRequest) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestPacketValid(
        admissionRequest) ||
      !exactKeys(input,
        ['configurationRequestId', 'requestedAt', 'expiresAt'])) {
    throw new Error(
      'Registry configuration request needs exact R111/R110/R109 sources and bounded input without registry, root, endpoint, or transport material');
  }
  const packet = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_PACKET_SCHEMA,
    status: 'HOST_REGISTRY_CONFIGURATION_REQUEST_CREATED_NOT_TRANSMITTED',
    configurationRequestId: input.configurationRequestId,
    requestedAt: input.requestedAt,
    expiresAt: input.expiresAt,
    sourceContract: sourceRef(contract),
    sourceResolutionPreflightContract: sourceRef(preflightContract),
    sourceResolutionPreflightPacket: sourceRef(preflightPacket),
    sourceAdmissionRequestPacket: sourceRef(admissionRequest),
    hostGovernanceTarget: clone(admissionRequest.hostGovernanceTarget),
    requestedConfiguration:
      expectedRequestedConfiguration(contract.configurationRequirements),
    delivery: expectedDelivery(),
    summary: expectedPacketSummary(admissionRequest),
    verdicts: {
      configurationRequestCreationVerdict: 'PASS_TRANSIENT_REQUEST_CREATED',
      sourceResolutionPreflightVerdict: 'PASS_FAIL_CLOSED',
      hostRegistryAvailabilityVerdict: 'FAIL_NOT_CONFIGURED',
      configurationRequestDeliveryVerdict: 'NOT_PERFORMED',
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
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestPacketValid(
      packet, contract, preflightContract, preflightPacket,
      admissionRequest)) {
    throw new Error('Registry configuration request packet failed validation');
  }
  return packet;
}

export function
matrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestDescription() {
  return {
    contractReceiptSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    routeSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_ROUTE_SCHEMA,
    configurationRequirementSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUIREMENT_SCHEMA,
    requestPacketSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_PACKET_SCHEMA,
    configurationRequestCreateCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_CREATE_CAPABILITY_ID,
    requiredRegistryConfigureCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
    requiredTrustRootResolveCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
    status:
      'TRANSIENT_CONFIGURATION_REQUEST_AVAILABLE_NOT_TRANSMITTED_REGISTRY_AND_AUTHORITY_STILL_MISSING'
  };
}

