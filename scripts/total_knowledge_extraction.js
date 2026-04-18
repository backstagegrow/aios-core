import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

async function extractAllKnowledge(name, url, key) {
    console.log(`\n--- Extraindo Inteligencia: ${name} ---`);
    const supabase = createClient(url, key);

    let output = `\n# 🧬 DNA do Projeto: ${name}\n\n`;

    // 1. Mapeamento de Agentes (Somente para Backstagefy)
    if (name === "Backstagefy") {
        output += `## 🤖 Inteligencia dos Agentes Ativos\n`;
        const { data: agents, error } = await supabase.from('agents').select('name, system_prompt, model, temperature');
        if (!error && agents) {
            agents.forEach(agent => {
                output += `### Agente: ${agent.name}\n`;
                output += `- **Modelo:** ${agent.model}\n`;
                output += `- **Temp:** ${agent.temperature}\n`;
                output += `- **Prompt de Sistema:**\n\`\`\`text\n${agent.system_prompt}\n\`\`\`\n\n`;
            });
        }
    }

    // 2. Schema Estendido
    output += `## 🏛️ Estrutura de Tabelas (Schema)\n`;
    const targetTables = ['leads', 'agents', 'whatsapp_instances', 'clients', 'ai_logs', 'campaigns', 'reports'];
    for (const table of targetTables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (!error && data && data.length > 0) {
            output += `### Tabela: ${table}\n`;
            output += `- **Colunas:** ${Object.keys(data[0]).join(', ')}\n`;
        }
    }

    return output;
}

const projects = [
    { name: "Backstagefy", url: "https://xaivgzrmxewkevlqvphi.supabase.co", key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaXZnenJteGV3a2V2bHF2cGhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk2Mjc2NiwiZXhwIjoyMDg3NTM4NzY2fQ.2ZniGbPyAR2y1gBmDfMwU3wqQvuykKPxKwZjJdj7nI4" },
    { name: "SpHaus", url: "https://bleqjcxwtgzwbkediusr.supabase.co", key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsZXFqY3h3dGd6d2JrZWRpdXNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIzNzIyMCwiZXhwIjoyMDg1ODEzMjIwfQ.CtrTzX5QhKP01QOeaqOkcExfCzyiqZ2_7_pIasC32uQ" },
    { name: "Meta Ads", url: "https://whcfgflswdanptxsvfes.supabase.co", key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY2ZnZmxzd2RhbnB0eHN2ZmVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUwMDcxOCwiZXhwIjoyMDg3MDc2NzE4fQ.jU2GJbPGylaYdyKNZ6_2tefOq_XHg9aD2ZFiXUwiDSE" }
];

let fullAuditLog = "# 📚 Repositorio Central de Conhecimento — BKS Grow\n\n";
for (const p of projects) {
    const result = await extractAllKnowledge(p.name, p.url, p.key);
    fullAuditLog += result;
}

// Salvar o log bruto em um arquivo temporario para Orion processar
fs.writeFileSync('D:\\01 -Arquivos\\Obsidian\\AIOS\\Projects\\BKS-Grow\\Knowledge\\DNA_EXTRACTION_COMPLETE.md', fullAuditLog);
console.log('Extração completa e salva no Obsidian.');
