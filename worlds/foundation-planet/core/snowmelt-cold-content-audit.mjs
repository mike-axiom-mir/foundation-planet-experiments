import {
  LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA
} from './land-hydrology-thermal.mjs?v=0.72.0-r72.1';
import {
  LAND_SNOW_THERMAL_STEP_RECEIPT_SCHEMA,
  LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_SNOW_THERMAL_ENERGY_ULP_FACTOR,
  LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM
} from './land-snow-thermal.mjs?v=0.75.0-r75.1';
import {
  SURFACE_ENERGY_LEDGER_SCHEMA,
  LAND_SNOWMELT_COLD_CONTENT_RECEIPT_SCHEMA,
  LAND_SNOWMELT_COLD_CONTENT_CLOSURE_SCHEMA,
  LAND_SNOWMELT_COLD_CONTENT_CLOSURE_POLICY_SCHEMA
} from './snowmelt-cold-content.mjs?v=0.76.0-r76.1';

const EARTH_CRYOSPHERE_PHASE_SCHEMA =
  'axm.foundation-planet.cryosphere-phase-receipt/v1';
const finite = value => Number.isFinite(Number(value));
const same = (a, b, tolerance = 1e-12) => finite(a) && finite(b) &&
  Math.abs(Number(a) - Number(b)) <= tolerance;
const round = (value, digits = 12) =>
  Number(Number(value).toFixed(digits));
const clone = value => JSON.parse(JSON.stringify(value));

function stableDigest(value) {
  const text = JSON.stringify(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function receiptDigestValid(receipt) {
  if (!receipt || typeof receipt.digest !== 'string') return false;
  const unsigned = clone(receipt);
  delete unsigned.digest;
  return stableDigest(unsigned) === receipt.digest;
}

function result(status, detail) {
  return {
    id: 'land-snowmelt-cold-content-owner-lineage',
    status,
    required: status !== 'NOT_APPLICABLE',
    statement: 'Snowmelt cold-content warming is debited from the existing land surface-energy ledger and the same water is credited to land hydrology at exactly zero Celsius.',
    detail
  };
}

function closureAudit(closure, signedOperands) {
  const operands = signedOperands.map(Number);
  const validOperands = operands.length > 0 && operands.every(finite);
  const residual = validOperands
    ? operands.reduce((sum, value) => sum + value, 0) : NaN;
  const tolerance = validOperands ? round(Math.max(
    LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    operands.reduce((sum, value) => sum + Math.abs(value), 0) *
      Number.EPSILON * LAND_SNOW_THERMAL_ENERGY_ULP_FACTOR
  )) : NaN;
  const utilization = validOperands
    ? round(Math.abs(residual) / tolerance) : NaN;
  const embedded = closure?.signedOperands;
  const valid = validOperands &&
    closure?.schema ===
      LAND_SNOWMELT_COLD_CONTENT_CLOSURE_SCHEMA &&
    closure?.policy?.schema ===
      LAND_SNOWMELT_COLD_CONTENT_CLOSURE_POLICY_SCHEMA &&
    closure?.policy?.kind === 'energy' &&
    Number(closure?.policy?.absoluteFloor) ===
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J &&
    Number(closure?.policy?.ulpFactor) ===
      LAND_SNOW_THERMAL_ENERGY_ULP_FACTOR &&
    closure?.policy?.scaleBasis ===
      'sum-of-absolute-unrounded-signed-operands-joules-per-square-metre' &&
    Array.isArray(embedded) && embedded.length === operands.length &&
    embedded.every((value, index) =>
      same(value, operands[index], 1e-6)) &&
    same(closure?.residual, residual, 1e-6) &&
    same(closure?.numericTolerance, tolerance, 1e-12) &&
    Number(closure?.toleranceUtilization) === utilization &&
    closure?.closed === (Math.abs(residual) <= tolerance) &&
    closure?.measuredResidualPreserved === true;
  return { valid, residual, tolerance, utilization };
}

export function auditLandSnowmeltColdContent(column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', { kind: column?.kind || null });
  }
  const receipt = column?.land?.lastSnowmeltColdContentReceipt;
  if (!receipt) {
    const migrationCheckpoint = column?.land
      ?.snowmeltColdContentMigrationCheckpoint === true;
    const unstepped = Number(column?.stepCount || 0) === 0;
    return result(migrationCheckpoint || unstepped
      ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: migrationCheckpoint
        ? 'v36-to-v37 migration preserves owners without inventing historical cold-content transfer evidence'
        : unstepped
          ? 'the land column has not advanced yet'
          : 'a stepped current land column is missing its cold-content receipt',
      migrationCheckpoint,
      unstepped
    });
  }

  const snow = column?.land?.snowThermal?.lastStepReceipt;
  const liquid = column?.land?.hydrologyThermal?.lastStepReceipt;
  const cryosphere = column?.cryosphere?.lastPhaseChangeReceipt;
  const energy = column?.budget?.energy;
  const embeddedEnergy = receipt.sourceSurfaceEnergyLedger || {};
  const transfer = receipt.transfer || {};
  const snowmelt = snow?.snowmeltOutput || {};
  const liquidSnowmelt = liquid?.externalInputs?.snowmelt || {};
  const warmingEnergyJm2 = Number(transfer.warmingEnergyCreditedJm2);

  const sourceLineageValid =
    receipt.schema ===
      LAND_SNOWMELT_COLD_CONTENT_RECEIPT_SCHEMA &&
    receiptDigestValid(receipt) &&
    column?.budget?.snowmeltColdContent?.digest === receipt.digest &&
    snow?.schema === LAND_SNOW_THERMAL_STEP_RECEIPT_SCHEMA &&
    receiptDigestValid(snow) &&
    receipt.sourceLandSnowThermal?.receiptDigest === snow.digest &&
    receipt.sourceLandSnowThermal?.stepId === snow.stepId &&
    liquid?.schema === LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA &&
    receiptDigestValid(liquid) &&
    receipt.sourceLandHydrologyThermal?.receiptDigest === liquid.digest &&
    receipt.sourceLandHydrologyThermal?.stepId === liquid.stepId &&
    cryosphere?.schema === EARTH_CRYOSPHERE_PHASE_SCHEMA &&
    receipt.sourceCryospherePhase?.receiptDigest ===
      stableDigest(cryosphere) &&
    energy?.schema === SURFACE_ENERGY_LEDGER_SCHEMA &&
    embeddedEnergy.schema === energy.schema &&
    embeddedEnergy.stepId === energy.stepId;

  const transferBindingsValid =
    same(transfer.waterMm, snowmelt.transferredWaterMm,
      LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(transfer.waterMm, liquidSnowmelt.waterMm,
      LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(transfer.waterMm, cryosphere?.snowmeltMm,
      LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(transfer.initialSnowTemperatureC,
      snowmelt.snowTemperatureC) &&
    same(transfer.initialFrozenSensibleHeatJm2,
      snowmelt.sensibleHeatJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(warmingEnergyJm2,
      -Number(snowmelt.sensibleHeatJm2),
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(transfer.surfaceSensibleHeatDebitJm2,
      -warmingEnergyJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(transfer.finalLiquidTemperatureC, 0) &&
    same(transfer.finalLiquidTemperatureC,
      liquidSnowmelt.waterTemperatureC) &&
    same(transfer.finalLiquidSensibleHeatJm2, 0,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(transfer.finalLiquidSensibleHeatJm2,
      liquidSnowmelt.sensibleHeatJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);

  const energyBindingsValid =
    same(embeddedEnergy.snowmeltColdContentWarmingEnergyJm2,
      warmingEnergyJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(embeddedEnergy.surfaceSnowmeltColdContentDebitJm2,
      -warmingEnergyJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(energy.snowmeltColdContentWarmingEnergyJm2,
      warmingEnergyJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(energy.surfaceSnowmeltColdContentDebitJm2,
      -warmingEnergyJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(embeddedEnergy.surfaceSnowSensibleHeatTransferJm2,
      energy.surfaceSnowSensibleHeatTransferJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(Number(embeddedEnergy
      .surfaceRootZoneSensibleHeatTransferJm2 || 0),
      Number(energy.surfaceRootZoneSensibleHeatTransferJm2 || 0),
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(embeddedEnergy.storageChangeJm2,
      energy.storageChangeJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(embeddedEnergy.surfaceFluxEnergyJm2,
      energy.surfaceFluxEnergyJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(embeddedEnergy.boundaryHeatEnergyJm2,
      energy.boundaryHeatEnergyJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(embeddedEnergy.precipitationPhaseInputJm2,
      energy.precipitationPhaseInputJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(embeddedEnergy.phaseStorageChangeJm2,
      energy.phaseStorageChangeJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(receipt.sourceCryospherePhase?.phaseStorageChangeJm2,
      cryosphere?.phaseStorageChangeJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(receipt.sourceCryospherePhase?.sensibleToFusionJm2,
      cryosphere?.sensibleToFusionJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);

  const initialSurfaceOwner = embeddedEnergy
    .initialSurfaceSensibleHeatOwner || {};
  const finalSurfaceOwner = embeddedEnergy
    .finalSurfaceSensibleHeatOwner || {};
  const ownerBindingsValid =
    same(initialSurfaceOwner.sensibleHeatJm2,
      Number(initialSurfaceOwner.heatCapacityJm2K) *
        Number(initialSurfaceOwner.temperatureC),
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(finalSurfaceOwner.sensibleHeatJm2,
      Number(finalSurfaceOwner.heatCapacityJm2K) *
        Number(finalSurfaceOwner.temperatureC),
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(finalSurfaceOwner.heatCapacityJm2K,
      initialSurfaceOwner.heatCapacityJm2K, 1e-9) &&
    same(finalSurfaceOwner.sensibleHeatJm2 -
      initialSurfaceOwner.sensibleHeatJm2 +
      embeddedEnergy.phaseStorageChangeJm2,
    embeddedEnergy.storageChangeJm2,
    LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);

  const sourceDebitClosure = closureAudit(
    receipt.sourceDebitClosure, [
      Number(transfer.surfaceSensibleHeatDebitJm2),
      warmingEnergyJm2
    ]);
  const receiverTransitionClosure = closureAudit(
    receipt.receiverTransitionClosure, [
      Number(transfer.finalLiquidSensibleHeatJm2),
      -Number(transfer.initialFrozenSensibleHeatJm2),
      -warmingEnergyJm2
    ]);
  const surfaceEnergyOperands = [
      Number(embeddedEnergy.storageChangeJm2),
      -Number(embeddedEnergy.surfaceFluxEnergyJm2),
      -Number(embeddedEnergy.boundaryHeatEnergyJm2),
      -Number(embeddedEnergy.precipitationPhaseInputJm2),
      warmingEnergyJm2,
      Number(embeddedEnergy.surfaceSnowSensibleHeatTransferJm2)
    ];
  if (Object.prototype.hasOwnProperty.call(embeddedEnergy,
      'surfaceRootZoneSensibleHeatTransferJm2')) {
    surfaceEnergyOperands.push(Number(
      embeddedEnergy.surfaceRootZoneSensibleHeatTransferJm2));
  }
  const surfaceEnergyClosure = closureAudit(
    receipt.surfaceEnergyClosure, surfaceEnergyOperands);
  const truthValid =
    transfer.sourceOwnerDebited === true &&
    transfer.liquidReceiverCreditedAtZeroCelsius === true &&
    receipt.truth?.existingLandSurfaceSensibleHeatOwnerDebited === true &&
    receipt.truth?.snowmeltColdContentWarmingEnergyCredited === true &&
    receipt.truth?.landLiquidReceiverCreditedAtZeroCelsius === true &&
    receipt.truth?.fusionLatentHeatBoundToExistingCryosphereLedger === true &&
    receipt.truth?.latentHeatModeledByThisOrgan === false &&
    receipt.truth?.resolvedSnowConduction === false &&
    receipt.truth?.resolvedSnowMicrophysics === false &&
    receipt.truth?.scientificCalibrationClaimed === false &&
    receipt.truth?.globalUnloadedBoundaryClaimed === false &&
    column?.truth?.snowmeltLiquidReceiverSensibleHeatCredited === true &&
    column?.truth?.snowmeltColdContentWarmingOwnerDebited === true;
  const valid = sourceLineageValid && transferBindingsValid &&
    energyBindingsValid && ownerBindingsValid &&
    sourceDebitClosure.valid && receiverTransitionClosure.valid &&
    surfaceEnergyClosure.valid && truthValid;
  return result(valid ? 'PASS' : 'FAIL', {
    expectedReceiptSchema:
      LAND_SNOWMELT_COLD_CONTENT_RECEIPT_SCHEMA,
    actualReceiptSchema: receipt?.schema || null,
    sourceLineageValid,
    transferBindingsValid,
    energyBindingsValid,
    ownerBindingsValid,
    sourceDebitClosure,
    receiverTransitionClosure,
    surfaceEnergyClosure,
    truthValid,
    warmingEnergyJm2,
    waterMm: transfer.waterMm ?? null
  });
}
