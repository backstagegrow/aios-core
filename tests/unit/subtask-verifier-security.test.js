describe('SubtaskVerifier command security', () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('parses quoted command arguments without shell mode', async () => {
    const execaMock = jest.fn().mockResolvedValue({
      stdout: 'ok',
      stderr: '',
      exitCode: 0,
    });

    jest.doMock('execa', () => ({ execa: execaMock }));

    const { SubtaskVerifier } = require('../../.aios-core/infrastructure/scripts/subtask-verifier');

    const verifier = new SubtaskVerifier({
      implementationPath: __filename,
      cwd: process.cwd(),
    });

    const result = await verifier._verifyCommand(
      { command: 'node --eval "console.log(\'secure\')"' },
      1000,
    );

    expect(result.passed).toBe(true);
    expect(execaMock).toHaveBeenCalledWith(
      'node',
      ['--eval', "console.log('secure')"],
      expect.objectContaining({
        shell: false,
      }),
    );
  });

  it('rejects shell control operators in command verification', async () => {
    jest.doMock('execa', () => ({ execa: jest.fn() }));

    const { SubtaskVerifier } = require('../../.aios-core/infrastructure/scripts/subtask-verifier');

    const verifier = new SubtaskVerifier({
      implementationPath: __filename,
      cwd: process.cwd(),
    });

    await expect(
      verifier._verifyCommand({ command: 'echo ok && whoami' }, 1000),
    ).rejects.toThrow('Shell control operators are not allowed');
  });
});
