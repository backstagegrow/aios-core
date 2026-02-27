const https = require('https');
const fs = require('fs');

const API_KEY = 'pk_111906470_L5VDUBKWMGS3CGWAFMKE6TJ5QL3154JA';
const PAGE_ID = '2ky561e2-173';
const CONTENT = '# CLIENT STRATEGY MEMORY – sp HAUS 🚀\n\nEste é o manual estratégico atualizado conforme o framework BKS.';

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
        console.log(`[DEBUG] ${method} ${path} -> Status ${res.statusCode}`);
        resolve({ status: res.statusCode, data: data });
      });
    });

    req.on('error', (e) => reject(e));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log('Tentativa de escrita direta em Página de Documento...');

  // Tentativa com campo 'content'
  await clickupRequest('PUT', `/page/${PAGE_ID}`, { content: CONTENT });

  // Tentativa com campo 'description' (algumas views usam isso)
  await clickupRequest('PUT', `/page/${PAGE_ID}`, { description: CONTENT });

  // Tentativa com endpoint de View (docs às vezes são views)
  await clickupRequest('PUT', `/view/${PAGE_ID}`, { content: CONTENT });
}

run();
