/**
 * Gemini Model Selector
 * Story GEMINI-INT.16 - Dynamic Model Switching
 *
 * Automatically selects between Gemini Flash and Pro based on task complexity.
 */

const { TaskComplexityClassifier } = require('./task-complexity-classifier');

/**
 * Model configuration
 */
const MODELS = {
  flash: {
    id: 'gemini-2.0-flash',
    costPer1kTokens: 0.000125,
    maxTokens: 32000,
    bestFor: ['simple', 'low-risk'],
  },
  pro: {
    id: 'gemini-2.0-pro',
    costPer1kTokens: 0.00125,
    maxTokens: 128000,
    bestFor: ['medium', 'complex', 'critical'],
  },
};

/**
 * Agent-based model overrides
 * Keys match agent IDs (without @ prefix)
 */
const AGENT_OVERRIDES = {
  architect: 'pro',
  analyst: 'pro',
  qa: 'pro',
  pm: 'pro',
  po: 'pro',
  'data-engineer': 'pro',
  'ux-design-expert': 'pro',
  dev: 'auto',
  devops: 'pro',
};

const HIGH_REASONING_AGENTS = new Set([
  'architect',
  'analyst',
  'qa',
  'pm',
  'po',
  'devops',
  'data-engineer',
  'ux-design-expert',
]);

const CRITICAL_KEYWORDS = [
  'architecture',
  'security',
  'audit',
  'review',
  'gate',
  'plan',
  'strategy',
  'migration',
  'incident',
  'root cause',
  'performance',
  'seo',
  'compliance',
  'orchestration',
];

class GeminiModelSelector {
  constructor(config = {}) {
    this.classifier = new TaskComplexityClassifier();
    this.defaultModel = config.defaultModel || 'pro';
    this.agentOverrides = { ...AGENT_OVERRIDES, ...config.agentOverrides };
    this.qualityFallback = config.qualityFallback !== false;
    this.minQualityScore = config.minQualityScore || 0.6;

    // Usage tracking
    this.usage = {
      flash: { count: 0, tokens: 0, cost: 0 },
      pro: { count: 0, tokens: 0, cost: 0 },
    };
  }

  /**
   * Select model for a task
   * @param {Object} task - Task to analyze
   * @param {string} agentId - Agent handling the task
   * @returns {Object} Model selection
   */
  selectModel(task, agentId = null) {
    // Normalize agentId (remove @ prefix if present)
    const normalizedAgentId = agentId?.replace(/^@/, '') || null;

    // Check agent override first
    if (normalizedAgentId && this.agentOverrides[normalizedAgentId]) {
      const override = this.agentOverrides[normalizedAgentId];
      if (override !== 'auto') {
        return this._buildSelection(override, 'agent_override', normalizedAgentId);
      }
    }

    // Classify task complexity
    const complexity = this.classifier.classify(task);
    const criticality = this.assessCriticality(task, normalizedAgentId);

    // Select based on complexity
    let model = this.defaultModel;

    if (criticality.level === 'critical') {
      model = 'pro';
    } else if (
      criticality.level === 'low'
      && complexity.level === 'simple'
      && complexity.score < 0.3
    ) {
      model = 'flash';
    } else if (complexity.level === 'complex' || complexity.score > 0.55) {
      model = 'pro';
    }

    return this._buildSelection(model, 'complexity', {
      complexity,
      criticality,
    });
  }

  /**
   * Handle quality fallback
   * @param {string} originalModel - Model that was used
   * @param {number} qualityScore - Quality score of response
   * @returns {Object|null} Fallback recommendation or null
   */
  handleQualityFallback(originalModel, qualityScore) {
    if (!this.qualityFallback) return null;

    if (originalModel === 'flash' && qualityScore < this.minQualityScore) {
      return {
        shouldRetry: true,
        newModel: 'pro',
        reason: `Quality score ${qualityScore} below threshold ${this.minQualityScore}`,
      };
    }

    return null;
  }

  /**
   * Track model usage
   * @param {string} model - Model used
   * @param {number} tokens - Tokens consumed
   */
  trackUsage(model, tokens) {
    const modelKey = model.includes('flash') ? 'flash' : 'pro';
    const modelConfig = MODELS[modelKey];

    this.usage[modelKey].count++;
    this.usage[modelKey].tokens += tokens;
    this.usage[modelKey].cost += (tokens / 1000) * modelConfig.costPer1kTokens;
  }

  /**
   * Get usage statistics
   */
  getUsageStats() {
    const total = {
      count: this.usage.flash.count + this.usage.pro.count,
      tokens: this.usage.flash.tokens + this.usage.pro.tokens,
      cost: this.usage.flash.cost + this.usage.pro.cost,
    };

    return {
      ...this.usage,
      total,
      flashRatio: total.count > 0 ? this.usage.flash.count / total.count : 0,
      costSavings: this._calculateCostSavings(),
    };
  }

  assessCriticality(task = {}, agentId = null) {
    const description = (task.description || '').toLowerCase();
    const tags = (task.tags || []).map((tag) => String(tag).toLowerCase());
    const type = String(task.type || '').toLowerCase();
    const criteria = Array.isArray(task.acceptanceCriteria)
      ? task.acceptanceCriteria
      : task.acceptanceCriteria
        ? [task.acceptanceCriteria]
        : [];
    const files = Array.isArray(task.files) ? task.files : [];

    let score = 0;
    const reasons = [];

    if (agentId && HIGH_REASONING_AGENTS.has(agentId)) {
      score += 3;
      reasons.push(`high_reasoning_agent:${agentId}`);
    }

    if (type && ['security', 'architecture', 'review', 'planning', 'analysis'].includes(type)) {
      score += 3;
      reasons.push(`critical_type:${type}`);
    }

    for (const keyword of CRITICAL_KEYWORDS) {
      if (description.includes(keyword) || tags.includes(keyword)) {
        score += 1;
        reasons.push(`keyword:${keyword}`);
      }
    }

    if (criteria.length >= 5) {
      score += 1;
      reasons.push('many_acceptance_criteria');
    }

    if (files.length >= 4) {
      score += 1;
      reasons.push('multi_file_change');
    }

    const level = score >= 3 ? 'critical' : score === 0 ? 'low' : 'standard';

    return {
      level,
      score,
      reasons,
    };
  }

  _buildSelection(model, reason, details) {
    const modelConfig = MODELS[model];
    return {
      model: modelConfig.id,
      modelKey: model,
      reason,
      details,
      config: modelConfig,
    };
  }

  _calculateCostSavings() {
    // Calculate how much was saved by using Flash instead of Pro
    const flashTokens = this.usage.flash.tokens;
    const proOnlyCost = (flashTokens / 1000) * MODELS.pro.costPer1kTokens;
    const actualCost = this.usage.flash.cost;
    return proOnlyCost - actualCost;
  }
}

module.exports = { GeminiModelSelector, MODELS, AGENT_OVERRIDES };
