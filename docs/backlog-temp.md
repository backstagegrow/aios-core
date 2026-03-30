# Backlog Temporário — Pós-Auditoria 2026-03-30
> Itens identificados na auditoria, a resolver quando conveniente.

---

## Item 1 — Sync social-content-squad agents
**Problema:** Os 4 agentes (`content-planner`, `copy-specialist`, `visual-director`, `post-assembler`) existem em dois lugares com conteúdo diferente:
- `.aios-core/development/agents/` → versão com header AIOS completo (standalone)
- `squads/social-content-squad/agents/` → versão simples (squad member)

**Risco:** Divergência silenciosa — atualizar um não atualiza o outro.

**Ação sugerida:** Decidir qual é canonical e criar mecanismo de sync (ou aceitar que são propositalmente diferentes).

---

## Item 2 — Documentar nexus squads sem agents
**Problema:** 8 nexus squads (`nexus-conversion-architects`, `nexus-core-engineering`, `nexus-data-analysis`, `nexus-growth-command`, `nexus-legal-team`, `nexus-multimodal-coding`, `nexus-multimodal-uiux`, `nexus-revenue-ops`) têm `squad.yaml` mas sem arquivos de agentes individuais visíveis.

**Ação sugerida:** Verificar se agents estão dentro do squad.yaml ou se precisam ser criados.

---

## Item 3 — clients/SMSabores/ não commitado
**Arquivo:** `clients/SMSabores/brandbook-sm-sabores.html`

**Ação sugerida (escolher uma):**
- [ ] Commitar em `main` como parte do projeto
- [ ] Mover para repo separado de clientes
- [ ] Adicionar ao `.gitignore`

---

*Criado por @sm (River) | Auditoria @architect 2026-03-30*
