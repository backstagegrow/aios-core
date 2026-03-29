#!/usr/bin/env node
'use strict';

/**
 * Nível 2 — Indexa cross-learnings entre experts no Pinecone.
 * Extrai a seção cross_learnings de cada YAML e indexa como fonte textual.
 *
 * Uso: node packages/clones/cli/batch-improve-crosslearnings.cjs
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
 * Extrai cross_learnings do YAML como texto estruturado.
 * Retorna null se não houver cross_learnings.
 */
function extractCrossLearnings(yamlContent, expertName) {
  if (!yamlContent.includes('cross_learnings:')) return null;

  const lines = yamlContent.split('\n');
  let inSection = false;
  let inInsight = false;
  let currentInsight = {};
  const insights = [];
  let baseIndent = null;

  for (const line of lines) {
    if (line.match(/^\s*cross_learnings:/)) {
      inSection = true;
      continue;
    }

    if (!inSection) continue;

    // Detecta fim da seção cross_learnings
    if (line.match(/^[a-z_]+:/) && !line.match(/^\s/)) {
      break;
    }

    // Detecta item de lista (- session:)
    if (line.match(/^\s*-\s+session:/)) {
      if (currentInsight.insight) insights.push({ ...currentInsight });
      currentInsight = {};
      const m = line.match(/session:\s*['""]?(.+?)['""]?$/);
      if (m) currentInsight.session = m[1];
      continue;
    }

    const sourceMatch = line.match(/^\s+source:\s*['""]?(.+?)['""]?$/);
    if (sourceMatch) { currentInsight.source = sourceMatch[1]; continue; }

    const insightMatch = line.match(/^\s+insight:\s*['""]?(.+)/);
    if (insightMatch) {
      currentInsight.insight = insightMatch[1].replace(/['""]$/, '').trim();
      continue;
    }

    // Multi-line insight continuation
    if (currentInsight.insight !== undefined && line.match(/^\s{6,}/) && !line.match(/^\s+[a-z_]+:/)) {
      currentInsight.insight += ' ' + line.trim().replace(/['""]$/, '');
    }
  }

  if (currentInsight.insight) insights.push(currentInsight);

  if (insights.length === 0) return null;

  const lines2 = [
    `# Cross-Learnings de ${expertName}`,
    `# Insights obtidos em roundtable sessions com outros experts`,
    '',
  ];

  for (const ins of insights) {
    lines2.push(`## ${ins.session || 'Session'} — via ${ins.source || 'unknown'}`);
    lines2.push('');
    lines2.push(ins.insight || '');
    lines2.push('');
  }

  return lines2.join('\n');
}

let done = 0;
let failed = 0;
let noData = 0;
const tmpFiles = [];

console.log(`\n${'='.repeat(54)}`);
console.log(' NÍVEL 2 — Cross-Learnings entre Experts');
console.log(`${'='.repeat(54)}\n`);

for (const [slug, name] of Object.entries(EXPERT_MAP)) {
  const yamlPath = path.join(EXPERTS_DIR, slug, `clone_${slug}.yaml`);
  if (!fs.existsSync(yamlPath)) {
    console.log(`⚠️  ${name} — YAML não encontrado`);
    noData++;
    continue;
  }

  const yaml = fs.readFileSync(yamlPath, 'utf-8');
  const text = extractCrossLearnings(yaml, name);

  if (!text || text.trim().length < 100) {
    console.log(`⚪ ${name} — sem cross-learnings`);
    noData++;
    continue;
  }

  // Salva em arquivo temporário
  const tmpPath = path.join(os.tmpdir(), `crosslearnings_${slug}.md`);
  fs.writeFileSync(tmpPath, text, 'utf-8');
  tmpFiles.push(tmpPath);

  const insightCount = (text.match(/^## /gm) || []).length;
  process.stdout.write(`  ${name.padEnd(20)} (${insightCount} cross-learnings)... `);

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
  }
}

// Cleanup temp files
for (const f of tmpFiles) {
  try { fs.unlinkSync(f); } catch {}
}

console.log(`\n${'='.repeat(54)}`);
console.log(` CONCLUÍDO: ${done} OK | ${failed} falhas | ${noData} sem dados`);
console.log(`${'='.repeat(54)}\n`);
