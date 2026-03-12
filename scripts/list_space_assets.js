const { clickupRequest } = require('./lib/clickup-env');
const SPACE_ID = '901312834269'; // Gerenciamento Clientes

async function run() {
    try {
        console.log('--- SCANNING SPACE ---');
        const res = await clickupRequest('GET', `/space/${SPACE_ID}/folder`);
        if (res.folders) {
            res.folders.forEach(f => {
                console.log(`Folder: ${f.name} (${f.id})`);
                if (f.lists) {
                    f.lists.forEach(l => console.log(`  List: ${l.name} (${l.id})`));
                }
            });
        }

        const listsRes = await clickupRequest('GET', `/space/${SPACE_ID}/list`);
        if (listsRes.lists) {
            console.log('\n--- FOLDERLESS LISTS ---');
            listsRes.lists.forEach(l => console.log(`List: ${l.name} (${l.id})`));
        }
    } catch (e) {
        console.error(e.message);
    }
}

run();
