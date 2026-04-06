import Anthropic from '@anthropic-ai/sdk';
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

const FEED_PATH = 'clients/BFTFoods/data/news-feed.json';
const HISTORY_PATH = 'clients/BFTFoods/data/news-history.json';
const OBSIDIAN_PATH = 'd:/01 -Arquivos/Obsidian/AIOS/Projects/Clientes/BFTFoods/BFTFoods_Social_Ideas.md';

const CATEGORY_ANGLE: Record<string, string> = {
    tariff:      'foque no impacto tarifário e na oportunidade de arbitragem comercial para traders',
    certification: 'foque no diferencial de conformidade halal e vantagem competitiva em mercados islâmicos',
    market:      'foque na tendência de mercado e posicionamento estratégico para crescimento da trading',
    logistics:   'foque em eficiência operacional, redução de lead time e visibilidade na cadeia de suprimentos',
    other:       'foque no insight de mercado mais relevante para uma empresa de trading de proteína animal',
};

async function generatePost(client: Anthropic, news: NewsItem): Promise<string> {
    const angle = CATEGORY_ANGLE[news.category ?? 'other'];

    const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{
            role: 'user',
            content: `Você é o gestor de redes sociais da BFT Foods, empresa brasileira especializada em trading internacional de proteína animal (carne bovina, frango, halal).

Crie um post institucional para o Instagram com base nesta notícia:
TÍTULO: ${news.title}
FONTE: ${news.source}
REGIÃO: ${news.region ?? 'Global'}
CATEGORIA: ${news.category ?? 'other'}
SNIPPET: ${news.snippet ?? '(sem detalhes adicionais)'}

INSTRUÇÕES:
- Tom: profissional, especialista, confiante — não jornalístico, não genérico
- ${angle}
- Inclua 1 insight proprietário derivado da notícia (algo que um especialista saberia)
- Máximo 150 palavras
- Termine com 4-5 hashtags relevantes: sempre #BFTFoods, mais 3-4 específicas do tema
- NÃO use frases genéricas como "fique atento" ou "acompanhe nosso perfil"
- NÃO mencione a notícia diretamente — use-a como contexto para posicionamento

Responda APENAS com o texto do post, sem título ou introdução.`,
        }],
    });

    return (message.content[0] as { type: string; text: string }).text.trim();
}

function generateFallbackPost(news: NewsItem): string {
    const angle = CATEGORY_ANGLE[news.category ?? 'other'];
    return `📊 ${news.title}\n\nContexto: ${news.snippet ?? news.source} — ${angle}.\n\n[Link](${news.link})\n\n#BFTFoods #Trading #Commodities`;
}

async function generateSocialPosts() {
    // Tenta usar o feed atual; fallback para histórico
    let feed: NewsItem[] = [];
    if (await fs.pathExists(FEED_PATH)) {
        feed = await fs.readJson(FEED_PATH);
    } else {
        const history: NewsItem[] = await fs.readJson(HISTORY_PATH);
        feed = history.slice(-10);
    }

    if (feed.length === 0) {
        console.error('❌ Nenhuma notícia disponível. Execute bft-scout-engine primeiro.');
        process.exit(1);
    }

    // Top 5 por relevância (já vem ordenado do feed, mas garantimos aqui)
    const topNews = feed
        .sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0))
        .slice(0, 5);

    const client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;
    if (!client) {
        console.warn('⚠️  ANTHROPIC_API_KEY não encontrada — usando posts de fallback (sem IA).');
    }

    let content = '# 🚀 BFT Foods — Social Content Ideas\n\n';
    content += `*Gerado em: ${new Date().toLocaleString('pt-BR')}*\n`;
    content += `*Fonte: ${client ? 'Claude Haiku (IA)' : 'Template fallback'}*\n\n---\n\n`;

    for (let i = 0; i < topNews.length; i++) {
        const news = topNews[i];
        const categoryLabel = news.category ?? 'other';
        const scoreLabel = news.relevanceScore !== undefined ? `${(news.relevanceScore * 100).toFixed(0)}%` : 'N/A';

        console.log(`✍️  Gerando post ${i + 1}/${topNews.length}: "${news.title.slice(0, 50)}..."  [score: ${scoreLabel}]`);

        let postText: string;
        if (client) {
            try {
                postText = await generatePost(client, news);
            } catch (err) {
                console.warn(`⚠️  Erro ao gerar post com IA, usando fallback:`, (err as Error).message);
                postText = generateFallbackPost(news);
            }
        } else {
            postText = generateFallbackPost(news);
        }

        content += `### Post ${i + 1} — ${categoryLabel.toUpperCase()} · Score: ${scoreLabel}\n`;
        content += `**Fonte:** ${news.source} · **Região:** ${news.region ?? 'Global'} · **Data:** ${news.date}\n`;
        content += `**Notícia-base:** [${news.title}](${news.link})\n\n`;
        content += `**Post gerado:**\n\n`;
        content += postText.split('\n').map(l => `> ${l}`).join('\n');
        content += '\n\n---\n\n';
    }

    await fs.ensureFile(OBSIDIAN_PATH);
    await fs.writeFile(OBSIDIAN_PATH, content);

    console.log(`\n✅ ${topNews.length} posts gerados e sincronizados em:\n   ${OBSIDIAN_PATH}`);
}

generateSocialPosts().catch(err => console.error('❌ Erro:', err));
