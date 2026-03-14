'use strict';

/**
 * packages/spec-pipeline/complexity-scorer.js
 *
 * Spec Pipeline — Complexity Scorer (AEV-1)
 *
 * Calcula complexity score de uma story usando 5 dimensões (1-5 cada).
 * Score total máximo: 25 pontos.
 *
 * Thresholds:
 *   SIMPLE   → score ≤ 8   (3 phases: gather → spec → critique)
 *   STANDARD → score 9-15  (6 phases: full pipeline)
 *   COMPLEX  → score ≥ 16  (6 phases + requiresArchitectReview)
 *
 * Usage (CLI):
 *   node packages/spec-pipeline/complexity-scorer.js score \
 *     --scope 3 --integration 2 --infrastructure 1 --knowledge 2 --risk 2
 *
 * Usage (module):
 *   const { scoreComplexity } = require('./packages/spec-pipeline/complexity-scorer');
 *   const result = scoreComplexity({ scope: 3, integration: 2, infrastructure: 1, knowledge: 2, risk: 2 });
 */

const DIMENSIONS = {
  scope: {
    label: 'Scope',
    description: 'Número de arquivos/módulos afetados',
    levels: {
      1: 'Mudança em arquivo único',
      2: 'Poucos arquivos (2-5) no mesmo módulo',
      3: 'Múltiplos módulos (5-15 arquivos)',
      4: 'Cross-module (15-30 arquivos)',
      5: 'System-wide (>30 arquivos ou impacto arquitetural)',
    },
  },
  integration: {
    label: 'Integration',
    description: 'APIs externas ou serviços terceiros envolvidos',
    levels: {
      1: 'Sem dependências externas',
      2: 'Apenas APIs internas existentes',
      3: 'Uma nova API externa',
      4: 'Múltiplas APIs externas',
      5: 'Dependências críticas de terceiros ou migrações',
    },
  },
  infrastructure: {
    label: 'Infrastructure',
    description: 'Mudanças em infraestrutura ou deploy',
    levels: {
      1: 'Sem mudanças de infraestrutura',
      2: 'Apenas mudanças de config',
      3: 'Mudanças menores (env vars, config simples)',
      4: 'Mudanças significativas (schema DB, novos serviços)',
      5: 'Mudanças maiores (migrações, novos deploys, CI/CD)',
    },
  },
  knowledge: {
    label: 'Knowledge',
    description: 'Familiaridade da equipe com o domínio',
    levels: {
      1: 'Domínio bem conhecido, padrões existentes',
      2: 'Majoritariamente familiar, pouca pesquisa',
      3: 'Parcialmente familiar, pesquisa moderada',
      4: 'Pouca familiaridade, pesquisa significativa',
      5: 'Território desconhecido, pesquisa profunda necessária',
    },
  },
  risk: {
    label: 'Risk',
    description: 'Nível de criticidade e impacto potencial',
    levels: {
      1: 'Baixo risco, facilmente reversível',
      2: 'Risco baixo-médio, impacto mínimo ao usuário',
      3: 'Risco médio, algum impacto ao usuário',
      4: 'Alto risco, impacto significativo ao usuário',
      5: 'Risco crítico (dados, segurança, compliance)',
    },
  },
};

const THRESHOLDS = {
  simple: 8,    // score ≤ 8 → SIMPLE
  standard: 15, // score 9-15 → STANDARD; score ≥ 16 → COMPLEX
};

const COMPLEXITY_CLASSES = {
  SIMPLE: 'SIMPLE',
  STANDARD: 'STANDARD',
  COMPLEX: 'COMPLEX',
};

/**
 * Classifica o score total em classe de complexidade.
 * @param {number} totalScore
 * @returns {'SIMPLE'|'STANDARD'|'COMPLEX'}
 */
function classifyScore(totalScore) {
  if (totalScore <= THRESHOLDS.simple) return COMPLEXITY_CLASSES.SIMPLE;
  if (totalScore <= THRESHOLDS.standard) return COMPLEXITY_CLASSES.STANDARD;
  return COMPLEXITY_CLASSES.COMPLEX;
}

/**
 * Calcula complexity score de uma story baseado nas 5 dimensões.
 * @param {Object} dimensions - Scores por dimensão (1-5 cada)
 * @param {number} dimensions.scope
 * @param {number} dimensions.integration
 * @param {number} dimensions.infrastructure
 * @param {number} dimensions.knowledge
 * @param {number} dimensions.risk
 * @returns {Object} Resultado com totalScore, complexityClass, requiresArchitectReview
 */
function scoreComplexity(dimensions) {
  const {
    scope = 1,
    integration = 1,
    infrastructure = 1,
    knowledge = 1,
    risk = 1,
  } = dimensions;

  const scores = { scope, integration, infrastructure, knowledge, risk };

  for (const [key, value] of Object.entries(scores)) {
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new Error(
        `[complexity-scorer] Dimensão "${key}" deve ser um inteiro entre 1 e 5, recebido: ${value}`,
      );
    }
  }

  const totalScore = scope + integration + infrastructure + knowledge + risk;
  const complexityClass = classifyScore(totalScore);
  const requiresArchitectReview = complexityClass === COMPLEXITY_CLASSES.COMPLEX;

  return {
    totalScore,
    complexityClass,
    requiresArchitectReview,
    dimensions: scores,
    maxScore: 25,
    thresholds: { ...THRESHOLDS },
    assessedAt: new Date().toISOString(),
  };
}

/**
 * Retorna o guia de dimensões com descrições e níveis.
 * @returns {Object}
 */
function getDimensionGuide() {
  return DIMENSIONS;
}

// === CLI Entry Point ===
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'score') {
    const parsed = {};
    for (let i = 1; i < args.length; i += 2) {
      const key = args[i].replace('--', '');
      const value = parseInt(args[i + 1], 10);
      if (!isNaN(value)) parsed[key] = value;
    }

    try {
      const result = scoreComplexity(parsed);
      console.log(JSON.stringify(result, null, 2));
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
  } else if (command === 'guide') {
    console.log(JSON.stringify(getDimensionGuide(), null, 2));
  } else {
    console.log('Usage:');
    console.log('  node complexity-scorer.js score --scope N --integration N --infrastructure N --knowledge N --risk N');
    console.log('  node complexity-scorer.js guide');
    console.log('');
    console.log('Thresholds: SIMPLE ≤8 | STANDARD 9-15 | COMPLEX ≥16');
  }
}

module.exports = {
  scoreComplexity,
  classifyScore,
  getDimensionGuide,
  DIMENSIONS,
  THRESHOLDS,
  COMPLEXITY_CLASSES,
};
