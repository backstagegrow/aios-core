import fs from 'fs-extra';

const HISTORY_PATH = 'clients/BFTFoods/data/news-history.json';
const OBSIDIAN_PATH = 'd:/01 -Arquivos/Obsidian/AIOS/Projects/Clientes/BFTFoods/BFTFoods_News.md';

async function generateBriefing() {
    if (!await fs.pathExists(HISTORY_PATH)) {
        console.log('❌ Nenhuma notícia encontrada no histórico.');
        return;
    }

    const history = await fs.readJson(HISTORY_PATH);

    if (history.length === 0) {
        console.log('ℹ️ Histórico vazio. Execute *run-scout primeiro.');
        return;
    }

    let report = '\n### 📊 BFT Market Briefing (Last 7 Days)\n';
    report += '| Fonte | Data | Manchete | Link |\n';
    report += '| :--- | :--- | :--- | :--- |\n';

    history.forEach((n: any) => {
        report += `| ${n.source} | ${n.date} | **${n.title}** | [Link](${n.link}) |\n`;
    });

    report += '\n---\n*Gerado automaticamente pela Market-Scout Factory*';

    console.log(report);

    // Sync with Obsidian
    try {
        await fs.ensureFile(OBSIDIAN_PATH);
        await fs.writeFile(OBSIDIAN_PATH, report);
        console.log(`\n✨ Obsidian sincronizado em: ${OBSIDIAN_PATH}`);
    } catch (err) {
        console.error('❌ Erro ao sincronizar com Obsidian:', err);
    }
}

generateBriefing().catch(err => console.error(err));
