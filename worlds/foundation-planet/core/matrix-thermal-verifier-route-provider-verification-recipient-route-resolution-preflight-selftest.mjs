import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const fixturePath = process.argv[2];
if (!fixturePath) throw new Error('R134 selftest requires an exact R126 fixture');
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
const audit = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-provider-verification-recipient-route-resolution-preflight-audit.mjs')).href);

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

const emptyR127 = createR127(fixture.r126EmptyContract,
  fixture.r126EmptyBundle, []);
const emptyR131 = createR131(createR130(createR129(createR128(emptyR127))));
const emptyR132 = createR132(emptyR131);
const emptyR133 = createR133(emptyR132);
const emptyR134 = createR134(emptyR133);
assert.ok(r134
    .landMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflightContractReceiptValid(
      emptyR134.contract, emptyR134.custody) &&
  r134
    .landMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflightValid(
      emptyR134.preflight, emptyR134.contract, emptyR134.custody) &&
  emptyR134.preflight.status ===
    'NO_VERIFIER_ROUTE_PROVIDER_VERIFICATION_REQUESTS_RECIPIENT_ROUTE_PREFLIGHT_EMPTY' &&
  emptyR134.preflight.routes.length === 0 &&
  audit
    .auditLandMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflight(
      emptyR134.contract, emptyR134.preflight, emptyR134.custody).status === 'PASS',
'R134 current empty R133 request batch remains an audited empty recipient-route preflight');

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
assert.ok(compatibleR133.batch.packets.length === 2 &&
  compatibleR133.batch.summary.proofRequirementCount === 12 &&
  r133Audit
    .auditLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderVerificationRequest(
      compatibleR133.contract, compatibleR133.batch, compatibleR133.custody,
      compatibleR133.options).status === 'PASS',
'R134 synthetic custody starts from the independently audited two-request R133 batch');

const noDeclarations = createR134(compatibleR133);
assert.ok(noDeclarations.preflight.status ===
    'VERIFIER_ROUTE_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_UNRESOLVED_NO_DECLARATIONS' &&
  noDeclarations.preflight.routes.length === 2 &&
  noDeclarations.preflight.routes.every(item =>
    item.status === 'MISSING_RECIPIENT_ROUTE_DECLARATION' &&
    item.operationalReadiness === 'BLOCKED') &&
  noDeclarations.preflight.summary.missingRouteCount === 2,
'R134 leaves both future verification requests blocked when no recipient routes are declared');

const routeDeclarations = compatibleR133.batch.packets.map((packet, index) =>
  createRouteDeclaration(packet, 'request-' + index));
const compatibleRoutes = createR134(compatibleR133, routeDeclarations);
assert.ok(compatibleRoutes.preflight.assessments.length === 2 &&
  compatibleRoutes.preflight.assessments.every(item =>
    item.status === 'RECIPIENT_ROUTE_CONTRACT_COMPATIBLE_UNVERIFIED') &&
  compatibleRoutes.preflight.routes.every(item =>
    item.status === 'RECIPIENT_ROUTE_CONTRACT_COMPATIBLE_UNVERIFIED' &&
    item.operationalReadiness === 'BLOCKED') &&
  compatibleRoutes.preflight.summary.compatibleUnverifiedRouteCount === 2 &&
  audit
    .auditLandMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflight(
      compatibleRoutes.contract, compatibleRoutes.preflight,
      compatibleRoutes.custody, routeDeclarations).status === 'PASS',
'R134 structurally accepts two exact-bound declarations while preserving both routes as unverified and blocked');

assert.ok(compatibleRoutes.preflight.routes.every(item =>
    item.endpointResolverProviderId !== item.candidateProviderId &&
    item.trustAnchorAuthorityProviderId !== item.candidateProviderId &&
    item.transportProviderId !== item.candidateProviderId &&
    new Set([item.endpointResolverProviderId,
      item.trustAnchorAuthorityProviderId,
      item.transportProviderId]).size === 3 &&
    Object.values(item.truth).every(value => value === false)) &&
  compatibleRoutes.preflight.summary.independentlyResolvedRouteCount === 0 &&
  compatibleRoutes.preflight.summary.transmittedRequestCount === 0 &&
  compatibleRoutes.preflight.summary.independentlyVerifiedProviderCount === 0,
'R134 keeps the candidate and three route roles distinct without claiming resolution, authority, transport, or verification');

const selfRoutingDeclaration = structuredClone(routeDeclarations[0]);
const candidateId = selfRoutingDeclaration.candidateProvider.providerId;
selfRoutingDeclaration.routeProviders.endpointResolver.providerId = candidateId;
selfRoutingDeclaration.routeProviders.transport.declaredDependencyProviderIds[0] =
  candidateId;
resign(selfRoutingDeclaration);
const selfRouting = createR134(compatibleR133, [selfRoutingDeclaration]);
assert.ok(selfRouting.preflight.assessments[0].status ===
    'RECIPIENT_ROUTE_DECLARATION_REJECTED' &&
  selfRouting.preflight.assessments[0].reasonCodes.includes(
    'DIRECT_CANDIDATE_SELF_ROUTING_PROHIBITED') &&
  selfRouting.preflight.routes[0].status ===
    'REJECTED_RECIPIENT_ROUTE_DECLARATION',
'R134 rejects a candidate provider inserted as its own endpoint-route provider');

const circularDeclaration = structuredClone(routeDeclarations[0]);
const circularId = circularDeclaration.routeProviders.endpointResolver.providerId;
circularDeclaration.routeProviders.endpointResolver.declaredDependencyProviderIds =
  [circularId];
resign(circularDeclaration);
const collisionDeclaration = structuredClone(routeDeclarations[1]);
collisionDeclaration.routeProviders.transport.providerId =
  collisionDeclaration.routeProviders.endpointResolver.providerId;
resign(collisionDeclaration);
const circularAndCollision = createR134(compatibleR133,
  [circularDeclaration, collisionDeclaration]);
assert.ok(circularAndCollision.preflight.assessments[0].reasonCodes.includes(
    'CIRCULAR_OR_CANDIDATE_DEPENDENCY_PROHIBITED') &&
  circularAndCollision.preflight.assessments[1].reasonCodes.includes(
    'ROUTE_PROVIDER_ROLE_COLLISION_PROHIBITED') &&
  circularAndCollision.preflight.summary.circularDependencyRejectionCount >= 1 &&
  circularAndCollision.preflight.summary.roleCollisionRejectionCount === 1,
'R134 rejects circular route dependencies and provider role collisions');

const ambiguousDeclarations = [
  createRouteDeclaration(compatibleR133.batch.packets[0], 'ambiguous-a'),
  createRouteDeclaration(compatibleR133.batch.packets[0], 'ambiguous-b')
];
const ambiguous = createR134(compatibleR133, ambiguousDeclarations);
assert.ok(ambiguous.preflight.routes[0].status ===
    'AMBIGUOUS_RECIPIENT_ROUTE_DECLARATION' &&
  ambiguous.preflight.routes[0].endpointResolverProviderId === null &&
  ambiguous.preflight.routes[0].trustAnchorAuthorityProviderId === null &&
  ambiguous.preflight.routes[0].transportProviderId === null &&
  ambiguous.preflight.summary.ambiguousRouteCount === 1,
'R134 rejects ambiguity instead of silently selecting one compatible unverified route');

assert.throws(() => r134
  .createLandMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflightContractReceipt({
    ...compatibleRoutes.custody,
    r133Batch: emptyR133.batch
  }), /exact R133 custody/,
'R134 rejects substitution across the exact R133 custody boundary');

const overclaim = structuredClone(compatibleRoutes.preflight);
overclaim.routes[0].operationalReadiness = 'READY';
Object.keys(overclaim.routes[0].truth).forEach(key => {
  overclaim.routes[0].truth[key] = true;
});
overclaim.summary.independentlyResolvedRouteCount = 1;
overclaim.summary.authenticatedRecipientCount = 1;
overclaim.summary.authorityEstablishedCount = 1;
overclaim.summary.contactAuthorizedCount = 1;
overclaim.summary.transmittedRequestCount = 1;
overclaim.summary.senderReceiptCount = 1;
overclaim.summary.receiverReceiptCount = 1;
overclaim.summary.independentlyVerifiedProviderCount = 1;
overclaim.summary.evidenceAdmittedCount = 1;
overclaim.summary.admissionReady = true;
Object.keys(overclaim.truth).forEach(key => {
  overclaim.truth[key] = true;
});
resign(overclaim);
assert.ok(!r134
    .landMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflightValid(
      overclaim, compatibleRoutes.contract, compatibleRoutes.custody,
      routeDeclarations) &&
  audit
    .auditLandMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflight(
      compatibleRoutes.contract, overclaim, compatibleRoutes.custody,
      routeDeclarations).status === 'FAIL',
'R134 rejects re-signed endpoint, recipient, authority, transport, verification, evidence, persistence, and mutation overclaims');

const producerText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-verifier-route-provider-verification-recipient-route-resolution-preflight.mjs'), 'utf8');
const auditText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-verifier-route-provider-verification-recipient-route-resolution-preflight-audit.mjs'), 'utf8');
assert.ok(compatibleRoutes.contract.resourceBudget.maximumRouteDeclarations === 4 &&
  compatibleRoutes.contract.resourceBudget.maximumDeclarationsPerRequest === 2 &&
  compatibleRoutes.contract.resourceBudget.maximumDeclaredDependencies === 12 &&
  compatibleRoutes.contract.resourceBudget.maximumSerializedDeclarationBytes ===
    131072 &&
  compatibleRoutes.contract.resourceBudget.maximumSerializedPreflightBytes ===
    524288 &&
  !/\bfetch\s*\(|XMLHttpRequest|new\s+WebSocket|node:dns|node:net/.test(
    producerText) &&
  !auditText.includes(
    'createLandMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflight') &&
  !auditText.includes(
    'landMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflightContractReceiptValid') &&
  !auditText.includes(
    'landMatrixThermalVerifierRouteProviderVerificationRecipientRouteResolutionPreflightValid') &&
  JSON.stringify(fixture) === fixtureBefore,
'R134 is resource-bounded, non-networked, independently audited, and leaves exact R126 custody unchanged');

console.log('foundation planet R134 isolated selftest: PASS (10 assertions)');
