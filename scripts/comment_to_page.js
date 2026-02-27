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
        resolve({ status: res.statusCode, data: data });
      });
    });

    req.on('error', (e) => reject(e));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log('Tentando adicionar comentário à página...');
  const content = fs.readFileSync(MEMO_PATH, 'utf8');
  const res = await clickupRequest('POST', `/doc/${DOC_ID}/page/${PAGE_ID}/comment`, {
    comment_text: content,
    notify_all: true,
  });
  console.log('Resultado Comentário:', res.status);
}

run();
