# Auditoria Completa de Sites Framer

**Data:** 2026-04-12
**Auditor:** Uma (UX Design Expert)
**Sites auditados:** SalesRocket, Humanly, Xtract

---

## Sumario Executivo Comparativo

| Dimensao | SalesRocket | Humanly | Xtract |
|----------|-------------|---------|--------|
| **Nicho** | SaaS AI/Web3 B2B | Studio digital (design + marketing) | Automacao AI para negocios |
| **Tom visual** | Dark futurista, tech-corporate | Dark editorial, agency premium | Dark moderno, gradientes purple |
| **Fonte principal** | Lexend + Poppins | Fragment Mono + Inter | Figtree + Fragment Mono |
| **Cor primaria** | Verde #13b973 / #2e8b57 | Vermelho/laranja #ff462e / #f24 | Roxo #814ac8 / #df7afe |
| **Background base** | #030208 / #100f14 (near-black) | #000 / #0d0d0d (pure dark) | #000 / #0d0d0d (pure dark) |
| **Secoes** | ~12 secoes (0 sections HTML, 13 h2) | 35 sections, 33 h2 | 18 sections, 17 h2 |
| **Imagens** | 91 | 109 | 54 |
| **Forms** | Nao | Sim (6 forms, 81 inputs) | Sim (2 forms, 6 inputs) |
| **Pricing** | Sim (3 tiers) | Sim (2-3 tiers) | Sim (3 tiers) |
| **Animacoes** | Framer Motion (442 transforms) | Framer Motion + Marquee (1339 transforms) | Framer Motion (914 transforms) |
| **Complexidade** | Media | Alta | Media-Alta |

### Principais diferenciais

- **SalesRocket:** Abordagem data-driven, hero com metricas/graficos, visual sci-fi corporativo
- **Humanly:** Design editorial premium, marquee tickers, tipografia mono como statement, palette vermelho/laranja energetico
- **Xtract:** Gradientes purple sofisticados, icons numerados em processos, CTA agressivo com verde de sucesso

---

## 1. SalesRocket (salesrocket.framer.ai)

### 1.1 Design System & Visual Identity

#### Paleta de Cores

| Tipo | Cor | Hex | Uso |
|------|-----|-----|-----|
| Background Principal | Near-black | `#030208` | Fundo principal |
| Background Secundario | Dark charcoal | `#100f14` | Cards, secoes alternadas |
| Background Terciario | Dark gray | `#29282d` | Elementos elevados |
| Superficie Card | Dark surface | `#1f1f23` a `#2e2d35` | Cards (gradient) |
| Primaria (Accent) | Verde | `#13b973` / `#2e8b57` | CTAs, highlights |
| Texto Principal | Branco | `#fff` | Headings, texto principal |
| Texto Secundario | Gray claro | `#c5c6c5` / `#c6c7c6` | Subtitulos, descricoes |
| Texto Muted | Mid-gray | `#5c5d66` / `#4d4f58` | Labels, metadata |
| Borda | Dark border | `#353539` / `#383b44` | Separadores, outlines |

**Gradientes:**
- Card principal: `linear-gradient(#1f1f23 0%, #2e2d35 100%)`
- Hero/secao: `linear-gradient(169.931deg, #0e0d13 0%, #1a191f 50%, #2a292e 100%)`
- Decorativo: `linear-gradient(#c3cacc 0%, #3a587f 100%)`
- Borda sutil: `linear-gradient(197deg, #3b3b42 17%, #161521 86%)`

#### Tipografia

| Nivel | Fonte | Tamanho | Peso | Line Height |
|-------|-------|---------|------|-------------|
| Display/H1 | Lexend | 68px | 700-800 | 1.2em / 110% |
| H2 | Lexend | 56px | 600-700 | 1.2em |
| H3 | Lexend | 38-48px | 600 | 1.2em |
| H4 | Poppins/Lexend | 28px | 500-600 | 140% |
| Body | Poppins | 16-18px | 400 | 1.6em / 160% |
| Small | Poppins | 14px | 400 | 1.6em |
| Caption | Poppins | 12px | 400 | 1.8em |

**Letter spacing:** `-0.02em` para headings, `0` para body

#### Espacamentos e Grid

| Token | Valor | Uso |
|-------|-------|-----|
| gap-xs | 10px | Inline items |
| gap-sm | 12px | Tight groups |
| gap-md | 16px | Default spacing |
| gap-lg | 24px | Between elements |
| gap-xl | 32px | Section internal |
| gap-2xl | 40px | Major groups |
| gap-3xl | 48px | Between sections |
| gap-4xl | 80px | Section padding |

**Border radius:** `8px` (botoes/cards pequenos), `16px` (cards medios), `24px` (cards grandes), `100%` (circular/avatar)

**Sombras:**
- Elevated card: `0px 0.6px 1.57px -1.5px rgba(0,0,0,0.17), 0px 2.29px 5.95px -3px rgba(0,0,0,0.14), 0px 10px 26px -4.5px rgba(0,0,0,0.02)`
- Inset border: `inset 0px 0px 0px 1px rgb(0, 0, 0)`

### 1.2 Componentes UI

#### Hero Section
- **Estrutura:** Badge superior ("SAAS AI web3") + H1 grande + subtitulo + 2 CTAs (primary + secondary) + imagem/mockup
- **Copy pattern:** "[Adjetivo] Solutions for [Publico]" — ex: "AI-Driven Solutions for Modern Businesses"
- **CTA principal:** "Get Started" (verde, pill shape)
- **Decoracao:** Ellipses/circulos decorativos, efeito glow sutil

#### Navbar
- **Estilo:** Transparente, sticky
- **Items:** Home, Feature, Pricing, About page, 404, Blog, Contact, Privacy, Terms
- **Logo:** "Fintec" branding
- **CTA na nav:** Botao "Get Started"

#### Botoes
| Variante | Estilo | Border Radius |
|----------|--------|---------------|
| Primary | Background verde (#13b973), texto branco | 8px |
| Secondary | Background transparente, borda branca, texto branco | 8px |
| Ghost/Link | Sem background, texto com seta | - |

#### Cards
- Background com gradient escuro
- Border sutil (1px inset)
- Border radius 16-24px
- Hover: elevacao sutil
- Conteudo: icone + titulo + descricao

#### Pricing Section
- 3 tiers em grid
- Card destaque com borda accent
- Lista de features com checkmarks
- Botao CTA por tier
- Toggle mensal/anual (se houver)

#### FAQ Section
- Accordion style
- Titulo "Got Questions? We've Got Answers!"
- Expand/collapse com icone

#### Footer
- Grid multi-coluna
- Logo + descricao
- Links organizados por categoria
- Social media icons
- Copyright

### 1.3 Animacoes & Microinteracoes

- **Framer Motion:** Ativo (442 instances de transform)
- **Scroll animations:** Fade-in + slide-up nos cards e secoes
- **Hover effects:** Scale sutil em cards, color transition em botoes
- **Marquee/Ticker:** Nao presente
- **Parallax:** Nao detectado
- **Transicoes:** Opacity-based appear animations
- **Cursor customizado:** Nao detectado

### 1.4 Layout & Estrutura

**Secoes na ordem (fluxo narrativo):**
1. Navbar (sticky, transparente)
2. Hero (H1 + CTA + visual)
3. Logos/Partners (social proof)
4. Features Overview (grid de cards)
5. Feature Detail 1 — Data Analytics
6. Feature Detail 2 — Automation
7. Feature Detail 3 — API Integration
8. Testimonials (carousel/grid)
9. Integrations
10. Pricing (3 tiers)
11. Blog (preview cards)
12. FAQ (accordion)
13. Final CTA ("Let's try our service now!")
14. Footer

### 1.5 Patterns de Copy/UX

- **Headline formula:** Verbo imperativo + beneficio + contexto tech
- **CTAs:** "Get Started", "Contact" — posicionados em hero, nav, pricing, final CTA
- **Social proof:** Metricas numeiricas (User Active, Transaction), logos de parceiros, testimonials com foto
- **Value prop:** "Innovate. Automate. Thrive." — triple-formula

---

## 2. Humanly (humanly.framer.website)

### 2.1 Design System & Visual Identity

#### Paleta de Cores

| Tipo | Cor | Hex | Uso |
|------|-----|-----|-----|
| Background Principal | Pure black | `#000` / `#0d0d0d` | Fundo dominante |
| Background Secundario | Near-black | `#121212` / `#1a1a1a` | Cards, secoes |
| Superficie | Dark gray | `#222` / `#383838` | Elementos elevados |
| Primaria (Accent) | Vermelho-laranja | `#ff462e` / `#f24` | CTAs, highlights, gradientes |
| Verde Sucesso | Verde | `#1dcc5d` | Status, confirmacao |
| Texto Principal | Branco | `#fff` | Headlines |
| Texto Forte | Branco 90% | `#ffffffe6` | Body principal |
| Texto Secundario | Branco 75% | `#ffffffbf` | Subtitulos |
| Texto Muted | Branco 65% | `#ffffffa6` | Descricoes |
| Texto Dim | Branco 55% | `#ffffff8c` | Labels |
| Borda | Branco 5% | `#ffffff0d` | Borders sutis |
| Borda Hover | Branco 10% | `#ffffff1a` | Borders hover |
| Overlay escuro | Preto 80% | `#000000cc` | Overlays |
| Cinza neutro | Cinza | `#4c4c4c` / `#4d4d4d` | Dividers |
| Surface Light | Quase branco | `#f5f5f5` | Secoes claras (contraste) |

**Gradientes:**
- CTA accent: `linear-gradient(90deg, #ff462e1a 0%, #ff462e 100%)`
- Fundo section: `linear-gradient(180deg, #0d0d0d ...)`
- Diagonal accent: `linear-gradient(141deg, #ff462e ...)`
- Overlay: `linear-gradient(262deg, rgb(0, 0, 0) ...)`

#### Tipografia

| Nivel | Fonte | Tamanho | Peso | Line Height |
|-------|-------|---------|------|-------------|
| Display | Fragment Mono / Inter | 66-80px | 600-700 | 100-110% |
| H2 | Inter | 53-56px | 600 | 110% |
| H3 | Inter | 39-45px | 500-600 | 120% |
| H4 | Inter | 28-34px | 500 | 130% |
| Body Large | Inter | 20-24px | 400 | 150% |
| Body | Inter | 16-18px | 400 | 150% |
| Small | Inter/Fragment Mono | 13-14px | 400 | 150% |
| Caption | Fragment Mono | 10-12px | 400 | 150% |

**Letter spacing:** Tight para headings (`-0.05em` a `-0.03em`), normal para body (`0`)

**Nota tipografica:** Fragment Mono como accent/display font cria identidade editorial/tech forte. Inter como workhorse para readability.

#### Espacamentos e Grid

| Token | Valor | Uso |
|-------|-------|-----|
| gap-xxs | 7px | Micro spacing |
| gap-xs | 8px | Tags, tight groups |
| gap-sm | 10px | Between items |
| gap-md | 15-16px | Default |
| gap-lg | 20-24px | Between elements |
| gap-xl | 48px | Major blocks |
| gap-2xl | 60px | Section internal |
| gap-3xl | 80px | Between sections |

**Border radius:** `7px` (small elements), `12px` (cards), `20px` (medium cards), `40px` (large containers), `50px` (tags/pills), `85px` (hero buttons, pill shape)

**Sombras:**
- Card hover: `5px 10px 20px 0px rgba(0, 0, 0, 0.25)`
- Subtle: `0px 1px 2px 0px rgba(0, 0, 0, 0.05)`
- Green glow: `0px 0px 4px 4px rgba(4, 255, 70, 0.2)`
- Red glow: `0px 0px 4px 4px rgba(255, 5, 5, 0.2)`
- Multi-layer: `0px 0.6px 1.57px -1.5px rgba(0,0,0,0.17), 0px 2.29px 5.95px -3px rgba(0,0,0,0.14), 0px 10px 26px -4.5px rgba(0,0,0,0.02)`
- Inset: `inset 0px 0px 0px 1px rgb(0, 0, 0)`

### 2.2 Componentes UI

#### Hero Section
- **Estrutura:** Navbar + texto centralizado com H1 grande + subtitulo + 2 CTAs + grid de perfis/imagens
- **Copy pattern:** "Design that inspires. Marketing that converts." — frase dupla balanceada
- **Social proof imediato:** "Trusted by 400+ fast moving founders"
- **CTA principal:** Pill-shaped button (85px radius)

#### Navbar
- **Estilo:** Transparente com blur, sticky
- **Items:** About, Services, Work, Contact, Blog
- **Logo:** "Humanly" com (R) registrado
- **Mobile:** Menu hamburger com animacao de linhas
- **Contato na nav:** Telefone e email visivel

#### Botoes
| Variante | Estilo | Border Radius |
|----------|--------|---------------|
| Primary | Background vermelho-laranja (#ff462e), pill shape | 85px |
| Secondary | Background transparente, borda branca | 50px |
| Ghost/Link | Texto com underline ou seta | - |
| CTA agressivo | Gradient vermelho com glow | 40px |

#### Cards
- Background escuro com borda sutil (#ffffff0d)
- Border radius 12-20px
- Hover: sombra mais intensa, scale sutil
- Service cards com icone + numero + titulo + descricao
- Testimonial cards com foto + quote + nome + cargo

#### Pricing Section
- 2-3 tiers: $2500, $3500, $10000
- Card com lista de deliverables
- Toggle quarterly/monthly (se presente)
- CTA por tier

#### Services Section
- Dois estilos detectados: "Services style 1" e "Services style 2"
- Cards com icone de servico + numero sequencial
- Categorias: Design, Marketing

#### Testimonials / Social Proof
- Highlight testimonial (featured)
- Grid de testimonials menores
- Metricas: "$8M+", "Top 10"
- Slideshow com controles de paginacao

#### Process Section
- Cards numerados sequenciais
- "Working with us is easy." — headline de processo

#### FAQ Section
- Accordion com expand/collapse
- Combinado com CTAs (Email + Chat CTA)

#### Footer
- Brand logo + informacoes de contato
- Links de navegacao + social links
- Grid organizado

### 2.3 Animacoes & Microinteracoes

- **Framer Motion:** Muito ativo (1339 transforms — o mais animado dos 3)
- **Marquee/Ticker:** SIM — logo ticker ou text marquee
- **Scroll animations:** Fade-in intenso (429 opacity refs)
- **Hover effects:** Scale + shadow em cards, color transitions
- **Slideshow:** Carousels com controles prev/next
- **Menu mobile:** Animacao de hamburger (linhas open/close)
- **Parallax:** Nao detectado
- **Cursor customizado:** Nao detectado

### 2.4 Layout & Estrutura

**Secoes na ordem:**
1. Navbar (sticky, transparent + blur)
2. Hero (H1 + CTAs + profiles grid)
3. Logo ticker/marquee (social proof)
4. "After hero" — stats/metricas
5. About / Glance section
6. Portfolio/Work showcase
7. Services Style 1 (Design)
8. Services Style 2 (Marketing)
9. Process (numbered steps)
10. Testimonials (highlight + grid)
11. Features/Benefits
12. Pricing (multi-tier)
13. FAQ + CTA combo
14. Blog preview
15. Final CTA section
16. Footer

### 2.5 Patterns de Copy/UX

- **Headline formula:** Frase dupla contrastante ("X that [verbo]. Y that [verbo].")
- **CTAs:** Telefone + email visivel (humanizado), botoes pill-shaped
- **Social proof:** "Trusted by 400+ founders", "$8M+", "Top 10"
- **Credibilidade:** Marca registrada (R), numeros reais, depoimentos com nome
- **Tom:** Confiante mas acessivel, direto, premium agency

---

## 3. Xtract (xtract.framer.ai)

### 3.1 Design System & Visual Identity

#### Paleta de Cores

| Tipo | Cor | Hex | Uso |
|------|-----|-----|-----|
| Background Principal | Pure black | `#000` | Fundo dominante |
| Background Secundario | Near-black | `#0d0d0d` (80% opacity) | Cards, overlays |
| Superficie | Dark gray | `#222` / `#262626` | Elementos elevados |
| Primaria (Accent) | Roxo profundo | `#814ac8` | Botoes, highlights |
| Primaria Light | Roxo claro/lilac | `#df7afe` | Gradientes, acentos |
| Texto Principal | Branco | `#fff` | Headlines |
| Texto Forte | Branco 90% | `#ffffffe6` | Body |
| Texto Secundario | Branco 75% | `#ffffffbf` | Subtitulos |
| Texto Muted | Cinza claro | `#ccc` | Descricoes |
| Borda | Branco 5% | `#ffffff0d` | Borders sutis |
| Borda Visible | Dark gray | `#222` | Borders de cards |

**Gradientes:**
- CTA principal: `linear-gradient(229deg, #df7afe ... #814ac8)`
- Diagonal accent: `linear-gradient(141deg, #df7afe ...)`
- Card overlay: `linear-gradient(149deg, #814ac866 0%, #0d0d0dcc ...)`
- Fade: `linear-gradient(269deg, rgba(255,255,255,0) ...)`
- Accent subtle: `linear-gradient(90deg, rgba(129,74,200,0.1) ...)`

#### Tipografia

| Nivel | Fonte | Tamanho | Peso | Line Height |
|-------|-------|---------|------|-------------|
| Display | Figtree | 70px | 700-900 | 1.1em |
| H2 | Figtree | 50-56px | 600-700 | 1.1em |
| H3 | Figtree | 40-45px | 600 | 1.2em |
| H4 | Figtree | 28-35px | 500-600 | 1.2em |
| Body Large | Figtree | 18-21px | 400 | 1.5em |
| Body | Figtree | 15-16px | 400 | 1.5em |
| Small | Fragment Mono | 12-14px | 400 | 1.4em |
| Caption | Fragment Mono | 8-10px | 300-400 | 1.4em |
| Micro | Figtree | 7px | 400 | 1em |

**Letter spacing:** `-0.04em` a `-0.06em` para headings (muito tight), `0` para body

**Nota tipografica:** Figtree (variable) como fonte principal — moderna, geometric sans-serif. Fragment Mono para labels e elementos tech.

#### Espacamentos e Grid

| Token | Valor | Uso |
|-------|-------|-----|
| gap-xxs | 2px | Micro, inline |
| gap-xs | 4-5px | Very tight |
| gap-sm | 8px | Small items |
| gap-md | 10-15px | Default |
| gap-lg | 16px | Between items |
| gap-xl | 24-25px | Between groups |
| gap-2xl | 60px | Section internal |

**Border radius:** `3-4px` (micro elements), `8px` (small cards), `12px` (medium), `18px` (cards), `40px` (buttons/pills), `50px` / `50%` (circular), `363px` (super-pill hero element)

**Sombras:**
- Inset border: `inset 0 0 0 1px #222`
- Multi-layer card: `0px 0.6px 1.57px -1.5px rgba(0,0,0,0.17), 0px 2.29px 5.95px -3px rgba(0,0,0,0.14), 0px 10px 26px -4.5px rgba(0,0,0,0.02)`
- Inset hard: `inset 0px 0px 0px 1px rgb(0, 0, 0)`

### 3.2 Componentes UI

#### Hero Section
- **Estrutura:** Badge/label superior + H1 grande + subtitulo + 2 CTAs + imagem/ilustracao
- **Copy pattern:** "[Adjetivo] Automation for [Publico Plural]." — ex: "Intelligent Automation for Modern Businesses."
- **CTA principal:** Gradient purple pill button
- **Elemento distintivo:** Super-pill radius (363px) para elemento hero destaque

#### Navbar
- **Estilo:** Sticky com background
- **Items:** Services, Process, Case studies, Benefits, Pricing (anchor links para secoes)
- **Paginas:** Home, About, Blog, Contact
- **Mobile:** Menu expandivel com animacao de linhas (3 states)
- **CTA na nav:** Botao "Get Started" ou similar

#### Botoes
| Variante | Estilo | Border Radius |
|----------|--------|---------------|
| Primary | Gradient purple (#814ac8 -> #df7afe) | 40px |
| Secondary | Background transparente, borda #222 | 40px |
| Ghost/Small | Sem background, texto pequeno | - |
| Icon button | Circular com seta | 50% |

#### Cards
- Background escuro com inset border (#222)
- Border radius 8-18px
- Hover: sombra multi-layer
- Service/benefit cards com icone + titulo + descricao
- Process cards com numero + checkmark

#### Pricing Section
- 3 tiers: $37/month, $75/month, Custom
- Card com lista de features
- Botao CTA por tier
- Tier destaque com gradient accent

#### Process Section
- Cards numerados com checkmarks
- Headline: "Our Simple, Smart, and Scalable Process"
- Navigation icons entre steps

#### Testimonials
- Grid de testimonial cards
- Slideshow com controles prev/next (multiple sliders detected)
- "Why Businesses Love Our AI Solutions"

#### FAQ Section
- Accordion combinado com CTA final
- "We've Got the Answers You're Looking For"

#### Footer
- 2 colunas: Logo + tagline (left), links (right)
- Layout clean e minimal

### 3.3 Animacoes & Microinteracoes

- **Framer Motion:** Ativo (914 transforms)
- **Scroll animations:** Fade-in + opacity (262 refs)
- **Slideshow:** Multiplos carousels com controles (3 slideshows detectados)
- **Hover effects:** Scale + shadow em cards, gradient transitions em botoes
- **Menu mobile:** 3 states de animacao (closed, expanded, linhas)
- **Marquee/Ticker:** Nao detectado
- **Parallax:** Nao detectado
- **Cursor customizado:** Nao detectado

### 3.4 Layout & Estrutura

**Secoes na ordem:**
1. Navbar (sticky)
2. Hero section (H1 + CTA + visual)
3. Logo carousel (social proof — "50+ business trust us")
4. Services grid (4 services com cards)
5. Case Studies / Testimonials preview
6. Process (numbered steps)
7. Benefits grid
8. Pricing (3 tiers)
9. Testimonials (carousel)
10. FAQ + CTA final
11. Footer

### 3.5 Patterns de Copy/UX

- **Headline formula:** "[Adjetivo] [Substantivo] for/that [Beneficio]"
- **Sub-headlines:** Acao + resultado — "Automate repetitive tasks", "Accelerate Sales Growth"
- **CTAs:** Gradient purple buttons, posicionados em hero, secoes, pricing, CTA final
- **Social proof:** "50+ business trust us", testimonials com nome
- **Urgencia:** "Let AI do the Work so you can Scale Faster" — frase final urgente
- **Clareza:** Pricing transparente com valores visiveis

---

## Tabela Comparativa: Componentes x Sites

| Componente | SalesRocket | Humanly | Xtract |
|------------|:-----------:|:-------:|:------:|
| **Navbar sticky** | Sim | Sim (blur) | Sim |
| **Mobile menu** | Nao detectado | Sim (hamburger animado) | Sim (3 states) |
| **Hero com H1** | Sim | Sim | Sim |
| **Badge/label hero** | Sim ("SAAS AI web3") | Sim ("Trusted by 400+") | Sim (label) |
| **Dual CTA hero** | Sim | Sim | Sim |
| **Logo carousel** | Sim (estatico) | Sim (marquee) | Sim (carousel) |
| **Feature cards** | Sim (3 features detail) | Sim (service cards) | Sim (4 services) |
| **Process section** | Nao | Sim (numbered) | Sim (numbered + check) |
| **Testimonials** | Sim (grid) | Sim (highlight + grid) | Sim (carousel) |
| **Stats/metrics** | Sim (User Active, etc) | Sim ($8M+, Top 10) | Sim (50+) |
| **Pricing** | Sim (3 tiers) | Sim (2-3 tiers) | Sim (3 tiers) |
| **FAQ accordion** | Sim | Sim (com CTA) | Sim (com CTA) |
| **Blog preview** | Sim | Sim | Nao detectado |
| **Contact form** | Nao | Sim | Sim |
| **Final CTA section** | Sim | Sim | Sim |
| **Footer multi-col** | Sim | Sim | Sim (2 col) |
| **Marquee/Ticker** | Nao | Sim | Nao |
| **Slideshow** | Nao | Sim | Sim (multiplos) |
| **Video** | Nao | Nao | Nao |

---

## Recomendacoes e Padroes Reutilizaveis

### Padroes universais identificados (presentes nos 3 sites)

1. **Dark mode como default** — todos usam fundo dark (#000 a #030208)
2. **Hero pattern:** Badge + H1 + Subtitle + 2 CTAs (primary gradient/solid + secondary outline)
3. **Social proof logo bar** — logo carousel/grid logo apos hero
4. **Feature/Service cards** — grid de 3-4 cards com icone + titulo + descricao
5. **Pricing 3-tier** — sempre 3 opcoes com tier destaque
6. **FAQ accordion** — secao de perguntas com expand/collapse
7. **Final CTA section** — secao dedicada de conversao antes do footer
8. **Footer multi-coluna** — logo + links + social
9. **Framer Motion** — todas usam framer-motion para scroll animations
10. **Pill-shaped CTAs** — border-radius alto (40-85px) para botoes principais

### Recomendacoes para novos sites

1. **Tipografia:** Usar combinacao de sans-serif moderna (Figtree/Lexend) + monospace accent (Fragment Mono) para identidade tech
2. **Cores:** Definir uma cor accent forte e unica por marca (verde/vermelho/roxo) sobre base escura
3. **Gradientes:** Usar gradientes diagonais (141deg, 229deg) para CTAs e elements hero
4. **Espacamento:** Manter hierarquia clara com gaps de 8px a 80px (escala de 8px)
5. **Border radius:** Usar 2 a 3 valores max (small 8px, medium 16-18px, pill 40px+)
6. **Sombras:** Multi-layer shadow para elevacao (3 layers com opacidades decrescentes)
7. **Animacoes:** Framer Motion com fade-in + slide-up como base, marquee para social proof
8. **Copy:** Hero formula = "[Adjetivo Impactante] [Solucao] for [Publico]" + subtitulo com beneficio
9. **Social proof:** Colocar metricas numeiricas + logos logo apos o hero
10. **Mobile:** Hamburger menu com animacao suave (linhas transforming)

---

## Design Tokens Sugeridos por Site

### SalesRocket Tokens

```yaml
# salesrocket-tokens.yaml
colors:
  background:
    primary: "#030208"
    secondary: "#100f14"
    tertiary: "#29282d"
    surface: "#1f1f23"
  accent:
    primary: "#13b973"
    secondary: "#2e8b57"
  text:
    primary: "#ffffff"
    secondary: "#c5c6c5"
    muted: "#5c5d66"
    dim: "#4d4f58"
  border:
    default: "#353539"
    subtle: "#383b44"

typography:
  font-family:
    display: "'Lexend', sans-serif"
    body: "'Poppins', sans-serif"
  font-size:
    display: "68px"
    h2: "56px"
    h3: "48px"
    h4: "28px"
    body: "16px"
    small: "14px"
    caption: "12px"
  font-weight:
    bold: 700
    semibold: 600
    medium: 500
    regular: 400
  letter-spacing:
    tight: "-0.02em"
    normal: "0"
  line-height:
    tight: "1.2em"
    normal: "1.6em"
    relaxed: "1.8em"

spacing:
  xs: "10px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "40px"
  3xl: "48px"
  4xl: "80px"

border-radius:
  sm: "8px"
  md: "16px"
  lg: "24px"
  full: "100%"

shadows:
  elevated: "0px 0.6px 1.57px -1.5px rgba(0,0,0,0.17), 0px 2.29px 5.95px -3px rgba(0,0,0,0.14), 0px 10px 26px -4.5px rgba(0,0,0,0.02)"
  inset-border: "inset 0px 0px 0px 1px rgb(0, 0, 0)"

gradients:
  card: "linear-gradient(#1f1f23 0%, #2e2d35 100%)"
  hero: "linear-gradient(169.931deg, #0e0d13 0%, #1a191f 50%, #2a292e 100%)"
  decorative: "linear-gradient(197deg, #3b3b42 17%, #161521 86%)"
```

### Humanly Tokens

```yaml
# humanly-tokens.yaml
colors:
  background:
    primary: "#000000"
    secondary: "#0d0d0d"
    tertiary: "#121212"
    surface: "#1a1a1a"
    surface-elevated: "#222222"
    surface-light: "#f5f5f5"
  accent:
    primary: "#ff462e"
    primary-alt: "#ff2244"
    success: "#1dcc5d"
  text:
    primary: "#ffffff"
    strong: "#ffffffe6"   # 90%
    secondary: "#ffffffbf" # 75%
    muted: "#ffffffa6"    # 65%
    dim: "#ffffff8c"       # 55%
  border:
    subtle: "#ffffff0d"    # 5%
    hover: "#ffffff1a"     # 10%
    light: "#ffffff33"     # 20%
  overlay:
    dark-80: "#000000cc"
    dark-90: "#000000e6"
    dark-75: "#000000bf"
    dark-60: "#00000099"

typography:
  font-family:
    display: "'Fragment Mono', monospace"
    body: "'Inter', sans-serif"
  font-size:
    display: "66px"
    display-lg: "80px"
    h2: "53px"
    h3: "39px"
    h4: "28px"
    body-lg: "20px"
    body: "16px"
    small: "14px"
    caption: "11px"
    micro: "10px"
  font-weight:
    bold: 700
    semibold: 600
    medium: 500
    regular: 400
    light: 300
  letter-spacing:
    extra-tight: "-0.05em"
    tight: "-0.04em"
    semi-tight: "-0.03em"
    normal: "0"
  line-height:
    tight: "100%"
    heading: "110%"
    subheading: "120%"
    body: "150%"

spacing:
  xxs: "7px"
  xs: "8px"
  sm: "10px"
  md: "16px"
  lg: "24px"
  xl: "48px"
  2xl: "60px"
  3xl: "80px"

border-radius:
  xs: "7px"
  sm: "12px"
  md: "20px"
  lg: "40px"
  pill: "50px"
  hero-pill: "85px"

shadows:
  card-hover: "5px 10px 20px 0px rgba(0, 0, 0, 0.25)"
  subtle: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)"
  glow-green: "0px 0px 4px 4px rgba(4, 255, 70, 0.2)"
  glow-red: "0px 0px 4px 4px rgba(255, 5, 5, 0.2)"
  elevated: "0px 0.6px 1.57px -1.5px rgba(0,0,0,0.17), 0px 2.29px 5.95px -3px rgba(0,0,0,0.14), 0px 10px 26px -4.5px rgba(0,0,0,0.02)"
  inset-border: "inset 0px 0px 0px 1px rgb(0, 0, 0)"

gradients:
  cta-fade: "linear-gradient(90deg, #ff462e1a 0%, #ff462e 100%)"
  section: "linear-gradient(180deg, #0d0d0d ...)"
  diagonal-accent: "linear-gradient(141deg, #ff462e ...)"
```

### Xtract Tokens

```yaml
# xtract-tokens.yaml
colors:
  background:
    primary: "#000000"
    secondary: "#0d0d0d"
    surface: "#222222"
    surface-alt: "#262626"
  accent:
    primary: "#814ac8"
    primary-light: "#df7afe"
    primary-subtle: "rgba(129, 74, 200, 0.1)"
    primary-glow: "rgba(223, 122, 254, 0.1)"
  text:
    primary: "#ffffff"
    strong: "#ffffffe6"   # 90%
    secondary: "#ffffffbf" # 75%
    muted: "#cccccc"
  border:
    default: "#222222"
    subtle: "#ffffff0d"    # 5%
    hover: "rgba(255, 255, 255, 0.12)"

typography:
  font-family:
    display: "'Figtree', 'Figtree Variable', sans-serif"
    accent: "'Fragment Mono', monospace"
  font-size:
    display: "70px"
    h2: "56px"
    h3: "45px"
    h4: "35px"
    body-lg: "18px"
    body: "15px"
    small: "12px"
    caption: "10px"
    micro: "7px"
  font-weight:
    black: 900
    bold: 700
    semibold: 600
    medium: 500
    regular: 400
    light: 300
  letter-spacing:
    extra-tight: "-0.06em"
    tight: "-0.04em"
    semi-tight: "-0.02em"
    normal: "0"
  line-height:
    tight: "1.1em"
    heading: "1.2em"
    body: "1.5em"

spacing:
  xxs: "2px"
  xs: "4px"
  sm: "8px"
  md: "15px"
  lg: "16px"
  xl: "24px"
  2xl: "60px"

border-radius:
  micro: "3px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "18px"
  pill: "40px"
  circle: "50%"
  hero: "363px"

shadows:
  inset-border: "inset 0 0 0 1px #222"
  elevated: "0px 0.6px 1.57px -1.5px rgba(0,0,0,0.17), 0px 2.29px 5.95px -3px rgba(0,0,0,0.14), 0px 10px 26px -4.5px rgba(0,0,0,0.02)"

gradients:
  cta-primary: "linear-gradient(229deg, #df7afe, #814ac8)"
  diagonal-accent: "linear-gradient(141deg, #df7afe ...)"
  card-overlay: "linear-gradient(149deg, #814ac866 0%, #0d0d0dcc)"
  subtle: "linear-gradient(90deg, rgba(129, 74, 200, 0.1) ...)"
```

---

## SYNAPSE Diagnostics Report (Appendix)

### Status Geral
- **Bracket:** FRESH (100% context)
- **Agent:** @squad-creator (full activation quality)
- **Overall:** 2 gaps found

### Gaps
| Severidade | Gap | Recomendacao |
|------------|-----|--------------|
| HIGH | Hook nao registrado em settings.local.json | Executar `npx aios-core install` |
| MEDIUM | Domain "agent-conselho" sem arquivo correspondente | Criar arquivo .synapse/agent-conselho |

### Timing
- Sem dados de timing disponiveis para esta sessao (hooks nao ativos)

---

*Auditoria realizada por Uma (UX Design Expert) — desenhando com empatia*
*Synkra AIOS v2.1.0 | 2026-04-12*
