import {
  HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID
} from './matrix-thermal-historical-source-verifier-key-binding-authority-decision-integrity.mjs?v=0.107.0-r107.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_ENVELOPE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_ASSESSMENT_SCHEMA,
  HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrityContractReceiptValid
} from './matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signature-integrity.mjs?v=0.107.0-r107.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_ROUTE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA,
  HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_REQUEST_CREATE_CAPABILITY_ID,
  HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-request.mjs?v=0.107.0-r107.1';

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
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA ||
      typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function expectedRoutes(sourceContract) {
  return sourceContract
    .hostTrustAnchorProvisioningReceiptSignatureIntegrityRoutes.map(
      sourceRoute => {
        const eligible = sourceRoute
          .eligibleForHostTrustAnchorProvisioningReceiptSignatureIntegrity ===
            true;
        return {
          schema:
            LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_ROUTE_SCHEMA,
          routeId:
            `host-provisioning-receipt-signer-key-binding:${sourceRoute.routeId}`,
          sourceReceiptSignatureIntegrityRouteId: sourceRoute.routeId,
          requestBinding: clone(sourceRoute.requestBinding),
          eligibleForReceiptSignerKeyBindingRequest: eligible,
          sourceReceiptEnvelopeSchema: eligible
            ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_ENVELOPE_SCHEMA
            : null,
          sourceReceiptSignatureIntegrityAssessmentSchema: eligible
            ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_ASSESSMENT_SCHEMA
            : null,
          receiptSignerKeyBindingRequestSchema: eligible
            ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_SCHEMA
            : null,
          receiptSignerKeyBindingRequestPacketSchema: eligible
            ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA
            : null,
          implementedReceiptSignerKeyBindingRequestCreateCapabilityId: eligible
            ? HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_REQUEST_CREATE_CAPABILITY_ID
            : null,
          requiredReceiptSignerKeyBindingCapabilityId: eligible
            ? HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_CAPABILITY_ID
            : null,
          requiredProvisioningReceiptVerifyCapabilityId: eligible
            ? HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID : null,
          requiredHostTrustAnchorProvisionCapabilityId: eligible
            ? HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID : null,
          receiptSignerKeyBindingVerdict: eligible ? 'UNKNOWN' : null,
          receiptAuthorityVerdict: eligible ? 'UNKNOWN' : null,
          provisioningReceiptVerificationVerdict: eligible ? 'UNKNOWN' : null,
          hostAccepted: false,
          hostTrustAnchorProvisioned: false,
          admissionVerdict: eligible ? 'NOT_AUTHORIZED' : null
        };
      });
}

function expectedSummary(routes) {
  return {
    sourceR106ReceiptSignatureIntegrityContractCount: 1,
    receiptSignerKeyBindingRouteCount: 28,
    receiptSignerKeyBindingRequestEligibleRouteCount: routes.filter(route =>
      route.eligibleForReceiptSignerKeyBindingRequest).length,
    authorityReviewRouteExcludedCount: routes.filter(route =>
      !route.eligibleForReceiptSignerKeyBindingRequest).length,
    persistedReceiptEnvelopeCount: 0,
    persistedReceiptSignatureAssessmentCount: 0,
    persistedReceiptSignerKeyBindingRequestPacketCount: 0,
    persistedReceiptSignerKeyBindingRequestCount: 0,
    persistedHostAuthorityEvidenceCount: 0,
    persistedReceiptSignerKeyBindingDecisionCount: 0,
    trustedReceiptSignerKeyBindingCount: 0,
    verifiedProvisioningReceiptCount: 0,
    hostAcceptedProposalCount: 0,
    hostTrustAnchorCount: 0,
    receiptSignerKeyBindingRequestCreationImplemented: true,
    receiptSignerKeyBindingImplemented: false,
    provisioningReceiptVerificationImplemented: false,
    hostTrustAnchorProvisioningImplemented: false,
    candidateAdmissionPathImplemented: false
  };
}

const expectedTruth = {
  exactR106ReceiptSignatureIntegrityContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourReceiptSignerKeyBindingRequestRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  signatureIntegrityPassRequiredBeforeRequest: true,
  exactProposalPolicyHostReceiptAndAssessmentBindingRequired: true,
  receiptSignerKeyBindingRequestCreationImplemented: true,
  receiptSignerKeyBindingImplemented: false,
  hostAuthorityEvidenceVerified: false,
  hostAuthorityKeyTrusted: false,
  hostIdentityAuthenticated: false,
  hostAuthorityToProvisionEstablished: false,
  provisioningReceiptVerified: false,
  hostAccepted: false,
  hostTrustAnchorProvisioned: false,
  callerSuppliedPolicyTrusted: false,
  trustedVerifierKeyBindingImplemented: false,
  observationAuthenticityVerified: false,
  provenanceVerified: false,
  physicalMeaningReviewImplemented: false,
  evidenceVerified: false,
  receiptEnvelopePersisted: false,
  receiptSignatureAssessmentPersisted: false,
  receiptSignerKeyBindingRequestPacketPersisted: false,
  receiptSignerKeyBindingRequestsPersisted: false,
  hostAuthorityEvidencePersisted: false,
  receiptSignerKeyBindingDecisionPersisted: false,
  rawHostAuthorityPublicKeyPersisted: false,
  receiptSignatureBytesPersisted: false,
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
    id: 'land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-request-contract',
    required: true,
    status,
    statement: 'Exact R106 receipt-signature routes gain transient signer-key-binding request routing, while host evidence, key authority, governed receipt verification, acceptance, installation, persistence, admission, and world mutation remain unresolved.',
    detail
  };
}

export function
auditLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestContract(
  column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land
    ?.matrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestContractReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestContractMigrationCheckpoint ===
        true;
    return result(checkpoint ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'the source lineage does not retain an exact R106 receipt-signature-integrity contract'
        : 'a current loaded-land lineage is missing its R107 receipt-signer-key-binding request contract'
    });
  }
  const source = receipt.sourceReceiptSignatureIntegrityContract;
  const attachedSource = column.land
    ?.matrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrityContractReceipt;
  const sourceIntegrity =
    landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrityContractReceiptValid(
      source) && exact(source, attachedSource) &&
    receipt.source?.schema === source?.schema &&
    receipt.source?.receiptDigest === source?.digest;
  const routes = sourceIntegrity ? expectedRoutes(source) : [];
  const routesExact = sourceIntegrity &&
    exact(receipt.receiptSignerKeyBindingRoutes, routes);
  const summaryExact = routesExact &&
    exact(receipt.summary, expectedSummary(routes));
  const routeBoundaryIntact =
    receipt.receiptSignerKeyBindingRoutes?.length === 28 &&
    receipt.receiptSignerKeyBindingRoutes.filter(route =>
      route.eligibleForReceiptSignerKeyBindingRequest).length === 24 &&
    receipt.receiptSignerKeyBindingRoutes.filter(route =>
      !route.eligibleForReceiptSignerKeyBindingRequest).length === 4 &&
    receipt.receiptSignerKeyBindingRoutes.every(route =>
      route.hostAccepted === false &&
      route.hostTrustAnchorProvisioned === false);
  const capabilityBoundaryIntact =
    receipt.receiptSignerKeyBindingRoutes.every(route =>
      route.eligibleForReceiptSignerKeyBindingRequest
        ? route.implementedReceiptSignerKeyBindingRequestCreateCapabilityId ===
            HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_REQUEST_CREATE_CAPABILITY_ID &&
          route.requiredReceiptSignerKeyBindingCapabilityId ===
            HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_CAPABILITY_ID &&
          route.requiredProvisioningReceiptVerifyCapabilityId ===
            HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID &&
          route.requiredHostTrustAnchorProvisionCapabilityId ===
            HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID &&
          route.receiptSignerKeyBindingVerdict === 'UNKNOWN' &&
          route.receiptAuthorityVerdict === 'UNKNOWN' &&
          route.provisioningReceiptVerificationVerdict === 'UNKNOWN' &&
          route.admissionVerdict === 'NOT_AUTHORIZED'
        : route.implementedReceiptSignerKeyBindingRequestCreateCapabilityId ===
            null &&
          route.requiredReceiptSignerKeyBindingCapabilityId === null &&
          route.requiredProvisioningReceiptVerifyCapabilityId === null &&
          route.requiredHostTrustAnchorProvisionCapabilityId === null &&
          route.receiptSignerKeyBindingVerdict === null &&
          route.receiptAuthorityVerdict === null &&
          route.provisioningReceiptVerificationVerdict === null &&
          route.admissionVerdict === null);
  const persistenceBound = column.land
      ?.matrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestContractMigrationCheckpoint ===
        false && column.budget
      ?.matrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestContract
      ?.digest === receipt.digest;
  const structuralValid = digestValid(receipt) && sourceIntegrity &&
    exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
      'sourceReceiptSignatureIntegrityContract',
      'receiptSignerKeyBindingRoutes', 'summary', 'emission', 'truth',
      'digest']) &&
    exact(receipt.creationContext, source?.creationContext) && routesExact &&
    summaryExact &&
    ['native-from-intact-r106-provisioning-receipt-signature-integrity-contract',
      'migration-from-exact-retained-r106-provisioning-receipt-signature-integrity-contract']
      .includes(receipt.emission?.mode) &&
    receipt.emission
      ?.sourceWasExactRetainedReceiptSignatureIntegrityContractMigration ===
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
    receiptSignerKeyBindingRouteCount:
      receipt.summary?.receiptSignerKeyBindingRouteCount ?? null,
    receiptSignerKeyBindingRequestEligibleRouteCount:
      receipt.summary?.receiptSignerKeyBindingRequestEligibleRouteCount ??
        null,
    authorityReviewRouteExcludedCount:
      receipt.summary?.authorityReviewRouteExcludedCount ?? null,
    persistedReceiptSignerKeyBindingRequestPacketCount:
      receipt.summary
        ?.persistedReceiptSignerKeyBindingRequestPacketCount ?? null,
    trustedReceiptSignerKeyBindingCount:
      receipt.summary?.trustedReceiptSignerKeyBindingCount ?? null,
    verifiedProvisioningReceiptCount:
      receipt.summary?.verifiedProvisioningReceiptCount ?? null,
    hostTrustAnchorCount: receipt.summary?.hostTrustAnchorCount ?? null,
    emissionMode: receipt.emission?.mode || null,
    sourceReceiptSignatureIntegrityContractDigest:
      receipt.source?.receiptDigest || null,
    receiptDigest: receipt.digest || null
  });
}
