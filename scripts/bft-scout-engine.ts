import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';
import fs from 'fs-extra';
import 'dotenv/config';

interface NewsItem {
    source: string;
    date: string;
    title: string;
    link: string;
    snippet?: string;
    region?: string;
    relevanceScore?: number;
    category?: 'tariff' | 'certification' | 'market' | 'logistics' | 'other';
}

const CURRENCY_WINDOW_DAYS = 7;
const HISTORY_RETENTION_DAYS = 30;
const HISTORY_PATH = 'clients/BFTFoods/data/news-history.json';
const FEED_PATH = 'clients/BFTFoods/data/news-feed.json';
const KEYWORDS_PATH = 'clients/BFTFoods/data/keywords.json';

const GEO_LOCALE_MAP: Record<string, string> = {
    'Brazil': 'br',
    'USA': 'us',
    'Dubai': 'ae',
    'China': 'cn',
    'Saudi Arabia': 'sa',
    'Middle East': 'ae',
    'Global': 'us',
};

function getLocaleForRegion(region: string): string {
    return GEO_LOCALE_MAP[region] ?? 'us';
}

// --- Guardrail v2: regex expandido PT/AR como fallback ---
const FORBIDDEN_PATTERNS = [
    // EN
    /criticism/i, /protest/i, /scandal/i, /corruption/i, /government fail/i,
    /strikes?/i, /riot/i, /boycott/i, /bribery/i, /fraud/i,
    // PT
    /escândalo/i, /corrupção/i, /protesto/i, /greve/i, /fraude/i,
    /crítica.{0,10}governo/i, /denúncia/i, /irregularidade/i,
    // AR transliterated
    /fasad/i, /ihtijaj/i,
];

function isValidNewsFallback(title: string): boolean {
    return !FORBIDDEN_PATTERNS.some(r => r.test(title));
}

// --- Guardrail v2: classificador LLM (Claude Haiku) ---
interface GuardrailResult {
    pass: boolean;
    category: NewsItem['category'];
    relevanceScore: number;
}

let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic | null {
    if (!process.env.ANTHROPIC_API_KEY) return null;
    if (!anthropicClient) anthropicClient = new Anthropic();
    return anthropicClient;
}

async function classifyNewsItem(title: string, snippet: string): Promise<GuardrailResult> {
    const client = getAnthropicClient();

    // Sem API key: usa fallback regex + heurística de categoria
    if (!client) {
        return {
            pass: isValidNewsFallback(title),
            category: inferCategoryFromTitle(title),
            relevanceScore: inferRelevanceScore(title),
        };
    }

    try {
        const message = await client.messages.create({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 100,
            messages: [{
                role: 'user',
                content: `Você é o filtro institucional da BFT Foods, empresa de trading de commodities alimentares (carne bovina, frango, halal).

Analise esta notícia:
TÍTULO: ${title}
SNIPPET: ${snippet || '(sem snippet)'}

Responda APENAS com JSON válido neste formato exato:
{"pass": true/false, "category": "tariff|certification|market|logistics|other", "relevanceScore": 0.0-1.0}

REGRAS:
- pass=false se: crítica política, escândalo, especulação negativa, conteúdo que prejudica imagem de marca
- pass=true se: tarifas, acordos comerciais, certificações halal, recordes de exportação/importação, logística portuária, preços de commodities
- category: tariff=tarifas/acordos, certification=halal/certificações, market=preços/consumo/produção, logistics=portos/frete/supply chain, other=demais
- relevanceScore: 1.0=muito relevante para trading de proteína animal, 0.0=irrelevante`,
            }],
        });

        const text = (message.content[0] as { type: string; text: string }).text.trim();
        const parsed = JSON.parse(text);
        return {
            pass: Boolean(parsed.pass),
            category: parsed.category ?? 'other',
            relevanceScore: Number(parsed.relevanceScore ?? 0.5),
        };
    } catch {
        // Fallback se LLM falhar
        return {
            pass: isValidNewsFallback(title),
            category: inferCategoryFromTitle(title),
            relevanceScore: inferRelevanceScore(title),
        };
    }
}

function inferCategoryFromTitle(title: string): NewsItem['category'] {
    const t = title.toLowerCase();
    if (/tariff|tarifa|import|export|acordo|agreement|trade deal/.test(t)) return 'tariff';
    if (/halal|certif/.test(t)) return 'certification';
    if (/port|porto|freight|frete|shipping|logistics|logística|supply chain/.test(t)) return 'logistics';
    if (/price|preço|market|mercado|record|recorde|consumption|consumo/.test(t)) return 'market';
    return 'other';
}

function inferRelevanceScore(title: string): number {
    const t = title.toLowerCase();
    const highValue = ['beef', 'boi', 'poultry', 'frango', 'halal', 'tariff', 'export', 'dubai', 'china', 'saudi', 'striploin', 'tenderloin'];
    const matches = highValue.filter(kw => t.includes(kw)).length;
    return Math.min(1.0, 0.3 + matches * 0.15);
}

// --- Dedup por conteúdo (Jaccard similarity) ---
function jaccardSimilarity(a: string, b: string): number {
    const setA = new Set(a.toLowerCase().split(/\s+/));
    const setB = new Set(b.toLowerCase().split(/\s+/));
    const intersection = [...setA].filter(w => setB.has(w)).length;
    const union = new Set([...setA, ...setB]).size;
    return union === 0 ? 0 : intersection / union;
}

function isDuplicateByContent(title: string, existing: NewsItem[]): boolean {
    return existing.some(item => jaccardSimilarity(title, item.title) > 0.7);
}

// --- Utilitários ---
function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runScout(region: string) {
    console.log(`📡 Iniciando busca REAL para região: ${region}...`);

    const keywords = await fs.readJson(KEYWORDS_PATH);
    const history = await fs.readJson(HISTORY_PATH) as NewsItem[];
    const existingLinks = new Set(history.map(item => item.link));

    const results: NewsItem[] = [];
    const apiKey = process.env.SERPER_API_KEY;

    if (!apiKey) {
        console.error('❌ SERPER_API_KEY não encontrada no .env');
        return;
    }

    if (!process.env.ANTHROPIC_API_KEY) {
        console.warn('⚠️  ANTHROPIC_API_KEY não encontrada — guardrail LLM desativado, usando fallback regex.');
    }

    // 1. Busca por Nichos Globais
    for (const niche of keywords.niches) {
        const queries = [
            `${niche} trading logistics news ${region}`,
            `${niche} port authority ${region} news`,
            `halal ${niche} certification ${region}`,
        ];
        for (const query of queries) {
            console.log(`🔍 Pesquisando: "${query}"...`);
            await fetchSerperNews(query, region, apiKey, results, history, existingLinks);
            await sleep(500);
        }
    }

    // 2. Busca por Produtos de Alto Valor (Cortes Específicos)
    console.log('💎 Iniciando busca de alta precisão (Cortes e Produtos)...');
    const productQuotes = keywords.high_value_products.slice(0, 5);
    for (const product of productQuotes) {
        const query = `"${product}" trade price news ${region}`;
        await fetchSerperNews(query, region, apiKey, results, history, existingLinks);
        await sleep(500);
    }

    // 3. Monitoramento de Marcas e Mercado
    console.log('🛡️ Monitorando Brand Intelligence e Mercado...');
    const brandQuery = `(${keywords.brands.join(' OR ')}) ${region} trading news`;
    await fetchSerperNews(brandQuery, region, apiKey, results, history, existingLinks);
    await sleep(500);

    // 4. Fallback: Portais de Autoridade se o volume for baixo
    if (results.length < 10) {
        const portalQuery = `meat logistics news (${keywords.portals.map((p: string) => `site:${p}`).join(' OR ')})`;
        console.log(`📡 Fallback Portais Autoridade: "${portalQuery}"...`);
        await fetchSerperNews(portalQuery, region, apiKey, results, history, existingLinks);
    }

    console.log(`✅ ${results.length} novas notícias únicas e recentes encontradas.`);

    if (results.length > 0) {
        // Ordenar por relevanceScore desc antes de gravar
        const sorted = results.sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0));
        const finalBatch = sorted.slice(0, 15);

        // History pruning: manter apenas últimos HISTORY_RETENTION_DAYS
        const retentionCutoff = new Date();
        retentionCutoff.setDate(retentionCutoff.getDate() - HISTORY_RETENTION_DAYS);
        const prunedHistory = history.filter(item => new Date(item.date) >= retentionCutoff);

        const updatedHistory = [...prunedHistory, ...finalBatch];
        await fs.writeJson(HISTORY_PATH, updatedHistory, { spaces: 2 });
        console.log(`💾 ${finalBatch.length} notícias adicionadas ao histórico (${prunedHistory.length} mantidas após pruning).`);
    } else {
        console.log('ℹ️ Nenhuma notícia nova atendeu aos critérios nesta rodada.');
    }

    // Exportar news-feed.json: apenas notícias dentro da janela atual, ordenadas por score
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - CURRENCY_WINDOW_DAYS);
    const allHistory = await fs.readJson(HISTORY_PATH) as NewsItem[];
    const feed = allHistory
        .filter(item => new Date(item.date) >= cutoff)
        .sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0));
    await fs.writeJson(FEED_PATH, feed, { spaces: 2 });
    console.log(`📰 news-feed.json atualizado: ${feed.length} notícias dos últimos ${CURRENCY_WINDOW_DAYS} dias.`);
}

async function fetchSerperNews(
    query: string,
    region: string,
    apiKey: string,
    results: NewsItem[],
    history: NewsItem[],
    existingLinks: Set<string>,
) {
    try {
        const response = await axios.post('https://google.serper.dev/news', {
            q: query,
            gl: getLocaleForRegion(region),
            tbm: 'nws',
            num: 10,
        }, {
            headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' },
        });

        const newsItems = response.data.news || [];
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - CURRENCY_WINDOW_DAYS);

        for (const n of newsItems) {
            const itemDate = parseSerperDate(n.date);
            if (itemDate < cutoff) continue;
            if (existingLinks.has(n.link)) continue;
            if (isDuplicateByContent(n.title, [...results, ...history])) continue;

            const { pass, category, relevanceScore } = await classifyNewsItem(n.title, n.snippet ?? '');
            if (!pass) {
                console.log(`🚫 Bloqueado pelo guardrail: "${n.title.slice(0, 60)}..."`);
                continue;
            }

            results.push({
                source: n.source || 'Portal Web',
                date: itemDate.toISOString().split('T')[0],
                title: n.title,
                link: n.link,
                snippet: n.snippet,
                region,
                category,
                relevanceScore,
            });
            existingLinks.add(n.link);
        }
    } catch (err) {
        console.error(`❌ Erro ao buscar: ${query}`, err);
    }
}


function parseSerperDate(dateStr: string): Date {
    if (!dateStr) return new Date();

    const now = new Date();
    const match = dateStr.match(/(\d+)\s+(minute|hour|day|week|month|year)s?\s+ago/i);

    if (match) {
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        switch (unit) {
            case 'minute': now.setMinutes(now.getMinutes() - value); break;
            case 'hour':   now.setHours(now.getHours() - value); break;
            case 'day':    now.setDate(now.getDate() - value); break;
            case 'week':   now.setDate(now.getDate() - value * 7); break;
            case 'month':  now.setMonth(now.getMonth() - value); break;
            case 'year':   now.setFullYear(now.getFullYear() - value); break;
        }
        return now;
    }

    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
}

// CLI entry point
const region = process.argv[2] || 'Global';
runScout(region).catch(err => {
    console.error('❌ Erro na sonda:', err);
});
