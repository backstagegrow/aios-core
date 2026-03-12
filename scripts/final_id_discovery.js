const { clickupRequest } = require('./lib/clickup-env');
const SPACE_ID = '901312834269'; // Gerenciamento Clientes

async function run() {
    try {
        console.log('--- SCANNING EVERYTHING IN SPACE ---');

        // Get Folders
        const foldersRes = await clickupRequest('GET', `/space/${SPACE_ID}/folder`);
        if (foldersRes.folders) {
            foldersRes.folders.forEach(f => {
                console.log(`FOLDER: ${f.name} (${f.id})`);
                if (f.lists) {
                    f.lists.forEach(l => console.log(`   - LIST: ${l.name} (${l.id})`));
                }
            });
        }

        // fallback check lists directly in space
        const listsRes = await clickupRequest('GET', `/space/${SPACE_ID}/list`);
        if (listsRes.lists) {
            listsRes.lists.forEach(l => console.log(`SPACE LIST: ${l.name} (${l.id})`));
        }

    } catch (e) {
        console.error(e.message);
    }
}

run();
