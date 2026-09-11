# Foundation Planet sampler package

This private-by-default npm package exposes one bounded part of the experimental
Foundation Planet: deterministic terrain, biome, ecology, and geology sampling
at explicit latitude/longitude coordinates. It does not package the browser,
host service, persistence layer, or 10.7 MB experimental Planet body.

Build the offline tarball from the repository root:

```bash
npm pack ./packages/foundation-planet-sampler --pack-destination ./dist
```

Install that tarball in a consumer, then use the ESM API:

```js
import { createSampleReceipt, verifySampleReceipt } from 'axm-foundation-planet-sampler';

const receipt = createSampleReceipt({
  schema: 'axm.foundation-planet.sample-request/v1',
  profile: 'temperate',
  coordinates: [{ id: 'origin', lat: 0, lon: 0 }],
});

console.log(verifySampleReceipt(receipt));
```

The installed CLI reads JSON from a file or standard input:

```bash
foundation-planet-sampler describe
foundation-planet-sampler sample request.json > receipt.json
foundation-planet-sampler verify receipt.json
foundation-planet-sampler verify-legacy legacy-receipt.json
foundation-planet-sampler describe-migration
foundation-planet-sampler migrate legacy-receipt.json > migration.json
foundation-planet-sampler verify-migration migration.json
foundation-planet-sampler review-migration migration.json > migration-review.html
```

CLI JSON input is capped at 1 MiB, must be valid UTF-8 without replacement
decoding, and rejects duplicate object member names at any nesting depth before
request or receipt admission, including names that are only duplicates after
JSON escape decoding. An intentionally encoded U+FFFD replacement character is
valid UTF-8 and remains ordinary input; malformed byte sequences that would only
become U+FFFD through decoder replacement are refused. The ESM API receives
already materialized JavaScript objects, so these raw-byte/text admission rules
are CLI-input guarantees rather than claims about object construction in callers.

`verify` checks the SHA-256 consistency seal and fully replays every sample. A
caller that changes a result and computes a new seal still fails replay. The
seal proves model-to-receipt byte agreement, not authorship, scientific
correctness, physical realism, runtime safety, or CANON status.

The package fixes the world identity and seed to Caelus. It accepts only the
five declared condition profiles and at most 256 coordinates per request. It
never writes Planet state, creates a hosted world, uses the network, or grants
authority. Registry publication remains blocked by `private: true`.

## Canonical coordinate identity

The sampler treats coordinates as spherical locations rather than raw pairs of
numbers. It normalizes the antimeridian to longitude `-180`, longitude at both
poles to `0`, and signed zero to positive zero before sampling, hashing, or
returning a receipt. Thus equivalent locations have one request identity and
one deterministic sample. The machine-readable capability descriptor exposes
the same rules under `model.coordinateIdentity`.

This normalization is capability version `1.1.0` / package version `0.2.0`.
Receipts still use the v1 request and receipt shapes, while the embedded
capability version makes the changed normalization semantics explicit. Older
`1.0.0` receipts are evidence from a different sampler behavior and are not
silently reinterpreted.

## Explicit legacy receipt migration

Package version `0.3.0` adds a separate, deterministic migration capability for
exact sampler `1.0.0` receipts. It first replays the source receipt under the
original raw-coordinate behavior, then creates a new `1.1.0` receipt from the
same request under canonical coordinate identity. Its migration capsule retains
both complete receipts, records only the coordinates whose identity changed,
and binds the lineage with SHA-256.

The source receipt remains historical evidence; the target is a new receipt,
not a reinterpretation of the old one. The migration capsule cannot apply world
state, replace source evidence, publish a package, or grant CANON authority. A
caller may retain the migration digest and pass it to
`verifySampleReceiptMigration(capsule, expectedDigest)` to reject substitution
by another internally valid capsule.

## Human-readable migration review

Package version `0.3.1` adds a presentation-only review realization over that
same migration capsule. `review-migration` first passes the supplied capsule
through the production deterministic migration verifier and only then emits one
self-contained HTML file. The page shows the retained source and derived target
identities, exact coordinate identity changes, exact source/target/migration
digests, expandable raw evidence, and the authority ceiling in human-readable
form.

The review file has no external runtime resources and needs no network, account,
cloud service, or model. It cannot migrate a receipt, replace source evidence,
apply Planet/game state, approve a release, merge work, or grant CANON. Its copy
controls hand out exact SHA-256 values only; callers that care about substitution
must still compare the migration digest with a separately retained expected
identity. The same renderer is available as the optional
`axm-foundation-planet-sampler/review` export.
