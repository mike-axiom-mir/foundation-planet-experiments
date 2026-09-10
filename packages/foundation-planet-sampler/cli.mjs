#!/usr/bin/env node

import { readFile, stat } from 'node:fs/promises';
import process from 'node:process';

import {
  createSampleReceipt,
  describeCapability,
  verifyLegacySampleReceipt,
  verifySampleReceipt,
} from './index.mjs';
import {
  createSampleReceiptMigration,
  describeMigrationCapability,
  verifySampleReceiptMigration,
} from './migration.mjs';
import { renderSampleReceiptMigrationReview } from './review.mjs';

const MAX_INPUT_BYTES = 1_048_576;

function assertNoDuplicateObjectKeys(text) {
  let cursor = 0;

  const skipWhitespace = () => {
    while (cursor < text.length && /\s/.test(text[cursor])) cursor += 1;
  };

  const readString = () => {
    const start = cursor;
    cursor += 1;
    while (cursor < text.length) {
      const character = text[cursor];
      cursor += 1;
      if (character === '\\') {
        cursor += 1;
      } else if (character === '"') {
        return JSON.parse(text.slice(start, cursor));
      }
    }
    throw new SyntaxError('unterminated JSON string');
  };

  const scanPrimitive = () => {
    while (cursor < text.length && !/[\s,\]}]/.test(text[cursor])) cursor += 1;
  };

  const scanArray = () => {
    cursor += 1;
    skipWhitespace();
    if (text[cursor] === ']') {
      cursor += 1;
      return;
    }
    while (cursor < text.length) {
      scanValue();
      skipWhitespace();
      if (text[cursor] === ',') {
        cursor += 1;
        skipWhitespace();
        continue;
      }
      if (text[cursor] === ']') {
        cursor += 1;
        return;
      }
      throw new SyntaxError('invalid JSON array');
    }
  };

  const scanObject = () => {
    cursor += 1;
    skipWhitespace();
    const seen = new Set();
    if (text[cursor] === '}') {
      cursor += 1;
      return;
    }
    while (cursor < text.length) {
      const key = readString();
      if (seen.has(key)) throw new SyntaxError(`duplicate JSON object key ${JSON.stringify(key)}`);
      seen.add(key);
      skipWhitespace();
      if (text[cursor] !== ':') throw new SyntaxError('invalid JSON object');
      cursor += 1;
      scanValue();
      skipWhitespace();
      if (text[cursor] === ',') {
        cursor += 1;
        skipWhitespace();
        continue;
      }
      if (text[cursor] === '}') {
        cursor += 1;
        return;
      }
      throw new SyntaxError('invalid JSON object');
    }
  };

  function scanValue() {
    skipWhitespace();
    if (text[cursor] === '{') return scanObject();
    if (text[cursor] === '[') return scanArray();
    if (text[cursor] === '"') {
      readString();
      return;
    }
    scanPrimitive();
  }

  scanValue();
  skipWhitespace();
  if (cursor !== text.length) throw new SyntaxError('trailing JSON data');
}

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
  const text = buffer.toString('utf8');
  const value = JSON.parse(text);
  assertNoDuplicateObjectKeys(text);
  return value;
}

async function main(argv) {
  const [command, source, ...extra] = argv;
  if (extra.length > 0) throw new TypeError('too many arguments');
  if (command === 'describe') {
    if (source !== undefined) throw new TypeError('describe accepts no input path');
    return describeCapability();
  }
  if (command === 'describe-migration') {
    if (source !== undefined) throw new TypeError('describe-migration accepts no input path');
    return describeMigrationCapability();
  }
  if (command === 'sample') return createSampleReceipt(await readBoundedJson(source));
  if (command === 'verify') return verifySampleReceipt(await readBoundedJson(source));
  if (command === 'verify-legacy') return verifyLegacySampleReceipt(await readBoundedJson(source));
  if (command === 'migrate') return createSampleReceiptMigration(await readBoundedJson(source));
  if (command === 'verify-migration') return verifySampleReceiptMigration(await readBoundedJson(source));
  if (command === 'review-migration') return renderSampleReceiptMigrationReview(await readBoundedJson(source));
  throw new TypeError('usage: foundation-planet-sampler describe | sample [request.json|-] | verify [receipt.json|-] | verify-legacy [legacy-receipt.json|-] | describe-migration | migrate [legacy-receipt.json|-] | verify-migration [migration.json|-] | review-migration [migration.json|-]');
}

main(process.argv.slice(2)).then(
  result => process.stdout.write(typeof result === 'string' ? result : `${JSON.stringify(result)}\n`),
  error => {
    process.stderr.write(`${JSON.stringify({
      schema: 'axm.foundation-planet.sampler-error/v1',
      error: error?.name || 'Error',
      message: error?.message || String(error),
    })}\n`);
    process.exitCode = 1;
  },
);
