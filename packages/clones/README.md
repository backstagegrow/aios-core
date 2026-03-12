# CLONES — Sistema de Clonagem Digital de Especialistas

**Pacote:** `packages/clones`  
**Part of:** AIOS Core Framework

## Visão Geral

O sistema CLONES replica a inteligência operacional de especialistas como IA funcional dentro do negócio de um cliente. Cada clone não é um chatbot — é um **expert digital treinado com o DNA mental de um especialista real**.

```
Fonte Bruta → [Mega Brain] → [DNA Mapper] → [Skill Generator] → Clone Ativo
                                                      ↓
                                              [Conclave] ← Múltiplos Clones
```

## Módulos

### 🧠 Mega Brain (`mega-brain/`)
Pipeline de ingestão de 5 estágios que processa qualquer fonte bruta (vídeos, áudio, PDFs, transcrições) e compila um dossier estruturado de conhecimento.

```js
const { runMegaBrainPipeline } = require('./mega-brain');

const result = await runMegaBrainPipeline({
  type: 'transcript',
  content: '...texto bruto da mentoria...',
  title: '$100M Offers - Alex Hormozi',
  specialist: 'Alex Hormozi',
});
// result: { chunks, insights, dossier, enrichment, metadata }
```

### 🧬 DNA Mapper (`dna-mapper/`)
Extrai e estrutura o modelo mental do especialista em 5 camadas a partir do dossier.

```js
const { mapDNA } = require('./dna-mapper');

const dnaProfile = mapDNA(result.dossier);
// dnaProfile: { philosophy, mentalModel, heuristics, frameworks, methodology }
```

### ⚡ Skill Generator (`skill-generator/`)
Converte os frameworks e metodologias do DNA em skills executáveis operacionais.

```js
const { generateSkills } = require('./skill-generator');

const skills = generateSkills(dnaProfile);
// skills: [{ id, name, description, steps, framework, checklist, category }]
```

### 🔔 Conclave (`conclave/`)
Coordena múltiplos clones para gerar perspectivas cruzadas sobre desafios estratégicos.

```js
const { runConclave } = require('./conclave');

const decision = await runConclave(
  'Como escalar vendas de $1M para $10M em 12 meses?',
  [alextClone, druckerClone],
  { antiPleasing: true, antiBiasing: true }
);
// decision: { challenge, perspectives, hybridDossier, recommendation, meta }
```

## Protocolos do Conclave

| Protocolo | Descrição |
|---|---|
| `antiPleasing` | Respostas honestas sem agradismo — o clone diz a verdade difícil |
| `antiBiasing` | Questiona premissas — investiga o que não foi dito |
| `totalBusinessContext` | Analisa o impacto sistêmico no negócio completo |

## Fluxo Completo

```js
const { runMegaBrainPipeline } = require('./mega-brain');
const { mapDNA } = require('./dna-mapper');
const { generateSkills } = require('./skill-generator');
const { runConclave } = require('./conclave');

// 1. Ingestão
const { dossier } = await runMegaBrainPipeline(source);

// 2. DNA
const dnaProfile = mapDNA(dossier);

// 3. Skills
const skills = generateSkills(dnaProfile);

// 4. Clone ativo
const clone = { name: 'Alex Hormozi Clone', dnaProfile, skills };

// 5. Sessão do Conclave
const decision = await runConclave('desafio estratégico', [clone]);
```

## Stories

- [CLONE-001](../../docs/stories/clone-system/story-clone-mega-brain-pipeline.md) — Mega Brain Pipeline
- [CLONE-002](../../docs/stories/clone-system/story-clone-dna-mapper.md) — DNA Mapper
- [CLONE-003](../../docs/stories/clone-system/story-clone-skill-generator.md) — Skill Generator
- [CLONE-004](../../docs/stories/clone-system/story-clone-conclave.md) — Conclave
