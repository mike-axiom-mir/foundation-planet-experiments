import {
  LAND_SNOW_THERMAL_STEP_RECEIPT_SCHEMA,
  LAND_SNOW_ICE_SPECIFIC_HEAT_J_KG_K,
  LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_SNOW_THERMAL_ENERGY_ULP_FACTOR,
  LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM
} from './land-snow-thermal.mjs?v=0.75.0-r75.1';
import {
  SURFACE_ENERGY_LEDGER_SCHEMA,
  LAND_SNOWMELT_COLD_CONTENT_RECEIPT_SCHEMA,
  snowmeltColdContentReceiptValid
} from './snowmelt-cold-content.mjs?v=0.76.0-r76.1';

export const LAND_SURFACE_SNOW_THERMAL_PROPOSAL_SCHEMA =
  'axm.foundation-planet.land-surface-snow-thermal-proposal/v1';
export const LAND_SURFACE_SNOW_THERMAL_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-surface-snow-thermal-receipt/v1';
export const LAND_SURFACE_SNOW_THERMAL_CLOSURE_SCHEMA =
  'axm.foundation-planet.land-surface-snow-thermal-closure/v1';
export const LAND_SURFACE_SNOW_THERMAL_CLOSURE_POLICY_SCHEMA =
  'axm.foundation-planet.land-surface-snow-thermal-closure-policy/v1';
export const LAND_SURFACE_SNOW_THERMAL_RESPONSE_TIMESCALE_DAYS = 2.5;
export const LAND_SURFACE_SNOW_MINIMUM_TEMPERATURE_C = -80;
export const LAND_SURFACE_SNOW_MAXIMUM_TEMPERATURE_C = 0;

const finite = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;
const clamp = (value, minimum, maximum) =>
  Math.max(minimum, Math.min(maximum, value));
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

function digestValid(receipt, schema) {
  if (receipt?.schema !== schema || typeof receipt.digest !== 'string') {
    return false;
  }
  const unsigned = clone(receipt);
  delete unsigned.digest;
  return stableDigest(unsigned) === receipt.digest;
}

export function landSurfaceSnowThermalProposalValid(proposal) {
  return digestValid(proposal,
    LAND_SURFACE_SNOW_THERMAL_PROPOSAL_SCHEMA);
}

export function landSurfaceSnowThermalReceiptValid(receipt) {
  return digestValid(receipt,
    LAND_SURFACE_SNOW_THERMAL_RECEIPT_SCHEMA);
}

function closure(signedOperands) {
  const operands = signedOperands.map(Number);
  const residual = operands.reduce((sum, value) => sum + value, 0);
  const scale = operands.reduce((sum, value) =>
    sum + Math.abs(value), 0);
  const numericTolerance = round(Math.max(
    LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    scale * Number.EPSILON * LAND_SNOW_THERMAL_ENERGY_ULP_FACTOR
  ));
  return {
    schema: LAND_SURFACE_SNOW_THERMAL_CLOSURE_SCHEMA,
    policy: {
      schema: LAND_SURFACE_SNOW_THERMAL_CLOSURE_POLICY_SCHEMA,
      kind: 'energy',
      absoluteFloor: LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
      ulpFactor: LAND_SNOW_THERMAL_ENERGY_ULP_FACTOR,
      scaleBasis:
        'sum-of-absolute-unrounded-signed-operands-joules-per-square-metre'
    },
    signedOperands: operands,
    residual: Number(residual),
    numericTolerance,
    toleranceUtilization: round(Math.abs(residual) / numericTolerance),
    closed: Math.abs(residual) <= numericTolerance,
    measuredResidualPreserved: true
  };
}

function surfaceHeatCapacityJm2K(column) {
  return 2.35e6 + finite(column?.substrate?.soilDepthM) * 1.15e6;
}

function ownersMatch(left = {}, right = {}) {
  return Math.abs(finite(left.trackedSnowWaterEquivalentMm) -
      finite(right.trackedSnowWaterEquivalentMm)) <=
        LAND_SNOW_THERMAL_WATER_ABSOLUTE_FLOOR_MM &&
    Math.abs(finite(left.sensibleHeatJm2) -
      finite(right.sensibleHeatJm2)) <=
        LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J &&
    Math.abs(finite(left.snowTemperatureC) -
      finite(right.snowTemperatureC)) <= 1e-12;
}

export function planLandSurfaceSnowThermalExchange(column,
  landSnowThermalReceipt, durationDays, context = {}) {
  if (column?.kind !== 'land' || !column?.land?.snowThermal) {
    throw new Error('Surface-snow thermal planning requires a land column');
  }
  if (!digestValid(landSnowThermalReceipt,
      LAND_SNOW_THERMAL_STEP_RECEIPT_SCHEMA)) {
    throw new Error('Surface-snow thermal planning requires an intact current snow receipt');
  }
  const duration = finite(durationDays);
  if (!(duration > 0) || duration > 1.000001) {
    throw new Error('Surface-snow thermal planning requires a bounded positive duration');
  }
  const snowOwner = column.land.snowThermal.owner;
  if (!ownersMatch(snowOwner, landSnowThermalReceipt.finalOwner)) {
    throw new Error('Surface-snow thermal planning is detached from the current snow owner');
  }
  const waterMm = Math.max(0,
    finite(snowOwner.trackedSnowWaterEquivalentMm));
  const snowHeatCapacityJm2K = waterMm *
    LAND_SNOW_ICE_SPECIFIC_HEAT_J_KG_K;
  const surfaceHeatCapacity = surfaceHeatCapacityJm2K(column);
  const initialSurfaceOwner = {
    ownerKind: 'land-surface-sensible-heat-owner',
    heatCapacityJm2K: Number(surfaceHeatCapacity),
    temperatureC: Number(column.surface.temperatureC),
    sensibleHeatJm2: Number(column.surface.temperatureC) *
      surfaceHeatCapacity
  };
  const initialSnowOwner = clone(snowOwner);
  const responseFraction = 1 - Math.exp(-duration /
    LAND_SURFACE_SNOW_THERMAL_RESPONSE_TIMESCALE_DAYS);
  const jointHeatCapacityJm2K = snowHeatCapacityJm2K > 0
    ? surfaceHeatCapacity * snowHeatCapacityJm2K /
      (surfaceHeatCapacity + snowHeatCapacityJm2K)
    : 0;
  const requestedHeatToSnowJm2 = jointHeatCapacityJm2K *
    (initialSurfaceOwner.temperatureC -
      initialSnowOwner.snowTemperatureC) * responseFraction;
  const minimumHeatToSnowJm2 = snowHeatCapacityJm2K *
    (LAND_SURFACE_SNOW_MINIMUM_TEMPERATURE_C -
      initialSnowOwner.snowTemperatureC);
  const maximumHeatToSnowJm2 = snowHeatCapacityJm2K *
    (LAND_SURFACE_SNOW_MAXIMUM_TEMPERATURE_C -
      initialSnowOwner.snowTemperatureC);
  const appliedHeatToSnowJm2 = snowHeatCapacityJm2K > 0
    ? clamp(requestedHeatToSnowJm2,
      minimumHeatToSnowJm2, maximumHeatToSnowJm2)
    : 0;
  const proposal = {
    schema: LAND_SURFACE_SNOW_THERMAL_PROPOSAL_SCHEMA,
    stepId: String(context.stepId ||
      `${landSnowThermalReceipt.stepId}:surface-snow-plan`),
    durationDays: Number(duration),
    sourceLandSnowThermal: {
      schema: landSnowThermalReceipt.schema,
      receiptDigest: landSnowThermalReceipt.digest,
      stepId: landSnowThermalReceipt.stepId
    },
    initialSurfaceOwner,
    initialSnowOwner,
    response: {
      mode: 'bounded-two-owner-bulk-response',
      responseTimescaleDays:
        LAND_SURFACE_SNOW_THERMAL_RESPONSE_TIMESCALE_DAYS,
      responseFraction: Number(responseFraction),
      surfaceHeatCapacityJm2K: Number(surfaceHeatCapacity),
      snowHeatCapacityJm2K: Number(snowHeatCapacityJm2K),
      jointHeatCapacityJm2K: Number(jointHeatCapacityJm2K)
    },
    requestedHeatToSnowJm2: Number(requestedHeatToSnowJm2),
    minimumHeatToSnowJm2: Number(minimumHeatToSnowJm2),
    maximumHeatToSnowJm2: Number(maximumHeatToSnowJm2),
    appliedHeatToSnowJm2: Number(appliedHeatToSnowJm2),
    thermalEnvelopeLimiterJm2: Number(
      appliedHeatToSnowJm2 - requestedHeatToSnowJm2),
    truth: {
      existingSurfaceAndSnowOwnersOnly: true,
      twoOwnerEquilibriumNotCrossed: true,
      snowTemperatureEnvelopeApplied: true,
      bulkResponseParameterized: true,
      resolvedSnowConduction: false,
      meltMassChangedByThisProposal: false,
      fusionLatentHeatModeledByThisProposal: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  proposal.digest = stableDigest(proposal);
  return clone(proposal);
}

export function applyLandSurfaceSnowThermalExchange(column, proposal,
  landSnowThermalReceipt, snowmeltColdContentReceipt,
  surfaceEnergyLedger, context = {}) {
  if (column?.kind !== 'land' || !column?.land?.snowThermal) {
    throw new Error('Surface-snow thermal application requires a land column');
  }
  if (!landSurfaceSnowThermalProposalValid(proposal) ||
      !digestValid(landSnowThermalReceipt,
        LAND_SNOW_THERMAL_STEP_RECEIPT_SCHEMA) ||
      snowmeltColdContentReceipt?.schema !==
        LAND_SNOWMELT_COLD_CONTENT_RECEIPT_SCHEMA ||
      !snowmeltColdContentReceiptValid(snowmeltColdContentReceipt) ||
      surfaceEnergyLedger?.schema !== SURFACE_ENERGY_LEDGER_SCHEMA) {
    throw new Error('Surface-snow thermal application requires intact current source evidence');
  }
  const currentSnowOwner = column.land.snowThermal.owner;
  const energyInitialSurfaceOwner = surfaceEnergyLedger
    .initialSurfaceSensibleHeatOwner || {};
  const heatToSnowJm2 = Number(proposal.appliedHeatToSnowJm2);
  const sourcesBound =
    proposal.sourceLandSnowThermal?.receiptDigest ===
      landSnowThermalReceipt.digest &&
    proposal.sourceLandSnowThermal?.stepId ===
      landSnowThermalReceipt.stepId &&
    ownersMatch(proposal.initialSnowOwner, currentSnowOwner) &&
    ownersMatch(proposal.initialSnowOwner,
      landSnowThermalReceipt.finalOwner) &&
    Math.abs(finite(proposal.initialSurfaceOwner?.heatCapacityJm2K) -
      finite(energyInitialSurfaceOwner.heatCapacityJm2K)) <= 1e-6 &&
    Math.abs(finite(proposal.initialSurfaceOwner?.temperatureC) -
      finite(energyInitialSurfaceOwner.temperatureC)) <= 1e-12 &&
    Math.abs(heatToSnowJm2 - finite(surfaceEnergyLedger
      .surfaceSnowSensibleHeatTransferJm2)) <=
        LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J &&
    Math.abs(heatToSnowJm2 - finite(snowmeltColdContentReceipt
      .sourceSurfaceEnergyLedger
      ?.surfaceSnowSensibleHeatTransferJm2)) <=
        LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J;
  if (!sourcesBound) {
    throw new Error('Surface-snow thermal source evidence is detached');
  }

  const initialSnowOwner = clone(currentSnowOwner);
  const waterMm = Math.max(0,
    finite(initialSnowOwner.trackedSnowWaterEquivalentMm));
  const snowHeatCapacityJm2K = waterMm *
    LAND_SNOW_ICE_SPECIFIC_HEAT_J_KG_K;
  const finalSnowHeatJm2 = finite(initialSnowOwner.sensibleHeatJm2) +
    heatToSnowJm2;
  const finalSnowTemperatureC = snowHeatCapacityJm2K > 0
    ? finalSnowHeatJm2 / snowHeatCapacityJm2K
    : initialSnowOwner.snowTemperatureC;
  if (finalSnowTemperatureC <
        LAND_SURFACE_SNOW_MINIMUM_TEMPERATURE_C - 1e-12 ||
      finalSnowTemperatureC >
        LAND_SURFACE_SNOW_MAXIMUM_TEMPERATURE_C + 1e-12) {
    throw new Error('Surface-snow thermal exchange exceeds the snow temperature envelope');
  }
  const finalSnowOwner = {
    trackedSnowWaterEquivalentMm: Number(waterMm),
    sensibleHeatJm2: snowHeatCapacityJm2K > 0
      ? Number(finalSnowHeatJm2) : 0,
    snowTemperatureC: Number(finalSnowTemperatureC)
  };
  const pairedTransferClosure = closure([
    -heatToSnowJm2,
    heatToSnowJm2
  ]);
  const snowOwnerClosure = closure([
    finalSnowOwner.sensibleHeatJm2,
    -initialSnowOwner.sensibleHeatJm2,
    -heatToSnowJm2
  ]);
  const surfaceEnergyClosure = closure([
    finite(surfaceEnergyLedger.storageChangeJm2),
    -finite(surfaceEnergyLedger.surfaceFluxEnergyJm2),
    -finite(surfaceEnergyLedger.boundaryHeatEnergyJm2),
    -finite(surfaceEnergyLedger.precipitationPhaseInputJm2),
    finite(surfaceEnergyLedger.snowmeltColdContentWarmingEnergyJm2),
    heatToSnowJm2,
    finite(surfaceEnergyLedger.surfaceRootZoneSensibleHeatTransferJm2)
  ]);
  if (!pairedTransferClosure.closed || !snowOwnerClosure.closed ||
      !surfaceEnergyClosure.closed) {
    throw new Error('Surface-snow thermal exchange did not close');
  }
  const stepId = String(context.stepId ||
    `${proposal.stepId}:application`);
  const receipt = {
    schema: LAND_SURFACE_SNOW_THERMAL_RECEIPT_SCHEMA,
    stepId,
    status: Math.abs(heatToSnowJm2) <=
        LAND_SNOW_THERMAL_ENERGY_ABSOLUTE_FLOOR_J
      ? 'no-material-surface-snow-heat-transfer'
      : heatToSnowJm2 > 0
        ? 'land-surface-heat-debited-to-snow'
        : 'land-snow-heat-debited-to-surface',
    sourceProposal: {
      schema: proposal.schema,
      receiptDigest: proposal.digest,
      stepId: proposal.stepId,
      proposal: clone(proposal)
    },
    sourceLandSnowThermal: clone(
      proposal.sourceLandSnowThermal),
    sourceSnowmeltColdContent: {
      schema: snowmeltColdContentReceipt.schema,
      receiptDigest: snowmeltColdContentReceipt.digest,
      stepId: snowmeltColdContentReceipt.stepId
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
      surfaceSnowSensibleHeatTransferJm2: Number(
        surfaceEnergyLedger.surfaceSnowSensibleHeatTransferJm2),
      surfaceRootZoneSensibleHeatTransferJm2: Number(
        surfaceEnergyLedger.surfaceRootZoneSensibleHeatTransferJm2),
      residualJm2: Number(surfaceEnergyLedger.residualJm2)
    },
    transfer: {
      transferId: `${stepId}:paired-sensible-heat`,
      direction: heatToSnowJm2 > 0
        ? 'land-surface-to-snow'
        : heatToSnowJm2 < 0
          ? 'land-snow-to-surface' : 'none',
      signedHeatToSnowJm2: Number(heatToSnowJm2),
      signedSurfaceOwnerHeatJm2: Number(-heatToSnowJm2),
      signedSnowOwnerHeatJm2: Number(heatToSnowJm2),
      surfaceOwnerKind: 'existing-land-surface-sensible-heat-owner',
      snowOwnerKind: 'persistent-land-snow-thermal-owner',
      senderOwnerDebited: true,
      receiverOwnerCredited: true
    },
    initialSnowOwner,
    finalSnowOwner,
    pairedTransferClosure,
    snowOwnerClosure,
    surfaceEnergyClosure,
    truth: {
      existingSurfaceAndSnowOwnersPaired: true,
      signedSurfaceLedgerEntryApplied: true,
      signedSnowOwnerEntryApplied: true,
      snowWaterUnchangedByThisOrgan: true,
      snowTemperatureEnvelopeRespected: true,
      sourceReceiptsExactlyBound: true,
      scaleAwareNumericClosure: true,
      measuredResidualsPreserved: true,
      fixedAbsoluteToleranceOnly: false,
      bulkResponseParameterized: true,
      resolvedSnowConduction: false,
      meltMassChangedByThisOrgan: false,
      fusionLatentHeatModeledByThisOrgan: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  receipt.digest = stableDigest(receipt);
  column.land.snowThermal.owner = clone(finalSnowOwner);
  column.land.lastSurfaceSnowThermalReceipt = clone(receipt);
  column.land.surfaceSnowThermalMigrationCheckpoint = false;
  return clone(receipt);
}

export function surfaceSnowThermalDescription() {
  return {
    proposalSchema: LAND_SURFACE_SNOW_THERMAL_PROPOSAL_SCHEMA,
    receiptSchema: LAND_SURFACE_SNOW_THERMAL_RECEIPT_SCHEMA,
    closureSchema: LAND_SURFACE_SNOW_THERMAL_CLOSURE_SCHEMA,
    closurePolicySchema:
      LAND_SURFACE_SNOW_THERMAL_CLOSURE_POLICY_SCHEMA,
    responseTimescaleDays:
      LAND_SURFACE_SNOW_THERMAL_RESPONSE_TIMESCALE_DAYS,
    snowTemperatureEnvelopeC: {
      minimum: LAND_SURFACE_SNOW_MINIMUM_TEMPERATURE_C,
      maximum: LAND_SURFACE_SNOW_MAXIMUM_TEMPERATURE_C
    },
    bulkResponseParameterized: true,
    resolvedSnowConduction: false,
    meltMassChangedByThisOrgan: false,
    fusionLatentHeatModeledByThisOrgan: false,
    scientificCalibrationClaimed: false,
    globalUnloadedBoundaryClaimed: false
  };
}
