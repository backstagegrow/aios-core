const {
  parseCommandString,
  hasShellMetacharacters,
  normalizeExecutable,
} = require('../../scripts/lib/command-utils');

describe('command-utils', () => {
  describe('parseCommandString', () => {
    it('parses simple commands', () => {
      expect(parseCommandString('npm run lint')).toEqual({
        command: 'npm',
        args: ['run', 'lint'],
      });
    });

    it('preserves quoted arguments with spaces', () => {
      expect(parseCommandString('node --eval "console.log(\'hello world\')"')).toEqual({
        command: 'node',
        args: ['--eval', "console.log('hello world')"],
      });
    });

    it('supports single-quoted arguments', () => {
      expect(parseCommandString("git commit -m 'feat: tighten parser'")).toEqual({
        command: 'git',
        args: ['commit', '-m', 'feat: tighten parser'],
      });
    });

    it('throws on empty commands', () => {
      expect(() => parseCommandString('   ')).toThrow('Command must be a non-empty string');
    });
  });

  describe('hasShellMetacharacters', () => {
    it('flags shell control operators', () => {
      expect(hasShellMetacharacters('npm test && npm run lint')).toBe(true);
      expect(hasShellMetacharacters('echo ok | cat')).toBe(true);
      expect(hasShellMetacharacters('echo hi; whoami')).toBe(true);
    });

    it('does not flag simple quoted arguments', () => {
      expect(hasShellMetacharacters('node --eval "console.log(\'ok\')"')).toBe(false);
    });
  });

  describe('normalizeExecutable', () => {
    const originalPlatform = process.platform;

    afterEach(() => {
      Object.defineProperty(process, 'platform', { value: originalPlatform });
    });

    it('keeps executables unchanged on non-windows', () => {
      Object.defineProperty(process, 'platform', { value: 'linux' });
      expect(normalizeExecutable('npm')).toBe('npm');
      expect(normalizeExecutable('node')).toBe('node');
    });

    it('normalizes known shimmed commands on windows', () => {
      Object.defineProperty(process, 'platform', { value: 'win32' });
      expect(normalizeExecutable('npm')).toBe('npm.cmd');
      expect(normalizeExecutable('npx')).toBe('npx.cmd');
      expect(normalizeExecutable('claude')).toBe('claude.cmd');
      expect(normalizeExecutable('node')).toBe('node');
    });
  });
});
