const { clickupRequest } = require('./lib/clickup-env');

const LISTS = [
    { name: 'BCK Grow', id: '901324771662' },
    { name: 'Via BR', id: '901324771638' },
    { name: 'GT House', id: '901324128564' }
];

async function run() {
    try {
        for (const list of LISTS) {
            console.log(`\n--- FETCHING TASKS IN ${list.name} (${list.id}) ---`);
            const res = await clickupRequest('GET', `/list/${list.id}/task?include_closed=false&subtasks=true`);
            if (res.tasks && res.tasks.length > 0) {
                res.tasks.forEach(t => {
                    console.log(`- [${t.status.status}] ${t.name} (${t.id})`);
                });
            } else {
                console.log(`  No tasks found in list. Response struct:`, Object.keys(res));
            }
        }
    } catch (e) {
        console.error(e.message);
    }
}

run();
