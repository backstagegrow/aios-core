'use strict';

/**
 * squad-generator — Generates squad config files from ready clones
 *
 * AEV-6: Clone Readiness → Auto-Squad Deploy
 * L4 — always modifiable
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Testability overrides
// ---------------------------------------------------------------------------

let _squadsDirOverride = null;
let _entityRegistryOverride = null;
let _skillsRegistryOverride = null;

function getSquadsDir() {
  return _squadsDirOverride || path.join(process.cwd(), 'squads');
}

function getEntityRegistryFile() {
  return _entityRegistryOverride || path.join(process.cwd(), '.aios-core', 'data', 'entity-registry.yaml');
}

function getSkillsRegistry() {
  const file = _skillsRegistryOverride || path.join(process.cwd(), '.aios', 'skills-registry.json');
  if (!fs.existsSync(file)) return { skills: [] };
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return { skills: [] };
  }
}

function setSquadsDir(dir) {
  _squadsDirOverride = dir;
}

function setEntityRegistry(file) {
  _entityRegistryOverride = file;
}

function setSkillsRegistry(file) {
  _skillsRegistryOverride = file;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

/**
 * Get skills for a clone from skills-registry.json
 */
function getCloneSkills(cloneId) {
  const registry = getSkillsRegistry();
  return registry.skills.filter(s => s.cloneId === cloneId).map(s => s.id || s.name);
}

/**
 * Minimal YAML serializer for squad.yaml (no external deps)
 */
function toSquadYaml(data) {
  const lines = [];

  function serialize(obj, indent = '') {
    for (const [key, val] of Object.entries(obj)) {
      if (Array.isArray(val)) {
        lines.push(`${indent}${key}:`);
        val.forEach(item => lines.push(`${indent}  - ${item}`));
      } else if (val && typeof val === 'object') {
        lines.push(`${indent}${key}:`);
        serialize(val, indent + '  ');
      } else if (typeof val === 'string' && val.includes('\n')) {
        lines.push(`${indent}${key}: |`);
        val.split('\n').forEach(line => lines.push(`${indent}  ${line}`));
      } else {
        lines.push(`${indent}${key}: ${JSON.stringify(val)}`);
      }
    }
  }

  serialize(data);
  return lines.join('\n') + '\n';
}

// ---------------------------------------------------------------------------
// Squad generation
// ---------------------------------------------------------------------------

/**
 * Generate squad config for a clone
 * @param {object} scoreResult - Output from readiness-scorer.scoreClone()
 * @param {object} [options]
 * @param {boolean} [options.force=false] - Overwrite existing squad
 * @returns {{ created: boolean, squadPath: string, skipped: boolean, reason?: string }}
 */
function generateSquad(scoreResult, options = {}) {
  const { force = false } = options;
  const { cloneId, name, role, total } = scoreResult;

  const specialistSlug = slugify(cloneId);
  const squadDir = path.join(getSquadsDir(), specialistSlug);
  const squadFile = path.join(squadDir, 'squad.yaml');

  // Check existing squad
  if (fs.existsSync(squadFile) && !force) {
    return { created: false, squadPath: squadFile, skipped: true, reason: 'already_exists' };
  }

  // Get skills for this clone
  const skills = getCloneSkills(cloneId);

  // Extract category from role
  const category = role
    .replace(/Expert Clone\s*[-—]\s*/i, '')
    .split(',')[0]
    .trim() || 'especialidade';

  const squadData = {
    name: `${name || cloneId} Squad`,
    description: `Squad especializado em ${category} com base no clone de ${name || cloneId}`,
    clone_source: cloneId,
    specialist: name || cloneId,
    readiness_score: total,
    deployed_at: new Date().toISOString().split('T')[0],
    skills: skills.length > 0 ? skills : [],
    activation_prompt: `Você é ${name || cloneId}, especialista em ${category}.\nSeu conhecimento é baseado no DNA documentado deste especialista.\nResponda sempre baseado nos frameworks e princípios mapeados.`
  };

  // Create directory and write squad.yaml
  if (!fs.existsSync(squadDir)) {
    fs.mkdirSync(squadDir, { recursive: true });
  }

  fs.writeFileSync(squadFile, toSquadYaml(squadData), 'utf8');

  return { created: true, squadPath: squadFile, skipped: false, squadData };
}

// ---------------------------------------------------------------------------
// Entity registry update
// ---------------------------------------------------------------------------

/**
 * Append a squad entry to entity-registry.yaml
 * NOTE: This appends a YAML entry at the end of the file.
 * If the registry has a specific structure, this may need adjustment.
 * @param {object} params
 * @param {string} params.cloneId
 * @param {string} params.squadPath
 * @param {number} params.readinessScore
 */
function updateEntityRegistry(params) {
  const { cloneId, squadPath, readinessScore } = params;
  const registryFile = getEntityRegistryFile();

  if (!fs.existsSync(registryFile)) {
    // Create minimal registry
    const content = `# Entity Registry\n# Auto-generated entries below\n\nsquads:\n`;
    fs.writeFileSync(registryFile, content, 'utf8');
  }

  const existing = fs.readFileSync(registryFile, 'utf8');
  const squadId = `squad-${slugify(cloneId)}`;

  // Avoid duplicate entries
  if (existing.includes(`id: ${squadId}`)) {
    return { updated: false, reason: 'already_registered', squadId };
  }

  const entry = [
    `  - id: ${squadId}`,
    `    type: squad`,
    `    path: ${squadPath}`,
    `    clone_source: ${cloneId}`,
    `    readiness_score: ${readinessScore}`,
    `    status: production`,
    `    registered_at: ${new Date().toISOString().split('T')[0]}`,
    ''
  ].join('\n');

  fs.appendFileSync(registryFile, entry, 'utf8');
  return { updated: true, squadId };
}

// ---------------------------------------------------------------------------
// Deploy pipeline
// ---------------------------------------------------------------------------

/**
 * Full deploy pipeline for a ready clone:
 * 1. Generate squad config
 * 2. Update entity registry
 * @param {object} scoreResult - Output from readiness-scorer.scoreClone()
 * @param {object} [options]
 * @returns {object} Result summary
 */
function deployCloneAsSquad(scoreResult, options = {}) {
  const squadResult = generateSquad(scoreResult, options);

  if (squadResult.skipped) {
    return { deployed: false, ...squadResult };
  }

  const registryResult = updateEntityRegistry({
    cloneId: scoreResult.cloneId,
    squadPath: squadResult.squadPath,
    readinessScore: scoreResult.total
  });

  return {
    deployed: true,
    squadPath: squadResult.squadPath,
    squadData: squadResult.squadData,
    registry: registryResult
  };
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (cmd === 'generate') {
    const cloneId = args[1];
    if (!cloneId) {
      console.error('Usage: squad-generator generate <cloneId> [score] [--force]');
      process.exit(1);
    }

    const score = parseInt(args[2], 10) || 75;
    const force = args.includes('--force');

    const fakeScore = { cloneId, name: cloneId, role: '', total: score };
    const result = generateSquad(fakeScore, { force });

    if (result.skipped) {
      console.log(`[generate] Skipped: ${result.reason}`);
    } else {
      console.log(`[generate] Squad created: ${result.squadPath}`);
    }
    process.exit(0);
  }

  console.error(`Unknown command: ${cmd || '(none)'}`);
  process.exit(1);
}

module.exports = {
  generateSquad,
  deployCloneAsSquad,
  updateEntityRegistry,
  setSquadsDir,
  setEntityRegistry,
  setSkillsRegistry
};
