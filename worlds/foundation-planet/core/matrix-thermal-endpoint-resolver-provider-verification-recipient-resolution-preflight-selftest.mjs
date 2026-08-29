import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const fixturePath = process.argv[2];
if (!fixturePath) throw new Error('R129 selftest requires an exact R126 fixture');
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
const audit = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-endpoint-resolver-provider-verification-recipient-resolution-preflight-audit.mjs')).href);

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

const emptyR127 = createR127(fixture.r126EmptyContract,
  fixture.r126EmptyBundle, []);
const emptyR128 = createR128(emptyR127);
const emptyR129 = createR129(emptyR128);
assert.ok(r129
    .landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflightContractReceiptValid(
      emptyR129.contract, emptyR129.custody) && r129
    .landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflightValid(
      emptyR129.preflight, emptyR129.contract, emptyR129.source, []) &&
  emptyR129.preflight.status ===
    'NO_RESOLVER_PROVIDER_VERIFICATION_REQUESTS_RECIPIENT_PREFLIGHT_EMPTY' &&
  emptyR129.preflight.summary.sourceRequestPacketCount === 0 &&
  emptyR129.preflight.summary.endpointDeclarationCount === 0 &&
  audit
    .auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflight(
      emptyR129.contract, emptyR129.preflight, emptyR129.source, [],
      emptyR129.custody).status === 'PASS',
'R129 current empty R128 request inventory remains an audited empty recipient preflight');

const providerDeclaration = createProviderDeclaration();
const compatibleR127 = createR127(fixture.r126FullContract,
  fixture.r126FullBundle, [providerDeclaration]);
const r128Options = {
  requestBatchId: 'selftest.r128.resolver-provider-verification',
  requesterId: 'selftest.r128.request-creator',
  requestedAt: '2026-08-27T01:00:00.000Z',
  expiresAt: '2026-08-27T01:05:00.000Z'
};
const compatibleR128 = createR128(compatibleR127, r128Options);
const missingR129 = createR129(compatibleR128);
assert.ok(missingR129.preflight.status ===
    'RESOLVER_PROVIDER_VERIFICATION_RECIPIENT_UNRESOLVED_NO_DECLARATIONS' &&
  missingR129.preflight.endpoints[0].status ===
    'MISSING_RECIPIENT_ENDPOINT_DECLARATION' &&
  missingR129.preflight.endpoints[0].blockingReasons.join('|') ===
    'RECIPIENT_ENDPOINT_DECLARATION_REQUIRED' && audit
    .auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflight(
      missingR129.contract, missingR129.preflight, missingR129.source, [],
      missingR129.custody).status === 'PASS',
'R129 keeps a real request recipient unresolved when no endpoint declaration exists');

const packet = compatibleR128.batch.packets[0];
const declaration = createEndpointDeclaration(packet);
const compatibleR129 = createR129(compatibleR128, [declaration]);
const endpoint = compatibleR129.preflight.endpoints[0];
assert.ok(r129
    .landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientEndpointDeclarationValid(
      declaration, compatibleR129.source) && r129
    .landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflightValid(
      compatibleR129.preflight, compatibleR129.contract,
      compatibleR129.source, [declaration]) &&
  endpoint.status ===
    'RECIPIENT_ENDPOINT_CONTRACT_COMPATIBLE_UNVERIFIED' &&
  endpoint.claimedVerificationRecipientId ===
    packet.recipient.claimedVerifierId &&
  endpoint.alternateResolverProviderId !==
    endpoint.candidateResolverProviderId &&
  endpoint.blockingReasons.length === 6 &&
  endpoint.operationalReadiness === 'BLOCKED' &&
  Object.values(endpoint.truth).every(value => value === false) && audit
    .auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflight(
      compatibleR129.contract, compatibleR129.preflight,
      compatibleR129.source, [declaration],
      compatibleR129.custody).status === 'PASS',
'R129 binds one distinct alternate-resolver declaration while keeping independence, endpoint, recipient, contact, transport, and verification blocked');

const selfResolution = createEndpointDeclaration(packet,
  packet.claimedProvider.providerId);
const selfResolutionR129 = createR129(compatibleR128, [selfResolution]);
assert.ok(selfResolutionR129.preflight.assessments[0].status ===
    'RECIPIENT_ENDPOINT_DECLARATION_REJECTED' &&
  selfResolutionR129.preflight.assessments[0].reasonCodes.includes(
    'DIRECT_CANDIDATE_SELF_RESOLUTION_PROHIBITED') &&
  selfResolutionR129.preflight.summary.directSelfResolutionRejectionCount ===
    1 && selfResolutionR129.preflight.endpoints[0].status ===
    'REJECTED_RECIPIENT_ENDPOINT_DECLARATION' && audit
    .auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflight(
      selfResolutionR129.contract, selfResolutionR129.preflight,
      selfResolutionR129.source, [selfResolution],
      selfResolutionR129.custody).status === 'PASS',
'R129 rejects use of the unverified candidate resolver to resolve its own verifier');

const circular = createEndpointDeclaration(packet,
  'selftest.endpoint-resolver.alternate',
  [packet.claimedProvider.providerId]);
const circularR129 = createR129(compatibleR128, [circular]);
assert.ok(circularR129.preflight.assessments[0].reasonCodes.includes(
    'CIRCULAR_RESOLVER_DEPENDENCY_PROHIBITED') &&
  circularR129.preflight.summary.circularDependencyRejectionCount === 1 &&
  circularR129.preflight.endpoints[0].status ===
    'REJECTED_RECIPIENT_ENDPOINT_DECLARATION' && audit
    .auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflight(
      circularR129.contract, circularR129.preflight,
      circularR129.source, [circular], circularR129.custody).status === 'PASS',
'R129 rejects a declared alternate resolver dependency on the candidate provider');

const wrongRecipient = structuredClone(declaration);
wrongRecipient.claimedVerificationRecipient.recipientId =
  'selftest.wrong.verifier';
resign(wrongRecipient);
const wrongRecipientR129 = createR129(compatibleR128, [wrongRecipient]);
assert.ok(wrongRecipientR129.preflight.assessments[0].reasonCodes.includes(
    'VERIFICATION_RECIPIENT_BINDING_MISMATCH') &&
  wrongRecipientR129.preflight.endpoints[0].status ===
    'REJECTED_RECIPIENT_ENDPOINT_DECLARATION',
'R129 rejects a recipient claim that does not bind the exact R128 verifier ID');

const secondDeclaration = createEndpointDeclaration(packet,
  'selftest.endpoint-resolver.second-alternate');
secondDeclaration.locator.value = 'https://second.example.test/endpoint';
resign(secondDeclaration);
const ambiguousR129 = createR129(compatibleR128,
  [declaration, secondDeclaration]);
assert.ok(ambiguousR129.preflight.summary.compatibleUnverifiedDeclarationCount ===
    2 && ambiguousR129.preflight.endpoints[0].status ===
    'AMBIGUOUS_RECIPIENT_ENDPOINT_DECLARATION' &&
  ambiguousR129.preflight.endpoints[0].alternateResolverProviderId === null &&
  audit
    .auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflight(
      ambiguousR129.contract, ambiguousR129.preflight,
      ambiguousR129.source, [declaration, secondDeclaration],
      ambiguousR129.custody).status === 'PASS',
'R129 refuses to select between multiple compatible recipient endpoint declarations');

const substitutedCustody = {
  ...compatibleR129.custody,
  r128RequestSource: emptyR128.custody
};
assert.throws(() => r129
  .createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflightContractReceipt(
    substitutedCustody), /exact R128 contract/,
'R129 rejects substitution across the sealed R128 request source boundary');

const overclaim = structuredClone(compatibleR129.preflight);
overclaim.endpoints[0].operationalReadiness = 'READY';
Object.keys(overclaim.endpoints[0].truth).forEach(key => {
  overclaim.endpoints[0].truth[key] = true;
});
overclaim.summary.independentlyResolvedEndpointCount = 1;
overclaim.summary.authenticatedRecipientCount = 1;
overclaim.summary.contactAuthorizedCount = 1;
overclaim.summary.transmittedRequestCount = 1;
overclaim.summary.receiverReceiptCount = 1;
overclaim.summary.independentlyVerifiedResolverProviderCount = 1;
overclaim.summary.admissionReady = true;
Object.keys(overclaim.truth).forEach(key => {
  overclaim.truth[key] = true;
});
overclaim.providerSelection = { selected: true };
overclaim.transport = { performed: true };
overclaim.persistence = { performed: true };
overclaim.historicalSourceOwner = { id: 'fictional-owner' };
overclaim.historicalDebitReceipt = { verified: true };
overclaim.promotion = { canon: true };
resign(overclaim);
assert.ok(!r129
    .landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflightValid(
      overclaim) && audit
    .auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflight(
      compatibleR129.contract, overclaim, compatibleR129.source,
      [declaration], compatibleR129.custody).status === 'FAIL',
'R129 rejects re-signed independence, resolution, authentication, contact, transport, provider verification, owner/debit, admission, persistence, promotion, and canon overclaims');

const producerText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-endpoint-resolver-provider-verification-recipient-resolution-preflight.mjs'), 'utf8');
const auditText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-endpoint-resolver-provider-verification-recipient-resolution-preflight-audit.mjs'), 'utf8');
assert.ok(!/\bfetch\s*\(|XMLHttpRequest|new\s+WebSocket|node:dns|node:net/.test(
    producerText) && !auditText.includes(
    'createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflight') &&
  !auditText.includes(
    'landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflightContractReceiptValid') &&
  !auditText.includes(
    'landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRecipientResolutionPreflightValid') &&
  JSON.stringify(fixture) === fixtureBefore,
'R129 has no network primitive, its audit calls no R129 builder or validator, and exact R126 custody remains unchanged');

console.log('foundation planet R129 isolated selftest: PASS (10 assertions)');
