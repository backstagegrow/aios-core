# Synkra AIOS Global Development Rules

These rules apply to all AI agents working on the Synkra AIOS project.

## 1. CLI First (Fundamental Principle)
- All features must work via CLI first.
- The CLI is the source of truth for all orchestration.
- Avoid creating UI-only features.

## 2. Agent Workflow
- Activate agents using `@agent-id` or slash commands.
- Use `*help` to see specific agent capabilities.
- Exit agent mode with `*exit`.

## 3. Story-Driven Development
- No code changes without an active story in `docs/stories/`.
- Maintain checkboxes `[ ]` and File Lists.
- Follow Acceptance Criteria strictly.

## 4. No Invention (Guardrail)
- Do not add features not specified in requirements.
- Specifications must trace back to requirements.

## 5. Quality Standards
- Absolute imports `(@/*)` only for cross-module features.
- Mandatory `npm run lint`, `npm run typecheck`, and `npm test`.
- Consistent error handling with `try/catch` and descriptive messages.

---
*Synkra AIOS Configuration*
