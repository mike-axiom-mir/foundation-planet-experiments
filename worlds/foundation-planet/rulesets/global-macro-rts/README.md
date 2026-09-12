# Foundation Planet · Global Macro RTS seam

Status: **EXPERIMENTAL**

This directory is the first game-facing seam for the persistent global macro RTS. It deliberately reuses Foundation Planet instead of forking a second simplified globe.

## Key idea

The planet stays spherical globally. Units and buildings do not need to reason about spherical geometry every tick.

1. Pick a globe coordinate for an operational area.
2. Create a bounded local surface frame there.
3. Run ordinary RTS movement, formation, placement, collision, and building logic in local X/Z metres.
4. Convert local positions back to canonical globe coordinates/world vectors only when needed for persistence, rendering, inter-frame movement, or global accounting.
5. Rebase into a neighbouring flat frame when an entity travels far enough that local projection distortion should no longer be accepted.

```js
import { createSurfaceFrame, localToLatLon } from './spatial-frame.mjs';
import { sampleLocalSurface } from './surface-sampler.mjs';

const frame = createSurfaceFrame({
  originLatDeg: 51.56,
  originLonDeg: 5.09,
  maxOperationalRadiusM: 250_000
});

const unit = { xM: 1200, zM: -850 };
const globeCoordinate = localToLatLon(frame, unit.xM, unit.zM);
const ground = sampleLocalSurface(frame, unit.xM, unit.zM);
```

The local coordinates are gameplay convenience. `globeCoordinate` is the persistent world identity.

## Files

- `spatial-frame.mjs` — globe ↔ bounded flat X/Z conversions and rebasing.
- `surface-sampler.mjs` — asks the existing Foundation Planet model what terrain exists beneath a flat RTS coordinate.
- `global-grid.mjs` — deterministic equal-area global cells for cheap macro territory bookkeeping.
- `FOUNDATION.md` — active game-direction contract captured from design shaping.
- `selftest.mjs` — round-trip, rebase, terrain-sampling, world-position, global-grid, and peak-control multiplier checks.
- `ruleset.manifest.json` — explicit truth/status boundary.

## Important non-claims

This is not yet the multiplayer game. It does not yet implement armies, Crew, parties, fog, food, city AI, offline Guardian behavior, asteroid drops, blueprints, mercenaries, or the final browser RTS renderer.

It makes the first architectural decision real: **one big spherical Foundation Planet underneath; cheap flat RTS space where units and buildings actually operate.**
