#!/usr/bin/env node

const path = require('path');
const { runCLI } = require('jest');

function parseRunnerArgs(rawArgs = process.argv.slice(2)) {
  const jestArgs = [];
  let live = false;

  for (const arg of rawArgs) {
    if (arg === '--live') {
      live = true;
      continue;
    }

    jestArgs.push(arg);
  }

  return { live, jestArgs };
}

function applyExecutionMode(options = {}) {
  if (options.live) {
    process.env.SKIP_NETWORK_TESTS = 'false';
    process.env.SKIP_CLICKUP_TESTS = 'false';
    return [];
  }

  const skippedSuites = [];

  if (process.env.SKIP_NETWORK_TESTS === undefined) {
    process.env.SKIP_NETWORK_TESTS = 'true';
  }
  if (process.env.SKIP_NETWORK_TESTS === 'true') {
    skippedSuites.push('network');
  }

  if (process.env.SKIP_CLICKUP_TESTS === undefined) {
    process.env.SKIP_CLICKUP_TESTS = 'true';
  }
  if (process.env.SKIP_CLICKUP_TESTS === 'true') {
    skippedSuites.push('clickup-live');
  }

  return skippedSuites;
}

function createJestArgv(positionalArgs = []) {
  const argv = {
    runInBand: true,
    $0: 'node scripts/run-jest.js',
  };

  if (positionalArgs.length > 0) {
    argv._ = positionalArgs;
  }

  return argv;
}

function formatExecutionMessage(options = {}) {
  if (options.live) {
    return '[run-jest] live mode enabled: network and ClickUp suites are active';
  }

  if (!options.skippedSuites || options.skippedSuites.length === 0) {
    return null;
  }

  return `[run-jest] offline mode: skipping ${options.skippedSuites.join(', ')} suites. Run "npm run test:live" for full external coverage.`;
}

async function main() {
  const repoRoot = path.resolve(__dirname, '..');
  process.chdir(repoRoot);

  const { live, jestArgs } = parseRunnerArgs(process.argv.slice(2));
  const skippedSuites = applyExecutionMode({ live });
  const message = formatExecutionMessage({ live, skippedSuites });
  if (message) {
    console.warn(message);
  }

  const argv = createJestArgv(jestArgs);
  const { results } = await runCLI(argv, [repoRoot]);
  process.exit(results.success ? 0 : 1);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = {
  applyExecutionMode,
  createJestArgv,
  formatExecutionMessage,
  parseRunnerArgs,
};
