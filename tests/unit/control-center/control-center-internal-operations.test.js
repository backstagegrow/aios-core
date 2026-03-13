'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..', '..');

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

describe('control center internal operations', () => {
  test('has internal operations story scaffold', () => {
    const content = readProjectFile(
      'docs/stories/workspace/story-aios-control-center-internal-operations.md',
    );

    expect(content).toContain('**Story ID:** WS-024');
    expect(content).toContain('**Status:** Done');
    expect(content).toContain('- [x] AC1 atendido');
    expect(content).toContain('- [x] AC6 atendido');
    expect(content).toContain('rota dedicada `/control-center/sites`');
    expect(content).toContain(
      '- [x] Quality gates executados (`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`)',
    );
  });

  test('resolved human decisions remove pending items from the queue', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'control-center-internal-ops-'));
    const dataDir = path.join(tempRoot, '.aios-core', 'data', 'control-center');
    const storyDir = path.join(tempRoot, 'docs', 'stories', 'workspace');

    fs.mkdirSync(dataDir, { recursive: true });
    fs.mkdirSync(storyDir, { recursive: true });

    fs.writeFileSync(
      path.join(dataDir, 'session-context.json'),
      JSON.stringify(
        {
          id: 'session-1',
          started_at: '2026-03-13T10:00:00.000Z',
          ended_at: null,
          active_items: ['SITE-001'],
          last_agent_used: '@aios-master',
          open_module: 'sites',
        },
        null,
        2,
      ),
    );
    fs.writeFileSync(
      path.join(dataDir, 'human-decision-log.jsonl'),
      [
        JSON.stringify({
          id: 'decision-pending',
          item_id: 'SITE-001',
          decision_type: 'copy_review',
        }),
        JSON.stringify({
          id: 'decision-resolved',
          item_id: 'SITE-001',
          decision_type: 'copy_review',
          outcome: 'Aprovado para seguir',
        }),
      ].join('\n'),
    );
    fs.writeFileSync(path.join(dataDir, 'agent-invocation-log.jsonl'), '');
    fs.writeFileSync(
      path.join(storyDir, 'story-site-001.md'),
      [
        '# Story: Site 001',
        '',
        '**Story ID:** SITE-001  ',
        '**Status:** In Progress  ',
        '**Epic:** Sites',
      ].join('\n'),
    );

    const {
      buildDashboardSnapshot,
    } = require('../../../apps/brand-console/lib/control-center/build-dashboard-snapshot.js');

    const snapshot = buildDashboardSnapshot({ projectRoot: tempRoot });

    expect(snapshot.human_review_queue).toEqual([]);
    expect(snapshot.session_context.open_module).toBe('sites');
  });

  test('control center exposes dynamic operational routes and action surfaces', () => {
    const homeRoute = readProjectFile('apps/brand-console/app/control-center/page.tsx');
    const sitesRoute = readProjectFile('apps/brand-console/app/control-center/sites/page.tsx');
    const actions = readProjectFile('apps/brand-console/lib/control-center/actions.ts');
    const header = readProjectFile(
      'apps/brand-console/components/control-center/ControlCenterHeader.tsx',
    );
    const nowCard = readProjectFile(
      'apps/brand-console/components/control-center/cards/NowCard.tsx',
    );
    const humanReviewCard = readProjectFile(
      'apps/brand-console/components/control-center/cards/HumanReviewCard.tsx',
    );
    const sidebar = readProjectFile(
      'apps/brand-console/components/control-center/ControlCenterSidebar.tsx',
    );

    expect(homeRoute).toContain('export const dynamic = "force-dynamic"');
    expect(sitesRoute).toContain('export const dynamic = "force-dynamic"');
    expect(sitesRoute).toContain('SiteOperationsList');
    expect(actions).toContain('refreshControlCenter');
    expect(actions).toContain('resumeControlCenterSession');
    expect(actions).toContain('createHumanDecision');
    expect(header).toContain('Ultimo snapshot');
    expect(header).toContain('RefreshButton');
    expect(nowCard).toContain('ResumeSessionButton');
    expect(humanReviewCard).toContain('HumanDecisionForm');
    expect(sidebar).toContain('/control-center/sites');
    expect(sidebar).toContain('Sites Factory');
  });
});
