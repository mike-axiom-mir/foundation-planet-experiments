import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_PACKET_SCHEMA,
  HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
  HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestContractReceiptValid
} from './matrix-thermal-historical-source-host-governance-trust-root-admission-request.mjs?v=0.110.0-r110.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_ROUTE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_BOUNDARY_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_PACKET_SCHEMA,
  HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-root-resolution-preflight.mjs?v=0.110.0-r110.1';

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

function digestValid(value) {
  if (value?.schema !==
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA ||
      typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

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
    originAuthenticationVerdict: 'UNKNOWN'
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
        hostGovernanceTrustRootResolutionVerdict: eligible ? 'UNKNOWN' : null,
        policyKeyDelegationVerificationVerdict: eligible ? 'UNKNOWN' : null,
        hostGovernanceAdmissionVerdict: eligible ? 'NOT_AUTHORIZED' : null,
        receiptSignerKeyBindingVerdict: eligible ? 'UNKNOWN' : null,
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

const expectedTruth = {
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
};

function result(status, detail) {
  return {
    id: 'land-matrix-thermal-historical-source-host-governance-trust-root-resolution-preflight-contract',
    required: true,
    status,
    statement: 'Exact R109 routes gain a fail-closed trust-root resolution preflight with an out-of-band registry boundary, while the registry, root resolution, host identity, delegations, admission, binding, verification, provisioning, persistence, and mutation remain unresolved.',
    detail
  };
}

export function
auditLandMatrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightContract(
  column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land
    ?.matrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightContractReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightContractMigrationCheckpoint ===
        true;
    return result(checkpoint ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'the source lineage does not retain an exact R109 admission request contract'
        : 'a current loaded-land lineage is missing its R110 trust-root resolution preflight contract'
    });
  }
  const attachedSource = column.land
    ?.matrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestContractReceipt;
  const sourceIntegrity =
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestContractReceiptValid(
      attachedSource) &&
    receipt.source?.schema === attachedSource?.schema &&
    receipt.source?.receiptDigest === attachedSource?.digest;
  const routes = sourceIntegrity ? expectedRoutes(attachedSource) : [];
  const routesExact = sourceIntegrity &&
    exact(receipt.resolutionPreflightRoutes, routes);
  const registryBoundaryExact =
    exact(receipt.registryBoundary, expectedRegistryBoundary());
  const summaryExact = routesExact &&
    exact(receipt.summary, expectedSummary(routes));
  const routeBoundaryIntact =
    receipt.resolutionPreflightRoutes?.length === 28 &&
    receipt.resolutionPreflightRoutes.filter(route =>
      route.eligibleForHostGovernanceTrustRootResolutionPreflight)
      .length === 24 &&
    receipt.resolutionPreflightRoutes.filter(route =>
      !route.eligibleForHostGovernanceTrustRootResolutionPreflight)
      .length === 4 &&
    receipt.resolutionPreflightRoutes.every(route =>
      route.hostTrustAnchorProvisioned === false);
  const capabilityBoundaryIntact =
    receipt.resolutionPreflightRoutes.every(route =>
      route.eligibleForHostGovernanceTrustRootResolutionPreflight
        ? route.implementedResolutionPreflightCapabilityId ===
            HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_CAPABILITY_ID &&
          route.requiredHostGovernanceTrustRootResolveCapabilityId ===
            HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID &&
          route.requiredPolicyKeyDelegationVerifyCapabilityId ===
            HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID &&
          route.requiredHostGovernanceTrustRootAdmissionDecideCapabilityId ===
            HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID &&
          route.hostRegistryConfigurationVerdict ===
            'FAIL_NOT_CONFIGURED' &&
          route.hostGovernanceTrustRootResolutionVerdict === 'UNKNOWN' &&
          route.policyKeyDelegationVerificationVerdict === 'UNKNOWN' &&
          route.hostGovernanceAdmissionVerdict === 'NOT_AUTHORIZED' &&
          route.receiptSignerKeyBindingVerdict === 'UNKNOWN'
        : route.implementedResolutionPreflightCapabilityId === null &&
          route.requiredHostGovernanceTrustRootResolveCapabilityId === null &&
          route.requiredPolicyKeyDelegationVerifyCapabilityId === null &&
          route.requiredHostGovernanceTrustRootAdmissionDecideCapabilityId ===
            null && route.hostRegistryConfigurationVerdict === null &&
          route.hostGovernanceTrustRootResolutionVerdict === null &&
          route.policyKeyDelegationVerificationVerdict === null &&
          route.hostGovernanceAdmissionVerdict === null &&
          route.receiptSignerKeyBindingVerdict === null);
  const persistenceBound = column.land
      ?.matrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightContractMigrationCheckpoint ===
        false && column.budget
      ?.matrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightContract
      ?.digest === receipt.digest;
  const structuralValid = digestValid(receipt) && sourceIntegrity &&
    exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
      'resolutionPreflightRoutes', 'registryBoundary', 'summary', 'emission',
      'truth', 'digest']) &&
    receipt.status ===
      'HOST_GOVERNANCE_TRUST_ROOT_RESOLUTION_PREFLIGHT_AVAILABLE_REGISTRY_NOT_CONFIGURED' &&
    exact(receipt.creationContext, attachedSource?.creationContext) &&
    routesExact &&
    registryBoundaryExact && summaryExact &&
    ['native-from-intact-r109-host-governance-admission-request-contract',
      'migration-from-exact-retained-r109-host-governance-admission-request-contract']
      .includes(receipt.emission?.mode) &&
    receipt.emission
      ?.sourceWasExactRetainedR109AdmissionRequestContractMigration ===
        receipt.emission?.mode.startsWith('migration-');
  const truthValid = exact(receipt.truth, expectedTruth);
  const valid = structuralValid && routeBoundaryIntact &&
    capabilityBoundaryIntact && truthValid && persistenceBound;
  return result(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt.schema || null,
    structuralValid,
    sourceIntegrity,
    routesExact,
    registryBoundaryExact,
    summaryExact,
    routeBoundaryIntact,
    capabilityBoundaryIntact,
    truthValid,
    persistenceBound,
    preflightRouteCount:
      receipt.summary?.hostGovernanceTrustRootResolutionPreflightRouteCount ??
        null,
    eligiblePreflightRouteCount:
      receipt.summary
        ?.hostGovernanceTrustRootResolutionPreflightEligibleRouteCount ?? null,
    configuredHostRegistryCount:
      receipt.summary?.configuredHostRegistryCount ?? null,
    resolvedHostGovernanceTrustRootCount:
      receipt.summary?.resolvedHostGovernanceTrustRootCount ?? null,
    emissionMode: receipt.emission?.mode || null,
    sourceR109AdmissionRequestContractDigest:
      receipt.source?.receiptDigest || null,
    receiptDigest: receipt.digest || null
  });
}
