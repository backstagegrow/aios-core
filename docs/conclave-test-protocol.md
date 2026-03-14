# Conclave Test Protocol
**Versão:** 1.0.0
**Criado:** 2026-03-14
**Status:** Pronto para execução

---

## Objetivo

Validar o funcionamento end-to-end do Conclave Decision Engine com o clone `alex_hormozi` (readiness: 75/100, status: Operational).

Este protocolo testa:
1. Carregamento do clone e seu DNA
2. Execução do Conclave com 1-2 clones
3. Aplicação dos protocolos `antiPleasing` e `antiBiasing`
4. Qualidade da recomendação final

---

## Pré-requisitos

```bash
# Verificar readiness do clone (deve ser >= 70)
node packages/clone-tools/readiness-scorer.js --clone-id alex_hormozi
# Expected: Total Score: 75/100, Meets Threshold: YES
```

---

## Sessão de Teste 1 — Single Clone (Hormozi)

**Desafio:** "Nossa startup tem R$500k MRR mas a margem está em 12%. Como escalar para R$2M MRR sem destruir a operação?"

**Configuração esperada:**
```js
const { runConclave } = require('./packages/clones/conclave');

const hormoziClone = {
  name: 'Alex Hormozi Clone',
  dnaProfile: {
    philosophy: 'Receita é vaidade, lucro é sanidade, fluxo de caixa é realidade.',
    mentalModel: 'Diagnóstico sistêmico: Oferta → Leads → Conversão → Economics',
    heuristics: ['LTGP > CPA × 3', 'Aumente preço antes de volume quando margem aperta'],
    frameworks: ['Value Equation', 'Grand Slam Offer', 'Core 4', 'LTGP > CPA'],
    methodology: 'Top-down diagnóstico: mecânica econômica primeiro, tática depois'
  },
  skills: []
};

const decision = await runConclave(
  'Nossa startup tem R$500k MRR mas a margem está em 12%. Como escalar para R$2M MRR sem destruir a operação?',
  [hormoziClone],
  { antiPleasing: true, antiBiasing: true, totalBusinessContext: false }
);
```

**Critérios de aprovação:**
- [ ] `decision.perspectives` tem 1 perspectiva (Hormozi)
- [ ] `decision.recommendation` menciona margem, LTGP ou pricing
- [ ] `decision.recommendation` NÃO menciona desconto como solução
- [ ] `decision.meta.protocols` inclui `antiPleasing` e `antiBiasing`
- [ ] `decision.hybridDossier` contém síntese coerente

---

## Sessão de Teste 2 — Multi-Clone (Quando segundo clone for adicionado)

**Nota:** Este teste requer um segundo clone com readiness >= 70.

**Candidatos próximos:**
- `peter_drucker` — Management por resultados (complementar ao Hormozi)
- `eugene_schwartz` — Copywriting e psicologia do consumidor

**Desafio para multi-clone:** "Devemos lançar um produto premium de R$50k para nosso público atual ou criar uma oferta de entrada em R$2k para ampliar o mercado?"

**Configuração:**
```js
const decision = await runConclave(
  'Devemos lançar um produto premium R$50k ou criar uma oferta de entrada R$2k?',
  [hormoziClone, druckerClone],
  { antiPleasing: true, antiBiasing: true, totalBusinessContext: true }
);
```

**Critérios de aprovação:**
- [ ] `decision.perspectives` tem 2 perspectivas (perspectivas diferentes)
- [ ] Perspectivas apresentam pontos de vista distintos (não idênticos)
- [ ] `hybridDossier` sintetiza as tensões entre as perspectivas
- [ ] `recommendation` resolve o trade-off com raciocínio explícito
- [ ] `antiPleasing` ativo: pelo menos uma perspectiva desafia a pergunta original

---

## Protocolo antiPleasing — Checklist de Validação

O protocolo `antiPleasing` garante que o Conclave não confirma o viés do usuário. Sinais de funcionamento correto:

- [ ] A recomendação desafia pelo menos uma premissa da pergunta
- [ ] Usa linguagem direta: "o problema não é X, é Y"
- [ ] Apresenta o "custo de não agir" em vez de validar o plano atual
- [ ] Não começa com "Ótima pergunta" ou equivalente

---

## Protocolo antiBiasing — Checklist de Validação

O protocolo `antiBiasing` questiona o que não foi dito. Sinais de funcionamento correto:

- [ ] Pergunta sobre dados que o usuário não forneceu (CPA, LTV, churn)
- [ ] Identifica suposições implícitas na pergunta
- [ ] Apresenta cenário alternativo que o usuário não considerou
- [ ] Sinaliza quando a pergunta tem uma premissa errada

---

## Critérios de Sucesso Gerais

| Critério | Peso | Status |
|----------|------|--------|
| Clone carrega sem erro | BLOCKING | [ ] |
| Perspectiva gerada é coerente com o DNA | HIGH | [ ] |
| antiPleasing desafia o viés do usuário | HIGH | [ ] |
| antiBiasing questiona premissas implícitas | HIGH | [ ] |
| Recomendação final é acionável | MEDIUM | [ ] |
| Meta inclui timestamp e protocolos usados | LOW | [ ] |

**Critério de aprovação:** Todos os BLOCKING + pelo menos 3/4 HIGH aprovados.

---

## Trigger Automático do Conclave

Conforme configurado em `core-config.yaml`:

```yaml
conclave:
  autoTrigger:
    onComplexityScore: 16   # Score COMPLEX aciona automaticamente
    onArchitectHighDecision: true
  cloneSelection:
    min: 2
    max: 5
```

Para acionar manualmente via `@architect` quando marcar decisão como HIGH:
```
@architect: "Esta é uma decisão HIGH — acionar Conclave com clones disponíveis"
```

---

## Próximos Passos Após Aprovação

1. **Adicionar segundo clone** (peter_drucker ou eugene_schwartz) para testes multi-clone
2. **Integrar com @squad** — `*conclave {desafio}` como comando direto
3. **Ativar `totalBusinessContext`** para decisões com `onComplexityScore >= 16`
4. **Documentar padrões de sessão** em `.aios/handoffs/conclave-sessions/`
5. **Configurar auto-trigger** via `@architect HIGH` decisions

---

## Histórico de Sessões

| Data | Clones | Desafio | Resultado |
|------|--------|---------|-----------|
| — | — | — | Aguardando primeira execução |
