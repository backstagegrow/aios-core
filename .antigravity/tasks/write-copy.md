# Write Copy

> Task ID: write-copy
> Agent: Uma (UX-Design-Expert)
> Version: 1.0.0
> Trigger: `*copy-page {page-name}` | `*write-copy {section}` | `*refine-copy {section}`

## Purpose

Gerar copy persuasiva para seções de página usando os clones de especialistas disponíveis.
Conecta o DNA dos experts com o contexto do projeto (cliente, avatar, tom) e entrega texto
estruturado **pronto para passar ao `*create-page`**.

---

## Clone Directory

| Clone | Slug | Especialidade Principal | Melhor Para |
|-------|------|------------------------|-------------|
| Thiago Finch | `thiago-finch` | Copy + Tráfego PT-BR | Hero, VSL, Criativos, Anúncios |
| Todd Brown | `todd-brown` | E5 Method + Big Idea | Campanha completa, Big Idea, Posicionamento |
| Stefan Georgi | `stefan-georgi` | RMBC Method | VSL longa, Mecanismo Único, Carta de vendas |
| Eugene Schwartz | `eugene-schwartz` | Níveis de Consciência | Headlines por awareness, Mercado sofisticado |
| Russell Brunson | `russell-brunson` | Hook Story Offer | Webinar, Epiphany Bridge, Funil |
| Alex Hormozi | `alex-hormozi` | Value Equation | Oferta, Stack, CTA alto ticket |
| Robert McKee | `robert-mckee` | Story | Brand story, Narrativa, Sobre nós |
| Marty Neumeier | `marty-neumeier` | Brand Strategy | Tagline, Posicionamento, Diferenciação |

**DNA paths:** `experts/{slug}/dna/compiled_dna.md`

---

## Copy Types

| Tipo | Seção | Frameworks Recomendados |
|------|-------|------------------------|
| `hero` | Headline + Subheadline + CTA | Thiago (Página Apollo), Todd (Big Idea), Eugene (Awareness) |
| `pain` | Seção de dor / agitação | Stefan (RMBC), Thiago (PAS), Todd (E5 Lead) |
| `mechanism` | Mecanismo único | Stefan (RMBC-M), Todd (Unique Mechanism) |
| `proof` | Prova social / resultados | Hormozi (Value Equation), Thiago (Métricas) |
| `offer` | Oferta empilhada | Hormozi (Grand Slam), Todd (SIN Offer) |
| `cta` | Call to Action | Thiago (Imperativo), Russell (Closing) |
| `faq` | Objeções e respostas | Thiago (Objeções Avatar), Russell (Q&A) |
| `story` | História / Sobre nós | McKee (Story), Russell (Epiphany Bridge) |
| `vsl` | Roteiro de vídeo | Stefan (7 seções), Thiago (VSL 42 passos) |
| `ad` | Criativo para anúncio | Thiago (Criativos que Escalam), Todd (E5) |

---

## Modos de Uso

### MODO 1 — Página Completa (`*copy-page {page-name}`)

Fluxo recomendado para páginas novas. Uma monta o **esqueleto** de todas as seções primeiro,
você aprova (e ajusta o que quiser), só depois ela gera o copy completo.

```
*copy-page Home
  → STEP A: Uma lê .state.yaml + manifest → detecta seções da página
  → STEP B: Propõe esqueleto (todas as seções em uma tabela)
  → STEP C: Você aprova ou edita o esqueleto
  → STEP D: Uma gera copy seção por seção, em ordem
  → STEP E: Copy completa salva em .copy-drafts/{page}.md
```

### MODO 2 — Seção Única (`*write-copy {section}`)

Gera copy de uma seção específica. Útil para adicionar seções novas a uma página existente.

```
*write-copy pain
*write-copy offer
```

### MODO 3 — Refinar Seção (`*refine-copy {section}`)

Refaz **apenas** uma seção já gerada, sem tocar nas outras.
Ideal para ajustes pós-aprovação.

```
*refine-copy hero          → "quero tom mais direto"
*refine-copy hero todd-brown  → "refaz com Todd Brown"
*refine-copy cta           → "CTA mais urgente"
```

Se você não especificar o clone, Uma mantém o mesmo clone da geração anterior.

---

## Execution

## Page Mode Execution (`*copy-page`)

### STEP A — Detect Page Sections

Read `project-manifest.yaml` → find the page in `pages.routes`.
Extract `sections` list. If not defined, infer from page name and client type.

If sections not in manifest, use defaults by page type:
```
landing-page: [hero, pain, mechanism, proof, offer, cta, faq]
about:         [hero, story, team, values, cta]
contact:       [hero, form, map, faq]
```

### STEP B — Generate Skeleton

Apresent a tabela do esqueleto — **NÃO gerar copy ainda**:

```
📋 ESQUELETO DE COPY — {page-name} ({client})

| # | Seção       | Tipo    | Clone           | Objetivo em 1 linha                    |
|---|-------------|---------|-----------------|----------------------------------------|
| 1 | Hero        | hero    | eugene-schwartz | Parar o scroll. Promessa específica.   |
| 2 | Dor         | pain    | stefan-georgi   | Avatar se reconhece na dor descrita.   |
| 3 | Mecanismo   | mechanism | stefan-georgi | Por que outras soluções falham.        |
| 4 | Prova       | proof   | thiago-finch    | Resultados reais com métricas.         |
| 5 | Oferta      | offer   | alex-hormozi    | Stack de valor > preço percebido.      |
| 6 | CTA         | cta     | thiago-finch    | Urgência + benefício imediato.         |
| 7 | FAQ         | faq     | russell-brunson | Quebrar as 3 objeções principais.      |

Posso ajustar:
  • Trocar clone de qualquer seção → "troca hero para thiago-finch"
  • Remover seção → "tira mecanismo"
  • Adicionar seção → "adiciona depoimentos após prova"
  • Mudar objetivo → "hero mais aspiracional, menos urgente"

[Aprovar esqueleto] → vou gerar seção por seção
[Ajustar] → me diga o que mudar
```

**HALT — não gerar copy até aprovação explícita.**

### STEP C — User Approval

Aguardar aprovação ou ajustes. Aplicar mudanças no esqueleto e mostrar versão atualizada.
Re-perguntar até aprovação.

### STEP D — Generate Section by Section

Após aprovação, gerar uma seção por vez seguindo o fluxo do STEP 2-5 abaixo.
Após cada seção:
```
✅ Seção {n}/{total}: {nome} — gerada
Próxima: {next-section} com {clone}
[continuar | ajustar esta antes de prosseguir]
```

### STEP E — Save Draft

Após todas as seções, salvar em `.copy-drafts/{page-name}.md`:

```markdown
# Copy Draft — {page-name}
# Cliente: {client} | Data: {date} | Clones: {list}

## [01] HERO
[copy gerada]

## [02] DOR
[copy gerada]
...
```

Após salvar:
```
✅ Copy completa salva em .copy-drafts/{page-name}.md

Próximos passos:
  *refine-copy hero    → ajustar seção específica
  *create-page {name}  → montar a página com esta copy
```

---

### STEP 0 — Load Project Context

Read `.state.yaml` to extract:
```yaml
client: "{slug}"
tokens.mode: "{dark|light}"     # Informa o tom visual
```

Read `project-manifest.yaml` to check if there's a client ICP file:
```
clients/{ClientName}/icp.md           → avatar detalhado
clients/{ClientName}/copy/            → copy anterior (referência)
clients/{ClientName}/brand_manual.md  → tom de voz da marca
```

Se encontrar, carregar silenciosamente. Não pedir ao usuário o que já está documentado.

---

### STEP 1 — Brief de Copy

Se o usuário não especificou o tipo, perguntar:

```
✍️  WRITE COPY — Brief rápido:

1. Seção: [hero | pain | mechanism | proof | offer | cta | faq | story | vsl | ad]
2. Clone: [thiago-finch | todd-brown | stefan-georgi | eugene-schwartz | russell-brunson | alex-hormozi | outro]
   → Não sabe? Descreva o objetivo e eu escolho.
3. Avatar (se não tiver ICP.md): Quem é o leitor? Qual a maior dor dele?
4. Consciência do avatar: [1-unaware | 2-problem-aware | 3-solution-aware | 4-product-aware | 5-most-aware]
   → Padrão: 2 (sabe que tem problema, não conhece sua solução)
5. Tom: [urgente | aspiracional | técnico | emocional | direto]
```

**Aceitar resposta em texto livre** — extrair dados estruturados da resposta.

---

### STEP 2 — Load Clone DNA

Read: `experts/{clone-slug}/dna/compiled_dna.md`

Internalizar o DNA do clone — adotar sua voz, frameworks e heurísticas.

**Não citar o clone explicitamente no output** — escrever COMO ele, não SOBRE ele.

---

### STEP 3 — Select Framework

Based on copy type + clone, select the primary framework:

```
hero + thiago-finch    → Página Apollo (9 passos) — focar no STEP 1 (Headline)
hero + todd-brown      → Big Idea → Lead → Argumento
hero + eugene-schwartz → Calibrar pelo nível de consciência primeiro

pain + stefan-georgi   → RMBC: R (Research) → Lead com Causa Raiz Oculta
pain + thiago-finch    → PAS (Problema → Agitação → Solução)

mechanism + stefan-georgi → RMBC-M: Causa Raiz Oculta + Solução de 2 partes
offer + alex-hormozi   → Grand Slam: Dream Outcome + Perceived Likelihood + Time + Effort

vsl + stefan-georgi    → 7 seções: Lead → Dor → Mecanismo → Prova → Produto → Oferta → Q&A
vsl + thiago-finch     → VSL 42 passos (Transferência de Culpa + Modéstia Ligada)

ad + thiago-finch      → Criativos que Escalam: Interrupção 3s + Mecanismo + Alavancagem
```

---

### STEP 4 — Generate Copy

Escrever o copy seguindo o framework selecionado.

**Regras inegociáveis:**
- Usar as **palavras exatas do avatar** (não linguagem de marca)
- Parágrafos curtos — máximo 3 linhas
- Bold nos pontos de dor críticos
- Nunca usar adjetivos vagos ("incrível", "revolucionário", "poderoso")
- Headline deve ser testável: uma única promessa, mensurável
- CTA: verbo imperativo + benefício imediato (não "Saiba mais")

**Para hero sections:**
```
HEADLINE PRINCIPAL:
[headline — máx 10 palavras, promessa específica]

SUBHEADLINE:
[contexto + credibilidade — 1-2 frases]

CTA PRIMÁRIO:
[verbo + benefício]

CTA SECUNDÁRIO (opcional):
[alternativa para quem não está pronto]
```

**Para pain sections:**
```
LEAD DE DOR:
[frase de identificação — o avatar se reconhece]

AGITAÇÃO:
[3-5 bullets de consequências da dor]

PIVOT:
[transição para solução — sem revelar ainda]
```

**Para VSL (roteiro):**
```
[00:00-00:15] LEAD (Interrupção de padrão)
[00:15-01:30] DOR (Agitação de feridas)
[01:30-03:00] MECANISMO (Causa raiz oculta)
[03:00-05:00] PROVA (Credibilidade + resultados)
[05:00-07:00] PRODUTO (O resgate)
[07:00-09:00] OFERTA (Stack + preço ancorado)
[09:00-10:00] Q&A (Quebra de objeções)
```

---

### STEP 5 — Quality Gate

Antes de entregar, verificar:

```
[ ] Headline: promessa específica e mensurável?
[ ] Avatar: usa linguagem dele, não da marca?
[ ] Dor: agita o problema antes de oferecer solução?
[ ] CTA: verbo imperativo + benefício imediato?
[ ] Tom: consistente com brand_manual.md do cliente?
[ ] Nível de consciência: calibrado para o avatar certo?
[ ] Sem adjetivos vagos ou clichês?
```

Se qualquer item falhar → reescrever antes de entregar.

---

### STEP 6 — Deliver

```
╔══════════════════════════════════════════════╗
║  COPY PRONTA — {section-type}               ║
╠══════════════════════════════════════════════╣
║ Cliente ....... {client}                     ║
║ Clone ......... {clone}                      ║
║ Framework ..... {framework}                  ║
║ Consciência ... Nível {1-5}                  ║
╚══════════════════════════════════════════════╝

[COPY AQUI — pronta para colar]

---
PRÓXIMO PASSO:
  *create-page {nome}  → colar esta copy na seção "{section-type}"
  *write-copy pain     → gerar próxima seção
```

---

## Combinações Recomendadas por Cliente

### GT House (house-gt) — Premium, luz, aspiracional
```
hero    → eugene-schwartz (nível 2-3) + tom aspiracional
pain    → thiago-finch (PAS adaptado para B2B)
offer   → alex-hormozi (valor percebido > preço)
```

### BKS Grow (bks-grow) — Dark, técnico, dados
```
hero    → todd-brown (Big Idea + mecanismo único)
pain    → stefan-georgi (RMBC — causa raiz oculta)
proof   → thiago-finch (métricas e resultados reais)
ad      → thiago-finch (Criativos que Escalam)
```

### Alpha Business Academy (alpha) — Dark, autoridade, alto ticket
```
hero    → eugene-schwartz (nível 3) + russell-brunson (Hook Story)
story   → robert-mckee (narrativa de transformação)
offer   → alex-hormozi (Grand Slam Offer)
vsl     → stefan-georgi (7 seções)
```
