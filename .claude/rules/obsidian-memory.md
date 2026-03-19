---
paths:
  - "**/*.md"
  - ".aios-core/development/agents/**"
---

# Obsidian Memory Protocol

## Vault Location
`D:\01 -Arquivos\Obsidian\AIOS\`

## Arquitetura de 3 Camadas

| Camada | Local | Proposito | Atualizar quando |
|--------|-------|-----------|-----------------|
| **Long-term** | Obsidian vault | Grafo de conhecimento rico, backlinks, search | Decisoes, frameworks, padroes estrategicos |
| **Working** | `agents/{id}/MEMORY.md` | Padroes operacionais por sessao | Padroes recorrentes, gotchas, regras |
| **User/Project** | `~/.claude/projects/.../memory/` | Perfil do usuario e contexto cross-project | Preferencias, feedback, estado do projeto |

## Quando Escrever no Vault Obsidian

Escreva no vault quando aprender ou consolidar:
- **Frameworks estrategicos** — modelos, sistemas, playbooks
- **Decisoes arquiteturais** com impacto multi-sessao
- **Padroes cross-agent** — conhecimento que multiplos agentes usam
- **Licoes aprendidas** de projetos concluidos
- **Procedimentos operacionais** que se repetem

**NAO escreva no vault:**
- Padroes ja em CLAUDE.md ou `.claude/rules/`
- Estado temporario ou progresso de uma unica sessao
- Codigo ou implementacoes (ficam no codebase)

## Estrutura do Vault

```
D:\01 -Arquivos\Obsidian\AIOS\
├── _INDEX.md              # Navegacao central — sempre atualizar
├── Agents/                # {agent-name}.md por agente
├── Strategic/             # Frameworks e conhecimento estrategico
├── Projects/              # Contexto por projeto
├── Feedback/              # Preferencias e feedback do usuario
└── Templates/             # Templates para novas notas
```

## Como Escrever no Vault

Use as ferramentas nativas (Write/Edit) apontando para o path do vault:

```
# Ler uma nota
Read("D:\01 -Arquivos\Obsidian\AIOS\Strategic\offer-architect.md")

# Criar/atualizar nota
Write("D:\01 -Arquivos\Obsidian\AIOS\Strategic\nova-nota.md", conteudo)

# Buscar no vault
Grep(pattern, path="D:\01 -Arquivos\Obsidian\AIOS")
```

## Frontmatter Obrigatorio

Toda nota nova no vault deve ter:
```yaml
---
tags: [categoria, subcategoria]
last_updated: YYYY-MM-DD
---
```

## Backlinks

Use `[[note-name]]` (sem path, so o nome do arquivo) para criar conexoes entre notas.

## Phase 2 — MCP Obsidian (pendente)

Quando o plugin Local REST API estiver instalado (porta 27123), sera possivel usar o MCP obsidian para acesso em tempo real. Setup via @devops.

## Decisao de Layering

| Conteudo | Destino correto |
|----------|----------------|
| Padrao de codigo novo | `agents/{id}/MEMORY.md` |
| Framework estrategico | Obsidian vault |
| Preferencia do usuario | Auto memory + Obsidian `Feedback/` |
| Decisao arquitetural | Obsidian vault `Strategic/` |
| Contexto de story ativa | Story file (nao memoria) |
| ADR novo | Obsidian vault `Strategic/` + `docs/architecture/` |
