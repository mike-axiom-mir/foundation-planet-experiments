import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_PACKET_SCHEMA,
  HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
  HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestContractReceiptValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestPacketValid
} from './matrix-thermal-historical-source-host-governance-trust-root-admission-request.mjs?v=0.110.0-r110.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-resolution-preflight-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_ROUTE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-resolution-preflight-route/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_BOUNDARY_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-boundary/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_PACKET_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-resolution-preflight-packet/v1';

export const HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_CAPABILITY_ID =
  'authority.host-governance.trust-root.resolution.preflight';

const UNKNOWN = 'UNKNOWN';
const NOT_AUTHORIZED = 'NOT_AUTHORIZED';
const NATIVE_EMISSION_MODE =
  'native-from-intact-r109-host-governance-admission-request-contract';
const MIGRATION_EMISSION_MODE =
  'migration-from-exact-retained-r109-host-governance-admission-request-contract';
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

function expectedRegistryBoundary() {
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_BOUNDARY_SCHEMA,
    boundaryId:
      'foundation-planet-r110-host-governance-trust-root-registry',
    configurationOrigin: 'HOST_CONTROLLED_OUT_OF_BAND_CONFIGURATION',
    configurationStatus: 'NOT_CONFIGURED',
    registryIdentifier: null,
    registryVersion: null,
    configuredTrustRootCount: 0,
    candidateRequestMaySupplyRegistry: false,
    candidateRequestMaySupplyTrustRoot: false,
    foundationWorldStateMayPersistRegistry: false,
    originAuthenticationVerdict: UNKNOWN
  };
}

function expectedRoutes(sourceContract) {
  return sourceContract.hostGovernanceTrustRootAdmissionRoutes.map(
    sourceRoute => {
      const eligible = sourceRoute
        .eligibleForHostGovernanceTrustRootAdmissionRequest === true;
      return {
        schema:
          LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_ROUTE_SCHEMA,
        routeId:
          `host-governance-trust-root-resolution-preflight:${sourceRoute.routeId}`,
        sourceAdmissionRouteId: sourceRoute.routeId,
        requestBinding: clone(sourceRoute.requestBinding),
        eligibleForHostGovernanceTrustRootResolutionPreflight: eligible,
        sourceAdmissionRequestPacketSchema: eligible
          ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_PACKET_SCHEMA
          : null,
        resolutionPreflightPacketSchema: eligible
          ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_PACKET_SCHEMA
          : null,
        implementedResolutionPreflightCapabilityId: eligible
          ? HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_CAPABILITY_ID
          : null,
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
        hostRegistryConfigurationVerdict: eligible
          ? 'FAIL_NOT_CONFIGURED' : null,
        hostGovernanceTrustRootResolutionVerdict: eligible ? UNKNOWN : null,
        policyKeyDelegationVerificationVerdict: eligible ? UNKNOWN : null,
        hostGovernanceAdmissionVerdict: eligible ? NOT_AUTHORIZED : null,
        receiptSignerKeyBindingVerdict: eligible ? UNKNOWN : null,
        hostTrustAnchorProvisioned: false
      };
    });
}

function expectedSummary(routes) {
  const eligible = routes.filter(route =>
    route.eligibleForHostGovernanceTrustRootResolutionPreflight).length;
  return {
    sourceR109AdmissionRequestContractCount: 1,
    hostGovernanceTrustRootResolutionPreflightRouteCount: routes.length,
    hostGovernanceTrustRootResolutionPreflightEligibleRouteCount: eligible,
    authorityReviewRouteExcludedCount: routes.length - eligible,
    implementedResolutionPreflightRouteCount: eligible,
    hostRegistryBoundaryCount: 1,
    configuredHostRegistryCount: 0,
    configuredTrustRootCount: 0,
    persistedResolutionPreflightPacketCount: 0,
    resolvedHostGovernanceTrustRootCount: 0,
    verifiedPolicyKeyDelegationCount: 0,
    hostGovernanceAdmissionDecisionCount: 0,
    trustedReceiptSignerKeyBindingCount: 0,
    verifiedProvisioningReceiptCount: 0,
    hostTrustAnchorCount: 0,
    resolutionPreflightImplemented: true,
    hostGovernanceTrustRootResolutionImplemented: false,
    policyKeyDelegationVerificationImplemented: false,
    hostGovernanceTrustRootAdmissionDecisionImplemented: false,
    receiptSignerKeyBindingImplemented: false,
    provisioningReceiptVerificationImplemented: false,
    hostTrustAnchorProvisioningImplemented: false
  };
}

const expectedContractTruth = () => ({
  exactR109AdmissionRequestContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourResolutionPreflightRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  exactR109AdmissionRequestPacketRequired: true,
  resolutionPreflightImplemented: true,
  hostRegistryBoundaryDeclared: true,
  hostRegistryMustBeConfiguredOutOfBand: true,
  candidatePacketMaySupplyHostRegistry: false,
  candidatePacketMaySupplyTrustRoot: false,
  foundationWorldStateMayPersistHostRegistry: false,
  hostRegistryConfigured: false,
  hostRegistryOriginAuthenticated: false,
  hostGovernanceTrustRootResolved: false,
  hostIdentityAuthenticated: false,
  policyKeyDelegationVerified: false,
  hostGovernanceAdmissionDecisionImplemented: false,
  hostGovernanceAdmissionAuthorized: false,
  receiptSignerKeyBindingImplemented: false,
  provisioningReceiptVerified: false,
  hostAuthorityToProvisionEstablished: false,
  hostAccepted: false,
  hostTrustAnchorProvisioned: false,
  trustedVerifierKeyBindingImplemented: false,
  observationAuthenticityVerified: false,
  evidenceVerified: false,
  resolutionPreflightPacketPersisted: false,
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
landMatrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightContractReceiptValid(
  receipt, sourceContract = null) {
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
        'resolutionPreflightRoutes', 'registryBoundary', 'summary',
        'emission', 'truth', 'digest']) ||
      !exactKeys(receipt.source, ['schema', 'receiptDigest']) ||
      !exactKeys(receipt.emission, ['mode',
        'sourceWasExactRetainedR109AdmissionRequestContractMigration']) ||
      receipt.source.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_CONTRACT_RECEIPT_SCHEMA ||
      !fnvDigest(receipt.source.receiptDigest) ||
      !Array.isArray(receipt.resolutionPreflightRoutes) ||
      receipt.resolutionPreflightRoutes.length !== 28) return false;
  const routes = sourceContract === null
    ? receipt.resolutionPreflightRoutes : expectedRoutes(sourceContract);
  const migration = receipt.emission.mode === MIGRATION_EMISSION_MODE;
  const sourceExact = sourceContract === null ||
    (landMatrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestContractReceiptValid(
      sourceContract) &&
      exact(receipt.creationContext, sourceContract.creationContext) &&
      exact(receipt.source, sourceRef(sourceContract)) &&
      exact(receipt.resolutionPreflightRoutes, routes));
  const eligible = receipt.resolutionPreflightRoutes.filter(route =>
    route?.eligibleForHostGovernanceTrustRootResolutionPreflight === true);
  const excluded = receipt.resolutionPreflightRoutes.filter(route =>
    route?.eligibleForHostGovernanceTrustRootResolutionPreflight === false);
  const routeBoundary = eligible.length === 24 && excluded.length === 4 &&
    new Set(receipt.resolutionPreflightRoutes.map(route => route?.routeId))
      .size === 28 &&
    eligible.every(route => route.schema ===
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_ROUTE_SCHEMA &&
      route.implementedResolutionPreflightCapabilityId ===
        HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_CAPABILITY_ID &&
      route.requiredHostGovernanceTrustRootResolveCapabilityId ===
        HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID &&
      route.hostRegistryConfigurationVerdict === 'FAIL_NOT_CONFIGURED' &&
      route.hostGovernanceTrustRootResolutionVerdict === UNKNOWN &&
      route.hostGovernanceAdmissionVerdict === NOT_AUTHORIZED &&
      route.hostTrustAnchorProvisioned === false) &&
    excluded.every(route => route.schema ===
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_ROUTE_SCHEMA &&
      route.implementedResolutionPreflightCapabilityId === null &&
      route.requiredHostGovernanceTrustRootResolveCapabilityId === null &&
      route.hostRegistryConfigurationVerdict === null &&
      route.hostGovernanceTrustRootResolutionVerdict === null &&
      route.hostGovernanceAdmissionVerdict === null &&
      route.hostTrustAnchorProvisioned === false);
  return sourceExact && routeBoundary && receipt.status ===
      'HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_AVAILABLE_REGISTRY_NOT_CONFIGURED' &&
    exact(receipt.registryBoundary, expectedRegistryBoundary()) &&
    exact(receipt.summary,
      expectedSummary(receipt.resolutionPreflightRoutes)) &&
    [NATIVE_EMISSION_MODE, MIGRATION_EMISSION_MODE]
      .includes(receipt.emission.mode) &&
    receipt.emission
      .sourceWasExactRetainedR109AdmissionRequestContractMigration ===
        migration && exact(receipt.truth, expectedContractTruth());
}

export function
createLandMatrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightContractReceipt(
  creationContext, sourceContract, options = {}) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestContractReceiptValid(
      sourceContract) || !exact(creationContext, sourceContract.creationContext)) {
    throw new Error(
      'Trust-root resolution preflight needs the exact attached R109 admission request contract');
  }
  const routes = expectedRoutes(sourceContract);
  const migration = options
    .sourceWasExactRetainedR109AdmissionRequestContractMigration === true;
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
    status:
      'HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_AVAILABLE_REGISTRY_NOT_CONFIGURED',
    creationContext: clone(creationContext),
    source: sourceRef(sourceContract),
    resolutionPreflightRoutes: routes,
    registryBoundary: expectedRegistryBoundary(),
    summary: expectedSummary(routes),
    emission: {
      mode: migration ? MIGRATION_EMISSION_MODE : NATIVE_EMISSION_MODE,
      sourceWasExactRetainedR109AdmissionRequestContractMigration: migration
    },
    truth: expectedContractTruth()
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightContractReceiptValid(
      receipt, sourceContract)) {
    throw new Error('Trust-root resolution preflight contract failed validation');
  }
  return receipt;
}

function expectedRequiredHostAction() {
  return {
    capabilityId: HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
    action: 'CONFIGURE_AND_AUTHENTICATE_HOST_CONTROLLED_TRUST_ROOT_REGISTRY',
    requiredConfigurationOrigin:
      'HOST_CONTROLLED_OUT_OF_BAND_CONFIGURATION',
    candidateMaySatisfy: false,
    hostGovernanceAuthorityRequired: true,
    performed: false
  };
}

function expectedPreflightSummary(admissionRequest) {
  return {
    sourceR109AdmissionRequestPacketCount: 1,
    admissionRequestEntryCount: admissionRequest.admissionRequests.length,
    hostRegistryBoundaryCount: 1,
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

const expectedPreflightTruth = () => ({
  exactR110ContractBound: true,
  exactR109AdmissionRequestPacketBound: true,
  sourceR109VerdictTreatedAsReportedUntrusted: true,
  hostRegistryBoundaryEvaluated: true,
  hostRegistryConfigured: false,
  hostRegistryOriginAuthenticated: false,
  candidatePacketSuppliesHostRegistry: false,
  candidatePacketSuppliesTrustRoot: false,
  hostGovernanceTrustRootResolved: false,
  hostIdentityAuthenticated: false,
  policyKeyDelegationVerified: false,
  hostGovernanceAdmissionAuthorized: false,
  receiptSignerKeyBound: false,
  provisioningReceiptVerified: false,
  hostTrustAnchorProvisioned: false,
  persisted: false,
  worldMutationPerformed: false
});

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightPacketValid(
  packet, contract = null, admissionRequest = null) {
  if (!digestValid(packet,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_PACKET_SCHEMA) ||
      !exactKeys(packet, ['schema', 'status', 'preflightId', 'evaluatedAt',
        'sourceContract', 'sourceAdmissionRequestPacket',
        'hostGovernanceTarget', 'registryBoundary', 'requiredHostAction',
        'summary', 'verdicts', 'truth', 'digest']) ||
      !exactKeys(packet.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(packet.sourceAdmissionRequestPacket,
        ['schema', 'receiptDigest']) ||
      !exactKeys(packet.hostGovernanceTarget, ['claimedGovernanceDomainId',
        'worldId', 'lineageId', 'hostRevision', 'worldDigest', 'status']) ||
      !exactKeys(packet.verdicts, ['resolutionPreflightVerdict',
        'sourceAdmissionRequestVerdict', 'hostRegistryAvailabilityVerdict',
        'hostRegistryOriginAuthenticationVerdict',
        'hostGovernanceTrustRootResolutionVerdict',
        'hostIdentityAuthenticationVerdict',
        'policyKeyDelegationVerificationVerdict',
        'hostGovernanceAdmissionVerdict', 'receiptSignerKeyBindingVerdict',
        'provisioningReceiptVerificationVerdict',
        'hostTrustAnchorProvisioningVerdict'])) return false;
  const structural = packet.status ===
      'BLOCKED_HOST_TRUST_ROOT_REGISTRY_NOT_CONFIGURED' &&
    nonEmptyText(packet.preflightId, 256) && isoTimestamp(packet.evaluatedAt) &&
    packet.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(packet.sourceContract.receiptDigest) &&
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
    exact(packet.registryBoundary, expectedRegistryBoundary()) &&
    exact(packet.requiredHostAction, expectedRequiredHostAction()) &&
    exact(packet.verdicts, {
      resolutionPreflightVerdict: 'PASS_FAIL_CLOSED',
      sourceAdmissionRequestVerdict:
        'STRUCTURAL_PASS_REPORTED_SOURCES_UNTRUSTED',
      hostRegistryAvailabilityVerdict: 'FAIL_NOT_CONFIGURED',
      hostRegistryOriginAuthenticationVerdict: UNKNOWN,
      hostGovernanceTrustRootResolutionVerdict: UNKNOWN,
      hostIdentityAuthenticationVerdict: UNKNOWN,
      policyKeyDelegationVerificationVerdict: UNKNOWN,
      hostGovernanceAdmissionVerdict: NOT_AUTHORIZED,
      receiptSignerKeyBindingVerdict: UNKNOWN,
      provisioningReceiptVerificationVerdict: UNKNOWN,
      hostTrustAnchorProvisioningVerdict: UNKNOWN
    }) && exact(packet.truth, expectedPreflightTruth());
  if (!structural || contract === null) return structural;
  if (!admissionRequest ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightContractReceiptValid(
        contract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestPacketValid(
        admissionRequest)) return false;
  return packet.sourceContract.receiptDigest === contract.digest &&
    packet.sourceAdmissionRequestPacket.receiptDigest ===
      admissionRequest.digest &&
    admissionRequest.sourceContract.receiptDigest ===
      contract.source.receiptDigest &&
    Date.parse(packet.evaluatedAt) >= Date.parse(admissionRequest.issuedAt) &&
    Date.parse(packet.evaluatedAt) <= Date.parse(admissionRequest.expiresAt) &&
    exact(packet.hostGovernanceTarget,
      admissionRequest.hostGovernanceTarget) &&
    exact(packet.summary, expectedPreflightSummary(admissionRequest));
}

export function
createLandMatrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightPacket(
  contract, admissionRequest, input) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightContractReceiptValid(
      contract) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestPacketValid(
        admissionRequest) ||
      !exactKeys(input, ['preflightId', 'evaluatedAt'])) {
    throw new Error(
      'Trust-root resolution preflight needs exact R110/R109 sources and bounded input without registry or root material');
  }
  const packet = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_PACKET_SCHEMA,
    status: 'BLOCKED_HOST_TRUST_ROOT_REGISTRY_NOT_CONFIGURED',
    preflightId: input.preflightId,
    evaluatedAt: input.evaluatedAt,
    sourceContract: sourceRef(contract),
    sourceAdmissionRequestPacket: sourceRef(admissionRequest),
    hostGovernanceTarget: clone(admissionRequest.hostGovernanceTarget),
    registryBoundary: expectedRegistryBoundary(),
    requiredHostAction: expectedRequiredHostAction(),
    summary: expectedPreflightSummary(admissionRequest),
    verdicts: {
      resolutionPreflightVerdict: 'PASS_FAIL_CLOSED',
      sourceAdmissionRequestVerdict:
        'STRUCTURAL_PASS_REPORTED_SOURCES_UNTRUSTED',
      hostRegistryAvailabilityVerdict: 'FAIL_NOT_CONFIGURED',
      hostRegistryOriginAuthenticationVerdict: UNKNOWN,
      hostGovernanceTrustRootResolutionVerdict: UNKNOWN,
      hostIdentityAuthenticationVerdict: UNKNOWN,
      policyKeyDelegationVerificationVerdict: UNKNOWN,
      hostGovernanceAdmissionVerdict: NOT_AUTHORIZED,
      receiptSignerKeyBindingVerdict: UNKNOWN,
      provisioningReceiptVerificationVerdict: UNKNOWN,
      hostTrustAnchorProvisioningVerdict: UNKNOWN
    },
    truth: expectedPreflightTruth()
  };
  packet.digest = stableDigest(packet);
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightPacketValid(
      packet, contract, admissionRequest)) {
    throw new Error('Trust-root resolution preflight packet failed validation');
  }
  return packet;
}

export function
matrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightDescription() {
  return {
    contractReceiptSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
    routeSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_ROUTE_SCHEMA,
    registryBoundarySchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_BOUNDARY_SCHEMA,
    preflightPacketSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_PACKET_SCHEMA,
    resolutionPreflightCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_CAPABILITY_ID,
    requiredTrustRootResolveCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
    requiredPolicyKeyDelegationVerifyCapabilityId:
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
    requiredAdmissionDecideCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID,
    status:
      'FAIL_CLOSED_PREFLIGHT_AVAILABLE_HOST_REGISTRY_NOT_CONFIGURED_NO_AUTHORITY_EFFECTS'
  };
}
