#!/usr/bin/env node
/**
 * validate-integrity.js — AIOS System Integrity Check
 *
 * Validates:
 * 1. Agent memory split — warns if same agent has MEMORY.md in both locations
 * 2. Rules without paths frontmatter — loads on every prompt (token waste)
 * 3. Orphan notification count — warns if > 100 files
 * 4. .agents/ orphan directory — should not exist
 * 5. Entity registry freshness — warns if entity-registry.yaml > 30 days old
 *
 * Usage:
 *   node scripts/validate-integrity.js
 *   node scripts/validate-integrity.js --strict   (exit code 1 on warnings)
 */

'use strict';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const STRICT = process.argv.includes('--strict');
const CWD = process.cwd();

let warnings = 0;
let errors = 0;

function warn(msg) {
  console.warn(`  WARN  ${msg}`);
  warnings++;
}

function error(msg) {
  console.error(`  ERROR ${msg}`);
  errors++;
}

function ok(msg) {
  console.log(`  OK    ${msg}`);
}

// ---------------------------------------------------------------------------
// 1. Agent memory split check
// ---------------------------------------------------------------------------
console.log('\n[1] Agent memory split');
const agentMemDir1 = path.join(CWD, '.claude', 'agent-memory');
const agentMemDir2 = path.join(CWD, '.aios-core', 'development', 'agents');

const inClaudeMemory = fs.existsSync(agentMemDir1)
  ? fs.readdirSync(agentMemDir1).filter(f => {
    const p = path.join(agentMemDir1, f);
    return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'MEMORY.md'));
  })
  : [];

const inAiosAgents = fs.existsSync(agentMemDir2)
  ? fs.readdirSync(agentMemDir2).filter(f => {
    const p = path.join(agentMemDir2, f);
    return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'MEMORY.md'));
  })
  : [];

// Normalize names: aios-architect → architect, aios-dev → dev
const normalize = (name) => name.replace(/^aios-/, '');
const normalizedClaude = inClaudeMemory.map(normalize);
const normalizedAios = inAiosAgents.map(normalize);
const duplicates = normalizedClaude.filter(n => normalizedAios.includes(n));

if (duplicates.length > 0) {
  warn(`Agent memory exists in both locations for: ${duplicates.join(', ')}`);
  warn(`  Canonical (L3): .aios-core/development/agents/*/MEMORY.md`);
  warn(`  Legacy:         .claude/agent-memory/*/MEMORY.md`);
  warn(`  Fix: merge legacy content into canonical, then delete .claude/agent-memory/`);
} else {
  ok('Agent memory locations are consistent');
}

// ---------------------------------------------------------------------------
// 2. Rules without paths frontmatter
// ---------------------------------------------------------------------------
console.log('\n[2] Rules frontmatter check');
const rulesDir = path.join(CWD, '.claude', 'rules');
if (fs.existsSync(rulesDir)) {
  const ruleFiles = fs.readdirSync(rulesDir).filter(f => f.endsWith('.md'));
  const alwaysLoad = [];

  for (const file of ruleFiles) {
    const content = fs.readFileSync(path.join(rulesDir, file), 'utf8');
    const hasFrontmatter = content.startsWith('---');
    if (!hasFrontmatter) {
      alwaysLoad.push(file);
    } else {
      // Check for paths: **/* which is same as always load
      const fmEnd = content.indexOf('---', 3);
      if (fmEnd > -1) {
        const fm = content.slice(3, fmEnd);
        if (fm.includes('**/*') && !fm.includes('paths:\n') && fm.match(/paths:\s+\*\*\/\*/)) {
          alwaysLoad.push(`${file} (paths: **/*)`);
        }
      }
    }
  }

  if (alwaysLoad.length > 0) {
    warn(`Rules loading on EVERY prompt (no paths restriction): ${alwaysLoad.join(', ')}`);
  } else {
    ok(`All ${ruleFiles.length} rules have paths frontmatter`);
  }
}

// ---------------------------------------------------------------------------
// 3. Notification count
// ---------------------------------------------------------------------------
console.log('\n[3] Notification backlog');
const notifDir = path.join(CWD, '.aios', 'notifications');
if (fs.existsSync(notifDir)) {
  const count = fs.readdirSync(notifDir).filter(f => f.endsWith('.md')).length;
  if (count > 100) {
    warn(`${count} notification files in .aios/notifications/ — run: npm run cleanup`);
  } else {
    ok(`${count} notification files (threshold: 100)`);
  }
}

// ---------------------------------------------------------------------------
// 4. Orphan .agents/ directory
// ---------------------------------------------------------------------------
console.log('\n[4] Orphan directories');
const orphanDir = path.join(CWD, '.agents');
if (fs.existsSync(orphanDir)) {
  error(`.agents/ directory exists but is not referenced — remove it`);
} else {
  ok('.agents/ not present (correct)');
}

// ---------------------------------------------------------------------------
// 5. Entity registry freshness
// ---------------------------------------------------------------------------
console.log('\n[5] Entity registry freshness');
const registryPath = path.join(CWD, '.aios-core', 'data', 'entity-registry.yaml');
if (fs.existsSync(registryPath)) {
  const stat = fs.statSync(registryPath);
  const ageMs = Date.now() - stat.mtimeMs;
  const ageDays = Math.floor(ageMs / (24 * 60 * 60 * 1000));
  if (ageDays > 30) {
    warn(`entity-registry.yaml is ${ageDays} days old — consider running: npm run generate:manifest`);
  } else {
    ok(`entity-registry.yaml is ${ageDays} days old (threshold: 30d)`);
  }
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log('\n────────────────────────────────────');
if (errors > 0 || warnings > 0) {
  console.log(`Result: ${errors} error(s), ${warnings} warning(s)`);
  if (STRICT || errors > 0) process.exit(1);
} else {
  console.log('Result: all checks passed');
}
