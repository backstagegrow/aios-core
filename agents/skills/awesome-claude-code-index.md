---
name: awesome-claude-code-index
description: Master directory of the best skills, hooks, plugins, and tools for Claude Code. Use this as a discovery guide when adding new capabilities to the aios-core ecosystem.
---

# 📚 Awesome Claude Code — Knowledge Index

> Referência interna adaptada de [github.com/hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)

Use este índice sempre que precisar descobrir uma nova ferramenta, skill ou hook para expandir as capacidades do **aios-core**.

---

## 🛠️ Ferramentas Essenciais Integradas

| Ferramenta | Status | Localização |
|---|---|---|
| **UI/UX Pro Max** | ✅ Ativo | `agents/skills/ui-ux-pro-max` |
| **GSD Framework** | ✅ Ativo | `agents/skills/gsd-framework` |
| **Superpowers (Brainstorming)** | ✅ Ativo | `agents/skills/brainstorming` |
| **Superpowers (Writing Plans)** | ✅ Ativo | `agents/skills/writing-plans` |
| **Superpowers (TDD)** | ✅ Ativo | `agents/skills/test-driven-development` |
| **Superpowers (Debugging)** | ✅ Ativo | `agents/skills/systematic-debugging` |
| **Claude Mem** | ✅ Ativo | Plugin instalado no Claude Code |
| **n8n-MCP** | 🟡 Pendente | Requer n8n rodando localmente |

---

## 💡 Skills Recomendadas (A Instalar)

### Produtividade
- **`requesting-code-review`** — Revisão de código pré-commit estruturada.
- **`dispatching-parallel-agents`** — Despacha sub-agentes concorrentes para tarefas paralelas.
- **`subagent-driven-development`** — Iteração rápida com revisão em dois estágios.

### Qualidade
- **`verification-before-completion`** — Garante que o problema foi realmente resolvido antes de fechar.
- **`receiving-code-review`** — Responde a feedbacks de revisão de forma estruturada.

---

## 🔌 Plugins Valiosos (Referência)

- **`claude-mem`** — Memória persistente entre sessões. ✅ Instalado.
- **`n8n-mcp`** — Integração profunda com 1.084 nós do n8n.
- **`continue`** — Continua tarefas de sessões anteriores automaticamente.

---

## 🪝 Hooks Úteis

- **`pre-commit-hooks`** — Valida lint, tipos e testes antes de cada commit.
- **`auto-update-context`** — Atualiza o CLAUDE.md com contexto relevante após cada sessão.

---

*Atualizar este índice sempre que novas ferramentas forem integradas ao ecossistema.*

---

## 🏗️ Frameworks de Agentes — Análise Estratégica

### ✅ Prioridade Alta (Integrar em Breve)

| Framework | Link | Por que |
|---|---|---|
| **Supabase AI + pgvector** | [github.com/supabase/supabase](https://github.com/supabase/supabase) | RAG sobre copies aprovados, memória semântica por cliente |
| **MemGPT** | [github.com/cpacker/MemGPT](https://github.com/cpacker/MemGPT) | Arquitetura memória curta/longa/pgvector para escalar 50+ clientes |

### 📚 Estudar e Adaptar Padrões (Não instalar)

| Framework | Link | O que copiar |
|---|---|---|
| **CrewAI** | [github.com/joaomdmoura/crewai](https://github.com/joaomdmoura/crewai) | Padrão de `tasks` com `expected_output` → aplicar nos YAMLs |
| **LangChain** | [github.com/langchain-ai/langchain](https://github.com/langchain-ai/langchain) | Tool calling estruturado, Memory modules |
| **AutoGen** | [github.com/microsoft/autogen](https://github.com/microsoft/autogen) | Multi-agent conversation patterns |
| **MetaGPT** | [github.com/geekan/MetaGPT](https://github.com/geekan/MetaGPT) | Hierarquia empresa → CEO, PM, Architect, Dev, QA |

### 📖 Referência Geral

| Recurso | Link | Uso |
|---|---|---|
| **AI Agents Collection** | [github.com/e2b-dev/awesome-ai-agents](https://github.com/e2b-dev/awesome-ai-agents) | Curadoria do ecossistema de agentes open-source |

### ❌ Não Priorizar Agora

| Framework | Motivo |
|---|---|
| **SuperAGI** | Plataforma monolítica — substituiria o aios-core inteiro |
| **Full LangChain stack** | Over-engineering; scripts Node já resolvem o caso |

