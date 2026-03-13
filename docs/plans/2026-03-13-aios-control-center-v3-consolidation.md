# Plano: AIOS Control Center V3 Consolidation

## Objetivo

Consolidar a versao v3 do AIOS Control Center nos artefatos versionados do repo.

## Tarefas

### Tarefa 1: Criar story de consolidacao
**Arquivo:** `docs/stories/workspace/story-aios-control-center-v3-consolidation.md`
**Objetivo:** Registrar contexto, criterios e checklist da rodada v3.
**Verificacao:** Story criada com acceptance criteria e file list.

### Tarefa 2: Atualizar design doc
**Arquivo:** `docs/plans/2026-03-13-aios-control-center-design.md`
**Objetivo:** Fechar persistencia, clone adapter, autoridade e corte do MVP.
**Verificacao:** Design doc alinhado com a v3 executiva.

### Tarefa 3: Atualizar spec do MVP
**Arquivo:** `docs/plans/2026-03-13-aios-control-center-mvp-spec.md`
**Objetivo:** Alinhar Sprint 0, surface tecnica e backlog ao corte consolidado do MVP.
**Verificacao:** Spec reflete cockpit operacional, sem execucao de workflow na UI.

### Tarefa 4: Executar quality gates
**Arquivo:** `package.json` (sem mudanca esperada)
**Objetivo:** Validar o estado final da documentacao.
**Verificacao:** `npm run lint`, `npm run typecheck` e `npm test` passam.
