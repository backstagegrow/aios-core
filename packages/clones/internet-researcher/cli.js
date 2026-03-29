#!/usr/bin/env node
'use strict';

/**
 * CLI de teste para o Internet Researcher
 *
 * Uso:
 *   node cli.js "Conrado Adolpho"
 *   node cli.js "Conrado Adolpho" --serper-key=4c26c3d4335ef7afc0e33be854b76a2994f6a190
 *   node cli.js "Conrado Adolpho" --serper-key=4c26c3d4335ef7afc0e33be854b76a2994f6a190 --verbose
 *
 * Ou via env vars:
 *   SERPER_API_KEY=xxx node cli.js "Conrado Adolpho"
 */

const { researchPerson } = require('./index');

// Parse args
const args = process.argv.slice(2);
const name = args.find(a => !a.startsWith('--'));
const serperKey = args.find(a => a.startsWith('--serper-key='))?.split('=')[1]
  || process.env.SERPER_API_KEY;
const verbose = args.includes('--verbose');

if (!name) {
  console.error('Uso: node cli.js "Nome da Pessoa" [--serper-key=xxx] [--verbose]');
  process.exit(1);
}

console.log(`\n🔍 Pesquisando: "${name}"`);
console.log(`🔑 Serper: ${serperKey ? '✓ configurada' : '✗ não fornecida (apenas Wikipedia + Books)'}`);
console.log('─'.repeat(60));

researchPerson(name, {
  serperApiKey: serperKey,
  onProgress: (msg, pct) => {
    const bar = '█'.repeat(Math.floor(pct / 5)) + '░'.repeat(20 - Math.floor(pct / 5));
    process.stdout.write(`\r[${bar}] ${pct}% ${msg}                    `);
  }
})
  .then(result => {
    process.stdout.write('\n');
    console.log('─'.repeat(60));
    console.log(`✅ Dossiê completo para: ${result.subject}`);
    console.log(`   Seções encontradas : ${result.sections.length}`);
    console.log(`   Duplicatas puladas : ${result.skippedDuplicates}`);
    console.log(`   Chunks gerados     : ${result.totalChunks}`);
    console.log(`   Usou Serper        : ${result.usedSerper ? 'sim' : 'não'}`);
    console.log('─'.repeat(60));

    if (verbose) {
      for (const s of result.sections) {
        console.log(`\n📄 ${s.title}`);
        console.log(`   Fonte: ${s.source}`);
        console.log(`   Preview: ${s.content.slice(0, 200).replace(/\n/g, ' ')}...`);
      }
    } else {
      console.log('\nSeções:');
      for (const s of result.sections) {
        console.log(`  • ${s.title}`);
      }
      console.log('\nDica: use --verbose para ver o conteúdo de cada seção');
    }
  })
  .catch(err => {
    process.stdout.write('\n');
    console.error(`\n❌ Erro: ${err.message}`);
    process.exit(1);
  });
