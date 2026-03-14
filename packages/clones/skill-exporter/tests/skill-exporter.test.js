'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

let exporter;
let testDir;
let skillsDir;
let registryFile;

beforeEach(() => {
  // Fresh require each test to reset module state
  jest.resetModules();
  exporter = require('../index');

  testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'skill-exporter-test-'));
  skillsDir = path.join(testDir, 'skills');
  registryFile = path.join(testDir, 'registry.json');

  exporter.setSkillsDir(skillsDir);
  exporter.setRegistryFile(registryFile);
});

afterEach(() => {
  fs.rmSync(testDir, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeSkill(overrides = {}) {
  return {
    id: 'test-skill-1',
    name: 'Test Skill One',
    description: 'Does something great',
    category: 'Sales Frameworks',
    specialist: 'alex_hormozi',
    steps: ['Step one', 'Step two', 'Step three'],
    checklist: ['Item A', 'Item B'],
    ...overrides
  };
}

// ---------------------------------------------------------------------------
// renderSkillMarkdown
// ---------------------------------------------------------------------------

describe('renderSkillMarkdown', () => {
  test('produces valid YAML frontmatter', () => {
    const skill = makeSkill();
    const md = exporter.renderSkillMarkdown(skill, 'alex_hormozi');
    expect(md).toContain('---');
    expect(md).toContain('name: Test Skill One');
    expect(md).toContain('description: Does something great');
    expect(md).toContain('clone: alex_hormozi');
    expect(md).toContain('category: Sales Frameworks');
  });

  test('renders steps as numbered list', () => {
    const skill = makeSkill();
    const md = exporter.renderSkillMarkdown(skill, 'clone1');
    expect(md).toContain('## Steps');
    expect(md).toContain('1. Step one');
    expect(md).toContain('2. Step two');
    expect(md).toContain('3. Step three');
  });

  test('renders checklist items', () => {
    const skill = makeSkill();
    const md = exporter.renderSkillMarkdown(skill, 'clone1');
    expect(md).toContain('## Checklist');
    expect(md).toContain('- [ ] Item A');
    expect(md).toContain('- [ ] Item B');
  });

  test('handles missing steps and checklist', () => {
    const skill = makeSkill({ steps: undefined, checklist: undefined });
    const md = exporter.renderSkillMarkdown(skill, 'clone1');
    expect(md).not.toContain('## Steps');
    expect(md).not.toContain('## Checklist');
  });

  test('omits clone frontmatter key when cloneId is falsy', () => {
    const skill = makeSkill();
    const md = exporter.renderSkillMarkdown(skill, '');
    expect(md).not.toContain('clone:');
  });
});

// ---------------------------------------------------------------------------
// exportSkill
// ---------------------------------------------------------------------------

describe('exportSkill', () => {
  test('creates skill file in category subdirectory', () => {
    const skill = makeSkill();
    const result = exporter.exportSkill(skill, 'alex_hormozi');
    expect(result.written).toBe(true);
    expect(result.skipped).toBe(false);
    expect(fs.existsSync(result.filepath)).toBe(true);
    // Category slug: sales-frameworks
    expect(result.filepath).toContain('sales-frameworks');
    expect(result.filepath).toContain('test-skill-one.md');
  });

  test('file content contains frontmatter and steps', () => {
    const skill = makeSkill();
    const result = exporter.exportSkill(skill, 'clone1');
    const content = fs.readFileSync(result.filepath, 'utf8');
    expect(content).toContain('name: Test Skill One');
    expect(content).toContain('1. Step one');
  });

  test('updates registry after export', () => {
    const skill = makeSkill();
    exporter.exportSkill(skill, 'clone1');
    const registry = exporter.loadRegistry();
    expect(registry.skills).toHaveLength(1);
    expect(registry.skills[0].id).toBe('test-skill-1');
    expect(registry.skills[0].cloneId).toBe('clone1');
  });

  test('skips duplicate by default', () => {
    const skill = makeSkill();
    exporter.exportSkill(skill, 'clone1');
    const result2 = exporter.exportSkill(skill, 'clone1');
    expect(result2.skipped).toBe(true);
    expect(result2.reason).toBe('already_exported');
  });

  test('overwrites when overwrite=true', () => {
    const skill = makeSkill();
    exporter.exportSkill(skill, 'clone1');
    const result2 = exporter.exportSkill(skill, 'clone1', { overwrite: true });
    expect(result2.written).toBe(true);
    expect(result2.skipped).toBe(false);
  });

  test('uses "clone-skills" category when category missing', () => {
    const skill = makeSkill({ category: undefined });
    const result = exporter.exportSkill(skill, 'clone1');
    expect(result.filepath).toContain('clone-skills');
  });

  test('slugifies special characters in skill name', () => {
    const skill = makeSkill({ name: 'Grand Slam Offer™ Framework' });
    const result = exporter.exportSkill(skill, 'clone1');
    expect(result.filepath).toContain('grand-slam-offer-framework.md');
  });
});

// ---------------------------------------------------------------------------
// exportAllSkills
// ---------------------------------------------------------------------------

describe('exportAllSkills', () => {
  test('exports multiple skills', () => {
    const skills = [
      makeSkill({ id: 's1', name: 'Skill One' }),
      makeSkill({ id: 's2', name: 'Skill Two' }),
      makeSkill({ id: 's3', name: 'Skill Three' })
    ];
    const result = exporter.exportAllSkills(skills, 'clone1');
    expect(result.exported).toBe(3);
    expect(result.skipped).toBe(0);
    expect(result.total).toBe(3);
    expect(result.results).toHaveLength(3);
  });

  test('returns zero counts for empty array', () => {
    const result = exporter.exportAllSkills([], 'clone1');
    expect(result.exported).toBe(0);
    expect(result.total).toBe(0);
  });

  test('counts skipped duplicates', () => {
    const skills = [makeSkill({ id: 's1', name: 'Skill One' })];
    exporter.exportAllSkills(skills, 'clone1');
    const result = exporter.exportAllSkills(skills, 'clone1');
    expect(result.exported).toBe(0);
    expect(result.skipped).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// listExportedSkills
// ---------------------------------------------------------------------------

describe('listExportedSkills', () => {
  test('returns all skills when cloneId omitted', () => {
    exporter.exportSkill(makeSkill({ id: 's1', name: 'S1' }), 'cloneA');
    exporter.exportSkill(makeSkill({ id: 's2', name: 'S2' }), 'cloneB');
    const all = exporter.listExportedSkills();
    expect(all).toHaveLength(2);
  });

  test('filters by cloneId', () => {
    exporter.exportSkill(makeSkill({ id: 's1', name: 'S1' }), 'cloneA');
    exporter.exportSkill(makeSkill({ id: 's2', name: 'S2' }), 'cloneB');
    const filtered = exporter.listExportedSkills('cloneA');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].cloneId).toBe('cloneA');
  });

  test('returns empty array for unknown cloneId', () => {
    const result = exporter.listExportedSkills('nonexistent');
    expect(result).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// loadRegistry — empty state
// ---------------------------------------------------------------------------

describe('loadRegistry', () => {
  test('returns empty registry when file does not exist', () => {
    const registry = exporter.loadRegistry();
    expect(registry.skills).toEqual([]);
    expect(registry.exportedAt).toBeNull();
  });

  test('returns empty registry for corrupt JSON', () => {
    fs.mkdirSync(path.dirname(registryFile), { recursive: true });
    fs.writeFileSync(registryFile, 'NOT JSON');
    const registry = exporter.loadRegistry();
    expect(registry.skills).toEqual([]);
  });
});
