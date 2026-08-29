import {
  LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J,
  LAND_HYDROLOGY_THERMAL_ENERGY_ULP_FACTOR
} from './land-hydrology-thermal.mjs?v=0.82.0-r82.1';
import {
  SURFACE_ENERGY_LEDGER_SCHEMA
} from './snowmelt-cold-content.mjs?v=0.82.0-r82.1';
import {
  LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA,
  LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
  LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C,
  LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C,
  deepSubsurfaceMatrixThermalParameters,
  landDeepSoilSubsurfaceMatrixThermalReceiptValid
} from './deep-soil-subsurface-matrix-thermal.mjs?v=0.82.0-r82.1';

export const LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_PROPOSAL_SCHEMA =
  'axm.foundation-planet.land-surface-subsurface-matrix-thermal-proposal/v1';
export const LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-surface-subsurface-matrix-thermal-receipt/v1';
export const LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_CLOSURE_SCHEMA =
  'axm.foundation-planet.land-surface-subsurface-matrix-thermal-closure/v1';
export const LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA =
  'axm.foundation-planet.land-surface-subsurface-matrix-thermal-closure-policy/v1';
export const LAND_SURFACE_SUBSURFACE_MATRIX_RESPONSE_TIMESCALE_DAYS = 21;
export const LAND_SURFACE_SUBSURFACE_MATRIX_MINIMUM_SURFACE_TEMPERATURE_C =
  -120;
export const LAND_SURFACE_SUBSURFACE_MATRIX_MAXIMUM_SURFACE_TEMPERATURE_C =
  80;

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

function digestValid(value, schema) {
  if (value?.schema !== schema || typeof value.digest !== 'string') {
    return false;
  }
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

export function landSurfaceSubsurfaceMatrixThermalProposalValid(proposal) {
  return digestValid(proposal,
    LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_PROPOSAL_SCHEMA);
}

export function landSurfaceSubsurfaceMatrixThermalReceiptValid(receipt) {
  return digestValid(receipt,
    LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA);
}

function same(left, right, tolerance = 1e-12) {
  return Number.isFinite(Number(left)) && Number.isFinite(Number(right)) &&
    Math.abs(Number(left) - Number(right)) <= tolerance;
}

function surfaceOwnersMatch(left = {}, right = {}) {
  return left.ownerKind === 'land-surface-sensible-heat-owner' &&
    right.ownerKind === 'land-surface-sensible-heat-owner' &&
    same(left.heatCapacityJm2K, right.heatCapacityJm2K, 1e-6) &&
    same(left.temperatureC, right.temperatureC) &&
    same(left.sensibleHeatJm2, right.sensibleHeatJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);
}

function matrixOwnersMatch(left = {}, right = {}) {
  return left.materialClass ===
      'parameterized-deep-subsurface-mineral-matrix' &&
    right.materialClass === left.materialClass &&
    same(left.upperBoundaryDepthM, right.upperBoundaryDepthM) &&
    same(left.lowerBoundaryDepthM, right.lowerBoundaryDepthM) &&
    same(left.effectiveDepthM, right.effectiveDepthM) &&
    same(left.separationToAquiferMatrixM,
      right.separationToAquiferMatrixM) &&
    same(left.solidFraction, right.solidFraction) &&
    same(left.volumetricHeatCapacityJm3K,
      right.volumetricHeatCapacityJm3K) &&
    same(left.heatCapacityJm2K, right.heatCapacityJm2K, 1e-6) &&
    same(left.temperatureC, right.temperatureC) &&
    same(left.sensibleHeatJm2, right.sensibleHeatJm2,
      LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J);
}

function surfaceHeatCapacityJm2K(substrate = {}) {
  return 2.35e6 + finite(substrate.soilDepthM) * 1.15e6;
}

function surfaceOwner(column) {
  const heatCapacityJm2K = surfaceHeatCapacityJm2K(column?.substrate);
  const temperatureC = finite(column?.surface?.temperatureC);
  return {
    ownerKind: 'land-surface-sensible-heat-owner',
    heatCapacityJm2K: Number(heatCapacityJm2K),
    temperatureC: Number(temperatureC),
    sensibleHeatJm2: Number(heatCapacityJm2K * temperatureC)
  };
}

function surfaceEnergyBinding(ledger = {}) {
  const owner = ledger.finalSurfaceSensibleHeatOwner || {};
  const binding = {
    schema: ledger.schema || null,
    stepId: ledger.stepId || null,
    finalSurfaceSensibleHeatOwner: {
      ownerKind: owner.ownerKind || null,
      heatCapacityJm2K: round(finite(owner.heatCapacityJm2K), 6),
      temperatureC: round(finite(owner.temperatureC), 6),
      sensibleHeatJm2: round(finite(owner.sensibleHeatJm2), 6)
    }
  };
  binding.bindingDigest = stableDigest(binding);
  return binding;
}

function interfaceGeometry(substrate = {}, matrixOwner = {}) {
  const parameters = deepSubsurfaceMatrixThermalParameters(substrate);
  const surfaceOwnerLowerBoundaryDepthM =
    Number(parameters.surfaceOwnerLowerBoundaryDepthM);
  const matrixUpperBoundaryDepthM =
    Number(matrixOwner.upperBoundaryDepthM);
  const signedInterfaceSeparationM =
    matrixUpperBoundaryDepthM - surfaceOwnerLowerBoundaryDepthM;
  return {
    mode: 'coincident-land-surface-deep-subsurface-matrix-interface',
    surfaceOwnerLowerBoundaryDepthM,
    matrixUpperBoundaryDepthM,
    signedInterfaceSeparationM: Number(signedInterfaceSeparationM),
    boundariesCoincident: Math.abs(signedInterfaceSeparationM) <= 1e-12,
    ownerIntervalsOverlap: false
  };
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
    schema: LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_CLOSURE_SCHEMA,
    policy: {
      schema:
        LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA,
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

export function planLandSurfaceSubsurfaceMatrixThermalExchange(column,
  deepSoilSubsurfaceMatrixThermalReceipt, surfaceEnergyLedger,
  durationDays, context = {}) {
  const state = column?.land?.deepSubsurfaceMatrixThermal;
  if (column?.kind !== 'land' ||
      state?.schema !== LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA) {
    throw new Error('Surface/subsurface-matrix planning requires a land column and persistent matrix owner');
  }
  if (!landDeepSoilSubsurfaceMatrixThermalReceiptValid(
      deepSoilSubsurfaceMatrixThermalReceipt) ||
      surfaceEnergyLedger?.schema !== SURFACE_ENERGY_LEDGER_SCHEMA) {
    throw new Error('Surface/subsurface-matrix planning requires intact current R81 and surface-energy evidence');
  }
  const duration = finite(durationDays);
  if (!(duration > 0) || duration > 1.000001) {
    throw new Error('Surface/subsurface-matrix planning requires a bounded positive duration');
  }
  const currentSurfaceOwner = surfaceOwner(column);
  const ledgerSurfaceOwner = surfaceEnergyLedger
    .finalSurfaceSensibleHeatOwner || {};
  const initialMatrixOwner = state.owner || {};
  const geometry = interfaceGeometry(column.substrate,
    initialMatrixOwner);
  if (!surfaceOwnersMatch(currentSurfaceOwner, ledgerSurfaceOwner) ||
      !matrixOwnersMatch(initialMatrixOwner,
        deepSoilSubsurfaceMatrixThermalReceipt
          .finalDeepSubsurfaceMatrixOwner) ||
      geometry.boundariesCoincident !== true ||
      geometry.ownerIntervalsOverlap !== false) {
    throw new Error('Surface/subsurface-matrix planning is detached from the current adjacent owners');
  }

  const initialSurfaceOwner = clone(currentSurfaceOwner);
  const initialDeepSubsurfaceMatrixOwner = clone(initialMatrixOwner);
  const surfaceCapacity = Math.max(0,
    finite(initialSurfaceOwner.heatCapacityJm2K));
  const matrixCapacity = Math.max(0,
    finite(initialDeepSubsurfaceMatrixOwner.heatCapacityJm2K));
  const responseFraction = 1 - Math.exp(-duration /
    LAND_SURFACE_SUBSURFACE_MATRIX_RESPONSE_TIMESCALE_DAYS);
  const jointCapacity = surfaceCapacity > 0 && matrixCapacity > 0
    ? surfaceCapacity * matrixCapacity /
      (surfaceCapacity + matrixCapacity) : 0;
  const requestedHeatToMatrixJm2 = jointCapacity *
    (initialSurfaceOwner.temperatureC -
      initialDeepSubsurfaceMatrixOwner.temperatureC) *
    responseFraction;
  const minimumHeatToMatrixJm2 = Math.max(
    surfaceCapacity * (initialSurfaceOwner.temperatureC -
      LAND_SURFACE_SUBSURFACE_MATRIX_MAXIMUM_SURFACE_TEMPERATURE_C),
    matrixCapacity * (LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C -
      initialDeepSubsurfaceMatrixOwner.temperatureC));
  const maximumHeatToMatrixJm2 = Math.min(
    surfaceCapacity * (initialSurfaceOwner.temperatureC -
      LAND_SURFACE_SUBSURFACE_MATRIX_MINIMUM_SURFACE_TEMPERATURE_C),
    matrixCapacity * (LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C -
      initialDeepSubsurfaceMatrixOwner.temperatureC));
  const appliedHeatToMatrixJm2 = surfaceCapacity > 0 && matrixCapacity > 0
    ? clamp(requestedHeatToMatrixJm2,
      minimumHeatToMatrixJm2, maximumHeatToMatrixJm2) : 0;
  const proposal = {
    schema: LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_PROPOSAL_SCHEMA,
    stepId: String(context.stepId ||
      `${deepSoilSubsurfaceMatrixThermalReceipt.stepId}:surface-interface-plan`),
    durationDays: Number(duration),
    sourceDeepSoilSubsurfaceMatrixThermal: {
      schema: LAND_DEEP_SOIL_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
      receiptDigest: deepSoilSubsurfaceMatrixThermalReceipt.digest,
      stepId: deepSoilSubsurfaceMatrixThermalReceipt.stepId
    },
    sourceSurfaceEnergyLedger: surfaceEnergyBinding(surfaceEnergyLedger),
    interface: geometry,
    initialSurfaceOwner,
    initialDeepSubsurfaceMatrixOwner,
    response: {
      mode: 'bounded-land-surface-deep-subsurface-matrix-interface-response',
      responseTimescaleDays:
        LAND_SURFACE_SUBSURFACE_MATRIX_RESPONSE_TIMESCALE_DAYS,
      responseFraction: Number(responseFraction),
      surfaceHeatCapacityJm2K: Number(surfaceCapacity),
      deepSubsurfaceMatrixHeatCapacityJm2K: Number(matrixCapacity),
      jointHeatCapacityJm2K: Number(jointCapacity)
    },
    requestedHeatToMatrixJm2: Number(requestedHeatToMatrixJm2),
    minimumHeatToMatrixJm2: Number(minimumHeatToMatrixJm2),
    maximumHeatToMatrixJm2: Number(maximumHeatToMatrixJm2),
    appliedHeatToMatrixJm2: Number(appliedHeatToMatrixJm2),
    thermalEnvelopeLimiterJm2: Number(
      appliedHeatToMatrixJm2 - requestedHeatToMatrixJm2),
    truth: {
      existingSurfaceAndDeepSubsurfaceMatrixOwnersOnly: true,
      exactCoincidentInterfaceUsed: true,
      ownerIntervalsOverlap: false,
      twoOwnerEquilibriumNotCrossed: true,
      bothTemperatureEnvelopesApplied: true,
      surfaceOwnerGeometryUnchangedByThisProposal: true,
      subsurfaceMatrixGeometryUnchangedByThisProposal: true,
      bulkInterfaceResponseParameterized: true,
      resolvedSubsurfaceConduction: false,
      geothermalForcingModeledByThisProposal: false,
      phaseChangeModeledByThisProposal: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  proposal.digest = stableDigest(proposal);
  return clone(proposal);
}

export function applyLandSurfaceSubsurfaceMatrixThermalExchange(column,
  proposal, deepSoilSubsurfaceMatrixThermalReceipt,
  surfaceEnergyLedger, context = {}) {
  const state = column?.land?.deepSubsurfaceMatrixThermal;
  if (column?.kind !== 'land' ||
      state?.schema !== LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA) {
    throw new Error('Surface/subsurface-matrix application requires a land column and persistent matrix owner');
  }
  if (!landSurfaceSubsurfaceMatrixThermalProposalValid(proposal) ||
      !landDeepSoilSubsurfaceMatrixThermalReceiptValid(
        deepSoilSubsurfaceMatrixThermalReceipt) ||
      surfaceEnergyLedger?.schema !== SURFACE_ENERGY_LEDGER_SCHEMA) {
    throw new Error('Surface/subsurface-matrix application requires intact current source evidence');
  }
  const currentSurfaceOwner = surfaceOwner(column);
  const currentMatrixOwner = state.owner || {};
  const currentEnergyBinding = surfaceEnergyBinding(surfaceEnergyLedger);
  const sourcesBound =
    proposal.sourceDeepSoilSubsurfaceMatrixThermal?.receiptDigest ===
      deepSoilSubsurfaceMatrixThermalReceipt.digest &&
    proposal.sourceDeepSoilSubsurfaceMatrixThermal?.stepId ===
      deepSoilSubsurfaceMatrixThermalReceipt.stepId &&
    state.lastStepReceipt?.digest ===
      deepSoilSubsurfaceMatrixThermalReceipt.digest &&
    proposal.sourceSurfaceEnergyLedger?.bindingDigest ===
      currentEnergyBinding.bindingDigest &&
    proposal.sourceSurfaceEnergyLedger?.stepId ===
      currentEnergyBinding.stepId &&
    surfaceOwnersMatch(proposal.initialSurfaceOwner,
      currentSurfaceOwner) &&
    surfaceOwnersMatch(proposal.initialSurfaceOwner,
      surfaceEnergyLedger.finalSurfaceSensibleHeatOwner) &&
    matrixOwnersMatch(proposal.initialDeepSubsurfaceMatrixOwner,
      currentMatrixOwner) &&
    matrixOwnersMatch(proposal.initialDeepSubsurfaceMatrixOwner,
      deepSoilSubsurfaceMatrixThermalReceipt
        .finalDeepSubsurfaceMatrixOwner);
  if (!sourcesBound) {
    throw new Error('Surface/subsurface-matrix source evidence is detached');
  }

  const heatToMatrixJm2 = Number(proposal.appliedHeatToMatrixJm2);
  const initialSurfaceOwner = clone(currentSurfaceOwner);
  const initialDeepSubsurfaceMatrixOwner = clone(currentMatrixOwner);
  const surfaceCapacity = Math.max(0,
    finite(initialSurfaceOwner.heatCapacityJm2K));
  const matrixCapacity = Math.max(0,
    finite(initialDeepSubsurfaceMatrixOwner.heatCapacityJm2K));
  const finalSurfaceHeatJm2 =
    finite(initialSurfaceOwner.sensibleHeatJm2) - heatToMatrixJm2;
  const finalMatrixHeatJm2 =
    finite(initialDeepSubsurfaceMatrixOwner.sensibleHeatJm2) +
      heatToMatrixJm2;
  const finalSurfaceTemperatureC = surfaceCapacity > 0
    ? finalSurfaceHeatJm2 / surfaceCapacity
    : initialSurfaceOwner.temperatureC;
  const finalMatrixTemperatureC = matrixCapacity > 0
    ? finalMatrixHeatJm2 / matrixCapacity
    : initialDeepSubsurfaceMatrixOwner.temperatureC;
  if (finalSurfaceTemperatureC <
        LAND_SURFACE_SUBSURFACE_MATRIX_MINIMUM_SURFACE_TEMPERATURE_C -
          1e-12 ||
      finalSurfaceTemperatureC >
        LAND_SURFACE_SUBSURFACE_MATRIX_MAXIMUM_SURFACE_TEMPERATURE_C +
          1e-12 ||
      finalMatrixTemperatureC <
        LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C - 1e-12 ||
      finalMatrixTemperatureC >
        LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C + 1e-12) {
    throw new Error('Surface/subsurface-matrix exchange exceeds a declared temperature envelope');
  }
  const finalSurfaceOwner = {
    ...clone(initialSurfaceOwner),
    temperatureC: Number(finalSurfaceTemperatureC),
    sensibleHeatJm2: Number(finalSurfaceHeatJm2)
  };
  const finalDeepSubsurfaceMatrixOwner = {
    ...clone(initialDeepSubsurfaceMatrixOwner),
    temperatureC: Number(finalMatrixTemperatureC),
    sensibleHeatJm2: Number(finalMatrixHeatJm2)
  };
  const pairedTransferClosure = closure([
    -heatToMatrixJm2, heatToMatrixJm2
  ]);
  const surfaceOwnerClosure = closure([
    finalSurfaceOwner.sensibleHeatJm2,
    -initialSurfaceOwner.sensibleHeatJm2,
    heatToMatrixJm2
  ]);
  const deepSubsurfaceMatrixOwnerClosure = closure([
    finalDeepSubsurfaceMatrixOwner.sensibleHeatJm2,
    -initialDeepSubsurfaceMatrixOwner.sensibleHeatJm2,
    -heatToMatrixJm2
  ]);
  const combinedOwnerClosure = closure([
    finalSurfaceOwner.sensibleHeatJm2,
    finalDeepSubsurfaceMatrixOwner.sensibleHeatJm2,
    -initialSurfaceOwner.sensibleHeatJm2,
    -initialDeepSubsurfaceMatrixOwner.sensibleHeatJm2
  ]);
  if (!pairedTransferClosure.closed || !surfaceOwnerClosure.closed ||
      !deepSubsurfaceMatrixOwnerClosure.closed ||
      !combinedOwnerClosure.closed) {
    throw new Error('Surface/subsurface-matrix thermal exchange did not close');
  }
  const stepId = String(context.stepId ||
    `${proposal.stepId}:application`);
  const receipt = {
    schema: LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
    stepId,
    status: Math.abs(heatToMatrixJm2) <=
        LAND_HYDROLOGY_THERMAL_ENERGY_ABSOLUTE_FLOOR_J
      ? 'no-material-surface-subsurface-matrix-heat-transfer'
      : heatToMatrixJm2 > 0
        ? 'land-surface-heat-debited-to-deep-subsurface-matrix'
        : 'deep-subsurface-matrix-heat-debited-to-land-surface',
    sourceProposal: {
      schema: proposal.schema,
      receiptDigest: proposal.digest,
      stepId: proposal.stepId,
      proposal: clone(proposal)
    },
    sourceDeepSoilSubsurfaceMatrixThermal:
      clone(proposal.sourceDeepSoilSubsurfaceMatrixThermal),
    sourceSurfaceEnergyLedger:
      clone(proposal.sourceSurfaceEnergyLedger),
    interface: clone(proposal.interface),
    transfer: {
      transferId: `${stepId}:paired-sensible-heat`,
      direction: heatToMatrixJm2 > 0
        ? 'land-surface-to-deep-subsurface-matrix'
        : heatToMatrixJm2 < 0
          ? 'deep-subsurface-matrix-to-land-surface' : 'none',
      signedHeatToMatrixJm2: Number(heatToMatrixJm2),
      signedSurfaceOwnerHeatJm2: Number(-heatToMatrixJm2),
      signedDeepSubsurfaceMatrixOwnerHeatJm2:
        Number(heatToMatrixJm2),
      surfaceOwnerKind: 'existing-land-surface-sensible-heat-owner',
      matrixOwnerKind:
        'persistent-parameterized-deep-subsurface-mineral-matrix-thermal-owner',
      senderOwnerDebited: true,
      receiverOwnerCredited: true
    },
    initialSurfaceOwner,
    finalSurfaceOwner,
    initialDeepSubsurfaceMatrixOwner,
    finalDeepSubsurfaceMatrixOwner,
    pairedTransferClosure,
    surfaceOwnerClosure,
    deepSubsurfaceMatrixOwnerClosure,
    combinedOwnerClosure,
    migrationInitialization: {
      sourceWasNoHistoryCheckpoint:
        column.land.surfaceSubsurfaceMatrixThermalMigrationCheckpoint ===
          true,
      historicalHeatReconstructed: false
    },
    truth: {
      existingSurfaceAndDeepSubsurfaceMatrixOwnersPaired: true,
      exactCoincidentInterfaceUsed: true,
      ownerIntervalsOverlap: false,
      signedSurfaceOwnerEntryApplied: true,
      signedDeepSubsurfaceMatrixOwnerEntryApplied: true,
      surfaceOwnerGeometryUnchangedByThisOrgan: true,
      subsurfaceMatrixGeometryUnchangedByThisOrgan: true,
      bothTemperatureEnvelopesRespected: true,
      sourceReceiptsExactlyBound: true,
      scaleAwareNumericClosure: true,
      measuredResidualsPreserved: true,
      fixedAbsoluteToleranceOnly: false,
      bulkInterfaceResponseParameterized: true,
      resolvedSubsurfaceConduction: false,
      geothermalForcingModeledByThisOrgan: false,
      phaseChangeModeledByThisOrgan: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  receipt.digest = stableDigest(receipt);
  column.surface.temperatureC = Number(finalSurfaceTemperatureC);
  state.owner = clone(finalDeepSubsurfaceMatrixOwner);
  column.land.lastSurfaceSubsurfaceMatrixThermalReceipt = clone(receipt);
  column.land.surfaceSubsurfaceMatrixThermalMigrationCheckpoint = false;
  return clone(receipt);
}

export function surfaceSubsurfaceMatrixThermalDescription() {
  return {
    proposalSchema:
      LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_PROPOSAL_SCHEMA,
    receiptSchema:
      LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_RECEIPT_SCHEMA,
    closureSchema:
      LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_CLOSURE_SCHEMA,
    closurePolicySchema:
      LAND_SURFACE_SUBSURFACE_MATRIX_THERMAL_CLOSURE_POLICY_SCHEMA,
    responseTimescaleDays:
      LAND_SURFACE_SUBSURFACE_MATRIX_RESPONSE_TIMESCALE_DAYS,
    surfaceTemperatureEnvelopeC: {
      minimum:
        LAND_SURFACE_SUBSURFACE_MATRIX_MINIMUM_SURFACE_TEMPERATURE_C,
      maximum:
        LAND_SURFACE_SUBSURFACE_MATRIX_MAXIMUM_SURFACE_TEMPERATURE_C
    },
    matrixTemperatureEnvelopeC: {
      minimum: LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C,
      maximum: LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C
    },
    exactCoincidentInterfaceRequired: true,
    bulkInterfaceResponseParameterized: true,
    resolvedSubsurfaceConduction: false,
    geothermalForcingModeledByThisOrgan: false,
    phaseChangeModeledByThisOrgan: false,
    scientificCalibrationClaimed: false,
    globalUnloadedBoundaryClaimed: false
  };
}
