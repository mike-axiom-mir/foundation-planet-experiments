import assert from 'node:assert/strict';
import { PLANET_DEFAULTS, sampleLatLon } from '../../core/planet-model.mjs';
import {
  createSurfaceFrame,
  greatCircleDistanceM,
  latLonToWorldPosition,
  localToLatLon,
  localToWorldPosition,
  normalizeLongitude,
  projectLatLonToLocal,
  rebaseLocalPoint
} from './spatial-frame.mjs';
import {
  addressLatLon,
  cellCenterLatLon,
  controlPercentForCellCount,
  createGlobalGrid,
  peakControlGoldMultiplier
} from './global-grid.mjs';
import {
  localGroundWorldPosition,
  sampleLocalBatch,
  sampleLocalSurface
} from './surface-sampler.mjs';

function approx(actual, expected, tolerance, label) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: expected ${expected}, got ${actual}`);
}

const frame = createSurfaceFrame({
  originLatDeg: 51.5606,
  originLonDeg: 5.0919,
  maxOperationalRadiusM: 250_000
});

assert.equal(frame.radiusM, PLANET_DEFAULTS.radiusM);
assert.equal(normalizeLongitude(181), -179);
assert.equal(normalizeLongitude(-181), 179);

const desiredLocal = { xM: 32_000, zM: 17_500 };
const coordinate = localToLatLon(frame, desiredLocal.xM, desiredLocal.zM, { enforceOperationalRadius: true });
const roundTrip = projectLatLonToLocal(frame, coordinate.lat, coordinate.lon, { enforceOperationalRadius: true });
approx(roundTrip.xM, desiredLocal.xM, 1e-5, 'east round-trip');
approx(roundTrip.zM, desiredLocal.zM, 1e-5, 'north round-trip');
approx(roundTrip.distanceM, Math.hypot(desiredLocal.xM, desiredLocal.zM), 1e-5, 'distance round-trip');

const originToPoint = greatCircleDistanceM(frame.originLatDeg, frame.originLonDeg, coordinate.lat, coordinate.lon);
approx(originToPoint, Math.hypot(desiredLocal.xM, desiredLocal.zM), 1e-5, 'great-circle distance');

const worldPosition = localToWorldPosition(frame, desiredLocal.xM, desiredLocal.zM, 37);
approx(Math.hypot(worldPosition.x, worldPosition.y, worldPosition.z), PLANET_DEFAULTS.radiusM + 37, 1e-6, 'local world radius');

const directWorldPosition = latLonToWorldPosition(coordinate.lat, coordinate.lon, 37);
approx(worldPosition.x, directWorldPosition.x, 1e-5, 'world x');
approx(worldPosition.y, directWorldPosition.y, 1e-5, 'world y');
approx(worldPosition.z, directWorldPosition.z, 1e-5, 'world z');

const nearbyFrame = createSurfaceFrame({ originLatDeg: coordinate.lat, originLonDeg: coordinate.lon });
const rebased = rebaseLocalPoint(frame, nearbyFrame, desiredLocal.xM, desiredLocal.zM);
approx(rebased.xM, 0, 0.01, 'rebase east');
approx(rebased.zM, 0, 0.01, 'rebase north');

assert.throws(
  () => projectLatLonToLocal(frame, frame.originLatDeg + 5, frame.originLonDeg, { enforceOperationalRadius: true }),
  /operational radius/
);

const directOriginSample = sampleLatLon(frame.originLatDeg, frame.originLonDeg);
const flatOriginSample = sampleLocalSurface(frame, 0, 0);
assert.equal(flatOriginSample.planet.biome, directOriginSample.biome);
approx(flatOriginSample.planet.elevationM, directOriginSample.elevationM, 1e-9, 'flat/origin elevation');

const sampledBatch = sampleLocalBatch(frame, [
  { xM: 0, zM: 0 },
  { xM: 1000, zM: 0 },
  { xM: 0, zM: 1000 }
]);
assert.equal(sampledBatch.length, 3);
assert.equal(sampledBatch[0].schema, 'axm.global-macro-rts.surface-sample/v0.1');

const ground = localGroundWorldPosition(frame, 0, 0, { heightOffsetM: 2 });
approx(
  Math.hypot(ground.worldPosition.x, ground.worldPosition.y, ground.worldPosition.z),
  PLANET_DEFAULTS.radiusM + directOriginSample.elevationM + 2,
  1e-6,
  'ground world radius'
);

const grid = createGlobalGrid();
assert.equal(grid.cellCount, 4096 * 2048);
assert.equal(grid.projection, 'equal-area-sin-latitude');

const addresses = [
  addressLatLon(grid, 0, 0),
  addressLatLon(grid, 51.5606, 5.0919),
  addressLatLon(grid, -43.2, 171.1),
  addressLatLon(grid, 89.999, -179.999)
];

for (const address of addresses) {
  const center = cellCenterLatLon(grid, address.column, address.row);
  const repeated = addressLatLon(grid, center.lat, center.lon);
  assert.deepEqual(repeated, address);
}

assert.deepEqual(addressLatLon(grid, 0, 180), addressLatLon(grid, 0, -180));
approx(controlPercentForCellCount(grid, grid.cellCount), 100, 1e-12, 'full globe control');
approx(peakControlGoldMultiplier(0), 1, 1e-12, 'zero control bonus');
approx(peakControlGoldMultiplier(1), 1.01, 1e-12, 'one-percent control bonus');
approx(peakControlGoldMultiplier(0.25), 1.0025, 1e-12, 'quarter-percent control bonus');

console.log('global-macro-rts surface selftest: PASS');
