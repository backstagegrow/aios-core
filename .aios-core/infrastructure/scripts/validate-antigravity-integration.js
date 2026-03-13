#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const {
  CANONICAL_ANTIGRAVITY_AGENTS,
} = require('./ide-sync/antigravity-support');

function readIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, 'utf8');
}

function validateAntigravityIntegration(options = {}) {
  const projectRoot = options.projectRoot || process.cwd();
  const errors = [];
  const warnings = [];

  const rulesPath = path.join(projectRoot, '.antigravity', 'rules.md');
  const configPath = path.join(projectRoot, '.antigravity', 'antigravity.json');
  const agentsDir = path.join(projectRoot, '.antigravity', 'agents');
  const workflowsDir = path.join(projectRoot, '.agent', 'workflows');

  const rulesContent = readIfExists(rulesPath);
  if (!rulesContent) {
    errors.push('AntiGravity rules file is missing: .antigravity/rules.md');
  } else {
    for (const agentId of CANONICAL_ANTIGRAVITY_AGENTS) {
      if (!rulesContent.includes(`@${agentId}`)) {
        errors.push(`AntiGravity rules.md does not mention canonical agent @${agentId}`);
      }
    }
  }

  const configContent = readIfExists(configPath);
  if (!configContent) {
    errors.push('AntiGravity config file is missing: .antigravity/antigravity.json');
  } else {
    try {
      const parsed = JSON.parse(configContent);
      if (parsed.agents?.directory !== '.antigravity/agents') {
        errors.push('AntiGravity config must point agents.directory to .antigravity/agents');
      }
      if (parsed.rules?.file !== '.antigravity/rules.md') {
        errors.push('AntiGravity config must point rules.file to .antigravity/rules.md');
      }
      if (parsed.paths?.workflows !== '.agent/workflows') {
        errors.push('AntiGravity config must point workflows path to .agent/workflows');
      }
    } catch (error) {
      errors.push(`AntiGravity config is not valid JSON: ${error.message}`);
    }
  }

  if (!fs.existsSync(agentsDir)) {
    errors.push('AntiGravity canonical agents directory is missing: .antigravity/agents');
  }

  if (!fs.existsSync(workflowsDir)) {
    errors.push('AntiGravity workflow directory is missing: .agent/workflows');
  }

  for (const agentId of CANONICAL_ANTIGRAVITY_AGENTS) {
    const agentPath = path.join(agentsDir, `${agentId}.md`);
    const workflowPath = path.join(workflowsDir, `${agentId}.md`);

    if (!fs.existsSync(agentPath)) {
      errors.push(`Missing AntiGravity canonical agent file: .antigravity/agents/${agentId}.md`);
    }

    const workflowContent = readIfExists(workflowPath);
    if (!workflowContent) {
      errors.push(`Missing AntiGravity workflow file: .agent/workflows/${agentId}.md`);
    } else if (!workflowContent.includes(`.antigravity/agents/${agentId}.md`)) {
      errors.push(`Workflow ${agentId}.md does not point to .antigravity/agents/${agentId}.md`);
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
  };
}

function main() {
  const result = validateAntigravityIntegration();

  if (result.ok) {
    console.log('AntiGravity integration OK');
  } else {
    console.error(result.errors.join('\n'));
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  validateAntigravityIntegration,
};
