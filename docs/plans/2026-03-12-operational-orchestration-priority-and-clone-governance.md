# Operational Orchestration, Priority, and Clone Governance

Data: 2026-03-12

## Objetivo

Consolidar em um unico artefato operacional:

- a arvore de decisao do Bob
- a ordem canonica dos fluxos de agentes
- as prioridades deterministicas ja implementadas
- o estado atual dos clones e a ordem de promocao

Este documento nao cria novas regras. Ele consolida o que ja esta declarado em codigo, workflows e planos existentes.

## Artefatos-base

- Constituicao do sistema: `.aios-core/constitution.md`
- Roteamento principal: `.aios-core/core/orchestration/bob-orchestrator.js`
- Ordem canonica dos chains: `.aios-core/data/workflow-chains.yaml`
- Atribuicao deterministica de executor e quality gate: `.aios-core/core/orchestration/executor-assignment.js`
- Execucao do ciclo de desenvolvimento: `.aios-core/core/orchestration/workflow-executor.js`
- Estado atual dos clones: `docs/plans/2026-03-12-clone-readiness-matrix.md`

## Hierarquia operacional de consulta

Para operacao diaria, a leitura correta do sistema segue esta ordem:

1. Constituicao
2. Bob Orchestrator
3. Workflow Chains
4. Executor Assignment
5. Workflow Executor
6. Clone Readiness Matrix

Leitura pratica:

- a Constituicao define as regras maes
- o Bob decide para qual fluxo ir
- os Workflow Chains definem a ordem canonica dos agentes
- o Executor Assignment define quem executa e quem revisa
- o Workflow Executor materializa o ciclo de execucao
- a matriz de clones define o estado e a promocao do catalogo

## Regras maes da operacao

Derivadas da Constituicao:

1. `CLI First`
O CLI e a fonte de verdade. Dashboards observam e nao decidem.

2. `Agent Authority`
Autoridades exclusivas nao podem ser violadas. Exemplo: `@devops` retém push, PR e release.

3. `Story-Driven Development`
Todo desenvolvimento parte de story valida com acceptance criteria e checklist rastreavel.

4. `Quality First`
O fechamento operacional minimo exige `lint`, `typecheck`, `test` e `build` bem-sucedidos.

## Arvore de decisao do Bob

O Bob usa roteamento codificado, sem depender de decisao por LLM para escolher o fluxo.

### Ordem pratica da decisao

1. Verificar toggle de educational mode no input atual
2. Adquirir lock de orquestracao
3. Carregar estado de sessao
4. Detectar estado do projeto
5. Se existir sessao anterior, oferecer fluxo de resume
6. Roteiar pelo estado do projeto

### Estados de projeto e rota correspondente

| Estado | Criterio | Rota operacional |
| --- | --- | --- |
| `GREENFIELD` | sem `package.json`, sem `.git`, sem `docs/` | `GreenfieldHandler` |
| `NO_CONFIG` | projeto existe, mas sem config resolvida | onboarding |
| `EXISTING_NO_DOCS` | config existe, mas sem `docs/architecture` | `BrownfieldHandler` |
| `EXISTING_WITH_DOCS` | config e docs de arquitetura presentes | fluxo normal de objetivo/story |

## Prioridades deterministicas ja implementadas

### Prioridade de modo educacional

Implementada no Bob:

1. session override
2. user config
3. default `false`

### Prioridade de roteamento

No ciclo de entrada do Bob, a pratica atual e:

1. comandos explicitos do usuario que alteram modo
2. estado de sessao existente
3. estado estrutural do projeto detectado

### Prioridade de executor

Implementada em `executor-assignment.js` por keyword matching deterministico.

Tipos principais:

1. `code_general` -> executor `@dev`, quality gate `@architect`
2. `database` -> executor `@data-engineer`, quality gate `@dev`
3. `infrastructure` -> executor `@devops`, quality gate `@architect`
4. `ui_ux` -> executor `@ux-design-expert`, quality gate `@dev`
5. `research` -> executor `@analyst`, quality gate `@pm`
6. `architecture` -> executor `@architect`, quality gate `@pm`

Regra fixa:

- o quality gate deve ser diferente do executor

## Ordem canonica dos fluxos de agentes

## Fluxo principal

O fluxo principal declarado em `workflow-chains.yaml` e o `Story Development Cycle`.

Ordem canonica:

1. `@sm` -> `*draft`
2. `@po` -> `*validate-story-draft {story-id}`
3. `@dev` -> `*develop {story-id}` ou `*develop-yolo {story-id}`
4. `@qa` -> `*review {story-id}` ou `*gate {story-id}`
5. `@devops` -> `*push`

Esse e o caminho principal para desenvolvimento regular.

## Fluxos especializados

### QA Loop

Uso: quando o codigo ja existe e o gate reprova.

Ordem:

1. `@qa` revisa
2. `@dev` corrige
3. `@qa` revisa novamente

### Spec Pipeline

Uso: antes de implementacao quando a mudanca exige especificacao mais formal.

Ordem:

1. `@pm` levanta requisitos
2. `@architect` analisa impacto
3. `@analyst` pesquisa, se necessario
4. `@pm` escreve spec
5. `@qa` critica a spec
6. `@architect` gera plano de implementacao

### Brownfield Discovery

Uso: projeto existente sem documentacao operacional suficiente.

Ordem resumida declarada:

1. `@architect` analisa brownfield
2. `@data-engineer` audita banco, quando houver
3. `@ux-design-expert` audita frontend, quando houver
4. `@qa` revisa a leitura consolidada
5. `@pm` cria epic e stories

## Matriz de prioridade operacional

| Cenario | Fluxo prioritario |
| --- | --- |
| Projeto novo sem estrutura | Greenfield |
| Projeto existente sem config | Onboarding |
| Projeto existente com config, sem docs | Brownfield Discovery |
| Projeto existente com docs | Story Development Cycle |
| Implementacao complexa ainda sem spec | Spec Pipeline |
| Codigo reprovado em gate | QA Loop |

## Estado atual dos clones

Consolidado da matriz de readiness:

- `Operational`: 14 clones
- `Draft`: 1 clone
- `Profile-only`: 0 clones

### Clone ainda nao promovido

1. `lucas_silva`

Status atual:

- schema completo
- readiness `Draft`
- base documental ainda insuficiente para promocao

## Ordem de prioridade para clones

A ordem recomendada atual continua sendo:

1. `lucas_silva`

Motivo:

- ja esta no schema correto
- o gap principal e consolidacao documental e calibracao, nao reconstrucao estrutural

## Definicao operacional de fechamento

## Processo e fluxos

Esta frente pode ser tratada como fechada quando:

- a Constituicao continua sendo respeitada pelos fluxos ativos
- o Bob continua roteando por regra codificada
- o fluxo principal de agentes esta documentado e auditavel
- os fluxos especializados estao posicionados por contexto de uso

## Clones

A frente de clones pode ser tratada como totalmente fechada quando:

- todos os clones relevantes estiverem no schema completo
- todos estiverem em estado `Operational` ou descartados formalmente
- houver ao menos uma prova de integracao real para cada clone promovido

## Veredito operacional

Estado atual:

- orquestracao e prioridade: consolidadas e operacionais
- fluxo principal de agentes: claro e fechado
- fluxos especializados: claros e posicionados
- clones: quase fechados, com um item residual prioritario

Conclusao:

A camada operacional do sistema fica suficientemente consolidada com este artefato. O unico residual explicito de promocao no catalogo de clones permanece `lucas_silva`.
