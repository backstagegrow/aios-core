/**
 * webhooks.cjs — Gerenciamento de Webhooks no ClickUp
 *
 * Cria, lista e deleta webhooks para o AIOS reagir a eventos em tempo real.
 *
 * Uso:
 *   node scripts/webhooks.cjs --list
 *   node scripts/webhooks.cjs --create --url "https://seu-endpoint.com/webhook" --events "taskStatusUpdated,taskCreated"
 *   node scripts/webhooks.cjs --create --url "https://..." --events "taskStatusUpdated" --list-id <list_id>
 *   node scripts/webhooks.cjs --delete --webhook <webhook_id>
 *
 * Eventos disponíveis (mais comuns):
 *   taskCreated         — Task criada
 *   taskUpdated         — Task atualizada
 *   taskDeleted         — Task deletada
 *   taskStatusUpdated   — Status mudou (mais útil para gate de qualidade)
 *   taskAssigneeUpdated — Assignee mudou
 *   taskCommentPosted   — Comentário novo
 *   taskDueDateUpdated  — Data de entrega mudou
 *
 * Workspace ID: 90132645314
 */

const path = require('path');
const https = require('https');
const fs = require('fs');

function loadEnv() {
    const envPath = path.resolve(__dirname, '..', '.env');
    try {
        const content = fs.readFileSync(envPath, 'utf-8');
        for (const line of content.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const eqIndex = trimmed.indexOf('=');
            if (eqIndex === -1) continue;
            const key = trimmed.slice(0, eqIndex).trim();
            const value = trimmed.slice(eqIndex + 1).trim();
            if (!process.env[key]) process.env[key] = value;
        }
    } catch { }
}

loadEnv();

const API_KEY = process.env.CLICKUP_API_KEY;
const WORKSPACE_ID = process.env.CLICKUP_WORKSPACE_ID || '90132645314';

if (!API_KEY) { console.error('❌ CLICKUP_API_KEY not found.'); process.exit(1); }

function clickupRequest(method, apiPath, body) {
    return new Promise((resolve, reject) => {
        const bodyStr = body ? JSON.stringify(body) : null;
        const options = {
            hostname: 'api.clickup.com',
            port: 443,
            path: `/api/v2${apiPath}`,
            method,
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/json',
                ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}),
            },
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                let parsed;
                try { parsed = JSON.parse(data); } catch { parsed = data; }
                if (res.statusCode >= 200 && res.statusCode < 300) resolve(parsed);
                else {
                    const err = new Error(`ClickUp API Error: ${res.statusCode}`);
                    err.status = res.statusCode;
                    err.data = parsed;
                    reject(err);
                }
            });
        });
        req.on('error', reject);
        if (bodyStr) req.write(bodyStr);
        req.end();
    });
}

function parseArgs() {
    const args = process.argv.slice(2);
    const result = {};
    for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith('--')) {
            const key = args[i].slice(2);
            const next = args[i + 1];
            if (next && !next.startsWith('--')) { result[key] = next; i++; }
            else result[key] = true;
        }
    }
    return result;
}

async function main() {
    const args = parseArgs();

    try {
        if (args.list) {
            const res = await clickupRequest('GET', `/team/${WORKSPACE_ID}/webhook`);
            const webhooks = res.webhooks || [];
            if (!webhooks.length) { console.log('Nenhum webhook registrado.'); return; }
            console.log(`\n🔔 Webhooks ativos (Workspace ${WORKSPACE_ID})\n`);
            for (const w of webhooks) {
                console.log(`  [${w.id}] ${w.endpoint}`);
                console.log(`         Eventos: ${(w.events || []).join(', ')}`);
                console.log(`         Status: ${w.health?.status || '?'} | Falhas: ${w.health?.fail_count || 0}`);
            }

        } else if (args.create) {
            if (!args.url) { console.error('❌ Informe --url "https://..."'); process.exit(1); }
            if (!args.events) { console.error('❌ Informe --events "taskStatusUpdated,taskCreated"'); process.exit(1); }

            const body = {
                endpoint: args.url,
                events: args.events.split(',').map(e => e.trim()),
            };

            // Filtro opcional por lista
            if (args['list-id']) {
                body.filters = { list_id: [args['list-id']] };
            }

            const res = await clickupRequest('POST', `/team/${WORKSPACE_ID}/webhook`, body);
            console.log(`✅ Webhook criado!`);
            console.log(`   ID: ${res.id}`);
            console.log(`   Secret: ${res.secret} (guarde para validar assinatura)`);
            console.log(`   Endpoint: ${args.url}`);
            console.log(`   Eventos: ${args.events}`);

        } else if (args.delete) {
            if (!args.webhook) { console.error('❌ Informe --webhook <webhook_id>'); process.exit(1); }
            await clickupRequest('DELETE', `/webhook/${args.webhook}`);
            console.log(`✅ Webhook ${args.webhook} deletado!`);

        } else {
            console.error('❌ Informe uma ação: --list, --create ou --delete');
            console.error('\nEventos úteis: taskStatusUpdated, taskCreated, taskUpdated, taskCommentPosted');
            process.exit(1);
        }
    } catch (err) {
        console.error(`\n❌ Erro: ${err.message}`);
        if (err.data) console.error('Detalhes:', JSON.stringify(err.data, null, 2));
        process.exit(1);
    }
}

main();
