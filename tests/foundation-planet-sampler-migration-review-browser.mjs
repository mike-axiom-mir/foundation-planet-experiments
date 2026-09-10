import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { createSampleReceiptMigration } from '../packages/foundation-planet-sampler/migration.mjs';
import { renderSampleReceiptMigrationReview } from '../packages/foundation-planet-sampler/review.mjs';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixturePath = path.join(repositoryRoot, 'tests', 'fixtures', 'foundation-planet-sampler-v1.0-antimeridian.json');
const evidenceDir = path.resolve(process.env.EVIDENCE_DIR || path.join(repositoryRoot, 'artifacts', 'foundation-planet-migration-review'));
const playwrightRoot = process.env.PLAYWRIGHT_ROOT;

if (!playwrightRoot) throw new Error('PLAYWRIGHT_ROOT is required');
const playwrightEntry = path.join(playwrightRoot, 'node_modules', 'playwright', 'index.mjs');
const { chromium } = await import(pathToFileURL(playwrightEntry).href);

await mkdir(evidenceDir, { recursive: true });
const legacy = JSON.parse(await readFile(fixturePath, 'utf8'));
const migration = createSampleReceiptMigration(legacy);
const html = renderSampleReceiptMigrationReview(migration, migration.integrity.digest);
await writeFile(path.join(evidenceDir, 'migration.json'), `${JSON.stringify(migration, null, 2)}\n`);
await writeFile(path.join(evidenceDir, 'migration-review.html'), html);

const server = createServer((request, response) => {
  if (request.url === '/' || request.url === '/migration-review.html') {
    response.writeHead(200, {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
    });
    response.end(html);
    return;
  }
  response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
  response.end('not found');
});

await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
});
const address = server.address();
if (!address || typeof address === 'string') throw new Error('expected TCP server address');
const origin = `http://127.0.0.1:${address.port}`;

const browser = await chromium.launch({ headless: true });
const evidence = {
  schema: 'axm.foundation-planet.migration-review-browser-evidence/v1',
  reviewHead: process.env.AXM_REVIEW_HEAD || null,
  migrationDigest: migration.integrity.digest,
  sourceReceiptDigest: migration.source.receipt.integrity.digest,
  targetReceiptDigest: migration.target.receipt.integrity.digest,
  coordinateChangeCount: migration.coordinateChanges.length,
  desktop: {},
  mobile: {},
  authority: {
    appliesState: false,
    replacesSourceEvidence: false,
    canonical: false,
  },
};

async function exercise(viewport, label, screenshotName, { copy = false } = {}) {
  const context = await browser.newContext({ viewport, hasTouch: label === 'mobile' });
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin });
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  const externalRequests = [];
  page.on('pageerror', error => pageErrors.push(String(error)));
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('request', request => {
    try {
      if (new URL(request.url()).origin !== origin) externalRequests.push(request.url());
    } catch {
      externalRequests.push(request.url());
    }
  });

  await page.goto(`${origin}/migration-review.html`, { waitUntil: 'load' });
  await page.getByText('DETERMINISTIC LINEAGE PASS', { exact: true }).waitFor();
  await page.getByText('east-antimeridian', { exact: true }).waitFor();
  await page.getByText('0°, 180°', { exact: true }).waitFor();
  await page.getByText('0°, -180°', { exact: true }).waitFor();
  await page.getByText('DISPLAY ≠ MIGRATION AUTHORITY', { exact: true }).waitFor();
  assert.equal(await page.locator('[data-coordinate-change]').count(), 1);

  const metrics = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll('button')];
    const summaries = [...document.querySelectorAll('summary')];
    const interactive = [...buttons, ...summaries];
    const targetHeights = interactive.map(node => node.getBoundingClientRect().height);
    return {
      viewportWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      minimumInteractiveHeight: targetHeights.length ? Math.min(...targetHeights) : 0,
      bodyHeight: document.body.getBoundingClientRect().height,
    };
  });
  assert.equal(metrics.scrollWidth, metrics.viewportWidth, `${label} should not overflow horizontally`);
  assert.ok(metrics.minimumInteractiveHeight >= 44, `${label} interactive target below 44px: ${metrics.minimumInteractiveHeight}`);

  let copied = null;
  if (copy) {
    await page.getByRole('button', { name: 'Copy migration digest' }).click();
    await page.getByText('Copied exact migration digest.', { exact: true }).waitFor();
    copied = await page.evaluate(() => navigator.clipboard.readText());
    assert.equal(copied, migration.integrity.digest);
  }

  await page.screenshot({ path: path.join(evidenceDir, screenshotName), fullPage: true });
  await page.close();
  await context.close();

  assert.deepEqual(pageErrors, [], `${label} page errors: ${pageErrors.join('\n')}`);
  assert.deepEqual(consoleErrors, [], `${label} console errors: ${consoleErrors.join('\n')}`);
  assert.deepEqual(externalRequests, [], `${label} made external requests: ${externalRequests.join('\n')}`);

  return {
    ...metrics,
    copyExact: copy ? copied === migration.integrity.digest : null,
    pageErrors: pageErrors.length,
    consoleErrors: consoleErrors.length,
    externalRequests: externalRequests.length,
  };
}

try {
  evidence.desktop = await exercise({ width: 1280, height: 900 }, 'desktop', 'migration-review-desktop.png', { copy: true });
  evidence.mobile = await exercise({ width: 390, height: 844 }, 'mobile', 'migration-review-mobile.png');
  await writeFile(path.join(evidenceDir, 'browser-evidence.json'), `${JSON.stringify(evidence, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify(evidence)}\n`);
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
