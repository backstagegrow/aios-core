# NotebookLM + Antigravity + MCP (Programmatic Setup)

## O que foi configurado

- **Biblioteca Core**: `notebooklm-py` instalada via Python 3.12.
- **Integração IDE**: Skill `notebooklm` registrada (~/.claude/skills/notebooklm).
- **Automação**: Browser Playwright (Chromium) configurado para interações automáticas.

## Como usar no dia a dia

Agora você não precisa mais copiar e colar manualmente. Use comandos de linguagem natural ou a CLI diretamente:

1. **Query Direta**:
   ```bash
   notebooklm ask "Resuma os pontos principais do projeto"
   ```

2. **Criação de Conteúdo**:
   "Claude, crie um podcast do NotebookLM sobre os documentos da pasta knowledge/marketing"

3. **Gestão de Fontes**:
   "Adicione a URL https://exemplo.com ao meu notebook de pesquisa"

## Dispatch Automático (ADE)

O sistema detecta automaticamente quando uma tarefa se beneficia do NotebookLM e utiliza a skill para fundamentar as respostas.

## Comandos Úteis (CLI)

- `notebooklm status`: Verifica autenticação.
- `notebooklm login`: Renova sessão se necessário.
- `notebooklm list`: Lista notebooks disponíveis.

---
*Anteriormente este documento descrevia um fluxo manual de exportação. Esse fluxo foi depreciado em favor da integração programática v0.3.3.*
