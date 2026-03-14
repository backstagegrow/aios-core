'use strict';

/**
 * conclave-router — Selects relevant clones for a Conclave session based on domain
 *
 * AEV-5: Conclave como Decision Engine de Agentes
 * L4 — always modifiable
 *
 * Domain mapping:
 *   technical  → Architecture, Engineering, Systems, Operations, Constraints, Governance
 *   business   → Scaling, Offers, Leads, Pricing, Strategy, Finance, Franchise
 *   marketing  → Ads, Performance, Funnel, Copywriting, VSL, YouTube, Video
 *   ux         → Design, Branding, Visual, UX, Pricing (design), Differentiation
 *   strategy   → Mental Models, Decision-Making, Narrative, Storytelling, Movement
 */

const fs = require('fs');
const path = require('path');

// Testability overrides
let _expertsDirOverride = null;

function getExpertsDir() {
  return _expertsDirOverride || path.join(process.cwd(), 'experts');
}

function setExpertsDir(dir) {
  _expertsDirOverride = dir;
}

// ---------------------------------------------------------------------------
// Domain keyword map
// ---------------------------------------------------------------------------

const DOMAIN_KEYWORDS = {
  technical: [
    'engineering', 'systems', 'operations', 'constraints', 'governance',
    'architecture', 'infrastructure', 'code', 'data', 'database', 'devops'
  ],
  business: [
    'business', 'scaling', 'offers', 'leads', 'pricing', 'finance',
    'franchise', 'strategy', 'cfo', 'economics', 'growth', 'revenue'
  ],
  marketing: [
    'ads', 'advertising', 'performance', 'funnel', 'copywriting', 'vsl',
    'youtube', 'video', 'facebook', 'google', 'direct response', 'marketing'
  ],
  ux: [
    'design', 'branding', 'visual', 'ux', 'brand', 'differentiation',
    'identity', 'color', 'typography'
  ],
  strategy: [
    'mental models', 'decision', 'narrative', 'storytelling', 'movement',
    'rational', 'scripting', 'positioning', 'digital strategy'
  ]
};

// ---------------------------------------------------------------------------
// Load clones from experts/ directory
// ---------------------------------------------------------------------------

/**
 * Load all available clone definitions from experts/ directory
 * Supports both YAML (via js-yaml) and fallback name extraction
 * @returns {object[]} Array of clone definitions
 */
function loadAvailableClones() {
  const expertsDir = getExpertsDir();
  if (!fs.existsSync(expertsDir)) return [];

  let yaml;
  try {
    yaml = require('js-yaml');
  } catch {
    yaml = null;
  }

  const clones = [];
  const entries = fs.readdirSync(expertsDir);

  for (const entry of entries) {
    const entryPath = path.join(expertsDir, entry);
    if (!fs.statSync(entryPath).isDirectory()) continue;
    if (entry === '_templates') continue;

    // Find clone YAML file
    const files = fs.readdirSync(entryPath);
    const yamlFile = files.find(f => f.startsWith('clone_') && (f.endsWith('.yaml') || f.endsWith('.yml')));

    if (!yamlFile) continue;

    const yamlPath = path.join(entryPath, yamlFile);
    let cloneData = {};

    if (yaml) {
      try {
        cloneData = yaml.load(fs.readFileSync(yamlPath, 'utf8')) || {};
      } catch {
        // Fallback to empty
      }
    }

    clones.push({
      id: entry,
      name: cloneData.name || entry,
      role: cloneData.role || '',
      yamlPath
    });
  }

  return clones;
}

// ---------------------------------------------------------------------------
// Domain scoring
// ---------------------------------------------------------------------------

/**
 * Score how relevant a clone is for a given domain
 * @param {object} clone - Clone definition with `role` string
 * @param {string} domain - One of: technical, business, marketing, ux, strategy
 * @returns {number} Match score (0 = no match, N = N keywords matched)
 */
function scoreCloneForDomain(clone, domain) {
  const keywords = DOMAIN_KEYWORDS[domain];
  if (!keywords) return 0;

  const roleText = (clone.role || '').toLowerCase();
  let score = 0;

  for (const keyword of keywords) {
    if (roleText.includes(keyword)) score++;
  }

  return score;
}

/**
 * Select clones for a Conclave session
 * @param {string} domain - Decision domain: technical|business|marketing|ux|strategy
 * @param {object} [options]
 * @param {number} [options.min=2] - Minimum clones required
 * @param {number} [options.max=5] - Maximum clones to select
 * @param {object[]} [options.availableClones] - Override (for testing)
 * @returns {{ selected: object[], domain: string, fallbackUsed: boolean }}
 */
function selectClones(domain, options = {}) {
  const { min = 2, max = 5 } = options;
  const allClones = options.availableClones || loadAvailableClones();

  // Score all clones for the domain
  const scored = allClones.map(clone => ({
    ...clone,
    score: scoreCloneForDomain(clone, domain)
  }));

  // Filter by domain relevance (score > 0)
  const relevant = scored
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max);

  if (relevant.length >= min) {
    return { selected: relevant, domain, fallbackUsed: false };
  }

  // Fallback: use top-3 clones regardless of domain (by alphabetical order as tiebreaker)
  const fallback = [...scored]
    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
    .slice(0, Math.min(max, 3));

  return { selected: fallback, domain, fallbackUsed: true };
}

// ---------------------------------------------------------------------------
// Trigger detection
// ---------------------------------------------------------------------------

/**
 * Check if a complexity score triggers Conclave
 * @param {number} score - Complexity score from spec pipeline
 * @param {object} [config] - Conclave config (from core-config.yaml)
 * @returns {boolean}
 */
function shouldTriggerOnComplexity(score, config = {}) {
  const threshold = (config.autoTrigger && config.autoTrigger.onComplexityScore) || 16;
  return score >= threshold;
}

/**
 * Check if an architect decision marked HIGH triggers Conclave
 * @param {string} complexityFlag - 'HIGH' | 'MEDIUM' | 'LOW'
 * @param {object} [config]
 * @returns {boolean}
 */
function shouldTriggerOnArchitectDecision(complexityFlag, config = {}) {
  const enabled = !config.autoTrigger || config.autoTrigger.onArchitectHighDecision !== false;
  return enabled && complexityFlag === 'HIGH';
}

module.exports = {
  selectClones,
  loadAvailableClones,
  scoreCloneForDomain,
  shouldTriggerOnComplexity,
  shouldTriggerOnArchitectDecision,
  setExpertsDir,
  DOMAIN_KEYWORDS
};
