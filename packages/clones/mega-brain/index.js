/**
 * aios-core/packages/clones/mega-brain/index.js
 *
 * Mega Brain — Motor de Ingestão de 5 Estágios para o Sistema CLONES
 *
 * Converte fontes brutas (vídeos, livros, mentorias, calls) em um
 * dossier estruturado de conhecimento pronto para alimentar os CLONES.
 *
 * Pipeline:
 *   ESTÁGIO 1: INGESTÃO           — Captura de transcrições, áudio, PDFs
 *   ESTÁGIO 2: CHUNKING/CANON.    — Quebra em chunks, correção de erros
 *   ESTÁGIO 3: EXTRAÇÃO INSIGHTS  — Refinação em narrativa lógica
 *   ESTÁGIO 4: COMPILAÇÃO DOSSIER — Cruzamento de temas entre especialistas
 *   ESTÁGIO 5: ENRIQUECIMENTO     — Atualização automática dos clones
 */

'use strict';

/**
 * @typedef {Object} RawSource
 * @property {string} type - 'video' | 'audio' | 'pdf' | 'transcript' | 'call'
 * @property {string} content - Texto bruto ou transcrição
 * @property {string} [title] - Título opcional da fonte
 * @property {string} [specialist] - Nome do especialista (ex: 'Alex Hormozi')
 * @property {string} [url] - URL de origem opcional
 */

/**
 * @typedef {Object} Chunk
 * @property {string} id - Identificador único do chunk
 * @property {string} text - Texto do chunk
 * @property {string} source - Origem do chunk
 * @property {string} [specialist] - Especialista associado
 */

/**
 * @typedef {Object} Insight
 * @property {string} category - 'philosophy' | 'mental_model' | 'heuristic' | 'framework' | 'methodology'
 * @property {string} title - Título do insight
 * @property {string} description - Descrição detalhada
 * @property {string[]} evidence - Trechos do texto de suporte
 * @property {string} [specialist] - Especialista de origem
 */

/**
 * @typedef {Object} DossierResult
 * @property {Chunk[]} chunks - Chunks gerados no estágio 2
 * @property {Insight[]} insights - Insights extraídos no estágio 3
 * @property {Object} dossier - Dossier compilado no estágio 4
 * @property {Object} metadata - Metadados do pipeline
 */

// ============================================================
// ESTÁGIO 1: INGESTÃO
// ============================================================

/**
 * Captura e normaliza a fonte bruta para processamento.
 * @param {RawSource} source
 * @returns {{ content: string; metadata: Object }}
 */
function stage1_ingest(source) {
  if (!source || !source.content) {
    throw new Error('[MegaBrain] Estágio 1: source.content é obrigatório');
  }

  const content = source.content.trim();
  const metadata = {
    type: source.type || 'unknown',
    title: source.title || 'Sem título',
    specialist: source.specialist || 'Desconhecido',
    url: source.url || null,
    ingestedAt: new Date().toISOString(),
    charCount: content.length,
  };

  console.log(`[MegaBrain] ✅ Estágio 1 — Ingestão: ${metadata.title} (${metadata.charCount} chars)`);
  return { content, metadata };
}

// ============================================================
// ESTÁGIO 2: CHUNKING & CANONICALIZAÇÃO
// ============================================================

/**
 * Quebra o conteúdo em chunks semânticos e corrige erros de transcrição.
 * @param {string} content
 * @param {Object} metadata
 * @param {number} [chunkSize=800]
 * @returns {Chunk[]}
 */
function stage2_chunkAndCanonicalize(content, metadata, chunkSize = 800) {
  // Divide em parágrafos primeiro, depois agrupa em chunks por tamanho
  const paragraphs = content
    .split(/\n{2,}/)
    .map(p => p.replace(/\s+/g, ' ').trim())
    .filter(p => p.length > 20);

  const chunks = [];
  let currentChunk = '';
  let chunkIndex = 0;

  for (const para of paragraphs) {
    if (currentChunk.length + para.length > chunkSize && currentChunk.length > 0) {
      chunks.push({
        id: `chunk_${chunkIndex++}`,
        text: currentChunk.trim(),
        source: metadata.title,
        specialist: metadata.specialist,
      });
      currentChunk = '';
    }
    currentChunk += (currentChunk ? '\n\n' : '') + para;
  }

  if (currentChunk.trim().length > 0) {
    chunks.push({
      id: `chunk_${chunkIndex}`,
      text: currentChunk.trim(),
      source: metadata.title,
      specialist: metadata.specialist,
    });
  }

  console.log(`[MegaBrain] ✅ Estágio 2 — Chunking: ${chunks.length} chunks gerados`);
  return chunks;
}

// ============================================================
// ESTÁGIO 3: EXTRAÇÃO DE INSIGHTS
// ============================================================

/**
 * Categorias de insights e palavras-chave associadas para extração heurística.
 */
const INSIGHT_KEYWORDS = {
  philosophy: [
    // PT
    'acredito', 'princípio', 'valor', 'crença', 'filosofia', 'propósito', 'missão', 'visão',
    // EN
    'believe', 'principle', 'value', 'belief', 'philosophy', 'purpose', 'mission', 'vision', 'mindset',
  ],
  mental_model: [
    // PT
    'modelo', 'framework', 'sistema', 'estrutura', 'processo', 'método', 'abordagem', 'como eu penso',
    // EN
    'model', 'framework', 'system', 'structure', 'process', 'method', 'approach', 'thinking', 'strategy',
  ],
  heuristic: [
    // PT
    'regra', 'atalho', 'sempre', 'nunca', 'se...então', 'quando', 'heurística', 'padrão',
    // EN
    'rule', 'shortcut', 'always', 'never', 'if you', 'when you', 'heuristic', 'pattern', 'hack',
  ],
  framework: [
    // PT
    'passo', 'etapa', 'fase', 'metodologia', 'processo', 'checklist', 'protocolo',
    // EN
    'step', 'stage', 'phase', 'methodology', 'checklist', 'protocol', 'formula', 'blueprint',
  ],
  methodology: [
    // PT
    'implementar', 'executar', 'aplicar', 'passo a passo', 'prático', 'ação', 'resultado',
    // EN
    'implement', 'execute', 'apply', 'step by step', 'practical', 'action', 'result', 'how to', 'achieve',
  ],
};

/**
 * Extrai insights categorizados dos chunks.
 * @param {Chunk[]} chunks
 * @returns {Insight[]}
 */
function stage3_extractInsights(chunks) {
  const insights = [];

  for (const chunk of chunks) {
    const text = chunk.text.toLowerCase();

    for (const [category, keywords] of Object.entries(INSIGHT_KEYWORDS)) {
      const matchedKeywords = keywords.filter(kw => text.includes(kw));
      if (matchedKeywords.length >= 1) {
        // Extrai a primeira frase do chunk como título
        const firstSentence = chunk.text.split(/[.!?]/)[0].trim().slice(0, 100);

        insights.push({
          category,
          title: firstSentence || chunk.id,
          description: chunk.text,
          evidence: [chunk.text.slice(0, 200)],
          specialist: chunk.specialist,
        });
      }
    }
  }

  console.log(`[MegaBrain] ✅ Estágio 3 — Insights: ${insights.length} insights extraídos`);
  return insights;
}

// ============================================================
// ESTÁGIO 4: COMPILAÇÃO DE DOSSIER
// ============================================================

/**
 * Compila os insights em um dossier estruturado por categorias.
 * Cruza temas entre especialistas para criar base de conhecimento híbrida.
 * @param {Insight[]} insights
 * @param {Object} metadata
 * @returns {Object}
 */
function stage4_compileDossier(insights, metadata) {
  const dossier = {
    specialist: metadata.specialist,
    title: metadata.title,
    createdAt: new Date().toISOString(),
    philosophy: [],
    mentalModels: [],
    heuristics: [],
    frameworks: [],
    methodologies: [],
    crossReferences: [],
  };

  const categoryMap = {
    philosophy: 'philosophy',
    mental_model: 'mentalModels',
    heuristic: 'heuristics',
    framework: 'frameworks',
    methodology: 'methodologies',
  };

  for (const insight of insights) {
    const key = categoryMap[insight.category];
    if (key && dossier[key]) {
      dossier[key].push({
        title: insight.title,
        description: insight.description,
        evidence: insight.evidence,
      });
    }
  }

  // Identifica cross-references (insights que aparecem em múltiplas categorias)
  const titleFrequency = {};
  for (const insight of insights) {
    const words = insight.title.split(' ').slice(0, 3).join(' ');
    titleFrequency[words] = (titleFrequency[words] || 0) + 1;
  }

  dossier.crossReferences = Object.entries(titleFrequency)
    .filter(([, count]) => count > 1)
    .map(([theme, count]) => ({ theme, count }));

  const totalInsights = Object.values(categoryMap).reduce(
    (sum, key) => sum + (dossier[key] ? dossier[key].length : 0),
    0,
  );
  console.log(`[MegaBrain] ✅ Estágio 4 — Dossier: ${totalInsights} insights compilados, ${dossier.crossReferences.length} cross-refs`);
  return dossier;
}

// ============================================================
// ESTÁGIO 5: ENRIQUECIMENTO DE AGENTES
// ============================================================

/**
 * Prepara o payload de enriquecimento para atualizar clones existentes.
 * @param {Object} dossier
 * @param {Object} metadata
 * @returns {Object}
 */
function stage5_enrichAgents(dossier, metadata) {
  const enrichment = {
    source: {
      type: metadata.type,
      title: metadata.title,
      specialist: metadata.specialist,
      url: metadata.url,
      processedAt: new Date().toISOString(),
    },
    newKnowledge: {
      philosophies: dossier.philosophy.length,
      mentalModels: dossier.mentalModels.length,
      heuristics: dossier.heuristics.length,
      frameworks: dossier.frameworks.length,
      methodologies: dossier.methodologies.length,
    },
    readyForClones: true,
    cloneUpdatePayload: dossier,
  };

  console.log(`[MegaBrain] ✅ Estágio 5 — Enriquecimento: payload pronto para ${metadata.specialist}`);
  return enrichment;
}

// ============================================================
// FUNÇÃO PRINCIPAL DO PIPELINE
// ============================================================

/**
 * Executa o pipeline completo do Mega Brain em 5 estágios.
 * @param {RawSource} source - Fonte bruta de dados
 * @param {Object} [options]
 * @param {number} [options.chunkSize=800] - Tamanho máximo de cada chunk
 * @returns {Promise<DossierResult>}
 */
async function runMegaBrainPipeline(source, options = {}) {
  const { chunkSize = 800 } = options;
  const errors = [];

  console.log('[MegaBrain] 🚀 Iniciando pipeline de 5 estágios...');

  // Estágio 1
  let ingested;
  try {
    ingested = stage1_ingest(source);
  } catch (err) {
    throw new Error(`[MegaBrain] Falha no Estágio 1 (Ingestão): ${err.message}`);
  }

  // Estágio 2
  let chunks = [];
  try {
    chunks = stage2_chunkAndCanonicalize(ingested.content, ingested.metadata, chunkSize);
  } catch (err) {
    errors.push({ stage: 2, error: err.message });
    console.error(`[MegaBrain] ⚠️ Erro no Estágio 2: ${err.message}`);
  }

  // Estágio 3
  let insights = [];
  try {
    insights = stage3_extractInsights(chunks);
  } catch (err) {
    errors.push({ stage: 3, error: err.message });
    console.error(`[MegaBrain] ⚠️ Erro no Estágio 3: ${err.message}`);
  }

  // Estágio 4
  let dossier = {};
  try {
    dossier = stage4_compileDossier(insights, ingested.metadata);
  } catch (err) {
    errors.push({ stage: 4, error: err.message });
    console.error(`[MegaBrain] ⚠️ Erro no Estágio 4: ${err.message}`);
  }

  // Estágio 5
  let enrichment = {};
  try {
    enrichment = stage5_enrichAgents(dossier, ingested.metadata);
  } catch (err) {
    errors.push({ stage: 5, error: err.message });
    console.error(`[MegaBrain] ⚠️ Erro no Estágio 5: ${err.message}`);
  }

  console.log(`[MegaBrain] ✨ Pipeline concluído. Erros: ${errors.length}`);

  return {
    chunks,
    insights,
    dossier,
    enrichment,
    metadata: {
      ...ingested.metadata,
      pipelineErrors: errors,
      completedAt: new Date().toISOString(),
    },
  };
}

module.exports = {
  runMegaBrainPipeline,
  // Funções de estágio exportadas para testes unitários
  stage1_ingest,
  stage2_chunkAndCanonicalize,
  stage3_extractInsights,
  stage4_compileDossier,
  stage5_enrichAgents,
};
