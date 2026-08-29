import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const fixturePath = process.argv[2];
if (!fixturePath) throw new Error('R137 selftest requires an exact R126 fixture');
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
const r136 = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-out-of-band-authority-designation-request.mjs')).href);
const r137 = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-out-of-band-authority-designation-decision-capability-specification.mjs')).href);
const r137Audit = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-out-of-band-authority-designation-decision-capability-specification-audit.mjs')).href);

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

function createR137(r136Value) {
  const boundary = {
    r136Contract: r136Value.contract,
    r136Batch: r136Value.batch,
    r136Boundary: r136Value.boundary,
    r136Options: r136Value.options
  };
  const contract = r137
    .createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionCapabilitySpecificationContractReceipt(
      boundary);
  const bundle = r137
    .createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionCapabilitySpecificationBundle(
      contract, boundary);
  return { contract, bundle, boundary };
}

const emptyR127 = createR127(fixture.r126EmptyContract,
  fixture.r126EmptyBundle, []);
const emptyR131 = createR131(createR130(createR129(createR128(emptyR127))));
const emptyR132 = createR132(emptyR131);
const emptyR133 = createR133(emptyR132);
const emptyR134 = createR134(emptyR133);
const emptyR135 = createR135(emptyR134);
const emptyR136 = createR136(emptyR135);
const emptyR137 = createR137(emptyR136);
assert.ok(r137
    .landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionCapabilitySpecificationBundleValid(
      emptyR137.bundle, emptyR137.contract, emptyR137.boundary) &&
  emptyR137.bundle.status ===
    'OUT_OF_BAND_VERIFIER_ROUTE_AUTHORITY_DESIGNATION_DECISION_CAPABILITY_SPECIFICATION_AVAILABLE_WITH_NO_CURRENT_REQUEST_BINDINGS' &&
  emptyR137.bundle.specifications.length === 1 &&
  emptyR137.bundle.inputBindings.length === 0 &&
  emptyR137.bundle.summary.sourceRequestPacketCount === 0,
'R137 current zero-request custody yields one validated specification with no invented input binding');

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
const requestOptions = {
  requestBatchId: 'selftest.r136.out-of-band-authority-designation',
  requesterId: 'selftest.r136.request-creator',
  requestedAt: '2026-08-27T03:00:00.000Z',
  expiresAt: '2026-08-27T03:05:00.000Z'
};
const compatibleR136 = createR136(compatibleR135, requestOptions);
assert.ok(compatibleR135.preflight.routeClosures.length === 2 &&
  compatibleR136.batch.packets.length === 2,
'R137 synthetic custody begins with two exact-builder-validated R136 proposal-only requests');

const compatibleR137 = createR137(compatibleR136);
assert.ok(compatibleR137.bundle.status ===
    'OUT_OF_BAND_VERIFIER_ROUTE_AUTHORITY_DESIGNATION_DECISION_CAPABILITY_SPECIFICATION_BOUND_TO_CURRENT_REQUESTS' &&
  compatibleR137.bundle.specifications.length === 1 &&
  compatibleR137.bundle.inputBindings.length === 2 &&
  compatibleR137.bundle.summary.capabilitySpecificationCount === 1 &&
  compatibleR137.bundle.summary.inputBindingCount === 2 &&
  compatibleR137.bundle.summary.decisionCriterionReferenceCount === 10 &&
  compatibleR137.bundle.summary.externalEvidenceRequirementReferenceCount === 14 &&
  r137Audit
    .auditLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionCapabilitySpecification(
      compatibleR137.contract, compatibleR137.bundle,
      compatibleR137.boundary).status === 'PASS',
'R137 binds one missing authority specification to both R136 requests and independently reconstructs the bundle');

assert.ok(compatibleR137.bundle.inputBindings.every((binding, index) => {
  const packet = compatibleR136.batch.packets[index];
  return binding.ordinal === index + 1 &&
    binding.capabilityId ===
      r136.VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECIDE_CAPABILITY_ID &&
    binding.sourceR136.contract.receiptDigest === compatibleR136.contract.digest &&
    binding.sourceR136.requestBatch.receiptDigest === compatibleR136.batch.digest &&
    binding.sourceR136.requestPacket.receiptDigest === packet.digest &&
    binding.requestId === packet.requestId &&
    binding.requestBatchId === packet.requestBatchId &&
    binding.routeId === packet.requestedRouteDesignation.routeId &&
    binding.requestedReviewSeatId === 'axm-host-authority-review-seat' &&
    JSON.stringify(binding.requestWindow) === JSON.stringify(packet.requestWindow) &&
    binding.decisionCriterionDigests.length === 5 &&
    binding.externalEvidenceRequirementDigests.length === 7 &&
    Object.entries(binding.truth).every(([key, value]) =>
      ['exactR136RequestPacketBound', 'allFiveDecisionCriteriaReferenced',
        'allSevenEvidenceRequirementsReferenced'].includes(key)
        ? value === true : value === false);
}),
'R137 input bindings preserve exact R136 packet, route, window, five-criterion, and seven-evidence custody');

const specification = compatibleR137.bundle.specifications[0];
assert.ok(specification.capabilityId ===
    r136.VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECIDE_CAPABILITY_ID &&
  specification.gapType === 'AUTHORITY' &&
  specification.providerClass ===
    'AUTHENTICATED_OUT_OF_BAND_HOST_GOVERNANCE_ROUTE_DESIGNATION_DECISION_HAND' &&
  specification.coverage.sourceRequestPacketCount === 2 &&
  specification.coverage.inputBindingCount === 2 &&
  specification.coverage.inputBindingDigests.length === 2 &&
  specification.coverage.currentInventoryMayBeEmpty === true &&
  specification.inputContract.exactRequestRouteCriteriaEvidenceAndWindowDigestsRequired === true,
'R137 describes the exact missing authority hand and covers both requests without claiming implementation');

assert.ok(specification.outputContract.nativeDecisionReceiptSchema === null &&
  specification.outputContract.nativeDecisionReceiptSchemaStatus ===
    'NOT_DECLARED_UNTIL_AUTHENTICATED_HAND_BINDING_AND_INDEPENDENT_REVIEW' &&
  JSON.stringify(specification.outputContract.requiredResultStatusCodes) ===
    JSON.stringify(['CLAIMED_DESIGNATE', 'CLAIMED_DENY', 'CLAIMED_UNKNOWN']) &&
  specification.outputContract.requiredDecisionReceiptFields.length === 13 &&
  specification.outputContract.requiredProofSurfaces.length === 5 &&
  specification.outputContract.receiptTrustOnArrival ===
    'UNTRUSTED_PENDING_NATIVE_SIGNATURE_AUTHORITY_SCOPE_EXPIRY_REVOCATION_AND_NONCONTROL_VERIFICATION',
'R137 requires a native decision receipt and five proof surfaces while treating every arriving envelope as untrusted');

assert.ok(specification.permissionsAndConsent.requiredReviewSeatId ===
    'axm-host-authority-review-seat' &&
  JSON.stringify(specification.permissionsAndConsent.eligibleDecisionMakers) ===
    JSON.stringify(['MIKE_TOBI', 'AUTHENTICATED_HOST_GOVERNANCE_SEAT']) &&
  specification.permissionsAndConsent.authenticatedAuthoritySeatRequired === true &&
  specification.permissionsAndConsent.candidateAndAllRouteProviderControlExclusionRequired === true &&
  specification.permissionsAndConsent.selfAttestationOrEligibilityLabelSufficient === false &&
  specification.failureAndRecovery.failClosed === true &&
  specification.failureAndRecovery.partialCriteriaOrEvidenceMayDesignate === false &&
  specification.failureAndRecovery.missingExpiredOrRevokedReceiptMayDesignate === false &&
  specification.failureAndRecovery.denialMayFallThroughToAlternateDecisionMaker === false &&
  specification.compatibility.operationalRouteCapabilityIdsRemainSeparatelyRequired.length === 3 &&
  specification.verificationContract.allFiveDecisionCriteriaRequireNativeEvidence === true &&
  specification.verificationContract.allSevenR135EvidenceObligationsRemainUnadmitted === true &&
  specification.verificationContract.designationDoesNotVerifyProviderOrAuthorizeContactTransport === true,
'R137 preserves authenticated authority, non-control, fail-closed denial, native evidence, and separate operational-capability gates');

assert.ok(Object.values(specification.sideEffects).every(value => value === false) &&
  Object.entries(specification.lifecycle).every(([key, value]) =>
    key === 'status' ? value === 'SPECIFIED_NOT_IMPLEMENTED' : value === false) &&
  compatibleR137.bundle.summary.nativeDecisionReceiptSchemaCount === 0 &&
  compatibleR137.bundle.summary.decisionHandSelectedCount === 0 &&
  compatibleR137.bundle.summary.installedDecisionHandCount === 0 &&
  compatibleR137.bundle.summary.availableDecisionHandCount === 0 &&
  compatibleR137.bundle.summary.executedDecisionHandCount === 0 &&
  compatibleR137.bundle.summary.authenticatedAuthoritySeatCount === 0 &&
  compatibleR137.bundle.summary.authorityDecisionCount === 0 &&
  compatibleR137.bundle.summary.designationReceiptCount === 0 &&
  compatibleR137.bundle.summary.designatedOrAuthorizedRouteCount === 0 &&
  Object.entries(compatibleR137.bundle.truth).every(([key, value]) =>
    ['exactR136BoundaryBound', 'missingDecisionCapabilitySpecified']
      .includes(key) ? value === true : value === false),
'R137 keeps implementation, selection, installation, execution, authority, designation, route, transport, evidence, persistence, promotion, canon, and mutation outcomes false');

assert.throws(() => r137
  .createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionCapabilitySpecificationContractReceipt({
    ...compatibleR137.boundary,
    r136Batch: emptyR136.batch
  }), /exact R136 boundary/,
'R137 rejects substitution across the exact R136 custody boundary');

const overclaimBundle = structuredClone(compatibleR137.bundle);
const overclaimSpecification = overclaimBundle.specifications[0];
overclaimSpecification.outputContract.nativeDecisionReceiptSchema =
  'fictional.native-authority-decision-receipt/v1';
overclaimSpecification.permissionsAndConsent.selfAttestationOrEligibilityLabelSufficient = true;
Object.keys(overclaimSpecification.sideEffects).forEach(key => {
  overclaimSpecification.sideEffects[key] = true;
});
Object.keys(overclaimSpecification.lifecycle).forEach(key => {
  if (key !== 'status') overclaimSpecification.lifecycle[key] = true;
});
overclaimSpecification.lifecycle.status = 'EXECUTED_AND_DESIGNATED';
resign(overclaimSpecification);
Object.keys(overclaimBundle.summary).forEach(key => {
  if (typeof overclaimBundle.summary[key] === 'number') {
    overclaimBundle.summary[key] = Math.max(1, overclaimBundle.summary[key]);
  }
});
Object.keys(overclaimBundle.truth).forEach(key => {
  overclaimBundle.truth[key] = true;
});
overclaimBundle.authorityDecision = { outcome: 'DESIGNATE' };
overclaimBundle.designationReceipt = { receipt: 'fictional' };
overclaimBundle.historicalPhysicalSourceOwner = { ownerId: 'fictional-owner' };
overclaimBundle.historicalPhysicalSourceDebit = { debitId: 'fictional-debit' };
resign(overclaimBundle);
const producerText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-verifier-route-out-of-band-authority-designation-decision-capability-specification.mjs'), 'utf8');
const auditText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-verifier-route-out-of-band-authority-designation-decision-capability-specification-audit.mjs'), 'utf8');
assert.ok(!r137
    .landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionCapabilitySpecificationBundleValid(
      overclaimBundle, compatibleR137.contract, compatibleR137.boundary) &&
  r137Audit
    .auditLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionCapabilitySpecification(
      compatibleR137.contract, overclaimBundle,
      compatibleR137.boundary).status === 'FAIL' &&
  compatibleR137.contract.resourceBudget.maximumSpecifications === 1 &&
  compatibleR137.contract.resourceBudget.maximumInputBindings === 2 &&
  compatibleR137.contract.resourceBudget.decisionCriteriaPerBinding === 5 &&
  compatibleR137.contract.resourceBudget.evidenceRequirementsPerBinding === 7 &&
  compatibleR137.contract.resourceBudget.maximumExternalRuntimeMs === 120000 &&
  compatibleR137.contract.resourceBudget.maximumResultEnvelopeBytes === 262144 &&
  compatibleR137.contract.resourceBudget.maximumSerializedBundleBytes === 524288 &&
  !/\bfetch\s*\(|XMLHttpRequest|new\s+WebSocket|node:dns|node:net/.test(
    producerText) &&
  !auditText.includes(
    'createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionCapabilitySpecification') &&
  !auditText.includes(
    'landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionCapabilitySpecificationContractReceiptValid') &&
  !auditText.includes(
    'landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionCapabilitySpecificationBundleValid') &&
  JSON.stringify(fixture) === fixtureBefore,
'R137 rejects re-signed implementation, decision, designation, route, transport, receipt, verification, owner/debit, persistence, promotion, canon, and mutation overclaims while remaining bounded, non-networked, independently audited, and custody-preserving');

console.log('foundation planet R137 isolated selftest: PASS (10 assertions)');
