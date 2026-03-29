#!/usr/bin/env node
'use strict';

/**
 * Batch improve all experts with URLs from sources-level1.json
 * Uso: node packages/clones/cli/batch-improve-urls.cjs
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '../../..');
const CLI = path.join(ROOT, 'packages/clones/cli/index.cjs');
const SOURCES = require('./sources-level1.json');

let done = 0;
let failed = 0;
let skipped = 0;

const experts = Object.entries(SOURCES).filter(([k]) => !k.startsWith('_'));
const totalUrls = experts.reduce((sum, [, urls]) => sum + urls.length, 0);

console.log(`\n${'='.repeat(50)}`);
console.log(` BATCH IMPROVE URLs — ${totalUrls} URLs / ${experts.length} experts`);
console.log(`${'='.repeat(50)}\n`);

for (const [name, urls] of experts) {
  console.log(`--- ${name} (${urls.length} URLs) ---`);

  for (const url of urls) {
    process.stdout.write(`  → ${url.slice(0, 60)}... `);
    try {
      const output = execSync(
        `node "${CLI}" improve "${name}" --source="${url}"`,
        { cwd: ROOT, timeout: 60000, encoding: 'utf-8', stdio: 'pipe' }
      );
      const chunksMatch = output.match(/Chunks:\s+(\d+)/);
      const chunks = chunksMatch ? chunksMatch[1] : '?';
      console.log(`✅ chunks: ${chunks}`);
      done++;
    } catch (err) {
      const msg = (err.stdout || err.message || '').slice(0, 80);
      console.log(`❌ ${msg}`);
      failed++;
    }
  }
  console.log('');
}

console.log(`${'='.repeat(50)}`);
console.log(` CONCLUÍDO: ${done} OK | ${failed} falhas | ${skipped} pulados`);
console.log(`${'='.repeat(50)}\n`);
