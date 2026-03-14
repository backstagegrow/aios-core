'use strict';

/**
 * packages/handoffs/handoff-writer.js
 *
 * Handoff Artifacts — Writer/Reader (AEV-2)
 *
 * Escreve e lê artifacts de handoff entre agentes AIOS.
 * Artifacts são escritos em .aios/handoffs/ (runtime, gitignored).
 *
 * CLI Usage:
 *   node packages/handoffs/handoff-writer.js write \
 *     --from dev --to qa --story "AEV-2" --branch "feat/epic-aev" \
 *     --action "Executar QA gate na story AEV-2"
 *
 *   node packages/handoffs/handoff-writer.js read
 *   node packages/handoffs/handoff-writer.js consume
 *   node packages/handoffs/handoff-writer.js set-active --agent dev
 *
 * Module Usage:
 *   const writer = require('./packages/handoffs/handoff-writer');
 *   const fp = writer.writeHandoff({ from: 'dev', to: 'qa', ... });
 *
 * Test Override:
 *   writer.setHandoffsDir('/tmp/test-handoffs');
 */

const fs = require('fs');
const path = require('path');

// Mutable for testability — override via setHandoffsDir()
let _handoffsDirOverride = null;

const DEFAULT_MAX_ARTIFACTS = 3;

function getHandoffsDir() {
  return _handoffsDirOverride || path.join(process.cwd(), '.aios', 'handoffs');
}

function setHandoffsDir(dir) {
  _handoffsDirOverride = dir;
}

function getLastActiveFile() {
  return path.join(getHandoffsDir(), 'last-active-agent.json');
}

function ensureHandoffsDir() {
  const dir = getHandoffsDir();
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function toYaml(obj, indent) {
  indent = indent || 0;
  const pad = '  '.repeat(indent);
  if (obj === null || obj === undefined) return 'null';
  if (typeof obj === 'boolean') return String(obj);
  if (typeof obj === 'number') return String(obj);
  if (typeof obj === 'string') {
    if (
      obj.includes('\n') ||
      obj.includes(':') ||
      obj.includes('"') ||
      obj.includes("'") ||
      obj.startsWith(' ') ||
      obj === ''
    ) {
      return '"' + obj.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    return obj.map(function(item) { return pad + '  - ' + toYaml(item, indent + 1); }).join('\n');
  }
  if (typeof obj === 'object') {
    const lines = [];
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      if (value === null || value === undefined) {
        lines.push(pad + key + ': null');
      } else if (Array.isArray(value)) {
        if (value.length === 0) {
          lines.push(pad + key + ': []');
        } else {
          lines.push(pad + key + ':');
          lines.push(toYaml(value, indent + 1));
        }
      } else if (typeof value === 'object') {
        lines.push(pad + key + ':');
        lines.push(toYaml(value, indent + 1));
      } else {
        lines.push(pad + key + ': ' + toYaml(value, indent));
      }
    }
    return lines.join('\n');
  }
  return String(obj);
}

function generateHandoffFilename(from, to) {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .replace('T', '_')
    .slice(0, 19);
  return 'handoff-' + from + '-to-' + to + '-' + timestamp + '.yaml';
}

function readLastActiveAgent() {
  const lastActiveFile = getLastActiveFile();
  if (!fs.existsSync(lastActiveFile)) return null;
  try {
    const raw = fs.readFileSync(lastActiveFile, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function setActiveAgent(agentId) {
  ensureHandoffsDir();
  const data = {
    agent_id: agentId,
    activated_at: new Date().toISOString(),
  };
  fs.writeFileSync(getLastActiveFile(), JSON.stringify(data, null, 2), 'utf8');
}

function listHandoffFiles() {
  ensureHandoffsDir();
  const dir = getHandoffsDir();
  return fs
    .readdirSync(dir)
    .filter(function(f) { return f.startsWith('handoff-') && f.endsWith('.yaml'); })
    .map(function(f) { return path.join(dir, f); })
    .sort(function(a, b) { return fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs; });
}

function pruneOldArtifacts(maxArtifacts) {
  maxArtifacts = maxArtifacts || DEFAULT_MAX_ARTIFACTS;
  const files = listHandoffFiles();
  if (files.length > maxArtifacts) {
    const toDelete = files.slice(maxArtifacts);
    for (const file of toDelete) {
      try { fs.unlinkSync(file); } catch (e) { /* ignore */ }
    }
  }
}

/**
 * Escreve um artifact de handoff YAML.
 * @param {Object} options
 * @param {string} options.from
 * @param {string} options.to
 * @param {string} [options.storyId]
 * @param {string} [options.storyPath]
 * @param {string} [options.storyStatus]
 * @param {string} [options.currentTask]
 * @param {string} [options.branch]
 * @param {string[]} [options.decisions] - max 5
 * @param {string[]} [options.filesModified] - max 10
 * @param {string[]} [options.blockers] - max 3
 * @param {string} [options.nextAction]
 * @returns {string} filepath
 */
function writeHandoff(options) {
  const from = options.from;
  const to = options.to;
  const storyId = options.storyId || null;
  const storyPath = options.storyPath || null;
  const storyStatus = options.storyStatus || null;
  const currentTask = options.currentTask || null;
  const branch = options.branch || null;
  const decisions = (options.decisions || []).slice(0, 5);
  const filesModified = (options.filesModified || []).slice(0, 10);
  const blockers = (options.blockers || []).slice(0, 3);
  const nextAction = options.nextAction || null;

  if (!from || !to) {
    throw new Error('[handoff-writer] from e to são obrigatórios');
  }

  ensureHandoffsDir();

  const artifact = {
    handoff: {
      from_agent: from,
      to_agent: to,
      timestamp: new Date().toISOString(),
      consumed: false,
      story_context: {
        story_id: storyId,
        story_path: storyPath,
        story_status: storyStatus,
        current_task: currentTask,
        branch: branch,
      },
      decisions: decisions,
      files_modified: filesModified,
      blockers: blockers,
      next_action: nextAction,
    },
  };

  const filename = generateHandoffFilename(from, to);
  const filepath = path.join(getHandoffsDir(), filename);
  const yamlContent = '# AIOS Agent Handoff Artifact\n# Generated by handoff-writer.js\n---\n' + toYaml(artifact) + '\n';

  fs.writeFileSync(filepath, yamlContent, 'utf8');
  setActiveAgent(to);
  pruneOldArtifacts(DEFAULT_MAX_ARTIFACTS);

  return filepath;
}

function parseHandoffYaml(content) {
  try {
    const lines = content.split('\n');
    const result = {
      from_agent: null,
      to_agent: null,
      timestamp: null,
      consumed: false,
      story_context: {},
      decisions: [],
      files_modified: [],
      blockers: [],
      next_action: null,
    };

    let currentSection = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || trimmed === '---') continue;

      const fromMatch = trimmed.match(/^from_agent:\s*(.+)$/);
      const toMatch = trimmed.match(/^to_agent:\s*(.+)$/);
      const tsMatch = trimmed.match(/^timestamp:\s*"?(.+?)"?\s*$/);
      const consumedMatch = trimmed.match(/^consumed:\s*(.+)$/);
      const nextActionMatch = trimmed.match(/^next_action:\s*"?(.+?)"?\s*$/);
      const storyIdMatch = trimmed.match(/^story_id:\s*(.+)$/);
      const branchMatch = trimmed.match(/^branch:\s*(.+)$/);
      const listItemMatch = trimmed.match(/^-\s+"?(.+?)"?\s*$/);

      if (fromMatch) result.from_agent = fromMatch[1].trim().replace(/^["']|["']$/g, '');
      if (toMatch) result.to_agent = toMatch[1].trim().replace(/^["']|["']$/g, '');
      if (tsMatch) result.timestamp = tsMatch[1].trim().replace(/^["']|["']$/g, '');
      if (consumedMatch) result.consumed = consumedMatch[1].trim() === 'true';
      if (nextActionMatch) result.next_action = nextActionMatch[1].trim().replace(/^["']|["']$/g, '');
      if (storyIdMatch) result.story_context.story_id = storyIdMatch[1].trim().replace(/^["']|["']$/g, '');
      if (branchMatch) result.story_context.branch = branchMatch[1].trim().replace(/^["']|["']$/g, '');

      if (trimmed === 'decisions:') currentSection = 'decisions';
      else if (trimmed === 'files_modified:') currentSection = 'files_modified';
      else if (trimmed === 'blockers:') currentSection = 'blockers';
      else if (trimmed === 'story_context:' || trimmed.startsWith('next_action:') || trimmed.endsWith(':')) {
        currentSection = null;
      }

      if (listItemMatch && currentSection && Array.isArray(result[currentSection])) {
        const value = listItemMatch[1].trim();
        if (value !== 'null' && value !== '') {
          result[currentSection].push(value);
        }
      }
    }

    if (!result.from_agent || !result.to_agent) return null;
    return result;
  } catch (e) {
    return null;
  }
}

function readLatestHandoff() {
  const files = listHandoffFiles();

  for (const filepath of files) {
    try {
      const content = fs.readFileSync(filepath, 'utf8');
      if (content.includes('consumed: true')) continue;

      const parsed = parseHandoffYaml(content);
      if (parsed && !parsed.consumed) {
        return Object.assign({}, parsed, { _filepath: filepath });
      }
    } catch (e) {
      continue;
    }
  }

  return null;
}

function markConsumed(filepath) {
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const updated = content.replace(/^(\s*consumed:\s*)false\s*$/m, '$1true');
    fs.writeFileSync(filepath, updated, 'utf8');
    return true;
  } catch (e) {
    return false;
  }
}

// === CLI Entry Point ===
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  function parseArgs(argList) {
    const parsed = {};
    for (let i = 0; i < argList.length; i++) {
      if (argList[i].startsWith('--')) {
        const key = argList[i].slice(2);
        const next = argList[i + 1];
        if (next && !next.startsWith('--')) {
          parsed[key] = next;
          i++;
        } else {
          parsed[key] = true;
        }
      }
    }
    return parsed;
  }

  const opts = parseArgs(args.slice(1));

  if (command === 'write') {
    try {
      const filepath = writeHandoff({
        from: opts.from,
        to: opts.to,
        storyId: opts.story || null,
        storyPath: opts['story-path'] || null,
        storyStatus: opts.status || null,
        currentTask: opts.task || null,
        branch: opts.branch || null,
        decisions: opts.decisions ? opts.decisions.split('|') : [],
        filesModified: opts.files ? opts.files.split('|') : [],
        blockers: opts.blockers ? opts.blockers.split('|') : [],
        nextAction: opts.action || null,
      });
      console.log('[handoff-writer] ✅ Handoff escrito: ' + path.relative(process.cwd(), filepath));
    } catch (err) {
      console.error('[handoff-writer] ❌ Erro: ' + err.message);
      process.exit(1);
    }
  } else if (command === 'read') {
    const handoff = readLatestHandoff();
    if (!handoff) {
      console.log('[handoff-writer] Nenhum handoff pendente encontrado.');
    } else {
      console.log(JSON.stringify(handoff, null, 2));
    }
  } else if (command === 'consume') {
    const latest = readLatestHandoff();
    const filepath = opts.file
      ? path.join(getHandoffsDir(), opts.file)
      : latest ? latest._filepath : null;
    if (!filepath) {
      console.log('[handoff-writer] Nenhum handoff para consumir.');
      process.exit(0);
    }
    const ok = markConsumed(filepath);
    console.log(ok
      ? '[handoff-writer] ✅ Marcado como consumido: ' + path.basename(filepath)
      : '[handoff-writer] ❌ Falha ao marcar como consumido.');
  } else if (command === 'set-active') {
    if (!opts.agent) {
      console.error('[handoff-writer] --agent é obrigatório');
      process.exit(1);
    }
    setActiveAgent(opts.agent);
    console.log('[handoff-writer] ✅ Agente ativo: ' + opts.agent);
  } else if (command === 'list') {
    const files = listHandoffFiles();
    if (files.length === 0) {
      console.log('[handoff-writer] Nenhum handoff encontrado.');
    } else {
      for (const f of files) {
        const rel = path.relative(process.cwd(), f);
        const content = fs.readFileSync(f, 'utf8');
        const consumed = content.includes('consumed: true');
        console.log('  ' + (consumed ? '✓' : '○') + ' ' + rel);
      }
    }
  } else {
    console.log('AIOS Handoff Writer — AEV-2\n');
    console.log('Commands:');
    console.log('  write  --from AGENT --to AGENT [--story ID] [--branch BRANCH] [--action "TEXT"]');
    console.log('         [--decisions "D1|D2"] [--files "F1|F2"] [--blockers "B1|B2"]');
    console.log('  read                    Read latest unconsumed handoff');
    console.log('  consume [--file NAME]   Mark latest (or named) handoff as consumed');
    console.log('  set-active --agent ID   Update last-active-agent.json');
    console.log('  list                    List all handoff files');
  }
}

module.exports = {
  writeHandoff: writeHandoff,
  readLatestHandoff: readLatestHandoff,
  markConsumed: markConsumed,
  setActiveAgent: setActiveAgent,
  setHandoffsDir: setHandoffsDir,
  getHandoffsDir: getHandoffsDir,
  readLastActiveAgent: readLastActiveAgent,
  listHandoffFiles: listHandoffFiles,
  ensureHandoffsDir: ensureHandoffsDir,
  MAX_ARTIFACTS: DEFAULT_MAX_ARTIFACTS,
};
