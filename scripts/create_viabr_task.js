const { clickupRequest } = require('./lib/clickup-env');

const LIST_ID = '901324771638'; // Via BR Cenografia

const REPORT_CONTENT = `**[META ADS AUDIT - BOARD DIRECTIVE]**

📊 **Performance (30d):** 
- Spend: R$ 878.50
- CPL: R$ 17.93
- Conversions: 49

🧠 **C-Level Insights:**
1. **Munger/Inversion:** Focar os criativos na 'Dor da Perda' (não estar pronto para a Copa 2026) em vez de apenas autoridade.
2. **Breeze/Cascade:** Implementar vídeos em cascata para nutrir quem clicou mas não converteu no site.

🛠 **Next Action:** Criar 2 novas variações de anúncios focadas especificamente na Copa 2026.`;

async function run() {
    console.log('--- CREATING NEW TASK FOR VIA BR ---');
    try {
        const res = await clickupRequest('POST', `/list/${LIST_ID}/task`, {
            name: '📊 [REPORT] - Auditoria Performance Meta Ads',
            description: REPORT_CONTENT,
            status: 'aberto'
        });
        if (res && res.id) {
            console.log(`✅ Success: Task created with ID ${res.id}`);
        } else {
            console.log(`❌ Failed:`, JSON.stringify(res));
        }
    } catch (e) {
        console.error(`❌ ERROR:`, e.status, JSON.stringify(e.data || e.message));
    }
}

run();
