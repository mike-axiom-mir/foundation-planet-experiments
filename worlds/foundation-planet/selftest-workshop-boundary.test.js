'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { loadWorkshopIntegration } = require('./selftest-workshop-boundary.js');

const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'foundation-workshop-boundary-'));
const planetRoot = path.join(temporaryRoot, 'worlds', 'foundation-planet');
fs.mkdirSync(planetRoot, { recursive: true });

try {
  const skipped = loadWorkshopIntegration({ planetRoot });
  assert.equal(skipped.status, 'SKIPPED');
  assert.equal(skipped.missing.length, 4);

  assert.throws(
    () => loadWorkshopIntegration({ planetRoot, required: true }),
    /Workshop integration unavailable/
  );
  assert.throws(
    () => loadWorkshopIntegration({ planetRoot, configuredRoot: path.join(temporaryRoot, 'wrong') }),
    /Workshop integration unavailable/
  );

  fs.mkdirSync(path.join(temporaryRoot, 'shared', 'operations'), { recursive: true });
  fs.writeFileSync(path.join(temporaryRoot, 'worlds', 'world-registry.json'),
    JSON.stringify({ worlds: [{ id: 'world.axm.foundation-planet' }] }));
  fs.writeFileSync(path.join(temporaryRoot, 'server.js'), 'const mime = { ".mjs": "text/javascript" };');
  fs.writeFileSync(path.join(temporaryRoot, 'shared', 'operations', 'operations-api.js'),
    "const routes = ['/api/living-worlds'];");
  fs.writeFileSync(path.join(temporaryRoot, 'shared', 'operations', 'multiworld-state-service.js'),
    "const CREATE_SCHEMA = 'axm.living-world.create/v1';");

  const verified = loadWorkshopIntegration({ planetRoot, required: true });
  assert.equal(verified.status, 'VERIFIED');
  assert.equal(verified.registry.worlds[0].id, 'world.axm.foundation-planet');
  assert.match(verified.server, /text\/javascript/);
  assert.match(verified.operationsApi, /living-worlds/);
  assert.match(verified.multiworldService, /living-world\.create/);

  fs.writeFileSync(path.join(temporaryRoot, 'worlds', 'world-registry.json'), '{');
  assert.throws(
    () => loadWorkshopIntegration({ planetRoot, required: true }),
    /JSON/
  );

  console.log('foundation selftest Workshop boundary: PASS (10 assertions)');
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
