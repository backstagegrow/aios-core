const https = require('https');
const fs = require('fs');

const API_KEY = 'pk_111906470_L5VDUBKWMGS3CGWAFMKE6TJ5QL3154JA';
const DOC_ID = '2ky561e2-2453';
const PAGE_ID = '2ky561e2-173';
const CONTENT = '# ESTRATEGIA MASTER sp HAUS\n\nEste é um teste de escrita forçada do manual.';

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
  // 1. PUT with content
  await clickupRequest('PUT', `/doc/${DOC_ID}/page/${PAGE_ID}`, { content: CONTENT });

  // 2. PUT with text_content
  await clickupRequest('PUT', `/doc/${DOC_ID}/page/${PAGE_ID}`, { text_content: CONTENT });

  // 3. PATCH with content
  await clickupRequest('PATCH', `/doc/${DOC_ID}/page/${PAGE_ID}`, { content: CONTENT });

  // 4. POST with content
  await clickupRequest('POST', `/doc/${DOC_ID}/page/${PAGE_ID}`, { content: CONTENT });
}

run();
