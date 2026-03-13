# Discover Design System Context

> Task ID: discover-design-system
> Agent: Uma (UX-Design-Expert)
> Version: 1.0.0

## Purpose

Auto-discover the design system context of the current project **before** creating any page or component.
Prevents broken output by loading existing tokens, components, and patterns first.

This task MUST run automatically whenever `*create-page` or `*build` is called for the first time in a session.

---

## Execution

### STEP 1 — Identify Project Type

Detect which framework the project uses:

```
Look for (in order):
1. tailwind.config.js / tailwind.config.ts  → Tailwind project
2. tokens.yaml / tokens.json                → Custom token system
3. packages/brand-engine/clients/           → Brand Engine multi-client
4. src/styles/global.css or globals.css     → CSS variables
5. vite.config.js                           → Vite (React)
6. next.config.js / next.config.ts          → Next.js
```

### STEP 2 — Load Design Tokens

Read token sources in this priority order:

1. `tokens.yaml` or `tokens.json` (root or `src/`)
2. `tailwind.config.js` → extract `theme.extend` (colors, spacing, fontFamily, borderRadius)
3. `src/styles/global.css` → extract CSS custom properties (`:root { --color-* }`)
4. `packages/brand-engine/clients/{client-name}/` → client-specific tokens

**Extract and summarize:**
```yaml
tokens_found:
  colors:        # e.g., primary: #C9A84C, background: #000
  typography:    # e.g., font-sans: "Inter", font-display: "Playfair Display"
  spacing:       # e.g., section: 100px, card: 32px
  border_radius: # e.g., pill: 100px, card: 12px
  shadows:       # e.g., card: "0 4px 24px rgba(0,0,0,0.3)"
```

### STEP 3 — Inventory Existing Components

Scan for existing reusable components:

```
Look in:
- src/components/**/*.jsx|tsx
- components/**/*.jsx|tsx
- app/components/**/*.tsx
```

Classify by atomic level:
```yaml
components_available:
  atoms:     # Button, Input, Badge, Icon...
  molecules: # Card, FormField, NavItem...
  organisms: # Header, Footer, Hero, Section...
  templates: # PageLayout, DashboardLayout...
```

### STEP 4 — Map Existing Pages / Routes

Identify what pages already exist (for consistency):

```
Next.js:  app/**/page.tsx  or  pages/**/*.tsx
Vite:     src/pages/**/*.jsx|tsx  or  App.jsx routes
```

```yaml
pages_existing:
  - path: /
    file: src/pages/Home.jsx
  - path: /project/:id
    file: src/pages/ProjectDetail.jsx
```

### STEP 5 — Output Design System Snapshot

Present a structured summary to use as context for page/component creation:

```
╔══════════════════════════════════════════════════╗
║        DESIGN SYSTEM SNAPSHOT                    ║
╠══════════════════════════════════════════════════╣
║ Framework:    [Vite/React | Next.js | Other]     ║
║ Token Source: [tokens.yaml | tailwind | CSS vars]║
╠══════════════════════════════════════════════════╣
║ COLORS                                           ║
║   Background ............. #000000               ║
║   Primary Accent ......... #C9A84C               ║
║   Text Primary ........... #FFFFFF               ║
║   Text Muted ............. rgba(255,255,255,0.45)║
╠══════════════════════════════════════════════════╣
║ TYPOGRAPHY                                       ║
║   Display ................ [font name]           ║
║   Body ................... [font name]           ║
╠══════════════════════════════════════════════════╣
║ COMPONENTS AVAILABLE                             ║
║   Atoms: [list or "none found"]                  ║
║   Molecules: [list or "none found"]              ║
║   Organisms: [list or "none found"]              ║
╠══════════════════════════════════════════════════╣
║ EXISTING PAGES                                   ║
║   [route] → [file]                               ║
╠══════════════════════════════════════════════════╣
║ STATUS                                           ║
║   ✅ Tokens loaded from [source]                 ║
║   ⚠  No components found — greenfield            ║
╚══════════════════════════════════════════════════╝
```

### STEP 6 — Persist to State

Save snapshot to `.state.yaml` **at the project root** (same directory as `package.json`).

**Path:** `{project-root}/.state.yaml` — NOT `outputs/ux-design/`.

```yaml
# {project-root}/.state.yaml
design_system_discovered: true
manifest_loaded: false
brand_engine_client: "{slug or null}"
brand_engine_tokens_loaded: false
tokens:
  source: "{file path}"
  colors:
    background: "{#hex}"
    primary: "{#hex}"
    accent: "{#hex}"
    text_primary: "{#hex}"
    text_muted: "{rgba}"
  typography:
    font_display: "{font-name}"
    font_body: "{font-name}"
    font_mono: "{font-name or null}"
  spacing:
    section_padding: "{value}"
    card_padding: "{value}"
  border_radius:
    default: "{value}"
    pill: "{value}"
  mode: "{dark|light}"
framework: "{vite-react|nextjs|other}"
components:
  directory: "{src/components}"
  atoms: []
  molecules: []
  organisms: []
pages:
  directory: "{src/pages|app}"
  existing: []
workflow:
  current: null
  current_step: null
  pages_planned: []
  pages_created: []
meta:
  state_version: "1.0"
  initialized_at: "{ISO timestamp}"
  last_updated: "{ISO timestamp}"
  session_agent: "ux-design-expert"
```

After writing `.state.yaml`, add it to `.gitignore` if not already present.

---

## Output Contract

After discovery, the agent **MUST**:
- Use discovered tokens — never invent colors or fonts
- Reuse existing components when available — never duplicate
- Follow existing naming/routing conventions of the project
- Flag any gaps before proceeding (missing tokens, no components, etc.)

---

## When This Runs

| Trigger | Behavior |
|---------|----------|
| `*create-page` | Always runs first (auto) |
| `*build {component}` | Runs if no `.state.yaml` yet |
| `*compose` | Runs if no `.state.yaml` yet |
| `*discover` (manual) | Always runs, refreshes state |

---

## Failure Handling

| Situation | Action |
|-----------|--------|
| No design system found | Warn + ask user to run `*setup` first |
| No tokens found | Proceed with gaps flagged, ask user to confirm |
| No components found | Note "greenfield" — build from scratch |
| Partial tokens | Use what exists, flag what's missing |
