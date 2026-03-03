require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testConnection() {
    console.log('🧪 Iniciando Teste de Conexão com o Supabase...');

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseKey.includes('your-service-role-key') || supabaseKey.startsWith('yeyJ')) {
        console.error('❌ ERRO: Variáveis do Supabase inválidas no .env. Verifique SUPABASE_SERVICE_ROLE_KEY.');
        return;
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // 1. Testar Leitura (Squads)
        console.log('\n📖 Lendo Squads do banco...');
        const { data: squads, error: fetchError } = await supabase
            .from('squads')
            .select('name, status');

        if (fetchError) throw fetchError;

        console.log(`✅ Sucesso! Encontrei ${squads.length} squads configurados.`);
        squads.forEach(s => console.log(`   - ${s.name} (${s.status})`));

        // 2. Testar Escrita (Observability Event Audit)
        console.log('\n✍️ Injetando evento de teste de auditoria...');
        const { data: insertData, error: insertError } = await supabase
            .from('observability_events')
            .insert([{
                event_type: 'health_check',
                severity: 'info',
                message: 'Supabase REST API connection verified successfully via AIOS script.',
                duration_ms: 0
            }])
            .select();

        if (insertError) throw insertError;

        console.log('✅ Sucesso! Evento de auditoria registrado no Supabase.');
        console.log('Dados inseridos:', insertData[0].message);

        console.log('\n🎉 O Supabase está 100% ONLINE e pronto para armazenar a memória do Codex!');

    } catch (err) {
        console.error('\n❌ Falha na conexão com o Supabase:', err.message);
    }
}

testConnection();
