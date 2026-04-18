# AI Frontend Build Prompt — Mentoria "O Caminho do Dono"
## Alpha Business Academy | Pronto para Framer / v0 / Lovable
## Gerado por Uma (UX Design Expert) · 2026-04-08

---

## COMO USAR

Cole o bloco abaixo diretamente no Framer AI, v0.dev, ou Lovable.
Para Framer: use como prompt de geração de página completa.
Para v0/Lovable: use seção por seção se necessário.

---

```
=== MASTER BUILD PROMPT — ALPHA BUSINESS ACADEMY ===
=== "O CAMINHO DO DONO" — MENTORIA SALES PAGE ===

## [1] HIGH-LEVEL GOAL

Build a complete, high-converting, cinematic dark-mode sales landing page for "O Caminho do Dono" — a 12-month premium business mentorship program by Alpha Business Academy targeting food service business owners in Brazil.

The page must feel ULTRA-PREMIUM, ELITE, and AUTHORITATIVE. This is a R$35k high-ticket offer. Every visual decision must communicate that value. Think: cinematic depth, heavy typography, gold accents cutting through darkness, controlled tension. Reference aesthetic: Wolf of Wall Street meets a premium Brazilian consultancy.

Tech stack: HTML5 + CSS (Tailwind CSS v3) + Vanilla JS for interactions.
Font: Inter (Google Fonts) — ONLY Inter. No other fonts.
Language: Brazilian Portuguese throughout.

DO NOT use placeholder images from Unsplash or any stock photo service.
DO NOT generate generic flat design.
DO NOT add navigation menu items — navbar has ONLY logo + CTA button.

---

## [2] BRAND CONSTRAINTS (NON-NEGOTIABLE)

- Background primary: #0A0A0A
- Background secondary: #0F0F0F
- Background card: #141414 / #1A1A1A
- Accent / Gold: #C9A24A
- Text primary: #FFFFFF
- Text muted: rgba(255,255,255,0.6)
- Text subtle: rgba(255,255,255,0.4)
- Border default: #2A2A2A
- Border highlight: #C9A24A
- Font: Inter (weights: 400, 600, 700, 800)
- Border radius: 4px for buttons, 8px for cards
- NO rounded-full buttons. NO gradients on text. NO neon glows.
- Gold accent is EARNED — use sparingly for maximum impact.

---

## [3] PAGE ARCHITECTURE — BUILD IN THIS EXACT ORDER

### S00 — NAVBAR
- Position: sticky, top: 0, z-index: 100
- Height: 72px, bg: #0A0A0A, border-bottom: 1px solid #1A1A1A
- Left: Logo placeholder — white rectangle 120x32px with text "Alpha Business Academy" Inter Bold 14px white
- Right: Single CTA button — "QUERO APLICAR" — bg: #C9A24A, text: #0A0A0A, Inter Bold 14px, padding: 12px 28px, border-radius: 4px
- Mobile: logo left + button right, same layout
- NO other navigation links.

---

### S01 — HERO (100vh)
- Full viewport height, position: relative, overflow: hidden
- Background: dark overlay div (bg: rgba(0,0,0,0.65)) over an img placeholder — build a 1920x1080 dark placeholder with subtle noise texture (#0A0A0A base)
- Image placeholder code: <img src="/assets/hero-bg-placeholder.jpg" alt="Hero" class="absolute inset-0 w-full h-full object-cover">
- Content: absolutely centered (top 50%, transform translateY(-50%)), max-width: 760px, text-align: left, padding-left: 10vw

CONTENT INSIDE HERO:
1. Eyebrow tag: "MENTORIA PARA NEGÓCIOS DE ALIMENTAÇÃO"
   - Style: Inter SemiBold 11px, color: #C9A24A, letter-spacing: 0.2em, text-transform: uppercase
   - Add small horizontal line before text: 32px wide, 1px, #C9A24A, inline-flex align-center gap-3

2. H1 (2 lines, intentional break):
   Line 1: "O Caminho"
   Line 2: "do Dono."
   - Style: Inter Bold, font-size: clamp(52px, 7vw, 96px), color: #FFFFFF, line-height: 1.0, margin-top: 20px
   - "do Dono." — the period is intentional. Keep it.

3. Subheadline:
   "Transforme seu negócio de alimentação em uma operação lucrativa, organizada e pronta para escalar — mesmo sem depender de você em tudo."
   - Style: Inter Regular 20px, color: rgba(255,255,255,0.7), max-width: 580px, line-height: 1.6, margin-top: 24px

4. Namedrop credibility line (Wolf Pack pattern — mentor namedrop no hero):
   - Row: 3 circular avatar placeholders 32x32px bg #2A2A2A overlapping (-8px), inline-flex align-center, then text:
   "Com Lucas Silva, José Ricardo e Robert CFO — mentores que escalaram +500 operações no food service."
   - Style: Inter Regular 14px, color: rgba(255,255,255,0.45), margin-top: 20px, max-width: 500px, display flex, align-items center, gap 12px

5. Supporting line:
   "Se você fatura, mas não vê o dinheiro no final do mês — o problema não é venda. É falta de controle, gestão e estrutura."
   - Style: Inter Regular 15px, color: rgba(255,255,255,0.35), margin-top: 12px, max-width: 500px

6. CTA Button:
   "QUERO CONHECER A MENTORIA →"
   - bg: #C9A24A, color: #0A0A0A, Inter Bold 16px, padding: 18px 40px, border-radius: 4px, margin-top: 40px
   - Hover: background darken 10% + box-shadow: 0 0 24px rgba(201,162,74,0.3)
   - href: "https://wa.me/[WHATSAPP_PLACEHOLDER]"

6. Sub-CTA text below button:
   "Processo seletivo · Vagas limitadas"
   - Inter Regular 12px, color: rgba(255,255,255,0.35), margin-top: 12px

7. Scroll indicator: chevron-down SVG icon, color: #C9A24A, 24px, centered at bottom 40px, animate bounce infinite

- Mobile: content padding 24px, H1 clamp(40px,10vw,52px), subheadline 16px

---

### S01.5 — STATS BAR (Social Proof Imediato)
- Inspired by: TradeNIEX — números logo abaixo do hero aumentam credibilidade antes de qualquer leitura
- bg: #0F0F0F, border-top: 1px solid #1A1A1A, border-bottom: 1px solid #1A1A1A, padding: 40px 0
- Container: max-width 1200px, margin auto
- Layout: 4 stat items em linha, justify: space-evenly, align: center
- Dividers: 1px vertical line, #2A2A2A, between each stat
- Mobile: 2x2 grid, no dividers

Each stat item — centered:
- Number: Inter Bold, font-size 40px, color: #C9A24A, line-height 1
- Label: Inter Regular 13px, rgba(255,255,255,0.5), margin-top 8px, text-transform uppercase, letter-spacing 0.1em

4 stats:
1. "+500" / "Lojas escaladas no ecossistema"
2. "12" / "Módulos do método"
3. "12" / "Meses de acompanhamento"
4. "3" / "Mentores de campo"

---

### S02 — PARA QUEM É
- bg: #0F0F0F, padding: 96px 0
- Container: max-width 1200px, margin auto, padding-x 80px (mobile: 20px)

1. Section headline:
   "Esta mentoria foi feita para você que tem:"
   - Inter Bold 40px, color: white, text-align: center, margin-bottom: 48px

2. Business type cards row (5 cards):
   Grid: display flex, justify: center, gap: 16px, flex-wrap: wrap
   Each card: bg #1A1A1A, border: 1px solid #2A2A2A, border-radius: 8px, padding: 32px 24px, width: 160px, text-align: center, cursor: default
   Hover: border-color #C9A24A, transition 200ms
   Card content: SVG line icon (32px, color #C9A24A) + label below (Inter SemiBold 14px, white)

   Card 1: icon = fork-knife (restaurant) + "Restaurante"
   Card 2: icon = burger (food) + "Hamburgueria"
   Card 3: icon = coffee-cup + "Cafeteria"
   Card 4: icon = sandwich + "Lanchonete"
   Card 5: icon = box/package + "Dark Kitchen"

   Use Heroicons or Lucide line icons (SVG inline).

3. Divider: 1px line, color #2A2A2A, max-width 400px, margin 48px auto

4. Desires section headline:
   "E quer:"
   - Inter SemiBold 24px, color: #C9A24A, text-align: center, margin-bottom: 32px

5. Desires list — 2 columns desktop, 1 column mobile:
   display: grid, grid-template-columns: repeat(2, 1fr), max-width 600px, margin auto, gap: 16px 48px
   Each item: flex row, gap 12px, align-items center
   Checkmark: custom SVG circle-check icon, color #C9A24A, 20px, flex-shrink: 0
   Text: Inter SemiBold 17px, color white

   Items:
   ✓ Aumentar o lucro de verdade
   ✓ Organizar o negócio de uma vez
   ✓ Ter previsibilidade financeira
   ✓ Sair do operacional
   ✓ Escalar com segurança (spans full width on last if odd)

---

### S03 — PROBLEMA / DORES
- bg: #0A0A0A, padding: 96px 0

1. Headline: "Reconhece algum desses cenários?"
   - Inter Bold 40px, white, centered, margin-bottom 64px

2. Pain cards grid: 2 columns desktop, 1 column mobile, gap: 24px, max-width 960px, margin auto
   Each card: bg #141414, border-left: 3px solid #C9A24A, border-radius: 0 8px 8px 0, padding: 32px
   Card structure:
   - SVG line icon 32px color #C9A24A, margin-bottom 16px
   - Title: Inter Bold 18px, white, margin-bottom 12px
   - Description: Inter Regular 15px, rgba(255,255,255,0.65), line-height 1.7
   Hover: bg #1A1A1A, transition 200ms

   Card 1: icon=trending-down, title="Faturamento alto, lucro baixo", desc="O caixa entra, mas no fim do mês não sobra nada. Você trabalha mais do que nunca — e ganha proporcionalmente menos. Não é azar. É estrutura."
   Card 2: icon=help-circle, title="Dinheiro que some", desc="Você não sabe para onde vai cada real. Sem controle financeiro real, cada decisão é no feeling — e o feeling tem um custo alto."
   Card 3: icon=users-x, title="Equipe sem autonomia", desc="Contrata com esperança, treina no sufoco e perde em 3 meses. O turnover come sua margem e sua energia. E quando você não está, nada funciona."
   Card 4: icon=lock, title="Dono preso no operacional", desc="Você abriu o negócio para ter liberdade. Mas hoje é o primeiro a chegar, o último a sair — e o WhatsApp não para nem no domingo."
   Card 5: icon=ban, title="Crescimento travado", desc="Você sente que o negócio poderia crescer muito mais. Mas cada vez que tenta escalar, algo quebra. Falta processo. Falta estrutura. Falta direção."
   Card 6: icon=alert-triangle, title="Problemas com sócios", desc="Conflito de visão, divisão de responsabilidade mal definida, medo de abrir sociedade errada. Esses problemas drenam energia e dinheiro."

3. Closing banner (full-width):
   - bg: #C9A24A, padding: 28px 40px, margin-top: 48px, border-radius: 4px, max-width 960px, margin: 48px auto 0
   - Text: "Se você se viu em pelo menos um desses cenários — você está no lugar certo."
   - Inter Bold 18px, color: #0A0A0A, text-align: center

---

### S04 — TRANSIÇÃO
- bg: linear-gradient(180deg, #0A0A0A 0%, #111008 100%), padding: 80px 0

1. Big statement (2 lines):
   Line 1: "O problema não é falta de esforço."
   Line 2: "É falta de sistema."
   - Inter Bold, font-size: clamp(32px, 4vw, 52px), white, text-align: center, line-height: 1.2, max-width 800px, margin: 0 auto

2. Body text below:
   "Donos de negócios de alimentação trabalham mais do que qualquer um. Mas esforço sem estrutura é improviso — e improviso tem um preço. A diferença entre o dono que escala e o que se afoga não é talento. É método. E método se instala."
   - Inter Regular 18px, rgba(255,255,255,0.65), max-width 620px, margin: 32px auto 0, text-align center, line-height 1.8

3. Gold anchor line:
   "— A Alpha Business existe para instalar esse método no seu negócio."
   - Inter SemiBold 14px, #C9A24A, text-align center, margin-top 32px, letter-spacing 0.05em, text-transform uppercase

---

### S05 — OS 12 PILARES
- bg: #0F0F0F, padding: 96px 0

1. Eyebrow: "O MÉTODO"
   - Inter SemiBold 11px, #C9A24A, letter-spacing 0.2em, text-align center

2. Headline: "Os 12 Pilares de um Negócio Lucrativo e Escalável."
   - Inter Bold 40px, white, text-align center, margin-top 12px, max-width 700px, margin: 12px auto 0

3. Subheadline:
   "A Alpha Business é estruturada em 12 módulos que transformam completamente o ecossistema do seu negócio — garantindo lucratividade e escalabilidade."
   - Inter Regular 17px, rgba(255,255,255,0.55), text-align center, max-width 560px, margin: 16px auto 48px

4. Pillars grid: 3 columns desktop, 2 columns tablet (768px), 1 column mobile
   gap: 1px (creates thin separator effect between cards using gap + bg on parent)
   Parent bg: #2A2A2A (gap color)

   Each card: bg #1A1A1A, padding: 32px 28px, position relative
   - Number (top-right): Inter Bold 12px, #C9A24A, opacity 0.8, position absolute, top 20px, right 20px
   - Icon: SVG line 28px, #C9A24A, margin-bottom 16px
   - Title: Inter SemiBold 16px, white, margin-bottom 10px, line-height 1.4
   - Description: Inter Regular 14px, rgba(255,255,255,0.6), line-height 1.7
   Hover: bg #222222, border-top: 2px solid #C9A24A, transition 200ms

   Pillars:
   01 | icon=brain | "Mentalidade de Dono e Visão de Escala" | "Você deixa de operar no dia a dia e passa a liderar o crescimento estruturado da sua empresa."
   02 | icon=trending-up | "Vendas, Ticket Médio e Crescimento" | "Aumento de faturamento guiado por estratégia sólida — eliminando a dependência do improviso."
   03 | icon=users | "Liderança, Cultura e Gestão de Equipe" | "Equipe altamente produtiva, alinhada aos seus propósitos e operando com metas claras."
   04 | icon=dollar-sign | "Gestão de Lucro, CMV e Controle de Caixa" | "Controle absoluto. Você entende o destino de cada real e começa a extrair lucro verdadeiro da operação."
   05 | icon=shield | "Estrutura Tributária e Proteção do Lucro" | "Otimização inteligente para minimizar perdas com impostos — com segurança jurídica durante o crescimento."
   06 | icon=award | "Posicionamento, Marca e Autoridade Local" | "Seu negócio transcende a guerra de preços e se consolida como referência local."
   07 | icon=settings | "Operação Eficiente e Padronização" | "Processos que eliminam desperdícios — gerando aumento direto e imediato na margem de lucro."
   08 | icon=git-branch | "Delegação e Estrutura de Gestão" | "Lideranças internas desenvolvidas para que o negócio funcione com excelência sem depender de você."
   09 | icon=layers | "Modelo Escalável e Replicável" | "Preparação estrutural para expansão real — redes, franquias ou licenciamento."
   10 | icon=handshake | "Sociedades e Parcerias" | "Aprenda a orquestrar o crescimento eliminando conflitos e prevenindo prejuízos em sociedades."
   11 | icon=bar-chart-2 | "Gestão por Indicadores (KPIs)" | "Painéis de controle. Decisões críticas baseadas exclusivamente em dados e métricas."
   12 | icon=flag | "Execução e Próximo Nível" | "A ponte final. Transformação da estratégia validada em resultados financeiros tangíveis e sustentáveis."

5. Closing quote (below grid):
   "Quando os 12 pilares estão alinhados, você para de ser operador e volta a ser dono."
   - Inter Italic 20px, #C9A24A, text-align center, margin-top 48px, max-width 600px, margin: 48px auto 0

---

### S06 — COMO FUNCIONA
- bg: #0A0A0A, padding: 96px 0

1. Eyebrow: "12 MESES · FOCO TOTAL"
2. Headline: "Do caos ao controle."
   - Inter Bold 40px, white, centered
3. Subheadline: "Você será acompanhado durante um ano inteiro — com estrutura, método e direção em cada fase."
   - Inter Regular 17px, rgba(255,255,255,0.6), centered, max-width 520px, margin auto

4. 4 focus cards — horizontal row desktop, 2x2 tablet, 1 col mobile, gap 1px, parent bg #2A2A2A
   Each card: bg #141414, border-top: 3px solid #C9A24A, padding: 40px 32px
   - Icon: 40px, #C9A24A, line art
   - Title: Inter Bold 18px, white, margin-top 20px
   - Description: Inter Regular 14px, rgba(255,255,255,0.6), line-height 1.7, margin-top 10px

   Card 1: icon=clipboard-list, "Organização do Negócio", "Tudo no lugar — financeiro, operação, equipe e processos."
   Card 2: icon=trending-up, "Aumento de Lucro", "Mais margem, menos desperdício, decisões baseadas em números reais."
   Card 3: icon=package, "Estruturação", "Da bagunça para o método. Da dependência para a autonomia."
   Card 4: icon=rocket, "Escala", "Crescimento com base sólida — não com improviso e apagões."

---

### S07 — DIFERENCIAL
- bg: #0F0F0F, padding: 96px 0

Layout: 2 columns, 40% left / 60% right, max-width 1100px, margin auto
Divider: 1px vertical line, #2A2A2A, between columns (CSS after pseudo-element)
Mobile: stack vertically, left on top

LEFT COLUMN (40%):
- Text (muted): "A maioria das mentorias ensina o que fazer."
  Inter Regular 22px, rgba(255,255,255,0.35), line-height 1.5
- Spacer: 16px
- Horizontal rule: 48px, 1px, #C9A24A
- Spacer: 16px
- Text (gold): "A Alpha Business acompanha até isso virar resultado."
  Inter Bold 22px, #C9A24A, line-height 1.5

RIGHT COLUMN (60%):
- "Aqui você não recebe só conteúdo."
  Inter Bold 32px, white, line-height 1.3
- Spacer: 16px
- "Você recebe direção, aplicação e acompanhamento real."
  Inter Bold 32px, white, line-height 1.3 — highlight "direção, aplicação e acompanhamento real" with color #C9A24A
- Spacer: 24px
- "Não é curso. Não é palestra. Não é informação solta."
  Inter Regular 18px, rgba(255,255,255,0.65), line-height 1.7
- Spacer: 20px
- "É um processo de transformação."
  Inter SemiBold 20px, #C9A24A

BELOW BOTH COLUMNS (full width):
- Thin gold divider: 80px, 1px, #C9A24A, centered, margin: 48px auto
- Closing quote: "Isso é o que separa quem aprende de quem muda de verdade."
  Inter Regular Italic 18px, rgba(255,255,255,0.4), text-align center

---

### S08 — MENTORES
- bg: #0A0A0A, padding: 96px 0

1. Headline: "Quem Vai Guiar Sua Transformação"
   - Inter Bold 40px, white, text-align center, margin-bottom 64px

2. Mentor cards: 3 columns desktop, horizontal scroll mobile, gap: 32px, max-width 1100px, margin auto
   Each card: bg #141414, border-radius 8px, overflow hidden
   - Photo area: width 100%, height: 320px, bg: #1A1A1A
     Placeholder: dark rectangle with centered SVG user icon (64px, #2A2A2A) + text below "FOTO DO MENTOR" (Inter Regular 12px, #333)
     Code: <div class="mentor-photo-placeholder"><svg>...</svg><span>FOTO DO MENTOR</span></div>
   - Content area: padding 28px
     - Name: Inter Bold 18px, #C9A24A
     - Role: Inter Regular 13px, rgba(255,255,255,0.45), margin-top 4px, text-transform uppercase, letter-spacing 0.1em
     - Divider: 32px, 1px, #2A2A2A, margin: 16px 0
     - Bio: Inter Regular 14px, rgba(255,255,255,0.65), line-height 1.8

   Mentor 1: "Lucas Silva" / "Alpha Master Mentor" / "CEO da Ponto Alpha Café. Executivo de expansão da Monster Dog. Construiu a operação de dentro para fora — sabe o que é estar no balcão e sabe o que é sair dele. Mentor de quem quer escalar de verdade."

   Mentor 2: "José Ricardo" / "Fundador do Ponto Alpha" / "De camelô a fundador de uma rede com +500 lojas. Não é teoria — é uma jornada construída com as mãos no caixa. Entende cada dor porque já viveu cada uma delas."

   Mentor 3: "Robert" / "Mentor & CFO" / "Estratégia financeira e governança para negócios que querem crescer sem quebrar. Alta performance com os pés no chão. O cara que faz a DRE parecer fácil — e o lucro aparecer de verdade."

---

### S09 — DEPOIMENTOS (Carrossel Stories)
- bg: #0F0F0F, padding: 96px 0, overflow: hidden

1. Headline: "Quem já percorreu O Caminho do Dono."
   - Inter Bold 40px, white, centered
2. Subheadline: "Resultados reais de quem aplicou o método."
   - Inter Regular 16px, rgba(255,255,255,0.45), centered, margin-top 12px, margin-bottom 48px

3. Carousel container:
   - display: flex, gap: 20px, overflow-x: auto, scroll-snap-type: x mandatory
   - scrollbar-width: none (hide scrollbar)
   - padding: 0 calc((100vw - 1100px) / 2) — starts aligned with container
   - Drag-to-scroll with JS (mouse events + touch events)

   Each video card:
   - flex-shrink: 0, width: 270px, scroll-snap-align: start
   - aspect-ratio: 9/16 (270x480px)
   - bg: #1A1A1A, border-radius: 12px, overflow: hidden, position: relative
   - Video placeholder: full dark bg + centered play icon (SVG 48px, #C9A24A) + text "DEPOIMENTO EM VÍDEO" (Inter Regular 11px, rgba(255,255,255,0.3))
   - Bottom overlay: linear-gradient(transparent, rgba(0,0,0,0.8)), padding 20px
     - Name: Inter SemiBold 14px, white
     - Business type: Inter Regular 12px, #C9A24A

   Build 6 placeholder cards:
   Card 1-6: all identical placeholder structure, names: "[Nome do Aluno 01-06]", business: "[Tipo de Negócio]"

   IMPORTANT: Each card must have data-video-src="" attribute ready for video injection later.
   When video src is provided, replace placeholder with <video autoplay muted loop playsinline>.

4. Pagination dots: display flex, gap 8px, justify center, margin-top 28px
   Each dot: 8px circle, bg #2A2A2A, active: bg #C9A24A, transition 200ms
   JS: update active dot on scroll

---

### S10 — PARA QUEM É / NÃO É
- bg: #0A0A0A, padding: 96px 0

1. Headline: "Este programa é para quem já está no jogo."
   - Inter Bold 40px, white, text-align center, margin-bottom 48px

2. Two-column split: max-width 960px, margin auto, gap 32px
   Desktop: 2 cols equal. Mobile: stack.

   LEFT CARD — "Para quem é":
   - bg: rgba(0,160,0,0.04), border: 1px solid rgba(0,180,0,0.2), border-radius 8px, padding 40px
   - Header: "✅ PARA QUEM É" — Inter Bold 14px, rgba(255,255,255,0.5), letter-spacing 0.15em, margin-bottom 28px
   - Items list, each: flex gap 12px, margin-bottom 16px
     Icon: custom SVG check circle, color #4CAF50, 20px, flex-shrink 0
     Text: Inter Regular 16px, white, line-height 1.5
   Items:
   - "Dono de restaurante, hamburgueria, cafeteria, lanchonete ou dark kitchen"
   - "Fatura, mas não vê lucro proporcional"
   - "Quer organizar, estruturar e escalar — sem improvisar"
   - "Busca método, não motivação"
   - "Está disposto a mudar o que precisa ser mudado"

   RIGHT CARD — "Para quem não é":
   - bg: rgba(160,0,0,0.04), border: 1px solid rgba(180,0,0,0.2), border-radius 8px, padding 40px
   - Header: "❌ PARA QUEM NÃO É" — Inter Bold 14px, rgba(255,255,255,0.5), letter-spacing 0.15em, margin-bottom 28px
   - Items list same structure
     Icon: custom SVG x circle, color #F44336, 20px
   Items:
   - "Iniciantes sem negócio rodando"
   - "Quem busca atalho ou fórmula mágica"
   - "Quem quer só 'se inspirar'"
   - "Quem não está disposto a executar"

3. Closing line below both cards:
   "Por isso existe o processo seletivo. Não é para qualquer um. É para quem está pronto."
   - Inter SemiBold 17px, #C9A24A, text-align center, margin-top 40px

---

### S10.5 — GARANTIA (Savvy Match pattern — 3 pilares visuais de confiança)
- bg: #0A0A0A, padding: 80px 0
- Container: max-width 960px, margin auto
- border: 1px solid #1E1E1E, border-radius: 8px, padding: 64px 80px (mobile: 40px 24px)

1. Headline: "Você está protegido."
   - Inter Bold 36px, white, text-align center, margin-bottom 8px
2. Subheadline: "Sua confiança é a base do processo."
   - Inter Regular 16px, rgba(255,255,255,0.45), text-align center, margin-bottom 48px

3. 3 pillar cards — horizontal row, gap 32px (mobile: stack)
   Each pillar: text-align center
   - Icon: SVG 40px, #C9A24A
   - Title: Inter Bold 16px, white, margin-top 16px
   - Description: Inter Regular 14px, rgba(255,255,255,0.55), line-height 1.7, margin-top 8px

   Pillar 1: icon=shield-check, "Processo Transparente", "Seleção criteriosa para garantir que você está no grupo certo — e que o grupo está no seu nível."
   Pillar 2: icon=users, "Mentores de Campo", "Lucas Silva, José Ricardo e Robert CFO. Não são professores — são empresários que construíram operações reais."
   Pillar 3: icon=trending-up, "Método Validado", "O Tripé da Excelência Empresarial™ foi testado em +500 operações no food service antes de chegar até você."

4. Divider line: 1px, #1E1E1E, margin: 48px 0
5. Bottom line centered:
   "Se em 30 dias você sentir que a mentoria não é para você, conversamos. Sem burocracia."
   - Inter Regular 15px, rgba(255,255,255,0.4), text-align center, max-width 500px, margin auto

---

### S11 — FAQ
- bg: #0F0F0F, padding: 96px 0

1. Headline: "Perguntas Frequentes"
   - Inter Bold 40px, white, centered, margin-bottom 48px

2. Accordion container: max-width 800px, margin auto

Each accordion item:
- Border-bottom: 1px solid #1E1E1E
- Closed state: bg transparent, padding: 24px 0
- Open state: bg transparent, border-left: 3px solid #C9A24A, padding: 24px 0 24px 20px
- Question row: flex, justify space-between, align center, cursor pointer
  - Question text: Inter SemiBold 16px, white
  - Toggle icon: SVG plus/minus, 20px, #C9A24A, transition rotate 200ms
- Answer: Inter Regular 15px, rgba(255,255,255,0.65), line-height 1.8, margin-top 16px, max-height 0 (closed) / auto (open), overflow hidden, transition max-height 300ms ease

Questions and Answers:
Q1: "Qual o investimento?"
A1: "O programa é high-ticket e seletivo. O valor é apresentado após o processo de aplicação — para garantir que o match entre você e a mentoria é real dos dois lados."

Q2: "Por que existe processo seletivo?"
A2: "Porque a qualidade do grupo importa tanto quanto o conteúdo. Selecionamos quem está no momento certo, com o perfil certo — para que o ambiente seja de elite de verdade."

Q3: "Preciso ser do food service?"
A3: "Sim. O método foi desenvolvido especificamente para negócios de alimentação. Cada pilar, cada ferramenta, cada exemplo vem desse mercado."

Q4: "Já fiz cursos e nada mudou. Por que aqui seria diferente?"
A4: "Porque a Alpha Business não entrega conteúdo — entrega acompanhamento até o resultado aparecer. A diferença não é o que você aprende. É quem está do seu lado enquanto você aplica."

Q5: "Quanto tempo leva para ver resultado?"
A5: "Depende do seu negócio, mas os primeiros ajustes de controle financeiro e operação costumam gerar impacto imediato — nas primeiras semanas."

---

### S12 — CTA FINAL
- bg: linear-gradient(135deg, #0A0A0A 0%, #1A1400 100%), padding: 120px 0
- text-align: center

1. Headline: "Sua empresa vai continuar dependendo de você?"
   - Inter Bold, font-size: clamp(32px, 4vw, 52px), white, max-width 800px, margin 0 auto, line-height 1.2

2. Body:
   "Você pode fechar essa página e voltar amanhã para o mesmo ciclo: abrir o negócio, apagar incêndios, fechar o caixa e repetir. Ou pode tomar a decisão de instalar a estrutura que vai fazer seu negócio funcionar — com ou sem você no balcão."
   - Inter Regular 18px, rgba(255,255,255,0.65), max-width 580px, margin: 28px auto 0, line-height 1.8

3. Gold diamond separator:
   - HTML: <div class="separator">── ◆ ──</div>
   - Inter Regular 14px, #C9A24A, margin: 40px auto, letter-spacing 0.3em

4. Quote:
   "O caminho do dono não é trabalhar mais. É construir algo que funcione sem você em tudo."
   - Inter Italic 22px, white, max-width 520px, margin: 0 auto 40px, line-height 1.6

5. CTA Button (largest on page):
   "QUERO APLICAR PARA A MENTORIA →"
   - bg: #C9A24A, color: #0A0A0A, Inter Bold 18px, padding: 20px 56px, border-radius: 4px
   - Hover: bg darken 10%, box-shadow: 0 0 40px rgba(201,162,74,0.25), transform: translateY(-1px)
   - href: "https://wa.me/[WHATSAPP_PLACEHOLDER]"

6. Sub-CTA:
   "Processo seletivo · Resposta em até 48h · Vagas limitadas"
   - Inter Regular 13px, rgba(255,255,255,0.35), margin-top 16px

---

### S13 — FOOTER
- bg: #050505, padding: 48px 0, border-top: 1px solid #141414
- Container: max-width 1200px, margin auto, flex row, justify space-between, align center
- Left: Logo placeholder text "Alpha Business Academy" — Inter Bold 14px, rgba(255,255,255,0.5)
- Right: "© 2026 Alpha Business Academy. Todos os direitos reservados." — Inter Regular 12px, rgba(255,255,255,0.3)
- Mobile: stack center, gap 12px

---

## [4] SCROLL ANIMATIONS (MANDATORY)

Add scroll-triggered fade-up animations to ALL section content using IntersectionObserver:
- Initial state: opacity 0, transform: translateY(30px)
- Triggered state: opacity 1, transform: translateY(0)
- Transition: 600ms ease-out
- Stagger delay for grid items: 80ms per item (0ms, 80ms, 160ms...)
- Only animate once (disconnect observer after trigger)

---

## [5] JAVASCRIPT REQUIREMENTS

1. Navbar: Add class "scrolled" to navbar after 50px scroll — triggers subtle border-bottom visibility
2. Video Carousel: Drag-to-scroll (mouse + touch), momentum scrolling, pagination dots sync
3. FAQ Accordion: Toggle open/close, smooth height animation, only one open at a time
4. Scroll animations: IntersectionObserver for all .animate-on-scroll elements
5. CTA buttons: All "#QUERO_APLICAR" buttons link to WhatsApp — href="https://wa.me/[WHATSAPP_PLACEHOLDER]"
6. Active section: Add data-section attributes for analytics readiness
7. Sticky mobile CTA bar (Savvy Match pattern — CTA sempre visível no mobile):
   - Visible ONLY on mobile (hidden on desktop via CSS)
   - Position: fixed, bottom: 0, left: 0, right: 0, z-index: 200
   - bg: #C9A24A, padding: 16px 24px, display flex, align-items center, justify: space-between
   - Left text: "Quero aplicar para a mentoria" — Inter SemiBold 14px, #0A0A0A
   - Right: arrow icon → #0A0A0A, 20px
   - Full bar is clickable: href="https://wa.me/[WHATSAPP_PLACEHOLDER]"
   - Add safe-area-inset-bottom padding for iPhone notch: padding-bottom: calc(16px + env(safe-area-inset-bottom))
   - Appears after user scrolls past hero (JS: show after 100vh scroll)

---

## [6] FILE STRUCTURE OUTPUT

Deliver exactly these files:
- index.html (complete page)
- style.css (all custom styles not covered by Tailwind)
- main.js (all interactions)
- Include Tailwind via CDN in HTML head (v3)
- Include Inter via Google Fonts in HTML head

DO NOT split into components or use any framework.
DO NOT create additional files.

---

## [7] WHAT NOT TO DO

- NO stock images or Unsplash references
- NO gradients on text (no background-clip text)
- NO neon glows or cyberpunk aesthetics
- NO rounded-full pill buttons
- NO floating chat widgets
- NO cookie banners
- NO generic motivational copy (every word is already provided above — use it VERBATIM)
- NO additional sections not listed above
- NO Lorem Ipsum anywhere
- NO additional fonts beyond Inter

=== END PROMPT ===
```

---

## NOTAS DE USO

**Para Framer:** Cole o prompt no Framer AI e solicite geração seção por seção se necessário. Comece pelo Hero + Navbar e vá descendo.

**Para v0.dev:** Cole seção por seção. Comece: "Build Section S01 — Hero" com o contexto de brand no topo.

**Para Lovable:** Cole o prompt completo. Lovable lida bem com prompts longos de página única.

**Substituições após build:**
- `[WHATSAPP_PLACEHOLDER]` → número real do WhatsApp
- `/assets/hero-bg-placeholder.jpg` → foto real do hero
- Fotos dos mentores → substituir placeholder divs por `<img>`
- Vídeos depoimentos → popular `data-video-src` nos cards

---

*Alpha Business Academy — O Caminho do Dono*
*AI Build Prompt v1.0 · Uma (UX Design Expert) · 2026-04-08*
