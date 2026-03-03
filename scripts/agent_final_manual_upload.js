const https = require('https');
const fs = require('fs');

const { API_KEY, clickupRequest } = require('./lib/clickup-env');
const CLIENTS = [
    { name: 'sp HAUS', id: '901325044225', path: 'd:/001Gravity/aios-core/clients/spHaus/memory_strategy.md' },
    { name: 'Via BR Cenografia', id: '901325044224', path: 'd:/001Gravity/aios-core/clients/ViaBrCenografia/memory_strategy.md' },
    { name: 'GT House', id: '901325044211', path: 'd:/001Gravity/aios-core/clients/GTHouse/memory_strategy.md' },
    { name: 'Espaço Constru', id: '901325044223', path: 'd:/001Gravity/aios-core/clients/EspacoNetworkConstru/memory_strategy.md' },
    { name: 'Backstage Grow', id: '901325044221', path: 'd:/001Gravity/aios-core/clients/BKSGrow/memory_strategy.md' }
];

function clickupRequest(method, path, body) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'api.clickup.com',
            port: 443,
            path: `/api/v2${path}`,
            method: method,
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/json',
            },
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, data: JSON.parse(data) }); } catch (e) { resolve({ status: res.statusCode, data: data }); }
            });
        });

        req.on('error', (e) => resolve({ status: 500, error: e.message }));
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function run() {
    console.log('--- INICIANDO UPLOAD DE MANUAIS VIA COMENTÁRIOS DE LISTA ---');
    for (const client of CLIENTS) {
        if (fs.existsSync(client.path)) {
            console.log(`Lendo manual para ${client.name}...`);
            const content = fs.readFileSync(client.path, 'utf8');

            const res = await clickupRequest('POST', `/list/${client.id}/comment`, {
                comment_text: content,
                notify_all: true
            });
            console.log(`  Resultado ${client.name}: Status ${res.status}`);
        } else {
            console.warn(`  Arquivo não encontrado para ${client.name}: ${client.path}`);
        }
    }
    console.log('--- UPLOAD CONCLUÍDO ---');
}

run();
