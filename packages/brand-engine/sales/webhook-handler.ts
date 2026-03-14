/**
 * webhook-handler.ts — Handler para eventos de email (Brevo/Mailchimp webhooks)
 *
 * Processa eventos: open, click, bounce, unsubscribe
 * Atualiza lead-scorer com feedback real de engajamento
 *
 * Usage (Express):
 *   import { createWebhookRouter } from './webhook-handler'
 *   app.use('/webhooks/email', createWebhookRouter())
 *
 * Usage (standalone):
 *   node --loader ts-node/esm webhook-handler.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// --- Types -----------------------------------------------------------------

export type EmailEvent = 'open' | 'click' | 'bounce' | 'unsubscribe' | 'delivered' | 'spam';

export interface WebhookPayload {
    event: EmailEvent;
    email?: string;
    lead_id?: string;
    campaign_id?: string | number;
    timestamp?: string;
    metadata?: Record<string, unknown>;
}

export interface LeadEngagement {
    leadId: string;
    email?: string;
    events: Array<{ event: EmailEvent; at: string; campaignId?: string | number }>;
    score: number; // 0-100 engagement score
    lastEventAt: string;
}

// --- Engagement scoring ----------------------------------------------------

const EVENT_WEIGHTS: Record<EmailEvent, number> = {
    delivered: 2,
    open: 10,
    click: 25,
    unsubscribe: -50,
    bounce: -30,
    spam: -80,
};

function computeEngagementScore(events: LeadEngagement['events']): number {
    const raw = events.reduce((sum, e) => sum + (EVENT_WEIGHTS[e.event] ?? 0), 0);
    return Math.min(100, Math.max(0, raw));
}

// --- State persistence -----------------------------------------------------

const ENGAGEMENT_DIR = path.join(__dirname, '../../../.aios/email-engagement');

function ensureDir() {
    fs.mkdirSync(ENGAGEMENT_DIR, { recursive: true });
}

function getEngagementPath(leadId: string): string {
    return path.join(ENGAGEMENT_DIR, `engagement-${leadId}.json`);
}

function readEngagement(leadId: string): LeadEngagement {
    const p = getEngagementPath(leadId);
    if (!fs.existsSync(p)) {
        return { leadId, events: [], score: 0, lastEventAt: new Date().toISOString() };
    }
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

function writeEngagement(engagement: LeadEngagement): void {
    ensureDir();
    fs.writeFileSync(getEngagementPath(engagement.leadId), JSON.stringify(engagement, null, 2));
}

// --- Core handler ----------------------------------------------------------

export function processWebhookEvent(payload: WebhookPayload): LeadEngagement {
    const leadId = payload.lead_id || payload.email || 'unknown';
    const engagement = readEngagement(leadId);

    engagement.events.push({
        event: payload.event,
        at: payload.timestamp || new Date().toISOString(),
        campaignId: payload.campaign_id,
    });

    if (payload.email && !engagement.email) engagement.email = payload.email;
    engagement.score = computeEngagementScore(engagement.events);
    engagement.lastEventAt = new Date().toISOString();

    writeEngagement(engagement);

    console.log(`[webhook] lead=${leadId} event=${payload.event} score=${engagement.score}`);
    return engagement;
}

export function getLeadEngagement(leadId: string): LeadEngagement {
    return readEngagement(leadId);
}

export function getHighEngagementLeads(minScore = 25): LeadEngagement[] {
    ensureDir();
    return fs.readdirSync(ENGAGEMENT_DIR)
        .filter(f => f.startsWith('engagement-') && f.endsWith('.json'))
        .map(f => JSON.parse(fs.readFileSync(path.join(ENGAGEMENT_DIR, f), 'utf-8')) as LeadEngagement)
        .filter(e => e.score >= minScore)
        .sort((a, b) => b.score - a.score);
}

// --- Express router factory ------------------------------------------------

export function createWebhookRouter() {
    // Lazy import express to avoid hard dependency
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const express = require('express');
    const router = express.Router();

    // Brevo webhook format
    router.post('/brevo', (req: any, res: any) => {
        const events: WebhookPayload[] = Array.isArray(req.body) ? req.body : [req.body];
        const results = events.map(e => processWebhookEvent({
            event: e.event as EmailEvent,
            email: e.email,
            lead_id: e.tags?.lead_id,
            campaign_id: e.campaign_id,
            timestamp: e.date ? new Date(e.date * 1000).toISOString() : undefined,
        }));
        res.json({ processed: results.length, results });
    });

    // Mailchimp webhook format
    router.post('/mailchimp', (req: any, res: any) => {
        const type = req.body.type as string;
        const eventMap: Record<string, EmailEvent> = {
            open: 'open', click: 'click', bounce: 'bounce',
            unsubscribe: 'unsubscribe', subscribe: 'delivered',
        };
        const event = eventMap[type];
        if (!event) return res.json({ skipped: true, type });

        const result = processWebhookEvent({
            event,
            email: req.body.data?.email,
            campaign_id: req.body.data?.campaign_id,
        });
        res.json({ processed: 1, result });
    });

    // Generic webhook
    router.post('/', (req: any, res: any) => {
        const result = processWebhookEvent(req.body as WebhookPayload);
        res.json({ processed: 1, result });
    });

    // Query engagement
    router.get('/engagement/:leadId', (req: any, res: any) => {
        res.json(getLeadEngagement(req.params.leadId));
    });

    router.get('/engagement', (_req: any, res: any) => {
        const minScore = 25;
        res.json(getHighEngagementLeads(minScore));
    });

    return router;
}

// --- Standalone test -------------------------------------------------------

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const testPayload: WebhookPayload = {
        event: 'open',
        email: 'test@empresa.com',
        lead_id: 'test-lead-01',
        campaign_id: 'camp-123',
    };
    const result = processWebhookEvent(testPayload);
    console.log('[webhook-handler] Test result:', JSON.stringify(result, null, 2));
}
