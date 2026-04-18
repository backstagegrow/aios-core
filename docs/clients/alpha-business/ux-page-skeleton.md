# Alpha Business — Página de Aplicação | UX Skeleton

**Cliente:** Alpha Business (Mentoria para donos de food business)
**Autor:** Uma (UX Design Expert)
**Data:** 2026-04-07
**Tipo:** Long-form Application Page (sem preço)
**Objetivo:** Gerar desejo + qualificar lead → CTA "Quero Aplicar"

---

## 1. Diretrizes Globais de Design

### 1.1 Sistema Visual — Tom Premium do Setor Food

**Paleta principal (premium-dark, não-hype):**

| Token | Hex | Uso |
|-------|-----|-----|
| `bg-primary` | `#0B0B0C` | Background principal (preto carvão, não puro) |
| `bg-secondary` | `#15151A` | Cards, blocos de seção alternados |
| `bg-tertiary` | `#1F1F26` | Hover states, inputs |
| `text-primary` | `#F5F1EA` | Texto principal (off-white quente, evita frio clínico) |
| `text-secondary` | `#A8A29A` | Subtítulos, descrições |
| `text-muted` | `#6B675F` | Metadata, captions |
| `accent-gold` | `#C9A961` | CTAs, destaques numéricos, ícones premium (champanhe maduro, não dourado neon) |
| `accent-gold-hover` | `#D4B575` | Hover do CTA |
| `accent-fire` | `#B8472A` | Acentos pontuais (dor, urgência) — terracota queimado, evoca cozinha |
| `border-subtle` | `#2A2A33` | Divisores |
| `border-gold` | `#C9A961` | Borda de cards de prova social premium |

> Justificativa: Food business premium (steakhouses, cafeterias autorais, restaurantes assinatura) usa paleta escura + dourado champanhe. Evita verde "saudável", vermelho "fast food" e azul "tech".

### 1.2 Tipografia

| Função | Família | Peso | Notas |
|--------|---------|------|-------|
| **Display (Headlines H1/H2)** | `Fraunces` ou `Tiempos Headline` (serif editorial) | 600 | Serif transmite tradição, autoridade, "chef" |
| **UI / Body** | `Inter` ou `Söhne` | 400/500 | Sans neutra, alta legibilidade |
| **Accent / Números** | `Fraunces` italic | 500 | Para destacar números de resultado |
| **Eyebrow / Labels** | `Inter` UPPERCASE tracking-wide | 600 | Microlabels acima de headlines |

**Escala (desktop):**
- H1 Hero: 64–80px / line-height 1.05
- H2 Section: 44–56px / 1.1
- H3 Subseção: 28–32px / 1.2
- Body Large: 20px / 1.55
- Body: 17px / 1.6
- Caption: 14px / 1.5

### 1.3 Grid & Espaçamento

- **Container:** max-width 1200px, padding lateral 24px (mobile) / 80px (desktop)
- **Grid:** 12 colunas, gutter 32px
- **Vertical rhythm:** Seções com `py-32` desktop / `py-20` mobile (separação editorial generosa)
- **Border-radius:** 8px (cards), 4px (botões) — cantos sutis, não arredondados demais

### 1.4 CTA — Padrão Visual Único

**Botão Primário "Quero Aplicar":**
- Background: `accent-gold` (#C9A961)
- Texto: `bg-primary` (#0B0B0C) — alto contraste, peso 600
- Padding: 20px 40px
- Border-radius: 4px
- Ícone: seta `arrow-right` à direita, animação sutil de translateX no hover
- Sombra: `0 0 0 1px rgba(201,169,97,0.3), 0 20px 40px -12px rgba(201,169,97,0.25)` no hover
- Hover: levanta 2px (`translateY(-2px)`), accent fica `#D4B575`

**Botão Secundário (não usar — só primário). Foco total em uma única ação.**

---

## 2. Wireframe por Seção

### SEÇÃO 1 — HERO (above the fold)

```
┌─────────────────────────────────────────────────────────────┐
│  [LOGO ALPHA BUSINESS]                    [QUERO APLICAR]   │ ← nav fixa
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   APPLICATION-ONLY · SETOR FOOD                             │ ← eyebrow
│                                                              │
│   Big Promise em duas linhas,                               │ ← H1 serif 72px
│   tipografia editorial impactante.                          │
│                                                              │
│   Subheadline em uma linha que reforça o público            │ ← 22px sans light
│   e o resultado tangível esperado.                          │
│                                                              │
│   ┌──────────────────────┐                                  │
│   │   QUERO APLICAR  →   │   ← Vagas limitadas · Aplicação │
│   └──────────────────────┘     analisada em 48h             │
│                                                              │
│                                                              │
│   ─── selos de credibilidade ───                            │ ← linha sutil
│   [+200 mentorados] [R$XXM gerenciados] [Setor food only]  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Layout:**
- Full-bleed background `bg-primary` com **textura sutil de fumaça/grão** (overlay 4% opacity) para evocar cozinha sem ser literal
- Texto centralizado (single column 720px max-width) — força o olho ao headline
- Eyebrow em `accent-gold`, uppercase, tracking-widest
- H1 em serif `text-primary`, peso 600
- CTA gold com microcopy à direita ("Aplicação analisada em 48h")

**Imagens:**
- **NÃO usar foto de prato** no hero (clichê)
- Opção A: Background limpo com grain + uma única linha vertical dourada à direita (statement minimalista)
- Opção B: Foto B&W de mãos de chef/dono em ação (ambiente, não comida) com overlay escuro 70%

**CTA #1** ✅ — Hero

---

### SEÇÃO 2 — AMPLIFICAÇÃO DA DOR (O Paradoxo)

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   O PARADOXO QUE NINGUÉM TE EXPLICOU                        │ ← eyebrow gold
│                                                              │
│   Headline em 2-3 linhas sobre o paradoxo                  │ ← H2 serif 52px
│   "fatura muito, sobra pouco".                              │
│                                                              │
│   ┌─────────────────┬─────────────────┬─────────────────┐  │
│   │  R$ 380K/mês    │   60h/semana    │    8% lucro     │  │ ← 3 stat cards
│   │  faturamento    │   trabalhadas   │   (ou menos)    │  │
│   │  médio do setor │    pelo dono    │    real         │  │
│   └─────────────────┴─────────────────┴─────────────────┘  │
│                                                              │
│   Parágrafo de 3-4 linhas com a história universal:        │
│   "Você abre cedo, fecha tarde, atende fornecedor..."      │ ← body 20px
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Layout:**
- `bg-secondary` (#15151A) — alterna do hero para criar separação
- 3 stat cards horizontais (desktop) / stack vertical (mobile)
- Stat cards: número grande em `accent-gold` (Fraunces 56px), label em `text-secondary` 14px UPPERCASE
- Cards com `border-subtle`, sem fundo, padding 32px

**Ícones:** NÃO usar emojis. Pode usar ícones lineares finos (Lucide `dollar-sign`, `clock`, `trending-down`) em `accent-gold` 24px acima de cada stat — mas opcional, números falam mais alto.

**Sem CTA aqui** — deixar a dor respirar.

---

### SEÇÃO 3 — IDENTIFICAÇÃO DO INIMIGO

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   ┌──────────────────────┬─────────────────────────────┐   │
│   │                      │                              │   │
│   │   "Não é falta       │   Parágrafo explicando      │   │ ← split 50/50
│   │    de venda.         │   por que o problema não    │   │
│   │    É falta de        │   é marketing/vendas, mas   │   │
│   │    estrutura."       │   estrutura operacional,    │   │
│   │                      │   financeira, gestão.       │   │
│   │   — pull quote       │                              │   │
│   │     serif 44px       │   Lista enxuta (3 itens):   │   │
│   │                      │   • Sem visibilidade de CMV │   │
│   │                      │   • Sem padronização        │   │
│   │                      │   • Sem delegação real      │   │
│   └──────────────────────┴─────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Layout:**
- `bg-primary`
- Split 50/50 desktop, stack mobile
- Pull quote em serif italic, com aspas grandes em `accent-gold` (font-size 96px, decorativas)
- Lista com bullets `accent-gold` pequenos (4px square, não círculo)

---

### SEÇÃO 4 — O MECANISMO: OS 12 PILARES (Centerpiece)

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   O MÉTODO ALPHA BUSINESS                                   │ ← eyebrow
│                                                              │
│   Os 12 Pilares que reconstroem                             │ ← H2 serif
│   um food business do zero.                                 │
│                                                              │
│   ┌─────┬─────┬─────┬─────┐                                │
│   │  01 │  02 │  03 │  04 │  ← Grid 4x3 desktop           │
│   │  •  │  •  │  •  │  •  │     Grid 2x6 tablet           │
│   ├─────┼─────┼─────┼─────┤     Grid 1x12 mobile          │
│   │  05 │  06 │  07 │  08 │                                │
│   │  •  │  •  │  •  │  •  │                                │
│   ├─────┼─────┼─────┼─────┤                                │
│   │  09 │  10 │  11 │  12 │                                │
│   │  •  │  •  │  •  │  •  │                                │
│   └─────┴─────┴─────┴─────┘                                │
│                                                              │
│   Cada card:                                                 │
│   ┌─────────────────────┐                                   │
│   │ 01                  │ ← número grande gold (Fraunces)  │
│   │ ─────               │ ← linha gold 24px                │
│   │ Nome do Pilar       │ ← H3 serif 24px                  │
│   │                     │                                   │
│   │ Descrição curta de  │ ← body 15px text-secondary       │
│   │ 2-3 linhas.         │                                   │
│   └─────────────────────┘                                   │
│                                                              │
│              ┌──────────────────────┐                       │
│              │   QUERO APLICAR  →   │                       │
│              └──────────────────────┘                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Layout:**
- `bg-secondary`
- Grid 4 colunas desktop (3 linhas) / 2 colunas tablet / 1 coluna mobile
- Cada card: padding 32px, `border-subtle`, hover eleva e ganha `border-gold`
- Cards SEM ícones — número + nome + descrição. Limpeza total.
- Animação: cards aparecem em stagger ao entrar no viewport (fade-up 200ms cada, delay 50ms)

**CTA #2** ✅ — Após a apresentação do método (alta intenção)

---

### SEÇÃO 5 — PROVA SOCIAL (Resultados)

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   QUEM JÁ ATRAVESSOU                                        │
│                                                              │
│   Headline: "Resultados de quem aplicou o método"          │ ← H2
│                                                              │
│   ┌────────────────────────────────────────────────────┐   │
│   │ ┌──────┐                                            │   │
│   │ │ FOTO │  Nome do Cliente · Restaurante XYZ        │   │ ← card 1
│   │ │ B&W  │  Cidade                                    │   │
│   │ └──────┘                                            │   │
│   │                                                      │   │
│   │ "Depoimento longo em 4-6 linhas com a história     │   │
│   │  específica e tangível, focando em transformação." │   │
│   │                                                      │   │
│   │  ┌─────────┬─────────┬─────────┐                   │   │
│   │  │ +R$120K │  -30h   │  3 lojas│ ← badges resultado│   │
│   │  │  lucro  │  semana │   novas │                    │   │
│   │  └─────────┴─────────┴─────────┘                   │   │
│   └────────────────────────────────────────────────────┘   │
│                                                              │
│   [Card 2]  [Card 3]  → Carousel ou stack de 3            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Layout:**
- `bg-primary`
- 3 cards horizontais grandes (não thumbnail wall — cada um respira)
- Foto do cliente em B&W (uniformiza, premium), tamanho 80x80, circular
- Quote em serif italic 22px
- Badges de resultado em `accent-gold` border + background `bg-tertiary`
- Mobile: stack vertical, full-width

**Imagens:** Fotos REAIS dos clientes em B&W. Se não tiver foto, usar inicial em círculo gold.

---

### SEÇÃO 6 — PARA QUEM É (Qualificação Positiva)

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   ┌────────────────────────┬───────────────────────────┐   │
│   │  PARA QUEM É           │   ✓  Item de qualificação 1│   │
│   │                        │   ✓  Item 2                │   │
│   │  H2 serif que          │   ✓  Item 3                │   │
│   │  contextualiza         │   ✓  Item 4                │   │
│   │  o avatar ideal.       │   ✓  Item 5                │   │
│   │                        │                            │   │
│   │  Subheadline curta.    │                            │   │
│   └────────────────────────┴───────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Layout:**
- `bg-secondary`
- Split 40/60: título à esquerda, lista à direita
- Checkmarks `accent-gold` 20px (ícone Lucide `check`)
- Cada item em 18px text-primary, espaçamento generoso (12px entre)

---

### SEÇÃO 7 — PARA QUEM NÃO É (Reverse Psychology)

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   ┌────────────────────────┬───────────────────────────┐   │
│   │  PARA QUEM NÃO É       │   ✕  Disqualifier 1        │   │
│   │                        │   ✕  Disqualifier 2        │   │
│   │  Headline direta:      │   ✕  Disqualifier 3        │   │
│   │  "Se você se           │   ✕  Disqualifier 4        │   │
│   │   identifica abaixo,   │                            │   │
│   │   não aplique."        │                            │   │
│   └────────────────────────┴───────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Layout:**
- `bg-primary`, mas com **borda lateral esquerda em `accent-fire`** (terracota) 4px — sinal visual de "filtro"
- Mesma estrutura split 40/60
- X marks em `accent-fire` (#B8472A) — único uso intencional dessa cor
- Pares com seção 6 visualmente, criando ritmo de qualificação

---

### SEÇÃO 8 — O QUE VOCÊ RECEBE (Transformação)

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   A TRANSFORMAÇÃO                                           │
│                                                              │
│   Headline: "O que muda na sua operação"                   │
│                                                              │
│   ┌──────────────┐    →    ┌──────────────┐               │
│   │   ANTES      │         │   DEPOIS     │               │ ← split antes/depois
│   │              │         │              │               │
│   │  • Caos      │         │  • Sistema   │               │
│   │  • 60h/sem   │         │  • 30h/sem   │               │
│   │  • 8% lucro  │         │  • 22% lucro │               │
│   │  • Sem time  │         │  • Time forte│               │
│   └──────────────┘         └──────────────┘               │
│                                                              │
│              ┌──────────────────────┐                       │
│              │   QUERO APLICAR  →   │                       │
│              └──────────────────────┘                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Layout:**
- `bg-secondary`
- Comparativo Antes (text-muted, dessaturado) → Seta gold central → Depois (text-primary, accent-gold para números)
- ANTES tem `border-subtle`, DEPOIS tem `border-gold`
- Foco em transformação tangível, não em "módulos do curso"

**CTA #3** ✅ — Após mostrar a transformação

---

### SEÇÃO 9 — SOBRE O MENTOR

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   ┌─────────────────┬──────────────────────────────────┐   │
│   │                 │  QUEM CONDUZ                      │   │
│   │   ┌─────────┐   │                                   │   │
│   │   │  FOTO   │   │  Nome do Mentor                   │   │ ← H2
│   │   │  PRO    │   │  Título / posicionamento          │   │
│   │   │  B&W    │   │                                   │   │
│   │   │ retrato │   │  Bio em 3-4 parágrafos com        │   │
│   │   │  4:5    │   │  trajetória, números, prova de    │   │
│   │   └─────────┘   │  autoridade no setor food.        │   │
│   │                 │                                   │   │
│   │                 │  ─── credenciais ───              │   │
│   │                 │  • +X anos no setor               │   │
│   │                 │  • +Y mentorados                  │   │
│   │                 │  • R$Z gerenciados                │   │
│   └─────────────────┴──────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Layout:**
- `bg-primary`
- Split 35/65: foto à esquerda, bio à direita
- Foto retrato editorial (4:5), B&W, alta qualidade — não selfie. Iluminação dramática lateral.
- Bio em body 18px, tom narrativo
- Credenciais como list discreta com bullets gold

---

### SEÇÃO 10 — COMO FUNCIONA (Processo)

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   COMO FUNCIONA                                             │
│                                                              │
│   ┌─────────┐ ─── ┌─────────┐ ─── ┌─────────┐             │
│   │   01    │     │   02    │     │   03    │             │ ← timeline
│   │ APLICA  │     │DIAGNÓST.│     │ COMEÇA  │             │
│   │         │     │         │     │         │             │
│   │ Texto   │     │ Texto   │     │ Texto   │             │
│   │ explica │     │ explica │     │ explica │             │
│   └─────────┘     └─────────┘     └─────────┘             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Layout:**
- `bg-secondary`
- 3 colunas conectadas por linha horizontal `accent-gold` 1px (desktop)
- Mobile: vertical, linha vertical conecta os 3
- Número grande em círculo gold outline, nome em uppercase tracking-wide, descrição em body

---

### SEÇÃO 11 — MAIS PROVA SOCIAL (Wall)

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   MAIS HISTÓRIAS                                            │
│                                                              │
│   ┌────┬────┬────┐                                         │
│   │ 01 │ 02 │ 03 │   Grid 3x2 de cards menores            │
│   ├────┼────┼────┤   com quote curta + nome + resultado   │
│   │ 04 │ 05 │ 06 │                                         │
│   └────┴────┴────┘                                         │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Layout:**
- `bg-primary`
- Grid 3 colunas, 6 cards menores
- Cada card: quote 4 linhas + nome + 1 número de resultado em `accent-gold`
- Hover: borda gold, leve elevação
- Mobile: 1 coluna

---

### SEÇÃO 12 — CTA FINAL (Closer)

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│                                                              │
│         Headline final emocional em 2 linhas,              │ ← H2 serif 56px
│         tipografia centrada e generosa.                    │   centralizado
│                                                              │
│         Subheadline de fechamento urgente mas              │
│         elegante (vagas limitadas, processo seletivo).     │
│                                                              │
│              ┌──────────────────────────┐                  │
│              │   APLICAR AGORA      →   │                  │ ← CTA grande
│              └──────────────────────────┘                  │
│                                                              │
│         ─── Aplicação analisada em 48h ───                 │ ← microcopy
│         ─── Vagas limitadas por turma ───                  │
│                                                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Layout:**
- `bg-primary` com **gradiente sutil radial** vindo do centro (gold 5% → transparent) — único uso de gradient na página, cria foco
- Centralizado, single column 720px
- CTA maior que os outros (padding 24px 56px, font-size 18px)
- Section padding extra-grande (`py-40` desktop)

**CTA #4** ✅ — O closer

---

### SEÇÃO 13 — FAQ

```
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│   PERGUNTAS FREQUENTES                                      │
│                                                              │
│   ┌──────────────────────────────────────────────┐         │
│   │  Pergunta 1?                              +  │         │ ← accordion
│   ├──────────────────────────────────────────────┤         │
│   │  Pergunta 2?                              +  │         │
│   ├──────────────────────────────────────────────┤         │
│   │  Pergunta 3?                              +  │         │
│   └──────────────────────────────────────────────┘         │
│                                                              │
│   Ainda em dúvida?                                          │
│   ┌──────────────────────┐                                  │
│   │   QUERO APLICAR  →   │   ← CTA final pós-FAQ            │
│   └──────────────────────┘                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Layout:**
- `bg-secondary`
- Accordion clean: cada item border-bottom `border-subtle`
- Padding 24px vertical
- Ícone `+` que rotaciona para `×` quando aberto, em `accent-gold`
- FAQ deve ter 6-8 perguntas (objeções + processo + investimento sem mostrar valor + garantia)

**CTA #5** ✅ — Pós-FAQ (captura quem leu até o fim)

---

### FOOTER

```
┌─────────────────────────────────────────────────────────────┐
│  [LOGO ALPHA]    Política · Termos · Contato     © 2026    │
└─────────────────────────────────────────────────────────────┘
```

Minimalista, `bg-primary`, border-top `border-subtle`. Sem links de marketing, sem newsletter — foco total na aplicação.

---

## 3. Mapa de CTAs (Distribuição Estratégica)

| # | Posição | Seção | Tipo | Justificativa |
|---|---------|-------|------|---------------|
| 1 | Nav fixa | Header | Botão pequeno persistente | Sempre visível |
| 2 | Hero | 1 | Botão principal grande | Captura intenção máxima |
| 3 | Pós-Mecanismo | 4 | Botão grande centralizado | Após "wow" do método |
| 4 | Pós-Transformação | 8 | Botão grande centralizado | Após visualização do resultado |
| 5 | CTA Final | 12 | Botão extra grande | O closer emocional |
| 6 | Pós-FAQ | 13 | Botão grande | Captura o leitor completo |

**Total: 6 pontos de conversão** distribuídos com respiração editorial. Nunca dois CTAs em seções consecutivas (cria pressão).

---

## 4. Diretrizes de Imagens & Ícones

### Imagens
- **Estilo:** B&W para fotos de pessoas (uniformiza, premium), color apenas se for foto de prato/ambiente HERO opcional
- **Proibido:** Stock photo genérico, mãos segurando café, sorrisos forçados, pratos de "marketing"
- **Permitido:** Retratos editoriais reais, mãos em ação na cozinha (B&W), ambientes vazios em B&W (mise en place)
- **Tratamento:** Todas as fotos de pessoas com mesmo grão sutil + leve vinheta para coesão

### Ícones
- **Biblioteca:** Lucide (linear, 1.5px stroke) — ÚNICA fonte
- **Uso:** Apenas em check/x marks, setas, accordion `+`, badges de credencial
- **Proibido:** Emojis, ícones coloridos, ícones decorativos em cada seção
- **Cor:** Sempre `accent-gold` ou `text-secondary`

### Logos / Selos
- Selos de credibilidade na área pós-CTA do hero: monocromáticos em `text-muted`, opacity 60%
- Sem barulho visual

---

## 5. Comportamento Responsivo

| Breakpoint | Largura | Ajustes principais |
|-----------|---------|---------------------|
| Mobile | < 640px | Single column, H1 → 44px, grids → 1 coluna, CTAs full-width, padding 24px |
| Tablet | 640-1024px | Grids 4-col → 2-col, splits 50/50 viram stack, H1 → 56px |
| Desktop | > 1024px | Layout completo conforme wireframe |
| Large | > 1440px | Container fixo 1200px, mantém respiração lateral |

---

## 6. Microinterações (Premium Touch)

1. **Cursor custom:** Pequeno círculo gold outline (8px) que cresce ao hover em CTAs
2. **Scroll reveal:** Headlines fade-up 400ms ao entrar viewport (intersection observer)
3. **Number counter:** Stats das seções 2 e 5 contam de 0 ao número real ao entrar viewport
4. **CTA hover:** translateY(-2px) + glow gold + ícone seta translateX(4px) em 200ms ease-out
5. **Pillars stagger:** Cards dos 12 pilares entram em sequência (50ms delay cada) ao scrollar
6. **Smooth scroll:** Nav CTA scrolla suavemente até o formulário/CTA final
7. **Sem parallax pesado** — manter sóbrio

---

## 7. Acessibilidade (WCAG AA)

- Contraste `text-primary` (#F5F1EA) sobre `bg-primary` (#0B0B0C) = **17.8:1** ✅ AAA
- CTA gold (#C9A961) sobre dark = **9.4:1** ✅ AAA
- Todos os CTAs com `aria-label` descritivo
- Foco visível: outline `accent-gold` 2px com offset 2px
- Accordion FAQ totalmente keyboard-navigable
- Imagens com alt text descritivo (não decorativo)
- Reduced motion respeitado: animações desabilitam com `prefers-reduced-motion`
- Hierarquia semântica: 1 H1, H2 por seção, H3 para subseções

---

## 8. Próximos Passos Sugeridos

1. **@copy-chief** preencher copy real de cada bloco (placeholders ainda genéricos)
2. **@design-chief** validar paleta com mockup visual de 1-2 seções
3. **@dev** implementar como Next.js/Astro page com Tailwind tokens definidos acima
4. **Form de aplicação:** Decidir se CTA abre modal com formulário ou redireciona para `/aplicar` (recomendo modal para não quebrar contexto)
5. **Tracking:** Eventos de analytics em cada um dos 6 CTAs para medir qual converte mais

---

**[AUTO-DECISION] Modal vs página separada para form → modal recomendado (reason: não quebra contexto emocional construído pela página long-form, reduz fricção de 1 step)**

**[AUTO-DECISION] 1 ou 2 fontes serif → apenas Fraunces (reason: simplicidade do sistema, menos peso de carregamento, Fraunces tem variants suficientes)**

**[AUTO-DECISION] Vídeo no hero → não recomendado (reason: tom premium pede silêncio editorial, vídeo de food cliché, performance mobile)**

— Uma, desenhando com empatia
