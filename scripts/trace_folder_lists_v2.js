const { clickupRequest } = require('./lib/clickup-env');
const SPACE_ID = '901312834269';

async function run() {
    try {
        const foldersRes = await clickupRequest('GET', `/space/${SPACE_ID}/folder`);
        if (foldersRes.folders) {
            for (const f of foldersRes.folders) {
                console.log(`\nFOLDER: ${f.name} (${f.id})`);
                const listsRes = await clickupRequest('GET', `/folder/${f.id}/list`);
                if (listsRes.lists) {
                    listsRes.lists.forEach(l => {
                        console.log(`  - LIST: ${l.name} (${l.id})`);
                    });
                }
            }
        }
    } catch (e) { console.error(e.message); }
}

run();
