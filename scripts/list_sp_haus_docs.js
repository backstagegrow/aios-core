const https = require('https');

const { API_KEY, clickupRequest } = require('./lib/clickup-env');
const LIST_ID = '901324514510'; // sp HAUS

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
  const res = await clickupRequest('GET', `/list/${LIST_ID}/view`);
  if (res.views) {
    const docs = res.views.filter(v => v.type === 'doc');
    console.log('DOC VIEWS FOUND:');
    docs.forEach(d => {
      console.log(`- NAME: ${d.name} | ID: ${d.id}`);
    });
  } else {
    console.log('No views found or error:', res);
  }
}

run();
