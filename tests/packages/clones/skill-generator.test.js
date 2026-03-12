/**
 * tests/packages/clones/skill-generator.test.js
 *
 * Testes unitários para o módulo Skill Generator
 */

'use strict';

const {
  generateSkills,
  generateSkillFromFramework,
  applyNamingConventions,
  groupSkillsByCategory,
} = require('../../../packages/clones/skill-generator');

// ============================================================
// FIXTURES
// ============================================================

const SAMPLE_DNA = {
  specialist: 'Alex Hormozi',
  philosophy: [
    'A oferta é o princípio mais importante do negócio',
    'Valor percebido deve superar Preço pedido em pelo menos 10x',
  ],
  mentalModel: [
    'Quando um cliente hesita, sempre veja como feedback do mercado',
    'Enquadrar preço como investimento, não custo',
  ],
  heuristics: [
    'Se o cliente hesita, a oferta não está boa o suficiente',
    'Nunca ofereça desconto sem retirar algo da oferta',
  ],
  frameworks: [
    '$100M Offers Framework: Processo de criação de oferta irresistível em 4 passos',
    'Value Equation: Dream Outcome × Perceived Likelihood / Effort × Time',
    'Garantia Sem Risco: Troca risco do cliente por risco do vendedor',
  ],
  methodology: [
    '1. Identifique o problema real do cliente 2. Crie solução que remove risco 3. Adicione garantias 4. Precio por valor',
  ],
  meta: {
    specialist: 'Alex Hormozi',
    mappedAt: new Date().toISOString(),
    layerCounts: { philosophy: 2, mentalModel: 2, heuristics: 2, frameworks: 3, methodology: 1 },
    totalInsights: 10,
  },
};

const MINIMAL_DNA = {
  specialist: 'Test Specialist',
  philosophy: [],
  mentalModel: [],
  heuristics: [],
  frameworks: [],
  methodology: [],
};

// ============================================================
// TESTES: applyNamingConventions
// ============================================================

describe('Skill Generator — applyNamingConventions', () => {
  test('deve converter para kebab-case', () => {
    expect(applyNamingConventions('My Skill Name')).toBe('my-skill-name');
  });

  test('deve remover caracteres especiais', () => {
    expect(applyNamingConventions('$100M Offer!')).toBe('100m-offer');
  });

  test('deve limitar a 50 caracteres', () => {
    const longName = 'a'.repeat(100);
    const result = applyNamingConventions(longName);
    expect(result.length).toBeLessThanOrEqual(50);
  });
});

// ============================================================
// TESTES: generateSkillFromFramework
// ============================================================

describe('Skill Generator — generateSkillFromFramework', () => {
  test('deve gerar uma skill com todos os campos obrigatórios', () => {
    const skill = generateSkillFromFramework(
      '$100M Offers Framework: 4 passos para criar oferta irresistível',
      { specialist: 'Alex Hormozi' },
    );

    expect(skill).toHaveProperty('id');
    expect(skill).toHaveProperty('name');
    expect(skill).toHaveProperty('description');
    expect(skill).toHaveProperty('steps');
    expect(skill).toHaveProperty('framework');
    expect(skill).toHaveProperty('checklist');
    expect(skill).toHaveProperty('category');
    expect(skill).toHaveProperty('specialist', 'Alex Hormozi');
    expect(Array.isArray(skill.steps)).toBe(true);
    expect(Array.isArray(skill.checklist)).toBe(true);
  });

  test('deve categorizar corretamente baseado em palavras-chave', () => {
    const offerSkill = generateSkillFromFramework('Oferta irresistível', { specialist: 'X' });
    const strategySkill = generateSkillFromFramework('Estratégia de crescimento', { specialist: 'X' });
    const salesSkill = generateSkillFromFramework('Vendas e conversão', { specialist: 'X' });

    expect(offerSkill.category).toBe('oferta');
    expect(strategySkill.category).toBe('estratégia');
    expect(salesSkill.category).toBe('vendas');
  });

  test('deve ter pelo menos 1 passo no array steps', () => {
    const skill = generateSkillFromFramework('Framework Qualquer', { specialist: 'X' });
    expect(skill.steps.length).toBeGreaterThan(0);
  });
});

// ============================================================
// TESTES: groupSkillsByCategory
// ============================================================

describe('Skill Generator — groupSkillsByCategory', () => {
  test('deve agrupar skills corretamente', () => {
    const skills = [
      { id: '1', name: 'A', category: 'oferta', description: '', steps: [], checklist: [], framework: '', specialist: 'X' },
      { id: '2', name: 'B', category: 'vendas', description: '', steps: [], checklist: [], framework: '', specialist: 'X' },
      { id: '3', name: 'C', category: 'oferta', description: '', steps: [], checklist: [], framework: '', specialist: 'X' },
    ];

    const grouped = groupSkillsByCategory(skills);

    expect(grouped).toHaveProperty('oferta');
    expect(grouped).toHaveProperty('vendas');
    expect(grouped.oferta.length).toBe(2);
    expect(grouped.vendas.length).toBe(1);
  });

  test('deve retornar objeto vazio para array vazio', () => {
    expect(groupSkillsByCategory([])).toEqual({});
  });
});

// ============================================================
// TESTES: generateSkills (principal)
// ============================================================

describe('Skill Generator — generateSkills', () => {
  test('deve gerar skills para cada framework no DNA', () => {
    const skills = generateSkills(SAMPLE_DNA);

    expect(Array.isArray(skills)).toBe(true);
    expect(skills.length).toBeGreaterThan(0);
    // 3 frameworks + geração a partir de heurísticas
    expect(skills.length).toBeGreaterThanOrEqual(3);
  });

  test('cada skill deve ter os campos obrigatórios', () => {
    const skills = generateSkills(SAMPLE_DNA);

    for (const skill of skills) {
      expect(skill).toHaveProperty('id');
      expect(skill).toHaveProperty('name');
      expect(skill).toHaveProperty('description');
      expect(skill).toHaveProperty('steps');
      expect(skill).toHaveProperty('checklist');
      expect(skill).toHaveProperty('category');
      expect(skill).toHaveProperty('specialist');
      expect(typeof skill.id).toBe('string');
      expect(typeof skill.name).toBe('string');
    }
  });

  test('deve ter IDs únicos entre as skills', () => {
    const skills = generateSkills(SAMPLE_DNA);
    const ids = skills.map(s => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  test('deve retornar array vazio para DNA mínimo sem frameworks', () => {
    const skills = generateSkills(MINIMAL_DNA);
    expect(Array.isArray(skills)).toBe(true);
    expect(skills.length).toBe(0);
  });

  test('deve lançar erro para DNA inválido', () => {
    expect(() => generateSkills(null)).toThrow('[SkillGenerator] dnaProfile inválido');
    expect(() => generateSkills('string')).toThrow('[SkillGenerator] dnaProfile inválido');
  });

  test('deve retornar resultado agrupado por categoria quando pedido', () => {
    const result = generateSkills(SAMPLE_DNA, { grouped: true });
    expect(result).not.toBeInstanceOf(Array);
    expect(typeof result).toBe('object');
  });
});
