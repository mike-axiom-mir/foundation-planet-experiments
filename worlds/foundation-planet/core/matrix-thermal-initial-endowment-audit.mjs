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
import {
  LAND_MATRIX_THERMAL_INITIAL_ENDOWMENT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_INITIAL_ENDOWMENT_BOUNDARY_SCHEMA
} from './matrix-thermal-initial-endowment.mjs?v=0.90.0-r90.1';

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
  if (!value || typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function owner(parameters, temperatureC, kind) {
  const ranges = {
    deepSubsurface: [LAND_DEEP_SUBSURFACE_MATRIX_MINIMUM_TEMPERATURE_C,
      LAND_DEEP_SUBSURFACE_MATRIX_MAXIMUM_TEMPERATURE_C],
    vadose: [LAND_VADOSE_MATRIX_MINIMUM_TEMPERATURE_C,
      LAND_VADOSE_MATRIX_MAXIMUM_TEMPERATURE_C],
    aquifer: [LAND_AQUIFER_MATRIX_MINIMUM_TEMPERATURE_C,
      LAND_AQUIFER_MATRIX_MAXIMUM_TEMPERATURE_C]
  };
  const temperature = clamp(temperatureC, ...ranges[kind]);
  if (kind === 'aquifer') return {
    materialClass: 'parameterized-aquifer-mineral-matrix',
    effectiveDepthM: Number(parameters.effectiveDepthM),
    solidFraction: Number(parameters.solidFraction),
    volumetricHeatCapacityJm3K:
      Number(parameters.volumetricHeatCapacityJm3K),
    heatCapacityJm2K: Number(parameters.heatCapacityJm2K),
    temperatureC: Number(temperature),
    sensibleHeatJm2: Number(parameters.heatCapacityJm2K * temperature)
  };
  const common = {
    materialClass: kind === 'deepSubsurface'
      ? 'parameterized-deep-subsurface-mineral-matrix'
      : 'parameterized-intervening-vadose-mineral-matrix',
    upperBoundaryDepthM: Number(parameters.upperBoundaryDepthM),
    lowerBoundaryDepthM: Number(parameters.lowerBoundaryDepthM),
    effectiveDepthM: Number(parameters.effectiveDepthM)
  };
  if (kind === 'deepSubsurface') {
    common.separationToAquiferMatrixM =
      Number(parameters.separationToAquiferMatrixM);
  } else {
    common.centerDepthM = Number(parameters.centerDepthM);
  }
  return {
    ...common,
    solidFraction: Number(parameters.solidFraction),
    volumetricHeatCapacityJm3K:
      Number(parameters.volumetricHeatCapacityJm3K),
    heatCapacityJm2K: Number(parameters.heatCapacityJm2K),
    temperatureC: Number(temperature),
    sensibleHeatJm2: Number(parameters.heatCapacityJm2K * temperature)
  };
}

function state(schema, parameterization, initialOwner) {
  return { schema, parameterization, owner: initialOwner };
}

function staticOwner(ownerValue) {
  const result = clone(ownerValue || {});
  delete result.temperatureC;
  delete result.sensibleHeatJm2;
  return result;
}

function result(status, detail) {
  return {
    id: 'land-matrix-thermal-initial-endowment-provenance',
    required: true,
    status,
    statement: 'The three initial matrix owners replay from a digest-bound configured model-initial-condition boundary without inventing a historical physical source owner or debit.',
    detail
  };
}

export function auditLandMatrixThermalInitialEndowment(column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land?.matrixThermalInitialEndowmentReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalInitialEndowmentMigrationCheckpoint === true;
    return result(checkpoint ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'v51-to-v52 migration preserves current owners without reconstructing their unobserved initialization inputs'
        : 'a native v52 land column is missing its initial-endowment provenance receipt'
    });
  }
  const source = receipt.sourceTemperatures || {};
  const deepParameters = deepSubsurfaceMatrixThermalParameters(
    receipt.substrate || {});
  const aquiferParameters = aquiferMatrixThermalParameters(
    receipt.substrate || {});
  const vadoseParameters = vadoseMatrixThermalParameters(
    receipt.substrate || {});
  const deep = owner(deepParameters,
    source.deepSubsurfaceFromSurfaceTemperatureC, 'deepSubsurface');
  const aquifer = owner(aquiferParameters,
    source.aquiferFromSeasonalTemperatureC, 'aquifer');
  const adjacentMeanC = (deep.temperatureC + aquifer.temperatureC) / 2;
  const vadose = owner(vadoseParameters, adjacentMeanC, 'vadose');
  const expectedStates = {
    deepSubsurface: state(LAND_DEEP_SUBSURFACE_MATRIX_THERMAL_STATE_SCHEMA,
      deepParameters, deep),
    vadose: state(LAND_VADOSE_MATRIX_THERMAL_STATE_SCHEMA,
      vadoseParameters, vadose),
    aquifer: state(LAND_AQUIFER_MATRIX_THERMAL_STATE_SCHEMA,
      aquiferParameters, aquifer)
  };
  const expectedTotal = Object.values(expectedStates).reduce((sum, entry) =>
    sum + Number(entry.owner.sensibleHeatJm2), 0);
  const receiptReplayExact =
    receipt.schema ===
      LAND_MATRIX_THERMAL_INITIAL_ENDOWMENT_RECEIPT_SCHEMA &&
    digestValid(receipt) && exact(receipt.initialStates, expectedStates) &&
    source.vadoseFromAdjacentArithmeticMeanC === adjacentMeanC &&
    receipt.thermalCoordinate?.reference ===
      'modeled-sensible-heat-relative-to-zero-celsius' &&
    receipt.thermalCoordinate?.unit === 'J m-2' &&
    receipt.thermalCoordinate?.totalInitialMatrixSensibleHeatJm2 ===
      expectedTotal;
  const contextAndSubstrateBound =
    receipt.creationContext?.columnId === column.id &&
    receipt.creationContext?.seed === column.seed &&
    receipt.creationContext?.initialStepCount === 0 &&
    receipt.creationContext?.kind === 'land' &&
    finite(receipt.creationContext?.initialDay) &&
    exact(receipt.substrate, column.substrate);
  const currentStaticParametersBound =
    exact(column.land?.deepSubsurfaceMatrixThermal?.parameterization,
      expectedStates.deepSubsurface.parameterization) &&
    exact(column.land?.vadoseMatrixThermal?.parameterization,
      expectedStates.vadose.parameterization) &&
    exact(column.land?.aquiferMatrixThermal?.parameterization,
      expectedStates.aquifer.parameterization) &&
    exact(staticOwner(column.land?.deepSubsurfaceMatrixThermal?.owner),
      staticOwner(expectedStates.deepSubsurface.owner)) &&
    exact(staticOwner(column.land?.vadoseMatrixThermal?.owner),
      staticOwner(expectedStates.vadose.owner)) &&
    exact(staticOwner(column.land?.aquiferMatrixThermal?.owner),
      staticOwner(expectedStates.aquifer.owner));
  const boundaryValid = receipt.boundary?.schema ===
      LAND_MATRIX_THERMAL_INITIAL_ENDOWMENT_BOUNDARY_SCHEMA &&
    receipt.boundary?.classification ===
      'configured-model-initial-condition-endowment' &&
    receipt.boundary?.historicalPhysicalSourceOwner === null &&
    receipt.boundary?.historicalSourceOwnerDebitReceipt === null &&
    Array.isArray(receipt.boundary?.transferEntries) &&
    receipt.boundary.transferEntries.length === 0;
  const truthValid =
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
    receipt.truth?.globalUnloadedBoundaryClaimed === false &&
    column.truth?.matrixThermalInitialEndowmentProvenanceBound === true &&
    column.truth?.matrixThermalHistoricalPhysicalSourceOwnerResolved ===
      false &&
    column.truth?.matrixThermalHistoricalPhysicalSourceOwnerDebited === false;
  const persistenceBound =
    column.land?.matrixThermalInitialEndowmentMigrationCheckpoint === false &&
    column.budget?.matrixThermalInitialEndowment?.digest === receipt.digest;
  const valid = receiptReplayExact && contextAndSubstrateBound &&
    currentStaticParametersBound && boundaryValid && truthValid &&
    persistenceBound;
  return result(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt.schema || null,
    digestValid: digestValid(receipt),
    receiptReplayExact,
    contextAndSubstrateBound,
    currentStaticParametersBound,
    boundaryValid,
    truthValid,
    persistenceBound,
    modeledInitialSensibleHeatJm2: expectedTotal,
    historicalPhysicalSourceOwnerResolved: false,
    historicalPhysicalSourceOwnerDebited: false
  });
}
