'use strict';

/**
 * packages/clones/vector-store/index.js
 *
 * High-level interface for Pinecone vector store in the CLONES system.
 * Handles embedding generation + Pinecone operations.
 *
 * Exports:
 *   - ensureIndex()
 *   - upsertChunks(cloneSlug, chunks)
 *   - searchSimilar(cloneSlug, queryText, topK)
 *   - deleteClone(cloneSlug)
 */

const { generateEmbeddings } = require('./embedder');
const {
  ensureIndex: pineconeEnsureIndex,
  upsertVectors,
  queryVectors,
  deleteNamespace,
  getIndexStats,
} = require('./pinecone-client');

/**
 * Converts a clone slug to its Pinecone namespace.
 * @param {string} cloneSlug
 * @returns {string}
 */
function toNamespace(cloneSlug) {
  return `clone_${cloneSlug}`;
}

/**
 * Ensures the Pinecone index exists and is ready.
 * Creates it if necessary (serverless, cosine, 768 dims).
 * @returns {Promise<{created: boolean; name: string; host: string}>}
 */
async function ensureIndex() {
  try {
    return await pineconeEnsureIndex();
  } catch (err) {
    throw new Error(
      `[VectorStore] Failed to ensure index: ${err instanceof Error ? err.message : 'Unknown error'}`
    );
  }
}

/**
 * Upserts chunks from a clone into Pinecone.
 * Converts text to embeddings and stores with metadata.
 *
 * @param {string} cloneSlug - The clone identifier (e.g., "conrado-adolpho")
 * @param {Array<{text: string; source?: string; specialist?: string}>} chunks - MegaBrain chunks
 * @param {Object} [sourceMetadata] - Optional metadata from the research source
 * @param {string} [sourceMetadata.sourceType]
 * @param {string} [sourceMetadata.sectionTitle]
 * @param {string} [sourceMetadata.sourceUrl]
 * @returns {Promise<{upsertedCount: number; namespace: string}>}
 */
async function upsertChunks(cloneSlug, chunks, sourceMetadata = {}) {
  if (!cloneSlug || typeof cloneSlug !== 'string') {
    throw new Error('[VectorStore] cloneSlug is required and must be a string.');
  }
  if (!chunks || chunks.length === 0) {
    console.log('[VectorStore] No chunks to upsert — skipping.');
    return { upsertedCount: 0, namespace: toNamespace(cloneSlug) };
  }

  const namespace = toNamespace(cloneSlug);

  // Extract text content from chunks
  const texts = chunks.map((chunk) => chunk.text || '');

  // Generate embeddings
  console.log(`[VectorStore] Generating embeddings for ${texts.length} chunks...`);
  let embeddings;
  try {
    embeddings = await generateEmbeddings(texts);
  } catch (err) {
    throw new Error(
      `[VectorStore] Failed to generate embeddings: ${err instanceof Error ? err.message : 'Unknown error'}`
    );
  }

  if (embeddings.length !== chunks.length) {
    throw new Error(
      `[VectorStore] Embedding count mismatch: got ${embeddings.length}, expected ${chunks.length}.`
    );
  }

  // Build Pinecone vectors
  const vectors = chunks.map((chunk, i) => ({
    id: `${cloneSlug}_${String(i).padStart(4, '0')}`,
    values: embeddings[i],
    metadata: {
      cloneSlug,
      content: (chunk.text || '').slice(0, 40000), // Pinecone metadata limit ~40KB
      sourceType: sourceMetadata.sourceType || 'internet-research',
      sectionTitle: sourceMetadata.sectionTitle || chunk.source || '',
      sourceUrl: sourceMetadata.sourceUrl || '',
      chunkIndex: i,
    },
  }));

  // Ensure index exists before upserting
  await ensureIndex();

  // Upsert
  console.log(`[VectorStore] Upserting ${vectors.length} vectors to namespace "${namespace}"...`);
  const result = await upsertVectors(namespace, vectors);
  console.log(`[VectorStore] Upserted ${result.upsertedCount} vectors successfully.`);

  return { upsertedCount: result.upsertedCount, namespace };
}

/**
 * Searches for similar chunks in a clone's namespace.
 *
 * @param {string} cloneSlug - The clone identifier
 * @param {string} queryText - The search query
 * @param {number} [topK=5] - Number of results to return
 * @returns {Promise<Array<{score: number; content: string; metadata: Object}>>}
 */
async function searchSimilar(cloneSlug, queryText, topK = 5) {
  if (!cloneSlug || typeof cloneSlug !== 'string') {
    throw new Error('[VectorStore] cloneSlug is required and must be a string.');
  }
  if (!queryText || typeof queryText !== 'string') {
    throw new Error('[VectorStore] queryText is required and must be a string.');
  }

  const namespace = toNamespace(cloneSlug);

  // Generate embedding for query
  console.log(`[VectorStore] Generating query embedding...`);
  const embeddings = await generateEmbeddings([queryText]);
  if (!embeddings || embeddings.length === 0) {
    throw new Error('[VectorStore] Failed to generate query embedding.');
  }

  // Ensure index exists
  await ensureIndex();

  // Query Pinecone
  console.log(`[VectorStore] Searching namespace "${namespace}" (topK=${topK})...`);
  const response = await queryVectors(namespace, embeddings[0], topK);

  if (!response || !response.matches) {
    return [];
  }

  // Format results
  return response.matches.map((match) => ({
    score: match.score,
    content: match.metadata ? match.metadata.content : '',
    metadata: match.metadata || {},
  }));
}

/**
 * Deletes all vectors for a clone (deletes entire namespace).
 *
 * @param {string} cloneSlug - The clone identifier
 * @returns {Promise<{deleted: boolean; namespace: string}>}
 */
async function deleteClone(cloneSlug) {
  if (!cloneSlug || typeof cloneSlug !== 'string') {
    throw new Error('[VectorStore] cloneSlug is required and must be a string.');
  }

  const namespace = toNamespace(cloneSlug);

  console.log(`[VectorStore] Deleting namespace "${namespace}"...`);

  try {
    await ensureIndex();
    await deleteNamespace(namespace);
    console.log(`[VectorStore] Namespace "${namespace}" deleted successfully.`);
    return { deleted: true, namespace };
  } catch (err) {
    throw new Error(
      `[VectorStore] Failed to delete clone "${cloneSlug}": ${err instanceof Error ? err.message : 'Unknown error'}`
    );
  }
}

module.exports = {
  ensureIndex,
  upsertChunks,
  searchSimilar,
  deleteClone,
  // Re-export for CLI stats
  getIndexStats,
  // Utility
  toNamespace,
};
