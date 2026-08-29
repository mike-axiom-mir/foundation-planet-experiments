import {
  LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA,
  LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K,
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR,
  LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM
} from './land-hydrology-thermal.mjs?v=0.77.0-r77.1';
import {
  SURFACE_ENERGY_LEDGER_SCHEMA
} from './snowmelt-cold-content.mjs?v=0.77.0-r77.1';
import {
  LAND_SURFACE_SNOW_THERMAL_RECEIPT_SCHEMA,
  landSurfaceSnowThermalReceiptValid
} from './surface-snow-thermal.mjs?v=0.77.0-r77.1';

export const LAND_SURFACE_ROOT_ZONE_THERMAL_PROPOSAL_SCHEMA =
  'axm.foundation-planet.land-surface-root-zone-thermal-proposal/v1';
export const LAND_SURFACE_ROOT_ZONE_THERMAL_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-surface-root-zone-thermal-receipt/v1';
export const LAND_SURFACE_ROOT_ZONE_THERMAL_CLOSURE_SCHEMA =
  'axm.foundation-planet.land-surface-root-zone-thermal-closure/v1';
export const LAND_SURFACE_ROOT_ZONE_THERMAL_CLOSURE_POLICY_SCHEMA =
  'axm.foundation-planet.land-surface-root-zone-thermal-closure-policy/v1';
export const LAND_SURFACE_ROOT_ZONE_THERMAL_RESPONSE_TIMESCALE_DAYS = 4;
export const LAND_SURFACE_ROOT_ZONE_MINIMUM_TEMPERATURE_C = -2;
export const LAND_SURFACE_ROOT_ZONE_MAXIMUM_TEMPERATURE_C = 45;

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

export function landSurfaceRootZoneThermalProposalValid(proposal) {
  return digestValid(proposal,
    LAND_SURFACE_ROOT_ZONE_THERMAL_PROPOSAL_SCHEMA);
}

export function landSurfaceRootZoneThermalReceiptValid(receipt) {
  return digestValid(receipt,
    LAND_SURFACE_ROOT_ZONE_THERMAL_RECEIPT_SCHEMA);
}

function closure(signedOperands) {
  const operands = signedOperands.map(Number);
  const residual = operands.reduce((sum, value) => sum + value, 0);
  const scale = operands.reduce((sum, value) =>
    sum + Math.abs(value), 0);
  const numericTolerance = round(Math.max(
    LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
    scale * Number.EPSILON * LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
  ));
  return {
    schema: LAND_SURFACE_ROOT_ZONE_THERMAL_CLOSURE_SCHEMA,
    policy: {
      schema: LAND_SURFACE_ROOT_ZONE_THERMAL_CLOSURE_POLICY_SCHEMA,
      kind: 'energy',
      absoluteFloor: LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
      ulpFactor: LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR,
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

function rootOwnerMatches(left = {}, right = {}) {
  return Math.abs(finite(left.trackedWaterMm) -
      finite(right.trackedWaterMm)) <=
        LAND_HYDROLOGY_THERMAL_WATER_ABSOLUTE_FLOOR_MM &&
    Math.abs(finite(left.sensibleHeatJm2) -
      finite(right.sensibleHeatJm2)) <=
        LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J &&
    Math.abs(finite(left.waterTemperatureC) -
      finite(right.waterTemperatureC)) <= 1e-12;
}

export function planLandSurfaceRootZoneThermalExchange(column,
  landHydrologyThermalReceipt, durationDays, context = {}) {
  if (column?.kind !== 'land' ||
      !column?.land?.hydrologyThermal?.reservoirs?.rootZone) {
    throw new Error('Surface-root-zone thermal planning requires a land column');
  }
  if (!digestValid(landHydrologyThermalReceipt,
      LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA)) {
    throw new Error('Surface-root-zone thermal planning requires an intact current land-hydrology receipt');
  }
  const duration = finite(durationDays);
  if (!(duration > 0) || duration > 1.000001) {
    throw new Error('Surface-root-zone thermal planning requires a bounded positive duration');
  }
  const rootOwner = column.land.hydrologyThermal.reservoirs.rootZone;
  if (!rootOwnerMatches(rootOwner,
      landHydrologyThermalReceipt.finalOwners?.rootZone)) {
    throw new Error('Surface-root-zone thermal planning is detached from the current root-zone owner');
  }
  const rootWaterMm = Math.max(0, finite(rootOwner.trackedWaterMm));
  const rootHeatCapacityJm2K = rootWaterMm *
    LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K;
  const surfaceHeatCapacity = surfaceHeatCapacityJm2K(column);
  const initialSurfaceOwner = {
    ownerKind: 'land-surface-sensible-heat-owner',
    heatCapacityJm2K: Number(surfaceHeatCapacity),
    temperatureC: Number(column.surface.temperatureC),
    sensibleHeatJm2: Number(column.surface.temperatureC) *
      surfaceHeatCapacity
  };
  const initialRootZoneOwner = clone(rootOwner);
  const responseFraction = 1 - Math.exp(-duration /
    LAND_SURFACE_ROOT_ZONE_THERMAL_RESPONSE_TIMESCALE_DAYS);
  const jointHeatCapacityJm2K = rootHeatCapacityJm2K > 0
    ? surfaceHeatCapacity * rootHeatCapacityJm2K /
      (surfaceHeatCapacity + rootHeatCapacityJm2K)
    : 0;
  const requestedHeatToRootZoneJm2 = jointHeatCapacityJm2K *
    (initialSurfaceOwner.temperatureC -
      initialRootZoneOwner.waterTemperatureC) * responseFraction;
  const minimumHeatToRootZoneJm2 = rootHeatCapacityJm2K *
    (LAND_SURFACE_ROOT_ZONE_MINIMUM_TEMPERATURE_C -
      initialRootZoneOwner.waterTemperatureC);
  const maximumHeatToRootZoneJm2 = rootHeatCapacityJm2K *
    (LAND_SURFACE_ROOT_ZONE_MAXIMUM_TEMPERATURE_C -
      initialRootZoneOwner.waterTemperatureC);
  const appliedHeatToRootZoneJm2 = rootHeatCapacityJm2K > 0
    ? clamp(requestedHeatToRootZoneJm2,
      minimumHeatToRootZoneJm2, maximumHeatToRootZoneJm2)
    : 0;
  const proposal = {
    schema: LAND_SURFACE_ROOT_ZONE_THERMAL_PROPOSAL_SCHEMA,
    stepId: String(context.stepId ||
      `${landHydrologyThermalReceipt.stepId}:surface-root-zone-plan`),
    durationDays: Number(duration),
    sourceLandHydrologyThermal: {
      schema: landHydrologyThermalReceipt.schema,
      receiptDigest: landHydrologyThermalReceipt.digest,
      stepId: landHydrologyThermalReceipt.stepId
    },
    initialSurfaceOwner,
    initialRootZoneOwner,
    response: {
      mode: 'bounded-two-owner-bulk-response',
      responseTimescaleDays:
        LAND_SURFACE_ROOT_ZONE_THERMAL_RESPONSE_TIMESCALE_DAYS,
      responseFraction: Number(responseFraction),
      surfaceHeatCapacityJm2K: Number(surfaceHeatCapacity),
      rootZoneWaterHeatCapacityJm2K: Number(rootHeatCapacityJm2K),
      jointHeatCapacityJm2K: Number(jointHeatCapacityJm2K)
    },
    requestedHeatToRootZoneJm2: Number(requestedHeatToRootZoneJm2),
    minimumHeatToRootZoneJm2: Number(minimumHeatToRootZoneJm2),
    maximumHeatToRootZoneJm2: Number(maximumHeatToRootZoneJm2),
    appliedHeatToRootZoneJm2: Number(appliedHeatToRootZoneJm2),
    thermalEnvelopeLimiterJm2: Number(
      appliedHeatToRootZoneJm2 - requestedHeatToRootZoneJm2),
    truth: {
      existingSurfaceAndRootZoneWaterOwnersOnly: true,
      twoOwnerEquilibriumNotCrossed: true,
      rootZoneWaterTemperatureEnvelopeApplied: true,
      rootZoneWaterUnchangedByThisProposal: true,
      bulkResponseParameterized: true,
      resolvedSoilConduction: false,
      deepSoilThermalExchangeModeledByThisProposal: false,
      groundwaterThermalExchangeModeledByThisProposal: false,
      phaseChangeModeledByThisProposal: false,
      geothermalForcingModeledByThisProposal: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  proposal.digest = stableDigest(proposal);
  return clone(proposal);
}

export function applyLandSurfaceRootZoneThermalExchange(column, proposal,
  landHydrologyThermalReceipt, surfaceSnowThermalReceipt,
  surfaceEnergyLedger, context = {}) {
  if (column?.kind !== 'land' ||
      !column?.land?.hydrologyThermal?.reservoirs?.rootZone) {
    throw new Error('Surface-root-zone thermal application requires a land column');
  }
  if (!landSurfaceRootZoneThermalProposalValid(proposal) ||
      !digestValid(landHydrologyThermalReceipt,
        LAND_HYDROLOGY_THERMAL_STEP_RECEIPT_SCHEMA) ||
      surfaceSnowThermalReceipt?.schema !==
        LAND_SURFACE_SNOW_THERMAL_RECEIPT_SCHEMA ||
      !landSurfaceSnowThermalReceiptValid(surfaceSnowThermalReceipt) ||
      surfaceEnergyLedger?.schema !== SURFACE_ENERGY_LEDGER_SCHEMA) {
    throw new Error('Surface-root-zone thermal application requires intact current source evidence');
  }
  const currentRootZoneOwner = column.land.hydrologyThermal
    .reservoirs.rootZone;
  const energyInitialSurfaceOwner = surfaceEnergyLedger
    .initialSurfaceSensibleHeatOwner || {};
  const heatToRootZoneJm2 = Number(proposal.appliedHeatToRootZoneJm2);
  const sourcesBound =
    proposal.sourceLandHydrologyThermal?.receiptDigest ===
      landHydrologyThermalReceipt.digest &&
    proposal.sourceLandHydrologyThermal?.stepId ===
      landHydrologyThermalReceipt.stepId &&
    rootOwnerMatches(proposal.initialRootZoneOwner,
      currentRootZoneOwner) &&
    rootOwnerMatches(proposal.initialRootZoneOwner,
      landHydrologyThermalReceipt.finalOwners?.rootZone) &&
    Math.abs(finite(proposal.initialSurfaceOwner?.heatCapacityJm2K) -
      finite(energyInitialSurfaceOwner.heatCapacityJm2K)) <= 1e-6 &&
    Math.abs(finite(proposal.initialSurfaceOwner?.temperatureC) -
      finite(energyInitialSurfaceOwner.temperatureC)) <= 1e-12 &&
    Math.abs(heatToRootZoneJm2 - finite(surfaceEnergyLedger
      .surfaceRootZoneSensibleHeatTransferJm2)) <=
        LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J &&
    surfaceSnowThermalReceipt.sourceSurfaceEnergyLedger?.stepId ===
      surfaceEnergyLedger.stepId &&
    Math.abs(heatToRootZoneJm2 - finite(surfaceSnowThermalReceipt
      .sourceSurfaceEnergyLedger
      ?.surfaceRootZoneSensibleHeatTransferJm2)) <=
        LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J;
  if (!sourcesBound) {
    throw new Error('Surface-root-zone thermal source evidence is detached');
  }

  const initialRootZoneOwner = clone(currentRootZoneOwner);
  const waterMm = Math.max(0,
    finite(initialRootZoneOwner.trackedWaterMm));
  const rootHeatCapacityJm2K = waterMm *
    LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K;
  const finalRootZoneHeatJm2 =
    finite(initialRootZoneOwner.sensibleHeatJm2) + heatToRootZoneJm2;
  const finalRootZoneTemperatureC = rootHeatCapacityJm2K > 0
    ? finalRootZoneHeatJm2 / rootHeatCapacityJm2K
    : initialRootZoneOwner.waterTemperatureC;
  if (finalRootZoneTemperatureC <
        LAND_SURFACE_ROOT_ZONE_MINIMUM_TEMPERATURE_C - 1e-12 ||
      finalRootZoneTemperatureC >
        LAND_SURFACE_ROOT_ZONE_MAXIMUM_TEMPERATURE_C + 1e-12) {
    throw new Error('Surface-root-zone thermal exchange exceeds the liquid-water temperature envelope');
  }
  const finalRootZoneOwner = {
    trackedWaterMm: Number(waterMm),
    sensibleHeatJm2: rootHeatCapacityJm2K > 0
      ? Number(finalRootZoneHeatJm2) : 0,
    waterTemperatureC: Number(finalRootZoneTemperatureC)
  };
  const pairedTransferClosure = closure([
    -heatToRootZoneJm2,
    heatToRootZoneJm2
  ]);
  const rootZoneOwnerClosure = closure([
    finalRootZoneOwner.sensibleHeatJm2,
    -initialRootZoneOwner.sensibleHeatJm2,
    -heatToRootZoneJm2
  ]);
  const surfaceEnergyClosure = closure([
    finite(surfaceEnergyLedger.storageChangeJm2),
    -finite(surfaceEnergyLedger.surfaceFluxEnergyJm2),
    -finite(surfaceEnergyLedger.boundaryHeatEnergyJm2),
    -finite(surfaceEnergyLedger.precipitationPhaseInputJm2),
    finite(surfaceEnergyLedger.snowmeltColdContentWarmingEnergyJm2),
    finite(surfaceEnergyLedger.surfaceSnowSensibleHeatTransferJm2),
    heatToRootZoneJm2
  ]);
  if (!pairedTransferClosure.closed || !rootZoneOwnerClosure.closed ||
      !surfaceEnergyClosure.closed) {
    throw new Error('Surface-root-zone thermal exchange did not close');
  }
  const stepId = String(context.stepId ||
    `${proposal.stepId}:application`);
  const receipt = {
    schema: LAND_SURFACE_ROOT_ZONE_THERMAL_RECEIPT_SCHEMA,
    stepId,
    status: Math.abs(heatToRootZoneJm2) <=
        LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J
      ? 'no-material-surface-root-zone-heat-transfer'
      : heatToRootZoneJm2 > 0
        ? 'land-surface-heat-debited-to-root-zone-water'
        : 'root-zone-water-heat-debited-to-land-surface',
    sourceProposal: {
      schema: proposal.schema,
      receiptDigest: proposal.digest,
      stepId: proposal.stepId,
      proposal: clone(proposal)
    },
    sourceLandHydrologyThermal: clone(
      proposal.sourceLandHydrologyThermal),
    sourceSurfaceSnowThermal: {
      schema: surfaceSnowThermalReceipt.schema,
      receiptDigest: surfaceSnowThermalReceipt.digest,
      stepId: surfaceSnowThermalReceipt.stepId
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
      direction: heatToRootZoneJm2 > 0
        ? 'land-surface-to-root-zone-water'
        : heatToRootZoneJm2 < 0
          ? 'root-zone-water-to-land-surface' : 'none',
      signedHeatToRootZoneJm2: Number(heatToRootZoneJm2),
      signedSurfaceOwnerHeatJm2: Number(-heatToRootZoneJm2),
      signedRootZoneOwnerHeatJm2: Number(heatToRootZoneJm2),
      surfaceOwnerKind: 'existing-land-surface-sensible-heat-owner',
      rootZoneOwnerKind:
        'persistent-land-hydrology-root-zone-water-thermal-owner',
      senderOwnerDebited: true,
      receiverOwnerCredited: true
    },
    initialRootZoneOwner,
    finalRootZoneOwner,
    pairedTransferClosure,
    rootZoneOwnerClosure,
    surfaceEnergyClosure,
    truth: {
      existingSurfaceAndRootZoneWaterOwnersPaired: true,
      signedSurfaceLedgerEntryApplied: true,
      signedRootZoneOwnerEntryApplied: true,
      rootZoneWaterUnchangedByThisOrgan: true,
      rootZoneWaterTemperatureEnvelopeRespected: true,
      sourceReceiptsExactlyBound: true,
      scaleAwareNumericClosure: true,
      measuredResidualsPreserved: true,
      fixedAbsoluteToleranceOnly: false,
      bulkResponseParameterized: true,
      resolvedSoilConduction: false,
      deepSoilThermalExchangeModeledByThisOrgan: false,
      groundwaterThermalExchangeModeledByThisOrgan: false,
      phaseChangeModeledByThisOrgan: false,
      geothermalForcingModeledByThisOrgan: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  receipt.digest = stableDigest(receipt);
  column.land.hydrologyThermal.reservoirs.rootZone =
    clone(finalRootZoneOwner);
  column.land.lastSurfaceRootZoneThermalReceipt = clone(receipt);
  column.land.surfaceRootZoneThermalMigrationCheckpoint = false;
  return clone(receipt);
}

export function surfaceRootZoneThermalDescription() {
  return {
    proposalSchema: LAND_SURFACE_ROOT_ZONE_THERMAL_PROPOSAL_SCHEMA,
    receiptSchema: LAND_SURFACE_ROOT_ZONE_THERMAL_RECEIPT_SCHEMA,
    closureSchema: LAND_SURFACE_ROOT_ZONE_THERMAL_CLOSURE_SCHEMA,
    closurePolicySchema:
      LAND_SURFACE_ROOT_ZONE_THERMAL_CLOSURE_POLICY_SCHEMA,
    responseTimescaleDays:
      LAND_SURFACE_ROOT_ZONE_THERMAL_RESPONSE_TIMESCALE_DAYS,
    rootZoneWaterTemperatureEnvelopeC: {
      minimum: LAND_SURFACE_ROOT_ZONE_MINIMUM_TEMPERATURE_C,
      maximum: LAND_SURFACE_ROOT_ZONE_MAXIMUM_TEMPERATURE_C
    },
    bulkResponseParameterized: true,
    resolvedSoilConduction: false,
    deepSoilThermalExchangeModeledByThisOrgan: false,
    groundwaterThermalExchangeModeledByThisOrgan: false,
    phaseChangeModeledByThisOrgan: false,
    geothermalForcingModeledByThisOrgan: false,
    scientificCalibrationClaimed: false,
    globalUnloadedBoundaryClaimed: false
  };
}
