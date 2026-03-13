# Site Creation Workflow

> Workflow ID: site-creation
> Agent: Uma (UX-Design-Expert)
> Version: 1.0.0
> Trigger: `*create-site {client-slug}` or `*create-site`

## Purpose

End-to-end workflow for creating a complete client site from brand tokens to deployed pages.
Orchestrates the 5 core tasks in the correct sequence, eliminating manual task-chaining.

**Input:** client slug (alpha | house-gt) + project path
**Output:** complete site with all pages created, validated, and ready to deploy

---

## When to Use

- Starting a new site/landing page from scratch for a known client
- Resuming an interrupted site creation (workflow checks `.state.yaml` to skip completed steps)
- Creating multiple pages for the same client in one session

---

## Workflow Steps

```
STEP 1: generate-project-manifest   → persists project context
STEP 2: load-brand-engine-tokens    → loads client brand tokens
STEP 3: [foreach page in plan]
          spec-page (if complex)    → aligns before building
          create-page               → generates the page
STEP 4: deploy                      → publishes to platform
```

---

## Execution

### STEP 0 — Resume Check

Before starting, check if `.state.yaml` exists in the project root.

If found and `workflow.current == "site-creation"`:
```
⚡ Sessão anterior encontrada para este projeto.

Progresso:
  ✅ Manifest gerado
  ✅ Tokens carregados
  ✅ Páginas criadas: {workflow.pages_created}
  ⏳ Pendentes: {workflow.pages_planned - pages_created}

Continuar de onde parou? [sim | não, reiniciar]
```

If `workflow.current` is null or file doesn't exist: start fresh at STEP 1.

---

### STEP 1 — Generate Project Manifest

Execute task: `generate-project-manifest`

**Success condition:** `project-manifest.yaml` written to project root.
**On failure:** do not proceed — manifest is required for context persistence.

Update `.state.yaml`:
```yaml
manifest_loaded: true
workflow:
  current: site-creation
  current_step: tokens
```

---

### STEP 2 — Load Brand Engine Tokens

Execute task: `load-brand-engine-tokens`

Use `brand_engine_client` from `project-manifest.yaml`.

**Success condition:** token snapshot printed, `.state.yaml` updated with colors/typography.
**On failure:** if client config not found, ask user to confirm slug or create config.

Update `.state.yaml`:
```yaml
brand_engine_tokens_loaded: true
workflow:
  current_step: pages
```

---

### STEP 3 — Plan Pages

Ask user for the site structure:

```
📐 ESTRUTURA DO SITE — Quais páginas vamos criar?

Exemplos:
  • Landing page única (home)
  • Home + Sobre + Contato
  • Home + Serviços + Sub-páginas (plenaria, garden, terreo)

Liste as páginas ou descreva o site em texto livre:
```

Parse response into a page plan:

```yaml
pages_planned:
  - name: Home
    route: /
    complexity: {score}
    run_spec: {boolean}
  - name: Sobre
    route: /sobre
    complexity: {score}
    run_spec: {boolean}
```

**Complexity scoring:** use `spec-page` complexity check (sections, integrations, state, animations, content).
Pages scoring ≥ 9 → set `run_spec: true`.

Update `.state.yaml`:
```yaml
workflow:
  current_step: creating-pages
  pages_planned: [...]
```

---

### STEP 4 — Create Pages (Loop)

For each page in `pages_planned` (in order):

#### 4a — Spec (if run_spec: true)
Execute task: `spec-page`
Wait for user approval before proceeding to 4b.

#### 4b — Create
Execute task: `create-page`

After each page:
- Add to `workflow.pages_created`
- Show mini-progress:
```
✅ {PageName} criada → {file-path}
⏳ Próxima: {NextPage} ({n} restantes)
```

Proceed to next page without waiting for user input (unless spec is needed).

**On failure:** report exact error, skip page, continue with next. List skipped pages at the end.

---

### STEP 5 — Summary Before Deploy

After all pages created:

```
╔══════════════════════════════════════════════╗
║  SITE CRIADO — {project.name}               ║
╠══════════════════════════════════════════════╣
║ Cliente .......... {client}                  ║
║ Páginas criadas .. {n}/{total}               ║
║ Tokens ........... Brand Engine ({slug})     ║
╠══════════════════════════════════════════════╣
║ PÁGINAS                                      ║
║  / ............... Home ✅                   ║
║  /sobre .......... Sobre ✅                  ║
║  /contato ........ Contato ✅                ║
╠══════════════════════════════════════════════╣
║ FOLLOW-UPS                                   ║
║  *a11y-check     → verificar acessibilidade  ║
║  *deploy         → publicar o site           ║
╚══════════════════════════════════════════════╝

Pronto para deploy? [*deploy | revisar primeiro]
```

---

### STEP 6 — Deploy (Optional, on user confirmation)

Execute task: `deploy`

If project uses git-connected deploy (Cloudflare Pages auto-deploy):
```
📡 Deploy via git push — delegando para @devops:

  @devops *push
```

---

## State Transitions

```
null
  → STEP 1: manifest_loaded = false → true
  → STEP 2: brand_engine_tokens_loaded = false → true
  → STEP 3: pages_planned = [] → [...]
  → STEP 4: pages_created grows with each page
  → STEP 5: workflow.current_step = "summary"
  → STEP 6: workflow.current_step = "deployed"
```

---

## Abort & Resume

If user types `*stop` at any point:
- Save current `.state.yaml`
- Show resume instructions:
```
Progresso salvo. Para continuar:
  *create-site → detectará automaticamente onde parou
```

---

## Client Quick Reference

| Client | Slug | Primary | Mode | Fonts |
|--------|------|---------|------|-------|
| Alpha Business Academy | `alpha` | `#C9A24A` | dark | Montserrat / Inter |
| GT House | `house-gt` | `#1A1A1A` | light | Playfair Display / Montserrat |
