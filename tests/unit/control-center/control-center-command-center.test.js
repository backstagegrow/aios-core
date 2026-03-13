'use strict';

const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..', '..');

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

describe('control center command center surface', () => {
  test('has sprint 1 story scaffolding for command center', () => {
    const content = readProjectFile(
      'docs/stories/workspace/story-aios-control-center-sprint-1-command-center.md',
    );

    expect(content).toContain('**Story ID:** WS-019');
    expect(content).toContain('**Status:** Done');
    expect(content).toContain(
      '- [x] Quality gates executados (`npm run lint`, `npm run typecheck`, `npm test`)',
    );
  });

  test('creates the /control-center route wired to the real snapshot builder', () => {
    const pagePath = 'apps/brand-console/app/control-center/page.tsx';
    expect(fs.existsSync(path.join(projectRoot, pagePath))).toBe(true);

    const content = readProjectFile(pagePath);
    expect(content).toContain('buildDashboardSnapshot');
    expect(content).toContain('ControlCenterShell');
    expect(content).toContain('NowCard');
    expect(content).toContain('ActiveStoriesCard');
    expect(content).toContain('WorkflowRunsCard');
    expect(content).toContain('HumanReviewCard');
    expect(content).toContain('SitesStatusCard');
  });

  test('provides a base shell with header and sidebar components', () => {
    const shellContent = readProjectFile(
      'apps/brand-console/components/control-center/ControlCenterShell.tsx',
    );
    const headerContent = readProjectFile(
      'apps/brand-console/components/control-center/ControlCenterHeader.tsx',
    );
    const sidebarContent = readProjectFile(
      'apps/brand-console/components/control-center/ControlCenterSidebar.tsx',
    );

    expect(shellContent).toContain('ControlCenterHeader');
    expect(shellContent).toContain('ControlCenterSidebar');
    expect(shellContent).toContain('children');
    expect(headerContent).toContain('AIOS Control Center');
    expect(sidebarContent).toContain('/control-center');
    expect(sidebarContent).toContain('/control-center/agents');
    expect(sidebarContent).toContain('/control-center/workflows');
    expect(sidebarContent).toContain('/control-center/improvements');
  });

  test('provides all five dashboard cards for the home view', () => {
    const cardFiles = [
      'apps/brand-console/components/control-center/cards/NowCard.tsx',
      'apps/brand-console/components/control-center/cards/ActiveStoriesCard.tsx',
      'apps/brand-console/components/control-center/cards/WorkflowRunsCard.tsx',
      'apps/brand-console/components/control-center/cards/HumanReviewCard.tsx',
      'apps/brand-console/components/control-center/cards/SitesStatusCard.tsx',
    ];

    cardFiles.forEach((relativePath) => {
      expect(fs.existsSync(path.join(projectRoot, relativePath))).toBe(true);
    });

    expect(readProjectFile(cardFiles[0])).toContain('Proxima acao');
    expect(readProjectFile(cardFiles[1])).toContain('Stories Ativas');
    expect(readProjectFile(cardFiles[2])).toContain('Workflows em Curso');
    expect(readProjectFile(cardFiles[3])).toContain('Pendencias Humanas');
    expect(readProjectFile(cardFiles[4])).toContain('Sites em Andamento');
  });

  test('does not execute workflows from the UI surface', () => {
    const pageContent = readProjectFile(
      'apps/brand-console/app/control-center/page.tsx',
    );

    expect(pageContent).not.toContain('appendHumanDecision');
    expect(pageContent).not.toContain('appendAgentInvocation');
    expect(pageContent).not.toContain('runWorkflow');
    expect(pageContent).not.toContain('executeWorkflow');
  });
});
