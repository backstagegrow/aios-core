/**
 * aios-core/packages/rag/memory.js
 *
 * Semantic Memory Helper powered by Supabase pgvector
 *
 * Use this module to:
 * 1. Store copies with embeddings after generation
 * 2. Search for similar copies before generating new ones
 * 3. Store and retrieve client strategic context
 */

const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const fs = require('fs');
const path = require('path');

function getEnv() {
  const envPath = path.resolve(__dirname, '../../.env');
  const vars = {};
  if (!fs.existsSync(envPath)) return vars;
  try {
    const content = fs.readFileSync(envPath, 'utf-8');
    const lines = content.split(/\r?\n/);
    for (const line of lines) {
      const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)$/);
      if (match) {
        const key = match[1];
        let value = match[2].trim();
        // Remove inline comments
        if (value.includes(' #')) {
          value = value.substring(0, value.indexOf(' #')).trim();
        }
        // Handle quotes
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.substring(1, value.length - 1);
        }
        vars[key] = value;
      }
    }
  } catch (_error) {
    // Fall back to process.env.
  }
  return vars;
}

const env = getEnv();
const SUPABASE_URL = env.SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = env.OPENAI_API_KEY || process.env.OPENAI_API_KEY;
const RAG_DEBUG_ENABLED = process.env.AIOS_DEBUG === 'true' || process.env.AIOS_RAG_DEBUG === 'true';

let missingEmbeddingKeyWarned = false;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function getEmbedding(text) {
  if (!OPENAI_API_KEY) {
    if (RAG_DEBUG_ENABLED && !missingEmbeddingKeyWarned) {
      missingEmbeddingKeyWarned = true;
      console.warn('[RAG] No OPENAI_API_KEY found - embeddings will not be generated');
    }
    return null;
  }

  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      input: text.substring(0, 8000),
      model: 'text-embedding-3-small',
    });

    const options = {
      hostname: 'api.openai.com',
      path: '/v1/embeddings',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const parsed = JSON.parse(data);
        if (parsed.error) {
          reject(new Error(parsed.error.message));
          return;
        }
        resolve(parsed.data[0].embedding);
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function storeCopy(copy) {
  const textToEmbed = [copy.headline, copy.sub_headline, copy.body].filter(Boolean).join('\n\n');
  const embedding = await getEmbedding(textToEmbed);

  const { data, error } = await supabase
    .from('copies_memory')
    .insert({ ...copy, embedding })
    .select('id')
    .single();

  if (error) throw error;
  if (RAG_DEBUG_ENABLED) {
    console.log(`Copy stored: ${data.id}`);
  }
  return data.id;
}

async function searchSimilarCopies(query, filters = {}) {
  const embedding = await getEmbedding(query);
  if (!embedding) return [];

  const { data, error } = await supabase.rpc('search_copies', {
    query_embedding: embedding,
    filter_client_id: filters.client_id || null,
    filter_channel: filters.channel || null,
    match_count: filters.limit || 5,
  });

  if (error) throw error;
  return data;
}

async function storeClientContext(context) {
  const textToEmbed = `${context.title}\n\n${context.content}`;
  const embedding = await getEmbedding(textToEmbed);

  const { data, error } = await supabase
    .from('client_context_memory')
    .upsert(
      { ...context, embedding, updated_at: new Date().toISOString() },
      { onConflict: 'client_id,context_type,title' },
    )
    .select('id')
    .single();

  if (error) throw error;
  if (RAG_DEBUG_ENABLED) {
    console.log(`Client context stored: ${data.id}`);
  }
  return data.id;
}

async function searchClientContext(query, filters = {}) {
  const embedding = await getEmbedding(query);
  if (!embedding) return [];

  const { data, error } = await supabase.rpc('search_client_context', {
    query_embedding: embedding,
    filter_client_id: filters.client_id || null,
    filter_context_type: filters.context_type || null,
    match_count: filters.limit || 5,
  });

  if (error) throw error;
  return data;
}

async function storeAgentExperience(experience) {
  const textToEmbed = `Agent: ${experience.agent_name}\nTask: ${experience.task_type}\nScore: ${experience.outcome_score}\nSummary: ${experience.summary}`;
  const embedding = await getEmbedding(textToEmbed);

  const { data, error } = await supabase
    .from('agent_experiences')
    .insert({ ...experience, embedding })
    .select('id')
    .single();

  if (error) throw error;
  if (RAG_DEBUG_ENABLED) {
    console.log(`Agent experience stored: ${data.id}`);
  }
  return data.id;
}

async function searchAgentExperiences(query, filters = {}) {
  const embedding = await getEmbedding(query);
  if (!embedding) return [];

  const { data, error } = await supabase.rpc('search_agent_experiences', {
    query_embedding: embedding,
    filter_agent_name: filters.agent_name || null,
    match_count: filters.limit || 5,
  });

  if (error) throw error;
  return data;
}

module.exports = {
  storeCopy,
  searchSimilarCopies,
  storeClientContext,
  searchClientContext,
  storeAgentExperience,
  searchAgentExperiences,
  getEmbedding,
};
