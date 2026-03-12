'use strict';

const STAR_COMMAND_REGEX = /\*([a-z][\w-]*)/i;
const HEAVY_SIGNAL_REGEX = /\b(architect\w*|architecture\w*|arquitet\w*|refactor\w*|refator\w*|debug\w*|investig\w*|analy[sz]e\w*|analis\w*|planej\w*|design\w*|review\w*|revis\w*|auditor\w*|optimi[sz]e\w*|performan\w*|workflow\w*|story\w*)\b/i;

function normalizePrompt(prompt) {
  return typeof prompt === 'string' ? prompt.trim() : '';
}

function classifyPromptComplexity(prompt, session = {}) {
  const text = normalizePrompt(prompt);
  if (!text) {
    return 'simple';
  }

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const lineCount = text.split(/\r?\n/).length;
  const hasStarCommand = STAR_COMMAND_REGEX.test(text);
  const hasCodeBlock = text.includes('```');
  const hasHeavySignals = HEAVY_SIGNAL_REGEX.test(text);
  const hasActiveExecutionContext = Boolean(
    session.active_task || session.active_workflow || session.active_squad,
  );

  if (
    hasStarCommand ||
    hasCodeBlock ||
    hasHeavySignals ||
    hasActiveExecutionContext ||
    text.length > 220 ||
    lineCount > 3
  ) {
    return 'complex';
  }

  if (text.length <= 80 && wordCount <= 12 && lineCount <= 2) {
    return 'simple';
  }

  return 'standard';
}

function uniqueSortedLayers(layers) {
  return [...new Set(layers)].sort((a, b) => a - b);
}

function buildContextBudgetProfile({
  prompt,
  session = {},
  bracket: _bracket,
  baseTokenBudget,
  bracketLayers = [],
  legacyMode = false,
  devmode = false,
}) {
  const complexity = classifyPromptComplexity(prompt, session);
  const baseLayers = legacyMode ? bracketLayers : [0, 1, 2];
  const safeBaseBudget = typeof baseTokenBudget === 'number' ? baseTokenBudget : 800;
  const isCriticalBracket = _bracket === 'CRITICAL';
  const hasStickyContext = Boolean(
    session.activeAgent ||
    session.active_agent ||
    session.active_task ||
    session.active_workflow ||
    session.active_squad,
  );

  if (complexity === 'simple') {
    const preserveDetail = !isCriticalBracket && (devmode || hasStickyContext);
    return {
      complexity,
      activeLayers: uniqueSortedLayers(baseLayers),
      tokenBudget: preserveDetail
        ? Math.max(500, Math.floor(safeBaseBudget * 0.75))
        : Math.max(250, Math.floor(safeBaseBudget * 0.5)),
      formatOptions: {
        complexity,
        includeSummary: preserveDetail,
        globalRuleLimit: preserveDetail ? null : 2,
      },
    };
  }

  if (complexity === 'complex') {
    const complexLayers = legacyMode
      ? bracketLayers
      : [0, 1, 2, 3, 4, 5, 6, 7];

    return {
      complexity,
      activeLayers: uniqueSortedLayers(complexLayers),
      tokenBudget: Math.round(safeBaseBudget * 1.25),
      formatOptions: {
        complexity,
        includeSummary: true,
      },
    };
  }

  return {
    complexity,
    activeLayers: uniqueSortedLayers(baseLayers),
    tokenBudget: safeBaseBudget,
    formatOptions: {
      complexity,
      includeSummary: true,
    },
  };
}

module.exports = {
  classifyPromptComplexity,
  buildContextBudgetProfile,
};
