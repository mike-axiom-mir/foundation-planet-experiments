import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const fixturePath = process.argv[2];
if (!fixturePath) throw new Error('R139 combined selftest requires an exact R126 fixture');
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
const r138 = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-binding-preflight.mjs')).href);
const r138Audit = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-binding-preflight-audit.mjs')).href);
const r139 = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-request.mjs')).href);
const r139Audit = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-request-audit.mjs')).href);
const r140 = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-recipient-route-resolution-preflight.mjs')).href);
const r140Audit = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-recipient-route-resolution-preflight-audit.mjs')).href);

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

function createR138(r137Value, declarations = []) {
  const boundary = {
    r137Contract: r137Value.contract,
    r137Bundle: r137Value.bundle,
    r137Boundary: r137Value.boundary
  };
  const contract = r138
    .createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderBindingPreflightContractReceipt(
      boundary);
  const preflight = r138
    .createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderBindingPreflight(
      contract, boundary, declarations);
  return { contract, preflight, boundary, declarations };
}

function createDecisionHandDeclaration(r137Value, suffix = 'primary') {
  const specification = r137Value.bundle.specifications[0];
  return resign({
    schema:
      r138.LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_DECLARATION_SCHEMA,
    providerId: 'selftest.r138.decision-hand.' + suffix,
    providerVersion: '1.0.0',
    capabilityId:
      r136.VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECIDE_CAPABILITY_ID,
    providerClass:
      'AUTHENTICATED_OUT_OF_BAND_HOST_GOVERNANCE_ROUTE_DESIGNATION_DECISION_HAND',
    declarationTrust: 'CALLER_SUPPLIED_UNTRUSTED',
    specificationBinding: {
      specificationOrdinal: specification.ordinal,
      specificationCapabilityId: specification.capabilityId,
      specificationDigest: specification.digest,
      r137ContractDigest: r137Value.contract.digest,
      r137BundleDigest: r137Value.bundle.digest,
      inputBindingSchema:
        r137.LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_INPUT_BINDING_SCHEMA,
      resultEnvelopeSchema:
        r137.LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_RESULT_ENVELOPE_SCHEMA
    },
    nativeDecisionReceiptSchema: {
      role: 'AUTHORITY_DESIGNATION_DECISION_RECEIPT',
      schema: 'selftest.r138.native-decision-receipt-' + suffix + '/v1',
      trust: 'CALLER_DECLARED_UNVERIFIED'
    },
    implementationBoundary: {
      entrypointKind:
        'AUTHENTICATED_OUT_OF_BAND_HOST_GOVERNANCE_ROUTE_DESIGNATION_DECISION_HAND',
      executionStatus: 'NOT_REQUESTED',
      outOfBandAuthorityDecisionOnly: true,
      externalContactMayOccurOnlyAfterExplicitHostAuthorization: true,
      routeOperationRequested: false,
      foundationPlanetWritesRequested: false,
      persistenceRequested: false
    },
    permissionsAndConsent: {
      requiredReviewSeatId: 'axm-host-authority-review-seat',
      eligibleDecisionMakers: [
        'MIKE_TOBI', 'AUTHENTICATED_HOST_GOVERNANCE_SEAT'
      ],
      authenticatedAuthoritySeatRequired: true,
      candidateAndAllRouteProviderControlExclusionRequired: true,
      allowedAndDeniedIdentityProbesRequired: true,
      selfAttestationOrEligibilityLabelSufficient: false,
      providerOrCandidateMaySelfAuthorize: false,
      explicitPerDecisionInvocationRequired: true,
      deniedOrUnknownOutcomeFailsClosed: true
    },
    controlAndBeneficialOwnershipDeclaration: {
      decisionHandProviderIdDistinctFromCurrentCandidateAndRouteProviderIds:
        true,
      declaredNoCandidateOrRouteProviderControlOrBeneficialOwnership: true,
      declarationTrust: 'CALLER_DECLARED_UNVERIFIED'
    },
    resourceBudget: structuredClone(specification.resourceBudget),
    failureAndRecovery: structuredClone(specification.failureAndRecovery),
    verificationDeclaration: {
      independentSecondaryVerifierId:
        'selftest.r138.independent-verifier.' + suffix,
      exactSpecificationAndInputBindingDigestReplayPlanned: true,
      nativeDecisionReceiptSchemaValidationPlanned: true,
      decisionMakerSeatIdentityScopeAndAuthorityVerificationPlanned: true,
      allowedAndDeniedIdentityProbesPlanned: true,
      candidateAndRouteProviderNonControlProofPlanned: true,
      nativeSignatureKeyAuthorityExpiryAndRevocationVerificationPlanned: true,
      exactCriteriaAndEvidenceProofReplayPlanned: true,
      independentIdentityAuthorityAndNonControlReceipt: null,
      implementationIntegrityReceipt: null,
      liveAvailabilityReceipt: null
    },
    lifecycle: {
      status: 'CANDIDATE_DECISION_HAND_DECLARATION_UNTRUSTED',
      decisionHandSelected: false,
      installed: false,
      available: false,
      executed: false,
      authoritySeatAuthenticated: false,
      decisionObserved: false,
      designationReceiptObserved: false,
      routeDesignatedOrAuthorized: false,
      promoted: false,
      canon: false
    }
  });
}

const emptyR138 = createR138(emptyR137);
assert.ok(emptyR138.preflight.status ===
    'OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_PREFLIGHT_BLOCKED_WITH_NO_DECLARATIONS' &&
  emptyR138.preflight.assessments.length === 1 &&
  emptyR138.preflight.assessments[0].status ===
    'MISSING_DECISION_HAND_PROVIDER_DECLARATION' &&
  emptyR138.preflight.providerCandidates.length === 0 &&
  emptyR138.preflight.summary.specificationCount === 1 &&
  emptyR138.preflight.summary.sourceRequestPacketCount === 0 &&
  emptyR138.preflight.summary.sourceInputBindingCount === 0,
'R138 current zero-declaration custody remains blocked with one missing hand assessment and no candidate');

const compatibleDeclaration = createDecisionHandDeclaration(compatibleR137);
const compatibleR138 = createR138(compatibleR137, [compatibleDeclaration]);
assert.ok(compatibleR138.preflight.status ===
    'OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_CANDIDATE_CONTRACT_COMPATIBLE_UNVERIFIED' &&
  compatibleR138.preflight.assessments[0].status ===
    'DECISION_HAND_PROVIDER_DECLARATION_CONTRACT_COMPATIBLE_UNVERIFIED' &&
  compatibleR138.preflight.providerCandidates.length === 1 &&
  r138Audit
    .auditLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderBindingPreflight(
      compatibleR138.contract, compatibleR138.preflight,
      compatibleR138.boundary, compatibleR138.declarations).status === 'PASS',
'R138 accepts one exact structural declaration only as an independently audited compatible unverified candidate');

const compatibleAssessment = compatibleR138.preflight.assessments[0];
const compatibleCandidate = compatibleR138.preflight.providerCandidates[0];
const compatibleSpecification = compatibleR137.bundle.specifications[0];
assert.ok(compatibleAssessment.specificationOrdinal === 1 &&
  compatibleAssessment.capabilityId ===
    r136.VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECIDE_CAPABILITY_ID &&
  compatibleDeclaration.specificationBinding.specificationDigest ===
    compatibleSpecification.digest &&
  compatibleDeclaration.specificationBinding.r137ContractDigest ===
    compatibleR137.contract.digest &&
  compatibleDeclaration.specificationBinding.r137BundleDigest ===
    compatibleR137.bundle.digest &&
  compatibleCandidate.sourceRequestPacketCount === 2 &&
  JSON.stringify(compatibleCandidate.inputBindingDigests) ===
    JSON.stringify(compatibleSpecification.coverage.inputBindingDigests),
'R138 preserves exact R137 specification, contract, bundle, two-packet, and two-binding custody');

const excludedProviderIds = [...new Set(compatibleR136.batch.packets.flatMap(
  packet => [
    packet.requestedRouteDesignation.candidateProviderId,
    ...packet.requestedRouteDesignation.routeProviders.map(item =>
      item.providerId)
  ]))];
assert.ok(!excludedProviderIds.includes(compatibleCandidate.providerId) &&
  compatibleCandidate.structurallyDistinctFromCurrentCandidateAndRouteProviderIds ===
    true &&
  compatibleCandidate.trust ===
    'CALLER_SUPPLIED_COMPATIBLE_UNVERIFIED' &&
  ['selected', 'installed', 'available', 'executed',
    'authoritySeatAuthenticated', 'authorityDecisionObserved',
    'designationReceiptObserved', 'routeDesignatedOrAuthorized']
    .every(key => compatibleCandidate[key] === false),
'R138 requires structural provider-id separation while keeping selection, trust, availability, authority, decision, and designation false');

assert.ok(compatibleDeclaration.nativeDecisionReceiptSchema.role ===
    'AUTHORITY_DESIGNATION_DECISION_RECEIPT' &&
  compatibleDeclaration.nativeDecisionReceiptSchema.trust ===
    'CALLER_DECLARED_UNVERIFIED' &&
  compatibleDeclaration.permissionsAndConsent.authenticatedAuthoritySeatRequired ===
    true &&
  compatibleDeclaration.permissionsAndConsent
    .selfAttestationOrEligibilityLabelSufficient === false &&
  compatibleDeclaration.permissionsAndConsent
    .providerOrCandidateMaySelfAuthorize === false &&
  compatibleDeclaration.controlAndBeneficialOwnershipDeclaration
    .declarationTrust === 'CALLER_DECLARED_UNVERIFIED' &&
  Object.entries(compatibleDeclaration.verificationDeclaration)
    .filter(([key]) => key.endsWith('Receipt'))
    .every(([, value]) => value === null),
'R138 keeps native schema, authority, control, integrity, availability, and non-control proof declarations untrusted and unverified');

assert.ok(Object.entries(compatibleDeclaration.lifecycle).every(([key, value]) =>
    key === 'status'
      ? value === 'CANDIDATE_DECISION_HAND_DECLARATION_UNTRUSTED'
      : value === false) &&
  compatibleR138.preflight.summary.selectedDecisionHandCount === 0 &&
  compatibleR138.preflight.summary.installedDecisionHandCount === 0 &&
  compatibleR138.preflight.summary.availableDecisionHandCount === 0 &&
  compatibleR138.preflight.summary.executedDecisionHandCount === 0 &&
  compatibleR138.preflight.summary.authorityDecisionCount === 0 &&
  compatibleR138.preflight.summary.designationReceiptCount === 0 &&
  Object.entries(compatibleR138.preflight.truth).every(([key, value]) =>
    ['exactR137BoundaryBound', 'declarationCompatibilityEvaluated',
      'compatibleCandidateRemainsCallerSuppliedUnverified'].includes(key)
      ? value === true : value === false),
'R138 preserves the untrusted lifecycle and every operational, authority, decision, transport, owner/debit, persistence, promotion, and canon boundary');

const weakenedDeclaration = structuredClone(compatibleDeclaration);
weakenedDeclaration.permissionsAndConsent
  .selfAttestationOrEligibilityLabelSufficient = true;
weakenedDeclaration.controlAndBeneficialOwnershipDeclaration
  .declaredNoCandidateOrRouteProviderControlOrBeneficialOwnership = false;
weakenedDeclaration.resourceBudget.maximumExternalRuntimeMs += 1;
weakenedDeclaration.failureAndRecovery.failClosed = false;
weakenedDeclaration.verificationDeclaration.implementationIntegrityReceipt =
  { status: 'fictional' };
weakenedDeclaration.lifecycle.decisionHandSelected = true;
resign(weakenedDeclaration);
const weakenedPreflight = r138
  .createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderBindingPreflight(
    compatibleR138.contract, compatibleR138.boundary,
    [weakenedDeclaration]);
assert.ok(weakenedPreflight.status ===
    'OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_PREFLIGHT_BLOCKED' &&
  weakenedPreflight.assessments[0].status ===
    'DECISION_HAND_PROVIDER_DECLARATIONS_REJECTED' &&
  ['PERMISSION_OR_CONSENT_BOUNDARY_MISMATCH',
    'CONTROL_OR_BENEFICIAL_OWNERSHIP_DECLARATION_INVALID',
    'RESOURCE_BUDGET_MISMATCH',
    'FAILURE_OR_RECOVERY_BOUNDARY_MISMATCH',
    'VERIFICATION_DECLARATION_INVALID',
    'LIFECYCLE_OVERCLAIM'].every(code =>
      weakenedPreflight.assessments[0].issueCodes.includes(code)) &&
  weakenedPreflight.providerCandidates.length === 0,
'R138 rejects one re-signed weakened permission, control, budget, recovery, verification, and lifecycle declaration');

const secondDeclaration = createDecisionHandDeclaration(compatibleR137,
  'secondary');
const ambiguousPreflight = r138
  .createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderBindingPreflight(
    compatibleR138.contract, compatibleR138.boundary,
    [compatibleDeclaration, secondDeclaration]);
assert.ok(ambiguousPreflight.status ===
    'OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_BINDING_PREFLIGHT_BLOCKED' &&
  ambiguousPreflight.assessments[0].status ===
    'AMBIGUOUS_DECISION_HAND_PROVIDER_DECLARATIONS' &&
  ambiguousPreflight.assessments[0]
    .compatibleDeclarationInputIndexes.length === 2 &&
  ambiguousPreflight.assessments[0].candidateBinding === null &&
  ambiguousPreflight.providerCandidates.length === 0 &&
  ambiguousPreflight.summary.ambiguousSpecificationCount === 1 &&
  ambiguousPreflight.summary.selectedDecisionHandCount === 0,
'R138 preserves two compatible declarations as ambiguity and selects neither');

assert.throws(() => r138
  .createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderBindingPreflightContractReceipt({
    ...compatibleR138.boundary,
    r137Bundle: emptyR137.bundle
  }), /exact R137 boundary/,
'R138 rejects substitution across the exact R137 custody boundary');

const overclaimPreflight = structuredClone(compatibleR138.preflight);
const overclaimAssessment = overclaimPreflight.assessments[0];
const overclaimCandidate = overclaimAssessment.candidateBinding;
['selected', 'installed', 'available', 'executed',
  'authoritySeatAuthenticated', 'authorityDecisionObserved',
  'designationReceiptObserved', 'routeDesignatedOrAuthorized']
  .forEach(key => { overclaimCandidate[key] = true; });
resign(overclaimAssessment);
Object.keys(overclaimPreflight.summary).forEach(key => {
  if (typeof overclaimPreflight.summary[key] === 'number') {
    overclaimPreflight.summary[key] =
      Math.max(1, overclaimPreflight.summary[key]);
  }
});
Object.keys(overclaimPreflight.truth).forEach(key => {
  overclaimPreflight.truth[key] = true;
});
overclaimPreflight.authorityDecision = { outcome: 'DESIGNATE' };
overclaimPreflight.designationReceipt = { receipt: 'fictional' };
overclaimPreflight.historicalPhysicalSourceOwner =
  { ownerId: 'fictional-owner' };
overclaimPreflight.historicalPhysicalSourceDebit =
  { debitId: 'fictional-debit' };
resign(overclaimPreflight);
const r138ProducerText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-binding-preflight.mjs'), 'utf8');
const r138AuditText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-binding-preflight-audit.mjs'), 'utf8');
assert.ok(!r138
    .landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderBindingPreflightValid(
      overclaimPreflight, compatibleR138.contract,
      compatibleR138.boundary, compatibleR138.declarations) &&
  r138Audit
    .auditLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderBindingPreflight(
      compatibleR138.contract, overclaimPreflight,
      compatibleR138.boundary, compatibleR138.declarations).status === 'FAIL' &&
  compatibleR138.contract.resourceBudget.maximumProviderDeclarations === 2 &&
  compatibleR138.contract.resourceBudget.maximumDeclarationsPerCapability === 2 &&
  compatibleR138.contract.resourceBudget.maximumNativeSchemasPerDeclaration === 1 &&
  compatibleR138.contract.resourceBudget.maximumSerializedDeclarationBytes ===
    131072 &&
  compatibleR138.contract.resourceBudget.maximumSerializedPreflightBytes ===
    524288 &&
  !/\bfetch\s*\(|XMLHttpRequest|new\s+WebSocket|node:dns|node:net/.test(
    r138ProducerText) &&
  !r138AuditText.includes(
    'createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderBindingPreflight') &&
  !r138AuditText.includes(
    'landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderBindingPreflightContractReceiptValid') &&
  !r138AuditText.includes(
    'landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderBindingPreflightValid') &&
  JSON.stringify(fixture) === fixtureBefore,
'R138 rejects re-signed selection, execution, authority, decision, designation, route, transport, receipt, verification, owner/debit, persistence, promotion, canon, and mutation overclaims while remaining bounded, non-networked, independently audited, and custody-preserving');

console.log('foundation planet R138 isolated selftest: PASS (10 assertions)');

function createR139(r138Value, options = {}) {
  const custody = {
    r138Contract: r138Value.contract,
    r138Preflight: r138Value.preflight,
    r138Boundary: r138Value.boundary,
    r138Declarations: r138Value.declarations
  };
  const contract = r139
    .createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRequestContractReceipt(
      custody);
  const batch = r139
    .createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRequestBatch(
      contract, custody, options);
  return { contract, batch, custody, options };
}

const emptyR139 = createR139(emptyR138);
assert.ok(emptyR139.batch.status ===
    'NO_COMPATIBLE_UNVERIFIED_DECISION_HAND_PROVIDER_CANDIDATES_REQUEST_BATCH_EMPTY' &&
  emptyR139.batch.packets.length === 0 &&
  emptyR139.batch.summary.sourceDeclarationCount === 0 &&
  emptyR139.batch.summary.sourceCandidateCount === 0 &&
  emptyR139.batch.summary.requestEligibleCandidateCount === 0 &&
  emptyR139.batch.summary.missingDeclarationAssessmentCount === 1 &&
  Object.values(emptyR139.batch.requestContext).every(value => value === null) &&
  r139Audit
    .auditLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRequest(
      emptyR139.contract, emptyR139.batch, emptyR139.custody).status === 'PASS',
'R139 current zero-candidate custody creates one independently audited empty batch without invented request metadata');

const r139RequestOptions = {
  requestBatchId: 'selftest.r139.decision-hand-verification',
  requesterId: 'selftest.r139.request-creator',
  requestedAt: '2026-08-27T12:30:00.000Z',
  expiresAt: '2026-08-27T12:35:00.000Z'
};
const compatibleR139 = createR139(compatibleR138, r139RequestOptions);
assert.ok(compatibleR139.batch.status ===
    'DECISION_HAND_PROVIDER_VERIFICATION_REQUEST_CREATED_NOT_TRANSMITTED_PROVIDER_BLOCKED' &&
  compatibleR139.batch.packets.length === 1 &&
  compatibleR139.batch.summary.requestEligibleCandidateCount === 1 &&
  compatibleR139.batch.summary.requestPacketCount === 1 &&
  compatibleR139.batch.summary.proofRequirementCount === 8 &&
  r139Audit
    .auditLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRequest(
      compatibleR139.contract, compatibleR139.batch,
      compatibleR139.custody, r139RequestOptions).status === 'PASS',
'R139 creates exactly one independently audited untransmitted request for one exact compatible-unverified decision-hand candidate');

const r139Packet = compatibleR139.batch.packets[0];
assert.ok(r139Packet.requestBinding.sourcePreflight.receiptDigest ===
    compatibleR138.preflight.digest &&
  r139Packet.requestBinding.specificationDigest ===
    compatibleSpecification.digest &&
  r139Packet.requestBinding.candidateBindingDigest ===
    stableDigest(compatibleCandidate) &&
  r139Packet.requestBinding.declarationInputIndex === 0 &&
  r139Packet.requestBinding.declarationDigest ===
    compatibleDeclaration.digest &&
  r139Packet.requestBinding.r137ContractDigest ===
    compatibleR137.contract.digest &&
  r139Packet.requestBinding.r137BundleDigest ===
    compatibleR137.bundle.digest &&
  JSON.stringify(r139Packet.requestBinding.inputBindingDigests) ===
    JSON.stringify(compatibleCandidate.inputBindingDigests),
'R139 preserves exact R137 specification and input-binding plus R138 preflight, candidate, and declaration custody');

assert.deepEqual(r139Packet.recipientRoute.requiredCapabilities, [
  'transport.foundation-planet.external-provider-verification.endpoint.resolve',
  r131.VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
  r131.VERIFICATION_REQUEST_SEND_RECEIVE_CAPABILITY_ID
]);
assert.ok(r139Packet.recipientRoute.status === 'UNRESOLVED' &&
  r139Packet.recipientRoute.endpoint === null &&
  r139Packet.recipientRoute.recipientIdentity === null &&
  r139Packet.recipientRoute.claimedVerifierIdentityTrusted === false &&
  r139Packet.recipientRoute
    .candidateProviderMaySatisfyOwnVerificationRoute === false &&
  r139Packet.transport.status === 'NOT_TRANSMITTED' &&
  r139Packet.transport.senderReceipt === null &&
  r139Packet.transport.receiverReceipt === null,
'R139 keeps the claimed independent verifier route unresolved and names the exact three still-missing route capabilities without transport');

assert.deepEqual(r139Packet.proofRequirements.map(item => item.proofId), [
  'INDEPENDENT_PROVIDER_IDENTITY_AUTHORITY_NONCONTROL_AND_REVOCATION',
  'PROVIDER_IMPLEMENTATION_INTEGRITY',
  'BOUNDED_LIVE_PROVIDER_AVAILABILITY',
  'NATIVE_DECISION_RECEIPT_SCHEMA_VALIDATION',
  'DECISION_MAKER_SEAT_IDENTITY_SCOPE_AUTHORITY_AND_DENIED_PROBE',
  'NATIVE_SIGNATURE_KEY_AUTHORITY_EXPIRY_AND_REVOCATION_VALIDATION',
  'EXACT_R137_SPECIFICATION_BINDING_DECLARATION_AND_CANDIDATE_DIGEST_REPLAY',
  'EXACT_DECISION_CRITERIA_AND_EVIDENCE_PROOF_REPLAY'
]);
assert.ok(r139Packet.proofRequirements.every((item, index) =>
    item.ordinal === index + 1 &&
    item.independentSecondaryVerifierRequired === true &&
    typeof item.counterevidence === 'string' &&
    typeof item.blockingReason === 'string'),
'R139 routes eight atomic high-risk proof claims to independent, falsifiable evidence surfaces');

assert.ok(r139Packet.claimedProvider.compatibilityTrust ===
    'STRUCTURALLY_COMPATIBLE_UNVERIFIED' &&
  r139Packet.claimedProvider.nativeSchemaTrust ===
    'CALLER_DECLARED_UNVERIFIED' &&
  r139Packet.claimedProvider.controlAndBeneficialOwnershipTrust ===
    'CALLER_DECLARED_UNVERIFIED' &&
  Object.entries(r139Packet.lifecycle).every(([key, value]) =>
    key === 'status'
      ? value ===
        'CREATED_NOT_TRANSMITTED_VERIFICATION_RECIPIENT_ROUTE_UNRESOLVED'
      : value === false) &&
  Object.entries(r139Packet.truth).every(([key, value]) =>
    key === 'requestCreated' ? value === true : value === false) &&
  Object.entries(compatibleR139.batch.truth).every(([key, value]) =>
    ['exactR138EligibleCandidateBound',
      'onlyCompatibleUnverifiedDecisionHandCandidateRequested'].includes(key)
      ? value === true : value === false),
'R139 preserves every provider, authority, decision, designation, transport, evidence, owner/debit, persistence, promotion, canon, and mutation boundary');

assert.throws(() => r139
  .createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRequestBatch(
    compatibleR139.contract, compatibleR139.custody),
  /bounded request window/);
assert.throws(() => r139
  .createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRequestBatch(
    compatibleR139.contract, compatibleR139.custody, {
      ...r139RequestOptions,
      expiresAt: '2026-08-27T12:35:00.001Z'
    }), /bounded request window/);
assert.throws(() => r139
  .createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRequestBatch(
    emptyR139.contract, emptyR139.custody, r139RequestOptions),
  /bounded request window/,
'R139 rejects missing, overlong, or invented request metadata across compatible and empty custody');

assert.throws(() => r139
  .createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRequestContractReceipt({
    ...compatibleR139.custody,
    r138Boundary: emptyR138.boundary
  }), /exact R138 custody/,
'R139 rejects substitution across the exact R138 contract, preflight, declarations, and boundary');

const r139Overclaim = structuredClone(compatibleR139.batch);
const r139OverclaimPacket = r139Overclaim.packets[0];
r139OverclaimPacket.recipientRoute.claimedVerifierIdentityTrusted = true;
r139OverclaimPacket.transport.status = 'TRANSMITTED';
r139OverclaimPacket.transport.senderReceipt = { receipt: 'fictional' };
r139OverclaimPacket.lifecycle.selected = true;
r139OverclaimPacket.lifecycle.authoritySeatAuthenticated = true;
r139OverclaimPacket.lifecycle.authorityDecisionObserved = true;
r139OverclaimPacket.lifecycle.routeDesignatedOrAuthorized = true;
Object.keys(r139OverclaimPacket.truth).forEach(key => {
  r139OverclaimPacket.truth[key] = true;
});
r139OverclaimPacket.authorityDecision = { outcome: 'DESIGNATE' };
r139OverclaimPacket.designationReceipt = { receipt: 'fictional' };
resign(r139OverclaimPacket);
Object.keys(r139Overclaim.summary).forEach(key => {
  if (typeof r139Overclaim.summary[key] === 'number') {
    r139Overclaim.summary[key] = Math.max(1, r139Overclaim.summary[key]);
  }
});
Object.keys(r139Overclaim.truth).forEach(key => {
  r139Overclaim.truth[key] = true;
});
resign(r139Overclaim);
assert.ok(!r139
    .landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRequestBatchValid(
      r139Overclaim, compatibleR139.contract,
      compatibleR139.custody, r139RequestOptions) &&
  r139Audit
    .auditLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRequest(
      compatibleR139.contract, r139Overclaim,
      compatibleR139.custody, r139RequestOptions).status === 'FAIL',
'R139 producer and independent audit reject re-signed recipient-trust, transport, selection, authority, decision, designation, and fictional-receipt overclaims');

const r139ProducerText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-request.mjs'), 'utf8');
const r139AuditText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-request-audit.mjs'), 'utf8');
assert.ok(compatibleR139.contract.resourceBudget.maximumRequestPackets === 1 &&
  compatibleR139.contract.resourceBudget.maximumProofRequirementsPerPacket ===
    8 &&
  compatibleR139.contract.resourceBudget.maximumRequestWindowMs === 300000 &&
  compatibleR139.contract.resourceBudget.maximumSerializedBatchBytes ===
    524288 &&
  !/\bfetch\s*\(|XMLHttpRequest|new\s+WebSocket|node:dns|node:net/.test(
    r139ProducerText) &&
  !r139AuditText.includes(
    'createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRequest') &&
  !r139AuditText.includes(
    'landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRequestContractReceiptValid') &&
  !r139AuditText.includes(
    'landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRequestBatchValid') &&
  JSON.stringify(fixture) === fixtureBefore,
'R139 remains bounded, non-networked, independently reconstructed, custody-preserving, and free of provider, decision, designation, transport, persistence, promotion, or canon action');

console.log('foundation planet R139 isolated selftest: PASS (14 assertions)');

function createR140(r139Value, declarations = []) {
  const custody = {
    r139Contract: r139Value.contract,
    r139Batch: r139Value.batch,
    r139Custody: r139Value.custody,
    r139Options: r139Value.options
  };
  const contract = r140
    .createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteResolutionPreflightContractReceipt(
      custody);
  const preflight = r140
    .createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteResolutionPreflight(
      contract, custody, declarations);
  return { contract, preflight, custody, declarations };
}

function r140RouteProviderClaim(providerId, capabilityId, dependencies = []) {
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

function createR140RouteDeclaration(packet, suffix = 'primary') {
  const endpointProviderId = 'selftest.r140.route.endpoint-' + suffix;
  const authorityProviderId = 'selftest.r140.route.authority-' + suffix;
  const transportProviderId = 'selftest.r140.route.transport-' + suffix;
  return resign({
    schema: r140
      .LAND_MATRIX_THERMAL_VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_DECLARATION_SCHEMA,
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
      value: 'human-review:selftest/r140/' + suffix,
      trust: 'CALLER_SUPPLIED_UNVERIFIED'
    },
    routeProviders: {
      endpointResolver: r140RouteProviderClaim(endpointProviderId,
        'transport.foundation-planet.external-provider-verification.endpoint.resolve'),
      trustAnchorAuthority: r140RouteProviderClaim(authorityProviderId,
        'authority.foundation-planet.external-provider-verification.verifier-route.trust-anchor.resolve'),
      transport: {
        ...r140RouteProviderClaim(transportProviderId,
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

const emptyR140 = createR140(emptyR139);
assert.ok(r140
    .landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteResolutionPreflightContractReceiptValid(
      emptyR140.contract, emptyR140.custody) &&
  r140
    .landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteResolutionPreflightValid(
      emptyR140.preflight, emptyR140.contract, emptyR140.custody) &&
  emptyR140.preflight.status ===
    'NO_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_REQUESTS_RECIPIENT_ROUTE_PREFLIGHT_EMPTY' &&
  emptyR140.preflight.routes.length === 0 &&
  r140Audit
    .auditLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteResolutionPreflight(
      emptyR140.contract, emptyR140.preflight, emptyR140.custody).status === 'PASS',
'R140 current empty R139 request batch remains an independently audited empty recipient-route preflight');

assert.throws(() => createR140(emptyR139, [{ requestId: 'invented' }]),
  /bounded declarations/,
'R140 rejects invented route declarations when the exact real R139 batch has no request packets');

const noR140Declarations = createR140(compatibleR139);
assert.ok(noR140Declarations.preflight.status ===
    'VERIFIER_ROUTE_OUT_OF_BAND_AUTHORITY_DESIGNATION_DECISION_HAND_PROVIDER_VERIFICATION_RECIPIENT_ROUTE_UNRESOLVED_NO_DECLARATIONS' &&
  noR140Declarations.preflight.routes.length === 1 &&
  noR140Declarations.preflight.routes[0].status ===
    'MISSING_RECIPIENT_ROUTE_DECLARATION' &&
  noR140Declarations.preflight.routes[0].operationalReadiness === 'BLOCKED' &&
  noR140Declarations.preflight.summary.missingRouteCount === 1,
'R140 leaves the synthetic future decision-hand verification request blocked when no recipient route is declared');

const r140RouteDeclaration = createR140RouteDeclaration(r139Packet);
const compatibleR140 = createR140(compatibleR139, [r140RouteDeclaration]);
assert.ok(compatibleR140.preflight.assessments.length === 1 &&
  compatibleR140.preflight.assessments[0].status ===
    'RECIPIENT_ROUTE_CONTRACT_COMPATIBLE_UNVERIFIED' &&
  compatibleR140.preflight.routes[0].status ===
    'RECIPIENT_ROUTE_CONTRACT_COMPATIBLE_UNVERIFIED' &&
  compatibleR140.preflight.routes[0].operationalReadiness === 'BLOCKED' &&
  compatibleR140.preflight.summary.compatibleUnverifiedRouteCount === 1 &&
  r140Audit
    .auditLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteResolutionPreflight(
      compatibleR140.contract, compatibleR140.preflight,
      compatibleR140.custody, [r140RouteDeclaration]).status === 'PASS',
'R140 structurally accepts one exact-bound declaration while preserving the route as unverified and blocked');

const r140Route = compatibleR140.preflight.routes[0];
assert.ok(r140Route.endpointResolverProviderId !== r140Route.candidateProviderId &&
  r140Route.trustAnchorAuthorityProviderId !== r140Route.candidateProviderId &&
  r140Route.transportProviderId !== r140Route.candidateProviderId &&
  new Set([r140Route.endpointResolverProviderId,
    r140Route.trustAnchorAuthorityProviderId,
    r140Route.transportProviderId]).size === 3 &&
  Object.values(r140Route.truth).every(value => value === false) &&
  compatibleR140.preflight.summary.independentlyResolvedRouteCount === 0 &&
  compatibleR140.preflight.summary.authorityDecisionCount === 0 &&
  compatibleR140.preflight.summary.routeDesignationOrAuthorizationCount === 0 &&
  compatibleR140.preflight.summary.transmittedRequestCount === 0 &&
  compatibleR140.preflight.summary.independentlyVerifiedProviderCount === 0,
'R140 keeps the decision-hand candidate and three route roles distinct without claiming resolution, authority, designation, transport, or verification');

const r140SelfRoutingDeclaration = structuredClone(r140RouteDeclaration);
const r140CandidateId = r140SelfRoutingDeclaration.candidateProvider.providerId;
r140SelfRoutingDeclaration.routeProviders.endpointResolver.providerId =
  r140CandidateId;
r140SelfRoutingDeclaration.routeProviders.transport
  .declaredDependencyProviderIds[0] = r140CandidateId;
resign(r140SelfRoutingDeclaration);
const r140SelfRouting = createR140(compatibleR139,
  [r140SelfRoutingDeclaration]);
assert.ok(r140SelfRouting.preflight.assessments[0].status ===
    'RECIPIENT_ROUTE_DECLARATION_REJECTED' &&
  r140SelfRouting.preflight.assessments[0].reasonCodes.includes(
    'DIRECT_CANDIDATE_SELF_ROUTING_PROHIBITED') &&
  r140SelfRouting.preflight.routes[0].status ===
    'REJECTED_RECIPIENT_ROUTE_DECLARATION',
'R140 rejects a decision-hand candidate inserted as its own endpoint-route provider');

const r140CircularDeclaration = structuredClone(r140RouteDeclaration);
const r140CircularId =
  r140CircularDeclaration.routeProviders.endpointResolver.providerId;
r140CircularDeclaration.routeProviders.endpointResolver
  .declaredDependencyProviderIds = [r140CircularId];
resign(r140CircularDeclaration);
const r140CollisionDeclaration = createR140RouteDeclaration(r139Packet,
  'collision');
r140CollisionDeclaration.routeProviders.transport.providerId =
  r140CollisionDeclaration.routeProviders.endpointResolver.providerId;
resign(r140CollisionDeclaration);
const r140CircularAndCollision = createR140(compatibleR139,
  [r140CircularDeclaration, r140CollisionDeclaration]);
assert.ok(r140CircularAndCollision.preflight.assessments[0].reasonCodes.includes(
    'CIRCULAR_OR_CANDIDATE_DEPENDENCY_PROHIBITED') &&
  r140CircularAndCollision.preflight.assessments[1].reasonCodes.includes(
    'ROUTE_PROVIDER_ROLE_COLLISION_PROHIBITED') &&
  r140CircularAndCollision.preflight.summary
    .circularDependencyRejectionCount >= 1 &&
  r140CircularAndCollision.preflight.summary
    .roleCollisionRejectionCount === 1,
'R140 rejects circular route dependencies and provider role collisions');

const r140AmbiguousDeclarations = [
  createR140RouteDeclaration(r139Packet, 'ambiguous-a'),
  createR140RouteDeclaration(r139Packet, 'ambiguous-b')
];
const r140Ambiguous = createR140(compatibleR139,
  r140AmbiguousDeclarations);
assert.ok(r140Ambiguous.preflight.routes[0].status ===
    'AMBIGUOUS_RECIPIENT_ROUTE_DECLARATION' &&
  r140Ambiguous.preflight.routes[0].endpointResolverProviderId === null &&
  r140Ambiguous.preflight.routes[0].trustAnchorAuthorityProviderId === null &&
  r140Ambiguous.preflight.routes[0].transportProviderId === null &&
  r140Ambiguous.preflight.summary.ambiguousRouteCount === 1,
'R140 rejects ambiguity instead of silently selecting one compatible unverified route');

assert.throws(() => r140
  .createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteResolutionPreflightContractReceipt({
    ...compatibleR140.custody,
    r139Batch: emptyR139.batch
  }), /exact R139 custody/,
'R140 rejects substitution across the exact R139 custody boundary');

const r140Overclaim = structuredClone(compatibleR140.preflight);
r140Overclaim.routes[0].operationalReadiness = 'READY';
Object.keys(r140Overclaim.routes[0].truth).forEach(key => {
  r140Overclaim.routes[0].truth[key] = true;
});
r140Overclaim.summary.independentlyResolvedRouteCount = 1;
r140Overclaim.summary.authenticatedRecipientCount = 1;
r140Overclaim.summary.authorityEstablishedCount = 1;
r140Overclaim.summary.authorityDecisionCount = 1;
r140Overclaim.summary.routeDesignationOrAuthorizationCount = 1;
r140Overclaim.summary.contactAuthorizedCount = 1;
r140Overclaim.summary.transmittedRequestCount = 1;
r140Overclaim.summary.senderReceiptCount = 1;
r140Overclaim.summary.receiverReceiptCount = 1;
r140Overclaim.summary.independentlyVerifiedProviderCount = 1;
r140Overclaim.summary.evidenceAdmittedCount = 1;
r140Overclaim.summary.admissionReady = true;
Object.keys(r140Overclaim.truth).forEach(key => {
  r140Overclaim.truth[key] = true;
});
resign(r140Overclaim);
assert.ok(!r140
    .landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteResolutionPreflightValid(
      r140Overclaim, compatibleR140.contract, compatibleR140.custody,
      [r140RouteDeclaration]) &&
  r140Audit
    .auditLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteResolutionPreflight(
      compatibleR140.contract, r140Overclaim, compatibleR140.custody,
      [r140RouteDeclaration]).status === 'FAIL',
'R140 rejects re-signed endpoint, recipient, authority, decision, designation, transport, verification, evidence, persistence, and mutation overclaims');

const r140ProducerText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-recipient-route-resolution-preflight.mjs'), 'utf8');
const r140AuditText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-verifier-route-out-of-band-authority-designation-decision-hand-provider-verification-recipient-route-resolution-preflight-audit.mjs'), 'utf8');
assert.ok(compatibleR140.contract.resourceBudget.maximumRouteDeclarations === 2 &&
  compatibleR140.contract.resourceBudget.maximumDeclarationsPerRequest === 2 &&
  compatibleR140.contract.resourceBudget.maximumDeclaredDependencies === 12 &&
  compatibleR140.contract.resourceBudget.maximumSerializedDeclarationBytes ===
    131072 &&
  compatibleR140.contract.resourceBudget.maximumSerializedPreflightBytes ===
    524288 &&
  !/\bfetch\s*\(|XMLHttpRequest|new\s+WebSocket|node:dns|node:net/.test(
    r140ProducerText) &&
  !r140AuditText.includes(
    'createLandMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteResolutionPreflight') &&
  !r140AuditText.includes(
    'landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteResolutionPreflightContractReceiptValid') &&
  !r140AuditText.includes(
    'landMatrixThermalVerifierRouteOutOfBandAuthorityDesignationDecisionHandProviderVerificationRecipientRouteResolutionPreflightValid') &&
  JSON.stringify(fixture) === fixtureBefore,
'R140 remains bounded, non-networked, independently reconstructed, custody-preserving, and free of provider, authority-decision, route-designation, transport, persistence, promotion, or canon action');

console.log('foundation planet R140 isolated selftest: PASS (11 assertions)');
