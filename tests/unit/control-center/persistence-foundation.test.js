const fs = require('fs');
const os = require('os');
const path = require('path');

describe('AIOS Control Center persistence foundation', () => {
  const projectRoot = path.join(__dirname, '..', '..', '..');
  const controlCenterDir = path.join(
    projectRoot,
    '.aios-core',
    'data',
    'control-center',
  );
  const sessionContextPath = path.join(controlCenterDir, 'session-context.json');
  const humanDecisionLogPath = path.join(
    controlCenterDir,
    'human-decision-log.jsonl',
  );
  const agentInvocationLogPath = path.join(
    controlCenterDir,
    'agent-invocation-log.jsonl',
  );

  const adaptersRoot = path.join(
    projectRoot,
    'apps',
    'brand-console',
    'lib',
    'control-center',
    'adapters',
  );

  const sessionContextAdapter = path.join(adaptersRoot, 'session-context.js');
  const humanDecisionsAdapter = path.join(adaptersRoot, 'human-decisions.js');
  const agentInvocationsAdapter = path.join(
    adaptersRoot,
    'agent-invocations.js',
  );

  let sandboxRoot;

  beforeEach(() => {
    sandboxRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'control-center-'));
  });

  afterEach(() => {
    fs.rmSync(sandboxRoot, { recursive: true, force: true });
  });

  it('defines persistence files and adapter modules', () => {
    expect(fs.existsSync(sessionContextPath)).toBe(true);
    expect(fs.existsSync(humanDecisionLogPath)).toBe(true);
    expect(fs.existsSync(agentInvocationLogPath)).toBe(true);
    expect(fs.existsSync(sessionContextAdapter)).toBe(true);
    expect(fs.existsSync(humanDecisionsAdapter)).toBe(true);
    expect(fs.existsSync(agentInvocationsAdapter)).toBe(true);
  });

  it('persists session context as a single JSON document', () => {
    const {
      readSessionContext,
      writeSessionContext,
      getSessionContextPath,
    } = require(sessionContextAdapter);

    const session = {
      id: 'session-001',
      started_at: '2026-03-13T12:00:00.000Z',
      ended_at: null,
      active_items: ['WS-015'],
      last_agent_used: '@dev',
      open_module: 'workflows',
    };

    writeSessionContext(session, { projectRoot: sandboxRoot });

    expect(getSessionContextPath({ projectRoot: sandboxRoot })).toBe(
      path.join(
        sandboxRoot,
        '.aios-core',
        'data',
        'control-center',
        'session-context.json',
      ),
    );
    expect(readSessionContext({ projectRoot: sandboxRoot })).toEqual(session);
  });

  it('appends human decisions as JSONL entries', () => {
    const {
      appendHumanDecision,
      readHumanDecisions,
      getHumanDecisionLogPath,
    } = require(humanDecisionsAdapter);

    appendHumanDecision(
      {
        id: 'decision-001',
        item_id: 'WS-015',
        decision_type: 'scope',
        context: 'MVP cut',
        decided_by: 'human',
        decided_at: '2026-03-13T12:00:00.000Z',
        outcome: 'approved',
      },
      { projectRoot: sandboxRoot },
    );

    appendHumanDecision(
      {
        id: 'decision-002',
        item_id: 'WS-016',
        decision_type: 'priority',
        context: 'Sprint order',
        decided_by: 'human',
        decided_at: '2026-03-13T12:05:00.000Z',
        outcome: 'approved',
      },
      { projectRoot: sandboxRoot },
    );

    const logPath = getHumanDecisionLogPath({ projectRoot: sandboxRoot });
    const logLines = fs
      .readFileSync(logPath, 'utf8')
      .trim()
      .split('\n');

    expect(logLines).toHaveLength(2);
    expect(readHumanDecisions({ projectRoot: sandboxRoot })).toEqual([
      {
        id: 'decision-001',
        item_id: 'WS-015',
        decision_type: 'scope',
        context: 'MVP cut',
        decided_by: 'human',
        decided_at: '2026-03-13T12:00:00.000Z',
        outcome: 'approved',
      },
      {
        id: 'decision-002',
        item_id: 'WS-016',
        decision_type: 'priority',
        context: 'Sprint order',
        decided_by: 'human',
        decided_at: '2026-03-13T12:05:00.000Z',
        outcome: 'approved',
      },
    ]);
  });

  it('appends agent invocations as JSONL entries', () => {
    const {
      appendAgentInvocation,
      readAgentInvocations,
      getAgentInvocationLogPath,
    } = require(agentInvocationsAdapter);

    appendAgentInvocation(
      {
        id: 'invoke-001',
        agent_id: '@dev',
        item_id: 'WS-015',
        command: '*implement',
        invoked_at: '2026-03-13T12:10:00.000Z',
        output_summary: 'Created persistence files',
        duration_ms: 1530,
        status: 'completed',
      },
      { projectRoot: sandboxRoot },
    );

    const logPath = getAgentInvocationLogPath({ projectRoot: sandboxRoot });
    const logLines = fs
      .readFileSync(logPath, 'utf8')
      .trim()
      .split('\n');

    expect(logLines).toHaveLength(1);
    expect(readAgentInvocations({ projectRoot: sandboxRoot })).toEqual([
      {
        id: 'invoke-001',
        agent_id: '@dev',
        item_id: 'WS-015',
        command: '*implement',
        invoked_at: '2026-03-13T12:10:00.000Z',
        output_summary: 'Created persistence files',
        duration_ms: 1530,
        status: 'completed',
      },
    ]);
  });
});
