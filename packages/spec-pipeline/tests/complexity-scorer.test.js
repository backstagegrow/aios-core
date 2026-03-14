'use strict';

/**
 * Tests for packages/spec-pipeline/complexity-scorer.js
 * Story: AEV-1 — Spec Pipeline Reativação
 */

const {
  scoreComplexity,
  classifyScore,
  getDimensionGuide,
  THRESHOLDS,
  COMPLEXITY_CLASSES,
} = require('../complexity-scorer');

describe('complexity-scorer', () => {
  describe('classifyScore()', () => {
    it('classifies score <= 8 as SIMPLE', () => {
      expect(classifyScore(5)).toBe(COMPLEXITY_CLASSES.SIMPLE);
      expect(classifyScore(8)).toBe(COMPLEXITY_CLASSES.SIMPLE);
    });

    it('classifies score 9-15 as STANDARD', () => {
      expect(classifyScore(9)).toBe(COMPLEXITY_CLASSES.STANDARD);
      expect(classifyScore(12)).toBe(COMPLEXITY_CLASSES.STANDARD);
      expect(classifyScore(15)).toBe(COMPLEXITY_CLASSES.STANDARD);
    });

    it('classifies score >= 16 as COMPLEX', () => {
      expect(classifyScore(16)).toBe(COMPLEXITY_CLASSES.COMPLEX);
      expect(classifyScore(25)).toBe(COMPLEXITY_CLASSES.COMPLEX);
    });
  });

  describe('scoreComplexity()', () => {
    it('calculates correct total score', () => {
      const result = scoreComplexity({ scope: 2, integration: 2, infrastructure: 1, knowledge: 2, risk: 1 });
      expect(result.totalScore).toBe(8);
      expect(result.complexityClass).toBe(COMPLEXITY_CLASSES.SIMPLE);
    });

    it('returns SIMPLE for low complexity (score <= 8)', () => {
      const result = scoreComplexity({ scope: 1, integration: 1, infrastructure: 1, knowledge: 1, risk: 1 });
      expect(result.complexityClass).toBe(COMPLEXITY_CLASSES.SIMPLE);
      expect(result.requiresArchitectReview).toBe(false);
      expect(result.totalScore).toBe(5);
    });

    it('returns STANDARD for medium complexity (score 9-15)', () => {
      const result = scoreComplexity({ scope: 3, integration: 2, infrastructure: 2, knowledge: 3, risk: 2 });
      expect(result.totalScore).toBe(12);
      expect(result.complexityClass).toBe(COMPLEXITY_CLASSES.STANDARD);
      expect(result.requiresArchitectReview).toBe(false);
    });

    it('returns COMPLEX for high complexity (score >= 16)', () => {
      const result = scoreComplexity({ scope: 4, integration: 4, infrastructure: 3, knowledge: 3, risk: 3 });
      expect(result.totalScore).toBe(17);
      expect(result.complexityClass).toBe(COMPLEXITY_CLASSES.COMPLEX);
      expect(result.requiresArchitectReview).toBe(true);
    });

    it('reaches max score of 25 with all dimensions at 5', () => {
      const result = scoreComplexity({ scope: 5, integration: 5, infrastructure: 5, knowledge: 5, risk: 5 });
      expect(result.totalScore).toBe(25);
      expect(result.maxScore).toBe(25);
      expect(result.complexityClass).toBe(COMPLEXITY_CLASSES.COMPLEX);
    });

    it('uses default value of 1 for missing dimensions', () => {
      const result = scoreComplexity({ scope: 3 });
      expect(result.totalScore).toBe(7); // 3 + 1 + 1 + 1 + 1
      expect(result.complexityClass).toBe(COMPLEXITY_CLASSES.SIMPLE);
    });

    it('includes thresholds in result', () => {
      const result = scoreComplexity({ scope: 2, integration: 2, infrastructure: 1, knowledge: 2, risk: 1 });
      expect(result.thresholds).toEqual(THRESHOLDS);
    });

    it('includes assessedAt ISO timestamp', () => {
      const result = scoreComplexity({ scope: 1, integration: 1, infrastructure: 1, knowledge: 1, risk: 1 });
      expect(result.assessedAt).toBeTruthy();
      expect(new Date(result.assessedAt).toISOString()).toBe(result.assessedAt);
    });

    it('preserves dimension values in result', () => {
      const dims = { scope: 3, integration: 2, infrastructure: 1, knowledge: 4, risk: 2 };
      const result = scoreComplexity(dims);
      expect(result.dimensions).toEqual(dims);
    });

    it('throws for dimension value out of range (< 1)', () => {
      expect(() => scoreComplexity({ scope: 0, integration: 1, infrastructure: 1, knowledge: 1, risk: 1 }))
        .toThrow(/scope/);
    });

    it('throws for dimension value out of range (> 5)', () => {
      expect(() => scoreComplexity({ scope: 6, integration: 1, infrastructure: 1, knowledge: 1, risk: 1 }))
        .toThrow(/scope/);
    });

    it('throws for non-integer dimension value', () => {
      expect(() => scoreComplexity({ scope: 2.5, integration: 1, infrastructure: 1, knowledge: 1, risk: 1 }))
        .toThrow(/scope/);
    });

    it('boundary: score 8 is SIMPLE (not STANDARD)', () => {
      const result = scoreComplexity({ scope: 2, integration: 2, infrastructure: 1, knowledge: 2, risk: 1 });
      expect(result.totalScore).toBe(8);
      expect(result.complexityClass).toBe(COMPLEXITY_CLASSES.SIMPLE);
    });

    it('boundary: score 9 is STANDARD (not SIMPLE)', () => {
      const result = scoreComplexity({ scope: 2, integration: 2, infrastructure: 2, knowledge: 2, risk: 1 });
      expect(result.totalScore).toBe(9);
      expect(result.complexityClass).toBe(COMPLEXITY_CLASSES.STANDARD);
    });

    it('boundary: score 15 is STANDARD (not COMPLEX)', () => {
      const result = scoreComplexity({ scope: 3, integration: 3, infrastructure: 3, knowledge: 3, risk: 3 });
      expect(result.totalScore).toBe(15);
      expect(result.complexityClass).toBe(COMPLEXITY_CLASSES.STANDARD);
    });

    it('boundary: score 16 is COMPLEX (not STANDARD)', () => {
      const result = scoreComplexity({ scope: 4, integration: 3, infrastructure: 3, knowledge: 3, risk: 3 });
      expect(result.totalScore).toBe(16);
      expect(result.complexityClass).toBe(COMPLEXITY_CLASSES.COMPLEX);
    });
  });

  describe('getDimensionGuide()', () => {
    it('returns guide for all 5 dimensions', () => {
      const guide = getDimensionGuide();
      expect(guide).toHaveProperty('scope');
      expect(guide).toHaveProperty('integration');
      expect(guide).toHaveProperty('infrastructure');
      expect(guide).toHaveProperty('knowledge');
      expect(guide).toHaveProperty('risk');
    });

    it('each dimension has label, description, and 5 levels', () => {
      const guide = getDimensionGuide();
      for (const dim of Object.values(guide)) {
        expect(dim).toHaveProperty('label');
        expect(dim).toHaveProperty('description');
        expect(dim).toHaveProperty('levels');
        expect(Object.keys(dim.levels)).toHaveLength(5);
      }
    });
  });
});
