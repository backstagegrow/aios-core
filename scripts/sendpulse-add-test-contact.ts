/**
 * Adiciona contato de teste à lista SendPulse para permitir criar campanhas draft.
 * Usage: npx tsx scripts/sendpulse-add-test-contact.ts
 */
import 'dotenv/config';

const key    = process.env.SENDPULSE_API_KEY || '';
const listId = process.env.SENDPULSE_SITES_LIST_ID || '';
const email  = process.env.SENDPULSE_SENDER_EMAIL || 'contato.ericksenadesign@gmail.com';

if (!key || !listId) {
    console.error('Missing SENDPULSE_API_KEY or SENDPULSE_SITES_LIST_ID');
    process.exit(1);
}

const res = await fetch(`https://api.sendpulse.com/addressbooks/${listId}/emails`, {
    method:  'POST',
    headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({
        emails: [{ email, variables: { name: 'Erick Sena' } }],
    }),
});

console.log('Status:', res.status);
console.log('Response:', await res.text());
