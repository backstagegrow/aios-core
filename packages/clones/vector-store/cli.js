#!/usr/bin/env node

'use strict';

/**
 * packages/clones/vector-store/cli.js
 *
 * CLI for testing the vector store.
 *
 * Usage:
 *   node packages/clones/vector-store/cli.js status
 *   node packages/clones/vector-store/cli.js search "conrado-adolpho" "como escalar vendas"
 *   node packages/clones/vector-store/cli.js stats
 *   node packages/clones/vector-store/cli.js delete "conrado-adolpho"
 */

const path = require('path');

// Dotenv
try {
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
} catch {
  // dotenv not installed
}

const { ensureIndex, searchSimilar, deleteClone, getIndexStats } = require('./index');

function printUsage() {
  console.log(`
Vector Store CLI — Pinecone RAG para CLONES

Uso:
  node packages/clones/vector-store/cli.js <command> [args]

Comandos:
  status                            Verifica se o index existe e esta pronto
  search <cloneSlug> <query> [topK] Busca chunks similares em um clone
  stats                             Mostra estatisticas do index
  delete <cloneSlug>                Deleta todos os vetores de um clone

Exemplos:
  node packages/clones/vector-store/cli.js status
  node packages/clones/vector-store/cli.js search "conrado-adolpho" "como escalar vendas"
  node packages/clones/vector-store/cli.js search "conrado-adolpho" "marketing digital" 10
  node packages/clones/vector-store/cli.js stats
  node packages/clones/vector-store/cli.js delete "conrado-adolpho"
`);
}

async function commandStatus() {
  console.log('[VectorStore CLI] Checking index status...\n');
  try {
    const result = await ensureIndex();
    console.log(`  Index:   ${result.name}`);
    console.log(`  Host:    ${result.host}`);
    console.log(`  Created: ${result.created ? 'Yes (just now)' : 'No (already existed)'}`);
    console.log('\n  Status: READY');
  } catch (err) {
    console.error(`\n  ERROR: ${err.message}`);
    process.exit(1);
  }
}

async function commandSearch(cloneSlug, query, topK) {
  if (!cloneSlug || !query) {
    console.error('Erro: cloneSlug e query sao obrigatorios.');
    console.error('Uso: node cli.js search "clone-slug" "texto da busca" [topK]');
    process.exit(1);
  }

  const k = parseInt(topK, 10) || 5;

  console.log(`[VectorStore CLI] Searching "${cloneSlug}" for: "${query}" (topK=${k})\n`);

  try {
    const results = await searchSimilar(cloneSlug, query, k);

    if (results.length === 0) {
      console.log('  Nenhum resultado encontrado.');
      console.log('  Possibilidades: clone nao indexado ou query sem match.');
      return;
    }

    console.log(`  ${results.length} resultado(s):\n`);

    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      console.log(`  --- Resultado ${i + 1} (score: ${r.score.toFixed(4)}) ---`);
      console.log(`  Section: ${r.metadata.sectionTitle || 'N/A'}`);
      console.log(`  Source:  ${r.metadata.sourceUrl || 'N/A'}`);
      console.log(`  Content: ${(r.content || '').slice(0, 200)}...`);
      console.log('');
    }
  } catch (err) {
    console.error(`\n  ERROR: ${err.message}`);
    process.exit(1);
  }
}

async function commandStats() {
  console.log('[VectorStore CLI] Fetching index stats...\n');
  try {
    // Ensure index exists first
    await ensureIndex();
    const stats = await getIndexStats();

    console.log(`  Total vectors: ${stats.totalVectorCount || 0}`);
    console.log(`  Dimension:     ${stats.dimension || 'N/A'}`);

    if (stats.namespaces && Object.keys(stats.namespaces).length > 0) {
      console.log(`\n  Namespaces:`);
      for (const [ns, info] of Object.entries(stats.namespaces)) {
        console.log(`    ${ns}: ${info.vectorCount || 0} vectors`);
      }
    } else {
      console.log('  Namespaces:    (empty)');
    }
  } catch (err) {
    console.error(`\n  ERROR: ${err.message}`);
    process.exit(1);
  }
}

async function commandDelete(cloneSlug) {
  if (!cloneSlug) {
    console.error('Erro: cloneSlug e obrigatorio.');
    console.error('Uso: node cli.js delete "clone-slug"');
    process.exit(1);
  }

  console.log(`[VectorStore CLI] Deleting clone "${cloneSlug}"...\n`);

  try {
    const result = await deleteClone(cloneSlug);
    console.log(`  Namespace "${result.namespace}" deleted: ${result.deleted}`);
  } catch (err) {
    console.error(`\n  ERROR: ${err.message}`);
    process.exit(1);
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printUsage();
    process.exit(1);
  }

  const command = args[0];

  switch (command) {
    case 'status':
      await commandStatus();
      break;

    case 'search':
      await commandSearch(args[1], args[2], args[3]);
      break;

    case 'stats':
      await commandStats();
      break;

    case 'delete':
      await commandDelete(args[1]);
      break;

    default:
      console.error(`Comando desconhecido: "${command}"\n`);
      printUsage();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(`\nErro fatal: ${err.message}`);
  process.exit(1);
});
