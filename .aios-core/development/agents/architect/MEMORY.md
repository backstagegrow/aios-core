# Architect Agent Memory (Aria)

## Active Patterns
<!-- Current, verified patterns used by this agent -->

### Architecture Decisions
- CLI First > Observability > UI (Constitution Article I)
- Task-First: Tasks define WHAT, executors are interchangeable
- Provider-agnostic code-intel layer (Code Graph MCP primary)
- SYNAPSE 8-layer context engine (L0-L2 active, L3-L7 disabled per NOG-18)

### Key Architectural Patterns
- Tiered loading in UAP: Critical (80ms) → High (120ms) → Best-effort (180ms)
- Circuit breaker for external providers (code-intel, MCP)
- Atomic writes for file persistence (`atomicWriteSync`)
- ideSync for cross-IDE agent distribution

### Technology Stack
- Node.js 18+, CommonJS, ES2022
- Jest 30.2.0, ESLint, Prettier
- Supabase (database), Vercel (hosting)

### Delegation Rules
- Database schema design → @data-engineer
- Git push/PR → @devops
- Implementation → @dev

### Project Structure
- `.aios-core/core/` — Engine modules
- `docs/architecture/` — Architecture docs
- `docs/prd/` — Sharded PRDs

## Promotion Candidates
<!-- Patterns seen across 3+ agents — candidates for CLAUDE.md or .claude/rules/ -->
<!-- Format: - **{pattern}** | Source: {agent} | Detected: {YYYY-MM-DD} -->

## Historical — EPIC-ACT (2026-02-06)
- UAP: single entry for all 12 agents; 5-way parallel load → 3-phase sequential → GreetingBuilder
- Timeout: 150ms per-loader, 200ms total, fallback greeting on failure
- generate-greeting.js: thin wrapper around UnifiedActivationPipeline (backward compat)
- PermissionMode reads from `.aios/config.yaml`, NOT `.aios-core/core-config.yaml`
- GreetingPreferenceManager reads from `.aios-core/core-config.yaml` (agentIdentity.greeting.preference)
- `*yolo` cycles PermissionMode; does NOT change greeting preference
- 255 tests EPIC-ACT Wave 1+2, 0 regressions

## Archived
<!-- Patterns no longer relevant — kept for history -->
<!-- Format: - ~~{pattern}~~ | Archived: {YYYY-MM-DD} | Reason: {reason} -->
