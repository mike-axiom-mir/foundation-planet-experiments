import {
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionPreflightContractReceiptValid,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionPreflightValid
} from './matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolution-preflight.mjs?v=0.124.0-r124.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_PROOF_REQUIREMENT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_PACKET_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_BATCH_SCHEMA,
  HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_CREATE_CAPABILITY_ID
} from './matrix-thermal-provider-endpoint-resolution-verification-request.mjs?v=0.125.0-r125.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_AUDIT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolution-verification-request-audit/v1';

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
  return exactKeys(custody, ['r124Contract', 'r124Preflight',
    'r124EndpointSource', 'r124EndpointDeclarations', 'r124Custody']) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionPreflightContractReceiptValid(
      custody.r124Contract, custody.r124Custody) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionPreflightValid(
      custody.r124Preflight, custody.r124Contract,
      custody.r124EndpointSource, custody.r124EndpointDeclarations);
}

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
    truth: {
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
    }
  };
  receipt.digest = stableDigest(receipt);
  return receipt;
}

function requestOptionsValid(options, custody) {
  const eligible = custody.r124Preflight.endpoints.filter(endpoint =>
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
    const packet = custody.r124EndpointSource.r123Batch.packets.find(item =>
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

function expectedPacket(contract, custody, endpoint, endpointIndex, options) {
  const declarationIndex = endpoint.declarationInputIndexes[0];
  const declaration = custody.r124EndpointDeclarations[declarationIndex];
  const sourcePacket = custody.r124EndpointSource.r123Batch.packets.find(item =>
    item.requestId === endpoint.requestId);
  const packet = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_PACKET_SCHEMA,
    requestId: options.requestBatchId + '.endpoint-' +
      String(endpointIndex + 1).padStart(2, '0'),
    sourceContract: sourceRef(contract),
    requestBinding: {
      sourcePreflight: sourceRef(custody.r124Preflight),
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

function expectedBatch(contract, custody, options) {
  const eligible = custody.r124Preflight.endpoints
    .map((endpoint, index) => ({ endpoint, index }))
    .filter(item => item.endpoint.status ===
      'ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED');
  const packets = eligible.map(item => expectedPacket(contract, custody,
    item.endpoint, item.index, options));
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_BATCH_SCHEMA,
    status: packets.length === 0 ? EMPTY_BATCH_STATUS : REQUEST_BATCH_STATUS,
    sourceContract: sourceRef(contract),
    sourceR124: {
      contract: sourceRef(custody.r124Contract),
      preflight: sourceRef(custody.r124Preflight)
    },
    requestContext: packets.length === 0 ? {
      requestBatchId: null,
      requesterId: null,
      requestedAt: null,
      expiresAt: null
    } : JSON.parse(JSON.stringify(options)),
    packets,
    summary: {
      sourceEndpointCount: custody.r124Preflight.endpoints.length,
      requestEligibleEndpointCount: eligible.length,
      missingEndpointCount:
        custody.r124Preflight.summary.missingEndpointCount,
      rejectedEndpointCount:
        custody.r124Preflight.summary.rejectedEndpointCount,
      ambiguousEndpointCount:
        custody.r124Preflight.summary.ambiguousEndpointCount,
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

export function
auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionVerificationRequest(
  contract, batch, custody, options = {}) {
  const exactCustody = custodyValid(custody);
  const expectedContractValue = exactCustody ? expectedContract(custody) : null;
  const contractExact = expectedContractValue !== null &&
    exact(contract, expectedContractValue);
  const optionsExact = exactCustody && requestOptionsValid(options, custody);
  const expectedBatchValue = contractExact && optionsExact
    ? expectedBatch(expectedContractValue, custody, options) : null;
  const batchExact = expectedBatchValue !== null &&
    new TextEncoder().encode(JSON.stringify(expectedBatchValue)).length <=
      MAXIMUM_SERIALIZED_BATCH_BYTES &&
    exact(batch, expectedBatchValue);
  const checks = {
    exactR124CustodyValid: exactCustody,
    contractIndependentlyReconstructed: contractExact,
    requestWindowBoundInsideR123Window: batchExact,
    onlyCompatibleUnverifiedEndpointsRequested: batchExact &&
      batch.packets.length === contract.projection.requestEligibleEndpointCount,
    fiveProofRequirementsIndependentlyReconstructed: batchExact &&
      batch.packets.every(packet => packet.proofRequirements.length === 5),
    resolverRecipientsAndChallengeMaterialRemainUnresolved: batchExact &&
      batch.packets.every(packet =>
        packet.resolverRecipient.status === 'UNRESOLVED' &&
        packet.resolverRecipient.resolverId === null &&
        packet.resolverRecipient.resolverEndpoint === null &&
        packet.challengePlan.challengeNonce === null),
    noContactTransportOrReceiverReceiptClaimed: batchExact &&
      batch.summary.contactAuthorizedCount === 0 &&
      batch.summary.contactPerformedCount === 0 &&
      batch.summary.transmittedRequestCount === 0 &&
      batch.summary.receiverReceiptCount === 0,
    endpointProviderReadinessAndAdmissionRemainZero: batchExact &&
      batch.summary.endpointResolvedCount === 0 &&
      batch.summary.operationallyReadyProviderCount === 0 &&
      batch.summary.admissionReady === false,
    prohibitedConclusionsFailClosed: batchExact &&
      Object.values(batch.prohibitedConclusions).every(value => value === true),
    batchIndependentlyReconstructed: batchExact
  };
  const pass = Object.values(checks).every(value => value === true);
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_AUDIT_SCHEMA,
    status: pass ? 'PASS' : 'FAIL',
    checks,
    detail: {
      sourceEndpointCount: batchExact
        ? batch.summary.sourceEndpointCount : 0,
      requestEligibleEndpointCount: batchExact
        ? batch.summary.requestEligibleEndpointCount : 0,
      requestPacketCount: batchExact
        ? batch.summary.requestPacketCount : 0,
      proofRequirementCount: batchExact
        ? batch.summary.proofRequirementCount : 0,
      challengeMaterialIssuedCount: 0,
      resolverRecipientResolvedCount: 0,
      endpointResolvedCount: 0,
      contactAuthorizedCount: 0,
      contactPerformedCount: 0,
      transmittedRequestCount: 0,
      receiverReceiptCount: 0,
      operationallyReadyProviderCount: 0
    },
    truth: {
      auditReconstructedR125WithoutCallingR125BuildersOrValidators: true,
      auditMayIssueChallengeMaterialOrResolveResolverRecipient: false,
      auditMayResolveEndpointAuthenticateRecipientOrAuthorizeContact: false,
      auditMayContactEndpointHumanOrHost: false,
      auditMayTransmitOrClaimReceiverReceipt: false,
      auditMayAuthenticateProviderEvidenceAuthorityOrConsent: false,
      auditMayResolveHistoricalOwnersOrDebits: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  };
}
