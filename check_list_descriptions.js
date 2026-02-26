const https = require('https');

const API_KEY = 'pk_111906470_L5VDUBKWMGS3CGWAFMKE6TJ5QL3154JA';

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
    const lists = [
        { name: "sp HAUS (Tráfego)", id: "901324526553" },
        { name: "Via BR Cenografia (Tráfego)", id: "901324526552" },
        { name: "GT House (Tráfego)", id: "901324526554" },
        { name: "Espaço Constru (Tráfego)", id: "901324526551" },
        { name: "Backstage Grow (Tráfego)", id: "901324771662" }
    ];

    try {
        for (const list of lists) {
            console.log(`\n### Descrição da Lista de: ${list.name}...`);
            const listData = await getClickUp(`/list/${list.id}`);
            console.log(`- Content: ${listData.content || "Vazio"}`);
        }
    } catch (err) {
        console.error(`❌ Erro: ${err.message}`);
    }
}

run();
