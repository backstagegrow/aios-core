import { createClient } from '@supabase/supabase-js';
import { addContactToList as brevoAddContact, createAndSendCampaign as brevoSendCampaign } from '../packages/brand-engine/sales/brevo-client.ts';
import { addContactToList as mjAddContact, createAndSendCampaign as mjSendCampaign } from '../packages/brand-engine/sales/mailjet-client.ts';
import { generateBrevoSequence } from '../packages/brand-engine/sales/content-generator.ts';
import 'dotenv/config';

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// ─── Config ───────────────────────────────────────────────────────────────────
// .env:
//   SITES_SENDER_NAME=Erick Sena
//   SITES_SENDER_EMAIL=contato.ericksenadesign@gmail.com
//   BREVO_SITES_LIST_ID=7
//   MAILJET_SITES_LIST_ID=<id da lista Mailjet>
//   SITES_DAILY_LIMIT=250

const LIST_A_ID      = parseInt(process.env.BREVO_SITES_LIST_ID      || '7', 10);
const LIST_B_ID      = parseInt(process.env.BREVO_SITES_LIST_ID_B    || '8', 10);
const MJ_LIST_A_ID   = parseInt(process.env.MAILJET_SITES_LIST_ID    || '0', 10);
const MJ_LIST_B_ID   = parseInt(process.env.MAILJET_SITES_LIST_ID_B  || '0', 10);
const DAILY_LIMIT = parseInt(process.env.SITES_DAILY_LIMIT    || '250', 10);

const SENDER = {
    name:  process.env.SITES_SENDER_NAME  || 'Erick Sena',
    email: process.env.SITES_SENDER_EMAIL || 'contato.ericksenadesign@gmail.com',
};

// Template lead com variável Brevo — [FIRSTNAME] é substituído pelo business_name de cada contato
const TEMPLATE_LEAD = {
    id: 2,
    business_name: '[FIRSTNAME]',
    segment: 'sites_selling' as const,
};

// ─── Orchestrator ─────────────────────────────────────────────────────────────

export async function runSitesSalesAutomation() {
    const brevoPaused   = process.env.BREVO_PAUSED   === 'true';
    const mailjetPaused = process.env.MAILJET_PAUSED === 'true';

    if (brevoPaused && mailjetPaused) {
        console.warn('[sites-automation] BREVO_PAUSED + MAILJET_PAUSED — automação pausada.');
        return;
    }

    console.log('[sites-automation] Starting batch sales automation cycle...');

    const now = new Date().toISOString();
    const dateTag = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    const { data: leads, error } = await supabase
        .from('sales_leads')
        .select('*')
        .eq('client_id', 'SitesSales')
        .not('email', 'is', null)
        .neq('email', '')
        .or(`status.in.(no_website,broken_website,has_website),and(status.eq.email_sent,current_step.lt.3,next_contact_at.lte.${now}),and(status.eq.nurture,current_step.lt.5,next_contact_at.lte.${now})`);

    if (error) {
        console.error('[sites-automation] Error fetching leads:', error.message);
        return;
    }

    if (!leads || leads.length === 0) {
        console.log('[sites-automation] No leads to process.');
        return;
    }

    // ── Group leads por provider + (listId, step) ───────────────────────────
    type GroupKey = string; // e.g. "brevo_7_1", "mj_101_2"
    const groups: Record<GroupKey, typeof leads> = {};

    if (!brevoPaused) {
        for (const listId of [LIST_A_ID, LIST_B_ID]) {
            for (const step of [1, 2, 3, 4, 5])
                groups[`brevo_${listId}_${step}`] = [];
        }
    }
    if (!mailjetPaused && MJ_LIST_A_ID > 0) {
        for (const listId of [MJ_LIST_A_ID, MJ_LIST_B_ID].filter(id => id > 0)) {
            for (const step of [1, 2, 3, 4, 5])
                groups[`mj_${listId}_${step}`] = [];
        }
    }

    let totalQueued = 0;
    for (const lead of leads) {
        if (totalQueued >= DAILY_LIMIT) break;
        const step = (lead.current_step || 0) + 1;
        if (step < 1 || step > 5) continue;

        const useMJ = !mailjetPaused && MJ_LIST_A_ID > 0 && !!lead.mailjet_list_id;
        if (useMJ) {
            const listId = lead.mailjet_list_id as number;
            const key = `mj_${listId}_${step}`;
            if (key in groups) { groups[key].push(lead); totalQueued++; }
        } else if (!brevoPaused) {
            const listId = lead.brevo_list_id || LIST_A_ID;
            const key = `brevo_${listId}_${step}`;
            if (key in groups) { groups[key].push(lead); totalQueued++; }
        }
    }
    console.log(`[sites-automation] ${totalQueued} leads no batch (limite diário: ${DAILY_LIMIT})`);

    // ── Process each group ──────────────────────────────────────────────────
    for (const [key, batch] of Object.entries(groups)) {
        if (batch.length === 0) continue;

        const [provider, listIdStr, stepStr] = key.split('_');
        const listId = parseInt(listIdStr, 10);
        const step   = parseInt(stepStr, 10) as 1|2|3|4|5;

        console.log(`[sites-automation] [${provider}] List ${listId} Step ${step}: ${batch.length} leads...`);

        const copy         = generateBrevoSequence(TEMPLATE_LEAD, step);
        const campaignName = `SitesSales_${provider.toUpperCase()}_L${listId}_S${step}_${dateTag}_${Date.now()}`;

        if (provider === 'mj') {
            for (const lead of batch)
                await mjAddContact(lead.email, lead.business_name, listId);
            await mjSendCampaign(campaignName, copy.subject, copy.html, listId, SENDER);
        } else {
            for (const lead of batch)
                await brevoAddContact(lead.email, lead.business_name, listId);
            await brevoSendCampaign(campaignName, copy.subject, copy.html, [listId], SENDER);
        }

        const nextContactAt = new Date();
        if (step <= 2)      nextContactAt.setDate(nextContactAt.getDate() + 2);
        else if (step <= 4) nextContactAt.setDate(nextContactAt.getDate() + 30);

        const ids = batch.map(l => l.id);
        const { error: updateError } = await supabase
            .from('sales_leads')
            .update({
                status: step >= 5 ? 'sequence_finished' : step >= 3 ? 'nurture' : 'email_sent',
                current_step: step,
                last_contact_at: new Date().toISOString(),
                next_contact_at: step >= 5 ? null : nextContactAt.toISOString(),
            })
            .in('id', ids);

        if (updateError) {
            console.error(`[sites-automation] Error updating [${provider}] L${listId} S${step}:`, updateError.message);
        } else {
            console.log(`[sites-automation] [${provider}] L${listId} S${step} done — ${batch.length} leads updated.`);
        }
    }

    console.log('[sites-automation] Batch automation cycle complete.');
}

// ─── Entry Point ──────────────────────────────────────────────────────────────

const invokedScript = process.argv[1]?.replace(/\\/g, '/').split('/').pop();

if (invokedScript === 'sites-sales-automation.ts' || invokedScript === 'sites-sales-automation.js') {
    runSitesSalesAutomation();
}
