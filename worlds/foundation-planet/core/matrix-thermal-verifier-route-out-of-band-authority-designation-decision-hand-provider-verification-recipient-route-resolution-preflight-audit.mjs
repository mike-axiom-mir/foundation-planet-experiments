import {
  landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRequestContractReceiptValid,
  landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRequestBatchValid
} from './matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-request.mjs?v=0.139.0-r139.1';

const CONTRACT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-recipient-route-resolution-preflight-contract-receipt/v1';
const DECLARATION_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-recipient-route-declaration/v1';
const ASSESSMENT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-recipient-route-assessment/v1';
const PREFLIGHT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-recipient-route-resolution-preflight/v1';
const AUDIT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-recipient-route-resolution-preflight-audit/v1';
const EVALUATE_CAPABILITY_ID =
  'contract.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decision-hand.provider-verification.recipient-route-resolution.preflight.evaluate';
const ENDPOINT_RESOLVE_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.endpoint.resolve';
const TRUST_ANCHOR_RESOLVE_CAPABILITY_ID =
  'authority.foundation-planet.external-provider-verification.verifier-route.trust-anchor.resolve';
const SEND_RECEIVE_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.request.send-receive';
const CONTRACT_STATUS =
  'VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_RESOLUTION_PREFLIGHT_CONTRACT_AVAILABLE';
const EMPTY_STATUS =
  'NO_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_REQUESTS_RECIPIENT_ROUTE_PREFLIGHT_EMPTY';
const NO_DECLARATIONS_STATUS =
  'VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_UNRESOLVED_NO_DECLARATIONS';
const ASSESSED_STATUS =
  'VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_DECLARATIONS_ASSESSED_UNVERIFIED';
const COMPATIBLE_STATUS = 'RECIPIENT_ROUTE_CONTRACT_COMPATIBLE_UNVERIFIED';
const REJECTED_STATUS = 'RECIPIENT_ROUTE_DECLARATION_REJECTED';
const MAXIMUM_ROUTE_DECLARATIONS = 2;
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
  return exactKeys(custody, ['r139Contract', 'r139Batch',
    'r139Custody', 'r139Options']) &&
    landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRequestContractReceiptValid(
      custody.r139Contract, custody.r139Custody) &&
    landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRequestBatchValid(
      custody.r139Batch, custody.r139Contract, custody.r139Custody,
      custody.r139Options);
}

function expectedContract(custody) {
  return withDigest({
    schema: CONTRACT_SCHEMA,
    status: CONTRACT_STATUS,
    sourceR139: {
      contract: sourceRef(custody.r139Contract),
      requestBatch: sourceRef(custody.r139Batch)
    },
    projection: {
      sourceRequestPacketCount: custody.r139Batch.packets.length,
      routeDeclarationSchema: DECLARATION_SCHEMA,
      routeAssessmentSchema: ASSESSMENT_SCHEMA,
      routePreflightSchema: PREFLIGHT_SCHEMA,
      requiredRouteCapabilityIds: [
        ENDPOINT_RESOLVE_CAPABILITY_ID,
        TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
        SEND_RECEIVE_CAPABILITY_ID
      ],
      implementedContractCapabilityId: EVALUATE_CAPABILITY_ID
    },
    resourceBudget: {
      maximumRouteDeclarations: MAXIMUM_ROUTE_DECLARATIONS,
      maximumDeclarationsPerRequest: MAXIMUM_DECLARATIONS_PER_REQUEST,
      maximumDeclaredDependencies: MAXIMUM_DECLARED_DEPENDENCIES,
      maximumSerializedDeclarationBytes: MAXIMUM_SERIALIZED_DECLARATION_BYTES,
      maximumSerializedPreflightBytes: MAXIMUM_SERIALIZED_PREFLIGHT_BYTES
    },
    truth: {
      exactR139ContractBatchRequestsAndCustodyBound: true,
      recipientRouteDeclarationsMayBeStructurallyEvaluated: true,
      candidateProviderMaySatisfyOwnVerificationRoute: false,
      callerDeclaredRouteProvidersMayProveIndependence: false,
      routeDeclarationMayResolveOrTrustEndpointRecipientOrAuthority: false,
      routeDeclarationMayAuthorizeContactOrTransport: false,
      authorityDecisionPerformed: false,
      routeDesignatedOrAuthorized: false,
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
      parsed.search === '' && parsed.hash === '' && parsed.href === locator.value;
  } catch {
    return false;
  }
}

function routeProviderClaimValid(claim, capabilityId, dependencies) {
  return exactKeys(claim, ['providerId', 'providerVersion', 'capabilityId',
    'identityTrust', 'relationToCandidate', 'status',
    'declaredDependencyProviderIds']) && providerIdValid(claim.providerId) &&
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
  if (declaration.schema !== DECLARATION_SCHEMA ||
      declaration.digest !== stableDigest(unsigned)) {
    reasons.push('DECLARATION_DIGEST_INVALID');
  }
  const packet = custody.r139Batch.packets.find(item =>
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
  if (!locatorValid(declaration.locator)) reasons.push('LOCATOR_INVALID_OR_UNSAFE');
  const route = declaration.routeProviders;
  if (!exactKeys(route, ['endpointResolver', 'trustAnchorAuthority', 'transport'])) {
    reasons.push('ROUTE_PROVIDER_SET_INVALID');
  } else {
    const endpoint = route.endpointResolver;
    const authority = route.trustAnchorAuthority;
    const transport = route.transport;
    if (!routeProviderClaimValid(endpoint, ENDPOINT_RESOLVE_CAPABILITY_ID, [])) {
      reasons.push('ENDPOINT_RESOLVER_CLAIM_INVALID');
    }
    if (!routeProviderClaimValid(authority, TRUST_ANCHOR_RESOLVE_CAPABILITY_ID, [])) {
      reasons.push('TRUST_ANCHOR_AUTHORITY_CLAIM_INVALID');
    }
    if (!exactKeys(transport, ['providerId', 'providerVersion', 'capabilityId',
        'identityTrust', 'relationToCandidate', 'status',
        'declaredDependencyProviderIds', 'prerequisiteAuthorityProviderId']) ||
        !routeProviderClaimValid({
          providerId: transport?.providerId,
          providerVersion: transport?.providerVersion,
          capabilityId: transport?.capabilityId,
          identityTrust: transport?.identityTrust,
          relationToCandidate: transport?.relationToCandidate,
          status: transport?.status,
          declaredDependencyProviderIds: transport?.declaredDependencyProviderIds
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
      MAXIMUM_ROUTE_DECLARATIONS || declarations.length >
      packetCount * MAXIMUM_DECLARATIONS_PER_REQUEST) return false;
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
    schema: ASSESSMENT_SCHEMA,
    inputIndex,
    requestId: typeof declaration?.requestId === 'string'
      ? declaration.requestId : null,
    requestPacketDigest: valid ? declaration.requestPacketDigest : null,
    candidateProviderId: valid ? declaration.candidateProvider.providerId : null,
    claimedVerificationRecipientId: valid
      ? declaration.claimedVerificationRecipient.recipientId : null,
    endpointResolverProviderId: valid
      ? declaration.routeProviders.endpointResolver.providerId : null,
    trustAnchorAuthorityProviderId: valid
      ? declaration.routeProviders.trustAnchorAuthority.providerId : null,
    transportProviderId: valid ? declaration.routeProviders.transport.providerId : null,
    claimedLocatorKind: valid ? declaration.locator.kind : null,
    claimedLocatorValue: valid ? declaration.locator.value : null,
    declarationDigest: typeof declaration?.digest === 'string'
      ? declaration.digest : null,
    status: valid ? COMPATIBLE_STATUS : REJECTED_STATUS,
    reasonCodes,
    truth: {
      declarationStructurallyCompatible: valid,
      routeProviderIndependenceVerified: false,
      dependencyGraphVerifiedAcyclic: false,
      endpointResolved: false,
      recipientIdentityAuthenticated: false,
      authorityEstablished: false,
      authorityDecisionPerformed: false,
      routeDesignatedOrAuthorized: false,
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
  const compatible = matching.filter(item => item.status === COMPATIBLE_STATUS);
  const status = matching.length === 0 ? 'MISSING_RECIPIENT_ROUTE_DECLARATION'
    : compatible.length === 0 ? 'REJECTED_RECIPIENT_ROUTE_DECLARATION'
      : compatible.length === 1 ? COMPATIBLE_STATUS
        : 'AMBIGUOUS_RECIPIENT_ROUTE_DECLARATION';
  const selected = compatible.length === 1 ? compatible[0] : null;
  return {
    requestId: packet.requestId,
    requestPacketDigest: packet.digest,
    candidateProviderId: packet.claimedProvider.providerId,
    claimedVerificationRecipientId: packet.recipientRoute.claimedVerifierId,
    declarationInputIndexes: matching.map(item => item.inputIndex),
    status,
    endpointResolverProviderId: selected?.endpointResolverProviderId || null,
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
      authorityDecisionPerformed: false,
      routeDesignatedOrAuthorized: false,
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
  const routes = custody.r139Batch.packets.map(packet =>
    expectedRouteRow(packet, assessments));
  return withDigest({
    schema: PREFLIGHT_SCHEMA,
    status: routes.length === 0 ? EMPTY_STATUS
      : declarations.length === 0 ? NO_DECLARATIONS_STATUS : ASSESSED_STATUS,
    sourceContract: sourceRef(contract),
    sourceR139: {
      contract: sourceRef(custody.r139Contract),
      requestBatch: sourceRef(custody.r139Batch)
    },
    assessments,
    routes,
    summary: {
      sourceRequestPacketCount: custody.r139Batch.packets.length,
      routeDeclarationCount: declarations.length,
      compatibleUnverifiedDeclarationCount:
        assessments.filter(item => item.status === COMPATIBLE_STATUS).length,
      rejectedDeclarationCount:
        assessments.filter(item => item.status === REJECTED_STATUS).length,
      directSelfRoutingRejectionCount: assessments.filter(item =>
        item.reasonCodes.includes('DIRECT_CANDIDATE_SELF_ROUTING_PROHIBITED')).length,
      circularDependencyRejectionCount: assessments.filter(item =>
        item.reasonCodes.includes('CIRCULAR_OR_CANDIDATE_DEPENDENCY_PROHIBITED')).length,
      roleCollisionRejectionCount: assessments.filter(item =>
        item.reasonCodes.includes('ROUTE_PROVIDER_ROLE_COLLISION_PROHIBITED')).length,
      missingRouteCount: routes.filter(item => item.status ===
        'MISSING_RECIPIENT_ROUTE_DECLARATION').length,
      rejectedRouteCount: routes.filter(item => item.status ===
        'REJECTED_RECIPIENT_ROUTE_DECLARATION').length,
      ambiguousRouteCount: routes.filter(item => item.status ===
        'AMBIGUOUS_RECIPIENT_ROUTE_DECLARATION').length,
      compatibleUnverifiedRouteCount:
        routes.filter(item => item.status === COMPATIBLE_STATUS).length,
      independentlyResolvedRouteCount: 0,
      authenticatedRecipientCount: 0,
      authorityEstablishedCount: 0,
      authorityDecisionCount: 0,
      routeDesignationOrAuthorizationCount: 0,
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
      treatRoutePreflightAsAuthorityDecisionOrDesignation: true,
      contactEndpointOrHumanWithoutAuthority: true,
      claimTransportWithoutMatchedReceipts: true,
      treatRecipientPreflightAsProviderVerification: true,
      admitEvidenceOwnerOrDebit: true,
      persistMutatePromoteOrCanonize: true
    },
    truth: {
      exactR139RequestPacketsBound: true,
      declarationsEvaluatedWithoutContact: true,
      directCandidateSelfRoutingPermitted: false,
      routeProviderIndependenceVerified: false,
      dependencyGraphVerifiedAcyclic: false,
      realEndpointResolutionPerformed: false,
      recipientAuthenticationPerformed: false,
      authorityEstablished: false,
      authorityDecisionPerformed: false,
      routeDesignatedOrAuthorized: false,
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

export function auditLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteResolutionPreflight(
  contract, preflight, custody, declarations = []) {
  const findings = [];
  if (!custodyValid(custody)) {
    findings.push('R139_CUSTODY_INVALID_OR_SUBSTITUTED');
  } else {
    const reconstructedContract = expectedContract(custody);
    if (!exact(contract, reconstructedContract)) {
      findings.push('R140_CONTRACT_NOT_EXACTLY_RECONSTRUCTED');
    }
    if (!declarationsValid(declarations, custody.r139Batch.packets.length)) {
      findings.push('RECIPIENT_ROUTE_DECLARATIONS_INVALID_OR_UNBOUNDED');
    }
    if (findings.length === 0 &&
        !exact(preflight, expectedPreflight(contract, custody, declarations))) {
      findings.push('R140_PREFLIGHT_NOT_EXACTLY_RECONSTRUCTED');
    }
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
      preflight: preflight && typeof preflight === 'object'
        ? sourceRef(preflight) : null
    },
    findings: uniqueFindings,
    summary: {
      sourceRequestPacketCount: custody?.r139Batch?.packets?.length || 0,
      routeDeclarationCount: Array.isArray(declarations) ? declarations.length : 0,
      independentlyResolvedRouteCount: 0,
      authenticatedRecipientCount: 0,
      authorityEstablishedCount: 0,
      authorityDecisionCount: 0,
      routeDesignationOrAuthorizationCount: 0,
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
