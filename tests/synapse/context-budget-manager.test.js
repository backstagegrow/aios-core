/**
 * Context Budget Manager Tests
 *
 * Verifies prompt complexity classification and adaptive layer/token budgeting.
 */

const {
  classifyPromptComplexity,
  buildContextBudgetProfile,
} = require('../../.aios-core/core/synapse/context/context-budget-manager');

describe('classifyPromptComplexity', () => {
  test('classifies short operational prompts as simple', () => {
    expect(classifyPromptComplexity('corrige isso')).toBe('simple');
    expect(classifyPromptComplexity('qual arquivo edita isso?')).toBe('simple');
  });

  test('classifies prompts with workflow signals as complex', () => {
    expect(
      classifyPromptComplexity('preciso arquitetar um plano de refatoracao e revisar o impacto disso'),
    ).toBe('complex');
    expect(classifyPromptComplexity('*develop story-1.2.3')).toBe('complex');
  });

  test('classifies medium prompts as standard', () => {
    expect(
      classifyPromptComplexity('quero ajustar o comportamento atual sem mudar muita coisa nem abrir arquivos demais nesta tarefa'),
    ).toBe('standard');
  });

  test('classifies prompts with active execution context as complex', () => {
    expect(classifyPromptComplexity('seguir', { active_task: { id: 'WS-002' } })).toBe('complex');
  });
});

describe('buildContextBudgetProfile', () => {
  test('shrinks budget and summary for simple prompts', () => {
    const profile = buildContextBudgetProfile({
      prompt: 'ajusta isso',
      bracket: 'FRESH',
      baseTokenBudget: 800,
      bracketLayers: [0, 1, 2, 7],
      session: {},
      legacyMode: false,
    });

    expect(profile.complexity).toBe('simple');
    expect(profile.tokenBudget).toBe(400);
    expect(profile.activeLayers).toEqual([0, 1, 2]);
    expect(profile.formatOptions.includeSummary).toBe(false);
    expect(profile.formatOptions.globalRuleLimit).toBe(2);
  });

  test('restores richer context for complex prompts outside legacy mode', () => {
    const profile = buildContextBudgetProfile({
      prompt: '*develop story-1.2.3 com debug e plano de execucao',
      bracket: 'FRESH',
      baseTokenBudget: 800,
      bracketLayers: [0, 1, 2, 7],
      session: { active_task: { id: 'story-1.2.3' } },
      legacyMode: false,
    });

    expect(profile.complexity).toBe('complex');
    expect(profile.tokenBudget).toBe(1000);
    expect(profile.activeLayers).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(profile.formatOptions.includeSummary).toBe(true);
  });

  test('preserves bracket-defined layers in legacy mode', () => {
    const profile = buildContextBudgetProfile({
      prompt: 'investigar falha de workflow',
      bracket: 'DEPLETED',
      baseTokenBudget: 2000,
      bracketLayers: [0, 1, 2, 3, 4, 5, 6, 7],
      session: {},
      legacyMode: true,
    });

    expect(profile.activeLayers).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    expect(profile.tokenBudget).toBe(2500);
  });

  test('preserves summary and a larger budget when session already has active context', () => {
    const profile = buildContextBudgetProfile({
      prompt: 'deploy isso',
      bracket: 'FRESH',
      baseTokenBudget: 800,
      bracketLayers: [0, 1, 2, 7],
      session: { active_agent: 'dev' },
      legacyMode: false,
      devmode: false,
    });

    expect(profile.complexity).toBe('simple');
    expect(profile.tokenBudget).toBe(600);
    expect(profile.formatOptions.includeSummary).toBe(true);
  });
});
