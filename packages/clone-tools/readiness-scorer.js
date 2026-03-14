'use strict';

/**
 * readiness-scorer — Calculates clone readiness score for auto-squad deployment
 *
 * AEV-6: Clone Readiness → Auto-Squad Deploy
 * L4 — always modifiable
 *
 * Score dimensions (max 100 pts):
 *   dna_completeness   0-30  All 5 DNA layers present and sized
 *   skill_count        0-20  Number of skills (max at 10)
 *   profile_depth      0-20  Volume of compiled_dna.md (word count)
 *   validation_status  0-20  Clone YAML has status=Operational
 *   source_quality     0-10  Notebooks present (rich sources)
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Testability overrides
// ---------------------------------------------------------------------------

let _expertsDirOverride = null;
let _skillsRegistryOverride = null;
let _thresholdOverride = null;

function getExpertsDir() {
  return _expertsDirOverride || path.join(process.cwd(), 'experts');
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

function getThreshold() {
  return _thresholdOverride !== null ? _thresholdOverride : 70;
}

function setExpertsDir(dir) {
  _expertsDirOverride = dir;
}

function setSkillsRegistry(file) {
  _skillsRegistryOverride = file;
}

function setThreshold(t) {
  _thresholdOverride = t;
}

// ---------------------------------------------------------------------------
// Dimension scoring helpers
// ---------------------------------------------------------------------------

/**
 * dna_completeness: 0-30 pts
 * Full 30 if compiled_dna.md exists and >= 500 words.
 * Partial (15) if file exists but < 500 words.
 * 0 if missing.
 */
function scoreDnaCompleteness(clonePath) {
  const dnaPath = path.join(clonePath, 'dna', 'compiled_dna.md');
  if (!fs.existsSync(dnaPath)) return 0;

  const content = fs.readFileSync(dnaPath, 'utf8');
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  if (wordCount >= 500) return 30;
  if (wordCount >= 100) return 15;
  return 5;
}

/**
 * skill_count: 0-20 pts
 * Scales linearly: 0 skills → 0pts, 10+ skills → 20pts
 */
function scoreSkillCount(cloneId) {
  const registry = getSkillsRegistry();
  const cloneSkills = registry.skills.filter(s => s.cloneId === cloneId);
  const count = cloneSkills.length;
  return Math.min(Math.round((count / 10) * 20), 20);
}

/**
 * profile_depth: 0-20 pts
 * Based on word count of compiled_dna.md:
 * 0-99 words → 0, 100-499 → 5, 500-999 → 10, 1000-2499 → 15, 2500+ → 20
 */
function scoreProfileDepth(clonePath) {
  const dnaPath = path.join(clonePath, 'dna', 'compiled_dna.md');
  if (!fs.existsSync(dnaPath)) return 0;

  const content = fs.readFileSync(dnaPath, 'utf8');
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  if (wordCount >= 2500) return 20;
  if (wordCount >= 1000) return 15;
  if (wordCount >= 500) return 10;
  if (wordCount >= 100) return 5;
  return 0;
}

/**
 * validation_status: 0-20 pts
 * 20 if clone YAML has status=Operational (or Operational variant)
 * 10 if status=InReview or similar
 * 0 if no status or Draft
 */
function scoreValidationStatus(cloneData) {
  const status = (cloneData.status || '').toLowerCase();
  if (status.includes('operational') || status.includes('deployed') || status.includes('active')) {
    return 20;
  }
  if (status.includes('review') || status.includes('testing') || status.includes('validated')) {
    return 10;
  }
  return 0;
}

/**
 * source_quality: 0-10 pts
 * Based on notebooks directory (rich multimedia sources)
 * 10 if notebooks/ has 3+ files, 5 if 1-2 files, 0 if empty/missing
 */
function scoreSourceQuality(clonePath) {
  const notebooksPath = path.join(clonePath, 'notebooks');
  if (!fs.existsSync(notebooksPath)) return 0;

  const files = fs.readdirSync(notebooksPath).filter(f => !f.startsWith('.'));
  if (files.length >= 3) return 10;
  if (files.length >= 1) return 5;
  return 0;
}

// ---------------------------------------------------------------------------
// Main scoring API
// ---------------------------------------------------------------------------

/**
 * Calculate readiness score for a single clone
 * @param {string} cloneId - e.g. 'alex_hormozi'
 * @param {object} [cloneData] - Parsed clone YAML (optional, will be loaded if not provided)
 * @returns {object} { cloneId, total, dimensions, meetsThreshold }
 */
function scoreClone(cloneId, cloneData) {
  const clonePath = path.join(getExpertsDir(), cloneId);

  if (!fs.existsSync(clonePath)) {
    throw new Error(`Clone directory not found: ${clonePath}`);
  }

  // Load clone YAML if not provided
  if (!cloneData) {
    let yaml;
    try { yaml = require('js-yaml'); } catch { yaml = null; }

    const files = fs.readdirSync(clonePath);
    const yamlFile = files.find(f => f.startsWith('clone_') && (f.endsWith('.yaml') || f.endsWith('.yml')));

    if (yamlFile && yaml) {
      try {
        cloneData = yaml.load(fs.readFileSync(path.join(clonePath, yamlFile), 'utf8')) || {};
      } catch {
        cloneData = {};
      }
    } else {
      cloneData = {};
    }
  }

  const dimensions = {
    dna_completeness: scoreDnaCompleteness(clonePath),
    skill_count: scoreSkillCount(cloneId),
    profile_depth: scoreProfileDepth(clonePath),
    validation_status: scoreValidationStatus(cloneData),
    source_quality: scoreSourceQuality(clonePath)
  };

  const total = Math.min(
    Object.values(dimensions).reduce((sum, v) => sum + v, 0),
    100
  );

  return {
    cloneId,
    name: cloneData.name || cloneId,
    role: cloneData.role || '',
    total,
    dimensions,
    meetsThreshold: total >= getThreshold(),
    threshold: getThreshold()
  };
}

/**
 * Score all clones in experts/ directory
 * @returns {object[]} Sorted by total score descending
 */
function scoreAllClones() {
  const expertsDir = getExpertsDir();
  if (!fs.existsSync(expertsDir)) return [];

  const entries = fs.readdirSync(expertsDir);
  const results = [];

  for (const entry of entries) {
    const entryPath = path.join(expertsDir, entry);
    if (entry === '_templates') continue;
    if (!fs.statSync(entryPath).isDirectory()) continue;

    try {
      const score = scoreClone(entry);
      results.push(score);
    } catch {
      // Skip clones that can't be scored
    }
  }

  return results.sort((a, b) => b.total - a.total);
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

if (require.main === module) {
  const args = process.argv.slice(2);
  const cloneIdIdx = args.indexOf('--clone-id');
  const cloneId = cloneIdIdx !== -1 ? args[cloneIdIdx + 1] : null;

  if (cloneId) {
    try {
      const result = scoreClone(cloneId);
      console.log(`Clone: ${result.cloneId} (${result.name})`);
      console.log(`Total Score: ${result.total}/100 (threshold: ${result.threshold})`);
      console.log(`Meets Threshold: ${result.meetsThreshold ? 'YES' : 'NO'}`);
      console.log('Dimensions:');
      Object.entries(result.dimensions).forEach(([k, v]) => {
        console.log(`  ${k}: ${v}`);
      });
    } catch (err) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  } else {
    const all = scoreAllClones();
    if (all.length === 0) {
      console.log('No clones found');
    } else {
      console.log(`Clone Readiness Report (${all.length} clones):`);
      all.forEach(r => {
        const status = r.meetsThreshold ? '[READY]' : '[pending]';
        console.log(`  ${status} ${r.cloneId}: ${r.total}/100`);
      });
    }
  }
  process.exit(0);
}

module.exports = {
  scoreClone,
  scoreAllClones,
  scoreDnaCompleteness,
  scoreSkillCount,
  scoreProfileDepth,
  scoreValidationStatus,
  scoreSourceQuality,
  setExpertsDir,
  setSkillsRegistry,
  setThreshold,
  getThreshold
};
