const https = require('https');

const { API_KEY, clickupRequest } = require('../lib/clickup-env');
const TARGET_ID = '901312834269'; // Space ID

function getClickUp(path) {
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
  try {
    console.log(`Buscando Views para o ID: ${TARGET_ID}...`);
    const result = await getClickUp(`/space/${TARGET_ID}/view`);
    console.log('### Views encontradas:');
    for (const view of result.views) {
      console.log(`- View: ${view.name} (Type: ${view.type}, ID: ${view.id})`);
      // If it's a doc view, it might have content or link to a doc
    }
  } catch (err) {
    console.error(`❌ Erro: ${err.message}`);
  }
}

run();
