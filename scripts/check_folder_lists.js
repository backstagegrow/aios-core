const { clickupRequest } = require('./lib/clickup-env');

const FOLDER_ID = '901316473884'; // 'Gestão de Tráfego Pago'

async function run() {
    try {
        console.log('--- FETCHING LISTS IN FOLDER ---');
        const res = await clickupRequest('GET', `/folder/${FOLDER_ID}/list`);
        console.log(JSON.stringify(res, null, 2));
    } catch (e) {
        console.error(e.message);
    }
}

run();
