const path = require('path');

const CANONICAL_ANTIGRAVITY_AGENTS = [
  'aios-master',
  'analyst',
  'architect',
  'clickup-ops',
  'clickup-reporting',
  'data-engineer',
  'dev',
  'devops',
  'pm',
  'po',
  'qa',
  'sm',
  'squad-creator',
  'ux-design-expert',
];

function buildAgentRecognitionLine(agentIds = CANONICAL_ANTIGRAVITY_AGENTS) {
  return agentIds.map((agentId) => `@${agentId}`).join(', ');
}

function generateAntiGravityWorkflow(agentName) {
  const displayName = agentName.charAt(0).toUpperCase() + agentName.slice(1);

  return `---
description: Ativa o agente ${displayName}
---

# Ativacao do Agente ${displayName}

**INSTRUCOES CRITICAS PARA O ANTIGRAVITY:**

1. Leia COMPLETAMENTE o arquivo \`.antigravity/agents/${agentName}.md\`
2. Siga EXATAMENTE as \`activation-instructions\` definidas no bloco YAML do agente
3. Adote a persona conforme definido no agente
4. Execute a saudacao conforme \`greeting_levels\` definido no agente
5. **MANTENHA esta persona ate receber o comando \`*exit\`**
6. Responda aos comandos com prefixo \`*\` conforme definido no agente
7. Siga as regras globais do projeto em \`.antigravity/rules.md\`

**Comandos disponiveis:** Use \`*help\` para ver todos os comandos do agente.
`;
}

function createAntiGravityConfigObject(projectRoot, options = {}) {
  const projectName = options.projectName || path.basename(projectRoot);
  const agentsDirectory = options.agentsDirectory || '.antigravity/agents';
  const rulesFile = options.rulesFile || '.antigravity/rules.md';

  return {
    version: '1.0',
    project: projectName,
    workspace: projectRoot.replace(/\\/g, '/'),
    agents: {
      enabled: true,
      directory: agentsDirectory,
      default: 'aios-master',
    },
    rules: {
      enabled: true,
      file: rulesFile,
    },
    features: {
      storyDrivenDevelopment: true,
      agentActivation: true,
      workflowAutomation: true,
    },
    paths: {
      stories: 'docs/stories',
      prd: 'docs/prd',
      architecture: 'docs/architecture',
      tasks: '.aios-core/tasks',
      workflows: '.agent/workflows',
    },
  };
}

module.exports = {
  CANONICAL_ANTIGRAVITY_AGENTS,
  buildAgentRecognitionLine,
  generateAntiGravityWorkflow,
  createAntiGravityConfigObject,
};
