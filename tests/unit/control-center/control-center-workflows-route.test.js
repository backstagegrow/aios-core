'use strict';

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..', '..');

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

describe('control center workflows surface', () => {
  test('has sprint 2 story scaffolding for workflows', () => {
    const content = readProjectFile(
      'docs/stories/workspace/story-aios-control-center-sprint-2-workflows.md',
    );

    expect(content).toContain('**Story ID:** WS-021');
    expect(content).toContain('**Status:** Done');
    expect(content).toContain(
      '- [x] Quality gates executados (`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`)',
    );
  });

  test('creates the /control-center/workflows route wired to the real snapshot', () => {
    const pagePath = 'apps/brand-console/app/control-center/workflows/page.tsx';
    expect(fs.existsSync(path.join(projectRoot, pagePath))).toBe(true);

    const content = readProjectFile(pagePath);
    expect(content).toContain('ControlCenterShell');
    expect(content).toContain('WorkflowList');
    expect(content).toContain('DetailPanel');
    expect(content).toContain('buildDashboardSnapshot');
    expect(content).toContain('activePath="/control-center/workflows"');
  });

  test('provides workflow monitoring components for the module', () => {
    const componentFiles = [
      'apps/brand-console/components/control-center/lists/WorkflowList.tsx',
      'apps/brand-console/components/control-center/detail/DetailPanel.tsx',
    ];

    componentFiles.forEach((relativePath) => {
      expect(fs.existsSync(path.join(projectRoot, relativePath))).toBe(true);
    });

    expect(readProjectFile(componentFiles[0])).toContain('Workflows Disponiveis');
    expect(readProjectFile(componentFiles[0])).toContain('Execucoes Ativas');
    expect(readProjectFile(componentFiles[1])).toContain('Artefatos de origem');
  });

  test('keeps the module in read-only mode without workflow execution or log mutation', () => {
    const pageContent = readProjectFile(
      'apps/brand-console/app/control-center/workflows/page.tsx',
    );

    expect(pageContent).not.toContain('appendHumanDecision');
    expect(pageContent).not.toContain('appendAgentInvocation');
    expect(pageContent).not.toContain('runWorkflow');
    expect(pageContent).not.toContain('executeWorkflow');
  });
});
