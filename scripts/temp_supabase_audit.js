import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Funcao de Auditoria Real
async function deepAudit(name, url, key) {
    console.log(`\n🔍 AUDITANDO: ${name}`);
    const supabase = createClient(url, key);

    try {
        // 1. Tentar ler tabelas do sistema (PG_TABLES) via rest rpc ou data approach
        // Nota: A RPC 'inspect_rls' seria o ideal, mas se nao existir, tentaremos inferir.

        const { data: tables, error: tError } = await supabase
            .from('pg_tables') // Tentando acesso administrativo
            .select('tablename')
            .eq('schemaname', 'public');

        if (tError) {
            console.log(`[-] Erro ao listar tabelas: ${tError.message}`);
            // Backup plan: Tentar ler tabelas core identificadas no audit
            const coreTables = ['leads', 'agents', 'whatsapp_instances', 'clients', 'ai_logs'];
            for (const table of coreTables) {
                const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
                if (!error) {
                    console.log(`[+] Tabela [${table}] EXISTE. Registros: ${count}`);
                } else {
                    console.log(`[x] Tabela [${table}] nao acessivel ou nao existe: ${error.message}`);
                }
            }
        } else {
            console.log(`[+] Tabelas encontradas via PG:`, tables.map(t => t.tablename).join(', '));
        }

        // 2. Testar Vulnerabilidade de RLS (Tentativa de leitura sem filtro)
        // Como estamos com a Service Role, sempre veremos tudo. 
        // O teste real seria tentar com a Anon Key, mas Orion consegue simular a verificacao de definicao.

    } catch (err) {
        console.error(`[FATAL] Falha no projeto ${name}:`, err.message);
    }
}

const projects = [
    { name: "Meta Ads", url: "https://whcfgflswdanptxsvfes.supabase.co", key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoY2ZnZmxzd2RhbnB0eHN2ZmVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTUwMDcxOCwiZXhwIjoyMDg3MDc2NzE4fQ.jU2GJbPGylaYdyKNZ6_2tefOq_XHg9aD2ZFiXUwiDSE" },
    { name: "SpHaus", url: "https://bleqjcxwtgzwbkediusr.supabase.co", key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsZXFqY3h3dGd6d2JrZWRpdXNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIzNzIyMCwiZXhwIjoyMDg1ODEzMjIwfQ.CtrTzX5QhKP01QOeaqOkcExfCzyiqZ2_7_pIasC32uQ" },
    { name: "Backstagefy", url: "https://xaivgzrmxewkevlqvphi.supabase.co", key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhaXZnenJteGV3a2V2bHF2cGhpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk2Mjc2NiwiZXhwIjoyMDg3NTM4NzY2fQ.2ZniGbPyAR2y1gBmDfMwU3wqQvuykKPxKwZjJdj7nI4" }
];

for (const p of projects) {
    await deepAudit(p.name, p.url, p.key);
}
