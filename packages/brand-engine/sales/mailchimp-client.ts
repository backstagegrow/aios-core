import axios from 'axios';
import 'dotenv/config';

type MailchimpError = {
    response?: {
        data?: {
            title?: string;
        };
    };
    message?: string;
};

function getMailchimpError(error: unknown): MailchimpError {
    if (typeof error === 'object' && error !== null) {
        return error as MailchimpError;
    }

    return { message: String(error) };
}

// Ensure .env has: MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID, MAILCHIMP_SERVER_PREFIX
const API_KEY = process.env.MAILCHIMP_API_KEY || '';
const LIST_ID = process.env.MAILCHIMP_LIST_ID || '';
const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX || ''; // e.g. 'us19'

if (!API_KEY || !LIST_ID || !SERVER_PREFIX) {
    console.warn('[Mailchimp] Missing credentials in environment variables.');
}

const mailchimpClient = axios.create({
    baseURL: `https://${SERVER_PREFIX}.api.mailchimp.com/3.0`,
    headers: {
        Authorization: `apikey ${API_KEY}`,
        'Content-Type': 'application/json'
    }
});

export async function addLeadToAudience(email: string, firstName: string, businessName: string) {
    console.log(`[Mailchimp] Adding ${email} to audience...`);
    try {
        const response = await mailchimpClient.post(`/lists/${LIST_ID}/members`, {
            email_address: email,
            status: 'subscribed', // or 'pending' for double opt-in
            merge_fields: {
                FNAME: firstName,
                BNAME: businessName
            }
        });
        return response.data;
    } catch (e: unknown) {
        const error = getMailchimpError(e);
        if (error.response?.data?.title === 'Member Exists') {
            console.log(`[Mailchimp] Lead ${email} already exists.`);
            return { status: 'exists' };
        }
        console.error(`[Mailchimp] Error adding lead:`, error.response?.data || error.message);
        throw e;
    }
}

export async function checkMailchimpHealth() {
    try {
        const response = await mailchimpClient.get('/ping');
        return response.data;
    } catch (e: unknown) {
        const error = getMailchimpError(e);
        return { error: error.message || 'Unknown Mailchimp error' };
    }
}
