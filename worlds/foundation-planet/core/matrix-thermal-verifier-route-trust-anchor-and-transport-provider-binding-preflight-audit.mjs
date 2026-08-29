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

const CONTRACT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-provider-binding-preflight-contract-receipt/v1';
const DECLARATION_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-provider-declaration/v1';
const ASSESSMENT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-provider-binding-assessment/v1';
const PREFLIGHT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-provider-binding-preflight/v1';
const AUDIT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-verifier-route-trust-anchor-and-transport-provider-binding-preflight-audit/v1';
const CAPABILITY_ID =
  'contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.verifier-route.trust-anchor-and-transport.provider-binding.preflight.evaluate';
const EMPTY_STATUS =
  'VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_PREFLIGHT_BLOCKED_WITH_NO_DECLARATIONS';
const COMPATIBLE_STATUS =
  'VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_CANDIDATES_COMPATIBLE_UNVERIFIED';
const BLOCKED_STATUS =
  'VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_PREFLIGHT_BLOCKED';
const MISSING_STATUS = 'MISSING_PROVIDER_DECLARATION';
const COMPATIBLE_ASSESSMENT =
  'PROVIDER_DECLARATION_CONTRACT_COMPATIBLE_UNVERIFIED';
const REJECTED_STATUS = 'PROVIDER_DECLARATIONS_REJECTED';
const AMBIGUOUS_STATUS = 'AMBIGUOUS_PROVIDER_DECLARATIONS';
const AUTHORITY_EVIDENCE_ROLES = ['AUTHORITY_DECISION_RECEIPT'];
const TRANSPORT_EVIDENCE_ROLES = ['SENDER_RECEIPT', 'RECEIVER_RECEIPT'];
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

function digestValid(value, schema) {
  if (value?.schema !== schema || typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
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

function expectedContractUnsigned(boundary) {
  return {
    schema: CONTRACT_SCHEMA,
    status:
      'VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_PREFLIGHT_AVAILABLE',
    sourceR131: {
      contract: sourceRef(boundary.r131Contract),
      bundle: sourceRef(boundary.r131Bundle)
    },
    projection: {
      sourceSpecificationCount: boundary.r131Bundle.specifications.length,
      sourceInputBindingCount: boundary.r131Bundle.inputBindings.length,
      maximumProviderDeclarations: 4,
      maximumDeclarationsPerCapability: 2
    },
    schemas: {
      providerDeclaration: DECLARATION_SCHEMA,
      providerBindingAssessment: ASSESSMENT_SCHEMA,
      preflight: PREFLIGHT_SCHEMA
    },
    capabilityId: CAPABILITY_ID,
    resourceBudget: {
      maximumProviderDeclarations: 4,
      maximumDeclarationsPerCapability: 2,
      maximumNativeSchemasPerDeclaration: 2,
      maximumSerializedDeclarationBytes: 131072,
      maximumSerializedPreflightBytes: 524288
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

const implementationBoundary = capabilityId => ({
  entrypointKind: capabilityId === VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID
    ? 'INDEPENDENT_TRUST_ANCHOR_AUTHORITY'
    : 'RECEIPTED_SEND_RECEIVE_TRANSPORT',
  executionStatus: 'NOT_REQUESTED',
  externalContactMayOccurOnlyAfterExplicitAuthorization: true,
  foundationPlanetWritesRequested: false,
  persistenceRequested: false
});

const permissions = capabilityId => capabilityId ===
  VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID ? {
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

const resourceBudget = capabilityId => capabilityId ===
  VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID ? {
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

const failureAndRecovery = capabilityId => capabilityId ===
  VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID ? {
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

const lifecycle = () => ({
  status: 'CANDIDATE_DECLARATION_UNTRUSTED',
  providerSelected: false,
  installed: false,
  available: false,
  executed: false,
  authorityEstablished: false,
  transportPerformed: false,
  promoted: false,
  canon: false
});

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

function nativeSchemasValid(declaration, capabilityId, counts) {
  if (!Array.isArray(declaration.nativeReceiptSchemas) ||
      declaration.nativeReceiptSchemas.length > 2) return false;
  const roles = capabilityId === VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID
    ? AUTHORITY_EVIDENCE_ROLES : TRANSPORT_EVIDENCE_ROLES;
  const schemas = declaration.nativeReceiptSchemas.map(item => item?.schema);
  return declaration.nativeReceiptSchemas.length === roles.length &&
    declaration.nativeReceiptSchemas.every((item, index) =>
      exactKeys(item, ['role', 'schema', 'trust']) &&
      item.role === roles[index] && schemaValid(item.schema) &&
      item.trust === 'CALLER_DECLARED_UNVERIFIED' &&
      counts.get(item.schema) === 1 && ![
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATION_CONTRACT_RECEIPT_SCHEMA,
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_INPUT_BINDING_SCHEMA,
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_RESULT_ENVELOPE_SCHEMA,
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATION_SCHEMA,
        LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA
      ].includes(item.schema)) && new Set(schemas).size === schemas.length;
}

function declarationIssues(declaration, specification, boundary, counts,
  authorityProviderId) {
  const issues = [];
  if (!declaration || typeof declaration !== 'object' ||
      Array.isArray(declaration) || !exactKeys(declaration, [
        'schema', 'providerId', 'providerVersion', 'capabilityId',
        'providerClass', 'declarationTrust', 'specificationBinding',
        'nativeReceiptSchemas', 'implementationBoundary',
        'permissionsAndConsent', 'resourceBudget', 'failureAndRecovery',
        'verificationDeclaration', 'prerequisiteAuthorityProviderId',
        'lifecycle', 'digest'])) return ['DECLARATION_SHAPE_INVALID'];
  if (!digestValid(declaration, DECLARATION_SCHEMA)) {
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
  if (!nativeSchemasValid(declaration, specification.capabilityId, counts)) {
    issues.push('NATIVE_RECEIPT_SCHEMA_INVALID_OR_REUSED');
  }
  if (!exact(declaration.implementationBoundary,
      implementationBoundary(specification.capabilityId))) {
    issues.push('IMPLEMENTATION_BOUNDARY_MISMATCH');
  }
  if (!exact(declaration.permissionsAndConsent,
      permissions(specification.capabilityId))) {
    issues.push('PERMISSION_OR_CONSENT_BOUNDARY_MISMATCH');
  }
  if (!exact(declaration.resourceBudget,
      resourceBudget(specification.capabilityId))) {
    issues.push('RESOURCE_BUDGET_MISMATCH');
  }
  if (!exact(declaration.failureAndRecovery,
      failureAndRecovery(specification.capabilityId))) {
    issues.push('FAILURE_OR_RECOVERY_BOUNDARY_MISMATCH');
  }
  const verification = declaration.verificationDeclaration;
  if (!exactKeys(verification, ['independentSecondaryVerifierId',
      'exactSpecificationAndBindingDigestReplayPlanned',
      'nativeReceiptSchemaValidationPlanned',
      'allowedAndDeniedIdentityProbesPlanned',
      'senderAndReceiverReceiptMatchPlanned',
      'independentIdentityAndAuthorityReceipt',
      'liveAvailabilityReceipt']) ||
      !providerIdValid(verification?.independentSecondaryVerifierId) ||
      verification.independentSecondaryVerifierId === declaration.providerId ||
      verification.exactSpecificationAndBindingDigestReplayPlanned !== true ||
      verification.nativeReceiptSchemaValidationPlanned !== true ||
      verification.allowedAndDeniedIdentityProbesPlanned !==
        (specification.capabilityId ===
          VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID) ||
      verification.senderAndReceiverReceiptMatchPlanned !==
        (specification.capabilityId ===
          VERIFICATION_REQUEST_SEND_RECEIVE_CAPABILITY_ID) ||
      verification.independentIdentityAndAuthorityReceipt !== null ||
      verification.liveAvailabilityReceipt !== null) {
    issues.push('VERIFICATION_DECLARATION_INVALID');
  }
  if (!exact(declaration.lifecycle, lifecycle())) {
    issues.push('LIFECYCLE_OVERCLAIM');
  }
  if (specification.capabilityId ===
      VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID) {
    if (declaration.prerequisiteAuthorityProviderId !== null) {
      issues.push('AUTHORITY_PROVIDER_MAY_NOT_DEPEND_ON_DECLARED_AUTHORITY');
    }
  } else if (!providerIdValid(declaration.prerequisiteAuthorityProviderId) ||
      declaration.prerequisiteAuthorityProviderId !== authorityProviderId ||
      declaration.prerequisiteAuthorityProviderId === declaration.providerId) {
    issues.push('TRANSPORT_AUTHORITY_PROVIDER_REFERENCE_UNRESOLVED');
  }
  if (new TextEncoder().encode(JSON.stringify(declaration)).length > 131072) {
    issues.push('DECLARATION_RESOURCE_CEILING_EXCEEDED');
  }
  return [...new Set(issues)];
}

function candidateBinding(specification, declaration) {
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

function assess(specification, declarations, boundary, counts,
  authorityProviderId) {
  const indexes = declarations.map((item, index) =>
    item?.capabilityId === specification.capabilityId ? index : -1)
    .filter(index => index >= 0);
  const results = indexes.map(inputIndex => ({
    inputIndex,
    issues: declarationIssues(declarations[inputIndex], specification,
      boundary, counts, authorityProviderId)
  }));
  const compatible = results.filter(item => item.issues.length === 0);
  const issueCodes = [...new Set(results.flatMap(item => item.issues))].sort();
  let status = MISSING_STATUS;
  if (indexes.length > 0 && compatible.length === 0) status = REJECTED_STATUS;
  else if (compatible.length === 1) status = COMPATIBLE_ASSESSMENT;
  else if (compatible.length > 1) {
    status = AMBIGUOUS_STATUS;
    issueCodes.push('MULTIPLE_COMPATIBLE_PROVIDER_DECLARATIONS');
  }
  const declaration = compatible.length === 1
    ? declarations[compatible[0].inputIndex] : null;
  return withDigest({
    schema: ASSESSMENT_SCHEMA,
    specificationOrdinal: specification.ordinal,
    capabilityId: specification.capabilityId,
    providerClass: specification.providerClass,
    declarationInputIndexes: indexes,
    compatibleDeclarationInputIndexes:
      compatible.map(item => item.inputIndex),
    rejectedDeclarationInputIndexes:
      results.filter(item => item.issues.length > 0).map(item => item.inputIndex),
    status,
    issueCodes: [...new Set(issueCodes)].sort(),
    candidateBinding: declaration ? candidateBinding(specification, declaration) : null
  });
}

function expectedPreflightUnsigned(contract, boundary, declarations) {
  const counts = schemaCounts(declarations);
  const authoritySpec = boundary.r131Bundle.specifications.find(item =>
    item.capabilityId === VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID);
  const transportSpec = boundary.r131Bundle.specifications.find(item =>
    item.capabilityId === VERIFICATION_REQUEST_SEND_RECEIVE_CAPABILITY_ID);
  const authority = assess(authoritySpec, declarations, boundary, counts, null);
  const authorityProviderId = authority.status === COMPATIBLE_ASSESSMENT
    ? authority.candidateBinding.providerId : null;
  const transport = assess(transportSpec, declarations, boundary, counts,
    authorityProviderId);
  const assessments = [authority, transport];
  const candidates = assessments.filter(item => item.status ===
    COMPATIBLE_ASSESSMENT).map(item => item.candidateBinding);
  const unassigned = declarations.map((item, index) =>
    [VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
      VERIFICATION_REQUEST_SEND_RECEIVE_CAPABILITY_ID]
      .includes(item?.capabilityId) ? -1 : index).filter(index => index >= 0);
  const allCompatible = candidates.length === 2 && unassigned.length === 0;
  return {
    schema: PREFLIGHT_SCHEMA,
    status: declarations.length === 0 ? EMPTY_STATUS
      : allCompatible ? COMPATIBLE_STATUS : BLOCKED_STATUS,
    sourceContract: sourceRef(contract),
    sourceR131: {
      contract: sourceRef(boundary.r131Contract),
      bundle: sourceRef(boundary.r131Bundle)
    },
    declarationDigests: declarations.map(item => item?.digest || null),
    assessments,
    providerCandidates: candidates,
    unassignedDeclarationInputIndexes: unassigned,
    summary: {
      specificationCount: 2,
      declarationCount: declarations.length,
      compatibleCandidateCount: candidates.length,
      ambiguousSpecificationCount: assessments.filter(item => item.status ===
        AMBIGUOUS_STATUS).length,
      rejectedDeclarationCount: assessments.reduce((total, item) =>
        total + item.rejectedDeclarationInputIndexes.length, 0) +
        unassigned.length,
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
      compatibleCandidatesRemainCallerSuppliedUnverified: candidates.length > 0,
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
  };
}

function declarationsBounded(declarations) {
  return Array.isArray(declarations) && declarations.length <= 4 &&
    [VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
      VERIFICATION_REQUEST_SEND_RECEIVE_CAPABILITY_ID].every(capabilityId =>
      declarations.filter(item => item?.capabilityId === capabilityId).length <= 2);
}

function preflightValid(preflight, contract, boundary, declarations) {
  if (!contractValid(contract, boundary) || !declarationsBounded(declarations) ||
      !digestValid(preflight, PREFLIGHT_SCHEMA) ||
      new TextEncoder().encode(JSON.stringify(preflight)).length > 524288) {
    return false;
  }
  const unsigned = clone(preflight);
  delete unsigned.digest;
  return exact(unsigned, expectedPreflightUnsigned(contract, boundary,
    declarations));
}

export function
auditLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflight(
  contract, preflight, boundary, declarations = []) {
  const contractReconstructed = contractValid(contract, boundary);
  const preflightReconstructed = contractReconstructed &&
    preflightValid(preflight, contract, boundary, declarations);
  const audit = {
    schema: AUDIT_SCHEMA,
    status: preflightReconstructed ? 'PASS' : 'FAIL',
    sourceContract: contract?.schema === CONTRACT_SCHEMA
      ? sourceRef(contract) : null,
    sourcePreflight: preflight?.schema === PREFLIGHT_SCHEMA
      ? sourceRef(preflight) : null,
    verdicts: {
      exactR131BoundaryReconstructed: contractReconstructed,
      contractReconstructed,
      declarationsAndDigestsReconstructed: preflightReconstructed,
      assessmentsAndCandidatesReconstructed: preflightReconstructed,
      schemaPermissionBudgetRecoveryAndVerificationExact:
        preflightReconstructed,
      ambiguityPreserved: preflightReconstructed,
      selectionExecutionAuthorityAndTransportOverclaimsAbsent:
        preflightReconstructed
    },
    summary: {
      declarationCount: preflightReconstructed ? declarations.length : 0,
      candidateCount: preflightReconstructed
        ? preflight.providerCandidates.length : 0,
      selectedProviderCount: 0
    }
  };
  audit.digest = stableDigest(audit);
  return audit;
}
