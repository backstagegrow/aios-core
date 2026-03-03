const https = require('https');

const { API_KEY, clickupRequest } = require('./lib/clickup-env');
function clickupRequest(method, path) {
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
        req.end();
    });
}

async function run() {
    const listIds = ['901324514510', '901324517019']; // sp HAUS, GT House
    console.log('--- BUSCANDO VIEWS DE DOCS ---');

    for (const listId of listIds) {
        const res = await clickupRequest('GET', `/list/${listId}/view`);
        if (res.data.views) {
            console.log(`\nViews para Lista ${listId}:`);
            for (const view of res.data.views) {
                if (view.type === 'doc') {
                    console.log(`  DOC VIEW: ${view.name} | ID: ${view.id}`);
                } else {
                    console.log(`  Other View: ${view.name} (${view.type}) | ID: ${view.id}`);
                }
            }
        }
    }
}

run();
