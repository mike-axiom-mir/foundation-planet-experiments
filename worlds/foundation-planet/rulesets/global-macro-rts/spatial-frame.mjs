import {
  PLANET_DEFAULTS,
  latLonToVector,
  vectorToLatLon
} from '../../core/planet-model.mjs';

export const SURFACE_FRAME_SCHEMA = 'axm.global-macro-rts.surface-frame/v0.1';
export const DEFAULT_OPERATION_RADIUS_M = 250_000;

const EPSILON = 1e-12;
const DEG_TO_RAD = Math.PI / 180;

function finiteNumber(value, label) {
  if (!Number.isFinite(value)) throw new TypeError(`${label} must be finite`);
  return value;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function dot(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

function scale(vector, factor) {
  return { x: vector.x * factor, y: vector.y * factor, z: vector.z * factor };
}

function add(a, b) {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

function normalize(vector) {
  const length = Math.hypot(vector.x, vector.y, vector.z);
  if (length <= EPSILON) throw new RangeError('Cannot normalize a zero-length vector');
  return scale(vector, 1 / length);
}

export function normalizeLongitude(lonDeg) {
  finiteNumber(lonDeg, 'lonDeg');
  return ((lonDeg + 540) % 360) - 180;
}

export function createSurfaceFrame({
  originLatDeg = 0,
  originLonDeg = 0,
  radiusM = PLANET_DEFAULTS.radiusM,
  maxOperationalRadiusM = DEFAULT_OPERATION_RADIUS_M
} = {}) {
  finiteNumber(originLatDeg, 'originLatDeg');
  finiteNumber(originLonDeg, 'originLonDeg');
  finiteNumber(radiusM, 'radiusM');
  finiteNumber(maxOperationalRadiusM, 'maxOperationalRadiusM');
  if (originLatDeg < -90 || originLatDeg > 90) throw new RangeError('originLatDeg must be between -90 and 90');
  if (radiusM <= 0) throw new RangeError('radiusM must be greater than zero');
  if (maxOperationalRadiusM <= 0 || maxOperationalRadiusM >= Math.PI * radiusM) {
    throw new RangeError('maxOperationalRadiusM must be greater than zero and smaller than half the circumference');
  }

  const lon = normalizeLongitude(originLonDeg);
  const latRad = originLatDeg * DEG_TO_RAD;
  const lonRad = lon * DEG_TO_RAD;
  const up = normalize(latLonToVector(originLatDeg, lon));
  const east = normalize({ x: -Math.sin(lonRad), y: 0, z: Math.cos(lonRad) });
  const north = normalize({
    x: -Math.sin(latRad) * Math.cos(lonRad),
    y: Math.cos(latRad),
    z: -Math.sin(latRad) * Math.sin(lonRad)
  });

  return Object.freeze({
    schema: SURFACE_FRAME_SCHEMA,
    originLatDeg,
    originLonDeg: lon,
    radiusM,
    maxOperationalRadiusM,
    up: Object.freeze(up),
    east: Object.freeze(east),
    north: Object.freeze(north)
  });
}

export function greatCircleDistanceM(aLatDeg, aLonDeg, bLatDeg, bLonDeg, radiusM = PLANET_DEFAULTS.radiusM) {
  finiteNumber(radiusM, 'radiusM');
  if (radiusM <= 0) throw new RangeError('radiusM must be greater than zero');
  const a = normalize(latLonToVector(aLatDeg, normalizeLongitude(aLonDeg)));
  const b = normalize(latLonToVector(bLatDeg, normalizeLongitude(bLonDeg)));
  return Math.acos(clamp(dot(a, b), -1, 1)) * radiusM;
}

export function projectLatLonToLocal(frame, latDeg, lonDeg, { enforceOperationalRadius = false } = {}) {
  if (!frame || frame.schema !== SURFACE_FRAME_SCHEMA) throw new TypeError('A valid surface frame is required');
  finiteNumber(latDeg, 'latDeg');
  finiteNumber(lonDeg, 'lonDeg');
  if (latDeg < -90 || latDeg > 90) throw new RangeError('latDeg must be between -90 and 90');

  const target = normalize(latLonToVector(latDeg, normalizeLongitude(lonDeg)));
  const cosine = clamp(dot(frame.up, target), -1, 1);
  const angle = Math.acos(cosine);
  const distanceM = angle * frame.radiusM;

  if (enforceOperationalRadius && distanceM > frame.maxOperationalRadiusM) {
    throw new RangeError(`Point is ${Math.round(distanceM)}m from frame origin; operational radius is ${Math.round(frame.maxOperationalRadiusM)}m`);
  }

  if (angle <= EPSILON) {
    return Object.freeze({ xM: 0, zM: 0, distanceM: 0, latDeg, lonDeg: normalizeLongitude(lonDeg) });
  }

  const sinAngle = Math.sin(angle);
  if (Math.abs(sinAngle) <= EPSILON) {
    throw new RangeError('Antipodal points do not have a unique local flat direction');
  }

  const tangent = normalize({
    x: (target.x - cosine * frame.up.x) / sinAngle,
    y: (target.y - cosine * frame.up.y) / sinAngle,
    z: (target.z - cosine * frame.up.z) / sinAngle
  });

  return Object.freeze({
    xM: distanceM * dot(tangent, frame.east),
    zM: distanceM * dot(tangent, frame.north),
    distanceM,
    latDeg,
    lonDeg: normalizeLongitude(lonDeg)
  });
}

export function localToUnitVector(frame, xM, zM, { enforceOperationalRadius = false } = {}) {
  if (!frame || frame.schema !== SURFACE_FRAME_SCHEMA) throw new TypeError('A valid surface frame is required');
  finiteNumber(xM, 'xM');
  finiteNumber(zM, 'zM');

  const distanceM = Math.hypot(xM, zM);
  if (enforceOperationalRadius && distanceM > frame.maxOperationalRadiusM) {
    throw new RangeError(`Local point is ${Math.round(distanceM)}m from frame origin; operational radius is ${Math.round(frame.maxOperationalRadiusM)}m`);
  }
  if (distanceM <= EPSILON) return { ...frame.up };

  const angle = distanceM / frame.radiusM;
  if (angle >= Math.PI - EPSILON) throw new RangeError('A local frame cannot uniquely represent its antipode');

  const direction = normalize(add(scale(frame.east, xM), scale(frame.north, zM)));
  return normalize(add(scale(frame.up, Math.cos(angle)), scale(direction, Math.sin(angle))));
}

export function localToLatLon(frame, xM, zM, options = {}) {
  return vectorToLatLon(localToUnitVector(frame, xM, zM, options));
}

export function latLonToWorldPosition(latDeg, lonDeg, altitudeM = 0, radiusM = PLANET_DEFAULTS.radiusM) {
  finiteNumber(altitudeM, 'altitudeM');
  finiteNumber(radiusM, 'radiusM');
  if (radiusM + altitudeM <= 0) throw new RangeError('World position radius must be greater than zero');
  return scale(normalize(latLonToVector(latDeg, normalizeLongitude(lonDeg))), radiusM + altitudeM);
}

export function localToWorldPosition(frame, xM, zM, altitudeM = 0, options = {}) {
  finiteNumber(altitudeM, 'altitudeM');
  const unit = localToUnitVector(frame, xM, zM, options);
  return scale(unit, frame.radiusM + altitudeM);
}

export function rebaseLocalPoint(sourceFrame, targetFrame, xM, zM, options = {}) {
  const coordinate = localToLatLon(sourceFrame, xM, zM, options);
  return projectLatLonToLocal(targetFrame, coordinate.lat, coordinate.lon, options);
}
