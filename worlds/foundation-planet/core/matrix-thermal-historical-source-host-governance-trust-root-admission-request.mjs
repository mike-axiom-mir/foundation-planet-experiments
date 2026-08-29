import {
  HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID
} from './matrix-thermal-historical-source-verifier-key-binding-authority-decision-integrity.mjs?v=0.109.0-r109.1';
import {
  HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signature-integrity.mjs?v=0.109.0-r109.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA,
  HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestPacketValid
} from './matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-request.mjs?v=0.109.0-r109.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_ENVELOPE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REVOCATION_SNAPSHOT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ASSESSMENT_SCHEMA,
  landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid,
  landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingCallerSuppliedPolicyDescriptorValid,
  landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionEnvelopeValid,
  landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRevocationSnapshotValid,
  landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityAssessmentValid
} from './matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-authority-decision-integrity.mjs?v=0.109.0-r109.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-admission-request-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_ROUTE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-admission-request-route/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_EVIDENCE_REQUIREMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-evidence-requirement/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_ENTRY_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-admission-request-entry/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_PACKET_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-admission-request-packet/v1';

export const HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_CREATE_CAPABILITY_ID =
  'authority.host-governance.trust-root.admission.request.create';
export const HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID =
  'authority.host-governance.trust-root.resolve';
export const HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID =
  'authority.host-governance.policy-key.delegation.verify';
export const HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID =
  'authority.host-governance.trust-root.admission.decide';

const UNKNOWN = 'UNKNOWN';
const NOT_AUTHORIZED = 'NOT_AUTHORIZED';
const NATIVE_EMISSION_MODE =
  'native-from-intact-r108-binding-decision-integrity-contract';
const MIGRATION_EMISSION_MODE =
  'migration-from-exact-retained-r108-binding-decision-integrity-contract';
const MAXIMUM_REQUEST_LIFETIME_MS = 15 * 60 * 1000;
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

function digestValid(value, schema) {
  if (value?.schema !== schema || typeof value.digest !== 'string') {
    return false;
  }
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

const fnvDigest = value => typeof value === 'string' &&
  /^fnv1a32:[a-f0-9]{8}$/.test(value);
const sha256Digest = value => typeof value === 'string' &&
  /^sha256:[a-f0-9]{64}$/.test(value);
const hostWorldDigest = value => typeof value === 'string' &&
  /^[a-f0-9]{64}$/.test(value);
const nonEmptyText = (value, maximum = 4096) =>
  typeof value === 'string' && value.trim().length > 0 &&
    value.length <= maximum;
const isoTimestamp = value =>
  nonEmptyText(value, 64) && Number.isFinite(Date.parse(value));
const unique = values => new Set(values).size === values.length;
const sorted = values => exact(values, [...values].sort());
const sourceRef = value => ({ schema: value.schema, receiptDigest: value.digest });

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
    verdict: UNKNOWN
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
      hostGovernanceTrustRootResolutionVerdict: eligible ? UNKNOWN : null,
      policyKeyDelegationVerificationVerdict: eligible ? UNKNOWN : null,
      hostGovernanceAdmissionVerdict: eligible ? NOT_AUTHORIZED : null,
      receiptSignerKeyBindingVerdict: eligible ? UNKNOWN : null,
      provisioningReceiptVerificationVerdict: eligible ? UNKNOWN : null,
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

const expectedContractTruth = () => ({
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
});

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestContractReceiptValid(
  receipt) {
  const source = receipt?.sourceBindingDecisionIntegrityContract;
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
        'sourceBindingDecisionIntegrityContract',
        'hostGovernanceTrustRootAdmissionRoutes', 'evidenceRequirements',
        'summary', 'emission', 'truth', 'digest']) ||
      !exactKeys(receipt.source, ['schema', 'receiptDigest']) ||
      !exactKeys(receipt.emission, ['mode',
        'sourceWasExactRetainedR108BindingDecisionIntegrityContractMigration']) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
        source)) return false;
  const routes = expectedRoutes(source);
  const requirements = expectedEvidenceRequirements();
  const migration = receipt.emission.mode === MIGRATION_EMISSION_MODE;
  return receipt.status ===
      'HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_ROUTING_AVAILABLE_WITHOUT_TRUST_ROOT_RESOLUTION_DELEGATION_VERIFICATION_ADMISSION_OR_BINDING' &&
    exact(receipt.creationContext, source.creationContext) &&
    receipt.source.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    receipt.source.receiptDigest === source.digest &&
    exact(receipt.hostGovernanceTrustRootAdmissionRoutes, routes) &&
    exact(receipt.evidenceRequirements, requirements) &&
    exact(receipt.summary, expectedSummary(routes, requirements)) &&
    [NATIVE_EMISSION_MODE, MIGRATION_EMISSION_MODE]
      .includes(receipt.emission.mode) &&
    receipt.emission
      .sourceWasExactRetainedR108BindingDecisionIntegrityContractMigration ===
        migration && exact(receipt.truth, expectedContractTruth());
}

export function
createLandMatrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestContractReceipt(
  creationContext, sourceContract, options = {}) {
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      sourceContract) || !exact(creationContext, sourceContract.creationContext)) {
    throw new Error(
      'Host-governance trust-root admission routing needs the exact attached R108 binding-decision integrity contract');
  }
  const routes = expectedRoutes(sourceContract);
  const requirements = expectedEvidenceRequirements();
  const migration = options
    .sourceWasExactRetainedR108BindingDecisionIntegrityContractMigration ===
      true;
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    status:
      'HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_ROUTING_AVAILABLE_WITHOUT_TRUST_ROOT_RESOLUTION_DELEGATION_VERIFICATION_ADMISSION_OR_BINDING',
    creationContext: clone(creationContext),
    source: sourceRef(sourceContract),
    sourceBindingDecisionIntegrityContract: clone(sourceContract),
    hostGovernanceTrustRootAdmissionRoutes: routes,
    evidenceRequirements: requirements,
    summary: expectedSummary(routes, requirements),
    emission: {
      mode: migration ? MIGRATION_EMISSION_MODE : NATIVE_EMISSION_MODE,
      sourceWasExactRetainedR108BindingDecisionIntegrityContractMigration:
        migration
    },
    truth: expectedContractTruth()
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestContractReceiptValid(
      receipt)) {
    throw new Error('Host-governance trust-root admission contract failed validation');
  }
  return receipt;
}

function expectedAdmissionRequests(requestId, requestPacket, decisionEnvelope) {
  const requests = new Map(requestPacket.receiptSignerKeyBindingRequests.map(
    request => [request.requestId, request]));
  return decisionEnvelope.decisions.filter(decision =>
    decision.action === 'BIND').map(decision => {
    const sourceRequest = requests.get(decision.requestId);
    if (!sourceRequest || decision.requestBindingDigest !==
        stableDigest(sourceRequest.requestBinding) ||
        !exact(decision.requestedBinding, sourceRequest.requestedBinding)) {
      throw new Error('A BIND claim does not match its exact R107 request');
    }
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_ENTRY_SCHEMA,
      admissionRequestId:
        `host-governance-trust-root-admission:${requestId}:${decision.requestId}`,
      sourceBindingRequestId: decision.requestId,
      sourceRequestBindingDigest: decision.requestBindingDigest,
      sourceDecisionEntryDigest: stableDigest(decision),
      requestBinding: clone(sourceRequest.requestBinding),
      requestedBinding: clone(sourceRequest.requestedBinding),
      requestedAction: 'BIND_AFTER_HOST_GOVERNANCE_ADMISSION',
      actualEffects: {
        trustPolicyKeys: false,
        applyReceiptSignerKeyBinding: false,
        verifyProvisioningReceipt: false,
        installHostTrustAnchor: false,
        persist: false,
        worldMutationPerformed: false
      }
    };
  }).sort((left, right) => left.sourceBindingRequestId <
      right.sourceBindingRequestId ? -1
    : left.sourceBindingRequestId > right.sourceBindingRequestId ? 1 : 0);
}

function admissionRequestShapeValid(request) {
  return exactKeys(request, ['schema', 'admissionRequestId',
      'sourceBindingRequestId', 'sourceRequestBindingDigest',
      'sourceDecisionEntryDigest', 'requestBinding', 'requestedBinding',
      'requestedAction', 'actualEffects']) &&
    exactKeys(request.actualEffects, ['trustPolicyKeys',
      'applyReceiptSignerKeyBinding', 'verifyProvisioningReceipt',
      'installHostTrustAnchor', 'persist', 'worldMutationPerformed']) &&
    request.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_ENTRY_SCHEMA &&
    nonEmptyText(request.admissionRequestId, 4096) &&
    nonEmptyText(request.sourceBindingRequestId, 2048) &&
    fnvDigest(request.sourceRequestBindingDigest) &&
    fnvDigest(request.sourceDecisionEntryDigest) &&
    request.requestBinding && typeof request.requestBinding === 'object' &&
    request.requestedBinding && typeof request.requestedBinding === 'object' &&
    request.requestedAction === 'BIND_AFTER_HOST_GOVERNANCE_ADMISSION' &&
    exact(request.actualEffects, {
      trustPolicyKeys: false,
      applyReceiptSignerKeyBinding: false,
      verifyProvisioningReceipt: false,
      installHostTrustAnchor: false,
      persist: false,
      worldMutationPerformed: false
    });
}

function expectedPacketSummary(requests, requirements) {
  return {
    r108IntegrityAssessmentReportedPassCount: 1,
    requestedBindAdmissionCount: requests.length,
    hostGovernanceEvidenceRequirementCount: requirements.length,
    suppliedTrustRootEvidenceCount: 0,
    resolvedHostGovernanceTrustRootCount: 0,
    verifiedPolicyKeyDelegationCount: 0,
    hostGovernanceAdmissionDecisionCount: 0,
    appliedReceiptSignerKeyBindingCount: 0,
    verifiedProvisioningReceiptCount: 0,
    installedHostTrustAnchorCount: 0,
    persistedAdmissionRequestPacketCount: 0
  };
}

const expectedPacketTruth = () => ({
  exactR109ContractBound: true,
  exactR108ContractBound: true,
  exactR107RequestPacketBound: true,
  exactR108PolicyDecisionRevocationAndAssessmentBound: true,
  r108IntegrityAssessmentReportsPass: true,
  r108CryptographyReverifiedByThisPacket: false,
  onlyBindClaimsRouted: true,
  candidatePacketSuppliesTrustRoot: false,
  candidatePolicyKeysTrusted: false,
  trustRootMustComeFromHostControlledOutOfBandConfiguration: true,
  hostGovernanceTrustRootResolved: false,
  hostIdentityAuthenticated: false,
  policyKeyDelegationVerified: false,
  hostChallengeResponseVerified: false,
  replayLedgerConsumed: false,
  hostGovernanceAdmissionDecided: false,
  hostGovernanceAdmissionAuthorized: false,
  receiptSignerKeyBound: false,
  provisioningReceiptVerified: false,
  hostAuthorityToProvisionEstablished: false,
  hostAccepted: false,
  hostTrustAnchorProvisioned: false,
  admissionRequestPacketPersisted: false,
  hostGovernanceEvidencePersisted: false,
  rawTrustRootPublicKeysPersisted: false,
  rawPolicyPublicKeysPersisted: false,
  signatureBytesPersisted: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  worldMutationPerformed: false
});

function evidenceRequirementShapeValid(requirement) {
  return exactKeys(requirement, ['schema', 'requirementId',
      'requiredCapabilityId', 'acceptableEvidenceOrigin',
      'forbiddenEvidenceOrigin', 'satisfied', 'verdict']) &&
    requirement.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_EVIDENCE_REQUIREMENT_SCHEMA &&
    nonEmptyText(requirement.requirementId, 256) &&
    nonEmptyText(requirement.requiredCapabilityId, 256) &&
    nonEmptyText(requirement.acceptableEvidenceOrigin, 256) &&
    requirement.forbiddenEvidenceOrigin ===
      'CALLER_PACKET_OR_CANDIDATE_KEY_SELF_ASSERTION' &&
    requirement.satisfied === false && requirement.verdict === UNKNOWN;
}

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestPacketValid(
  packet, contract = null, requestPacket = null, policy = null,
  decisionEnvelope = null, revocationSnapshot = null,
  integrityAssessment = null) {
  if (!digestValid(packet,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_PACKET_SCHEMA) ||
      !exactKeys(packet, ['schema', 'status', 'requestId', 'issuedAt',
        'expiresAt', 'sourceContract', 'sourceR108Contract',
        'sourceR107RequestPacket', 'sourcePolicyDescriptor',
        'sourceDecisionEnvelope', 'sourceRevocationSnapshot',
        'sourceIntegrityAssessment', 'hostGovernanceTarget',
        'candidatePolicy', 'claimedReceiptSigner', 'challenge',
        'admissionRequests', 'evidenceRequirements', 'summary', 'verdicts',
        'truth', 'digest']) ||
      !exactKeys(packet.hostGovernanceTarget, ['claimedGovernanceDomainId',
        'worldId', 'lineageId', 'hostRevision', 'worldDigest', 'status']) ||
      !exactKeys(packet.candidatePolicy, ['claimedReviewSeatId',
        'decisionKeyId', 'decisionPublicKeySha256', 'revocationKeyId',
        'revocationPublicKeySha256', 'trustVerdict']) ||
      !exactKeys(packet.claimedReceiptSigner, ['claimedHostAuthoritySeatId',
        'claimedHostAuthorityKeyId', 'claimedHostAuthorityPublicKeySha256',
        'bindingVerdict']) ||
      !exactKeys(packet.challenge, ['nonce',
        'mustBeAnsweredByHostResolvedTrustRoot', 'replayLedgerRequired',
        'consumed']) || !Array.isArray(packet.admissionRequests) ||
      packet.admissionRequests.length < 1 ||
      packet.admissionRequests.length > 24 ||
      !packet.admissionRequests.every(admissionRequestShapeValid) ||
      !Array.isArray(packet.evidenceRequirements) ||
      !packet.evidenceRequirements.every(evidenceRequirementShapeValid) ||
      !exactKeys(packet.verdicts, ['requestRoutingVerdict',
        'sourceIntegrityAssessmentVerdict', 'callerSuppliedPolicyTrustVerdict',
        'hostGovernanceTrustRootResolutionVerdict',
        'policyKeyDelegationVerificationVerdict',
        'hostIdentityAuthenticationVerdict',
        'hostGovernanceAdmissionVerdict', 'receiptSignerKeyBindingVerdict',
        'provisioningReceiptVerificationVerdict',
        'hostTrustAnchorProvisioningVerdict'])) return false;
  const sourceShape = value => exactKeys(value, ['schema', 'receiptDigest']) &&
    nonEmptyText(value.schema, 512) && fnvDigest(value.receiptDigest);
  if (![packet.sourceContract, packet.sourceR108Contract,
    packet.sourceR107RequestPacket, packet.sourcePolicyDescriptor,
    packet.sourceDecisionEnvelope, packet.sourceRevocationSnapshot,
    packet.sourceIntegrityAssessment].every(sourceShape)) return false;
  const ids = packet.admissionRequests.map(request =>
    request.sourceBindingRequestId);
  const requirements = expectedEvidenceRequirements();
  const structural = packet.status ===
      'ROUTED_TO_EXTERNAL_HOST_GOVERNANCE_GATE_NOT_AUTHORIZED' &&
    nonEmptyText(packet.requestId, 256) && isoTimestamp(packet.issuedAt) &&
    isoTimestamp(packet.expiresAt) &&
    Date.parse(packet.expiresAt) > Date.parse(packet.issuedAt) &&
    Date.parse(packet.expiresAt) - Date.parse(packet.issuedAt) <=
      MAXIMUM_REQUEST_LIFETIME_MS &&
    packet.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_CONTRACT_RECEIPT_SCHEMA &&
    packet.sourceR108Contract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    packet.sourceR107RequestPacket.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA &&
    packet.sourcePolicyDescriptor.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA &&
    packet.sourceDecisionEnvelope.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_ENVELOPE_SCHEMA &&
    packet.sourceRevocationSnapshot.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REVOCATION_SNAPSHOT_SCHEMA &&
    packet.sourceIntegrityAssessment.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ASSESSMENT_SCHEMA &&
    nonEmptyText(packet.hostGovernanceTarget.claimedGovernanceDomainId, 256) &&
    nonEmptyText(packet.hostGovernanceTarget.worldId, 256) &&
    nonEmptyText(packet.hostGovernanceTarget.lineageId, 512) &&
    Number.isInteger(packet.hostGovernanceTarget.hostRevision) &&
    packet.hostGovernanceTarget.hostRevision >= 0 &&
    hostWorldDigest(packet.hostGovernanceTarget.worldDigest) &&
    packet.hostGovernanceTarget.status ===
      'CALLER_NAMED_TARGET_NOT_AUTHENTICATED' &&
    nonEmptyText(packet.candidatePolicy.claimedReviewSeatId, 256) &&
    nonEmptyText(packet.candidatePolicy.decisionKeyId, 256) &&
    sha256Digest(packet.candidatePolicy.decisionPublicKeySha256) &&
    nonEmptyText(packet.candidatePolicy.revocationKeyId, 256) &&
    sha256Digest(packet.candidatePolicy.revocationPublicKeySha256) &&
    packet.candidatePolicy.decisionPublicKeySha256 !==
      packet.candidatePolicy.revocationPublicKeySha256 &&
    packet.candidatePolicy.trustVerdict === 'UNTRUSTED_CALLER_SUPPLIED' &&
    nonEmptyText(packet.claimedReceiptSigner.claimedHostAuthoritySeatId, 256) &&
    nonEmptyText(packet.claimedReceiptSigner.claimedHostAuthorityKeyId, 256) &&
    sha256Digest(packet.claimedReceiptSigner
      .claimedHostAuthorityPublicKeySha256) &&
    packet.claimedReceiptSigner.bindingVerdict === UNKNOWN &&
    nonEmptyText(packet.challenge.nonce, 256) &&
    packet.challenge.mustBeAnsweredByHostResolvedTrustRoot === true &&
    packet.challenge.replayLedgerRequired === true &&
    packet.challenge.consumed === false && unique(ids) && sorted(ids) &&
    exact(packet.evidenceRequirements, requirements) &&
    exact(packet.summary,
      expectedPacketSummary(packet.admissionRequests, requirements)) &&
    exact(packet.verdicts, {
      requestRoutingVerdict: 'ROUTED_NOT_AUTHORIZED',
      sourceIntegrityAssessmentVerdict: 'REPORTED_PASS_UNTRUSTED',
      callerSuppliedPolicyTrustVerdict: 'UNTRUSTED_CALLER_SUPPLIED',
      hostGovernanceTrustRootResolutionVerdict: UNKNOWN,
      policyKeyDelegationVerificationVerdict: UNKNOWN,
      hostIdentityAuthenticationVerdict: UNKNOWN,
      hostGovernanceAdmissionVerdict: NOT_AUTHORIZED,
      receiptSignerKeyBindingVerdict: UNKNOWN,
      provisioningReceiptVerificationVerdict: UNKNOWN,
      hostTrustAnchorProvisioningVerdict: UNKNOWN
    }) && exact(packet.truth, expectedPacketTruth());
  if (!structural || contract === null) return structural;
  if (!requestPacket || !policy || !decisionEnvelope || !revocationSnapshot ||
      !integrityAssessment ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestContractReceiptValid(
        contract) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestPacketValid(
        requestPacket) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingCallerSuppliedPolicyDescriptorValid(
        policy, contract.sourceBindingDecisionIntegrityContract,
        requestPacket) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionEnvelopeValid(
        decisionEnvelope, contract.sourceBindingDecisionIntegrityContract,
        requestPacket, policy) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRevocationSnapshotValid(
        revocationSnapshot, contract.sourceBindingDecisionIntegrityContract,
        policy) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityAssessmentValid(
        integrityAssessment)) return false;
  const assessmentSourcesExact =
    exact(integrityAssessment.sourceContract,
      sourceRef(contract.sourceBindingDecisionIntegrityContract)) &&
    exact(integrityAssessment.sourceRequestPacket, sourceRef(requestPacket)) &&
    exact(integrityAssessment.sourcePolicyDescriptor, sourceRef(policy)) &&
    exact(integrityAssessment.sourceDecisionEnvelope,
      sourceRef(decisionEnvelope)) &&
    exact(integrityAssessment.sourceRevocationSnapshot,
      sourceRef(revocationSnapshot));
  let expectedRequests;
  try {
    expectedRequests = expectedAdmissionRequests(packet.requestId,
      requestPacket, decisionEnvelope);
  } catch {
    return false;
  }
  const reference = requestPacket.receiptSignerKeyBindingRequests[0]
    ?.claimedHostReference;
  const sourceRefsExact = exact(packet.sourceContract, sourceRef(contract)) &&
    exact(packet.sourceR108Contract,
      sourceRef(contract.sourceBindingDecisionIntegrityContract)) &&
    exact(packet.sourceR107RequestPacket, sourceRef(requestPacket)) &&
    exact(packet.sourcePolicyDescriptor, sourceRef(policy)) &&
    exact(packet.sourceDecisionEnvelope, sourceRef(decisionEnvelope)) &&
    exact(packet.sourceRevocationSnapshot, sourceRef(revocationSnapshot)) &&
    exact(packet.sourceIntegrityAssessment, sourceRef(integrityAssessment));
  const latestSourceExpiry = Math.min(Date.parse(policy.validity.expiresAt),
    Date.parse(decisionEnvelope.expiresAt),
    Date.parse(revocationSnapshot.expiresAt));
  return sourceRefsExact && assessmentSourcesExact &&
    contract.source.receiptDigest ===
      contract.sourceBindingDecisionIntegrityContract.digest &&
    integrityAssessment.verdicts.decisionAndRevocationIntegrityVerdict ===
      'PASS' && integrityAssessment.issues.length === 0 &&
    integrityAssessment.requestedActions.bind === expectedRequests.length &&
    integrityAssessment.requestedActions.bind > 0 &&
    integrityAssessment.requestedActions.appliedBindings === 0 &&
    Date.parse(packet.issuedAt) >= Date.parse(integrityAssessment.evaluatedAt) &&
    Date.parse(packet.expiresAt) <= latestSourceExpiry &&
    packet.challenge.nonce !== decisionEnvelope.nonce &&
    packet.challenge.nonce !== revocationSnapshot.nonce &&
    packet.requestId !== decisionEnvelope.decisionId &&
    reference && exact(packet.hostGovernanceTarget, {
      claimedGovernanceDomainId:
        packet.hostGovernanceTarget.claimedGovernanceDomainId,
      worldId: reference.worldId,
      lineageId: reference.lineageId,
      hostRevision: reference.hostRevision,
      worldDigest: reference.worldDigest,
      status: 'CALLER_NAMED_TARGET_NOT_AUTHENTICATED'
    }) && exact(packet.candidatePolicy, {
      claimedReviewSeatId: policy.claimedReviewSeatId,
      decisionKeyId: policy.decisionKey.keyId,
      decisionPublicKeySha256: policy.decisionKey.publicKeySha256,
      revocationKeyId: policy.revocationKey.keyId,
      revocationPublicKeySha256: policy.revocationKey.publicKeySha256,
      trustVerdict: 'UNTRUSTED_CALLER_SUPPLIED'
    }) && exact(packet.claimedReceiptSigner, {
      claimedHostAuthoritySeatId:
        requestPacket.claimedAuthority.claimedHostAuthoritySeatId,
      claimedHostAuthorityKeyId:
        requestPacket.claimedAuthority.claimedHostAuthorityKeyId,
      claimedHostAuthorityPublicKeySha256:
        requestPacket.claimedAuthority.claimedHostAuthorityPublicKeySha256,
      bindingVerdict: UNKNOWN
    }) && exact(packet.admissionRequests, expectedRequests);
}

export function
createLandMatrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestPacket(
  contract, requestPacket, policy, decisionEnvelope, revocationSnapshot,
  integrityAssessment, input) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestContractReceiptValid(
      contract) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestPacketValid(
        requestPacket) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingCallerSuppliedPolicyDescriptorValid(
        policy, contract.sourceBindingDecisionIntegrityContract,
        requestPacket) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionEnvelopeValid(
        decisionEnvelope, contract.sourceBindingDecisionIntegrityContract,
        requestPacket, policy) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRevocationSnapshotValid(
        revocationSnapshot, contract.sourceBindingDecisionIntegrityContract,
        policy) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityAssessmentValid(
        integrityAssessment) ||
      !exactKeys(input, ['requestId', 'issuedAt', 'expiresAt',
        'challengeNonce', 'claimedHostGovernanceDomainId'])) {
    throw new Error(
      'Host-governance trust-root admission request needs exact R109/R108/R107 transient sources and bounded input');
  }
  const requests = expectedAdmissionRequests(input.requestId, requestPacket,
    decisionEnvelope);
  if (requests.length < 1 ||
      integrityAssessment.verdicts.decisionAndRevocationIntegrityVerdict !==
        'PASS' || integrityAssessment.issues.length !== 0 ||
      integrityAssessment.requestedActions.bind !== requests.length ||
      integrityAssessment.requestedActions.appliedBindings !== 0) {
    throw new Error(
      'Admission routing requires an exact reported R108 integrity PASS with at least one unapplied BIND claim');
  }
  const reference = requestPacket.receiptSignerKeyBindingRequests[0]
    ?.claimedHostReference;
  if (!reference) throw new Error('Admission routing needs an exact host reference');
  const requirements = expectedEvidenceRequirements();
  const packet = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_PACKET_SCHEMA,
    status: 'ROUTED_TO_EXTERNAL_HOST_GOVERNANCE_GATE_NOT_AUTHORIZED',
    requestId: input.requestId,
    issuedAt: input.issuedAt,
    expiresAt: input.expiresAt,
    sourceContract: sourceRef(contract),
    sourceR108Contract: sourceRef(
      contract.sourceBindingDecisionIntegrityContract),
    sourceR107RequestPacket: sourceRef(requestPacket),
    sourcePolicyDescriptor: sourceRef(policy),
    sourceDecisionEnvelope: sourceRef(decisionEnvelope),
    sourceRevocationSnapshot: sourceRef(revocationSnapshot),
    sourceIntegrityAssessment: sourceRef(integrityAssessment),
    hostGovernanceTarget: {
      claimedGovernanceDomainId: input.claimedHostGovernanceDomainId,
      worldId: reference.worldId,
      lineageId: reference.lineageId,
      hostRevision: reference.hostRevision,
      worldDigest: reference.worldDigest,
      status: 'CALLER_NAMED_TARGET_NOT_AUTHENTICATED'
    },
    candidatePolicy: {
      claimedReviewSeatId: policy.claimedReviewSeatId,
      decisionKeyId: policy.decisionKey.keyId,
      decisionPublicKeySha256: policy.decisionKey.publicKeySha256,
      revocationKeyId: policy.revocationKey.keyId,
      revocationPublicKeySha256: policy.revocationKey.publicKeySha256,
      trustVerdict: 'UNTRUSTED_CALLER_SUPPLIED'
    },
    claimedReceiptSigner: {
      claimedHostAuthoritySeatId:
        requestPacket.claimedAuthority.claimedHostAuthoritySeatId,
      claimedHostAuthorityKeyId:
        requestPacket.claimedAuthority.claimedHostAuthorityKeyId,
      claimedHostAuthorityPublicKeySha256:
        requestPacket.claimedAuthority.claimedHostAuthorityPublicKeySha256,
      bindingVerdict: UNKNOWN
    },
    challenge: {
      nonce: input.challengeNonce,
      mustBeAnsweredByHostResolvedTrustRoot: true,
      replayLedgerRequired: true,
      consumed: false
    },
    admissionRequests: requests,
    evidenceRequirements: requirements,
    summary: expectedPacketSummary(requests, requirements),
    verdicts: {
      requestRoutingVerdict: 'ROUTED_NOT_AUTHORIZED',
      sourceIntegrityAssessmentVerdict: 'REPORTED_PASS_UNTRUSTED',
      callerSuppliedPolicyTrustVerdict: 'UNTRUSTED_CALLER_SUPPLIED',
      hostGovernanceTrustRootResolutionVerdict: UNKNOWN,
      policyKeyDelegationVerificationVerdict: UNKNOWN,
      hostIdentityAuthenticationVerdict: UNKNOWN,
      hostGovernanceAdmissionVerdict: NOT_AUTHORIZED,
      receiptSignerKeyBindingVerdict: UNKNOWN,
      provisioningReceiptVerificationVerdict: UNKNOWN,
      hostTrustAnchorProvisioningVerdict: UNKNOWN
    },
    truth: expectedPacketTruth()
  };
  packet.digest = stableDigest(packet);
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestPacketValid(
      packet, contract, requestPacket, policy, decisionEnvelope,
      revocationSnapshot, integrityAssessment)) {
    throw new Error(
      'Host-governance trust-root admission request failed validation');
  }
  return packet;
}

export function
matrixThermalHistoricalSourceHostGovernanceTrustRootAdmissionRequestDescription() {
  return {
    contractReceiptSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    routeSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_ROUTE_SCHEMA,
    evidenceRequirementSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_EVIDENCE_REQUIREMENT_SCHEMA,
    requestEntrySchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_ENTRY_SCHEMA,
    requestPacketSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_PACKET_SCHEMA,
    admissionRequestCreateCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_REQUEST_CREATE_CAPABILITY_ID,
    requiredTrustRootResolveCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
    requiredPolicyKeyDelegationVerifyCapabilityId:
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
    requiredAdmissionDecideCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID,
    requiredReceiptSignerKeyBindingCapabilityId:
      HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_CAPABILITY_ID,
    requiredProvisioningReceiptVerifyCapabilityId:
      HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID,
    requiredHostTrustAnchorProvisionCapabilityId:
      HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID,
    candidateMaySupplyTrustRoot: false,
    trustRootMustResolveOutOfBand: true,
    hostGovernanceTrustRootResolved: false,
    policyKeyDelegationVerified: false,
    hostGovernanceAdmissionDecisionImplemented: false,
    receiptSignerKeyBindingImplemented: false,
    transientArtifactsPersisted: false,
    mutatesWorld: false
  };
}
