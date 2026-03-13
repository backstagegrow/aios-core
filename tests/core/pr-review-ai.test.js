/**
 * AI Pull Request Reviewer - Test Suite
 */

const { PRReviewAI } = require('../../.aios-core/infrastructure/scripts/pr-review-ai');

jest.mock('../../scripts/lib/command-utils', () => ({
  resolveCommandSpec: jest.fn().mockImplementation((cmd) => ({
    command: cmd.split(' ')[0],
    args: cmd.split(' ').slice(1),
  })),
}));

const { execFileSync } = require('child_process');
jest.mock('child_process', () => ({
  execFileSync: jest.fn(),
  spawn: jest.fn(),
}));

describe('PRReviewAI', () => {
  let reviewer;

  beforeEach(() => {
    reviewer = new PRReviewAI({ rootPath: process.cwd(), enableAI: true });
    jest.clearAllMocks();
  });

  test('constructor initializes with config', () => {
    expect(reviewer.rootPath).toBe(process.cwd());
    expect(reviewer.enableAI).toBe(true);
  });

  test('reviewLocal calls git diff', async () => {
    execFileSync.mockReturnValue('diff content');
    reviewer.diffAnalyzer = {
      parseDiff: jest.fn().mockReturnValue([]),
      getStats: jest.fn().mockReturnValue({ filesChanged: 0, additions: 0, deletions: 0 }),
      getAddedLines: jest.fn().mockReturnValue([]),
    };
    reviewer.securityAnalyzer = { analyze: jest.fn().mockReturnValue([]) };
    reviewer.performanceAnalyzer = { analyze: jest.fn().mockReturnValue([]) };
    reviewer.codeQualityAnalyzer = { analyze: jest.fn().mockReturnValue([]) };
    reviewer.redundancyAnalyzer = { analyze: jest.fn().mockReturnValue([]) };

    const result = await reviewer.reviewLocal('main');

    expect(execFileSync).toHaveBeenCalledWith(
      'git',
      ['diff', 'main...HEAD'],
      expect.objectContaining({ cwd: reviewer.rootPath, encoding: 'utf8' }),
    );
    expect(result.verdict).toBe('approve');
  });
});
