
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

/**
 * Recupera as métricas de performance para análise do agente.
 */
export async function getPerformanceMetrics(period = '7d') {
    const days = period === '7d' ? 7 : 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
        .schema('performance')
        .from('campaign_metrics')
        .select('*')
        .gte('date', startDate.toISOString().split('T')[0]);

    if (error) {
        console.error('Erro ao buscar métricas:', error);
        return null;
    }

    return data;
}

/**
 * Analisa o funil e identifica gargalos.
 */
export async function analyzeFunnelLeaks() {
    const { data, error } = await supabase
        .schema('performance')
        .from('funnel_health')
        .select('*')
        .order('roas', { ascending: false });

    if (error) return null;

    return data.map(camp => {
        let status = '✅ Saudável';
        if (camp.roas < 2) status = '⚠️ Atenção: ROAS Baixo';
        if (camp.cpl > 15) status = '🚨 Crítico: CPL Alto';

        return { ...camp, status };
    });
}
