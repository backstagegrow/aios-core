#!/usr/bin/env node
'use strict';

/**
 * packages/clones/rag-query.cjs
 *
 * CLI para buscar contexto RAG do Pinecone para um clone específico.
 * Usado pelos agentes Claude Code antes de responder.
 *
 * Uso:
 *   node packages/clones/rag-query.cjs <slug> "<query>" [topK]
 *
 * Exemplo:
 *   node packages/clones/rag-query.cjs alex-hormozi "como criar uma oferta irresistível" 5
 */

const path = require('path');

try {
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
} catch {}

const { searchSimilar } = require('./vector-store');

async function main() {
  const args = process.argv.slice(2);
  const slug = args[0];
  const query = args[1];
  const topK = parseInt(args[2] || '5', 10);

  if (!slug || !query) {
    console.error('Uso: node rag-query.cjs <slug> "<query>" [topK]');
    process.exit(1);
  }

  try {
    const results = await searchSimilar(slug, query, topK);

    if (!results || results.length === 0) {
      console.log('[RAG] Nenhum contexto relevante encontrado.');
      process.exit(0);
    }

    console.log(`[RAG] ${results.length} chunks relevantes encontrados para "${slug}":\n`);
    results.forEach((r, i) => {
      const score = (r.score * 100).toFixed(1);
      const text = r.metadata?.text || r.metadata?.content || JSON.stringify(r.metadata).slice(0, 300);
      console.log(`--- [${i + 1}] score: ${score}% ---`);
      console.log(text);
      console.log('');
    });
  } catch (err) {
    console.error('[RAG] Erro:', err.message);
    process.exit(1);
  }
}

main();
