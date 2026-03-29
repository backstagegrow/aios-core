'use strict';

/**
 * packages/clones/vector-store/pinecone-client.js
 *
 * Lightweight REST wrapper for Pinecone API (no SDK dependency).
 * Uses native fetch.
 *
 * API base for index management: https://api.pinecone.io
 * API base for data operations: https://{index-host} (obtained via describe index)
 */

const path = require('path');

// Dotenv
try {
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
} catch {
  // dotenv not installed
}

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || 'aios-clones';
const PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT || 'us-east-1';
const API_BASE = 'https://api.pinecone.io';

// Cache for index host to avoid repeated describe calls
let _cachedIndexHost = null;

/**
 * Makes an authenticated request to Pinecone control plane API.
 * @param {string} endpoint
 * @param {Object} [options]
 * @returns {Promise<any>}
 */
async function pineconeControlRequest(endpoint, options = {}) {
  const apiKey = PINECONE_API_KEY;
  if (!apiKey) {
    throw new Error(
      '[Pinecone] PINECONE_API_KEY not found. Set it in .env or as environment variable.'
    );
  }

  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Api-Key': apiKey,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error');
    throw new Error(
      `[Pinecone] Control API error (HTTP ${response.status}) on ${endpoint}: ${errorBody}`
    );
  }

  // Some endpoints return 202 with no body
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Makes an authenticated request to Pinecone data plane API (index host).
 * @param {string} host - Index host URL
 * @param {string} endpoint
 * @param {Object} body
 * @returns {Promise<any>}
 */
async function pineconeDataRequest(host, endpoint, body) {
  const apiKey = PINECONE_API_KEY;
  if (!apiKey) {
    throw new Error(
      '[Pinecone] PINECONE_API_KEY not found. Set it in .env or as environment variable.'
    );
  }

  const url = `https://${host}${endpoint}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'Unknown error');
    if (response.status === 429) {
      throw new Error(
        `[Pinecone] Rate limit exceeded (429). Wait and retry. Details: ${errorBody}`
      );
    }
    if (response.status === 403 || response.status === 401) {
      throw new Error(
        `[Pinecone] Authentication failed (${response.status}). Check PINECONE_API_KEY. Details: ${errorBody}`
      );
    }
    throw new Error(
      `[Pinecone] Data API error (HTTP ${response.status}) on ${endpoint}: ${errorBody}`
    );
  }

  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * Describes the index and returns its metadata.
 * @returns {Promise<Object>}
 */
async function describeIndex() {
  return pineconeControlRequest(`/indexes/${PINECONE_INDEX_NAME}`);
}

/**
 * Gets the index host, caching after first call.
 * @returns {Promise<string>}
 */
async function getIndexHost() {
  if (_cachedIndexHost) return _cachedIndexHost;

  const indexInfo = await describeIndex();
  if (!indexInfo || !indexInfo.host) {
    throw new Error(
      `[Pinecone] Could not determine index host for "${PINECONE_INDEX_NAME}". Index may not exist.`
    );
  }
  _cachedIndexHost = indexInfo.host;
  return _cachedIndexHost;
}

/**
 * Creates the index if it does not exist.
 * Serverless, cosine metric, 768 dimensions.
 * @returns {Promise<{created: boolean; name: string; host: string}>}
 */
async function ensureIndex() {
  // Check if index exists
  try {
    const indexInfo = await describeIndex();
    if (indexInfo && indexInfo.host) {
      _cachedIndexHost = indexInfo.host;
      return { created: false, name: PINECONE_INDEX_NAME, host: indexInfo.host };
    }
  } catch (err) {
    // 404 means index doesn't exist — we'll create it
    if (!err.message.includes('404')) {
      throw err;
    }
  }

  // Create serverless index
  console.log(`[Pinecone] Creating index "${PINECONE_INDEX_NAME}"...`);
  await pineconeControlRequest('/indexes', {
    method: 'POST',
    body: JSON.stringify({
      name: PINECONE_INDEX_NAME,
      dimension: 3072,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: PINECONE_ENVIRONMENT,
        },
      },
    }),
  });

  // Wait for index to be ready (poll every 3 seconds, max 60 seconds)
  console.log('[Pinecone] Waiting for index to be ready...');
  const maxWait = 60000;
  const pollInterval = 3000;
  const start = Date.now();

  while (Date.now() - start < maxWait) {
    try {
      const info = await describeIndex();
      if (info && info.status && info.status.ready) {
        _cachedIndexHost = info.host;
        console.log(`[Pinecone] Index ready at ${info.host}`);
        return { created: true, name: PINECONE_INDEX_NAME, host: info.host };
      }
    } catch {
      // Index may not be queryable yet
    }
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  throw new Error(
    `[Pinecone] Index "${PINECONE_INDEX_NAME}" was created but did not become ready within ${maxWait / 1000}s.`
  );
}

/**
 * Upserts vectors into a namespace.
 * @param {string} namespace
 * @param {Array<{id: string; values: number[]; metadata: Object}>} vectors
 * @returns {Promise<Object>}
 */
async function upsertVectors(namespace, vectors) {
  if (!vectors || vectors.length === 0) return { upsertedCount: 0 };

  const host = await getIndexHost();

  // Pinecone accepts max ~100 vectors per upsert, batch if needed
  const BATCH_SIZE = 100;
  let totalUpserted = 0;

  for (let i = 0; i < vectors.length; i += BATCH_SIZE) {
    const batch = vectors.slice(i, i + BATCH_SIZE);
    const result = await pineconeDataRequest(host, '/vectors/upsert', {
      vectors: batch,
      namespace,
    });
    totalUpserted += batch.length;
  }

  return { upsertedCount: totalUpserted };
}

/**
 * Queries vectors in a namespace.
 * @param {string} namespace
 * @param {number[]} vector - Query vector
 * @param {number} [topK=5]
 * @param {boolean} [includeMetadata=true]
 * @returns {Promise<Object>}
 */
async function queryVectors(namespace, vector, topK = 5, includeMetadata = true) {
  const host = await getIndexHost();

  return pineconeDataRequest(host, '/query', {
    namespace,
    vector,
    topK,
    includeMetadata,
  });
}

/**
 * Deletes all vectors in a namespace.
 * @param {string} namespace
 * @returns {Promise<Object>}
 */
async function deleteNamespace(namespace) {
  const host = await getIndexHost();

  return pineconeDataRequest(host, '/vectors/delete', {
    deleteAll: true,
    namespace,
  });
}

/**
 * Gets index statistics.
 * @returns {Promise<Object>}
 */
async function getIndexStats() {
  const host = await getIndexHost();

  return pineconeDataRequest(host, '/describe_index_stats', {});
}

/**
 * Clears cached index host (useful for testing).
 */
function clearHostCache() {
  _cachedIndexHost = null;
}

module.exports = {
  ensureIndex,
  describeIndex,
  getIndexHost,
  upsertVectors,
  queryVectors,
  deleteNamespace,
  getIndexStats,
  clearHostCache,
  // Expose for testing
  PINECONE_INDEX_NAME,
};
