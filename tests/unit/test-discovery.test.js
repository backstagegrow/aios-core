const fs = require('fs');
const os = require('os');
const path = require('path');

const { CoverageAnalyzer } = require('../../.aios-core/infrastructure/scripts/test-discovery.js');

describe('CoverageAnalyzer', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aios-test-discovery-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    delete global.__aiosTestDiscoveryExecuted;
  });

  test('parses coverage settings from JS config without eval', async () => {
    fs.writeFileSync(
      path.join(tmpDir, 'jest.config.js'),
      `
        module.exports = {
          collectCoverage: true,
          collectCoverageFrom: ['src/**/*.js', 'packages/**/*.js'],
          coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
          coverageReporters: ['text', 'lcov'],
          coverageThreshold: {
            global: {
              branches: 70,
              lines: 80,
            },
          },
        };
      `,
    );

    const analyzer = new CoverageAnalyzer(tmpDir);
    const result = await analyzer.analyze();

    expect(result).toMatchObject({
      enabled: true,
      tool: 'jest',
      threshold: 70,
      include: ['src/**/*.js', 'packages/**/*.js'],
      exclude: ['/node_modules/', '/dist/'],
      reportFormats: ['text', 'lcov'],
    });
  });

  test('does not execute expressions found inside JS config files', async () => {
    fs.writeFileSync(
      path.join(tmpDir, 'jest.config.js'),
      `
        module.exports = {
          collectCoverage: true,
          coverageThreshold: {
            global: {
              lines: 85,
            },
          },
          dangerous: (global.__aiosTestDiscoveryExecuted = true),
        };
      `,
    );

    const analyzer = new CoverageAnalyzer(tmpDir);
    const result = await analyzer.analyze();

    expect(global.__aiosTestDiscoveryExecuted).toBeUndefined();
    expect(result.enabled).toBe(true);
    expect(result.threshold).toBe(85);
  });
});
