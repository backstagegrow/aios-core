# QA Agent Memory (Quinn)

## Active Patterns
<!-- Current, verified patterns used by this agent -->

### Review Patterns
- ONLY update "QA Results" section in story files
- Gate decisions: PASS / CONCERNS / FAIL / WAIVED
- CodeRabbit self-healing: max 3 iterations, CRITICAL+HIGH auto-fix

### Test Infrastructure
- `npm test` — Jest 30.2.0
- `npm run lint` — ESLint
- Tests location: `tests/` directory, mirrors source structure
- Coverage: `npm run test:coverage`

### Quality Checks (7-point)
1. Code review (patterns, readability)
2. Unit tests (coverage, passing)
3. Acceptance criteria met
4. No regressions
5. Performance acceptable
6. Security (OWASP basics)
7. Documentation updated

### Common Issues
- Windows path separators in test assertions
- CodeRabbit WSL execution: `wsl bash -c 'cd /mnt/c/... && ~/.local/bin/coderabbit ...'`
- SYNAPSE metrics at `.synapse/metrics/`
- Pipeline benchmarks at `tests/synapse/benchmarks/`

### Git Rules
- Read-only: `git status`, `git log`, `git diff`
- NEVER commit or push

## Promotion Candidates
<!-- Patterns seen across 3+ agents — candidates for CLAUDE.md or .claude/rules/ -->
<!-- Format: - **{pattern}** | Source: {agent} | Detected: {YYYY-MM-DD} -->

## Historical — IDS Module Patterns (2026-02-10)
- Test fixtures: `tests/core/ids/fixtures/` (valid-registry.yaml, empty-registry.yaml)
- Full IDS regression: 359 tests, 8 suites
- Circuit breaker defaults: failure_threshold=5, success_threshold=3, reset_timeout_ms=60000
- Shared utilities (computeChecksum, extractKeywords) in `populate-entity-registry.js` — do NOT duplicate
- Registry write: `yaml.dump(data, { lineWidth: 120, noRefs: true, sortKeys: false })`
- Audit logs: JSONL format, 5MB rotation cap, non-blocking failures
- RegistryLoader: `_findById`, `_getAllEntities`, `_ensureLoaded` are underscore "internal" but used by FrameworkGovernor
- Gates ONLY use `IncrementalDecisionEngine.analyze()` — never private methods

## Archived
<!-- Patterns no longer relevant — kept for history -->
<!-- Format: - ~~{pattern}~~ | Archived: {YYYY-MM-DD} | Reason: {reason} -->
