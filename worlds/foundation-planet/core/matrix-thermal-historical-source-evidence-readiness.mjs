import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_INVENTORY_RECEIPT_SCHEMA,
  HISTORICAL_SOURCE_REQUIREMENTS_BOUNDARY_KEYS,
  landMatrixThermalHistoricalSourceRequirementsInventoryReceiptValid
} from './matrix-thermal-historical-source-requirements-inventory.mjs?v=0.98.0-r98.1';

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_READINESS_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-evidence-readiness-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_READINESS_RECORD_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-evidence-readiness-record/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ACQUISITION_REQUEST_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-evidence-acquisition-request/v1';

export const HISTORICAL_SOURCE_EVIDENCE_CAPABILITY_IDS = Object.freeze({
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

const NATIVE_EMISSION_MODE =
  'native-from-intact-r97-requirements-inventory';
const MIGRATION_EMISSION_MODE =
  'migration-from-exact-retained-r97-requirements-inventory';
const CAPABILITY_ROUTE = 'BLOCKED';
const READINESS_STATUS = 'NOT_READY';
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

function digestValid(value) {
  if (value?.schema !==
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_READINESS_RECEIPT_SCHEMA ||
      typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function capabilityFor(boundaryKey, criterionKey) {
  const common = {
    sourceOwnerStateBeforeEndowmentBound: {
      capabilityId: HISTORICAL_SOURCE_EVIDENCE_CAPABILITY_IDS
        .preEndowmentSourceState,
      nativeEvidenceKind: 'persistence',
      expectedArtifactKind:
        'typed persistent source-owner state preceding configured endowment'
    },
    independentSourceIdentityAndPhysicalScopeBound: {
      capabilityId: HISTORICAL_SOURCE_EVIDENCE_CAPABILITY_IDS
        .independentIdentityAndScope,
      nativeEvidenceKind: 'static structure',
      expectedArtifactKind:
        'independent source-owner identity and physical-scope declaration'
    },
    independentSourceIdentityAndScopeBound: {
      capabilityId: HISTORICAL_SOURCE_EVIDENCE_CAPABILITY_IDS
        .independentIdentityAndScope,
      nativeEvidenceKind: 'static structure',
      expectedArtifactKind:
        'independent source-owner identity and physical-scope declaration'
    },
    compatibleEnergyCoordinateAndUnitsBound: {
      capabilityId: HISTORICAL_SOURCE_EVIDENCE_CAPABILITY_IDS
        .energyCoordinateAndUnits,
      nativeEvidenceKind: 'static structure',
      expectedArtifactKind:
        'compatible energy-coordinate and units mapping'
    },
    senderDebitPreAndPostOwnerStatesBound: {
      capabilityId: HISTORICAL_SOURCE_EVIDENCE_CAPABILITY_IDS
        .senderPrePostDebitState,
      nativeEvidenceKind: 'persistence',
      expectedArtifactKind:
        'typed sender state immediately before and after historical debit'
    },
    physicalMeaningAuthorityReviewed: {
      capabilityId: HISTORICAL_SOURCE_EVIDENCE_CAPABILITY_IDS
        .physicalMeaningReview,
      nativeEvidenceKind: 'taste or meaning',
      expectedArtifactKind:
        'declared Mike Tobi or AXM review of proposed physical meaning',
      gapType: 'AUTHORITY'
    }
  };
  if (common[criterionKey]) return common[criterionKey];
  if (boundaryKey === HISTORICAL_SOURCE_REQUIREMENTS_BOUNDARY_KEYS[0] &&
      criterionKey === 'debitReceiverAllocationAcrossThreeMatrixOwnersBound') {
    return {
      capabilityId: HISTORICAL_SOURCE_EVIDENCE_CAPABILITY_IDS
        .matrixReceiverAllocation,
      nativeEvidenceKind: 'transport',
      expectedArtifactKind:
        'receiver allocation bound to all three exact R90 matrix owners'
    };
  }
  if (boundaryKey === HISTORICAL_SOURCE_REQUIREMENTS_BOUNDARY_KEYS[0] &&
      criterionKey === 'senderDebitAndThreeReceiverCreditsClosureBound') {
    return {
      capabilityId: HISTORICAL_SOURCE_EVIDENCE_CAPABILITY_IDS
        .matrixTransferClosure,
      nativeEvidenceKind: 'transport',
      expectedArtifactKind:
        'sender debit and three receiver-credit closure receipt'
    };
  }
  if (boundaryKey === HISTORICAL_SOURCE_REQUIREMENTS_BOUNDARY_KEYS[1] &&
      criterionKey === 'debitReceiverConfiguredOwnerBound') {
    return {
      capabilityId: HISTORICAL_SOURCE_EVIDENCE_CAPABILITY_IDS
        .counterpartReceiverCredit,
      nativeEvidenceKind: 'transport',
      expectedArtifactKind:
        'receiver credit bound to the exact configured counterpart owner'
    };
  }
  if (boundaryKey === HISTORICAL_SOURCE_REQUIREMENTS_BOUNDARY_KEYS[1] &&
      criterionKey === 'senderDebitAndReceiverCreditClosureBound') {
    return {
      capabilityId: HISTORICAL_SOURCE_EVIDENCE_CAPABILITY_IDS
        .counterpartTransferClosure,
      nativeEvidenceKind: 'transport',
      expectedArtifactKind:
        'sender-debit and configured-owner receiver-credit closure receipt'
    };
  }
  throw new Error(`Unknown historical-source criterion: ${criterionKey}`);
}

function requirementKey(boundary, requirement, requirementIndex) {
  return boundary.boundaryKey ===
      HISTORICAL_SOURCE_REQUIREMENTS_BOUNDARY_KEYS[0]
    ? 'matrixEndowmentBundle'
    : requirement.ownerKey || `counterpartRequirement${requirementIndex}`;
}

function expectedRecords(inventory) {
  return inventory.boundaries.flatMap(boundary =>
    boundary.requirements.map((requirement, requirementIndex) => {
      const key = requirementKey(boundary, requirement, requirementIndex);
      const criterionEntries = Object.entries(requirement.admissionCriteria);
      return {
        schema:
          LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_READINESS_RECORD_SCHEMA,
        readinessRecordId: `${boundary.boundaryKey}:${key}`,
        boundaryKey: boundary.boundaryKey,
        requirementKey: key,
        requirementIndex,
        requirementShape: boundary.requirementShape,
        cardinalitySemantics: clone(boundary.cardinalitySemantics),
        requirementBinding: {
          inventoryReceiptDigest: inventory.digest,
          sourceRequirementsSchema: boundary.sourceRequirements.schema,
          sourceRequirementsReceiptDigest:
            boundary.sourceRequirements.receiptDigest,
          requirementContentDigest: stableDigest(requirement)
        },
        configuredOwnerReferenceKeys:
          clone(boundary.configuredOwnerReferenceKeys),
        capabilityRoute: CAPABILITY_ROUTE,
        readinessStatus: READINESS_STATUS,
        acquisitionRequests: criterionEntries.map(
          ([criterionKey, criterionSatisfied], criterionIndex) => {
            if (criterionSatisfied !== false) {
              throw new Error(
                'Readiness matrix requires unresolved false criteria');
            }
            const capability = capabilityFor(boundary.boundaryKey,
              criterionKey);
            return {
              schema:
                LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ACQUISITION_REQUEST_SCHEMA,
              requestId:
                `${boundary.boundaryKey}:${key}:${criterionKey}`,
              criterionKey,
              missingEvidence: requirement.missingEvidence[criterionIndex],
              capabilityId: capability.capabilityId,
              gapType: capability.gapType || 'EVIDENCE',
              status: 'MISSING',
              nativeEvidenceKind: capability.nativeEvidenceKind,
              expectedArtifactKind: capability.expectedArtifactKind,
              observedEvidence: null,
              verificationVerdict: 'UNKNOWN',
              satisfiesAdmissionCriterion: false,
              admissionAuthorityGranted: false
            };
          }),
        candidatePackage: null,
        physicalMeaningReviewDecision: null,
        requirementResolutionStatus: 'UNRESOLVED'
      };
    }));
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
    capabilityRoute: CAPABILITY_ROUTE,
    readinessStatus: READINESS_STATUS
  };
}

export function
landMatrixThermalHistoricalSourceEvidenceReadinessReceiptValid(receipt) {
  const inventory = receipt?.sourceInventory;
  if (!digestValid(receipt) ||
      !landMatrixThermalHistoricalSourceRequirementsInventoryReceiptValid(
        inventory)) return false;
  let records;
  try {
    records = expectedRecords(inventory);
  } catch {
    return false;
  }
  const migration = receipt.emission?.mode === MIGRATION_EMISSION_MODE;
  return receipt.status ===
      'historical-source-evidence-acquisition-not-ready' &&
    exact(receipt.creationContext, inventory.creationContext) &&
    receipt.source?.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_INVENTORY_RECEIPT_SCHEMA &&
    receipt.source?.receiptDigest === inventory.digest &&
    exact(receipt.readinessRecords, records) &&
    exact(receipt.summary, expectedSummary(records)) &&
    [NATIVE_EMISSION_MODE, MIGRATION_EMISSION_MODE]
      .includes(receipt.emission?.mode) &&
    receipt.emission.sourceWasExactRetainedEvidenceMigration === migration &&
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
}

export function createLandMatrixThermalHistoricalSourceEvidenceReadinessReceipt(
  context, inventory, options = {}) {
  if (!landMatrixThermalHistoricalSourceRequirementsInventoryReceiptValid(
      inventory) || !exact(context, inventory.creationContext)) {
    throw new Error(
      'Historical-source evidence readiness needs the exact attached R97 inventory');
  }
  const readinessRecords = expectedRecords(inventory);
  const migration = options.sourceWasExactRetainedEvidenceMigration === true;
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_READINESS_RECEIPT_SCHEMA,
    status: 'historical-source-evidence-acquisition-not-ready',
    creationContext: clone(inventory.creationContext),
    source: {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_INVENTORY_RECEIPT_SCHEMA,
      receiptDigest: inventory.digest
    },
    sourceInventory: clone(inventory),
    readinessRecords,
    summary: expectedSummary(readinessRecords),
    emission: {
      mode: migration ? MIGRATION_EMISSION_MODE : NATIVE_EMISSION_MODE,
      sourceWasExactRetainedEvidenceMigration: migration
    },
    truth: {
      exactR97InventoryBound: true,
      criterionToCapabilityMappingExact: true,
      asymmetricRequirementSemanticsPreserved: true,
      externalEvidenceAcquisitionRequired: true,
      physicalMeaningReviewAuthorityRequired: true,
      historicalPhysicalSourceOwnerCandidatesProvided: false,
      historicalSourceOwnerDebitReceiptsProvided: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      candidateAdmissionPathImplemented: false,
      admissionAuthorityGranted: false,
      allRequirementsOutstanding: true,
      crossBoundaryCardinalityInferencePerformed: false,
      ownerMutationPerformed: false,
      heatTransferPerformed: false,
      historicalHeatReconstructed: false,
      combinedSixOwnerGraphClaimed: false,
      absoluteThermodynamicEnergyClaimed: false,
      resolvedConductionClaimed: false,
      geothermalForcingModeled: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalHistoricalSourceEvidenceReadinessReceiptValid(
      receipt)) {
    throw new Error('Historical-source evidence readiness failed validation');
  }
  return receipt;
}

export function matrixThermalHistoricalSourceEvidenceReadinessDescription() {
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_READINESS_RECEIPT_SCHEMA,
    readinessRecordSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_READINESS_RECORD_SCHEMA,
    acquisitionRequestSchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_EVIDENCE_ACQUISITION_REQUEST_SCHEMA,
    capabilityIds: clone(HISTORICAL_SOURCE_EVIDENCE_CAPABILITY_IDS),
    capabilityRoute: CAPABILITY_ROUTE,
    readinessStatus: READINESS_STATUS,
    candidateAdmissionPathImplemented: false,
    historicalPhysicalSourceOwnersResolved: false,
    historicalPhysicalSourceOwnersDebited: false,
    mutatesState: false
  };
}
