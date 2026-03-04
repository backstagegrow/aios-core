const https = require('https');
const fs = require('fs');
const path = require('path');

const LIST_ID = '901325984626';

function getApiKey() {
    const envPath = path.resolve(__dirname, '..', '.env');
    let apiKey = null;
    try {
        const content = fs.readFileSync(envPath, 'utf-8');
        for (const line of content.split('\n')) {
            if (line.trim().startsWith('CLICKUP_API_KEY=')) {
                apiKey = line.split('=')[1].trim();
                break;
            }
        }
    } catch (e) {
        console.error("No .env found", e);
    }
    return apiKey || process.env.CLICKUP_API_KEY;
}

const CLICKUP_API_KEY = getApiKey();

const options = {
    hostname: 'api.clickup.com',
    path: `/api/v2/list/${LIST_ID}/task`,
    method: 'GET',
    headers: {
        'Authorization': CLICKUP_API_KEY,
        'Content-Type': 'application/json'
    }
};

const req = https.request(options, res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
        let parsed;
        try {
            parsed = JSON.parse(body);
        } catch (e) {
            console.log("Erro no parse JSON", body);
            return;
        }

        if (!parsed.tasks) {
            console.log("Lista de tarefas não encontrada:", parsed);
            return;
        }

        console.log(`Encontradas ${parsed.tasks.length} tarefas na lista ${LIST_ID}`);
        parsed.tasks.forEach(t => {
            console.log(`- ${t.name} | Status: ${t.status.status}`);
        });
    });
});

req.on('error', error => {
    console.error(error);
});

req.end();
