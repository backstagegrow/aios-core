const https = require('https');

const { API_KEY, clickupRequest } = require('./lib/clickup-env');
const DOC_ID = '2ky561e2-2453';
const PAGE_ID = '2ky561e2-173';

function clickupRequest(method, path) {
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
        try { resolve(JSON.parse(data)); } catch (e) { resolve(data); }
      });
    });

    req.on('error', (e) => reject(e));
    req.end();
  });
}

async function run() {
  const res = await clickupRequest('GET', `/doc/${DOC_ID}/page/${PAGE_ID}`);
  // Print everything to a file so it doesn't get truncated in the logs
  const fs = require('fs');
  fs.writeFileSync('d:/001Gravity/aios-core/scripts/page_full_details.json', JSON.stringify(res, null, 2));
  console.log('Full details saved to scripts/page_full_details.json');
}

run();
