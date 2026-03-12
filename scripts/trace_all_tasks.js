const { clickupRequest } = require('./lib/clickup-env');

async function run() {
    try {
        console.log('--- SCANNING ALL TASKS FOR TEAM 90132645314 ---');
        const res = await clickupRequest('GET', `/team/90132645314/task?include_closed=false&subtasks=true`);
        if (res && res.tasks) {
            res.tasks.forEach(t => {
                console.log(`- [${t.status.status}] ${t.name} (ID: ${t.id}) [List: ${t.list.name}]`);
            });
        } else {
            console.log('No tasks found or error:', JSON.stringify(res));
        }
    } catch (e) { console.error(e.message); }
}

run();
