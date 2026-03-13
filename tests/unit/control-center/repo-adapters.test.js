'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..', '..');

describe('control center repo adapters', () => {
  const agentsAdapter = require('../../../apps/brand-console/lib/control-center/adapters/agents.js');
  const workflowsAdapter = require('../../../apps/brand-console/lib/control-center/adapters/workflows.js');
  const storiesAdapter = require('../../../apps/brand-console/lib/control-center/adapters/stories.js');
  const clonesAdapter = require('../../../apps/brand-console/lib/control-center/adapters/clones.js');
  const improvementsAdapter = require('../../../apps/brand-console/lib/control-center/adapters/improvements.js');

  test('reads normalized agent summaries from real agent files', () => {
    const agents = agentsAdapter.readAgentSummaries({ projectRoot });

    expect(Array.isArray(agents)).toBe(true);
    expect(agents.length).toBeGreaterThan(0);

    const architect = agents.find((agent) => agent.id === 'architect');
    expect(architect).toEqual(
      expect.objectContaining({
        id: 'architect',
        name: 'Aria',
        role: expect.any(String),
        commands: expect.any(Array),
        source_path: '.aios-core/development/agents/architect.md',
        related_workflows: expect.any(Array),
      }),
    );
  });

  test('reads normalized workflow summaries from real workflow files', () => {
    const workflows = workflowsAdapter.readWorkflowSummaries({ projectRoot });

    expect(Array.isArray(workflows)).toBe(true);
    expect(workflows.length).toBeGreaterThan(0);

    const storyDevelopmentCycle = workflows.find(
      (workflow) => workflow.id === 'story-development-cycle',
    );

    expect(storyDevelopmentCycle).toEqual(
      expect.objectContaining({
        id: 'story-development-cycle',
        name: 'Story Development Cycle',
        type: expect.any(String),
        phases: expect.any(Array),
        source_path:
          '.aios-core/development/workflows/story-development-cycle.yaml',
      }),
    );
    expect(storyDevelopmentCycle.phases.length).toBeGreaterThan(0);
  });

  test('reads normalized story and plan summaries from docs', () => {
    const stories = storiesAdapter.readStorySummaries({ projectRoot });
    const plans = storiesAdapter.readPlanSummaries({ projectRoot });

    expect(Array.isArray(stories)).toBe(true);
    expect(Array.isArray(plans)).toBe(true);
    expect(stories.length).toBeGreaterThan(0);
    expect(plans.length).toBeGreaterThan(0);

    const ws016 = stories.find((story) => story.id === 'WS-016');
    expect(ws016).toEqual(
      expect.objectContaining({
        id: 'WS-016',
        title: 'AIOS Control Center Sprint 0 Repo Adapters',
        status: 'Done',
        epic: 'Workspace Stability',
        owner: '@dev',
        source_path:
          'docs/stories/workspace/story-aios-control-center-sprint-0-repo-adapters.md',
      }),
    );

    const designPlan = plans.find(
      (plan) => plan.id === '2026-03-13-aios-control-center-design',
    );
    expect(designPlan).toEqual(
      expect.objectContaining({
        id: '2026-03-13-aios-control-center-design',
        title: 'AIOS Control Center Design',
        source_path: 'docs/plans/2026-03-13-aios-control-center-design.md',
      }),
    );
  });

  test('reads normalized clone summaries with structural derivation only', () => {
    const clones = clonesAdapter.readCloneSummaries({ projectRoot });

    expect(Array.isArray(clones)).toBe(true);
    expect(clones.length).toBeGreaterThan(0);

    const marty = clones.find((clone) => clone.id === 'marty_neumeier');
    expect(marty).toEqual(
      expect.objectContaining({
        id: 'marty_neumeier',
        name: 'Marty Neumeier',
        status: expect.any(String),
        gaps: expect.any(Array),
        source_paths: expect.arrayContaining([
          'experts/marty_neumeier/clone_marty_neumeier.yaml',
          'experts/marty_neumeier/README.md',
          'experts/marty_neumeier/dna/compiled_dna.md',
        ]),
      }),
    );
    expect(marty.gaps).not.toContain('missing_clone_definition');
    expect(marty.gaps).not.toContain('missing_readme');
    expect(marty.gaps).not.toContain('missing_compiled_dna');
  });

  test('reads normalized improvement summaries from docs artifacts', () => {
    const improvements = improvementsAdapter.readImprovementSummaries({
      projectRoot,
    });

    expect(Array.isArray(improvements)).toBe(true);
    expect(improvements.length).toBeGreaterThan(0);
    expect(improvements.find((item) => item.id === 'WS-016')).toBeUndefined();
    expect(improvements.find((item) => item.id === 'WS-017')).toBeUndefined();
    expect(improvements.find((item) => item.id === 'WS-018')).toBeUndefined();

    const firstImprovement = improvements[0];
    expect(typeof firstImprovement.id).toBe('string');
    expect(typeof firstImprovement.title).toBe('string');
    expect(firstImprovement.status === null || typeof firstImprovement.status === 'string').toBe(
      true,
    );
    expect(firstImprovement.priority).toBeNull();
    expect(typeof firstImprovement.affected_area).toBe('string');
    expect(typeof firstImprovement.source_path).toBe('string');
  });

  test('adapters are pure readers on an empty project root', () => {
    const tempRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), 'control-center-readers-'),
    );

    expect(agentsAdapter.readAgentSummaries({ projectRoot: tempRoot })).toEqual(
      [],
    );
    expect(
      workflowsAdapter.readWorkflowSummaries({ projectRoot: tempRoot }),
    ).toEqual([]);
    expect(
      storiesAdapter.readStorySummaries({ projectRoot: tempRoot }),
    ).toEqual([]);
    expect(storiesAdapter.readPlanSummaries({ projectRoot: tempRoot })).toEqual(
      [],
    );
    expect(clonesAdapter.readCloneSummaries({ projectRoot: tempRoot })).toEqual(
      [],
    );
    expect(
      improvementsAdapter.readImprovementSummaries({ projectRoot: tempRoot }),
    ).toEqual([]);
    expect(fs.readdirSync(tempRoot)).toEqual([]);
  });
});
