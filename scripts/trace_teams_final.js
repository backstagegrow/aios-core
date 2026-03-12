const { clickupRequest } = require('./lib/clickup-env');

async function run() {
    try {
        const res = await clickupRequest('GET', `/team`);
        if (res.teams) {
            res.teams.forEach(t => {
                console.log(`TEAM: ${t.name} (${t.id})`);
            });
        }
    } catch (e) { console.error(e.message); }
}

run();
