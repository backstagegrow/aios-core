# Create Page

> Task ID: create-page
> Agent: Uma (UX-Design-Expert)
> Version: 1.0.0

## Purpose

Create a complete, consistent page using the project's existing design system.
Produces zero-breakage output by building on discovered tokens and components.

---

## PRE-CONDITION (Mandatory)

Before executing any step, check if `.state.yaml` has `design_system_discovered: true`.

- **If YES** → proceed to STEP 1
- **If NO** → run `discover-design-system` task first, then return here

**This pre-condition is non-negotiable. Never generate a page without knowing the design system.**

---

## STEP 1 — Page Brief (Elicitation)

Ask the user to fill in the Page Brief. Use this exact format:

```
📄 PAGE BRIEF — preencha as informações abaixo:

1. Nome da página:      [ex: LandingPage, About, Pricing]
2. Rota/URL:            [ex: /about, /pricing, /landing-bks]
3. Objetivo principal:  [ex: capturar lead, mostrar portfólio, vender produto X]
4. Seções desejadas:    [ex: Hero, Serviços, Depoimentos, CTA, FAQ]
5. Referência visual:   [link, descrição, ou "seguir o padrão do projeto"]

Pode preencher em tópicos ou me contar em texto livre — eu organizo 👇
```

**Accept free-text answers.** Extract structured data from the user's response.

---

## STEP 2 — Plan the Page Structure

Based on the brief and the discovered design system, generate a page plan:

```yaml
page_plan:
  name: "{PageName}"
  route: "{/route}"
  file: "{src/pages/PageName.jsx | app/route/page.tsx}"
  goal: "{objective}"

  sections:
    - id: hero
      component: "New — Hero organism"
      tokens_used: [background, accent, heading-font]
      reuses: null

    - id: services
      component: "Reuse — existing ServiceCard molecule"
      tokens_used: [card-bg, border-subtle]
      reuses: "src/components/ServiceCard.jsx"

    - id: cta
      component: "New — CTA organism"
      tokens_used: [accent, button-primary]
      reuses: null

  seo:
    title: "{Page title for <title> tag}"
    description: "{Meta description}"
    og_image: "{path or 'to be defined'}"

  responsive:
    mobile_first: true
    breakpoints: [sm, md, lg]
```

Present this plan to the user. **Wait for approval before generating code.**

---

## STEP 3 — Generate the Page

Generate the complete page file following these rules:

### Token Rules (NON-NEGOTIABLE)
- Use ONLY colors from the discovered token snapshot
- Use ONLY fonts from the discovered token snapshot
- If a value is hardcoded (not in tokens), add a comment: `/* TODO: move to token */`
- Never invent a color or font — if not in tokens, ask the user

### Component Rules
- Reuse existing components instead of creating duplicates
- Import from correct paths (check existing imports in the project for conventions)
- New components go in `src/components/` matching the project's naming convention

### Code Structure
```jsx
// [PageName].jsx | page.tsx
// Route: {route}
// Sections: {list of sections}

import React from 'react';
// ... imports from existing components

// Design tokens (from project's tailwind.config.js / global.css)
// DO NOT hardcode — use the project's token system

const {PageName} = () => {
  return (
    <main>
      {/* Section: Hero */}
      {/* Section: ... */}
    </main>
  );
};

export default {PageName};
```

### Section Pattern
Each section must follow the project's existing section pattern.
If the project uses `<section style={...}>` (inline styles), follow that.
If the project uses Tailwind classes, follow that.
**Never mix patterns — match what exists.**

---

## STEP 4 — Validation Checklist

Run this checklist before delivering the page. Flag any failure:

```
[ ] Tokens: All colors/fonts come from the design system (no hardcoded values)
[ ] Components: Reused existing components where available
[ ] Routing: File placed in correct directory per framework convention
[ ] SEO: <title> and <meta description> present
[ ] Responsive: Mobile-first layout, no fixed-width breakages
[ ] Accessibility: Images have alt text, buttons have labels, headings in order
[ ] Consistency: Section headers follow project pattern (e.g., // 01 — LABEL)
[ ] Imports: All imports use project's path convention (absolute or relative)
[ ] No duplication: No component recreated that already exists
```

If any item fails:
- **Token/consistency failures** → fix before delivering
- **SEO/a11y gaps** → flag to user with suggested fix
- **Missing components** → note as follow-up `*build {component}` tasks

---

## STEP 5 — Deliver

Present the complete file with:

1. The page code (ready to copy or write to file)
2. Any `*build {component}` follow-ups if new components were needed
3. Routing setup instructions (how to add to App.jsx or next.js config)
4. Checklist result summary

```
✅ Page created: {PageName}
📁 File: {path}
🔗 Route: {/route}

Checklist: 9/9 passed

Follow-ups:
  *build hero-section   → create Hero organism
  *build cta-section    → create CTA organism
```

---

## Output Examples

### Vite + React (portfolio-porto pattern)
```jsx
import React from 'react';
import { Link } from 'react-router-dom';

// Tokens from global.css / tailwind config
const ACCENT = '#C9A84C';         // amber gold
const BG = '#000';                 // background
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

const AboutPage = () => {
  return (
    <main style={{ background: BG, color: '#fff', paddingTop: '80px' }}>
      {/* Hero */}
      <section style={{ padding: '80px 32px', maxWidth: '100rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 6vw, 5rem)', fontWeight: 700 }}>
          About
        </h1>
      </section>
    </main>
  );
};

export default AboutPage;
```

### Next.js (brand-console pattern)
```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Project Name',
  description: 'Page description',
};

export default function AboutPage() {
  return (
    <main className="bg-zinc-950 text-white min-h-screen pt-20">
      {/* content */}
    </main>
  );
}
```
