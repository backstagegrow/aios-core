const https = require('https');

const API_KEY = 'pk_111906470_L5VDUBKWMGS3CGWAFMKE6TJ5QL3154JA';
const FOLDER_ID = '901316465410'; // Gestão de Social Media

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
    console.log('--- ANALISANDO TAREFAS DE SOCIAL MEDIA ---');

    // 1. Get lists in the Social Media folder
    const listsRes = await clickupRequest('GET', `/folder/${FOLDER_ID}/list`);

    for (const list of listsRes.lists) {
      console.log(`\nLISTA: ${list.name} (${list.id})`);

      // 2. Get tasks for each list (limit to 5 most recent to get a sample)
      const tasksRes = await clickupRequest('GET', `/list/${list.id}/task?include_closed=false&subtasks=true`);

      if (tasksRes.tasks && tasksRes.tasks.length > 0) {
        tasksRes.tasks.slice(0, 10).forEach(task => {
          console.log(`  - [${task.status.status.toUpperCase()}] ${task.name}`);
          if (task.description) {
            const snippet = task.description.substring(0, 100).replace(/\n/g, ' ');
            console.log(`    Snippet: ${snippet}...`);
          }
        });
      } else {
        console.log('  (Sem tarefas abertas)');
      }
    }
  } catch (e) {
    console.error(e.message);
  }
}

run();
