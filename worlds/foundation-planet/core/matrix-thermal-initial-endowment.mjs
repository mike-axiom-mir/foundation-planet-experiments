import {
  LAND_AQUIFER_MATRIX_THERMAL_STATE_SCHEMA,
  LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C,
  LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C,
  aquiferMatrixThermalParameters
} from './groundwater-aquifer-matrix-thermal.mjs?v=0.90.0-r90.1';
import {
  LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA,
  LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C,
  LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C,
  deepSubsurfaceMatrixThermalParameters
} from './deep-soil-subsurface-matrix-thermal.mjs?v=0.90.0-r90.1';
import {
  LAND_VADOSE_MATRIX_THERMAL_STATE_SCHEMA,
  LAND_VADOSE_MATRIX_MINIMUM_TEMPERATURE_C,
  LAND_VADOSE_MATRIX_MAXIMUM_TEMPERATURE_C,
  vadoseMatrixThermalParameters
} from './vadose-matrix-thermal.mjs?v=0.90.0-r90.1';

export const LAND_MATRIX_THERMAL_INITIAL_ENDOWMENT_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-initial-endowment-receipt/v1';
export const LAND_MATRIX_THERMAL_INITIAL_ENDOWMENT_BOUNDARY_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-initial-endowment-boundary/v1';

const clone = value => JSON.parse(JSON.stringify(value));
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const finite = value => Number.isFinite(Number(value));
const clamp = (value, minimum, maximum) =>
  Math.max(minimum, Math.min(maximum, Number(value)));

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
  if (value?.schema !==
      LAND_MATRIX_THERMAL_INITIAL_ENDOWMENT_RECEIPT_SCHEMA ||
      typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function deepOwner(parameters, temperatureC) {
  const temperature = clamp(temperatureC,
    LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C,
    LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C);
  return {
    materialClass: 'parameterized-deep-subsurface-mineral-matrix',
    upperBoundaryDepthM: Number(parameters.upperBoundaryDepthM),
    lowerBoundaryDepthM: Number(parameters.lowerBoundaryDepthM),
    effectiveDepthM: Number(parameters.effectiveDepthM),
    separationToAquiferMatrixM:
      Number(parameters.separationToAquiferMatrixM),
    solidFraction: Number(parameters.solidFraction),
    volumetricHeatCapacityJm3K:
      Number(parameters.volumetricHeatCapacityJm3K),
    heatCapacityJm2K: Number(parameters.heatCapacityJm2K),
    temperatureC: Number(temperature),
    sensibleHeatJm2: Number(parameters.heatCapacityJm2K * temperature)
  };
}

function vadoseOwner(parameters, temperatureC) {
  const temperature = clamp(temperatureC,
    LAND_VADOSE_MATRIX_MINIMUM_TEMPERATURE_C,
    LAND_VADOSE_MATRIX_MAXIMUM_TEMPERATURE_C);
  return {
    materialClass: 'parameterized-intervening-vadose-mineral-matrix',
    upperBoundaryDepthM: Number(parameters.upperBoundaryDepthM),
    lowerBoundaryDepthM: Number(parameters.lowerBoundaryDepthM),
    effectiveDepthM: Number(parameters.effectiveDepthM),
    centerDepthM: Number(parameters.centerDepthM),
    solidFraction: Number(parameters.solidFraction),
    volumetricHeatCapacityJm3K:
      Number(parameters.volumetricHeatCapacityJm3K),
    heatCapacityJm2K: Number(parameters.heatCapacityJm2K),
    temperatureC: Number(temperature),
    sensibleHeatJm2: Number(parameters.heatCapacityJm2K * temperature)
  };
}

function aquiferOwner(parameters, temperatureC) {
  const temperature = clamp(temperatureC,
    LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C,
    LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C);
  return {
    materialClass: 'parameterized-aquifer-mineral-matrix',
    effectiveDepthM: Number(parameters.effectiveDepthM),
    solidFraction: Number(parameters.solidFraction),
    volumetricHeatCapacityJm3K:
      Number(parameters.volumetricHeatCapacityJm3K),
    heatCapacityJm2K: Number(parameters.heatCapacityJm2K),
    temperatureC: Number(temperature),
    sensibleHeatJm2: Number(parameters.heatCapacityJm2K * temperature)
  };
}

function expectedInitialStates(substrate, sourceTemperatures) {
  const deepParameters = deepSubsurfaceMatrixThermalParameters(substrate);
  const aquiferParameters = aquiferMatrixThermalParameters(substrate);
  const deep = deepOwner(deepParameters,
    sourceTemperatures.deepSubsurfaceFromSurfaceTemperatureC);
  const aquifer = aquiferOwner(aquiferParameters,
    sourceTemperatures.aquiferFromSeasonalTemperatureC);
  const vadoseParameters = vadoseMatrixThermalParameters(substrate);
  const adjacentMeanC = (deep.temperatureC + aquifer.temperatureC) / 2;
  const vadose = vadoseOwner(vadoseParameters, adjacentMeanC);
  return {
    deepSubsurface: {
      schema: LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA,
      parameterization: deepParameters,
      owner: deep
    },
    vadose: {
      schema: LAND_VADOSE_MATRIX_THERMAL_STATE_SCHEMA,
      parameterization: vadoseParameters,
      owner: vadose
    },
    aquifer: {
      schema: LAND_AQUIFER_MATRIX_THERMAL_STATE_SCHEMA,
      parameterization: aquiferParameters,
      owner: aquifer
    },
    adjacentMeanC
  };
}

function recordedState(state) {
  return {
    schema: state?.schema,
    parameterization: clone(state?.parameterization || null),
    owner: clone(state?.owner || null)
  };
}

export function landMatrixThermalInitialEndowmentReceiptValid(receipt) {
  if (!digestValid(receipt) ||
      receipt.boundary?.schema !==
        LAND_MATRIX_THERMAL_INITIAL_ENDOWMENT_BOUNDARY_SCHEMA ||
      receipt.boundary?.classification !==
        'configured-model-initial-condition-endowment' ||
      !finite(receipt.creationContext?.seed) ||
      !finite(receipt.creationContext?.initialDay) ||
      receipt.creationContext?.initialStepCount !== 0 ||
      typeof receipt.creationContext?.columnId !== 'string' ||
      !finite(receipt.sourceTemperatures
        ?.deepSubsurfaceFromSurfaceTemperatureC) ||
      !finite(receipt.sourceTemperatures
        ?.aquiferFromSeasonalTemperatureC)) return false;
  const expected = expectedInitialStates(receipt.substrate,
    receipt.sourceTemperatures);
  const expectedStates = {
    deepSubsurface: expected.deepSubsurface,
    vadose: expected.vadose,
    aquifer: expected.aquifer
  };
  const expectedTotal = Object.values(expectedStates).reduce((sum, state) =>
    sum + Number(state.owner.sensibleHeatJm2), 0);
  return exact(receipt.initialStates, expectedStates) &&
    receipt.sourceTemperatures.vadoseFromAdjacentArithmeticMeanC ===
      expected.adjacentMeanC &&
    receipt.thermalCoordinate?.reference ===
      'modeled-sensible-heat-relative-to-zero-celsius' &&
    receipt.thermalCoordinate?.unit === 'J m-2' &&
    receipt.thermalCoordinate?.totalInitialMatrixSensibleHeatJm2 ===
      expectedTotal &&
    receipt.boundary?.historicalPhysicalSourceOwner === null &&
    receipt.boundary?.historicalSourceOwnerDebitReceipt === null &&
    Array.isArray(receipt.boundary?.transferEntries) &&
    receipt.boundary.transferEntries.length === 0 &&
    receipt.truth?.configuredInitialConditionProvenanceBound === true &&
    receipt.truth?.threeInitialMatrixOwnersReplayable === true &&
    receipt.truth?.ownerMutationPerformed === false &&
    receipt.truth?.heatTransferPerformed === false &&
    receipt.truth?.historicalPhysicalSourceOwnerResolved === false &&
    receipt.truth?.historicalPhysicalSourceOwnerDebited === false &&
    receipt.truth?.historicalHeatReconstructed === false &&
    receipt.truth?.absoluteThermodynamicEnergyClaimed === false &&
    receipt.truth?.resolvedConductionClaimed === false &&
    receipt.truth?.geothermalForcingModeled === false &&
    receipt.truth?.scientificCalibrationClaimed === false &&
    receipt.truth?.globalUnloadedBoundaryClaimed === false;
}

export function createLandMatrixThermalInitialEndowmentReceipt(context,
  substrate, sourceTemperatures, matrixStates) {
  if (typeof context?.columnId !== 'string' || !context.columnId ||
      !finite(context?.seed) || !finite(context?.initialDay)) {
    throw new Error('Matrix initial endowment requires exact creation context');
  }
  if (!finite(sourceTemperatures?.deepSubsurfaceFromSurfaceTemperatureC) ||
      !finite(sourceTemperatures?.aquiferFromSeasonalTemperatureC)) {
    throw new Error('Matrix initial endowment requires exact source temperatures');
  }
  const expected = expectedInitialStates(substrate, sourceTemperatures);
  const expectedStates = {
    deepSubsurface: expected.deepSubsurface,
    vadose: expected.vadose,
    aquifer: expected.aquifer
  };
  const suppliedStates = {
    deepSubsurface: recordedState(matrixStates?.deepSubsurface),
    vadose: recordedState(matrixStates?.vadose),
    aquifer: recordedState(matrixStates?.aquifer)
  };
  if (!exact(suppliedStates, expectedStates)) {
    throw new Error('Matrix initial endowment states are detached from deterministic initialization');
  }
  const totalInitialMatrixSensibleHeatJm2 =
    Object.values(expectedStates).reduce((sum, state) =>
      sum + Number(state.owner.sensibleHeatJm2), 0);
  const receipt = {
    schema: LAND_MATRIX_THERMAL_INITIAL_ENDOWMENT_RECEIPT_SCHEMA,
    mode: 'configured-model-initial-condition-provenance',
    creationContext: {
      columnId: context.columnId,
      seed: Number(context.seed),
      initialDay: Number(context.initialDay),
      initialStepCount: 0,
      kind: 'land'
    },
    substrate: clone(substrate),
    sourceTemperatures: {
      deepSubsurfaceFromSurfaceTemperatureC: Number(
        sourceTemperatures.deepSubsurfaceFromSurfaceTemperatureC),
      aquiferFromSeasonalTemperatureC: Number(
        sourceTemperatures.aquiferFromSeasonalTemperatureC),
      vadoseFromAdjacentArithmeticMeanC: Number(expected.adjacentMeanC)
    },
    initialStates: expectedStates,
    thermalCoordinate: {
      reference: 'modeled-sensible-heat-relative-to-zero-celsius',
      unit: 'J m-2',
      totalInitialMatrixSensibleHeatJm2
    },
    boundary: {
      schema: LAND_MATRIX_THERMAL_INITIAL_ENDOWMENT_BOUNDARY_SCHEMA,
      classification: 'configured-model-initial-condition-endowment',
      historicalPhysicalSourceOwner: null,
      historicalSourceOwnerDebitReceipt: null,
      transferEntries: []
    },
    truth: {
      configuredInitialConditionProvenanceBound: true,
      threeInitialMatrixOwnersReplayable: true,
      ownerMutationPerformed: false,
      heatTransferPerformed: false,
      historicalPhysicalSourceOwnerResolved: false,
      historicalPhysicalSourceOwnerDebited: false,
      historicalHeatReconstructed: false,
      absoluteThermodynamicEnergyClaimed: false,
      resolvedConductionClaimed: false,
      geothermalForcingModeled: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalInitialEndowmentReceiptValid(receipt)) {
    throw new Error('Matrix initial endowment receipt failed self-validation');
  }
  return receipt;
}

export function matrixThermalInitialEndowmentDescription() {
  return {
    schema: LAND_MATRIX_THERMAL_INITIAL_ENDOWMENT_RECEIPT_SCHEMA,
    boundarySchema: LAND_MATRIX_THERMAL_INITIAL_ENDOWMENT_BOUNDARY_SCHEMA,
    mode: 'configured-model-initial-condition-provenance',
    proves: [
      'exact substrate and temperature inputs are digest-bound',
      'all three initial matrix owners replay deterministically',
      'modeled initial sensible-heat coordinate is explicit'
    ],
    historicalPhysicalSourceOwnerResolved: false,
    historicalPhysicalSourceOwnerDebited: false,
    absoluteThermodynamicEnergyClaimed: false,
    mutatesState: false
  };
}
