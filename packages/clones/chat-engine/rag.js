'use strict';

/**
 * packages/clones/chat-engine/rag.js
 *
 * RAG (Retrieval-Augmented Generation) module.
 * Searches Pinecone via vector-store and formats context for injection.
 */

const RELEVANCE_THRESHOLD = 0.35;
const DEFAULT_TOP_K = 5;

/**
 * Searches the vector store for relevant chunks and formats them as context.
 *
 * @param {string} cloneSlug - The clone identifier
 * @param {string} query - The user's query text
 * @param {number} [topK=5] - Number of results to fetch
 * @returns {Promise<{contextText: string; sources: Array<{content: string; score: number; metadata: Object}>}>}
 */
async function searchAndFormat(cloneSlug, query, topK = DEFAULT_TOP_K) {
  let searchSimilar;
  try {
    const vectorStore = require('../vector-store/index');
    searchSimilar = vectorStore.searchSimilar;
  } catch (err) {
    console.warn(
      `[RAG] Vector store not available: ${err instanceof Error ? err.message : 'Unknown'}`
    );
    return { contextText: '', sources: [] };
  }

  let results;
  try {
    results = await searchSimilar(cloneSlug, query, topK);
  } catch (err) {
    console.warn(
      `[RAG] Pinecone search failed (continuing without RAG): ${err instanceof Error ? err.message : 'Unknown'}`
    );
    return { contextText: '', sources: [] };
  }

  if (!results || results.length === 0) {
    return { contextText: '', sources: [] };
  }

  // Filter by relevance threshold
  const relevant = results.filter((r) => r.score >= RELEVANCE_THRESHOLD);

  if (relevant.length === 0) {
    return { contextText: '', sources: [] };
  }

  // Format context text
  const contextLines = relevant.map(
    (r, i) => `[${i + 1}] (score: ${r.score.toFixed(2)}) ${r.content}`
  );

  const contextText = `CONTEXTO DA BASE DE CONHECIMENTO:\n${contextLines.join('\n\n')}`;

  return {
    contextText,
    sources: relevant.map((r) => ({
      content: r.content,
      score: r.score,
      metadata: r.metadata,
    })),
  };
}

module.exports = {
  searchAndFormat,
  RELEVANCE_THRESHOLD,
  DEFAULT_TOP_K,
};
