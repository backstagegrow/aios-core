const { clickupRequest } = require('./lib/clickup-env');
const SPACE_ID = '901312834269';

async function run() {
    try {
        console.log('--- FETCHING ALL FOLDERS ---');
        const res = await clickupRequest('GET', `/space/${SPACE_ID}/folder`);
        if (res.folders) {
            res.folders.forEach(f => {
                console.log(`Folder: ${f.name} (${f.id})`);
            });
        } else {
            console.log('No folders found. Response:', JSON.stringify(res, null, 2));
        }
    } catch (e) { console.error(e.message); }
}

run();
