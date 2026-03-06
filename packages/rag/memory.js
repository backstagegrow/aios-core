/**
 * aios-core/packages/rag/memory.js
 * 
 * Semantic Memory Helper — powered by Supabase pgvector
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

// --- Setup ---
function getEnv() {
    const envPath = path.resolve(__dirname, '../../.env');
    const vars = {};
    try {
        const content = fs.readFileSync(envPath, 'utf-8');
        for (const line of content.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const eq = trimmed.indexOf('=');
            if (eq === -1) continue;
            const key = trimmed.slice(0, eq).trim();
            const value = trimmed.slice(eq + 1).trim();
            vars[key] = value;
        }
    } catch (e) {
        // fallback to process.env
    }
    return vars;
}

const env = getEnv();
const SUPABASE_URL = env.SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = env.OPENAI_API_KEY || process.env.OPENAI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// --- Embedding Generation ---
async function getEmbedding(text) {
    if (!OPENAI_API_KEY) {
        console.warn('[RAG] No OPENAI_API_KEY found - embeddings will not be generated');
        return null;
    }

    return new Promise((resolve, reject) => {
        const body = JSON.stringify({
            input: text.substring(0, 8000), // token limit safety
            model: 'text-embedding-3-small'
        });

        const options = {
            hostname: 'api.openai.com',
            path: '/v1/embeddings',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        };

        const req = https.request(options, res => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => {
                const parsed = JSON.parse(data);
                if (parsed.error) return reject(new Error(parsed.error.message));
                resolve(parsed.data[0].embedding);
            });
        });

        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

// --- Store Copy ---
/**
 * @param {Object} copy
 * @param {string} copy.client_id    - e.g. 'sp_haus'
 * @param {string} copy.channel      - e.g. 'instagram', 'linkedin'
 * @param {string} copy.framework    - e.g. 'GMV'
 * @param {string} copy.headline
 * @param {string} [copy.sub_headline]
 * @param {string} copy.body
 * @param {string} [copy.clickup_task_id]
 * @param {string[]} [copy.tags]
 */
async function storeCopy(copy) {
    const textToEmbed = [copy.headline, copy.sub_headline, copy.body].filter(Boolean).join('\n\n');
    const embedding = await getEmbedding(textToEmbed);

    const { data, error } = await supabase
        .from('copies_memory')
        .insert({ ...copy, embedding })
        .select('id')
        .single();

    if (error) throw error;
    console.log(`✅ Copy stored: ${data.id}`);
    return data.id;
}

// --- Search Similar Copies ---
/**
 * @param {string} query - Describe what kind of copy you need
 * @param {Object} [filters]
 * @param {string} [filters.client_id]
 * @param {string} [filters.channel]
 * @param {number} [filters.limit=5]
 */
async function searchSimilarCopies(query, filters = {}) {
    const embedding = await getEmbedding(query);
    if (!embedding) return [];

    const { data, error } = await supabase.rpc('search_copies', {
        query_embedding: embedding,
        filter_client_id: filters.client_id || null,
        filter_channel: filters.channel || null,
        match_count: filters.limit || 5
    });

    if (error) throw error;
    return data;
}

// --- Store Client Context ---
/**
 * @param {Object} context
 * @param {string} context.client_id
 * @param {string} context.context_type  - 'strategy' | 'tone' | 'audience' | 'competitors' | 'performance'
 * @param {string} context.title
 * @param {string} context.content
 * @param {string} [context.source_file]
 */
async function storeClientContext(context) {
    const textToEmbed = `${context.title}\n\n${context.content}`;
    const embedding = await getEmbedding(textToEmbed);

    const { data, error } = await supabase
        .from('client_context_memory')
        .upsert({ ...context, embedding, updated_at: new Date().toISOString() }, { onConflict: 'client_id,context_type,title' })
        .select('id')
        .single();

    if (error) throw error;
    console.log(`✅ Client context stored: ${data.id}`);
    return data.id;
}

// --- Search Client Context ---
/**
 * @param {string} query
 * @param {Object} [filters]
 * @param {string} [filters.client_id]
 * @param {string} [filters.context_type]
 */
async function searchClientContext(query, filters = {}) {
    const embedding = await getEmbedding(query);
    if (!embedding) return [];

    const { data, error } = await supabase.rpc('search_client_context', {
        query_embedding: embedding,
        filter_client_id: filters.client_id || null,
        filter_context_type: filters.context_type || null,
        match_count: filters.limit || 5
    });

    if (error) throw error;
    return data;
}

module.exports = {
    storeCopy,
    searchSimilarCopies,
    storeClientContext,
    searchClientContext,
    getEmbedding
};
