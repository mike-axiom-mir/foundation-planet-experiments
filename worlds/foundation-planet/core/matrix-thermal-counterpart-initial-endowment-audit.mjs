import {
  LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K,
  LAND_HYDROLOGY_GROUNDWATER_TRANSPORT_RECEIPT_SCHEMA
} from './land-hydrology-thermal.mjs?v=0.93.0-r93.1';
import {
  LAND_MATRIX_THERMAL_COUNTERPART_INITIAL_ENDOWMENT_RECEIPT_SCHEMA,
  LAND_MATRIX_THERMAL_COUNTERPART_INITIAL_ENDOWMENT_BOUNDARY_SCHEMA
} from './matrix-thermal-counterpart-initial-endowment.mjs?v=0.93.0-r93.1';

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
  if (!value || typeof value.digest !== 'string') return false;
  const unsigned = clone(value);
  delete unsigned.digest;
  return stableDigest(unsigned) === value.digest;
}

function waterOwner(waterMm, temperatureC) {
  const trackedWaterMm = Math.max(0, Number(waterMm));
  const waterTemperatureC = clamp(temperatureC, -2, 45);
  return {
    trackedWaterMm,
    sensibleHeatJm2: trackedWaterMm *
      LAND_HYDROLOGY_WATER_SPECIFIC_HEAT_J_KG_K * waterTemperatureC,
    waterTemperatureC
  };
}

function expectedOwners(receipt) {
  const substrate = receipt.substrate || {};
  const signals = receipt.configuredSignals || {};
  const temperatures = receipt.sourceTemperatures || {};
  const moisture = clamp(signals.moisture);
  const freshwaterPotential = clamp(signals.freshwaterPotential);
  const deepSoilWaterMm = round(clamp(
    Number(substrate.deepFieldCapacityMm) * (.45 + moisture * .7),
    0, Number(substrate.deepCapacityMm)));
  const groundwaterWaterMm = round(clamp(
    Number(substrate.aquiferCapacityMm) *
      (.08 + freshwaterPotential * .58),
    0, Number(substrate.aquiferCapacityMm)));
  const heatCapacityJm2K = 2.35e6 +
    Number(substrate.soilDepthM) * 1.15e6;
  const surfaceTemperatureC = Number(
    temperatures.surfaceSensibleHeatFromSurfaceTemperatureC);
  return {
    owners: {
      counterpartSources: {
        groundwaterWater: waterOwner(groundwaterWaterMm,
          temperatures.groundwaterFromSeasonalTemperatureC),
        deepSoilWater: waterOwner(deepSoilWaterMm,
          temperatures.deepSoilFromSurfaceTemperatureC),
        surfaceSensibleHeat: {
          ownerKind: 'land-surface-sensible-heat-owner',
          heatCapacityJm2K,
          temperatureC: surfaceTemperatureC,
          sensibleHeatJm2: heatCapacityJm2K * surfaceTemperatureC
        }
      }
    },
    derivedWaterMm: { deepSoilWaterMm, groundwaterWaterMm }
  };
}

function total(owners) {
  const sources = owners.counterpartSources;
  return Number(sources.groundwaterWater.sensibleHeatJm2) +
    Number(sources.deepSoilWater.sensibleHeatJm2) +
    Number(sources.surfaceSensibleHeat.sensibleHeatJm2);
}

function result(status, detail) {
  return {
    id: 'land-matrix-thermal-counterpart-initial-endowment-provenance',
    required: true,
    status,
    statement: 'The configured initial groundwater-water, deep-soil-water, and surface sensible-heat counterpart owners replay without inventing a physical source, debit, transfer, or first-step handoff.',
    detail
  };
}

export function auditLandMatrixThermalCounterpartInitialEndowment(column) {
  if (column?.kind !== 'land') {
    return result('NOT_APPLICABLE', {
      reason: 'selected Earth-system column is not land'
    });
  }
  const receipt = column.land
    ?.matrixThermalCounterpartInitialEndowmentReceipt;
  if (!receipt) {
    const checkpoint = column.land
      ?.matrixThermalCounterpartInitialEndowmentMigrationCheckpoint === true;
    return result(checkpoint ? 'NOT_APPLICABLE' : 'FAIL', {
      reason: checkpoint
        ? 'v54-to-v55 migration preserves current owners without reconstructing absent configured moisture and freshwater-potential inputs'
        : 'a native v55 land column is missing its counterpart initial-endowment provenance receipt'
    });
  }
  const expected = expectedOwners(receipt);
  const expectedTotal = total(expected.owners);
  const receiptReplayExact = receipt.schema ===
      LAND_MATRIX_THERMAL_COUNTERPART_INITIAL_ENDOWMENT_RECEIPT_SCHEMA &&
    digestValid(receipt) &&
    receipt.mode ===
      'configured-model-counterpart-initial-condition-provenance' &&
    exact(receipt.configuredOwners, expected.owners) &&
    exact(receipt.derivedWaterMm, expected.derivedWaterMm) &&
    receipt.thermalCoordinate?.reference ===
      'modeled-sensible-heat-relative-to-zero-celsius' &&
    receipt.thermalCoordinate?.unit === 'J m-2' &&
    receipt.thermalCoordinate?.totalInitialCounterpartSensibleHeatJm2 ===
      expectedTotal;
  const contextAndSubstrateBound =
    receipt.creationContext?.columnId === column.id &&
    receipt.creationContext?.seed === column.seed &&
    receipt.creationContext?.initialStepCount === 0 &&
    receipt.creationContext?.kind === 'land' &&
    finite(receipt.creationContext?.initialDay) &&
    exact(receipt.substrate, column.substrate);
  const groundwaterTransport = column.land?.hydrologyThermal
    ?.lastGroundwaterTransportReceipt;
  const transportedGroundwaterOwner = groundwaterTransport
    ?.finalOwners?.[column.id];
  const currentGroundwaterTransportBound = groundwaterTransport?.schema ===
      LAND_HYDROLOGY_GROUNDWATER_TRANSPORT_RECEIPT_SCHEMA &&
    digestValid(groundwaterTransport) &&
    exact({
      trackedWaterMm: transportedGroundwaterOwner?.trackedWaterMm,
      sensibleHeatJm2: transportedGroundwaterOwner?.sensibleHeatJm2,
      waterTemperatureC: transportedGroundwaterOwner?.waterTemperatureC
    }, column.land?.hydrologyThermal?.reservoirs?.groundwater);
  const pristineOwnersMustMatch = column.stepCount === 0 &&
    !currentGroundwaterTransportBound;
  const unsteppedOwnersBound = !pristineOwnersMustMatch ||
    (exact(column.land?.hydrologyThermal?.reservoirs?.groundwater,
      expected.owners.counterpartSources.groundwaterWater) &&
    exact(column.land?.hydrologyThermal?.reservoirs?.deepSoil,
      expected.owners.counterpartSources.deepSoilWater) &&
    column.surface?.temperatureC === expected.owners.counterpartSources
      .surfaceSensibleHeat.temperatureC);
  const boundaryValid = receipt.boundary?.schema ===
      LAND_MATRIX_THERMAL_COUNTERPART_INITIAL_ENDOWMENT_BOUNDARY_SCHEMA &&
    receipt.boundary?.classification ===
      'configured-model-counterpart-initial-condition-endowment' &&
    Object.values(receipt.boundary?.historicalPhysicalSourceOwners || {})
      .length === 3 &&
    Object.values(receipt.boundary.historicalPhysicalSourceOwners)
      .every(value => value === null) &&
    Object.values(receipt.boundary?.historicalSourceOwnerDebitReceipts || {})
      .length === 3 &&
    Object.values(receipt.boundary.historicalSourceOwnerDebitReceipts)
      .every(value => value === null) &&
    Array.isArray(receipt.boundary?.transferEntries) &&
    receipt.boundary.transferEntries.length === 0;
  const truthValid = receipt.truth
      ?.configuredCounterpartInitialConditionProvenanceBound === true &&
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
    receipt.truth?.globalUnloadedBoundaryClaimed === false &&
    column.truth
      ?.matrixThermalCounterpartInitialEndowmentProvenanceBound === true &&
    column.truth
      ?.matrixThermalCounterpartHistoricalPhysicalSourceOwnersResolved ===
        false &&
    column.truth
      ?.matrixThermalCounterpartHistoricalPhysicalSourceOwnersDebited ===
        false;
  const persistenceBound = column.land
      ?.matrixThermalCounterpartInitialEndowmentMigrationCheckpoint ===
        false &&
    column.budget?.matrixThermalCounterpartInitialEndowment?.digest ===
      receipt.digest;
  const valid = receiptReplayExact && contextAndSubstrateBound &&
    unsteppedOwnersBound && boundaryValid && truthValid && persistenceBound;
  return result(valid ? 'PASS' : 'FAIL', {
    actualReceiptSchema: receipt.schema || null,
    digestValid: digestValid(receipt),
    receiptReplayExact,
    contextAndSubstrateBound,
    unsteppedOwnersBound,
    currentGroundwaterTransportBound,
    boundaryValid,
    truthValid,
    persistenceBound,
    modeledInitialCounterpartSensibleHeatJm2: expectedTotal,
    firstRuntimeStepHandoffProved: false,
    historicalPhysicalSourceOwnersResolved: false,
    historicalPhysicalSourceOwnersDebited: false
  });
}
