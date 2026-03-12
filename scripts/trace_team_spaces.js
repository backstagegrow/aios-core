const { clickupRequest } = require('./lib/clickup-env');

async function run() {
    try {
        const res = await clickupRequest('GET', `/team/90132645314/space`);
        if (res.spaces) {
            res.spaces.forEach(s => {
                console.log(`SPACE: ${s.name} (${s.id})`);
            });
        }
    } catch (e) { console.error(e.message); }
}

run();
