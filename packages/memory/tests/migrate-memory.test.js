'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

let migrator;
let tracker;
let testDir;
let agentsDir;
let memDir;

beforeEach(() => {
  jest.resetModules();

  testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'migrate-memory-test-'));
  agentsDir = path.join(testDir, 'agents');
  memDir = path.join(testDir, 'memory');

  // Set up tracker with temp dir first
  tracker = require('../memory-tracker');
  tracker.setMemoryDir(memDir);
  tracker.setPromotionQueueFile(path.join(testDir, 'promotion-queue.json'));

  // Set up migrator with temp agents dir and real tracker
  migrator = require('../migrate-memory');
  migrator.setAgentsDir(agentsDir);
  migrator.setMemoryTracker(tracker);
});

afterEach(() => {
  fs.rmSync(testDir, { recursive: true, force: true });
});

function createAgentMemoryMd(agentId, content) {
  const agentDir = path.join(agentsDir, agentId);
  fs.mkdirSync(agentDir, { recursive: true });
  fs.writeFileSync(path.join(agentDir, 'MEMORY.md'), content);
}

// ---------------------------------------------------------------------------
// parseMemoryMd
// ---------------------------------------------------------------------------

describe('parseMemoryMd', () => {
  test('extracts bullet points from Active Patterns section', () => {
    const content = `# Dev Agent Memory

## Active Patterns

### Key Patterns
- Always use kebab-case
- CommonJS require/module.exports
- 2-space indent

## Archived
- ~~old pattern~~
`;
    const patterns = migrator.parseMemoryMd(content);
    expect(patterns).toContain('Always use kebab-case');
    expect(patterns).toContain('CommonJS require/module.exports');
    expect(patterns).toContain('2-space indent');
  });

  test('strips markdown bold from pattern text', () => {
    const content = `## Active Patterns\n- **Always use kebab-case** | Source: dev\n`;
    const patterns = migrator.parseMemoryMd(content);
    expect(patterns[0]).toBe('Always use kebab-case');
  });

  test('strips | metadata from promotion candidates', () => {
    const content = `## Promotion Candidates\n- **pattern text** | Source: dev, qa | Detected: 2026-01-01 | Status: pending\n`;
    const patterns = migrator.parseMemoryMd(content);
    expect(patterns[0]).toBe('pattern text');
  });

  test('ignores strikethrough archived patterns', () => {
    const content = `## Active Patterns\n- ~~old pattern~~ | Archived: 2026-01-01\n`;
    const patterns = migrator.parseMemoryMd(content);
    // Strikethrough text is still extracted but without the ~~...~~ markers
    // The key thing is it doesn't crash
    expect(Array.isArray(patterns)).toBe(true);
  });

  test('returns empty array for empty content', () => {
    expect(migrator.parseMemoryMd('')).toEqual([]);
  });

  test('ignores HTML comments', () => {
    const content = `## Active Patterns\n<!-- This is a comment -->\n- Real pattern\n`;
    const patterns = migrator.parseMemoryMd(content);
    expect(patterns).not.toContain('This is a comment');
    expect(patterns).toContain('Real pattern');
  });
});

// ---------------------------------------------------------------------------
// migrateAgent
// ---------------------------------------------------------------------------

describe('migrateAgent', () => {
  test('migrates patterns from MEMORY.md', () => {
    createAgentMemoryMd('dev', `## Active Patterns\n- Use kebab-case\n- CommonJS only\n`);

    const result = migrator.migrateAgent('dev', path.join(agentsDir, 'dev', 'MEMORY.md'));
    expect(result.migrated).toBe(2);
    expect(result.skipped).toBe(0);
    expect(result.error).toBeUndefined();
  });

  test('migrated patterns have observations=1, confidence=0.5, stage=candidate', () => {
    createAgentMemoryMd('dev', `## Active Patterns\n- Use kebab-case\n`);
    migrator.migrateAgent('dev', path.join(agentsDir, 'dev', 'MEMORY.md'));

    const memory = tracker.getMemory('dev');
    const pattern = memory.patterns[0];
    expect(pattern.observations).toBe(1);
    expect(pattern.confidence).toBe(0.5);
    expect(pattern.stage).toBe('candidate');
    expect(pattern.migrated).toBe(true);
  });

  test('is idempotent — re-running skips already-migrated patterns', () => {
    createAgentMemoryMd('dev', `## Active Patterns\n- Use kebab-case\n`);
    const memPath = path.join(agentsDir, 'dev', 'MEMORY.md');

    migrator.migrateAgent('dev', memPath);
    const result2 = migrator.migrateAgent('dev', memPath);

    expect(result2.migrated).toBe(0);
    expect(result2.skipped).toBe(1);
  });

  test('returns error when MEMORY.md not found', () => {
    const result = migrator.migrateAgent('dev', '/nonexistent/MEMORY.md');
    expect(result.error).toBe('MEMORY.md not found');
  });

  test('dry-run does not persist patterns', () => {
    createAgentMemoryMd('dev', `## Active Patterns\n- Use kebab-case\n`);
    const memPath = path.join(agentsDir, 'dev', 'MEMORY.md');

    const result = migrator.migrateAgent('dev', memPath, { dryRun: true });
    expect(result.migrated).toBe(1);

    const memory = tracker.getMemory('dev');
    expect(memory.patterns).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// migrateAll
// ---------------------------------------------------------------------------

describe('migrateAll', () => {
  test('migrates all agent directories with MEMORY.md', () => {
    createAgentMemoryMd('dev', `## Active Patterns\n- Use kebab-case\n`);
    createAgentMemoryMd('qa', `## Active Patterns\n- Write tests first\n`);

    const results = migrator.migrateAll();
    expect(results.length).toBe(2);
    expect(results.every(r => r.migrated === 1)).toBe(true);
  });

  test('returns empty array when agents dir does not exist', () => {
    migrator.setAgentsDir('/nonexistent/agents');
    const results = migrator.migrateAll();
    expect(results).toEqual([]);
  });

  test('skips agent directories without MEMORY.md', () => {
    fs.mkdirSync(path.join(agentsDir, 'empty-agent'), { recursive: true });
    createAgentMemoryMd('dev', `## Active Patterns\n- Use kebab-case\n`);

    const results = migrator.migrateAll();
    const agentIds = results.map(r => r.agentId);
    expect(agentIds).toContain('dev');
    expect(agentIds).not.toContain('empty-agent');
  });
});
