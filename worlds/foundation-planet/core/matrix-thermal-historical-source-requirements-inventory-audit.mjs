import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_INVENTORY_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_INVENTORY_BOUNDARY_SCHEMA,
  HISTORICAL_SOURCE_REQUIREMENTS_BOUNDARY_KEYS
} from './matrix-thermal-historical-source-requirements-inventory.mjs?v=0.97.0-r97.1';
import {
  LAND_MATRIX_THERMAL_COUNTERPART_HISTORICAL_SOURCE_REQUIREMENTS_RECEIPT_SCHEMA,
  COUNTERPART_HISTORICAL_SOURCE_OWNER_KEYS,
  landMatrixThermalCounterpartHistoricalSourceRequirementsReceiptValid
} from './matrix-thermal-counterpart-historical-source-requirements.mjs?v=0.97.0-r97.1';
import {
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_RECEIPT_SCHEMA,
  MATRIX_INITIAL_ENDOWMENT_STATE_KEYS,
  landMatrixThermalHistoricalSourceRequirementsReceiptValid
} from './matrix-thermal-historical-source-requirements.mjs?v=0.97.0-r97.1';

const MATRIX_CARDINALITY_SEMANTIC = 'EXPLICITLY_UNRESOLVED';
const COUNTERPART_CARDINALITY_SEMANTIC =
  'THREE_OWNER_SCOPED_REQUIREMENT_RECORDS_WITHOUT_DISTINCT_SOURCE_COUNT_CLAIM';
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
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_INVENTORY_RECEIPT_SCHEMA ||
      typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function contextsMatch(counterpartRequirements, matrixRequirements) {
  return counterpartRequirements?.creationContext?.columnId ===
      matrixRequirements?.creationContext?.columnId &&
    counterpartRequirements?.creationContext?.seed ===
      matrixRequirements?.creationContext?.seed &&
    counterpartRequirements?.creationContext?.initialDay ===
      matrixRequirements?.creationContext?.initialDay;
}

function expectedBoundaries(counterpartRequirements, matrixRequirements) {
  return [
    {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_INVENTORY_BOUNDARY_SCHEMA,
      boundaryKey: HISTORICAL_SOURCE_REQUIREMENTS_BOUNDARY_KEYS[0],
      sourceRequirements: {
        schema:
          LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_RECEIPT_SCHEMA,
        receiptDigest: matrixRequirements.digest
      },
      requirementShape: 'single-endowment-bundle',
      configuredOwnerReferenceKeys: [...MATRIX_INITIAL_ENDOWMENT_STATE_KEYS],
      requirements: [clone(matrixRequirements.requirement)],
      requirementRecordCount: 1,
      historicalPhysicalSourceEvidenceSlotCount: 1,
      historicalSourceOwnerDebitEvidenceSlotCount: 1,
      cardinalitySemantics: {
        historicalPhysicalSourceOwner: MATRIX_CARDINALITY_SEMANTIC,
        historicalSourceOwnerDebitReceipt: MATRIX_CARDINALITY_SEMANTIC
      }
    },
    {
      schema:
        LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_INVENTORY_BOUNDARY_SCHEMA,
      boundaryKey: HISTORICAL_SOURCE_REQUIREMENTS_BOUNDARY_KEYS[1],
      sourceRequirements: {
        schema:
          LAND_MATRIX_THERMAL_COUNTERPART_HISTORICAL_SOURCE_REQUIREMENTS_RECEIPT_SCHEMA,
        receiptDigest: counterpartRequirements.digest
      },
      requirementShape: 'three-owner-scoped-records',
      configuredOwnerReferenceKeys: [
        ...COUNTERPART_HISTORICAL_SOURCE_OWNER_KEYS
      ],
      requirements: clone(counterpartRequirements.requirements),
      requirementRecordCount: 3,
      historicalPhysicalSourceEvidenceSlotCount: 3,
      historicalSourceOwnerDebitEvidenceSlotCount: 3,
      cardinalitySemantics: {
        historicalPhysicalSourceOwner: COUNTERPART_CARDINALITY_SEMANTIC,
        historicalSourceOwnerDebitReceipt: COUNTERPART_CARDINALITY_SEMANTIC
      }
    }
  ];
}

function expectedSummary() {
  return {
    sourceBoundaryCount: 2,
    configuredOwnerReferenceCount: 6,
    requirementRecordCount: 4,
    historicalPhysicalSourceEvidenceSlotCount: 4,
    historicalSourceOwnerDebitEvidenceSlotCount: 4,
    totalEvidenceSlotCount: 8,
    admittedHistoricalPhysicalSourceEvidenceCount: 0,
    admittedHistoricalSourceOwnerDebitEvidenceCount: 0,
    unresolvedRequirementCount: 4,
    crossBoundaryPhysicalSourceOwnerCardinalityResolved: false,
    crossBoundarySourceOwnerDebitReceiptCardinalityResolved: false,
    crossBoundaryCardinalityInferencePerformed: false,
    allRequirementsOutstanding: true
  };
}

function result(status, detail) {
  return {
    id: 'land-matrix-thermal-historical-source-requirements-inventory',
    required: true,
    status,
    statement: 'The exact R95 and R96 missing-evidence requirements are jointly inventoried without flattening their shapes, inferring cross-boundary source cardinality, or claiming a combined physical graph.',
    detail
  };
}

export function
auditLandMatrixThermalHistoricalSourceRequirementsInventory(column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land
    ?.matrixThermalHistoricalSourceRequirementsInventoryReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalHistoricalSourceRequirementsInventoryMigrationCheckpoint ===
        true;
    return result(checkpoint ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'the source lineage does not retain both exact R95 and R96 requirement sources'
        : 'a current loaded-land lineage is missing its historical-source requirements inventory'
    });
  }
  const counterpartRequirements = receipt.sourceReceipts
    ?.configuredCounterpartOwnerRequirements;
  const matrixRequirements = receipt.sourceReceipts
    ?.configuredMatrixEndowmentRequirements;
  const sourceIntegrity =
    landMatrixThermalCounterpartHistoricalSourceRequirementsReceiptValid(
      counterpartRequirements) &&
    landMatrixThermalHistoricalSourceRequirementsReceiptValid(
      matrixRequirements) &&
    contextsMatch(counterpartRequirements, matrixRequirements) &&
    receipt.sources?.configuredCounterpartOwnerRequirements?.schema ===
      LAND_MATRIX_THERMAL_COUNTERPART_HISTORICAL_SOURCE_REQUIREMENTS_RECEIPT_SCHEMA &&
    receipt.sources?.configuredCounterpartOwnerRequirements?.receiptDigest ===
      counterpartRequirements?.digest &&
    receipt.sources?.configuredMatrixEndowmentRequirements?.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_RECEIPT_SCHEMA &&
    receipt.sources?.configuredMatrixEndowmentRequirements?.receiptDigest ===
      matrixRequirements?.digest &&
    column.land
      ?.matrixThermalCounterpartHistoricalSourceRequirementsReceipt?.digest ===
        counterpartRequirements?.digest &&
    column.land?.matrixThermalHistoricalSourceRequirementsReceipt?.digest ===
      matrixRequirements?.digest;
  const boundariesExact = sourceIntegrity && exact(receipt.boundaries,
    expectedBoundaries(counterpartRequirements, matrixRequirements));
  const requirements = Array.isArray(receipt.boundaries)
    ? receipt.boundaries.flatMap(boundary =>
      Array.isArray(boundary?.requirements) ? boundary.requirements : [])
    : [];
  const evidenceBoundaryEmpty = requirements.length === 4 &&
    requirements.every(requirement =>
      requirement?.evidenceSlots?.historicalPhysicalSourceOwner === null &&
      requirement?.evidenceSlots?.historicalSourceOwnerDebitReceipt === null &&
      requirement?.resolutionStatus === 'UNRESOLVED' &&
      Object.values(requirement?.admissionCriteria || {})
        .every(value => value === false));
  const summaryExact = exact(receipt.summary, expectedSummary());
  const truthValid =
    receipt.truth?.exactR95AndR96RequirementsBound === true &&
    receipt.truth?.asymmetricRequirementShapesPreserved === true &&
    receipt.truth?.crossBoundaryCardinalityInferencePerformed === false &&
    receipt.truth?.historicalPhysicalSourceOwnerCandidatesProvided === false &&
    receipt.truth?.historicalSourceOwnerDebitReceiptsProvided === false &&
    receipt.truth?.historicalPhysicalSourceOwnersResolved === false &&
    receipt.truth?.historicalPhysicalSourceOwnersDebited === false &&
    receipt.truth?.allRequirementsOutstanding === true &&
    receipt.truth?.ownerMutationPerformed === false &&
    receipt.truth?.heatTransferPerformed === false &&
    receipt.truth?.historicalHeatReconstructed === false &&
    receipt.truth?.combinedSixOwnerGraphClaimed === false &&
    receipt.truth?.absoluteThermodynamicEnergyClaimed === false &&
    receipt.truth?.resolvedConductionClaimed === false &&
    receipt.truth?.geothermalForcingModeled === false &&
    receipt.truth?.scientificCalibrationClaimed === false &&
    receipt.truth?.globalUnloadedBoundaryClaimed === false &&
    column.truth
      ?.matrixThermalHistoricalSourceRequirementsInventoryDeclared === true &&
    column.truth
      ?.matrixThermalHistoricalSourceRequirementShapesPreserved === true &&
    column.truth
      ?.matrixThermalCrossBoundaryPhysicalSourceOwnerCardinalityResolved ===
        false &&
    column.truth
      ?.matrixThermalCrossBoundarySourceOwnerDebitReceiptCardinalityResolved ===
        false &&
    column.truth
      ?.matrixThermalHistoricalSourceRequirementsCombinedSixOwnerGraphClaimed ===
        false;
  const persistenceBound = column.land
      ?.matrixThermalHistoricalSourceRequirementsInventoryMigrationCheckpoint ===
        false &&
    column.budget?.matrixThermalHistoricalSourceRequirementsInventory?.digest ===
      receipt.digest;
  const structuralValid = digestValid(receipt) && sourceIntegrity &&
    exact(receipt.creationContext, matrixRequirements?.creationContext) &&
    boundariesExact && summaryExact &&
    ['native-from-intact-r95-and-r96-requirement-sources',
      'migration-from-exact-retained-r95-and-r96-requirement-sources']
      .includes(receipt.emission?.mode) &&
    receipt.emission?.sourceWasExactRetainedEvidenceMigration ===
      receipt.emission?.mode.startsWith('migration-');
  const valid = structuralValid && evidenceBoundaryEmpty && truthValid &&
    persistenceBound;
  return result(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt.schema || null,
    structuralValid,
    sourceIntegrity,
    boundariesExact,
    evidenceBoundaryEmpty,
    summaryExact,
    truthValid,
    persistenceBound,
    sourceBoundaryCount: receipt.summary?.sourceBoundaryCount ?? null,
    requirementRecordCount: receipt.summary?.requirementRecordCount ?? null,
    totalEvidenceSlotCount: receipt.summary?.totalEvidenceSlotCount ?? null,
    crossBoundaryPhysicalSourceOwnerCardinalityResolved: false,
    crossBoundarySourceOwnerDebitReceiptCardinalityResolved: false,
    historicalPhysicalSourceOwnersResolved: false,
    historicalPhysicalSourceOwnersDebited: false,
    combinedSixOwnerGraphClaimed: false
  });
}
