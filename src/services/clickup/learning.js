/**
 * @file learning.js
 * @description Machine Learning / Memory synchronization engine.
 */

const fs = require('fs');
const path = require('path');
const client = require('./client');
const config = require('./config');

class StrategyLearning {
    constructor() {
        this.basePath = path.resolve(__dirname, '../../..');
    }

    async syncAllClients() {
        console.log("🧠 Starting Intelligent Memory Sync...");
        const results = [];

        for (const clientMeta of config.CLIENT_MAPPING) {
            console.log(`\n--- Analisando: ${clientMeta.name} ---`);
            try {
                // Get tasks from Traffic list
                const trafficTasks = await client.getTasks(clientMeta.traffic);
                const closedTasks = trafficTasks.tasks.filter(t =>
                    t.status.status.toLowerCase() === 'finalizado' ||
                    t.status.status.toLowerCase() === 'concluído'
                );

                if (closedTasks.length === 0) {
                    console.log("∅ Nenhuma task finalizada encontrada.");
                    continue;
                }

                const memoryPath = path.join(this.basePath, 'clients', clientMeta.dir, 'memory_performance.md');
                let existingContent = "";
                if (fs.existsSync(memoryPath)) {
                    existingContent = fs.readFileSync(memoryPath, 'utf8');
                }

                let newEntries = `\n### ⚡ Novos Aprendizados (Sincronizados em ${new Date().toLocaleDateString()})\n`;
                let count = 0;

                for (const task of closedTasks) {
                    const entryTitle = `- **[TASK CL${task.id}]** ${task.name}`;
                    if (!existingContent.includes(task.id)) {
                        // Heurística de análise de falha vs sucesso
                        const isFailure = task.name.toLowerCase().includes("erro") || task.name.toLowerCase().includes("corrigir");
                        const sentiment = isFailure ? "🔴 FALHA/CORREÇÃO" : "✅ SUCESSO/ENTREGA";

                        newEntries += `${entryTitle}\n  > Status: ${sentiment}\n  > Insight AIOS: ${task.description ? task.description.substring(0, 100) + '...' : 'Processado para otimização estratégica.'}\n`;
                        count++;
                    }
                }

                if (count > 0) {
                    fs.appendFileSync(memoryPath, newEntries);
                    console.log(`✅ ${count} aprendizados adicionados ao arquivo: ${clientMeta.dir}`);
                } else {
                    console.log("✓ Memória já está atualizada.");
                }

                results.push({ name: clientMeta.name, updated: count });

            } catch (err) {
                console.error(`❌ Erro no cliente ${clientMeta.name}: ${err.message}`);
            }
        }
        return results;
    }
}

module.exports = new StrategyLearning();
