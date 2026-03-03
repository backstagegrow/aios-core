const https = require('https');

const { API_KEY, clickupRequest } = require('./lib/clickup-env');
const TEAM_ID = '90132645314';

function clickupRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.clickup.com',
      port: 443,
      path: `/api/v2${path}`,
      method: 'GET',
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
    // List Spaces to find the right one
    const spacesResponse = await clickupRequest(`/team/${TEAM_ID}/space`);
    const spaces = spacesResponse.spaces || [];

    console.log('--- SCANNING FOR CLIENT MANUALS (DOCS) ---');

    for (const space of spaces) {
      console.log(`\nVerificando Espaço: ${space.name}`);

      // Try to find Docs in this space
      // Docs are often in "Resources" or as views
      // We can also check if there are tasks named "Manual"
      const tasksResponse = await clickupRequest(`/team/${TEAM_ID}/task?subtasks=true&include_closed=true&search=Manual`);
      const tasks = tasksResponse.tasks || [];

      for (const task of tasks) {
        console.log(`  [TASK] Encontrada: ${task.name} (ID: ${task.id}) - Lista: ${task.list.name}`);
        if (task.description) {
          // Check if description has content
          console.log(`    Descrição (primeiros 100 caracteres): ${task.description.substring(0, 100)}...`);
        }
      }

      // Break after one space check if searching globally for manuals anyway
      break;
    }

  } catch (e) {
    console.error(e);
  }
}

run();
