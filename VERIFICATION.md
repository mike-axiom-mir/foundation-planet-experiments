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
