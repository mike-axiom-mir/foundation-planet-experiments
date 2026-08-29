import {
  HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
  HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-root-admission-request.mjs?v=0.119.0-r119.1';
import {
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightContractReceiptValid
} from './matrix-thermal-historical-source-host-governance-trust-root-resolution-preflight.mjs?v=0.119.0-r119.1';
import {
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestContractReceiptValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-request.mjs?v=0.119.0-r119.1';
import {
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureIntegrityContractReceiptValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signature-integrity.mjs?v=0.119.0-r119.1';
import {
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceiptValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-request.mjs?v=0.119.0-r119.1';
import {
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-authority-decision-integrity.mjs?v=0.119.0-r119.1';
import {
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestContractReceiptValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-request.mjs?v=0.119.0-r119.1';
import {
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureIntegrityContractReceiptValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signature-integrity.mjs?v=0.119.0-r119.1';
import {
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestContractReceiptValid
} from './r117-policy-delegation-verification-response-signer-key-binding-request.mjs?v=0.119.0-r119.1';
import {
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid
} from './r118-policy-delegation-verification-response-signer-key-binding-authority-decision.mjs?v=0.119.0-r119.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA,
  HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-bootstrap-recursion-preflight.mjs?v=0.119.0-r119.1';

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
const sourceKeys = [
  'r110Contract', 'r111Contract', 'r112Contract', 'r113Contract',
  'r114Contract', 'r115Contract', 'r116Contract', 'r117Contract',
  'r118Contract'
];
const authorityCapabilityIds = () => [
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
  HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
  HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID
];

function sourceChainValid(sources) {
  return exactKeys(sources, sourceKeys) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootResolutionPreflightContractReceiptValid(
      sources.r110Contract) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestContractReceiptValid(
      sources.r111Contract, sources.r110Contract) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureIntegrityContractReceiptValid(
      sources.r112Contract, sources.r111Contract) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceiptValid(
      sources.r113Contract, sources.r112Contract) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      sources.r114Contract, sources.r113Contract) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationRequestContractReceiptValid(
      sources.r115Contract, sources.r114Contract, sources.r113Contract) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignatureIntegrityContractReceiptValid(
      sources.r116Contract, sources.r115Contract, sources.r114Contract,
      sources.r113Contract) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingRequestContractReceiptValid(
      sources.r117Contract, sources.r116Contract, sources.r115Contract,
      sources.r114Contract, sources.r113Contract) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingPolicyDelegationVerificationResponseSignerKeyBindingAuthorityDecisionIntegrityContractReceiptValid(
      sources.r118Contract, sources.r117Contract, sources.r116Contract,
      sources.r115Contract, sources.r114Contract, sources.r113Contract);
}

function withDigest(value) {
  const result = clone(value);
  result.digest = stableDigest(result);
  return result;
}

function expectedSourceChain(sources) {
  return sourceKeys.map((key, index) => ({
    rung: `R${110 + index}`,
    ...sourceRef(sources[key])
  }));
}

function expectedContract(sources) {
  const terminal = sources.r118Contract.bindingDecisionIntegrityRouteProjection;
  const sourceChain = expectedSourceChain(sources);
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
    status: 'TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_AVAILABLE',
    sourceChain,
    routeProjection: {
      sourceChainDigest: stableDigest(sourceChain),
      terminalRouteProjectionDigest: stableDigest(terminal),
      sourceRouteCount: terminal.sourceRouteCount,
      eligibleRouteCount: terminal.eligibleRouteCount,
      authorityReviewRouteExcludedCount:
        terminal.authorityReviewRouteExcludedCount,
      implementedAnalyticalCapabilityId:
        HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID,
      requiredAuthorityCapabilityIds: authorityCapabilityIds()
    },
    emission: {
      mode:
        'transient-analysis-from-exact-r110-through-r118-host-governance-chain'
    },
    truth: {
      exactR110ThroughR118ChainBound: true,
      trustBootstrapRecursionDetectionImplemented: true,
      trustBootstrapRecursionDetected: true,
      artifactGraphCycleClaimed: false,
      callerSuppliedPolicyTrusted: false,
      independentlyAuthenticatedHostAuthorityPresent: false,
      authorityClosureEstablished: false,
      automaticRecursiveContinuationAllowed: false,
      analysisOnly: true,
      endpointResolved: false,
      transportPerformed: false,
      signerKeyBound: false,
      hostGovernanceAdmissionAuthorized: false,
      transientArtifactsPersisted: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      worldMutationPerformed: false
    }
  });
}

function expectedWitness(contract, sources) {
  const stage = (ordinal, rung, role, sourceContract, requiredCapabilityId) => ({
    ordinal, rung, role, sourceContract: sourceRef(sourceContract),
    requiredCapabilityId, authorityEstablished: false
  });
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA,
    status: 'RECURSIVE_UNTRUSTED_AUTHORITY_DEPENDENCY_WITNESSED',
    sourceContract: sourceRef(contract),
    pattern:
      'CALLER_POLICY_DECISION_REQUIRES_POLICY_DELEGATION_VERIFICATION_WHOSE_RESPONSE_SIGNER_BINDING_REQUIRES_ANOTHER_CALLER_POLICY_DECISION',
    stages: [
      stage(1, 'R114',
        'CALLER_SUPPLIED_REGISTRY_RESPONSE_SIGNER_BINDING_POLICY_DECISION_INTEGRITY',
        sources.r114Contract,
        HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID),
      stage(2, 'R115', 'POLICY_DELEGATION_VERIFICATION_REQUEST',
        sources.r115Contract,
        HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID),
      stage(3, 'R116',
        'UNTRUSTED_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INTEGRITY',
        sources.r116Contract,
        HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID),
      stage(4, 'R117',
        'POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_BINDING_REQUEST',
        sources.r117Contract,
        HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID),
      stage(5, 'R118',
        'CALLER_SUPPLIED_POLICY_RESPONSE_SIGNER_BINDING_POLICY_DECISION_INTEGRITY',
        sources.r118Contract,
        HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID)
    ],
    recurringDependency: {
      capabilityId: HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
      firstRequiredByContract: sourceRef(sources.r114Contract),
      requestedByContract: sourceRef(sources.r115Contract),
      untrustedResponseIntegrityByContract: sourceRef(sources.r116Contract),
      responseSignerBindingRequestedByContract: sourceRef(sources.r117Contract),
      recursAtContract: sourceRef(sources.r118Contract),
      independentlyAnchoredOutcomePresent: false
    },
    closure: {
      closed: false,
      reason:
        'NO_INDEPENDENTLY_AUTHENTICATED_HOST_TRUST_ROOT_OR_POLICY_DELEGATION_OUTCOME'
    },
    truth: {
      exactContractAndSourceChainBound: true,
      recursiveUntrustedAuthorityDependencyWitnessed: true,
      literalArtifactGraphCycleAsserted: false,
      independentTrustBootstrapClosurePresent: false,
      callerPolicyMaySelfAuthorize: false,
      witnessMayAuthorize: false,
      endpointResolved: false,
      transportPerformed: false,
      signerKeyBound: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  });
}

function expectedExternalEvidence() {
  const entry = (evidenceId, requiredCapabilityId, acceptanceBoundary) => ({
    evidenceId, requiredCapabilityId, acceptanceBoundary
  });
  return [
    entry('host-registry-configuration-receipt',
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
      'HOST_ISSUED_REGISTRY_IDENTIFIER_VERSION_AND_TRUST_ROOT_SET_BOUND'),
    entry('host-trust-root-resolution-receipt',
      HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
      'ALLOWED_AND_DENIED_IDENTITY_PROBES_BOUND_TO_THE_CONFIGURED_REGISTRY'),
    entry('registry-response-signer-key-binding-receipt',
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
      'HOST_APPLIED_BINDING_BOUND_TO_RESPONSE_KEY_COMMITMENT_AND_SCOPE'),
    entry('policy-key-delegation-verification-decision-receipt',
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
      'HOST_DECISION_BOUND_TO_RESOLVED_TRUST_ROOT_POLICY_AND_DELEGATED_KEY'),
    entry('policy-response-signer-key-binding-receipt',
      HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
      'HOST_APPLIED_BINDING_BOUND_TO_VERIFICATION_RESPONSE_KEY_AND_SCOPE'),
    entry('host-governance-admission-decision-receipt',
      HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID,
      'HOST_DECISION_BOUND_TO_REGISTRY_ROOT_DELEGATION_BINDINGS_AND_REQUEST')
  ];
}

function expectedReport(contract, witness) {
  return withDigest({
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA,
    status: 'BLOCKED_RECURSIVE_UNTRUSTED_AUTHORITY_DEPENDENCY',
    sourceContract: sourceRef(contract),
    sourceWitness: sourceRef(witness),
    capabilityGap: {
      overall: 'BLOCKED',
      availableAnalyticalCapabilityIds: [
        HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID
      ],
      missingAuthorityCapabilityIds: authorityCapabilityIds()
    },
    requiredExternalEvidence: expectedExternalEvidence(),
    prohibitedAutomaticContinuation: {
      createAnotherCallerPolicyDecision: true,
      treatSignatureIntegrityAsAuthority: true,
      treatRequestCreationAsHostExecution: true,
      persistTransientAuthorityArtifacts: true
    },
    truth: {
      localAnalysisCapabilityReady: true,
      allRequiredAuthorityCapabilitiesAvailable: false,
      independentlyAuthenticatedExternalEvidencePresent: false,
      trustBootstrapClosureReady: false,
      recursiveRequestGenerationPermitted: false,
      callerPolicyMaySelfAuthorize: false,
      reportMayAuthorize: false,
      endpointResolved: false,
      transportPerformed: false,
      signerKeyBound: false,
      hostGovernanceAdmissionAuthorized: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  });
}

function auditResult(status, detail) {
  return {
    id:
      'land-matrix-thermal-historical-source-host-governance-trust-bootstrap-recursion-preflight',
    required: true,
    status,
    statement:
      'The exact R110 through R118 chain must expose its recursive untrusted authority dependency and remain blocked pending six independently evidenced host capabilities.',
    detail
  };
}

export function
auditLandMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapRecursionPreflight(
  contract, witness, report, sources) {
  const chainIntact = sourceChainValid(sources);
  const contractExact = chainIntact && exact(contract, expectedContract(sources));
  const witnessExact = contractExact &&
    exact(witness, expectedWitness(contract, sources));
  const reportExact = witnessExact && exact(report,
    expectedReport(contract, witness));
  const digestIntegrity = [contract, witness, report].every(value => {
    if (!value || typeof value.digest !== 'string') return false;
    const unsigned = clone(value);
    delete unsigned.digest;
    return stableDigest(unsigned) === value.digest;
  });
  const closureBoundary = reportExact &&
    report.capabilityGap.overall === 'BLOCKED' &&
    report.capabilityGap.missingAuthorityCapabilityIds.length === 6 &&
    report.requiredExternalEvidence.length === 6 &&
    report.truth.trustBootstrapClosureReady === false &&
    report.truth.reportMayAuthorize === false &&
    report.truth.endpointResolved === false &&
    report.truth.transportPerformed === false &&
    report.truth.signerKeyBound === false &&
    report.truth.persistencePerformed === false &&
    report.truth.worldMutationPerformed === false;
  const pass = chainIntact && contractExact && witnessExact && reportExact &&
    digestIntegrity && closureBoundary;
  return auditResult(pass ? 'PASS' : 'FAIL', {
    sourceChainIntact: chainIntact,
    contractExact,
    witnessExact,
    reportExact,
    digestIntegrity,
    recursionStageCount: witness?.stages?.length ?? null,
    requiredExternalEvidenceCount:
      report?.requiredExternalEvidence?.length ?? null,
    closureBoundaryIntact: closureBoundary
  });
}
