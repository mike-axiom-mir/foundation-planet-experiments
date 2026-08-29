import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_PACKET_SCHEMA,
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestContractReceiptValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestPacketValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-request.mjs?v=0.112.0-r112.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INTEGRITY_ROUTE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_ENVELOPE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA,
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_VERIFY_CAPABILITY_ID,
  REGISTRY_CONFIGURATION_RESPONSE_MAX_CHARACTERS,
  ED25519_RAW_PUBLIC_KEY_BYTES,
  ED25519_SIGNATURE_BYTES
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signature-integrity.mjs?v=0.112.0-r112.1';

const SIGNATURE_ALGORITHM = 'Ed25519';
const PUBLIC_KEY_FORMAT = 'raw-ed25519-32-byte';
const UNKNOWN = 'UNKNOWN';
const NOT_AUTHORIZED = 'NOT_AUTHORIZED';
const clone = value => JSON.parse(JSON.stringify(value));
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const exactKeys = (value, keys) => value && typeof value === 'object' &&
  !Array.isArray(value) && exact(Object.keys(value).sort(), [...keys].sort());

function stableDigest(value) {
  const text = JSON.stringify(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function digestValid(value, schema) {
  if (value?.schema !== schema || typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

const fnvDigest = value => typeof value === 'string' &&
  /^fnv1a32:[a-f0-9]{8}$/.test(value);
const sha256Digest = value => typeof value === 'string' &&
  /^sha256:[a-f0-9]{64}$/.test(value);
const nonEmptyText = (value, maximum = 4096) =>
  typeof value === 'string' && value.trim().length > 0 &&
    value.length <= maximum;
const isoTimestamp = value =>
  nonEmptyText(value, 64) && Number.isFinite(Date.parse(value));

function expectedRoutes(sourceContract) {
  return sourceContract.registryConfigurationRequestRoutes.map(sourceRoute => {
    const eligible =
      sourceRoute.eligibleForHostRegistryConfigurationRequest === true;
    return {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INTEGRITY_ROUTE_SCHEMA,
      routeId: `configuration-response-signature-integrity:${sourceRoute.routeId}`,
      sourceRegistryConfigurationRequestRouteId: sourceRoute.routeId,
      requestBinding: clone(sourceRoute.requestBinding),
      eligibleForConfigurationResponseSignatureIntegrityVerification: eligible,
      responseEnvelopeSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_ENVELOPE_SCHEMA
        : null,
      signatureInputSchema: eligible
        ? 'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signature-input/v1'
        : null,
      signatureAssessmentSchema: eligible
        ? LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA
        : null,
      implementedSignatureVerificationCapabilityId: eligible
        ? HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_VERIFY_CAPABILITY_ID
        : null,
      requiredHostRegistryConfigureCapabilityId: eligible
        ? HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID : null,
      signatureAlgorithm: eligible ? SIGNATURE_ALGORITHM : null,
      publicKeyFormat: eligible ? PUBLIC_KEY_FORMAT : null,
      maximumCanonicalResponseCharacters: eligible
        ? REGISTRY_CONFIGURATION_RESPONSE_MAX_CHARACTERS : 0,
      responseEnvelope: null,
      signatureAssessment: null,
      signatureIntegrityVerdict: eligible ? UNKNOWN : null,
      trustedHostSignerKeyVerdict: eligible ? UNKNOWN : null,
      hostResponderIdentityTrustVerdict: eligible ? UNKNOWN : null,
      hostRegistryConfigurationVerdict: eligible ? UNKNOWN : null,
      hostRegistryOriginAuthenticationVerdict: eligible ? UNKNOWN : null,
      hostGovernanceAdmissionVerdict: eligible ? NOT_AUTHORIZED : null
    };
  });
}

function expectedSummary(routes) {
  const eligible = routes.filter(route =>
    route.eligibleForConfigurationResponseSignatureIntegrityVerification).length;
  return {
    sourceR111ConfigurationRequestContractCount: 1,
    configurationResponseSignatureIntegrityRouteCount: routes.length,
    configurationResponseSignatureIntegrityEligibleRouteCount: eligible,
    authorityReviewRouteExcludedCount: routes.length - eligible,
    implementedSignatureVerificationRouteCount: eligible,
    configurationResponseEnvelopeCount: 0,
    signatureAssessmentCount: 0,
    signatureIntegrityPassCount: 0,
    trustedHostSignerKeyCount: 0,
    authenticatedHostResponderCount: 0,
    configuredHostRegistryCount: 0,
    configuredTrustRootCount: 0,
    persistedConfigurationResponseCount: 0,
    responseEnvelopeValidationImplemented: true,
    detachedSignatureVerificationImplemented: true,
    trustedHostSignerKeyBindingImplemented: false,
    hostResponderIdentityAuthenticationImplemented: false,
    hostRegistryConfigurationImplemented: false,
    candidateAdmissionPathImplemented: false
  };
}

const expectedContractTruth = {
  exactR111ConfigurationRequestContractBound: true,
  allTwentyEightRoutesPreserved: true,
  twentyFourConfigurationResponseIntegrityRoutesDeclared: true,
  fourAuthorityReviewRoutesExcluded: true,
  exactR111ConfigurationRequestPacketRequired: true,
  responseEnvelopeValidationImplemented: true,
  detachedEd25519SignatureVerificationImplemented: true,
  callerSuppliedRawPublicKeyOnly: true,
  signatureIntegrityPassMeansSuppliedKeyMatchOnly: true,
  trustedHostSignerKeyBindingImplemented: false,
  callerSuppliedPublicKeyTrusted: false,
  claimedHostResponderIdentityTrusted: false,
  hostRegistryConfigurationCapabilityRequired: true,
  hostRegistryConfigured: false,
  hostRegistryOriginAuthenticated: false,
  hostGovernanceTrustRootResolved: false,
  policyKeyDelegationVerified: false,
  hostGovernanceAdmissionAuthorized: false,
  receiptSignerKeyBound: false,
  provisioningReceiptVerified: false,
  hostTrustAnchorProvisioned: false,
  configurationResponseEndpointDeclared: false,
  configurationResponseTransportImplemented: false,
  configurationResponseEnvelopePersisted: false,
  callerSuppliedPublicKeyBytesPersisted: false,
  signatureBytesPersisted: false,
  signatureAssessmentPersisted: false,
  hostRegistryPersistedInWorldState: false,
  rawTrustRootPublicKeysPersisted: false,
  rawPolicyPublicKeysPersisted: false,
  replayLedgerImplemented: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  worldMutationPerformed: false,
  heatTransferPerformed: false,
  historicalHeatReconstructed: false,
  absoluteThermodynamicEnergyClaimed: false,
  scientificCalibrationClaimed: false
};

function contractResult(status, detail) {
  return {
    id: 'land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signature-integrity-contract',
    required: true,
    status,
    statement: 'Exact R111 routes gain detached configuration-response signature integrity under a caller-supplied untrusted key while host origin, registry configuration, downstream authority, persistence, and mutation remain absent.',
    detail
  };
}

export function
auditLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureIntegrityContract(
  column) {
  if (column?.kind !== 'land') {
    return contractResult('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land
    ?.matrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureIntegrityContractReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureIntegrityContractMigrationCheckpoint ===
        true;
    return contractResult(checkpoint ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'the source lineage does not retain an exact R111 configuration-request contract'
        : 'a current loaded-land lineage is missing its R112 response-signature-integrity contract'
    });
  }
  const attachedSource = column.land
    ?.matrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestContractReceipt;
  const sourceIntegrity =
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestContractReceiptValid(
      attachedSource) &&
    receipt.source?.schema === attachedSource?.schema &&
    receipt.source?.receiptDigest === attachedSource?.digest;
  const routes = sourceIntegrity ? expectedRoutes(attachedSource) : [];
  const routesExact = sourceIntegrity &&
    exact(receipt.configurationResponseSignatureIntegrityRoutes, routes);
  const summaryExact = routesExact &&
    exact(receipt.summary, expectedSummary(routes));
  const routeBoundaryIntact =
    receipt.configurationResponseSignatureIntegrityRoutes?.length === 28 &&
    receipt.configurationResponseSignatureIntegrityRoutes.filter(route =>
      route.eligibleForConfigurationResponseSignatureIntegrityVerification)
      .length === 24 &&
    receipt.configurationResponseSignatureIntegrityRoutes.filter(route =>
      !route.eligibleForConfigurationResponseSignatureIntegrityVerification)
      .length === 4;
  const capabilityBoundaryIntact =
    receipt.configurationResponseSignatureIntegrityRoutes?.every(route =>
      route.eligibleForConfigurationResponseSignatureIntegrityVerification
        ? route.implementedSignatureVerificationCapabilityId ===
            HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_VERIFY_CAPABILITY_ID &&
          route.requiredHostRegistryConfigureCapabilityId ===
            HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID &&
          route.signatureIntegrityVerdict === UNKNOWN &&
          route.trustedHostSignerKeyVerdict === UNKNOWN &&
          route.hostResponderIdentityTrustVerdict === UNKNOWN &&
          route.hostRegistryConfigurationVerdict === UNKNOWN &&
          route.hostRegistryOriginAuthenticationVerdict === UNKNOWN &&
          route.hostGovernanceAdmissionVerdict === NOT_AUTHORIZED
        : route.implementedSignatureVerificationCapabilityId === null &&
          route.requiredHostRegistryConfigureCapabilityId === null &&
          route.signatureIntegrityVerdict === null &&
          route.trustedHostSignerKeyVerdict === null &&
          route.hostResponderIdentityTrustVerdict === null &&
          route.hostRegistryConfigurationVerdict === null &&
          route.hostRegistryOriginAuthenticationVerdict === null &&
          route.hostGovernanceAdmissionVerdict === null) === true;
  const persistenceBound = column.land
      ?.matrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureIntegrityContractMigrationCheckpoint ===
        false && column.budget
      ?.matrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureIntegrityContract
      ?.digest === receipt.digest;
  const structuralValid = digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA) &&
    exactKeys(receipt, ['schema', 'status', 'creationContext', 'source',
      'configurationResponseSignatureIntegrityRoutes', 'summary', 'emission',
      'truth', 'digest']) &&
    receipt.status ===
      'CONFIGURATION_RESPONSE_SIGNATURE_INTEGRITY_AVAILABLE_WITH_CALLER_SUPPLIED_UNTRUSTED_KEY_WITHOUT_REGISTRY_CONFIGURATION_OR_AUTHORITY_EFFECTS' &&
    sourceIntegrity &&
    exact(receipt.creationContext, attachedSource?.creationContext) &&
    routesExact && summaryExact &&
    ['native-from-intact-r111-configuration-request-contract',
      'migration-from-exact-retained-r111-configuration-request-contract']
      .includes(receipt.emission?.mode) &&
    receipt.emission
      ?.sourceWasExactRetainedR111ConfigurationRequestContractMigration ===
        receipt.emission?.mode.startsWith('migration-');
  const truthValid = exact(receipt.truth, expectedContractTruth);
  const valid = structuralValid && routeBoundaryIntact &&
    capabilityBoundaryIntact && truthValid && persistenceBound;
  return contractResult(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt.schema || null,
    structuralValid,
    sourceIntegrity,
    routesExact,
    summaryExact,
    routeBoundaryIntact,
    capabilityBoundaryIntact,
    truthValid,
    persistenceBound,
    routeCount:
      receipt.summary?.configurationResponseSignatureIntegrityRouteCount ?? null,
    eligibleRouteCount:
      receipt.summary
        ?.configurationResponseSignatureIntegrityEligibleRouteCount ?? null,
    configuredHostRegistryCount:
      receipt.summary?.configuredHostRegistryCount ?? null,
    trustedHostSignerKeyCount:
      receipt.summary?.trustedHostSignerKeyCount ?? null,
    emissionMode: receipt.emission?.mode || null,
    sourceR111ConfigurationRequestContractDigest:
      receipt.source?.receiptDigest || null,
    receiptDigest: receipt.digest || null
  });
}

const expectedEnvelopeTruth = {
  exactR112SignatureIntegrityContractBound: true,
  exactR111ConfigurationRequestPacketBound: true,
  requestConfigurationTargetPreserved: true,
  responseEnvelopeCallerSupplied: true,
  responseEnvelopeHostAuthenticated: false,
  responseEnvelopeSignatureVerified: false,
  callerSuppliedPublicKeyTrusted: false,
  claimedHostResponderIdentityTrusted: false,
  hostRegistryConfigured: false,
  hostRegistryOriginAuthenticated: false,
  hostGovernanceTrustRootResolved: false,
  policyKeyDelegationVerified: false,
  hostGovernanceAdmissionAuthorized: false,
  receiptSignerKeyBound: false,
  provisioningReceiptVerified: false,
  hostTrustAnchorProvisioned: false,
  responseEnvelopePersisted: false,
  worldMutationPerformed: false
};

const expectedAssessmentTruth = signatureValid => ({
  exactR112SignatureIntegrityContractBound: true,
  exactR111ConfigurationRequestPacketBound: true,
  exactConfigurationResponseEnvelopeBound: true,
  detachedEd25519SignatureVerificationPerformed: true,
  signatureIntegrityVerified: signatureValid,
  signatureIntegrityPassMeansSuppliedKeyMatchOnly: true,
  callerSuppliedPublicKeyTrusted: false,
  claimedHostResponderIdentityTrusted: false,
  hostRegistryConfigured: false,
  hostRegistryOriginAuthenticated: false,
  hostGovernanceTrustRootResolved: false,
  policyKeyDelegationVerified: false,
  hostGovernanceAdmissionAuthorized: false,
  receiptSignerKeyBound: false,
  provisioningReceiptVerified: false,
  hostTrustAnchorProvisioned: false,
  publicKeyBytesPersisted: false,
  signatureBytesPersisted: false,
  responseEnvelopePersisted: false,
  signatureAssessmentPersisted: false,
  configurationDecisionPersisted: false,
  historicalPhysicalSourceOwnersResolved: false,
  historicalPhysicalSourceOwnersDebited: false,
  worldMutationPerformed: false
});

function bytesToHex(bytes) {
  return [...bytes].map(value => value.toString(16).padStart(2, '0')).join('');
}

async function sha256ForBytes(bytes) {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return `sha256:${bytesToHex(new Uint8Array(digest))}`;
}

function transientResult(status, detail) {
  return {
    id: 'land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signature-integrity-assessment',
    required: true,
    status,
    statement: 'The independent transient audit repeats detached Ed25519 verification and confirms that even a valid signature confers no host identity, registry configuration, authority, persistence, or mutation.',
    detail
  };
}

export async function
auditLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureAssessment(
  contract, requestPacket, envelope, signatureInput, assessment) {
  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    return transientResult('FAIL', { reason: 'Web Crypto SubtleCrypto is unavailable' });
  }
  const sourcesExact =
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestPacketValid(
      requestPacket) &&
    contract?.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA &&
    fnvDigest(contract?.digest) &&
    contract?.source?.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_CONTRACT_RECEIPT_SCHEMA &&
    contract?.source?.receiptDigest === requestPacket?.sourceContract?.receiptDigest &&
    envelope?.sourceContract?.receiptDigest === contract?.digest &&
    envelope?.sourceConfigurationRequestPacket?.receiptDigest ===
      requestPacket?.digest &&
    signatureInput?.responseEnvelopeDigest === envelope?.digest &&
    assessment?.sourceContract?.receiptDigest === contract?.digest &&
    assessment?.sourceConfigurationRequestPacket?.receiptDigest ===
      requestPacket?.digest &&
    assessment?.sourceResponseEnvelope?.receiptDigest === envelope?.digest;
  const envelopeStructural = digestValid(envelope,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_ENVELOPE_SCHEMA) &&
    envelope.status ===
      'CALLER_SUPPLIED_UNAUTHENTICATED_HOST_REGISTRY_CONFIGURATION_RESPONSE' &&
    exact(envelope.truth, expectedEnvelopeTruth) &&
    JSON.stringify(envelope).length <=
      REGISTRY_CONFIGURATION_RESPONSE_MAX_CHARACTERS &&
    envelope.configuration?.configurationOrigin ===
      'CALLER_SUPPLIED_UNAUTHENTICATED_HOST_CONFIGURATION' &&
    envelope.configuration?.governanceDomainId ===
      requestPacket?.hostGovernanceTarget?.claimedGovernanceDomainId &&
    envelope.configuration?.worldId ===
      requestPacket?.hostGovernanceTarget?.worldId &&
    envelope.configuration?.lineageId ===
      requestPacket?.hostGovernanceTarget?.lineageId &&
    isoTimestamp(envelope.claimedHostResponder?.claimedProducedAt) &&
    Date.parse(envelope.claimedHostResponder.claimedProducedAt) >=
      Date.parse(requestPacket?.requestedAt) &&
    Date.parse(envelope.claimedHostResponder.claimedProducedAt) <=
      Date.parse(requestPacket?.expiresAt);
  const byteInputsValid = signatureInput?.publicKeyFormat === PUBLIC_KEY_FORMAT &&
    signatureInput.publicKeyRaw instanceof Uint8Array &&
    signatureInput.publicKeyRaw.byteLength === ED25519_RAW_PUBLIC_KEY_BYTES &&
    signatureInput.signature instanceof Uint8Array &&
    signatureInput.signature.byteLength === ED25519_SIGNATURE_BYTES;
  let independentlyVerifiedSignature = false;
  if (sourcesExact && envelopeStructural && byteInputsValid) {
    const publicKey = await subtle.importKey('raw', signatureInput.publicKeyRaw,
      { name: SIGNATURE_ALGORITHM }, false, ['verify']);
    independentlyVerifiedSignature = await subtle.verify(
      { name: SIGNATURE_ALGORITHM }, publicKey, signatureInput.signature,
      new TextEncoder().encode(JSON.stringify(envelope)));
  }
  const assessmentStructural = digestValid(assessment,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA) &&
    assessment.cryptographic?.signatureAlgorithm === SIGNATURE_ALGORITHM &&
    assessment.cryptographic?.publicKeyFormat === PUBLIC_KEY_FORMAT &&
    assessment.cryptographic?.publicKeyByteLength ===
      ED25519_RAW_PUBLIC_KEY_BYTES &&
    assessment.cryptographic?.signatureByteLength === ED25519_SIGNATURE_BYTES &&
    sha256Digest(assessment.cryptographic?.publicKeySha256) &&
    sha256Digest(assessment.cryptographic?.signatureSha256) &&
    assessment.cryptographic?.publicKeySha256 ===
      await sha256ForBytes(signatureInput.publicKeyRaw) &&
    assessment.cryptographic?.signatureSha256 ===
      await sha256ForBytes(signatureInput.signature) &&
    assessment.cryptographic?.signatureValid === independentlyVerifiedSignature &&
    assessment.status === (independentlyVerifiedSignature
      ? 'REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_VALID_WITH_UNTRUSTED_CALLER_SUPPLIED_KEY'
      : 'REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INVALID') &&
    assessment.verdicts?.responseEnvelopeStructuralVerdict === 'PASS' &&
    assessment.verdicts?.signatureIntegrityVerdict ===
      (independentlyVerifiedSignature ? 'PASS' : 'FAIL') &&
    assessment.verdicts?.trustedHostSignerKeyBindingVerdict === UNKNOWN &&
    assessment.verdicts?.hostResponderIdentityTrustVerdict === UNKNOWN &&
    assessment.verdicts?.hostRegistryConfigurationVerdict === UNKNOWN &&
    assessment.verdicts?.hostRegistryOriginAuthenticationVerdict === UNKNOWN &&
    assessment.verdicts?.hostGovernanceTrustRootResolutionVerdict === UNKNOWN &&
    assessment.verdicts?.policyKeyDelegationVerificationVerdict === UNKNOWN &&
    assessment.verdicts?.hostGovernanceAdmissionVerdict === NOT_AUTHORIZED &&
    exact(assessment.issues, independentlyVerifiedSignature
      ? [] : ['detached-signature-invalid']) &&
    exact(assessment.truth,
      expectedAssessmentTruth(independentlyVerifiedSignature));
  const valid = sourcesExact && envelopeStructural && byteInputsValid &&
    assessmentStructural;
  return transientResult(valid ? 'PASS' : 'FAIL', {
    sourcesExact,
    envelopeStructural,
    byteInputsValid,
    assessmentStructural,
    independentlyVerifiedSignature,
    trustedHostSignerKeyVerdict:
      assessment?.verdicts?.trustedHostSignerKeyBindingVerdict ?? null,
    hostResponderIdentityTrustVerdict:
      assessment?.verdicts?.hostResponderIdentityTrustVerdict ?? null,
    hostRegistryConfigurationVerdict:
      assessment?.verdicts?.hostRegistryConfigurationVerdict ?? null,
    hostGovernanceAdmissionVerdict:
      assessment?.verdicts?.hostGovernanceAdmissionVerdict ?? null,
    assessmentDigest: assessment?.digest || null
  });
}
