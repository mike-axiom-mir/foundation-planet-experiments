# Initial snapshot verification

Date: 2026-08-29  
Status: **EXPERIMENTAL**

## Source integrity

- Copied source/dependency files: 225
- Copied bytes: 10,767,467
- Source/destination mismatches: 0
- Deterministic source-tree SHA-256:
  `2002b4f454e3197c42b9af4a4d9e4b0952044232d0f37bfbdc2ad394a9526f50`
- Sensitive filename and credential-pattern scan: no findings in the included
  source paths

## Focused checks

- `node worlds/foundation-planet/browser-module-graph-selftest.mjs` — PASS,
  6 assertions, 163 modules, maximum browser path length 248
- `node --check` over every copied `.js` and `.mjs` file — PASS, 215 files
- `world.manifest.json` parse — PASS

The historically expensive full Planet selftest was not run for this snapshot;
the copy operation did not alter Planet source semantics.

## Live visual receipt

```text
claim: the standalone copy renders and its orbital/surface view switch works
surface / route: in-app browser / worlds/foundation-planet/index.html
visual backend: BROWSER_PRIMARY
viewport: default in-app browser viewport
baseline evidence: Caelus orbital planet, survey HUD, diagnostics, and controls visibly rendered
action: click Surface once
expected visible change: orbital globe is replaced by the surface expedition scene and Surface becomes active
observed sequence: orbital globe -> surface horizon and terrain -> stable surface expedition HUD
typed observation: Surface became active, scale changed from 2,000 km to 10 km, and the world continued stepping
verdict: PASS
named seam: browser persistence emitted QuotaExceededError and the HUD showed SAVE FAILED
temporary visual evidence: ephemeral frames only; no raw recording retained
cleanup complete: yes
next cheapest test: exercise save/restore in a fresh browser storage origin during a persistence-focused experiment
```

The view was returned to Orbital after the check. The visual result proves
rendering and the bounded view-mode interaction; it does not prove successful
browser persistence.

## Standalone launcher verification — 2026-08-30

- `npm start -- --port 41731` — PASS; no dependency installation required
- `/` — `302` to `/worlds/foundation-planet/index.html`
- Planet entry — `200 text/html`
- vendored Three.js — `200 text/javascript`
- missing path — `404`
- encoded Windows traversal attempt — `403`
- live root-route render — PASS; the redirect settled on the Planet entry and
  visibly rendered the Caelus orbital world, survey HUD, and controls
- bounded Surface interaction — UNKNOWN in this run; the browser controller
  exceeded its deadline while the Planet was rendering at roughly 1 FPS, and
  Windows fallback is prohibited for the Codex-hosted in-app browser
- known persistence seam remains: `SAVE FAILED` / browser storage quota

No Planet source file or vendored runtime file changed for this launcher rung.

## Persistence encoding repair — 2026-09-01

Smallest source change: retain the existing lossless LZW save data, envelope,
revision chain, journal, world identity, and checksum, but replace the outer
Base64 wrapper with 15-bit packing into single UTF-16 code units. The decoder
continues to accept the previous `lzw-uint16-base64` format.

Source basis for the conservative quota model: Chromium localStorage represents
strings with a format byte and either Latin-1 or UTF-16 payload bytes
(`components/services/storage/dom_storage/local_storage_impl.cc`,
`kLatin1Format`, `kUTF16Format`, and `MigrateString`). The browser also enforces
a per-storage-area quota in
`components/services/storage/dom_storage/dom_storage_constants.h`.

Focused evidence:

- `node --check worlds/foundation-planet/core/world-state.mjs` — PASS
- `node --check worlds/foundation-planet/world-state-storage-selftest.mjs` —
  PASS
- `node worlds/foundation-planet/world-state-storage-selftest.mjs` — PASS,
  11 assertions
- deterministic fixture footprint at the conservative encoded-storage
  boundary: compact `64,534` bytes; previous Base64 wrapper `80,348` bytes;
  compact representation `19.7%` smaller
- quota-bound write: uncompressed JSON rejected; previous Base64 size would
  exceed the same boundary; compact fallback wrote successfully
- restore: exact envelope, payload, revision, journal, and checksum preserved
- compatibility: a retained Base64-format fixture still decodes

Truth boundary:

- The source-level quota seam now has a deterministic, lossless boundary test.
- A fresh live-browser save/reload receipt has not yet been captured, so live
  browser persistence remains `UNKNOWN`, not visually accepted.
- The roughly 1 FPS rendered-performance seam is unchanged and remains open.
- No simulation, world-generation, stepping, or rendering behavior changed.
- The 2026-08-29 source snapshot receipt remains historical provenance for the
  original copy; this section records the later experimental source change.

## Portable browser-path gate — 2026-09-09

The browser-module graph gate previously measured absolute paths in the active
checkout. In this 61-character-deep checkout it rejected the unchanged graph at
266 characters, even though the same graph had passed at 248 characters in the
original snapshot environment. The gate now checks repository containment and
projects repository-relative module paths onto a configurable Windows install
root (`AXM_WINDOWS_INSTALL_ROOT`, default `C:\AXM_WORKSHOP`).

Focused evidence:

- `node worlds/foundation-planet/browser-module-graph-selftest.mjs` — PASS,
  8 assertions, 163 modules, maximum relative path 204, projected default
  Windows path 220, legacy install-root budget 54 characters
- the same command with an intentionally overlong `AXM_WINDOWS_INSTALL_ROOT` —
  expected rejection at a 294-character projected path; a relative configured
  root was also rejected before projection
- `npm test` — PASS: server 7 assertions; storage 11 assertions with the compact
  64,534-byte fixture 19.7% smaller than the 80,348-byte legacy wrapper; browser
  graph 8 assertions across 163 modules
- `git diff --check` — PASS

Live browser verdict:

- local route `http://127.0.0.1:4173/` — UNKNOWN; the required browser backend
  rejected loopback navigation before the Planet entry loaded
- public immutable build route for commit `0583784724e994244257789c23dc89fecb5b8ece`
  — UNKNOWN; the browser backend also rejected the CDN route before entry
- baseline frame, reversible action, and settled frame — not observed in this
  run because neither route crossed the browser transport boundary
- browser console and interaction result — UNKNOWN, not inferred from the
  passing source checks or the historical visual receipt above
- cleanup complete: yes; the local server and browser tab were closed
- next cheapest live check: open the standalone launcher from a browser that can
  reach its loopback origin, then record Orbital baseline -> Surface -> Orbital

This rung changes only the acceptance gate and its receipt. It does not change
Planet simulation, persistence, rendering, or runtime behavior. The roughly
1 FPS render seam and fresh-browser persistence receipt remain open.

## IndexedDB checkpoint transport — 2026-09-09

The first exact-head Chromium receipt measured a 91,571,254-character
canonical checkpoint and a `QuotaExceededError` from `localStorage`. The
world-state v2 envelope remains canonical and unchanged; only its browser
transport moves to a versioned, local IndexedDB adapter.

Focused evidence:

- `npm test` — PASS: standalone server 7 assertions; retained compact-storage
  checks; async browser-state contract 30 assertions; browser graph 8
  assertions across 164 modules
- async contract coverage — exact round trip, optimistic conflict rejection,
  failed-write rollback, exact v2 transport migration, v1 migration, tamper
  hold, write blocking while held, and backend-read failure classification
- live Chromium journey — PASS in 1m 53s: a 91.57-million-character checkpoint
  saved to `browser-indexeddb-v1`; baseline rendered; Life was disabled and
  re-enabled with durable saves; reload restored the same setting and location
  from a non-regressing revision with `restored-indexeddb-v1`
- browser evidence — four frames plus a JSON receipt; no page errors or failed
  document, script or stylesheet responses
- `git diff --check` — PASS

Live browser verdict:

- baseline -> reversible Life action -> settled frame -> browser restart:
  PASS
- persistence: PASS for the measured cumulative checkpoint in Chromium
- visible change: no intended rendering change; the HUD reports successful
  IndexedDB-backed revisions instead of `SAVE FAILED`
- cleanup complete: yes; the local server and Chromium process terminated
- next cheapest check: profile the 91.57-million-character snapshot and
  separate reconstructible receipt projections from restart-critical state

Known limits: IndexedDB remains device-local and browser-origin-scoped. The
adapter provides atomic single-record writes, not cross-device backup,
multi-writer consensus or author authentication. Snapshot construction remains
large and the measured roughly 1 FPS rendering seam is unchanged. Status stays
`EXPERIMENTAL`; Mike Tobi remains the merge, promotion and `CANON` gate.
The historical monolithic `selftest.js` is not runnable from this standalone
copy because its required sibling `worlds/world-registry.json` is absent; the
repository-supported `npm test` and live Chromium workflow are the executed
gates for this lane.
