# Generate Project Manifest

> Task ID: generate-project-manifest
> Agent: Uma (UX-Design-Expert)
> Version: 1.0.0

## Purpose

Generate a `project-manifest.yaml` file at the root of the current project.
This manifest persists across sessions — agents read it at startup instead of
re-discovering the design system every time.

Run once per project. Update manually when the project changes significantly.

---

## Execution

### STEP 1 — Identify Current Project

Ask the user: "Qual projeto estamos configurando agora?"

Accept:
- Path direto: `apps/portfolio-porto`
- Nome: `portfolio-porto`
- "esse aqui" → use current working directory

### STEP 2 — Run Discovery

Execute `discover-design-system` task to collect all data.
(If already ran in this session, use the .state.yaml data.)

### STEP 3 — Ask Supplementary Questions

Some fields can't be auto-detected. Ask in one block:

```
📋 Algumas informações para completar o manifest:

1. Nome do cliente/projeto: [ex: Erick Sena, Alpha Business Academy]
2. Tipo: [portfolio | landing-page | dashboard | app | site]
3. Plataforma de deploy: [cloudflare-pages | vercel | netlify | outro]
4. Domínio (se tiver): [ex: euericksena.com, ou "ainda não definido"]
5. Brand Engine client slug (se aplicável): [alpha | house-gt | não usa]
```

### STEP 4 — Generate the Manifest

Populate `.antigravity/templates/project-manifest.yaml` with all discovered
and elicited data. Write to `{project-root}/project-manifest.yaml`.

```yaml
# Exemplo de saída para portfolio-porto:
project:
  name: "Portfolio Porto"
  slug: "portfolio-porto"
  client: "erick-sena"
  type: "portfolio"
  status: "active"

framework:
  type: "vite-react"
  version: "19"
  language: "jsx"
  router: "react-router-v6"
  styling: "mixed"         # tailwind + inline styles
  tailwind_version: "v3"

tokens:
  source: "tailwind.config.js"
  brand_engine_client: null
  colors:
    background: "#000000"
    primary: "#FFFFFF"
    accent: "#C9A84C"
    text_primary: "#FFFFFF"
    text_muted: "rgba(255,255,255,0.45)"
  typography:
    font_display: "Inter"
    font_body: "Inter"
    font_mono: null
  ...
```

### STEP 5 — Update Uma's MEMORY.md

Add the project to the "Projects Known" section in
`.aios-core/development/agents/ux-design-expert/MEMORY.md`.

### STEP 6 — Confirm

```
✅ Manifest gerado: {project-root}/project-manifest.yaml
📝 MEMORY.md atualizado com o projeto

Próxima vez que você pedir uma página nesse projeto,
o agente vai carregar esse manifest automaticamente — sem perguntas.
```

---

## Reading the Manifest (for other tasks)

When `*discover` runs, it should check for `project-manifest.yaml` first:

```
Priority order for token discovery:
1. project-manifest.yaml (fastest — pre-computed)
2. tailwind.config.js (fallback)
3. tokens.yaml / global.css (fallback)
4. packages/brand-engine/clients/{slug}/ (if brand_engine_client set)
```

If `project-manifest.yaml` exists → skip STEP 1-4 of discover, load directly.
Always show: `✅ Manifest encontrado — carregando contexto salvo`
