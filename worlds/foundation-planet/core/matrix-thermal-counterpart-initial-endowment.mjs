import {
  LAND_HYDROLOGY_THERMAL_STATE_SCHEMA,
  LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K
} from './land-hydrology-thermal.mjs?v=0.93.0-r93.1';

export const LAND_MATRIX_THERMAL_COUNTERPART_INITIAL_ENDOWMENT_RECEIPT_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-counterpart-initial-endowment-receipt/v1';
export const LAND_MATRIX_THERMAL_COUNTERPART_INITIAL_ENDOWMENT_BOUNDARY_SCHEMA =
  'axm.foundation-planet.land-matrix-thermal-counterpart-initial-endowment-boundary/v1';

const clone = value => JSON.parse(JSON.stringify(value));
const exact = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const finite = value => Number.isFinite(Number(value));
const clamp = (value, minimum = 0, maximum = 1) =>
  Math.max(minimum, Math.min(maximum, Number(value)));
const round = (value, digits = 6) =>
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

function digestValid(value) {
  if (value?.schema !==
      LAND_MATRIX_THERMAL_COUNTERPART_INITIAL_ENDOWMENT_RECEIPT_SCHEMA ||
      typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function liquidTemperature(value) {
  return clamp(value, -2, 45);
}

function waterOwner(waterMm, temperatureC) {
  const trackedWaterMm = Math.max(0, Number(waterMm));
  const waterTemperatureC = liquidTemperature(temperatureC);
  return {
    trackedWaterMm,
    sensibleHeatJm2: trackedWaterMm *
      LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K * waterTemperatureC,
    waterTemperatureC
  };
}

function surfaceOwner(substrate, temperatureC) {
  const heatCapacityJm2K = 2.35e6 +
    Number(substrate.soilDepthM) * 1.15e6;
  return {
    ownerKind: 'land-surface-sensible-heat-owner',
    heatCapacityJm2K,
    temperatureC: Number(temperatureC),
    sensibleHeatJm2: heatCapacityJm2K * Number(temperatureC)
  };
}

function expectedOwners(substrate, configuredSignals, sourceTemperatures) {
  const moisture = clamp(configuredSignals.moisture);
  const freshwaterPotential = clamp(
    configuredSignals.freshwaterPotential);
  const deepSoilWaterMm = round(clamp(
    Number(substrate.deepFieldCapacityMm) * (.45 + moisture * .7),
    0, Number(substrate.deepCapacityMm)));
  const groundwaterWaterMm = round(clamp(
    Number(substrate.aquiferCapacityMm) *
      (.08 + freshwaterPotential * .58),
    0, Number(substrate.aquiferCapacityMm)));
  return {
    counterpartSources: {
      groundwaterWater: waterOwner(groundwaterWaterMm,
        sourceTemperatures.groundwaterFromSeasonalTemperatureC),
      deepSoilWater: waterOwner(deepSoilWaterMm,
        sourceTemperatures.deepSoilFromSurfaceTemperatureC),
      surfaceSensibleHeat: surfaceOwner(substrate,
        sourceTemperatures.surfaceSensibleHeatFromSurfaceTemperatureC)
    },
    derivedWaterMm: {
      deepSoilWaterMm,
      groundwaterWaterMm
    }
  };
}

function ownerTotal(owners) {
  return Number(owners.counterpartSources.groundwaterWater.sensibleHeatJm2) +
    Number(owners.counterpartSources.deepSoilWater.sensibleHeatJm2) +
    Number(owners.counterpartSources.surfaceSensibleHeat.sensibleHeatJm2);
}

function suppliedOwners(hydrologyThermal, substrate, surfaceTemperatureC) {
  return {
    counterpartSources: {
      groundwaterWater: clone(
        hydrologyThermal?.reservoirs?.groundwater || null),
      deepSoilWater: clone(
        hydrologyThermal?.reservoirs?.deepSoil || null),
      surfaceSensibleHeat: surfaceOwner(substrate, surfaceTemperatureC)
    }
  };
}

export function landMatrixThermalCounterpartInitialEndowmentReceiptValid(
  receipt) {
  if (!digestValid(receipt) ||
      receipt.boundary?.schema !==
        LAND_MATRIX_THERMAL_COUNTERPART_INITIAL_ENDOWMENT_BOUNDARY_SCHEMA ||
      receipt.boundary?.classification !==
        'configured-model-counterpart-initial-condition-endowment' ||
      typeof receipt.creationContext?.columnId !== 'string' ||
      !finite(receipt.creationContext?.seed) ||
      !finite(receipt.creationContext?.initialDay) ||
      receipt.creationContext?.initialStepCount !== 0 ||
      !finite(receipt.configuredSignals?.moisture) ||
      !finite(receipt.configuredSignals?.freshwaterPotential) ||
      !finite(receipt.sourceTemperatures
        ?.groundwaterFromSeasonalTemperatureC) ||
      !finite(receipt.sourceTemperatures
        ?.deepSoilFromSurfaceTemperatureC) ||
      !finite(receipt.sourceTemperatures
        ?.surfaceSensibleHeatFromSurfaceTemperatureC)) return false;
  const expected = expectedOwners(receipt.substrate,
    receipt.configuredSignals, receipt.sourceTemperatures);
  const expectedTotal = ownerTotal(expected);
  return receipt.mode ===
      'configured-model-counterpart-initial-condition-provenance' &&
    exact(receipt.configuredOwners, {
      counterpartSources: expected.counterpartSources
    }) &&
    exact(receipt.derivedWaterMm, expected.derivedWaterMm) &&
    receipt.thermalCoordinate?.reference ===
      'modeled-sensible-heat-relative-to-zero-celsius' &&
    receipt.thermalCoordinate?.unit === 'J m-2' &&
    receipt.thermalCoordinate?.totalInitialCounterpartSensibleHeatJm2 ===
      expectedTotal &&
    receipt.boundary?.historicalPhysicalSourceOwners?.groundwaterWater ===
      null &&
    receipt.boundary?.historicalPhysicalSourceOwners?.deepSoilWater ===
      null &&
    receipt.boundary?.historicalPhysicalSourceOwners
      ?.surfaceSensibleHeat === null &&
    receipt.boundary?.historicalSourceOwnerDebitReceipts
      ?.groundwaterWater === null &&
    receipt.boundary?.historicalSourceOwnerDebitReceipts?.deepSoilWater ===
      null &&
    receipt.boundary?.historicalSourceOwnerDebitReceipts
      ?.surfaceSensibleHeat === null &&
    Array.isArray(receipt.boundary?.transferEntries) &&
    receipt.boundary.transferEntries.length === 0 &&
    receipt.truth?.configuredCounterpartInitialConditionProvenanceBound ===
      true &&
    receipt.truth?.threeInitialCounterpartOwnersReplayable === true &&
    receipt.truth?.firstRuntimeStepHandoffProved === false &&
    receipt.truth?.ownerMutationPerformed === false &&
    receipt.truth?.heatTransferPerformed === false &&
    receipt.truth?.historicalPhysicalSourceOwnersResolved === false &&
    receipt.truth?.historicalPhysicalSourceOwnersDebited === false &&
    receipt.truth?.historicalHeatReconstructed === false &&
    receipt.truth?.absoluteThermodynamicEnergyClaimed === false &&
    receipt.truth?.resolvedConductionClaimed === false &&
    receipt.truth?.geothermalForcingModeled === false &&
    receipt.truth?.scientificCalibrationClaimed === false &&
    receipt.truth?.globalUnloadedBoundaryClaimed === false;
}

export function createLandMatrixThermalCounterpartInitialEndowmentReceipt(
  context, substrate, configuredSignals, sourceTemperatures,
  initialHydrologyThermal, initialSurfaceTemperatureC) {
  if (typeof context?.columnId !== 'string' || !context.columnId ||
      !finite(context?.seed) || !finite(context?.initialDay)) {
    throw new Error('Matrix thermal counterpart initial endowment requires exact creation context');
  }
  if (initialHydrologyThermal?.schema !==
      LAND_HYDROLOGY_THERMAL_STATE_SCHEMA ||
      !finite(configuredSignals?.moisture) ||
      !finite(configuredSignals?.freshwaterPotential) ||
      !finite(sourceTemperatures?.groundwaterFromSeasonalTemperatureC) ||
      !finite(sourceTemperatures?.deepSoilFromSurfaceTemperatureC) ||
      !finite(sourceTemperatures
        ?.surfaceSensibleHeatFromSurfaceTemperatureC) ||
      !finite(initialSurfaceTemperatureC)) {
    throw new Error('Matrix thermal counterpart initial endowment requires exact configured inputs');
  }
  const expected = expectedOwners(substrate, configuredSignals,
    sourceTemperatures);
  const configuredOwners = {
    counterpartSources: expected.counterpartSources
  };
  const initializedOwners = suppliedOwners(initialHydrologyThermal,
    substrate, initialSurfaceTemperatureC);
  if (!exact(initializedOwners, configuredOwners)) {
    throw new Error('Matrix thermal counterpart initial owners are detached from deterministic initialization');
  }
  const receipt = {
    schema:
      LAND_MATRIX_THERMAL_COUNTERPART_INITIAL_ENDOWMENT_RECEIPT_SCHEMA,
    mode: 'configured-model-counterpart-initial-condition-provenance',
    creationContext: {
      columnId: context.columnId,
      seed: Number(context.seed),
      initialDay: Number(context.initialDay),
      initialStepCount: 0,
      kind: 'land'
    },
    substrate: clone(substrate),
    configuredSignals: {
      moisture: Number(configuredSignals.moisture),
      freshwaterPotential: Number(configuredSignals.freshwaterPotential)
    },
    sourceTemperatures: {
      groundwaterFromSeasonalTemperatureC: Number(
        sourceTemperatures.groundwaterFromSeasonalTemperatureC),
      deepSoilFromSurfaceTemperatureC: Number(
        sourceTemperatures.deepSoilFromSurfaceTemperatureC),
      surfaceSensibleHeatFromSurfaceTemperatureC: Number(
        sourceTemperatures.surfaceSensibleHeatFromSurfaceTemperatureC)
    },
    derivedWaterMm: expected.derivedWaterMm,
    configuredOwners,
    thermalCoordinate: {
      reference: 'modeled-sensible-heat-relative-to-zero-celsius',
      unit: 'J m-2',
      totalInitialCounterpartSensibleHeatJm2: ownerTotal(expected)
    },
    boundary: {
      schema:
        LAND_MATRIX_THERMAL_COUNTERPART_INITIAL_ENDOWMENT_BOUNDARY_SCHEMA,
      classification:
        'configured-model-counterpart-initial-condition-endowment',
      historicalPhysicalSourceOwners: {
        groundwaterWater: null,
        deepSoilWater: null,
        surfaceSensibleHeat: null
      },
      historicalSourceOwnerDebitReceipts: {
        groundwaterWater: null,
        deepSoilWater: null,
        surfaceSensibleHeat: null
      },
      transferEntries: []
    },
    truth: {
      configuredCounterpartInitialConditionProvenanceBound: true,
      threeInitialCounterpartOwnersReplayable: true,
      firstRuntimeStepHandoffProved: false,
      ownerMutationPerformed: false,
      heatTransferPerformed: false,
      historicalPhysicalSourceOwnersResolved: false,
      historicalPhysicalSourceOwnersDebited: false,
      historicalHeatReconstructed: false,
      absoluteThermodynamicEnergyClaimed: false,
      resolvedConductionClaimed: false,
      geothermalForcingModeled: false,
      scientificCalibrationClaimed: false,
      globalUnloadedBoundaryClaimed: false
    }
  };
  receipt.digest = stableDigest(receipt);
  if (!landMatrixThermalCounterpartInitialEndowmentReceiptValid(receipt)) {
    throw new Error('Matrix thermal counterpart initial endowment receipt failed self-validation');
  }
  return receipt;
}

export function matrixThermalCounterpartInitialEndowmentDescription() {
  return {
    schema:
      LAND_MATRIX_THERMAL_COUNTERPART_INITIAL_ENDOWMENT_RECEIPT_SCHEMA,
    boundarySchema:
      LAND_MATRIX_THERMAL_COUNTERPART_INITIAL_ENDOWMENT_BOUNDARY_SCHEMA,
    mode: 'configured-model-counterpart-initial-condition-provenance',
    proves: [
      'exact substrate, moisture, freshwater-potential, and temperature inputs are digest-bound',
      'initial groundwater-water, deep-soil-water, and surface sensible-heat owners replay deterministically',
      'modeled initial counterpart sensible-heat coordinate is explicit'
    ],
    firstRuntimeStepHandoffProved: false,
    historicalPhysicalSourceOwnersResolved: false,
    historicalPhysicalSourceOwnersDebited: false,
    absoluteThermodynamicEnergyClaimed: false,
    mutatesState: false
  };
}
