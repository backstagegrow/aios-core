/**
 * Cria a mailing list "Sites Sales" no Mailjet e atualiza MAILJET_SITES_LIST_ID no .env.
 * Usage: npx tsx scripts/setup-mailjet-list.ts
 */
import 'dotenv/config';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { createContactList } from '../packages/brand-engine/sales/mailjet-client.ts';

const ENV_PATH = resolve(process.cwd(), '.env');

console.log('[setup-mailjet] Criando lista "Sites Sales"...');
const listId = await createContactList('Sites Sales');
console.log(`[setup-mailjet] ✓ Lista criada — ID: ${listId}`);

const raw     = readFileSync(ENV_PATH, 'utf-8');
const updated = raw.replace(/^MAILJET_SITES_LIST_ID=.*$/m, `MAILJET_SITES_LIST_ID=${listId}`);
writeFileSync(ENV_PATH, updated, 'utf-8');
console.log(`[setup-mailjet] ✓ .env atualizado: MAILJET_SITES_LIST_ID=${listId}`);
console.log('\nPróximo passo: npx tsx scripts/create-mailjet-drafts.ts');
