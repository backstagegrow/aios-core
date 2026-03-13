'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..', '..');

describe('control center dashboard snapshot', () => {
  test('has canonical types file for control center entities', () => {
    const typesPath = path.join(
      projectRoot,
      'apps/brand-console/lib/control-center/types.ts',
    );

    expect(fs.existsSync(typesPath)).toBe(true);

    const content = fs.readFileSync(typesPath, 'utf8');
    expect(content).toContain('export interface DashboardSnapshot');
    expect(content).toContain('export interface SessionContext');
    expect(content).toContain('export interface HumanReviewItem');
  });

  test('builds a snapshot from real repo adapters and persistence', () => {
    const {
      buildDashboardSnapshot,
    } = require('../../../apps/brand-console/lib/control-center/build-dashboard-snapshot.js');

    const snapshot = buildDashboardSnapshot({
      projectRoot,
      generatedAt: '2026-03-13T15:00:00.000Z',
    });

    expect(snapshot).toEqual(
      expect.objectContaining({
        generated_at: '2026-03-13T15:00:00.000Z',
        session_context: expect.any(Object),
        stories_active: expect.any(Array),
        workflow_runs: expect.any(Array),
        agents: expect.any(Array),
        clones: expect.any(Array),
        sites: expect.any(Array),
        improvements: expect.any(Array),
        human_review_queue: expect.any(Array),
        source_breakdown: expect.objectContaining({
          structural: expect.any(Object),
          derived: expect.any(Object),
        }),
      }),
    );

    expect(snapshot.agents.length).toBeGreaterThan(0);
    expect(snapshot.workflow_runs.length).toBeGreaterThan(0);
    expect(snapshot.clones.length).toBeGreaterThan(0);
    expect(snapshot.improvements.length).toBeGreaterThan(0);

    const activeStoryIds = snapshot.stories_active.map((story) => story.id);
    expect(activeStoryIds.length).toBeGreaterThan(0);
    expect(activeStoryIds).not.toContain('WS-017');
    expect(activeStoryIds).not.toContain('WS-016');
    expect(activeStoryIds).not.toContain('WS-018');

    const siteIds = snapshot.sites.map((site) => site.id);
    expect(siteIds).toContain('2026-03-12-site-creation-playbook');

    expect(snapshot.source_breakdown.structural.stories_active).toBe(
      snapshot.stories_active,
    );
    expect(snapshot.source_breakdown.derived.session_context).toBe(
      snapshot.session_context,
    );
  });

  test('keeps structural and derived state separate on a minimal temp project', () => {
    const {
      buildDashboardSnapshot,
    } = require('../../../apps/brand-console/lib/control-center/build-dashboard-snapshot.js');

    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'control-center-snapshot-'));
    const controlCenterDir = path.join(tempRoot, '.aios-core', 'data', 'control-center');
    fs.mkdirSync(controlCenterDir, { recursive: true });

    fs.writeFileSync(
      path.join(controlCenterDir, 'session-context.json'),
      `${JSON.stringify(
        {
          id: 'session-1',
          started_at: '2026-03-13T10:00:00.000Z',
          ended_at: null,
          active_items: ['WS-017'],
          last_agent_used: '@dev',
          open_module: 'workflows',
        },
        null,
        2,
      )}\n`,
    );
    fs.writeFileSync(
      path.join(controlCenterDir, 'human-decision-log.jsonl'),
      `${JSON.stringify({
        id: 'decision-1',
        item_id: 'ITEM-1',
        decision_type: 'pricing',
        context: 'Need approval',
        decided_by: null,
        decided_at: null,
        outcome: null,
      })}\n${JSON.stringify({
        id: 'decision-2',
        item_id: 'ITEM-2',
        decision_type: 'copy',
        context: 'Already decided',
        decided_by: 'user',
        decided_at: '2026-03-13T11:00:00.000Z',
        outcome: 'approved',
      })}\n`,
    );
    fs.writeFileSync(
      path.join(controlCenterDir, 'agent-invocation-log.jsonl'),
      `${JSON.stringify({
        id: 'invoke-1',
        agent_id: '@dev',
        item_id: 'WS-017',
        command: 'build snapshot',
        invoked_at: '2026-03-13T10:15:00.000Z',
        output_summary: 'ok',
        duration_ms: 10,
        status: 'success',
      })}\n`,
    );

    const snapshot = buildDashboardSnapshot({
      projectRoot: tempRoot,
      generatedAt: '2026-03-13T16:00:00.000Z',
    });

    expect(snapshot.generated_at).toBe('2026-03-13T16:00:00.000Z');
    expect(snapshot.session_context.id).toBe('session-1');
    expect(snapshot.agents).toEqual([]);
    expect(snapshot.workflow_runs).toEqual([]);
    expect(snapshot.stories_active).toEqual([]);
    expect(snapshot.clones).toEqual([]);
    expect(snapshot.improvements).toEqual([]);
    expect(snapshot.human_review_queue).toEqual([
      expect.objectContaining({
        id: 'decision-1',
        reason: 'pricing',
        domain: 'human_decision_log',
      }),
    ]);
    expect(snapshot.source_breakdown.derived.human_decision_log).toHaveLength(2);
    expect(snapshot.source_breakdown.derived.agent_invocation_log).toHaveLength(1);
  });
});
