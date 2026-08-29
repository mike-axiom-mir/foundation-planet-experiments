import {
  LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA
} from './land-hydrology-thermal.mjs?v=0.72.0-r72.1';
import {
  LAND_SNOW_THERMAL_STEP_RECEIPT_SCHEMA,
  LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_SNOW_THERMAL_ENERGY_ULP_FACTOR,
  LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM
} from './land-snow-thermal.mjs?v=0.75.0-r75.1';

export const SURFACE_ENERGY_LEDGER_SCHEMA =
  'axm.foundation-planet.surface-energy-ledger/v1';
export const LAND_SNOWMELT_COLD_CONTENT_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-snowmelt-cold-content-receipt/v1';
export const LAND_SNOWMELT_COLD_CONTENT_CLOSURE_SCHEMA =
  'axm.foundation-planet.land-snowmelt-cold-content-closure/v1';
export const LAND_SNOWMELT_COLD_CONTENT_CLOSURE_POLICY_SCHEMA =
  'axm.foundation-planet.land-snowmelt-cold-content-closure-policy/v1';

const EARTH_CRYOSPHERE_PHASE_SCHEMA =
  'axm.foundation-planet.cryosphere-phase-receipt/v1';
const finite = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;
const clone = value => JSON.parse(JSON.stringify(value));
const round = (value, digits = 12) =>
  Number(Number(value).toFixed(digits));

function stableDigest(value) {
  const text = JSON.stringify(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export function snowmeltColdContentReceiptValid(receipt) {
  if (receipt?.schema !==
      LAND_SNOWMELT_COLD_CONTENT_RECEIPT_SCHEMA ||
      typeof receipt.digest !== 'string') return false;
  const unsigned = clone(receipt);
  delete unsigned.digest;
  return stableDigest(unsigned) === receipt.digest;
}

function sourceReceiptDigestValid(receipt) {
  if (!receipt || typeof receipt.digest !== 'string') return false;
  const unsigned = clone(receipt);
  delete unsigned.digest;
  return stableDigest(unsigned) === receipt.digest;
}

function closure(signedOperands) {
  const operands = signedOperands.map(Number);
  const residual = operands.reduce((sum, value) => sum + value, 0);
  const scale = operands.reduce((sum, value) =>
    sum + Math.abs(value), 0);
  const numericTolerance = Math.max(
    LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    scale * Number.EPSILON * LAND_SNOW_THERMAL_ENERGY_ULP_FACTOR
  );
  return {
    schema: LAND_SNOWMELT_COLD_CONTENT_CLOSURE_SCHEMA,
    policy: {
      schema: LAND_SNOWMELT_COLD_CONTENT_CLOSURE_POLICY_SCHEMA,
      kind: 'energy',
      absoluteFloor: LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
      ulpFactor: LAND_SNOW_THERMAL_ENERGY_ULP_FACTOR,
      scaleBasis:
        'sum-of-absolute-unrounded-signed-operands-joules-per-square-metre'
    },
    signedOperands: operands,
    residual: Number(residual),
    numericTolerance: Number(numericTolerance),
    toleranceUtilization: round(Math.abs(residual) / numericTolerance),
    closed: Math.abs(residual) <= numericTolerance,
    measuredResidualPreserved: true
  };
}

export function coupleLandSnowmeltColdContent(column,
  landSnowThermalReceipt, landHydrologyThermalReceipt,
  cryospherePhaseReceipt, surfaceEnergyLedger, context = {}) {
  if (column?.kind !== 'land' || !column?.land) {
    throw new Error('Snowmelt cold-content coupling requires a land column');
  }
  if (landSnowThermalReceipt?.schema !==
        LAND_SNOW_THERMAL_STEP_RECEIPT_SCHEMA ||
      !sourceReceiptDigestValid(landSnowThermalReceipt) ||
      landHydrologyThermalReceipt?.schema !==
        LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA ||
      !sourceReceiptDigestValid(landHydrologyThermalReceipt) ||
      cryospherePhaseReceipt?.schema !==
        EARTH_CRYOSPHERE_PHASE_SCHEMA ||
      surfaceEnergyLedger?.schema !== SURFACE_ENERGY_LEDGER_SCHEMA) {
    throw new Error('Snowmelt cold-content coupling requires current typed source receipts');
  }
  const snowmelt = landSnowThermalReceipt.snowmeltOutput || {};
  const liquid = landHydrologyThermalReceipt.externalInputs?.snowmelt || {};
  const warmingRequiredJm2 = Math.max(0, finite(
    landSnowThermalReceipt.unresolvedSnowmeltColdContent
      ?.coldContentWarmingRequiredJm2));
  const waterMm = Math.max(0, finite(snowmelt.transferredWaterMm));
  const bindingsValid =
    Math.abs(waterMm - finite(liquid.waterMm)) <=
      LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM &&
    Math.abs(waterMm - finite(cryospherePhaseReceipt.snowmeltMm)) <=
      LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM &&
    Math.abs(warmingRequiredJm2 + finite(snowmelt.sensibleHeatJm2)) <=
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J &&
    Math.abs(warmingRequiredJm2 - finite(surfaceEnergyLedger
      .snowmeltColdContentWarmingEnergyJm2)) <=
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J &&
    Math.abs(finite(surfaceEnergyLedger
      .surfaceSnowmeltColdContentDebitJm2) + warmingRequiredJm2) <=
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J &&
    Math.abs(finite(liquid.waterTemperatureC)) <= 1e-12 &&
    Math.abs(finite(liquid.sensibleHeatJm2)) <=
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J;
  if (!bindingsValid) {
    throw new Error('Snowmelt cold-content source and receiver receipts are detached');
  }

  const sourceDebitClosure = closure([
    finite(surfaceEnergyLedger.surfaceSnowmeltColdContentDebitJm2),
    warmingRequiredJm2
  ]);
  const receiverTransitionClosure = closure([
    finite(liquid.sensibleHeatJm2),
    -finite(snowmelt.sensibleHeatJm2),
    -warmingRequiredJm2
  ]);
  const surfaceEnergyClosure = closure([
    finite(surfaceEnergyLedger.storageChangeJm2),
    -finite(surfaceEnergyLedger.surfaceFluxEnergyJm2),
    -finite(surfaceEnergyLedger.boundaryHeatEnergyJm2),
    -finite(surfaceEnergyLedger.precipitationPhaseInputJm2),
    warmingRequiredJm2,
    finite(surfaceEnergyLedger.surfaceSnowSensibleHeatTransferJm2),
    finite(surfaceEnergyLedger.surfaceRootZoneSensibleHeatTransferJm2)
  ]);
  if (!sourceDebitClosure.closed ||
      !receiverTransitionClosure.closed ||
      !surfaceEnergyClosure.closed) {
    throw new Error('Snowmelt cold-content energy transfer did not close');
  }

  const stepId = String(context.stepId ||
    `${landSnowThermalReceipt.stepId}:cold-content`);
  const receipt = {
    schema: LAND_SNOWMELT_COLD_CONTENT_RECEIPT_SCHEMA,
    stepId,
    status: waterMm > LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM
      ? 'snowmelt-cold-content-warmed-and-liquid-credited'
      : 'no-snowmelt-cold-content-transfer',
    sourceLandSnowThermal: {
      schema: landSnowThermalReceipt.schema,
      receiptDigest: landSnowThermalReceipt.digest,
      stepId: landSnowThermalReceipt.stepId
    },
    sourceLandHydrologyThermal: {
      schema: landHydrologyThermalReceipt.schema,
      receiptDigest: landHydrologyThermalReceipt.digest,
      stepId: landHydrologyThermalReceipt.stepId
    },
    sourceCryospherePhase: {
      schema: cryospherePhaseReceipt.schema,
      receiptDigest: stableDigest(cryospherePhaseReceipt),
      snowmeltMm: Number(cryospherePhaseReceipt.snowmeltMm),
      sensibleToFusionJm2: Number(
        cryospherePhaseReceipt.sensibleToFusionJm2),
      phaseStorageChangeJm2: Number(
        cryospherePhaseReceipt.phaseStorageChangeJm2)
    },
    sourceSurfaceEnergyLedger: {
      schema: surfaceEnergyLedger.schema,
      stepId: surfaceEnergyLedger.stepId,
      initialSurfaceSensibleHeatOwner: clone(
        surfaceEnergyLedger.initialSurfaceSensibleHeatOwner),
      finalSurfaceSensibleHeatOwner: clone(
        surfaceEnergyLedger.finalSurfaceSensibleHeatOwner),
      surfaceFluxEnergyJm2: Number(
        surfaceEnergyLedger.surfaceFluxEnergyJm2),
      boundaryHeatEnergyJm2: Number(
        surfaceEnergyLedger.boundaryHeatEnergyJm2),
      precipitationPhaseInputJm2: Number(
        surfaceEnergyLedger.precipitationPhaseInputJm2),
      phaseStorageChangeJm2: Number(
        surfaceEnergyLedger.phaseStorageChangeJm2),
      storageChangeJm2: Number(surfaceEnergyLedger.storageChangeJm2),
      snowmeltColdContentWarmingEnergyJm2: Number(
        surfaceEnergyLedger.snowmeltColdContentWarmingEnergyJm2),
      surfaceSnowmeltColdContentDebitJm2: Number(
        surfaceEnergyLedger.surfaceSnowmeltColdContentDebitJm2),
      surfaceSnowSensibleHeatTransferJm2: Number(
        surfaceEnergyLedger.surfaceSnowSensibleHeatTransferJm2),
      surfaceRootZoneSensibleHeatTransferJm2: Number(
        surfaceEnergyLedger.surfaceRootZoneSensibleHeatTransferJm2),
      residualJm2: Number(surfaceEnergyLedger.residualJm2)
    },
    transfer: {
      transferId: `${stepId}:surface-to-snowmelt`,
      waterMm,
      initialSnowTemperatureC: Number(snowmelt.snowTemperatureC),
      initialFrozenSensibleHeatJm2: Number(
        snowmelt.sensibleHeatJm2),
      surfaceSensibleHeatDebitJm2: Number(-warmingRequiredJm2),
      warmingEnergyCreditedJm2: Number(warmingRequiredJm2),
      finalLiquidTemperatureC: Number(liquid.waterTemperatureC),
      finalLiquidSensibleHeatJm2: Number(liquid.sensibleHeatJm2),
      sourceKind: 'existing-land-surface-sensible-heat-owner',
      receiverKind: 'persistent-land-hydrology-surface-water-owner',
      sourceOwnerDebited: true,
      liquidReceiverCreditedAtZeroCelsius: true
    },
    sourceDebitClosure,
    receiverTransitionClosure,
    surfaceEnergyClosure,
    truth: {
      existingLandSurfaceSensibleHeatOwnerDebited: true,
      snowmeltColdContentWarmingEnergyCredited: true,
      landLiquidReceiverCreditedAtZeroCelsius: true,
      snowmeltSensibleTransitionClosed: true,
      surfaceEnergyLedgerClosed: true,
      sourceReceiptsExactlyBound: true,
      scaleAwareNumericClosure: true,
      measuredResidualsPreserved: true,
      fixedAbsoluteToleranceOnly: false,
      fusionLatentHeatBoundToExistingCryosphereLedger: true,
      latentHeatModeledByThisOrgan: false,
      resolvedSnowConduction: false,
      resolvedSnowMicrophysics: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  receipt.digest = stableDigest(receipt);
  column.land.lastSnowmeltColdContentReceipt = clone(receipt);
  column.land.snowmeltColdContentMigrationCheckpoint = false;
  return clone(receipt);
}

export function snowmeltColdContentDescription() {
  return {
    receiptSchema: LAND_SNOWMELT_COLD_CONTENT_RECEIPT_SCHEMA,
    surfaceEnergyLedgerSchema: SURFACE_ENERGY_LEDGER_SCHEMA,
    closureSchema: LAND_SNOWMELT_COLD_CONTENT_CLOSURE_SCHEMA,
    closurePolicySchema:
      LAND_SNOWMELT_COLD_CONTENT_CLOSURE_POLICY_SCHEMA,
    sourceOwner: 'existing-land-surface-sensible-heat-owner',
    liquidReferenceTemperatureC: 0,
    latentHeatModeledByThisOrgan: false,
    resolvedSnowConduction: false,
    resolvedSnowMicrophysics: false,
    scientificCalibrationClaimed: false,
    globalUnloadedBoundaryClaimed: false
  };
}
