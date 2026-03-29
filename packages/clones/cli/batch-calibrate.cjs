#!/usr/bin/env node
'use strict';

/**
 * Nível 4 — Calibração via perguntas do YAML.
 * Roda cada calibration_question contra o RAG do clone e avalia
 * a qualidade das respostas recuperadas.
 *
 * Uso: node packages/clones/cli/batch-calibrate.cjs [--expert=slug]
 *
 * Saída: packages/clones/calibration-report.json + sumário no console
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../..');
const RAG_QUERY = path.join(ROOT, 'packages/clones/rag-query.cjs');
const EXPERTS_DIR = path.join(ROOT, 'experts');
const REPORT_PATH = path.join(ROOT, 'packages/clones/calibration-report.json');

const EXPERT_MAP = {
  alex_hormozi:    { name: 'Alex Hormozi',    slug: 'alex-hormozi' },
  charlie_munger:  { name: 'Charlie Munger',   slug: 'charlie-munger' },
  chris_do:        { name: 'Chris Do',          slug: 'chris-do' },
  depesh_mandalia: { name: 'Depesh Mandalia',   slug: 'depesh-mandalia' },
  eli_goldratt:    { name: 'Eli Goldratt',      slug: 'eli-goldratt' },
  eugene_schwartz: { name: 'Eugene Schwartz',   slug: 'eugene-schwartz' },
  kasim_aslam:     { name: 'Kasim Aslam',       slug: 'kasim-aslam' },
  marty_neumeier:  { name: 'Marty Neumeier',    slug: 'marty-neumeier' },
  nassim_taleb:    { name: 'Nassim Taleb',       slug: 'nassim-taleb' },
  robert_mckee:    { name: 'Robert McKee',       slug: 'robert-mckee' },
  russell_brunson: { name: 'Russell Brunson',    slug: 'russell-brunson' },
  stefan_georgi:   { name: 'Stefan Georgi',      slug: 'stefan-georgi' },
  tallis_gomes:    { name: 'Tallis Gomes',       slug: 'tallis-gomes' },
  thiago_finch:    { name: 'Thiago Finch',       slug: 'thiago-finch' },
  todd_brown:      { name: 'Todd Brown',         slug: 'todd-brown' },
  tom_breeze:      { name: 'Tom Breeze',         slug: 'tom-breeze' },
};

// Filtro de expert via argumento --expert=slug
const expertFilter = process.argv.find(a => a.startsWith('--expert='))?.split('=')[1];

/**
 * Extrai calibration_questions do YAML
 */
function extractCalibrationQuestions(yaml) {
  const lines = yaml.split('\n');
  let inSection = false;
  const questions = [];

  for (const line of lines) {
    if (line.match(/^calibration_questions:/)) { inSection = true; continue; }
    if (!inSection) continue;
    if (line.match(/^[a-z_]+:/) && !line.match(/^\s/)) break;
    const m = line.match(/^\s*-\s+"?(.+?)"?\s*$/);
    if (m) questions.push(m[1].replace(/^["']|["']$/g, '').trim());
  }
  return questions;
}

/**
 * Extrai palavras-chave de uma pergunta (stopwords PT+EN removidas).
 * Simula como o agente Claude usa o RAG na prática.
 */
function extractKeywords(question) {
  const stopwords = new Set([
    'como','quando','qual','quais','por','que','o','a','os','as','um','uma',
    'de','do','da','dos','das','em','no','na','nos','nas','e','é','se','sua',
    'seu','para','com','sem','mais','menos','não','mas','ou','ao','aos','às',
    'ainda','já','também','muito','entre','sobre','isso','este','esta','esse',
    'essa','what','why','how','when','which','the','and','for','are','you',
    'your','that','this','with','from','have','has','its','not','but','can',
    'should','would','could','does','did','will','may','might','vs','versus',
    'meu','minha','seus','suas','devo','faz','faria','voce','você','numa',
  ]);

  return question
    .toLowerCase()
    .replace(/[?!.,;:'"()]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 4 && !stopwords.has(w))
    .slice(0, 8)
    .join(' ');
}

/**
 * Roda rag-query e retorna resultados parseados
 */
function runRagQuery(slug, query, topK = 5) {
  const keywords = extractKeywords(query);
  const searchQuery = keywords || query.slice(0, 60);

  try {
    const out = execSync(
      `node "${RAG_QUERY}" ${slug} "${searchQuery.replace(/"/g, "'")}" ${topK}`,
      { cwd: ROOT, timeout: 30000, encoding: 'utf-8', stdio: 'pipe' }
    );

    // Parseia chunks retornados — formato: "--- [N] score: XX.X% ---"
    const chunks = [];
    const chunkBlocks = out.match(/---\s*\[\d+\]\s*score:[\s\S]*?(?=---\s*\[|\n\n\n|$)/g) || [];

    for (const block of chunkBlocks) {
      const scoreMatch = block.match(/score:\s*([\d.]+)%/);
      const textMatch = block.match(/---\s*\n([\s\S]+)/);
      if (scoreMatch) {
        chunks.push({
          score: parseFloat(scoreMatch[1]) / 100,
          text: textMatch ? textMatch[1].trim().slice(0, 200) : '',
        });
      }
    }

    const noResults = out.includes('Nenhum resultado') || out.includes('No results') || chunks.length === 0;
    return { chunks, noResults, raw: out };
  } catch (err) {
    return { chunks: [], noResults: true, error: err.message, raw: '' };
  }
}

/**
 * Avalia qualidade da resposta RAG para uma pergunta
 */
function evaluateQuality(chunks) {
  if (chunks.length === 0) return { grade: 'F', score: 0, label: 'Sem contexto' };

  const avgScore = chunks.reduce((s, c) => s + c.score, 0) / chunks.length;
  const topScore = chunks[0]?.score || 0;
  const relevantCount = chunks.filter(c => c.score >= 0.35).length;

  if (topScore >= 0.70 && relevantCount >= 3) return { grade: 'A', score: avgScore, label: 'Excelente' };
  if (topScore >= 0.55 && relevantCount >= 2) return { grade: 'B', score: avgScore, label: 'Bom' };
  if (topScore >= 0.40 && relevantCount >= 1) return { grade: 'C', score: avgScore, label: 'Aceitável' };
  if (topScore >= 0.30)                       return { grade: 'D', score: avgScore, label: 'Fraco' };
  return { grade: 'F', score: avgScore, label: 'Insuficiente' };
}

// ─── Main ────────────────────────────────────────────────────────────────────

const report = {
  generated_at: new Date().toISOString(),
  experts: {},
  summary: { A: 0, B: 0, C: 0, D: 0, F: 0, total_questions: 0 },
};

const gradeEmoji = { A: '🟢', B: '🔵', C: '🟡', D: '🟠', F: '🔴' };

console.log(`\n${'='.repeat(60)}`);
console.log(' NÍVEL 4 — Calibração via Perguntas (RAG Quality Check)');
console.log(`${'='.repeat(60)}\n`);

const experts = Object.entries(EXPERT_MAP)
  .filter(([slug]) => !expertFilter || slug === expertFilter);

for (const [slug, { name, slug: expertSlug }] of experts) {
  const yamlPath = path.join(EXPERTS_DIR, slug, `clone_${slug}.yaml`);
  if (!fs.existsSync(yamlPath)) {
    console.log(`⚠️  ${name} — YAML não encontrado\n`);
    continue;
  }

  const yaml = fs.readFileSync(yamlPath, 'utf-8');
  const questions = extractCalibrationQuestions(yaml);

  if (questions.length === 0) {
    console.log(`⚪ ${name} — sem calibration_questions\n`);
    continue;
  }

  console.log(`\n── ${name} (${questions.length} perguntas) ──`);

  const expertReport = {
    slug: expertSlug,
    questions: [],
    grades: { A: 0, B: 0, C: 0, D: 0, F: 0 },
    avg_score: 0,
    overall_grade: 'F',
  };

  let totalScore = 0;

  for (const question of questions) {
    const shortQ = question.length > 55 ? question.slice(0, 55) + '…' : question;
    process.stdout.write(`  ${shortQ.padEnd(58)} `);

    const result = runRagQuery(expertSlug, question, 5);
    const evaluation = evaluateQuality(result.chunks);
    const emoji = gradeEmoji[evaluation.grade];

    console.log(`${emoji} ${evaluation.grade} (${(evaluation.score * 100).toFixed(0)}%) — ${evaluation.label}`);

    expertReport.questions.push({
      question,
      grade: evaluation.grade,
      score: evaluation.score,
      label: evaluation.label,
      top_chunk_score: result.chunks[0]?.score || 0,
      chunks_retrieved: result.chunks.length,
    });

    expertReport.grades[evaluation.grade]++;
    report.summary[evaluation.grade]++;
    report.summary.total_questions++;
    totalScore += evaluation.score;
  }

  expertReport.avg_score = questions.length > 0 ? totalScore / questions.length : 0;

  // Grade geral do expert
  const { A, B, C, D, F } = expertReport.grades;
  if (A + B >= questions.length * 0.7)      expertReport.overall_grade = 'A';
  else if (A + B >= questions.length * 0.5) expertReport.overall_grade = 'B';
  else if (A + B + C >= questions.length * 0.6) expertReport.overall_grade = 'C';
  else if (F < questions.length * 0.3)      expertReport.overall_grade = 'D';
  else                                       expertReport.overall_grade = 'F';

  const og = expertReport.overall_grade;
  console.log(`\n  NOTA GERAL: ${gradeEmoji[og]} ${og} | Avg: ${(expertReport.avg_score * 100).toFixed(1)}% | A:${A} B:${B} C:${C} D:${D} F:${F}`);

  // Identifica gaps (perguntas F/D)
  const gaps = expertReport.questions.filter(q => q.grade === 'F' || q.grade === 'D');
  if (gaps.length > 0) {
    console.log(`  ⚠️  Gaps detectados (${gaps.length}):`);
    for (const g of gaps) {
      console.log(`     - ${g.question.slice(0, 70)}`);
    }
  }

  report.experts[slug] = expertReport;
}

// Salva relatório JSON
fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');

console.log(`\n${'='.repeat(60)}`);
console.log(` SUMÁRIO GERAL — ${report.summary.total_questions} perguntas avaliadas`);
console.log(`  🟢 A: ${report.summary.A}  🔵 B: ${report.summary.B}  🟡 C: ${report.summary.C}  🟠 D: ${report.summary.D}  🔴 F: ${report.summary.F}`);
console.log(` Relatório salvo em: packages/clones/calibration-report.json`);
console.log(`${'='.repeat(60)}\n`);
