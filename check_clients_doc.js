const https = require('https');

const API_KEY = 'pk_111906470_L5VDUBKWMGS3CGWAFMKE6TJ5QL3154JA';
const DOC_ID = '2ky561e2-2453';
const PAGE_ID = '2ky561e2-173';

function getClickUp(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.clickup.com',
            port: 443,
            path: `/api/v2${path}`,
            method: 'GET',
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try { resolve(JSON.parse(data)); } catch (e) { resolve(data); }
                } else {
                    reject(new Error(`Status ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.end();
    });
}

async function run() {
    try {
        console.log(`Buscando conteúdo da Página: ${PAGE_ID} no Documento: ${DOC_ID}...`);

        // Tentativa 1: Doc Info
        const doc = await getClickUp(`/doc/${DOC_ID}`);
        console.log(`\n### Documento: ${doc.name}`);

        // Tentativa 2: Listar páginas e buscar conteúdo
        if (doc.pages) {
            for (const page of doc.pages) {
                console.log(`\n--- Página: ${page.name} (ID: ${page.id}) ---`);
                // Buscando conteúdo da página específica se for a pedida ou iterando
                // Algumas versões da API retornam o conteúdo em blocks
                const pageDetail = await getClickUp(`/doc/${DOC_ID}/page/${page.id}`);
                console.log(JSON.stringify(pageDetail, null, 2).substring(0, 1000) + "...");
            }
        }

    } catch (err) {
        console.error(`❌ Erro: ${err.message}`);
        console.log("A API de Docs pode exigir permissões específicas ou estar em uma versão diferente.");
    }
}

run();
