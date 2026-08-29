import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_READINESS_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_READINESS_RECORD_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ACQUISITION_REQUEST_SCHEMA
} from './matrix-thermal-historical-source-evidence-readiness.mjs?v=0.98.0-r98.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_INVENTORY_RECEIPT_SCHEMA,
  HISTORICAL_SOURCE_REQUIREMENTS_BOUNDARY_KEYS,
  landMatrixThermalHistoricalSourceRequirementsInventoryReceiptValid
} from './matrix-thermal-historical-source-requirements-inventory.mjs?v=0.98.0-r98.1';

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

function digestValid(receipt) {
  if (receipt?.schema !==
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_READINESS_RECEIPT_SCHEMA ||
      typeof receipt.digest !== 'string') return false;
  const unsigned = clone(receipt);
  delete unsigned.digest;
  return stableDigest(unsigned) === receipt.digest;
}

const IDS = Object.freeze({
  preEndowmentSourceState:
    'foundation-planet.matrix-thermal.historical-source-owner.pre-endowment-state-evidence/v1',
  independentIdentityAndScope:
    'foundation-planet.matrix-thermal.historical-source-owner.identity-and-physical-scope-evidence/v1',
  energyCoordinateAndUnits:
    'foundation-planet.matrix-thermal.historical-source-owner.energy-coordinate-and-units-evidence/v1',
  senderPrePostDebitState:
    'foundation-planet.matrix-thermal.historical-source-owner.sender-pre-post-debit-state-evidence/v1',
  matrixReceiverAllocation:
    'foundation-planet.matrix-thermal.historical-source-owner.three-matrix-receiver-allocation-evidence/v1',
  counterpartReceiverCredit:
    'foundation-planet.matrix-thermal.historical-source-owner.configured-counterpart-receiver-credit-evidence/v1',
  matrixTransferClosure:
    'foundation-planet.matrix-thermal.historical-source-owner.sender-three-receiver-closure-evidence/v1',
  counterpartTransferClosure:
    'foundation-planet.matrix-thermal.historical-source-owner.sender-receiver-closure-evidence/v1',
  physicalMeaningReview:
    'foundation-planet.matrix-thermal.historical-source-owner.physical-meaning-review-authority/v1'
});

function capability(boundaryKey, criterionKey) {
  const shared = {
    sourceOwnerStateBeforeEndowmentBound: [
      IDS.preEndowmentSourceState, 'persistence',
      'typed persistent source-owner state preceding configured endowment',
      'EVIDENCE'
    ],
    independentSourceIdentityAndPhysicalScopeBound: [
      IDS.independentIdentityAndScope, 'static structure',
      'independent source-owner identity and physical-scope declaration',
      'EVIDENCE'
    ],
    independentSourceIdentityAndScopeBound: [
      IDS.independentIdentityAndScope, 'static structure',
      'independent source-owner identity and physical-scope declaration',
      'EVIDENCE'
    ],
    compatibleEnergyCoordinateAndUnitsBound: [
      IDS.energyCoordinateAndUnits, 'static structure',
      'compatible energy-coordinate and units mapping', 'EVIDENCE'
    ],
    senderDebitPreAndPostOwnerStatesBound: [
      IDS.senderPrePostDebitState, 'persistence',
      'typed sender state immediately before and after historical debit',
      'EVIDENCE'
    ],
    physicalMeaningAuthorityReviewed: [
      IDS.physicalMeaningReview, 'taste or meaning',
      'declared Mike Tobi or AXM review of proposed physical meaning',
      'AUTHORITY'
    ]
  };
  if (shared[criterionKey]) return shared[criterionKey];
  const matrix = boundaryKey ===
    HISTORICAL_SOURCE_REQUIREMENTS_BOUNDARY_KEYS[0];
  if (matrix &&
      criterionKey === 'debitReceiverAllocationAcrossThreeMatrixOwnersBound') {
    return [IDS.matrixReceiverAllocation, 'transport',
      'receiver allocation bound to all three exact R90 matrix owners',
      'EVIDENCE'];
  }
  if (matrix &&
      criterionKey === 'senderDebitAndThreeReceiverCreditsClosureBound') {
    return [IDS.matrixTransferClosure, 'transport',
      'sender debit and three receiver-credit closure receipt', 'EVIDENCE'];
  }
  if (!matrix && criterionKey === 'debitReceiverConfiguredOwnerBound') {
    return [IDS.counterpartReceiverCredit, 'transport',
      'receiver credit bound to the exact configured counterpart owner',
      'EVIDENCE'];
  }
  if (!matrix &&
      criterionKey === 'senderDebitAndReceiverCreditClosureBound') {
    return [IDS.counterpartTransferClosure, 'transport',
      'sender-debit and configured-owner receiver-credit closure receipt',
      'EVIDENCE'];
  }
  return null;
}

function expectedRecords(inventory) {
  const records = [];
  for (const boundary of inventory.boundaries || []) {
    for (let requirementIndex = 0;
      requirementIndex < (boundary.requirements || []).length;
      requirementIndex++) {
      const requirement = boundary.requirements[requirementIndex];
      const requirementKey = boundary.boundaryKey ===
          HISTORICAL_SOURCE_REQUIREMENTS_BOUNDARY_KEYS[0]
        ? 'matrixEndowmentBundle'
        : requirement.ownerKey || `counterpartRequirement${requirementIndex}`;
      const acquisitionRequests = [];
      const entries = Object.entries(requirement.admissionCriteria || {});
      for (let criterionIndex = 0;
        criterionIndex < entries.length; criterionIndex++) {
        const [criterionKey, criterionSatisfied] = entries[criterionIndex];
        const route = capability(boundary.boundaryKey, criterionKey);
        if (criterionSatisfied !== false || !route) return null;
        acquisitionRequests.push({
          schema:
            LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ACQUISITION_REQUEST_SCHEMA,
          requestId:
            `${boundary.boundaryKey}:${requirementKey}:${criterionKey}`,
          criterionKey,
          missingEvidence: requirement.missingEvidence?.[criterionIndex],
          capabilityId: route[0],
          gapType: route[3],
          status: 'MISSING',
          nativeEvidenceKind: route[1],
          expectedArtifactKind: route[2],
          observedEvidence: null,
          verificationVerdict: 'UNKNOWN',
          satisfiesAdmissionCriterion: false,
          admissionAuthorityGranted: false
        });
      }
      records.push({
        schema:
          LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_READINESS_RECORD_SCHEMA,
        readinessRecordId:
          `${boundary.boundaryKey}:${requirementKey}`,
        boundaryKey: boundary.boundaryKey,
        requirementKey,
        requirementIndex,
        requirementShape: boundary.requirementShape,
        cardinalitySemantics: clone(boundary.cardinalitySemantics),
        requirementBinding: {
          inventoryReceiptDigest: inventory.digest,
          sourceRequirementsSchema: boundary.sourceRequirements?.schema,
          sourceRequirementsReceiptDigest:
            boundary.sourceRequirements?.receiptDigest,
          requirementContentDigest: stableDigest(requirement)
        },
        configuredOwnerReferenceKeys:
          clone(boundary.configuredOwnerReferenceKeys),
        capabilityRoute: 'BLOCKED',
        readinessStatus: 'NOT_READY',
        acquisitionRequests,
        candidatePackage: null,
        physicalMeaningReviewDecision: null,
        requirementResolutionStatus: 'UNRESOLVED'
      });
    }
  }
  return records;
}

function expectedSummary(records) {
  const requests = records.flatMap(record => record.acquisitionRequests);
  return {
    sourceInventoryCount: 1,
    sourceBoundaryCount: 2,
    configuredOwnerReferenceCount: 6,
    requirementRecordCount: 4,
    acquisitionRequestCount: 28,
    uniqueCapabilityIdCount:
      new Set(requests.map(request => request.capabilityId)).size,
    missingEvidenceGapCount:
      requests.filter(request => request.gapType === 'EVIDENCE').length,
    missingAuthorityGapCount:
      requests.filter(request => request.gapType === 'AUTHORITY').length,
    observedEvidenceCount: 0,
    verifiedEvidenceCount: 0,
    grantedAuthorityCount: 0,
    candidatePackageCount: 0,
    admissionReadyRequirementCount: 0,
    unresolvedRequirementCount: 4,
    capabilityRoute: 'BLOCKED',
    readinessStatus: 'NOT_READY'
  };
}

function result(status, detail) {
  return {
    id: 'land-matrix-thermal-historical-source-evidence-readiness',
    required: true,
    status,
    statement: 'Every exact R97 requirement is mapped to explicit missing evidence or authority capabilities without admitting a candidate, resolving cardinality, or claiming physical funding.',
    detail
  };
}

export function auditLandMatrixThermalHistoricalSourceEvidenceReadiness(
  column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land
    ?.matrixThermalHistoricalSourceEvidenceReadinessReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalHistoricalSourceEvidenceReadinessMigrationCheckpoint ===
        true;
    return result(checkpoint ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'the source lineage does not retain an exact R97 requirements inventory'
        : 'a current loaded-land lineage is missing its R98 evidence-readiness matrix'
    });
  }
  const inventory = receipt.sourceInventory;
  const attachedInventory = column.land
    ?.matrixThermalHistoricalSourceRequirementsInventoryReceipt;
  const sourceIntegrity =
    landMatrixThermalHistoricalSourceRequirementsInventoryReceiptValid(
      inventory) && exact(inventory, attachedInventory) &&
    receipt.source?.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_INVENTORY_RECEIPT_SCHEMA &&
    receipt.source?.receiptDigest === inventory?.digest;
  const expected = sourceIntegrity ? expectedRecords(inventory) : null;
  const recordsExact = expected != null &&
    exact(receipt.readinessRecords, expected);
  const summaryExact = recordsExact &&
    exact(receipt.summary, expectedSummary(expected));
  const requests = Array.isArray(receipt.readinessRecords)
    ? receipt.readinessRecords.flatMap(record =>
      Array.isArray(record.acquisitionRequests)
        ? record.acquisitionRequests : []) : [];
  const readinessBoundaryIntact =
    receipt.readinessRecords?.length === 4 && requests.length === 28 &&
    receipt.readinessRecords.every(record =>
      record.capabilityRoute === 'BLOCKED' &&
      record.readinessStatus === 'NOT_READY' &&
      record.candidatePackage === null &&
      record.physicalMeaningReviewDecision === null &&
      record.requirementResolutionStatus === 'UNRESOLVED') &&
    requests.every(request =>
      request.status === 'MISSING' && request.observedEvidence === null &&
      request.verificationVerdict === 'UNKNOWN' &&
      request.satisfiesAdmissionCriterion === false &&
      request.admissionAuthorityGranted === false);
  const truthValid =
    receipt.truth?.exactR97InventoryBound === true &&
    receipt.truth?.criterionToCapabilityMappingExact === true &&
    receipt.truth?.asymmetricRequirementSemanticsPreserved === true &&
    receipt.truth?.externalEvidenceAcquisitionRequired === true &&
    receipt.truth?.physicalMeaningReviewAuthorityRequired === true &&
    receipt.truth?.historicalPhysicalSourceOwnerCandidatesProvided === false &&
    receipt.truth?.historicalSourceOwnerDebitReceiptsProvided === false &&
    receipt.truth?.historicalPhysicalSourceOwnersResolved === false &&
    receipt.truth?.historicalPhysicalSourceOwnersDebited === false &&
    receipt.truth?.candidateAdmissionPathImplemented === false &&
    receipt.truth?.admissionAuthorityGranted === false &&
    receipt.truth?.allRequirementsOutstanding === true &&
    receipt.truth?.crossBoundaryCardinalityInferencePerformed === false &&
    receipt.truth?.ownerMutationPerformed === false &&
    receipt.truth?.heatTransferPerformed === false &&
    receipt.truth?.historicalHeatReconstructed === false &&
    receipt.truth?.combinedSixOwnerGraphClaimed === false &&
    receipt.truth?.absoluteThermodynamicEnergyClaimed === false &&
    receipt.truth?.resolvedConductionClaimed === false &&
    receipt.truth?.geothermalForcingModeled === false &&
    receipt.truth?.scientificCalibrationClaimed === false &&
    receipt.truth?.globalUnloadedBoundaryClaimed === false;
  const persistenceBound = column.land
      ?.matrixThermalHistoricalSourceEvidenceReadinessMigrationCheckpoint ===
        false &&
    column.budget?.matrixThermalHistoricalSourceEvidenceReadiness?.digest ===
      receipt.digest;
  const structuralValid = digestValid(receipt) && sourceIntegrity &&
    exact(receipt.creationContext, inventory?.creationContext) &&
    recordsExact && summaryExact &&
    ['native-from-intact-r97-requirements-inventory',
      'migration-from-exact-retained-r97-requirements-inventory']
      .includes(receipt.emission?.mode) &&
    receipt.emission?.sourceWasExactRetainedEvidenceMigration ===
      receipt.emission?.mode.startsWith('migration-');
  const valid = structuralValid && readinessBoundaryIntact && truthValid &&
    persistenceBound;
  return result(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt.schema || null,
    structuralValid,
    sourceIntegrity,
    recordsExact,
    summaryExact,
    readinessBoundaryIntact,
    truthValid,
    persistenceBound,
    requirementRecordCount: receipt.summary?.requirementRecordCount ?? null,
    acquisitionRequestCount: receipt.summary?.acquisitionRequestCount ?? null,
    uniqueCapabilityIdCount:
      receipt.summary?.uniqueCapabilityIdCount ?? null,
    missingEvidenceGapCount:
      receipt.summary?.missingEvidenceGapCount ?? null,
    missingAuthorityGapCount:
      receipt.summary?.missingAuthorityGapCount ?? null,
    candidatePackageCount: receipt.summary?.candidatePackageCount ?? null,
    admissionReadyRequirementCount:
      receipt.summary?.admissionReadyRequirementCount ?? null,
    capabilityRoute: receipt.summary?.capabilityRoute ?? null,
    readinessStatus: receipt.summary?.readinessStatus ?? null
  });
}
