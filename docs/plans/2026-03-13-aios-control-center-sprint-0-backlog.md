# Plano: AIOS Control Center Sprint 0 Backlog

## Objetivo

Quebrar a fundacao obrigatoria do AIOS Control Center em stories tecnicas pequenas, dependentes e implementaveis.

## Ordem de execucao

1. Persistencia local-first
2. Adapters de leitura do repo
3. Tipos e snapshot agregado
4. Validacao automatizada da fundacao

## Stories do Sprint 0

### WS-015: Persistencia local-first

Objetivo:
- criar a camada minima de persistencia para `session_context`, `human_decision_log` e `agent_invocation_log`

Arquivos-alvo:
- `.aios-core/data/control-center/session-context.json`
- `.aios-core/data/control-center/human-decision-log.jsonl`
- `.aios-core/data/control-center/agent-invocation-log.jsonl`
- `apps/brand-console/lib/control-center/adapters/session-context.ts`
- `apps/brand-console/lib/control-center/adapters/human-decisions.ts`
- `apps/brand-console/lib/control-center/adapters/agent-invocations.ts`
- `tests/unit/control-center/persistence-foundation.test.js`

Dependencia:
- nenhuma

### WS-016: Adapters de leitura do repo

Objetivo:
- implementar adapters puros para agentes, workflows, stories e clones

Arquivos-alvo:
- `apps/brand-console/lib/control-center/adapters/agents.ts`
- `apps/brand-console/lib/control-center/adapters/workflows.ts`
- `apps/brand-console/lib/control-center/adapters/stories.ts`
- `apps/brand-console/lib/control-center/adapters/clones.ts`
- `apps/brand-console/lib/control-center/adapters/improvements.ts`
- `tests/unit/control-center/repo-adapters.test.js`

Dependencia:
- WS-015

### WS-017: Tipos e snapshot agregado

Objetivo:
- definir contratos de tipos e builder unico do snapshot do dashboard

Arquivos-alvo:
- `apps/brand-console/lib/control-center/types.ts`
- `apps/brand-console/lib/control-center/build-dashboard-snapshot.ts`
- `tests/unit/control-center/dashboard-snapshot.test.js`

Dependencia:
- WS-015
- WS-016

### WS-018: Validacao da fundacao Sprint 0

Objetivo:
- garantir que a fundacao do Sprint 0 esteja coerente, sem UI e com contratos minimos validados

Arquivos-alvo:
- `tests/unit/control-center/sprint-0-foundation-contracts.test.js`
- `docs/stories/workspace/story-aios-control-center-sprint-0-validation.md`

Dependencia:
- WS-015
- WS-016
- WS-017

## Criterio de saida do Sprint 0

O Sprint 0 pode ser considerado concluido quando:

- a persistencia minima existe e e legivel
- os adapters leem artefatos reais do repo
- o snapshot agregado e construido a partir dos adapters
- a fundacao inteira esta coberta por testes
- nenhuma rota de UI do Control Center foi aberta antes disso
