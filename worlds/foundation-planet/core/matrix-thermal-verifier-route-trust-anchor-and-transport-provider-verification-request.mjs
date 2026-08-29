import {
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_PREFLIGHT_SCHEMA,
  VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_PREFLIGHT_EVALUATE_CAPABILITY_ID,
  landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflightContractReceiptValid,
  landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflightValid
} from './matrix-thermal-verifier-route-trust-anchor-and-transport-provider-binding-preflight.mjs?v=0.132.0-r132.1';
import {
  VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
  VERIFICATION_REQUEST_SEND_RECEIVE_CAPABILITY_ID
} from './matrix-thermal-verifier-route-trust-anchor-and-transport-capability-specification.mjs?v=0.131.0-r131.1';

export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-provider-verification-request-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-provider-verification-proof-requirement/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_VERIFICATION_REQUEST_PACKET_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-provider-verification-request-packet/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-provider-verification-request-batch/v1';

export const
  VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID =
    'contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.verifier-route.trust-anchor-and-transport.provider.verification.request.create';

const ENDPOINT_RESOLVE_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.endpoint.resolve';
const CONTRACT_STATUS =
  'VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_VERIFICATION_REQUEST_CONTRACT_AVAILABLE';
const EMPTY_STATUS =
  'NO_COMPATIBLE_UNVERIFIED_VERIFIER_ROUTE_PROVIDER_CANDIDATES_REQUEST_BATCH_EMPTY';
const REQUEST_STATUS =
  'VERIFIER_ROUTE_PROVIDER_VERIFICATION_REQUESTS_CREATED_NOT_TRANSMITTED_PROVIDERS_BLOCKED';
const EMISSION_MODE =
  'transient-untransmitted-request-from-exact-r132-compatible-unverified-provider-candidates';
const MAXIMUM_REQUEST_PACKETS = 2;
const MAXIMUM_PROOF_REQUIREMENTS_PER_PACKET = 6;
const MAXIMUM_REQUEST_WINDOW_MS = 300000;
const MAXIMUM_SERIALIZED_BATCH_BYTES = 524288;
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

function withDigest(value) {
  const output = clone(value);
  output.digest = stableDigest(output);
  return output;
}

const sourceRef = value => ({ schema: value.schema, receiptDigest: value.digest });

function custodyValid(custody) {
  return exactKeys(custody, ['r132Contract', 'r132Preflight',
    'r132Boundary', 'r132Declarations']) &&
    landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflightContractReceiptValid(
      custody.r132Contract, custody.r132Boundary) &&
    landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflightValid(
      custody.r132Preflight, custody.r132Contract, custody.r132Boundary,
      custody.r132Declarations);
}

function eligibleCandidates(custody) {
  if (!custodyValid(custody)) return [];
  return custody.r132Preflight.providerCandidates.filter(candidate =>
    candidate.trust === 'CALLER_SUPPLIED_COMPATIBLE_UNVERIFIED' &&
    candidate.selected === false && candidate.installed === false &&
    candidate.available === false && candidate.executed === false &&
    candidate.authorityEstablished === false &&
    candidate.transportPerformed === false);
}

function expectedContractTruth() {
  return {
    exactR132ContractPreflightDeclarationsAndBoundaryBound: true,
    compatibleUnverifiedCandidatesMayCreateRequests: true,
    missingRejectedOrAmbiguousCandidatesMayCreateRequests: false,
    requestMayVerifyProviderIdentityAuthorityOrImplementation: false,
    requestMayVerifyProviderAvailabilityOrNativeSchemas: false,
    requestMaySatisfyIdentityProbesReceiptMatchOrDigestReplay: false,
    requestMaySelectInstallOrExecuteProvider: false,
    verificationRecipientRouteResolved: false,
    providerSelected: false,
    providerInstalled: false,
    providerAvailable: false,
    providerExecuted: false,
    authorityTrustAnchorResolved: false,
    requestTransported: false,
    resolverProviderVerified: false,
    evidenceAdmitted: false,
    historicalPhysicalSourceOwnersResolved: false,
    historicalPhysicalSourceOwnersDebited: false,
    persistencePerformed: false,
    worldMutationPerformed: false
  };
}

function expectedContract(custody) {
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    status: CONTRACT_STATUS,
    sourceR132: {
      contract: sourceRef(custody.r132Contract),
      preflight: sourceRef(custody.r132Preflight)
    },
    projection: {
      sourceSpecificationCount:
        custody.r132Preflight.summary.specificationCount,
      sourceDeclarationCount:
        custody.r132Preflight.summary.declarationCount,
      sourceCandidateCount:
        custody.r132Preflight.summary.compatibleCandidateCount,
      requestEligibleCandidateCount: eligibleCandidates(custody).length,
      proofRequirementCountPerRequest:
        MAXIMUM_PROOF_REQUIREMENTS_PER_PACKET,
      unresolvedRouteCapabilityCountPerRequest: 3,
      proofRequirementSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
      requestPacketSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_VERIFICATION_REQUEST_PACKET_SCHEMA,
      requestBatchSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA,
      sourcePreflightCapabilityId:
        VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_PREFLIGHT_EVALUATE_CAPABILITY_ID,
      implementedContractCapabilityId:
        VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID
    },
    resourceBudget: {
      maximumRequestPackets: MAXIMUM_REQUEST_PACKETS,
      maximumProofRequirementsPerPacket:
        MAXIMUM_PROOF_REQUIREMENTS_PER_PACKET,
      maximumRequestWindowMs: MAXIMUM_REQUEST_WINDOW_MS,
      maximumSerializedBatchBytes: MAXIMUM_SERIALIZED_BATCH_BYTES
    },
    emission: { mode: EMISSION_MODE },
    truth: expectedContractTruth()
  });
}

export function
createLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestContractReceipt(
  custody) {
  if (!custodyValid(custody)) {
    throw new Error('R133 verification-request contract needs the exact R132 custody');
  }
  return expectedContract(custody);
}

export function
landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestContractReceiptValid(
  contract, custody) {
  return custodyValid(custody) && exact(contract, expectedContract(custody));
}

function requestOptionsValid(options, eligibleCount) {
  if (eligibleCount === 0) return exactKeys(options, []);
  if (!exactKeys(options, ['requestBatchId', 'requesterId',
      'requestedAt', 'expiresAt']) ||
      !/^[a-z0-9][a-z0-9._-]{2,95}$/.test(options.requestBatchId || '') ||
      !/^[a-z0-9][a-z0-9._-]{2,95}$/.test(options.requesterId || '')) {
    return false;
  }
  const requestedAt = Date.parse(options.requestedAt);
  const expiresAt = Date.parse(options.expiresAt);
  return Number.isFinite(requestedAt) && Number.isFinite(expiresAt) &&
    new Date(requestedAt).toISOString() === options.requestedAt &&
    new Date(expiresAt).toISOString() === options.expiresAt &&
    expiresAt > requestedAt &&
    expiresAt - requestedAt <= MAXIMUM_REQUEST_WINDOW_MS;
}

function proofRequirement(ordinal, proofId, claimClass, passCondition,
  primaryProofSurface, secondaryProofSurface, counterevidence,
  blockingReason) {
  return {
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
    ordinal,
    proofId,
    claimClass,
    passCondition,
    primaryProofSurface,
    secondaryProofSurface,
    counterevidence,
    blockingReason,
    independentSecondaryVerifierRequired: true
  };
}

function commonProofRequirements() {
  return [
    proofRequirement(1,
      'INDEPENDENT_PROVIDER_IDENTITY_AUTHORITY_AND_REVOCATION',
      'AUTHORIZATION',
      'An appointed independent authority binds the exact provider ID, class, version, capability, declaration digest, authority seat, expiry, and revocation state without granting provider execution.',
      'INDEPENDENT_PROVIDER_IDENTITY_AND_AUTHORITY_RECEIPT',
      'APPOINTED_AUTHORITY_SEAT_AND_REVOCATION_CHECK',
      'Self-attestation, wrong capability or digest, unappointed authority, expiry, revocation, or a receipt that grants execution.',
      'INDEPENDENT_PROVIDER_IDENTITY_AUTHORITY_AND_REVOCATION_REQUIRED'),
    proofRequirement(2, 'PROVIDER_IMPLEMENTATION_INTEGRITY',
      'EXISTENCE_AND_STATIC_STRUCTURE',
      'An independently obtained implementation artifact is provenance-bound, digest-verified, and shown to implement the exact declared provider version and capability contract.',
      'INDEPENDENT_IMPLEMENTATION_ARTIFACT_PROVENANCE_AND_DIGEST_RECEIPT',
      'HELD_OUT_STATIC_CONTRACT_INSPECTION',
      'Missing artifact, provider-only copy, unknown provenance, digest or version mismatch, undeclared dependency, or incompatible entrypoint.',
      'PROVIDER_IMPLEMENTATION_INTEGRITY_REQUIRED'),
    proofRequirement(3, 'BOUNDED_LIVE_PROVIDER_AVAILABILITY',
      'TRANSPORT',
      'A bounded live challenge produces matched sender and receiver receipts tied to this request, declaration, provider identity, and implementation digest.',
      'MATCHED_LIVE_CHALLENGE_SENDER_AND_RECEIVER_RECEIPTS',
      'INDEPENDENT_AVAILABILITY_OBSERVER_RECEIPT',
      'Configuration-only presence, send-only success, timeout, missing acknowledgement, mismatched digests, replay, or an unbounded availability claim.',
      'BOUNDED_LIVE_PROVIDER_AVAILABILITY_REQUIRED')
  ];
}

function capabilityProofRequirements(candidate) {
  const common = commonProofRequirements();
  if (candidate.capabilityId === VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID) {
    return [...common,
      proofRequirement(4, 'NATIVE_AUTHORITY_RECEIPT_SCHEMA_VALIDATION',
        'STATIC_STRUCTURE_AND_DETERMINISTIC_BEHAVIOR',
        'The declared authority receipt schema is independently obtained, digest-bound, parsed, and exercised against held-out valid and adversarial fixtures.',
        'INDEPENDENT_NATIVE_AUTHORITY_SCHEMA_ARTIFACT_AND_VALIDATOR_RECEIPT',
        'HELD_OUT_VALID_AND_INVALID_AUTHORITY_RECEIPT_FIXTURES',
        'Provider-only schema copy, missing digest, parse failure, generic R131 schema reuse, or acceptance of an invalid fixture.',
        'NATIVE_AUTHORITY_RECEIPT_SCHEMA_VALIDATION_REQUIRED'),
      proofRequirement(5, 'ALLOWED_AND_DENIED_PROVIDER_IDENTITY_PROBES',
        'AUTHORIZATION',
        'The exact declared authority provider passes an allowed identity probe and a distinct denied identity is refused under the same request and capability boundary.',
        'MATCHED_ALLOWED_AND_DENIED_PROVIDER_IDENTITY_PROBE_RECEIPTS',
        'INDEPENDENT_IDENTITY_PROBE_REPLAY',
        'Missing denied probe, acceptance of the denied identity, changed inputs, provider-controlled verifier, or unbound receipts.',
        'ALLOWED_AND_DENIED_PROVIDER_IDENTITY_PROBES_REQUIRED'),
      proofRequirement(6,
        'EXACT_R131_SPECIFICATION_BINDING_AND_DECLARATION_DIGEST_REPLAY',
        'DETERMINISTIC_BEHAVIOR',
        'A held-out replay preserves the exact R131 contract, bundle, specification, candidate binding, declaration, and input-binding digests while rejecting one-digest drift.',
        'HELD_OUT_EXACT_R131_PROVIDER_BINDING_REPLAY_RECEIPT',
        'INDEPENDENT_ONE_DIGEST_DRIFT_REJECTION_RECEIPT',
        'Any source, specification, candidate, declaration, or input-binding digest mismatch is accepted or omitted.',
        'EXACT_R131_PROVIDER_BINDING_DIGEST_REPLAY_REQUIRED')];
  }
  return [...common,
    proofRequirement(4,
      'NATIVE_SENDER_AND_RECEIVER_RECEIPT_SCHEMAS_VALIDATION',
      'STATIC_STRUCTURE_AND_DETERMINISTIC_BEHAVIOR',
      'Both declared transport receipt schemas are independently obtained, digest-bound, parsed, and exercised against held-out valid and adversarial fixtures.',
      'INDEPENDENT_NATIVE_TRANSPORT_SCHEMA_ARTIFACTS_AND_VALIDATOR_RECEIPT',
      'HELD_OUT_VALID_AND_INVALID_SENDER_AND_RECEIVER_FIXTURES',
      'Provider-only schemas, missing digest, parse failure, role swap, generic R131 schema reuse, or acceptance of an invalid fixture.',
      'NATIVE_SENDER_AND_RECEIVER_RECEIPT_SCHEMAS_VALIDATION_REQUIRED'),
    proofRequirement(5, 'MATCHED_SENDER_AND_RECEIVER_RECEIPT_TEST',
      'TRANSPORT',
      'Held-out transport receipts match transaction, request, payload, recipient, authority, time, and replay fields, and mismatched or single-sided evidence fails.',
      'MATCHED_HELD_OUT_SENDER_AND_RECEIVER_RECEIPT_PAIR',
      'INDEPENDENT_MISMATCH_AND_SINGLE_RECEIPT_REJECTION',
      'Sender-only or receiver-only evidence passes, fields mismatch, replay passes, or delivery is treated as receiver application.',
      'MATCHED_SENDER_AND_RECEIVER_RECEIPT_TEST_REQUIRED'),
    proofRequirement(6,
      'EXACT_R131_SPECIFICATION_BINDING_AND_DECLARATION_DIGEST_REPLAY',
      'DETERMINISTIC_BEHAVIOR',
      'A held-out replay preserves the exact R131 contract, bundle, specification, candidate binding, declaration, authority prerequisite, and input-binding digests while rejecting one-digest drift.',
      'HELD_OUT_EXACT_R131_PROVIDER_BINDING_REPLAY_RECEIPT',
      'INDEPENDENT_ONE_DIGEST_DRIFT_REJECTION_RECEIPT',
      'Any source, specification, candidate, declaration, authority-prerequisite, or input-binding digest mismatch is accepted or omitted.',
      'EXACT_R131_PROVIDER_BINDING_DIGEST_REPLAY_REQUIRED')];
}

function expectedPacket(contract, custody, candidate, options, index) {
  const specification = custody.r132Boundary.r131Bundle.specifications.find(
    item => item.capabilityId === candidate.capabilityId);
  const declarationIndex = custody.r132Declarations.findIndex(
    item => item.digest === candidate.declarationDigest);
  const declaration = custody.r132Declarations[declarationIndex];
  const suffix = candidate.capabilityId ===
    VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID
    ? 'authority-provider-01' : 'transport-provider-01';
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_VERIFICATION_REQUEST_PACKET_SCHEMA,
    requestId: options.requestBatchId + '.' + suffix,
    requestOrdinal: index + 1,
    sourceContract: sourceRef(contract),
    requestBinding: {
      sourcePreflight: sourceRef(custody.r132Preflight),
      capabilityId: candidate.capabilityId,
      specificationOrdinal: candidate.specificationOrdinal,
      specificationDigest: specification.digest,
      candidateBindingDigest: stableDigest(candidate),
      declarationInputIndex: declarationIndex,
      declarationDigest: declaration.digest,
      r131ContractDigest: custody.r132Boundary.r131Contract.digest,
      r131BundleDigest: custody.r132Boundary.r131Bundle.digest,
      inputBindingDigests: clone(candidate.inputBindingDigests),
      prerequisiteAuthorityProviderId:
        candidate.prerequisiteAuthorityProviderId
    },
    claimedProvider: {
      providerId: candidate.providerId,
      providerVersion: candidate.providerVersion,
      providerClass: candidate.providerClass,
      capabilityId: candidate.capabilityId,
      nativeReceiptSchemas: clone(candidate.nativeReceiptSchemas),
      claimedIndependentSecondaryVerifierId:
        declaration.verificationDeclaration.independentSecondaryVerifierId,
      declarationTrust: 'CALLER_SUPPLIED_UNTRUSTED',
      compatibilityTrust: 'STRUCTURALLY_COMPATIBLE_UNVERIFIED',
      nativeSchemaTrust: 'CALLER_DECLARED_UNVERIFIED',
      verifierIdentityTrust: 'CALLER_SUPPLIED_UNTRUSTED'
    },
    requestWindow: {
      requestedAt: options.requestedAt,
      expiresAt: options.expiresAt,
      maximumDurationMs: MAXIMUM_REQUEST_WINDOW_MS
    },
    requester: {
      requesterId: options.requesterId,
      authorityStatus:
        'REQUEST_CREATOR_ONLY_NOT_PROVIDER_AUTHORITY_SELECTOR_OR_EXECUTOR'
    },
    recipientRoute: {
      status: 'UNRESOLVED',
      endpoint: null,
      recipientIdentity: null,
      claimedVerifierId:
        declaration.verificationDeclaration.independentSecondaryVerifierId,
      claimedVerifierIdentityTrusted: false,
      candidateProviderMaySatisfyOwnVerificationRoute: false,
      requiredCapabilities: [
        ENDPOINT_RESOLVE_CAPABILITY_ID,
        VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
        VERIFICATION_REQUEST_SEND_RECEIVE_CAPABILITY_ID
      ]
    },
    proofRequirements: capabilityProofRequirements(candidate),
    permissionsAndConsent: {
      requestMaySelfAuthorize: false,
      requestMayGrantConsent: false,
      requestMaySelectInstallOrExecuteProvider: false,
      candidateProviderMayAnswerForIndependentVerifier: false,
      providerVerificationMayEstablishPerOperationAuthority: false,
      mikeTobiProviderSelectionAndPromotionGatePreserved: true
    },
    resourceBudget: {
      maximumResponseBytes:
        declaration.resourceBudget.maximumResultEnvelopeBytes,
      maximumRuntimeMs:
        declaration.resourceBudget.maximumExternalRuntimeMs,
      maximumProofArtifacts: MAXIMUM_PROOF_REQUIREMENTS_PER_PACKET,
      retryCount: 0
    },
    transport: {
      status: 'NOT_TRANSMITTED',
      senderReceipt: null,
      receiverReceipt: null,
      receiverAppliedRequest: 'UNKNOWN'
    },
    failureAndRecovery: {
      failClosed: true,
      partialProofMayVerifySelectInstallOrExecuteProvider: false,
      retryRequiresSameRequestSourceAndDeclarationDigests: true,
      noFoundationMutationOnFailure: true
    },
    lifecycle: {
      status:
        'CREATED_NOT_TRANSMITTED_VERIFICATION_RECIPIENT_ROUTE_UNRESOLVED',
      persisted: false,
      selected: false,
      installed: false,
      available: false,
      executed: false,
      promoted: false,
      canon: false
    },
    truth: {
      requestCreated: true,
      providerIdentityAuthorityOrRevocationVerified: false,
      providerImplementationIntegrityVerified: false,
      providerLiveAvailabilityVerified: false,
      nativeReceiptSchemasVerified: false,
      identityProbesOrReceiptMatchPassed: false,
      exactR131DigestReplayPassed: false,
      verificationRecipientRouteResolved: false,
      transportPerformed: false,
      receiverReceiptObserved: false,
      providerSelected: false,
      providerInstalled: false,
      providerAvailable: false,
      providerExecuted: false,
      authorityTrustAnchorResolved: false,
      historicalSourceOwnerOrDebitResolved: false,
      evidenceAdmitted: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  });
}

function expectedBatch(contract, custody, options) {
  const eligible = eligibleCandidates(custody);
  const packets = eligible.map((candidate, index) =>
    expectedPacket(contract, custody, candidate, options, index));
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA,
    status: packets.length === 0 ? EMPTY_STATUS : REQUEST_STATUS,
    sourceContract: sourceRef(contract),
    sourceR132: {
      contract: sourceRef(custody.r132Contract),
      preflight: sourceRef(custody.r132Preflight)
    },
    requestContext: packets.length === 0 ? {
      requestBatchId: null,
      requesterId: null,
      requestedAt: null,
      expiresAt: null
    } : clone(options),
    packets,
    summary: {
      sourceSpecificationCount:
        custody.r132Preflight.summary.specificationCount,
      sourceDeclarationCount:
        custody.r132Preflight.summary.declarationCount,
      sourceCandidateCount:
        custody.r132Preflight.summary.compatibleCandidateCount,
      requestEligibleCandidateCount: eligible.length,
      missingDeclarationAssessmentCount:
        custody.r132Preflight.assessments.filter(item =>
          item.status === 'MISSING_PROVIDER_DECLARATION').length,
      rejectedOrAmbiguousAssessmentCount:
        custody.r132Preflight.assessments.filter(item =>
          ['PROVIDER_DECLARATIONS_REJECTED',
            'AMBIGUOUS_PROVIDER_DECLARATIONS'].includes(item.status)).length,
      requestPacketCount: packets.length,
      proofRequirementCount:
        packets.length * MAXIMUM_PROOF_REQUIREMENTS_PER_PACKET,
      unresolvedVerificationRecipientRouteCount: packets.length,
      transmittedRequestCount: 0,
      senderReceiptCount: 0,
      receiverReceiptCount: 0,
      independentlyVerifiedProviderCount: 0,
      selectedProviderCount: 0,
      installedProviderCount: 0,
      availableProviderCount: 0,
      executedProviderCount: 0,
      authorityResolvedCount: 0,
      transportedOperationalRequestCount: 0,
      admissionReady: false
    },
    prohibitedConclusions: {
      treatRequestAsProviderIdentityAuthorityOrRevocationProof: true,
      treatRequestAsImplementationIntegrityProof: true,
      treatRequestAsAvailabilityOrNativeSchemaProof: true,
      treatRequestAsIdentityProbeReceiptMatchOrReplayProof: true,
      treatClaimedVerifierAsResolvedTrustedRecipient: true,
      selectInstallExposeOrExecuteCandidateProvider: true,
      claimAuthorityOrTransportWithoutNativeReceipts: true,
      admitEvidenceOwnerOrDebit: true,
      persistMutatePromoteOrCanonize: true
    },
    truth: {
      exactR132EligibleCandidatesBound: true,
      onlyCompatibleUnverifiedCandidatesRequested: true,
      requestBatchMayVerifySelectInstallOrExecuteProvider: false,
      requestBatchMayResolveOrTrustVerificationRecipientRoute: false,
      requestBatchMayTransmit: false,
      requestBatchMayAdmitProviderProofs: false,
      authorityTrustAnchorResolved: false,
      requestTransported: false,
      resolverProviderVerified: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      admissionAuthorized: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  });
}

export function
createLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestBatch(
  contract, custody, options = {}) {
  const eligibleCount = eligibleCandidates(custody).length;
  if (!landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestContractReceiptValid(
      contract, custody) || !requestOptionsValid(options, eligibleCount)) {
    throw new Error('R133 request batch needs the exact R132 custody and a bounded request window whenever eligible candidates exist');
  }
  const batch = expectedBatch(contract, custody, options);
  if (new TextEncoder().encode(JSON.stringify(batch)).length >
      MAXIMUM_SERIALIZED_BATCH_BYTES) {
    throw new Error('R133 verification-request batch exceeds its resource ceiling');
  }
  return batch;
}

export function
landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestBatchValid(
  batch, contract, custody, options = {}) {
  return landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestContractReceiptValid(
    contract, custody) &&
    requestOptionsValid(options, eligibleCandidates(custody).length) &&
    new TextEncoder().encode(JSON.stringify(batch)).length <=
      MAXIMUM_SERIALIZED_BATCH_BYTES &&
    exact(batch, expectedBatch(contract, custody, options));
}

export function
matrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestDescription() {
  return {
    status: 'EXPERIMENTAL',
    capabilityId:
      VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID,
    statement:
      'R133 exact-binds R132 compatible-unverified authority and transport provider candidates into bounded independent verification requests without resolving a recipient route, transmitting, trusting, selecting, installing, or executing a provider.',
    boundaries: [
      'The current real R132 candidate inventory is empty, so the current request batch is empty and no request metadata is invented.',
      'Synthetic compatible candidates receive six capability-specific proof requirements each; the claimed independent verifier remains caller-supplied and its endpoint, identity, authority, and transport route remain unresolved.',
      'No request or proof requirement verifies a provider, native schema, authority, endpoint, recipient, availability, transport, evidence, source owner, debit, persistence, promotion, canonization, or world mutation.'
    ]
  };
}
