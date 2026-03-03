# BKS Design System — Guia de Uso
# Como buildar o próximo site em 30 minutos

## ESTRUTURA DE PASTAS

```
clients/
  _shared/                  ← SISTEMA (não editar por projeto)
    tokens.css              ← Todos os tokens (spacing, type, radius...)
    components.css          ← Todos os componentes reutilizáveis
    bks.js                  ← Animações e interações compartilhadas
    BRIEF-TEMPLATE.md       ← Template de briefing de cliente
    README.md               ← Este arquivo

  spHaus/
    brief.md                ← Brief preenchido
    brand.css               ← Só as cores/fonts da spHAUS (15 linhas)
    assets/
      logo.svg
    landing/
      index.html            ← Importa _shared/ + brand.css
      page.css              ← Só o layout específico desta página

  GTHouse/
    brief.md
    brand.css               ← Só as cores/fonts da GTHouse
    assets/
      logo.svg
    builds/
      index.html
      page.css

  [NovoCliente]/            ← Copie a estrutura acima
    brief.md
    brand.css
    assets/
    builds/
      index.html
      page.css
```

---

## COMO IMPORTAR NO HTML

```html
<html lang="pt-BR" data-brand="gthouse">  <!-- ← chave: data-brand -->
<head>
  <!-- 1. Tokens globais (sempre primeiro) -->
  <link rel="stylesheet" href="../../_shared/tokens.css" />

  <!-- 2. Componentes globais -->
  <link rel="stylesheet" href="../../_shared/components.css" />

  <!-- 3. Override de marca (opcional — só se precisar de algo além dos tokens) -->
  <!-- <link rel="stylesheet" href="../brand.css" /> -->

  <!-- 4. Layout específico da página -->
  <link rel="stylesheet" href="./page.css" />
</head>
<body>
  <!-- Conteúdo da página -->

  <!-- Scripts -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
  <script src="../../_shared/bks.js"></script>
  <script>
    BKS.init({
      waNumber: '5511999999999',  // WhatsApp do cliente
      formId: 'lead-form',
    });
  </script>
</body>
```

---

## COMO CRIAR UM NOVO CLIENTE — Passo a Passo

### PASSO 1 — Preencher o Brief (10 min)
```bash
cp clients/_shared/BRIEF-TEMPLATE.md clients/NovoCliente/brief.md
# Editar brief.md com as infos do cliente
```

### PASSO 2 — Adicionar o Token de Marca (2 min)
Em `clients/_shared/tokens.css`, adicionar o preset:

```css
[data-brand="novocliente"] {
  --brand-bg:           #______;
  --brand-surface:      #______;
  --brand-surface2:     #______;
  --brand-accent:       #______;  /* cor principal */
  --brand-accent2:      #______;  /* cor secundária */
  --brand-text:         #______;
  --brand-muted:        #______;
  --brand-border:       rgba(___, ___, ___, 0.07);
  --brand-accent-glow:  rgba(___, ___, ___, 0.12);
  --brand-accent-border:rgba(___, ___, ___, 0.30);
  --font-display:       'FontDisplay', serif;
  --font-body:          'FontBody', sans-serif;
}
```

### PASSO 3 — Buildar a Página (20 min)
O agente lê o brief e gera `index.html` + `page.css` do zero.

---

## COMO PASSAR A IDENTIDADE VISUAL (sem branding book)

### ✅ OPÇÃO 1 — Logo SVG/PNG
Coloque em `clients/[Cliente]/assets/logo.svg`
Me diga: *"logo está em assets/"*

### ✅ OPÇÃO 2 — Screenshot ou Imagem no Chat
Print do Instagram, site, cartão, qualquer coisa.
Eu extraio:
- Hex exato de todas as cores
- Fontes aproximadas
- Estilo geral (frio, quente, luxo, jovem...)

### ✅ OPÇÃO 3 — URL do Site Atual
Me manda a URL → eu visito, print, analiso.
Foi exatamente o que fizemos com GTHouse.

### ✅ OPÇÃO 4 — Descrição em texto
*"Fundo escuro tipo vinho, dourado como destaque, tipografia elegante"*
Eu monto a paleta e sugiro as fonts.

### ✅ OPÇÃO 5 — Referências de outros sites
*"Quero algo parecido com apple.com mas com toque de calor"*
Eu adapto a referência para o contexto do cliente.

---

## NOMENCLATURA PADRÃO (nunca desviar)

| Tipo | Classe Correta | ❌ Errado |
|------|---------------|-----------|
| Label de seção | `.section-label` | ~~section-tag, section-cat~~ |
| Título de seção | `.section-title` | ~~section-heading~~ |
| Botão principal | `.btn-primary` | ~~btn-teal, btn-white~~ |
| Botão secundário | `.btn-secondary` | ~~btn-ghost-teal, btn-outline~~ |
| Botão outline | `.btn-outline` | — |
| Card universal | `.bks-card` | ~~case-card, space-card~~ |
| Card diferencial | `.bks-diff-card` | ~~diff-card~~ |
| Revelar no scroll | `.reveal` + `.is-visible` | ~~visible, in~~ |
| Entrada hero | `.hero-enter` + `.is-visible` | ~~animate-in, visible~~ |
| Navbar scroll | `.is-scrolled` | ~~scrolled~~ |
| Menu mobile aberto | `.is-open` | ~~open, active~~ |
| WhatsApp FAB | `.bks-wa-fab` + `.is-visible` | — |
| Form status | `.bks-form__status.success/error` | — |

---

## CHECKLIST PRÉ-ENTREGA

### ✅ Visual
- [ ] Paleta só usa variáveis `--brand-*` (sem hex hardcoded no page.css)
- [ ] Máximo 2 fontes (display + body)
- [ ] Imagens com `loading="lazy"` e `alt` descritivo
- [ ] Espaçamentos usando `--sp-*` ou `var(--section-y)`

### ✅ Conversão
- [ ] CTA acima do fold
- [ ] `.bks-wa-fab` presente
- [ ] Form com UTM capture via `BKS.initForm()`
- [ ] WhatsApp como fallback do form

### ✅ Técnico
- [ ] `<html lang="pt-BR" data-brand="[slug]">`
- [ ] `<title>` único e descritivo
- [ ] `<meta description>` preenchida
- [ ] 1 único `<h1>` por página
- [ ] `prefers-reduced-motion` respeitado (via `bks.js`)

### ✅ SEO
- [ ] Open Graph tags (`og:title`, `og:description`)
- [ ] `<link rel="preconnect">` para as fonts
- [ ] Imagens com dimensões declaradas (evita CLS)
