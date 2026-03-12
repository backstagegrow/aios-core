const { clickupRequest } = require('./lib/clickup-env');

const LISTS = {
    'GT House': '901324128564',
    'Via BR': '901324771638',
    'BCK Grow': '901324771662'
};

async function run() {
    try {
        for (const [name, id] of Object.entries(LISTS)) {
            console.log(`\n--- TASKS FOR ${name} (${id}) ---`);
            const res = await clickupRequest('GET', `/list/${id}/task?include_closed=false`);
            if (res.tasks) {
                res.tasks.forEach(t => console.log(`  - [${t.status.status}] ${t.name} (${t.id})`));
            }
        }
    } catch (e) {
        console.error(e.message);
    }
}

run();
