import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidenceDir = path.join(repositoryRoot, '.codex-temp-planet-experience');
const serverReadyTimeoutMs = 10_000;
const interactiveTimeoutMs = 90_000;
const syntheticGamepadHoldMs = 1_600;

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

async function pressGamepad(page, index) {
  await page.evaluate(buttonIndex => window.__axmExperienceTestPad?.setButton(buttonIndex, true), index);
  // The current Planet baseline can render near 1 fps in CI. Hold the synthetic
  // button long enough that the browser's main-thread polling seam is actually
  // observable instead of pretending a short-tap latency guarantee exists.
  await page.waitForTimeout(syntheticGamepadHoldMs);
  await page.evaluate(buttonIndex => window.__axmExperienceTestPad?.setButton(buttonIndex, false), index);
  await page.waitForTimeout(400);
}

async function readExperience(page) {
  return page.evaluate(() => {
    const mission = document.querySelector('.mission');
    const experience = document.getElementById('surveyExperience');
    const missionRect = mission?.getBoundingClientRect();
    const experienceRect = experience?.getBoundingClientRect();
    return {
      contract: document.body.dataset.experienceControls || null,
      input: document.getElementById('surveyInputChip')?.textContent?.trim() || null,
      view: document.getElementById('surveyViewChip')?.textContent?.trim() || null,
      life: document.getElementById('surveyLifeChip')?.textContent?.trim() || null,
      message: document.getElementById('surveyExperienceMessage')?.textContent?.trim() || null,
      lifePressed: document.getElementById('lifeMaster')?.getAttribute('aria-pressed') || null,
      activeMode: document.querySelector('.mode-button.active')?.dataset?.mode || null,
      coordinate: document.getElementById('coordinate')?.textContent?.trim() || null,
      biome: document.getElementById('biome')?.textContent?.trim() || null,
      fps: document.getElementById('fps')?.textContent?.trim() || null,
      viewport: { width: innerWidth, height: innerHeight },
      documentWidth: document.documentElement.scrollWidth,
      mission: missionRect ? {
        left: Math.round(missionRect.left), top: Math.round(missionRect.top),
        right: Math.round(missionRect.right), bottom: Math.round(missionRect.bottom),
      } : null,
      experience: experienceRect ? {
        left: Math.round(experienceRect.left), top: Math.round(experienceRect.top),
        right: Math.round(experienceRect.right), bottom: Math.round(experienceRect.bottom),
      } : null,
    };
  });
}

await mkdir(evidenceDir, { recursive: true });
let server;
let browser;
const pageErrors = [];
const fatalResponses = [];
const receipt = {
  contract: 'AXM Foundation Planet survey experience gate v1',
  verdict: 'UNKNOWN',
  interactiveTimeoutMs,
  syntheticGamepadHoldMs,
  checks: [],
  pageErrors,
  fatalResponses,
};

try {
  server = await startServer();
  receipt.url = server.url;
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    const buttons = Array.from({ length: 17 }, () => ({ pressed: false, touched: false, value: 0 }));
    const pad = {
      axes: [0, 0, 0, 0],
      buttons,
      connected: true,
      id: 'AXM deterministic experience test pad',
      index: 0,
      mapping: 'standard',
      timestamp: 0,
      vibrationActuator: null,
    };
    Object.defineProperty(navigator, 'getGamepads', {
      configurable: true,
      value: () => [pad],
    });
    window.__axmExperienceTestPad = {
      setButton(index, pressed) {
        const button = buttons[index];
        if (!button) return;
        button.pressed = Boolean(pressed);
        button.touched = Boolean(pressed);
        button.value = pressed ? 1 : 0;
        pad.timestamp = performance.now();
      },
    };
  });

  const page = await context.newPage();
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
  await page.waitForFunction(() => document.getElementById('loading')?.classList.contains('done'), null, { timeout: interactiveTimeoutMs });
  await page.waitForFunction(() => document.body.dataset.experienceControls === 'survey-command-v1', null, { timeout: 10_000 });
  receipt.checks.push('planet-and-experience-surface-ready');

  const baseline = await readExperience(page);
  receipt.baseline = baseline;
  if (baseline.input !== 'POINTER' || baseline.lifePressed !== 'true' || !baseline.coordinate || baseline.biome === 'Scanning…') {
    fail('Survey experience did not settle into the expected truthful baseline.', baseline);
  }
  await page.screenshot({ path: path.join(evidenceDir, '01-desktop-baseline.png'), fullPage: true });
  receipt.checks.push('desktop-baseline-render-captured');

  await page.keyboard.press('l');
  await page.waitForFunction(() => document.getElementById('lifeMaster')?.getAttribute('aria-pressed') === 'false', null, { timeout: 10_000 });
  await page.waitForFunction(() => document.getElementById('surveyExperienceMessage')?.textContent?.includes('LIFE → OFF'), null, { timeout: 10_000 });
  const keyboardOff = await readExperience(page);
  if (keyboardOff.input !== 'KEYBOARD' || keyboardOff.life !== 'LIFE OFF') fail('Keyboard input changed Planet state but feedback did not explain it.', keyboardOff);
  receipt.keyboardOff = keyboardOff;
  receipt.checks.push('keyboard-input-response-feedback-loop');

  await page.keyboard.press('l');
  await page.waitForFunction(() => document.getElementById('lifeMaster')?.getAttribute('aria-pressed') === 'true', null, { timeout: 10_000 });
  await page.waitForFunction(() => document.getElementById('surveyExperienceMessage')?.textContent?.includes('LIFE → ON'), null, { timeout: 10_000 });
  receipt.checks.push('keyboard-action-reversible');

  receipt.gamepadProbe = await page.evaluate(() => {
    const pads = navigator.getGamepads?.() || [];
    const pad = [...pads].find(candidate => candidate?.connected);
    return {
      count: pads.length,
      connected: Boolean(pad?.connected),
      id: pad?.id || null,
      mapping: pad?.mapping || null,
      buttons: pad?.buttons?.length || 0,
    };
  });
  if (!receipt.gamepadProbe.connected || receipt.gamepadProbe.buttons < 16) fail('Deterministic gamepad seam was not visible to the real browser surface.', receipt.gamepadProbe);
  receipt.checks.push('deterministic-gamepad-seam-visible');

  await pressGamepad(page, 3);
  await page.waitForFunction(() => document.getElementById('lifeMaster')?.getAttribute('aria-pressed') === 'false', null, { timeout: 10_000 });
  await page.waitForFunction(() => document.getElementById('surveyInputChip')?.textContent === 'GAMEPAD', null, { timeout: 10_000 });
  await page.waitForFunction(() => document.getElementById('surveyExperienceMessage')?.textContent?.includes('LIFE → OFF'), null, { timeout: 10_000 });
  const gamepadOff = await readExperience(page);
  receipt.gamepadOff = gamepadOff;
  receipt.checks.push('gamepad-input-response-feedback-loop');

  await pressGamepad(page, 3);
  await page.waitForFunction(() => document.getElementById('lifeMaster')?.getAttribute('aria-pressed') === 'true', null, { timeout: 10_000 });
  receipt.checks.push('gamepad-action-reversible');

  await page.keyboard.press('2');
  await page.waitForFunction(() => document.querySelector('.mode-button.active')?.dataset?.mode === 'surface', null, { timeout: 20_000 });
  await page.waitForFunction(() => document.getElementById('surveyExperienceMessage')?.textContent?.includes('VIEW → SURFACE'), null, { timeout: 10_000 });
  const surfaceMode = await readExperience(page);
  if (surfaceMode.input !== 'KEYBOARD' || surfaceMode.view !== 'SURFACE') fail('Keyboard view switch was not reflected in the experience state.', surfaceMode);
  receipt.surfaceMode = surfaceMode;
  receipt.checks.push('view-mode-feedback-loop');

  await page.keyboard.press('1');
  await page.waitForFunction(() => document.querySelector('.mode-button.active')?.dataset?.mode === 'orbit', null, { timeout: 20_000 });
  await page.waitForFunction(() => document.getElementById('surveyExperienceMessage')?.textContent?.includes('VIEW → ORBIT'), null, { timeout: 10_000 });
  receipt.checks.push('view-mode-action-reversible');

  await page.screenshot({ path: path.join(evidenceDir, '02-desktop-exercised.png'), fullPage: true });
  receipt.desktopExercised = await readExperience(page);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  const mobile = await readExperience(page);
  receipt.mobile = mobile;
  if (mobile.documentWidth > mobile.viewport.width) fail('Survey experience introduced horizontal mobile overflow.', mobile);
  if (!mobile.mission || mobile.mission.left < 0 || mobile.mission.right > mobile.viewport.width) fail('Mission surface escaped the mobile viewport.', mobile);
  if (!mobile.experience || mobile.experience.left < mobile.mission.left || mobile.experience.right > mobile.mission.right) fail('Survey feedback escaped its mobile mission surface.', mobile);
  await page.screenshot({ path: path.join(evidenceDir, '03-mobile-390x844.png'), fullPage: true });
  receipt.checks.push('mobile-layout-no-horizontal-overflow');

  if (pageErrors.length > 0 || fatalResponses.length > 0) fail('Survey experience completed with browser/module errors.', { pageErrors, fatalResponses });
  receipt.checks.push('no-page-or-critical-resource-errors');
  receipt.verdict = 'PASS';
} catch (error) {
  receipt.verdict = 'FAIL';
  receipt.failure = { message: error?.message || String(error), details: error?.details || null, stack: error?.stack || null };
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  if (server) {
    receipt.serverLogs = server.logs();
    await stopServer(server.child);
  }
  const receiptPath = path.join(evidenceDir, 'receipt.json');
  await writeFile(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    verdict: receipt.verdict,
    checks: receipt.checks,
    baseline: receipt.baseline || null,
    keyboardOff: receipt.keyboardOff || null,
    gamepadProbe: receipt.gamepadProbe || null,
    gamepadOff: receipt.gamepadOff || null,
    surfaceMode: receipt.surfaceMode || null,
    mobile: receipt.mobile || null,
    pageErrors: receipt.pageErrors,
    fatalResponses: receipt.fatalResponses,
    receipt: path.relative(repositoryRoot, receiptPath),
  }, null, 2));
}
