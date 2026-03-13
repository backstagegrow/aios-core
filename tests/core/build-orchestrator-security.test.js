describe('BuildOrchestrator command execution security', () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('runClaudeCLI invokes claude directly and sends prompt over stdin', async () => {
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
      execSync: jest.fn(),
    }));
    jest.doMock('../../.aios-core/workflow-intelligence/engine/wave-analyzer', () => null);
    jest.doMock('../../.aios-core/infrastructure/scripts/worktree-manager', () => {
      throw new Error('not available');
    });
    jest.doMock('../../.aios-core/core/memory/gotchas-memory', () => {
      throw new Error('not available');
    });

    const { BuildOrchestrator } = require('../../.aios-core/core/execution/build-orchestrator');
    const orchestrator = new BuildOrchestrator({ rootPath: process.cwd() });

    const resultPromise = orchestrator.runClaudeCLI('prompt with `unsafe` chars', process.cwd(), {
      subtaskTimeout: 1234,
      verbose: false,
    });

    stdoutHandlers.data(Buffer.from('ok'));
    closeHandlers.close(0);

    const result = await resultPromise;

    const expectedCommand = process.platform === 'win32' ? 'claude.cmd' : 'claude';

    expect(spawnMock).toHaveBeenCalledWith(
      expectedCommand,
      ['--print', '--dangerously-skip-permissions'],
      expect.objectContaining({
        cwd: process.cwd(),
        timeout: 1234,
      }),
    );
    expect(stdin.write).toHaveBeenCalledWith('prompt with `unsafe` chars');
    expect(stdin.end).toHaveBeenCalled();
    expect(result.stdout).toBe('ok');
  });
});
