# Uma — UX-Design-Expert Memory

> Agent: ux-design-expert (Uma)
> Last updated: 2026-03-13

## Design Philosophy (Persistent)

- **Atomic Design** é a metodologia central: atoms → molecules → organisms → templates → pages
- **Zero valores hardcoded** — todo styling vem de tokens de design
- **Design System First** — nunca criar página sem antes descobrir tokens e componentes existentes
- **WCAG AA mínimo** — acessibilidade é built-in, não bolt-on
- **Reutilização antes de criação** — checar componentes existentes antes de criar novos

## Projects Known

### portfolio-porto
- **Framework:** Vite + React 19
- **Stack:** React Router DOM v6, Tailwind CSS v3, PostCSS
- **Token Pattern:** Inline constants no topo do componente (`const ACCENT = '#C9A84C'`)
- **Accent Color:** `#C9A84C` (amber gold)
- **Background:** `#000` (black)
- **Typography:** Inter (body), system fonts
- **Pattern:** `SectionHeader` com `// 01 — LABEL` pattern
- **Components:** Header.jsx, Footer.jsx
- **Pages:** Home.jsx, ProjectDetail.jsx
- **Routing:** App.jsx com BrowserRouter + Routes
- **Deploy:** Cloudflare Pages

### brand-console
- **Framework:** Next.js 14 (App Router)
- **Stack:** React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide
- **Token Pattern:** Tailwind config + Shadcn/Radix
- **Colors:** zinc-950 (bg), brand primary via CSS vars
- **Routes:** /design-system/[slug], /control-center/, /clients/

## Brand Engine Clients Known

| Client | Slug | Primary | Secondary | Fonts |
|--------|------|---------|-----------|-------|
| Alpha Business Academy | alpha | `#C9A24A` | `#0B0B0B` | Montserrat + Inter |
| GT House | house-gt | TBD | TBD | TBD |

## Design Decisions (Persistent)

- `portfolio-porto`: Seção headers usam padrão `// 01 — LABEL` com cor ACCENT
- `portfolio-porto`: Cards de portfolio têm hover overlay (categoria + nome)
- `portfolio-porto`: Digital Expressions grid: 1 featured (col-span-2) + 6 menores
- `portfolio-porto`: CTA tem social proof (avatar stack + "+40 clientes")

## Extension Points

- Novas tasks vão em `.antigravity/tasks/` (não L2-protegido)
- Templates de projeto vão em `.antigravity/templates/`
- Este MEMORY.md é atualizado após decisões de design persistentes

## Common Pitfalls to Avoid

- ❌ Inventar cores que não existem no projeto
- ❌ Usar `relative imports` em projetos Next.js (usar absolute `@/`)
- ❌ Criar componente que já existe com nome diferente
- ❌ Gerar página sem checar framework de routing (Vite vs Next.js App Router)
- ❌ Esquecer SEO metadata em páginas Next.js
- ❌ Pular o `*discover` antes de criar página
