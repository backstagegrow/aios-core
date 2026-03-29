#!/usr/bin/env node
'use strict';

/**
 * Nível 3 — Extração inteligente de DNA via síntese estruturada.
 * Gera Q&A, cenários, expansões e aplicações práticas a partir do YAML.
 * Sem chamadas de LLM externo — puro processamento do DNA existente.
 *
 * Uso: node packages/clones/cli/batch-improve-level3.cjs
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.resolve(__dirname, '../../..');
const CLI = path.join(ROOT, 'packages/clones/cli/index.cjs');
const EXPERTS_DIR = path.join(ROOT, 'experts');

const EXPERT_MAP = {
  alex_hormozi:    'Alex Hormozi',
  charlie_munger:  'Charlie Munger',
  chris_do:        'Chris Do',
  depesh_mandalia: 'Depesh Mandalia',
  eli_goldratt:    'Eli Goldratt',
  eugene_schwartz: 'Eugene Schwartz',
  kasim_aslam:     'Kasim Aslam',
  marty_neumeier:  'Marty Neumeier',
  nassim_taleb:    'Nassim Taleb',
  robert_mckee:    'Robert McKee',
  russell_brunson: 'Russell Brunson',
  stefan_georgi:   'Stefan Georgi',
  tallis_gomes:    'Tallis Gomes',
  thiago_finch:    'Thiago Finch',
  todd_brown:      'Todd Brown',
  tom_breeze:      'Tom Breeze',
};

/**
 * Extrai bloco YAML por chave raiz (ex: "system_prompt", "calibration_questions")
 */
function extractBlock(yaml, key) {
  const lines = yaml.split('\n');
  let inBlock = false;
  let result = [];
  let baseIndent = null;

  for (const line of lines) {
    if (!inBlock) {
      if (line.match(new RegExp(`^${key}:`))) {
        inBlock = true;
      }
      continue;
    }
    if (line.trim() === '') { result.push(''); continue; }
    const indent = (line.match(/^(\s*)/) || ['', ''])[1].length;
    if (baseIndent === null) baseIndent = indent;
    if (indent < baseIndent) break;
    result.push(line.slice(baseIndent));
  }
  return result.join('\n').trim();
}

/**
 * Extrai lista YAML (linhas começando com "  - ")
 */
function extractList(yaml, key) {
  const lines = yaml.split('\n');
  let inSection = false;
  const items = [];

  for (const line of lines) {
    if (line.match(new RegExp(`^${key}:`))) { inSection = true; continue; }
    if (!inSection) continue;
    if (line.match(/^[a-z_]+:/) && !line.match(/^\s/)) break;
    const m = line.match(/^\s*-\s+"?(.+?)"?\s*$/);
    if (m) items.push(m[1].replace(/^["']|["']$/g, '').trim());
  }
  return items;
}

/**
 * Extrai seções H2/H3 do system_prompt como frameworks individuais
 */
function extractFrameworks(systemPrompt) {
  const sections = [];
  let current = null;

  for (const line of systemPrompt.split('\n')) {
    if (line.match(/^## /)) {
      if (current) sections.push(current);
      current = { title: line.replace(/^## /, '').trim(), lines: [] };
    } else if (line.match(/^### /) && current) {
      current.lines.push(line);
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);
  return sections;
}

/**
 * Gera documento de Q&A a partir das calibration_questions + DNA
 */
function generateQADoc(expertName, calibrationQuestions, systemPrompt) {
  if (!calibrationQuestions || calibrationQuestions.length === 0) return null;

  const lines = [
    `# Q&A Sintético — ${expertName}`,
    `# Perguntas de calibração respondidas com o DNA documentado`,
    '',
  ];

  for (const question of calibrationQuestions) {
    lines.push(`## Pergunta: ${question}`);
    lines.push('');
    lines.push(`*Esta é uma pergunta de calibração para ${expertName}.*`);
    lines.push('');

    // Busca trechos relevantes do system_prompt por palavras-chave da pergunta
    const keywords = question.toLowerCase()
      .replace(/[?!.,]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 4);

    const promptLines = systemPrompt.split('\n');
    const relevant = [];

    for (let i = 0; i < promptLines.length; i++) {
      const lineLower = promptLines[i].toLowerCase();
      if (keywords.some(kw => lineLower.includes(kw))) {
        // Captura bloco de contexto ao redor da linha
        const start = Math.max(0, i - 1);
        const end = Math.min(promptLines.length - 1, i + 4);
        const block = promptLines.slice(start, end + 1).join('\n').trim();
        if (block.length > 20 && !relevant.includes(block)) {
          relevant.push(block);
        }
      }
    }

    if (relevant.length > 0) {
      lines.push('**DNA relevante:**');
      lines.push('');
      for (const r of relevant.slice(0, 3)) {
        lines.push(r);
        lines.push('');
      }
    }
    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Gera documento de cenários "Se/Quando → Então"
 */
function generateScenariosDoc(expertName, systemPrompt) {
  const lines = [
    `# Cenários de Aplicação — ${expertName}`,
    `# Quando usar cada framework e princípio`,
    '',
  ];

  const frameworks = extractFrameworks(systemPrompt);
  let count = 0;

  for (const fw of frameworks) {
    if (fw.lines.length < 2) continue;
    const content = fw.lines.join('\n').trim();
    if (content.length < 50) continue;

    lines.push(`## Quando aplicar: ${fw.title}`);
    lines.push('');
    lines.push(content);
    lines.push('');
    count++;
  }

  if (count === 0) return null;
  return lines.join('\n');
}

/**
 * Gera documento de princípios expandidos com contexto de aplicação
 */
function generatePrinciplesDoc(expertName, systemPrompt) {
  const principleSection = systemPrompt.match(/##\s*PRINCÍPIOS[\s\S]*?(?=\n##|\n#[^#]|$)/i)?.[0];
  if (!principleSection) return null;

  const lines = [
    `# Princípios Fundamentais Expandidos — ${expertName}`,
    `# Os princípios inegociáveis e como aplicá-los`,
    '',
    principleSection,
    '',
  ];

  // Extrai princípios numerados e cria expansões
  const principleLines = principleSection.split('\n');
  const numbered = principleLines.filter(l => l.match(/^\s*\d+\./));

  if (numbered.length > 0) {
    lines.push('## Aplicações Práticas dos Princípios');
    lines.push('');
    for (const p of numbered) {
      const clean = p.replace(/^\s*\d+\.\s*/, '').trim();
      if (clean.length > 10) {
        lines.push(`### Princípio: ${clean}`);
        lines.push('');
        lines.push(`Este princípio de ${expertName} deve ser aplicado em decisões de negócio, estratégia e execução.`);
        lines.push('');
      }
    }
  }

  return lines.join('\n');
}

// ─── Main ────────────────────────────────────────────────────────────────────

let done = 0;
let failed = 0;
let noData = 0;
const tmpFiles = [];

console.log(`\n${'='.repeat(58)}`);
console.log(' NÍVEL 3 — Síntese Inteligente de DNA (sem LLM externo)');
console.log(`${'='.repeat(58)}\n`);

for (const [slug, name] of Object.entries(EXPERT_MAP)) {
  const yamlPath = path.join(EXPERTS_DIR, slug, `clone_${slug}.yaml`);
  if (!fs.existsSync(yamlPath)) {
    console.log(`⚠️  ${name} — YAML não encontrado`);
    noData++;
    continue;
  }

  const yaml = fs.readFileSync(yamlPath, 'utf-8');
  const systemPrompt = extractBlock(yaml, 'system_prompt');
  const calibrationQuestions = extractList(yaml, 'calibration_questions');

  if (!systemPrompt || systemPrompt.length < 100) {
    console.log(`⚪ ${name} — system_prompt vazio`);
    noData++;
    continue;
  }

  console.log(`\n→ ${name}`);

  const docs = [
    { label: 'Q&A',        text: generateQADoc(name, calibrationQuestions, systemPrompt) },
    { label: 'Cenários',   text: generateScenariosDoc(name, systemPrompt) },
    { label: 'Princípios', text: generatePrinciplesDoc(name, systemPrompt) },
  ].filter(d => d.text && d.text.trim().length > 150);

  if (docs.length === 0) {
    console.log(`  ⚪ Nenhum documento gerado`);
    noData++;
    continue;
  }

  let expertOk = true;
  for (const doc of docs) {
    const tmpPath = path.join(os.tmpdir(), `level3_${slug}_${doc.label.toLowerCase()}.md`);
    fs.writeFileSync(tmpPath, doc.text, 'utf-8');
    tmpFiles.push(tmpPath);

    process.stdout.write(`  [${doc.label}]... `);
    try {
      const out = execSync(
        `node "${CLI}" improve "${name}" --source="${tmpPath}"`,
        { cwd: ROOT, timeout: 60000, encoding: 'utf-8', stdio: 'pipe' }
      );
      const m = out.match(/Chunks:\s+(\d+)/);
      console.log(`✅ chunks: ${m ? m[1] : '?'}`);
      done++;
    } catch (err) {
      const msg = (err.stdout || err.message || '').slice(0, 60);
      console.log(`❌ ${msg}`);
      failed++;
      expertOk = false;
    }
  }
}

// Cleanup
for (const f of tmpFiles) {
  try { fs.unlinkSync(f); } catch {}
}

console.log(`\n${'='.repeat(58)}`);
console.log(` CONCLUÍDO: ${done} docs OK | ${failed} falhas | ${noData} sem dados`);
console.log(`${'='.repeat(58)}\n`);
