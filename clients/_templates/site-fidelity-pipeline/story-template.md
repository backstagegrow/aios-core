# STORY TEMPLATE: Site Fidelity Pipeline (Stitch > AiStudio > Antigravity)

**ID:** TMP-SITE-001  
**Epic:** Design-to-Code Fidelity  
**Sprint:** TBD  
**Points:** TBD  
**Priority:** High  
**Created:** 2026-02-25  
**Status:** Draft

---

## User Story

**Como** time de delivery,  
**Quero** transformar layouts aprovados no Stitch em implementação 1:1 via AiStudio e Antigravity,  
**Para que** o site final preserve fidelidade visual e comportamental sem retrabalho.

---

## Acceptance Criteria

- [ ] AC1: Existe pacote de handoff contendo telas, tokens, grid, breakpoints, estados e assets.
- [ ] AC2: AiStudio retorna artefatos estruturados (`design-tokens.json`, `components-spec.md`, `responsive-map.md`, `assets-manifest.md`).
- [ ] AC3: Implementação no Antigravity segue os artefatos sem reinterpretar visual.
- [ ] AC4: Desktop e mobile reproduzem o design aprovado com variação visual aceitável <= 2px em spacing/layout.
- [ ] AC5: Todos os estados interativos (hover/focus/active/disabled) previstos foram implementados.
- [ ] AC6: Checklist de validação visual final foi executado e anexado.

---

## Scope

Inclui:
- Conversão de layout Stitch para handoff estruturado
- Geração de especificação técnica no AiStudio
- Implementação fiel no Antigravity
- QA visual final

Exclui:
- Redesenho de interface
- Mudança de copy sem briefing
- Nova arquitetura de produto fora do escopo da página/campanha

---

## Tasks

### T1 (S)
- [ ] Consolidar handoff do Stitch em documento único

### T2 (M)
- [ ] Gerar saída estruturada no AiStudio usando prompt padrão

### T3 (L)
- [ ] Implementar no Antigravity com bloqueio de melhorias estéticas não solicitadas

### T4 (M)
- [ ] Executar validação visual (desktop/mobile + estados)

### T5 (S)
- [ ] Atualizar checklist, evidências e file list

---

## Dev Notes

Referências obrigatórias:
- `clients/<CLIENTE>/client_config.yaml`
- `clients/<CLIENTE>/memory_strategy.md`
- Artefatos do handoff Stitch

Regra principal:
- Implementar somente o que consta nos acceptance criteria e no handoff.

### Testing

| Test ID | Name | Type | Priority |
|---------|------|------|----------|
| VF-01 | Comparação de tipografia e escala | Visual | P0 |
| VF-02 | Comparação de spacing e grid | Visual | P0 |
| VF-03 | Responsividade por breakpoint | Visual | P0 |
| VF-04 | Estados interativos completos | Funcional | P0 |
| VF-05 | Integridade de assets | Regressão | P1 |

---

## Definition of Done

- [ ] Todos os acceptance criteria cumpridos
- [ ] Handoff, prompts e saída versionados
- [ ] Implementação validada em desktop e mobile
- [ ] Checklist final preenchido
- [ ] File List atualizada

---

## Dev Agent Record

### Agent Model Used
Codex (GPT-5)

### Completion Notes
Template base para execução multi-cliente do pipeline Stitch > AiStudio > Antigravity.

### File List
- clients/_templates/site-fidelity-pipeline/story-template.md
- clients/_templates/site-fidelity-pipeline/stitch-to-aistudio-handoff.md
- clients/_templates/site-fidelity-pipeline/prompt-aistudio.md
- clients/_templates/site-fidelity-pipeline/prompt-antigravity.md
- clients/_templates/site-fidelity-pipeline/README.md
