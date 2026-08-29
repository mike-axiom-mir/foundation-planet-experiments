import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_MATRIX_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_ADMISSION_READINESS_REPORT_SCHEMA,
  landMatrixThermalHistoricalSourceOwnerDebitAdmissionReadinessPreflightContractReceiptValid,
  landMatrixThermalHistoricalSourceOwnerDebitAdmissionReadinessMatrixValid,
  landMatrixThermalHistoricalSourceOwnerDebitAdmissionReadinessReportValid
} from './matrix-thermal-historical-source-owner-debit-admission-readiness-preflight.mjs?v=0.121.0-r121.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_RESULT_ENVELOPE_SCHEMA,
  HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_CREATE_CAPABILITY_ID
} from './matrix-thermal-historical-source-owner-debit-external-capability-specification.mjs?v=0.121.0-r121.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_AUDIT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-specification-audit/v1';

const clone = value => JSON.parse(JSON.stringify(value));
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);

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
const withDigest = value => {
  const result = clone(value);
  result.digest = stableDigest(result);
  return result;
};

function sourcesValid(bundle) {
  return bundle && exact(Object.keys(bundle).sort(),
    ['artifactIntegrityContract', 'r120Contract', 'r120Matrix',
      'r120Preflight', 'trustBootstrap']) &&
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

function expectedContract(bundle) {
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_CONTRACT_RECEIPT_SCHEMA,
    status: 'EXTERNAL_CAPABILITY_SPECIFICATION_CONTRACT_AVAILABLE',
    sourceR120: {
      contract: sourceRef(bundle.r120Contract),
      matrix: sourceRef(bundle.r120Matrix),
      preflight: sourceRef(bundle.r120Preflight)
    },
    projection: {
      sourceRouteCount: 28,
      historicalCapabilitySpecificationCount: 9,
      hostAuthoritySpecificationCount: 6,
      totalExternalCapabilitySpecificationCount: 15,
      outputEnvelopeSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_RESULT_ENVELOPE_SCHEMA,
      implementedContractCapabilityId:
        HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_CREATE_CAPABILITY_ID
    },
    emission: {
      mode: 'transient-specification-from-exact-r120-admission-readiness-bundle'
    },
    truth: {
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
    }
  });
}

function commonSpec(ordinal, capabilityId, gapType, providerClass, purpose,
  coverage, bindingDigests, artifactKinds, proofSurfaces, bundle, options) {
  const evidenceProvider = gapType === 'EVIDENCE';
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_SCHEMA,
    ordinal, capabilityId, gapType, providerClass, purpose, coverage,
    inputContract: {
      sourceContract: sourceRef(bundle.r120Contract),
      sourceMatrix: sourceRef(bundle.r120Matrix),
      requestBindingDigests: bindingDigests,
      inertArtifactBytesRequired: evidenceProvider,
      externalAuthorityContextRequired: gapType === 'AUTHORITY'
    },
    outputContract: {
      envelopeSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_RESULT_ENVELOPE_SCHEMA,
      nativeReceiptSchema: null,
      nativeReceiptSchemaStatus: 'EXTERNAL_PROVIDER_MUST_DECLARE',
      requiredArtifactKinds: artifactKinds,
      requiredProofSurfaces: proofSurfaces,
      receiptTrustOnArrival: 'UNTRUSTED_PENDING_INDEPENDENT_VALIDATION'
    },
    sideEffects: {
      specificationPerformsSideEffects: false,
      foundationPlanetWritesAllowed: false,
      externalObservationOrReviewExpected: true,
      externalHostSideEffectsExpected: options.hostEffects
    },
    permissionsAndConsent: {
      requiredAuthoritySeat: options.seat,
      selfAttestationSufficient: false,
      callerPolicyMaySelfAuthorize: false,
      mikeTobiReviewRequired: options.seat ===
        'MIKE_TOBI_OR_AXM_REVIEW_SEAT'
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
      primaryProofSurfaces: proofSurfaces,
      independentSecondaryAuditRequired: true,
      allowedAndDeniedIdentityProbesRequired: options.identityProbes,
      nativeReceiptSchemaMustBeDeclaredBeforeExecution: true
    },
    promotionGate: {
      mikeTobiDecisionRequired: true,
      providerMayPromoteItself: false,
      providerMayCanonizeItself: false
    },
    lifecycle: {
      status: 'SPEC_REQUIRED', providerInstalled: false,
      providerAvailable: false, promoted: false, canon: false
    }
  };
}

function expectedSpecifications(bundle) {
  const historical = bundle.r120Preflight.evidenceCapabilityRequirements.map(
    (requirement, index) => {
      const routes = bundle.r120Matrix.routes.filter(route =>
        route.requestBinding.capabilityId === requirement.capabilityId);
      const review = requirement.gapType === 'AUTHORITY';
      return commonSpec(index + 1, requirement.capabilityId,
        requirement.gapType, review ? 'MIKE_TOBI_OR_AXM_REVIEW_SEAT' :
          'INDEPENDENT_HISTORICAL_EVIDENCE_PROVIDER', review
          ? 'Issue an explicit physical-meaning review decision for the exact covered R120 routes.'
          : 'Produce independently sourced native evidence for the exact covered R120 routes without cross-route owner or debit inference.',
        { routeIds: clone(requirement.routeIds),
          routeCount: requirement.routeCount, evidenceId: null,
          acceptanceBoundary: null }, routes.map(route =>
          route.sourceRoute.requestBindingDigest),
        clone(requirement.expectedArtifactKinds),
        clone(requirement.requiredProofSurfaces), bundle, {
          seat: review ? 'MIKE_TOBI_OR_AXM_REVIEW_SEAT' :
            'INDEPENDENT_HISTORICAL_EVIDENCE_PROVIDER', hostEffects: false,
          identityProbes: false
        });
    });
  const host = bundle.r120Preflight.hostEvidenceRequirements.map(
    (requirement, index) => commonSpec(index + 10,
      requirement.requiredCapabilityId, 'AUTHORITY',
      'HOST_GOVERNANCE_AUTHORITY',
      `Issue independently authenticated host evidence for ${requirement.evidenceId} without treating a local request or signature check as execution.`,
      { routeIds: [], routeCount: 0, evidenceId: requirement.evidenceId,
        acceptanceBoundary: requirement.acceptanceBoundary }, [],
      [requirement.evidenceId],
      [`HOST_ISSUED_RECEIPT:${requirement.acceptanceBoundary}`], bundle, {
        seat: 'HOST_GOVERNANCE_AUTHORITY', hostEffects: true,
        identityProbes: true
      }));
  return [...historical, ...host];
}

function expectedBundle(contract, sourceBundle) {
  const specifications = expectedSpecifications(sourceBundle);
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_BUNDLE_SCHEMA,
    status:
      'FIFTEEN_EXTERNAL_CAPABILITY_SPECIFICATIONS_AVAILABLE_WITHOUT_PROVIDERS',
    sourceContract: sourceRef(contract),
    specifications,
    summary: {
      specificationCount: 15,
      historicalEvidenceProviderSpecificationCount: 8,
      mikeTobiOrAxmReviewSpecificationCount: 1,
      hostAuthoritySpecificationCount: 6,
      coveredHistoricalRouteCount: 28,
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
    truth: {
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
    }
  });
}

export function
auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilitySpecification(
  contract, specificationBundle, sourceBundle) {
  const sourceValidity = sourcesValid(sourceBundle);
  const expectedContractValue = sourceValidity
    ? expectedContract(sourceBundle) : null;
  const contractExact = sourceValidity && exact(contract,
    expectedContractValue);
  const expectedBundleValue = contractExact
    ? expectedBundle(expectedContractValue, sourceBundle) : null;
  const bundleExact = contractExact && exact(specificationBundle,
    expectedBundleValue);
  const checks = {
    exactR120SourceBundleValid: sourceValidity,
    contractIndependentlyReconstructed: contractExact,
    fifteenSpecificationsIndependentlyReconstructed: bundleExact,
    allTwentyEightRoutesCovered: bundleExact &&
      specificationBundle.summary.coveredHistoricalRouteCount === 28,
    allProviderLifecyclesRemainUnavailable: bundleExact &&
      specificationBundle.specifications.every(spec =>
        spec.lifecycle.providerInstalled === false &&
        spec.lifecycle.providerAvailable === false),
    allNativeReceiptSchemasRemainUndeclared: bundleExact &&
      specificationBundle.specifications.every(spec =>
        spec.outputContract.nativeReceiptSchema === null),
    promotionAndCanonRemainHumanGated: bundleExact &&
      specificationBundle.specifications.every(spec =>
        spec.promotionGate.mikeTobiDecisionRequired === true &&
        spec.promotionGate.providerMayPromoteItself === false &&
        spec.promotionGate.providerMayCanonizeItself === false),
    prohibitedClaimsFailClosed: bundleExact && Object.values(
      specificationBundle.prohibitedImplementationClaims)
      .every(value => value === true)
  };
  const pass = Object.values(checks).every(value => value === true);
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_SPECIFICATION_AUDIT_SCHEMA,
    status: pass ? 'PASS' : 'FAIL',
    checks,
    detail: {
      specificationCount: bundleExact
        ? specificationBundle.specifications.length : 0,
      coveredHistoricalRouteCount: bundleExact
        ? specificationBundle.summary.coveredHistoricalRouteCount : 0,
      providerAvailableCount: bundleExact
        ? specificationBundle.summary.providerAvailableCount : 0,
      nativeReceiptSchemaDeclaredCount: bundleExact
        ? specificationBundle.summary.nativeReceiptSchemaDeclaredCount : 0
    },
    truth: {
      auditReconstructedR121WithoutCallingR121BuildersOrValidators: true,
      auditMayImplementOrExecuteProvider: false,
      auditMayAuthenticateEvidenceOrGrantAuthority: false,
      auditMayResolveHistoricalOwnersOrDebits: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  };
}
