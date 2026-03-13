# AIOS Control Center Design

Data: 2026-03-13

## Objetivo

Desenhar uma dashboard operacional unica para reduzir o atrito de operar o AIOS no dia a dia.

O objetivo nao e criar apenas uma interface bonita. O objetivo e criar um centro de controle para:

- trabalhar com agentes e clones de forma organizada
- operar workflows e backlog sem depender de memoria manual
- concentrar o que exige revisao humana versus o que pode ser delegado
- criar e evoluir sites com menos dispersao na V2

## Problema atual

Hoje a operacao esta distribuida entre:

- agentes em `.aios-core/development/agents/`
- workflows em `.aios-core/development/workflows/`
- dashboards e leitura estrutural em `.aios-core/core/graph-dashboard/`
- docs e playbooks em `docs/`
- stories e planos operacionais em `docs/stories/` e `docs/plans/`

O sistema tem capacidade, mas falta uma camada unica de operacao.

Isso gera:

- baixa visibilidade do que esta ativo
- friccao para alternar entre agentes, clones, sites e melhorias
- pouca separacao entre descoberta, execucao e auditoria
- dependencia excessiva de prompts soltos

## Tese do produto

O AIOS Control Center deve funcionar como um sistema operacional de execucao.

Nao deve organizar o trabalho por pasta tecnica. Deve organizar por dominio operacional.

A pergunta central da interface precisa ser:

> "O que eu preciso fazer agora, com qual agente, em qual contexto, com qual nivel de autonomia?"

## Principios de produto

1. Centralizar a operacao sem esconder a estrutura real do repo.
2. Separar criacao, execucao, auditoria e manutencao.
3. Mostrar sempre contexto, proxima acao, artefatos relacionados e responsavel principal.
4. Tornar explicito o que requer revisao humana.
5. Reusar agentes, workflows e playbooks existentes em vez de reinventar outro sistema paralelo.
6. Tratar o repo como fonte de verdade estrutural e o estado derivado como memoria operacional local.
7. Declarar autoridade por modulo e por item sem ambiguidade.

## Decisoes arquiteturais fechadas

Estas decisoes estao fechadas para o MVP.

### Decisao 1: contrato de leitura do repo

Mecanismo:
- leitura server-side sob demanda
- adapters por tipo de artefato
- parsing deterministico de Markdown e YAML
- snapshot agregado para a home
- refresh manual
- sem polling continuo

Regra:
- adapters sao leitores puros
- adapters normalizam schema
- adapters nao carregam logica de negocio

### Decisao 2: persistencia minima obrigatoria

Substrato local-first do MVP:
- `.aios-core/data/control-center/session-context.json`
- `.aios-core/data/control-center/human-decision-log.jsonl`
- `.aios-core/data/control-center/agent-invocation-log.jsonl`

Regra:
- `session_context` em JSON unico
- logs em JSONL append-only
- leitura e escrita apenas server-side
- nenhuma dessas estruturas substitui artefatos canonicos do repo

### Decisao 3: modelo de autoridade

Separar:
- owner do modulo
- owner do item ou etapa
- owner de risco e consistencia
- desempate global

Regra:
- `@qa` cobre risco e consistencia
- `@aios-master` desempata globalmente

## Fonte de verdade e estado persistente

O Control Center tem duas categorias de verdade:

### Verdade estrutural

Fica no proprio repositorio:

- agentes em `.aios-core/development/agents/`
- workflows em `.aios-core/development/workflows/`
- stories em `docs/stories/`
- planos e playbooks em `docs/plans/` e `docs/strategy/`
- clones em `experts/`
- registry estrutural em `.aios-core/data/entity-registry.yaml`

### Verdade operacional derivada

Precisa persistir entre sessoes para que a dashboard tenha memoria minima de operacao.

Escopo minimo:
- sessao ativa
- fila de decisoes humanas
- historico resumido de invocacoes e transicoes

Esse estado nao substitui os artefatos do repo. Ele registra apenas o que o repo nao modela sozinho entre sessoes.

## Estrutura de navegacao

## MVP

O MVP tem 4 modulos principais.

### 1. Visao Geral

Owner do modulo:
- `@aios-master`

Pergunta que responde:
- "Qual e o panorama agora?"

Conteudo:
- stories ativas
- workflows em andamento
- itens bloqueados
- pendencias humanas
- status operacional de sites

### 2. Agentes e Clones

Owner do modulo:
- `@architect`

Pergunta que responde:
- "Com quem operar e o que falta evoluir?"

Conteudo:
- lista de agentes reais
- status de clones
- gaps estruturais por clone

### 3. Workflows

Owner do modulo:
- `@pm`

Pergunta que responde:
- "Que pipeline esta rodando e o que falta?"

Conteudo:
- workflows disponiveis
- execucoes ativas
- etapa atual
- bloqueios

Observacao:
- no MVP, este modulo monitora e inspeciona
- execucao pela UI fica fora do MVP

### 4. Melhorias e Backlog

Owner do modulo:
- `@analyst`

Pergunta que responde:
- "O que melhora o sistema com menos atrito?"

Conteudo:
- backlog P1/P2/P3
- bugs operacionais
- gargalos recorrentes
- melhorias com dependencia humana

## V2

Entram apenas depois do MVP validar:

- `Sites Factory` como modulo dedicado e wizard de criacao
- `Conteudo e Midia`
- comandos sugeridos por contexto
- backlog detalhado de clones
- filtros avancados

## V3

- memoria operacional avancada
- recomendacoes automaticas de proxima acao
- score de maturidade por clone e por site
- automacao assistida de handoff
- visao unificada de operacao, sites e conteudo

## Arquitetura funcional

### Camada 1: Command Center

Tela principal que mostra:

- prioridade operacional
- alertas
- itens em andamento
- proximas acoes
- widgets por dominio

### Camada 2: Hubs de dominio

Cada hub corresponde a um dos 4 modulos do MVP.

### Camada 3: Workspace detalhado

Ao entrar em um item, a dashboard mostra:

- contexto
- artefatos relacionados
- status
- owner da etapa
- riscos
- aprovacoes humanas pendentes

### Camada 4: Server-side adapters

Adapters do MVP:
- `agent_adapter`
- `workflow_adapter`
- `story_adapter`
- `clone_adapter`

## Modelo de autoridade

Owner do modulo nao e o mesmo papel do owner do item ou etapa.

| Modulo | Owner do modulo | Owner do item/etapa | Risco/consistencia | Desempate |
|---|---|---|---|---|
| Visao Geral | `@aios-master` | `@aios-master` | `@qa` | `@aios-master` |
| Agentes e Clones | `@architect` | agente responsavel pelo clone | `@qa` | `@aios-master` |
| Workflows | `@pm` | agente dono do workflow | `@qa` | `@aios-master` |
| Melhorias e Backlog | `@analyst` | `@analyst` ou `@architect`, por escopo | `@qa` | `@aios-master` |
| Sites Factory (V2) | `@architect` | `@ux-design-expert` por etapa visual, `@architect` por etapa tecnica | `@qa` | `@aios-master` |

## Modelo de dados minimo

### Entidades de fundacao do MVP

#### `session_context`

Campos:
- `id`
- `started_at`
- `ended_at`
- `active_items`
- `last_agent_used`
- `open_module`

#### `human_decision_log`

Campos:
- `id`
- `item_id`
- `decision_type`
- `context`
- `decided_by`
- `decided_at`
- `outcome`

#### `agent_invocation_log`

Campos:
- `id`
- `agent_id`
- `item_id`
- `command`
- `invoked_at`
- `output_summary`
- `duration_ms`
- `status`

### Entidades operacionais do MVP

#### `workspace_item`

Campos:
- `id`
- `type`
- `title`
- `status`
- `priority`
- `owner_agent`
- `human_review_required`
- `source_paths`

#### `agent_profile`

Campos:
- `id`
- `name`
- `role`
- `available_commands`
- `domain`
- `related_workflows`

#### `clone_profile`

Campos:
- `id`
- `name`
- `purpose`
- `status`
- `gaps`
- `improvement_backlog`

Derivacao:
- fonte primaria: `experts/*/clone_*.yaml`
- apoio: `experts/*/README.md`, `experts/*/dna/compiled_dna.md`, notebooks e `.aios-core/data/entity-registry.yaml`
- `status` deriva apenas de completude estrutural
- `gaps` = artefatos obrigatorios ausentes ou incompletos
- `improvement_backlog` = backlog estrutural derivado de gaps

Regra:
- o `clone_adapter` nao infere estrategia, qualidade de negocio ou prioridade

#### `workflow_run`

Campos:
- `id`
- `workflow_id`
- `current_step`
- `mode`
- `status`
- `outputs`
- `blocked_by`

#### `improvement_item`

Campos:
- `id`
- `title`
- `scope`
- `affected_area`
- `priority`
- `status`
- `needs_human_decision`

## Cards principais por modulo

### Visao Geral

- `Agora`
- `Bloqueios`
- `Stories Ativas`
- `Workflows em Curso`
- `Pendencias Humanas`
- `Sites em Andamento`

### Agentes e Clones

- `Mapa de Agentes`
- `Clones em Evolucao`
- `Lacunas por Clone`

### Workflows

- `Workflows Disponiveis`
- `Execucoes Ativas`
- `Etapa Atual`
- `Bloqueios`

### Melhorias e Backlog

- `P1 do Sistema`
- `Bugs Operacionais`
- `Melhorias de Clones`
- `Automacoes Pendentes`

## Fluxos prioritarios

### Fluxo 1: Operar workflow existente

1. Entrar em `Workflows`
2. Escolher workflow
3. Ver estado atual, bloqueios e owner da etapa
4. Encaminhar itens com revisao humana
5. Continuar a execucao fora da UI

### Fluxo 2: Evoluir clone

1. Entrar em `Agentes e Clones`
2. Selecionar clone
3. Ver status e gaps
4. Abrir melhoria
5. Associar story e agente executor

### Fluxo 3: Triar backlog

1. Entrar em `Melhorias e Backlog`
2. Filtrar por prioridade
3. Separar itens com decisao humana
4. Encaminhar ou delegar conforme owner

## MVP, V2 e V3

## MVP

Objetivo:
- central operacional interna utilitaria

Escopo:
- dashboard com 4 modulos principais
- visualizacao de status de sites na home
- leitura de stories, workflows, agentes e melhorias P1
- cards de status
- links para artefatos
- flags de revisao humana
- persistencia minima entre sessoes

Nao entra:
- automacao profunda
- edicao completa dentro da UI
- controle fino de execucao por agente
- execucao de workflow pela UI
- `Conteudo e Midia`
- `comandos sugeridos por contexto`
- wizard completo de `Sites Factory`
- backlog detalhado de clones

## V2

- `Sites Factory` dedicado
- `Conteudo e Midia`
- comandos sugeridos por contexto
- acionamento assistido de workflows
- wizard de site
- backlog detalhado de clones

## V3

- memoria operacional consolidada
- recomendacoes automaticas
- score de maturidade
- handoff assistido
- visao unificada ampliada

## Riscos

| Risco | Impacto | Mitigacao |
|---|---|---|
| Reabrir escopo do MVP | Alto | Mudanca so com aprovacao humana |
| Organizar por pasta tecnica | Alto | Navegacao sempre por pergunta operacional |
| Adapter com logica de negocio | Alto | Adapter leitor puro, so schema e completude |
| Misturar decisao humana com automacao | Alto | `[REQUER REVISAO HUMANA]` bloqueia execucao automatica |
| Estado nao persistido entre sessoes | Alto | Sprint 0 nasce com 3 entidades de fundacao |
| Conflito de autoridade sem desempate | Medio | `@aios-master` desempata globalmente |

## Recomendacao final

Construir primeiro uma dashboard de operacao interna com 4 modulos.

Antes de qualquer UI:
1. fechar e implementar a fundacao local-first
2. implementar os 4 adapters
3. validar a tabela de autoridade
4. so depois abrir o Command Center

## Prompt para validacao no Claude Opus

```text
Analise criticamente o design abaixo como um arquiteto de produto e sistema operacional de IA.

Objetivo:
- validar se a proposta de AIOS Control Center faz sentido para organizar agentes, clones, workflows e backlog de melhorias em uma dashboard unica

Contexto:
- o sistema ja possui agentes versionados, workflows versionados, stories, planos, playbooks e um graph dashboard tecnico
- o problema nao e falta de capacidade, e falta de uma camada operacional unica para reduzir atrito
- as 3 decisoes arquiteturais do MVP ja estao fechadas

O que eu quero de voce:
1. critique riscos de implementacao
2. valide se o Sprint 0 esta suficiente
3. valide se a tabela de autoridade cobre conflitos relevantes
4. diga se algum adapter ainda corre risco de logica de negocio vazando
5. diga se algo do MVP ainda deveria sair

Regras:
- seja direto
- priorize riscos reais
- nao reabra decisoes fechadas sem evidência nova
- marque explicitamente qualquer ponto que exija decisao humana
```

## Prompt operacional curto

```text
@aios-master INICIAR DESENHO: AIOS Control Center v3

DECISOES FECHADAS:
1. leitura do repo via server-side adapters sob demanda + snapshot + refresh manual
2. fundacao obrigatoria: session_context + human_decision_log + agent_invocation_log
3. authority model: owner do modulo != owner do item; @qa cobre risco; @aios-master desempata

MVP:
- Visao Geral
- Agentes e Clones
- Workflows
- Melhorias e Backlog
- Sites apenas como status na home

REGRAS:
- organizar por dominio operacional
- adapters sao leitores puros
- `[REQUER REVISAO HUMANA]` bloqueia automacao
- nao escrever codigo ainda
```
