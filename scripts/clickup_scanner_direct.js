const https = require('https');

const API_KEY = 'pk_111906470_L5VDUBKWMGS3CGWAFMKE6TJ5QL3154JA';
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

async function scanWorkspace() {
  try {
    console.log('--- SCANNING CLICKUP WORKSPACE ---');
        
    // List Spaces
    console.log('\n1. Listing Spaces...');
    const spacesResponse = await clickupRequest(`/team/${TEAM_ID}/space`);
    const spaces = spacesResponse.spaces || [];
        
    for (const space of spaces) {
      console.log(`\nSPACE: ${space.name} (ID: ${space.id})`);
            
      // Search for Docs in Space
      // Documenting listing can be complex via API v2 for team-level docs
      // Let's try listing Folders first
      const foldersResponse = await clickupRequest(`/space/${space.id}/folder`);
      const folders = foldersResponse.folders || [];
            
      for (const folder of folders) {
        console.log(`  FOLDER: ${folder.name} (ID: ${folder.id})`);
        if (folder.name.toLowerCase().includes('manual') || folder.name.toLowerCase().includes('cliente')) {
          console.log('  [!] Folder matches client manual pattern.');
        }
                
        const listsResponse = await clickupRequest(`/folder/${folder.id}/list`);
        const lists = listsResponse.lists || [];
        for (const list of lists) {
          console.log(`    LIST: ${list.name} (ID: ${list.id})`);
        }
      }
            
      // Also check Lists directly in Space (not in folders)
      const rootListsResponse = await clickupRequest(`/space/${space.id}/list`);
      const rootLists = rootListsResponse.lists || [];
      for (const list of rootLists) {
        console.log(`    LIST (ROOT): ${list.name} (ID: ${list.id})`);
      }
    }

  } catch (err) {
    console.error(`❌ Error scanning: ${err.message}`);
  }
}

scanWorkspace();
