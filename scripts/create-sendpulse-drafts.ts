/**
 * Cria 3 campanhas draft no SendPulse (S1, S2, S3) para preview visual.
 * NÃO envia — só cria como rascunho para você revisar no painel SendPulse.
 *
 * Usage: npx tsx scripts/create-sendpulse-drafts.ts
 *
 * Pré-requisito: configure em .env
 *   SENDPULSE_API_ID       — API User ID   (app.sendpulse.com → Settings → API)
 *   SENDPULSE_API_SECRET   — API Secret    (já configurado)
 *   SENDPULSE_SITES_LIST_ID — ID da mailing list no SendPulse
 */
import { generateBrevoSequence } from '../packages/brand-engine/sales/content-generator.ts';
import { createDraftCampaign } from '../packages/brand-engine/sales/sendpulse-client.ts';
import 'dotenv/config';

const SENDER = {
    name:  process.env.SITES_SENDER_NAME  || 'Erick Sena',
    email: process.env.SITES_SENDER_EMAIL || 'contato.ericksenadesign@gmail.com',
};

const LIST_ID = parseInt(process.env.SENDPULSE_SITES_LIST_ID || '0', 10);

if (!LIST_ID) {
    console.error('[sendpulse-drafts] SENDPULSE_SITES_LIST_ID não configurado em .env');
    process.exit(1);
}

// Usa variável do SendPulse — substituída pelo business_name de cada contato
const SAMPLE_LEAD = {
    id:            999,
    business_name: '{$name}',  // variável de personalização do SendPulse
    niche:         'clínica odontológica',
    segment:       'sites_selling' as const,
};

async function createDraft(step: 1 | 2 | 3): Promise<void> {
    const copy = generateBrevoSequence(SAMPLE_LEAD, step);
    const name = `[DRAFT] SitesSales_S${step}_${copy.ab_variant}_preview`;

    try {
        const id = await createDraftCampaign(
            name,
            copy.subject,
            copy.html,
            LIST_ID,
            SENDER,
        );
        console.log(`[draft] ✓ S${step} criado — ID: ${id} | Subject: ${copy.subject}`);
    } catch {
        console.error(`[draft] ✗ S${step} falhou — verifique SENDPULSE_API_ID e SENDPULSE_API_SECRET`);
    }
}

console.log('[draft] Criando 3 campanhas draft no SendPulse para preview...\n');
await createDraft(1);
await createDraft(2);
await createDraft(3);
console.log('\n[draft] Acesse app.sendpulse.com → Email → Campaigns → Drafts para visualizar.');
