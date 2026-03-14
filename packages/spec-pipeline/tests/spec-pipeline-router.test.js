'use strict';

/**
 * Tests for packages/spec-pipeline/spec-pipeline-router.js
 * Story: AEV-1 — Spec Pipeline Reativação
 */

const {
  routePipeline,
  formatRouteForDisplay,
  ALL_PHASES,
} = require('../spec-pipeline-router');

const { COMPLEXITY_CLASSES } = require('../complexity-scorer');

const makeComplexityResult = (cls, score = 10) => ({
  complexityClass: cls,
  totalScore: score,
  requiresArchitectReview: cls === COMPLEXITY_CLASSES.COMPLEX,
});

describe('spec-pipeline-router', () => {
  describe('ALL_PHASES', () => {
    it('defines exactly 6 phases', () => {
      expect(ALL_PHASES).toHaveLength(6);
    });

    it('has phases: gather, assess, research, write-spec, critique, plan', () => {
      const ids = ALL_PHASES.map(p => p.id);
      expect(ids).toContain('gather');
      expect(ids).toContain('assess');
      expect(ids).toContain('research');
      expect(ids).toContain('write-spec');
      expect(ids).toContain('critique');
      expect(ids).toContain('plan');
    });

    it('gather, write-spec, critique are required=true', () => {
      const required = ALL_PHASES.filter(p => p.required).map(p => p.id);
      expect(required).toContain('gather');
      expect(required).toContain('write-spec');
      expect(required).toContain('critique');
    });

    it('assess, research, plan are required=false', () => {
      const optional = ALL_PHASES.filter(p => !p.required).map(p => p.id);
      expect(optional).toContain('assess');
      expect(optional).toContain('research');
      expect(optional).toContain('plan');
    });
  });

  describe('routePipeline() — SIMPLE', () => {
    it('returns 3 phases for SIMPLE complexity', () => {
      const route = routePipeline(makeComplexityResult(COMPLEXITY_CLASSES.SIMPLE, 7));
      expect(route.phasesCount).toBe(3);
    });

    it('SIMPLE includes gather, write-spec, critique', () => {
      const route = routePipeline(makeComplexityResult(COMPLEXITY_CLASSES.SIMPLE, 7));
      const ids = route.phases.map(p => p.id);
      expect(ids).toContain('gather');
      expect(ids).toContain('write-spec');
      expect(ids).toContain('critique');
    });

    it('SIMPLE excludes assess, research, plan', () => {
      const route = routePipeline(makeComplexityResult(COMPLEXITY_CLASSES.SIMPLE, 7));
      const ids = route.phases.map(p => p.id);
      expect(ids).not.toContain('assess');
      expect(ids).not.toContain('research');
      expect(ids).not.toContain('plan');
    });

    it('SIMPLE has skip reasons for excluded phases', () => {
      const route = routePipeline(makeComplexityResult(COMPLEXITY_CLASSES.SIMPLE, 7));
      expect(route.skipReasons).toHaveProperty('assess');
      expect(route.skipReasons).toHaveProperty('research');
      expect(route.skipReasons).toHaveProperty('plan');
    });

    it('SIMPLE does not require architect review', () => {
      const route = routePipeline(makeComplexityResult(COMPLEXITY_CLASSES.SIMPLE, 7));
      expect(route.requiresArchitectReview).toBe(false);
    });
  });

  describe('routePipeline() — STANDARD', () => {
    it('returns 6 phases for STANDARD complexity', () => {
      const route = routePipeline(makeComplexityResult(COMPLEXITY_CLASSES.STANDARD, 12));
      expect(route.phasesCount).toBe(6);
    });

    it('STANDARD includes all phases', () => {
      const route = routePipeline(makeComplexityResult(COMPLEXITY_CLASSES.STANDARD, 12));
      const ids = route.phases.map(p => p.id);
      expect(ids).toContain('gather');
      expect(ids).toContain('assess');
      expect(ids).toContain('research');
      expect(ids).toContain('write-spec');
      expect(ids).toContain('critique');
      expect(ids).toContain('plan');
    });

    it('STANDARD has no skip reasons', () => {
      const route = routePipeline(makeComplexityResult(COMPLEXITY_CLASSES.STANDARD, 12));
      expect(Object.keys(route.skipReasons)).toHaveLength(0);
    });

    it('STANDARD does not require architect review', () => {
      const route = routePipeline(makeComplexityResult(COMPLEXITY_CLASSES.STANDARD, 12));
      expect(route.requiresArchitectReview).toBe(false);
    });
  });

  describe('routePipeline() — COMPLEX', () => {
    it('returns 6 phases for COMPLEX complexity', () => {
      const route = routePipeline(makeComplexityResult(COMPLEXITY_CLASSES.COMPLEX, 18));
      expect(route.phasesCount).toBe(6);
    });

    it('COMPLEX requires architect review', () => {
      const route = routePipeline(makeComplexityResult(COMPLEXITY_CLASSES.COMPLEX, 18));
      expect(route.requiresArchitectReview).toBe(true);
    });

    it('COMPLEX includes all phases', () => {
      const route = routePipeline(makeComplexityResult(COMPLEXITY_CLASSES.COMPLEX, 18));
      const ids = route.phases.map(p => p.id);
      expect(ids).toHaveLength(6);
    });
  });

  describe('routePipeline() — validation', () => {
    it('throws for invalid complexityClass', () => {
      expect(() => routePipeline({ complexityClass: 'EXTREME', totalScore: 20 }))
        .toThrow(/complexityClass inválida/);
    });

    it('includes routedAt timestamp', () => {
      const route = routePipeline(makeComplexityResult(COMPLEXITY_CLASSES.SIMPLE, 5));
      expect(route.routedAt).toBeTruthy();
      expect(new Date(route.routedAt).toISOString()).toBe(route.routedAt);
    });

    it('includes totalScore in result', () => {
      const route = routePipeline(makeComplexityResult(COMPLEXITY_CLASSES.STANDARD, 12));
      expect(route.totalScore).toBe(12);
    });
  });

  describe('formatRouteForDisplay()', () => {
    it('returns a non-empty string', () => {
      const route = routePipeline(makeComplexityResult(COMPLEXITY_CLASSES.SIMPLE, 7));
      const display = formatRouteForDisplay(route);
      expect(typeof display).toBe('string');
      expect(display.length).toBeGreaterThan(0);
    });

    it('includes complexity class in output', () => {
      const route = routePipeline(makeComplexityResult(COMPLEXITY_CLASSES.STANDARD, 12));
      const display = formatRouteForDisplay(route);
      expect(display).toContain('STANDARD');
    });

    it('shows architect review warning for COMPLEX', () => {
      const route = routePipeline(makeComplexityResult(COMPLEXITY_CLASSES.COMPLEX, 18));
      const display = formatRouteForDisplay(route);
      expect(display).toContain('architect');
    });

    it('shows skip reasons for SIMPLE', () => {
      const route = routePipeline(makeComplexityResult(COMPLEXITY_CLASSES.SIMPLE, 7));
      const display = formatRouteForDisplay(route);
      expect(display).toContain('assess');
    });
  });
});
