'use strict';

let router;

beforeEach(() => {
  jest.resetModules();
  router = require('../conclave-router');
});

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeClone(id, role) {
  return { id, name: id, role };
}

const SAMPLE_CLONES = [
  makeClone('alex_hormozi', 'Expert Clone - Business Scaling, Offers, Leads and Pricing'),
  makeClone('charlie_munger', 'Expert Clone - Mental Models, Governance and Rational Decision-Making'),
  makeClone('eli_goldratt', 'Expert Clone - Operations, Systems Constraints and Governance'),
  makeClone('kasim_aslam', 'Expert Clone - Google Ads Authority and Performance Max'),
  makeClone('tom_breeze', 'Expert Clone - YouTube Advertising and Video Funnel Architecture'),
  makeClone('chris_do', 'Expert Clone - Value Pricing, Premium Design and Visual Branding'),
  makeClone('depesh_mandalia', 'Expert Clone - Facebook Ads Scaling and Performance Marketing'),
  makeClone('marty_neumeier', 'Expert Clone - Brand Strategy and Radical Differentiation')
];

// ---------------------------------------------------------------------------
// scoreCloneForDomain
// ---------------------------------------------------------------------------

describe('scoreCloneForDomain', () => {
  test('scores alex_hormozi high for business domain', () => {
    const clone = makeClone('alex_hormozi', 'Business Scaling, Offers, Leads and Pricing');
    const score = router.scoreCloneForDomain(clone, 'business');
    expect(score).toBeGreaterThan(0);
  });

  test('scores eli_goldratt high for technical domain', () => {
    const clone = makeClone('eli_goldratt', 'Operations, Systems Constraints and Governance');
    const score = router.scoreCloneForDomain(clone, 'technical');
    expect(score).toBeGreaterThan(0);
  });

  test('scores tom_breeze high for marketing domain', () => {
    const clone = makeClone('tom_breeze', 'YouTube Advertising and Video Funnel Architecture');
    const score = router.scoreCloneForDomain(clone, 'marketing');
    expect(score).toBeGreaterThan(0);
  });

  test('scores chris_do high for ux domain', () => {
    const clone = makeClone('chris_do', 'Value Pricing, Premium Design and Visual Branding');
    const score = router.scoreCloneForDomain(clone, 'ux');
    expect(score).toBeGreaterThan(0);
  });

  test('returns 0 for unknown domain', () => {
    const clone = makeClone('clone', 'Business Scaling');
    expect(router.scoreCloneForDomain(clone, 'unknown')).toBe(0);
  });

  test('is case-insensitive', () => {
    const clone = makeClone('clone', 'BUSINESS SCALING');
    expect(router.scoreCloneForDomain(clone, 'business')).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// selectClones
// ---------------------------------------------------------------------------

describe('selectClones', () => {
  test('returns 2-5 clones for business domain', () => {
    const result = router.selectClones('business', { availableClones: SAMPLE_CLONES });
    expect(result.selected.length).toBeGreaterThanOrEqual(2);
    expect(result.selected.length).toBeLessThanOrEqual(5);
    expect(result.domain).toBe('business');
  });

  test('returns most relevant clones first', () => {
    const result = router.selectClones('marketing', { availableClones: SAMPLE_CLONES });
    // Marketing clones should be selected (kasim, tom_breeze, depesh)
    const ids = result.selected.map(c => c.id);
    const hasMarketing = ids.some(id => ['kasim_aslam', 'tom_breeze', 'depesh_mandalia'].includes(id));
    expect(hasMarketing).toBe(true);
  });

  test('fallbackUsed=false when enough domain clones found', () => {
    const result = router.selectClones('business', { availableClones: SAMPLE_CLONES });
    expect(result.fallbackUsed).toBe(false);
  });

  test('uses fallback when no domain clones found', () => {
    const noMatchClones = [
      makeClone('clone1', 'YouTube Video Design'),
      makeClone('clone2', 'YouTube Video Design'),
      makeClone('clone3', 'YouTube Video Design')
    ];
    // Domain 'technical' — no technical keywords in the roles above
    const result = router.selectClones('technical', { availableClones: noMatchClones });
    expect(result.fallbackUsed).toBe(true);
  });

  test('fallback returns max 3 clones', () => {
    const fewClones = SAMPLE_CLONES.map(c => ({ ...c, role: '' })); // strip all keywords
    const result = router.selectClones('technical', { availableClones: fewClones, max: 5 });
    expect(result.selected.length).toBeLessThanOrEqual(3);
  });

  test('respects max option', () => {
    const result = router.selectClones('business', { availableClones: SAMPLE_CLONES, max: 3 });
    expect(result.selected.length).toBeLessThanOrEqual(3);
  });

  test('returns empty when no clones available', () => {
    const result = router.selectClones('business', { availableClones: [] });
    expect(result.selected).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// shouldTriggerOnComplexity
// ---------------------------------------------------------------------------

describe('shouldTriggerOnComplexity', () => {
  test('triggers when score >= 16 (default)', () => {
    expect(router.shouldTriggerOnComplexity(16)).toBe(true);
    expect(router.shouldTriggerOnComplexity(20)).toBe(true);
  });

  test('does not trigger when score < 16', () => {
    expect(router.shouldTriggerOnComplexity(15)).toBe(false);
    expect(router.shouldTriggerOnComplexity(8)).toBe(false);
  });

  test('uses custom threshold from config', () => {
    const config = { autoTrigger: { onComplexityScore: 10 } };
    expect(router.shouldTriggerOnComplexity(10, config)).toBe(true);
    expect(router.shouldTriggerOnComplexity(9, config)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// shouldTriggerOnArchitectDecision
// ---------------------------------------------------------------------------

describe('shouldTriggerOnArchitectDecision', () => {
  test('triggers on HIGH', () => {
    expect(router.shouldTriggerOnArchitectDecision('HIGH')).toBe(true);
  });

  test('does not trigger on MEDIUM or LOW', () => {
    expect(router.shouldTriggerOnArchitectDecision('MEDIUM')).toBe(false);
    expect(router.shouldTriggerOnArchitectDecision('LOW')).toBe(false);
  });

  test('respects config disable', () => {
    const config = { autoTrigger: { onArchitectHighDecision: false } };
    expect(router.shouldTriggerOnArchitectDecision('HIGH', config)).toBe(false);
  });
});
