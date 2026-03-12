'use strict';

/**
 * tests/packages/clones/content-reader.test.js
 *
 * Testes unitários para o Content Reader (CLONE-005)
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const {
  readContent,
  detectInputType,
  extractMarkdownFrontmatter,
  readFromText,
  readFromFile,
} = require('../../../packages/clones/content-reader');

// ============================================================
// detectInputType
// ============================================================

describe('detectInputType', () => {
  test('detecta URL HTTP', () => {
    expect(detectInputType('http://exemplo.com/artigo')).toBe('url');
  });

  test('detecta URL HTTPS', () => {
    expect(detectInputType('https://exemplo.com/artigo')).toBe('url');
  });

  test('detecta arquivo .txt', () => {
    expect(detectInputType('/home/user/livro.txt')).toBe('file');
  });

  test('detecta arquivo .md', () => {
    expect(detectInputType('./conteudo/hormozi.md')).toBe('file');
  });

  test('detecta texto direto (sem extension e sem protocolo)', () => {
    // texto com mais de 50 chars sem URL ou path com extensão .txt/.md
    expect(detectInputType('Nunca ofereça desconto sem contrapartida. Isso destrói valor percebido.')).toBe('text');
  });

  test('lança erro se input não é string', () => {
    expect(() => detectInputType(42)).toThrow('[ContentReader] input deve ser uma string');
  });
});

// ============================================================
// extractMarkdownFrontmatter
// ============================================================

describe('extractMarkdownFrontmatter', () => {
  test('extrai title e specialist do frontmatter', () => {
    const md = `---
title: $100M Offers
specialist: Alex Hormozi
---
Conteúdo do livro aqui.`;

    const result = extractMarkdownFrontmatter(md);
    expect(result.title).toBe('$100M Offers');
    expect(result.specialist).toBe('Alex Hormozi');
    expect(result.body).toContain('Conteúdo do livro aqui.');
  });

  test('retorna apenas body se não há frontmatter', () => {
    const md = 'Texto simples sem frontmatter.';
    const result = extractMarkdownFrontmatter(md);
    expect(result.title).toBeUndefined();
    expect(result.specialist).toBeUndefined();
    expect(result.body).toBe(md);
  });

  test('frontmatter parcial — só title', () => {
    const md = `---
title: Meu Livro
---
Conteúdo.`;
    const result = extractMarkdownFrontmatter(md);
    expect(result.title).toBe('Meu Livro');
    expect(result.specialist).toBeUndefined();
  });
});

// ============================================================
// readFromText
// ============================================================

describe('readFromText', () => {
  test('retorna RawSource com type="text"', () => {
    const text = 'Nunca ofereça desconto sem contrapartida. Isso destrói o valor percebido pelo cliente.';
    const result = readFromText(text, { specialist: 'Hormozi', title: 'Regra de Ouro' });

    expect(result.type).toBe('text');
    expect(result.content).toBe(text);
    expect(result.specialist).toBe('Hormozi');
    expect(result.title).toBe('Regra de Ouro');
    expect(result.url).toBeNull();
  });

  test('usa defaults quando options não fornecidas', () => {
    const text = 'Texto longo o suficiente para passar na validação mínima de cinquenta caracteres aqui.';
    const result = readFromText(text, {});

    expect(result.title).toBe('Texto Direto');
    expect(result.specialist).toBe('Desconhecido');
  });

  test('lança erro se texto muito curto', () => {
    expect(() => readFromText('Curto', {})).toThrow('[ContentReader] Texto direto muito curto');
  });
});

// ============================================================
// readFromFile
// ============================================================

describe('readFromFile', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'content-reader-test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('lê arquivo .txt e retorna RawSource correto', () => {
    const filePath = path.join(tempDir, 'hormozi.txt');
    fs.writeFileSync(filePath, 'Nunca faça desconto. Sempre entregue valor excepcional antes de cobrar.');

    const result = readFromFile(filePath, { specialist: 'Alex Hormozi' });

    expect(result.type).toBe('file');
    expect(result.content).toContain('Nunca faça desconto');
    expect(result.specialist).toBe('Alex Hormozi');
    expect(result.title).toBe('hormozi');
  });

  test('lê arquivo .md e extrai frontmatter automaticamente', () => {
    const filePath = path.join(tempDir, 'livro.md');
    const mdContent = `---
title: $100M Offers
specialist: Alex Hormozi
---
## Capítulo 1 — O Problema do Preço

Nunca ofereça desconto. Crie uma oferta tão boa que o preço pareça irrelevante.`;
    fs.writeFileSync(filePath, mdContent);

    const result = readFromFile(filePath, {});

    expect(result.type).toBe('file');
    expect(result.title).toBe('$100M Offers');
    expect(result.specialist).toBe('Alex Hormozi');
    expect(result.content).toContain('Nunca ofereça desconto');
    expect(result.content).not.toContain('---');
  });

  test('options sobrescrevem frontmatter do .md', () => {
    const filePath = path.join(tempDir, 'override.md');
    fs.writeFileSync(filePath, `---
title: Título Original
specialist: Especialista Original
---
Conteúdo aqui presente e suficiente para o teste.`);

    const result = readFromFile(filePath, { specialist: 'Novo Especialista', title: 'Novo Título' });

    expect(result.specialist).toBe('Novo Especialista');
    expect(result.title).toBe('Novo Título');
  });

  test('lança erro se arquivo não existe', () => {
    expect(() => readFromFile('/caminho/inexistente/arquivo.txt', {}))
      .toThrow('[ContentReader] Arquivo não encontrado');
  });

  test('lança erro se arquivo está vazio', () => {
    const filePath = path.join(tempDir, 'vazio.txt');
    fs.writeFileSync(filePath, '');

    expect(() => readFromFile(filePath, {})).toThrow('[ContentReader] Arquivo vazio');
  });
});

// ============================================================
// readContent — função principal (sans network)
// ============================================================

describe('readContent', () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'content-reader-main-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  test('processa texto direto', async () => {
    const result = await readContent(
      'Sempre leve o cliente a sentir que está ganhando mais do que pagando. Esta é a regra número um.',
      { specialist: 'Hormozi' },
    );
    expect(result.type).toBe('text');
    expect(result.specialist).toBe('Hormozi');
  });

  test('processa arquivo .txt', async () => {
    const filePath = path.join(tempDir, 'fonte.txt');
    fs.writeFileSync(filePath, 'O modelo de negócio ideal resolve um problema urgente, difundido e custoso para o cliente.');

    const result = await readContent(filePath, { specialist: 'Drucker' });
    expect(result.type).toBe('file');
    expect(result.specialist).toBe('Drucker');
  });

  test('processa arquivo .md com frontmatter', async () => {
    const filePath = path.join(tempDir, 'fonte.md');
    fs.writeFileSync(filePath, `---
title: Gestão por Objetivos
specialist: Peter Drucker
---
O gerente eficaz define metas claras e mensuráveis para sua equipe.`);

    const result = await readContent(filePath, {});
    expect(result.type).toBe('file');
    expect(result.title).toBe('Gestão por Objetivos');
    expect(result.specialist).toBe('Peter Drucker');
  });

  test('lança erro para input vazio', async () => {
    await expect(readContent('')).rejects.toThrow('[ContentReader]');
  });

  test('lança erro para input não-string', async () => {
    await expect(readContent(null)).rejects.toThrow('[ContentReader]');
  });

  test('URL malformada lança erro descritivo', async () => {
    // Forçamos detectInputType a reconhecer como url mas url inválida
    // Nota: "http://" é URL pattern mas inválida para new URL()
    await expect(readContent('http://', {})).rejects.toThrow('[ContentReader]');
  });
});
