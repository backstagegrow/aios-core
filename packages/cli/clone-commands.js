'use strict';

/**
 * clone-commands — CLI entry point for clone skill export pipeline
 *
 * AEV-3: Clone→Skill→Claude Code Pipeline
 * L4 — always modifiable
 *
 * Usage:
 *   node clone-commands.js export-skills <cloneId> [--overwrite]
 *   node clone-commands.js list-skills [cloneId]
 *   node clone-commands.js generate-and-export <clonePath> [--overwrite]
 */

'use strict';

const path = require('path');
const fs = require('fs');

// Lazy-load to allow mocking in tests
function getSkillGenerator() {
  return require('../clones/skill-generator/index');
}

function getSkillExporter() {
  return require('../clones/skill-exporter/index');
}

// ---------------------------------------------------------------------------
// Command: list-skills
// ---------------------------------------------------------------------------

function cmdListSkills(cloneId) {
  const exporter = getSkillExporter();
  const skills = exporter.listExportedSkills(cloneId);

  if (skills.length === 0) {
    console.log('No skills exported' + (cloneId ? ` for clone "${cloneId}"` : ''));
    return { count: 0, skills: [] };
  }

  console.log(`Exported skills${cloneId ? ` (${cloneId})` : ''}: ${skills.length}`);
  skills.forEach(s => {
    console.log(`  [${s.cloneId}] ${s.name || s.id} → ${s.filepath}`);
  });

  return { count: skills.length, skills };
}

// ---------------------------------------------------------------------------
// Command: export-skills
// Loads skills from a JSON file or generates them from clone YAML
// ---------------------------------------------------------------------------

function cmdExportSkills(cloneId, skillsOrPath, options = {}) {
  const exporter = getSkillExporter();

  let skills;
  if (typeof skillsOrPath === 'string') {
    // Path to JSON file
    if (!fs.existsSync(skillsOrPath)) {
      throw new Error(`Skills file not found: ${skillsOrPath}`);
    }
    skills = JSON.parse(fs.readFileSync(skillsOrPath, 'utf8'));
  } else if (Array.isArray(skillsOrPath)) {
    skills = skillsOrPath;
  } else {
    throw new Error('skillsOrPath must be a file path string or an array of skill objects');
  }

  const result = exporter.exportAllSkills(skills, cloneId, options);
  console.log(`[export-skills] clone=${cloneId} exported=${result.exported} skipped=${result.skipped} total=${result.total}`);
  return result;
}

// ---------------------------------------------------------------------------
// Command: generate-and-export
// Loads clone YAML → generates skills → exports to .claude/skills/
// ---------------------------------------------------------------------------

function cmdGenerateAndExport(clonePath, options = {}) {
  if (!fs.existsSync(clonePath)) {
    throw new Error(`Clone file not found: ${clonePath}`);
  }

  // Load clone YAML (js-yaml available in project deps)
  let yaml;
  try {
    yaml = require('js-yaml');
  } catch {
    throw new Error('js-yaml is required. Run: npm install js-yaml');
  }

  const cloneData = yaml.load(fs.readFileSync(clonePath, 'utf8'));
  const cloneId = cloneData.id || path.basename(clonePath, path.extname(clonePath));

  // Build DNA profile from clone YAML
  const dnaProfile = {
    id: cloneId,
    name: cloneData.name || cloneId,
    role: cloneData.role || '',
    frameworks: cloneData.frameworks || [],
    principles: cloneData.principles || [],
    expertise: cloneData.expertise || [],
    system_prompt: cloneData.system_prompt || ''
  };

  const generator = getSkillGenerator();
  const skills = generator.generateSkills(dnaProfile);

  if (!skills || skills.length === 0) {
    console.log(`[generate-and-export] No skills generated for clone "${cloneId}"`);
    return { cloneId, generated: 0, exported: 0, skipped: 0, total: 0, results: [] };
  }

  console.log(`[generate-and-export] Generated ${skills.length} skills for clone "${cloneId}"`);

  const exporter = getSkillExporter();
  const result = exporter.exportAllSkills(skills, cloneId, options);
  console.log(`[generate-and-export] exported=${result.exported} skipped=${result.skipped} total=${result.total}`);

  return { cloneId, generated: skills.length, ...result };
}

// ---------------------------------------------------------------------------
// CLI entrypoint
// ---------------------------------------------------------------------------

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];

  try {
    if (cmd === 'list-skills') {
      cmdListSkills(args[1]);
      process.exit(0);
    }

    if (cmd === 'export-skills') {
      const cloneId = args[1];
      const skillsFile = args[2];
      if (!cloneId || !skillsFile) {
        console.error('Usage: clone-commands export-skills <cloneId> <skills.json> [--overwrite]');
        process.exit(1);
      }
      cmdExportSkills(cloneId, skillsFile, { overwrite: args.includes('--overwrite') });
      process.exit(0);
    }

    if (cmd === 'generate-and-export') {
      const clonePath = args[1];
      if (!clonePath) {
        console.error('Usage: clone-commands generate-and-export <clone.yaml> [--overwrite]');
        process.exit(1);
      }
      cmdGenerateAndExport(clonePath, { overwrite: args.includes('--overwrite') });
      process.exit(0);
    }

    console.error(`Unknown command: ${cmd || '(none)'}`);
    console.error('Commands: list-skills [cloneId], export-skills <cloneId> <skills.json>, generate-and-export <clone.yaml>');
    process.exit(1);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = {
  cmdListSkills,
  cmdExportSkills,
  cmdGenerateAndExport
};
