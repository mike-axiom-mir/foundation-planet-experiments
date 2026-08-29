import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA,
  HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityContractReceiptValid
} from './matrix-thermal-historical-source-verifier-key-binding-authority-decision-integrity.mjs?v=0.107.0-r107.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_ROUTE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_CLAIMED_HOST_REFERENCE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_SCHEMA,
  HOST_TRUST_ANCHOR_PROVISION_PROPOSAL_CREATE_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-trust-anchor-provisioning-proposal.mjs?v=0.107.0-r107.1';

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
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_CONTRACT_RECEIPT_SCHEMA ||
      typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function expectedRoutes(sourceContract) {
  return sourceContract.authorityDecisionIntegrityRoutes.map(sourceRoute => {
    const eligible = sourceRoute.eligibleForAuthorityDecisionIntegrity === true;
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_ROUTE_SCHEMA,
      routeId: `host-trust-anchor-provisioning-proposal:${sourceRoute.routeId}`,
      sourceAuthorityDecisionIntegrityRouteId: sourceRoute.routeId,
      requestBinding: clone(sourceRoute.requestBinding),
      eligibleForHostTrustAnchorProvisioningProposal: eligible,
      sourceAuthorityDecisionIntegrityContractSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA
        : null,
      callerSuppliedPolicyDescriptorSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA
        : null,
      claimedHostReferenceSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_CLAIMED_HOST_REFERENCE_SCHEMA
        : null,
      hostTrustAnchorProvisioningProposalSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_SCHEMA
        : null,
      requiredHostTrustAnchorProvisionCapabilityId: eligible
        ? HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID : null,
      implementedHostTrustAnchorProvisionProposalCreateCapabilityId: eligible
        ? HOST_TRUST_ANCHOR_PROVISION_PROPOSAL_CREATE_CAPABILITY_ID : null,
      hostTrustAnchorProvisioned: false,
      hostAccepted: false,
      callerSuppliedPolicyTrusted: false,
      trustedVerifierKeyBinding: null,
      hostTrustAnchorProvisioningVerdict: eligible ? 'UNKNOWN' : null,
      verifierKeyBindingVerdict: eligible ? 'UNKNOWN' : null,
      admissionVerdict: eligible ? 'NOT_AUTHORIZED' : null
    };
  });
}

function expectedSummary(routes) {
  return {
    sourceR104AuthorityDecisionIntegrityContractCount: 1,
    hostTrustAnchorProvisioningProposalRouteCount: 28,
    hostTrustAnchorProvisioningProposalEligibleRouteCount: routes.filter(route =>
      route.eligibleForHostTrustAnchorProvisioningProposal).length,
    authorityReviewRouteExcludedCount: routes.filter(route =>
      !route.eligibleForHostTrustAnchorProvisioningProposal).length,
    persistedClaimedHostReferenceCount: 0,
    persistedProvisioningProposalCount: 0,
    hostAcceptedProposalCount: 0,
    hostTrustAnchorCount: 0,
    trustedPolicyCount: 0,
    trustedVerifierKeyBindingCount: 0,
    provisioningProposalCreationImplemented: true,
    hostTrustAnchorProvisioningImplemented: false,
    hostAcceptanceVerificationImplemented: false,
    verifierKeyBindingImplemented: false,
    candidateAdmissionPathImplemented: false
  };
}

const expectedTruth = {
  exactR104AuthorityDecisionIntegrityContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourHostTrustAnchorProvisioningProposalRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  namedWorldHostReferenceShapeRequired: true,
  exactHostLineageRevisionAndDigestRequired: true,
  exactCallerSuppliedPolicyDigestAndKeyHashesRequired: true,
  hostTrustAnchorProvisioningProposalCreationImplemented: true,
  hostTrustAnchorProvisioningImplemented: false,
  hostIdentityAuthenticated: false,
  hostAuthorityToProvisionEstablished: false,
  hostAcceptanceVerified: false,
  callerSuppliedPolicyTrusted: false,
  trustedVerifierKeyBindingImplemented: false,
  verifierIdentityResolutionImplemented: false,
  verifierIndependenceVerificationImplemented: false,
  observationAuthenticityVerified: false,
  provenanceVerified: false,
  physicalMeaningReviewImplemented: false,
  evidenceVerified: false,
  proposalPersisted: false,
  hostTrustAnchorPersisted: false,
  replayLedgerImplemented: false,
  candidateAdmissionPathImplemented: false,
  admissionAuthorityGranted: false,
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
    id: 'land-matrix-thermal-historical-source-host-trust-anchor-provisioning-proposal-contract',
    required: true,
    status,
    statement: 'Exact R104 authority-decision integrity routes gain a transient named-world host-bound trust-anchor provisioning proposal, while host authentication, authority, acceptance, installation, policy trust, binding, persistence, admission, and world mutation remain unresolved.',
    detail
  };
}

export function
auditLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningProposalContract(
  column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land
    ?.matrixThermalHistoricalSourceHostTrustAnchorProvisioningProposalContractReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalHistoricalSourceHostTrustAnchorProvisioningProposalContractMigrationCheckpoint ===
        true;
    return result(checkpoint ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'the source lineage does not retain an exact R104 authority-decision integrity contract'
        : 'a current loaded-land lineage is missing its R105 host trust-anchor provisioning proposal contract'
    });
  }
  const source = receipt.sourceAuthorityDecisionIntegrityContract;
  const attachedSource = column.land
    ?.matrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityContractReceipt;
  const sourceIntegrity =
    landMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      source) && exact(source, attachedSource) &&
    receipt.source?.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    receipt.source?.receiptDigest === source?.digest;
  const routes = sourceIntegrity ? expectedRoutes(source) : [];
  const routesExact = sourceIntegrity &&
    exact(receipt.hostTrustAnchorProvisioningProposalRoutes, routes);
  const summaryExact = routesExact &&
    exact(receipt.summary, expectedSummary(routes));
  const routeBoundaryIntact =
    receipt.hostTrustAnchorProvisioningProposalRoutes?.length === 28 &&
    receipt.hostTrustAnchorProvisioningProposalRoutes.filter(route =>
      route.eligibleForHostTrustAnchorProvisioningProposal).length === 24 &&
    receipt.hostTrustAnchorProvisioningProposalRoutes.filter(route =>
      !route.eligibleForHostTrustAnchorProvisioningProposal).length === 4 &&
    receipt.hostTrustAnchorProvisioningProposalRoutes.every(route =>
      route.hostTrustAnchorProvisioned === false &&
      route.hostAccepted === false &&
      route.callerSuppliedPolicyTrusted === false &&
      route.trustedVerifierKeyBinding === null);
  const capabilityBoundaryIntact =
    receipt.hostTrustAnchorProvisioningProposalRoutes.every(route =>
      route.eligibleForHostTrustAnchorProvisioningProposal
        ? route.requiredHostTrustAnchorProvisionCapabilityId ===
            HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID &&
          route.implementedHostTrustAnchorProvisionProposalCreateCapabilityId ===
            HOST_TRUST_ANCHOR_PROVISION_PROPOSAL_CREATE_CAPABILITY_ID &&
          route.hostTrustAnchorProvisioningVerdict === 'UNKNOWN' &&
          route.verifierKeyBindingVerdict === 'UNKNOWN' &&
          route.admissionVerdict === 'NOT_AUTHORIZED'
        : route.requiredHostTrustAnchorProvisionCapabilityId === null &&
          route.implementedHostTrustAnchorProvisionProposalCreateCapabilityId ===
            null && route.hostTrustAnchorProvisioningVerdict === null &&
          route.verifierKeyBindingVerdict === null &&
          route.admissionVerdict === null);
  const persistenceBound = column.land
      ?.matrixThermalHistoricalSourceHostTrustAnchorProvisioningProposalContractMigrationCheckpoint ===
        false &&
    column.budget
      ?.matrixThermalHistoricalSourceHostTrustAnchorProvisioningProposalContract
      ?.digest === receipt.digest;
  const structuralValid = digestValid(receipt) && sourceIntegrity &&
    exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
      'sourceAuthorityDecisionIntegrityContract',
      'hostTrustAnchorProvisioningProposalRoutes', 'summary', 'emission',
      'truth', 'digest']) && exact(receipt.creationContext,
      source?.creationContext) && routesExact && summaryExact &&
    ['native-from-intact-r104-authority-decision-integrity-contract',
      'migration-from-exact-retained-r104-authority-decision-integrity-contract']
      .includes(receipt.emission?.mode) &&
    receipt.emission
      ?.sourceWasExactRetainedAuthorityDecisionIntegrityContractMigration ===
        receipt.emission?.mode.startsWith('migration-');
  const truthValid = exact(receipt.truth, expectedTruth);
  const valid = structuralValid && routeBoundaryIntact &&
    capabilityBoundaryIntact && truthValid && persistenceBound;
  return result(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt.schema || null,
    structuralValid,
    sourceIntegrity,
    routesExact,
    summaryExact,
    routeBoundaryIntact,
    capabilityBoundaryIntact,
    truthValid,
    persistenceBound,
    hostTrustAnchorProvisioningProposalRouteCount:
      receipt.summary?.hostTrustAnchorProvisioningProposalRouteCount ?? null,
    hostTrustAnchorProvisioningProposalEligibleRouteCount:
      receipt.summary?.hostTrustAnchorProvisioningProposalEligibleRouteCount ??
        null,
    authorityReviewRouteExcludedCount:
      receipt.summary?.authorityReviewRouteExcludedCount ?? null,
    persistedProvisioningProposalCount:
      receipt.summary?.persistedProvisioningProposalCount ?? null,
    hostAcceptedProposalCount:
      receipt.summary?.hostAcceptedProposalCount ?? null,
    hostTrustAnchorCount: receipt.summary?.hostTrustAnchorCount ?? null,
    trustedVerifierKeyBindingCount:
      receipt.summary?.trustedVerifierKeyBindingCount ?? null,
    emissionMode: receipt.emission?.mode || null,
    sourceAuthorityDecisionIntegrityContractDigest:
      receipt.source?.receiptDigest || null,
    receiptDigest: receipt.digest || null
  });
}
