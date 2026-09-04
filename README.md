# Foundation Planet Experiments

[![Apache License 2.0](https://img.shields.io/badge/license-Apache--2.0-3b82f6)](LICENSE) ![Local first](https://img.shields.io/badge/local--first-yes-16a085) ![Status experimental](https://img.shields.io/badge/status-experimental-f59e0b)

Public experimental snapshot of the current working Foundation Planet. This
repository isolates high-risk exploration from the cumulative Workshop WIP;
public visibility does not make the experiment CANON or production-ready.

Status: **EXPERIMENTAL**

## Run locally

Serve the repository root over HTTP, then open
`/worlds/foundation-planet/index.html`.

For example:

```powershell
python -m http.server 4173
```

Then visit:

```text
http://127.0.0.1:4173/worlds/foundation-planet/index.html
```

The Planet intentionally imports the vendored Three.js module from
`/shared/vendor/three-r160/three.module.js`, so the HTTP server must use this
repository root rather than the Planet subdirectory.

## Snapshot boundary

- `worlds/foundation-planet/` — complete current Planet source, contracts,
  tests, and local steward instructions
- `shared/vendor/three-r160/` — the exact browser runtime dependency used by
  the Planet
- `AGENTS.md` — inherited Workshop contribution and safety rules
- `SOURCE_SNAPSHOT.json` — provenance and byte-integrity receipt for the copy

This is a source snapshot of an uncommitted cumulative WIP state, not a claim
that the recorded source commit contains every copied file. Nothing here is
CANON unless Mike Tobi explicitly decides otherwise.


## Wider AXM map

Explore related games, worlds, and deterministic research in the [AXM Public Project Map](https://github.com/mike-axiom-mir/axm-collaboration-platform/blob/main/docs/PUBLIC_PROJECTS.md).
