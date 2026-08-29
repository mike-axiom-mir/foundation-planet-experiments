import {
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
} from './land-hydrology-thermal.mjs?v=0.94.0-r94.1';
import {
  LAND_MATRIX_THERMAL_COUNTERPART_GENESIS_CONTINUITY_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_COUNTERPART_GENESIS_CONTINUITY_CLOSURE_SCHEMA,
  LAND_MATRIX_THERMAL_COUNTERPART_GENESIS_CONTINUITY_CLOSURE_POLICY_SCHEMA,
  landMatrixThermalCounterpartGenesisContinuityReceiptValid
} from './matrix-thermal-counterpart-genesis-continuity.mjs?v=0.94.0-r94.1';

const clone = value => JSON.parse(JSON.stringify(value));
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const same = (left, right, tolerance =
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) =>
  Number.isFinite(Number(left)) && Number.isFinite(Number(right)) &&
  Math.abs(Number(left) - Number(right)) <= tolerance;
const round = (value, digits = 12) => Number(Number(value).toFixed(digits));

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
  if (!value || typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function surfaceOwnersSame(left = {}, right = {}) {
  return left.ownerKind === 'land-surface-sensible-heat-owner' &&
    right.ownerKind === left.ownerKind &&
    same(left.heatCapacityJm2K, right.heatCapacityJm2K, 1e-6) &&
    same(left.temperatureC, right.temperatureC, 1e-6) &&
    same(left.sensibleHeatJm2, right.sensibleHeatJm2);
}

function closure(initialOwner, finalOwner, entries) {
  const signedOperands = [Number(finalOwner?.sensibleHeatJm2),
    -Number(initialOwner?.sensibleHeatJm2),
    ...entries.map(entry => -Number(entry.signedOwnerHeatJm2))];
  if (!signedOperands.every(Number.isFinite)) return null;
  const residual = signedOperands.reduce((sum, value) => sum + value, 0);
  const scale = signedOperands.reduce((sum, value) =>
    sum + Math.abs(value), 0);
  const numericTolerance = round(Math.max(
    LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    scale * Number.EPSILON * LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
  ));
  return {
    schema:
      LAND_MATRIX_THERMAL_COUNTERPART_GENESIS_CONTINUITY_CLOSURE_SCHEMA,
    policy: {
      schema:
        LAND_MATRIX_THERMAL_COUNTERPART_GENESIS_CONTINUITY_CLOSURE_POLICY_SCHEMA,
      kind: 'energy',
      absoluteFloor: LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
      ulpFactor: LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
    },
    signedOperands,
    residual,
    numericTolerance,
    measuredResidualPreserved: true,
    closed: Math.abs(residual) <= numericTolerance
  };
}

function result(status, detail) {
  return {
    id: 'land-matrix-thermal-counterpart-genesis-to-first-step-continuity',
    required: true,
    status,
    statement: 'The configured R93 counterpart owners reach the first R89 matrix source-owner ledger through the retained first-step hydrology, water-owner, and surface-energy interval with no unreceipted owner delta, without resolving or debiting historical physical sources.',
    detail
  };
}

export function auditLandMatrixThermalCounterpartGenesisContinuity(column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land
    ?.matrixThermalCounterpartGenesisContinuityReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalCounterpartGenesisContinuityMigrationCheckpoint === true;
    const awaiting = column.land
      ?.matrixThermalCounterpartGenesisContinuityAwaitingFirstLedger ===
        true && column.stepCount === 0;
    return result(checkpoint || awaiting ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'the source save does not retain the complete first-step R93-to-R89 owner interval'
        : awaiting
          ? 'the intact R93 counterpart genesis source is awaiting its first runtime owner interval'
          : 'a stepped native v56 land column is missing its counterpart genesis handoff receipt'
    });
  }
  const genesisReceipt = receipt.sourceReceipts
    ?.counterpartInitialEndowment;
  const firstLedger = receipt.sourceReceipts?.firstSourceOwnerLedger;
  const sources = receipt.sourceReceipts?.ownerInterval || {};
  const hydrology = sources.landHydrologyThermal || {};
  const surfaceSnow = sources.surfaceSnowThermal || {};
  const surfaceRoot = sources.surfaceRootZoneThermal || {};
  const rootDeep = sources.rootDeepWaterThermal || {};
  const deepGround = sources.deepGroundwaterWaterThermal || {};
  const genesis = genesisReceipt?.configuredOwners?.counterpartSources || {};
  const runtime = firstLedger?.initialOwners?.counterpartSources || {};
  const energy = surfaceRoot.sourceSurfaceEnergyLedger || {};
  const sourceDigestsValid = [receipt, genesisReceipt, firstLedger,
    hydrology, surfaceSnow, surfaceRoot, rootDeep, deepGround]
    .every(digestValid);
  const sourceBindingsExact =
    receipt.sources?.counterpartInitialEndowment?.receiptDigest ===
      genesisReceipt?.digest &&
    receipt.sources?.firstSourceOwnerLedger?.receiptDigest ===
      firstLedger?.digest &&
    Object.entries(sources).every(([key, value]) =>
      receipt.sources?.ownerInterval?.[key]?.receiptDigest === value.digest);
  const chainExact = {
    groundwaterGenesisToHydrologyInitial:
      exact(genesis.groundwaterWater, hydrology.initialOwners?.groundwater),
    deepSoilGenesisToHydrologyInitial:
      exact(genesis.deepSoilWater, hydrology.initialOwners?.deepSoil),
    hydrologyGroundwaterToDeepGroundwaterInitial:
      exact(hydrology.finalOwners?.groundwater,
        deepGround.initialGroundwaterOwner),
    hydrologyDeepSoilToRootDeepInitial:
      exact(hydrology.finalOwners?.deepSoil, rootDeep.initialDeepSoilOwner),
    rootDeepFinalToDeepGroundwaterInitial:
      exact(rootDeep.finalDeepSoilOwner,
        deepGround.initialDeepSoilOwner),
    deepGroundwaterFinalToR89Initial:
      exact(deepGround.finalGroundwaterOwner, runtime.groundwaterWater),
    deepSoilFinalToR89Initial:
      exact(deepGround.finalDeepSoilOwner, runtime.deepSoilWater),
    surfaceGenesisToEnergyInitial:
      surfaceOwnersSame(genesis.surfaceSensibleHeat,
        energy.initialSurfaceSensibleHeatOwner),
    surfaceSnowAndRootEnergySourcesExact:
      exact(surfaceSnow.sourceSurfaceEnergyLedger, energy),
    surfaceEnergyFinalToR89Initial:
      surfaceOwnersSame(energy.finalSurfaceSensibleHeatOwner,
        runtime.surfaceSensibleHeat)
  };
  const chainHandoffsExact = Object.values(chainExact).every(Boolean) &&
    exact(receipt.ownerHandoff?.configuredCounterpartGenesisOwners,
      genesis) &&
    exact(receipt.ownerHandoff?.firstMatrixLedgerInitialCounterpartOwners,
      runtime) &&
    exact(receipt.ownerHandoff?.chainExact, chainExact) &&
    receipt.ownerHandoff?.accountedExact === true;
  const entries = {
    groundwaterWater: [
      {
        id: 'first-land-hydrology-groundwater-owner-delta',
        sourceReceiptDigest: hydrology.digest,
        signedOwnerHeatJm2: Number(
          hydrology.finalOwners?.groundwater?.sensibleHeatJm2) -
          Number(hydrology.initialOwners?.groundwater?.sensibleHeatJm2)
      },
      {
        id: 'first-deep-groundwater-exchange-groundwater-owner-entry',
        sourceReceiptDigest: deepGround.digest,
        signedOwnerHeatJm2:
          Number(deepGround.transfer?.signedGroundwaterOwnerHeatJm2)
      }
    ],
    deepSoilWater: [
      {
        id: 'first-land-hydrology-deep-soil-owner-delta',
        sourceReceiptDigest: hydrology.digest,
        signedOwnerHeatJm2: Number(
          hydrology.finalOwners?.deepSoil?.sensibleHeatJm2) -
          Number(hydrology.initialOwners?.deepSoil?.sensibleHeatJm2)
      },
      {
        id: 'first-root-deep-exchange-deep-soil-owner-entry',
        sourceReceiptDigest: rootDeep.digest,
        signedOwnerHeatJm2:
          Number(rootDeep.transfer?.signedDeepSoilOwnerHeatJm2)
      },
      {
        id: 'first-deep-groundwater-exchange-deep-soil-owner-entry',
        sourceReceiptDigest: deepGround.digest,
        signedOwnerHeatJm2:
          Number(deepGround.transfer?.signedDeepSoilOwnerHeatJm2)
      }
    ],
    surfaceSensibleHeat: [
      {
        id: 'first-surface-energy-ledger-storage-change',
        sourceStepId: energy.stepId,
        signedOwnerHeatJm2: Number(energy.storageChangeJm2)
      }
    ]
  };
  const closures = {
    groundwaterWater: closure(genesis.groundwaterWater,
      runtime.groundwaterWater, entries.groundwaterWater),
    deepSoilWater: closure(genesis.deepSoilWater,
      runtime.deepSoilWater, entries.deepSoilWater),
    surfaceSensibleHeat: closure(genesis.surfaceSensibleHeat,
      runtime.surfaceSensibleHeat, entries.surfaceSensibleHeat)
  };
  const intervalClosed = exact(receipt.intervalEntries, entries) &&
    exact(receipt.ownerClosures, closures) &&
    Object.values(closures).every(item => item?.closed === true) &&
    Array.isArray(receipt.unreceiptedIntervalEntries) &&
    receipt.unreceiptedIntervalEntries.length === 0;
  const truthValid =
    receipt.truth?.configuredCounterpartGenesisSourceBound === true &&
    receipt.truth?.firstRuntimeSourceOwnerLedgerBound === true &&
    receipt.truth?.counterpartGenesisToFirstMatrixOwnersReceipted === true &&
    receipt.truth?.zeroUnreceiptedCounterpartOwnerDelta === true &&
    receipt.truth?.threeCounterpartGenesisContinuityClosed === true &&
    receipt.truth?.surfaceCoordinateRoundingReconciled === true &&
    receipt.truth?.ownerMutationPerformed === false &&
    receipt.truth?.heatTransferPerformed === false &&
    receipt.truth?.historicalPhysicalSourceOwnersResolved === false &&
    receipt.truth?.historicalPhysicalSourceOwnersDebited === false &&
    receipt.truth?.historicalHeatReconstructed === false &&
    receipt.truth?.combinedSixOwnerGraphClaimed === false &&
    receipt.truth?.absoluteThermodynamicEnergyClaimed === false &&
    receipt.truth?.resolvedConductionClaimed === false &&
    receipt.truth?.geothermalForcingModeled === false &&
    receipt.truth?.scientificCalibrationClaimed === false &&
    receipt.truth?.globalUnloadedBoundaryClaimed === false &&
    column.truth
      ?.matrixThermalCounterpartGenesisToFirstStepHandoffReceipted === true &&
    column.truth
      ?.matrixThermalCounterpartGenesisContinuityEnergyClosed === true;
  const persistenceBound =
    column.land
      ?.matrixThermalCounterpartGenesisContinuityMigrationCheckpoint ===
        false &&
    column.land
      ?.matrixThermalCounterpartGenesisContinuityAwaitingFirstLedger ===
        false &&
    column.land?.matrixThermalCounterpartInitialEndowmentReceipt?.digest ===
      genesisReceipt?.digest &&
    column.budget?.matrixThermalCounterpartGenesisContinuity?.digest ===
      receipt.digest;
  const structuralValid =
    landMatrixThermalCounterpartGenesisContinuityReceiptValid(receipt);
  const valid = receipt.schema ===
      LAND_MATRIX_THERMAL_COUNTERPART_GENESIS_CONTINUITY_RECEIPT_SCHEMA &&
    structuralValid && sourceDigestsValid && sourceBindingsExact &&
    chainHandoffsExact && intervalClosed && truthValid && persistenceBound;
  return result(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt.schema || null,
    structuralValid,
    sourceDigestsValid,
    sourceBindingsExact,
    chainHandoffsExact,
    intervalClosed,
    closureResidualsJm2: Object.fromEntries(Object.entries(closures)
      .map(([key, value]) => [key, value?.residual ?? null])),
    truthValid,
    persistenceBound,
    rawGenesisOwnersEqualFirstMatrixOwners: exact(genesis, runtime),
    combinedSixOwnerGraphClaimed: false,
    historicalPhysicalSourceOwnersResolved: false,
    historicalPhysicalSourceOwnersDebited: false
  });
}
