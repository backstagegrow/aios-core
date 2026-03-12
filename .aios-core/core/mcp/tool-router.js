/**
 * Tool Router / Supervisor
 * 
 * Intercepts agent invocations and mutates .claude/mcp.json to limit the active tools
 * based on the agent's capabilities, preventing the 100 tools limit error from MCP.
 */

const fs = require('fs');
const path = require('path');

const TOOL_MAPPINGS = {
  // Agents that need ClickUp
  pm: ['CLICKUP_GET_AUTHORIZED_TEAMS_WORKSPACES', 'CLICKUP_GET_SPACES', 'CLICKUP_GET_FOLDERS', 'CLICKUP_GET_LIST', 'CLICKUP_CREATE_TASK', 'CLICKUP_UPDATE_TASK', 'CLICKUP_GET_TASK', 'CLICKUP_GET_TASKS', 'CLICKUP_CREATE_TASK_COMMENT', 'CLICKUP_GET_TASK_COMMENTS'],
  analyst: ['CLICKUP_GET_TASK', 'CLICKUP_GET_TASKS', 'CLICKUP_CREATE_TASK_COMMENT'],
  nexus_strategic_board: ['CLICKUP_GET_TASK', 'CLICKUP_GET_TASKS', 'CLICKUP_UPDATE_TASK', 'CLICKUP_CREATE_TASK_COMMENT'],

  // Default fallback (bare minimum)
  default: ['CLICKUP_GET_TASK', 'CLICKUP_GET_TASKS'],
};

class ToolRouter {
  constructor(projectRoot) {
    this.projectRoot = projectRoot;
    this.mcpConfigPath = path.join(projectRoot, '.claude', 'mcp.json');
  }

  /**
   * Swaps the active tools in .claude/mcp.json based on the agent's name.
   * @param {string} agentName
   */
  async switchToAgentContext(agentName) {
    try {
      // Normalize agent name
      const normalizedName = agentName.replace(/^@/, '').toLowerCase().replace(/-/g, '_');

      const allowedTools = TOOL_MAPPINGS[normalizedName] || TOOL_MAPPINGS.default;

      let mcpConfig = {};
      if (fs.existsSync(this.mcpConfigPath)) {
        mcpConfig = JSON.parse(fs.readFileSync(this.mcpConfigPath, 'utf8'));
      }

      if (!mcpConfig.mcpServers) {
        mcpConfig.mcpServers = {};
      }

      fs.mkdirSync(path.dirname(this.mcpConfigPath), { recursive: true });

      mcpConfig.mcpServers.clickup = {
        url: `https://rube.app/mcp?toolsets=clickup&include_tools=${allowedTools.join(',')}`,
      };

      fs.writeFileSync(this.mcpConfigPath, JSON.stringify(mcpConfig, null, 2));
      console.log(`[Tool Router] Successfully routed MCP tools for agent @${agentName}. Enabled ${allowedTools.length} ClickUp tools.`);

      return true;
    } catch (error) {
      console.error(`[Tool Router] Failed to switch agent context for @${agentName}:`, error);
      return false;
    }
  }
}

module.exports = ToolRouter;
