import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_BINDING_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_BINDING_PREFLIGHT_SCHEMA,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderBindingPreflightContractReceiptValid,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderBindingPreflightValid
} from './matrix-thermal-historical-source-owner-debit-external-capability-provider-binding-preflight.mjs?v=0.122.0-r122.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-request-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-proof-requirement/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_PACKET_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-request-packet/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-request-batch/v1';

export const
  HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID =
    'contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.request.create';

const CONTRACT_STATUS =
  'EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_CONTRACT_AVAILABLE';
const EMPTY_BATCH_STATUS =
  'NO_CONTRACT_COMPATIBLE_BINDINGS_REQUEST_BATCH_EMPTY';
const REQUEST_BATCH_STATUS =
  'PROVIDER_VERIFICATION_REQUESTS_CREATED_NOT_TRANSMITTED_WITH_BLOCKED_BINDINGS_RETAINED';
const EMISSION_MODE =
  'transient-untransmitted-request-from-exact-r122-compatible-unverified-bindings';
const ENDPOINT_RESOLVER_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.endpoint.resolve';
const MAXIMUM_REQUEST_PACKETS = 15;
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

function digestValid(value, schema) {
  if (value?.schema !== schema || typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

const sourceRef = value => ({ schema: value.schema, receiptDigest: value.digest });

function custodyValid(custody) {
  return exactKeys(custody, ['r122Contract', 'r122Preflight',
    'r122BindingSource', 'r122Declarations', 'r122Custody']) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderBindingPreflightContractReceiptValid(
      custody.r122Contract, custody.r122Custody) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderBindingPreflightValid(
      custody.r122Preflight, custody.r122Contract,
      custody.r122BindingSource, custody.r122Declarations);
}

function requestSourceValid(source, contract = null) {
  const valid = exactKeys(source, ['r122Contract', 'r122Preflight',
    'r122BindingSource', 'r122Declarations']) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderBindingPreflightContractReceiptValid(
      source.r122Contract) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderBindingPreflightValid(
      source.r122Preflight, source.r122Contract,
      source.r122BindingSource, source.r122Declarations);
  return valid && (contract === null ||
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationRequestContractReceiptValid(
      contract) &&
    exact(contract.sourceR122, {
      contract: sourceRef(source.r122Contract),
      preflight: sourceRef(source.r122Preflight)
    }) &&
    contract.projection.sourceDeclarationCount ===
      source.r122Declarations.length &&
    contract.projection.requestEligibleBindingCount ===
      source.r122Preflight.summary
        .contractCompatibleUnverifiedBindingCount);
}

const expectedContractTruth = () => ({
  exactR122ContractPreflightDeclarationsAndCustodyBound: true,
  compatibleUnverifiedBindingsMayCreateRequests: true,
  missingRejectedOrAmbiguousBindingsMayCreateRequests: false,
  requestMayEstablishProviderIdentity: false,
  requestMayEstablishProviderAvailability: false,
  requestMayVerifyNativeReceiptSchema: false,
  requestMayGrantAuthorizationOrConsent: false,
  endpointResolved: false,
  recipientAuthenticated: false,
  transportPerformed: false,
  receiverReceiptObserved: false,
  evidenceAuthenticated: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  admissionAuthorized: false,
  persistencePerformed: false,
  worldMutationPerformed: false
});

function expectedContract(custody) {
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    status: CONTRACT_STATUS,
    sourceR122: {
      contract: sourceRef(custody.r122Contract),
      preflight: sourceRef(custody.r122Preflight)
    },
    projection: {
      sourceSpecificationCount:
        custody.r122Preflight.summary.specificationCount,
      sourceDeclarationCount:
        custody.r122Preflight.summary.declarationCount,
      requestEligibleBindingCount:
        custody.r122Preflight.summary
          .contractCompatibleUnverifiedBindingCount,
      proofRequirementCountPerRequest: 4,
      proofRequirementSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
      requestPacketSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_PACKET_SCHEMA,
      requestBatchSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA,
      endpointResolverCapabilityId: ENDPOINT_RESOLVER_CAPABILITY_ID,
      implementedContractCapabilityId:
        HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID
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
landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationRequestContractReceiptValid(
  receipt, custody = null) {
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'sourceR122', 'projection',
        'resourceBudget', 'emission', 'truth', 'digest']) ||
      !exactKeys(receipt.sourceR122, ['contract', 'preflight']) ||
      !Object.values(receipt.sourceR122).every(ref => exactKeys(ref,
        ['schema', 'receiptDigest'])) ||
      receipt.sourceR122.contract.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_BINDING_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA ||
      receipt.sourceR122.preflight.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_BINDING_PREFLIGHT_SCHEMA ||
      !exactKeys(receipt.projection, ['sourceSpecificationCount',
        'sourceDeclarationCount', 'requestEligibleBindingCount',
        'proofRequirementCountPerRequest', 'proofRequirementSchema',
        'requestPacketSchema', 'requestBatchSchema',
        'endpointResolverCapabilityId',
        'implementedContractCapabilityId']) ||
      receipt.projection.sourceSpecificationCount !== 15 ||
      !Number.isInteger(receipt.projection.sourceDeclarationCount) ||
      receipt.projection.sourceDeclarationCount < 0 ||
      receipt.projection.sourceDeclarationCount > 30 ||
      !Number.isInteger(receipt.projection.requestEligibleBindingCount) ||
      receipt.projection.requestEligibleBindingCount < 0 ||
      receipt.projection.requestEligibleBindingCount > 15 ||
      receipt.projection.proofRequirementCountPerRequest !== 4 ||
      receipt.projection.proofRequirementSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA ||
      receipt.projection.requestPacketSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_PACKET_SCHEMA ||
      receipt.projection.requestBatchSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA ||
      receipt.projection.endpointResolverCapabilityId !==
        ENDPOINT_RESOLVER_CAPABILITY_ID ||
      receipt.projection.implementedContractCapabilityId !==
        HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID ||
      !exact(receipt.resourceBudget, {
        maximumRequestPackets: MAXIMUM_REQUEST_PACKETS,
        maximumRequestWindowMs: MAXIMUM_REQUEST_WINDOW_MS,
        maximumSerializedBatchBytes: MAXIMUM_SERIALIZED_BATCH_BYTES
      }) ||
      !exactKeys(receipt.emission, ['mode']) ||
      receipt.emission.mode !== EMISSION_MODE ||
      receipt.status !== CONTRACT_STATUS ||
      !exact(receipt.truth, expectedContractTruth())) return false;
  return custody === null || custodyValid(custody) &&
    exact(receipt, expectedContract(custody));
}

export function
createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationRequestContractReceipt(
  custody) {
  if (!custodyValid(custody)) {
    throw new Error(
      'Provider-verification request contract needs the exact R122 contract, preflight, declarations, binding source, and full custody');
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
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
      ordinal: 1,
      proofId: 'INDEPENDENT_PROVIDER_IDENTITY',
      requiredBlockingReason: 'INDEPENDENT_PROVIDER_IDENTITY_REQUIRED',
      claimClass: 'AUTHORIZATION',
      passCondition:
        'An independent trusted registry or appointed authority binds the exact provider ID, class, version, and declaration digest.',
      primaryProofSurface:
        'INDEPENDENT_PROVIDER_IDENTITY_BINDING_RECEIPT',
      secondaryProofSurface:
        'ALLOWED_AND_DENIED_IDENTITY_CHALLENGE_WHEN_REQUIRED',
      counterevidence:
        'Caller self-attestation, provider-controlled keys, mismatched identity, revocation, or absent independent binding.',
      allowedAndDeniedIdentityProbesRequired:
        declaration.verificationDeclaration
          .allowedAndDeniedIdentityProbesPlanned
    },
    {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
      ordinal: 2,
      proofId: 'LIVE_PROVIDER_AVAILABILITY',
      requiredBlockingReason: 'LIVE_AVAILABILITY_RECEIPT_REQUIRED',
      claimClass: 'TRANSPORT',
      passCondition:
        'A bounded live challenge has matched sender and receiver receipts tied to the exact request and declaration digests.',
      primaryProofSurface:
        'MATCHED_LIVE_CHALLENGE_SENDER_AND_RECEIVER_RECEIPTS',
      secondaryProofSurface:
        'INDEPENDENT_AVAILABILITY_OBSERVER_RECEIPT',
      counterevidence:
        'Missing endpoint, send-only success, missing receiver acknowledgement, timeout, digest mismatch, or replay.',
      allowedAndDeniedIdentityProbesRequired:
        declaration.verificationDeclaration
          .allowedAndDeniedIdentityProbesPlanned
    },
    {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
      ordinal: 3,
      proofId: 'NATIVE_RECEIPT_SCHEMA_VALIDATION',
      requiredBlockingReason:
        'NATIVE_RECEIPT_SCHEMA_VALIDATION_REQUIRED',
      claimClass: 'STATIC_STRUCTURE_AND_DETERMINISTIC_BEHAVIOR',
      passCondition:
        'The declared native receipt schema is independently obtained, digest-bound, parsed, and exercised against valid and adversarial fixtures.',
      primaryProofSurface:
        'INDEPENDENT_SCHEMA_ARTIFACT_AND_VALIDATOR_RECEIPT',
      secondaryProofSurface:
        'HELD_OUT_VALID_AND_INVALID_NATIVE_RECEIPT_FIXTURES',
      counterevidence:
        'Provider-only schema copy, missing digest, parse failure, envelope reuse, or validator accepting invalid fixtures.',
      allowedAndDeniedIdentityProbesRequired: false
    },
    {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
      ordinal: 4,
      proofId: 'AUTHORIZATION_OR_CONSENT',
      requiredBlockingReason:
        'AUTHORIZATION_OR_CONSENT_RECEIPT_REQUIRED',
      claimClass: 'AUTHORIZATION',
      passCondition:
        'The exact required authority seat issues a bounded, unrevoked authorization or consent receipt for the provider and capability.',
      primaryProofSurface:
        'AUTHORITY_OR_CONSENT_RECEIPT_WITH_ALLOWED_AND_DENIED_PROBES',
      secondaryProofSurface:
        binding.providerClass === 'MIKE_TOBI_OR_AXM_REVIEW_SEAT'
          ? 'MIKE_TOBI_OR_APPOINTED_AXM_REVIEW_DECISION'
          : 'INDEPENDENT_AUTHORITY_POLICY_AND_REVOCATION_CHECK',
      counterevidence:
        'Caller policy, self-authorization, wrong seat, expired or revoked grant, absent denied-identity test, or scope mismatch.',
      allowedAndDeniedIdentityProbesRequired: true
    }
  ];
}

function proofRequirementShapeValid(requirement, index) {
  return exactKeys(requirement, ['schema', 'ordinal', 'proofId',
    'requiredBlockingReason', 'claimClass', 'passCondition',
    'primaryProofSurface', 'secondaryProofSurface', 'counterevidence',
    'allowedAndDeniedIdentityProbesRequired']) &&
    requirement.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA &&
    requirement.ordinal === index + 1 &&
    typeof requirement.proofId === 'string' &&
    typeof requirement.requiredBlockingReason === 'string' &&
    typeof requirement.passCondition === 'string' &&
    requirement.passCondition.length > 0 &&
    typeof requirement.counterevidence === 'string' &&
    typeof requirement.allowedAndDeniedIdentityProbesRequired === 'boolean';
}

function expectedPacket(contract, source, binding, options) {
  const declarationIndex = binding.declarationInputIndexes[0];
  const declaration = source.r122Declarations[declarationIndex];
  const packet = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_PACKET_SCHEMA,
    requestId: options.requestBatchId + '.binding-' +
      String(binding.ordinal).padStart(2, '0'),
    sourceContract: sourceRef(contract),
    requestBinding: {
      sourcePreflight: sourceRef(source.r122Preflight),
      capabilityId: binding.capabilityId,
      bindingOrdinal: binding.ordinal,
      bindingDigest: stableDigest(binding),
      declarationInputIndex: declarationIndex,
      declarationDigest: declaration.digest
    },
    claimedProvider: {
      providerId: binding.providerId,
      providerClass: binding.providerClass,
      providerVersion: declaration.providerVersion,
      declaredNativeReceiptSchema:
        binding.declaredNativeReceiptSchema,
      identityTrust: 'CALLER_SUPPLIED_UNTRUSTED',
      schemaTrust: 'CALLER_SUPPLIED_UNVERIFIED'
    },
    requestWindow: {
      requestedAt: options.requestedAt,
      expiresAt: options.expiresAt,
      maximumDurationMs: MAXIMUM_REQUEST_WINDOW_MS
    },
    requester: {
      requesterId: options.requesterId,
      authorityStatus: 'REQUEST_CREATOR_ONLY_NOT_PROVIDER_AUTHORITY'
    },
    recipient: {
      status: 'UNRESOLVED',
      endpoint: null,
      recipientIdentity: null,
      endpointResolverCapabilityId: ENDPOINT_RESOLVER_CAPABILITY_ID
    },
    proofRequirements: proofRequirements(binding, declaration),
    permissionsAndConsent: {
      requiredAuthoritySeat:
        declaration.permissionsAndConsent.requiredAuthoritySeat,
      requestMaySelfAuthorize: false,
      requestMayGrantConsent: false,
      providerMayAnswerForIndependentVerifier: false,
      mikeTobiPromotionGatePreserved: true
    },
    resourceBudget: {
      maximumResponseBytes:
        declaration.resourceBudget.maximumOutputBytes,
      maximumRuntimeMs:
        declaration.resourceBudget.maximumRuntimeMs,
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
      partialProofMayAuthorize: false,
      retryRequiresSameRequestAndDeclarationDigests: true,
      noFoundationMutationOnFailure: true
    },
    lifecycle: {
      status: 'CREATED_NOT_TRANSMITTED_RECIPIENT_UNRESOLVED',
      persisted: false,
      promoted: false,
      canon: false
    },
    truth: {
      requestCreated: true,
      endpointResolved: false,
      recipientAuthenticated: false,
      transportPerformed: false,
      receiverReceiptObserved: false,
      providerIdentityAuthenticated: false,
      providerAvailable: false,
      nativeReceiptSchemaVerified: false,
      authorizationOrConsentVerified: false,
      evidenceAuthenticated: false,
      ownerOrDebitResolved: false,
      admissionAuthorized: false,
      worldMutationPerformed: false
    }
  };
  packet.digest = stableDigest(packet);
  return packet;
}

function expectedBatch(contract, source, options) {
  const eligible = source.r122Preflight.bindings.filter(binding =>
    binding.assessmentStatus === 'CONTRACT_COMPATIBLE_UNVERIFIED');
  const packets = eligible.map(binding =>
    expectedPacket(contract, source, binding, options));
  const batch = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA,
    status: packets.length === 0 ? EMPTY_BATCH_STATUS : REQUEST_BATCH_STATUS,
    sourceContract: sourceRef(contract),
    sourceR122: {
      contract: sourceRef(source.r122Contract),
      preflight: sourceRef(source.r122Preflight)
    },
    requestContext: packets.length === 0 ? {
      requestBatchId: null,
      requesterId: null,
      requestedAt: null,
      expiresAt: null
    } : clone(options),
    packets,
    summary: {
      sourceBindingCount: source.r122Preflight.bindings.length,
      requestEligibleBindingCount: eligible.length,
      missingBindingCount:
        source.r122Preflight.summary.missingBindingCount,
      rejectedBindingCount:
        source.r122Preflight.summary.rejectedBindingCount,
      ambiguousBindingCount:
        source.r122Preflight.summary.ambiguousBindingCount,
      requestPacketCount: packets.length,
      endpointResolvedCount: 0,
      transmittedRequestCount: 0,
      receiverReceiptCount: 0,
      independentlyVerifiedProviderCount: 0,
      operationallyReadyProviderCount: 0,
      admissionReady: false
    },
    prohibitedConclusions: {
      treatRequestAsIdentityProof: true,
      treatRequestAsAvailabilityProof: true,
      treatRequestAsSchemaVerification: true,
      treatRequestAsAuthorizationOrConsent: true,
      inventEndpointOrRecipient: true,
      claimTransportWithoutSenderAndReceiverReceipts: true,
      admitEvidenceOwnerOrDebit: true,
      persistMutatePromoteOrCanonize: true
    },
    truth: {
      exactR122EligibleBindingsBound: true,
      onlyCompatibleUnverifiedBindingsRequested: true,
      requestBatchMayResolveEndpoint: false,
      requestBatchMayTransmit: false,
      requestBatchMayAuthenticateProviderEvidenceOrAuthority: false,
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

function packetShapeValid(packet, index, batchContext) {
  return digestValid(packet,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_PACKET_SCHEMA) &&
    exactKeys(packet, ['schema', 'requestId', 'sourceContract',
      'requestBinding', 'claimedProvider', 'requestWindow', 'requester',
      'recipient', 'proofRequirements', 'permissionsAndConsent',
      'resourceBudget', 'transport', 'failureAndRecovery', 'lifecycle',
      'truth', 'digest']) &&
    typeof packet.requestId === 'string' &&
    packet.requestId === batchContext.requestBatchId + '.binding-' +
      String(packet.requestBinding.bindingOrdinal).padStart(2, '0') &&
    exactKeys(packet.sourceContract, ['schema', 'receiptDigest']) &&
    exactKeys(packet.requestBinding, ['sourcePreflight', 'capabilityId',
      'bindingOrdinal', 'bindingDigest', 'declarationInputIndex',
      'declarationDigest']) &&
    exactKeys(packet.requestBinding.sourcePreflight,
      ['schema', 'receiptDigest']) &&
    Number.isInteger(packet.requestBinding.bindingOrdinal) &&
    packet.requestBinding.bindingOrdinal >= 1 &&
    packet.requestBinding.bindingOrdinal <= 15 &&
    exactKeys(packet.claimedProvider, ['providerId', 'providerClass',
      'providerVersion', 'declaredNativeReceiptSchema', 'identityTrust',
      'schemaTrust']) &&
    packet.claimedProvider.identityTrust ===
      'CALLER_SUPPLIED_UNTRUSTED' &&
    packet.claimedProvider.schemaTrust ===
      'CALLER_SUPPLIED_UNVERIFIED' &&
    exactKeys(packet.requestWindow, ['requestedAt', 'expiresAt',
      'maximumDurationMs']) &&
    packet.requestWindow.requestedAt === batchContext.requestedAt &&
    packet.requestWindow.expiresAt === batchContext.expiresAt &&
    packet.requestWindow.maximumDurationMs === MAXIMUM_REQUEST_WINDOW_MS &&
    exactKeys(packet.requester, ['requesterId', 'authorityStatus']) &&
    packet.requester.requesterId === batchContext.requesterId &&
    packet.requester.authorityStatus ===
      'REQUEST_CREATOR_ONLY_NOT_PROVIDER_AUTHORITY' &&
    exact(packet.recipient, {
      status: 'UNRESOLVED',
      endpoint: null,
      recipientIdentity: null,
      endpointResolverCapabilityId: ENDPOINT_RESOLVER_CAPABILITY_ID
    }) &&
    Array.isArray(packet.proofRequirements) &&
    packet.proofRequirements.length === 4 &&
    packet.proofRequirements.every(proofRequirementShapeValid) &&
    exactKeys(packet.permissionsAndConsent, ['requiredAuthoritySeat',
      'requestMaySelfAuthorize', 'requestMayGrantConsent',
      'providerMayAnswerForIndependentVerifier',
      'mikeTobiPromotionGatePreserved']) &&
    packet.permissionsAndConsent.requestMaySelfAuthorize === false &&
    packet.permissionsAndConsent.requestMayGrantConsent === false &&
    packet.permissionsAndConsent
      .providerMayAnswerForIndependentVerifier === false &&
    packet.permissionsAndConsent.mikeTobiPromotionGatePreserved === true &&
    exactKeys(packet.resourceBudget, ['maximumResponseBytes',
      'maximumRuntimeMs', 'retryCount']) &&
    Number.isInteger(packet.resourceBudget.maximumResponseBytes) &&
    packet.resourceBudget.maximumResponseBytes > 0 &&
    Number.isInteger(packet.resourceBudget.maximumRuntimeMs) &&
    packet.resourceBudget.maximumRuntimeMs > 0 &&
    packet.resourceBudget.retryCount === 0 &&
    exact(packet.transport, {
      status: 'NOT_TRANSMITTED',
      senderReceipt: null,
      receiverReceipt: null,
      receiverAppliedRequest: 'UNKNOWN'
    }) &&
    exact(packet.failureAndRecovery, {
      failClosed: true,
      partialProofMayAuthorize: false,
      retryRequiresSameRequestAndDeclarationDigests: true,
      noFoundationMutationOnFailure: true
    }) &&
    exact(packet.lifecycle, {
      status: 'CREATED_NOT_TRANSMITTED_RECIPIENT_UNRESOLVED',
      persisted: false,
      promoted: false,
      canon: false
    }) &&
    exact(packet.truth, {
      requestCreated: true,
      endpointResolved: false,
      recipientAuthenticated: false,
      transportPerformed: false,
      receiverReceiptObserved: false,
      providerIdentityAuthenticated: false,
      providerAvailable: false,
      nativeReceiptSchemaVerified: false,
      authorizationOrConsentVerified: false,
      evidenceAuthenticated: false,
      ownerOrDebitResolved: false,
      admissionAuthorized: false,
      worldMutationPerformed: false
    }) && index >= 0;
}

export function
landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationRequestBatchValid(
  batch, contract = null, source = null, options = null) {
  if (!digestValid(batch,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA) ||
      !exactKeys(batch, ['schema', 'status', 'sourceContract', 'sourceR122',
        'requestContext', 'packets', 'summary', 'prohibitedConclusions',
        'truth', 'digest']) ||
      !exactKeys(batch.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(batch.sourceR122, ['contract', 'preflight']) ||
      !Object.values(batch.sourceR122).every(ref => exactKeys(ref,
        ['schema', 'receiptDigest'])) ||
      !exactKeys(batch.requestContext, ['requestBatchId', 'requesterId',
        'requestedAt', 'expiresAt']) ||
      !Array.isArray(batch.packets) ||
      batch.packets.length > MAXIMUM_REQUEST_PACKETS ||
      !batch.packets.every((packet, index) =>
        packetShapeValid(packet, index, batch.requestContext)) ||
      !exactKeys(batch.summary, ['sourceBindingCount',
        'requestEligibleBindingCount', 'missingBindingCount',
        'rejectedBindingCount', 'ambiguousBindingCount',
        'requestPacketCount', 'endpointResolvedCount',
        'transmittedRequestCount', 'receiverReceiptCount',
        'independentlyVerifiedProviderCount',
        'operationallyReadyProviderCount', 'admissionReady']) ||
      batch.summary.sourceBindingCount !== 15 ||
      batch.summary.requestPacketCount !== batch.packets.length ||
      batch.summary.endpointResolvedCount !== 0 ||
      batch.summary.transmittedRequestCount !== 0 ||
      batch.summary.receiverReceiptCount !== 0 ||
      batch.summary.independentlyVerifiedProviderCount !== 0 ||
      batch.summary.operationallyReadyProviderCount !== 0 ||
      batch.summary.admissionReady !== false ||
      !exactKeys(batch.prohibitedConclusions,
        ['treatRequestAsIdentityProof', 'treatRequestAsAvailabilityProof',
          'treatRequestAsSchemaVerification',
          'treatRequestAsAuthorizationOrConsent',
          'inventEndpointOrRecipient',
          'claimTransportWithoutSenderAndReceiverReceipts',
          'admitEvidenceOwnerOrDebit', 'persistMutatePromoteOrCanonize']) ||
      !Object.values(batch.prohibitedConclusions).every(value =>
        value === true) ||
      !exact(batch.truth, {
        exactR122EligibleBindingsBound: true,
        onlyCompatibleUnverifiedBindingsRequested: true,
        requestBatchMayResolveEndpoint: false,
        requestBatchMayTransmit: false,
        requestBatchMayAuthenticateProviderEvidenceOrAuthority: false,
        historicalPhysicalSourceOwnersResolved: false,
        historicalPhysicalSourceOwnersDebited: false,
        admissionAuthorized: false,
        persistencePerformed: false,
        worldMutationPerformed: false
      }) ||
      ![EMPTY_BATCH_STATUS, REQUEST_BATCH_STATUS].includes(batch.status) ||
      new TextEncoder().encode(JSON.stringify(batch)).length >
        MAXIMUM_SERIALIZED_BATCH_BYTES) return false;
  if (contract === null && source === null && options === null) return true;
  return contract !== null && source !== null && options !== null &&
    requestSourceValid(source, contract) &&
    requestOptionsValid(options,
      source.r122Preflight.summary
        .contractCompatibleUnverifiedBindingCount) &&
    exact(batch, expectedBatch(contract, source, options));
}

export function
createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationRequestBatch(
  contract, source, options = {}) {
  const eligibleCount = source?.r122Preflight?.summary
    ?.contractCompatibleUnverifiedBindingCount;
  if (!requestSourceValid(source, contract) ||
      !requestOptionsValid(options, eligibleCount)) {
    throw new Error(
      'Provider-verification request batch needs the exact R123 contract, R122 binding source, and a bounded request window whenever eligible bindings exist');
  }
  const batch = expectedBatch(contract, source, options);
  if (new TextEncoder().encode(JSON.stringify(batch)).length >
      MAXIMUM_SERIALIZED_BATCH_BYTES) {
    throw new Error(
      'Provider-verification request batch exceeds the serialized resource ceiling');
  }
  return batch;
}

export function
matrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationRequestDescription() {
  return {
    status: 'EXPERIMENTAL',
    capabilityId:
      HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID,
    statement:
      'R123 converts exact R122 contract-compatible unverified bindings into bounded four-proof verification request packets while leaving the current empty inventory request-free and every provider operationally blocked.',
    boundaries: [
      'Each request demands independent provider identity, matched live sender and receiver availability receipts, native-schema validation, and exact authorization or consent.',
      'The request recipient and endpoint remain unresolved; packets are created but not transmitted or persisted.',
      'A request is not proof, authority, consent, provider availability, authenticated evidence, owner/debit closure, admission, promotion, canonization, or world mutation.'
    ]
  };
}
