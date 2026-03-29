'use strict';

/**
 * Google Books source — livros de autoria e menções
 */

const BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes';
const TIMEOUT_MS = 8000;

/**
 * @param {string} query
 * @param {number} maxResults
 * @param {string|null} langRestrict
 * @returns {Promise<Object[]>}
 */
async function booksSearch(query, maxResults = 10, langRestrict = null) {
  let url = `${BOOKS_URL}?q=${encodeURIComponent(query)}&maxResults=${maxResults}`;
  if (langRestrict) url += `&langRestrict=${langRestrict}`;

  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) return [];

  const data = await res.json();
  return data?.items || [];
}

/**
 * Formata um volume do Google Books em texto legível
 * @param {Object} item
 * @returns {string}
 */
function formatVolume(item) {
  const info = item.volumeInfo;
  const lines = [];

  lines.push(`📕 "${info.title || 'Sem título'}"${info.subtitle ? ` — ${info.subtitle}` : ''}`);
  if (info.publishedDate) lines.push(`  Publicado: ${info.publishedDate}`);
  if (info.pageCount) lines.push(`  Páginas: ${info.pageCount}`);
  if (info.categories?.length) lines.push(`  Categorias: ${info.categories.join(', ')}`);
  if (info.averageRating) lines.push(`  Avaliação: ${info.averageRating}/5`);
  if (info.description) lines.push(`  Descrição: ${info.description.slice(0, 500)}`);

  return lines.join('\n');
}

/**
 * Busca livros de autoria da pessoa
 * @param {string} name
 * @returns {Promise<Section|null>}
 */
async function fetchBooksAuthor(name) {
  // Tenta PT-BR primeiro, depois sem restrição
  let items = await booksSearch(`inauthor:${name}`, 10, 'pt');
  if (items.length < 3) {
    const more = await booksSearch(`inauthor:${name}`, 10, null);
    const existingIds = new Set(items.map(i => i.id));
    for (const item of more) {
      if (!existingIds.has(item.id)) items.push(item);
    }
  }

  if (items.length === 0) return null;

  const formatted = items.map(formatVolume).join('\n\n');

  return {
    title: `Livros publicados por ${name}`,
    content: `${name} é autor(a) dos seguintes livros:\n\n${formatted}`,
    source: `https://books.google.com/books?q=inauthor:${encodeURIComponent(name)}`
  };
}

/**
 * Busca livros que mencionam a pessoa
 * @param {string} name
 * @returns {Promise<Section|null>}
 */
async function fetchBooksMentions(name) {
  const items = await booksSearch(name, 5, null);
  if (items.length === 0) return null;

  const withDesc = items.filter(i => i.volumeInfo?.description);
  if (withDesc.length === 0) return null;

  const formatted = withDesc
    .map(i => `• "${i.volumeInfo.title}": ${i.volumeInfo.description?.slice(0, 300)}`)
    .join('\n\n');

  return {
    title: `Referências e menções a ${name}`,
    content: `Livros e publicações que mencionam ${name}:\n\n${formatted}`,
    source: `https://books.google.com/books?q=${encodeURIComponent(name)}`
  };
}

module.exports = { fetchBooksAuthor, fetchBooksMentions };
