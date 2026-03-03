const https = require('https');

const { API_KEY, clickupRequest } = require('./lib/clickup-env');
function clickupRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.clickup.com',
      port: 443,
      path: `/api/v2${path}`,
      method: 'GET',
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
    req.end();
  });
}

const docs = [
  { name: 'GT House', id: '2ky561e2-3053' },
  { name: 'sp HAUS', id: '2ky561e2-2453' },
  { name: 'Via BR Cenografia', id: '2ky561e2-3093' },
  { name: 'Espaço Constru', id: '2ky561e2-3073' },
  { name: 'Backstage Grow', id: '2ky561e2-3033' },
];

async function getPageIds() {
  console.log('--- BUSCANDO PAGE IDS PARA UPDATE ---');
  for (const doc of docs) {
    try {
      const docInfo = await clickupRequest(`/doc/${doc.id}`);
      if (docInfo.pages && docInfo.pages.length > 0) {
        // We take the first page as the main manual page
        const mainPage = docInfo.pages[0];
        console.log(`CLIENTE: ${doc.name} | DOC: ${doc.id} | PAGE: ${mainPage.id} (${mainPage.name})`);
      }
    } catch (e) {
      console.error(`  ❌ Erro no cliente ${doc.name}: ${e.message}`);
    }
  }
}

getPageIds();
