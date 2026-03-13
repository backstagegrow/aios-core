'use strict';

const fs = require('fs');
const path = require('path');
const {
  applyExecutionMode,
  createJestArgv,
  formatExecutionMessage,
  parseRunnerArgs,
} = require('../../scripts/run-jest');

describe('run-jest runner helpers', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env.SKIP_NETWORK_TESTS = originalEnv.SKIP_NETWORK_TESTS;
    process.env.SKIP_CLICKUP_TESTS = originalEnv.SKIP_CLICKUP_TESTS;
  });

  test('parseRunnerArgs separates live flag from jest args', () => {
    expect(parseRunnerArgs(['--live', 'tests/unit/run-jest.test.js'])).toEqual({
      live: true,
      jestArgs: ['tests/unit/run-jest.test.js'],
    });
  });

  test('applyExecutionMode enables live suites explicitly', () => {
    process.env.SKIP_NETWORK_TESTS = 'true';
    process.env.SKIP_CLICKUP_TESTS = 'true';

    const skippedSuites = applyExecutionMode({ live: true });

    expect(skippedSuites).toEqual([]);
    expect(process.env.SKIP_NETWORK_TESTS).toBe('false');
    expect(process.env.SKIP_CLICKUP_TESTS).toBe('false');
  });

  test('applyExecutionMode defaults to offline explicitness', () => {
    delete process.env.SKIP_NETWORK_TESTS;
    delete process.env.SKIP_CLICKUP_TESTS;

    const skippedSuites = applyExecutionMode({ live: false });

    expect(skippedSuites).toEqual(['network', 'clickup-live']);
    expect(process.env.SKIP_NETWORK_TESTS).toBe('true');
    expect(process.env.SKIP_CLICKUP_TESTS).toBe('true');
  });

  test('createJestArgv preserves positional test args', () => {
    expect(createJestArgv(['tests/unit/run-jest.test.js'])).toEqual({
      runInBand: true,
      $0: 'node scripts/run-jest.js',
      _: ['tests/unit/run-jest.test.js'],
    });
  });

  test('formatExecutionMessage explains offline mode and live override', () => {
    expect(
      formatExecutionMessage({ live: false, skippedSuites: ['network', 'clickup-live'] }),
    ).toContain('npm run test:live');
    expect(formatExecutionMessage({ live: true, skippedSuites: [] })).toContain('live mode enabled');
  });
});

describe('root package scripts', () => {
  test('package.json defines build and test:live scripts', () => {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', '..', 'package.json'), 'utf8'),
    );

    expect(pkg.scripts.build).toContain('apps/brand-console');
    expect(pkg.scripts.build).toContain('apps/portfolio-porto');
    expect(pkg.scripts['test:live']).toBe('node scripts/run-jest.js --live');
  });
});
