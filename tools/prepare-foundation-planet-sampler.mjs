import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageRoot = path.join(repositoryRoot, 'packages', 'foundation-planet-sampler');
const vendorRoot = path.join(packageRoot, 'vendor');
const generatedPaths = [
  path.join(packageRoot, 'LICENSE'),
  path.join(packageRoot, 'THIRD_PARTY.json'),
  vendorRoot,
];

if (process.argv.includes('--cleanup')) {
  await Promise.all(generatedPaths.map(target => rm(target, { recursive: true, force: true })));
  process.exit(0);
}

const provenance = JSON.parse(await readFile(path.join(packageRoot, 'PROVENANCE.json'), 'utf8'));
if (provenance.schema !== 'axm.foundation-planet.sampler-provenance/v1' || !Array.isArray(provenance.sources)) {
  throw new Error('sampler provenance is malformed');
}

await rm(vendorRoot, { recursive: true, force: true });
await mkdir(vendorRoot, { recursive: true });

for (const source of provenance.sources) {
  const sourcePath = path.resolve(repositoryRoot, source.path);
  const packagePath = path.resolve(packageRoot, source.packagePath);
  if (!sourcePath.startsWith(`${repositoryRoot}${path.sep}`) || !packagePath.startsWith(`${vendorRoot}${path.sep}`)) {
    throw new Error(`sampler provenance path escapes its boundary: ${source.path}`);
  }
  const bytes = await readFile(sourcePath);
  const digest = createHash('sha256').update(bytes).digest('hex');
  if (digest !== source.sha256) throw new Error(`sampler source digest mismatch: ${source.path}`);
  await mkdir(path.dirname(packagePath), { recursive: true });
  await copyFile(sourcePath, packagePath);
}

await copyFile(path.join(repositoryRoot, 'LICENSE'), path.join(packageRoot, 'LICENSE'));
await copyFile(path.join(repositoryRoot, 'THIRD_PARTY.json'), path.join(packageRoot, 'THIRD_PARTY.json'));
console.error(`prepared ${provenance.sources.length} verified sampler source files`);
