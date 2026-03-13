# Plano: Corporate Events Sales Pipeline Operationalization

## Objetivo

Transformar o comando operacional validado em artefatos reais do AIOS:
- workflow formal executavel pelo sistema
- playbook humano versionado no repositório
- verificação automatizada mínima

## Tarefas

### Tarefa 1: Criar story de institucionalização
**Arquivo:** `docs/stories/workspace/story-corporate-events-sales-pipeline-operationalization.md`
**Objetivo:** Registrar contexto, critérios e checklist da mudança.
**Verificação:** Story criada com acceptance criteria e file list inicial.

### Tarefa 2: Criar workflow formal do pipeline
**Arquivo:** `.aios-core/development/workflows/corporate-events-sales-pipeline.yaml`
**Objetivo:** Codificar as etapas, agentes, outputs, handoffs e guidance no formato nativo do AIOS.
**Verificação:** YAML criado com `workflow.id`, `sequence`, `decision_guidance` e `handoff_prompts`.

### Tarefa 3: Criar playbook humano
**Arquivo:** `docs/strategy/corporate-events-sales-pipeline-playbook.md`
**Objetivo:** Versionar a versão operacional/humana do comando para uso recorrente.
**Verificação:** Documento criado com modo workshop, modo execução, comandos pontuais e regras globais.

### Tarefa 4: Atualizar catálogo de workflows
**Arquivo:** `.aios-core/development/workflows/README.md`
**Objetivo:** Incluir o novo workflow na lista de workflows disponíveis.
**Verificação:** README menciona `corporate-events-sales-pipeline.yaml`.

### Tarefa 5: Adicionar teste de artefatos
**Arquivo:** `tests/unit/corporate-events-sales-pipeline-artifacts.test.js`
**Objetivo:** Garantir que o workflow e o playbook permaneçam presentes e com estrutura mínima.
**Verificação:** Teste falha sem os artefatos e passa com eles.

### Tarefa 6: Executar quality gates
**Arquivo:** `package.json` (sem mudança esperada)
**Objetivo:** Validar lint, typecheck e testes do estado final.
**Verificação:** `npm run lint`, `npm run typecheck`, `npm test` passam.
