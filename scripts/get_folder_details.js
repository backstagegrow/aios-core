const { clickupRequest } = require('./lib/clickup-env');
const FOLDER_ID = '901316473884';

async function run() {
    try {
        const res = await clickupRequest('GET', `/folder/${FOLDER_ID}`);
        console.log(JSON.stringify(res, null, 2));
    } catch (e) {
        console.error(e.message);
    }
}

run();
