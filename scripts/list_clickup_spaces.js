const { clickupRequest } = require('./lib/clickup-env');

async function run() {
    try {
        console.log('--- FETCHING SPACES ---');
        const res = await clickupRequest('GET', `/team/90132645314/space`);
        if (res.spaces) {
            res.spaces.forEach(s => console.log(`Space: ${s.name} (${s.id})`));
        } else {
            console.log('No spaces found. Response:', JSON.stringify(res, null, 2));
        }
    } catch (e) {
        console.error(e.message);
    }
}

run();
