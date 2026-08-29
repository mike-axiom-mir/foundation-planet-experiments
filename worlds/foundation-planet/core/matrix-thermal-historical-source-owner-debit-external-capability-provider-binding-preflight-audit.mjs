import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_RESULT_ENVELOPE_SCHEMA,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilitySpecificationContractReceiptValid,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilitySpecificationBundleValid
} from './matrix-thermal-historical-source-owner-debit-external-capability-specification.mjs?v=0.121.0-r121.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_BINDING_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_BINDING_DECLARATION_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_BINDING_ASSESSMENT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_BINDING_PREFLIGHT_SCHEMA,
  HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_BINDING_PREFLIGHT_CAPABILITY_ID
} from './matrix-thermal-historical-source-owner-debit-external-capability-provider-binding-preflight.mjs?v=0.122.0-r122.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_BINDING_PREFLIGHT_AUDIT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-binding-preflight-audit/v1';

const MAXIMUM_DECLARATIONS = 30;
const MAXIMUM_SERIALIZED_DECLARATION_BYTES = 262144;
const MAXIMUM_AUTHORITY_BINDING_BYTES = 1024 * 1024;
const MAXIMUM_RUNTIME_MS = 120000;
const EMISSION_MODE =
  'transient-preflight-from-exact-r121-specifications-and-caller-supplied-untrusted-declarations';
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

function sourceCustodyValid(source) {
  return exactKeys(source, ['r121Contract', 'r121Specifications',
    'r121Sources']) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilitySpecificationContractReceiptValid(
      source.r121Contract, source.r121Sources) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilitySpecificationBundleValid(
      source.r121Specifications, source.r121Contract, source.r121Sources);
}

function expectedContract(source) {
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_BINDING_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
    status:
      'EXTERNAL_CAPABILITY_PROVIDER_BINDING_PREFLIGHT_CONTRACT_AVAILABLE',
    sourceR121: {
      contract: sourceRef(source.r121Contract),
      specifications: sourceRef(source.r121Specifications)
    },
    projection: {
      specificationCount: 15,
      providerBindingDeclarationSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_BINDING_DECLARATION_SCHEMA,
      providerBindingAssessmentSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_BINDING_ASSESSMENT_SCHEMA,
      providerBindingPreflightSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_BINDING_PREFLIGHT_SCHEMA,
      implementedContractCapabilityId:
        HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_BINDING_PREFLIGHT_CAPABILITY_ID
    },
    resourceBudget: {
      maximumDeclarations: MAXIMUM_DECLARATIONS,
      maximumSerializedDeclarationBytes:
        MAXIMUM_SERIALIZED_DECLARATION_BYTES,
      maximumRuntimeMsPerDeclaration: MAXIMUM_RUNTIME_MS
    },
    emission: { mode: EMISSION_MODE },
    truth: {
      exactR121SpecificationContractAndBundleBound: true,
      callerSuppliedProviderDeclarationsAcceptedAsUntrustedData: true,
      providerDiscoveryImplemented: false,
      providerIdentityAuthenticated: false,
      providerInstalled: false,
      providerAvailable: false,
      nativeReceiptSchemaVerified: false,
      liveAvailabilityProbePerformed: false,
      consentOrAuthorityVerified: false,
      evidenceAuthenticated: false,
      hostAuthorityEstablished: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      admissionAuthorized: false,
      endpointResolved: false,
      transportPerformed: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  };
  receipt.digest = stableDigest(receipt);
  return receipt;
}

function expectedEntrypointKind(spec) {
  if (spec.providerClass === 'MIKE_TOBI_OR_AXM_REVIEW_SEAT') {
    return 'HUMAN_REVIEW_SEAT';
  }
  if (spec.providerClass === 'HOST_GOVERNANCE_AUTHORITY') {
    return 'HOST_GOVERNANCE_HANDOFF';
  }
  return 'EXTERNAL_EVIDENCE_SERVICE';
}

function declarationReasons(declaration, specifications) {
  const reasons = [];
  if (!exactKeys(declaration, ['schema', 'providerId', 'providerVersion',
      'capabilityId', 'providerClass', 'declarationTrust',
      'specificationBinding', 'outputBinding', 'executionBoundary',
      'permissionsAndConsent', 'resourceBudget', 'failureAndRecovery',
      'verificationDeclaration', 'lifecycle', 'digest'])) {
    return ['DECLARATION_SHAPE_INVALID'];
  }
  const unsigned = clone(declaration);
  delete unsigned.digest;
  if (declaration.schema !==
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_BINDING_DECLARATION_SCHEMA ||
      declaration.digest !== stableDigest(unsigned)) {
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
  const spec = specifications.specifications.find(candidate =>
    candidate.capabilityId === declaration.capabilityId);
  if (!spec) {
    reasons.push('UNKNOWN_CAPABILITY');
    return [...new Set(reasons)].sort();
  }
  if (declaration.providerClass !== spec.providerClass) {
    reasons.push('PROVIDER_CLASS_MISMATCH');
  }
  if (!exactKeys(declaration.specificationBinding,
      ['specificationOrdinal', 'specificationCapabilityId',
        'specificationDigest']) ||
      declaration.specificationBinding.specificationOrdinal !== spec.ordinal ||
      declaration.specificationBinding.specificationCapabilityId !==
        spec.capabilityId ||
      declaration.specificationBinding.specificationDigest !==
        stableDigest(spec)) {
    reasons.push('SPECIFICATION_BINDING_MISMATCH');
  }
  const nativeSchema = declaration.outputBinding?.nativeReceiptSchema;
  if (!exactKeys(declaration.outputBinding, ['resultEnvelopeSchema',
      'nativeReceiptSchema', 'nativeReceiptSchemaStatus']) ||
      declaration.outputBinding.resultEnvelopeSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_RESULT_ENVELOPE_SCHEMA ||
      typeof nativeSchema !== 'string' || nativeSchema.length > 256 ||
      !/\/v[1-9][0-9]*$/.test(nativeSchema) ||
      nativeSchema ===
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_RESULT_ENVELOPE_SCHEMA ||
      declaration.outputBinding.nativeReceiptSchemaStatus !==
        'CALLER_DECLARED_UNVERIFIED') {
    reasons.push('OUTPUT_BINDING_INVALID');
  }
  const entrypoint = expectedEntrypointKind(spec);
  if (!exactKeys(declaration.executionBoundary, ['entrypointKind',
      'locatorStatus', 'transportRequired', 'externalSideEffectsDeclared',
      'foundationPlanetWritesRequested']) ||
      declaration.executionBoundary.entrypointKind !== entrypoint ||
      declaration.executionBoundary.locatorStatus !==
        'CALLER_SUPPLIED_UNVERIFIED' ||
      declaration.executionBoundary.transportRequired !==
        (entrypoint !== 'HUMAN_REVIEW_SEAT') ||
      declaration.executionBoundary.externalSideEffectsDeclared !==
        spec.sideEffects.externalHostSideEffectsExpected ||
      declaration.executionBoundary.foundationPlanetWritesRequested !==
        false) {
    reasons.push('EXECUTION_BOUNDARY_INVALID');
  }
  if (!exactKeys(declaration.permissionsAndConsent, ['requiredAuthoritySeat',
      'selfAttestationSufficient', 'callerPolicyMaySelfAuthorize',
      'consentOrAuthorityReceiptStatus']) ||
      declaration.permissionsAndConsent.requiredAuthoritySeat !==
        spec.permissionsAndConsent.requiredAuthoritySeat ||
      declaration.permissionsAndConsent.selfAttestationSufficient !== false ||
      declaration.permissionsAndConsent.callerPolicyMaySelfAuthorize !==
        false ||
      declaration.permissionsAndConsent.consentOrAuthorityReceiptStatus !==
        'MISSING_INDEPENDENT_VERIFICATION') {
    reasons.push('PERMISSION_BOUNDARY_INVALID');
  }
  const maximumBytes = spec.resourceBudget.maximumPackageBytes > 0
    ? spec.resourceBudget.maximumPackageBytes
    : MAXIMUM_AUTHORITY_BINDING_BYTES;
  if (!exactKeys(declaration.resourceBudget, ['maximumRuntimeMs',
      'maximumInputBytes', 'maximumOutputBytes']) ||
      !Number.isInteger(declaration.resourceBudget.maximumRuntimeMs) ||
      declaration.resourceBudget.maximumRuntimeMs < 1 ||
      declaration.resourceBudget.maximumRuntimeMs > MAXIMUM_RUNTIME_MS ||
      !Number.isInteger(declaration.resourceBudget.maximumInputBytes) ||
      declaration.resourceBudget.maximumInputBytes < 1 ||
      declaration.resourceBudget.maximumInputBytes > maximumBytes ||
      !Number.isInteger(declaration.resourceBudget.maximumOutputBytes) ||
      declaration.resourceBudget.maximumOutputBytes < 1 ||
      declaration.resourceBudget.maximumOutputBytes > maximumBytes) {
    reasons.push('RESOURCE_BUDGET_INVALID');
  }
  if (!exactKeys(declaration.failureAndRecovery, ['failClosed',
      'partialResultMayAuthorize', 'retryRequiresSameSpecificationBinding',
      'noFoundationMutationOnFailure']) ||
      declaration.failureAndRecovery.failClosed !== true ||
      declaration.failureAndRecovery.partialResultMayAuthorize !== false ||
      declaration.failureAndRecovery.retryRequiresSameSpecificationBinding !==
        true ||
      declaration.failureAndRecovery.noFoundationMutationOnFailure !== true) {
    reasons.push('FAILURE_RECOVERY_BOUNDARY_INVALID');
  }
  if (!exactKeys(declaration.verificationDeclaration,
      ['independentSecondaryVerifierId',
        'allowedAndDeniedIdentityProbesPlanned',
        'nativeReceiptSchemaValidationPlanned', 'liveAvailabilityReceipt',
        'authorizationOrConsentReceipt']) ||
      !/^[a-z0-9][a-z0-9._-]{2,127}$/.test(
        declaration.verificationDeclaration
          .independentSecondaryVerifierId || '') ||
      declaration.verificationDeclaration
        .allowedAndDeniedIdentityProbesPlanned !==
          spec.verificationContract.allowedAndDeniedIdentityProbesRequired ||
      declaration.verificationDeclaration
        .nativeReceiptSchemaValidationPlanned !== true ||
      declaration.verificationDeclaration.liveAvailabilityReceipt !== null ||
      declaration.verificationDeclaration
        .authorizationOrConsentReceipt !== null) {
    reasons.push('VERIFICATION_BOUNDARY_INVALID');
  }
  if (!exactKeys(declaration.lifecycle, ['status', 'providerInstalled',
      'providerAvailable', 'promoted', 'canon']) ||
      declaration.lifecycle.status !==
        'CANDIDATE_DECLARATION_UNTRUSTED' ||
      Object.entries(declaration.lifecycle).some(([key, value]) =>
        key !== 'status' && value !== false)) {
    reasons.push('LIFECYCLE_CLAIM_EXCEEDS_DECLARATION');
  }
  return [...new Set(reasons)].sort();
}

function expectedAssessment(declaration, inputIndex, specifications) {
  const reasonCodes = declarationReasons(declaration, specifications);
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_BINDING_ASSESSMENT_SCHEMA,
    inputIndex,
    capabilityId: typeof declaration?.capabilityId === 'string'
      ? declaration.capabilityId : null,
    providerId: typeof declaration?.providerId === 'string'
      ? declaration.providerId : null,
    providerClass: reasonCodes.length === 0
      ? declaration.providerClass : null,
    declaredNativeReceiptSchema: reasonCodes.length === 0
      ? declaration.outputBinding.nativeReceiptSchema : null,
    declarationDigest: typeof declaration?.digest === 'string'
      ? declaration.digest : null,
    status: reasonCodes.length === 0
      ? 'CONTRACT_COMPATIBLE_UNVERIFIED' : 'REJECTED',
    reasonCodes,
    truth: {
      declarationTreatedAsUntrustedData: true,
      providerIdentityAuthenticated: false,
      providerInstalled: false,
      providerAvailable: false,
      nativeReceiptSchemaVerified: false,
      authorityOrConsentVerified: false
    }
  };
}

function expectedBinding(spec, assessments) {
  const relevant = assessments.filter(assessment =>
    assessment.capabilityId === spec.capabilityId);
  const compatible = relevant.filter(assessment =>
    assessment.status === 'CONTRACT_COMPATIBLE_UNVERIFIED');
  const rejected = relevant.filter(assessment =>
    assessment.status === 'REJECTED');
  let status = 'MISSING_PROVIDER_DECLARATION';
  let blockingReasons = ['PROVIDER_DECLARATION_REQUIRED'];
  if (compatible.length > 1) {
    status = 'AMBIGUOUS_COMPATIBLE_DECLARATIONS';
    blockingReasons = ['SINGLE_PROVIDER_SELECTION_REQUIRED',
      'INDEPENDENT_PROVIDER_IDENTITY_REQUIRED',
      'LIVE_AVAILABILITY_RECEIPT_REQUIRED',
      'AUTHORIZATION_OR_CONSENT_RECEIPT_REQUIRED',
      'NATIVE_RECEIPT_SCHEMA_VALIDATION_REQUIRED'];
  } else if (compatible.length === 1) {
    status = 'CONTRACT_COMPATIBLE_UNVERIFIED';
    blockingReasons = ['INDEPENDENT_PROVIDER_IDENTITY_REQUIRED',
      'LIVE_AVAILABILITY_RECEIPT_REQUIRED',
      'AUTHORIZATION_OR_CONSENT_RECEIPT_REQUIRED',
      'NATIVE_RECEIPT_SCHEMA_VALIDATION_REQUIRED'];
  } else if (rejected.length > 0) {
    status = 'DECLARATION_REJECTED';
    blockingReasons = [...new Set(rejected.flatMap(assessment =>
      assessment.reasonCodes))].sort();
  }
  const selected = compatible.length === 1 ? compatible[0] : null;
  return {
    ordinal: spec.ordinal,
    capabilityId: spec.capabilityId,
    providerClass: spec.providerClass,
    declarationInputIndexes: relevant.map(assessment =>
      assessment.inputIndex),
    assessmentStatus: status,
    providerId: selected?.providerId || null,
    declaredNativeReceiptSchema:
      selected?.declaredNativeReceiptSchema || null,
    nativeReceiptSchemaTrust: selected
      ? 'CALLER_SUPPLIED_UNVERIFIED' : null,
    declarationTrust: selected ? 'CALLER_SUPPLIED_UNTRUSTED' : null,
    operationalReadiness: 'BLOCKED',
    blockingReasons
  };
}

function expectedReport(contract, source, declarations) {
  const cloned = clone(declarations);
  const assessments = cloned.map((declaration, inputIndex) =>
    expectedAssessment(declaration, inputIndex, source.r121Specifications));
  const bindings = source.r121Specifications.specifications.map(spec =>
    expectedBinding(spec, assessments));
  const compatibleCount = bindings.filter(binding =>
    binding.assessmentStatus ===
      'CONTRACT_COMPATIBLE_UNVERIFIED').length;
  const ambiguousCount = bindings.filter(binding =>
    binding.assessmentStatus ===
      'AMBIGUOUS_COMPATIBLE_DECLARATIONS').length;
  const rejectedCount = bindings.filter(binding =>
    binding.assessmentStatus === 'DECLARATION_REJECTED').length;
  const missingCount = bindings.filter(binding =>
    binding.assessmentStatus === 'MISSING_PROVIDER_DECLARATION').length;
  const report = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_BINDING_PREFLIGHT_SCHEMA,
    status: declarations.length === 0
      ? 'BLOCKED_NO_PROVIDER_DECLARATIONS'
      : compatibleCount === 15 && ambiguousCount === 0 &&
          rejectedCount === 0 && missingCount === 0
        ? 'BLOCKED_ALL_BINDINGS_CONTRACT_COMPATIBLE_BUT_UNVERIFIED'
        : 'BLOCKED_PROVIDER_BINDINGS_MISSING_REJECTED_OR_AMBIGUOUS',
    sourceContract: sourceRef(contract),
    sourceR121: {
      contract: sourceRef(source.r121Contract),
      specifications: sourceRef(source.r121Specifications)
    },
    declarationInput: {
      declarationCount: cloned.length,
      serializedInputDigest: stableDigest(cloned),
      trust: 'CALLER_SUPPLIED_UNTRUSTED'
    },
    assessments,
    bindings,
    summary: {
      specificationCount: 15,
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
      providerInstalledCount: 0,
      providerAvailableCount: 0,
      admissionReady: false
    },
    prohibitedConclusions: {
      treatDeclarationAsProviderIdentity: true,
      treatCompatibilityAsInstallation: true,
      treatCompatibilityAsAvailability: true,
      treatDeclaredSchemaAsVerified: true,
      treatCallerReceiptAsAuthorityOrConsent: true,
      executeOrTransmitFromPreflight: true,
      admitEvidenceOwnerOrDebit: true,
      mutateFoundationOrCanon: true
    },
    truth: {
      exactR121SpecificationContractAndBundleBound: true,
      callerSuppliedDeclarationsTreatedAsUntrustedData: true,
      contractCompatibilityMayEstablishProviderIdentity: false,
      contractCompatibilityMayEstablishProviderInstallation: false,
      contractCompatibilityMayEstablishProviderAvailability: false,
      contractCompatibilityMayVerifyNativeReceiptSchema: false,
      contractCompatibilityMayGrantAuthorityOrConsent: false,
      preflightMayExecuteProvider: false,
      preflightMayTransmitRequest: false,
      evidenceAuthenticated: false,
      hostAuthorityEstablished: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      admissionAuthorized: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  };
  report.digest = stableDigest(report);
  return report;
}

export function
auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderBindingPreflight(
  contract, report, custody, declarations = []) {
  const exactSource = sourceCustodyValid(custody);
  const expectedContractValue = exactSource ? expectedContract(custody) : null;
  const contractExact = exactSource && exact(contract, expectedContractValue);
  const source = exactSource ? {
    r121Contract: custody.r121Contract,
    r121Specifications: custody.r121Specifications
  } : null;
  let boundedDeclarations = false;
  try {
    const text = JSON.stringify(declarations);
    boundedDeclarations = Array.isArray(declarations) &&
      declarations.length <= MAXIMUM_DECLARATIONS &&
      new TextEncoder().encode(text).length <=
        MAXIMUM_SERIALIZED_DECLARATION_BYTES &&
      exact(declarations, JSON.parse(text));
  } catch {
    boundedDeclarations = false;
  }
  const expectedReportValue = contractExact && boundedDeclarations
    ? expectedReport(expectedContractValue, source, declarations) : null;
  const reportExact = expectedReportValue !== null &&
    exact(report, expectedReportValue);
  const checks = {
    exactR121SourceBundleValid: exactSource,
    contractIndependentlyReconstructed: contractExact,
    boundedDeclarationInputBoundByDigest: reportExact &&
      report.declarationInput.serializedInputDigest ===
        stableDigest(clone(declarations)),
    declarationAssessmentsIndependentlyReconstructed: reportExact &&
      report.assessments.length === declarations.length,
    fifteenBindingsIndependentlyReconstructed: reportExact &&
      report.bindings.length === 15,
    compatibleDeclarationsRemainUnverified: reportExact &&
      report.bindings.every(binding =>
        binding.operationalReadiness === 'BLOCKED'),
    providerReadinessRemainsZero: reportExact &&
      report.summary.operationallyReadyBindingCount === 0 &&
      report.summary.providerInstalledCount === 0 &&
      report.summary.providerAvailableCount === 0 &&
      report.summary.admissionReady === false,
    prohibitedConclusionsFailClosed: reportExact &&
      Object.values(report.prohibitedConclusions).every(value =>
        value === true),
    reportIndependentlyReconstructed: reportExact
  };
  const pass = Object.values(checks).every(value => value === true);
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_BINDING_PREFLIGHT_AUDIT_SCHEMA,
    status: pass ? 'PASS' : 'FAIL',
    checks,
    detail: {
      declarationCount: reportExact ? report.summary.declarationCount : 0,
      compatibleUnverifiedBindingCount: reportExact
        ? report.summary.contractCompatibleUnverifiedBindingCount : 0,
      missingBindingCount: reportExact
        ? report.summary.missingBindingCount : 15,
      rejectedDeclarationCount: reportExact
        ? report.summary.rejectedDeclarationCount : 0,
      ambiguousBindingCount: reportExact
        ? report.summary.ambiguousBindingCount : 0,
      operationallyReadyBindingCount: 0
    },
    truth: {
      auditReconstructedR122WithoutCallingR122BuildersOrValidators: true,
      auditMayDiscoverInstallOrExecuteProvider: false,
      auditMayAuthenticateIdentityEvidenceAuthorityOrConsent: false,
      auditMayResolveHistoricalOwnersOrDebits: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  };
}
