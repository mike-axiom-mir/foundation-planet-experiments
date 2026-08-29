import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionPreflightContractReceiptValid,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionWitnessValid,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapClosurePreflightValid
} from './matrix-thermal-endpoint-resolver-provider-verification-recipient-trust-bootstrap-recursion-preflight.mjs?v=0.130.0-r130.1';

export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATION_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-capability-specification-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_INPUT_BINDING_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-capability-input-binding/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_RESULT_ENVELOPE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-result-envelope/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATION_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-capability-specification/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-capability-specification-bundle/v1';

export const
  VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATION_CREATE_CAPABILITY_ID =
    'contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.verifier-route.trust-anchor-and-transport-specification.create';
export const VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID =
  'authority.foundation-planet.external-provider-verification.verifier-route.trust-anchor.resolve';
export const VERIFICATION_REQUEST_SEND_RECEIVE_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.request.send-receive';

const CONTRACT_STATUS =
  'VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATION_AVAILABLE';
const EMPTY_BUNDLE_STATUS =
  'VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATIONS_AVAILABLE_WITH_NO_CURRENT_ROUTE_BINDINGS';
const BOUND_BUNDLE_STATUS =
  'VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATIONS_AVAILABLE_WITH_BOUND_ROUTE_REQUIREMENTS';
const MAXIMUM_SPECIFICATIONS = 2;
const MAXIMUM_ROUTES = 1;
const INPUT_BINDINGS_PER_ROUTE = 2;
const MAXIMUM_INPUT_BINDINGS = 2;
const MAXIMUM_EXTERNAL_RUNTIME_MS = 120000;
const MAXIMUM_RESULT_ENVELOPE_BYTES = 262144;
const MAXIMUM_SERIALIZED_BUNDLE_BYTES = 524288;
const AUTHORITY_EVIDENCE_IDS = [
  'out-of-band-trust-anchor-authority-designation-receipt',
  'exact-verifier-route-binding-receipt',
  'trust-anchor-provenance-and-revocation-receipt',
  'allowed-and-denied-anchor-identity-probe-receipts',
  'endpoint-ownership-and-verifier-identity-receipts'
];
const TRANSPORT_EVIDENCE_IDS = [
  'per-request-contact-authority-and-matched-transport-receipts'
];
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
  return exactKeys(boundary, ['r130Contract', 'r130Witness', 'r130Preflight',
    'r130Boundary']) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionPreflightContractReceiptValid(
      boundary.r130Contract, boundary.r130Boundary) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionWitnessValid(
      boundary.r130Witness, boundary.r130Contract, boundary.r130Boundary) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapClosurePreflightValid(
      boundary.r130Preflight, boundary.r130Contract, boundary.r130Witness,
      boundary.r130Boundary);
}

function expectedContract(boundary) {
  const routeCount = boundary.r130Witness.routes.length;
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATION_CONTRACT_RECEIPT_SCHEMA,
    status: CONTRACT_STATUS,
    sourceR130: {
      contract: sourceRef(boundary.r130Contract),
      witness: sourceRef(boundary.r130Witness),
      preflight: sourceRef(boundary.r130Preflight)
    },
    projection: {
      sourceCompatibleRouteCount: routeCount,
      sourceRequiredExternalEvidenceCount:
        boundary.r130Preflight.requiredExternalEvidence.length,
      capabilitySpecificationCount: MAXIMUM_SPECIFICATIONS,
      inputBindingCount: routeCount * INPUT_BINDINGS_PER_ROUTE,
      currentInventoryMayBeEmpty: true
    },
    schemas: {
      inputBinding:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_INPUT_BINDING_SCHEMA,
      resultEnvelope:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_RESULT_ENVELOPE_SCHEMA,
      capabilitySpecification:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATION_SCHEMA,
      bundle:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA
    },
    capabilities: {
      builderCapabilityId:
        VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATION_CREATE_CAPABILITY_ID,
      specifiedMissingCapabilityIds: [
        VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
        VERIFICATION_REQUEST_SEND_RECEIVE_CAPABILITY_ID
      ]
    },
    resourceBudget: {
      maximumSpecifications: MAXIMUM_SPECIFICATIONS,
      maximumRoutes: MAXIMUM_ROUTES,
      inputBindingsPerRoute: INPUT_BINDINGS_PER_ROUTE,
      maximumInputBindings: MAXIMUM_INPUT_BINDINGS,
      maximumExternalRuntimeMs: MAXIMUM_EXTERNAL_RUNTIME_MS,
      maximumResultEnvelopeBytes: MAXIMUM_RESULT_ENVELOPE_BYTES,
      maximumSerializedBundleBytes: MAXIMUM_SERIALIZED_BUNDLE_BYTES
    },
    truth: {
      exactR130BoundaryBound: true,
      providerNeutralSpecificationsAvailable: true,
      nativeProviderReceiptSchemasDeclared: false,
      authorityTrustAnchorResolved: false,
      transportProviderSelected: false,
      endpointResolved: false,
      recipientAuthenticated: false,
      requestTransported: false,
      resolverProviderVerified: false,
      evidenceAdmitted: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  });
}

export function
createLandMatrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecificationContractReceipt(
  boundary) {
  if (!boundaryValid(boundary)) {
    throw new Error('R131 capability specifications need the exact R130 boundary');
  }
  return expectedContract(boundary);
}

export function
landMatrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecificationContractReceiptValid(
  receipt, boundary) {
  if (!boundaryValid(boundary)) return false;
  return exact(receipt, expectedContract(boundary));
}

function expectedSourceRoute(route) {
  return {
    routeId: route.routeId,
    requestId: route.requestId,
    requestPacketDigest: route.requestPacketDigest,
    routeProjectionDigest: stableDigest(route),
    sourceDeclarationDigest: route.sourceDeclarationDigest,
    candidateResolverProviderId: route.candidateResolverProviderId,
    claimedVerificationRecipientId: route.claimedVerificationRecipientId,
    alternateResolverProviderId: route.alternateResolverProviderId,
    claimedLocatorKind: route.claimedLocatorKind,
    claimedLocatorValue: route.claimedLocatorValue
  };
}

function expectedInputBinding(contract, boundary, route, capabilityId,
  ordinal) {
  const authority = capabilityId ===
    VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID;
  const requiredEvidenceIds = authority
    ? AUTHORITY_EVIDENCE_IDS : TRANSPORT_EVIDENCE_IDS;
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_INPUT_BINDING_SCHEMA,
    ordinal,
    bindingId: `r131:${route.routeId}:${authority ? 'authority' : 'transport'}`,
    capabilityId,
    gapType: authority ? 'AUTHORITY' : 'HAND',
    sourceContract: sourceRef(contract),
    sourceR130: {
      contract: sourceRef(boundary.r130Contract),
      witness: sourceRef(boundary.r130Witness),
      preflight: sourceRef(boundary.r130Preflight)
    },
    sourceRoute: expectedSourceRoute(route),
    requiredEvidenceIds,
    prerequisiteCapabilityIds: authority ? [] : [
      VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID
    ],
    permissionBoundary: authority
      ? 'ONLY_MIKE_TOBI_OR_AN_AUTHENTICATED_HOST_GOVERNANCE_SEAT_MAY_DESIGNATE_THE_EXACT_OUT_OF_BAND_TRUST_ANCHOR'
      : 'EXACT_PER_REQUEST_AUTHORITY_AND_CONSENT_PLUS_A_VERIFIED_RECIPIENT_ROUTE_REQUIRED_BEFORE_CONTACT',
    truth: {
      bindingIsSpecificationInputOnly: true,
      providerSelected: false,
      providerInstalled: false,
      providerAvailable: false,
      providerExecuted: false,
      authorityEstablished: false,
      endpointResolved: false,
      recipientAuthenticated: false,
      contactAuthorized: false,
      requestTransported: false,
      persistencePerformed: false
    }
  });
}

function expectedInputBindings(contract, boundary) {
  return boundary.r130Witness.routes.flatMap((route, routeIndex) => [
    expectedInputBinding(contract, boundary, route,
      VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
      routeIndex * INPUT_BINDINGS_PER_ROUTE + 1),
    expectedInputBinding(contract, boundary, route,
      VERIFICATION_REQUEST_SEND_RECEIVE_CAPABILITY_ID,
      routeIndex * INPUT_BINDINGS_PER_ROUTE + 2)
  ]);
}

function expectedAuthoritySpecification(contract, boundary, inputBindings) {
  const bindings = inputBindings.filter(item => item.capabilityId ===
    VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID);
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATION_SCHEMA,
    ordinal: 1,
    capabilityId: VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
    gapType: 'AUTHORITY',
    providerClass: 'OUT_OF_BAND_VERIFIER_ROUTE_TRUST_ANCHOR_AUTHORITY_PROVIDER',
    purpose:
      'Resolve the exact verifier route against an independently governed trust anchor that is not controlled by the candidate or alternate resolver provider.',
    coverage: {
      sourceCompatibleRouteCount: boundary.r130Witness.routes.length,
      inputBindingCount: bindings.length,
      inputBindingDigests: bindings.map(item => item.digest),
      currentInventoryMayBeEmpty: true
    },
    inputContract: {
      sourceR130ContractSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
      sourceR130WitnessSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA,
      sourceR130PreflightSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA,
      inputBindingSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_INPUT_BINDING_SCHEMA,
      exactRouteRequestDeclarationLocatorAndVerifierDigestsRequired: true,
      candidateAndAlternateResolverControlProhibited: true
    },
    outputContract: {
      resultEnvelopeSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_RESULT_ENVELOPE_SCHEMA,
      nativeAuthorityReceiptSchema: null,
      nativeAuthorityReceiptSchemaStatus:
        'NOT_DECLARED_UNTIL_PROVIDER_BINDING_AND_INDEPENDENT_REVIEW',
      requiredResultStatusCodes: [
        'CLAIMED_ANCHORED', 'CLAIMED_REJECTED', 'CLAIMED_UNKNOWN'
      ],
      requiredEvidenceIds: AUTHORITY_EVIDENCE_IDS,
      receiptTrustOnArrival: 'UNTRUSTED_PENDING_INDEPENDENT_VERIFICATION'
    },
    sideEffects: {
      specificationWritesFoundation: false,
      specificationContactsEndpointOrHuman: false,
      specificationInstallsOrExecutesProvider: false,
      providerMayPersistFoundationState: false,
      providerMayPromoteOrCanonize: false
    },
    permissionsAndConsent: {
      requiredAuthoritySeat:
        'MIKE_TOBI_OR_AUTHENTICATED_HOST_GOVERNANCE_SEAT',
      candidateResolverMayDesignateAnchor: false,
      alternateResolverMayDesignateAnchor: false,
      providerSelfAttestationSufficient: false,
      allowedAndDeniedIdentityProbesRequired: true,
      revocationCheckRequired: true
    },
    resourceBudget: {
      maximumRouteBindings: MAXIMUM_ROUTES,
      maximumExternalRuntimeMs: MAXIMUM_EXTERNAL_RUNTIME_MS,
      maximumResultEnvelopeBytes: MAXIMUM_RESULT_ENVELOPE_BYTES,
      maximumAllowedIdentityProbesPerRoute: 1,
      maximumDeniedIdentityProbesPerRoute: 1,
      automaticRetryCount: 0
    },
    failureAndRecovery: {
      failClosed: true,
      partialEvidenceMayEstablishAuthority: false,
      missingRevocationStateIsFailure: true,
      retryRequiresNewExplicitAuthority: true,
      noFoundationMutationOnFailure: true
    },
    compatibility: {
      capabilityIdMustMatchExactly: true,
      resultEnvelopeSchemaVersion: 1,
      exactR130SourceDigestsRequired: true,
      transportCapabilityId:
        VERIFICATION_REQUEST_SEND_RECEIVE_CAPABILITY_ID
    },
    verificationContract: {
      independentAuthorityVerifierRequired: true,
      exactRouteBindingReplayRequired: true,
      anchorProvenanceAndRevocationVerified: true,
      allowedAndDeniedIdentityProbeReceiptsRequired: true,
      endpointOwnershipAndVerifierIdentityReceiptsRequired: true,
      candidateAndAlternateResolverNonControlMustBeProven: true
    },
    promotionGate: {
      authority: 'MIKE_TOBI_AXM',
      providerMaySelfSelectInstallExecutePromoteOrCanonize: false,
      passingValidationIsNotPromotion: true
    },
    lifecycle: {
      status: 'SPECIFIED_NOT_IMPLEMENTED',
      providerSelected: false,
      installed: false,
      available: false,
      executed: false,
      promoted: false,
      canon: false
    }
  });
}

function expectedTransportSpecification(contract, boundary, inputBindings) {
  const bindings = inputBindings.filter(item => item.capabilityId ===
    VERIFICATION_REQUEST_SEND_RECEIVE_CAPABILITY_ID);
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATION_SCHEMA,
    ordinal: 2,
    capabilityId: VERIFICATION_REQUEST_SEND_RECEIVE_CAPABILITY_ID,
    gapType: 'HAND',
    providerClass: 'RECEIPTED_EXTERNAL_PROVIDER_VERIFICATION_TRANSPORT',
    purpose:
      'Send one exact authorized provider-verification request to the independently verified recipient and return matched sender and receiver receipts.',
    coverage: {
      sourceCompatibleRouteCount: boundary.r130Witness.routes.length,
      inputBindingCount: bindings.length,
      inputBindingDigests: bindings.map(item => item.digest),
      currentInventoryMayBeEmpty: true
    },
    inputContract: {
      sourceR130ContractSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
      sourceR130WitnessSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA,
      sourceR130PreflightSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA,
      inputBindingSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_INPUT_BINDING_SCHEMA,
      exactRequestPacketAndRouteDigestsRequired: true,
      authorityTrustAnchorResultRequiredBeforeContact: true
    },
    outputContract: {
      resultEnvelopeSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_RESULT_ENVELOPE_SCHEMA,
      nativeSenderReceiptSchema: null,
      nativeReceiverReceiptSchema: null,
      nativeReceiptSchemaStatus:
        'NOT_DECLARED_UNTIL_PROVIDER_BINDING_AND_INDEPENDENT_REVIEW',
      requiredResultStatusCodes: [
        'CLAIMED_DELIVERED', 'CLAIMED_REJECTED', 'CLAIMED_UNKNOWN'
      ],
      requiredEvidenceIds: TRANSPORT_EVIDENCE_IDS,
      receiptTrustOnArrival: 'UNTRUSTED_PENDING_MATCH_AND_VERIFICATION'
    },
    sideEffects: {
      specificationWritesFoundation: false,
      specificationContactsEndpointOrHuman: false,
      specificationInstallsOrExecutesProvider: false,
      providerMayPersistFoundationState: false,
      providerMayPromoteOrCanonize: false
    },
    permissionsAndConsent: {
      requiredAuthoritySeat:
        'MIKE_TOBI_OR_AUTHENTICATED_HOST_GOVERNANCE_SEAT',
      exactPerRequestContactAuthorityRequired: true,
      exactRecipientConsentOrHostAuthorizationRequired: true,
      authorityTrustAnchorResultRequired: true,
      providerMayInferConsent: false,
      automaticRetryAllowed: false
    },
    resourceBudget: {
      maximumRouteBindings: MAXIMUM_ROUTES,
      maximumExternalRuntimeMs: MAXIMUM_EXTERNAL_RUNTIME_MS,
      maximumResultEnvelopeBytes: MAXIMUM_RESULT_ENVELOPE_BYTES,
      maximumSendAttemptsPerExactAuthorityReceipt: 1,
      maximumReceiverAcknowledgementsPerAttempt: 1,
      automaticRetryCount: 0
    },
    failureAndRecovery: {
      failClosed: true,
      senderReceiptAloneMayProveDelivery: false,
      receiverReceiptAloneMayProveExactPayload: false,
      partialOrMismatchedReceiptMayVerifyProvider: false,
      retryRequiresNewExplicitAuthority: true,
      noFoundationMutationOnFailure: true
    },
    compatibility: {
      capabilityIdMustMatchExactly: true,
      resultEnvelopeSchemaVersion: 1,
      exactR130SourceDigestsRequired: true,
      prerequisiteAuthorityCapabilityId:
        VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID
    },
    verificationContract: {
      matchedTransactionIdRequired: true,
      matchedRequestIdAndPayloadDigestRequired: true,
      matchedRecipientIdentityRequired: true,
      senderAndReceiverAuthorityVerifiedIndependently: true,
      receiptTimeWindowAndReplayChecked: true,
      deliveryDoesNotProveReceiverAppliedOrAcceptedRequest: true
    },
    promotionGate: {
      authority: 'MIKE_TOBI_AXM',
      providerMaySelfSelectInstallExecutePromoteOrCanonize: false,
      passingValidationIsNotPromotion: true
    },
    lifecycle: {
      status: 'SPECIFIED_NOT_IMPLEMENTED',
      providerSelected: false,
      installed: false,
      available: false,
      executed: false,
      promoted: false,
      canon: false
    }
  });
}

function expectedBundle(contract, boundary) {
  const inputBindings = expectedInputBindings(contract, boundary);
  const specifications = [
    expectedAuthoritySpecification(contract, boundary, inputBindings),
    expectedTransportSpecification(contract, boundary, inputBindings)
  ];
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA,
    status: inputBindings.length === 0
      ? EMPTY_BUNDLE_STATUS : BOUND_BUNDLE_STATUS,
    sourceContract: sourceRef(contract),
    sourceR130: {
      contract: sourceRef(boundary.r130Contract),
      witness: sourceRef(boundary.r130Witness),
      preflight: sourceRef(boundary.r130Preflight)
    },
    specifications,
    inputBindings,
    summary: {
      capabilitySpecificationCount: specifications.length,
      authoritySpecificationCount: 1,
      transportSpecificationCount: 1,
      sourceCompatibleRouteCount: boundary.r130Witness.routes.length,
      inputBindingCount: inputBindings.length,
      nativeProviderReceiptSchemaCount: 0,
      selectedProviderCount: 0,
      installedProviderCount: 0,
      availableProviderCount: 0,
      executedProviderCount: 0,
      authorityResolvedCount: 0,
      transportedRequestCount: 0
    },
    truth: {
      exactR130BoundaryBound: true,
      bothMissingCapabilitiesSpecified: true,
      specificationsAreImplementations: false,
      nativeProviderReceiptSchemasDeclared: false,
      providersSelected: false,
      providersInstalled: false,
      providersAvailable: false,
      providersExecuted: false,
      authorityTrustAnchorResolved: false,
      endpointResolved: false,
      recipientAuthenticated: false,
      requestTransported: false,
      resolverProviderVerified: false,
      evidenceAdmitted: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      persistencePerformed: false,
      worldMutationPerformed: false,
      promoted: false,
      canon: false
    }
  });
}

export function
createLandMatrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecificationBundle(
  contract, boundary) {
  if (!landMatrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecificationContractReceiptValid(
      contract, boundary)) {
    throw new Error('R131 bundle needs the exact R131 contract and R130 boundary');
  }
  const bundle = expectedBundle(contract, boundary);
  if (new TextEncoder().encode(JSON.stringify(bundle)).length >
      MAXIMUM_SERIALIZED_BUNDLE_BYTES) {
    throw new Error('R131 capability specification bundle exceeds its resource ceiling');
  }
  return bundle;
}

export function
landMatrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecificationBundleValid(
  bundle, contract, boundary) {
  if (!landMatrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecificationContractReceiptValid(
      contract, boundary)) return false;
  return new TextEncoder().encode(JSON.stringify(bundle)).length <=
      MAXIMUM_SERIALIZED_BUNDLE_BYTES &&
    exact(bundle, expectedBundle(contract, boundary));
}

export function
matrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecificationDescription() {
  return {
    status: 'EXPERIMENTAL',
    capabilityId:
      VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATION_CREATE_CAPABILITY_ID,
    specifiedMissingCapabilityIds: [
      VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
      VERIFICATION_REQUEST_SEND_RECEIVE_CAPABILITY_ID
    ],
    statement:
      'R131 exact-binds the R130 trust-bootstrap boundary and emits provider-neutral authority and matched-transport capability specifications without supplying either capability.',
    boundaries: [
      'The current real R130 route inventory is empty, so the two specifications are available with zero current input bindings.',
      'Native authority, sender, and receiver receipt schemas remain undeclared until a provider declaration is independently reviewed.',
      'No provider is selected, installed, available, or executed; no authority, endpoint, recipient, contact, transport, verification, evidence admission, persistence, owner/debit closure, promotion, canonization, or world mutation is produced.'
    ]
  };
}
