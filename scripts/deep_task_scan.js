const { clickupRequest } = require('./lib/clickup-env');

async function run() {
    try {
        console.log('--- SCANNING ALL ACCESSIBLE LISTS ---');
        const res = await clickupRequest('GET', `/team/90132645314/space`);
        if (res.spaces) {
            for (const space of res.spaces) {
                console.log(`\nSPACE: ${space.name} (${space.id})`);
                const folders = await clickupRequest('GET', `/space/${space.id}/folder`);
                if (folders.folders) {
                    folders.folders.forEach(f => {
                        console.log(`  FOLDER: ${f.name} (${f.id})`);
                        if (f.lists) {
                            f.lists.forEach(l => console.log(`    - LIST: ${l.name} (${l.id})`));
                        }
                    });
                }
                const folderless = await clickupRequest('GET', `/space/${space.id}/list`);
                if (folderless.lists) {
                    folderless.lists.forEach(l => console.log(`  - SPACE LIST: ${l.name} (${l.id})`));
                }
            }
        }
    } catch (e) {
        console.error(e.message);
    }
}

run();
