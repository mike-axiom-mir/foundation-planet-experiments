import {
  VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECIDE_CAPABILITY_ID
} from './matrix-thermal-verifier-route-out-of-band-authority-designation-request.mjs?v=0.136.0-r136.1';
import {
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_CAPABILITY_SPECIFICATION_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_INPUT_BINDING_SCHEMA,
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_CAPABILITY_SPECIFICATION_SCHEMA,
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_RESULT_ENVELOPE_SCHEMA,
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA,
  landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionCapabilitySpecificationContractReceiptValid,
  landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionCapabilitySpecificationBundleValid
} from './matrix-thermal-verifier-route-out-of-band-authority-designation-decision-capability-specification.mjs?v=0.137.0-r137.1';

export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-binding-preflight-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_DECLARATION_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-declaration/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_ASSESSMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-binding-assessment/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_PREFLIGHT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-binding-preflight/v1';

export const
  VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_PREFLIGHT_EVALUATE_CAPABILITY_ID =
    'contract.foundation-planet.external-provider-verification.verifier-route.out-of-band.designation.decision-hand.provider-binding.preflight.evaluate';

const CONTRACT_STATUS =
  'OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_PREFLIGHT_AVAILABLE';
const EMPTY_STATUS =
  'OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_PREFLIGHT_BLOCKED_WITH_NO_DECLARATIONS';
const COMPATIBLE_STATUS =
  'OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_CANDIDATE_CONTRACT_COMPATIBLE_UNVERIFIED';
const BLOCKED_STATUS =
  'OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_PREFLIGHT_BLOCKED';
const MISSING_ASSESSMENT_STATUS = 'MISSING_DECISION_HAND_PROVIDER_DECLARATION';
const COMPATIBLE_ASSESSMENT_STATUS =
  'DECISION_HAND_PROVIDER_DECLARATION_CONTRACT_COMPATIBLE_UNVERIFIED';
const REJECTED_ASSESSMENT_STATUS =
  'DECISION_HAND_PROVIDER_DECLARATIONS_REJECTED';
const AMBIGUOUS_ASSESSMENT_STATUS =
  'AMBIGUOUS_DECISION_HAND_PROVIDER_DECLARATIONS';
const REVIEW_SEAT_ID = 'axm-host-authority-review-seat';
const PROVIDER_CLASS =
  'AUTHENTICATED_OUT_OF_BAND_HOST_GOVERNANCE_ROUTE_DESIGNATION_DECISION_HAND';
const MAXIMUM_DECLARATIONS = 2;
const MAXIMUM_DECLARATIONS_PER_CAPABILITY = 2;
const MAXIMUM_NATIVE_SCHEMAS_PER_DECLARATION = 1;
const MAXIMUM_SERIALIZED_DECLARATION_BYTES = 131072;
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

function withDigest(value) {
  const output = clone(value);
  output.digest = stableDigest(output);
  return output;
}

const sourceRef = value => ({ schema: value.schema, receiptDigest: value.digest });
const providerIdValid = value => typeof value === 'string' &&
  /^[a-z0-9][a-z0-9._:-]{2,127}$/.test(value);
const providerVersionValid = value => typeof value === 'string' &&
  /^[0-9]+\.[0-9]+\.[0-9]+(?:-[a-z0-9.-]+)?$/.test(value);
const schemaValid = value => typeof value === 'string' &&
  /^[a-z0-9][a-z0-9._/-]{2,191}\/v[1-9][0-9]*$/.test(value);

function boundaryValid(boundary) {
  return exactKeys(boundary, ['r137Contract', 'r137Bundle', 'r137Boundary']) &&
    landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionCapabilitySpecificationContractReceiptValid(
      boundary.r137Contract, boundary.r137Boundary) &&
    landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionCapabilitySpecificationBundleValid(
      boundary.r137Bundle, boundary.r137Contract, boundary.r137Boundary);
}

function expectedContract(boundary) {
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
    status: CONTRACT_STATUS,
    sourceR137: {
      contract: sourceRef(boundary.r137Contract),
      bundle: sourceRef(boundary.r137Bundle)
    },
    projection: {
      sourceSpecificationCount: boundary.r137Bundle.specifications.length,
      sourceInputBindingCount: boundary.r137Bundle.inputBindings.length,
      maximumProviderDeclarations: MAXIMUM_DECLARATIONS,
      maximumDeclarationsPerCapability: MAXIMUM_DECLARATIONS_PER_CAPABILITY
    },
    schemas: {
      providerDeclaration:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_DECLARATION_SCHEMA,
      providerBindingAssessment:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_ASSESSMENT_SCHEMA,
      preflight:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_PREFLIGHT_SCHEMA
    },
    capabilityId:
      VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_PREFLIGHT_EVALUATE_CAPABILITY_ID,
    resourceBudget: {
      maximumProviderDeclarations: MAXIMUM_DECLARATIONS,
      maximumDeclarationsPerCapability: MAXIMUM_DECLARATIONS_PER_CAPABILITY,
      maximumNativeSchemasPerDeclaration:
        MAXIMUM_NATIVE_SCHEMAS_PER_DECLARATION,
      maximumSerializedDeclarationBytes:
        MAXIMUM_SERIALIZED_DECLARATION_BYTES,
      maximumSerializedPreflightBytes: MAXIMUM_SERIALIZED_PREFLIGHT_BYTES
    },
    truth: {
      exactR137ContractBundleAndCustodyBound: true,
      callerDeclarationsMayBeStructurallyEvaluated: true,
      declarationMaySelectInstallOrExecuteDecisionHand: false,
      nativeDecisionReceiptSchemaDeclarationMayEstablishTrust: false,
      decisionHandSelected: false,
      decisionHandInstalled: false,
      decisionHandAvailable: false,
      decisionHandExecuted: false,
      authoritySeatAuthenticated: false,
      authorityDecisionObserved: false,
      routeDesignatedOrAuthorized: false,
      requestTransported: false,
      evidenceAdmitted: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  });
}

export function
createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderBindingPreflightContractReceipt(
  boundary) {
  if (!boundaryValid(boundary)) {
    throw new Error('R138 decision-hand provider binding needs the exact R137 boundary');
  }
  return expectedContract(boundary);
}

export function
landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderBindingPreflightContractReceiptValid(
  contract, boundary) {
  return boundaryValid(boundary) && exact(contract, expectedContract(boundary));
}

function expectedSpecificationBinding(specification, boundary) {
  return {
    specificationOrdinal: specification.ordinal,
    specificationCapabilityId: specification.capabilityId,
    specificationDigest: specification.digest,
    r137ContractDigest: boundary.r137Contract.digest,
    r137BundleDigest: boundary.r137Bundle.digest,
    inputBindingSchema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_INPUT_BINDING_SCHEMA,
    resultEnvelopeSchema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_RESULT_ENVELOPE_SCHEMA
  };
}

function expectedImplementationBoundary() {
  return {
    entrypointKind: PROVIDER_CLASS,
    executionStatus: 'NOT_REQUESTED',
    outOfBandAuthorityDecisionOnly: true,
    externalContactMayOccurOnlyAfterExplicitHostAuthorization: true,
    routeOperationRequested: false,
    foundationPlanetWritesRequested: false,
    persistenceRequested: false
  };
}

function expectedPermissionsAndConsent() {
  return {
    requiredReviewSeatId: REVIEW_SEAT_ID,
    eligibleDecisionMakers: [
      'MIKE_TOBI', 'AUTHENTICATED_HOST_GOVERNANCE_SEAT'
    ],
    authenticatedAuthoritySeatRequired: true,
    candidateAndAllRouteProviderControlExclusionRequired: true,
    allowedAndDeniedIdentityProbesRequired: true,
    selfAttestationOrEligibilityLabelSufficient: false,
    providerOrCandidateMaySelfAuthorize: false,
    explicitPerDecisionInvocationRequired: true,
    deniedOrUnknownOutcomeFailsClosed: true
  };
}

function expectedControlDeclaration() {
  return {
    decisionHandProviderIdDistinctFromCurrentCandidateAndRouteProviderIds: true,
    declaredNoCandidateOrRouteProviderControlOrBeneficialOwnership: true,
    declarationTrust: 'CALLER_DECLARED_UNVERIFIED'
  };
}

function expectedLifecycle() {
  return {
    status: 'CANDIDATE_DECISION_HAND_DECLARATION_UNTRUSTED',
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
  };
}

function sourceCandidateAndRouteProviderIds(boundary) {
  const ids = boundary.r137Boundary.r136Batch.packets.flatMap(packet => [
    packet.requestedRouteDesignation.candidateProviderId,
    ...packet.requestedRouteDesignation.routeProviders.map(item => item.providerId)
  ]);
  return [...new Set(ids)].sort();
}

function nativeDecisionReceiptSchemaValid(declaration, allSchemaCounts) {
  const item = declaration.nativeDecisionReceiptSchema;
  return exactKeys(item, ['role', 'schema', 'trust']) &&
    item.role === 'AUTHORITY_DESIGNATION_DECISION_RECEIPT' &&
    schemaValid(item.schema) && item.trust === 'CALLER_DECLARED_UNVERIFIED' &&
    allSchemaCounts.get(item.schema) === 1 && ![
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_CAPABILITY_SPECIFICATION_CONTRACT_RECEIPT_SCHEMA,
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_INPUT_BINDING_SCHEMA,
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_CAPABILITY_SPECIFICATION_SCHEMA,
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_RESULT_ENVELOPE_SCHEMA,
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA
    ].includes(item.schema);
}

function verificationDeclarationValid(declaration) {
  const value = declaration.verificationDeclaration;
  return exactKeys(value, [
    'independentSecondaryVerifierId',
    'exactSpecificationAndInputBindingDigestReplayPlanned',
    'nativeDecisionReceiptSchemaValidationPlanned',
    'decisionMakerSeatIdentityScopeAndAuthorityVerificationPlanned',
    'allowedAndDeniedIdentityProbesPlanned',
    'candidateAndRouteProviderNonControlProofPlanned',
    'nativeSignatureKeyAuthorityExpiryAndRevocationVerificationPlanned',
    'exactCriteriaAndEvidenceProofReplayPlanned',
    'independentIdentityAuthorityAndNonControlReceipt',
    'implementationIntegrityReceipt',
    'liveAvailabilityReceipt'
  ]) && providerIdValid(value.independentSecondaryVerifierId) &&
    value.independentSecondaryVerifierId !== declaration.providerId &&
    value.exactSpecificationAndInputBindingDigestReplayPlanned === true &&
    value.nativeDecisionReceiptSchemaValidationPlanned === true &&
    value.decisionMakerSeatIdentityScopeAndAuthorityVerificationPlanned === true &&
    value.allowedAndDeniedIdentityProbesPlanned === true &&
    value.candidateAndRouteProviderNonControlProofPlanned === true &&
    value.nativeSignatureKeyAuthorityExpiryAndRevocationVerificationPlanned === true &&
    value.exactCriteriaAndEvidenceProofReplayPlanned === true &&
    value.independentIdentityAuthorityAndNonControlReceipt === null &&
    value.implementationIntegrityReceipt === null &&
    value.liveAvailabilityReceipt === null;
}

function declarationIssues(declaration, specification, boundary,
  allSchemaCounts, providerIdCounts) {
  const issues = [];
  if (!declaration || typeof declaration !== 'object' ||
      Array.isArray(declaration) || !exactKeys(declaration, [
        'schema', 'providerId', 'providerVersion', 'capabilityId',
        'providerClass', 'declarationTrust', 'specificationBinding',
        'nativeDecisionReceiptSchema', 'implementationBoundary',
        'permissionsAndConsent', 'controlAndBeneficialOwnershipDeclaration',
        'resourceBudget', 'failureAndRecovery', 'verificationDeclaration',
        'lifecycle', 'digest'])) return ['DECLARATION_SHAPE_INVALID'];
  const unsigned = clone(declaration);
  delete unsigned.digest;
  if (declaration.schema !==
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_DECLARATION_SCHEMA ||
      declaration.digest !== stableDigest(unsigned)) {
    issues.push('DECLARATION_DIGEST_INVALID');
  }
  if (!providerIdValid(declaration.providerId) ||
      !providerVersionValid(declaration.providerVersion) ||
      providerIdCounts.get(declaration.providerId) !== 1) {
    issues.push('PROVIDER_ID_VERSION_OR_UNIQUENESS_INVALID');
  }
  if (declaration.capabilityId !== specification.capabilityId ||
      declaration.providerClass !== specification.providerClass ||
      declaration.providerClass !== PROVIDER_CLASS) {
    issues.push('CAPABILITY_OR_PROVIDER_CLASS_MISMATCH');
  }
  if (declaration.declarationTrust !== 'CALLER_SUPPLIED_UNTRUSTED') {
    issues.push('DECLARATION_TRUST_OVERCLAIM');
  }
  if (!exact(declaration.specificationBinding,
      expectedSpecificationBinding(specification, boundary))) {
    issues.push('SPECIFICATION_BINDING_MISMATCH');
  }
  if (!nativeDecisionReceiptSchemaValid(declaration, allSchemaCounts)) {
    issues.push('NATIVE_DECISION_RECEIPT_SCHEMA_INVALID_OR_REUSED');
  }
  if (!exact(declaration.implementationBoundary,
      expectedImplementationBoundary())) {
    issues.push('IMPLEMENTATION_BOUNDARY_MISMATCH');
  }
  if (!exact(declaration.permissionsAndConsent,
      expectedPermissionsAndConsent())) {
    issues.push('PERMISSION_OR_CONSENT_BOUNDARY_MISMATCH');
  }
  if (!exact(declaration.controlAndBeneficialOwnershipDeclaration,
      expectedControlDeclaration()) ||
      sourceCandidateAndRouteProviderIds(boundary).includes(
        declaration.providerId)) {
    issues.push('CONTROL_OR_BENEFICIAL_OWNERSHIP_DECLARATION_INVALID');
  }
  if (!exact(declaration.resourceBudget, specification.resourceBudget)) {
    issues.push('RESOURCE_BUDGET_MISMATCH');
  }
  if (!exact(declaration.failureAndRecovery,
      specification.failureAndRecovery)) {
    issues.push('FAILURE_OR_RECOVERY_BOUNDARY_MISMATCH');
  }
  if (!verificationDeclarationValid(declaration)) {
    issues.push('VERIFICATION_DECLARATION_INVALID');
  }
  if (!exact(declaration.lifecycle, expectedLifecycle())) {
    issues.push('LIFECYCLE_OVERCLAIM');
  }
  if (new TextEncoder().encode(JSON.stringify(declaration)).length >
      MAXIMUM_SERIALIZED_DECLARATION_BYTES) {
    issues.push('DECLARATION_RESOURCE_CEILING_EXCEEDED');
  }
  return [...new Set(issues)].sort();
}

function expectedCandidateBinding(specification, declaration, boundary) {
  return {
    specificationOrdinal: specification.ordinal,
    capabilityId: specification.capabilityId,
    providerId: declaration.providerId,
    providerVersion: declaration.providerVersion,
    providerClass: declaration.providerClass,
    declarationDigest: declaration.digest,
    sourceRequestPacketCount: specification.coverage.sourceRequestPacketCount,
    inputBindingDigests: clone(specification.coverage.inputBindingDigests),
    nativeDecisionReceiptSchema: clone(declaration.nativeDecisionReceiptSchema),
    structurallyDistinctFromCurrentCandidateAndRouteProviderIds:
      !sourceCandidateAndRouteProviderIds(boundary).includes(
        declaration.providerId),
    trust: 'CALLER_SUPPLIED_COMPATIBLE_UNVERIFIED',
    selected: false,
    installed: false,
    available: false,
    executed: false,
    authoritySeatAuthenticated: false,
    authorityDecisionObserved: false,
    designationReceiptObserved: false,
    routeDesignatedOrAuthorized: false
  };
}

function schemaCounts(declarations) {
  const counts = new Map();
  declarations.forEach(declaration => {
    const schema = declaration?.nativeDecisionReceiptSchema?.schema;
    if (typeof schema !== 'string') return;
    counts.set(schema, (counts.get(schema) || 0) + 1);
  });
  return counts;
}

function providerIdCounts(declarations) {
  const counts = new Map();
  declarations.forEach(declaration => {
    const providerId = declaration?.providerId;
    if (typeof providerId !== 'string') return;
    counts.set(providerId, (counts.get(providerId) || 0) + 1);
  });
  return counts;
}

function assessSpecification(specification, declarations, boundary,
  allSchemaCounts, allProviderIdCounts) {
  const declarationInputIndexes = declarations.map((item, index) =>
    item?.capabilityId === specification.capabilityId ? index : -1)
    .filter(index => index >= 0);
  const results = declarationInputIndexes.map(inputIndex => ({
    inputIndex,
    issues: declarationIssues(declarations[inputIndex], specification,
      boundary, allSchemaCounts, allProviderIdCounts)
  }));
  const compatible = results.filter(item => item.issues.length === 0);
  const issueCodes = [...new Set(results.flatMap(item => item.issues))].sort();
  let status = MISSING_ASSESSMENT_STATUS;
  if (declarationInputIndexes.length > 0 && compatible.length === 0) {
    status = REJECTED_ASSESSMENT_STATUS;
  } else if (compatible.length === 1) {
    status = COMPATIBLE_ASSESSMENT_STATUS;
  } else if (compatible.length > 1) {
    status = AMBIGUOUS_ASSESSMENT_STATUS;
    issueCodes.push('MULTIPLE_COMPATIBLE_DECISION_HAND_PROVIDER_DECLARATIONS');
  }
  const declaration = compatible.length === 1
    ? declarations[compatible[0].inputIndex] : null;
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_ASSESSMENT_SCHEMA,
    specificationOrdinal: specification.ordinal,
    capabilityId: specification.capabilityId,
    providerClass: specification.providerClass,
    declarationInputIndexes,
    compatibleDeclarationInputIndexes:
      compatible.map(item => item.inputIndex),
    rejectedDeclarationInputIndexes:
      results.filter(item => item.issues.length > 0).map(item => item.inputIndex),
    status,
    issueCodes: [...new Set(issueCodes)].sort(),
    candidateBinding: declaration
      ? expectedCandidateBinding(specification, declaration, boundary) : null
  });
}

function expectedPreflight(contract, boundary, declarations) {
  const specification = boundary.r137Bundle.specifications[0];
  const assessment = assessSpecification(specification, declarations, boundary,
    schemaCounts(declarations), providerIdCounts(declarations));
  const assessments = [assessment];
  const providerCandidates = assessment.status === COMPATIBLE_ASSESSMENT_STATUS
    ? [assessment.candidateBinding] : [];
  const unassignedDeclarationInputIndexes = declarations.map((item, index) =>
    item?.capabilityId === specification.capabilityId ? -1 : index)
    .filter(index => index >= 0);
  const compatible = providerCandidates.length === 1 &&
    unassignedDeclarationInputIndexes.length === 0;
  const status = declarations.length === 0 ? EMPTY_STATUS
    : compatible ? COMPATIBLE_STATUS : BLOCKED_STATUS;
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_PREFLIGHT_SCHEMA,
    status,
    sourceContract: sourceRef(contract),
    sourceR137: {
      contract: sourceRef(boundary.r137Contract),
      bundle: sourceRef(boundary.r137Bundle)
    },
    declarationDigests: declarations.map(item => item?.digest || null),
    assessments,
    providerCandidates,
    unassignedDeclarationInputIndexes,
    summary: {
      specificationCount: 1,
      sourceRequestPacketCount: specification.coverage.sourceRequestPacketCount,
      sourceInputBindingCount: specification.coverage.inputBindingCount,
      declarationCount: declarations.length,
      compatibleCandidateCount: providerCandidates.length,
      ambiguousSpecificationCount: assessment.status ===
        AMBIGUOUS_ASSESSMENT_STATUS ? 1 : 0,
      rejectedDeclarationCount:
        assessment.rejectedDeclarationInputIndexes.length +
        unassignedDeclarationInputIndexes.length,
      selectedDecisionHandCount: 0,
      installedDecisionHandCount: 0,
      availableDecisionHandCount: 0,
      executedDecisionHandCount: 0,
      verifiedNativeDecisionReceiptSchemaCount: 0,
      authenticatedAuthoritySeatCount: 0,
      authorityDecisionCount: 0,
      designationReceiptCount: 0,
      designatedOrAuthorizedRouteCount: 0
    },
    truth: {
      exactR137BoundaryBound: true,
      declarationCompatibilityEvaluated: true,
      compatibleCandidateRemainsCallerSuppliedUnverified:
        providerCandidates.length > 0,
      providerSelectionPerformed: false,
      providerInstallationPerformed: false,
      providerAvailabilityVerified: false,
      providerExecutionPerformed: false,
      nativeDecisionReceiptSchemaVerified: false,
      authoritySeatAuthenticated: false,
      authorityDecisionObserved: false,
      designationReceiptObserved: false,
      routeDesignatedOrAuthorized: false,
      routeProvidersVerified: false,
      dependencyGraphVerifiedAcyclic: false,
      endpointResolved: false,
      recipientAuthenticated: false,
      contactAuthorized: false,
      requestTransported: false,
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

function declarationsBounded(declarations) {
  return Array.isArray(declarations) &&
    declarations.length <= MAXIMUM_DECLARATIONS &&
    declarations.filter(item => item?.capabilityId ===
      VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECIDE_CAPABILITY_ID)
      .length <= MAXIMUM_DECLARATIONS_PER_CAPABILITY;
}

export function
createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderBindingPreflight(
  contract, boundary, declarations = []) {
  if (!landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderBindingPreflightContractReceiptValid(
      contract, boundary) || !declarationsBounded(declarations)) {
    throw new Error(
      'R138 preflight needs the exact contract, boundary, and bounded declarations');
  }
  const preflight = expectedPreflight(contract, boundary, declarations);
  if (new TextEncoder().encode(JSON.stringify(preflight)).length >
      MAXIMUM_SERIALIZED_PREFLIGHT_BYTES) {
    throw new Error('R138 decision-hand provider binding preflight exceeds its resource ceiling');
  }
  return preflight;
}

export function
landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderBindingPreflightValid(
  preflight, contract, boundary, declarations = []) {
  return landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderBindingPreflightContractReceiptValid(
    contract, boundary) && declarationsBounded(declarations) &&
    new TextEncoder().encode(JSON.stringify(preflight)).length <=
      MAXIMUM_SERIALIZED_PREFLIGHT_BYTES &&
    exact(preflight, expectedPreflight(contract, boundary, declarations));
}

export function
matrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderBindingPreflightDescription() {
  return {
    status: 'EXPERIMENTAL',
    capabilityId:
      VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_PREFLIGHT_EVALUATE_CAPABILITY_ID,
    statement:
      'R138 exact-binds the R137 authority specification and evaluates bounded caller-supplied decision-hand provider declarations without selecting, trusting, installing, exposing, or executing a hand.',
    boundaries: [
      'The current real declaration inventory is empty, so the one specification assessment is missing and the current preflight is blocked.',
      'One structurally compatible declaration remains caller-supplied and unverified; multiple compatible declarations remain ambiguous and none is selected.',
      'Structural provider-id separation and a caller declaration do not prove non-control or beneficial ownership; independent native evidence remains required.',
      'No native decision receipt schema is trusted, no authority seat or provider availability is verified, and no decision, designation, endpoint, recipient, contact, transport, provider verification, evidence admission, persistence, owner/debit closure, promotion, canonization, or world mutation is produced.'
    ]
  };
}
