const https = require('https');
const fs = require('fs');

const API_KEY = 'pk_111906470_L5VDUBKWMGS3CGWAFMKE6TJ5QL3154JA';

function clickupPut(path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.clickup.com',
      port: 443,
      path: `/api/v2${path}`,
      method: 'PUT',
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

// IDs das views criadas anteriormente que estão em branco
const viewsToFix = [
  { name: 'GT House', id: '2ky561e2-3593', memoPath: 'd:/001Gravity/aios-core/clients/GTHouse/memory_strategy.md' },
  { name: 'sp HAUS', id: '2ky561e2-3613', memoPath: 'd:/001Gravity/aios-core/clients/spHaus/memory_strategy.md' },
  { name: 'Via BR Cenografia', id: '2ky561e2-3633', memoPath: 'd:/001Gravity/aios-core/clients/ViaBrCenografia/memory_strategy.md' },
  { name: 'Espaço Constru', id: '2ky561e2-3653', memoPath: 'd:/001Gravity/aios-core/clients/EspacoNetworkConstru/memory_strategy.md' },
  { name: 'Backstage Grow', id: '2ky561e2-3673', memoPath: 'd:/001Gravity/aios-core/clients/BKSGrow/memory_strategy.md' },
];

async function fixViews() {
  console.log('--- TENTANDO INJETAR CONTEÚDO NAS VIEWS EM BRANCO ---');
  for (const view of viewsToFix) {
    try {
      console.log(`Atualizando conteúdo da View: ${view.name} (${view.id})...`);
      if (fs.existsSync(view.memoPath)) {
        const content = fs.readFileSync(view.memoPath, 'utf8');

        // Tentativa de update no conteúdo da view
        // Nota: ClickUp às vezes aceita 'content' ou 'description' dependendo do tipo de view
        const result = await clickupPut(`/view/${view.id}`, {
          content: content,
          name: '📘 MANUAL ESTRATÉGICO (FW BKS)',
        });
        console.log('  ✅ View atualizada com sucesso.');
      }
    } catch (e) {
      console.error(`  ❌ Falha em ${view.name}: ${e.message}`);
    }
  }
}

fixViews();
