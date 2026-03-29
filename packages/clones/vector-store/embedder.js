'use strict';

/**
 * packages/clones/vector-store/embedder.js
 *
 * Generates embeddings via Gemini gemini-embedding-001 (768 dimensions).
 * Batches up to 20 texts per request.
 */

const path = require('path');

// Dotenv — loads .env if available
try {
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
} catch {
  // dotenv not installed — uses process.env directly
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_EMBED_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:batchEmbedContents';
const MAX_BATCH_SIZE = 20;
const EMBEDDING_DIMENSIONS = 3072;

/**
 * Generates embeddings for an array of texts using Gemini.
 * Automatically batches in groups of 20.
 *
 * @param {string[]} texts - Array of text strings to embed
 * @returns {Promise<number[][]>} Array of embedding vectors (768 floats each)
 */
async function generateEmbeddings(texts) {
  const apiKey = GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      '[Embedder] GEMINI_API_KEY not found. Set it in .env or as environment variable.'
    );
  }

  if (!texts || texts.length === 0) {
    return [];
  }

  const allEmbeddings = [];

  // Process in batches of MAX_BATCH_SIZE
  for (let i = 0; i < texts.length; i += MAX_BATCH_SIZE) {
    const batch = texts.slice(i, i + MAX_BATCH_SIZE);

    const requestBody = {
      requests: batch.map((text) => ({
        model: 'models/gemini-embedding-001',
        content: {
          parts: [{ text }],
        },
      })),
    };

    const url = `${GEMINI_EMBED_URL}?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unknown error');
      if (response.status === 429) {
        throw new Error(
          `[Embedder] Rate limit exceeded (429). Wait and retry. Details: ${errorBody}`
        );
      }
      if (response.status === 403) {
        throw new Error(
          `[Embedder] Invalid GEMINI_API_KEY or quota exceeded (${response.status}). Details: ${errorBody}`
        );
      }
      throw new Error(
        `[Embedder] Gemini API error (HTTP ${response.status}): ${errorBody}`
      );
    }

    const data = await response.json();

    if (!data.embeddings || !Array.isArray(data.embeddings)) {
      throw new Error(
        '[Embedder] Unexpected Gemini response format — missing embeddings array.'
      );
    }

    for (const embedding of data.embeddings) {
      if (!embedding.values || embedding.values.length !== EMBEDDING_DIMENSIONS) {
        throw new Error(
          `[Embedder] Expected ${EMBEDDING_DIMENSIONS} dimensions, got ${embedding.values ? embedding.values.length : 0}.`
        );
      }
      allEmbeddings.push(embedding.values);
    }
  }

  return allEmbeddings;
}

module.exports = {
  generateEmbeddings,
  EMBEDDING_DIMENSIONS,
  MAX_BATCH_SIZE,
};
