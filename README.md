# Foundation Planet Experiments

[![Apache License 2.0](https://img.shields.io/badge/license-Apache--2.0-3b82f6)](LICENSE) ![Local first](https://img.shields.io/badge/local--first-yes-16a085) ![Status experimental](https://img.shields.io/badge/status-experimental-f59e0b)

Public experimental snapshot of the current working Foundation Planet. This
repository isolates high-risk exploration from the cumulative Workshop WIP;
public visibility does not make the experiment CANON or production-ready.

Status: **EXPERIMENTAL**

## Run locally

Requirements: Node.js 18 or newer. No packages need to be installed.

From a fresh clone:

```bash
npm start
```

Then open:

```text
http://127.0.0.1:4173/
```

The root URL redirects directly into the Planet. Windows users can instead
double-click `start-planet.cmd`; macOS and Linux users can run
`./start-planet.sh`.

Use a different port when needed:

```bash
npm start -- --port 8080
```

The built-in server intentionally serves only files inside this repository and
includes the vendored Three.js module expected by the Planet. It has no npm
dependencies and is intended for local experiments, not public hosting.

## Verify the runnable entry seam

```bash
npm test
```

This starts the server on an ephemeral port, checks its root redirect, Planet
entry, vendored runtime and missing-path behavior, then checks the complete
browser module graph.

## Reuse the deterministic coordinate sampler

Consumers that need terrain, biome, ecology, and geology samples do not need to
copy or launch the complete Planet. Build the bounded private-by-default package:

```powershell
npm pack ./packages/foundation-planet-sampler --pack-destination ./dist
```

The resulting offline tarball exposes an ESM API and the
`foundation-planet-sampler describe|sample|verify` command. Packaging verifies
the exact source digests before vendoring only `planet-model.mjs` and its
`geophysics.mjs` dependency. Sample receipts are SHA-256 sealed and fully
replayed during verification. See
[`packages/foundation-planet-sampler/README.md`](packages/foundation-planet-sampler/README.md).

This is a read-only experimental sampling seam. It creates no hosted world,
writes no Planet state, uses no network, and provides no scientific, merge, or
CANON authority.

## Snapshot boundary

- `worlds/foundation-planet/` — complete current Planet source, contracts,
  tests, and local steward instructions
- `shared/vendor/three-r160/` — the exact browser runtime dependency used by
  the Planet
- `AGENTS.md` — inherited Workshop contribution and safety rules
- `SOURCE_SNAPSHOT.json` — provenance and byte-integrity receipt for the copy
- `scripts/serve.mjs` — zero-dependency standalone local server

This is a source snapshot of an uncommitted cumulative WIP state, not a claim
that the recorded source commit contains every copied file. Nothing here becomes
CANON merely because it exists, runs, or passes tests. AXM internal integration
is evaluated through Truth, Agency / non-domination, Continuity, and Wisdom
before speed; see `AGENTS.md`.


## Wider AXM map

Explore related games, worlds, and deterministic research in the [AXM Public Project Map](https://github.com/mike-axiom-mir/axm-collaboration-platform/blob/main/docs/PUBLIC_PROJECTS.md).
