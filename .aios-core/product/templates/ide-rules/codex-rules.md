# AGENTS.md - Synkra AIOS (Codex CLI)

Este arquivo define as instrucoes do projeto para o Codex CLI.

<!-- AIOS-MANAGED-START: core -->
## Core Rules

1. Siga a Constitution em `.aios-core/constitution.md`
2. Priorize `CLI First -> Observability Second -> UI Third`
3. Trabalhe por stories em `docs/stories/`
4. Nao invente requisitos fora dos artefatos existentes
<!-- AIOS-MANAGED-END: core -->

<!-- AIOS-MANAGED-START: quality -->
## Quality Gates

- Rode `npm run lint`
- Rode `npm run typecheck`
- Rode `npm test`
- Rode `npm run build` quando houver build relevante no workspace
- Atualize checklist e file list da story antes de concluir
<!-- AIOS-MANAGED-END: quality -->

<!-- AIOS-MANAGED-START: decision-defaults -->
## Decision Defaults

- Classifique antes de agir: estado do projeto, complexidade, risco e executor correto.
- Em mudancas substanciais, assuma fluxo story-driven sem perguntar quando o contexto ja estiver claro no repo.
- Prefira regra explicita, playbook e fonte unica de verdade em vez de heuristica opaca.
- Corrija causa raiz, alinhe docs/config/runtime/validacao e adicione teste de regressao para mudanca estrutural.
- Para codigo, assuma fechamento com `lint`, `typecheck`, `test` e `build` quando aplicavel.
- Para sites, comece por briefing, CTA, paginas e secoes; privilegie design intencional e evite layout generico.
- Para conteudo, escreva buyer-first com beneficio, prova e CTA claros.
- Escale ao usuario apenas quando a decisao mudar direcao de negocio, marca, pricing ou arquitetura de longo prazo.

Fonte de referencia: `docs/plans/2026-03-13-user-decision-map.md`
<!-- AIOS-MANAGED-END: decision-defaults -->

<!-- AIOS-MANAGED-START: codebase -->
## Project Map

- Core framework: `.aios-core/`
- CLI entrypoints: `bin/`
- Shared packages: `packages/`
- Tests: `tests/`
- Docs: `docs/`
<!-- AIOS-MANAGED-END: codebase -->

<!-- AIOS-MANAGED-START: commands -->
## Common Commands

- `npm run sync:ide`
- `npm run sync:ide:check`
- `npm run sync:skills:codex`
- `npm run sync:skills:codex:global` (opcional; neste repo o padrao e local-first)
- `npm run validate:structure`
- `npm run validate:agents`
<!-- AIOS-MANAGED-END: commands -->

<!-- AIOS-MANAGED-START: shortcuts -->
## Agent Shortcuts

Preferencia de ativacao no Codex CLI:
1. Use `/skills` e selecione `aios-<agent-id>` vindo de `.codex/skills` (ex.: `aios-architect`)
2. Se preferir, use os atalhos abaixo (`@architect`, `/architect`, etc.)

Interprete os atalhos abaixo carregando o arquivo correspondente em `.aios-core/development/agents/` (fallback: `.codex/agents/`), renderize o greeting via `generate-greeting.js` e assuma a persona ate `*exit`:

- `@architect`, `/architect`, `/architect.md` -> `.aios-core/development/agents/architect.md`
- `@dev`, `/dev`, `/dev.md` -> `.aios-core/development/agents/dev.md`
- `@qa`, `/qa`, `/qa.md` -> `.aios-core/development/agents/qa.md`
- `@pm`, `/pm`, `/pm.md` -> `.aios-core/development/agents/pm.md`
- `@po`, `/po`, `/po.md` -> `.aios-core/development/agents/po.md`
- `@sm`, `/sm`, `/sm.md` -> `.aios-core/development/agents/sm.md`
- `@analyst`, `/analyst`, `/analyst.md` -> `.aios-core/development/agents/analyst.md`
- `@devops`, `/devops`, `/devops.md` -> `.aios-core/development/agents/devops.md`
- `@data-engineer`, `/data-engineer`, `/data-engineer.md` -> `.aios-core/development/agents/data-engineer.md`
- `@ux-design-expert`, `/ux-design-expert`, `/ux-design-expert.md` -> `.aios-core/development/agents/ux-design-expert.md`
- `@squad-creator`, `/squad-creator`, `/squad-creator.md` -> `.aios-core/development/agents/squad-creator.md`
- `@aios-master`, `/aios-master`, `/aios-master.md` -> `.aios-core/development/agents/aios-master.md`

## Comando utilitario: Squad

Quando a mensagem do usuario for `Squad` (aceitar tambem `squad`, `/squad`, `*squad`):
1. Listar todos os agentes disponiveis para uso a partir de `.aios-core/development/agents/` (fallback: `.codex/agents/`)
2. Exibir os atalhos de ativacao de cada agente (`@agente` e `/agente`)
3. Se houver pasta `squads/`, exibir os squads locais encontrados
<!-- AIOS-MANAGED-END: shortcuts -->
