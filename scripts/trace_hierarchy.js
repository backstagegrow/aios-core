const { clickupRequest } = require('./lib/clickup-env');

async function run() {
    try {
        const res = await clickupRequest('GET', `/team/90132645314/space`);
        if (res.spaces) {
            for (const s of res.spaces) {
                console.log(`\nSPACE: ${s.name} (${s.id})`);
                const folders = await clickupRequest('GET', `/space/${s.id}/folder`);
                if (folders.folders) {
                    folders.folders.forEach(f => console.log(`  FOLDER: ${f.name} (${f.id})`));
                }
                const lists = await clickupRequest('GET', `/space/${s.id}/list`);
                if (lists.lists) {
                    lists.lists.forEach(l => console.log(`  LIST: ${l.name} (${l.id})`));
                }
            }
        }
    } catch (e) { console.error(e.message); }
}

run();
