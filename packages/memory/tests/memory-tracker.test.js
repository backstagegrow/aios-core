'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

let tracker;
let testDir;
let memDir;
let queueFile;

beforeEach(() => {
  jest.resetModules();
  tracker = require('../memory-tracker');

  testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'memory-tracker-test-'));
  memDir = path.join(testDir, 'memory');
  queueFile = path.join(testDir, 'promotion-queue.json');

  tracker.setMemoryDir(memDir);
  tracker.setPromotionQueueFile(queueFile);
  tracker.setNow(null);
  tracker.setThresholds(null);
});

afterEach(() => {
  fs.rmSync(testDir, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// computeRecencyWeight
// ---------------------------------------------------------------------------

describe('computeRecencyWeight', () => {
  test('returns 1.0 for date today', () => {
    const now = new Date('2026-03-14');
    expect(tracker.computeRecencyWeight('2026-03-14', now)).toBe(1.0);
  });

  test('returns 1.0 for 7 days ago', () => {
    const now = new Date('2026-03-14');
    expect(tracker.computeRecencyWeight('2026-03-07', now)).toBeCloseTo(1.0, 2);
  });

  test('returns ~0.5 for 30 days ago', () => {
    const now = new Date('2026-03-14');
    expect(tracker.computeRecencyWeight('2026-02-12', now)).toBeCloseTo(0.5, 1);
  });

  test('returns 0.2 for 90+ days ago', () => {
    const now = new Date('2026-03-14');
    expect(tracker.computeRecencyWeight('2025-12-14', now)).toBe(0.2);
  });

  test('is between 0.5 and 1.0 for 7-30 days', () => {
    const now = new Date('2026-03-14');
    const w = tracker.computeRecencyWeight('2026-03-01', now); // 13 days ago
    expect(w).toBeGreaterThan(0.5);
    expect(w).toBeLessThan(1.0);
  });
});

// ---------------------------------------------------------------------------
// computeConfidence
// ---------------------------------------------------------------------------

describe('computeConfidence', () => {
  test('recent observation: conf = obs/10 for obs <= 10', () => {
    const now = new Date('2026-03-14');
    // 5 obs, today → base 0.5, recency 1.0
    expect(tracker.computeConfidence(5, '2026-03-14', now)).toBeCloseTo(0.5, 2);
  });

  test('caps at 1.0 for obs >= 10', () => {
    const now = new Date('2026-03-14');
    expect(tracker.computeConfidence(15, '2026-03-14', now)).toBe(1.0);
  });

  test('old observation reduces confidence', () => {
    const now = new Date('2026-03-14');
    const conf100days = tracker.computeConfidence(10, '2025-12-05', now);
    // recency 0.2 → conf = 1.0 * 0.2 = 0.2
    expect(conf100days).toBeCloseTo(0.2, 1);
  });

  test('never goes below 0', () => {
    const now = new Date('2026-03-14');
    expect(tracker.computeConfidence(0, '2026-03-14', now)).toBeGreaterThanOrEqual(0);
  });

  test('never exceeds 1.0', () => {
    const now = new Date('2026-03-14');
    expect(tracker.computeConfidence(100, '2026-03-14', now)).toBeLessThanOrEqual(1.0);
  });
});

// ---------------------------------------------------------------------------
// determineStage
// ---------------------------------------------------------------------------

describe('determineStage', () => {
  const t = {
    candidate: { observations: 3, confidence: 0.6 },
    active: { observations: 5, confidence: 0.8 },
    constitutional: { observations: 10, confidence: 0.95 }
  };

  test('observed when below candidate thresholds', () => {
    expect(tracker.determineStage(2, 0.5, 'observed', t)).toBe('observed');
  });

  test('candidate when obs>=3 and conf>=0.6', () => {
    expect(tracker.determineStage(3, 0.6, 'observed', t)).toBe('candidate');
  });

  test('active when obs>=5 and conf>=0.8', () => {
    expect(tracker.determineStage(5, 0.8, 'observed', t)).toBe('active');
  });

  test('constitutional when obs>=10 and conf>=0.95', () => {
    expect(tracker.determineStage(10, 0.95, 'observed', t)).toBe('constitutional');
  });

  test('never downgrades from active', () => {
    // Even with low observations, stays active
    expect(tracker.determineStage(1, 0.1, 'active', t)).toBe('active');
  });

  test('never downgrades from constitutional', () => {
    expect(tracker.determineStage(1, 0.1, 'constitutional', t)).toBe('constitutional');
  });

  test('archived stays archived', () => {
    expect(tracker.determineStage(10, 0.99, 'archived', t)).toBe('archived');
  });

  test('candidate never downgrades to observed', () => {
    expect(tracker.determineStage(1, 0.1, 'candidate', t)).toBe('candidate');
  });
});

// ---------------------------------------------------------------------------
// recordObservation
// ---------------------------------------------------------------------------

describe('recordObservation', () => {
  test('creates new pattern on first observation', () => {
    tracker.setNow('2026-03-14');
    const result = tracker.recordObservation('dev', 'Always use kebab-case', 'story.md');
    expect(result.pattern).toBe('Always use kebab-case');
    expect(result.observations).toBe(1);
    expect(result.stage).toBe('observed');
    expect(result.examples).toContain('story.md');
  });

  test('increments counter on second observation', () => {
    tracker.setNow('2026-03-14');
    tracker.recordObservation('dev', 'Always use kebab-case');
    const result = tracker.recordObservation('dev', 'Always use kebab-case');
    expect(result.observations).toBe(2);
  });

  test('match is case-insensitive', () => {
    tracker.setNow('2026-03-14');
    tracker.recordObservation('dev', 'Always use kebab-case');
    const result = tracker.recordObservation('dev', 'ALWAYS USE KEBAB-CASE');
    expect(result.observations).toBe(2);
  });

  test('transitions to candidate at obs=3', () => {
    tracker.setNow('2026-03-14');
    tracker.setThresholds({
      candidate: { observations: 3, confidence: 0.0 },
      active: { observations: 5, confidence: 0.0 },
      constitutional: { observations: 10, confidence: 0.0 }
    });
    tracker.recordObservation('dev', 'pattern');
    tracker.recordObservation('dev', 'pattern');
    const result = tracker.recordObservation('dev', 'pattern');
    expect(result.stage).toBe('candidate');
  });

  test('transitions to constitutional and queues promotion', () => {
    tracker.setNow('2026-03-14');
    tracker.setThresholds({
      candidate: { observations: 1, confidence: 0.0 },
      active: { observations: 2, confidence: 0.0 },
      constitutional: { observations: 3, confidence: 0.0 }
    });
    tracker.recordObservation('dev', 'big pattern');
    tracker.recordObservation('dev', 'big pattern');
    const result = tracker.recordObservation('dev', 'big pattern');
    expect(result.stage).toBe('constitutional');

    // Check promotion queue
    const queue = tracker.getPromotionQueue();
    expect(queue.pending.length).toBeGreaterThan(0);
    expect(queue.pending[0].pattern).toBe('big pattern');
  });

  test('does not add duplicate to promotion queue', () => {
    tracker.setNow('2026-03-14');
    tracker.setThresholds({
      candidate: { observations: 1, confidence: 0.0 },
      active: { observations: 1, confidence: 0.0 },
      constitutional: { observations: 2, confidence: 0.0 }
    });
    tracker.recordObservation('dev', 'pattern');
    tracker.recordObservation('dev', 'pattern');
    tracker.recordObservation('dev', 'pattern'); // 3rd time — already constitutional
    const queue = tracker.getPromotionQueue();
    expect(queue.pending.length).toBe(1);
  });

  test('caps examples at 5', () => {
    tracker.setNow('2026-03-14');
    for (let i = 0; i < 7; i++) {
      tracker.recordObservation('dev', 'pattern', `example-${i}.js`);
    }
    const memory = tracker.getMemory('dev');
    expect(memory.patterns[0].examples.length).toBeLessThanOrEqual(5);
  });

  test('deduplicates examples', () => {
    tracker.setNow('2026-03-14');
    tracker.recordObservation('dev', 'pattern', 'same-file.js');
    tracker.recordObservation('dev', 'pattern', 'same-file.js');
    const memory = tracker.getMemory('dev');
    const exs = memory.patterns[0].examples.filter(e => e === 'same-file.js');
    expect(exs.length).toBe(1);
  });

  test('throws for missing agentId', () => {
    expect(() => tracker.recordObservation('', 'pattern')).toThrow('agentId and patternDescription are required');
  });

  test('throws for missing pattern', () => {
    expect(() => tracker.recordObservation('dev', '')).toThrow('agentId and patternDescription are required');
  });

  test('persists to disk', () => {
    tracker.setNow('2026-03-14');
    tracker.recordObservation('dev', 'Persist test');
    const memory = tracker.getMemory('dev');
    expect(memory.patterns.length).toBe(1);
    expect(memory.patterns[0].pattern).toBe('Persist test');
  });
});

// ---------------------------------------------------------------------------
// getMemory / writeMemory
// ---------------------------------------------------------------------------

describe('getMemory', () => {
  test('returns empty structure for unknown agent', () => {
    const mem = tracker.getMemory('unknown');
    expect(mem.agentId).toBe('unknown');
    expect(mem.patterns).toEqual([]);
  });
});

describe('writeMemory', () => {
  test('overwrites existing memory', () => {
    tracker.setNow('2026-03-14');
    tracker.recordObservation('dev', 'Old pattern');
    tracker.writeMemory('dev', { agentId: 'dev', patterns: [] });
    const mem = tracker.getMemory('dev');
    expect(mem.patterns).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// getCandidatesForPromotion
// ---------------------------------------------------------------------------

describe('getCandidatesForPromotion', () => {
  test('returns only constitutional patterns', () => {
    tracker.setNow('2026-03-14');
    tracker.setThresholds({
      candidate: { observations: 1, confidence: 0.0 },
      active: { observations: 2, confidence: 0.0 },
      constitutional: { observations: 3, confidence: 0.0 }
    });
    tracker.recordObservation('dev', 'pattern A');
    tracker.recordObservation('dev', 'pattern A');
    tracker.recordObservation('dev', 'pattern A'); // constitutional

    tracker.recordObservation('dev', 'pattern B'); // observed only

    const candidates = tracker.getCandidatesForPromotion('dev');
    expect(candidates.length).toBe(1);
    expect(candidates[0].pattern).toBe('pattern A');
  });
});

// ---------------------------------------------------------------------------
// archivePattern
// ---------------------------------------------------------------------------

describe('archivePattern', () => {
  test('archives an existing pattern', () => {
    tracker.setNow('2026-03-14');
    tracker.recordObservation('dev', 'Archivable');
    const memory = tracker.getMemory('dev');
    const id = memory.patterns[0].id;

    const result = tracker.archivePattern('dev', id, 'no longer relevant');
    expect(result.stage).toBe('archived');
    expect(result.archive_reason).toBe('no longer relevant');
    expect(result.archived_at).toBeDefined();
  });

  test('returns null for unknown patternId', () => {
    const result = tracker.archivePattern('dev', 'nonexistent-id', 'test');
    expect(result).toBeNull();
  });

  test('archived pattern stays archived after more observations', () => {
    tracker.setNow('2026-03-14');
    tracker.setThresholds({
      candidate: { observations: 1, confidence: 0.0 },
      active: { observations: 2, confidence: 0.0 },
      constitutional: { observations: 3, confidence: 0.0 }
    });
    tracker.recordObservation('dev', 'pattern');
    const memory = tracker.getMemory('dev');
    const id = memory.patterns[0].id;
    tracker.archivePattern('dev', id, 'test');

    // More observations should not un-archive
    tracker.recordObservation('dev', 'PATTERN');
    const updated = tracker.getMemory('dev');
    expect(updated.patterns[0].stage).toBe('archived');
  });
});
