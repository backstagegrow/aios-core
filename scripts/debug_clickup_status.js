const https = require('https');

const { API_KEY, clickupRequest } = require('./lib/clickup-env');
const LIST_ID = '901324771638'; // Backstage Grow

function clickupRequest(method, path, body) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.clickup.com',
            port: 443,
            path: '/api/v2' + path,
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
    console.log('--- BUSCANDO STATUS DA LISTA ---');
    const res = await clickupRequest('GET', '/list/' + LIST_ID);
    if (res.status === 200) {
        console.log('Statuses:', JSON.stringify(res.data.statuses, null, 2));
    } else {
        console.error('Erro:', res.status, res.data);
    }
}

run();
