import {
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_REQUEST_PACKET_SCHEMA,
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_REQUEST_BATCH_SCHEMA,
  VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECIDE_CAPABILITY_ID,
  landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationRequestContractReceiptValid,
  landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationRequestBatchValid
} from './matrix-thermal-verifier-route-out-of-band-authority-designation-request.mjs?v=0.136.0-r136.1';

const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_CAPABILITY_SPECIFICATION_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-capability-specification-contract-receipt/v1';
const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_INPUT_BINDING_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-input-binding/v1';
const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_CAPABILITY_SPECIFICATION_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-capability-specification/v1';
const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_RESULT_ENVELOPE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-result-envelope/v1';
const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-capability-specification-bundle/v1';

const
  VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_SPECIFICATION_CREATE_CAPABILITY_ID =
    'contract.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decision.specification.create';

const CONTRACT_STATUS =
  'OUT_OF_BAND_VERIFIER_ROUTE_AUTHORITY_DESIGNATION_DECISION_CAPABILITY_SPECIFICATION_CONTRACT_AVAILABLE';
const EMPTY_BUNDLE_STATUS =
  'OUT_OF_BAND_VERIFIER_ROUTE_AUTHORITY_DESIGNATION_DECISION_CAPABILITY_SPECIFICATION_AVAILABLE_WITH_NO_CURRENT_REQUEST_BINDINGS';
const BOUND_BUNDLE_STATUS =
  'OUT_OF_BAND_VERIFIER_ROUTE_AUTHORITY_DESIGNATION_DECISION_CAPABILITY_SPECIFICATION_BOUND_TO_CURRENT_REQUESTS';
const REVIEW_SEAT_ID = 'axm-host-authority-review-seat';
const MAXIMUM_SPECIFICATIONS = 1;
const MAXIMUM_INPUT_BINDINGS = 2;
const DECISION_CRITERIA_PER_BINDING = 5;
const EVIDENCE_REQUIREMENTS_PER_BINDING = 7;
const MAXIMUM_EXTERNAL_RUNTIME_MS = 120000;
const MAXIMUM_RESULT_ENVELOPE_BYTES = 262144;
const MAXIMUM_SERIALIZED_BUNDLE_BYTES = 524288;
const clone = value => JSON.parse(JSON.stringify(value));
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const exactKeys = (value, keys) => value && typeof value === 'object' &&
  !Array.isArray(value) && exact(Object.keys(value).sort(), [...keys].sort());

const REQUIRED_DECISION_RECEIPT_FIELDS = [
  'resultEnvelopeSchemaVersion',
  'capabilityId',
  'requestId',
  'requestPacketDigest',
  'routeId',
  'decisionMakerSeatId',
  'authenticatedDecisionMakerIdentity',
  'decisionOutcome',
  'decisionReason',
  'decidedAt',
  'expiresAt',
  'revocationReference',
  'nativeSignatureAndKeyAuthorityChain'
];

const REQUIRED_PROOF_SURFACES = [
  'ALLOWED_AND_DENIED_AUTHORITY_SEAT_IDENTITY_PROBE_RECEIPTS',
  'NATIVE_DECISION_RECEIPT_SIGNATURE_KEY_AUTHORITY_EXPIRY_AND_REVOCATION_CHAIN',
  'CANDIDATE_AND_ROUTE_PROVIDER_CONTROL_AND_BENEFICIAL_OWNERSHIP_EXCLUSION',
  'EXACT_R136_REQUEST_ROUTE_CRITERIA_AND_EVIDENCE_BINDING_REPLAY',
  'DECISION_SCOPE_DENIAL_AND_OPERATIONAL_NON_AUTHORIZATION_PROOF'
];

const OPERATIONAL_ROUTE_CAPABILITY_IDS = [
  'transport.foundation-planet.external-provider-verification.endpoint.resolve',
  'authority.foundation-planet.external-provider-verification.verifier-route.trust-anchor.resolve',
  'transport.foundation-planet.external-provider-verification.request.send-receive'
];

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
  return exactKeys(boundary, ['r136Contract', 'r136Batch', 'r136Boundary',
    'r136Options']) &&
    landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationRequestContractReceiptValid(
      boundary.r136Contract, boundary.r136Boundary) &&
    landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationRequestBatchValid(
      boundary.r136Batch, boundary.r136Contract, boundary.r136Boundary,
      boundary.r136Options);
}

function expectedContract(boundary) {
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_CAPABILITY_SPECIFICATION_CONTRACT_RECEIPT_SCHEMA,
    status: CONTRACT_STATUS,
    sourceR136: {
      contract: sourceRef(boundary.r136Contract),
      requestBatch: sourceRef(boundary.r136Batch)
    },
    projection: {
      sourceRequestPacketCount: boundary.r136Batch.packets.length,
      inputBindingSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_INPUT_BINDING_SCHEMA,
      capabilitySpecificationSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_CAPABILITY_SPECIFICATION_SCHEMA,
      resultEnvelopeSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_RESULT_ENVELOPE_SCHEMA,
      specificationBundleSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA,
      implementedSpecificationCapabilityId:
        VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_SPECIFICATION_CREATE_CAPABILITY_ID,
      requiredDecisionCapabilityId:
        VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECIDE_CAPABILITY_ID,
      requestedReviewSeatId: REVIEW_SEAT_ID
    },
    resourceBudget: {
      maximumSpecifications: MAXIMUM_SPECIFICATIONS,
      maximumInputBindings: MAXIMUM_INPUT_BINDINGS,
      decisionCriteriaPerBinding: DECISION_CRITERIA_PER_BINDING,
      evidenceRequirementsPerBinding: EVIDENCE_REQUIREMENTS_PER_BINDING,
      maximumExternalRuntimeMs: MAXIMUM_EXTERNAL_RUNTIME_MS,
      maximumResultEnvelopeBytes: MAXIMUM_RESULT_ENVELOPE_BYTES,
      maximumSerializedBundleBytes: MAXIMUM_SERIALIZED_BUNDLE_BYTES
    },
    truth: {
      exactR136ContractBatchBoundaryAndOptionsBound: true,
      missingDecisionCapabilitySpecified: true,
      specificationIsDecisionImplementation: false,
      authoritySeatAuthenticated: false,
      authorityDecisionObserved: false,
      designationReceiptObserved: false,
      routeDesignatedOrAuthorized: false,
      routeProvidersVerified: false,
      dependencyGraphVerifiedAcyclic: false,
      endpointResolved: false,
      recipientAuthenticated: false,
      contactAuthorized: false,
      transportPerformed: false,
      providerVerified: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      evidenceAdmitted: false,
      persistencePerformed: false,
      worldMutationPerformed: false,
      promoted: false,
      canon: false
    }
  });
}

function expectedInputBinding(contract, boundary, packet, index) {
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_INPUT_BINDING_SCHEMA,
    ordinal: index + 1,
    capabilityId:
      VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECIDE_CAPABILITY_ID,
    sourceContract: sourceRef(contract),
    sourceR136: {
      contract: sourceRef(boundary.r136Contract),
      requestBatch: sourceRef(boundary.r136Batch),
      requestPacket: sourceRef(packet)
    },
    requestId: packet.requestId,
    requestBatchId: packet.requestBatchId,
    routeId: packet.requestedRouteDesignation.routeId,
    requestedReviewSeatId: packet.authorityReview.requestedReviewSeatId,
    requestWindow: clone(packet.requestWindow),
    requestedDesignationDigest: stableDigest(packet.requestedRouteDesignation),
    decisionCriterionDigests: packet.decisionCriteria.map(item => item.digest),
    externalEvidenceRequirementDigests:
      packet.requiredExternalEvidence.map(item => item.digest),
    truth: {
      exactR136RequestPacketBound: true,
      allFiveDecisionCriteriaReferenced: true,
      allSevenEvidenceRequirementsReferenced: true,
      authoritySeatAuthenticated: false,
      authorityDecisionObserved: false,
      designationReceiptObserved: false,
      routeDesignatedOrAuthorized: false,
      contactOrTransportAuthorized: false,
      providerVerificationPerformed: false
    }
  });
}

function expectedInputBindings(contract, boundary) {
  return boundary.r136Batch.packets.map((packet, index) =>
    expectedInputBinding(contract, boundary, packet, index));
}

function expectedSpecification(contract, boundary, inputBindings) {
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_CAPABILITY_SPECIFICATION_SCHEMA,
    ordinal: 1,
    capabilityId:
      VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECIDE_CAPABILITY_ID,
    gapType: 'AUTHORITY',
    providerClass:
      'AUTHENTICATED_OUT_OF_BAND_HOST_GOVERNANCE_ROUTE_DESIGNATION_DECISION_HAND',
    purpose:
      'Issue an explicit DESIGNATE, DENY, or UNKNOWN decision for one exact R136 route request through an independently authenticated host-governance seat without verifying providers or authorizing operation.',
    coverage: {
      sourceRequestPacketCount: boundary.r136Batch.packets.length,
      inputBindingCount: inputBindings.length,
      inputBindingDigests: inputBindings.map(item => item.digest),
      currentInventoryMayBeEmpty: true
    },
    inputContract: {
      sourceR136ContractSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
      sourceR136RequestPacketSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_REQUEST_PACKET_SCHEMA,
      sourceR136RequestBatchSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_REQUEST_BATCH_SCHEMA,
      inputBindingSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_INPUT_BINDING_SCHEMA,
      exactRequestRouteCriteriaEvidenceAndWindowDigestsRequired: true,
      currentRequestInventoryMayBeEmpty: true
    },
    outputContract: {
      resultEnvelopeSchema:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_RESULT_ENVELOPE_SCHEMA,
      nativeDecisionReceiptSchema: null,
      nativeDecisionReceiptSchemaStatus:
        'NOT_DECLARED_UNTIL_AUTHENTICATED_HAND_BINDING_AND_INDEPENDENT_REVIEW',
      requiredResultStatusCodes: [
        'CLAIMED_DESIGNATE', 'CLAIMED_DENY', 'CLAIMED_UNKNOWN'
      ],
      requiredDecisionReceiptFields: clone(REQUIRED_DECISION_RECEIPT_FIELDS),
      requiredProofSurfaces: clone(REQUIRED_PROOF_SURFACES),
      receiptTrustOnArrival:
        'UNTRUSTED_PENDING_NATIVE_SIGNATURE_AUTHORITY_SCOPE_EXPIRY_REVOCATION_AND_NONCONTROL_VERIFICATION'
    },
    sideEffects: {
      specificationMakesAuthorityDecision: false,
      specificationDesignatesOrAuthorizesRoute: false,
      specificationContactsEndpointOrHuman: false,
      specificationInstallsOrExecutesDecisionHand: false,
      decisionMayVerifyProvidersOrAuthorizeOperation: false,
      decisionHandMayPersistFoundationState: false,
      decisionHandMayPromoteOrCanonize: false
    },
    permissionsAndConsent: {
      requiredReviewSeatId: REVIEW_SEAT_ID,
      eligibleDecisionMakers: [
        'MIKE_TOBI', 'AUTHENTICATED_HOST_GOVERNANCE_SEAT'
      ],
      authenticatedAuthoritySeatRequired: true,
      candidateAndAllRouteProviderControlExclusionRequired: true,
      allowedAndDeniedIdentityProbesRequired: true,
      selfAttestationOrEligibilityLabelSufficient: false,
      providerOrCandidateMaySelfAuthorize: false,
      deniedOrUnknownOutcomeFailsClosed: true
    },
    resourceBudget: {
      maximumInputBindings: MAXIMUM_INPUT_BINDINGS,
      maximumExternalRuntimeMs: MAXIMUM_EXTERNAL_RUNTIME_MS,
      maximumResultEnvelopeBytes: MAXIMUM_RESULT_ENVELOPE_BYTES,
      maximumAllowedIdentityProbesPerRequest: 1,
      maximumDeniedIdentityProbesPerRequest: 1,
      maximumDecisionLifetimeBoundedByExactR136RequestExpiry: true,
      automaticRetryCount: 0
    },
    failureAndRecovery: {
      failClosed: true,
      partialCriteriaOrEvidenceMayDesignate: false,
      missingExpiredOrRevokedReceiptMayDesignate: false,
      denialMayFallThroughToAlternateDecisionMaker: false,
      replayedReceiptMayDesignate: false,
      retryRequiresNewExactR136RequestAndExplicitAuthority: true,
      noFoundationMutationOnFailure: true
    },
    compatibility: {
      capabilityIdMustMatchExactly: true,
      resultEnvelopeSchemaVersion: 1,
      exactR136SourceDigestsAndOptionsRequired: true,
      exactRequestWindowAndRouteScopeRequired: true,
      operationalRouteCapabilityIdsRemainSeparatelyRequired:
        clone(OPERATIONAL_ROUTE_CAPABILITY_IDS)
    },
    verificationContract: {
      exactR136RequestBindingReplayRequired: true,
      decisionMakerSeatIdentityAndScopeVerifiedIndependently: true,
      nativeSignatureKeyAuthorityExpiryAndRevocationChainRequired: true,
      candidateAndRouteProviderNonControlMustBeProven: true,
      allowedAndDeniedIdentityProbeReceiptsRequired: true,
      allFiveDecisionCriteriaRequireNativeEvidence: true,
      allSevenR135EvidenceObligationsRemainUnadmitted: true,
      designationDoesNotVerifyProviderOrAuthorizeContactTransport: true,
      independentSecondaryAuditRequired: true
    },
    promotionGate: {
      authority: 'MIKE_TOBI_AXM',
      decisionHandMaySelfSelectInstallExecutePromoteOrCanonize: false,
      passingValidationIsNotDecisionOrPromotion: true
    },
    lifecycle: {
      status: 'SPECIFIED_NOT_IMPLEMENTED',
      decisionHandSelected: false,
      installed: false,
      available: false,
      executed: false,
      authoritySeatAuthenticated: false,
      decisionObserved: false,
      designationReceiptObserved: false,
      routeDesignatedOrAuthorized: false,
      promoted: false,
      canon: false
    }
  });
}

function expectedBundle(contract, boundary) {
  const inputBindings = expectedInputBindings(contract, boundary);
  const specifications = [
    expectedSpecification(contract, boundary, inputBindings)
  ];
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA,
    status: inputBindings.length === 0
      ? EMPTY_BUNDLE_STATUS : BOUND_BUNDLE_STATUS,
    sourceContract: sourceRef(contract),
    sourceR136: {
      contract: sourceRef(boundary.r136Contract),
      requestBatch: sourceRef(boundary.r136Batch)
    },
    specifications,
    inputBindings,
    summary: {
      capabilitySpecificationCount: specifications.length,
      authoritySpecificationCount: 1,
      sourceRequestPacketCount: boundary.r136Batch.packets.length,
      inputBindingCount: inputBindings.length,
      decisionCriterionReferenceCount:
        inputBindings.length * DECISION_CRITERIA_PER_BINDING,
      externalEvidenceRequirementReferenceCount:
        inputBindings.length * EVIDENCE_REQUIREMENTS_PER_BINDING,
      nativeDecisionReceiptSchemaCount: 0,
      decisionHandSelectedCount: 0,
      installedDecisionHandCount: 0,
      availableDecisionHandCount: 0,
      executedDecisionHandCount: 0,
      authenticatedAuthoritySeatCount: 0,
      authorityDecisionCount: 0,
      designationReceiptCount: 0,
      designatedOrAuthorizedRouteCount: 0
    },
    prohibitedConclusions: {
      treatSpecificationAsDecisionImplementation: true,
      treatEligibilityLabelAsAuthenticatedAuthority: true,
      inventNativeDecisionReceiptSchema: true,
      treatResultEnvelopeAsVerifiedDecision: true,
      treatDesignationAsProviderVerificationOrOperationalAuthority: true,
      executeWithoutAuthenticatedBindingBudgetAndPermissions: true,
      persistMutatePromoteOrCanonize: true
    },
    truth: {
      exactR136BoundaryBound: true,
      missingDecisionCapabilitySpecified: true,
      specificationIsDecisionImplementation: false,
      nativeDecisionReceiptSchemaDeclared: false,
      decisionHandSelected: false,
      decisionHandInstalled: false,
      decisionHandAvailable: false,
      decisionHandExecuted: false,
      authoritySeatAuthenticated: false,
      authorityDecisionObserved: false,
      designationReceiptObserved: false,
      routeDesignatedOrAuthorized: false,
      routeProvidersVerified: false,
      dependencyGraphVerifiedAcyclic: false,
      endpointResolved: false,
      recipientAuthenticated: false,
      contactAuthorized: false,
      transportPerformed: false,
      providerVerificationPerformed: false,
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

const AUDIT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-capability-specification-audit/v1';

export function
auditLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionCapabilitySpecification(
  contract, bundle, boundary) {
  const findings = [];
  if (!boundaryValid(boundary)) {
    findings.push('R136_BOUNDARY_INVALID_OR_SUBSTITUTED');
  } else {
    const reconstructedContract = expectedContract(boundary);
    if (!exact(contract, reconstructedContract)) {
      findings.push('R137_CONTRACT_NOT_EXACTLY_RECONSTRUCTED');
    } else if (!exact(bundle, expectedBundle(contract, boundary))) {
      findings.push('R137_SPECIFICATION_BUNDLE_NOT_EXACTLY_RECONSTRUCTED');
    }
  }
  if (!bundle || typeof bundle !== 'object' || Array.isArray(bundle) ||
      new TextEncoder().encode(JSON.stringify(bundle)).length >
        MAXIMUM_SERIALIZED_BUNDLE_BYTES) {
    findings.push('SPECIFICATION_BUNDLE_RESOURCE_CEILING_EXCEEDED_OR_INVALID');
  }
  const uniqueFindings = [...new Set(findings)];
  const bindingCount = Array.isArray(bundle?.inputBindings)
    ? bundle.inputBindings.length : 0;
  return withDigest({
    schema: AUDIT_SCHEMA,
    status: uniqueFindings.length === 0 ? 'PASS' : 'FAIL',
    source: {
      contract: contract && typeof contract === 'object'
        ? sourceRef(contract) : null,
      specificationBundle: bundle && typeof bundle === 'object'
        ? sourceRef(bundle) : null
    },
    findings: uniqueFindings,
    summary: {
      capabilitySpecificationCount: Array.isArray(bundle?.specifications)
        ? bundle.specifications.length : 0,
      inputBindingCount: bindingCount,
      decisionCriterionReferenceCount:
        bindingCount * DECISION_CRITERIA_PER_BINDING,
      externalEvidenceRequirementReferenceCount:
        bindingCount * EVIDENCE_REQUIREMENTS_PER_BINDING,
      nativeDecisionReceiptSchemaCount: 0,
      decisionHandSelectedCount: 0,
      installedDecisionHandCount: 0,
      availableDecisionHandCount: 0,
      executedDecisionHandCount: 0,
      authenticatedAuthoritySeatCount: 0,
      authorityDecisionCount: 0,
      designationReceiptCount: 0,
      designatedOrAuthorizedRouteCount: 0,
      endpointResolvedCount: 0,
      recipientAuthenticatedCount: 0,
      contactAuthorizedCount: 0,
      transmittedRequestCount: 0,
      providerVerifiedCount: 0,
      evidenceAdmittedCount: 0,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  });
}

