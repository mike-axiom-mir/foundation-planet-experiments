#!/usr/bin/env node

import { readFile, stat } from 'node:fs/promises';
import process from 'node:process';

import { createSampleReceipt, describeCapability, verifySampleReceipt } from './index.mjs';

const MAX_INPUT_BYTES = 1_048_576;

async function readBoundedJson(source) {
  if (source && source !== '-') {
    const details = await stat(source);
    if (!details.isFile()) throw new TypeError('input path must name a regular file');
    if (details.size > MAX_INPUT_BYTES) throw new RangeError(`input exceeds ${MAX_INPUT_BYTES} bytes`);
  }
  const buffer = source && source !== '-'
    ? await readFile(source)
    : await new Promise((resolve, reject) => {
      const chunks = [];
      let bytes = 0;
      process.stdin.on('data', chunk => {
        bytes += chunk.length;
        if (bytes > MAX_INPUT_BYTES) {
          reject(new RangeError(`input exceeds ${MAX_INPUT_BYTES} bytes`));
          process.stdin.destroy();
          return;
        }
        chunks.push(chunk);
      });
      process.stdin.on('end', () => resolve(Buffer.concat(chunks)));
      process.stdin.on('error', reject);
    });
  if (buffer.length > MAX_INPUT_BYTES) throw new RangeError(`input exceeds ${MAX_INPUT_BYTES} bytes`);
  return JSON.parse(buffer.toString('utf8'));
}

async function main(argv) {
  const [command, source, ...extra] = argv;
  if (extra.length > 0) throw new TypeError('too many arguments');
  if (command === 'describe') {
    if (source !== undefined) throw new TypeError('describe accepts no input path');
    return describeCapability();
  }
  if (command === 'sample') return createSampleReceipt(await readBoundedJson(source));
  if (command === 'verify') return verifySampleReceipt(await readBoundedJson(source));
  throw new TypeError('usage: foundation-planet-sampler describe | sample [request.json|-] | verify [receipt.json|-]');
}

main(process.argv.slice(2)).then(
  result => process.stdout.write(`${JSON.stringify(result)}\n`),
  error => {
    process.stderr.write(`${JSON.stringify({
      schema: 'axm.foundation-planet.sampler-error/v1',
      error: error?.name || 'Error',
      message: error?.message || String(error),
    })}\n`);
    process.exitCode = 1;
  },
);
