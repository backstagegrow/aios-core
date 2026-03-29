'use strict';

/**
 * Serper source — Google Search via serper.dev
 * Executa 2 queries: biografia + cursos/produtos
 */

const SERPER_URL = 'https://google.serper.dev/search';
const TIMEOUT_MS = 10000;

/**
 * @param {string} name
 * @param {string} apiKey
 * @param {string} query
 * @param {string} label
 * @param {number} num
 * @returns {Promise<Section|null>}
 */
async function serperSearch(name, apiKey, query, label, num = 8) {
  const res = await fetch(SERPER_URL, {
    method: 'POST',
    headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: query, gl: 'br', hl: 'pt-br', num }),
    signal: AbortSignal.timeout(TIMEOUT_MS)
  });

  if (!res.ok) return null;

  const data = await res.json();
  const lines = [];

  // Knowledge Graph
  if (data.knowledgeGraph) {
    const kg = data.knowledgeGraph;
    if (kg.title) lines.push(`## ${kg.title}`);
    if (kg.type) lines.push(`Tipo: ${kg.type}`);
    if (kg.description) lines.push(`\n${kg.description}`);
    if (kg.descriptionSource) lines.push(`(Fonte: ${kg.descriptionSource})`);
    if (kg.attributes) {
      const attrs = Object.entries(kg.attributes)
        .map(([k, v]) => `• ${k}: ${v}`)
        .join('\n');
      lines.push(`\n${attrs}`);
    }
    lines.push('');
  }

  // Resultados orgânicos
  if (data.organic && data.organic.length > 0) {
    lines.push('## Resultados da web\n');
    for (const r of data.organic.slice(0, 6)) {
      lines.push(`### ${r.title}`);
      lines.push(`Fonte: ${r.link}`);
      if (r.snippet) lines.push(r.snippet);
      lines.push('');
    }
  }

  if (lines.length === 0) return null;

  return {
    title: label,
    content: lines.join('\n'),
    source: `https://google.com/search?q=${encodeURIComponent(query)}`
  };
}

/**
 * Busca biografia da pessoa
 * @param {string} name
 * @param {string} apiKey
 * @returns {Promise<Section|null>}
 */
async function fetchSerperBio(name, apiKey) {
  return serperSearch(
    name,
    apiKey,
    `"${name}" quem é biografia`,
    `Google: Perfil de ${name}`,
    8
  );
}

/**
 * Busca cursos, livros e produtos da pessoa
 * @param {string} name
 * @param {string} apiKey
 * @returns {Promise<Section|null>}
 */
async function fetchSerperProducts(name, apiKey) {
  const result = await serperSearch(
    name,
    apiKey,
    `"${name}" curso livro método`,
    `Google: Cursos e produtos de ${name}`,
    5
  );

  if (!result || !result.content) return null;

  return result;
}

module.exports = { fetchSerperBio, fetchSerperProducts };
