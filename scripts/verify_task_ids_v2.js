const { clickupRequest } = require('./lib/clickup-env');

const LISTS = [
    { name: 'BCK Grow', id: '901324771662' },
    { name: 'Via BR', id: '901324771638' },
    { name: 'GT House', id: '901324128564' }
];

async function run() {
    try {
        for (const list of LISTS) {
            console.log(`\n--- TASKS IN ${list.name} ---`);
            const res = await clickupRequest('GET', `/list/${list.id}/task?include_closed=false`);
            if (res && res.tasks) {
                res.tasks.forEach(t => console.log(`  - ${t.name} (${t.id})`));
            } else {
                console.log(`  Error for ${list.name}:`, JSON.stringify(res));
            }
        }
    } catch (e) {
        console.error(e.message);
    }
}

run();
