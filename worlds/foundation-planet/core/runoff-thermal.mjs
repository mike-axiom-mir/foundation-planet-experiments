export const RUNOFF_THERMAL_QUEUE_SCHEMA =
  'axm.foundation-planet.runoff-thermal-queue/v1';
export const RUNOFF_THERMAL_GENERATION_RECEIPT_SCHEMA =
  'axm.foundation-planet.runoff-thermal-generation-receipt/v1';
export const RUNOFF_THERMAL_TRANSFER_RECEIPT_SCHEMA =
  'axm.foundation-planet.runoff-thermal-transfer-receipt/v1';
export const RUNOFF_THERMAL_OCEAN_INPUT_RECEIPT_SCHEMA =
  'axm.foundation-planet.runoff-thermal-ocean-input-receipt/v1';
export const RUNOFF_THERMAL_ENERGY_CLOSURE_SCHEMA =
  'axm.foundation-planet.runoff-thermal-energy-closure/v1';
export const RUNOFF_THERMAL_ENERGY_CLOSURE_POLICY_SCHEMA =
  'axm.foundation-planet.runoff-thermal-energy-closure-policy/v1';
export const RUNOFF_WATER_SPECIFIC_HEAT_J_KG_K = 4_184;
export const RUNOFF_THERMAL_ENERGY_ABSOLUTE_FLOOR_J = 1;
export const RUNOFF_THERMAL_ENERGY_ULP_FACTOR = 8;
export const RUNOFF_THERMAL_WATER_TOLERANCE_MM = 1e-9;
export const RUNOFF_THERMAL_TRANSFER_WATER_ABSOLUTE_FLOOR_KG = 1e-6;
export const RUNOFF_THERMAL_TRANSFER_WATER_ULP_FACTOR = 8;
export const RUNOFF_OCEAN_VOLUMETRIC_HEAT_CAPACITY_J_M3_K = 4.186e6;

const MINIMUM_LIQUID_WATER_TEMPERATURE_C = -2;
const MAXIMUM_LIQUID_WATER_TEMPERATURE_C = 45;
const finite = (value, fallback = 0) => Number.isFinite(Number(value))
  ? Number(value) : fallback;
const clamp = (value, min = 0, max = 1) =>
  Math.max(min, Math.min(max, value));
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
  return Math.max(0, finite(waterKg)) *
    RUNOFF_WATER_SPECIFIC_HEAT_J_KG_K * liquidTemperature(temperatureC);
}

function queueTruth(generationSourceHeatOwnerDebited = false) {
  return {
    persistentRunoffThermalOwner: true,
    exactWaterQueueBindingRequired: true,
    exactSenderDebitRequired: true,
    exactReceiverCreditRequired: true,
    scaleAwareNumericEnergyClosure: true,
    measuredEnergyResidualPreserved: true,
    fixedAbsoluteEnergyToleranceOnly: false,
    scaleAwareNumericWaterClosure: true,
    measuredWaterResidualPreserved: true,
    fixedAbsoluteWaterToleranceOnly: false,
    generationSourceHeatOwnerDebited,
    parameterizedSurfaceRunoffTemperature:
      !generationSourceHeatOwnerDebited,
    parameterizedBaseflowTemperature:
      !generationSourceHeatOwnerDebited,
    resolvedSoilAndGroundwaterThermalOwners:
      generationSourceHeatOwnerDebited,
    precipitationThermalSenderOwnerDebited: false,
    evaporationAtmosphereThermalReceiverCredited: false,
    resolvedFreezeThawState: false,
    latentHeatModeled: false,
    scientificCalibrationClaimed: false
  };
}

export function runoffThermalEnergyToleranceJ(signedOperandsJ = []) {
  const absoluteOperandSumJ = signedOperandsJ.reduce((sum, operand) =>
    sum + Math.abs(finite(operand)), 0);
  return round(Math.max(
    RUNOFF_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    absoluteOperandSumJ * Number.EPSILON *
      RUNOFF_THERMAL_ENERGY_ULP_FACTOR
  ), 12);
}

export function runoffThermalTransferWaterToleranceKg(
  signedOperandsKg = []) {
  const absoluteOperandSumKg = signedOperandsKg.reduce((sum, operand) =>
    sum + Math.abs(finite(operand)), 0);
  return round(Math.max(
    RUNOFF_THERMAL_TRANSFER_WATER_ABSOLUTE_FLOOR_KG,
    absoluteOperandSumKg * Number.EPSILON *
      RUNOFF_THERMAL_TRANSFER_WATER_ULP_FACTOR
  ), 12);
}

function energyClosure(signedOperandsJ, applicable = true,
  reason = null) {
  const policy = {
    schema: RUNOFF_THERMAL_ENERGY_CLOSURE_POLICY_SCHEMA,
    absoluteFloorJ: RUNOFF_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    ulpFactor: RUNOFF_THERMAL_ENERGY_ULP_FACTOR,
    scaleBasis: 'sum-of-absolute-unrounded-signed-operands-joules'
  };
  if (!applicable) {
    return {
      schema: RUNOFF_THERMAL_ENERGY_CLOSURE_SCHEMA,
      applicable: false,
      reason,
      policy,
      sensibleHeat: null,
      identityCount: 0,
      maximumResidualJ: null,
      maximumToleranceJ: null,
      maximumToleranceUtilization: null,
      conservationClosed: null,
      measuredResidualPreserved: false
    };
  }
  const residualJ = signedOperandsJ.reduce((sum, operand) =>
    sum + finite(operand), 0);
  const numericToleranceJ = runoffThermalEnergyToleranceJ(
    signedOperandsJ);
  const toleranceUtilization = round(
    Math.abs(residualJ) / numericToleranceJ, 12);
  return {
    schema: RUNOFF_THERMAL_ENERGY_CLOSURE_SCHEMA,
    applicable: true,
    policy,
    sensibleHeat: {
      signedOperandsJ: signedOperandsJ.map(Number),
      residualJ: Number(residualJ),
      numericToleranceJ,
      toleranceUtilization,
      closed: Math.abs(residualJ) <= numericToleranceJ
    },
    identityCount: 1,
    maximumResidualJ: Math.abs(residualJ),
    maximumToleranceJ: numericToleranceJ,
    maximumToleranceUtilization: toleranceUtilization,
    conservationClosed: Math.abs(residualJ) <= numericToleranceJ,
    measuredResidualPreserved: true
  };
}

export function emptyRunoffThermalQueue(options = {}) {
  const trackedWaterMm = Math.max(0, finite(options.trackedWaterMm));
  const waterTemperatureC = liquidTemperature(
    options.waterTemperatureC, 15);
  return {
    schema: RUNOFF_THERMAL_QUEUE_SCHEMA,
    migrationCheckpoint: options.migrationCheckpoint === true,
    trackedWaterMm,
    sensibleHeatJm2: sensibleHeatJ(trackedWaterMm, waterTemperatureC),
    waterTemperatureC,
    cumulativeGeneratedWaterMm: 0,
    cumulativeGeneratedHeatJm2: 0,
    cumulativeDebitedWaterMm: 0,
    cumulativeDebitedHeatJm2: 0,
    cumulativeCreditedWaterMm: 0,
    cumulativeCreditedHeatJm2: 0,
    lastGenerationReceipt: null,
    lastTransferReceipt: null,
    truth: queueTruth()
  };
}

export function normalizeRunoffThermalQueue(source) {
  if (source?.schema !== RUNOFF_THERMAL_QUEUE_SCHEMA) {
    return emptyRunoffThermalQueue({ migrationCheckpoint: true });
  }
  const trackedWaterMm = Math.max(0, finite(source.trackedWaterMm));
  let sensibleHeatJm2 = finite(source.sensibleHeatJm2);
  let waterTemperatureC = liquidTemperature(source.waterTemperatureC, 15);
  if (trackedWaterMm <= 1e-12) {
    sensibleHeatJm2 = 0;
  } else {
    waterTemperatureC = liquidTemperature(sensibleHeatJm2 /
      (trackedWaterMm * RUNOFF_WATER_SPECIFIC_HEAT_J_KG_K),
    waterTemperatureC);
    sensibleHeatJm2 = sensibleHeatJ(trackedWaterMm, waterTemperatureC);
  }
  const lastGenerationReceipt = source.lastGenerationReceipt?.schema ===
      RUNOFF_THERMAL_GENERATION_RECEIPT_SCHEMA
    ? clone(source.lastGenerationReceipt) : null;
  return {
    schema: RUNOFF_THERMAL_QUEUE_SCHEMA,
    migrationCheckpoint: source.migrationCheckpoint === true,
    trackedWaterMm,
    sensibleHeatJm2,
    waterTemperatureC,
    cumulativeGeneratedWaterMm: Math.max(0,
      finite(source.cumulativeGeneratedWaterMm)),
    cumulativeGeneratedHeatJm2: finite(
      source.cumulativeGeneratedHeatJm2),
    cumulativeDebitedWaterMm: Math.max(0,
      finite(source.cumulativeDebitedWaterMm)),
    cumulativeDebitedHeatJm2: finite(source.cumulativeDebitedHeatJm2),
    cumulativeCreditedWaterMm: Math.max(0,
      finite(source.cumulativeCreditedWaterMm)),
    cumulativeCreditedHeatJm2: finite(source.cumulativeCreditedHeatJm2),
    lastGenerationReceipt,
    lastTransferReceipt: source.lastTransferReceipt?.schema ===
      RUNOFF_THERMAL_TRANSFER_RECEIPT_SCHEMA
      ? clone(source.lastTransferReceipt) : null,
    truth: queueTruth(lastGenerationReceipt?.truth
      ?.generationSourceHeatOwnerDebited === true)
  };
}

function materializeMigration(source, currentWaterMm,
  boundaryTemperatureC) {
  const queue = normalizeRunoffThermalQueue(source);
  if (!queue.migrationCheckpoint) {
    return { queue, migrationInitialization: null };
  }
  const trackedWaterMm = Math.max(0, finite(currentWaterMm));
  const waterTemperatureC = liquidTemperature(boundaryTemperatureC, 15);
  const initializationHeatJm2 = sensibleHeatJ(trackedWaterMm,
    waterTemperatureC);
  queue.migrationCheckpoint = false;
  queue.trackedWaterMm = trackedWaterMm;
  queue.sensibleHeatJm2 = initializationHeatJm2;
  queue.waterTemperatureC = waterTemperatureC;
  return {
    queue,
    migrationInitialization: {
      status: 'initialized-current-queue-no-historical-heat',
      trackedWaterMm: Number(trackedWaterMm),
      waterTemperatureC: Number(waterTemperatureC),
      sensibleHeatJm2: Number(initializationHeatJm2),
      historicalHeatReconstructed: false
    }
  };
}

export function advanceRunoffThermalGeneration(source,
  finalRunoffWaterMmSource, context = {}) {
  const finalRunoffWaterMm = Math.max(0, finite(
    finalRunoffWaterMmSource));
  const sourceQueue = normalizeRunoffThermalQueue(source);
  const surfaceRunoffMm = Math.max(0, finite(context.surfaceRunoffMm));
  const baseflowMm = Math.max(0, finite(context.baseflowMm));
  const sourceOwnerBinding = context.sourceThermalOwner || null;
  const sourceOwnerBound =
    context.generationSourceHeatOwnerDebited === true &&
    typeof sourceOwnerBinding?.receiptDigest === 'string' &&
    sourceOwnerBinding.receiptDigest.length > 0 &&
    typeof sourceOwnerBinding?.receiptSchema === 'string' &&
    Number.isFinite(Number(sourceOwnerBinding?.surfaceRunoff
      ?.sensibleHeatJm2)) &&
    Number.isFinite(Number(sourceOwnerBinding?.baseflow
      ?.sensibleHeatJm2)) &&
    Math.abs(finite(sourceOwnerBinding?.surfaceRunoff?.waterMm) -
      surfaceRunoffMm) <= RUNOFF_THERMAL_WATER_TOLERANCE_MM &&
    Math.abs(finite(sourceOwnerBinding?.baseflow?.waterMm) -
      baseflowMm) <= RUNOFF_THERMAL_WATER_TOLERANCE_MM;
  const surfaceRunoffHeatJm2 = sourceOwnerBound
    ? finite(sourceOwnerBinding.surfaceRunoff.sensibleHeatJm2)
    : sensibleHeatJ(surfaceRunoffMm,
      context.surfaceRunoffTemperatureC);
  const baseflowHeatJm2 = sourceOwnerBound
    ? finite(sourceOwnerBinding.baseflow.sensibleHeatJm2)
    : sensibleHeatJ(baseflowMm, context.baseflowTemperatureC ??
      context.surfaceRunoffTemperatureC);
  const surfaceRunoffTemperatureC = surfaceRunoffMm > 1e-12
    ? liquidTemperature(surfaceRunoffHeatJm2 /
      (surfaceRunoffMm * RUNOFF_WATER_SPECIFIC_HEAT_J_KG_K),
    context.surfaceRunoffTemperatureC) : liquidTemperature(
      context.surfaceRunoffTemperatureC, 15);
  const baseflowTemperatureC = baseflowMm > 1e-12
    ? liquidTemperature(baseflowHeatJm2 /
      (baseflowMm * RUNOFF_WATER_SPECIFIC_HEAT_J_KG_K),
    context.baseflowTemperatureC ?? surfaceRunoffTemperatureC)
    : liquidTemperature(context.baseflowTemperatureC,
      surfaceRunoffTemperatureC);
  if (sourceQueue.migrationCheckpoint) {
    const initialized = materializeMigration(sourceQueue,
      finalRunoffWaterMm, context.migrationBoundaryTemperatureC ??
        surfaceRunoffTemperatureC);
    const receipt = {
      schema: RUNOFF_THERMAL_GENERATION_RECEIPT_SCHEMA,
      status: 'initialized-after-migration-no-historical-heat',
      water: {
        initialTrackedMm: null,
        surfaceRunoffMm: Number(surfaceRunoffMm),
        baseflowMm: Number(baseflowMm),
        finalTrackedMm: Number(finalRunoffWaterMm),
        ownerResidualMm: null,
        numericToleranceMm: null
      },
      temperatures: {
        surfaceRunoffTemperatureC: Number(surfaceRunoffTemperatureC),
        baseflowTemperatureC: Number(baseflowTemperatureC),
        finalQueueTemperatureC:
          Number(initialized.queue.waterTemperatureC)
      },
      energy: {
        initialSensibleHeatJm2: null,
        surfaceRunoffHeatJm2: null,
        baseflowHeatJm2: null,
        finalSensibleHeatJm2:
          Number(initialized.queue.sensibleHeatJm2)
      },
      sourceThermalOwner: null,
      energyClosure: energyClosure([], false,
        'pre-r71-runoff-heat-history-unobserved'),
      truth: {
        ...queueTruth(),
        persistentRunoffThermalOwnerCredited: false,
        migrationInventedHistoricalHeat: false,
        currentQueueOwnerObserved: true,
        energyClosureApplicable: false
      }
    };
    receipt.digest = stableDigest(receipt);
    initialized.queue.lastGenerationReceipt = clone(receipt);
    return { queue: normalizeRunoffThermalQueue(initialized.queue),
      receipt: clone(receipt) };
  }
  const queue = sourceQueue;
  const initialTrackedWaterMm = queue.trackedWaterMm;
  const initialSensibleHeatJm2 = queue.sensibleHeatJm2;
  const expectedFinalWaterMm = initialTrackedWaterMm +
    surfaceRunoffMm + baseflowMm;
  const ownerResidualMm = finalRunoffWaterMm - expectedFinalWaterMm;
  const finalSensibleHeatJm2 = initialSensibleHeatJm2 +
    surfaceRunoffHeatJm2 + baseflowHeatJm2;
  const finalQueueTemperatureC = finalRunoffWaterMm > 1e-12
    ? liquidTemperature(finalSensibleHeatJm2 /
      (finalRunoffWaterMm * RUNOFF_WATER_SPECIFIC_HEAT_J_KG_K),
    surfaceRunoffTemperatureC) : surfaceRunoffTemperatureC;
  const canonicalFinalHeatJm2 = sensibleHeatJ(finalRunoffWaterMm,
    finalQueueTemperatureC);
  const closure = energyClosure([
    canonicalFinalHeatJm2,
    -initialSensibleHeatJm2,
    -surfaceRunoffHeatJm2,
    -baseflowHeatJm2
  ]);
  queue.trackedWaterMm = finalRunoffWaterMm;
  queue.sensibleHeatJm2 = canonicalFinalHeatJm2;
  queue.waterTemperatureC = finalQueueTemperatureC;
  queue.cumulativeGeneratedWaterMm += surfaceRunoffMm + baseflowMm;
  queue.cumulativeGeneratedHeatJm2 += surfaceRunoffHeatJm2 +
    baseflowHeatJm2;
  const receipt = {
    schema: RUNOFF_THERMAL_GENERATION_RECEIPT_SCHEMA,
    status: surfaceRunoffMm + baseflowMm > 1e-12
      ? (sourceOwnerBound
        ? 'runoff-thermal-owner-credited-from-land-source-owners'
        : 'runoff-thermal-owner-credited-parameterized-boundary')
      : 'no-generated-runoff',
    water: {
      initialTrackedMm: Number(initialTrackedWaterMm),
      surfaceRunoffMm: Number(surfaceRunoffMm),
      baseflowMm: Number(baseflowMm),
      finalTrackedMm: Number(finalRunoffWaterMm),
      ownerResidualMm: Number(ownerResidualMm),
      numericToleranceMm: RUNOFF_THERMAL_WATER_TOLERANCE_MM
    },
    temperatures: {
      surfaceRunoffTemperatureC: Number(surfaceRunoffTemperatureC),
      baseflowTemperatureC: Number(baseflowTemperatureC),
      finalQueueTemperatureC: Number(finalQueueTemperatureC)
    },
    energy: {
      initialSensibleHeatJm2: Number(initialSensibleHeatJm2),
      surfaceRunoffHeatJm2: Number(surfaceRunoffHeatJm2),
      baseflowHeatJm2: Number(baseflowHeatJm2),
      finalSensibleHeatJm2: Number(canonicalFinalHeatJm2)
    },
    sourceThermalOwner: sourceOwnerBound ? {
      receiptSchema: sourceOwnerBinding.receiptSchema,
      receiptDigest: sourceOwnerBinding.receiptDigest,
      stepId: sourceOwnerBinding.stepId || null,
      surfaceRunoffTransferIds: Array.isArray(
        sourceOwnerBinding.surfaceRunoff.transferIds)
        ? [...sourceOwnerBinding.surfaceRunoff.transferIds] : [],
      baseflowTransferIds: Array.isArray(
        sourceOwnerBinding.baseflow.transferIds)
        ? [...sourceOwnerBinding.baseflow.transferIds] : []
    } : null,
    energyClosure: closure,
    truth: {
      ...queueTruth(sourceOwnerBound),
      persistentRunoffThermalOwnerCredited: true,
      migrationInventedHistoricalHeat: false,
      currentQueueOwnerObserved: true,
      waterOwnerClosed: Math.abs(ownerResidualMm) <=
        RUNOFF_THERMAL_WATER_TOLERANCE_MM,
      energyClosureApplicable: true,
      energyClosureClosed: closure.conservationClosed
    }
  };
  receipt.digest = stableDigest(receipt);
  queue.lastGenerationReceipt = clone(receipt);
  queue.truth = queueTruth(sourceOwnerBound);
  return { queue: normalizeRunoffThermalQueue(queue),
    receipt: clone(receipt) };
}

export function debitRunoffThermalQueue(source, fraction, areaM2,
  context = {}) {
  const initialized = materializeMigration(source,
    context.currentRunoffWaterMm,
    context.migrationBoundaryTemperatureC);
  const queue = initialized.queue;
  const bounded = clamp(finite(fraction));
  const area = Math.max(1, finite(areaM2, 1));
  const beforeWaterMm = queue.trackedWaterMm;
  const beforeHeatJm2 = queue.sensibleHeatJm2;
  const transferredWaterKg = beforeWaterMm * area * bounded;
  const transferredSensibleHeatJ = beforeHeatJm2 * area * bounded;
  const afterWaterMm = beforeWaterMm * (1 - bounded);
  const afterHeatJm2 = beforeHeatJm2 * (1 - bounded);
  const waterTemperatureC = transferredWaterKg > 1e-12
    ? liquidTemperature(transferredSensibleHeatJ /
      (transferredWaterKg * RUNOFF_WATER_SPECIFIC_HEAT_J_KG_K),
    queue.waterTemperatureC) : queue.waterTemperatureC;
  queue.trackedWaterMm = afterWaterMm;
  queue.sensibleHeatJm2 = afterHeatJm2;
  queue.waterTemperatureC = afterWaterMm > 1e-12
    ? liquidTemperature(afterHeatJm2 /
      (afterWaterMm * RUNOFF_WATER_SPECIFIC_HEAT_J_KG_K),
    queue.waterTemperatureC) : queue.waterTemperatureC;
  queue.cumulativeDebitedWaterMm += transferredWaterKg / area;
  queue.cumulativeDebitedHeatJm2 += transferredSensibleHeatJ / area;
  const waterResidualKg = beforeWaterMm * area -
    transferredWaterKg - afterWaterMm * area;
  const waterToleranceKg = runoffThermalTransferWaterToleranceKg([
    beforeWaterMm * area,
    -transferredWaterKg,
    -afterWaterMm * area
  ]);
  const closure = energyClosure([
    afterHeatJm2 * area,
    -beforeHeatJm2 * area,
    transferredSensibleHeatJ
  ]);
  const receipt = {
    schema: RUNOFF_THERMAL_TRANSFER_RECEIPT_SCHEMA,
    transferId: String(context.transferId || 'unbound-runoff-thermal'),
    role: 'sender-debit',
    sourceCellId: context.sourceCellId || null,
    destinationId: context.destinationId || null,
    destinationKind: context.destinationKind || null,
    waterFraction: Number(bounded),
    sourceAreaM2: Number(area),
    water: {
      beforeTrackedMm: Number(beforeWaterMm),
      transferredKg: Number(transferredWaterKg),
      afterTrackedMm: Number(afterWaterMm),
      residualKg: Number(waterResidualKg),
      numericToleranceKg: Number(waterToleranceKg)
    },
    transfer: {
      waterKg: Number(transferredWaterKg),
      waterTemperatureC: Number(waterTemperatureC),
      sensibleHeatJ: Number(transferredSensibleHeatJ)
    },
    energy: {
      beforeSensibleHeatJ: Number(beforeHeatJm2 * area),
      transferredSensibleHeatJ:
        Number(transferredSensibleHeatJ),
      afterSensibleHeatJ: Number(afterHeatJm2 * area)
    },
    migrationInitialization: initialized.migrationInitialization,
    energyClosure: closure,
    truth: {
      ...queueTruth(),
      persistentQueueSenderDebited: true,
      receiverCredited: false,
      sameFractionAsRunoffWater: true,
      exactTransferId: Boolean(context.transferId),
      waterOwnerClosed: Math.abs(waterResidualKg) <= waterToleranceKg,
      energyClosureClosed: closure.conservationClosed,
      migrationInventedHistoricalHeat: false
    }
  };
  receipt.digest = stableDigest(receipt);
  queue.lastTransferReceipt = clone(receipt);
  return {
    queue: normalizeRunoffThermalQueue(queue),
    transfer: clone(receipt.transfer),
    receipt: clone(receipt)
  };
}

export function creditRunoffThermalQueue(source, transferSource,
  areaM2, context = {}) {
  const initialized = materializeMigration(source,
    context.currentRunoffWaterMm,
    context.migrationBoundaryTemperatureC);
  const queue = initialized.queue;
  const transfer = clone(transferSource || {});
  const area = Math.max(1, finite(areaM2, 1));
  const beforeWaterMm = queue.trackedWaterMm;
  const beforeHeatJm2 = queue.sensibleHeatJm2;
  const transferredWaterKg = Math.max(0, finite(transfer.waterKg));
  const transferredSensibleHeatJ = finite(transfer.sensibleHeatJ);
  const afterWaterMm = beforeWaterMm + transferredWaterKg / area;
  const afterHeatJm2 = beforeHeatJm2 + transferredSensibleHeatJ / area;
  const waterTemperatureC = afterWaterMm > 1e-12
    ? liquidTemperature(afterHeatJm2 /
      (afterWaterMm * RUNOFF_WATER_SPECIFIC_HEAT_J_KG_K),
    queue.waterTemperatureC) : queue.waterTemperatureC;
  queue.trackedWaterMm = afterWaterMm;
  queue.sensibleHeatJm2 = afterHeatJm2;
  queue.waterTemperatureC = waterTemperatureC;
  queue.cumulativeCreditedWaterMm += transferredWaterKg / area;
  queue.cumulativeCreditedHeatJm2 += transferredSensibleHeatJ / area;
  const waterResidualKg = afterWaterMm * area -
    beforeWaterMm * area - transferredWaterKg;
  const waterToleranceKg = runoffThermalTransferWaterToleranceKg([
    afterWaterMm * area,
    -beforeWaterMm * area,
    -transferredWaterKg
  ]);
  const closure = energyClosure([
    afterHeatJm2 * area,
    -beforeHeatJm2 * area,
    -transferredSensibleHeatJ
  ]);
  const receipt = {
    schema: RUNOFF_THERMAL_TRANSFER_RECEIPT_SCHEMA,
    transferId: String(context.transferId || 'unbound-runoff-thermal'),
    role: 'receiver-credit',
    sourceCellId: context.sourceCellId || null,
    destinationId: context.destinationId || null,
    destinationKind: 'land-runoff-thermal-queue',
    receivingAreaM2: Number(area),
    water: {
      beforeTrackedMm: Number(beforeWaterMm),
      transferredKg: Number(transferredWaterKg),
      afterTrackedMm: Number(afterWaterMm),
      residualKg: Number(waterResidualKg),
      numericToleranceKg: Number(waterToleranceKg)
    },
    transfer: {
      waterKg: Number(transferredWaterKg),
      waterTemperatureC: Number(finite(transfer.waterTemperatureC,
        waterTemperatureC)),
      sensibleHeatJ: Number(transferredSensibleHeatJ)
    },
    energy: {
      beforeSensibleHeatJ: Number(beforeHeatJm2 * area),
      transferredSensibleHeatJ:
        Number(transferredSensibleHeatJ),
      afterSensibleHeatJ: Number(afterHeatJm2 * area)
    },
    migrationInitialization: initialized.migrationInitialization,
    energyClosure: closure,
    truth: {
      ...queueTruth(),
      persistentQueueSenderDebited: false,
      receiverCredited: true,
      exactTransferId: Boolean(context.transferId),
      waterOwnerClosed: Math.abs(waterResidualKg) <= waterToleranceKg,
      energyClosureClosed: closure.conservationClosed,
      migrationInventedHistoricalHeat: false
    }
  };
  receipt.digest = stableDigest(receipt);
  queue.lastTransferReceipt = clone(receipt);
  return { queue: normalizeRunoffThermalQueue(queue),
    receipt: clone(receipt) };
}

export function creditOceanRunoffThermalOwner(oceanSource,
  surfaceTemperatureSource, transferSource, context = {}) {
  const ocean = oceanSource || {};
  const transfer = clone(transferSource || {});
  const areaM2 = finite(context.areaM2);
  const mixedLayerDepthM = finite(ocean.mixedLayerDepthM);
  if (!(areaM2 > 0) || !(mixedLayerDepthM > 0)) {
    throw new Error('Runoff ocean thermal credit requires positive area and mixed-layer depth');
  }
  const heatCapacityJm2K =
    RUNOFF_OCEAN_VOLUMETRIC_HEAT_CAPACITY_J_M3_K * mixedLayerDepthM;
  const heatCapacityJPerK = heatCapacityJm2K * areaM2;
  const initialWaterTemperatureC = finite(ocean.mixedLayerTemperatureC,
    finite(surfaceTemperatureSource, 15));
  const initialHeatContentJm2 = Number.isFinite(Number(ocean.heatContentJm2))
    ? Number(ocean.heatContentJm2)
    : initialWaterTemperatureC * heatCapacityJm2K;
  const initialSensibleHeatJ = initialHeatContentJm2 * areaM2;
  const creditedSensibleHeatJ = finite(transfer.sensibleHeatJ);
  const independentlyRecomputedSensibleHeatJ = sensibleHeatJ(
    transfer.waterKg, transfer.waterTemperatureC);
  const transferResidualJ = creditedSensibleHeatJ -
    independentlyRecomputedSensibleHeatJ;
  const transferToleranceJ = runoffThermalEnergyToleranceJ([
    creditedSensibleHeatJ, -independentlyRecomputedSensibleHeatJ
  ]);
  const finalSensibleHeatJ = initialSensibleHeatJ +
    creditedSensibleHeatJ;
  const finalWaterTemperatureC = finalSensibleHeatJ / heatCapacityJPerK;
  const finalHeatContentJm2 = finalSensibleHeatJ / areaM2;
  const closure = energyClosure([
    finalSensibleHeatJ,
    -initialSensibleHeatJ,
    -creditedSensibleHeatJ
  ]);
  const receipt = {
    schema: RUNOFF_THERMAL_OCEAN_INPUT_RECEIPT_SCHEMA,
    transferId: String(context.transferId || ''),
    sourceCellId: context.sourceCellId || null,
    destinationCellId: context.destinationCellId || null,
    receiver: {
      kind: 'earth-system-ocean-mixed-layer',
      areaM2: Number(areaM2),
      mixedLayerDepthM: Number(mixedLayerDepthM),
      volumetricHeatCapacityJm3K:
        RUNOFF_OCEAN_VOLUMETRIC_HEAT_CAPACITY_J_M3_K,
      initialSensibleHeatJ: Number(initialSensibleHeatJ),
      finalSensibleHeatJ: Number(finalSensibleHeatJ),
      initialWaterTemperatureC: Number(initialWaterTemperatureC),
      finalWaterTemperatureC: Number(finalWaterTemperatureC),
      initialHeatContentJm2: Number(initialHeatContentJm2),
      finalHeatContentJm2: Number(finalHeatContentJm2)
    },
    runoffInput: {
      waterKg: Number(Math.max(0, finite(transfer.waterKg))),
      waterTemperatureC: Number(liquidTemperature(
        transfer.waterTemperatureC, 15)),
      creditedSensibleHeatJ: Number(creditedSensibleHeatJ),
      independentlyRecomputedSensibleHeatJ:
        Number(independentlyRecomputedSensibleHeatJ),
      heatResidualJ: Number(transferResidualJ),
      heatToleranceJ: Number(transferToleranceJ)
    },
    energyClosure: closure,
    truth: {
      ...queueTruth(),
      persistentOceanMixedLayerHeatOwner: true,
      sourceRunoffThermalOwnerDebited: true,
      oceanReceiverThermalOwnerCredited: true,
      transferHeatMatchesWaterAndTemperature:
        Math.abs(transferResidualJ) <= transferToleranceJ,
      receiverEnergyClosureClosed: closure.conservationClosed,
      fixedDepthMixedLayerHeatCapacity: true,
      riverWaterChangesMixedLayerHeatCapacity: false
    }
  };
  receipt.digest = stableDigest(receipt);
  return {
    receiverState: {
      mixedLayerTemperatureC: Number(finalWaterTemperatureC),
      heatContentJm2: Number(finalHeatContentJm2),
      surfaceTemperatureC: Number(finalWaterTemperatureC)
    },
    receipt: clone(receipt)
  };
}

export function runoffThermalSummary(source) {
  const queue = normalizeRunoffThermalQueue(source);
  return {
    migrationCheckpoint: queue.migrationCheckpoint,
    trackedWaterMm: round(queue.trackedWaterMm, 12),
    sensibleHeatJm2: round(queue.sensibleHeatJm2, 6),
    waterTemperatureC: round(queue.waterTemperatureC, 9),
    cumulativeGeneratedWaterMm: round(
      queue.cumulativeGeneratedWaterMm, 12),
    cumulativeGeneratedHeatJm2: round(
      queue.cumulativeGeneratedHeatJm2, 6),
    cumulativeDebitedWaterMm: round(queue.cumulativeDebitedWaterMm, 12),
    cumulativeDebitedHeatJm2: round(queue.cumulativeDebitedHeatJm2, 6),
    cumulativeCreditedWaterMm: round(queue.cumulativeCreditedWaterMm, 12),
    cumulativeCreditedHeatJm2: round(queue.cumulativeCreditedHeatJm2, 6),
    lastEnergyResidualJ: queue.lastTransferReceipt?.energyClosure
      ?.sensibleHeat?.residualJ ?? queue.lastGenerationReceipt?.energyClosure
        ?.sensibleHeat?.residualJ ?? null,
    lastEnergyToleranceJ: queue.lastTransferReceipt?.energyClosure
      ?.sensibleHeat?.numericToleranceJ ??
      queue.lastGenerationReceipt?.energyClosure?.sensibleHeat
        ?.numericToleranceJ ?? null,
    truth: queueTruth()
  };
}

export function runoffThermalDescription() {
  return {
    queueSchema: RUNOFF_THERMAL_QUEUE_SCHEMA,
    generationReceiptSchema: RUNOFF_THERMAL_GENERATION_RECEIPT_SCHEMA,
    transferReceiptSchema: RUNOFF_THERMAL_TRANSFER_RECEIPT_SCHEMA,
    oceanInputReceiptSchema: RUNOFF_THERMAL_OCEAN_INPUT_RECEIPT_SCHEMA,
    energyClosureSchema: RUNOFF_THERMAL_ENERGY_CLOSURE_SCHEMA,
    energyClosurePolicy: {
      schema: RUNOFF_THERMAL_ENERGY_CLOSURE_POLICY_SCHEMA,
      absoluteFloorJ: RUNOFF_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
      ulpFactor: RUNOFF_THERMAL_ENERGY_ULP_FACTOR,
      scaleBasis: 'sum-of-absolute-unrounded-signed-operands-joules'
    },
    transferWaterClosurePolicy: {
      absoluteFloorKg: RUNOFF_THERMAL_TRANSFER_WATER_ABSOLUTE_FLOOR_KG,
      ulpFactor: RUNOFF_THERMAL_TRANSFER_WATER_ULP_FACTOR,
      scaleBasis: 'sum-of-absolute-unrounded-signed-operands-kilograms'
    },
    waterSpecificHeatJkgK: RUNOFF_WATER_SPECIFIC_HEAT_J_KG_K,
    processes: [
      'persistent-runoff-queue-temperature-and-sensible-heat',
      'persistent-land-hydrology-source-owner-debit-and-runoff-credit',
      'exact-land-to-land-thermal-owner-transfer',
      'exact-runoff-to-river-thermal-owner-debit-and-credit',
      'exact-loaded-runoff-to-ocean-mixed-layer-heat-credit',
      'pre-r71-current-owner-migration-without-historical-heat'
    ],
    truth: queueTruth(true)
  };
}
