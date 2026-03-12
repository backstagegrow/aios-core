const { clickupRequest } = require('./lib/clickup-env');
const SPACE_ID = '901312834269';

async function run() {
    try {
        const res = await clickupRequest('GET', `/space/${SPACE_ID}/folder`);
        if (res.folders) {
            res.folders.forEach(f => {
                console.log(`\nFOLDER: ${f.name} (${f.id})`);
                if (f.lists) {
                    f.lists.forEach(l => console.log(`  - LIST: ${l.name} (${l.id})`));
                }
            });
        }
    } catch (e) { console.error(e.message); }
}

run();
