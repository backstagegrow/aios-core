import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

config();

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// ─── ICP SitesSales — Nichos para Venda de Criação de Sites ─────────────────

const NICHES = [
    // Profissionais de saúde — ticket alto, decisor único
    'clínica odontológica',
    'psicólogo',
    'fisioterapeuta',
    'nutricionista',
    'médico clínica',
    'clínica de estética',
    'clínica veterinária',
    'studio de pilates',
    // Jurídico / financeiro — alto valor percebido
    'advogado',
    'escritório de contabilidade',
    'consultor financeiro',
    // Construção / arquitetura — projeto de alto ticket
    'arquiteto',
    'engenheiro civil',
    'construtora',
    // Educação / serviços premium
    'escola de idiomas',
    'personal trainer',
    'coach executivo',
];

const CITIES = [
    'São Paulo',
    'Campinas',
    'Belo Horizonte',
    'Curitiba',
    'Porto Alegre',
    'Rio de Janeiro',
    'Brasília',
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Lead {
    business_name: string;
    phone?: string;
    website?: string;
    google_maps_url?: string;
    location?: string;
    niche: string;
    email?: string;
    linkedin_url?: string;
    instagram_url?: string;
    status?: string;
}

type WebsiteStatus = 'no_website' | 'broken_website' | 'has_website';

// ─── CSV Export ───────────────────────────────────────────────────────────────

function initCsvFile(): string {
    const outputDir = path.resolve('scripts/output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const date = new Date().toISOString().slice(0, 10);
    const filePath = path.join(outputDir, `leads-sites-${date}.csv`);

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(
            filePath,
            'empresa,nicho,cidade,telefone,email,site,linkedin,instagram,google_maps_url,status\n',
            'utf8'
        );
    }

    return filePath;
}

function appendToCsv(filePath: string, lead: Lead) {
    const escape = (v?: string) => `"${(v || '').replace(/"/g, '""')}"`;
    const row = [
        escape(lead.business_name),
        escape(lead.niche),
        escape(lead.location),
        escape(lead.phone),
        escape(lead.email),
        escape(lead.website),
        escape(lead.linkedin_url),
        escape(lead.instagram_url),
        escape(lead.google_maps_url),
        escape(lead.status),
    ].join(',') + '\n';

    fs.appendFileSync(filePath, row, 'utf8');
}

// ─── Social Finders ───────────────────────────────────────────────────────────

function cleanLinkedin(url: string): string {
    try {
        const match = new URL(url).pathname.match(/(\/company\/[^/?#]+)/);
        return match ? `https://www.linkedin.com${match[1]}` : url;
    } catch { return url; }
}

function cleanInstagram(url: string): string {
    try {
        const match = new URL(url).pathname.match(/\/@?([^/?#]+)/);
        return match ? `https://www.instagram.com/${match[1]}` : url;
    } catch { return url; }
}

async function findSocialsOnWebsite(url: string, browser: any): Promise<{ linkedin: string; instagram: string }> {
    const page = await browser.newPage();
    try {
        await page.goto(url, { timeout: 20000, waitUntil: 'domcontentloaded' });

        const linkedin = await page
            .$$eval('a[href*="linkedin.com"]', (as: any[]) =>
                as.map(a => a.href).find((h: string) => h.includes('/company/') || h.includes('/in/')) || ''
            ).catch(() => '');

        const instagram = await page
            .$$eval('a[href*="instagram.com"]', (as: any[]) =>
                as.map(a => a.href).find((h: string) => !h.includes('/p/') && !h.includes('/reel/') && !h.includes('share')) || ''
            ).catch(() => '');

        return {
            linkedin: linkedin ? cleanLinkedin(linkedin) : '',
            instagram: instagram ? cleanInstagram(instagram) : '',
        };
    } catch {
        return { linkedin: '', instagram: '' };
    } finally {
        await page.close();
    }
}

async function findSocialsOnGoogle(businessName: string, browser: any): Promise<{ linkedin: string; instagram: string }> {
    const page = await browser.newPage();
    const result = { linkedin: '', instagram: '' };

    try {
        // LinkedIn
        const liQuery = encodeURIComponent(`"${businessName}" site:linkedin.com/company`);
        await page.goto(`https://www.google.com.br/search?q=${liQuery}`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1500);

        const liUrl = await page
            .$$eval('a[href*="linkedin.com/company"]', (as: any[]) => as[0]?.href || '')
            .catch(() => '');
        if (liUrl) result.linkedin = cleanLinkedin(liUrl);

        await page.waitForTimeout(1000);

        // Instagram
        const igQuery = encodeURIComponent(`"${businessName}" site:instagram.com`);
        await page.goto(`https://www.google.com.br/search?q=${igQuery}`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1500);

        const igUrl = await page
            .$$eval('a[href*="instagram.com/"]', (as: any[]) =>
                as.map(a => a.href).find((h: string) => !h.includes('/p/') && !h.includes('/reel/')) || ''
            ).catch(() => '');
        if (igUrl) result.instagram = cleanInstagram(igUrl);

    } catch {
        // social é dado bônus — falha silenciosa
    } finally {
        await page.close();
    }

    return result;
}

// ─── Email Finder ─────────────────────────────────────────────────────────────

const GENERIC_PREFIXES = [
    'contato', 'contact', 'comercial', 'vendas', 'sales', 'info', 'hello',
    'atendimento', 'suporte', 'support', 'admin', 'administrativo',
    'financeiro', 'financ', 'noreply', 'no-reply', 'marketing', 'rh',
    'recepcao', 'recepção', 'secretaria', 'sac', 'ouvidoria',
];

function classifyEmail(email: string): 'personal' | 'generic' | 'ignore' {
    if (!email) return 'ignore';
    const prefix = email.split('@')[0].toLowerCase();
    if (GENERIC_PREFIXES.some(g => prefix === g || prefix.startsWith(g))) return 'generic';
    if (/^[a-z]+[._][a-z]+/i.test(prefix)) return 'personal';
    return 'personal';
}

async function findEmailOnWebsite(url: string, browser: any): Promise<{ email: string; email_type: 'personal' | 'generic' | '' }> {
    const page = await browser.newPage();
    try {
        await page.goto(url, { timeout: 30000, waitUntil: 'domcontentloaded' });
        const content = await page.content();
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const all: string[] = [...new Set<string>(content.match(emailRegex) || [])];

        const relevant: string[] = all.filter((e: string) =>
            !e.includes('@example') &&
            !e.includes('@sentry') &&
            !e.includes('@w3') &&
            e.includes('@')
        );

        const personal = relevant.find((e: string) => classifyEmail(e) === 'personal');
        if (personal) return { email: personal, email_type: 'personal' as const };

        const generic = relevant.find((e: string) => classifyEmail(e) === 'generic');
        if (generic) return { email: generic, email_type: 'generic' as const };

        return { email: '', email_type: '' as const };
    } catch {
        return { email: '', email_type: '' as const };
    } finally {
        await page.close();
    }
}

// ─── Website Health Check ─────────────────────────────────────────────────────

async function checkWebsiteHealth(url: string, browser: any): Promise<WebsiteStatus> {
    const page = await browser.newPage();
    try {
        const response = await page.goto(url, { timeout: 15000, waitUntil: 'domcontentloaded' });
        const status = response?.status() || 0;

        if (status >= 400) {
            return 'broken_website';
        }

        return 'has_website';
    } catch {
        // Timeout ou erro de conexão — site quebrado/inacessível
        return 'broken_website';
    } finally {
        await page.close();
    }
}

// ─── Core Scraper ─────────────────────────────────────────────────────────────

export async function scrapeProspectSites(niche: string, location: string, maxResults: number = 20, csvPath?: string) {
    console.log(`\n[prospect] "${niche}" em "${location}"...`);
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        const searchQuery = encodeURIComponent(`${niche} em ${location}`);
        await page.goto(`https://www.google.com.br/maps/search/${searchQuery}`);
        await page.waitForTimeout(5000);

        for (let i = 0; i < 5; i++) {
            await page.mouse.wheel(0, 5000);
            await page.waitForTimeout(1000);
        }

        const links = await page.$$eval('a[href*="/maps/place/"]', as => as.map((a: any) => a.href));
        const uniqueLinks = Array.from(new Set(links)).slice(0, maxResults);
        console.log(`[prospect] ${uniqueLinks.length} leads encontrados.`);

        let stats = { no_website: 0, broken_website: 0, has_website: 0 };

        for (const link of uniqueLinks) {
            try {
                await page.goto(link as string);
                await page.waitForTimeout(2000);

                const businessName = await page.$eval('h1', (el: any) => el.textContent?.trim() || 'Desconhecido').catch(() => 'Desconhecido');
                const phone = await page.$eval('button[data-item-id*="phone:tel:"]', (el: any) => el.getAttribute('data-item-id')?.split(':')?.pop() || '').catch(() => '');
                const website = await page.$eval('a[data-item-id="authority"]', (el: any) => el.getAttribute('href') || '').catch(() => '');
                const address = await page.$eval('button[data-item-id="address"]', (el: any) => el.textContent?.trim() || '').catch(() => '');

                let email = '';
                let email_type = '';
                let linkedin = '';
                let instagram = '';
                let websiteStatus: WebsiteStatus;

                // ── Filtro de website ────────────────────────────────────────────
                if (!website) {
                    // Sem site = prioridade máxima para venda
                    websiteStatus = 'no_website';
                } else {
                    // Tem site — verificar se funciona
                    websiteStatus = await checkWebsiteHealth(website, browser);

                    // Extrair email e socials do site (funcional ou não, tenta)
                    if (websiteStatus === 'has_website') {
                        const [emailResult, socialResult] = await Promise.all([
                            findEmailOnWebsite(website, browser),
                            findSocialsOnWebsite(website, browser),
                        ]);
                        email = emailResult.email;
                        email_type = emailResult.email_type;
                        linkedin = socialResult.linkedin;
                        instagram = socialResult.instagram;
                    }
                }

                stats[websiteStatus]++;

                // Fallback: Google search para redes não encontradas no site
                if (!linkedin || !instagram) {
                    const googleSocials = await findSocialsOnGoogle(businessName, browser);
                    if (!linkedin && googleSocials.linkedin) linkedin = googleSocials.linkedin;
                    if (!instagram && googleSocials.instagram) instagram = googleSocials.instagram;
                }

                const lead: Lead = {
                    business_name: businessName,
                    phone,
                    website,
                    google_maps_url: link as string,
                    location: address,
                    niche,
                    email,
                    linkedin_url: linkedin,
                    instagram_url: instagram,
                    status: websiteStatus,
                };

                const statusIcon = websiteStatus === 'no_website' ? '★' : websiteStatus === 'broken_website' ? '⚠' : '·';
                const emailFlag = email ? `${email_type === 'personal' ? 'email' : '~email(gen)'}` : '';
                const flags = [websiteStatus, emailFlag, linkedin && 'LI', instagram && 'IG'].filter(Boolean).join(' | ');
                console.log(`[prospect] ${statusIcon} ${businessName} — ${flags}`);

                // Supabase upsert
                const { error } = await supabase
                    .from('sales_leads')
                    .upsert({
                        business_name: lead.business_name,
                        phone: lead.phone,
                        website: lead.website,
                        google_maps_url: lead.google_maps_url,
                        location: lead.location,
                        niche: lead.niche,
                        email: lead.email,
                        linkedin_url: lead.linkedin_url,
                        instagram_url: lead.instagram_url,
                        status: lead.status,
                        client_id: 'SitesSales',
                    }, { onConflict: 'google_maps_url' });

                if (error) console.error(`[prospect] Supabase error:`, error.message);

                if (csvPath) appendToCsv(csvPath, lead);

            } catch (err) {
                console.error(`[prospect] Erro no lead:`, err);
            }
        }

        console.log(`[prospect] Resumo: ${stats.no_website} sem site | ${stats.broken_website} site quebrado | ${stats.has_website} com site`);

    } catch (e: any) {
        console.error(`[prospect] Erro geral:`, e.message);
    } finally {
        await browser.close();
        console.log(`[prospect] Concluído: "${niche}" em "${location}"`);
    }
}

// ─── Batch Mode ───────────────────────────────────────────────────────────────

async function runBatch() {
    const csvPath = initCsvFile();
    const total = NICHES.length * CITIES.length;
    console.log(`\n[batch] CSV: ${csvPath}`);
    console.log(`[batch] ${NICHES.length} nichos x ${CITIES.length} cidades = ${total} combinações\n`);

    let done = 0;
    for (const niche of NICHES) {
        for (const city of CITIES) {
            await scrapeProspectSites(niche, city, 20, csvPath);
            done++;
            console.log(`[batch] ${done}/${total} concluídos\n`);
        }
    }

    console.log(`\n[batch] Finalizado → ${csvPath}`);
}

// ─── Entry Point ──────────────────────────────────────────────────────────────

const invokedScript = process.argv[1]?.replace(/\\/g, '/').split('/').pop();

if (invokedScript === 'prospect-sites.ts' || invokedScript === 'prospect-sites.js') {
    const nicheArg = process.argv[2];
    const cityArg = process.argv[3];

    if (nicheArg && cityArg) {
        // Modo manual: npm run sites:scrape "nicho" "cidade"
        const csvPath = initCsvFile();
        scrapeProspectSites(nicheArg, cityArg, 20, csvPath);
    } else {
        // Modo batch: npm run sites:scrape
        runBatch();
    }
}
