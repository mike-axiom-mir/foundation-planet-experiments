import {
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_RESOLUTION_PREFLIGHT_SCHEMA,
  landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteResolutionPreflightContractReceiptValid,
  landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteResolutionPreflightValid
} from './matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-recipient-route-resolution-preflight.mjs?v=0.140.0-r140.1';

const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-recipient-route-trust-bootstrap-recursion-preflight-contract-receipt/v1';
const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-recipient-route-trust-bootstrap-recursion-witness/v1';
const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-recipient-route-trust-bootstrap-closure-preflight/v1';

const
  VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID =
    'analysis.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decision-hand.provider-verification.recipient-route.trust-bootstrap.recursion.detect';

const DECISION_CAPABILITY_ID =
  'authority.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decide';
const ENDPOINT_RESOLVE_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.endpoint.resolve';
const TRUST_ANCHOR_RESOLVE_CAPABILITY_ID =
  'authority.foundation-planet.external-provider-verification.verifier-route.trust-anchor.resolve';
const SEND_RECEIVE_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.request.send-receive';
const REQUIRED_ROUTE_CAPABILITY_IDS = [ENDPOINT_RESOLVE_CAPABILITY_ID,
  TRUST_ANCHOR_RESOLVE_CAPABILITY_ID, SEND_RECEIVE_CAPABILITY_ID];
const BLOCKED_OUTCOME_CAPABILITY_IDS = [DECISION_CAPABILITY_ID,
  TRUST_ANCHOR_RESOLVE_CAPABILITY_ID, ENDPOINT_RESOLVE_CAPABILITY_ID,
  SEND_RECEIVE_CAPABILITY_ID];
const CONTRACT_STATUS =
  'VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_AVAILABLE';
const EMPTY_WITNESS_STATUS =
  'NO_COMPATIBLE_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_RECURSION_WITNESS_EMPTY';
const WITNESS_STATUS =
  'RECURSIVE_UNVERIFIED_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_DEPENDENCY_WITNESSED';
const EMPTY_PREFLIGHT_STATUS =
  'NO_COMPATIBLE_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_PREFLIGHT_EMPTY';
const BLOCKED_PREFLIGHT_STATUS =
  'BLOCKED_RECURSIVE_UNVERIFIED_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_DEPENDENCY';
const RECURSION_PATTERN =
  'UNVERIFIED_DECISION_HAND_VERIFICATION_ROUTE_PROVIDERS_REQUIRE_VERIFICATION_REQUESTS_WHOSE_RECIPIENT_ROUTES_REQUIRE_THE_SAME_UNVERIFIED_PROVIDER_CLASSES';
const CLOSURE_REASON =
  'NO_INDEPENDENT_OUT_OF_BAND_AUTHORITY_ANCHORED_VERIFIER_ROUTE_WITH_NATIVE_MATCHED_RECEIPTS';
const MAXIMUM_ROUTES = 1;
const PROVIDER_ROLES_PER_ROUTE = 3;
const STAGES_PER_ROUTE = 7;
const EVIDENCE_REQUIREMENTS_PER_ROUTE = 8;
const MAXIMUM_SERIALIZED_WITNESS_BYTES = 524288;
const MAXIMUM_SERIALIZED_PREFLIGHT_BYTES = 524288;
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

function boundaryValid(boundary) {
  return exactKeys(boundary, ['r140Contract', 'r140Preflight',
    'r140Custody', 'r140Declarations']) &&
    landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteResolutionPreflightContractReceiptValid(
      boundary.r140Contract, boundary.r140Custody) &&
    landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteResolutionPreflightValid(
      boundary.r140Preflight, boundary.r140Contract, boundary.r140Custody,
      boundary.r140Declarations);
}

const compatibleRoutes = boundary => boundary.r140Preflight.routes.filter(route =>
  route.status === 'RECIPIENT_ROUTE_CONTRACT_COMPATIBLE_UNVERIFIED');

function expectedContract(boundary) {
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
    status: CONTRACT_STATUS,
    sourceR140: {
      contract: sourceRef(boundary.r140Contract),
      preflight: sourceRef(boundary.r140Preflight)
    },
    projection: {
      sourceRequestPacketCount:
        boundary.r140Preflight.summary.sourceRequestPacketCount,
      sourceCompatibleRouteCount: compatibleRoutes(boundary).length,
      providerRolesPerRoute: PROVIDER_ROLES_PER_ROUTE,
      recursionWitnessSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA,
      closurePreflightSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA,
      recurringCapabilityIds: clone(REQUIRED_ROUTE_CAPABILITY_IDS),
      blockedOutcomeCapabilityIds: clone(BLOCKED_OUTCOME_CAPABILITY_IDS),
      implementedAnalyticalCapabilityId:
        VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID
    },
    resourceBudget: {
      maximumRoutes: MAXIMUM_ROUTES,
      providerRolesPerRoute: PROVIDER_ROLES_PER_ROUTE,
      stagesPerRoute: STAGES_PER_ROUTE,
      evidenceRequirementsPerRoute: EVIDENCE_REQUIREMENTS_PER_ROUTE,
      maximumSerializedWitnessBytes: MAXIMUM_SERIALIZED_WITNESS_BYTES,
      maximumSerializedPreflightBytes: MAXIMUM_SERIALIZED_PREFLIGHT_BYTES
    },
    truth: {
      exactR140ContractPreflightDeclarationsAndCustodyBound: true,
      compatibleRouteProviderRecursionMayBeAnalyzed: true,
      literalArtifactGraphCycleMayBeClaimed: false,
      anotherUnverifiedThreeProviderRouteMayCloseTrustBootstrap: false,
      distinctProviderIdentifiersMayProveIndependence: false,
      callerDeclaredDependencyGraphMayProveAcyclicity: false,
      automaticRecursiveContinuationAllowed: false,
      analysisOnly: true,
      endpointResolved: false,
      recipientAuthenticated: false,
      authorityEstablished: false,
      decisionHandProviderVerified: false,
      authorityDecisionPerformed: false,
      routeDesignatedOrAuthorized: false,
      transportPerformed: false,
      routeProviderVerified: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  });
}

function expectedStages(boundary, route) {
  return [
    {
      ordinal: 1,
      role: 'R139_DECISION_HAND_PROVIDER_VERIFICATION_REQUEST_RECIPIENT_ROUTE_UNRESOLVED',
      sourceArtifact: sourceRef(boundary.r140Custody.r139Batch),
      requiredCapabilityIds: clone(REQUIRED_ROUTE_CAPABILITY_IDS),
      independentlyVerified: false
    },
    {
      ordinal: 2,
      role: 'R140_CALLER_DECLARED_THREE_PROVIDER_ROUTE_UNVERIFIED',
      sourceArtifact: sourceRef(boundary.r140Preflight),
      requiredCapabilityIds: clone(REQUIRED_ROUTE_CAPABILITY_IDS),
      independentlyVerified: false
    },
    {
      ordinal: 3,
      role: 'ROUTE_PROVIDERS_REQUIRE_INDEPENDENT_IDENTITY_AUTHORITY_IMPLEMENTATION_AND_AVAILABILITY_PROOF',
      sourceArtifact: sourceRef(boundary.r140Contract),
      requiredCapabilityIds: clone(REQUIRED_ROUTE_CAPABILITY_IDS),
      independentlyVerified: false
    },
    {
      ordinal: 4,
      role: 'ROUTE_PROVIDER_VERIFICATION_REQUESTS_REQUIRE_INDEPENDENT_RECIPIENT_ROUTES',
      sourceArtifact: sourceRef(boundary.r140Contract),
      requiredCapabilityIds: clone(REQUIRED_ROUTE_CAPABILITY_IDS),
      independentlyVerified: false
    },
    {
      ordinal: 5,
      role: 'ANOTHER_UNVERIFIED_THREE_PROVIDER_ROUTE_REENTERS_THE_SAME_DEPENDENCY_CLASS',
      sourceArtifact: sourceRef(boundary.r140Preflight),
      requiredCapabilityIds: clone(REQUIRED_ROUTE_CAPABILITY_IDS),
      independentlyVerified: false
    },
    {
      ordinal: 6,
      role: 'UNVERIFIED_DECISION_HAND_CANNOT_AUTHENTICATE_DECIDE_OR_DESIGNATE_ITS_OWN_VERIFICATION_ROUTE',
      sourceArtifact: sourceRef(boundary.r140Contract),
      requiredCapabilityIds: clone(BLOCKED_OUTCOME_CAPABILITY_IDS),
      independentlyVerified: false
    },
    {
      ordinal: 7,
      role: 'OUT_OF_BAND_AUTHORITY_ANCHORED_NATIVE_ROUTE_REQUIRED_TO_TERMINATE_RECURSION',
      sourceArtifact: {
        schema:
          'axm.foundation-planet.external-decision-hand-provider-verification-recipient-route-trust-bootstrap-boundary/v1',
        receiptDigest: stableDigest({
          requestId: route.requestId,
          candidateProviderId: route.candidateProviderId,
          claimedVerificationRecipientId:
            route.claimedVerificationRecipientId,
          requiredCapabilityIds: BLOCKED_OUTCOME_CAPABILITY_IDS
        })
      },
      requiredCapabilityIds: clone(BLOCKED_OUTCOME_CAPABILITY_IDS),
      independentlyVerified: false
    }
  ];
}

function expectedProviderRoles(route) {
  return [
    {
      role: 'ENDPOINT_RESOLVER',
      providerId: route.endpointResolverProviderId,
      capabilityId: ENDPOINT_RESOLVE_CAPABILITY_ID,
      trust: 'CALLER_SUPPLIED_UNTRUSTED',
      independentlyVerified: false
    },
    {
      role: 'TRUST_ANCHOR_AUTHORITY',
      providerId: route.trustAnchorAuthorityProviderId,
      capabilityId: TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
      trust: 'CALLER_SUPPLIED_UNTRUSTED',
      independentlyVerified: false
    },
    {
      role: 'RECEIPTED_TRANSPORT',
      providerId: route.transportProviderId,
      capabilityId: SEND_RECEIVE_CAPABILITY_ID,
      trust: 'CALLER_SUPPLIED_UNTRUSTED',
      independentlyVerified: false
    }
  ];
}

function expectedRouteWitness(boundary, route) {
  const assessment = boundary.r140Preflight.assessments.find(item =>
    item.requestId === route.requestId &&
    item.status === 'RECIPIENT_ROUTE_CONTRACT_COMPATIBLE_UNVERIFIED');
  return {
    routeId: route.requestId +
      '.decision-hand-provider-verification-recipient-route-trust-bootstrap',
    requestId: route.requestId,
    requestPacketDigest: route.requestPacketDigest,
    sourceRouteProjectionDigest: stableDigest(route),
    sourceDeclarationDigest: assessment.declarationDigest,
    candidateProviderId: route.candidateProviderId,
    claimedVerificationRecipientId: route.claimedVerificationRecipientId,
    claimedLocatorKind: route.claimedLocatorKind,
    claimedLocatorValue: route.claimedLocatorValue,
    routeProviders: expectedProviderRoles(route),
    pattern: RECURSION_PATTERN,
    stages: expectedStages(boundary, route),
    recurringDependency: {
      capabilityIds: clone(REQUIRED_ROUTE_CAPABILITY_IDS),
      firstUntrustedProviderStageOrdinal: 2,
      repeatedDependencyStageOrdinal: 5,
      routeProviderCount: PROVIDER_ROLES_PER_ROUTE,
      independentlyAnchoredOutcomePresent: false
    },
    closure: { closed: false, reason: CLOSURE_REASON },
    truth: {
      exactR140CompatibleRouteBound: true,
      recursiveUnverifiedRouteProviderDependencyWitnessed: true,
      literalArtifactGraphCycleAsserted: false,
      routeProvidersIndependentlyVerified: false,
      dependencyGraphVerifiedAcyclic: false,
      outOfBandAuthorityAnchoredNativeRoutePresent: false,
      witnessMayAuthorizeResolveOrTransmit: false,
      endpointResolved: false,
      recipientAuthenticated: false,
      authorityEstablished: false,
      decisionHandProviderVerified: false,
      authorityDecisionPerformed: false,
      routeDesignatedOrAuthorized: false,
      transportPerformed: false,
      providerVerified: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  };
}

function expectedWitness(contract, boundary) {
  const routes = compatibleRoutes(boundary).map(route =>
    expectedRouteWitness(boundary, route));
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA,
    status: routes.length === 0 ? EMPTY_WITNESS_STATUS : WITNESS_STATUS,
    sourceContract: sourceRef(contract),
    sourceR140: {
      contract: sourceRef(boundary.r140Contract),
      preflight: sourceRef(boundary.r140Preflight)
    },
    routes,
    summary: {
      sourceRequestPacketCount:
        boundary.r140Preflight.summary.sourceRequestPacketCount,
      sourceCompatibleRouteCount: routes.length,
      recursionWitnessCount: routes.length,
      routeProviderRoleClaimCount: routes.length * PROVIDER_ROLES_PER_ROUTE,
      stageCount: routes.length * STAGES_PER_ROUTE,
      independentlyAnchoredRouteCount: 0,
      independentlyVerifiedRouteProviderCount: 0,
      endpointResolvedCount: 0,
      recipientAuthenticatedCount: 0,
      authorityEstablishedCount: 0,
      decisionHandProviderVerifiedCount: 0,
      authorityDecisionCount: 0,
      routeDesignationOrAuthorizationCount: 0,
      transportPerformedCount: 0
    },
    truth: {
      exactR140CompatibleRoutesBound: true,
      recursiveUnverifiedRouteProviderDependencyWitnessed: routes.length > 0,
      literalArtifactGraphCycleAsserted: false,
      independentTrustBootstrapClosurePresent: false,
      automaticRecursiveContinuationAllowed: false,
      witnessMayAuthorizeResolveOrTransmit: false,
      endpointResolved: false,
      recipientAuthenticated: false,
      authorityEstablished: false,
      decisionHandProviderVerified: false,
      authorityDecisionPerformed: false,
      routeDesignatedOrAuthorized: false,
      transportPerformed: false,
      routeProviderVerified: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  });
}

function expectedExternalEvidence(route) {
  const allCapabilities = clone(REQUIRED_ROUTE_CAPABILITY_IDS);
  return [
    {
      routeId: route.routeId,
      evidenceId:
        'decision-hand-provider-independent-verification-closure-receipt',
      requiredCapabilityIds: clone(REQUIRED_ROUTE_CAPABILITY_IDS),
      acceptanceBoundary:
        'INDEPENDENT_NATIVE_RECEIPTS_VERIFY_THE_EXACT_R139_DECISION_HAND_CANDIDATE_BEFORE_IT_MAY_PARTICIPATE_IN_ANY_AUTHORITY_DECISION'
    },
    {
      routeId: route.routeId,
      evidenceId: 'out-of-band-route-authority-designation-receipt',
      requiredCapabilityIds: [DECISION_CAPABILITY_ID],
      acceptanceBoundary:
        'MIKE_TOBI_OR_AUTHENTICATED_HOST_GOVERNANCE_SEAT_DESIGNATES_THE_EXACT_ROUTE_WITHOUT_CANDIDATE_OR_ROUTE_PROVIDER_CONTROL'
    },
    {
      routeId: route.routeId,
      evidenceId: 'exact-request-recipient-locator-and-route-binding-receipt',
      requiredCapabilityIds: [TRUST_ANCHOR_RESOLVE_CAPABILITY_ID],
      acceptanceBoundary:
        'AUTHORITY_BINDS_EXACT_REQUEST_CANDIDATE_RECIPIENT_LOCATOR_AND_R140_DECLARATION_DIGEST'
    },
    {
      routeId: route.routeId,
      evidenceId: 'three-route-provider-identity-authority-expiry-and-revocation-receipts',
      requiredCapabilityIds: allCapabilities,
      acceptanceBoundary:
        'ALL_THREE_PROVIDER_IDENTITIES_AUTHORITY_EXPIRY_AND_REVOCATION_STATES_INDEPENDENTLY_VERIFIED'
    },
    {
      routeId: route.routeId,
      evidenceId: 'three-route-provider-implementation-integrity-and-live-availability-receipts',
      requiredCapabilityIds: allCapabilities,
      acceptanceBoundary:
        'HELD_OUT_IMPLEMENTATION_DIGEST_AND_BOUNDED_LIVE_AVAILABILITY_PROBES_PASS_FOR_ALL_THREE_PROVIDERS'
    },
    {
      routeId: route.routeId,
      evidenceId: 'non-circular-route-provider-dependency-graph-proof',
      requiredCapabilityIds: [TRUST_ANCHOR_RESOLVE_CAPABILITY_ID],
      acceptanceBoundary:
        'INDEPENDENT_PROOF_EXCLUDES_CANDIDATE_CONTROL_ROLE_COLLISION_SELF_DEPENDENCY_AND_REENTRY_THROUGH_UNVERIFIED_EQUIVALENTS'
    },
    {
      routeId: route.routeId,
      evidenceId: 'endpoint-ownership-recipient-identity-and-allowed-denied-probe-receipts',
      requiredCapabilityIds: [ENDPOINT_RESOLVE_CAPABILITY_ID,
        TRUST_ANCHOR_RESOLVE_CAPABILITY_ID],
      acceptanceBoundary:
        'INDEPENDENT_ENDPOINT_CONTROL_AND_RECIPIENT_IDENTITY_RECEIPTS_MATCH_ALLOWED_AND_DENIED_PROBES'
    },
    {
      routeId: route.routeId,
      evidenceId: 'per-request-contact-authority-and-matched-native-transport-receipts',
      requiredCapabilityIds: [TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
        SEND_RECEIVE_CAPABILITY_ID],
      acceptanceBoundary:
        'EXACT_REQUEST_AUTHORITY_AND_CONSENT_PLUS_MATCHED_NATIVE_SENDER_AND_RECEIVER_RECEIPTS'
    }
  ];
}

function expectedRouteClosure(route) {
  return {
    routeId: route.routeId,
    status:
      'BLOCKED_EXTERNAL_AUTHORITY_ANCHORED_VERIFIER_ROUTE_AND_NATIVE_RECEIPTS_REQUIRED',
    missingCapabilityIds: clone(BLOCKED_OUTCOME_CAPABILITY_IDS),
    requiredEvidenceIds: expectedExternalEvidence(route)
      .map(item => item.evidenceId),
    automaticContinuationAllowed: false,
    routeProvidersVerified: false,
    dependencyGraphVerifiedAcyclic: false,
    endpointResolved: false,
    recipientAuthenticated: false,
    authorityEstablished: false,
    decisionHandProviderVerified: false,
    authorityDecisionPerformed: false,
    routeDesignatedOrAuthorized: false,
    contactAuthorized: false,
    transportPerformed: false,
    providerVerified: false
  };
}

function expectedPreflight(contract, witness) {
  const active = witness.routes.length > 0;
  const requiredExternalEvidence = witness.routes.flatMap(
    expectedExternalEvidence);
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA,
    status: active ? BLOCKED_PREFLIGHT_STATUS : EMPTY_PREFLIGHT_STATUS,
    sourceContract: sourceRef(contract),
    sourceWitness: sourceRef(witness),
    routeClosures: witness.routes.map(expectedRouteClosure),
    capabilityGap: {
      overall: active ? 'BLOCKED' : 'NO_ACTIVE_ROUTE',
      availableAnalyticalCapabilityIds: [
        VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID
      ],
      missingCapabilityIds: active
        ? clone(BLOCKED_OUTCOME_CAPABILITY_IDS) : []
    },
    requiredExternalEvidence,
    prohibitedAutomaticContinuation: {
      createAnotherUnverifiedThreeProviderRoute: true,
      letCandidateProviderVerifyOrRouteItself: true,
      treatDistinctProviderIdentifiersAsIndependenceProof: true,
      treatCallerDependencyGraphAsAcyclicProof: true,
      treatDeclaredLocatorAsResolvedEndpoint: true,
      treatUnverifiedDecisionHandAsAuthenticatedAuthority: true,
      treatWitnessOrPreflightAsAuthorityDecisionDesignationOrTransport: true,
      persistTransientTrustBootstrapArtifacts: true
    },
    summary: {
      activeRouteCount: witness.routes.length,
      blockedRouteCount: witness.routes.length,
      routeProviderRoleClaimCount:
        witness.routes.length * PROVIDER_ROLES_PER_ROUTE,
      requiredExternalEvidenceCount: requiredExternalEvidence.length,
      authorityAnchoredRouteCount: 0,
      independentlyVerifiedRouteProviderCount: 0,
      endpointResolvedCount: 0,
      recipientAuthenticatedCount: 0,
      authorityEstablishedCount: 0,
      decisionHandProviderVerifiedCount: 0,
      authorityDecisionCount: 0,
      routeDesignationOrAuthorizationCount: 0,
      contactAuthorizedCount: 0,
      transmittedRequestCount: 0,
      senderReceiptCount: 0,
      receiverReceiptCount: 0,
      independentlyVerifiedProviderCount: 0
    },
    truth: {
      localAnalysisCapabilityReady: true,
      activeCompatibleRoutePresent: active,
      recursiveUnverifiedRouteProviderDependencyWitnessed: active,
      literalArtifactGraphCycleAsserted: false,
      allRequiredAuthorityResolverAndTransportCapabilitiesAvailable: false,
      independentlyAuthenticatedExternalEvidencePresent: false,
      trustBootstrapClosureReady: false,
      recursiveRequestGenerationPermitted: false,
      reportMayAuthorizeResolveOrTransmit: false,
      routeProvidersVerified: false,
      dependencyGraphVerifiedAcyclic: false,
      endpointResolved: false,
      recipientAuthenticated: false,
      authorityEstablished: false,
      decisionHandProviderVerified: false,
      authorityDecisionPerformed: false,
      routeDesignatedOrAuthorized: false,
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

const AUDIT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-recipient-route-trust-bootstrap-recursion-preflight-audit/v1';

export function
auditLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteTrustBootstrapRecursionPreflight(
  contract, witness, preflight, boundary) {
  const findings = [];
  if (!boundaryValid(boundary)) {
    findings.push('R140_BOUNDARY_INVALID_OR_SUBSTITUTED');
  } else {
    const reconstructedContract = expectedContract(boundary);
    if (!exact(contract, reconstructedContract)) {
      findings.push('R141_CONTRACT_NOT_EXACTLY_RECONSTRUCTED');
    }
    if (findings.length === 0) {
      const reconstructedWitness = expectedWitness(contract, boundary);
      if (!exact(witness, reconstructedWitness)) {
        findings.push('R141_WITNESS_NOT_EXACTLY_RECONSTRUCTED');
      }
      if (findings.length === 0 &&
          !exact(preflight, expectedPreflight(contract, witness))) {
        findings.push('R141_PREFLIGHT_NOT_EXACTLY_RECONSTRUCTED');
      }
    }
  }
  if (!witness || typeof witness !== 'object' || Array.isArray(witness) ||
      new TextEncoder().encode(JSON.stringify(witness)).length >
        MAXIMUM_SERIALIZED_WITNESS_BYTES) {
    findings.push('WITNESS_RESOURCE_CEILING_EXCEEDED_OR_INVALID');
  }
  if (!preflight || typeof preflight !== 'object' || Array.isArray(preflight) ||
      new TextEncoder().encode(JSON.stringify(preflight)).length >
        MAXIMUM_SERIALIZED_PREFLIGHT_BYTES) {
    findings.push('PREFLIGHT_RESOURCE_CEILING_EXCEEDED_OR_INVALID');
  }
  const uniqueFindings = [...new Set(findings)];
  return withDigest({
    schema: AUDIT_SCHEMA,
    status: uniqueFindings.length === 0 ? 'PASS' : 'FAIL',
    source: {
      contract: contract && typeof contract === 'object'
        ? sourceRef(contract) : null,
      witness: witness && typeof witness === 'object'
        ? sourceRef(witness) : null,
      preflight: preflight && typeof preflight === 'object'
        ? sourceRef(preflight) : null
    },
    findings: uniqueFindings,
    summary: {
      activeRouteCount: Array.isArray(witness?.routes)
        ? witness.routes.length : 0,
      routeProviderRoleClaimCount: Array.isArray(witness?.routes)
        ? witness.routes.length * PROVIDER_ROLES_PER_ROUTE : 0,
      authorityAnchoredRouteCount: 0,
      independentlyVerifiedRouteProviderCount: 0,
      endpointResolvedCount: 0,
      recipientAuthenticatedCount: 0,
      authorityEstablishedCount: 0,
      decisionHandProviderVerifiedCount: 0,
      authorityDecisionCount: 0,
      routeDesignationOrAuthorizationCount: 0,
      contactAuthorizedCount: 0,
      transmittedRequestCount: 0,
      senderReceiptCount: 0,
      receiverReceiptCount: 0,
      providerVerifiedCount: 0,
      evidenceAdmittedCount: 0,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  });
}
