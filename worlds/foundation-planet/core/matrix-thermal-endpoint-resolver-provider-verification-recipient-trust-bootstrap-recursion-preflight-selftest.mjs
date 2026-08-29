import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const fixturePath = process.argv[2];
if (!fixturePath) throw new Error('R130 selftest requires an exact R126 fixture');
const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
const fixtureBefore = JSON.stringify(fixture);
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const r126 = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-endpoint-resolver-capability-specification.mjs')).href);
const r127 = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-endpoint-resolver-provider-binding-preflight.mjs')).href);
const r128 = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-endpoint-resolver-provider-verification-request.mjs')).href);
const r129 = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-endpoint-resolver-provider-verification-recipient-resolution-preflight.mjs')).href);
const r130 = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-endpoint-resolver-provider-verification-recipient-trust-bootstrap-recursion-preflight.mjs')).href);
const audit = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-endpoint-resolver-provider-verification-recipient-trust-bootstrap-recursion-preflight-audit.mjs')).href);

function stableDigest(value) {
  const text = JSON.stringify(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return 'fnv1a32:' + (hash >>> 0).toString(16).padStart(8, '0');
}

function resign(value) {
  delete value.digest;
  value.digest = stableDigest(value);
  return value;
}

function createProviderDeclaration(
  providerId = 'selftest.endpoint-resolver.candidate') {
  const specification = fixture.r126FullBundle.specification;
  return resign({
    schema: r127
      .LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_DECLARATION_SCHEMA,
    providerId,
    providerVersion: '0.1.0-experimental',
    capabilityId: specification.capabilityId,
    providerClass: specification.providerClass,
    declarationTrust: 'CALLER_SUPPLIED_UNTRUSTED',
    specificationBinding: {
      specificationOrdinal: specification.ordinal,
      specificationCapabilityId: specification.capabilityId,
      specificationDigest: specification.digest,
      r126ContractDigest: fixture.r126FullContract.digest,
      r126BundleDigest: fixture.r126FullBundle.digest
    },
    outputBinding: {
      resultEnvelopeSchema: r126
        .LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_RESULT_ENVELOPE_SCHEMA,
      nativeResolverReceiptSchema:
        'selftest.endpoint-resolver.native-receipt/v1',
      nativeResolverReceiptSchemaStatus: 'CALLER_DECLARED_UNVERIFIED',
      requiredResultStatusCodes: structuredClone(
        specification.outputContract.requiredResultStatusCodes),
      requiredPreTransportProofIds: structuredClone(
        specification.outputContract.requiredPreTransportProofIds)
    },
    executionBoundary: {
      entrypointKind: 'INDEPENDENT_ENDPOINT_RESOLVER',
      locatorStatus: 'CALLER_SUPPLIED_UNVERIFIED',
      externalRegistryReadsDeclared: true,
      resolverExecutionRequested: false,
      endpointHumanOrHostContactRequested: false,
      contactOrTransportRequested: false,
      foundationPlanetWritesRequested: false
    },
    permissionsAndConsent: {
      exactAuthoritySeatPerRequestAcknowledged: true,
      selfAttestationSufficient: false,
      callerPolicyMaySelfAuthorizeContact: false,
      resolverMayGrantConsent: false,
      independentAuthorityAndConsentReceiptStatus:
        'MISSING_INDEPENDENT_VERIFICATION'
    },
    resourceBudget: {
      maximumRuntimeMs: 120000,
      maximumRequestBindings: 15,
      maximumResultEnvelopeBytes: 262144,
      maximumRegistryQueriesPerRequest: 4
    },
    failureAndRecovery: {
      failClosed: true,
      partialProofMayResolveEndpointOrAuthorizeContact: false,
      retryRequiresSameContractBatchRequestAndBindingDigests: true,
      noFoundationMutationOnFailure: true
    },
    verificationDeclaration: {
      independentSecondaryVerifierId: 'selftest.endpoint-resolver.audit',
      allowedAndDeniedIdentityProbesPlanned: true,
      exactRequestAndBindingDigestReplayPlanned: true,
      nativeResolverReceiptSchemaValidationPlanned: true,
      independentIdentityAndAuthorityReceipt: null,
      liveAvailabilityReceipt: null
    },
    lifecycle: {
      status: 'CANDIDATE_DECLARATION_UNTRUSTED',
      resolverInstalled: false,
      resolverAvailable: false,
      resolverExecuted: false,
      promoted: false,
      canon: false
    }
  });
}

function createR127(r126Contract, r126Bundle, declarations) {
  const source = { r126Contract, r126Bundle };
  const contract = r127
    .createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflightContractReceipt(
      source);
  const preflight = r127
    .createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflight(
      contract, source, declarations);
  return { contract, preflight, source, declarations };
}

function createR128(r127Value, options = {}) {
  const custody = {
    r127Contract: r127Value.contract,
    r127Preflight: r127Value.preflight,
    r127Source: r127Value.source,
    r127Declarations: r127Value.declarations
  };
  const contract = r128
    .createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestContractReceipt(
      custody);
  const batch = r128
    .createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestBatch(
      contract, custody, options);
  return { contract, batch, custody, options };
}

function createR129(r128Value, declarations = []) {
  const source = {
    r128Contract: r128Value.contract,
    r128Batch: r128Value.batch,
    r128RequestSource: r128Value.custody,
    r128Options: r128Value.options
  };
  const custody = { ...source, r128Custody: r128Value.custody };
  const contract = r129
    .createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflightContractReceipt(
      custody);
  const preflight = r129
    .createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflight(
      contract, source, declarations);
  return { contract, preflight, source, custody, declarations };
}

function createEndpointDeclaration(packet,
  alternateProviderId = 'selftest.endpoint-resolver.alternate',
  dependencies = []) {
  return resign({
    schema: r129
      .LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_ENDPOINT_DECLARATION_SCHEMA,
    requestId: packet.requestId,
    requestPacketDigest: packet.digest,
    resolverCapabilityId:
      'transport.foundation-planet.external-provider-verification.endpoint.resolve',
    candidateResolverProvider: {
      providerId: packet.claimedProvider.providerId,
      providerClass: packet.claimedProvider.providerClass,
      declarationDigest: packet.requestBinding.declarationDigest
    },
    claimedVerificationRecipient: {
      recipientId: packet.recipient.claimedVerifierId,
      identityTrust: 'CALLER_SUPPLIED_UNTRUSTED'
    },
    locator: {
      kind: 'HTTPS_URI',
      value: 'https://verifier.example.test/endpoint',
      trust: 'CALLER_SUPPLIED_UNVERIFIED'
    },
    alternateResolverClaim: {
      providerId: alternateProviderId,
      providerVersion: '0.1.0-experimental',
      capabilityId:
        'transport.foundation-planet.external-provider-verification.endpoint.resolve',
      identityTrust: 'CALLER_SUPPLIED_UNTRUSTED',
      relationToCandidate: 'CLAIMED_DISTINCT_UNVERIFIED',
      declaredDependencyProviderIds: structuredClone(dependencies),
      status: 'CALLER_DECLARED_UNVERIFIED'
    },
    resolutionWindow: {
      declaredAt: '2026-08-27T01:00:00.000Z',
      validUntil: '2026-08-27T01:05:00.000Z'
    },
    verificationPlan: {
      independentAlternateResolverIdentityAndAuthorityRequired: true,
      alternateResolverImplementationAndAvailabilityRequired: true,
      nonCircularDependencyProofRequired: true,
      independentEndpointOwnershipReceiptRequired: true,
      independentRecipientIdentityReceiptRequired: true,
      allowedAndDeniedRecipientProbesRequired: true,
      senderAndReceiverReceiptMatchRequired: true
    },
    permissionsAndConsent: {
      alternateResolverMayContactEndpoint: false,
      alternateResolverMayContactHuman: false,
      candidateResolverMayResolveOwnVerifier: false,
      declarationMayAuthorizeContact: false,
      resolverMayMutateHost: false,
      resolverMayPersist: false
    },
    lifecycle: {
      status: 'VERIFICATION_RECIPIENT_ENDPOINT_CANDIDATE_UNTRUSTED',
      endpointResolved: false,
      recipientAuthenticated: false,
      persisted: false,
      promoted: false,
      canon: false
    }
  });
}

function createR130(r129Value) {
  const boundary = {
    r129Contract: r129Value.contract,
    r129Preflight: r129Value.preflight,
    r129Source: r129Value.source,
    r129Declarations: r129Value.declarations,
    r129Custody: r129Value.custody
  };
  const contract = r130
    .createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionPreflightContractReceipt(
      boundary);
  const witness = r130
    .createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionWitness(
      contract, boundary);
  const report = r130
    .createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapClosurePreflight(
      contract, witness, boundary);
  return { contract, witness, report, boundary };
}

const emptyR127 = createR127(fixture.r126EmptyContract,
  fixture.r126EmptyBundle, []);
const emptyR128 = createR128(emptyR127);
const emptyR129 = createR129(emptyR128);
const emptyR130 = createR130(emptyR129);
assert.ok(r130
    .landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionPreflightContractReceiptValid(
      emptyR130.contract, emptyR130.boundary) && r130
    .landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionWitnessValid(
      emptyR130.witness, emptyR130.contract, emptyR130.boundary) && r130
    .landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapClosurePreflightValid(
      emptyR130.report, emptyR130.contract, emptyR130.witness,
      emptyR130.boundary) && emptyR130.witness.routes.length === 0 &&
  emptyR130.report.status ===
    'NO_COMPATIBLE_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_PREFLIGHT_EMPTY' &&
  emptyR130.report.requiredExternalEvidence.length === 0 && audit
    .auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionPreflight(
      emptyR130.contract, emptyR130.witness, emptyR130.report,
      emptyR130.boundary).status === 'PASS',
'R130 current real empty R129 route inventory remains an audited empty trust-bootstrap preflight');

const providerDeclaration = createProviderDeclaration();
const compatibleR127 = createR127(fixture.r126FullContract,
  fixture.r126FullBundle, [providerDeclaration]);
const requestOptions = {
  requestBatchId: 'selftest.r128.resolver-provider-verification',
  requesterId: 'selftest.r128.request-creator',
  requestedAt: '2026-08-27T01:00:00.000Z',
  expiresAt: '2026-08-27T01:05:00.000Z'
};
const compatibleR128 = createR128(compatibleR127, requestOptions);
const packet = compatibleR128.batch.packets[0];
const endpointDeclaration = createEndpointDeclaration(packet);
const compatibleR129 = createR129(compatibleR128, [endpointDeclaration]);
const compatibleR130 = createR130(compatibleR129);
const route = compatibleR130.witness.routes[0];
assert.ok(compatibleR130.contract.projection.sourceCompatibleRouteCount === 1 &&
  compatibleR130.witness.status ===
    'RECURSIVE_UNTRUSTED_RESOLVER_PROVIDER_DEPENDENCY_WITNESSED' &&
  compatibleR130.witness.summary.recursionWitnessCount === 1 &&
  compatibleR130.report.status ===
    'BLOCKED_RECURSIVE_UNTRUSTED_RESOLVER_PROVIDER_DEPENDENCY' &&
  compatibleR130.report.summary.activeRouteCount === 1 &&
  compatibleR130.report.summary.blockedRouteCount === 1 && audit
    .auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionPreflight(
      compatibleR130.contract, compatibleR130.witness,
      compatibleR130.report, compatibleR130.boundary).status === 'PASS',
'R130 witnesses and blocks one exact R129 compatible-unverified resolver route');

assert.ok(route.pattern ===
    'UNVERIFIED_RESOLVER_PROVIDER_REQUIRES_A_VERIFIER_ROUTE_RESOLVED_BY_ANOTHER_UNVERIFIED_RESOLVER_PROVIDER' &&
  route.stages.length === 5 && route.stages.slice(0, 4).every(stage =>
    stage.requiredCapabilityId ===
      'transport.foundation-planet.external-provider-verification.endpoint.resolve' &&
    stage.authorityEstablished === false) &&
  route.stages[4].requiredCapabilityId ===
    'authority.foundation-planet.external-provider-verification.verifier-route.trust-anchor.resolve' &&
  route.recurringDependency.firstUntrustedResolverStageOrdinal === 2 &&
  route.recurringDependency.repeatedDependencyStageOrdinal === 4 &&
  route.closure.closed === false &&
  route.truth.literalArtifactGraphCycleAsserted === false,
'R130 binds five stages of dependency-class recurrence without claiming a literal artifact cycle');

assert.ok(compatibleR130.report.requiredExternalEvidence.length === 6 &&
  compatibleR130.report.requiredExternalEvidence.slice(0, 5)
    .every(item => item.requiredCapabilityId ===
      'authority.foundation-planet.external-provider-verification.verifier-route.trust-anchor.resolve') &&
  compatibleR130.report.requiredExternalEvidence[5].requiredCapabilityId ===
    'transport.foundation-planet.external-provider-verification.request.send-receive' &&
  compatibleR130.report.capabilityGap.overall === 'BLOCKED' &&
  compatibleR130.report.capabilityGap.missingCapabilityIds.length === 2 &&
  Object.values(compatibleR130.report
    .prohibitedAutomaticContinuation).every(value => value === true) &&
  Object.entries(compatibleR130.report.truth).every(([key, value]) =>
    ['localAnalysisCapabilityReady', 'activeCompatibleRoutePresent',
      'recursiveUntrustedResolverDependencyWitnessed'].includes(key)
      ? value === true : value === false),
'R130 routes six external proof obligations and grants no authority, resolution, transport, or provider verification');

const selfResolution = createEndpointDeclaration(packet,
  packet.claimedProvider.providerId);
const circular = createEndpointDeclaration(packet,
  'selftest.endpoint-resolver.alternate',
  [packet.claimedProvider.providerId]);
const selfResolutionR130 = createR130(createR129(compatibleR128,
  [selfResolution]));
const circularR130 = createR130(createR129(compatibleR128, [circular]));
assert.ok(selfResolutionR130.witness.routes.length === 0 &&
  selfResolutionR130.report.capabilityGap.overall === 'NO_ACTIVE_ROUTE' &&
  circularR130.witness.routes.length === 0 &&
  circularR130.report.requiredExternalEvidence.length === 0 &&
  audit
    .auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionPreflight(
      selfResolutionR130.contract, selfResolutionR130.witness,
      selfResolutionR130.report, selfResolutionR130.boundary).status ===
    'PASS' && audit
    .auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionPreflight(
      circularR130.contract, circularR130.witness, circularR130.report,
      circularR130.boundary).status === 'PASS',
'R130 does not launder R129 rejected self-resolution or declared circular dependency into a recursion witness route');

const secondEndpointDeclaration = createEndpointDeclaration(packet,
  'selftest.endpoint-resolver.second-alternate');
secondEndpointDeclaration.locator.value =
  'https://second.example.test/endpoint';
resign(secondEndpointDeclaration);
const ambiguousR129 = createR129(compatibleR128,
  [endpointDeclaration, secondEndpointDeclaration]);
const ambiguousR130 = createR130(ambiguousR129);
assert.ok(ambiguousR129.preflight.endpoints[0].status ===
    'AMBIGUOUS_RECIPIENT_ENDPOINT_DECLARATION' &&
  ambiguousR130.contract.projection.sourceCompatibleRouteCount === 0 &&
  ambiguousR130.witness.routes.length === 0 &&
  ambiguousR130.report.status ===
    'NO_COMPATIBLE_VERIFICATION_RECIPIENT_ROUTE_TRUST_BOOTSTRAP_PREFLIGHT_EMPTY',
'R130 creates no route when R129 preserves endpoint declaration ambiguity');

const substitutedBoundary = {
  ...compatibleR130.boundary,
  r129Source: emptyR129.source
};
assert.throws(() => r130
  .createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionPreflightContractReceipt(
    substitutedBoundary), /exact R129 contract/,
'R130 rejects substitution across the sealed R129-to-R128/R127/R126 boundary');

const overclaim = structuredClone(compatibleR130.report);
overclaim.status = 'READY';
overclaim.routeClosures[0].status = 'READY';
overclaim.routeClosures[0].missingCapabilityIds = [];
overclaim.routeClosures[0].automaticContinuationAllowed = true;
overclaim.routeClosures[0].endpointResolved = true;
overclaim.routeClosures[0].recipientAuthenticated = true;
overclaim.routeClosures[0].transportPerformed = true;
overclaim.routeClosures[0].resolverProviderVerified = true;
overclaim.capabilityGap.overall = 'READY';
overclaim.capabilityGap.missingCapabilityIds = [];
overclaim.summary.authorityAnchoredRouteCount = 1;
overclaim.summary.endpointResolvedCount = 1;
overclaim.summary.recipientAuthenticatedCount = 1;
overclaim.summary.transmittedRequestCount = 1;
overclaim.summary.resolverProviderVerifiedCount = 1;
Object.keys(overclaim.truth).forEach(key => {
  overclaim.truth[key] = true;
});
overclaim.trustAnchor = { configured: true };
overclaim.providerSelection = { selected: true };
overclaim.transport = { performed: true };
overclaim.historicalSourceOwner = { id: 'fictional-owner' };
overclaim.historicalDebitReceipt = { verified: true };
overclaim.persistence = { performed: true };
overclaim.promotion = { canon: true };
resign(overclaim);
assert.ok(!r130
    .landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapClosurePreflightValid(
      overclaim) && audit
    .auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionPreflight(
      compatibleR130.contract, compatibleR130.witness, overclaim,
      compatibleR130.boundary).status === 'FAIL',
'R130 rejects re-signed trust-anchor, recursive continuation, resolution, authentication, transport, provider verification, owner/debit, persistence, promotion, and canon overclaims');

assert.ok(compatibleR130.contract.resourceBudget.maximumRoutes === 1 &&
  compatibleR130.contract.resourceBudget.stagesPerRoute === 5 &&
  compatibleR130.contract.resourceBudget.evidenceRequirementsPerRoute === 6 &&
  new TextEncoder().encode(JSON.stringify(compatibleR130.witness)).length <=
    compatibleR130.contract.resourceBudget.maximumSerializedWitnessBytes &&
  new TextEncoder().encode(JSON.stringify(compatibleR130.report)).length <=
    compatibleR130.contract.resourceBudget.maximumSerializedPreflightBytes,
'R130 keeps route, stage, evidence, witness-byte, and preflight-byte resources bounded');

const producerText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-endpoint-resolver-provider-verification-recipient-trust-bootstrap-recursion-preflight.mjs'), 'utf8');
const auditText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-endpoint-resolver-provider-verification-recipient-trust-bootstrap-recursion-preflight-audit.mjs'), 'utf8');
assert.ok(!/\bfetch\s*\(|XMLHttpRequest|new\s+WebSocket|node:dns|node:net/.test(
    producerText) && !auditText.includes(
    'createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrap') &&
  !auditText.includes(
    'landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionPreflightContractReceiptValid') &&
  !auditText.includes(
    'landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapRecursionWitnessValid') &&
  !auditText.includes(
    'landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapClosurePreflightValid') &&
  JSON.stringify(fixture) === fixtureBefore,
'R130 has no network primitive, its audit calls no R130 builder or validator, and exact R126 custody remains unchanged');

console.log('foundation planet R130 isolated selftest: PASS (10 assertions)');
