const https = require('https');

const { API_KEY, clickupRequest } = require('./lib/clickup-env');
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

const manuals = {
  'GT House': '2ky561e2-3053',
  'sp HAUS': '2ky561e2-2453',
  'Via BR Cenografia': '2ky561e2-3093',
  'Espaço Constru': '2ky561e2-3073',
  'Backstage Grow': '2ky561e2-3033',
};

async function readAllManuals() {
  for (const [name, id] of Object.entries(manuals)) {
    console.log('\n========================================');
    console.log(`📖 CLIENTE: ${name} (ID: ${id})`);
    console.log('========================================');

    try {
      const doc = await clickupRequest(`/doc/${id}`);
      if (doc.pages) {
        for (const page of doc.pages) {
          console.log(`\n--- Página: ${page.name} ---`);
          const pageDetail = await clickupRequest(`/doc/${id}/page/${page.id}`);
          // Check if pageDetail has content or block-style structure
          if (pageDetail.content) {
            console.log(pageDetail.content.substring(0, 500) + '...');
          } else if (pageDetail.blocks) {
            console.log('Conteúdo em blocos detectado.');
            // Simplified extraction
            const text = pageDetail.blocks.map(b => b.text_content || '').join('\n');
            console.log(text.substring(0, 1000) + '...');
          } else {
            console.log(JSON.stringify(pageDetail).substring(0, 500) + '...');
          }
        }
      }
    } catch (e) {
      console.error(`  ❌ Erro: ${e.message}`);
    }
  }
}

readAllManuals();
