# BFT Scout — Plano de Melhoria do Sistema de Busca

> **Responsável:** Aria (@architect)
> **Data:** 2026-03-30
> **Status:** Draft — Aprovação Pendente

---

## Diagnóstico: Problemas Identificados

### 🔴 Críticos (quebram a lógica de negócio)

| # | Problema | Localização | Impacto |
|---|----------|-------------|---------|
| C1 | **Janela temporal bugada** — código usa 20 dias, briefing exige 7 | `bft-scout-engine.ts:93` | Notícias velhas entram na base, viola a "Currency Rule" |
| C2 | **Mapeamento de região errado** — Dubai/China/Saudia recebem `gl: 'us'` | `bft-scout-engine.ts:80-81` | Resultados irrelevantes para os mercados-alvo |
| C3 | **Output path divergente** — código grava em `news-history.json`, briefing define `news-feed.json` | `bft-scout-engine.ts:13` | Quebra integração com outros scripts |

### 🟡 Alta Severidade (degradam a qualidade)

| # | Problema | Localização | Impacto |
|---|----------|-------------|---------|
| H1 | **Guardrail é regex ingênuo** — apenas 5 padrões em inglês, sem cobertura em PT/AR | `bft-scout-engine.ts:111-114` | Conteúdo inadequado pode passar |
| H2 | **Nenhum score de relevância** — tarifas em Dubai e post genérico sobre "beef" têm o mesmo peso | `bft-scout-engine.ts:66-70` | Output de baixa qualidade para tomada de decisão |
| H3 | **Social generator é template hardcoded** — zero inteligência, mesma estrutura para qualquer notícia | `generate-bft-social.ts:14-22` | Posts sem valor real, não refletem a notícia |
| H4 | **Histórico cresce sem fim** — nenhuma lógica de pruning | `bft-scout-engine.ts:69` | Arquivo JSON gigante com o tempo, deduplicação lenta |

### 🟢 Melhorias (aumentam o alcance)

| # | Problema | Localização | Impacto |
|---|----------|-------------|---------|
| M1 | **Fonte única (Serper)** — sem fallback semântico, plano original previa Exa/Tavily | `bft-scout-engine.ts:79` | Blind spots em notícias de nicho não indexadas pelo Google |
| M2 | **Sem rate limiting** — ~27 chamadas consecutivas sem delay | `bft-scout-engine.ts:32-61` | Risco de throttling/ban da API |
| M3 | **Dedup apenas por URL** — mesma notícia de 2 fontes entra dupla | `bft-scout-engine.ts:21` | Ruído no feed |
| M4 | **Sem agendamento automático** — execução 100% manual | `bft-scout.md:44` | Dependente de intervenção humana |

---

## Plano de Ação — 4 Fases

### Fase 1 — Correções Críticas (Bug Fixes)
> Objetivo: Fazer o sistema funcionar como o briefing define.
> Effort: Baixo | Risco: Nenhum

**1.1 — Corrigir janela temporal** (`bft-scout-engine.ts:93`)
- Mudar `setDate(getDate() - 20)` para `setDate(getDate() - 7)`
- Adicionar constante `CURRENCY_WINDOW_DAYS = 7` no topo do arquivo

**1.2 — Corrigir mapeamento de região**
- Implementar mapa de geo → locale correto:
  ```
  Dubai         → gl: 'ae'
  China         → gl: 'cn'
  Saudi Arabia  → gl: 'sa'
  Brazil        → gl: 'br'
  USA           → gl: 'us'
  Global        → gl: 'us' (default)
  ```

**1.3 — Alinhar output path**
- Separar conceitos: `news-history.json` (acumulado, dedup) vs `news-feed.json` (últimas 7 dias, para consumo)
- Engine continua gravando no histórico, mas ao final exporta um `news-feed.json` filtrado (apenas últimos 7 dias)

---

### Fase 2 — Guardrail Inteligente
> Objetivo: Filtro institucional robusto, baseado em LLM, não em regex.
> Effort: Médio | Risco: Baixo

**2.1 — Substituir regex por classificador LLM**
- Adicionar função `classifyNewsItem(title, snippet): Promise<{pass: boolean, reason: string}>`
- Prompt do sistema: "Você é o filtro institucional da BFT Foods. Aprove apenas conteúdo factual sobre: tarifas, acordos comerciais, certificações, recordes de exportação/importação, logística portuária. Rejeite: críticas a governos, especulação política, escândalos corporativos."
- Usar Claude Haiku (custo-benefício) como classificador

**2.2 — Adicionar score de relevância**
- Campos adicionais no `NewsItem`: `relevanceScore: number (0-1)`, `category: 'tariff' | 'certification' | 'market' | 'logistics' | 'other'`
- Ordenar o feed por `relevanceScore` desc antes de gravar

**2.3 — Expandir guardrail para PT e AR**
- Adicionar padrões de rejeição em português e árabe no fallback regex (para quando LLM não for chamado em modo dry-run)

---

### Fase 3 — Qualidade do Feed
> Objetivo: Feed mais limpo, diversificado e sem ruído.
> Effort: Médio | Risco: Baixo

**3.1 — Dedup por conteúdo (title similarity)**
- Implementar similaridade de Jaccard entre títulos (sem dependências externas)
- Limiar: se `similarity(titleA, titleB) > 0.7` → descartar o de menor score

**3.2 — Rate limiting entre chamadas API**
- Adicionar `await sleep(500)` entre cada `fetchSerperNews`
- Evita throttling com 27 chamadas por run

**3.3 — History pruning automático**
- Ao gravar histórico, descartar itens com `date < hoje - 30 dias`
- Mantém o arquivo leve e a dedup rápida

**3.4 — Adicionar fonte secundária (Exa ou Tavily)**
- Integrar Exa API (busca semântica) como segunda fonte
- Usar Exa apenas para produtos de alto valor (ex: "Beef Striploin trade Dubai")
- Serper continua como fonte primária de notícias gerais

---

### Fase 4 — Social Generator com IA
> Objetivo: Posts com contexto real, não templates genéricos.
> Effort: Alto | Risco: Médio (depende de LLM call)

**4.1 — Reescrever `generate-bft-social.ts` com Claude**
- Input: notícia com `title + snippet + link + category + region`
- Prompt: "Gere um post institucional para o Instagram da BFT Foods baseado nesta notícia. Tom: profissional, especialista em trading. Max 150 palavras. Inclua 1 insight de mercado derivado da notícia. Hashtags: #BFTFoods #{category} #{region}"
- Output: post real, diferente para cada notícia

**4.2 — Variar formatos por category**
- `tariff` → foco em impacto no preço e oportunidade de arbitragem
- `certification` → foco em conformidade e diferencial competitivo
- `logistics` → foco em eficiência operacional e lead time
- `market` → foco em tendência e posicionamento estratégico

---

## Arquitetura Alvo (Pós-Melhoria)

```
bft-scout-engine.ts
    │
    ├── [Fase 1] Geo-aware Serper search (7-day window, correct locales)
    ├── [Fase 3] Rate limiting + Content dedup (Jaccard)
    ├── [Fase 2] LLM Guardrail (Haiku classifier)
    ├── [Fase 2] Relevance Scoring + categorização
    ├── [Fase 3] Exa secondary source (high-value products)
    │
    ├── → news-history.json  (acumulado, 30-day retention)
    └── → news-feed.json     (últimos 7 dias, scored, para consumo)
              │
              └── generate-bft-social.ts
                      │
                      ├── [Fase 4] Claude Haiku post generation
                      └── → Obsidian vault (por categoria + data)
```

---

## Priorização Sugerida

| Sprint | Fases | Descrição |
|--------|-------|-----------|
| **Sprint 1** | Fase 1 completa | Bug fixes — 3 correções cirúrgicas, entrega imediata de valor |
| **Sprint 2** | Fase 3 (3.1, 3.2, 3.3) | Qualidade do feed sem dependência de LLM |
| **Sprint 3** | Fase 2 (2.1, 2.2) | Guardrail LLM + scoring |
| **Sprint 4** | Fase 3 (3.4) + Fase 4 | Exa integration + Social AI |

---

## Dependências Técnicas

| Dependência | Fase | Status |
|-------------|------|--------|
| `SERPER_API_KEY` em `.env` | 1 | Existente |
| `ANTHROPIC_API_KEY` em `.env` | 2, 4 | A verificar |
| `EXA_API_KEY` em `.env` | 3.4 | A verificar |
| `@anthropic-ai/sdk` em `package.json` | 2, 4 | A verificar |
| `exa-js` em `package.json` | 3.4 | A adicionar |

---

*Plano concebido por Aria (@architect) — 30/03/2026*
*Próximo passo: Validar com usuário → `@dev` implementa Sprint 1*
