# Foundation Planet steward boundary

These rules supplement the Workshop root `AGENTS.md` for work inside this
world. They exist because source-only stewardship can leave the actual Planet
unseen or unusable.

## Browser-first acceptance

1. Start every ordinary steward run by loading the cumulative WIP Planet in the
   approved live browser. Reach an interactive world or record the exact visual
   seam before selecting an implementation rung.
2. Use `node browser-module-graph-selftest.mjs` before the live check. A missing
   or overlong browser-reachable module path is a failed entry seam, even when
   Node imports or source validators pass.
3. A script result cannot substitute for rendered and interaction evidence.
   Record a baseline frame, one bounded reversible action, and the settled
   frame. If interaction cannot be observed, mark it `UNKNOWN`.
4. If the Planet cannot reach its interactive state within 90 seconds, stop the
   visual loop and steward that startup seam. Do not add another nonvisual
   contract rung first.

## Runtime and stopping budget

- No focused child test may receive more than five minutes without an explicit
  Mike Tobi decision backed by a measured performance profile.
- Treat a timeout or controller stall as counterevidence. Do not increase the
  timeout to manufacture completion.
- Run the broad Workshop gates only after the focused Planet check and live
  browser journey terminate inside their declared budgets.

## Handoff

Every steward run ends with a compact append-only handoff that states what
visibly changed, the exact tests and timings, the live browser verdict, failures
and `UNKNOWN` seams, and the next cheapest check. Status commentary alone is not
a steward-run product.

All work remains `EXPERIMENTAL` until Mike reviews it. These rules grant no
commit, merge, provider-selection, installation, execution, promotion, or
CANON authority.
