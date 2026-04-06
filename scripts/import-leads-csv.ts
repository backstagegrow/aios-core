import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { createBrevoList } from '../packages/brand-engine/sales/brevo-client.ts';
import 'dotenv/config';

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const BATCH_SIZE = parseInt(process.env.SITES_IMPORT_BATCH || '300', 10);
const BREVO_FOLDER_ID = parseInt(process.env.BREVO_SITES_FOLDER_ID || '1', 10);

// Gera nomes únicos para as listas desta wave
const waveDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const WAVE_LIST_A_NAME = `SitesSales_Wave_${waveDate}_A`;
const WAVE_LIST_B_NAME = `SitesSales_Wave_${waveDate}_B`;

// ─── Email validation ─────────────────────────────────────────────────────────

// TLDs de arquivo — qualquer domínio que termine assim não é email real
const FILE_EXTENSION_TLD = /\.(png|gif|svg|jpg|jpeg|webp|ico|bmp|tiff?|raw|psd|ai|eps|pdf|zip|rar|gz|tar|7z|mp4|avi|mov|mp3|wav|doc|docx|xls|xlsx|ppt|pptx|txt|csv|xml|json|js|ts|css|html?|php|py|rb|java|exe|dll|apk|dmg|ttf|otf|woff2?)$/i;
const PLACEHOLDER_EMAILS = /^(exemplo|example|yourmail|yourname|seu\.email|^email@|info@new|info@meusite|info@mysite|test@|noreply@)/i;
const FAKE_DOMAINS = /(gserviceaccount\.com|sentry\.io|mailservice\.com)$/i;

function isValidEmail(email: string): boolean {
    if (!email || email.includes('%20')) return false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return false;
    const domain = email.split('@')[1];
    if (FILE_EXTENSION_TLD.test(domain)) return false;
    if (PLACEHOLDER_EMAILS.test(email)) return false;
    if (FAKE_DOMAINS.test(domain)) return false;
    return true;
}

// ─── Parse CSV line respeitando aspas ─────────────────────────────────────────

function parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
        if (char === '"') { inQuotes = !inQuotes; continue; }
        if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; continue; }
        current += char;
    }
    result.push(current.trim());
    return result;
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function importCsv(csvPath: string) {
    console.log(`[import] Lendo CSV: ${csvPath}`);
    const raw = readFileSync(csvPath, 'utf-8');
    const lines = raw.trim().split('\n');
    const headers = parseCsvLine(lines[0]);
    console.log(`[import] ${lines.length - 1} leads encontrados no CSV`);

    // Cria 2 novas listas Brevo para esta wave
    console.log(`[import] Criando listas Brevo para wave ${waveDate}...`);
    const LIST_A_ID = await createBrevoList(WAVE_LIST_A_NAME, BREVO_FOLDER_ID);
    const LIST_B_ID = await createBrevoList(WAVE_LIST_B_NAME, BREVO_FOLDER_ID);
    console.log(`[import] Lista A: ${LIST_A_ID} | Lista B: ${LIST_B_ID}`);

    let imported = 0;
    let importedA = 0;
    let importedB = 0;
    let skipped = 0;
    let errors = 0;

    for (let i = 1; i < lines.length; i++) {
        const values = parseCsvLine(lines[i]);
        const row: Record<string, string> = {};
        headers.forEach((h, idx) => { row[h] = values[idx] || ''; });

        // Só importa leads com email válido
        if (!isValidEmail(row['email']?.trim() || '')) {
            skipped++;
            continue;
        }

        // Monta objeto para Supabase (CSV usa headers em português)
        const brevo_list_id = imported < BATCH_SIZE ? LIST_A_ID : LIST_B_ID;
        const lead = {
            business_name: row['empresa'] || row['business_name'] || '',
            phone:         row['telefone'] || row['phone'] || null,
            email:         row['email'] || null,
            website:       row['site'] || row['website'] || null,
            instagram_url: row['instagram'] || null,
            linkedin_url:  row['linkedin'] || null,
            google_maps_url: row['google_maps_url'] || null,
            location:      row['cidade'] || null,
            niche:         row['nicho'] || row['niche'] || null,
            status:        row['status'] || 'no_website',
            client_id:     'SitesSales',
            current_step:  0,
            brevo_list_id,
        };

        if (!lead.business_name) { skipped++; continue; }

        const { error } = await supabase
            .from('sales_leads')
            .upsert(lead, { onConflict: 'google_maps_url' });

        if (error) {
            console.error(`[import] Erro: ${lead.business_name} — ${error.message}`);
            errors++;
        } else {
            console.log(`[import] ✓ ${lead.business_name} (${lead.status}) [Lista ${brevo_list_id === LIST_A_ID ? 'A' : 'B'}]`);
            if (brevo_list_id === LIST_A_ID) importedA++;
            else importedB++;
            imported++;
        }
    }

    console.log(`\n[import] Concluído: ${imported} importados (${importedA} lista A / ${importedB} lista B) | ${skipped} ignorados | ${errors} erros`);
}

// ─── Entry point ──────────────────────────────────────────────────────────────

const csvArg = process.argv[2];
if (!csvArg) {
    // Auto: pega o CSV mais recente em scripts/output/
    const { readdirSync } = await import('fs');
    const outputDir = join(process.cwd(), 'scripts', 'output');
    const files = readdirSync(outputDir)
        .filter(f => f.startsWith('leads-sites-') && f.endsWith('.csv'))
        .sort()
        .reverse();
    if (files.length === 0) {
        console.error('[import] Nenhum CSV encontrado em scripts/output/');
        process.exit(1);
    }
    const latest = join(outputDir, files[0]);
    console.log(`[import] CSV mais recente: ${files[0]}`);
    await importCsv(latest);
} else {
    await importCsv(csvArg);
}
