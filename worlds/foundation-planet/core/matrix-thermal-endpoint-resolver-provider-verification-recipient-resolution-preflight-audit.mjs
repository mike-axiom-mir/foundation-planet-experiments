import {
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestContractReceiptValid,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestBatchValid
} from './matrix-thermal-endpoint-resolver-provider-verification-request.mjs?v=0.128.0-r128.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_RESOLUTION_PREFLIGHT_AUDIT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-verification-recipient-resolution-preflight-audit/v1';

const CONTRACT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-verification-recipient-resolution-preflight-contract-receipt/v1';
const DECLARATION_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-verification-recipient-endpoint-declaration/v1';
const ASSESSMENT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-verification-recipient-endpoint-assessment/v1';
const PREFLIGHT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-verification-recipient-resolution-preflight/v1';
const CAPABILITY_ID =
  'contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.endpoint-resolution.resolver-provider.verification.recipient-resolution.preflight.evaluate';
const REQUIRED_RESOLVER_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.endpoint.resolve';
const NEXT_TRANSPORT_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.request.send-receive';
const MAXIMUM_ENDPOINT_DECLARATIONS = 2;
const MAXIMUM_DECLARED_DEPENDENCIES = 8;
const MAXIMUM_SERIALIZED_DECLARATION_BYTES = 131072;
const MAXIMUM_SERIALIZED_PREFLIGHT_BYTES = 262144;
const clone = value => JSON.parse(JSON.stringify(value));
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const exactKeys = (value, keys) => value && typeof value === 'object' &&
  !Array.isArray(value) && exact(Object.keys(value).sort(), [...keys].sort());
const identifierValid = value =>
  /^[a-z0-9][a-z0-9._-]{2,95}$/.test(value || '');

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

function exactSourceValid(source, custody) {
  return exactKeys(source, ['r128Contract', 'r128Batch',
    'r128RequestSource', 'r128Options']) &&
    exactKeys(custody, ['r128Contract', 'r128Batch',
      'r128RequestSource', 'r128Options', 'r128Custody']) &&
    exact(source.r128Contract, custody.r128Contract) &&
    exact(source.r128Batch, custody.r128Batch) &&
    exact(source.r128RequestSource, custody.r128RequestSource) &&
    exact(source.r128Options, custody.r128Options) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestContractReceiptValid(
      custody.r128Contract, custody.r128Custody) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestBatchValid(
      source.r128Batch, source.r128Contract, source.r128RequestSource,
      source.r128Options);
}

const contractTruth = () => ({
  exactR128ContractBatchRequestsAndCustodyBound: true,
  endpointDeclarationsMayBeStructurallyEvaluated: true,
  candidateResolverProviderMayResolveOwnVerificationRecipient: false,
  callerDeclaredAlternateResolverMayProveIndependence: false,
  endpointDeclarationMayResolveEndpoint: false,
  endpointDeclarationMayAuthenticateRecipient: false,
  endpointDeclarationMayAuthorizeContact: false,
  transportPerformed: false,
  resolverProviderVerified: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  admissionAuthorized: false,
  persistencePerformed: false,
  worldMutationPerformed: false
});

function expectedContract(custody) {
  const receipt = {
    schema: CONTRACT_SCHEMA,
    status:
      'RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_RESOLUTION_PREFLIGHT_CONTRACT_AVAILABLE',
    sourceR128: {
      contract: sourceRef(custody.r128Contract),
      requestBatch: sourceRef(custody.r128Batch)
    },
    projection: {
      sourceRequestPacketCount: custody.r128Batch.packets.length,
      endpointDeclarationSchema: DECLARATION_SCHEMA,
      endpointAssessmentSchema: ASSESSMENT_SCHEMA,
      endpointPreflightSchema: PREFLIGHT_SCHEMA,
      requiredIndependentResolverCapabilityId:
        REQUIRED_RESOLVER_CAPABILITY_ID,
      nextTransportCapabilityId: NEXT_TRANSPORT_CAPABILITY_ID,
      implementedContractCapabilityId: CAPABILITY_ID
    },
    resourceBudget: {
      maximumEndpointDeclarations: MAXIMUM_ENDPOINT_DECLARATIONS,
      maximumDeclaredDependencies: MAXIMUM_DECLARED_DEPENDENCIES,
      maximumSerializedDeclarationBytes:
        MAXIMUM_SERIALIZED_DECLARATION_BYTES,
      maximumSerializedPreflightBytes: MAXIMUM_SERIALIZED_PREFLIGHT_BYTES
    },
    truth: contractTruth()
  };
  receipt.digest = stableDigest(receipt);
  return receipt;
}

function locatorValueValid(locator) {
  if (typeof locator?.value !== 'string' || locator.value.length < 4 ||
      locator.value.length > 512) return false;
  if (locator.kind === 'HUMAN_REVIEW_ROUTE') {
    return /^human-review:[a-z0-9][a-z0-9._/-]{2,191}$/.test(locator.value);
  }
  if (locator.kind === 'HOST_GOVERNANCE_ROUTE') {
    return /^host-governance:[a-z0-9][a-z0-9._/-]{2,191}$/.test(
      locator.value);
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

function declarationReasons(declaration, source) {
  if (!exactKeys(declaration, ['schema', 'requestId',
      'requestPacketDigest', 'resolverCapabilityId',
      'candidateResolverProvider', 'claimedVerificationRecipient',
      'locator', 'alternateResolverClaim', 'resolutionWindow',
      'verificationPlan', 'permissionsAndConsent', 'lifecycle', 'digest'])) {
    return ['DECLARATION_SHAPE_INVALID'];
  }
  const reasons = [];
  if (!digestValid(declaration, DECLARATION_SCHEMA)) {
    reasons.push('DECLARATION_DIGEST_INVALID');
  }
  const packet = source.r128Batch.packets.find(candidate =>
    candidate.requestId === declaration.requestId);
  if (!packet) {
    reasons.push('UNKNOWN_REQUEST');
    return [...new Set(reasons)].sort();
  }
  if (declaration.requestPacketDigest !== packet.digest) {
    reasons.push('REQUEST_PACKET_DIGEST_MISMATCH');
  }
  if (declaration.resolverCapabilityId !== REQUIRED_RESOLVER_CAPABILITY_ID) {
    reasons.push('RESOLVER_CAPABILITY_MISMATCH');
  }
  if (!exact(declaration.candidateResolverProvider, {
    providerId: packet.claimedProvider.providerId,
    providerClass: packet.claimedProvider.providerClass,
    declarationDigest: packet.requestBinding.declarationDigest
  })) {
    reasons.push('CANDIDATE_PROVIDER_BINDING_MISMATCH');
  }
  if (!exact(declaration.claimedVerificationRecipient, {
    recipientId: packet.recipient.claimedVerifierId,
    identityTrust: 'CALLER_SUPPLIED_UNTRUSTED'
  })) {
    reasons.push('VERIFICATION_RECIPIENT_BINDING_MISMATCH');
  }
  if (!exactKeys(declaration.locator, ['kind', 'value', 'trust']) ||
      !['HTTPS_URI', 'HUMAN_REVIEW_ROUTE', 'HOST_GOVERNANCE_ROUTE']
        .includes(declaration.locator.kind) ||
      declaration.locator.trust !== 'CALLER_SUPPLIED_UNVERIFIED' ||
      !locatorValueValid(declaration.locator)) {
    reasons.push('LOCATOR_INVALID_OR_UNSAFE');
  }
  const alternate = declaration.alternateResolverClaim;
  if (!exactKeys(alternate, ['providerId', 'providerVersion',
      'capabilityId', 'identityTrust', 'relationToCandidate',
      'declaredDependencyProviderIds', 'status']) ||
      !identifierValid(alternate?.providerId) ||
      !/^[0-9]+\.[0-9]+\.[0-9]+(?:-[a-z0-9.-]+)?$/.test(
        alternate?.providerVersion || '') ||
      alternate.capabilityId !== REQUIRED_RESOLVER_CAPABILITY_ID ||
      alternate.identityTrust !== 'CALLER_SUPPLIED_UNTRUSTED' ||
      alternate.relationToCandidate !== 'CLAIMED_DISTINCT_UNVERIFIED' ||
      alternate.status !== 'CALLER_DECLARED_UNVERIFIED' ||
      !Array.isArray(alternate.declaredDependencyProviderIds) ||
      alternate.declaredDependencyProviderIds.length >
        MAXIMUM_DECLARED_DEPENDENCIES ||
      alternate.declaredDependencyProviderIds.some(value =>
        !identifierValid(value)) ||
      new Set(alternate.declaredDependencyProviderIds).size !==
        alternate.declaredDependencyProviderIds.length) {
    reasons.push('ALTERNATE_RESOLVER_CLAIM_INVALID');
  } else {
    if (alternate.providerId === packet.claimedProvider.providerId) {
      reasons.push('DIRECT_CANDIDATE_SELF_RESOLUTION_PROHIBITED');
    }
    if (alternate.declaredDependencyProviderIds.includes(
        packet.claimedProvider.providerId) ||
        alternate.declaredDependencyProviderIds.includes(
          alternate.providerId)) {
      reasons.push('CIRCULAR_RESOLVER_DEPENDENCY_PROHIBITED');
    }
  }
  if (!exactKeys(declaration.resolutionWindow,
      ['declaredAt', 'validUntil']) ||
      typeof declaration.resolutionWindow.declaredAt !== 'string' ||
      typeof declaration.resolutionWindow.validUntil !== 'string') {
    reasons.push('RESOLUTION_WINDOW_INVALID');
  } else {
    const declaredAt = Date.parse(declaration.resolutionWindow.declaredAt);
    const validUntil = Date.parse(declaration.resolutionWindow.validUntil);
    const requestStart = Date.parse(packet.requestWindow.requestedAt);
    const requestEnd = Date.parse(packet.requestWindow.expiresAt);
    if (!Number.isFinite(declaredAt) || !Number.isFinite(validUntil) ||
        new Date(declaredAt).toISOString() !==
          declaration.resolutionWindow.declaredAt ||
        new Date(validUntil).toISOString() !==
          declaration.resolutionWindow.validUntil ||
        declaredAt < requestStart || validUntil <= declaredAt ||
        validUntil > requestEnd) {
      reasons.push('RESOLUTION_WINDOW_INVALID');
    }
  }
  if (!exact(declaration.verificationPlan, {
    independentAlternateResolverIdentityAndAuthorityRequired: true,
    alternateResolverImplementationAndAvailabilityRequired: true,
    nonCircularDependencyProofRequired: true,
    independentEndpointOwnershipReceiptRequired: true,
    independentRecipientIdentityReceiptRequired: true,
    allowedAndDeniedRecipientProbesRequired: true,
    senderAndReceiverReceiptMatchRequired: true
  })) reasons.push('VERIFICATION_PLAN_INVALID');
  if (!exact(declaration.permissionsAndConsent, {
    alternateResolverMayContactEndpoint: false,
    alternateResolverMayContactHuman: false,
    candidateResolverMayResolveOwnVerifier: false,
    declarationMayAuthorizeContact: false,
    resolverMayMutateHost: false,
    resolverMayPersist: false
  })) reasons.push('PERMISSION_BOUNDARY_INVALID');
  if (!exact(declaration.lifecycle, {
    status: 'VERIFICATION_RECIPIENT_ENDPOINT_CANDIDATE_UNTRUSTED',
    endpointResolved: false,
    recipientAuthenticated: false,
    persisted: false,
    promoted: false,
    canon: false
  })) reasons.push('LIFECYCLE_INVALID');
  return [...new Set(reasons)].sort();
}

function expectedAssessment(declaration, inputIndex, source) {
  const reasonCodes = declarationReasons(declaration, source);
  const valid = reasonCodes.length === 0;
  return {
    schema: ASSESSMENT_SCHEMA,
    inputIndex,
    requestId: typeof declaration?.requestId === 'string'
      ? declaration.requestId : null,
    requestPacketDigest: valid ? declaration.requestPacketDigest : null,
    candidateResolverProviderId: valid
      ? declaration.candidateResolverProvider.providerId : null,
    claimedVerificationRecipientId: valid
      ? declaration.claimedVerificationRecipient.recipientId : null,
    alternateResolverProviderId: valid
      ? declaration.alternateResolverClaim.providerId : null,
    claimedLocatorKind: valid ? declaration.locator.kind : null,
    claimedLocatorValue: valid ? declaration.locator.value : null,
    declarationDigest: typeof declaration?.digest === 'string'
      ? declaration.digest : null,
    status: valid
      ? 'RECIPIENT_ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED'
      : 'RECIPIENT_ENDPOINT_DECLARATION_REJECTED',
    reasonCodes,
    truth: {
      declarationStructurallyCompatible: valid,
      alternateResolverIndependent: false,
      endpointResolved: false,
      endpointOwnershipVerified: false,
      recipientIdentityAuthenticated: false,
      contactAuthorized: false,
      transportPerformed: false,
      resolverProviderVerified: false,
      admissionAuthorized: false,
      worldMutationPerformed: false
    }
  };
}

function expectedEndpoint(packet, assessments) {
  const matching = assessments.filter(item => item.requestId === packet.requestId);
  const compatible = matching.filter(item => item.status ===
    'RECIPIENT_ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED');
  const status = matching.length === 0
    ? 'MISSING_RECIPIENT_ENDPOINT_DECLARATION'
    : compatible.length === 0
      ? 'REJECTED_RECIPIENT_ENDPOINT_DECLARATION'
      : compatible.length === 1
        ? 'RECIPIENT_ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED'
        : 'AMBIGUOUS_RECIPIENT_ENDPOINT_DECLARATION';
  const selected = compatible.length === 1 ? compatible[0] : null;
  return {
    requestId: packet.requestId,
    requestPacketDigest: packet.digest,
    candidateResolverProviderId: packet.claimedProvider.providerId,
    claimedVerificationRecipientId: packet.recipient.claimedVerifierId,
    declarationInputIndexes: matching.map(item => item.inputIndex),
    status,
    alternateResolverProviderId:
      selected?.alternateResolverProviderId || null,
    claimedLocatorKind: selected?.claimedLocatorKind || null,
    claimedLocatorValue: selected?.claimedLocatorValue || null,
    blockingReasons: status === 'MISSING_RECIPIENT_ENDPOINT_DECLARATION'
      ? ['RECIPIENT_ENDPOINT_DECLARATION_REQUIRED']
      : status === 'REJECTED_RECIPIENT_ENDPOINT_DECLARATION'
        ? ['ALL_RECIPIENT_ENDPOINT_DECLARATIONS_REJECTED']
        : status === 'AMBIGUOUS_RECIPIENT_ENDPOINT_DECLARATION'
          ? ['MULTIPLE_COMPATIBLE_RECIPIENT_ENDPOINT_DECLARATIONS']
          : ['INDEPENDENT_ALTERNATE_RESOLVER_IDENTITY_AND_AUTHORITY_REQUIRED',
            'ALTERNATE_RESOLVER_IMPLEMENTATION_AND_AVAILABILITY_REQUIRED',
            'NON_CIRCULAR_DEPENDENCY_PROOF_REQUIRED',
            'INDEPENDENT_ENDPOINT_OWNERSHIP_REQUIRED',
            'INDEPENDENT_VERIFICATION_RECIPIENT_IDENTITY_REQUIRED',
            'CONTACT_AUTHORIZATION_REQUIRED'],
    operationalReadiness: 'BLOCKED',
    truth: {
      candidateResolverSelfResolutionUsed: false,
      alternateResolverIndependent: false,
      endpointResolved: false,
      endpointOwnershipVerified: false,
      recipientIdentityAuthenticated: false,
      contactAuthorized: false,
      transportPerformed: false,
      receiverReceiptObserved: false,
      resolverProviderVerified: false,
      admissionAuthorized: false
    }
  };
}

function expectedPreflight(contract, source, declarations) {
  const assessments = declarations.map((declaration, inputIndex) =>
    expectedAssessment(declaration, inputIndex, source));
  const endpoints = source.r128Batch.packets.map(packet =>
    expectedEndpoint(packet, assessments));
  const receipt = {
    schema: PREFLIGHT_SCHEMA,
    status: endpoints.length === 0
      ? 'NO_RESOLVER_PROVIDER_VERIFICATION_REQUESTS_RECIPIENT_PREFLIGHT_EMPTY'
      : declarations.length === 0
        ? 'RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_UNRESOLVED_NO_DECLARATIONS'
        : 'RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_DECLARATIONS_ASSESSED_UNVERIFIED',
    sourceContract: sourceRef(contract),
    sourceR128: {
      contract: sourceRef(source.r128Contract),
      requestBatch: sourceRef(source.r128Batch)
    },
    assessments,
    endpoints,
    summary: {
      sourceRequestPacketCount: source.r128Batch.packets.length,
      endpointDeclarationCount: declarations.length,
      compatibleUnverifiedDeclarationCount: assessments.filter(item =>
        item.status ===
          'RECIPIENT_ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED').length,
      rejectedDeclarationCount: assessments.filter(item =>
        item.status === 'RECIPIENT_ENDPOINT_DECLARATION_REJECTED').length,
      directSelfResolutionRejectionCount: assessments.filter(item =>
        item.reasonCodes.includes(
          'DIRECT_CANDIDATE_SELF_RESOLUTION_PROHIBITED')).length,
      circularDependencyRejectionCount: assessments.filter(item =>
        item.reasonCodes.includes(
          'CIRCULAR_RESOLVER_DEPENDENCY_PROHIBITED')).length,
      missingEndpointCount: endpoints.filter(item => item.status ===
        'MISSING_RECIPIENT_ENDPOINT_DECLARATION').length,
      rejectedEndpointCount: endpoints.filter(item => item.status ===
        'REJECTED_RECIPIENT_ENDPOINT_DECLARATION').length,
      ambiguousEndpointCount: endpoints.filter(item => item.status ===
        'AMBIGUOUS_RECIPIENT_ENDPOINT_DECLARATION').length,
      compatibleUnverifiedEndpointCount: endpoints.filter(item =>
        item.status ===
          'RECIPIENT_ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED').length,
      independentlyResolvedEndpointCount: 0,
      authenticatedRecipientCount: 0,
      contactAuthorizedCount: 0,
      transmittedRequestCount: 0,
      receiverReceiptCount: 0,
      independentlyVerifiedResolverProviderCount: 0,
      admissionReady: false
    },
    prohibitedConclusions: {
      letCandidateResolverResolveOwnVerificationRecipient: true,
      treatDeclaredAlternateResolverAsIndependent: true,
      treatDeclaredLocatorAsResolvedEndpoint: true,
      treatClaimedRecipientAsAuthenticated: true,
      contactEndpointOrHumanWithoutAuthority: true,
      claimTransportWithoutMatchedReceipts: true,
      treatRecipientPreflightAsResolverProviderVerification: true,
      admitEvidenceOwnerOrDebit: true,
      persistMutatePromoteOrCanonize: true
    },
    truth: {
      exactR128RequestPacketsBound: true,
      declarationsEvaluatedWithoutContact: true,
      directCandidateSelfResolutionPermitted: false,
      alternateResolverIndependenceVerified: false,
      realEndpointResolutionPerformed: false,
      recipientAuthenticationPerformed: false,
      transportPerformed: false,
      resolverProviderVerificationPerformed: false,
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

function declarationsBounded(declarations) {
  if (!Array.isArray(declarations) ||
      declarations.length > MAXIMUM_ENDPOINT_DECLARATIONS) return false;
  try {
    const text = JSON.stringify(declarations);
    return new TextEncoder().encode(text).length <=
      MAXIMUM_SERIALIZED_DECLARATION_BYTES &&
      exact(declarations, JSON.parse(text));
  } catch {
    return false;
  }
}

export function
auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflight(
  contract, preflight, source, declarations, custody) {
  const sourceCustodyValid = exactSourceValid(source, custody);
  const bounded = declarationsBounded(declarations);
  const expectedContractValue = sourceCustodyValid
    ? expectedContract(custody) : null;
  const contractMatches = expectedContractValue !== null &&
    exact(contract, expectedContractValue) && digestValid(contract,
      CONTRACT_SCHEMA);
  const expectedPreflightValue = contractMatches && bounded
    ? expectedPreflight(contract, source, declarations) : null;
  const preflightMatches = expectedPreflightValue !== null &&
    exact(preflight, expectedPreflightValue) && digestValid(preflight,
      PREFLIGHT_SCHEMA) &&
    new TextEncoder().encode(JSON.stringify(preflight)).length <=
      MAXIMUM_SERIALIZED_PREFLIGHT_BYTES;
  const status = sourceCustodyValid && bounded && contractMatches &&
    preflightMatches ? 'PASS' : 'FAIL';
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_RESOLUTION_PREFLIGHT_AUDIT_SCHEMA,
    status,
    checks: {
      exactR128SourceAndCustodyValid: sourceCustodyValid,
      declarationsBounded: bounded,
      independentlyReconstructedContractMatches: contractMatches,
      independentlyReconstructedPreflightMatches: preflightMatches
    },
    observed: {
      sourceRequestPacketCount:
        Number.isInteger(preflight?.summary?.sourceRequestPacketCount)
          ? preflight.summary.sourceRequestPacketCount : null,
      endpointDeclarationCount:
        Number.isInteger(preflight?.summary?.endpointDeclarationCount)
          ? preflight.summary.endpointDeclarationCount : null,
      directSelfResolutionRejectionCount:
        Number.isInteger(
          preflight?.summary?.directSelfResolutionRejectionCount)
          ? preflight.summary.directSelfResolutionRejectionCount : null,
      circularDependencyRejectionCount:
        Number.isInteger(
          preflight?.summary?.circularDependencyRejectionCount)
          ? preflight.summary.circularDependencyRejectionCount : null,
      compatibleUnverifiedEndpointCount:
        Number.isInteger(
          preflight?.summary?.compatibleUnverifiedEndpointCount)
          ? preflight.summary.compatibleUnverifiedEndpointCount : null,
      independentlyResolvedEndpointCount:
        Number.isInteger(
          preflight?.summary?.independentlyResolvedEndpointCount)
          ? preflight.summary.independentlyResolvedEndpointCount : null
    },
    truth: {
      producerBuilderOrValidatorUsedAsAuditOracle: false,
      auditMayResolveEndpointOrAuthenticateRecipient: false,
      auditMayAuthorizeContactOrTransport: false,
      auditMayVerifySelectInstallOrExecuteResolverProvider: false,
      auditMayMutatePersistPromoteOrCanonize: false
    }
  };
  receipt.digest = stableDigest(receipt);
  return receipt;
}
