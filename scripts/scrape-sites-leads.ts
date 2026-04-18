import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios no .env — abortando.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── ICP Erick Sena — Pequenos negócios que precisam de site ─────────────────
// Ordem de prioridade: maior poder de compra + dor clara + decisão solo

const NICHES = [
    // ── TIER 1: Maior conversão — poder de compra + dor imediata ──────────────
    'clínica odontológica',
    'dentista',
    'psicólogo particular',
    'escritório de advocacia',
    'advogado autônomo',
    'escritório de contabilidade',
    'contador autônomo',
    'clínica médica',
    'médico particular',
    'clínica de dermatologia',
    'clínica de ortopedia',
    'clínica de cardiologia',
    'clínica de ginecologia',
    'clínica de oftalmologia',
    'nutricionista particular',

    // ── TIER 2: Alto volume + presença digital fraca ──────────────────────────
    'agência de marketing',
    'agência de publicidade',
    'agência de tráfego pago',
    'agência de design',
    'agência de redes sociais',
    'clínica de fisioterapia',
    'fisioterapeuta autônomo',
    'clínica veterinária',
    'clínica de estética',
    'clínica de estética corporal',
    'escritório de arquitetura',
    'arquiteto autônomo',
    'designer de interiores',
    'personal trainer',
    'centro de pilates',

    // ── TIER 3: Volume para escalar ───────────────────────────────────────────
    'clínica de nutrição',
    'clínica de psicologia',
    'assessoria financeira',
    'consultoria empresarial',
    'corretora de seguros',
    'corretor de imóveis autônomo',
    'imobiliária',

    // Beleza & Estética
    'salão de beleza',
    'barbearia',
    'studio de sobrancelhas',
    'spa',
    'studio de yoga',
    'academia de musculação',

    // Jurídico & Financeiro (demais)
    'despachante',
    'escritório de engenharia',

    // Educação
    'escola de idiomas',
    'escola de reforço escolar',
    'escola de música',
    'escola de dança',
    'escola de artes marciais',
    'escola de natação',
    'curso de informática',
    'escola de culinária',
    'escola de teatro',

    // Eventos & Gastronomia
    'buffet infantil',
    'buffet de casamento',
    'espaço para eventos',
    'decoração de festas',
    'fotógrafo de casamento',
    'fotógrafo de eventos',
    'cerimonialista',
    'DJ profissional',
    'banda para eventos',
    'restaurante',
    'lanchonete',
    'pizzaria',
    'cafeteria',

    // Imóveis & Construção
    'imobiliária',
    'construtora',
    'incorporadora',
    'empresa de reformas',
    'empresa de pintura',
    'empresa de instalação elétrica',
    'empresa de instalação hidráulica',
    'marmoraria',
    'empresa de paisagismo',
    'empresa de piscinas',
    'empresa de móveis planejados',

    // Automotivo
    'oficina mecânica',
    'funilaria e pintura',
    'loja de pneus',
    'lava-rápido',
    'concessionária',
    'locadora de veículos',

    // Pet
    'pet shop',
    'clínica veterinária',
    'hotel para pets',
    'adestrador de cães',

    // Serviços Especializados
    'empresa de segurança eletrônica',
    'empresa de climatização',
    'empresa de dedetização',
    'empresa de mudanças',
    'empresa de limpeza',
    'gráfica',
    'empresa de tecnologia',
    'estúdio de fotografia',
    'clínica de acupuntura',
    'clínica de quiropraxia',
    'laboratório de análises',
];

const CITIES = [
    'São Paulo',
    'Rio de Janeiro',
    'Belo Horizonte',
    'Curitiba',
    'Porto Alegre',
    'Brasília',
    'Goiânia',
    'Salvador',
    'Recife',
    'Fortaleza',
];

// ─── CSV Export ───────────────────────────────────────────────────────────────

function initCsvFile(): string {
    const outputDir = path.resolve('scripts/output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const date = new Date().toISOString().slice(0, 10);
    const filePath = path.join(outputDir, `leads-sites-${date}.csv`);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, 'empresa,nicho,cidade,telefone,email,site,google_maps_url\n', 'utf8');
    }
    return filePath;
}

function appendToCsv(filePath: string, lead: Record<string, string>) {
    const escape = (v?: string) => `"${(v || '').replace(/"/g, '""')}"`;
    const row = [
        escape(lead.business_name), escape(lead.niche), escape(lead.location),
        escape(lead.phone), escape(lead.email), escape(lead.website), escape(lead.google_maps_url),
    ].join(',') + '\n';
    fs.appendFileSync(filePath, row, 'utf8');
}

// ─── Core Scraper ─────────────────────────────────────────────────────────────

export async function scrapeSitesLeads(needed: number = 300): Promise<number> {
    const csvPath = initCsvFile();
    let totalSaved = 0;

    console.log(`[sites-scraper] Buscando ${needed} leads para Erick Sena...`);

    // Carrega URLs já processadas (com brevo_list_id setado) para não reprocessar
    const { data: processed } = await supabase
        .from('sales_leads')
        .select('google_maps_url')
        .eq('client_id', 'SitesSales')
        .not('brevo_list_id', 'is', null);
    const processedUrls = new Set((processed || []).map(r => r.google_maps_url));
    console.log(`[sites-scraper] ${processedUrls.size} leads já processados — serão ignorados`);

    const browser = await chromium.launch({ headless: true });

    try {
        outer: for (const niche of NICHES) {
            for (const city of CITIES) {
                if (totalSaved >= needed) break outer;

                console.log(`[sites-scraper] "${niche}" em "${city}"...`);
                const context = await browser.newContext();
                const page = await context.newPage();

                try {
                    const searchQuery = encodeURIComponent(`${niche} em ${city}`);
                    await page.goto(`https://www.google.com.br/maps/search/${searchQuery}`, { timeout: 30000 });
                    await page.waitForTimeout(5000);

                    for (let i = 0; i < 5; i++) {
                        await page.mouse.wheel(0, 5000);
                        await page.waitForTimeout(1000);
                    }

                    const links = await page.$$eval('a[href*="/maps/place/"]', as => as.map((a: any) => a.href));
                    const uniqueLinks = Array.from(new Set(links)).slice(0, 20);

                    for (const link of uniqueLinks) {
                        if (totalSaved >= needed) break;
                        if (processedUrls.has(link as string)) {
                            console.log(`[sites-scraper] ⏭ skip (já em lista): ${link}`);
                            continue;
                        }
                        try {
                            await page.goto(link as string, { timeout: 15000 });
                            await page.waitForTimeout(2000);

                            const businessName = await page.$eval('h1', (el: any) => el.textContent?.trim() || '').catch(() => '');
                            if (!businessName) continue;

                            const phone = await page.$eval('button[data-item-id*="phone:tel:"]', (el: any) => el.getAttribute('data-item-id')?.split(':')?.pop() || '').catch(() => '');
                            const website = await page.$eval('a[data-item-id="authority"]', (el: any) => el.getAttribute('href') || '').catch(() => '');
                            const address = await page.$eval('button[data-item-id="address"]', (el: any) => el.textContent?.trim() || '').catch(() => '');

                            // Busca email no site
                            let email = '';
                            if (website) {
                                const emailPage = await browser.newPage();
                                try {
                                    await emailPage.goto(website, { timeout: 20000, waitUntil: 'domcontentloaded' });
                                    const content = await emailPage.content();
                                    const found = content.match(/[a-zA-Z0-9._+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,6}/g) || [];
                                    email = found.find(e =>
                                        !e.includes('@example') &&
                                        !e.includes('@sentry') &&
                                        !e.includes('@w3') &&
                                        !e.includes('@schema') &&
                                        !e.endsWith('.png') &&
                                        !e.endsWith('.jpg')
                                    ) || '';
                                } catch { /* site inacessível — continua sem email */ } finally { await emailPage.close(); }
                            }

                            const lead = { business_name: businessName, phone, website, google_maps_url: link as string, location: address, niche, email };

                            const { error } = await supabase
                                .from('sales_leads')
                                .upsert({
                                    ...lead,
                                    client_id: 'SitesSales',
                                    status: email ? 'new' : 'extracted',
                                    // NÃO inclui brevo_list_id — upsert não deve resetar leads já adicionados a listas
                                }, { onConflict: 'google_maps_url', ignoreDuplicates: false });

                            if (error) {
                                console.warn(`[sites-scraper] ⚠ Supabase error para "${businessName}": ${error.message}`);
                            } else {
                                if (email) {
                                    totalSaved++;
                                    appendToCsv(csvPath, lead);
                                    console.log(`[sites-scraper] ✓ ${businessName} — ${email} (${totalSaved}/${needed})`);
                                } else {
                                    console.log(`[sites-scraper] ⚠ ${businessName} — sem email, salvo mas não contado`);
                                }
                            }

                        } catch (err: any) { console.warn(`[sites-scraper] ⚠ skip ${link}: ${err?.message}`); }
                    }

                } catch (e: any) {
                    console.error(`[sites-scraper] Erro em "${niche}" / "${city}":`, e.message);
                } finally {
                    await page.close().catch(() => {});
                    await context.close().catch(() => {});
                }
            }
        }
    } finally {
        await browser.close().catch(() => {});
    }

    console.log(`[sites-scraper] Concluído — ${totalSaved} leads salvos → ${csvPath}`);
    return totalSaved;
}

// ─── Entry Point ──────────────────────────────────────────────────────────────

const invokedScript = process.argv[1]?.replace(/\\/g, '/').split('/').pop();
if (invokedScript === 'scrape-sites-leads.ts' || invokedScript === 'scrape-sites-leads.js') {
    const needed = parseInt(process.argv[2] || '300', 10);
    scrapeSitesLeads(needed);
}
