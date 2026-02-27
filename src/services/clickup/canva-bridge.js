/**
 * @file canva-bridge.js
 * @description Service to bridge ClickUp task data to Canva designs.
 */

const config = require('./config');
// Note: This service primarily prepares instructions for the Browser Subagent
// as there is no official public API for direct Canva element editing without app approval.

class CanvaBridge {
  constructor() {
    this.mappings = config.CLIENT_MAPPING.reduce((acc, client) => {
      if (client.canvaId) acc[client.name] = client.canvaId;
      return acc;
    }, {});
  }

  /**
     * Translates a ClickUp task update into a Canva editing plan.
     */
  async prepareUpdatePlan(clientName, taskData) {
    const canvaId = this.mappings[clientName];
    if (!canvaId) throw new Error(`Nenhum design do Canva mapeado para o cliente: ${clientName}`);

    console.log(`🎯 Preparando plano de atualização para Canva design: ${canvaId}`);

    // Regras lógicas de mapeamento de campos (Heurística)
    const updates = [];

    if (taskData.name.toLowerCase().includes('data') || taskData.name.toLowerCase().includes('relatório')) {
      updates.push({
        type: 'text',
        target: 'date',
        value: 'ABRIL de 2026', // Valor fixo para o teste ou extraído do contexto
      });
    }

    if (taskData.attachments && taskData.attachments.length > 0) {
      updates.push({
        type: 'image',
        target: 'mockup_frame',
        sourceUrl: taskData.attachments[0].url,
      });
    }

    return {
      canvaUrl: `https://www.canva.com/design/${canvaId}/edit`,
      updates: updates,
    };
  }
}

module.exports = new CanvaBridge();
