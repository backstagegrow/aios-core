'use strict';

/**
 * decision-record-formatter — Formats Conclave output as Decision Records for story files
 *
 * AEV-5: Conclave como Decision Engine de Agentes
 * L4 — always modifiable
 */

// ---------------------------------------------------------------------------
// Format a single Decision Record as markdown
// ---------------------------------------------------------------------------

/**
 * Format a Conclave result as a Decision Record section
 * @param {object} params
 * @param {number} params.drNumber - Decision Record number (DR-1, DR-2, ...)
 * @param {string} params.title - Short title for the decision
 * @param {string} params.trigger - 'COMPLEX score' | '@architect HIGH'
 * @param {string[]} params.cloneNames - Names of clones consulted
 * @param {string} params.recommendation - result.recommendation from Conclave
 * @param {Array} params.perspectives - result.perspectives from Conclave (array of {cloneName, perspective})
 * @param {string} [params.date] - ISO date (defaults to today)
 * @returns {string} Formatted markdown section
 */
function formatDecisionRecord(params) {
  const {
    drNumber,
    title,
    trigger,
    cloneNames,
    recommendation,
    perspectives,
    date
  } = params;

  const dateStr = date || new Date().toISOString().split('T')[0];
  const cloneList = Array.isArray(cloneNames) ? cloneNames.join(', ') : cloneNames;

  const lines = [];
  lines.push(`### DR-${drNumber}: ${title}`);
  lines.push(`**Data:** ${dateStr}`);
  lines.push(`**Trigger:** ${trigger}`);
  lines.push(`**Clones Consultados:** ${cloneList}`);
  lines.push(`**Recomendação:** ${recommendation || '_Sem recomendação_'}`);
  lines.push('**Perspectivas Chave:**');

  if (Array.isArray(perspectives) && perspectives.length > 0) {
    for (const p of perspectives) {
      const name = p.cloneName || p.specialist || 'Clone';
      const summary = p.perspective
        ? p.perspective.slice(0, 200).replace(/\n/g, ' ')
        : '_Sem perspectiva_';
      lines.push(`- **${name}:** ${summary}`);
    }
  } else {
    lines.push('- _Nenhuma perspectiva disponível_');
  }

  lines.push('**Decisão Final:** [A preencher pelo @architect]');
  lines.push('');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Append Decision Record to story file content
// ---------------------------------------------------------------------------

/**
 * Find the next DR number in a story file content
 * @param {string} content - Full story file content
 * @returns {number}
 */
function getNextDrNumber(content) {
  const matches = content.match(/### DR-(\d+):/g);
  if (!matches || matches.length === 0) return 1;

  const numbers = matches.map(m => {
    const n = m.match(/### DR-(\d+):/);
    return n ? parseInt(n[1], 10) : 0;
  });

  return Math.max(...numbers) + 1;
}

/**
 * Add a Decision Record section to story file content
 * @param {string} storyContent - Current story file content
 * @param {string} decisionRecordMd - Formatted DR markdown from formatDecisionRecord()
 * @returns {string} Updated story content
 */
function appendDecisionRecord(storyContent, decisionRecordMd) {
  const drSectionHeader = '## Decision Records';

  if (storyContent.includes(drSectionHeader)) {
    // Append before the next top-level ## section or at end
    const insertBeforePattern = /\n## (?!Decision Records)/;
    const match = storyContent.search(insertBeforePattern);

    // Find the end of the Decision Records section
    const drSectionStart = storyContent.indexOf(drSectionHeader);
    const afterDrSection = storyContent.indexOf('\n## ', drSectionStart + drSectionHeader.length);

    if (afterDrSection !== -1) {
      // Insert before next section
      return (
        storyContent.slice(0, afterDrSection) +
        '\n' +
        decisionRecordMd +
        storyContent.slice(afterDrSection)
      );
    }

    // Append at end
    return storyContent.trimEnd() + '\n\n' + decisionRecordMd;
  }

  // Add new Decision Records section at end of file
  const newSection = `\n---\n\n${drSectionHeader}\n\n${decisionRecordMd}`;
  return storyContent.trimEnd() + newSection;
}

module.exports = {
  formatDecisionRecord,
  appendDecisionRecord,
  getNextDrNumber
};
