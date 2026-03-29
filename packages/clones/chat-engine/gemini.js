'use strict';

/**
 * packages/clones/chat-engine/gemini.js
 *
 * Streaming wrapper for Gemini API.
 * Handles SSE parsing, retry with exponential backoff, and multimodal input.
 */

const MODEL = 'gemini-2.0-flash';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const MAX_RETRIES = 3;
const BACKOFF_DELAYS = [10000, 20000, 60000]; // ms

/**
 * Streams a response from Gemini API.
 *
 * @param {Object} params
 * @param {string} params.apiKey - Gemini API key
 * @param {string} params.systemPrompt - System instruction
 * @param {Array} params.contents - Gemini contents array
 * @param {Function} [params.onToken] - Callback for each streamed token
 * @param {number} [params.temperature=0.7]
 * @param {number} [params.maxOutputTokens=8192]
 * @returns {Promise<{fullText: string; tokensUsed: number}>}
 */
async function streamGenerate({
  apiKey,
  systemPrompt,
  contents,
  onToken,
  temperature = 0.7,
  maxOutputTokens = 8192,
}) {
  if (!apiKey) {
    throw new Error('[Gemini] API key is required');
  }

  const url = `${BASE_URL}/${MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`;

  const body = {
    contents,
    generationConfig: {
      temperature,
      maxOutputTokens,
    },
  };

  if (systemPrompt) {
    body.systemInstruction = {
      parts: [{ text: systemPrompt }],
    };
  }

  let lastError = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await _doStreamRequest(url, body, onToken);
      return result;
    } catch (err) {
      lastError = err;

      const is429 =
        err.message && (err.message.includes('429') || err.message.includes('RESOURCE_EXHAUSTED'));

      if (is429 && attempt < MAX_RETRIES) {
        const delay = BACKOFF_DELAYS[attempt] || 60000;
        console.warn(
          `[Gemini] Rate limited (429). Retry ${attempt + 1}/${MAX_RETRIES} in ${delay / 1000}s...`
        );
        await _sleep(delay);
        continue;
      }

      // Non-429 errors or max retries exceeded
      break;
    }
  }

  throw new Error(
    `[Gemini] Stream failed after ${MAX_RETRIES} retries: ${lastError instanceof Error ? lastError.message : 'Unknown'}`
  );
}

/**
 * Performs the actual streaming request and parses SSE.
 *
 * @param {string} url
 * @param {Object} body
 * @param {Function} [onToken]
 * @returns {Promise<{fullText: string; tokensUsed: number}>}
 */
async function _doStreamRequest(url, body, onToken) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`HTTP ${response.status}: ${errorText.slice(0, 500)}`);
  }

  if (!response.body) {
    throw new Error('[Gemini] No response body for streaming');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';
  let tokensUsed = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process complete SSE lines
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed.startsWith('data: ')) continue;

        const jsonStr = trimmed.slice(6); // Remove "data: "
        if (!jsonStr || jsonStr === '[DONE]') continue;

        try {
          const parsed = JSON.parse(jsonStr);
          const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (text) {
            fullText += text;
            tokensUsed += _estimateTokens(text);
            if (onToken) {
              onToken(text);
            }
          }

          // Check for usage metadata
          if (parsed?.usageMetadata?.totalTokenCount) {
            tokensUsed = parsed.usageMetadata.totalTokenCount;
          }
        } catch (_parseErr) {
          // Skip malformed JSON lines — normal in SSE streams
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return { fullText, tokensUsed };
}

/**
 * Builds Gemini content parts for a user message, optionally with an image.
 *
 * @param {string} text - User message text
 * @param {string} [imageBase64] - Base64-encoded image data
 * @param {string} [imageMimeType='image/jpeg'] - Image MIME type
 * @returns {Array<Object>} Content parts array
 */
function buildUserParts(text, imageBase64, imageMimeType = 'image/jpeg') {
  const parts = [];

  if (text) {
    parts.push({ text });
  }

  if (imageBase64) {
    parts.push({
      inlineData: {
        mimeType: imageMimeType,
        data: imageBase64,
      },
    });
  }

  return parts;
}

/**
 * Rough token count estimation (1 token ~ 4 chars).
 * @param {string} text
 * @returns {number}
 */
function _estimateTokens(text) {
  return Math.ceil((text || '').length / 4);
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
function _sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  streamGenerate,
  buildUserParts,
  MODEL,
  MAX_RETRIES,
};
