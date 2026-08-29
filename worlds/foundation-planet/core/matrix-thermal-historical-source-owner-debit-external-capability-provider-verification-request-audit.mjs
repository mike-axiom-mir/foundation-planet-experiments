import {
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderBindingPreflightContractReceiptValid,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderBindingPreflightValid
} from './matrix-thermal-historical-source-owner-debit-external-capability-provider-binding-preflight.mjs?v=0.122.0-r122.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_PACKET_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA,
  HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID
} from './matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-request.mjs?v=0.123.0-r123.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_AUDIT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-request-audit/v1';

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
      sourceSpecificationCount: 15,
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
    truth: {
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
      sourceBindingCount: 15,
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

export function
auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationRequest(
  contract, batch, custody, options = {}) {
  const exactCustody = custodyValid(custody);
  const expectedContractValue = exactCustody
    ? expectedContract(custody) : null;
  const contractExact = expectedContractValue !== null &&
    exact(contract, expectedContractValue);
  const source = exactCustody ? {
    r122Contract: custody.r122Contract,
    r122Preflight: custody.r122Preflight,
    r122BindingSource: custody.r122BindingSource,
    r122Declarations: custody.r122Declarations
  } : null;
  const eligibleCount = exactCustody
    ? custody.r122Preflight.summary
      .contractCompatibleUnverifiedBindingCount : -1;
  const optionsExact = exactCustody &&
    requestOptionsValid(options, eligibleCount);
  const expectedBatchValue = contractExact && optionsExact
    ? expectedBatch(expectedContractValue, source, options) : null;
  const batchExact = expectedBatchValue !== null &&
    exact(batch, expectedBatchValue);
  const checks = {
    exactR122CustodyValid: exactCustody,
    contractIndependentlyReconstructed: contractExact,
    requestWindowAndIdentityBound: batchExact && (eligibleCount === 0 ||
      batch.requestContext.requestBatchId === options.requestBatchId &&
      batch.requestContext.requesterId === options.requesterId &&
      batch.requestContext.requestedAt === options.requestedAt &&
      batch.requestContext.expiresAt === options.expiresAt),
    onlyCompatibleUnverifiedBindingsRequested: batchExact &&
      batch.packets.length === eligibleCount,
    fourProofRequirementsIndependentlyReconstructed: batchExact &&
      batch.packets.every(packet =>
        packet.proofRequirements.length === 4),
    recipientsAndEndpointsRemainUnresolved: batchExact &&
      batch.packets.every(packet =>
        packet.recipient.status === 'UNRESOLVED' &&
        packet.recipient.endpoint === null &&
        packet.recipient.recipientIdentity === null),
    noTransportOrReceiverReceiptClaimed: batchExact &&
      batch.packets.every(packet =>
        packet.transport.status === 'NOT_TRANSMITTED' &&
        packet.transport.senderReceipt === null &&
        packet.transport.receiverReceipt === null),
    providerReadinessAndAdmissionRemainZero: batchExact &&
      batch.summary.independentlyVerifiedProviderCount === 0 &&
      batch.summary.operationallyReadyProviderCount === 0 &&
      batch.summary.admissionReady === false,
    prohibitedConclusionsFailClosed: batchExact &&
      Object.values(batch.prohibitedConclusions).every(value =>
        value === true),
    batchIndependentlyReconstructed: batchExact
  };
  const pass = Object.values(checks).every(value => value === true);
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_AUDIT_SCHEMA,
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
        ? batch.packets.reduce((count, packet) =>
          count + packet.proofRequirements.length, 0) : 0,
      transmittedRequestCount: 0,
      receiverReceiptCount: 0,
      operationallyReadyProviderCount: 0
    },
    truth: {
      auditReconstructedR123WithoutCallingR123BuildersOrValidators: true,
      auditMayResolveEndpointAuthenticateRecipientOrTransmit: false,
      auditMayAuthenticateProviderEvidenceAuthorityOrConsent: false,
      auditMayResolveHistoricalOwnersOrDebits: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  };
}
