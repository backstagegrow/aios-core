# Clínica Vértice — Master Prompt para v0.dev / Lovable
**Gerado por:** Uma (UX-Design Expert) | **Data:** 2026-03-31
**Target:** v0.dev, Lovable.ai, Bolt.new
**Nicho:** Medicina Preventiva & Longevidade — Cliente Fictício Premium

---

## Briefing do Cliente (uso interno)

| Campo | Valor |
|-------|-------|
| **Nome** | Clínica Vértice |
| **Tagline** | "Sua saúde, antecipada por dados." |
| **Onlyness** | A única clínica em São Paulo que mapeia **147 biomarcadores + análise genética completa** antes de prescrever qualquer tratamento — entregando um Protocolo de Longevidade 100% individualizado, revisado a cada 90 dias. |
| **Especialista** | Dr. Rafael Mendes — CRM-SP 145.832 — Fellow em Medicina Antienvelhecimento (A4M/EUA) |
| **Endereço** | Av. Paulista, 2064 — Bela Vista, São Paulo, SP |
| **Telefone** | (11) 97732-4410 |
| **Público** | Executivos 35–60 anos, alta renda, proativos com saúde |

---

## Estratégia de Copy

**Problema latente:** Executivos de alto nível tratam doenças depois que aparecem — não antecipam. Planos convencionais são reativos.

**Solução única:** Medicina preditiva baseada em dados reais do organismo de cada paciente — não de "médias populacionais".

**Emoção principal:** Controle. Segurança. Clareza sobre o próprio corpo.

**Gatilhos de conversão:**
- Especificidade numérica (147 biomarcadores, 90 dias, 23 anos de experiência)
- Autoridade credencial (Fellow A4M/EUA — título raro no Brasil)
- Prova social de resultado, não de procedimento
- Urgência soft: "cada ano sem dados é um ano de decisões cegas"

---

## Como usar

1. Copie o bloco abaixo integralmente
2. Cole diretamente no v0.dev (chat input) ou Lovable
3. Se truncado, envie: `"Continue com as seções [S4] em diante, mesmo stack e design"`
4. Após gerar: substituir placeholders, conectar form ao CRM/WhatsApp, rodar Lighthouse

---

```
You are an elite frontend engineer and visual designer building a PRODUCTION-READY landing page for a premium preventive medicine & longevity clinic in São Paulo, Brazil. This is NOT a generic health template — every pixel must justify the premium scientific positioning.

═══════════════════════════════════════════════
SECTION 0 — PROJECT CONTEXT & ONLYNESS STATEMENT
═══════════════════════════════════════════════

CLIENT: Clínica Vértice — Medicina Preventiva & Longevidade
TAGLINE: "Sua saúde, antecipada por dados."
ONLYNESS: The only clinic in São Paulo that maps 147 biomarkers + complete genetic analysis BEFORE prescribing any treatment — delivering a 100% individualized Longevity Protocol, reviewed every 90 days.
LOCATION: Av. Paulista, 2064 — Bela Vista, São Paulo, SP
LEAD: Dr. Rafael Mendes — CRM-SP 145.832 — Fellow in Anti-Aging & Regenerative Medicine (A4M, USA)
PHONE: (11) 97732-4410

═══════════════════════════════════════════════
SECTION 1 — TECH STACK (STRICT — DO NOT DEVIATE)
═══════════════════════════════════════════════

- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS v3 (utility-first, NO CSS-in-JS)
- Animations: Framer Motion (scroll-triggered only — use `useInView` + `motion.div`)
- Icons: Lucide React
- Fonts: Google Fonts — DM Serif Display (headings) + DM Sans (body)
- Images: All <img> tags MUST use src="/placeholder-local.jpg" — NO Unsplash, NO random URLs
- Forms: Controlled React state — NO external form libraries
- NO shadcn/ui. NO MUI. NO Radix. Build components from scratch with Tailwind.

═══════════════════════════════════════════════
SECTION 2 — DESIGN SYSTEM (ZERO DEVIATION ALLOWED)
═══════════════════════════════════════════════

COLOR TOKENS (use as Tailwind arbitrary values or inline styles):
  --color-bg:          #080C12   /* Deep navy-black base */
  --color-surface:     #0E1420   /* Cards, elevated surfaces */
  --color-border:      #1A2235   /* Subtle separators */
  --color-copper:      #B87333   /* Primary accent — CTAs, highlights */
  --color-copper-light:#D4956A   /* Hover states, text accents */
  --color-white:       #F0F2F5   /* Body text, headings */
  --color-muted:       #7A8499   /* Secondary text, labels */
  --color-teal-sci:    #2A7A8A   /* Scientific trust elements */

TYPOGRAPHY RULES:
  - H1: DM Serif Display, 72–96px, font-weight 400, line-height 1.05, color #F0F2F5
  - H2: DM Serif Display, 48–64px, font-weight 400, color #F0F2F5
  - H3: DM Sans, 20–24px, font-weight 600, letter-spacing -0.02em, color #F0F2F5
  - Body: DM Sans, 16–18px, font-weight 400, line-height 1.7, color #7A8499
  - Label/Caption: DM Sans, 11–13px, font-weight 600, letter-spacing 0.14em, UPPERCASE, color #B87333
  - Data callouts (numbers/stats): DM Serif Display, 56–72px, color #B87333
  - NEVER mix more than 2 typeface weights per section

SPACING PHILOSOPHY:
  - Minimum section padding: py-24 (mobile) → py-32 (desktop)
  - Scientific negative space — emptiness signals precision
  - Max content width: max-w-6xl mx-auto px-6

AESTHETIC MODE: DARK SCIENTIFIC PREMIUM
  - Deep navy-black backgrounds with near-black surfaces for cards
  - Copper (#B87333) used ONLY for: CTAs, accents, hover states, section labels, data callouts
  - Glassmorphism for forms: backdrop-blur-md bg-white/5 border border-white/8
  - Subtle teal glow on data elements: box-shadow: 0 0 30px rgba(42,122,138,0.12)
  - Sub-pixel borders everywhere: border border-[#1A2235]
  - Cards: box-shadow: 0 0 40px rgba(184,115,51,0.06)

═══════════════════════════════════════════════
SECTION 3 — PAGE ARCHITECTURE (9 SECTIONS — ALL REQUIRED)
═══════════════════════════════════════════════

Build ALL sections in a single page.tsx file. Each section is a separate React component imported into the page. Use scroll-triggered Framer Motion animations on every section except the Hero.

──────────────────────────────────────────────
[S1] HERO — Full Viewport, Scientific Authority
──────────────────────────────────────────────
VISUAL ARCHETYPE: 100vh, data-driven command, Onlyness Statement as primary thesis.

LAYOUT:
- Full screen height (min-h-screen)
- Background: #080C12 with subtle radial gradient (teal-sci at 3% opacity, top-right origin)
- Left column (58%): headline + sub + CTAs + data strip
- Right column (42%): abstract data visualization card (build with pure divs/CSS — NO chart libs)
- Mobile: stack vertically, viz card goes BELOW text

DATA VISUALIZATION CARD (right column — pure divs only, no chart library):
  bg-[#0E1420] border border-[#1A2235] p-8
  Header: "PERFIL BIOMÉTRICO" — copper label style (uppercase, tracking-widest, text-xs)
  Grid: 4×3 grid of small circles (12 total), each w-2.5 h-2.5 rounded-full
    — Mix of colors: 4 copper (#B87333), 4 teal (#2A7A8A opacity-60%), 4 white/10%
    — gap-3 between dots
  Label below grid: "147 biomarcadores analisados" — muted, text-sm, mt-4
  Progress bar: bg-[#1A2235] h-1 w-full mt-6 rounded-none
    — Inner fill: bg-[#B87333] w-[78%] h-full
    — Label above: "Protocolo: 78% otimizado" — muted text-xs

COPY TO RENDER (exact):
  LABEL (uppercase copper, letter-spacing wide): "MEDICINA PREVENTIVA • SÃO PAULO"

  H1 (3 lines, each line gets stagger animation on mount):
    Line 1: "Seu corpo sabe"
    Line 2: "o que vai acontecer."
    Line 3: "Nós traduzimos." ← the word "traduzimos." in copper (#B87333)

  SUBHEADLINE (body muted, max-w-lg):
    "147 biomarcadores. Análise genética completa. Um Protocolo de Longevidade construído exclusivamente para o seu organismo — não para uma média populacional."

  CTAs (horizontal flex, gap-4, flex-wrap):
    PRIMARY: "Quero meu Protocolo de Longevidade"
      bg-[#B87333] text-white px-8 py-4 font-semibold hover:bg-[#D4956A] transition-all duration-300 — sharp corners (rounded-none)
    SECONDARY: "Ver como funciona →"
      border border-[#B87333] text-[#B87333] px-8 py-4 hover:bg-[#B87333]/10 transition-all duration-300

  DATA STRIP (flex gap-8, mt-8, pt-8, border-t border-[#1A2235]):
    Each item: large number in DM Serif Display copper + small label below in muted
    "147" / "Biomarcadores"
    "23" / "Anos de experiência"
    "90" / "Dias por revisão"
    "100%" / "Individualizado"

──────────────────────────────────────────────
[S2] PROBLEMA — The Gap Section
──────────────────────────────────────────────
VISUAL ARCHETYPE: Two-column contrast — "medicina convencional" vs "Clínica Vértice". Tension, not a bento grid.

LAYOUT:
- Label: "O PROBLEMA" (copper, uppercase)
- H2: "A medicina convencional trata o passado. Nós antecipamos o futuro."
- Two columns side by side (desktop) | stacked (mobile)
- LEFT: bg-[#120C0C] border border-[#2A1515] — warm dark, failure framing
- RIGHT: bg-[#0A100A] border border-[#B87333]/20 — success framing

LEFT COLUMN:
  Header: "❌ Medicina Convencional" text-[#7A8499] text-sm font-semibold mb-6
  List (text-[#7A8499], each prefixed "—"):
    "— Exames básicos cobrindo 20–30 marcadores"
    "— Valores de referência populacionais, não individuais"
    "— Intervenção quando a doença já está instalada"
    "— Protocolo genérico replicado para todos os pacientes"

RIGHT COLUMN:
  Header: "✦ Clínica Vértice" text-[#B87333] text-sm font-semibold mb-6
  List (text-[#F0F2F5], each prefixed "✓"):
    "✓ 147 biomarcadores cobrindo todos os sistemas do organismo"
    "✓ Valores calibrados para o seu genoma específico"
    "✓ Identificação de riscos 5–15 anos antes dos sintomas"
    "✓ Protocolo único, revisado a cada 90 dias"

BOTTOM CALLOUT (centered, mt-16, max-w-2xl mx-auto):
  text-[#F0F2F5]/60 text-lg italic:
  "Cada ano sem dados precisos é um ano de decisões tomadas às cegas sobre o bem mais valioso que você possui."

──────────────────────────────────────────────
[S3] METODOLOGIA — 4-Step Scientific Process
──────────────────────────────────────────────
VISUAL ARCHETYPE: Horizontal numbered sequence with connecting line — scientific rigor aesthetic.

LAYOUT:
- Label: "METODOLOGIA" (copper, uppercase)
- H2: "Do mapeamento ao protocolo: 4 etapas."
- 4 columns connected by thin horizontal line (hidden mobile)
- Mobile: vertical stack with left border line in copper/30%

STEP STYLE:
  Step number: DM Serif Display, text-8xl, color #B87333/15 (ghosted background number)
  Icon: Lucide, text-[#B87333], size 20, mb-3
  Title: DM Sans semibold, text-lg, color #F0F2F5
  Body: DM Sans, text-sm, color #7A8499, line-height 1.7

STEPS (render all 4):
  Step 01 — Icon: Dna — "Mapeamento Genético"
  Body: "Coleta de amostra de saliva. Análise de +500.000 variantes genéticas (SNPs) relevantes para metabolismo, inflamação, risco cardiovascular e longevidade."

  Step 02 — Icon: FlaskConical — "Painel de 147 Biomarcadores"
  Body: "Coleta de sangue em jejum. Análise hormonal, metabólica, inflamatória, micronutricional e cardiovascular completa — não os 20 exames do check-up convencional."

  Step 03 — Icon: BrainCircuit — "Análise Integrativa"
  Body: "Dr. Rafael Mendes cruza dados genéticos, biomarcadores, histórico clínico e hábitos de vida. Cada resultado é interpretado em conjunto — nunca isoladamente."

  Step 04 — Icon: FileText — "Seu Protocolo Personalizado"
  Body: "Documento de 40–60 páginas: intervenções nutricionais, suplementação de precisão, exercício prescrito por zona metabólica, e revisão agendada em 90 dias."

CTA (centered, mt-16):
  "Iniciar meu mapeamento →"
  border border-[#B87333] text-[#B87333] px-10 py-4 hover:bg-[#B87333]/10 transition-all duration-300

──────────────────────────────────────────────
[S4] PROGRAMAS — Specialty Services Grid
──────────────────────────────────────────────
VISUAL ARCHETYPE: 3-col grid desktop, horizontal swipe carousel mobile (MANDATORY).

LAYOUT:
- Label: "PROGRAMAS" (copper, uppercase)
- H2: "Cada protocolo, para cada sistema do corpo."
- Desktop: CSS grid 3 columns, gap-px (touching cards with 1px separator)
- Mobile: overflow-x-auto, flex, snap-x snap-mandatory, each card snap-start min-w-[88vw]

CARD STYLE:
  bg-[#0E1420] border border-[#1A2235] p-8
  Top: program number ("01"–"05") DM Serif Display, text-6xl, color #B87333/12 (ghosted)
  Mid: program name H3 + body text
  Bottom: 2–3 chip tags
  On hover: border-[#B87333]/30, box-shadow: 0 0 30px rgba(184,115,51,0.07), transition-all duration-500

CHIP STYLE: border border-[#1A2235] text-[#7A8499] text-xs px-3 py-1 inline-block mr-2 mt-4

PROGRAMS (render all 5):
  01 — "Longevidade Executiva"
  Body: "Protocolo completo para profissionais de alta performance: genoma + 147 biomarcadores + plano de otimização de energia, cognição e resistência ao estresse."
  Chips: "Genoma" | "147 marcadores" | "Alta performance"

  02 — "Saúde Cardiovascular Avançada"
  Body: "Mapeamento de risco coronariano com 10 anos de antecedência. Análise de lipídios avançados (LDL-P, Lp(a), ApoB), inflamação vascular e função endotelial."
  Chips: "Prevenção primária" | "Cardio avançado"

  03 — "Equilíbrio Hormonal"
  Body: "Avaliação completa do eixo hormonal (tireoidiano, adrenal, reprodutivo). Protocolos de modulação naturais ou farmacológicos com base em dados do seu genoma."
  Chips: "Hormônios" | "Metabolismo" | "Energia"

  04 — "Metabolismo & Composição Corporal"
  Body: "Além do peso na balança: análise de resistência insulínica, metabolismo basal por calorimetria, composição por DEXA e protocolo nutricional de precisão."
  Chips: "DEXA" | "Insulina" | "Nutrição"

  05 — "Medicina do Sono & Cognição"
  Body: "Avaliação de arquitetura do sono, inflamação neurológica e biomarcadores cognitivos. Protocolo para otimização de memória, foco e proteção cerebral longo prazo."
  Chips: "Cognição" | "Sono" | "Neurologia"

──────────────────────────────────────────────
[S5] SOBRE O DR. RAFAEL — Authority Split Layout
──────────────────────────────────────────────
VISUAL ARCHETYPE: Asymmetric split — image left, credentials grid right.

LAYOUT:
- Left (42%): Image placeholder, full height, no border-radius, overflow hidden
  <img src="/placeholder-dr-rafael.jpg" alt="Dr. Rafael Mendes" className="w-full h-full object-cover" style={{filter: 'grayscale(15%) contrast(1.05)'}} />
- Right (58%): Text content, py-16 pl-16
- Mobile: image first (aspect-ratio 4/3), text below

COPY:
  Label: "SOBRE O ESPECIALISTA" (copper, uppercase)
  H2: "Formação que vai além do consultório."

  Paragraph 1:
  "Dr. Rafael Mendes dedicou 23 anos ao estudo de uma única pergunta: por que algumas pessoas envelhecem bem e outras não? Formado pela FMUSP, com residência em Clínica Médica e especializações em Endocrinologia e Medicina Antienvelhecimento, tornou-se um dos poucos médicos brasileiros Fellow certificado pela A4M — a principal organização de medicina antienvelhecimento do mundo, sediada nos EUA."

  Paragraph 2 (mt-4):
  "Sua abordagem rejeita protocolos genéricos. Para ele, tratar um ser humano com base em médias populacionais é o mesmo que calibrar um instrumento de precisão com uma régua de plástico."

CREDENTIALS GRID (mt-10, grid 2 cols, gap-4):
  Each credential card: bg-[#080C12] border border-[#1A2235] p-4
    Number/Badge in copper (DM Serif Display, text-2xl) + label below in muted (DM Sans text-xs uppercase tracking-wider)

  "CRM-SP" → "145.832"
  "Fellow" → "A4M — EUA"
  "FMUSP" → "Graduação + Residência"
  "23 anos" → "Medicina preventiva"
  "+2.800" → "Protocolos entregues"
  "90 dias" → "Ciclo de revisão"

──────────────────────────────────────────────
[S6] RESULTADOS — Data-Driven Outcomes Grid
──────────────────────────────────────────────
VISUAL ARCHETYPE: 3-column outcome cards — data metrics paired with patient narratives.

LAYOUT:
- Label: "RESULTADOS" (copper, uppercase)
- H2: "O que os dados revelam."
- Subtext: "Resultados reais de pacientes da Clínica Vértice. Métricas, não opiniões."
- Desktop: 3 cols | Mobile: horizontal swipe carousel (MANDATORY)

OUTCOME CARD STYLE:
  bg-[#0E1420] border border-[#1A2235] p-8
  Top: primary metric in DM Serif Display, text-5xl, color #B87333
  Mid: metric label (muted, text-xs uppercase tracking-wider, mt-2) + italic patient quote (text-sm muted, mt-4, leading-relaxed)
  Bottom: patient name (text-xs muted, mt-6 pt-6 border-t border-[#1A2235])

OUTCOMES (render all 6):
  Card 1:
    Metric: "−43%"
    Label: "REDUÇÃO DE MARCADORES INFLAMATÓRIOS"
    Quote: "Meu cardiologista perguntou o que eu tinha feito de diferente. Respondi: finalmente entendi o que estava acontecendo dentro de mim."
    Name: "M.A., 52 anos — Protocolo Cardiovascular"

  Card 2:
    Metric: "+38%"
    Label: "AUMENTO DE TESTOSTERONA LIVRE (SEM REPOSIÇÃO)"
    Quote: "Energia, foco e disposição que não tinha há 10 anos. Tudo com intervenção nutricional e suplementação de precisão."
    Name: "R.S., 47 anos — Equilíbrio Hormonal"

  Card 3:
    Metric: "−18kg"
    Label: "REDUÇÃO DE MASSA GORDA (DEXA 90 DIAS)"
    Quote: "Não perdi peso. Perdi gordura e mantive músculo. A diferença é enorme — e agora eu tenho dados para provar isso."
    Name: "C.F., 44 anos — Metabolismo & Composição"

  Card 4:
    Metric: "−62%"
    Label: "QUEDA DE INSULINA EM JEJUM"
    Quote: "Estava no caminho para o diabetes. Com o protocolo, revertemos completamente. Meu médico anterior nunca havia medido isso."
    Name: "L.B., 56 anos — Longevidade Executiva"

  Card 5:
    Metric: "8/10"
    Label: "AUMENTO EM QUALIDADE DE SONO (WEARABLE)"
    Quote: "Acordava cansado toda manhã. Descobrimos uma disfunção hormonal e uma deficiência de magnésio que nenhum exame convencional mostrava."
    Name: "P.O., 39 anos — Sono & Cognição"

  Card 6:
    Metric: "−9"
    Label: "ANOS NA IDADE BIOLÓGICA (CLOCK EPIGENÉTICO)"
    Quote: "Com 54 anos, meu organismo funciona como um de 45. Isso não é marketing — está no laudo do teste epigenético."
    Name: "A.M., 54 anos — Longevidade Executiva"

──────────────────────────────────────────────
[S7] DEPOIMENTOS — Minimalist Social Proof
──────────────────────────────────────────────
VISUAL ARCHETYPE: 3-column testimonial cards. Clean, zero clutter, whitespace is king.

LAYOUT:
- Label: "DEPOIMENTOS" (copper, uppercase)
- H2: "Quem mapeou, nunca volta atrás."
- 3 cards side by side (desktop) | 1 column stacked (mobile — OK here, cards are compact)

CARD STYLE:
  bg-[#0E1420] border border-[#1A2235] p-8
  Opening quote mark: text-5xl text-[#B87333]/30, DM Serif Display, leading-none, mb-4 (render as " character)
  Body: text-[#F0F2F5]/75, text-base, leading-relaxed, italic
  Attribution: mt-6 pt-6 border-t border-[#1A2235]
    Name: text-[#F0F2F5] font-semibold text-sm
    Program: text-[#B87333] text-xs uppercase tracking-wider, mt-1
    Stars: "★★★★★" text-[#B87333] text-sm mt-2

TESTIMONIALS (render all 3, exact copy):
  1.
    Body: "Passei 20 anos fazendo check-up todo ano e me achando saudável. Na Vértice, descobri riscos que existiam há tempo. Foi assustador e libertador ao mesmo tempo."
    Name: "Fernando A., 51 anos — CEO"
    Program: "Longevidade Executiva"

  2.
    Body: "O Dr. Rafael não me deu uma dieta. Me entregou um mapa do meu organismo com um plano de ação. Seis meses depois, sou literalmente outro nível de saúde."
    Name: "Renata K., 43 anos — Médica"
    Program: "Saúde Hormonal & Metabólica"

  3.
    Body: "Invisto em empresas com base em dados. Fazia sentido investir na minha saúde da mesma forma. A Clínica Vértice é exatamente isso: inteligência aplicada ao corpo humano."
    Name: "Marcelo D., 48 anos — Investidor"
    Program: "Longevidade Executiva"

──────────────────────────────────────────────
[S8] AGENDAMENTO — Glassmorphism CTA Section
──────────────────────────────────────────────
VISUAL ARCHETYPE: Isolated dark warm section, glassmorphism form — maximum conversion focus.

LAYOUT:
- Full-width section, bg-[#060A0D]
- Centered content, max-w-2xl
- Form in glassmorphism card: backdrop-blur-md bg-white/4 border border-white/8 p-10

COPY:
  Label: "AVALIAÇÃO INICIAL GRATUITA" (copper, uppercase)
  H2: "Pronto para saber o que está acontecendo dentro de você?"
  Subtext: "Comece com uma consulta de avaliação gratuita. Dr. Rafael analisa seu histórico e define se você é candidato ao Protocolo de Longevidade."

FORM (controlled React state — NO external libraries):
  Field 1: text input — placeholder "Nome completo *"
  Field 2: tel input — placeholder "WhatsApp *"
  Field 3: email input — placeholder "E-mail *"
  Field 4: select — "Programa de interesse..." | "Longevidade Executiva" | "Saúde Cardiovascular" | "Equilíbrio Hormonal" | "Metabolismo & Composição" | "Sono & Cognição" | "Quero avaliar / Não sei ainda"
  Field 5: select — "Melhor horário..." | "Manhã (8h–12h)" | "Tarde (12h–17h)" | "Noite (17h–20h)"

  SUBMIT BUTTON (full-width, rounded-none):
    Text: "Solicitar minha Avaliação Gratuita"
    bg-[#B87333] text-white py-5 font-semibold text-base w-full hover:bg-[#D4956A] transition-all duration-300

INPUT STYLE (ALL inputs and selects):
  bg-transparent border border-white/15 text-[#F0F2F5] placeholder-[#4A5568] px-5 py-4 w-full rounded-none
  focus:outline-none focus:border-[#B87333] focus:ring-1 focus:ring-[#B87333]/30 transition-all duration-300

TRUST BADGES (flex gap-6, mt-6, text-xs text-[#7A8499], justify-center):
  "🔒 Sigilo médico garantido"
  "⚡ Retorno em até 4h"
  "✦ Sem compromisso"

CONTACT INFO (below form, mt-10, text-center, text-sm text-[#7A8499]):
  "📍 Av. Paulista, 2064 — cj. 112 · Bela Vista, São Paulo — SP"
  "📞 (11) 97732-4410"
  "🕐 Seg–Sex: 7h às 19h · Sáb: 8h às 13h"

──────────────────────────────────────────────
[S9] FOOTER — Minimal, Scientific Authority
──────────────────────────────────────────────
VISUAL ARCHETYPE: Ultra-minimal, structured columns, copper accents.

LAYOUT:
  bg-[#080C12] border-t border-[#1A2235] py-16 px-6
  Top row: Logo wordmark left | Nav columns center-right
  Bottom row: Copyright left | Legal links right
  Mobile: All stacked, centered

LOGO WORDMARK:
  "VÉRTICE" — DM Serif Display, text-2xl, text-[#F0F2F5]
  "MEDICINA PREVENTIVA" — DM Sans, text-xs, letter-spacing-[0.3em], text-[#B87333], uppercase, mt-1

NAV COLUMNS (3 columns, gap-8, text-sm):
  Col 1 "Programas": Longevidade Executiva | Cardiovascular | Hormonal | Metabolismo | Sono & Cognição
  Col 2 "Institucional": Sobre o Dr. Rafael | Metodologia | Resultados | Blog científico
  Col 3 "Contato": (11) 97732-4410 | contato@clinicavertice.com.br | Av. Paulista, 2064 — SP

Column header style: text-[#B87333] text-xs uppercase tracking-wider mb-4
Column link style: text-[#7A8499] hover:text-[#F0F2F5] transition-colors duration-200 block mb-2

SOCIAL ICONS (Instagram, LinkedIn, YouTube — Lucide, text-[#7A8499] hover:text-[#B87333], transition-colors):

COPYRIGHT BAR (border-t border-[#1A2235] mt-12 pt-8 flex justify-between text-xs text-[#4A5568]):
  Left: "© 2026 Clínica Vértice Medicina Preventiva · CRM-SP 145.832 · Todos os direitos reservados"
  Right: "Política de Privacidade · LGPD · CFM"

═══════════════════════════════════════════════
SECTION 4 — FLOATING ELEMENTS (GLOBAL)
═══════════════════════════════════════════════

WHATSAPP FLOATING BUTTON (fixed bottom-6 right-6, z-50):
  bg-[#25D366] text-white rounded-full w-14 h-14 flex items-center justify-center
  shadow-lg shadow-[#25D366]/30
  Icon: MessageCircle (Lucide), size 24
  href: "https://wa.me/5511977324410"
  Tooltip on hover: "Fale com nossa equipe" (bg-[#080C12] text-white text-xs px-3 py-1 rounded-sm, appears left of button)
  Entrance animation: slide-in from bottom-right on page load with 2s delay

STICKY NAVBAR (fixed top-0, full-width, z-40):
  Initial state: bg-transparent
  On scroll > 50px: backdrop-blur-md bg-[#080C12]/92 border-b border-[#1A2235]
  Transition: transition-all duration-300
  Content: Logo wordmark left | Nav links center (hidden mobile) | CTA right
  CTA: "Avaliação Gratuita" bg-[#B87333] text-white px-5 py-2.5 text-sm font-semibold rounded-none
  Nav links desktop: "Programas" | "Metodologia" | "Resultados" | "Sobre Dr. Rafael"
    text-[#7A8499] hover:text-[#F0F2F5] text-sm transition-colors
  Mobile: Logo left + hamburger icon right (simple toggle dropdown, no animation needed)

═══════════════════════════════════════════════
SECTION 5 — ANIMATION RULES (MANDATORY)
═══════════════════════════════════════════════

USE Framer Motion for ALL scroll animations:

  Standard variants (define once, reuse everywhere):
  ```
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  }
  const stagger = {
    visible: { transition: { staggerChildren: 0.12 } }
  }
  ```

  Section wrapper: <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
  Each card/item: <motion.div variants={fadeUp}>
  Hero: uses `animate` prop on mount (NOT whileInView)
  Data strip numbers: counter animation from 0 to value using motion + useInView

HOVER STATES:
  Cards: transition-all duration-500
  Buttons: transition-all duration-300
  Data viz dots: hover:scale-110 transition-transform duration-200

═══════════════════════════════════════════════
SECTION 6 — STRICT CONSTRAINTS
═══════════════════════════════════════════════

DO:
  ✓ Use ALL copy exactly as written — every word, every punctuation mark
  ✓ Placeholder images: /placeholder-dr-rafael.jpg, /placeholder-clinica-interior.jpg
  ✓ Horizontal swipe carousels on S4 and S6 mobile (MANDATORY)
  ✓ Sticky navbar with scroll-based style transition
  ✓ WhatsApp floating button with tooltip
  ✓ Data visualization card in S1 built with pure divs only
  ✓ Sharp corners (rounded-none) on ALL cards and buttons
  ✓ Include ALL 9 sections — no skipping
  ✓ DM Serif Display for headings and all large numbers

DO NOT:
  ✗ Use Unsplash, Lorem Picsum, or any external image URL
  ✗ Add sections or copy not specified above
  ✗ Use shadcn, Radix, or any component library — build from scratch
  ✗ Apply border-radius to cards
  ✗ Stack S4 or S6 cards vertically on mobile — horizontal swipe required
  ✗ Use colors outside the defined palette
  ✗ Invent statistics, credentials, or copy not listed above
  ✗ Translate any text to English — ALL copy stays in Brazilian Portuguese
  ✗ Use CSS animations — Framer Motion only for scroll animations
  ✗ Use chart.js, recharts, or any external data visualization library

═══════════════════════════════════════════════
SECTION 7 — DELIVERABLE
═══════════════════════════════════════════════

Output a single Next.js App Router page at `app/page.tsx` with:
  - All 9 section components inline or imported from `components/` folder
  - Sticky navbar component
  - WhatsApp floating button component
  - Framer Motion animations throughout
  - Data visualization card in S1 built with pure divs (no external libs)
  - Fully responsive: mobile-first (default=mobile, md=tablet, lg=desktop)
  - TypeScript — no `any` types
  - All copy in Brazilian Portuguese exactly as specified
  - Section comments: // [S1] HERO, // [S2] PROBLEMA, // [S3] METODOLOGIA, etc.

START OUTPUT NOW. Begin with `app/page.tsx` and include ALL sections.
```

---

## Notas de Implementação

**Por que este prompt funciona:**
- **Onlyness Statement numérico** (147 biomarcadores) ancora com especificidade — IA não inventa variações
- **S2 "O Problema"** cria contraste emocional antes de vender — CRO clássico de conversão
- **Resultados como métricas** (−43%, +38%) são mais críveis que depoimentos genéricos
- **Fellow A4M/EUA** é credencial verificável e rara no Brasil — máxima autoridade percebida
- **Data viz com divs puros** — evita dependência de chart.js que frequentemente quebra no v0
- **Mobile carousels obrigatórios** em S4 e S6 — padrão premium preservado

**Após gerar no v0.dev:**
1. Substituir `/placeholder-*.jpg` por fotos reais (médico, clínica, equipe)
2. Conectar form a CRM ou disparador de WhatsApp API
3. Rodar `npx next build` e resolver erros de TypeScript
4. Lighthouse target: Performance > 90 · Accessibility > 95 · SEO > 95

**SEO keywords orgânicas no copy:**
- "medicina preventiva São Paulo"
- "biomarcadores longevidade"
- "protocolo longevidade personalizado"
- "check-up executivo São Paulo"
- "médico longevidade SP"

— Uma, desenhando com empatia 💝
