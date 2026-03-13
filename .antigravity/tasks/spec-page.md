# Spec Page — Specification for Complex Pages

> Task ID: spec-page
> Agent: Uma (UX-Design-Expert)
> Version: 1.0.0

## Purpose

Run a lightweight specification pipeline before building complex pages.
Prevents scope creep, misaligned expectations, and broken implementations.

**Use when:** Page has 4+ sections, external integrations, forms, animations,
conditional content, or when user brief is vague.

**Skip when:** Simple pages (1-2 sections), page brief is complete and clear.

---

## Complexity Check (Run First)

Score the page brief on these dimensions (1-5 each):

| Dimension | 1 (Simple) | 5 (Complex) |
|-----------|-----------|-------------|
| **Sections** | 1-2 static | 5+ with interactions |
| **Integrations** | None | Forms, APIs, analytics |
| **State** | None | Filters, modals, tabs |
| **Animations** | None | Scroll-triggered, parallax |
| **Content** | Static | Dynamic, conditional |

**Score threshold:**
- ≤ 8 → Skip spec, go directly to `*create-page`
- 9-15 → Run this spec (STANDARD)
- ≥ 16 → Run spec + schedule review before coding (COMPLEX)

---

## Phase 1 — Requirements Clarification

Ask targeted questions based on what's unclear in the brief:

```
📋 SPEC — Vamos alinhar antes de construir:

Para a página "{page-name}", preciso entender:

[SHOW ONLY RELEVANT QUESTIONS]

Conteúdo:
- Quais dados são estáticos vs dinâmicos?
- Tem conteúdo condicional (ex: mostrar diferente pra usuário logado)?

Interações:
- Tem formulários? Quais campos e para onde vai o submit?
- Tem modais, tabs, acordeões?
- Animações de scroll (fade-in, parallax)?

Integrações:
- Analytics? (GA4, Meta Pixel, hotjar)
- CRM ou email? (Brevo, Mailchimp)
- WhatsApp/calendário no CTA?

Performance:
- Tem imagens pesadas? (hero video, galeria)
- Precisa de lazy loading?

SEO:
- Tem meta description específica?
- Structured data? (LocalBusiness, FAQ, etc.)
```

### STEP 2 — Section-by-Section Spec

For each section in the brief, define:

```yaml
sections:
  - id: hero
    type: organism
    content:
      headline: "{text or 'user provides'}"
      subheadline: "{text or 'user provides'}"
      cta_primary: "{label + action}"
      cta_secondary: "{label + action or null}"
      background: "{image|video|gradient}"
      overlay: "{boolean}"
    interactions:
      - scroll_reveal: true
      - video_autoplay: false
    tokens_needed:
      - accent color for CTA
      - heading font
    reuses: "{existing component or 'new'}"

  - id: services
    type: organism
    content:
      items: "{dynamic from data or static list}"
      layout: "{grid-3|list|carousel}"
    interactions:
      - hover_card: true
    reuses: "ServiceCard molecule (exists)"
```

### STEP 3 — Technical Constraints

Document constraints that affect implementation:

```yaml
constraints:
  framework: "{vite-react|nextjs}"
  must_use_tokens: true
  no_external_css_libs: "{boolean}"  # Only tailwind/inline
  performance_budget:
    lcp_target: "< 2.5s"
    image_format: "webp|jpg|auto"
  accessibility:
    keyboard_nav: true
    screen_reader: true
    wcag_level: "AA"
```

### STEP 4 — Spec Summary Output

```
╔══════════════════════════════════════╗
║  PAGE SPEC — {page-name}            ║
╠══════════════════════════════════════╣
║ Complexity Score: {n}/25  [{class}] ║
║ Sections: {n}                        ║
║ New Components Needed: {n}           ║
║ Reused Components: {n}               ║
║ Integrations: {list or none}         ║
║ Estimated *build tasks: {n}          ║
╠══════════════════════════════════════╣
║ SECTIONS                             ║
║  01 Hero ............. NEW organism  ║
║  02 Services ......... REUSE Card   ║
║  03 CTA .............. NEW organism  ║
╠══════════════════════════════════════╣
║ FOLLOW-UPS AFTER PAGE                ║
║  *build hero-section                 ║
║  *build cta-section                  ║
║  *a11y-check                         ║
╚══════════════════════════════════════╝
```

### STEP 5 — Approval Gate

Present spec to user:

```
Spec pronto. Posso prosseguir com *create-page ou você quer ajustar algo?

[Aprovar e criar página] → *create-page {name}
[Ajustar spec] → "muda X para Y"
[Cancelar] → *exit
```

**Do NOT generate code until user approves the spec.**

---

## When Spec Reveals Problems

| Problem Found | Action |
|---------------|--------|
| Brief too vague | Ask clarification, don't assume |
| Integration not supported | Flag + suggest alternative |
| Scope too large for one page | Suggest splitting into sub-pages |
| Missing content (texts, images) | List gaps, mark as TODOs in code |
| Component doesn't exist | Add to follow-up `*build` list |
