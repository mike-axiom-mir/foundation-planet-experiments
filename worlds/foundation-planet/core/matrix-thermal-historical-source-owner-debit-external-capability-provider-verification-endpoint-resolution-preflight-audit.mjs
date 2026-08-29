import {
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationRequestContractReceiptValid,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationRequestBatchValid
} from './matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-request.mjs?v=0.123.0-r123.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_DECLARATION_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_ASSESSMENT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_PREFLIGHT_SCHEMA,
  HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_PREFLIGHT_EVALUATE_CAPABILITY_ID
} from './matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolution-preflight.mjs?v=0.124.0-r124.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_PREFLIGHT_AUDIT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolution-preflight-audit/v1';

const CONTRACT_STATUS =
  'PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_PREFLIGHT_CONTRACT_AVAILABLE';
const EMPTY_STATUS =
  'NO_PROVIDER_VERIFICATION_REQUESTS_ENDPOINT_PREFLIGHT_EMPTY';
const NO_DECLARATIONS_STATUS =
  'PROVIDER_VERIFICATION_ENDPOINTS_UNRESOLVED_NO_DECLARATIONS';
const ASSESSED_STATUS =
  'PROVIDER_VERIFICATION_ENDPOINT_DECLARATIONS_ASSESSED_UNVERIFIED';
const REQUIRED_RESOLVER_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.endpoint.resolve';
const NEXT_TRANSPORT_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.request.send-receive';
const MAXIMUM_ENDPOINT_DECLARATIONS = 30;
const MAXIMUM_SERIALIZED_DECLARATION_BYTES = 262144;
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

function digestValid(value, schema) {
  if (value?.schema !== schema || typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

const sourceRef = value => ({ schema: value.schema, receiptDigest: value.digest });

function custodyValid(custody) {
  return exactKeys(custody, ['r123Contract', 'r123Batch',
    'r123RequestSource', 'r123Options', 'r123Custody']) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationRequestContractReceiptValid(
      custody.r123Contract, custody.r123Custody) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationRequestBatchValid(
      custody.r123Batch, custody.r123Contract, custody.r123RequestSource,
      custody.r123Options);
}

function expectedContract(custody) {
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
    status: CONTRACT_STATUS,
    sourceR123: {
      contract: sourceRef(custody.r123Contract),
      requestBatch: sourceRef(custody.r123Batch)
    },
    projection: {
      sourceRequestPacketCount: custody.r123Batch.packets.length,
      endpointDeclarationSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_DECLARATION_SCHEMA,
      endpointAssessmentSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_ASSESSMENT_SCHEMA,
      endpointPreflightSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_PREFLIGHT_SCHEMA,
      requiredResolverCapabilityId: REQUIRED_RESOLVER_CAPABILITY_ID,
      nextTransportCapabilityId: NEXT_TRANSPORT_CAPABILITY_ID,
      implementedContractCapabilityId:
        HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_PREFLIGHT_EVALUATE_CAPABILITY_ID
    },
    resourceBudget: {
      maximumEndpointDeclarations: MAXIMUM_ENDPOINT_DECLARATIONS,
      maximumSerializedDeclarationBytes:
        MAXIMUM_SERIALIZED_DECLARATION_BYTES,
      maximumSerializedPreflightBytes: MAXIMUM_SERIALIZED_PREFLIGHT_BYTES
    },
    truth: {
      exactR123ContractBatchRequestsAndCustodyBound: true,
      endpointDeclarationsMayBeStructurallyEvaluated: true,
      endpointDeclarationMayResolveEndpoint: false,
      endpointDeclarationMayAuthenticateRecipient: false,
      endpointDeclarationMayAuthorizeContact: false,
      transportPerformed: false,
      senderReceiptObserved: false,
      receiverReceiptObserved: false,
      providerIdentityAuthenticated: false,
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

function expectedEntrypointKind(providerClass) {
  if (providerClass === 'MIKE_TOBI_OR_AXM_REVIEW_SEAT') {
    return 'HUMAN_REVIEW_SEAT';
  }
  if (providerClass === 'HOST_GOVERNANCE_AUTHORITY') {
    return 'HOST_GOVERNANCE_HANDOFF';
  }
  return 'EXTERNAL_EVIDENCE_SERVICE';
}

function expectedLocatorKind(entrypointKind) {
  if (entrypointKind === 'HUMAN_REVIEW_SEAT') {
    return 'HUMAN_REVIEW_ROUTE';
  }
  if (entrypointKind === 'HOST_GOVERNANCE_HANDOFF') {
    return 'HOST_GOVERNANCE_ROUTE';
  }
  return 'HTTPS_URI';
}

function locatorValueValid(locator) {
  if (typeof locator?.value !== 'string' || locator.value.length < 4 ||
      locator.value.length > 512) return false;
  if (locator.kind === 'HUMAN_REVIEW_ROUTE') {
    return /^human-review:[a-z0-9][a-z0-9._/-]{2,191}$/.test(
      locator.value);
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

function declarationReasonCodes(declaration, batch) {
  if (!exactKeys(declaration, ['schema', 'requestId',
      'requestPacketDigest', 'capabilityId', 'provider', 'entrypoint',
      'locator', 'claimedRecipient', 'resolverClaim', 'verificationPlan',
      'permissionsAndConsent', 'lifecycle', 'digest'])) {
    return ['DECLARATION_SHAPE_INVALID'];
  }
  const reasons = [];
  if (!digestValid(declaration,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_DECLARATION_SCHEMA)) {
    reasons.push('DECLARATION_DIGEST_INVALID');
  }
  const packet = batch.packets.find(candidate =>
    candidate.requestId === declaration.requestId);
  if (!packet) {
    reasons.push('UNKNOWN_REQUEST');
    return [...new Set(reasons)].sort();
  }
  if (declaration.requestPacketDigest !== packet.digest) {
    reasons.push('REQUEST_PACKET_DIGEST_MISMATCH');
  }
  if (declaration.capabilityId !== packet.requestBinding.capabilityId) {
    reasons.push('CAPABILITY_MISMATCH');
  }
  if (!exactKeys(declaration.provider, ['providerId', 'providerClass']) ||
      declaration.provider.providerId !== packet.claimedProvider.providerId ||
      declaration.provider.providerClass !==
        packet.claimedProvider.providerClass) {
    reasons.push('PROVIDER_BINDING_MISMATCH');
  }
  const entrypointKind = expectedEntrypointKind(
    packet.claimedProvider.providerClass);
  if (!exactKeys(declaration.entrypoint, ['kind']) ||
      declaration.entrypoint.kind !== entrypointKind) {
    reasons.push('ENTRYPOINT_KIND_MISMATCH');
  }
  if (!exactKeys(declaration.locator, ['kind', 'value', 'trust']) ||
      declaration.locator.kind !== expectedLocatorKind(entrypointKind) ||
      declaration.locator.trust !== 'CALLER_SUPPLIED_UNVERIFIED' ||
      !locatorValueValid(declaration.locator)) {
    reasons.push('LOCATOR_INVALID_OR_UNSAFE');
  }
  if (!exactKeys(declaration.claimedRecipient,
      ['recipientId', 'identityTrust']) ||
      !/^[a-z0-9][a-z0-9._-]{2,95}$/.test(
        declaration.claimedRecipient?.recipientId || '') ||
      declaration.claimedRecipient.identityTrust !==
        'CALLER_SUPPLIED_UNTRUSTED') {
    reasons.push('RECIPIENT_CLAIM_INVALID');
  }
  if (!exactKeys(declaration.resolverClaim, ['resolverId',
      'resolverVersion', 'resolvedAt', 'validUntil', 'status']) ||
      !/^[a-z0-9][a-z0-9._-]{2,95}$/.test(
        declaration.resolverClaim?.resolverId || '') ||
      !/^[0-9]+\.[0-9]+\.[0-9]+(?:-[a-z0-9.-]+)?$/.test(
        declaration.resolverClaim?.resolverVersion || '') ||
      declaration.resolverClaim.status !== 'CALLER_DECLARED_UNVERIFIED') {
    reasons.push('RESOLVER_CLAIM_INVALID');
  } else {
    const resolvedAt = Date.parse(declaration.resolverClaim.resolvedAt);
    const validUntil = Date.parse(declaration.resolverClaim.validUntil);
    const requestStart = Date.parse(packet.requestWindow.requestedAt);
    const requestEnd = Date.parse(packet.requestWindow.expiresAt);
    if (!Number.isFinite(resolvedAt) || !Number.isFinite(validUntil) ||
        new Date(resolvedAt).toISOString() !==
          declaration.resolverClaim.resolvedAt ||
        new Date(validUntil).toISOString() !==
          declaration.resolverClaim.validUntil ||
        resolvedAt < requestStart || validUntil <= resolvedAt ||
        validUntil > requestEnd) {
      reasons.push('RESOLUTION_WINDOW_INVALID');
    }
  }
  if (!exact(declaration.verificationPlan, {
    independentEndpointOwnershipReceiptRequired: true,
    independentRecipientIdentityReceiptRequired: true,
    allowedAndDeniedRecipientProbesRequired: true,
    senderAndReceiverReceiptMatchRequired: true
  })) reasons.push('VERIFICATION_PLAN_INVALID');
  if (!exact(declaration.permissionsAndConsent, {
    resolverMayContactEndpoint: false,
    resolverMayContactHuman: false,
    resolverMayMutateHost: false,
    resolverMayPersist: false
  })) reasons.push('PERMISSION_BOUNDARY_INVALID');
  if (!exact(declaration.lifecycle, {
    status: 'ENDPOINT_CANDIDATE_UNTRUSTED',
    persisted: false,
    promoted: false,
    canon: false
  })) reasons.push('LIFECYCLE_INVALID');
  return [...new Set(reasons)].sort();
}

function declarationsInputValid(declarations) {
  if (!Array.isArray(declarations) ||
      declarations.length > MAXIMUM_ENDPOINT_DECLARATIONS) return false;
  try {
    const text = JSON.stringify(declarations);
    return typeof text === 'string' &&
      new TextEncoder().encode(text).length <=
        MAXIMUM_SERIALIZED_DECLARATION_BYTES &&
      exact(declarations, JSON.parse(text));
  } catch {
    return false;
  }
}

function expectedAssessment(declaration, inputIndex, batch) {
  const reasonCodes = declarationReasonCodes(declaration, batch);
  const valid = reasonCodes.length === 0;
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_ASSESSMENT_SCHEMA,
    inputIndex,
    requestId: typeof declaration?.requestId === 'string'
      ? declaration.requestId : null,
    requestPacketDigest: valid ? declaration.requestPacketDigest : null,
    capabilityId: valid ? declaration.capabilityId : null,
    providerId: valid ? declaration.provider.providerId : null,
    providerClass: valid ? declaration.provider.providerClass : null,
    entrypointKind: valid ? declaration.entrypoint.kind : null,
    claimedLocatorKind: valid ? declaration.locator.kind : null,
    claimedLocatorValue: valid ? declaration.locator.value : null,
    claimedRecipientId: valid
      ? declaration.claimedRecipient.recipientId : null,
    declarationDigest: typeof declaration?.digest === 'string'
      ? declaration.digest : null,
    status: valid ? 'ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED' :
      'ENDPOINT_DECLARATION_REJECTED',
    reasonCodes,
    truth: {
      declarationStructurallyCompatible: valid,
      endpointResolved: false,
      endpointOwnershipVerified: false,
      recipientIdentityAuthenticated: false,
      contactAuthorized: false,
      transportPerformed: false,
      providerReady: false,
      admissionAuthorized: false,
      worldMutationPerformed: false
    }
  };
}

function expectedEndpointRow(packet, assessments) {
  const matching = assessments.filter(item =>
    item.requestId === packet.requestId);
  const compatible = matching.filter(item =>
    item.status === 'ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED');
  const status = matching.length === 0
    ? 'MISSING_ENDPOINT_DECLARATION'
    : compatible.length === 0
      ? 'REJECTED_ENDPOINT_DECLARATION'
      : compatible.length === 1
        ? 'ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED'
        : 'AMBIGUOUS_ENDPOINT_DECLARATION';
  const selected = compatible.length === 1 ? compatible[0] : null;
  return {
    requestId: packet.requestId,
    requestPacketDigest: packet.digest,
    capabilityId: packet.requestBinding.capabilityId,
    providerId: packet.claimedProvider.providerId,
    providerClass: packet.claimedProvider.providerClass,
    declarationInputIndexes: matching.map(item => item.inputIndex),
    status,
    claimedLocatorKind: selected?.claimedLocatorKind || null,
    claimedLocatorValue: selected?.claimedLocatorValue || null,
    claimedRecipientId: selected?.claimedRecipientId || null,
    blockingReasons: status === 'MISSING_ENDPOINT_DECLARATION'
      ? ['ENDPOINT_DECLARATION_REQUIRED']
      : status === 'REJECTED_ENDPOINT_DECLARATION'
        ? ['ALL_ENDPOINT_DECLARATIONS_REJECTED']
        : status === 'AMBIGUOUS_ENDPOINT_DECLARATION'
          ? ['MULTIPLE_COMPATIBLE_ENDPOINT_DECLARATIONS']
          : ['INDEPENDENT_ENDPOINT_OWNERSHIP_REQUIRED',
            'INDEPENDENT_RECIPIENT_IDENTITY_REQUIRED',
            'CONTACT_AUTHORIZATION_REQUIRED'],
    operationalReadiness: 'BLOCKED',
    truth: {
      endpointResolved: false,
      endpointOwnershipVerified: false,
      recipientIdentityAuthenticated: false,
      contactAuthorized: false,
      transportPerformed: false,
      receiverReceiptObserved: false,
      providerReady: false,
      admissionAuthorized: false
    }
  };
}

function expectedPreflight(contract, custody, declarations) {
  const assessments = declarations.map((declaration, inputIndex) =>
    expectedAssessment(declaration, inputIndex, custody.r123Batch));
  const endpoints = custody.r123Batch.packets.map(packet =>
    expectedEndpointRow(packet, assessments));
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_PREFLIGHT_SCHEMA,
    status: endpoints.length === 0 ? EMPTY_STATUS :
      declarations.length === 0 ? NO_DECLARATIONS_STATUS : ASSESSED_STATUS,
    sourceContract: sourceRef(contract),
    sourceR123: {
      contract: sourceRef(custody.r123Contract),
      requestBatch: sourceRef(custody.r123Batch)
    },
    assessments,
    endpoints,
    summary: {
      sourceRequestPacketCount: custody.r123Batch.packets.length,
      endpointDeclarationCount: declarations.length,
      compatibleUnverifiedDeclarationCount: assessments.filter(item =>
        item.status === 'ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED').length,
      rejectedDeclarationCount: assessments.filter(item =>
        item.status === 'ENDPOINT_DECLARATION_REJECTED').length,
      missingEndpointCount: endpoints.filter(item =>
        item.status === 'MISSING_ENDPOINT_DECLARATION').length,
      rejectedEndpointCount: endpoints.filter(item =>
        item.status === 'REJECTED_ENDPOINT_DECLARATION').length,
      ambiguousEndpointCount: endpoints.filter(item =>
        item.status === 'AMBIGUOUS_ENDPOINT_DECLARATION').length,
      compatibleUnverifiedEndpointCount: endpoints.filter(item =>
        item.status === 'ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED').length,
      endpointResolvedCount: 0,
      recipientAuthenticatedCount: 0,
      contactAuthorizedCount: 0,
      transmittedRequestCount: 0,
      receiverReceiptCount: 0,
      operationallyReadyProviderCount: 0,
      admissionReady: false
    },
    prohibitedConclusions: {
      treatDeclaredLocatorAsResolvedEndpoint: true,
      treatClaimedRecipientAsAuthenticated: true,
      contactEndpointOrHumanWithoutAuthority: true,
      claimTransportWithoutMatchedReceipts: true,
      treatEndpointPreflightAsProviderVerification: true,
      admitEvidenceOwnerOrDebit: true,
      persistMutatePromoteOrCanonize: true
    },
    truth: {
      exactR123RequestPacketsBound: true,
      declarationsEvaluatedWithoutContact: true,
      realEndpointResolutionPerformed: false,
      recipientAuthenticationPerformed: false,
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
auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionPreflight(
  contract, preflight, custody, declarations = []) {
  const exactCustody = custodyValid(custody);
  const declarationsBounded = declarationsInputValid(declarations);
  const expectedContractValue = exactCustody ? expectedContract(custody) : null;
  const contractExact = expectedContractValue !== null &&
    exact(contract, expectedContractValue);
  const expectedPreflightValue = contractExact && declarationsBounded
    ? expectedPreflight(expectedContractValue, custody, declarations) : null;
  const preflightExact = expectedPreflightValue !== null &&
    new TextEncoder().encode(JSON.stringify(expectedPreflightValue)).length <=
      MAXIMUM_SERIALIZED_PREFLIGHT_BYTES &&
    exact(preflight, expectedPreflightValue);
  const checks = {
    exactR123CustodyValid: exactCustody,
    contractIndependentlyReconstructed: contractExact,
    declarationBudgetValid: declarationsBounded,
    declarationsIndependentlyAssessed: preflightExact,
    requestEndpointRowsIndependentlyReconstructed: preflightExact,
    compatibleDeclarationsRemainUnverified: preflightExact &&
      preflight.endpoints.every(endpoint =>
        endpoint.operationalReadiness === 'BLOCKED' &&
        endpoint.truth.endpointResolved === false &&
        endpoint.truth.recipientIdentityAuthenticated === false),
    noContactTransportOrReceiverReceiptClaimed: preflightExact &&
      preflight.summary.contactAuthorizedCount === 0 &&
      preflight.summary.transmittedRequestCount === 0 &&
      preflight.summary.receiverReceiptCount === 0,
    providerReadinessAndAdmissionRemainZero: preflightExact &&
      preflight.summary.operationallyReadyProviderCount === 0 &&
      preflight.summary.admissionReady === false,
    prohibitedConclusionsFailClosed: preflightExact &&
      Object.values(preflight.prohibitedConclusions).every(value =>
        value === true),
    preflightIndependentlyReconstructed: preflightExact
  };
  const pass = Object.values(checks).every(value => value === true);
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_PREFLIGHT_AUDIT_SCHEMA,
    status: pass ? 'PASS' : 'FAIL',
    checks,
    detail: {
      sourceRequestPacketCount: preflightExact
        ? preflight.summary.sourceRequestPacketCount : 0,
      endpointDeclarationCount: preflightExact
        ? preflight.summary.endpointDeclarationCount : 0,
      compatibleUnverifiedEndpointCount: preflightExact
        ? preflight.summary.compatibleUnverifiedEndpointCount : 0,
      missingEndpointCount: preflightExact
        ? preflight.summary.missingEndpointCount : 0,
      rejectedEndpointCount: preflightExact
        ? preflight.summary.rejectedEndpointCount : 0,
      ambiguousEndpointCount: preflightExact
        ? preflight.summary.ambiguousEndpointCount : 0,
      endpointResolvedCount: 0,
      recipientAuthenticatedCount: 0,
      transmittedRequestCount: 0,
      receiverReceiptCount: 0,
      operationallyReadyProviderCount: 0
    },
    truth: {
      auditReconstructedR124WithoutCallingR124BuildersOrValidators: true,
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
