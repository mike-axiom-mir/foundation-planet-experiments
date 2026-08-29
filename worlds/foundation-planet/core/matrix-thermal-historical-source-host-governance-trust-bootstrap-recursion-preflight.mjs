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

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-bootstrap-recursion-preflight-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-bootstrap-recursion-witness/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-bootstrap-closure-preflight/v1';

export const HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID =
  'analysis.host-governance.trust-bootstrap.recursion.detect';

const CONTRACT_STATUS = 'TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_AVAILABLE';
const WITNESS_STATUS =
  'RECURSIVE_UNTRUSTED_AUTHORITY_DEPENDENCY_WITNESSED';
const PREFLIGHT_STATUS = 'BLOCKED_RECURSIVE_UNTRUSTED_AUTHORITY_DEPENDENCY';
const RECURSION_PATTERN =
  'CALLER_POLICY_DECISION_REQUIRES_POLICY_DELEGATION_VERIFICATION_WHOSE_RESPONSE_SIGNER_BINDING_REQUIRES_ANOTHER_CALLER_POLICY_DECISION';
const CLOSURE_REASON =
  'NO_INDEPENDENTLY_AUTHENTICATED_HOST_TRUST_ROOT_OR_POLICY_DELEGATION_OUTCOME';
const EMISSION_MODE =
  'transient-analysis-from-exact-r110-through-r118-host-governance-chain';
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
const fnvDigest = value => typeof value === 'string' &&
  /^fnv1a32:[a-f0-9]{8}$/.test(value);

const authorityCapabilityIds = () => [
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
  HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
  HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
  HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID
];

const sourceKeys = [
  'r110Contract', 'r111Contract', 'r112Contract', 'r113Contract',
  'r114Contract', 'r115Contract', 'r116Contract', 'r117Contract',
  'r118Contract'
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

function sourceChainRefs(sources) {
  return sourceKeys.map((key, index) => ({
    rung: `R${110 + index}`,
    ...sourceRef(sources[key])
  }));
}

function expectedRouteProjection(sources) {
  const terminal = sources.r118Contract.bindingDecisionIntegrityRouteProjection;
  const refs = sourceChainRefs(sources);
  return {
    sourceChainDigest: stableDigest(refs),
    terminalRouteProjectionDigest: stableDigest(terminal),
    sourceRouteCount: terminal.sourceRouteCount,
    eligibleRouteCount: terminal.eligibleRouteCount,
    authorityReviewRouteExcludedCount:
      terminal.authorityReviewRouteExcludedCount,
    implementedAnalyticalCapabilityId:
      HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID,
    requiredAuthorityCapabilityIds: authorityCapabilityIds()
  };
}

const expectedContractTruth = () => ({
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
});

function expectedContract(sources) {
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
    status: CONTRACT_STATUS,
    sourceChain: sourceChainRefs(sources),
    routeProjection: expectedRouteProjection(sources),
    emission: { mode: EMISSION_MODE },
    truth: expectedContractTruth()
  };
  receipt.digest = stableDigest(receipt);
  return receipt;
}

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapRecursionPreflightContractReceiptValid(
  receipt, sources = null) {
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'sourceChain',
        'routeProjection', 'emission', 'truth', 'digest']) ||
      !Array.isArray(receipt.sourceChain) || receipt.sourceChain.length !== 9 ||
      !receipt.sourceChain.every((entry, index) => exactKeys(entry,
        ['rung', 'schema', 'receiptDigest']) && entry.rung === `R${110 + index}` &&
        typeof entry.schema === 'string' && fnvDigest(entry.receiptDigest)) ||
      !exactKeys(receipt.routeProjection, ['sourceChainDigest',
        'terminalRouteProjectionDigest', 'sourceRouteCount',
        'eligibleRouteCount', 'authorityReviewRouteExcludedCount',
        'implementedAnalyticalCapabilityId',
        'requiredAuthorityCapabilityIds']) ||
      !exactKeys(receipt.emission, ['mode']) ||
      receipt.status !== CONTRACT_STATUS ||
      receipt.routeProjection.sourceRouteCount !== 28 ||
      receipt.routeProjection.eligibleRouteCount !== 24 ||
      receipt.routeProjection.authorityReviewRouteExcludedCount !== 4 ||
      !fnvDigest(receipt.routeProjection.sourceChainDigest) ||
      !fnvDigest(receipt.routeProjection.terminalRouteProjectionDigest) ||
      receipt.routeProjection.implementedAnalyticalCapabilityId !==
        HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID ||
      !exact(receipt.routeProjection.requiredAuthorityCapabilityIds,
        authorityCapabilityIds()) || receipt.emission.mode !== EMISSION_MODE ||
      !exact(receipt.truth, expectedContractTruth())) return false;
  return sources === null || (sourceChainValid(sources) &&
    exact(receipt, expectedContract(sources)));
}

export function
createLandMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapRecursionPreflightContractReceipt(
  sources) {
  if (!sourceChainValid(sources)) {
    throw new Error(
      'Trust-bootstrap recursion preflight needs the exact attached R110 through R118 chain');
  }
  return expectedContract(sources);
}

function expectedStages(sources) {
  return [
    {
      ordinal: 1,
      rung: 'R114',
      role: 'CALLER_SUPPLIED_REGISTRY_RESPONSE_SIGNER_BINDING_POLICY_DECISION_INTEGRITY',
      sourceContract: sourceRef(sources.r114Contract),
      requiredCapabilityId:
        HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
      authorityEstablished: false
    },
    {
      ordinal: 2,
      rung: 'R115',
      role: 'POLICY_DELEGATION_VERIFICATION_REQUEST',
      sourceContract: sourceRef(sources.r115Contract),
      requiredCapabilityId:
        HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
      authorityEstablished: false
    },
    {
      ordinal: 3,
      rung: 'R116',
      role: 'UNTRUSTED_POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNATURE_INTEGRITY',
      sourceContract: sourceRef(sources.r116Contract),
      requiredCapabilityId:
        HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
      authorityEstablished: false
    },
    {
      ordinal: 4,
      rung: 'R117',
      role: 'POLICY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_BINDING_REQUEST',
      sourceContract: sourceRef(sources.r117Contract),
      requiredCapabilityId:
        HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
      authorityEstablished: false
    },
    {
      ordinal: 5,
      rung: 'R118',
      role: 'CALLER_SUPPLIED_POLICY_RESPONSE_SIGNER_BINDING_POLICY_DECISION_INTEGRITY',
      sourceContract: sourceRef(sources.r118Contract),
      requiredCapabilityId:
        HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
      authorityEstablished: false
    }
  ];
}

const expectedWitnessTruth = () => ({
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
});

function expectedWitness(contract, sources) {
  const witness = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA,
    status: WITNESS_STATUS,
    sourceContract: sourceRef(contract),
    pattern: RECURSION_PATTERN,
    stages: expectedStages(sources),
    recurringDependency: {
      capabilityId: HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
      firstRequiredByContract: sourceRef(sources.r114Contract),
      requestedByContract: sourceRef(sources.r115Contract),
      untrustedResponseIntegrityByContract: sourceRef(sources.r116Contract),
      responseSignerBindingRequestedByContract: sourceRef(sources.r117Contract),
      recursAtContract: sourceRef(sources.r118Contract),
      independentlyAnchoredOutcomePresent: false
    },
    closure: { closed: false, reason: CLOSURE_REASON },
    truth: expectedWitnessTruth()
  };
  witness.digest = stableDigest(witness);
  return witness;
}

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapRecursionWitnessValid(
  witness, contract = null, sources = null) {
  if (!digestValid(witness,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA) ||
      !exactKeys(witness, ['schema', 'status', 'sourceContract', 'pattern',
        'stages', 'recurringDependency', 'closure', 'truth', 'digest']) ||
      !exactKeys(witness.sourceContract, ['schema', 'receiptDigest']) ||
      !Array.isArray(witness.stages) || witness.stages.length !== 5 ||
      !witness.stages.every((stage, index) => exactKeys(stage,
        ['ordinal', 'rung', 'role', 'sourceContract', 'requiredCapabilityId',
          'authorityEstablished']) && stage.ordinal === index + 1 &&
        stage.authorityEstablished === false && exactKeys(stage.sourceContract,
          ['schema', 'receiptDigest'])) ||
      !exactKeys(witness.recurringDependency, ['capabilityId',
        'firstRequiredByContract', 'requestedByContract',
        'untrustedResponseIntegrityByContract',
        'responseSignerBindingRequestedByContract', 'recursAtContract',
        'independentlyAnchoredOutcomePresent']) ||
      !exactKeys(witness.closure, ['closed', 'reason']) ||
      witness.status !== WITNESS_STATUS || witness.pattern !== RECURSION_PATTERN ||
      witness.recurringDependency.capabilityId !==
        HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID ||
      witness.recurringDependency.independentlyAnchoredOutcomePresent !== false ||
      witness.closure.closed !== false || witness.closure.reason !==
        CLOSURE_REASON || !exact(witness.truth, expectedWitnessTruth())) {
    return false;
  }
  return contract === null && sources === null ||
    contract !== null && sources !== null && sourceChainValid(sources) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapRecursionPreflightContractReceiptValid(
      contract, sources) && exact(witness, expectedWitness(contract, sources));
}

export function
createLandMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapRecursionWitness(
  contract, sources) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapRecursionPreflightContractReceiptValid(
      contract, sources)) {
    throw new Error(
      'Trust-bootstrap recursion witness needs the exact R119 contract and R110 through R118 chain');
  }
  return expectedWitness(contract, sources);
}

function expectedExternalEvidenceRequirements() {
  return [
    {
      evidenceId: 'host-registry-configuration-receipt',
      requiredCapabilityId:
        HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
      acceptanceBoundary:
        'HOST_ISSUED_REGISTRY_IDENTIFIER_VERSION_AND_TRUST_ROOT_SET_BOUND'
    },
    {
      evidenceId: 'host-trust-root-resolution-receipt',
      requiredCapabilityId: HOST_GOVERNANCE_TRUST_ROOT_RESOLVE_CAPABILITY_ID,
      acceptanceBoundary:
        'ALLOWED_AND_DENIED_IDENTITY_PROBES_BOUND_TO_THE_CONFIGURED_REGISTRY'
    },
    {
      evidenceId: 'registry-response-signer-key-binding-receipt',
      requiredCapabilityId:
        HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
      acceptanceBoundary:
        'HOST_APPLIED_BINDING_BOUND_TO_RESPONSE_KEY_COMMITMENT_AND_SCOPE'
    },
    {
      evidenceId: 'policy-key-delegation-verification-decision-receipt',
      requiredCapabilityId:
        HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFY_CAPABILITY_ID,
      acceptanceBoundary:
        'HOST_DECISION_BOUND_TO_RESOLVED_TRUST_ROOT_POLICY_AND_DELEGATED_KEY'
    },
    {
      evidenceId: 'policy-response-signer-key-binding-receipt',
      requiredCapabilityId:
        HOST_GOVERNANCE_POLICY_KEY_DELEGATION_VERIFICATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
      acceptanceBoundary:
        'HOST_APPLIED_BINDING_BOUND_TO_VERIFICATION_RESPONSE_KEY_AND_SCOPE'
    },
    {
      evidenceId: 'host-governance-admission-decision-receipt',
      requiredCapabilityId:
        HOST_GOVERNANCE_TRUST_ROOT_ADMISSION_DECIDE_CAPABILITY_ID,
      acceptanceBoundary:
        'HOST_DECISION_BOUND_TO_REGISTRY_ROOT_DELEGATION_BINDINGS_AND_REQUEST'
    }
  ];
}

const expectedReportTruth = () => ({
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
});

function expectedReport(contract, witness) {
  const report = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA,
    status: PREFLIGHT_STATUS,
    sourceContract: sourceRef(contract),
    sourceWitness: sourceRef(witness),
    capabilityGap: {
      overall: 'BLOCKED',
      availableAnalyticalCapabilityIds: [
        HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID
      ],
      missingAuthorityCapabilityIds: authorityCapabilityIds()
    },
    requiredExternalEvidence: expectedExternalEvidenceRequirements(),
    prohibitedAutomaticContinuation: {
      createAnotherCallerPolicyDecision: true,
      treatSignatureIntegrityAsAuthority: true,
      treatRequestCreationAsHostExecution: true,
      persistTransientAuthorityArtifacts: true
    },
    truth: expectedReportTruth()
  };
  report.digest = stableDigest(report);
  return report;
}

export function
landMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapClosurePreflightValid(
  report, contract = null, witness = null, sources = null) {
  if (!digestValid(report,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA) ||
      !exactKeys(report, ['schema', 'status', 'sourceContract',
        'sourceWitness', 'capabilityGap', 'requiredExternalEvidence',
        'prohibitedAutomaticContinuation', 'truth', 'digest']) ||
      !exactKeys(report.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(report.sourceWitness, ['schema', 'receiptDigest']) ||
      !exactKeys(report.capabilityGap, ['overall',
        'availableAnalyticalCapabilityIds', 'missingAuthorityCapabilityIds']) ||
      !Array.isArray(report.requiredExternalEvidence) ||
      report.requiredExternalEvidence.length !== 6 ||
      !report.requiredExternalEvidence.every(entry => exactKeys(entry,
        ['evidenceId', 'requiredCapabilityId', 'acceptanceBoundary'])) ||
      !exactKeys(report.prohibitedAutomaticContinuation,
        ['createAnotherCallerPolicyDecision',
          'treatSignatureIntegrityAsAuthority',
          'treatRequestCreationAsHostExecution',
          'persistTransientAuthorityArtifacts']) ||
      report.status !== PREFLIGHT_STATUS ||
      report.capabilityGap.overall !== 'BLOCKED' ||
      !exact(report.capabilityGap.availableAnalyticalCapabilityIds,
        [HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID]) ||
      !exact(report.capabilityGap.missingAuthorityCapabilityIds,
        authorityCapabilityIds()) ||
      !exact(report.requiredExternalEvidence,
        expectedExternalEvidenceRequirements()) ||
      !Object.values(report.prohibitedAutomaticContinuation)
        .every(value => value === true) ||
      !exact(report.truth, expectedReportTruth())) return false;
  return contract === null && witness === null && sources === null ||
    contract !== null && witness !== null && sources !== null &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapRecursionPreflightContractReceiptValid(
      contract, sources) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapRecursionWitnessValid(
      witness, contract, sources) && exact(report,
      expectedReport(contract, witness));
}

export function
createLandMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapClosurePreflight(
  contract, witness, sources) {
  if (!landMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapRecursionPreflightContractReceiptValid(
      contract, sources) ||
      !landMatrixThermalHistoricalSourceHostGovernanceTrustBootstrapRecursionWitnessValid(
        witness, contract, sources)) {
    throw new Error(
      'Trust-bootstrap closure preflight needs the exact R119 contract, witness, and R110 through R118 chain');
  }
  return expectedReport(contract, witness);
}

export function
matrixThermalHistoricalSourceHostGovernanceTrustBootstrapRecursionPreflightDescription() {
  return {
    status: 'EXPERIMENTAL',
    capabilityId:
      HOST_GOVERNANCE_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID,
    statement:
      'R119 binds the exact R110 through R118 custody chain, witnesses the recurring untrusted policy-authority dependency, and blocks automatic recursion until independently authenticated host evidence satisfies all six external authority capabilities.',
    boundaries: [
      'This is deterministic transient analysis, not a claim of a literal artifact-graph cycle.',
      'No caller-supplied policy, signature, request, witness, or preflight report becomes host authority.',
      'No endpoint, transport, signer-key binding, admission, persistence, owner resolution, debit, or world mutation is performed.'
    ]
  };
}
