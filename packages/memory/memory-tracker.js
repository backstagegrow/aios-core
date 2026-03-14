'use strict';

/**
 * memory-tracker — Tracks agent pattern observations with confidence scoring
 *
 * AEV-4: Agent Memory Dinâmica com Auto-Promoção
 * L4 — always modifiable
 *
 * Storage:
 *   - Structured data: .aios/memory/{agentId}.json (gitignored, machine-readable)
 *   - Promotion queue: .aios/promotion-queue.json (gitignored)
 *   - Human-readable: .aios-core/development/agents/{id}/MEMORY.md (L3, never auto-written)
 *
 * Calling Convention:
 *   Agents call manually via CLI when they observe a pattern during execution:
 *   node packages/memory/memory-tracker.js record --agent dev --pattern "..." --example "file.js"
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Testability overrides
// ---------------------------------------------------------------------------

let _memoryDirOverride = null;
let _promotionQueueFileOverride = null;
let _nowOverride = null; // For deterministic date testing

function getMemoryDir() {
  return _memoryDirOverride || path.join(process.cwd(), '.aios', 'memory');
}

function getPromotionQueueFile() {
  return _promotionQueueFileOverride || path.join(process.cwd(), '.aios', 'promotion-queue.json');
}

function setMemoryDir(dir) {
  _memoryDirOverride = dir;
}

function setPromotionQueueFile(file) {
  _promotionQueueFileOverride = file;
}

function setNow(dateOrNull) {
  _nowOverride = dateOrNull;
}

function getNow() {
  return _nowOverride ? new Date(_nowOverride) : new Date();
}

// ---------------------------------------------------------------------------
// Thresholds (can be overridden for testing)
// ---------------------------------------------------------------------------

const DEFAULT_THRESHOLDS = {
  candidate: { observations: 3, confidence: 0.6 },
  active: { observations: 5, confidence: 0.8 },
  constitutional: { observations: 10, confidence: 0.95 }
};

let _thresholdsOverride = null;

function getThresholds() {
  return _thresholdsOverride || DEFAULT_THRESHOLDS;
}

function setThresholds(t) {
  _thresholdsOverride = t;
}

// ---------------------------------------------------------------------------
// Stages (ordered lowest → highest)
// ---------------------------------------------------------------------------

const STAGES = ['observed', 'candidate', 'active', 'constitutional', 'archived'];

// ---------------------------------------------------------------------------
// Confidence formula
// ---------------------------------------------------------------------------

/**
 * Compute recency weight based on days since last_seen
 * 0-7 days: 1.0
 * 7-30 days: linear 1.0→0.5
 * 30-90 days: linear 0.5→0.2
 * >90 days: 0.2
 */
function computeRecencyWeight(lastSeenDate, now) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSince = (now.getTime() - new Date(lastSeenDate).getTime()) / msPerDay;

  if (daysSince <= 7) return 1.0;
  if (daysSince <= 30) {
    // Linear from 1.0 to 0.5 over 7→30 days
    return 1.0 - (0.5 * (daysSince - 7) / 23);
  }
  if (daysSince <= 90) {
    // Linear from 0.5 to 0.2 over 30→90 days
    return 0.5 - (0.3 * (daysSince - 30) / 60);
  }
  return 0.2;
}

/**
 * Compute confidence score
 * Formula: min(observations / 10, 1.0) * recency_weight
 * Result clamped to [0.0, 1.0]
 */
function computeConfidence(observations, lastSeenDate, now) {
  const base = Math.min(observations / 10, 1.0);
  const recency = computeRecencyWeight(lastSeenDate, now);
  return Math.min(Math.max(parseFloat((base * recency).toFixed(4)), 0.0), 1.0);
}

/**
 * Determine stage from observations + confidence (never downgrade from current stage)
 * Stage only moves forward: observed → candidate → active → constitutional
 */
function determineStage(observations, confidence, currentStage, thresholds) {
  const t = thresholds || getThresholds();

  // archived is terminal
  if (currentStage === 'archived') return 'archived';

  // Constitutional: highest (never downgrade from constitutional)
  if (
    currentStage === 'constitutional' ||
    (observations >= t.constitutional.observations && confidence >= t.constitutional.confidence)
  ) {
    return 'constitutional';
  }

  // Active: never downgrade from active
  if (
    currentStage === 'active' ||
    (observations >= t.active.observations && confidence >= t.active.confidence)
  ) {
    return 'active';
  }

  // Candidate: never downgrade from candidate
  if (
    currentStage === 'candidate' ||
    (observations >= t.candidate.observations && confidence >= t.candidate.confidence)
  ) {
    return 'candidate';
  }

  return 'observed';
}

// ---------------------------------------------------------------------------
// Storage helpers
// ---------------------------------------------------------------------------

function getAgentDataFile(agentId) {
  return path.join(getMemoryDir(), `${agentId}.json`);
}

function loadAgentMemory(agentId) {
  const file = getAgentDataFile(agentId);
  if (!fs.existsSync(file)) {
    return { agentId, patterns: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return { agentId, patterns: [] };
  }
}

function saveAgentMemory(agentId, data) {
  const dir = getMemoryDir();
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const file = getAgentDataFile(agentId);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ---------------------------------------------------------------------------
// Core API
// ---------------------------------------------------------------------------

/**
 * Record an observation of a pattern for an agent.
 * Creates pattern if new, increments counter, recalculates confidence, updates stage.
 *
 * @param {string} agentId
 * @param {string} patternDescription
 * @param {string} [example] - Optional filename or context example
 * @returns {object} Updated pattern entry
 */
function recordObservation(agentId, patternDescription, example) {
  if (!agentId || !patternDescription) {
    throw new Error('agentId and patternDescription are required');
  }

  const now = getNow();
  const todayStr = now.toISOString().split('T')[0];
  const memoryData = loadAgentMemory(agentId);

  // Find existing pattern by description (case-insensitive match)
  const normalizedDesc = patternDescription.trim().toLowerCase();
  let pattern = memoryData.patterns.find(
    p => p.pattern.trim().toLowerCase() === normalizedDesc
  );

  if (!pattern) {
    // New pattern
    pattern = {
      id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      pattern: patternDescription.trim(),
      stage: 'observed',
      observations: 0,
      confidence: 0,
      first_seen: todayStr,
      last_seen: todayStr,
      examples: []
    };
    memoryData.patterns.push(pattern);
  }

  // Increment
  pattern.observations += 1;
  pattern.last_seen = todayStr;

  // Add example (deduplicate, max 5)
  if (example) {
    const trimmed = example.trim();
    if (!pattern.examples.includes(trimmed)) {
      pattern.examples.push(trimmed);
      if (pattern.examples.length > 5) pattern.examples.shift();
    }
  }

  // Recalculate confidence
  pattern.confidence = computeConfidence(pattern.observations, pattern.last_seen, now);

  // Stage transition (never downgrade)
  pattern.stage = determineStage(pattern.observations, pattern.confidence, pattern.stage);

  saveAgentMemory(agentId, memoryData);

  // If constitutional, add to promotion queue
  if (pattern.stage === 'constitutional') {
    _addToPromotionQueue(agentId, pattern);
  }

  return { ...pattern };
}

/**
 * Get structured memory data for an agent
 * @param {string} agentId
 * @returns {{ agentId: string, patterns: object[] }}
 */
function getMemory(agentId) {
  return loadAgentMemory(agentId);
}

/**
 * Write (replace) full memory data for an agent
 * @param {string} agentId
 * @param {object} memoryData
 */
function writeMemory(agentId, memoryData) {
  saveAgentMemory(agentId, memoryData);
}

/**
 * Get patterns that are ready for promotion to CLAUDE.md
 * @param {string} agentId
 * @returns {object[]}
 */
function getCandidatesForPromotion(agentId) {
  const memory = loadAgentMemory(agentId);
  return memory.patterns.filter(p => p.stage === 'constitutional');
}

/**
 * Archive a pattern (terminal state — no further promotion)
 * @param {string} agentId
 * @param {string} patternId
 * @param {string} reason
 * @returns {object|null} Archived pattern or null if not found
 */
function archivePattern(agentId, patternId, reason) {
  const memory = loadAgentMemory(agentId);
  const pattern = memory.patterns.find(p => p.id === patternId);
  if (!pattern) return null;

  pattern.stage = 'archived';
  pattern.archived_at = getNow().toISOString().split('T')[0];
  pattern.archive_reason = reason || 'manual';

  saveAgentMemory(agentId, memory);
  return { ...pattern };
}

// ---------------------------------------------------------------------------
// Promotion queue
// ---------------------------------------------------------------------------

function loadPromotionQueue() {
  const file = getPromotionQueueFile();
  if (!fs.existsSync(file)) return { pending: [] };
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return { pending: [] };
  }
}

function savePromotionQueue(queue) {
  const file = getPromotionQueueFile();
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(queue, null, 2));
}

function _addToPromotionQueue(agentId, pattern) {
  const queue = loadPromotionQueue();
  // Avoid duplicates
  const exists = queue.pending.find(
    p => p.pattern_id === pattern.id && p.agent_id === agentId
  );
  if (exists) return;

  queue.pending.push({
    agent_id: agentId,
    pattern_id: pattern.id,
    pattern: pattern.pattern,
    confidence: pattern.confidence,
    observations: pattern.observations,
    suggested_section: 'Padrões de Código', // Default — human curates before promoting
    queued_at: getNow().toISOString()
  });

  savePromotionQueue(queue);
}

function getPromotionQueue() {
  return loadPromotionQueue();
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (cmd === 'record') {
    const agentIdx = args.indexOf('--agent');
    const patternIdx = args.indexOf('--pattern');
    const exampleIdx = args.indexOf('--example');

    if (agentIdx === -1 || patternIdx === -1) {
      console.error('Usage: memory-tracker record --agent <id> --pattern "<desc>" [--example "<file>"]');
      process.exit(1);
    }

    const agentId = args[agentIdx + 1];
    const pattern = args[patternIdx + 1];
    const example = exampleIdx !== -1 ? args[exampleIdx + 1] : undefined;

    try {
      const result = recordObservation(agentId, pattern, example);
      console.log(`[record] agent=${agentId} stage=${result.stage} observations=${result.observations} confidence=${result.confidence}`);
      if (result.stage === 'constitutional') {
        console.log(`[record] Pattern queued for CLAUDE.md promotion!`);
      }
    } catch (err) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
    process.exit(0);
  }

  if (cmd === 'status') {
    const agentId = args[1];
    if (!agentId) {
      console.error('Usage: memory-tracker status <agentId>');
      process.exit(1);
    }

    const memory = getMemory(agentId);
    console.log(`Agent: ${agentId} — ${memory.patterns.length} patterns`);
    memory.patterns.forEach(p => {
      console.log(`  [${p.stage}] ${p.pattern} (obs=${p.observations}, conf=${p.confidence})`);
    });
    process.exit(0);
  }

  if (cmd === 'promotion-queue') {
    const queue = getPromotionQueue();
    if (queue.pending.length === 0) {
      console.log('No patterns pending promotion');
    } else {
      console.log(`Patterns pending promotion to CLAUDE.md (${queue.pending.length}):`);
      queue.pending.forEach(p => {
        console.log(`  [${p.agent_id}] "${p.pattern}" — conf=${p.confidence} obs=${p.observations}`);
      });
    }
    process.exit(0);
  }

  if (cmd === 'archive') {
    const agentIdx = args.indexOf('--agent');
    const idIdx = args.indexOf('--id');
    const reasonIdx = args.indexOf('--reason');

    if (agentIdx === -1 || idIdx === -1) {
      console.error('Usage: memory-tracker archive --agent <agentId> --id <patternId> [--reason "<reason>"]');
      process.exit(1);
    }

    const agentId = args[agentIdx + 1];
    const patternId = args[idIdx + 1];
    const reason = reasonIdx !== -1 ? args[reasonIdx + 1] : 'manual';

    const result = archivePattern(agentId, patternId, reason);
    if (!result) {
      console.error(`Pattern not found: ${patternId}`);
      process.exit(1);
    }
    console.log(`[archive] Pattern archived: "${result.pattern}"`);
    process.exit(0);
  }

  console.error(`Unknown command: ${cmd || '(none)'}`);
  console.error('Commands: record, status, promotion-queue, archive');
  process.exit(1);
}

module.exports = {
  recordObservation,
  getMemory,
  writeMemory,
  getCandidatesForPromotion,
  archivePattern,
  getPromotionQueue,
  computeConfidence,
  computeRecencyWeight,
  determineStage,
  setMemoryDir,
  setPromotionQueueFile,
  setNow,
  setThresholds,
  DEFAULT_THRESHOLDS,
  STAGES
};
