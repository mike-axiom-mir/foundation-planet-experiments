import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_PREFLIGHT_SCHEMA,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionPreflightContractReceiptValid,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionPreflightValid
} from './matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolution-preflight.mjs?v=0.124.0-r124.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolution-verification-request-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_PROOF_REQUIREMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolution-verification-proof-requirement/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_PACKET_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolution-verification-request-packet/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_BATCH_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolution-verification-request-batch/v1';

export const
  HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID =
    'contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.endpoint-resolution.verification-request.create';

const CONTRACT_STATUS =
  'ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_CONTRACT_AVAILABLE';
const EMPTY_BATCH_STATUS =
  'NO_COMPATIBLE_ENDPOINT_CANDIDATES_VERIFICATION_REQUEST_BATCH_EMPTY';
const REQUEST_BATCH_STATUS =
  'ENDPOINT_RESOLUTION_VERIFICATION_REQUESTS_CREATED_NOT_TRANSMITTED';
const REQUIRED_RESOLVER_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.endpoint.resolve';
const NEXT_TRANSPORT_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.request.send-receive';
const MAXIMUM_REQUEST_PACKETS = 15;
const MAXIMUM_REQUEST_WINDOW_MS = 300000;
const MAXIMUM_CHALLENGE_BYTES = 4096;
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

function sourceValid(source, contract = null) {
  const valid = exactKeys(source, ['r124Contract', 'r124Preflight',
    'r124EndpointSource', 'r124EndpointDeclarations']) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionPreflightContractReceiptValid(
      source.r124Contract) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionPreflightValid(
      source.r124Preflight, source.r124Contract,
      source.r124EndpointSource, source.r124EndpointDeclarations);
  return valid && (contract === null ||
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionVerificationRequestContractReceiptValid(
      contract) && exact(contract.sourceR124, {
      contract: sourceRef(source.r124Contract),
      preflight: sourceRef(source.r124Preflight)
    }) && contract.projection.sourceEndpointCount ===
      source.r124Preflight.endpoints.length &&
    contract.projection.requestEligibleEndpointCount ===
      source.r124Preflight.summary.compatibleUnverifiedEndpointCount);
}

function custodyValid(custody) {
  return exactKeys(custody, ['r124Contract', 'r124Preflight',
    'r124EndpointSource', 'r124EndpointDeclarations', 'r124Custody']) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionPreflightContractReceiptValid(
      custody.r124Contract, custody.r124Custody) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionPreflightValid(
      custody.r124Preflight, custody.r124Contract,
      custody.r124EndpointSource, custody.r124EndpointDeclarations);
}

const expectedContractTruth = () => ({
  exactR124ContractPreflightDeclarationsAndCustodyBound: true,
  onlyCompatibleUnverifiedEndpointsMayCreateRequests: true,
  missingRejectedOrAmbiguousEndpointsMayCreateRequests: false,
  requestMayEstablishResolverIdentityOrAuthority: false,
  requestMayEstablishEndpointOwnership: false,
  requestMayAuthenticateRecipient: false,
  requestMayAuthorizeContact: false,
  requestMayIssueChallengeMaterial: false,
  endpointResolved: false,
  transportPerformed: false,
  receiverReceiptObserved: false,
  providerAvailable: false,
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
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    status: CONTRACT_STATUS,
    sourceR124: {
      contract: sourceRef(custody.r124Contract),
      preflight: sourceRef(custody.r124Preflight)
    },
    projection: {
      sourceEndpointCount: custody.r124Preflight.endpoints.length,
      requestEligibleEndpointCount: custody.r124Preflight.summary
        .compatibleUnverifiedEndpointCount,
      proofRequirementCountPerRequest: 5,
      proofRequirementSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
      requestPacketSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_PACKET_SCHEMA,
      requestBatchSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_BATCH_SCHEMA,
      requiredResolverCapabilityId: REQUIRED_RESOLVER_CAPABILITY_ID,
      nextTransportCapabilityId: NEXT_TRANSPORT_CAPABILITY_ID,
      implementedContractCapabilityId:
        HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID
    },
    resourceBudget: {
      maximumRequestPackets: MAXIMUM_REQUEST_PACKETS,
      maximumRequestWindowMs: MAXIMUM_REQUEST_WINDOW_MS,
      maximumChallengeBytes: MAXIMUM_CHALLENGE_BYTES,
      maximumSerializedBatchBytes: MAXIMUM_SERIALIZED_BATCH_BYTES
    },
    truth: expectedContractTruth()
  };
  receipt.digest = stableDigest(receipt);
  return receipt;
}

export function
landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionVerificationRequestContractReceiptValid(
  receipt, custody = null) {
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'sourceR124', 'projection',
        'resourceBudget', 'truth', 'digest']) ||
      !exactKeys(receipt.sourceR124, ['contract', 'preflight']) ||
      !Object.values(receipt.sourceR124).every(ref => exactKeys(ref,
        ['schema', 'receiptDigest'])) ||
      receipt.sourceR124.contract.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA ||
      receipt.sourceR124.preflight.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_PREFLIGHT_SCHEMA ||
      !exactKeys(receipt.projection, ['sourceEndpointCount',
        'requestEligibleEndpointCount', 'proofRequirementCountPerRequest',
        'proofRequirementSchema', 'requestPacketSchema',
        'requestBatchSchema', 'requiredResolverCapabilityId',
        'nextTransportCapabilityId', 'implementedContractCapabilityId']) ||
      !Number.isInteger(receipt.projection.sourceEndpointCount) ||
      receipt.projection.sourceEndpointCount < 0 ||
      receipt.projection.sourceEndpointCount > 15 ||
      !Number.isInteger(receipt.projection.requestEligibleEndpointCount) ||
      receipt.projection.requestEligibleEndpointCount < 0 ||
      receipt.projection.requestEligibleEndpointCount > 15 ||
      receipt.projection.proofRequirementCountPerRequest !== 5 ||
      receipt.projection.proofRequirementSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_PROOF_REQUIREMENT_SCHEMA ||
      receipt.projection.requestPacketSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_PACKET_SCHEMA ||
      receipt.projection.requestBatchSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_BATCH_SCHEMA ||
      receipt.projection.requiredResolverCapabilityId !==
        REQUIRED_RESOLVER_CAPABILITY_ID ||
      receipt.projection.nextTransportCapabilityId !==
        NEXT_TRANSPORT_CAPABILITY_ID ||
      receipt.projection.implementedContractCapabilityId !==
        HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID ||
      !exact(receipt.resourceBudget, {
        maximumRequestPackets: MAXIMUM_REQUEST_PACKETS,
        maximumRequestWindowMs: MAXIMUM_REQUEST_WINDOW_MS,
        maximumChallengeBytes: MAXIMUM_CHALLENGE_BYTES,
        maximumSerializedBatchBytes: MAXIMUM_SERIALIZED_BATCH_BYTES
      }) || receipt.status !== CONTRACT_STATUS ||
      !exact(receipt.truth, expectedContractTruth())) return false;
  return custody === null || custodyValid(custody) &&
    exact(receipt, expectedContract(custody));
}

export function
createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionVerificationRequestContractReceipt(
  custody) {
  if (!custodyValid(custody)) {
    throw new Error(
      'Endpoint-resolution verification request contract needs the exact R124 contract, preflight, declarations, endpoint source, and full custody');
  }
  return expectedContract(custody);
}

function requestOptionsValid(options, source) {
  const eligible = source.r124Preflight.endpoints.filter(endpoint =>
    endpoint.status === 'ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED');
  if (eligible.length === 0) return exactKeys(options, []);
  if (!exactKeys(options, ['requestBatchId', 'requesterId',
      'requestedAt', 'expiresAt']) ||
      !/^[a-z0-9][a-z0-9._-]{2,95}$/.test(options.requestBatchId || '') ||
      !/^[a-z0-9][a-z0-9._-]{2,95}$/.test(options.requesterId || '')) {
    return false;
  }
  const requestedAt = Date.parse(options.requestedAt);
  const expiresAt = Date.parse(options.expiresAt);
  if (!Number.isFinite(requestedAt) || !Number.isFinite(expiresAt) ||
      new Date(requestedAt).toISOString() !== options.requestedAt ||
      new Date(expiresAt).toISOString() !== options.expiresAt ||
      expiresAt <= requestedAt ||
      expiresAt - requestedAt > MAXIMUM_REQUEST_WINDOW_MS) return false;
  return eligible.every(endpoint => {
    const packet = source.r124EndpointSource.r123Batch.packets.find(item =>
      item.requestId === endpoint.requestId);
    return packet &&
      requestedAt >= Date.parse(packet.requestWindow.requestedAt) &&
      expiresAt <= Date.parse(packet.requestWindow.expiresAt);
  });
}

function proofRequirements(endpoint, sourcePacket) {
  return [
    {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
      ordinal: 1,
      proofId: 'INDEPENDENT_RESOLVER_IDENTITY_AND_AUTHORITY',
      claimClass: 'AUTHORIZATION',
      passCondition:
        'An independently trusted registry binds the exact resolver identity, authority scope, version, and request digest with allowed and denied identity probes.',
      primaryProofSurface:
        'INDEPENDENT_RESOLVER_IDENTITY_AND_AUTHORITY_RECEIPT',
      counterevidence:
        'Caller self-attestation, resolver-controlled registry, wrong scope, revocation, or missing denied-identity probe.'
    },
    {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
      ordinal: 2,
      proofId: 'ENDPOINT_OWNERSHIP_OR_ROUTE_CUSTODY',
      claimClass: 'AUTHORIZATION',
      passCondition: endpoint.claimedLocatorKind === 'HTTPS_URI'
        ? 'Independent evidence proves control of the exact HTTPS origin and bounded verification path without accepting caller or provider self-attestation.'
        : 'Independent authority evidence proves custody of the exact human-review or host-governance route.',
      primaryProofSurface: endpoint.claimedLocatorKind === 'HTTPS_URI'
        ? 'INDEPENDENT_HTTPS_ORIGIN_OWNERSHIP_RECEIPT'
        : 'INDEPENDENT_ROUTE_CUSTODY_RECEIPT',
      counterevidence:
        'Locator-only reachability, provider self-claim, origin or route mismatch, expired custody, or replay.'
    },
    {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
      ordinal: 3,
      proofId: 'RECIPIENT_IDENTITY_BINDING',
      claimClass: 'AUTHORIZATION',
      passCondition:
        'An independent identity source binds the claimed recipient to the exact provider, capability, locator, and request digest.',
      primaryProofSurface:
        'INDEPENDENT_RECIPIENT_IDENTITY_BINDING_RECEIPT',
      counterevidence:
        'Caller or provider self-claim, identity mismatch, revoked binding, wrong locator, or wrong request digest.'
    },
    {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
      ordinal: 4,
      proofId: 'CONTACT_AUTHORIZATION_OR_CONSENT',
      claimClass: 'AUTHORIZATION',
      passCondition:
        'The exact required authority seat issues an unrevoked, request-bound authorization or consent receipt before any endpoint, human, or host contact.',
      primaryProofSurface: sourcePacket.permissionsAndConsent
        .requiredAuthoritySeat === 'MIKE_TOBI_OR_AXM_REVIEW_SEAT'
        ? 'MIKE_TOBI_OR_APPOINTED_AXM_CONTACT_DECISION'
        : 'INDEPENDENT_CONTACT_AUTHORIZATION_OR_CONSENT_RECEIPT',
      counterevidence:
        'Caller policy, wrong seat, absent consent, scope mismatch, expiry, revocation, or contact before authorization.'
    },
    {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
      ordinal: 5,
      proofId: 'BOUNDED_LIVE_CHALLENGE_MATCHED_RECEIPTS',
      claimClass: 'TRANSPORT',
      passCondition:
        'After authority is verified, fresh bounded challenge material produces sender and receiver receipts tied to the exact request, locator, recipient, and payload digest.',
      primaryProofSurface:
        'MATCHED_CHALLENGE_SENDER_AND_RECEIVER_RECEIPTS',
      counterevidence:
        'Challenge material absent or replayed, send-only success, missing receiver receipt, timeout, identity mismatch, or payload digest mismatch.'
    }
  ];
}

function proofRequirementShapeValid(requirement, index) {
  return exactKeys(requirement, ['schema', 'ordinal', 'proofId',
    'claimClass', 'passCondition', 'primaryProofSurface',
    'counterevidence']) && requirement.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_PROOF_REQUIREMENT_SCHEMA &&
    requirement.ordinal === index + 1 &&
    [requirement.proofId, requirement.claimClass,
      requirement.passCondition, requirement.primaryProofSurface,
      requirement.counterevidence].every(value =>
      typeof value === 'string' && value.length > 0);
}

function expectedPacket(contract, source, endpoint, endpointIndex, options) {
  const declarationIndex = endpoint.declarationInputIndexes[0];
  const declaration = source.r124EndpointDeclarations[declarationIndex];
  const sourcePacket = source.r124EndpointSource.r123Batch.packets.find(item =>
    item.requestId === endpoint.requestId);
  const packet = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_PACKET_SCHEMA,
    requestId: options.requestBatchId + '.endpoint-' +
      String(endpointIndex + 1).padStart(2, '0'),
    sourceContract: sourceRef(contract),
    requestBinding: {
      sourcePreflight: sourceRef(source.r124Preflight),
      sourceEndpointIndex: endpointIndex,
      sourceEndpointDigest: stableDigest(endpoint),
      r123RequestId: endpoint.requestId,
      r123RequestPacketDigest: endpoint.requestPacketDigest,
      endpointDeclarationInputIndex: declarationIndex,
      endpointDeclarationDigest: declaration.digest
    },
    claimedRoute: {
      capabilityId: endpoint.capabilityId,
      providerId: endpoint.providerId,
      providerClass: endpoint.providerClass,
      locatorKind: endpoint.claimedLocatorKind,
      locatorValue: endpoint.claimedLocatorValue,
      locatorTrust: 'CALLER_SUPPLIED_UNVERIFIED',
      claimedRecipientId: endpoint.claimedRecipientId,
      recipientIdentityTrust: 'CALLER_SUPPLIED_UNTRUSTED'
    },
    requestWindow: {
      requestedAt: options.requestedAt,
      expiresAt: options.expiresAt,
      maximumDurationMs: MAXIMUM_REQUEST_WINDOW_MS
    },
    requester: {
      requesterId: options.requesterId,
      authorityStatus: 'REQUEST_CREATOR_ONLY_NOT_RESOLVER_AUTHORITY'
    },
    resolverRecipient: {
      status: 'UNRESOLVED',
      resolverId: null,
      resolverEndpoint: null,
      resolverIdentity: null,
      requiredCapabilityId: REQUIRED_RESOLVER_CAPABILITY_ID
    },
    proofRequirements: proofRequirements(endpoint, sourcePacket),
    challengePlan: {
      status: 'CHALLENGE_MATERIAL_NOT_ISSUED',
      challengeNonce: null,
      maximumChallengeBytes: MAXIMUM_CHALLENGE_BYTES,
      freshMaterialRequired: true,
      matchedSenderAndReceiverReceiptsRequired: true,
      replayRejected: true
    },
    permissionsAndConsent: {
      requiredAuthoritySeat:
        sourcePacket.permissionsAndConsent.requiredAuthoritySeat,
      requestMaySelfAuthorizeContact: false,
      resolverMayContactBeforeAuthorityReceipt: false,
      requestMayGrantConsent: false,
      mikeTobiPromotionGatePreserved: true
    },
    transport: {
      status: 'NOT_TRANSMITTED',
      senderReceipt: null,
      receiverReceipt: null,
      receiverAppliedRequest: 'UNKNOWN'
    },
    failureAndRecovery: {
      failClosed: true,
      partialProofMayResolveEndpoint: false,
      retryRequiresSameRequestEndpointAndDeclarationDigests: true,
      noFoundationMutationOnFailure: true
    },
    lifecycle: {
      status:
        'CREATED_NOT_TRANSMITTED_RESOLVER_RECIPIENT_UNRESOLVED',
      persisted: false,
      promoted: false,
      canon: false
    },
    truth: {
      requestCreated: true,
      challengeMaterialIssued: false,
      resolverIdentityAuthenticated: false,
      resolverAuthorityVerified: false,
      endpointResolved: false,
      endpointOwnershipVerified: false,
      recipientIdentityAuthenticated: false,
      contactAuthorized: false,
      contactPerformed: false,
      transportPerformed: false,
      receiverReceiptObserved: false,
      providerReady: false,
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
  const eligible = source.r124Preflight.endpoints
    .map((endpoint, index) => ({ endpoint, index }))
    .filter(item => item.endpoint.status ===
      'ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED');
  const packets = eligible.map(item => expectedPacket(contract, source,
    item.endpoint, item.index, options));
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_BATCH_SCHEMA,
    status: packets.length === 0 ? EMPTY_BATCH_STATUS : REQUEST_BATCH_STATUS,
    sourceContract: sourceRef(contract),
    sourceR124: {
      contract: sourceRef(source.r124Contract),
      preflight: sourceRef(source.r124Preflight)
    },
    requestContext: packets.length === 0 ? {
      requestBatchId: null,
      requesterId: null,
      requestedAt: null,
      expiresAt: null
    } : clone(options),
    packets,
    summary: {
      sourceEndpointCount: source.r124Preflight.endpoints.length,
      requestEligibleEndpointCount: eligible.length,
      missingEndpointCount: source.r124Preflight.summary.missingEndpointCount,
      rejectedEndpointCount:
        source.r124Preflight.summary.rejectedEndpointCount,
      ambiguousEndpointCount:
        source.r124Preflight.summary.ambiguousEndpointCount,
      requestPacketCount: packets.length,
      proofRequirementCount: packets.length * 5,
      challengeMaterialIssuedCount: 0,
      resolverRecipientResolvedCount: 0,
      resolverIdentityAuthenticatedCount: 0,
      resolverAuthorityVerifiedCount: 0,
      endpointResolvedCount: 0,
      endpointOwnershipVerifiedCount: 0,
      recipientAuthenticatedCount: 0,
      contactAuthorizedCount: 0,
      contactPerformedCount: 0,
      transmittedRequestCount: 0,
      receiverReceiptCount: 0,
      operationallyReadyProviderCount: 0,
      admissionReady: false
    },
    prohibitedConclusions: {
      treatRequestAsResolverIdentityOrAuthority: true,
      treatRequestAsEndpointOwnershipOrResolution: true,
      treatRequestAsRecipientAuthentication: true,
      treatRequestAsContactAuthorizationOrConsent: true,
      issueOrInventChallengeMaterial: true,
      contactEndpointHumanOrHost: true,
      claimTransportWithoutMatchedReceipts: true,
      admitEvidenceOwnerOrDebit: true,
      persistMutatePromoteOrCanonize: true
    },
    truth: {
      exactR124EligibleEndpointsBound: true,
      onlyCompatibleUnverifiedEndpointsRequested: true,
      challengeMaterialIssued: false,
      resolverRecipientResolved: false,
      endpointResolutionPerformed: false,
      contactAuthorizedOrPerformed: false,
      transportPerformed: false,
      providerVerificationPerformed: false,
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

function packetShapeValid(packet, context) {
  return digestValid(packet,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_PACKET_SCHEMA) &&
    exactKeys(packet, ['schema', 'requestId', 'sourceContract',
      'requestBinding', 'claimedRoute', 'requestWindow', 'requester',
      'resolverRecipient', 'proofRequirements', 'challengePlan',
      'permissionsAndConsent', 'transport', 'failureAndRecovery',
      'lifecycle', 'truth', 'digest']) &&
    typeof packet.requestId === 'string' &&
    packet.requestId === context.requestBatchId + '.endpoint-' +
      String(packet.requestBinding.sourceEndpointIndex + 1).padStart(2, '0') &&
    exactKeys(packet.sourceContract, ['schema', 'receiptDigest']) &&
    exactKeys(packet.requestBinding, ['sourcePreflight',
      'sourceEndpointIndex', 'sourceEndpointDigest', 'r123RequestId',
      'r123RequestPacketDigest', 'endpointDeclarationInputIndex',
      'endpointDeclarationDigest']) &&
    exactKeys(packet.requestBinding.sourcePreflight,
      ['schema', 'receiptDigest']) &&
    Number.isInteger(packet.requestBinding.sourceEndpointIndex) &&
    packet.requestBinding.sourceEndpointIndex >= 0 &&
    packet.requestBinding.sourceEndpointIndex < 15 &&
    Number.isInteger(packet.requestBinding.endpointDeclarationInputIndex) &&
    packet.requestBinding.endpointDeclarationInputIndex >= 0 &&
    packet.requestBinding.endpointDeclarationInputIndex < 30 &&
    exactKeys(packet.claimedRoute, ['capabilityId', 'providerId',
      'providerClass', 'locatorKind', 'locatorValue', 'locatorTrust',
      'claimedRecipientId', 'recipientIdentityTrust']) &&
    [packet.claimedRoute.capabilityId, packet.claimedRoute.providerId,
      packet.claimedRoute.providerClass, packet.claimedRoute.locatorKind,
      packet.claimedRoute.locatorValue,
      packet.claimedRoute.claimedRecipientId].every(value =>
      typeof value === 'string' && value.length > 0) &&
    packet.claimedRoute.locatorTrust === 'CALLER_SUPPLIED_UNVERIFIED' &&
    packet.claimedRoute.recipientIdentityTrust ===
      'CALLER_SUPPLIED_UNTRUSTED' &&
    exact(packet.requestWindow, {
      requestedAt: context.requestedAt,
      expiresAt: context.expiresAt,
      maximumDurationMs: MAXIMUM_REQUEST_WINDOW_MS
    }) && exactKeys(packet.requester, ['requesterId', 'authorityStatus']) &&
    packet.requester.requesterId === context.requesterId &&
    packet.requester.authorityStatus ===
      'REQUEST_CREATOR_ONLY_NOT_RESOLVER_AUTHORITY' &&
    exact(packet.resolverRecipient, {
      status: 'UNRESOLVED',
      resolverId: null,
      resolverEndpoint: null,
      resolverIdentity: null,
      requiredCapabilityId: REQUIRED_RESOLVER_CAPABILITY_ID
    }) && Array.isArray(packet.proofRequirements) &&
    packet.proofRequirements.length === 5 &&
    packet.proofRequirements.every(proofRequirementShapeValid) &&
    exact(packet.challengePlan, {
      status: 'CHALLENGE_MATERIAL_NOT_ISSUED',
      challengeNonce: null,
      maximumChallengeBytes: MAXIMUM_CHALLENGE_BYTES,
      freshMaterialRequired: true,
      matchedSenderAndReceiverReceiptsRequired: true,
      replayRejected: true
    }) && exactKeys(packet.permissionsAndConsent,
      ['requiredAuthoritySeat', 'requestMaySelfAuthorizeContact',
        'resolverMayContactBeforeAuthorityReceipt', 'requestMayGrantConsent',
        'mikeTobiPromotionGatePreserved']) &&
    typeof packet.permissionsAndConsent.requiredAuthoritySeat === 'string' &&
    packet.permissionsAndConsent.requestMaySelfAuthorizeContact === false &&
    packet.permissionsAndConsent
      .resolverMayContactBeforeAuthorityReceipt === false &&
    packet.permissionsAndConsent.requestMayGrantConsent === false &&
    packet.permissionsAndConsent.mikeTobiPromotionGatePreserved === true &&
    exact(packet.transport, {
      status: 'NOT_TRANSMITTED',
      senderReceipt: null,
      receiverReceipt: null,
      receiverAppliedRequest: 'UNKNOWN'
    }) && exact(packet.failureAndRecovery, {
      failClosed: true,
      partialProofMayResolveEndpoint: false,
      retryRequiresSameRequestEndpointAndDeclarationDigests: true,
      noFoundationMutationOnFailure: true
    }) && exact(packet.lifecycle, {
      status: 'CREATED_NOT_TRANSMITTED_RESOLVER_RECIPIENT_UNRESOLVED',
      persisted: false,
      promoted: false,
      canon: false
    }) && exact(packet.truth, {
      requestCreated: true,
      challengeMaterialIssued: false,
      resolverIdentityAuthenticated: false,
      resolverAuthorityVerified: false,
      endpointResolved: false,
      endpointOwnershipVerified: false,
      recipientIdentityAuthenticated: false,
      contactAuthorized: false,
      contactPerformed: false,
      transportPerformed: false,
      receiverReceiptObserved: false,
      providerReady: false,
      evidenceAuthenticated: false,
      ownerOrDebitResolved: false,
      admissionAuthorized: false,
      worldMutationPerformed: false
    });
}

export function
landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionVerificationRequestBatchValid(
  batch, contract = null, source = null, options = null) {
  const zeroKeys = ['challengeMaterialIssuedCount',
    'resolverRecipientResolvedCount', 'resolverIdentityAuthenticatedCount',
    'resolverAuthorityVerifiedCount', 'endpointResolvedCount',
    'endpointOwnershipVerifiedCount', 'recipientAuthenticatedCount',
    'contactAuthorizedCount', 'contactPerformedCount',
    'transmittedRequestCount', 'receiverReceiptCount',
    'operationallyReadyProviderCount'];
  if (!digestValid(batch,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_BATCH_SCHEMA) ||
      !exactKeys(batch, ['schema', 'status', 'sourceContract', 'sourceR124',
        'requestContext', 'packets', 'summary', 'prohibitedConclusions',
        'truth', 'digest']) ||
      !exactKeys(batch.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(batch.sourceR124, ['contract', 'preflight']) ||
      !Object.values(batch.sourceR124).every(ref => exactKeys(ref,
        ['schema', 'receiptDigest'])) ||
      !exactKeys(batch.requestContext, ['requestBatchId', 'requesterId',
        'requestedAt', 'expiresAt']) || !Array.isArray(batch.packets) ||
      batch.packets.length > MAXIMUM_REQUEST_PACKETS ||
      !batch.packets.every(packet =>
        packetShapeValid(packet, batch.requestContext)) ||
      !exactKeys(batch.summary, ['sourceEndpointCount',
        'requestEligibleEndpointCount', 'missingEndpointCount',
        'rejectedEndpointCount', 'ambiguousEndpointCount',
        'requestPacketCount', 'proofRequirementCount', ...zeroKeys,
        'admissionReady']) ||
      !Number.isInteger(batch.summary.sourceEndpointCount) ||
      batch.summary.sourceEndpointCount < 0 ||
      batch.summary.sourceEndpointCount > 15 ||
      !Number.isInteger(batch.summary.requestEligibleEndpointCount) ||
      batch.summary.requestEligibleEndpointCount < 0 ||
      batch.summary.requestEligibleEndpointCount > 15 ||
      !Number.isInteger(batch.summary.missingEndpointCount) ||
      !Number.isInteger(batch.summary.rejectedEndpointCount) ||
      !Number.isInteger(batch.summary.ambiguousEndpointCount) ||
      batch.summary.requestPacketCount !== batch.packets.length ||
      batch.summary.requestEligibleEndpointCount !== batch.packets.length ||
      batch.summary.proofRequirementCount !== batch.packets.length * 5 ||
      !zeroKeys.every(key => batch.summary[key] === 0) ||
      batch.summary.admissionReady !== false ||
      !exactKeys(batch.prohibitedConclusions,
        ['treatRequestAsResolverIdentityOrAuthority',
          'treatRequestAsEndpointOwnershipOrResolution',
          'treatRequestAsRecipientAuthentication',
          'treatRequestAsContactAuthorizationOrConsent',
          'issueOrInventChallengeMaterial', 'contactEndpointHumanOrHost',
          'claimTransportWithoutMatchedReceipts', 'admitEvidenceOwnerOrDebit',
          'persistMutatePromoteOrCanonize']) ||
      !Object.values(batch.prohibitedConclusions).every(value =>
        value === true) || !exact(batch.truth, {
      exactR124EligibleEndpointsBound: true,
      onlyCompatibleUnverifiedEndpointsRequested: true,
      challengeMaterialIssued: false,
      resolverRecipientResolved: false,
      endpointResolutionPerformed: false,
      contactAuthorizedOrPerformed: false,
      transportPerformed: false,
      providerVerificationPerformed: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      admissionAuthorized: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }) || ![EMPTY_BATCH_STATUS, REQUEST_BATCH_STATUS].includes(batch.status) ||
      (batch.status === EMPTY_BATCH_STATUS
        ? batch.packets.length === 0 &&
          Object.values(batch.requestContext).every(value => value === null)
        : batch.packets.length > 0 &&
          Object.values(batch.requestContext).every(value =>
            typeof value === 'string')) !== true ||
      new TextEncoder().encode(JSON.stringify(batch)).length >
        MAXIMUM_SERIALIZED_BATCH_BYTES) return false;
  if (contract === null && source === null && options === null) return true;
  return contract !== null && source !== null && options !== null &&
    sourceValid(source, contract) && requestOptionsValid(options, source) &&
    exact(batch, expectedBatch(contract, source, options));
}

export function
createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionVerificationRequestBatch(
  contract, source, options = {}) {
  if (!sourceValid(source, contract) ||
      !requestOptionsValid(options, source)) {
    throw new Error(
      'Endpoint-resolution verification request batch needs the exact R125 contract, R124 endpoint source, and a bounded request window whenever compatible candidates exist');
  }
  const batch = expectedBatch(contract, source, options);
  if (new TextEncoder().encode(JSON.stringify(batch)).length >
      MAXIMUM_SERIALIZED_BATCH_BYTES) {
    throw new Error(
      'Endpoint-resolution verification request batch exceeds its resource ceiling');
  }
  return batch;
}

export function
matrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionVerificationRequestDescription() {
  return {
    status: 'EXPERIMENTAL',
    capabilityId:
      HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID,
    statement:
      'R125 converts exact R124 compatible-unverified endpoint candidates into bounded five-proof resolver-verification requests while issuing no challenge material and performing no contact or transport.',
    boundaries: [
      'The current real R124 endpoint preflight is empty, so the current verification-request batch is empty.',
      'Each request demands independent resolver identity and authority, endpoint ownership or route custody, recipient identity, contact authorization or consent, and matched live-challenge receipts.',
      'No resolver recipient, challenge material, endpoint resolution, contact, transport, provider verification, evidence admission, persistence, promotion, canonization, or world mutation is produced.'
    ]
  };
}
