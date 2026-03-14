'use strict';

/**
 * Tests for packages/handoffs/handoff-writer.js
 * Story: AEV-2 — Handoff Artifacts Operacionais
 *
 * Validates: schema, consumed flag, artifact cleanup, last-active-agent tracking.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

describe('handoff-writer', () => {
  let writer;
  let testDir;

  beforeEach(() => {
    // Fresh test directory per test
    testDir = path.join(
      os.tmpdir(),
      'aios-handoffs-' + Date.now() + '-' + Math.random().toString(36).slice(2),
    );
    fs.mkdirSync(testDir, { recursive: true });

    // Use setHandoffsDir to redirect all internal operations to testDir
    jest.resetModules();
    writer = require('../handoff-writer');
    writer.setHandoffsDir(testDir);
  });

  afterEach(() => {
    writer.setHandoffsDir(null); // Reset to default
    try {
      fs.rmSync(testDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore
    }
  });

  function writeTestHandoff(opts) {
    opts = opts || {};
    return writer.writeHandoff({
      from: opts.from || 'dev',
      to: opts.to || 'qa',
      storyId: opts.storyId || 'AEV-2',
      branch: opts.branch || 'feat/epic-aev',
      nextAction: opts.nextAction || 'Executar QA gate',
    });
  }

  // --- writeHandoff ---

  describe('writeHandoff()', () => {
    it('creates a YAML file in handoffs directory', () => {
      const filepath = writeTestHandoff();
      expect(fs.existsSync(filepath)).toBe(true);
    });

    it('filename matches handoff-{from}-to-{to}-{timestamp}.yaml', () => {
      const filepath = writeTestHandoff({ from: 'dev', to: 'qa' });
      const filename = path.basename(filepath);
      expect(filename).toMatch(/^handoff-dev-to-qa-\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.yaml$/);
    });

    it('writes consumed: false', () => {
      const filepath = writeTestHandoff();
      const content = fs.readFileSync(filepath, 'utf8');
      expect(content).toContain('consumed: false');
    });

    it('writes from_agent and to_agent', () => {
      const filepath = writeTestHandoff({ from: 'sm', to: 'dev' });
      const content = fs.readFileSync(filepath, 'utf8');
      expect(content).toContain('from_agent: sm');
      expect(content).toContain('to_agent: dev');
    });

    it('writes story_id', () => {
      const filepath = writeTestHandoff({ storyId: 'AEV-2' });
      const content = fs.readFileSync(filepath, 'utf8');
      expect(content).toContain('story_id: AEV-2');
    });

    it('writes branch', () => {
      const filepath = writeTestHandoff({ branch: 'feat/aev' });
      const content = fs.readFileSync(filepath, 'utf8');
      expect(content).toContain('branch: feat/aev');
    });

    it('limits decisions to max 5', () => {
      const filepath = writer.writeHandoff({
        from: 'dev', to: 'qa',
        decisions: ['d1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7'],
      });
      const content = fs.readFileSync(filepath, 'utf8');
      const matches = content.match(/- d\d/g) || [];
      expect(matches.length).toBeLessThanOrEqual(5);
    });

    it('limits files_modified to max 10', () => {
      const files = Array.from({ length: 15 }, function(_, i) { return 'file' + i + '.js'; });
      const filepath = writer.writeHandoff({ from: 'dev', to: 'qa', filesModified: files });
      const content = fs.readFileSync(filepath, 'utf8');
      const fileMatches = content.match(/- file\d+/g) || [];
      expect(fileMatches.length).toBeLessThanOrEqual(10);
    });

    it('limits blockers to max 3', () => {
      const filepath = writer.writeHandoff({
        from: 'dev', to: 'qa',
        blockers: ['b1', 'b2', 'b3', 'b4', 'b5'],
      });
      const content = fs.readFileSync(filepath, 'utf8');
      const blockerMatches = content.match(/- b\d/g) || [];
      expect(blockerMatches.length).toBeLessThanOrEqual(3);
    });

    it('throws if from is missing', () => {
      expect(function() { writer.writeHandoff({ to: 'qa' }); }).toThrow(/from/);
    });

    it('throws if to is missing', () => {
      expect(function() { writer.writeHandoff({ from: 'dev' }); }).toThrow(/to/);
    });

    it('updates last-active-agent.json with incoming agent', () => {
      writeTestHandoff({ to: 'qa' });
      const lastActivePath = path.join(testDir, 'last-active-agent.json');
      expect(fs.existsSync(lastActivePath)).toBe(true);
      const data = JSON.parse(fs.readFileSync(lastActivePath, 'utf8'));
      expect(data.agent_id).toBe('qa');
    });

    it('prunes artifacts beyond MAX_ARTIFACTS (keeps max 3)', function() {
      // Write 4 artifacts with unique timestamps
      for (let i = 0; i < 4; i++) {
        writer.writeHandoff({ from: 'dev', to: 'agent' + i });
      }
      const files = fs.readdirSync(testDir).filter(function(f) { return f.startsWith('handoff-'); });
      expect(files.length).toBeLessThanOrEqual(writer.MAX_ARTIFACTS);
    });
  });

  // --- readLatestHandoff ---

  describe('readLatestHandoff()', () => {
    it('returns null when no handoffs exist', () => {
      expect(writer.readLatestHandoff()).toBeNull();
    });

    it('returns latest unconsumed handoff', () => {
      writeTestHandoff({ from: 'dev', to: 'qa' });
      const result = writer.readLatestHandoff();
      expect(result).not.toBeNull();
      expect(result.from_agent).toBe('dev');
      expect(result.to_agent).toBe('qa');
    });

    it('returns null when all handoffs are consumed', () => {
      const filepath = writeTestHandoff();
      writer.markConsumed(filepath);
      expect(writer.readLatestHandoff()).toBeNull();
    });

    it('returns _filepath for the file location', () => {
      const filepath = writeTestHandoff();
      const result = writer.readLatestHandoff();
      expect(result._filepath).toBe(filepath);
    });

    it('skips consumed artifacts and returns next unconsumed', () => {
      writeTestHandoff({ from: 'dev', to: 'qa' });
      // Small delay to ensure different timestamps
      const fp2 = writeTestHandoff({ from: 'qa', to: 'architect' });
      writer.markConsumed(fp2); // consume the newer one
      const result = writer.readLatestHandoff();
      // fp1 should still be unconsumed
      expect(result).not.toBeNull();
      expect(result.from_agent).toBe('dev');
    });
  });

  // --- markConsumed ---

  describe('markConsumed()', () => {
    it('sets consumed: true in the file', () => {
      const filepath = writeTestHandoff();
      const ok = writer.markConsumed(filepath);
      expect(ok).toBe(true);
      const content = fs.readFileSync(filepath, 'utf8');
      expect(content).toContain('consumed: true');
      expect(content).not.toContain('consumed: false');
    });

    it('returns false if file does not exist', () => {
      expect(writer.markConsumed('/non/existent/file.yaml')).toBe(false);
    });

    it('after markConsumed, readLatestHandoff returns null', () => {
      const filepath = writeTestHandoff();
      writer.markConsumed(filepath);
      expect(writer.readLatestHandoff()).toBeNull();
    });
  });

  // --- setActiveAgent / readLastActiveAgent ---

  describe('setActiveAgent() and readLastActiveAgent()', () => {
    it('writes and reads agent_id correctly', () => {
      writer.setActiveAgent('architect');
      const data = writer.readLastActiveAgent();
      expect(data).not.toBeNull();
      expect(data.agent_id).toBe('architect');
    });

    it('includes activated_at ISO timestamp', () => {
      writer.setActiveAgent('pm');
      const data = writer.readLastActiveAgent();
      expect(new Date(data.activated_at).toISOString()).toBe(data.activated_at);
    });

    it('returns null when last-active-agent.json does not exist', () => {
      expect(writer.readLastActiveAgent()).toBeNull();
    });
  });

  // --- listHandoffFiles ---

  describe('listHandoffFiles()', () => {
    it('returns empty array when directory is empty', () => {
      expect(writer.listHandoffFiles()).toEqual([]);
    });

    it('lists handoff yaml files only', () => {
      writeTestHandoff({ from: 'dev', to: 'qa' });
      // Also create a non-handoff file
      fs.writeFileSync(path.join(testDir, 'not-a-handoff.txt'), 'test');
      const files = writer.listHandoffFiles();
      expect(files.every(function(f) { return path.basename(f).startsWith('handoff-') && f.endsWith('.yaml'); })).toBe(true);
    });
  });

  // --- Schema validation ---

  describe('YAML schema completeness', () => {
    it('written file contains all required schema fields', () => {
      const filepath = writer.writeHandoff({
        from: 'dev',
        to: 'qa',
        storyId: 'AEV-2',
        storyPath: 'docs/stories/epics/epic-aev/story-AEV-2.md',
        storyStatus: 'In Progress',
        currentTask: 'AC2 implementation',
        branch: 'feat/epic-aev',
        decisions: ['Used CommonJS', 'CLI via Bash'],
        filesModified: ['packages/handoffs/handoff-writer.js'],
        blockers: [],
        nextAction: 'Run QA gate on AEV-2',
      });

      const content = fs.readFileSync(filepath, 'utf8');
      expect(content).toContain('from_agent:');
      expect(content).toContain('to_agent:');
      expect(content).toContain('timestamp:');
      expect(content).toContain('consumed:');
      expect(content).toContain('story_context:');
      expect(content).toContain('story_id:');
      expect(content).toContain('branch:');
      expect(content).toContain('decisions:');
      expect(content).toContain('files_modified:');
      expect(content).toContain('blockers:');
      expect(content).toContain('next_action:');
    });
  });
});
