/**
 * Cria a mailing list "Sites Sales" no SendPulse e atualiza SENDPULSE_SITES_LIST_ID no .env.
 *
 * Usage: npx tsx scripts/setup-sendpulse-list.ts
 */
import 'dotenv/config';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const SP_BASE  = 'https://api.sendpulse.com';
const ENV_PATH = resolve(process.cwd(), '.env');

const key = process.env.SENDPULSE_API_KEY || '';
if (!key) {
    console.error('[setup-sendpulse] SENDPULSE_API_KEY não configurado em .env');
    process.exit(1);
}

async function createAddressbook(name: string): Promise<number> {
    const res = await fetch(`${SP_BASE}/addressbooks`, {
        method: 'POST',
        headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${key}`,
        },
        body: JSON.stringify({ bookName: name }),
    });
    if (!res.ok) {
        const body = await res.text();
        throw new Error(`Create list failed ${res.status}: ${body}`);
    }
    const data = await res.json() as { id: number };
    return data.id;
}

function updateEnv(listId: number): void {
    const raw     = readFileSync(ENV_PATH, 'utf-8');
    const updated = raw.replace(
        /^SENDPULSE_SITES_LIST_ID=.*$/m,
        `SENDPULSE_SITES_LIST_ID=${listId}`,
    );
    writeFileSync(ENV_PATH, updated, 'utf-8');
}

console.log('[setup-sendpulse] Criando mailing list "Sites Sales"...');
const listId = await createAddressbook('Sites Sales');
console.log(`[setup-sendpulse] ✓ Lista criada — ID: ${listId}`);

updateEnv(listId);
console.log(`[setup-sendpulse] ✓ .env atualizado: SENDPULSE_SITES_LIST_ID=${listId}`);
console.log('\nPróximo passo: npx tsx scripts/create-sendpulse-drafts.ts');
