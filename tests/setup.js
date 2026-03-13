// Jest setup file
// This file runs before all tests

process.env.NODE_ENV = 'test';
process.env.AIOS_DEBUG = 'false';

if (process.env.SKIP_INTEGRATION_TESTS === undefined) {
  process.env.SKIP_INTEGRATION_TESTS = 'true';
}

if (process.env.SKIP_SPAWN_TESTS === undefined) {
  process.env.SKIP_SPAWN_TESTS = 'true';
}

if (process.env.SKIP_NETWORK_TESTS === undefined) {
  process.env.SKIP_NETWORK_TESTS = 'true';
}

if (process.env.SKIP_CLICKUP_TESTS === undefined) {
  process.env.SKIP_CLICKUP_TESTS = 'true';
}

jest.setTimeout(process.env.CI ? 30000 : 10000);

const originalConsole = {
  log: console.log.bind(console),
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};

const SUPPRESSED_TEST_LOG_PATTERNS = [
  '[Tool Router] Successfully routed MCP tools',
  'Terminal visual indispon',
  'Terminal visual falhou',
  'Execu',
  '[IDS-Updater] Removed entity:',
  '[GreetingBuilder] Project status load failed:',
  '[ContextDetector] File read error, defaulting to new session:',
  '[SessionContext] Failed to load session state:',
  'Checking YAML validity for',
  '[WARN] YAML parse errors in',
  '[WARN] No frontmatter in',
  'Created .env file',
  'Created .env.example file',
  'Updated .gitignore',
  'Created .aios-core/core-config.yaml',
  '[GreetingBuilder] Section builder failed:',
  '[GreetingBuilder] Session detection failed:',
  '[GreetingBuilder] Git config check failed:',
  '[GreetingBuilder] Failed to load config:',
  '[GreetingBuilder] Workflow suggestions failed:',
  '[GreetingBuilder] user_profile validation failed:',
  '[PatternStore] Failed to load:',
  'Template validation warnings:',
  '- Failed to write language to .claude/settings.json',
  'MCP Installation Status:',
  'Browser (Puppeteer): Installed',
  'Exa Web Search: Timeout',
  'Desktop Commander: Error',
  'Configuration:',
  'Installation log:',
  'Skipping symlink test - requires admin on Windows',
  '[IDS Self-Healing] WARNING',
  '[IDS] CRITICAL:',
  'To: @dev',
  'Time: ',
  '[GreetingPreference] Failed to load, using default:',
  '[GreetingPreference] Failed to load config, returning empty:',
  '[GreetingPreference] Config restored from backup',
  'Backup created:',
  'Failed to load session from ',
  '[IDS-Governor] Operation degraded:',
  '[code-intel] No provider available. Code intelligence features disabled.',
  '[llm] Calling',
  '[RAG] Querying NotebookLM for:',
  '[RAG] NotebookLM returned data successfully.',
  '[RAG] NotebookLM query failed:',
  '[RAG] No OPENAI_API_KEY found - embeddings will not be generated',
  '[FinchAgent] Error loading YAML persona:',
  'Force exiting Jest:',
  '[mode-detector] Error checking aios-core repository:',
  'SEARCH-01:',
  'SEARCH-02:',
  'SEARCH-03:',
  'SEARCH-04:',
  'SEARCH-05:',
  'SEARCH-06:',
  'Performance: avg=',
  'Registry load time:',
  'Cleanup:',
  'Cleanup errors:',
  'PASS: settings.json',
  'Cleared ',
  'Warning: Could not capture git commit hash:',
  'Decision logging initialized for story:',
  'Decision Log Summary:',
  'Decision log index updated:',
  'Decision logging not initialized, skipping log generation',
  'Error generating decision log:',
  'Could not clear cache:',
  'settings.json generation failed:',
  'Skills copy failed:',
  'Extra commands copy failed:',
  '════════',
  '────────────────',
  'ℹ [',
  '✓ [',
  '✗ [',
  'ℹ DRY RUN',
  'ℹ Skipping completed subtask:',
  'ℹ Self-critique',
  '⚠ Build paused',
  '⚠ Build stopped',
  '✗ Iteration',
  'Decisions:',
  'Files Modified:',
  'Tests Run:',
  'Duration:',
  'Status:',
  'Log: .ai/',
  'AIOS section already exists in .gitignore, skipping merge',
  'IDE Sync Validation',
  '# IDE Sync Validation Report',
  'checkBeforeWriting: non-null',
  'suggestReuse: non-null',
  'getBlastRadius: non-null',
  'getReferenceImpact: non-null',
  'getDependencyGraph: non-null',
  'getCodebaseOverview: non-null',
  'suggestRelevantFiles: non-null',
  'Phase 1: Build',
  'Agent: @dev | Action: *implement',
  'Preparing phase...',
  'Dispatching to Dex (@dev)',
  'Validating output...',
  'Phase 1 complete',
  '[MegaBrain]',
  '[SurfaceChecker] Criteria file not found:',
  'Invalid mode "invalid_mode" in config, defaulting to "ask"',
  '[IDS] Directory not found:',
  '[IDS] Registry file not found at',
  '[IDS] Registry file is empty.',
  '[OutputFormatter] Agent file not found:',
  '[OutputFormatter] No YAML block found in agent file',
  '[BrownfieldHandler]',
  '[ContentReader]',
  'Constitution generated:',
  '[GreenfieldHandler]',
  '[Conclave]',
  '[DNAMapper]',
  '[SkillGenerator]',
  'No AI provider config found - using defaults',
  'Using primary AI provider:',
  'Created worktree for',
  'Removed worktree for',
  'Cleaned up 1 stale worktrees',
  '[ElicitationEngine] SecurityChecker not found, using basic validation',
  '[synapse:memory-bridge] Timeout after',
  '[synapse:memory-bridge] Provider error:',
];

const SUPPRESSED_TEST_ERROR_PATTERNS = [
  '[IDS-Updater] Batch execution failed: [IDS-Updater] Could not acquire lock:',
  'Failed to load session from ',
  '[atomic-write] Failed to write',
  'Error generating decision log:',
  'Constitution not found:',
  'No articles found in constitution.md',
  'YAML parse error:',
  'Agents directory not found:',
  'Error reading global config:',
];

function shouldSuppressConsole(method, args) {
  if (process.env.AIOS_SUPPRESS_TEST_NOISE === 'false') {
    return false;
  }

  const message = args
    .map((arg) => (typeof arg === 'string' ? arg : String(arg)))
    .join(' ');

  if (message.trim() === '') {
    return true;
  }

  const patterns = method === 'error'
    ? SUPPRESSED_TEST_ERROR_PATTERNS
    : SUPPRESSED_TEST_LOG_PATTERNS;

  return patterns.some((pattern) => message.includes(pattern));
}

function wrapConsoleMethod(method) {
  return (...args) => {
    if (shouldSuppressConsole(method, args)) {
      return;
    }

    return originalConsole[method](...args);
  };
}

console.log = wrapConsoleMethod('log');
console.info = wrapConsoleMethod('info');
console.warn = wrapConsoleMethod('warn');
console.error = wrapConsoleMethod('error');

global.describeIntegration = process.env.SKIP_INTEGRATION_TESTS === 'true'
  ? describe.skip
  : describe;

global.testIntegration = process.env.SKIP_INTEGRATION_TESTS === 'true'
  ? test.skip
  : test;

global.describeSpawnIntegration = process.env.SKIP_SPAWN_TESTS === 'true'
  ? describe.skip
  : describe;

global.testSpawnIntegration = process.env.SKIP_SPAWN_TESTS === 'true'
  ? test.skip
  : test;

// Specialized Gating Helpers
const isWindows = process.platform === 'win32';
const hasNetwork = process.env.SKIP_NETWORK_TESTS !== 'true';
const hasClickUp = process.env.SKIP_CLICKUP_TESTS !== 'true';

global.describeIfWindows = isWindows ? describe : describe.skip;
global.testIfWindows = isWindows ? test : test.skip;

global.describeIfNetwork = hasNetwork ? describe : describe.skip;
global.testIfNetwork = hasNetwork ? test : test.skip;

global.describeIfClickUp = hasClickUp ? describe : describe.skip;
global.testIfClickUp = hasClickUp ? test : test.skip;
