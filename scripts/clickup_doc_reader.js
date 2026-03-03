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

async function getDocContent(docId) {
  try {
    const doc = await clickupRequest(`/doc/${docId}`);
    console.log(`\n📄 LENDO DOCUMENTO: ${doc.name} (ID: ${docId})`);
    if (doc.pages) {
      for (const page of doc.pages) {
        console.log(`\n  --- Página: ${page.name} ---`);
        // Note: Page content might need another call but often returns in blocks
        const pageDetail = await clickupRequest(`/doc/${docId}/page/${page.id}`);
        // Extracting text from content if visible
        console.log(JSON.stringify(pageDetail, null, 2).substring(0, 500) + '...');
      }
    }
  } catch (e) {
    console.error(`  ❌ Erro ao ler doc ${docId}: ${e.message}`);
  }
}

async function listDocs() {
  try {
    console.log('--- BUSCANDO DOCUMENTOS NO CLICKUP ---');

    // Workspace Documents
    const docsResponse = await clickupRequest(`/team/${TEAM_ID}/view`);
    // Note: Docs are often associated with workspace views or specific list/folders
    console.log('Views/Docs Workspace:', JSON.stringify(docsResponse, null, 2));

    // Let's try to search specifically for the Manuals
    // Since the user gave a specific ID 2ky561e2-3053, let's look for similar IDs
    const specificDocs = ['2ky561e2-3053']; // Add more if known or found

    for (const id of specificDocs) {
      await getDocContent(id);
    }

  } catch (err) {
    console.error(`❌ Erro: ${err.message}`);
  }
}

listDocs();
