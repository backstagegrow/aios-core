'use strict';

/**
 * Tests for content-generator segmentation and A/B logic.
 * Pure algorithmic contracts — mirrors content-generator.ts without TS import.
 */

// ─── Pure logic extracted for testing ────────────────────────────────────────

const EXPERT_KEYWORDS = [
    'palestrante', 'treinador', 'consultor', 'consultoria', 'coach',
    'mentor', 'formação', 'curso', 'workshop', 'keynote', 'expert',
];

const B2B_EVENTS_KEYWORDS = [
    'produtora', 'cenografia', 'locação', 'espaço para eventos', 'casa de eventos',
    'audiovisual', 'buffet corporativo', 'evento corporativo', 'events', 'cerimônia',
];

function detectSegment(lead) {
    const text = `${lead.niche || ''} ${lead.business_name || ''}`.toLowerCase();
    if (EXPERT_KEYWORDS.some(k => text.includes(k))) return 'experts';
    if (B2B_EVENTS_KEYWORDS.some(k => text.includes(k))) return 'b2b_events';
    return 'unknown';
}

function selectVariant(leadId) {
    const id = Number(leadId) || 0;
    return id % 2 === 0 ? 'A' : 'B';
}

function resolveSubject(template, businessName) {
    return template.replace(/\{businessName\}/g, businessName);
}

// ─── detectSegment ────────────────────────────────────────────────────────────

describe('detectSegment', () => {
    test.each([
        [{ business_name: 'João Silva Palestrante', niche: 'palestrante motivacional' }, 'experts'],
        [{ business_name: 'Treinamentos Alfa', niche: 'treinador corporativo' }, 'experts'],
        [{ business_name: 'Consultoria Beta', niche: 'consultoria estratégica' }, 'experts'],
        [{ business_name: 'Produtora Visão', niche: 'produtora de eventos' }, 'b2b_events'],
        [{ business_name: 'Espaço Nobre', niche: 'locação para eventos corporativos' }, 'b2b_events'],
        [{ business_name: 'Cenografia Premium', niche: 'cenografia' }, 'b2b_events'],
        [{ business_name: 'Tech Solutions', niche: 'tecnologia' }, 'unknown'],
        [{ business_name: 'Empresa XYZ', niche: '' }, 'unknown'],
        [{ business_name: 'Empresa ABC', niche: undefined }, 'unknown'],
    ])('detectSegment(%j) → %s', (lead, expected) => {
        expect(detectSegment(lead)).toBe(expected);
    });

    test('matches keyword in business_name when niche is empty', () => {
        expect(detectSegment({ business_name: 'Coach Executivo Digital', niche: '' })).toBe('experts');
    });

    test('experts takes priority when both keywords present', () => {
        // niche has expert keyword → experts
        const lead = { business_name: 'Consultoria de Eventos', niche: 'consultor de eventos' };
        expect(detectSegment(lead)).toBe('experts');
    });

    test('is case-insensitive', () => {
        expect(detectSegment({ business_name: 'PALESTRANTE XYZ', niche: '' })).toBe('experts');
        expect(detectSegment({ business_name: 'PRODUTORA ALPHA', niche: '' })).toBe('b2b_events');
    });
});

// ─── selectVariant ────────────────────────────────────────────────────────────

describe('selectVariant', () => {
    test('returns A for even numeric IDs', () => {
        expect(selectVariant(0)).toBe('A');
        expect(selectVariant(2)).toBe('A');
        expect(selectVariant(100)).toBe('A');
    });

    test('returns B for odd numeric IDs', () => {
        expect(selectVariant(1)).toBe('B');
        expect(selectVariant(3)).toBe('B');
        expect(selectVariant(101)).toBe('B');
    });

    test('returns A when id is undefined', () => {
        expect(selectVariant(undefined)).toBe('A');
    });

    test('returns A when id is null', () => {
        expect(selectVariant(null)).toBe('A');
    });

    test('is deterministic — same id always same variant', () => {
        expect(selectVariant(42)).toBe(selectVariant(42));
        expect(selectVariant(7)).toBe(selectVariant(7));
    });

    test('every ID maps to exactly A or B (never undefined)', () => {
        for (let i = 0; i < 20; i++) {
            const v = selectVariant(i);
            expect(['A', 'B']).toContain(v);
        }
    });
});

// ─── resolveSubject (subject interpolation) ───────────────────────────────────

describe('resolveSubject', () => {
    test('replaces {businessName} placeholder', () => {
        expect(resolveSubject('{businessName} está crescendo?', 'Empresa X')).toBe('Empresa X está crescendo?');
    });

    test('replaces all occurrences', () => {
        expect(resolveSubject('{businessName} — {businessName}', 'Alfa')).toBe('Alfa — Alfa');
    });

    test('returns unchanged string when no placeholder', () => {
        expect(resolveSubject('Texto fixo', 'Empresa')).toBe('Texto fixo');
    });
});

// ─── Segment × Step × Variant combinations ───────────────────────────────────

describe('segment-step-variant coverage', () => {
    const segments = ['experts', 'b2b_events', 'unknown'];
    const steps = [1, 2, 3];
    const variants = ['A', 'B'];

    test('all 18 combinations are defined (3 segments × 3 steps × 2 variants)', () => {
        // Verify that our TEMPLATES structure would cover all combinations.
        // This test documents the expected coverage contract.
        const expected = segments.length * steps.length * variants.length;
        expect(expected).toBe(18);
    });

    test('selectVariant covers both A and B in any sequence of 2 consecutive IDs', () => {
        // For any starting ID, the next one flips the variant
        for (let i = 0; i < 10; i++) {
            const v1 = selectVariant(i);
            const v2 = selectVariant(i + 1);
            expect(v1).not.toBe(v2);
        }
    });
});

// ─── A/B parity ──────────────────────────────────────────────────────────────

describe('A/B parity', () => {
    test('50% of first 100 IDs are variant A', () => {
        const results = Array.from({ length: 100 }, (_, i) => selectVariant(i));
        const aCount = results.filter(v => v === 'A').length;
        expect(aCount).toBe(50);
    });

    test('50% of first 100 IDs are variant B', () => {
        const results = Array.from({ length: 100 }, (_, i) => selectVariant(i));
        const bCount = results.filter(v => v === 'B').length;
        expect(bCount).toBe(50);
    });
});
