import { supabase } from '../src/db/supabase.ts';
import { createAndSendCampaign } from '../packages/brand-engine/sales/brevo-client.ts';
import { generateBrevoSequence } from '../packages/brand-engine/sales/content-generator.ts';
import { callLLM } from '../src/llm/client.ts';
import 'dotenv/config';

// Advanced LLM filter to ensure quality and 100k+ revenue profile.
async function isQualifiedB2BLeadLLM(lead: any): Promise<boolean> {
    const name = lead.business_name.toLowerCase();
    const badKeywords = ['lanchonete', 'padaria', 'barbearia', 'mercado', 'açougue', 'pizzaria', 'posto', 'oficina', 'doceria'];
    if (badKeywords.some(kw => name.includes(kw))) {
        return false;
    }

    const prompt = `Você é um qualificador de leads B2B implacável.
O nosso ICP (Ideal Customer Profile) são Experts (Palestrantes, Treinadores Corporativos, Consultorias) ou Empresas de Eventos B2B (Produtoras, Cenografia) que aparentam maturidade e uma alta probabilidade de faturar mais de R$ 100.000 por mês.
Analise o seguinte Lead:
- Nome da Empresa: "${lead.business_name}"
- Nicho Mapeado: "${lead.niche}"
- URL do Maps: "${lead.google_maps_url}"
- Website: "${lead.website}"

O negócio parece ser um player sólido nesses mercados B2B ou um Expert relevante?
Responda APENAS com "APPROVE" se for qualificado (perfil de 100k/mês+), ou "REJECT" se for um negócio local irrelevante, B2C, ou profissional sem maturidade empresarial.`;

    try {
        const response = await callLLM(prompt, { temperature: 0.1, model: 'gemini-2.5-flash' });
        return response.includes('APPROVE');
    } catch (e: any) {
        console.error('[LLM Filter] API Error, defaulting to true:', e.message);
        return true;
    }
}

export async function runSalesAutomation() {
    console.log('[orchestrator] Starting sales automation cycle...');

    const now = new Date().toISOString();

    // 1. Fetch leads that are "new" OR ready for step 2/3
    const { data: leads, error } = await supabase
        .from('sales_leads')
        .select('*')
        .eq('client_id', 'BKSGrow')
        .not('email', 'is', null)
        .neq('email', '')
        .or(`status.eq.new,and(status.eq.email_sent,current_step.lt.3,next_contact_at.lte.${now})`);

    if (error) {
        console.error('[orchestrator] Error fetching leads:', error.message);
        return;
    }

    if (!leads || leads.length === 0) {
        console.log('[orchestrator] No new or scheduled leads to process.');
        return;
    }

    console.log(`[orchestrator] Found ${leads.length} leads to process.`);

    for (const lead of leads) {
        try {
            const stepToSend = (lead.current_step || 0) + 1;
            console.log(`[orchestrator] Processing lead: ${lead.business_name} (${lead.email}) for Step ${stepToSend}`);

            if (stepToSend > 3) continue;

            // 1.5 Filter Lead (only on step 1)
            if (stepToSend === 1) {
                const isQualified = await isQualifiedB2BLeadLLM(lead);
                if (!isQualified) {
                    console.log(`[orchestrator] Lead ${lead.business_name} discarded by LLM filter.`);
                    await supabase.from('sales_leads').update({ status: 'discarded' }).eq('id', lead.id);
                    continue;
                }
            }

            // 2. Generate strategic copy
            const copy = generateBrevoSequence({ business_name: lead.business_name, niche: lead.niche }, stepToSend);

            // 3. Create Campaign
            const campaignName = `BKSGrow_Outreach_S${stepToSend}_${lead.id}_${Date.now()}`;
            await createAndSendCampaign(campaignName, copy.subject, copy.html);

            console.log(`[orchestrator] Lead ${lead.email} sequence step ${stepToSend} sent via Brevo.`);

            // Calculate next contact date
            let nextContactAt: Date | null = new Date();
            let nextStatus = 'email_sent';

            if (stepToSend === 1) {
                nextContactAt.setDate(nextContactAt.getDate() + 2); // Wait 2 days for email 2
            } else if (stepToSend === 2) {
                nextContactAt.setDate(nextContactAt.getDate() + 4); // Wait 4 days for email 3
            } else {
                nextContactAt = null; // No more emails
                nextStatus = 'sequence_finished';
            }

            // 4. Update Supabase
            const { error: updateError } = await supabase
                .from('sales_leads')
                .update({
                    status: nextStatus,
                    current_step: stepToSend,
                    last_contact_at: new Date().toISOString(),
                    next_contact_at: nextContactAt ? nextContactAt.toISOString() : null
                })
                .eq('id', lead.id);

            if (updateError) {
                console.error(`[orchestrator] Error updating lead status for ${lead.email}:`, updateError.message);
            } else {
                console.log(`[orchestrator] Successfully processed ${lead.email} for step ${stepToSend}`);
            }

        } catch (err) {
            console.error(`[orchestrator] Failed to process lead ${lead.email}:`, err);
        }
    }

    console.log('[orchestrator] Sales automation cycle complete.');
}

const invokedScript = process.argv[1]?.replace(/\\/g, '/').split('/').pop();

if (invokedScript === 'bksgrow-sales-automation.ts' || invokedScript === 'bksgrow-sales-automation.js') {
    runSalesAutomation();
}
