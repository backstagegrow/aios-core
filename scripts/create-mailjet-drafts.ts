/**
 * Cria 3 campanhas draft no Mailjet (S1, S2, S3) para preview visual.
 * NÃO envia — só cria como rascunho para você revisar no painel Mailjet.
 *
 * Usage: npx tsx scripts/create-mailjet-drafts.ts
 */
import { generateBrevoSequence } from '../packages/brand-engine/sales/content-generator.ts';
import { createDraftCampaign } from '../packages/brand-engine/sales/mailjet-client.ts';
import 'dotenv/config';

const SENDER = {
    name:  process.env.MAILJET_SENDER_NAME  || 'Erick Sena',
    email: process.env.MAILJET_SENDER_EMAIL || 'contato.ericksenadesign@gmail.com',
};

const LIST_ID = parseInt(process.env.MAILJET_SITES_LIST_ID || '0', 10);

if (!LIST_ID) {
    console.error('[mailjet-drafts] MAILJET_SITES_LIST_ID não configurado — rode setup-mailjet-list.ts primeiro');
    process.exit(1);
}

// Mailjet usa {{var:name}} para personalização
const SAMPLE_LEAD = {
    id:            999,
    business_name: '{{var:name}}',
    niche:         'clínica odontológica',
    segment:       'sites_selling' as const,
};

async function createDraft(step: 1 | 2 | 3): Promise<void> {
    const copy = generateBrevoSequence(SAMPLE_LEAD, step);
    const name = `[DRAFT] SitesSales_S${step}_${copy.ab_variant}_preview`;

    try {
        const id = await createDraftCampaign(name, copy.subject, copy.html, LIST_ID, SENDER);
        console.log(`[draft] ✓ S${step} criado — ID: ${id} | ${copy.subject}`);
    } catch (err: unknown) {
        const e = err as { message?: string };
        console.error(`[draft] ✗ S${step} falhou:`, e.message ?? err);
    }
}

console.log('[draft] Criando 3 campanhas draft no Mailjet para preview...\n');
await createDraft(1);
await createDraft(2);
await createDraft(3);
console.log('\n[draft] Acesse app.mailjet.com → Campaigns → My campaigns → Drafts para visualizar.');
