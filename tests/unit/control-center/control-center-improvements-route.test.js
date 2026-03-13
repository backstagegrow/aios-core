'use strict';

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..', '..');

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

describe('control center improvements and backlog surface', () => {
  test('has sprint 3 story scaffolding for improvements and backlog', () => {
    const content = readProjectFile(
      'docs/stories/workspace/story-aios-control-center-sprint-3-improvements-and-backlog.md',
    );

    expect(content).toContain('**Story ID:** WS-022');
    expect(content).toContain('**Status:** Done');
    expect(content).toContain(
      '- [x] Quality gates executados (`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`)',
    );
  });

  test('creates the /control-center/improvements route wired to the real snapshot', () => {
    const pagePath = 'apps/brand-console/app/control-center/improvements/page.tsx';
    expect(fs.existsSync(path.join(projectRoot, pagePath))).toBe(true);

    const content = readProjectFile(pagePath);
    expect(content).toContain('ControlCenterShell');
    expect(content).toContain('ImprovementList');
    expect(content).toContain('SitesStatusCard');
    expect(content).toContain('DetailPanel');
    expect(content).toContain('buildDashboardSnapshot');
    expect(content).toContain('activePath="/control-center/improvements"');
  });

  test('provides backlog monitoring components for the module', () => {
    const componentFiles = [
      'apps/brand-console/components/control-center/lists/ImprovementList.tsx',
      'apps/brand-console/components/control-center/cards/SitesStatusCard.tsx',
      'apps/brand-console/components/control-center/detail/DetailPanel.tsx',
    ];

    componentFiles.forEach((relativePath) => {
      expect(fs.existsSync(path.join(projectRoot, relativePath))).toBe(true);
    });

    expect(readProjectFile(componentFiles[0])).toContain('Backlog Estrutural');
    expect(readProjectFile(componentFiles[0])).toContain('P1 do Sistema');
    expect(readProjectFile(componentFiles[1])).toContain('Sites em Andamento');
    expect(readProjectFile(componentFiles[2])).toContain('Artefatos de origem');
  });

  test('keeps the module in read-only mode without workflow execution or log mutation', () => {
    const pageContent = readProjectFile(
      'apps/brand-console/app/control-center/improvements/page.tsx',
    );

    expect(pageContent).not.toContain('appendHumanDecision');
    expect(pageContent).not.toContain('appendAgentInvocation');
    expect(pageContent).not.toContain('runWorkflow');
    expect(pageContent).not.toContain('executeWorkflow');
  });
});
