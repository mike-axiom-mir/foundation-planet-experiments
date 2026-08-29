import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_PACKET_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_BATCH_SCHEMA,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionVerificationRequestContractReceiptValid,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionVerificationRequestBatchValid
} from './matrix-thermal-provider-endpoint-resolution-verification-request.mjs?v=0.125.0-r125.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-capability-specification-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_INPUT_BINDING_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-input-binding/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_RESULT_ENVELOPE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-result-envelope/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-capability-specification/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-capability-specification-bundle/v1';

export const
  HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_CREATE_CAPABILITY_ID =
    'contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.endpoint-resolution.resolver-specification.create';

const RESOLVER_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.endpoint.resolve';
const NEXT_TRANSPORT_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.request.send-receive';
const CONTRACT_STATUS =
  'ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_CONTRACT_AVAILABLE';
const EMPTY_BUNDLE_STATUS =
  'ENDPOINT_RESOLVER_CAPABILITY_SPECIFIED_NO_CURRENT_REQUESTS';
const BUNDLE_STATUS =
  'ENDPOINT_RESOLVER_CAPABILITY_SPECIFIED_FOR_REQUESTS_NOT_IMPLEMENTED';
const MAXIMUM_REQUEST_BINDINGS = 15;
const MAXIMUM_RUNTIME_MS = 300000;
const MAXIMUM_RESULT_BYTES = 524288;
const MAXIMUM_SERIALIZED_BUNDLE_BYTES = 524288;
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
  const valid = exactKeys(source, ['r125Contract', 'r125Batch',
    'r125RequestSource', 'r125Options']) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionVerificationRequestContractReceiptValid(
      source.r125Contract) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionVerificationRequestBatchValid(
      source.r125Batch, source.r125Contract, source.r125RequestSource,
      source.r125Options);
  return valid && (contract === null ||
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverCapabilitySpecificationContractReceiptValid(
      contract) && exact(contract.sourceR125, {
      contract: sourceRef(source.r125Contract),
      batch: sourceRef(source.r125Batch)
    }) && contract.projection.sourceRequestPacketCount ===
      source.r125Batch.packets.length);
}

function custodyValid(custody) {
  return exactKeys(custody, ['r125Contract', 'r125Batch',
    'r125RequestSource', 'r125Options', 'r125Custody']) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionVerificationRequestContractReceiptValid(
      custody.r125Contract, custody.r125Custody) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionVerificationRequestBatchValid(
      custody.r125Batch, custody.r125Contract, custody.r125RequestSource,
      custody.r125Options);
}

const preTransportProofIds = () => [
  'INDEPENDENT_RESOLVER_IDENTITY_AND_AUTHORITY',
  'ENDPOINT_OWNERSHIP_OR_ROUTE_CUSTODY',
  'RECIPIENT_IDENTITY_BINDING',
  'CONTACT_AUTHORIZATION_OR_CONSENT'
];

const preTransportProofSurfaces = () => [
  'INDEPENDENT_RESOLVER_IDENTITY_AND_AUTHORITY_RECEIPT',
  'INDEPENDENT_ENDPOINT_OWNERSHIP_OR_ROUTE_CUSTODY_RECEIPT',
  'INDEPENDENT_RECIPIENT_IDENTITY_BINDING_RECEIPT',
  'EXACT_REQUIRED_SEAT_CONTACT_AUTHORIZATION_OR_CONSENT_RECEIPT'
];

const expectedContractTruth = () => ({
  exactR125ContractBatchSourceOptionsAndCustodyBound: true,
  executableResolverCapabilityFullySpecified: true,
  specificationMayImplementOrExecuteResolver: false,
  specificationMayResolveEndpointOrRecipient: false,
  specificationMayAuthenticateAuthorityOrConsent: false,
  specificationMayIssueChallengeMaterial: false,
  specificationMayAuthorizeOrPerformContact: false,
  resolverInstalled: false,
  resolverAvailable: false,
  transportPerformed: false,
  providerVerificationPerformed: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  admissionAuthorized: false,
  persistencePerformed: false,
  worldMutationPerformed: false
});

function expectedContract(custody) {
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_CONTRACT_RECEIPT_SCHEMA,
    status: CONTRACT_STATUS,
    sourceR125: {
      contract: sourceRef(custody.r125Contract),
      batch: sourceRef(custody.r125Batch)
    },
    projection: {
      sourceRequestPacketCount: custody.r125Batch.packets.length,
      capabilitySpecificationCount: 1,
      inputBindingSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_INPUT_BINDING_SCHEMA,
      resultEnvelopeSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_RESULT_ENVELOPE_SCHEMA,
      capabilitySpecificationSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_SCHEMA,
      specificationBundleSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA,
      specifiedResolverCapabilityId: RESOLVER_CAPABILITY_ID,
      nextTransportCapabilityId: NEXT_TRANSPORT_CAPABILITY_ID,
      implementedContractCapabilityId:
        HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_CREATE_CAPABILITY_ID
    },
    resourceBudget: {
      maximumRequestBindings: MAXIMUM_REQUEST_BINDINGS,
      maximumExternalRuntimeMs: MAXIMUM_RUNTIME_MS,
      maximumResultEnvelopeBytes: MAXIMUM_RESULT_BYTES,
      maximumSerializedBundleBytes: MAXIMUM_SERIALIZED_BUNDLE_BYTES
    },
    truth: expectedContractTruth()
  };
  receipt.digest = stableDigest(receipt);
  return receipt;
}

export function
landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverCapabilitySpecificationContractReceiptValid(
  receipt, custody = null) {
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'sourceR125', 'projection',
        'resourceBudget', 'truth', 'digest']) ||
      !exactKeys(receipt.sourceR125, ['contract', 'batch']) ||
      !Object.values(receipt.sourceR125).every(ref => exactKeys(ref,
        ['schema', 'receiptDigest'])) ||
      receipt.sourceR125.contract.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA ||
      receipt.sourceR125.batch.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_BATCH_SCHEMA ||
      !exactKeys(receipt.projection, ['sourceRequestPacketCount',
        'capabilitySpecificationCount', 'inputBindingSchema',
        'resultEnvelopeSchema', 'capabilitySpecificationSchema',
        'specificationBundleSchema', 'specifiedResolverCapabilityId',
        'nextTransportCapabilityId', 'implementedContractCapabilityId']) ||
      !Number.isInteger(receipt.projection.sourceRequestPacketCount) ||
      receipt.projection.sourceRequestPacketCount < 0 ||
      receipt.projection.sourceRequestPacketCount > MAXIMUM_REQUEST_BINDINGS ||
      receipt.projection.capabilitySpecificationCount !== 1 ||
      receipt.projection.inputBindingSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_INPUT_BINDING_SCHEMA ||
      receipt.projection.resultEnvelopeSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_RESULT_ENVELOPE_SCHEMA ||
      receipt.projection.capabilitySpecificationSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_SCHEMA ||
      receipt.projection.specificationBundleSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA ||
      receipt.projection.specifiedResolverCapabilityId !==
        RESOLVER_CAPABILITY_ID ||
      receipt.projection.nextTransportCapabilityId !==
        NEXT_TRANSPORT_CAPABILITY_ID ||
      receipt.projection.implementedContractCapabilityId !==
        HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_CREATE_CAPABILITY_ID ||
      !exact(receipt.resourceBudget, {
        maximumRequestBindings: MAXIMUM_REQUEST_BINDINGS,
        maximumExternalRuntimeMs: MAXIMUM_RUNTIME_MS,
        maximumResultEnvelopeBytes: MAXIMUM_RESULT_BYTES,
        maximumSerializedBundleBytes: MAXIMUM_SERIALIZED_BUNDLE_BYTES
      }) || receipt.status !== CONTRACT_STATUS ||
      !exact(receipt.truth, expectedContractTruth())) return false;
  return custody === null || custodyValid(custody) &&
    exact(receipt, expectedContract(custody));
}

export function
createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverCapabilitySpecificationContractReceipt(
  custody) {
  if (!custodyValid(custody)) {
    throw new Error(
      'Endpoint-resolver capability specification needs the exact R125 contract, batch, request source, request options, and full custody');
  }
  return expectedContract(custody);
}

function expectedInputBinding(packet, index) {
  const binding = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_INPUT_BINDING_SCHEMA,
    ordinal: index + 1,
    sourceRequest: {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_PACKET_SCHEMA,
      requestId: packet.requestId,
      requestPacketDigest: packet.digest
    },
    requestBinding: clone(packet.requestBinding),
    claimedRoute: clone(packet.claimedRoute),
    requestWindow: clone(packet.requestWindow),
    requiredAuthoritySeat:
      packet.permissionsAndConsent.requiredAuthoritySeat,
    requiredResolverCapabilityId:
      packet.resolverRecipient.requiredCapabilityId,
    requiredPreTransportProofs: packet.proofRequirements.slice(0, 4).map(
      requirement => ({
        ordinal: requirement.ordinal,
        proofId: requirement.proofId,
        primaryProofSurface: requirement.primaryProofSurface
      })),
    deferredTransportProof: {
      ordinal: packet.proofRequirements[4].ordinal,
      proofId: packet.proofRequirements[4].proofId,
      primaryProofSurface:
        packet.proofRequirements[4].primaryProofSurface,
      requiredTransportCapabilityId: NEXT_TRANSPORT_CAPABILITY_ID
    },
    trustBoundary: {
      routeClaimsRemainCallerSuppliedUnverified: true,
      recipientIdentityRemainsCallerSuppliedUntrusted: true,
      bindingMayAuthorizeContactOrTransport: false
    }
  };
  binding.digest = stableDigest(binding);
  return binding;
}

function expectedSpecification(source, inputBindings) {
  const requestIds = source.r125Batch.packets.map(packet => packet.requestId);
  const specification = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_SCHEMA,
    ordinal: 1,
    capabilityId: RESOLVER_CAPABILITY_ID,
    gapType: 'HAND',
    providerClass: 'INDEPENDENT_ENDPOINT_RESOLVER',
    purpose:
      'Resolve and independently verify resolver authority, endpoint ownership or route custody, recipient identity, and exact contact authorization before any live challenge or request transport.',
    coverage: {
      sourceRequestPacketCount: requestIds.length,
      sourceRequestIds: requestIds,
      sourceRequestPacketDigests: source.r125Batch.packets.map(packet =>
        packet.digest),
      inputBindingDigests: inputBindings.map(binding => binding.digest),
      currentInventoryMayBeEmpty: true
    },
    inputContract: {
      sourceContract: sourceRef(source.r125Contract),
      sourceBatch: sourceRef(source.r125Batch),
      inputBindingSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_INPUT_BINDING_SCHEMA,
      exactRequestAndRouteDigestsRequired: true,
      callerSuppliedRouteClaimsRemainUntrusted: true,
      externalAuthorityContextRequired: true
    },
    outputContract: {
      resultEnvelopeSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_RESULT_ENVELOPE_SCHEMA,
      nativeReceiptSchema: null,
      nativeReceiptSchemaStatus:
        'RESOLVER_IMPLEMENTATION_MUST_DECLARE_BEFORE_EXECUTION',
      requiredResultStatusCodes: [
        'RESOLVED_VERIFIED_READY_FOR_TRANSPORT_CHALLENGE',
        'BLOCKED_MISSING_OR_INVALID_PROOF',
        'REJECTED_SOURCE_OR_AUTHORITY_MISMATCH'
      ],
      requiredPreTransportProofIds: preTransportProofIds(),
      requiredPreTransportProofSurfaces: preTransportProofSurfaces(),
      deferredTransportProofId:
        'BOUNDED_LIVE_CHALLENGE_MATCHED_RECEIPTS',
      receiptTrustOnArrival: 'UNTRUSTED_PENDING_INDEPENDENT_VALIDATION'
    },
    sideEffects: {
      specificationPerformsSideEffects: false,
      foundationPlanetWritesAllowed: false,
      endpointHumanOrHostContactAllowed: false,
      dnsOrSocketExecutionAllowedBySpecification: false,
      independentRegistryReadExpectedFromFutureResolver: true
    },
    permissionsAndConsent: {
      exactRequiredAuthoritySeatMustBeHonoredPerRequest: true,
      selfAttestationSufficient: false,
      callerPolicyMaySelfAuthorizeContact: false,
      resolverMayGrantConsent: false,
      mikeTobiReviewRequiredForMikeTobiOrAxmSeat: true
    },
    resourceBudget: {
      maximumRequestBindings: MAXIMUM_REQUEST_BINDINGS,
      maximumExternalRuntimeMs: MAXIMUM_RUNTIME_MS,
      maximumResultEnvelopeBytes: MAXIMUM_RESULT_BYTES,
      externalRegistryQueryBudgetStatus:
        'RESOLVER_MUST_DECLARE_BOUNDED_BUDGET'
    },
    failureAndRecovery: {
      failClosed: true,
      partialProofMayResolveEndpointOrAuthorizeContact: false,
      retryRequiresSameContractBatchRequestAndBindingDigests: true,
      noFoundationMutationOnFailure: true
    },
    compatibility: {
      sourceR125ContractSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
      sourceR125BatchSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_BATCH_SCHEMA,
      capabilityIdMustMatchExactly: true,
      resultEnvelopeSchemaVersion: 1,
      nextTransportCapabilityId: NEXT_TRANSPORT_CAPABILITY_ID
    },
    verificationContract: {
      primaryProofSurfaces: preTransportProofSurfaces(),
      independentSecondaryAuditRequired: true,
      allowedAndDeniedIdentityProbesRequired: true,
      exactRequestAndBindingDigestReplayRequired: true,
      nativeReceiptSchemaMustBeDeclaredBeforeExecution: true,
      matchedSenderAndReceiverReceiptsDeferredToTransport: true
    },
    promotionGate: {
      mikeTobiDecisionRequired: true,
      resolverMayInstallItself: false,
      resolverMayPromoteItself: false,
      resolverMayCanonizeItself: false
    },
    lifecycle: {
      status: 'SPECIFIED_NOT_IMPLEMENTED',
      resolverInstalled: false,
      resolverAvailable: false,
      promoted: false,
      canon: false
    }
  };
  specification.digest = stableDigest(specification);
  return specification;
}

const expectedBundleTruth = () => ({
  exactR125RequestsBound: true,
  resolverCapabilitySpecified: true,
  resolverCapabilityImplemented: false,
  nativeResolverReceiptSchemaDeclared: false,
  resolverInstalled: false,
  resolverAvailable: false,
  resolverIdentityOrAuthorityVerified: false,
  endpointOwnershipOrRouteCustodyVerified: false,
  recipientIdentityAuthenticated: false,
  contactAuthorizedOrPerformed: false,
  challengeMaterialIssued: false,
  endpointResolved: false,
  transportPerformed: false,
  receiverReceiptObserved: false,
  providerVerificationPerformed: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  admissionAuthorized: false,
  persistencePerformed: false,
  worldMutationPerformed: false
});

function expectedBundle(contract, source) {
  const inputBindings = source.r125Batch.packets.map(expectedInputBinding);
  const specification = expectedSpecification(source, inputBindings);
  const bundle = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA,
    status: inputBindings.length === 0 ? EMPTY_BUNDLE_STATUS : BUNDLE_STATUS,
    sourceContract: sourceRef(contract),
    sourceR125: {
      contract: sourceRef(source.r125Contract),
      batch: sourceRef(source.r125Batch)
    },
    specification,
    inputBindings,
    summary: {
      sourceRequestPacketCount: source.r125Batch.packets.length,
      inputBindingCount: inputBindings.length,
      capabilitySpecificationCount: 1,
      requiredPreTransportProofCountPerRequest: 4,
      deferredTransportProofCountPerRequest: 1,
      nativeResolverReceiptSchemaDeclaredCount: 0,
      resolverInstalledCount: 0,
      resolverAvailableCount: 0,
      resolvedEndpointCount: 0,
      authorizedContactCount: 0,
      transmittedRequestCount: 0,
      receiverReceiptCount: 0,
      operationallyReadyProviderCount: 0,
      admissionReady: false
    },
    prohibitedImplementationClaims: {
      treatSpecificationAsResolverImplementation: true,
      inventNativeResolverReceiptSchema: true,
      trustCallerOrResolverSelfAttestation: true,
      treatPartialProofAsResolutionOrContactAuthority: true,
      contactEndpointHumanOrHost: true,
      issueChallengeOrClaimTransport: true,
      admitEvidenceOwnerOrDebit: true,
      persistMutatePromoteOrCanonize: true
    },
    truth: expectedBundleTruth()
  };
  bundle.digest = stableDigest(bundle);
  return bundle;
}

function inputBindingShapeValid(binding, index, sourcePacket) {
  return digestValid(binding,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_INPUT_BINDING_SCHEMA) &&
    exactKeys(binding, ['schema', 'ordinal', 'sourceRequest',
      'requestBinding', 'claimedRoute', 'requestWindow',
      'requiredAuthoritySeat', 'requiredResolverCapabilityId',
      'requiredPreTransportProofs', 'deferredTransportProof',
      'trustBoundary', 'digest']) && binding.ordinal === index + 1 &&
    exactKeys(binding.sourceRequest, ['schema', 'requestId',
      'requestPacketDigest']) && binding.sourceRequest.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_PACKET_SCHEMA &&
    typeof binding.sourceRequest.requestId === 'string' &&
    typeof binding.sourceRequest.requestPacketDigest === 'string' &&
    exactKeys(binding.deferredTransportProof, ['ordinal', 'proofId',
      'primaryProofSurface', 'requiredTransportCapabilityId']) &&
    binding.deferredTransportProof.ordinal === 5 &&
    binding.deferredTransportProof.proofId ===
      'BOUNDED_LIVE_CHALLENGE_MATCHED_RECEIPTS' &&
    binding.deferredTransportProof.requiredTransportCapabilityId ===
      NEXT_TRANSPORT_CAPABILITY_ID &&
    Array.isArray(binding.requiredPreTransportProofs) &&
    binding.requiredPreTransportProofs.length === 4 &&
    exact(binding.requiredPreTransportProofs.map(item => item.proofId),
      preTransportProofIds()) &&
    binding.requiredPreTransportProofs.every((item, proofIndex) =>
      exactKeys(item, ['ordinal', 'proofId', 'primaryProofSurface']) &&
      item.ordinal === proofIndex + 1 &&
      typeof item.primaryProofSurface === 'string' &&
      item.primaryProofSurface.length > 0) &&
    typeof binding.requiredAuthoritySeat === 'string' &&
    binding.requiredAuthoritySeat.length > 0 &&
    binding.requiredResolverCapabilityId === RESOLVER_CAPABILITY_ID &&
    exact(binding.trustBoundary, {
      routeClaimsRemainCallerSuppliedUnverified: true,
      recipientIdentityRemainsCallerSuppliedUntrusted: true,
      bindingMayAuthorizeContactOrTransport: false
    }) && (sourcePacket === null ||
      exact(binding, expectedInputBinding(sourcePacket, index)));
}

function specificationShapeValid(specification) {
  return digestValid(specification,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_SCHEMA) &&
    exactKeys(specification, ['schema', 'ordinal', 'capabilityId',
      'gapType', 'providerClass', 'purpose', 'coverage', 'inputContract',
      'outputContract', 'sideEffects', 'permissionsAndConsent',
      'resourceBudget', 'failureAndRecovery', 'compatibility',
      'verificationContract', 'promotionGate', 'lifecycle', 'digest']) &&
    specification.ordinal === 1 &&
    specification.capabilityId === RESOLVER_CAPABILITY_ID &&
    specification.gapType === 'HAND' &&
    specification.providerClass === 'INDEPENDENT_ENDPOINT_RESOLVER' &&
    typeof specification.purpose === 'string' &&
    specification.purpose.length > 0 &&
    exactKeys(specification.coverage, ['sourceRequestPacketCount',
      'sourceRequestIds', 'sourceRequestPacketDigests',
      'inputBindingDigests', 'currentInventoryMayBeEmpty']) &&
    Number.isInteger(specification.coverage.sourceRequestPacketCount) &&
    specification.coverage.sourceRequestPacketCount >= 0 &&
    specification.coverage.sourceRequestPacketCount <=
      MAXIMUM_REQUEST_BINDINGS &&
    ['sourceRequestIds', 'sourceRequestPacketDigests',
      'inputBindingDigests'].every(key =>
      Array.isArray(specification.coverage[key]) &&
      specification.coverage[key].length ===
        specification.coverage.sourceRequestPacketCount) &&
    specification.coverage.currentInventoryMayBeEmpty === true &&
    exactKeys(specification.inputContract, ['sourceContract',
      'sourceBatch', 'inputBindingSchema',
      'exactRequestAndRouteDigestsRequired',
      'callerSuppliedRouteClaimsRemainUntrusted',
      'externalAuthorityContextRequired']) &&
    specification.inputContract.inputBindingSchema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_INPUT_BINDING_SCHEMA &&
    specification.inputContract.exactRequestAndRouteDigestsRequired === true &&
    specification.inputContract
      .callerSuppliedRouteClaimsRemainUntrusted === true &&
    specification.inputContract.externalAuthorityContextRequired === true &&
    exactKeys(specification.outputContract, ['resultEnvelopeSchema',
      'nativeReceiptSchema', 'nativeReceiptSchemaStatus',
      'requiredResultStatusCodes', 'requiredPreTransportProofIds',
      'requiredPreTransportProofSurfaces', 'deferredTransportProofId',
      'receiptTrustOnArrival']) &&
    specification.outputContract.resultEnvelopeSchema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_RESULT_ENVELOPE_SCHEMA &&
    specification.outputContract.nativeReceiptSchema === null &&
    specification.outputContract.nativeReceiptSchemaStatus ===
      'RESOLVER_IMPLEMENTATION_MUST_DECLARE_BEFORE_EXECUTION' &&
    exact(specification.outputContract.requiredResultStatusCodes, [
      'RESOLVED_VERIFIED_READY_FOR_TRANSPORT_CHALLENGE',
      'BLOCKED_MISSING_OR_INVALID_PROOF',
      'REJECTED_SOURCE_OR_AUTHORITY_MISMATCH'
    ]) &&
    exact(specification.outputContract.requiredPreTransportProofIds,
      preTransportProofIds()) &&
    exact(specification.outputContract.requiredPreTransportProofSurfaces,
      preTransportProofSurfaces()) &&
    specification.outputContract.deferredTransportProofId ===
      'BOUNDED_LIVE_CHALLENGE_MATCHED_RECEIPTS' &&
    specification.outputContract.receiptTrustOnArrival ===
      'UNTRUSTED_PENDING_INDEPENDENT_VALIDATION' &&
    exact(specification.sideEffects, {
      specificationPerformsSideEffects: false,
      foundationPlanetWritesAllowed: false,
      endpointHumanOrHostContactAllowed: false,
      dnsOrSocketExecutionAllowedBySpecification: false,
      independentRegistryReadExpectedFromFutureResolver: true
    }) && exact(specification.permissionsAndConsent, {
      exactRequiredAuthoritySeatMustBeHonoredPerRequest: true,
      selfAttestationSufficient: false,
      callerPolicyMaySelfAuthorizeContact: false,
      resolverMayGrantConsent: false,
      mikeTobiReviewRequiredForMikeTobiOrAxmSeat: true
    }) && exact(specification.resourceBudget, {
      maximumRequestBindings: MAXIMUM_REQUEST_BINDINGS,
      maximumExternalRuntimeMs: MAXIMUM_RUNTIME_MS,
      maximumResultEnvelopeBytes: MAXIMUM_RESULT_BYTES,
      externalRegistryQueryBudgetStatus:
        'RESOLVER_MUST_DECLARE_BOUNDED_BUDGET'
    }) && exact(specification.failureAndRecovery, {
      failClosed: true,
      partialProofMayResolveEndpointOrAuthorizeContact: false,
      retryRequiresSameContractBatchRequestAndBindingDigests: true,
      noFoundationMutationOnFailure: true
    }) && exactKeys(specification.compatibility,
      ['sourceR125ContractSchema', 'sourceR125BatchSchema',
        'capabilityIdMustMatchExactly', 'resultEnvelopeSchemaVersion',
        'nextTransportCapabilityId']) &&
    specification.compatibility.sourceR125ContractSchema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA &&
    specification.compatibility.sourceR125BatchSchema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_BATCH_SCHEMA &&
    specification.compatibility.capabilityIdMustMatchExactly === true &&
    specification.compatibility.resultEnvelopeSchemaVersion === 1 &&
    specification.compatibility.nextTransportCapabilityId ===
      NEXT_TRANSPORT_CAPABILITY_ID &&
    exact(specification.verificationContract, {
      primaryProofSurfaces: preTransportProofSurfaces(),
      independentSecondaryAuditRequired: true,
      allowedAndDeniedIdentityProbesRequired: true,
      exactRequestAndBindingDigestReplayRequired: true,
      nativeReceiptSchemaMustBeDeclaredBeforeExecution: true,
      matchedSenderAndReceiverReceiptsDeferredToTransport: true
    }) && exact(specification.promotionGate, {
      mikeTobiDecisionRequired: true,
      resolverMayInstallItself: false,
      resolverMayPromoteItself: false,
      resolverMayCanonizeItself: false
    }) && exact(specification.lifecycle, {
      status: 'SPECIFIED_NOT_IMPLEMENTED',
      resolverInstalled: false,
      resolverAvailable: false,
      promoted: false,
      canon: false
    });
}

export function
landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverCapabilitySpecificationBundleValid(
  bundle, contract = null, source = null) {
  const zeroKeys = ['nativeResolverReceiptSchemaDeclaredCount',
    'resolverInstalledCount', 'resolverAvailableCount',
    'resolvedEndpointCount', 'authorizedContactCount',
    'transmittedRequestCount', 'receiverReceiptCount',
    'operationallyReadyProviderCount'];
  if (!digestValid(bundle,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA) ||
      !exactKeys(bundle, ['schema', 'status', 'sourceContract',
        'sourceR125', 'specification', 'inputBindings', 'summary',
        'prohibitedImplementationClaims', 'truth', 'digest']) ||
      !exactKeys(bundle.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(bundle.sourceR125, ['contract', 'batch']) ||
      !Object.values(bundle.sourceR125).every(ref => exactKeys(ref,
        ['schema', 'receiptDigest'])) ||
      !specificationShapeValid(bundle.specification) ||
      !Array.isArray(bundle.inputBindings) ||
      bundle.inputBindings.length > MAXIMUM_REQUEST_BINDINGS ||
      !bundle.inputBindings.every((binding, index) =>
        inputBindingShapeValid(binding, index, null)) ||
      !exactKeys(bundle.summary, ['sourceRequestPacketCount',
        'inputBindingCount', 'capabilitySpecificationCount',
        'requiredPreTransportProofCountPerRequest',
        'deferredTransportProofCountPerRequest', ...zeroKeys,
        'admissionReady']) ||
      !Number.isInteger(bundle.summary.sourceRequestPacketCount) ||
      bundle.summary.sourceRequestPacketCount < 0 ||
      bundle.summary.sourceRequestPacketCount > MAXIMUM_REQUEST_BINDINGS ||
      bundle.summary.inputBindingCount !== bundle.inputBindings.length ||
      bundle.summary.sourceRequestPacketCount !==
        bundle.inputBindings.length ||
      bundle.summary.capabilitySpecificationCount !== 1 ||
      bundle.summary.requiredPreTransportProofCountPerRequest !== 4 ||
      bundle.summary.deferredTransportProofCountPerRequest !== 1 ||
      !zeroKeys.every(key => bundle.summary[key] === 0) ||
      bundle.summary.admissionReady !== false ||
      !exactKeys(bundle.prohibitedImplementationClaims,
        ['treatSpecificationAsResolverImplementation',
          'inventNativeResolverReceiptSchema',
          'trustCallerOrResolverSelfAttestation',
          'treatPartialProofAsResolutionOrContactAuthority',
          'contactEndpointHumanOrHost', 'issueChallengeOrClaimTransport',
          'admitEvidenceOwnerOrDebit', 'persistMutatePromoteOrCanonize']) ||
      !Object.values(bundle.prohibitedImplementationClaims).every(value =>
        value === true) || !exact(bundle.truth, expectedBundleTruth()) ||
      ![EMPTY_BUNDLE_STATUS, BUNDLE_STATUS].includes(bundle.status) ||
      (bundle.status === EMPTY_BUNDLE_STATUS
        ? bundle.inputBindings.length === 0
        : bundle.inputBindings.length > 0) !== true ||
      new TextEncoder().encode(JSON.stringify(bundle)).length >
        MAXIMUM_SERIALIZED_BUNDLE_BYTES) return false;
  if (contract === null && source === null) return true;
  return contract !== null && source !== null && sourceValid(source, contract) &&
    exact(bundle, expectedBundle(contract, source));
}

export function
createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverCapabilitySpecificationBundle(
  contract, source) {
  if (!sourceValid(source, contract)) {
    throw new Error(
      'Endpoint-resolver capability specification bundle needs the exact R126 contract and exact R125 contract, batch, source, and request options');
  }
  const bundle = expectedBundle(contract, source);
  if (new TextEncoder().encode(JSON.stringify(bundle)).length >
      MAXIMUM_SERIALIZED_BUNDLE_BYTES) {
    throw new Error(
      'Endpoint-resolver capability specification bundle exceeds its resource ceiling');
  }
  return bundle;
}

export function
matrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverCapabilitySpecificationDescription() {
  return {
    status: 'EXPERIMENTAL',
    capabilityId:
      HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_CREATE_CAPABILITY_ID,
    specifiedMissingCapabilityId: RESOLVER_CAPABILITY_ID,
    statement:
      'R126 fully specifies the missing endpoint-resolver hand against exact R125 request custody without implementing, installing, executing, or trusting a resolver.',
    boundaries: [
      'The current real R125 batch is empty, so the current input-binding array is empty while the resolver capability specification remains available.',
      'The future resolver must produce four independent pre-transport proofs; the matched live challenge remains delegated to the still-missing send/receive transport capability.',
      'No native resolver receipt schema, resolver identity, endpoint resolution, authorization, contact, transport, provider verification, persistence, admission, promotion, canonization, or world mutation is produced.'
    ]
  };
}
