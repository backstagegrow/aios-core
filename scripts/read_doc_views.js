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

const docViews = [
  '2ky561e2-2453', // sp HAUS
  '2ky561e2-3093', // Via BR
  '2ky561e2-3053', // GT House
  '2ky561e2-3073', // Espaço Constru
  '2ky561e2-3033',  // Backstage Grow
];

async function readDocViews() {
  for (const viewId of docViews) {
    console.log(`\n--- LENDO VIEW: ${viewId} ---`);
    try {
      const view = await clickupRequest(`/view/${viewId}`);
      console.log(`Nome: ${view.view.name}`);
      // If it's a doc view, it might have pages or content
      console.log(JSON.stringify(view.view, null, 2).substring(0, 1000));
    } catch (e) {
      console.error(`  ❌ Erro: ${e.message}`);
    }
  }
}

readDocViews();
