# AGENTS.md - Synkra AIOS

Este arquivo configura o comportamento esperado de agentes no Codex CLI neste repositorio.

## Constitution

Siga `.aios-core/constitution.md` como fonte de verdade:
- CLI First
- Agent Authority
- Story-Driven Development
- No Invention
- Quality First
- Absolute Imports

## Workflow Obrigatorio

1. Inicie por uma story em `docs/stories/`
2. Implemente apenas o que os acceptance criteria pedem
3. Atualize checklist (`[ ]` -> `[x]`) e file list
4. Execute quality gates antes de concluir

## Decision Defaults

- Classifique antes de agir: estado do projeto, complexidade, risco e executor correto.
- Em mudancas substanciais, assuma fluxo story-driven sem perguntar quando o contexto do repo ja deixar o caminho claro.
- Prefira regra explicita, playbook e fonte unica de verdade em vez de heuristica opaca.
- Corrija causa raiz, alinhe docs/config/runtime/validacao e adicione teste de regressao para mudanca estrutural.
- Para codigo, assuma fechamento com `npm run lint`, `npm run typecheck`, `npm test` e `npm run build` quando aplicavel.
- Para sites, comece por briefing, CTA, paginas e secoes; privilegie design intencional e evite layout generico.
- Para conteudo, escreva buyer-first com beneficio, prova e CTA claros.
- Escale ao usuario apenas quando a decisao mudar direcao de negocio, marca, pricing ou arquitetura de longo prazo.

Fonte de referencia: `docs/plans/2026-03-13-user-decision-map.md`

## Quality Gates

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Estrutura Principal

- Core framework: `.aios-core/`
- CLI: `bin/`
- Pacotes: `packages/`
- Testes: `tests/`
- Documentacao: `docs/`

## IDE/Agent Sync

- Sincronizar regras/agentes: `npm run sync:ide`
- Validar drift: `npm run sync:ide:check`
- Rodar paridade multi-IDE (Claude/Codex/Gemini): `npm run validate:parity`
- Sync Claude Code: `npm run sync:ide:claude`
- Sincronizar Gemini CLI: `npm run sync:ide:gemini`
- Validar Codex sync/integration: `npm run validate:codex-sync && npm run validate:codex-integration`
- Gerar skills locais do Codex: `npm run sync:skills:codex`
- Este repositorio usa **local-first**: prefira `.codex/skills` versionado no projeto
- Use `sync:skills:codex:global` apenas para testes fora deste repo

## Agent Shortcuts (Codex)

Preferencia de ativacao no Codex CLI:
1. Use `/skills` e selecione `aios-<agent-id>` vindo de `.codex/skills` (ex.: `aios-architect`)
2. Se preferir, use os atalhos abaixo (`@architect`, `/architect`, etc.)

Quando a mensagem do usuario for um atalho de agente, carregue o arquivo correspondente em `.aios-core/development/agents/` (fallback: `.codex/agents/`), renderize o greeting via `generate-greeting.js` e assuma a persona ate receber `*exit`.

Atalhos aceitos por agente:
- `@aios-master`, `/aios-master`, `/aios-master.md` -> `.aios-core/development/agents/aios-master.md`
- `@analyst`, `/analyst`, `/analyst.md` -> `.aios-core/development/agents/analyst.md`
- `@architect`, `/architect`, `/architect.md` -> `.aios-core/development/agents/architect.md`
- `@clickup-ops`, `/clickup-ops`, `/clickup-ops.md` -> `.aios-core/development/agents/clickup-ops.md`
- `@clickup-reporting`, `/clickup-reporting`, `/clickup-reporting.md` -> `.aios-core/development/agents/clickup-reporting.md`
- `@data-engineer`, `/data-engineer`, `/data-engineer.md` -> `.aios-core/development/agents/data-engineer.md`
- `@dev`, `/dev`, `/dev.md` -> `.aios-core/development/agents/dev.md`
- `@devops`, `/devops`, `/devops.md` -> `.aios-core/development/agents/devops.md`
- `@pm`, `/pm`, `/pm.md` -> `.aios-core/development/agents/pm.md`
- `@po`, `/po`, `/po.md` -> `.aios-core/development/agents/po.md`
- `@qa`, `/qa`, `/qa.md` -> `.aios-core/development/agents/qa.md`
- `@sm`, `/sm`, `/sm.md` -> `.aios-core/development/agents/sm.md`
- `@squad-creator`, `/squad-creator`, `/squad-creator.md` -> `.aios-core/development/agents/squad-creator.md`
- `@ux-design-expert`, `/ux-design-expert`, `/ux-design-expert.md` -> `.aios-core/development/agents/ux-design-expert.md`

Resposta esperada ao ativar atalho:
1. Confirmar agente ativado
2. Mostrar 3-6 comandos principais (`*help`, etc.)
3. Seguir na persona do agente

## Comando utilitario: Squad

Quando a mensagem do usuario for `Squad` (aceitar tambem `squad`, `/squad`, `*squad`):
1. Listar todos os agentes disponiveis para uso a partir de `.aios-core/development/agents/` (fallback: `.codex/agents/`)
2. Exibir os atalhos de ativacao de cada agente (`@agente` e `/agente`)
3. Se houver pasta `squads/`, exibir os squads locais encontrados

---

## 🚀 Skills Library (Superpowers Protocol)

Antes de qualquer tarefa complexa, verifique se há uma skill relevante em `agents/skills/`. As skills são mandatórias, não sugestões.

### Workflow Padrão (Superpowers)
1. **`brainstorming`** → Antes de escrever código/copy. Valida o design com o usuário.
2. **`writing-plans`** → Após aprovação. Cria plano granular com arquivos e verificações.
3. **`test-driven-development`** → Durante a implementação. Ciclo RED-GREEN-REFACTOR.
4. **`systematic-debugging`** → Quando algo quebra. 4 fases de análise antes de qualquer fix.

### Skills Disponíveis em `agents/skills/`
| Skill | Propósito |
|---|---|
| `brainstorming` | Design e validação antes de codar |
| `writing-plans` | Planos de implementação detalhados |
| `test-driven-development` | TDD rigoroso |
| `systematic-debugging` | Debugging por causa raiz |
| `gsd-framework` | Framework de execução GSD |
| `ui-ux-pro-max` | Manual de design premium |

### Awesome Claude Code (Referência)
Consulte `agents/skills/awesome-claude-code-index.md` para descobrir novas skills, hooks, plugins e ferramentas compatíveis com este ecossistema.
