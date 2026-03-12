const { clickupRequest } = require('./lib/clickup-env');

const LISTS = [
    { name: 'Backstage Grow (Shared List)', id: '901324771638' }
];

async function run() {
    try {
        for (const list of LISTS) {
            console.log(`\n--- FETCHING TASKS IN ${list.name} (${list.id}) ---`);
            const res = await clickupRequest('GET', `/list/${list.id}/task?include_closed=false`);
            if (res && res.tasks) {
                res.tasks.forEach(t => console.log(`  - [${t.status.status}] ${t.name} (${t.id})`));
            } else {
                console.log(`  Error:`, JSON.stringify(res));
            }
        }
    } catch (e) {
        console.error(e.message);
    }
}

run();
