---
name: notebooklm-context
description: Carrega e usa automaticamente a base local do NotebookLM para fundamentar decisões de agentes.
---

# NotebookLM Context Skill

## Objetivo

Garantir que agentes consultem a base local em `knowledge/notebooklm/` antes de produzir análises, planos, briefs ou relatórios.

## Regras Operacionais

1. Antes de responder tarefas estratégicas, ler arquivos relevantes em `knowledge/notebooklm/`.
2. Priorizar arquivos mais recentes e mais próximos do tema solicitado.
3. Resumir os achados em bullets objetivos.
4. Explicitar no resultado final quais arquivos foram usados.
5. Se não houver material suficiente, sinalizar lacuna de contexto.

## Quando Aplicar

- Planejamento de campanhas (social media, ads, onboarding, automações).
- Criação de PRD/briefing/plano tático.
- Revisão executiva (CEO/CMO/CFO/CTO/COO) em relatórios.

## Formato de Saída Recomendado

1. `Contexto Utilizado`
2. `Insights Principais`
3. `Pontos de Melhoria`
4. `Próximas Ações`

