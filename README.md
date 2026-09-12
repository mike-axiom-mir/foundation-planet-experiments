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

## Snapshot boundary

- `worlds/foundation-planet/` — complete current Planet source, contracts,
  tests, and local steward instructions
- `shared/vendor/three-r160/` — the exact browser runtime dependency used by
  the Planet
- `AGENTS.md` — inherited Workshop contribution and safety rules
- `SOURCE_SNAPSHOT.json` — provenance and byte-integrity receipt for the copy
- `scripts/serve.mjs` — zero-dependency standalone local server

This is a source snapshot of an uncommitted cumulative WIP state, not a claim
that the recorded source commit contains every copied file. Nothing here is
CANON unless Mike Tobi explicitly decides otherwise.


## Wider AXM map

Explore related games, worlds, and deterministic research in the [AXM Public Project Map](https://github.com/mike-axiom-mir/axm-collaboration-platform/blob/main/docs/PUBLIC_PROJECTS.md).
