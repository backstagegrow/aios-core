const { clickupRequest } = require('./lib/clickup-env');

const TEAM_ID = '90132645314';

async function run() {
    try {
        console.log('--- SCANNING ALL TASKS FOR TEAM ---');
        const res = await clickupRequest('GET', `/team/${TEAM_ID}/task?include_closed=false&subtasks=true`);
        if (res.tasks) {
            const matches = res.tasks.filter(t =>
                /relatório|performance|meta ads|auditoria/i.test(t.name)
            );
            matches.forEach(t => {
                console.log(`- MATCH: ${t.name} (ID: ${t.id}) [List: ${t.list.name}]`);
            });
        }
    } catch (e) { console.error(e.message); }
}

run();
