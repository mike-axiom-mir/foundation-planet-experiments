# Foundation Planet Experiments

Private experimental copy of the current working Foundation Planet. This
repository exists for high-risk exploration without disturbing the cumulative
Workshop WIP.

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
