import {
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA,
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA,
  landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteTrustBootstrapRecursionPreflightContractReceiptValid,
  landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteTrustBootstrapRecursionWitnessValid,
  landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteTrustBootstrapClosurePreflightValid
} from './matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-recipient-route-trust-bootstrap-recursion-preflight.mjs?v=0.141.0-r141.1';

export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_CLOSURE_EVIDENCE_ACQUISITION_REQUEST_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-recipient-route-trust-bootstrap-closure-evidence-acquisition-request-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_CLOSURE_EVIDENCE_ACQUISITION_CAPABILITY_REQUIREMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-recipient-route-trust-bootstrap-closure-evidence-acquisition-capability-requirement/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_CLOSURE_EVIDENCE_ACQUISITION_REQUEST_PACKET_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-recipient-route-trust-bootstrap-closure-evidence-acquisition-request-packet/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_CLOSURE_EVIDENCE_ACQUISITION_REQUEST_BATCH_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-recipient-route-trust-bootstrap-closure-evidence-acquisition-request-batch/v1';

export const
  VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_CLOSURE_EVIDENCE_ACQUISITION_REQUEST_CREATE_CAPABILITY_ID =
    'contract.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decision-hand.provider-verification.recipient-route.trust-bootstrap.closure-evidence-acquisition.request.create';

const DECISION_CAPABILITY_ID =
  'authority.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decide';
const TRUST_ANCHOR_RESOLVE_CAPABILITY_ID =
  'authority.foundation-planet.external-provider-verification.verifier-route.trust-anchor.resolve';
const ENDPOINT_RESOLVE_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.endpoint.resolve';
const SEND_RECEIVE_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.request.send-receive';
const REQUIRED_CAPABILITY_IDS = [DECISION_CAPABILITY_ID,
  TRUST_ANCHOR_RESOLVE_CAPABILITY_ID, ENDPOINT_RESOLVE_CAPABILITY_ID,
  SEND_RECEIVE_CAPABILITY_ID];

const CONTRACT_STATUS =
  'DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_CLOSURE_EVIDENCE_ACQUISITION_REQUEST_CONTRACT_AVAILABLE';
const EMPTY_STATUS =
  'NO_BLOCKED_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_CLOSURES_EVIDENCE_ACQUISITION_REQUEST_BATCH_EMPTY';
const REQUEST_STATUS =
  'CLOSURE_EVIDENCE_ACQUISITION_REQUESTS_CREATED_NOT_TRANSMITTED_NOT_AUTHORIZED';
const PACKET_STATUS =
  'PENDING_EXTERNAL_NATIVE_EVIDENCE_ACQUISITION_HANDOFF_ONLY';
const HANDOFF_COORDINATION_SEAT_ID = 'axm-host-authority-review-seat';
const MAXIMUM_REQUEST_PACKETS = 1;
const CAPABILITY_REQUIREMENTS_PER_PACKET = 4;
const EVIDENCE_REQUIREMENTS_PER_PACKET = 8;
const MAXIMUM_REQUEST_WINDOW_MS = 300000;
const MAXIMUM_SERIALIZED_BATCH_BYTES = 524288;
const clone = value => JSON.parse(JSON.stringify(value));
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const exactKeys = (value, keys) => value && typeof value === 'object' &&
  !Array.isArray(value) && exact(Object.keys(value).sort(), [...keys].sort());
const identifierValid = value => typeof value === 'string' &&
  /^[a-z0-9][a-z0-9._:-]{2,191}$/.test(value);
const boundaryValidationCache = new WeakMap();

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
  if (!boundary || typeof boundary !== 'object' || Array.isArray(boundary)) {
    return false;
  }
  let fingerprint;
  try {
    fingerprint = JSON.stringify(boundary);
  } catch {
    return false;
  }
  const cached = boundaryValidationCache.get(boundary);
  if (cached?.fingerprint === fingerprint) return cached.valid;
  const valid = exactKeys(boundary,
    ['r141Contract', 'r141Witness', 'r141Preflight',
    'r141Boundary']) &&
    landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteTrustBootstrapRecursionPreflightContractReceiptValid(
      boundary.r141Contract, boundary.r141Boundary) &&
    landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteTrustBootstrapRecursionWitnessValid(
      boundary.r141Witness, boundary.r141Contract, boundary.r141Boundary) &&
    landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteTrustBootstrapClosurePreflightValid(
      boundary.r141Preflight, boundary.r141Contract, boundary.r141Witness,
      boundary.r141Boundary);
  boundaryValidationCache.set(boundary, { fingerprint, valid });
  return valid;
}

const eligibleClosures = boundary => boundary.r141Preflight.routeClosures.filter(
  closure => closure.status ===
    'BLOCKED_EXTERNAL_AUTHORITY_ANCHORED_VERIFIER_ROUTE_AND_NATIVE_RECEIPTS_REQUIRED' &&
    closure.automaticContinuationAllowed === false);

function expectedContract(boundary) {
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_CLOSURE_EVIDENCE_ACQUISITION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
    status: CONTRACT_STATUS,
    sourceR141: {
      contract: sourceRef(boundary.r141Contract),
      witness: sourceRef(boundary.r141Witness),
      closurePreflight: sourceRef(boundary.r141Preflight)
    },
    projection: {
      sourceCompatibleRouteCount:
        boundary.r141Witness.summary.sourceCompatibleRouteCount,
      eligibleBlockedClosureCount: eligibleClosures(boundary).length,
      capabilityRequirementSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_CLOSURE_EVIDENCE_ACQUISITION_CAPABILITY_REQUIREMENT_SCHEMA,
      requestPacketSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_CLOSURE_EVIDENCE_ACQUISITION_REQUEST_PACKET_SCHEMA,
      requestBatchSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_CLOSURE_EVIDENCE_ACQUISITION_REQUEST_BATCH_SCHEMA,
      requestedHandoffCoordinationSeatId: HANDOFF_COORDINATION_SEAT_ID,
      implementedRequestCapabilityId:
        VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_CLOSURE_EVIDENCE_ACQUISITION_REQUEST_CREATE_CAPABILITY_ID,
      requiredExternalCapabilityIds: clone(REQUIRED_CAPABILITY_IDS)
    },
    resourceBudget: {
      maximumRequestPackets: MAXIMUM_REQUEST_PACKETS,
      capabilityRequirementsPerPacket: CAPABILITY_REQUIREMENTS_PER_PACKET,
      evidenceRequirementsPerPacket: EVIDENCE_REQUIREMENTS_PER_PACKET,
      maximumRequestWindowMs: MAXIMUM_REQUEST_WINDOW_MS,
      maximumSerializedBatchBytes: MAXIMUM_SERIALIZED_BATCH_BYTES
    },
    truth: {
      exactR141ContractWitnessPreflightAndBoundaryBound: true,
      eligibleBlockedClosuresMayCreateEvidenceAcquisitionRequests: true,
      requestMayAuthenticateHandoffCoordinatorOrAuthoritySeat: false,
      requestMayAcquireOrVerifyEvidence: false,
      requestMaySatisfyMissingCapabilities: false,
      requestMayCreateAnotherVerificationRoute: false,
      requestMayAuthorizeDecisionContactOrTransport: false,
      automaticRecursiveContinuationAllowed: false,
      requestTransmitted: false,
      evidenceAcquisitionReceiptObserved: false,
      evidenceAcquired: false,
      missingCapabilitiesSatisfied: false,
      authorityDecisionPerformed: false,
      routeDesignatedOrAuthorized: false,
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
createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteTrustBootstrapClosureEvidenceAcquisitionRequestContractReceipt(
  boundary) {
  if (!boundaryValid(boundary)) {
    throw new Error('R142 evidence-acquisition request contract needs the exact R141 boundary');
  }
  return expectedContract(boundary);
}

export function
landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteTrustBootstrapClosureEvidenceAcquisitionRequestContractReceiptValid(
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

function expectedCapabilityRequirements(boundary, closure) {
  const evidence = boundary.r141Preflight.requiredExternalEvidence
    .filter(item => item.routeId === closure.routeId);
  return REQUIRED_CAPABILITY_IDS.map((capabilityId, ordinal) => withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_CLOSURE_EVIDENCE_ACQUISITION_CAPABILITY_REQUIREMENT_SCHEMA,
    routeId: closure.routeId,
    ordinal: ordinal + 1,
    capabilityId,
    status: 'MISSING_EXTERNAL_CAPABILITY',
    requiredEvidenceIds: evidence.filter(item =>
      item.requiredCapabilityIds.includes(capabilityId))
      .map(item => item.evidenceId),
    available: false,
    satisfied: false
  }));
}

function expectedPacket(boundary, closure, options, index) {
  const route = boundary.r141Witness.routes.find(item =>
    item.routeId === closure.routeId);
  const evidence = boundary.r141Preflight.requiredExternalEvidence
    .filter(item => item.routeId === closure.routeId)
    .map(item => ({ ...clone(item), acquired: false,
      independentlyVerified: false, admitted: false }));
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_CLOSURE_EVIDENCE_ACQUISITION_REQUEST_PACKET_SCHEMA,
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
      r141Contract: sourceRef(boundary.r141Contract),
      r141Witness: sourceRef(boundary.r141Witness),
      r141ClosurePreflight: sourceRef(boundary.r141Preflight),
      routeClosureDigest: stableDigest(closure)
    },
    requestedClosureEvidenceAcquisition: {
      routeId: route.routeId,
      sourceRequestId: route.requestId,
      sourceRequestPacketDigest: route.requestPacketDigest,
      sourceR140DeclarationDigest: route.sourceDeclarationDigest,
      candidateProviderId: route.candidateProviderId,
      claimedVerificationRecipientId: route.claimedVerificationRecipientId,
      claimedLocatorKind: route.claimedLocatorKind,
      claimedLocatorValue: route.claimedLocatorValue,
      routeProviders: clone(route.routeProviders),
      recurringCapabilityIds: clone(route.recurringDependency.capabilityIds),
      missingCapabilityIds: clone(closure.missingCapabilityIds),
      acquisitionScope:
        'EXTERNAL_NATIVE_EVIDENCE_ONLY_NO_PROVIDER_ROUTE_AUTHORITY_CONTACT_OR_TRANSPORT_GRANTED'
    },
    handoffReview: {
      requestedCoordinationSeatId: HANDOFF_COORDINATION_SEAT_ID,
      eligibleCoordinators: ['MIKE_TOBI',
        'AUTHENTICATED_HOST_GOVERNANCE_SEAT'],
      authoritySeatAuthenticated: false,
      handoffCoordinatorAuthenticated: false,
      candidateOrRouteProviderControlExclusionProven: false,
      requestAccepted: false,
      acquisitionReceipt: null
    },
    capabilityRequirements: expectedCapabilityRequirements(boundary, closure),
    requiredExternalEvidence: evidence,
    transport: {
      status: 'NOT_TRANSMITTED',
      endpoint: null,
      contactAttempted: false,
      senderReceipt: null,
      receiverReceipt: null
    },
    effects: {
      handoffAccepted: false,
      evidenceAcquired: false,
      missingCapabilitiesSatisfied: false,
      authorityDecisionPerformed: false,
      routeDesignatedOrAuthorized: false,
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
      exactR141BlockedClosureBound: true,
      requestCreated: true,
      handoffOnly: true,
      authoritySeatAuthenticated: false,
      handoffCoordinatorAuthenticated: false,
      requestAccepted: false,
      evidenceAcquisitionReceiptObserved: false,
      evidenceAcquired: false,
      missingCapabilitiesSatisfied: false,
      authorityDecisionPerformed: false,
      routeDesignatedOrAuthorized: false,
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
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_CLOSURE_EVIDENCE_ACQUISITION_REQUEST_BATCH_SCHEMA,
    status: packets.length === 0 ? EMPTY_STATUS : REQUEST_STATUS,
    sourceContract: sourceRef(contract),
    sourceR141: {
      contract: sourceRef(boundary.r141Contract),
      witness: sourceRef(boundary.r141Witness),
      closurePreflight: sourceRef(boundary.r141Preflight)
    },
    requestContext: packets.length === 0 ? null : clone(options),
    packets,
    summary: {
      sourceCompatibleRouteCount:
        boundary.r141Witness.summary.sourceCompatibleRouteCount,
      eligibleBlockedClosureCount: closures.length,
      requestPacketCount: packets.length,
      capabilityRequirementCount:
        packets.length * CAPABILITY_REQUIREMENTS_PER_PACKET,
      externalEvidenceRequirementCount:
        packets.length * EVIDENCE_REQUIREMENTS_PER_PACKET,
      authenticatedHandoffCoordinatorCount: 0,
      acceptedHandoffCount: 0,
      evidenceAcquisitionReceiptCount: 0,
      acquiredEvidenceCount: 0,
      satisfiedMissingCapabilityCount: 0,
      authorityDecisionCount: 0,
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
      treatRequestAsCoordinatorOrAuthorityAuthentication: true,
      treatRequestAsEvidenceAcquisitionOrVerification: true,
      treatRequestAsMissingCapabilitySatisfaction: true,
      treatRequestAsAuthorityDecisionRouteDesignationOrAuthorization: true,
      createAnotherUnverifiedVerificationRoute: true,
      contactCoordinationSeatEndpointOrHuman: true,
      claimDeliveryWithoutMatchedReceipts: true,
      admitEvidenceOwnerOrDebit: true,
      persistMutatePromoteOrCanonize: true
    },
    truth: {
      exactR141EligibleClosuresBound: true,
      requestsCreatedWithoutTransmission: true,
      requestMayAuthorizeItself: false,
      authoritySeatAuthenticated: false,
      handoffCoordinatorAuthenticated: false,
      requestAccepted: false,
      evidenceAcquisitionReceiptObserved: false,
      evidenceAcquired: false,
      missingCapabilitiesSatisfied: false,
      authorityDecisionPerformed: false,
      routeDesignatedOrAuthorized: false,
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
createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteTrustBootstrapClosureEvidenceAcquisitionRequestBatch(
  contract, boundary, options = {}) {
  if (!landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteTrustBootstrapClosureEvidenceAcquisitionRequestContractReceiptValid(
      contract, boundary)) {
    throw new Error('R142 request batch needs the exact contract and R141 boundary');
  }
  const activeCount = eligibleClosures(boundary).length;
  if (!optionsValid(options, activeCount)) {
    throw new Error('R142 request batch needs exact bounded request options');
  }
  const batch = expectedBatch(contract, boundary, options);
  if (new TextEncoder().encode(JSON.stringify(batch)).length >
      MAXIMUM_SERIALIZED_BATCH_BYTES) {
    throw new Error('R142 request batch exceeds its resource ceiling');
  }
  return batch;
}

export function
landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteTrustBootstrapClosureEvidenceAcquisitionRequestBatchValid(
  batch, contract, boundary, options = {}) {
  const activeCount = boundaryValid(boundary)
    ? eligibleClosures(boundary).length : 0;
  return landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteTrustBootstrapClosureEvidenceAcquisitionRequestContractReceiptValid(
    contract, boundary) && optionsValid(options, activeCount) &&
    new TextEncoder().encode(JSON.stringify(batch)).length <=
      MAXIMUM_SERIALIZED_BATCH_BYTES &&
    exact(batch, expectedBatch(contract, boundary, options));
}

export function
matrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteTrustBootstrapClosureEvidenceAcquisitionRequestDescription() {
  return {
    status: 'EXPERIMENTAL',
    capabilityId:
      VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_CLOSURE_EVIDENCE_ACQUISITION_REQUEST_CREATE_CAPABILITY_ID,
    statement:
      'R142 exact-binds eligible R141 blocked closures into bounded external native-evidence acquisition handoff requests without creating another verification route, authenticating a coordinator or authority seat, acquiring evidence, satisfying a capability, contacting a recipient, or transmitting a packet.',
    boundaries: [
      'The current real R141 blocked-closure inventory is empty, so the current request batch is empty and accepts no invented request metadata.',
      'Synthetic requests remain PENDING_EXTERNAL_NATIVE_EVIDENCE_ACQUISITION_HANDOFF_ONLY; eligible coordinator labels do not authenticate an identity, accept a handoff, acquire evidence, satisfy a capability, or grant authority.',
      'No route or provider is created, designated, verified, selected, installed, available, or executed, and no endpoint resolution, recipient authentication, authority decision, contact, transport, receipt, evidence acquisition or admission, historical owner/debit closure, persistence, promotion, canonization, or world mutation occurs.'
    ]
  };
}
