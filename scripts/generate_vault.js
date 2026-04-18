import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

async function extractApiKeys(name, url, key) {
    const supabase = createClient(url, key);
    let output = `\n### 🌐 Projeto: ${name}\n`;
    output += `- **URL:** ${url}\n`;
    output += `- **Service Role Key:** \`${key}\`\n`;

    // Tenta extrair chaves de terceiros (WhatsApp/Meta) das tabelas
    try {
        const { data: agents } = await supabase.from('agents').select('name, whatsapp_apikey').not('whatsapp_apikey', 'is', null);
        if (agents && agents.length > 0) {
            output += `#### 📱 Chaves de Integração (WhatsApp):\n`;
            agents.forEach(a => {
                output += `- Agente [${a.name}]: \`${a.whatsapp_apikey}\`\n`;
            });
        }

        const { data: instances } = await supabase.from('whatsapp_instances').select('instance_name, apikey');
        if (instances && instances.length > 0) {
            output += `#### 🔌 Instâncias WhatsApp (Webhooks):\n`;
            instances.forEach(i => {
                output += `- Instância [${i.instance_name}]: \`${i.apikey}\`\n`;
            });
        }
    } catch (e) {
        output += `*(Nenhuma chave de terceiro encontrada nas tabelas core)*\n`;
    }

    return output;
}

const projects = [
    { name: "Backstagefy (Core SaaS)", url: "https://xaivgzrmxewkevlqvphi.supabase.co", key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaXZnenJteGV3a2V2bHF2cGhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk2Mjc2NiwiZXhwIjoyMDg3NTM4NzY2fQ.2ZniGbPyAR2y1gBmDfMwU3wqQvuykKPxKwZjJdj7nI4" },
    { name: "Meta Ads (Analytics)", url: "https://whcfgflswdanptxsvfes.supabase.co", key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY2ZnZmxzd2RhbnB0eHN2ZmVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUwMDcxOCwiZXhwIjoyMDg3MDc2NzE4fQ.jU2GJbPGylaYdyKNZ6_2tefOq_XHg9aD2ZFiXUwiDSE" },
    { name: "SpHaus (Custom)", url: "https://bleqjcxwtgzwbkediusr.supabase.co", key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsZXFqY3h3dGd6d2JrZWRpdXNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIzNzIyMCwiZXhwIjoyMDg1ODEzMjIwfQ.CtrTzX5QhKP01QOeaqOkcExfCzyiqZ2_7_pIasC32uQ" }
];

let vaultContent = "# 🗝️ BKS-Grow Secret Vault (Cofre de Segurança)\n\n";
vaultContent += "> **⚠️ CONFIDENCIAL:** Este arquivo contém chaves mestras. Não vazar.\n\n";

for (const p of projects) {
    vaultContent += await extractApiKeys(p.name, p.url, p.key);
}

fs.writeFileSync('D:\\01 -Arquivos\\Obsidian\\AIOS\\Projects\\BKS-Grow\\Knowledge\\SECRET_VAULT_DO_NOT_LEAK.md', vaultContent);
console.log('Vault criado com sucesso.');
