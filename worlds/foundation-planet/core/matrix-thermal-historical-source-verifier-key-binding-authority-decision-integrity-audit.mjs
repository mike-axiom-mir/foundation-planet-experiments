import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_SCHEMA,
  landMatrixThermalHistoricalSourceVerifierKeyBindingRequestContractReceiptValid
} from './matrix-thermal-historical-source-verifier-key-binding-request.mjs?v=0.104.0-r104.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ROUTE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_ENVELOPE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REVOCATION_SNAPSHOT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ASSESSMENT_SCHEMA,
  HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID,
  VERIFIER_KEY_BINDING_DECISION_SIGNATURE_VERIFY_CAPABILITY_ID,
  VERIFIER_KEY_BINDING_REVOCATION_VERIFY_CAPABILITY_ID
} from './matrix-thermal-historical-source-verifier-key-binding-authority-decision-integrity.mjs?v=0.104.0-r104.1';

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
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA ||
      typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function expectedRoutes(sourceContract) {
  return sourceContract.verifierKeyBindingRoutes.map(sourceRoute => {
    const eligible =
      sourceRoute.eligibleForVerifierKeyBindingRequest === true;
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ROUTE_SCHEMA,
      routeId: `authority-decision-integrity:${sourceRoute.routeId}`,
      sourceVerifierKeyBindingRouteId: sourceRoute.routeId,
      requestBinding: clone(sourceRoute.requestBinding),
      eligibleForAuthorityDecisionIntegrity: eligible,
      sourceVerifierKeyBindingRequestSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_SCHEMA
        : null,
      callerSuppliedPolicyDescriptorSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA
        : null,
      authorityDecisionEnvelopeSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_ENVELOPE_SCHEMA
        : null,
      revocationSnapshotSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REVOCATION_SNAPSHOT_SCHEMA
        : null,
      decisionIntegrityAssessmentSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ASSESSMENT_SCHEMA
        : null,
      requiredHostTrustAnchorProvisionCapabilityId: eligible
        ? HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID : null,
      implementedDecisionSignatureVerificationCapabilityId: eligible
        ? VERIFIER_KEY_BINDING_DECISION_SIGNATURE_VERIFY_CAPABILITY_ID : null,
      implementedRevocationVerificationCapabilityId: eligible
        ? VERIFIER_KEY_BINDING_REVOCATION_VERIFY_CAPABILITY_ID : null,
      hostTrustAnchorProvisioned: false,
      callerSuppliedPolicyTrusted: false,
      trustedVerifierKeyBinding: null,
      verifierKeyBindingVerdict: 'UNKNOWN',
      verifierIdentityVerdict: 'UNKNOWN',
      verifierIndependenceVerdict: 'UNKNOWN',
      observationAuthenticityVerdict: 'UNKNOWN',
      provenanceVerdict: 'UNKNOWN',
      physicalMeaningReviewVerdict: 'UNKNOWN',
      admissionVerdict: 'NOT_AUTHORIZED'
    };
  });
}

function expectedSummary(routes) {
  return {
    sourceR103VerifierKeyBindingRequestContractCount: 1,
    authorityDecisionIntegrityRouteCount: 28,
    authorityDecisionIntegrityEligibleRouteCount: routes.filter(route =>
      route.eligibleForAuthorityDecisionIntegrity).length,
    authorityReviewRouteExcludedCount: routes.filter(route =>
      !route.eligibleForAuthorityDecisionIntegrity).length,
    hostTrustAnchorCount: 0,
    trustedPolicyCount: 0,
    persistedPolicyDescriptorCount: 0,
    persistedAuthorityDecisionEnvelopeCount: 0,
    persistedRevocationSnapshotCount: 0,
    persistedIntegrityAssessmentCount: 0,
    trustedVerifierKeyBindingCount: 0,
    verifiedAuthenticObservationCount: 0,
    decisionSignatureVerificationImplemented: true,
    revocationVerificationImplemented: true,
    hostTrustAnchorProvisioningImplemented: false,
    verifierKeyBindingImplemented: false,
    verifierIdentityResolutionImplemented: false,
    verifierIndependenceVerificationImplemented: false,
    observationAuthenticityVerificationImplemented: false,
    candidateAdmissionPathImplemented: false
  };
}

const expectedTruth = {
  exactR103VerifierKeyBindingRequestContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourAuthorityDecisionIntegrityRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  detachedEd25519AuthorityDecisionVerificationImplemented: true,
  detachedEd25519RevocationSnapshotVerificationImplemented: true,
  separateDecisionAndRevocationKeysRequired: true,
  exactPolicyDecisionAndRevocationDigestsRequired: true,
  boundedValidityWindowsRequired: true,
  explicitRevocationChecksImplemented: true,
  hostTrustAnchorProvisioningImplemented: false,
  callerSuppliedPolicyTrusted: false,
  validSignatureMeansSuppliedPolicyKeyMatchOnly: true,
  requestedBindActionAppliesBinding: false,
  trustedVerifierKeyBindingImplemented: false,
  trustedVerifierKeyBound: false,
  verifierIdentityResolutionImplemented: false,
  claimedVerifierIdentityTrusted: false,
  verifierIndependenceVerificationImplemented: false,
  verifierIndependenceEstablished: false,
  observationAuthenticityVerified: false,
  provenanceVerified: false,
  physicalMeaningReviewImplemented: false,
  evidenceVerified: false,
  authoritySelfAttestationAccepted: false,
  policyDescriptorsPersisted: false,
  authorityDecisionEnvelopesPersisted: false,
  revocationSnapshotsPersisted: false,
  integrityAssessmentsPersisted: false,
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
    id: 'land-matrix-thermal-historical-source-verifier-key-binding-authority-decision-integrity-contract',
    required: true,
    status,
    statement: 'Exact R103 verifier-key-binding requests gain detached Ed25519 integrity checks for a caller-supplied decision envelope and a separately signed revocation snapshot, while the supplying policy remains untrusted and host trust, binding, identity, independence, authenticity, persistence, admission, and world mutation remain unresolved.',
    detail
  };
}

export function
auditLandMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityContract(
  column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land
    ?.matrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityContractReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityContractMigrationCheckpoint ===
        true;
    return result(checkpoint ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'the source lineage does not retain an exact R103 verifier-key-binding request contract'
        : 'a current loaded-land lineage is missing its R104 authority-decision integrity contract'
    });
  }
  const source = receipt.sourceVerifierKeyBindingRequestContract;
  const attachedSource = column.land
    ?.matrixThermalHistoricalSourceVerifierKeyBindingRequestContractReceipt;
  const sourceIntegrity =
    landMatrixThermalHistoricalSourceVerifierKeyBindingRequestContractReceiptValid(
      source) && exact(source, attachedSource) &&
    receipt.source?.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA &&
    receipt.source?.receiptDigest === source?.digest;
  const routes = sourceIntegrity ? expectedRoutes(source) : [];
  const routesExact = sourceIntegrity &&
    exact(receipt.authorityDecisionIntegrityRoutes, routes);
  const summaryExact = routesExact &&
    exact(receipt.summary, expectedSummary(routes));
  const routeBoundaryIntact =
    receipt.authorityDecisionIntegrityRoutes?.length === 28 &&
    receipt.authorityDecisionIntegrityRoutes.filter(route =>
      route.eligibleForAuthorityDecisionIntegrity).length === 24 &&
    receipt.authorityDecisionIntegrityRoutes.filter(route =>
      !route.eligibleForAuthorityDecisionIntegrity).length === 4 &&
    receipt.authorityDecisionIntegrityRoutes.every(route =>
      route.hostTrustAnchorProvisioned === false &&
      route.callerSuppliedPolicyTrusted === false &&
      route.trustedVerifierKeyBinding === null &&
      route.verifierKeyBindingVerdict === 'UNKNOWN' &&
      route.verifierIdentityVerdict === 'UNKNOWN' &&
      route.verifierIndependenceVerdict === 'UNKNOWN' &&
      route.observationAuthenticityVerdict === 'UNKNOWN' &&
      route.provenanceVerdict === 'UNKNOWN' &&
      route.physicalMeaningReviewVerdict === 'UNKNOWN' &&
      route.admissionVerdict === 'NOT_AUTHORIZED');
  const capabilityBoundaryIntact =
    receipt.authorityDecisionIntegrityRoutes.every(route =>
      route.eligibleForAuthorityDecisionIntegrity
        ? route.requiredHostTrustAnchorProvisionCapabilityId ===
            HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID &&
          route.implementedDecisionSignatureVerificationCapabilityId ===
            VERIFIER_KEY_BINDING_DECISION_SIGNATURE_VERIFY_CAPABILITY_ID &&
          route.implementedRevocationVerificationCapabilityId ===
            VERIFIER_KEY_BINDING_REVOCATION_VERIFY_CAPABILITY_ID
        : route.requiredHostTrustAnchorProvisionCapabilityId === null &&
          route.implementedDecisionSignatureVerificationCapabilityId ===
            null &&
          route.implementedRevocationVerificationCapabilityId === null);
  const persistenceBound = column.land
      ?.matrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityContractMigrationCheckpoint ===
        false &&
    column.budget
      ?.matrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityContract
      ?.digest === receipt.digest;
  const structuralValid = digestValid(receipt) && sourceIntegrity &&
    exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
      'sourceVerifierKeyBindingRequestContract',
      'authorityDecisionIntegrityRoutes', 'summary', 'emission', 'truth',
      'digest']) && exact(receipt.creationContext, source?.creationContext) &&
    routesExact && summaryExact &&
    ['native-from-intact-r103-verifier-key-binding-request-contract',
      'migration-from-exact-retained-r103-verifier-key-binding-request-contract']
      .includes(receipt.emission?.mode) &&
    receipt.emission
      ?.sourceWasExactRetainedVerifierKeyBindingRequestContractMigration ===
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
    authorityDecisionIntegrityRouteCount:
      receipt.summary?.authorityDecisionIntegrityRouteCount ?? null,
    authorityDecisionIntegrityEligibleRouteCount:
      receipt.summary?.authorityDecisionIntegrityEligibleRouteCount ?? null,
    authorityReviewRouteExcludedCount:
      receipt.summary?.authorityReviewRouteExcludedCount ?? null,
    hostTrustAnchorCount: receipt.summary?.hostTrustAnchorCount ?? null,
    trustedPolicyCount: receipt.summary?.trustedPolicyCount ?? null,
    persistedAuthorityDecisionEnvelopeCount:
      receipt.summary?.persistedAuthorityDecisionEnvelopeCount ?? null,
    persistedRevocationSnapshotCount:
      receipt.summary?.persistedRevocationSnapshotCount ?? null,
    trustedVerifierKeyBindingCount:
      receipt.summary?.trustedVerifierKeyBindingCount ?? null,
    emissionMode: receipt.emission?.mode || null,
    sourceVerifierKeyBindingRequestContractDigest:
      receipt.source?.receiptDigest || null,
    receiptDigest: receipt.digest || null
  });
}
