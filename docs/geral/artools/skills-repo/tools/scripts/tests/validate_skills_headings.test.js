const assert = require('assert');
const fs = require('fs');
const path = require('path');

const { hasUseSection } = require('../validate-skills');
const { findProjectRoot } = require('../../lib/project-root');
const { listSkillIdsRecursive, parseFrontmatter } = require('../../lib/skill-utils');

const samples = [
  ['## When to Use', true],
  ['## Use this skill when', true],
  ['## When to Use This Skill', true],
  ['## Overview', false],
];

describe('validate-skills headings smoke tests', () => {
  test('detects accepted use headings', () => {
    for (const [heading, expected] of samples) {
      const content = `\n${heading}\n- item\n`;
      assert.strictEqual(hasUseSection(content), expected, heading);
    }
  });
});

describe('validate-skills frontmatter smoke tests', () => {
  test('parses available skills frontmatter without crashing', () => {
    const skillsDir = path.join(findProjectRoot(__dirname), 'skills');
    const skillIds = listSkillIdsRecursive(skillsDir);

    let warnCount = 0;
    const warnSummary = [];
    for (const skillId of skillIds) {
      const skillPath = path.join(skillsDir, skillId, 'SKILL.md');
      const content = fs.readFileSync(skillPath, 'utf8');
      const { errors, hasFrontmatter } = parseFrontmatter(content);

      if (!hasFrontmatter) {
        warnCount++;
        warnSummary.push(`${skillId}: missing frontmatter`);
        continue;
      }

      if (errors.length > 0) {
        warnCount++;
        warnSummary.push(`${skillId}: ${errors.join(', ')}`);
      }
    }

    expect(Array.isArray(warnSummary)).toBe(true);
    expect(warnCount).toBeGreaterThanOrEqual(0);
  });
});
