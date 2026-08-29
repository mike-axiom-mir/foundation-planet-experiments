import {
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_RESOLUTION_PREFLIGHT_SCHEMA,
  landMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflightContractReceiptValid,
  landMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflightValid
} from './matrix-thermal-verifier-route-provider-verification-recipient-route-resolution-preflight.mjs?v=0.134.0-r134.1';

export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-provider-trust-bootstrap-recursion-preflight-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-provider-trust-bootstrap-recursion-witness/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-provider-trust-bootstrap-closure-preflight/v1';

export const
  VERIFIER_ROUTE_PROVIDER_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID =
    'analysis.foundation-planet.external-provider-verification.verifier-route.provider.trust-bootstrap.recursion.detect';

const ENDPOINT_RESOLVE_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.endpoint.resolve';
const TRUST_ANCHOR_RESOLVE_CAPABILITY_ID =
  'authority.foundation-planet.external-provider-verification.verifier-route.trust-anchor.resolve';
const SEND_RECEIVE_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.request.send-receive';
const REQUIRED_ROUTE_CAPABILITY_IDS = [ENDPOINT_RESOLVE_CAPABILITY_ID,
  TRUST_ANCHOR_RESOLVE_CAPABILITY_ID, SEND_RECEIVE_CAPABILITY_ID];
const CONTRACT_STATUS =
  'VERIFIER_ROUTE_PROVIDER_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_AVAILABLE';
const EMPTY_WITNESS_STATUS =
  'NO_COMPATIBLE_VERIFIER_ROUTE_PROVIDER_ROUTE_RECURSION_WITNESS_EMPTY';
const WITNESS_STATUS =
  'RECURSIVE_UNVERIFIED_VERIFIER_ROUTE_PROVIDER_DEPENDENCY_WITNESSED';
const EMPTY_PREFLIGHT_STATUS =
  'NO_COMPATIBLE_VERIFIER_ROUTE_PROVIDER_TRUST_BOOTSTRAP_PREFLIGHT_EMPTY';
const BLOCKED_PREFLIGHT_STATUS =
  'BLOCKED_RECURSIVE_UNVERIFIED_VERIFIER_ROUTE_PROVIDER_DEPENDENCY';
const RECURSION_PATTERN =
  'UNVERIFIED_VERIFIER_ROUTE_PROVIDERS_REQUIRE_VERIFICATION_REQUESTS_WHOSE_RECIPIENT_ROUTES_REQUIRE_THE_SAME_UNVERIFIED_PROVIDER_CLASSES';
const CLOSURE_REASON =
  'NO_INDEPENDENT_OUT_OF_BAND_AUTHORITY_ANCHORED_VERIFIER_ROUTE_WITH_NATIVE_MATCHED_RECEIPTS';
const MAXIMUM_ROUTES = 2;
const PROVIDER_ROLES_PER_ROUTE = 3;
const STAGES_PER_ROUTE = 6;
const EVIDENCE_REQUIREMENTS_PER_ROUTE = 7;
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
  return exactKeys(boundary, ['r134Contract', 'r134Preflight',
    'r134Custody', 'r134Declarations']) &&
    landMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflightContractReceiptValid(
      boundary.r134Contract, boundary.r134Custody) &&
    landMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflightValid(
      boundary.r134Preflight, boundary.r134Contract, boundary.r134Custody,
      boundary.r134Declarations);
}

const compatibleRoutes = boundary => boundary.r134Preflight.routes.filter(route =>
  route.status === 'RECIPIENT_ROUTE_CONTRACT_COMPATIBLE_UNVERIFIED');

function expectedContract(boundary) {
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
    status: CONTRACT_STATUS,
    sourceR134: {
      contract: sourceRef(boundary.r134Contract),
      preflight: sourceRef(boundary.r134Preflight)
    },
    projection: {
      sourceRequestPacketCount:
        boundary.r134Preflight.summary.sourceRequestPacketCount,
      sourceCompatibleRouteCount: compatibleRoutes(boundary).length,
      providerRolesPerRoute: PROVIDER_ROLES_PER_ROUTE,
      recursionWitnessSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA,
      closurePreflightSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA,
      recurringCapabilityIds: clone(REQUIRED_ROUTE_CAPABILITY_IDS),
      implementedAnalyticalCapabilityId:
        VERIFIER_ROUTE_PROVIDER_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID
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
      exactR134ContractPreflightDeclarationsAndCustodyBound: true,
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
      transportPerformed: false,
      routeProviderVerified: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  });
}

export function
createLandMatrixThermalVerifierRouteProviderTrustBootstrapRecursionPreflightContractReceipt(
  boundary) {
  if (!boundaryValid(boundary)) {
    throw new Error('R135 recursion contract needs the exact R134 boundary');
  }
  return expectedContract(boundary);
}

export function
landMatrixThermalVerifierRouteProviderTrustBootstrapRecursionPreflightContractReceiptValid(
  contract, boundary) {
  return boundaryValid(boundary) && exact(contract, expectedContract(boundary));
}

function expectedStages(boundary, route) {
  return [
    {
      ordinal: 1,
      role: 'R133_PROVIDER_VERIFICATION_REQUEST_RECIPIENT_ROUTE_UNRESOLVED',
      sourceArtifact: sourceRef(boundary.r134Custody.r133Batch),
      requiredCapabilityIds: clone(REQUIRED_ROUTE_CAPABILITY_IDS),
      independentlyVerified: false
    },
    {
      ordinal: 2,
      role: 'R134_CALLER_DECLARED_THREE_PROVIDER_ROUTE_UNVERIFIED',
      sourceArtifact: sourceRef(boundary.r134Preflight),
      requiredCapabilityIds: clone(REQUIRED_ROUTE_CAPABILITY_IDS),
      independentlyVerified: false
    },
    {
      ordinal: 3,
      role: 'ROUTE_PROVIDERS_REQUIRE_INDEPENDENT_IDENTITY_AUTHORITY_IMPLEMENTATION_AND_AVAILABILITY_PROOF',
      sourceArtifact: sourceRef(boundary.r134Contract),
      requiredCapabilityIds: clone(REQUIRED_ROUTE_CAPABILITY_IDS),
      independentlyVerified: false
    },
    {
      ordinal: 4,
      role: 'ROUTE_PROVIDER_VERIFICATION_REQUESTS_REQUIRE_INDEPENDENT_RECIPIENT_ROUTES',
      sourceArtifact: sourceRef(boundary.r134Contract),
      requiredCapabilityIds: clone(REQUIRED_ROUTE_CAPABILITY_IDS),
      independentlyVerified: false
    },
    {
      ordinal: 5,
      role: 'ANOTHER_UNVERIFIED_THREE_PROVIDER_ROUTE_REENTERS_THE_SAME_DEPENDENCY_CLASS',
      sourceArtifact: sourceRef(boundary.r134Preflight),
      requiredCapabilityIds: clone(REQUIRED_ROUTE_CAPABILITY_IDS),
      independentlyVerified: false
    },
    {
      ordinal: 6,
      role: 'OUT_OF_BAND_AUTHORITY_ANCHORED_NATIVE_ROUTE_REQUIRED_TO_TERMINATE_RECURSION',
      sourceArtifact: {
        schema: 'axm.foundation-planet.external-verifier-route-provider-trust-bootstrap-boundary/v1',
        receiptDigest: stableDigest({
          requestId: route.requestId,
          candidateProviderId: route.candidateProviderId,
          claimedVerificationRecipientId:
            route.claimedVerificationRecipientId,
          requiredCapabilityIds: REQUIRED_ROUTE_CAPABILITY_IDS
        })
      },
      requiredCapabilityIds: clone(REQUIRED_ROUTE_CAPABILITY_IDS),
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
  const assessment = boundary.r134Preflight.assessments.find(item =>
    item.requestId === route.requestId &&
    item.status === 'RECIPIENT_ROUTE_CONTRACT_COMPATIBLE_UNVERIFIED');
  return {
    routeId: route.requestId + '.verifier-route-provider-trust-bootstrap',
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
      exactR134CompatibleRouteBound: true,
      recursiveUnverifiedRouteProviderDependencyWitnessed: true,
      literalArtifactGraphCycleAsserted: false,
      routeProvidersIndependentlyVerified: false,
      dependencyGraphVerifiedAcyclic: false,
      outOfBandAuthorityAnchoredNativeRoutePresent: false,
      witnessMayAuthorizeResolveOrTransmit: false,
      endpointResolved: false,
      recipientAuthenticated: false,
      authorityEstablished: false,
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
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA,
    status: routes.length === 0 ? EMPTY_WITNESS_STATUS : WITNESS_STATUS,
    sourceContract: sourceRef(contract),
    sourceR134: {
      contract: sourceRef(boundary.r134Contract),
      preflight: sourceRef(boundary.r134Preflight)
    },
    routes,
    summary: {
      sourceRequestPacketCount:
        boundary.r134Preflight.summary.sourceRequestPacketCount,
      sourceCompatibleRouteCount: routes.length,
      recursionWitnessCount: routes.length,
      routeProviderRoleClaimCount: routes.length * PROVIDER_ROLES_PER_ROUTE,
      stageCount: routes.length * STAGES_PER_ROUTE,
      independentlyAnchoredRouteCount: 0,
      independentlyVerifiedRouteProviderCount: 0,
      endpointResolvedCount: 0,
      recipientAuthenticatedCount: 0,
      authorityEstablishedCount: 0,
      transportPerformedCount: 0
    },
    truth: {
      exactR134CompatibleRoutesBound: true,
      recursiveUnverifiedRouteProviderDependencyWitnessed: routes.length > 0,
      literalArtifactGraphCycleAsserted: false,
      independentTrustBootstrapClosurePresent: false,
      automaticRecursiveContinuationAllowed: false,
      witnessMayAuthorizeResolveOrTransmit: false,
      endpointResolved: false,
      recipientAuthenticated: false,
      authorityEstablished: false,
      transportPerformed: false,
      routeProviderVerified: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  });
}

export function
createLandMatrixThermalVerifierRouteProviderTrustBootstrapRecursionWitness(
  contract, boundary) {
  if (!landMatrixThermalVerifierRouteProviderTrustBootstrapRecursionPreflightContractReceiptValid(
      contract, boundary)) {
    throw new Error('R135 recursion witness needs the exact contract and R134 boundary');
  }
  const witness = expectedWitness(contract, boundary);
  if (new TextEncoder().encode(JSON.stringify(witness)).length >
      MAXIMUM_SERIALIZED_WITNESS_BYTES) {
    throw new Error('R135 recursion witness exceeds its resource ceiling');
  }
  return witness;
}

export function
landMatrixThermalVerifierRouteProviderTrustBootstrapRecursionWitnessValid(
  witness, contract, boundary) {
  return landMatrixThermalVerifierRouteProviderTrustBootstrapRecursionPreflightContractReceiptValid(
    contract, boundary) &&
    new TextEncoder().encode(JSON.stringify(witness)).length <=
      MAXIMUM_SERIALIZED_WITNESS_BYTES &&
    exact(witness, expectedWitness(contract, boundary));
}

function expectedExternalEvidence(route) {
  const allCapabilities = clone(REQUIRED_ROUTE_CAPABILITY_IDS);
  return [
    {
      routeId: route.routeId,
      evidenceId: 'out-of-band-route-authority-designation-receipt',
      requiredCapabilityIds: [TRUST_ANCHOR_RESOLVE_CAPABILITY_ID],
      acceptanceBoundary:
        'MIKE_TOBI_OR_AUTHENTICATED_HOST_GOVERNANCE_SEAT_DESIGNATES_THE_EXACT_ROUTE_WITHOUT_CANDIDATE_OR_ROUTE_PROVIDER_CONTROL'
    },
    {
      routeId: route.routeId,
      evidenceId: 'exact-request-recipient-locator-and-route-binding-receipt',
      requiredCapabilityIds: [TRUST_ANCHOR_RESOLVE_CAPABILITY_ID],
      acceptanceBoundary:
        'AUTHORITY_BINDS_EXACT_REQUEST_CANDIDATE_RECIPIENT_LOCATOR_AND_R134_DECLARATION_DIGEST'
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
    missingCapabilityIds: clone(REQUIRED_ROUTE_CAPABILITY_IDS),
    requiredEvidenceIds: expectedExternalEvidence(route)
      .map(item => item.evidenceId),
    automaticContinuationAllowed: false,
    routeProvidersVerified: false,
    dependencyGraphVerifiedAcyclic: false,
    endpointResolved: false,
    recipientAuthenticated: false,
    authorityEstablished: false,
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
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA,
    status: active ? BLOCKED_PREFLIGHT_STATUS : EMPTY_PREFLIGHT_STATUS,
    sourceContract: sourceRef(contract),
    sourceWitness: sourceRef(witness),
    routeClosures: witness.routes.map(expectedRouteClosure),
    capabilityGap: {
      overall: active ? 'BLOCKED' : 'NO_ACTIVE_ROUTE',
      availableAnalyticalCapabilityIds: [
        VERIFIER_ROUTE_PROVIDER_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID
      ],
      missingCapabilityIds: active ? clone(REQUIRED_ROUTE_CAPABILITY_IDS) : []
    },
    requiredExternalEvidence,
    prohibitedAutomaticContinuation: {
      createAnotherUnverifiedThreeProviderRoute: true,
      letCandidateProviderVerifyOrRouteItself: true,
      treatDistinctProviderIdentifiersAsIndependenceProof: true,
      treatCallerDependencyGraphAsAcyclicProof: true,
      treatDeclaredLocatorAsResolvedEndpoint: true,
      treatWitnessOrPreflightAsAuthorityResolutionOrTransport: true,
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
createLandMatrixThermalVerifierRouteProviderTrustBootstrapClosurePreflight(
  contract, witness, boundary) {
  if (!landMatrixThermalVerifierRouteProviderTrustBootstrapRecursionWitnessValid(
      witness, contract, boundary)) {
    throw new Error('R135 closure preflight needs the exact witness and R134 boundary');
  }
  const preflight = expectedPreflight(contract, witness);
  if (new TextEncoder().encode(JSON.stringify(preflight)).length >
      MAXIMUM_SERIALIZED_PREFLIGHT_BYTES) {
    throw new Error('R135 closure preflight exceeds its resource ceiling');
  }
  return preflight;
}

export function
landMatrixThermalVerifierRouteProviderTrustBootstrapClosurePreflightValid(
  preflight, contract, witness, boundary) {
  return landMatrixThermalVerifierRouteProviderTrustBootstrapRecursionWitnessValid(
    witness, contract, boundary) &&
    new TextEncoder().encode(JSON.stringify(preflight)).length <=
      MAXIMUM_SERIALIZED_PREFLIGHT_BYTES &&
    exact(preflight, expectedPreflight(contract, witness));
}

export function
matrixThermalVerifierRouteProviderTrustBootstrapRecursionPreflightDescription() {
  return {
    status: 'EXPERIMENTAL',
    capabilityId:
      VERIFIER_ROUTE_PROVIDER_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID,
    statement:
      'R135 exact-binds the R134 boundary, witnesses when verifying its three untrusted route-provider roles would require recipient routes built from the same unverified capability classes, and blocks automatic chaining pending an out-of-band authority-anchored native route with matched receipts.',
    boundaries: [
      'The current real R134 compatible-route inventory is empty, so the current recursion witness and closure preflight are empty.',
      'This is deterministic dependency-class analysis, not a claim of a literal artifact-graph cycle or proof that every external provider implementation is recursive.',
      'No route provider is verified or selected, no endpoint or recipient is resolved or authenticated, and no authority, contact, transport, receipt, provider verification, evidence admission, historical owner/debit closure, persistence, promotion, canonization, or world mutation is produced.'
    ]
  };
}
