# Dev Agent Memory (Dex)

## Active Patterns
<!-- Current, verified patterns used by this agent -->

### Key Patterns
- CommonJS (`require`/`module.exports`), NOT ES Modules
- ES2022, Node.js 18+, 2-space indent, single quotes
- Absolute imports always (never relative `../`)
- kebab-case for files, PascalCase for components
- Jest 30.2.0 for testing, `npm test` to run

### Project Structure
- `.aios-core/core/` — Core modules (synapse, session, code-intel, orchestration)
- `.aios-core/development/` — Agents, tasks, templates, scripts
- `.aios-core/infrastructure/` — CI/CD, git detection, project-status
- `tests/` — Test suites (mirrors source structure)
- `docs/stories/` — Story files (active development)

### Git Rules
- NEVER push — delegate to @devops
- Conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`, `refactor:`
- Reference story: `feat: implement feature [Story NOG-18]`

### Common Gotchas
- Windows paths: use forward slashes in code, bash shell not cmd
- `fs.existsSync` for sync checks, `fs.promises` for async
- atomicWriteSync from `.aios-core/core/synapse/utils/atomic-write` for safe file writes
- CodeRabbit runs in WSL, not Windows directly

### Story Workflow
- Read task → Implement → Write tests → Validate → Mark checkbox [x]
- ONLY update: checkboxes, Debug Log, Completion Notes, Change Log, File List
- NEVER modify: Status, Story, AC, Dev Notes, Testing sections

## Promotion Candidates
<!-- Patterns seen across 3+ agents — candidates for CLAUDE.md or .claude/rules/ -->
<!-- Format: - **{pattern}** | Source: {agent} | Detected: {YYYY-MM-DD} -->
- **NEVER push — delegate to @devops** | Source: dev, analyst, sm, data-engineer, ux, qa (6 agents) | Detected: 2026-02-22 | Status: Already elevated to `.claude/rules/agent-authority.md`
- **CommonJS module system (require/module.exports)** | Source: dev, analyst, sm, data-engineer, ux, architect (6 agents) | Detected: 2026-02-22 | Status: Already in CLAUDE.md (Padroes de Codigo)
- **Conventional commits format** | Source: dev, devops, analyst, sm, data-engineer, ux (6 agents) | Detected: 2026-02-22 | Status: Already in CLAUDE.md (Convencoes Git)
- **kebab-case for files** | Source: dev, analyst, sm, data-engineer, ux (5 agents) | Detected: 2026-02-22 | Status: Already in CLAUDE.md (Padroes de Codigo)

## Historical — Story Patterns (2026-02-19)

### Greeting & Activation Pipeline (ACT-6, ACT-7)
- `_safeBuildSection(fn)` wraps section builders with SECTION_TIMEOUT (150ms) + try/catch
- Footer varies: new="*guide", existing="*help + *session-info", workflow="Focused on **{story}**"
- When mocking `resolveConfig`, use `mockReturnValue` not `mockReturnValueOnce` if called multiple times
- ACT-5 changes (lines 661-816 in greeting-builder.js) must NOT be touched

### IDS Verification Gate Engine (IDS-5a)
- `VerificationGate` at `.aios-core/core/ids/verification-gate.js` — Template Method pattern
- `CircuitBreaker` at `.aios-core/core/ids/circuit-breaker.js` — 3-state (CLOSED/OPEN/HALF_OPEN)
- G1(@pm)/G2(@sm): advisory; G3(@po): soft block; G4(@dev): informational
- G3 needs `Boolean()` wrapper: `false || "string"` evaluates to string in JS

### IDS Self-Healing Registry (IDS-4a)
- `RegistryHealer` — 6 detection rules, 5 auto-healers
- Registry entities: `registry.entities[category][entityId]` — need `buildEntityIndex()` to flatten
- Healing backups: `.aios-core/data/registry-backups/healing/`

### Jest Gotchas
- `jest.clearAllMocks()` does NOT reset `mockImplementation()` — only clears call history
- To reset: explicitly restore defaults in `beforeEach` or use `jest.restoreAllMocks()` (spyOn only)
- `jest.mock()` path hoisting: cannot use `path.resolve()` in mock path (hoisted before `const path`)

## Archived
<!-- Patterns no longer relevant — kept for history -->
<!-- Format: - ~~{pattern}~~ | Archived: {YYYY-MM-DD} | Reason: {reason} -->
