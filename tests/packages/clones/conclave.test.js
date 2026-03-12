/**
 * tests/packages/clones/conclave.test.js
 *
 * Testes unitários para o módulo Conclave
 */

'use strict';

const {
  runConclave,
  generateClonePerspective,
  synthesizePerspectives,
  generateConclaveRecommendation,
} = require('../../../packages/clones/conclave');

// ============================================================
// FIXTURES
// ============================================================

const DNA_HORMOZI = {
  specialist: 'Alex Hormozi',
  philosophy: ['A oferta é o princípio mais importante do negócio'],
  mentalModel: ['Enquadrar preço como investimento, não custo'],
  heuristics: ['Nunca ofereça desconto sem retirar algo da oferta'],
  frameworks: ['$100M Offers Framework', 'Value Equation'],
  methodology: ['1. Problema real 2. Remove risco 3. Garantias 4. Precio por valor'],
};

const DNA_DRUCKER = {
  specialist: 'Peter Drucker',
  philosophy: ['A única definição válida de um negócio é criar clientes'],
  mentalModel: ['Medir o que importa — métricas movem comportamentos'],
  heuristics: ['Qual é o nosso negócio? Quem é o nosso cliente? O que o cliente considera valioso?'],
  frameworks: ['Management by Objectives (MbO)', 'Effective Executive Framework'],
  methodology: ['Planeje → Execute → Meça → Ajuste'],
};

const CLONE_HORMOZI = {
  name: 'Alex Hormozi Clone',
  dnaProfile: DNA_HORMOZI,
};

const CLONE_DRUCKER = {
  name: 'Peter Drucker Clone',
  dnaProfile: DNA_DRUCKER,
};

const CLONE_NO_DNA = {
  name: 'Clone Sem DNA',
  // dnaProfile is intentionally absent
};

// ============================================================
// TESTES: generateClonePerspective
// ============================================================

describe('Conclave — generateClonePerspective', () => {
  test('deve retornar uma perspectiva com todos os campos obrigatórios', () => {
    const p = generateClonePerspective(CLONE_HORMOZI, 'Como dobrar receita em 6 meses?');

    expect(p).toHaveProperty('cloneName', 'Alex Hormozi Clone');
    expect(p).toHaveProperty('specialist', 'Alex Hormozi');
    expect(p).toHaveProperty('perspective');
    expect(p).toHaveProperty('recommendations');
    expect(p).toHaveProperty('frameworks');
    expect(p).toHaveProperty('concerns');
    expect(typeof p.perspective).toBe('string');
    expect(Array.isArray(p.recommendations)).toBe(true);
    expect(Array.isArray(p.frameworks)).toBe(true);
    expect(Array.isArray(p.concerns)).toBe(true);
  });

  test('deve incluir concerns Anti-Pleasing quando protocolo ativo', () => {
    const p = generateClonePerspective(
      CLONE_HORMOZI,
      'Qual a melhor estratégia?',
      { antiPleasing: true },
    );
    const hasAntiPleasing = p.concerns.some(c => c.includes('[Anti-Pleasing]'));
    expect(hasAntiPleasing).toBe(true);
  });

  test('deve incluir concerns Anti-Biasing quando protocolo ativo', () => {
    const p = generateClonePerspective(
      CLONE_DRUCKER,
      'Como melhorar a gestão?',
      { antiBiasing: true },
    );
    const hasAntiBiasing = p.concerns.some(c => c.includes('[Anti-Biasing]'));
    expect(hasAntiBiasing).toBe(true);
  });

  test('deve incluir concerns TBC quando protocolo ativo', () => {
    const p = generateClonePerspective(
      CLONE_HORMOZI,
      'Devemos mudar o modelo de preços?',
      { totalBusinessContext: true },
    );
    const hasTBC = p.concerns.some(c => c.includes('[TBC]'));
    expect(hasTBC).toBe(true);
  });

  test('deve ter frameworks extraídos do DNA', () => {
    const p = generateClonePerspective(CLONE_HORMOZI, 'Oferta de serviço premium');
    expect(p.frameworks.length).toBeGreaterThan(0);
    expect(p.frameworks.some(f => f.includes('$100M') || f.includes('Value Equation'))).toBe(true);
  });
});

// ============================================================
// TESTES: synthesizePerspectives
// ============================================================

describe('Conclave — synthesizePerspectives', () => {
  test('deve retornar dossier híbrido com topFrameworks e topConcerns', () => {
    const perspectives = [
      generateClonePerspective(CLONE_HORMOZI, 'Desafio X', { antiBiasing: true }),
      generateClonePerspective(CLONE_DRUCKER, 'Desafio X', { antiBiasing: true }),
    ];
    const hybrid = synthesizePerspectives(perspectives, 'Desafio X');

    expect(hybrid).toHaveProperty('challenge', 'Desafio X');
    expect(Array.isArray(hybrid.topFrameworks)).toBe(true);
    expect(Array.isArray(hybrid.topConcerns)).toBe(true);
    expect(Array.isArray(hybrid.consensusPoints)).toBe(true);
    expect(Array.isArray(hybrid.divergencePoints)).toBe(true);
    expect(hybrid.divergencePoints.length).toBe(2);
  });

  test('deve identificar frameworks mencionados por múltiplos clones', () => {
    // Se ambos mencionam os mesmos frameworks, count deve ser > 1
    const sameFrameworks = ['Framework Compartilhado'];
    const perspectives = [
      {
        cloneName: 'Clone A',
        specialist: 'A',
        perspective: 'p1',
        recommendations: ['rec1'],
        frameworks: sameFrameworks,
        concerns: [],
      },
      {
        cloneName: 'Clone B',
        specialist: 'B',
        perspective: 'p2',
        recommendations: ['rec1'], // Mesma recomendação → consenso
        frameworks: sameFrameworks,
        concerns: [],
      },
    ];
    const hybrid = synthesizePerspectives(perspectives, 'Teste');

    const sharedFw = hybrid.topFrameworks.find(f => f.framework.includes('Framework Compartilhado'));
    expect(sharedFw).toBeDefined();
    expect(sharedFw.mentions).toBe(2);
    expect(hybrid.consensusPoints.length).toBeGreaterThan(0);
  });
});

// ============================================================
// TESTES: runConclave
// ============================================================

describe('Conclave — runConclave', () => {
  test('deve executar sessão com um único clone', async () => {
    const decision = await runConclave(
      'Como criar uma oferta irresistível?',
      [CLONE_HORMOZI],
    );

    expect(decision).toHaveProperty('challenge', 'Como criar uma oferta irresistível?');
    expect(Array.isArray(decision.perspectives)).toBe(true);
    expect(decision.perspectives.length).toBe(1);
    expect(decision).toHaveProperty('hybridDossier');
    expect(decision).toHaveProperty('recommendation');
    expect(decision).toHaveProperty('meta');
    expect(decision.meta.clonesConsulted).toBe(1);
  });

  test('deve executar sessão com múltiplos clones', async () => {
    const decision = await runConclave(
      'Como escalar de $1M para $10M em 12 meses?',
      [CLONE_HORMOZI, CLONE_DRUCKER],
    );

    expect(decision.perspectives.length).toBe(2);
    expect(decision.meta.clonesConsulted).toBe(2);
    expect(typeof decision.recommendation).toBe('string');
    expect(decision.recommendation.length).toBeGreaterThan(0);
  });

  test('deve funcionar com clone sem DNA (não causa crash)', async () => {
    const decision = await runConclave(
      'Questão estratégica qualquer',
      [CLONE_NO_DNA],
    );

    expect(decision.perspectives.length).toBe(1);
    expect(decision.perspectives[0].specialist).toBe('Desconhecido');
  });

  test('deve ativar todos os protocolos corretamente', async () => {
    const decision = await runConclave(
      'Deve-se pivot ou perseverar?',
      [CLONE_HORMOZI],
      { antiPleasing: true, antiBiasing: true, totalBusinessContext: true },
    );

    expect(decision.meta.protocols.antiPleasing).toBe(true);
    expect(decision.meta.protocols.antiBiasing).toBe(true);
    expect(decision.meta.protocols.totalBusinessContext).toBe(true);

    const allConcerns = decision.perspectives.flatMap(p => p.concerns);
    expect(allConcerns.some(c => c.includes('[Anti-Pleasing]'))).toBe(true);
    expect(allConcerns.some(c => c.includes('[Anti-Biasing]'))).toBe(true);
    expect(allConcerns.some(c => c.includes('[TBC]'))).toBe(true);
  });

  test('deve lançar erro para challenge vazio', async () => {
    await expect(runConclave('', [CLONE_HORMOZI])).rejects.toThrow('[Conclave]');
    await expect(runConclave('   ', [CLONE_HORMOZI])).rejects.toThrow('[Conclave]');
  });

  test('deve lançar erro para clones vazio', async () => {
    await expect(runConclave('Desafio válido', [])).rejects.toThrow('[Conclave]');
    await expect(runConclave('Desafio válido', null)).rejects.toThrow('[Conclave]');
  });

  test('meta deve registrar sessionAt como ISO string válida', async () => {
    const decision = await runConclave('Desafio simples', [CLONE_HORMOZI]);
    const date = new Date(decision.meta.sessionAt);
    expect(date.toString()).not.toBe('Invalid Date');
  });
});
