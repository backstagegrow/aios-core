import { createClient } from '@supabase/supabase-js';
import { addContactToList as brevoAddContact, createAndSendCampaign as brevoSendCampaign, getBrevoLists, createBrevoList } from '../packages/brand-engine/sales/brevo-client.ts';
import { addContactToList as mjAddContact, createAndSendCampaign as mjSendCampaign } from '../packages/brand-engine/sales/mailjet-client.ts';
import { generateBrevoSequence } from '../packages/brand-engine/sales/content-generator.ts';
import { scrapeSitesLeads } from './scrape-sites-leads.ts';
import 'dotenv/config';

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || ''
);

// ─── Config ───────────────────────────────────────────────────────────────────
// .env:
//   SITES_SENDER_NAME=Erick Sena
//   SITES_SENDER_EMAIL=contato.ericksenadesign@gmail.com
//   BREVO_SITES_LIST_ID=7
//   MAILJET_SITES_LIST_ID=<id da lista Mailjet>
//   SITES_DAILY_LIMIT=250

const LIST_A_ID = parseInt(process.env.BREVO_SITES_LIST_ID || '7', 10);
const LIST_B_ID = parseInt(process.env.BREVO_SITES_LIST_ID_B || '8', 10);
const MJ_LIST_A_ID = parseInt(process.env.MAILJET_SITES_LIST_ID || '0', 10);
const MJ_LIST_B_ID = parseInt(process.env.MAILJET_SITES_LIST_ID_B || '0', 10);
const DAILY_LIMIT = parseInt(process.env.SITES_DAILY_LIMIT || '250', 10);

const SENDER = {
    name: process.env.SITES_SENDER_NAME || 'Erick Sena',
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
    const brevoPaused = process.env.BREVO_PAUSED === 'true';
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
        const step = parseInt(stepStr, 10) as 1 | 2 | 3 | 4 | 5;

        console.log(`[sites-automation] [${provider}] List ${listId} Step ${step}: ${batch.length} leads...`);

        const copy = generateBrevoSequence(TEMPLATE_LEAD, step);
        const campaignName = `SitesSales_${provider.toUpperCase()}_L${listId}_S${step}_${dateTag}_${Date.now()}`;

        if (provider === 'mj') {
            for (const lead of batch)
                await mjAddContact(lead.email.trim(), lead.business_name, listId);
            await mjSendCampaign(campaignName, copy.subject, copy.html, listId, SENDER);
        } else {
            for (const lead of batch)
                await brevoAddContact(lead.email.trim(), lead.business_name, listId);
            await brevoSendCampaign(campaignName, copy.subject, copy.html, [listId], SENDER);
        }

        const nextContactAt = new Date();
        if (step <= 2) nextContactAt.setDate(nextContactAt.getDate() + 2);
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

// ─── Populate Next List ───────────────────────────────────────────────────────
// Identifica a última lista "Erick_Sites_*" no Brevo, cria a próxima e povoa
// com leads novos do Supabase (sem email — o disparo é manual).

const LIST_PREFIX = 'Erick_Sites_';
const POPULATE_BATCH = parseInt(process.env.SITES_POPULATE_BATCH || '300', 10);

export async function populateNextList() {
    console.log('[populate] Buscando listas existentes no Brevo...');

    const lists = await getBrevoLists(100);
    const sitesList = lists
        .filter(l => l.name.startsWith(LIST_PREFIX))
        .map(l => ({ ...l, num: parseInt(l.name.replace(LIST_PREFIX, ''), 10) }))
        .filter(l => !isNaN(l.num))
        .sort((a, b) => b.num - a.num);

    const last = sitesList[0];
    const lastFull = !last || (last.uniqueSubscribers ?? 0) >= POPULATE_BATCH;

    let targetListId: number;
    let targetListName: string;

    if (lastFull) {
        const nextNum = (last?.num ?? 0) + 1;
        targetListName = `${LIST_PREFIX}${String(nextNum).padStart(3, '0')}`;
        console.log(`[populate] Lista anterior cheia (${last?.uniqueSubscribers ?? 0}/${POPULATE_BATCH}) → criando: ${targetListName}`);
        targetListId = await createBrevoList(targetListName);
        console.log(`[populate] Lista criada — ID ${targetListId}`);
    } else {
        targetListId = last.id;
        targetListName = last.name;
        const remaining = POPULATE_BATCH - (last.uniqueSubscribers ?? 0);
        console.log(`[populate] Usando lista existente: ${targetListName} (${last.uniqueSubscribers}/${POPULATE_BATCH}) → faltam ${remaining} contatos`);
    }

    const remaining = POPULATE_BATCH - (lastFull ? 0 : (last?.uniqueSubscribers ?? 0));

    // Limpa leads com emails inválidos (ex: %20...) que falharam antes do fix do regex
    await supabase.from('sales_leads')
        .update({ status: 'extracted' })
        .eq('client_id', 'SitesSales')
        .eq('status', 'new')
        .like('email', '%25%'); // %25 = % URL-encoded in PostgREST

    // Também limpa via ilike para pegar %20 direto na string
    const { data: badLeads } = await supabase.from('sales_leads')
        .select('id')
        .eq('client_id', 'SitesSales')
        .eq('status', 'new')
        .or('email.like.%2520%,email.like.%20%');
    if (badLeads && badLeads.length > 0) {
        await supabase.from('sales_leads').update({ status: 'extracted' }).in('id', badLeads.map(l => l.id));
        console.log(`[populate] ${badLeads.length} leads com email inválido marcados como extracted`);
    }

    // Função auxiliar para buscar leads disponíveis (status='new' = scrapeado mas não adicionado ao Brevo)
    const fetchAvailable = async (limit: number) => {
        const { data, error } = await supabase
            .from('sales_leads')
            .select('id, email, business_name')
            .eq('client_id', 'SitesSales')
            .eq('status', 'new')
            .not('email', 'is', null)
            .neq('email', '')
            .limit(limit);
        if (error) console.error('[populate] Supabase erro:', error.message);
        return data ?? [];
    };

    // 1. Verifica quantos leads já estão disponíveis
    const available = await fetchAvailable(remaining);
    console.log(`[populate] ${available.length}/${remaining} leads disponíveis no Supabase`);

    // 2. Se não tem suficiente, raspa o que falta
    if (available.length < remaining) {
        const needMore = remaining - available.length;
        console.log(`[populate] Buscando mais ${needMore} leads no Google Maps...`);
        const scraped = await scrapeSitesLeads(needMore);
        console.log(`[populate] Scraper salvou ${scraped} leads com email`);
    }

    // 3. Fetch final — pega tudo que está disponível (até o limite)
    const leads = await fetchAvailable(remaining);
    console.log(`[populate] ${leads.length} leads prontos para adicionar ao Brevo`);

    if (leads.length === 0) { console.log('[populate] Sem leads para adicionar.'); return; }

    // Deduplicar por email — evita spam em plataformas como Doctoralia
    // Sanitiza o email (trim) antes de qualquer operação para evitar %20 e espaços
    const seen = new Set<string>();
    const unique = leads
        .map(l => ({ ...l, email: l.email.trim() }))  // ← sanitiza aqui
        .filter(l => {
            if (!l.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(l.email)) return false; // descarta inválidos
            const key = l.email.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    if (unique.length < leads.length)
        console.log(`[populate] Deduplicação: ${leads.length} → ${unique.length} leads únicos`);

    console.log(`[populate] Adicionando ${unique.length} leads na lista ${targetListName} (ID ${targetListId})...`);

    const successIds: number[] = [];
    let failed = 0;
    for (const lead of unique) {
        const ok = await brevoAddContact(lead.email, lead.business_name, targetListId);
        if (ok) successIds.push(lead.id);
        else failed++;
        await new Promise(r => setTimeout(r, 150)); // evitar rate limit Brevo
    }

    if (successIds.length > 0) {
        await supabase.from('sales_leads').update({ brevo_list_id: targetListId, status: 'brevo_ready' }).in('id', successIds);
    }

    console.log(`[populate] Concluído — ${successIds.length} adicionados, ${failed} falhas → "${targetListName}". Dispare manualmente no Brevo.`);
}

// ─── Entry Point ──────────────────────────────────────────────────────────────

const invokedScript = process.argv[1]?.replace(/\\/g, '/').split('/').pop();
const mode = process.argv[2];

if (invokedScript === 'sites-sales-automation.ts' || invokedScript === 'sites-sales-automation.js') {
    if (mode === 'populate') {
        populateNextList();
    } else {
        runSitesSalesAutomation();
    }
}
