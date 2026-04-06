/**
 * Mailjet Email API client
 * Docs: https://dev.mailjet.com/email/guides/
 *
 * Auth: HTTP Basic (API Key + Secret Key) — sem OAuth, sem token refresh.
 *   MAILJET_API_KEY    — API Key Management page
 *   MAILJET_SECRET_KEY — API Secret Key
 *
 * Free plan: 200 emails/dia · 6 000/mês
 * Leads do Brevo NÃO vão para o Mailjet — listas completamente separadas.
 */
import 'dotenv/config';

const MJ_V3  = 'https://api.mailjet.com/v3/REST';
const MJ_V31 = 'https://api.mailjet.com/v3.1';

// ─── HTTP helper ──────────────────────────────────────────────────────────────

function authHeader(): string {
    const key    = process.env.MAILJET_API_KEY    || '';
    const secret = process.env.MAILJET_SECRET_KEY || '';
    if (!key || !secret) throw new Error('[Mailjet] Missing MAILJET_API_KEY or MAILJET_SECRET_KEY.');
    return 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64');
}

async function mj<T>(method: string, url: string, body?: unknown): Promise<T> {
    const res = await fetch(url, {
        method,
        headers: {
            'Content-Type':  'application/json',
            'Authorization': authHeader(),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    // 304 Not Modified = PUT sem alteração = sucesso
    if (res.status === 304) return {} as T;

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`[Mailjet] ${method} ${url} → ${res.status}: ${err}`);
    }
    // 204 No Content (sendnow returns empty body)
    const text = await res.text();
    return (text ? JSON.parse(text) : {}) as T;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MJSender {
    name:  string;
    email: string;
}

interface MJNewsletterResponse  { Data: Array<{ ID: number; Title: string }> }
interface MJContactListResponse { Data: Array<{ ID: number; Name: string }> }
interface MJSendResponse        { Messages: Array<{ Status: string; To: Array<{ Email: string }> }> }

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Busca ID de draft existente pelo Title exato. Retorna null se não encontrar. */
async function findDraftByTitle(title: string): Promise<number | null> {
    const res = await mj<MJNewsletterResponse>('GET', `${MJ_V3}/newsletter?Status=Draft&Limit=100`);
    const found = res.Data.find(d => d.Title === title);
    return found ? found.ID : null;
}

/** Seta/atualiza conteúdo HTML de uma newsletter existente. */
async function setContent(id: number, htmlContent: string): Promise<void> {
    await mj('POST', `${MJ_V3}/newsletter/${id}/detailcontent`, {
        'Html-part': htmlContent,
        'Text-part': '',
    });
}

/**
 * Upsert: atualiza draft existente pelo Title ou cria novo.
 * Garante que rodar o script N vezes não acumula duplicatas.
 */
async function upsertNewsletter(
    campaignName: string,
    subject:      string,
    htmlContent:  string,
    listId:       number,
    sender:       { name: string; email: string },
): Promise<number> {
    const existingId = await findDraftByTitle(campaignName);

    let id: number;
    if (existingId) {
        // Atualiza metadados do draft existente
        await mj('PUT', `${MJ_V3}/newsletter/${existingId}`, {
            Subject:        subject,
            SenderName:     sender.name,
            SenderEmail:    sender.email,
            ContactsListID: listId,
        });
        id = existingId;
    } else {
        const created = await mj<MJNewsletterResponse>('POST', `${MJ_V3}/newsletter`, {
            Locale:         'pt_BR',
            Title:          campaignName,
            Subject:        subject,
            SenderName:     sender.name,
            SenderEmail:    sender.email,
            ContactsListID: listId,
        });
        id = created.Data[0].ID;
    }

    await setContent(id, htmlContent);
    return id;
}

// ─── Campaigns ────────────────────────────────────────────────────────────────

/**
 * Cria campanha no Mailjet e envia imediatamente.
 */
export async function createAndSendCampaign(
    campaignName: string,
    subject:      string,
    htmlContent:  string,
    listId:       number,
    sender?:      MJSender,
): Promise<number | null> {
    const resolvedSender = sender ?? {
        name:  process.env.MAILJET_SENDER_NAME  || 'BKSGrow',
        email: process.env.MAILJET_SENDER_EMAIL || 'devbksgrow@gmail.com',
    };

    try {
        console.log(`[Mailjet] Creating campaign: ${campaignName}`);
        const id = await upsertNewsletter(campaignName, subject, htmlContent, listId, resolvedSender);
        console.log(`[Mailjet] Newsletter created. ID: ${id}`);

        await mj('POST', `${MJ_V3}/newsletter/${id}/sendnow`, {});
        console.log(`[Mailjet] Campaign ${id} sent.`);
        return id;
    } catch (error) {
        console.error('[Mailjet] Error creating/sending campaign:', error);
        throw error;
    }
}

/**
 * Cria campanha como rascunho (sem enviar).
 */
export async function createDraftCampaign(
    campaignName: string,
    subject:      string,
    htmlContent:  string,
    listId:       number,
    sender?:      MJSender,
): Promise<number | null> {
    const resolvedSender = sender ?? {
        name:  process.env.MAILJET_SENDER_NAME  || 'BKSGrow',
        email: process.env.MAILJET_SENDER_EMAIL || 'devbksgrow@gmail.com',
    };

    try {
        const id = await upsertNewsletter(campaignName, subject, htmlContent, listId, resolvedSender);
        console.log(`[Mailjet] Draft created. ID: ${id} | ${campaignName}`);
        return id;
    } catch (error) {
        console.error('[Mailjet] Error creating draft:', error);
        throw error;
    }
}

/**
 * Dispara uma campanha existente imediatamente.
 */
export async function fireCampaignNow(campaignId: number): Promise<void> {
    try {
        await mj('POST', `${MJ_V3}/newsletter/${campaignId}/sendnow`, {});
        console.log(`[Mailjet] Campanha ${campaignId} disparada.`);
    } catch (error) {
        console.error(`[Mailjet] Erro ao disparar campanha ${campaignId}:`, error);
        throw error;
    }
}

// ─── Transactional ────────────────────────────────────────────────────────────

/**
 * Envia email transacional via Mailjet Send API v3.1.
 */
export async function sendTransactionalEmail(
    to:          { email: string; name?: string },
    subject:     string,
    htmlContent: string,
    sender?:     MJSender,
): Promise<string | null> {
    const resolvedSender = sender ?? {
        name:  process.env.MAILJET_SENDER_NAME  || 'BKSGrow',
        email: process.env.MAILJET_SENDER_EMAIL || 'devbksgrow@gmail.com',
    };

    try {
        const data = await mj<MJSendResponse>('POST', `${MJ_V31}/send`, {
            Messages: [{
                From:     { Email: resolvedSender.email, Name: resolvedSender.name },
                To:       [{ Email: to.email, Name: to.name ?? '' }],
                Subject:  subject,
                HTMLPart: htmlContent,
            }],
        });
        const status = data.Messages[0]?.Status ?? 'unknown';
        console.log(`[Mailjet] Email enviado para ${to.email} — status: ${status}`);
        return status;
    } catch (error) {
        console.error('[Mailjet] Error sending transactional email:', error);
        throw error;
    }
}

// ─── Contacts ─────────────────────────────────────────────────────────────────

/**
 * Adiciona contato a uma lista do Mailjet.
 * NÃO importa contatos do Brevo — listas são completamente separadas.
 */
export async function addContactToList(
    email:  string,
    name:   string,
    listId: number,
): Promise<void> {
    try {
        await mj('POST', `${MJ_V3}/contactslist/${listId}/managecontact`, {
            Email:      email,
            Name:       name,
            Action:     'addnoforce',
            Properties: { name },
        });
        console.log(`[Mailjet] Contato adicionado: ${email} → lista ${listId}`);
    } catch (error) {
        console.error(`[Mailjet] Erro ao adicionar ${email}:`, error);
    }
}

// ─── List management ──────────────────────────────────────────────────────────

/**
 * Cria uma nova lista de contatos no Mailjet.
 */
export async function createContactList(name: string): Promise<number> {
    const data = await mj<MJContactListResponse>('POST', `${MJ_V3}/contactslist`, { Name: name });
    return data.Data[0].ID;
}
