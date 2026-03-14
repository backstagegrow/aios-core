'use strict';

/**
 * packages/spec-pipeline/spec-pipeline-router.js
 *
 * Spec Pipeline — Router (AEV-1)
 *
 * Recebe um complexityResult do complexity-scorer e determina quais fases
 * do spec pipeline devem ser executadas, na ordem correta.
 *
 * Routing por classe:
 *   SIMPLE   → 3 fases: gather → write-spec → critique
 *   STANDARD → 6 fases: gather → assess → research → write-spec → critique → plan
 *   COMPLEX  → 6 fases + requiresArchitectReview flag
 *
 * Usage (CLI):
 *   node packages/spec-pipeline/spec-pipeline-router.js route \
 *     --score 12 --class STANDARD
 *
 *   echo '{"totalScore":12,"complexityClass":"STANDARD"}' | \
 *     node packages/spec-pipeline/spec-pipeline-router.js route --stdin
 *
 * Usage (module):
 *   const { routePipeline } = require('./packages/spec-pipeline/spec-pipeline-router');
 *   const route = routePipeline(complexityResult);
 */

const { COMPLEXITY_CLASSES } = require('./complexity-scorer');

/**
 * Definição completa das 6 fases do spec pipeline.
 * Fases com required=false podem ser puladas conforme complexity class.
 */
const ALL_PHASES = [
  {
    id: 'gather',
    name: 'Gather Requirements',
    agent: '@pm',
    task: 'spec-gather-requirements.md',
    output: 'requirements.json',
    required: true,
    description: 'Elicitar e estruturar requisitos funcionais e não-funcionais',
  },
  {
    id: 'assess',
    name: 'Assess Complexity',
    agent: '@architect',
    task: 'spec-assess-complexity.md',
    output: 'complexity.json',
    required: false,
    description: 'Avaliar complexidade técnica e arquitetural',
    skipForClasses: [COMPLEXITY_CLASSES.SIMPLE],
  },
  {
    id: 'research',
    name: 'Research Dependencies',
    agent: '@analyst',
    task: 'spec-research-dependencies.md',
    output: 'research.json',
    required: false,
    description: 'Pesquisar dependências, bibliotecas e referências técnicas',
    skipForClasses: [COMPLEXITY_CLASSES.SIMPLE],
  },
  {
    id: 'write-spec',
    name: 'Write Spec',
    agent: '@pm',
    task: 'spec-write-spec.md',
    output: 'spec.md',
    required: true,
    description: 'Escrever especificação formal baseada nos requisitos coletados',
  },
  {
    id: 'critique',
    name: 'Critique Spec',
    agent: '@qa',
    task: 'spec-critique.md',
    output: 'critique.json',
    required: true,
    description: 'Validar spec com critérios APPROVED/NEEDS_REVISION/BLOCKED',
  },
  {
    id: 'plan',
    name: 'Plan Implementation',
    agent: '@architect',
    task: 'spec-assess-complexity.md',
    output: 'implementation.yaml',
    required: false,
    description: 'Criar plano de implementação baseado na spec aprovada',
    skipForClasses: [COMPLEXITY_CLASSES.SIMPLE],
  },
];

/**
 * Determina quais fases do spec pipeline devem ser executadas.
 * @param {Object} complexityResult - Resultado do scoreComplexity()
 * @param {string} complexityResult.complexityClass - 'SIMPLE'|'STANDARD'|'COMPLEX'
 * @param {number} complexityResult.totalScore
 * @param {boolean} complexityResult.requiresArchitectReview
 * @returns {Object} Route com fases, razões de skip, e metadados
 */
function routePipeline(complexityResult) {
  const {
    complexityClass,
    totalScore,
    requiresArchitectReview = false,
  } = complexityResult;

  if (!COMPLEXITY_CLASSES[complexityClass]) {
    throw new Error(
      `[spec-pipeline-router] complexityClass inválida: "${complexityClass}". Use: ${Object.keys(COMPLEXITY_CLASSES).join(', ')}`,
    );
  }

  const skipReasons = {};
  const phases = ALL_PHASES.filter(phase => {
    if (phase.skipForClasses && phase.skipForClasses.includes(complexityClass)) {
      skipReasons[phase.id] = `${complexityClass} complexity — ${phase.name} não é necessário`;
      return false;
    }
    return true;
  });

  return {
    complexityClass,
    totalScore,
    requiresArchitectReview,
    phases,
    skipReasons,
    phasesCount: phases.length,
    estimatedFlow: getFlowLabel(complexityClass),
    routedAt: new Date().toISOString(),
  };
}

/**
 * Retorna descrição legível do fluxo para uma complexity class.
 * @param {string} complexityClass
 * @returns {string}
 */
function getFlowLabel(complexityClass) {
  const labels = {
    [COMPLEXITY_CLASSES.SIMPLE]: '3 fases — fast track (gather → spec → critique)',
    [COMPLEXITY_CLASSES.STANDARD]: '6 fases — pipeline completo',
    [COMPLEXITY_CLASSES.COMPLEX]: '6 fases + revisão obrigatória do @architect',
  };
  return labels[complexityClass] || 'Fluxo desconhecido';
}

/**
 * Formata o route para exibição no terminal.
 * @param {Object} route - Resultado de routePipeline()
 * @returns {string}
 */
function formatRouteForDisplay(route) {
  const lines = [
    `Complexity: ${route.complexityClass} (score: ${route.totalScore}/25)`,
    `Flow: ${route.estimatedFlow}`,
    `Phases (${route.phasesCount}):`,
  ];

  for (const phase of route.phases) {
    lines.push(`  ${phase.id === route.phases[route.phases.length - 1].id ? '└' : '├'}─ [${phase.agent}] ${phase.name}`);
  }

  if (Object.keys(route.skipReasons).length > 0) {
    lines.push('Skipped:');
    for (const [phaseId, reason] of Object.entries(route.skipReasons)) {
      lines.push(`  ✗ ${phaseId}: ${reason}`);
    }
  }

  if (route.requiresArchitectReview) {
    lines.push('');
    lines.push('⚠️  Revisão do @architect obrigatória antes da implementação');
  }

  return lines.join('\n');
}

// === CLI Entry Point ===
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'route') {
    const useStdin = args.includes('--stdin');

    if (useStdin) {
      let data = '';
      process.stdin.on('data', chunk => { data += chunk; });
      process.stdin.on('end', () => {
        try {
          const complexityResult = JSON.parse(data);
          const route = routePipeline(complexityResult);
          console.log(formatRouteForDisplay(route));
          console.log('');
          console.log(JSON.stringify(route, null, 2));
        } catch (err) {
          console.error('[spec-pipeline-router] Erro:', err.message);
          process.exit(1);
        }
      });
    } else {
      const parsed = {};
      for (let i = 1; i < args.length; i += 2) {
        const key = args[i].replace('--', '');
        parsed[key] = args[i + 1];
      }

      try {
        const complexityResult = {
          complexityClass: parsed.class || parsed.complexityClass,
          totalScore: parseInt(parsed.score || parsed.totalScore, 10) || 0,
          requiresArchitectReview: parsed.class === 'COMPLEX',
        };
        const route = routePipeline(complexityResult);
        console.log(formatRouteForDisplay(route));
      } catch (err) {
        console.error('[spec-pipeline-router] Erro:', err.message);
        process.exit(1);
      }
    }
  } else if (command === 'phases') {
    console.log('Todas as fases disponíveis:');
    for (const phase of ALL_PHASES) {
      console.log(`  ${phase.id}: [${phase.agent}] ${phase.name}`);
    }
  } else {
    console.log('Usage:');
    console.log('  node spec-pipeline-router.js route --score N --class SIMPLE|STANDARD|COMPLEX');
    console.log('  node spec-pipeline-router.js phases');
  }
}

module.exports = {
  routePipeline,
  formatRouteForDisplay,
  getFlowLabel,
  ALL_PHASES,
};
