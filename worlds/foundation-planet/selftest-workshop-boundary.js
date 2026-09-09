'use strict';

const fs = require('fs');
const path = require('path');

function loadWorkshopIntegration({ planetRoot, configuredRoot, required = false }) {
  if (!path.isAbsolute(planetRoot)) {
    throw new Error('planetRoot must be absolute');
  }
  const workshopRoot = configuredRoot
    ? path.resolve(configuredRoot)
    : path.resolve(planetRoot, '..', '..');
  const files = {
    registry: path.join(workshopRoot, 'worlds', 'world-registry.json'),
    server: path.join(workshopRoot, 'server.js'),
    operationsApi: path.join(workshopRoot, 'shared', 'operations', 'operations-api.js'),
    multiworldService: path.join(workshopRoot, 'shared', 'operations', 'multiworld-state-service.js')
  };
  const missing = Object.values(files).filter(file => !fs.existsSync(file));

  if (missing.length > 0) {
    if (configuredRoot || required) {
      throw new Error(
        `Workshop integration unavailable beneath ${workshopRoot}; missing: ${missing.join(', ')}`
      );
    }
    return { status: 'SKIPPED', workshopRoot, missing };
  }

  return {
    status: 'VERIFIED',
    workshopRoot,
    missing: [],
    registry: JSON.parse(fs.readFileSync(files.registry, 'utf8')),
    server: fs.readFileSync(files.server, 'utf8'),
    operationsApi: fs.readFileSync(files.operationsApi, 'utf8'),
    multiworldService: fs.readFileSync(files.multiworldService, 'utf8')
  };
}

module.exports = { loadWorkshopIntegration };
