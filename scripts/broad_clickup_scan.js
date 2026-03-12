const { clickupRequest } = require('./lib/clickup-env');

async function run() {
    try {
        const spaces = await clickupRequest('GET', `/team/90132645314/space`);
        if (spaces.spaces) {
            for (const s of spaces.spaces) {
                console.log(`\nSPACE: ${s.name} (${s.id})`);
                const lists = await clickupRequest('GET', `/space/${s.id}/list`);
                if (lists.lists) {
                    lists.lists.forEach(l => console.log(`  List: ${l.name} (${l.id})`));
                }
                const folders = await clickupRequest('GET', `/space/${s.id}/folder`);
                if (folders.folders) {
                    for (const f of folders.folders) {
                        console.log(`  Folder: ${f.name} (${f.id})`);
                        const fLists = await clickupRequest('GET', `/folder/${f.id}/list`);
                        if (fLists.lists) {
                            fLists.lists.forEach(l => console.log(`    List: ${l.name} (${l.id})`));
                        }
                    }
                }
            }
        }
    } catch (e) { console.error(e.message); }
}

run();
