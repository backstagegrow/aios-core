describe('SandboxTester command security', () => {
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

    const SandboxTester = require('../../.aios-core/infrastructure/scripts/sandbox-tester');
    const tester = new SandboxTester();

    const output = await tester.runCommand(process.cwd(), 'node --eval "console.log(\'sandbox\')"');

    expect(output).toBe('ok');
    expect(execaMock).toHaveBeenCalledWith(
      'node',
      ['--eval', "console.log('sandbox')"],
      expect.objectContaining({
        shell: false,
      }),
    );
  });

  it('rejects shell control operators in sandbox commands', async () => {
    jest.doMock('execa', () => ({ execa: jest.fn() }));

    const SandboxTester = require('../../.aios-core/infrastructure/scripts/sandbox-tester');
    const tester = new SandboxTester();

    await expect(
      tester.runCommand(process.cwd(), 'npm test && npm run lint'),
    ).rejects.toThrow('Shell control operators are not allowed');
  });
});
