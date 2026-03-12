const { clickupRequest } = require('./lib/clickup-env');
const TEAM_ID = '90100788331';
const SPACE_ID = '90100788335';

async function run() {
    try {
        console.log(`--- SCANNING TEAM ${TEAM_ID} SPACE ${SPACE_ID} ---`);
        const foldersRes = await clickupRequest('GET', `/space/${SPACE_ID}/folder`);
        if (foldersRes.folders) {
            foldersRes.folders.forEach(f => {
                console.log(`FOLDER: ${f.name} (${f.id})`);
                if (f.lists) f.lists.forEach(l => console.log(`   - LIST: ${l.name} (${l.id})`));
            });
        }
    } catch (e) { console.error(e.message); }
}

run();
