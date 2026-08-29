import {
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA,
  landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestContractReceiptValid,
  landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestBatchValid
} from './matrix-thermal-verifier-route-trust-anchor-and-transport-provider-verification-request.mjs?v=0.133.0-r133.1';

export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-provider-verification-recipient-route-resolution-preflight-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_DECLARATION_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-provider-verification-recipient-route-declaration/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_ASSESSMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-provider-verification-recipient-route-assessment/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_RESOLUTION_PREFLIGHT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-provider-verification-recipient-route-resolution-preflight/v1';

export const
  VERIFIER_ROUTE_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_RESOLUTION_PREFLIGHT_EVALUATE_CAPABILITY_ID =
    'contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.verifier-route.trust-anchor-and-transport.provider.verification.recipient-route-resolution.preflight.evaluate';

const ENDPOINT_RESOLVE_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.endpoint.resolve';
const TRUST_ANCHOR_RESOLVE_CAPABILITY_ID =
  'authority.foundation-planet.external-provider-verification.verifier-route.trust-anchor.resolve';
const SEND_RECEIVE_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.request.send-receive';
const CONTRACT_STATUS =
  'VERIFIER_ROUTE_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_RESOLUTION_PREFLIGHT_CONTRACT_AVAILABLE';
const EMPTY_STATUS =
  'NO_VERIFIER_ROUTE_PROVIDER_VERIFICATION_REQUESTS_RECIPIENT_ROUTE_PREFLIGHT_EMPTY';
const NO_DECLARATIONS_STATUS =
  'VERIFIER_ROUTE_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_UNRESOLVED_NO_DECLARATIONS';
const ASSESSED_STATUS =
  'VERIFIER_ROUTE_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_DECLARATIONS_ASSESSED_UNVERIFIED';
const COMPATIBLE_ASSESSMENT_STATUS =
  'RECIPIENT_ROUTE_CONTRACT_COMPATIBLE_UNVERIFIED';
const REJECTED_ASSESSMENT_STATUS =
  'RECIPIENT_ROUTE_DECLARATION_REJECTED';
const MAXIMUM_ROUTE_DECLARATIONS = 4;
const MAXIMUM_DECLARATIONS_PER_REQUEST = 2;
const MAXIMUM_DECLARED_DEPENDENCIES = 12;
const MAXIMUM_SERIALIZED_DECLARATION_BYTES = 131072;
const MAXIMUM_SERIALIZED_PREFLIGHT_BYTES = 524288;
const clone = value => JSON.parse(JSON.stringify(value));
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const exactKeys = (value, keys) => value && typeof value === 'object' &&
  !Array.isArray(value) && exact(Object.keys(value).sort(), [...keys].sort());
const providerIdValid = value => typeof value === 'string' &&
  /^[a-z0-9][a-z0-9._:-]{2,127}$/.test(value);
const providerVersionValid = value => typeof value === 'string' &&
  /^[0-9]+\.[0-9]+\.[0-9]+(?:-[a-z0-9.-]+)?$/.test(value);

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

function custodyValid(custody) {
  return exactKeys(custody, ['r133Contract', 'r133Batch',
    'r133Custody', 'r133Options']) &&
    landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestContractReceiptValid(
      custody.r133Contract, custody.r133Custody) &&
    landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestBatchValid(
      custody.r133Batch, custody.r133Contract, custody.r133Custody,
      custody.r133Options);
}

function expectedContractTruth() {
  return {
    exactR133ContractBatchRequestsAndCustodyBound: true,
    recipientRouteDeclarationsMayBeStructurallyEvaluated: true,
    candidateProviderMaySatisfyOwnVerificationRoute: false,
    callerDeclaredRouteProvidersMayProveIndependence: false,
    routeDeclarationMayResolveOrTrustEndpointRecipientOrAuthority: false,
    routeDeclarationMayAuthorizeContactOrTransport: false,
    transportPerformed: false,
    providerVerified: false,
    historicalPhysicalSourceOwnersResolved: false,
    historicalPhysicalSourceOwnersDebited: false,
    evidenceAdmitted: false,
    persistencePerformed: false,
    worldMutationPerformed: false
  };
}

function expectedContract(custody) {
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
    status: CONTRACT_STATUS,
    sourceR133: {
      contract: sourceRef(custody.r133Contract),
      requestBatch: sourceRef(custody.r133Batch)
    },
    projection: {
      sourceRequestPacketCount: custody.r133Batch.packets.length,
      routeDeclarationSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_DECLARATION_SCHEMA,
      routeAssessmentSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_ASSESSMENT_SCHEMA,
      routePreflightSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_RESOLUTION_PREFLIGHT_SCHEMA,
      requiredRouteCapabilityIds: [
        ENDPOINT_RESOLVE_CAPABILITY_ID,
        TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
        SEND_RECEIVE_CAPABILITY_ID
      ],
      implementedContractCapabilityId:
        VERIFIER_ROUTE_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_RESOLUTION_PREFLIGHT_EVALUATE_CAPABILITY_ID
    },
    resourceBudget: {
      maximumRouteDeclarations: MAXIMUM_ROUTE_DECLARATIONS,
      maximumDeclarationsPerRequest: MAXIMUM_DECLARATIONS_PER_REQUEST,
      maximumDeclaredDependencies: MAXIMUM_DECLARED_DEPENDENCIES,
      maximumSerializedDeclarationBytes:
        MAXIMUM_SERIALIZED_DECLARATION_BYTES,
      maximumSerializedPreflightBytes: MAXIMUM_SERIALIZED_PREFLIGHT_BYTES
    },
    truth: expectedContractTruth()
  });
}

export function
createLandMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflightContractReceipt(
  custody) {
  if (!custodyValid(custody)) {
    throw new Error('R134 recipient-route contract needs the exact R133 custody');
  }
  return expectedContract(custody);
}

export function
landMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflightContractReceiptValid(
  contract, custody) {
  return custodyValid(custody) && exact(contract, expectedContract(custody));
}

function locatorValid(locator) {
  if (!exactKeys(locator, ['kind', 'value', 'trust']) ||
      locator.trust !== 'CALLER_SUPPLIED_UNVERIFIED' ||
      typeof locator.value !== 'string' || locator.value.length < 4 ||
      locator.value.length > 512) return false;
  if (locator.kind === 'HUMAN_REVIEW_ROUTE') {
    return /^human-review:[a-z0-9][a-z0-9._/-]{2,191}$/.test(locator.value);
  }
  if (locator.kind === 'HOST_GOVERNANCE_ROUTE') {
    return /^host-governance:[a-z0-9][a-z0-9._/-]{2,191}$/.test(locator.value);
  }
  if (locator.kind !== 'HTTPS_URI') return false;
  try {
    const parsed = new URL(locator.value);
    return parsed.protocol === 'https:' && parsed.hostname.length > 0 &&
      parsed.username === '' && parsed.password === '' &&
      parsed.search === '' && parsed.hash === '' &&
      parsed.href === locator.value;
  } catch {
    return false;
  }
}

function routeProviderClaimValid(claim, capabilityId, dependencies) {
  return exactKeys(claim, ['providerId', 'providerVersion', 'capabilityId',
    'identityTrust', 'relationToCandidate', 'status',
    'declaredDependencyProviderIds']) &&
    providerIdValid(claim.providerId) &&
    providerVersionValid(claim.providerVersion) &&
    claim.capabilityId === capabilityId &&
    claim.identityTrust === 'CALLER_SUPPLIED_UNTRUSTED' &&
    claim.relationToCandidate === 'CLAIMED_DISTINCT_UNVERIFIED' &&
    claim.status === 'CALLER_DECLARED_UNVERIFIED' &&
    exact(claim.declaredDependencyProviderIds, dependencies);
}

function declarationReasonCodes(declaration, custody) {
  if (!declaration || typeof declaration !== 'object' ||
      Array.isArray(declaration) || !exactKeys(declaration, [
        'schema', 'requestId', 'requestPacketDigest', 'candidateProvider',
        'claimedVerificationRecipient', 'locator', 'routeProviders',
        'resolutionWindow', 'verificationPlan', 'permissionsAndConsent',
        'lifecycle', 'digest'])) return ['DECLARATION_SHAPE_INVALID'];
  const reasons = [];
  const unsigned = clone(declaration);
  delete unsigned.digest;
  if (declaration.schema !==
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_DECLARATION_SCHEMA ||
      declaration.digest !== stableDigest(unsigned)) {
    reasons.push('DECLARATION_DIGEST_INVALID');
  }
  const packet = custody.r133Batch.packets.find(item =>
    item.requestId === declaration.requestId);
  if (!packet) {
    reasons.push('UNKNOWN_REQUEST');
    return [...new Set(reasons)].sort();
  }
  if (declaration.requestPacketDigest !== packet.digest) {
    reasons.push('REQUEST_PACKET_DIGEST_MISMATCH');
  }
  if (!exact(declaration.candidateProvider, {
    providerId: packet.claimedProvider.providerId,
    providerClass: packet.claimedProvider.providerClass,
    capabilityId: packet.claimedProvider.capabilityId,
    declarationDigest: packet.requestBinding.declarationDigest
  })) reasons.push('CANDIDATE_PROVIDER_BINDING_MISMATCH');
  if (!exact(declaration.claimedVerificationRecipient, {
    recipientId: packet.recipientRoute.claimedVerifierId,
    identityTrust: 'CALLER_SUPPLIED_UNTRUSTED'
  })) reasons.push('VERIFICATION_RECIPIENT_BINDING_MISMATCH');
  if (!locatorValid(declaration.locator)) {
    reasons.push('LOCATOR_INVALID_OR_UNSAFE');
  }
  const route = declaration.routeProviders;
  if (!exactKeys(route, ['endpointResolver', 'trustAnchorAuthority',
      'transport'])) {
    reasons.push('ROUTE_PROVIDER_SET_INVALID');
  } else {
    const endpoint = route.endpointResolver;
    const authority = route.trustAnchorAuthority;
    const transport = route.transport;
    if (!routeProviderClaimValid(endpoint, ENDPOINT_RESOLVE_CAPABILITY_ID, [])) {
      reasons.push('ENDPOINT_RESOLVER_CLAIM_INVALID');
    }
    if (!routeProviderClaimValid(authority,
        TRUST_ANCHOR_RESOLVE_CAPABILITY_ID, [])) {
      reasons.push('TRUST_ANCHOR_AUTHORITY_CLAIM_INVALID');
    }
    if (!exactKeys(transport, ['providerId', 'providerVersion',
        'capabilityId', 'identityTrust', 'relationToCandidate', 'status',
        'declaredDependencyProviderIds',
        'prerequisiteAuthorityProviderId']) ||
        !routeProviderClaimValid({
          providerId: transport.providerId,
          providerVersion: transport.providerVersion,
          capabilityId: transport.capabilityId,
          identityTrust: transport.identityTrust,
          relationToCandidate: transport.relationToCandidate,
          status: transport.status,
          declaredDependencyProviderIds:
            transport.declaredDependencyProviderIds
        }, SEND_RECEIVE_CAPABILITY_ID,
        [endpoint?.providerId, authority?.providerId]) ||
        transport.prerequisiteAuthorityProviderId !== authority?.providerId) {
      reasons.push('TRANSPORT_PROVIDER_CLAIM_OR_PREREQUISITE_INVALID');
    }
    const providerIds = [endpoint?.providerId, authority?.providerId,
      transport?.providerId];
    if (providerIds.some(id => !providerIdValid(id)) ||
        new Set(providerIds).size !== providerIds.length) {
      reasons.push('ROUTE_PROVIDER_ROLE_COLLISION_PROHIBITED');
    }
    if (providerIds.includes(packet.claimedProvider.providerId)) {
      reasons.push('DIRECT_CANDIDATE_SELF_ROUTING_PROHIBITED');
    }
    const dependencies = [
      ...(endpoint?.declaredDependencyProviderIds || []),
      ...(authority?.declaredDependencyProviderIds || []),
      ...(transport?.declaredDependencyProviderIds || [])
    ];
    if (dependencies.length > MAXIMUM_DECLARED_DEPENDENCIES ||
        dependencies.includes(packet.claimedProvider.providerId) ||
        endpoint?.declaredDependencyProviderIds?.includes(endpoint.providerId) ||
        authority?.declaredDependencyProviderIds?.includes(authority.providerId) ||
        transport?.declaredDependencyProviderIds?.includes(transport.providerId)) {
      reasons.push('CIRCULAR_OR_CANDIDATE_DEPENDENCY_PROHIBITED');
    }
  }
  const window = declaration.resolutionWindow;
  const declaredAt = Date.parse(window?.declaredAt);
  const validUntil = Date.parse(window?.validUntil);
  const requestStart = Date.parse(packet.requestWindow.requestedAt);
  const requestEnd = Date.parse(packet.requestWindow.expiresAt);
  if (!exactKeys(window, ['declaredAt', 'validUntil']) ||
      !Number.isFinite(declaredAt) || !Number.isFinite(validUntil) ||
      new Date(declaredAt).toISOString() !== window.declaredAt ||
      new Date(validUntil).toISOString() !== window.validUntil ||
      declaredAt < requestStart || validUntil <= declaredAt ||
      validUntil > requestEnd) reasons.push('RESOLUTION_WINDOW_INVALID');
  if (!exact(declaration.verificationPlan, {
    independentRouteProviderIdentityAndAuthorityRequired: true,
    routeProviderImplementationAndAvailabilityRequired: true,
    nonCircularDependencyGraphProofRequired: true,
    independentEndpointOwnershipReceiptRequired: true,
    independentRecipientIdentityReceiptRequired: true,
    allowedAndDeniedRecipientProbesRequired: true,
    senderAndReceiverReceiptMatchRequired: true
  })) reasons.push('VERIFICATION_PLAN_INVALID');
  if (!exact(declaration.permissionsAndConsent, {
    routeProvidersMayContactEndpoint: false,
    routeProvidersMayContactHuman: false,
    candidateProviderMaySatisfyOwnVerificationRoute: false,
    declarationMayAuthorizeContactOrTransport: false,
    routeProvidersMayMutateHost: false,
    routeProvidersMayPersist: false
  })) reasons.push('PERMISSION_BOUNDARY_INVALID');
  if (!exact(declaration.lifecycle, {
    status: 'VERIFICATION_RECIPIENT_ROUTE_CANDIDATE_UNTRUSTED',
    endpointResolved: false,
    recipientAuthenticated: false,
    authorityEstablished: false,
    transportPerformed: false,
    persisted: false,
    promoted: false,
    canon: false
  })) reasons.push('LIFECYCLE_INVALID');
  if (new TextEncoder().encode(JSON.stringify(declaration)).length >
      MAXIMUM_SERIALIZED_DECLARATION_BYTES) {
    reasons.push('DECLARATION_RESOURCE_CEILING_EXCEEDED');
  }
  return [...new Set(reasons)].sort();
}

function declarationsValid(declarations, packetCount) {
  if (!Array.isArray(declarations) || declarations.length >
      MAXIMUM_ROUTE_DECLARATIONS) return false;
  const requestIds = declarations.map(item => item?.requestId)
    .filter(value => typeof value === 'string');
  return new Set(requestIds).size <= packetCount &&
    [...new Set(requestIds)].every(requestId =>
      requestIds.filter(value => value === requestId).length <=
        MAXIMUM_DECLARATIONS_PER_REQUEST);
}

function expectedAssessment(declaration, inputIndex, custody) {
  const reasonCodes = declarationReasonCodes(declaration, custody);
  const valid = reasonCodes.length === 0;
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_ASSESSMENT_SCHEMA,
    inputIndex,
    requestId: typeof declaration?.requestId === 'string'
      ? declaration.requestId : null,
    requestPacketDigest: valid ? declaration.requestPacketDigest : null,
    candidateProviderId: valid
      ? declaration.candidateProvider.providerId : null,
    claimedVerificationRecipientId: valid
      ? declaration.claimedVerificationRecipient.recipientId : null,
    endpointResolverProviderId: valid
      ? declaration.routeProviders.endpointResolver.providerId : null,
    trustAnchorAuthorityProviderId: valid
      ? declaration.routeProviders.trustAnchorAuthority.providerId : null,
    transportProviderId: valid
      ? declaration.routeProviders.transport.providerId : null,
    claimedLocatorKind: valid ? declaration.locator.kind : null,
    claimedLocatorValue: valid ? declaration.locator.value : null,
    declarationDigest: typeof declaration?.digest === 'string'
      ? declaration.digest : null,
    status: valid ? COMPATIBLE_ASSESSMENT_STATUS
      : REJECTED_ASSESSMENT_STATUS,
    reasonCodes,
    truth: {
      declarationStructurallyCompatible: valid,
      routeProviderIndependenceVerified: false,
      dependencyGraphVerifiedAcyclic: false,
      endpointResolved: false,
      recipientIdentityAuthenticated: false,
      authorityEstablished: false,
      contactAuthorized: false,
      transportPerformed: false,
      providerVerified: false,
      evidenceAdmitted: false,
      worldMutationPerformed: false
    }
  });
}

function expectedRouteRow(packet, assessments) {
  const matching = assessments.filter(item => item.requestId === packet.requestId);
  const compatible = matching.filter(item =>
    item.status === COMPATIBLE_ASSESSMENT_STATUS);
  const status = matching.length === 0
    ? 'MISSING_RECIPIENT_ROUTE_DECLARATION'
    : compatible.length === 0
      ? 'REJECTED_RECIPIENT_ROUTE_DECLARATION'
      : compatible.length === 1
        ? 'RECIPIENT_ROUTE_CONTRACT_COMPATIBLE_UNVERIFIED'
        : 'AMBIGUOUS_RECIPIENT_ROUTE_DECLARATION';
  const selected = compatible.length === 1 ? compatible[0] : null;
  return {
    requestId: packet.requestId,
    requestPacketDigest: packet.digest,
    candidateProviderId: packet.claimedProvider.providerId,
    claimedVerificationRecipientId: packet.recipientRoute.claimedVerifierId,
    declarationInputIndexes: matching.map(item => item.inputIndex),
    status,
    endpointResolverProviderId:
      selected?.endpointResolverProviderId || null,
    trustAnchorAuthorityProviderId:
      selected?.trustAnchorAuthorityProviderId || null,
    transportProviderId: selected?.transportProviderId || null,
    claimedLocatorKind: selected?.claimedLocatorKind || null,
    claimedLocatorValue: selected?.claimedLocatorValue || null,
    blockingReasons: status === 'MISSING_RECIPIENT_ROUTE_DECLARATION'
      ? ['RECIPIENT_ROUTE_DECLARATION_REQUIRED']
      : status === 'REJECTED_RECIPIENT_ROUTE_DECLARATION'
        ? ['ALL_RECIPIENT_ROUTE_DECLARATIONS_REJECTED']
        : status === 'AMBIGUOUS_RECIPIENT_ROUTE_DECLARATION'
          ? ['MULTIPLE_COMPATIBLE_RECIPIENT_ROUTE_DECLARATIONS']
          : [
            'INDEPENDENT_ROUTE_PROVIDER_IDENTITY_AND_AUTHORITY_REQUIRED',
            'ROUTE_PROVIDER_IMPLEMENTATION_AND_AVAILABILITY_REQUIRED',
            'NON_CIRCULAR_DEPENDENCY_GRAPH_PROOF_REQUIRED',
            'INDEPENDENT_ENDPOINT_OWNERSHIP_REQUIRED',
            'INDEPENDENT_VERIFICATION_RECIPIENT_IDENTITY_REQUIRED',
            'CONTACT_AUTHORIZATION_REQUIRED',
            'MATCHED_SENDER_AND_RECEIVER_RECEIPTS_REQUIRED'
          ],
    operationalReadiness: 'BLOCKED',
    truth: {
      candidateSelfRoutingUsed: false,
      routeProviderIndependenceVerified: false,
      dependencyGraphVerifiedAcyclic: false,
      endpointResolved: false,
      recipientIdentityAuthenticated: false,
      authorityEstablished: false,
      contactAuthorized: false,
      transportPerformed: false,
      receiverReceiptObserved: false,
      providerVerified: false,
      evidenceAdmitted: false
    }
  };
}

function expectedPreflight(contract, custody, declarations) {
  const assessments = declarations.map((declaration, inputIndex) =>
    expectedAssessment(declaration, inputIndex, custody));
  const routes = custody.r133Batch.packets.map(packet =>
    expectedRouteRow(packet, assessments));
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_RESOLUTION_PREFLIGHT_SCHEMA,
    status: routes.length === 0 ? EMPTY_STATUS
      : declarations.length === 0 ? NO_DECLARATIONS_STATUS : ASSESSED_STATUS,
    sourceContract: sourceRef(contract),
    sourceR133: {
      contract: sourceRef(custody.r133Contract),
      requestBatch: sourceRef(custody.r133Batch)
    },
    assessments,
    routes,
    summary: {
      sourceRequestPacketCount: custody.r133Batch.packets.length,
      routeDeclarationCount: declarations.length,
      compatibleUnverifiedDeclarationCount: assessments.filter(item =>
        item.status === COMPATIBLE_ASSESSMENT_STATUS).length,
      rejectedDeclarationCount: assessments.filter(item =>
        item.status === REJECTED_ASSESSMENT_STATUS).length,
      directSelfRoutingRejectionCount: assessments.filter(item =>
        item.reasonCodes.includes(
          'DIRECT_CANDIDATE_SELF_ROUTING_PROHIBITED')).length,
      circularDependencyRejectionCount: assessments.filter(item =>
        item.reasonCodes.includes(
          'CIRCULAR_OR_CANDIDATE_DEPENDENCY_PROHIBITED')).length,
      roleCollisionRejectionCount: assessments.filter(item =>
        item.reasonCodes.includes(
          'ROUTE_PROVIDER_ROLE_COLLISION_PROHIBITED')).length,
      missingRouteCount: routes.filter(item => item.status ===
        'MISSING_RECIPIENT_ROUTE_DECLARATION').length,
      rejectedRouteCount: routes.filter(item => item.status ===
        'REJECTED_RECIPIENT_ROUTE_DECLARATION').length,
      ambiguousRouteCount: routes.filter(item => item.status ===
        'AMBIGUOUS_RECIPIENT_ROUTE_DECLARATION').length,
      compatibleUnverifiedRouteCount: routes.filter(item => item.status ===
        'RECIPIENT_ROUTE_CONTRACT_COMPATIBLE_UNVERIFIED').length,
      independentlyResolvedRouteCount: 0,
      authenticatedRecipientCount: 0,
      authorityEstablishedCount: 0,
      contactAuthorizedCount: 0,
      transmittedRequestCount: 0,
      senderReceiptCount: 0,
      receiverReceiptCount: 0,
      independentlyVerifiedProviderCount: 0,
      evidenceAdmittedCount: 0,
      admissionReady: false
    },
    prohibitedConclusions: {
      letCandidateProviderSatisfyOwnVerificationRoute: true,
      treatDeclaredRouteProvidersAsIndependent: true,
      treatDeclaredDependencyGraphAsVerifiedAcyclic: true,
      treatDeclaredLocatorAsResolvedEndpoint: true,
      treatClaimedRecipientAsAuthenticated: true,
      treatDeclaredAuthorityAsEstablished: true,
      contactEndpointOrHumanWithoutAuthority: true,
      claimTransportWithoutMatchedReceipts: true,
      treatRecipientPreflightAsProviderVerification: true,
      admitEvidenceOwnerOrDebit: true,
      persistMutatePromoteOrCanonize: true
    },
    truth: {
      exactR133RequestPacketsBound: true,
      declarationsEvaluatedWithoutContact: true,
      directCandidateSelfRoutingPermitted: false,
      routeProviderIndependenceVerified: false,
      dependencyGraphVerifiedAcyclic: false,
      realEndpointResolutionPerformed: false,
      recipientAuthenticationPerformed: false,
      authorityEstablished: false,
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
createLandMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflight(
  contract, custody, declarations = []) {
  if (!landMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflightContractReceiptValid(
      contract, custody) ||
      !declarationsValid(declarations, custody.r133Batch.packets.length)) {
    throw new Error('R134 recipient-route preflight needs the exact R133 custody and bounded declarations');
  }
  const preflight = expectedPreflight(contract, custody, declarations);
  if (new TextEncoder().encode(JSON.stringify(preflight)).length >
      MAXIMUM_SERIALIZED_PREFLIGHT_BYTES) {
    throw new Error('R134 recipient-route preflight exceeds its resource ceiling');
  }
  return preflight;
}

export function
landMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflightValid(
  preflight, contract, custody, declarations = []) {
  return landMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflightContractReceiptValid(
    contract, custody) &&
    declarationsValid(declarations, custody.r133Batch.packets.length) &&
    new TextEncoder().encode(JSON.stringify(preflight)).length <=
      MAXIMUM_SERIALIZED_PREFLIGHT_BYTES &&
    exact(preflight, expectedPreflight(contract, custody, declarations));
}

export function
matrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflightDescription() {
  return {
    status: 'EXPERIMENTAL',
    capabilityId:
      VERIFIER_ROUTE_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_RESOLUTION_PREFLIGHT_EVALUATE_CAPABILITY_ID,
    statement:
      'R134 exact-binds future R133 provider-verification requests and evaluates bounded caller-supplied recipient-route declarations without trusting route providers, resolving an endpoint or recipient, authorizing contact, or transporting a request.',
    boundaries: [
      'The current real R133 request batch is empty, so the current recipient-route preflight is empty.',
      'A structurally compatible endpoint-resolver, trust-anchor-authority, and receipted-transport route remains caller-supplied and unverified; candidate self-routing, role collision, circular dependency, and ambiguity remain blocked.',
      'No provider identity, independence, implementation, availability, endpoint, recipient, authority, contact, transport, receipt, provider verification, evidence admission, owner/debit closure, persistence, promotion, canonization, or world mutation is produced.'
    ]
  };
}
