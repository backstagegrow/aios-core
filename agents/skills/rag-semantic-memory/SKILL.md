---
name: rag-semantic-memory
description: Semantic search and memory layer for aios-core. Use this to find similar copies before creating new ones and to store client context.
---

# 🧠 RAG Semantic Memory Skill

**Ativar antes de:** Gerar qualquer copy, campanha ou landing page para um cliente.

## 🎯 O que este sistema faz
- Armazena todos os copies gerados com **embeddings vetoriais** no Supabase
- Permite busca por **similaridade semântica** — encontra copies parecidos antes de criar novos
- Guarda o contexto estratégico de cada cliente (tom, audiência, diferenciadores) como memória pesquisável

## 🔌 Tabelas no Supabase (pgvector)

| Tabela | Para que serve |
|---|---|
| `copies_memory` | Copies gerados + embedding + client_id + performance_score |
| `client_context_memory` | Estratégia, tom, audiência e diferenciais de cada cliente |

## 🔄 Fluxo de Uso

### 1. Antes de gerar um copy novo
```javascript
const { searchSimilarCopies } = require('./packages/rag/memory');

const similares = await searchSimilarCopies(
  'copy para Instagram de espaço de eventos premium em SP',
  { client_id: 'sp_haus', channel: 'instagram', limit: 3 }
);
// Use as referências para calibrar tom e evitar repetição
```

### 2. Após gerar e aprovar um copy
```javascript
const { storeCopy } = require('./packages/rag/memory');

await storeCopy({
  client_id: 'sp_haus',
  channel: 'instagram',
  framework: 'GMV',
  headline: 'O mito que está te custando o engajamento',
  sub_headline: 'Por que economizar na experiência física do seu evento...',
  body: '...',
  clickup_task_id: '86afz0cyj',
  tags: ['autoridade', 'eventos', 'b2b']
});
```

### 3. Buscar contexto estratégico de um cliente
```javascript
const { searchClientContext } = require('./packages/rag/memory');

const contexto = await searchClientContext(
  'qual é o diferencial da sp HAUS em relação a outros espaços?',
  { client_id: 'sp_haus', context_type: 'strategy' }
);
```

## 📁 Módulo
- **Localização:** `packages/rag/memory.js`
- **Dependências:** `@supabase/supabase-js`, `OPENAI_API_KEY` no `.env`

---
*Sistema RAG integrado ao aios-core usando Supabase pgvector + OpenAI text-embedding-3-small.*
