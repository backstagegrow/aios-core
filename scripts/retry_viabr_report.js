const { clickupRequest } = require('./lib/clickup-env');

const REPORT = {
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
};

async function run() {
    console.log(`--- RETRYING POST FOR ${REPORT.name} ---`);
    try {
        const res = await clickupRequest('POST', `/task/${REPORT.taskId}/comment`, {
            comment_text: REPORT.content
        });
        if (res && res.id) {
            console.log(`✅ Success for ${REPORT.name}`);
        } else {
            console.log(`❌ Failed for ${REPORT.name}:`, JSON.stringify(res));
        }
    } catch (e) {
        console.error(`❌ ERROR:`, e.status, JSON.stringify(e.data || e.message));
    }
}

run();
