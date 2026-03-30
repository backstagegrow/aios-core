# Auditoria do Sistema AIOS — 2026-03-30
> Executada por @architect (Aria) | Scope: agentes, clones, squads, SYNAPSE, workflows, gaps, bugs

---

## Resumo Executivo

| Categoria | Status | Issues |
|-----------|--------|--------|
| Agentes Core | 🟡 OK c/ gaps | 3 orphaned, naming inconsistency |
| Chiefs | 🔴 GAP CRÍTICO | Não registrados no SYNAPSE |
| Clones | 🔴 INACESSÍVEIS | `pro/` submodule vazio |
| Squads | 🟡 Parcial | Duplicatas, nexus sem agents |
| SYNAPSE | 🟡 Incompleto | Chiefs ausentes |
| Workflows | 🟡 Referência quebrada | `.antigravity` path morto |
| Story-Driven Dev | 🔴 VIOLAÇÃO | Zero active stories |
| entity-registry | 🟡 Pending | Modified, não commitado |
| Hooks/Config | 🟡 Recente fix | #582 resolveu hook errors |

---

## 1. AGENTES

### 1.1 Inventário Completo

**Core AIOS (10):** aios-master, analyst, architect, data-engineer, dev, devops, pm, po, qa, sm, ux-design-expert

**C-Level Chiefs (8):** copy-chief, cyber-chief, data-chief, design-chief, legal-chief, story-chief, traffic-masters-chief, squad-creator

**Social/Content (4):** content-planner, copy-specialist, visual-director, post-assembler

**Utilidade (3):** clickup-ops, clickup-reporting, product-team-content-generation

**Arquivos de Memória no diretório agents (2):** MEMORY.md, OFFER-ARCHITECT-STRATEGIC-MEMORY.md

### 1.2 Bugs e Gaps de Agentes

**BUG-01 — Agentes Órfãos** `HIGH`
Os seguintes agentes existem como `.md` mas NÃO estão registrados em:
- CLAUDE.md (agent table)
- SYNAPSE manifest
- agent-authority.md

```
clickup-ops.md
clickup-reporting.md
product-team-content-generation.md
```
> Nenhum routing, nenhum trigger, nenhuma documentação de ativação.

**BUG-02 — Arquivos de Memória no diretório de Agentes** `MEDIUM`
`MEMORY.md` e `OFFER-ARCHITECT-STRATEGIC-MEMORY.md` estão na pasta `.aios-core/development/agents/`.
Esses são arquivos de knowledge/memória, NÃO agentes. Podem confundir IDS e resolução de entidades.
> Sugestão: mover para `.aios-core/data/` ou subpasta `knowledge/`.

**BUG-03 — `@squad` vs `squad-creator`** `MEDIUM`
CLAUDE.md e agent-authority.md referenciam o agente como `@squad`, mas:
- O arquivo é `squad-creator.md`
- O SYNAPSE trigger é `squad-creator`
- O skill é `AIOS:agents:squad-creator`

> Inconsistência de naming. Definir canonicamente um nome e sincronizar todos os pontos.

**BUG-04 — Duplicatas: social-content-squad agents** `MEDIUM`
Os 4 agentes de conteúdo existem em **dois lugares**:
- `.aios-core/development/agents/content-planner.md` etc.
- `squads/social-content-squad/agents/content-planner.md` etc.

> Podem divergir. Definir um como source of truth, o outro como symlink ou referência.

**BUG-05 — `conselho-dos-sabios` duplicado** `LOW`
Existe como agent `.md` E como squad (`squads/conselho-dos-sabios/`). Sem separação clara de qual é canônico.

---

## 2. CLONES

**BUG-06 — `pro/` submodule VAZIO** `CRITICAL`
O git log mostra múltiplos commits de clones (raiam-santos v3.0, v99+, etc.):
```
4bb7fbb3 feat(clones): calibrate Raiam Santos score 99
5ea2fda3 feat(clones): update Raiam Santos DNA from NotebookLM
2c12c506 feat(clones): raiam-santos MASTER_READY v3.0.0
```
Mas `pro/` está completamente vazio. O submodule não está inicializado.

> **Impacto:** Todos os clones (raiam-santos, e provavelmente outros) estão inacessíveis.
> **Ação:** `git submodule update --init --recursive` ou verificar se o remote do submodule existe.

O `clone-dna-schema.yaml` existe em `.aios-core/data/` (schema), mas sem os arquivos de clone reais.

---

## 3. SQUADS

### 3.1 Inventário

| Squad | squad.yaml | Agents | Status |
|-------|-----------|--------|--------|
| nexus-copy-elite | ✓ | ✓ (yaml) | OK |
| nexus-conversion-architects | ✓ | ? | Sem agents visíveis |
| nexus-core-engineering | ✓ | ? | Sem agents visíveis |
| nexus-data-analysis | ✓ | ? | Sem agents visíveis |
| nexus-growth-command | ✓ | ? | Sem agents visíveis |
| nexus-legal-team | ✓ | ? | Sem agents visíveis |
| nexus-multimodal-coding | ✓ | ? | Sem agents visíveis |
| nexus-multimodal-uiux | ✓ | ? | Sem agents visíveis |
| nexus-revenue-ops | ✓ | ? | Sem agents visíveis |
| nexus-self-evolving | ✓ | ? | Sem agents visíveis |
| nexus-strategic-board | ✓ | ? | Sem agents visíveis |
| low-ticket-product-lab | ✓ | ✓ (md) | OK |
| social-content-squad | ✓ | ✓ (md) | Duplicata |
| conselho-dos-sabios | ✓ | ? | Conflito c/ agent |
| claude-code-mastery | ✓ | ✓ (md) | OK |
| _example | — | — | Template |
| _shared | — | — | Shared resources |

**GAP-01 — 8 nexus squads sem agent files visíveis** `MEDIUM`
Squads `nexus-*` (exceto copy-elite) têm `squad.yaml` mas não têm arquivos de agentes individuais em subpastas. Podem ser definidos dentro do squad.yaml ou simplesmente incompletos.

---

## 4. SYNAPSE

### 4.1 Domains Registrados (OK)

Agentes Core: dev, qa, architect, pm, po, sm, devops, analyst, data-engineer, ux (→ ux-design-expert), aios-master, squad-creator

Workflows: story_dev, epic_create, arch_review

### 4.2 Gaps SYNAPSE

**BUG-07 — Chiefs SEM domínio SYNAPSE** `CRITICAL`
8 Chiefs têm agent .md mas ZERO entrada no manifest SYNAPSE:
```
copy-chief, cyber-chief, data-chief, design-chief,
legal-chief, story-chief, traffic-masters-chief, conselho-dos-sabios
```
> Esses agentes não recebem context injection durante ativação.

**BUG-08 — Folder `agent-ux` vs trigger `ux-design-expert`** `LOW`
SYNAPSE tem folder `.synapse/agent-ux` com trigger `ux-design-expert`. O nome do folder não corresponde ao padrão `agent-{trigger}`. Funcional mas inconsistente.

**GAP-02 — Social-content-squad agents sem SYNAPSE domain** `LOW`
content-planner, copy-specialist, visual-director, post-assembler não têm domains SYNAPSE.

---

## 5. WORKFLOWS

**BUG-09 — Path quebrado: `.antigravity`** `HIGH`
`workflow-chains.yaml` → site-creation workflow referencia:
```yaml
workflow_file: .antigravity/workflows/site-creation.md
```
Este path não existe. Deveria ser `.aios-core/workflows/` ou similar.
> Qualquer handoff greeting que tente sugerir `*create-site` vai falhar na resolução.

**BUG-10 — spec-pipeline step 6 inconsistente** `MEDIUM`
`workflow-chains.yaml` spec-pipeline step 6:
```yaml
task: architect-analyze-impact.md
```
Mas o architect agent mapeia `*plan` para `plan-create-implementation.md`.
> Dois documentos diferentes para o mesmo comando. Qual é o canônico?

---

## 6. STORY-DRIVEN DEVELOPMENT

**BUG-11 — VIOLAÇÃO Constitution Art. III** `HIGH`
```
docs/stories/active/ — VAZIO
```
Nenhuma active story. Todo desenvolvimento recente foi feito sem story tracking formal:
- Fix #582 (ConfigCache), Fix #581 (3 bugs), Fix #560 (glob), etc.
- Todos commitados diretamente sem story em `active/`.

> Violação da Constitution NON-NEGOTIABLE. Qualquer novo desenvolvimento DEVE criar story primeiro.

---

## 7. CONFIGURAÇÃO E INFRA

**BUG-12 — `core-config.yaml` NÃO EXISTE** `HIGH`
CLAUDE.md referencia:
```
core-config.yaml → boundary.frameworkProtection: true/false
```
O arquivo não existe na raiz do projeto. O toggle documentado é uma referência morta.

**BUG-13 — `entity-registry.yaml` modificado, não commitado** `LOW`
- `lastUpdated: 2026-03-29T16:45:01`
- `entityCount: 798`
- Aparece no git status como `M .aios-core/data/entity-registry.yaml`
> Sync IDS Hook provavelmente rodou mas não foi commitado.

**BUG-14 — `clients/SMSabores/` untracked** `MEDIUM`
Diretório de cliente não commitado. Pode conter dados sensíveis ou trabalho em andamento sem rastreamento.

**BUG-15 — `.synapse/.gitignore` untracked** `LOW`
Novo `.gitignore` no diretório SYNAPSE não commitado.

**NOTA — Permission Deny Rules** `OK`
L1/L2 protection está correta e abrangente. Allow rules coerentes com L3.

---

## 8. PRIORIDADES DE AÇÃO

### 🔴 Crítico (fazer agora)
1. **BUG-06** — Inicializar `pro/` submodule para restaurar clones
2. **BUG-07** — Criar domains SYNAPSE para 8 Chiefs
3. **BUG-11** — Criar story para qualquer novo desenvolvimento (retomar Story-Driven Dev)

### 🟡 Alto (próxima sprint)
4. **BUG-01** — Registrar ou remover agentes órfãos (clickup-ops, clickup-reporting, product-team-content-generation)
5. **BUG-09** — Corrigir path `.antigravity` no workflow-chains.yaml
6. **BUG-12** — Criar `core-config.yaml` ou remover referências
7. **BUG-13** — Commitar entity-registry.yaml

### 🟢 Normal (backlog)
8. **BUG-03** — Normalizar `@squad` vs `squad-creator`
9. **BUG-04** — Resolver duplicatas social-content-squad
10. **BUG-10** — Alinhar spec-pipeline task reference
11. **BUG-02** — Mover memory files para fora de agents/
12. **BUG-14** — Decidir destino de `clients/SMSabores/`
13. **BUG-15** — Commitar `.synapse/.gitignore`

---

## 9. SAÚDE GERAL DO SISTEMA

```
Framework Core (L1)     ██████████ OK — deny rules ativas
Workflow Engine         ████████░░ 1 path quebrado
Agent Layer             ███████░░░ 3 orphaned, Chiefs sem SYNAPSE
Clone Layer             ██░░░░░░░░ pro/ submodule vazio
Story-Driven Dev        ██░░░░░░░░ VIOLAÇÃO ativa
SYNAPSE Coverage        ███████░░░ Chiefs não cobertos
Hooks/Config            █████████░ OK pós #582
```

**Score:** 68/100 — Sistema funcional mas com gaps estruturais críticos nos clones e SYNAPSE dos Chiefs.

---

*Aria — @architect | 2026-03-30*
