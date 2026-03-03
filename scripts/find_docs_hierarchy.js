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
    console.log('--- BUSCANDO DOCUMENTOS DO WORKSPACE ---');

    // Docs are strictly tied to a list, folder or space in many cases or can be workspace level
    // Let's try to list folders and spaces and check for views of type 'doc'
    const spacesResponse = await clickupRequest(`/team/${TEAM_ID}/space`);
    const spaces = spacesResponse.spaces || [];

    for (const space of spaces) {
      console.log(`\nVerificando Espaço: ${space.name}`);

      // Check Space views
      const spaceViews = await clickupRequest(`/space/${space.id}/view`);
      if (spaceViews.views) {
        for (const view of spaceViews.views) {
          if (view.type === 'doc') {
            console.log(`  [DOC] ${view.name} - ID: ${view.id}`);
          }
        }
      }

      const foldersResponse = await clickupRequest(`/space/${space.id}/folder`);
      const folders = foldersResponse.folders || [];
      for (const folder of folders) {
        // Check Folder views
        const folderViews = await clickupRequest(`/folder/${folder.id}/view`);
        if (folderViews.views) {
          for (const view of folderViews.views) {
            if (view.type === 'doc') {
              console.log(`  [DOC FOLDER: ${folder.name}] ${view.name} - ID: ${view.id}`);
            }
          }
        }

        const listsResponse = await clickupRequest(`/folder/${folder.id}/list`);
        const lists = listsResponse.lists || [];
        for (const list of lists) {
          // Check List views
          const listViews = await clickupRequest(`/list/${list.id}/view`);
          if (listViews.views) {
            for (const view of listViews.views) {
              if (view.type === 'doc') {
                console.log(`  [DOC LIST: ${list.name}] ${view.name} - ID: ${view.id}`);
              }
            }
          }
        }
      }
    }

  } catch (e) {
    console.error(e.message);
  }
}

run();
