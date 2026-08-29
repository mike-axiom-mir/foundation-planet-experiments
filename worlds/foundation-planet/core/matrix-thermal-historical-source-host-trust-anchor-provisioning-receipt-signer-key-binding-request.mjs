import {
  HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID
} from './matrix-thermal-historical-source-verifier-key-binding-authority-decision-integrity.mjs?v=0.107.0-r107.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_SCHEMA
} from './matrix-thermal-historical-source-host-trust-anchor-provisioning-proposal.mjs?v=0.107.0-r107.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_ENVELOPE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_ASSESSMENT_SCHEMA,
  HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrityContractReceiptValid,
  landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrityAssessmentValid,
  verifyLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrity
} from './matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signature-integrity.mjs?v=0.107.0-r107.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-request-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_ROUTE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-route/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-request/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-trust-anchor-provisioning-receipt-signer-key-binding-request-packet/v1';

export const
  HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_REQUEST_CREATE_CAPABILITY_ID =
    'authority.host-trust-anchor.provision.receipt.signer-key.bind.request.create';
export const
  HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_CAPABILITY_ID =
    'authority.host-trust-anchor.provision.receipt.signer-key.bind';

const NATIVE_EMISSION_MODE =
  'native-from-intact-r106-provisioning-receipt-signature-integrity-contract';
const MIGRATION_EMISSION_MODE =
  'migration-from-exact-retained-r106-provisioning-receipt-signature-integrity-contract';
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
  return sourceContract
    .hostTrustAnchorProvisioningReceiptSignatureIntegrityRoutes.map(
      sourceRoute => {
        const eligible = sourceRoute
          .eligibleForHostTrustAnchorProvisioningReceiptSignatureIntegrity ===
            true;
        return {
          schema:
            LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_ROUTE_SCHEMA,
          routeId:
            `host-provisioning-receipt-signer-key-binding:${sourceRoute.routeId}`,
          sourceReceiptSignatureIntegrityRouteId: sourceRoute.routeId,
          requestBinding: clone(sourceRoute.requestBinding),
          eligibleForReceiptSignerKeyBindingRequest: eligible,
          sourceReceiptEnvelopeSchema: eligible
            ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_ENVELOPE_SCHEMA
            : null,
          sourceReceiptSignatureIntegrityAssessmentSchema: eligible
            ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_ASSESSMENT_SCHEMA
            : null,
          receiptSignerKeyBindingRequestSchema: eligible
            ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_SCHEMA
            : null,
          receiptSignerKeyBindingRequestPacketSchema: eligible
            ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA
            : null,
          implementedReceiptSignerKeyBindingRequestCreateCapabilityId: eligible
            ? HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_REQUEST_CREATE_CAPABILITY_ID
            : null,
          requiredReceiptSignerKeyBindingCapabilityId: eligible
            ? HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_CAPABILITY_ID
            : null,
          requiredProvisioningReceiptVerifyCapabilityId: eligible
            ? HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID : null,
          requiredHostTrustAnchorProvisionCapabilityId: eligible
            ? HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID : null,
          receiptSignerKeyBindingVerdict: eligible ? UNKNOWN : null,
          receiptAuthorityVerdict: eligible ? UNKNOWN : null,
          provisioningReceiptVerificationVerdict: eligible ? UNKNOWN : null,
          hostAccepted: false,
          hostTrustAnchorProvisioned: false,
          admissionVerdict: eligible ? NOT_AUTHORIZED : null
        };
      });
}

function expectedSummary(routes) {
  return {
    sourceR106ReceiptSignatureIntegrityContractCount: 1,
    receiptSignerKeyBindingRouteCount: 28,
    receiptSignerKeyBindingRequestEligibleRouteCount: routes.filter(route =>
      route.eligibleForReceiptSignerKeyBindingRequest).length,
    authorityReviewRouteExcludedCount: routes.filter(route =>
      !route.eligibleForReceiptSignerKeyBindingRequest).length,
    persistedReceiptEnvelopeCount: 0,
    persistedReceiptSignatureAssessmentCount: 0,
    persistedReceiptSignerKeyBindingRequestPacketCount: 0,
    persistedReceiptSignerKeyBindingRequestCount: 0,
    persistedHostAuthorityEvidenceCount: 0,
    persistedReceiptSignerKeyBindingDecisionCount: 0,
    trustedReceiptSignerKeyBindingCount: 0,
    verifiedProvisioningReceiptCount: 0,
    hostAcceptedProposalCount: 0,
    hostTrustAnchorCount: 0,
    receiptSignerKeyBindingRequestCreationImplemented: true,
    receiptSignerKeyBindingImplemented: false,
    provisioningReceiptVerificationImplemented: false,
    hostTrustAnchorProvisioningImplemented: false,
    candidateAdmissionPathImplemented: false
  };
}

const expectedContractTruth = () => ({
  exactR106ReceiptSignatureIntegrityContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourReceiptSignerKeyBindingRequestRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  signatureIntegrityPassRequiredBeforeRequest: true,
  exactProposalPolicyHostReceiptAndAssessmentBindingRequired: true,
  receiptSignerKeyBindingRequestCreationImplemented: true,
  receiptSignerKeyBindingImplemented: false,
  hostAuthorityEvidenceVerified: false,
  hostAuthorityKeyTrusted: false,
  hostIdentityAuthenticated: false,
  hostAuthorityToProvisionEstablished: false,
  provisioningReceiptVerified: false,
  hostAccepted: false,
  hostTrustAnchorProvisioned: false,
  callerSuppliedPolicyTrusted: false,
  trustedVerifierKeyBindingImplemented: false,
  observationAuthenticityVerified: false,
  provenanceVerified: false,
  physicalMeaningReviewImplemented: false,
  evidenceVerified: false,
  receiptEnvelopePersisted: false,
  receiptSignatureAssessmentPersisted: false,
  receiptSignerKeyBindingRequestPacketPersisted: false,
  receiptSignerKeyBindingRequestsPersisted: false,
  hostAuthorityEvidencePersisted: false,
  receiptSignerKeyBindingDecisionPersisted: false,
  rawHostAuthorityPublicKeyPersisted: false,
  receiptSignatureBytesPersisted: false,
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
landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestContractReceiptValid(
  receipt) {
  const source = receipt?.sourceReceiptSignatureIntegrityContract;
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
        'sourceReceiptSignatureIntegrityContract',
        'receiptSignerKeyBindingRoutes', 'summary', 'emission', 'truth',
        'digest']) ||
      !exactKeys(receipt.source, ['schema', 'receiptDigest']) ||
      !exactKeys(receipt.emission,
        ['mode',
          'sourceWasExactRetainedReceiptSignatureIntegrityContractMigration']) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrityContractReceiptValid(
        source)) return false;
  const routes = expectedRoutes(source);
  const migration = receipt.emission?.mode === MIGRATION_EMISSION_MODE;
  return receipt.status ===
      'receipt-signer-key-binding-requests-available-without-key-binding-receipt-authority-acceptance-installation-or-admission' &&
    exact(receipt.creationContext, source.creationContext) &&
    receipt.source.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    receipt.source.receiptDigest === source.digest &&
    exact(receipt.receiptSignerKeyBindingRoutes, routes) &&
    exact(receipt.summary, expectedSummary(routes)) &&
    [NATIVE_EMISSION_MODE, MIGRATION_EMISSION_MODE]
      .includes(receipt.emission.mode) &&
    receipt.emission
      .sourceWasExactRetainedReceiptSignatureIntegrityContractMigration ===
        migration && exact(receipt.truth, expectedContractTruth());
}

export function
createLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestContractReceipt(
  creationContext, sourceContract, options = {}) {
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrityContractReceiptValid(
      sourceContract) || !exact(creationContext, sourceContract.creationContext)) {
    throw new Error(
      'Receipt-signer-key-binding request contract needs the exact attached R106 receipt-signature-integrity contract');
  }
  const routes = expectedRoutes(sourceContract);
  const migration = options
    .sourceWasExactRetainedReceiptSignatureIntegrityContractMigration === true;
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    status:
      'receipt-signer-key-binding-requests-available-without-key-binding-receipt-authority-acceptance-installation-or-admission',
    creationContext: clone(creationContext),
    source: {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
      receiptDigest: sourceContract.digest
    },
    sourceReceiptSignatureIntegrityContract: clone(sourceContract),
    receiptSignerKeyBindingRoutes: routes,
    summary: expectedSummary(routes),
    emission: {
      mode: migration ? MIGRATION_EMISSION_MODE : NATIVE_EMISSION_MODE,
      sourceWasExactRetainedReceiptSignatureIntegrityContractMigration:
        migration
    },
    truth: expectedContractTruth()
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestContractReceiptValid(
      receipt)) {
    throw new Error(
      'Receipt-signer-key-binding request contract failed validation');
  }
  return receipt;
}

function expectedRequests(contract, envelope, assessment) {
  return contract.receiptSignerKeyBindingRoutes
    .filter(route => route.eligibleForReceiptSignerKeyBindingRequest)
    .map(route => ({
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_SCHEMA,
      requestId:
        `receipt-signer-key-binding:${envelope.receipt.receiptId}:${route.routeId}`,
      sourceReceiptSignatureIntegrityRouteId:
        route.sourceReceiptSignatureIntegrityRouteId,
      requestBinding: clone(route.requestBinding),
      proposalId: envelope.sourceProposal.proposalId,
      receiptId: envelope.receipt.receiptId,
      claimedHostReference: clone(envelope.sourceHostReference),
      claimedHostAuthoritySeatId:
        envelope.claimedAuthority.claimedHostAuthoritySeatId,
      claimedHostAuthorityKeyId:
        envelope.claimedAuthority.claimedHostAuthorityKeyId,
      claimedHostAuthorityPublicKeySha256:
        assessment.cryptographic.hostAuthorityPublicKeySha256,
      sourceReceiptSignatureIntegrityAssessmentDigest: assessment.digest,
      receiptSignatureIntegrityVerdict: 'PASS',
      requestedBinding: {
        role: 'HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER',
        worldId: envelope.sourceHostReference.worldId,
        lineageId: envelope.sourceHostReference.lineageId,
        hostRevision: envelope.sourceHostReference.hostRevision,
        worldDigest: envelope.sourceHostReference.worldDigest,
        proposalId: envelope.sourceProposal.proposalId,
        receiptId: envelope.receipt.receiptId,
        keyId: envelope.claimedAuthority.claimedHostAuthorityKeyId,
        publicKeySha256:
          assessment.cryptographic.hostAuthorityPublicKeySha256
      },
      implementedReceiptSignerKeyBindingRequestCreateCapabilityId:
        HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_REQUEST_CREATE_CAPABILITY_ID,
      requiredReceiptSignerKeyBindingCapabilityId:
        HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_CAPABILITY_ID,
      requiredProvisioningReceiptVerifyCapabilityId:
        HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID,
      requiredHostTrustAnchorProvisionCapabilityId:
        HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID,
      hostAuthorityEvidence: [],
      receiptSignerKeyBindingDecision: null,
      receiptSignerKeyBindingVerdict: UNKNOWN,
      receiptAuthorityVerdict: UNKNOWN,
      provisioningReceiptVerificationVerdict: UNKNOWN,
      hostIdentityAuthenticationVerdict: UNKNOWN,
      hostAuthorityToProvisionVerdict: UNKNOWN,
      hostAcceptanceVerdict: UNKNOWN,
      hostTrustAnchorProvisioningVerdict: UNKNOWN,
      admissionVerdict: NOT_AUTHORIZED,
      actualEffects: {
        applyAuthority: false,
        hostAccepted: false,
        hostTrustAnchorInstalled: false,
        persisted: false,
        worldMutationPerformed: false
      }
    }));
}

function requestShapeValid(request) {
  if (!exactKeys(request, ['schema', 'requestId',
      'sourceReceiptSignatureIntegrityRouteId', 'requestBinding',
      'proposalId', 'receiptId', 'claimedHostReference',
      'claimedHostAuthoritySeatId', 'claimedHostAuthorityKeyId',
      'claimedHostAuthorityPublicKeySha256',
      'sourceReceiptSignatureIntegrityAssessmentDigest',
      'receiptSignatureIntegrityVerdict', 'requestedBinding',
      'implementedReceiptSignerKeyBindingRequestCreateCapabilityId',
      'requiredReceiptSignerKeyBindingCapabilityId',
      'requiredProvisioningReceiptVerifyCapabilityId',
      'requiredHostTrustAnchorProvisionCapabilityId',
      'hostAuthorityEvidence', 'receiptSignerKeyBindingDecision',
      'receiptSignerKeyBindingVerdict', 'receiptAuthorityVerdict',
      'provisioningReceiptVerificationVerdict',
      'hostIdentityAuthenticationVerdict',
      'hostAuthorityToProvisionVerdict', 'hostAcceptanceVerdict',
      'hostTrustAnchorProvisioningVerdict', 'admissionVerdict',
      'actualEffects']) ||
      !exactKeys(request.claimedHostReference,
        ['schema', 'receiptDigest', 'worldId', 'lineageId', 'hostRevision',
          'worldDigest']) ||
      !exactKeys(request.requestedBinding,
        ['role', 'worldId', 'lineageId', 'hostRevision', 'worldDigest',
          'proposalId', 'receiptId', 'keyId', 'publicKeySha256']) ||
      !exactKeys(request.actualEffects,
        ['applyAuthority', 'hostAccepted', 'hostTrustAnchorInstalled',
          'persisted', 'worldMutationPerformed'])) return false;
  return request.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_SCHEMA &&
    nonEmptyText(request.requestId, 2048) &&
    nonEmptyText(request.sourceReceiptSignatureIntegrityRouteId, 1024) &&
    nonEmptyText(request.proposalId, 256) &&
    nonEmptyText(request.receiptId, 256) &&
    nonEmptyText(request.claimedHostReference.worldId, 256) &&
    nonEmptyText(request.claimedHostReference.lineageId, 512) &&
    Number.isInteger(request.claimedHostReference.hostRevision) &&
    request.claimedHostReference.hostRevision >= 0 &&
    hostWorldDigest(request.claimedHostReference.worldDigest) &&
    fnvDigest(request.claimedHostReference.receiptDigest) &&
    nonEmptyText(request.claimedHostAuthoritySeatId, 256) &&
    nonEmptyText(request.claimedHostAuthorityKeyId, 256) &&
    sha256Digest(request.claimedHostAuthorityPublicKeySha256) &&
    fnvDigest(request.sourceReceiptSignatureIntegrityAssessmentDigest) &&
    request.receiptSignatureIntegrityVerdict === 'PASS' &&
    request.requestedBinding.role ===
      'HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER' &&
    request.requestedBinding.worldId ===
      request.claimedHostReference.worldId &&
    request.requestedBinding.lineageId ===
      request.claimedHostReference.lineageId &&
    request.requestedBinding.hostRevision ===
      request.claimedHostReference.hostRevision &&
    request.requestedBinding.worldDigest ===
      request.claimedHostReference.worldDigest &&
    request.requestedBinding.proposalId === request.proposalId &&
    request.requestedBinding.receiptId === request.receiptId &&
    request.requestedBinding.keyId === request.claimedHostAuthorityKeyId &&
    request.requestedBinding.publicKeySha256 ===
      request.claimedHostAuthorityPublicKeySha256 &&
    request.implementedReceiptSignerKeyBindingRequestCreateCapabilityId ===
      HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_REQUEST_CREATE_CAPABILITY_ID &&
    request.requiredReceiptSignerKeyBindingCapabilityId ===
      HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_CAPABILITY_ID &&
    request.requiredProvisioningReceiptVerifyCapabilityId ===
      HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID &&
    request.requiredHostTrustAnchorProvisionCapabilityId ===
      HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID &&
    Array.isArray(request.hostAuthorityEvidence) &&
    request.hostAuthorityEvidence.length === 0 &&
    request.receiptSignerKeyBindingDecision === null &&
    request.receiptSignerKeyBindingVerdict === UNKNOWN &&
    request.receiptAuthorityVerdict === UNKNOWN &&
    request.provisioningReceiptVerificationVerdict === UNKNOWN &&
    request.hostIdentityAuthenticationVerdict === UNKNOWN &&
    request.hostAuthorityToProvisionVerdict === UNKNOWN &&
    request.hostAcceptanceVerdict === UNKNOWN &&
    request.hostTrustAnchorProvisioningVerdict === UNKNOWN &&
    request.admissionVerdict === NOT_AUTHORIZED &&
    exact(request.actualEffects, {
      applyAuthority: false,
      hostAccepted: false,
      hostTrustAnchorInstalled: false,
      persisted: false,
      worldMutationPerformed: false
    });
}

function packetSummary(requests) {
  return {
    receiptSignerKeyBindingRequestCount: requests.length,
    receiptSignatureIntegrityPassCount: 1,
    hostAuthorityEvidenceCount: 0,
    receiptSignerKeyBindingDecisionCount: 0,
    trustedReceiptSignerKeyBindingCount: 0,
    verifiedProvisioningReceiptCount: 0,
    hostAcceptedProposalCount: 0,
    hostTrustAnchorCount: 0,
    persistedRequestPacketCount: 0
  };
}

const expectedPacketTruth = () => ({
  exactR107RequestContractBound: true,
  exactR106ReceiptSignatureIntegrityContractBound: true,
  exactR105ProposalBound: true,
  exactCallerSuppliedPolicyDescriptorBound: true,
  exactClaimedHostReferenceBound: true,
  exactReceiptEnvelopeBound: true,
  exactReceiptSignatureIntegrityAssessmentBound: true,
  detachedEd25519ReceiptSignatureVerificationPerformed: true,
  receiptSignatureIntegrityVerified: true,
  receiptSignerKeyBindingRequestsCreated: true,
  callerSuppliedHostAuthorityKeyTrusted: false,
  hostAuthorityEvidenceVerified: false,
  receiptSignerKeyBound: false,
  receiptAuthorityVerified: false,
  provisioningReceiptVerified: false,
  hostIdentityAuthenticated: false,
  hostAuthorityToProvisionEstablished: false,
  hostAccepted: false,
  hostTrustAnchorProvisioned: false,
  callerSuppliedPolicyTrusted: false,
  rawHostAuthorityPublicKeyPersisted: false,
  receiptSignatureBytesPersisted: false,
  receiptSignerKeyBindingRequestPacketPersisted: false,
  receiptSignerKeyBindingRequestsPersisted: false,
  receiptSignerKeyBindingDecisionPersisted: false,
  candidateAdmissionPerformed: false,
  admissionAuthorityGranted: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  worldMutationPerformed: false
});

export function
landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestPacketValid(
  packet, contract = null, receiptEnvelope = null,
  signatureAssessment = null) {
  if (!digestValid(packet,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA) ||
      !exactKeys(packet, ['schema', 'status', 'evaluatedAt',
        'sourceContract', 'sourceReceiptSignatureIntegrityContract',
        'sourceProposal', 'sourcePolicy', 'sourceHostReference',
        'sourceReceiptEnvelope', 'sourceReceiptSignatureAssessment',
        'claimedAuthority', 'verifiedSignature',
        'receiptSignerKeyBindingRequests', 'summary', 'truth', 'digest']) ||
      !exactKeys(packet.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(packet.sourceReceiptSignatureIntegrityContract,
        ['schema', 'receiptDigest']) ||
      !exactKeys(packet.sourceProposal,
        ['schema', 'receiptDigest', 'proposalId']) ||
      !exactKeys(packet.sourcePolicy,
        ['schema', 'descriptorDigest', 'policyId', 'policyRevision']) ||
      !exactKeys(packet.sourceHostReference,
        ['schema', 'receiptDigest', 'worldId', 'lineageId', 'hostRevision',
          'worldDigest']) ||
      !exactKeys(packet.sourceReceiptEnvelope,
        ['schema', 'receiptDigest', 'receiptId']) ||
      !exactKeys(packet.sourceReceiptSignatureAssessment,
        ['schema', 'receiptDigest']) ||
      !exactKeys(packet.claimedAuthority,
        ['claimedHostAuthoritySeatId', 'claimedHostAuthorityKeyId',
          'claimedHostAuthorityPublicKeySha256']) ||
      !exactKeys(packet.verifiedSignature,
        ['signatureAlgorithm', 'publicKeyFormat',
          'hostAuthorityPublicKeySha256', 'receiptSignatureSha256',
          'receiptSignatureIntegrityVerdict']) ||
      !Array.isArray(packet.receiptSignerKeyBindingRequests) ||
      packet.receiptSignerKeyBindingRequests.length !== 24 ||
      !packet.receiptSignerKeyBindingRequests.every(requestShapeValid)) {
    return false;
  }
  const structural = packet.status ===
      'RECEIPT_SIGNER_KEY_BINDING_AND_HOST_AUTHORITY_EVIDENCE_REQUIRED' &&
    isoTimestamp(packet.evaluatedAt) &&
    packet.sourceContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(packet.sourceContract.receiptDigest) &&
    packet.sourceReceiptSignatureIntegrityContract.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(packet.sourceReceiptSignatureIntegrityContract.receiptDigest) &&
    packet.sourceProposal.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_PROPOSAL_SCHEMA &&
    fnvDigest(packet.sourceProposal.receiptDigest) &&
    nonEmptyText(packet.sourceProposal.proposalId, 256) &&
    fnvDigest(packet.sourcePolicy.descriptorDigest) &&
    nonEmptyText(packet.sourcePolicy.policyId, 256) &&
    Number.isInteger(packet.sourcePolicy.policyRevision) &&
    fnvDigest(packet.sourceHostReference.receiptDigest) &&
    nonEmptyText(packet.sourceHostReference.worldId, 256) &&
    nonEmptyText(packet.sourceHostReference.lineageId, 512) &&
    Number.isInteger(packet.sourceHostReference.hostRevision) &&
    hostWorldDigest(packet.sourceHostReference.worldDigest) &&
    packet.sourceReceiptEnvelope.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_ENVELOPE_SCHEMA &&
    fnvDigest(packet.sourceReceiptEnvelope.receiptDigest) &&
    nonEmptyText(packet.sourceReceiptEnvelope.receiptId, 256) &&
    packet.sourceReceiptSignatureAssessment.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNATURE_INTEGRITY_ASSESSMENT_SCHEMA &&
    fnvDigest(packet.sourceReceiptSignatureAssessment.receiptDigest) &&
    nonEmptyText(packet.claimedAuthority.claimedHostAuthoritySeatId, 256) &&
    nonEmptyText(packet.claimedAuthority.claimedHostAuthorityKeyId, 256) &&
    sha256Digest(
      packet.claimedAuthority.claimedHostAuthorityPublicKeySha256) &&
    packet.verifiedSignature.signatureAlgorithm === 'Ed25519' &&
    packet.verifiedSignature.publicKeyFormat === 'raw-32-byte-ed25519' &&
    sha256Digest(
      packet.verifiedSignature.hostAuthorityPublicKeySha256) &&
    sha256Digest(packet.verifiedSignature.receiptSignatureSha256) &&
    packet.verifiedSignature.receiptSignatureIntegrityVerdict === 'PASS' &&
    new Set(packet.receiptSignerKeyBindingRequests.map(request =>
      request.requestId)).size === 24 &&
    exact(packet.summary,
      packetSummary(packet.receiptSignerKeyBindingRequests)) &&
    exact(packet.truth, expectedPacketTruth());
  if (!structural || contract === null) return structural;
  if (!receiptEnvelope || !signatureAssessment ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestContractReceiptValid(
        contract) ||
      !landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrityAssessmentValid(
        signatureAssessment) ||
      signatureAssessment.verdicts?.receiptSignatureIntegrityVerdict !==
        'PASS') return false;
  const expected = expectedRequests(contract, receiptEnvelope,
    signatureAssessment);
  return contract.source.receiptDigest ===
      contract.sourceReceiptSignatureIntegrityContract.digest &&
    exact(packet.sourceContract, {
      schema: contract.schema,
      receiptDigest: contract.digest
    }) &&
    exact(packet.sourceReceiptSignatureIntegrityContract, {
      schema: contract.sourceReceiptSignatureIntegrityContract.schema,
      receiptDigest: contract.sourceReceiptSignatureIntegrityContract.digest
    }) &&
    exact(packet.sourceProposal, receiptEnvelope.sourceProposal) &&
    exact(packet.sourcePolicy, receiptEnvelope.sourcePolicy) &&
    exact(packet.sourceHostReference, receiptEnvelope.sourceHostReference) &&
    exact(packet.sourceReceiptEnvelope, {
      schema: receiptEnvelope.schema,
      receiptDigest: receiptEnvelope.digest,
      receiptId: receiptEnvelope.receipt.receiptId
    }) &&
    exact(packet.sourceReceiptSignatureAssessment, {
      schema: signatureAssessment.schema,
      receiptDigest: signatureAssessment.digest
    }) &&
    exact(packet.claimedAuthority, {
      claimedHostAuthoritySeatId:
        receiptEnvelope.claimedAuthority.claimedHostAuthoritySeatId,
      claimedHostAuthorityKeyId:
        receiptEnvelope.claimedAuthority.claimedHostAuthorityKeyId,
      claimedHostAuthorityPublicKeySha256:
        signatureAssessment.cryptographic.hostAuthorityPublicKeySha256
    }) && exact(packet.receiptSignerKeyBindingRequests, expected);
}

export async function
createLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestPacket(
  contract, proposal, policy, hostProjection, receiptEnvelope,
  signatureInput, evaluatedAt) {
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestContractReceiptValid(
      contract)) {
    throw new Error(
      'Receipt-signer-key-binding requests need the exact R107 contract');
  }
  const sourceContract = contract.sourceReceiptSignatureIntegrityContract;
  const assessment =
    await verifyLandMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignatureIntegrity(
      sourceContract, proposal, policy, hostProjection, receiptEnvelope,
      signatureInput, evaluatedAt);
  if (assessment.verdicts.receiptSignatureIntegrityVerdict !== 'PASS') {
    throw new Error(
      'Receipt-signer-key-binding requests require an actual R106 receipt-signature-integrity PASS');
  }
  const requests = expectedRequests(contract, receiptEnvelope, assessment);
  const packet = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA,
    status:
      'RECEIPT_SIGNER_KEY_BINDING_AND_HOST_AUTHORITY_EVIDENCE_REQUIRED',
    evaluatedAt,
    sourceContract: {
      schema: contract.schema,
      receiptDigest: contract.digest
    },
    sourceReceiptSignatureIntegrityContract: {
      schema: sourceContract.schema,
      receiptDigest: sourceContract.digest
    },
    sourceProposal: clone(receiptEnvelope.sourceProposal),
    sourcePolicy: clone(receiptEnvelope.sourcePolicy),
    sourceHostReference: clone(receiptEnvelope.sourceHostReference),
    sourceReceiptEnvelope: {
      schema: receiptEnvelope.schema,
      receiptDigest: receiptEnvelope.digest,
      receiptId: receiptEnvelope.receipt.receiptId
    },
    sourceReceiptSignatureAssessment: {
      schema: assessment.schema,
      receiptDigest: assessment.digest
    },
    claimedAuthority: {
      claimedHostAuthoritySeatId:
        receiptEnvelope.claimedAuthority.claimedHostAuthoritySeatId,
      claimedHostAuthorityKeyId:
        receiptEnvelope.claimedAuthority.claimedHostAuthorityKeyId,
      claimedHostAuthorityPublicKeySha256:
        assessment.cryptographic.hostAuthorityPublicKeySha256
    },
    verifiedSignature: {
      signatureAlgorithm: assessment.cryptographic.signatureAlgorithm,
      publicKeyFormat: assessment.cryptographic.publicKeyFormat,
      hostAuthorityPublicKeySha256:
        assessment.cryptographic.hostAuthorityPublicKeySha256,
      receiptSignatureSha256:
        assessment.cryptographic.receiptSignatureSha256,
      receiptSignatureIntegrityVerdict: 'PASS'
    },
    receiptSignerKeyBindingRequests: requests,
    summary: packetSummary(requests),
    truth: expectedPacketTruth()
  };
  packet.digest = stableDigest(packet);
  if (!landMatrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestPacketValid(
      packet, contract, receiptEnvelope, assessment)) {
    throw new Error(
      'Receipt-signer-key-binding request packet failed validation');
  }
  return packet;
}

export function
matrixThermalHistoricalSourceHostTrustAnchorProvisioningReceiptSignerKeyBindingRequestDescription() {
  return {
    contractReceiptSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    routeSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_ROUTE_SCHEMA,
    requestSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_SCHEMA,
    requestPacketSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_TRUST_ANCHOR_PROVISIONING_RECEIPT_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA,
    receiptSignerKeyBindingRequestCreateCapabilityId:
      HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_REQUEST_CREATE_CAPABILITY_ID,
    requiredReceiptSignerKeyBindingCapabilityId:
      HOST_TRUST_ANCHOR_PROVISION_RECEIPT_SIGNER_KEY_BIND_CAPABILITY_ID,
    requiredProvisioningReceiptVerifyCapabilityId:
      HOST_TRUST_ANCHOR_PROVISION_RECEIPT_VERIFY_CAPABILITY_ID,
    requiredHostTrustAnchorProvisionCapabilityId:
      HOST_TRUST_ANCHOR_PROVISION_CAPABILITY_ID,
    signatureIntegrityPassRequiredBeforeRequest: true,
    receiptSignerKeyBindingRequestCreationImplemented: true,
    receiptSignerKeyBindingImplemented: false,
    hostAuthorityEvidenceVerified: false,
    provisioningReceiptVerificationImplemented: false,
    hostTrustAnchorProvisioningImplemented: false,
    requestPacketPersisted: false,
    requestDecisionsPersisted: false,
    candidateAdmissionPathImplemented: false,
    mutatesWorld: false
  };
}
