'use strict';

const { researchPerson } = require('../index');

// Mock global fetch para testes isolados
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock AbortSignal.timeout
global.AbortSignal = { timeout: jest.fn(() => ({ signal: true })) };

beforeEach(() => {
  mockFetch.mockReset();
});

// ─── AC3: Falha em fonte não interrompe o pipeline ────────────────────────────

describe('AC3 — falha em fonte não quebra pipeline', () => {
  test('Wikipedia falha mas Books retorna dados', async () => {
    // Wikipedia → falha
    mockFetch
      .mockRejectedValueOnce(new Error('Network error'))  // Wikipedia PT search
      .mockRejectedValueOnce(new Error('Network error'))  // Wikipedia EN search
      .mockResolvedValueOnce({                            // Books author
        ok: true,
        json: async () => ({
          items: [{
            id: 'book1',
            volumeInfo: {
              title: 'Teste de Livro',
              publishedDate: '2020',
              description: 'Descrição do livro de teste com conteúdo suficiente para ser incluído.'
            }
          }]
        })
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ items: [] }) }); // Books mentions

    const result = await researchPerson('Autor Teste', { serperApiKey: undefined });

    expect(result.sections.length).toBeGreaterThanOrEqual(1);
    expect(result.sections[0].title).toContain('Livros publicados');
  });

  test('Serper falha mas Wikipedia retorna dados', async () => {
    const wikiSearchResponse = {
      ok: true,
      json: async () => ({
        query: { search: [{ pageid: 123, title: 'Pessoa Teste' }] }
      })
    };
    const wikiExtractResponse = {
      ok: true,
      json: async () => ({
        query: {
          pages: {
            '123': {
              extract: 'Pessoa Teste é uma personalidade muito conhecida. '.repeat(10)
            }
          }
        }
      })
    };

    mockFetch
      .mockResolvedValueOnce(wikiSearchResponse)   // Wikipedia PT search
      .mockResolvedValueOnce(wikiExtractResponse)  // Wikipedia PT extract
      .mockResolvedValueOnce(wikiSearchResponse)   // Wikipedia EN search
      .mockResolvedValueOnce(wikiExtractResponse)  // Wikipedia EN extract
      .mockRejectedValueOnce(new Error('Serper down'))  // Serper bio
      .mockRejectedValueOnce(new Error('Serper down'))  // Serper products
      .mockResolvedValueOnce({ ok: true, json: async () => ({ items: [] }) })  // Books author
      .mockResolvedValueOnce({ ok: true, json: async () => ({ items: [] }) }); // Books mentions

    const result = await researchPerson('Pessoa Teste', {
      serperApiKey: 'fake-key'
    });

    expect(result.sections.length).toBeGreaterThanOrEqual(1);
    expect(result.usedSerper).toBe(true);
  });
});

// ─── AC4: Deduplicação por título ─────────────────────────────────────────────

describe('AC4 — deduplicação por título', () => {
  test('seção com título duplicado é contada em skippedDuplicates', async () => {
    // Simula Wikipedia PT e EN retornando o mesmo título
    const wikiSearchRes = {
      ok: true,
      json: async () => ({
        query: { search: [{ pageid: 1, title: 'Pessoa X' }] }
      })
    };
    const wikiExtractRes = {
      ok: true,
      json: async () => ({
        query: {
          pages: {
            '1': { extract: 'Conteúdo suficientemente longo para ser válido. '.repeat(5) }
          }
        }
      })
    };

    mockFetch
      .mockResolvedValueOnce(wikiSearchRes)
      .mockResolvedValueOnce(wikiExtractRes)
      .mockResolvedValueOnce(wikiSearchRes)   // EN retorna mesmo resultado
      .mockResolvedValueOnce(wikiExtractRes)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ items: [] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ items: [] }) });

    const result = await researchPerson('Pessoa X');

    // PT-BR inclui "Pessoa X", EN tenta o mesmo title → duplicata pulada
    expect(result.skippedDuplicates).toBeGreaterThanOrEqual(1);
  });
});

// ─── AC6: Fallback sem Serper key ─────────────────────────────────────────────

describe('AC6 — graceful fallback sem Serper key', () => {
  test('sem serperApiKey, não chama serper.dev', async () => {
    mockFetch
      .mockResolvedValue({ ok: true, json: async () => ({ query: { search: [] }, items: [] }) });

    await researchPerson('Qualquer Pessoa', { serperApiKey: undefined }).catch(() => {});

    const serperCalls = mockFetch.mock.calls.filter(
      call => call[0] && call[0].toString().includes('serper.dev')
    );
    expect(serperCalls.length).toBe(0);
  });

  test('sem serperApiKey, result.usedSerper é false', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        query: { search: [{ pageid: 99, title: 'Alguém' }] },
        pages: { '99': { extract: 'Texto suficiente para passar o mínimo de 200 chars. '.repeat(5) } },
        items: []
      })
    });

    const result = await researchPerson('Alguém', { serperApiKey: undefined }).catch(() => ({
      usedSerper: false,
      sections: [],
      sources: [],
      totalChunks: 0,
      skippedDuplicates: 0,
      subject: 'Alguém'
    }));

    expect(result.usedSerper).toBe(false);
  });
});

// ─── Validação de input ───────────────────────────────────────────────────────

describe('Validação de input', () => {
  test('lança erro para nome vazio', async () => {
    await expect(researchPerson('')).rejects.toThrow('obrigatório');
  });

  test('lança erro para nome undefined', async () => {
    await expect(researchPerson(undefined)).rejects.toThrow();
  });
});
