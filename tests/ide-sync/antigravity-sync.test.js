const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  buildAntigravityExtraConfigs,
  buildValidationConfigs,
  syncAntigravityExtras,
} = require('../../.aios-core/infrastructure/scripts/ide-sync/index');

describe('ide-sync antigravity extras', () => {
  const sampleAgent = {
    filename: 'qa.md',
    id: 'qa',
    raw: '# qa\n',
    agent: {
      id: 'qa',
      name: 'Quinn',
      title: 'QA',
      whenToUse: 'Review stories',
    },
    persona_profile: {},
    commands: [],
    sections: {},
    error: null,
  };

  it('builds canonical antigravity configs', () => {
    const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'aios-antigravity-sync-'));
    const configs = buildAntigravityExtraConfigs([sampleAgent], projectRoot);

    expect(configs['antigravity-workflows']).toBeDefined();
    expect(configs['antigravity-config']).toBeDefined();
    expect(configs['antigravity-workflows'].expectedFiles[0].content).toContain('.antigravity/agents/qa.md');
  });

  it('writes canonical antigravity artifacts to disk', () => {
    const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'aios-antigravity-write-'));
    const written = syncAntigravityExtras([sampleAgent], projectRoot, { dryRun: false });

    expect(written.length).toBe(2);
    expect(fs.existsSync(path.join(projectRoot, '.agent', 'workflows', 'qa.md'))).toBe(true);
    expect(fs.existsSync(path.join(projectRoot, '.antigravity', 'antigravity.json'))).toBe(true);
  });

  it('uses canonical antigravity agent directory as the main sync target', () => {
    const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'aios-antigravity-validate-'));
    const config = {
      targets: {
        antigravity: {
          enabled: true,
          path: '.antigravity/agents',
          format: 'full-markdown-yaml',
        },
      },
      redirects: {},
    };

    const validationConfigs = buildValidationConfigs(projectRoot, config, [sampleAgent], { ide: 'antigravity' });

    expect(validationConfigs.antigravity.targetDir).toBe(
      path.join(projectRoot, '.antigravity', 'agents'),
    );
    expect(validationConfigs.antigravity.expectedFiles[0].filename).toBe('qa.md');
    expect(validationConfigs.antigravity.expectedFiles[0].content).toContain('Synced from .aios-core/development/agents/qa.md');
  });
});
