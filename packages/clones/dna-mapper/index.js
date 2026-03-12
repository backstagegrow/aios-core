/**
 * aios-core/packages/clones/dna-mapper/index.js
 *
 * DNA Mapper — Extração das 5 Camadas Mentais de um Especialista
 *
 * Converte um dossier compilado pelo Mega Brain em um DNAProfile completo
 * com as 5 camadas que definem o modelo mental único do especialista:
 *
 *   1. Filosofia      — Crenças fundamentais e valores
 *   2. Modelo Mental  — Como o especialista estrutura o pensamento
 *   3. Heurísticas    — Regras de decisão rápida
 *   4. Frameworks     — Estruturas metodológicas aplicadas
 *   5. Metodologia    — Protocolos de execução
 */

'use strict';

/**
 * @typedef {Object} DNAProfile
 * @property {string} specialist - Nome do especialista clonado
 * @property {string[]} philosophy - Crenças e princípios fundamentais
 * @property {string[]} mentalModel - Estruturas de pensamento e raciocínio
 * @property {string[]} heuristics - Regras de decisão rápida e atalhos mentais
 * @property {string[]} frameworks - Metodologias estruturadas e sistemáticas
 * @property {string[]} methodology - Protocolos de execução e entrega
 * @property {Object} meta - Metadados do mapeamento
 */

/**
 * Normaliza uma lista de itens de um campo do dossier em strings descritivas.
 * @param {Array<Object|string>} items
 * @returns {string[]}
 */
function normalizeLayer(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map(item => {
      if (typeof item === 'string') return item.trim();
      if (typeof item === 'object' && item !== null) {
        // Suporta objetos do tipo { title, description }
        const parts = [item.title, item.description].filter(Boolean);
        return parts.join(': ').trim();
      }
      return String(item).trim();
    })
    .filter(s => s.length > 0);
}

/**
 * Extrai heurísticas do modelo mental (itens curtos e assertivos).
 * @param {string[]} mentalModelItems
 * @returns {string[]}
 */
function extractHeuristicsFromModel(mentalModelItems) {
  return mentalModelItems.filter(item => {
    const words = item.split(' ').length;
    const lower = item.toLowerCase();
    // Heurísticas tendem a ser frases curtas e diretas (case-insensitive)
    return words <= 15 && (
      lower.includes('sempre') ||
      lower.includes('nunca') ||
      lower.includes('se ') ||
      lower.includes('quando')
    );
  });
}

/**
 * Mapeia o DNA de um especialista a partir de um dossier compilado.
 * @param {Object} dossier - Dossier compilado pelo Mega Brain (estágio 4)
 * @returns {DNAProfile}
 */
function mapDNA(dossier) {
  if (!dossier || typeof dossier !== 'object') {
    throw new Error('[DNAMapper] dossier inválido: deve ser um objeto');
  }

  const specialist = dossier.specialist || 'Anônimo';

  // Camada 1: Filosofia
  const philosophy = normalizeLayer(dossier.philosophy || []);

  // Camada 2: Modelo Mental (inclui mental models e cross-references)
  const mentalModel = [
    ...normalizeLayer(dossier.mentalModels || []),
    // Cross-references revelam padrões recorrentes no pensamento do especialista
    ...(dossier.crossReferences || []).map(cr => `Padrão recorrente: ${cr.theme} (${cr.count}x)`),
  ];

  // Camada 3: Heurísticas (extraídas explicitamente + derivadas do modelo mental)
  const explicitHeuristics = normalizeLayer(dossier.heuristics || []);
  const derivedHeuristics = extractHeuristicsFromModel(mentalModel);
  const heuristics = [...new Set([...explicitHeuristics, ...derivedHeuristics])];

  // Camada 4: Frameworks
  const frameworks = normalizeLayer(dossier.frameworks || []);

  // Camada 5: Metodologia
  const methodology = normalizeLayer(dossier.methodologies || []);

  const profile = {
    specialist,
    philosophy,
    mentalModel,
    heuristics,
    frameworks,
    methodology,
    meta: {
      mappedAt: new Date().toISOString(),
      layerCounts: {
        philosophy: philosophy.length,
        mentalModel: mentalModel.length,
        heuristics: heuristics.length,
        frameworks: frameworks.length,
        methodology: methodology.length,
      },
      totalInsights: philosophy.length + mentalModel.length + heuristics.length + frameworks.length + methodology.length,
    },
  };

  console.log(
    `[DNAMapper] ✅ DNA mapeado para "${specialist}": ${profile.meta.totalInsights} insights em 5 camadas`,
  );
  return profile;
}

/**
 * Combina múltiplos DNAProfiles em um perfil híbrido (Dossier Pós-Mortem Híbrido).
 * Usado pelo Conclave para criar perspectivas cruzadas.
 * @param {DNAProfile[]} profiles
 * @param {string} [hybridName='Clone Híbrido']
 * @returns {DNAProfile}
 */
function mergeProfiles(profiles, hybridName = 'Clone Híbrido') {
  if (!Array.isArray(profiles) || profiles.length === 0) {
    throw new Error('[DNAMapper] mergeProfiles requer pelo menos 1 perfil');
  }

  const merged = {
    specialist: hybridName,
    philosophy: [],
    mentalModel: [],
    heuristics: [],
    frameworks: [],
    methodology: [],
    meta: {
      mappedAt: new Date().toISOString(),
      sources: profiles.map(p => p.specialist),
    },
  };

  for (const profile of profiles) {
    merged.philosophy.push(...(profile.philosophy || []).map(p => `[${profile.specialist}] ${p}`));
    merged.mentalModel.push(...(profile.mentalModel || []).map(m => `[${profile.specialist}] ${m}`));
    merged.heuristics.push(...(profile.heuristics || []).map(h => `[${profile.specialist}] ${h}`));
    merged.frameworks.push(...(profile.frameworks || []).map(f => `[${profile.specialist}] ${f}`));
    merged.methodology.push(...(profile.methodology || []).map(m => `[${profile.specialist}] ${m}`));
  }

  merged.meta.layerCounts = {
    philosophy: merged.philosophy.length,
    mentalModel: merged.mentalModel.length,
    heuristics: merged.heuristics.length,
    frameworks: merged.frameworks.length,
    methodology: merged.methodology.length,
  };

  console.log(`[DNAMapper] 🔗 Perfil híbrido "${hybridName}" criado com ${profiles.length} fontes`);
  return merged;
}

module.exports = {
  mapDNA,
  mergeProfiles,
  // Funções auxiliares exportadas para testes
  normalizeLayer,
  extractHeuristicsFromModel,
};
