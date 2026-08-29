import {
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA,
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA,
  landMatrixThermalVerifierRouteProviderTrustBootstrapRecursionPreflightContractReceiptValid,
  landMatrixThermalVerifierRouteProviderTrustBootstrapRecursionWitnessValid,
  landMatrixThermalVerifierRouteProviderTrustBootstrapClosurePreflightValid
} from './matrix-thermal-verifier-route-provider-trust-bootstrap-recursion-preflight.mjs?v=0.135.0-r135.1';

export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_REQUEST_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-request-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_CRITERION_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-criterion/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_REQUEST_PACKET_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-request-packet/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_REQUEST_BATCH_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-request-batch/v1';

export const
  VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_REQUEST_CREATE_CAPABILITY_ID =
    'authority.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.request.create';
export const
  VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECIDE_CAPABILITY_ID =
    'authority.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decide';

const CONTRACT_STATUS =
  'OUT_OF_BAND_VERIFIER_ROUTE_AUTHORITY_DESIGNATION_REQUEST_CONTRACT_AVAILABLE';
const EMPTY_STATUS =
  'NO_BLOCKED_VERIFIER_ROUTE_PROVIDER_TRUST_BOOTSTRAP_CLOSURES_REQUEST_BATCH_EMPTY';
const REQUEST_STATUS =
  'OUT_OF_BAND_VERIFIER_ROUTE_AUTHORITY_DESIGNATION_REQUESTS_CREATED_NOT_TRANSMITTED_NOT_AUTHORIZED';
const PACKET_STATUS =
  'PENDING_MIKE_TOBI_AXM_HOST_AUTHORITY_DECISION_PROPOSAL_ONLY';
const REVIEW_SEAT_ID = 'axm-host-authority-review-seat';
const MAXIMUM_REQUEST_PACKETS = 2;
const DECISION_CRITERIA_PER_PACKET = 5;
const EVIDENCE_REQUIREMENTS_PER_PACKET = 7;
const MAXIMUM_REQUEST_WINDOW_MS = 300000;
const MAXIMUM_SERIALIZED_BATCH_BYTES = 524288;
const clone = value => JSON.parse(JSON.stringify(value));
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const exactKeys = (value, keys) => value && typeof value === 'object' &&
  !Array.isArray(value) && exact(Object.keys(value).sort(), [...keys].sort());
const identifierValid = value => typeof value === 'string' &&
  /^[a-z0-9][a-z0-9._:-]{2,191}$/.test(value);

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

function boundaryValid(boundary) {
  return exactKeys(boundary, ['r135Contract', 'r135Witness', 'r135Preflight',
    'r135Boundary']) &&
    landMatrixThermalVerifierRouteProviderTrustBootstrapRecursionPreflightContractReceiptValid(
      boundary.r135Contract, boundary.r135Boundary) &&
    landMatrixThermalVerifierRouteProviderTrustBootstrapRecursionWitnessValid(
      boundary.r135Witness, boundary.r135Contract, boundary.r135Boundary) &&
    landMatrixThermalVerifierRouteProviderTrustBootstrapClosurePreflightValid(
      boundary.r135Preflight, boundary.r135Contract, boundary.r135Witness,
      boundary.r135Boundary);
}

const eligibleClosures = boundary => boundary.r135Preflight.routeClosures.filter(
  closure => closure.status ===
    'BLOCKED_EXTERNAL_AUTHORITY_ANCHORED_VERIFIER_ROUTE_AND_NATIVE_RECEIPTS_REQUIRED' &&
    closure.automaticContinuationAllowed === false);

function expectedContract(boundary) {
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    status: CONTRACT_STATUS,
    sourceR135: {
      contract: sourceRef(boundary.r135Contract),
      witness: sourceRef(boundary.r135Witness),
      closurePreflight: sourceRef(boundary.r135Preflight)
    },
    projection: {
      sourceCompatibleRouteCount:
        boundary.r135Witness.summary.sourceCompatibleRouteCount,
      eligibleBlockedClosureCount: eligibleClosures(boundary).length,
      decisionCriterionSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_CRITERION_SCHEMA,
      requestPacketSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_REQUEST_PACKET_SCHEMA,
      requestBatchSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_REQUEST_BATCH_SCHEMA,
      requestedReviewSeatId: REVIEW_SEAT_ID,
      implementedRequestCapabilityId:
        VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_REQUEST_CREATE_CAPABILITY_ID,
      requiredDecisionCapabilityId:
        VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECIDE_CAPABILITY_ID
    },
    resourceBudget: {
      maximumRequestPackets: MAXIMUM_REQUEST_PACKETS,
      decisionCriteriaPerPacket: DECISION_CRITERIA_PER_PACKET,
      evidenceRequirementsPerPacket: EVIDENCE_REQUIREMENTS_PER_PACKET,
      maximumRequestWindowMs: MAXIMUM_REQUEST_WINDOW_MS,
      maximumSerializedBatchBytes: MAXIMUM_SERIALIZED_BATCH_BYTES
    },
    truth: {
      exactR135ContractWitnessPreflightAndBoundaryBound: true,
      eligibleBlockedClosuresMayCreateDesignationRequests: true,
      requestMayAuthenticateAuthoritySeat: false,
      requestMayDesignateOrAuthorizeRoute: false,
      requestMayVerifyRouteProvidersOrDependencyGraph: false,
      requestMayAuthorizeContactOrTransport: false,
      requestTransmitted: false,
      authorityDecisionObserved: false,
      designationReceiptObserved: false,
      endpointResolved: false,
      recipientAuthenticated: false,
      transportPerformed: false,
      providerVerified: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      evidenceAdmitted: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  });
}

export function
createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationRequestContractReceipt(
  boundary) {
  if (!boundaryValid(boundary)) {
    throw new Error('R136 designation-request contract needs the exact R135 boundary');
  }
  return expectedContract(boundary);
}

export function
landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationRequestContractReceiptValid(
  contract, boundary) {
  return boundaryValid(boundary) && exact(contract, expectedContract(boundary));
}

function optionsValid(options, activeCount) {
  if (activeCount === 0) return exact(options, {});
  if (!exactKeys(options, ['requestBatchId', 'requesterId', 'requestedAt',
      'expiresAt']) || !identifierValid(options.requestBatchId) ||
      !identifierValid(options.requesterId)) return false;
  const requestedAt = Date.parse(options.requestedAt);
  const expiresAt = Date.parse(options.expiresAt);
  return Number.isFinite(requestedAt) && Number.isFinite(expiresAt) &&
    new Date(requestedAt).toISOString() === options.requestedAt &&
    new Date(expiresAt).toISOString() === options.expiresAt &&
    expiresAt > requestedAt &&
    expiresAt - requestedAt <= MAXIMUM_REQUEST_WINDOW_MS;
}

function expectedDecisionCriteria(route) {
  const criteria = [
    {
      criterionId: 'EXACT_R135_R134_ROUTE_AND_DECLARATION_BINDING',
      requiredEvidence:
        'REPLAY_EXACT_R135_CLOSURE_WITNESS_ROUTE_R134_ROUTE_AND_DECLARATION_DIGESTS'
    },
    {
      criterionId: 'INDEPENDENT_AUTHORITY_SEAT_IDENTITY_SCOPE_AND_DENIAL_PROBES',
      requiredEvidence:
        'AUTHENTICATED_ALLOWED_AND_DENIED_SEAT_PROBES_PROVE_EXACT_DECISION_SCOPE'
    },
    {
      criterionId: 'CANDIDATE_AND_ROUTE_PROVIDER_NON_CONTROL',
      requiredEvidence:
        'INDEPENDENT_CONTROL_AND_BENEFICIAL_OWNERSHIP_EVIDENCE_EXCLUDES_CANDIDATE_AND_ALL_THREE_ROUTE_PROVIDERS'
    },
    {
      criterionId: 'DESIGNATION_DOES_NOT_VERIFY_OR_AUTHORIZE_OPERATION',
      requiredEvidence:
        'DECISION_EXPLICITLY_PRESERVES_ALL_R135_PROVIDER_ENDPOINT_CONTACT_TRANSPORT_AND_RECEIPT_OBLIGATIONS'
    },
    {
      criterionId: 'BOUNDED_EXPIRY_REVOCATION_AND_DENIAL_DEFAULT',
      requiredEvidence:
        'DECISION_HAS_EXACT_EXPIRY_REVOCATION_ROUTE_AND_FAIL_CLOSED_DENIAL_BEHAVIOR'
    }
  ];
  return criteria.map((criterion, ordinal) => withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_CRITERION_SCHEMA,
    routeId: route.routeId,
    ordinal: ordinal + 1,
    ...criterion,
    satisfied: false
  }));
}

function expectedPacket(boundary, closure, options, index) {
  const route = boundary.r135Witness.routes.find(item =>
    item.routeId === closure.routeId);
  const evidence = boundary.r135Preflight.requiredExternalEvidence
    .filter(item => item.routeId === closure.routeId)
    .map(item => ({ ...clone(item), admitted: false }));
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_REQUEST_PACKET_SCHEMA,
    status: PACKET_STATUS,
    requestId: options.requestBatchId + ':route-' + String(index + 1),
    requestBatchId: options.requestBatchId,
    requesterId: options.requesterId,
    requestWindow: {
      requestedAt: options.requestedAt,
      expiresAt: options.expiresAt,
      maximumLifetimeMs: MAXIMUM_REQUEST_WINDOW_MS
    },
    source: {
      r135Contract: sourceRef(boundary.r135Contract),
      r135Witness: sourceRef(boundary.r135Witness),
      r135ClosurePreflight: sourceRef(boundary.r135Preflight),
      routeClosureDigest: stableDigest(closure)
    },
    requestedRouteDesignation: {
      routeId: route.routeId,
      sourceRequestId: route.requestId,
      sourceRequestPacketDigest: route.requestPacketDigest,
      sourceR134DeclarationDigest: route.sourceDeclarationDigest,
      candidateProviderId: route.candidateProviderId,
      claimedVerificationRecipientId: route.claimedVerificationRecipientId,
      claimedLocatorKind: route.claimedLocatorKind,
      claimedLocatorValue: route.claimedLocatorValue,
      routeProviders: clone(route.routeProviders),
      recurringCapabilityIds: clone(route.recurringDependency.capabilityIds),
      designationScope:
        'OUT_OF_BAND_ROUTE_ONLY_PROVIDER_VERIFICATION_AND_OPERATION_REMAIN_SEPARATELY_BLOCKED'
    },
    authorityReview: {
      requestedReviewSeatId: REVIEW_SEAT_ID,
      eligibleDecisionMakers: ['MIKE_TOBI',
        'AUTHENTICATED_HOST_GOVERNANCE_SEAT'],
      requiredDecisionCapabilityId:
        VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECIDE_CAPABILITY_ID,
      authoritySeatAuthenticated: false,
      candidateOrRouteProviderControlExcluded: false,
      decision: null,
      designationReceipt: null
    },
    decisionCriteria: expectedDecisionCriteria(route),
    requiredExternalEvidence: evidence,
    transport: {
      status: 'NOT_TRANSMITTED',
      endpoint: null,
      contactAttempted: false,
      senderReceipt: null,
      receiverReceipt: null
    },
    effects: {
      authorityDesignated: false,
      routeDesignated: false,
      routeProvidersVerified: false,
      dependencyGraphVerifiedAcyclic: false,
      endpointResolved: false,
      recipientAuthenticated: false,
      contactAuthorized: false,
      transportPerformed: false,
      providerVerified: false,
      evidenceAdmitted: false,
      persisted: false,
      promoted: false,
      canon: false,
      worldMutated: false
    },
    truth: {
      exactR135BlockedClosureBound: true,
      requestCreated: true,
      proposalOnly: true,
      authoritySeatAuthenticated: false,
      authorityDecisionObserved: false,
      designationReceiptObserved: false,
      routeDesignated: false,
      routeProvidersVerified: false,
      dependencyGraphVerifiedAcyclic: false,
      endpointResolved: false,
      recipientAuthenticated: false,
      contactAuthorized: false,
      transportPerformed: false,
      providerVerified: false,
      evidenceAdmitted: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  });
}

function expectedBatch(contract, boundary, options) {
  const closures = eligibleClosures(boundary);
  const packets = closures.map((closure, index) =>
    expectedPacket(boundary, closure, options, index));
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_REQUEST_BATCH_SCHEMA,
    status: packets.length === 0 ? EMPTY_STATUS : REQUEST_STATUS,
    sourceContract: sourceRef(contract),
    sourceR135: {
      contract: sourceRef(boundary.r135Contract),
      witness: sourceRef(boundary.r135Witness),
      closurePreflight: sourceRef(boundary.r135Preflight)
    },
    requestContext: packets.length === 0 ? null : clone(options),
    packets,
    summary: {
      sourceCompatibleRouteCount:
        boundary.r135Witness.summary.sourceCompatibleRouteCount,
      eligibleBlockedClosureCount: closures.length,
      requestPacketCount: packets.length,
      decisionCriterionCount: packets.length * DECISION_CRITERIA_PER_PACKET,
      externalEvidenceRequirementCount:
        packets.length * EVIDENCE_REQUIREMENTS_PER_PACKET,
      authenticatedAuthoritySeatCount: 0,
      authorityDecisionCount: 0,
      designationReceiptCount: 0,
      designatedRouteCount: 0,
      independentlyVerifiedRouteProviderCount: 0,
      endpointResolvedCount: 0,
      recipientAuthenticatedCount: 0,
      contactAuthorizedCount: 0,
      transmittedRequestCount: 0,
      senderReceiptCount: 0,
      receiverReceiptCount: 0,
      independentlyVerifiedProviderCount: 0,
      evidenceAdmittedCount: 0,
      admissionReady: false
    },
    prohibitedConclusions: {
      treatRequestAsAuthorityAuthentication: true,
      treatRequestAsRouteDesignationOrAuthorization: true,
      treatRequestAsProviderVerificationOrAcyclicityProof: true,
      contactReviewSeatEndpointOrHuman: true,
      claimDeliveryWithoutMatchedReceipts: true,
      admitEvidenceOwnerOrDebit: true,
      persistMutatePromoteOrCanonize: true
    },
    truth: {
      exactR135EligibleClosuresBound: true,
      requestsCreatedWithoutTransmission: true,
      requestMayAuthorizeItself: false,
      authoritySeatAuthenticated: false,
      authorityDecisionObserved: false,
      designationReceiptObserved: false,
      routeDesignated: false,
      routeProvidersVerified: false,
      dependencyGraphVerifiedAcyclic: false,
      endpointResolved: false,
      recipientAuthenticated: false,
      contactAuthorized: false,
      transportPerformed: false,
      providerVerificationPerformed: false,
      evidenceAdmitted: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  });
}

export function
createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationRequestBatch(
  contract, boundary, options = {}) {
  if (!landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationRequestContractReceiptValid(
      contract, boundary)) {
    throw new Error('R136 request batch needs the exact contract and R135 boundary');
  }
  const activeCount = eligibleClosures(boundary).length;
  if (!optionsValid(options, activeCount)) {
    throw new Error('R136 request batch needs exact bounded request options');
  }
  const batch = expectedBatch(contract, boundary, options);
  if (new TextEncoder().encode(JSON.stringify(batch)).length >
      MAXIMUM_SERIALIZED_BATCH_BYTES) {
    throw new Error('R136 request batch exceeds its resource ceiling');
  }
  return batch;
}

export function
landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationRequestBatchValid(
  batch, contract, boundary, options = {}) {
  const activeCount = boundaryValid(boundary)
    ? eligibleClosures(boundary).length : 0;
  return landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationRequestContractReceiptValid(
    contract, boundary) && optionsValid(options, activeCount) &&
    new TextEncoder().encode(JSON.stringify(batch)).length <=
      MAXIMUM_SERIALIZED_BATCH_BYTES &&
    exact(batch, expectedBatch(contract, boundary, options));
}

export function
matrixThermalVerifierRouteOutOfBandAuthorityDesignationRequestDescription() {
  return {
    status: 'EXPERIMENTAL',
    capabilityId:
      VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_REQUEST_CREATE_CAPABILITY_ID,
    statement:
      'R136 exact-binds eligible R135 blocked closures into bounded proposal-only requests for the established AXM host-authority review seat, without authenticating a seat, making a decision, designating a route, contacting a recipient, or transmitting a packet.',
    boundaries: [
      'The current real R135 blocked-closure inventory is empty, so the current request batch is empty and accepts no invented request metadata.',
      'Synthetic requests remain PENDING_MIKE_TOBI_AXM_HOST_AUTHORITY_DECISION_PROPOSAL_ONLY; eligible decision-maker labels do not authenticate an identity or grant authority.',
      'No route or provider is designated, verified, selected, installed, available, or executed, and no endpoint resolution, recipient authentication, contact, transport, receipt, evidence admission, historical owner/debit closure, persistence, promotion, canonization, or world mutation occurs.'
    ]
  };
}
