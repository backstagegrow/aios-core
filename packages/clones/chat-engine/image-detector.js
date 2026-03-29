'use strict';

/**
 * packages/clones/chat-engine/image-detector.js
 *
 * Detects image generation requests from user messages
 * and generates images via Gemini when triggered.
 */

const IMAGE_TRIGGERS = [
  // Portuguese
  'crie uma imagem',
  'gere uma imagem',
  'criar imagem',
  'gerar imagem',
  'cria uma imagem',
  'gera uma imagem',
  'desenhe',
  'desenha',
  'ilustre',
  'ilustra',
  'gere um logo',
  'crie um logo',
  'criar um logo',
  'gerar um logo',
  'crie um post',
  'crie um criativo',
  'gere um post',
  'gere um criativo',
  'faça uma imagem',
  'faz uma imagem',
  'monte uma imagem',
  'monta uma imagem',
  'crie uma ilustração',
  'gere uma ilustração',
  'criar ilustração',
  'gerar ilustração',
  'crie um banner',
  'gere um banner',
  'crie uma arte',
  'gere uma arte',
  'crie um visual',
  'gere um visual',
  'crie uma thumbnail',
  'gere uma thumbnail',
  // English
  'make an image',
  'generate an image',
  'create an image',
  'draw me',
  'draw an image',
  'make a logo',
  'create a logo',
  'generate a logo',
  'make a post',
  'create a post',
  'design an image',
  'illustrate',
  'create a banner',
  'generate a banner',
  'create a thumbnail',
  'generate a thumbnail',
];

/**
 * Checks if the user message is requesting image generation.
 *
 * @param {string} text - User message
 * @returns {boolean}
 */
function isImageRequest(text) {
  if (!text || typeof text !== 'string') {
    return false;
  }

  const lower = text.toLowerCase().trim();
  return IMAGE_TRIGGERS.some((trigger) => lower.includes(trigger));
}

/**
 * Generates an image using Gemini's image generation model.
 *
 * @param {string} prompt - Image generation prompt
 * @param {string} apiKey - Gemini API key
 * @returns {Promise<{base64: string; mimeType: string} | null>}
 */
async function generateImage(prompt, apiKey) {
  if (!prompt || !apiKey) {
    return null;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Generate an image based on this description: ${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      }),
    });

    if (!response.ok) {
      console.error(`[ImageDetector] Gemini image generation failed: HTTP ${response.status}`);
      return null;
    }

    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];

    for (const part of parts) {
      if (part.inlineData) {
        return {
          base64: part.inlineData.data,
          mimeType: part.inlineData.mimeType || 'image/png',
        };
      }
    }

    console.error('[ImageDetector] No image data in Gemini response');
    return null;
  } catch (err) {
    console.error(
      `[ImageDetector] Image generation error: ${err instanceof Error ? err.message : 'Unknown'}`
    );
    return null;
  }
}

module.exports = {
  isImageRequest,
  generateImage,
  IMAGE_TRIGGERS,
};
