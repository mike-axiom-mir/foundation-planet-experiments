import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_ROUTE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_ENVELOPE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_SIGNATURE_INPUT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA,
  SIGNED_RESPONSE_ENVELOPE_VALIDATION_CAPABILITY_ID,
  SIGNED_RESPONSE_SIGNATURE_VERIFICATION_CAPABILITY_ID,
  TRUSTED_VERIFIER_KEY_BINDING_CAPABILITY_ID,
  SIGNED_RESPONSE_MAX_CHARACTERS
} from './matrix-thermal-historical-source-observation-authenticity-signed-response.mjs?v=0.102.0-r102.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  landMatrixThermalHistoricalSourceObservationAuthenticityRequestContractReceiptValid
} from './matrix-thermal-historical-source-observation-authenticity-request.mjs?v=0.102.0-r102.1';

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

function digestValid(receipt) {
  if (receipt?.schema !==
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_CONTRACT_RECEIPT_SCHEMA ||
      typeof receipt.digest !== 'string') return false;
  const unsigned = clone(receipt);
  delete unsigned.digest;
  return stableDigest(unsigned) === receipt.digest;
}

function expectedRoutes(requestContract) {
  return requestContract.authenticityRoutes.map(sourceRoute => {
    const eligible =
      sourceRoute.eligibleForObservationAuthenticityRequest === true;
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_ROUTE_SCHEMA,
      routeId: `signed-response:${sourceRoute.routeId}`,
      sourceAuthenticityRouteId: sourceRoute.routeId,
      requestBinding: clone(sourceRoute.requestBinding),
      nativeProofPlan: clone(sourceRoute.proofPlan),
      eligibleForSignedResponse: eligible,
      responseEnvelopeValidationCapabilityId: eligible
        ? SIGNED_RESPONSE_ENVELOPE_VALIDATION_CAPABILITY_ID : null,
      responseSignatureVerificationCapabilityId: eligible
        ? SIGNED_RESPONSE_SIGNATURE_VERIFICATION_CAPABILITY_ID : null,
      signedResponseEnvelopeSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_ENVELOPE_SCHEMA
        : null,
      signatureInputSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_SIGNATURE_INPUT_SCHEMA
        : null,
      signatureAssessmentSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_SIGNED_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA
        : null,
      signatureAlgorithm: eligible ? 'Ed25519' : null,
      publicKeyFormat: eligible ? 'raw-ed25519-32-byte' : null,
      maximumCanonicalResponseCharacters: eligible
        ? SIGNED_RESPONSE_MAX_CHARACTERS : 0,
      trustedVerifierKeyBindingCapabilityId: eligible
        ? TRUSTED_VERIFIER_KEY_BINDING_CAPABILITY_ID : null,
      trustedVerifierKeyBindingAvailable: false,
      claimedVerifierIdentity: null,
      signedResponseEnvelope: null,
      signatureAssessment: null,
      signatureIntegrityVerdict: 'UNKNOWN',
      trustedVerifierKeyVerdict: 'UNKNOWN',
      verifierIdentityTrustVerdict: 'UNKNOWN',
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
    sourceR101RequestContractCount: 1,
    signedResponseRouteCount: 28,
    signedResponseEligibleRouteCount: routes.filter(route =>
      route.eligibleForSignedResponse).length,
    authorityReviewRouteExcludedCount: routes.filter(route =>
      !route.eligibleForSignedResponse).length,
    signatureAlgorithmCount: new Set(routes.filter(route =>
      route.eligibleForSignedResponse).map(route =>
      route.signatureAlgorithm)).size,
    signedResponseEnvelopeCount: 0,
    signatureAssessmentCount: 0,
    signatureIntegrityPassCount: 0,
    trustedVerifierKeyCount: 0,
    trustedVerifierIdentityCount: 0,
    independentVerifierCount: 0,
    verifiedAuthenticObservationCount: 0,
    persistedResponseCount: 0,
    signedResponseEnvelopeValidationImplemented: true,
    detachedSignatureVerificationImplemented: true,
    trustedVerifierKeyBindingImplemented: false,
    observationAuthenticityVerificationImplemented: false,
    physicalMeaningReviewImplemented: false,
    candidateAdmissionPathImplemented: false
  };
}

const expectedTruth = {
  exactR101RequestContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourSignedResponseRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  nativeClaimProofPlansPreserved: true,
  signedResponseEnvelopeValidationImplemented: true,
  detachedEd25519SignatureVerificationImplemented: true,
  callerSuppliedRawPublicKeyOnly: true,
  signatureIntegrityPassMeansSuppliedKeyMatchOnly: true,
  trustedVerifierKeyBindingImplemented: false,
  trustedVerifierKeyBound: false,
  claimedVerifierIdentityTrusted: false,
  verifierIndependenceEstablished: false,
  observationAuthenticityEvidenceVerified: false,
  observationAuthenticityVerified: false,
  provenanceVerified: false,
  physicalMeaningReviewImplemented: false,
  evidenceVerified: false,
  authoritySelfAttestationAccepted: false,
  signedResponsesPersisted: false,
  signatureAssessmentsPersisted: false,
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
    id: 'land-matrix-thermal-historical-source-observation-authenticity-signed-response-contract',
    required: true,
    status,
    statement: 'Exact R101 routes accept bounded signed-response envelopes and detached Ed25519 integrity checks while supplied-key trust, verifier identity and independence, authenticity, meaning, authority, persistence, and admission remain unresolved.',
    detail
  };
}

export function
auditLandMatrixThermalHistoricalSourceObservationAuthenticitySignedResponseContract(
  column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land
    ?.matrixThermalHistoricalSourceObservationAuthenticitySignedResponseContractReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalHistoricalSourceObservationAuthenticitySignedResponseContractMigrationCheckpoint ===
        true;
    return result(checkpoint ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'the source lineage does not retain an exact R101 request contract'
        : 'a current loaded-land lineage is missing its R102 signed-response contract'
    });
  }
  const source = receipt.sourceRequestContract;
  const attachedSource = column.land
    ?.matrixThermalHistoricalSourceObservationAuthenticityRequestContractReceipt;
  const sourceIntegrity =
    landMatrixThermalHistoricalSourceObservationAuthenticityRequestContractReceiptValid(
      source) && exact(source, attachedSource) &&
    receipt.source?.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_REQUEST_CONTRACT_RECEIPT_SCHEMA &&
    receipt.source?.receiptDigest === source?.digest;
  const routes = sourceIntegrity ? expectedRoutes(source) : [];
  const routesExact = sourceIntegrity &&
    exact(receipt.signedResponseRoutes, routes);
  const summaryExact = routesExact &&
    exact(receipt.summary, expectedSummary(routes));
  const routeBoundaryIntact = receipt.signedResponseRoutes?.length === 28 &&
    receipt.signedResponseRoutes.filter(route =>
      route.eligibleForSignedResponse).length === 24 &&
    receipt.signedResponseRoutes.filter(route =>
      !route.eligibleForSignedResponse).length === 4 &&
    receipt.signedResponseRoutes.every(route =>
      route.trustedVerifierKeyBindingAvailable === false &&
      route.claimedVerifierIdentity === null &&
      route.signedResponseEnvelope === null &&
      route.signatureAssessment === null &&
      route.signatureIntegrityVerdict === 'UNKNOWN' &&
      route.trustedVerifierKeyVerdict === 'UNKNOWN' &&
      route.verifierIdentityTrustVerdict === 'UNKNOWN' &&
      route.verifierIndependenceVerdict === 'UNKNOWN' &&
      route.observationAuthenticityVerdict === 'UNKNOWN' &&
      route.provenanceVerdict === 'UNKNOWN' &&
      route.physicalMeaningReviewVerdict === 'UNKNOWN' &&
      route.admissionVerdict === 'NOT_AUTHORIZED');
  const persistenceBound = column.land
      ?.matrixThermalHistoricalSourceObservationAuthenticitySignedResponseContractMigrationCheckpoint ===
        false &&
    column.budget
      ?.matrixThermalHistoricalSourceObservationAuthenticitySignedResponseContract
      ?.digest === receipt.digest;
  const structuralValid = digestValid(receipt) && sourceIntegrity &&
    exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
      'sourceRequestContract', 'signedResponseRoutes', 'summary', 'emission',
      'truth', 'digest']) &&
    exact(receipt.creationContext, source?.creationContext) &&
    routesExact && summaryExact &&
    ['native-from-intact-r101-request-contract',
      'migration-from-exact-retained-r101-request-contract']
      .includes(receipt.emission?.mode) &&
    receipt.emission?.sourceWasExactRetainedRequestContractMigration ===
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
    signedResponseRouteCount:
      receipt.summary?.signedResponseRouteCount ?? null,
    signedResponseEligibleRouteCount:
      receipt.summary?.signedResponseEligibleRouteCount ?? null,
    authorityReviewRouteExcludedCount:
      receipt.summary?.authorityReviewRouteExcludedCount ?? null,
    signatureAlgorithmCount:
      receipt.summary?.signatureAlgorithmCount ?? null,
    signedResponseEnvelopeCount:
      receipt.summary?.signedResponseEnvelopeCount ?? null,
    signatureAssessmentCount:
      receipt.summary?.signatureAssessmentCount ?? null,
    trustedVerifierKeyCount:
      receipt.summary?.trustedVerifierKeyCount ?? null,
    independentVerifierCount:
      receipt.summary?.independentVerifierCount ?? null,
    persistedResponseCount:
      receipt.summary?.persistedResponseCount ?? null
  });
}
