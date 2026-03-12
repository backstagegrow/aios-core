/**
 * aios-core/packages/clones/conclave/index.js
 *
 * Conclave — Alto Conselho de CLONES
 *
 * Sistema de orquestração multi-agente que coordena múltiplos clones para
 * gerar perspectivas cruzadas sobre desafios estratégicos complexos.
 *
 * Inspirado no universo John Wick — opera como um board de diretores de IA
 * onde cada clone representa um especialista com DNA mapeado.
 *
 * Protocolos disponíveis:
 *   - Anti-Pleasing:              Respostas honestas sem agradismo
 *   - Anti-Biasing Investigativo: Questiona premissas do cliente
 *   - Total Business Context:     Analisa o negócio como um todo
 */

'use strict';

/**
 * @typedef {Object} Clone
 * @property {string} name - Nome do clone (ex: 'Alex Hormozi Clone')
 * @property {Object} dnaProfile - Perfil DNA mapeado pelo DNAMapper
 * @property {Array} [skills] - Skills geradas pelo SkillGenerator
 */

/**
 * @typedef {Object} ConclavePerspective
 * @property {string} cloneName - Nome do clone que gerou a perspectiva
 * @property {string} specialist - Especialista de origem
 * @property {string} perspective - Perspectiva gerada baseada no DNA
 * @property {string[]} recommendations - Recomendações específicas
 * @property {string[]} frameworks - Frameworks sugeridos para o desafio
 * @property {string[]} concerns - Preocupações ou riscos identificados
 */

/**
 * @typedef {Object} ConclaveDecision
 * @property {string} challenge - Desafio estratégico analisado
 * @property {ConclavePerspective[]} perspectives - Perspectivas de cada clone
 * @property {Object} hybridDossier - Síntese cruzada de todas as perspectivas
 * @property {string} recommendation - Recomendação final do Conclave
 * @property {Object} meta - Metadados da sessão
 */

/**
 * Gera a perspectiva de um clone específico para um desafio.
 * Baseado no DNA profile do clone, simula como o especialista responderia.
 * @param {Clone} clone
 * @param {string} challenge
 * @param {Object} protocols
 * @returns {ConclavePerspective}
 */
function generateClonePerspective(clone, challenge, protocols = {}) {
  const { dnaProfile } = clone;
  const specialist = (dnaProfile && dnaProfile.specialist) || clone.name || 'Clone';

  // Seleciona frameworks relevantes para o desafio
  const relevantFrameworks = (dnaProfile.frameworks || [])
    .slice(0, 3)
    .map(f => {
      if (typeof f === 'string') return f.slice(0, 100);
      if (typeof f === 'object' && f !== null) return (f.title || String(f)).slice(0, 100);
      return String(f).slice(0, 100);
    });

  // Gera recomendações com base nas heurísticas e metodologias
  const recommendations = [];

  if (dnaProfile.heuristics && dnaProfile.heuristics.length > 0) {
    const heuristic = typeof dnaProfile.heuristics[0] === 'string'
      ? dnaProfile.heuristics[0]
      : String(dnaProfile.heuristics[0]);
    recommendations.push(`Aplicar heurística principal: "${heuristic.slice(0, 80)}"`);
  }

  if (dnaProfile.methodology && dnaProfile.methodology.length > 0) {
    const method = typeof dnaProfile.methodology[0] === 'string'
      ? dnaProfile.methodology[0]
      : String(dnaProfile.methodology[0]);
    recommendations.push(`Método sugerido: "${method.slice(0, 80)}"`);
  }

  if (dnaProfile.mentalModel && dnaProfile.mentalModel.length > 0) {
    const model = typeof dnaProfile.mentalModel[0] === 'string'
      ? dnaProfile.mentalModel[0]
      : String(dnaProfile.mentalModel[0]);
    recommendations.push(`Enquadrar usando: "${model.slice(0, 80)}"`);
  }

  // Preocupações (Anti-Biasing Investigativo)
  const concerns = [];
  if (protocols.antiPleasing) {
    concerns.push('[Anti-Pleasing] A situação pode ser diferente do que parece: verifique as premissas');
  }
  if (protocols.antiBiasing) {
    concerns.push('[Anti-Biasing] Questione: qual informação fundamental ainda não foi revelada?');
    concerns.push('[Anti-Biasing] Quem ganha se este desafio continuar sem solução?');
  }
  if (protocols.totalBusinessContext) {
    concerns.push('[TBC] Considere o impacto sistêmico: como isso afeta as outras áreas do negócio?');
  }

  // Perspectiva narrativa
  const philosophy = dnaProfile.philosophy && dnaProfile.philosophy.length > 0
    ? (typeof dnaProfile.philosophy[0] === 'string' ? dnaProfile.philosophy[0] : String(dnaProfile.philosophy[0])).slice(0, 150)
    : `A perspectiva central de ${specialist}`;

  const perspective =
    `${specialist} abordaria "${challenge.slice(0, 80)}" com base no princípio: ` +
    `"${philosophy}". ` +
    (relevantFrameworks.length > 0
      ? `Frameworks aplicáveis: ${relevantFrameworks.slice(0, 2).join('; ')}.`
      : 'Foco na execução prática e resultados mensuráveis.');

  return {
    cloneName: clone.name || `Clone de ${specialist}`,
    specialist,
    perspective,
    recommendations: recommendations.length > 0 ? recommendations : ['Analisar o problema do ponto de vista do ROI'],
    frameworks: relevantFrameworks,
    concerns,
  };
}

/**
 * Sintetiza todas as perspectivas em um dossier híbrido.
 * @param {ConclavePerspective[]} perspectives
 * @param {string} challenge
 * @returns {Object}
 */
function synthesizePerspectives(perspectives, challenge) {
  const hybrid = {
    challenge,
    consensusPoints: [],
    divergencePoints: [],
    topFrameworks: [],
    topConcerns: [],
  };

  // Agrega frameworks mais mencionados
  const frameworkCount = {};
  for (const p of perspectives) {
    for (const fw of (p.frameworks || [])) {
      const key = fw.slice(0, 50);
      frameworkCount[key] = (frameworkCount[key] || 0) + 1;
    }
  }
  hybrid.topFrameworks = Object.entries(frameworkCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([fw, count]) => ({ framework: fw, mentions: count }));

  // Agrega preocupações
  const allConcerns = perspectives.flatMap(p => p.concerns || []);
  hybrid.topConcerns = [...new Set(allConcerns)].slice(0, 5);

  // Pontos de consenso (recomendações similares entre clones)
  const allRecommendations = perspectives.flatMap(p => p.recommendations || []);
  const recCount = {};
  for (const rec of allRecommendations) {
    const key = rec.slice(0, 40);
    recCount[key] = (recCount[key] || 0) + 1;
  }
  hybrid.consensusPoints = Object.entries(recCount)
    .filter(([, count]) => count > 1)
    .map(([rec]) => rec);

  // Pontos de divergência (perspectivas únicas por clone)
  hybrid.divergencePoints = perspectives.map(p => ({
    clone: p.cloneName,
    uniquePerspective: p.perspective.slice(0, 150),
  }));

  return hybrid;
}

/**
 * Gera a recomendação final do Conclave com base nas perspectivas e dossier híbrido.
 * @param {ConclavePerspective[]} perspectives
 * @param {Object} hybridDossier
 * @param {string} challenge
 * @returns {string}
 */
function generateConclaveRecommendation(perspectives, hybridDossier, challenge) {
  const numClones = perspectives.length;
  const topFramework = hybridDossier.topFrameworks[0];
  const consensusCount = hybridDossier.consensusPoints.length;

  let recommendation = `O Conclave de ${numClones} clone(s) analisou: "${challenge.slice(0, 80)}". `;

  if (topFramework) {
    recommendation += `Framework prioritário identificado: "${topFramework.framework}" (${topFramework.mentions}/${numClones} clones). `;
  }

  if (consensusCount > 0) {
    recommendation += `${consensusCount} ponto(s) de consenso entre os clones. `;
  }

  if (hybridDossier.topConcerns.length > 0) {
    recommendation += `Atenção principal: ${hybridDossier.topConcerns[0]}`;
  }

  return recommendation;
}

/**
 * Executa uma sessão do Conclave — coordena múltiplos clones para analisar um desafio.
 * @param {string} challenge - Desafio estratégico a ser analisado
 * @param {Clone[]} clones - Array de clones a serem consultados
 * @param {Object} [options]
 * @param {boolean} [options.antiPleasing=false] - Ativa protocolo Anti-Pleasing
 * @param {boolean} [options.antiBiasing=false] - Ativa Anti-Biasing Investigativo
 * @param {boolean} [options.totalBusinessContext=false] - Ativa Total Business Context
 * @returns {Promise<ConclaveDecision>}
 */
async function runConclave(challenge, clones, options = {}) {
  if (!challenge || typeof challenge !== 'string' || challenge.trim().length === 0) {
    throw new Error('[Conclave] challenge é obrigatório e deve ser uma string não vazia');
  }

  if (!Array.isArray(clones) || clones.length === 0) {
    throw new Error('[Conclave] clones deve ser um array com pelo menos 1 clone');
  }

  const protocols = {
    antiPleasing: Boolean(options.antiPleasing),
    antiBiasing: Boolean(options.antiBiasing),
    totalBusinessContext: Boolean(options.totalBusinessContext),
  };

  const activeProtocols = Object.entries(protocols)
    .filter(([, active]) => active)
    .map(([name]) => name);

  console.log(
    `[Conclave] 🔔 Sessão iniciada. Clones: ${clones.length}. ` +
    `Protocolos: ${activeProtocols.length > 0 ? activeProtocols.join(', ') : 'padrão'}`,
  );

  // Gera perspectivas de cada clone
  const perspectives = [];
  for (const clone of clones) {
    try {
      if (!clone.dnaProfile) {
        console.warn(`[Conclave] ⚠️ Clone "${clone.name}" sem dnaProfile — perspectiva básica gerada`);
        perspectives.push({
          cloneName: clone.name || 'Clone sem DNA',
          specialist: 'Desconhecido',
          perspective: `${clone.name} não possui DNA mapeado para análise profunda.`,
          recommendations: ['Mapear DNA do especialista antes de usar no Conclave'],
          frameworks: [],
          concerns: [],
        });
        continue;
      }
      const perspective = generateClonePerspective(clone, challenge, protocols);
      perspectives.push(perspective);
      console.log(`[Conclave] ✅ Perspectiva gerada: ${perspective.cloneName}`);
    } catch (err) {
      console.error(`[Conclave] ⚠️ Erro ao gerar perspectiva de "${clone.name}": ${err.message}`);
    }
  }

  // Sintetiza perspectivas
  const hybridDossier = synthesizePerspectives(perspectives, challenge);

  // Gera recomendação final
  const recommendation = generateConclaveRecommendation(perspectives, hybridDossier, challenge);

  const decision = {
    challenge,
    perspectives,
    hybridDossier,
    recommendation,
    meta: {
      sessionAt: new Date().toISOString(),
      clonesConsulted: perspectives.length,
      protocols,
      totalFrameworksEvaluated: hybridDossier.topFrameworks.length,
      consensusPoints: hybridDossier.consensusPoints.length,
    },
  };

  console.log(`[Conclave] ✨ Decisão concluída. ${perspectives.length}/${clones.length} clones contribuíram.`);
  return decision;
}

module.exports = {
  runConclave,
  // Auxiliares exportadas para testes
  generateClonePerspective,
  synthesizePerspectives,
  generateConclaveRecommendation,
};
