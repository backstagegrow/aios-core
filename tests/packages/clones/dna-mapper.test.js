/**
 * tests/packages/clones/dna-mapper.test.js
 *
 * Testes unitários para o módulo DNA Mapper
 */

'use strict';

const {
  mapDNA,
  mergeProfiles,
  normalizeLayer,
  extractHeuristicsFromModel,
} = require('../../../packages/clones/dna-mapper');

// ============================================================
// FIXTURES
// ============================================================

const SAMPLE_DOSSIER = {
  specialist: 'Alex Hormozi',
  philosophy: [
    'A oferta é o elemento mais importante do negócio',
    { title: 'Valor > Preço', description: 'O valor percebido deve superar o preço em 10x' },
  ],
  mentalModels: [
    'Quando um cliente hesita, sempre veja como feedback do mercado',
    'Enquadrar preço como investimento, não custo',
  ],
  heuristics: [
    'Se o cliente hesita, a oferta não está boa o suficiente',
    'Nunca ofereça desconto sem retirar algo da oferta',
  ],
  frameworks: [
    { title: '$100M Offers Framework', description: 'Processo de criação de oferta irresistível em 4 passos' },
    'Value Equation: Dream Outcome × Perceived Likelihood / Effort × Time',
  ],
  methodologies: [
    '1. Identifique o problema real 2. Remove o risco 3. Adicione garantias 4. Precio por valor',
  ],
  crossReferences: [
    { theme: 'Valor percebido', count: 3 },
    { theme: 'Remoção de risco', count: 2 },
  ],
};

// ============================================================
// TESTES: normalizeLayer
// ============================================================

describe('DNA Mapper — normalizeLayer', () => {
  test('deve normalizar strings simples', () => {
    const result = normalizeLayer(['item 1', 'item 2']);
    expect(result).toEqual(['item 1', 'item 2']);
  });

  test('deve normalizar objetos { title, description }', () => {
    const result = normalizeLayer([{ title: 'Título', description: 'Descrição' }]);
    expect(result[0]).toContain('Título');
    expect(result[0]).toContain('Descrição');
  });

  test('deve ignorar itens vazios', () => {
    const result = normalizeLayer(['', '  ', 'válido']);
    expect(result).toEqual(['válido']);
  });

  test('deve retornar array vazio se input não for array', () => {
    expect(normalizeLayer(null)).toEqual([]);
    expect(normalizeLayer(undefined)).toEqual([]);
    expect(normalizeLayer('string')).toEqual([]);
  });
});

// ============================================================
// TESTES: extractHeuristicsFromModel
// ============================================================

describe('DNA Mapper — extractHeuristicsFromModel', () => {
  test('deve extrair frases curtas com palavras-chave de decisão', () => {
    const items = [
      'Nunca ofereça desconto',
      'Análise profunda de mercado que envolve múltiplos fatores e considerações complexas e detalhadas que não são heurísticas',
      'Sempre veja hesitação como feedback',
    ];
    const result = extractHeuristicsFromModel(items);
    expect(result.some(h => h.includes('Nunca'))).toBe(true);
    expect(result.some(h => h.includes('sempre') || h.includes('Sempre'))).toBe(true);
  });
});

// ============================================================
// TESTES: mapDNA
// ============================================================

describe('DNA Mapper — mapDNA', () => {
  test('deve mapear todas as 5 camadas do DNA', () => {
    const profile = mapDNA(SAMPLE_DOSSIER);

    expect(profile.specialist).toBe('Alex Hormozi');
    expect(Array.isArray(profile.philosophy)).toBe(true);
    expect(Array.isArray(profile.mentalModel)).toBe(true);
    expect(Array.isArray(profile.heuristics)).toBe(true);
    expect(Array.isArray(profile.frameworks)).toBe(true);
    expect(Array.isArray(profile.methodology)).toBe(true);
  });

  test('deve incluir cross-references no modelo mental como padrões recorrentes', () => {
    const profile = mapDNA(SAMPLE_DOSSIER);
    const crossRefItems = profile.mentalModel.filter(m => m.startsWith('Padrão recorrente:'));
    expect(crossRefItems.length).toBe(2); // 2 cross references no fixture
  });

  test('deve incluir metadados com contagem de camadas', () => {
    const profile = mapDNA(SAMPLE_DOSSIER);
    expect(profile.meta).toHaveProperty('mappedAt');
    expect(profile.meta.layerCounts.philosophy).toBeGreaterThan(0);
    expect(profile.meta.totalInsights).toBeGreaterThan(0);
  });

  test('deve lançar erro para dossier inválido', () => {
    expect(() => mapDNA(null)).toThrow('[DNAMapper] dossier inválido');
    expect(() => mapDNA('string')).toThrow('[DNAMapper] dossier inválido');
  });

  test('deve funcionar com dossier mínimo (campos opcionais ausentes)', () => {
    const profile = mapDNA({ specialist: 'Minimalista' });
    expect(profile.specialist).toBe('Minimalista');
    expect(profile.philosophy).toEqual([]);
    expect(profile.frameworks).toEqual([]);
  });
});

// ============================================================
// TESTES: mergeProfiles
// ============================================================

describe('DNA Mapper — mergeProfiles', () => {
  test('deve combinar múltiplos perfis em um hibrído', () => {
    const profile1 = mapDNA(SAMPLE_DOSSIER);
    const profile2 = mapDNA({
      specialist: 'Peter Drucker',
      philosophy: ['A única definição válida de um negócio é criar clientes'],
      frameworks: ['Management by Objectives'],
      methodologies: ['Planeje, Execute, Meça, Ajuste'],
    });

    const hybrid = mergeProfiles([profile1, profile2], 'Hormozi + Drucker');

    expect(hybrid.specialist).toBe('Hormozi + Drucker');
    expect(hybrid.meta.sources).toContain('Alex Hormozi');
    expect(hybrid.meta.sources).toContain('Peter Drucker');

    // Cada item deve ter o prefixo do especialista de origem
    const hormozItems = hybrid.philosophy.filter(p => p.startsWith('[Alex Hormozi]'));
    expect(hormozItems.length).toBeGreaterThan(0);
  });

  test('deve lançar erro com array vazio', () => {
    expect(() => mergeProfiles([])).toThrow('[DNAMapper] mergeProfiles requer pelo menos 1 perfil');
  });

  test('deve funcionar com um único perfil', () => {
    const profile = mapDNA(SAMPLE_DOSSIER);
    const hybrid = mergeProfiles([profile]);
    expect(hybrid.meta.sources).toEqual(['Alex Hormozi']);
  });
});
