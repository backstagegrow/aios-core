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

## CLI Unificado

O CLI unifica todos os modulos do sistema CLONES em dois comandos simples.

### Instalacao

Nenhuma instalacao adicional necessaria. O CLI usa os modulos existentes diretamente.

Variaveis de ambiente (opcionais, via `.env` na raiz do projeto):
```bash
SERPER_API_KEY=sua-chave-serper    # Para Google Search via Serper
GEMINI_API_KEY=sua-chave-gemini    # Para features com Gemini
```

### Criar Clone do Zero

```bash
# Pesquisa automatica + pipeline completo
node packages/clones/cli/index.js create "Conrado Adolpho"

# Com Serper API key para Google Search
node packages/clones/cli/index.js create "Alex Hormozi" --serper-key=xxx
```

O comando `create`:
1. Pesquisa o especialista na internet (Wikipedia, Google Search, Google Books)
2. Processa cada fonte via Mega Brain (5 estagios)
3. Extrai DNA mental via DNA Mapper (5 camadas)
4. Gera skills executaveis via Skill Generator
5. Salva profile em `packages/clones/profiles/{slug}.json`

### Melhorar Clone Existente

```bash
# Adicionar fonte via URL
node packages/clones/cli/index.js improve "Conrado Adolpho" --source="https://artigo.com/texto"

# Adicionar fonte via arquivo local
node packages/clones/cli/index.js improve "Conrado Adolpho" --source="caminho/arquivo.txt"
```

O comando `improve`:
1. Carrega profile existente (se houver)
2. Le a nova fonte via Content Reader
3. Processa via Mega Brain
4. Faz merge do dossier novo com o existente
5. Re-extrai DNA e re-gera skills
6. Salva profile atualizado

### Output

O profile e salvo em `packages/clones/profiles/{slug}.json` com a estrutura:

```json
{
  "name": "Conrado Adolpho",
  "slug": "conrado-adolpho",
  "createdAt": "2026-03-25T...",
  "updatedAt": "2026-03-25T...",
  "sources": ["internet-research"],
  "dossier": { "..." },
  "dna": {
    "philosophy": [],
    "mentalModel": [],
    "heuristics": [],
    "frameworks": [],
    "methodology": []
  },
  "skills": [{ "id": "", "name": "", "description": "", "steps": [] }],
  "meta": { "totalChunks": 0, "totalSkills": 0 }
}
```

## Chat Engine (`chat-engine/`)

Motor de chat com streaming token-a-token, RAG via Pinecone, input multimodal (imagem) e deteccao de pedidos de geracao de imagem.

```js
const { chatWithClone, chatGeneric } = require('./chat-engine');

// Chat com clone — streaming + RAG
const result = await chatWithClone('conrado-adolpho', 'qual e o metodo 8Ps?', {
  onToken: (token) => process.stdout.write(token),
  onProgress: (msg) => console.log(msg),
  history: [],           // mensagens anteriores
  imageBase64: null,     // imagem em base64 para input multimodal
});
// result: { response, sources, images, tokensUsed }

// Chat generico sem clone
const generic = await chatGeneric(
  'Voce e um assistente de marketing',
  'como fazer um copy persuasivo?',
  { onToken: (t) => process.stdout.write(t) }
);
```

### CLI de Teste

```bash
# Chat com clone
node packages/clones/chat-engine/cli.js chat "conrado-adolpho" "qual e o metodo 8Ps?"

# Com imagem
node packages/clones/chat-engine/cli.js chat "conrado-adolpho" "analise este criativo" --image="imagem.jpg"

# Chat generico
node packages/clones/chat-engine/cli.js generic "Voce e um assistente" "como fazer copy?"
```

### Sub-modulos

| Modulo | Descricao |
|--------|-----------|
| `index.js` | Entry point — `chatWithClone()`, `chatGeneric()` |
| `rag.js` | Busca Pinecone + formata contexto RAG |
| `gemini.js` | Streaming wrapper com retry/backoff |
| `image-detector.js` | Detecta triggers de imagem + gera via Gemini |
| `history.js` | Converte historico para formato Gemini |
| `cli.js` | CLI para teste manual |

## Stories

- [CLONE-001](../../docs/stories/clone-system/story-clone-mega-brain-pipeline.md) — Mega Brain Pipeline
- [CLONE-002](../../docs/stories/clone-system/story-clone-dna-mapper.md) — DNA Mapper
- [CLONE-003](../../docs/stories/clone-system/story-clone-skill-generator.md) — Skill Generator
- [CLONE-004](../../docs/stories/clone-system/story-clone-conclave.md) — Conclave
