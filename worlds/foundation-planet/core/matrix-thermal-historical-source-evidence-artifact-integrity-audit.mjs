import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_INTEGRITY_ROUTE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_BYTE_INPUT_SCHEMA,
  HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_MAX_BYTES,
  HISTORICAL_SOURCE_EVIDENCE_PACKAGE_MAX_BYTES
} from './matrix-thermal-historical-source-evidence-artifact-integrity.mjs?v=0.100.0-r100.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_INTAKE_CONTRACT_RECEIPT_SCHEMA,
  landMatrixThermalHistoricalSourceEvidenceIntakeContractReceiptValid
} from './matrix-thermal-historical-source-evidence-intake.mjs?v=0.100.0-r100.1';

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
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_INTEGRITY_CONTRACT_RECEIPT_SCHEMA ||
      typeof receipt.digest !== 'string') return false;
  const unsigned = clone(receipt);
  delete unsigned.digest;
  return stableDigest(unsigned) === receipt.digest;
}

function expectedRoutes(intakeContract) {
  return intakeContract.intakeSlots.map(slot => {
    const eligible = slot.candidateSubmissionAllowed === true &&
      slot.requestBinding?.gapType === 'EVIDENCE';
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_INTEGRITY_ROUTE_SCHEMA,
      routeId: `historical-source-artifact-integrity:${slot.slotId}`,
      intakeSlotId: slot.slotId,
      requestBinding: clone(slot.requestBinding),
      eligibleForArtifactIntegrityCheck: eligible,
      artifactByteInputSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_BYTE_INPUT_SCHEMA
        : null,
      digestAlgorithm: eligible ? 'SHA-256' : null,
      maximumArtifactBytes: eligible
        ? HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_MAX_BYTES : 0,
      verificationAction: eligible
        ? 'COMPARE_INERT_BYTES_TO_CLAIMED_SHA256'
        : 'NO_BYTE_VERIFICATION_AUTHORITY_REVIEW_ONLY',
      artifactSupply: null,
      artifactIntegrityReceipt: null,
      artifactIntegrityVerdict: 'UNKNOWN',
      observationAuthenticityVerdict: 'UNKNOWN',
      provenanceVerdict: 'UNKNOWN',
      physicalMeaningReviewVerdict: 'UNKNOWN',
      admissionVerdict: 'NOT_AUTHORIZED'
    };
  });
}

function expectedSummary(routes) {
  return {
    sourceIntakeContractCount: 1,
    integrityRouteCount: 28,
    evidenceArtifactIntegrityRouteCount: routes.filter(route =>
      route.eligibleForArtifactIntegrityCheck).length,
    authorityReviewRouteExcludedCount: routes.filter(route =>
      !route.eligibleForArtifactIntegrityCheck).length,
    maximumArtifactBytes: HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_MAX_BYTES,
    maximumPackageBytes: HISTORICAL_SOURCE_EVIDENCE_PACKAGE_MAX_BYTES,
    suppliedArtifactCount: 0,
    artifactIntegrityReceiptCount: 0,
    matchingArtifactDigestCount: 0,
    mismatchingArtifactDigestCount: 0,
    persistedArtifactByteCount: 0,
    persistedIntegrityAssessmentCount: 0,
    artifactByteIntegrityVerificationImplemented: true,
    observationAuthenticityVerificationImplemented: false,
    provenanceVerificationImplemented: false,
    physicalMeaningReviewImplemented: false,
    candidateAdmissionPathImplemented: false
  };
}

const expectedTruth = {
  exactR99IntakeContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourEvidenceArtifactIntegrityRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  sha256ByteComparisonImplemented: true,
  artifactByteInputResourceBounded: true,
  artifactBytesPersisted: false,
  integrityAssessmentsPersisted: false,
  artifactContentParsingImplemented: false,
  artifactContentExecutionImplemented: false,
  observationAuthenticityVerificationImplemented: false,
  provenanceVerificationImplemented: false,
  physicalMeaningReviewImplemented: false,
  evidenceVerified: false,
  authoritySelfAttestationAccepted: false,
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
    id: 'land-matrix-thermal-historical-source-evidence-artifact-integrity-contract',
    required: true,
    status,
    statement: 'Exact R99 evidence slots route to bounded inert-byte SHA-256 comparison while authenticity, provenance, meaning, persistence, authority, and admission remain unresolved.',
    detail
  };
}

export function
auditLandMatrixThermalHistoricalSourceEvidenceArtifactIntegrityContract(
  column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land
    ?.matrixThermalHistoricalSourceEvidenceArtifactIntegrityContractReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalHistoricalSourceEvidenceArtifactIntegrityContractMigrationCheckpoint ===
        true;
    return result(checkpoint ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'the source lineage does not retain an exact R99 intake contract'
        : 'a current loaded-land lineage is missing its R100 artifact-integrity contract'
    });
  }
  const intakeContract = receipt.sourceIntakeContract;
  const attachedIntakeContract = column.land
    ?.matrixThermalHistoricalSourceEvidenceIntakeContractReceipt;
  const sourceIntegrity =
    landMatrixThermalHistoricalSourceEvidenceIntakeContractReceiptValid(
      intakeContract) && exact(intakeContract, attachedIntakeContract) &&
    receipt.source?.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_INTAKE_CONTRACT_RECEIPT_SCHEMA &&
    receipt.source?.receiptDigest === intakeContract?.digest;
  const routes = sourceIntegrity ? expectedRoutes(intakeContract) : [];
  const routesExact = sourceIntegrity && exact(receipt.integrityRoutes, routes);
  const summaryExact = routesExact &&
    exact(receipt.summary, expectedSummary(routes));
  const routeBoundaryIntact = receipt.integrityRoutes?.length === 28 &&
    receipt.integrityRoutes.filter(route =>
      route.eligibleForArtifactIntegrityCheck).length === 24 &&
    receipt.integrityRoutes.filter(route =>
      !route.eligibleForArtifactIntegrityCheck).length === 4 &&
    receipt.integrityRoutes.every(route =>
      route.artifactSupply === null &&
      route.artifactIntegrityReceipt === null &&
      route.artifactIntegrityVerdict === 'UNKNOWN' &&
      route.observationAuthenticityVerdict === 'UNKNOWN' &&
      route.provenanceVerdict === 'UNKNOWN' &&
      route.physicalMeaningReviewVerdict === 'UNKNOWN' &&
      route.admissionVerdict === 'NOT_AUTHORIZED');
  const persistenceBound = column.land
      ?.matrixThermalHistoricalSourceEvidenceArtifactIntegrityContractMigrationCheckpoint ===
        false &&
    column.budget
      ?.matrixThermalHistoricalSourceEvidenceArtifactIntegrityContract
      ?.digest === receipt.digest;
  const structuralValid = digestValid(receipt) && sourceIntegrity &&
    exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
      'sourceIntakeContract', 'integrityRoutes', 'summary', 'emission',
      'truth', 'digest']) &&
    exact(receipt.creationContext, intakeContract?.creationContext) &&
    routesExact && summaryExact &&
    ['native-from-intact-r99-evidence-intake',
      'migration-from-exact-retained-r99-evidence-intake']
      .includes(receipt.emission?.mode) &&
    receipt.emission?.sourceWasExactRetainedEvidenceMigration ===
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
    integrityRouteCount: receipt.summary?.integrityRouteCount ?? null,
    evidenceArtifactIntegrityRouteCount:
      receipt.summary?.evidenceArtifactIntegrityRouteCount ?? null,
    authorityReviewRouteExcludedCount:
      receipt.summary?.authorityReviewRouteExcludedCount ?? null,
    suppliedArtifactCount: receipt.summary?.suppliedArtifactCount ?? null,
    artifactIntegrityReceiptCount:
      receipt.summary?.artifactIntegrityReceiptCount ?? null,
    persistedArtifactByteCount:
      receipt.summary?.persistedArtifactByteCount ?? null
  });
}
