import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const planetRoot = path.dirname(fileURLToPath(import.meta.url));
const workshopRoot = path.dirname(path.dirname(planetRoot));
const entryPath = path.join(planetRoot, 'app.mjs');
const windowsInstallRoot = process.env.AXM_WINDOWS_INSTALL_ROOT || 'C:\\AXM_WORKSHOP';
const windowsLegacyMaxPath = 260;
const seen = new Set();
const missing = [];

function localImportPaths(source) {
  const imports = [];
  const pattern = /\b(?:from\s+|import\s*)['"]([^'"]+)['"]/g;
  for (const match of source.matchAll(pattern)) {
    const specifier = match[1].split('?')[0].split('#')[0];
    if (specifier.startsWith('.') || specifier.startsWith('/')) {
      imports.push(specifier);
    }
  }
  return imports;
}

function resolveImport(importerPath, specifier) {
  return specifier.startsWith('/')
    ? path.join(workshopRoot, specifier.slice(1))
    : path.resolve(path.dirname(importerPath), specifier);
}

function visit(modulePath) {
  const absolutePath = path.resolve(modulePath);
  if (seen.has(absolutePath)) return;
  seen.add(absolutePath);
  if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
    missing.push(absolutePath);
    return;
  }
  const source = fs.readFileSync(absolutePath, 'utf8');
  for (const specifier of localImportPaths(source)) {
    visit(resolveImport(absolutePath, specifier));
  }
}

visit(entryPath);

const activePaths = [...seen].sort();
const activeRelativePaths = activePaths.map(value => path.relative(workshopRoot, value));
const escapedPaths = activeRelativePaths.filter(value =>
  value === '..' || value.startsWith(`..${path.sep}`) || path.isAbsolute(value));
const projectedWindowsPaths = activeRelativePaths.map(value =>
  path.win32.join(windowsInstallRoot, ...value.split(path.sep)));
const longestProjectedWindowsPath = projectedWindowsPaths.reduce((longest, value) =>
  value.length > longest.length ? value : longest, '');
const maximumRelativePathLength = Math.max(...activeRelativePaths.map(value => value.length));
const windowsInstallRootBudget = windowsLegacyMaxPath - maximumRelativePathLength - 2;
const shortR117 = path.join(planetRoot, 'core',
  'r117-policy-delegation-verification-response-signer-key-binding-request.mjs');
const shortR118 = path.join(planetRoot, 'core',
  'r118-policy-delegation-verification-response-signer-key-binding-authority-decision.mjs');
const compatibilityPairs = [
  [
    'matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signer-key-binding-request.mjs',
    'r117-policy-delegation-verification-response-signer-key-binding-request.mjs'
  ],
  [
    'matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signer-key-binding-request-audit.mjs',
    'r117-policy-delegation-verification-response-signer-key-binding-request-audit.mjs'
  ],
  [
    'matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signer-key-binding-authority-decision-integrity.mjs',
    'r118-policy-delegation-verification-response-signer-key-binding-authority-decision.mjs'
  ],
  [
    'matrix-thermal-historical-source-host-governance-trust-root-registry-configuration-response-signer-key-binding-policy-delegation-verification-response-signer-key-binding-authority-decision-integrity-audit.mjs',
    'r118-policy-delegation-verification-response-signer-key-binding-authority-decision-audit.mjs'
  ]
];

function normalizedCompatibilitySource(fileName) {
  return fs.readFileSync(path.join(planetRoot, 'core', fileName), 'utf8')
    .replaceAll('r117-policy-delegation-verification-response-signer-key-binding-request.mjs',
      compatibilityPairs[0][0])
    .replaceAll('r118-policy-delegation-verification-response-signer-key-binding-authority-decision.mjs',
      compatibilityPairs[2][0]);
}

assert.ok(activePaths.length >= 100,
  'the browser entry exposes a nontrivial local module graph');
assert.deepEqual(missing, [],
  'every browser-reachable local module exists');
assert.ok(path.win32.isAbsolute(windowsInstallRoot),
  `AXM_WINDOWS_INSTALL_ROOT must be an absolute Windows path; received ${windowsInstallRoot}`);
assert.deepEqual(escapedPaths, [],
  'every browser-reachable module remains inside the standalone repository');
assert.ok(longestProjectedWindowsPath.length < windowsLegacyMaxPath,
  `browser modules fit the configured Windows install root ${windowsInstallRoot}; ` +
  `maximum projected path was ${longestProjectedWindowsPath.length}`);
assert.ok(activePaths.includes(shortR117) && activePaths.includes(shortR118),
  'the browser graph uses the short-path R117 and R118 compatibility sources');
assert.ok(compatibilityPairs.every(([historicalName]) =>
  !activePaths.includes(path.join(planetRoot, 'core', historicalName))),
  'the browser graph does not route through the overlong R117 or R118 historical paths');
assert.ok(compatibilityPairs.every(([historicalName, shortName]) =>
  fs.readFileSync(path.join(planetRoot, 'core', historicalName), 'utf8') ===
    normalizedCompatibilitySource(shortName)),
  'the short browser-path sources remain semantically identical copies of the historical sources');

console.log(`foundation planet browser module graph selftest: PASS (8 assertions; ` +
  `${activePaths.length} modules; maximum relative path ${maximumRelativePathLength}; ` +
  `configured Windows path ${longestProjectedWindowsPath.length}; ` +
  `install-root budget ${windowsInstallRootBudget})`);
