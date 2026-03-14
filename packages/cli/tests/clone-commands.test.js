'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

let testDir;
let skillsDir;
let registryFile;

// We need to mock the internal modules before requiring clone-commands
beforeEach(() => {
  jest.resetModules();

  testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'clone-cmd-test-'));
  skillsDir = path.join(testDir, 'skills');
  registryFile = path.join(testDir, 'registry.json');

  // Set up real exporter with temp dirs
  const exporter = require('../../clones/skill-exporter/index');
  exporter.setSkillsDir(skillsDir);
  exporter.setRegistryFile(registryFile);
});

afterEach(() => {
  fs.rmSync(testDir, { recursive: true, force: true });
});

function makeSkill(overrides = {}) {
  return {
    id: 'cmd-skill-1',
    name: 'Command Skill One',
    description: 'A skill for testing commands',
    category: 'Testing',
    steps: ['Do A', 'Do B'],
    checklist: ['Check 1'],
    ...overrides
  };
}

// ---------------------------------------------------------------------------
// cmdListSkills
// ---------------------------------------------------------------------------

describe('cmdListSkills', () => {
  test('returns empty result when no skills exported', () => {
    const cmds = require('../clone-commands');
    const result = cmds.cmdListSkills();
    expect(result.count).toBe(0);
    expect(result.skills).toHaveLength(0);
  });

  test('returns skills after export', () => {
    // Export a skill first
    const exporter = require('../../clones/skill-exporter/index');
    exporter.exportSkill(makeSkill(), 'cloneX');

    const cmds = require('../clone-commands');
    const result = cmds.cmdListSkills('cloneX');
    expect(result.count).toBe(1);
    expect(result.skills[0].cloneId).toBe('cloneX');
  });

  test('filters by cloneId', () => {
    const exporter = require('../../clones/skill-exporter/index');
    exporter.exportSkill(makeSkill({ id: 's1', name: 'S1' }), 'cloneA');
    exporter.exportSkill(makeSkill({ id: 's2', name: 'S2' }), 'cloneB');

    const cmds = require('../clone-commands');
    const result = cmds.cmdListSkills('cloneB');
    expect(result.count).toBe(1);
    expect(result.skills[0].cloneId).toBe('cloneB');
  });
});

// ---------------------------------------------------------------------------
// cmdExportSkills
// ---------------------------------------------------------------------------

describe('cmdExportSkills', () => {
  test('exports skills from array', () => {
    const skills = [makeSkill(), makeSkill({ id: 's2', name: 'Skill Two' })];
    const cmds = require('../clone-commands');
    const result = cmds.cmdExportSkills('cloneY', skills);
    expect(result.exported).toBe(2);
    expect(result.total).toBe(2);
  });

  test('exports skills from JSON file', () => {
    const skills = [makeSkill()];
    const jsonFile = path.join(testDir, 'skills.json');
    fs.writeFileSync(jsonFile, JSON.stringify(skills));

    const cmds = require('../clone-commands');
    const result = cmds.cmdExportSkills('cloneZ', jsonFile);
    expect(result.exported).toBe(1);
  });

  test('throws when JSON file not found', () => {
    const cmds = require('../clone-commands');
    expect(() => cmds.cmdExportSkills('cloneZ', '/nonexistent/path.json')).toThrow('Skills file not found');
  });

  test('throws for invalid skillsOrPath type', () => {
    const cmds = require('../clone-commands');
    expect(() => cmds.cmdExportSkills('cloneZ', 42)).toThrow('skillsOrPath must be a file path string or an array');
  });

  test('skips duplicates by default', () => {
    const skills = [makeSkill()];
    const cmds = require('../clone-commands');
    cmds.cmdExportSkills('cloneY', skills);
    const result = cmds.cmdExportSkills('cloneY', skills);
    expect(result.exported).toBe(0);
    expect(result.skipped).toBe(1);
  });

  test('overwrites when overwrite=true', () => {
    const skills = [makeSkill()];
    const cmds = require('../clone-commands');
    cmds.cmdExportSkills('cloneY', skills);
    const result = cmds.cmdExportSkills('cloneY', skills, { overwrite: true });
    expect(result.exported).toBe(1);
    expect(result.skipped).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// cmdGenerateAndExport — mocked skill-generator
// ---------------------------------------------------------------------------

describe('cmdGenerateAndExport', () => {
  test('throws when clone file not found', () => {
    const cmds = require('../clone-commands');
    expect(() => cmds.cmdGenerateAndExport('/nonexistent/clone.yaml')).toThrow('Clone file not found');
  });

  test('generates and exports skills from YAML clone', () => {
    // Write a minimal clone YAML to testDir
    const cloneYaml = `
id: test_clone
name: Test Clone
role: Testing Expert
frameworks:
  - Test Framework
principles:
  - Always test
expertise:
  - Unit Testing
`;
    const cloneFile = path.join(testDir, 'test_clone.yaml');
    fs.writeFileSync(cloneFile, cloneYaml);

    // Mock skill-generator to return predictable skills
    jest.mock('../../clones/skill-generator/index', () => ({
      generateSkills: () => [
        {
          id: 'gen-skill-1',
          name: 'Generated Skill',
          description: 'Auto-generated',
          category: 'Testing',
          steps: ['Step 1'],
          checklist: ['Check 1']
        }
      ]
    }));

    const cmds = require('../clone-commands');
    const result = cmds.cmdGenerateAndExport(cloneFile);
    expect(result.cloneId).toBe('test_clone');
    expect(result.generated).toBe(1);
    expect(result.exported).toBe(1);
  });

  test('returns zero exported when generator returns empty', () => {
    const cloneYaml = `id: empty_clone\nname: Empty Clone\n`;
    const cloneFile = path.join(testDir, 'empty_clone.yaml');
    fs.writeFileSync(cloneFile, cloneYaml);

    jest.mock('../../clones/skill-generator/index', () => ({
      generateSkills: () => []
    }));

    const cmds = require('../clone-commands');
    const result = cmds.cmdGenerateAndExport(cloneFile);
    expect(result.generated).toBe(0);
    expect(result.exported).toBe(0);
  });
});
