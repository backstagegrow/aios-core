const https = require('https');
const fs = require('fs');
const path = require('path');

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
const LIST_ID = '901313508311';

function clickupRequest(method, endpoint, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.clickup.com',
            path: `/api/v2${endpoint}`,
            method,
            headers: {
                'Authorization': CLICKUP_API_KEY,
                'Content-Type': 'application/json',
            },
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });
        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

function readFileSafely(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (e) {
        return `Erro ao ler ${filePath}: ${e.message}`;
    }
}

async function uploadTask() {
    console.log("Iniciando upload de Alpha Business Academy para Clickup...");

    const clientPath = path.join(__dirname, '..', 'clients', 'AlphaBusinessAcademy');

    const memoryContent = readFileSafely(path.join(clientPath, 'memory_strategy.md'));
    const icpContent = readFileSafely(path.join(clientPath, 'icp.md'));
    const sentimentContent = readFileSafely(path.join(clientPath, 'sentiment_map.md'));
    const brandContent = readFileSafely(path.join(clientPath, 'brand_manual.md'));

    const fullDescription = `
${memoryContent}
---
${icpContent}
---
${brandContent}
---
${sentimentContent}
    `.trim();

    const taskBody = {
        name: "Alpha Business Academy - Inteligência e Setup Completo",
        markdown_description: fullDescription,
        status: "to do",
        priority: 2, // High
    };

    console.log(`Subindo tarefa para a Lista ${LIST_ID}`);
    const res = await clickupRequest('POST', `/list/${LIST_ID}/task`, taskBody);

    if (res.status === 200 || res.status === 201) {
        console.log(`✅ Tarefa criada com sucesso! URL: ${res.data.url}`);
    } else {
        console.log(`❌ Erro ao criar tarefa: ${JSON.stringify(res.data, null, 2)}`);
    }
}

uploadTask();
