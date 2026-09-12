import assert from 'node:assert/strict';
import { mkdir, mkdtemp, symlink, writeFile } from 'node:fs/promises';
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

async function installSampler() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'foundation-planet-sampler-file-admission-'));
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

  return {
    root,
    consumer,
    bin: path.join(
      consumer,
      'node_modules',
      '.bin',
      process.platform === 'win32' ? 'foundation-planet-sampler.cmd' : 'foundation-planet-sampler',
    ),
  };
}

test('installed CLI refuses symlinked file input before JSON admission', async (t) => {
  if (process.platform === 'win32') {
    t.skip('symlink semantics in this focused regression are verified on hosted Linux');
    return;
  }

  const { root, consumer, bin } = await installSampler();
  const request = JSON.stringify({
    schema: 'axm.foundation-planet.sample-request/v1',
    profile: 'temperate',
    coordinates: [{ id: 'origin', lat: 0, lon: 0 }],
  });
  const requestPath = path.join(root, 'request.json');
  const linkedPath = path.join(root, 'request-link.json');
  await writeFile(requestPath, request);
  await symlink(requestPath, linkedPath);

  const ordinary = run(bin, ['sample', requestPath], { cwd: consumer });
  const ordinaryReceipt = JSON.parse(ordinary.stdout);
  assert.equal(ordinaryReceipt.request.coordinates[0].id, 'origin');

  const linked = run(bin, ['sample', linkedPath], { cwd: consumer, allowFailure: true });
  assert.notEqual(linked.status, 0, `symlinked input was followed and admitted\nstdout: ${linked.stdout}`);
  const error = JSON.parse(linked.stderr.trim());
  assert.equal(error.schema, 'axm.foundation-planet.sampler-error/v1');
  assert.equal(error.error, 'TypeError');
  assert.equal(error.message, 'input path must name a regular non-symlink file');
});
