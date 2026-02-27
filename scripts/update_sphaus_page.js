const https = require('https');
const fs = require('fs');

const API_KEY = 'pk_111906470_L5VDUBKWMGS3CGWAFMKE6TJ5QL3154JA';
const DOC_ID = '2ky561e2-2453';
const PAGE_ID = '2ky561e2-173';
const MEMO_PATH = 'd:/001Gravity/aios-core/clients/spHaus/memory_strategy.md';

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
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log(`--- TENTANDO ATUALIZAR PÁGINA: ${PAGE_ID} ---`);
  if (!fs.existsSync(MEMO_PATH)) {
    console.error('Arquivo de manual não encontrado.');
    return;
  }
  const content = fs.readFileSync(MEMO_PATH, 'utf8');

  // Tentativa 1: Endpoint oficial de update de página
  console.log('Tentando PUT /doc/{doc_id}/page/{page_id}...');
  const res1 = await clickupRequest('PUT', `/doc/${DOC_ID}/page/${PAGE_ID}`, {
    content: content,
    name: '📘 MANUAL ESTRATÉGICO - sp HAUS',
  });
  console.log('Resultado 1:', JSON.stringify(res1.data).substring(0, 100));

  if (res1.status !== 200) {
    // Tentativa 2: Endpoint alternativo
    console.log('\nTentando PUT /page/{page_id}...');
    const res2 = await clickupRequest('PUT', `/page/${PAGE_ID}`, {
      content: content,
    });
    console.log('Resultado 2:', JSON.stringify(res2.data).substring(0, 100));
  }
}

run();
