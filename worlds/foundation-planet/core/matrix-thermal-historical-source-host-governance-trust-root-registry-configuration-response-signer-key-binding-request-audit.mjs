import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_ROUTE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA,
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CREATE_CAPABILITY_ID,
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-request.mjs?v=0.113.0-r113.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_INTEGRITY_CONTRACT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_ENVELOPE_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNATURE_ASSESSMENT_SCHEMA,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureIntegrityContractReceiptValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseEnvelopeValid,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureAssessmentValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signature-integrity.mjs?v=0.113.0-r113.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_REQUEST_PACKET_SCHEMA,
  HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
  landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestPacketValid
} from './matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-request.mjs?v=0.113.0-r113.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_AUDIT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-request-audit/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PACKET_AUDIT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-request-packet-audit/v1';

const clone = value => JSON.parse(JSON.stringify(value));
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);

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

const noRawKeySignatureOrEndpoint = value => {
  const forbidden = new Set(['publicKeyRaw', 'rawPublicKey', 'signature',
    'signatureBytes', 'endpointUrl', 'bindingEndpoint']);
  const visit = item => {
    if (!item || typeof item !== 'object') return true;
    if (Array.isArray(item)) return item.every(visit);
    return Object.entries(item).every(([key, child]) =>
      !forbidden.has(key) && visit(child));
  };
  return visit(value);
};

function expectedRouteProjection(sourceContract) {
  const projection = sourceContract.configurationResponseSignatureIntegrityRoutes
    .map(route => ({
      sourceRouteId: route.routeId,
      eligible: route
        .eligibleForConfigurationResponseSignatureIntegrityVerification === true
    }));
  const eligible = projection.filter(route => route.eligible).length;
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_ROUTE_SCHEMA,
    sourceRouteProjectionDigest: stableDigest(projection),
    sourceRouteCount: projection.length,
    eligibleRouteCount: eligible,
    authorityReviewRouteExcludedCount: projection.length - eligible
  };
}

function expectedCapabilityBoundary() {
  return {
    implementedResponseSignerKeyBindingRequestCreateCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CREATE_CAPABILITY_ID,
    requiredResponseSignerKeyBindCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BIND_CAPABILITY_ID,
    requiredHostRegistryConfigureCapabilityId:
      HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURE_CAPABILITY_ID,
    sourceSignatureIntegrityVerdict: 'UNKNOWN',
    responseSignerKeyBindingVerdict: 'UNKNOWN',
    hostRegistryConfigurationVerdict: 'UNKNOWN',
    hostGovernanceAdmissionVerdict: 'NOT_AUTHORIZED'
  };
}

export function
auditLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContract(
  receipt, attachedSource) {
  let selectedColumn = null;
  if (attachedSource === undefined && receipt?.kind) {
    const column = receipt;
    selectedColumn = column;
    if (column.kind !== 'land') {
      return {
        id: 'land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-request-contract',
        schema:
          LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_AUDIT_SCHEMA,
        status: 'NOT_APPLICABLE',
        sourceReceiptDigest: null,
        attachedSourceDigest: null,
        checks: {},
        issues: [],
        verdict: 'SELECTED_COLUMN_IS_NOT_LAND'
      };
    }
    receipt = column.land
      ?.matrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractReceipt;
    attachedSource = column.land
      ?.matrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureIntegrityContractReceipt;
    if (!receipt) {
      const checkpoint = column.land
        ?.matrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractMigrationCheckpoint ===
          true;
      return {
        id: 'land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-request-contract',
        schema:
          LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_AUDIT_SCHEMA,
        status: checkpoint ? 'NOT_APPLICABLE' : 'FAIL',
        sourceReceiptDigest: null,
        attachedSourceDigest: attachedSource?.digest || null,
        checks: {},
        issues: checkpoint ? [] : ['missingR113Contract'],
        verdict: checkpoint
          ? 'SOURCE_LINEAGE_LACKS_EXACT_R112_CONTRACT'
          : 'CURRENT_LAND_LINEAGE_MISSING_R113_CONTRACT'
      };
    }
  }
  const expectedProjection = Array.isArray(
    attachedSource?.configurationResponseSignatureIntegrityRoutes)
    ? expectedRouteProjection(attachedSource) : null;
  const checks = {
    receiptDigestValid: digestValid(receipt,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_CONTRACT_RECEIPT_SCHEMA),
    attachedR112ContractValid:
      landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureIntegrityContractReceiptValid(
        attachedSource),
    exactSourceDigestBound: receipt?.source?.schema === attachedSource?.schema &&
      receipt?.source?.receiptDigest === attachedSource?.digest,
    exactRouteProjection: expectedProjection !== null &&
      exact(receipt?.responseSignerKeyBindingRouteProjection,
        expectedProjection),
    routePartitionPreserved:
      receipt?.responseSignerKeyBindingRouteProjection?.sourceRouteCount === 28 &&
      receipt?.responseSignerKeyBindingRouteProjection?.eligibleRouteCount ===
        24 && receipt?.responseSignerKeyBindingRouteProjection
        ?.authorityReviewRouteExcludedCount === 4,
    requestCreationCapabilityOnly:
      exact(receipt?.capabilityBoundary, expectedCapabilityBoundary()),
    authorityBoundariesPreserved:
      receipt?.truth?.callerSuppliedPublicKeyTrusted === false &&
      receipt?.truth?.claimedHostResponderIdentityTrusted === false &&
      receipt?.truth?.responseSignerKeyBound === false &&
      receipt?.truth?.hostRegistryConfigured === false &&
      receipt?.truth?.hostGovernanceAdmissionAuthorized === false &&
      receipt?.truth?.worldMutationPerformed === false,
    noRawKeySignatureOrEndpoint: noRawKeySignatureOrEndpoint(receipt)
  };
  if (selectedColumn) {
    checks.persistenceBound = selectedColumn.land
        ?.matrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContractMigrationCheckpoint ===
          false && selectedColumn.budget
        ?.matrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestContract
        ?.receiptDigest === receipt?.digest;
  }
  const issues = Object.entries(checks)
    .filter(([, value]) => value !== true).map(([name]) => name);
  return {
    id: 'land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-request-contract',
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_AUDIT_SCHEMA,
    status: issues.length === 0 ? 'PASS' : 'FAIL',
    sourceReceiptDigest: receipt?.digest || null,
    attachedSourceDigest: attachedSource?.digest || null,
    checks,
    issues,
    verdict:
      issues.length === 0
        ? 'R113_CONTRACT_EXACT_AND_NON_AUTHORIZING'
        : 'R113_CONTRACT_NOT_PROVEN'
  };
}

export function
auditLandMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignerKeyBindingRequestPacket(
  packet, contract, sourceContract, requestPacket, envelope, assessment) {
  const refsExact = packet?.sourceContract?.receiptDigest === contract?.digest &&
    packet?.sourceResponseSignatureIntegrityContract?.receiptDigest ===
      sourceContract?.digest &&
    packet?.sourceConfigurationRequestPacket?.receiptDigest ===
      requestPacket?.digest &&
    packet?.sourceResponseEnvelope?.receiptDigest === envelope?.digest &&
    packet?.sourceSignatureAssessment?.receiptDigest === assessment?.digest;
  const sourceChainValid =
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureIntegrityContractReceiptValid(
      sourceContract) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationRequestPacketValid(
      requestPacket) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseEnvelopeValid(
      envelope, sourceContract, requestPacket) &&
    landMatrixThermalHistoricalSourceHostGovernanceTrustRootRegistryConfigurationResponseSignatureAssessmentValid(
      assessment);
  const requested = packet?.requestedSignerKeyBinding;
  const checks = {
    packetDigestValid: digestValid(packet,
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PACKET_SCHEMA),
    sourceChainValid,
    exactSourcesBound: refsExact && contract?.source?.receiptDigest ===
      sourceContract?.digest && assessment?.sourceContract?.receiptDigest ===
      sourceContract?.digest &&
      assessment?.sourceConfigurationRequestPacket?.receiptDigest ===
        requestPacket?.digest &&
      assessment?.sourceResponseEnvelope?.receiptDigest === envelope?.digest,
    validSignatureReportedWithoutTrust:
      assessment?.cryptographic?.signatureValid === true &&
      assessment?.verdicts?.signatureIntegrityVerdict === 'PASS' &&
      assessment?.verdicts?.trustedHostSignerKeyBindingVerdict === 'UNKNOWN' &&
      packet?.sourceSignatureAssessment?.sourceVerdict ===
        'REPORTED_PASS_UNTRUSTED' &&
      packet?.verdicts?.sourceSignatureIntegrityVerdict ===
        'REPORTED_PASS_UNTRUSTED',
    exactKeyCommitmentRequested:
      requested?.publicKeySha256 === assessment?.cryptographic?.publicKeySha256 &&
      requested?.bindingScope?.claimedSignerKeyId ===
        envelope?.claimedHostResponder?.claimedSignerKeyId &&
      requested?.rawPublicKeyIncluded === false && requested?.performed === false,
    boundedSourceWindow:
      Number.isFinite(Date.parse(packet?.requestedAt)) &&
      Number.isFinite(Date.parse(packet?.expiresAt)) &&
      Date.parse(packet.requestedAt) >=
        Date.parse(envelope?.claimedHostResponder?.claimedProducedAt) &&
      Date.parse(packet.expiresAt) <= Date.parse(requestPacket?.expiresAt) &&
      Date.parse(packet.expiresAt) > Date.parse(packet.requestedAt) &&
      Date.parse(packet.expiresAt) - Date.parse(packet.requestedAt) <=
        15 * 60 * 1000,
    untransmittedAndUnbound:
      packet?.delivery?.mode ===
        'NOT_TRANSMITTED_NO_HOST_SIGNER_KEY_BINDING_ENDPOINT' &&
      packet?.delivery?.endpoint === null &&
      packet?.verdicts?.responseSignerKeyBindingVerdict === 'UNKNOWN' &&
      packet?.truth?.responseSignerKeyBound === false &&
      packet?.truth?.hostRegistryConfigured === false &&
      packet?.truth?.hostGovernanceAdmissionAuthorized === false &&
      packet?.truth?.persisted === false &&
      packet?.truth?.worldMutationPerformed === false,
    noRawKeySignatureOrEndpoint: noRawKeySignatureOrEndpoint(packet)
  };
  const issues = Object.entries(checks)
    .filter(([, value]) => value !== true).map(([name]) => name);
  return {
    id: 'land-matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-request-packet',
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_HOST_GOVERNANCE_TRUST_ROOT_REGISTRY_CONFIGURATION_RESPONSE_SIGNER_KEY_BINDING_REQUEST_PACKET_AUDIT_SCHEMA,
    status: issues.length === 0 ? 'PASS' : 'FAIL',
    sourcePacketDigest: packet?.digest || null,
    checks,
    issues,
    verdict:
      issues.length === 0
        ? 'TRANSIENT_BINDING_REQUEST_EXACT_UNTRUSTED_AND_NON_AUTHORIZING'
        : 'TRANSIENT_BINDING_REQUEST_NOT_PROVEN'
  };
}
