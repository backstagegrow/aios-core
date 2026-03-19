# Agent Memory Index

Repositório centralizado de memórias estratégicas, decisões arquitetônicas e aprendizados consolidados do AIOS.

## 📚 Memórias Ativas

### Offer Architecture
- [OFFER-ARCHITECT-STRATEGIC-MEMORY.md](./OFFER-ARCHITECT-STRATEGIC-MEMORY.md)
  - 8-tier offer-building framework (categories → copy → validation → launch/scale)
  - 5-phase execution workflow with gates
  - 5 strategic improvements: segmentation, testing rigor, scaling triggers, objection handling, 30-day optimization
  - Metrics and success indicators
  - Integration points with copy-chief, traffic-masters-chief, analyst squad
  - **Status:** Active, reviewed 2026-03-15

### Content Generation — Two Modes (Product Team)
- [product-team-content-generation.md](./product-team-content-generation.md)
  - **MODO EBOOK:** Markdown estruturado para Obsidian (capa automática, hierarquia H1-H3)
  - **MODO CARROSSEL:** Tabela Markdown (4 colunas) para Canva Pro Bulk Create
  - Workflow integrado: Ebook (Obsidian) → Carrossel (Canva) → Publicação orgânica
  - Gatilhos de ativação distintos para cada modo
  - Estratégia em 4 phases: modos prontos → busca de produto → estratégia de conteúdo → ativação operacional
  - **Status:** Active, ready for implementation (2026-03-15)

---

## 🔄 Memory Protocol

### When to Create a Memory
- Strategic frameworks discovered/consolidated
- Cross-agent dependencies identified
- Lessons learned from completed projects
- Architectural decisions with multi-session impact
- Operational procedures that repeat

### When to Update
- Framework improves with new data
- Integration patterns shift
- Success metrics change
- Dependencies evolve

### Format
Each memory file includes:
```yaml
---
name: {memory name}
description: {one-line summary}
type: {project | feedback | user | reference}
date: {YYYY-MM-DD}
---
```

---

## 🎯 Quick Reference

| Memory | Domain | Purpose |
|--------|--------|---------|
| OFFER-ARCHITECT-STRATEGIC-MEMORY | Offers & Pricing | Build world-class offers systematically |
| product-team-content-generation | Content Automation | Two-mode system: Ebook (Obsidian) + Carrossel (Canva) |

---

**Last Updated:** 2026-03-15
---
*AIOS Agent - Synced from .aios-core/development/agents/MEMORY.md*
