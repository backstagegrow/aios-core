#!/usr/bin/env node
'use strict';

/**
 * packages/clones/chat-engine/cli.js
 *
 * CLI for testing the Chat Engine manually.
 *
 * Usage:
 *   node cli.js chat <slug> <message> [--image=path]
 *   node cli.js generic <systemPrompt> <message>
 */

const fs = require('fs');
const path = require('path');
const { chatWithClone, chatGeneric } = require('./index');
const { listSessions } = require('./history-obsidian');

/**
 * Parses CLI arguments.
 * @param {string[]} argv
 * @returns {Object}
 */
function parseArgs(argv) {
  const args = argv.slice(2);
  const command = args[0];
  const positional = [];
  const flags = {};

  for (let i = 1; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const [key, ...valueParts] = args[i].slice(2).split('=');
      flags[key] = valueParts.join('=') || true;
    } else {
      positional.push(args[i]);
    }
  }

  return { command, positional, flags };
}

/**
 * Reads a file and returns its base64 content.
 * @param {string} filePath
 * @returns {{base64: string; mimeType: string}}
 */
function readImageAsBase64(filePath) {
  const resolved = path.resolve(filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Image file not found: ${resolved}`);
  }

  const buffer = fs.readFileSync(resolved);
  const base64 = buffer.toString('base64');

  const ext = path.extname(filePath).toLowerCase();
  const mimeMap = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };

  return {
    base64,
    mimeType: mimeMap[ext] || 'image/jpeg',
  };
}

async function main() {
  const { command, positional, flags } = parseArgs(process.argv);

  if (!command || command === 'help' || command === '--help') {
    console.log(`
Chat Engine CLI — Test manual do chat com clones

Uso:
  node cli.js chat <slug> <mensagem> [--image=caminho] [--save] [--session=ID]
  node cli.js generic <systemPrompt> <mensagem>
  node cli.js sessions <slug>

Opcoes:
  --save              Salva historico no Obsidian vault automaticamente
  --session=ID        Continua sessao especifica (ex: 2026-03-25_session-01)
  --vault=PATH        Override do caminho do vault Obsidian

Exemplos:
  node cli.js chat "conrado-adolpho" "qual e o metodo 8Ps?"
  node cli.js chat "conrado-adolpho" "qual e o metodo 8Ps?" --save
  node cli.js chat "conrado-adolpho" "pode detalhar?" --save --session="2026-03-25_session-01"
  node cli.js chat "conrado-adolpho" "analise este criativo" --image="imagem.jpg"
  node cli.js generic "Voce e um assistente de marketing" "como fazer um copy persuasivo?"
  node cli.js sessions "conrado-adolpho"
`);
    process.exit(0);
  }

  if (command === 'chat') {
    const slug = positional[0];
    const message = positional[1];

    if (!slug || !message) {
      console.error('Erro: slug e mensagem sao obrigatorios.');
      console.error('Uso: node cli.js chat <slug> <mensagem>');
      process.exit(1);
    }

    const options = {
      onToken: (token) => process.stdout.write(token),
      onProgress: (msg) => console.error(`\n[status] ${msg}`),
    };

    // Handle image flag
    if (flags.image) {
      const img = readImageAsBase64(flags.image);
      options.imageBase64 = img.base64;
      options.imageMimeType = img.mimeType;
      console.error(`[status] Imagem carregada: ${flags.image} (${img.mimeType})`);
    }

    // Handle --save flag (persist history to Obsidian)
    if (flags.save) {
      options.persistHistory = true;
      console.error('[status] Historico sera salvo no Obsidian vault');
    }

    // Handle --session flag (continue specific session)
    if (flags.session && flags.session !== true) {
      options.sessionId = flags.session;
      console.error(`[status] Continuando sessao: ${flags.session}`);
    }

    // Handle --vault flag (override vault path)
    if (flags.vault && flags.vault !== true) {
      options.obsidianVaultPath = flags.vault;
    }

    console.error(`\n[status] Chat com clone: ${slug}`);
    console.error(`[status] Mensagem: ${message}\n`);
    console.error('---');

    try {
      const result = await chatWithClone(slug, message, options);

      console.error('\n---');
      console.error(`\n[resultado] Tokens usados: ~${result.tokensUsed}`);
      console.error(`[resultado] Sources RAG: ${result.sources.length}`);

      if (result.sessionId) {
        console.error(`[resultado] Sessao: ${result.sessionId}`);
      }

      if (result.images.length > 0) {
        console.error(`[resultado] Imagens geradas: ${result.images.length}`);
      }

      if (result.sources.length > 0) {
        console.error('\n[fontes RAG]');
        result.sources.forEach((s, i) => {
          console.error(`  [${i + 1}] score=${s.score.toFixed(2)} — ${s.content.slice(0, 100)}...`);
        });
      }
    } catch (err) {
      console.error(`\nErro: ${err instanceof Error ? err.message : 'Unknown'}`);
      process.exit(1);
    }
  } else if (command === 'generic') {
    const systemPrompt = positional[0];
    const message = positional[1];

    if (!systemPrompt || !message) {
      console.error('Erro: systemPrompt e mensagem sao obrigatorios.');
      console.error('Uso: node cli.js generic <systemPrompt> <mensagem>');
      process.exit(1);
    }

    const options = {
      onToken: (token) => process.stdout.write(token),
      onProgress: (msg) => console.error(`\n[status] ${msg}`),
    };

    console.error(`\n[status] Chat generico`);
    console.error(`[status] System: ${systemPrompt.slice(0, 80)}...`);
    console.error(`[status] Mensagem: ${message}\n`);
    console.error('---');

    try {
      const result = await chatGeneric(systemPrompt, message, options);

      console.error('\n---');
      console.error(`\n[resultado] Tokens usados: ~${result.tokensUsed}`);
    } catch (err) {
      console.error(`\nErro: ${err instanceof Error ? err.message : 'Unknown'}`);
      process.exit(1);
    }
  } else if (command === 'sessions') {
    const slug = positional[0];

    if (!slug) {
      console.error('Erro: slug e obrigatorio.');
      console.error('Uso: node cli.js sessions <slug>');
      process.exit(1);
    }

    const vaultOpts = {};
    if (flags.vault && flags.vault !== true) {
      vaultOpts.obsidianVaultPath = flags.vault;
    }

    try {
      const sessions = await listSessions(slug, vaultOpts);

      if (sessions.length === 0) {
        console.log(`Nenhuma sessao encontrada para "${slug}".`);
      } else {
        console.log(`\nSessoes de "${slug}" (${sessions.length} total):\n`);
        sessions.forEach((s, i) => {
          const msgs = s.messages ? ` — ${s.messages} msgs` : '';
          console.log(`  [${i + 1}] ${s.sessionId}${msgs}`);
        });
        console.log('');
      }
    } catch (err) {
      console.error(`\nErro: ${err instanceof Error ? err.message : 'Unknown'}`);
      process.exit(1);
    }
  } else {
    console.error(`Comando desconhecido: ${command}`);
    console.error('Use: node cli.js help');
    process.exit(1);
  }
}

main();
