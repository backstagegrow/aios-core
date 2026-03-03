const https = require('https');
const fs = require('fs');

const { API_KEY, clickupRequest } = require('./lib/clickup-env');
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
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); } catch (e) { resolve(data); }
        } else {
          reject(new Error(`Status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

const clients = [
  { name: 'GT House', listId: '901324517019', memoPath: 'd:/001Gravity/aios-core/clients/GTHouse/memory_strategy.md' },
  { name: 'sp HAUS', listId: '901324514510', memoPath: 'd:/001Gravity/aios-core/clients/spHaus/memory_strategy.md' },
  { name: 'Via BR Cenografia', listId: '901324514634', memoPath: 'd:/001Gravity/aios-core/clients/ViaBrCenografia/memory_strategy.md' },
  { name: 'Espaço Constru', listId: '901324526474', memoPath: 'd:/001Gravity/aios-core/clients/EspacoNetworkConstru/memory_strategy.md' },
  { name: 'Backstage Grow', listId: '901324771638', memoPath: 'd:/001Gravity/aios-core/clients/BKSGrow/memory_strategy.md' },
];

async function run() {
  console.log('--- TENTATIVA FINAL: CRIANDO TAREFAS SEM STATUS ---');
  for (const client of clients) {
    try {
      console.log(`Subindo: ${client.name}...`);
      if (!fs.existsSync(client.memoPath)) continue;
      const content = fs.readFileSync(client.memoPath, 'utf8');

      const taskBody = {
        name: `📜 MANUAL ESTRATÉGICO (${client.name})`,
        markdown_description: content,
        priority: 1,
      };

      const response = await clickupRequest('POST', `/list/${client.listId}/task`, taskBody);
      console.log(`  ✅ SUCESSO! Task URL: ${response.url}`);
    } catch (e) {
      console.error(`  ❌ Falha em ${client.name}: ${e.message}`);
    }
  }
}

run();
