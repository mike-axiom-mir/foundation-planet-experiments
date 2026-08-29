import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const fixturePath = process.argv[2];
if (!fixturePath) throw new Error('R127 selftest requires an exact R126 fixture');
const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
const fixtureBefore = JSON.stringify(fixture);
const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const r126 = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-endpoint-resolver-capability-specification.mjs')).href);
const r127 = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-endpoint-resolver-provider-binding-preflight.mjs')).href);
const audit = await import(pathToFileURL(path.join(root, 'core',
  'matrix-thermal-endpoint-resolver-provider-binding-preflight-audit.mjs')).href);

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

const emptyCustody = {
  r126Contract: fixture.r126EmptyContract,
  r126Bundle: fixture.r126EmptyBundle
};
const emptySource = {
  r126Contract: fixture.r126EmptyContract,
  r126Bundle: fixture.r126EmptyBundle
};
const emptyContract = r127
  .createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflightContractReceipt(
    emptyCustody);
const emptyPreflight = r127
  .createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflight(
    emptyContract, emptySource);
const emptyAudit = audit
  .auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflight(
    emptyContract, emptyPreflight, emptyCustody);
assert.ok(r127
    .landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflightContractReceiptValid(
      emptyContract, emptyCustody) && r127
    .landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflightValid(
      emptyPreflight, emptyContract, emptySource, []) &&
  emptyAudit.status === 'PASS' &&
  emptyContract.projection.specificationCount === 1 &&
  emptyContract.projection.sourceRequestPacketCount === 0 &&
  emptyContract.projection.resolverCapabilityId ===
    'transport.foundation-planet.external-provider-verification.endpoint.resolve' &&
  emptyContract.resourceBudget.maximumDeclarations === 2 &&
  emptyContract.resourceBudget.maximumSerializedDeclarationBytes === 65536 &&
  emptyContract.resourceBudget.maximumRegistryQueriesPerRequest === 8 &&
  emptyPreflight.status === 'BLOCKED_NO_RESOLVER_PROVIDER_DECLARATIONS' &&
  emptyPreflight.assessments.length === 0 &&
  emptyPreflight.binding.assessmentStatus ===
    'MISSING_RESOLVER_PROVIDER_DECLARATION' &&
  emptyPreflight.binding.operationalReadiness === 'BLOCKED' &&
  emptyPreflight.summary.missingBindingCount === 1 &&
  emptyPreflight.summary.operationallyReadyBindingCount === 0 &&
  emptyPreflight.summary.resolverInstalledCount === 0 &&
  emptyPreflight.summary.resolverAvailableCount === 0 &&
  emptyPreflight.summary.resolvedEndpointCount === 0 &&
  emptyPreflight.summary.transmittedRequestCount === 0,
'R127 empty real inventory remains one missing, blocked resolver binding');

const fullCustody = {
  r126Contract: fixture.r126FullContract,
  r126Bundle: fixture.r126FullBundle
};
const fullSource = {
  r126Contract: fixture.r126FullContract,
  r126Bundle: fixture.r126FullBundle
};
const fullContract = r127
  .createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflightContractReceipt(
    fullCustody);
const specification = fixture.r126FullBundle.specification;
const declaration = resign({
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
const compatible = r127
  .createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflight(
    fullContract, fullSource, [declaration]);
const compatibleAudit = audit
  .auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflight(
    fullContract, compatible, fullCustody, [declaration]);
assert.ok(r127
    .landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderDeclarationValid(
      declaration, fixture.r126FullBundle) && r127
    .landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflightValid(
      compatible, fullContract, fullSource, [declaration]) &&
  compatibleAudit.status === 'PASS' &&
  compatible.status ===
    'BLOCKED_RESOLVER_PROVIDER_CONTRACT_COMPATIBLE_UNVERIFIED' &&
  compatible.summary.sourceRequestPacketCount === 15 &&
  compatible.summary.acceptedUnverifiedDeclarationCount === 1 &&
  compatible.summary.contractCompatibleUnverifiedBindingCount === 1 &&
  compatible.binding.assessmentStatus === 'CONTRACT_COMPATIBLE_UNVERIFIED' &&
  compatible.binding.operationalReadiness === 'BLOCKED' &&
  compatible.binding.nativeResolverReceiptSchemaTrust ===
    'CALLER_SUPPLIED_UNVERIFIED' &&
  compatible.binding.blockingReasons.length === 7 &&
  compatible.binding.blockingReasons.includes(
    'INDEPENDENT_RESOLVER_IDENTITY_AND_AUTHORITY_REQUIRED') &&
  compatible.binding.blockingReasons.includes(
    'IMPLEMENTATION_INTEGRITY_RECEIPT_REQUIRED') &&
  compatible.binding.blockingReasons.includes(
    'PER_REQUEST_AUTHORITY_AND_CONSENT_RECEIPTS_REQUIRED_BEFORE_RESOLUTION') &&
  Object.entries(compatible.truth).every(([key, value]) =>
    key === 'exactR126ResolverSpecificationContractAndBundleBound' ||
    key === 'callerSuppliedDeclarationsTreatedAsUntrustedData'
      ? value === true : value === false),
'R127 compatible candidate remains unverified and operationally blocked');

assert.throws(() => r127
  .createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflight(
    fullContract, emptySource, [declaration]),
/exact R127 contract, exact R126 specification custody/,
'R127 rejects R126 bundle substitution');

const second = resign(structuredClone(declaration));
second.providerId = 'selftest.endpoint-resolver.second';
second.providerVersion = '0.1.1-experimental';
resign(second);
const ambiguous = r127
  .createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflight(
    fullContract, fullSource, [declaration, second]);
const ambiguousAudit = audit
  .auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflight(
    fullContract, ambiguous, fullCustody, [declaration, second]);
assert.ok(ambiguous.binding.assessmentStatus ===
    'AMBIGUOUS_COMPATIBLE_DECLARATIONS' &&
  ambiguous.binding.providerId === null &&
  ambiguous.summary.ambiguousBindingCount === 1 &&
  ambiguous.summary.operationallyReadyBindingCount === 0 &&
  ambiguousAudit.status === 'PASS',
'R127 leaves two compatible candidates ambiguous and blocked');
assert.throws(() => r127
  .createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflight(
    fullContract, fullSource, [declaration, second, declaration]),
/bounded caller-supplied untrusted declarations/,
'R127 enforces the two-declaration ceiling');

const weakened = structuredClone(declaration);
weakened.outputBinding.nativeResolverReceiptSchema =
  weakened.outputBinding.resultEnvelopeSchema;
weakened.executionBoundary.resolverExecutionRequested = true;
weakened.permissionsAndConsent.selfAttestationSufficient = true;
weakened.resourceBudget.maximumRuntimeMs = 300001;
weakened.resourceBudget.maximumRegistryQueriesPerRequest = 9;
weakened.failureAndRecovery.partialProofMayResolveEndpointOrAuthorizeContact =
  true;
weakened.verificationDeclaration.independentIdentityAndAuthorityReceipt = {
  fictional: true
};
weakened.lifecycle.status = 'ACTIVE';
weakened.lifecycle.resolverInstalled = true;
weakened.lifecycle.resolverAvailable = true;
weakened.lifecycle.resolverExecuted = true;
weakened.lifecycle.promoted = true;
weakened.lifecycle.canon = true;
resign(weakened);
const rejected = r127
  .createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflight(
    fullContract, fullSource, [weakened]);
const rejectedAudit = audit
  .auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflight(
    fullContract, rejected, fullCustody, [weakened]);
const rejectedReasons = rejected.assessments[0].reasonCodes;
assert.ok(!r127
    .landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderDeclarationValid(
      weakened, fixture.r126FullBundle) &&
  rejected.binding.assessmentStatus === 'DECLARATION_REJECTED' &&
  ['OUTPUT_BINDING_INVALID', 'EXECUTION_BOUNDARY_INVALID',
    'PERMISSION_BOUNDARY_INVALID', 'RESOURCE_BUDGET_INVALID',
    'FAILURE_RECOVERY_BOUNDARY_INVALID', 'VERIFICATION_BOUNDARY_INVALID',
    'LIFECYCLE_CLAIM_EXCEEDS_DECLARATION'].every(reason =>
    rejectedReasons.includes(reason)) && rejectedAudit.status === 'PASS',
'R127 reconstructs the fail-closed rejection of a weakened declaration');

const overclaim = structuredClone(compatible);
overclaim.binding.operationalReadiness = 'READY';
overclaim.assessments[0].truth.resolverProviderIdentityAuthenticated = true;
overclaim.assessments[0].truth.resolverImplementationIntegrityVerified = true;
overclaim.assessments[0].truth.resolverInstalled = true;
overclaim.assessments[0].truth.resolverAvailable = true;
overclaim.assessments[0].truth.resolverExecuted = true;
overclaim.assessments[0].truth.endpointResolved = true;
overclaim.summary.operationallyReadyBindingCount = 1;
overclaim.summary.resolverInstalledCount = 1;
overclaim.summary.resolverAvailableCount = 1;
overclaim.summary.resolvedEndpointCount = 1;
overclaim.summary.authorizedContactCount = 1;
overclaim.summary.transmittedRequestCount = 1;
overclaim.summary.admissionReady = true;
overclaim.truth.contractCompatibilityMayEstablishResolverIdentity = true;
overclaim.truth.preflightMayExecuteResolver = true;
overclaim.truth.preflightMayResolveEndpointOrRecipient = true;
overclaim.truth.preflightMayTransmitRequest = true;
overclaim.prohibitedConclusions
  .executeResolveContactOrTransmitFromPreflight = false;
overclaim.resolverResult = { fictional: true };
overclaim.transport = { performed: true };
overclaim.historicalSourceOwner = { id: 'fictional-owner' };
overclaim.historicalDebitReceipt = { verified: true };
overclaim.persistence = { performed: true };
overclaim.promotion = { canon: true };
resign(overclaim);
assert.ok(!r127
    .landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflightValid(
      overclaim) && audit
    .auditLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflight(
      fullContract, overclaim, fullCustody, [declaration]).status === 'FAIL',
'R127 rejects re-signed resolver readiness, effect, owner/debit, and canon overclaims');

const producerText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-endpoint-resolver-provider-binding-preflight.mjs'), 'utf8');
const auditText = fs.readFileSync(path.join(root, 'core',
  'matrix-thermal-endpoint-resolver-provider-binding-preflight-audit.mjs'),
'utf8');
assert.ok(!/\bfetch\s*\(|XMLHttpRequest|new\s+WebSocket|node:dns|node:net/.test(
    producerText) && !auditText.includes(
    'createLandMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflight') &&
  !auditText.includes(
    'landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderBindingPreflightValid') &&
  !auditText.includes(
    'landMatrixThermalHistoricalSourceOwnerDebitExternalCapabilityProviderVerificationEndpointResolverProviderDeclarationValid'),
'R127 has no network primitive and its audit calls no R127 builder or validator');
assert.equal(JSON.stringify(fixture), fixtureBefore,
  'R127 leaves exact R126 custody unchanged');

console.log('foundation planet R127 isolated selftest: PASS (9 assertions)');
