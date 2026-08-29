import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_RESOLUTION_PREFLIGHT_SCHEMA,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflightContractReceiptValid,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflightValid
} from './matrix-thermal-endpoint-resolver-provider-verification-recipient-resolution-preflight.mjs?v=0.129.0-r129.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-verification-recipient-trust-bootstrap-recursion-preflight-contract-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-verification-recipient-trust-bootstrap-recursion-witness/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-verification-recipient-trust-bootstrap-closure-preflight/v1';

export const
  EXTERNAL_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID =
    'analysis.foundation-planet.external-provider-verification.verification-recipient.trust-bootstrap.recursion.detect';
export const
  EXTERNAL_PROVIDER_VERIFICATION_VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID =
    'authority.foundation-planet.external-provider-verification.verifier-route.trust-anchor.resolve';

const RESOLVER_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.endpoint.resolve';
const TRANSPORT_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.request.send-receive';
const CONTRACT_STATUS =
  'VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_AVAILABLE';
const EMPTY_WITNESS_STATUS =
  'NO_COMPATIBLE_VERIFICATION_RECIPIENT_ROUTE_RECURSION_WITNESS_EMPTY';
const WITNESS_STATUS =
  'RECURSIVE_UNTRUSTED_RESOLVER_PROVIDER_DEPENDENCY_WITNESSED';
const EMPTY_PREFLIGHT_STATUS =
  'NO_COMPATIBLE_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_PREFLIGHT_EMPTY';
const BLOCKED_PREFLIGHT_STATUS =
  'BLOCKED_RECURSIVE_UNTRUSTED_RESOLVER_PROVIDER_DEPENDENCY';
const RECURSION_PATTERN =
  'UNVERIFIED_RESOLVER_PROVIDER_REQUIRES_A_VERIFIER_ROUTE_RESOLVED_BY_ANOTHER_UNVERIFIED_RESOLVER_PROVIDER';
const CLOSURE_REASON =
  'NO_OUT_OF_BAND_AUTHORITY_ANCHORED_VERIFIER_ROUTE_BINDING';
const EMISSION_MODE =
  'transient-analysis-from-exact-r129-compatible-unverified-verification-recipient-route';
const MAXIMUM_ROUTES = 1;
const STAGES_PER_ROUTE = 5;
const EVIDENCE_REQUIREMENTS_PER_ROUTE = 6;
const MAXIMUM_SERIALIZED_WITNESS_BYTES = 262144;
const MAXIMUM_SERIALIZED_PREFLIGHT_BYTES = 262144;
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

function boundaryValid(boundary, contract = null) {
  const valid = exactKeys(boundary, ['r129Contract', 'r129Preflight',
    'r129Source', 'r129Declarations', 'r129Custody']) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflightContractReceiptValid(
      boundary.r129Contract, boundary.r129Custody) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflightValid(
      boundary.r129Preflight, boundary.r129Contract, boundary.r129Source,
      boundary.r129Declarations);
  return valid && (contract === null ||
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionPreflightContractReceiptValid(
      contract) && exact(contract.sourceR129, {
      contract: sourceRef(boundary.r129Contract),
      preflight: sourceRef(boundary.r129Preflight)
    }) && contract.projection.sourceRequestPacketCount ===
      boundary.r129Preflight.summary.sourceRequestPacketCount &&
    contract.projection.sourceCompatibleRouteCount ===
      boundary.r129Preflight.summary.compatibleUnverifiedEndpointCount);
}

const compatibleEndpoints = boundary => boundary.r129Preflight.endpoints
  .filter(endpoint => endpoint.status ===
    'RECIPIENT_ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED');

const expectedContractTruth = () => ({
  exactR129ContractPreflightDeclarationsAndCustodyBound: true,
  compatibleRouteRecursionMayBeAnalyzed: true,
  literalArtifactGraphCycleMayBeClaimed: false,
  anotherUnverifiedResolverMayCloseTrustBootstrap: false,
  callerDeclaredDependencyListMayProveIndependence: false,
  automaticRecursiveContinuationAllowed: false,
  analysisOnly: true,
  endpointResolved: false,
  recipientAuthenticated: false,
  transportPerformed: false,
  resolverProviderVerified: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  persistencePerformed: false,
  worldMutationPerformed: false
});

function expectedContract(boundary) {
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA,
    status: CONTRACT_STATUS,
    sourceR129: {
      contract: sourceRef(boundary.r129Contract),
      preflight: sourceRef(boundary.r129Preflight)
    },
    projection: {
      sourceRequestPacketCount:
        boundary.r129Preflight.summary.sourceRequestPacketCount,
      sourceCompatibleRouteCount: compatibleEndpoints(boundary).length,
      recursionWitnessSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA,
      closurePreflightSchema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA,
      recurringResolverCapabilityId: RESOLVER_CAPABILITY_ID,
      requiredAuthorityCapabilityId:
        EXTERNAL_PROVIDER_VERIFICATION_VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
      requiredTransportCapabilityId: TRANSPORT_CAPABILITY_ID,
      implementedAnalyticalCapabilityId:
        EXTERNAL_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID
    },
    resourceBudget: {
      maximumRoutes: MAXIMUM_ROUTES,
      stagesPerRoute: STAGES_PER_ROUTE,
      evidenceRequirementsPerRoute: EVIDENCE_REQUIREMENTS_PER_ROUTE,
      maximumSerializedWitnessBytes: MAXIMUM_SERIALIZED_WITNESS_BYTES,
      maximumSerializedPreflightBytes: MAXIMUM_SERIALIZED_PREFLIGHT_BYTES
    },
    emission: { mode: EMISSION_MODE },
    truth: expectedContractTruth()
  };
  receipt.digest = stableDigest(receipt);
  return receipt;
}

export function
landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionPreflightContractReceiptValid(
  receipt, boundary = null) {
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA) ||
      !exactKeys(receipt, ['schema', 'status', 'sourceR129', 'projection',
        'resourceBudget', 'emission', 'truth', 'digest']) ||
      !exactKeys(receipt.sourceR129, ['contract', 'preflight']) ||
      !Object.values(receipt.sourceR129).every(ref => exactKeys(ref,
        ['schema', 'receiptDigest']) && fnvDigest(ref.receiptDigest)) ||
      receipt.sourceR129.contract.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_RESOLUTION_PREFLIGHT_CONTRACT_RECEIPT_SCHEMA ||
      receipt.sourceR129.preflight.schema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_RESOLUTION_PREFLIGHT_SCHEMA ||
      !exactKeys(receipt.projection, ['sourceRequestPacketCount',
        'sourceCompatibleRouteCount', 'recursionWitnessSchema',
        'closurePreflightSchema', 'recurringResolverCapabilityId',
        'requiredAuthorityCapabilityId', 'requiredTransportCapabilityId',
        'implementedAnalyticalCapabilityId']) ||
      !Number.isInteger(receipt.projection.sourceRequestPacketCount) ||
      receipt.projection.sourceRequestPacketCount < 0 ||
      receipt.projection.sourceRequestPacketCount > MAXIMUM_ROUTES ||
      !Number.isInteger(receipt.projection.sourceCompatibleRouteCount) ||
      receipt.projection.sourceCompatibleRouteCount < 0 ||
      receipt.projection.sourceCompatibleRouteCount > MAXIMUM_ROUTES ||
      receipt.projection.sourceCompatibleRouteCount >
        receipt.projection.sourceRequestPacketCount ||
      receipt.projection.recursionWitnessSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA ||
      receipt.projection.closurePreflightSchema !==
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA ||
      receipt.projection.recurringResolverCapabilityId !==
        RESOLVER_CAPABILITY_ID ||
      receipt.projection.requiredAuthorityCapabilityId !==
        EXTERNAL_PROVIDER_VERIFICATION_VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID ||
      receipt.projection.requiredTransportCapabilityId !==
        TRANSPORT_CAPABILITY_ID ||
      receipt.projection.implementedAnalyticalCapabilityId !==
        EXTERNAL_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID ||
      !exact(receipt.resourceBudget, {
        maximumRoutes: MAXIMUM_ROUTES,
        stagesPerRoute: STAGES_PER_ROUTE,
        evidenceRequirementsPerRoute: EVIDENCE_REQUIREMENTS_PER_ROUTE,
        maximumSerializedWitnessBytes: MAXIMUM_SERIALIZED_WITNESS_BYTES,
        maximumSerializedPreflightBytes: MAXIMUM_SERIALIZED_PREFLIGHT_BYTES
      }) || !exact(receipt.emission, { mode: EMISSION_MODE }) ||
      receipt.status !== CONTRACT_STATUS ||
      !exact(receipt.truth, expectedContractTruth())) return false;
  return boundary === null || boundaryValid(boundary) &&
    exact(receipt, expectedContract(boundary));
}

export function
createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionPreflightContractReceipt(
  boundary) {
  if (!boundaryValid(boundary)) {
    throw new Error(
      'Verification-recipient trust-bootstrap recursion contract needs the exact R129 contract, preflight, source, declarations, and custody');
  }
  return expectedContract(boundary);
}

function expectedStages(boundary, endpoint) {
  return [
    {
      ordinal: 1,
      role: 'R128_CANDIDATE_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_UNRESOLVED',
      sourceArtifact: sourceRef(boundary.r129Source.r128Batch),
      requiredCapabilityId: RESOLVER_CAPABILITY_ID,
      authorityEstablished: false
    },
    {
      ordinal: 2,
      role: 'R129_CALLER_DECLARED_ALTERNATE_RESOLVER_PROVIDER_UNVERIFIED',
      sourceArtifact: sourceRef(boundary.r129Preflight),
      requiredCapabilityId: RESOLVER_CAPABILITY_ID,
      authorityEstablished: false
    },
    {
      ordinal: 3,
      role: 'ALTERNATE_RESOLVER_REQUIRES_THE_SAME_PROVIDER_PROOF_AND_VERIFIER_ROUTE_BOUNDARY',
      sourceArtifact: sourceRef(boundary.r129Contract),
      requiredCapabilityId: RESOLVER_CAPABILITY_ID,
      authorityEstablished: false
    },
    {
      ordinal: 4,
      role: 'ANOTHER_UNVERIFIED_RESOLVER_PROVIDER_WOULD_REENTER_THE_R126_THROUGH_R129_DEPENDENCY_CLASS',
      sourceArtifact: sourceRef(boundary.r129Preflight),
      requiredCapabilityId: RESOLVER_CAPABILITY_ID,
      authorityEstablished: false
    },
    {
      ordinal: 5,
      role: 'OUT_OF_BAND_AUTHORITY_TRUST_ANCHOR_REQUIRED_TO_TERMINATE_RECURSION',
      sourceArtifact: {
        schema: 'axm.foundation-planet.external-verifier-route-trust-anchor-authority-boundary/v1',
        receiptDigest: stableDigest({
          requestId: endpoint.requestId,
          claimedVerificationRecipientId:
            endpoint.claimedVerificationRecipientId,
          requiredAuthorityCapabilityId:
            EXTERNAL_PROVIDER_VERIFICATION_VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID
        })
      },
      requiredCapabilityId:
        EXTERNAL_PROVIDER_VERIFICATION_VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
      authorityEstablished: false
    }
  ];
}

const expectedRouteTruth = () => ({
  exactR129CompatibleRouteBound: true,
  recursiveUntrustedResolverDependencyWitnessed: true,
  literalArtifactGraphCycleAsserted: false,
  alternateResolverIndependentlyVerified: false,
  outOfBandAuthorityTrustAnchorPresent: false,
  witnessMayAuthorizeOrResolve: false,
  endpointResolved: false,
  recipientAuthenticated: false,
  transportPerformed: false,
  resolverProviderVerified: false,
  persistencePerformed: false,
  worldMutationPerformed: false
});

function expectedRouteWitness(boundary, endpoint) {
  const assessment = boundary.r129Preflight.assessments.find(item =>
    endpoint.declarationInputIndexes.includes(item.inputIndex) &&
    item.status === 'RECIPIENT_ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED');
  return {
    routeId: endpoint.requestId + '.verifier-route-trust-bootstrap',
    requestId: endpoint.requestId,
    requestPacketDigest: endpoint.requestPacketDigest,
    sourceEndpointProjectionDigest: stableDigest(endpoint),
    sourceDeclarationDigest: assessment.declarationDigest,
    candidateResolverProviderId: endpoint.candidateResolverProviderId,
    claimedVerificationRecipientId:
      endpoint.claimedVerificationRecipientId,
    alternateResolverProviderId: endpoint.alternateResolverProviderId,
    claimedLocatorKind: endpoint.claimedLocatorKind,
    claimedLocatorValue: endpoint.claimedLocatorValue,
    pattern: RECURSION_PATTERN,
    stages: expectedStages(boundary, endpoint),
    recurringDependency: {
      capabilityId: RESOLVER_CAPABILITY_ID,
      firstUntrustedResolverStageOrdinal: 2,
      repeatedDependencyStageOrdinal: 4,
      alternateResolverProviderTrust: 'CALLER_SUPPLIED_UNTRUSTED',
      independentlyAnchoredOutcomePresent: false
    },
    closure: { closed: false, reason: CLOSURE_REASON },
    truth: expectedRouteTruth()
  };
}

function expectedWitness(contract, boundary) {
  const routes = compatibleEndpoints(boundary).map(endpoint =>
    expectedRouteWitness(boundary, endpoint));
  const witness = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA,
    status: routes.length === 0 ? EMPTY_WITNESS_STATUS : WITNESS_STATUS,
    sourceContract: sourceRef(contract),
    sourceR129: {
      contract: sourceRef(boundary.r129Contract),
      preflight: sourceRef(boundary.r129Preflight)
    },
    routes,
    summary: {
      sourceRequestPacketCount:
        boundary.r129Preflight.summary.sourceRequestPacketCount,
      sourceCompatibleRouteCount: routes.length,
      recursionWitnessCount: routes.length,
      stageCount: routes.length * STAGES_PER_ROUTE,
      independentlyAnchoredRouteCount: 0,
      endpointResolvedCount: 0,
      transportPerformedCount: 0
    },
    truth: {
      exactR129CompatibleRoutesBound: true,
      recursiveUntrustedResolverDependencyWitnessed: routes.length > 0,
      literalArtifactGraphCycleAsserted: false,
      independentTrustBootstrapClosurePresent: false,
      automaticRecursiveContinuationAllowed: false,
      witnessMayAuthorizeOrResolve: false,
      endpointResolved: false,
      recipientAuthenticated: false,
      transportPerformed: false,
      resolverProviderVerified: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  };
  witness.digest = stableDigest(witness);
  return witness;
}

function stageShapeValid(stage, index) {
  return exactKeys(stage, ['ordinal', 'role', 'sourceArtifact',
    'requiredCapabilityId', 'authorityEstablished']) &&
    stage.ordinal === index + 1 && typeof stage.role === 'string' &&
    exactKeys(stage.sourceArtifact, ['schema', 'receiptDigest']) &&
    typeof stage.sourceArtifact.schema === 'string' &&
    fnvDigest(stage.sourceArtifact.receiptDigest) &&
    [RESOLVER_CAPABILITY_ID,
      EXTERNAL_PROVIDER_VERIFICATION_VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID]
      .includes(stage.requiredCapabilityId) &&
    stage.authorityEstablished === false;
}

function routeWitnessShapeValid(route) {
  return exactKeys(route, ['routeId', 'requestId', 'requestPacketDigest',
    'sourceEndpointProjectionDigest', 'sourceDeclarationDigest',
    'candidateResolverProviderId', 'claimedVerificationRecipientId',
    'alternateResolverProviderId', 'claimedLocatorKind',
    'claimedLocatorValue', 'pattern', 'stages', 'recurringDependency',
    'closure', 'truth']) &&
    [route.routeId, route.requestId, route.requestPacketDigest,
      route.sourceEndpointProjectionDigest, route.sourceDeclarationDigest,
      route.candidateResolverProviderId,
      route.claimedVerificationRecipientId,
      route.alternateResolverProviderId, route.claimedLocatorKind,
      route.claimedLocatorValue].every(value => typeof value === 'string') &&
    fnvDigest(route.sourceEndpointProjectionDigest) &&
    fnvDigest(route.sourceDeclarationDigest) &&
    route.pattern === RECURSION_PATTERN &&
    Array.isArray(route.stages) &&
    route.stages.length === STAGES_PER_ROUTE &&
    route.stages.every(stageShapeValid) &&
    exact(route.recurringDependency, {
      capabilityId: RESOLVER_CAPABILITY_ID,
      firstUntrustedResolverStageOrdinal: 2,
      repeatedDependencyStageOrdinal: 4,
      alternateResolverProviderTrust: 'CALLER_SUPPLIED_UNTRUSTED',
      independentlyAnchoredOutcomePresent: false
    }) && exact(route.closure, {
      closed: false,
      reason: CLOSURE_REASON
    }) && exact(route.truth, expectedRouteTruth());
}

export function
landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionWitnessValid(
  witness, contract = null, boundary = null) {
  if (!digestValid(witness,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_WITNESS_SCHEMA) ||
      !exactKeys(witness, ['schema', 'status', 'sourceContract',
        'sourceR129', 'routes', 'summary', 'truth', 'digest']) ||
      !exactKeys(witness.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(witness.sourceR129, ['contract', 'preflight']) ||
      !Object.values(witness.sourceR129).every(ref => exactKeys(ref,
        ['schema', 'receiptDigest'])) ||
      !Array.isArray(witness.routes) ||
      witness.routes.length > MAXIMUM_ROUTES ||
      !witness.routes.every(routeWitnessShapeValid) ||
      !exactKeys(witness.summary, ['sourceRequestPacketCount',
        'sourceCompatibleRouteCount', 'recursionWitnessCount', 'stageCount',
        'independentlyAnchoredRouteCount', 'endpointResolvedCount',
        'transportPerformedCount']) ||
      !Number.isInteger(witness.summary.sourceRequestPacketCount) ||
      witness.summary.sourceRequestPacketCount < 0 ||
      witness.summary.sourceRequestPacketCount > MAXIMUM_ROUTES ||
      witness.summary.sourceCompatibleRouteCount !== witness.routes.length ||
      witness.summary.recursionWitnessCount !== witness.routes.length ||
      witness.summary.stageCount !==
        witness.routes.length * STAGES_PER_ROUTE ||
      witness.summary.independentlyAnchoredRouteCount !== 0 ||
      witness.summary.endpointResolvedCount !== 0 ||
      witness.summary.transportPerformedCount !== 0 ||
      !exact(witness.truth, {
        exactR129CompatibleRoutesBound: true,
        recursiveUntrustedResolverDependencyWitnessed:
          witness.routes.length > 0,
        literalArtifactGraphCycleAsserted: false,
        independentTrustBootstrapClosurePresent: false,
        automaticRecursiveContinuationAllowed: false,
        witnessMayAuthorizeOrResolve: false,
        endpointResolved: false,
        recipientAuthenticated: false,
        transportPerformed: false,
        resolverProviderVerified: false,
        persistencePerformed: false,
        worldMutationPerformed: false
      }) || ![EMPTY_WITNESS_STATUS, WITNESS_STATUS].includes(
        witness.status) || (witness.routes.length === 0
        ? witness.status !== EMPTY_WITNESS_STATUS
        : witness.status !== WITNESS_STATUS) ||
      new TextEncoder().encode(JSON.stringify(witness)).length >
        MAXIMUM_SERIALIZED_WITNESS_BYTES) return false;
  return contract === null && boundary === null ||
    contract !== null && boundary !== null && boundaryValid(boundary) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionPreflightContractReceiptValid(
      contract, boundary) && exact(witness, expectedWitness(contract, boundary));
}

export function
createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionWitness(
  contract, boundary) {
  if (!landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionPreflightContractReceiptValid(
      contract, boundary)) {
    throw new Error(
      'Verification-recipient trust-bootstrap recursion witness needs the exact R130 contract and R129 boundary');
  }
  const witness = expectedWitness(contract, boundary);
  if (new TextEncoder().encode(JSON.stringify(witness)).length >
      MAXIMUM_SERIALIZED_WITNESS_BYTES) {
    throw new Error('Trust-bootstrap recursion witness exceeds its resource ceiling');
  }
  return witness;
}

function expectedExternalEvidence(route) {
  return [
    {
      routeId: route.routeId,
      evidenceId: 'out-of-band-trust-anchor-authority-designation-receipt',
      requiredCapabilityId:
        EXTERNAL_PROVIDER_VERIFICATION_VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
      acceptanceBoundary:
        'MIKE_TOBI_OR_AUTHENTICATED_HOST_GOVERNANCE_SEAT_DESIGNATES_THE_EXACT_TRUST_ANCHOR_WITHOUT_CANDIDATE_OR_ALTERNATE_RESOLVER_CONTROL'
    },
    {
      routeId: route.routeId,
      evidenceId: 'exact-verifier-route-binding-receipt',
      requiredCapabilityId:
        EXTERNAL_PROVIDER_VERIFICATION_VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
      acceptanceBoundary:
        'AUTHORITY_BINDS_EXACT_REQUEST_VERIFIER_ID_LOCATOR_AND_R129_DECLARATION_DIGEST'
    },
    {
      routeId: route.routeId,
      evidenceId: 'trust-anchor-provenance-and-revocation-receipt',
      requiredCapabilityId:
        EXTERNAL_PROVIDER_VERIFICATION_VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
      acceptanceBoundary:
        'ANCHOR_ORIGIN_KEY_VERSION_VALIDITY_AND_REVOCATION_STATE_INDEPENDENTLY_VERIFIED'
    },
    {
      routeId: route.routeId,
      evidenceId: 'allowed-and-denied-anchor-identity-probe-receipts',
      requiredCapabilityId:
        EXTERNAL_PROVIDER_VERIFICATION_VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
      acceptanceBoundary:
        'MATCHED_ALLOWED_AND_DENIED_IDENTITY_PROBES_BOUND_TO_THE_EXACT_ANCHOR_AND_ROUTE'
    },
    {
      routeId: route.routeId,
      evidenceId: 'endpoint-ownership-and-verifier-identity-receipts',
      requiredCapabilityId:
        EXTERNAL_PROVIDER_VERIFICATION_VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
      acceptanceBoundary:
        'INDEPENDENT_RECEIPTS_BIND_ENDPOINT_CONTROL_TO_THE_EXACT_CLAIMED_VERIFIER'
    },
    {
      routeId: route.routeId,
      evidenceId: 'per-request-contact-authority-and-matched-transport-receipts',
      requiredCapabilityId: TRANSPORT_CAPABILITY_ID,
      acceptanceBoundary:
        'EXACT_REQUEST_AUTHORITY_AND_CONSENT_PLUS_MATCHED_SENDER_AND_RECEIVER_RECEIPTS'
    }
  ];
}

function expectedRouteClosure(route) {
  return {
    routeId: route.routeId,
    status: 'BLOCKED_EXTERNAL_TRUST_ANCHOR_AND_TRANSPORT_REQUIRED',
    missingCapabilityIds: [
      EXTERNAL_PROVIDER_VERIFICATION_VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
      TRANSPORT_CAPABILITY_ID
    ],
    requiredEvidenceIds: expectedExternalEvidence(route)
      .map(item => item.evidenceId),
    automaticContinuationAllowed: false,
    endpointResolved: false,
    recipientAuthenticated: false,
    transportPerformed: false,
    resolverProviderVerified: false
  };
}

function expectedReport(contract, witness) {
  const active = witness.routes.length > 0;
  const requiredExternalEvidence = witness.routes.flatMap(
    expectedExternalEvidence);
  const report = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA,
    status: active ? BLOCKED_PREFLIGHT_STATUS : EMPTY_PREFLIGHT_STATUS,
    sourceContract: sourceRef(contract),
    sourceWitness: sourceRef(witness),
    routeClosures: witness.routes.map(expectedRouteClosure),
    capabilityGap: {
      overall: active ? 'BLOCKED' : 'NO_ACTIVE_ROUTE',
      availableAnalyticalCapabilityIds: [
        EXTERNAL_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID
      ],
      missingCapabilityIds: active ? [
        EXTERNAL_PROVIDER_VERIFICATION_VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
        TRANSPORT_CAPABILITY_ID
      ] : []
    },
    requiredExternalEvidence,
    prohibitedAutomaticContinuation: {
      createAnotherUnverifiedResolverProviderChain: true,
      reuseCandidateResolverForItsOwnVerifier: true,
      treatDistinctProviderIdentifierAsIndependenceProof: true,
      treatCallerDependencyListAsNonCircularProof: true,
      treatWitnessOrPreflightAsAuthorityOrResolution: true,
      persistTransientTrustBootstrapArtifacts: true
    },
    summary: {
      activeRouteCount: witness.routes.length,
      blockedRouteCount: witness.routes.length,
      requiredExternalEvidenceCount: requiredExternalEvidence.length,
      authorityAnchoredRouteCount: 0,
      endpointResolvedCount: 0,
      recipientAuthenticatedCount: 0,
      transmittedRequestCount: 0,
      resolverProviderVerifiedCount: 0
    },
    truth: {
      localAnalysisCapabilityReady: true,
      activeCompatibleRoutePresent: active,
      recursiveUntrustedResolverDependencyWitnessed: active,
      allRequiredAuthorityAndTransportCapabilitiesAvailable: false,
      independentlyAuthenticatedExternalEvidencePresent: false,
      trustBootstrapClosureReady: false,
      recursiveRequestGenerationPermitted: false,
      reportMayAuthorizeResolveOrTransmit: false,
      endpointResolved: false,
      recipientAuthenticated: false,
      transportPerformed: false,
      resolverProviderVerified: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      persistencePerformed: false,
      worldMutationPerformed: false
    }
  };
  report.digest = stableDigest(report);
  return report;
}

function externalEvidenceShapeValid(entry, routeIds) {
  return exactKeys(entry, ['routeId', 'evidenceId',
    'requiredCapabilityId', 'acceptanceBoundary']) &&
    routeIds.includes(entry.routeId) && typeof entry.evidenceId === 'string' &&
    [EXTERNAL_PROVIDER_VERIFICATION_VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
      TRANSPORT_CAPABILITY_ID].includes(entry.requiredCapabilityId) &&
    typeof entry.acceptanceBoundary === 'string';
}

export function
landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapClosurePreflightValid(
  report, contract = null, witness = null, boundary = null) {
  const routeIds = Array.isArray(report?.routeClosures)
    ? report.routeClosures.map(item => item?.routeId) : [];
  const active = routeIds.length > 0;
  if (!digestValid(report,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_CLOSURE_PREFLIGHT_SCHEMA) ||
      !exactKeys(report, ['schema', 'status', 'sourceContract',
        'sourceWitness', 'routeClosures', 'capabilityGap',
        'requiredExternalEvidence', 'prohibitedAutomaticContinuation',
        'summary', 'truth', 'digest']) ||
      !exactKeys(report.sourceContract, ['schema', 'receiptDigest']) ||
      !exactKeys(report.sourceWitness, ['schema', 'receiptDigest']) ||
      !Array.isArray(report.routeClosures) ||
      report.routeClosures.length > MAXIMUM_ROUTES ||
      !report.routeClosures.every(item => exactKeys(item,
        ['routeId', 'status', 'missingCapabilityIds',
          'requiredEvidenceIds', 'automaticContinuationAllowed',
          'endpointResolved', 'recipientAuthenticated',
          'transportPerformed', 'resolverProviderVerified']) &&
        typeof item.routeId === 'string' && item.status ===
          'BLOCKED_EXTERNAL_TRUST_ANCHOR_AND_TRANSPORT_REQUIRED' &&
        exact(item.missingCapabilityIds, [
          EXTERNAL_PROVIDER_VERIFICATION_VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
          TRANSPORT_CAPABILITY_ID
        ]) && Array.isArray(item.requiredEvidenceIds) &&
        item.requiredEvidenceIds.length ===
          EVIDENCE_REQUIREMENTS_PER_ROUTE &&
        [item.automaticContinuationAllowed, item.endpointResolved,
          item.recipientAuthenticated, item.transportPerformed,
          item.resolverProviderVerified].every(value => value === false)) ||
      !exactKeys(report.capabilityGap, ['overall',
        'availableAnalyticalCapabilityIds', 'missingCapabilityIds']) ||
      report.capabilityGap.overall !==
        (active ? 'BLOCKED' : 'NO_ACTIVE_ROUTE') ||
      !exact(report.capabilityGap.availableAnalyticalCapabilityIds, [
        EXTERNAL_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID
      ]) || !exact(report.capabilityGap.missingCapabilityIds, active ? [
        EXTERNAL_PROVIDER_VERIFICATION_VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
        TRANSPORT_CAPABILITY_ID
      ] : []) || !Array.isArray(report.requiredExternalEvidence) ||
      report.requiredExternalEvidence.length !== routeIds.length *
        EVIDENCE_REQUIREMENTS_PER_ROUTE ||
      !report.requiredExternalEvidence.every(entry =>
        externalEvidenceShapeValid(entry, routeIds)) ||
      !exactKeys(report.prohibitedAutomaticContinuation,
        ['createAnotherUnverifiedResolverProviderChain',
          'reuseCandidateResolverForItsOwnVerifier',
          'treatDistinctProviderIdentifierAsIndependenceProof',
          'treatCallerDependencyListAsNonCircularProof',
          'treatWitnessOrPreflightAsAuthorityOrResolution',
          'persistTransientTrustBootstrapArtifacts']) ||
      !Object.values(report.prohibitedAutomaticContinuation)
        .every(value => value === true) ||
      !exact(report.summary, {
        activeRouteCount: routeIds.length,
        blockedRouteCount: routeIds.length,
        requiredExternalEvidenceCount:
          routeIds.length * EVIDENCE_REQUIREMENTS_PER_ROUTE,
        authorityAnchoredRouteCount: 0,
        endpointResolvedCount: 0,
        recipientAuthenticatedCount: 0,
        transmittedRequestCount: 0,
        resolverProviderVerifiedCount: 0
      }) || !exact(report.truth, {
        localAnalysisCapabilityReady: true,
        activeCompatibleRoutePresent: active,
        recursiveUntrustedResolverDependencyWitnessed: active,
        allRequiredAuthorityAndTransportCapabilitiesAvailable: false,
        independentlyAuthenticatedExternalEvidencePresent: false,
        trustBootstrapClosureReady: false,
        recursiveRequestGenerationPermitted: false,
        reportMayAuthorizeResolveOrTransmit: false,
        endpointResolved: false,
        recipientAuthenticated: false,
        transportPerformed: false,
        resolverProviderVerified: false,
        historicalPhysicalSourceOwnersResolved: false,
        historicalPhysicalSourceOwnersDebited: false,
        persistencePerformed: false,
        worldMutationPerformed: false
      }) || report.status !== (active ? BLOCKED_PREFLIGHT_STATUS :
        EMPTY_PREFLIGHT_STATUS) ||
      new TextEncoder().encode(JSON.stringify(report)).length >
        MAXIMUM_SERIALIZED_PREFLIGHT_BYTES) return false;
  if (contract === null && witness === null && boundary === null) return true;
  return contract !== null && witness !== null && boundary !== null &&
    boundaryValid(boundary) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionPreflightContractReceiptValid(
      contract, boundary) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionWitnessValid(
      witness, contract, boundary) && exact(report,
      expectedReport(contract, witness));
}

export function
createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapClosurePreflight(
  contract, witness, boundary) {
  if (!landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionPreflightContractReceiptValid(
      contract, boundary) ||
      !landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionWitnessValid(
        witness, contract, boundary)) {
    throw new Error(
      'Verification-recipient trust-bootstrap closure preflight needs the exact R130 contract, witness, and R129 boundary');
  }
  const report = expectedReport(contract, witness);
  if (new TextEncoder().encode(JSON.stringify(report)).length >
      MAXIMUM_SERIALIZED_PREFLIGHT_BYTES) {
    throw new Error('Trust-bootstrap closure preflight exceeds its resource ceiling');
  }
  return report;
}

export function
matrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionPreflightDescription() {
  return {
    status: 'EXPERIMENTAL',
    capabilityId:
      EXTERNAL_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_DETECT_CAPABILITY_ID,
    statement:
      'R130 binds the exact R129 boundary, witnesses when another unverified resolver-provider chain would reproduce the same verifier-route dependency, and blocks automatic recursion pending an out-of-band authority-anchored route plus matched transport receipts.',
    boundaries: [
      'The current real R129 compatible-route inventory is empty, so the current witness and closure preflight are empty.',
      'This is deterministic dependency-class analysis, not a claim of a literal artifact-graph cycle or proof that every external resolver implementation is recursive.',
      'No trust anchor is configured, no provider is selected, no endpoint or recipient is resolved or authenticated, and no resolver execution, contact, transport, persistence, evidence admission, owner/debit mutation, promotion, canonization, or world mutation is performed.'
    ]
  };
}
