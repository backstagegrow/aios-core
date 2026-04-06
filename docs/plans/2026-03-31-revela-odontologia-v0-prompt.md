# Revela Odontologia — Master Prompt para v0.dev / Lovable
**Gerado por:** Uma (UX-Design Expert) | **Data:** 2026-03-31
**Target:** v0.dev, Lovable.ai, Bolt.new

---

## Como usar

1. Copie o bloco abaixo integralmente
2. Cole diretamente no v0.dev (chat input) ou Lovable
3. Se o resultado vier truncado, envie na sequência: `"Continue com as seções [S4] em diante, mantendo o mesmo stack e estilo"`
4. Após gerar, revise: imagens, formulário, links, CRO-SP

---

```
You are an elite frontend engineer and visual designer building a PRODUCTION-READY landing page for a premium dental clinic in São Paulo, Brazil. This is NOT a generic template — every pixel must justify the premium positioning.

═══════════════════════════════════════════════
SECTION 0 — PROJECT CONTEXT & ONLYNESS STATEMENT
═══════════════════════════════════════════════

CLIENT: Revela Odontologia
TAGLINE: "Seu sorriso, redesenhado digitalmente"
ONLYNESS: The only dental clinic in São Paulo where patients SEE their new smile in video BEFORE any procedure begins — powered by Digital Smile Design technology.
LOCATION: Av. Brigadeiro Faria Lima, 3477 — Itaim Bibi, São Paulo, SP
LEAD: Dra. Camila Rocha — CRO-SP 18.432 — DSD Certified Clinician
PHONE: (11) 9984-3310

═══════════════════════════════════════════════
SECTION 1 — TECH STACK (STRICT — DO NOT DEVIATE)
═══════════════════════════════════════════════

- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS v3 (utility-first, NO CSS-in-JS)
- Animations: Framer Motion (scroll-triggered only — use `useInView` + `motion.div`)
- Icons: Lucide React
- Fonts: Google Fonts — Playfair Display (headings) + Inter (body)
- Images: All `<img>` tags MUST use `src="/placeholder-local.jpg"` — NO Unsplash, NO random URLs
- Forms: Controlled React state — NO external form libraries
- NO shadcn/ui. NO MUI. NO Radix. Build components from scratch with Tailwind.

═══════════════════════════════════════════════
SECTION 2 — DESIGN SYSTEM (ZERO DEVIATION ALLOWED)
═══════════════════════════════════════════════

COLOR TOKENS (use as Tailwind arbitrary values or inline styles):
  --color-bg:          #0A0A0A   /* Near-black base */
  --color-surface:     #111111   /* Cards, elevated surfaces */
  --color-border:      #1F1F1F   /* Subtle separators */
  --color-gold:        #C9A96E   /* Primary accent — CTAs, highlights */
  --color-gold-light:  #E8D5A3   /* Hover states, text accents */
  --color-white:       #F5F5F0   /* Body text, headings */
  --color-muted:       #888888   /* Secondary text, labels */
  --color-blue-tech:   #3A6EA5   /* Trust badges, tech elements */

TYPOGRAPHY RULES:
  - H1: Playfair Display, 72–96px, font-weight 700, line-height 1.05, color #F5F5F0
  - H2: Playfair Display, 48–64px, font-weight 600, color #F5F5F0
  - H3: Inter, 20–24px, font-weight 600, letter-spacing -0.02em, color #F5F5F0
  - Body: Inter, 16–18px, font-weight 400, line-height 1.7, color #888888
  - Label/Caption: Inter, 12–13px, font-weight 500, letter-spacing 0.12em, UPPERCASE, color #C9A96E
  - NEVER mix more than 2 typeface weights per section

SPACING PHILOSOPHY:
  - Minimum section padding: py-24 (mobile) → py-32 (desktop)
  - Luxury breathing room — the void IS the design
  - Max content width: max-w-6xl mx-auto px-6

AESTHETIC MODE: DARK CINEMATIC
  - Deep black backgrounds with near-black surfaces for cards
  - Gold (#C9A96E) used ONLY for: CTAs, accents, hover states, section labels
  - Glassmorphism for forms: backdrop-blur-md bg-white/5 border border-white/10
  - Subtle grain texture on hero: use a CSS radial-gradient overlay
  - Sub-pixel borders everywhere: border border-[#1F1F1F]
  - Box shadows: shadow only in gold — `box-shadow: 0 0 40px rgba(201,169,110,0.1)`

═══════════════════════════════════════════════
SECTION 3 — PAGE ARCHITECTURE (9 SECTIONS — ALL REQUIRED)
═══════════════════════════════════════════════

Build ALL sections in a single page.tsx file. Each section is a separate React component imported into the page. Use scroll-triggered Framer Motion animations (fade-up, stagger children) on every section except the Hero (Hero animates on mount).

──────────────────────────────────────────────
[S1] HERO — Full Viewport, Cinematic Impact
──────────────────────────────────────────────
VISUAL ARCHETYPE: 100vh, extreme contrast, Onlyness Statement lives here.

LAYOUT:
- Full screen height (min-h-screen)
- Background: #0A0A0A with subtle radial gradient overlay (gold at 2% opacity center)
- Left column (60%): headline + sub + CTAs + trust strip
- Right column (40%): placeholder for before/after smile image (aspect-ratio 3/4, rounded-2xl, subtle gold border)
- On mobile: stack vertically, image goes BELOW the text

COPY TO RENDER (exact):
  LABEL (uppercase gold, letter-spacing wide): "ODONTOLOGIA DIGITAL • SÃO PAULO"
  H1 (3 lines, each word gets its own animation stagger):
    Line 1: "Seu sorriso"
    Line 2: "foi feito para"
    Line 3: "ser revelado." ← "revelado" in gold (#C9A96E)

  SUBHEADLINE (body gray, max-w-md):
    "Odontologia estética e implantes com tecnologia Digital Smile Design. Visualize seu resultado antes mesmo de começar o tratamento."

  CTAs (horizontal flex, gap-4):
    PRIMARY BUTTON: "Agendar minha Avaliação Digital"
      Style: bg-[#C9A96E] text-black px-8 py-4 font-semibold hover:bg-[#E8D5A3] transition-all duration-300 — NO border-radius, sharp corners
    SECONDARY BUTTON: "Ver casos reais →"
      Style: border border-[#C9A96E] text-[#C9A96E] px-8 py-4 hover:bg-[#C9A96E]/10 transition-all duration-300

  TRUST STRIP (small, muted, flex gap-6, mt-8):
    "✦ +1.200 sorrisos transformados"
    "✦ Digital Smile Design certificado"
    "✦ Av. Faria Lima, SP"

  IMAGE PLACEHOLDER:
    <img src="/placeholder-hero-smile.jpg" alt="Sorriso transformado" className="w-full h-full object-cover rounded-2xl border border-[#C9A96E]/20" />

──────────────────────────────────────────────
[S2] DIFERENCIAIS TECH — Bento Grid
──────────────────────────────────────────────
VISUAL ARCHETYPE: Glowing bento grid — 4 cards in a 2x2 grid (desktop) / 1 column (mobile)

LAYOUT:
- Section label: "NOSSOS DIFERENCIAIS" (gold, uppercase, letter-spacing)
- H2: "Por que a Revela é diferente?"
- Below: 2x2 grid of feature cards

CARD STYLE:
  bg-[#111111] border border-[#1F1F1F] p-8 rounded-none (sharp corners)
  On hover: border-[#C9A96E]/30 + box-shadow: 0 0 30px rgba(201,169,110,0.08)
  transition-all duration-500

CARDS (render all 4):
  Card 1 — Icon: Monitor (Lucide)
    Title: "Digital Smile Design"
    Body: "Antes de qualquer procedimento, você vê o resultado final em vídeo. Aprovação total — ou não começamos."

  Card 2 — Icon: ScanLine (Lucide)
    Title: "Escaneamento 3D Intraoral"
    Body: "Sem moldagem com silicone. Mapeamos toda a sua boca em minutos com precisão de 0,01mm."

  Card 3 — Icon: Zap (Lucide)
    Title: "Protocolo One Day"
    Body: "Implantes provisórios em um único dia. Saia da clínica com seu sorriso novo ainda na consulta."

  Card 4 — Icon: Microscope (Lucide)
    Title: "Materiais de última geração"
    Body: "Lentes em cerâmica e-max, alinhadores Invisalign certificados, próteses fresadas em zircônia."

ICON STYLE: text-[#C9A96E], size 24px, mb-4

──────────────────────────────────────────────
[S3] ESPECIALIDADES — Horizontal Scroll Cards
──────────────────────────────────────────────
VISUAL ARCHETYPE: Asymmetric card grid — 3 cols desktop, horizontal swipe carousel mobile (MANDATORY — no flex-col stacking)

LAYOUT:
- Label: "TRATAMENTOS" (gold, uppercase)
- H2: "Tratamentos que transformam."
- Desktop: CSS grid, 3 columns, gap-px (touching cards with 1px gap in border color)
- Mobile: overflow-x-auto, flex, snap-x snap-mandatory, each card snap-start min-w-[85vw]

CARD STYLE:
  bg-[#0F0F0F] border border-[#1F1F1F] p-8
  Top: number ("01", "02"...) in gold/10% opacity, text-6xl font-bold
  Middle: service name H3 + body text
  Bottom: "Ver mais →" in gold

SERVICES (render all 5):
  01 — "Lentes de Contato Dental"
  Body: "Facetas ultrafinas que corrigem forma, cor e tamanho dos dentes — sem desgaste excessivo. Resultado imediato e duradouro."

  02 — "Implantes Dentários"
  Body: "Substituição permanente de dentes perdidos com titânio biocompatível. Protocolos All-on-4 e All-on-6 disponíveis."

  03 — "Alinhadores Invisíveis"
  Body: "Ortodontia discreta com alinhadores Invisalign. Removíveis, transparentes, confortáveis."

  04 — "Clareamento Dental"
  Body: "Protocolo whitening de consultório com resultado até 8 tons mais claro em uma sessão."

  05 — "Harmonização do Sorriso"
  Body: "Combinação personalizada de procedimentos para reequilibrar proporções e criar um sorriso natural e harmonioso."

──────────────────────────────────────────────
[S4] DIGITAL SMILE DESIGN — 3-Step Process
──────────────────────────────────────────────
VISUAL ARCHETYPE: Strict 3-column architectural sequence with connecting line

LAYOUT:
- Label: "COMO FUNCIONA" (gold, uppercase)
- H2: "Do projeto ao sorriso: 3 etapas."
- 3 columns connected by a thin horizontal line (hidden mobile)
- Each column: large step number → title → body
- Bottom CTA centered: "Quero visualizar meu sorriso →"

STEP STYLE:
  Step number: Playfair Display, text-8xl, color #C9A96E/20 (very subtle)
  Title: Inter semibold, text-xl, color #F5F5F0
  Body: Inter, text-base, color #888888

STEPS:
  Step 01 — "Análise Digital"
  Body: "Fotografias e vídeos do seu sorriso são processados em software especializado. Mapeamos proporções, linha do sorriso e harmonia facial."

  Step 02 — "Seu Projeto Personalizado"
  Body: "A Dra. Camila desenvolve um projeto 3D do seu novo sorriso. Você aprova — ou refinamos até ficar perfeito."

  Step 03 — "Execução com Precisão"
  Body: "Com o projeto aprovado, executamos com exatidão milimétrica. Sem surpresas. Só o resultado que você viu."

CTA BUTTON (centered, same secondary style as hero):
  "Quero visualizar meu sorriso →"
  Style: border border-[#C9A96E] text-[#C9A96E] px-10 py-4 mt-16 hover:bg-[#C9A96E]/10

──────────────────────────────────────────────
[S5] SOBRE A DRA. CAMILA — Human Split Layout
──────────────────────────────────────────────
VISUAL ARCHETYPE: Asymmetric split — image left, text right. Break the grid intentionally.

LAYOUT:
- Left (45%): Image placeholder, full height, no border-radius, overflow hidden
  <img src="/placeholder-dra-camila.jpg" alt="Dra. Camila Rocha" className="w-full h-full object-cover" style={{filter: 'grayscale(20%)'}} />
- Right (55%): Text content, py-16 pl-16
- Mobile: Stack, image first, text below (keep image aspect-ratio 4/3)

COPY:
  Label: "SOBRE A ESPECIALISTA" (gold, uppercase)
  H2: "Por trás de cada sorriso, uma especialista comprometida."
  Body: "Dra. Camila Rocha formou-se pela USP com especialização em Prótese Dentária e Implantodontia pela APCD. Com mais de 12 anos de experiência, especializou-se em odontologia estética digital e foi certificada internacionalmente em Digital Smile Design em Lisboa. Sua abordagem combina rigor técnico com escuta genuína: entender o que cada paciente quer — e ir além."

CREDENTIALS (flex wrap, gap-3, mt-8):
  Each credential: pill with border border-[#C9A96E]/30 text-[#C9A96E] text-xs px-4 py-2
  Pills: "CRO-SP 18.432" | "Especialista em Prótese (ABO)" | "DSD Certified Clinician" | "USP Graduação" | "APCD Especialização"

──────────────────────────────────────────────
[S6] CASOS REAIS — Before/After Grid
──────────────────────────────────────────────
VISUAL ARCHETYPE: 3-column image grid (desktop), horizontal swipe carousel (mobile — MANDATORY)

LAYOUT:
- Label: "RESULTADOS" (gold, uppercase)
- H2: "Resultados que falam por si."
- Subtext: "Antes e depois reais de pacientes da Revela. Sem filtros, sem edição."
- Grid: 3 cols × 2 rows = 6 cards (desktop) | horizontal swipe (mobile)

CASE CARD STYLE:
  bg-[#111111] border border-[#1F1F1F] overflow-hidden group
  Top: placeholder image with aspect-ratio 4/3
    Before label: absolute top-3 left-3 bg-black/70 text-white text-xs px-2 py-1
    After label: absolute top-3 right-3 bg-[#C9A96E] text-black text-xs px-2 py-1
  Bottom: treatment name + duration (p-4)

CASES (render all 6):
  1. "Lentes de contato" — "2 sessões"
  2. "All-on-4 superior" — "Protocolo 1 dia"
  3. "Alinhadores Invisalign" — "8 meses"
  4. "Clareamento + reanatomização" — "1 sessão"
  5. "Facetas e-max" — "6 dentes"
  6. "Harmonização completa" — "3 sessões"

EACH IMAGE: <img src="/placeholder-caso-{n}.jpg" alt="Caso {n}" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />

CTA (centered, mt-12):
  "Ver galeria completa →" — same secondary button style

──────────────────────────────────────────────
[S7] DEPOIMENTOS — Minimalist Testimonials
──────────────────────────────────────────────
VISUAL ARCHETYPE: 3-column cards. Social proof, zero clutter, whitespace is king.

LAYOUT:
- Label: "DEPOIMENTOS" (gold, uppercase)
- H2: "O que nossos pacientes dizem."
- 3 cards side by side (desktop) | 1 column (mobile — stacked is OK here, cards are compact)

CARD STYLE:
  bg-[#111111] border border-[#1F1F1F] p-8 rounded-none
  Opening quote: text-4xl text-[#C9A96E]/40 font-serif leading-none mb-4
  Body text: text-[#F5F5F0]/80 text-base leading-relaxed italic
  Attribution: mt-6 pt-6 border-t border-[#1F1F1F]
    Name: text-[#F5F5F0] font-semibold text-sm
    Treatment: text-[#C9A96E] text-xs uppercase letter-spacing-wide
    Stars: 5× "★" in gold

TESTIMONIALS (render all 3, exact copy):
  1.
    Body: "Sempre tive vergonha de sorrir em fotos. Fiz as lentes de contato com a Dra. Camila e mudou minha relação com o espelho — e com as pessoas."
    Name: "Marina S., 34 anos"
    Treatment: "Lentes de contato dental"

  2.
    Body: "Perdi um dente e travei por 2 anos sem fazer nada. O All-on-4 da Revela foi a melhor decisão da minha vida. Saí do consultório com dentes novos no mesmo dia."
    Name: "Roberto F., 52 anos"
    Treatment: "Implante All-on-4"

  3.
    Body: "O Digital Smile Design me convenceu. Ver como ficaria antes de fazer qualquer coisa me deu segurança total. Resultado exatamente como foi projetado."
    Name: "Juliana M., 28 anos"
    Treatment: "Harmonização do sorriso"

──────────────────────────────────────────────
[S8] AGENDAMENTO — Glassmorphism CTA Section
──────────────────────────────────────────────
VISUAL ARCHETYPE: High-urgency, contrasting background — deep gold-tinted surface to aggressively isolate this section.

LAYOUT:
- Full-width section with bg-[#0F0C06] (very dark warm black)
- Centered content, max-w-2xl
- Form in glassmorphism card: backdrop-blur-md bg-white/5 border border-white/10 p-10

COPY:
  Label: "AVALIAÇÃO GRATUITA" (gold, uppercase)
  H2: "Pronto para revelar seu sorriso?"
  Subtext: "Comece com uma avaliação digital gratuita. Sem compromisso — veja seu resultado antes de decidir."

FORM (controlled React state — NO external libraries):
  Field 1: Full-width text input — placeholder "Nome completo *"
  Field 2: Full-width text input — placeholder "WhatsApp *" (type="tel")
  Field 3: Full-width select dropdown:
    Options: "Tratamento de interesse..." | "Lentes de contato" | "Implantes" | "Alinhadores" | "Clareamento" | "Quero avaliar / Não sei ainda"
  Field 4: Full-width select dropdown:
    Options: "Melhor horário..." | "Manhã (8h–12h)" | "Tarde (12h–17h)" | "Noite (17h–20h)"

  SUBMIT BUTTON (full-width):
    Text: "Agendar minha Avaliação Digital Gratuita"
    Style: bg-[#C9A96E] text-black py-5 font-semibold text-base w-full hover:bg-[#E8D5A3] transition-all duration-300

INPUT STYLE (apply to ALL inputs and selects):
  bg-transparent border border-white/20 text-[#F5F5F0] placeholder-[#555] px-5 py-4 w-full
  focus:outline-none focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E]/30
  transition-all duration-300

TRUST BADGES (flex, gap-6, mt-6, text-xs text-[#888888]):
  "🔒 Seus dados estão seguros"
  "⚡ Resposta em até 2h"
  "✦ Sem spam"

CONTACT INFO BLOCK (below form, mt-10, text center):
  "📍 Av. Brigadeiro Faria Lima, 3477 — cj. 82 · Itaim Bibi, São Paulo — SP"
  "📞 (11) 9984-3310"
  "🕐 Seg–Sex: 8h às 20h · Sáb: 9h às 14h"

──────────────────────────────────────────────
[S9] FOOTER — Minimal, Authoritative
──────────────────────────────────────────────
VISUAL ARCHETYPE: Ultra-minimal footer, max contrast, zero clutter.

LAYOUT:
  bg-[#0A0A0A] border-t border-[#1F1F1F] py-16 px-6
  Top row: Logo wordmark left | Nav links center | Social icons right
  Bottom row: Copyright left | Legal links right
  Mobile: All stacked, centered

LOGO WORDMARK:
  "REVELA" — Playfair Display, text-2xl, text-[#F5F5F0]
  "ODONTOLOGIA" — Inter, text-xs, letter-spacing-[0.3em], text-[#C9A96E], uppercase

NAV COLUMNS (3 columns, gap-8):
  Col 1 "Especialidades": Lentes de contato | Implantes | Alinhadores | Clareamento
  Col 2 "Institucional": Sobre a Dra. Camila | Tecnologia DSD | Casos reais | Blog
  Col 3 "Contato": (11) 9984-3310 | contato@revelaodonto.com.br | Av. Faria Lima, 3477 — SP

SOCIAL ICONS (Instagram, Youtube — Lucide icons, text-[#888888] hover:text-[#C9A96E]):

COPYRIGHT BAR (border-t border-[#1F1F1F] mt-12 pt-8 flex justify-between text-xs text-[#555]):
  Left: "© 2026 Revela Odontologia · CRO-SP 18.432 · Todos os direitos reservados"
  Right: "Política de Privacidade · LGPD"

═══════════════════════════════════════════════
SECTION 4 — FLOATING ELEMENTS (GLOBAL)
═══════════════════════════════════════════════

WHATSAPP FLOATING BUTTON (fixed bottom-6 right-6, z-50):
  bg-[#25D366] text-white rounded-full w-14 h-14 flex items-center justify-center
  Shadow: shadow-lg shadow-[#25D366]/30
  Icon: MessageCircle (Lucide), size 24
  href: "https://wa.me/551199843310"
  Tooltip on hover: "Fale conosco" (bg-black text-white text-xs px-3 py-1 rounded, appears left of button)
  Entrance animation: slide-in from bottom-right on page load (delay 2s)

STICKY NAVBAR (fixed top-0, full-width, z-40):
  Initial: bg-transparent
  On scroll > 50px: backdrop-blur-md bg-[#0A0A0A]/90 border-b border-[#1F1F1F]
  Content: Logo wordmark left | Nav links center (hidden mobile) | CTA button right
  CTA: "Agendar Avaliação" bg-[#C9A96E] text-black px-5 py-2.5 text-sm font-semibold
  Mobile: Logo + hamburger menu (simple dropdown, no animations needed)

═══════════════════════════════════════════════
SECTION 5 — ANIMATION RULES (MANDATORY)
═══════════════════════════════════════════════

USE Framer Motion for ALL scroll animations:
  - Import: `import { motion } from 'framer-motion'` + `import { useInView } from 'framer-motion'`
  - Standard fade-up variant (apply to ALL section content):
    ```
    const fadeUp = {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
    }
    const stagger = {
      visible: { transition: { staggerChildren: 0.12 } }
    }
    ```
  - Each section wraps content in: `<motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>`
  - Cards/items use: `<motion.div variants={fadeUp}>`
  - Hero: animate on MOUNT (not scroll) — use `animate` instead of `whileInView`

HOVER STATES (Tailwind transition classes):
  - All cards: transition-all duration-500
  - All buttons: transition-all duration-300
  - All images: group-hover:scale-105 transition-transform duration-700

═══════════════════════════════════════════════
SECTION 6 — STRICT CONSTRAINTS
═══════════════════════════════════════════════

DO:
  ✓ Use ALL copy exactly as written — every word, every punctuation mark
  ✓ Use placeholder images: /placeholder-hero-smile.jpg, /placeholder-dra-camila.jpg, /placeholder-caso-1.jpg through /placeholder-caso-6.jpg
  ✓ Make horizontal swipe carousels for mobile on S3 and S6
  ✓ Implement the sticky navbar with scroll-based style change
  ✓ Include the WhatsApp floating button
  ✓ Use sharp corners (rounded-none) on cards and primary button
  ✓ Include ALL 9 sections — no skipping

DO NOT:
  ✗ Use Unsplash, Lorem Picsum, or any external image URLs
  ✗ Add sections or content not specified above
  ✗ Use shadcn, Radix, or any component library — build from scratch
  ✗ Use border-radius on cards (sharp corporate aesthetic)
  ✗ Stack services/cases vertically on mobile — use horizontal swipe
  ✗ Use any color outside the defined palette
  ✗ Add fake statistics not in the copy
  ✗ Translate copy to English — keep ALL text in Portuguese (Brazil)
  ✗ Use CSS animations — use Framer Motion exclusively for scroll animations

═══════════════════════════════════════════════
SECTION 7 — DELIVERABLE
═══════════════════════════════════════════════

Output a single Next.js App Router page at `app/page.tsx` with:
  - All 9 section components inline or imported from `components/` folder
  - Sticky navbar component
  - WhatsApp floating button component
  - Framer Motion animations on all sections
  - Fully responsive (mobile-first breakpoints: default=mobile, md=tablet, lg=desktop)
  - TypeScript — no `any` types
  - All copy in Brazilian Portuguese exactly as specified
  - Comments marking each section: // [S1] HERO, // [S2] DIFERENCIAIS, etc.

START OUTPUT NOW. Begin with `app/page.tsx` and include ALL sections.
```

---

## Notas de Implementação

**Por que este prompt funciona:**
- **Onlyness Statement** ancora a IA no diferencial único (DSD) — evita output genérico
- **Paleta como tokens** garante consistência — sem interpretação livre de "premium"
- **Copy verbatim** — todos os textos já estão no prompt, sem alucinação de conteúdo
- **Anti-stacking explícito** — mobile carousels exigidos em S3 e S6
- **Placeholder paths consistentes** — fácil trocar depois pelas imagens reais
- **Glassmorphism no form** — eleva percepção de valor no CTA mais importante

**Após gerar:**
1. Substituir `/placeholder-*.jpg` por fotos reais da clínica
2. Conectar form ao backend (email/CRM) ou WhatsApp API
3. Testar `npx next build` — resolver erros de TypeScript
4. Rodar Lighthouse → meta: Performance > 90, Accessibility > 95

— Uma, desenhando com empatia 💝
