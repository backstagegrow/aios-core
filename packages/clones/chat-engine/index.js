'use strict';

/**
 * packages/clones/chat-engine/index.js
 *
 * Chat Engine for the CLONES system.
 * Provides streaming chat with RAG context injection and multimodal support.
 *
 * Exports:
 *   - chatWithClone(cloneSlug, userMessage, options)
 *   - chatGeneric(systemPrompt, userMessage, options)
 */

const fs = require('fs');
const path = require('path');
const { searchAndFormat } = require('./rag');
const { streamGenerate, buildUserParts } = require('./gemini');
const { isImageRequest, generateImage } = require('./image-detector');
const { toGeminiHistory } = require('./history');
const historyObsidian = require('./history-obsidian');

// Load .env if dotenv is available
try {
  require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
} catch (_) {
  // dotenv not installed — rely on process.env
}

const PROFILES_DIR = path.resolve(__dirname, '../profiles');

/**
 * Loads a clone profile from disk.
 *
 * @param {string} slug - Clone slug (e.g., "conrado-adolpho")
 * @returns {Object} Clone profile
 * @throws {Error} If profile not found
 */
function loadProfile(slug) {
  const profilePath = path.join(PROFILES_DIR, `${slug}.json`);

  if (!fs.existsSync(profilePath)) {
    throw new Error(
      `[ChatEngine] Profile not found: ${profilePath}. Create the clone first using the CLI.`
    );
  }

  const raw = fs.readFileSync(profilePath, 'utf-8');
  return JSON.parse(raw);
}

/**
 * Builds a system prompt from the clone profile.
 *
 * @param {Object} profile - Clone profile object
 * @returns {string} System prompt text
 */
function buildSystemPrompt(profile) {
  // Use systemPrompt field if it exists
  if (profile.systemPrompt) {
    return profile.systemPrompt;
  }

  // Build from DNA fields
  const parts = [];

  parts.push(`Voce e ${profile.name}, um especialista clonado digitalmente.`);
  parts.push('Responda SEMPRE como se fosse o proprio especialista, em primeira pessoa.');
  parts.push('Use o conhecimento abaixo para fundamentar suas respostas.\n');

  if (profile.dna) {
    if (profile.dna.philosophy && profile.dna.philosophy.length > 0) {
      parts.push('FILOSOFIA:');
      profile.dna.philosophy.forEach((p) => parts.push(`- ${typeof p === 'string' ? p : p.principle || JSON.stringify(p)}`));
      parts.push('');
    }

    if (profile.dna.mentalModel && profile.dna.mentalModel.length > 0) {
      parts.push('MODELO MENTAL:');
      profile.dna.mentalModel.forEach((m) => parts.push(`- ${typeof m === 'string' ? m : m.concept || JSON.stringify(m)}`));
      parts.push('');
    }

    if (profile.dna.frameworks && profile.dna.frameworks.length > 0) {
      parts.push('FRAMEWORKS:');
      profile.dna.frameworks.forEach((f) => parts.push(`- ${typeof f === 'string' ? f : f.name || JSON.stringify(f)}`));
      parts.push('');
    }

    if (profile.dna.methodology && profile.dna.methodology.length > 0) {
      parts.push('METODOLOGIA:');
      profile.dna.methodology.forEach((m) => parts.push(`- ${typeof m === 'string' ? m : m.step || JSON.stringify(m)}`));
      parts.push('');
    }
  }

  if (profile.skills && profile.skills.length > 0) {
    parts.push('SKILLS DISPONIVEIS:');
    profile.skills.slice(0, 10).forEach((s) => {
      parts.push(`- ${s.name}: ${s.description || ''}`);
    });
    parts.push('');
  }

  parts.push('INSTRUCOES:');
  parts.push('- Responda de forma pratica e direta, como o especialista faria.');
  parts.push('- Use exemplos reais quando possivel.');
  parts.push('- Se receber contexto da base de conhecimento, priorize esse conteudo.');
  parts.push('- Se nao souber algo, diga honestamente.');

  return parts.join('\n');
}

/**
 * Chat with a specific clone — streaming, with RAG and multimodal support.
 *
 * @param {string} cloneSlug - Clone identifier (e.g., "conrado-adolpho")
 * @param {string} userMessage - User's message
 * @param {Object} [options={}]
 * @param {Array} [options.history=[]] - Chat history
 * @param {string} [options.imageBase64] - Base64-encoded image for multimodal input
 * @param {string} [options.imageMimeType='image/jpeg'] - Image MIME type
 * @param {Function} [options.onToken] - Streaming token callback
 * @param {Function} [options.onProgress] - Progress status callback
 * @param {number} [options.temperature=0.7]
 * @param {number} [options.maxOutputTokens=8192]
 * @param {boolean} [options.persistHistory=false] - Persist to Obsidian vault
 * @param {string|null} [options.sessionId=null] - Session to continue (null = auto-resolve)
 * @param {string} [options.obsidianVaultPath] - Override Obsidian vault path
 * @returns {Promise<{response: string; sources: Array; images: Array; tokensUsed: number; sessionId?: string}>}
 */
async function chatWithClone(cloneSlug, userMessage, options = {}) {
  const {
    history: historyInput = [],
    imageBase64 = null,
    imageMimeType = 'image/jpeg',
    onToken = null,
    onProgress = null,
    temperature = 0.7,
    maxOutputTokens = 8192,
    persistHistory = false,
    sessionId: inputSessionId = null,
    obsidianVaultPath,
  } = options;

  let history = historyInput;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('[ChatEngine] GEMINI_API_KEY not set in environment or .env file');
  }

  // 1. Load profile
  if (onProgress) onProgress('Carregando perfil do clone...');
  const profile = loadProfile(cloneSlug);

  // 2. Resolve session if persisting history
  let resolvedSessionId = null;
  if (persistHistory) {
    const obsOpts = { obsidianVaultPath };

    if (inputSessionId) {
      // Use explicit session
      resolvedSessionId = inputSessionId;
    } else {
      // Try to find today's latest session, or create a new one
      const today = new Date().toISOString().slice(0, 10);
      const latest = await historyObsidian.loadLatestSession(cloneSlug, obsOpts);

      if (latest && latest.sessionId.startsWith(today)) {
        resolvedSessionId = latest.sessionId;
        // Use persisted history if no history was provided
        if (historyInput.length === 0 && latest.history.length > 0) {
          history = latest.history;
        }
      } else {
        resolvedSessionId = await historyObsidian.createSession(cloneSlug, obsOpts);
      }
    }

    if (onProgress) onProgress(`Sessao: ${resolvedSessionId}`);
  }

  // 3. Check for image generation request
  if (isImageRequest(userMessage)) {
    if (onProgress) onProgress('Detectado pedido de imagem. Gerando...');
    const imageResult = await generateImage(userMessage, apiKey);

    if (imageResult) {
      const responseText = 'Imagem gerada com sucesso! Veja o resultado acima.';
      if (onToken) onToken(responseText);

      return {
        response: responseText,
        sources: [],
        images: [imageResult],
        tokensUsed: 0,
      };
    }

    // Fallback: image generation failed, continue with text response
    if (onProgress) onProgress('Geracao de imagem falhou. Respondendo em texto...');
  }

  // 4. RAG search
  if (onProgress) onProgress('Buscando contexto relevante...');
  const { contextText, sources } = await searchAndFormat(cloneSlug, userMessage);

  // 5. Build system prompt with RAG context
  let systemPrompt = buildSystemPrompt(profile);
  if (contextText) {
    systemPrompt += '\n\n' + contextText;
  }

  // 6. Build contents: history + current message (+ image if multimodal)
  const geminiHistory = toGeminiHistory(history);
  const userParts = buildUserParts(userMessage, imageBase64, imageMimeType);

  const contents = [
    ...geminiHistory,
    { role: 'user', parts: userParts },
  ];

  // 7. Stream from Gemini
  if (onProgress) onProgress('Gerando resposta...');
  const { fullText, tokensUsed } = await streamGenerate({
    apiKey,
    systemPrompt,
    contents,
    onToken,
    temperature,
    maxOutputTokens,
  });

  // 8. Persist messages to Obsidian if enabled
  if (persistHistory && resolvedSessionId) {
    const obsOpts = { obsidianVaultPath };
    try {
      await historyObsidian.appendMessage(cloneSlug, resolvedSessionId, 'user', userMessage, obsOpts);
      await historyObsidian.appendMessage(cloneSlug, resolvedSessionId, 'assistant', fullText, obsOpts);
    } catch (err) {
      // Log but don't fail the chat for persistence errors
      if (onProgress) onProgress(`Aviso: falha ao salvar historico — ${err.message}`);
    }
  }

  // 9. Return result
  return {
    response: fullText,
    sources,
    images: [],
    tokensUsed,
    ...(resolvedSessionId ? { sessionId: resolvedSessionId } : {}),
  };
}

/**
 * Generic chat without a clone profile — uses a custom system prompt.
 *
 * @param {string} systemPrompt - Custom system prompt
 * @param {string} userMessage - User's message
 * @param {Object} [options={}] - Same options as chatWithClone
 * @returns {Promise<{response: string; sources: Array; images: Array; tokensUsed: number}>}
 */
async function chatGeneric(systemPrompt, userMessage, options = {}) {
  const {
    history = [],
    imageBase64 = null,
    imageMimeType = 'image/jpeg',
    onToken = null,
    onProgress = null,
    temperature = 0.7,
    maxOutputTokens = 8192,
  } = options;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('[ChatEngine] GEMINI_API_KEY not set in environment or .env file');
  }

  // Build contents
  const geminiHistory = toGeminiHistory(history);
  const userParts = buildUserParts(userMessage, imageBase64, imageMimeType);

  const contents = [
    ...geminiHistory,
    { role: 'user', parts: userParts },
  ];

  // Stream from Gemini
  if (onProgress) onProgress('Gerando resposta...');
  const { fullText, tokensUsed } = await streamGenerate({
    apiKey,
    systemPrompt,
    contents,
    onToken,
    temperature,
    maxOutputTokens,
  });

  return {
    response: fullText,
    sources: [],
    images: [],
    tokensUsed,
  };
}

module.exports = {
  chatWithClone,
  chatGeneric,
  loadProfile,
  buildSystemPrompt,
};
