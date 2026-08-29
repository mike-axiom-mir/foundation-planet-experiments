import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA,
  landMatrixThermalHistoricalSourceVerifierKeyBindingCallerSuppliedPolicyDescriptorValid,
  HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID
} from './matrix-thermal-historical-source-verifier-key-binding-authority-decision-integrity.mjs?v=0.107.0-r107.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_CLAIMED_HOST_REFERENCE_SCHEMA,
  landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningProposalContractReceiptValid,
  landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningProposalValid
} from './matrix-thermal-historical-source-host-trust-anchor-provisioning-proposal.mjs?v=0.107.0-r107.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signature-integrity-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_ROUTE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signature-integrity-route/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_ENVELOPE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-envelope/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INPUT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signature-input/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_ASSESSMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signature-integrity-assessment/v1';

export const HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID =
  'authority.host-trust-anchor.provision.receipt.verify';
export const HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNATURE_VERIFY_CAPABILITY_ID =
  'authority.host-trust-anchor.provision.receipt.signature.verify';

const NATIVE_EMISSION_MODE =
  'native-from-intact-r105-host-trust-anchor-provisioning-proposal-contract';
const MIGRATION_EMISSION_MODE =
  'migration-from-exact-retained-r105-host-trust-anchor-provisioning-proposal-contract';
const SIGNATURE_ALGORITHM = 'Ed25519';
const PUBLIC_KEY_FORMAT = 'raw-32-byte-ed25519';
const ED25519_RAW_PUBLIC_KEY_BYTES = 32;
const ED25519_SIGNATURE_BYTES = 64;
const UNKNOWN = 'UNKNOWN';
const NOT_AUTHORIZED = 'NOT_AUTHORIZED';
const OUTCOMES = [
  'CLAIMED_HOST_TRUST_ANCHOR_PROVISIONED',
  'CLAIMED_HOST_TRUST_ANCHOR_PROVISIONING_HELD',
  'CLAIMED_HOST_TRUST_ANCHOR_PROVISIONING_REJECTED'
];
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

function bytesToHex(bytes) {
  return [...bytes].map(value =>
    value.toString(16).padStart(2, '0')).join('');
}

async function sha256ForBytes(bytes) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error('Web Crypto SubtleCrypto is unavailable');
  const digest = await subtle.digest('SHA-256', bytes);
  return `sha256:${bytesToHex(new Uint8Array(digest))}`;
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

function expectedRoutes(sourceContract) {
  return sourceContract.hostTrustAnchorProvisioningProposalRoutes.map(
    sourceRoute => {
      const eligible =
        sourceRoute.eligibleForHostTrustAnchorProvisioningProposal === true;
      return {
        schema:
          LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_ROUTE_SCHEMA,
        routeId:
          `host-trust-anchor-provisioning-receipt-signature-integrity:${sourceRoute.routeId}`,
        sourceHostTrustAnchorProvisioningProposalRouteId: sourceRoute.routeId,
        requestBinding: clone(sourceRoute.requestBinding),
        eligibleForHostTrustAnchorProvisioningReceiptSignatureIntegrity:
          eligible,
        sourceHostTrustAnchorProvisioningProposalContractSchema: eligible
          ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_CONTRACT_RECEIPT_SCHEMA
          : null,
        hostTrustAnchorProvisioningProposalSchema: eligible
          ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_SCHEMA
          : null,
        hostTrustAnchorProvisioningReceiptEnvelopeSchema: eligible
          ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_ENVELOPE_SCHEMA
          : null,
        requiredHostTrustAnchorProvisionCapabilityId: eligible
          ? HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID : null,
        requiredHostTrustAnchorProvisionReceiptVerifyCapabilityId: eligible
          ? HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID : null,
        implementedHostTrustAnchorProvisionReceiptSignatureVerifyCapabilityId:
          eligible
            ? HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNATURE_VERIFY_CAPABILITY_ID
            : null,
        receiptSignatureIntegrityVerdict: eligible ? UNKNOWN : null,
        receiptAuthorityVerdict: eligible ? UNKNOWN : null,
        hostTrustAnchorProvisioningVerdict: eligible ? UNKNOWN : null,
        hostAccepted: false,
        hostTrustAnchorProvisioned: false,
        callerSuppliedPolicyTrusted: false,
        trustedVerifierKeyBinding: null,
        admissionVerdict: eligible ? NOT_AUTHORIZED : null
      };
    });
}

function expectedSummary(routes) {
  return {
    sourceR105HostTrustAnchorProvisioningProposalContractCount: 1,
    hostTrustAnchorProvisioningReceiptSignatureIntegrityRouteCount: 28,
    hostTrustAnchorProvisioningReceiptSignatureIntegrityEligibleRouteCount:
      routes.filter(route =>
        route.eligibleForHostTrustAnchorProvisioningReceiptSignatureIntegrity)
        .length,
    authorityReviewRouteExcludedCount: routes.filter(route =>
      !route.eligibleForHostTrustAnchorProvisioningReceiptSignatureIntegrity)
      .length,
    persistedHostReferenceCount: 0,
    persistedProvisioningProposalCount: 0,
    persistedProvisioningReceiptEnvelopeCount: 0,
    persistedProvisioningReceiptAssessmentCount: 0,
    persistedRawHostAuthorityPublicKeyCount: 0,
    persistedProvisioningReceiptSignatureCount: 0,
    hostAcceptedProposalCount: 0,
    hostTrustAnchorCount: 0,
    trustedPolicyCount: 0,
    trustedVerifierKeyBindingCount: 0,
    provisioningReceiptSignatureVerificationImplemented: true,
    provisioningReceiptVerificationImplemented: false,
    hostTrustAnchorProvisioningImplemented: false,
    replayLedgerImplemented: false,
    candidateAdmissionPathImplemented: false
  };
}

const expectedContractTruth = () => ({
  exactR105HostTrustAnchorProvisioningProposalContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourReceiptSignatureIntegrityRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  exactProposalPolicyAndClaimedHostBindingRequired: true,
  detachedEd25519ProvisioningReceiptSignatureVerificationImplemented: true,
  callerSuppliedHostAuthorityKeyOnly: true,
  hostAuthorityKeyTrusted: false,
  provisioningReceiptVerificationImplemented: false,
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
  receiptEnvelopePersisted: false,
  receiptAssessmentPersisted: false,
  rawHostAuthorityPublicKeyPersisted: false,
  receiptSignatureBytesPersisted: false,
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
landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrityContractReceiptValid(
  receipt) {
  const source = receipt?.sourceHostTrustAnchorProvisioningProposalContract;
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
        'sourceHostTrustAnchorProvisioningProposalContract',
        'hostTrustAnchorProvisioningReceiptSignatureIntegrityRoutes',
        'summary', 'emission', 'truth', 'digest']) ||
      !exactKeys(receipt.source, ['schema', 'receiptDigest']) ||
      !exactKeys(receipt.emission,
        ['mode',
          'sourceWasExactRetainedHostTrustAnchorProvisioningProposalContractMigration']) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningProposalContractReceiptValid(
        source)) return false;
  const routes = expectedRoutes(source);
  const migration = receipt.emission?.mode === MIGRATION_EMISSION_MODE;
  return receipt.status ===
      'host-trust-anchor-provisioning-receipt-signature-integrity-available-under-caller-supplied-untrusted-host-key-without-receipt-authority-installation-binding-or-admission' &&
    exact(receipt.creationContext, source.creationContext) &&
    receipt.source.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_CONTRACT_RECEIPT_SCHEMA &&
    receipt.source.receiptDigest === source.digest &&
    exact(receipt.hostTrustAnchorProvisioningReceiptSignatureIntegrityRoutes,
      routes) && exact(receipt.summary, expectedSummary(routes)) &&
    [NATIVE_EMISSION_MODE, MIGRATION_EMISSION_MODE]
      .includes(receipt.emission.mode) &&
    receipt.emission
      .sourceWasExactRetainedHostTrustAnchorProvisioningProposalContractMigration ===
      migration && exact(receipt.truth, expectedContractTruth());
}

export function
createLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrityContractReceipt(
  creationContext, sourceContract, options = {}) {
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningProposalContractReceiptValid(
      sourceContract) || !exact(creationContext, sourceContract.creationContext)) {
    throw new Error(
      'Provisioning-receipt signature-integrity contract needs the exact attached R105 host-bound proposal contract');
  }
  const routes = expectedRoutes(sourceContract);
  const migration = options
    .sourceWasExactRetainedHostTrustAnchorProvisioningProposalContractMigration ===
      true;
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
    status:
      'host-trust-anchor-provisioning-receipt-signature-integrity-available-under-caller-supplied-untrusted-host-key-without-receipt-authority-installation-binding-or-admission',
    creationContext: clone(creationContext),
    source: {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_CONTRACT_RECEIPT_SCHEMA,
      receiptDigest: sourceContract.digest
    },
    sourceHostTrustAnchorProvisioningProposalContract: clone(sourceContract),
    hostTrustAnchorProvisioningReceiptSignatureIntegrityRoutes: routes,
    summary: expectedSummary(routes),
    emission: {
      mode: migration ? MIGRATION_EMISSION_MODE : NATIVE_EMISSION_MODE,
      sourceWasExactRetainedHostTrustAnchorProvisioningProposalContractMigration:
        migration
    },
    truth: expectedContractTruth()
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrityContractReceiptValid(
      receipt)) {
    throw new Error(
      'Provisioning-receipt signature-integrity contract failed validation');
  }
  return receipt;
}

const expectedClaimedEffects = outcome => ({
  hostAcceptedProposal:
    outcome === 'CLAIMED_HOST_TRUST_ANCHOR_PROVISIONED',
  hostTrustAnchorInstalled:
    outcome === 'CLAIMED_HOST_TRUST_ANCHOR_PROVISIONED',
  callerSuppliedPolicyTrusted:
    outcome === 'CLAIMED_HOST_TRUST_ANCHOR_PROVISIONED'
});

const expectedActualEffects = () => ({
  applyAuthority: false,
  hostAccepted: false,
  hostTrustAnchorInstalled: false,
  callerSuppliedPolicyTrusted: false,
  trustedVerifierKeyBindingCount: 0,
  persisted: false,
  worldMutationPerformed: false
});

const expectedEnvelopeTruth = () => ({
  exactR106ContractBound: true,
  exactR105ProposalBound: true,
  exactCallerSuppliedPolicyDescriptorBound: true,
  exactClaimedHostReferenceBound: true,
  callerSuppliedHostAuthorityKeyHashBound: true,
  receiptClaimsAreNotVerifiedEffects: true,
  receiptSignatureVerified: false,
  hostAuthorityKeyTrusted: false,
  hostIdentityAuthenticated: false,
  hostAuthorityToProvisionEstablished: false,
  hostAccepted: false,
  hostTrustAnchorProvisioned: false,
  callerSuppliedPolicyTrusted: false,
  trustedVerifierKeyBindingImplemented: false,
  rawHostAuthorityPublicKeyPersisted: false,
  receiptSignatureBytesPersisted: false,
  receiptEnvelopePersisted: false,
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

function receiptEnvelopeInputValid(input) {
  return exactKeys(input, ['receiptId', 'issuedAt', 'expiresAt', 'nonce',
      'claimedOutcome', 'reasonCode', 'claimedHostAuthoritySeatId',
      'claimedHostAuthorityKeyId',
      'claimedHostAuthorityPublicKeySha256']) &&
    nonEmptyText(input.receiptId, 256) && isoTimestamp(input.issuedAt) &&
    isoTimestamp(input.expiresAt) &&
    Date.parse(input.issuedAt) < Date.parse(input.expiresAt) &&
    Date.parse(input.expiresAt) - Date.parse(input.issuedAt) <=
      24 * 60 * 60 * 1000 && nonEmptyText(input.nonce, 256) &&
    OUTCOMES.includes(input.claimedOutcome) &&
    nonEmptyText(input.reasonCode, 256) &&
    input.claimedHostAuthoritySeatId === 'axm-host-authority-review-seat' &&
    nonEmptyText(input.claimedHostAuthorityKeyId, 256) &&
    sha256Digest(input.claimedHostAuthorityPublicKeySha256);
}

export function
landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptEnvelopeValid(
  envelope, contract = null, proposal = null, policy = null,
  hostProjection = null) {
  if (!digestValid(envelope,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_ENVELOPE_SCHEMA) ||
      !exactKeys(envelope, ['schema', 'status', 'sourceContract',
        'sourceProposal', 'sourcePolicy', 'sourceHostReference',
        'claimedAuthority', 'receipt', 'claimedEffects', 'actualEffects',
        'truth', 'digest']) ||
      !exactKeys(envelope.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(envelope.sourceProposal,
        ['schema', 'receiptDigest', 'proposalId']) ||
      !exactKeys(envelope.sourcePolicy,
        ['schema', 'descriptorDigest', 'policyId', 'policyRevision']) ||
      !exactKeys(envelope.sourceHostReference,
        ['schema', 'receiptDigest', 'worldId', 'lineageId', 'hostRevision',
          'worldDigest']) ||
      !exactKeys(envelope.claimedAuthority,
        ['claimedHostAuthoritySeatId', 'claimedHostAuthorityKeyId',
          'claimedHostAuthorityPublicKeySha256', 'signatureAlgorithm',
          'publicKeyFormat']) ||
      !exactKeys(envelope.receipt,
        ['receiptId', 'issuedAt', 'expiresAt', 'nonce', 'claimedOutcome',
          'reasonCode']) ||
      !exactKeys(envelope.claimedEffects,
        ['hostAcceptedProposal', 'hostTrustAnchorInstalled',
          'callerSuppliedPolicyTrusted'])) return false;
  const input = {
    receiptId: envelope.receipt.receiptId,
    issuedAt: envelope.receipt.issuedAt,
    expiresAt: envelope.receipt.expiresAt,
    nonce: envelope.receipt.nonce,
    claimedOutcome: envelope.receipt.claimedOutcome,
    reasonCode: envelope.receipt.reasonCode,
    claimedHostAuthoritySeatId:
      envelope.claimedAuthority.claimedHostAuthoritySeatId,
    claimedHostAuthorityKeyId:
      envelope.claimedAuthority.claimedHostAuthorityKeyId,
    claimedHostAuthorityPublicKeySha256:
      envelope.claimedAuthority.claimedHostAuthorityPublicKeySha256
  };
  const structural = envelope.status ===
      'CALLER_SUPPLIED_UNTRUSTED_HOST_PROVISIONING_RECEIPT_CLAIMS_RECORDED_FOR_SIGNATURE_CHECK' &&
    envelope.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(envelope.sourceContract.receiptDigest) &&
    envelope.sourceProposal.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_SCHEMA &&
    fnvDigest(envelope.sourceProposal.receiptDigest) &&
    nonEmptyText(envelope.sourceProposal.proposalId, 256) &&
    envelope.sourcePolicy.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA &&
    fnvDigest(envelope.sourcePolicy.descriptorDigest) &&
    nonEmptyText(envelope.sourcePolicy.policyId, 256) &&
    Number.isInteger(envelope.sourcePolicy.policyRevision) &&
    envelope.sourcePolicy.policyRevision > 0 &&
    envelope.sourceHostReference.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_CLAIMED_HOST_REFERENCE_SCHEMA &&
    fnvDigest(envelope.sourceHostReference.receiptDigest) &&
    nonEmptyText(envelope.sourceHostReference.worldId, 256) &&
    nonEmptyText(envelope.sourceHostReference.lineageId, 512) &&
    Number.isSafeInteger(envelope.sourceHostReference.hostRevision) &&
    envelope.sourceHostReference.hostRevision >= 0 &&
    hostWorldDigest(envelope.sourceHostReference.worldDigest) &&
    receiptEnvelopeInputValid(input) &&
    envelope.claimedAuthority.signatureAlgorithm === SIGNATURE_ALGORITHM &&
    envelope.claimedAuthority.publicKeyFormat === PUBLIC_KEY_FORMAT &&
    exact(envelope.claimedEffects,
      expectedClaimedEffects(envelope.receipt.claimedOutcome)) &&
    exact(envelope.actualEffects, expectedActualEffects()) &&
    exact(envelope.truth, expectedEnvelopeTruth());
  if (!structural || contract === null) return structural;
  const contractBound =
    landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrityContractReceiptValid(
      contract) && exact(envelope.sourceContract, {
      schema: contract.schema,
      receiptDigest: contract.digest
    });
  if (!contractBound || proposal === null || policy === null ||
      hostProjection === null) return contractBound;
  const sourceContract =
    contract.sourceHostTrustAnchorProvisioningProposalContract;
  const proposalBound =
    landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningProposalValid(
      proposal, sourceContract, policy, hostProjection) &&
    exact(envelope.sourceProposal, {
      schema: proposal.schema,
      receiptDigest: proposal.digest,
      proposalId: proposal.request.proposalId
    }) && exact(envelope.sourcePolicy, {
      schema: policy.schema,
      descriptorDigest: policy.digest,
      policyId: policy.policyId,
      policyRevision: policy.policyRevision
    }) && exact(envelope.sourceHostReference, {
      schema: proposal.hostReference.schema,
      receiptDigest: proposal.hostReference.digest,
      worldId: proposal.hostReference.worldId,
      lineageId: proposal.hostReference.lineageId,
      hostRevision: proposal.hostReference.hostRevision,
      worldDigest: proposal.hostReference.worldDigest
    });
  const receiptTimeBound =
    Date.parse(envelope.receipt.issuedAt) >=
      Date.parse(proposal.request.requestedAt) &&
    Date.parse(envelope.receipt.expiresAt) <=
      Date.parse(proposal.request.expiresAt) &&
    envelope.receipt.nonce !== proposal.request.nonce &&
    envelope.claimedAuthority.claimedHostAuthoritySeatId ===
      proposal.request.requestedReviewSeatId;
  const authorityKeyDistinct =
    envelope.claimedAuthority.claimedHostAuthorityPublicKeySha256 !==
      policy.decisionKey.publicKeySha256 &&
    envelope.claimedAuthority.claimedHostAuthorityPublicKeySha256 !==
      policy.revocationKey.publicKeySha256;
  return proposalBound && receiptTimeBound && authorityKeyDistinct;
}

export function
createLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptEnvelope(
  contract, proposal, policy, hostProjection, input) {
  const sourceContract =
    contract?.sourceHostTrustAnchorProvisioningProposalContract;
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrityContractReceiptValid(
      contract) ||
      !landMatrixThermalHistoricalSourceVerifierKeyBindingCallerSuppliedPolicyDescriptorValid(
        policy, sourceContract?.sourceAuthorityDecisionIntegrityContract) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningProposalValid(
        proposal, sourceContract, policy, hostProjection) ||
      !receiptEnvelopeInputValid(input)) {
    throw new Error(
      'Provisioning-receipt envelope needs exact R106/R105/proposal/policy/host sources and bounded caller-supplied receipt claims');
  }
  if (Date.parse(input.issuedAt) < Date.parse(proposal.request.requestedAt) ||
      Date.parse(input.expiresAt) > Date.parse(proposal.request.expiresAt) ||
      input.nonce === proposal.request.nonce ||
      input.claimedHostAuthoritySeatId !==
        proposal.request.requestedReviewSeatId ||
      [policy.decisionKey.publicKeySha256,
        policy.revocationKey.publicKeySha256]
        .includes(input.claimedHostAuthorityPublicKeySha256)) {
    throw new Error(
      'Provisioning-receipt claims must remain inside the exact proposal window and use a distinct caller-supplied host key');
  }
  const envelope = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_ENVELOPE_SCHEMA,
    status:
      'CALLER_SUPPLIED_UNTRUSTED_HOST_PROVISIONING_RECEIPT_CLAIMS_RECORDED_FOR_SIGNATURE_CHECK',
    sourceContract: {
      schema: contract.schema,
      receiptDigest: contract.digest
    },
    sourceProposal: {
      schema: proposal.schema,
      receiptDigest: proposal.digest,
      proposalId: proposal.request.proposalId
    },
    sourcePolicy: {
      schema: policy.schema,
      descriptorDigest: policy.digest,
      policyId: policy.policyId,
      policyRevision: policy.policyRevision
    },
    sourceHostReference: {
      schema: proposal.hostReference.schema,
      receiptDigest: proposal.hostReference.digest,
      worldId: proposal.hostReference.worldId,
      lineageId: proposal.hostReference.lineageId,
      hostRevision: proposal.hostReference.hostRevision,
      worldDigest: proposal.hostReference.worldDigest
    },
    claimedAuthority: {
      claimedHostAuthoritySeatId: input.claimedHostAuthoritySeatId,
      claimedHostAuthorityKeyId: input.claimedHostAuthorityKeyId,
      claimedHostAuthorityPublicKeySha256:
        input.claimedHostAuthorityPublicKeySha256,
      signatureAlgorithm: SIGNATURE_ALGORITHM,
      publicKeyFormat: PUBLIC_KEY_FORMAT
    },
    receipt: {
      receiptId: input.receiptId,
      issuedAt: input.issuedAt,
      expiresAt: input.expiresAt,
      nonce: input.nonce,
      claimedOutcome: input.claimedOutcome,
      reasonCode: input.reasonCode
    },
    claimedEffects: expectedClaimedEffects(input.claimedOutcome),
    actualEffects: expectedActualEffects(),
    truth: expectedEnvelopeTruth()
  };
  envelope.digest = stableDigest(envelope);
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptEnvelopeValid(
      envelope, contract, proposal, policy, hostProjection)) {
    throw new Error('Provisioning-receipt envelope failed validation');
  }
  return envelope;
}

export function
canonicalLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptText(
  envelope) {
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptEnvelopeValid(
      envelope)) {
    throw new Error(
      'Canonical provisioning-receipt text needs a valid envelope');
  }
  return JSON.stringify(envelope);
}

export function
landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureInputValid(
  input) {
  return exactKeys(input, ['schema', 'receiptEnvelopeDigest',
      'hostAuthorityPublicKeyRaw', 'receiptSignature']) &&
    input.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INPUT_SCHEMA &&
    fnvDigest(input.receiptEnvelopeDigest) &&
    input.hostAuthorityPublicKeyRaw instanceof Uint8Array &&
    input.hostAuthorityPublicKeyRaw.byteLength ===
      ED25519_RAW_PUBLIC_KEY_BYTES &&
    input.receiptSignature instanceof Uint8Array &&
    input.receiptSignature.byteLength === ED25519_SIGNATURE_BYTES;
}

function expectedAssessmentIssues(checks) {
  const issues = [];
  if (!checks.hostAuthorityPublicKeyMatchesReceiptClaim) {
    issues.push('host-authority-public-key-receipt-claim-mismatch');
  }
  if (!checks.receiptDetachedSignatureValid) {
    issues.push('host-provisioning-receipt-detached-signature-invalid');
  }
  if (!checks.proposalWindowCurrent) {
    issues.push('host-provisioning-proposal-window-not-current');
  }
  if (!checks.receiptWindowCurrent) {
    issues.push('host-provisioning-receipt-window-not-current');
  }
  if (!checks.receiptIssuedWithinProposalWindow) {
    issues.push('host-provisioning-receipt-outside-proposal-window');
  }
  if (!checks.receiptNonceDistinctFromProposalNonce) {
    issues.push('host-provisioning-receipt-nonce-collides-with-proposal');
  }
  if (!checks.hostAuthorityKeySeparateFromPolicyKeys) {
    issues.push('host-authority-key-collides-with-policy-key');
  }
  return issues;
}

const expectedAssessmentTruth = integrityPass => ({
  exactR106ContractBound: true,
  exactR105ProposalBound: true,
  exactCallerSuppliedPolicyDescriptorBound: true,
  exactClaimedHostReferenceBound: true,
  detachedEd25519ProvisioningReceiptSignatureVerificationPerformed: true,
  provisioningReceiptSignatureIntegrityPassed: integrityPass,
  validSignatureMeansSuppliedHostKeyMatchOnly: true,
  hostAuthorityKeyTrusted: false,
  provisioningReceiptVerified: false,
  receiptClaimsAreNotAppliedEffects: true,
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
  rawHostAuthorityPublicKeyPersisted: false,
  receiptSignatureBytesPersisted: false,
  receiptEnvelopePersisted: false,
  receiptAssessmentPersisted: false,
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
landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrityAssessmentValid(
  assessment) {
  if (!digestValid(assessment,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_ASSESSMENT_SCHEMA) ||
      !exactKeys(assessment, ['schema', 'status', 'evaluatedAt',
        'sourceContract', 'sourceProposal', 'sourcePolicy',
        'sourceReceiptEnvelope', 'claimedAuthority', 'claimedOutcome',
        'cryptographic', 'checks', 'actualEffects', 'verdicts', 'issues',
        'truth', 'digest']) ||
      !exactKeys(assessment.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(assessment.sourceProposal,
        ['schema', 'receiptDigest', 'proposalId']) ||
      !exactKeys(assessment.sourcePolicy,
        ['schema', 'descriptorDigest', 'policyId', 'policyRevision']) ||
      !exactKeys(assessment.sourceReceiptEnvelope,
        ['schema', 'receiptDigest', 'receiptId']) ||
      !exactKeys(assessment.claimedAuthority,
        ['claimedHostAuthoritySeatId', 'claimedHostAuthorityKeyId']) ||
      !exactKeys(assessment.cryptographic,
        ['signatureAlgorithm', 'publicKeyFormat',
          'hostAuthorityPublicKeySha256', 'receiptSignatureSha256',
          'canonicalReceiptCharacterCount']) ||
      !exactKeys(assessment.checks,
        ['hostAuthorityPublicKeyMatchesReceiptClaim',
          'receiptDetachedSignatureValid', 'proposalWindowCurrent',
          'receiptWindowCurrent', 'receiptIssuedWithinProposalWindow',
          'receiptNonceDistinctFromProposalNonce',
          'hostAuthorityKeySeparateFromPolicyKeys']) ||
      !exactKeys(assessment.verdicts,
        ['receiptSignatureIntegrityVerdict', 'receiptAuthorityVerdict',
          'provisioningReceiptVerificationVerdict',
          'hostIdentityAuthenticationVerdict',
          'hostAuthorityToProvisionVerdict', 'hostAcceptanceVerdict',
          'hostTrustAnchorProvisioningVerdict',
          'callerSuppliedPolicyTrustVerdict', 'verifierKeyBindingVerdict',
          'observationAuthenticityVerdict', 'provenanceVerdict',
          'physicalMeaningReviewVerdict', 'evidenceVerificationVerdict',
          'admissionVerdict']) || !Array.isArray(assessment.issues)) {
    return false;
  }
  const checks = assessment.checks;
  const integrityPass =
    checks.hostAuthorityPublicKeyMatchesReceiptClaim &&
    checks.receiptDetachedSignatureValid && checks.proposalWindowCurrent &&
    checks.receiptWindowCurrent &&
    checks.receiptIssuedWithinProposalWindow &&
    checks.receiptNonceDistinctFromProposalNonce &&
    checks.hostAuthorityKeySeparateFromPolicyKeys;
  return assessment.status === (integrityPass
      ? 'PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_PASS_UNDER_CALLER_SUPPLIED_UNAUTHENTICATED_HOST_KEY'
      : 'PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_FAIL_UNDER_CALLER_SUPPLIED_UNAUTHENTICATED_HOST_KEY') &&
    isoTimestamp(assessment.evaluatedAt) &&
    assessment.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(assessment.sourceContract.receiptDigest) &&
    assessment.sourceProposal.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_SCHEMA &&
    fnvDigest(assessment.sourceProposal.receiptDigest) &&
    nonEmptyText(assessment.sourceProposal.proposalId, 256) &&
    assessment.sourcePolicy.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA &&
    fnvDigest(assessment.sourcePolicy.descriptorDigest) &&
    nonEmptyText(assessment.sourcePolicy.policyId, 256) &&
    Number.isInteger(assessment.sourcePolicy.policyRevision) &&
    assessment.sourcePolicy.policyRevision > 0 &&
    assessment.sourceReceiptEnvelope.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_ENVELOPE_SCHEMA &&
    fnvDigest(assessment.sourceReceiptEnvelope.receiptDigest) &&
    nonEmptyText(assessment.sourceReceiptEnvelope.receiptId, 256) &&
    nonEmptyText(
      assessment.claimedAuthority.claimedHostAuthoritySeatId, 256) &&
    nonEmptyText(
      assessment.claimedAuthority.claimedHostAuthorityKeyId, 256) &&
    OUTCOMES.includes(assessment.claimedOutcome) &&
    assessment.cryptographic.signatureAlgorithm === SIGNATURE_ALGORITHM &&
    assessment.cryptographic.publicKeyFormat === PUBLIC_KEY_FORMAT &&
    sha256Digest(
      assessment.cryptographic.hostAuthorityPublicKeySha256) &&
    sha256Digest(assessment.cryptographic.receiptSignatureSha256) &&
    Number.isInteger(
      assessment.cryptographic.canonicalReceiptCharacterCount) &&
    assessment.cryptographic.canonicalReceiptCharacterCount > 0 &&
    assessment.cryptographic.canonicalReceiptCharacterCount <= 2000000 &&
    Object.values(checks).every(value => typeof value === 'boolean') &&
    exact(assessment.actualEffects, expectedActualEffects()) &&
    assessment.verdicts.receiptSignatureIntegrityVerdict ===
      (integrityPass ? 'PASS' : 'FAIL') &&
    assessment.verdicts.receiptAuthorityVerdict === UNKNOWN &&
    assessment.verdicts.provisioningReceiptVerificationVerdict === UNKNOWN &&
    assessment.verdicts.hostIdentityAuthenticationVerdict === UNKNOWN &&
    assessment.verdicts.hostAuthorityToProvisionVerdict === UNKNOWN &&
    assessment.verdicts.hostAcceptanceVerdict === UNKNOWN &&
    assessment.verdicts.hostTrustAnchorProvisioningVerdict === UNKNOWN &&
    assessment.verdicts.callerSuppliedPolicyTrustVerdict ===
      'UNTRUSTED_CALLER_SUPPLIED' &&
    assessment.verdicts.verifierKeyBindingVerdict === UNKNOWN &&
    assessment.verdicts.observationAuthenticityVerdict === UNKNOWN &&
    assessment.verdicts.provenanceVerdict === UNKNOWN &&
    assessment.verdicts.physicalMeaningReviewVerdict === UNKNOWN &&
    assessment.verdicts.evidenceVerificationVerdict === UNKNOWN &&
    assessment.verdicts.admissionVerdict === NOT_AUTHORIZED &&
    exact(assessment.issues, expectedAssessmentIssues(checks)) &&
    exact(assessment.truth, expectedAssessmentTruth(integrityPass));
}

export async function
verifyLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrity(
  contract, proposal, policy, hostProjection, envelope, signatureInput,
  evaluatedAt) {
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrityContractReceiptValid(
      contract) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptEnvelopeValid(
        envelope, contract, proposal, policy, hostProjection) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureInputValid(
        signatureInput) || !isoTimestamp(evaluatedAt) ||
      signatureInput.receiptEnvelopeDigest !== envelope.digest) {
    throw new Error(
      'Provisioning-receipt signature verification needs exact R106/R105/proposal/policy/host/envelope/signature sources');
  }
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error('Web Crypto SubtleCrypto is unavailable');
  const publicKeyRaw =
    new Uint8Array(signatureInput.hostAuthorityPublicKeyRaw);
  const receiptSignature = new Uint8Array(signatureInput.receiptSignature);
  const canonicalReceipt =
    canonicalLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptText(
      envelope);
  const publicKey = await subtle.importKey('raw', publicKeyRaw,
    { name: SIGNATURE_ALGORITHM }, false, ['verify']);
  const receiptDetachedSignatureValid = await subtle.verify(
    { name: SIGNATURE_ALGORITHM }, publicKey, receiptSignature,
    new TextEncoder().encode(canonicalReceipt));
  const hostAuthorityPublicKeySha256 = await sha256ForBytes(publicKeyRaw);
  const receiptSignatureSha256 = await sha256ForBytes(receiptSignature);
  const evaluationTime = Date.parse(evaluatedAt);
  const checks = {
    hostAuthorityPublicKeyMatchesReceiptClaim:
      hostAuthorityPublicKeySha256 ===
        envelope.claimedAuthority.claimedHostAuthorityPublicKeySha256,
    receiptDetachedSignatureValid,
    proposalWindowCurrent:
      evaluationTime >= Date.parse(proposal.request.requestedAt) &&
      evaluationTime <= Date.parse(proposal.request.expiresAt),
    receiptWindowCurrent:
      evaluationTime >= Date.parse(envelope.receipt.issuedAt) &&
      evaluationTime <= Date.parse(envelope.receipt.expiresAt),
    receiptIssuedWithinProposalWindow:
      Date.parse(envelope.receipt.issuedAt) >=
        Date.parse(proposal.request.requestedAt) &&
      Date.parse(envelope.receipt.expiresAt) <=
        Date.parse(proposal.request.expiresAt),
    receiptNonceDistinctFromProposalNonce:
      envelope.receipt.nonce !== proposal.request.nonce,
    hostAuthorityKeySeparateFromPolicyKeys:
      hostAuthorityPublicKeySha256 !==
        policy.decisionKey.publicKeySha256 &&
      hostAuthorityPublicKeySha256 !==
        policy.revocationKey.publicKeySha256
  };
  const integrityPass = Object.values(checks).every(Boolean);
  const assessment = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_ASSESSMENT_SCHEMA,
    status: integrityPass
      ? 'PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_PASS_UNDER_CALLER_SUPPLIED_UNAUTHENTICATED_HOST_KEY'
      : 'PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_FAIL_UNDER_CALLER_SUPPLIED_UNAUTHENTICATED_HOST_KEY',
    evaluatedAt,
    sourceContract: {
      schema: contract.schema,
      receiptDigest: contract.digest
    },
    sourceProposal: {
      schema: proposal.schema,
      receiptDigest: proposal.digest,
      proposalId: proposal.request.proposalId
    },
    sourcePolicy: {
      schema: policy.schema,
      descriptorDigest: policy.digest,
      policyId: policy.policyId,
      policyRevision: policy.policyRevision
    },
    sourceReceiptEnvelope: {
      schema: envelope.schema,
      receiptDigest: envelope.digest,
      receiptId: envelope.receipt.receiptId
    },
    claimedAuthority: {
      claimedHostAuthoritySeatId:
        envelope.claimedAuthority.claimedHostAuthoritySeatId,
      claimedHostAuthorityKeyId:
        envelope.claimedAuthority.claimedHostAuthorityKeyId
    },
    claimedOutcome: envelope.receipt.claimedOutcome,
    cryptographic: {
      signatureAlgorithm: SIGNATURE_ALGORITHM,
      publicKeyFormat: PUBLIC_KEY_FORMAT,
      hostAuthorityPublicKeySha256,
      receiptSignatureSha256,
      canonicalReceiptCharacterCount: canonicalReceipt.length
    },
    checks,
    actualEffects: expectedActualEffects(),
    verdicts: {
      receiptSignatureIntegrityVerdict: integrityPass ? 'PASS' : 'FAIL',
      receiptAuthorityVerdict: UNKNOWN,
      provisioningReceiptVerificationVerdict: UNKNOWN,
      hostIdentityAuthenticationVerdict: UNKNOWN,
      hostAuthorityToProvisionVerdict: UNKNOWN,
      hostAcceptanceVerdict: UNKNOWN,
      hostTrustAnchorProvisioningVerdict: UNKNOWN,
      callerSuppliedPolicyTrustVerdict: 'UNTRUSTED_CALLER_SUPPLIED',
      verifierKeyBindingVerdict: UNKNOWN,
      observationAuthenticityVerdict: UNKNOWN,
      provenanceVerdict: UNKNOWN,
      physicalMeaningReviewVerdict: UNKNOWN,
      evidenceVerificationVerdict: UNKNOWN,
      admissionVerdict: NOT_AUTHORIZED
    },
    issues: expectedAssessmentIssues(checks),
    truth: expectedAssessmentTruth(integrityPass)
  };
  assessment.digest = stableDigest(assessment);
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrityAssessmentValid(
      assessment)) {
    throw new Error(
      'Provisioning-receipt signature-integrity assessment failed validation');
  }
  return assessment;
}

export function
matrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrityDescription() {
  return {
    contractReceiptSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
    routeSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_ROUTE_SCHEMA,
    receiptEnvelopeSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_ENVELOPE_SCHEMA,
    signatureInputSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INPUT_SCHEMA,
    signatureIntegrityAssessmentSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_ASSESSMENT_SCHEMA,
    requiredHostTrustAnchorProvisionCapabilityId:
      HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID,
    requiredProvisioningReceiptVerifyCapabilityId:
      HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID,
    provisioningReceiptSignatureVerifyCapabilityId:
      HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNATURE_VERIFY_CAPABILITY_ID,
    detachedEd25519ProvisioningReceiptSignatureVerificationImplemented: true,
    callerSuppliedHostAuthorityKeyOnly: true,
    hostAuthorityKeyTrusted: false,
    provisioningReceiptVerificationImplemented: false,
    hostTrustAnchorProvisioningImplemented: false,
    hostIdentityAuthenticationImplemented: false,
    hostAuthorityToProvisionVerificationImplemented: false,
    hostAcceptanceVerificationImplemented: false,
    receiptClaimsApplyAuthority: false,
    receiptEnvelopePersisted: false,
    receiptAssessmentPersisted: false,
    rawHostAuthorityPublicKeyPersisted: false,
    signatureBytesPersisted: false,
    replayLedgerImplemented: false,
    callerSuppliedPolicyTrusted: false,
    trustedVerifierKeyBindingImplemented: false,
    candidateAdmissionPathImplemented: false,
    worldMutationPerformed: false
  };
}
