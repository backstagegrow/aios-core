const { clickupRequest } = require('./lib/clickup-env');

const LISTS = [
    { name: 'BCK Grow', id: '901324771662' },
    { name: 'Via BR', id: '901324771638' }
];

async function run() {
    try {
        for (const list of LISTS) {
            console.log(`\n--- FETCHING TASKS IN ${list.name} (${list.id}) ---`);
            const res = await clickupRequest('GET', `/list/${list.id}/task?include_closed=false&subtasks=true`);
            if (res && res.tasks) {
                if (res.tasks.length === 0) console.log('  Empty');
                res.tasks.forEach(t => console.log(`- [${t.status.status}] ${t.name} (${t.id})`));
            } else {
                console.log(`  Error for ${list.name}:`, JSON.stringify(res));
            }
        }
    } catch (e) { console.error(e.message); }
}

run();
