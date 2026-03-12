const https = require('https');
const { API_KEY, clickupRequest } = require('./lib/clickup-env');

const FOLDER_ID = '901316473884'; // Gestão de Tráfego Pago

async function run() {
  try {
    const listsRes = await clickupRequest('GET', `/folder/${FOLDER_ID}/list`);

    if (!listsRes || !listsRes.lists) {
      console.log('No lists found');
      return;
    }

    for (const list of listsRes.lists) {
      console.log(`\nLIST: ${list.name} (${list.id})`);
      const tasksRes = await clickupRequest('GET', `/list/${list.id}/task?include_closed=false`);

      if (tasksRes && tasksRes.tasks) {
        tasksRes.tasks.forEach(task => {
          console.log(`  - [${task.status.status}] ${task.name} (${task.id})`);
        });
      }
    }
  } catch (e) {
    console.error(e.message);
  }
}

run();
