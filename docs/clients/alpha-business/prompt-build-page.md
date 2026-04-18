# PROMPT — Build Alpha Business Application Page

## CONTEXTO
Construa uma landing page de aplicação para **Alpha Business**, mentoria premium para donos de negócios de alimentação (restaurantes, hamburguerias, cafeterias, dark kitchens).

**Objetivo da página:** Gerar desejo e qualificar o lead para aplicar à mentoria. **Sem preços exibidos.**
**CTA único:** "Quero Aplicar" / "Aplicar Agora"

---

## TECH STACK

- **HTML5** semântico (ou Next.js/Astro se em projeto React)
- **Tailwind CSS** com design tokens customizados (definidos abaixo)
- **Vanilla JS** para microinterações (intersection observer, accordion, counter)
- **Google Fonts:** Inter (300/400/500/600/700) — fonte oficial da ABA
- **Lucide Icons** (via CDN ou import)
- **Responsivo:** mobile-first, breakpoints 768px / 1024px / 1440px (alinhado com DS oficial)

---

## DESIGN TOKENS — PALETA OFICIAL ABA

> Extraído de `clients/AlphaBusinessAcademy/builds/style.css` + `design_system.html`

### CSS Custom Properties (usar como variáveis no arquivo)

```css
:root {
  /* Backgrounds */
  --bg-primary:    #06060a;
  --bg-secondary:  #0c0c14;
  --bg-card:       #111119;
  --bg-card-hover: #16161f;
  --bg-accent:     #0d0d18;
  --bg-form:       #0a0a12;

  /* Gold — cor principal da marca */
  --gold:            #c8a45c;
  --gold-light:      #d4b46e;
  --gold-dark:       #a88a42;
  --gold-glow:       rgba(200, 164, 92, 0.3);
  --gold-glow-strong:rgba(200, 164, 92, 0.5);

  /* Texto */
  --text-primary:   #f0ece4;
  --text-secondary: #a09b8f;
  --text-muted:     #6b6660;
  --text-dark:      #3a3833;

  /* Bordas */
  --border:       rgba(200, 164, 92, 0.12);
  --border-hover: rgba(200, 164, 92, 0.25);
  --border-focus: rgba(200, 164, 92, 0.5);

  /* Feedback */
  --green:    #3ecf8e;
  --green-bg: rgba(62, 207, 142, 0.08);
  --red:      #e05252;
  --red-bg:   rgba(224, 82, 82, 0.08);
}
```

### Tailwind config (se usar Tailwind)

```js
colors: {
  'bg-primary':    '#06060a',
  'bg-secondary':  '#0c0c14',
  'bg-card':       '#111119',
  'bg-card-hover': '#16161f',
  'text-primary':  '#f0ece4',
  'text-secondary':'#a09b8f',
  'text-muted':    '#6b6660',
  'gold':          '#c8a45c',
  'gold-light':    '#d4b46e',
  'gold-dark':     '#a88a42',
  'accent-red':    '#e05252',
  'accent-green':  '#3ecf8e',
},
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
},
```

**Nota tipográfica crítica:** ABA usa Inter em pesos **800–900 para headlines** (H1/H2) e 400–600 para body. Sem Fraunces, a hierarquia visual depende 100% do peso — nunca usar font-bold (700) em headlines. Use `font-extrabold` (800) ou `font-black` (900) conforme especificado por seção.

---

## COMPONENTE REUTILIZÁVEL: BOTÃO CTA

```html
<!-- Gradiente oficial ABA: gold #c8a45c → gold-dark #a88a42 -->
<button class="cta-btn font-sans font-bold px-10 py-5 rounded-[10px] text-[15px] tracking-[0.08em]
               text-[#06060a] transition-all duration-200 ease-out
               hover:-translate-y-0.5 active:scale-[0.98]
               flex items-center gap-2 group"
        style="background: linear-gradient(135deg, #c8a45c, #a88a42);
               box-shadow: 0 0 0 1px rgba(200,164,92,0.3), 0 20px 40px -12px rgba(200,164,92,0.25);">
  Quero Aplicar
  <svg class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
       ... /> <!-- Lucide arrow-right -->
</button>
```

---

## ESTRUTURA COMPLETA DA PÁGINA

---

### [NAV FIXA]

```
background: bg-primary, border-bottom: border-subtle, position: fixed top-0, z-50
padding: 16px 80px (desktop) / 16px 24px (mobile)
justify-content: space-between

LEFT: Logo Alpha Business (text ou SVG, text-primary, font-sans font-bold, 20px)
RIGHT: CTA botão menor (padding 12px 24px, font-size 14px)
```

---

### SEÇÃO 1 — HERO

**Layout:** Full-bleed, bg-primary, centralizado, max-width 720px, min-height 100vh, padding-top 120px (offset nav)

**Elementos (de cima para baixo):**

```
EYEBROW — PÍLULA (padrão DS oficial)
texto: "Para donos de negócios de alimentação"
estilo: inline-flex, border border-gold/30, bg-gold/5, rounded-full, px-4 py-1.5
        font-sans text-xs font-semibold uppercase tracking-[0.12em] text-gold (#c8a45c), mb-8

H1 (2 linhas)
linha 1: "Você construiu um negócio que fatura."
linha 2: "Agora chegou a hora de construir um que lucra — e funciona sem você."
estilo: font-black (900), text-[clamp(2.2rem,6vw,4.2rem)] leading-[1.08], text-primary, mb-6

SUBHEADLINE
texto: "A Alpha Business é a única mentoria de negócios de alimentação que acompanha você durante 12 meses até transformação virar resultado real — não só conteúdo."
estilo: font-sans font-light (300), text-[20px], text-secondary, leading-[1.55], mb-10, max-w-[600px] mx-auto

CTA BOTÃO #1 (centralizado)
texto: "Quero Aplicar para a Mentoria"

MICROCOPY (abaixo do botão)
texto: "Vagas limitadas. Seleção por aplicação."
estilo: text-muted, text-sm, mt-3

PROOF BAR — avatares sobrepostos + contador (padrão DS oficial)
Layout: flex row, items-center, gap-3, border-top border-subtle, pt-8, mt-12
- Avatares: 3-5 fotos circulares 32px B&W, sobrepostas (-ml-2 a partir do 2º), border-2 border-bg-primary
- Texto: "+200 donos já transformaram seus negócios"
  font-sans text-sm text-secondary
- Separador vertical ·
- "Setor food exclusivo" text-muted text-xs
```

**Background:** bg-primary com pseudoelemento `::before` — radial-gradient(ellipse 600px 400px at 50% 30%, rgba(201,169,97,0.04) 0%, transparent 70%). Cria brilho sutil atrás do H1.

---

### SEÇÃO 2 — AMPLIFICAÇÃO DA DOR

**Layout:** bg-secondary, py-32 desktop / py-20 mobile, max-width 960px centralizado

```
EYEBROW: "O PARADOXO QUE NINGUÉM TE EXPLICOU" — gold (#c8a45c), uppercase, tracking-widest

H2:
"Você fatura. Mas no final do mês, o dinheiro sumiu."
font-extrabold (800), text-[52px] leading-[1.1], text-primary, mb-16
mobile: text-[36px]

3 STAT CARDS (grid 3 colunas / mobile: 1 coluna)
Cada card: border border-subtle, p-8, bg-card (#111119), rounded-2xl

Card 1:
  número: "60h" — font-black (900), text-[56px], gold (#c8a45c), sem italic
  label: "POR SEMANA" — uppercase, text-xs, tracking-wide, text-secondary
  descr: "trabalhadas pelo dono" — text-sm, text-muted

Card 2:
  número: "8%" — font-black (900), text-[56px], gold (#c8a45c), sem italic
  label: "MARGEM REAL"
  descr: "lucro médio do setor no Brasil"

Card 3:
  número: "0" — font-black (900), text-[56px], gold (#c8a45c), sem italic
  label: "DIAS DE FOLGA"
  descr: "sem o negócio travar"

CORPO (abaixo dos cards, max-width 640px)
Parágrafos confessionais (1 por linha, espaçamento generoso):

"Você faturou bem esse mês. Mas quando olhou para o extrato no final… o dinheiro tinha sumido."

"Você trabalha mais de 12 horas por dia — e se ficar um dia fora, tudo trava."

"Você tem funcionários, mas ainda é você que resolve tudo: falta de ingrediente, briga na equipe, cliente reclamando."

"Você quer crescer. Mas abrir mais uma unidade do jeito que está hoje parece impossível."

"Você já sabe que o problema não é falta de cliente. O problema é que o negócio não está estruturado para crescer."

FECHAMENTO em destaque:
"Se você acenou com a cabeça para qualquer um desses pontos — você está no lugar certo."
estilo: font-sans font-bold italic, text-[22px], text-primary, border-left-4 border-gold (#c8a45c), pl-6, mt-10
```

**JS:** Intersection Observer nos 3 números — animar counter de 0 ao valor real ao entrar viewport (duration 1500ms, easing ease-out).

---

### SEÇÃO 3 — IDENTIFICAÇÃO DO INIMIGO

**Layout:** bg-primary, py-32, grid 2 colunas 50/50 (mobile: stack), gap-16

```
COLUNA ESQUERDA (pull quote):
  Aspas decorativas: font-sans font-bold, text-[120px], color gold (#c8a45c), opacity-20, line-height 0, mb-4
  Texto: "Não é falta de venda. É falta de estrutura."
  estilo: font-black (900), text-[44px] leading-[1.1], text-primary italic
  mobile: text-[32px]

COLUNA DIREITA (corpo + lista):
  Parágrafo:
  "A escola te ensinou a cozinhar. A franquia te ensinou a operar. Mas ninguém te ensinou a gerir, estruturar e escalar um negócio de alimentação.

  Você aprendeu tudo no improviso. E o improviso tem um teto.

  A boa notícia: isso tem solução. Não é sorte, não é talento — é estrutura."
  estilo: font-sans, text-[18px], text-secondary, leading-[1.6], mb-8

  LISTA (3 itens, sem bullets padrão):
  • Sem visibilidade real do CMV e da margem
  • Sem padronização que funcione sem você
  • Sem estrutura de delegação real
  estilo: cada item com quadrado gold (#c8a45c) 4px à esquerda, pl-4, text-primary, text-[17px], gap-3
```

---

### SEÇÃO 4 — OS 12 PILARES (Mecanismo)

**Layout:** bg-secondary, py-32

```
EYEBROW: "O MÉTODO ALPHA BUSINESS" — gold (#c8a45c)
H2: "Os 12 Pilares que reconstroem um food business do zero."
  font-extrabold (800), text-[52px], mb-4, mobile: text-[36px]
SUBHEADLINE: "Não são 12 módulos de conteúdo. São 12 alavancas reais que, quando ativadas, transformam como seu negócio funciona."
  text-secondary, text-[18px], mb-16, max-w-[640px]

GRID 12 PILARES (4 colunas / 2 colunas tablet / 1 coluna mobile):
Cada card: bg-card (#111119) border border-subtle p-8 rounded-2xl transition-all cursor-default
           hover:border-gold/50 hover:bg-card-hover

  Número: font-black (900), text-[3rem], color gold/10 (watermark, rgba(200,164,92,0.1))
          group-hover: color gold/25 — transição suave 300ms
          leading-none mb-3
  Nome: font-extrabold (800), text-[18px] text-primary mb-2
  Descrição: font-sans text-[15px] text-secondary leading-[1.55]

CONTEÚDO DOS 12 CARDS:
01 | Mentalidade de Dono | Você para de operar e começa a liderar o crescimento.
02 | Vendas e Ticket Médio | Mais faturamento com estratégia — não no improviso.
03 | Liderança e Equipe | Time produtivo, alinhado e com metas claras.
04 | Gestão de Lucro e CMV | Você sabe exatamente para onde vai cada real.
05 | Estrutura Tributária | Menos imposto, mais proteção e segurança.
06 | Posicionamento e Marca | Você para de competir por preço.
07 | Operação e Padronização | Mais eficiência, menos desperdício, margem maior.
08 | Delegação e Estrutura | O negócio funciona sem você no centro de tudo.
09 | Modelo Escalável | Pronto para rede, franquia ou licenciamento.
10 | Sociedades e Parcerias | Crescimento com sócios — sem conflito e sem prejuízo.
11 | Gestão por Indicadores | Decisões com base em dados, não em achismo.
12 | Execução e Escala | Estratégia que se transforma em resultado real.

DESTAQUE (bloco abaixo do grid, bg-card (#111119), border-l-4 border-gold (#c8a45c), p-8):
"A maioria das mentorias te ensina o que fazer."
"A Alpha Business acompanha você até isso virar resultado."
font-sans font-bold, text-[24px] / text-[28px], text-primary, max-w-[600px] mx-auto text-center

CTA BOTÃO #2 (centralizado, mt-12)
```

**JS:** Cards entram em stagger ao entrar viewport — fade-up + opacity 0→1, delay 50ms por card.

---

### SEÇÃO 5 — PROVA SOCIAL #1

**Layout:** bg-primary, py-32, max-width 960px

```
EYEBROW: "QUEM JÁ ATRAVESSOU"
H2: "Resultados de quem aplicou o método"
  font-extrabold (800), text-[48px], mb-16

3 CARDS GRANDES (grid 1 coluna, gap-8 — cada card respira):
Cada card: border border-subtle p-10 rounded-2xl bg-card (#111119)

  Topo: foto circular 80px B&W + nome (font-sans 600 text-primary 18px) + tipo/cidade (text-secondary 14px)
  Quote: font-sans font-bold italic text-[22px] text-primary leading-[1.5] mb-6
         (aspas " antes do texto, cor gold (#c8a45c))
  BADGES de resultado (3 por card, flex row):
    cada badge: border border-gold (#c8a45c)/40 bg-card (#111119) px-4 py-2 rounded text-gold (#c8a45c) text-sm font-semibold

PLACEHOLDER (preencher com depoimentos reais):
  Card 1: [foto] [Nome] · Restaurante · Cidade | "Depoimento com história e números reais." | [Badge resultado 1] [Badge 2] [Badge 3]
  Card 2: idem
  Card 3: idem
```

---

### SEÇÃO 6 — PARA QUEM É / NÃO É (lado a lado — padrão DS oficial)

**Layout:** bg-secondary, py-32, max-width 1040px
**Estrutura:** Título centralizado + grid 2 colunas iguais abaixo (mobile: stack)

```
TÍTULO CENTRALIZADO (acima do grid):
  EYEBROW: "QUALIFICAÇÃO"
  H2: "Esta mentoria é para você?"
  font-extrabold (800), text-[48px], text-primary, text-center, mb-12

GRID 2 COLUNAS (gap-6, mobile: 1 coluna):

COLUNA ESQUERDA — "É PARA VOCÊ":
  background: rgba(62, 207, 142, 0.08) — green-bg do DS
  border: 1px solid rgba(62, 207, 142, 0.2)
  border-radius: rounded-2xl
  padding: p-8

  Header:
    Lucide check-circle 24px, color #3ecf8e
    Título: "Para você se…" — font-extrabold (800), text-[20px], text-primary, ml-3

  Lista (gap-4, mt-6):
  Check icon (Lucide check, 18px, #3ecf8e)
  Texto (font-sans text-[16px] text-primary, leading-[1.5])

  ✓ Tem um negócio de alimentação em operação (restaurante, hamburgueria, cafeteria, lanchonete, dark kitchen)
  ✓ Fatura, mas não consegue transformar faturamento em lucro real
  ✓ Quer sair do operacional e ter um negócio que funciona sem você no centro
  ✓ Está disposto a mudar a forma como gere o negócio — não só trabalhar mais
  ✓ Quer crescer com segurança: mais unidades, franquia ou escala sem caos

COLUNA DIREITA — "NÃO É PARA VOCÊ":
  background: rgba(224, 82, 82, 0.08) — red-bg do DS
  border: 1px solid rgba(224, 82, 82, 0.2)
  border-radius: rounded-2xl
  padding: p-8

  Header:
    Lucide x-circle 24px, color #e05252
    Título: "Não é para você se…" — font-extrabold (800), text-[20px], text-primary, ml-3

  Lista (gap-4, mt-6):
  X icon (Lucide x, 18px, #e05252)
  Texto (font-sans text-[16px] text-secondary, leading-[1.5])

  ✕ Quer resultado sem mudar nada na forma como gere o negócio
  ✕ Quer só conteúdo para assistir quando der
  ✕ Ainda não tem um negócio em operação
  ✕ Não está disposto a ser acompanhado e cobrado de perto

FECHAMENTO (abaixo do grid, centralizado, max-w-[560px]):
"Essa mentoria é para quem está pronto para levar o negócio a outro nível — e entende que isso exige comprometimento real."
font-sans italic text-[18px] text-secondary text-center mt-8
```

**Mobile:** colunas em stack vertical, "Para você" aparece primeiro, depois "Não é para você".

---

### SEÇÃO 8 — O QUE VOCÊ RECEBE (Transformação)

**Layout:** bg-secondary, py-32, max-width 960px

```
EYEBROW: "A TRANSFORMAÇÃO"
H2: "O que muda na sua operação"
  font-extrabold (800), text-[48px], mb-16

COMPARATIVO ANTES/DEPOIS (grid 2 colunas com seta central):

ANTES (coluna esquerda):
  header: "ANTES" — uppercase, text-muted, tracking-wide, text-sm
  border: border border-subtle
  padding: p-8
  lista de 5 itens com bullet quadrado text-muted:
  · Caos operacional diário
  · 60h+ por semana no negócio
  · 6-8% de margem real
  · Equipe depende de você
  · Crescimento travado

SETA CENTRAL: Lucide arrow-right, 32px, gold (#c8a45c), self-center
Mobile: Lucide arrow-down, 32px, gold (#c8a45c), centralizado entre os dois blocos (seta rotaciona 90deg)

DEPOIS (coluna direita):
  header: "DEPOIS" — uppercase, gold (#c8a45c), tracking-wide, text-sm
  border: border border-gold
  padding: p-8
  background: bg-card (#111119)
  lista de 5 itens com check gold (#c8a45c):
  ✓ Operação estruturada e padronizada
  ✓ Negócio funciona sem você no centro
  ✓ 20-25% de margem possível
  ✓ Time com metas e autonomia
  ✓ Escala com segurança real

ENTREGÁVEIS (abaixo do comparativo, lista com checks gold):
Título: "O que você recebe durante os 12 meses:"
font-sans font-bold text-[28px] mb-8

✔ Diagnóstico 1:1 no início — mapeamos onde seu negócio está e o que muda primeiro
✔ Os 12 Pilares aplicados ao SEU negócio — não teoria genérica
✔ Acompanhamento mensal — reuniões para garantir execução e ajustes de rota
✔ Acesso direto ao mentor — para decisões e dúvidas do dia a dia
✔ Comunidade de donos do setor — troca com quem entende o seu negócio
✔ Suporte na execução — você não anda sozinho

Estilo lista: cada item font-sans text-[18px] text-primary, check icon gold (#c8a45c) 20px, gap-4 entre itens

CTA BOTÃO #3 (centralizado, mt-12)
```

---

### SEÇÃO 9 — SOBRE O MENTOR

**Layout:** bg-primary, py-32, grid 2 colunas 35/65 (mobile: stack), gap-16, max-width 960px

```
COLUNA ESQUERDA:
  Foto retrato editorial (proporção 4:5)
  border-radius: 4px
  filtro: grayscale(100%) contrast(1.1)
  placeholder: [FOTO REAL DO MENTOR]

COLUNA DIREITA:
  EYEBROW: "QUEM CONDUZ" — gold (#c8a45c), uppercase
  H2: [Nome do mentor]
     font-extrabold (800), text-[44px] text-primary mb-2
  Subtítulo: [Especialista em gestão de negócios de alimentação]
     font-sans text-secondary text-[18px] mb-8

  Bio (3-4 parágrafos — PREENCHER COM DADOS REAIS):
  font-sans text-[18px] text-secondary leading-[1.6] mb-8

  Credenciais (lista compacta, border-top border-subtle pt-6):
  · +X anos no setor de alimentação
  · +Y mentorados acompanhados
  · Fundador de [negócio(s) próprio(s)]
  · [Credencial adicional relevante]
  estilo: text-[15px] text-secondary, bullet gold (#c8a45c) 4px, gap-3
```

---

### SEÇÃO 10 — COMO FUNCIONA

**Layout:** bg-secondary, py-32, max-width 960px

```
EYEBROW: "O PROCESSO"
H2: "Como funciona a seleção"
  font-extrabold (800), text-[48px] mb-16

TIMELINE 3 PASSOS (grid 3 colunas desktop / stack mobile):
Linha conectora horizontal gold (#c8a45c) 1px entre os círculos (desktop only)

Cada passo:
  Círculo numerado: 64px, border 2px gold (#c8a45c), flex center
    Número: font-sans font-bold text-[28px] gold (#c8a45c)
  Nome: uppercase tracking-wide font-sans font-semibold text-primary text-[14px] mt-4 mb-2
  Descrição: font-sans text-[17px] text-secondary leading-[1.55]

PASSO 1: "VOCÊ APLICA"
Descrição: "Preenche o formulário de aplicação. Leva menos de 5 minutos."

PASSO 2: "DIAGNÓSTICO"
Descrição: "Se o seu perfil for compatível, agendamos uma conversa 1:1 para entender seu negócio."

PASSO 3: "VOCÊ COMEÇA"
Descrição: "Aprovado, você começa com o diagnóstico completo e seu plano personalizado."

NOTA DE ESCASSEZ (abaixo, centralizado, bg-card (#111119) border border-subtle p-6 rounded):
"Trabalhamos com número limitado de mentorados por turma para garantir qualidade de acompanhamento."
font-sans italic text-[16px] text-secondary text-center

CTA BOTÃO #4 (centralizado, mt-8)
```

---

### SEÇÃO 11 — PROVA SOCIAL #2

**Layout:** bg-primary, py-32, max-width 960px

```
EYEBROW: "MAIS HISTÓRIAS"
H2: "Mais resultados de quem já aplicou o método"
  font-extrabold (800), text-[44px] mb-12

GRID 3x2 DE CARDS MENORES (6 cards):
grid 3 colunas desktop / 1 coluna mobile
Cada card: border border-subtle p-6 hover:border-gold transition-all

  Quote: font-sans font-bold italic text-[17px] text-primary leading-[1.5] mb-4
         (máx 4 linhas)
  Rodapé: foto circular 40px B&W + nome text-[14px] font-semibold text-primary
          + resultado em badge gold (#c8a45c) text-[12px]

PLACEHOLDER: [6 depoimentos curtos com resultado numérico específico]
```

---

### SEÇÃO 12 — CTA FINAL

**Layout:** bg-primary, py-40, centralizado, max-width 720px
**Background especial:** radial-gradient(ellipse 800px 500px at 50% 50%, rgba(201,169,97,0.06) 0%, transparent 70%)

```
H2 (2 linhas, centralizado):
"Seu negócio pode ser diferente."
"A decisão começa aqui."
font-black (900), text-[56px] leading-[1.05] text-primary mb-6
mobile: text-[40px]

CORPO (centralizado, max-w-[560px]):
"Você pode continuar como está: trabalhando muito, faturando, e vendo o dinheiro sumir.

Ou pode decidir agora construir um negócio que lucra, que funciona sem você no centro — e que está pronto para crescer do jeito certo.

A Alpha Business existe para quem escolhe o segundo caminho."

font-sans text-[19px] text-secondary leading-[1.6] mb-12

CTA BOTÃO #5 (grande, padding 24px 56px, font-size 18px)
texto: "Aplicar para a Alpha Business"

MICROCOPY (abaixo, flex row centralizado gap-6):
"· Vagas limitadas por turma"
"· Seleção por diagnóstico 1:1"
estilo: text-muted text-sm
```

---

### SEÇÃO 13 — FAQ

**Layout:** bg-secondary, py-32, max-width 760px centralizado

```
EYEBROW: "DÚVIDAS FREQUENTES"
H2: "Perguntas frequentes"
  font-extrabold (800), text-[44px] mb-12

ACCORDION (6 itens):
Cada item: border-bottom border-subtle py-6
  Header (flex justify-between items-center cursor-pointer):
    Pergunta: font-sans font-semibold text-[18px] text-primary
    Ícone: Lucide plus (20px, gold (#c8a45c)) → rotaciona 45deg quando aberto
  Resposta (collapse animado, max-height transition):
    font-sans text-[17px] text-secondary leading-[1.6] pt-4

PERGUNTAS E RESPOSTAS:

P1: "Preciso ter quanto de faturamento para entrar?"
R: "Trabalhamos com negócios em operação. Se você já tem o negócio funcionando e quer estruturá-lo para crescer, faz sentido conversar."

P2: "É um curso gravado?"
R: "Não. É mentoria com acompanhamento real durante 12 meses. Tem conteúdo, mas o foco é execução e resultado — não apenas aprendizado."

P3: "Quanto tempo vou precisar dedicar?"
R: "A mentoria se encaixa na sua rotina de dono. Não exige que você pare o negócio — exige que você aplique o método no seu negócio."

P4: "E se eu não tiver resultado?"
R: "Nossa abordagem é acompanhar até virar resultado. Por isso fazemos seleção — queremos mentorados comprometidos com a mudança."

P5: "Funciona para qualquer tipo de food business?"
R: "Funciona para restaurantes, hamburguerias, cafeterias, lanchonetes e dark kitchens. O método foi construído especificamente para o setor de alimentação."

P6: "Como sei se é para mim?"
R: "Aplica. O diagnóstico 1:1 vai deixar claro se faz sentido para o seu momento — sem compromisso."

CTA BOTÃO #6 (centralizado, mt-12)
texto: "Ainda em dúvida? Aplique e descubra."
```

---

### STICKY CTA — MOBILE ONLY

**Visível apenas em mobile (< 768px), position: fixed bottom-0, full-width, z-50**

```
background: linear-gradient(to top, #06060a 60%, transparent)
padding: 16px 24px 24px (extra-bottom para safe-area)

CTA BOTÃO (full-width, w-full):
texto: "Quero Aplicar"
mesmo estilo do botão padrão, width: 100%

Aparece após scroll de 300px da página
Desaparece quando o CTA final (seção 12) está visível no viewport
(IntersectionObserver no CTA final para toggle)
```

---

### FOOTER

**Layout:** bg-primary, border-top border-subtle, py-8, px-80 desktop / px-24 mobile

```
flex justify-between items-center (mobile: stack, gap-4)

LEFT: Logo Alpha Business (text-muted opacity-60, text-sm)
CENTER: "Política de Privacidade · Termos de Uso · Contato" (text-muted text-sm gap-4)
RIGHT: "© 2026 Alpha Business. Todos os direitos reservados." (text-muted text-xs)
```

---

## JS — MICROINTERAÇÕES

```js
// 1. Scroll reveal (todas as seções)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible')
    }
  })
}, { threshold: 0.1 })

document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

// CSS: .reveal { opacity:0; transform:translateY(24px); transition:all 400ms ease }
//      .reveal.visible { opacity:1; transform:translateY(0) }

// 2. Number counter (stat cards seção 2)
function animateCounter(el, target, duration = 1500) {
  let start = 0
  const step = target / (duration / 16)
  const timer = setInterval(() => {
    start += step
    if (start >= target) { el.textContent = target; clearInterval(timer); return }
    el.textContent = Math.floor(start)
  }, 16)
}

// 3. Pillars stagger (seção 4)
const pillars = document.querySelectorAll('.pillar-card')
pillars.forEach((card, i) => {
  card.style.transitionDelay = `${i * 50}ms`
})

// 4. Sticky CTA mobile (aparecer após 300px scroll)
const stickyCTA = document.querySelector('.sticky-cta-mobile')
const finalCTA = document.querySelector('.cta-final')
window.addEventListener('scroll', () => {
  stickyCTA.classList.toggle('visible', window.scrollY > 300)
})
new IntersectionObserver(([e]) => {
  stickyCTA.classList.toggle('hidden', e.isIntersecting)
}).observe(finalCTA)

// 5. Reduced motion — desabilitar todas as animações
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--transition-duration', '0ms')
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'))
}

// 6. Accordion FAQ (seção 13)
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-trigger').addEventListener('click', () => {
    const isOpen = item.classList.contains('open')
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'))
    if (!isOpen) item.classList.add('open')
  })
})
```

---

## REGRAS DE EXECUÇÃO

1. **Sem preços em nenhuma seção** — zero menção a valores
2. **Tom:** Sério, direto, premium. Zero hype, zero emojis decorativos no corpo
3. **Imagens:** Todas em B&W. Se não houver foto real, usar placeholder com instrução clara
4. **Fonte única para CTA:** Apenas "Quero Aplicar" / "Aplicar para a Alpha Business" — sem variações de ação
5. **6 CTAs desktop + 1 sticky mobile** — não adicionar nem remover
6. **Rodapé minimalista** — não colocar links de redes sociais ou outros produtos
7. **Acessibilidade:** 1 H1, H2 por seção, aria-labels nos CTAs, focus visível em `outline: 2px solid #c8a45c; outline-offset: 2px`
8. **Formulário:** CTA abre modal com form de aplicação (NÃO redirecionar para outra página)
9. **Reduced motion:** Todas as animações devem respeitar `prefers-reduced-motion: reduce` — desabilitar transitions, transforms e counters quando ativo

---

## PENDÊNCIAS (preencher antes de publicar)

- [ ] Foto real do mentor (retrato editorial B&W, proporção 4:5)
- [ ] 3 depoimentos longos com números reais (seção 5)
- [ ] 6 depoimentos curtos com resultado numérico (seção 11)
- [ ] Bio completa do mentor (seção 9)
- [ ] Números reais para selos de credibilidade (hero)
- [ ] Campos do formulário de aplicação (modal)
- [ ] Link de integração do form (Typeform, HubSpot, ou webhook)
