import {
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflightContractReceiptValid,
  landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflightValid
} from './matrix-thermal-endpoint-resolver-provider-verification-recipient-resolution-preflight.mjs?v=0.129.0-r129.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_AUDIT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-verification-recipient-trust-bootstrap-recursion-preflight-audit/v1';

const CONTRACT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-verification-recipient-trust-bootstrap-recursion-preflight-contract-receipt/v1';
const WITNESS_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-verification-recipient-trust-bootstrap-recursion-witness/v1';
const PREFLIGHT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-historical-source-owner-debit-external-capability-provider-verification-endpoint-resolver-provider-verification-recipient-trust-bootstrap-closure-preflight/v1';
const ANALYSIS_CAPABILITY_ID =
  'analysis.foundation-planet.external-provider-verification.verification-recipient.trust-bootstrap.recursion.detect';
const AUTHORITY_CAPABILITY_ID =
  'authority.foundation-planet.external-provider-verification.verifier-route.trust-anchor.resolve';
const RESOLVER_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.endpoint.resolve';
const TRANSPORT_CAPABILITY_ID =
  'transport.foundation-planet.external-provider-verification.request.send-receive';
const RECURSION_PATTERN =
  'UNVERIFIED_RESOLVER_PROVIDER_REQUIRES_A_VERIFIER_ROUTE_RESOLVED_BY_ANOTHER_UNVERIFIED_RESOLVER_PROVIDER';
const CLOSURE_REASON =
  'NO_OUT_OF_BAND_AUTHORITY_ANCHORED_VERIFIER_ROUTE_BINDING';
const EMISSION_MODE =
  'transient-analysis-from-exact-r129-compatible-unverified-verification-recipient-route';
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

function exactBoundaryValid(boundary) {
  return exactKeys(boundary, ['r129Contract', 'r129Preflight',
    'r129Source', 'r129Declarations', 'r129Custody']) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflightContractReceiptValid(
      boundary.r129Contract, boundary.r129Custody) &&
    landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflightValid(
      boundary.r129Preflight, boundary.r129Contract, boundary.r129Source,
      boundary.r129Declarations);
}

const compatibleEndpoints = boundary => boundary.r129Preflight.endpoints
  .filter(endpoint => endpoint.status ===
    'RECIPIENT_ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED');

function expectedContract(boundary) {
  const receipt = {
    schema: CONTRACT_SCHEMA,
    status:
      'VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_AVAILABLE',
    sourceR129: {
      contract: sourceRef(boundary.r129Contract),
      preflight: sourceRef(boundary.r129Preflight)
    },
    projection: {
      sourceRequestPacketCount:
        boundary.r129Preflight.summary.sourceRequestPacketCount,
      sourceCompatibleRouteCount: compatibleEndpoints(boundary).length,
      recursionWitnessSchema: WITNESS_SCHEMA,
      closurePreflightSchema: PREFLIGHT_SCHEMA,
      recurringResolverCapabilityId: RESOLVER_CAPABILITY_ID,
      requiredAuthorityCapabilityId: AUTHORITY_CAPABILITY_ID,
      requiredTransportCapabilityId: TRANSPORT_CAPABILITY_ID,
      implementedAnalyticalCapabilityId: ANALYSIS_CAPABILITY_ID
    },
    resourceBudget: {
      maximumRoutes: 1,
      stagesPerRoute: 5,
      evidenceRequirementsPerRoute: 6,
      maximumSerializedWitnessBytes: MAXIMUM_SERIALIZED_WITNESS_BYTES,
      maximumSerializedPreflightBytes: MAXIMUM_SERIALIZED_PREFLIGHT_BYTES
    },
    emission: { mode: EMISSION_MODE },
    truth: {
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
    }
  };
  receipt.digest = stableDigest(receipt);
  return receipt;
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
          requiredAuthorityCapabilityId: AUTHORITY_CAPABILITY_ID
        })
      },
      requiredCapabilityId: AUTHORITY_CAPABILITY_ID,
      authorityEstablished: false
    }
  ];
}

function expectedRoute(boundary, endpoint) {
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
    truth: {
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
    }
  };
}

function expectedWitness(contract, boundary) {
  const routes = compatibleEndpoints(boundary).map(endpoint =>
    expectedRoute(boundary, endpoint));
  const receipt = {
    schema: WITNESS_SCHEMA,
    status: routes.length === 0
      ? 'NO_COMPATIBLE_VERIFICATION_RECIPIENT_ROUTE_RECURSION_WITNESS_EMPTY'
      : 'RECURSIVE_UNTRUSTED_RESOLVER_PROVIDER_DEPENDENCY_WITNESSED',
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
      stageCount: routes.length * 5,
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
  receipt.digest = stableDigest(receipt);
  return receipt;
}

function expectedExternalEvidence(route) {
  return [
    {
      routeId: route.routeId,
      evidenceId: 'out-of-band-trust-anchor-authority-designation-receipt',
      requiredCapabilityId: AUTHORITY_CAPABILITY_ID,
      acceptanceBoundary:
        'MIKE_TOBI_OR_AUTHENTICATED_HOST_GOVERNANCE_SEAT_DESIGNATES_THE_EXACT_TRUST_ANCHOR_WITHOUT_CANDIDATE_OR_ALTERNATE_RESOLVER_CONTROL'
    },
    {
      routeId: route.routeId,
      evidenceId: 'exact-verifier-route-binding-receipt',
      requiredCapabilityId: AUTHORITY_CAPABILITY_ID,
      acceptanceBoundary:
        'AUTHORITY_BINDS_EXACT_REQUEST_VERIFIER_ID_LOCATOR_AND_R129_DECLARATION_DIGEST'
    },
    {
      routeId: route.routeId,
      evidenceId: 'trust-anchor-provenance-and-revocation-receipt',
      requiredCapabilityId: AUTHORITY_CAPABILITY_ID,
      acceptanceBoundary:
        'ANCHOR_ORIGIN_KEY_VERSION_VALIDITY_AND_REVOCATION_STATE_INDEPENDENTLY_VERIFIED'
    },
    {
      routeId: route.routeId,
      evidenceId: 'allowed-and-denied-anchor-identity-probe-receipts',
      requiredCapabilityId: AUTHORITY_CAPABILITY_ID,
      acceptanceBoundary:
        'MATCHED_ALLOWED_AND_DENIED_IDENTITY_PROBES_BOUND_TO_THE_EXACT_ANCHOR_AND_ROUTE'
    },
    {
      routeId: route.routeId,
      evidenceId: 'endpoint-ownership-and-verifier-identity-receipts',
      requiredCapabilityId: AUTHORITY_CAPABILITY_ID,
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

function expectedReport(contract, witness) {
  const active = witness.routes.length > 0;
  const evidence = witness.routes.flatMap(expectedExternalEvidence);
  const receipt = {
    schema: PREFLIGHT_SCHEMA,
    status: active
      ? 'BLOCKED_RECURSIVE_UNTRUSTED_RESOLVER_PROVIDER_DEPENDENCY'
      : 'NO_COMPATIBLE_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_PREFLIGHT_EMPTY',
    sourceContract: sourceRef(contract),
    sourceWitness: sourceRef(witness),
    routeClosures: witness.routes.map(route => ({
      routeId: route.routeId,
      status: 'BLOCKED_EXTERNAL_TRUST_ANCHOR_AND_TRANSPORT_REQUIRED',
      missingCapabilityIds: [AUTHORITY_CAPABILITY_ID,
        TRANSPORT_CAPABILITY_ID],
      requiredEvidenceIds: expectedExternalEvidence(route)
        .map(item => item.evidenceId),
      automaticContinuationAllowed: false,
      endpointResolved: false,
      recipientAuthenticated: false,
      transportPerformed: false,
      resolverProviderVerified: false
    })),
    capabilityGap: {
      overall: active ? 'BLOCKED' : 'NO_ACTIVE_ROUTE',
      availableAnalyticalCapabilityIds: [ANALYSIS_CAPABILITY_ID],
      missingCapabilityIds: active
        ? [AUTHORITY_CAPABILITY_ID, TRANSPORT_CAPABILITY_ID] : []
    },
    requiredExternalEvidence: evidence,
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
      requiredExternalEvidenceCount: evidence.length,
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
  receipt.digest = stableDigest(receipt);
  return receipt;
}

export function
auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionPreflight(
  contract, witness, report, boundary) {
  const exactBoundary = exactBoundaryValid(boundary);
  const expectedContractValue = exactBoundary
    ? expectedContract(boundary) : null;
  const contractMatches = expectedContractValue !== null &&
    exact(contract, expectedContractValue) &&
    digestValid(contract, CONTRACT_SCHEMA);
  const expectedWitnessValue = contractMatches
    ? expectedWitness(contract, boundary) : null;
  const witnessMatches = expectedWitnessValue !== null &&
    exact(witness, expectedWitnessValue) &&
    digestValid(witness, WITNESS_SCHEMA) &&
    new TextEncoder().encode(JSON.stringify(witness)).length <=
      MAXIMUM_SERIALIZED_WITNESS_BYTES;
  const expectedReportValue = witnessMatches
    ? expectedReport(contract, witness) : null;
  const reportMatches = expectedReportValue !== null &&
    exact(report, expectedReportValue) && digestValid(report,
      PREFLIGHT_SCHEMA) &&
    new TextEncoder().encode(JSON.stringify(report)).length <=
      MAXIMUM_SERIALIZED_PREFLIGHT_BYTES;
  const status = exactBoundary && contractMatches && witnessMatches &&
    reportMatches ? 'PASS' : 'FAIL';
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_TRUST_BOOTSTRAP_RECURSION_PREFLIGHT_AUDIT_SCHEMA,
    status,
    checks: {
      exactR129BoundaryValid: exactBoundary,
      independentlyReconstructedContractMatches: contractMatches,
      independentlyReconstructedWitnessMatches: witnessMatches,
      independentlyReconstructedClosurePreflightMatches: reportMatches
    },
    observed: {
      sourceCompatibleRouteCount: Number.isInteger(
        contract?.projection?.sourceCompatibleRouteCount)
        ? contract.projection.sourceCompatibleRouteCount : null,
      recursionWitnessCount: Number.isInteger(
        witness?.summary?.recursionWitnessCount)
        ? witness.summary.recursionWitnessCount : null,
      activeRouteCount: Number.isInteger(report?.summary?.activeRouteCount)
        ? report.summary.activeRouteCount : null,
      requiredExternalEvidenceCount: Number.isInteger(
        report?.summary?.requiredExternalEvidenceCount)
        ? report.summary.requiredExternalEvidenceCount : null,
      authorityAnchoredRouteCount: Number.isInteger(
        report?.summary?.authorityAnchoredRouteCount)
        ? report.summary.authorityAnchoredRouteCount : null
    },
    truth: {
      producerBuilderOrValidatorUsedAsAuditOracle: false,
      auditMayCreateAnotherResolverChain: false,
      auditMayConfigureOrTrustAnchor: false,
      auditMayAuthorizeResolveContactOrTransport: false,
      auditMayVerifySelectInstallOrExecuteProvider: false,
      auditMayMutatePersistPromoteOrCanonize: false
    }
  };
  receipt.digest = stableDigest(receipt);
  return receipt;
}
