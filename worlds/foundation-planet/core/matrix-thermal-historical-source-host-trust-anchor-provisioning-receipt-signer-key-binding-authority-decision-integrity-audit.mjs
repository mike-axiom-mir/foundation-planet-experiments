import {
  HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID
} from './matrix-thermal-historical-source-verifier-key-binding-authority-decision-integrity.mjs?v=0.108.0-r108.1';
import {
  HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signature-integrity.mjs?v=0.108.0-r108.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA,
  HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestContractReceiptValid
} from './matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-request.mjs?v=0.108.0-r108.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ROUTE_SCHEMA,
  HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BINDING_DECISION_SIGNATURE_VERIFY_CAPABILITY_ID,
  HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BINDING_DECISION_REVOCATION_VERIFY_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-authority-decision-integrity.mjs?v=0.108.0-r108.1';

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
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA ||
      typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function expectedRoutes(sourceContract) {
  return sourceContract.receiptSignerKeyBindingRoutes.map(sourceRoute => {
    const eligible =
      sourceRoute.eligibleForReceiptSignerKeyBindingRequest === true;
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ROUTE_SCHEMA,
      routeId: `receipt-signer-key-binding-authority-decision:${sourceRoute.routeId}`,
      sourceReceiptSignerKeyBindingRouteId: sourceRoute.routeId,
      requestBinding: clone(sourceRoute.requestBinding),
      eligibleForReceiptSignerKeyBindingAuthorityDecisionIntegrity: eligible,
      sourceRequestPacketSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA
        : null,
      implementedBindingDecisionSignatureVerifyCapabilityId: eligible
        ? HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BINDING_DECISION_SIGNATURE_VERIFY_CAPABILITY_ID
        : null,
      implementedBindingDecisionRevocationVerifyCapabilityId: eligible
        ? HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BINDING_DECISION_REVOCATION_VERIFY_CAPABILITY_ID
        : null,
      requiredReceiptSignerKeyBindingCapabilityId: eligible
        ? HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_CAPABILITY_ID
        : null,
      requiredProvisioningReceiptVerifyCapabilityId: eligible
        ? HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID : null,
      requiredHostTrustAnchorProvisionCapabilityId: eligible
        ? HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID : null,
      bindingDecisionIntegrityVerdict: eligible ? 'UNKNOWN' : null,
      callerSuppliedPolicyTrustVerdict: eligible
        ? 'UNTRUSTED_CALLER_SUPPLIED' : null,
      receiptSignerKeyBindingVerdict: eligible ? 'UNKNOWN' : null,
      provisioningReceiptVerificationVerdict: eligible ? 'UNKNOWN' : null,
      hostTrustAnchorProvisioned: false,
      admissionVerdict: eligible ? 'NOT_AUTHORIZED' : null
    };
  });
}

function expectedSummary(routes) {
  const eligible = routes.filter(route =>
    route.eligibleForReceiptSignerKeyBindingAuthorityDecisionIntegrity).length;
  return {
    sourceR107ReceiptSignerKeyBindingRequestContractCount: 1,
    bindingDecisionIntegrityRouteCount: 28,
    bindingDecisionIntegrityEligibleRouteCount: eligible,
    authorityReviewRouteExcludedCount: routes.length - eligible,
    implementedBindingDecisionSignatureVerifyRouteCount: eligible,
    implementedBindingDecisionRevocationVerifyRouteCount: eligible,
    persistedRequestPacketCount: 0,
    persistedCallerSuppliedPolicyDescriptorCount: 0,
    persistedBindingDecisionEnvelopeCount: 0,
    persistedRevocationSnapshotCount: 0,
    persistedIntegrityAssessmentCount: 0,
    trustedReceiptSignerKeyBindingCount: 0,
    verifiedProvisioningReceiptCount: 0,
    hostTrustAnchorCount: 0,
    receiptSignerKeyBindingImplemented: false,
    provisioningReceiptVerificationImplemented: false,
    hostTrustAnchorProvisioningImplemented: false,
    candidateAdmissionPathImplemented: false
  };
}

const expectedTruth = {
  exactR107ReceiptSignerKeyBindingRequestContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourBindingDecisionIntegrityRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  exactR107RequestPacketRequired: true,
  bindingDecisionSignatureVerificationImplemented: true,
  bindingDecisionRevocationVerificationImplemented: true,
  validSignaturesMeanSuppliedPolicyKeyMatchOnly: true,
  callerSuppliedPolicyTrusted: false,
  hostAuthorityEvidenceAuthenticated: false,
  receiptSignerKeyBindingImplemented: false,
  hostAuthorityKeyTrusted: false,
  hostIdentityAuthenticated: false,
  hostAuthorityToProvisionEstablished: false,
  provisioningReceiptVerified: false,
  hostAccepted: false,
  hostTrustAnchorProvisioned: false,
  trustedVerifierKeyBindingImplemented: false,
  observationAuthenticityVerified: false,
  provenanceVerified: false,
  physicalMeaningReviewImplemented: false,
  evidenceVerified: false,
  requestPacketPersisted: false,
  callerSuppliedPolicyDescriptorPersisted: false,
  bindingDecisionEnvelopePersisted: false,
  revocationSnapshotPersisted: false,
  integrityAssessmentPersisted: false,
  rawAuthorityPublicKeysPersisted: false,
  signatureBytesPersisted: false,
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
    id: 'land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-authority-decision-integrity-contract',
    required: true,
    status,
    statement: 'Exact R107 signer-key-binding request routes gain detached decision and revocation signature-integrity checks under an explicitly untrusted caller policy, while actual binding, governed receipt verification, provisioning, persistence, admission, and mutation remain unresolved.',
    detail
  };
}

export function
auditLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityContract(
  column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land
    ?.matrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityContractReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityContractMigrationCheckpoint ===
        true;
    return result(checkpoint ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'the source lineage does not retain an exact R107 signer-key-binding request contract'
        : 'a current loaded-land lineage is missing its R108 binding-decision integrity contract'
    });
  }
  const source = receipt.sourceReceiptSignerKeyBindingRequestContract;
  const attachedSource = column.land
    ?.matrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestContractReceipt;
  const sourceIntegrity =
    landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestContractReceiptValid(
      source) && exact(source, attachedSource) &&
    receipt.source?.schema === source?.schema &&
    receipt.source?.receiptDigest === source?.digest;
  const routes = sourceIntegrity ? expectedRoutes(source) : [];
  const routesExact = sourceIntegrity &&
    exact(receipt.bindingDecisionIntegrityRoutes, routes);
  const summaryExact = routesExact &&
    exact(receipt.summary, expectedSummary(routes));
  const routeBoundaryIntact =
    receipt.bindingDecisionIntegrityRoutes?.length === 28 &&
    receipt.bindingDecisionIntegrityRoutes.filter(route =>
      route.eligibleForReceiptSignerKeyBindingAuthorityDecisionIntegrity)
      .length === 24 &&
    receipt.bindingDecisionIntegrityRoutes.filter(route =>
      !route.eligibleForReceiptSignerKeyBindingAuthorityDecisionIntegrity)
      .length === 4 &&
    receipt.bindingDecisionIntegrityRoutes.every(route =>
      route.hostTrustAnchorProvisioned === false);
  const capabilityBoundaryIntact =
    receipt.bindingDecisionIntegrityRoutes.every(route =>
      route.eligibleForReceiptSignerKeyBindingAuthorityDecisionIntegrity
        ? route.implementedBindingDecisionSignatureVerifyCapabilityId ===
            HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BINDING_DECISION_SIGNATURE_VERIFY_CAPABILITY_ID &&
          route.implementedBindingDecisionRevocationVerifyCapabilityId ===
            HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BINDING_DECISION_REVOCATION_VERIFY_CAPABILITY_ID &&
          route.requiredReceiptSignerKeyBindingCapabilityId ===
            HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_CAPABILITY_ID &&
          route.requiredProvisioningReceiptVerifyCapabilityId ===
            HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID &&
          route.requiredHostTrustAnchorProvisionCapabilityId ===
            HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID &&
          route.bindingDecisionIntegrityVerdict === 'UNKNOWN' &&
          route.callerSuppliedPolicyTrustVerdict ===
            'UNTRUSTED_CALLER_SUPPLIED' &&
          route.receiptSignerKeyBindingVerdict === 'UNKNOWN' &&
          route.provisioningReceiptVerificationVerdict === 'UNKNOWN' &&
          route.admissionVerdict === 'NOT_AUTHORIZED'
        : route.implementedBindingDecisionSignatureVerifyCapabilityId ===
            null &&
          route.implementedBindingDecisionRevocationVerifyCapabilityId ===
            null && route.requiredReceiptSignerKeyBindingCapabilityId === null &&
          route.requiredProvisioningReceiptVerifyCapabilityId === null &&
          route.requiredHostTrustAnchorProvisionCapabilityId === null &&
          route.bindingDecisionIntegrityVerdict === null &&
          route.callerSuppliedPolicyTrustVerdict === null &&
          route.receiptSignerKeyBindingVerdict === null &&
          route.provisioningReceiptVerificationVerdict === null &&
          route.admissionVerdict === null);
  const persistenceBound = column.land
      ?.matrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityContractMigrationCheckpoint ===
        false && column.budget
      ?.matrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityContract
      ?.digest === receipt.digest;
  const structuralValid = digestValid(receipt) && sourceIntegrity &&
    exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
      'sourceReceiptSignerKeyBindingRequestContract',
      'bindingDecisionIntegrityRoutes', 'summary', 'emission', 'truth',
      'digest']) && exact(receipt.creationContext, source?.creationContext) &&
    routesExact && summaryExact &&
    ['native-from-intact-r107-receipt-signer-key-binding-request-contract',
      'migration-from-exact-retained-r107-receipt-signer-key-binding-request-contract']
      .includes(receipt.emission?.mode) &&
    receipt.emission
      ?.sourceWasExactRetainedReceiptSignerKeyBindingRequestContractMigration ===
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
    bindingDecisionIntegrityRouteCount:
      receipt.summary?.bindingDecisionIntegrityRouteCount ?? null,
    bindingDecisionIntegrityEligibleRouteCount:
      receipt.summary?.bindingDecisionIntegrityEligibleRouteCount ?? null,
    authorityReviewRouteExcludedCount:
      receipt.summary?.authorityReviewRouteExcludedCount ?? null,
    persistedBindingDecisionEnvelopeCount:
      receipt.summary?.persistedBindingDecisionEnvelopeCount ?? null,
    persistedIntegrityAssessmentCount:
      receipt.summary?.persistedIntegrityAssessmentCount ?? null,
    trustedReceiptSignerKeyBindingCount:
      receipt.summary?.trustedReceiptSignerKeyBindingCount ?? null,
    hostTrustAnchorCount: receipt.summary?.hostTrustAnchorCount ?? null,
    emissionMode: receipt.emission?.mode || null,
    sourceReceiptSignerKeyBindingRequestContractDigest:
      receipt.source?.receiptDigest || null,
    receiptDigest: receipt.digest || null
  });
}
