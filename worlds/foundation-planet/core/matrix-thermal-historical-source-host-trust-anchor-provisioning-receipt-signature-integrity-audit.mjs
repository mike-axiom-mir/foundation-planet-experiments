import {
  HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID
} from './matrix-thermal-historical-source-verifier-key-binding-authority-decision-integrity.mjs?v=0.107.0-r107.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_SCHEMA,
  landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningProposalContractReceiptValid
} from './matrix-thermal-historical-source-host-trust-anchor-provisioning-proposal.mjs?v=0.107.0-r107.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_ROUTE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_ENVELOPE_SCHEMA,
  HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID,
  HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNATURE_VERIFY_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signature-integrity.mjs?v=0.107.0-r107.1';

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
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA ||
      typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function expectedRoutes(sourceContract) {
  return sourceContract.hostTrustAnchorProvisioningProposalRoutes.map(
    sourceRoute => {
      const eligible =
        sourceRoute.eligibleForHostTrustAnchorProvisioningProposal === true;
      return {
        schema:
          LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_ROUTE_SCHEMA,
        routeId:
          `host-trust-anchor-provisioning-receipt-signature-integrity:${sourceRoute.routeId}`,
        sourceHostTrustAnchorProvisioningProposalRouteId: sourceRoute.routeId,
        requestBinding: clone(sourceRoute.requestBinding),
        eligibleForHostTrustAnchorProvisioningReceiptSignatureIntegrity:
          eligible,
        sourceHostTrustAnchorProvisioningProposalContractSchema: eligible
          ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_CONTRACT_RECEIPT_SCHEMA
          : null,
        hostTrustAnchorProvisioningProposalSchema: eligible
          ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_SCHEMA
          : null,
        hostTrustAnchorProvisioningReceiptEnvelopeSchema: eligible
          ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_ENVELOPE_SCHEMA
          : null,
        requiredHostTrustAnchorProvisionCapabilityId: eligible
          ? HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID : null,
        requiredHostTrustAnchorProvisionReceiptVerifyCapabilityId: eligible
          ? HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID : null,
        implementedHostTrustAnchorProvisionReceiptSignatureVerifyCapabilityId:
          eligible
            ? HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNATURE_VERIFY_CAPABILITY_ID
            : null,
        receiptSignatureIntegrityVerdict: eligible ? 'UNKNOWN' : null,
        receiptAuthorityVerdict: eligible ? 'UNKNOWN' : null,
        hostTrustAnchorProvisioningVerdict: eligible ? 'UNKNOWN' : null,
        hostAccepted: false,
        hostTrustAnchorProvisioned: false,
        callerSuppliedPolicyTrusted: false,
        trustedVerifierKeyBinding: null,
        admissionVerdict: eligible ? 'NOT_AUTHORIZED' : null
      };
    });
}

function expectedSummary(routes) {
  return {
    sourceR105HostTrustAnchorProvisioningProposalContractCount: 1,
    hostTrustAnchorProvisioningReceiptSignatureIntegrityRouteCount: 28,
    hostTrustAnchorProvisioningReceiptSignatureIntegrityEligibleRouteCount:
      routes.filter(route =>
        route.eligibleForHostTrustAnchorProvisioningReceiptSignatureIntegrity)
        .length,
    authorityReviewRouteExcludedCount: routes.filter(route =>
      !route.eligibleForHostTrustAnchorProvisioningReceiptSignatureIntegrity)
      .length,
    persistedHostReferenceCount: 0,
    persistedProvisioningProposalCount: 0,
    persistedProvisioningReceiptEnvelopeCount: 0,
    persistedProvisioningReceiptAssessmentCount: 0,
    persistedRawHostAuthorityPublicKeyCount: 0,
    persistedProvisioningReceiptSignatureCount: 0,
    hostAcceptedProposalCount: 0,
    hostTrustAnchorCount: 0,
    trustedPolicyCount: 0,
    trustedVerifierKeyBindingCount: 0,
    provisioningReceiptSignatureVerificationImplemented: true,
    provisioningReceiptVerificationImplemented: false,
    hostTrustAnchorProvisioningImplemented: false,
    replayLedgerImplemented: false,
    candidateAdmissionPathImplemented: false
  };
}

const expectedTruth = {
  exactR105HostTrustAnchorProvisioningProposalContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourReceiptSignatureIntegrityRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  exactProposalPolicyAndClaimedHostBindingRequired: true,
  detachedEd25519ProvisioningReceiptSignatureVerificationImplemented: true,
  callerSuppliedHostAuthorityKeyOnly: true,
  hostAuthorityKeyTrusted: false,
  provisioningReceiptVerificationImplemented: false,
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
  receiptEnvelopePersisted: false,
  receiptAssessmentPersisted: false,
  rawHostAuthorityPublicKeyPersisted: false,
  receiptSignatureBytesPersisted: false,
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
    id: 'land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signature-integrity-contract',
    required: true,
    status,
    statement: 'Exact R105 host-bound proposal routes gain detached provisioning-receipt signature integrity under a caller-supplied unauthenticated host key, while receipt authority, host acceptance, installation, policy trust, binding, persistence, admission, and world mutation remain unresolved.',
    detail
  };
}

export function
auditLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrityContract(
  column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land
    ?.matrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrityContractReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrityContractMigrationCheckpoint ===
        true;
    return result(checkpoint ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'the source lineage does not retain an exact R105 host-bound proposal contract'
        : 'a current loaded-land lineage is missing its R106 provisioning-receipt signature-integrity contract'
    });
  }
  const source =
    receipt.sourceHostTrustAnchorProvisioningProposalContract;
  const attachedSource = column.land
    ?.matrixThermalHistoricalSourceHostTrustAnchorProvisioningProposalContractReceipt;
  const sourceIntegrity =
    landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningProposalContractReceiptValid(
      source) && exact(source, attachedSource) && receipt.source?.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_CONTRACT_RECEIPT_SCHEMA &&
    receipt.source?.receiptDigest === source?.digest;
  const routes = sourceIntegrity ? expectedRoutes(source) : [];
  const routesExact = sourceIntegrity &&
    exact(receipt
      .hostTrustAnchorProvisioningReceiptSignatureIntegrityRoutes, routes);
  const summaryExact = routesExact &&
    exact(receipt.summary, expectedSummary(routes));
  const routeBoundaryIntact =
    receipt.hostTrustAnchorProvisioningReceiptSignatureIntegrityRoutes
      ?.length === 28 &&
    receipt.hostTrustAnchorProvisioningReceiptSignatureIntegrityRoutes
      .filter(route =>
        route.eligibleForHostTrustAnchorProvisioningReceiptSignatureIntegrity)
      .length === 24 &&
    receipt.hostTrustAnchorProvisioningReceiptSignatureIntegrityRoutes
      .filter(route =>
        !route.eligibleForHostTrustAnchorProvisioningReceiptSignatureIntegrity)
      .length === 4 &&
    receipt.hostTrustAnchorProvisioningReceiptSignatureIntegrityRoutes
      .every(route => route.hostAccepted === false &&
        route.hostTrustAnchorProvisioned === false &&
        route.callerSuppliedPolicyTrusted === false &&
        route.trustedVerifierKeyBinding === null);
  const capabilityBoundaryIntact =
    receipt.hostTrustAnchorProvisioningReceiptSignatureIntegrityRoutes
      .every(route =>
        route.eligibleForHostTrustAnchorProvisioningReceiptSignatureIntegrity
          ? route.requiredHostTrustAnchorProvisionCapabilityId ===
              HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID &&
            route.requiredHostTrustAnchorProvisionReceiptVerifyCapabilityId ===
              HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID &&
            route.implementedHostTrustAnchorProvisionReceiptSignatureVerifyCapabilityId ===
              HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNATURE_VERIFY_CAPABILITY_ID &&
            route.receiptSignatureIntegrityVerdict === 'UNKNOWN' &&
            route.receiptAuthorityVerdict === 'UNKNOWN' &&
            route.hostTrustAnchorProvisioningVerdict === 'UNKNOWN' &&
            route.admissionVerdict === 'NOT_AUTHORIZED'
          : route.requiredHostTrustAnchorProvisionCapabilityId === null &&
            route.requiredHostTrustAnchorProvisionReceiptVerifyCapabilityId ===
              null &&
            route.implementedHostTrustAnchorProvisionReceiptSignatureVerifyCapabilityId ===
              null && route.receiptSignatureIntegrityVerdict === null &&
            route.receiptAuthorityVerdict === null &&
            route.hostTrustAnchorProvisioningVerdict === null &&
            route.admissionVerdict === null);
  const persistenceBound = column.land
      ?.matrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrityContractMigrationCheckpoint ===
        false && column.budget
      ?.matrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrityContract
      ?.digest === receipt.digest;
  const structuralValid = digestValid(receipt) && sourceIntegrity &&
    exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
      'sourceHostTrustAnchorProvisioningProposalContract',
      'hostTrustAnchorProvisioningReceiptSignatureIntegrityRoutes',
      'summary', 'emission', 'truth', 'digest']) &&
    exact(receipt.creationContext, source?.creationContext) && routesExact &&
    summaryExact &&
    ['native-from-intact-r105-host-trust-anchor-provisioning-proposal-contract',
      'migration-from-exact-retained-r105-host-trust-anchor-provisioning-proposal-contract']
      .includes(receipt.emission?.mode) &&
    receipt.emission
      ?.sourceWasExactRetainedHostTrustAnchorProvisioningProposalContractMigration ===
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
    receiptSignatureIntegrityRouteCount: receipt.summary
      ?.hostTrustAnchorProvisioningReceiptSignatureIntegrityRouteCount ?? null,
    receiptSignatureIntegrityEligibleRouteCount: receipt.summary
      ?.hostTrustAnchorProvisioningReceiptSignatureIntegrityEligibleRouteCount ??
        null,
    authorityReviewRouteExcludedCount:
      receipt.summary?.authorityReviewRouteExcludedCount ?? null,
    persistedProvisioningReceiptEnvelopeCount: receipt.summary
      ?.persistedProvisioningReceiptEnvelopeCount ?? null,
    persistedProvisioningReceiptAssessmentCount: receipt.summary
      ?.persistedProvisioningReceiptAssessmentCount ?? null,
    hostAcceptedProposalCount:
      receipt.summary?.hostAcceptedProposalCount ?? null,
    hostTrustAnchorCount: receipt.summary?.hostTrustAnchorCount ?? null,
    trustedVerifierKeyBindingCount:
      receipt.summary?.trustedVerifierKeyBindingCount ?? null,
    emissionMode: receipt.emission?.mode || null,
    sourceHostTrustAnchorProvisioningProposalContractDigest:
      receipt.source?.receiptDigest || null,
    receiptDigest: receipt.digest || null
  });
}
