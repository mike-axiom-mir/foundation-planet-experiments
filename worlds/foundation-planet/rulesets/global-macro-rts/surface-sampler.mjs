import { sampleLatLon } from '../../core/planet-model.mjs';
import { localToLatLon, localToWorldPosition, SURFACE_FRAME_SCHEMA } from './spatial-frame.mjs';

export const RTS_SURFACE_SAMPLE_SCHEMA = 'axm.global-macro-rts.surface-sample/v0.1';
export const DEFAULT_BATCH_LIMIT = 4096;

function validateFrame(frame) {
  if (!frame || frame.schema !== SURFACE_FRAME_SCHEMA) throw new TypeError('A valid RTS surface frame is required');
}

function finiteNumber(value, label) {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be finite`);
}

export function sampleLocalSurface(frame, xM, zM, {
  planetOptions = {},
  enforceOperationalRadius = true
} = {}) {
  validateFrame(frame);
  finiteNumber(xM, 'xM');
  finiteNumber(zM, 'zM');

  const coordinate = localToLatLon(frame, xM, zM, { enforceOperationalRadius });
  const planet = sampleLatLon(coordinate.lat, coordinate.lon, planetOptions);

  return Object.freeze({
    schema: RTS_SURFACE_SAMPLE_SCHEMA,
    local: Object.freeze({ xM, zM }),
    coordinate: Object.freeze({ lat: coordinate.lat, lon: coordinate.lon }),
    planet
  });
}

export function sampleLocalBatch(frame, points, {
  planetOptions = {},
  enforceOperationalRadius = true,
  batchLimit = DEFAULT_BATCH_LIMIT
} = {}) {
  validateFrame(frame);
  if (!Array.isArray(points)) throw new TypeError('points must be an array');
  if (!Number.isInteger(batchLimit) || batchLimit <= 0) throw new RangeError('batchLimit must be a positive integer');
  if (points.length > batchLimit) throw new RangeError(`points exceeds batchLimit (${batchLimit})`);

  return points.map((point, index) => {
    if (!point || typeof point !== 'object') throw new TypeError(`points[${index}] must be an object`);
    return sampleLocalSurface(frame, point.xM, point.zM, { planetOptions, enforceOperationalRadius });
  });
}

export function localGroundWorldPosition(frame, xM, zM, {
  planetOptions = {},
  heightOffsetM = 0,
  enforceOperationalRadius = true
} = {}) {
  finiteNumber(heightOffsetM, 'heightOffsetM');
  const sample = sampleLocalSurface(frame, xM, zM, { planetOptions, enforceOperationalRadius });
  const altitudeM = sample.planet.elevationM + heightOffsetM;
  return Object.freeze({
    sample,
    worldPosition: Object.freeze(localToWorldPosition(frame, xM, zM, altitudeM, { enforceOperationalRadius }))
  });
}
