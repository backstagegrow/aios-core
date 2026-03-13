# Load Brand Engine Tokens

> Task ID: load-brand-engine-tokens
> Agent: Uma (UX-Design-Expert)
> Version: 1.0.0

## Purpose

Load design tokens from the Brand Engine's client configuration and convert
them into the standard token format used by the UX agent.

Runs automatically when `*discover` detects a `brand_engine_client` in
`project-manifest.yaml`, or when the user specifies a client slug.

---

## When to Run

- `project-manifest.yaml` has `brand_engine_client: {slug}` set
- User says "esse projeto usa o cliente alpha" / "é para o house-gt"
- Running `*discover` in a project with `packages/brand-engine/clients/` directory

---

## Execution

### STEP 1 — Locate Client Config

Read `packages/brand-engine/clients/{slug}/client.config.json`.

If not found:
```
⚠ Brand Engine client "{slug}" não encontrado.
   Esperado em: packages/brand-engine/clients/{slug}/client.config.json
   Continuando com descoberta padrão...
```

### STEP 2 — Parse Client Config

Extract and map from the JSON structure:

```
client.config.json → Standard Token Format

brand.colors.brandPrimary    → tokens.colors.primary
brand.colors.brandSecondary  → tokens.colors.secondary
brand.colors.brandAccent     → tokens.colors.accent
brand.colors.danger          → tokens.colors.danger
brand.colors.success         → tokens.colors.success
brand.colors.warning         → tokens.colors.warning

brand.typography.fontHeading → tokens.typography.font_display
brand.typography.fontBody    → tokens.typography.font_body
brand.typography.fontMono    → tokens.typography.font_mono

brand.shape.radiusScale      → tokens.border_radius.scale
  "soft"  → 8px default, 4px small, 16px large
  "hard"  → 2px default, 1px small, 4px large
  "sharp" → 0px default, 0px small, 2px large
  "pill"  → 100px default

brand.mode                   → tokens.colors.mode (dark|light)
```

### STEP 3 — Build Token Snapshot

Output the resolved tokens:

```
╔══════════════════════════════════════════════════╗
║   BRAND ENGINE TOKENS — client: {slug}           ║
╠══════════════════════════════════════════════════╣
║ Client: {client.name}                            ║
║ Mode: {dark|light}                               ║
╠══════════════════════════════════════════════════╣
║ COLORS                                           ║
║   Primary ................ {brandPrimary}        ║
║   Secondary .............. {brandSecondary}      ║
║   Accent ................. {brandAccent}         ║
║   Danger ................. {danger}              ║
║   Success ................ {success}             ║
║   Warning ................ {warning}             ║
╠══════════════════════════════════════════════════╣
║ TYPOGRAPHY                                       ║
║   Heading ................ {fontHeading}         ║
║   Body ................... {fontBody}            ║
║   Mono ................... {fontMono}            ║
╠══════════════════════════════════════════════════╣
║ SHAPE                                            ║
║   Radius Scale ........... {radiusScale}         ║
╚══════════════════════════════════════════════════╝
```

### STEP 4 — Merge with Project Tokens

If the project also has `tailwind.config.js` or `global.css`:
- Brand Engine tokens take **priority** for brand colors and fonts
- Project-level tokens fill in spacing, border-radius specifics, etc.
- Flag any conflicts for user review

### STEP 5 — Persist to State

Update `.state.yaml`:

```yaml
brand_engine_client: "{slug}"
brand_engine_tokens_loaded: true
tokens:
  source: "brand-engine:{slug}"
  colors:
    primary: "{brandPrimary}"
    secondary: "{brandSecondary}"
    accent: "{brandAccent}"
    ...
```

---

## Client Reference

| Slug | Client Name | Primary | Mode |
|------|-------------|---------|------|
| `alpha` | Alpha Business Academy | `#C9A24A` | dark |
| `house-gt` | GT House | `#052F33` | light |
| `bks-grow` | BKS Grow | `#84CC16` | dark |

---

## Notes

- Brand Engine is the **source of truth** for client brand tokens
- Never hardcode client colors in pages — always load from Brand Engine
- If client config is incomplete, flag missing fields and ask user to complete it
- When client adds new colors to `client.config.json`, run `*discover` to refresh
