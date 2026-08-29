import {
  LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA,
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
} from './land-hydrology-thermal.mjs?v=0.94.0-r94.1';
import {
  LAND_SURFACE_SNOW_THERMAL_RECEIPT_SCHEMA,
  landSurfaceSnowThermalReceiptValid
} from './surface-snow-thermal.mjs?v=0.94.0-r94.1';
import {
  LAND_SURFACE_ROOT_ZONE_THERMAL_RECEIPT_SCHEMA,
  landSurfaceRootZoneThermalReceiptValid
} from './surface-root-zone-thermal.mjs?v=0.94.0-r94.1';
import {
  LAND_ROOT_DEEP_WATER_THERMAL_RECEIPT_SCHEMA,
  landRootDeepWaterThermalReceiptValid
} from './root-deep-water-thermal.mjs?v=0.94.0-r94.1';
import {
  LAND_DEEP_GROUNDWATER_WATER_THERMAL_RECEIPT_SCHEMA,
  landDeepGroundwaterWaterThermalReceiptValid
} from './deep-groundwater-water-thermal.mjs?v=0.94.0-r94.1';
import {
  LAND_MATRIX_THERMAL_SOURCE_OWNER_LEDGER_RECEIPT_SCHEMA,
  landMatrixThermalSourceOwnerLedgerReceiptValid
} from './matrix-thermal-source-owner-ledger.mjs?v=0.94.0-r94.1';
import {
  LAND_MATRIX_THERMAL_COUNTERPART_INITIAL_ENDOWMENT_RECEIPT_SCHEMA,
  landMatrixThermalCounterpartInitialEndowmentReceiptValid
} from './matrix-thermal-counterpart-initial-endowment.mjs?v=0.94.0-r94.1';

export const
  LAND_MATRIX_THERMAL_COUNTERPART_GENESIS_CONTINUITY_RECEIPT_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-counterpart-genesis-continuity-receipt/v1';
export const
  LAND_MATRIX_THERMAL_COUNTERPART_GENESIS_CONTINUITY_CLOSURE_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-counterpart-genesis-continuity-closure/v1';
export const
  LAND_MATRIX_THERMAL_COUNTERPART_GENESIS_CONTINUITY_CLOSURE_POLICY_SCHEMA =
    'axm.foundation-planet.land-matrix-thermal-counterpart-genesis-continuity-closure-policy/v1';

const NATIVE_EMISSION_MODE =
  'runtime-first-step-from-intact-r93-and-receipted-owner-interval';
const MIGRATION_EMISSION_MODE =
  'migration-from-exact-retained-r93-r89-and-owner-interval-sources';
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

function digestValid(value, schema = null) {
  if (!value || typeof value.digest !== 'string' ||
      (schema && value.schema !== schema)) return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function stepOrdinal(receipt) {
  const match = String(receipt?.stepId || '').match(/:(\d+)$/);
  return match ? Number(match[1]) : null;
}

function binding(receipt) {
  return {
    schema: receipt.schema,
    receiptDigest: receipt.digest,
    stepId: receipt.stepId || null
  };
}

function sourceReceiptsValid(sources = {}) {
  const ordinals = [sources.landHydrologyThermal,
    sources.surfaceSnowThermal, sources.surfaceRootZoneThermal,
    sources.rootDeepWaterThermal, sources.deepGroundwaterWaterThermal]
    .map(stepOrdinal);
  return sources.landHydrologyThermal?.schema ===
      LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA &&
    digestValid(sources.landHydrologyThermal,
      LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA) &&
    sources.surfaceSnowThermal?.schema ===
      LAND_SURFACE_SNOW_THERMAL_RECEIPT_SCHEMA &&
    landSurfaceSnowThermalReceiptValid(sources.surfaceSnowThermal) &&
    sources.surfaceRootZoneThermal?.schema ===
      LAND_SURFACE_ROOT_ZONE_THERMAL_RECEIPT_SCHEMA &&
    landSurfaceRootZoneThermalReceiptValid(
      sources.surfaceRootZoneThermal) &&
    sources.rootDeepWaterThermal?.schema ===
      LAND_ROOT_DEEP_WATER_THERMAL_RECEIPT_SCHEMA &&
    landRootDeepWaterThermalReceiptValid(sources.rootDeepWaterThermal) &&
    sources.deepGroundwaterWaterThermal?.schema ===
      LAND_DEEP_GROUNDWATER_WATER_THERMAL_RECEIPT_SCHEMA &&
    landDeepGroundwaterWaterThermalReceiptValid(
      sources.deepGroundwaterWaterThermal) &&
    ordinals.every(ordinal => ordinal === 1);
}

function surfaceOwnersSame(left = {}, right = {}) {
  return left.ownerKind === 'land-surface-sensible-heat-owner' &&
    right.ownerKind === left.ownerKind &&
    same(left.heatCapacityJm2K, right.heatCapacityJm2K, 1e-6) &&
    same(left.temperatureC, right.temperatureC, 1e-6) &&
    same(left.sensibleHeatJm2, right.sensibleHeatJm2);
}

function intervalEvidence(initialEndowment, firstLedger, sources) {
  const genesis = clone(initialEndowment.configuredOwners.counterpartSources);
  const runtime = clone(firstLedger.initialOwners.counterpartSources);
  const hydrology = sources.landHydrologyThermal;
  const surfaceSnow = sources.surfaceSnowThermal;
  const surfaceRoot = sources.surfaceRootZoneThermal;
  const rootDeep = sources.rootDeepWaterThermal;
  const deepGround = sources.deepGroundwaterWaterThermal;
  const surfaceEnergy = clone(surfaceRoot.sourceSurfaceEnergyLedger || null);
  const chainExact = {
    groundwaterGenesisToHydrologyInitial:
      exact(genesis.groundwaterWater, hydrology.initialOwners.groundwater),
    deepSoilGenesisToHydrologyInitial:
      exact(genesis.deepSoilWater, hydrology.initialOwners.deepSoil),
    hydrologyGroundwaterToDeepGroundwaterInitial:
      exact(hydrology.finalOwners.groundwater,
        deepGround.initialGroundwaterOwner),
    hydrologyDeepSoilToRootDeepInitial:
      exact(hydrology.finalOwners.deepSoil, rootDeep.initialDeepSoilOwner),
    rootDeepFinalToDeepGroundwaterInitial:
      exact(rootDeep.finalDeepSoilOwner,
        deepGround.initialDeepSoilOwner),
    deepGroundwaterFinalToR89Initial:
      exact(deepGround.finalGroundwaterOwner, runtime.groundwaterWater),
    deepSoilFinalToR89Initial:
      exact(deepGround.finalDeepSoilOwner, runtime.deepSoilWater),
    surfaceGenesisToEnergyInitial:
      surfaceOwnersSame(genesis.surfaceSensibleHeat,
        surfaceEnergy?.initialSurfaceSensibleHeatOwner),
    surfaceSnowAndRootEnergySourcesExact:
      exact(surfaceSnow.sourceSurfaceEnergyLedger, surfaceEnergy),
    surfaceEnergyFinalToR89Initial:
      surfaceOwnersSame(surfaceEnergy?.finalSurfaceSensibleHeatOwner,
        runtime.surfaceSensibleHeat)
  };
  const intervalEntries = {
    groundwaterWater: [
      {
        id: 'first-land-hydrology-groundwater-owner-delta',
        sourceReceiptDigest: hydrology.digest,
        signedOwnerHeatJm2: Number(
          hydrology.finalOwners.groundwater.sensibleHeatJm2) -
          Number(hydrology.initialOwners.groundwater.sensibleHeatJm2)
      },
      {
        id: 'first-deep-groundwater-exchange-groundwater-owner-entry',
        sourceReceiptDigest: deepGround.digest,
        signedOwnerHeatJm2:
          Number(deepGround.transfer.signedGroundwaterOwnerHeatJm2)
      }
    ],
    deepSoilWater: [
      {
        id: 'first-land-hydrology-deep-soil-owner-delta',
        sourceReceiptDigest: hydrology.digest,
        signedOwnerHeatJm2: Number(
          hydrology.finalOwners.deepSoil.sensibleHeatJm2) -
          Number(hydrology.initialOwners.deepSoil.sensibleHeatJm2)
      },
      {
        id: 'first-root-deep-exchange-deep-soil-owner-entry',
        sourceReceiptDigest: rootDeep.digest,
        signedOwnerHeatJm2:
          Number(rootDeep.transfer.signedDeepSoilOwnerHeatJm2)
      },
      {
        id: 'first-deep-groundwater-exchange-deep-soil-owner-entry',
        sourceReceiptDigest: deepGround.digest,
        signedOwnerHeatJm2:
          Number(deepGround.transfer.signedDeepSoilOwnerHeatJm2)
      }
    ],
    surfaceSensibleHeat: [
      {
        id: 'first-surface-energy-ledger-storage-change',
        sourceStepId: surfaceEnergy.stepId,
        signedOwnerHeatJm2: Number(surfaceEnergy.storageChangeJm2)
      }
    ]
  };
  const ownerClosures = Object.fromEntries([
    ['groundwaterWater', genesis.groundwaterWater,
      runtime.groundwaterWater],
    ['deepSoilWater', genesis.deepSoilWater, runtime.deepSoilWater],
    ['surfaceSensibleHeat', genesis.surfaceSensibleHeat,
      runtime.surfaceSensibleHeat]
  ].map(([key, initialOwner, finalOwner]) => {
    const entries = intervalEntries[key];
    const signedOperands = [Number(finalOwner.sensibleHeatJm2),
      -Number(initialOwner.sensibleHeatJm2),
      ...entries.map(entry => -Number(entry.signedOwnerHeatJm2))];
    const residual = signedOperands.reduce((sum, value) => sum + value, 0);
    const scale = signedOperands.reduce((sum, value) =>
      sum + Math.abs(value), 0);
    const numericTolerance = round(Math.max(
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
      scale * Number.EPSILON * LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
    ));
    return [key, {
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
    }];
  }));
  return {
    genesis,
    runtime,
    chainExact,
    intervalEntries,
    ownerClosures,
    allChainsExact: Object.values(chainExact).every(Boolean),
    allClosuresClosed: Object.values(ownerClosures)
      .every(item => item.closed === true)
  };
}

export function
landMatrixThermalCounterpartGenesisContinuityReceiptValid(receipt) {
  if (!digestValid(receipt,
      LAND_MATRIX_THERMAL_COUNTERPART_GENESIS_CONTINUITY_RECEIPT_SCHEMA) ||
      !landMatrixThermalCounterpartInitialEndowmentReceiptValid(
        receipt.sourceReceipts?.counterpartInitialEndowment) ||
      !landMatrixThermalSourceOwnerLedgerReceiptValid(
        receipt.sourceReceipts?.firstSourceOwnerLedger) ||
      receipt.sourceReceipts.firstSourceOwnerLedger.stepOrdinal !== 1 ||
      !sourceReceiptsValid(receipt.sourceReceipts?.ownerInterval) ||
      ![NATIVE_EMISSION_MODE, MIGRATION_EMISSION_MODE]
        .includes(receipt.emission?.mode)) return false;
  const initialEndowment = receipt.sourceReceipts.counterpartInitialEndowment;
  const firstLedger = receipt.sourceReceipts.firstSourceOwnerLedger;
  const evidence = intervalEvidence(initialEndowment, firstLedger,
    receipt.sourceReceipts.ownerInterval);
  const migration = receipt.emission.mode === MIGRATION_EMISSION_MODE;
  return receipt.status ===
      'configured-counterpart-genesis-to-first-matrix-ledger-handoff-bound' &&
    receipt.creationContext?.columnId ===
      initialEndowment.creationContext.columnId &&
    receipt.creationContext?.seed === initialEndowment.creationContext.seed &&
    receipt.firstRuntimeStepOrdinal === 1 &&
    receipt.sources?.counterpartInitialEndowment?.schema ===
      LAND_MATRIX_THERMAL_COUNTERPART_INITIAL_ENDOWMENT_RECEIPT_SCHEMA &&
    receipt.sources.counterpartInitialEndowment.receiptDigest ===
      initialEndowment.digest &&
    receipt.sources?.firstSourceOwnerLedger?.schema ===
      LAND_MATRIX_THERMAL_SOURCE_OWNER_LEDGER_RECEIPT_SCHEMA &&
    receipt.sources.firstSourceOwnerLedger.receiptDigest ===
      firstLedger.digest &&
    Object.entries(receipt.sourceReceipts.ownerInterval)
      .every(([key, value]) =>
        receipt.sources?.ownerInterval?.[key]?.receiptDigest === value.digest) &&
    exact(receipt.ownerHandoff.configuredCounterpartGenesisOwners,
      evidence.genesis) &&
    exact(receipt.ownerHandoff.firstMatrixLedgerInitialCounterpartOwners,
      evidence.runtime) &&
    exact(receipt.ownerHandoff.chainExact, evidence.chainExact) &&
    evidence.allChainsExact &&
    exact(receipt.intervalEntries, evidence.intervalEntries) &&
    exact(receipt.ownerClosures, evidence.ownerClosures) &&
    evidence.allClosuresClosed &&
    Array.isArray(receipt.unreceiptedIntervalEntries) &&
    receipt.unreceiptedIntervalEntries.length === 0 &&
    receipt.emission.sourceWasExactRetainedEvidenceMigration === migration &&
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
    receipt.truth?.globalUnloadedBoundaryClaimed === false;
}

export function createLandMatrixThermalCounterpartGenesisContinuityReceipt(
  column, counterpartInitialEndowmentReceipt, firstSourceOwnerLedgerReceipt,
  ownerIntervalSources, context = {}) {
  if (column?.kind !== 'land' ||
      !landMatrixThermalCounterpartInitialEndowmentReceiptValid(
        counterpartInitialEndowmentReceipt) ||
      !landMatrixThermalSourceOwnerLedgerReceiptValid(
        firstSourceOwnerLedgerReceipt) ||
      firstSourceOwnerLedgerReceipt.stepOrdinal !== 1 ||
      !sourceReceiptsValid(ownerIntervalSources)) {
    throw new Error('Counterpart genesis handoff requires intact first-step R93, R89, and owner-interval sources');
  }
  if (column.land?.matrixThermalCounterpartInitialEndowmentReceipt?.digest !==
      counterpartInitialEndowmentReceipt.digest ||
      column.land?.lastMatrixThermalSourceOwnerLedgerReceipt?.digest !==
        firstSourceOwnerLedgerReceipt.digest) {
    throw new Error('Counterpart genesis handoff sources are detached from the column');
  }
  const evidence = intervalEvidence(counterpartInitialEndowmentReceipt,
    firstSourceOwnerLedgerReceipt, ownerIntervalSources);
  if (!evidence.allChainsExact || !evidence.allClosuresClosed) {
    throw new Error('Counterpart genesis owner interval is detached or does not close');
  }
  const migration =
    context.sourceWasExactRetainedEvidenceMigration === true;
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_COUNTERPART_GENESIS_CONTINUITY_RECEIPT_SCHEMA,
    status:
      'configured-counterpart-genesis-to-first-matrix-ledger-handoff-bound',
    creationContext: {
      columnId: column.id,
      seed: column.seed,
      initialDay: counterpartInitialEndowmentReceipt.creationContext.initialDay
    },
    firstRuntimeStepOrdinal: 1,
    sources: {
      counterpartInitialEndowment: binding(
        counterpartInitialEndowmentReceipt),
      firstSourceOwnerLedger: binding(firstSourceOwnerLedgerReceipt),
      ownerInterval: Object.fromEntries(Object.entries(ownerIntervalSources)
        .map(([key, value]) => [key, binding(value)]))
    },
    sourceReceipts: {
      counterpartInitialEndowment: clone(
        counterpartInitialEndowmentReceipt),
      firstSourceOwnerLedger: clone(firstSourceOwnerLedgerReceipt),
      ownerInterval: clone(ownerIntervalSources)
    },
    ownerHandoff: {
      configuredCounterpartGenesisOwners: evidence.genesis,
      firstMatrixLedgerInitialCounterpartOwners: evidence.runtime,
      chainExact: evidence.chainExact,
      accountedExact: true
    },
    intervalEntries: evidence.intervalEntries,
    ownerClosures: evidence.ownerClosures,
    unreceiptedIntervalEntries: [],
    emission: {
      mode: migration ? MIGRATION_EMISSION_MODE : NATIVE_EMISSION_MODE,
      sourceWasExactRetainedEvidenceMigration: migration
    },
    truth: {
      configuredCounterpartGenesisSourceBound: true,
      firstRuntimeSourceOwnerLedgerBound: true,
      counterpartGenesisToFirstMatrixOwnersReceipted: true,
      zeroUnreceiptedCounterpartOwnerDelta: true,
      threeCounterpartGenesisContinuityClosed: true,
      surfaceCoordinateRoundingReconciled: true,
      ownerMutationPerformed: false,
      heatTransferPerformed: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
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
  if (!landMatrixThermalCounterpartGenesisContinuityReceiptValid(receipt)) {
    throw new Error('Counterpart genesis handoff receipt failed self-validation');
  }
  return receipt;
}

export function matrixThermalCounterpartGenesisContinuityDescription() {
  return {
    schema:
      LAND_MATRIX_THERMAL_COUNTERPART_GENESIS_CONTINUITY_RECEIPT_SCHEMA,
    closureSchema:
      LAND_MATRIX_THERMAL_COUNTERPART_GENESIS_CONTINUITY_CLOSURE_SCHEMA,
    closurePolicySchema:
      LAND_MATRIX_THERMAL_COUNTERPART_GENESIS_CONTINUITY_CLOSURE_POLICY_SCHEMA,
    proves: [
      'exact R93 configured counterpart genesis and first-step R89 sources are retained',
      'first-step hydrology and water-owner thermal receipts account groundwater and deep-soil owner changes',
      'the embedded surface-energy ledger and paired surface receipts account the surface-owner change',
      'the three configured counterpart owners reach the first matrix ledger with zero unreceipted owner delta'
    ],
    rawGenesisOwnersEqualFirstMatrixOwners: false,
    surfaceCoordinateRoundingReconciled: true,
    combinedSixOwnerGraphClaimed: false,
    historicalPhysicalSourceOwnersResolved: false,
    historicalPhysicalSourceOwnersDebited: false,
    absoluteThermodynamicEnergyClaimed: false,
    mutatesState: false
  };
}
