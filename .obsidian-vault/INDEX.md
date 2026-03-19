# AIOS Research & Analysis Vault

Central repository para research, análise e descobertas que alimentam agentes AIOS.

**Data de criação:** 2026-03-15
**Tipo:** Knowledge Base (versionado em git)

---

## 📂 Estrutura

### Research
Análises de mercado, competidores, produtos e tendências.
- [[research/market-analysis|Market Analysis]]
- [[research/competitor-intel|Competitor Intelligence]]
- [[research/product-validation|Product Validation]]
- [[research/trend-analysis|Trend Analysis]]
- [[research/ThiagoFinch-DNA|Thiago Finch DNA]]
- [[research/AlexHormozi-DNA|Alex Hormozi DNA]]
- [[research/CharlieMunger-DNA|Charlie Munger DNA]]
- [[research/ChrisDo-DNA|Chris Do DNA]]
- [[research/EliGoldratt-DNA|Eli Goldratt DNA]]
- [[research/EugeneSchwartz-DNA|Eugene Schwartz DNA]]
- [[research/MartyNeumeier-DNA|Marty Neumeier DNA]]
- [[research/RobertMcKee-DNA|Robert McKee DNA]]
- [[research/RussellBrunson-DNA|Russell Brunson DNA]]

### Discoveries
Insights estruturados e descobertas durante execução de projetos.
- [[discoveries/aba-insights|AlphaBusinessAcademy Insights]]
- [[discoveries/BKSGrow-ad-copies-march-2026|BKSGrow Ads Março 2026]]
- [[discoveries/client-patterns|Client Patterns]]
- [[discoveries/offer-learnings|Offer Learnings]]

### Analysis
Análises profundas de ofertas, clientes, estratégias.
- [[analysis/offer-breakdown|Offer Breakdown Templates]]
- [[analysis/client-profiles|Client Profiles]]
- [[analysis/BKSGrow-strategy|BKS Grow Growth Engine]]
- [[analysis/AlphaBusinessAcademy-analysis|Alpha Business Academy Analysis]]
- [[analysis/BackStageFy-analysis|BackStageFy Analysis]]
- [[analysis/GTHouse-analysis|GT House Analysis]]
- [[analysis/spHaus-analysis|spHaus Analysis]]
- [[analysis/ViaBrCenografia-analysis|Via BR Cenografia Analysis]]
- [[analysis/EspacoNetworkConstru-analysis|Espaço Network Analysis]]

### Templates
Templates reutilizáveis para research e documentação.
- [[templates/research-template|Research Template]]
- [[templates/offer-analysis-template|Offer Analysis Template]]
- [[templates/discovery-log|Discovery Log Template]]

---

## 🔗 Quick Links

| Resource | Descrição | Atualizado |
|----------|-----------|-----------|
| **Offer Architect Library** | 12MB de templates, modelos, briefings | 2026-03-14 |
| **Research Guide** | Como estruturar research para agentes | 2026-03-15 |
| **Client Profiles & Analysis** | Sincronização total de perfis de clientes | 2026-03-18 |
| **Expert DNA Master Gallery** | Galeria completa de mestres (Finch, Hormozi, Munger, etc) | 2026-03-18 |

---

## 🎯 Como Usar Este Vault

### Para @analyst
1. Crie nova nota em `research/` ou `discoveries/`
2. Use templates em `templates/`
3. Adicione backlinks para conectar conceitos
4. Commit changes quando concluído

**Exemplo:**
```
@analyst pesquisa mercado de ofertas
  → escreve em research/market-analysis.md
  → adiciona tags #market #competitive-intel
  → @offer-architect lê e referencia
```

### Para @offer-architect
1. Leia descobertas em `discoveries/`
2. Use análises em `analysis/`
3. Referencie research quando designing ofertas

### Para agentes gerais
```
.obsidian-vault/
├─ Tudo é markdown versionado
├─ Agentes podem ler via file system
├─ Backlinks ajudam navegação
└─ Git history mantém auditoria
```

---

## 📋 Padrões de Documentação

### Tags Utilizadas
- `#market` — análise de mercado
- `#competitive-intel` — inteligência competitiva
- `#product` — produtos e ofertas
- `#client` — insights sobre clientes
- `#strategy` — análise estratégica
- `#discovery` — novo insight descoberto
- `#validated` — informação validada
- `#todo` — pendente investigação

### Frontmatter Padrão
```yaml
---
created: 2026-03-15
updated: 2026-03-15
author: @analyst
tags: [#market, #competitive-intel]
status: in-progress | completed | validated
references:
  - research/related-analysis
  - discovery/client-pattern
---
```

---

## 🔄 Workflow Recomendado

```
1. RESEARCH PHASE
   └─ @analyst escreve em research/
   └─ estrutura com templates
   └─ adiciona tags e backlinks

2. DISCOVERY PHASE
   └─ insights de projects em discoveries/
   └─ valida findings
   └─ documenta padrões

3. SYNTHESIS PHASE
   └─ analysis/ agrupa by tema
   └─ identifica connections
   └─ cria frameworks

4. AGENT USAGE
   └─ @offer-architect lê discoveries
   └─ @pm referencia market analysis
   └─ agentes usam como source of truth
```

---

## 📊 Métricas do Vault

| Métrica | Valor |
|---------|-------|
| **Total Notes** | Crescendo |
| **Categories** | 4 (Research, Discoveries, Analysis, Templates) |
| **Versionamento** | Git (full history) |
| **Atualização** | Real-time (agentes leem direto) |
| **Backup** | Automático (git sync) |

---

## 🚀 Integração com AIOS

Este vault funciona com:
- ✅ **Git sync** — versionado junto com código
- ✅ **File system access** — agentes leem direto
- ✅ **Backlinks** — navegação entre conceitos
- ✅ **Search** — find notes facilmente
- ✅ **Markdown** — padrão universal

Para usar com **Claude API/NotebookLM:**
```
1. Export notas como PDF/Markdown
2. Feed para análise
3. Gerar artifacts estruturados
4. Retornar insights ao vault
```

---

## 📝 Próximas Ações

- [ ] Criar research inicial (market, competitors, products)
- [ ] Documentar descobertas do ABA
- [ ] Build templates padronizados
- [ ] Integrar com @analyst workflow
- [ ] Setup automações (se necessário)

---

**Mantido por:** AIOS Research Squad
**Sync:** Git + Local Obsidian
**Last Updated:** 2026-03-18
