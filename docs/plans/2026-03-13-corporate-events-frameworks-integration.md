# Plano: Corporate Events Expert Frameworks Integration

## Objetivo

Integrar a biblioteca de frameworks de experts ao pipeline de eventos corporativos sem sobrecarregar o `AGENTS.md` raiz.

## Tarefas

### Tarefa 1: Criar story de integracao dos frameworks
**Arquivo:** `docs/stories/workspace/story-corporate-events-frameworks-integration.md`
**Objetivo:** Registrar contexto, criterios e checklist da integracao.
**Verificacao:** Story criada com acceptance criteria e file list.

### Tarefa 2: Criar documento versionado de frameworks
**Arquivo:** `docs/strategy/corporate-events-expert-frameworks.md`
**Objetivo:** Transformar o material conceitual dos experts em biblioteca de referencia para o pipeline.
**Verificacao:** Documento criado com aliases, principios e aplicacao para eventos corporativos.

### Tarefa 3: Conectar o playbook ao novo documento
**Arquivo:** `docs/strategy/corporate-events-sales-pipeline-playbook.md`
**Objetivo:** Explicitar que o playbook consome a biblioteca de frameworks como contexto estrategico.
**Verificacao:** Playbook referencia o novo documento e as aliases principais.

### Tarefa 4: Conectar o workflow ao novo documento
**Arquivo:** `.aios-core/development/workflows/corporate-events-sales-pipeline.yaml`
**Objetivo:** Registrar no workflow onde a biblioteca de frameworks deve ser consultada.
**Verificacao:** Workflow referencia o documento em notas relevantes das etapas.

### Tarefa 5: Expandir a verificacao automatizada
**Arquivo:** `tests/unit/corporate-events-sales-pipeline-artifacts.test.js`
**Objetivo:** Garantir que a biblioteca de frameworks exista e mantenha aliases centrais.
**Verificacao:** Teste cobre a presenca do novo documento e das aliases principais.

### Tarefa 6: Executar quality gates
**Arquivo:** `package.json` (sem mudanca esperada)
**Objetivo:** Validar lint, typecheck e testes do estado final.
**Verificacao:** `npm run lint`, `npm run typecheck` e `npm test` passam.
