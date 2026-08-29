import {
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATION_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_INPUT_BINDING_SCHEMA,
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_RESULT_ENVELOPE_SCHEMA,
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATION_SCHEMA,
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA,
  VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
  VERIFICATION_REQUEST_SEND_RECEIVE_CAPABILITY_ID,
  landMatrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecificationContractReceiptValid,
  landMatrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecificationBundleValid
} from './matrix-thermal-verifier-route-trust-anchor-and-transport-capability-specification.mjs?v=0.131.0-r131.1';

export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-provider-binding-preflight-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_DECLARATION_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-provider-declaration/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_ASSESSMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-provider-binding-assessment/v1';
export const
  LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_PREFLIGHT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-provider-binding-preflight/v1';

export const
  VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_PREFLIGHT_EVALUATE_CAPABILITY_ID =
    'contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.verifier-route.trust-anchor-and-transport.provider-binding.preflight.evaluate';

const CONTRACT_STATUS =
  'VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_PREFLIGHT_AVAILABLE';
const EMPTY_STATUS =
  'VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_PREFLIGHT_BLOCKED_WITH_NO_DECLARATIONS';
const COMPATIBLE_STATUS =
  'VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_CANDIDATES_COMPATIBLE_UNVERIFIED';
const BLOCKED_STATUS =
  'VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_PREFLIGHT_BLOCKED';
const MISSING_ASSESSMENT_STATUS = 'MISSING_PROVIDER_DECLARATION';
const COMPATIBLE_ASSESSMENT_STATUS =
  'PROVIDER_DECLARATION_CONTRACT_COMPATIBLE_UNVERIFIED';
const REJECTED_ASSESSMENT_STATUS = 'PROVIDER_DECLARATIONS_REJECTED';
const AMBIGUOUS_ASSESSMENT_STATUS = 'AMBIGUOUS_PROVIDER_DECLARATIONS';
const MAXIMUM_DECLARATIONS = 4;
const MAXIMUM_DECLARATIONS_PER_CAPABILITY = 2;
const MAXIMUM_NATIVE_SCHEMAS_PER_DECLARATION = 2;
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
  return exactKeys(boundary, ['r131Contract', 'r131Bundle', 'r131Boundary']) &&
    landMatrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecificationContractReceiptValid(
      boundary.r131Contract, boundary.r131Boundary) &&
    landMatrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecificationBundleValid(
      boundary.r131Bundle, boundary.r131Contract, boundary.r131Boundary);
}

function expectedContract(boundary) {
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
    status: CONTRACT_STATUS,
    sourceR131: {
      contract: sourceRef(boundary.r131Contract),
      bundle: sourceRef(boundary.r131Bundle)
    },
    projection: {
      sourceSpecificationCount: boundary.r131Bundle.specifications.length,
      sourceInputBindingCount: boundary.r131Bundle.inputBindings.length,
      maximumProviderDeclarations: MAXIMUM_DECLARATIONS,
      maximumDeclarationsPerCapability:
        MAXIMUM_DECLARATIONS_PER_CAPABILITY
    },
    schemas: {
      providerDeclaration:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_DECLARATION_SCHEMA,
      providerBindingAssessment:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_ASSESSMENT_SCHEMA,
      preflight:
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_PREFLIGHT_SCHEMA
    },
    capabilityId:
      VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_PREFLIGHT_EVALUATE_CAPABILITY_ID,
    resourceBudget: {
      maximumProviderDeclarations: MAXIMUM_DECLARATIONS,
      maximumDeclarationsPerCapability:
        MAXIMUM_DECLARATIONS_PER_CAPABILITY,
      maximumNativeSchemasPerDeclaration:
        MAXIMUM_NATIVE_SCHEMAS_PER_DECLARATION,
      maximumSerializedDeclarationBytes:
        MAXIMUM_SERIALIZED_DECLARATION_BYTES,
      maximumSerializedPreflightBytes: MAXIMUM_SERIALIZED_PREFLIGHT_BYTES
    },
    truth: {
      exactR131ContractBundleAndCustodyBound: true,
      callerDeclarationsMayBeStructurallyEvaluated: true,
      declarationMaySelectInstallOrExecuteProvider: false,
      nativeReceiptSchemaDeclarationMayEstablishTrust: false,
      providerSelected: false,
      providerInstalled: false,
      providerAvailable: false,
      providerExecuted: false,
      authorityTrustAnchorResolved: false,
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
createLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflightContractReceipt(
  boundary) {
  if (!boundaryValid(boundary)) {
    throw new Error('R132 provider binding needs the exact R131 boundary');
  }
  return expectedContract(boundary);
}

export function
landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflightContractReceiptValid(
  contract, boundary) {
  return boundaryValid(boundary) && exact(contract, expectedContract(boundary));
}

function expectedSpecificationBinding(specification, boundary) {
  return {
    specificationOrdinal: specification.ordinal,
    specificationCapabilityId: specification.capabilityId,
    specificationDigest: specification.digest,
    r131ContractDigest: boundary.r131Contract.digest,
    r131BundleDigest: boundary.r131Bundle.digest,
    inputBindingSchema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_INPUT_BINDING_SCHEMA,
    resultEnvelopeSchema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_RESULT_ENVELOPE_SCHEMA
  };
}

function expectedImplementationBoundary(capabilityId) {
  return {
    entrypointKind: capabilityId ===
      VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID
      ? 'INDEPENDENT_TRUST_ANCHOR_AUTHORITY'
      : 'RECEIPTED_SEND_RECEIVE_TRANSPORT',
    executionStatus: 'NOT_REQUESTED',
    externalContactMayOccurOnlyAfterExplicitAuthorization: true,
    foundationPlanetWritesRequested: false,
    persistenceRequested: false
  };
}

function expectedPermissions(capabilityId) {
  return capabilityId === VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID
    ? {
      requiredAuthoritySeatAcknowledged: true,
      providerSelfAttestationSufficient: false,
      candidateResolverMayControlProvider: false,
      alternateResolverMayControlProvider: false,
      providerMayInferConsent: false
    } : {
      requiredAuthoritySeatAcknowledged: true,
      providerSelfAttestationSufficient: false,
      exactPerRequestAuthorityRequired: true,
      exactRecipientConsentOrHostAuthorizationRequired: true,
      providerMayInferConsent: false
    };
}

function expectedResourceBudget(capabilityId) {
  return capabilityId === VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID
    ? {
      maximumRouteBindings: 1,
      maximumExternalRuntimeMs: 120000,
      maximumResultEnvelopeBytes: 262144,
      maximumAllowedIdentityProbesPerRoute: 1,
      maximumDeniedIdentityProbesPerRoute: 1,
      automaticRetryCount: 0
    } : {
      maximumRouteBindings: 1,
      maximumExternalRuntimeMs: 120000,
      maximumResultEnvelopeBytes: 262144,
      maximumSendAttemptsPerExactAuthorityReceipt: 1,
      maximumReceiverAcknowledgementsPerAttempt: 1,
      automaticRetryCount: 0
    };
}

function expectedFailureAndRecovery(capabilityId) {
  return capabilityId === VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID
    ? {
      failClosed: true,
      partialEvidenceMayEstablishAuthority: false,
      missingRevocationStateIsFailure: true,
      retryRequiresNewExplicitAuthority: true,
      noFoundationMutationOnFailure: true
    } : {
      failClosed: true,
      senderReceiptAloneMayProveDelivery: false,
      receiverReceiptAloneMayProveExactPayload: false,
      partialOrMismatchedReceiptMayVerifyProvider: false,
      retryRequiresNewExplicitAuthority: true,
      noFoundationMutationOnFailure: true
    };
}

function expectedLifecycle() {
  return {
    status: 'CANDIDATE_DECLARATION_UNTRUSTED',
    providerSelected: false,
    installed: false,
    available: false,
    executed: false,
    authorityEstablished: false,
    transportPerformed: false,
    promoted: false,
    canon: false
  };
}

function nativeSchemasValid(declaration, capabilityId, allSchemaCounts) {
  if (!Array.isArray(declaration.nativeReceiptSchemas) ||
      declaration.nativeReceiptSchemas.length >
        MAXIMUM_NATIVE_SCHEMAS_PER_DECLARATION) return false;
  const roles = capabilityId === VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID
    ? ['AUTHORITY_DECISION_RECEIPT'] : ['SENDER_RECEIPT', 'RECEIVER_RECEIPT'];
  if (declaration.nativeReceiptSchemas.length !== roles.length) return false;
  const schemas = declaration.nativeReceiptSchemas.map(item => item?.schema);
  return declaration.nativeReceiptSchemas.every((item, index) =>
    exactKeys(item, ['role', 'schema', 'trust']) && item.role === roles[index] &&
    schemaValid(item.schema) && item.trust ===
      'CALLER_DECLARED_UNVERIFIED' && allSchemaCounts.get(item.schema) === 1 &&
    ![
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATION_CONTRACT_RECEIPT_SCHEMA,
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_INPUT_BINDING_SCHEMA,
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_RESULT_ENVELOPE_SCHEMA,
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATION_SCHEMA,
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA
    ].includes(item.schema)) && new Set(schemas).size === schemas.length;
}

function declarationIssues(declaration, specification, boundary,
  allSchemaCounts, uniqueAuthorityProviderId) {
  const issues = [];
  if (!declaration || typeof declaration !== 'object' ||
      Array.isArray(declaration) || !exactKeys(declaration, [
        'schema', 'providerId', 'providerVersion', 'capabilityId',
        'providerClass', 'declarationTrust', 'specificationBinding',
        'nativeReceiptSchemas', 'implementationBoundary',
        'permissionsAndConsent', 'resourceBudget', 'failureAndRecovery',
        'verificationDeclaration', 'prerequisiteAuthorityProviderId',
        'lifecycle', 'digest'])) return ['DECLARATION_SHAPE_INVALID'];
  const unsigned = clone(declaration);
  delete unsigned.digest;
  if (declaration.schema !==
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_DECLARATION_SCHEMA ||
      declaration.digest !== stableDigest(unsigned)) {
    issues.push('DECLARATION_DIGEST_INVALID');
  }
  if (!providerIdValid(declaration.providerId) ||
      !providerVersionValid(declaration.providerVersion)) {
    issues.push('PROVIDER_ID_OR_VERSION_INVALID');
  }
  if (declaration.capabilityId !== specification.capabilityId ||
      declaration.providerClass !== specification.providerClass) {
    issues.push('CAPABILITY_OR_PROVIDER_CLASS_MISMATCH');
  }
  if (declaration.declarationTrust !== 'CALLER_SUPPLIED_UNTRUSTED') {
    issues.push('DECLARATION_TRUST_OVERCLAIM');
  }
  if (!exact(declaration.specificationBinding,
      expectedSpecificationBinding(specification, boundary))) {
    issues.push('SPECIFICATION_BINDING_MISMATCH');
  }
  if (!nativeSchemasValid(declaration, specification.capabilityId,
      allSchemaCounts)) issues.push('NATIVE_RECEIPT_SCHEMA_INVALID_OR_REUSED');
  if (!exact(declaration.implementationBoundary,
      expectedImplementationBoundary(specification.capabilityId))) {
    issues.push('IMPLEMENTATION_BOUNDARY_MISMATCH');
  }
  if (!exact(declaration.permissionsAndConsent,
      expectedPermissions(specification.capabilityId))) {
    issues.push('PERMISSION_OR_CONSENT_BOUNDARY_MISMATCH');
  }
  if (!exact(declaration.resourceBudget,
      expectedResourceBudget(specification.capabilityId))) {
    issues.push('RESOURCE_BUDGET_MISMATCH');
  }
  if (!exact(declaration.failureAndRecovery,
      expectedFailureAndRecovery(specification.capabilityId))) {
    issues.push('FAILURE_OR_RECOVERY_BOUNDARY_MISMATCH');
  }
  if (!exactKeys(declaration.verificationDeclaration, [
      'independentSecondaryVerifierId',
      'exactSpecificationAndBindingDigestReplayPlanned',
      'nativeReceiptSchemaValidationPlanned',
      'allowedAndDeniedIdentityProbesPlanned',
      'senderAndReceiverReceiptMatchPlanned',
      'independentIdentityAndAuthorityReceipt',
      'liveAvailabilityReceipt']) ||
      !providerIdValid(
        declaration.verificationDeclaration?.independentSecondaryVerifierId) ||
      declaration.verificationDeclaration.independentSecondaryVerifierId ===
        declaration.providerId ||
      declaration.verificationDeclaration
        .exactSpecificationAndBindingDigestReplayPlanned !== true ||
      declaration.verificationDeclaration
        .nativeReceiptSchemaValidationPlanned !== true ||
      declaration.verificationDeclaration.allowedAndDeniedIdentityProbesPlanned !==
        (specification.capabilityId ===
          VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID) ||
      declaration.verificationDeclaration.senderAndReceiverReceiptMatchPlanned !==
        (specification.capabilityId ===
          VERIFICATION_REQUEST_SEND_RECEIVE_CAPABILITY_ID) ||
      declaration.verificationDeclaration.independentIdentityAndAuthorityReceipt !==
        null || declaration.verificationDeclaration.liveAvailabilityReceipt !==
        null) issues.push('VERIFICATION_DECLARATION_INVALID');
  if (!exact(declaration.lifecycle, expectedLifecycle())) {
    issues.push('LIFECYCLE_OVERCLAIM');
  }
  if (specification.capabilityId ===
      VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID) {
    if (declaration.prerequisiteAuthorityProviderId !== null) {
      issues.push('AUTHORITY_PROVIDER_MAY_NOT_DEPEND_ON_DECLARED_AUTHORITY');
    }
  } else if (!providerIdValid(
      declaration.prerequisiteAuthorityProviderId) ||
      declaration.prerequisiteAuthorityProviderId !== uniqueAuthorityProviderId ||
      declaration.prerequisiteAuthorityProviderId === declaration.providerId) {
    issues.push('TRANSPORT_AUTHORITY_PROVIDER_REFERENCE_UNRESOLVED');
  }
  if (new TextEncoder().encode(JSON.stringify(declaration)).length >
      MAXIMUM_SERIALIZED_DECLARATION_BYTES) {
    issues.push('DECLARATION_RESOURCE_CEILING_EXCEEDED');
  }
  return [...new Set(issues)];
}

function expectedCandidateBinding(specification, declaration, boundary) {
  return {
    specificationOrdinal: specification.ordinal,
    capabilityId: specification.capabilityId,
    providerId: declaration.providerId,
    providerVersion: declaration.providerVersion,
    providerClass: declaration.providerClass,
    declarationDigest: declaration.digest,
    inputBindingDigests: clone(specification.coverage.inputBindingDigests),
    nativeReceiptSchemas: clone(declaration.nativeReceiptSchemas),
    prerequisiteAuthorityProviderId:
      declaration.prerequisiteAuthorityProviderId,
    trust: 'CALLER_SUPPLIED_COMPATIBLE_UNVERIFIED',
    selected: false,
    installed: false,
    available: false,
    executed: false,
    authorityEstablished: false,
    transportPerformed: false
  };
}

function schemaCounts(declarations) {
  const counts = new Map();
  declarations.forEach(declaration => {
    if (!Array.isArray(declaration?.nativeReceiptSchemas)) return;
    declaration.nativeReceiptSchemas.forEach(item => {
      if (typeof item?.schema !== 'string') return;
      counts.set(item.schema, (counts.get(item.schema) || 0) + 1);
    });
  });
  return counts;
}

function assessSpecification(specification, declarations, boundary,
  allSchemaCounts, uniqueAuthorityProviderId = null) {
  const declarationInputIndexes = declarations.map((item, index) =>
    item?.capabilityId === specification.capabilityId ? index : -1)
    .filter(index => index >= 0);
  const results = declarationInputIndexes.map(inputIndex => ({
    inputIndex,
    issues: declarationIssues(declarations[inputIndex], specification,
      boundary, allSchemaCounts, uniqueAuthorityProviderId)
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
    issueCodes.push('MULTIPLE_COMPATIBLE_PROVIDER_DECLARATIONS');
  }
  const declaration = compatible.length === 1
    ? declarations[compatible[0].inputIndex] : null;
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_ASSESSMENT_SCHEMA,
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
  const counts = schemaCounts(declarations);
  const authoritySpecification = boundary.r131Bundle.specifications.find(
    item => item.capabilityId === VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID);
  const transportSpecification = boundary.r131Bundle.specifications.find(
    item => item.capabilityId === VERIFICATION_REQUEST_SEND_RECEIVE_CAPABILITY_ID);
  const authorityAssessment = assessSpecification(authoritySpecification,
    declarations, boundary, counts, null);
  const uniqueAuthorityProviderId = authorityAssessment.status ===
    COMPATIBLE_ASSESSMENT_STATUS
    ? authorityAssessment.candidateBinding.providerId : null;
  const transportAssessment = assessSpecification(transportSpecification,
    declarations, boundary, counts, uniqueAuthorityProviderId);
  const assessments = [authorityAssessment, transportAssessment];
  const providerCandidates = assessments
    .filter(item => item.status === COMPATIBLE_ASSESSMENT_STATUS)
    .map(item => item.candidateBinding);
  const unassignedDeclarationInputIndexes = declarations.map((item, index) =>
    [VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
      VERIFICATION_REQUEST_SEND_RECEIVE_CAPABILITY_ID]
      .includes(item?.capabilityId) ? -1 : index).filter(index => index >= 0);
  const allCompatible = providerCandidates.length === 2 &&
    unassignedDeclarationInputIndexes.length === 0;
  const status = declarations.length === 0 ? EMPTY_STATUS
    : allCompatible ? COMPATIBLE_STATUS : BLOCKED_STATUS;
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_PREFLIGHT_SCHEMA,
    status,
    sourceContract: sourceRef(contract),
    sourceR131: {
      contract: sourceRef(boundary.r131Contract),
      bundle: sourceRef(boundary.r131Bundle)
    },
    declarationDigests: declarations.map(item => item?.digest || null),
    assessments,
    providerCandidates,
    unassignedDeclarationInputIndexes,
    summary: {
      specificationCount: assessments.length,
      declarationCount: declarations.length,
      compatibleCandidateCount: providerCandidates.length,
      ambiguousSpecificationCount: assessments.filter(item => item.status ===
        AMBIGUOUS_ASSESSMENT_STATUS).length,
      rejectedDeclarationCount: assessments.reduce((total, item) =>
        total + item.rejectedDeclarationInputIndexes.length, 0) +
        unassignedDeclarationInputIndexes.length,
      selectedProviderCount: 0,
      installedProviderCount: 0,
      availableProviderCount: 0,
      executedProviderCount: 0,
      authorityResolvedCount: 0,
      transportedRequestCount: 0
    },
    truth: {
      exactR131BoundaryBound: true,
      declarationCompatibilityEvaluated: true,
      compatibleCandidatesRemainCallerSuppliedUnverified:
        providerCandidates.length > 0,
      providerSelectionPerformed: false,
      providerInstallationPerformed: false,
      providerAvailabilityVerified: false,
      providerExecutionPerformed: false,
      nativeReceiptSchemasVerified: false,
      authorityTrustAnchorResolved: false,
      endpointResolved: false,
      recipientAuthenticated: false,
      contactAuthorized: false,
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

function declarationsBounded(declarations) {
  if (!Array.isArray(declarations) || declarations.length >
      MAXIMUM_DECLARATIONS) return false;
  return [VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
    VERIFICATION_REQUEST_SEND_RECEIVE_CAPABILITY_ID].every(capabilityId =>
    declarations.filter(item => item?.capabilityId === capabilityId).length <=
      MAXIMUM_DECLARATIONS_PER_CAPABILITY);
}

export function
createLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflight(
  contract, boundary, declarations = []) {
  if (!landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflightContractReceiptValid(
      contract, boundary) || !declarationsBounded(declarations)) {
    throw new Error('R132 preflight needs the exact contract, boundary, and bounded declarations');
  }
  const preflight = expectedPreflight(contract, boundary, declarations);
  if (new TextEncoder().encode(JSON.stringify(preflight)).length >
      MAXIMUM_SERIALIZED_PREFLIGHT_BYTES) {
    throw new Error('R132 provider binding preflight exceeds its resource ceiling');
  }
  return preflight;
}

export function
landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflightValid(
  preflight, contract, boundary, declarations = []) {
  return landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflightContractReceiptValid(
    contract, boundary) && declarationsBounded(declarations) &&
    new TextEncoder().encode(JSON.stringify(preflight)).length <=
      MAXIMUM_SERIALIZED_PREFLIGHT_BYTES &&
    exact(preflight, expectedPreflight(contract, boundary, declarations));
}

export function
matrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflightDescription() {
  return {
    status: 'EXPERIMENTAL',
    capabilityId:
      VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_PREFLIGHT_EVALUATE_CAPABILITY_ID,
    statement:
      'R132 exact-binds the R131 specifications and evaluates bounded caller-supplied authority and transport provider declarations without selecting, trusting, installing, or executing a provider.',
    boundaries: [
      'The current real declaration inventory is empty, so both specification assessments are missing and the current preflight is blocked.',
      'One structurally compatible declaration per capability remains caller-supplied and unverified; multiple compatible declarations remain ambiguous and none is selected.',
      'No native receipt schema is trusted, no provider availability or execution is verified, and no authority, endpoint, recipient, contact, transport, provider verification, evidence admission, persistence, owner/debit closure, promotion, canonization, or world mutation is produced.'
    ]
  };
}
