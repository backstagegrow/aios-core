import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { config } from 'dotenv';

config();

// ─── Config ──────────────────────────────────────────────────────────────────

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const CHIPS_COUNT = parseInt(process.env.WHATSAPP_CHIPS_COUNT || '3', 10);
const MAX_PER_CHIP = 50;
const TOTAL_LIMIT = CHIPS_COUNT * MAX_PER_CHIP;
const CLIENT_ID = 'SitesSales';
const DELAY_MIN = 45;
const DELAY_MAX = 180;

// ─── Types ───────────────────────────────────────────────────────────────────

interface SalesLead {
    id: string;
    business_name: string;
    phone: string;
    niche: string;
    status: string;
}

interface QueueEntry {
    phone: string;
    business_name: string;
    niche: string;
    message: string;
    delay_seconds: number;
    status_original: string;
    lead_id: string;
}

// ─── Message Templates ──────────────────────────────────────────────────────

function generateMessage(lead: SalesLead): string {
    if (lead.status === 'no_website') {
        return `Oi, falo com ${lead.business_name}?`;
    }

    if (lead.status === 'broken_website') {
        return `Oi, falo com ${lead.business_name}? Vi que o site de vocês não está abrindo`;
    }

    return `Oi, falo com ${lead.business_name}?`;
}

// ─── Delay Generator ────────────────────────────────────────────────────────

function randomDelay(): number {
    const range = DELAY_MAX - DELAY_MIN;
    const randomBytes = crypto.randomBytes(4);
    const randomValue = randomBytes.readUInt32BE(0) / 0xFFFFFFFF;
    return Math.floor(DELAY_MIN + randomValue * range);
}

// ─── CSV Export ──────────────────────────────────────────────────────────────

function escapeCsv(value: string): string {
    return `"${(value || '').replace(/"/g, '""')}"`;
}

function writeCsvFile(filePath: string, entries: QueueEntry[]): void {
    const header = 'phone,business_name,niche,message,delay_seconds,status_original,lead_id\n';
    const rows = entries.map(e =>
        [
            escapeCsv(e.phone),
            escapeCsv(e.business_name),
            escapeCsv(e.niche),
            escapeCsv(e.message),
            String(e.delay_seconds),
            escapeCsv(e.status_original),
            escapeCsv(e.lead_id),
        ].join(',')
    ).join('\n');

    fs.writeFileSync(filePath, header + rows + '\n', 'utf8');
}

// ─── Summary ─────────────────────────────────────────────────────────────────

function writeSummary(summaryPath: string, date: string, chips: QueueEntry[][], totalLeads: number): void {
    const lines: string[] = [
        `=== WhatsApp Queue ${date} ===`,
        `Total leads: ${totalLeads}`,
    ];

    for (let i = 0; i < chips.length; i++) {
        lines.push(`Chip ${i + 1}: ${chips[i].length} mensagens → whatsapp-chip${i + 1}-${date}.csv`);
    }

    const queued = chips.reduce((sum, chip) => sum + chip.length, 0);
    const remaining = totalLeads - queued;
    if (remaining > 0) {
        lines.push(`Restantes em fila: ${remaining} (executar amanha)`);
    }

    lines.push('');
    fs.writeFileSync(summaryPath, lines.join('\n'), 'utf8');
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
    console.log('[whatsapp-queue] Iniciando geração de filas...');
    console.log(`[whatsapp-queue] Config: ${CHIPS_COUNT} chips, max ${MAX_PER_CHIP}/chip, limite ${TOTAL_LIMIT} leads`);

    // 1. Fetch leads with priority ordering
    //    no_website first, then broken_website
    const { data: leads, error } = await supabase
        .from('sales_leads')
        .select('id, business_name, phone, niche, status')
        .eq('client_id', CLIENT_ID)
        .not('phone', 'is', null)
        .neq('phone', '')
        .in('status', ['no_website', 'broken_website'])
        .or('whatsapp_queued.is.null,whatsapp_queued.eq.false')
        .order('status', { ascending: true })
        .limit(TOTAL_LIMIT);

    if (error) {
        console.error('[whatsapp-queue] Erro ao buscar leads:', error.message);
        process.exit(1);
    }

    if (!leads || leads.length === 0) {
        console.log('[whatsapp-queue] Nenhum lead encontrado para processar.');
        return;
    }

    // Sort: no_website first (ascending alphabetical puts 'broken_website' before 'no_website')
    // We need explicit sort: no_website first
    const sorted = leads.sort((a: SalesLead, b: SalesLead) => {
        if (a.status === 'no_website' && b.status !== 'no_website') return -1;
        if (a.status !== 'no_website' && b.status === 'no_website') return 1;
        return 0;
    });

    console.log(`[whatsapp-queue] ${sorted.length} leads encontrados (${sorted.filter((l: SalesLead) => l.status === 'no_website').length} no_website, ${sorted.filter((l: SalesLead) => l.status === 'broken_website').length} broken_website)`);

    // 2. Generate queue entries
    const allEntries: QueueEntry[] = sorted.map((lead: SalesLead) => ({
        phone: lead.phone,
        business_name: lead.business_name,
        niche: lead.niche || '',
        message: generateMessage(lead),
        delay_seconds: randomDelay(),
        status_original: lead.status,
        lead_id: lead.id,
    }));

    // 3. Split into chips (max MAX_PER_CHIP each)
    const chips: QueueEntry[][] = [];
    for (let i = 0; i < CHIPS_COUNT; i++) {
        const start = i * MAX_PER_CHIP;
        const end = start + MAX_PER_CHIP;
        const chipEntries = allEntries.slice(start, end);
        if (chipEntries.length > 0) {
            chips.push(chipEntries);
        }
    }

    // 4. Export CSV files
    const outputDir = path.resolve('scripts/output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const date = new Date().toISOString().slice(0, 10);

    for (let i = 0; i < chips.length; i++) {
        const filePath = path.join(outputDir, `whatsapp-chip${i + 1}-${date}.csv`);
        writeCsvFile(filePath, chips[i]);
        console.log(`[whatsapp-queue] Chip ${i + 1}: ${chips[i].length} mensagens → ${filePath}`);
    }

    // 5. Summary file
    const summaryPath = path.join(outputDir, `whatsapp-summary-${date}.txt`);
    writeSummary(summaryPath, date, chips, sorted.length);
    console.log(`[whatsapp-queue] Resumo → ${summaryPath}`);

    // 6. Mark leads as queued in Supabase
    const queuedIds = chips.flat().map(e => e.lead_id);

    if (queuedIds.length > 0) {
        const { error: updateError } = await supabase
            .from('sales_leads')
            .update({
                whatsapp_queued: true,
                whatsapp_queued_at: new Date().toISOString(),
            })
            .in('id', queuedIds);

        if (updateError) {
            console.error('[whatsapp-queue] Erro ao atualizar leads:', updateError.message);
        } else {
            console.log(`[whatsapp-queue] ${queuedIds.length} leads marcados como whatsapp_queued=true`);
        }
    }

    console.log('[whatsapp-queue] Concluido.');
}

// ─── Entry Point ─────────────────────────────────────────────────────────────

const invokedScript = process.argv[1]?.replace(/\\/g, '/').split('/').pop();

if (invokedScript === 'whatsapp-queue.ts' || invokedScript === 'whatsapp-queue.js') {
    main().catch(err => {
        console.error('[whatsapp-queue] Erro fatal:', err);
        process.exit(1);
    });
}

export { main as runWhatsAppQueue };
