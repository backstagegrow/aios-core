/**
 * webhook-server.ts — Servidor HTTP para receber eventos de email
 *
 * Expõe os handlers do webhook-handler.ts via Express.
 * Em produção: use ngrok ou deploy para receber eventos da Brevo/Mailchimp.
 *
 * Usage:
 *   node --loader ts-node/esm webhook-server.ts
 *   node --loader ts-node/esm webhook-server.ts --port 3099
 *
 * Expor via ngrok:
 *   ngrok http 3099
 *   → Copie a URL e configure em Brevo: Settings > Webhooks > URL
 */

import http from 'http';
import { fileURLToPath } from 'url';
import { processWebhookEvent, getLeadEngagement, getHighEngagementLeads } from './webhook-handler.js';

const PORT = parseInt(process.argv[process.argv.indexOf('--port') + 1] || '3099', 10);

// ─── Minimal JSON router (no express dependency) ──────────────────────────────

function parseBody(req: http.IncomingMessage): Promise<unknown> {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try { resolve(body ? JSON.parse(body) : {}); }
            catch (e) { reject(e); }
        });
        req.on('error', reject);
    });
}

function json(res: http.ServerResponse, data: unknown, status = 200) {
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
}

// ─── Server ───────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
    const url = req.url || '/';
    const method = req.method || 'GET';

    // Health check
    if (url === '/health' && method === 'GET') {
        return json(res, { status: 'ok', service: 'webhook-server', ts: new Date().toISOString() });
    }

    // Brevo webhook (POST)
    if (url === '/webhooks/brevo' && method === 'POST') {
        try {
            const body = await parseBody(req) as any;
            const events = Array.isArray(body) ? body : [body];
            const results = events.map(e => processWebhookEvent({
                event: e.event,
                email: e.email,
                lead_id: e.tags?.lead_id,
                campaign_id: e.campaign_id,
                timestamp: e.date ? new Date(e.date * 1000).toISOString() : undefined,
            }));
            return json(res, { processed: results.length, results });
        } catch (e: unknown) {
            return json(res, { error: e instanceof Error ? e.message : String(e) }, 400);
        }
    }

    // Mailchimp webhook (POST)
    if (url === '/webhooks/mailchimp' && method === 'POST') {
        try {
            const body = await parseBody(req) as any;
            const eventMap: Record<string, string> = {
                open: 'open', click: 'click', bounce: 'bounce',
                unsubscribe: 'unsubscribe', subscribe: 'delivered',
            };
            const event = eventMap[body.type];
            if (!event) return json(res, { skipped: true, type: body.type });
            const result = processWebhookEvent({ event: event as any, email: body.data?.email, campaign_id: body.data?.campaign_id });
            return json(res, { processed: 1, result });
        } catch (e: unknown) {
            return json(res, { error: e instanceof Error ? e.message : String(e) }, 400);
        }
    }

    // Generic webhook (POST)
    if (url === '/webhooks' && method === 'POST') {
        try {
            const body = await parseBody(req) as any;
            const result = processWebhookEvent(body);
            return json(res, { processed: 1, result });
        } catch (e: unknown) {
            return json(res, { error: e instanceof Error ? e.message : String(e) }, 400);
        }
    }

    // Query engagement
    if (url.startsWith('/engagement/') && method === 'GET') {
        const leadId = url.replace('/engagement/', '');
        return json(res, getLeadEngagement(leadId));
    }

    if (url === '/engagement' && method === 'GET') {
        return json(res, getHighEngagementLeads(25));
    }

    // 404
    json(res, { error: 'Not found', path: url }, 404);
});

server.listen(PORT, () => {
    console.log(`\n[webhook-server] Running on http://localhost:${PORT}`);
    console.log(`\nEndpoints:`);
    console.log(`  POST http://localhost:${PORT}/webhooks/brevo      ← configure na Brevo`);
    console.log(`  POST http://localhost:${PORT}/webhooks/mailchimp  ← configure no Mailchimp`);
    console.log(`  GET  http://localhost:${PORT}/engagement          ← leads com score >= 25`);
    console.log(`  GET  http://localhost:${PORT}/engagement/:leadId  ← score de lead específico`);
    console.log(`  GET  http://localhost:${PORT}/health\n`);
    console.log(`Para expor via ngrok: npx ngrok http ${PORT}`);
    console.log(`Depois configure a URL em: Brevo > Settings > Webhooks\n`);
});

export default server;
