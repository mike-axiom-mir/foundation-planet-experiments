import {
  FLOODPLAIN_STATE_SCHEMA,
  normalizeFloodplainState
} from './floodplain.mjs?v=0.65.0-r65.1';

export const FLOODPLAIN_THERMAL_STATE_SCHEMA =
  'axm.foundation-planet.floodplain-thermal-state/v2';
export const PREVIOUS_FLOODPLAIN_THERMAL_STATE_SCHEMA =
  'axm.foundation-planet.floodplain-thermal-state/v1';
export const FLOODPLAIN_THERMAL_RECEIPT_SCHEMA =
  'axm.foundation-planet.floodplain-thermal-receipt/v2';
export const PREVIOUS_FLOODPLAIN_THERMAL_RECEIPT_SCHEMA =
  'axm.foundation-planet.floodplain-thermal-receipt/v1';
export const FLOODPLAIN_THERMAL_ENERGY_CLOSURE_SCHEMA =
  'axm.foundation-planet.floodplain-thermal-energy-closure/v1';
export const FLOODPLAIN_THERMAL_ENERGY_CLOSURE_POLICY_SCHEMA =
  'axm.foundation-planet.floodplain-thermal-energy-closure-policy/v1';
export const WATER_SPECIFIC_HEAT_J_KG_K = 4_184;
export const FLOODPLAIN_THERMAL_ENERGY_ABSOLUTE_FLOOR_J = 1;
export const FLOODPLAIN_THERMAL_ENERGY_ULP_FACTOR = 8;
export const FLOODPLAIN_THERMAL_WATER_ABSOLUTE_FLOOR_KG = 1e-6;
export const FLOODPLAIN_THERMAL_WATER_ULP_FACTOR = 8;

const MINIMUM_LIQUID_WATER_TEMPERATURE_C = -2;
const MAXIMUM_LIQUID_WATER_TEMPERATURE_C = 45;
const finite = (value, fallback = 0) => Number.isFinite(Number(value))
  ? Number(value) : fallback;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const clone = value => JSON.parse(JSON.stringify(value));
const round = (value, digits = 9) => Number(Number(value).toFixed(digits));

function stableDigest(value) {
  const text = JSON.stringify(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

function liquidTemperature(value, fallback = 15) {
  return clamp(finite(value, fallback),
    MINIMUM_LIQUID_WATER_TEMPERATURE_C,
    MAXIMUM_LIQUID_WATER_TEMPERATURE_C);
}

function sensibleHeatJ(waterKg, temperatureC) {
  return Math.max(0, finite(waterKg)) * WATER_SPECIFIC_HEAT_J_KG_K *
    liquidTemperature(temperatureC);
}

function truth() {
  return {
    persistentFloodplainWaterTemperatureState: true,
    persistentFloodplainSensibleHeatOwner: true,
    netWaterOwnerChangeThermallyReconciled: true,
    scaleAwareNumericEnergyClosure: true,
    measuredEnergyResidualPreserved: true,
    fixedAbsoluteEnergyToleranceOnly: false,
    scaleAwareNumericWaterClosure: true,
    measuredWaterResidualPreserved: true,
    fixedAbsoluteWaterToleranceOnly: false,
    sharedReactionTemperatureSource: true,
    channelWaterTemperatureResolved: false,
    externalThermalBoundaryOwnerDebited: false,
    resolvedFreezeThawState: false,
    latentHeatModeled: false,
    scientificCalibrationClaimed: false
  };
}

export function floodplainThermalEnergyToleranceJ(signedOperandsJ = []) {
  const absoluteOperandSumJ = signedOperandsJ.reduce((sum, operand) =>
    sum + Math.abs(finite(operand)), 0);
  return round(Math.max(
    FLOODPLAIN_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    absoluteOperandSumJ * Number.EPSILON *
      FLOODPLAIN_THERMAL_ENERGY_ULP_FACTOR
  ), 12);
}

export function floodplainThermalWaterToleranceKg(
  signedOperandsKg = []) {
  const absoluteOperandSumKg = signedOperandsKg.reduce((sum, operand) =>
    sum + Math.abs(finite(operand)), 0);
  return round(Math.max(
    FLOODPLAIN_THERMAL_WATER_ABSOLUTE_FLOOR_KG,
    absoluteOperandSumKg * Number.EPSILON *
      FLOODPLAIN_THERMAL_WATER_ULP_FACTOR
  ), 12);
}

function energyClosure(signedOperandsJ) {
  const residualJ = signedOperandsJ.reduce((sum, operand) =>
    sum + finite(operand), 0);
  const numericToleranceJ = floodplainThermalEnergyToleranceJ(
    signedOperandsJ);
  return {
    schema: FLOODPLAIN_THERMAL_ENERGY_CLOSURE_SCHEMA,
    applicable: true,
    policy: {
      schema: FLOODPLAIN_THERMAL_ENERGY_CLOSURE_POLICY_SCHEMA,
      absoluteFloorJ: FLOODPLAIN_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
      ulpFactor: FLOODPLAIN_THERMAL_ENERGY_ULP_FACTOR,
      scaleBasis: 'sum-of-absolute-unrounded-signed-operands-joules'
    },
    sensibleHeat: {
      signedOperandsJ: signedOperandsJ.map(Number),
      residualJ: Number(residualJ),
      numericToleranceJ,
      toleranceUtilization: round(
        Math.abs(residualJ) / numericToleranceJ, 12),
      closed: Math.abs(residualJ) <= numericToleranceJ
    },
    identityCount: 1,
    maximumResidualJ: Math.abs(residualJ),
    maximumToleranceJ: numericToleranceJ,
    maximumToleranceUtilization: round(
      Math.abs(residualJ) / numericToleranceJ, 12),
    conservationClosed: Math.abs(residualJ) <= numericToleranceJ,
    measuredResidualPreserved: true
  };
}

function migrationClosure(initializationHeatJ) {
  return {
    schema: FLOODPLAIN_THERMAL_ENERGY_CLOSURE_SCHEMA,
    applicable: false,
    reason: 'pre-r66-floodplain-heat-history-unobserved',
    policy: {
      schema: FLOODPLAIN_THERMAL_ENERGY_CLOSURE_POLICY_SCHEMA,
      absoluteFloorJ: FLOODPLAIN_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
      ulpFactor: FLOODPLAIN_THERMAL_ENERGY_ULP_FACTOR,
      scaleBasis: 'sum-of-absolute-unrounded-signed-operands-joules'
    },
    initializationHeatJ: Number(initializationHeatJ),
    sensibleHeat: null,
    identityCount: 0,
    maximumResidualJ: null,
    maximumToleranceJ: null,
    maximumToleranceUtilization: null,
    conservationClosed: null,
    measuredResidualPreserved: false
  };
}

export function emptyFloodplainThermalState(options = {}) {
  const waterTemperatureC = liquidTemperature(
    options.initialWaterTemperatureC, 15);
  const trackedWaterKg = Math.max(0, finite(options.trackedWaterKg));
  return {
    schema: FLOODPLAIN_THERMAL_STATE_SCHEMA,
    migrationCheckpoint: options.migrationCheckpoint === true,
    waterTemperatureC,
    trackedWaterKg,
    sensibleHeatJ: sensibleHeatJ(trackedWaterKg, waterTemperatureC),
    observedThermalDays: 0,
    dryDays: 0,
    cumulativeNetAdvectedHeatJ: 0,
    cumulativeBoundaryHeatJ: 0,
    lastTransitionReceipt: null,
    truth: truth()
  };
}

export function normalizeFloodplainThermalState(source, options = {}) {
  if (![FLOODPLAIN_THERMAL_STATE_SCHEMA,
    PREVIOUS_FLOODPLAIN_THERMAL_STATE_SCHEMA].includes(source?.schema)) {
    return emptyFloodplainThermalState(options);
  }
  const trackedWaterKg = Math.max(0, finite(source.trackedWaterKg));
  let waterTemperatureC = liquidTemperature(source.waterTemperatureC, 15);
  let ownedSensibleHeatJ = finite(source.sensibleHeatJ,
    sensibleHeatJ(trackedWaterKg, waterTemperatureC));
  if (trackedWaterKg <= 1e-12) {
    ownedSensibleHeatJ = 0;
  } else {
    waterTemperatureC = liquidTemperature(
      ownedSensibleHeatJ /
        (trackedWaterKg * WATER_SPECIFIC_HEAT_J_KG_K),
      waterTemperatureC);
    ownedSensibleHeatJ = sensibleHeatJ(trackedWaterKg, waterTemperatureC);
  }
  return {
    schema: FLOODPLAIN_THERMAL_STATE_SCHEMA,
    migrationCheckpoint: source.migrationCheckpoint === true,
    waterTemperatureC,
    trackedWaterKg,
    sensibleHeatJ: ownedSensibleHeatJ,
    observedThermalDays: Math.max(0, finite(source.observedThermalDays)),
    dryDays: Math.max(0, finite(source.dryDays)),
    cumulativeNetAdvectedHeatJ: finite(
      source.cumulativeNetAdvectedHeatJ),
    cumulativeBoundaryHeatJ: finite(source.cumulativeBoundaryHeatJ),
    lastTransitionReceipt: source.schema === FLOODPLAIN_THERMAL_STATE_SCHEMA &&
      source.lastTransitionReceipt?.schema ===
      FLOODPLAIN_THERMAL_RECEIPT_SCHEMA
      ? clone(source.lastTransitionReceipt) : null,
    truth: truth()
  };
}

export function floodplainThermalSummary(source) {
  const state = normalizeFloodplainThermalState(source);
  return {
    migrationCheckpoint: state.migrationCheckpoint,
    waterTemperatureC: round(state.waterTemperatureC, 9),
    trackedWaterKg: round(state.trackedWaterKg, 6),
    sensibleHeatJ: round(state.sensibleHeatJ, 3),
    observedThermalDays: round(state.observedThermalDays, 8),
    dryDays: round(state.dryDays, 8),
    cumulativeNetAdvectedHeatJ: round(
      state.cumulativeNetAdvectedHeatJ, 3),
    cumulativeBoundaryHeatJ: round(state.cumulativeBoundaryHeatJ, 3),
    lastEnergyResidualJ: state.lastTransitionReceipt?.energyClosure
      ?.sensibleHeat?.residualJ ?? null,
    lastEnergyToleranceJ: state.lastTransitionReceipt?.energyClosure
      ?.sensibleHeat?.numericToleranceJ ?? null,
    lastEnergyToleranceUtilization: state.lastTransitionReceipt
      ?.energyClosure?.sensibleHeat?.toleranceUtilization ?? null,
    truth: truth()
  };
}

export function advanceFloodplainThermal(source, floodplainSource,
  context = {}) {
  if (floodplainSource?.schema !== FLOODPLAIN_STATE_SCHEMA) {
    throw new Error('Floodplain thermal step requires a current floodplain material owner');
  }
  const state = normalizeFloodplainThermalState(source, {
    migrationCheckpoint: context.migrationCheckpoint === true
  });
  const floodplain = normalizeFloodplainState(floodplainSource);
  const durationDays = finite(context.durationDays, 1);
  if (!(durationDays > 0) || durationDays > 1.000001) {
    throw new Error('Floodplain thermal step must be greater than zero and no longer than one day');
  }
  const reachId = String(context.reachId || '');
  const startDay = round(finite(context.startDay), 8);
  const currentWaterKg = Math.max(0, finite(floodplain.waterKg));
  const surfaceBoundaryTemperatureC = liquidTemperature(
    context.surfaceBoundaryTemperatureC, 15);
  const incomingWaterTemperatureC = liquidTemperature(
    context.incomingWaterTemperatureC,
    surfaceBoundaryTemperatureC);
  const incomingWaterTemperatureSourceKind = String(
    context.incomingWaterTemperatureSourceKind ||
      'surface-boundary-fallback');
  const riverThermalReceiptDigest =
    typeof context.riverThermalReceiptDigest === 'string' &&
      context.riverThermalReceiptDigest.length > 0
      ? context.riverThermalReceiptDigest : null;
  const channelWaterTemperatureResolved =
    incomingWaterTemperatureSourceKind ===
      'persistent-river-thermal-state' &&
    riverThermalReceiptDigest !== null;
  const relaxationTimescaleDays = clamp(finite(
    context.relaxationTimescaleDays, 3), .125, 120);
  const channelToFloodplainWaterKg = Math.max(0, finite(
    context.channelToFloodplainWaterKg));
  const channelFromFloodplainWaterKg = Math.max(0, finite(
    context.channelFromFloodplainWaterKg));
  const outgoingWaterTemperatureC = liquidTemperature(
    context.outgoingWaterTemperatureC, state.waterTemperatureC);

  if (state.migrationCheckpoint) {
    const initializationTemperatureC = currentWaterKg > 1e-12
      ? incomingWaterTemperatureC : surfaceBoundaryTemperatureC;
    const initializationHeatJ = sensibleHeatJ(currentWaterKg,
      initializationTemperatureC);
    state.migrationCheckpoint = false;
    state.waterTemperatureC = initializationTemperatureC;
    state.trackedWaterKg = currentWaterKg;
    state.sensibleHeatJ = initializationHeatJ;
    const receipt = {
      schema: FLOODPLAIN_THERMAL_RECEIPT_SCHEMA,
      reachId,
      status: 'initialized-after-migration-no-historical-heat',
      startDay,
      durationDays: round(durationDays, 8),
      water: {
        initialTrackedKg: null,
        finalTrackedKg: Number(currentWaterKg),
        netOwnerChangeKg: null,
        modeledInflowKg: null,
        modeledOutflowKg: null
      },
      temperatures: {
        initialWaterTemperatureC: null,
        incomingWaterTemperatureC: Number(incomingWaterTemperatureC),
        surfaceBoundaryTemperatureC:
          Number(surfaceBoundaryTemperatureC),
        mixedWaterTemperatureC: null,
        finalWaterTemperatureC: Number(initializationTemperatureC)
      },
      temperatureSource: {
        kind: incomingWaterTemperatureSourceKind,
        sourceReceiptDigest: riverThermalReceiptDigest,
        sourceWaterTemperatureC: Number(incomingWaterTemperatureC),
        exactPersistentSource: channelWaterTemperatureResolved
      },
      channelExchange: {
        toFloodplainWaterKg: Number(channelToFloodplainWaterKg),
        fromFloodplainWaterKg: Number(channelFromFloodplainWaterKg),
        incomingWaterTemperatureC: Number(incomingWaterTemperatureC),
        outgoingWaterTemperatureC: Number(outgoingWaterTemperatureC),
        heatToFloodplainJ: null,
        heatFromFloodplainJ: null,
        netOnly: true,
        historicallyClosed: false
      },
      energy: {
        initialSensibleHeatJ: null,
        inflowHeatJ: null,
        outflowHeatJ: null,
        externalBoundaryHeatJ: null,
        finalSensibleHeatJ: Number(initializationHeatJ)
      },
      energyClosure: migrationClosure(initializationHeatJ),
      truth: {
        ...truth(),
        migrationInventedHistoricalHeat: false,
        energyClosureApplicable: false,
        currentMaterialOwnerObserved: true,
        channelWaterTemperatureResolved,
        sameStepSurfaceTemperatureProxyUsed:
          !channelWaterTemperatureResolved
      }
    };
    receipt.digest = stableDigest(receipt);
    state.lastTransitionReceipt = clone(receipt);
    return {
      state: normalizeFloodplainThermalState(state),
      receipt: clone(receipt)
    };
  }

  const initialTrackedWaterKg = state.trackedWaterKg;
  const initialWaterTemperatureC = state.waterTemperatureC;
  const initialSensibleHeatJ = state.sensibleHeatJ;
  const netOwnerChangeKg = currentWaterKg - initialTrackedWaterKg;
  const localOwnerChangeKg = netOwnerChangeKg -
    channelToFloodplainWaterKg + channelFromFloodplainWaterKg;
  const localOwnerInflowKg = Math.max(0, localOwnerChangeKg);
  const localOwnerOutflowKg = Math.max(0, -localOwnerChangeKg);
  const modeledInflowKg = channelToFloodplainWaterKg +
    localOwnerInflowKg;
  const modeledOutflowKg = channelFromFloodplainWaterKg +
    localOwnerOutflowKg;
  const waterResidualKg = initialTrackedWaterKg + modeledInflowKg -
    modeledOutflowKg - currentWaterKg;
  const waterToleranceKg = floodplainThermalWaterToleranceKg([
    initialTrackedWaterKg,
    modeledInflowKg,
    -modeledOutflowKg,
    -currentWaterKg
  ]);
  const localOwnerTemperatureC = initialTrackedWaterKg > 1e-12
    ? initialWaterTemperatureC : surfaceBoundaryTemperatureC;
  const channelInflowHeatJ = sensibleHeatJ(
    channelToFloodplainWaterKg, incomingWaterTemperatureC);
  const channelOutflowHeatJ = sensibleHeatJ(
    channelFromFloodplainWaterKg, outgoingWaterTemperatureC);
  const localOwnerInflowHeatJ = sensibleHeatJ(
    localOwnerInflowKg, localOwnerTemperatureC);
  const localOwnerOutflowHeatJ = sensibleHeatJ(
    localOwnerOutflowKg, localOwnerTemperatureC);
  const inflowHeatJ = channelInflowHeatJ + localOwnerInflowHeatJ;
  const outflowHeatJ = channelOutflowHeatJ + localOwnerOutflowHeatJ;
  const preBoundarySensibleHeatJ = initialSensibleHeatJ + inflowHeatJ -
    outflowHeatJ;
  const mixedWaterTemperatureC = currentWaterKg > 1e-12
    ? liquidTemperature(preBoundarySensibleHeatJ /
      (currentWaterKg * WATER_SPECIFIC_HEAT_J_KG_K),
    incomingWaterTemperatureC) : surfaceBoundaryTemperatureC;
  const relaxationFraction = currentWaterKg > 1e-12
    ? 1 - Math.exp(-durationDays / relaxationTimescaleDays) : 0;
  const externalBoundaryHeatJ = currentWaterKg *
    WATER_SPECIFIC_HEAT_J_KG_K *
    (surfaceBoundaryTemperatureC - mixedWaterTemperatureC) *
    relaxationFraction;
  const finalSensibleHeatJ = currentWaterKg > 1e-12
    ? preBoundarySensibleHeatJ + externalBoundaryHeatJ : 0;
  const finalWaterTemperatureC = currentWaterKg > 1e-12
    ? liquidTemperature(finalSensibleHeatJ /
      (currentWaterKg * WATER_SPECIFIC_HEAT_J_KG_K),
    surfaceBoundaryTemperatureC) : surfaceBoundaryTemperatureC;
  const canonicalFinalSensibleHeatJ = sensibleHeatJ(currentWaterKg,
    finalWaterTemperatureC);
  const closure = energyClosure([
    canonicalFinalSensibleHeatJ,
    -initialSensibleHeatJ,
    -inflowHeatJ,
    outflowHeatJ,
    -externalBoundaryHeatJ
  ]);

  state.waterTemperatureC = finalWaterTemperatureC;
  state.trackedWaterKg = currentWaterKg;
  state.sensibleHeatJ = canonicalFinalSensibleHeatJ;
  if (currentWaterKg > 1e-12) {
    state.observedThermalDays += durationDays;
  } else {
    state.dryDays += durationDays;
  }
  state.cumulativeNetAdvectedHeatJ += inflowHeatJ - outflowHeatJ;
  state.cumulativeBoundaryHeatJ += externalBoundaryHeatJ;
  const receipt = {
    schema: FLOODPLAIN_THERMAL_RECEIPT_SCHEMA,
    reachId,
    status: currentWaterKg > 1e-12
      ? 'persistent-water-thermal-step' : 'dry-no-water-heat-storage',
    startDay,
    durationDays: round(durationDays, 8),
    controls: {
      relaxationTimescaleDays: round(relaxationTimescaleDays, 9),
      relaxationFraction: Number(relaxationFraction),
      specificHeatJkgK: WATER_SPECIFIC_HEAT_J_KG_K,
      minimumLiquidWaterTemperatureC:
        MINIMUM_LIQUID_WATER_TEMPERATURE_C,
      maximumLiquidWaterTemperatureC:
        MAXIMUM_LIQUID_WATER_TEMPERATURE_C
    },
    water: {
      initialTrackedKg: Number(initialTrackedWaterKg),
      finalTrackedKg: Number(currentWaterKg),
      netOwnerChangeKg: Number(netOwnerChangeKg),
      modeledInflowKg: Number(modeledInflowKg),
      modeledOutflowKg: Number(modeledOutflowKg),
      residualKg: Number(waterResidualKg),
      numericToleranceKg: Number(waterToleranceKg)
    },
    temperatures: {
      initialWaterTemperatureC: Number(initialWaterTemperatureC),
      incomingWaterTemperatureC: Number(incomingWaterTemperatureC),
      surfaceBoundaryTemperatureC: Number(surfaceBoundaryTemperatureC),
      mixedWaterTemperatureC: Number(mixedWaterTemperatureC),
      finalWaterTemperatureC: Number(finalWaterTemperatureC)
    },
    temperatureSource: {
      kind: incomingWaterTemperatureSourceKind,
      sourceReceiptDigest: riverThermalReceiptDigest,
      sourceWaterTemperatureC: Number(incomingWaterTemperatureC),
      exactPersistentSource: channelWaterTemperatureResolved
    },
    channelExchange: {
      toFloodplainWaterKg: Number(channelToFloodplainWaterKg),
      fromFloodplainWaterKg: Number(channelFromFloodplainWaterKg),
      incomingWaterTemperatureC: Number(incomingWaterTemperatureC),
      outgoingWaterTemperatureC: Number(outgoingWaterTemperatureC),
      heatToFloodplainJ: Number(channelInflowHeatJ),
      heatFromFloodplainJ: Number(channelOutflowHeatJ),
      netOnly: true,
      historicallyClosed: true
    },
    localOwnerAdjustment: {
      netWaterChangeKg: Number(localOwnerChangeKg),
      inflowWaterKg: Number(localOwnerInflowKg),
      outflowWaterKg: Number(localOwnerOutflowKg),
      waterTemperatureC: Number(localOwnerTemperatureC),
      inflowHeatJ: Number(localOwnerInflowHeatJ),
      outflowHeatJ: Number(localOwnerOutflowHeatJ)
    },
    energy: {
      initialSensibleHeatJ: Number(initialSensibleHeatJ),
      inflowHeatJ: Number(inflowHeatJ),
      outflowHeatJ: Number(outflowHeatJ),
      externalBoundaryHeatJ: Number(externalBoundaryHeatJ),
      finalSensibleHeatJ: Number(canonicalFinalSensibleHeatJ)
    },
    energyClosure: closure,
    truth: {
      ...truth(),
      migrationInventedHistoricalHeat: false,
      energyClosureApplicable: true,
      currentMaterialOwnerObserved: true,
      waterOwnerChangeClosed:
        Math.abs(waterResidualKg) <= waterToleranceKg,
      exactNetChannelExchangeThermallyPaired: true,
      localOwnerWaterChangeThermallyReconciled: true,
      energyClosureClosed: closure.conservationClosed,
      channelWaterTemperatureResolved,
      sameStepSurfaceTemperatureProxyUsed:
        !channelWaterTemperatureResolved
    }
  };
  receipt.digest = stableDigest(receipt);
  state.lastTransitionReceipt = clone(receipt);
  return {
    state: normalizeFloodplainThermalState(state),
    receipt: clone(receipt)
  };
}

export function floodplainThermalDescription() {
  return {
    stateSchema: FLOODPLAIN_THERMAL_STATE_SCHEMA,
    previousStateSchema: PREVIOUS_FLOODPLAIN_THERMAL_STATE_SCHEMA,
    transitionReceiptSchema: FLOODPLAIN_THERMAL_RECEIPT_SCHEMA,
    previousTransitionReceiptSchema:
      PREVIOUS_FLOODPLAIN_THERMAL_RECEIPT_SCHEMA,
    energyClosureSchema: FLOODPLAIN_THERMAL_ENERGY_CLOSURE_SCHEMA,
    energyClosurePolicy: {
      schema: FLOODPLAIN_THERMAL_ENERGY_CLOSURE_POLICY_SCHEMA,
      absoluteFloorJ: FLOODPLAIN_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
      ulpFactor: FLOODPLAIN_THERMAL_ENERGY_ULP_FACTOR,
      scaleBasis: 'sum-of-absolute-unrounded-signed-operands-joules'
    },
    waterClosurePolicy: {
      absoluteFloorKg: FLOODPLAIN_THERMAL_WATER_ABSOLUTE_FLOOR_KG,
      ulpFactor: FLOODPLAIN_THERMAL_WATER_ULP_FACTOR,
      scaleBasis: 'sum-of-absolute-unrounded-signed-operands-kilograms'
    },
    specificHeatJkgK: WATER_SPECIFIC_HEAT_J_KG_K,
    processes: [
      'persistent-floodplain-water-temperature',
      'net-water-owner-change-thermal-reconciliation',
      'parameterized-external-boundary-heat-relaxation',
      'shared-denitrification-nitrification-gas-exchange-temperature',
      'pre-r66-no-historical-heat-migration'
    ],
    truth: truth()
  };
}
