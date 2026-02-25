# NotebookLM + Antigravity + MCP (Local Setup)

## O que foi configurado

- Base local de conhecimento: `knowledge/notebooklm/`
- MCP Filesystem de projeto: `.mcp.json` (`filesystem-notebooklm`)
- Skill local: `.antigravity/skills/notebooklm-context/SKILL.md`

## Como usar no dia a dia

1. Salve os conteúdos exportados do NotebookLM em `knowledge/notebooklm/`.
2. Reinicie a sessão da IDE/Antigravity para recarregar MCP/skills.
3. Ative agentes e execute com contexto:
   - `@clickup-ops` para publicação operacional em tasks
   - `@clickup-reporting` para relatório gerencial e documento
4. Ao rodar tarefas estratégicas, peça explicitamente para usar a base NotebookLM:
   - "Use a base em knowledge/notebooklm como source of truth."

## Fluxo sugerido

1. Ingestão de conhecimento:
   - NotebookLM -> `knowledge/notebooklm/*.md`
2. Execução operacional:
   - agente cria task no ClickUp com briefing/contexto
3. Execução gerencial:
   - agente consolida indicadores + insights executivos
   - publica documento em Gestão Empresarial > Relatórios

## Observações

- O `.mcp.json` deste projeto é local ao repositório.
- Se sua IDE usa apenas MCP global, replique a entrada `filesystem-notebooklm` no config global da IDE.

