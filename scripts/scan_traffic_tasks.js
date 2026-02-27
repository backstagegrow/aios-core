const https = require('https');

const API_KEY = 'pk_111906470_L5VDUBKWMGS3CGWAFMKE6TJ5QL3154JA';
const FOLDER_ID = '901316473884'; // Gestão de Tráfego Pago

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
    console.log('--- ANALISANDO TAREFAS DE TRÁFEGO PAGO ---');
    const listsRes = await clickupRequest('GET', `/folder/${FOLDER_ID}/list`);

    for (const list of listsRes.lists) {
      console.log(`\nLISTA: ${list.name} (${list.id})`);
      const tasksRes = await clickupRequest('GET', `/list/${list.id}/task?include_closed=false`);

      if (tasksRes.tasks && tasksRes.tasks.length > 0) {
        tasksRes.tasks.forEach(task => {
          console.log(`  - [${task.status.status.toUpperCase()}] ${task.name}`);
          if (task.description) {
            const snippet = task.description.substring(0, 150).replace(/\n/g, ' ');
            console.log(`    Content: ${snippet}...`);
          }
        });
      } else {
        console.log('  (Sem tarefas ativas)');
      }
    }
  } catch (e) {
    console.error(e.message);
  }
}

run();
