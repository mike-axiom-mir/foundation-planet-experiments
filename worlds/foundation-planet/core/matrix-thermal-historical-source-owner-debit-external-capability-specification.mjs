import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_MATRIX_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_REPORT_SCHEMA,
  landMatrixThermalHistoricalSourceOwnerDebitAdmissionReadinessPreflightContractReceiptValid,
  landMatrixThermalHistoricalSourceOwnerDebitAdmissionReadinessMatrixValid,
  landMatrixThermalHistoricalSourceOwnerDebitAdmissionReadinessReportValid
} from './matrix-thermal-historical-source-owner-debit-admission-readiness-preflight.mjs?v=0.121.0-r121.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-specification-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-specification/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-specification-bundle/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_RESULT_ENVELOPE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-result-envelope/v1';

export const HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_CREATE_CAPABILITY_ID =
  'contract.foundation-planet.matrix-thermal.historical-source-owner-debit.external-capability.specification.create';

const CONTRACT_STATUS = 'EXTERNAL_CAPABILITY_SPECIFICATION_CONTRACT_AVAILABLE';
const BUNDLE_STATUS =
  'FIFTEEN_EXTERNAL_CAPABILITY_SPECIFICATIONS_AVAILABLE_WITHOUT_PROVIDERS';
const EMISSION_MODE =
  'transient-specification-from-exact-r120-admission-readiness-bundle';
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

function sourceBundleValid(bundle) {
  return exactKeys(bundle, ['r120Contract', 'r120Matrix', 'r120Preflight',
    'artifactIntegrityContract', 'trustBootstrap']) &&
    landMatrixThermalHistoricalSourceOwnerDebitAdmissionReadinessPreflightContractReceiptValid(
      bundle.r120Contract, bundle.artifactIntegrityContract,
      bundle.trustBootstrap) &&
    landMatrixThermalHistoricalSourceOwnerDebitAdmissionReadinessMatrixValid(
      bundle.r120Matrix, bundle.r120Contract,
      bundle.artifactIntegrityContract, bundle.trustBootstrap) &&
    landMatrixThermalHistoricalSourceOwnerDebitAdmissionReadinessReportValid(
      bundle.r120Preflight, bundle.r120Contract, bundle.r120Matrix,
      bundle.artifactIntegrityContract, bundle.trustBootstrap);
}

const expectedContractTruth = () => ({
  exactR120AdmissionReadinessBundleBound: true,
  fifteenExternalCapabilitySpecificationsDeclared: true,
  externalProviderImplemented: false,
  externalProviderAvailable: false,
  nativeReceiptSchemaDeclaredByProvider: false,
  resultEnvelopeValidationImplemented: false,
  evidenceAuthenticated: false,
  hostAuthorityEstablished: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  admissionAuthorized: false,
  endpointResolved: false,
  transportPerformed: false,
  persistencePerformed: false,
  worldMutationPerformed: false
});

function expectedContract(bundle) {
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_CONTRACT_RECEIPT_SCHEMA,
    status: CONTRACT_STATUS,
    sourceR120: {
      contract: sourceRef(bundle.r120Contract),
      matrix: sourceRef(bundle.r120Matrix),
      preflight: sourceRef(bundle.r120Preflight)
    },
    projection: {
      sourceRouteCount: bundle.r120Matrix.summary.routeCount,
      historicalCapabilitySpecificationCount: bundle.r120Preflight
        .capabilityGap.missingHistoricalSourceCapabilityIds.length,
      hostAuthoritySpecificationCount: bundle.r120Preflight.capabilityGap
        .missingHostAuthorityCapabilityIds.length,
      totalExternalCapabilitySpecificationCount: 15,
      outputEnvelopeSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_RESULT_ENVELOPE_SCHEMA,
      implementedContractCapabilityId:
        HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_CREATE_CAPABILITY_ID
    },
    emission: { mode: EMISSION_MODE },
    truth: expectedContractTruth()
  };
  receipt.digest = stableDigest(receipt);
  return receipt;
}

export function
landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilitySpecificationContractReceiptValid(
  receipt, bundle = null) {
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'sourceR120', 'projection',
        'emission', 'truth', 'digest']) ||
      !exactKeys(receipt.sourceR120, ['contract', 'matrix', 'preflight']) ||
      !Object.values(receipt.sourceR120).every(ref => exactKeys(ref,
        ['schema', 'receiptDigest'])) ||
      !exactKeys(receipt.projection, ['sourceRouteCount',
        'historicalCapabilitySpecificationCount',
        'hostAuthoritySpecificationCount',
        'totalExternalCapabilitySpecificationCount', 'outputEnvelopeSchema',
        'implementedContractCapabilityId']) ||
      !exactKeys(receipt.emission, ['mode']) ||
      receipt.status !== CONTRACT_STATUS ||
      receipt.projection.sourceRouteCount !== 28 ||
      receipt.projection.historicalCapabilitySpecificationCount !== 9 ||
      receipt.projection.hostAuthoritySpecificationCount !== 6 ||
      receipt.projection.totalExternalCapabilitySpecificationCount !== 15 ||
      receipt.projection.outputEnvelopeSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_RESULT_ENVELOPE_SCHEMA ||
      receipt.projection.implementedContractCapabilityId !==
        HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_CREATE_CAPABILITY_ID ||
      receipt.emission.mode !== EMISSION_MODE ||
      !exact(receipt.truth, expectedContractTruth())) return false;
  return bundle === null || sourceBundleValid(bundle) &&
    exact(receipt, expectedContract(bundle));
}

export function
createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilitySpecificationContractReceipt(
  bundle) {
  if (!sourceBundleValid(bundle)) {
    throw new Error(
      'External capability specification needs the exact R120 admission-readiness bundle and its R100/R119 sources');
  }
  return expectedContract(bundle);
}

function commonSpecification(ordinal, capabilityId, gapType, providerClass,
  purpose, coverage, requestBindingDigests, requiredArtifactKinds,
  requiredProofSurfaces, bundle, options = {}) {
  const evidenceProvider = gapType === 'EVIDENCE';
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_SCHEMA,
    ordinal,
    capabilityId,
    gapType,
    providerClass,
    purpose,
    coverage,
    inputContract: {
      sourceContract: sourceRef(bundle.r120Contract),
      sourceMatrix: sourceRef(bundle.r120Matrix),
      requestBindingDigests,
      inertArtifactBytesRequired: evidenceProvider,
      externalAuthorityContextRequired: gapType === 'AUTHORITY'
    },
    outputContract: {
      envelopeSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_RESULT_ENVELOPE_SCHEMA,
      nativeReceiptSchema: null,
      nativeReceiptSchemaStatus: 'EXTERNAL_PROVIDER_MUST_DECLARE',
      requiredArtifactKinds,
      requiredProofSurfaces,
      receiptTrustOnArrival: 'UNTRUSTED_PENDING_INDEPENDENT_VALIDATION'
    },
    sideEffects: {
      specificationPerformsSideEffects: false,
      foundationPlanetWritesAllowed: false,
      externalObservationOrReviewExpected: true,
      externalHostSideEffectsExpected:
        options.externalHostSideEffectsExpected === true
    },
    permissionsAndConsent: {
      requiredAuthoritySeat: options.requiredAuthoritySeat,
      selfAttestationSufficient: false,
      callerPolicyMaySelfAuthorize: false,
      mikeTobiReviewRequired:
        options.requiredAuthoritySeat === 'MIKE_TOBI_OR_AXM_REVIEW_SEAT'
    },
    resourceBudget: {
      maximumInertArtifactBytesPerRoute: evidenceProvider
        ? bundle.artifactIntegrityContract.summary.maximumArtifactBytes : 0,
      maximumPackageBytes: evidenceProvider
        ? bundle.artifactIntegrityContract.summary.maximumPackageBytes : 0,
      externalRuntimeBudgetStatus: 'PROVIDER_MUST_DECLARE_BOUNDED_BUDGET'
    },
    failureAndRecovery: {
      failClosed: true,
      partialResultMayAuthorize: false,
      retryRequiresSameRequestBindingDigest: true,
      noFoundationMutationOnFailure: true
    },
    compatibility: {
      sourceR120ContractSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
      sourceR120MatrixSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_MATRIX_SCHEMA,
      sourceR120PreflightSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_REPORT_SCHEMA,
      capabilityIdMustMatchExactly: true,
      resultEnvelopeSchemaVersion: 1
    },
    verificationContract: {
      primaryProofSurfaces: requiredProofSurfaces,
      independentSecondaryAuditRequired: true,
      allowedAndDeniedIdentityProbesRequired:
        options.allowedAndDeniedIdentityProbesRequired === true,
      nativeReceiptSchemaMustBeDeclaredBeforeExecution: true
    },
    promotionGate: {
      mikeTobiDecisionRequired: true,
      providerMayPromoteItself: false,
      providerMayCanonizeItself: false
    },
    lifecycle: {
      status: 'SPEC_REQUIRED',
      providerInstalled: false,
      providerAvailable: false,
      promoted: false,
      canon: false
    }
  };
}

function historicalSpecifications(bundle) {
  return bundle.r120Preflight.evidenceCapabilityRequirements.map(
    (requirement, index) => {
      const routes = bundle.r120Matrix.routes.filter(route =>
        route.requestBinding.capabilityId === requirement.capabilityId);
      const review = requirement.gapType === 'AUTHORITY';
      return commonSpecification(index + 1, requirement.capabilityId,
        requirement.gapType, review
          ? 'MIKE_TOBI_OR_AXM_REVIEW_SEAT'
          : 'INDEPENDENT_HISTORICAL_EVIDENCE_PROVIDER',
        review
          ? 'Issue an explicit physical-meaning review decision for the exact covered R120 routes.'
          : 'Produce independently sourced native evidence for the exact covered R120 routes without cross-route owner or debit inference.',
        {
          routeIds: clone(requirement.routeIds),
          routeCount: requirement.routeCount,
          evidenceId: null,
          acceptanceBoundary: null
        },
        routes.map(route => route.sourceRoute.requestBindingDigest),
        clone(requirement.expectedArtifactKinds),
        clone(requirement.requiredProofSurfaces), bundle, {
          requiredAuthoritySeat: review
            ? 'MIKE_TOBI_OR_AXM_REVIEW_SEAT'
            : 'INDEPENDENT_HISTORICAL_EVIDENCE_PROVIDER',
          externalHostSideEffectsExpected: false,
          allowedAndDeniedIdentityProbesRequired: false
        });
    });
}

function hostSpecifications(bundle) {
  return bundle.r120Preflight.hostEvidenceRequirements.map(
    (requirement, index) => commonSpecification(index + 10,
      requirement.requiredCapabilityId, 'AUTHORITY',
      'HOST_GOVERNANCE_AUTHORITY',
      `Issue independently authenticated host evidence for ${requirement.evidenceId} without treating a local request or signature check as execution.`,
      {
        routeIds: [],
        routeCount: 0,
        evidenceId: requirement.evidenceId,
        acceptanceBoundary: requirement.acceptanceBoundary
      }, [], [requirement.evidenceId],
      [`HOST_ISSUED_RECEIPT:${requirement.acceptanceBoundary}`], bundle, {
        requiredAuthoritySeat: 'HOST_GOVERNANCE_AUTHORITY',
        externalHostSideEffectsExpected: true,
        allowedAndDeniedIdentityProbesRequired: true
      }));
}

const expectedBundleTruth = () => ({
  exactR120ContractMatrixAndPreflightBound: true,
  allFifteenMissingCapabilitiesSpecified: true,
  allTwentyEightHistoricalRoutesCovered: true,
  nativeProviderReceiptSchemasPresent: false,
  externalProvidersInstalled: false,
  externalProvidersAvailable: false,
  specificationBundleMayExecuteProvider: false,
  specificationBundleMayAuthenticateEvidence: false,
  specificationBundleMayGrantAuthority: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  admissionAuthorized: false,
  endpointResolved: false,
  transportPerformed: false,
  persistencePerformed: false,
  worldMutationPerformed: false
});

function expectedBundle(contract, sourceBundle) {
  const historical = historicalSpecifications(sourceBundle);
  const host = hostSpecifications(sourceBundle);
  const specifications = [...historical, ...host];
  const bundle = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA,
    status: BUNDLE_STATUS,
    sourceContract: sourceRef(contract),
    specifications,
    summary: {
      specificationCount: specifications.length,
      historicalEvidenceProviderSpecificationCount: historical.filter(spec =>
        spec.gapType === 'EVIDENCE').length,
      mikeTobiOrAxmReviewSpecificationCount: historical.filter(spec =>
        spec.providerClass === 'MIKE_TOBI_OR_AXM_REVIEW_SEAT').length,
      hostAuthoritySpecificationCount: host.length,
      coveredHistoricalRouteCount: historical.reduce((count, spec) =>
        count + spec.coverage.routeCount, 0),
      nativeReceiptSchemaDeclaredCount: 0,
      providerInstalledCount: 0,
      providerAvailableCount: 0,
      admittedRouteCount: 0
    },
    prohibitedImplementationClaims: {
      treatSpecificationAsProvider: true,
      inventNativeReceiptSchema: true,
      acceptSelfAttestationAsEvidence: true,
      treatEnvelopeAsAuthority: true,
      executeWithoutDeclaredBudgetAndPermissions: true,
      partiallyApplyProviderResult: true,
      mutateFoundationOrCanon: true
    },
    truth: expectedBundleTruth()
  };
  bundle.digest = stableDigest(bundle);
  return bundle;
}

function specificationShapeValid(spec, index) {
  return exactKeys(spec, ['schema', 'ordinal', 'capabilityId', 'gapType',
    'providerClass', 'purpose', 'coverage', 'inputContract', 'outputContract',
    'sideEffects', 'permissionsAndConsent', 'resourceBudget',
    'failureAndRecovery', 'compatibility', 'verificationContract',
    'promotionGate', 'lifecycle']) && spec.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_SCHEMA &&
    spec.ordinal === index + 1 && typeof spec.capabilityId === 'string' &&
    spec.capabilityId.length > 0 && ['EVIDENCE', 'AUTHORITY'].includes(
      spec.gapType) && exactKeys(spec.coverage, ['routeIds', 'routeCount',
      'evidenceId', 'acceptanceBoundary']) &&
    exactKeys(spec.inputContract, ['sourceContract', 'sourceMatrix',
      'requestBindingDigests', 'inertArtifactBytesRequired',
      'externalAuthorityContextRequired']) &&
    exactKeys(spec.outputContract, ['envelopeSchema', 'nativeReceiptSchema',
      'nativeReceiptSchemaStatus', 'requiredArtifactKinds',
      'requiredProofSurfaces', 'receiptTrustOnArrival']) &&
    exactKeys(spec.sideEffects, ['specificationPerformsSideEffects',
      'foundationPlanetWritesAllowed', 'externalObservationOrReviewExpected',
      'externalHostSideEffectsExpected']) &&
    exactKeys(spec.permissionsAndConsent, ['requiredAuthoritySeat',
      'selfAttestationSufficient', 'callerPolicyMaySelfAuthorize',
      'mikeTobiReviewRequired']) &&
    exactKeys(spec.resourceBudget, ['maximumInertArtifactBytesPerRoute',
      'maximumPackageBytes', 'externalRuntimeBudgetStatus']) &&
    exactKeys(spec.failureAndRecovery, ['failClosed',
      'partialResultMayAuthorize', 'retryRequiresSameRequestBindingDigest',
      'noFoundationMutationOnFailure']) &&
    exactKeys(spec.compatibility, ['sourceR120ContractSchema',
      'sourceR120MatrixSchema', 'sourceR120PreflightSchema',
      'capabilityIdMustMatchExactly', 'resultEnvelopeSchemaVersion']) &&
    exactKeys(spec.verificationContract, ['primaryProofSurfaces',
      'independentSecondaryAuditRequired',
      'allowedAndDeniedIdentityProbesRequired',
      'nativeReceiptSchemaMustBeDeclaredBeforeExecution']) &&
    exactKeys(spec.promotionGate, ['mikeTobiDecisionRequired',
      'providerMayPromoteItself', 'providerMayCanonizeItself']) &&
    exactKeys(spec.lifecycle, ['status', 'providerInstalled',
      'providerAvailable', 'promoted', 'canon']) &&
    spec.outputContract.nativeReceiptSchema === null &&
    spec.outputContract.nativeReceiptSchemaStatus ===
      'EXTERNAL_PROVIDER_MUST_DECLARE' &&
    spec.outputContract.receiptTrustOnArrival ===
      'UNTRUSTED_PENDING_INDEPENDENT_VALIDATION' &&
    spec.sideEffects.specificationPerformsSideEffects === false &&
    spec.sideEffects.foundationPlanetWritesAllowed === false &&
    spec.permissionsAndConsent.selfAttestationSufficient === false &&
    spec.permissionsAndConsent.callerPolicyMaySelfAuthorize === false &&
    Object.values(spec.failureAndRecovery).every((value, i) =>
      i === 1 ? value === false : value === true) &&
    spec.promotionGate.mikeTobiDecisionRequired === true &&
    spec.promotionGate.providerMayPromoteItself === false &&
    spec.promotionGate.providerMayCanonizeItself === false &&
    spec.lifecycle.status === 'SPEC_REQUIRED' &&
    Object.entries(spec.lifecycle).every(([key, value]) =>
      key === 'status' || value === false);
}

export function
landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilitySpecificationBundleValid(
  bundle, contract = null, sourceBundle = null) {
  if (!digestValid(bundle,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA) ||
      !exactKeys(bundle, ['schema', 'status', 'sourceContract',
        'specifications', 'summary', 'prohibitedImplementationClaims',
        'truth', 'digest']) ||
      !exactKeys(bundle.sourceContract, ['schema', 'receiptDigest']) ||
      !Array.isArray(bundle.specifications) ||
      bundle.specifications.length !== 15 ||
      !bundle.specifications.every(specificationShapeValid) ||
      !exactKeys(bundle.summary, ['specificationCount',
        'historicalEvidenceProviderSpecificationCount',
        'mikeTobiOrAxmReviewSpecificationCount',
        'hostAuthoritySpecificationCount', 'coveredHistoricalRouteCount',
        'nativeReceiptSchemaDeclaredCount', 'providerInstalledCount',
        'providerAvailableCount', 'admittedRouteCount']) ||
      !exactKeys(bundle.prohibitedImplementationClaims,
        ['treatSpecificationAsProvider', 'inventNativeReceiptSchema',
          'acceptSelfAttestationAsEvidence', 'treatEnvelopeAsAuthority',
          'executeWithoutDeclaredBudgetAndPermissions',
          'partiallyApplyProviderResult', 'mutateFoundationOrCanon']) ||
      bundle.status !== BUNDLE_STATUS ||
      bundle.summary.specificationCount !== 15 ||
      bundle.summary.historicalEvidenceProviderSpecificationCount !== 8 ||
      bundle.summary.mikeTobiOrAxmReviewSpecificationCount !== 1 ||
      bundle.summary.hostAuthoritySpecificationCount !== 6 ||
      bundle.summary.coveredHistoricalRouteCount !== 28 ||
      Object.entries(bundle.summary).some(([key, value]) =>
        !['specificationCount',
          'historicalEvidenceProviderSpecificationCount',
          'mikeTobiOrAxmReviewSpecificationCount',
          'hostAuthoritySpecificationCount',
          'coveredHistoricalRouteCount'].includes(key) && value !== 0) ||
      !Object.values(bundle.prohibitedImplementationClaims)
        .every(value => value === true) ||
      !exact(bundle.truth, expectedBundleTruth())) return false;
  return contract === null && sourceBundle === null ||
    contract !== null && sourceBundle !== null &&
    sourceBundleValid(sourceBundle) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilitySpecificationContractReceiptValid(
      contract, sourceBundle) && exact(bundle,
      expectedBundle(contract, sourceBundle));
}

export function
createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilitySpecificationBundle(
  contract, sourceBundle) {
  if (!landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilitySpecificationContractReceiptValid(
      contract, sourceBundle)) {
    throw new Error(
      'External capability specification bundle needs the exact R121 contract and R120 source bundle');
  }
  return expectedBundle(contract, sourceBundle);
}

export function
matrixThermalHistoricalSourceOwnerDebitExternalCapabilitySpecificationDescription() {
  return {
    status: 'EXPERIMENTAL',
    capabilityId:
      HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_CREATE_CAPABILITY_ID,
    statement:
      'R121 converts the exact fifteen R120 external evidence and authority gaps into buildable, fail-closed capability specifications without claiming that any provider or native receipt schema exists.',
    boundaries: [
      'Each specification declares inputs, output-envelope requirements, side effects, permissions, resource budgets, failure recovery, compatibility, verification, and Mike Tobi promotion gates.',
      'A specification, envelope, local signature check, request, or self-attestation is not a provider, authenticated evidence, host authority, owner/debit proof, or admission.',
      'No endpoint, transport, provider execution, persistence, owner/debit state, admission, world mutation, promotion, or canonization is performed.'
    ]
  };
}
