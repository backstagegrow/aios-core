#!/usr/bin/env node

/**
 * apply-cross-learnings.js
 *
 * Aplica patches de cross-learning gerados pelo Clone Roundtable (*score)
 * aos YAMLs dos expert clones.
 *
 * Uso:
 *   node experts/scripts/apply-cross-learnings.js <patch-file.json>
 *   node experts/scripts/apply-cross-learnings.js --stdin < patch.json
 *
 * O que faz:
 *   1. Lê o patch JSON (arquivo ou stdin)
 *   2. Para cada clone com cross_learnings:
 *      - Carrega o YAML do clone
 *      - Adiciona o cross_learning à seção cross_learnings do clone_metadata
 *      - Incrementa calibration_score (máx 100)
 *      - Atualiza last_calibration com a data atual
 *      - Se score >= 100, marca como MASTER CALIBRATED
 *   3. Salva os YAMLs atualizados
 *   4. Salva log de sessão em experts/_sessions/
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const EXPERTS_DIR = resolve(__dirname, '..');
const SESSIONS_DIR = resolve(EXPERTS_DIR, '_sessions');

// ============================================================================
// Helpers
// ============================================================================

function findCloneYaml(cloneId) {
  const yamlPath = resolve(EXPERTS_DIR, cloneId, `clone_${cloneId}.yaml`);
  if (existsSync(yamlPath)) return yamlPath;
  return null;
}

function loadCloneYaml(filePath) {
  const content = readFileSync(filePath, 'utf8');
  return { content, data: yaml.load(content) };
}

function saveCloneYaml(filePath, data) {
  const yamlStr = yaml.dump(data, {
    lineWidth: 120,
    noRefs: true,
    quotingType: '"',
    forceQuotes: false,
    flowLevel: -1,
    sortKeys: false,
  });
  writeFileSync(filePath, yamlStr, 'utf8');
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function sessionTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

// ============================================================================
// Main
// ============================================================================

function applyPatch(patch) {
  const results = {
    session_id: patch.session_id,
    topic: patch.topic,
    applied_at: new Date().toISOString(),
    updates: [],
    errors: [],
  };

  const crossLearnings = patch.cross_learnings || {};
  const scoreUpdates = patch.score_updates || {};

  for (const [cloneId, learning] of Object.entries(crossLearnings)) {
    const yamlPath = findCloneYaml(cloneId);

    if (!yamlPath) {
      results.errors.push({
        clone_id: cloneId,
        error: `YAML not found at experts/${cloneId}/clone_${cloneId}.yaml`,
      });
      continue;
    }

    try {
      const { data } = loadCloneYaml(yamlPath);

      // Garantir que clone_metadata existe
      if (!data.clone_metadata) {
        data.clone_metadata = {
          expert_name: cloneId,
          calibration_score: 0,
          last_calibration: today(),
          status: 'active',
        };
      }

      // Garantir que cross_learnings array existe
      if (!data.clone_metadata.cross_learnings) {
        data.clone_metadata.cross_learnings = [];
      }

      // Adicionar o novo cross-learning
      const newLearning = {
        session_id: patch.session_id,
        date: today(),
        learned_from: learning.learned_from,
        insight: learning.insight,
        connection: learning.connection || null,
        score_delta: learning.score_delta || 1,
      };

      data.clone_metadata.cross_learnings.push(newLearning);

      // Atualizar calibration_score
      const currentScore = data.clone_metadata.calibration_score || 0;
      const delta = learning.score_delta || 1;
      const newScore = Math.min(100, currentScore + delta);

      data.clone_metadata.calibration_score = newScore;
      data.clone_metadata.last_calibration = today();

      // MASTER CALIBRATED check
      if (newScore >= 100) {
        data.clone_metadata.status = 'MASTER CALIBRATED';
        data.clone_metadata.master_calibrated_at = today();
      }

      // Salvar YAML atualizado
      saveCloneYaml(yamlPath, data);

      results.updates.push({
        clone_id: cloneId,
        previous_score: currentScore,
        delta,
        new_score: newScore,
        master_calibrated: newScore >= 100,
        learned_from: learning.learned_from,
        insight_preview: learning.insight.slice(0, 80) + (learning.insight.length > 80 ? '...' : ''),
      });

      console.log(
        `  ✅ ${cloneId}: ${currentScore} → ${newScore} (+${delta})${newScore >= 100 ? ' 🏆 MASTER CALIBRATED' : ''}`
      );
    } catch (err) {
      results.errors.push({
        clone_id: cloneId,
        error: err.message,
      });
      console.error(`  ❌ ${cloneId}: ${err.message}`);
    }
  }

  return results;
}

function saveSessionLog(results) {
  if (!existsSync(SESSIONS_DIR)) {
    mkdirSync(SESSIONS_DIR, { recursive: true });
  }

  const filename = `session-${sessionTimestamp()}.json`;
  const filePath = resolve(SESSIONS_DIR, filename);

  writeFileSync(filePath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n📋 Sessão salva: ${filePath}`);
  return filePath;
}

function main() {
  const args = process.argv.slice(2);

  let patchData;

  if (args.includes('--stdin')) {
    // Ler do stdin
    const input = readFileSync('/dev/stdin', 'utf8');
    patchData = JSON.parse(input);
  } else if (args.length > 0 && !args[0].startsWith('--')) {
    // Ler do arquivo
    const patchFile = resolve(process.cwd(), args[0]);
    if (!existsSync(patchFile)) {
      console.error(`❌ Arquivo de patch não encontrado: ${patchFile}`);
      process.exit(1);
    }
    patchData = JSON.parse(readFileSync(patchFile, 'utf8'));
  } else {
    console.error('❌ Uso: node apply-cross-learnings.js <patch-file.json> [--stdin]');
    console.error('');
    console.error('  Aplica patches de cross-learning gerados pelo Clone Roundtable.');
    console.error('  O patch JSON é gerado pelo comando *score do agente clone-roundtable.');
    console.error('');
    console.error('Exemplos:');
    console.error('  node experts/scripts/apply-cross-learnings.js roundtable-patch.json');
    console.error('  cat patch.json | node experts/scripts/apply-cross-learnings.js --stdin');
    process.exit(1);
  }

  // Validar estrutura do patch
  if (!patchData.session_id || !patchData.cross_learnings) {
    console.error('❌ Patch JSON inválido. Campos obrigatórios: session_id, cross_learnings');
    process.exit(1);
  }

  console.log(`🎙️ Aplicando cross-learnings da sessão: ${patchData.session_id}`);
  console.log(`📝 Tópico: ${patchData.topic || 'N/A'}`);
  console.log(`👥 Participantes: ${(patchData.participants || []).join(', ')}`);
  console.log('');

  const results = applyPatch(patchData);

  // Resumo
  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log('📊 RESUMO');
  console.log('═══════════════════════════════════════════════════');
  console.log(`  Atualizados: ${results.updates.length}`);
  console.log(`  Erros: ${results.errors.length}`);

  if (results.updates.length > 0) {
    console.log('');
    console.log('  Score Updates:');
    for (const u of results.updates) {
      const status = u.master_calibrated ? '🏆 MASTER' : '✅';
      console.log(`    ${status} ${u.clone_id}: ${u.previous_score} → ${u.new_score} (+${u.delta})`);
    }
  }

  if (results.errors.length > 0) {
    console.log('');
    console.log('  Erros:');
    for (const e of results.errors) {
      console.log(`    ❌ ${e.clone_id}: ${e.error}`);
    }
  }

  // Salvar log de sessão
  const logPath = saveSessionLog(results);

  // Exit code
  process.exit(results.errors.length > 0 ? 1 : 0);
}

main();
