import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_PACKET_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationRequestContractReceiptValid,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationRequestBatchValid
} from './matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-request.mjs?v=0.123.0-r123.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolution-preflight-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_DECLARATION_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-declaration/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_ASSESSMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-assessment/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_PREFLIGHT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolution-preflight/v1';

export const
  HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_PREFLIGHT_EVALUATE_CAPABILITY_ID =
    'contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.endpoint-resolution.preflight.evaluate';

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

function sourceValid(source, contract = null) {
  const valid = exactKeys(source, ['r123Contract', 'r123Batch',
    'r123RequestSource', 'r123Options']) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationRequestContractReceiptValid(
      source.r123Contract) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationRequestBatchValid(
      source.r123Batch, source.r123Contract, source.r123RequestSource,
      source.r123Options);
  return valid && (contract === null ||
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionPreflightContractReceiptValid(
      contract) && exact(contract.sourceR123, {
      contract: sourceRef(source.r123Contract),
      requestBatch: sourceRef(source.r123Batch)
    }) && contract.projection.sourceRequestPacketCount ===
      source.r123Batch.packets.length);
}

function custodyValid(custody) {
  return exactKeys(custody, ['r123Contract', 'r123Batch',
    'r123RequestSource', 'r123Options', 'r123Custody']) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationRequestContractReceiptValid(
      custody.r123Contract, custody.r123Custody) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationRequestBatchValid(
      custody.r123Batch, custody.r123Contract, custody.r123RequestSource,
      custody.r123Options);
}

const expectedContractTruth = () => ({
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
});

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
    truth: expectedContractTruth()
  };
  receipt.digest = stableDigest(receipt);
  return receipt;
}

export function
landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionPreflightContractReceiptValid(
  receipt, custody = null) {
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'sourceR123', 'projection',
        'resourceBudget', 'truth', 'digest']) ||
      !exactKeys(receipt.sourceR123, ['contract', 'requestBatch']) ||
      !Object.values(receipt.sourceR123).every(ref => exactKeys(ref,
        ['schema', 'receiptDigest'])) ||
      receipt.sourceR123.contract.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA ||
      receipt.sourceR123.requestBatch.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA ||
      !exactKeys(receipt.projection, ['sourceRequestPacketCount',
        'endpointDeclarationSchema', 'endpointAssessmentSchema',
        'endpointPreflightSchema', 'requiredResolverCapabilityId',
        'nextTransportCapabilityId', 'implementedContractCapabilityId']) ||
      !Number.isInteger(receipt.projection.sourceRequestPacketCount) ||
      receipt.projection.sourceRequestPacketCount < 0 ||
      receipt.projection.sourceRequestPacketCount > 15 ||
      receipt.projection.endpointDeclarationSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_DECLARATION_SCHEMA ||
      receipt.projection.endpointAssessmentSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_ASSESSMENT_SCHEMA ||
      receipt.projection.endpointPreflightSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_PREFLIGHT_SCHEMA ||
      receipt.projection.requiredResolverCapabilityId !==
        REQUIRED_RESOLVER_CAPABILITY_ID ||
      receipt.projection.nextTransportCapabilityId !==
        NEXT_TRANSPORT_CAPABILITY_ID ||
      receipt.projection.implementedContractCapabilityId !==
        HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_PREFLIGHT_EVALUATE_CAPABILITY_ID ||
      !exact(receipt.resourceBudget, {
        maximumEndpointDeclarations: MAXIMUM_ENDPOINT_DECLARATIONS,
        maximumSerializedDeclarationBytes:
          MAXIMUM_SERIALIZED_DECLARATION_BYTES,
        maximumSerializedPreflightBytes: MAXIMUM_SERIALIZED_PREFLIGHT_BYTES
      }) || receipt.status !== CONTRACT_STATUS ||
      !exact(receipt.truth, expectedContractTruth())) return false;
  return custody === null || custodyValid(custody) &&
    exact(receipt, expectedContract(custody));
}

export function
createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionPreflightContractReceipt(
  custody) {
  if (!custodyValid(custody)) {
    throw new Error(
      'Endpoint-resolution preflight contract needs the exact R123 contract, request batch, request source, options, and full custody');
  }
  return expectedContract(custody);
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

function declarationReasonCodes(declaration, source) {
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
  const packet = source.r123Batch.packets.find(candidate =>
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
  })) {
    reasons.push('VERIFICATION_PLAN_INVALID');
  }
  if (!exact(declaration.permissionsAndConsent, {
    resolverMayContactEndpoint: false,
    resolverMayContactHuman: false,
    resolverMayMutateHost: false,
    resolverMayPersist: false
  })) {
    reasons.push('PERMISSION_BOUNDARY_INVALID');
  }
  if (!exact(declaration.lifecycle, {
    status: 'ENDPOINT_CANDIDATE_UNTRUSTED',
    persisted: false,
    promoted: false,
    canon: false
  })) {
    reasons.push('LIFECYCLE_INVALID');
  }
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

export function
landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointDeclarationValid(
  declaration, source) {
  return sourceValid(source) && declarationReasonCodes(declaration, source)
    .length === 0;
}

function expectedAssessment(declaration, inputIndex, source) {
  const reasonCodes = declarationReasonCodes(declaration, source);
  const valid = reasonCodes.length === 0;
  const assessment = {
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
  return assessment;
}

function expectedEndpointRow(packet, assessments) {
  const matching = assessments.filter(assessment =>
    assessment.requestId === packet.requestId);
  const compatible = matching.filter(assessment =>
    assessment.status === 'ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED');
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

function expectedPreflight(contract, source, declarations) {
  const assessments = declarations.map((declaration, inputIndex) =>
    expectedAssessment(declaration, inputIndex, source));
  const endpoints = source.r123Batch.packets.map(packet =>
    expectedEndpointRow(packet, assessments));
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_PREFLIGHT_SCHEMA,
    status: endpoints.length === 0 ? EMPTY_STATUS :
      declarations.length === 0 ? NO_DECLARATIONS_STATUS : ASSESSED_STATUS,
    sourceContract: sourceRef(contract),
    sourceR123: {
      contract: sourceRef(source.r123Contract),
      requestBatch: sourceRef(source.r123Batch)
    },
    assessments,
    endpoints,
    summary: {
      sourceRequestPacketCount: source.r123Batch.packets.length,
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

function assessmentShapeValid(assessment, index) {
  const compatible = assessment?.status ===
    'ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED';
  return exactKeys(assessment, ['schema', 'inputIndex', 'requestId',
    'requestPacketDigest', 'capabilityId', 'providerId', 'providerClass',
    'entrypointKind', 'claimedLocatorKind', 'claimedLocatorValue',
    'claimedRecipientId', 'declarationDigest', 'status', 'reasonCodes',
    'truth']) && assessment.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_ASSESSMENT_SCHEMA &&
    assessment.inputIndex === index &&
    (typeof assessment.requestId === 'string' ||
      assessment.requestId === null) &&
    (typeof assessment.declarationDigest === 'string' ||
      assessment.declarationDigest === null) &&
    ['ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED',
      'ENDPOINT_DECLARATION_REJECTED'].includes(assessment.status) &&
    Array.isArray(assessment.reasonCodes) &&
    (compatible ? assessment.reasonCodes.length === 0 &&
      [assessment.requestPacketDigest, assessment.capabilityId,
        assessment.providerId, assessment.providerClass,
        assessment.entrypointKind, assessment.claimedLocatorKind,
        assessment.claimedLocatorValue,
        assessment.claimedRecipientId].every(value =>
        typeof value === 'string' && value.length > 0) :
      assessment.reasonCodes.length > 0 &&
      [assessment.requestPacketDigest, assessment.capabilityId,
        assessment.providerId, assessment.providerClass,
        assessment.entrypointKind, assessment.claimedLocatorKind,
        assessment.claimedLocatorValue,
        assessment.claimedRecipientId].every(value => value === null)) &&
    exact(assessment.truth, {
      declarationStructurallyCompatible: compatible,
      endpointResolved: false,
      endpointOwnershipVerified: false,
      recipientIdentityAuthenticated: false,
      contactAuthorized: false,
      transportPerformed: false,
      providerReady: false,
      admissionAuthorized: false,
      worldMutationPerformed: false
    });
}

function endpointShapeValid(endpoint) {
  const compatible = endpoint?.status ===
    'ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED';
  return exactKeys(endpoint, ['requestId', 'requestPacketDigest',
    'capabilityId', 'providerId', 'providerClass',
    'declarationInputIndexes', 'status', 'claimedLocatorKind',
    'claimedLocatorValue', 'claimedRecipientId', 'blockingReasons',
    'operationalReadiness', 'truth']) &&
    [endpoint.requestId, endpoint.requestPacketDigest, endpoint.capabilityId,
      endpoint.providerId, endpoint.providerClass].every(value =>
      typeof value === 'string' && value.length > 0) &&
    Array.isArray(endpoint.declarationInputIndexes) &&
    endpoint.declarationInputIndexes.every(value =>
      Number.isInteger(value) && value >= 0 &&
      value < MAXIMUM_ENDPOINT_DECLARATIONS) &&
    new Set(endpoint.declarationInputIndexes).size ===
      endpoint.declarationInputIndexes.length &&
    ['MISSING_ENDPOINT_DECLARATION', 'REJECTED_ENDPOINT_DECLARATION',
      'AMBIGUOUS_ENDPOINT_DECLARATION',
      'ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED'].includes(endpoint.status) &&
    (compatible
      ? [endpoint.claimedLocatorKind, endpoint.claimedLocatorValue,
          endpoint.claimedRecipientId].every(value =>
          typeof value === 'string' && value.length > 0)
      : [endpoint.claimedLocatorKind, endpoint.claimedLocatorValue,
          endpoint.claimedRecipientId].every(value => value === null)) &&
    Array.isArray(endpoint.blockingReasons) &&
    endpoint.blockingReasons.length > 0 &&
    endpoint.operationalReadiness === 'BLOCKED' &&
    exact(endpoint.truth, {
      endpointResolved: false,
      endpointOwnershipVerified: false,
      recipientIdentityAuthenticated: false,
      contactAuthorized: false,
      transportPerformed: false,
      receiverReceiptObserved: false,
      providerReady: false,
      admissionAuthorized: false
    });
}

function preflightShapeValid(preflight) {
  return digestValid(preflight,
    LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_PREFLIGHT_SCHEMA) &&
    exactKeys(preflight, ['schema', 'status', 'sourceContract',
      'sourceR123', 'assessments', 'endpoints', 'summary',
      'prohibitedConclusions', 'truth', 'digest']) &&
    exactKeys(preflight.sourceContract, ['schema', 'receiptDigest']) &&
    exactKeys(preflight.sourceR123, ['contract', 'requestBatch']) &&
    Object.values(preflight.sourceR123).every(ref => exactKeys(ref,
      ['schema', 'receiptDigest'])) &&
    Array.isArray(preflight.assessments) &&
    preflight.assessments.length <= MAXIMUM_ENDPOINT_DECLARATIONS &&
    preflight.assessments.every(assessmentShapeValid) &&
    Array.isArray(preflight.endpoints) && preflight.endpoints.length <= 15 &&
    preflight.endpoints.every(endpointShapeValid) &&
    exactKeys(preflight.summary, ['sourceRequestPacketCount',
      'endpointDeclarationCount', 'compatibleUnverifiedDeclarationCount',
      'rejectedDeclarationCount', 'missingEndpointCount',
      'rejectedEndpointCount', 'ambiguousEndpointCount',
      'compatibleUnverifiedEndpointCount', 'endpointResolvedCount',
      'recipientAuthenticatedCount', 'contactAuthorizedCount',
      'transmittedRequestCount', 'receiverReceiptCount',
      'operationallyReadyProviderCount', 'admissionReady']) &&
    preflight.summary.sourceRequestPacketCount === preflight.endpoints.length &&
    preflight.summary.endpointDeclarationCount ===
      preflight.assessments.length &&
    preflight.summary.compatibleUnverifiedDeclarationCount ===
      preflight.assessments.filter(item => item.status ===
        'ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED').length &&
    preflight.summary.rejectedDeclarationCount ===
      preflight.assessments.filter(item => item.status ===
        'ENDPOINT_DECLARATION_REJECTED').length &&
    preflight.summary.missingEndpointCount === preflight.endpoints.filter(
      item => item.status === 'MISSING_ENDPOINT_DECLARATION').length &&
    preflight.summary.rejectedEndpointCount === preflight.endpoints.filter(
      item => item.status === 'REJECTED_ENDPOINT_DECLARATION').length &&
    preflight.summary.ambiguousEndpointCount === preflight.endpoints.filter(
      item => item.status === 'AMBIGUOUS_ENDPOINT_DECLARATION').length &&
    preflight.summary.compatibleUnverifiedEndpointCount ===
      preflight.endpoints.filter(item => item.status ===
        'ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED').length &&
    preflight.summary.endpointResolvedCount === 0 &&
    preflight.summary.recipientAuthenticatedCount === 0 &&
    preflight.summary.contactAuthorizedCount === 0 &&
    preflight.summary.transmittedRequestCount === 0 &&
    preflight.summary.receiverReceiptCount === 0 &&
    preflight.summary.operationallyReadyProviderCount === 0 &&
    preflight.summary.admissionReady === false &&
    exactKeys(preflight.prohibitedConclusions,
      ['treatDeclaredLocatorAsResolvedEndpoint',
        'treatClaimedRecipientAsAuthenticated',
        'contactEndpointOrHumanWithoutAuthority',
        'claimTransportWithoutMatchedReceipts',
        'treatEndpointPreflightAsProviderVerification',
        'admitEvidenceOwnerOrDebit', 'persistMutatePromoteOrCanonize']) &&
    Object.values(preflight.prohibitedConclusions).every(value =>
      value === true) && exact(preflight.truth, {
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
    }) && [EMPTY_STATUS, NO_DECLARATIONS_STATUS,
      ASSESSED_STATUS].includes(preflight.status) &&
    (preflight.status === EMPTY_STATUS
      ? preflight.endpoints.length === 0 &&
        preflight.assessments.length === 0
      : preflight.status === NO_DECLARATIONS_STATUS
        ? preflight.endpoints.length > 0 &&
          preflight.assessments.length === 0
        : preflight.endpoints.length > 0 &&
          preflight.assessments.length > 0) &&
    new TextEncoder().encode(JSON.stringify(preflight)).length <=
      MAXIMUM_SERIALIZED_PREFLIGHT_BYTES;
}

export function
landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionPreflightValid(
  preflight, contract = null, source = null, declarations = null) {
  if (!preflightShapeValid(preflight)) return false;
  if (contract === null && source === null && declarations === null) return true;
  return contract !== null && source !== null && declarations !== null &&
    sourceValid(source, contract) && declarationsInputValid(declarations) &&
    exact(preflight, expectedPreflight(contract, source, declarations));
}

export function
createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionPreflight(
  contract, source, declarations = []) {
  if (!sourceValid(source, contract) ||
      !declarationsInputValid(declarations)) {
    throw new Error(
      'Endpoint-resolution preflight needs the exact R124 contract, R123 request batch and source, plus a bounded declaration array');
  }
  const preflight = expectedPreflight(contract, source, declarations);
  if (new TextEncoder().encode(JSON.stringify(preflight)).length >
      MAXIMUM_SERIALIZED_PREFLIGHT_BYTES) {
    throw new Error('Endpoint-resolution preflight exceeds its resource ceiling');
  }
  return preflight;
}

export function
matrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionPreflightDescription() {
  return {
    status: 'EXPERIMENTAL',
    capabilityId:
      HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_PREFLIGHT_EVALUATE_CAPABILITY_ID,
    statement:
      'R124 evaluates bounded caller-supplied endpoint declarations against exact R123 request packets while treating every compatible locator and recipient as unverified and operationally blocked.',
    boundaries: [
      'The current real R123 request batch is empty, so the current endpoint preflight is empty.',
      'A structurally compatible endpoint declaration does not resolve an endpoint, authenticate a recipient, authorize contact, or verify a provider.',
      'No DNS or service discovery, endpoint or human contact, transport, persistence, evidence admission, owner/debit mutation, promotion, canonization, or world mutation is performed.'
    ]
  };
}
