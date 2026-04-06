import { chromium, type Browser, type Page } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

config();

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// ─── Configuration ───────────────────────────────────────────────────────────

const HOTMART_BASE = 'https://hotmart.com/pt-BR/marketplace';

const CATEGORIES = [
    { slug: 'negocios-e-carreira', label: 'Negocios' },
    { slug: 'marketing-digital', label: 'Marketing' },
    { slug: 'saude-e-esportes', label: 'Saude' },
    { slug: 'educacao', label: 'Educacao' },
] as const;

const MAX_PRODUCTS = 50;
const MIN_DELAY_MS = 2000;
const MAX_DELAY_MS = 5000;

// ─── Types ───────────────────────────────────────────────────────────────────

type PageScore = 'score_bad' | 'score_ok' | 'score_good';

interface HotmartProduct {
    product_name: string;
    producer_name: string;
    sales_page_url: string;
    email: string;
    category: string;
    score: PageScore;
}

interface ScoreResult {
    score: PageScore;
    reasons: string[];
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function randomDelay(): Promise<void> {
    const ms = Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS)) + MIN_DELAY_MS;
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── CSV Export ──────────────────────────────────────────────────────────────

function initCsvFile(): string {
    const outputDir = path.resolve('scripts/output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const date = new Date().toISOString().slice(0, 10);
    const filePath = path.join(outputDir, `leads-hotmart-${date}.csv`);

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(
            filePath,
            'produtor,produto,categoria,email,pagina_vendas,score,status\n',
            'utf8'
        );
    }

    return filePath;
}

function appendToCsv(filePath: string, product: HotmartProduct) {
    const escape = (v?: string) => `"${(v || '').replace(/"/g, '""')}"`;
    const status = product.score === 'score_bad' ? 'hotmart_bad_page'
        : product.score === 'score_ok' ? 'hotmart_ok_page'
        : 'hotmart_good_page';

    const row = [
        escape(product.producer_name),
        escape(product.product_name),
        escape(product.category),
        escape(product.email),
        escape(product.sales_page_url),
        escape(product.score),
        escape(status),
    ].join(',') + '\n';

    fs.appendFileSync(filePath, row, 'utf8');
}

// ─── Email Finder ────────────────────────────────────────────────────────────

async function findEmailOnPage(page: Page): Promise<string> {
    try {
        const content = await page.content();
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const matches = [...new Set<string>(content.match(emailRegex) || [])];

        const relevant = matches.filter((e: string) =>
            !e.includes('@example') &&
            !e.includes('@sentry') &&
            !e.includes('@w3') &&
            !e.includes('@wixpress') &&
            !e.includes('@hotmart') &&
            !e.endsWith('.png') &&
            !e.endsWith('.jpg') &&
            e.includes('@')
        );

        return relevant[0] || '';
    } catch {
        return '';
    }
}

// ─── Page Quality Scorer ─────────────────────────────────────────────────────

async function scoreSalesPage(browser: Browser, url: string): Promise<ScoreResult> {
    const page = await browser.newPage();
    const reasons: string[] = [];

    try {
        const response = await page.goto(url, { timeout: 30000, waitUntil: 'domcontentloaded' });

        if (!response || response.status() >= 400) {
            return { score: 'score_bad', reasons: ['page_not_loading'] };
        }

        await page.waitForTimeout(2000);

        // Extract page metrics
        const metrics = await page.evaluate(() => {
            const body = document.body;
            const textContent = body?.innerText || '';
            const images = document.querySelectorAll('img');
            const buttons = document.querySelectorAll('button, a.btn, [class*="cta"], [class*="button"], input[type="submit"]');
            const forms = document.querySelectorAll('form');
            const videos = document.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"], iframe[src*="wistia"]');

            // Check for structured sections
            const hasHero = !!(
                document.querySelector('[class*="hero"]') ||
                document.querySelector('[class*="banner"]') ||
                document.querySelector('[class*="header"]') ||
                document.querySelector('h1')
            );

            const hasBenefits = !!(
                document.querySelector('[class*="benefit"]') ||
                document.querySelector('[class*="feature"]') ||
                document.querySelector('[class*="vantag"]') ||
                (textContent.match(/✅|✓|→|►/g) || []).length >= 3
            );

            const hasTestimonials = !!(
                document.querySelector('[class*="testimon"]') ||
                document.querySelector('[class*="depoiment"]') ||
                document.querySelector('[class*="review"]') ||
                document.querySelector('[class*="social-proof"]')
            );

            return {
                textLength: textContent.length,
                imageCount: images.length,
                buttonCount: buttons.length,
                formCount: forms.length,
                videoCount: videos.length,
                hasHero,
                hasBenefits,
                hasTestimonials,
            };
        });

        // Scoring logic
        const isBad =
            metrics.textLength < 500 ||
            metrics.imageCount === 0 ||
            (metrics.buttonCount === 0 && metrics.formCount === 0);

        const isGood =
            metrics.hasHero &&
            metrics.hasBenefits &&
            metrics.hasTestimonials &&
            metrics.buttonCount >= 1 &&
            metrics.textLength > 2000;

        if (isBad) {
            if (metrics.textLength < 500) reasons.push('text_too_short');
            if (metrics.imageCount === 0) reasons.push('no_images');
            if (metrics.buttonCount === 0 && metrics.formCount === 0) reasons.push('no_cta');
            return { score: 'score_bad', reasons };
        }

        if (isGood) {
            reasons.push('has_hero', 'has_benefits', 'has_testimonials', 'has_cta');
            return { score: 'score_good', reasons };
        }

        reasons.push('basic_structure');
        if (!metrics.hasHero) reasons.push('missing_hero');
        if (!metrics.hasBenefits) reasons.push('missing_benefits');
        if (!metrics.hasTestimonials) reasons.push('missing_testimonials');
        return { score: 'score_ok', reasons };

    } catch (error) {
        return { score: 'score_bad', reasons: ['page_error'] };
    } finally {
        await page.close();
    }
}

// ─── Hotmart Marketplace Scraper ─────────────────────────────────────────────

interface ProductListing {
    name: string;
    url: string;
    producer: string;
}

async function scrapeCategory(
    page: Page,
    categorySlug: string,
    limit: number
): Promise<ProductListing[]> {
    const url = `${HOTMART_BASE}/produtos?q=&categ=${categorySlug}`;
    console.log(`[hotmart] Navigating to category: ${url}`);

    try {
        await page.goto(url, { timeout: 30000, waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(3000);

        // Scroll to load more products
        for (let i = 0; i < 3; i++) {
            await page.mouse.wheel(0, 3000);
            await page.waitForTimeout(1500);
        }

        // Extract product cards from marketplace
        const products = await page.evaluate(() => {
            const cards = document.querySelectorAll(
                '[class*="product-card"], [class*="ProductCard"], [class*="card"], .hot-product-card, article'
            );
            const results: { name: string; url: string; producer: string }[] = [];

            cards.forEach(card => {
                const titleEl = card.querySelector('h3, h2, [class*="title"], [class*="name"]');
                const linkEl = card.querySelector('a[href]');
                const producerEl = card.querySelector(
                    '[class*="author"], [class*="producer"], [class*="vendor"], [class*="seller"], span'
                );

                const name = titleEl?.textContent?.trim() || '';
                const href = linkEl?.getAttribute('href') || '';
                const producer = producerEl?.textContent?.trim() || '';

                if (name && href) {
                    results.push({
                        name,
                        url: href.startsWith('http') ? href : `https://hotmart.com${href}`,
                        producer,
                    });
                }
            });

            return results;
        });

        console.log(`[hotmart] Found ${products.length} products in category`);
        return products.slice(0, limit);

    } catch (error) {
        console.error(`[hotmart] Error scraping category ${categorySlug}:`, error instanceof Error ? error.message : 'Unknown');
        return [];
    }
}

async function extractSalesPageUrl(page: Page, productUrl: string): Promise<string> {
    try {
        await page.goto(productUrl, { timeout: 30000, waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(2000);

        // Look for "Pagina de Vendas" or external sales page link
        const salesUrl = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('a'));

            // Priority 1: Explicit "Pagina de Vendas" link
            const salesLink = links.find(a => {
                const text = (a.textContent || '').toLowerCase();
                return text.includes('página de vendas') ||
                    text.includes('pagina de vendas') ||
                    text.includes('sales page') ||
                    text.includes('ver página') ||
                    text.includes('acessar página');
            });

            if (salesLink?.href) return salesLink.href;

            // Priority 2: External link that is not hotmart.com
            const externalLink = links.find(a => {
                const href = a.href || '';
                return href.startsWith('http') &&
                    !href.includes('hotmart.com') &&
                    !href.includes('facebook.com') &&
                    !href.includes('instagram.com') &&
                    !href.includes('twitter.com') &&
                    !href.includes('youtube.com');
            });

            return externalLink?.href || '';
        });

        return salesUrl || productUrl;

    } catch {
        return productUrl;
    }
}

async function extractProducerInfo(page: Page): Promise<{ producer: string; email: string }> {
    try {
        const info = await page.evaluate(() => {
            const body = document.body?.innerText || '';

            // Try to find producer name from page metadata
            const producerEl = document.querySelector(
                '[class*="author"], [class*="producer"], [class*="vendor"], [class*="creator"]'
            );
            const producer = producerEl?.textContent?.trim() || '';

            // Find email in footer or contact section
            const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
            const emails = [...new Set(body.match(emailRegex) || [])].filter(
                (e: string) =>
                    !e.includes('@example') &&
                    !e.includes('@sentry') &&
                    !e.includes('@w3') &&
                    !e.includes('@hotmart')
            );

            return { producer, email: emails[0] || '' };
        });

        return info;

    } catch {
        return { producer: '', email: '' };
    }
}

// ─── Core Scanner ────────────────────────────────────────────────────────────

export async function scanHotmart() {
    console.log('\n[hotmart] Starting Hotmart marketplace scanner...');
    console.log(`[hotmart] Max products: ${MAX_PRODUCTS}`);
    console.log(`[hotmart] Categories: ${CATEGORIES.map(c => c.label).join(', ')}`);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });
    const page = await context.newPage();
    const csvPath = initCsvFile();

    let totalProcessed = 0;
    let totalSaved = 0;
    let totalSkipped = 0;
    const productsPerCategory = Math.ceil(MAX_PRODUCTS / CATEGORIES.length);

    try {
        for (const category of CATEGORIES) {
            if (totalProcessed >= MAX_PRODUCTS) break;

            const remaining = MAX_PRODUCTS - totalProcessed;
            const limit = Math.min(productsPerCategory, remaining);

            console.log(`\n[hotmart] ── Category: ${category.label} (max ${limit}) ──`);

            const products = await scrapeCategory(page, category.slug, limit);

            for (const product of products) {
                if (totalProcessed >= MAX_PRODUCTS) break;
                totalProcessed++;

                try {
                    console.log(`[hotmart] [${totalProcessed}/${MAX_PRODUCTS}] ${product.name}`);

                    // Navigate to product page and find sales page URL
                    const salesPageUrl = await extractSalesPageUrl(page, product.url);
                    console.log(`[hotmart]   Sales page: ${salesPageUrl}`);

                    // Score the sales page quality
                    const scoreResult = await scoreSalesPage(browser, salesPageUrl);
                    console.log(`[hotmart]   Score: ${scoreResult.score} (${scoreResult.reasons.join(', ')})`);

                    // Skip good pages — they don't need our services
                    if (scoreResult.score === 'score_good') {
                        console.log(`[hotmart]   SKIP: good page, no opportunity`);
                        totalSkipped++;
                        await randomDelay();
                        continue;
                    }

                    // Extract producer info and email from sales page
                    const salesPage = await browser.newPage();
                    try {
                        await salesPage.goto(salesPageUrl, { timeout: 30000, waitUntil: 'domcontentloaded' });
                        await salesPage.waitForTimeout(1500);
                    } catch {
                        // Page may fail to load — that's already scored as bad
                    }

                    const producerInfo = await extractProducerInfo(salesPage);
                    const email = producerInfo.email || await findEmailOnPage(salesPage);
                    await salesPage.close();

                    const producerName = producerInfo.producer || product.producer || 'Desconhecido';

                    const hotmartProduct: HotmartProduct = {
                        product_name: product.name,
                        producer_name: producerName,
                        sales_page_url: salesPageUrl,
                        email,
                        category: category.label,
                        score: scoreResult.score,
                    };

                    // Determine lead status
                    const status = scoreResult.score === 'score_bad' ? 'hotmart_bad_page' : 'hotmart_ok_page';

                    // Upsert to Supabase
                    const { error } = await supabase
                        .from('sales_leads')
                        .upsert({
                            business_name: producerName,
                            email: email || null,
                            website: salesPageUrl,
                            niche: category.label,
                            client_id: 'SitesSales',
                            status,
                            lead_source: 'hotmart',
                            location: `Hotmart: ${product.name}`,
                        }, { onConflict: 'website' });

                    if (error) {
                        console.error(`[hotmart]   Supabase error: ${error.message}`);
                    } else {
                        totalSaved++;
                        console.log(`[hotmart]   Saved: ${producerName} [${status}] ${email ? `(${email})` : '(no email)'}`);
                    }

                    // Append to CSV
                    appendToCsv(csvPath, hotmartProduct);

                    await randomDelay();

                } catch (err) {
                    console.error(`[hotmart]   Error processing product:`, err instanceof Error ? err.message : 'Unknown');
                }
            }
        }

    } catch (e) {
        console.error(`[hotmart] Fatal error:`, e instanceof Error ? e.message : 'Unknown');
    } finally {
        await browser.close();
    }

    console.log(`\n[hotmart] ── Summary ──`);
    console.log(`[hotmart] Processed: ${totalProcessed}`);
    console.log(`[hotmart] Saved: ${totalSaved}`);
    console.log(`[hotmart] Skipped (good pages): ${totalSkipped}`);
    console.log(`[hotmart] CSV: ${csvPath}`);
}

// ─── Entry Point ─────────────────────────────────────────────────────────────

const invokedScript = process.argv[1]?.replace(/\\/g, '/').split('/').pop();

if (invokedScript === 'hotmart-scanner.ts' || invokedScript === 'hotmart-scanner.js') {
    scanHotmart();
}
