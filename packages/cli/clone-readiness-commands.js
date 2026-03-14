'use strict';

/**
 * clone-readiness-commands — CLI entry point for clone readiness scoring and auto-squad deployment
 *
 * AEV-6: Clone Readiness → Auto-Squad Deploy
 * L4 — always modifiable
 *
 * Usage:
 *   node clone-readiness-commands.js check [--clone-id <id>] [--auto-deploy]
 *   node clone-readiness-commands.js report [--output <path>]
 */

'use strict';

const fs = require('fs');
const path = require('path');

function getScorer() {
  return require('../clone-tools/readiness-scorer');
}

function getGenerator() {
  return require('../clone-tools/squad-generator');
}

// ---------------------------------------------------------------------------
// Command: check
// ---------------------------------------------------------------------------

/**
 * Check readiness of one or all clones
 * @param {object} [options]
 * @param {string} [options.cloneId] - Specific clone to check
 * @param {boolean} [options.autoDeploy=false] - Deploy ready clones
 * @returns {object[]} Score results
 */
function cmdCheck(options = {}) {
  const { cloneId, autoDeploy = false } = options;
  const scorer = getScorer();
  const generator = getGenerator();

  let scores;

  if (cloneId) {
    try {
      scores = [scorer.scoreClone(cloneId)];
    } catch (err) {
      throw new Error(`Failed to score clone "${cloneId}": ${err.message}`);
    }
  } else {
    scores = scorer.scoreAllClones();
  }

  const deployResults = [];

  for (const score of scores) {
    const status = score.meetsThreshold ? 'READY' : 'pending';
    console.log(`[${status}] ${score.cloneId}: ${score.total}/100 (threshold: ${score.threshold})`);

    if (autoDeploy && score.meetsThreshold) {
      const deployResult = generator.deployCloneAsSquad(score);
      if (deployResult.deployed) {
        console.log(`  → Deployed squad: ${deployResult.squadPath}`);
      } else {
        console.log(`  → Skipped: ${deployResult.reason}`);
      }
      deployResults.push({ cloneId: score.cloneId, ...deployResult });
    }
  }

  return { scores, deployResults };
}

// ---------------------------------------------------------------------------
// Command: report
// ---------------------------------------------------------------------------

/**
 * Generate a readiness report markdown file
 * @param {object} [options]
 * @param {string} [options.outputPath] - File path to save report
 * @returns {{ content: string, outputPath: string|null }}
 */
function cmdReport(options = {}) {
  const { outputPath } = options;
  const scorer = getScorer();

  const scores = scorer.scoreAllClones();
  const today = new Date().toISOString().split('T')[0];
  const threshold = scorer.getThreshold();

  const ready = scores.filter(s => s.meetsThreshold);
  const pending = scores.filter(s => !s.meetsThreshold);

  const lines = [
    `# Clone Readiness Report — ${today}`,
    '',
    `**Threshold:** ${threshold}/100`,
    `**Total clones:** ${scores.length}`,
    `**Ready for deployment:** ${ready.length}`,
    `**Pending:** ${pending.length}`,
    '',
    '---',
    '',
    '## Ready for Deployment',
    ''
  ];

  if (ready.length === 0) {
    lines.push('_No clones meet the readiness threshold._');
    lines.push('');
  } else {
    ready.forEach(s => {
      lines.push(`### ${s.cloneId} (${s.total}/100)`);
      lines.push(`**Role:** ${s.role || 'N/A'}`);
      lines.push('**Dimensions:**');
      Object.entries(s.dimensions).forEach(([k, v]) => {
        lines.push(`- ${k}: ${v}`);
      });
      lines.push('');
    });
  }

  lines.push('## Pending');
  lines.push('');

  if (pending.length === 0) {
    lines.push('_All clones are ready._');
    lines.push('');
  } else {
    pending.forEach(s => {
      const gap = threshold - s.total;
      lines.push(`- **${s.cloneId}**: ${s.total}/100 (needs ${gap} more points)`);
    });
    lines.push('');
  }

  const content = lines.join('\n');

  if (outputPath) {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outputPath, content, 'utf8');
    console.log(`Report saved to: ${outputPath}`);
  } else {
    console.log(content);
  }

  return { content, outputPath: outputPath || null };
}

// ---------------------------------------------------------------------------
// CLI entrypoint
// ---------------------------------------------------------------------------

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (cmd === 'check') {
    const cloneIdIdx = args.indexOf('--clone-id');
    const cloneId = cloneIdIdx !== -1 ? args[cloneIdIdx + 1] : undefined;
    const autoDeploy = args.includes('--auto-deploy');

    try {
      cmdCheck({ cloneId, autoDeploy });
      process.exit(0);
    } catch (err) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  }

  if (cmd === 'report') {
    const outputIdx = args.indexOf('--output');
    const outputPath = outputIdx !== -1 ? args[outputIdx + 1] : undefined;

    cmdReport({ outputPath });
    process.exit(0);
  }

  console.error(`Unknown command: ${cmd || '(none)'}`);
  console.error('Commands: check [--clone-id <id>] [--auto-deploy], report [--output <path>]');
  process.exit(1);
}

module.exports = {
  cmdCheck,
  cmdReport
};
