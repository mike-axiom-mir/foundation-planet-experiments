import {
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflightContractReceiptValid,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflightValid
} from './matrix-thermal-endpoint-resolver-provider-binding-preflight.mjs?v=0.127.0-r127.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_PACKET_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA,
  HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID
} from './matrix-thermal-endpoint-resolver-provider-verification-request.mjs?v=0.128.0-r128.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_AUDIT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-verification-request-audit/v1';

const CONTRACT_STATUS =
  'ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_CONTRACT_AVAILABLE';
const EMPTY_BATCH_STATUS =
  'NO_CONTRACT_COMPATIBLE_RESOLVER_PROVIDER_BINDING_REQUEST_BATCH_EMPTY';
const REQUEST_BATCH_STATUS =
  'RESOLVER_PROVIDER_VERIFICATION_REQUEST_CREATED_NOT_TRANSMITTED_PROVIDER_BLOCKED';
const EMISSION_MODE =
  'transient-untransmitted-request-from-exact-r127-compatible-unverified-resolver-provider-binding';
const RESOLVER_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.endpoint.resolve';
const NEXT_TRANSPORT_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.request.send-receive';
const MAXIMUM_REQUEST_PACKETS = 1;
const MAXIMUM_REQUEST_WINDOW_MS = 300000;
const MAXIMUM_SERIALIZED_BATCH_BYTES = 131072;
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

const sourceRef = value => ({ schema: value.schema, receiptDigest: value.digest });

function custodyValid(custody) {
  return exactKeys(custody, ['r127Contract', 'r127Preflight',
    'r127Source', 'r127Declarations']) &&
    exactKeys(custody.r127Source, ['r126Contract', 'r126Bundle']) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflightContractReceiptValid(
      custody.r127Contract, custody.r127Source) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflightValid(
      custody.r127Preflight, custody.r127Contract,
      custody.r127Source, custody.r127Declarations);
}

function expectedContract(custody) {
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    status: CONTRACT_STATUS,
    sourceR127: {
      contract: sourceRef(custody.r127Contract),
      preflight: sourceRef(custody.r127Preflight)
    },
    projection: {
      sourceSpecificationCount: 1,
      sourceDeclarationCount:
        custody.r127Preflight.summary.declarationCount,
      requestEligibleBindingCount:
        custody.r127Preflight.summary
          .contractCompatibleUnverifiedBindingCount,
      proofRequirementCountPerRequest: 6,
      deferredExecutionPrerequisiteCountPerRequest: 1,
      proofRequirementSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
      requestPacketSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_PACKET_SCHEMA,
      requestBatchSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA,
      targetResolverCapabilityId: RESOLVER_CAPABILITY_ID,
      nextTransportCapabilityId: NEXT_TRANSPORT_CAPABILITY_ID,
      implementedContractCapabilityId:
        HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID
    },
    resourceBudget: {
      maximumRequestPackets: MAXIMUM_REQUEST_PACKETS,
      maximumRequestWindowMs: MAXIMUM_REQUEST_WINDOW_MS,
      maximumSerializedBatchBytes: MAXIMUM_SERIALIZED_BATCH_BYTES
    },
    emission: { mode: EMISSION_MODE },
    truth: {
      exactR127ContractPreflightDeclarationsAndR126SourceBound: true,
      compatibleUnverifiedResolverProviderBindingMayCreateRequest: true,
      missingRejectedOrAmbiguousBindingMayCreateRequest: false,
      requestMayEstablishResolverProviderIdentityOrAuthority: false,
      requestMayVerifyResolverImplementationIntegrity: false,
      requestMayEstablishResolverAvailability: false,
      requestMayVerifyNativeResolverReceiptSchema: false,
      requestMaySatisfyAllowedAndDeniedIdentityProbes: false,
      requestMaySatisfyExactRequestAndBindingDigestReplay: false,
      perRequestAuthorityAndConsentDeferredUntilResolverExecution: true,
      providerSelected: false,
      resolverInstalled: false,
      resolverExecuted: false,
      endpointOrVerificationRecipientResolved: false,
      transportPerformed: false,
      receiverReceiptObserved: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      admissionAuthorized: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  };
  receipt.digest = stableDigest(receipt);
  return receipt;
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

function proofRequirements(declaration) {
  return [
    {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
      ordinal: 1,
      proofId: 'INDEPENDENT_RESOLVER_IDENTITY_AND_AUTHORITY',
      requiredBlockingReason:
        'INDEPENDENT_RESOLVER_IDENTITY_AND_AUTHORITY_REQUIRED',
      claimClass: 'AUTHORIZATION',
      passCondition:
        'An independent appointed registry or authority binds the exact resolver provider ID, class, version, declaration digest, and resolver capability without granting per-request contact authority.',
      primaryProofSurface:
        'INDEPENDENT_RESOLVER_PROVIDER_IDENTITY_AND_AUTHORITY_RECEIPT',
      secondaryProofSurface:
        'APPOINTED_REGISTRY_OR_AUTHORITY_BOUNDARY_CHECK',
      counterevidence:
        'Caller or provider self-attestation, mismatched capability or declaration digest, wrong authority seat, revocation, expiry, or a receipt that also claims per-request consent.',
      independentSecondaryVerifierRequired: true
    },
    {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
      ordinal: 2,
      proofId: 'RESOLVER_IMPLEMENTATION_INTEGRITY',
      requiredBlockingReason: 'IMPLEMENTATION_INTEGRITY_RECEIPT_REQUIRED',
      claimClass: 'EXISTENCE_AND_STATIC_STRUCTURE',
      passCondition:
        'An independently obtained implementation artifact is provenance-bound, digest-verified, and shown to implement the exact declared resolver version and capability contract.',
      primaryProofSurface:
        'INDEPENDENT_IMPLEMENTATION_ARTIFACT_PROVENANCE_AND_DIGEST_RECEIPT',
      secondaryProofSurface:
        'HELD_OUT_STATIC_CONTRACT_INSPECTION',
      counterevidence:
        'Missing artifact, provider-only copy, unknown provenance, digest mismatch, version mismatch, undeclared dependency, or a contract-incompatible entrypoint.',
      independentSecondaryVerifierRequired: true
    },
    {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
      ordinal: 3,
      proofId: 'LIVE_RESOLVER_AVAILABILITY',
      requiredBlockingReason: 'LIVE_AVAILABILITY_RECEIPT_REQUIRED',
      claimClass: 'TRANSPORT',
      passCondition:
        'A bounded live challenge produces matched sender and receiver receipts tied to this request, the provider declaration, and the implementation digest.',
      primaryProofSurface:
        'MATCHED_LIVE_CHALLENGE_SENDER_AND_RECEIVER_RECEIPTS',
      secondaryProofSurface:
        'INDEPENDENT_AVAILABILITY_OBSERVER_RECEIPT',
      counterevidence:
        'Configuration-only presence, send-only success, timeout, missing acknowledgement, mismatched digests, replay, or an unbounded availability claim.',
      independentSecondaryVerifierRequired: true
    },
    {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
      ordinal: 4,
      proofId: 'NATIVE_RESOLVER_RECEIPT_SCHEMA_VALIDATION',
      requiredBlockingReason:
        'NATIVE_RESOLVER_RECEIPT_SCHEMA_VALIDATION_REQUIRED',
      claimClass: 'STATIC_STRUCTURE_AND_DETERMINISTIC_BEHAVIOR',
      passCondition:
        'The declared native resolver receipt schema is independently obtained, digest-bound, parsed, and exercised against held-out valid and adversarial fixtures.',
      primaryProofSurface:
        'INDEPENDENT_NATIVE_SCHEMA_ARTIFACT_AND_VALIDATOR_RECEIPT',
      secondaryProofSurface:
        'HELD_OUT_VALID_AND_INVALID_NATIVE_RESOLVER_RECEIPT_FIXTURES',
      counterevidence:
        'Provider-only schema copy, missing digest, parse failure, envelope-schema reuse, or acceptance of an invalid held-out fixture.',
      independentSecondaryVerifierRequired: true
    },
    {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
      ordinal: 5,
      proofId: 'ALLOWED_AND_DENIED_RESOLVER_IDENTITY_PROBES',
      requiredBlockingReason:
        'ALLOWED_AND_DENIED_IDENTITY_PROBE_RECEIPTS_REQUIRED',
      claimClass: 'AUTHORIZATION',
      passCondition:
        'The exact declared resolver identity passes an allowed probe and a distinct denied identity is refused under the same capability, request, and authority boundary.',
      primaryProofSurface:
        'MATCHED_ALLOWED_AND_DENIED_IDENTITY_PROBE_RECEIPTS',
      secondaryProofSurface:
        declaration.verificationDeclaration.independentSecondaryVerifierId,
      counterevidence:
        'Missing denied probe, acceptance of the denied identity, differing capability or request inputs, provider-controlled verifier, or unbound probe receipts.',
      independentSecondaryVerifierRequired: true
    },
    {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
      ordinal: 6,
      proofId: 'EXACT_R126_REQUEST_AND_BINDING_DIGEST_REPLAY',
      requiredBlockingReason:
        'EXACT_REQUEST_AND_BINDING_DIGEST_REPLAY_RECEIPT_REQUIRED',
      claimClass: 'DETERMINISTIC_BEHAVIOR',
      passCondition:
        'A held-out replay preserves the exact sealed R126 contract, bundle, specification, source request-packet, and input-binding digests while rejecting one-digest drift.',
      primaryProofSurface:
        'HELD_OUT_EXACT_R126_DIGEST_REPLAY_RECEIPT',
      secondaryProofSurface:
        'INDEPENDENT_ONE_DIGEST_DRIFT_REJECTION_RECEIPT',
      counterevidence:
        'Any source, request, binding, specification, or bundle digest mismatch; successful drift replay; omitted binding; or a replay that changes authority context.',
      independentSecondaryVerifierRequired: true
    }
  ];
}

const deferredExecutionPrerequisite = () => ({
  proofId: 'PER_REQUEST_AUTHORITY_AND_CONSENT',
  requiredBlockingReason:
    'PER_REQUEST_AUTHORITY_AND_CONSENT_RECEIPTS_REQUIRED_BEFORE_RESOLUTION',
  status: 'DEFERRED_UNTIL_EXACT_RESOLVER_EXECUTION_REQUEST',
  appliesBefore: 'EACH_ENDPOINT_RESOLUTION_EXECUTION',
  providerDeclarationMaySatisfy: false,
  providerVerificationRequestMaySatisfy: false,
  reason:
    'Provider identity and capability verification cannot grant the exact authority or consent required for a later endpoint-resolution request.'
});

function expectedPacket(contract, custody, binding, options) {
  const declarationIndex = binding.declarationInputIndexes[0];
  const declaration = custody.r127Declarations[declarationIndex];
  const specification = custody.r127Source.r126Bundle.specification;
  const packet = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_PACKET_SCHEMA,
    requestId: options.requestBatchId + '.resolver-provider-binding-01',
    sourceContract: sourceRef(contract),
    requestBinding: {
      sourcePreflight: sourceRef(custody.r127Preflight),
      resolverCapabilityId: binding.capabilityId,
      bindingOrdinal: binding.ordinal,
      bindingDigest: stableDigest(binding),
      declarationInputIndex: declarationIndex,
      declarationDigest: declaration.digest,
      r126ContractDigest: custody.r127Source.r126Contract.digest,
      r126BundleDigest: custody.r127Source.r126Bundle.digest,
      resolverSpecificationDigest: specification.digest
    },
    replayCoverage: {
      sourceRequestPacketCount:
        specification.coverage.sourceRequestPacketCount,
      sourceRequestPacketDigests:
        clone(specification.coverage.sourceRequestPacketDigests),
      inputBindingDigests:
        clone(specification.coverage.inputBindingDigests)
    },
    claimedProvider: {
      providerId: binding.providerId,
      providerClass: binding.providerClass,
      providerVersion: declaration.providerVersion,
      declaredNativeResolverReceiptSchema:
        binding.declaredNativeResolverReceiptSchema,
      claimedIndependentSecondaryVerifierId:
        declaration.verificationDeclaration.independentSecondaryVerifierId,
      identityTrust: 'CALLER_SUPPLIED_UNTRUSTED',
      schemaTrust: 'CALLER_SUPPLIED_UNVERIFIED',
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
        'REQUEST_CREATOR_ONLY_NOT_RESOLVER_PROVIDER_OR_EXECUTION_AUTHORITY'
    },
    recipient: {
      status: 'UNRESOLVED',
      endpoint: null,
      verifierIdentity: null,
      claimedVerifierId:
        declaration.verificationDeclaration.independentSecondaryVerifierId,
      requiredTransportCapabilityId: NEXT_TRANSPORT_CAPABILITY_ID
    },
    proofRequirements: proofRequirements(declaration),
    deferredResolverExecutionPrerequisite:
      deferredExecutionPrerequisite(),
    permissionsAndConsent: {
      requestMaySelfAuthorize: false,
      requestMayGrantConsent: false,
      candidateProviderMayAnswerForIndependentVerifier: false,
      providerVerificationMayAuthorizeResolverExecution: false,
      mikeTobiProviderSelectionAndPromotionGatePreserved: true
    },
    resourceBudget: {
      maximumResponseBytes:
        declaration.resourceBudget.maximumResultEnvelopeBytes,
      maximumRuntimeMs:
        declaration.resourceBudget.maximumRuntimeMs,
      maximumRegistryQueries:
        declaration.resourceBudget.maximumRegistryQueriesPerRequest,
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
      partialProofMayVerifyProviderOrAuthorizeExecution: false,
      retryRequiresSameRequestDeclarationAndR126Digests: true,
      noFoundationMutationOnFailure: true
    },
    lifecycle: {
      status:
        'CREATED_NOT_TRANSMITTED_VERIFICATION_RECIPIENT_UNRESOLVED',
      persisted: false,
      installed: false,
      executed: false,
      promoted: false,
      canon: false
    },
    truth: {
      requestCreated: true,
      resolverProviderSelected: false,
      verificationRecipientResolved: false,
      transportPerformed: false,
      receiverReceiptObserved: false,
      resolverProviderIdentityOrAuthorityVerified: false,
      resolverImplementationIntegrityVerified: false,
      resolverAvailable: false,
      nativeResolverReceiptSchemaVerified: false,
      allowedAndDeniedIdentityProbesPassed: false,
      exactR126DigestReplayPassed: false,
      perRequestAuthorityOrConsentVerified: false,
      resolverInstalled: false,
      resolverExecuted: false,
      endpointResolved: false,
      historicalSourceOwnerOrDebitResolved: false,
      admissionAuthorized: false,
      worldMutationPerformed: false
    }
  };
  packet.digest = stableDigest(packet);
  return packet;
}

function expectedBatch(contract, custody, options) {
  const binding = custody.r127Preflight.binding;
  const eligible = binding.assessmentStatus ===
    'CONTRACT_COMPATIBLE_UNVERIFIED' ? [binding] : [];
  const packets = eligible.map(item =>
    expectedPacket(contract, custody, item, options));
  const batch = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA,
    status: packets.length === 0 ? EMPTY_BATCH_STATUS : REQUEST_BATCH_STATUS,
    sourceContract: sourceRef(contract),
    sourceR127: {
      contract: sourceRef(custody.r127Contract),
      preflight: sourceRef(custody.r127Preflight)
    },
    requestContext: packets.length === 0 ? {
      requestBatchId: null,
      requesterId: null,
      requestedAt: null,
      expiresAt: null
    } : clone(options),
    packets,
    summary: {
      sourceBindingCount: 1,
      requestEligibleBindingCount: eligible.length,
      missingBindingCount:
        custody.r127Preflight.summary.missingBindingCount,
      rejectedBindingCount:
        custody.r127Preflight.summary.rejectedBindingCount,
      ambiguousBindingCount:
        custody.r127Preflight.summary.ambiguousBindingCount,
      requestPacketCount: packets.length,
      proofRequirementCount: packets.length * 6,
      deferredExecutionPrerequisiteCount: packets.length,
      resolvedVerificationRecipientCount: 0,
      transmittedRequestCount: 0,
      receiverReceiptCount: 0,
      independentlyVerifiedResolverProviderCount: 0,
      resolverInstalledCount: 0,
      resolverAvailableCount: 0,
      resolverExecutedCount: 0,
      resolvedEndpointCount: 0,
      admissionReady: false
    },
    prohibitedConclusions: {
      treatRequestAsResolverIdentityOrAuthorityProof: true,
      treatRequestAsImplementationIntegrityProof: true,
      treatRequestAsAvailabilityProof: true,
      treatRequestAsNativeSchemaVerification: true,
      treatRequestAsIdentityProbeOrReplayProof: true,
      treatProviderVerificationAsPerRequestAuthorityOrConsent: true,
      selectInstallOrExecuteCandidateProvider: true,
      inventVerificationRecipientOrEndpoint: true,
      claimTransportWithoutSenderAndReceiverReceipts: true,
      admitEvidenceOwnerOrDebit: true,
      persistMutatePromoteOrCanonize: true
    },
    truth: {
      exactR127EligibleBindingBound: true,
      onlySingleCompatibleUnverifiedBindingRequested: true,
      requestBatchMaySelectInstallOrExecuteResolverProvider: false,
      requestBatchMayResolveVerificationRecipientOrEndpoint: false,
      requestBatchMayTransmit: false,
      requestBatchMayVerifyProviderProofs: false,
      requestBatchMayGrantPerRequestAuthorityOrConsent: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      admissionAuthorized: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  };
  batch.digest = stableDigest(batch);
  return batch;
}

export function
auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequest(
  contract, batch, custody, options = {}) {
  const exactCustody = custodyValid(custody);
  const expectedContractValue = exactCustody
    ? expectedContract(custody) : null;
  const contractExact = expectedContractValue !== null &&
    exact(contract, expectedContractValue);
  const eligibleCount = exactCustody
    ? custody.r127Preflight.summary
      .contractCompatibleUnverifiedBindingCount : -1;
  const optionsExact = exactCustody &&
    requestOptionsValid(options, eligibleCount);
  const expectedBatchValue = contractExact && optionsExact
    ? expectedBatch(expectedContractValue, custody, options) : null;
  const batchExact = expectedBatchValue !== null &&
    exact(batch, expectedBatchValue) &&
    new TextEncoder().encode(JSON.stringify(batch)).length <=
      MAXIMUM_SERIALIZED_BATCH_BYTES;
  const checks = {
    exactR127ContractPreflightDeclarationsAndR126SourceValid: exactCustody,
    contractIndependentlyReconstructed: contractExact,
    requestWindowAndRequesterBound: batchExact && (eligibleCount === 0 ||
      batch.requestContext.requestBatchId === options.requestBatchId &&
      batch.requestContext.requesterId === options.requesterId &&
      batch.requestContext.requestedAt === options.requestedAt &&
      batch.requestContext.expiresAt === options.expiresAt),
    onlyOneCompatibleUnverifiedBindingMayBeRequested: batchExact &&
      batch.packets.length === eligibleCount,
    sixProofRequirementsIndependentlyReconstructed: batchExact &&
      batch.packets.every(packet =>
        packet.proofRequirements.length === 6),
    exactR126ReplayCoverageBound: batchExact &&
      batch.packets.every(packet =>
        packet.requestBinding.r126BundleDigest ===
          custody.r127Source.r126Bundle.digest &&
        packet.requestBinding.resolverSpecificationDigest ===
          custody.r127Source.r126Bundle.specification.digest),
    perRequestAuthorityAndConsentRemainDeferred: batchExact &&
      batch.packets.every(packet => exact(
        packet.deferredResolverExecutionPrerequisite,
        deferredExecutionPrerequisite())),
    verificationRecipientsAndEndpointsRemainUnresolved: batchExact &&
      batch.packets.every(packet =>
        packet.recipient.status === 'UNRESOLVED' &&
        packet.recipient.endpoint === null &&
        packet.recipient.verifierIdentity === null),
    noTransportOrReceiverReceiptClaimed: batchExact &&
      batch.packets.every(packet =>
        packet.transport.status === 'NOT_TRANSMITTED' &&
        packet.transport.senderReceipt === null &&
        packet.transport.receiverReceipt === null),
    providerSelectionExecutionAndReadinessRemainZero: batchExact &&
      batch.summary.independentlyVerifiedResolverProviderCount === 0 &&
      batch.summary.resolverInstalledCount === 0 &&
      batch.summary.resolverAvailableCount === 0 &&
      batch.summary.resolverExecutedCount === 0 &&
      batch.summary.resolvedEndpointCount === 0 &&
      batch.summary.admissionReady === false,
    prohibitedConclusionsFailClosed: batchExact &&
      Object.values(batch.prohibitedConclusions).every(value =>
        value === true),
    batchIndependentlyReconstructed: batchExact
  };
  const pass = Object.values(checks).every(value => value === true);
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_AUDIT_SCHEMA,
    status: pass ? 'PASS' : 'FAIL',
    checks,
    detail: {
      sourceDeclarationCount: contractExact
        ? contract.projection.sourceDeclarationCount : 0,
      requestEligibleBindingCount: batchExact
        ? batch.summary.requestEligibleBindingCount : 0,
      requestPacketCount: batchExact
        ? batch.summary.requestPacketCount : 0,
      proofRequirementCount: batchExact
        ? batch.summary.proofRequirementCount : 0,
      deferredExecutionPrerequisiteCount: batchExact
        ? batch.summary.deferredExecutionPrerequisiteCount : 0,
      transmittedRequestCount: 0,
      receiverReceiptCount: 0,
      independentlyVerifiedResolverProviderCount: 0,
      resolverExecutedCount: 0
    },
    truth: {
      auditReconstructedR128WithoutCallingR128BuildersOrValidators: true,
      auditMaySelectInstallOrExecuteResolverProvider: false,
      auditMayResolveVerificationRecipientEndpointOrTransmit: false,
      auditMayVerifyProviderProofsOrPerRequestAuthority: false,
      auditMayResolveHistoricalOwnersOrDebits: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  };
}
