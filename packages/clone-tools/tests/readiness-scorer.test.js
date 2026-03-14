'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

let scorer;
let testDir;
let expertsDir;

beforeEach(() => {
  jest.resetModules();
  scorer = require('../readiness-scorer');

  testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'readiness-test-'));
  expertsDir = path.join(testDir, 'experts');
  fs.mkdirSync(expertsDir);

  scorer.setExpertsDir(expertsDir);
  scorer.setThreshold(70);
});

afterEach(() => {
  fs.rmSync(testDir, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createClone(id, options = {}) {
  const cloneDir = path.join(expertsDir, id);
  fs.mkdirSync(cloneDir, { recursive: true });

  // Clone YAML
  if (options.yaml !== false) {
    const status = options.status || '';
    const yaml = `name: ${options.name || id}\nrole: ${options.role || 'Expert Clone - Test'}\nstatus: ${status}\n`;
    fs.writeFileSync(path.join(cloneDir, `clone_${id}.yaml`), yaml);
  }

  // DNA
  if (options.dnaWords !== undefined) {
    const dnaDir = path.join(cloneDir, 'dna');
    fs.mkdirSync(dnaDir);
    const words = Array(options.dnaWords).fill('word').join(' ');
    fs.writeFileSync(path.join(dnaDir, 'compiled_dna.md'), words);
  }

  // Notebooks
  if (options.notebooks) {
    const nbDir = path.join(cloneDir, 'notebooks');
    fs.mkdirSync(nbDir);
    for (let i = 0; i < options.notebooks; i++) {
      fs.writeFileSync(path.join(nbDir, `notebook-${i}.md`), 'content');
    }
  }

  return cloneDir;
}

// ---------------------------------------------------------------------------
// scoreDnaCompleteness
// ---------------------------------------------------------------------------

describe('scoreDnaCompleteness', () => {
  test('returns 0 when compiled_dna.md missing', () => {
    const cloneDir = createClone('test', {});
    expect(scorer.scoreDnaCompleteness(cloneDir)).toBe(0);
  });

  test('returns 5 for very small DNA (< 100 words)', () => {
    const cloneDir = createClone('test', { dnaWords: 50 });
    expect(scorer.scoreDnaCompleteness(cloneDir)).toBe(5);
  });

  test('returns 15 for medium DNA (100-499 words)', () => {
    const cloneDir = createClone('test', { dnaWords: 200 });
    expect(scorer.scoreDnaCompleteness(cloneDir)).toBe(15);
  });

  test('returns 30 for large DNA (500+ words)', () => {
    const cloneDir = createClone('test', { dnaWords: 600 });
    expect(scorer.scoreDnaCompleteness(cloneDir)).toBe(30);
  });
});

// ---------------------------------------------------------------------------
// scoreSourceQuality
// ---------------------------------------------------------------------------

describe('scoreSourceQuality', () => {
  test('returns 0 when notebooks/ missing', () => {
    const cloneDir = createClone('test', {});
    expect(scorer.scoreSourceQuality(cloneDir)).toBe(0);
  });

  test('returns 5 for 1-2 notebooks', () => {
    const cloneDir = createClone('test', { notebooks: 2 });
    expect(scorer.scoreSourceQuality(cloneDir)).toBe(5);
  });

  test('returns 10 for 3+ notebooks', () => {
    const cloneDir = createClone('test', { notebooks: 5 });
    expect(scorer.scoreSourceQuality(cloneDir)).toBe(10);
  });
});

// ---------------------------------------------------------------------------
// scoreValidationStatus
// ---------------------------------------------------------------------------

describe('scoreValidationStatus', () => {
  test('returns 20 for Operational status', () => {
    expect(scorer.scoreValidationStatus({ status: 'Operational' })).toBe(20);
  });

  test('returns 20 for deployed/active variants', () => {
    expect(scorer.scoreValidationStatus({ status: 'deployed' })).toBe(20);
    expect(scorer.scoreValidationStatus({ status: 'Active' })).toBe(20);
  });

  test('returns 10 for InReview', () => {
    expect(scorer.scoreValidationStatus({ status: 'InReview' })).toBe(10);
  });

  test('returns 0 for no status', () => {
    expect(scorer.scoreValidationStatus({})).toBe(0);
  });

  test('returns 0 for Draft', () => {
    expect(scorer.scoreValidationStatus({ status: 'Draft' })).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// scoreSkillCount
// ---------------------------------------------------------------------------

describe('scoreSkillCount', () => {
  test('returns 0 when no registry file', () => {
    scorer.setSkillsRegistry('/nonexistent/registry.json');
    const score = scorer.scoreSkillCount('test-clone');
    expect(score).toBe(0);
  });

  test('scales linearly up to 10 skills = 20pts', () => {
    const regFile = path.join(testDir, 'registry.json');
    const registry = {
      skills: Array(10).fill(null).map((_, i) => ({ id: `skill-${i}`, cloneId: 'test-clone' }))
    };
    fs.writeFileSync(regFile, JSON.stringify(registry));
    scorer.setSkillsRegistry(regFile);

    expect(scorer.scoreSkillCount('test-clone')).toBe(20);
  });

  test('5 skills = 10pts', () => {
    const regFile = path.join(testDir, 'registry.json');
    const registry = {
      skills: Array(5).fill(null).map((_, i) => ({ id: `skill-${i}`, cloneId: 'test-clone' }))
    };
    fs.writeFileSync(regFile, JSON.stringify(registry));
    scorer.setSkillsRegistry(regFile);

    expect(scorer.scoreSkillCount('test-clone')).toBe(10);
  });
});

// ---------------------------------------------------------------------------
// scoreClone — integration
// ---------------------------------------------------------------------------

describe('scoreClone', () => {
  test('scores a full clone correctly', () => {
    createClone('full_clone', {
      dnaWords: 600,
      status: 'Operational',
      notebooks: 4
    });

    scorer.setSkillsRegistry('/nonexistent/registry.json'); // no skills

    const result = scorer.scoreClone('full_clone');
    expect(result.cloneId).toBe('full_clone');
    expect(result.dimensions.dna_completeness).toBe(30);
    expect(result.dimensions.validation_status).toBe(20);
    expect(result.dimensions.source_quality).toBe(10);
    expect(result.dimensions.skill_count).toBe(0);
    expect(result.total).toBe(result.dimensions.dna_completeness +
      result.dimensions.profile_depth +
      result.dimensions.validation_status +
      result.dimensions.source_quality +
      result.dimensions.skill_count);
  });

  test('never exceeds 100 points', () => {
    createClone('maxed', { dnaWords: 3000, status: 'Operational', notebooks: 10 });
    scorer.setSkillsRegistry('/nonexistent/registry.json');
    const result = scorer.scoreClone('maxed');
    expect(result.total).toBeLessThanOrEqual(100);
  });

  test('meetsThreshold=true when total >= threshold', () => {
    scorer.setThreshold(0); // Everyone meets it
    createClone('basic', {});
    scorer.setSkillsRegistry('/nonexistent/registry.json');
    const result = scorer.scoreClone('basic');
    expect(result.meetsThreshold).toBe(true);
  });

  test('meetsThreshold=false when total < threshold', () => {
    scorer.setThreshold(100); // Nobody meets it
    createClone('basic', {});
    scorer.setSkillsRegistry('/nonexistent/registry.json');
    const result = scorer.scoreClone('basic');
    expect(result.meetsThreshold).toBe(false);
  });

  test('throws for missing clone directory', () => {
    expect(() => scorer.scoreClone('nonexistent')).toThrow('Clone directory not found');
  });
});

// ---------------------------------------------------------------------------
// scoreAllClones
// ---------------------------------------------------------------------------

describe('scoreAllClones', () => {
  test('returns scores for all clones sorted descending', () => {
    createClone('clone_a', { dnaWords: 600, status: 'Operational' });
    createClone('clone_b', { dnaWords: 50 });
    scorer.setSkillsRegistry('/nonexistent/registry.json');

    const results = scorer.scoreAllClones();
    expect(results.length).toBe(2);
    // clone_a should be first (higher score)
    expect(results[0].total).toBeGreaterThanOrEqual(results[1].total);
  });

  test('returns empty array when experts dir missing', () => {
    scorer.setExpertsDir('/nonexistent/experts');
    expect(scorer.scoreAllClones()).toEqual([]);
  });

  test('skips _templates directory', () => {
    fs.mkdirSync(path.join(expertsDir, '_templates'));
    createClone('real_clone', {});
    scorer.setSkillsRegistry('/nonexistent/registry.json');

    const results = scorer.scoreAllClones();
    const ids = results.map(r => r.cloneId);
    expect(ids).not.toContain('_templates');
    expect(ids).toContain('real_clone');
  });
});
