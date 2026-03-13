const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

describe('Corporate events sales pipeline artifacts', () => {
  const workflowPath = path.join(
    __dirname,
    '..',
    '..',
    '.aios-core',
    'development',
    'workflows',
    'corporate-events-sales-pipeline.yaml',
  );
  const playbookPath = path.join(
    __dirname,
    '..',
    '..',
    'docs',
    'strategy',
    'corporate-events-sales-pipeline-playbook.md',
  );
  const frameworksPath = path.join(
    __dirname,
    '..',
    '..',
    'docs',
    'strategy',
    'corporate-events-expert-frameworks.md',
  );

  it('workflow exists with required structure', () => {
    const content = fs.readFileSync(workflowPath, 'utf8');
    const parsed = yaml.load(content);

    expect(parsed.workflow.id).toBe('corporate-events-sales-pipeline');
    expect(parsed.workflow.sequence).toHaveLength(6);
    expect(parsed.workflow.sequence.map((step) => step.id)).toEqual([
      'positioning',
      'narrative',
      'acquisition',
      'revenue',
      'audit',
      'complete',
    ]);
  });

  it('playbook exists with workshop and execution modes', () => {
    const content = fs.readFileSync(playbookPath, 'utf8');

    expect(content).toContain('# Corporate Events Sales Pipeline Playbook');
    expect(content).toContain('## Modes');
    expect(content).toContain('### Workshop Mode');
    expect(content).toContain('### Execution Mode');
    expect(content).toContain('nexus-revenue-ops');
    expect(content).toContain('corporate-events-expert-frameworks.md');
  });

  it('framework library exists with core aliases', () => {
    const content = fs.readFileSync(frameworksPath, 'utf8');

    expect(content).toContain('# Corporate Events Expert Frameworks');
    expect(content).toContain('hormozi:oferta');
    expect(content).toContain('schwartz:consciencia');
    expect(content).toContain('goldratt:toc');
    expect(content).toContain('mandalia:bpm');
  });
});
