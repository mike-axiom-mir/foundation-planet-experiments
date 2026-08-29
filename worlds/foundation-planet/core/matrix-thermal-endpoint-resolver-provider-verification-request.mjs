import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_BINDING_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_BINDING_PREFLIGHT_SCHEMA,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflightContractReceiptValid,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflightValid
} from './matrix-thermal-endpoint-resolver-provider-binding-preflight.mjs?v=0.127.0-r127.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-verification-request-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-verification-proof-requirement/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_PACKET_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-verification-request-packet/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-verification-request-batch/v1';

export const
  HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID =
    'contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.endpoint-resolution.resolver-provider.verification.request.create';

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

function digestValid(value, schema) {
  if (value?.schema !== schema || typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
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

function requestSourceValid(source, contract = null) {
  const valid = exactKeys(source, ['r127Contract', 'r127Preflight',
    'r127Source', 'r127Declarations']) &&
    exactKeys(source.r127Source, ['r126Contract', 'r126Bundle']) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflightContractReceiptValid(
      source.r127Contract, source.r127Source) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflightValid(
      source.r127Preflight, source.r127Contract,
      source.r127Source, source.r127Declarations);
  return valid && (contract === null ||
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestContractReceiptValid(
      contract) && exact(contract.sourceR127, {
      contract: sourceRef(source.r127Contract),
      preflight: sourceRef(source.r127Preflight)
    }) && contract.projection.sourceDeclarationCount ===
      source.r127Declarations.length &&
    contract.projection.requestEligibleBindingCount ===
      source.r127Preflight.summary
        .contractCompatibleUnverifiedBindingCount);
}

const expectedContractTruth = () => ({
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
});

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
      sourceSpecificationCount:
        custody.r127Preflight.summary.specificationCount,
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
    truth: expectedContractTruth()
  };
  receipt.digest = stableDigest(receipt);
  return receipt;
}

export function
landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestContractReceiptValid(
  receipt, custody = null) {
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'sourceR127', 'projection',
        'resourceBudget', 'emission', 'truth', 'digest']) ||
      !exactKeys(receipt.sourceR127, ['contract', 'preflight']) ||
      !Object.values(receipt.sourceR127).every(ref => exactKeys(ref,
        ['schema', 'receiptDigest'])) ||
      receipt.sourceR127.contract.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_BINDING_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA ||
      receipt.sourceR127.preflight.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_BINDING_PREFLIGHT_SCHEMA ||
      !exactKeys(receipt.projection, ['sourceSpecificationCount',
        'sourceDeclarationCount', 'requestEligibleBindingCount',
        'proofRequirementCountPerRequest',
        'deferredExecutionPrerequisiteCountPerRequest',
        'proofRequirementSchema', 'requestPacketSchema',
        'requestBatchSchema', 'targetResolverCapabilityId',
        'nextTransportCapabilityId', 'implementedContractCapabilityId']) ||
      receipt.projection.sourceSpecificationCount !== 1 ||
      !Number.isInteger(receipt.projection.sourceDeclarationCount) ||
      receipt.projection.sourceDeclarationCount < 0 ||
      receipt.projection.sourceDeclarationCount > 2 ||
      !Number.isInteger(receipt.projection.requestEligibleBindingCount) ||
      receipt.projection.requestEligibleBindingCount < 0 ||
      receipt.projection.requestEligibleBindingCount > 1 ||
      receipt.projection.proofRequirementCountPerRequest !== 6 ||
      receipt.projection.deferredExecutionPrerequisiteCountPerRequest !== 1 ||
      receipt.projection.proofRequirementSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA ||
      receipt.projection.requestPacketSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_PACKET_SCHEMA ||
      receipt.projection.requestBatchSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA ||
      receipt.projection.targetResolverCapabilityId !==
        RESOLVER_CAPABILITY_ID ||
      receipt.projection.nextTransportCapabilityId !==
        NEXT_TRANSPORT_CAPABILITY_ID ||
      receipt.projection.implementedContractCapabilityId !==
        HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID ||
      !exact(receipt.resourceBudget, {
        maximumRequestPackets: MAXIMUM_REQUEST_PACKETS,
        maximumRequestWindowMs: MAXIMUM_REQUEST_WINDOW_MS,
        maximumSerializedBatchBytes: MAXIMUM_SERIALIZED_BATCH_BYTES
      }) || !exact(receipt.emission, { mode: EMISSION_MODE }) ||
      receipt.status !== CONTRACT_STATUS ||
      !exact(receipt.truth, expectedContractTruth())) return false;
  return custody === null || custodyValid(custody) &&
    exact(receipt, expectedContract(custody));
}

export function
createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestContractReceipt(
  custody) {
  if (!custodyValid(custody)) {
    throw new Error(
      'Resolver-provider verification request contract needs the exact R127 contract, preflight, declarations, and sealed R126 source boundary');
  }
  return expectedContract(custody);
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

function proofRequirements(binding, declaration) {
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

function proofRequirementShapeValid(requirement, index) {
  return exactKeys(requirement, ['schema', 'ordinal', 'proofId',
    'requiredBlockingReason', 'claimClass', 'passCondition',
    'primaryProofSurface', 'secondaryProofSurface', 'counterevidence',
    'independentSecondaryVerifierRequired']) && requirement.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA &&
    requirement.ordinal === index + 1 &&
    typeof requirement.proofId === 'string' &&
    typeof requirement.requiredBlockingReason === 'string' &&
    typeof requirement.claimClass === 'string' &&
    typeof requirement.passCondition === 'string' &&
    requirement.passCondition.length > 0 &&
    typeof requirement.primaryProofSurface === 'string' &&
    typeof requirement.secondaryProofSurface === 'string' &&
    typeof requirement.counterevidence === 'string' &&
    requirement.independentSecondaryVerifierRequired === true;
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

function expectedPacket(contract, source, binding, options) {
  const declarationIndex = binding.declarationInputIndexes[0];
  const declaration = source.r127Declarations[declarationIndex];
  const specification = source.r127Source.r126Bundle.specification;
  const packet = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_PACKET_SCHEMA,
    requestId: options.requestBatchId + '.resolver-provider-binding-01',
    sourceContract: sourceRef(contract),
    requestBinding: {
      sourcePreflight: sourceRef(source.r127Preflight),
      resolverCapabilityId: binding.capabilityId,
      bindingOrdinal: binding.ordinal,
      bindingDigest: stableDigest(binding),
      declarationInputIndex: declarationIndex,
      declarationDigest: declaration.digest,
      r126ContractDigest: source.r127Source.r126Contract.digest,
      r126BundleDigest: source.r127Source.r126Bundle.digest,
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
    proofRequirements: proofRequirements(binding, declaration),
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

function expectedBatch(contract, source, options) {
  const binding = source.r127Preflight.binding;
  const eligible = binding.assessmentStatus ===
    'CONTRACT_COMPATIBLE_UNVERIFIED' ? [binding] : [];
  const packets = eligible.map(item =>
    expectedPacket(contract, source, item, options));
  const batch = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA,
    status: packets.length === 0 ? EMPTY_BATCH_STATUS : REQUEST_BATCH_STATUS,
    sourceContract: sourceRef(contract),
    sourceR127: {
      contract: sourceRef(source.r127Contract),
      preflight: sourceRef(source.r127Preflight)
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
        source.r127Preflight.summary.missingBindingCount,
      rejectedBindingCount:
        source.r127Preflight.summary.rejectedBindingCount,
      ambiguousBindingCount:
        source.r127Preflight.summary.ambiguousBindingCount,
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

function packetShapeValid(packet, batchContext) {
  return digestValid(packet,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_PACKET_SCHEMA) &&
    exactKeys(packet, ['schema', 'requestId', 'sourceContract',
      'requestBinding', 'replayCoverage', 'claimedProvider',
      'requestWindow', 'requester', 'recipient', 'proofRequirements',
      'deferredResolverExecutionPrerequisite', 'permissionsAndConsent',
      'resourceBudget', 'transport', 'failureAndRecovery', 'lifecycle',
      'truth', 'digest']) &&
    packet.requestId === batchContext.requestBatchId +
      '.resolver-provider-binding-01' &&
    exactKeys(packet.sourceContract, ['schema', 'receiptDigest']) &&
    exactKeys(packet.requestBinding, ['sourcePreflight',
      'resolverCapabilityId', 'bindingOrdinal', 'bindingDigest',
      'declarationInputIndex', 'declarationDigest', 'r126ContractDigest',
      'r126BundleDigest', 'resolverSpecificationDigest']) &&
    exactKeys(packet.requestBinding.sourcePreflight,
      ['schema', 'receiptDigest']) &&
    packet.requestBinding.resolverCapabilityId === RESOLVER_CAPABILITY_ID &&
    packet.requestBinding.bindingOrdinal === 1 &&
    packet.requestBinding.declarationInputIndex >= 0 &&
    packet.requestBinding.declarationInputIndex <= 1 &&
    exactKeys(packet.replayCoverage, ['sourceRequestPacketCount',
      'sourceRequestPacketDigests', 'inputBindingDigests']) &&
    Number.isInteger(packet.replayCoverage.sourceRequestPacketCount) &&
    packet.replayCoverage.sourceRequestPacketCount >= 0 &&
    packet.replayCoverage.sourceRequestPacketCount <= 15 &&
    Array.isArray(packet.replayCoverage.sourceRequestPacketDigests) &&
    Array.isArray(packet.replayCoverage.inputBindingDigests) &&
    packet.replayCoverage.sourceRequestPacketDigests.length ===
      packet.replayCoverage.sourceRequestPacketCount &&
    packet.replayCoverage.inputBindingDigests.length ===
      packet.replayCoverage.sourceRequestPacketCount &&
    exactKeys(packet.claimedProvider, ['providerId', 'providerClass',
      'providerVersion', 'declaredNativeResolverReceiptSchema',
      'claimedIndependentSecondaryVerifierId', 'identityTrust',
      'schemaTrust', 'verifierIdentityTrust']) &&
    packet.claimedProvider.identityTrust === 'CALLER_SUPPLIED_UNTRUSTED' &&
    packet.claimedProvider.schemaTrust === 'CALLER_SUPPLIED_UNVERIFIED' &&
    packet.claimedProvider.verifierIdentityTrust ===
      'CALLER_SUPPLIED_UNTRUSTED' &&
    exactKeys(packet.requestWindow, ['requestedAt', 'expiresAt',
      'maximumDurationMs']) &&
    packet.requestWindow.requestedAt === batchContext.requestedAt &&
    packet.requestWindow.expiresAt === batchContext.expiresAt &&
    packet.requestWindow.maximumDurationMs === MAXIMUM_REQUEST_WINDOW_MS &&
    exactKeys(packet.requester, ['requesterId', 'authorityStatus']) &&
    packet.requester.requesterId === batchContext.requesterId &&
    packet.requester.authorityStatus ===
      'REQUEST_CREATOR_ONLY_NOT_RESOLVER_PROVIDER_OR_EXECUTION_AUTHORITY' &&
    exactKeys(packet.recipient, ['status', 'endpoint', 'verifierIdentity',
      'claimedVerifierId', 'requiredTransportCapabilityId']) &&
    packet.recipient.status === 'UNRESOLVED' &&
    packet.recipient.endpoint === null &&
    packet.recipient.verifierIdentity === null &&
    packet.recipient.requiredTransportCapabilityId ===
      NEXT_TRANSPORT_CAPABILITY_ID &&
    Array.isArray(packet.proofRequirements) &&
    packet.proofRequirements.length === 6 &&
    packet.proofRequirements.every(proofRequirementShapeValid) &&
    exact(packet.deferredResolverExecutionPrerequisite,
      deferredExecutionPrerequisite()) &&
    exact(packet.permissionsAndConsent, {
      requestMaySelfAuthorize: false,
      requestMayGrantConsent: false,
      candidateProviderMayAnswerForIndependentVerifier: false,
      providerVerificationMayAuthorizeResolverExecution: false,
      mikeTobiProviderSelectionAndPromotionGatePreserved: true
    }) &&
    exactKeys(packet.resourceBudget, ['maximumResponseBytes',
      'maximumRuntimeMs', 'maximumRegistryQueries', 'retryCount']) &&
    Number.isInteger(packet.resourceBudget.maximumResponseBytes) &&
    packet.resourceBudget.maximumResponseBytes > 0 &&
    Number.isInteger(packet.resourceBudget.maximumRuntimeMs) &&
    packet.resourceBudget.maximumRuntimeMs > 0 &&
    Number.isInteger(packet.resourceBudget.maximumRegistryQueries) &&
    packet.resourceBudget.maximumRegistryQueries > 0 &&
    packet.resourceBudget.retryCount === 0 &&
    exact(packet.transport, {
      status: 'NOT_TRANSMITTED',
      senderReceipt: null,
      receiverReceipt: null,
      receiverAppliedRequest: 'UNKNOWN'
    }) && exact(packet.failureAndRecovery, {
      failClosed: true,
      partialProofMayVerifyProviderOrAuthorizeExecution: false,
      retryRequiresSameRequestDeclarationAndR126Digests: true,
      noFoundationMutationOnFailure: true
    }) && exact(packet.lifecycle, {
      status: 'CREATED_NOT_TRANSMITTED_VERIFICATION_RECIPIENT_UNRESOLVED',
      persisted: false,
      installed: false,
      executed: false,
      promoted: false,
      canon: false
    }) && exact(packet.truth, {
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
    });
}

export function
landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestBatchValid(
  batch, contract = null, source = null, options = null) {
  if (!digestValid(batch,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA) ||
      !exactKeys(batch, ['schema', 'status', 'sourceContract', 'sourceR127',
        'requestContext', 'packets', 'summary', 'prohibitedConclusions',
        'truth', 'digest']) ||
      !exactKeys(batch.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(batch.sourceR127, ['contract', 'preflight']) ||
      !Object.values(batch.sourceR127).every(ref => exactKeys(ref,
        ['schema', 'receiptDigest'])) ||
      !exactKeys(batch.requestContext, ['requestBatchId', 'requesterId',
        'requestedAt', 'expiresAt']) ||
      !Array.isArray(batch.packets) ||
      batch.packets.length > MAXIMUM_REQUEST_PACKETS ||
      !batch.packets.every(packet =>
        packetShapeValid(packet, batch.requestContext)) ||
      !exactKeys(batch.summary, ['sourceBindingCount',
        'requestEligibleBindingCount', 'missingBindingCount',
        'rejectedBindingCount', 'ambiguousBindingCount',
        'requestPacketCount', 'proofRequirementCount',
        'deferredExecutionPrerequisiteCount',
        'resolvedVerificationRecipientCount', 'transmittedRequestCount',
        'receiverReceiptCount', 'independentlyVerifiedResolverProviderCount',
        'resolverInstalledCount', 'resolverAvailableCount',
        'resolverExecutedCount', 'resolvedEndpointCount', 'admissionReady']) ||
      batch.summary.sourceBindingCount !== 1 ||
      batch.summary.requestPacketCount !== batch.packets.length ||
      batch.summary.proofRequirementCount !== batch.packets.length * 6 ||
      batch.summary.deferredExecutionPrerequisiteCount !==
        batch.packets.length ||
      batch.summary.resolvedVerificationRecipientCount !== 0 ||
      batch.summary.transmittedRequestCount !== 0 ||
      batch.summary.receiverReceiptCount !== 0 ||
      batch.summary.independentlyVerifiedResolverProviderCount !== 0 ||
      batch.summary.resolverInstalledCount !== 0 ||
      batch.summary.resolverAvailableCount !== 0 ||
      batch.summary.resolverExecutedCount !== 0 ||
      batch.summary.resolvedEndpointCount !== 0 ||
      batch.summary.admissionReady !== false ||
      !exactKeys(batch.prohibitedConclusions,
        ['treatRequestAsResolverIdentityOrAuthorityProof',
          'treatRequestAsImplementationIntegrityProof',
          'treatRequestAsAvailabilityProof',
          'treatRequestAsNativeSchemaVerification',
          'treatRequestAsIdentityProbeOrReplayProof',
          'treatProviderVerificationAsPerRequestAuthorityOrConsent',
          'selectInstallOrExecuteCandidateProvider',
          'inventVerificationRecipientOrEndpoint',
          'claimTransportWithoutSenderAndReceiverReceipts',
          'admitEvidenceOwnerOrDebit', 'persistMutatePromoteOrCanonize']) ||
      !Object.values(batch.prohibitedConclusions).every(value =>
        value === true) || !exact(batch.truth, {
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
      }) || ![EMPTY_BATCH_STATUS, REQUEST_BATCH_STATUS].includes(
        batch.status) ||
      new TextEncoder().encode(JSON.stringify(batch)).length >
        MAXIMUM_SERIALIZED_BATCH_BYTES) return false;
  if (contract === null && source === null && options === null) return true;
  return contract !== null && source !== null && options !== null &&
    requestSourceValid(source, contract) &&
    requestOptionsValid(options, source.r127Preflight.summary
      .contractCompatibleUnverifiedBindingCount) &&
    exact(batch, expectedBatch(contract, source, options));
}

export function
createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestBatch(
  contract, source, options = {}) {
  const eligibleCount = source?.r127Preflight?.summary
    ?.contractCompatibleUnverifiedBindingCount;
  if (!requestSourceValid(source, contract) ||
      !requestOptionsValid(options, eligibleCount)) {
    throw new Error(
      'Resolver-provider verification request batch needs the exact R128 contract, exact R127 binding source, and a bounded request window whenever one eligible binding exists');
  }
  const batch = expectedBatch(contract, source, options);
  if (new TextEncoder().encode(JSON.stringify(batch)).length >
      MAXIMUM_SERIALIZED_BATCH_BYTES) {
    throw new Error(
      'Resolver-provider verification request batch exceeds the serialized resource ceiling');
  }
  return batch;
}

export function
matrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestDescription() {
  return {
    status: 'EXPERIMENTAL',
    capabilityId:
      HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID,
    statement:
      'R128 converts one exact R127 contract-compatible unverified endpoint-resolver provider binding into a bounded six-proof verification request while leaving the current empty inventory request-free and the provider operationally blocked.',
    boundaries: [
      'The request demands independent resolver identity and authority, implementation integrity, matched live availability receipts, native-schema validation, allowed and denied identity probes, and exact R126 request-and-binding digest replay.',
      'Per-request authority and consent remain a separate deferred prerequisite before every later resolver execution; provider verification cannot grant them.',
      'The verification recipient and endpoint remain unresolved; no provider is selected, installed, made available, executed, contacted, verified, transmitted to, persisted, promoted, canonized, or admitted.'
    ]
  };
}
