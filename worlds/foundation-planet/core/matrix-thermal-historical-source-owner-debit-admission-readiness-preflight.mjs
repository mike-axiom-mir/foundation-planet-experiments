import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ARTIFACT_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
  landMatrixThermalHistoricalSourceEvidenceArtifactIntegrityContractReceiptValid
} from './matrix-thermal-historical-source-evidence-artifact-integrity.mjs?v=0.120.0-r120.1';
import {
  HISTORICAL_SOURCE_EVIDENCE_CAPABILITY_IDS
} from './matrix-thermal-historical-source-evidence-readiness.mjs?v=0.120.0-r120.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA,
  HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapRecursionPreflightContractReceiptValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapRecursionWitnessValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapClosurePreflightValid
} from './matrix-thermal-historical-source-host-governance-trust-bootstrap-recursion-preflight.mjs?v=0.120.0-r120.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-admission-readiness-preflight-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_MATRIX_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-admission-readiness-matrix/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_REPORT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-admission-readiness-report/v1';

export const HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_EVALUATE_CAPABILITY_ID =
  'analysis.foundation-planet.matrix-thermal.historical-source-owner-debit.admission.readiness.evaluate';

const CONTRACT_STATUS = 'OWNER_DEBIT_ADMISSION_READINESS_PREFLIGHT_AVAILABLE';
const MATRIX_STATUS = 'ALL_HISTORICAL_SOURCE_ROUTES_BLOCKED';
const REPORT_STATUS =
  'BLOCKED_MISSING_EXTERNAL_EVIDENCE_AND_HOST_AUTHORITY';
const EMISSION_MODE =
  'transient-analysis-from-exact-r100-artifact-integrity-and-r119-trust-bootstrap-boundaries';
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
  return 'fnv1a32:' + (hash >>> 0).toString(16).padStart(8, '0');
}

function digestValid(value, schema) {
  if (value?.schema !== schema || typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

const sourceRef = value => ({ schema: value.schema, receiptDigest: value.digest });
const historicalCapabilityIds = () =>
  Object.values(HISTORICAL_SOURCE_EVIDENCE_CAPABILITY_IDS);

function sourceBundleValid(artifactIntegrityContract, trustBootstrap) {
  return landMatrixThermalHistoricalSourceEvidenceArtifactIntegrityContractReceiptValid(
    artifactIntegrityContract) && exactKeys(trustBootstrap,
    ['contract', 'witness', 'preflight', 'sources']) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapRecursionPreflightContractReceiptValid(
      trustBootstrap.contract, trustBootstrap.sources) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapRecursionWitnessValid(
      trustBootstrap.witness, trustBootstrap.contract,
      trustBootstrap.sources) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapClosurePreflightValid(
      trustBootstrap.preflight, trustBootstrap.contract,
      trustBootstrap.witness, trustBootstrap.sources);
}

function expectedSourceContracts(artifactIntegrityContract, trustBootstrap) {
  return {
    r100ArtifactIntegrityContract: sourceRef(artifactIntegrityContract),
    r119TrustBootstrapContract: sourceRef(trustBootstrap.contract),
    r119TrustBootstrapWitness: sourceRef(trustBootstrap.witness),
    r119TrustBootstrapPreflight: sourceRef(trustBootstrap.preflight)
  };
}

const expectedContractTruth = () => ({
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
});

function expectedContract(artifactIntegrityContract, trustBootstrap) {
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
    status: CONTRACT_STATUS,
    sourceContracts: expectedSourceContracts(artifactIntegrityContract,
      trustBootstrap),
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
    emission: { mode: EMISSION_MODE },
    truth: expectedContractTruth()
  };
  receipt.digest = stableDigest(receipt);
  return receipt;
}

export function
landMatrixThermalHistoricalSourceOwnerDebitAdmissionReadinessPreflightContractReceiptValid(
  receipt, artifactIntegrityContract = null, trustBootstrap = null) {
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'sourceContracts',
        'routeProjection', 'emission', 'truth', 'digest']) ||
      !exactKeys(receipt.sourceContracts, ['r100ArtifactIntegrityContract',
        'r119TrustBootstrapContract', 'r119TrustBootstrapWitness',
        'r119TrustBootstrapPreflight']) ||
      !Object.values(receipt.sourceContracts).every(ref => exactKeys(ref,
        ['schema', 'receiptDigest'])) ||
      !exactKeys(receipt.routeProjection, ['sourceRouteCount',
        'evidenceRouteCount', 'authorityReviewRouteCount',
        'historicalSourceCapabilityIds', 'missingHostAuthorityCapabilityIds',
        'implementedAnalyticalCapabilityId']) ||
      !exactKeys(receipt.emission, ['mode']) ||
      receipt.status !== CONTRACT_STATUS ||
      receipt.routeProjection.sourceRouteCount !== 28 ||
      receipt.routeProjection.evidenceRouteCount !== 24 ||
      receipt.routeProjection.authorityReviewRouteCount !== 4 ||
      !exact(receipt.routeProjection.historicalSourceCapabilityIds,
        historicalCapabilityIds()) ||
      !Array.isArray(receipt.routeProjection.missingHostAuthorityCapabilityIds) ||
      receipt.routeProjection.missingHostAuthorityCapabilityIds.length !== 6 ||
      receipt.routeProjection.implementedAnalyticalCapabilityId !==
        HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_EVALUATE_CAPABILITY_ID ||
      receipt.emission.mode !== EMISSION_MODE ||
      !exact(receipt.truth, expectedContractTruth())) return false;
  return artifactIntegrityContract === null && trustBootstrap === null ||
    artifactIntegrityContract !== null && trustBootstrap !== null &&
    sourceBundleValid(artifactIntegrityContract, trustBootstrap) &&
    exact(receipt, expectedContract(artifactIntegrityContract,
      trustBootstrap));
}

export function
createLandMatrixThermalHistoricalSourceOwnerDebitAdmissionReadinessPreflightContractReceipt(
  artifactIntegrityContract, trustBootstrap) {
  if (!sourceBundleValid(artifactIntegrityContract, trustBootstrap)) {
    throw new Error(
      'Owner/debit admission readiness needs the exact R100 artifact-integrity and R119 trust-bootstrap boundaries');
  }
  return expectedContract(artifactIntegrityContract, trustBootstrap);
}

function routeReadiness(sourceRoute, ordinal) {
  const evidenceRoute = sourceRoute.eligibleForArtifactIntegrityCheck === true;
  return {
    ordinal,
    routeId: `historical-source-owner-debit-admission-readiness:${sourceRoute.intakeSlotId}`,
    sourceRoute: {
      schema: sourceRoute.schema,
      routeId: sourceRoute.routeId,
      intakeSlotId: sourceRoute.intakeSlotId,
      requestBindingDigest: stableDigest(sourceRoute.requestBinding)
    },
    requestBinding: clone(sourceRoute.requestBinding),
    routeClass: evidenceRoute
      ? 'EVIDENCE_ARTIFACT'
      : 'MIKE_TOBI_OR_AXM_AUTHORITY_REVIEW',
    byteIntegrityCapability: {
      implemented: evidenceRoute,
      receiptObserved: false,
      verdict: 'UNKNOWN'
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

function expectedRoutes(artifactIntegrityContract) {
  return artifactIntegrityContract.integrityRoutes.map((route, index) =>
    routeReadiness(route, index + 1));
}

const expectedMatrixTruth = () => ({
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
});

function expectedMatrix(contract, artifactIntegrityContract) {
  const routes = expectedRoutes(artifactIntegrityContract);
  const matrix = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_MATRIX_SCHEMA,
    status: MATRIX_STATUS,
    sourceContract: sourceRef(contract),
    routes,
    summary: {
      routeCount: routes.length,
      evidenceRouteCount: routes.filter(route =>
        route.routeClass === 'EVIDENCE_ARTIFACT').length,
      authorityReviewRouteCount: routes.filter(route =>
        route.routeClass === 'MIKE_TOBI_OR_AXM_AUTHORITY_REVIEW').length,
      byteIntegrityCapabilityReadyRouteCount: routes.filter(route =>
        route.byteIntegrityCapability.implemented).length,
      observedArtifactIntegrityReceiptCount: 0,
      authenticatedEvidenceRouteCount: 0,
      provenanceVerifiedRouteCount: 0,
      physicalMeaningReviewedRouteCount: 0,
      ownerResolvedRouteCount: 0,
      debitVerifiedRouteCount: 0,
      admissionReadyRouteCount: 0
    },
    truth: expectedMatrixTruth()
  };
  matrix.digest = stableDigest(matrix);
  return matrix;
}

export function
landMatrixThermalHistoricalSourceOwnerDebitAdmissionReadinessMatrixValid(
  matrix, contract = null, artifactIntegrityContract = null,
  trustBootstrap = null) {
  if (!digestValid(matrix,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_MATRIX_SCHEMA) ||
      !exactKeys(matrix, ['schema', 'status', 'sourceContract', 'routes',
        'summary', 'truth', 'digest']) ||
      !exactKeys(matrix.sourceContract, ['schema', 'receiptDigest']) ||
      !Array.isArray(matrix.routes) || matrix.routes.length !== 28 ||
      !matrix.routes.every((route, index) => exactKeys(route,
        ['ordinal', 'routeId', 'sourceRoute', 'requestBinding', 'routeClass',
          'byteIntegrityCapability', 'verification', 'closure', 'nextAction']) &&
        route.ordinal === index + 1 && exactKeys(route.sourceRoute,
        ['schema', 'routeId', 'intakeSlotId', 'requestBindingDigest']) &&
        exactKeys(route.byteIntegrityCapability,
          ['implemented', 'receiptObserved', 'verdict']) &&
        exactKeys(route.verification, ['observationAuthenticityVerdict',
          'provenanceVerdict', 'physicalMeaningReviewVerdict']) &&
        exactKeys(route.closure, ['trustBootstrapVerdict',
          'historicalSourceOwnerVerdict', 'historicalSourceDebitVerdict',
          'admissionVerdict'])) ||
      !exactKeys(matrix.summary, ['routeCount', 'evidenceRouteCount',
        'authorityReviewRouteCount', 'byteIntegrityCapabilityReadyRouteCount',
        'observedArtifactIntegrityReceiptCount',
        'authenticatedEvidenceRouteCount', 'provenanceVerifiedRouteCount',
        'physicalMeaningReviewedRouteCount', 'ownerResolvedRouteCount',
        'debitVerifiedRouteCount', 'admissionReadyRouteCount']) ||
      matrix.status !== MATRIX_STATUS || matrix.summary.routeCount !== 28 ||
      matrix.summary.evidenceRouteCount !== 24 ||
      matrix.summary.authorityReviewRouteCount !== 4 ||
      matrix.summary.byteIntegrityCapabilityReadyRouteCount !== 24 ||
      Object.entries(matrix.summary).some(([key, value]) =>
        !['routeCount', 'evidenceRouteCount', 'authorityReviewRouteCount',
          'byteIntegrityCapabilityReadyRouteCount'].includes(key) && value !== 0) ||
      !exact(matrix.truth, expectedMatrixTruth())) return false;
  return contract === null && artifactIntegrityContract === null &&
      trustBootstrap === null ||
    contract !== null && artifactIntegrityContract !== null &&
      trustBootstrap !== null && sourceBundleValid(artifactIntegrityContract,
      trustBootstrap) &&
      landMatrixThermalHistoricalSourceOwnerDebitAdmissionReadinessPreflightContractReceiptValid(
        contract, artifactIntegrityContract, trustBootstrap) &&
      exact(matrix, expectedMatrix(contract, artifactIntegrityContract));
}

export function
createLandMatrixThermalHistoricalSourceOwnerDebitAdmissionReadinessMatrix(
  contract, artifactIntegrityContract, trustBootstrap) {
  if (!landMatrixThermalHistoricalSourceOwnerDebitAdmissionReadinessPreflightContractReceiptValid(
      contract, artifactIntegrityContract, trustBootstrap)) {
    throw new Error(
      'Owner/debit readiness matrix needs the exact R120 contract and its R100/R119 sources');
  }
  return expectedMatrix(contract, artifactIntegrityContract);
}

function proofSurface(nativeEvidenceKind) {
  return {
    persistence:
      'RESTART_RELOAD_COMPARISON_OF_TYPED_PRE_AND_POST_OWNER_STATE',
    'static structure':
      'PARSED_SCHEMA_IDENTITY_SCOPE_AND_UNITS_DECLARATION',
    transport:
      'SENDER_AND_RECEIVER_RECEIPTS_TIED_BY_TRANSACTION_ID_AND_DIGEST',
    'taste or meaning':
      'EXPLICIT_MIKE_TOBI_OR_AXM_REVIEW_DECISION'
  }[nativeEvidenceKind];
}

function evidenceCapabilityRequirements(matrix) {
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

const expectedReportTruth = () => ({
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
});

function expectedReport(contract, matrix, trustBootstrap) {
  const report = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_REPORT_SCHEMA,
    status: REPORT_STATUS,
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
    evidenceCapabilityRequirements: evidenceCapabilityRequirements(matrix),
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
    truth: expectedReportTruth()
  };
  report.digest = stableDigest(report);
  return report;
}

export function
landMatrixThermalHistoricalSourceOwnerDebitAdmissionReadinessReportValid(
  report, contract = null, matrix = null, artifactIntegrityContract = null,
  trustBootstrap = null) {
  if (!digestValid(report,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_REPORT_SCHEMA) ||
      !exactKeys(report, ['schema', 'status', 'sourceContract', 'sourceMatrix',
        'capabilityGap', 'evidenceCapabilityRequirements',
        'hostEvidenceRequirements', 'prohibitedShortcuts', 'truth', 'digest']) ||
      !exactKeys(report.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(report.sourceMatrix, ['schema', 'receiptDigest']) ||
      !exactKeys(report.capabilityGap, ['overall',
        'availableAnalyticalCapabilityIds',
        'missingHistoricalSourceCapabilityIds',
        'missingHostAuthorityCapabilityIds']) ||
      !Array.isArray(report.evidenceCapabilityRequirements) ||
      report.evidenceCapabilityRequirements.length !== 9 ||
      !report.evidenceCapabilityRequirements.every(entry => exactKeys(entry,
        ['capabilityId', 'gapType', 'routeCount', 'routeIds',
          'nativeEvidenceKinds', 'expectedArtifactKinds',
          'requiredProofSurfaces', 'satisfied', 'disposition']) &&
        entry.routeCount > 0 && entry.satisfied === false &&
        entry.disposition === 'BLOCKED') ||
      !Array.isArray(report.hostEvidenceRequirements) ||
      report.hostEvidenceRequirements.length !== 6 ||
      !exactKeys(report.prohibitedShortcuts,
        ['treatDigestMatchAsEvidenceVerification',
          'acceptCandidateSelfAttestation', 'recursivelySelfAuthorizeHostPolicy',
          'treatLocallyCreatedRequestAsHostExecution',
          'inferOwnerOrDebitAcrossRoutes', 'mutateOwnersOrWorld']) ||
      report.status !== REPORT_STATUS || report.capabilityGap.overall !==
        'BLOCKED' ||
      !exact(report.capabilityGap.availableAnalyticalCapabilityIds, [
        HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID,
        HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_EVALUATE_CAPABILITY_ID
      ]) ||
      !exact(report.capabilityGap.missingHistoricalSourceCapabilityIds,
        historicalCapabilityIds()) ||
      !Array.isArray(report.capabilityGap.missingHostAuthorityCapabilityIds) ||
      report.capabilityGap.missingHostAuthorityCapabilityIds.length !== 6 ||
      !Object.values(report.prohibitedShortcuts)
        .every(value => value === true) ||
      !exact(report.truth, expectedReportTruth())) return false;
  return contract === null && matrix === null &&
      artifactIntegrityContract === null && trustBootstrap === null ||
    contract !== null && matrix !== null && artifactIntegrityContract !== null &&
      trustBootstrap !== null && sourceBundleValid(artifactIntegrityContract,
      trustBootstrap) &&
      landMatrixThermalHistoricalSourceOwnerDebitAdmissionReadinessPreflightContractReceiptValid(
        contract, artifactIntegrityContract, trustBootstrap) &&
      landMatrixThermalHistoricalSourceOwnerDebitAdmissionReadinessMatrixValid(
        matrix, contract, artifactIntegrityContract, trustBootstrap) &&
      exact(report, expectedReport(contract, matrix, trustBootstrap));
}

export function
createLandMatrixThermalHistoricalSourceOwnerDebitAdmissionReadinessReport(
  contract, matrix, artifactIntegrityContract, trustBootstrap) {
  if (!landMatrixThermalHistoricalSourceOwnerDebitAdmissionReadinessMatrixValid(
      matrix, contract, artifactIntegrityContract, trustBootstrap)) {
    throw new Error(
      'Owner/debit admission readiness report needs the exact R120 contract, matrix, and R100/R119 sources');
  }
  return expectedReport(contract, matrix, trustBootstrap);
}

export function
matrixThermalHistoricalSourceOwnerDebitAdmissionReadinessPreflightDescription() {
  return {
    status: 'EXPERIMENTAL',
    capabilityId:
      HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_EVALUATE_CAPABILITY_ID,
    statement:
      'R120 joins the exact R100 artifact-integrity route inventory to the exact R119 anti-recursion boundary and reports why every historical owner/debit admission route remains blocked.',
    boundaries: [
      'SHA-256 byte equality can establish artifact integrity only; it is not authenticity, provenance, physical meaning, owner resolution, debit proof, or admission.',
      'Candidate self-attestation, locally created requests, and recursively caller-supplied policy cannot establish external host authority.',
      'No endpoint, transport, persistence, owner/debit state, admission, world mutation, promotion, or canonization is performed.'
    ]
  };
}
