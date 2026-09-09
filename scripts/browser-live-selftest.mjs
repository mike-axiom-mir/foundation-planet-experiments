import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(repositoryRoot, '.codex-temp-browser-truth');
const serverReadyTimeoutMs = 10_000;
const interactiveTimeoutMs = 90_000;

function fail(message, details = {}) {
  const error = new Error(message);
  error.details = details;
  throw error;
}

async function startServer() {
  const child = spawn(process.execPath, ['scripts/serve.mjs', '--host', '127.0.0.1', '--port', '0'], {
    cwd: repositoryRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env },
  });
  let stdout = '';
  let stderr = '';
  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');
  child.stdout.on('data', chunk => { stdout += chunk; });
  child.stderr.on('data', chunk => { stderr += chunk; });

  const url = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(
      `Timed out waiting for local Planet server. stdout=${JSON.stringify(stdout)} stderr=${JSON.stringify(stderr)}`,
    )), serverReadyTimeoutMs);
    const inspect = () => {
      const match = stdout.match(/Foundation Planet ready: (http:\/\/127\.0\.0\.1:\d+\/)/);
      if (!match) return;
      clearTimeout(timer);
      resolve(match[1]);
    };
    child.stdout.on('data', inspect);
    child.once('exit', code => {
      clearTimeout(timer);
      reject(new Error(
        `Planet server exited before readiness (code ${code}). stdout=${JSON.stringify(stdout)} stderr=${JSON.stringify(stderr)}`,
      ));
    });
    inspect();
  });

  return { child, url, logs: () => ({ stdout, stderr }) };
}

async function stopServer(child) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  child.kill('SIGTERM');
  await new Promise(resolve => {
    const timer = setTimeout(() => {
      if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
      resolve();
    }, 3_000);
    child.once('exit', () => { clearTimeout(timer); resolve(); });
  });
}

function safeFileName(name) {
  return name.replace(/[^a-z0-9._-]+/gi, '-').toLowerCase();
}

async function captureState(page, label) {
  const state = await page.evaluate(() => {
    const canvas = document.getElementById('scene');
    const canvasRect = canvas?.getBoundingClientRect();
    const life = document.getElementById('lifeMaster');
    const loading = document.getElementById('loading');
    const persistence = document.getElementById('persistenceRevision');
    return {
      api: document.body.dataset.api || null,
      mode: document.body.dataset.mode || null,
      loadingDone: Boolean(loading?.classList.contains('done')),
      lifePressed: life?.getAttribute('aria-pressed') || null,
      biome: document.getElementById('biome')?.textContent?.trim() || null,
      coordinate: document.getElementById('coordinate')?.textContent?.trim() || null,
      persistenceRevision: persistence?.textContent?.trim() || null,
      persistenceTitle: persistence?.title || null,
      persistenceStatus: document.body.dataset.persistenceStatus || null,
      persistenceEncoding: document.body.dataset.persistenceEncoding || null,
      persistenceError: document.body.dataset.persistenceError || null,
      persistencePayloadCharacters: document.body.dataset.persistencePayloadCharacters || null,
      fps: document.getElementById('fps')?.textContent?.trim() || null,
      canvas: canvas ? {
        cssWidth: Math.round(canvasRect?.width || 0),
        cssHeight: Math.round(canvasRect?.height || 0),
        bufferWidth: canvas.width,
        bufferHeight: canvas.height,
      } : null,
    };
  });
  const screenshot = path.join(evidenceDir, `${safeFileName(label)}.png`);
  await page.screenshot({ path: screenshot, fullPage: true });
  return { label, screenshot: path.relative(repositoryRoot, screenshot), ...state };
}

async function capturePublicSnapshotSizing(page) {
  return page.evaluate(() => {
    const jsonSize = value => {
      try { return JSON.stringify(value).length; } catch { return null; }
    };
    const fieldSizes = value => Object.fromEntries(
      Object.entries(value || {})
        .map(([key, item]) => [key, jsonSize(item)])
        .sort((a, b) => (b[1] || 0) - (a[1] || 0)),
    );
    const snapshot = window.AXMFoundationPlanet.snapshot();
    return {
      snapshotCharacters: jsonSize(snapshot),
      earthSystemCharacters: jsonSize(snapshot.earthSystem),
      earthSystemFields: fieldSizes(snapshot.earthSystem),
      earthTransportCharacters: jsonSize(snapshot.earthTransport),
      earthTransportFields: fieldSizes(snapshot.earthTransport),
      basinRoutingCharacters: jsonSize(snapshot.basinRouting),
      basinRoutingFields: fieldSizes(snapshot.basinRouting),
      livingCharacters: jsonSize(snapshot.living),
      seasonalWeatherCharacters: jsonSize(snapshot.seasonalWeather),
      regionalCommunityCharacters: jsonSize(snapshot.regionalCommunity),
      ecosystemDynamicsCharacters: jsonSize(snapshot.ecosystemDynamics),
    };
  });
}

await mkdir(evidenceDir, { recursive: true });
let server;
let browser;
const pageErrors = [];
const fatalResponses = [];
const receipt = {
  contract: 'AXM Foundation Planet live-browser truth gate v1',
  verdict: 'UNKNOWN',
  interactiveTimeoutMs,
  checks: [],
  pageErrors,
  fatalResponses,
};

try {
  server = await startServer();
  receipt.url = server.url;
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', error => pageErrors.push(String(error?.stack || error)));
  page.on('response', response => {
    const type = response.request().resourceType();
    if (response.status() >= 400 && ['document', 'script', 'stylesheet'].includes(type)) {
      fatalResponses.push({ status: response.status(), type, url: response.url() });
    }
  });

  const response = await page.goto(server.url, { waitUntil: 'domcontentloaded', timeout: 15_000 });
  if (!response || response.status() >= 400) fail('Planet entry did not return a successful document response.', { status: response?.status() ?? null });
  receipt.checks.push('entry-document-success');

  await page.waitForFunction(() => document.body.dataset.api?.startsWith('AXMFoundationPlanet/'), null, { timeout: interactiveTimeoutMs });
  receipt.checks.push('browser-api-exposed');
  await page.waitForFunction(() => document.getElementById('loading')?.classList.contains('done'), null, { timeout: interactiveTimeoutMs });
  receipt.checks.push('loading-overlay-settled');
  await page.waitForFunction(() => {
    const canvas = document.getElementById('scene');
    if (!canvas) return false;
    const rect = canvas.getBoundingClientRect();
    return rect.width > 100 && rect.height > 100 && canvas.width > 100 && canvas.height > 100;
  }, null, { timeout: 10_000 });
  receipt.checks.push('render-canvas-sized');

  const baseline = await captureState(page, '01-baseline');
  receipt.baseline = baseline;
  receipt.checks.push('baseline-frame-captured');
  if (!baseline.api || baseline.biome === 'Scanning…' || !baseline.coordinate) fail('Planet exposed its API but did not settle the primary survey readout.', baseline);

  receipt.persistenceSizing = await capturePublicSnapshotSizing(page);
  receipt.checks.push('public-snapshot-size-diagnostics-captured');
  if (baseline.persistenceStatus === 'error') fail('Planet reached an interactive frame but its canonical save failed.', { baseline, persistenceSizing: receipt.persistenceSizing });
  receipt.checks.push('baseline-persistence-healthy');

  const life = page.locator('#lifeMaster');
  if ((await life.getAttribute('aria-pressed')) !== 'true') fail('Expected Life to be enabled before the reversible interaction.');
  await life.click({ timeout: 20_000 });
  await page.waitForFunction(() => document.getElementById('lifeMaster')?.getAttribute('aria-pressed') === 'false', null, { timeout: 10_000 });
  receipt.action = await captureState(page, '02-life-disabled');
  receipt.checks.push('bounded-action-observed');

  await life.click({ timeout: 20_000 });
  await page.waitForFunction(() => document.getElementById('lifeMaster')?.getAttribute('aria-pressed') === 'true', null, { timeout: 10_000 });
  await page.waitForTimeout(350);
  receipt.settled = await captureState(page, '03-life-restored');
  receipt.checks.push('reversible-action-restored');

  if (pageErrors.length > 0 || fatalResponses.length > 0) fail('Live browser completed interaction with runtime/module errors.', { pageErrors, fatalResponses });
  receipt.checks.push('no-page-or-critical-resource-errors');
  receipt.verdict = 'PASS';
} catch (error) {
  receipt.verdict = 'FAIL';
  receipt.failure = { message: error?.message || String(error), details: error?.details || null, stack: error?.stack || null };
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server) { receipt.serverLogs = server.logs(); await stopServer(server.child); }
  const receiptPath = path.join(evidenceDir, 'receipt.json');
  await writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    verdict: receipt.verdict,
    checks: receipt.checks,
    baseline: receipt.baseline || null,
    persistenceSizing: receipt.persistenceSizing || null,
    action: receipt.action || null,
    settled: receipt.settled || null,
    pageErrors: receipt.pageErrors,
    fatalResponses: receipt.fatalResponses,
    receipt: path.relative(repositoryRoot, receiptPath),
  }, null, 2));
}
