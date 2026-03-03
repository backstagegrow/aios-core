const https = require('https');
const fs = require('fs');

const { API_KEY, clickupRequest } = require('./lib/clickup-env');
const PAGE_ID = '2ky561e2-173';
const MEMO_PATH = 'd:/001Gravity/aios-core/clients/spHaus/memory_strategy.md';

function clickupRequest(method, path, body) {
    return new Promise((resolve, reject) => {
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

        req.on('error', (e) => reject(e));
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function run() {
    console.log('--- ATUALIZANDO MANUAL sp HAUS ---');
    if (!fs.existsSync(MEMO_PATH)) {
        console.error('Arquivo de manual não encontrado:', MEMO_PATH);
        return;
    }
    const content = fs.readFileSync(MEMO_PATH, 'utf8');

    // Tentativa de update na página do doc
    const res = await clickupRequest('PUT', `/page/${PAGE_ID}`, {
        content: content,
        name: '📘 MANUAL ESTRATÉGICO - sp HAUS',
    });

    console.log(`Status: ${res.status}`);
    if (res.status !== 200) {
        console.log('Tentando endpoint de view...');
        const resView = await clickupRequest('PUT', `/view/${PAGE_ID}`, {
            content: content,
            name: '📘 MANUAL ESTRATÉGICO - sp HAUS',
        });
        console.log(`Status View: ${resView.status}`);
    }

    console.log('--- CONCLUÍDO ---');
}

run();
