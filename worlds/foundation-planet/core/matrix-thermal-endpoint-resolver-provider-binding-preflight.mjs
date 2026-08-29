import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_RESULT_ENVELOPE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverCapabilitySpecificationContractReceiptValid,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverCapabilitySpecificationBundleValid
} from './matrix-thermal-endpoint-resolver-capability-specification.mjs?v=0.126.0-r126.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_BINDING_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-binding-preflight-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_DECLARATION_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-declaration/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_BINDING_ASSESSMENT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-binding-assessment/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_BINDING_PREFLIGHT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-binding-preflight/v1';

export const
  HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_BINDING_PREFLIGHT_CAPABILITY_ID =
    'contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.provider-verification.endpoint-resolution.resolver-provider-binding.preflight';

const CONTRACT_STATUS =
  'ENDPOINT_RESOLVER_PROVIDER_BINDING_PREFLIGHT_CONTRACT_AVAILABLE';
const EMISSION_MODE =
  'transient-preflight-from-exact-r126-resolver-specification-and-caller-supplied-untrusted-declarations';
const MAXIMUM_DECLARATIONS = 2;
const MAXIMUM_SERIALIZED_DECLARATION_BYTES = 65536;
const MAXIMUM_REGISTRY_QUERIES_PER_REQUEST = 8;
const RESOLVER_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.endpoint.resolve';
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

function sourceCustodyValid(source) {
  return exactKeys(source, ['r126Contract', 'r126Bundle']) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverCapabilitySpecificationContractReceiptValid(
      source.r126Contract) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverCapabilitySpecificationBundleValid(
      source.r126Bundle) &&
    exact(source.r126Bundle.sourceContract, sourceRef(source.r126Contract));
}

function bindingSourceValid(source, contract = null) {
  const valid = exactKeys(source, ['r126Contract', 'r126Bundle']) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverCapabilitySpecificationContractReceiptValid(
      source.r126Contract) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverCapabilitySpecificationBundleValid(
      source.r126Bundle) &&
    exact(source.r126Bundle.sourceContract, sourceRef(source.r126Contract));
  return valid && (contract === null ||
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflightContractReceiptValid(
      contract) && exact(contract.sourceR126, {
      contract: sourceRef(source.r126Contract),
      bundle: sourceRef(source.r126Bundle)
    }));
}

const expectedContractTruth = () => ({
  exactR126ResolverSpecificationContractAndBundleBound: true,
  callerSuppliedResolverProviderDeclarationsAcceptedAsUntrustedData: true,
  resolverProviderDiscoveryImplemented: false,
  resolverProviderIdentityAuthenticated: false,
  resolverImplementationIntegrityVerified: false,
  resolverInstalled: false,
  resolverAvailable: false,
  nativeResolverReceiptSchemaVerified: false,
  liveAvailabilityProbePerformed: false,
  resolverAuthorityOrConsentVerified: false,
  resolverExecuted: false,
  endpointOrRecipientResolved: false,
  contactAuthorizedOrPerformed: false,
  challengeMaterialIssued: false,
  transportPerformed: false,
  providerVerificationPerformed: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  admissionAuthorized: false,
  persistencePerformed: false,
  worldMutationPerformed: false
});

function expectedContract(source) {
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_BINDING_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
    status: CONTRACT_STATUS,
    sourceR126: {
      contract: sourceRef(source.r126Contract),
      bundle: sourceRef(source.r126Bundle)
    },
    projection: {
      specificationCount: 1,
      sourceRequestPacketCount:
        source.r126Bundle.summary.sourceRequestPacketCount,
      resolverCapabilityId: RESOLVER_CAPABILITY_ID,
      providerDeclarationSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_DECLARATION_SCHEMA,
      providerBindingAssessmentSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_BINDING_ASSESSMENT_SCHEMA,
      providerBindingPreflightSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_BINDING_PREFLIGHT_SCHEMA,
      implementedContractCapabilityId:
        HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_BINDING_PREFLIGHT_CAPABILITY_ID
    },
    resourceBudget: {
      maximumDeclarations: MAXIMUM_DECLARATIONS,
      maximumSerializedDeclarationBytes:
        MAXIMUM_SERIALIZED_DECLARATION_BYTES,
      maximumRegistryQueriesPerRequest:
        MAXIMUM_REGISTRY_QUERIES_PER_REQUEST
    },
    emission: { mode: EMISSION_MODE },
    truth: expectedContractTruth()
  };
  receipt.digest = stableDigest(receipt);
  return receipt;
}

export function
landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflightContractReceiptValid(
  receipt, source = null) {
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_BINDING_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'sourceR126', 'projection',
        'resourceBudget', 'emission', 'truth', 'digest']) ||
      !exactKeys(receipt.sourceR126, ['contract', 'bundle']) ||
      !Object.values(receipt.sourceR126).every(ref => exactKeys(ref,
        ['schema', 'receiptDigest'])) ||
      receipt.sourceR126.contract.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_CONTRACT_RECEIPT_SCHEMA ||
      receipt.sourceR126.bundle.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA ||
      !exactKeys(receipt.projection, ['specificationCount',
        'sourceRequestPacketCount', 'resolverCapabilityId',
        'providerDeclarationSchema', 'providerBindingAssessmentSchema',
        'providerBindingPreflightSchema', 'implementedContractCapabilityId']) ||
      receipt.projection.specificationCount !== 1 ||
      !Number.isInteger(receipt.projection.sourceRequestPacketCount) ||
      receipt.projection.sourceRequestPacketCount < 0 ||
      receipt.projection.sourceRequestPacketCount > 15 ||
      receipt.projection.resolverCapabilityId !== RESOLVER_CAPABILITY_ID ||
      receipt.projection.providerDeclarationSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_DECLARATION_SCHEMA ||
      receipt.projection.providerBindingAssessmentSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_BINDING_ASSESSMENT_SCHEMA ||
      receipt.projection.providerBindingPreflightSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_BINDING_PREFLIGHT_SCHEMA ||
      receipt.projection.implementedContractCapabilityId !==
        HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_BINDING_PREFLIGHT_CAPABILITY_ID ||
      !exact(receipt.resourceBudget, {
        maximumDeclarations: MAXIMUM_DECLARATIONS,
        maximumSerializedDeclarationBytes:
          MAXIMUM_SERIALIZED_DECLARATION_BYTES,
        maximumRegistryQueriesPerRequest:
          MAXIMUM_REGISTRY_QUERIES_PER_REQUEST
      }) || !exact(receipt.emission, { mode: EMISSION_MODE }) ||
      receipt.status !== CONTRACT_STATUS ||
      !exact(receipt.truth, expectedContractTruth())) return false;
  return source === null || sourceCustodyValid(source) &&
    exact(receipt, expectedContract(source));
}

export function
createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflightContractReceipt(
  source) {
  if (!sourceCustodyValid(source)) {
    throw new Error(
      'Resolver-provider binding preflight needs the exact sealed R126 contract and bundle');
  }
  return expectedContract(source);
}

function declarationInputValid(declarations) {
  if (!Array.isArray(declarations) ||
      declarations.length > MAXIMUM_DECLARATIONS) return false;
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

function declarationReasonCodes(declaration, bundle) {
  const reasons = [];
  if (!exactKeys(declaration, ['schema', 'providerId', 'providerVersion',
      'capabilityId', 'providerClass', 'declarationTrust',
      'specificationBinding', 'outputBinding', 'executionBoundary',
      'permissionsAndConsent', 'resourceBudget', 'failureAndRecovery',
      'verificationDeclaration', 'lifecycle', 'digest'])) {
    return ['DECLARATION_SHAPE_INVALID'];
  }
  if (!digestValid(declaration,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_DECLARATION_SCHEMA)) {
    reasons.push('DECLARATION_DIGEST_INVALID');
  }
  if (!/^[a-z0-9][a-z0-9._-]{2,127}$/.test(declaration.providerId || '')) {
    reasons.push('PROVIDER_ID_INVALID');
  }
  if (!/^[0-9]+\.[0-9]+\.[0-9]+(?:-[a-z0-9.-]+)?$/.test(
      declaration.providerVersion || '')) {
    reasons.push('PROVIDER_VERSION_INVALID');
  }
  if (declaration.declarationTrust !== 'CALLER_SUPPLIED_UNTRUSTED') {
    reasons.push('DECLARATION_TRUST_OVERSTATED');
  }
  const specification = bundle.specification;
  if (declaration.capabilityId !== specification.capabilityId) {
    reasons.push('UNKNOWN_CAPABILITY');
    return [...new Set(reasons)].sort();
  }
  if (declaration.providerClass !== specification.providerClass) {
    reasons.push('PROVIDER_CLASS_MISMATCH');
  }
  if (!exactKeys(declaration.specificationBinding,
      ['specificationOrdinal', 'specificationCapabilityId',
        'specificationDigest', 'r126ContractDigest', 'r126BundleDigest']) ||
      declaration.specificationBinding.specificationOrdinal !==
        specification.ordinal ||
      declaration.specificationBinding.specificationCapabilityId !==
        specification.capabilityId ||
      declaration.specificationBinding.specificationDigest !==
        specification.digest ||
      declaration.specificationBinding.r126ContractDigest !==
        bundle.sourceContract.receiptDigest ||
      declaration.specificationBinding.r126BundleDigest !== bundle.digest) {
    reasons.push('SPECIFICATION_BINDING_MISMATCH');
  }
  const nativeSchema = declaration.outputBinding?.nativeResolverReceiptSchema;
  if (!exactKeys(declaration.outputBinding, ['resultEnvelopeSchema',
      'nativeResolverReceiptSchema', 'nativeResolverReceiptSchemaStatus',
      'requiredResultStatusCodes', 'requiredPreTransportProofIds']) ||
      declaration.outputBinding.resultEnvelopeSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_RESULT_ENVELOPE_SCHEMA ||
      typeof nativeSchema !== 'string' || nativeSchema.length > 256 ||
      !/\/v[1-9][0-9]*$/.test(nativeSchema) || nativeSchema ===
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_RESULT_ENVELOPE_SCHEMA ||
      declaration.outputBinding.nativeResolverReceiptSchemaStatus !==
        'CALLER_DECLARED_UNVERIFIED' ||
      !exact(declaration.outputBinding.requiredResultStatusCodes,
        specification.outputContract.requiredResultStatusCodes) ||
      !exact(declaration.outputBinding.requiredPreTransportProofIds,
        specification.outputContract.requiredPreTransportProofIds)) {
    reasons.push('OUTPUT_BINDING_INVALID');
  }
  if (!exact(declaration.executionBoundary, {
      entrypointKind: 'INDEPENDENT_ENDPOINT_RESOLVER',
      locatorStatus: 'CALLER_SUPPLIED_UNVERIFIED',
      externalRegistryReadsDeclared: true,
      resolverExecutionRequested: false,
      endpointHumanOrHostContactRequested: false,
      contactOrTransportRequested: false,
      foundationPlanetWritesRequested: false
    })) {
    reasons.push('EXECUTION_BOUNDARY_INVALID');
  }
  if (!exact(declaration.permissionsAndConsent, {
      exactAuthoritySeatPerRequestAcknowledged: true,
      selfAttestationSufficient: false,
      callerPolicyMaySelfAuthorizeContact: false,
      resolverMayGrantConsent: false,
      independentAuthorityAndConsentReceiptStatus:
        'MISSING_INDEPENDENT_VERIFICATION'
    })) {
    reasons.push('PERMISSION_BOUNDARY_INVALID');
  }
  if (!exactKeys(declaration.resourceBudget, ['maximumRuntimeMs',
      'maximumRequestBindings', 'maximumResultEnvelopeBytes',
      'maximumRegistryQueriesPerRequest']) ||
      !Number.isInteger(declaration.resourceBudget.maximumRuntimeMs) ||
      declaration.resourceBudget.maximumRuntimeMs < 1 ||
      declaration.resourceBudget.maximumRuntimeMs >
        specification.resourceBudget.maximumExternalRuntimeMs ||
      !Number.isInteger(declaration.resourceBudget.maximumRequestBindings) ||
      declaration.resourceBudget.maximumRequestBindings !==
        specification.resourceBudget.maximumRequestBindings ||
      !Number.isInteger(
        declaration.resourceBudget.maximumResultEnvelopeBytes) ||
      declaration.resourceBudget.maximumResultEnvelopeBytes < 1 ||
      declaration.resourceBudget.maximumResultEnvelopeBytes >
        specification.resourceBudget.maximumResultEnvelopeBytes ||
      !Number.isInteger(
        declaration.resourceBudget.maximumRegistryQueriesPerRequest) ||
      declaration.resourceBudget.maximumRegistryQueriesPerRequest < 1 ||
      declaration.resourceBudget.maximumRegistryQueriesPerRequest >
        MAXIMUM_REGISTRY_QUERIES_PER_REQUEST) {
    reasons.push('RESOURCE_BUDGET_INVALID');
  }
  if (!exact(declaration.failureAndRecovery, {
      failClosed: true,
      partialProofMayResolveEndpointOrAuthorizeContact: false,
      retryRequiresSameContractBatchRequestAndBindingDigests: true,
      noFoundationMutationOnFailure: true
    })) {
    reasons.push('FAILURE_RECOVERY_BOUNDARY_INVALID');
  }
  if (!exactKeys(declaration.verificationDeclaration,
      ['independentSecondaryVerifierId',
        'allowedAndDeniedIdentityProbesPlanned',
        'exactRequestAndBindingDigestReplayPlanned',
        'nativeResolverReceiptSchemaValidationPlanned',
        'independentIdentityAndAuthorityReceipt',
        'liveAvailabilityReceipt']) ||
      !/^[a-z0-9][a-z0-9._-]{2,127}$/.test(
        declaration.verificationDeclaration
          .independentSecondaryVerifierId || '') ||
      declaration.verificationDeclaration
        .allowedAndDeniedIdentityProbesPlanned !== true ||
      declaration.verificationDeclaration
        .exactRequestAndBindingDigestReplayPlanned !== true ||
      declaration.verificationDeclaration
        .nativeResolverReceiptSchemaValidationPlanned !== true ||
      declaration.verificationDeclaration
        .independentIdentityAndAuthorityReceipt !== null ||
      declaration.verificationDeclaration.liveAvailabilityReceipt !== null) {
    reasons.push('VERIFICATION_BOUNDARY_INVALID');
  }
  if (!exactKeys(declaration.lifecycle, ['status', 'resolverInstalled',
      'resolverAvailable', 'resolverExecuted', 'promoted', 'canon']) ||
      declaration.lifecycle.status !==
        'CANDIDATE_DECLARATION_UNTRUSTED' ||
      Object.entries(declaration.lifecycle).some(([key, value]) =>
        key !== 'status' && value !== false)) {
    reasons.push('LIFECYCLE_CLAIM_EXCEEDS_DECLARATION');
  }
  return [...new Set(reasons)].sort();
}

export function
landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderDeclarationValid(
  declaration, bundle) {
  return landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverCapabilitySpecificationBundleValid(
    bundle) && declarationReasonCodes(declaration, bundle).length === 0;
}

function assessmentFor(declaration, inputIndex, bundle) {
  const reasonCodes = declarationReasonCodes(declaration, bundle);
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_BINDING_ASSESSMENT_SCHEMA,
    inputIndex,
    capabilityId: typeof declaration?.capabilityId === 'string'
      ? declaration.capabilityId : null,
    providerId: typeof declaration?.providerId === 'string'
      ? declaration.providerId : null,
    providerVersion: reasonCodes.length === 0
      ? declaration.providerVersion : null,
    providerClass: reasonCodes.length === 0
      ? declaration.providerClass : null,
    declaredNativeResolverReceiptSchema: reasonCodes.length === 0
      ? declaration.outputBinding.nativeResolverReceiptSchema : null,
    declarationDigest: typeof declaration?.digest === 'string'
      ? declaration.digest : null,
    status: reasonCodes.length === 0
      ? 'CONTRACT_COMPATIBLE_UNVERIFIED' : 'REJECTED',
    reasonCodes,
    truth: {
      declarationTreatedAsUntrustedData: true,
      resolverProviderIdentityAuthenticated: false,
      resolverImplementationIntegrityVerified: false,
      resolverInstalled: false,
      resolverAvailable: false,
      nativeResolverReceiptSchemaVerified: false,
      authorityOrConsentVerified: false,
      resolverExecuted: false,
      endpointResolved: false
    }
  };
}

const compatibleBlockingReasons = () => [
  'ALLOWED_AND_DENIED_IDENTITY_PROBE_RECEIPTS_REQUIRED',
  'EXACT_REQUEST_AND_BINDING_DIGEST_REPLAY_RECEIPT_REQUIRED',
  'IMPLEMENTATION_INTEGRITY_RECEIPT_REQUIRED',
  'INDEPENDENT_RESOLVER_IDENTITY_AND_AUTHORITY_REQUIRED',
  'LIVE_AVAILABILITY_RECEIPT_REQUIRED',
  'NATIVE_RESOLVER_RECEIPT_SCHEMA_VALIDATION_REQUIRED',
  'PER_REQUEST_AUTHORITY_AND_CONSENT_RECEIPTS_REQUIRED_BEFORE_RESOLUTION'
];

function bindingFor(specification, assessments) {
  const relevant = assessments.filter(assessment =>
    assessment.capabilityId === specification.capabilityId);
  const compatible = relevant.filter(assessment =>
    assessment.status === 'CONTRACT_COMPATIBLE_UNVERIFIED');
  const rejected = relevant.filter(assessment =>
    assessment.status === 'REJECTED');
  let status = 'MISSING_RESOLVER_PROVIDER_DECLARATION';
  let blockingReasons = ['RESOLVER_PROVIDER_DECLARATION_REQUIRED'];
  if (compatible.length > 1) {
    status = 'AMBIGUOUS_COMPATIBLE_DECLARATIONS';
    blockingReasons = ['SINGLE_RESOLVER_PROVIDER_SELECTION_REQUIRED',
      ...compatibleBlockingReasons()];
  } else if (compatible.length === 1) {
    status = 'CONTRACT_COMPATIBLE_UNVERIFIED';
    blockingReasons = compatibleBlockingReasons();
  } else if (rejected.length > 0) {
    status = 'DECLARATION_REJECTED';
    blockingReasons = [...new Set(rejected.flatMap(assessment =>
      assessment.reasonCodes))].sort();
  }
  const selected = compatible.length === 1 ? compatible[0] : null;
  return {
    ordinal: specification.ordinal,
    capabilityId: specification.capabilityId,
    providerClass: specification.providerClass,
    declarationInputIndexes: relevant.map(assessment =>
      assessment.inputIndex),
    assessmentStatus: status,
    providerId: selected?.providerId || null,
    providerVersion: selected?.providerVersion || null,
    declaredNativeResolverReceiptSchema:
      selected?.declaredNativeResolverReceiptSchema || null,
    nativeResolverReceiptSchemaTrust: selected
      ? 'CALLER_SUPPLIED_UNVERIFIED' : null,
    declarationTrust: selected ? 'CALLER_SUPPLIED_UNTRUSTED' : null,
    operationalReadiness: 'BLOCKED',
    blockingReasons
  };
}

const expectedReportTruth = () => ({
  exactR126ResolverSpecificationContractAndBundleBound: true,
  callerSuppliedDeclarationsTreatedAsUntrustedData: true,
  contractCompatibilityMayEstablishResolverIdentity: false,
  contractCompatibilityMayVerifyImplementationIntegrity: false,
  contractCompatibilityMayEstablishInstallation: false,
  contractCompatibilityMayEstablishAvailability: false,
  contractCompatibilityMayVerifyNativeResolverReceiptSchema: false,
  contractCompatibilityMayGrantAuthorityOrConsent: false,
  preflightMayExecuteResolver: false,
  preflightMayResolveEndpointOrRecipient: false,
  preflightMayAuthorizeOrPerformContact: false,
  preflightMayIssueChallengeMaterial: false,
  preflightMayTransmitRequest: false,
  providerVerificationPerformed: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  admissionAuthorized: false,
  persistencePerformed: false,
  worldMutationPerformed: false
});

function expectedReport(contract, source, declarations) {
  const clonedDeclarations = clone(declarations);
  const assessments = clonedDeclarations.map((declaration, inputIndex) =>
    assessmentFor(declaration, inputIndex, source.r126Bundle));
  const binding = bindingFor(source.r126Bundle.specification, assessments);
  const compatibleCount = binding.assessmentStatus ===
    'CONTRACT_COMPATIBLE_UNVERIFIED' ? 1 : 0;
  const ambiguousCount = binding.assessmentStatus ===
    'AMBIGUOUS_COMPATIBLE_DECLARATIONS' ? 1 : 0;
  const rejectedCount = binding.assessmentStatus ===
    'DECLARATION_REJECTED' ? 1 : 0;
  const missingCount = binding.assessmentStatus ===
    'MISSING_RESOLVER_PROVIDER_DECLARATION' ? 1 : 0;
  const status = declarations.length === 0
    ? 'BLOCKED_NO_RESOLVER_PROVIDER_DECLARATIONS'
    : declarations.length === 1 && compatibleCount === 1
      ? 'BLOCKED_RESOLVER_PROVIDER_CONTRACT_COMPATIBLE_UNVERIFIED'
      : 'BLOCKED_RESOLVER_PROVIDER_BINDING_REJECTED_OR_AMBIGUOUS';
  const report = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_BINDING_PREFLIGHT_SCHEMA,
    status,
    sourceContract: sourceRef(contract),
    sourceR126: {
      contract: sourceRef(source.r126Contract),
      bundle: sourceRef(source.r126Bundle)
    },
    declarationInput: {
      declarationCount: clonedDeclarations.length,
      serializedInputDigest: stableDigest(clonedDeclarations),
      trust: 'CALLER_SUPPLIED_UNTRUSTED'
    },
    assessments,
    binding,
    summary: {
      specificationCount: 1,
      sourceRequestPacketCount:
        source.r126Bundle.summary.sourceRequestPacketCount,
      declarationCount: assessments.length,
      acceptedUnverifiedDeclarationCount: assessments.filter(assessment =>
        assessment.status === 'CONTRACT_COMPATIBLE_UNVERIFIED').length,
      rejectedDeclarationCount: assessments.filter(assessment =>
        assessment.status === 'REJECTED').length,
      unknownCapabilityDeclarationCount: assessments.filter(assessment =>
        assessment.reasonCodes.includes('UNKNOWN_CAPABILITY')).length,
      missingBindingCount: missingCount,
      rejectedBindingCount: rejectedCount,
      ambiguousBindingCount: ambiguousCount,
      contractCompatibleUnverifiedBindingCount: compatibleCount,
      operationallyReadyBindingCount: 0,
      resolverInstalledCount: 0,
      resolverAvailableCount: 0,
      resolvedEndpointCount: 0,
      authorizedContactCount: 0,
      transmittedRequestCount: 0,
      admissionReady: false
    },
    prohibitedConclusions: {
      treatDeclarationAsResolverIdentityOrAuthority: true,
      treatCompatibilityAsImplementationIntegrity: true,
      treatCompatibilityAsInstallationOrAvailability: true,
      treatDeclaredSchemaAsVerified: true,
      treatCandidateAsAuthorityOrConsent: true,
      executeResolveContactOrTransmitFromPreflight: true,
      admitEvidenceOwnerOrDebit: true,
      mutateFoundationPromoteOrCanonize: true
    },
    truth: expectedReportTruth()
  };
  report.digest = stableDigest(report);
  return report;
}

function assessmentShapeValid(assessment, index) {
  return exactKeys(assessment, ['schema', 'inputIndex', 'capabilityId',
    'providerId', 'providerVersion', 'providerClass',
    'declaredNativeResolverReceiptSchema', 'declarationDigest', 'status',
    'reasonCodes', 'truth']) && assessment.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_BINDING_ASSESSMENT_SCHEMA &&
    assessment.inputIndex === index && Array.isArray(assessment.reasonCodes) &&
    ['CONTRACT_COMPATIBLE_UNVERIFIED', 'REJECTED'].includes(
      assessment.status) && exactKeys(assessment.truth,
      ['declarationTreatedAsUntrustedData',
        'resolverProviderIdentityAuthenticated',
        'resolverImplementationIntegrityVerified', 'resolverInstalled',
        'resolverAvailable', 'nativeResolverReceiptSchemaVerified',
        'authorityOrConsentVerified', 'resolverExecuted',
        'endpointResolved']) &&
    assessment.truth.declarationTreatedAsUntrustedData === true &&
    Object.entries(assessment.truth).every(([key, value]) =>
      key === 'declarationTreatedAsUntrustedData' || value === false);
}

function bindingShapeValid(binding) {
  return exactKeys(binding, ['ordinal', 'capabilityId', 'providerClass',
    'declarationInputIndexes', 'assessmentStatus', 'providerId',
    'providerVersion', 'declaredNativeResolverReceiptSchema',
    'nativeResolverReceiptSchemaTrust', 'declarationTrust',
    'operationalReadiness', 'blockingReasons']) &&
    binding.ordinal === 1 && binding.capabilityId === RESOLVER_CAPABILITY_ID &&
    binding.providerClass === 'INDEPENDENT_ENDPOINT_RESOLVER' &&
    Array.isArray(binding.declarationInputIndexes) &&
    Array.isArray(binding.blockingReasons) &&
    binding.operationalReadiness === 'BLOCKED' &&
    (binding.nativeResolverReceiptSchemaTrust === null ||
      binding.nativeResolverReceiptSchemaTrust ===
        'CALLER_SUPPLIED_UNVERIFIED') &&
    ['MISSING_RESOLVER_PROVIDER_DECLARATION', 'DECLARATION_REJECTED',
      'AMBIGUOUS_COMPATIBLE_DECLARATIONS',
      'CONTRACT_COMPATIBLE_UNVERIFIED'].includes(binding.assessmentStatus);
}

export function
landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflightValid(
  report, contract = null, source = null, declarations = null) {
  if (!digestValid(report,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_BINDING_PREFLIGHT_SCHEMA) ||
      !exactKeys(report, ['schema', 'status', 'sourceContract', 'sourceR126',
        'declarationInput', 'assessments', 'binding', 'summary',
        'prohibitedConclusions', 'truth', 'digest']) ||
      !exactKeys(report.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(report.sourceR126, ['contract', 'bundle']) ||
      !Object.values(report.sourceR126).every(ref => exactKeys(ref,
        ['schema', 'receiptDigest'])) ||
      !exactKeys(report.declarationInput, ['declarationCount',
        'serializedInputDigest', 'trust']) ||
      report.declarationInput.trust !== 'CALLER_SUPPLIED_UNTRUSTED' ||
      !Array.isArray(report.assessments) ||
      report.assessments.length > MAXIMUM_DECLARATIONS ||
      !report.assessments.every(assessmentShapeValid) ||
      !bindingShapeValid(report.binding) ||
      !exactKeys(report.summary, ['specificationCount',
        'sourceRequestPacketCount', 'declarationCount',
        'acceptedUnverifiedDeclarationCount', 'rejectedDeclarationCount',
        'unknownCapabilityDeclarationCount', 'missingBindingCount',
        'rejectedBindingCount', 'ambiguousBindingCount',
        'contractCompatibleUnverifiedBindingCount',
        'operationallyReadyBindingCount', 'resolverInstalledCount',
        'resolverAvailableCount', 'resolvedEndpointCount',
        'authorizedContactCount', 'transmittedRequestCount',
        'admissionReady']) || report.summary.specificationCount !== 1 ||
      !Number.isInteger(report.summary.sourceRequestPacketCount) ||
      report.summary.sourceRequestPacketCount < 0 ||
      report.summary.sourceRequestPacketCount > 15 ||
      report.summary.operationallyReadyBindingCount !== 0 ||
      report.summary.resolverInstalledCount !== 0 ||
      report.summary.resolverAvailableCount !== 0 ||
      report.summary.resolvedEndpointCount !== 0 ||
      report.summary.authorizedContactCount !== 0 ||
      report.summary.transmittedRequestCount !== 0 ||
      report.summary.admissionReady !== false ||
      !exactKeys(report.prohibitedConclusions,
        ['treatDeclarationAsResolverIdentityOrAuthority',
          'treatCompatibilityAsImplementationIntegrity',
          'treatCompatibilityAsInstallationOrAvailability',
          'treatDeclaredSchemaAsVerified',
          'treatCandidateAsAuthorityOrConsent',
          'executeResolveContactOrTransmitFromPreflight',
          'admitEvidenceOwnerOrDebit',
          'mutateFoundationPromoteOrCanonize']) ||
      !Object.values(report.prohibitedConclusions).every(value =>
        value === true) || !exact(report.truth, expectedReportTruth())) {
    return false;
  }
  if (contract === null && source === null && declarations === null) {
    return true;
  }
  return contract !== null && source !== null && declarations !== null &&
    bindingSourceValid(source, contract) &&
    declarationInputValid(declarations) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflightContractReceiptValid(
      contract) && exact(report,
      expectedReport(contract, source, declarations));
}

export function
createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflight(
  contract, source, declarations = []) {
  if (!bindingSourceValid(source, contract) ||
      !landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflightContractReceiptValid(
        contract) || !declarationInputValid(declarations)) {
    throw new Error(
      'Resolver-provider binding preflight needs the exact R127 contract, exact R126 specification custody, and bounded caller-supplied untrusted declarations');
  }
  return expectedReport(contract, source, declarations);
}

export function
matrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflightDescription() {
  return {
    status: 'EXPERIMENTAL',
    capabilityId:
      HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_BINDING_PREFLIGHT_CAPABILITY_ID,
    statement:
      'R127 accepts bounded caller-supplied endpoint-resolver provider declarations for the exact R126 specification, rejects incompatible bindings, and labels one compatible declaration unverified without claiming resolver identity, implementation, installation, availability, authority, resolution, or transport.',
    boundaries: [
      'The current built-in declaration inventory is empty, so the one resolver-provider binding remains blocked.',
      'A compatible declaration supplies candidate metadata only; independent identity and authority, implementation integrity, live availability, native-schema validation, allowed and denied identity probes, exact digest replay, and per-request authority and consent receipts remain required.',
      'No discovery, installation, execution, endpoint or recipient resolution, contact, challenge, transport, provider verification, evidence admission, owner/debit closure, persistence, promotion, canonization, or world mutation is performed.'
    ]
  };
}
