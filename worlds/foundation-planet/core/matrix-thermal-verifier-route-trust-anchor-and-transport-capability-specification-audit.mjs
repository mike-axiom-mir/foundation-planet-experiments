import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionPreflightContractReceiptValid,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionWitnessValid,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapClosurePreflightValid
} from './matrix-thermal-endpoint-resolver-provider-verification-recipient-trust-bootstrap-recursion-preflight.mjs?v=0.130.0-r130.1';

const CONTRACT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-capability-specification-contract-receipt/v1';
const INPUT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-capability-input-binding/v1';
const RESULT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-result-envelope/v1';
const SPECIFICATION_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-capability-specification/v1';
const BUNDLE_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-capability-specification-bundle/v1';
const AUDIT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-capability-specification-audit/v1';
const BUILDER_CAPABILITY_ID =
  'contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.verifier-route.trust-anchor-and-transport-specification.create';
const AUTHORITY_CAPABILITY_ID =
  'authority.foundation-planet.external-provider-verification.verifier-route.trust-anchor.resolve';
const TRANSPORT_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.request.send-receive';
const CONTRACT_STATUS =
  'VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATION_AVAILABLE';
const EMPTY_STATUS =
  'VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATIONS_AVAILABLE_WITH_NO_CURRENT_ROUTE_BINDINGS';
const BOUND_STATUS =
  'VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATIONS_AVAILABLE_WITH_BOUND_ROUTE_REQUIREMENTS';
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

function digestValid(value, schema) {
  if (value?.schema !== schema || typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
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

function expectedContractUnsigned(boundary) {
  const routeCount = boundary.r130Witness.routes.length;
  return {
    schema: CONTRACT_SCHEMA,
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
      capabilitySpecificationCount: 2,
      inputBindingCount: routeCount * 2,
      currentInventoryMayBeEmpty: true
    },
    schemas: {
      inputBinding: INPUT_SCHEMA,
      resultEnvelope: RESULT_SCHEMA,
      capabilitySpecification: SPECIFICATION_SCHEMA,
      bundle: BUNDLE_SCHEMA
    },
    capabilities: {
      builderCapabilityId: BUILDER_CAPABILITY_ID,
      specifiedMissingCapabilityIds: [
        AUTHORITY_CAPABILITY_ID, TRANSPORT_CAPABILITY_ID
      ]
    },
    resourceBudget: {
      maximumSpecifications: 2,
      maximumRoutes: 1,
      inputBindingsPerRoute: 2,
      maximumInputBindings: 2,
      maximumExternalRuntimeMs: 120000,
      maximumResultEnvelopeBytes: 262144,
      maximumSerializedBundleBytes: 524288
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
  };
}

function contractValid(contract, boundary) {
  if (!boundaryValid(boundary) || !digestValid(contract, CONTRACT_SCHEMA)) {
    return false;
  }
  const unsigned = clone(contract);
  delete unsigned.digest;
  return exact(unsigned, expectedContractUnsigned(boundary));
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

function expectedBindingUnsigned(contract, boundary, route, capabilityId,
  ordinal) {
  const authority = capabilityId === AUTHORITY_CAPABILITY_ID;
  return {
    schema: INPUT_SCHEMA,
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
    requiredEvidenceIds: authority
      ? AUTHORITY_EVIDENCE_IDS : TRANSPORT_EVIDENCE_IDS,
    prerequisiteCapabilityIds: authority ? [] : [AUTHORITY_CAPABILITY_ID],
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
  };
}

function expectedBindings(contract, boundary) {
  return boundary.r130Witness.routes.flatMap((route, index) => [
    expectedBindingUnsigned(contract, boundary, route, AUTHORITY_CAPABILITY_ID,
      index * 2 + 1),
    expectedBindingUnsigned(contract, boundary, route, TRANSPORT_CAPABILITY_ID,
      index * 2 + 2)
  ]);
}

function bindingsValid(bindings, contract, boundary) {
  if (!Array.isArray(bindings) || bindings.length > 2) return false;
  const expected = expectedBindings(contract, boundary);
  return bindings.length === expected.length && bindings.every((binding, index) => {
    if (!digestValid(binding, INPUT_SCHEMA)) return false;
    const unsigned = clone(binding);
    delete unsigned.digest;
    return exact(unsigned, expected[index]);
  });
}

const commonSideEffects = {
  specificationWritesFoundation: false,
  specificationContactsEndpointOrHuman: false,
  specificationInstallsOrExecutesProvider: false,
  providerMayPersistFoundationState: false,
  providerMayPromoteOrCanonize: false
};
const commonPromotionGate = {
  authority: 'MIKE_TOBI_AXM',
  providerMaySelfSelectInstallExecutePromoteOrCanonize: false,
  passingValidationIsNotPromotion: true
};
const commonLifecycle = {
  status: 'SPECIFIED_NOT_IMPLEMENTED',
  providerSelected: false,
  installed: false,
  available: false,
  executed: false,
  promoted: false,
  canon: false
};

function commonSpecificationValid(specification, ordinal, capabilityId,
  gapType, providerClass, purpose, bindings, boundary) {
  const matching = bindings.filter(item => item.capabilityId === capabilityId);
  return digestValid(specification, SPECIFICATION_SCHEMA) &&
    exactKeys(specification, ['schema', 'ordinal', 'capabilityId', 'gapType',
      'providerClass', 'purpose', 'coverage', 'inputContract', 'outputContract',
      'sideEffects', 'permissionsAndConsent', 'resourceBudget',
      'failureAndRecovery', 'compatibility', 'verificationContract',
      'promotionGate', 'lifecycle', 'digest']) &&
    specification.ordinal === ordinal &&
    specification.capabilityId === capabilityId &&
    specification.gapType === gapType &&
    specification.providerClass === providerClass &&
    specification.purpose === purpose &&
    exact(specification.coverage, {
      sourceCompatibleRouteCount: boundary.r130Witness.routes.length,
      inputBindingCount: matching.length,
      inputBindingDigests: matching.map(item => item.digest),
      currentInventoryMayBeEmpty: true
    }) && exact(specification.sideEffects, commonSideEffects) &&
    exact(specification.promotionGate, commonPromotionGate) &&
    exact(specification.lifecycle, commonLifecycle);
}

function authoritySpecificationValid(specification, bindings, boundary) {
  return commonSpecificationValid(specification, 1, AUTHORITY_CAPABILITY_ID,
    'AUTHORITY', 'OUT_OF_BAND_VERIFIER_ROUTE_TRUST_ANCHOR_AUTHORITY_PROVIDER',
    'Resolve the exact verifier route against an independently governed trust anchor that is not controlled by the candidate or alternate resolver provider.',
    bindings, boundary) && exact(specification.inputContract, {
    sourceR130ContractSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
    sourceR130WitnessSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA,
    sourceR130PreflightSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA,
    inputBindingSchema: INPUT_SCHEMA,
    exactRouteRequestDeclarationLocatorAndVerifierDigestsRequired: true,
    candidateAndAlternateResolverControlProhibited: true
  }) && exact(specification.outputContract, {
    resultEnvelopeSchema: RESULT_SCHEMA,
    nativeAuthorityReceiptSchema: null,
    nativeAuthorityReceiptSchemaStatus:
      'NOT_DECLARED_UNTIL_PROVIDER_BINDING_AND_INDEPENDENT_REVIEW',
    requiredResultStatusCodes: [
      'CLAIMED_ANCHORED', 'CLAIMED_REJECTED', 'CLAIMED_UNKNOWN'
    ],
    requiredEvidenceIds: AUTHORITY_EVIDENCE_IDS,
    receiptTrustOnArrival: 'UNTRUSTED_PENDING_INDEPENDENT_VERIFICATION'
  }) && exact(specification.permissionsAndConsent, {
    requiredAuthoritySeat: 'MIKE_TOBI_OR_AUTHENTICATED_HOST_GOVERNANCE_SEAT',
    candidateResolverMayDesignateAnchor: false,
    alternateResolverMayDesignateAnchor: false,
    providerSelfAttestationSufficient: false,
    allowedAndDeniedIdentityProbesRequired: true,
    revocationCheckRequired: true
  }) && exact(specification.resourceBudget, {
    maximumRouteBindings: 1,
    maximumExternalRuntimeMs: 120000,
    maximumResultEnvelopeBytes: 262144,
    maximumAllowedIdentityProbesPerRoute: 1,
    maximumDeniedIdentityProbesPerRoute: 1,
    automaticRetryCount: 0
  }) && exact(specification.failureAndRecovery, {
    failClosed: true,
    partialEvidenceMayEstablishAuthority: false,
    missingRevocationStateIsFailure: true,
    retryRequiresNewExplicitAuthority: true,
    noFoundationMutationOnFailure: true
  }) && exact(specification.compatibility, {
    capabilityIdMustMatchExactly: true,
    resultEnvelopeSchemaVersion: 1,
    exactR130SourceDigestsRequired: true,
    transportCapabilityId: TRANSPORT_CAPABILITY_ID
  }) && exact(specification.verificationContract, {
    independentAuthorityVerifierRequired: true,
    exactRouteBindingReplayRequired: true,
    anchorProvenanceAndRevocationVerified: true,
    allowedAndDeniedIdentityProbeReceiptsRequired: true,
    endpointOwnershipAndVerifierIdentityReceiptsRequired: true,
    candidateAndAlternateResolverNonControlMustBeProven: true
  });
}

function transportSpecificationValid(specification, bindings, boundary) {
  return commonSpecificationValid(specification, 2, TRANSPORT_CAPABILITY_ID,
    'HAND', 'RECEIPTED_EXTERNAL_PROVIDER_VERIFICATION_TRANSPORT',
    'Send one exact authorized provider-verification request to the independently verified recipient and return matched sender and receiver receipts.',
    bindings, boundary) && exact(specification.inputContract, {
    sourceR130ContractSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
    sourceR130WitnessSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA,
    sourceR130PreflightSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA,
    inputBindingSchema: INPUT_SCHEMA,
    exactRequestPacketAndRouteDigestsRequired: true,
    authorityTrustAnchorResultRequiredBeforeContact: true
  }) && exact(specification.outputContract, {
    resultEnvelopeSchema: RESULT_SCHEMA,
    nativeSenderReceiptSchema: null,
    nativeReceiverReceiptSchema: null,
    nativeReceiptSchemaStatus:
      'NOT_DECLARED_UNTIL_PROVIDER_BINDING_AND_INDEPENDENT_REVIEW',
    requiredResultStatusCodes: [
      'CLAIMED_DELIVERED', 'CLAIMED_REJECTED', 'CLAIMED_UNKNOWN'
    ],
    requiredEvidenceIds: TRANSPORT_EVIDENCE_IDS,
    receiptTrustOnArrival: 'UNTRUSTED_PENDING_MATCH_AND_VERIFICATION'
  }) && exact(specification.permissionsAndConsent, {
    requiredAuthoritySeat: 'MIKE_TOBI_OR_AUTHENTICATED_HOST_GOVERNANCE_SEAT',
    exactPerRequestContactAuthorityRequired: true,
    exactRecipientConsentOrHostAuthorizationRequired: true,
    authorityTrustAnchorResultRequired: true,
    providerMayInferConsent: false,
    automaticRetryAllowed: false
  }) && exact(specification.resourceBudget, {
    maximumRouteBindings: 1,
    maximumExternalRuntimeMs: 120000,
    maximumResultEnvelopeBytes: 262144,
    maximumSendAttemptsPerExactAuthorityReceipt: 1,
    maximumReceiverAcknowledgementsPerAttempt: 1,
    automaticRetryCount: 0
  }) && exact(specification.failureAndRecovery, {
    failClosed: true,
    senderReceiptAloneMayProveDelivery: false,
    receiverReceiptAloneMayProveExactPayload: false,
    partialOrMismatchedReceiptMayVerifyProvider: false,
    retryRequiresNewExplicitAuthority: true,
    noFoundationMutationOnFailure: true
  }) && exact(specification.compatibility, {
    capabilityIdMustMatchExactly: true,
    resultEnvelopeSchemaVersion: 1,
    exactR130SourceDigestsRequired: true,
    prerequisiteAuthorityCapabilityId: AUTHORITY_CAPABILITY_ID
  }) && exact(specification.verificationContract, {
    matchedTransactionIdRequired: true,
    matchedRequestIdAndPayloadDigestRequired: true,
    matchedRecipientIdentityRequired: true,
    senderAndReceiverAuthorityVerifiedIndependently: true,
    receiptTimeWindowAndReplayChecked: true,
    deliveryDoesNotProveReceiverAppliedOrAcceptedRequest: true
  });
}

function bundleValid(bundle, contract, boundary) {
  if (!contractValid(contract, boundary) ||
      !digestValid(bundle, BUNDLE_SCHEMA) ||
      !exactKeys(bundle, ['schema', 'status', 'sourceContract', 'sourceR130',
        'specifications', 'inputBindings', 'summary', 'truth', 'digest']) ||
      !exact(bundle.sourceContract, sourceRef(contract)) ||
      !exact(bundle.sourceR130, {
        contract: sourceRef(boundary.r130Contract),
        witness: sourceRef(boundary.r130Witness),
        preflight: sourceRef(boundary.r130Preflight)
      }) || !bindingsValid(bundle.inputBindings, contract, boundary) ||
      !Array.isArray(bundle.specifications) ||
      bundle.specifications.length !== 2 ||
      !authoritySpecificationValid(bundle.specifications[0],
        bundle.inputBindings, boundary) ||
      !transportSpecificationValid(bundle.specifications[1],
        bundle.inputBindings, boundary)) return false;
  const routeCount = boundary.r130Witness.routes.length;
  const bindingCount = routeCount * 2;
  return bundle.status === (bindingCount === 0 ? EMPTY_STATUS : BOUND_STATUS) &&
    exact(bundle.summary, {
      capabilitySpecificationCount: 2,
      authoritySpecificationCount: 1,
      transportSpecificationCount: 1,
      sourceCompatibleRouteCount: routeCount,
      inputBindingCount: bindingCount,
      nativeProviderReceiptSchemaCount: 0,
      selectedProviderCount: 0,
      installedProviderCount: 0,
      availableProviderCount: 0,
      executedProviderCount: 0,
      authorityResolvedCount: 0,
      transportedRequestCount: 0
    }) && exact(bundle.truth, {
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
    }) && new TextEncoder().encode(JSON.stringify(bundle)).length <= 524288;
}

export function
auditLandMatrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecification(
  contract, bundle, boundary) {
  const contractReconstructed = contractValid(contract, boundary);
  const bundleReconstructed = contractReconstructed &&
    bundleValid(bundle, contract, boundary);
  const audit = {
    schema: AUDIT_SCHEMA,
    status: bundleReconstructed ? 'PASS' : 'FAIL',
    sourceContract: contract?.schema === CONTRACT_SCHEMA
      ? sourceRef(contract) : null,
    sourceBundle: bundle?.schema === BUNDLE_SCHEMA
      ? sourceRef(bundle) : null,
    verdicts: {
      exactR130BoundaryReconstructed: contractReconstructed,
      contractReconstructed,
      inputBindingsReconstructed: bundleReconstructed,
      authoritySpecificationReconstructed: bundleReconstructed,
      transportSpecificationReconstructed: bundleReconstructed,
      permissionsBudgetsRecoveryCompatibilityAndVerificationExact:
        bundleReconstructed,
      nativeProviderReceiptSchemasRemainUndeclared: bundleReconstructed &&
        bundle.summary.nativeProviderReceiptSchemaCount === 0,
      operationalAndAuthorityOverclaimsAbsent: bundleReconstructed
    },
    summary: {
      specificationCount: bundleReconstructed
        ? bundle.specifications.length : 0,
      inputBindingCount: bundleReconstructed ? bundle.inputBindings.length : 0,
      sourceCompatibleRouteCount: bundleReconstructed
        ? boundary.r130Witness.routes.length : 0
    }
  };
  audit.digest = stableDigest(audit);
  return audit;
}
