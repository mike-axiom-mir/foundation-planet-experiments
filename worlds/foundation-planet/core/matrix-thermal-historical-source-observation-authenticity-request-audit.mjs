import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_ROUTE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_VERIFICATION_REQUEST_SCHEMA,
  OBSERVATION_AUTHENTICITY_VERIFICATION_CAPABILITY_ID
} from './matrix-thermal-historical-source-observation-authenticity-request.mjs?v=0.101.0-r101.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
  landMatrixThermalHistoricalSourceEvidenceArtifactIntegrityContractReceiptValid
} from './matrix-thermal-historical-source-evidence-artifact-integrity.mjs?v=0.101.0-r101.1';

const clone = value => JSON.parse(JSON.stringify(value));
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const exactKeys = (value, keys) => value && typeof value === 'object' &&
  exact(Object.keys(value).sort(), [...keys].sort());

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
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_REQUEST_CONTRACT_RECEIPT_SCHEMA ||
      typeof receipt.digest !== 'string') return false;
  const unsigned = clone(receipt);
  delete unsigned.digest;
  return stableDigest(unsigned) === receipt.digest;
}

function proofPlanFor(nativeEvidenceKind) {
  if (nativeEvidenceKind === 'persistence') {
    return {
      claimKind: 'persistence',
      minimumEvidence: ['save-stop-or-restart-reload-and-compare-state'],
      strongerEvidence: [
        'fresh-process-or-device-recovery-with-lineage-comparison'
      ],
      counterevidence: ['pre-restart-state-only',
        'artifact-digest-match-only', 'candidate-producer-claim-only']
    };
  }
  if (nativeEvidenceKind === 'static structure') {
    return {
      claimKind: 'static structure',
      minimumEvidence: [
        'direct-source-artifact-and-declared-schema-inspection'
      ],
      strongerEvidence: [
        'independent-inventory-plus-digest-reconstruction'
      ],
      counterevidence: ['candidate-producer-claim-only',
        'artifact-digest-match-only',
        'runtime-success-without-source-identity-proof']
    };
  }
  if (nativeEvidenceKind === 'transport') {
    return {
      claimKind: 'transport',
      minimumEvidence: [
        'sender-and-receiver-receipts-tied-by-identifier'
      ],
      strongerEvidence: [
        'payload-digest-acknowledgement-and-applied-state-evidence'
      ],
      counterevidence: ['sender-receipt-only',
        'artifact-digest-match-only',
        'receiver-presence-without-application-proof']
    };
  }
  return null;
}

function expectedRoutes(artifactIntegrityContract) {
  return artifactIntegrityContract.integrityRoutes.map(integrityRoute => {
    const eligible = integrityRoute.eligibleForArtifactIntegrityCheck === true;
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_ROUTE_SCHEMA,
      routeId: `observation-authenticity:${integrityRoute.routeId}`,
      sourceIntegrityRouteId: integrityRoute.routeId,
      requestBinding: clone(integrityRoute.requestBinding),
      eligibleForObservationAuthenticityRequest: eligible,
      verificationCapabilityId: eligible
        ? OBSERVATION_AUTHENTICITY_VERIFICATION_CAPABILITY_ID : null,
      verificationRequestSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OBSERVATION_AUTHENTICITY_VERIFICATION_REQUEST_SCHEMA
        : null,
      proofPlan: eligible
        ? proofPlanFor(integrityRoute.requestBinding.nativeEvidenceKind) : null,
      requiresIndependentVerifier: eligible,
      candidateCanSelfVerify: false,
      trustedVerifierIdentity: null,
      observedAuthenticityEvidence: [],
      verificationDecision: null,
      observationAuthenticityVerdict: 'UNKNOWN',
      provenanceVerdict: 'UNKNOWN',
      physicalMeaningReviewVerdict: 'UNKNOWN',
      admissionVerdict: 'NOT_AUTHORIZED'
    };
  });
}

function expectedSummary(routes) {
  return {
    sourceArtifactIntegrityContractCount: 1,
    authenticityRouteCount: 28,
    observationAuthenticityRequestRouteCount: routes.filter(route =>
      route.eligibleForObservationAuthenticityRequest).length,
    authorityReviewRouteExcludedCount: routes.filter(route =>
      !route.eligibleForObservationAuthenticityRequest).length,
    nativeEvidenceKindCount: new Set(routes.filter(route =>
      route.eligibleForObservationAuthenticityRequest)
      .map(route => route.requestBinding.nativeEvidenceKind)).size,
    generatedRequestPacketCount: 0,
    observedAuthenticityEvidenceCount: 0,
    trustedVerifierIdentityCount: 0,
    verifierDecisionCount: 0,
    verifiedAuthenticObservationCount: 0,
    persistedRequestPacketCount: 0,
    observationAuthenticityRequestContractImplemented: true,
    observationAuthenticityVerificationImplemented: false,
    physicalMeaningReviewImplemented: false,
    candidateAdmissionPathImplemented: false
  };
}

const expectedTruth = {
  exactR100ArtifactIntegrityContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourObservationAuthenticityRequestRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  nativeClaimEvidencePlansDeclared: true,
  requestPacketGenerationImplemented: true,
  independentVerifierRequired: true,
  candidateSelfVerificationAccepted: false,
  trustedVerifierRegistryConfigured: false,
  trustedVerifierIdentityBound: false,
  observationAuthenticityEvidenceObserved: false,
  observationAuthenticityVerificationImplemented: false,
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
    id: 'land-matrix-thermal-historical-source-observation-authenticity-request-contract',
    required: true,
    status,
    statement: 'Exact R100 routes declare native evidence plans for independent observation-authenticity requests while verifier identity, evidence, decision, meaning, authority, and admission remain unresolved.',
    detail
  };
}

export function
auditLandMatrixThermalHistoricalSourceObservationAuthenticityRequestContract(
  column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land
    ?.matrixThermalHistoricalSourceObservationAuthenticityRequestContractReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalHistoricalSourceObservationAuthenticityRequestContractMigrationCheckpoint ===
        true;
    return result(checkpoint ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'the source lineage does not retain an exact R100 artifact-integrity contract'
        : 'a current loaded-land lineage is missing its R101 observation-authenticity request contract'
    });
  }
  const source = receipt.sourceArtifactIntegrityContract;
  const attachedSource = column.land
    ?.matrixThermalHistoricalSourceEvidenceArtifactIntegrityContractReceipt;
  const sourceIntegrity =
    landMatrixThermalHistoricalSourceEvidenceArtifactIntegrityContractReceiptValid(
      source) && exact(source, attachedSource) &&
    receipt.source?.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    receipt.source?.receiptDigest === source?.digest;
  const routes = sourceIntegrity ? expectedRoutes(source) : [];
  const routesExact = sourceIntegrity &&
    !routes.some(route => route.proofPlan === null &&
      route.eligibleForObservationAuthenticityRequest) &&
    exact(receipt.authenticityRoutes, routes);
  const summaryExact = routesExact &&
    exact(receipt.summary, expectedSummary(routes));
  const routeBoundaryIntact = receipt.authenticityRoutes?.length === 28 &&
    receipt.authenticityRoutes.filter(route =>
      route.eligibleForObservationAuthenticityRequest).length === 24 &&
    receipt.authenticityRoutes.filter(route =>
      !route.eligibleForObservationAuthenticityRequest).length === 4 &&
    receipt.authenticityRoutes.every(route =>
      route.candidateCanSelfVerify === false &&
      route.trustedVerifierIdentity === null &&
      Array.isArray(route.observedAuthenticityEvidence) &&
      route.observedAuthenticityEvidence.length === 0 &&
      route.verificationDecision === null &&
      route.observationAuthenticityVerdict === 'UNKNOWN' &&
      route.provenanceVerdict === 'UNKNOWN' &&
      route.physicalMeaningReviewVerdict === 'UNKNOWN' &&
      route.admissionVerdict === 'NOT_AUTHORIZED');
  const persistenceBound = column.land
      ?.matrixThermalHistoricalSourceObservationAuthenticityRequestContractMigrationCheckpoint ===
        false &&
    column.budget
      ?.matrixThermalHistoricalSourceObservationAuthenticityRequestContract
      ?.digest === receipt.digest;
  const structuralValid = digestValid(receipt) && sourceIntegrity &&
    exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
      'sourceArtifactIntegrityContract', 'authenticityRoutes', 'summary',
      'emission', 'truth', 'digest']) &&
    exact(receipt.creationContext, source?.creationContext) &&
    routesExact && summaryExact &&
    ['native-from-intact-r100-artifact-integrity',
      'migration-from-exact-retained-r100-artifact-integrity']
      .includes(receipt.emission?.mode) &&
    receipt.emission?.sourceWasExactRetainedArtifactIntegrityMigration ===
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
    authenticityRouteCount: receipt.summary?.authenticityRouteCount ?? null,
    observationAuthenticityRequestRouteCount:
      receipt.summary?.observationAuthenticityRequestRouteCount ?? null,
    authorityReviewRouteExcludedCount:
      receipt.summary?.authorityReviewRouteExcludedCount ?? null,
    nativeEvidenceKindCount:
      receipt.summary?.nativeEvidenceKindCount ?? null,
    observedAuthenticityEvidenceCount:
      receipt.summary?.observedAuthenticityEvidenceCount ?? null,
    trustedVerifierIdentityCount:
      receipt.summary?.trustedVerifierIdentityCount ?? null,
    verifierDecisionCount: receipt.summary?.verifierDecisionCount ?? null,
    persistedRequestPacketCount:
      receipt.summary?.persistedRequestPacketCount ?? null
  });
}
