'use strict';

/**
 * conclave-commands — CLI entry point for Conclave Decision Engine
 *
 * AEV-5: Conclave como Decision Engine de Agentes
 * L4 — always modifiable
 *
 * Usage:
 *   node conclave-commands.js run --challenge "<text>" --domain <technical|business|marketing|ux|strategy>
 *   node conclave-commands.js run --challenge "<text>" --domain technical --save-to AEV-5
 */

'use strict';

const fs = require('fs');
const path = require('path');

function getRouter() {
  return require('../conclave-engine/conclave-router');
}

function getFormatter() {
  return require('../conclave-engine/decision-record-formatter');
}

function getConclave() {
  return require('../clones/conclave/index');
}

// ---------------------------------------------------------------------------
// Command: run
// ---------------------------------------------------------------------------

/**
 * Run a Conclave session for a given challenge
 * @param {string} challenge - Decision text/description
 * @param {string} domain - technical|business|marketing|ux|strategy
 * @param {object} [options]
 * @param {boolean} [options.antiPleasing=true]
 * @param {boolean} [options.antiBiasing=true]
 * @param {boolean} [options.totalBusinessContext=false]
 * @param {string} [options.storyPath] - Story file path to append Decision Record
 * @param {string} [options.title] - DR title (defaults to first 60 chars of challenge)
 * @param {string} [options.trigger] - Trigger label (e.g. 'COMPLEX score=18')
 * @returns {Promise<object>} Conclave result + DR info
 */
async function cmdRunConclave(challenge, domain, options = {}) {
  const {
    antiPleasing = true,
    antiBiasing = true,
    totalBusinessContext = false,
    storyPath,
    title,
    trigger = 'manual CLI'
  } = options;

  const router = getRouter();
  const formatter = getFormatter();
  const { runConclave } = getConclave();

  if (!challenge || !challenge.trim()) {
    throw new Error('challenge is required');
  }

  const validDomains = ['technical', 'business', 'marketing', 'ux', 'strategy'];
  if (!validDomains.includes(domain)) {
    throw new Error(`Invalid domain "${domain}". Valid: ${validDomains.join(', ')}`);
  }

  // Select clones
  const routeResult = router.selectClones(domain);
  const selectedClones = routeResult.selected;

  if (selectedClones.length < 2) {
    throw new Error(`Not enough clones available for domain "${domain}" (found ${selectedClones.length}, need at least 2)`);
  }

  if (routeResult.fallbackUsed) {
    console.log(`[conclave] No domain-specific clones found. Using fallback top-${selectedClones.length} clones.`);
  } else {
    console.log(`[conclave] Selected ${selectedClones.length} clones for domain "${domain}"`);
  }

  console.log(`[conclave] Clones: ${selectedClones.map(c => c.name || c.id).join(', ')}`);
  console.log('[conclave] Running deliberation...');

  // Build clone objects for Conclave API
  const conclaveClones = selectedClones.map(c => ({
    name: c.name || c.id,
    dnaProfile: {
      specialist: c.name || c.id,
      role: c.role || '',
      frameworks: [],
      principles: [],
      expertise: []
    }
  }));

  const result = await runConclave(challenge.trim(), conclaveClones, {
    antiPleasing,
    antiBiasing,
    totalBusinessContext
  });

  console.log('\n[conclave] === RECOMMENDATION ===');
  console.log(result.recommendation || '(no recommendation)');
  console.log('');

  // Optionally save Decision Record to story file
  let drResult = null;
  if (storyPath) {
    if (!fs.existsSync(storyPath)) {
      throw new Error(`Story file not found: ${storyPath}`);
    }

    const storyContent = fs.readFileSync(storyPath, 'utf8');
    const drNumber = formatter.getNextDrNumber(storyContent);
    const drTitle = title || challenge.trim().slice(0, 60);
    const cloneNames = selectedClones.map(c => c.name || c.id);

    const drMd = formatter.formatDecisionRecord({
      drNumber,
      title: drTitle,
      trigger,
      cloneNames,
      recommendation: result.recommendation,
      perspectives: result.perspectives || []
    });

    const updatedContent = formatter.appendDecisionRecord(storyContent, drMd);
    fs.writeFileSync(storyPath, updatedContent, 'utf8');

    console.log(`[conclave] Decision Record DR-${drNumber} added to: ${storyPath}`);
    drResult = { drNumber, storyPath };
  }

  return { result, selectedClones, fallbackUsed: routeResult.fallbackUsed, dr: drResult };
}

// ---------------------------------------------------------------------------
// CLI entrypoint
// ---------------------------------------------------------------------------

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (cmd === 'run') {
    const challengeIdx = args.indexOf('--challenge');
    const domainIdx = args.indexOf('--domain');
    const saveToIdx = args.indexOf('--save-to');
    const titleIdx = args.indexOf('--title');

    if (challengeIdx === -1 || domainIdx === -1) {
      console.error('Usage: conclave-commands run --challenge "<text>" --domain <domain> [--save-to <storyPath>] [--title "<title>"]');
      process.exit(1);
    }

    const challenge = args[challengeIdx + 1];
    const domain = args[domainIdx + 1];
    const storyPath = saveToIdx !== -1 ? args[saveToIdx + 1] : undefined;
    const title = titleIdx !== -1 ? args[titleIdx + 1] : undefined;

    cmdRunConclave(challenge, domain, { storyPath, title })
      .then(() => process.exit(0))
      .catch(err => {
        console.error(`Error: ${err.message}`);
        process.exit(1);
      });
    return;
  }

  console.error(`Unknown command: ${cmd || '(none)'}`);
  console.error('Commands: run --challenge "<text>" --domain <technical|business|marketing|ux|strategy>');
  process.exit(1);
}

module.exports = {
  cmdRunConclave
};
