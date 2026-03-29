'use strict';

/**
 * aios-core/packages/clones/internet-researcher/index.js
 *
 * Internet Researcher — Auto-Research Pipeline para o Sistema CLONES
 *
 * Dado apenas o nome de uma pessoa pública, pesquisa automaticamente:
 *   1. Wikipedia PT-BR
 *   2. Wikipedia EN
 *   3. Google Search — Biografia        (requer Serper API key)
 *   4. Google Search — Cursos/Produtos  (requer Serper API key)
 *   5. Google Books  — Autoria
 *   6. Google Books  — Menções
 *
 * Output compatível com packages/clones/mega-brain (RawSource[])
 *
 * Uso:
 *   const { researchPerson } = require('./internet-researcher')
 *   const result = await researchPerson('Conrado Adolpho', {
 *     serperApiKey: process.env.SERPER_API_KEY,
 *     onProgress: (msg, pct) => console.log(`[${pct}%] ${msg}`)
 *   })
 */

const { fetchWikipedia } = require('./sources/wikipedia');
const { fetchSerperBio, fetchSerperProducts } = require('./sources/serper');
const { fetchBooksAuthor, fetchBooksMentions } = require('./sources/books');

/**
 * @typedef {Object} Section
 * @property {string} title
 * @property {string} content
 * @property {string} source
 */

/**
 * @typedef {Object} RawSource
 * @property {'text'} type
 * @property {string} content
 * @property {Object} metadata
 */

/**
 * @typedef {Object} ResearchOptions
 * @property {string} [serperApiKey]     - Serper API key (obrigatório para Google Search)
 * @property {string} [language]         - Idioma preferencial (default: 'pt-BR')
 * @property {Function} [onProgress]     - Callback (message: string, percent: number) => void
 */

/**
 * @typedef {Object} ResearchResult
 * @property {RawSource[]} sources        - Compatível com mega-brain/content-reader
 * @property {Section[]} sections         - Metadados das seções encontradas
 * @property {number} totalChunks
 * @property {number} skippedDuplicates
 * @property {string} subject
 * @property {boolean} usedSerper
 */

/**
 * Executa uma fonte com proteção contra falha individual
 * @param {Function} fn - Função async que retorna Section | Section[] | null
 * @param {Set<string>} seen - Títulos já processados (deduplicação)
 * @param {Section[]} sections - Array de saída
 * @param {{count: number}} skipped - Contador de duplicatas (objeto para mutação)
 */
async function runSource(fn, seen, sections, skipped) {
  try {
    const result = await fn();
    if (!result) return;

    const items = Array.isArray(result) ? result : [result];
    for (const item of items) {
      if (!item || !item.title || !item.content) continue;
      if (seen.has(item.title)) {
        skipped.count++;
        continue;
      }
      seen.add(item.title);
      sections.push(item);
    }
  } catch {
    // Fonte falhou — continua sem interromper o pipeline
  }
}

/**
 * Pesquisa uma pessoa pública na internet e retorna dossiê estruturado
 * @param {string} name - Nome da pessoa
 * @param {ResearchOptions} [options]
 * @returns {Promise<ResearchResult>}
 */
async function researchPerson(name, options = {}) {
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new Error('Nome da pessoa é obrigatório');
  }

  const subject = name.trim();
  const progress = typeof options.onProgress === 'function' ? options.onProgress : () => {};
  const seen = new Set();
  const sections = [];
  const skipped = { count: 0 };
  const hasSerper = Boolean(options.serperApiKey);

  // 1. Wikipedia PT-BR
  progress('📚 Buscando Wikipedia PT-BR...', 10);
  await runSource(() => fetchWikipedia(subject, 'pt'), seen, sections, skipped);

  // 2. Wikipedia EN
  progress('📚 Buscando Wikipedia EN...', 20);
  await runSource(() => fetchWikipedia(subject, 'en'), seen, sections, skipped);

  // 3 & 4. Google Search via Serper (somente se key disponível)
  if (hasSerper) {
    progress('🌐 Buscando Google — Biografia...', 30);
    await runSource(() => fetchSerperBio(subject, options.serperApiKey), seen, sections, skipped);

    progress('🌐 Buscando Google — Cursos/Produtos...', 45);
    await runSource(() => fetchSerperProducts(subject, options.serperApiKey), seen, sections, skipped);
  } else {
    progress('⚠️  Serper key não fornecida — pulando Google Search...', 45);
  }

  // 5. Google Books — autoria
  progress('📖 Buscando livros de autoria...', 55);
  await runSource(() => fetchBooksAuthor(subject), seen, sections, skipped);

  // 6. Google Books — menções
  progress('📖 Buscando menções em livros...', 70);
  await runSource(() => fetchBooksMentions(subject), seen, sections, skipped);

  // Validação
  if (sections.length === 0 && skipped.count === 0) {
    throw new Error(`Nenhuma informação encontrada sobre "${subject}". Verifique se o nome está correto.`);
  }

  if (sections.length === 0) {
    progress(`✅ Tudo atualizado — ${skipped.count} fonte(s) já no dossiê`, 100);
    return { sources: [], sections: [], totalChunks: 0, skippedDuplicates: skipped.count, subject, usedSerper: hasSerper };
  }

  // Converter para RawSource[] compatível com mega-brain
  progress('🔄 Convertendo para formato mega-brain...', 85);
  const sources = sections.map(s => ({
    type: 'text',
    content: `[${s.title}]\nFonte: ${s.source}\n\n${s.content}`,
    metadata: {
      sourceType: 'internet-research',
      subject,
      sectionTitle: s.title,
      sourceUrl: s.source
    }
  }));

  progress('✅ Dossiê completo!', 100);

  return {
    sources,
    sections,
    totalChunks: sources.length,
    skippedDuplicates: skipped.count,
    subject,
    usedSerper: hasSerper
  };
}

module.exports = { researchPerson };
