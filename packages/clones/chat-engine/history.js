'use strict';

/**
 * packages/clones/chat-engine/history.js
 *
 * Converts chat history to Gemini API format.
 * Handles role mapping and history truncation.
 */

const MAX_HISTORY_MESSAGES = 20;

/**
 * Converts a chat history array to Gemini's contents format.
 *
 * @param {Array<{role: string; content: string}>} history - Chat history
 * @returns {Array<{role: string; parts: Array<{text: string}>}>} Gemini-formatted contents
 */
function toGeminiHistory(history) {
  if (!history || !Array.isArray(history) || history.length === 0) {
    return [];
  }

  // Truncate to last N messages to avoid context explosion
  const truncated = history.slice(-MAX_HISTORY_MESSAGES);

  return truncated.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content || '' }],
  }));
}

module.exports = {
  toGeminiHistory,
  MAX_HISTORY_MESSAGES,
};
