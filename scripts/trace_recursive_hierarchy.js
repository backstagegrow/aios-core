const { clickupRequest } = require('./lib/clickup-env');
const SPACE_ID = '901312834269';

async function run() {
    try {
        const spacesRes = await clickupRequest('GET', `/team/90132645314/space`);
        console.log('--- ALL ACCESSIBLE SPACES ---');
        if (spacesRes.spaces) {
            for (const s of spacesRes.spaces) {
                console.log(`SPACE: ${s.name} (${s.id})`);
                const foldersRes = await clickupRequest('GET', `/space/${s.id}/folder`);
                if (foldersRes.folders) {
                    for (const f of foldersRes.folders) {
                        console.log(`  FOLDER: ${f.name} (${f.id})`);
                        const listsRes = await clickupRequest('GET', `/folder/${f.id}/list`);
                        if (listsRes.lists) {
                            listsRes.lists.forEach(l => console.log(`    - LIST: ${l.name} (${l.id})`));
                        }
                    }
                }
            }
        }
    } catch (e) { console.error(e.message); }
}

run();
