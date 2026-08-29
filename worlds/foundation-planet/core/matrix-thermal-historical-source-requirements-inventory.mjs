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

export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_INVENTORY_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-requirements-inventory-receipt/v1';
export const
  LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_INVENTORY_BOUNDARY_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-historical-source-requirements-inventory-boundary/v1';

export const HISTORICAL_SOURCE_REQUIREMENTS_BOUNDARY_KEYS = Object.freeze([
  'configuredMatrixEndowment',
  'configuredCounterpartOwners'
]);

const NATIVE_EMISSION_MODE =
  'native-from-intact-r95-and-r96-requirement-sources';
const MIGRATION_EMISSION_MODE =
  'migration-from-exact-retained-r95-and-r96-requirement-sources';
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
  return counterpartRequirements.creationContext?.columnId ===
      matrixRequirements.creationContext?.columnId &&
    counterpartRequirements.creationContext?.seed ===
      matrixRequirements.creationContext?.seed &&
    counterpartRequirements.creationContext?.initialDay ===
      matrixRequirements.creationContext?.initialDay;
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

export function
landMatrixThermalHistoricalSourceRequirementsInventoryReceiptValid(receipt) {
  const counterpartRequirements = receipt?.sourceReceipts
    ?.configuredCounterpartOwnerRequirements;
  const matrixRequirements = receipt?.sourceReceipts
    ?.configuredMatrixEndowmentRequirements;
  if (!digestValid(receipt) ||
      !landMatrixThermalCounterpartHistoricalSourceRequirementsReceiptValid(
        counterpartRequirements) ||
      !landMatrixThermalHistoricalSourceRequirementsReceiptValid(
        matrixRequirements) ||
      !contextsMatch(counterpartRequirements, matrixRequirements)) return false;
  const migration = receipt.emission?.mode === MIGRATION_EMISSION_MODE;
  return receipt.status ===
      'historical-source-requirements-inventory-declared' &&
    exact(receipt.creationContext, matrixRequirements.creationContext) &&
    receipt.sources?.configuredMatrixEndowmentRequirements?.schema ===
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_RECEIPT_SCHEMA &&
    receipt.sources?.configuredMatrixEndowmentRequirements?.receiptDigest ===
      matrixRequirements.digest &&
    receipt.sources?.configuredCounterpartOwnerRequirements?.schema ===
      LAND_MATRIX_THERMAL_COUNTERPART_HISTORICAL_SOURCE_REQUIREMENTS_RECEIPT_SCHEMA &&
    receipt.sources?.configuredCounterpartOwnerRequirements?.receiptDigest ===
      counterpartRequirements.digest &&
    exact(receipt.boundaries,
      expectedBoundaries(counterpartRequirements, matrixRequirements)) &&
    exact(receipt.summary, expectedSummary()) &&
    [NATIVE_EMISSION_MODE, MIGRATION_EMISSION_MODE]
      .includes(receipt.emission?.mode) &&
    receipt.emission.sourceWasExactRetainedEvidenceMigration === migration &&
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
    receipt.truth?.globalUnloadedBoundaryClaimed === false;
}

export function
createLandMatrixThermalHistoricalSourceRequirementsInventoryReceipt(
  context, counterpartRequirements, matrixRequirements, options = {}) {
  if (!landMatrixThermalCounterpartHistoricalSourceRequirementsReceiptValid(
      counterpartRequirements) ||
      !landMatrixThermalHistoricalSourceRequirementsReceiptValid(
        matrixRequirements) ||
      !contextsMatch(counterpartRequirements, matrixRequirements) ||
      context?.columnId !== matrixRequirements.creationContext.columnId ||
      context?.seed !== matrixRequirements.creationContext.seed) {
    throw new Error(
      'Historical-source requirements inventory needs intact attached R95 and R96 sources');
  }
  const migration = options.sourceWasExactRetainedEvidenceMigration === true;
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_INVENTORY_RECEIPT_SCHEMA,
    status: 'historical-source-requirements-inventory-declared',
    creationContext: clone(matrixRequirements.creationContext),
    sources: {
      configuredMatrixEndowmentRequirements: {
        schema:
          LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_RECEIPT_SCHEMA,
        receiptDigest: matrixRequirements.digest
      },
      configuredCounterpartOwnerRequirements: {
        schema:
          LAND_MATRIX_THERMAL_COUNTERPART_HISTORICAL_SOURCE_REQUIREMENTS_RECEIPT_SCHEMA,
        receiptDigest: counterpartRequirements.digest
      }
    },
    sourceReceipts: {
      configuredMatrixEndowmentRequirements: clone(matrixRequirements),
      configuredCounterpartOwnerRequirements: clone(counterpartRequirements)
    },
    boundaries: expectedBoundaries(counterpartRequirements,
      matrixRequirements),
    summary: expectedSummary(),
    emission: {
      mode: migration ? MIGRATION_EMISSION_MODE : NATIVE_EMISSION_MODE,
      sourceWasExactRetainedEvidenceMigration: migration
    },
    truth: {
      exactR95AndR96RequirementsBound: true,
      asymmetricRequirementShapesPreserved: true,
      crossBoundaryCardinalityInferencePerformed: false,
      historicalPhysicalSourceOwnerCandidatesProvided: false,
      historicalSourceOwnerDebitReceiptsProvided: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      allRequirementsOutstanding: true,
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
  if (!landMatrixThermalHistoricalSourceRequirementsInventoryReceiptValid(
      receipt)) {
    throw new Error(
      'Historical-source requirements inventory failed self-validation');
  }
  return receipt;
}

export function
matrixThermalHistoricalSourceRequirementsInventoryDescription() {
  return {
    schema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_INVENTORY_RECEIPT_SCHEMA,
    boundarySchema:
      LAND_MATRIX_THERMAL_HISTORICAL_SOURCE_REQUIREMENTS_INVENTORY_BOUNDARY_SCHEMA,
    boundaryKeys: [...HISTORICAL_SOURCE_REQUIREMENTS_BOUNDARY_KEYS],
    requirementShapes: [
      'single-endowment-bundle',
      'three-owner-scoped-records'
    ],
    crossBoundaryCardinalityInferencePerformed: false,
    crossBoundaryPhysicalSourceOwnerCardinalityResolved: false,
    crossBoundarySourceOwnerDebitReceiptCardinalityResolved: false,
    historicalPhysicalSourceOwnersResolved: false,
    historicalPhysicalSourceOwnersDebited: false,
    combinedSixOwnerGraphClaimed: false,
    inventsProvenance: false,
    mutatesState: false
  };
}
