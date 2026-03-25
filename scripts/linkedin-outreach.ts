/**
 * LinkedIn Semi-Auto Outreach — BKS Grow
 * Fonte: leads do Google Maps scraper (sales_leads no Supabase com linkedin_url)
 * Modo: browser VISÍVEL — usuário confirma cada envio
 *
 * npm run sales:linkedin
 */

import { chromium } from 'playwright';
import { supabase } from '../src/db/supabase.ts';
import * as readline from 'readline';
import 'dotenv/config';

// ─── Config ───────────────────────────────────────────────────────────────────

const DAILY_LIMIT = 15;                // máx conexões/dia (seguro anti-ban)
const DELAY_MIN_MS = 3000;            // delay mínimo entre ações
const DELAY_MAX_MS = 8000;            // delay máximo entre ações
const LINKEDIN_EMAIL = process.env.LINKEDIN_EMAIL || '';
const LINKEDIN_PASSWORD = process.env.LINKEDIN_PASSWORD || '';

// ─── Templates de mensagem (baseados nos scripts de copy) ─────────────────────

function buildMessage(businessName: string): string {
    // Versão A — Curiosidade + auto-seleção (sem assumir problema)
    return `Oi! Vi o trabalho da ${businessName} no setor de eventos — trabalho sério.

Estou mapeando as empresas do setor que estão construindo canal de aquisição B2B próprio em 2026. Faz sentido bater um papo rápido?`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function randomDelay(min = DELAY_MIN_MS, max = DELAY_MAX_MS): Promise<void> {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(res => setTimeout(res, ms));
}

function prompt(rl: readline.Interface, question: string): Promise<string> {
    return new Promise(resolve => rl.question(question, resolve));
}

async function markContacted(leadId: string | number) {
    await supabase
        .from('sales_leads')
        .update({
            linkedin_contacted: true,
            linkedin_contacted_at: new Date().toISOString(),
        })
        .eq('id', leadId);
}

// ─── Login ────────────────────────────────────────────────────────────────────

async function loginToLinkedIn(page: any) {
    await page.goto('https://www.linkedin.com/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Se já estiver logado, pula
    if (page.url().includes('/feed')) {
        console.log('[linkedin] Já logado.\n');
        return;
    }

    if (!LINKEDIN_EMAIL || !LINKEDIN_PASSWORD) {
        console.log('[linkedin] Sem credenciais no .env — faça login manualmente no browser.');
        console.log('[linkedin] Aguardando você fazer login... (pressione ENTER quando estiver logado)');
        await new Promise(res => process.stdin.once('data', res));
        return;
    }

    await page.fill('#username', LINKEDIN_EMAIL);
    await page.fill('#password', LINKEDIN_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    if (page.url().includes('/checkpoint')) {
        console.log('[linkedin] ⚠️  LinkedIn pediu verificação. Complete no browser e pressione ENTER.');
        await new Promise(res => process.stdin.once('data', res));
    }

    console.log('[linkedin] Login OK.\n');
}

// ─── Send Connection ──────────────────────────────────────────────────────────

async function sendConnection(page: any, linkedinUrl: string, message: string): Promise<'sent' | 'skipped' | 'already_connected' | 'error'> {
    try {
        await page.goto(linkedinUrl, { waitUntil: 'domcontentloaded' });
        await randomDelay(2000, 4000);

        // Checar se já está conectado
        const connected = await page.$('button[aria-label*="Mensagem"]').catch(() => null);
        if (connected) return 'already_connected';

        // Clicar em Conectar
        const connectBtn = await page.$('button[aria-label*="Conectar"]').catch(() => null);
        if (!connectBtn) {
            // Tentar via menu "Mais"
            const moreBtn = await page.$('button[aria-label*="Mais ações"]').catch(() => null);
            if (moreBtn) {
                await moreBtn.click();
                await randomDelay(1000, 2000);
                const connectOption = await page.$('div[aria-label*="Conectar"]').catch(() => null);
                if (!connectOption) return 'error';
                await connectOption.click();
            } else {
                return 'error';
            }
        } else {
            await connectBtn.click();
        }

        await randomDelay(1500, 2500);

        // Adicionar nota
        const addNoteBtn = await page.$('button[aria-label*="Adicionar nota"]').catch(() => null);
        if (!addNoteBtn) return 'error';
        await addNoteBtn.click();

        await randomDelay(1000, 1500);

        // Preencher mensagem
        const textarea = await page.$('textarea[name="message"]').catch(() => null);
        if (!textarea) return 'error';
        await textarea.fill(message);

        return 'sent';

    } catch (err) {
        console.error('[linkedin] Erro na conexão:', err);
        return 'error';
    }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function runLinkedInOutreach() {
    // Buscar leads com linkedin_url que ainda não foram contatados
    const { data: leads, error } = await supabase
        .from('sales_leads')
        .select('*')
        .eq('client_id', 'BKSGrow')
        .not('linkedin_url', 'is', null)
        .neq('linkedin_url', '')
        .or('linkedin_contacted.is.null,linkedin_contacted.eq.false')
        .order('lead_score', { ascending: false }) // prioriza HIGH score
        .limit(DAILY_LIMIT);

    if (error) {
        console.error('[linkedin] Erro Supabase:', error.message);
        return;
    }

    if (!leads || leads.length === 0) {
        console.log('[linkedin] Nenhum lead com LinkedIn pendente.');
        return;
    }

    console.log(`\n[linkedin] ${leads.length} leads para contatar hoje (limite: ${DAILY_LIMIT})`);
    console.log('[linkedin] Abrindo Chrome...\n');

    const browser = await chromium.launch({
        headless: false, // VISÍVEL — humano supervisiona
        slowMo: 50,
    });

    const context = await browser.newContext({
        viewport: { width: 1280, height: 800 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    try {
        await loginToLinkedIn(page);

        let sent = 0;
        let skipped = 0;

        for (let i = 0; i < leads.length; i++) {
            const lead = leads[i];
            const message = buildMessage(lead.business_name);

            console.log(`\n─────────────────────────────────────────`);
            console.log(`[${i + 1}/${leads.length}] ${lead.business_name}`);
            console.log(`Tier: ${lead.lead_tier || 'N/A'} | Nicho: ${lead.niche}`);
            console.log(`URL: ${lead.linkedin_url}`);
            console.log(`\nMensagem:\n"${message}"`);
            console.log(`─────────────────────────────────────────`);

            const action = await prompt(rl, '\nENTER = enviar  |  S = pular  |  Q = parar: ');

            if (action.toLowerCase() === 'q') {
                console.log('\n[linkedin] Parando por comando do usuário.');
                break;
            }

            if (action.toLowerCase() === 's') {
                console.log('[linkedin] Pulado.');
                skipped++;
                continue;
            }

            // ENTER — executar
            const result = await sendConnection(page, lead.linkedin_url, message);

            if (result === 'sent') {
                // Aguarda confirmação final do usuário (ver se mensagem ficou certa)
                const confirm = await prompt(rl, 'Mensagem preenchida. ENTER = confirmar envio  |  S = cancelar: ');

                if (confirm.toLowerCase() !== 's') {
                    // Clica Enviar
                    const sendBtn = await page.$('button[aria-label*="Enviar"]').catch(() => null);
                    if (sendBtn) {
                        await sendBtn.click();
                        await markContacted(lead.id);
                        sent++;
                        console.log(`[linkedin] ✓ Enviado para ${lead.business_name}`);
                    }
                } else {
                    // Fecha modal
                    await page.keyboard.press('Escape');
                    console.log('[linkedin] Cancelado.');
                    skipped++;
                }
            } else if (result === 'already_connected') {
                console.log(`[linkedin] Já conectado com ${lead.business_name} — marcando como contatado.`);
                await markContacted(lead.id);
            } else {
                console.log(`[linkedin] Não foi possível conectar com ${lead.business_name} (${result}).`);
                skipped++;
            }

            await randomDelay(); // delay humano entre leads
        }

        console.log(`\n[linkedin] ✅ Sessão concluída`);
        console.log(`Enviados: ${sent} | Pulados: ${skipped}`);

    } finally {
        rl.close();
        await browser.close();
    }
}

// ─── Entry Point ──────────────────────────────────────────────────────────────

runLinkedInOutreach();
