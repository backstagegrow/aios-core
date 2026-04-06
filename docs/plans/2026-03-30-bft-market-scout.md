# BFT Market Scout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Criar um motor de busca de notícias (Scout Engine) escalável, com filtro temporal de 7 dias e guardrail institucional para a BFTfoods.

**Architecture:** 
- Script em TypeScript (`tsx`) integrado com APIs de busca semântica (Exa/Tavily).
- Pipeline de processamento: Busca -> Filtro Temporal -> Filtro de Integridade (LLM) -> Output em Tabela Markdown.
- Persistência de estado em JSON para histórico de notícias.

**Tech Stack:** TypeScript, tsx, Axios (para APIs), AIOS Core Utilities.

---

### Task 1: Setup da Infraestrutura de Dados
**Files:**
- Create: `clients/BFTFoods/data/news-history.json`
- Create: `clients/BFTFoods/data/keywords.json`

**Step 1: Inicializar arquivos de dados**
```json
// keywords.json
{
  "niches": ["beef", "poultry", "halal"],
  "regions": ["Dubai", "China", "Saudi Arabia", "Brazil", "USA"],
  "triggers": ["tariffs", "import surge", "trade agreement", "record consumption"]
}
```

**Step 2: Commit**
`git add clients/BFTFoods/data/*.json && git commit -m "chore: initial data structure for BFT scout"`

---

### Task 2: Implementação do Motor de Busca (Core Scout)
**Files:**
- Create: `scripts/bft-scout-engine.ts`

**Step 1: Criar o esqueleto do script com suporte a Exa/Tavily**
Implementar a lógica de busca semântica filtrando por `published_after` (hoje - 7 dias).

**Step 2: Adicionar o Filtro Governamental (Institutional Guardrail)**
Usar um prompt de sistema para validar cada manchete encontrada, descartando críticas políticas.

**Step 3: Testar com uma busca simulada**
Run: `tsx scripts/bft-scout-engine.ts --geo Dubai --dry-run`

---

### Task 3: Integração com a Persona bft-scout
**Files:**
- Modify: `clients/BFTFoods/agents/bft-scout.md`

**Step 1: Mapear o comando *run-scout para o script tsx**
No manifest YAML, apontar a execução para o script criado.

---

### Task 4: Geração Automática de Posts (Sintese Lab)
**Files:**
- Create: `scripts/generate-bft-post.ts`

**Step 1: Criar script que lê o JSON e gera a tabela Markdown seguindo o Training Lab.**

---

**Plan complete and saved to `docs/plans/2026-03-30-bft-market-scout.md`.**
Two execution options:
1. **Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration.
2. **Parallel Session (separate)** - Open new session with executing-plans.

**Which approach?**
