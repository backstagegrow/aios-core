/**
 * Unit Tests: Doctor Orchestrator
 * Story INS-4.1: aios doctor rewrite
 *
 * Tests for options forwarding, output format, and fix/dry-run behavior.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');

jest.mock('../../../../../.aios-core/core/doctor/fix-handler', () => ({
  applyFixes: jest.fn(async (results, context) => {
    const applied = context.options.dryRun ? false : !!context.options.fix;
    return results
      .filter((r) => r.status === 'WARN' || r.status === 'FAIL')
      .map((r) => ({
        check: r.check,
        applied,
        message: applied ? 'Applied mock fix' : 'Dry run mock fix',
      }));
  }),
}));

const { runDoctorChecks, DOCTOR_VERSION } = require('../../../../../.aios-core/core/doctor');
const { applyFixes } = require('../../../../../.aios-core/core/doctor/fix-handler');

const EXPECTED_CHECKS = [
  'settings-json',
  'rules-files',
  'agent-memory',
  'entity-registry',
  'git-hooks',
  'core-config',
  'claude-md',
  'ide-sync',
  'graph-dashboard',
  'code-intel',
  'node-version',
  'npm-packages',
  'skills-count',
  'commands-count',
  'hooks-claude-count',
];

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeFile(filePath, content = '') {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

function createDoctorFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'aios-doctor-orchestrator-'));
  const denyRules = [
    'Edit(.aios-core/core/)',
    'Edit(.aios-core/development/)',
    'Edit(.aios-core/data/)',
    ...Array.from({ length: 38 }, (_, index) => `Edit(boundary-${index}/)`),
  ];
  const expectedRules = [
    'agent-authority.md',
    'workflow-execution.md',
    'story-lifecycle.md',
    'ids-principles.md',
    'coderabbit-integration.md',
    'mcp-usage.md',
    'agent-memory-imports.md',
  ];
  const expectedAgents = [
    'dev',
    'qa',
    'architect',
    'pm',
    'po',
    'sm',
    'analyst',
    'data-engineer',
    'ux',
    'devops',
  ];
  const expectedSkills = [
    'aios-analyst',
    'aios-architect',
    'aios-dev',
    'aios-devops',
    'aios-pm',
    'aios-po',
    'aios-qa',
  ];
  const commandFiles = [
    ['.claude', 'commands', 'check.md'],
    ['.claude', 'commands', 'help.md'],
  ];

  writeFile(
    path.join(root, '.claude', 'settings.json'),
    JSON.stringify({
      permissions: {
        deny: denyRules,
        allow: ['Read(docs/)', 'Read(packages/)'],
      },
    }, null, 2),
  );
  writeFile(
    path.join(root, '.claude', 'settings.local.json'),
    JSON.stringify({
      hooks: {
        PreToolUse: [
          {
            hooks: [
              { type: 'command', command: 'node .claude/hooks/enforce-git-push.cjs' },
            ],
          },
        ],
        PostToolUse: [
          {
            hooks: [
              { type: 'command', command: 'node .claude/hooks/pre-commit-check.cjs' },
            ],
          },
        ],
      },
    }, null, 2),
  );
  writeFile(
    path.join(root, '.claude', 'CLAUDE.md'),
    [
      '## Constitution',
      '## Framework vs Project Boundary',
      '## Sistema de Agentes',
    ].join('\n\n'),
  );

  expectedRules.forEach((ruleFile) => {
    writeFile(path.join(root, '.claude', 'rules', ruleFile), `# ${ruleFile}\n`);
  });

  expectedAgents.forEach((agent) => {
    writeFile(
      path.join(root, '.aios-core', 'development', 'agents', agent, 'MEMORY.md'),
      `# ${agent} memory\n`,
    );
    writeFile(
      path.join(root, '.aios-core', 'development', 'agents', `${agent}.md`),
      `# ${agent}\n`,
    );
    writeFile(
      path.join(root, '.claude', 'commands', 'AIOS', 'agents', `${agent}.md`),
      `# ${agent}\n`,
    );
  });

  expectedSkills.forEach((skill) => {
    writeFile(path.join(root, '.claude', 'skills', skill, 'SKILL.md'), `# ${skill}\n`);
  });

  commandFiles.forEach((segments) => {
    writeFile(path.join(root, ...segments), '# command\n');
  });

  writeFile(path.join(root, '.claude', 'hooks', 'enforce-git-push.cjs'), 'module.exports = {};\n');
  writeFile(path.join(root, '.claude', 'hooks', 'pre-commit-check.cjs'), 'module.exports = {};\n');
  writeFile(path.join(root, '.husky', 'pre-commit'), '#!/bin/sh\n');
  writeFile(path.join(root, '.husky', 'pre-push'), '#!/bin/sh\n');
  writeFile(path.join(root, 'node_modules', '.keep'), '');
  writeFile(path.join(root, '.aios-core', 'core', 'graph-dashboard', 'index.js'), 'module.exports = {};\n');
  writeFile(
    path.join(root, '.aios-core', 'core-config.yaml'),
    [
      'boundary:',
      '  protected:',
      '    - .aios-core/core/**',
      '    - .aios-core/development/**',
      '    - .aios-core/data/**',
      'project:',
      '  name: fixture',
      'ide:',
      '  sync: true',
    ].join('\n'),
  );
  writeFile(
    path.join(root, '.aios-core', 'data', 'entity-registry.yaml'),
    [
      'metadata:',
      '  entityCount: 3',
      'entities:',
      '  - id: agent.dev',
      '  - id: agent.qa',
    ].join('\n'),
  );

  return root;
}

describe('Doctor Orchestrator', () => {
  let projectRoot;

  beforeAll(() => {
    projectRoot = createDoctorFixture();
  });

  afterAll(() => {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  });

  beforeEach(() => {
    applyFixes.mockClear();
  });

  describe('version', () => {
    it('should export DOCTOR_VERSION as 2.0.0', () => {
      expect(DOCTOR_VERSION).toBe('2.0.0');
    });
  });

  describe('options forwarding (AC1)', () => {
    it('should accept and use options object', async () => {
      const result = await runDoctorChecks({ projectRoot });
      expect(result).toHaveProperty('formatted');
      expect(result).toHaveProperty('data');
      expect(result.data).toHaveProperty('version', '2.0.0');
      expect(result.data).toHaveProperty('summary');
      expect(result.data).toHaveProperty('checks');
    });

    it('should produce JSON when json option is true', async () => {
      const result = await runDoctorChecks({ json: true, projectRoot });
      expect(result.formatted).toBeTruthy();

      const parsed = JSON.parse(result.formatted);
      expect(parsed).toHaveProperty('version');
      expect(parsed).toHaveProperty('summary');
      expect(parsed).toHaveProperty('checks');
    });

    it('should produce text when json option is false', async () => {
      const result = await runDoctorChecks({ json: false, projectRoot });
      expect(result.formatted).toContain('AIOS Doctor');
      expect(result.formatted).toContain('Summary:');
    });

    it('should forward projectRoot and flags to fix handling', async () => {
      await runDoctorChecks({ dryRun: true, json: true, quiet: true, projectRoot });
      expect(applyFixes).toHaveBeenCalledTimes(1);
      expect(applyFixes.mock.calls[0][1]).toMatchObject({
        projectRoot,
        options: {
          dryRun: true,
          fix: false,
          json: true,
          quiet: true,
        },
      });
    });
  });

  describe('15 checks (AC2 + INS-4.8)', () => {
    it('should run exactly 15 checks', async () => {
      const result = await runDoctorChecks({ projectRoot });
      expect(result.data.checks).toHaveLength(15);
    });

    it('should return valid status for each check', async () => {
      const result = await runDoctorChecks({ projectRoot });
      const validStatuses = ['PASS', 'WARN', 'FAIL', 'INFO'];

      for (const check of result.data.checks) {
        expect(validStatuses).toContain(check.status);
        expect(check).toHaveProperty('check');
        expect(check).toHaveProperty('message');
      }
    });

    it('should include all expected check names', async () => {
      const result = await runDoctorChecks({ projectRoot });
      const checkNames = result.data.checks.map((check) => check.check);

      EXPECTED_CHECKS.forEach((checkName) => {
        expect(checkNames).toContain(checkName);
      });
    });
  });

  describe('summary (AC3)', () => {
    it('should have stable summary counts for the fixture', async () => {
      const result = await runDoctorChecks({ projectRoot });
      expect(result.data.summary).toEqual({
        pass: 13,
        warn: 1,
        fail: 0,
        info: 1,
      });
    });

    it('should include Summary line in text output', async () => {
      const result = await runDoctorChecks({ projectRoot });
      expect(result.formatted).toContain('Summary: 13 PASS | 1 WARN | 0 FAIL | 1 INFO');
    });
  });

  describe('--dry-run (AC4)', () => {
    it('should include fixResults when dryRun is true', async () => {
      const result = await runDoctorChecks({ dryRun: true, projectRoot });
      expect(result.data).toHaveProperty('fixResults');
      expect(result.data.fixResults).toHaveLength(1);
      expect(result.data.fixResults[0].check).toBe('commands-count');
    });

    it('should not produce applied fixes with dryRun', async () => {
      const result = await runDoctorChecks({ dryRun: true, projectRoot });
      result.data.fixResults.forEach((fixResult) => {
        expect(fixResult.applied).toBe(false);
      });
    });
  });

  describe('fix mode', () => {
    it('should apply fixes when fix is true', async () => {
      const result = await runDoctorChecks({ fix: true, projectRoot });
      expect(result.data.fixResults).toBeDefined();
      expect(result.data.fixResults).toHaveLength(1);
      expect(result.data.fixResults[0]).toMatchObject({
        check: 'commands-count',
        applied: true,
      });
    });
  });

  describe('JSON output schema (AC3)', () => {
    it('should match expected JSON schema', async () => {
      const result = await runDoctorChecks({ json: true, projectRoot });
      const parsed = JSON.parse(result.formatted);

      expect(parsed).toHaveProperty('version');
      expect(parsed).toHaveProperty('timestamp');
      expect(parsed).toHaveProperty('summary');
      expect(parsed.summary).toHaveProperty('pass');
      expect(parsed.summary).toHaveProperty('warn');
      expect(parsed.summary).toHaveProperty('fail');
      expect(parsed.summary).toHaveProperty('info');
      expect(parsed).toHaveProperty('checks');
      expect(Array.isArray(parsed.checks)).toBe(true);
    });
  });
});
