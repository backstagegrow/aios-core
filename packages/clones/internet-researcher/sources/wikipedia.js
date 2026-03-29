'use strict';

/**
 * Wikipedia source — busca artigos em PT-BR e EN
 * Retorna array de Section[] com título, conteúdo e fonte
 */

const TIMEOUT_MS = 8000;

/**
 * @param {string} name - Nome da pessoa a pesquisar
 * @param {'pt'|'en'} lang - Idioma da Wikipedia
 * @returns {Promise<Section[]>}
 */
async function fetchWikipedia(name, lang = 'pt') {
  const label = `Wikipedia (${lang.toUpperCase()}): ${name}`;
  const base = `https://${lang}.wikipedia.org/w/api.php`;

  // 1. Search
  const searchUrl = `${base}?action=query&list=search&srsearch=${encodeURIComponent(name)}&srlimit=3&format=json&origin=*`;
  const searchRes = await fetch(searchUrl, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!searchRes.ok) return [];

  const searchData = await searchRes.json();
  const results = searchData?.query?.search || [];
  if (results.length === 0) return [];

  const sections = [];

  for (const result of results.slice(0, 2)) {
    try {
      const extractUrl = `${base}?action=query&prop=extracts&exintro=false&explaintext=true&pageids=${result.pageid}&format=json&origin=*`;
      const extractRes = await fetch(extractUrl, { signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (!extractRes.ok) continue;

      const extractData = await extractRes.json();
      const pages = extractData?.query?.pages || {};
      const page = Object.values(pages)[0];

      if (page?.extract && page.extract.length > 200) {
        sections.push({
          title: `${label}: ${result.title}`,
          content: page.extract.slice(0, 8000),
          source: `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(result.title)}`
        });
      }
    } catch {
      // Fonte individual falhou — continua
    }
  }

  return sections;
}

module.exports = { fetchWikipedia };
