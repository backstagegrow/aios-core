/**
 * @file factory.js
 * @description Task Creation Engine with creative templates.
 */

const client = require('./client');
const config = require('./config');

class TaskFactory {
    /**
     * Creates a task in the Master Approval Lane first.
     */
    async createForApproval(clientName, title, description, priority = 3) {
        const payload = {
            name: `📋 [APROVAÇÃO] ${clientName} | ${title}`,
            description: description,
            priority: priority,
            status: 'aberto',
            assignees: [248595236] // Darlon - Workspace Admin
        };

        console.log(`📤 Enviando '${title}' para a Master Approval Lane...`);
        return await client.createTask(config.LISTS.MASTER_APPROVAL, payload);
    }

    /**
     * Sends a direct report to the Board list.
     */
    async sendBoardReport(title, markdown) {
        const payload = {
            name: `📊 ${title}`,
            markdown_description: markdown,
            status: 'aberto'
        };
        return await client.createTask(config.LISTS.BOARD_REPORTS, payload);
    }
}

module.exports = new TaskFactory();
