const https = require('https');

const API_KEY = 'pk_111906470_L5VDUBKWMGS3CGWAFMKE6TJ5QL3154JA';

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
    // ID de uma das views criadas que está em branco
    const viewId = '2ky561e2-3593';
    console.log(`Buscando detalhes da View: ${viewId}`);
    const view = await clickupRequest('GET', `/view/${viewId}`);

    console.log('DADOS COMPLETOS DA VIEW:');
    console.log(JSON.stringify(view, null, 2));

  } catch (e) {
    console.error('Erro:', e.message);
  }
}

run();
