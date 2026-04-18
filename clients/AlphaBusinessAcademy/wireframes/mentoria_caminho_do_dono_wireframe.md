# Wireframe — Mentoria "O Caminho do Dono"
## Alpha Business Academy | Mid-Fidelity v1.0

**Fidelity:** Mid-Fi → Hi-Fi ready
**Viewport base:** Desktop 1440px · Mobile 390px
**Brand:** Background #0A0A0A · Accent #C9A24A · Text #FFFFFF · Typography: Inter
**Data:** 2026-04-08

---

## ESTRUTURA GERAL DA PÁGINA

```
┌─────────────────────────────────────────────────────────────────────┐
│ S00 — NAVBAR                                                        │
├─────────────────────────────────────────────────────────────────────┤
│ S01 — HERO                              (100vh)                     │
├─────────────────────────────────────────────────────────────────────┤
│ S02 — PARA QUEM É                       (auto)                      │
├─────────────────────────────────────────────────────────────────────┤
│ S03 — PROBLEMA / DORES                  (auto)                      │
├─────────────────────────────────────────────────────────────────────┤
│ S04 — TRANSIÇÃO                         (auto)                      │
├─────────────────────────────────────────────────────────────────────┤
│ S05 — OS 12 PILARES                     (auto)                      │
├─────────────────────────────────────────────────────────────────────┤
│ S06 — COMO FUNCIONA                     (auto)                      │
├─────────────────────────────────────────────────────────────────────┤
│ S07 — DIFERENCIAL                       (auto)                      │
├─────────────────────────────────────────────────────────────────────┤
│ S08 — MENTORES                          (auto)                      │
├─────────────────────────────────────────────────────────────────────┤
│ S09 — DEPOIMENTOS (Carrossel Vídeos)    (auto)                      │
├─────────────────────────────────────────────────────────────────────┤
│ S10 — PARA QUEM É / NÃO É              (auto)                      │
├─────────────────────────────────────────────────────────────────────┤
│ S11 — FAQ                               (auto)                      │
├─────────────────────────────────────────────────────────────────────┤
│ S12 — CTA FINAL                         (auto)                      │
├─────────────────────────────────────────────────────────────────────┤
│ S13 — FOOTER                            (auto)                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## S00 — NAVBAR

```
┌─────────────────────────────────────────────────────────────────────┐
│  bg: #0A0A0A  |  height: 72px  |  position: sticky top  |  z:100   │
│                                                                     │
│  [LOGO Alpha Business]                   [QUERO APLICAR →]         │
│   (SVG, height: 32px)                   (btn: gold bg, #0A0A0A txt)│
└─────────────────────────────────────────────────────────────────────┘
```

**Anotações:**
- Logo: branco ou gold — confirmar com brand manual
- Navbar sem links de menu (página de vendas = foco total no CTA)
- Sticky: sim — botão CTA sempre visível
- Mobile: logo esquerda + botão CTA direita (mantém igual)

---

## S01 — HERO

```
┌─────────────────────────────────────────────────────────────────────┐
│  bg: #0A0A0A  |  height: 100vh  |  overflow: hidden                 │
│                                                                     │
│  [IMAGEM/VÍDEO BG — overlay escuro 60%]                             │
│  (foto de empresário — ambiente profissional, food service)         │
│                                                                     │
│                    ┌──────────────────────────┐                     │
│                    │  EYEBROW (gold, Inter     │                     │
│                    │  12px uppercase tracking) │                     │
│                    │  MENTORIA PARA NEGÓCIOS   │                     │
│                    │  DE ALIMENTAÇÃO           │                     │
│                    │                           │                     │
│                    │  H1 (white, Inter Bold    │                     │
│                    │  64px/72px desktop)       │                     │
│                    │  O Caminho                │                     │
│                    │  do Dono.                 │                     │
│                    │                           │                     │
│                    │  SUBHEADLINE (white 70%   │                     │
│                    │  Inter Regular 20px)      │                     │
│                    │  Transforme seu negócio   │                     │
│                    │  de alimentação em uma    │                     │
│                    │  operação lucrativa...    │                     │
│                    │                           │                     │
│                    │  CORPO (white 50%, 16px)  │                     │
│                    │  Se você fatura, mas não  │                     │
│                    │  vê o dinheiro no final…  │                     │
│                    │                           │                     │
│                    │  [QUERO CONHECER →]       │                     │
│                    │  (btn: gold, #0A0A0A)     │                     │
│                    │  ↳ sub: Processo seletivo │                     │
│                    │  · Vagas limitadas        │                     │
│                    └──────────────────────────┘                     │
│                                                                     │
│  ↓ scroll indicator (chevron animado, gold)                         │
└─────────────────────────────────────────────────────────────────────┘
```

**Anotações:**
- H1 quebra em 2 linhas intencionalmente — "O Caminho" linha 1, "do Dono." linha 2
- "do Dono." com ponto final — impactante, declarativo
- Botão CTA: `border-radius: 4px`, padding `16px 32px`
- Sub-CTA: texto pequeno abaixo do botão, cor branca 40%
- Background: foto real dos mentores ou ambiente Morumbi Office Tower (preferível foto real)
- Mobile: texto 40px, subheadline 16px, layout centralizado

---

## S02 — PARA QUEM É

```
┌─────────────────────────────────────────────────────────────────────┐
│  bg: #0F0F0F  |  py: 96px                                           │
│                                                                     │
│              HEADLINE (white, Inter Bold 40px)                      │
│         Esta mentoria foi feita para você que tem:                  │
│                                                                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│  │  [icon] │  │  [icon] │  │  [icon] │  │  [icon] │  │  [icon] │  │
│  │Restaur. │  │Hambur.  │  │Cafeteria│  │Lanchon. │  │  Dark   │  │
│  │         │  │         │  │         │  │         │  │ Kitchen │  │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘  │
│  (cards: bg #1A1A1A, border gold 1px, 160x160px, centered icon+txt) │
│                                                                     │
│            ─────────── divider ───────────                         │
│                                                                     │
│              HEADLINE 2 (gold, Inter SemiBold 24px)                 │
│                          E quer:                                    │
│                                                                     │
│    ✔ Aumentar o lucro de verdade                                    │
│    ✔ Organizar o negócio de uma vez                                 │
│    ✔ Ter previsibilidade financeira       (lista 2 colunas          │
│    ✔ Sair do operacional                  desktop, 1 col mobile)    │
│    ✔ Escalar com segurança                                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Anotações:**
- 5 cards de negócios: ícone line art gold + label branco
- Checkmarks: cor gold `#C9A24A`
- Lista de desejos: Inter SemiBold 18px
- Mobile: cards em scroll horizontal (2.5 visible)

---

## S03 — PROBLEMA / DORES

```
┌─────────────────────────────────────────────────────────────────────┐
│  bg: #0A0A0A  |  py: 96px                                           │
│                                                                     │
│              HEADLINE (white, Inter Bold 40px)                      │
│                 Reconhece algum desses cenários?                    │
│                                                                     │
│  ┌──────────────────────┐   ┌──────────────────────┐               │
│  │ [icon]               │   │ [icon]               │               │
│  │ Faturamento alto,    │   │ Dinheiro que Some    │               │
│  │ lucro baixo          │   │                      │               │
│  │ ─────────────────    │   │ ─────────────────    │               │
│  │ O caixa entra, mas   │   │ Você não sabe para   │               │
│  │ no fim do mês não    │   │ onde vai cada real…  │               │
│  │ sobra nada…          │   │                      │               │
│  └──────────────────────┘   └──────────────────────┘               │
│                                                                     │
│  ┌──────────────────────┐   ┌──────────────────────┐               │
│  │ [icon]               │   │ [icon]               │               │
│  │ Equipe sem autonomia │   │ Dono Preso no        │               │
│  │                      │   │ Operacional          │               │
│  │ ─────────────────    │   │ ─────────────────    │               │
│  │ Contrata com esperan.│   │ Você abriu o negócio │               │
│  │ treina no sufoco e   │   │ para ter liberdade…  │               │
│  │ perde em 3 meses…    │   │                      │               │
│  └──────────────────────┘   └──────────────────────┘               │
│                                                                     │
│  ┌──────────────────────┐   ┌──────────────────────┐               │
│  │ [icon]               │   │ [icon]               │               │
│  │ Crescimento Travado  │   │ Problemas com Sócios │               │
│  │ ─────────────────    │   │ ─────────────────    │               │
│  │ Cada vez que tenta   │   │ Conflito de visão,   │               │
│  │ escalar, algo quebra │   │ divisão mal definida │               │
│  └──────────────────────┘   └──────────────────────┘               │
│                                                                     │
│         ┌──────────────────────────────────────────────┐           │
│         │ Se você se viu em pelo menos um desses        │           │
│         │ cenários — você está no lugar certo.          │           │
│         │ (bg: gold #C9A24A · text: #0A0A0A · bold)    │           │
│         └──────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────────┘
```

**Anotações:**
- Grid: 2 colunas desktop / 1 coluna mobile
- Cards: bg `#141414`, border-left gold 3px, padding 32px
- Ícone: line art, 32px, cor gold
- Tag de fechamento: banner full-width com bg gold — alto impacto visual
- Hover nos cards: leve brilho border (gold 60% → 100%)

---

## S04 — TRANSIÇÃO

```
┌─────────────────────────────────────────────────────────────────────┐
│  bg: linear-gradient(#0A0A0A → #141414)  |  py: 80px               │
│                                                                     │
│              ╔══════════════════════════════════════╗               │
│              ║                                      ║               │
│              ║  O problema não é falta de esforço.  ║               │
│              ║  É falta de sistema.                 ║               │
│              ║                                      ║               │
│              ║  (Inter Bold 48px · white · centered)║               │
│              ╚══════════════════════════════════════╝               │
│                                                                     │
│   Donos de negócios de alimentação trabalham mais do que qualquer   │
│   um. Mas esforço sem estrutura é improviso — e improviso tem um    │
│   preço. A diferença entre o dono que escala e o que se afoga não  │
│   é talento. É método. E método se instala.                         │
│   (Inter Regular 18px · white 70% · max-width 680px · centered)    │
│                                                                     │
│         ─────── A Alpha Business existe para isso. ───────          │
│         (gold · Inter SemiBold 16px · uppercase · tracking)        │
└─────────────────────────────────────────────────────────────────────┘
```

**Anotações:**
- Seção de "respiro" — sem cards, foco total no texto
- Headline em 48px quebra intencionalmente em 2 linhas
- Sublinha final em gold como âncora visual antes dos pilares

---

## S05 — OS 12 PILARES

```
┌─────────────────────────────────────────────────────────────────────┐
│  bg: #0F0F0F  |  py: 96px                                           │
│                                                                     │
│              EYEBROW (gold, 12px uppercase)                         │
│                       O MÉTODO                                      │
│                                                                     │
│              HEADLINE (white, Inter Bold 40px)                      │
│     Os 12 Pilares de um Negócio Lucrativo e Escalável.              │
│                                                                     │
│    SUBHEADLINE (white 60%, 18px, max-width 600px, centered)         │
│    A Alpha Business é estruturada em 12 módulos que transformam     │
│    completamente o ecossistema do seu negócio.                      │
│                                                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │[icon]    01 │  │[icon]    02 │  │[icon]    03 │                 │
│  │─────────────│  │─────────────│  │─────────────│                 │
│  │Mentalidade  │  │Vendas,      │  │Liderança,   │                 │
│  │de Dono e    │  │Ticket Médio │  │Cultura e    │                 │
│  │Visão de     │  │e Cresc.     │  │Gestão de    │                 │
│  │Escala       │  │             │  │Equipe       │                 │
│  │             │  │             │  │             │                 │
│  │ descrição   │  │ descrição   │  │ descrição   │                 │
│  │ curta 2-3   │  │ curta 2-3   │  │ curta 2-3   │                 │
│  │ linhas      │  │ linhas      │  │ linhas      │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
│  (repetir grid 3x4 para 12 cards)                                   │
│                                                                     │
│   bg card: #1A1A1A · border: #2A2A2A · hover: border gold          │
│   número: gold, Inter Bold 13px, top-right                          │
│   ícone: line art, 28px, gold                                       │
│   título: white, Inter SemiBold 16px                                │
│   descrição: white 60%, Inter Regular 14px                          │
│                                                                     │
│         ┌──────────────────────────────────────────────┐           │
│         │  Quando os 12 pilares estão alinhados,        │           │
│         │  você para de ser operador e volta a ser dono.│           │
│         │  (gold italic · centered · 20px)              │           │
│         └──────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────────┘
```

**Anotações:**
- Grid: 3 colunas desktop / 2 colunas tablet / 1 coluna mobile
- Cards: mesma altura (align-items: stretch)
- Número no canto superior direito de cada card — gold, pequeno
- Hover: border-color muda de `#2A2A2A` para `#C9A24A` (transition 200ms)
- Tag final: quote em itálico — separador visual antes da próxima seção

---

## S06 — COMO FUNCIONA

```
┌─────────────────────────────────────────────────────────────────────┐
│  bg: #0A0A0A  |  py: 96px                                           │
│                                                                     │
│              EYEBROW (gold, 12px uppercase)                         │
│                    12 MESES · FOCO TOTAL                            │
│                                                                     │
│              HEADLINE (white, Inter Bold 40px)                      │
│                 Do caos ao controle.                                │
│                                                                     │
│              SUBHEADLINE (white 60%, 18px)                          │
│    Você será acompanhado durante um ano inteiro — com estrutura,    │
│    método e direção em cada fase.                                   │
│                                                                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │
│  │              │ │              │ │              │ │            │ │
│  │    [icon]    │ │    [icon]    │ │    [icon]    │ │   [icon]   │ │
│  │              │ │              │ │              │ │            │ │
│  │ Organização  │ │  Aumento de  │ │ Estruturação │ │   Escala   │ │
│  │ do Negócio   │ │    Lucro     │ │              │ │            │ │
│  │              │ │              │ │              │ │            │ │
│  │ tudo no lugar│ │ mais margem, │ │ da bagunça   │ │crescimento │ │
│  │ financeiro,  │ │ menos desp., │ │ para o       │ │ com base   │ │
│  │ op, equipe   │ │ decisões em  │ │ método       │ │  sólida    │ │
│  │ e processos. │ │ números reais│ │              │ │            │ │
│  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘ │
│                                                                     │
│  (cards: bg #141414, border-top gold 3px, padding 32px)             │
└─────────────────────────────────────────────────────────────────────┘
```

**Anotações:**
- 4 cards lado a lado desktop / 2x2 tablet / 1 coluna mobile
- Border-top gold 3px em cada card (não border completa)
- Ícone: 40px, line art gold
- Título: Inter Bold 18px white
- Descrição: Inter Regular 14px white 60%

---

## S07 — DIFERENCIAL

```
┌─────────────────────────────────────────────────────────────────────┐
│  bg: #0F0F0F  |  py: 96px                                           │
│                                                                     │
│  ┌──────────────────────┐    ┌─────────────────────────────────┐   │
│  │                      │    │                                 │   │
│  │  LADO ESQUERDO       │    │  LADO DIREITO                   │   │
│  │  (40% width)         │    │  (60% width)                    │   │
│  │                      │    │                                 │   │
│  │  A maioria das       │    │  Aqui você não recebe só        │   │
│  │  mentorias ensina    │    │  conteúdo.                      │   │
│  │  o que fazer.        │    │                                 │   │
│  │  (white 40%, 24px    │    │  Você recebe direção,           │   │
│  │   Inter Regular)     │    │  aplicação e                    │   │
│  │                      │    │  acompanhamento real.           │   │
│  │  ─────── vs ──────── │    │  (white, Inter Bold 32px)       │   │
│  │                      │    │                                 │   │
│  │  A Alpha Business    │    │  Não é curso. Não é palestra.   │   │
│  │  acompanha até isso  │    │  Não é informação solta.        │   │
│  │  virar resultado.    │    │  (white 70%, Inter Regular 18px)│   │
│  │  (gold, Inter Bold   │    │                                 │   │
│  │   24px)              │    │  É um processo de               │   │
│  │                      │    │  transformação.                 │   │
│  │                      │    │  (gold, Inter SemiBold 20px)    │   │
│  └──────────────────────┘    └─────────────────────────────────┘   │
│                                                                     │
│       (divider horizontal: linha gold 1px, 80px wide, centered)    │
│                                                                     │
│         Isso é o que separa quem aprende de quem muda de verdade.  │
│         (white 50%, italic, Inter Regular, 18px, centered)         │
└─────────────────────────────────────────────────────────────────────┘
```

**Anotações:**
- Layout split 40/60 — assimetria intencional dá dinamismo
- Mobile: stack vertical, esquerda em cima
- Linha divisória gold `#C9A24A` no desktop entre as colunas (vertical)
- Frase final em itálico: respiro antes dos mentores

---

## S08 — MENTORES

```
┌─────────────────────────────────────────────────────────────────────┐
│  bg: #0A0A0A  |  py: 96px                                           │
│                                                                     │
│              HEADLINE (white, Inter Bold 40px)                      │
│                 Quem Vai Guiar Sua Transformação                    │
│                                                                     │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  ┌────────────┐  │  │  ┌────────────┐  │  │  ┌────────────┐  │  │
│  │  │   [FOTO]   │  │  │  │   [FOTO]   │  │  │  │   [FOTO]   │  │  │
│  │  │ 280x320px  │  │  │  │ 280x320px  │  │  │  │ 280x320px  │  │  │
│  │  │ object-fit │  │  │  │ object-fit │  │  │  │ object-fit │  │  │
│  │  │   cover    │  │  │  │   cover    │  │  │  │   cover    │  │  │
│  │  └────────────┘  │  │  └────────────┘  │  │  └────────────┘  │  │
│  │                  │  │                  │  │                  │  │
│  │  Lucas Silva     │  │  José Ricardo    │  │  Robert — CFO    │  │
│  │  (gold, bold     │  │                  │  │                  │  │
│  │   18px)          │  │                  │  │                  │  │
│  │  Alpha Master    │  │  Fundador        │  │  Mentor &        │  │
│  │  Mentor          │  │  Ponto Alpha     │  │  Estrategista    │  │
│  │  (white 50%,     │  │  (white 50%,     │  │  Financeiro      │  │
│  │   12px)          │  │   12px)          │  │  (white 50%,     │  │
│  │                  │  │                  │  │   12px)          │  │
│  │  CEO da Ponto    │  │  De camelô a     │  │  Estratégia      │  │
│  │  Alpha Café.     │  │  fundador de     │  │  financeira e    │  │
│  │  Executivo de    │  │  rede com +500   │  │  governança      │  │
│  │  expansão da     │  │  lojas. Não é    │  │  para negócios   │  │
│  │  Monster Dog.    │  │  teoria — é      │  │  que querem      │  │
│  │  (white 70%,     │  │  jornada real.   │  │  crescer sem     │  │
│  │   14px)          │  │                  │  │  quebrar.        │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
│                                                                     │
│  (cards: bg #141414, sem border, padding 0, overflow hidden)        │
│  (foto ocupa topo, texto abaixo com padding 24px)                   │
└─────────────────────────────────────────────────────────────────────┘
```

**Anotações:**
- Fotos: reais, obrigatório (nenhuma foto de banco de imagem — brand restriction)
- Foto: grayscale com leve tint dourado OR colorida — definir com cliente
- Nome em gold, cargo em branco 50%
- Mobile: scroll horizontal com cards 280px width

---

## S09 — DEPOIMENTOS (Carrossel de Vídeos Stories)

```
┌─────────────────────────────────────────────────────────────────────┐
│  bg: #0F0F0F  |  py: 96px  |  overflow: hidden                      │
│                                                                     │
│              HEADLINE (white, Inter Bold 40px)                      │
│              Quem já percorreu O Caminho do Dono.                   │
│                                                                     │
│              SUBHEADLINE (white 50%, 16px)                          │
│                   Resultados reais de quem aplicou o método.        │
│                                                                     │
│  ←  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ → │
│     │         │ │         │ │         │ │         │ │         │   │
│     │  9:16   │ │  9:16   │ │  9:16   │ │  9:16   │ │  9:16   │   │
│     │ 270x480 │ │ 270x480 │ │ 270x480 │ │ 270x480 │ │ 270x480 │   │
│     │         │ │         │ │         │ │         │ │         │   │
│     │ [VIDEO  │ │ [VIDEO  │ │ [VIDEO  │ │ [VIDEO  │ │ [VIDEO  │   │
│     │PLACEHOLDER│ │PLACEHOLDER│ │PLACEHOLDER│ │PLACEHOLDER│ │PLACEHOLDER│   │
│     │  01]    │ │  02]    │ │  03]    │ │  04]    │ │  05]    │   │
│     │         │ │         │ │         │ │         │ │         │   │
│     │▶ play   │ │▶ play   │ │▶ play   │ │▶ play   │ │▶ play   │   │
│     │ (muted  │ │         │ │         │ │         │ │         │   │
│     │ autoplay│ │         │ │         │ │         │ │         │   │
│     │ loop)   │ │         │ │         │ │         │ │         │   │
│     │─────────│ │         │ │         │ │         │ │         │   │
│     │[Nome]   │ │[Nome]   │ │[Nome]   │ │[Nome]   │ │[Nome]   │   │
│     │[Negócio]│ │[Negócio]│ │[Negócio]│ │[Negócio]│ │[Negócio]│   │
│     └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
│                                                                     │
│     [● ○ ○ ○ ○]  ←── dots de paginação (gold ativo, branco inativo)│
│                                                                     │
│  Scroll behavior: drag/swipe + setas laterais ← →                  │
│  Visível desktop: 3.5 cards | tablet: 2.5 | mobile: 1.2            │
└─────────────────────────────────────────────────────────────────────┘
```

**Anotações:**
- Vídeos: formato Stories 9:16 (1080×1920px nativo)
- Player: autoplay muted + loop enquanto visível no viewport (IntersectionObserver)
- Click/tap: unmute + play com som
- Cards de vídeo: border-radius 12px, overflow hidden
- Nome: Inter SemiBold 14px white
- Negócio: Inter Regular 12px gold
- Placeholder visual: gradient dark com ícone play no centro até vídeo ser adicionado
- **PLACEHOLDER ATIVO** — substituir quando vídeos chegarem

---

## S10 — PARA QUEM É / NÃO É

```
┌─────────────────────────────────────────────────────────────────────┐
│  bg: #0A0A0A  |  py: 96px                                           │
│                                                                     │
│              HEADLINE (white, Inter Bold 40px)                      │
│                Este programa é para quem já está no jogo.          │
│                                                                     │
│  ┌──────────────────────────┐  ┌──────────────────────────┐        │
│  │  ✅ PARA QUEM É          │  │  ❌ PARA QUEM NÃO É      │        │
│  │  (bg: #0F1F0F border     │  │  (bg: #1F0F0F border     │        │
│  │   green 1px)             │  │   red 1px)               │        │
│  │                          │  │                          │        │
│  │ ✅ Dono de restaurante,  │  │ ❌ Iniciantes sem negócio│        │
│  │    hamburgueria,         │  │    rodando               │        │
│  │    cafeteria...          │  │                          │        │
│  │ ✅ Fatura, mas não vê    │  │ ❌ Quem busca atalho ou  │        │
│  │    lucro proporcional    │  │    fórmula mágica        │        │
│  │ ✅ Quer organizar,       │  │                          │        │
│  │    estruturar, escalar   │  │ ❌ Quem quer só          │        │
│  │ ✅ Busca método, não     │  │    "se inspirar"         │        │
│  │    motivação             │  │                          │        │
│  │ ✅ Disposto a mudar      │  │ ❌ Quem não está         │        │
│  │    o que precisa         │  │    disposto a executar   │        │
│  └──────────────────────────┘  └──────────────────────────┘        │
│                                                                     │
│      Por isso existe o processo seletivo. Não é para qualquer      │
│      um. É para quem está pronto.                                   │
│      (gold · Inter SemiBold · 18px · centered)                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Anotações:**
- 2 colunas lado a lado desktop / stack mobile
- Card verde: bg `rgba(0, 255, 0, 0.04)` border `rgba(0,200,0,0.2)`
- Card vermelho: bg `rgba(255, 0, 0, 0.04)` border `rgba(200,0,0,0.2)`
- Ícones ✅ ❌ substituídos por ícones customizados se necessário
- Items: Inter Regular 16px

---

## S11 — FAQ

```
┌─────────────────────────────────────────────────────────────────────┐
│  bg: #0F0F0F  |  py: 96px  |  max-width: 800px  |  mx: auto        │
│                                                                     │
│              HEADLINE (white, Inter Bold 40px, centered)            │
│                      Perguntas Frequentes                           │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ [+] O programa é online ou presencial?                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ [+] Quantos encontros por mês?                                │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ [+] É individual ou em grupo?                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ [−] Qual o investimento?              ← exemplo aberto        │  │
│  │                                                               │  │
│  │     O programa é high-ticket e seletivo. O valor é            │  │
│  │     apresentado após o processo de aplicação…                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ [+] Por que existe processo seletivo?                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ [+] Preciso ser do food service?                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ [+] Já fiz cursos e nada mudou. Por que aqui seria diferente? │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ [+] Quanto tempo leva para ver resultado?                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

**Anotações:**
- Accordion: um item aberto por vez
- Item fechado: bg `#141414`, border-bottom `#2A2A2A`, padding 24px
- Item aberto: bg `#1A1A1A`, border-left gold 3px
- [+] / [−]: ícone gold à direita do texto
- Animação: height transition 300ms ease
- Pergunta: Inter SemiBold 16px white
- Resposta: Inter Regular 15px white 70%

---

## S12 — CTA FINAL

```
┌─────────────────────────────────────────────────────────────────────┐
│  bg: linear-gradient(135deg, #0A0A0A 0%, #1A1400 100%)              │
│  py: 120px  |  text-align: center                                   │
│                                                                     │
│              HEADLINE (white, Inter Bold 52px)                      │
│         Sua empresa vai continuar dependendo de você?               │
│                                                                     │
│              CORPO (white 70%, 18px, max-width: 600px, mx: auto)    │
│   Você pode fechar essa página e voltar amanhã para o mesmo ciclo.  │
│   Ou pode tomar a decisão de instalar a estrutura que vai fazer     │
│   seu negócio funcionar — com ou sem você no balcão.               │
│                                                                     │
│              LINHA OURO (separador, 80px, mx:auto)                  │
│              ────── ◆ ──────                                        │
│                                                                     │
│   O caminho do dono não é trabalhar mais.                           │
│   É construir algo que funcione sem você em tudo.                  │
│   (white, Inter Italic, 22px)                                       │
│                                                                     │
│         ┌──────────────────────────────────────────┐               │
│         │   QUERO APLICAR PARA A MENTORIA  →       │               │
│         │   (bg: #C9A24A · text: #0A0A0A           │               │
│         │    Inter Bold 18px · padding 20px 48px   │               │
│         │    border-radius: 4px)                   │               │
│         └──────────────────────────────────────────┘               │
│                                                                     │
│    Processo seletivo · Resposta em até 48h · Vagas limitadas        │
│    (white 40%, Inter Regular 13px)                                  │
└─────────────────────────────────────────────────────────────────────┘
```

**Anotações:**
- Gradient sutil de preto para quase-dourado escuro — calor visual no fechamento
- Diamante ◆ decorativo em gold como separador
- Botão CTA: maior que qualquer outro botão da página (hierarquia visual)
- Hover: bg gold 10% mais escuro + leve sombra dourada
- Sub-CTA: linha abaixo do botão, 3 bullets separados por ·

---

## S13 — FOOTER

```
┌─────────────────────────────────────────────────────────────────────┐
│  bg: #050505  |  py: 48px                                           │
│                                                                     │
│  [LOGO Alpha Business]      © 2026 Alpha Business Academy          │
│                             Todos os direitos reservados            │
│                                                                     │
│  [Links legais opcionais: Política de Privacidade · Termos]         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## COMPONENT INVENTORY (Atomic Design)

### Atoms
| Componente | Variantes | Notas |
|------------|-----------|-------|
| Button | primary (gold), ghost (outline gold) | border-radius: 4px |
| Text | h1, h2, h3, body, caption, eyebrow | Font: Inter |
| Icon | line art 24px, 32px, 40px | gold ou white |
| Divider | horizontal, gold accent | |
| Badge | eyebrow label | uppercase + tracking |

### Molecules
| Componente | Composição | Usado em |
|------------|------------|---------|
| PillarCard | icon + number + title + description | S05 |
| PainCard | icon + title + description | S03 |
| FocusCard | icon + title + description (border-top) | S06 |
| MentorCard | photo + name + role + bio | S08 |
| VideoCard | video + name + business (9:16) | S09 |
| FAQItem | question + answer (accordion) | S11 |
| BusinessTypeCard | icon + label | S02 |

### Organisms
| Componente | Composição | Usado em |
|------------|------------|---------|
| Navbar | logo + cta button | S00 |
| HeroSection | bg + overlay + text block + cta | S01 |
| PillarsGrid | 12x PillarCard (3-col grid) | S05 |
| VideoCarousel | scroll container + VideoCards + dots | S09 |
| SplitSection | 2-col layout | S07, S10 |
| FAQAccordion | multiple FAQItems | S11 |

---

## RESPONSIVE BEHAVIOR

| Seção | Desktop (1440px) | Tablet (768px) | Mobile (390px) |
|-------|-----------------|----------------|----------------|
| S01 Hero | texto centrado | texto centrado | texto centrado, h1 40px |
| S02 Para quem | 5 cards row | scroll horizontal | scroll horizontal |
| S03 Problemas | grid 2 col | grid 2 col | 1 col stack |
| S05 Pilares | grid 3x4 | grid 2x6 | grid 1x12 |
| S06 Como funciona | 4 cards row | 2x2 grid | 1 col stack |
| S08 Mentores | 3 cards row | scroll horiz | scroll horiz |
| S09 Vídeos | 3.5 visible | 2.5 visible | 1.2 visible |
| S10 É/Não é | 2 col split | 2 col split | stack |
| S11 FAQ | max 800px | full width | full width |

---

## SPACING SYSTEM

```
Base: 4px
xs:   4px
sm:   8px
md:  16px
lg:  24px
xl:  32px
2xl: 48px
3xl: 64px
4xl: 96px
5xl: 120px

Section padding-y: 96px desktop / 64px tablet / 48px mobile
Container max-width: 1200px, padding-x: 80px desktop / 40px tablet / 20px mobile
```

---

## PENDÊNCIAS PARA PRÓXIMA FASE

- [ ] Foto/vídeo background do Hero — confirmar com cliente (mentores ou ambiente Morumbi)
- [ ] Fotos reais dos 3 mentores — placeholder ativo até receber
- [ ] Vídeos depoimentos Stories 9:16 — placeholder ativo até receber
- [ ] Número do WhatsApp para o CTA — placeholder ativo até receber
- [ ] Logo Alpha Business em SVG (versão branca e/ou gold)

---

*Alpha Business Academy — O Caminho do Dono*
*Wireframe Mid-Fi v1.0 · Uma (UX Design Expert) · 2026-04-08*
*Próximo: `*generate-ui-prompt` para gerar prompt de build no Framer/v0*
