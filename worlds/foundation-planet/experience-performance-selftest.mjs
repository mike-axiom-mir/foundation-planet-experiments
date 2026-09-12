import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const [html, css, app] = await Promise.all([
  readFile(path.join(root, 'index.html'), 'utf8'),
  readFile(path.join(root, 'styles.css'), 'utf8'),
  readFile(path.join(root, 'app.mjs'), 'utf8')
]);

assert.match(html, /<details class="diagnostic-section" id="diagnostics">/);
assert.match(html, /id="diagnosticStatus" aria-live="polite"/);
assert.match(html, /id="refreshDiagnostics" type="button"/);
assert.match(css, /\.diagnostic-section\[open\]/);

const capture = app.match(/function captureDiagnostics\(\) \{([\s\S]*?)\n\}\n\nfunction updateFrameRateReadout/);
assert.ok(capture, 'expected a bounded full diagnostic capture function');
assert.match(capture[1], /currentSystemAudit\(\)/);
assert.match(capture[1], /currentExperienceStatus\(\)/);

const lightweight = app.match(/function updateDiagnostics\([^)]*\) \{([\s\S]*?)\n\}/);
assert.ok(lightweight, 'expected the lightweight stale-snapshot path');
assert.doesNotMatch(lightweight[1], /currentSystemAudit|currentExperienceStatus|checksum/);

const frame = app.match(/function frame\(now\) \{([\s\S]*?)\n\}/);
assert.ok(frame, 'expected the animation frame loop');
assert.doesNotMatch(frame[1], /captureDiagnostics/);
assert.match(frame[1], /updateDiagnostics\('world clock advanced'\)/);

const start = app.match(/async function start\(\) \{([\s\S]*?)\n\}/);
assert.ok(start, 'expected the startup sequence');
assert.match(start[1], /captureDiagnostics\(\)[\s\S]*lastSaveAt = performance\.now\(\);[\s\S]*requestAnimationFrame\(frame\)/);

console.log('foundation planet experience performance selftest: PASS (14 assertions)');
