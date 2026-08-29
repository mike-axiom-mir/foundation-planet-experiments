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
const r135Audit = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-provider-trust-bootstrap-recursion-preflight-audit.mjs')).href);
const r136 = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-out-of-band-authority-designation-request.mjs')).href);
const r136Audit = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-out-of-band-authority-designation-request-audit.mjs')).href);

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

function createR136(r135Value, options = {}) {
  const boundary = {
    r135Contract: r135Value.contract,
    r135Witness: r135Value.witness,
    r135Preflight: r135Value.preflight,
    r135Boundary: r135Value.boundary
  };
  const contract = r136
    .createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationRequestContractReceipt(
      boundary);
  const batch = r136
    .createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationRequestBatch(
      contract, boundary, options);
  return { contract, batch, boundary, options };
}

const emptyR127 = createR127(fixture.r126EmptyContract,
  fixture.r126EmptyBundle, []);
const emptyR131 = createR131(createR130(createR129(createR128(emptyR127))));
const emptyR132 = createR132(emptyR131);
const emptyR133 = createR133(emptyR132);
const emptyR134 = createR134(emptyR133);
const emptyR135 = createR135(emptyR134);
const emptyR136 = createR136(emptyR135);
assert.ok(r136
    .landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationRequestContractReceiptValid(
      emptyR136.contract, emptyR136.boundary) &&
  r136
    .landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationRequestBatchValid(
      emptyR136.batch, emptyR136.contract, emptyR136.boundary) &&
  emptyR136.batch.status ===
    'NO_BLOCKED_VERIFIER_ROUTE_PROVIDER_TRUST_BOOTSTRAP_CLOSURES_REQUEST_BATCH_EMPTY' &&
  emptyR136.batch.packets.length === 0 &&
  emptyR136.batch.requestContext === null &&
  r136Audit
    .auditLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationRequest(
      emptyR136.contract, emptyR136.batch, emptyR136.boundary).status === 'PASS',
'R136 current zero-route custody yields an independently audited empty batch without invented request metadata');

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
const compatibleR135 = createR135(compatibleR134);
assert.ok(compatibleR134.preflight.routes.length === 2 &&
  r134Audit
    .auditLandMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflight(
      compatibleR134.contract, compatibleR134.preflight,
      compatibleR134.custody, compatibleR134.declarations).status === 'PASS' &&
  compatibleR135.preflight.routeClosures.length === 2 &&
  compatibleR135.preflight.requiredExternalEvidence.length === 14 &&
  compatibleR135.preflight.routeClosures.every(closure =>
    closure.status ===
      'BLOCKED_EXTERNAL_AUTHORITY_ANCHORED_VERIFIER_ROUTE_AND_NATIVE_RECEIPTS_REQUIRED' &&
    closure.automaticContinuationAllowed === false) &&
  r135Audit
    .auditLandMatrixThermalVerifierRouteProviderTrustBootstrapRecursionPreflight(
      compatibleR135.contract, compatibleR135.witness,
      compatibleR135.preflight, compatibleR135.boundary).status === 'PASS',
'R136 synthetic custody begins with two independently audited R135 blocked closures and fourteen native evidence obligations');

const requestOptions = {
  requestBatchId: 'selftest.r136.out-of-band-authority-designation',
  requesterId: 'selftest.r136.request-creator',
  requestedAt: '2026-08-27T03:00:00.000Z',
  expiresAt: '2026-08-27T03:05:00.000Z'
};
const compatibleR136 = createR136(compatibleR135, requestOptions);
assert.ok(compatibleR136.batch.status ===
    'OUT_OF_BAND_VERIFIER_ROUTE_AUTHORITY_DESIGNATION_REQUESTS_CREATED_NOT_TRANSMITTED_NOT_AUTHORIZED' &&
  compatibleR136.batch.packets.length === 2 &&
  compatibleR136.batch.summary.requestPacketCount === 2 &&
  compatibleR136.batch.summary.decisionCriterionCount === 10 &&
  compatibleR136.batch.summary.externalEvidenceRequirementCount === 14 &&
  JSON.stringify(compatibleR136.batch.requestContext) ===
    JSON.stringify(requestOptions) &&
  r136Audit
    .auditLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationRequest(
      compatibleR136.contract, compatibleR136.batch, compatibleR136.boundary,
      compatibleR136.options).status === 'PASS',
'R136 creates two bounded proposal-only requests and reconstructs them independently');

assert.ok(compatibleR136.batch.packets.every(packet =>
    packet.status ===
      'PENDING_MIKE_TOBI_AXM_HOST_AUTHORITY_DECISION_PROPOSAL_ONLY' &&
    packet.authorityReview.requestedReviewSeatId ===
      'axm-host-authority-review-seat' &&
    JSON.stringify(packet.authorityReview.eligibleDecisionMakers) ===
      JSON.stringify(['MIKE_TOBI', 'AUTHENTICATED_HOST_GOVERNANCE_SEAT']) &&
    packet.authorityReview.requiredDecisionCapabilityId ===
      r136.VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECIDE_CAPABILITY_ID &&
    packet.authorityReview.authoritySeatAuthenticated === false &&
    packet.authorityReview.candidateOrRouteProviderControlExcluded === false &&
    packet.authorityReview.decision === null &&
    packet.authorityReview.designationReceipt === null),
'R136 requests review through the existing host-authority seat without authenticating a decision maker or inventing a decision');

assert.ok(compatibleR136.batch.packets.every((packet, index) => {
  const route = compatibleR135.witness.routes[index];
  const request = packet.requestedRouteDesignation;
  return request.routeId === route.routeId &&
    request.sourceRequestId === route.requestId &&
    request.sourceRequestPacketDigest === route.requestPacketDigest &&
    request.sourceR134DeclarationDigest === route.sourceDeclarationDigest &&
    request.candidateProviderId === route.candidateProviderId &&
    request.claimedVerificationRecipientId ===
      route.claimedVerificationRecipientId &&
    request.claimedLocatorKind === route.claimedLocatorKind &&
    request.claimedLocatorValue === route.claimedLocatorValue &&
    JSON.stringify(request.routeProviders) === JSON.stringify(route.routeProviders) &&
    request.routeProviders.every(provider =>
      provider.providerId !== request.candidateProviderId) &&
    JSON.stringify(request.recurringCapabilityIds) ===
      JSON.stringify(route.recurringDependency.capabilityIds) &&
    request.designationScope ===
      'OUT_OF_BAND_ROUTE_ONLY_PROVIDER_VERIFICATION_AND_OPERATION_REMAIN_SEPARATELY_BLOCKED';
}),
'R136 binds each proposal to the exact R135 route, declaration, candidate, locator, three non-candidate route providers, and recurring capability set');

const criterionIds = [
  'EXACT_R135_R134_ROUTE_AND_DECLARATION_BINDING',
  'INDEPENDENT_AUTHORITY_SEAT_IDENTITY_SCOPE_AND_DENIAL_PROBES',
  'CANDIDATE_AND_ROUTE_PROVIDER_NON_CONTROL',
  'DESIGNATION_DOES_NOT_VERIFY_OR_AUTHORIZE_OPERATION',
  'BOUNDED_EXPIRY_REVOCATION_AND_DENIAL_DEFAULT'
];
assert.ok(compatibleR136.batch.packets.every((packet, index) =>
    JSON.stringify(packet.decisionCriteria.map(item => item.criterionId)) ===
      JSON.stringify(criterionIds) &&
    packet.decisionCriteria.every(item => item.satisfied === false) &&
    packet.requiredExternalEvidence.length === 7 &&
    packet.requiredExternalEvidence.every(item =>
      item.routeId === compatibleR135.witness.routes[index].routeId &&
      item.admitted === false)),
'R136 carries five unsatisfied governance criteria and all seven unadmitted R135 evidence obligations per route');

assert.ok(compatibleR136.batch.packets.every(packet =>
    packet.transport.status === 'NOT_TRANSMITTED' &&
    packet.transport.endpoint === null &&
    packet.transport.contactAttempted === false &&
    packet.transport.senderReceipt === null &&
    packet.transport.receiverReceipt === null &&
    Object.values(packet.effects).every(value => value === false) &&
    Object.entries(packet.truth).every(([key, value]) =>
      ['exactR135BlockedClosureBound', 'requestCreated', 'proposalOnly']
        .includes(key) ? value === true : value === false)) &&
  compatibleR136.batch.summary.authenticatedAuthoritySeatCount === 0 &&
  compatibleR136.batch.summary.authorityDecisionCount === 0 &&
  compatibleR136.batch.summary.designationReceiptCount === 0 &&
  compatibleR136.batch.summary.designatedRouteCount === 0 &&
  compatibleR136.batch.summary.transmittedRequestCount === 0 &&
  compatibleR136.batch.summary.senderReceiptCount === 0 &&
  compatibleR136.batch.summary.receiverReceiptCount === 0 &&
  compatibleR136.batch.summary.evidenceAdmittedCount === 0 &&
  compatibleR136.batch.summary.admissionReady === false &&
  Object.entries(compatibleR136.batch.truth).every(([key, value]) =>
    ['exactR135EligibleClosuresBound', 'requestsCreatedWithoutTransmission']
      .includes(key) ? value === true : value === false),
'R136 keeps every authority, designation, endpoint, contact, transport, receipt, verification, evidence, persistence, promotion, canon, and mutation outcome false');

assert.throws(() => r136
  .createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationRequestContractReceipt({
    ...compatibleR136.boundary,
    r135Preflight: emptyR135.preflight
  }), /exact R135 boundary/,
'R136 rejects substitution across the exact R135 custody boundary');

assert.throws(() => r136
  .createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationRequestBatch(
    compatibleR136.contract, compatibleR136.boundary, {
      ...requestOptions,
      expiresAt: '2026-08-27T03:05:00.001Z'
    }), /exact bounded request options/,
'R136 refuses request lifetimes longer than five minutes');

const overclaimBatch = structuredClone(compatibleR136.batch);
const overclaimPacket = overclaimBatch.packets[0];
overclaimPacket.authorityReview.authoritySeatAuthenticated = true;
overclaimPacket.authorityReview.candidateOrRouteProviderControlExcluded = true;
overclaimPacket.authorityReview.decision = { outcome: 'DESIGNATE' };
overclaimPacket.authorityReview.designationReceipt = { receipt: 'fictional' };
overclaimPacket.transport.status = 'DELIVERED';
overclaimPacket.transport.endpoint = 'fictional://authority-seat';
overclaimPacket.transport.contactAttempted = true;
overclaimPacket.transport.senderReceipt = { receipt: 'fictional-sender' };
overclaimPacket.transport.receiverReceipt = { receipt: 'fictional-receiver' };
Object.keys(overclaimPacket.effects).forEach(key => {
  overclaimPacket.effects[key] = true;
});
Object.keys(overclaimPacket.truth).forEach(key => {
  overclaimPacket.truth[key] = true;
});
overclaimPacket.historicalPhysicalSourceOwner = { ownerId: 'fictional-owner' };
overclaimPacket.historicalPhysicalSourceDebit = { debitId: 'fictional-debit' };
resign(overclaimPacket);
Object.keys(overclaimBatch.summary).forEach(key => {
  if (typeof overclaimBatch.summary[key] === 'number') {
    overclaimBatch.summary[key] = Math.max(1, overclaimBatch.summary[key]);
  } else if (typeof overclaimBatch.summary[key] === 'boolean') {
    overclaimBatch.summary[key] = true;
  }
});
Object.keys(overclaimBatch.truth).forEach(key => {
  overclaimBatch.truth[key] = true;
});
resign(overclaimBatch);
const producerText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-verifier-route-out-of-band-authority-designation-request.mjs'), 'utf8');
const auditText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-verifier-route-out-of-band-authority-designation-request-audit.mjs'), 'utf8');
assert.ok(!r136
    .landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationRequestBatchValid(
      overclaimBatch, compatibleR136.contract, compatibleR136.boundary,
      requestOptions) &&
  r136Audit
    .auditLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationRequest(
      compatibleR136.contract, overclaimBatch, compatibleR136.boundary,
      requestOptions).status === 'FAIL' &&
  compatibleR136.contract.resourceBudget.maximumRequestPackets === 2 &&
  compatibleR136.contract.resourceBudget.decisionCriteriaPerPacket === 5 &&
  compatibleR136.contract.resourceBudget.evidenceRequirementsPerPacket === 7 &&
  compatibleR136.contract.resourceBudget.maximumRequestWindowMs === 300000 &&
  compatibleR136.contract.resourceBudget.maximumSerializedBatchBytes === 524288 &&
  !/\bfetch\s*\(|XMLHttpRequest|new\s+WebSocket|node:dns|node:net/.test(
    producerText) &&
  !auditText.includes(
    'createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignation') &&
  !auditText.includes(
    'landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationRequestContractReceiptValid') &&
  !auditText.includes(
    'landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationRequestBatchValid') &&
  JSON.stringify(fixture) === fixtureBefore,
'R136 rejects re-signed authority, designation, route, endpoint, contact, transport, receipt, verification, evidence, historical-owner/debit, persistence, promotion, canon, and mutation overclaims while remaining bounded, non-networked, independently audited, and custody-preserving');

console.log('foundation planet R136 isolated selftest: PASS (10 assertions)');
