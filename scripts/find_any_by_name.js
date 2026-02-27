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
    const search = 'empresarial';
    const spaces = await clickupRequest('GET', `/team/${TEAM_ID}/space`);
    for (const space of spaces.spaces) {
      if (space.name.toLowerCase().includes(search)) console.log(`SPACE: ${space.name} (ID: ${space.id})`);

      const folders = await clickupRequest('GET', `/space/${space.id}/folder`);
      if (folders.folders) {
        for (const folder of folders.folders) {
          if (folder.name.toLowerCase().includes(search)) console.log(`FOLDER: ${folder.name} (ID: ${folder.id}) in ${space.name}`);

          const lists = await clickupRequest('GET', `/folder/${folder.id}/list`);
          if (lists.lists) {
            for (const list of lists.lists) {
              if (list.name.toLowerCase().includes(search)) console.log(`LIST: ${list.name} (ID: ${list.id}) in ${folder.name}`);
            }
          }
        }
      }

      const soloLists = await clickupRequest('GET', `/space/${space.id}/list`);
      if (soloLists.lists) {
        for (const list of soloLists.lists) {
          if (list.name.toLowerCase().includes(search)) console.log(`LIST: ${list.name} (ID: ${list.id}) in ${space.name}`);
        }
      }
    }
  } catch (e) {
    console.error(e.message);
  }
}

run();
