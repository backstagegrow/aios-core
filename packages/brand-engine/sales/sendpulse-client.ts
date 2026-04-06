/**
 * SendPulse REST API v1 client
 * Docs: https://sendpulse.com/api
 *
 * Auth: Static API Key (Bearer token)
 *   SENDPULSE_API_KEY — Settings → API → API Keys → Generate
 *
 * Free plan: 500 subscribers, 15 000 emails/month
 * Leads do Brevo NÃO vão para o SendPulse — listas completamente separadas.
 */
import 'dotenv/config';

const SP_BASE = 'https://api.sendpulse.com';

// ─── HTTP helper ──────────────────────────────────────────────────────────────

function getKey(): string {
    const key = process.env.SENDPULSE_API_KEY || '';
    if (!key) throw new Error('[SendPulse] Missing SENDPULSE_API_KEY in environment.');
    return key;
}

async function sp<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${SP_BASE}${path}`, {
        method,
        headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${getKey()}`,
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`[SendPulse] ${method} ${path} → ${res.status}: ${err}`);
    }
    return res.json() as Promise<T>;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SPSender {
    name:  string;
    email: string;
}

interface SPCampaignResponse { id: number }
interface SPSMTPResponse     { id?: string; result?: boolean }

// ─── Campaigns ────────────────────────────────────────────────────────────────

/**
 * Cria campanha no SendPulse e a envia imediatamente.
 */
export async function createAndSendCampaign(
    campaignName: string,
    subject:      string,
    htmlContent:  string,
    listId:       number,
    sender?:      SPSender,
): Promise<number | null> {
    const resolvedSender: SPSender = sender ?? {
        name:  process.env.SENDPULSE_SENDER_NAME  || 'BKSGrow',
        email: process.env.SENDPULSE_SENDER_EMAIL || 'devbksgrow@gmail.com',
    };

    // send_date no passado → SendPulse despacha imediatamente
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const sendDate = `${now.getUTCFullYear()}-${pad(now.getUTCMonth()+1)}-${pad(now.getUTCDate())} ${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:00`;

    try {
        console.log(`[SendPulse] Creating campaign: ${campaignName}`);
        const created = await sp<SPCampaignResponse>('POST', '/emails', {
            task_name:    campaignName,
            sender_name:  resolvedSender.name,
            sender_email: resolvedSender.email,
            subject,
            body:         htmlContent,
            list_id:      listId,
            send_date:    sendDate,
        });
        console.log(`[SendPulse] Campaign created + sent. ID: ${created.id}`);
        return created.id;
    } catch (error) {
        console.error('[SendPulse] Error creating campaign:', error);
        throw error;
    }
}

/**
 * Cria campanha como rascunho (sem send_date).
 */
export async function createDraftCampaign(
    campaignName: string,
    subject:      string,
    htmlContent:  string,
    listId:       number,
    sender?:      SPSender,
): Promise<number | null> {
    const resolvedSender: SPSender = sender ?? {
        name:  process.env.SENDPULSE_SENDER_NAME  || 'BKSGrow',
        email: process.env.SENDPULSE_SENDER_EMAIL || 'devbksgrow@gmail.com',
    };

    try {
        const created = await sp<SPCampaignResponse>('POST', '/emails', {
            task_name:    campaignName,
            sender_name:  resolvedSender.name,
            sender_email: resolvedSender.email,
            subject,
            body:         htmlContent,
            list_id:      listId,
            // Sem send_date → fica como draft
        });
        console.log(`[SendPulse] Draft created. ID: ${created.id} | ${campaignName}`);
        return created.id;
    } catch (error) {
        console.error('[SendPulse] Error creating draft:', error);
        throw error;
    }
}

/**
 * Dispara uma campanha existente imediatamente.
 */
export async function fireCampaignNow(campaignId: number): Promise<void> {
    try {
        await sp<{ result: boolean }>('POST', `/emails/${campaignId}/send`);
        console.log(`[SendPulse] Campanha ${campaignId} disparada.`);
    } catch (error) {
        console.error(`[SendPulse] Erro ao disparar campanha ${campaignId}:`, error);
        throw error;
    }
}

// ─── Transactional ────────────────────────────────────────────────────────────

/**
 * Envia email transacional via SMTP API do SendPulse.
 */
export async function sendTransactionalEmail(
    to:          { email: string; name?: string },
    subject:     string,
    htmlContent: string,
    sender?:     SPSender,
): Promise<string | null> {
    const resolvedSender: SPSender = sender ?? {
        name:  process.env.SENDPULSE_SENDER_NAME  || 'BKSGrow',
        email: process.env.SENDPULSE_SENDER_EMAIL || 'devbksgrow@gmail.com',
    };

    try {
        const data = await sp<SPSMTPResponse>('POST', '/smtp/emails', {
            email: {
                subject,
                sender: resolvedSender,
                to:     [{ email: to.email, name: to.name ?? '' }],
                html:   htmlContent,
            },
        });
        console.log(`[SendPulse] Email transacional enviado para ${to.email} — id: ${data.id ?? 'ok'}`);
        return data.id ?? null;
    } catch (error) {
        console.error('[SendPulse] Error sending transactional email:', error);
        throw error;
    }
}

// ─── Contacts ─────────────────────────────────────────────────────────────────

/**
 * Adiciona contato a uma mailing list do SendPulse.
 * NÃO importa contatos do Brevo — listas são completamente separadas.
 */
export async function addContactToList(
    email:  string,
    name:   string,
    listId: number,
): Promise<void> {
    try {
        await sp<{ result: boolean }>('POST', `/addressbooks/${listId}/emails`, {
            emails: [{ email, variables: { name } }],
        });
        console.log(`[SendPulse] Contato adicionado: ${email} → lista ${listId}`);
    } catch (error) {
        console.error(`[SendPulse] Erro ao adicionar ${email}:`, error);
    }
}
