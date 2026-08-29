import {
  landMatrixThermalHistoricalSourceEvidenceArtifactIntegrityContractReceiptValid
} from './matrix-thermal-historical-source-evidence-artifact-integrity.mjs?v=0.120.0-r120.1';
import {
  HISTORICAL_SOURCE_EVIDENCE_CAPABILITY_IDS
} from './matrix-thermal-historical-source-evidence-readiness.mjs?v=0.120.0-r120.1';
import {
  HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapRecursionPreflightContractReceiptValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapRecursionWitnessValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapClosurePreflightValid
} from './matrix-thermal-historical-source-host-governance-trust-bootstrap-recursion-preflight.mjs?v=0.120.0-r120.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_MATRIX_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_REPORT_SCHEMA,
  HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_EVALUATE_CAPABILITY_ID
} from './matrix-thermal-historical-source-owner-debit-admission-readiness-preflight.mjs?v=0.120.0-r120.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_PREFLIGHT_AUDIT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-admission-readiness-preflight-audit/v1';

const clone = value => JSON.parse(JSON.stringify(value));
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);

function stableDigest(value) {
  const text = JSON.stringify(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return 'fnv1a32:' + (hash >>> 0).toString(16).padStart(8, '0');
}

const sourceRef = value => ({ schema: value.schema, receiptDigest: value.digest });
const historicalCapabilityIds = () =>
  Object.values(HISTORICAL_SOURCE_EVIDENCE_CAPABILITY_IDS);
const withDigest = value => {
  const result = clone(value);
  result.digest = stableDigest(result);
  return result;
};

function sourcesValid(artifactIntegrityContract, trustBootstrap) {
  return landMatrixThermalHistoricalSourceEvidenceArtifactIntegrityContractReceiptValid(
    artifactIntegrityContract) &&
    trustBootstrap && exact(Object.keys(trustBootstrap).sort(),
      ['contract', 'preflight', 'sources', 'witness']) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapRecursionPreflightContractReceiptValid(
      trustBootstrap.contract, trustBootstrap.sources) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapRecursionWitnessValid(
      trustBootstrap.witness, trustBootstrap.contract,
      trustBootstrap.sources) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapClosurePreflightValid(
      trustBootstrap.preflight, trustBootstrap.contract,
      trustBootstrap.witness, trustBootstrap.sources);
}

function expectedContract(artifactIntegrityContract, trustBootstrap) {
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
    status: 'OWNER_DEBIT_ADMISSION_READINESS_PREFLIGHT_AVAILABLE',
    sourceContracts: {
      r100ArtifactIntegrityContract: sourceRef(artifactIntegrityContract),
      r119TrustBootstrapContract: sourceRef(trustBootstrap.contract),
      r119TrustBootstrapWitness: sourceRef(trustBootstrap.witness),
      r119TrustBootstrapPreflight: sourceRef(trustBootstrap.preflight)
    },
    routeProjection: {
      sourceRouteCount:
        artifactIntegrityContract.summary.integrityRouteCount,
      evidenceRouteCount:
        artifactIntegrityContract.summary.evidenceArtifactIntegrityRouteCount,
      authorityReviewRouteCount:
        artifactIntegrityContract.summary.authorityReviewRouteExcludedCount,
      historicalSourceCapabilityIds: historicalCapabilityIds(),
      missingHostAuthorityCapabilityIds: clone(trustBootstrap.preflight
        .capabilityGap.missingAuthorityCapabilityIds),
      implementedAnalyticalCapabilityId:
        HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_EVALUATE_CAPABILITY_ID
    },
    emission: {
      mode:
        'transient-analysis-from-exact-r100-artifact-integrity-and-r119-trust-bootstrap-boundaries'
    },
    truth: {
      exactR100ArtifactIntegrityBoundaryBound: true,
      exactR119TrustBootstrapBoundaryBound: true,
      allTwentyEightHistoricalSourceRoutesPreserved: true,
      localAdmissionReadinessAnalysisCapabilityReady: true,
      digestMatchAcceptedAsEvidenceVerification: false,
      candidateSelfAttestationAccepted: false,
      recursiveCallerPolicyAcceptedAsAuthority: false,
      locallyCreatedRequestAcceptedAsHostExecution: false,
      independentlyAuthenticatedHistoricalEvidencePresent: false,
      independentlyAuthenticatedHostAuthorityPresent: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      admissionAuthorized: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  });
}

function expectedRoute(sourceRoute, index) {
  const evidenceRoute = sourceRoute.eligibleForArtifactIntegrityCheck === true;
  return {
    ordinal: index + 1,
    routeId: `historical-source-owner-debit-admission-readiness:${sourceRoute.intakeSlotId}`,
    sourceRoute: {
      schema: sourceRoute.schema,
      routeId: sourceRoute.routeId,
      intakeSlotId: sourceRoute.intakeSlotId,
      requestBindingDigest: stableDigest(sourceRoute.requestBinding)
    },
    requestBinding: clone(sourceRoute.requestBinding),
    routeClass: evidenceRoute
      ? 'EVIDENCE_ARTIFACT' : 'MIKE_TOBI_OR_AXM_AUTHORITY_REVIEW',
    byteIntegrityCapability: {
      implemented: evidenceRoute, receiptObserved: false, verdict: 'UNKNOWN'
    },
    verification: {
      observationAuthenticityVerdict: 'UNKNOWN',
      provenanceVerdict: 'UNKNOWN',
      physicalMeaningReviewVerdict: 'UNKNOWN'
    },
    closure: {
      trustBootstrapVerdict: 'BLOCKED',
      historicalSourceOwnerVerdict: 'UNRESOLVED',
      historicalSourceDebitVerdict: 'UNVERIFIED',
      admissionVerdict: 'NOT_AUTHORIZED'
    },
    nextAction: evidenceRoute
      ? 'ACQUIRE_INDEPENDENTLY_AUTHENTICATED_EXTERNAL_EVIDENCE'
      : 'AWAIT_MIKE_TOBI_OR_AXM_PHYSICAL_MEANING_REVIEW'
  };
}

function expectedMatrix(contract, artifactIntegrityContract) {
  const routes = artifactIntegrityContract.integrityRoutes.map(expectedRoute);
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_MATRIX_SCHEMA,
    status: 'ALL_HISTORICAL_SOURCE_ROUTES_BLOCKED',
    sourceContract: sourceRef(contract),
    routes,
    summary: {
      routeCount: 28,
      evidenceRouteCount: 24,
      authorityReviewRouteCount: 4,
      byteIntegrityCapabilityReadyRouteCount: 24,
      observedArtifactIntegrityReceiptCount: 0,
      authenticatedEvidenceRouteCount: 0,
      provenanceVerifiedRouteCount: 0,
      physicalMeaningReviewedRouteCount: 0,
      ownerResolvedRouteCount: 0,
      debitVerifiedRouteCount: 0,
      admissionReadyRouteCount: 0
    },
    truth: {
      routeProjectionOnly: true,
      sourceArtifactBytesObserved: false,
      artifactIntegrityReceiptsObserved: false,
      observationAuthenticityVerified: false,
      provenanceVerified: false,
      physicalMeaningReviewGranted: false,
      trustBootstrapClosed: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      anyRouteAdmissionReady: false,
      crossRouteOwnerOrDebitInferencePerformed: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  });
}

function proofSurface(kind) {
  return {
    persistence:
      'RESTART_RELOAD_COMPARISON_OF_TYPED_PRE_AND_POST_OWNER_STATE',
    'static structure':
      'PARSED_SCHEMA_IDENTITY_SCOPE_AND_UNITS_DECLARATION',
    transport:
      'SENDER_AND_RECEIVER_RECEIPTS_TIED_BY_TRANSACTION_ID_AND_DIGEST',
    'taste or meaning':
      'EXPLICIT_MIKE_TOBI_OR_AXM_REVIEW_DECISION'
  }[kind];
}

function expectedRequirements(matrix) {
  return historicalCapabilityIds().map(capabilityId => {
    const routes = matrix.routes.filter(route =>
      route.requestBinding.capabilityId === capabilityId);
    return {
      capabilityId,
      gapType: routes[0].requestBinding.gapType,
      routeCount: routes.length,
      routeIds: routes.map(route => route.routeId),
      nativeEvidenceKinds: [...new Set(routes.map(route =>
        route.requestBinding.nativeEvidenceKind))],
      expectedArtifactKinds: [...new Set(routes.map(route =>
        route.requestBinding.expectedArtifactKind))],
      requiredProofSurfaces: [...new Set(routes.map(route =>
        proofSurface(route.requestBinding.nativeEvidenceKind)))],
      satisfied: false,
      disposition: 'BLOCKED'
    };
  });
}

function expectedReport(contract, matrix, trustBootstrap) {
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_REPORT_SCHEMA,
    status: 'BLOCKED_MISSING_EXTERNAL_EVIDENCE_AND_HOST_AUTHORITY',
    sourceContract: sourceRef(contract),
    sourceMatrix: sourceRef(matrix),
    capabilityGap: {
      overall: 'BLOCKED',
      availableAnalyticalCapabilityIds: [
        HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID,
        HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_EVALUATE_CAPABILITY_ID
      ],
      missingHistoricalSourceCapabilityIds: historicalCapabilityIds(),
      missingHostAuthorityCapabilityIds: clone(trustBootstrap.preflight
        .capabilityGap.missingAuthorityCapabilityIds)
    },
    evidenceCapabilityRequirements: expectedRequirements(matrix),
    hostEvidenceRequirements: clone(trustBootstrap.preflight
      .requiredExternalEvidence),
    prohibitedShortcuts: {
      treatDigestMatchAsEvidenceVerification: true,
      acceptCandidateSelfAttestation: true,
      recursivelySelfAuthorizeHostPolicy: true,
      treatLocallyCreatedRequestAsHostExecution: true,
      inferOwnerOrDebitAcrossRoutes: true,
      mutateOwnersOrWorld: true
    },
    truth: {
      localAnalysisCapabilityReady: true,
      historicalEvidenceCapabilitiesAvailable: false,
      hostAuthorityCapabilitiesAvailable: false,
      independentlyAuthenticatedEvidencePresent: false,
      trustBootstrapClosureReady: false,
      physicalMeaningReviewPresent: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      admissionReady: false,
      reportMayAuthorize: false,
      endpointResolved: false,
      transportPerformed: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  });
}

export function
auditLandMatrixThermalHistoricalSourceOwnerDebitAdmissionReadinessPreflight(
  contract, matrix, report, artifactIntegrityContract, trustBootstrap) {
  const sourceValidity = sourcesValid(artifactIntegrityContract,
    trustBootstrap);
  const expectedContractValue = sourceValidity
    ? expectedContract(artifactIntegrityContract, trustBootstrap) : null;
  const contractExact = sourceValidity && exact(contract,
    expectedContractValue);
  const expectedMatrixValue = contractExact
    ? expectedMatrix(expectedContractValue, artifactIntegrityContract) : null;
  const matrixExact = contractExact && exact(matrix, expectedMatrixValue);
  const expectedReportValue = matrixExact
    ? expectedReport(expectedContractValue, expectedMatrixValue,
      trustBootstrap) : null;
  const reportExact = matrixExact && exact(report, expectedReportValue);
  const checks = {
    exactR100ArtifactIntegrityBoundaryValid: sourceValidity,
    exactR119TrustBootstrapBoundaryValid: sourceValidity,
    contractIndependentlyReconstructed: contractExact,
    allTwentyEightRoutesIndependentlyReconstructed: matrixExact,
    nineHistoricalCapabilityRequirementsPreserved: reportExact &&
      report.evidenceCapabilityRequirements.length === 9,
    sixHostAuthorityRequirementsPreserved: reportExact &&
      report.hostEvidenceRequirements.length === 6,
    everyRouteStillBlocked: matrixExact &&
      matrix.summary.admissionReadyRouteCount === 0,
    prohibitedShortcutsFailClosed: reportExact &&
      Object.values(report.prohibitedShortcuts).every(value => value === true),
    reportIndependentlyReconstructed: reportExact
  };
  const pass = Object.values(checks).every(value => value === true);
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_PREFLIGHT_AUDIT_SCHEMA,
    status: pass ? 'PASS' : 'FAIL',
    checks,
    detail: {
      sourceRouteCount: sourceValidity
        ? artifactIntegrityContract.integrityRoutes.length : 0,
      missingHistoricalSourceCapabilityCount: reportExact
        ? report.capabilityGap.missingHistoricalSourceCapabilityIds.length : 0,
      missingHostAuthorityCapabilityCount: reportExact
        ? report.capabilityGap.missingHostAuthorityCapabilityIds.length : 0,
      admittedRouteCount: matrixExact
        ? matrix.summary.admissionReadyRouteCount : 0
    },
    truth: {
      auditReconstructedR120OutputsWithoutCallingR120BuildersOrValidators: true,
      auditMayAuthorizeAdmission: false,
      auditMayResolveHistoricalOwnersOrDebits: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  };
}
