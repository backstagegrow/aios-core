const { clickupRequest } = require('./lib/clickup-env');
const SPACE_ID = '901312834269'; // Gerenciamento Clientes

async function run() {
  try {
    const res = await clickupRequest('GET', `/space/${SPACE_ID}/folder`);
    if (res.folders) {
      res.folders.forEach(f => console.log(`Folder: ${f.name} (${f.id})`));
    }
  } catch (e) { console.error(e.message); }
}

run();
