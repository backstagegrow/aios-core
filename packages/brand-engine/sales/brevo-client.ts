// @ts-expect-error Brevo SDK does not ship compatible typings for this import style.
import SibApiV3Sdk from 'sib-api-v3-sdk';
import 'dotenv/config';

type ApiError = {
    response?: {
        body?: unknown;
    };
};

function hasApiErrorShape(error: unknown): error is ApiError {
    return typeof error === 'object' && error !== null;
}

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY || '';

const apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
const transactionalApi = new SibApiV3Sdk.TransactionalEmailsApi();
const contactsApi = new SibApiV3Sdk.ContactsApi();
const listsApi = new SibApiV3Sdk.ContactsApi();

export interface BrevoSender {
    name: string;
    email: string;
}

export async function createAndSendCampaign(
    campaignName: string,
    subject: string,
    htmlContent: string,
    listIds: number[] = [2], // Default test list
    sender?: BrevoSender
) {
    if (!apiKey.apiKey) {
        console.warn('[Brevo] Missing BREVO_API_KEY in environment.');
        return null;
    }

    const resolvedSender: BrevoSender = sender ?? {
        name: process.env.BREVO_SENDER_NAME || 'BKSGrow',
        email: process.env.BREVO_SENDER_EMAIL || 'devbksgrow@gmail.com',
    };

    try {
        const emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();
        emailCampaigns.name = campaignName;
        emailCampaigns.subject = subject;
        emailCampaigns.sender = resolvedSender;
        emailCampaigns.type = 'classic';
        emailCampaigns.htmlContent = htmlContent;
        emailCampaigns.recipients = { listIds: listIds };
        // Schedule for immediate sending by omitting scheduledAt or setting it slightly in the future

        console.log(`[Brevo] Creating campaign: ${campaignName}`);
        const data = await apiInstance.createEmailCampaign(emailCampaigns);
        console.log('[Brevo] Campaign created successfully as draft. ID:', data.id);

        console.log(`[Brevo] Triggering immediate dispatch for Campaign ID: ${data.id}...`);
        await apiInstance.sendEmailCampaignNow(data.id);
        console.log('[Brevo] Campaign sent to outbox successfully!');

        // Note: For small scales, Brevo allows sending right after creation via another API call,
        // or you can set it to send now. The create call usually puts it in draft unless scheduled.
        // We'll return the ID so the orchestrator can track it.
        return data.id;

    } catch (error: unknown) {
        console.error('[Brevo] Error creating campaign:');
        if (hasApiErrorShape(error) && error.response?.body) {
            console.error(error.response.body);
        } else {
            console.error(error);
        }
        throw error;
    }
}

export async function sendTransactionalEmail(
    to: { email: string; name?: string },
    subject: string,
    htmlContent: string,
    sender?: BrevoSender
) {
    if (!apiKey.apiKey) {
        console.warn('[Brevo] Missing BREVO_API_KEY in environment.');
        return null;
    }

    const resolvedSender: BrevoSender = sender ?? {
        name: process.env.BREVO_SENDER_NAME || 'BKSGrow',
        email: process.env.BREVO_SENDER_EMAIL || 'devbksgrow@gmail.com',
    };

    try {
        const email = new SibApiV3Sdk.SendSmtpEmail();
        email.to = [to];
        email.subject = subject;
        email.sender = resolvedSender;
        email.htmlContent = htmlContent;

        const data = await transactionalApi.sendTransacEmail(email);
        console.log(`[Brevo] Email transacional enviado para ${to.email} — messageId: ${data.messageId}`);
        return data.messageId;
    } catch (error: unknown) {
        console.error('[Brevo] Error sending transactional email:');
        if (hasApiErrorShape(error) && error.response?.body) {
            console.error(error.response.body);
        } else {
            console.error(error);
        }
        throw error;
    }
}

export async function addContactToList(email: string, name: string, listId: number): Promise<boolean> {
    try {
        const contact = new SibApiV3Sdk.CreateContact();
        contact.email = email;
        contact.attributes = { FIRSTNAME: name };
        contact.listIds = [listId];
        contact.updateEnabled = true;
        await contactsApi.createContact(contact);
        console.log(`[Brevo] ✓ ${email} → lista ${listId}`);
        return true;
    } catch (error: unknown) {
        const body = hasApiErrorShape(error) && error.response?.body ? error.response.body : error;
        console.error(`[Brevo] ✗ Erro ao adicionar ${email} → lista ${listId}:`, JSON.stringify(body));
        return false;
    }
}

export async function getBrevoLists(limit = 50, offset = 0): Promise<Array<{ id: number; name: string; uniqueSubscribers: number }>> {
    const data = await listsApi.getLists(limit, undefined, offset);
    return (data.lists || []) as Array<{ id: number; name: string; uniqueSubscribers: number }>;
}

export async function createBrevoList(name: string, folderId: number = 1): Promise<number> {
    const list = new SibApiV3Sdk.CreateList();
    list.name = name;
    list.folderId = folderId;
    const data = await listsApi.createList(list);
    console.log(`[Brevo] Lista criada: "${name}" → ID ${data.id}`);
    return data.id as number;
}

export async function fireCampaignNow(campaignId: number) {
    try {
        await apiInstance.sendEmailCampaignNow(campaignId);
        console.log(`[Brevo] Campanha ${campaignId} disparada.`);
    } catch (error: unknown) {
        if (hasApiErrorShape(error) && error.response?.body) {
            console.error(`[Brevo] Erro ao disparar campanha ${campaignId}:`, error.response.body);
        } else {
            console.error(`[Brevo] Erro ao disparar campanha ${campaignId}:`, error);
        }
        throw error;
    }
}
