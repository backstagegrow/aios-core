'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  validateAntigravityIntegration,
} = require('../../.aios-core/infrastructure/scripts/validate-antigravity-integration');
const {
  CANONICAL_ANTIGRAVITY_AGENTS,
  createAntiGravityConfigObject,
  generateAntiGravityWorkflow,
  buildAgentRecognitionLine,
} = require('../../.aios-core/infrastructure/scripts/ide-sync/antigravity-support');

describe('validate-antigravity-integration', () => {
  function createProjectFixture() {
    const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'aios-antigravity-'));
    fs.mkdirSync(path.join(projectRoot, '.antigravity', 'agents'), { recursive: true });
    fs.mkdirSync(path.join(projectRoot, '.agent', 'workflows'), { recursive: true });

    const rules = [
      '# AntiGravity Rules',
      buildAgentRecognitionLine(),
      'Use .agent/workflows and .antigravity/agents',
    ].join('\n');
    fs.writeFileSync(path.join(projectRoot, '.antigravity', 'rules.md'), rules, 'utf8');

    const config = createAntiGravityConfigObject(projectRoot);
    fs.writeFileSync(
      path.join(projectRoot, '.antigravity', 'antigravity.json'),
      JSON.stringify(config, null, 4),
      'utf8',
    );

    for (const agentId of CANONICAL_ANTIGRAVITY_AGENTS) {
      fs.writeFileSync(
        path.join(projectRoot, '.antigravity', 'agents', `${agentId}.md`),
        `# ${agentId}\n`,
        'utf8',
      );
      fs.writeFileSync(
        path.join(projectRoot, '.agent', 'workflows', `${agentId}.md`),
        generateAntiGravityWorkflow(agentId),
        'utf8',
      );
    }

    return projectRoot;
  }

  it('passes when canonical agents, workflows, rules and config exist', () => {
    const projectRoot = createProjectFixture();
    const result = validateAntigravityIntegration({ projectRoot });

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('fails when rules do not mention a canonical agent', () => {
    const projectRoot = createProjectFixture();
    const rulesPath = path.join(projectRoot, '.antigravity', 'rules.md');
    fs.writeFileSync(rulesPath, '# AntiGravity Rules\n@dev\n', 'utf8');

    const result = validateAntigravityIntegration({ projectRoot });

    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes('@qa'))).toBe(true);
  });

  it('fails when workflow directory is missing', () => {
    const projectRoot = createProjectFixture();
    fs.rmSync(path.join(projectRoot, '.agent'), { recursive: true, force: true });

    const result = validateAntigravityIntegration({ projectRoot });

    expect(result.ok).toBe(false);
    expect(result.errors.some((error) => error.includes('.agent/workflows'))).toBe(true);
  });
});
