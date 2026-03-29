'use strict';

/**
 * packages/clones/chat-engine/history-obsidian.js
 *
 * Persists chat history as .md files in the user's Obsidian vault.
 * Each clone gets a folder, each session gets a file with YAML frontmatter.
 *
 * Exports:
 *   - createSession(cloneSlug, options)
 *   - appendMessage(cloneSlug, sessionId, role, content, options)
 *   - loadSession(cloneSlug, sessionId, options)
 *   - loadLatestSession(cloneSlug, options)
 *   - listSessions(cloneSlug, options)
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_VAULT_PATH = 'D:/01 -Arquivos/Obsidian/AIOS';
const CLONES_SUBDIR = 'clones';

/**
 * Resolves the base directory for a clone's chat sessions.
 *
 * @param {string} cloneSlug
 * @param {string} [vaultPath]
 * @returns {string}
 */
function resolveCloneDir(cloneSlug, vaultPath) {
  const vault = vaultPath || DEFAULT_VAULT_PATH;
  return path.join(vault, CLONES_SUBDIR, cloneSlug);
}

/**
 * Loads the clone display name from the profile JSON.
 * Falls back to slug if profile is missing.
 *
 * @param {string} cloneSlug
 * @returns {string}
 */
function getCloneDisplayName(cloneSlug) {
  const profilePath = path.resolve(__dirname, '../profiles', `${cloneSlug}.json`);

  try {
    if (fs.existsSync(profilePath)) {
      const raw = fs.readFileSync(profilePath, 'utf-8');
      const profile = JSON.parse(raw);
      if (profile.name) return profile.name;
    }
  } catch (_) {
    // Fallback to slug
  }

  // Convert slug to title case as fallback
  return cloneSlug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Returns today's date in YYYY-MM-DD format.
 *
 * @returns {string}
 */
function todayStr() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

/**
 * Determines the next sequential session number for a given date.
 *
 * @param {string} cloneDir - Path to clone directory
 * @param {string} dateStr - YYYY-MM-DD
 * @returns {number}
 */
function nextSessionNumber(cloneDir, dateStr) {
  if (!fs.existsSync(cloneDir)) return 1;

  const files = fs.readdirSync(cloneDir).filter((f) => f.startsWith(dateStr) && f.endsWith('.md'));
  if (files.length === 0) return 1;

  let max = 0;
  for (const f of files) {
    const match = f.match(/_session-(\d+)\.md$/);
    if (match) {
      const n = parseInt(match[1], 10);
      if (n > max) max = n;
    }
  }

  return max + 1;
}

/**
 * Pads a number to 2 digits.
 *
 * @param {number} n
 * @returns {string}
 */
function pad2(n) {
  return String(n).padStart(2, '0');
}

/**
 * Builds YAML frontmatter for a session file.
 *
 * @param {string} cloneName
 * @param {string} cloneSlug
 * @param {string} sessionId
 * @param {string} created - ISO timestamp
 * @param {string} updated - ISO timestamp
 * @param {number} messageCount
 * @returns {string}
 */
function buildFrontmatter(cloneName, cloneSlug, sessionId, created, updated, messageCount) {
  return [
    '---',
    `clone: ${cloneName}`,
    `slug: ${cloneSlug}`,
    `session: ${sessionId}`,
    `created: ${created}`,
    `updated: ${updated}`,
    `tags: [clone, chat, ${cloneSlug}]`,
    `messages: ${messageCount}`,
    '---',
  ].join('\n');
}

/**
 * Formats a single message as markdown.
 *
 * @param {string} role - "user" or "assistant"
 * @param {string} content
 * @param {string} cloneName
 * @returns {string}
 */
function formatMessage(role, content, cloneName) {
  const speaker = role === 'user' ? 'Voce' : cloneName;
  return `**${speaker}:** ${content}`;
}

/**
 * Parses a session .md file into structured data.
 *
 * @param {string} fileContent - Full file content
 * @param {string} cloneName - Clone display name for role detection
 * @returns {{frontmatter: Object; history: Array<{role: string; content: string}>}}
 */
function parseSessionFile(fileContent, cloneName) {
  const frontmatter = {};
  const history = [];

  // Split frontmatter from body
  const fmMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!fmMatch) {
    return { frontmatter, history };
  }

  // Parse frontmatter
  const fmLines = fmMatch[1].split('\n');
  for (const line of fmLines) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();

      // Handle arrays like [clone, chat, slug]
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map((s) => s.trim());
      }

      frontmatter[key] = value;
    }
  }

  // Parse message body
  const body = fmMatch[2].trim();
  if (!body) return { frontmatter, history };

  // Split by horizontal rule separator (---)
  const blocks = body.split(/\n---\n/).map((b) => b.trim()).filter(Boolean);

  for (const block of blocks) {
    // Match pattern: **Speaker:** content
    const msgMatch = block.match(/^\*\*(.+?):\*\*\s*([\s\S]*)$/);
    if (msgMatch) {
      const speaker = msgMatch[1].trim();
      const content = msgMatch[2].trim();

      const role = speaker === 'Voce' ? 'user' : 'assistant';
      history.push({ role, content });
    }
  }

  return { frontmatter, history };
}

/**
 * Creates a new chat session file in the Obsidian vault.
 *
 * @param {string} cloneSlug - Clone identifier
 * @param {Object} [options={}]
 * @param {string} [options.obsidianVaultPath] - Override vault path
 * @returns {Promise<string>} The new sessionId (e.g., "2026-03-25_session-01")
 */
async function createSession(cloneSlug, options = {}) {
  const { obsidianVaultPath } = options;
  const cloneDir = resolveCloneDir(cloneSlug, obsidianVaultPath);

  // Ensure directory exists
  fs.mkdirSync(cloneDir, { recursive: true });

  const date = todayStr();
  const num = nextSessionNumber(cloneDir, date);
  const sessionId = `${date}_session-${pad2(num)}`;

  const cloneName = getCloneDisplayName(cloneSlug);
  const now = new Date().toISOString();

  const content = buildFrontmatter(cloneName, cloneSlug, sessionId, now, now, 0) + '\n';

  const filePath = path.join(cloneDir, `${sessionId}.md`);
  fs.writeFileSync(filePath, content, 'utf-8');

  return sessionId;
}

/**
 * Appends a message to an existing session file.
 *
 * @param {string} cloneSlug
 * @param {string} sessionId
 * @param {string} role - "user" or "assistant"
 * @param {string} content - Message content
 * @param {Object} [options={}]
 * @param {string} [options.obsidianVaultPath]
 * @returns {Promise<void>}
 */
async function appendMessage(cloneSlug, sessionId, role, content, options = {}) {
  const { obsidianVaultPath } = options;
  const cloneDir = resolveCloneDir(cloneSlug, obsidianVaultPath);
  const filePath = path.join(cloneDir, `${sessionId}.md`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`[HistoryObsidian] Session file not found: ${filePath}`);
  }

  const cloneName = getCloneDisplayName(cloneSlug);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { frontmatter, history } = parseSessionFile(fileContent, cloneName);

  // Add new message to history
  history.push({ role, content });

  // Rebuild the file
  const now = new Date().toISOString();
  const created = frontmatter.created || now;

  const newFrontmatter = buildFrontmatter(
    cloneName,
    cloneSlug,
    sessionId,
    created,
    now,
    history.length
  );

  const messageBlocks = history.map((msg) => formatMessage(msg.role, msg.content, cloneName));
  const newContent = newFrontmatter + '\n\n' + messageBlocks.join('\n\n---\n\n') + '\n';

  fs.writeFileSync(filePath, newContent, 'utf-8');
}

/**
 * Loads a session from disk and returns parsed history.
 *
 * @param {string} cloneSlug
 * @param {string} sessionId
 * @param {Object} [options={}]
 * @param {string} [options.obsidianVaultPath]
 * @returns {Promise<Array<{role: string; content: string}>>}
 */
async function loadSession(cloneSlug, sessionId, options = {}) {
  const { obsidianVaultPath } = options;
  const cloneDir = resolveCloneDir(cloneSlug, obsidianVaultPath);
  const filePath = path.join(cloneDir, `${sessionId}.md`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`[HistoryObsidian] Session file not found: ${filePath}`);
  }

  const cloneName = getCloneDisplayName(cloneSlug);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { history } = parseSessionFile(fileContent, cloneName);

  return history;
}

/**
 * Lists all session files for a given clone.
 *
 * @param {string} cloneSlug
 * @param {Object} [options={}]
 * @param {string} [options.obsidianVaultPath]
 * @returns {Promise<Array<{sessionId: string; filePath: string; created: string; messages: number}>>}
 */
async function listSessions(cloneSlug, options = {}) {
  const { obsidianVaultPath } = options;
  const cloneDir = resolveCloneDir(cloneSlug, obsidianVaultPath);

  if (!fs.existsSync(cloneDir)) {
    return [];
  }

  const files = fs.readdirSync(cloneDir)
    .filter((f) => f.endsWith('.md') && f.includes('_session-'))
    .sort();

  const sessions = [];

  for (const file of files) {
    const sessionId = file.replace('.md', '');
    const filePath = path.join(cloneDir, file);
    const cloneName = getCloneDisplayName(cloneSlug);

    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { frontmatter } = parseSessionFile(fileContent, cloneName);

      sessions.push({
        sessionId,
        filePath,
        created: frontmatter.created || '',
        messages: parseInt(frontmatter.messages, 10) || 0,
      });
    } catch (_) {
      sessions.push({
        sessionId,
        filePath,
        created: '',
        messages: 0,
      });
    }
  }

  return sessions;
}

/**
 * Loads the most recent session for a clone.
 * If no sessions exist, returns null.
 *
 * @param {string} cloneSlug
 * @param {Object} [options={}]
 * @param {string} [options.obsidianVaultPath]
 * @returns {Promise<{sessionId: string; history: Array<{role: string; content: string}>} | null>}
 */
async function loadLatestSession(cloneSlug, options = {}) {
  const sessions = await listSessions(cloneSlug, options);

  if (sessions.length === 0) return null;

  // Sessions are sorted alphabetically, last one is most recent
  const latest = sessions[sessions.length - 1];
  const history = await loadSession(cloneSlug, latest.sessionId, options);

  return {
    sessionId: latest.sessionId,
    history,
  };
}

module.exports = {
  createSession,
  appendMessage,
  loadSession,
  loadLatestSession,
  listSessions,
  // Exported for testing
  parseSessionFile,
  resolveCloneDir,
  buildFrontmatter,
  formatMessage,
  DEFAULT_VAULT_PATH,
};
