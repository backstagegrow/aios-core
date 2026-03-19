# Plano de Ação — Melhoria dos Clones Digitais
**Data:** 2026-03-17
**Baseado em:** 14 clones ativos + 24 notebooks NotebookLM mapeados

---

## Diagnóstico Geral

| Problema | Situação Atual | Alvo |
|----------|---------------|------|
| Model desatualizado | `claude-3-5-sonnet-20241022` (11/13 clones) | `claude-sonnet-4-6` |
| Calibração zerada | `calibration_score: 0` em todos | Score ≥ 7/10 |
| DNA raso | ~100 linhas (vs Thiago: 408 linhas) | 250-400 linhas por clone |
| Notebooks não integrados | NLM sources não linkados nos YAMLs | Todos os notebooks mapeados |
| Chris Do sem NLM | Nenhum notebook dedicado | Criar notebook ou usar Psychology of Persuasion |

---

## Mapeamento Clone → NotebookLM

| Clone | Notebook NLM | ID | Status DNA |
|-------|--------------|----|------------|
| Alex Hormozi | Hormozi Success Habits: Raising Standards and Scaling Personal Growth | `8baa725c` | Raso — 3 frameworks |
| Charlie Munger | The Latticework of Worldly Wisdom | `7748cfd1` | Raso — mental models genéricos |
| Chris Do | *(sem notebook dedicado)* | — | Raso + sem fonte NLM |
| Depesh Mandalia | Depesh Mandalia: Mastering Profitability with the BPM Method | `538878c1` | Raso — BPM incompleto |
| Eli Goldratt | Implementing the Theory of Constraints: Systematic Reviews | `cfd41336` | Raso — TOC parcial |
| Eugene Schwartz | Eugene Schwartz: Master of the Brilliance Breakthrough | `16912e68` | Raso — falta Breakthrough Advertising |
| Kasim Aslam | Principles of Profit Beyond AI Algorithm Management | `76cb16d2` | Raso — falta OMG framework |
| Marty Neumeier | Marty Neumeier on the Modern Realities of Brand Strategy | `8eb98019` | Raso — falta Brand Gap e Zag |
| Robert McKee | Mastering the Art of Narrative and Screenwriting | `3cc3eb59` | Raso — Story Structure básica |
| Russell Brunson | The Ask Formula + Canal Subido: Masterclass in Paid Traffic | `5f0ad1ee` + `d02b01c4` | Raso — falta funnel frameworks |
| Stefan Georgi | The Direct Response Marketing Playbook of Stefan Georgi | `5245aa87` | Raso — RMBC incompleto |
| Thiago Finch | NB01-NB07 (7 notebooks) | múltiplos | **REFERÊNCIA** — 408 linhas |
| Todd Brown | Modern Advertising: Principles, Testing, and Conversion Frameworks | `6678502b` | Raso — falta E5 Method |
| Tom Breeze | The Definitive Guide to YouTube Ads: Scaling with Tom Breeze | `e1d824a6` | Raso — ADUCATE incompleto |

---

## Processo de Melhoria (por clone)

Para cada clone, executar na sequência:

```bash
# 1. Ativar notebook no NotebookLM
notebooklm use <notebook_id>

# 2. Extrair DNA faltante com perguntas estratégicas
notebooklm ask "Quais são os frameworks decisórios principais de [NOME]?"
notebooklm ask "Quais expressões, metáforas e linguagem são exclusivas de [NOME]?"
notebooklm ask "Quais anti-padrões [NOME] condena e por quê?"
notebooklm ask "Quais casos e histórias [NOME] usa para ilustrar seus princípios?"
notebooklm ask "Como [NOME] diagnostica problemas? Qual é sua sequência de perguntas?"

# 3. Atualizar o YAML do clone com o DNA extraído
# 4. Atualizar: sources_count, notebooks_used, model, prompt_version
# 5. Rodar calibration_questions e registrar score
```

---

## Plano por Clone — Prioridade e Ações Específicas

---

### 1. Alex Hormozi
**Notebook:** `8baa725c` — Hormozi Success Habits
**Lacunas identificadas:**
- Missing: $100M Leads framework detalhado
- Missing: Acquisition.com portfolio logic (buy vs build)
- Missing: Content machine (volume as moat)
- Calibration questions genéricas demais

**Ações:**
- [ ] Extrair do NLM: $100M Leads, $100M Offers, portfolio decisions
- [ ] Adicionar Framework 5: Content as Lead Gen (volume strategy)
- [ ] Expandir cases: gym turnaround, licensing model, Acquisition.com
- [ ] Adicionar 5+ calibration questions específicas
- [ ] Atualizar model para `claude-sonnet-4-6`
- [ ] Registrar `last_calibration` e `calibration_score`

---

### 2. Charlie Munger
**Notebook:** `7748cfd1` — The Latticework of Worldly Wisdom
**Lacunas identificadas:**
- Mental models listados sem profundidade (inversion, lollapalooza parciais)
- Falta: checklist decision-making process
- Falta: "avoid stupidity" over "seek brilliance" framing
- Tom de voz não captura sarcasmo e ironia característicos

**Ações:**
- [ ] Extrair do NLM: 25 principais mental models com exemplos reais
- [ ] Adicionar Framework: Inversion como ferramenta primária
- [ ] Adicionar Framework: Lollapalooza effect (confluência de fatores)
- [ ] Adicionar Framework: Two-track analysis (rational + psychological)
- [ ] Capturar tom: sardônico, referências históricas, "show me the incentives"
- [ ] Expandir anti-patterns: agir sob pressão, confiar em narrativas sem checklist
- [ ] Atualizar model para `claude-sonnet-4-6`

---

### 3. Chris Do
**Notebook:** *(nenhum dedicado)*
**Lacunas identificadas:**
- Clone mais raso — sem notebook NLM de referência
- Falta: The Business of Design frameworks
- Falta: Pricing by value (não por hora)
- Falta: Mentor mindset e linguagem de coaching

**Ações:**
- [ ] **PRIORIDADE:** Criar notebook NLM dedicado para Chris Do
  - Adicionar fontes: YouTube TheFutur, cursos, entrevistas
- [ ] Mapear: Frameworks de precificação (value-based pricing)
- [ ] Mapear: Business of Design (branding como estratégia, não arte)
- [ ] Capturar: linguagem de coaching socrático ("o que você quer mesmo?")
- [ ] Usar NLM `0eeeb49a` (Psychology of Persuasion) como fonte auxiliar
- [ ] Atualizar model para `claude-sonnet-4-6`

---

### 4. Depesh Mandalia
**Notebook:** `538878c1` — Mastering Profitability with the BPM Method
**Lacunas identificadas:**
- BPM Method não detalhado (Base, Premium, Max tiers)
- Falta: Facebook Ads attribution framework
- Falta: Profitability Scorecard
- Falta: "Profit first, scale second" decision logic

**Ações:**
- [ ] Extrair do NLM: BPM Method completo (3 tiers com métricas)
- [ ] Adicionar Framework: Facebook Ads attribution (7-day, 1-day, view)
- [ ] Adicionar Framework: Profit Scorecard (CAC, LTV, MER, nCAC)
- [ ] Expandir: como ler uma conta de ads que parece saudável mas não é
- [ ] Adicionar 5+ calibration questions sobre BPM
- [ ] Atualizar model para `claude-sonnet-4-6`

---

### 5. Eli Goldratt
**Notebook:** `cfd41336` — Theory of Constraints Systematic Reviews
**Lacunas identificadas:**
- TOC parcial — apenas 5 focusing steps citados
- Falta: Thinking Processes (TP) tools (CRT, FRT, EC)
- Falta: aplicação a marketing e infoprodutos
- Tom técnico mas sem narrativa (Goal como pano de fundo)

**Ações:**
- [ ] Extrair do NLM: Thinking Processes completos (árvores causais)
- [ ] Adicionar Framework: Current Reality Tree (CRT) + Future Reality Tree
- [ ] Adicionar Framework: Evaporating Cloud (EC) para conflitos
- [ ] Adicionar aplicação prática a negócios digitais
- [ ] Expandir cases: Alex Rogo, fábrica, supply chain → analogias para infoprodutos
- [ ] Atualizar model para `claude-sonnet-4-6`

---

### 6. Eugene Schwartz
**Notebook:** `16912e68` — Master of the Brilliance Breakthrough
**Lacunas identificadas:**
- Breakthrough Advertising parcial — falta os 5 níveis de sofisticação de mercado
- Falta: Mass desire concept (você não cria desejo, canaliza)
- Falta: Copy architecture (headlines como propostas de força)
- Tom muito genérico — Schwartz tem linguagem muito específica

**Ações:**
- [ ] Extrair do NLM: 5 Market Sophistication Stages completos com exemplos
- [ ] Adicionar Framework: Mass Desire (canalize, não crie)
- [ ] Adicionar Framework: Force of the headline (headline como promessa de força)
- [ ] Capturar tom: intelectual, clínico, orientado a psicologia de massas
- [ ] Adicionar anti-pattern: copy baseada em features, não em desires latentes
- [ ] Atualizar model para `claude-sonnet-4-6`

---

### 7. Kasim Aslam
**Notebook:** `76cb16d2` — Principles of Profit Beyond AI Algorithm Management
**Lacunas identificadas:**
- OMG Framework não aparece no YAML atual
- Falta: "Feed the algorithm profit data, not conversion data"
- Falta: P&L-first thinking aplicado a tráfego
- Tom muito genérico — Kasim tem linguagem provocativa e irreverente

**Ações:**
- [ ] Extrair do NLM: OMG Commerce framework completo
- [ ] Adicionar Framework: Profit-first attribution (ROAS vs net profit)
- [ ] Adicionar Framework: Algorithm feeding strategy (treinar para lucro)
- [ ] Capturar tom: provocativo, "conventional wisdom is wrong", data-driven
- [ ] Adicionar calibration: "quando ROAS alto é sinal de problema?"
- [ ] Atualizar model para `claude-sonnet-4-6`

---

### 8. Marty Neumeier
**Notebook:** `8eb98019` — Modern Realities of Brand Strategy
**Lacunas identificadas:**
- Brand Gap e Zag não detalhados
- Falta: Onlyness statement framework
- Falta: Brand as verb (não substantivo)
- Tom conceitual mas sem exemplos concretos de diagnóstico

**Ações:**
- [ ] Extrair do NLM: Onlyness statement template e exemplos
- [ ] Adicionar Framework: Brand Gap (5 disciplinas: diferenciar, colaborar, inovar, validar, cultivar)
- [ ] Adicionar Framework: Zag (radical differentiation)
- [ ] Capturar tom: designer thinking, poético mas preciso, "just one word"
- [ ] Adicionar anti-pattern: posicionamento genérico, branding como logo
- [ ] Atualizar model para `claude-sonnet-4-6`

---

### 9. Robert McKee
**Notebook:** `3cc3eb59` — Mastering the Art of Narrative and Screenwriting
**Lacunas identificadas:**
- Story structure básica — falta Story Spine e Gap principle
- Falta: Value charge (positivo/negativo) como motor narrativo
- Falta: aplicação de story para copy e marketing
- Tom formal sem capturar intensidade característica de McKee

**Ações:**
- [ ] Extrair do NLM: Story Grid completo (inciting incident, progressive complications, crisis, climax, resolution)
- [ ] Adicionar Framework: Gap principle (expectativa vs resultado → tensão)
- [ ] Adicionar Framework: Value charge (como cada cena muda o estado do protagonista)
- [ ] Adicionar aplicação: como usar story structure em copy, VSL, lançamento
- [ ] Capturar tom: exigente, professoral, intolerante a história sem conflito
- [ ] Atualizar model para `claude-sonnet-4-6`

---

### 10. Russell Brunson
**Notebooks:** `5f0ad1ee` (Ask Formula) + `d02b01c4` (Canal Subido: Paid Traffic)
**Lacunas identificadas:**
- Falta: DotCom Secrets funnel hierarchy (bait, frontend, backend, continuity)
- Falta: Epiphany Bridge story structure
- Falta: Value Ladder concept
- Falta: Dream 100 strategy
- Falta: Hook, Story, Offer framework

**Ações:**
- [ ] Extrair dos 2 NLMs: Value Ladder + Funnel hierarchy completos
- [ ] Adicionar Framework: Epiphany Bridge (como construir a história de venda)
- [ ] Adicionar Framework: Hook → Story → Offer (sequência universal)
- [ ] Adicionar Framework: Dream 100 (cultivar influenciadores antes de precisar deles)
- [ ] Expandir cases: ClickFunnels origin, supplement funnels
- [ ] Atualizar model para `claude-sonnet-4-6`

---

### 11. Stefan Georgi
**Notebook:** `5245aa87` — Direct Response Marketing Playbook
**Lacunas identificadas:**
- RMBC Method parcial — Brief section incompleta
- Falta: Lead types (problem, secret, proclamation, prediction, story)
- Falta: como construir prova em mercados céticos
- Falta: Copy Accelerator philosophy

**Ações:**
- [ ] Extrair do NLM: Lead types completos com exemplos
- [ ] Expandir Framework RMBC: Brief section detalhada (angulo, abertura, provas, stack)
- [ ] Adicionar Framework: Proof architecture (tipos de prova e ordem de apresentação)
- [ ] Capturar: Copy Accelerator mindset (copy como negócio, não serviço)
- [ ] Adicionar 5+ calibration questions sobre mechanism e VSL
- [ ] Atualizar model para `claude-sonnet-4-6`

---

### 12. Thiago Finch *(Referência — manutenção)*
**Notebooks:** NB01 a NB07 (7 notebooks) + NB06 Fontes Públicas
**Status:** Clone mais desenvolvido (408 linhas) — serve como padrão

**Ações:**
- [ ] Integrar NB06 Fontes Públicas no YAML (atualizar `notebooks_used`)
- [ ] Verificar se `last_calibration` foi registrado após última atualização (2026-03-16)
- [ ] Rodar calibration_questions e registrar score oficial
- [ ] Garantir que NB07 DNA MASTER está refletido no YAML

---

### 13. Todd Brown
**Notebook:** `6678502b` — Modern Advertising: Principles, Testing, Conversion
**Lacunas identificadas:**
- E5 Method não aparece no YAML
- Falta: Marketing Dominance framework
- Falta: "Engage before you sell" sequência
- Tom muito genérico — Todd tem linguagem muito específica sobre "marketing-to-sophistication"

**Ações:**
- [ ] Extrair do NLM: E5 Method completo (Engage, Educate, Establish, Elevate, Execute)
- [ ] Adicionar Framework: Marketing Dominance (como dominar um mercado saturado)
- [ ] Adicionar Framework: Sophistication-matched messaging
- [ ] Capturar tom: professor, estratégico, contra "tactics without strategy"
- [ ] Adicionar anti-pattern: campanha sem strategy primeiro
- [ ] Atualizar model para `claude-sonnet-4-6`

---

### 14. Tom Breeze
**Notebook:** `e1d824a6` — The Definitive Guide to YouTube Ads
**Lacunas identificadas:**
- ADUCATE framework parcial — falta exemplos por etapa
- Falta: Hook types específicos para YouTube (pattern interrupt, curiosity, direct)
- Falta: Ad sequencing strategy (awareness → consideration → conversion)
- Falta: YouTube-specific metrics (view rate, earned views, brand lift)

**Ações:**
- [ ] Extrair do NLM: ADUCATE completo com exemplos por etapa
- [ ] Adicionar Framework: Hook taxonomy (tipos de abertura e quando usar cada)
- [ ] Adicionar Framework: YouTube funnel (TOFU → MOFU → BOFU com formatos)
- [ ] Expandir métricas: CPV, view rate, earned views, brand search lift
- [ ] Adicionar calibration: "quando aumentar budget vs otimizar criativo?"
- [ ] Atualizar model para `claude-sonnet-4-6`

---

## Sequência de Execução Recomendada

### Fase 1 — Quick Wins (model upgrade + estrutura) — 1 sessão
Atualizar model e corrigir metadata em todos os 13 clones não-Thiago.

### Fase 2 — DNA Expansion (1-2 clones por sessão)
Prioridade sugerida baseada em uso esperado:
1. Stefan Georgi + Eugene Schwartz (copy — alta demanda)
2. Alex Hormozi + Russell Brunson (offers + funnels)
3. Tom Breeze + Depesh Mandalia + Kasim Aslam (tráfego)
4. Todd Brown + Marty Neumeier (strategy)
5. Robert McKee + Charlie Munger (pensamento crítico/narrativa)
6. Eli Goldratt (TOC — nicho)
7. Chris Do (criar NLM notebook primeiro)
8. Thiago Finch (manutenção)

### Fase 3 — Calibração (após DNA expansion)
Para cada clone:
```bash
# Rodar as calibration_questions manualmente ou via agente
# Pontuar 1-10 por: precisão, voz, frameworks acionados
# Registrar last_calibration: YYYY-MM-DD e calibration_score: X
```

---

## Padrão de Qualidade (baseado em Thiago Finch)

| Métrica | Mínimo | Referência (Thiago) |
|---------|--------|---------------------|
| Linhas no YAML | 200 | 408 |
| Frameworks | 4 | 19 |
| Cases | 3 | 8+ |
| Calibration questions | 8 | 12+ |
| Anti-patterns | 5 | 10+ |
| Sources count | 8 | 50+ |
| Calibration score | 7/10 | n/a |

---

## Notas Adicionais

- **Chris Do** é o único clone sem notebook NLM — criar notebook é pré-requisito
- **Russell Brunson** tem 2 notebooks NLM — integrar os dois no YAML
- **Thiago Finch** é o padrão de qualidade — use como referência estrutural
- Após cada melhoria, rodar as `calibration_questions` do YAML e pontuar
- Manter `prompt_version` versionado (1.0.0 → 1.1.0 → 2.0.0 conforme profundidade da mudança)
