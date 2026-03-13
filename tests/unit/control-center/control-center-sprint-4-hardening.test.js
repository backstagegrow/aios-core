'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..', '..');

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

describe('control center sprint 4 hardening and navigation polish', () => {
  test('has sprint 4 story scaffolding', () => {
    const content = readProjectFile(
      'docs/stories/workspace/story-aios-control-center-sprint-4-hardening-and-navigation-polish.md',
    );

    expect(content).toContain('**Story ID:** WS-023');
    expect(content).toContain('**Status:** Done');
    expect(content).toContain('- [x] AC1 atendido');
    expect(content).toContain('- [x] AC5 atendido');
    expect(content).toContain(
      '- [x] Quality gates executados (`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`)',
    );
  });

  test('shared YAML helpers and adapters tolerate malformed files without throwing', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'control-center-hardening-'));
    const workflowsDir = path.join(
      tempRoot,
      '.aios-core',
      'development',
      'workflows',
    );
    const agentsDir = path.join(
      tempRoot,
      '.aios-core',
      'development',
      'agents',
    );

    fs.mkdirSync(workflowsDir, { recursive: true });
    fs.mkdirSync(agentsDir, { recursive: true });

    fs.writeFileSync(
      path.join(workflowsDir, 'broken.yaml'),
      'workflow:\n  id: broken\n  phases: [ok,\n',
    );
    fs.writeFileSync(
      path.join(agentsDir, 'broken.md'),
      '# Broken\n\n```yaml\nagent:\n  id: broken\ncommands: [oops\n```\n',
    );

    const shared = require('../../../apps/brand-console/lib/control-center/adapters/shared.js');
    const {
      readWorkflowSummaries,
    } = require('../../../apps/brand-console/lib/control-center/adapters/workflows.js');
    const {
      readAgentSummaries,
    } = require('../../../apps/brand-console/lib/control-center/adapters/agents.js');
    const validAgentMarkdown = [
      '# Agent',
      '',
      '```yaml',
      'agent:',
      '  id: valid-agent',
      'commands:',
      '  - "*help"',
      '```',
      '',
    ].join('\n');
    const malformedAgentMarkdown = [
      '# Broken',
      '',
      '```yaml',
      'agent:',
      '  id: broken',
      'commands: [oops',
      '```',
      '',
    ].join('\n');

    expect(shared.parseYamlFile('.aios-core/development/workflows/broken.yaml', { projectRoot: tempRoot })).toBe(null);
    expect(shared.extractYamlCodeBlock(validAgentMarkdown)).toEqual(
      expect.objectContaining({
        agent: expect.objectContaining({ id: 'valid-agent' }),
      }),
    );
    expect(shared.extractYamlCodeBlock(malformedAgentMarkdown)).toBe(null);
    expect(() => readWorkflowSummaries({ projectRoot: tempRoot })).not.toThrow();
    expect(() => readAgentSummaries({ projectRoot: tempRoot })).not.toThrow();
    expect(readWorkflowSummaries({ projectRoot: tempRoot })).toEqual([]);
    expect(readAgentSummaries({ projectRoot: tempRoot })).toEqual([]);
  });

  test('shell exposes refined state contract and navigation copy is no longer sprint-specific', () => {
    const shellContent = readProjectFile(
      'apps/brand-console/components/control-center/ControlCenterShell.tsx',
    );
    const headerContent = readProjectFile(
      'apps/brand-console/components/control-center/ControlCenterHeader.tsx',
    );
    const sidebarContent = readProjectFile(
      'apps/brand-console/components/control-center/ControlCenterSidebar.tsx',
    );
    const viewStateContent = readProjectFile(
      'apps/brand-console/lib/control-center/view-state.ts',
    );

    expect(shellContent).toContain('state');
    expect(headerContent).toContain('state');
    expect(viewStateContent).toContain('human_review_required');
    expect(viewStateContent).toContain('source_missing');
    expect(sidebarContent).toContain('Cockpit interno do AIOS');
    expect(sidebarContent).not.toContain('Sprint 1 entrega a Visao Geral');
  });

  test('all control center routes pass refined state into the shell', () => {
    const routes = [
      'apps/brand-console/app/control-center/page.tsx',
      'apps/brand-console/app/control-center/agents/page.tsx',
      'apps/brand-console/app/control-center/sites/page.tsx',
      'apps/brand-console/app/control-center/workflows/page.tsx',
      'apps/brand-console/app/control-center/improvements/page.tsx',
    ];

    routes.forEach((relativePath) => {
      const content = readProjectFile(relativePath);
      expect(content).toContain('state=');
    });
  });

  test('lists expose explicit empty-state fallbacks', () => {
    expect(
      readProjectFile(
        'apps/brand-console/components/control-center/lists/AgentList.tsx',
      ),
    ).toContain('Nenhum agente real encontrado');
    expect(
      readProjectFile(
        'apps/brand-console/components/control-center/lists/CloneMatrix.tsx',
      ),
    ).toContain('Nenhum clone estrutural encontrado');
    expect(
      readProjectFile(
        'apps/brand-console/components/control-center/lists/WorkflowList.tsx',
      ),
    ).toContain('Nenhum workflow versionado encontrado');
    expect(
      readProjectFile(
        'apps/brand-console/components/control-center/lists/ImprovementList.tsx',
      ),
    ).toContain('Nenhum item estrutural encontrado');
  });
});
