const { clickupRequest } = require('./lib/clickup-env');
const FOLDER_ID = '901316473884';

async function run() {
    try {
        console.log('--- FETCHING TASKS IN FOLDER ---');
        const res = await clickupRequest('GET', `/folder/${FOLDER_ID}/task?include_closed=false&subtasks=true`);
        if (res.tasks) {
            res.tasks.forEach(t => {
                console.log(`- [${t.status.status}] ${t.name} (${t.id}) [List: ${t.list.name}]`);
            });
        } else {
            console.log('No tasks found in folder. Response:', JSON.stringify(res, null, 2));
        }
    } catch (e) {
        console.error(e.message);
    }
}

run();
