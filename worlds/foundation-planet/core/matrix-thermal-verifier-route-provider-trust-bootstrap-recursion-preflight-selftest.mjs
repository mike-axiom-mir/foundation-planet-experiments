import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const fixturePath = process.argv[2];
if (!fixturePath) throw new Error('R135 selftest requires an exact R126 fixture');
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
const r133Audit = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-trust-anchor-and-transport-provider-verification-request-audit.mjs')).href);
const r134 = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-provider-verification-recipient-route-resolution-preflight.mjs')).href);
const r134Audit = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-provider-verification-recipient-route-resolution-preflight-audit.mjs')).href);
const r135 = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-provider-trust-bootstrap-recursion-preflight.mjs')).href);
const audit = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-provider-trust-bootstrap-recursion-preflight-audit.mjs')).href);

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


function createR133(r132Value, options = {}) {
  const custody = {
    r132Contract: r132Value.contract,
    r132Preflight: r132Value.preflight,
    r132Boundary: r132Value.boundary,
    r132Declarations: r132Value.declarations
  };
  const contract = r133
    .createLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestContractReceipt(
      custody);
  const batch = r133
    .createLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequestBatch(
      contract, custody, options);
  return { contract, batch, custody, options };
}

function createR134(r133Value, declarations = []) {
  const custody = {
    r133Contract: r133Value.contract,
    r133Batch: r133Value.batch,
    r133Custody: r133Value.custody,
    r133Options: r133Value.options
  };
  const contract = r134
    .createLandMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflightContractReceipt(
      custody);
  const preflight = r134
    .createLandMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflight(
      contract, custody, declarations);
  return { contract, preflight, custody, declarations };
}

function routeProviderClaim(providerId, capabilityId, dependencies = []) {
  return {
    providerId,
    providerVersion: '0.1.0-experimental',
    capabilityId,
    identityTrust: 'CALLER_SUPPLIED_UNTRUSTED',
    relationToCandidate: 'CLAIMED_DISTINCT_UNVERIFIED',
    status: 'CALLER_DECLARED_UNVERIFIED',
    declaredDependencyProviderIds: dependencies
  };
}

function createRouteDeclaration(packet, suffix = 'primary') {
  const endpointProviderId = 'selftest.r134.route.endpoint-' + suffix;
  const authorityProviderId = 'selftest.r134.route.authority-' + suffix;
  const transportProviderId = 'selftest.r134.route.transport-' + suffix;
  return resign({
    schema: r134
      .LAND_MATRIX_THERMAL_VERIFIER_ROUTE_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_DECLARATION_SCHEMA,
    requestId: packet.requestId,
    requestPacketDigest: packet.digest,
    candidateProvider: {
      providerId: packet.claimedProvider.providerId,
      providerClass: packet.claimedProvider.providerClass,
      capabilityId: packet.claimedProvider.capabilityId,
      declarationDigest: packet.requestBinding.declarationDigest
    },
    claimedVerificationRecipient: {
      recipientId: packet.recipientRoute.claimedVerifierId,
      identityTrust: 'CALLER_SUPPLIED_UNTRUSTED'
    },
    locator: {
      kind: 'HUMAN_REVIEW_ROUTE',
      value: 'human-review:selftest/r134/' + suffix,
      trust: 'CALLER_SUPPLIED_UNVERIFIED'
    },
    routeProviders: {
      endpointResolver: routeProviderClaim(endpointProviderId,
        'transport.foundation-planet.external-provider-verification.endpoint.resolve'),
      trustAnchorAuthority: routeProviderClaim(authorityProviderId,
        'authority.foundation-planet.external-provider-verification.verifier-route.trust-anchor.resolve'),
      transport: {
        ...routeProviderClaim(transportProviderId,
          'transport.foundation-planet.external-provider-verification.request.send-receive',
          [endpointProviderId, authorityProviderId]),
        prerequisiteAuthorityProviderId: authorityProviderId
      }
    },
    resolutionWindow: {
      declaredAt: packet.requestWindow.requestedAt,
      validUntil: packet.requestWindow.expiresAt
    },
    verificationPlan: {
      independentRouteProviderIdentityAndAuthorityRequired: true,
      routeProviderImplementationAndAvailabilityRequired: true,
      nonCircularDependencyGraphProofRequired: true,
      independentEndpointOwnershipReceiptRequired: true,
      independentRecipientIdentityReceiptRequired: true,
      allowedAndDeniedRecipientProbesRequired: true,
      senderAndReceiverReceiptMatchRequired: true
    },
    permissionsAndConsent: {
      routeProvidersMayContactEndpoint: false,
      routeProvidersMayContactHuman: false,
      candidateProviderMaySatisfyOwnVerificationRoute: false,
      declarationMayAuthorizeContactOrTransport: false,
      routeProvidersMayMutateHost: false,
      routeProvidersMayPersist: false
    },
    lifecycle: {
      status: 'VERIFICATION_RECIPIENT_ROUTE_CANDIDATE_UNTRUSTED',
      endpointResolved: false,
      recipientAuthenticated: false,
      authorityEstablished: false,
      transportPerformed: false,
      persisted: false,
      promoted: false,
      canon: false
    }
  });
}


function createR135(r134Value) {
  const boundary = {
    r134Contract: r134Value.contract,
    r134Preflight: r134Value.preflight,
    r134Custody: r134Value.custody,
    r134Declarations: r134Value.declarations
  };
  const contract = r135
    .createLandMatrixThermalVerifierRouteProviderTrustBootstrapRecursionPreflightContractReceipt(
      boundary);
  const witness = r135
    .createLandMatrixThermalVerifierRouteProviderTrustBootstrapRecursionWitness(
      contract, boundary);
  const preflight = r135
    .createLandMatrixThermalVerifierRouteProviderTrustBootstrapClosurePreflight(
      contract, witness, boundary);
  return { contract, witness, preflight, boundary };
}

const emptyR127 = createR127(fixture.r126EmptyContract,
  fixture.r126EmptyBundle, []);
const emptyR131 = createR131(createR130(createR129(createR128(emptyR127))));
const emptyR132 = createR132(emptyR131);
const emptyR133 = createR133(emptyR132);
const emptyR134 = createR134(emptyR133);
const emptyR135 = createR135(emptyR134);
assert.ok(r135
    .landMatrixThermalVerifierRouteProviderTrustBootstrapRecursionPreflightContractReceiptValid(
      emptyR135.contract, emptyR135.boundary) &&
  r135
    .landMatrixThermalVerifierRouteProviderTrustBootstrapRecursionWitnessValid(
      emptyR135.witness, emptyR135.contract, emptyR135.boundary) &&
  r135
    .landMatrixThermalVerifierRouteProviderTrustBootstrapClosurePreflightValid(
      emptyR135.preflight, emptyR135.contract, emptyR135.witness,
      emptyR135.boundary) &&
  emptyR135.witness.status ===
    'NO_COMPATIBLE_VERIFIER_ROUTE_PROVIDER_ROUTE_RECURSION_WITNESS_EMPTY' &&
  emptyR135.witness.routes.length === 0 &&
  emptyR135.preflight.status ===
    'NO_COMPATIBLE_VERIFIER_ROUTE_PROVIDER_TRUST_BOOTSTRAP_PREFLIGHT_EMPTY' &&
  audit
    .auditLandMatrixThermalVerifierRouteProviderTrustBootstrapRecursionPreflight(
      emptyR135.contract, emptyR135.witness, emptyR135.preflight,
      emptyR135.boundary).status === 'PASS',
'R135 current empty R134 route inventory remains an audited empty recursion witness and closure preflight');

const compatibleR127 = createR127(fixture.r126FullContract,
  fixture.r126FullBundle, [createResolverDeclaration()]);
const compatibleR128 = createR128(compatibleR127, {
  requestBatchId: 'selftest.r128.resolver-provider-verification',
  requesterId: 'selftest.r128.request-creator',
  requestedAt: '2026-08-27T01:00:00.000Z',
  expiresAt: '2026-08-27T01:05:00.000Z'
});
const endpointPacket = compatibleR128.batch.packets[0];
const compatibleR131 = createR131(createR130(createR129(compatibleR128,
  [createEndpointDeclaration(endpointPacket)])));
const authorityProviderId = 'selftest.trust-anchor.authority';
const transportProviderId = 'selftest.verification.transport';
const compatibleR132 = createR132(compatibleR131, [
  createProviderDeclaration(compatibleR131,
    r131.VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
    authorityProviderId),
  createProviderDeclaration(compatibleR131,
    r131.VERIFICATION_REQUEST_SEND_RECEIVE_CAPABILITY_ID,
    transportProviderId, authorityProviderId)
]);
const compatibleR133 = createR133(compatibleR132, {
  requestBatchId: 'selftest.r133.verifier-route-provider-verification',
  requesterId: 'selftest.r133.request-creator',
  requestedAt: '2026-08-27T02:00:00.000Z',
  expiresAt: '2026-08-27T02:05:00.000Z'
});
const routeDeclarations = compatibleR133.batch.packets.map((packet, index) =>
  createRouteDeclaration(packet, 'request-' + index));
const compatibleR134 = createR134(compatibleR133, routeDeclarations);
assert.ok(compatibleR134.preflight.routes.length === 2 &&
  compatibleR134.preflight.routes.every(item =>
    item.status === 'RECIPIENT_ROUTE_CONTRACT_COMPATIBLE_UNVERIFIED' &&
    item.operationalReadiness === 'BLOCKED') &&
  r134Audit
    .auditLandMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflight(
      compatibleR134.contract, compatibleR134.preflight,
      compatibleR134.custody, compatibleR134.declarations).status === 'PASS',
'R135 synthetic custody starts from the independently audited two-route R134 preflight');

const compatibleR135 = createR135(compatibleR134);
assert.ok(compatibleR135.witness.status ===
    'RECURSIVE_UNVERIFIED_VERIFIER_ROUTE_PROVIDER_DEPENDENCY_WITNESSED' &&
  compatibleR135.witness.routes.length === 2 &&
  compatibleR135.witness.summary.recursionWitnessCount === 2 &&
  compatibleR135.witness.summary.routeProviderRoleClaimCount === 6 &&
  compatibleR135.witness.summary.stageCount === 12 &&
  compatibleR135.witness.routes.every(route =>
    route.closure.closed === false &&
    route.closure.reason ===
      'NO_INDEPENDENT_OUT_OF_BAND_AUTHORITY_ANCHORED_VERIFIER_ROUTE_WITH_NATIVE_MATCHED_RECEIPTS') &&
  audit
    .auditLandMatrixThermalVerifierRouteProviderTrustBootstrapRecursionPreflight(
      compatibleR135.contract, compatibleR135.witness,
      compatibleR135.preflight, compatibleR135.boundary).status === 'PASS',
'R135 witnesses two six-stage dependency-class recursions over six unverified route-provider roles');

const expectedStageRoles = [
  'R133_PROVIDER_VERIFICATION_REQUEST_RECIPIENT_ROUTE_UNRESOLVED',
  'R134_CALLER_DECLARED_THREE_PROVIDER_ROUTE_UNVERIFIED',
  'ROUTE_PROVIDERS_REQUIRE_INDEPENDENT_IDENTITY_AUTHORITY_IMPLEMENTATION_AND_AVAILABILITY_PROOF',
  'ROUTE_PROVIDER_VERIFICATION_REQUESTS_REQUIRE_INDEPENDENT_RECIPIENT_ROUTES',
  'ANOTHER_UNVERIFIED_THREE_PROVIDER_ROUTE_REENTERS_THE_SAME_DEPENDENCY_CLASS',
  'OUT_OF_BAND_AUTHORITY_ANCHORED_NATIVE_ROUTE_REQUIRED_TO_TERMINATE_RECURSION'
];
const requiredCapabilities = [
  'transport.foundation-planet.external-provider-verification.endpoint.resolve',
  'authority.foundation-planet.external-provider-verification.verifier-route.trust-anchor.resolve',
  'transport.foundation-planet.external-provider-verification.request.send-receive'
];
assert.ok(compatibleR135.witness.routes.every(route =>
    JSON.stringify(route.stages.map(stage => stage.role)) ===
      JSON.stringify(expectedStageRoles) &&
    route.stages.every(stage =>
      JSON.stringify(stage.requiredCapabilityIds) ===
        JSON.stringify(requiredCapabilities) &&
      stage.independentlyVerified === false) &&
    JSON.stringify(route.recurringDependency.capabilityIds) ===
      JSON.stringify(requiredCapabilities) &&
    route.recurringDependency.firstUntrustedProviderStageOrdinal === 2 &&
    route.recurringDependency.repeatedDependencyStageOrdinal === 5 &&
    route.recurringDependency.independentlyAnchoredOutcomePresent === false),
'R135 records the exact recurrence topology without claiming a literal artifact cycle or automatic continuation');

assert.ok(compatibleR135.witness.routes.every((route, index) =>
    JSON.stringify(route.routeProviders.map(item => item.role)) ===
      JSON.stringify(['ENDPOINT_RESOLVER', 'TRUST_ANCHOR_AUTHORITY',
        'RECEIPTED_TRANSPORT']) &&
    new Set(route.routeProviders.map(item => item.providerId)).size === 3 &&
    route.routeProviders.every(item =>
      item.providerId !== compatibleR133.batch.packets[index]
        .claimedProvider.providerId &&
      item.trust === 'CALLER_SUPPLIED_UNTRUSTED' &&
      item.independentlyVerified === false)) &&
  compatibleR135.witness.summary.independentlyVerifiedRouteProviderCount === 0,
'R135 preserves three distinct untrusted route-provider roles and excludes candidate self-routing');

assert.ok(compatibleR135.preflight.status ===
    'BLOCKED_RECURSIVE_UNVERIFIED_VERIFIER_ROUTE_PROVIDER_DEPENDENCY' &&
  compatibleR135.preflight.routeClosures.length === 2 &&
  compatibleR135.preflight.routeClosures.every(route =>
    route.status ===
      'BLOCKED_EXTERNAL_AUTHORITY_ANCHORED_VERIFIER_ROUTE_AND_NATIVE_RECEIPTS_REQUIRED' &&
    JSON.stringify(route.missingCapabilityIds) ===
      JSON.stringify(requiredCapabilities) &&
    route.requiredEvidenceIds.length === 7 &&
    route.automaticContinuationAllowed === false) &&
  compatibleR135.preflight.requiredExternalEvidence.length === 14 &&
  compatibleR135.preflight.capabilityGap.overall === 'BLOCKED' &&
  JSON.stringify(compatibleR135.preflight.capabilityGap.missingCapabilityIds) ===
    JSON.stringify(requiredCapabilities),
'R135 blocks both routes on the exact three external capabilities and fourteen native evidence obligations');

const evidenceIds = compatibleR135.preflight.requiredExternalEvidence
  .filter(item => item.routeId === compatibleR135.witness.routes[0].routeId)
  .map(item => item.evidenceId);
assert.ok(JSON.stringify(evidenceIds) === JSON.stringify([
    'out-of-band-route-authority-designation-receipt',
    'exact-request-recipient-locator-and-route-binding-receipt',
    'three-route-provider-identity-authority-expiry-and-revocation-receipts',
    'three-route-provider-implementation-integrity-and-live-availability-receipts',
    'non-circular-route-provider-dependency-graph-proof',
    'endpoint-ownership-recipient-identity-and-allowed-denied-probe-receipts',
    'per-request-contact-authority-and-matched-native-transport-receipts'
  ]) &&
  compatibleR135.preflight.summary.authorityAnchoredRouteCount === 0 &&
  compatibleR135.preflight.summary.endpointResolvedCount === 0 &&
  compatibleR135.preflight.summary.recipientAuthenticatedCount === 0 &&
  compatibleR135.preflight.summary.authorityEstablishedCount === 0 &&
  compatibleR135.preflight.summary.contactAuthorizedCount === 0 &&
  compatibleR135.preflight.summary.transmittedRequestCount === 0 &&
  compatibleR135.preflight.summary.senderReceiptCount === 0 &&
  compatibleR135.preflight.summary.receiverReceiptCount === 0 &&
  compatibleR135.preflight.summary.independentlyVerifiedProviderCount === 0,
'R135 routes authority, identity, implementation, acyclicity, endpoint, probe, consent, and transport claims to native external evidence without inventing outcomes');

assert.throws(() => r135
  .createLandMatrixThermalVerifierRouteProviderTrustBootstrapRecursionPreflightContractReceipt({
    ...compatibleR135.boundary,
    r134Preflight: emptyR134.preflight
  }), /exact R134 boundary/,
'R135 rejects substitution across the exact R134 custody boundary');

const overclaimWitness = structuredClone(compatibleR135.witness);
overclaimWitness.routes[0].closure.closed = true;
overclaimWitness.routes[0].routeProviders.forEach(provider => {
  provider.independentlyVerified = true;
});
Object.keys(overclaimWitness.routes[0].truth).forEach(key => {
  overclaimWitness.routes[0].truth[key] = true;
});
overclaimWitness.summary.independentlyAnchoredRouteCount = 1;
overclaimWitness.summary.independentlyVerifiedRouteProviderCount = 3;
resign(overclaimWitness);
const overclaimPreflight = structuredClone(compatibleR135.preflight);
overclaimPreflight.routeClosures[0].automaticContinuationAllowed = true;
overclaimPreflight.routeClosures[0].routeProvidersVerified = true;
overclaimPreflight.routeClosures[0].endpointResolved = true;
overclaimPreflight.summary.authorityAnchoredRouteCount = 1;
overclaimPreflight.summary.transmittedRequestCount = 1;
overclaimPreflight.summary.senderReceiptCount = 1;
overclaimPreflight.summary.receiverReceiptCount = 1;
overclaimPreflight.summary.independentlyVerifiedProviderCount = 1;
Object.keys(overclaimPreflight.truth).forEach(key => {
  overclaimPreflight.truth[key] = true;
});
resign(overclaimPreflight);
assert.ok(!r135
    .landMatrixThermalVerifierRouteProviderTrustBootstrapRecursionWitnessValid(
      overclaimWitness, compatibleR135.contract, compatibleR135.boundary) &&
  !r135
    .landMatrixThermalVerifierRouteProviderTrustBootstrapClosurePreflightValid(
      overclaimPreflight, compatibleR135.contract, compatibleR135.witness,
      compatibleR135.boundary) &&
  audit
    .auditLandMatrixThermalVerifierRouteProviderTrustBootstrapRecursionPreflight(
      compatibleR135.contract, compatibleR135.witness, overclaimPreflight,
      compatibleR135.boundary).status === 'FAIL',
'R135 rejects re-signed closure, provider-verification, endpoint, authority, transport, receipt, evidence, persistence, and mutation overclaims');

const producerText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-verifier-route-provider-trust-bootstrap-recursion-preflight.mjs'), 'utf8');
const auditText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-verifier-route-provider-trust-bootstrap-recursion-preflight-audit.mjs'), 'utf8');
assert.ok(compatibleR135.contract.resourceBudget.maximumRoutes === 2 &&
  compatibleR135.contract.resourceBudget.providerRolesPerRoute === 3 &&
  compatibleR135.contract.resourceBudget.stagesPerRoute === 6 &&
  compatibleR135.contract.resourceBudget.evidenceRequirementsPerRoute === 7 &&
  compatibleR135.contract.resourceBudget.maximumSerializedWitnessBytes ===
    524288 &&
  compatibleR135.contract.resourceBudget.maximumSerializedPreflightBytes ===
    524288 &&
  compatibleR135.witness.truth.literalArtifactGraphCycleAsserted === false &&
  compatibleR135.preflight.truth.recursiveRequestGenerationPermitted === false &&
  !/\bfetch\s*\(|XMLHttpRequest|new\s+WebSocket|node:dns|node:net/.test(
    producerText) &&
  !auditText.includes(
    'createLandMatrixThermalVerifierRouteProviderTrustBootstrap') &&
  !auditText.includes(
    'landMatrixThermalVerifierRouteProviderTrustBootstrapRecursionPreflightContractReceiptValid') &&
  !auditText.includes(
    'landMatrixThermalVerifierRouteProviderTrustBootstrapRecursionWitnessValid') &&
  !auditText.includes(
    'landMatrixThermalVerifierRouteProviderTrustBootstrapClosurePreflightValid') &&
  JSON.stringify(fixture) === fixtureBefore,
'R135 is resource-bounded, non-networked, independently audited, non-literal about recursion, and leaves exact R126 custody unchanged');

console.log('foundation planet R135 isolated selftest: PASS (10 assertions)');
