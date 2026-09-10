import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageRoot = path.join(repositoryRoot, 'packages', 'foundation-planet-sampler');

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || repositoryRoot,
    encoding: 'utf8',
    input: options.input,
    env: { ...process.env, npm_config_audit: 'false', npm_config_fund: 'false' },
  });
  if (options.expectFailure) {
    assert.notEqual(result.status, 0, `${command} unexpectedly succeeded`);
  } else {
    assert.equal(result.status, 0, `${command} failed\nstdout: ${result.stdout}\nstderr: ${result.stderr}`);
  }
  return result;
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.keys(value).sort().reduce((out, key) => {
    out[key] = stable(value[key]);
    return out;
  }, {});
  return value;
}

const canonical = value => JSON.stringify(stable(value));

test('clean offline consumer can sample and fully replay receipts', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'foundation-planet-sampler-'));
  const artifacts = path.join(root, 'artifacts');
  const consumer = path.join(root, 'consumer');
  await import('node:fs/promises').then(({ mkdir }) => Promise.all([
    mkdir(artifacts, { recursive: true }),
    mkdir(consumer, { recursive: true }),
  ]));

  const packed = run('npm', ['pack', packageRoot, '--silent', '--json', '--pack-destination', artifacts]);
  const packResult = JSON.parse(packed.stdout.trim());
  assert.equal(packResult.length, 1);
  const tarball = path.join(artifacts, packResult[0].filename);
  assert.ok(packResult[0].size < 80_000, `package is unexpectedly large: ${packResult[0].size}`);
  assert.deepEqual(
    packResult[0].files.map(file => file.path).sort(),
    [
      'LICENSE', 'PROVENANCE.json', 'README.md', 'THIRD_PARTY.json', 'capability.json',
      'cli.mjs', 'index.mjs', 'migration-capability.json', 'migration.mjs', 'package.json',
      'vendor/geophysics.mjs', 'vendor/planet-model.mjs',
    ],
  );

  await writeFile(path.join(consumer, 'package.json'), '{"type":"module","private":true}\n');
  run('npm', ['install', '--offline', '--ignore-scripts', tarball], { cwd: consumer });

  const probe = `
    import assert from 'node:assert/strict';
    import { createHash } from 'node:crypto';
    import { createSampleReceipt, describeCapability, verifySampleReceipt } from 'axm-foundation-planet-sampler';
    import { describeMigrationCapability } from 'axm-foundation-planet-sampler/migration';
    const request = {
      schema: 'axm.foundation-planet.sample-request/v1',
      profile: 'temperate',
      coordinates: [
        { id: 'origin', lat: 0, lon: 0 },
        { id: 'north', lat: 51.5074, lon: -0.1278 },
      ],
    };
    const first = createSampleReceipt(request);
    const second = createSampleReceipt(request);
    assert.deepEqual(first, second);
    assert.equal(first.samples.length, 2);
    assert.equal(verifySampleReceipt(first).valid, true);
    assert.equal(describeCapability().authority.canonical, false);
    assert.equal(describeCapability().version, '1.1.0');
    assert.deepEqual(describeMigrationCapability().versions, { source: '1.0.0', target: '1.1.0' });
    assert.deepEqual(describeCapability().model.coordinateIdentity, {
      angularUnit: 'decimal-degrees',
      latitudeRange: '[-90, 90]',
      longitudeRange: '[-180, 180)',
      antimeridianLongitude: -180,
      poleLongitude: 0,
      signedZero: 'positive',
    });

    const at = (lat, lon) => createSampleReceipt({
      schema: 'axm.foundation-planet.sample-request/v1',
      profile: 'temperate',
      coordinates: [{ id: 'same-place', lat, lon }],
    });
    const westAntimeridian = at(0, -180);
    const eastAntimeridian = at(0, 180);
    assert.equal(eastAntimeridian.request.coordinates[0].lon, -180);
    assert.deepEqual(eastAntimeridian, westAntimeridian);

    const northPoleWest = at(90, -120);
    const northPoleEast = at(90, 75);
    assert.equal(northPoleWest.request.coordinates[0].lon, 0);
    assert.deepEqual(northPoleWest, northPoleEast);

    const signedZero = at(-0, -0);
    assert.equal(Object.is(signedZero.request.coordinates[0].lat, -0), false);
    assert.equal(Object.is(signedZero.request.coordinates[0].lon, -0), false);

    const tampered = structuredClone(first);
    tampered.samples[0].sample.elevationM += 1;
    const { integrity, ...body } = tampered;
    const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object'
      ? Object.keys(value).sort().reduce((out, key) => (out[key] = stable(value[key]), out), {}) : value;
    tampered.integrity.digest = createHash('sha256').update(JSON.stringify(stable(body))).digest('hex');
    assert.throws(() => verifySampleReceipt(tampered), /deterministic replay/);
    assert.throws(() => createSampleReceipt({ ...request, hidden: true }), /unsupported fields/);
    assert.throws(() => createSampleReceipt({ ...request, coordinates: [{ lat: 91, lon: 0 }] }), /between -90 and 90/);
    console.log(JSON.stringify({ digest: first.integrity.digest, samples: first.samples.length }));
  `;
  const consumerProbe = run(process.execPath, ['--input-type=module', '--eval', probe], { cwd: consumer });
  const probeResult = JSON.parse(consumerProbe.stdout.trim());
  assert.equal(probeResult.samples, 2);
  assert.match(probeResult.digest, /^[a-f0-9]{64}$/);

  const bin = path.join(consumer, 'node_modules', '.bin', process.platform === 'win32'
    ? 'foundation-planet-sampler.cmd' : 'foundation-planet-sampler');
  const described = JSON.parse(run(bin, ['describe'], { cwd: consumer }).stdout);
  assert.equal(described.id, 'axm.foundation-planet.coordinate-sampler');
  assert.equal(described.authority.createsHostedWorld, false);

  const request = JSON.stringify({
    schema: 'axm.foundation-planet.sample-request/v1',
    profile: 'barren',
    coordinates: [{ lat: -33.8688, lon: 151.2093 }],
  });
  const receipt = JSON.parse(run(bin, ['sample', '-'], { cwd: consumer, input: request }).stdout);
  const verification = JSON.parse(run(bin, ['verify', '-'], { cwd: consumer, input: JSON.stringify(receipt) }).stdout);
  assert.equal(verification.valid, true);
  assert.equal(verification.sampleCount, 1);

  receipt.samples[0].sample.biome = 'invented';
  const { integrity, ...body } = receipt;
  receipt.integrity.digest = createHash('sha256').update(canonical(body)).digest('hex');
  const rejected = run(bin, ['verify', '-'], {
    cwd: consumer,
    input: JSON.stringify(receipt),
    expectFailure: true,
  });
  assert.match(rejected.stderr, /deterministic replay/);

  const oversized = path.join(consumer, 'oversized.json');
  await writeFile(oversized, 'x'.repeat(1_048_577));
  const oversizedResult = run(bin, ['sample', oversized], { cwd: consumer, expectFailure: true });
  assert.match(oversizedResult.stderr, /input exceeds 1048576 bytes/);

  const installedProvenance = JSON.parse(await readFile(
    path.join(consumer, 'node_modules', 'axm-foundation-planet-sampler', 'PROVENANCE.json'),
    'utf8',
  ));
  assert.equal(installedProvenance.revision, 'b838933c0cf13b03add15bad9757a75a380d2173');
  const installedCapability = JSON.parse(await readFile(
    path.join(consumer, 'node_modules', 'axm-foundation-planet-sampler', 'capability.json'),
    'utf8',
  ));
  assert.deepEqual(installedCapability, described);
  const installedMigrationCapability = JSON.parse(await readFile(
    path.join(consumer, 'node_modules', 'axm-foundation-planet-sampler', 'migration-capability.json'),
    'utf8',
  ));
  assert.equal(installedMigrationCapability.id, 'axm.foundation-planet.sample-receipt-migrator');
  assert.deepEqual(installedMigrationCapability.versions, { source: '1.0.0', target: '1.1.0' });
});
