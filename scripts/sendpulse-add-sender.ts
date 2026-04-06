/**
 * Registra o sender email no SendPulse.
 * Após rodar, verifique o email de confirmação e clique no link.
 * Depois rode: npx tsx scripts/create-sendpulse-drafts.ts
 *
 * Usage: npx tsx scripts/sendpulse-add-sender.ts
 */
import 'dotenv/config';

const key   = process.env.SENDPULSE_API_KEY    || '';
const name  = process.env.SENDPULSE_SENDER_NAME  || 'Erick Sena';
const email = process.env.SENDPULSE_SENDER_EMAIL || 'contato.ericksenadesign@gmail.com';

if (!key) { console.error('Missing SENDPULSE_API_KEY'); process.exit(1); }

console.log(`[sendpulse-sender] Registrando sender: ${name} <${email}>`);

const res = await fetch('https://api.sendpulse.com/senders', {
    method:  'POST',
    headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({ name, email }),
});

const body = await res.text();
console.log('Status:', res.status);
console.log('Response:', body);

if (res.ok || res.status === 400) {
    console.log('\n→ Verifique a caixa de entrada de ' + email);
    console.log('→ Clique no link de confirmação do SendPulse');
    console.log('→ Depois rode: npx tsx scripts/create-sendpulse-drafts.ts');
}
