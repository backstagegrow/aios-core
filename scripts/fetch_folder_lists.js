const { clickupRequest } = require('./lib/clickup-env');
const FOLDER_ID = '901316473884';

async function run() {
    try {
        console.log('--- FETCHING FOLDER DIRECTLY ---');
        const res = await clickupRequest('GET', `/folder/${FOLDER_ID}/list`);
        if (res.lists) {
            res.lists.forEach(l => {
                console.log(`List: ${l.name} (${l.id})`);
            });
        } else {
            console.log('No lists found in folder. Response:', JSON.stringify(res, null, 2));
        }
    } catch (e) {
        console.error(e.message);
    }
}

run();
