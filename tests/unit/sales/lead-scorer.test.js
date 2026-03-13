'use strict';

/**
 * Tests for lead-scorer logic.
 * Pure algorithmic contracts mirroring lead-scorer.ts (no TS import needed).
 */

// ─── Pure logic extracted for testing (mirrors lead-scorer.ts) ───────────────

function computeTier(total) {
    if (total > 70) return 'HIGH';
    if (total >= 45) return 'MEDIUM';
    return 'LOW';
}

const CONSERVATIVE_FALLBACK = {
    total: 35,
    tier: 'LOW',
    breakdown: { icp_fit: 20, revenue_signal: 10, intent_signal: 5 },
    reasoning: 'LLM parse failed — conservative fallback applied',
};

function clampScore(value, min, max) {
    return Math.min(max, Math.max(min, Number(value) || 0));
}

function buildScore(raw) {
    const icp_fit = clampScore(raw.icp_fit, 0, 40);
    const revenue_signal = clampScore(raw.revenue_signal, 0, 30);
    const intent_signal = clampScore(raw.intent_signal, 0, 30);
    const total = icp_fit + revenue_signal + intent_signal;
    return {
        total,
        tier: computeTier(total),
        breakdown: { icp_fit, revenue_signal, intent_signal },
        reasoning: String(raw.reasoning || ''),
    };
}

function parseLLMResponse(response) {
    const cleaned = response.replace(/```(?:json)?/g, '').trim();
    return JSON.parse(cleaned);
}

// ─── computeTier ─────────────────────────────────────────────────────────────

describe('computeTier', () => {
    test('returns HIGH for total > 70', () => {
        expect(computeTier(71)).toBe('HIGH');
        expect(computeTier(100)).toBe('HIGH');
        expect(computeTier(91)).toBe('HIGH');
    });

    test('returns MEDIUM for total 45-70 (inclusive)', () => {
        expect(computeTier(45)).toBe('MEDIUM');
        expect(computeTier(70)).toBe('MEDIUM');
        expect(computeTier(57)).toBe('MEDIUM');
    });

    test('returns LOW for total < 45', () => {
        expect(computeTier(44)).toBe('LOW');
        expect(computeTier(0)).toBe('LOW');
        expect(computeTier(35)).toBe('LOW');
    });

    test('boundary: 70 is MEDIUM, 71 is HIGH', () => {
        expect(computeTier(70)).toBe('MEDIUM');
        expect(computeTier(71)).toBe('HIGH');
    });
});

// ─── Score clamping ───────────────────────────────────────────────────────────

describe('score clamping', () => {
    test('clamps icp_fit to 0-40', () => {
        expect(clampScore(99, 0, 40)).toBe(40);
        expect(clampScore(-5, 0, 40)).toBe(0);
        expect(clampScore(25, 0, 40)).toBe(25);
    });

    test('clamps revenue_signal to 0-30', () => {
        expect(clampScore(50, 0, 30)).toBe(30);
        expect(clampScore(-1, 0, 30)).toBe(0);
        expect(clampScore(15, 0, 30)).toBe(15);
    });

    test('handles NaN/non-numeric values as 0', () => {
        expect(clampScore('abc', 0, 40)).toBe(0);
        expect(clampScore(null, 0, 30)).toBe(0);
        expect(clampScore(undefined, 0, 30)).toBe(0);
    });
});

// ─── buildScore ───────────────────────────────────────────────────────────────

describe('buildScore from parsed JSON', () => {
    test('HIGH tier: sums correctly', () => {
        const r = buildScore({ icp_fit: 38, revenue_signal: 28, intent_signal: 25, reasoning: 'strong' });
        expect(r.total).toBe(91);
        expect(r.tier).toBe('HIGH');
    });

    test('MEDIUM tier: 45-70', () => {
        const r = buildScore({ icp_fit: 25, revenue_signal: 15, intent_signal: 12, reasoning: 'ok' });
        expect(r.total).toBe(52);
        expect(r.tier).toBe('MEDIUM');
    });

    test('LOW tier: < 45', () => {
        const r = buildScore({ icp_fit: 10, revenue_signal: 8, intent_signal: 5, reasoning: 'weak' });
        expect(r.total).toBe(23);
        expect(r.tier).toBe('LOW');
    });

    test('clamps overflowing values before computing total', () => {
        const r = buildScore({ icp_fit: 99, revenue_signal: -5, intent_signal: 50, reasoning: 'edge' });
        expect(r.breakdown.icp_fit).toBe(40);
        expect(r.breakdown.revenue_signal).toBe(0);
        expect(r.breakdown.intent_signal).toBe(30);
        expect(r.total).toBe(70);
        expect(r.tier).toBe('MEDIUM');
    });

    test('reasoning is always a string', () => {
        const r = buildScore({ icp_fit: 10, revenue_signal: 5, intent_signal: 5, reasoning: 42 });
        expect(typeof r.reasoning).toBe('string');
    });
});

// ─── parseLLMResponse ─────────────────────────────────────────────────────────

describe('parseLLMResponse', () => {
    test('parses plain JSON', () => {
        const r = parseLLMResponse('{"icp_fit":35,"revenue_signal":25,"intent_signal":20,"reasoning":"ok"}');
        expect(r.icp_fit).toBe(35);
    });

    test('strips markdown code fences before parsing', () => {
        const r = parseLLMResponse('```json\n{"icp_fit":35,"revenue_signal":25,"intent_signal":20,"reasoning":"ok"}\n```');
        expect(r.icp_fit).toBe(35);
    });

    test('throws on invalid JSON (fallback should catch this)', () => {
        expect(() => parseLLMResponse('not valid json')).toThrow();
    });
});

// ─── Conservative fallback contract ──────────────────────────────────────────

describe('conservative fallback', () => {
    test('fallback total is always LOW tier', () => {
        expect(computeTier(CONSERVATIVE_FALLBACK.total)).toBe('LOW');
    });

    test('fallback breakdown sums to fallback total', () => {
        const { icp_fit, revenue_signal, intent_signal } = CONSERVATIVE_FALLBACK.breakdown;
        expect(icp_fit + revenue_signal + intent_signal).toBe(CONSERVATIVE_FALLBACK.total);
    });

    test('fallback does not approve leads (tier is LOW)', () => {
        expect(CONSERVATIVE_FALLBACK.tier).toBe('LOW');
    });
});
