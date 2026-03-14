'use strict';

/**
 * migrate-memory — Migrates existing MEMORY.md files to memory-tracker JSON format
 *
 * AEV-4: Agent Memory Dinâmica
 * L4 — always modifiable
 *
 * Usage:
 *   node packages/memory/migrate-memory.js [--agents-dir <path>] [--dry-run]
 *
 * Idempotent: re-running on already-migrated agents is a no-op (skips existing patterns).
 * Migrated agents retain all patterns from MEMORY.md with observations=1, confidence=0.5, stage=candidate.
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Testability overrides
let _agentsDirOverride = null;
let _memoryTrackerOverride = null;

function getAgentsDir() {
  return _agentsDirOverride || path.join(process.cwd(), '.aios-core', 'development', 'agents');
}

function getMemoryTracker() {
  return _memoryTrackerOverride || require('./memory-tracker');
}

function setAgentsDir(dir) {
  _agentsDirOverride = dir;
}

function setMemoryTracker(tracker) {
  _memoryTrackerOverride = tracker;
}

// ---------------------------------------------------------------------------
// Parse MEMORY.md to extract pattern text
// ---------------------------------------------------------------------------

/**
 * Extract pattern strings from MEMORY.md content.
 * Handles both old format (plain markdown bullets) and skip machine-generated sections.
 * @param {string} content - MEMORY.md file content
 * @returns {string[]} Array of pattern descriptions
 */
function parseMemoryMd(content) {
  const patterns = [];
  const lines = content.split('\n');

  let inPatternSection = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Track which section we're in
    if (trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
      const section = trimmed.replace(/^#+\s*/, '').toLowerCase();
      inPatternSection = (
        section.includes('active patterns') ||
        section.includes('promotion candidates') ||
        section.includes('key patterns') ||
        section.includes('project structure') ||
        section.includes('git rules') ||
        section.includes('common gotchas') ||
        section.includes('story workflow')
      );
      continue;
    }

    if (!inPatternSection) continue;

    // Skip comments, blank lines, headers, and already-processed entries
    if (!trimmed || trimmed.startsWith('<!--') || trimmed.startsWith('#')) continue;
    if (trimmed.startsWith('```')) continue;

    // Capture bullet points (-, *, +) and numbered items
    const bulletMatch = trimmed.match(/^[-*+]\s+(.+)/) || trimmed.match(/^\d+\.\s+(.+)/);
    if (bulletMatch) {
      let text = bulletMatch[1].trim();
      // Strip markdown formatting: **bold**, ~~strikethrough~~, `code`
      text = text.replace(/\*\*(.*?)\*\*/g, '$1');
      text = text.replace(/~~(.*?)~~/g, '$1');
      text = text.replace(/`(.*?)`/g, '$1');
      // Strip inline metadata (| Source: ..., | Detected: ...)
      text = text.replace(/\s*\|.*$/, '');
      // Strip [x] / [ ] checkboxes
      text = text.replace(/^\[.?\]\s*/, '');

      if (text.length > 0 && text.length <= 300) {
        patterns.push(text);
      }
    }
  }

  return patterns;
}

// ---------------------------------------------------------------------------
// Migrate a single agent
// ---------------------------------------------------------------------------

/**
 * Migrate one MEMORY.md to memory-tracker JSON format
 * @param {string} agentId
 * @param {string} memoryMdPath
 * @param {object} options
 * @returns {{ agentId, migrated: number, skipped: number, error?: string }}
 */
function migrateAgent(agentId, memoryMdPath, options = {}) {
  const { dryRun = false } = options;
  const tracker = getMemoryTracker();

  if (!fs.existsSync(memoryMdPath)) {
    return { agentId, migrated: 0, skipped: 0, error: 'MEMORY.md not found' };
  }

  const content = fs.readFileSync(memoryMdPath, 'utf8');
  const patterns = parseMemoryMd(content);

  if (patterns.length === 0) {
    return { agentId, migrated: 0, skipped: 0 };
  }

  // Load existing memory to find already-migrated patterns
  const existing = tracker.getMemory(agentId);
  const existingPatterns = new Set(
    existing.patterns.map(p => p.pattern.trim().toLowerCase())
  );

  let migrated = 0;
  let skipped = 0;

  for (const pattern of patterns) {
    const normalizedPattern = pattern.trim().toLowerCase();

    if (existingPatterns.has(normalizedPattern)) {
      skipped++;
      continue;
    }

    if (!dryRun) {
      // Inject with migrations defaults: observations=1, confidence=0.5, stage=candidate
      const memory = tracker.getMemory(agentId);
      const today = new Date().toISOString().split('T')[0];
      memory.patterns.push({
        id: `migrated-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        pattern,
        stage: 'candidate',
        observations: 1,
        confidence: 0.5,
        first_seen: today,
        last_seen: today,
        examples: [],
        migrated: true
      });
      tracker.writeMemory(agentId, memory);
      existingPatterns.add(normalizedPattern);
    }

    migrated++;
  }

  return { agentId, migrated, skipped };
}

// ---------------------------------------------------------------------------
// Migrate all agents
// ---------------------------------------------------------------------------

/**
 * Migrate all MEMORY.md files found in the agents directory
 * @param {object} options
 * @param {boolean} [options.dryRun=false]
 * @returns {object[]} Array of migration results per agent
 */
function migrateAll(options = {}) {
  const agentsDir = getAgentsDir();

  if (!fs.existsSync(agentsDir)) {
    return [];
  }

  const entries = fs.readdirSync(agentsDir);
  const results = [];

  for (const entry of entries) {
    const entryPath = path.join(agentsDir, entry);
    const stat = fs.statSync(entryPath);

    if (stat.isDirectory()) {
      // Check for MEMORY.md in subdirectory
      const memoryPath = path.join(entryPath, 'MEMORY.md');
      if (fs.existsSync(memoryPath)) {
        const result = migrateAgent(entry, memoryPath, options);
        results.push(result);
      }
    }
  }

  return results;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const agentsDirIdx = args.indexOf('--agents-dir');

  if (agentsDirIdx !== -1) {
    setAgentsDir(args[agentsDirIdx + 1]);
  }

  console.log(`Migrating MEMORY.md files${dryRun ? ' (DRY RUN)' : ''}...`);
  console.log(`Agents dir: ${getAgentsDir()}`);

  const results = migrateAll({ dryRun });

  if (results.length === 0) {
    console.log('No agents found with MEMORY.md');
    process.exit(0);
  }

  let totalMigrated = 0;
  let totalSkipped = 0;

  for (const r of results) {
    if (r.error) {
      console.log(`  [${r.agentId}] ERROR: ${r.error}`);
    } else {
      console.log(`  [${r.agentId}] migrated=${r.migrated} skipped=${r.skipped}`);
      totalMigrated += r.migrated;
      totalSkipped += r.skipped;
    }
  }

  console.log(`\nTotal: ${totalMigrated} patterns migrated, ${totalSkipped} already existed`);
  process.exit(0);
}

module.exports = {
  parseMemoryMd,
  migrateAgent,
  migrateAll,
  setAgentsDir,
  setMemoryTracker
};
