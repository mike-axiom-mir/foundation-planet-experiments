import {
  HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID
} from './matrix-thermal-historical-source-verifier-key-binding-authority-decision-integrity.mjs?v=0.109.0-r109.1';
import {
  HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signature-integrity.mjs?v=0.109.0-r109.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA,
  HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-request.mjs?v=0.109.0-r109.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ASSESSMENT_SCHEMA,
  landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid
} from './matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-authority-decision-integrity.mjs?v=0.109.0-r109.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_ROUTE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_EVIDENCE_REQUIREMENT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_PACKET_SCHEMA,
  HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_CREATE_CAPABILITY_ID,
  HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
  HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-root-admission-request.mjs?v=0.109.0-r109.1';

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
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_CONTRACT_RECEIPT_SCHEMA ||
      typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function expectedEvidenceRequirements() {
  const requirement = (requirementId, requiredCapabilityId,
    acceptableEvidenceOrigin) => ({
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_EVIDENCE_REQUIREMENT_SCHEMA,
    requirementId,
    requiredCapabilityId,
    acceptableEvidenceOrigin,
    forbiddenEvidenceOrigin:
      'CALLER_PACKET_OR_CANDIDATE_KEY_SELF_ASSERTION',
    satisfied: false,
    verdict: 'UNKNOWN'
  });
  return [
    requirement('host-controlled-root-origin-isolation',
      HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
      'HOST_CONTROLLED_OUT_OF_BAND_CONFIGURATION'),
    requirement('host-identity-and-governance-scope-binding',
      HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
      'HOST_CONTROLLED_OUT_OF_BAND_CONFIGURATION'),
    requirement('decision-policy-key-delegation',
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
      'HOST_GOVERNANCE_ROOT_SIGNED_DELEGATION'),
    requirement('revocation-policy-key-delegation',
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
      'HOST_GOVERNANCE_ROOT_SIGNED_DELEGATION'),
    requirement('delegation-current-and-non-revoked',
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
      'HOST_GOVERNANCE_REVOCATION_STATE'),
    requirement('candidate-receipt-signer-key-separation',
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
      'HOST_GOVERNANCE_ROOT_SIGNED_DELEGATION'),
    requirement('host-challenge-and-replay-gated-admission',
      HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID,
      'HOST_GENERATED_CHALLENGE_AND_REPLAY_LEDGER')
  ];
}

function expectedRoutes(sourceContract) {
  return sourceContract.bindingDecisionIntegrityRoutes.map(sourceRoute => {
    const eligible = sourceRoute
      .eligibleForReceiptSignerKeyBindingAuthorityDecisionIntegrity === true;
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_ROUTE_SCHEMA,
      routeId: `host-governance-trust-root-admission:${sourceRoute.routeId}`,
      sourceBindingDecisionIntegrityRouteId: sourceRoute.routeId,
      requestBinding: clone(sourceRoute.requestBinding),
      eligibleForHostGovernanceTrustRootAdmissionRequest: eligible,
      sourceRequestPacketSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA
        : null,
      sourceIntegrityAssessmentSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ASSESSMENT_SCHEMA
        : null,
      hostGovernanceTrustRootAdmissionRequestPacketSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_PACKET_SCHEMA
        : null,
      implementedHostGovernanceTrustRootAdmissionRequestCreateCapabilityId:
        eligible
          ? HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_CREATE_CAPABILITY_ID
          : null,
      requiredHostGovernanceTrustRootResolveCapabilityId: eligible
        ? HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID : null,
      requiredPolicyKeyDelegationVerifyCapabilityId: eligible
        ? HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID : null,
      requiredHostGovernanceTrustRootAdmissionDecideCapabilityId: eligible
        ? HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID : null,
      requiredReceiptSignerKeyBindingCapabilityId: eligible
        ? HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_CAPABILITY_ID
        : null,
      requiredProvisioningReceiptVerifyCapabilityId: eligible
        ? HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID : null,
      requiredHostTrustAnchorProvisionCapabilityId: eligible
        ? HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID : null,
      hostGovernanceTrustRootResolutionVerdict: eligible ? 'UNKNOWN' : null,
      policyKeyDelegationVerificationVerdict: eligible ? 'UNKNOWN' : null,
      hostGovernanceAdmissionVerdict: eligible ? 'NOT_AUTHORIZED' : null,
      receiptSignerKeyBindingVerdict: eligible ? 'UNKNOWN' : null,
      provisioningReceiptVerificationVerdict: eligible ? 'UNKNOWN' : null,
      hostTrustAnchorProvisioned: false
    };
  });
}

function expectedSummary(routes, requirements) {
  const eligible = routes.filter(route =>
    route.eligibleForHostGovernanceTrustRootAdmissionRequest).length;
  return {
    sourceR108BindingDecisionIntegrityContractCount: 1,
    hostGovernanceTrustRootAdmissionRouteCount: routes.length,
    hostGovernanceTrustRootAdmissionEligibleRouteCount: eligible,
    authorityReviewRouteExcludedCount: routes.length - eligible,
    hostGovernanceEvidenceRequirementCount: requirements.length,
    implementedAdmissionRequestCreateRouteCount: eligible,
    persistedAdmissionRequestPacketCount: 0,
    persistedHostGovernanceEvidenceCount: 0,
    resolvedHostGovernanceTrustRootCount: 0,
    verifiedPolicyKeyDelegationCount: 0,
    hostGovernanceAdmissionDecisionCount: 0,
    trustedReceiptSignerKeyBindingCount: 0,
    verifiedProvisioningReceiptCount: 0,
    hostTrustAnchorCount: 0,
    hostGovernanceTrustRootResolutionImplemented: false,
    policyKeyDelegationVerificationImplemented: false,
    hostGovernanceTrustRootAdmissionDecisionImplemented: false,
    receiptSignerKeyBindingImplemented: false,
    provisioningReceiptVerificationImplemented: false,
    hostTrustAnchorProvisioningImplemented: false
  };
}

const expectedTruth = {
  exactR108BindingDecisionIntegrityContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourAdmissionRequestRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  exactR107RequestPacketRequired: true,
  exactR108PolicyDecisionRevocationAndAssessmentRequired: true,
  hostGovernanceTrustRootAdmissionRequestCreationImplemented: true,
  requestRequiresReportedR108IntegrityPass: true,
  r108CryptographyReverifiedByThisContract: false,
  callerSuppliedPolicyTrusted: false,
  candidatePacketMaySupplyTrustRoot: false,
  trustRootMustResolveFromHostControlledOutOfBandConfiguration: true,
  hostGovernanceTrustRootResolved: false,
  hostIdentityAuthenticated: false,
  policyKeyDelegationVerified: false,
  hostGovernanceAdmissionDecisionImplemented: false,
  hostGovernanceAdmissionAuthorized: false,
  receiptSignerKeyBindingImplemented: false,
  provisioningReceiptVerified: false,
  hostAuthorityToProvisionEstablished: false,
  hostAccepted: false,
  hostTrustAnchorProvisioned: false,
  trustedVerifierKeyBindingImplemented: false,
  observationAuthenticityVerified: false,
  evidenceVerified: false,
  admissionRequestPacketPersisted: false,
  hostGovernanceEvidencePersisted: false,
  rawTrustRootPublicKeysPersisted: false,
  rawPolicyPublicKeysPersisted: false,
  signatureBytesPersisted: false,
  replayLedgerImplemented: false,
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
    id: 'land-matrix-thermal-historical-source-host-governance-trust-root-admission-request-contract',
    required: true,
    status,
    statement: 'Exact R108 routes gain transient host-governance trust-root admission-request routing with explicit out-of-band evidence requirements, while root resolution, delegation verification, admission, binding, receipt verification, provisioning, persistence, and mutation remain unresolved.',
    detail
  };
}

export function
auditLandMatrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestContract(
  column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land
    ?.matrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestContractReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestContractMigrationCheckpoint ===
        true;
    return result(checkpoint ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'the source lineage does not retain an exact R108 binding-decision integrity contract'
        : 'a current loaded-land lineage is missing its R109 host-governance trust-root admission request contract'
    });
  }
  const source = receipt.sourceBindingDecisionIntegrityContract;
  const attachedSource = column.land
    ?.matrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityContractReceipt;
  const sourceIntegrity =
    landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      source) && exact(source, attachedSource) &&
    receipt.source?.schema === source?.schema &&
    receipt.source?.receiptDigest === source?.digest;
  const routes = sourceIntegrity ? expectedRoutes(source) : [];
  const requirements = expectedEvidenceRequirements();
  const routesExact = sourceIntegrity &&
    exact(receipt.hostGovernanceTrustRootAdmissionRoutes, routes);
  const requirementsExact =
    exact(receipt.evidenceRequirements, requirements);
  const summaryExact = routesExact && requirementsExact &&
    exact(receipt.summary, expectedSummary(routes, requirements));
  const routeBoundaryIntact =
    receipt.hostGovernanceTrustRootAdmissionRoutes?.length === 28 &&
    receipt.hostGovernanceTrustRootAdmissionRoutes.filter(route =>
      route.eligibleForHostGovernanceTrustRootAdmissionRequest).length === 24 &&
    receipt.hostGovernanceTrustRootAdmissionRoutes.filter(route =>
      !route.eligibleForHostGovernanceTrustRootAdmissionRequest).length === 4 &&
    receipt.hostGovernanceTrustRootAdmissionRoutes.every(route =>
      route.hostTrustAnchorProvisioned === false);
  const capabilityBoundaryIntact =
    receipt.hostGovernanceTrustRootAdmissionRoutes.every(route =>
      route.eligibleForHostGovernanceTrustRootAdmissionRequest
        ? route.implementedHostGovernanceTrustRootAdmissionRequestCreateCapabilityId ===
            HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_CREATE_CAPABILITY_ID &&
          route.requiredHostGovernanceTrustRootResolveCapabilityId ===
            HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID &&
          route.requiredPolicyKeyDelegationVerifyCapabilityId ===
            HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID &&
          route.requiredHostGovernanceTrustRootAdmissionDecideCapabilityId ===
            HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID &&
          route.requiredReceiptSignerKeyBindingCapabilityId ===
            HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_CAPABILITY_ID &&
          route.requiredProvisioningReceiptVerifyCapabilityId ===
            HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID &&
          route.requiredHostTrustAnchorProvisionCapabilityId ===
            HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID &&
          route.hostGovernanceTrustRootResolutionVerdict === 'UNKNOWN' &&
          route.policyKeyDelegationVerificationVerdict === 'UNKNOWN' &&
          route.hostGovernanceAdmissionVerdict === 'NOT_AUTHORIZED' &&
          route.receiptSignerKeyBindingVerdict === 'UNKNOWN'
        : route.implementedHostGovernanceTrustRootAdmissionRequestCreateCapabilityId ===
            null &&
          route.requiredHostGovernanceTrustRootResolveCapabilityId === null &&
          route.requiredPolicyKeyDelegationVerifyCapabilityId === null &&
          route.requiredHostGovernanceTrustRootAdmissionDecideCapabilityId ===
            null && route.requiredReceiptSignerKeyBindingCapabilityId === null &&
          route.requiredProvisioningReceiptVerifyCapabilityId === null &&
          route.requiredHostTrustAnchorProvisionCapabilityId === null &&
          route.hostGovernanceTrustRootResolutionVerdict === null &&
          route.policyKeyDelegationVerificationVerdict === null &&
          route.hostGovernanceAdmissionVerdict === null &&
          route.receiptSignerKeyBindingVerdict === null);
  const persistenceBound = column.land
      ?.matrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestContractMigrationCheckpoint ===
        false && column.budget
      ?.matrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestContract
      ?.digest === receipt.digest;
  const structuralValid = digestValid(receipt) && sourceIntegrity &&
    exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
      'sourceBindingDecisionIntegrityContract',
      'hostGovernanceTrustRootAdmissionRoutes', 'evidenceRequirements',
      'summary', 'emission', 'truth', 'digest']) &&
    exact(receipt.creationContext, source?.creationContext) && routesExact &&
    requirementsExact && summaryExact &&
    ['native-from-intact-r108-binding-decision-integrity-contract',
      'migration-from-exact-retained-r108-binding-decision-integrity-contract']
      .includes(receipt.emission?.mode) &&
    receipt.emission
      ?.sourceWasExactRetainedR108BindingDecisionIntegrityContractMigration ===
        receipt.emission?.mode.startsWith('migration-');
  const truthValid = exact(receipt.truth, expectedTruth);
  const valid = structuralValid && routeBoundaryIntact &&
    capabilityBoundaryIntact && truthValid && persistenceBound;
  return result(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt.schema || null,
    structuralValid,
    sourceIntegrity,
    routesExact,
    requirementsExact,
    summaryExact,
    routeBoundaryIntact,
    capabilityBoundaryIntact,
    truthValid,
    persistenceBound,
    hostGovernanceTrustRootAdmissionRouteCount:
      receipt.summary?.hostGovernanceTrustRootAdmissionRouteCount ?? null,
    hostGovernanceTrustRootAdmissionEligibleRouteCount:
      receipt.summary?.hostGovernanceTrustRootAdmissionEligibleRouteCount ??
        null,
    authorityReviewRouteExcludedCount:
      receipt.summary?.authorityReviewRouteExcludedCount ?? null,
    hostGovernanceEvidenceRequirementCount:
      receipt.summary?.hostGovernanceEvidenceRequirementCount ?? null,
    persistedAdmissionRequestPacketCount:
      receipt.summary?.persistedAdmissionRequestPacketCount ?? null,
    resolvedHostGovernanceTrustRootCount:
      receipt.summary?.resolvedHostGovernanceTrustRootCount ?? null,
    verifiedPolicyKeyDelegationCount:
      receipt.summary?.verifiedPolicyKeyDelegationCount ?? null,
    hostGovernanceAdmissionDecisionCount:
      receipt.summary?.hostGovernanceAdmissionDecisionCount ?? null,
    emissionMode: receipt.emission?.mode || null,
    sourceR108BindingDecisionIntegrityContractDigest:
      receipt.source?.receiptDigest || null,
    receiptDigest: receipt.digest || null
  });
}
