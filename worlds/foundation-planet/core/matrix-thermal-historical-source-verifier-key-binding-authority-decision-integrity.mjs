import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_PACKET_SCHEMA,
  landMatrixThermalHistoricalSourceVerifierKeyBindingRequestContractReceiptValid,
  landMatrixThermalHistoricalSourceVerifierKeyBindingRequestPacketValid
} from './matrix-thermal-historical-source-verifier-key-binding-request.mjs?v=0.104.0-r104.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-verifier-key-binding-authority-decision-integrity-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ROUTE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-verifier-key-binding-authority-decision-integrity-route/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-verifier-key-binding-caller-supplied-policy-descriptor/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_ENVELOPE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-verifier-key-binding-authority-decision-envelope/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_ENTRY_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-verifier-key-binding-authority-decision-entry/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REVOCATION_SNAPSHOT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-verifier-key-binding-revocation-snapshot/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_SIGNATURE_INPUT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-verifier-key-binding-authority-signature-input/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ASSESSMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-verifier-key-binding-authority-decision-integrity-assessment/v1';

export const HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID =
  'authority.host-trust-anchor.provision';
export const VERIFIER_KEY_BINDING_DECISION_SIGNATURE_VERIFY_CAPABILITY_ID =
  'authority.verifier-key-binding-decision.signature.verify';
export const VERIFIER_KEY_BINDING_REVOCATION_VERIFY_CAPABILITY_ID =
  'authority.verifier-key-binding.revocation.verify';

const SIGNATURE_ALGORITHM = 'Ed25519';
const PUBLIC_KEY_FORMAT = 'raw-ed25519-32-byte';
const ED25519_RAW_PUBLIC_KEY_BYTES = 32;
const ED25519_SIGNATURE_BYTES = 64;
const UNKNOWN = 'UNKNOWN';
const NOT_AUTHORIZED = 'NOT_AUTHORIZED';
const NATIVE_EMISSION_MODE = 'native-from-intact-r103-verifier-key-binding-request-contract';
const MIGRATION_EMISSION_MODE = 'migration-from-exact-retained-r103-verifier-key-binding-request-contract';
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
const positiveBoundedInteger = (value, maximum) =>
  Number.isInteger(value) && value > 0 && value <= maximum;
const unique = values => new Set(values).size === values.length;
const sorted = values => exact(values, [...values].sort());

function expectedRoutes(sourceContract) {
  return sourceContract.verifierKeyBindingRoutes.map(sourceRoute => {
    const eligible =
      sourceRoute.eligibleForVerifierKeyBindingRequest === true;
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ROUTE_SCHEMA,
      routeId: `authority-decision-integrity:${sourceRoute.routeId}`,
      sourceVerifierKeyBindingRouteId: sourceRoute.routeId,
      requestBinding: clone(sourceRoute.requestBinding),
      eligibleForAuthorityDecisionIntegrity: eligible,
      sourceVerifierKeyBindingRequestSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_SCHEMA
        : null,
      callerSuppliedPolicyDescriptorSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA
        : null,
      authorityDecisionEnvelopeSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_ENVELOPE_SCHEMA
        : null,
      revocationSnapshotSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REVOCATION_SNAPSHOT_SCHEMA
        : null,
      decisionIntegrityAssessmentSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ASSESSMENT_SCHEMA
        : null,
      requiredHostTrustAnchorProvisionCapabilityId: eligible
        ? HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID : null,
      implementedDecisionSignatureVerificationCapabilityId: eligible
        ? VERIFIER_KEY_BINDING_DECISION_SIGNATURE_VERIFY_CAPABILITY_ID : null,
      implementedRevocationVerificationCapabilityId: eligible
        ? VERIFIER_KEY_BINDING_REVOCATION_VERIFY_CAPABILITY_ID : null,
      hostTrustAnchorProvisioned: false,
      callerSuppliedPolicyTrusted: false,
      trustedVerifierKeyBinding: null,
      verifierKeyBindingVerdict: UNKNOWN,
      verifierIdentityVerdict: UNKNOWN,
      verifierIndependenceVerdict: UNKNOWN,
      observationAuthenticityVerdict: UNKNOWN,
      provenanceVerdict: UNKNOWN,
      physicalMeaningReviewVerdict: UNKNOWN,
      admissionVerdict: NOT_AUTHORIZED
    };
  });
}

function expectedContractSummary(routes) {
  return {
    sourceR103VerifierKeyBindingRequestContractCount: 1,
    authorityDecisionIntegrityRouteCount: 28,
    authorityDecisionIntegrityEligibleRouteCount: routes.filter(route =>
      route.eligibleForAuthorityDecisionIntegrity).length,
    authorityReviewRouteExcludedCount: routes.filter(route =>
      !route.eligibleForAuthorityDecisionIntegrity).length,
    hostTrustAnchorCount: 0,
    trustedPolicyCount: 0,
    persistedPolicyDescriptorCount: 0,
    persistedAuthorityDecisionEnvelopeCount: 0,
    persistedRevocationSnapshotCount: 0,
    persistedIntegrityAssessmentCount: 0,
    trustedVerifierKeyBindingCount: 0,
    verifiedAuthenticObservationCount: 0,
    decisionSignatureVerificationImplemented: true,
    revocationVerificationImplemented: true,
    hostTrustAnchorProvisioningImplemented: false,
    verifierKeyBindingImplemented: false,
    verifierIdentityResolutionImplemented: false,
    verifierIndependenceVerificationImplemented: false,
    observationAuthenticityVerificationImplemented: false,
    candidateAdmissionPathImplemented: false
  };
}

const expectedContractTruth = () => ({
  exactR103VerifierKeyBindingRequestContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourAuthorityDecisionIntegrityRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  detachedEd25519AuthorityDecisionVerificationImplemented: true,
  detachedEd25519RevocationSnapshotVerificationImplemented: true,
  separateDecisionAndRevocationKeysRequired: true,
  exactPolicyDecisionAndRevocationDigestsRequired: true,
  boundedValidityWindowsRequired: true,
  explicitRevocationChecksImplemented: true,
  hostTrustAnchorProvisioningImplemented: false,
  callerSuppliedPolicyTrusted: false,
  validSignatureMeansSuppliedPolicyKeyMatchOnly: true,
  requestedBindActionAppliesBinding: false,
  trustedVerifierKeyBindingImplemented: false,
  trustedVerifierKeyBound: false,
  verifierIdentityResolutionImplemented: false,
  claimedVerifierIdentityTrusted: false,
  verifierIndependenceVerificationImplemented: false,
  verifierIndependenceEstablished: false,
  observationAuthenticityVerified: false,
  provenanceVerified: false,
  physicalMeaningReviewImplemented: false,
  evidenceVerified: false,
  authoritySelfAttestationAccepted: false,
  policyDescriptorsPersisted: false,
  authorityDecisionEnvelopesPersisted: false,
  revocationSnapshotsPersisted: false,
  integrityAssessmentsPersisted: false,
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
landMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
  receipt) {
  const source = receipt?.sourceVerifierKeyBindingRequestContract;
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
        'sourceVerifierKeyBindingRequestContract',
        'authorityDecisionIntegrityRoutes', 'summary', 'emission', 'truth',
        'digest']) ||
      !exactKeys(receipt.source, ['schema', 'receiptDigest']) ||
      !exactKeys(receipt.emission,
        ['mode', 'sourceWasExactRetainedVerifierKeyBindingRequestContractMigration']) ||
      !landMatrixThermalHistoricalSourceVerifierKeyBindingRequestContractReceiptValid(
        source)) return false;
  const routes = expectedRoutes(source);
  const migration = receipt.emission?.mode === MIGRATION_EMISSION_MODE;
  return receipt.status ===
      'authority-decision-and-revocation-integrity-available-under-caller-supplied-untrusted-policy-without-binding-or-admission' &&
    exact(receipt.creationContext, source.creationContext) &&
    receipt.source.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA &&
    receipt.source.receiptDigest === source.digest &&
    exact(receipt.authorityDecisionIntegrityRoutes, routes) &&
    exact(receipt.summary, expectedContractSummary(routes)) &&
    [NATIVE_EMISSION_MODE, MIGRATION_EMISSION_MODE]
      .includes(receipt.emission.mode) &&
    receipt.emission
      .sourceWasExactRetainedVerifierKeyBindingRequestContractMigration ===
      migration && exact(receipt.truth, expectedContractTruth());
}

export function
createLandMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityContractReceipt(
  creationContext, sourceContract, options = {}) {
  if (!landMatrixThermalHistoricalSourceVerifierKeyBindingRequestContractReceiptValid(
      sourceContract) || !exact(creationContext, sourceContract.creationContext)) {
    throw new Error(
      'Authority-decision integrity contract needs the exact attached R103 verifier-key-binding request contract');
  }
  const routes = expectedRoutes(sourceContract);
  const migration = options
    .sourceWasExactRetainedVerifierKeyBindingRequestContractMigration === true;
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
    status:
      'authority-decision-and-revocation-integrity-available-under-caller-supplied-untrusted-policy-without-binding-or-admission',
    creationContext: clone(creationContext),
    source: {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA,
      receiptDigest: sourceContract.digest
    },
    sourceVerifierKeyBindingRequestContract: clone(sourceContract),
    authorityDecisionIntegrityRoutes: routes,
    summary: expectedContractSummary(routes),
    emission: {
      mode: migration ? MIGRATION_EMISSION_MODE : NATIVE_EMISSION_MODE,
      sourceWasExactRetainedVerifierKeyBindingRequestContractMigration:
        migration
    },
    truth: expectedContractTruth()
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      receipt)) {
    throw new Error('Authority-decision integrity contract failed validation');
  }
  return receipt;
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

function authorityPublicKeyInputValid(input) {
  return exactKeys(input, ['policyId', 'policyRevision', 'validFrom',
      'expiresAt', 'maximumDecisionAgeSeconds',
      'maximumRevocationSnapshotAgeSeconds', 'decisionKeyId',
      'decisionPublicKeyRaw', 'revocationKeyId', 'revocationPublicKeyRaw']) &&
    nonEmptyText(input.policyId, 256) &&
    positiveBoundedInteger(input.policyRevision, 1000000) &&
    isoTimestamp(input.validFrom) && isoTimestamp(input.expiresAt) &&
    Date.parse(input.validFrom) < Date.parse(input.expiresAt) &&
    positiveBoundedInteger(input.maximumDecisionAgeSeconds, 2592000) &&
    positiveBoundedInteger(input.maximumRevocationSnapshotAgeSeconds,
      2592000) &&
    nonEmptyText(input.decisionKeyId, 256) &&
    nonEmptyText(input.revocationKeyId, 256) &&
    input.decisionKeyId !== input.revocationKeyId &&
    input.decisionPublicKeyRaw instanceof Uint8Array &&
    input.decisionPublicKeyRaw.byteLength === ED25519_RAW_PUBLIC_KEY_BYTES &&
    input.revocationPublicKeyRaw instanceof Uint8Array &&
    input.revocationPublicKeyRaw.byteLength === ED25519_RAW_PUBLIC_KEY_BYTES;
}

const expectedPolicyTruth = () => ({
  exactR104ContractBound: true,
  callerSuppliedPolicyDescriptorOnly: true,
  callerSuppliedPolicyTrusted: false,
  hostTrustAnchorProvisioned: false,
  separateDecisionAndRevocationKeysRequired: true,
  rawAuthorityPublicKeysPersisted: false,
  authorityPrivateKeysAccepted: false,
  policyDescriptorPersisted: false,
  verifierKeyBindingImplemented: false,
  authorityGranted: false,
  worldMutationPerformed: false
});

export function
landMatrixThermalHistoricalSourceVerifierKeyBindingCallerSuppliedPolicyDescriptorValid(
  policy, contract = null) {
  if (!digestValid(policy,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA) ||
      !exactKeys(policy, ['schema', 'status', 'sourceContract', 'policyId',
        'policyRevision', 'scope', 'validity', 'decisionKey',
        'revocationKey', 'capabilities', 'truth', 'digest']) ||
      !exactKeys(policy.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(policy.scope, ['authorityDecisionIntegrityRouteIds']) ||
      !exactKeys(policy.validity, ['validFrom', 'expiresAt',
        'maximumDecisionAgeSeconds',
        'maximumRevocationSnapshotAgeSeconds']) ||
      !exactKeys(policy.decisionKey, ['keyId', 'signatureAlgorithm',
        'publicKeyFormat', 'publicKeySha256']) ||
      !exactKeys(policy.revocationKey, ['keyId', 'signatureAlgorithm',
        'publicKeyFormat', 'publicKeySha256']) ||
      !exactKeys(policy.capabilities, ['hostTrustAnchorProvisionCapabilityId',
        'decisionSignatureVerificationCapabilityId',
        'revocationVerificationCapabilityId']) ||
      !Array.isArray(policy.scope.authorityDecisionIntegrityRouteIds)) {
    return false;
  }
  const structural = policy.status ===
      'CALLER_SUPPLIED_UNTRUSTED_VERIFIER_BINDING_POLICY_DESCRIPTOR' &&
    policy.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(policy.sourceContract.receiptDigest) &&
    nonEmptyText(policy.policyId, 256) &&
    positiveBoundedInteger(policy.policyRevision, 1000000) &&
    policy.scope.authorityDecisionIntegrityRouteIds.length === 24 &&
    unique(policy.scope.authorityDecisionIntegrityRouteIds) &&
    sorted(policy.scope.authorityDecisionIntegrityRouteIds) &&
    policy.scope.authorityDecisionIntegrityRouteIds.every(value =>
      nonEmptyText(value, 1024)) &&
    isoTimestamp(policy.validity.validFrom) &&
    isoTimestamp(policy.validity.expiresAt) &&
    Date.parse(policy.validity.validFrom) <
      Date.parse(policy.validity.expiresAt) &&
    positiveBoundedInteger(policy.validity.maximumDecisionAgeSeconds,
      2592000) &&
    positiveBoundedInteger(
      policy.validity.maximumRevocationSnapshotAgeSeconds, 2592000) &&
    nonEmptyText(policy.decisionKey.keyId, 256) &&
    nonEmptyText(policy.revocationKey.keyId, 256) &&
    policy.decisionKey.keyId !== policy.revocationKey.keyId &&
    policy.decisionKey.signatureAlgorithm === SIGNATURE_ALGORITHM &&
    policy.revocationKey.signatureAlgorithm === SIGNATURE_ALGORITHM &&
    policy.decisionKey.publicKeyFormat === PUBLIC_KEY_FORMAT &&
    policy.revocationKey.publicKeyFormat === PUBLIC_KEY_FORMAT &&
    sha256Digest(policy.decisionKey.publicKeySha256) &&
    sha256Digest(policy.revocationKey.publicKeySha256) &&
    policy.decisionKey.publicKeySha256 !==
      policy.revocationKey.publicKeySha256 &&
    policy.capabilities.hostTrustAnchorProvisionCapabilityId ===
      HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID &&
    policy.capabilities.decisionSignatureVerificationCapabilityId ===
      VERIFIER_KEY_BINDING_DECISION_SIGNATURE_VERIFY_CAPABILITY_ID &&
    policy.capabilities.revocationVerificationCapabilityId ===
      VERIFIER_KEY_BINDING_REVOCATION_VERIFY_CAPABILITY_ID &&
    exact(policy.truth, expectedPolicyTruth());
  if (!structural || contract === null) return structural;
  const expectedRouteIds = contract.authorityDecisionIntegrityRoutes
    .filter(route => route.eligibleForAuthorityDecisionIntegrity)
    .map(route => route.routeId).sort();
  return landMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      contract) &&
    exact(policy.sourceContract, {
      schema: contract.schema,
      receiptDigest: contract.digest
    }) && exact(policy.scope.authorityDecisionIntegrityRouteIds,
      expectedRouteIds);
}

export async function
createLandMatrixThermalHistoricalSourceVerifierKeyBindingCallerSuppliedPolicyDescriptor(
  contract, input) {
  if (!landMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      contract) || !authorityPublicKeyInputValid(input)) {
    throw new Error(
      'Caller-supplied policy descriptor needs exact R104, bounded validity, and two distinct Ed25519 public keys');
  }
  const decisionPublicKeyRaw = new Uint8Array(input.decisionPublicKeyRaw);
  const revocationPublicKeyRaw = new Uint8Array(input.revocationPublicKeyRaw);
  const decisionPublicKeySha256 = await sha256ForBytes(decisionPublicKeyRaw);
  const revocationPublicKeySha256 =
    await sha256ForBytes(revocationPublicKeyRaw);
  if (decisionPublicKeySha256 === revocationPublicKeySha256) {
    throw new Error('Decision and revocation public keys must be distinct');
  }
  const policy = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA,
    status: 'CALLER_SUPPLIED_UNTRUSTED_VERIFIER_BINDING_POLICY_DESCRIPTOR',
    sourceContract: {
      schema: contract.schema,
      receiptDigest: contract.digest
    },
    policyId: input.policyId,
    policyRevision: input.policyRevision,
    scope: {
      authorityDecisionIntegrityRouteIds:
        contract.authorityDecisionIntegrityRoutes
          .filter(route => route.eligibleForAuthorityDecisionIntegrity)
          .map(route => route.routeId).sort()
    },
    validity: {
      validFrom: input.validFrom,
      expiresAt: input.expiresAt,
      maximumDecisionAgeSeconds: input.maximumDecisionAgeSeconds,
      maximumRevocationSnapshotAgeSeconds:
        input.maximumRevocationSnapshotAgeSeconds
    },
    decisionKey: {
      keyId: input.decisionKeyId,
      signatureAlgorithm: SIGNATURE_ALGORITHM,
      publicKeyFormat: PUBLIC_KEY_FORMAT,
      publicKeySha256: decisionPublicKeySha256
    },
    revocationKey: {
      keyId: input.revocationKeyId,
      signatureAlgorithm: SIGNATURE_ALGORITHM,
      publicKeyFormat: PUBLIC_KEY_FORMAT,
      publicKeySha256: revocationPublicKeySha256
    },
    capabilities: {
      hostTrustAnchorProvisionCapabilityId:
        HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID,
      decisionSignatureVerificationCapabilityId:
        VERIFIER_KEY_BINDING_DECISION_SIGNATURE_VERIFY_CAPABILITY_ID,
      revocationVerificationCapabilityId:
        VERIFIER_KEY_BINDING_REVOCATION_VERIFY_CAPABILITY_ID
    },
    truth: expectedPolicyTruth()
  };
  policy.digest = stableDigest(policy);
  if (!landMatrixThermalHistoricalSourceVerifierKeyBindingCallerSuppliedPolicyDescriptorValid(
      policy, contract)) {
    throw new Error('Caller-supplied policy descriptor failed validation');
  }
  return policy;
}

function decisionEntryShapeValid(entry) {
  return exactKeys(entry, ['schema', 'requestId', 'candidateRequestId',
      'candidateClaimedProducerId', 'claimedVerifierId',
      'claimedVerifierKeyId', 'verifierPublicKeySha256',
      'candidateProducerIdentifierMatchesClaimedVerifierId',
      'requestedAction', 'claimedEvidenceRecordDigests']) &&
    entry.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_ENTRY_SCHEMA &&
    nonEmptyText(entry.requestId, 1024) &&
    nonEmptyText(entry.candidateRequestId, 1024) &&
    nonEmptyText(entry.candidateClaimedProducerId, 256) &&
    nonEmptyText(entry.claimedVerifierId, 256) &&
    nonEmptyText(entry.claimedVerifierKeyId, 256) &&
    sha256Digest(entry.verifierPublicKeySha256) &&
    typeof entry.candidateProducerIdentifierMatchesClaimedVerifierId ===
      'boolean' &&
    ALLOWED_ACTIONS.includes(entry.requestedAction) &&
    Array.isArray(entry.claimedEvidenceRecordDigests) &&
    entry.claimedEvidenceRecordDigests.length <= 16 &&
    unique(entry.claimedEvidenceRecordDigests) &&
    sorted(entry.claimedEvidenceRecordDigests) &&
    entry.claimedEvidenceRecordDigests.every(sha256Digest);
}

function expectedDecisionSummary(decisions) {
  return {
    decisionCount: decisions.length,
    requestedBindActionCount: decisions.filter(decision =>
      decision.requestedAction === 'BIND').length,
    requestedHoldActionCount: decisions.filter(decision =>
      decision.requestedAction === 'HOLD').length,
    requestedRejectActionCount: decisions.filter(decision =>
      decision.requestedAction === 'REJECT').length,
    literalIdentifierCollisionCount: decisions.filter(decision =>
      decision.candidateProducerIdentifierMatchesClaimedVerifierId).length,
    appliedBindingCount: 0,
    persistedDecisionCount: 0
  };
}

const expectedDecisionTruth = () => ({
  exactR104ContractBound: true,
  exactR103RequestPacketBound: true,
  exactCallerSuppliedPolicyDescriptorBound: true,
  decisionClaimsAwaitDetachedSignatureVerification: true,
  requestedBindActionAppliesBinding: false,
  callerSuppliedPolicyTrusted: false,
  claimedEvidenceRecordDigestsVerified: false,
  trustedVerifierKeyBound: false,
  decisionEnvelopePersisted: false,
  admissionAuthorityGranted: false,
  worldMutationPerformed: false
});

function decisionEnvelopeSourcesValid(envelope, contract, packet, policy) {
  return landMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      contract) &&
    landMatrixThermalHistoricalSourceVerifierKeyBindingRequestPacketValid(
      packet) &&
    landMatrixThermalHistoricalSourceVerifierKeyBindingCallerSuppliedPolicyDescriptorValid(
      policy, contract) &&
    packet.sourceContract.receiptDigest ===
      contract.sourceVerifierKeyBindingRequestContract.digest &&
    exact(envelope.sourceContract, {
      schema: contract.schema,
      receiptDigest: contract.digest
    }) && exact(envelope.sourceRequestPacket, {
      schema: packet.schema,
      receiptDigest: packet.digest
    }) && exact(envelope.sourcePolicyDescriptor, {
      schema: policy.schema,
      receiptDigest: policy.digest
    }) && envelope.claimedAuthority.decisionKeyId ===
      policy.decisionKey.keyId;
}

export function
landMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionEnvelopeValid(
  envelope, contract = null, packet = null, policy = null) {
  if (!digestValid(envelope,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_ENVELOPE_SCHEMA) ||
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
      !Array.isArray(envelope.decisions) ||
      !envelope.decisions.every(decisionEntryShapeValid)) return false;
  const structural = envelope.status ===
      'UNTRUSTED_POLICY_VERIFIER_KEY_BINDING_DECISION_CLAIMS_RECORDED_FOR_SIGNATURE_CHECK' &&
    envelope.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(envelope.sourceContract.receiptDigest) &&
    envelope.sourceRequestPacket.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_PACKET_SCHEMA &&
    fnvDigest(envelope.sourceRequestPacket.receiptDigest) &&
    envelope.sourcePolicyDescriptor.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA &&
    fnvDigest(envelope.sourcePolicyDescriptor.receiptDigest) &&
    nonEmptyText(envelope.decisionId, 256) &&
    isoTimestamp(envelope.issuedAt) && isoTimestamp(envelope.expiresAt) &&
    Date.parse(envelope.issuedAt) < Date.parse(envelope.expiresAt) &&
    nonEmptyText(envelope.nonce, 256) &&
    nonEmptyText(envelope.claimedAuthority.claimedReviewSeatId, 256) &&
    nonEmptyText(envelope.claimedAuthority.decisionKeyId, 256) &&
    envelope.decisions.length > 0 && envelope.decisions.length <= 24 &&
    unique(envelope.decisions.map(decision => decision.requestId)) &&
    exact(envelope.summary, expectedDecisionSummary(envelope.decisions)) &&
    exact(envelope.truth, expectedDecisionTruth());
  if (!structural || contract === null) return structural;
  if (!packet || !policy ||
      !decisionEnvelopeSourcesValid(envelope, contract, packet, policy)) {
    return false;
  }
  const sourceRequests = new Map(packet.verifierKeyBindingRequests.map(
    request => [request.requestId, request]));
  return envelope.decisions.length ===
      packet.verifierKeyBindingRequests.length &&
    Date.parse(envelope.issuedAt) >= Date.parse(policy.validity.validFrom) &&
    Date.parse(envelope.expiresAt) <= Date.parse(policy.validity.expiresAt) &&
    Date.parse(envelope.expiresAt) - Date.parse(envelope.issuedAt) <=
      policy.validity.maximumDecisionAgeSeconds * 1000 &&
    envelope.decisions.every(decision => {
      const source = sourceRequests.get(decision.requestId);
      return source && decision.candidateRequestId ===
          source.candidateRequestId &&
        decision.candidateClaimedProducerId ===
          source.candidateClaimedProducerId &&
        decision.claimedVerifierId === source.claimedVerifierId &&
        decision.claimedVerifierKeyId === source.claimedVerifierKeyId &&
        decision.verifierPublicKeySha256 === source.publicKeySha256 &&
        decision.candidateProducerIdentifierMatchesClaimedVerifierId ===
          source.candidateProducerIdentifierMatchesClaimedVerifierId;
    });
}

export function
createLandMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionEnvelope(
  contract, packet, policy, input) {
  if (!landMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      contract) ||
      !landMatrixThermalHistoricalSourceVerifierKeyBindingRequestPacketValid(
        packet) ||
      !landMatrixThermalHistoricalSourceVerifierKeyBindingCallerSuppliedPolicyDescriptorValid(
        policy, contract) ||
      packet.sourceContract.receiptDigest !==
        contract.sourceVerifierKeyBindingRequestContract.digest ||
      !exactKeys(input, ['decisionId', 'issuedAt', 'expiresAt', 'nonce',
        'claimedReviewSeatId', 'decisions']) ||
      !nonEmptyText(input.decisionId, 256) ||
      !isoTimestamp(input.issuedAt) || !isoTimestamp(input.expiresAt) ||
      !nonEmptyText(input.nonce, 256) ||
      !nonEmptyText(input.claimedReviewSeatId, 256) ||
      !Array.isArray(input.decisions)) {
    throw new Error(
      'Authority-decision envelope needs exact R104/R103/policy sources and bounded decision claims');
  }
  const decisionsByRequestId = new Map();
  for (const decision of input.decisions) {
    if (!exactKeys(decision,
        ['requestId', 'requestedAction', 'claimedEvidenceRecordDigests']) ||
        !nonEmptyText(decision.requestId, 1024) ||
        !ALLOWED_ACTIONS.includes(decision.requestedAction) ||
        !Array.isArray(decision.claimedEvidenceRecordDigests) ||
        decision.claimedEvidenceRecordDigests.length > 16 ||
        !unique(decision.claimedEvidenceRecordDigests) ||
        !decision.claimedEvidenceRecordDigests.every(sha256Digest) ||
        decisionsByRequestId.has(decision.requestId)) {
      throw new Error('Authority-decision claims are malformed or duplicated');
    }
    decisionsByRequestId.set(decision.requestId, decision);
  }
  if (decisionsByRequestId.size !==
      packet.verifierKeyBindingRequests.length) {
    throw new Error('Authority-decision claims must cover every R103 request');
  }
  const decisions = packet.verifierKeyBindingRequests.map(source => {
    const inputDecision = decisionsByRequestId.get(source.requestId);
    if (!inputDecision) {
      throw new Error(`Missing authority-decision claim for ${source.requestId}`);
    }
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_ENTRY_SCHEMA,
      requestId: source.requestId,
      candidateRequestId: source.candidateRequestId,
      candidateClaimedProducerId: source.candidateClaimedProducerId,
      claimedVerifierId: source.claimedVerifierId,
      claimedVerifierKeyId: source.claimedVerifierKeyId,
      verifierPublicKeySha256: source.publicKeySha256,
      candidateProducerIdentifierMatchesClaimedVerifierId:
        source.candidateProducerIdentifierMatchesClaimedVerifierId,
      requestedAction: inputDecision.requestedAction,
      claimedEvidenceRecordDigests:
        [...inputDecision.claimedEvidenceRecordDigests].sort()
    };
  });
  const envelope = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_ENVELOPE_SCHEMA,
    status:
      'UNTRUSTED_POLICY_VERIFIER_KEY_BINDING_DECISION_CLAIMS_RECORDED_FOR_SIGNATURE_CHECK',
    sourceContract: {
      schema: contract.schema,
      receiptDigest: contract.digest
    },
    sourceRequestPacket: {
      schema: packet.schema,
      receiptDigest: packet.digest
    },
    sourcePolicyDescriptor: {
      schema: policy.schema,
      receiptDigest: policy.digest
    },
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
    truth: expectedDecisionTruth()
  };
  envelope.digest = stableDigest(envelope);
  if (!landMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionEnvelopeValid(
      envelope, contract, packet, policy)) {
    throw new Error('Authority-decision envelope failed validation');
  }
  return envelope;
}

const expectedRevocationTruth = () => ({
  exactR104ContractBound: true,
  exactCallerSuppliedPolicyDescriptorBound: true,
  revocationClaimsAwaitDetachedSignatureVerification: true,
  callerSuppliedPolicyTrusted: false,
  replayLedgerImplemented: false,
  revocationSnapshotPersisted: false,
  trustedVerifierKeyBindingChanged: false,
  admissionAuthorityGranted: false,
  worldMutationPerformed: false
});

export function
landMatrixThermalHistoricalSourceVerifierKeyBindingRevocationSnapshotValid(
  snapshot, contract = null, policy = null) {
  if (!digestValid(snapshot,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REVOCATION_SNAPSHOT_SCHEMA) ||
      !exactKeys(snapshot, ['schema', 'status', 'sourceContract',
        'sourcePolicyDescriptor', 'snapshotId', 'observedAt', 'expiresAt',
        'nonce', 'claimedAuthority', 'revokedDecisionDigests',
        'revokedDecisionNonces', 'revokedVerifierPublicKeySha256', 'summary',
        'truth', 'digest']) ||
      !exactKeys(snapshot.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(snapshot.sourcePolicyDescriptor,
        ['schema', 'receiptDigest']) ||
      !exactKeys(snapshot.claimedAuthority,
        ['claimedReviewSeatId', 'revocationKeyId']) ||
      !exactKeys(snapshot.summary, ['revokedDecisionDigestCount',
        'revokedDecisionNonceCount', 'revokedVerifierPublicKeyCount',
        'persistedRevocationSnapshotCount']) ||
      !Array.isArray(snapshot.revokedDecisionDigests) ||
      !Array.isArray(snapshot.revokedDecisionNonces) ||
      !Array.isArray(snapshot.revokedVerifierPublicKeySha256)) return false;
  const arraysValid = snapshot.revokedDecisionDigests.length <= 256 &&
    unique(snapshot.revokedDecisionDigests) &&
    sorted(snapshot.revokedDecisionDigests) &&
    snapshot.revokedDecisionDigests.every(fnvDigest) &&
    snapshot.revokedDecisionNonces.length <= 256 &&
    unique(snapshot.revokedDecisionNonces) &&
    sorted(snapshot.revokedDecisionNonces) &&
    snapshot.revokedDecisionNonces.every(value => nonEmptyText(value, 256)) &&
    snapshot.revokedVerifierPublicKeySha256.length <= 256 &&
    unique(snapshot.revokedVerifierPublicKeySha256) &&
    sorted(snapshot.revokedVerifierPublicKeySha256) &&
    snapshot.revokedVerifierPublicKeySha256.every(sha256Digest);
  const structural = snapshot.status ===
      'UNTRUSTED_POLICY_REVOCATION_CLAIMS_RECORDED_FOR_SIGNATURE_CHECK' &&
    snapshot.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(snapshot.sourceContract.receiptDigest) &&
    snapshot.sourcePolicyDescriptor.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA &&
    fnvDigest(snapshot.sourcePolicyDescriptor.receiptDigest) &&
    nonEmptyText(snapshot.snapshotId, 256) &&
    isoTimestamp(snapshot.observedAt) && isoTimestamp(snapshot.expiresAt) &&
    Date.parse(snapshot.observedAt) < Date.parse(snapshot.expiresAt) &&
    nonEmptyText(snapshot.nonce, 256) &&
    nonEmptyText(snapshot.claimedAuthority.claimedReviewSeatId, 256) &&
    nonEmptyText(snapshot.claimedAuthority.revocationKeyId, 256) &&
    arraysValid && exact(snapshot.summary, {
      revokedDecisionDigestCount: snapshot.revokedDecisionDigests.length,
      revokedDecisionNonceCount: snapshot.revokedDecisionNonces.length,
      revokedVerifierPublicKeyCount:
        snapshot.revokedVerifierPublicKeySha256.length,
      persistedRevocationSnapshotCount: 0
    }) && exact(snapshot.truth, expectedRevocationTruth());
  if (!structural || contract === null) return structural;
  return policy !== null &&
    landMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      contract) &&
    landMatrixThermalHistoricalSourceVerifierKeyBindingCallerSuppliedPolicyDescriptorValid(
      policy, contract) &&
    exact(snapshot.sourceContract, {
      schema: contract.schema,
      receiptDigest: contract.digest
    }) && exact(snapshot.sourcePolicyDescriptor, {
      schema: policy.schema,
      receiptDigest: policy.digest
    }) && snapshot.claimedAuthority.revocationKeyId ===
      policy.revocationKey.keyId &&
    Date.parse(snapshot.observedAt) >= Date.parse(policy.validity.validFrom) &&
    Date.parse(snapshot.expiresAt) <= Date.parse(policy.validity.expiresAt) &&
    Date.parse(snapshot.expiresAt) - Date.parse(snapshot.observedAt) <=
      policy.validity.maximumRevocationSnapshotAgeSeconds * 1000;
}

export function
createLandMatrixThermalHistoricalSourceVerifierKeyBindingRevocationSnapshot(
  contract, policy, input) {
  const arrayInputValid = values => Array.isArray(values) &&
    values.length <= 256 && unique(values);
  if (!landMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      contract) ||
      !landMatrixThermalHistoricalSourceVerifierKeyBindingCallerSuppliedPolicyDescriptorValid(
        policy, contract) ||
      !exactKeys(input, ['snapshotId', 'observedAt', 'expiresAt', 'nonce',
        'claimedReviewSeatId', 'revokedDecisionDigests',
        'revokedDecisionNonces', 'revokedVerifierPublicKeySha256']) ||
      !nonEmptyText(input.snapshotId, 256) ||
      !isoTimestamp(input.observedAt) || !isoTimestamp(input.expiresAt) ||
      !nonEmptyText(input.nonce, 256) ||
      !nonEmptyText(input.claimedReviewSeatId, 256) ||
      !arrayInputValid(input.revokedDecisionDigests) ||
      !input.revokedDecisionDigests.every(fnvDigest) ||
      !arrayInputValid(input.revokedDecisionNonces) ||
      !input.revokedDecisionNonces.every(value => nonEmptyText(value, 256)) ||
      !arrayInputValid(input.revokedVerifierPublicKeySha256) ||
      !input.revokedVerifierPublicKeySha256.every(sha256Digest)) {
    throw new Error(
      'Revocation snapshot needs exact R104/policy sources and bounded revocation claims');
  }
  const snapshot = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REVOCATION_SNAPSHOT_SCHEMA,
    status:
      'UNTRUSTED_POLICY_REVOCATION_CLAIMS_RECORDED_FOR_SIGNATURE_CHECK',
    sourceContract: {
      schema: contract.schema,
      receiptDigest: contract.digest
    },
    sourcePolicyDescriptor: {
      schema: policy.schema,
      receiptDigest: policy.digest
    },
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
    revokedVerifierPublicKeySha256:
      [...input.revokedVerifierPublicKeySha256].sort(),
    summary: {
      revokedDecisionDigestCount: input.revokedDecisionDigests.length,
      revokedDecisionNonceCount: input.revokedDecisionNonces.length,
      revokedVerifierPublicKeyCount:
        input.revokedVerifierPublicKeySha256.length,
      persistedRevocationSnapshotCount: 0
    },
    truth: expectedRevocationTruth()
  };
  snapshot.digest = stableDigest(snapshot);
  if (!landMatrixThermalHistoricalSourceVerifierKeyBindingRevocationSnapshotValid(
      snapshot, contract, policy)) {
    throw new Error('Revocation snapshot failed validation');
  }
  return snapshot;
}

export function
canonicalLandMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionText(
  envelope) {
  if (!landMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionEnvelopeValid(
      envelope)) {
    throw new Error('Canonical authority-decision text needs a valid envelope');
  }
  return JSON.stringify(envelope);
}

export function
canonicalLandMatrixThermalHistoricalSourceVerifierKeyBindingRevocationSnapshotText(
  snapshot) {
  if (!landMatrixThermalHistoricalSourceVerifierKeyBindingRevocationSnapshotValid(
      snapshot)) {
    throw new Error('Canonical revocation text needs a valid snapshot');
  }
  return JSON.stringify(snapshot);
}

export function
landMatrixThermalHistoricalSourceVerifierKeyBindingAuthoritySignatureInputValid(
  input) {
  return exactKeys(input, ['schema', 'policyDescriptorDigest',
      'decisionEnvelopeDigest', 'revocationSnapshotDigest',
      'decisionPublicKeyRaw', 'decisionSignature', 'revocationPublicKeyRaw',
      'revocationSignature']) &&
    input.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_SIGNATURE_INPUT_SCHEMA &&
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
    issues.push('authority-decision-detached-signature-invalid');
  }
  if (!checks.revocationSignatureValid) {
    issues.push('revocation-snapshot-detached-signature-invalid');
  }
  if (!checks.policyWindowCurrent) issues.push('policy-window-not-current');
  if (!checks.decisionWindowCurrent) {
    issues.push('authority-decision-window-not-current');
  }
  if (!checks.revocationSnapshotWindowCurrent) {
    issues.push('revocation-snapshot-window-not-current');
  }
  if (!checks.authorityKeysSeparateFromClaimedVerifierKey) {
    issues.push('authority-key-collides-with-claimed-verifier-key');
  }
  if (checks.decisionRevoked) issues.push('authority-decision-revoked');
  return issues;
}

const expectedAssessmentTruth = integrityPass => ({
  exactR104ContractBound: true,
  exactR103RequestPacketBound: true,
  exactCallerSuppliedPolicyDescriptorBound: true,
  exactAuthorityDecisionEnvelopeBound: true,
  exactRevocationSnapshotBound: true,
  detachedEd25519AuthorityDecisionVerificationPerformed: true,
  detachedEd25519RevocationSnapshotVerificationPerformed: true,
  decisionAndRevocationIntegrityPassed: integrityPass,
  validSignaturesMeanSuppliedPolicyKeyMatchOnly: true,
  callerSuppliedPolicyTrusted: false,
  hostTrustAnchorProvisioned: false,
  requestedBindActionAppliesBinding: false,
  trustedVerifierKeyBound: false,
  claimedVerifierIdentityTrusted: false,
  verifierIndependenceEstablished: false,
  observationAuthenticityVerified: false,
  provenanceVerified: false,
  physicalMeaningVerified: false,
  evidenceVerified: false,
  rawAuthorityPublicKeysPersisted: false,
  signatureBytesPersisted: false,
  policyDescriptorPersisted: false,
  authorityDecisionEnvelopePersisted: false,
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
landMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityAssessmentValid(
  assessment) {
  if (!digestValid(assessment,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ASSESSMENT_SCHEMA) ||
      !exactKeys(assessment, ['schema', 'status', 'evaluatedAt',
        'sourceContract', 'sourceRequestPacket', 'sourcePolicyDescriptor',
        'sourceDecisionEnvelope', 'sourceRevocationSnapshot',
        'claimedAuthority', 'cryptographic', 'checks', 'requestedActions',
        'verdicts', 'issues', 'truth', 'digest']) ||
      !exactKeys(assessment.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(assessment.sourceRequestPacket,
        ['schema', 'receiptDigest']) ||
      !exactKeys(assessment.sourcePolicyDescriptor,
        ['schema', 'receiptDigest']) ||
      !exactKeys(assessment.sourceDecisionEnvelope,
        ['schema', 'receiptDigest']) ||
      !exactKeys(assessment.sourceRevocationSnapshot,
        ['schema', 'receiptDigest']) ||
      !exactKeys(assessment.claimedAuthority, ['claimedReviewSeatId',
        'decisionKeyId', 'revocationKeyId']) ||
      !exactKeys(assessment.cryptographic, ['signatureAlgorithm',
        'publicKeyFormat', 'decisionPublicKeySha256',
        'decisionSignatureSha256', 'revocationPublicKeySha256',
        'revocationSignatureSha256',
        'canonicalDecisionCharacterCount',
        'canonicalRevocationSnapshotCharacterCount']) ||
      !exactKeys(assessment.checks, ['policyDescriptorDigestMatchesInput',
        'decisionPublicKeyMatchesPolicyDescriptor',
        'revocationPublicKeyMatchesPolicyDescriptor',
        'decisionSignatureValid', 'revocationSignatureValid',
        'policyWindowCurrent', 'decisionWindowCurrent',
        'revocationSnapshotWindowCurrent',
        'authorityKeysSeparateFromClaimedVerifierKey', 'decisionRevoked']) ||
      !exactKeys(assessment.requestedActions, ['bind', 'hold', 'reject',
        'appliedBindings']) ||
      !exactKeys(assessment.verdicts,
        ['authorityDecisionSignatureIntegrityVerdict',
          'revocationSnapshotSignatureIntegrityVerdict',
          'decisionAndRevocationIntegrityVerdict',
          'hostTrustAnchorProvisioningVerdict',
          'callerSuppliedPolicyTrustVerdict', 'verifierKeyBindingVerdict',
          'verifierIdentityVerdict', 'verifierIndependenceVerdict',
          'observationAuthenticityVerdict', 'provenanceVerdict',
          'physicalMeaningReviewVerdict', 'evidenceVerificationVerdict',
          'admissionVerdict']) || !Array.isArray(assessment.issues)) {
    return false;
  }
  const checks = assessment.checks;
  const integrityPass = checks.policyDescriptorDigestMatchesInput &&
    checks.decisionPublicKeyMatchesPolicyDescriptor &&
    checks.revocationPublicKeyMatchesPolicyDescriptor &&
    checks.decisionSignatureValid && checks.revocationSignatureValid &&
    checks.policyWindowCurrent && checks.decisionWindowCurrent &&
    checks.revocationSnapshotWindowCurrent &&
    checks.authorityKeysSeparateFromClaimedVerifierKey &&
    !checks.decisionRevoked;
  return assessment.status === (integrityPass
      ? 'AUTHORITY_DECISION_AND_REVOCATION_INTEGRITY_PASS_UNDER_CALLER_SUPPLIED_UNTRUSTED_POLICY'
      : 'AUTHORITY_DECISION_OR_REVOCATION_INTEGRITY_FAIL_UNDER_CALLER_SUPPLIED_UNTRUSTED_POLICY') &&
    isoTimestamp(assessment.evaluatedAt) &&
    assessment.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(assessment.sourceContract.receiptDigest) &&
    assessment.sourceRequestPacket.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REQUEST_PACKET_SCHEMA &&
    fnvDigest(assessment.sourceRequestPacket.receiptDigest) &&
    assessment.sourcePolicyDescriptor.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA &&
    fnvDigest(assessment.sourcePolicyDescriptor.receiptDigest) &&
    assessment.sourceDecisionEnvelope.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_ENVELOPE_SCHEMA &&
    fnvDigest(assessment.sourceDecisionEnvelope.receiptDigest) &&
    assessment.sourceRevocationSnapshot.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REVOCATION_SNAPSHOT_SCHEMA &&
    fnvDigest(assessment.sourceRevocationSnapshot.receiptDigest) &&
    nonEmptyText(assessment.claimedAuthority.claimedReviewSeatId, 256) &&
    nonEmptyText(assessment.claimedAuthority.decisionKeyId, 256) &&
    nonEmptyText(assessment.claimedAuthority.revocationKeyId, 256) &&
    assessment.cryptographic.signatureAlgorithm === SIGNATURE_ALGORITHM &&
    assessment.cryptographic.publicKeyFormat === PUBLIC_KEY_FORMAT &&
    sha256Digest(assessment.cryptographic.decisionPublicKeySha256) &&
    sha256Digest(assessment.cryptographic.decisionSignatureSha256) &&
    sha256Digest(assessment.cryptographic.revocationPublicKeySha256) &&
    sha256Digest(assessment.cryptographic.revocationSignatureSha256) &&
    positiveBoundedInteger(
      assessment.cryptographic.canonicalDecisionCharacterCount, 2000000) &&
    positiveBoundedInteger(
      assessment.cryptographic.canonicalRevocationSnapshotCharacterCount,
      2000000) &&
    Object.values(checks).every(value => typeof value === 'boolean') &&
    Object.values(assessment.requestedActions).every(value =>
      Number.isInteger(value) && value >= 0 && value <= 24) &&
    assessment.requestedActions.bind + assessment.requestedActions.hold +
      assessment.requestedActions.reject > 0 &&
    assessment.requestedActions.appliedBindings === 0 &&
    assessment.verdicts.authorityDecisionSignatureIntegrityVerdict ===
      (checks.decisionSignatureValid ? 'PASS' : 'FAIL') &&
    assessment.verdicts.revocationSnapshotSignatureIntegrityVerdict ===
      (checks.revocationSignatureValid ? 'PASS' : 'FAIL') &&
    assessment.verdicts.decisionAndRevocationIntegrityVerdict ===
      (integrityPass ? 'PASS' : 'FAIL') &&
    assessment.verdicts.hostTrustAnchorProvisioningVerdict === UNKNOWN &&
    assessment.verdicts.callerSuppliedPolicyTrustVerdict ===
      'UNTRUSTED_CALLER_SUPPLIED' &&
    assessment.verdicts.verifierKeyBindingVerdict === UNKNOWN &&
    assessment.verdicts.verifierIdentityVerdict === UNKNOWN &&
    assessment.verdicts.verifierIndependenceVerdict === UNKNOWN &&
    assessment.verdicts.observationAuthenticityVerdict === UNKNOWN &&
    assessment.verdicts.provenanceVerdict === UNKNOWN &&
    assessment.verdicts.physicalMeaningReviewVerdict === UNKNOWN &&
    assessment.verdicts.evidenceVerificationVerdict === UNKNOWN &&
    assessment.verdicts.admissionVerdict === NOT_AUTHORIZED &&
    exact(assessment.issues, expectedAssessmentIssues(checks)) &&
    exact(assessment.truth, expectedAssessmentTruth(integrityPass));
}

export async function
verifyLandMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrity(
  contract, packet, policy, decisionEnvelope, revocationSnapshot,
  signatureInput, evaluatedAt) {
  if (!landMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      contract) ||
      !landMatrixThermalHistoricalSourceVerifierKeyBindingRequestPacketValid(
        packet) ||
      !landMatrixThermalHistoricalSourceVerifierKeyBindingCallerSuppliedPolicyDescriptorValid(
        policy, contract) ||
      !landMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionEnvelopeValid(
        decisionEnvelope, contract, packet, policy) ||
      !landMatrixThermalHistoricalSourceVerifierKeyBindingRevocationSnapshotValid(
        revocationSnapshot, contract, policy) ||
      !landMatrixThermalHistoricalSourceVerifierKeyBindingAuthoritySignatureInputValid(
        signatureInput) || !isoTimestamp(evaluatedAt) ||
      signatureInput.decisionEnvelopeDigest !== decisionEnvelope.digest ||
      signatureInput.revocationSnapshotDigest !== revocationSnapshot.digest) {
    throw new Error(
      'Authority-decision integrity verification needs exact R104/R103/policy/decision/revocation/signature sources');
  }
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) throw new Error('Web Crypto SubtleCrypto is unavailable');
  const decisionPublicKeyRaw =
    new Uint8Array(signatureInput.decisionPublicKeyRaw);
  const decisionSignature = new Uint8Array(signatureInput.decisionSignature);
  const revocationPublicKeyRaw =
    new Uint8Array(signatureInput.revocationPublicKeyRaw);
  const revocationSignature =
    new Uint8Array(signatureInput.revocationSignature);
  const canonicalDecision =
    canonicalLandMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionText(
      decisionEnvelope);
  const canonicalRevocation =
    canonicalLandMatrixThermalHistoricalSourceVerifierKeyBindingRevocationSnapshotText(
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
  const decisionPublicKeySha256 =
    await sha256ForBytes(decisionPublicKeyRaw);
  const decisionSignatureSha256 = await sha256ForBytes(decisionSignature);
  const revocationPublicKeySha256 =
    await sha256ForBytes(revocationPublicKeyRaw);
  const revocationSignatureSha256 =
    await sha256ForBytes(revocationSignature);
  const evaluationTime = Date.parse(evaluatedAt);
  const verifierPublicKeySha256 = packet.verifiedSignature.publicKeySha256;
  const decisionRevoked =
    revocationSnapshot.revokedDecisionDigests.includes(
      decisionEnvelope.digest) ||
    revocationSnapshot.revokedDecisionNonces.includes(decisionEnvelope.nonce) ||
    revocationSnapshot.revokedVerifierPublicKeySha256.includes(
      verifierPublicKeySha256);
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
    authorityKeysSeparateFromClaimedVerifierKey:
      decisionPublicKeySha256 !== verifierPublicKeySha256 &&
      revocationPublicKeySha256 !== verifierPublicKeySha256,
    decisionRevoked
  };
  const integrityPass = checks.policyDescriptorDigestMatchesInput &&
    checks.decisionPublicKeyMatchesPolicyDescriptor &&
    checks.revocationPublicKeyMatchesPolicyDescriptor &&
    checks.decisionSignatureValid && checks.revocationSignatureValid &&
    checks.policyWindowCurrent && checks.decisionWindowCurrent &&
    checks.revocationSnapshotWindowCurrent &&
    checks.authorityKeysSeparateFromClaimedVerifierKey &&
    !checks.decisionRevoked;
  const assessment = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ASSESSMENT_SCHEMA,
    status: integrityPass
      ? 'AUTHORITY_DECISION_AND_REVOCATION_INTEGRITY_PASS_UNDER_CALLER_SUPPLIED_UNTRUSTED_POLICY'
      : 'AUTHORITY_DECISION_OR_REVOCATION_INTEGRITY_FAIL_UNDER_CALLER_SUPPLIED_UNTRUSTED_POLICY',
    evaluatedAt,
    sourceContract: {
      schema: contract.schema,
      receiptDigest: contract.digest
    },
    sourceRequestPacket: {
      schema: packet.schema,
      receiptDigest: packet.digest
    },
    sourcePolicyDescriptor: {
      schema: policy.schema,
      receiptDigest: policy.digest
    },
    sourceDecisionEnvelope: {
      schema: decisionEnvelope.schema,
      receiptDigest: decisionEnvelope.digest
    },
    sourceRevocationSnapshot: {
      schema: revocationSnapshot.schema,
      receiptDigest: revocationSnapshot.digest
    },
    claimedAuthority: {
      claimedReviewSeatId:
        decisionEnvelope.claimedAuthority.claimedReviewSeatId,
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
      authorityDecisionSignatureIntegrityVerdict:
        decisionSignatureValid ? 'PASS' : 'FAIL',
      revocationSnapshotSignatureIntegrityVerdict:
        revocationSignatureValid ? 'PASS' : 'FAIL',
      decisionAndRevocationIntegrityVerdict: integrityPass ? 'PASS' : 'FAIL',
      hostTrustAnchorProvisioningVerdict: UNKNOWN,
      callerSuppliedPolicyTrustVerdict: 'UNTRUSTED_CALLER_SUPPLIED',
      verifierKeyBindingVerdict: UNKNOWN,
      verifierIdentityVerdict: UNKNOWN,
      verifierIndependenceVerdict: UNKNOWN,
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
  if (!landMatrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityAssessmentValid(
      assessment)) {
    throw new Error('Authority-decision integrity assessment failed validation');
  }
  return assessment;
}

export function
matrixThermalHistoricalSourceVerifierKeyBindingAuthorityDecisionIntegrityDescription() {
  return {
    contractReceiptSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
    routeSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ROUTE_SCHEMA,
    callerSuppliedPolicyDescriptorSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_CALLER_SUPPLIED_POLICY_DESCRIPTOR_SCHEMA,
    authorityDecisionEnvelopeSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_ENVELOPE_SCHEMA,
    revocationSnapshotSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_REVOCATION_SNAPSHOT_SCHEMA,
    authoritySignatureInputSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_SIGNATURE_INPUT_SCHEMA,
    integrityAssessmentSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_VERIFIER_KEY_BINDING_AUTHORITY_DECISION_INTEGRITY_ASSESSMENT_SCHEMA,
    hostTrustAnchorProvisionCapabilityId:
      HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID,
    decisionSignatureVerificationCapabilityId:
      VERIFIER_KEY_BINDING_DECISION_SIGNATURE_VERIFY_CAPABILITY_ID,
    revocationVerificationCapabilityId:
      VERIFIER_KEY_BINDING_REVOCATION_VERIFY_CAPABILITY_ID,
    detachedEd25519AuthorityDecisionVerificationImplemented: true,
    detachedEd25519RevocationSnapshotVerificationImplemented: true,
    hostTrustAnchorProvisioningImplemented: false,
    callerSuppliedPolicyTrusted: false,
    validSignaturesMeanSuppliedPolicyKeyMatchOnly: true,
    requestedBindActionAppliesBinding: false,
    trustedVerifierKeyBindingImplemented: false,
    verifierIdentityResolutionImplemented: false,
    verifierIndependenceVerificationImplemented: false,
    observationAuthenticityVerificationImplemented: false,
    replayLedgerImplemented: false,
    persistedArtifacts: false,
    candidateAdmissionPathImplemented: false,
    mutatesWorld: false
  };
}
