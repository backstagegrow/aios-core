const https = require('https');

const API_KEY = 'pk_111906470_L5VDUBKWMGS3CGWAFMKE6TJ5QL3154JA';
const TEAM_ID = '90132645314';

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

async function run() {
  try {
    console.log('--- BUSCANDO TODOS OS DOCUMENTOS DO WORKSPACE ---');

    // This is the correct endpoint for finding documents in a workspace
    const res = await clickupRequest(`/team/${TEAM_ID}/view`);
    if (res.views) {
      const docs = res.views.filter(v => v.type === 'doc');
      for (const doc of docs) {
        console.log(`DOC: ${doc.name} | ID: ${doc.id}`);
      }
    }

  } catch (e) {
    console.error(e.message);
  }
}

run();
