import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const fixturePath = process.argv[2];
if (!fixturePath) throw new Error('R131 selftest requires an exact R126 fixture');
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
const r131 = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-trust-anchor-and-transport-capability-specification.mjs')).href);
const audit = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-trust-anchor-and-transport-capability-specification-audit.mjs')).href);

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
  const preflight = r130
    .createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientTrustBootstrapClosurePreflight(
      contract, witness, boundary);
  return { contract, witness, preflight, boundary };
}

function createR131(r130Value) {
  const boundary = {
    r130Contract: r130Value.contract,
    r130Witness: r130Value.witness,
    r130Preflight: r130Value.preflight,
    r130Boundary: r130Value.boundary
  };
  const contract = r131
    .createLandMatrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecificationContractReceipt(
      boundary);
  const bundle = r131
    .createLandMatrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecificationBundle(
      contract, boundary);
  return { contract, bundle, boundary };
}

const emptyR127 = createR127(fixture.r126EmptyContract,
  fixture.r126EmptyBundle, []);
const emptyR131 = createR131(createR130(createR129(createR128(emptyR127))));
assert.ok(r131
    .landMatrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecificationContractReceiptValid(
      emptyR131.contract, emptyR131.boundary) && r131
    .landMatrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecificationBundleValid(
      emptyR131.bundle, emptyR131.contract, emptyR131.boundary) &&
  emptyR131.bundle.status ===
    'VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATIONS_AVAILABLE_WITH_NO_CURRENT_ROUTE_BINDINGS' &&
  emptyR131.bundle.specifications.length === 2 &&
  emptyR131.bundle.inputBindings.length === 0 && audit
    .auditLandMatrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecification(
      emptyR131.contract, emptyR131.bundle, emptyR131.boundary).status ===
    'PASS',
'R131 current real empty R130 route inventory emits two audited specifications and zero bindings');

const providerDeclaration = createProviderDeclaration();
const compatibleR127 = createR127(fixture.r126FullContract,
  fixture.r126FullBundle, [providerDeclaration]);
const compatibleR128 = createR128(compatibleR127, {
  requestBatchId: 'selftest.r128.resolver-provider-verification',
  requesterId: 'selftest.r128.request-creator',
  requestedAt: '2026-08-27T01:00:00.000Z',
  expiresAt: '2026-08-27T01:05:00.000Z'
});
const packet = compatibleR128.batch.packets[0];
const endpointDeclaration = createEndpointDeclaration(packet);
const compatibleR129 = createR129(compatibleR128, [endpointDeclaration]);
const compatibleR131 = createR131(createR130(compatibleR129));
const [authoritySpec, transportSpec] = compatibleR131.bundle.specifications;
const [authorityBinding, transportBinding] = compatibleR131.bundle.inputBindings;
assert.ok(compatibleR131.bundle.status ===
    'VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_SPECIFICATIONS_AVAILABLE_WITH_BOUND_ROUTE_REQUIREMENTS' &&
  compatibleR131.contract.projection.sourceCompatibleRouteCount === 1 &&
  compatibleR131.bundle.summary.capabilitySpecificationCount === 2 &&
  compatibleR131.bundle.summary.inputBindingCount === 2 &&
  authorityBinding.capabilityId ===
    'authority.foundation-planet.external-provider-verification.verifier-route.trust-anchor.resolve' &&
  transportBinding.capabilityId ===
    'transport.foundation-planet.external-provider-verification.request.send-receive' && audit
    .auditLandMatrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecification(
      compatibleR131.contract, compatibleR131.bundle,
      compatibleR131.boundary).status === 'PASS',
'R131 exact-binds one synthetic R130 route into one authority and one transport input');

assert.ok(authoritySpec.gapType === 'AUTHORITY' &&
  authoritySpec.outputContract.nativeAuthorityReceiptSchema === null &&
  authoritySpec.outputContract.requiredEvidenceIds.length === 5 &&
  authoritySpec.permissionsAndConsent.requiredAuthoritySeat ===
    'MIKE_TOBI_OR_AUTHENTICATED_HOST_GOVERNANCE_SEAT' &&
  authoritySpec.permissionsAndConsent.candidateResolverMayDesignateAnchor ===
    false &&
  authoritySpec.permissionsAndConsent.alternateResolverMayDesignateAnchor ===
    false &&
  authoritySpec.verificationContract
    .allowedAndDeniedIdentityProbeReceiptsRequired === true &&
  authoritySpec.verificationContract
    .candidateAndAlternateResolverNonControlMustBeProven === true,
'R131 authority specification requires independent provenance, revocation, identity probes, route binding, and resolver non-control');

assert.ok(transportSpec.gapType === 'HAND' &&
  transportSpec.outputContract.nativeSenderReceiptSchema === null &&
  transportSpec.outputContract.nativeReceiverReceiptSchema === null &&
  transportSpec.permissionsAndConsent.authorityTrustAnchorResultRequired ===
    true &&
  transportSpec.resourceBudget.maximumSendAttemptsPerExactAuthorityReceipt ===
    1 && transportSpec.resourceBudget.automaticRetryCount === 0 &&
  transportSpec.failureAndRecovery.senderReceiptAloneMayProveDelivery ===
    false &&
  transportSpec.verificationContract.matchedRequestIdAndPayloadDigestRequired ===
    true && transportSpec.verificationContract
    .deliveryDoesNotProveReceiverAppliedOrAcceptedRequest === true,
'R131 transport specification requires explicit authority and matched sender/receiver receipts without equating delivery with application');

assert.ok([authoritySpec, transportSpec].every(specification =>
    ['inputContract', 'outputContract', 'sideEffects',
      'permissionsAndConsent', 'resourceBudget', 'failureAndRecovery',
      'compatibility', 'verificationContract', 'promotionGate']
      .every(key => specification[key] &&
        typeof specification[key] === 'object') &&
    specification.lifecycle.status === 'SPECIFIED_NOT_IMPLEMENTED' &&
    Object.entries(specification.lifecycle).every(([key, value]) =>
      key === 'status' || value === false)) &&
  authorityBinding.sourceRoute.requestPacketDigest === packet.digest &&
  transportBinding.sourceRoute.requestPacketDigest === packet.digest &&
  transportBinding.prerequisiteCapabilityIds[0] ===
    authorityBinding.capabilityId,
'R131 specifications cover every missing-hand contract field and exact route/request custody');

const selfResolution = createEndpointDeclaration(packet,
  packet.claimedProvider.providerId);
const circular = createEndpointDeclaration(packet,
  'selftest.endpoint-resolver.alternate', [packet.claimedProvider.providerId]);
const selfResolutionR131 = createR131(createR130(createR129(compatibleR128,
  [selfResolution])));
const circularR131 = createR131(createR130(createR129(compatibleR128,
  [circular])));
const secondEndpoint = createEndpointDeclaration(packet,
  'selftest.endpoint-resolver.second-alternate');
secondEndpoint.locator.value = 'https://second.example.test/endpoint';
resign(secondEndpoint);
const ambiguousR131 = createR131(createR130(createR129(compatibleR128,
  [endpointDeclaration, secondEndpoint])));
assert.ok(selfResolutionR131.bundle.inputBindings.length === 0 &&
  circularR131.bundle.inputBindings.length === 0 &&
  ambiguousR131.bundle.inputBindings.length === 0,
'R131 does not launder R129 self-resolution, declared circular dependency, or ambiguity into specification inputs');

const substitutedBoundary = {
  ...compatibleR131.boundary,
  r130Preflight: emptyR131.boundary.r130Preflight
};
assert.throws(() => r131
  .createLandMatrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecificationContractReceipt(
    substitutedBoundary), /exact R130 boundary/,
'R131 rejects substitution across the exact R130-to-R129/R128/R127/R126 boundary');

const overclaim = structuredClone(compatibleR131.bundle);
overclaim.specifications[0].outputContract.nativeAuthorityReceiptSchema =
  'fictional.authority-receipt/v1';
overclaim.specifications[0].permissionsAndConsent
  .candidateResolverMayDesignateAnchor = true;
overclaim.specifications[0].lifecycle.status = 'EXECUTED';
overclaim.specifications[0].lifecycle.providerSelected = true;
overclaim.specifications[0].lifecycle.installed = true;
overclaim.specifications[0].lifecycle.available = true;
overclaim.specifications[0].lifecycle.executed = true;
resign(overclaim.specifications[0]);
overclaim.specifications[1].outputContract.nativeSenderReceiptSchema =
  'fictional.sender-receipt/v1';
overclaim.specifications[1].outputContract.nativeReceiverReceiptSchema =
  'fictional.receiver-receipt/v1';
overclaim.specifications[1].permissionsAndConsent.automaticRetryAllowed = true;
overclaim.specifications[1].lifecycle.status = 'EXECUTED';
overclaim.specifications[1].lifecycle.executed = true;
overclaim.specifications[1].lifecycle.promoted = true;
overclaim.specifications[1].lifecycle.canon = true;
resign(overclaim.specifications[1]);
overclaim.summary.nativeProviderReceiptSchemaCount = 3;
overclaim.summary.selectedProviderCount = 1;
overclaim.summary.installedProviderCount = 1;
overclaim.summary.availableProviderCount = 1;
overclaim.summary.executedProviderCount = 2;
overclaim.summary.authorityResolvedCount = 1;
overclaim.summary.transportedRequestCount = 1;
Object.keys(overclaim.truth).forEach(key => {
  overclaim.truth[key] = true;
});
overclaim.providerSelection = { selected: true };
overclaim.transport = { performed: true };
overclaim.historicalSourceOwner = { id: 'fictional-owner' };
overclaim.historicalDebitReceipt = { verified: true };
overclaim.persistence = { performed: true };
resign(overclaim);
assert.ok(!r131
    .landMatrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecificationBundleValid(
      overclaim, compatibleR131.contract, compatibleR131.boundary) && audit
    .auditLandMatrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecification(
      compatibleR131.contract, overclaim, compatibleR131.boundary).status ===
    'FAIL',
'R131 rejects re-signed native-schema, authority, permission, execution, transport, owner/debit, persistence, promotion, and canon overclaims');

assert.ok(compatibleR131.contract.resourceBudget.maximumSpecifications === 2 &&
  compatibleR131.contract.resourceBudget.maximumRoutes === 1 &&
  compatibleR131.contract.resourceBudget.maximumInputBindings === 2 &&
  compatibleR131.contract.resourceBudget.maximumExternalRuntimeMs === 120000 &&
  compatibleR131.contract.resourceBudget.maximumResultEnvelopeBytes ===
    262144 && new TextEncoder().encode(JSON.stringify(
    compatibleR131.bundle)).length <= compatibleR131.contract.resourceBudget
    .maximumSerializedBundleBytes,
'R131 keeps specification, route, input, runtime, result, and bundle resources bounded');

const producerText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-verifier-route-trust-anchor-and-transport-capability-specification.mjs'), 'utf8');
const auditText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-verifier-route-trust-anchor-and-transport-capability-specification-audit.mjs'), 'utf8');
assert.ok(!/\bfetch\s*\(|XMLHttpRequest|new\s+WebSocket|node:dns|node:net/.test(
    producerText) && !auditText.includes(
    'createLandMatrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecification') &&
  !auditText.includes(
    'landMatrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecificationContractReceiptValid') &&
  !auditText.includes(
    'landMatrixThermalVerifierRouteTrustAnchorAndTransportCapabilitySpecificationBundleValid') &&
  JSON.stringify(fixture) === fixtureBefore,
'R131 has no network primitive, its audit calls no R131 builder or validator, and exact R126 custody remains unchanged');

console.log('foundation planet R131 isolated selftest: PASS (10 assertions)');
