import {
  HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID
} from './matrix-thermal-historical-source-verifier-key-binding-authority-decision-integrity.mjs?v=0.108.0-r108.1';
import {
  HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signature-integrity.mjs?v=0.108.0-r108.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA,
  HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestContractReceiptValid,
  landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestPacketValid
} from './matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-request.mjs?v=0.108.0-r108.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-authority-decision-integrity-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ROUTE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-authority-decision-integrity-route/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-caller-supplied-policy-descriptor/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_ENTRY_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-authority-decision-entry/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_ENVELOPE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-authority-decision-envelope/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REVOCATION_SNAPSHOT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-revocation-snapshot/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_SIGNATURE_INPUT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-authority-signature-input/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ASSESSMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-authority-decision-integrity-assessment/v1';

export const
  HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BINDING_DECISION_SIGNATURE_VERIFY_CAPABILITY_ID =
    'authority.host-trust-anchor.provision.receipt.signer-key.binding-decision.signature.verify';
export const
  HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BINDING_DECISION_REVOCATION_VERIFY_CAPABILITY_ID =
    'authority.host-trust-anchor.provision.receipt.signer-key.binding-decision.revocation.verify';

const SIGNATURE_ALGORITHM = 'Ed25519';
const PUBLIC_KEY_FORMAT = 'raw-ed25519-32-byte';
const ED25519_RAW_PUBLIC_KEY_BYTES = 32;
const ED25519_SIGNATURE_BYTES = 64;
const UNKNOWN = 'UNKNOWN';
const NOT_AUTHORIZED = 'NOT_AUTHORIZED';
const NATIVE_EMISSION_MODE =
  'native-from-intact-r107-receipt-signer-key-binding-request-contract';
const MIGRATION_EMISSION_MODE =
  'migration-from-exact-retained-r107-receipt-signer-key-binding-request-contract';
const ALLOWED_ACTIONS = ['BIND', 'HOLD', 'REJECT'];
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
const nonEmptyText = (value, maximum = 4096) =>
  typeof value === 'string' && value.trim().length > 0 &&
    value.length <= maximum;
const isoTimestamp = value =>
  nonEmptyText(value, 64) && Number.isFinite(Date.parse(value));
const unique = values => new Set(values).size === values.length;
const sorted = values => exact(values, [...values].sort());

async function sha256ForBytes(bytes) {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return `sha256:${Array.from(new Uint8Array(digest), value =>
    value.toString(16).padStart(2, '0')).join('')}`;
}

function expectedRoutes(sourceContract) {
  return sourceContract.receiptSignerKeyBindingRoutes.map(sourceRoute => {
    const eligible =
      sourceRoute.eligibleForReceiptSignerKeyBindingRequest === true;
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ROUTE_SCHEMA,
      routeId: `receipt-signer-key-binding-authority-decision:${sourceRoute.routeId}`,
      sourceReceiptSignerKeyBindingRouteId: sourceRoute.routeId,
      requestBinding: clone(sourceRoute.requestBinding),
      eligibleForReceiptSignerKeyBindingAuthorityDecisionIntegrity: eligible,
      sourceRequestPacketSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA
        : null,
      implementedBindingDecisionSignatureVerifyCapabilityId: eligible
        ? HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BINDING_DECISION_SIGNATURE_VERIFY_CAPABILITY_ID
        : null,
      implementedBindingDecisionRevocationVerifyCapabilityId: eligible
        ? HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BINDING_DECISION_REVOCATION_VERIFY_CAPABILITY_ID
        : null,
      requiredReceiptSignerKeyBindingCapabilityId: eligible
        ? HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_CAPABILITY_ID
        : null,
      requiredProvisioningReceiptVerifyCapabilityId: eligible
        ? HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID : null,
      requiredHostTrustAnchorProvisionCapabilityId: eligible
        ? HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID : null,
      bindingDecisionIntegrityVerdict: eligible ? UNKNOWN : null,
      callerSuppliedPolicyTrustVerdict: eligible
        ? 'UNTRUSTED_CALLER_SUPPLIED' : null,
      receiptSignerKeyBindingVerdict: eligible ? UNKNOWN : null,
      provisioningReceiptVerificationVerdict: eligible ? UNKNOWN : null,
      hostTrustAnchorProvisioned: false,
      admissionVerdict: eligible ? NOT_AUTHORIZED : null
    };
  });
}

function expectedSummary(routes) {
  const eligible = routes.filter(route =>
    route.eligibleForReceiptSignerKeyBindingAuthorityDecisionIntegrity).length;
  return {
    sourceR107ReceiptSignerKeyBindingRequestContractCount: 1,
    bindingDecisionIntegrityRouteCount: 28,
    bindingDecisionIntegrityEligibleRouteCount: eligible,
    authorityReviewRouteExcludedCount: routes.length - eligible,
    implementedBindingDecisionSignatureVerifyRouteCount: eligible,
    implementedBindingDecisionRevocationVerifyRouteCount: eligible,
    persistedRequestPacketCount: 0,
    persistedCallerSuppliedPolicyDescriptorCount: 0,
    persistedBindingDecisionEnvelopeCount: 0,
    persistedRevocationSnapshotCount: 0,
    persistedIntegrityAssessmentCount: 0,
    trustedReceiptSignerKeyBindingCount: 0,
    verifiedProvisioningReceiptCount: 0,
    hostTrustAnchorCount: 0,
    receiptSignerKeyBindingImplemented: false,
    provisioningReceiptVerificationImplemented: false,
    hostTrustAnchorProvisioningImplemented: false,
    candidateAdmissionPathImplemented: false
  };
}

const expectedContractTruth = () => ({
  exactR107ReceiptSignerKeyBindingRequestContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourBindingDecisionIntegrityRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  exactR107RequestPacketRequired: true,
  bindingDecisionSignatureVerificationImplemented: true,
  bindingDecisionRevocationVerificationImplemented: true,
  validSignaturesMeanSuppliedPolicyKeyMatchOnly: true,
  callerSuppliedPolicyTrusted: false,
  hostAuthorityEvidenceAuthenticated: false,
  receiptSignerKeyBindingImplemented: false,
  hostAuthorityKeyTrusted: false,
  hostIdentityAuthenticated: false,
  hostAuthorityToProvisionEstablished: false,
  provisioningReceiptVerified: false,
  hostAccepted: false,
  hostTrustAnchorProvisioned: false,
  trustedVerifierKeyBindingImplemented: false,
  observationAuthenticityVerified: false,
  provenanceVerified: false,
  physicalMeaningReviewImplemented: false,
  evidenceVerified: false,
  requestPacketPersisted: false,
  callerSuppliedPolicyDescriptorPersisted: false,
  bindingDecisionEnvelopePersisted: false,
  revocationSnapshotPersisted: false,
  integrityAssessmentPersisted: false,
  rawAuthorityPublicKeysPersisted: false,
  signatureBytesPersisted: false,
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
landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
  receipt) {
  const source = receipt?.sourceReceiptSignerKeyBindingRequestContract;
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
        'sourceReceiptSignerKeyBindingRequestContract',
        'bindingDecisionIntegrityRoutes', 'summary', 'emission', 'truth',
        'digest']) || !exactKeys(receipt.source, ['schema', 'receiptDigest']) ||
      !exactKeys(receipt.emission,
        ['mode',
          'sourceWasExactRetainedReceiptSignerKeyBindingRequestContractMigration']) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestContractReceiptValid(
        source)) return false;
  const routes = expectedRoutes(source);
  const migration = receipt.emission.mode === MIGRATION_EMISSION_MODE;
  return receipt.status ===
      'binding-decision-and-revocation-signature-integrity-available-under-caller-supplied-untrusted-policy-without-binding-receipt-authority-or-provisioning' &&
    exact(receipt.creationContext, source.creationContext) &&
    receipt.source.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA &&
    receipt.source.receiptDigest === source.digest &&
    exact(receipt.bindingDecisionIntegrityRoutes, routes) &&
    exact(receipt.summary, expectedSummary(routes)) &&
    [NATIVE_EMISSION_MODE, MIGRATION_EMISSION_MODE]
      .includes(receipt.emission.mode) &&
    receipt.emission
      .sourceWasExactRetainedReceiptSignerKeyBindingRequestContractMigration ===
        migration && exact(receipt.truth, expectedContractTruth());
}

export function
createLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityContractReceipt(
  creationContext, sourceContract, options = {}) {
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestContractReceiptValid(
      sourceContract) || !exact(creationContext, sourceContract.creationContext)) {
    throw new Error(
      'Binding-decision integrity contract needs the exact attached R107 signer-key-binding request contract');
  }
  const routes = expectedRoutes(sourceContract);
  const migration = options
    .sourceWasExactRetainedReceiptSignerKeyBindingRequestContractMigration === true;
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
    status:
      'binding-decision-and-revocation-signature-integrity-available-under-caller-supplied-untrusted-policy-without-binding-receipt-authority-or-provisioning',
    creationContext: clone(creationContext),
    source: {
      schema: sourceContract.schema,
      receiptDigest: sourceContract.digest
    },
    sourceReceiptSignerKeyBindingRequestContract: clone(sourceContract),
    bindingDecisionIntegrityRoutes: routes,
    summary: expectedSummary(routes),
    emission: {
      mode: migration ? MIGRATION_EMISSION_MODE : NATIVE_EMISSION_MODE,
      sourceWasExactRetainedReceiptSignerKeyBindingRequestContractMigration:
        migration
    },
    truth: expectedContractTruth()
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      receipt)) {
    throw new Error('Binding-decision integrity contract failed validation');
  }
  return receipt;
}

export function
landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingCallerSuppliedPolicyDescriptorValid(
  policy, contract = null, packet = null) {
  if (!digestValid(policy,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA) ||
      !exactKeys(policy, ['schema', 'status', 'sourceContract',
        'sourceRequestPacket', 'policyId', 'policyRevision',
        'claimedReviewSeatId', 'decisionKey', 'revocationKey', 'validity',
        'truth', 'digest']) ||
      !exactKeys(policy.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(policy.sourceRequestPacket, ['schema', 'receiptDigest']) ||
      !exactKeys(policy.decisionKey, ['keyId', 'publicKeySha256']) ||
      !exactKeys(policy.revocationKey, ['keyId', 'publicKeySha256']) ||
      !exactKeys(policy.validity, ['validFrom', 'expiresAt',
        'maximumDecisionAgeSeconds', 'maximumRevocationSnapshotAgeSeconds']) ||
      !exactKeys(policy.truth, ['callerSuppliedPolicyTrusted',
        'hostAuthorityEvidenceAuthenticated', 'receiptSignerKeyBound',
        'rawAuthorityPublicKeysPersisted', 'worldMutationPerformed'])) {
    return false;
  }
  const structural = policy.status ===
      'CALLER_SUPPLIED_UNTRUSTED_BINDING_DECISION_POLICY_FOR_SIGNATURE_INTEGRITY_ONLY' &&
    policy.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(policy.sourceContract.receiptDigest) &&
    policy.sourceRequestPacket.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA &&
    fnvDigest(policy.sourceRequestPacket.receiptDigest) &&
    nonEmptyText(policy.policyId, 256) &&
    Number.isInteger(policy.policyRevision) && policy.policyRevision > 0 &&
    nonEmptyText(policy.claimedReviewSeatId, 256) &&
    nonEmptyText(policy.decisionKey.keyId, 256) &&
    sha256Digest(policy.decisionKey.publicKeySha256) &&
    nonEmptyText(policy.revocationKey.keyId, 256) &&
    sha256Digest(policy.revocationKey.publicKeySha256) &&
    policy.decisionKey.publicKeySha256 !==
      policy.revocationKey.publicKeySha256 &&
    isoTimestamp(policy.validity.validFrom) &&
    isoTimestamp(policy.validity.expiresAt) &&
    Date.parse(policy.validity.expiresAt) >
      Date.parse(policy.validity.validFrom) &&
    Date.parse(policy.validity.expiresAt) -
      Date.parse(policy.validity.validFrom) <= 7 * 24 * 60 * 60 * 1000 &&
    Number.isInteger(policy.validity.maximumDecisionAgeSeconds) &&
    policy.validity.maximumDecisionAgeSeconds > 0 &&
    policy.validity.maximumDecisionAgeSeconds <= 24 * 60 * 60 &&
    Number.isInteger(policy.validity.maximumRevocationSnapshotAgeSeconds) &&
    policy.validity.maximumRevocationSnapshotAgeSeconds > 0 &&
    policy.validity.maximumRevocationSnapshotAgeSeconds <= 24 * 60 * 60 &&
    exact(policy.truth, {
      callerSuppliedPolicyTrusted: false,
      hostAuthorityEvidenceAuthenticated: false,
      receiptSignerKeyBound: false,
      rawAuthorityPublicKeysPersisted: false,
      worldMutationPerformed: false
    });
  if (!structural || contract === null) return structural;
  return packet &&
    landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      contract) &&
    landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestPacketValid(
      packet) && exact(policy.sourceContract, {
      schema: contract.schema,
      receiptDigest: contract.digest
    }) && exact(policy.sourceRequestPacket, {
      schema: packet.schema,
      receiptDigest: packet.digest
    }) && policy.decisionKey.publicKeySha256 !==
      packet.claimedAuthority.claimedHostAuthorityPublicKeySha256 &&
    policy.revocationKey.publicKeySha256 !==
      packet.claimedAuthority.claimedHostAuthorityPublicKeySha256;
}

export function
createLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingCallerSuppliedPolicyDescriptor(
  contract, packet, input) {
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      contract) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestPacketValid(
        packet) || !exactKeys(input, ['policyId', 'policyRevision',
        'claimedReviewSeatId', 'decisionKeyId', 'decisionPublicKeySha256',
        'revocationKeyId', 'revocationPublicKeySha256', 'validFrom',
        'expiresAt', 'maximumDecisionAgeSeconds',
        'maximumRevocationSnapshotAgeSeconds'])) {
    throw new Error(
      'Caller-supplied binding-decision policy needs exact R108/R107 sources and bounded policy input');
  }
  const policy = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA,
    status:
      'CALLER_SUPPLIED_UNTRUSTED_BINDING_DECISION_POLICY_FOR_SIGNATURE_INTEGRITY_ONLY',
    sourceContract: { schema: contract.schema, receiptDigest: contract.digest },
    sourceRequestPacket: { schema: packet.schema, receiptDigest: packet.digest },
    policyId: input.policyId,
    policyRevision: input.policyRevision,
    claimedReviewSeatId: input.claimedReviewSeatId,
    decisionKey: {
      keyId: input.decisionKeyId,
      publicKeySha256: input.decisionPublicKeySha256
    },
    revocationKey: {
      keyId: input.revocationKeyId,
      publicKeySha256: input.revocationPublicKeySha256
    },
    validity: {
      validFrom: input.validFrom,
      expiresAt: input.expiresAt,
      maximumDecisionAgeSeconds: input.maximumDecisionAgeSeconds,
      maximumRevocationSnapshotAgeSeconds:
        input.maximumRevocationSnapshotAgeSeconds
    },
    truth: {
      callerSuppliedPolicyTrusted: false,
      hostAuthorityEvidenceAuthenticated: false,
      receiptSignerKeyBound: false,
      rawAuthorityPublicKeysPersisted: false,
      worldMutationPerformed: false
    }
  };
  policy.digest = stableDigest(policy);
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingCallerSuppliedPolicyDescriptorValid(
      policy, contract, packet)) {
    throw new Error('Caller-supplied binding-decision policy failed validation');
  }
  return policy;
}

function decisionEntryValid(entry) {
  return exactKeys(entry, ['schema', 'requestId', 'requestBindingDigest',
      'requestedBinding', 'action', 'reasonCode', 'actualEffects']) &&
    entry.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_ENTRY_SCHEMA &&
    nonEmptyText(entry.requestId, 2048) &&
    fnvDigest(entry.requestBindingDigest) &&
    entry.requestedBinding && typeof entry.requestedBinding === 'object' &&
    ALLOWED_ACTIONS.includes(entry.action) &&
    nonEmptyText(entry.reasonCode, 256) &&
    exact(entry.actualEffects, {
      applyBinding: false,
      verifyReceipt: false,
      installTrustAnchor: false,
      persist: false,
      worldMutationPerformed: false
    });
}

function expectedDecisionSummary(entries) {
  return {
    decisionEntryCount: entries.length,
    requestedBindActionCount: entries.filter(entry =>
      entry.action === 'BIND').length,
    requestedHoldActionCount: entries.filter(entry =>
      entry.action === 'HOLD').length,
    requestedRejectActionCount: entries.filter(entry =>
      entry.action === 'REJECT').length,
    appliedBindingCount: 0,
    persistedDecisionCount: 0
  };
}

export function
landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionEnvelopeValid(
  envelope, contract = null, packet = null, policy = null) {
  if (!digestValid(envelope,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_ENVELOPE_SCHEMA) ||
      !exactKeys(envelope, ['schema', 'status', 'sourceContract',
        'sourceRequestPacket', 'sourcePolicyDescriptor', 'decisionId',
        'issuedAt', 'expiresAt', 'nonce', 'claimedAuthority', 'decisions',
        'summary', 'truth', 'digest']) ||
      !exactKeys(envelope.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(envelope.sourceRequestPacket, ['schema', 'receiptDigest']) ||
      !exactKeys(envelope.sourcePolicyDescriptor,
        ['schema', 'receiptDigest']) ||
      !exactKeys(envelope.claimedAuthority,
        ['claimedReviewSeatId', 'decisionKeyId']) ||
      !Array.isArray(envelope.decisions) || envelope.decisions.length !== 24 ||
      !envelope.decisions.every(decisionEntryValid)) return false;
  const ids = envelope.decisions.map(entry => entry.requestId);
  const structural = envelope.status ===
      'UNTRUSTED_SIGNER_KEY_BINDING_ACTIONS_RECORDED_FOR_SIGNATURE_INTEGRITY_ONLY' &&
    envelope.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(envelope.sourceContract.receiptDigest) &&
    envelope.sourceRequestPacket.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA &&
    fnvDigest(envelope.sourceRequestPacket.receiptDigest) &&
    envelope.sourcePolicyDescriptor.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA &&
    fnvDigest(envelope.sourcePolicyDescriptor.receiptDigest) &&
    nonEmptyText(envelope.decisionId, 256) && isoTimestamp(envelope.issuedAt) &&
    isoTimestamp(envelope.expiresAt) &&
    Date.parse(envelope.expiresAt) > Date.parse(envelope.issuedAt) &&
    nonEmptyText(envelope.nonce, 256) &&
    nonEmptyText(envelope.claimedAuthority.claimedReviewSeatId, 256) &&
    nonEmptyText(envelope.claimedAuthority.decisionKeyId, 256) &&
    unique(ids) && sorted(ids) &&
    exact(envelope.summary, expectedDecisionSummary(envelope.decisions)) &&
    exact(envelope.truth, {
      decisionActionsAreUntrustedClaims: true,
      callerSuppliedPolicyTrusted: false,
      hostAuthorityEvidenceAuthenticated: false,
      receiptSignerKeyBound: false,
      requestedBindActionAppliesBinding: false,
      worldMutationPerformed: false
    });
  if (!structural || contract === null) return structural;
  if (!packet || !policy ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
        contract) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestPacketValid(
        packet) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingCallerSuppliedPolicyDescriptorValid(
        policy, contract, packet)) return false;
  const requests = new Map(packet.receiptSignerKeyBindingRequests.map(request =>
    [request.requestId, request]));
  return exact(envelope.sourceContract,
      { schema: contract.schema, receiptDigest: contract.digest }) &&
    exact(envelope.sourceRequestPacket,
      { schema: packet.schema, receiptDigest: packet.digest }) &&
    exact(envelope.sourcePolicyDescriptor,
      { schema: policy.schema, receiptDigest: policy.digest }) &&
    envelope.claimedAuthority.claimedReviewSeatId ===
      policy.claimedReviewSeatId &&
    envelope.claimedAuthority.decisionKeyId === policy.decisionKey.keyId &&
    Date.parse(envelope.issuedAt) >= Date.parse(policy.validity.validFrom) &&
    Date.parse(envelope.expiresAt) <= Date.parse(policy.validity.expiresAt) &&
    Date.parse(envelope.expiresAt) - Date.parse(envelope.issuedAt) <=
      policy.validity.maximumDecisionAgeSeconds * 1000 &&
    envelope.decisions.every(entry => {
      const request = requests.get(entry.requestId);
      return request && entry.requestBindingDigest ===
        stableDigest(request.requestBinding) &&
        exact(entry.requestedBinding, request.requestedBinding);
    });
}

export function
createLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionEnvelope(
  contract, packet, policy, input) {
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      contract) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestPacketValid(
        packet) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingCallerSuppliedPolicyDescriptorValid(
        policy, contract, packet) ||
      !exactKeys(input, ['decisionId', 'issuedAt', 'expiresAt', 'nonce',
        'claimedReviewSeatId', 'decisions']) || !Array.isArray(input.decisions) ||
      input.decisions.length !== 24) {
    throw new Error(
      'Binding-decision envelope needs exact R108/R107/policy sources and 24 bounded decisions');
  }
  const actionByRequest = new Map(input.decisions.map(item =>
    [item.requestId, item]));
  if (actionByRequest.size !== 24 || input.decisions.some(item =>
      !exactKeys(item, ['requestId', 'action', 'reasonCode']) ||
      !ALLOWED_ACTIONS.includes(item.action) ||
      !nonEmptyText(item.reasonCode, 256))) {
    throw new Error('Binding decisions must uniquely cover the 24 requests');
  }
  const decisions = packet.receiptSignerKeyBindingRequests.map(request => {
    const inputDecision = actionByRequest.get(request.requestId);
    if (!inputDecision) {
      throw new Error('Binding decisions must exactly cover every R107 request');
    }
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_ENTRY_SCHEMA,
      requestId: request.requestId,
      requestBindingDigest: stableDigest(request.requestBinding),
      requestedBinding: clone(request.requestedBinding),
      action: inputDecision.action,
      reasonCode: inputDecision.reasonCode,
      actualEffects: {
        applyBinding: false,
        verifyReceipt: false,
        installTrustAnchor: false,
        persist: false,
        worldMutationPerformed: false
      }
    };
  }).sort((left, right) => left.requestId.localeCompare(right.requestId));
  const envelope = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_ENVELOPE_SCHEMA,
    status:
      'UNTRUSTED_SIGNER_KEY_BINDING_ACTIONS_RECORDED_FOR_SIGNATURE_INTEGRITY_ONLY',
    sourceContract: { schema: contract.schema, receiptDigest: contract.digest },
    sourceRequestPacket: { schema: packet.schema, receiptDigest: packet.digest },
    sourcePolicyDescriptor: { schema: policy.schema, receiptDigest: policy.digest },
    decisionId: input.decisionId,
    issuedAt: input.issuedAt,
    expiresAt: input.expiresAt,
    nonce: input.nonce,
    claimedAuthority: {
      claimedReviewSeatId: input.claimedReviewSeatId,
      decisionKeyId: policy.decisionKey.keyId
    },
    decisions,
    summary: expectedDecisionSummary(decisions),
    truth: {
      decisionActionsAreUntrustedClaims: true,
      callerSuppliedPolicyTrusted: false,
      hostAuthorityEvidenceAuthenticated: false,
      receiptSignerKeyBound: false,
      requestedBindActionAppliesBinding: false,
      worldMutationPerformed: false
    }
  };
  envelope.digest = stableDigest(envelope);
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionEnvelopeValid(
      envelope, contract, packet, policy)) {
    throw new Error('Binding-decision envelope failed validation');
  }
  return envelope;
}

export function
landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRevocationSnapshotValid(
  snapshot, contract = null, policy = null) {
  if (!digestValid(snapshot,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REVOCATION_SNAPSHOT_SCHEMA) ||
      !exactKeys(snapshot, ['schema', 'status', 'sourceContract',
        'sourcePolicyDescriptor', 'snapshotId', 'observedAt', 'expiresAt',
        'nonce', 'claimedAuthority', 'revokedDecisionDigests',
        'revokedDecisionNonces', 'revokedReceiptSignerPublicKeySha256',
        'summary', 'truth', 'digest']) ||
      !exactKeys(snapshot.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(snapshot.sourcePolicyDescriptor,
        ['schema', 'receiptDigest']) ||
      !exactKeys(snapshot.claimedAuthority,
        ['claimedReviewSeatId', 'revocationKeyId'])) return false;
  const arrays = [snapshot.revokedDecisionDigests,
    snapshot.revokedDecisionNonces,
    snapshot.revokedReceiptSignerPublicKeySha256];
  const structural = snapshot.status ===
      'UNTRUSTED_POLICY_REVOCATION_CLAIMS_RECORDED_FOR_SIGNATURE_INTEGRITY_ONLY' &&
    snapshot.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(snapshot.sourceContract.receiptDigest) &&
    snapshot.sourcePolicyDescriptor.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA &&
    fnvDigest(snapshot.sourcePolicyDescriptor.receiptDigest) &&
    nonEmptyText(snapshot.snapshotId, 256) &&
    isoTimestamp(snapshot.observedAt) && isoTimestamp(snapshot.expiresAt) &&
    Date.parse(snapshot.expiresAt) > Date.parse(snapshot.observedAt) &&
    nonEmptyText(snapshot.nonce, 256) &&
    nonEmptyText(snapshot.claimedAuthority.claimedReviewSeatId, 256) &&
    nonEmptyText(snapshot.claimedAuthority.revocationKeyId, 256) &&
    arrays.every(values => Array.isArray(values) && values.length <= 256 &&
      unique(values) && sorted(values)) &&
    snapshot.revokedDecisionDigests.every(fnvDigest) &&
    snapshot.revokedDecisionNonces.every(value => nonEmptyText(value, 256)) &&
    snapshot.revokedReceiptSignerPublicKeySha256.every(sha256Digest) &&
    exact(snapshot.summary, {
      revokedDecisionDigestCount: snapshot.revokedDecisionDigests.length,
      revokedDecisionNonceCount: snapshot.revokedDecisionNonces.length,
      revokedReceiptSignerPublicKeyCount:
        snapshot.revokedReceiptSignerPublicKeySha256.length,
      persistedRevocationSnapshotCount: 0
    }) && exact(snapshot.truth, {
      revocationClaimsAreUntrusted: true,
      callerSuppliedPolicyTrusted: false,
      receiptSignerKeyBindingRevokedOrApplied: false,
      worldMutationPerformed: false
    });
  if (!structural || contract === null) return structural;
  return policy &&
    landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      contract) &&
    landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingCallerSuppliedPolicyDescriptorValid(
      policy) && exact(snapshot.sourceContract,
      { schema: contract.schema, receiptDigest: contract.digest }) &&
    exact(snapshot.sourcePolicyDescriptor,
      { schema: policy.schema, receiptDigest: policy.digest }) &&
    snapshot.claimedAuthority.claimedReviewSeatId ===
      policy.claimedReviewSeatId &&
    snapshot.claimedAuthority.revocationKeyId ===
      policy.revocationKey.keyId &&
    Date.parse(snapshot.observedAt) >= Date.parse(policy.validity.validFrom) &&
    Date.parse(snapshot.expiresAt) <= Date.parse(policy.validity.expiresAt) &&
    Date.parse(snapshot.expiresAt) - Date.parse(snapshot.observedAt) <=
      policy.validity.maximumRevocationSnapshotAgeSeconds * 1000;
}

export function
createLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRevocationSnapshot(
  contract, policy, input) {
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      contract) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingCallerSuppliedPolicyDescriptorValid(
        policy) || !exactKeys(input, ['snapshotId', 'observedAt',
        'expiresAt', 'nonce', 'claimedReviewSeatId',
        'revokedDecisionDigests', 'revokedDecisionNonces',
        'revokedReceiptSignerPublicKeySha256'])) {
    throw new Error(
      'Binding revocation snapshot needs exact R108/policy sources and bounded revocation claims');
  }
  const snapshot = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REVOCATION_SNAPSHOT_SCHEMA,
    status:
      'UNTRUSTED_POLICY_REVOCATION_CLAIMS_RECORDED_FOR_SIGNATURE_INTEGRITY_ONLY',
    sourceContract: { schema: contract.schema, receiptDigest: contract.digest },
    sourcePolicyDescriptor: { schema: policy.schema, receiptDigest: policy.digest },
    snapshotId: input.snapshotId,
    observedAt: input.observedAt,
    expiresAt: input.expiresAt,
    nonce: input.nonce,
    claimedAuthority: {
      claimedReviewSeatId: input.claimedReviewSeatId,
      revocationKeyId: policy.revocationKey.keyId
    },
    revokedDecisionDigests: [...input.revokedDecisionDigests].sort(),
    revokedDecisionNonces: [...input.revokedDecisionNonces].sort(),
    revokedReceiptSignerPublicKeySha256:
      [...input.revokedReceiptSignerPublicKeySha256].sort(),
    summary: {
      revokedDecisionDigestCount: input.revokedDecisionDigests.length,
      revokedDecisionNonceCount: input.revokedDecisionNonces.length,
      revokedReceiptSignerPublicKeyCount:
        input.revokedReceiptSignerPublicKeySha256.length,
      persistedRevocationSnapshotCount: 0
    },
    truth: {
      revocationClaimsAreUntrusted: true,
      callerSuppliedPolicyTrusted: false,
      receiptSignerKeyBindingRevokedOrApplied: false,
      worldMutationPerformed: false
    }
  };
  snapshot.digest = stableDigest(snapshot);
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRevocationSnapshotValid(
      snapshot, contract, policy)) {
    throw new Error('Binding revocation snapshot failed validation');
  }
  return snapshot;
}

export function
canonicalLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionText(
  envelope) {
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionEnvelopeValid(
      envelope)) {
    throw new Error('Canonical binding-decision text needs a valid envelope');
  }
  return JSON.stringify(envelope);
}

export function
canonicalLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRevocationSnapshotText(
  snapshot) {
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRevocationSnapshotValid(
      snapshot)) {
    throw new Error('Canonical binding-revocation text needs a valid snapshot');
  }
  return JSON.stringify(snapshot);
}

export function
landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthoritySignatureInputValid(
  input) {
  return exactKeys(input, ['schema', 'policyDescriptorDigest',
      'decisionEnvelopeDigest', 'revocationSnapshotDigest',
      'decisionPublicKeyRaw', 'decisionSignature', 'revocationPublicKeyRaw',
      'revocationSignature']) && input.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_SIGNATURE_INPUT_SCHEMA &&
    fnvDigest(input.policyDescriptorDigest) &&
    fnvDigest(input.decisionEnvelopeDigest) &&
    fnvDigest(input.revocationSnapshotDigest) &&
    input.decisionPublicKeyRaw instanceof Uint8Array &&
    input.decisionPublicKeyRaw.byteLength === ED25519_RAW_PUBLIC_KEY_BYTES &&
    input.decisionSignature instanceof Uint8Array &&
    input.decisionSignature.byteLength === ED25519_SIGNATURE_BYTES &&
    input.revocationPublicKeyRaw instanceof Uint8Array &&
    input.revocationPublicKeyRaw.byteLength === ED25519_RAW_PUBLIC_KEY_BYTES &&
    input.revocationSignature instanceof Uint8Array &&
    input.revocationSignature.byteLength === ED25519_SIGNATURE_BYTES;
}

function expectedAssessmentIssues(checks) {
  const issues = [];
  if (!checks.policyDescriptorDigestMatchesInput) {
    issues.push('policy-descriptor-digest-input-mismatch');
  }
  if (!checks.decisionPublicKeyMatchesPolicyDescriptor) {
    issues.push('decision-public-key-policy-mismatch');
  }
  if (!checks.revocationPublicKeyMatchesPolicyDescriptor) {
    issues.push('revocation-public-key-policy-mismatch');
  }
  if (!checks.decisionSignatureValid) {
    issues.push('binding-decision-detached-signature-invalid');
  }
  if (!checks.revocationSignatureValid) {
    issues.push('binding-revocation-detached-signature-invalid');
  }
  if (!checks.policyWindowCurrent) issues.push('policy-window-not-current');
  if (!checks.decisionWindowCurrent) issues.push('decision-window-not-current');
  if (!checks.revocationSnapshotWindowCurrent) {
    issues.push('revocation-snapshot-window-not-current');
  }
  if (!checks.authorityKeysSeparateFromClaimedReceiptSignerKey) {
    issues.push('authority-key-collides-with-claimed-receipt-signer-key');
  }
  if (checks.decisionRevoked) issues.push('binding-decision-revoked');
  return issues;
}

const expectedAssessmentTruth = integrityPass => ({
  exactR108ContractBound: true,
  exactR107RequestPacketBound: true,
  exactCallerSuppliedPolicyDescriptorBound: true,
  exactBindingDecisionEnvelopeBound: true,
  exactRevocationSnapshotBound: true,
  detachedEd25519BindingDecisionVerificationPerformed: true,
  detachedEd25519RevocationSnapshotVerificationPerformed: true,
  decisionAndRevocationIntegrityPassed: integrityPass,
  validSignaturesMeanSuppliedPolicyKeyMatchOnly: true,
  callerSuppliedPolicyTrusted: false,
  hostAuthorityEvidenceAuthenticated: false,
  requestedBindActionAppliesBinding: false,
  receiptSignerKeyBound: false,
  receiptAuthorityVerified: false,
  provisioningReceiptVerified: false,
  hostIdentityAuthenticated: false,
  hostAuthorityToProvisionEstablished: false,
  hostAccepted: false,
  hostTrustAnchorProvisioned: false,
  rawAuthorityPublicKeysPersisted: false,
  signatureBytesPersisted: false,
  policyDescriptorPersisted: false,
  bindingDecisionEnvelopePersisted: false,
  revocationSnapshotPersisted: false,
  integrityAssessmentPersisted: false,
  replayLedgerImplemented: false,
  candidateAdmissionPerformed: false,
  admissionAuthorityGranted: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  worldMutationPerformed: false
});

export function
landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityAssessmentValid(
  assessment) {
  if (!digestValid(assessment,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ASSESSMENT_SCHEMA) ||
      !exactKeys(assessment, ['schema', 'status', 'evaluatedAt',
        'sourceContract', 'sourceRequestPacket', 'sourcePolicyDescriptor',
        'sourceDecisionEnvelope', 'sourceRevocationSnapshot',
        'claimedAuthority', 'cryptographic', 'checks', 'requestedActions',
        'verdicts', 'issues', 'truth', 'digest']) ||
      !exactKeys(assessment.claimedAuthority,
        ['claimedReviewSeatId', 'decisionKeyId', 'revocationKeyId']) ||
      !exactKeys(assessment.cryptographic, ['signatureAlgorithm',
        'publicKeyFormat', 'decisionPublicKeySha256',
        'decisionSignatureSha256', 'revocationPublicKeySha256',
        'revocationSignatureSha256', 'canonicalDecisionCharacterCount',
        'canonicalRevocationSnapshotCharacterCount']) ||
      !exactKeys(assessment.checks,
        ['policyDescriptorDigestMatchesInput',
          'decisionPublicKeyMatchesPolicyDescriptor',
          'revocationPublicKeyMatchesPolicyDescriptor',
          'decisionSignatureValid', 'revocationSignatureValid',
          'policyWindowCurrent', 'decisionWindowCurrent',
          'revocationSnapshotWindowCurrent',
          'authorityKeysSeparateFromClaimedReceiptSignerKey',
          'decisionRevoked']) ||
      !exactKeys(assessment.requestedActions,
        ['bind', 'hold', 'reject', 'appliedBindings']) ||
      !exactKeys(assessment.verdicts,
        ['bindingDecisionSignatureIntegrityVerdict',
          'bindingDecisionRevocationIntegrityVerdict',
          'decisionAndRevocationIntegrityVerdict',
          'callerSuppliedPolicyTrustVerdict',
          'hostAuthorityEvidenceAuthenticationVerdict',
          'receiptSignerKeyBindingVerdict', 'receiptAuthorityVerdict',
          'provisioningReceiptVerificationVerdict',
          'hostIdentityAuthenticationVerdict',
          'hostAuthorityToProvisionVerdict', 'hostAcceptanceVerdict',
          'hostTrustAnchorProvisioningVerdict', 'admissionVerdict']) ||
      !Array.isArray(assessment.issues)) return false;
  const sourceShape = value => exactKeys(value, ['schema', 'receiptDigest']) &&
    nonEmptyText(value.schema, 512) && fnvDigest(value.receiptDigest);
  if (![assessment.sourceContract, assessment.sourceRequestPacket,
    assessment.sourcePolicyDescriptor, assessment.sourceDecisionEnvelope,
    assessment.sourceRevocationSnapshot].every(sourceShape)) return false;
  const checks = assessment.checks;
  const integrityPass = checks.policyDescriptorDigestMatchesInput &&
    checks.decisionPublicKeyMatchesPolicyDescriptor &&
    checks.revocationPublicKeyMatchesPolicyDescriptor &&
    checks.decisionSignatureValid && checks.revocationSignatureValid &&
    checks.policyWindowCurrent && checks.decisionWindowCurrent &&
    checks.revocationSnapshotWindowCurrent &&
    checks.authorityKeysSeparateFromClaimedReceiptSignerKey &&
    !checks.decisionRevoked;
  return assessment.status === (integrityPass
      ? 'BINDING_DECISION_AND_REVOCATION_INTEGRITY_PASS_UNDER_CALLER_SUPPLIED_UNTRUSTED_POLICY'
      : 'BINDING_DECISION_OR_REVOCATION_INTEGRITY_FAIL_UNDER_CALLER_SUPPLIED_UNTRUSTED_POLICY') &&
    isoTimestamp(assessment.evaluatedAt) &&
    Object.values(checks).every(value => typeof value === 'boolean') &&
    nonEmptyText(assessment.claimedAuthority.claimedReviewSeatId, 256) &&
    nonEmptyText(assessment.claimedAuthority.decisionKeyId, 256) &&
    nonEmptyText(assessment.claimedAuthority.revocationKeyId, 256) &&
    assessment.cryptographic.signatureAlgorithm === SIGNATURE_ALGORITHM &&
    assessment.cryptographic.publicKeyFormat === PUBLIC_KEY_FORMAT &&
    sha256Digest(assessment.cryptographic.decisionPublicKeySha256) &&
    sha256Digest(assessment.cryptographic.decisionSignatureSha256) &&
    sha256Digest(assessment.cryptographic.revocationPublicKeySha256) &&
    sha256Digest(assessment.cryptographic.revocationSignatureSha256) &&
    Number.isInteger(assessment.cryptographic.canonicalDecisionCharacterCount) &&
    assessment.cryptographic.canonicalDecisionCharacterCount > 0 &&
    Number.isInteger(
      assessment.cryptographic.canonicalRevocationSnapshotCharacterCount) &&
    assessment.cryptographic.canonicalRevocationSnapshotCharacterCount > 0 &&
    assessment.requestedActions.bind + assessment.requestedActions.hold +
      assessment.requestedActions.reject === 24 &&
    assessment.requestedActions.appliedBindings === 0 &&
    assessment.verdicts.bindingDecisionSignatureIntegrityVerdict ===
      (checks.decisionSignatureValid ? 'PASS' : 'FAIL') &&
    assessment.verdicts.bindingDecisionRevocationIntegrityVerdict ===
      (checks.revocationSignatureValid ? 'PASS' : 'FAIL') &&
    assessment.verdicts.decisionAndRevocationIntegrityVerdict ===
      (integrityPass ? 'PASS' : 'FAIL') &&
    assessment.verdicts.callerSuppliedPolicyTrustVerdict ===
      'UNTRUSTED_CALLER_SUPPLIED' &&
    assessment.verdicts.hostAuthorityEvidenceAuthenticationVerdict ===
      UNKNOWN &&
    assessment.verdicts.receiptSignerKeyBindingVerdict === UNKNOWN &&
    assessment.verdicts.receiptAuthorityVerdict === UNKNOWN &&
    assessment.verdicts.provisioningReceiptVerificationVerdict === UNKNOWN &&
    assessment.verdicts.hostIdentityAuthenticationVerdict === UNKNOWN &&
    assessment.verdicts.hostAuthorityToProvisionVerdict === UNKNOWN &&
    assessment.verdicts.hostAcceptanceVerdict === UNKNOWN &&
    assessment.verdicts.hostTrustAnchorProvisioningVerdict === UNKNOWN &&
    assessment.verdicts.admissionVerdict === NOT_AUTHORIZED &&
    exact(assessment.issues, expectedAssessmentIssues(checks)) &&
    exact(assessment.truth, expectedAssessmentTruth(integrityPass));
}

export async function
verifyLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrity(
  contract, packet, policy, decisionEnvelope, revocationSnapshot,
  signatureInput, evaluatedAt) {
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      contract) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestPacketValid(
        packet) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingCallerSuppliedPolicyDescriptorValid(
        policy, contract, packet) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionEnvelopeValid(
        decisionEnvelope, contract, packet, policy) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRevocationSnapshotValid(
        revocationSnapshot, contract, policy) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthoritySignatureInputValid(
        signatureInput) || !isoTimestamp(evaluatedAt) ||
      signatureInput.policyDescriptorDigest !== policy.digest ||
      signatureInput.decisionEnvelopeDigest !== decisionEnvelope.digest ||
      signatureInput.revocationSnapshotDigest !== revocationSnapshot.digest) {
    throw new Error(
      'Binding-decision integrity verification needs exact R108/R107/policy/decision/revocation/signature sources');
  }
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error('Web Crypto SubtleCrypto is unavailable');
  const decisionPublicKeyRaw = new Uint8Array(
    signatureInput.decisionPublicKeyRaw);
  const decisionSignature = new Uint8Array(signatureInput.decisionSignature);
  const revocationPublicKeyRaw = new Uint8Array(
    signatureInput.revocationPublicKeyRaw);
  const revocationSignature = new Uint8Array(
    signatureInput.revocationSignature);
  const canonicalDecision =
    canonicalLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionText(
      decisionEnvelope);
  const canonicalRevocation =
    canonicalLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRevocationSnapshotText(
      revocationSnapshot);
  const decisionKey = await subtle.importKey('raw', decisionPublicKeyRaw,
    { name: SIGNATURE_ALGORITHM }, false, ['verify']);
  const revocationKey = await subtle.importKey('raw', revocationPublicKeyRaw,
    { name: SIGNATURE_ALGORITHM }, false, ['verify']);
  const decisionSignatureValid = await subtle.verify(
    { name: SIGNATURE_ALGORITHM }, decisionKey, decisionSignature,
    new TextEncoder().encode(canonicalDecision));
  const revocationSignatureValid = await subtle.verify(
    { name: SIGNATURE_ALGORITHM }, revocationKey, revocationSignature,
    new TextEncoder().encode(canonicalRevocation));
  const decisionPublicKeySha256 = await sha256ForBytes(decisionPublicKeyRaw);
  const decisionSignatureSha256 = await sha256ForBytes(decisionSignature);
  const revocationPublicKeySha256 = await sha256ForBytes(
    revocationPublicKeyRaw);
  const revocationSignatureSha256 = await sha256ForBytes(revocationSignature);
  const evaluationTime = Date.parse(evaluatedAt);
  const claimedSignerKeySha256 =
    packet.claimedAuthority.claimedHostAuthorityPublicKeySha256;
  const decisionRevoked =
    revocationSnapshot.revokedDecisionDigests.includes(
      decisionEnvelope.digest) ||
    revocationSnapshot.revokedDecisionNonces.includes(decisionEnvelope.nonce) ||
    revocationSnapshot.revokedReceiptSignerPublicKeySha256.includes(
      claimedSignerKeySha256);
  const checks = {
    policyDescriptorDigestMatchesInput:
      signatureInput.policyDescriptorDigest === policy.digest,
    decisionPublicKeyMatchesPolicyDescriptor:
      decisionPublicKeySha256 === policy.decisionKey.publicKeySha256,
    revocationPublicKeyMatchesPolicyDescriptor:
      revocationPublicKeySha256 === policy.revocationKey.publicKeySha256,
    decisionSignatureValid,
    revocationSignatureValid,
    policyWindowCurrent:
      evaluationTime >= Date.parse(policy.validity.validFrom) &&
      evaluationTime <= Date.parse(policy.validity.expiresAt),
    decisionWindowCurrent:
      evaluationTime >= Date.parse(decisionEnvelope.issuedAt) &&
      evaluationTime <= Date.parse(decisionEnvelope.expiresAt),
    revocationSnapshotWindowCurrent:
      evaluationTime >= Date.parse(revocationSnapshot.observedAt) &&
      evaluationTime <= Date.parse(revocationSnapshot.expiresAt),
    authorityKeysSeparateFromClaimedReceiptSignerKey:
      decisionPublicKeySha256 !== claimedSignerKeySha256 &&
      revocationPublicKeySha256 !== claimedSignerKeySha256,
    decisionRevoked
  };
  const integrityPass = checks.policyDescriptorDigestMatchesInput &&
    checks.decisionPublicKeyMatchesPolicyDescriptor &&
    checks.revocationPublicKeyMatchesPolicyDescriptor &&
    checks.decisionSignatureValid && checks.revocationSignatureValid &&
    checks.policyWindowCurrent && checks.decisionWindowCurrent &&
    checks.revocationSnapshotWindowCurrent &&
    checks.authorityKeysSeparateFromClaimedReceiptSignerKey &&
    !checks.decisionRevoked;
  const assessment = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ASSESSMENT_SCHEMA,
    status: integrityPass
      ? 'BINDING_DECISION_AND_REVOCATION_INTEGRITY_PASS_UNDER_CALLER_SUPPLIED_UNTRUSTED_POLICY'
      : 'BINDING_DECISION_OR_REVOCATION_INTEGRITY_FAIL_UNDER_CALLER_SUPPLIED_UNTRUSTED_POLICY',
    evaluatedAt,
    sourceContract: { schema: contract.schema, receiptDigest: contract.digest },
    sourceRequestPacket: { schema: packet.schema, receiptDigest: packet.digest },
    sourcePolicyDescriptor: { schema: policy.schema, receiptDigest: policy.digest },
    sourceDecisionEnvelope: {
      schema: decisionEnvelope.schema,
      receiptDigest: decisionEnvelope.digest
    },
    sourceRevocationSnapshot: {
      schema: revocationSnapshot.schema,
      receiptDigest: revocationSnapshot.digest
    },
    claimedAuthority: {
      claimedReviewSeatId: policy.claimedReviewSeatId,
      decisionKeyId: policy.decisionKey.keyId,
      revocationKeyId: policy.revocationKey.keyId
    },
    cryptographic: {
      signatureAlgorithm: SIGNATURE_ALGORITHM,
      publicKeyFormat: PUBLIC_KEY_FORMAT,
      decisionPublicKeySha256,
      decisionSignatureSha256,
      revocationPublicKeySha256,
      revocationSignatureSha256,
      canonicalDecisionCharacterCount: canonicalDecision.length,
      canonicalRevocationSnapshotCharacterCount: canonicalRevocation.length
    },
    checks,
    requestedActions: {
      bind: decisionEnvelope.summary.requestedBindActionCount,
      hold: decisionEnvelope.summary.requestedHoldActionCount,
      reject: decisionEnvelope.summary.requestedRejectActionCount,
      appliedBindings: 0
    },
    verdicts: {
      bindingDecisionSignatureIntegrityVerdict:
        decisionSignatureValid ? 'PASS' : 'FAIL',
      bindingDecisionRevocationIntegrityVerdict:
        revocationSignatureValid ? 'PASS' : 'FAIL',
      decisionAndRevocationIntegrityVerdict: integrityPass ? 'PASS' : 'FAIL',
      callerSuppliedPolicyTrustVerdict: 'UNTRUSTED_CALLER_SUPPLIED',
      hostAuthorityEvidenceAuthenticationVerdict: UNKNOWN,
      receiptSignerKeyBindingVerdict: UNKNOWN,
      receiptAuthorityVerdict: UNKNOWN,
      provisioningReceiptVerificationVerdict: UNKNOWN,
      hostIdentityAuthenticationVerdict: UNKNOWN,
      hostAuthorityToProvisionVerdict: UNKNOWN,
      hostAcceptanceVerdict: UNKNOWN,
      hostTrustAnchorProvisioningVerdict: UNKNOWN,
      admissionVerdict: NOT_AUTHORIZED
    },
    issues: expectedAssessmentIssues(checks),
    truth: expectedAssessmentTruth(integrityPass)
  };
  assessment.digest = stableDigest(assessment);
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityAssessmentValid(
      assessment)) {
    throw new Error('Binding-decision integrity assessment failed validation');
  }
  return assessment;
}

export function
matrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingAuthorityDecisionIntegrityDescription() {
  return {
    contractReceiptSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
    routeSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ROUTE_SCHEMA,
    callerSuppliedPolicyDescriptorSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA,
    authorityDecisionEntrySchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_ENTRY_SCHEMA,
    authorityDecisionEnvelopeSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_ENVELOPE_SCHEMA,
    revocationSnapshotSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REVOCATION_SNAPSHOT_SCHEMA,
    authoritySignatureInputSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_SIGNATURE_INPUT_SCHEMA,
    integrityAssessmentSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ASSESSMENT_SCHEMA,
    bindingDecisionSignatureVerifyCapabilityId:
      HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BINDING_DECISION_SIGNATURE_VERIFY_CAPABILITY_ID,
    bindingDecisionRevocationVerifyCapabilityId:
      HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BINDING_DECISION_REVOCATION_VERIFY_CAPABILITY_ID,
    requiredReceiptSignerKeyBindingCapabilityId:
      HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_CAPABILITY_ID,
    requiredProvisioningReceiptVerifyCapabilityId:
      HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID,
    requiredHostTrustAnchorProvisionCapabilityId:
      HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID,
    callerSuppliedPolicyTrusted: false,
    hostAuthorityEvidenceAuthenticated: false,
    receiptSignerKeyBindingImplemented: false,
    provisioningReceiptVerificationImplemented: false,
    hostTrustAnchorProvisioningImplemented: false,
    transientArtifactsPersisted: false,
    candidateAdmissionPathImplemented: false,
    mutatesWorld: false
  };
}
