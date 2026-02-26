const https = require('https');

const API_KEY = 'pk_111906470_L5VDUBKWMGS3CGWAFMKE6TJ5QL3154JA';
const DOC_ID = '2ky561e2-2453'; // From the URL provided

function getClickUpDoc(docId) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.clickup.com',
            port: 443,
            path: `/api/v2/doc/${docId}`,
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
                    resolve(JSON.parse(data));
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
        console.log(`Buscando detalhes do Documento: ${DOC_ID}...`);
        const doc = await getClickUpDoc(DOC_ID);
        console.log(`\n### Documento: ${doc.name}`);

        if (doc.pages && doc.pages.length > 0) {
            console.log("\n### Páginas encontradas:");
            for (const page of doc.pages) {
                console.log(`- Página: ${page.name} (ID: ${page.id})`);
                // Note: ClickUp API v2 doesn't always return content in the list.
                // We might need to fetch page content specifically.
            }
        }
    } catch (err) {
        console.error(`❌ Erro ao buscar documento: ${err.message}`);
        console.log("Tentando listar documentos do workspace para encontrar os caminhos corretos...");
    }
}

run();
