const { clickupRequest } = require('./lib/clickup-env');

async function run() {
    try {
        console.log('--- FETCHING TEAMS ---');
        const res = await clickupRequest('GET', `/team`);
        console.log(JSON.stringify(res, null, 2));
    } catch (e) {
        console.error(e.message);
    }
}

run();
