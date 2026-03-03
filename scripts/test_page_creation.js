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
        console.log(`  [DEBUG] ${method} ${path} -> Status ${res.statusCode}`);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); } catch (e) { resolve(data); }
        } else {
          resolve({ error: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  // Testando com GT House (View ID: 2ky561e2-3593)
  const viewId = '2ky561e2-3593';
  const content = 'ESTRATEGIA GT HOUSE - TESTE DE INJEÇÃO';

  console.log(`--- TENTANDO CRIAR PÁGINA PARA VIEW ${viewId} ---`);

  // Tentativa 1: endpoint /view/{id}/page
  await clickupRequest('POST', `/view/${viewId}/page`, { name: 'Manual Estratégico', content: content });

  // Tentativa 2: endpoint /view/{id}/description
  await clickupRequest('PUT', `/view/${viewId}`, { description: content });

  // Tentativa 3: endpoint /doc/{viewId}/page (tentando tratar view como doc)
  await clickupRequest('POST', `/doc/${viewId}/page`, { name: 'Manual', content: content });
}

run();
