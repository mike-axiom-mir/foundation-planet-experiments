import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const fixturePath = process.argv[2];
if (!fixturePath) throw new Error('R133 selftest requires an exact R126 fixture');
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
const r132 = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-trust-anchor-and-transport-provider-binding-preflight.mjs')).href);
const r132Audit = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-trust-anchor-and-transport-provider-binding-preflight-audit.mjs')).href);
const r133 = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-trust-anchor-and-transport-provider-verification-request.mjs')).href);
const audit = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-trust-anchor-and-transport-provider-verification-request-audit.mjs')).href);

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

function createResolverDeclaration() {
  const specification = fixture.r126FullBundle.specification;
  return resign({
    schema: r127
      .LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_DECLARATION_SCHEMA,
    providerId: 'selftest.endpoint-resolver.candidate',
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
      nativeResolverReceiptSchema: 'selftest.endpoint-resolver.receipt/v1',
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

function createR132(r131Value, declarations = []) {
  const boundary = {
    r131Contract: r131Value.contract,
    r131Bundle: r131Value.bundle,
    r131Boundary: r131Value.boundary
  };
  const contract = r132
    .createLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflightContractReceipt(
      boundary);
  const preflight = r132
    .createLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflight(
      contract, boundary, declarations);
  return { contract, preflight, boundary, declarations };
}

function createProviderDeclaration(r131Value, capabilityId, providerId,
  prerequisiteAuthorityProviderId = null, schemaSuffix = providerId) {
  const specification = r131Value.bundle.specifications.find(item =>
    item.capabilityId === capabilityId);
  const authority = capabilityId ===
    'authority.foundation-planet.external-provider-verification.verifier-route.trust-anchor.resolve';
  const nativeReceiptSchemas = authority ? [{
    role: 'AUTHORITY_DECISION_RECEIPT',
    schema: `selftest.${schemaSuffix}.authority-receipt/v1`,
    trust: 'CALLER_DECLARED_UNVERIFIED'
  }] : [{
    role: 'SENDER_RECEIPT',
    schema: `selftest.${schemaSuffix}.sender-receipt/v1`,
    trust: 'CALLER_DECLARED_UNVERIFIED'
  }, {
    role: 'RECEIVER_RECEIPT',
    schema: `selftest.${schemaSuffix}.receiver-receipt/v1`,
    trust: 'CALLER_DECLARED_UNVERIFIED'
  }];
  return resign({
    schema: r132
      .LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_DECLARATION_SCHEMA,
    providerId,
    providerVersion: '0.1.0-experimental',
    capabilityId,
    providerClass: specification.providerClass,
    declarationTrust: 'CALLER_SUPPLIED_UNTRUSTED',
    specificationBinding: {
      specificationOrdinal: specification.ordinal,
      specificationCapabilityId: specification.capabilityId,
      specificationDigest: specification.digest,
      r131ContractDigest: r131Value.contract.digest,
      r131BundleDigest: r131Value.bundle.digest,
      inputBindingSchema: r131
        .LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_CAPABILITY_INPUT_BINDING_SCHEMA,
      resultEnvelopeSchema: r131
        .LAND_MATRIX_THERMAL_VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_RESULT_ENVELOPE_SCHEMA
    },
    nativeReceiptSchemas,
    implementationBoundary: {
      entrypointKind: authority
        ? 'INDEPENDENT_TRUST_ANCHOR_AUTHORITY'
        : 'RECEIPTED_SEND_RECEIVE_TRANSPORT',
      executionStatus: 'NOT_REQUESTED',
      externalContactMayOccurOnlyAfterExplicitAuthorization: true,
      foundationPlanetWritesRequested: false,
      persistenceRequested: false
    },
    permissionsAndConsent: authority ? {
      requiredAuthoritySeatAcknowledged: true,
      providerSelfAttestationSufficient: false,
      candidateResolverMayControlProvider: false,
      alternateResolverMayControlProvider: false,
      providerMayInferConsent: false
    } : {
      requiredAuthoritySeatAcknowledged: true,
      providerSelfAttestationSufficient: false,
      exactPerRequestAuthorityRequired: true,
      exactRecipientConsentOrHostAuthorizationRequired: true,
      providerMayInferConsent: false
    },
    resourceBudget: structuredClone(specification.resourceBudget),
    failureAndRecovery: structuredClone(specification.failureAndRecovery),
    verificationDeclaration: {
      independentSecondaryVerifierId: `${providerId}.audit`,
      exactSpecificationAndBindingDigestReplayPlanned: true,
      nativeReceiptSchemaValidationPlanned: true,
      allowedAndDeniedIdentityProbesPlanned: authority,
      senderAndReceiverReceiptMatchPlanned: !authority,
      independentIdentityAndAuthorityReceipt: null,
      liveAvailabilityReceipt: null
    },
    prerequisiteAuthorityProviderId: authority
      ? null : prerequisiteAuthorityProviderId,
    lifecycle: {
      status: 'CANDIDATE_DECLARATION_UNTRUSTED',
      providerSelected: false,
      installed: false,
      available: false,
      executed: false,
      authorityEstablished: false,
      transportPerformed: false,
      promoted: false,
      canon: false
    }
  });
}

const emptyR127 = createR127(fixture.r126EmptyContract,
  fixture.r126EmptyBundle, []);
const emptyR131 = createR131(createR130(createR129(createR128(emptyR127))));
const emptyR132 = createR132(emptyR131);
const emptyCustody = {
  r132Contract: emptyR132.contract,
  r132Preflight: emptyR132.preflight,
  r132Boundary: emptyR132.boundary,
  r132Declarations: emptyR132.declarations
};
const emptyContract = r133
  .createLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestContractReceipt(
    emptyCustody);
const emptyBatch = r133
  .createLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestBatch(
    emptyContract, emptyCustody);
assert.ok(r133
    .landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestContractReceiptValid(
      emptyContract, emptyCustody) && r133
    .landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestBatchValid(
      emptyBatch, emptyContract, emptyCustody) &&
  emptyBatch.status ===
    'NO_COMPATIBLE_UNVERIFIED_VERIFIER_ROUTE_PROVIDER_CANDIDATES_REQUEST_BATCH_EMPTY' &&
  emptyBatch.packets.length === 0 &&
  emptyBatch.requestContext.requestBatchId === null &&
  audit
    .auditLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequest(
      emptyContract, emptyBatch, emptyCustody).status === 'PASS',
'R133 current empty R132 candidate inventory remains an audited request-free batch');

const compatibleR127 = createR127(fixture.r126FullContract,
  fixture.r126FullBundle, [createResolverDeclaration()]);
const compatibleR128 = createR128(compatibleR127, {
  requestBatchId: 'selftest.r128.resolver-provider-verification',
  requesterId: 'selftest.r128.request-creator',
  requestedAt: '2026-08-27T01:00:00.000Z',
  expiresAt: '2026-08-27T01:05:00.000Z'
});
const packet = compatibleR128.batch.packets[0];
const compatibleR131 = createR131(createR130(createR129(compatibleR128,
  [createEndpointDeclaration(packet)])));
const authorityProviderId = 'selftest.trust-anchor.authority';
const transportProviderId = 'selftest.verification.transport';
const authorityDeclaration = createProviderDeclaration(compatibleR131,
  r131.VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
  authorityProviderId);
const transportDeclaration = createProviderDeclaration(compatibleR131,
  r131.VERIFICATION_REQUEST_SEND_RECEIVE_CAPABILITY_ID,
  transportProviderId, authorityProviderId);
const compatibleR132 = createR132(compatibleR131,
  [authorityDeclaration, transportDeclaration]);
const compatibleCustody = {
  r132Contract: compatibleR132.contract,
  r132Preflight: compatibleR132.preflight,
  r132Boundary: compatibleR132.boundary,
  r132Declarations: compatibleR132.declarations
};
const requestOptions = {
  requestBatchId: 'selftest.r133.verifier-route-provider-verification',
  requesterId: 'selftest.r133.request-creator',
  requestedAt: '2026-08-27T02:00:00.000Z',
  expiresAt: '2026-08-27T02:05:00.000Z'
};
const compatibleContract = r133
  .createLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestContractReceipt(
    compatibleCustody);
const compatibleBatch = r133
  .createLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestBatch(
    compatibleContract, compatibleCustody, requestOptions);
assert.ok(compatibleBatch.status ===
    'VERIFIER_ROUTE_PROVIDER_VERIFICATION_REQUESTS_CREATED_NOT_TRANSMITTED_PROVIDERS_BLOCKED' &&
  compatibleBatch.packets.length === 2 &&
  compatibleBatch.summary.proofRequirementCount === 12 &&
  compatibleBatch.summary.unresolvedVerificationRecipientRouteCount === 2 &&
  audit
    .auditLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequest(
      compatibleContract, compatibleBatch, compatibleCustody,
      requestOptions).status === 'PASS',
'R133 exact-binds both compatible-unverified candidates into twelve-proof untransmitted requests');

const authorityPacket = compatibleBatch.packets[0];
assert.ok(authorityPacket.claimedProvider.providerId === authorityProviderId &&
  authorityPacket.claimedProvider.nativeReceiptSchemas.length === 1 &&
  authorityPacket.requestBinding.prerequisiteAuthorityProviderId === null &&
  JSON.stringify(authorityPacket.proofRequirements.map(item => item.proofId)) ===
    JSON.stringify([
      'INDEPENDENT_PROVIDER_IDENTITY_AUTHORITY_AND_REVOCATION',
      'PROVIDER_IMPLEMENTATION_INTEGRITY',
      'BOUNDED_LIVE_PROVIDER_AVAILABILITY',
      'NATIVE_AUTHORITY_RECEIPT_SCHEMA_VALIDATION',
      'ALLOWED_AND_DENIED_PROVIDER_IDENTITY_PROBES',
      'EXACT_R131_SPECIFICATION_BINDING_AND_DECLARATION_DIGEST_REPLAY'
    ]) &&
  authorityPacket.proofRequirements.every(item =>
    item.independentSecondaryVerifierRequired === true),
'R133 authority-provider request routes identity, integrity, availability, native-schema, allowed/denied probe, and exact replay proof');

const transportPacket = compatibleBatch.packets[1];
assert.ok(transportPacket.claimedProvider.providerId === transportProviderId &&
  transportPacket.claimedProvider.nativeReceiptSchemas.length === 2 &&
  transportPacket.requestBinding.prerequisiteAuthorityProviderId ===
    authorityProviderId &&
  JSON.stringify(transportPacket.proofRequirements.map(item => item.proofId)) ===
    JSON.stringify([
      'INDEPENDENT_PROVIDER_IDENTITY_AUTHORITY_AND_REVOCATION',
      'PROVIDER_IMPLEMENTATION_INTEGRITY',
      'BOUNDED_LIVE_PROVIDER_AVAILABILITY',
      'NATIVE_SENDER_AND_RECEIVER_RECEIPT_SCHEMAS_VALIDATION',
      'MATCHED_SENDER_AND_RECEIVER_RECEIPT_TEST',
      'EXACT_R131_SPECIFICATION_BINDING_AND_DECLARATION_DIGEST_REPLAY'
    ]) &&
  transportPacket.transport.senderReceipt === null &&
  transportPacket.transport.receiverReceipt === null,
'R133 transport-provider request exact-binds authority prerequisite and matched sender/receiver proof without inventing receipts');

assert.ok(compatibleBatch.packets.every(item =>
    item.recipientRoute.status === 'UNRESOLVED' &&
    item.recipientRoute.endpoint === null &&
    item.recipientRoute.recipientIdentity === null &&
    item.recipientRoute.claimedVerifierIdentityTrusted === false &&
    item.recipientRoute.candidateProviderMaySatisfyOwnVerificationRoute ===
      false &&
    JSON.stringify(item.recipientRoute.requiredCapabilities) ===
      JSON.stringify([
        'transport.foundation-planet.external-provider-verification.endpoint.resolve',
        'authority.foundation-planet.external-provider-verification.verifier-route.trust-anchor.resolve',
        'transport.foundation-planet.external-provider-verification.request.send-receive'
      ]) &&
    item.transport.status === 'NOT_TRANSMITTED') &&
  compatibleBatch.summary.transmittedRequestCount === 0 &&
  compatibleBatch.summary.independentlyVerifiedProviderCount === 0,
'R133 preserves the claimed verifier as untrusted and leaves endpoint, authority, and transport routing unresolved');

const secondAuthorityDeclaration = createProviderDeclaration(compatibleR131,
  r131.VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
  'selftest.trust-anchor.authority-two', null, 'authority-two');
const ambiguousR132 = createR132(compatibleR131,
  [authorityDeclaration, secondAuthorityDeclaration, transportDeclaration]);
const ambiguousCustody = {
  r132Contract: ambiguousR132.contract,
  r132Preflight: ambiguousR132.preflight,
  r132Boundary: ambiguousR132.boundary,
  r132Declarations: ambiguousR132.declarations
};
const ambiguousContract = r133
  .createLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestContractReceipt(
    ambiguousCustody);
const ambiguousBatch = r133
  .createLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestBatch(
    ambiguousContract, ambiguousCustody);
assert.ok(ambiguousR132.preflight.providerCandidates.length === 0 &&
  ambiguousBatch.packets.length === 0 &&
  ambiguousBatch.summary.rejectedOrAmbiguousAssessmentCount === 2 &&
  ambiguousBatch.summary.selectedProviderCount === 0,
'R133 does not launder R132 authority ambiguity or the rejected transport prerequisite into requests');

assert.throws(() => r133
  .createLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestContractReceipt({
    ...compatibleCustody,
    r132Preflight: emptyR132.preflight
  }), /exact R132 custody/,
'R133 rejects substitution across the exact R132-to-R131 boundary');

assert.throws(() => r133
  .createLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestBatch(
    compatibleContract, compatibleCustody, {
      ...requestOptions,
      expiresAt: '2026-08-27T02:05:00.001Z'
    }), /bounded request window/,
'R133 rejects a request window beyond five minutes');

const overclaim = structuredClone(compatibleBatch);
overclaim.packets[0].recipientRoute.status = 'RESOLVED_TRUSTED';
overclaim.packets[0].recipientRoute.claimedVerifierIdentityTrusted = true;
overclaim.packets[0].transport.status = 'DELIVERED';
overclaim.packets[0].transport.senderReceipt = { fictional: true };
overclaim.packets[0].transport.receiverReceipt = { fictional: true };
overclaim.packets[0].lifecycle.selected = true;
overclaim.packets[0].lifecycle.installed = true;
overclaim.packets[0].lifecycle.available = true;
overclaim.packets[0].lifecycle.executed = true;
Object.keys(overclaim.packets[0].truth).forEach(key => {
  overclaim.packets[0].truth[key] = true;
});
resign(overclaim.packets[0]);
overclaim.summary.transmittedRequestCount = 1;
overclaim.summary.senderReceiptCount = 1;
overclaim.summary.receiverReceiptCount = 1;
overclaim.summary.independentlyVerifiedProviderCount = 1;
overclaim.summary.selectedProviderCount = 1;
overclaim.summary.installedProviderCount = 1;
overclaim.summary.availableProviderCount = 1;
overclaim.summary.executedProviderCount = 1;
overclaim.summary.authorityResolvedCount = 1;
overclaim.summary.admissionReady = true;
overclaim.historicalSourceOwner = { id: 'fictional-owner' };
overclaim.historicalDebitReceipt = { verified: true };
overclaim.persistence = { performed: true };
overclaim.promotion = { canon: true };
resign(overclaim);
assert.ok(!r133
    .landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestBatchValid(
      overclaim, compatibleContract, compatibleCustody, requestOptions) &&
  audit
    .auditLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequest(
      compatibleContract, overclaim, compatibleCustody,
      requestOptions).status === 'FAIL',
'R133 rejects re-signed recipient, receipt, verification, lifecycle, authority, owner/debit, persistence, admission, promotion, and canon overclaims');

const producerText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-verifier-route-trust-anchor-and-transport-provider-verification-request.mjs'), 'utf8');
const auditText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-verifier-route-trust-anchor-and-transport-provider-verification-request-audit.mjs'), 'utf8');
assert.ok(compatibleContract.resourceBudget.maximumRequestPackets === 2 &&
  compatibleContract.resourceBudget.maximumProofRequirementsPerPacket === 6 &&
  compatibleContract.resourceBudget.maximumRequestWindowMs === 300000 &&
  new TextEncoder().encode(JSON.stringify(compatibleBatch)).length <=
    compatibleContract.resourceBudget.maximumSerializedBatchBytes &&
  !/\bfetch\s*\(|XMLHttpRequest|new\s+WebSocket|node:dns|node:net/.test(
    producerText) && !auditText.includes(
    'createLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequest') &&
  !auditText.includes(
    'landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestContractReceiptValid') &&
  !auditText.includes(
    'landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestBatchValid') &&
  JSON.stringify(fixture) === fixtureBefore,
'R133 is resource-bounded, non-networked, independently audited, and leaves exact R126 custody unchanged');

console.log('foundation planet R133 isolated selftest: PASS (10 assertions)');

