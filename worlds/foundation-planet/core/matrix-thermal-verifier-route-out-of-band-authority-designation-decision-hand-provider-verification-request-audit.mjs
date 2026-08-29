import {
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_PREFLIGHT_SCHEMA,
  VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_PREFLIGHT_EVALUATE_CAPABILITY_ID,
  landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderBindingPreflightContractReceiptValid,
  landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderBindingPreflightValid
} from './matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-binding-preflight.mjs?v=0.138.0-r138.1';
import {
  VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
  VERIFICATION_REQUEST_SEND_RECEIVE_CAPABILITY_ID
} from './matrix-thermal-verifier-route-trust-anchor-and-transport-capability-specification.mjs?v=0.131.0-r131.1';

const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-request-contract-receipt/v1';
const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-proof-requirement/v1';
const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_REQUEST_PACKET_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-request-packet/v1';
const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-request-batch/v1';

const
  VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID =
    'contract.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decision-hand.provider-verification.request.create';

const ENDPOINT_RESOLVE_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.endpoint.resolve';
const CONTRACT_STATUS =
  'OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_REQUEST_CONTRACT_AVAILABLE';
const EMPTY_STATUS =
  'NO_COMPATIBLE_UNVERIFIED_DECISION_HAND_PROVIDER_CANDIDATES_REQUEST_BATCH_EMPTY';
const REQUEST_STATUS =
  'DECISION_HAND_PROVIDER_VERIFICATION_REQUEST_CREATED_NOT_TRANSMITTED_PROVIDER_BLOCKED';
const EMISSION_MODE =
  'transient-untransmitted-request-from-exact-r138-compatible-unverified-decision-hand-candidate';
const MAXIMUM_REQUEST_PACKETS = 1;
const MAXIMUM_PROOF_REQUIREMENTS_PER_PACKET = 8;
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
  return exactKeys(custody, ['r138Contract', 'r138Preflight',
    'r138Boundary', 'r138Declarations']) &&
    custody.r138Contract.schema ===
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA &&
    custody.r138Preflight.schema ===
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_PREFLIGHT_SCHEMA &&
    landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderBindingPreflightContractReceiptValid(
      custody.r138Contract, custody.r138Boundary) &&
    landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderBindingPreflightValid(
      custody.r138Preflight, custody.r138Contract, custody.r138Boundary,
      custody.r138Declarations);
}

function eligibleCandidatesFromValidCustody(custody) {
  return custody.r138Preflight.providerCandidates.filter(candidate =>
    candidate.trust === 'CALLER_SUPPLIED_COMPATIBLE_UNVERIFIED' &&
    candidate.selected === false && candidate.installed === false &&
    candidate.available === false && candidate.executed === false &&
    candidate.authoritySeatAuthenticated === false &&
    candidate.authorityDecisionObserved === false &&
    candidate.designationReceiptObserved === false &&
    candidate.routeDesignatedOrAuthorized === false);
}

function eligibleCandidates(custody) {
  return custodyValid(custody)
    ? eligibleCandidatesFromValidCustody(custody) : [];
}

function expectedContractTruth() {
  return {
    exactR138ContractPreflightDeclarationsAndBoundaryBound: true,
    compatibleUnverifiedDecisionHandCandidateMayCreateRequest: true,
    missingRejectedOrAmbiguousCandidateMayCreateRequest: false,
    requestMayVerifyProviderIdentityAuthorityControlOrImplementation: false,
    requestMayVerifyProviderAvailabilityOrNativeDecisionReceiptSchema: false,
    requestMayAuthenticateDecisionMakerOrAdmitDecisionReceipt: false,
    requestMaySatisfyIdentityProbesSignatureOrDigestReplay: false,
    requestMaySelectInstallOrExecuteDecisionHand: false,
    verificationRecipientRouteResolved: false,
    authoritySeatAuthenticated: false,
    authorityDecisionObserved: false,
    routeDesignatedOrAuthorized: false,
    requestTransported: false,
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
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    status: CONTRACT_STATUS,
    sourceR138: {
      contract: sourceRef(custody.r138Contract),
      preflight: sourceRef(custody.r138Preflight)
    },
    projection: {
      sourceSpecificationCount:
        custody.r138Preflight.summary.specificationCount,
      sourceDeclarationCount:
        custody.r138Preflight.summary.declarationCount,
      sourceCandidateCount:
        custody.r138Preflight.summary.compatibleCandidateCount,
      requestEligibleCandidateCount:
        eligibleCandidatesFromValidCustody(custody).length,
      proofRequirementCountPerRequest:
        MAXIMUM_PROOF_REQUIREMENTS_PER_PACKET,
      unresolvedRouteCapabilityCountPerRequest: 3,
      proofRequirementSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
      requestPacketSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_REQUEST_PACKET_SCHEMA,
      requestBatchSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA,
      sourcePreflightCapabilityId:
        VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_PREFLIGHT_EVALUATE_CAPABILITY_ID,
      implementedContractCapabilityId:
        VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID
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
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
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

function proofRequirements() {
  return [
    proofRequirement(1,
      'INDEPENDENT_PROVIDER_IDENTITY_AUTHORITY_NONCONTROL_AND_REVOCATION',
      'AUTHORIZATION',
      'An appointed independent authority binds the exact provider ID, class, version, capability, declaration digest, control and beneficial-ownership exclusion, authority seat, expiry, and revocation state without granting execution.',
      'INDEPENDENT_PROVIDER_IDENTITY_AUTHORITY_NONCONTROL_AND_REVOCATION_RECEIPT',
      'APPOINTED_AUTHORITY_SEAT_CONTROL_AND_REVOCATION_CHECK',
      'Self-attestation, identifier inequality alone, provider-controlled verification, wrong digest, unappointed authority, expiry, revocation, or a receipt that grants execution.',
      'INDEPENDENT_PROVIDER_IDENTITY_AUTHORITY_NONCONTROL_AND_REVOCATION_REQUIRED'),
    proofRequirement(2, 'PROVIDER_IMPLEMENTATION_INTEGRITY',
      'EXISTENCE_AND_STATIC_STRUCTURE',
      'An independently obtained implementation artifact is provenance-bound, digest-verified, and shown to implement the exact declared decision-hand version and capability contract.',
      'INDEPENDENT_IMPLEMENTATION_ARTIFACT_PROVENANCE_AND_DIGEST_RECEIPT',
      'HELD_OUT_STATIC_DECISION_HAND_CONTRACT_INSPECTION',
      'Missing artifact, provider-only copy, unknown provenance, digest or version mismatch, undeclared dependency, or incompatible entrypoint.',
      'PROVIDER_IMPLEMENTATION_INTEGRITY_REQUIRED'),
    proofRequirement(3, 'BOUNDED_LIVE_PROVIDER_AVAILABILITY',
      'TRANSPORT',
      'A bounded non-decision live challenge produces matched sender and receiver receipts tied to this request, declaration, provider identity, and implementation digest.',
      'MATCHED_NON_DECISION_LIVE_CHALLENGE_SENDER_AND_RECEIVER_RECEIPTS',
      'INDEPENDENT_AVAILABILITY_OBSERVER_RECEIPT',
      'Configuration-only presence, real authority decision execution, send-only success, timeout, missing acknowledgement, mismatched digests, replay, or an unbounded claim.',
      'BOUNDED_LIVE_PROVIDER_AVAILABILITY_REQUIRED'),
    proofRequirement(4, 'NATIVE_DECISION_RECEIPT_SCHEMA_VALIDATION',
      'STATIC_STRUCTURE_AND_DETERMINISTIC_BEHAVIOR',
      'The declared native decision receipt schema is independently obtained, digest-bound, parsed, and exercised against held-out valid and adversarial fixtures without admitting a real decision.',
      'INDEPENDENT_NATIVE_DECISION_RECEIPT_SCHEMA_ARTIFACT_AND_VALIDATOR_RECEIPT',
      'HELD_OUT_VALID_AND_INVALID_DECISION_RECEIPT_FIXTURES',
      'Provider-only schema copy, missing digest, parse failure, generic R137 schema reuse, or acceptance of an invalid fixture.',
      'NATIVE_DECISION_RECEIPT_SCHEMA_VALIDATION_REQUIRED'),
    proofRequirement(5,
      'DECISION_MAKER_SEAT_IDENTITY_SCOPE_AUTHORITY_AND_DENIED_PROBE',
      'AUTHORIZATION',
      'The exact appointed decision-maker seat passes identity, scope, and authority checks while a distinct denied identity is refused under the same bounded verification request.',
      'MATCHED_ALLOWED_AND_DENIED_DECISION_MAKER_SEAT_PROBE_RECEIPTS',
      'INDEPENDENT_SEAT_SCOPE_AND_AUTHORITY_REPLAY',
      'Missing denied probe, acceptance of the denied identity, changed scope, self-appointment, provider-controlled verification, or unbound receipts.',
      'DECISION_MAKER_SEAT_IDENTITY_SCOPE_AUTHORITY_AND_DENIED_PROBE_REQUIRED'),
    proofRequirement(6,
      'NATIVE_SIGNATURE_KEY_AUTHORITY_EXPIRY_AND_REVOCATION_VALIDATION',
      'AUTHORIZATION_AND_CRYPTOGRAPHIC_INTEGRITY',
      'Held-out native decision receipts verify signature, signer-key binding, authority scope, request and criteria binding, expiry, and revocation while one-field drift fails.',
      'HELD_OUT_NATIVE_DECISION_SIGNATURE_KEY_AUTHORITY_AND_LIFECYCLE_RECEIPT',
      'INDEPENDENT_ONE_FIELD_DRIFT_AND_REVOCATION_REJECTION',
      'Signature-only success, caller-supplied key trust, scope mismatch, expired or revoked key, replay, or acceptance after field drift.',
      'NATIVE_SIGNATURE_KEY_AUTHORITY_EXPIRY_AND_REVOCATION_VALIDATION_REQUIRED'),
    proofRequirement(7,
      'EXACT_R137_SPECIFICATION_BINDING_DECLARATION_AND_CANDIDATE_DIGEST_REPLAY',
      'DETERMINISTIC_BEHAVIOR',
      'A held-out replay preserves the exact R137 contract, bundle, specification, input bindings, R138 contract, preflight, candidate binding, and declaration digests while rejecting one-digest drift.',
      'HELD_OUT_EXACT_R137_AND_R138_PROVIDER_BINDING_REPLAY_RECEIPT',
      'INDEPENDENT_ONE_DIGEST_DRIFT_REJECTION_RECEIPT',
      'Any contract, bundle, specification, input-binding, preflight, candidate, or declaration digest mismatch is accepted or omitted.',
      'EXACT_R137_AND_R138_PROVIDER_BINDING_DIGEST_REPLAY_REQUIRED'),
    proofRequirement(8, 'EXACT_DECISION_CRITERIA_AND_EVIDENCE_PROOF_REPLAY',
      'DETERMINISTIC_BEHAVIOR_AND_AUTHORIZATION',
      'Held-out fixtures bind every R136 packet, candidate, route-provider claim, criterion, and evidence requirement and reject omitted, reordered, weakened, or self-supplied proof.',
      'HELD_OUT_EXACT_DECISION_CRITERIA_AND_EVIDENCE_REPLAY_RECEIPT',
      'INDEPENDENT_OMISSION_REORDERING_WEAKENING_AND_SELF_PROOF_REJECTION',
      'Missing criteria or evidence, order drift, weakened proof, provider-controlled evidence, or a result that designates a route during verification.',
      'EXACT_DECISION_CRITERIA_AND_EVIDENCE_PROOF_REPLAY_REQUIRED')
  ];
}

function expectedPacket(contract, custody, candidate, options) {
  const specification = custody.r138Boundary.r137Bundle.specifications.find(
    item => item.capabilityId === candidate.capabilityId);
  const declarationIndex = custody.r138Declarations.findIndex(
    item => item.digest === candidate.declarationDigest);
  const declaration = custody.r138Declarations[declarationIndex];
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_REQUEST_PACKET_SCHEMA,
    requestId: options.requestBatchId + '.decision-hand-provider-01',
    requestOrdinal: 1,
    sourceContract: sourceRef(contract),
    requestBinding: {
      sourcePreflight: sourceRef(custody.r138Preflight),
      capabilityId: candidate.capabilityId,
      specificationOrdinal: candidate.specificationOrdinal,
      specificationDigest: specification.digest,
      candidateBindingDigest: stableDigest(candidate),
      declarationInputIndex: declarationIndex,
      declarationDigest: declaration.digest,
      r137ContractDigest: custody.r138Boundary.r137Contract.digest,
      r137BundleDigest: custody.r138Boundary.r137Bundle.digest,
      inputBindingDigests: clone(candidate.inputBindingDigests)
    },
    claimedProvider: {
      providerId: candidate.providerId,
      providerVersion: candidate.providerVersion,
      providerClass: candidate.providerClass,
      capabilityId: candidate.capabilityId,
      nativeDecisionReceiptSchema:
        clone(candidate.nativeDecisionReceiptSchema),
      claimedIndependentSecondaryVerifierId:
        declaration.verificationDeclaration.independentSecondaryVerifierId,
      declarationTrust: 'CALLER_SUPPLIED_UNTRUSTED',
      compatibilityTrust: 'STRUCTURALLY_COMPATIBLE_UNVERIFIED',
      nativeSchemaTrust: 'CALLER_DECLARED_UNVERIFIED',
      verifierIdentityTrust: 'CALLER_SUPPLIED_UNTRUSTED',
      controlAndBeneficialOwnershipTrust: 'CALLER_DECLARED_UNVERIFIED'
    },
    requestWindow: {
      requestedAt: options.requestedAt,
      expiresAt: options.expiresAt,
      maximumDurationMs: MAXIMUM_REQUEST_WINDOW_MS
    },
    requester: {
      requesterId: options.requesterId,
      authorityStatus:
        'REQUEST_CREATOR_ONLY_NOT_PROVIDER_SELECTOR_DECISION_MAKER_OR_ROUTE_DESIGNATOR'
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
    proofRequirements: proofRequirements(),
    permissionsAndConsent: {
      requestMaySelfAuthorize: false,
      requestMayGrantConsent: false,
      requestMaySelectInstallOrExecuteDecisionHand: false,
      requestMayInvokeAuthorityDecisionOrRouteDesignation: false,
      candidateProviderMayAnswerForIndependentVerifier: false,
      providerVerificationMayEstablishPerDecisionAuthority: false,
      mikeTobiAuthorityProviderSelectionAndPromotionGatePreserved: true
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
      partialProofMayVerifySelectInstallExecuteOrAuthorizeDecisionHand: false,
      retryRequiresSameRequestSourceCandidateAndDeclarationDigests: true,
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
      authoritySeatAuthenticated: false,
      authorityDecisionObserved: false,
      designationReceiptObserved: false,
      routeDesignatedOrAuthorized: false,
      promoted: false,
      canon: false
    },
    truth: {
      requestCreated: true,
      providerIdentityAuthorityControlOrRevocationVerified: false,
      providerImplementationIntegrityVerified: false,
      providerLiveAvailabilityVerified: false,
      nativeDecisionReceiptSchemaVerified: false,
      decisionMakerSeatIdentityScopeOrAuthorityVerified: false,
      allowedAndDeniedIdentityProbesPassed: false,
      nativeSignatureKeyAuthorityExpiryOrRevocationVerified: false,
      exactR137AndR138DigestReplayPassed: false,
      exactDecisionCriteriaAndEvidenceReplayPassed: false,
      verificationRecipientRouteResolved: false,
      transportPerformed: false,
      receiverReceiptObserved: false,
      providerSelected: false,
      providerInstalled: false,
      providerAvailable: false,
      providerExecuted: false,
      authoritySeatAuthenticated: false,
      authorityDecisionObserved: false,
      designationReceiptObserved: false,
      routeDesignatedOrAuthorized: false,
      historicalSourceOwnerOrDebitResolved: false,
      evidenceAdmitted: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  });
}

function expectedBatch(contract, custody, options) {
  const eligible = eligibleCandidatesFromValidCustody(custody);
  const packets = eligible.map(candidate =>
    expectedPacket(contract, custody, candidate, options));
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA,
    status: packets.length === 0 ? EMPTY_STATUS : REQUEST_STATUS,
    sourceContract: sourceRef(contract),
    sourceR138: {
      contract: sourceRef(custody.r138Contract),
      preflight: sourceRef(custody.r138Preflight)
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
        custody.r138Preflight.summary.specificationCount,
      sourceDeclarationCount:
        custody.r138Preflight.summary.declarationCount,
      sourceCandidateCount:
        custody.r138Preflight.summary.compatibleCandidateCount,
      requestEligibleCandidateCount: eligible.length,
      missingDeclarationAssessmentCount:
        custody.r138Preflight.assessments.filter(item =>
          item.status === 'MISSING_DECISION_HAND_PROVIDER_DECLARATION').length,
      rejectedOrAmbiguousAssessmentCount:
        custody.r138Preflight.assessments.filter(item =>
          ['DECISION_HAND_PROVIDER_DECLARATIONS_REJECTED',
            'AMBIGUOUS_DECISION_HAND_PROVIDER_DECLARATIONS']
            .includes(item.status)).length,
      requestPacketCount: packets.length,
      proofRequirementCount:
        packets.length * MAXIMUM_PROOF_REQUIREMENTS_PER_PACKET,
      unresolvedVerificationRecipientRouteCount: packets.length,
      transmittedRequestCount: 0,
      senderReceiptCount: 0,
      receiverReceiptCount: 0,
      independentlyVerifiedDecisionHandCount: 0,
      selectedDecisionHandCount: 0,
      installedDecisionHandCount: 0,
      availableDecisionHandCount: 0,
      executedDecisionHandCount: 0,
      authenticatedAuthoritySeatCount: 0,
      authorityDecisionCount: 0,
      designationReceiptCount: 0,
      designatedOrAuthorizedRouteCount: 0,
      admissionReady: false
    },
    prohibitedConclusions: {
      treatRequestAsProviderIdentityAuthorityControlOrRevocationProof: true,
      treatRequestAsImplementationIntegrityOrAvailabilityProof: true,
      treatRequestAsNativeSchemaSignatureIdentityProbeOrReplayProof: true,
      treatClaimedVerifierAsResolvedTrustedRecipient: true,
      selectInstallExposeOrExecuteDecisionHand: true,
      authenticateAuthoritySeatOrAdmitDecisionReceipt: true,
      decideDesignateOrAuthorizeRoute: true,
      claimTransportWithoutNativeReceipts: true,
      admitEvidenceOwnerOrDebit: true,
      persistMutatePromoteOrCanonize: true
    },
    truth: {
      exactR138EligibleCandidateBound: true,
      onlyCompatibleUnverifiedDecisionHandCandidateRequested: true,
      requestBatchMayVerifySelectInstallOrExecuteDecisionHand: false,
      requestBatchMayAuthenticateAuthorityOrAdmitDecisionReceipt: false,
      requestBatchMayDecideDesignateOrAuthorizeRoute: false,
      requestBatchMayResolveOrTrustVerificationRecipientRoute: false,
      requestBatchMayTransmit: false,
      requestBatchMayAdmitProviderProofs: false,
      authorityTrustAnchorResolved: false,
      requestTransported: false,
      providerVerified: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      admissionAuthorized: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  });
}

const AUDIT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-request-audit/v1';

function safeRef(value) {
  return value && typeof value === 'object' &&
    typeof value.schema === 'string' && typeof value.digest === 'string'
    ? sourceRef(value) : null;
}

export function
auditLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRequest(
  contract, batch, custody, options = {}) {
  const findings = [];
  const exactCustody = custodyValid(custody);
  if (!exactCustody) {
    findings.push('R138_CUSTODY_INVALID_OR_SUBSTITUTED');
  }
  let eligibleCount = 0;
  if (exactCustody) {
    eligibleCount = eligibleCandidatesFromValidCustody(custody).length;
    if (!exact(contract, expectedContract(custody))) {
      findings.push('R139_CONTRACT_NOT_EXACTLY_RECONSTRUCTED');
    }
    if (!requestOptionsValid(options, eligibleCount)) {
      findings.push('REQUEST_OPTIONS_INVALID_OR_UNBOUNDED');
    }
    if (findings.length === 0 &&
        !exact(batch, expectedBatch(contract, custody, options))) {
      findings.push('R139_REQUEST_BATCH_NOT_EXACTLY_RECONSTRUCTED');
    }
  }
  if (!batch || typeof batch !== 'object' || Array.isArray(batch) ||
      new TextEncoder().encode(JSON.stringify(batch)).length >
        MAXIMUM_SERIALIZED_BATCH_BYTES) {
    findings.push('REQUEST_BATCH_RESOURCE_CEILING_EXCEEDED_OR_INVALID');
  }
  const uniqueFindings = [...new Set(findings)];
  return withDigest({
    schema: AUDIT_SCHEMA,
    status: uniqueFindings.length === 0 ? 'PASS' : 'FAIL',
    sourceR139: {
      contract: safeRef(contract),
      batch: safeRef(batch)
    },
    sourceR138: exactCustody ? {
      contract: sourceRef(custody.r138Contract),
      preflight: sourceRef(custody.r138Preflight)
    } : null,
    findings: uniqueFindings,
    summary: {
      requestEligibleCandidateCount: eligibleCount,
      requestPacketCount: Array.isArray(batch?.packets)
        ? batch.packets.length : 0,
      verifiedDecisionHandCount: 0,
      selectedInstalledAvailableOrExecutedDecisionHandCount: 0,
      authenticatedAuthoritySeatCount: 0,
      authorityDecisionOrDesignationCount: 0,
      transmittedRequestCount: 0,
      admittedEvidenceCount: 0
    },
    truth: {
      auditCallsR139BuilderOrValidator: false,
      requestDoesNotVerifyOrAuthorizeDecisionHand: true,
      requestDoesNotAuthenticateAuthorityDecideOrDesignate: true,
      requestDoesNotResolveOrTrustRecipientRoute: true,
      requestDoesNotTransmit: true,
      noDecisionHandSelectionInstallationAvailabilityOrExecution: true,
      noEvidenceOwnerDebitPersistencePromotionCanonOrWorldMutation: true
    }
  });
}
