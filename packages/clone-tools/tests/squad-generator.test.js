'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

let generator;
let testDir;
let squadsDir;
let registryFile;
let entityRegistryFile;

beforeEach(() => {
  jest.resetModules();
  generator = require('../squad-generator');

  testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'squad-gen-test-'));
  squadsDir = path.join(testDir, 'squads');
  registryFile = path.join(testDir, 'skills-registry.json');
  entityRegistryFile = path.join(testDir, 'entity-registry.yaml');

  fs.mkdirSync(squadsDir);

  generator.setSquadsDir(squadsDir);
  generator.setEntityRegistry(entityRegistryFile);
  generator.setSkillsRegistry(registryFile);
});

afterEach(() => {
  fs.rmSync(testDir, { recursive: true, force: true });
});

function makeScore(overrides = {}) {
  return {
    cloneId: 'alex_hormozi',
    name: 'Alex Hormozi Clone',
    role: 'Expert Clone - Business Scaling, Offers, Leads and Pricing',
    total: 80,
    ...overrides
  };
}

// ---------------------------------------------------------------------------
// generateSquad
// ---------------------------------------------------------------------------

describe('generateSquad', () => {
  test('creates squad.yaml in squads/{slug}/', () => {
    const result = generator.generateSquad(makeScore());
    expect(result.created).toBe(true);
    expect(fs.existsSync(result.squadPath)).toBe(true);
    expect(result.squadPath).toContain('alex-hormozi');
  });

  test('squad.yaml contains required fields', () => {
    const result = generator.generateSquad(makeScore());
    const content = fs.readFileSync(result.squadPath, 'utf8');
    expect(content).toContain('name:');
    expect(content).toContain('clone_source:');
    expect(content).toContain('specialist:');
    expect(content).toContain('readiness_score:');
    expect(content).toContain('deployed_at:');
    expect(content).toContain('activation_prompt:');
  });

  test('skips if squad already exists', () => {
    generator.generateSquad(makeScore());
    const result2 = generator.generateSquad(makeScore());
    expect(result2.skipped).toBe(true);
    expect(result2.reason).toBe('already_exists');
  });

  test('overwrites when force=true', () => {
    generator.generateSquad(makeScore());
    const result2 = generator.generateSquad(makeScore(), { force: true });
    expect(result2.created).toBe(true);
    expect(result2.skipped).toBe(false);
  });

  test('includes skills from registry', () => {
    const skills = [
      { id: 'skill-offers', cloneId: 'alex_hormozi', name: 'Grand Slam Offers' },
      { id: 'skill-pricing', cloneId: 'alex_hormozi', name: 'Value Pricing' }
    ];
    fs.writeFileSync(registryFile, JSON.stringify({ skills }));

    const result = generator.generateSquad(makeScore());
    const content = fs.readFileSync(result.squadPath, 'utf8');
    expect(content).toContain('skill-offers');
    expect(content).toContain('skill-pricing');
  });

  test('works when no skills in registry', () => {
    // registryFile doesn't exist
    const result = generator.generateSquad(makeScore());
    expect(result.created).toBe(true);
  });

  test('slugifies clone id for directory name', () => {
    const result = generator.generateSquad(makeScore({ cloneId: 'My Clone Name' }));
    expect(result.squadPath).toContain('my-clone-name');
  });
});

// ---------------------------------------------------------------------------
// updateEntityRegistry
// ---------------------------------------------------------------------------

describe('updateEntityRegistry', () => {
  test('creates registry file if not exists', () => {
    generator.updateEntityRegistry({
      cloneId: 'alex_hormozi',
      squadPath: '/squads/alex/squad.yaml',
      readinessScore: 80
    });
    expect(fs.existsSync(entityRegistryFile)).toBe(true);
  });

  test('appends squad entry to registry', () => {
    generator.updateEntityRegistry({
      cloneId: 'alex_hormozi',
      squadPath: '/squads/alex/squad.yaml',
      readinessScore: 80
    });
    const content = fs.readFileSync(entityRegistryFile, 'utf8');
    expect(content).toContain('squad-alex-hormozi');
    expect(content).toContain('type: squad');
    expect(content).toContain('status: production');
  });

  test('does not duplicate entries', () => {
    const params = { cloneId: 'alex_hormozi', squadPath: '/squads/alex/squad.yaml', readinessScore: 80 };
    generator.updateEntityRegistry(params);
    const result2 = generator.updateEntityRegistry(params);
    expect(result2.updated).toBe(false);
    expect(result2.reason).toBe('already_registered');
  });
});

// ---------------------------------------------------------------------------
// deployCloneAsSquad — integration
// ---------------------------------------------------------------------------

describe('deployCloneAsSquad', () => {
  test('deploys a ready clone as squad', () => {
    const result = generator.deployCloneAsSquad(makeScore());
    expect(result.deployed).toBe(true);
    expect(result.squadPath).toBeTruthy();
    expect(result.registry.updated).toBe(true);
  });

  test('skips deployment if squad already exists', () => {
    generator.deployCloneAsSquad(makeScore());
    const result2 = generator.deployCloneAsSquad(makeScore());
    expect(result2.deployed).toBe(false);
    expect(result2.skipped).toBe(true);
  });

  test('force-deploys existing squad', () => {
    generator.deployCloneAsSquad(makeScore());
    const result2 = generator.deployCloneAsSquad(makeScore(), { force: true });
    expect(result2.deployed).toBe(true);
  });
});
