import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const fixturePath = process.argv[2];
if (!fixturePath) throw new Error('R132 selftest requires an exact R126 fixture');
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
const audit = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-verifier-route-trust-anchor-and-transport-provider-binding-preflight-audit.mjs')).href);

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
assert.ok(r132
    .landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflightContractReceiptValid(
      emptyR132.contract, emptyR132.boundary) && r132
    .landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflightValid(
      emptyR132.preflight, emptyR132.contract, emptyR132.boundary, []) &&
  emptyR132.preflight.status ===
    'VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_PREFLIGHT_BLOCKED_WITH_NO_DECLARATIONS' &&
  emptyR132.preflight.assessments.every(item => item.status ===
    'MISSING_PROVIDER_DECLARATION') &&
  emptyR132.preflight.providerCandidates.length === 0 && audit
    .auditLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflight(
      emptyR132.contract, emptyR132.preflight, emptyR132.boundary, []).status ===
    'PASS',
'R132 current real empty declaration inventory remains an audited blocked preflight');

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
assert.ok(compatibleR132.preflight.status ===
    'VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_CANDIDATES_COMPATIBLE_UNVERIFIED' &&
  compatibleR132.preflight.providerCandidates.length === 2 &&
  compatibleR132.preflight.assessments.every(item => item.status ===
    'PROVIDER_DECLARATION_CONTRACT_COMPATIBLE_UNVERIFIED') && audit
    .auditLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflight(
      compatibleR132.contract, compatibleR132.preflight,
      compatibleR132.boundary, compatibleR132.declarations).status === 'PASS',
'R132 exact-binds one compatible unverified authority and one transport provider declaration');

const authorityCandidate = compatibleR132.preflight.providerCandidates[0];
assert.ok(authorityCandidate.providerId === authorityProviderId &&
  authorityCandidate.nativeReceiptSchemas.length === 1 &&
  authorityCandidate.nativeReceiptSchemas[0].trust ===
    'CALLER_DECLARED_UNVERIFIED' &&
  authorityCandidate.trust === 'CALLER_SUPPLIED_COMPATIBLE_UNVERIFIED' &&
  authorityCandidate.selected === false &&
  authorityCandidate.authorityEstablished === false &&
  authorityDeclaration.permissionsAndConsent
    .candidateResolverMayControlProvider === false &&
  authorityDeclaration.permissionsAndConsent
    .alternateResolverMayControlProvider === false,
'R132 authority candidate remains untrusted, unselected, resolver-independent by contract only, and non-authorizing');

const transportCandidate = compatibleR132.preflight.providerCandidates[1];
assert.ok(transportCandidate.providerId === transportProviderId &&
  transportCandidate.nativeReceiptSchemas.length === 2 &&
  transportCandidate.prerequisiteAuthorityProviderId === authorityProviderId &&
  transportCandidate.selected === false &&
  transportCandidate.transportPerformed === false &&
  transportDeclaration.resourceBudget
    .maximumSendAttemptsPerExactAuthorityReceipt === 1 &&
  transportDeclaration.resourceBudget.automaticRetryCount === 0,
'R132 transport candidate exact-binds its declared authority prerequisite and remains non-executed with no automatic retry');

const reusedSchemaAuthority = structuredClone(authorityDeclaration);
reusedSchemaAuthority.nativeReceiptSchemas[0].schema =
  transportDeclaration.nativeReceiptSchemas[0].schema;
resign(reusedSchemaAuthority);
const weakenedTransport = structuredClone(transportDeclaration);
weakenedTransport.permissionsAndConsent.providerMayInferConsent = true;
resign(weakenedTransport);
const rejectedR132 = createR132(compatibleR131,
  [reusedSchemaAuthority, weakenedTransport]);
assert.ok(rejectedR132.preflight.providerCandidates.length === 0 &&
  rejectedR132.preflight.assessments[0].issueCodes.includes(
    'NATIVE_RECEIPT_SCHEMA_INVALID_OR_REUSED') &&
  rejectedR132.preflight.assessments[1].issueCodes.includes(
    'PERMISSION_OR_CONSENT_BOUNDARY_MISMATCH'),
'R132 rejects reused native receipt schemas and weakened transport consent boundaries');

const secondAuthority = createProviderDeclaration(compatibleR131,
  r131.VERIFIER_ROUTE_TRUST_ANCHOR_RESOLVE_CAPABILITY_ID,
  'selftest.second.trust-anchor.authority');
const ambiguousR132 = createR132(compatibleR131,
  [authorityDeclaration, secondAuthority, transportDeclaration]);
assert.ok(ambiguousR132.preflight.status ===
    'VERIFIER_ROUTE_TRUST_ANCHOR_AND_TRANSPORT_PROVIDER_BINDING_PREFLIGHT_BLOCKED' &&
  ambiguousR132.preflight.assessments[0].status ===
    'AMBIGUOUS_PROVIDER_DECLARATIONS' &&
  ambiguousR132.preflight.assessments[0].candidateBinding === null &&
  ambiguousR132.preflight.assessments[1].status ===
    'PROVIDER_DECLARATIONS_REJECTED' &&
  ambiguousR132.preflight.summary.selectedProviderCount === 0,
'R132 preserves multiple authority providers as ambiguity and refuses to resolve the transport prerequisite');

const substitutedBoundary = {
  ...compatibleR132.boundary,
  r131Bundle: emptyR131.bundle
};
assert.throws(() => r132
  .createLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflightContractReceipt(
    substitutedBoundary), /exact R131 boundary/,
'R132 rejects substitution across the exact R131-to-R130/R129/R128/R127/R126 boundary');

const overclaim = structuredClone(compatibleR132.preflight);
overclaim.status = 'READY';
overclaim.providerCandidates.forEach(candidate => {
  candidate.trust = 'VERIFIED';
  candidate.selected = true;
  candidate.installed = true;
  candidate.available = true;
  candidate.executed = true;
  candidate.authorityEstablished = true;
  candidate.transportPerformed = true;
});
overclaim.summary.selectedProviderCount = 2;
overclaim.summary.installedProviderCount = 2;
overclaim.summary.availableProviderCount = 2;
overclaim.summary.executedProviderCount = 2;
overclaim.summary.authorityResolvedCount = 1;
overclaim.summary.transportedRequestCount = 1;
Object.keys(overclaim.truth).forEach(key => {
  overclaim.truth[key] = true;
});
overclaim.historicalSourceOwner = { id: 'fictional-owner' };
overclaim.historicalDebitReceipt = { verified: true };
overclaim.persistence = { performed: true };
resign(overclaim);
assert.ok(!r132
    .landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflightValid(
      overclaim, compatibleR132.contract, compatibleR132.boundary,
      compatibleR132.declarations) && audit
    .auditLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflight(
      compatibleR132.contract, overclaim, compatibleR132.boundary,
      compatibleR132.declarations).status === 'FAIL',
'R132 rejects re-signed trust, selection, install, availability, execution, authority, transport, owner/debit, persistence, promotion, and canon overclaims');

assert.ok(compatibleR132.contract.resourceBudget.maximumProviderDeclarations ===
    4 && compatibleR132.contract.resourceBudget
    .maximumDeclarationsPerCapability === 2 &&
  compatibleR132.contract.resourceBudget
    .maximumNativeSchemasPerDeclaration === 2 &&
  new TextEncoder().encode(JSON.stringify(authorityDeclaration)).length <=
    compatibleR132.contract.resourceBudget.maximumSerializedDeclarationBytes &&
  new TextEncoder().encode(JSON.stringify(compatibleR132.preflight)).length <=
    compatibleR132.contract.resourceBudget.maximumSerializedPreflightBytes,
'R132 keeps declaration counts, native schemas, declaration bytes, and preflight bytes bounded');

const producerText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-verifier-route-trust-anchor-and-transport-provider-binding-preflight.mjs'), 'utf8');
const auditText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-verifier-route-trust-anchor-and-transport-provider-binding-preflight-audit.mjs'), 'utf8');
assert.ok(!/\bfetch\s*\(|XMLHttpRequest|new\s+WebSocket|node:dns|node:net/.test(
    producerText) && !auditText.includes(
    'createLandMatrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflight') &&
  !auditText.includes(
    'landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflightContractReceiptValid') &&
  !auditText.includes(
    'landMatrixThermalVerifierRouteTrustAnchorAndTransportProviderBindingPreflightValid') &&
  JSON.stringify(fixture) === fixtureBefore,
'R132 has no network primitive, its audit calls no R132 builder or validator, and exact R126 custody remains unchanged');

console.log('foundation planet R132 isolated selftest: PASS (10 assertions)');
