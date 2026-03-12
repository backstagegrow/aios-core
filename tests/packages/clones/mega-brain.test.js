/**
 * tests/packages/clones/mega-brain.test.js
 *
 * Testes unitários para o módulo Mega Brain
 */

'use strict';

const {
  runMegaBrainPipeline,
  stage1_ingest,
  stage2_chunkAndCanonicalize,
  stage3_extractInsights,
  stage4_compileDossier,
  stage5_enrichAgents,
} = require('../../../packages/clones/mega-brain');

// ============================================================
// FIXTURES
// ============================================================

const SAMPLE_SOURCE = {
  type: 'transcript',
  title: 'Mentoria Hormozi — Construção de Oferta',
  specialist: 'Alex Hormozi',
  url: 'https://example.com/hormozi',
  content: `A oferta é o princípio mais importante do negócio.

Quando você cria uma oferta irresistível, o cliente não consegue dizer não. Acredito que toda oferta deve resolver um problema real de forma clara e mensurável.

O modelo mental que uso é: Valor percebido deve superar Preço pedido em pelo menos 10x.

Se o cliente hesita, a oferta não está boa o suficiente. Sempre vejo hesitação como feedback do mercado, não como objeção pessoal.

Metodologia em 4 passos:
1. Identifique o problema real do cliente
2. Crie uma solução que remove o risco
3. Adicione garantias mensuráveis
4. Precio baseado em valor entregue

Nunca ofereça desconto sem retirar algo da oferta. O preço é um sinal de qualidade.`,
};

// ============================================================
// TESTES: ESTÁGIO 1 — INGESTÃO
// ============================================================

describe('Mega Brain — Estágio 1: Ingestão', () => {
  test('deve retornar content e metadata para uma fonte válida', () => {
    const result = stage1_ingest(SAMPLE_SOURCE);

    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('metadata');
    expect(typeof result.content).toBe('string');
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.metadata.specialist).toBe('Alex Hormozi');
    expect(result.metadata.type).toBe('transcript');
    expect(result.metadata.ingestedAt).toBeDefined();
  });

  test('deve lançar erro se source.content estiver ausente', () => {
    expect(() => stage1_ingest({ type: 'pdf' })).toThrow('[MegaBrain] Estágio 1: source.content é obrigatório');
  });

  test('deve lançar erro se source for null', () => {
    expect(() => stage1_ingest(null)).toThrow();
  });

  test('deve usar valores padrão quando campos opcionais estiverem ausentes', () => {
    const result = stage1_ingest({ content: 'texto simples' });
    expect(result.metadata.specialist).toBe('Desconhecido');
    expect(result.metadata.title).toBe('Sem título');
    expect(result.metadata.type).toBe('unknown');
  });
});

// ============================================================
// TESTES: ESTÁGIO 2 — CHUNKING
// ============================================================

describe('Mega Brain — Estágio 2: Chunking', () => {
  test('deve gerar pelo menos 1 chunk a partir de conteúdo válido', () => {
    const { content, metadata } = stage1_ingest(SAMPLE_SOURCE);
    const chunks = stage2_chunkAndCanonicalize(content, metadata);

    expect(Array.isArray(chunks)).toBe(true);
    expect(chunks.length).toBeGreaterThan(0);
  });

  test('cada chunk deve ter id, text, source e specialist', () => {
    const { content, metadata } = stage1_ingest(SAMPLE_SOURCE);
    const chunks = stage2_chunkAndCanonicalize(content, metadata);

    for (const chunk of chunks) {
      expect(chunk).toHaveProperty('id');
      expect(chunk).toHaveProperty('text');
      expect(chunk).toHaveProperty('source');
      expect(chunk).toHaveProperty('specialist');
      expect(typeof chunk.text).toBe('string');
      expect(chunk.text.length).toBeGreaterThan(0);
    }
  });

  test('deve respeitar o tamanho máximo de chunk', () => {
    const { content, metadata } = stage1_ingest(SAMPLE_SOURCE);
    const chunkSize = 200;
    const chunks = stage2_chunkAndCanonicalize(content, metadata, chunkSize);

    for (const chunk of chunks) {
      // Pequena margem: o tamanho pode ultrapassar levemente por quebra de parágrafo
      expect(chunk.text.length).toBeLessThanOrEqual(chunkSize * 2);
    }
  });
});

// ============================================================
// TESTES: ESTÁGIO 3 — EXTRAÇÃO DE INSIGHTS
// ============================================================

describe('Mega Brain — Estágio 3: Extração de Insights', () => {
  test('deve retornar um array (pode ser vazio para conteúdo sem palavras-chave)', () => {
    const chunks = [{ id: 'c0', text: 'Texto genérico sem palavras-chave específicas.', source: 'test', specialist: 'Test' }];
    const insights = stage3_extractInsights(chunks);
    expect(Array.isArray(insights)).toBe(true);
  });

  test('cada insight deve ter category, title, description e evidence', () => {
    const { content, metadata } = stage1_ingest(SAMPLE_SOURCE);
    const chunks = stage2_chunkAndCanonicalize(content, metadata);
    const insights = stage3_extractInsights(chunks);

    if (insights.length > 0) {
      for (const insight of insights) {
        expect(insight).toHaveProperty('category');
        expect(insight).toHaveProperty('title');
        expect(insight).toHaveProperty('description');
        expect(insight).toHaveProperty('evidence');
        expect(Array.isArray(insight.evidence)).toBe(true);
      }
    }
  });
});

// ============================================================
// TESTES: ESTÁGIO 4 — COMPILAÇÃO DE DOSSIER
// ============================================================

describe('Mega Brain — Estágio 4: Compilação de Dossier', () => {
  test('deve retornar dossier com todas as categorias', () => {
    const { content, metadata } = stage1_ingest(SAMPLE_SOURCE);
    const chunks = stage2_chunkAndCanonicalize(content, metadata);
    const insights = stage3_extractInsights(chunks);
    const dossier = stage4_compileDossier(insights, metadata);

    expect(dossier).toHaveProperty('specialist', 'Alex Hormozi');
    expect(dossier).toHaveProperty('philosophy');
    expect(dossier).toHaveProperty('mentalModels');
    expect(dossier).toHaveProperty('heuristics');
    expect(dossier).toHaveProperty('frameworks');
    expect(dossier).toHaveProperty('methodologies');
    expect(dossier).toHaveProperty('crossReferences');
  });

  test('todos os campos de categoria devem ser arrays', () => {
    const { content, metadata } = stage1_ingest(SAMPLE_SOURCE);
    const chunks = stage2_chunkAndCanonicalize(content, metadata);
    const insights = stage3_extractInsights(chunks);
    const dossier = stage4_compileDossier(insights, metadata);

    for (const key of ['philosophy', 'mentalModels', 'heuristics', 'frameworks', 'methodologies', 'crossReferences']) {
      expect(Array.isArray(dossier[key])).toBe(true);
    }
  });
});

// ============================================================
// TESTES: ESTÁGIO 5 — ENRIQUECIMENTO
// ============================================================

describe('Mega Brain — Estágio 5: Enriquecimento', () => {
  test('deve retornar payload de enriquecimento com readyForClones=true', () => {
    const { content, metadata } = stage1_ingest(SAMPLE_SOURCE);
    const chunks = stage2_chunkAndCanonicalize(content, metadata);
    const insights = stage3_extractInsights(chunks);
    const dossier = stage4_compileDossier(insights, metadata);
    const enrichment = stage5_enrichAgents(dossier, metadata);

    expect(enrichment.readyForClones).toBe(true);
    expect(enrichment).toHaveProperty('source');
    expect(enrichment).toHaveProperty('newKnowledge');
    expect(enrichment).toHaveProperty('cloneUpdatePayload');
  });
});

// ============================================================
// TESTES: PIPELINE COMPLETO
// ============================================================

describe('Mega Brain — Pipeline Completo', () => {
  test('deve executar o pipeline completo sem erros fatais', async () => {
    const result = await runMegaBrainPipeline(SAMPLE_SOURCE);

    expect(result).toHaveProperty('chunks');
    expect(result).toHaveProperty('insights');
    expect(result).toHaveProperty('dossier');
    expect(result).toHaveProperty('enrichment');
    expect(result).toHaveProperty('metadata');
    expect(Array.isArray(result.chunks)).toBe(true);
    expect(Array.isArray(result.insights)).toBe(true);
    expect(Array.isArray(result.metadata.pipelineErrors)).toBe(true);
  });

  test('deve lançar erro se source.content estiver ausente', async () => {
    await expect(runMegaBrainPipeline({ type: 'video' })).rejects.toThrow('[MegaBrain] Falha no Estágio 1');
  });

  test('deve aceitar opção chunkSize personalizada', async () => {
    const result = await runMegaBrainPipeline(SAMPLE_SOURCE, { chunkSize: 150 });
    expect(Array.isArray(result.chunks)).toBe(true);
    expect(result.chunks.length).toBeGreaterThan(0);
  });
});
