import assert from 'node:assert/strict';
import { mkdir, mkdtemp } from 'node:fs/promises';
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
  if (!options.allowFailure) {
    assert.equal(result.status, 0, `${command} failed\nstdout: ${result.stdout}\nstderr: ${result.stderr}`);
  }
  return result;
}

test('installed CLI rejects duplicate JSON object members before sample or receipt admission', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'foundation-planet-sampler-strict-json-'));
  const artifacts = path.join(root, 'artifacts');
  const consumer = path.join(root, 'consumer');
  await Promise.all([
    mkdir(artifacts, { recursive: true }),
    mkdir(consumer, { recursive: true }),
  ]);

  const packed = run('npm', ['pack', packageRoot, '--silent', '--json', '--pack-destination', artifacts]);
  const packResult = JSON.parse(packed.stdout.trim());
  assert.equal(packResult.length, 1);
  const tarball = path.join(artifacts, packResult[0].filename);

  run('npm', ['init', '--yes'], { cwd: consumer });
  run('npm', ['install', '--offline', '--ignore-scripts', tarball], { cwd: consumer });

  const bin = path.join(
    consumer,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'foundation-planet-sampler.cmd' : 'foundation-planet-sampler',
  );

  const validRequest = JSON.stringify({
    schema: 'axm.foundation-planet.sample-request/v1',
    profile: 'temperate',
    coordinates: [{ id: 'origin', lat: 0, lon: 0 }],
  });
  const validReceipt = JSON.parse(run(bin, ['sample', '-'], { cwd: consumer, input: validRequest }).stdout);
  assert.equal(JSON.parse(run(bin, ['verify', '-'], {
    cwd: consumer,
    input: JSON.stringify(validReceipt),
  }).stdout).valid, true);

  const duplicateProfile = run(bin, ['sample', '-'], {
    cwd: consumer,
    input: '{"schema":"axm.foundation-planet.sample-request/v1","profile":"barren","profile":"temperate","coordinates":[{"lat":0,"lon":0}]}',
    allowFailure: true,
  });

  const escapedDuplicateCoordinate = run(bin, ['sample', '-'], {
    cwd: consumer,
    input: String.raw`{"schema":"axm.foundation-planet.sample-request/v1","profile":"temperate","coordinates":[{"lat":0,"l\u0061t":1,"lon":0}]}`,
    allowFailure: true,
  });

  const serializedReceipt = JSON.stringify(validReceipt);
  const duplicateReceiptSchema = run(bin, ['verify', '-'], {
    cwd: consumer,
    input: `{"schema":"axm.foundation-planet.sample-receipt/invalid",${serializedReceipt.slice(1)}`,
    allowFailure: true,
  });

  for (const [label, result, key] of [
    ['duplicate request profile', duplicateProfile, 'profile'],
    ['escaped duplicate nested coordinate key', escapedDuplicateCoordinate, 'lat'],
    ['duplicate receipt schema', duplicateReceiptSchema, 'schema'],
  ]) {
    assert.notEqual(result.status, 0, `${label} was silently accepted\nstdout: ${result.stdout}`);
    assert.match(result.stderr, new RegExp(`duplicate JSON object key \\\"${key}\\\"`), `${label} did not report the ambiguous key`);
  }
});
