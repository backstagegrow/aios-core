jest.mock('../../.aios-core/core/memory/gotchas-memory', () => {
  throw new Error('mocked');
});

describe('SubagentDispatcher command execution security', () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('executeClaude invokes claude directly without shell interpolation', async () => {
    const stdin = {
      write: jest.fn(),
      end: jest.fn(),
    };
    const stdoutHandlers = {};
    const stderrHandlers = {};
    const closeHandlers = {};

    const spawnMock = jest.fn(() => ({
      stdin,
      stdout: { on: jest.fn((event, handler) => { stdoutHandlers[event] = handler; }) },
      stderr: { on: jest.fn((event, handler) => { stderrHandlers[event] = handler; }) },
      on: jest.fn((event, handler) => { closeHandlers[event] = handler; }),
    }));

    jest.doMock('child_process', () => ({
      spawn: spawnMock,
    }));

    const { SubagentDispatcher } = require('../../.aios-core/core/execution/subagent-dispatcher');
    const dispatcher = new SubagentDispatcher({ rootPath: process.cwd() });

    const resultPromise = dispatcher.executeClaude("dangerous 'prompt' $(whoami)");

    stdoutHandlers.data(Buffer.from('done'));
    closeHandlers.close(0);

    const result = await resultPromise;

    const expectedCommand = process.platform === 'win32' ? 'claude.cmd' : 'claude';

    expect(spawnMock).toHaveBeenCalledWith(
      expectedCommand,
      ['--print', '--dangerously-skip-permissions'],
      expect.objectContaining({
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe'],
      }),
    );
    expect(stdin.write).toHaveBeenCalledWith("dangerous 'prompt' $(whoami)");
    expect(stdin.end).toHaveBeenCalled();
    expect(result.success).toBe(true);
    expect(result.output).toBe('done');
  });
});
