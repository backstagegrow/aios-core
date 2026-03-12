/**
 * aios-core/packages/clones/content-reader/index.js
 *
 * Content Reader — Adaptador de Entrada para o Sistema CLONES
 *
 * Normaliza qualquer forma de input (texto, arquivo, URL) em um
 * objeto RawSource compatível com o pipeline do Mega Brain.
 *
 * Tipos suportados:
 *   'text'  — String com ≥ 50 caracteres fornecida diretamente
 *   'file'  — Caminho de arquivo .txt ou .md no sistema de arquivos
 *   'url'   — URL HTTP/HTTPS para página web
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ============================================================
// DETECÇÃO DE TIPO DE INPUT
// ============================================================

/**
 * Padrão para detectar URLs HTTP/HTTPS.
 */
const URL_PATTERN = /^https?:\/\/.+/i;

/**
 * Extensões de arquivo suportadas.
 */
const SUPPORTED_EXTENSIONS = ['.txt', '.md'];

/**
 * Detecta o tipo de input fornecido.
 * @param {string} input
 * @returns {'url' | 'file' | 'text'}
 */
function detectInputType(input) {
  if (typeof input !== 'string') {
    throw new Error('[ContentReader] input deve ser uma string');
  }

  const trimmed = input.trim();

  if (URL_PATTERN.test(trimmed)) {
    return 'url';
  }

  // Verifica se parece um caminho de arquivo (tem extensão suportada OU barra/separador)
  const ext = path.extname(trimmed).toLowerCase();
  if (SUPPORTED_EXTENSIONS.includes(ext)) {
    return 'file';
  }

  // Verifica se é um caminho sem extensão mas com separadores de diretório
  if (trimmed.includes(path.sep) || trimmed.includes('/')) {
    return 'file';
  }

  return 'text';
}

// ============================================================
// EXTRAÇÃO DE FRONTMATTER YAML (para arquivos .md)
// ============================================================

/**
 * Extrai metadados do frontmatter YAML de um arquivo Markdown.
 * Suporta campos: title, specialist.
 * @param {string} content - Conteúdo bruto do arquivo .md
 * @returns {{ title?: string; specialist?: string; body: string }}
 */
function extractMarkdownFrontmatter(content) {
  const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
  const match = content.match(FRONTMATTER_PATTERN);

  if (!match) {
    return { body: content };
  }

  const frontmatter = match[1];
  const body = content.slice(match[0].length);

  const titleMatch = frontmatter.match(/^title:\s*(.+)$/m);
  const specialistMatch = frontmatter.match(/^specialist:\s*(.+)$/m);

  return {
    title: titleMatch ? titleMatch[1].trim() : undefined,
    specialist: specialistMatch ? specialistMatch[1].trim() : undefined,
    body,
  };
}

// ============================================================
// LEITORES POR TIPO
// ============================================================

/**
 * Lê e normaliza um input de texto direto.
 * @param {string} text
 * @param {Object} options
 * @returns {import('../mega-brain').RawSource}
 */
function readFromText(text, options) {
  const trimmed = text.trim();

  if (trimmed.length < 50) {
    throw new Error('[ContentReader] Texto direto muito curto (mínimo 50 caracteres)');
  }

  return {
    type: 'text',
    content: trimmed,
    title: options.title || 'Texto Direto',
    specialist: options.specialist || 'Desconhecido',
    url: null,
  };
}

/**
 * Lê e normaliza um arquivo .txt ou .md do sistema de arquivos.
 * @param {string} filePath
 * @param {Object} options
 * @returns {import('../mega-brain').RawSource}
 */
function readFromFile(filePath, options) {
  const resolvedPath = path.resolve(filePath);
  const ext = path.extname(resolvedPath).toLowerCase();

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`[ContentReader] Arquivo não encontrado: ${resolvedPath}`);
  }

  if (SUPPORTED_EXTENSIONS.length > 0 && ext && !SUPPORTED_EXTENSIONS.includes(ext)) {
    throw new Error(`[ContentReader] Extensão não suportada: "${ext}". Use: ${SUPPORTED_EXTENSIONS.join(', ')}`);
  }

  const raw = fs.readFileSync(resolvedPath, 'utf-8');
  let content = raw;
  let detectedTitle = options.title || path.basename(resolvedPath, ext);
  let detectedSpecialist = options.specialist || 'Desconhecido';

  // Para .md, tenta extrair frontmatter
  if (ext === '.md') {
    const parsed = extractMarkdownFrontmatter(raw);
    content = parsed.body;
    if (!options.title && parsed.title) detectedTitle = parsed.title;
    if (!options.specialist && parsed.specialist) detectedSpecialist = parsed.specialist;
  }

  if (content.trim().length === 0) {
    throw new Error(`[ContentReader] Arquivo vazio: ${resolvedPath}`);
  }

  return {
    type: 'file',
    content: content.trim(),
    title: detectedTitle,
    specialist: detectedSpecialist,
    url: null,
  };
}

/**
 * Lê o conteúdo de uma URL HTTP/HTTPS.
 * @param {string} url
 * @param {Object} options
 * @returns {Promise<import('../mega-brain').RawSource>}
 */
function readFromUrl(url, options) {
  return new Promise((resolve, reject) => {
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      return reject(new Error(`[ContentReader] URL inválida: "${url}"`));
    }

    const protocol = parsedUrl.protocol === 'https:' ? https : http;

    const req = protocol.get(url, { timeout: 10000 }, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 400) {
        return reject(new Error(`[ContentReader] URL retornou status ${res.statusCode}: ${url}`));
      }

      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf-8');

        // Remove tags HTML básicas para obter texto limpo
        const text = raw
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<style[\s\S]*?<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s{2,}/g, ' ')
          .trim();

        if (text.length === 0) {
          return reject(new Error(`[ContentReader] Nenhum conteúdo extraído de: ${url}`));
        }

        resolve({
          type: 'url',
          content: text,
          title: options.title || parsedUrl.hostname,
          specialist: options.specialist || 'Desconhecido',
          url,
        });
      });
    });

    req.on('error', (err) => {
      reject(new Error(`[ContentReader] Erro de rede ao acessar "${url}": ${err.message}`));
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error(`[ContentReader] Timeout ao acessar: ${url}`));
    });
  });
}

// ============================================================
// FUNÇÃO PRINCIPAL
// ============================================================

/**
 * Lê qualquer tipo de input e devolve um RawSource para o Mega Brain.
 *
 * @param {string} input - Texto direto, caminho de arquivo ou URL
 * @param {Object} [options]
 * @param {string} [options.specialist] - Nome do especialista (ex: 'Alex Hormozi')
 * @param {string} [options.title]      - Título da fonte
 * @returns {Promise<Object>} RawSource compatível com o pipeline do Mega Brain
 *
 * @example
 * // Texto direto
 * await readContent('Nunca faça desconto no preço...', { specialist: 'Hormozi' });
 *
 * // Arquivo local
 * await readContent('./livros/hormozi.md', { specialist: 'Alex Hormozi' });
 *
 * // URL
 * await readContent('https://exemplo.com/artigo', { specialist: 'Guru X' });
 */
async function readContent(input, options = {}) {
  if (typeof input !== 'string' || input.trim().length === 0) {
    throw new Error('[ContentReader] input é obrigatório e deve ser uma string não-vazia');
  }

  const type = detectInputType(input.trim());

  console.log(`[ContentReader] 📥 Tipo detectado: "${type}" — processando...`);

  let source;

  switch (type) {
    case 'url':
      source = await readFromUrl(input.trim(), options);
      break;
    case 'file':
      source = readFromFile(input.trim(), options);
      break;
    case 'text':
    default:
      source = readFromText(input.trim(), options);
      break;
  }

  console.log(`[ContentReader] ✅ RawSource pronto: "${source.title}" (${source.content.length} chars, tipo: ${source.type})`);
  return source;
}

module.exports = {
  readContent,
  detectInputType,
  extractMarkdownFrontmatter,
  // Leitores individuais exportados para testes
  readFromText,
  readFromFile,
  readFromUrl,
};
