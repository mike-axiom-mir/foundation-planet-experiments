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
```

CLI JSON input is capped at 1 MiB and rejects duplicate object member names at
any nesting depth before request or receipt admission, including names that are
only duplicates after JSON escape decoding. The ESM API receives already
materialized JavaScript objects, so that byte-level duplicate-member rule is a
CLI-input guarantee rather than a claim about object construction in callers.

`verify` checks the SHA-256 consistency seal and fully replays every sample. A
caller that changes a result and computes a new seal still fails replay. The
seal proves model-to-receipt byte agreement, not authorship, scientific
correctness, physical realism, runtime safety, or CANON status.

The package fixes the world identity and seed to Caelus. It accepts only the
five declared condition profiles and at most 256 coordinates per request. It
never writes Planet state, creates a hosted world, uses the network, or grants
authority. Registry publication remains blocked by `private: true`.
