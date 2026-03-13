import { supabase } from '../src/db/supabase.ts';
import { createAndSendCampaign } from '../packages/brand-engine/sales/brevo-client.ts';
import { generateBrevoSequence, detectSegment } from '../packages/brand-engine/sales/content-generator.ts';
import { scoreLeadLLM } from '../packages/brand-engine/sales/lead-scorer.ts';
import 'dotenv/config';

export async function runSalesAutomation() {
    console.log('[orchestrator] Starting sales automation cycle...');

    const now = new Date().toISOString();

    // 1. Fetch leads that are "new" OR ready for next step, OR nurture leads ready for re-contact
    const { data: leads, error } = await supabase
        .from('sales_leads')
        .select('*')
        .eq('client_id', 'BKSGrow')
        .not('email', 'is', null)
        .neq('email', '')
        .or(`status.eq.new,and(status.eq.email_sent,current_step.lt.3,next_contact_at.lte.${now}),and(status.eq.nurture,next_contact_at.lte.${now})`);

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

            // ── Step 1: Multi-dimensional scoring (only for new leads) ──────────
            if (lead.status === 'new') {
                const score = await scoreLeadLLM(lead);
                console.log(`[orchestrator] Lead ${lead.business_name} scored: ${score.total} (${score.tier}) — ${score.reasoning}`);

                if (score.tier === 'LOW') {
                    await supabase.from('sales_leads').update({
                        status: 'disqualified_low_score',
                        lead_score: score.total,
                        lead_tier: score.tier,
                        score_breakdown: score.breakdown,
                    }).eq('id', lead.id);
                    console.log(`[orchestrator] Lead ${lead.business_name} disqualified (LOW score ${score.total})`);
                    continue;
                }

                if (score.tier === 'MEDIUM') {
                    const nurtureDateAt = new Date();
                    nurtureDateAt.setDate(nurtureDateAt.getDate() + 7);
                    await supabase.from('sales_leads').update({
                        status: 'nurture',
                        lead_score: score.total,
                        lead_tier: score.tier,
                        score_breakdown: score.breakdown,
                        next_contact_at: nurtureDateAt.toISOString(),
                    }).eq('id', lead.id);
                    console.log(`[orchestrator] Lead ${lead.business_name} moved to nurture (MEDIUM score ${score.total}), next contact: ${nurtureDateAt.toISOString()}`);
                    // Still send S1 for MEDIUM — fall through
                }

                // Persist score for HIGH leads before sending S1
                if (score.tier === 'HIGH') {
                    await supabase.from('sales_leads').update({
                        lead_score: score.total,
                        lead_tier: score.tier,
                        score_breakdown: score.breakdown,
                    }).eq('id', lead.id);
                }
            }

            // ── Step 2: Detect segment ──────────────────────────────────────────
            const segment = detectSegment(lead);

            // ── Step 3: Generate strategic copy ────────────────────────────────
            const copy = generateBrevoSequence(
                { ...lead, segment },
                stepToSend
            );

            // ── Step 4: Create & send Brevo campaign ───────────────────────────
            const campaignName = `BKSGrow_Outreach_S${stepToSend}_${copy.ab_variant}_${lead.id}_${Date.now()}`;
            await createAndSendCampaign(campaignName, copy.subject, copy.html);

            console.log(`[orchestrator] Lead ${lead.email} step ${stepToSend} sent via Brevo (segment: ${segment}, variant: ${copy.ab_variant})`);

            // ── Step 5: Calculate next contact date ────────────────────────────
            let nextContactAt: Date | null = new Date();
            let nextStatus = 'email_sent';

            if (stepToSend === 1) {
                nextContactAt.setDate(nextContactAt.getDate() + 2);
            } else if (stepToSend === 2) {
                nextContactAt.setDate(nextContactAt.getDate() + 4);
            } else {
                nextContactAt = null;
                nextStatus = 'sequence_finished';
            }

            // ── Step 6: Update Supabase ────────────────────────────────────────
            const { error: updateError } = await supabase
                .from('sales_leads')
                .update({
                    status: nextStatus,
                    current_step: stepToSend,
                    last_contact_at: new Date().toISOString(),
                    next_contact_at: nextContactAt ? nextContactAt.toISOString() : null,
                    ab_variant: copy.ab_variant,
                    subject_used: copy.subject,
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
