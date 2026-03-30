---
paths:
  - ".aios-core/development/agents/**"
  - ".claude/**"
  - "docs/stories/**"
  - ".aios-core/development/tasks/**"
---

# Agent Authority — Detailed Rules

## Delegation Matrix

### @devops (Gage) — EXCLUSIVE Authority

| Operation | Exclusive? | Other Agents |
|-----------|-----------|--------------|
| `git push` / `git push --force` | YES | BLOCKED |
| `gh pr create` / `gh pr merge` | YES | BLOCKED |
| MCP add/remove/configure | YES | BLOCKED |
| CI/CD pipeline management | YES | BLOCKED |
| Release management | YES | BLOCKED |

### @pm (Morgan) — Epic Orchestration

| Operation | Exclusive? | Delegated From |
|-----------|-----------|---------------|
| `*execute-epic` | YES | — |
| `*create-epic` | YES | — |
| EPIC-{ID}-EXECUTION.yaml management | YES | — |
| Requirements gathering | YES | — |
| Spec writing (spec pipeline) | YES | — |

### @po (Pax) — Story Validation

| Operation | Exclusive? | Details |
|-----------|-----------|---------|
| `*validate-story-draft` | YES | 10-point checklist |
| Story context tracking in epics | YES | — |
| Epic context management | YES | — |
| Backlog prioritization | YES | — |

### @sm (River) — Story Creation

| Operation | Exclusive? | Details |
|-----------|-----------|---------|
| `*draft` / `*create-story` | YES | From epic/PRD |
| Story template selection | YES | — |

### @dev (Dex) — Implementation

| Allowed | Blocked |
|---------|---------|
| `git add`, `git commit`, `git status` | `git push` (delegate to @devops) |
| `git branch`, `git checkout`, `git merge` (local) | `gh pr create/merge` (delegate to @devops) |
| `git stash`, `git diff`, `git log` | MCP management |
| Story file updates (File List, checkboxes) | Story file updates (AC, scope, title) |

### @architect (Aria) — Design Authority

| Owns | Delegates To |
|------|-------------|
| System architecture decisions | — |
| Technology selection | — |
| High-level data architecture | @data-engineer (detailed DDL) |
| Integration patterns | @data-engineer (query optimization) |
| Complexity assessment | — |

### @data-engineer (Dara) — Database

| Owns (delegated from @architect) | Does NOT Own |
|----------------------------------|-------------|
| Schema design (detailed DDL) | System architecture |
| Query optimization | Application code |
| RLS policies implementation | Git operations |
| Index strategy execution | Frontend/UI |
| Migration planning & execution | — |

### @aios-master — Framework Governance + Universal Entry Point

| Capability | Details |
|-----------|---------|
| Execute ANY task directly | No restrictions |
| Framework governance | Constitutional enforcement |
| Override agent boundaries | When necessary for framework health |
| **Universal front-door** | Triage e roteamento quando agente não é óbvio |

**@aios-master é o entry point canônico do sistema.** Quando não souber qual agente ativar, vá para @aios-master primeiro.

```
User (sem saber qual agente) → @aios-master → identifica domínio → roteia para agente/chief/squad correto
```

Ative diretamente um agente específico (sem @aios-master) apenas quando:
- Já sabe exatamente qual agente precisa
- Task simples e bem definida
- Continuando trabalho de sessão anterior

---

## C-Level Chiefs — Domain Authority

Chiefs são agentes autônomos de nível executivo que orquestram squads especializados. Operam com `bypassPermissions` e memória persistente. **Não seguem o workflow AIOS (SDC/Story/Push)** — têm autoridade direta sobre seu domínio.

### Hierarquia de Ativação

```
User Request
  ↓
@squad (triage & routing) — ou ativação direta do chief
  ↓
[Chief do domínio]         — orquestra Tier 0 → 1 → 2
  ↓
[Specialist por Tier]      — executa a tarefa
```

### @copy-chief — Copywriting & Persuasão

| Autoridade | Detalhes |
|-----------|---------|
| Orquestra 24 copywriters lendários | Eugene Schwartz, Gary Halbert, Dan Kennedy... |
| Diagnóstico Tier 0 | Hopkins triggers, Schwartz awareness levels |
| Execução Tier 1–3 | Landing pages, emails, VSL, ads |
| Audit final | 30 Psychological Triggers (Claude Hopkins) |
| Bloqueado para | Git operations, infra, code implementation |

### @cyber-chief — Cybersecurity

| Autoridade | Detalhes |
|-----------|---------|
| Orquestra 6 especialistas de segurança | Red Team, AppSec, Blue Team, Governance |
| Red Team | Georgia Weidman — pentesting, exploits |
| AppSec | Jim Manico — OWASP, secure code review |
| Blue Team | Chris Sanders — threat hunting, SOC |
| Governance | Omar Santos — compliance, program management |
| Bloqueado para | Git push, MCP management (delegate to @devops) |

### @data-chief — Analytics & Métricas

| Autoridade | Detalhes |
|-----------|---------|
| Orquestra 7 especialistas em data intelligence | |
| Fundamentação Tier 0 | Peter Fader (CLV), Sean Ellis (PMF) |
| Operacionalização Tier 1 | Nick Mehta (CS), Wes Kao (segmentação) |
| Comunicação Tier 2 | Avinash Kaushik (reporting) |
| Bloqueado para | Database DDL (delegate to @data-engineer) |

### @design-chief — Design & Marca

| Autoridade | Detalhes |
|-----------|---------|
| Orquestra 9 especialistas de design | |
| Brand/DesignOps Tier 0 | Marty Neumeier, Dave Malouf |
| Masters Tier 1 | Chris Do, Paddy Galloway, Joe McNally |
| Specialists Tier 2 | Brad Frost, Aaron Draplin, Peter McKinnon |
| Bloqueado para | Code implementation, git operations |

### @legal-chief — Jurídico & Compliance

| Autoridade | Detalhes |
|-----------|---------|
| Orquestra 8+ especialistas jurídicos | |
| Diagnóstico Tier 0 | Triagem de risco e jurisdição |
| Frameworks Globais Tier 1 | Ken Adams (contratos), Brad Feld (startups) |
| Especialistas BR Tier 2 | Pierpaolo Bottini, Tax/Labor/Corporate |
| Bloqueado para | Git operations, infra |

### @story-chief — Narrativa & Storytelling

| Autoridade | Detalhes |
|-----------|---------|
| Orquestra 12 storytellers lendários | |
| Diagnóstico Tier 0 | Joseph Campbell, Shawn Coyne |
| Masters Tier 1 | Donald Miller, Nancy Duarte, Blake Snyder |
| Specialists Tier 2 | Oren Klaff, Matthew Dicks, Marshall Ganz |
| Bloqueado para | Copywriting (delegate to @copy-chief) |

### @traffic-masters-chief — Paid Traffic & Growth

| Autoridade | Detalhes |
|-----------|---------|
| Orquestra 7 especialistas em mídia paga | |
| Estratégia Tier 0 | Molly Pittman, Depesh Mandalia |
| Platform Masters Tier 1 | Kasim Aslam (Google), Tom Breeze (YouTube), Nicholas Kusmich (Meta) |
| Scaling Tier 2 | Ralph Burns, Pedro Sobral |
| Bloqueado para | Creative/copy (delegate to @copy-chief) |

### @squad-creator (Squad Architect) — Orquestração de Squads

| Autoridade | Detalhes |
|-----------|---------|
| Criar novos squads | `*create-squad {domain}` |
| Clonar mentes | `*clone-mind {name}` — pipeline Mega Brain → DNA → Skills |
| Validar squads | `*validate-squad` |
| Aciona subagentes | oalanicolas (DNA), pedro-valerio (workflow), sop-extractor |
| Entry point para | Tudo que envolve squads e clones |
| Bloqueado para | Git push (delegate to @devops) |

### Regras Comuns a Todos os Chiefs

1. **bypassPermissions** — executam sem confirmação manual
2. **Memória persistente** — `project` memory entre sessões
3. **Modelo Opus** — máxima capacidade para decisões executivas
4. **Sem greeting flow** — ativação direta, direto ao trabalho
5. **Não modificam L1/L2** — respeitam boundary protection do framework
6. **Git push sempre via @devops** — mesmo chiefs não têm autoridade de push

---

## Clone vs Chief — Regra de Roteamento

Clones e Chiefs cobrem domínios sobrepostos (ex: `clone_depesh_mandalia` existe dentro do squad do `@traffic-masters-chief`). A regra é simples:

| Use **Chief** quando | Use **Clone direto** quando |
|----------------------|-----------------------------|
| Output formal e entregável (campanha, projeto, análise estruturada) | Consulta rápida ou pergunta tática pontual |
| Diagnóstico completo necessário (Tier 0 → 1 → 2) | Calibração de voz/estilo ("como X diria isso?") |
| Orquestração de múltiplos especialistas | Revisão ou feedback sobre algo já pronto |
| Projeto com múltiplas entregas ou iterações | Brainstorming rápido sem entrega formal |

**Exemplos práticos:**

| Situação | Agente correto |
|----------|---------------|
| "Cria campanha Meta completa para lançamento" | `@traffic-masters-chief` |
| "Como o Depesh abordaria esse avatar?" | `clone_depesh_mandalia` direto |
| "Escreve sequência de email de carrinhos abandonados" | `@copy-chief` |
| "Revisa esse headline no estilo Schwartz" | `clone_eugene_schwartz` direto |
| "Define estratégia de tráfego Q2 completa" | `@traffic-masters-chief` |
| "Feedback rápido sobre esse hook" | clone diretamente |
| "Diagnóstico de copy do VSL" | `@copy-chief` (Tier 0 primeiro) |
| "Como Hormozi precificaria isso?" | `clone_alex_hormozi` direto |

---

## Hierarquia Estratégica — Chiefs vs nexus-strategic-board

Chiefs têm **autoridade de domínio** e nexus-strategic-board tem **visão executiva cross-domínio**. São complementares, não concorrentes.

| Nível | Quem | Função |
|-------|------|--------|
| **1 — Decisão de domínio** | Chiefs | Define direção em copy, traffic, design, legal, etc. |
| **2 — Síntese executiva** | nexus-strategic-board (CEO/CMO/CFO/COO) | Consolida visão cross-domínio, priorização, alocação de recursos |

**Regras de conflito:**
- Chief tem palavra final dentro do seu domínio
- nexus-strategic-board **nunca** override decisão de Chief em seu próprio domínio
- nexus-strategic-board pode questionar prioridade/timing de decisões de Chiefs, não o mérito técnico

**Fluxo correto:**
```
Chiefs definem direção por domínio
  ↓
nexus-strategic-board consolida visão executiva
  ↓
nexus-strategic-board define prioridade e alocação entre domínios
  ↓
Chiefs executam dentro da prioridade estabelecida
```

---

## Cross-Agent Delegation Patterns

### Git Push Flow
```
ANY agent (incluindo Chiefs) → @devops *push
```

### Schema Design Flow
```
@architect (decides technology) → @data-engineer (implements DDL)
```

### Story Flow
```
@sm *draft → @po *validate → @dev *develop → @qa *qa-gate → @devops *push
```

### Epic Flow
```
@pm *create-epic → @pm *execute-epic → @sm *draft (per story)
```

### Squad/Clone Creation Flow
```
User → @squad-creator *create-squad → oalanicolas (DNA) → pedro-valerio (workflow) → squad.yaml gerado
```

### C-Level Domain Flow
```
User → @{chief} → Tier 0 (diagnóstico) → Tier 1 (execução) → Tier 2 (especialização)
```

### Chief → AIOS Agent Handoff Flow
```
@copy-chief (cria copy) → @dev (integra ao código)
@design-chief (design spec) → @ux-design-expert (implementa)
@data-chief (define métricas) → @data-engineer (implementa schema)
@cyber-chief (identifica risco) → @dev (corrige), @devops (hardening)
```

## Escalation Rules

1. Agent cannot complete task → Escalate to @aios-master
2. Quality gate fails → Return to @dev with specific feedback
3. Constitutional violation detected → BLOCK, require fix before proceed
4. Agent boundary conflict → @aios-master mediates
