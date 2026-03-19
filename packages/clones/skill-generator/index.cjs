/**
 * aios-core/packages/clones/skill-generator/index.js
 *
 * Skill Generator — Conversão de Frameworks DNA em Skills Executáveis
 *
 * Transforma os frameworks e metodologias extraídos do DNA de um especialista
 * em skills operacionais que o clone usa dentro do negócio do cliente.
 *
 * Exemplos:
 *   - Framework "$100M Offers" de Alex Hormozi → skill de construção de oferta
 *   - Heurística de Peter Drucker → skill de gestão por objetivos
 */

'use strict';

/**
 * @typedef {Object} Skill
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string[]} steps
 * @property {string} framework
 * @property {string[]} checklist
 * @property {string} specialist
 * @property {string} category
 */

/**
 * Categorias funcionais (português) de skills para classificação automática.
 * A ordem importa: primeiro match vence.
 */
const SKILL_CATEGORIES = [
  { key: 'oferta',     keywords: ['oferta', 'offer', 'garantia', 'desconto', 'irresistível', 'value equation', 'valor percebido', '$100m'] },
  { key: 'vendas',     keywords: ['venda', 'cliente', 'objeção', 'proposta', 'negociação', 'fechar', 'lead', 'pitch', 'conversão', 'Sales'] },
  { key: 'marketing',  keywords: ['conteúdo', 'copy', 'anúncio', 'funil', 'audiência', 'marca', 'posicionamento'] },
  { key: 'operações',  keywords: ['processo', 'sistematizar', 'delegação', 'kpi', 'otimizar', 'eficiência', 'operação'] },
  { key: 'liderança',  keywords: ['liderança', 'equipe', 'cultura', 'contratação', 'desenvolvimento', 'feedback'] },
  { key: 'estratégia', keywords: ['estratégia', 'strategy', 'mercado', 'competidor', 'crescimento', 'expansão', 'modelo de negócio', 'management by objectives', 'mbo', 'effective executive', 'objetivos'] },
  { key: 'finanças',   keywords: ['lucro', 'receita', 'custo', 'margem', 'investimento', 'fluxo de caixa', 'roi'] },
];

// ────────────────────────────────────────────────────────────────
// HELPERS INTERNOS
// ────────────────────────────────────────────────────────────────

/**
 * Detecta a categoria funcional de uma skill com base no conteúdo.
 * @param {string} text
 * @returns {string}
 */
function detectCategory(text) {
  const lower = text.toLowerCase();
  for (const { key, keywords } of SKILL_CATEGORIES) {
    if (keywords.some(kw => lower.includes(kw.toLowerCase()))) {
      return key;
    }
  }
  return 'geral';
}

/**
 * Gera um ID único para a skill.
 * @param {string} name
 * @param {string} specialist
 * @returns {string}
 */
function generateSkillId(name, specialist) {
  const base = `${specialist}_${name}`
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 50);
  return `skill_${base}_${Date.now() % 100000}`;
}

/**
 * Converte um framework em passos de execução estruturados.
 * @param {string} frameworkText
 * @returns {string[]}
 */
function extractSteps(frameworkText) {
  // Tenta extrair passos numerados (1. 2. 3. ou Passo 1: etc.)
  const numberedSteps = frameworkText.match(/(?:\d+[.):]|Passo\s*\d+:?|Etapa\s*\d+:?)\s*([^\n]+)/gi);
  if (numberedSteps && numberedSteps.length >= 2) {
    return numberedSteps.map(s => s.replace(/^\d+[.):\s]+|^(?:Passo|Etapa)\s*\d+:?\s*/i, '').trim());
  }

  // Divide por sentenças e retorna como passos
  const sentences = frameworkText
    .split(/[.!?]/)
    .map(s => s.trim())
    .filter(s => s.length > 15)
    .slice(0, 5);

  if (sentences.length > 0) return sentences;

  // Fallback: retorna o texto inteiro como um único passo
  return [frameworkText.trim().slice(0, 200)];
}

/**
 * Gera um checklist de validação para a skill.
 * @param {string} name
 * @param {string[]} steps
 * @returns {string[]}
 */
function generateChecklist(name, steps) {
  const checklist = [
    `Contexto identificado para aplicar "${name}"`,
    'Passos executados em sequência',
  ];

  if (steps.length > 2) {
    checklist.push(`Todos os ${steps.length} passos verificados`);
  }

  checklist.push('Resultado documentado e registrado');
  checklist.push('Aprendizados capturados para próxima iteração');

  return checklist;
}

// ────────────────────────────────────────────────────────────────
// API PÚBLICA
// ────────────────────────────────────────────────────────────────

/**
 * Converte uma string de nome para o formato kebab-case,
 * removendo caracteres especiais e limitando a 50 caracteres.
 *
 * @param {string} name
 * @returns {string}
 */
function applyNamingConventions(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // strip special chars (but keep hyphens & spaces)
    .replace(/\s+/g, '-')          // spaces → hyphens
    .replace(/-+/g, '-')           // collapse consecutive hyphens
    .replace(/^-|-$/g, '')         // trim leading/trailing hyphens
    .slice(0, 50);
}

/**
 * Converte um único framework em uma Skill executável.
 * Esta é a versão com assinatura pública (substitui frameworkToSkill).
 *
 * @param {string} frameworkText
 * @param {{ specialist?: string }} [context]
 * @returns {Skill}
 */
function generateSkillFromFramework(frameworkText, context = {}) {
  const specialist = (context && context.specialist) || 'Anônimo';

  let name, description;

  if (typeof frameworkText === 'string') {
    // Primeira parte antes de ":" (se existir) como nome, senão primeira frase
    const colonIdx = frameworkText.indexOf(':');
    if (colonIdx > 0 && colonIdx < 80) {
      name = frameworkText.slice(0, colonIdx).trim().slice(0, 60);
      description = frameworkText;
    } else {
      const firstSentence = frameworkText.split(/[.!?]/)[0].trim().slice(0, 60);
      name = firstSentence || 'Skill sem nome';
      description = frameworkText;
    }
  } else {
    name = String(frameworkText).slice(0, 60);
    description = String(frameworkText);
  }

  const steps = extractSteps(description);
  const checklist = generateChecklist(name, steps);
  const category = detectCategory(`${name} ${description}`);

  return {
    id: generateSkillId(name, specialist),
    name,
    description,
    steps,
    framework: name,
    checklist,
    specialist,
    category,
  };
}

/**
 * Agrupa um array de skills em um objeto indexado por categoria.
 *
 * @param {Skill[]} skills
 * @returns {Record<string, Skill[]>}
 */
function groupSkillsByCategory(skills) {
  const result = {};
  for (const skill of skills) {
    const cat = skill.category || 'geral';
    if (!result[cat]) result[cat] = [];
    result[cat].push(skill);
  }
  return result;
}

/**
 * Gera skills executáveis a partir de um DNAProfile completo.
 *
 * @param {Object} dnaProfile - Perfil DNA mapeado pelo DNAMapper
 * @param {{ grouped?: boolean }} [options]
 * @returns {Skill[] | Record<string, Skill[]>}
 */
function generateSkills(dnaProfile, options = {}) {
  if (!dnaProfile || typeof dnaProfile !== 'object') {
    throw new Error('[SkillGenerator] dnaProfile inválido: deve ser um objeto');
  }

  const specialist = dnaProfile.specialist || 'Anônimo';
  const skills = [];

  // Gera skills a partir de frameworks (fonte primária)
  const frameworks = dnaProfile.frameworks || [];
  for (const framework of frameworks) {
    try {
      const skill = generateSkillFromFramework(framework, { specialist });
      skills.push(skill);
    } catch (err) {
      console.warn(`[SkillGenerator] ⚠️ Falha ao converter framework: ${err.message}`);
    }
  }

  // Gera skills a partir de metodologias apenas se não houver frameworks (evita duplicação)
  if (frameworks.length === 0) {
    const methodologies = dnaProfile.methodology || [];
    for (const methodology of methodologies) {
      try {
        const skill = generateSkillFromFramework(methodology, { specialist });
        if (skill.category === 'geral') skill.category = 'operações';
        skills.push(skill);
      } catch (err) {
        console.warn(`[SkillGenerator] ⚠️ Falha ao converter metodologia: ${err.message}`);
      }
    }
  }

  console.log(
    `[SkillGenerator] ✅ ${skills.length} skills geradas para "${specialist}" (${frameworks.length} frameworks)`,
  );

  if (options && options.grouped) {
    return groupSkillsByCategory(skills);
  }

  return skills;
}

// Alias para manter retrocompatibilidade interna
const frameworkToSkill = (frameworkItem, specialist) =>
  generateSkillFromFramework(frameworkItem, { specialist });

module.exports = {
  generateSkills,
  generateSkillFromFramework,
  applyNamingConventions,
  groupSkillsByCategory,
  // Alias legado / auxiliares para testes
  frameworkToSkill,
  detectCategory,
  extractSteps,
  generateChecklist,
  generateSkillId,
};
