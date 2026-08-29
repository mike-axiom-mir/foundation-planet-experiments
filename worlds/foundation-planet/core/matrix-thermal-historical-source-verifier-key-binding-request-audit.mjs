import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA,
  landMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseContractReceiptValid
} from './matrix-thermal-historical-source-observation-authenticity-signed-response.mjs?v=0.103.0-r103.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_ROUTE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_PACKET_SCHEMA,
  VERIFIER_KEY_BINDING_CAPABILITY_ID,
  VERIFIER_IDENTITY_RESOLUTION_CAPABILITY_ID,
  VERIFIER_INDEPENDENCE_VERIFICATION_CAPABILITY_ID
} from './matrix-thermal-historical-source-verifier-key-binding-request.mjs?v=0.103.0-r103.1';

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
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA ||
      typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function expectedRoutes(source) {
  return source.signedResponseRoutes.map(sourceRoute => {
    const eligible = sourceRoute.eligibleForSignedResponse === true;
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_ROUTE_SCHEMA,
      routeId: `verifier-key-binding:${sourceRoute.routeId}`,
      sourceSignedResponseRouteId: sourceRoute.routeId,
      requestBinding: clone(sourceRoute.requestBinding),
      nativeProofPlan: clone(sourceRoute.nativeProofPlan),
      eligibleForVerifierKeyBindingRequest: eligible,
      sourceSignatureAssessmentSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA
        : null,
      verifierKeyBindingRequestSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_SCHEMA
        : null,
      verifierKeyBindingRequestPacketSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_PACKET_SCHEMA
        : null,
      requiredVerifierKeyBindingCapabilityId: eligible
        ? VERIFIER_KEY_BINDING_CAPABILITY_ID : null,
      requiredVerifierIdentityResolutionCapabilityId: eligible
        ? VERIFIER_IDENTITY_RESOLUTION_CAPABILITY_ID : null,
      requiredVerifierIndependenceVerificationCapabilityId: eligible
        ? VERIFIER_INDEPENDENCE_VERIFICATION_CAPABILITY_ID : null,
      claimedIdentifierComparisonAvailable: eligible,
      trustedVerifierRegistryConfigured: false,
      trustedVerifierKeyBinding: null,
      trustedVerifierIdentity: null,
      verifierIndependenceEvidence: [],
      bindingDecision: null,
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
    sourceR102SignedResponseContractCount: 1,
    verifierKeyBindingRouteCount: 28,
    verifierKeyBindingRequestEligibleRouteCount: routes.filter(route =>
      route.eligibleForVerifierKeyBindingRequest).length,
    authorityReviewRouteExcludedCount: routes.filter(route =>
      !route.eligibleForVerifierKeyBindingRequest).length,
    verifierKeyBindingRequestPacketCount: 0,
    trustedVerifierRegistryCount: 0,
    trustedVerifierKeyBindingCount: 0,
    trustedVerifierIdentityCount: 0,
    verifiedIndependentVerifierCount: 0,
    verifiedAuthenticObservationCount: 0,
    persistedRequestPacketCount: 0,
    claimedIdentifierComparisonImplemented: true,
    verifierKeyBindingRequestPacketGenerationImplemented: true,
    verifierKeyBindingImplemented: false,
    verifierIdentityResolutionImplemented: false,
    verifierIndependenceVerificationImplemented: false,
    observationAuthenticityVerificationImplemented: false,
    physicalMeaningReviewImplemented: false,
    candidateAdmissionPathImplemented: false
  };
}

const expectedTruth = {
  exactR102SignedResponseContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourVerifierKeyBindingRequestRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  nativeClaimProofPlansPreserved: true,
  signatureIntegrityPassRequiredBeforeRequest: true,
  claimedIdentifierComparisonImplemented: true,
  claimedIdentifierEqualityIsCounterevidenceOnly: true,
  claimedIdentifierInequalityNotIndependenceProof: true,
  verifierKeyBindingRequestPacketGenerationImplemented: true,
  trustedVerifierRegistryConfigured: false,
  trustedVerifierKeyBindingImplemented: false,
  trustedVerifierKeyBound: false,
  verifierIdentityResolutionImplemented: false,
  claimedVerifierIdentityTrusted: false,
  verifierIndependenceVerificationImplemented: false,
  verifierIndependenceEstablished: false,
  observationAuthenticityEvidenceVerified: false,
  observationAuthenticityVerified: false,
  provenanceVerified: false,
  physicalMeaningReviewImplemented: false,
  evidenceVerified: false,
  authoritySelfAttestationAccepted: false,
  requestPacketsPersisted: false,
  verificationDecisionsPersisted: false,
  candidateAdmissionPathImplemented: false,
  admissionAuthorityGranted: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  crossBoundaryCardinalityInferencePerformed: false,
  ownerMutationPerformed: false,
  heatTransferPerformed: false,
  historicalHeatReconstructed: false,
  combinedPhysicalSourceGraphClaimed: false,
  absoluteThermodynamicEnergyClaimed: false,
  resolvedConductionClaimed: false,
  geothermalForcingModeled: false,
  scientificCalibrationClaimed: false,
  globalUnloadedBoundaryClaimed: false
};

function result(status, detail) {
  return {
    id: 'land-matrix-thermal-historical-source-verifier-key-binding-request-contract',
    required: true,
    status,
    statement: 'Exact R102 signed-response routes request trusted key binding, claimed-identity resolution, and verifier-independence evidence after a real signature-integrity PASS while literal identifier comparisons remain counterevidence only and trust, authenticity, authority, persistence, and admission remain unresolved.',
    detail
  };
}

export function
auditLandMatrixThermalHistoricalSourceVerifierKeyBindingRequestContract(
  column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land
    ?.matrixThermalHistoricalSourceVerifierKeyBindingRequestContractReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalHistoricalSourceVerifierKeyBindingRequestContractMigrationCheckpoint ===
        true;
    return result(checkpoint ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'the source lineage does not retain an exact R102 signed-response contract'
        : 'a current loaded-land lineage is missing its R103 verifier-key-binding request contract'
    });
  }
  const source = receipt.sourceSignedResponseContract;
  const attachedSource = column.land
    ?.matrixThermalHistoricalSourceObservationAuthenticitySignedResponseContractReceipt;
  const sourceIntegrity =
    landMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseContractReceiptValid(
      source) && exact(source, attachedSource) &&
    receipt.source?.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_CONTRACT_RECEIPT_SCHEMA &&
    receipt.source?.receiptDigest === source?.digest;
  const routes = sourceIntegrity ? expectedRoutes(source) : [];
  const routesExact = sourceIntegrity &&
    exact(receipt.verifierKeyBindingRoutes, routes);
  const summaryExact = routesExact &&
    exact(receipt.summary, expectedSummary(routes));
  const routeBoundaryIntact =
    receipt.verifierKeyBindingRoutes?.length === 28 &&
    receipt.verifierKeyBindingRoutes.filter(route =>
      route.eligibleForVerifierKeyBindingRequest).length === 24 &&
    receipt.verifierKeyBindingRoutes.filter(route =>
      !route.eligibleForVerifierKeyBindingRequest).length === 4 &&
    receipt.verifierKeyBindingRoutes.every(route =>
      route.trustedVerifierRegistryConfigured === false &&
      route.trustedVerifierKeyBinding === null &&
      route.trustedVerifierIdentity === null &&
      Array.isArray(route.verifierIndependenceEvidence) &&
      route.verifierIndependenceEvidence.length === 0 &&
      route.bindingDecision === null &&
      route.verifierKeyBindingVerdict === 'UNKNOWN' &&
      route.verifierIdentityVerdict === 'UNKNOWN' &&
      route.verifierIndependenceVerdict === 'UNKNOWN' &&
      route.observationAuthenticityVerdict === 'UNKNOWN' &&
      route.provenanceVerdict === 'UNKNOWN' &&
      route.physicalMeaningReviewVerdict === 'UNKNOWN' &&
      route.admissionVerdict === 'NOT_AUTHORIZED');
  const persistenceBound = column.land
      ?.matrixThermalHistoricalSourceVerifierKeyBindingRequestContractMigrationCheckpoint ===
        false &&
    column.budget
      ?.matrixThermalHistoricalSourceVerifierKeyBindingRequestContract
      ?.digest === receipt.digest;
  const structuralValid = digestValid(receipt) && sourceIntegrity &&
    exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
      'sourceSignedResponseContract', 'verifierKeyBindingRoutes', 'summary',
      'emission', 'truth', 'digest']) &&
    exact(receipt.creationContext, source?.creationContext) &&
    routesExact && summaryExact &&
    ['native-from-intact-r102-signed-response-contract',
      'migration-from-exact-retained-r102-signed-response-contract']
      .includes(receipt.emission?.mode) &&
    receipt.emission
      ?.sourceWasExactRetainedSignedResponseContractMigration ===
        receipt.emission?.mode.startsWith('migration-');
  const truthValid = exact(receipt.truth, expectedTruth);
  const valid = structuralValid && routeBoundaryIntact && truthValid &&
    persistenceBound;
  return result(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt.schema || null,
    structuralValid,
    sourceIntegrity,
    routesExact,
    summaryExact,
    routeBoundaryIntact,
    truthValid,
    persistenceBound,
    verifierKeyBindingRouteCount:
      receipt.summary?.verifierKeyBindingRouteCount ?? null,
    verifierKeyBindingRequestEligibleRouteCount:
      receipt.summary?.verifierKeyBindingRequestEligibleRouteCount ?? null,
    authorityReviewRouteExcludedCount:
      receipt.summary?.authorityReviewRouteExcludedCount ?? null,
    verifierKeyBindingRequestPacketCount:
      receipt.summary?.verifierKeyBindingRequestPacketCount ?? null,
    trustedVerifierRegistryCount:
      receipt.summary?.trustedVerifierRegistryCount ?? null,
    trustedVerifierKeyBindingCount:
      receipt.summary?.trustedVerifierKeyBindingCount ?? null,
    trustedVerifierIdentityCount:
      receipt.summary?.trustedVerifierIdentityCount ?? null,
    verifiedIndependentVerifierCount:
      receipt.summary?.verifiedIndependentVerifierCount ?? null,
    verifiedAuthenticObservationCount:
      receipt.summary?.verifiedAuthenticObservationCount ?? null,
    emissionMode: receipt.emission?.mode || null,
    sourceSignedResponseContractDigest:
      receipt.source?.receiptDigest || null,
    receiptDigest: receipt.digest || null
  });
}
