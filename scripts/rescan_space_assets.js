const { clickupRequest } = require('./lib/clickup-env');
const SPACE_ID = '901312834269'; // Gerenciamento Clientes

async function run() {
    try {
        console.log('--- RE-SCANNING SPACE ---');
        const foldersRes = await clickupRequest('GET', `/space/${SPACE_ID}/folder`);
        if (foldersRes.folders) {
            for (const f of foldersRes.folders) {
                console.log(`FOLDER: ${f.name} (${f.id})`);
                const listsRes = await clickupRequest('GET', `/folder/${f.id}/list`);
                if (listsRes.lists) {
                    listsRes.lists.forEach(l => console.log(`   - LIST: ${l.name} (${l.id})`));
                }
            }
        }

        const listsRes = await clickupRequest('GET', `/space/${SPACE_ID}/list`);
        if (listsRes.lists) {
            console.log('\n--- FOLDERLESS LISTS ---');
            listsRes.lists.forEach(l => console.log(`LIST: ${l.name} (${l.id})`));
        }
    } catch (e) {
        console.error(e.message);
    }
}

run();
