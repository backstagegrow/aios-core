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

export async function createAndSendCampaign(
    campaignName: string,
    subject: string,
    htmlContent: string,
    listIds: number[] = [2] // Default test list
) {
    if (!apiKey.apiKey) {
        console.warn('[Brevo] Missing BREVO_API_KEY in environment.');
        return null;
    }

    try {
        const emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();
        emailCampaigns.name = campaignName;
        emailCampaigns.subject = subject;
        emailCampaigns.sender = { name: 'BKSGrow', email: 'devbksgrow@gmail.com' };
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
