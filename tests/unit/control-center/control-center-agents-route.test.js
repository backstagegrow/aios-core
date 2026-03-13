'use strict';

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..', '..');

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

describe('control center agents and clones surface', () => {
  test('has sprint 2 story scaffolding for agents and clones', () => {
    const content = readProjectFile(
      'docs/stories/workspace/story-aios-control-center-sprint-2-agents-and-clones.md',
    );

    expect(content).toContain('**Story ID:** WS-020');
    expect(content).toContain('**Status:** Done');
    expect(content).toContain(
      '- [x] Quality gates executados (`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`)',
    );
  });

  test('creates the /control-center/agents route wired to real agent and clone data', () => {
    const pagePath = 'apps/brand-console/app/control-center/agents/page.tsx';
    expect(fs.existsSync(path.join(projectRoot, pagePath))).toBe(true);

    const content = readProjectFile(pagePath);
    expect(content).toContain('ControlCenterShell');
    expect(content).toContain('AgentList');
    expect(content).toContain('CloneMatrix');
    expect(content).toContain('DetailPanel');
    expect(content).toContain('buildDashboardSnapshot');
    expect(content).toContain('snapshot.agents');
    expect(content).toContain('snapshot.clones');
  });

  test('provides list and detail components for the agents hub', () => {
    const componentFiles = [
      'apps/brand-console/components/control-center/lists/AgentList.tsx',
      'apps/brand-console/components/control-center/lists/CloneMatrix.tsx',
      'apps/brand-console/components/control-center/detail/DetailPanel.tsx',
    ];

    componentFiles.forEach((relativePath) => {
      expect(fs.existsSync(path.join(projectRoot, relativePath))).toBe(true);
    });

    expect(readProjectFile(componentFiles[0])).toContain('Catalogo de Agentes');
    expect(readProjectFile(componentFiles[1])).toContain('Matriz de Clones');
    expect(readProjectFile(componentFiles[2])).toContain('Artefatos de origem');
  });

  test('supports active navigation state for the agents module', () => {
    const shellContent = readProjectFile(
      'apps/brand-console/components/control-center/ControlCenterShell.tsx',
    );
    const sidebarContent = readProjectFile(
      'apps/brand-console/components/control-center/ControlCenterSidebar.tsx',
    );
    const pageContent = readProjectFile(
      'apps/brand-console/app/control-center/agents/page.tsx',
    );

    expect(shellContent).toContain('activePath');
    expect(sidebarContent).toContain('activePath');
    expect(sidebarContent).toContain('item.href === activePath');
    expect(pageContent).toContain('activePath="/control-center/agents"');
  });

  test('keeps the module in read-only mode without workflow execution or log mutation', () => {
    const pageContent = readProjectFile(
      'apps/brand-console/app/control-center/agents/page.tsx',
    );

    expect(pageContent).not.toContain('appendHumanDecision');
    expect(pageContent).not.toContain('appendAgentInvocation');
    expect(pageContent).not.toContain('runWorkflow');
    expect(pageContent).not.toContain('executeWorkflow');
  });
});
