import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const serverPath = path.join(repositoryRoot, 'scripts', 'serve.mjs');

const child = spawn(process.execPath, [serverPath, '--port', '0'], {
  cwd: repositoryRoot,
  env: { ...process.env, HOST: '127.0.0.1' },
  stdio: ['ignore', 'pipe', 'pipe'],
});

let stderr = '';
child.stderr.setEncoding('utf8');
child.stderr.on('data', (chunk) => {
  stderr += chunk;
});

function waitForReadyUrl() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Standalone server did not become ready. ${stderr}`));
    }, 10_000);

    child.once('exit', (code) => {
      clearTimeout(timeout);
      reject(new Error(`Standalone server exited early with code ${code}. ${stderr}`));
    });

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      const match = chunk.match(/Foundation Planet ready: (http:\/\/[^\s]+\/)/);
      if (match) {
        clearTimeout(timeout);
        resolve(match[1]);
      }
    });
  });
}

async function stopChild() {
  if (child.exitCode !== null) return;

  child.kill('SIGTERM');
  await Promise.race([
    new Promise((resolve) => child.once('exit', resolve)),
    new Promise((resolve) => setTimeout(resolve, 2_000)),
  ]);

  if (child.exitCode === null) child.kill('SIGKILL');
}

try {
  const baseUrl = await waitForReadyUrl();

  const rootResponse = await fetch(baseUrl, { redirect: 'manual' });
  assert.equal(rootResponse.status, 302, 'root redirects into the Planet');
  assert.equal(
    rootResponse.headers.get('location'),
    '/worlds/foundation-planet/index.html',
    'root redirect targets the Planet entry',
  );

  const indexResponse = await fetch(
    new URL('/worlds/foundation-planet/index.html', baseUrl),
  );
  assert.equal(indexResponse.status, 200, 'Planet index is served');
  assert.match(
    await indexResponse.text(),
    /<title>AXM Foundation Planet<\/title>/,
    'Planet document is the expected entry',
  );

  const vendorResponse = await fetch(
    new URL('/shared/vendor/three-r160/three.module.js', baseUrl),
  );
  assert.equal(vendorResponse.status, 200, 'vendored Three.js is served');
  assert.match(
    vendorResponse.headers.get('content-type') ?? '',
    /^text\/javascript/,
    'vendored modules use a JavaScript MIME type',
  );

  const missingResponse = await fetch(new URL('/does-not-exist', baseUrl));
  assert.equal(missingResponse.status, 404, 'missing paths fail closed');

  console.log('foundation planet standalone server selftest: PASS (7 assertions)');
} finally {
  await stopChild();
}
