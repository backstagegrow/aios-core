import { createClient } from '@supabase/supabase-js';

async function performDeepAudit(name, url, key) {
    console.log(`\n=========================================`);
    console.log(`🔬 AUDITORIA PROFUNDA: ${name}`);
    console.log(`=========================================`);

    const supabase = createClient(url, key);

    // 1. Extrair Schema Completo (Tabelas e Colunas)
    console.log(`\n[1] Mapeamento de DNA (Schema)...`);
    const { data: columns, error: colError } = await supabase
        .from('pg_attribute')
        .select(`
            attname,
            atttypid,
            attrelid
        `)
        .limit(0); // Apenas teste de acesso administrativo ao pg_catalog

    // Como o acesso direto ao pg_catalog via PostgREST pode ser bloqueado, 
    // vamos usar uma abordagem de descoberta por força bruta nas tabelas core
    // e extrair o schema das que respondem.

    const targetTables = [
        'leads', 'agents', 'whatsapp_instances', 'clients', 'ai_logs',
        'messages', 'funnels', 'steps', 'tokens', 'configs', 'users_roles',
        'profiles', 'webhooks', 'history', 'campaigns'
    ];

    for (const table of targetTables) {
        // Obter uma linha para ver as colunas
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (!error) {
            const cols = data.length > 0 ? Object.keys(data[0]) : "Tabela vazia (colunas ocultas)";
            const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
            console.log(`[+] Tabela [${table}] detectada!`);
            console.log(`    - Colunas: ${Array.isArray(cols) ? cols.join(', ') : cols}`);
            console.log(`    - Volume: ${count} registros`);
        }
    }

    // 2. Verificacao de Segredos e Integracoes
    console.log(`\n[2] Verificando Cofres e Integrações...`);
    // Procurar por colunas que parecam tokens
    const { data: profiles } = await supabase.from('clients').select('id, name').limit(5);
    if (profiles) console.log(`[!] Detectados ${profiles.length} perfis de clientes ativos.`);

}

const projects = [
    { name: "Meta Ads", url: "https://whcfgflswdanptxsvfes.supabase.co", key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY2ZnZmxzd2RhbnB0eHN2ZmVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUwMDcxOCwiZXhwIjoyMDg3MDc2NzE4fQ.jU2GJbPGylaYdyKNZ6_2tefOq_XHg9aD2ZFiXUwiDSE" },
    { name: "SpHaus", url: "https://bleqjcxwtgzwbkediusr.supabase.co", key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsZXFqY3h3dGd6d2JrZWRpdXNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIzNzIyMCwiZXhwIjoyMDg1ODEzMjIwfQ.CtrTzX5QhKP01QOeaqOkcExfCzyiqZ2_7_pIasC32uQ" },
    { name: "Backstagefy", url: "https://xaivgzrmxewkevlqvphi.supabase.co", key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaXZnenJteGV3a2V2bHF2cGhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk2Mjc2NiwiZXhwIjoyMDg3NTM4NzY2fQ.2ZniGbPyAR2y1gBmDfMwU3wqQvuykKPxKwZjJdj7nI4" }
];

for (const p of projects) {
    await performDeepAudit(p.name, p.url, p.key);
}
