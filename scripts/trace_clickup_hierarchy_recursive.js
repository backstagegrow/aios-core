const { clickupRequest } = require('./lib/clickup-env');

async function run() {
    try {
        const spaces = await clickupRequest('GET', `/team/90132645314/space`);
        if (spaces.spaces) {
            for (const s of spaces.spaces) {
                console.log(`\nSPACE: ${s.name} (${s.id})`);
                const folders = await clickupRequest('GET', `/space/${s.id}/folder`);
                if (folders.folders) {
                    for (const f of folders.folders) {
                        console.log(`  FOLDER: ${f.name} (${f.id})`);
                        const lists = await clickupRequest('GET', `/folder/${f.id}/list`);
                        if (lists.lists) {
                            lists.lists.forEach(l => console.log(`    - LIST: ${l.name} (${l.id})`));
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
