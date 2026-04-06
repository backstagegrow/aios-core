/**
 * Cria 3 campanhas draft no Brevo (S1, S2, S3) para preview visual.
 * NÃO envia — só cria como rascunho para você revisar no painel Brevo.
 *
 * Usage: npx tsx scripts/create-brevo-drafts.ts
 */

// @ts-expect-error Brevo SDK typings
import SibApiV3Sdk from 'sib-api-v3-sdk';
import { generateBrevoSequence } from '../packages/brand-engine/sales/content-generator.ts';
import 'dotenv/config';

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY || '';

const apiInstance = new SibApiV3Sdk.EmailCampaignsApi();

const SENDER = {
    name:  process.env.SITES_SENDER_NAME  || 'Erick Sena',
    email: process.env.SITES_SENDER_EMAIL || 'contato.ericksenadesign@gmail.com',
};

const LIST_ID = parseInt(process.env.BREVO_SITES_LIST_ID || '7', 10);

// Usa variável do Brevo — substituída pelo business_name de cada contato na lista
const SAMPLE_LEAD = {
    id:            999,
    business_name: '[FIRSTNAME]',
    niche:         'clínica odontológica',
    segment:       'sites_selling' as const,
};

async function createDraft(step: 1 | 2 | 3) {
    const copy = generateBrevoSequence(SAMPLE_LEAD, step);
    const name = `[DRAFT] SitesSales_S${step}_${copy.ab_variant}_preview`;

    const campaign = new SibApiV3Sdk.CreateEmailCampaign();
    campaign.name        = name;
    campaign.subject     = copy.subject;
    campaign.sender      = SENDER;
    campaign.type        = 'classic';
    campaign.htmlContent = copy.html;
    campaign.recipients  = { listIds: [LIST_ID] };
    // Sem scheduledAt → fica como draft

    try {
        const data = await apiInstance.createEmailCampaign(campaign);
        console.log(`[draft] ✓ S${step} criado — ID: ${data.id} | Subject: ${copy.subject}`);
        return data.id;
    } catch (err: unknown) {
        const e = err as { response?: { body?: unknown } };
        console.error(`[draft] ✗ S${step} falhou:`, e.response?.body ?? err);
    }
}

console.log('[draft] Criando 3 campanhas draft no Brevo para preview...\n');
await createDraft(1);
await createDraft(2);
await createDraft(3);
console.log('\n[draft] Acesse app.brevo.com → Campaigns → Email → filtre por "Draft" para visualizar.');
