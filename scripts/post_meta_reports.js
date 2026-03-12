const { clickupRequest } = require('./lib/clickup-env');

const REPORTS = [
    {
        name: 'GT House',
        taskId: '86afyq9ky',
        content: `**[META ADS AUDIT - BOARD DIRECTIVE]**
        
📊 **Performance (30d):** 
- Spend: R$ 358.17 (DP) / R$ 1506.42 (ABO)
- CPL: **R$ 6.18** (Outlier) vs R$ 8.28
- Conversions: 240+

🧠 **C-Level Insights:**
1. **Mandalia/BPA:** O anúncio '[DP]' validou o criativo outlier. Recomendo 'Graduation' imediata para escala CBO.
2. **Finch/Scale:** Injetar verba incremental de 20% a cada 3 dias na campanha de maior ROI.

🛠 **Next Action:** Escalar o conjunto de anúncio vencedor e pausar criativos com CPL > R$ 10.`
    },
    {
        name: 'BCK Grow',
        taskId: '86afufn2z',
        content: `**[META ADS AUDIT - BOARD DIRECTIVE]**

📊 **Performance (30d):** 
- Spend: R$ 433.60
- CPL: R$ 21.68
- Conversions: 20

🧠 **C-Level Insights:**
1. **Hormozi/Offer:** A oferta atual está "morna". Precisamos de uma 'Grand Slam Offer' para baixar o CPL.
2. **Brunson/Hook:** O gancho "Marketing sem dados é aposta" é forte, mas precisa de suporte visual mais agressivo.

🛠 **Next Action:** Testar nova variant de oferta (Diagnóstico Gratuito 80/20) para bater meta de CPL < R$ 15.`
    },
    {
        name: 'Via BR Cenografia',
        taskId: '86ay5y6f8',
        content: `**[META ADS AUDIT - BOARD DIRECTIVE]**

📊 **Performance (30d):** 
- Spend: R$ 878.50
- CPL: R$ 17.93
- Conversions: 49

🧠 **C-Level Insights:**
1. **Munger/Inversion:** Focar os criativos na 'Dor da Perda' (não estar pronto para a Copa 2026) em vez de apenas autoridade.
2. **Breeze/Cascade:** Implementar vídeos em cascata para nutrir quem clicou mas não converteu no site.

🛠 **Next Action:** Criar 2 novas variações de anúncios focadas especificamente na Copa 2026.`
    }
];

async function run() {
    console.log('--- POSTING REPORTS TO CLICKUP ---');
    for (const report of REPORTS) {
        try {
            console.log(`Posting for ${report.name} to task ${report.taskId}...`);
            const res = await clickupRequest('POST', `/task/${report.taskId}/comment`, {
                comment_text: report.content
            });
            if (res && res.id) {
                console.log(`✅ Success for ${report.name}`);
            } else {
                console.log(`❌ Failed for ${report.name}: Unexpected response`, JSON.stringify(res));
            }
        } catch (e) {
            console.error(`❌ ERROR for ${report.name}:`, e.status, JSON.stringify(e.data || e.message));
        }
    }
}

run();
