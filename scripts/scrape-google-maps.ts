import { chromium } from 'playwright';
import { supabase } from '../src/db/supabase.ts';
import 'dotenv/config';

interface Lead {
    business_name: string;
    phone?: string;
    website?: string;
    google_maps_url?: string;
    location?: string;
    niche: string;
}

export async function scrapeGoogleMaps(niche: string, location: string, maxResults: number = 20) {
    console.log(`[scraper] Starting scrape for "${niche}" in "${location}"...`);
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        const searchQuery = encodeURIComponent(`${niche} em ${location}`);
        await page.goto(`https://www.google.com.br/maps/search/${searchQuery}`);

        // Wait for the results list or some initial state
        await page.waitForTimeout(5000);

        // Scroll to load more results
        console.log(`[scraper] Scrolling to load results...`);
        for (let i = 0; i < 5; i++) {
            await page.mouse.wheel(0, 5000);
            await page.waitForTimeout(1000);
        }

        // Extract business links
        const links = await page.$$eval('a[href*="/maps/place/"]', as => as.map(a => a.href));
        const uniqueLinks = Array.from(new Set(links)).slice(0, maxResults);

        console.log(`[scraper] Found ${uniqueLinks.length} potential leads.`);

        for (const link of uniqueLinks) {
            try {
                await page.goto(link);
                await page.waitForTimeout(2000);

                const businessName = await page.$eval('h1', el => el.textContent?.trim() || 'Desconhecido').catch(() => 'Desconhecido');
                const phone = await page.$eval('button[data-item-id*="phone:tel:"]', el => el.getAttribute('data-item-id')?.split(':')?.pop() || '').catch(() => '');
                const website = await page.$eval('a[data-item-id="authority"]', el => el.getAttribute('href') || '').catch(() => '');
                const address = await page.$eval('button[data-item-id="address"]', el => el.textContent?.trim() || '').catch(() => '');

                const lead: Lead = {
                    business_name: businessName,
                    phone: phone,
                    website: website,
                    google_maps_url: link,
                    location: address,
                    niche: niche
                };

                console.log(`[scraper] Scraped: ${businessName}`);

                // Try to find email if website exists
                let email = '';
                if (website) {
                    email = await findEmailOnWebsite(website, browser);
                }

                // Upsert to Supabase
                const { error } = await supabase
                    .from('sales_leads')
                    .upsert({
                        business_name: lead.business_name,
                        phone: lead.phone,
                        website: lead.website,
                        google_maps_url: lead.google_maps_url,
                        location: lead.location,
                        niche: lead.niche,
                        email: email,
                        status: email ? 'new' : 'extracted'
                    }, { onConflict: 'google_maps_url' });

                if (error) console.error(`[scraper] Supabase Error:`, error.message);

            } catch (err) {
                console.error(`[scraper] Error scraping individual link:`, err);
            }
        }

    } catch (e: any) {
        console.error(`[scraper] Scraper Error:`, e.message);
    } finally {
        await browser.close();
        console.log(`[scraper] Scrape complete.`);
    }
}

async function findEmailOnWebsite(url: string, browser: any): Promise<string> {
    console.log(`[scraper] visiting website to find email: ${url}`);
    const page = await browser.newPage();
    try {
        await page.goto(url, { timeout: 30000, waitUntil: 'domcontentloaded' });
        const content = await page.content();

        // Simple regex for emails
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const matches = content.match(emailRegex);

        if (matches && matches.length > 0) {
            // Filter common false positives or generic emails if needed
            return matches[0];
        }
        return '';
    } catch (e) {
        return '';
    } finally {
        await page.close();
    }
}

const invokedScript = process.argv[1]?.replace(/\\/g, '/').split('/').pop();

if (invokedScript === 'scrape-google-maps.ts' || invokedScript === 'scrape-google-maps.js') {
    // Determine target from command line or use a default
    // We will run this script for each niche sequentially in a real environment
    const targetNiche = process.argv[2] || 'Palestrantes';
    const city = process.argv[3] || 'São Paulo';
    scrapeGoogleMaps(targetNiche, city);
}


