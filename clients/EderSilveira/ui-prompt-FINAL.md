# UI Prompt FINAL — Eder Silveira Barbearia Landing Page
> @ux-design-expert (Uma) + @copy-chief · Hopkins 88/100 · Sugarman 82%
> Status: PRONTO PARA v0 / LOVABLE / CURSOR

---

## PROMPT MASTER — COPY/PASTE INTO v0 / LOVABLE / CURSOR

```
Build a premium, cinematic dark-mode landing page for "Eder Silveira Barbearia" — a high-end Brazilian barbershop brand.

---

## 🏆 HIGH-LEVEL GOAL (Onlyness Statement)

"Eder Silveira Barbearia é a única barbearia que trata cada visita como um ritual de masculinidade — onde precisão, estilo e experiência premium transformam um corte em uma declaração de identidade."

Headline da marca: **"Estilo não se compra. Se constrói."**

This page must sell 3 monthly membership plans, showcase services, build urgency through social proof toast notifications, answer objections via FAQ, and convert visitors into scheduled appointments.

---

## 🎨 BRAND AESTHETIC CONSTRAINTS (NON-NEGOTIABLE)

- **Mode:** Pure Dark Mode — background #0A0A0A
- **Primary Accent:** Gold #D4A017 / #D4AF37 (warm premium gold — never neon yellow)
- **Secondary:** Off-white #F5F0E8 for body text
- **Logo:** "Eder Silveira" cursive calligraphy in gold — place in header and hero → `<img src="/placeholder-logo.png">`
- **Typography:**
  - Headlines: font-black, tight tracking (-0.02em to -0.04em), oversized clamp(3.5rem, 7vw, 7rem)
  - Body: Regular, line-height 1.6, max-width 65ch
  - Font Stack: `'Playfair Display'` for display + `'Inter'` for UI/body
- **Grid:** 12-column Swiss grid, max-width 1280px, px-6 md:px-12 lg:px-24
- **Spacing:** Luxury — sections use `py-24 md:py-32` minimum
- **Textures:** Sub-pixel borders (border-white/5), grain overlay on hero, glassmorphism cards (backdrop-blur-md bg-white/5)
- **Images:** ALL `<img src="/placeholder-*.jpg">` — DO NOT use Unsplash or external URLs

---

## 📋 SECTION-BY-SECTION INSTRUCTIONS

---

### SECTION 1 — STICKY HEADER
- Logo left: cursive "Eder Silveira" gold, ~180px
- Nav center: Serviços · Planos · FAQ
- CTA right: "Agendar Agora" — gold bg, black text, rounded-full, font-bold
- Transparent → bg-black/90 backdrop-blur on scroll
- Mobile: hamburger, full-screen overlay nav

---

### SECTION 2 — HERO (100vh)
**Background:**
- Base: #0A0A0A
- Radial glow from bottom-center: `radial-gradient(ellipse at 50% 100%, rgba(212,160,23,0.15) 0%, transparent 70%)`
- Grain texture overlay at 3% opacity (CSS SVG noise)

**Layout desktop:** 2-column — text left, barber photo right
**Layout mobile:** 1-column, text centered, image below

**Text content:**
- Pre-label: "Barbearia Premium" (text-gold, text-sm, uppercase, tracking-widest)
- Headline: **"Estilo não se compra. Se constrói."** — clamp(3.5rem, 7vw, 7rem), font-black, leading-none, text-white
- Subheadline: "Na Eder Silveira Barbearia, cada corte é uma decisão de posicionamento. Ambiente exclusivo, atendimento sob medida e acabamento que fala antes de você abrir a boca." — text-white/70, text-xl, max-w-lg
- CTAs:
  - Primary: "Agende o seu horário" — gold pill button, large
  - Secondary: "Ver Planos" — ghost, border-gold/50

**Image right:** `<img src="/placeholder-hero-barber.jpg" class="h-full w-full object-cover">` inside a clipped container with 2px gold border-left accent line

**TOAST NOTIFICATION COMPONENT (floating, bottom-left):**
- Position: `fixed bottom-8 left-8 z-50`
- Style: `bg-white/8 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-3 shadow-xl`
- Content: Green pulsing dot + "**[NOME]** agendou o seu corte ✂️"
- Names array (rotate randomly):
  `["Rafael", "Lucas", "Pedro", "Gustavo", "Thiago", "Felipe", "Bruno", "Matheus", "André", "Henrique"]`
- Behavior: appears every 10 seconds, auto-dismisses after 6 seconds
- Animation (Framer Motion):
  ```tsx
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 20 }}
  transition={{ duration: 0.4 }}
  ```
- Logic:
  ```tsx
  useEffect(() => {
    const interval = setInterval(() => {
      const name = names[Math.floor(Math.random() * names.length)];
      setToast(name);
      setTimeout(() => setToast(null), 6000);
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  ```

---

### SECTION 3 — SOCIAL PROOF BAR (thin strip below hero)
- `bg-white/3 border-y border-white/5 py-4`
- 3 stats: ⭐ **4.9/5** no Google · ✂️ **+2.000** cortes/mês · 🏆 **5 anos** de excelência
- Auto-scroll marquee on mobile

---

### SECTION 4 — SERVIÇOS
**Section title:** "Nossos Serviços" — centered, oversized, with 2px gold underline accent

**Layout:** 3-col bento grid desktop → swipe carousel mobile (NEVER vertical stack on mobile)

**Card style:** `bg-white/5 border border-white/8 rounded-3xl p-6 hover:border-gold/40 hover:bg-white/8 transition-all duration-300`

**Services (6 cards):**

1. **Corte — R$ 40,00**
   "Precisão no detalhe. Identidade no resultado."
   Análise do formato do rosto, textura do cabelo e estilo pessoal. Cada corte é projetado para você, não para a tendência do momento.
   → `<img src="/placeholder-service-corte.jpg">`

2. **Barba — R$ 20,00**
   "Navalha, toalha quente e acabamento impecável."
   Modelagem completa com navalha artesanal, hidratação profunda e alinhamento milimétrico. Sua barba no nível que ela merece.
   → `<img src="/placeholder-service-barba.jpg">`

3. **Sobrancelha na Navalha — R$ 10,00**
   "O detalhe que separa o cuidado do desleixo."
   Design limpo e natural com navalha. Sem exageros. Sem sobrancelha de boneco. Apenas a versão mais afiada de você.
   → `<img src="/placeholder-service-sobrancelha.jpg">`

4. **Combo Corte + Barba — R$ 50,00**
   "O pacote completo para quem não aceita meio termo."
   Corte sob medida mais barba alinhada na navalha. Você sai pronto para qualquer mesa, reunião ou ocasião.
   → `<img src="/placeholder-service-combo.jpg">`

5. **Barboterapia com Ozônio — R$ 30,00**
   "Tratamento profundo. Resultado visível."
   Tecnologia de ozônio para limpeza profunda, controle de oleosidade e saúde da pele. Porque cuidar não é frescura.
   → `<img src="/placeholder-service-barboterapia.jpg">`

6. **Dia do Noivo — A partir de R$ 350,00**
   "Seu melhor dia merece sua melhor versão."
   Experiência completa: corte, barba, sobrancelha, hidratação facial e cerveja artesanal. Atendimento exclusivo, sem pressa, no seu ritmo. Porque o altar exige presença.
   → `<img src="/placeholder-service-noivo.jpg">`

---

### SECTION 5 — PLANOS MENSAIS
**Background:** `bg-gradient-to-b from-[#0D0D0D] via-[#111008] to-[#0D0D0D]` + gold radial glow center

**Section title:** "Escolha seu Plano"
**Subtitle:** "Consistência é a base do estilo. Assine e garanta seu horário todo mês."

**Layout:** 3-col desktop → swipe carousel mobile

**3 PLANOS:**

**PLANO 1 — CORTE CERTO · R$ 89/mês**
*"Para quem não deixa o estilo vencer pelo cansaço."*
Card style: `bg-white/5 border border-white/10 rounded-3xl p-8`
Benefits:
- ✓ 2 cortes por mês (agendamento prioritário)
- ✓ Acabamento de pescoço entre cortes
- ✓ 10% de desconto em produtos da barbearia
- ✓ Agendamento via app com horário reservado
CTA: "Assinar" — ghost button, border-white/20

**PLANO 2 — LÂMINA AFIADA · R$ 129/mês** ← HIGHLIGHTED
*"Para quem entendeu que consistência é a base do estilo."*
Card style: `bg-gradient-to-b from-[#1A1500] to-[#0D0D0D] border-2 border-gold/60 rounded-3xl p-8 scale-105 ring-2 ring-gold/30`
Badge: "MAIS POPULAR" — gold bg, black text, rounded-full, absolute top-0 translate-y-(-50%)
Benefits:
- ✓ 2 cortes + 2 barbas por mês
- ✓ Sobrancelha na navalha inclusa
- ✓ Hidratação facial express em todo atendimento
- ✓ 15% de desconto em produtos
- ✓ Horário fixo reservado (mesmo dia e hora toda semana)
CTA: "Assinar Agora" — full-width, gold bg, black text, font-bold

**PLANO 3 — BLACK EDITION · R$ 179/mês**
*"Acesso total. Sem limites. Sem desculpas."*
Card style: `bg-white/5 border border-white/10 rounded-3xl p-8`
Benefits:
- ✓ Cortes e barbas ilimitados
- ✓ Sobrancelha na navalha inclusa
- ✓ Hidratação facial completa em todo atendimento
- ✓ 20% de desconto em produtos
- ✓ Atendimento prioritário (sem fila, sem espera)
- ✓ Acesso a eventos exclusivos da barbearia
- ✓ Cerveja artesanal cortesia em toda visita
CTA: "Assinar" — ghost button, border-gold/40

**Urgency note below cards (centered):**
⚠️ "Apenas **10 vagas** disponíveis este mês" — text-gold/80, text-sm

---

### SECTION 6 — FAQ (Accordion)
**Title:** "Perguntas Frequentes" — centered
**Layout:** single column, max-w-3xl, centered, no card boxes

**Accordion style:**
- `border-b border-white/10` separators
- Question: `text-white font-semibold text-lg py-5 cursor-pointer flex justify-between items-center`
- Arrow icon: rotates 180° on open (CSS transition `rotate-180`)
- Answer: Framer Motion AnimatePresence smooth expand, `text-white/60 pb-5`

**5 Q&As:**

**Q1: Como funciona o agendamento?**
"Pelo nosso app ou pelo WhatsApp. Você escolhe o profissional, o serviço e o horário. Sem surpresas, sem espera. Chegou, sentou, começou."

**Q2: Posso cancelar ou reagendar meu horário?**
"Sim. Pedimos apenas que o cancelamento ou reagendamento seja feito com no mínimo 2 horas de antecedência. Respeitar o horário é respeitar o tempo de todos — inclusive o seu."

**Q3: Quais as formas de pagamento?**
"Pix, cartão de crédito, débito e dinheiro. Os planos mensais são cobrados via cartão de crédito com recorrência automática — sem boleto, sem esquecimento."

**Q4: Atendem menores de idade?**
"Sim, a partir de 12 anos, desde que acompanhados de um responsável. Menores de 16 precisam do responsável presente durante todo o atendimento."

**Q5: Preciso ser assinante de um plano para ser atendido?**
"Não. Você pode agendar serviços avulsos normalmente. Os planos existem para quem quer consistência, economia e prioridade — mas a porta está aberta para todos."

---

### SECTION 7 — FINAL CTA
**Background:** dark with `<img src="/placeholder-interior.jpg">` behind `bg-black/80` overlay + gold radial glow

**Content (centered):**
- Pre-label: "Não espere mais" (text-gold, uppercase, tracking-widest, text-sm)
- Headline: **"Restam poucas vagas para novos clientes este mês."** — oversized, white, font-black
- Body: "A Eder Silveira Barbearia opera com capacidade controlada. Não atendemos por volume — atendemos por excelência. Quando as vagas acabam, a lista de espera abre. Não fique do lado de fora." — text-white/60, max-w-xl
- CTA: "Garantir minha vaga agora" — gold bg, black text, rounded-full, px-12 py-5, text-lg font-bold
- Micro-copy below button: "Agendamento leva menos de 30 segundos." — text-white/40, text-sm

---

### SECTION 8 — FOOTER
- Logo + "© 2025 Eder Silveira Barbearia. Todos os direitos reservados."
- Links: Serviços · Planos · FAQ · Instagram
- Dark, minimal, `border-t border-white/5`
- **WhatsApp floating button:** `fixed bottom-8 right-8 z-50` — green circle, WhatsApp icon, pulse animation

---

## ⚙️ TECH STACK

- **Framework:** Next.js 14 App Router + TypeScript
- **Styling:** Tailwind CSS v3 — add to config: `extend.colors: { gold: '#D4A017' }`
- **Animations:** Framer Motion (toast, accordion, scroll fade-ups)
- **Scroll animations:** Intersection Observer + `whileInView={{ opacity:1, y:0 }} initial={{ opacity:0, y:30 }}`

**Component structure:**
```
app/
  page.tsx
  components/
    Header.tsx
    Hero.tsx
    ToastNotification.tsx
    SocialProofBar.tsx
    ServicesGrid.tsx
    PricingPlans.tsx
    FAQ.tsx
    FinalCTA.tsx
    Footer.tsx
    WhatsAppButton.tsx
```

---

## 🚫 PROHIBITIONS

- NO Unsplash, NO external image URLs — only `/placeholder-*.jpg`
- NO lazy flex-col stacking on mobile — use swipe carousels for grids
- NO flat card designs — glassmorphism or depth required
- NO Lorem ipsum — use the copy above exactly
- NO colors outside brand palette (black #0A0A0A, gold #D4A017, off-white #F5F0E8)
- DO NOT build backend, APIs, or payment integrations — UI only
- DO NOT modify any files outside the component structure listed above

---

## 📱 MOBILE BEHAVIOR SUMMARY

| Component | Desktop | Mobile |
|-----------|---------|--------|
| Hero | 2-col | 1-col, image below |
| Services | 3-col bento | Horizontal swipe carousel |
| Pricing | 3-col | Horizontal swipe carousel |
| FAQ | 800px centered | Full width, same accordion |
| Toast | fixed bottom-left | fixed bottom-center |
| WhatsApp | fixed bottom-right | fixed bottom-right |

---

## ✅ DEFINITION OF DONE

1. All 8 sections render on mobile + desktop
2. Toast cycles names every 10s with Framer Motion
3. FAQ accordion smooth open/close
4. Middle pricing card visually highlighted (scale-105 + ring-gold)
5. All CTAs gold-styled and visible
6. Page feels premium, cinematic, masculine
7. Zero Unsplash images
```

---

## ARQUIVOS DE REFERÊNCIA

| Arquivo | Conteúdo |
|---------|----------|
| [ui-prompt-FINAL.md](ui-prompt-FINAL.md) | Este arquivo — prompt consolidado |
| [../EderSilveiraBarbearia/landing-page-copy.md](../EderSilveiraBarbearia/landing-page-copy.md) | Copy completa @copy-chief (Hopkins 88/100) |

---
*Uma (UX-Design Expert) + Copy-Chief · Eder Silveira Barbearia · 2026-03-26*
*Hopkins Audit: 88/100 · Sugarman Triggers: 82% (24/30)*
