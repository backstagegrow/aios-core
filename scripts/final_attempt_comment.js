const https = require('https');
const fs = require('fs');

const { API_KEY, clickupRequest } = require('./lib/clickup-env');
const DOC_ID = '2ky561e2-2453';
const CONTENT = '# MANUAL ESTRATÉGICO sp HAUS (FW BKS) 🚀\n\nEste é o manual completo. Copie este texto para o corpo da página se desejar.\n\n### 🎯 Posicionamento\nA sp HAUS é a autoridade em inovação cenográfica...';

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
  // In ClickUp, Docs are treated as special tasks for comments sometimes.
  // Let's try to add a comment to the DOC ID directly.
  console.log(`Tentando comentar no DOC_ID: ${DOC_ID}`);
  await clickupRequest('POST', `/view/${DOC_ID}/comment`, {
    comment_text: CONTENT,
    notify_all: true,
  });
}

run();
