#!/usr/bin/env node

/**
 * aios-core/packages/clones/cli/index.js
 *
 * CLI Unificado do Sistema CLONES
 *
 * Orquestra o pipeline completo de clonagem digital:
 *   create  — Pesquisa + MegaBrain + DNA + Skills → Profile JSON
 *   improve — Nova fonte + MegaBrain + merge + re-DNA + re-Skills → Profile atualizado
 *
 * Uso:
 *   node packages/clones/cli/index.js create "Conrado Adolpho"
 *   node packages/clones/cli/index.js create "Alex Hormozi" --serper-key=xxx
 *   node packages/clones/cli/index.js improve "Conrado Adolpho" --source="https://..."
 *   node packages/clones/cli/index.js improve "Conrado Adolpho" --source="caminho/arquivo.txt"
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Dotenv — carrega .env se disponível (graceful fallback)
// ---------------------------------------------------------------------------
try {
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
} catch {
  // dotenv não instalado — usa process.env direto
}

// ---------------------------------------------------------------------------
// Imports dos módulos CLONES
// ---------------------------------------------------------------------------
const { researchPerson } = require('../internet-researcher');
const { runMegaBrainPipeline } = require('../mega-brain');
const { mapDNA } = require('../dna-mapper');
const { generateSkills } = require('../skill-generator/index.cjs');
const { readContent } = require('../content-reader');
const { upsertChunks } = require('../vector-store');

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const PROFILES_DIR = path.resolve(__dirname, '..', 'profiles');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Converte nome para slug kebab-case.
 * @param {string} name
 * @returns {string}
 */
function toSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Retorna o caminho do profile JSON para um dado nome.
 * @param {string} name
 * @returns {string}
 */
function profilePath(name) {
  return path.join(PROFILES_DIR, `${toSlug(name)}.json`);
}

/**
 * Carrega um profile existente ou retorna null.
 * @param {string} name
 * @returns {Object|null}
 */
function loadProfile(name) {
  const filePath = profilePath(name);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return null;
  }
}

/**
 * Salva o profile JSON.
 * @param {Object} profile
 */
function saveProfile(profile) {
  if (!fs.existsSync(PROFILES_DIR)) {
    fs.mkdirSync(PROFILES_DIR, { recursive: true });
  }
  const filePath = path.join(PROFILES_DIR, `${profile.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(profile, null, 2), 'utf-8');
  return filePath;
}

/**
 * Imprime progresso formatado no terminal.
 * @param {string} msg
 * @param {number} [pct]
 */
function progress(msg, pct) {
  const prefix = pct !== undefined ? `[${String(pct).padStart(3)}%]` : '[    ]';
  console.log(`${prefix} ${msg}`);
}

/**
 * Faz merge profundo de dois dossiers.
 * Arrays são concatenados, objetos são merged recursivamente.
 * @param {Object} existing
 * @param {Object} incoming
 * @returns {Object}
 */
function mergeDossiers(existing, incoming) {
  const merged = { ...existing };

  for (const key of Object.keys(incoming)) {
    if (Array.isArray(incoming[key])) {
      merged[key] = [...(existing[key] || []), ...incoming[key]];
    } else if (incoming[key] && typeof incoming[key] === 'object' && !Array.isArray(incoming[key])) {
      merged[key] = mergeDossiers(existing[key] || {}, incoming[key]);
    } else if (existing[key] === undefined || existing[key] === null) {
      merged[key] = incoming[key];
    }
  }

  return merged;
}

// ---------------------------------------------------------------------------
// Argument Parsing
// ---------------------------------------------------------------------------

/**
 * Analisa argumentos da CLI.
 * @param {string[]} argv
 * @returns {{ command: string; name: string; serperKey: string|null; geminiKey: string|null; source: string|null }}
 */
function parseArgs(argv) {
  const args = argv.slice(2);

  if (args.length === 0) {
    printUsage();
    process.exit(1);
  }

  const command = args[0];
  let name = null;
  let serperKey = process.env.SERPER_API_KEY || null;
  let geminiKey = process.env.GEMINI_API_KEY || null;
  let source = null;

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--serper-key=')) {
      serperKey = arg.split('=').slice(1).join('=');
    } else if (arg.startsWith('--gemini-key=')) {
      geminiKey = arg.split('=').slice(1).join('=');
    } else if (arg.startsWith('--source=')) {
      source = arg.split('=').slice(1).join('=');
    } else if (!name) {
      name = arg;
    }
  }

  return { command, name, serperKey, geminiKey, source };
}

/**
 * Imprime instruções de uso.
 */
function printUsage() {
  console.log(`
CLONES CLI — Sistema de Clonagem Digital de Especialistas

Uso:
  node packages/clones/cli/index.js create "Nome do Especialista" [opcoes]
  node packages/clones/cli/index.js improve "Nome do Especialista" --source="url ou arquivo" [opcoes]

Comandos:
  create   Cria clone do zero (pesquisa internet + pipeline completo)
  improve  Melhora clone existente com nova fonte de dados

Opcoes:
  --serper-key=KEY   Serper API key (ou defina SERPER_API_KEY no .env)
  --gemini-key=KEY   Gemini API key (ou defina GEMINI_API_KEY no .env)
  --source=PATH|URL  Fonte adicional para o comando improve

Variáveis de ambiente (via .env):
  SERPER_API_KEY     Chave da API Serper para Google Search
  GEMINI_API_KEY     Chave da API Gemini

Exemplos:
  node packages/clones/cli/index.js create "Conrado Adolpho"
  node packages/clones/cli/index.js create "Alex Hormozi" --serper-key=xxx
  node packages/clones/cli/index.js improve "Conrado Adolpho" --source="https://artigo.com/texto"
  node packages/clones/cli/index.js improve "Conrado Adolpho" --source="caminho/arquivo.txt"
`);
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

/**
 * Comando CREATE — cria um clone do zero.
 * @param {string} name
 * @param {{ serperKey: string|null }} options
 */
async function commandCreate(name, options) {
  const slug = toSlug(name);
  console.log(`\n=== CLONES CLI — Criando clone de "${name}" (${slug}) ===\n`);

  // Step 1: Internet Research
  progress('Iniciando pesquisa na internet...', 0);
  let researchResult;
  try {
    researchResult = await researchPerson(name, {
      serperApiKey: options.serperKey,
      onProgress: progress,
    });
  } catch (err) {
    console.error(`\nErro na pesquisa: ${err.message}`);
    console.error('Verifique se o nome esta correto e tente novamente.');
    process.exit(1);
  }

  if (researchResult.sources.length === 0) {
    console.error(`\nNenhuma fonte encontrada para "${name}".`);
    process.exit(1);
  }

  progress(`${researchResult.sources.length} fonte(s) encontrada(s)`, 30);

  // Step 2: Mega Brain Pipeline para cada fonte
  progress('Processando fontes via Mega Brain...', 35);
  const allDossiers = [];
  const allChunks = [];
  let totalChunks = 0;

  for (let i = 0; i < researchResult.sources.length; i++) {
    const source = researchResult.sources[i];
    const pct = 35 + Math.round((i / researchResult.sources.length) * 25);
    progress(`  Processando fonte ${i + 1}/${researchResult.sources.length}...`, pct);

    try {
      const mbResult = await runMegaBrainPipeline(source);
      allDossiers.push(mbResult.dossier);
      totalChunks += mbResult.chunks.length;
      // Collect chunks for vector store upsert
      for (const chunk of mbResult.chunks) {
        allChunks.push(chunk);
      }
    } catch (err) {
      console.warn(`  Aviso: falha ao processar fonte ${i + 1}: ${err.message}`);
    }
  }

  if (allDossiers.length === 0) {
    console.error('\nNenhuma fonte processada com sucesso pelo Mega Brain.');
    process.exit(1);
  }

  // Merge all dossiers into one
  let combinedDossier = allDossiers[0];
  for (let i = 1; i < allDossiers.length; i++) {
    combinedDossier = mergeDossiers(combinedDossier, allDossiers[i]);
  }
  combinedDossier.specialist = name;

  // Step 2.5: Upsert chunks to Pinecone vector store
  progress('Persistindo vetores no Pinecone...', 62);
  try {
    if (allChunks.length > 0) {
      const upsertResult = await upsertChunks(slug, allChunks);
      progress(`${upsertResult.upsertedCount} vetores persistidos no Pinecone`, 64);
    }
  } catch (err) {
    console.warn(`  Aviso: falha ao persistir vetores no Pinecone: ${err.message}`);
    console.warn('  O clone sera criado sem busca vetorial. Execute novamente para indexar.');
  }

  // Step 3: DNA Mapping
  progress('Extraindo DNA mental...', 65);
  let dnaProfile;
  try {
    dnaProfile = mapDNA(combinedDossier);
  } catch (err) {
    console.error(`\nErro ao mapear DNA: ${err.message}`);
    process.exit(1);
  }

  // Step 4: Skill Generation
  progress('Gerando skills executaveis...', 80);
  let skills;
  try {
    skills = generateSkills(dnaProfile);
  } catch (err) {
    console.error(`\nErro ao gerar skills: ${err.message}`);
    process.exit(1);
  }

  // Step 5: Build and save profile
  progress('Salvando profile...', 90);
  const now = new Date().toISOString();
  const profile = {
    name,
    slug,
    createdAt: now,
    updatedAt: now,
    sources: ['internet-research'],
    dossier: combinedDossier,
    dna: {
      philosophy: dnaProfile.philosophy,
      mentalModel: dnaProfile.mentalModel,
      heuristics: dnaProfile.heuristics,
      frameworks: dnaProfile.frameworks,
      methodology: dnaProfile.methodology,
    },
    skills: skills.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      steps: s.steps,
    })),
    meta: {
      totalChunks,
      totalSkills: skills.length,
    },
  };

  const savedPath = saveProfile(profile);
  progress('Profile salvo com sucesso!', 100);

  // Step 6: Summary
  console.log(`\n=== Resumo ===`);
  console.log(`  Nome:       ${name}`);
  console.log(`  Slug:       ${slug}`);
  console.log(`  Fontes:     ${researchResult.sources.length}`);
  console.log(`  Chunks:     ${totalChunks}`);
  console.log(`  Filosofia:  ${dnaProfile.philosophy.length} itens`);
  console.log(`  Modelos:    ${dnaProfile.mentalModel.length} itens`);
  console.log(`  Heuristicas:${dnaProfile.heuristics.length} itens`);
  console.log(`  Frameworks: ${dnaProfile.frameworks.length} itens`);
  console.log(`  Metodologia:${dnaProfile.methodology.length} itens`);
  console.log(`  Skills:     ${skills.length}`);
  console.log(`  Arquivo:    ${savedPath}`);
  console.log('');
}

/**
 * Comando IMPROVE — melhora clone existente com nova fonte.
 * @param {string} name
 * @param {string} source
 */
async function commandImprove(name, source) {
  const slug = toSlug(name);
  console.log(`\n=== CLONES CLI — Melhorando clone de "${name}" (${slug}) ===\n`);

  // Step 1: Load existing profile (optional — will create if not found)
  const existingProfile = loadProfile(name);
  if (existingProfile) {
    progress(`Profile existente carregado (${existingProfile.meta.totalSkills} skills)`, 10);
  } else {
    progress('Nenhum profile existente encontrado — sera criado um novo', 10);
  }

  // Step 2: Read new source via content-reader
  progress('Lendo nova fonte...', 20);
  let rawSource;
  try {
    rawSource = await readContent(source, { specialist: name });
  } catch (err) {
    console.error(`\nErro ao ler fonte: ${err.message}`);
    console.error('Verifique se o caminho/URL esta correto.');
    process.exit(1);
  }

  progress(`Fonte lida: "${rawSource.title}" (${rawSource.content.length} chars)`, 30);

  // Step 3: Process via Mega Brain
  progress('Processando via Mega Brain...', 40);
  let mbResult;
  try {
    mbResult = await runMegaBrainPipeline(rawSource);
  } catch (err) {
    console.error(`\nErro no Mega Brain: ${err.message}`);
    process.exit(1);
  }

  // Step 4: Merge dossiers
  progress('Fazendo merge dos dossiers...', 55);
  let combinedDossier;
  if (existingProfile && existingProfile.dossier) {
    combinedDossier = mergeDossiers(existingProfile.dossier, mbResult.dossier);
  } else {
    combinedDossier = mbResult.dossier;
  }
  combinedDossier.specialist = name;

  // Step 5: Re-map DNA
  progress('Re-extraindo DNA mental...', 65);
  let dnaProfile;
  try {
    dnaProfile = mapDNA(combinedDossier);
  } catch (err) {
    console.error(`\nErro ao mapear DNA: ${err.message}`);
    process.exit(1);
  }

  // Step 6: Re-generate skills
  progress('Re-gerando skills executaveis...', 80);
  let skills;
  try {
    skills = generateSkills(dnaProfile);
  } catch (err) {
    console.error(`\nErro ao gerar skills: ${err.message}`);
    process.exit(1);
  }

  // Step 7: Build and save updated profile
  progress('Salvando profile atualizado...', 90);
  const now = new Date().toISOString();
  const sourceLabel = source.startsWith('http') ? `url:${source}` : `file:${source}`;
  const existingSources = (existingProfile && existingProfile.sources) || [];
  const updatedSources = [...new Set([...existingSources, sourceLabel])];

  const profile = {
    name,
    slug,
    createdAt: (existingProfile && existingProfile.createdAt) || now,
    updatedAt: now,
    sources: updatedSources,
    dossier: combinedDossier,
    dna: {
      philosophy: dnaProfile.philosophy,
      mentalModel: dnaProfile.mentalModel,
      heuristics: dnaProfile.heuristics,
      frameworks: dnaProfile.frameworks,
      methodology: dnaProfile.methodology,
    },
    skills: skills.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      steps: s.steps,
    })),
    meta: {
      totalChunks: mbResult.chunks.length + ((existingProfile && existingProfile.meta && existingProfile.meta.totalChunks) || 0),
      totalSkills: skills.length,
    },
  };

  const savedPath = saveProfile(profile);
  progress('Profile atualizado com sucesso!', 100);

  // Step 8: Summary
  console.log(`\n=== Resumo ===`);
  console.log(`  Nome:        ${name}`);
  console.log(`  Slug:        ${slug}`);
  console.log(`  Nova fonte:  ${sourceLabel}`);
  console.log(`  Total fontes:${updatedSources.length}`);
  console.log(`  Chunks:      ${profile.meta.totalChunks}`);
  console.log(`  Filosofia:   ${dnaProfile.philosophy.length} itens`);
  console.log(`  Modelos:     ${dnaProfile.mentalModel.length} itens`);
  console.log(`  Heuristicas: ${dnaProfile.heuristics.length} itens`);
  console.log(`  Frameworks:  ${dnaProfile.frameworks.length} itens`);
  console.log(`  Metodologia: ${dnaProfile.methodology.length} itens`);
  console.log(`  Skills:      ${skills.length}`);
  console.log(`  Arquivo:     ${savedPath}`);
  console.log('');
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const { command, name, serperKey, source } = parseArgs(process.argv);

  switch (command) {
    case 'create': {
      if (!name) {
        console.error('Erro: nome do especialista e obrigatorio.\n');
        console.error('Uso: node packages/clones/cli/index.js create "Nome do Especialista"');
        process.exit(1);
      }
      await commandCreate(name, { serperKey });
      break;
    }

    case 'improve': {
      if (!name) {
        console.error('Erro: nome do especialista e obrigatorio.\n');
        console.error('Uso: node packages/clones/cli/index.js improve "Nome" --source="url ou arquivo"');
        process.exit(1);
      }
      if (!source) {
        console.error('Erro: --source e obrigatorio para o comando improve.\n');
        console.error('Uso: node packages/clones/cli/index.js improve "Nome" --source="url ou arquivo"');
        process.exit(1);
      }
      await commandImprove(name, source);
      break;
    }

    default:
      console.error(`Erro: comando desconhecido "${command}".\n`);
      printUsage();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(`\nErro fatal: ${err.message}`);
  process.exit(1);
});
