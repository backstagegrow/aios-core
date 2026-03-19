'use strict';

/**
 * skill-exporter — Exports clone-generated skills as Claude Code .md skill files
 *
 * AEV-3: Clone→Skill→Claude Code Pipeline
 * L4 — always modifiable
 */

const fs = require('fs');
const path = require('path');

// Testability overrides
let _skillsDirOverride = null;
let _registryFileOverride = null;

function getSkillsDir() {
  return _skillsDirOverride || path.join(process.cwd(), '.claude', 'skills');
}

function getRegistryFile() {
  return _registryFileOverride || path.join(process.cwd(), '.aios', 'skills-registry.json');
}

function setSkillsDir(dir) {
  _skillsDirOverride = dir;
}

function setRegistryFile(file) {
  _registryFileOverride = file;
}

// ---------------------------------------------------------------------------
// Registry helpers
// ---------------------------------------------------------------------------

function loadRegistry() {
  const file = getRegistryFile();
  if (!fs.existsSync(file)) {
    return { skills: [], exportedAt: null };
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return { skills: [], exportedAt: null };
  }
}

function saveRegistry(registry) {
  const file = getRegistryFile();
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, JSON.stringify(registry, null, 2));
}

// ---------------------------------------------------------------------------
// Skill markdown renderer
// ---------------------------------------------------------------------------

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Render a skill object to Claude Code .md format
 * @param {object} skill - Skill from skill-generator
 * @param {string} cloneId - Clone identifier
 * @returns {string} Markdown content
 */
function renderSkillMarkdown(skill, cloneId) {
  const lines = [];

  // YAML frontmatter
  lines.push('---');
  lines.push(`name: ${skill.name || skill.id}`);
  lines.push(`description: ${skill.description || ''}`);
  if (cloneId) lines.push(`clone: ${cloneId}`);
  if (skill.category) lines.push(`category: ${skill.category}`);
  if (skill.specialist) lines.push(`specialist: ${skill.specialist}`);
  lines.push('---');
  lines.push('');

  // Body
  if (skill.description) {
    lines.push(skill.description);
    lines.push('');
  }

  // Steps
  if (Array.isArray(skill.steps) && skill.steps.length > 0) {
    lines.push('## Steps');
    lines.push('');
    skill.steps.forEach((step, i) => {
      if (typeof step === 'string') {
        lines.push(`${i + 1}. ${step}`);
      } else if (step && step.description) {
        lines.push(`${i + 1}. ${step.description}`);
      }
    });
    lines.push('');
  }

  // Checklist
  if (Array.isArray(skill.checklist) && skill.checklist.length > 0) {
    lines.push('## Checklist');
    lines.push('');
    skill.checklist.forEach(item => {
      const text = typeof item === 'string' ? item : (item.text || item.description || item);
      lines.push(`- [ ] ${text}`);
    });
    lines.push('');
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Export single skill
// ---------------------------------------------------------------------------

/**
 * Export a single skill as a Claude Code .md file
 * @param {object} skill - Skill object from skill-generator
 * @param {string} cloneId - Clone identifier (used for subdirectory and registry)
 * @param {object} [options]
 * @param {boolean} [options.overwrite=false] - Overwrite existing skill file
 * @returns {{ written: boolean, filepath: string, skipped: boolean, reason?: string }}
 */
function exportSkill(skill, cloneId, options = {}) {
  const { overwrite = false } = options;

  const category = skill.category ? slugify(skill.category) : 'clone-skills';
  const skillSlug = slugify(skill.name || skill.id);
  const filename = `${skillSlug}.md`;
  const skillDir = path.join(getSkillsDir(), category);
  const filepath = path.join(skillDir, filename);

  // Check registry for duplicates
  const registry = loadRegistry();
  const existing = registry.skills.find(s => s.id === skill.id && s.cloneId === cloneId);

  if (existing && !overwrite) {
    return { written: false, filepath: existing.filepath, skipped: true, reason: 'already_exported' };
  }

  // Create directory if needed
  if (!fs.existsSync(skillDir)) {
    fs.mkdirSync(skillDir, { recursive: true });
  }

  // Write skill file
  const content = renderSkillMarkdown(skill, cloneId);
  fs.writeFileSync(filepath, content, 'utf8');

  // Update registry
  const now = new Date().toISOString();
  if (existing) {
    existing.filepath = filepath;
    existing.exportedAt = now;
  } else {
    registry.skills.push({
      id: skill.id,
      name: skill.name,
      cloneId,
      category,
      filepath,
      exportedAt: now
    });
  }
  registry.exportedAt = now;
  saveRegistry(registry);

  return { written: true, filepath, skipped: false };
}

// ---------------------------------------------------------------------------
// Export all skills (batch)
// ---------------------------------------------------------------------------

/**
 * Export all skills from a clone
 * @param {object[]} skills - Array of skill objects from skill-generator
 * @param {string} cloneId - Clone identifier
 * @param {object} [options]
 * @param {boolean} [options.overwrite=false] - Overwrite existing skill files
 * @returns {{ exported: number, skipped: number, total: number, results: object[] }}
 */
function exportAllSkills(skills, cloneId, options = {}) {
  if (!Array.isArray(skills) || skills.length === 0) {
    return { exported: 0, skipped: 0, total: 0, results: [] };
  }

  const results = skills.map(skill => {
    const result = exportSkill(skill, cloneId, options);
    return { skill: skill.id, ...result };
  });

  const exported = results.filter(r => r.written).length;
  const skipped = results.filter(r => r.skipped).length;

  return { exported, skipped, total: skills.length, results };
}

// ---------------------------------------------------------------------------
// List exported skills for a clone
// ---------------------------------------------------------------------------

/**
 * List all skills exported for a given clone
 * @param {string} cloneId - Clone identifier (optional, returns all if omitted)
 * @returns {object[]}
 */
function listExportedSkills(cloneId) {
  const registry = loadRegistry();
  if (!cloneId) return registry.skills;
  return registry.skills.filter(s => s.cloneId === cloneId);
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (cmd === 'list') {
    const cloneId = args[1];
    const skills = listExportedSkills(cloneId);
    if (skills.length === 0) {
      console.log('No skills exported' + (cloneId ? ` for clone "${cloneId}"` : ''));
    } else {
      console.log(`Exported skills${cloneId ? ` for ${cloneId}` : ''} (${skills.length}):`);
      skills.forEach(s => console.log(`  [${s.cloneId}] ${s.name} → ${s.filepath}`));
    }
    process.exit(0);
  }

  if (cmd === 'export') {
    // export --clone <id> --file <skills.json> [--overwrite]
    const cloneIdx = args.indexOf('--clone');
    const fileIdx = args.indexOf('--file');
    const overwrite = args.includes('--overwrite');

    if (cloneIdx === -1 || fileIdx === -1) {
      console.error('Usage: skill-exporter export --clone <id> --file <skills.json> [--overwrite]');
      process.exit(1);
    }

    const cloneId = args[cloneIdx + 1];
    const skillsFile = args[fileIdx + 1];

    let skills;
    try {
      skills = JSON.parse(fs.readFileSync(skillsFile, 'utf8'));
    } catch (err) {
      console.error(`Failed to read skills file: ${err.message}`);
      process.exit(1);
    }

    const result = exportAllSkills(skills, cloneId, { overwrite });
    console.log(`Exported: ${result.exported}, Skipped: ${result.skipped}, Total: ${result.total}`);
    result.results.forEach(r => {
      const status = r.skipped ? 'SKIP' : 'WRITE';
      console.log(`  [${status}] ${r.skill} → ${r.filepath}`);
    });
    process.exit(0);
  }

  console.error(`Unknown command: ${cmd || '(none)'}`);
  console.error('Commands: list [cloneId], export --clone <id> --file <skills.json> [--overwrite]');
  process.exit(1);
}

module.exports = {
  exportSkill,
  exportAllSkills,
  listExportedSkills,
  renderSkillMarkdown,
  loadRegistry,
  setSkillsDir,
  setRegistryFile
};
