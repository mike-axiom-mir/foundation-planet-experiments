import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_PACKET_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLUTION_VERIFICATION_REQUEST_BATCH_SCHEMA,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionVerificationRequestContractReceiptValid,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolutionVerificationRequestBatchValid
} from './matrix-thermal-provider-endpoint-resolution-verification-request.mjs?v=0.125.0-r125.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_INPUT_BINDING_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_RESULT_ENVELOPE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA,
  HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_CREATE_CAPABILITY_ID
} from './matrix-thermal-endpoint-resolver-capability-specification.mjs?v=0.126.0-r126.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_AUDIT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-capability-specification-audit/v1';

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

const sourceRef = value => ({ schema: value.schema, receiptDigest: value.digest });

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

function expectedSpecification(custody, inputBindings) {
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
      sourceRequestPacketCount: custody.r125Batch.packets.length,
      sourceRequestIds: custody.r125Batch.packets.map(packet =>
        packet.requestId),
      sourceRequestPacketDigests: custody.r125Batch.packets.map(packet =>
        packet.digest),
      inputBindingDigests: inputBindings.map(binding => binding.digest),
      currentInventoryMayBeEmpty: true
    },
    inputContract: {
      sourceContract: sourceRef(custody.r125Contract),
      sourceBatch: sourceRef(custody.r125Batch),
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

function expectedBundle(contract, custody) {
  const inputBindings = custody.r125Batch.packets.map(expectedInputBinding);
  const specification = expectedSpecification(custody, inputBindings);
  const bundle = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA,
    status: inputBindings.length === 0 ? EMPTY_BUNDLE_STATUS : BUNDLE_STATUS,
    sourceContract: sourceRef(contract),
    sourceR125: {
      contract: sourceRef(custody.r125Contract),
      batch: sourceRef(custody.r125Batch)
    },
    specification,
    inputBindings,
    summary: {
      sourceRequestPacketCount: custody.r125Batch.packets.length,
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

export function
auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverCapabilitySpecification(
  contract, bundle, custody) {
  const exactCustody = custodyValid(custody);
  const expectedContractValue = exactCustody ? expectedContract(custody) : null;
  const contractExact = expectedContractValue !== null &&
    exact(contract, expectedContractValue);
  const expectedBundleValue = contractExact
    ? expectedBundle(expectedContractValue, custody) : null;
  const bundleExact = expectedBundleValue !== null &&
    new TextEncoder().encode(JSON.stringify(expectedBundleValue)).length <=
      MAXIMUM_SERIALIZED_BUNDLE_BYTES &&
    exact(bundle, expectedBundleValue);
  const checks = {
    exactR125CustodyValid: exactCustody,
    contractIndependentlyReconstructed: contractExact,
    allR125RequestBindingsIndependentlyReconstructed: bundleExact &&
      bundle.inputBindings.length === custody.r125Batch.packets.length,
    fullHandContractIndependentlyReconstructed: bundleExact &&
      ['inputContract', 'outputContract', 'sideEffects',
        'permissionsAndConsent', 'resourceBudget', 'failureAndRecovery',
        'compatibility', 'verificationContract', 'promotionGate']
        .every(key => Object.hasOwn(bundle.specification, key)),
    fourPreTransportProofsAndDeferredChallengePreserved: bundleExact &&
      exact(bundle.specification.outputContract
        .requiredPreTransportProofIds, preTransportProofIds()) &&
      bundle.specification.outputContract.deferredTransportProofId ===
        'BOUNDED_LIVE_CHALLENGE_MATCHED_RECEIPTS',
    nativeResolverReceiptSchemaRemainsUndeclared: bundleExact &&
      bundle.specification.outputContract.nativeReceiptSchema === null &&
      bundle.summary.nativeResolverReceiptSchemaDeclaredCount === 0,
    noResolverInstallationAvailabilityOrExecutionClaimed: bundleExact &&
      bundle.specification.lifecycle.resolverInstalled === false &&
      bundle.specification.lifecycle.resolverAvailable === false &&
      bundle.truth.resolverCapabilityImplemented === false &&
      bundle.summary.resolvedEndpointCount === 0,
    noContactChallengeTransportOrReceiverReceiptClaimed: bundleExact &&
      bundle.summary.authorizedContactCount === 0 &&
      bundle.truth.challengeMaterialIssued === false &&
      bundle.summary.transmittedRequestCount === 0 &&
      bundle.summary.receiverReceiptCount === 0,
    providerReadinessAdmissionAndWorldMutationRemainZero: bundleExact &&
      bundle.summary.operationallyReadyProviderCount === 0 &&
      bundle.summary.admissionReady === false &&
      bundle.truth.persistencePerformed === false &&
      bundle.truth.worldMutationPerformed === false,
    prohibitedImplementationClaimsFailClosed: bundleExact &&
      Object.values(bundle.prohibitedImplementationClaims).every(value =>
        value === true),
    bundleIndependentlyReconstructed: bundleExact
  };
  const pass = Object.values(checks).every(value => value === true);
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_AUDIT_SCHEMA,
    status: pass ? 'PASS' : 'FAIL',
    checks,
    detail: {
      sourceRequestPacketCount: bundleExact
        ? bundle.summary.sourceRequestPacketCount : 0,
      inputBindingCount: bundleExact
        ? bundle.summary.inputBindingCount : 0,
      capabilitySpecificationCount: bundleExact
        ? bundle.summary.capabilitySpecificationCount : 0,
      requiredPreTransportProofCountPerRequest: bundleExact
        ? bundle.summary.requiredPreTransportProofCountPerRequest : 0,
      deferredTransportProofCountPerRequest: bundleExact
        ? bundle.summary.deferredTransportProofCountPerRequest : 0,
      nativeResolverReceiptSchemaDeclaredCount: 0,
      resolverInstalledCount: 0,
      resolverAvailableCount: 0,
      resolvedEndpointCount: 0,
      authorizedContactCount: 0,
      transmittedRequestCount: 0,
      receiverReceiptCount: 0,
      operationallyReadyProviderCount: 0
    },
    truth: {
      auditReconstructedR126WithoutCallingR126BuildersOrValidators: true,
      auditMayImplementInstallOrExecuteResolver: false,
      auditMayInventNativeResolverReceiptSchema: false,
      auditMayResolveEndpointOrAuthenticateRecipient: false,
      auditMayAuthorizeOrPerformContact: false,
      auditMayIssueChallengeOrClaimTransport: false,
      auditMayAuthenticateProviderEvidenceOwnerOrDebit: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  };
}
