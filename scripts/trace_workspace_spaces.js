const { clickupRequest } = require('./lib/clickup-env');

async function run() {
    try {
        const teams = await clickupRequest('GET', `/team`);
        if (teams.teams) {
            for (const t of teams.teams) {
                console.log(`\nWORKSPACE: ${t.name} (${t.id})`);
                const spaces = await clickupRequest('GET', `/team/${t.id}/space`);
                if (spaces.spaces) {
                    for (const s of spaces.spaces) {
                        console.log(`  SPACE: ${s.name} (${s.id})`);
                    }
                }
            }
        }
    } catch (e) {
        console.error(e.message);
    }
}

run();
