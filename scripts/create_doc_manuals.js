const https = require('https');
const fs = require('fs');

const API_KEY = 'pk_111906470_L5VDUBKWMGS3CGWAFMKE6TJ5QL3154JA';

function clickupPost(path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.clickup.com',
      port: 443,
      path: `/api/v2${path}`,
      method: 'POST',
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
    req.write(JSON.stringify(body));
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

async function createDocViews() {
  console.log('--- CRIANDO DOCUMENTOS NAS LISTAS DOS CLIENTES ---');
  for (const client of clients) {
    try {
      console.log(`Criando Doc para: ${client.name}...`);
      if (fs.existsSync(client.memoPath)) {
        const content = fs.readFileSync(client.memoPath, 'utf8');

        // Create a View of type 'doc' on the list
        // This will create a ClickUp Doc associated with that list
        const viewBody = {
          name: '📘 MANUAL ESTRATÉGICO (NOVO)',
          type: 'doc',
          content: content,
          settings: {
            show_task_locations: false,
            show_subtasks: 0,
            show_closed_subtasks: false,
            show_assignees: false,
            show_images: true,
          },
        };

        const response = await clickupPost(`/list/${client.listId}/view`, viewBody);
        console.log(`  ✅ Documento criado! URL: https://app.clickup.com/v/dc/${response.view.id}`);
      }
    } catch (e) {
      console.error(`  ❌ Erro em ${client.name}: ${e.message}`);
    }
  }
}

createDocViews();
