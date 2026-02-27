const https = require('https');

const API_KEY = 'pk_111906470_L5VDUBKWMGS3CGWAFMKE6TJ5QL3154JA';
const TEAM_ID = '90132645314';

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
  try {
    const spaces = await clickupRequest('GET', `/team/${TEAM_ID}/space`);
    for (const space of spaces.spaces) {
      const folders = await clickupRequest('GET', `/space/${space.id}/folder`);
      if (folders.folders) {
        for (const folder of folders.folders) {
          if (folder.name.toLowerCase().includes('gestão empresarial')) {
            console.log(`FOUND FOLDER: ${folder.name} | ID: ${folder.id} | SPACE: ${space.name}`);
          }
        }
      }
    }
  } catch (e) {
    console.error(e.message);
  }
}

run();
