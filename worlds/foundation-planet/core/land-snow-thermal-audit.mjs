import {
  PRESSURE_COLUMN_DRY_AIR_HEAT_CAPACITY_J_KG_K
} from './pressure-column.mjs';
import {
  ATMOSPHERE_PRESSURE_COLUMN_DYNAMICS_SCHEMA
} from './pressure-dynamics.mjs';
import {
  MIN_NATIVE_LAYER_AIR_TEMPERATURE_C,
  MAX_NATIVE_LAYER_AIR_TEMPERATURE_C
} from './phase-thermal-envelope.mjs';
import {
  LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA
} from './land-hydrology-thermal.mjs?v=0.72.0-r72.1';
import {
  ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_RECEIPT_SCHEMA
} from './atmosphere-land-water-thermal.mjs?v=0.73.0-r73.1';
import {
  LAND_SNOW_THERMAL_STATE_SCHEMA,
  LAND_SNOW_THERMAL_STEP_RECEIPT_SCHEMA,
  ATMOSPHERE_LAND_SNOW_THERMAL_RECEIPT_SCHEMA,
  LAND_SNOW_THERMAL_CLOSURE_SCHEMA,
  LAND_SNOW_THERMAL_CLOSURE_POLICY_SCHEMA,
  LAND_SNOW_ICE_SPECIFIC_HEAT_J_KG_K,
  LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_SNOW_THERMAL_ENERGY_ULP_FACTOR,
  LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM,
  LAND_SNOW_THERMAL_WATER_ULP_FACTOR
} from './land-snow-thermal.mjs?v=0.75.0-r75.1';
import {
  LAND_SURFACE_SNOW_THERMAL_RECEIPT_SCHEMA
} from './surface-snow-thermal.mjs?v=0.76.0-r76.1';

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
    id: 'atmosphere-land-snow-thermal-owner-lineage',
    status,
    required: status !== 'NOT_APPLICABLE',
    statement: 'Land snow persists sensible heat; snowfall and sublimation pair atmosphere transfers, while this organ leaves its downstream snowmelt cold-content handoff explicit.',
    detail
  };
}

function closureAudit(closure, kind, signedOperands) {
  const operands = signedOperands.map(Number);
  const validOperands = operands.length > 0 && operands.every(finite);
  const energy = kind === 'energy';
  const absoluteFloor = energy
    ? LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J
    : LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM;
  const ulpFactor = energy
    ? LAND_SNOW_THERMAL_ENERGY_ULP_FACTOR
    : LAND_SNOW_THERMAL_WATER_ULP_FACTOR;
  const unit = energy ? 'joules-per-square-metre' : 'millimetres-water';
  const residual = validOperands
    ? operands.reduce((sum, value) => sum + value, 0) : NaN;
  const tolerance = validOperands ? round(Math.max(absoluteFloor,
    operands.reduce((sum, value) => sum + Math.abs(value), 0) *
      Number.EPSILON * ulpFactor)) : NaN;
  const utilization = validOperands
    ? round(Math.abs(residual) / tolerance) : NaN;
  const embedded = closure?.signedOperands;
  const valid = validOperands &&
    closure?.schema === LAND_SNOW_THERMAL_CLOSURE_SCHEMA &&
    closure?.policy?.schema ===
      LAND_SNOW_THERMAL_CLOSURE_POLICY_SCHEMA &&
    closure?.policy?.kind === kind &&
    Number(closure?.policy?.absoluteFloor) === absoluteFloor &&
    Number(closure?.policy?.ulpFactor) === ulpFactor &&
    closure?.policy?.scaleBasis ===
      `sum-of-absolute-unrounded-signed-operands-${unit}` &&
    Array.isArray(embedded) && embedded.length === operands.length &&
    embedded.every((value, index) => same(value, operands[index], 1e-6)) &&
    same(closure?.residual, residual, 1e-6) &&
    same(closure?.numericTolerance, tolerance, 1e-12) &&
    Number(closure?.toleranceUtilization) === utilization &&
    closure?.closed === (Math.abs(residual) <= tolerance) &&
    closure?.measuredResidualPreserved === true;
  return { valid, residual, tolerance, utilization };
}

export function auditAtmosphereLandSnowThermal(column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', { kind: column?.kind || null });
  }
  const state = column?.land?.snowThermal;
  const owner = state?.owner || {};
  const step = state?.lastStepReceipt;
  const surfaceSnow = column?.land?.lastSurfaceSnowThermalReceipt;
  const boundary = column?.atmosphere
    ?.lastLandSnowThermalBoundaryReceipt;
  const expectedOwnerHeatJm2 =
    Number(owner.trackedSnowWaterEquivalentMm) *
    LAND_SNOW_ICE_SPECIFIC_HEAT_J_KG_K *
    Number(owner.snowTemperatureC);
  const ownerBindingValid = state?.schema ===
      LAND_SNOW_THERMAL_STATE_SCHEMA &&
    finite(owner.trackedSnowWaterEquivalentMm) &&
    Number(owner.trackedSnowWaterEquivalentMm) >= 0 &&
    same(owner.trackedSnowWaterEquivalentMm,
      column?.cryosphere?.snowWaterEquivalentMm,
      LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    finite(owner.snowTemperatureC) &&
    Number(owner.snowTemperatureC) >= -80 &&
    Number(owner.snowTemperatureC) <= 0 &&
    same(owner.sensibleHeatJm2, expectedOwnerHeatJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);
  const noHistoryCheckpoint = !step && !boundary &&
    (Number(column?.stepCount) === 0 ||
      state?.migrationCheckpoint === true);
  if (noHistoryCheckpoint) {
    const valid = ownerBindingValid &&
      state?.truth?.persistentLandSnowThermalOwner === true &&
      state?.migration?.historicalHeatReconstructed !== true;
    return result(valid ? 'PASS' : 'FAIL', {
      noHistoryCheckpoint: true,
      ownerBindingValid,
      migration: state?.migration || null
    });
  }

  const pressure = column?.atmosphere
    ?.lastPressureColumnDynamicsReceipt;
  const cryosphere = column?.cryosphere?.lastPhaseChangeReceipt;
  const land = column?.land?.hydrologyThermal?.lastStepReceipt;
  const liquid = column?.atmosphere
    ?.lastLandWaterThermalBoundaryReceipt;
  const snowfall = boundary?.snowfallTransfer || {};
  const sublimation = boundary?.sublimationTransfer || {};
  const snowmelt = boundary?.snowmeltTransfer || {};
  const stepSnowfall = step?.snowfallInput || {};
  const stepSnowmelt = step?.snowmeltOutput || {};
  const stepSublimation = step?.sublimationOutput || {};
  const initialSnowOwner = step?.initialOwner || {};
  const finalSnowOwner = step?.finalOwner || {};
  const downstreamSnowOwnerChainValid = surfaceSnow
    ? surfaceSnow.schema === LAND_SURFACE_SNOW_THERMAL_RECEIPT_SCHEMA &&
      receiptDigestValid(surfaceSnow) &&
      surfaceSnow.sourceLandSnowThermal?.receiptDigest === step?.digest &&
      surfaceSnow.sourceLandSnowThermal?.stepId === step?.stepId &&
      same(finalSnowOwner.trackedSnowWaterEquivalentMm,
        surfaceSnow.initialSnowOwner?.trackedSnowWaterEquivalentMm,
        LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
      same(finalSnowOwner.sensibleHeatJm2,
        surfaceSnow.initialSnowOwner?.sensibleHeatJm2,
        LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
      same(finalSnowOwner.snowTemperatureC,
        surfaceSnow.initialSnowOwner?.snowTemperatureC) &&
      same(surfaceSnow.finalSnowOwner?.trackedSnowWaterEquivalentMm,
        owner.trackedSnowWaterEquivalentMm,
        LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
      same(surfaceSnow.finalSnowOwner?.sensibleHeatJm2,
        owner.sensibleHeatJm2,
        LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
      same(surfaceSnow.finalSnowOwner?.snowTemperatureC,
        owner.snowTemperatureC)
    : same(finalSnowOwner.trackedSnowWaterEquivalentMm,
        owner.trackedSnowWaterEquivalentMm,
        LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
      same(finalSnowOwner.sensibleHeatJm2, owner.sensibleHeatJm2,
        LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);

  const sourceLineageValid =
    step?.schema === LAND_SNOW_THERMAL_STEP_RECEIPT_SCHEMA &&
    receiptDigestValid(step) &&
    boundary?.schema ===
      ATMOSPHERE_LAND_SNOW_THERMAL_RECEIPT_SCHEMA &&
    receiptDigestValid(boundary) &&
    pressure?.schema === ATMOSPHERE_PRESSURE_COLUMN_DYNAMICS_SCHEMA &&
    boundary?.sourcePressureDynamics?.schema === pressure.schema &&
    boundary?.sourcePressureDynamics?.receiptDigest ===
      stableDigest(pressure) &&
    cryosphere?.schema === EARTH_CRYOSPHERE_PHASE_SCHEMA &&
    boundary?.sourceCryospherePhase?.schema === cryosphere.schema &&
    boundary?.sourceCryospherePhase?.receiptDigest ===
      stableDigest(cryosphere) &&
    land?.schema === LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA &&
    receiptDigestValid(land) &&
    boundary?.sourceLandHydrologyThermal?.receiptDigest === land.digest &&
    liquid?.schema ===
      ATMOSPHERE_LAND_LIQUID_WATER_THERMAL_RECEIPT_SCHEMA &&
    receiptDigestValid(liquid) &&
    boundary?.sourceLiquidWaterThermalBoundary?.receiptDigest ===
      liquid.digest &&
    boundary?.sourceLandSnowThermal?.receiptDigest === step.digest &&
    boundary?.sourceLandSnowThermal?.stepId === step.stepId;

  const heat = transfer => Number(transfer.waterMm) *
    LAND_SNOW_ICE_SPECIFIC_HEAT_J_KG_K *
    Number(transfer.snowTemperatureC);
  const flowBindingsValid =
    same(snowfall.waterMm, pressure?.surfaceSnowfallMm,
      LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(snowfall.waterMm, cryosphere?.snowfallMm,
      LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(snowfall.waterMm, stepSnowfall.waterMm,
      LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(snowfall.sensibleHeatJm2, heat(snowfall),
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(snowfall.sensibleHeatJm2, stepSnowfall.sensibleHeatJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(sublimation.waterMm, cryosphere?.snowSublimationMm,
      LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(sublimation.waterMm, stepSublimation.transferredWaterMm,
      LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(sublimation.sensibleHeatJm2, heat(sublimation),
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(sublimation.sensibleHeatJm2,
      stepSublimation.sensibleHeatJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(snowmelt.waterMm, cryosphere?.snowmeltMm,
      LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(snowmelt.waterMm, land?.externalInputs?.snowmelt?.waterMm,
      LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(snowmelt.waterMm, stepSnowmelt.transferredWaterMm,
      LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM) &&
    same(snowmelt.sensibleHeatJm2, heat(snowmelt),
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    same(snowmelt.sensibleHeatJm2, stepSnowmelt.sensibleHeatJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);

  const snowWaterClosure = closureAudit(step?.waterClosure, 'water', [
    Number(finalSnowOwner.trackedSnowWaterEquivalentMm),
    -Number(initialSnowOwner.trackedSnowWaterEquivalentMm),
    -Number(stepSnowfall.waterMm),
    Number(stepSnowmelt.transferredWaterMm),
    Number(stepSublimation.transferredWaterMm)
  ]);
  const snowEnergyClosure = closureAudit(step?.energyClosure, 'energy', [
    Number(finalSnowOwner.sensibleHeatJm2),
    -Number(initialSnowOwner.sensibleHeatJm2),
    -Number(stepSnowfall.sensibleHeatJm2),
    Number(stepSnowmelt.sensibleHeatJm2),
    Number(stepSublimation.sensibleHeatJm2)
  ]);

  const initialAtmosphereOwner =
    boundary?.initialNativeAtmosphereOwner || {};
  const finalAtmosphereOwner =
    boundary?.finalNativeAtmosphereOwner || {};
  const nativeLayer = column?.atmosphere?.pressureColumn?.layers?.[0];
  const expectedHeatCapacityJm2K =
    Number(finalAtmosphereOwner.pressureThicknessHpa) * 100 / 9.80665 *
      PRESSURE_COLUMN_DRY_AIR_HEAT_CAPACITY_J_KG_K;
  const ownerChainValid =
    same(initialAtmosphereOwner.airTemperatureC,
      liquid?.finalNativeAtmosphereOwner?.airTemperatureC, 1e-12) &&
    same(initialAtmosphereOwner.sensibleHeatJm2,
      liquid?.finalNativeAtmosphereOwner?.sensibleHeatJm2, 1) &&
    same(finalAtmosphereOwner.heatCapacityJm2K,
      expectedHeatCapacityJm2K, 1e-6) &&
    same(finalAtmosphereOwner.sensibleHeatJm2,
      expectedHeatCapacityJm2K *
        Number(finalAtmosphereOwner.airTemperatureC), 1) &&
    Number(initialAtmosphereOwner.airTemperatureC) >=
      MIN_NATIVE_LAYER_AIR_TEMPERATURE_C &&
    Number(initialAtmosphereOwner.airTemperatureC) <=
      MAX_NATIVE_LAYER_AIR_TEMPERATURE_C &&
    Number(finalAtmosphereOwner.airTemperatureC) >=
      MIN_NATIVE_LAYER_AIR_TEMPERATURE_C &&
    Number(finalAtmosphereOwner.airTemperatureC) <=
      MAX_NATIVE_LAYER_AIR_TEMPERATURE_C &&
    same(finalAtmosphereOwner.airTemperatureC,
      nativeLayer?.airTemperatureC, 1e-12) &&
    downstreamSnowOwnerChainValid;
  const atmosphereOwnerClosure = closureAudit(
    boundary?.ownerEnergyClosure, 'energy', [
      Number(finalAtmosphereOwner.sensibleHeatJm2),
      -Number(initialAtmosphereOwner.sensibleHeatJm2),
      Number(snowfall.sensibleHeatJm2),
      -Number(sublimation.sensibleHeatJm2)
    ]);
  const moistEnthalpyClosure = closureAudit(
    boundary?.nativeMoistEnthalpyClosure, 'energy', [
      Number(boundary?.finalNativeMoistEnthalpyJm2),
      -Number(boundary?.initialNativeMoistEnthalpyJm2),
      Number(snowfall.sensibleHeatJm2),
      -Number(sublimation.sensibleHeatJm2)
    ]);
  const netAtmosphereSensibleHeatJm2 =
    Number(sublimation.sensibleHeatJm2) -
      Number(snowfall.sensibleHeatJm2);
  const unresolvedGapValid =
    snowmelt.sourceOwnerDebited === true &&
    snowmelt.liquidReceiverCredited === false &&
    snowmelt.coldContentWarmingOwnerDebited === false &&
    same(boundary?.unresolvedSnowmeltColdContent
      ?.coldContentWarmingRequiredJm2,
    -Number(snowmelt.sensibleHeatJm2),
    LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J) &&
    boundary?.unresolvedSnowmeltColdContent
      ?.warmingEnergyOwnerDebited === false &&
    boundary?.unresolvedSnowmeltColdContent
      ?.liquidReceiverCredited === false;
  const truthValid =
    state?.truth?.persistentLandSnowThermalOwner === true &&
    boundary?.truth?.persistentLandSnowThermalOwner === true &&
    boundary?.truth?.snowfallSensibleHeatSenderOwnerDebited === true &&
    boundary?.truth?.snowfallSnowpackThermalReceiverCredited === true &&
    boundary?.truth?.sublimationSensibleHeatSourceOwnerDebited === true &&
    boundary?.truth?.sublimationAtmosphereThermalReceiverCredited === true &&
    boundary?.truth?.snowmeltSensibleHeatSourceOwnerDebited === true &&
    boundary?.truth?.snowmeltLiquidReceiverSensibleHeatCredited === false &&
    boundary?.truth?.snowmeltColdContentWarmingOwnerDebited === false &&
    boundary?.truth?.latentHeatModeledByThisOrgan === false &&
    boundary?.truth?.resolvedSnowMicrophysics === false &&
    boundary?.truth?.resolvedSnowfallTemperature === false &&
    boundary?.truth?.scientificCalibrationClaimed === false &&
    boundary?.truth?.globalUnloadedBoundaryClaimed === false &&
    column?.truth?.persistentLandSnowThermalOwner === true &&
    column?.truth?.snowfallSensibleHeatSenderOwnerDebited === true &&
    column?.truth?.snowfallSnowpackThermalReceiverCredited === true &&
    column?.truth?.snowmeltSensibleHeatSourceOwnerDebited === true &&
    column?.truth?.sublimationSensibleHeatSourceOwnerDebited === true &&
    column?.truth?.sublimationAtmosphereThermalReceiverCredited === true;
  const budgetBindingValid = same(
    column?.budget?.atmosphereEnergy
      ?.surfaceFrozenWaterSensibleHeatNetInputJm2,
    netAtmosphereSensibleHeatJm2,
    LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);
  const valid = ownerBindingValid && sourceLineageValid &&
    flowBindingsValid && snowWaterClosure.valid &&
    snowEnergyClosure.valid && ownerChainValid &&
    atmosphereOwnerClosure.valid && moistEnthalpyClosure.valid &&
    unresolvedGapValid && truthValid && budgetBindingValid &&
    same(boundary?.netAtmosphereSensibleHeatJm2,
      netAtmosphereSensibleHeatJm2,
      LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);
  return result(valid ? 'PASS' : 'FAIL', {
    expectedStateSchema: LAND_SNOW_THERMAL_STATE_SCHEMA,
    expectedBoundarySchema: ATMOSPHERE_LAND_SNOW_THERMAL_RECEIPT_SCHEMA,
    actualStateSchema: state?.schema || null,
    actualBoundarySchema: boundary?.schema || null,
    ownerBindingValid,
    sourceLineageValid,
    flowBindingsValid,
    snowWaterClosure,
    snowEnergyClosure,
    ownerChainValid,
    downstreamSnowOwnerChainValid,
    atmosphereOwnerClosure,
    moistEnthalpyClosure,
    netAtmosphereSensibleHeatJm2,
    unresolvedGapValid,
    budgetBindingValid,
    truthValid
  });
}
