# AIOS Control Center MVP Spec

Data: 2026-03-13

## Objetivo

Transformar o discovery do AIOS Control Center em uma especificacao de MVP implementavel, com superficie tecnica real no repositorio e backlog inicial de entrega.

## Fonte de verdade

- Discovery do produto: `docs/plans/2026-03-13-aios-control-center-design.md`
- App host do MVP: `apps/brand-console/`
- Agentes reais: `.aios-core/development/agents/`
- Workflows reais: `.aios-core/development/workflows/`
- Clones reais: `experts/`
- Registry estrutural: `.aios-core/data/entity-registry.yaml`

## Decisao de superficie

### Onde o MVP deve nascer

O MVP deve ser implementado dentro de `apps/brand-console`, nao em um app novo.

Razoes:
- ja existe app Next operacional
- reduz custo de bootstrap
- permite validar a experiencia sem abrir outra superficie
- encaixa com o uso interno do Control Center

### Regra de convivio com o app atual

- manter a raiz atual do app
- adicionar uma area dedicada em `/control-center`

## Sprint 0: fundacao obrigatoria

Nenhuma tela do Control Center nasce antes do Sprint 0.

### Persistencia minima obrigatoria

Arquivos:
- `.aios-core/data/control-center/session-context.json`
- `.aios-core/data/control-center/human-decision-log.jsonl`
- `.aios-core/data/control-center/agent-invocation-log.jsonl`

Regras:
- `session_context` em JSON unico
- logs em JSONL append-only
- leitura e escrita apenas server-side

### Adapters obrigatorios

- `agent_adapter`
- `workflow_adapter`
- `story_adapter`
- `clone_adapter`

Regras:
- adapters sao leitores puros
- adapters normalizam schema
- adapters nao inferem prioridade de negocio
- refresh manual, sem polling continuo

## Escopo exato do MVP

O MVP e uma central operacional interna de leitura e navegacao assistida.

Ele deve entregar:
- visao consolidada do trabalho atual
- navegacao por 4 dominios principais
- leitura de agentes, workflows, stories e backlog P1 derivado
- visualizacao de status de sites como subdominio da home
- cards com flags de revisao humana
- links para artefatos reais do repo
- persistencia minima entre sessoes locais

Ele nao deve entregar:
- execucao completa de agentes pela interface
- execucao de workflow pela UI
- edicao profunda de artefatos
- automacao de handoff
- banco de dados dedicado
- autenticacao e multiusuario
- `Conteudo e Midia` como modulo dedicado
- `comandos sugeridos por contexto`
- wizard de criacao de site
- backlog detalhado de clones

## Navegacao do MVP

### Rota raiz

- `/control-center`

### Rotas de dominio

- `/control-center/agents`
- `/control-center/workflows`
- `/control-center/improvements`

### Rotas de detalhe

- `/control-center/agents/[id]`
- `/control-center/workflows/[id]`
- `/control-center/improvements/[id]`

Observacao:
- `sites` entra no MVP apenas como status na home e em paines agregados
- modulo dedicado de `sites` fica para V2

## Arquitetura de informacao

### 1. Home do Control Center

Blocos:
- `Agora`
- `Stories Ativas`
- `Workflows em Curso`
- `Pendencias Humanas`
- `Sites em Andamento`

### 2. Agentes e Clones

Blocos:
- catalogo de agentes
- matriz de clones
- status de maturidade
- gaps estruturais

### 3. Workflows

Blocos:
- workflows disponiveis
- execucoes ativas
- etapa atual
- bloqueios

Regra:
- o modulo monitora e inspeciona
- a execucao continua fora da UI no MVP

### 4. Melhorias e Backlog

Blocos:
- backlog P1
- bugs operacionais
- gargalos recorrentes
- itens com decisao humana

## Modelo de dados do MVP

### `dashboard_snapshot`

Campos:
- `generated_at`
- `session_context`
- `stories_active`
- `workflow_runs`
- `agents`
- `sites`
- `improvements`
- `human_review_queue`

### `agent_summary`

Campos:
- `id`
- `name`
- `role`
- `commands`
- `source_path`
- `related_workflows`

Fonte:
- `.aios-core/development/agents/`

### `workflow_summary`

Campos:
- `id`
- `name`
- `type`
- `phases`
- `source_path`

Fonte:
- `.aios-core/development/workflows/`

### `story_summary`

Campos:
- `id`
- `title`
- `status`
- `epic`
- `owner`
- `source_path`

Fonte:
- `docs/stories/`

### `clone_summary`

Campos:
- `id`
- `name`
- `status`
- `gaps`
- `source_paths`

Fontes:
- `experts/*/clone_*.yaml`
- `experts/*/README.md`
- `experts/*/dna/compiled_dna.md`
- `.aios-core/data/entity-registry.yaml`

Regra de derivacao:
- `status` e `gaps` derivam apenas de completude estrutural
- `improvement_backlog` do MVP e estrutural, nao semantico

### `site_summary`

Campos:
- `id`
- `name`
- `stage`
- `status`
- `source_paths`

Fonte inicial:
- derivada de stories, planos e playbooks

### `improvement_summary`

Campos:
- `id`
- `title`
- `status`
- `priority`
- `affected_area`
- `source_path`

### `human_review_item`

Campos:
- `id`
- `title`
- `reason`
- `domain`
- `source_path`

### `session_context`

Campos:
- `id`
- `started_at`
- `ended_at`
- `active_items`
- `last_agent_used`
- `open_module`

### `human_decision_log`

Campos:
- `id`
- `item_id`
- `decision_type`
- `context`
- `decided_by`
- `decided_at`
- `outcome`

### `agent_invocation_log`

Campos:
- `id`
- `agent_id`
- `item_id`
- `command`
- `invoked_at`
- `output_summary`
- `duration_ms`
- `status`

## Modelo de autoridade do MVP

| Modulo | Owner do modulo | Owner do item/etapa | Risco/consistencia | Desempate |
|---|---|---|---|---|
| Visao Geral | `@aios-master` | `@aios-master` | `@qa` | `@aios-master` |
| Agentes e Clones | `@architect` | agente responsavel pelo clone | `@qa` | `@aios-master` |
| Workflows | `@pm` | agente dono do workflow | `@qa` | `@aios-master` |
| Melhorias e Backlog | `@analyst` | `@analyst` ou `@architect`, por escopo | `@qa` | `@aios-master` |

Regra:
- divergencia nao e resolvida silenciosamente
- itens sensiveis sobem para revisao humana

## Estrutura tecnica recomendada

### App host

- `apps/brand-console`

### Rotas sugeridas

- `apps/brand-console/app/control-center/page.tsx`
- `apps/brand-console/app/control-center/agents/page.tsx`
- `apps/brand-console/app/control-center/agents/[id]/page.tsx`
- `apps/brand-console/app/control-center/workflows/page.tsx`
- `apps/brand-console/app/control-center/workflows/[id]/page.tsx`
- `apps/brand-console/app/control-center/improvements/page.tsx`
- `apps/brand-console/app/control-center/improvements/[id]/page.tsx`

### Componentes sugeridos

- `apps/brand-console/components/control-center/ControlCenterShell.tsx`
- `apps/brand-console/components/control-center/ControlCenterSidebar.tsx`
- `apps/brand-console/components/control-center/ControlCenterHeader.tsx`
- `apps/brand-console/components/control-center/cards/NowCard.tsx`
- `apps/brand-console/components/control-center/cards/ActiveStoriesCard.tsx`
- `apps/brand-console/components/control-center/cards/WorkflowRunsCard.tsx`
- `apps/brand-console/components/control-center/cards/HumanReviewCard.tsx`
- `apps/brand-console/components/control-center/cards/SitesStatusCard.tsx`
- `apps/brand-console/components/control-center/lists/AgentList.tsx`
- `apps/brand-console/components/control-center/lists/WorkflowList.tsx`
- `apps/brand-console/components/control-center/lists/ImprovementList.tsx`
- `apps/brand-console/components/control-center/detail/DetailPanel.tsx`

### Camada de dados sugerida

- `apps/brand-console/lib/control-center/types.ts`
- `apps/brand-console/lib/control-center/adapters/agents.ts`
- `apps/brand-console/lib/control-center/adapters/workflows.ts`
- `apps/brand-console/lib/control-center/adapters/stories.ts`
- `apps/brand-console/lib/control-center/adapters/clones.ts`
- `apps/brand-console/lib/control-center/adapters/improvements.ts`
- `apps/brand-console/lib/control-center/adapters/session-context.ts`
- `apps/brand-console/lib/control-center/adapters/human-decisions.ts`
- `apps/brand-console/lib/control-center/adapters/agent-invocations.ts`
- `apps/brand-console/lib/control-center/build-dashboard-snapshot.ts`

## Estrategia de dados do MVP

Fase 1:
- implementar persistencia minima local
- implementar adapters reais
- usar fixtures apenas como apoio visual se algum parser auxiliar ainda faltar

Regra:
- a arquitetura nasce com leitura real e persistencia real
- sem depender de polling

## Estados de tela

Cada modulo deve suportar:
- `loading`
- `empty`
- `ready`
- `attention_required`

Estados especiais:
- `human_review_required`
- `source_missing`

## UX rules do MVP

1. Toda tela deve mostrar proxima acao.
2. Toda lista deve mostrar status e responsavel principal.
3. Todo item sensivel deve mostrar `[REQUER REVISAO HUMANA]`.
4. Todo item deve apontar para o artefato de origem.
5. O shell deve permitir navegar sem perder o panorama geral.
6. Quando houver divergencia de autoridade, o item deve mostrar quem decide.

## Aceite funcional do MVP

1. Existe uma area `/control-center` funcional no `brand-console`.
2. O operador consegue navegar entre os 4 dominios principais.
3. A home mostra stories, workflows, pendencias humanas e status de sites.
4. O modulo de agentes lista os agentes reais do sistema.
5. O modulo de workflows lista os workflows versionados do repo.
6. Os modulos mostram links para artefatos de origem.
7. O sistema diferencia claramente itens de leitura simples e itens que exigem revisao humana.
8. O sistema persiste `session_context` entre sessoes locais.
9. O modulo de workflows nao executa workflows pela UI no MVP.

## Backlog tecnico inicial

### Sprint 0

- `session_context`
- `human_decision_log`
- `agent_invocation_log`
- `agent_adapter`
- `workflow_adapter`
- `story_adapter`
- `clone_adapter`

### Sprint 1

- fundacao visual
- Command Center
- Visao Geral

### Sprint 2

- Agentes e Clones
- Workflows

### Sprint 3

- Melhorias e Backlog
- status de sites
- refinamento dos logs e da fila humana

### Sprint 4

- endurecimento dos adapters
- refinamento de estados
- polish de navegacao

## Riscos de implementacao

| Risco | Mitigacao |
|---|---|
| Reabrir escopo do MVP | exigir aprovacao humana |
| Adapter com logica de negocio | limitar a leitura e normalizacao estrutural |
| Estado nao sobreviver entre sessoes | Sprint 0 nasce com persistencia minima |
| Workflow UI inflar para execucao | manter modulo em monitoramento no MVP |
| `clone_adapter` virar heuristica sem controle | derivacao apenas por completude estrutural |

## Prompt de critica para Claude Opus

```text
Analise esta especificacao de MVP como um arquiteto de produto e interface operacional.

Contexto:
- o produto e um AIOS Control Center
- ele deve nascer dentro de apps/brand-console
- o MVP deve ser uma central operacional interna, nao uma IDE completa
- as 3 decisoes arquiteturais ja estao fechadas

Quero que voce critique:
1. se o Sprint 0 esta completo e correto
2. se a tabela de autoridade cobre os conflitos relevantes
3. se os adapters estao bem delimitados
4. se algo do MVP ainda deveria sair
5. se existe algum risco de implementacao nao coberto

Regras:
- priorize riscos reais
- nao reabra decisoes fechadas sem evidencia nova
- marque explicitamente qualquer ponto que dependa de decisao humana
```

## Prompt operacional para AIOS

```text
@aios-master INICIAR IMPLEMENTACAO: AIOS Control Center v3

DECISOES FECHADAS:
1. leitura do repo via server-side adapters sob demanda + snapshot + refresh manual
2. fundacao obrigatoria: session_context + human_decision_log + agent_invocation_log
3. authority model: owner do modulo != owner do item; @qa cobre risco; @aios-master desempata

SEQUENCIA:
Sprint 0: fundacao de dados e adapters
Sprint 1: Command Center + Visao Geral
Sprint 2: Agentes e Clones + Workflows
Sprint 3: Melhorias e Backlog + status de sites

REGRAS:
- organizar por dominio operacional
- adapters sao leitores puros
- `[REQUER REVISAO HUMANA]` bloqueia automacao
- Sites Factory wizard e Conteudo e Midia sao V2
```
