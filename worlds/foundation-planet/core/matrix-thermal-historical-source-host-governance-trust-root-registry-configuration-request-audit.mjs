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
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_ROUTE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUIREMENT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_PACKET_SCHEMA,
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_CREATE_CAPABILITY_ID,
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-request.mjs?v=0.111.0-r111.1';

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
    verdict: 'UNKNOWN'
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
      hostRegistryConfigurationVerdict: eligible ? 'UNKNOWN' : null,
      hostGovernanceTrustRootResolutionVerdict: eligible ? 'UNKNOWN' : null,
      policyKeyDelegationVerificationVerdict: eligible ? 'UNKNOWN' : null,
      hostGovernanceAdmissionVerdict: eligible ? 'NOT_AUTHORIZED' : null,
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

const expectedTruth = {
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
};

function contractResult(status, detail) {
  return {
    id: 'land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-request-contract',
    required: true,
    status,
    statement: 'Exact R110 routes gain transient host registry configuration-request creation while the endpoint, transport, registry configuration, trust root, downstream authority, persistence, and mutation remain absent.',
    detail
  };
}

export function
auditLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestContract(
  column) {
  if (column?.kind !== 'land') {
    return contractResult('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land
    ?.matrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestContractReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestContractMigrationCheckpoint ===
        true;
    return contractResult(checkpoint ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'the source lineage does not retain an exact R110 preflight contract'
        : 'a current loaded-land lineage is missing its R111 registry configuration request contract'
    });
  }
  const attachedSource = column.land
    ?.matrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightContractReceipt;
  const sourceIntegrity =
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightContractReceiptValid(
      attachedSource) &&
    receipt.source?.schema === attachedSource?.schema &&
    receipt.source?.receiptDigest === attachedSource?.digest;
  const routes = sourceIntegrity ? expectedRoutes(attachedSource) : [];
  const requirements = expectedRequirements();
  const routesExact = sourceIntegrity &&
    exact(receipt.registryConfigurationRequestRoutes, routes);
  const requirementsExact =
    exact(receipt.configurationRequirements, requirements);
  const summaryExact = routesExact && requirementsExact &&
    exact(receipt.summary, expectedSummary(routes, requirements));
  const routeBoundaryIntact =
    receipt.registryConfigurationRequestRoutes?.length === 28 &&
    receipt.registryConfigurationRequestRoutes.filter(route =>
      route.eligibleForHostRegistryConfigurationRequest).length === 24 &&
    receipt.registryConfigurationRequestRoutes.filter(route =>
      !route.eligibleForHostRegistryConfigurationRequest).length === 4 &&
    receipt.registryConfigurationRequestRoutes.every(route =>
      route.hostTrustAnchorProvisioned === false);
  const capabilityBoundaryIntact =
    receipt.registryConfigurationRequestRoutes.every(route =>
      route.eligibleForHostRegistryConfigurationRequest
        ? route.implementedRegistryConfigurationRequestCreateCapabilityId ===
            HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_CREATE_CAPABILITY_ID &&
          route.requiredHostRegistryConfigureCapabilityId ===
            HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID &&
          route.requiredHostGovernanceTrustRootResolveCapabilityId ===
            HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID &&
          route.requiredPolicyKeyDelegationVerifyCapabilityId ===
            HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID &&
          route.requiredHostGovernanceTrustRootAdmissionDecideCapabilityId ===
            HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID &&
          route.hostRegistryConfigurationVerdict === 'UNKNOWN' &&
          route.hostGovernanceTrustRootResolutionVerdict === 'UNKNOWN' &&
          route.policyKeyDelegationVerificationVerdict === 'UNKNOWN' &&
          route.hostGovernanceAdmissionVerdict === 'NOT_AUTHORIZED'
        : route.implementedRegistryConfigurationRequestCreateCapabilityId ===
            null && route.requiredHostRegistryConfigureCapabilityId === null &&
          route.requiredHostGovernanceTrustRootResolveCapabilityId === null &&
          route.requiredPolicyKeyDelegationVerifyCapabilityId === null &&
          route.requiredHostGovernanceTrustRootAdmissionDecideCapabilityId ===
            null && route.hostRegistryConfigurationVerdict === null &&
          route.hostGovernanceTrustRootResolutionVerdict === null &&
          route.policyKeyDelegationVerificationVerdict === null &&
          route.hostGovernanceAdmissionVerdict === null);
  const persistenceBound = column.land
      ?.matrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestContractMigrationCheckpoint ===
        false && column.budget
      ?.matrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestContract
      ?.digest === receipt.digest;
  const structuralValid = digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_CONTRACT_RECEIPT_SCHEMA) &&
    exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
      'registryConfigurationRequestRoutes', 'configurationRequirements',
      'summary', 'emission', 'truth', 'digest']) &&
    receipt.status ===
      'HOST_REGISTRY_CONFIGURATION_REQUEST_ROUTING_AVAILABLE_WITHOUT_CONFIGURATION_ENDPOINT_TRANSPORT_ROOT_OR_AUTHORITY_EFFECTS' &&
    sourceIntegrity &&
    exact(receipt.creationContext, attachedSource?.creationContext) &&
    routesExact && requirementsExact && summaryExact &&
    ['native-from-intact-r110-trust-root-resolution-preflight-contract',
      'migration-from-exact-retained-r110-trust-root-resolution-preflight-contract']
      .includes(receipt.emission?.mode) &&
    receipt.emission
      ?.sourceWasExactRetainedR110ResolutionPreflightContractMigration ===
        receipt.emission?.mode.startsWith('migration-');
  const truthValid = exact(receipt.truth, expectedTruth);
  const valid = structuralValid && routeBoundaryIntact &&
    capabilityBoundaryIntact && truthValid && persistenceBound;
  return contractResult(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt.schema || null,
    structuralValid,
    sourceIntegrity,
    routesExact,
    requirementsExact,
    summaryExact,
    routeBoundaryIntact,
    capabilityBoundaryIntact,
    truthValid,
    persistenceBound,
    routeCount:
      receipt.summary?.hostRegistryConfigurationRequestRouteCount ?? null,
    eligibleRouteCount:
      receipt.summary?.hostRegistryConfigurationRequestEligibleRouteCount ??
        null,
    requirementCount:
      receipt.summary?.hostRegistryConfigurationRequirementCount ?? null,
    transmittedRequestCount:
      receipt.summary?.transmittedRegistryConfigurationRequestPacketCount ??
        null,
    configuredHostRegistryCount:
      receipt.summary?.configuredHostRegistryCount ?? null,
    emissionMode: receipt.emission?.mode || null,
    sourceR110ResolutionPreflightContractDigest:
      receipt.source?.receiptDigest || null,
    receiptDigest: receipt.digest || null
  });
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

const expectedDelivery = {
  mode: 'NOT_TRANSMITTED_NO_HOST_CONFIGURATION_ENDPOINT',
  endpoint: null,
  transportReceipt: null,
  recipientIdentityAuthenticationVerdict: 'UNKNOWN'
};

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

const expectedPacketTruth = {
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
};

function packetResult(status, detail) {
  return {
    id: 'land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-request-packet',
    required: true,
    status,
    statement: 'A transient R111 request binds exact R110/R109 sources and remains untransmitted with no registry, root, endpoint, transport receipt, authority effect, persistence, or mutation.',
    detail
  };
}

export function
auditLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestPacket(
  packet, contract, preflightContract, preflightPacket, admissionRequest) {
  const sourceIntegrity =
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightContractReceiptValid(
      preflightContract) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightPacketValid(
      preflightPacket, preflightContract, admissionRequest) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestPacketValid(
      admissionRequest) &&
    contract?.source?.receiptDigest === preflightContract.digest;
  const requirements = expectedRequirements();
  const contractIntegrity = sourceIntegrity &&
    digestValid(contract,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_CONTRACT_RECEIPT_SCHEMA) &&
    exact(contract.registryConfigurationRequestRoutes,
      expectedRoutes(preflightContract)) &&
    exact(contract.configurationRequirements, requirements) &&
    exact(contract.truth, expectedTruth);
  const sourceBindingsExact = contractIntegrity &&
    exact(packet?.sourceContract, sourceRef(contract)) &&
    exact(packet?.sourceResolutionPreflightContract,
      sourceRef(preflightContract)) &&
    exact(packet?.sourceResolutionPreflightPacket, sourceRef(preflightPacket)) &&
    exact(packet?.sourceAdmissionRequestPacket, sourceRef(admissionRequest));
  const timingValid = Number.isFinite(Date.parse(packet?.requestedAt)) &&
    Number.isFinite(Date.parse(packet?.expiresAt)) &&
    Date.parse(packet.requestedAt) >= Date.parse(preflightPacket.evaluatedAt) &&
    Date.parse(packet.expiresAt) > Date.parse(packet.requestedAt) &&
    Date.parse(packet.expiresAt) <= Date.parse(admissionRequest.expiresAt) &&
    Date.parse(packet.expiresAt) - Date.parse(packet.requestedAt) <=
      15 * 60 * 1000;
  const requestBoundaryExact = exact(packet?.requestedConfiguration,
    expectedRequestedConfiguration(requirements)) &&
    exact(packet?.delivery, expectedDelivery) &&
    exact(packet?.summary, expectedPacketSummary(admissionRequest)) &&
    exact(packet?.verdicts, {
      configurationRequestCreationVerdict: 'PASS_TRANSIENT_REQUEST_CREATED',
      sourceResolutionPreflightVerdict: 'PASS_FAIL_CLOSED',
      hostRegistryAvailabilityVerdict: 'FAIL_NOT_CONFIGURED',
      configurationRequestDeliveryVerdict: 'NOT_PERFORMED',
      hostRegistryConfigurationVerdict: 'UNKNOWN',
      hostRegistryOriginAuthenticationVerdict: 'UNKNOWN',
      hostGovernanceTrustRootResolutionVerdict: 'UNKNOWN',
      policyKeyDelegationVerificationVerdict: 'UNKNOWN',
      hostGovernanceAdmissionVerdict: 'NOT_AUTHORIZED',
      receiptSignerKeyBindingVerdict: 'UNKNOWN',
      provisioningReceiptVerificationVerdict: 'UNKNOWN',
      hostTrustAnchorProvisioningVerdict: 'UNKNOWN'
    }) && exact(packet?.truth, expectedPacketTruth);
  const structuralValid = digestValid(packet,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_PACKET_SCHEMA) &&
    packet.status ===
      'HOST_REGISTRY_CONFIGURATION_REQUEST_CREATED_NOT_TRANSMITTED' &&
    exact(packet.hostGovernanceTarget, admissionRequest.hostGovernanceTarget);
  const valid = structuralValid && contractIntegrity && sourceBindingsExact &&
    timingValid && requestBoundaryExact;
  return packetResult(valid ? 'PASS' : 'FAIL', {
    structuralValid,
    contractIntegrity,
    sourceBindingsExact,
    timingValid,
    requestBoundaryExact,
    deliveryMode: packet?.delivery?.mode || null,
    configuredTrustRootCount:
      packet?.requestedConfiguration?.configuredTrustRootCount ?? null,
    packetDigest: packet?.digest || null
  });
}

