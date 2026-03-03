const https = require('https');
const fs = require('fs');

const { API_KEY, clickupRequest } = require('./lib/clickup-env');
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
    const auditLog = [];
    const listsRes = await clickupRequest('GET', `/folder/${FOLDER_ID}/list`);

    for (const list of listsRes.lists) {
      const tasksRes = await clickupRequest('GET', `/list/${list.id}/task?include_closed=false&subtasks=true`);

      if (tasksRes.tasks) {
        for (const task of tasksRes.tasks) {
          // Only audit tasks that have content and are not just headlines
          if (task.description && task.description.length > 50) {
            auditLog.push({
              client: list.name,
              taskName: task.name,
              status: task.status.status,
              copy: task.description,
              url: task.url,
            });
          }
        }
      }
    }

    fs.writeFileSync('d:/001Gravity/aios-core/scripts/copies_to_audit.json', JSON.stringify(auditLog, null, 2));
    console.log(`Sucesso: ${auditLog.length} copies extraídas para auditoria.`);
  } catch (e) {
    console.error(e.message);
  }
}

run();
