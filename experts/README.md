# 🧬 EXPERTS — Pipeline de Clonagem de Especialistas

## O que é esta pasta?
Aqui ficam os dados brutos, processados e os agentes-clone de cada expert que alimenta o Mega Brain (Jarvis) da BKS Grow.

## Estrutura por Expert
```
experts/
├── _templates/              # Templates reutilizáveis
│   ├── notebook_questions/  # Perguntas por pilar temático
│   ├── clone_agent.yaml     # Template YAML do agente clone
│   └── interview_script.md  # Roteiro de entrevista dirigida
│
├── lucas_silva/             # Expert 1
│   ├── README.md            # Ficha do expert
│   ├── raw/                 # Conteúdo bruto (transcrições, PDFs)
│   ├── notebooks/           # Outputs do NotebookLM por pilar
│   ├── dna/                 # DNA compilado (princípios, frameworks, tom)
│   └── clone_lucas_silva.yaml  # Agente-clone final
│
├── jose_ricardo/            # Expert 2
├── robert_cfo/              # Expert 3
└── ...
```

## Pipeline de Criação de Clone
1. **Ingestão** → Coletar material bruto em `raw/`
2. **NotebookLM** → Carregar em notebooks temáticos e extrair DNA com perguntas dirigidas
3. **Compilação** → Consolidar respostas em `dna/`
4. **Montagem** → Gerar o YAML do clone
5. **Calibração** → Testar e refinar com feedback do expert real

## Tempo Medio: 2-3 dias uteis por expert (com NotebookLM)

---

## Clone Roundtable System

O **Clone Roundtable** e um sistema de cross-learning que coloca os 14 expert clones em debate estruturado para extrair insights cruzados e incrementar o `calibration_score` de cada clone.

### Como funciona

```
*start {topico}     → Round 1: Perspectivas individuais de cada clone
*crossfire           → Round 2: Clones respondem diretamente uns aos outros
*pollinate           → Round 3: Cada clone declara o que aprendeu dos outros
*score               → Round 4: Gera patch JSON com score updates
```

### Modos de Operacao

| Modo | Comando | Descricao |
|------|---------|-----------|
| **Full Roundtable** | `*start {topico}` | Todos os clones relevantes debatem |
| **Duo Debate** | `*duo {clone1} {clone2} {topico}` | Dois clones em tensao produtiva |
| **Themed Panel** | `*panel {tema}` | Cluster pre-definido de clones |
| **Cross-Pollinate** | `*pollinate` | Extracao de cross-learnings |

### Paineis Tematicos Pre-definidos

| Painel | Clones |
|--------|--------|
| `offer_engineering` | Hormozi, Brunson, Finch, Georgi |
| `copywriting_masters` | Schwartz, Georgi, Brown, McKee |
| `paid_traffic` | Mandalia, Aslam, Finch, Breeze |
| `brand_strategy` | Neumeier, Do, Munger, McKee |
| `systems_scale` | Goldratt, Hormozi, Munger, Brunson |
| `persuasion_psychology` | Schwartz, Brown, McKee, Brunson |
| `growth_machine` | Hormozi, Finch, Mandalia, Aslam |

### Calibration Score

- Cada cross-learning genuino incrementa o `calibration_score` em +1 (ou +2 para insights excepcionais)
- Score maximo: **100**
- Ao atingir 100, o clone recebe o titulo **MASTER CALIBRATED**
- Cross-learnings sao cumulativos e nunca removidos

### Script de Aplicacao de Patches

```bash
# Aplicar patch gerado pelo *score
node experts/scripts/apply-cross-learnings.js <patch-file.json>

# Via stdin
cat patch.json | node experts/scripts/apply-cross-learnings.js --stdin
```

O script:
1. Le o patch JSON
2. Atualiza os YAMLs dos clones com `cross_learnings` e `calibration_score`
3. Atualiza `last_calibration` com a data atual
4. Salva log de sessao em `experts/_sessions/`

### Arquivos

| Arquivo | Descricao |
|---------|-----------|
| `experts/clone-roundtable.md` | Agente orquestrador do roundtable |
| `experts/scripts/apply-cross-learnings.js` | Script de aplicacao de patches |
| `experts/_sessions/` | Logs de sessoes de roundtable |
