const https = require('https');

const API_KEY = 'pk_111906470_L5VDUBKWMGS3CGWAFMKE6TJ5QL3154JA';

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
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); } catch (e) { resolve(data); }
        } else {
          reject(new Error(`Status ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function debugDoc(docId) {
  try {
    console.log(`\n--- DEBUGGING DOC: ${docId} ---`);
    const doc = await clickupRequest('GET', `/doc/${docId}`);
    console.log(`Doc Name: ${doc.name}`);
    if (doc.pages) {
      doc.pages.forEach(p => {
        console.log(`  Page: ${p.name} | ID: ${p.id}`);
      });
    }
  } catch (e) {
    console.error(`  Error: ${e.message}`);
  }
}

// Check the main client docs found previously
const docIds = ['2ky561e2-3053', '2ky561e2-2453', '2ky561e2-3093'];
docIds.forEach(id => debugDoc(id));
