'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..', '..', '..');

function validateSprintZeroFoundation(rootDir) {
  const requiredFiles = [
    '.aios-core/data/control-center/session-context.json',
    '.aios-core/data/control-center/human-decision-log.jsonl',
    '.aios-core/data/control-center/agent-invocation-log.jsonl',
    'apps/brand-console/lib/control-center/adapters/session-context.js',
    'apps/brand-console/lib/control-center/adapters/human-decisions.js',
    'apps/brand-console/lib/control-center/adapters/agent-invocations.js',
    'apps/brand-console/lib/control-center/adapters/agents.js',
    'apps/brand-console/lib/control-center/adapters/workflows.js',
    'apps/brand-console/lib/control-center/adapters/stories.js',
    'apps/brand-console/lib/control-center/adapters/clones.js',
    'apps/brand-console/lib/control-center/adapters/improvements.js',
    'apps/brand-console/lib/control-center/build-dashboard-snapshot.js',
    'apps/brand-console/lib/control-center/types.ts',
  ];

  const missing = requiredFiles.filter(
    (relativePath) => !fs.existsSync(path.join(rootDir, relativePath)),
  );

  return {
    ok: missing.length === 0,
    missing,
  };
}

describe('control center sprint 0 foundation contracts', () => {
  test('validates the three local persistence entities exist', () => {
    const foundation = validateSprintZeroFoundation(projectRoot);

    expect(foundation.missing).not.toContain(
      '.aios-core/data/control-center/session-context.json',
    );
    expect(foundation.missing).not.toContain(
      '.aios-core/data/control-center/human-decision-log.jsonl',
    );
    expect(foundation.missing).not.toContain(
      '.aios-core/data/control-center/agent-invocation-log.jsonl',
    );
  });

  test('validates the required sprint 0 adapters exist', () => {
    const foundation = validateSprintZeroFoundation(projectRoot);

    expect(foundation.missing).not.toContain(
      'apps/brand-console/lib/control-center/adapters/agents.js',
    );
    expect(foundation.missing).not.toContain(
      'apps/brand-console/lib/control-center/adapters/workflows.js',
    );
    expect(foundation.missing).not.toContain(
      'apps/brand-console/lib/control-center/adapters/stories.js',
    );
    expect(foundation.missing).not.toContain(
      'apps/brand-console/lib/control-center/adapters/clones.js',
    );
  });

  test('validates the aggregated dashboard snapshot builder exists and exports the contract', () => {
    const foundation = validateSprintZeroFoundation(projectRoot);
    const {
      buildDashboardSnapshot,
    } = require('../../../apps/brand-console/lib/control-center/build-dashboard-snapshot.js');

    expect(foundation.missing).not.toContain(
      'apps/brand-console/lib/control-center/build-dashboard-snapshot.js',
    );
    expect(typeof buildDashboardSnapshot).toBe('function');
  });

  test('fails validation when any foundation artifact is missing', () => {
    const tempRoot = fs.mkdtempSync(
      path.join(os.tmpdir(), 'control-center-foundation-'),
    );

    const foundation = validateSprintZeroFoundation(tempRoot);

    expect(foundation.ok).toBe(false);
    expect(foundation.missing).toContain(
      '.aios-core/data/control-center/session-context.json',
    );
    expect(foundation.missing).toContain(
      'apps/brand-console/lib/control-center/build-dashboard-snapshot.js',
    );
  });

  test('keeps the validation story aligned with completed sprint 0 contracts', () => {
    const storyPath = path.join(
      projectRoot,
      'docs/stories/workspace/story-aios-control-center-sprint-0-validation.md',
    );
    const content = fs.readFileSync(storyPath, 'utf8');

    expect(content).toContain('**Status:** Done');
    expect(content).toContain('- [x] AC1 atendido');
    expect(content).toContain('- [x] AC2 atendido');
    expect(content).toContain('- [x] AC3 atendido');
    expect(content).toContain('- [x] AC4 atendido');
    expect(content).toContain('- [x] AC5 atendido');
    expect(content).toContain(
      '- [x] Quality gates executados (`npm run lint`, `npm run typecheck`, `npm test`)',
    );
    expect(content).toContain(
      '- [x] `tests/unit/control-center/sprint-0-foundation-contracts.test.js`',
    );
  });
});
