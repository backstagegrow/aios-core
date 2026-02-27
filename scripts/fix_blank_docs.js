const https = require('https');
const fs = require('fs');

const API_KEY = 'pk_111906470_L5VDUBKWMGS3CGWAFMKE6TJ5QL3154JA';

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
  console.log('--- CORRIGINDO MANUAIS (CRIANDO PÁGINAS COM CONTEÚDO) ---');
  for (const client of clients) {
    try {
      console.log(`Processando: ${client.name}...`);
      if (!fs.existsSync(client.memoPath)) continue;
      const content = fs.readFileSync(client.memoPath, 'utf8');

      // 1. Criar o Documento (View)
      const viewResponse = await clickupRequest('POST', `/list/${client.listId}/view`, {
        name: '📘 MANUAL ESTRATÉGICO (CONTEÚDO)',
        type: 'doc',
      });

      const docId = viewResponse.view.id;
      console.log(`  Documento criado: ${docId}`);

      // 2. Criar a Página com o conteúdo real
      const pageResponse = await clickupRequest('POST', `/doc/${docId}/page`, {
        name: 'Estratégia Mestre',
        content: content,
      });

      console.log(`  ✅ Página criada com conteúdo para ${client.name}!`);
    } catch (e) {
      console.error(`  ❌ Erro em ${client.name}: ${e.message}`);
      // Se falhar por causa do endpoint de Doc, tentamos via Space
    }
  }
}

run();
