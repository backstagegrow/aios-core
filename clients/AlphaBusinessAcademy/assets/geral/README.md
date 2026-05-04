# Alpha Business Academy — Design System

> **Brand:** Alpha Business Academy (ABA) — uma aceleradora de negócios focada em **Food Service** e **PMEs**.
> **Product in scope:** Landing Page de Vendas da Imersão **"O Caminho do Dono"**.
> **Mentor principal:** Lucas Silva.
> **Promessa:** transformar o dono de *"escravo da operação"* em **"CEO de Elite"** através de **12 pilares estratégicos**.
> **Mood:** **Elite / Premium** — preto profundo, dourado nobre, fotografia editorial, tipografia serifada de luxo.

---

## Index

| File / Folder                  | What it is                                                              |
| ------------------------------ | ----------------------------------------------------------------------- |
| `README.md`                    | This file. Brand context, content & visual foundations, manifest.       |
| `SKILL.md`                     | Agent skill manifest — invoke this from Claude Code or design tools.    |
| `colors_and_type.css`          | All color & typography CSS variables + semantic classes.                |
| `assets/`                      | Logos, mentor portraits, hero imagery.                                  |
| `preview/`                     | Design-system preview cards (rendered in the Design System tab).        |
| `ui_kits/landing/`             | Imersão sales landing-page UI kit (React JSX components + index.html).  |
| `slides/`                      | _Not created — no slide template was provided._                         |

---

## Sources reviewed

| Source                                  | Status                                                                  |
| --------------------------------------- | ----------------------------------------------------------------------- |
| Brand brief (chat)                      | ✅ Used — colors, mentor, promessa, 12 pilares.                          |
| `uploads/Design sem nome.png`           | ✅ Used as the official ABA logo (laurel + grad-cap shield, gold/black). |
| `uploads/hero_transformation.jpg`       | ✅ Used as the hero "antes vs depois" editorial photo.                   |
| `uploads/Lucas silva.webp`              | ✅ Mentor principal portrait.                                            |
| `uploads/Jose ricardo.webp`             | ✅ Convidado / mentor portrait.                                          |
| `uploads/Robert.webp`                   | ✅ Convidado / mentor portrait.                                          |
| `uploads/*.mp4` (videos de depoimento)  | ⚠️ **Apenas `Vinícius - Franqueado.mp4` chegou ao filesystem** — os outros (Marcio, Débora, Criativos ABA) não vieram. Ver "Caveats". |
| GitHub `backstagegrow/Imers-o-Aba`      | ❌ Inacessível (`409` do GitHub — repo provavelmente vazio ou sem permissão). Pedimos ao usuário para reconectar se quiser que o sistema seja calibrado em cima do código real. |

---

## Content Fundamentals

### Voice & tone
- **Idioma:** Português brasileiro, vocativo de empreendedor.
- **Pessoa:** **"Você"** (nunca "tu", quase nunca "vocês"). O leitor é tratado como **dono de negócio**, não como aluno genérico.
- **Tom:** **direto, confrontacional, aspiracional**. ABA não conforta — provoca. Linha-mestra: *"Pare de ser o escravo da sua operação."*
- **Autoridade:** o copy é assinado pela voz do mentor (Lucas Silva). Ele fala como quem **já passou pelo problema** e construiu a saída.
- **Sem fofura.** Sem *"jornada incrível"*, *"vamos juntos"*, *"venha fazer parte"*. Em vez disso: *"Aplique."* / *"Decida."* / *"Pare de fingir que está tudo bem."*

### Casing & punctuação
- Headlines em **Title Case** ou **frase com a palavra-chave em destaque dourado** (ex.: *"O Caminho do **Dono**"*).
- **Eyebrows** (sobre-títulos) sempre em **CAIXA ALTA** com tracking largo (`letter-spacing: 0.28em`).
- Números das aulas/pilares grafados com **algarismos romanos** ou **dois dígitos** (`I. II. III.` ou `01 / 12`) — reforça a estética acadêmica de elite.
- Pontuação curta. Frases de no máximo 12 palavras nos blocos de impacto.

### Vocabulário canônico
| Sempre usar                         | Evitar                              |
| ----------------------------------- | ----------------------------------- |
| Dono, CEO, operador, líder          | "Pessoal", "galera", "amigo"        |
| Imersão, Mentoria, Pilar, Caminho   | "Curso", "treinamento", "aulinha"   |
| Faturamento, margem, escala, processo | "Sucesso", "prosperidade"          |
| Aplicar, decidir, executar          | "Tentar", "buscar", "pensar"        |
| Food Service, PME, operação         | "Empreendedorismo" (genérico)       |

### Emoji
- **Não.** Emoji **não** são usados em headlines, CTAs, ou copy estrutural. A estética é editorial/luxo — emoji quebra o tom.
- Aceitável apenas em depoimentos transcritos *literais* de WhatsApp dos alunos, dentro de aspas.

### Exemplos de copy on-brand

> **Eyebrow:** IMERSÃO PRESENCIAL · 3 DIAS
> **Headline:** O Caminho do **Dono**.
> **Subhead:** Pare de operar. Comece a liderar. 12 pilares para transformar você de escravo da operação em CEO de elite.
> **CTA:** Garantir minha vaga →

> **Pilar III — Decisão sob pressão.**
> O dono que terceiriza decisão constrói uma operação que não para de pedir socorro. Aqui você aprende a decidir em 90 segundos — com método, não com ego.

> **Bloco de urgência:**
> Apenas **48 vagas**. Inscrições encerram em **23 de Maio**. Depois disso, a próxima turma é só em 2027.

---

## Visual Foundations

### Color
- **Preto (`#0A0A0A`)** é o palco. ~70% das superfícies. Sempre quente (tendência ao marrom escuro `#1C1A17`), nunca azulado.
- **Dourado (`#C9A24A`)** é a luz. Aplicado em **finos hairlines, números, divisores, ícones, CTAs primários, e em destaques de palavra-chave dentro de headlines**. Nunca em grandes áreas chapadas.
- **Ivory (`#F5EFE0`)** é a tipografia principal sobre preto. É um branco quente, levemente amarelado — não use `#FFFFFF` puro.
- **Vermelho urgência (`#C84A3D`)** entra **apenas** em contadores regressivos e selos de "vagas se esgotando".
- **Gradientes de ouro** (`--aba-grad-gold`, `--aba-grad-engrave`) são reservados para: numerais de pilar, selos, e o efeito *engraved text*. **Nunca** como fundo de seção inteira.

### Typography
- **Display serifado** (Cormorant Garamond) para H1/H2/H3 e citações. Refinado, alto contraste — código de luxo editorial.
- **Sans neo-grotesque** (**Inter** — fonte oficial enviada pela marca, variable `opsz`+`wght`) para corpo, botões, navegação, e eyebrow caps.
- **Tracking largo (`0.28em`)** em todos os eyebrows e small-caps. É a "assinatura" tipográfica do sistema.
- **Itálico serifado** apenas em citações e em sub-headlines de seção (ex.: *"em 3 dias presenciais"*).
- Tamanho mínimo on-screen: 14px para small / disclaimer; 16px corpo; 18px lead.

### Background system
- **Vinheta radial** sutil no topo das seções principais (`--aba-grad-bg-vignette`) — dá profundidade de teatro/palco.
- **Cortinas de proteção** (`--aba-grad-curtain`) no rodapé de imagens full-bleed para garantir leitura do texto sobre foto.
- **Imagem full-bleed** (hero, depoimentos, mentor) com tratamento **quente, contraste alto, levemente desaturado**. Nunca foto fria/azulada. Nunca selfie casual.
- **Texturas** evitadas. **Sem ruído/grain**. Sem padrão repetitivo. A textura é dada pela fotografia e pela tipografia serifada — não por bg-pattern.
- **Sem mesh-gradients ou blobs**. Sem AI-slop.

### Layout & rhythm
- **Grid:** container centralizado a `1200px` (desktop). Margens generosas (`--aba-space-7` / 48px mínimas).
- **Vertical rhythm:** seções de `--aba-space-9` (96px) a `--aba-space-10` (128px) de padding vertical. Respiro é luxo.
- **Hairlines de ouro** (`1px solid var(--aba-border-1)`) separam blocos. **Nunca** divisores cinzas chapados.
- **Numerais grandes serifados** (`I.`, `II.`, `III.` em `--aba-text-4xl`) introduzem cada pilar — é um tique recorrente.
- **Sticky CTA bar** no rodapé em telas longas (preto translúcido + blur 12px + hairline dourado no topo).

### Borders, radii, shadows
- **Radii:** elementos de UI usam `8px` (`--aba-radius-md`). Cards `14px`. Botões pill (`999px`) **apenas** em CTAs principais. Imagens **0px** ou `2px` (rectangular, editorial).
- **Hairlines:** sempre `1px`. Cor: dourado a 22% de opacidade para divisões dentro de cards; ivory a 10% para divisões neutras.
- **Shadows:** existem mas são **suaves e quentes**. Nunca shadow azulada. `--aba-shadow-gold` (com halo dourado 18% alpha) é assinatura para CTAs em hover. Inner shadow para "engraved" em selos numéricos.

### Animation & states
- **Easing:** padrão é `--aba-ease-elite` `cubic-bezier(.22, 1, .36, 1)` — saída longa, entrada precisa. Nunca *bounce*.
- **Durações:** `180ms` micro (hover de link), `320ms` UI (botão, card), `560ms` cinemático (entrada de seção).
- **Hover (botão dourado):** brilho sutil — `--aba-shadow-gold-strong` + leve `translateY(-1px)`. **Nunca** mudança brusca de cor.
- **Hover (link):** ouro vira ouro-claro (`--aba-gold-light`); underline de 1px dourado fade-in.
- **Press:** `scale(0.985)` + sombra reduzida. Nunca `scale(0.9)` — é elite, não bouncy.
- **Reveal de seção:** fade + `translateY(8px)` em 560ms, 1x na entrada do viewport. Nada de paralax agressivo.
- **Sem skeumorfismo. Sem neon glow. Sem confetti.**

### Transparência & blur
- **Blur** usado em: nav fixo (`backdrop-filter: blur(12px)` + `rgba(10,10,10,0.7)`), modal/overlay (`blur(20px)` + `rgba(10,10,10,0.85)`), e sticky-CTA bar.
- **Transparência** nunca em texto principal. Apenas em camadas de fundo, hairlines (`alpha 0.22`), e em legendas opcionais (`alpha 0.7`).

### Imagery direction
- **Antes / Depois** é o motif visual mestre (cf. `hero-transformation.jpg`). Polariza: *"o operador exausto"* vs *"o líder no controle"*.
- Mentores fotografados com **luz dramática quente, fundo sólido escuro ou ambiente fora-de-foco**. Pose fechada, olhar firme.
- Ambientes de cozinha / restaurante são bem-vindos, mas tratados com look editorial (cf. food service).
- **Nunca** stock photo de aperto de mão / gráfico genérico / pessoa apontando para câmera.

### Cards
- Fundo `--aba-bg-elev-2` (`#161412`).
- Border `1px solid var(--aba-border-1)` (gold @ 22%).
- Radius `14px`.
- Shadow `--aba-shadow-2` em estado padrão; `--aba-shadow-gold` em hover.
- Padding `32px` (cards de pilar/feature) ou `24px` (cards de depoimento).
- Ícone/numeral dourado **canto superior esquerdo**, sempre.

---

## Iconography

- **Sistema:** **Lucide** (https://lucide.dev) via CDN — `https://unpkg.com/lucide@latest/dist/umd/lucide.js`. Stroke `1.5px`, line-only, no fill. Estética sóbria que casa com a hairline dourada do sistema.
- **Cor padrão:** `--aba-gold` em ícones decorativos / numerais de pilar; `--aba-fg-2` em ícones funcionais (UI: chevron, close, menu).
- **Tamanhos canônicos:** `16px` (inline em texto), `20px` (botões), `24px` (nav), `32px` (cards de pilar), `48px` (hero / feature blocks).
- **Numerais romanos / arábicos serifados** (Cormorant) substituem ícones em listas de **pilares** e **etapas** — esse é o tique de assinatura. Não use ícone genérico onde um numeral serifado caberia.
- **Logo**: `assets/aba-logo.png` — laurel + escudo com "A" + capelo de formatura + faixa "ALPHA BUSINESS / ACADEMY". Versão única em gold-light sobre preto. **FLAG:** falta uma versão *vetor (SVG)* e variantes monochromas (gold puro, ivory puro, preto puro). Pedir ao time.
- **Emoji:** ❌ não usar. Ver Content Fundamentals.
- **Unicode chars como ícone:** apenas `→` (CTA), `·` (separador em meta), `—` (em-dash em copy editorial). Nada além disso.
- **SVG inline desenhada à mão pelo agente:** ❌ não fazer. Se faltar um ícone, usar Lucide ou pedir ao time.

---

## Caveats / pedidos ao time

> **⚠️ Por favor responda pra eu refinar o sistema:**

1. **Fontes.** Sans agora roda em **Inter** oficial (variable, enviada pela marca). Display serifado segue como **Cormorant Garamond** (Google Fonts) — se a ABA quiser uma display licenciada (Trajan Pro, Playfair Display, etc.), me manda os arquivos.
2. **Logo em vetor.** Recebi apenas o PNG. Preciso de um **SVG** com versões mono (ouro, ivory, preto) para uso em CTA, nav, e print.
3. **Repositório `backstagegrow/Imers-o-Aba`.** Está retornando `409` (vazio ou sem permissão). Se houver código ou Figma do site real, reanexe — eu calibro o UI kit em cima dele em vez de inferir do brief.
4. **Vídeos de depoimento.** Só o do Vinícius chegou. Marcio, Débora e os 2 criativos ABA não vieram com a mensagem. Reanexe ou me dê links e eu integro na página.
5. **12 pilares — nomes oficiais.** Listei 12 pilares com nomes plausíveis no UI kit. Me passe os títulos canônicos da Imersão pra eu trocar.
6. **Datas, preço, vagas, local.** Estão com placeholders claros (ex.: *"23 de Maio"*, *"R$ X.XXX"*, *"Hotel XYZ — São Paulo"*). Confirme.
7. **Cores semânticas (success/warning/danger).** Os hexes que escolhi (`#4FA86A`, `#E0A93B`, `#C84A3D`) são neutros editoriais — não tem brand-spec definido. Aprove ou me passe os corretos.

---

*Última atualização: 01 Maio 2026.*
