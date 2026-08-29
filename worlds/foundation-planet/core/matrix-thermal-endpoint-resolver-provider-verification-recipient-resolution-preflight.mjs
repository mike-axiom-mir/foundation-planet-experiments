import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestContractReceiptValid,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestBatchValid
} from './matrix-thermal-endpoint-resolver-provider-verification-request.mjs?v=0.128.0-r128.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-verification-recipient-resolution-preflight-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_ENDPOINT_DECLARATION_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-verification-recipient-endpoint-declaration/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_ENDPOINT_ASSESSMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-verification-recipient-endpoint-assessment/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_RESOLUTION_PREFLIGHT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-verification-recipient-resolution-preflight/v1';

export const
  HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_RESOLUTION_PREFLIGHT_EVALUATE_CAPABILITY_ID =
    'contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.endpoint-resolution.resolver-provider.verification.recipient-resolution.preflight.evaluate';

const CONTRACT_STATUS =
  'RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_RESOLUTION_PREFLIGHT_CONTRACT_AVAILABLE';
const EMPTY_STATUS =
  'NO_RESOLVER_PROVIDER_VERIFICATION_REQUESTS_RECIPIENT_PREFLIGHT_EMPTY';
const NO_DECLARATIONS_STATUS =
  'RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_UNRESOLVED_NO_DECLARATIONS';
const ASSESSED_STATUS =
  'RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_DECLARATIONS_ASSESSED_UNVERIFIED';
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

function sourceValid(source, contract = null) {
  const valid = exactKeys(source, ['r128Contract', 'r128Batch',
    'r128RequestSource', 'r128Options']) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestContractReceiptValid(
      source.r128Contract) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestBatchValid(
      source.r128Batch, source.r128Contract, source.r128RequestSource,
      source.r128Options);
  return valid && (contract === null ||
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflightContractReceiptValid(
      contract) && exact(contract.sourceR128, {
      contract: sourceRef(source.r128Contract),
      requestBatch: sourceRef(source.r128Batch)
    }) && contract.projection.sourceRequestPacketCount ===
      source.r128Batch.packets.length);
}

function custodyValid(custody) {
  return exactKeys(custody, ['r128Contract', 'r128Batch',
    'r128RequestSource', 'r128Options', 'r128Custody']) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestContractReceiptValid(
      custody.r128Contract, custody.r128Custody) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestBatchValid(
      custody.r128Batch, custody.r128Contract, custody.r128RequestSource,
      custody.r128Options);
}

const expectedContractTruth = () => ({
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
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
    status: CONTRACT_STATUS,
    sourceR128: {
      contract: sourceRef(custody.r128Contract),
      requestBatch: sourceRef(custody.r128Batch)
    },
    projection: {
      sourceRequestPacketCount: custody.r128Batch.packets.length,
      endpointDeclarationSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_ENDPOINT_DECLARATION_SCHEMA,
      endpointAssessmentSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_ENDPOINT_ASSESSMENT_SCHEMA,
      endpointPreflightSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_RESOLUTION_PREFLIGHT_SCHEMA,
      requiredIndependentResolverCapabilityId: REQUIRED_RESOLVER_CAPABILITY_ID,
      nextTransportCapabilityId: NEXT_TRANSPORT_CAPABILITY_ID,
      implementedContractCapabilityId:
        HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_RESOLUTION_PREFLIGHT_EVALUATE_CAPABILITY_ID
    },
    resourceBudget: {
      maximumEndpointDeclarations: MAXIMUM_ENDPOINT_DECLARATIONS,
      maximumDeclaredDependencies: MAXIMUM_DECLARED_DEPENDENCIES,
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
landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflightContractReceiptValid(
  receipt, custody = null) {
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'sourceR128', 'projection',
        'resourceBudget', 'truth', 'digest']) ||
      !exactKeys(receipt.sourceR128, ['contract', 'requestBatch']) ||
      !Object.values(receipt.sourceR128).every(ref => exactKeys(ref,
        ['schema', 'receiptDigest'])) ||
      receipt.sourceR128.contract.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA ||
      receipt.sourceR128.requestBatch.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_REQUEST_BATCH_SCHEMA ||
      !exactKeys(receipt.projection, ['sourceRequestPacketCount',
        'endpointDeclarationSchema', 'endpointAssessmentSchema',
        'endpointPreflightSchema', 'requiredIndependentResolverCapabilityId',
        'nextTransportCapabilityId', 'implementedContractCapabilityId']) ||
      !Number.isInteger(receipt.projection.sourceRequestPacketCount) ||
      receipt.projection.sourceRequestPacketCount < 0 ||
      receipt.projection.sourceRequestPacketCount > 1 ||
      receipt.projection.endpointDeclarationSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_ENDPOINT_DECLARATION_SCHEMA ||
      receipt.projection.endpointAssessmentSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_ENDPOINT_ASSESSMENT_SCHEMA ||
      receipt.projection.endpointPreflightSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_RESOLUTION_PREFLIGHT_SCHEMA ||
      receipt.projection.requiredIndependentResolverCapabilityId !==
        REQUIRED_RESOLVER_CAPABILITY_ID ||
      receipt.projection.nextTransportCapabilityId !==
        NEXT_TRANSPORT_CAPABILITY_ID ||
      receipt.projection.implementedContractCapabilityId !==
        HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_RESOLUTION_PREFLIGHT_EVALUATE_CAPABILITY_ID ||
      !exact(receipt.resourceBudget, {
        maximumEndpointDeclarations: MAXIMUM_ENDPOINT_DECLARATIONS,
        maximumDeclaredDependencies: MAXIMUM_DECLARED_DEPENDENCIES,
        maximumSerializedDeclarationBytes:
          MAXIMUM_SERIALIZED_DECLARATION_BYTES,
        maximumSerializedPreflightBytes: MAXIMUM_SERIALIZED_PREFLIGHT_BYTES
      }) || receipt.status !== CONTRACT_STATUS ||
      !exact(receipt.truth, expectedContractTruth())) return false;
  return custody === null || custodyValid(custody) &&
    exact(receipt, expectedContract(custody));
}

export function
createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflightContractReceipt(
  custody) {
  if (!custodyValid(custody)) {
    throw new Error(
      'Verification-recipient resolution preflight contract needs the exact R128 contract, request batch, request source, options, and full custody');
  }
  return expectedContract(custody);
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

function declarationReasonCodes(declaration, source) {
  if (!exactKeys(declaration, ['schema', 'requestId',
      'requestPacketDigest', 'resolverCapabilityId',
      'candidateResolverProvider', 'claimedVerificationRecipient',
      'locator', 'alternateResolverClaim', 'resolutionWindow',
      'verificationPlan', 'permissionsAndConsent', 'lifecycle', 'digest'])) {
    return ['DECLARATION_SHAPE_INVALID'];
  }
  const reasons = [];
  if (!digestValid(declaration,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_ENDPOINT_DECLARATION_SCHEMA)) {
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
  })) {
    reasons.push('VERIFICATION_PLAN_INVALID');
  }
  if (!exact(declaration.permissionsAndConsent, {
    alternateResolverMayContactEndpoint: false,
    alternateResolverMayContactHuman: false,
    candidateResolverMayResolveOwnVerifier: false,
    declarationMayAuthorizeContact: false,
    resolverMayMutateHost: false,
    resolverMayPersist: false
  })) {
    reasons.push('PERMISSION_BOUNDARY_INVALID');
  }
  if (!exact(declaration.lifecycle, {
    status: 'VERIFICATION_RECIPIENT_ENDPOINT_CANDIDATE_UNTRUSTED',
    endpointResolved: false,
    recipientAuthenticated: false,
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
landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientEndpointDeclarationValid(
  declaration, source) {
  return sourceValid(source) && declarationReasonCodes(declaration, source)
    .length === 0;
}

function expectedAssessment(declaration, inputIndex, source) {
  const reasonCodes = declarationReasonCodes(declaration, source);
  const valid = reasonCodes.length === 0;
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_ENDPOINT_ASSESSMENT_SCHEMA,
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

function expectedEndpointRow(packet, assessments) {
  const matching = assessments.filter(assessment =>
    assessment.requestId === packet.requestId);
  const compatible = matching.filter(assessment =>
    assessment.status ===
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
    expectedEndpointRow(packet, assessments));
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_RESOLUTION_PREFLIGHT_SCHEMA,
    status: endpoints.length === 0 ? EMPTY_STATUS :
      declarations.length === 0 ? NO_DECLARATIONS_STATUS : ASSESSED_STATUS,
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
      missingEndpointCount: endpoints.filter(item =>
        item.status === 'MISSING_RECIPIENT_ENDPOINT_DECLARATION').length,
      rejectedEndpointCount: endpoints.filter(item =>
        item.status === 'REJECTED_RECIPIENT_ENDPOINT_DECLARATION').length,
      ambiguousEndpointCount: endpoints.filter(item =>
        item.status === 'AMBIGUOUS_RECIPIENT_ENDPOINT_DECLARATION').length,
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

function assessmentShapeValid(assessment, index) {
  return exactKeys(assessment, ['schema', 'inputIndex', 'requestId',
    'requestPacketDigest', 'candidateResolverProviderId',
    'claimedVerificationRecipientId', 'alternateResolverProviderId',
    'claimedLocatorKind', 'claimedLocatorValue', 'declarationDigest',
    'status', 'reasonCodes', 'truth']) &&
    assessment.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_ENDPOINT_ASSESSMENT_SCHEMA &&
    assessment.inputIndex === index &&
    ['RECIPIENT_ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED',
      'RECIPIENT_ENDPOINT_DECLARATION_REJECTED'].includes(
        assessment.status) &&
    Array.isArray(assessment.reasonCodes) &&
    (assessment.status ===
      'RECIPIENT_ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED'
      ? assessment.reasonCodes.length === 0 &&
        [assessment.requestId, assessment.requestPacketDigest,
          assessment.candidateResolverProviderId,
          assessment.claimedVerificationRecipientId,
          assessment.alternateResolverProviderId,
          assessment.claimedLocatorKind,
          assessment.claimedLocatorValue,
          assessment.declarationDigest].every(value =>
          typeof value === 'string')
      : assessment.reasonCodes.length > 0) &&
    exact(assessment.truth, {
      declarationStructurallyCompatible: assessment.status ===
        'RECIPIENT_ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED',
      alternateResolverIndependent: false,
      endpointResolved: false,
      endpointOwnershipVerified: false,
      recipientIdentityAuthenticated: false,
      contactAuthorized: false,
      transportPerformed: false,
      resolverProviderVerified: false,
      admissionAuthorized: false,
      worldMutationPerformed: false
    });
}

function endpointShapeValid(endpoint) {
  const compatible = endpoint?.status ===
    'RECIPIENT_ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED';
  return exactKeys(endpoint, ['requestId', 'requestPacketDigest',
    'candidateResolverProviderId', 'claimedVerificationRecipientId',
    'declarationInputIndexes', 'status', 'alternateResolverProviderId',
    'claimedLocatorKind', 'claimedLocatorValue', 'blockingReasons',
    'operationalReadiness', 'truth']) &&
    [endpoint.requestId, endpoint.requestPacketDigest,
      endpoint.candidateResolverProviderId,
      endpoint.claimedVerificationRecipientId].every(value =>
      typeof value === 'string') &&
    Array.isArray(endpoint.declarationInputIndexes) &&
    endpoint.declarationInputIndexes.every(Number.isInteger) &&
    new Set(endpoint.declarationInputIndexes).size ===
      endpoint.declarationInputIndexes.length &&
    ['MISSING_RECIPIENT_ENDPOINT_DECLARATION',
      'REJECTED_RECIPIENT_ENDPOINT_DECLARATION',
      'AMBIGUOUS_RECIPIENT_ENDPOINT_DECLARATION',
      'RECIPIENT_ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED']
      .includes(endpoint.status) &&
    (compatible
      ? [endpoint.alternateResolverProviderId, endpoint.claimedLocatorKind,
          endpoint.claimedLocatorValue].every(value =>
          typeof value === 'string')
      : [endpoint.alternateResolverProviderId, endpoint.claimedLocatorKind,
          endpoint.claimedLocatorValue].every(value => value === null)) &&
    Array.isArray(endpoint.blockingReasons) &&
    endpoint.blockingReasons.length > 0 &&
    endpoint.operationalReadiness === 'BLOCKED' &&
    exact(endpoint.truth, {
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
    });
}

function preflightShapeValid(preflight) {
  return digestValid(preflight,
    LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_RESOLUTION_PREFLIGHT_SCHEMA) &&
    exactKeys(preflight, ['schema', 'status', 'sourceContract',
      'sourceR128', 'assessments', 'endpoints', 'summary',
      'prohibitedConclusions', 'truth', 'digest']) &&
    exactKeys(preflight.sourceContract, ['schema', 'receiptDigest']) &&
    exactKeys(preflight.sourceR128, ['contract', 'requestBatch']) &&
    Object.values(preflight.sourceR128).every(ref => exactKeys(ref,
      ['schema', 'receiptDigest'])) &&
    Array.isArray(preflight.assessments) &&
    preflight.assessments.length <= MAXIMUM_ENDPOINT_DECLARATIONS &&
    preflight.assessments.every(assessmentShapeValid) &&
    Array.isArray(preflight.endpoints) && preflight.endpoints.length <= 1 &&
    preflight.endpoints.every(endpointShapeValid) &&
    exactKeys(preflight.summary, ['sourceRequestPacketCount',
      'endpointDeclarationCount', 'compatibleUnverifiedDeclarationCount',
      'rejectedDeclarationCount', 'directSelfResolutionRejectionCount',
      'circularDependencyRejectionCount', 'missingEndpointCount',
      'rejectedEndpointCount', 'ambiguousEndpointCount',
      'compatibleUnverifiedEndpointCount',
      'independentlyResolvedEndpointCount', 'authenticatedRecipientCount',
      'contactAuthorizedCount', 'transmittedRequestCount',
      'receiverReceiptCount', 'independentlyVerifiedResolverProviderCount',
      'admissionReady']) &&
    preflight.summary.sourceRequestPacketCount === preflight.endpoints.length &&
    preflight.summary.endpointDeclarationCount ===
      preflight.assessments.length &&
    preflight.summary.compatibleUnverifiedDeclarationCount ===
      preflight.assessments.filter(item => item.status ===
        'RECIPIENT_ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED').length &&
    preflight.summary.rejectedDeclarationCount ===
      preflight.assessments.filter(item => item.status ===
        'RECIPIENT_ENDPOINT_DECLARATION_REJECTED').length &&
    preflight.summary.directSelfResolutionRejectionCount ===
      preflight.assessments.filter(item => item.reasonCodes.includes(
        'DIRECT_CANDIDATE_SELF_RESOLUTION_PROHIBITED')).length &&
    preflight.summary.circularDependencyRejectionCount ===
      preflight.assessments.filter(item => item.reasonCodes.includes(
        'CIRCULAR_RESOLVER_DEPENDENCY_PROHIBITED')).length &&
    preflight.summary.missingEndpointCount === preflight.endpoints.filter(
      item => item.status ===
        'MISSING_RECIPIENT_ENDPOINT_DECLARATION').length &&
    preflight.summary.rejectedEndpointCount === preflight.endpoints.filter(
      item => item.status ===
        'REJECTED_RECIPIENT_ENDPOINT_DECLARATION').length &&
    preflight.summary.ambiguousEndpointCount === preflight.endpoints.filter(
      item => item.status ===
        'AMBIGUOUS_RECIPIENT_ENDPOINT_DECLARATION').length &&
    preflight.summary.compatibleUnverifiedEndpointCount ===
      preflight.endpoints.filter(item => item.status ===
        'RECIPIENT_ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED').length &&
    preflight.summary.independentlyResolvedEndpointCount === 0 &&
    preflight.summary.authenticatedRecipientCount === 0 &&
    preflight.summary.contactAuthorizedCount === 0 &&
    preflight.summary.transmittedRequestCount === 0 &&
    preflight.summary.receiverReceiptCount === 0 &&
    preflight.summary.independentlyVerifiedResolverProviderCount === 0 &&
    preflight.summary.admissionReady === false &&
    exactKeys(preflight.prohibitedConclusions,
      ['letCandidateResolverResolveOwnVerificationRecipient',
        'treatDeclaredAlternateResolverAsIndependent',
        'treatDeclaredLocatorAsResolvedEndpoint',
        'treatClaimedRecipientAsAuthenticated',
        'contactEndpointOrHumanWithoutAuthority',
        'claimTransportWithoutMatchedReceipts',
        'treatRecipientPreflightAsResolverProviderVerification',
        'admitEvidenceOwnerOrDebit', 'persistMutatePromoteOrCanonize']) &&
    Object.values(preflight.prohibitedConclusions).every(value =>
      value === true) &&
    exact(preflight.truth, {
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
    }) && [EMPTY_STATUS, NO_DECLARATIONS_STATUS,
      ASSESSED_STATUS].includes(preflight.status) &&
    (preflight.status === EMPTY_STATUS
      ? preflight.endpoints.length === 0 &&
        preflight.assessments.length === 0
      : preflight.status === NO_DECLARATIONS_STATUS
        ? preflight.endpoints.length === 1 &&
          preflight.assessments.length === 0
        : preflight.endpoints.length === 1 &&
          preflight.assessments.length > 0) &&
    new TextEncoder().encode(JSON.stringify(preflight)).length <=
      MAXIMUM_SERIALIZED_PREFLIGHT_BYTES;
}

export function
landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflightValid(
  preflight, contract = null, source = null, declarations = null) {
  if (!preflightShapeValid(preflight)) return false;
  if (contract === null && source === null && declarations === null) return true;
  return contract !== null && source !== null && declarations !== null &&
    sourceValid(source, contract) && declarationsInputValid(declarations) &&
    exact(preflight, expectedPreflight(contract, source, declarations));
}

export function
createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflight(
  contract, source, declarations = []) {
  if (!sourceValid(source, contract) ||
      !declarationsInputValid(declarations)) {
    throw new Error(
      'Verification-recipient resolution preflight needs the exact R129 contract, R128 request batch and source, plus a bounded declaration array');
  }
  const preflight = expectedPreflight(contract, source, declarations);
  if (new TextEncoder().encode(JSON.stringify(preflight)).length >
      MAXIMUM_SERIALIZED_PREFLIGHT_BYTES) {
    throw new Error(
      'Verification-recipient resolution preflight exceeds its resource ceiling');
  }
  return preflight;
}

export function
matrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflightDescription() {
  return {
    status: 'EXPERIMENTAL',
    capabilityId:
      HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_RESOLUTION_PREFLIGHT_EVALUATE_CAPABILITY_ID,
    statement:
      'R129 evaluates bounded caller-supplied verification-recipient endpoint declarations against exact R128 requests and fails closed against direct candidate self-resolution or declared circular resolver dependencies.',
    boundaries: [
      'The current real R128 request batch is empty, so the current verification-recipient preflight is empty.',
      'A distinct alternate resolver ID is only a caller-supplied claim: alternate-resolver independence, implementation, availability, endpoint ownership, recipient identity, and contact authority all remain unverified.',
      'No DNS or service discovery, endpoint or human contact, provider selection, resolver execution, transport, persistence, evidence admission, owner/debit mutation, promotion, canonization, or world mutation is performed.'
    ]
  };
}
