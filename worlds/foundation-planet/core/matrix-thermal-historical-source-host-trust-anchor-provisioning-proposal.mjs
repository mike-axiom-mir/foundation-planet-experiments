import { PLANET_DEFAULTS } from './planet-model.mjs';
import { HOST_PROJECTION_SCHEMA } from './host-protocol.mjs';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA,
  HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID,
  VERIFIER_KEY_BINDING_DECISION_SIGNATURE_VERIFY_CAPABILITY_ID,
  VERIFIER_KEY_BINDING_REVOCATION_VERIFY_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityContractReceiptValid,
  landMatrixThermalHistoricalSourceVerifierKeyBindingCallerSuppliedPolicyDescriptorValid
} from './matrix-thermal-historical-source-verifier-key-binding-authority-decision-integrity.mjs?v=0.107.0-r107.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-proposal-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_ROUTE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-proposal-route/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_CLAIMED_HOST_REFERENCE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-claimed-host-reference/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-proposal/v1';

export const HOST_TRUST_ANCHOR_PROVISION_PROPOSAL_CREATE_CAPABILITY_ID =
  'authority.host-trust-anchor.provision.proposal.create';

const NATIVE_EMISSION_MODE =
  'native-from-intact-r104-authority-decision-integrity-contract';
const MIGRATION_EMISSION_MODE =
  'migration-from-exact-retained-r104-authority-decision-integrity-contract';
const UNKNOWN = 'UNKNOWN';
const NOT_AUTHORIZED = 'NOT_AUTHORIZED';
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
const hostWorldDigest = value => typeof value === 'string' &&
  /^[a-f0-9]{64}$/.test(value);
const sha256Digest = value => typeof value === 'string' &&
  /^sha256:[a-f0-9]{64}$/.test(value);
const nonEmptyText = (value, maximum = 4096) =>
  typeof value === 'string' && value.trim().length > 0 &&
    value.length <= maximum;
const isoTimestamp = value =>
  nonEmptyText(value, 64) && Number.isFinite(Date.parse(value));
const unique = values => new Set(values).size === values.length;
const sorted = values => exact(values, [...values].sort());

function expectedRoutes(sourceContract) {
  return sourceContract.authorityDecisionIntegrityRoutes.map(sourceRoute => {
    const eligible = sourceRoute.eligibleForAuthorityDecisionIntegrity === true;
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_ROUTE_SCHEMA,
      routeId: `host-trust-anchor-provisioning-proposal:${sourceRoute.routeId}`,
      sourceAuthorityDecisionIntegrityRouteId: sourceRoute.routeId,
      requestBinding: clone(sourceRoute.requestBinding),
      eligibleForHostTrustAnchorProvisioningProposal: eligible,
      sourceAuthorityDecisionIntegrityContractSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA
        : null,
      callerSuppliedPolicyDescriptorSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA
        : null,
      claimedHostReferenceSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_CLAIMED_HOST_REFERENCE_SCHEMA
        : null,
      hostTrustAnchorProvisioningProposalSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_SCHEMA
        : null,
      requiredHostTrustAnchorProvisionCapabilityId: eligible
        ? HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID : null,
      implementedHostTrustAnchorProvisionProposalCreateCapabilityId: eligible
        ? HOST_TRUST_ANCHOR_PROVISION_PROPOSAL_CREATE_CAPABILITY_ID : null,
      hostTrustAnchorProvisioned: false,
      hostAccepted: false,
      callerSuppliedPolicyTrusted: false,
      trustedVerifierKeyBinding: null,
      hostTrustAnchorProvisioningVerdict: eligible ? UNKNOWN : null,
      verifierKeyBindingVerdict: eligible ? UNKNOWN : null,
      admissionVerdict: eligible ? NOT_AUTHORIZED : null
    };
  });
}

function expectedSummary(routes) {
  return {
    sourceR104AuthorityDecisionIntegrityContractCount: 1,
    hostTrustAnchorProvisioningProposalRouteCount: 28,
    hostTrustAnchorProvisioningProposalEligibleRouteCount: routes.filter(route =>
      route.eligibleForHostTrustAnchorProvisioningProposal).length,
    authorityReviewRouteExcludedCount: routes.filter(route =>
      !route.eligibleForHostTrustAnchorProvisioningProposal).length,
    persistedClaimedHostReferenceCount: 0,
    persistedProvisioningProposalCount: 0,
    hostAcceptedProposalCount: 0,
    hostTrustAnchorCount: 0,
    trustedPolicyCount: 0,
    trustedVerifierKeyBindingCount: 0,
    provisioningProposalCreationImplemented: true,
    hostTrustAnchorProvisioningImplemented: false,
    hostAcceptanceVerificationImplemented: false,
    verifierKeyBindingImplemented: false,
    candidateAdmissionPathImplemented: false
  };
}

const expectedContractTruth = () => ({
  exactR104AuthorityDecisionIntegrityContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourHostTrustAnchorProvisioningProposalRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  namedWorldHostReferenceShapeRequired: true,
  exactHostLineageRevisionAndDigestRequired: true,
  exactCallerSuppliedPolicyDigestAndKeyHashesRequired: true,
  hostTrustAnchorProvisioningProposalCreationImplemented: true,
  hostTrustAnchorProvisioningImplemented: false,
  hostIdentityAuthenticated: false,
  hostAuthorityToProvisionEstablished: false,
  hostAcceptanceVerified: false,
  callerSuppliedPolicyTrusted: false,
  trustedVerifierKeyBindingImplemented: false,
  verifierIdentityResolutionImplemented: false,
  verifierIndependenceVerificationImplemented: false,
  observationAuthenticityVerified: false,
  provenanceVerified: false,
  physicalMeaningReviewImplemented: false,
  evidenceVerified: false,
  proposalPersisted: false,
  hostTrustAnchorPersisted: false,
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
});

export function
landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningProposalContractReceiptValid(
  receipt) {
  const source = receipt?.sourceAuthorityDecisionIntegrityContract;
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
        'sourceAuthorityDecisionIntegrityContract',
        'hostTrustAnchorProvisioningProposalRoutes', 'summary', 'emission',
        'truth', 'digest']) ||
      !exactKeys(receipt.source, ['schema', 'receiptDigest']) ||
      !exactKeys(receipt.emission,
        ['mode', 'sourceWasExactRetainedAuthorityDecisionIntegrityContractMigration']) ||
      !landMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
        source)) return false;
  const routes = expectedRoutes(source);
  const migration = receipt.emission?.mode === MIGRATION_EMISSION_MODE;
  return receipt.status ===
      'host-trust-anchor-provisioning-proposal-creation-available-without-host-acceptance-installation-binding-or-admission' &&
    exact(receipt.creationContext, source.creationContext) &&
    receipt.source.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    receipt.source.receiptDigest === source.digest &&
    exact(receipt.hostTrustAnchorProvisioningProposalRoutes, routes) &&
    exact(receipt.summary, expectedSummary(routes)) &&
    [NATIVE_EMISSION_MODE, MIGRATION_EMISSION_MODE]
      .includes(receipt.emission.mode) &&
    receipt.emission
      .sourceWasExactRetainedAuthorityDecisionIntegrityContractMigration ===
      migration && exact(receipt.truth, expectedContractTruth());
}

export function
createLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningProposalContractReceipt(
  creationContext, sourceContract, options = {}) {
  if (!landMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      sourceContract) || !exact(creationContext, sourceContract.creationContext)) {
    throw new Error(
      'Host trust-anchor proposal contract needs the exact attached R104 authority-decision integrity contract');
  }
  const routes = expectedRoutes(sourceContract);
  const migration = options
    .sourceWasExactRetainedAuthorityDecisionIntegrityContractMigration === true;
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_CONTRACT_RECEIPT_SCHEMA,
    status:
      'host-trust-anchor-provisioning-proposal-creation-available-without-host-acceptance-installation-binding-or-admission',
    creationContext: clone(creationContext),
    source: {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
      receiptDigest: sourceContract.digest
    },
    sourceAuthorityDecisionIntegrityContract: clone(sourceContract),
    hostTrustAnchorProvisioningProposalRoutes: routes,
    summary: expectedSummary(routes),
    emission: {
      mode: migration ? MIGRATION_EMISSION_MODE : NATIVE_EMISSION_MODE,
      sourceWasExactRetainedAuthorityDecisionIntegrityContractMigration:
        migration
    },
    truth: expectedContractTruth()
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningProposalContractReceiptValid(
      receipt)) {
    throw new Error('Host trust-anchor proposal contract failed validation');
  }
  return receipt;
}

const expectedHostReferenceTruth = () => ({
  hostProjectionShapeValidated: true,
  hostWorldIdLineageRevisionAndDigestBound: true,
  hostOwnerLabelBound: true,
  hostIdentityAuthenticated: false,
  hostAuthorityToProvisionEstablished: false,
  hostAcceptanceVerified: false,
  hostTrustAnchorProvisioned: false,
  persisted: false,
  worldMutationPerformed: false
});

export function landMatrixThermalHistoricalSourceClaimedHostReferenceValid(
  reference) {
  return digestValid(reference,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_CLAIMED_HOST_REFERENCE_SCHEMA) &&
    exactKeys(reference, ['schema', 'status', 'hostProjectionSchema',
      'worldId', 'lineageId', 'hostRevision', 'worldDigest', 'owner', 'truth',
      'digest']) &&
    reference.status ===
      'CLAIMED_STRUCTURALLY_VALID_NAMED_WORLD_HOST_REFERENCE_NOT_AUTHENTICATED' &&
    reference.hostProjectionSchema === HOST_PROJECTION_SCHEMA &&
    reference.worldId === PLANET_DEFAULTS.id &&
    nonEmptyText(reference.lineageId, 512) &&
    Number.isSafeInteger(reference.hostRevision) &&
    reference.hostRevision >= 0 && hostWorldDigest(reference.worldDigest) &&
    reference.owner === 'living-world-state-server' &&
    exact(reference.truth, expectedHostReferenceTruth());
}

export function createLandMatrixThermalHistoricalSourceClaimedHostReference(
  hostProjection) {
  if (hostProjection?.schema !== HOST_PROJECTION_SCHEMA ||
      hostProjection.worldId !== PLANET_DEFAULTS.id ||
      !nonEmptyText(hostProjection.lineageId, 512) ||
      !Number.isSafeInteger(hostProjection.hostRevision) ||
      hostProjection.hostRevision < 0 ||
      !hostWorldDigest(hostProjection.worldDigest) ||
      hostProjection.owner !== 'living-world-state-server' ||
      hostProjection.authoritative !== true ||
      hostProjection.localStateReplacement !== false) {
    throw new Error(
      'Claimed host reference needs a structurally valid named-world host projection with an exact revision and digest');
  }
  const reference = {
    schema: LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_CLAIMED_HOST_REFERENCE_SCHEMA,
    status:
      'CLAIMED_STRUCTURALLY_VALID_NAMED_WORLD_HOST_REFERENCE_NOT_AUTHENTICATED',
    hostProjectionSchema: HOST_PROJECTION_SCHEMA,
    worldId: hostProjection.worldId,
    lineageId: hostProjection.lineageId,
    hostRevision: hostProjection.hostRevision,
    worldDigest: hostProjection.worldDigest,
    owner: hostProjection.owner,
    truth: expectedHostReferenceTruth()
  };
  reference.digest = stableDigest(reference);
  if (!landMatrixThermalHistoricalSourceClaimedHostReferenceValid(reference)) {
    throw new Error('Claimed host reference failed validation');
  }
  return reference;
}

const expectedProposalEffects = () => ({
  applyAuthority: false,
  hostAccepted: false,
  hostTrustAnchorInstalled: false,
  callerSuppliedPolicyTrusted: false,
  trustedVerifierKeyBindingCount: 0,
  persisted: false,
  worldMutationPerformed: false
});

const expectedProposalVerdicts = () => ({
  proposalStructureVerdict: 'PASS',
  hostIdentityAuthenticationVerdict: UNKNOWN,
  hostAuthorityToProvisionVerdict: UNKNOWN,
  hostAcceptanceVerdict: UNKNOWN,
  hostTrustAnchorProvisioningVerdict: UNKNOWN,
  callerSuppliedPolicyTrustVerdict: UNKNOWN,
  verifierKeyBindingVerdict: UNKNOWN,
  admissionVerdict: NOT_AUTHORIZED
});

const expectedProposalTruth = () => ({
  exactR105ContractBound: true,
  exactR104ContractBound: true,
  exactCallerSuppliedPolicyDescriptorDigestBound: true,
  exactDecisionAndRevocationPublicKeyHashesBound: true,
  exactClaimedHostWorldLineageRevisionAndDigestBound: true,
  proposalCreationCapabilityUsed: true,
  proposalIsNotHostPatch: true,
  hostIdentityAuthenticated: false,
  hostAuthorityToProvisionEstablished: false,
  hostAccepted: false,
  hostTrustAnchorProvisioned: false,
  callerSuppliedPolicyTrusted: false,
  trustedVerifierKeyBindingImplemented: false,
  verifierIdentityResolutionImplemented: false,
  verifierIndependenceVerificationImplemented: false,
  observationAuthenticityVerified: false,
  provenanceVerified: false,
  physicalMeaningReviewImplemented: false,
  evidenceVerified: false,
  proposalPersisted: false,
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
});

function proposalInputValid(input) {
  return exactKeys(input, ['proposalId', 'requestedAt', 'expiresAt', 'nonce',
      'requestedByActor', 'requestedReviewSeatId']) &&
    nonEmptyText(input.proposalId, 256) &&
    isoTimestamp(input.requestedAt) && isoTimestamp(input.expiresAt) &&
    Date.parse(input.requestedAt) < Date.parse(input.expiresAt) &&
    Date.parse(input.expiresAt) - Date.parse(input.requestedAt) <=
      7 * 24 * 60 * 60 * 1000 &&
    nonEmptyText(input.nonce, 256) &&
    nonEmptyText(input.requestedByActor, 256) &&
    input.requestedReviewSeatId === 'axm-host-authority-review-seat';
}

export function
landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningProposalValid(
  proposal, contract = null, policy = null, hostProjection = null) {
  if (!digestValid(proposal,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_SCHEMA) ||
      !exactKeys(proposal, ['schema', 'status', 'sourceContract',
        'sourceAuthorityDecisionIntegrityContract', 'sourcePolicy',
        'hostReference', 'scope', 'request', 'effects', 'verdicts', 'truth',
        'digest']) ||
      !exactKeys(proposal.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(proposal.sourceAuthorityDecisionIntegrityContract,
        ['schema', 'receiptDigest']) ||
      !exactKeys(proposal.sourcePolicy, ['schema', 'descriptorDigest',
        'policyId', 'policyRevision', 'decisionPublicKeySha256',
        'revocationPublicKeySha256']) ||
      !exactKeys(proposal.scope,
        ['hostTrustAnchorProvisioningProposalRouteIds']) ||
      !exactKeys(proposal.request, ['proposalId', 'requestedAction',
        'requiredCapabilityId', 'implementedProposalCapabilityId',
        'requestedAt', 'expiresAt', 'nonce', 'requestedByActor',
        'requestedReviewSeatId']) ||
      !Array.isArray(
        proposal.scope.hostTrustAnchorProvisioningProposalRouteIds)) {
    return false;
  }
  const routeIds =
    proposal.scope.hostTrustAnchorProvisioningProposalRouteIds;
  const structural = proposal.status ===
      'PENDING_MIKE_TOBI_AXM_HOST_AUTHORITY_DECISION_PROPOSAL_ONLY' &&
    proposal.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(proposal.sourceContract.receiptDigest) &&
    proposal.sourceAuthorityDecisionIntegrityContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(
      proposal.sourceAuthorityDecisionIntegrityContract.receiptDigest) &&
    proposal.sourcePolicy.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA &&
    fnvDigest(proposal.sourcePolicy.descriptorDigest) &&
    nonEmptyText(proposal.sourcePolicy.policyId, 256) &&
    Number.isInteger(proposal.sourcePolicy.policyRevision) &&
    proposal.sourcePolicy.policyRevision > 0 &&
    sha256Digest(proposal.sourcePolicy.decisionPublicKeySha256) &&
    sha256Digest(proposal.sourcePolicy.revocationPublicKeySha256) &&
    proposal.sourcePolicy.decisionPublicKeySha256 !==
      proposal.sourcePolicy.revocationPublicKeySha256 &&
    landMatrixThermalHistoricalSourceClaimedHostReferenceValid(
      proposal.hostReference) && routeIds.length === 24 &&
    unique(routeIds) && sorted(routeIds) &&
    routeIds.every(value => nonEmptyText(value, 2048)) &&
    proposal.request.requestedAction ===
      'PROVISION_HOST_TRUST_ANCHOR_FOR_CALLER_SUPPLIED_POLICY' &&
    proposal.request.requiredCapabilityId ===
      HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID &&
    proposal.request.implementedProposalCapabilityId ===
      HOST_TRUST_ANCHOR_PROVISION_PROPOSAL_CREATE_CAPABILITY_ID &&
    proposalInputValid({
      proposalId: proposal.request.proposalId,
      requestedAt: proposal.request.requestedAt,
      expiresAt: proposal.request.expiresAt,
      nonce: proposal.request.nonce,
      requestedByActor: proposal.request.requestedByActor,
      requestedReviewSeatId: proposal.request.requestedReviewSeatId
    }) && exact(proposal.effects, expectedProposalEffects()) &&
    exact(proposal.verdicts, expectedProposalVerdicts()) &&
    exact(proposal.truth, expectedProposalTruth());
  if (!structural || contract === null) return structural;
  const contractValid =
    landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningProposalContractReceiptValid(
      contract);
  const expectedRouteIds = contract.hostTrustAnchorProvisioningProposalRoutes
    .filter(route => route.eligibleForHostTrustAnchorProvisioningProposal)
    .map(route => route.routeId).sort();
  const contractBound = contractValid &&
    exact(proposal.sourceContract, {
      schema: contract.schema,
      receiptDigest: contract.digest
    }) && exact(proposal.sourceAuthorityDecisionIntegrityContract, {
      schema: contract.sourceAuthorityDecisionIntegrityContract.schema,
      receiptDigest:
        contract.sourceAuthorityDecisionIntegrityContract.digest
    }) && exact(routeIds, expectedRouteIds);
  if (!contractBound || policy === null) return contractBound;
  const policyBound =
    landMatrixThermalHistoricalSourceVerifierKeyBindingCallerSuppliedPolicyDescriptorValid(
      policy, contract.sourceAuthorityDecisionIntegrityContract) &&
    exact(proposal.sourcePolicy, {
      schema: policy.schema,
      descriptorDigest: policy.digest,
      policyId: policy.policyId,
      policyRevision: policy.policyRevision,
      decisionPublicKeySha256: policy.decisionKey.publicKeySha256,
      revocationPublicKeySha256: policy.revocationKey.publicKeySha256
    });
  if (!policyBound || hostProjection === null) return policyBound;
  try {
    return exact(proposal.hostReference,
      createLandMatrixThermalHistoricalSourceClaimedHostReference(
        hostProjection));
  } catch {
    return false;
  }
}

export function
createLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningProposal(
  contract, policy, hostProjection, input) {
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningProposalContractReceiptValid(
      contract) ||
      !landMatrixThermalHistoricalSourceVerifierKeyBindingCallerSuppliedPolicyDescriptorValid(
        policy, contract.sourceAuthorityDecisionIntegrityContract) ||
      !proposalInputValid(input)) {
    throw new Error(
      'Host trust-anchor provisioning proposal needs exact R105/R104/policy sources and a bounded AXM host-authority request');
  }
  const hostReference =
    createLandMatrixThermalHistoricalSourceClaimedHostReference(hostProjection);
  const proposal = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_SCHEMA,
    status: 'PENDING_MIKE_TOBI_AXM_HOST_AUTHORITY_DECISION_PROPOSAL_ONLY',
    sourceContract: {
      schema: contract.schema,
      receiptDigest: contract.digest
    },
    sourceAuthorityDecisionIntegrityContract: {
      schema: contract.sourceAuthorityDecisionIntegrityContract.schema,
      receiptDigest:
        contract.sourceAuthorityDecisionIntegrityContract.digest
    },
    sourcePolicy: {
      schema: policy.schema,
      descriptorDigest: policy.digest,
      policyId: policy.policyId,
      policyRevision: policy.policyRevision,
      decisionPublicKeySha256: policy.decisionKey.publicKeySha256,
      revocationPublicKeySha256: policy.revocationKey.publicKeySha256
    },
    hostReference,
    scope: {
      hostTrustAnchorProvisioningProposalRouteIds:
        contract.hostTrustAnchorProvisioningProposalRoutes
          .filter(route => route.eligibleForHostTrustAnchorProvisioningProposal)
          .map(route => route.routeId).sort()
    },
    request: {
      proposalId: input.proposalId,
      requestedAction:
        'PROVISION_HOST_TRUST_ANCHOR_FOR_CALLER_SUPPLIED_POLICY',
      requiredCapabilityId: HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID,
      implementedProposalCapabilityId:
        HOST_TRUST_ANCHOR_PROVISION_PROPOSAL_CREATE_CAPABILITY_ID,
      requestedAt: input.requestedAt,
      expiresAt: input.expiresAt,
      nonce: input.nonce,
      requestedByActor: input.requestedByActor,
      requestedReviewSeatId: input.requestedReviewSeatId
    },
    effects: expectedProposalEffects(),
    verdicts: expectedProposalVerdicts(),
    truth: expectedProposalTruth()
  };
  proposal.digest = stableDigest(proposal);
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningProposalValid(
      proposal, contract, policy, hostProjection)) {
    throw new Error('Host trust-anchor provisioning proposal failed validation');
  }
  return proposal;
}

export function
matrixThermalHistoricalSourceHostTrustAnchorProvisioningProposalDescription() {
  return {
    contractReceiptSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_CONTRACT_RECEIPT_SCHEMA,
    routeSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_ROUTE_SCHEMA,
    claimedHostReferenceSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_CLAIMED_HOST_REFERENCE_SCHEMA,
    provisioningProposalSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_SCHEMA,
    requiredHostTrustAnchorProvisionCapabilityId:
      HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID,
    provisioningProposalCreateCapabilityId:
      HOST_TRUST_ANCHOR_PROVISION_PROPOSAL_CREATE_CAPABILITY_ID,
    decisionSignatureVerificationCapabilityId:
      VERIFIER_KEY_BINDING_DECISION_SIGNATURE_VERIFY_CAPABILITY_ID,
    revocationVerificationCapabilityId:
      VERIFIER_KEY_BINDING_REVOCATION_VERIFY_CAPABILITY_ID,
    hostTrustAnchorProvisioningProposalCreationImplemented: true,
    namedWorldHostReferenceShapeValidationImplemented: true,
    hostTrustAnchorProvisioningImplemented: false,
    hostIdentityAuthenticationImplemented: false,
    hostAuthorityToProvisionVerificationImplemented: false,
    hostAcceptanceVerificationImplemented: false,
    proposalIsHostPatch: false,
    proposalApplyAuthority: false,
    proposalPersisted: false,
    callerSuppliedPolicyTrusted: false,
    trustedVerifierKeyBindingImplemented: false,
    candidateAdmissionPathImplemented: false,
    worldMutationPerformed: false
  };
}
