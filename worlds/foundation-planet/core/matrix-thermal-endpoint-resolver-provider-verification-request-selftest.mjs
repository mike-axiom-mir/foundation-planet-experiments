import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const fixturePath = process.argv[2];
if (!fixturePath) throw new Error('R128 selftest requires an exact R126 fixture');
const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
const fixtureBefore = JSON.stringify(fixture);
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const r126 = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-endpoint-resolver-capability-specification.mjs')).href);
const r127 = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-endpoint-resolver-provider-binding-preflight.mjs')).href);
const r128 = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-endpoint-resolver-provider-verification-request.mjs')).href);
const audit = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-endpoint-resolver-provider-verification-request-audit.mjs')).href);

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

function createDeclaration(providerId = 'selftest.endpoint-resolver.candidate',
  providerVersion = '0.1.0-experimental') {
  const specification = fixture.r126FullBundle.specification;
  return resign({
    schema: r127
      .LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_OWNER_DEBIT_EXTERNAL_CAPABILITY_PROVIDER_VERIFICATION_ENDPOINT_RESOLVER_PROVIDER_DECLARATION_SCHEMA,
    providerId,
    providerVersion,
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
  return { contract, batch, custody };
}

const emptyR127 = createR127(fixture.r126EmptyContract,
  fixture.r126EmptyBundle, []);
const emptyR128 = createR128(emptyR127);
const emptyAudit = audit
  .auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequest(
    emptyR128.contract, emptyR128.batch, emptyR128.custody);
assert.ok(r128
    .landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestContractReceiptValid(
      emptyR128.contract, emptyR128.custody) && r128
    .landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestBatchValid(
      emptyR128.batch, emptyR128.contract, emptyR128.custody, {}) &&
  emptyAudit.status === 'PASS' &&
  emptyR128.contract.projection.sourceSpecificationCount === 1 &&
  emptyR128.contract.projection.sourceDeclarationCount === 0 &&
  emptyR128.contract.projection.requestEligibleBindingCount === 0 &&
  emptyR128.contract.projection.proofRequirementCountPerRequest === 6 &&
  emptyR128.batch.status ===
    'NO_CONTRACT_COMPATIBLE_RESOLVER_PROVIDER_BINDING_REQUEST_BATCH_EMPTY' &&
  emptyR128.batch.packets.length === 0 &&
  emptyR128.batch.summary.missingBindingCount === 1 &&
  emptyR128.batch.summary.transmittedRequestCount === 0,
'R128 current empty resolver-provider inventory remains a receipted empty request batch');

const declaration = createDeclaration();
const compatibleR127 = createR127(fixture.r126FullContract,
  fixture.r126FullBundle, [declaration]);
const options = {
  requestBatchId: 'selftest.r128.resolver-provider-verification',
  requesterId: 'selftest.r128.request-creator',
  requestedAt: '2026-08-27T01:00:00.000Z',
  expiresAt: '2026-08-27T01:05:00.000Z'
};
const compatibleR128 = createR128(compatibleR127, options);
const compatibleAudit = audit
  .auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequest(
    compatibleR128.contract, compatibleR128.batch,
    compatibleR128.custody, options);
const packet = compatibleR128.batch.packets[0];
assert.ok(r128
    .landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestContractReceiptValid(
      compatibleR128.contract, compatibleR128.custody) && r128
    .landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestBatchValid(
      compatibleR128.batch, compatibleR128.contract,
      compatibleR128.custody, options) && compatibleAudit.status === 'PASS' &&
  compatibleR128.batch.status ===
    'RESOLVER_PROVIDER_VERIFICATION_REQUEST_CREATED_NOT_TRANSMITTED_PROVIDER_BLOCKED' &&
  compatibleR128.batch.summary.requestPacketCount === 1 &&
  compatibleR128.batch.summary.proofRequirementCount === 6 &&
  compatibleR128.batch.summary.deferredExecutionPrerequisiteCount === 1 &&
  packet.requestBinding.r126ContractDigest ===
    fixture.r126FullContract.digest &&
  packet.requestBinding.r126BundleDigest === fixture.r126FullBundle.digest &&
  packet.requestBinding.resolverSpecificationDigest ===
    fixture.r126FullBundle.specification.digest &&
  packet.recipient.status === 'UNRESOLVED' &&
  packet.transport.status === 'NOT_TRANSMITTED',
'R128 creates one exact digest-bound six-proof request without resolving a recipient or transmitting');

const requestedReasons = [
  ...packet.proofRequirements.map(requirement =>
    requirement.requiredBlockingReason),
  packet.deferredResolverExecutionPrerequisite.requiredBlockingReason
].sort();
assert.deepEqual(requestedReasons,
  [...compatibleR127.preflight.binding.blockingReasons].sort(),
'R128 routes every R127 compatible-binding blocker while deferring per-request authority and consent');

assert.ok(packet.proofRequirements.map(requirement => requirement.proofId)
    .join('|') === [
      'INDEPENDENT_RESOLVER_IDENTITY_AND_AUTHORITY',
      'RESOLVER_IMPLEMENTATION_INTEGRITY',
      'LIVE_RESOLVER_AVAILABILITY',
      'NATIVE_RESOLVER_RECEIPT_SCHEMA_VALIDATION',
      'ALLOWED_AND_DENIED_RESOLVER_IDENTITY_PROBES',
      'EXACT_R126_REQUEST_AND_BINDING_DIGEST_REPLAY'
    ].join('|') &&
  packet.deferredResolverExecutionPrerequisite.status ===
    'DEFERRED_UNTIL_EXACT_RESOLVER_EXECUTION_REQUEST' &&
  packet.deferredResolverExecutionPrerequisite
    .providerVerificationRequestMaySatisfy === false &&
  packet.permissionsAndConsent
    .providerVerificationMayAuthorizeResolverExecution === false &&
  Object.entries(packet.truth).every(([key, value]) =>
    key === 'requestCreated' ? value === true : value === false),
'R128 separates provider proof routing from future per-request execution authority');

assert.throws(() => createR128(compatibleR127, {
  ...options,
  expiresAt: '2026-08-27T01:05:00.001Z'
}), /bounded request window/,
'R128 enforces its five-minute request-window ceiling');

const second = createDeclaration('selftest.endpoint-resolver.second',
  '0.1.1-experimental');
const ambiguousR127 = createR127(fixture.r126FullContract,
  fixture.r126FullBundle, [declaration, second]);
const ambiguousR128 = createR128(ambiguousR127);
assert.ok(ambiguousR127.preflight.binding.assessmentStatus ===
    'AMBIGUOUS_COMPATIBLE_DECLARATIONS' &&
  ambiguousR128.batch.packets.length === 0 &&
  ambiguousR128.batch.summary.ambiguousBindingCount === 1 && audit
    .auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequest(
      ambiguousR128.contract, ambiguousR128.batch,
      ambiguousR128.custody).status === 'PASS',
'R128 creates no request when R127 leaves provider selection ambiguous');

const weakened = structuredClone(declaration);
weakened.lifecycle.resolverInstalled = true;
weakened.verificationDeclaration.liveAvailabilityReceipt = {
  fictional: true
};
resign(weakened);
const rejectedR127 = createR127(fixture.r126FullContract,
  fixture.r126FullBundle, [weakened]);
const rejectedR128 = createR128(rejectedR127);
assert.ok(rejectedR127.preflight.binding.assessmentStatus ===
    'DECLARATION_REJECTED' && rejectedR128.batch.packets.length === 0 &&
  rejectedR128.batch.summary.rejectedBindingCount === 1 && audit
    .auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequest(
      rejectedR128.contract, rejectedR128.batch,
      rejectedR128.custody).status === 'PASS',
'R128 creates no request from a rejected resolver-provider declaration');

const substitutedCustody = {
  ...compatibleR128.custody,
  r127Source: emptyR127.source
};
assert.throws(() => r128
  .createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestContractReceipt(
    substitutedCustody), /sealed R126 source boundary/,
'R128 rejects substitution across the sealed R127-to-R126 source boundary');

const overclaim = structuredClone(compatibleR128.batch);
overclaim.packets[0].recipient.status = 'RESOLVED';
overclaim.packets[0].recipient.endpoint = 'https://fictional.invalid';
overclaim.packets[0].recipient.verifierIdentity = 'fictional-verifier';
overclaim.packets[0].transport.status = 'TRANSMITTED';
overclaim.packets[0].transport.senderReceipt = { fictional: true };
overclaim.packets[0].transport.receiverReceipt = { fictional: true };
overclaim.packets[0].lifecycle.installed = true;
overclaim.packets[0].lifecycle.executed = true;
overclaim.packets[0].lifecycle.promoted = true;
overclaim.packets[0].lifecycle.canon = true;
Object.keys(overclaim.packets[0].truth).forEach(key => {
  overclaim.packets[0].truth[key] = true;
});
resign(overclaim.packets[0]);
overclaim.summary.resolvedVerificationRecipientCount = 1;
overclaim.summary.transmittedRequestCount = 1;
overclaim.summary.receiverReceiptCount = 1;
overclaim.summary.independentlyVerifiedResolverProviderCount = 1;
overclaim.summary.resolverInstalledCount = 1;
overclaim.summary.resolverAvailableCount = 1;
overclaim.summary.resolverExecutedCount = 1;
overclaim.summary.resolvedEndpointCount = 1;
overclaim.summary.admissionReady = true;
overclaim.prohibitedConclusions.selectInstallOrExecuteCandidateProvider =
  false;
overclaim.truth.requestBatchMaySelectInstallOrExecuteResolverProvider = true;
overclaim.truth.requestBatchMayResolveVerificationRecipientOrEndpoint = true;
overclaim.truth.requestBatchMayTransmit = true;
overclaim.providerVerificationResult = { fictional: true };
overclaim.historicalSourceOwner = { id: 'fictional-owner' };
overclaim.historicalDebitReceipt = { verified: true };
overclaim.persistence = { performed: true };
overclaim.promotion = { canon: true };
resign(overclaim);
assert.ok(!r128
    .landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestBatchValid(
      overclaim) && audit
    .auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequest(
      compatibleR128.contract, overclaim, compatibleR128.custody,
      options).status === 'FAIL',
'R128 rejects re-signed provider selection, verification, execution, transport, owner/debit, admission, persistence, promotion, and canon overclaims');

const producerText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-endpoint-resolver-provider-verification-request.mjs'),
'utf8');
const auditText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-endpoint-resolver-provider-verification-request-audit.mjs'),
'utf8');
assert.ok(!/\bfetch\s*\(|XMLHttpRequest|new\s+WebSocket|node:dns|node:net/.test(
    producerText) && !auditText.includes(
    'createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequest') &&
  !auditText.includes(
    'landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestContractReceiptValid') &&
  !auditText.includes(
    'landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderVerificationRequestBatchValid') &&
  JSON.stringify(fixture) === fixtureBefore,
'R128 has no network primitive, its audit calls no R128 builder or validator, and exact R126 custody remains unchanged');

console.log('foundation planet R128 isolated selftest: PASS (10 assertions)');
