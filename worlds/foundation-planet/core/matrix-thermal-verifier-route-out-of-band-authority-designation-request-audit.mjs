import {
  landMatrixThermalVerifierRouteProviderTrustBootstrapRecursionPreflightContractReceiptValid,
  landMatrixThermalVerifierRouteProviderTrustBootstrapRecursionWitnessValid,
  landMatrixThermalVerifierRouteProviderTrustBootstrapClosurePreflightValid
} from './matrix-thermal-verifier-route-provider-trust-bootstrap-recursion-preflight.mjs?v=0.135.0-r135.1';

const CONTRACT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-request-contract-receipt/v1';
const CRITERION_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-criterion/v1';
const PACKET_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-request-packet/v1';
const BATCH_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-request-batch/v1';
const AUDIT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-request-audit/v1';
const CREATE_CAPABILITY_ID =
  'authority.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.request.create';
const DECIDE_CAPABILITY_ID =
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

function expectedContract(boundary) {
  return withDigest({
    schema: CONTRACT_SCHEMA,
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
      decisionCriterionSchema: CRITERION_SCHEMA,
      requestPacketSchema: PACKET_SCHEMA,
      requestBatchSchema: BATCH_SCHEMA,
      requestedReviewSeatId: REVIEW_SEAT_ID,
      implementedRequestCapabilityId: CREATE_CAPABILITY_ID,
      requiredDecisionCapabilityId: DECIDE_CAPABILITY_ID
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
    schema: CRITERION_SCHEMA,
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
    schema: PACKET_SCHEMA,
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
      requiredDecisionCapabilityId: DECIDE_CAPABILITY_ID,
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
    schema: BATCH_SCHEMA,
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
auditLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationRequest(
  contract, batch, boundary, options = {}) {
  const findings = [];
  if (!boundaryValid(boundary)) {
    findings.push('R135_BOUNDARY_INVALID_OR_SUBSTITUTED');
  } else {
    const activeCount = eligibleClosures(boundary).length;
    if (!optionsValid(options, activeCount)) {
      findings.push('R136_REQUEST_OPTIONS_INVALID_OR_OUT_OF_WINDOW');
    } else {
      const reconstructedContract = expectedContract(boundary);
      if (!exact(contract, reconstructedContract)) {
        findings.push('R136_CONTRACT_NOT_EXACTLY_RECONSTRUCTED');
      } else if (!exact(batch, expectedBatch(contract, boundary, options))) {
        findings.push('R136_REQUEST_BATCH_NOT_EXACTLY_RECONSTRUCTED');
      }
    }
  }
  if (!batch || typeof batch !== 'object' || Array.isArray(batch) ||
      new TextEncoder().encode(JSON.stringify(batch)).length >
        MAXIMUM_SERIALIZED_BATCH_BYTES) {
    findings.push('REQUEST_BATCH_RESOURCE_CEILING_EXCEEDED_OR_INVALID');
  }
  const uniqueFindings = [...new Set(findings)];
  const packetCount = Array.isArray(batch?.packets) ? batch.packets.length : 0;
  return withDigest({
    schema: AUDIT_SCHEMA,
    status: uniqueFindings.length === 0 ? 'PASS' : 'FAIL',
    source: {
      contract: contract && typeof contract === 'object'
        ? sourceRef(contract) : null,
      requestBatch: batch && typeof batch === 'object'
        ? sourceRef(batch) : null
    },
    findings: uniqueFindings,
    summary: {
      requestPacketCount: packetCount,
      decisionCriterionCount: packetCount * DECISION_CRITERIA_PER_PACKET,
      externalEvidenceRequirementCount:
        packetCount * EVIDENCE_REQUIREMENTS_PER_PACKET,
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
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  });
}
