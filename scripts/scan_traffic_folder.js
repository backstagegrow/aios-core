const { clickupRequest } = require('./lib/clickup-env');

const FOLDER_ID = '901316473884'; // Gestão de Tráfego Pago

async function run() {
    try {
        console.log(`--- SCANNING FOLDER ${FOLDER_ID} FOR LISTS AND TASKS ---`);
        const listsRes = await clickupRequest('GET', `/folder/${FOLDER_ID}/list`);

        if (listsRes.lists) {
            for (const list of listsRes.lists) {
                console.log(`\nLIST: ${list.name} (${list.id})`);
                try {
                    const tasksRes = await clickupRequest('GET', `/list/${list.id}/task?include_closed=false`);
                    if (tasksRes.tasks) {
                        if (tasksRes.tasks.length === 0) console.log('  (Empty)');
                        tasksRes.tasks.forEach(t => {
                            console.log(`  - [${t.status.status}] ${t.name} (ID: ${t.id})`);
                        });
                    }
                } catch (e) {
                    console.log(`  ❌ Failed to fetch tasks: ${e.status} ${JSON.stringify(e.data)}`);
                }
            }
        }
    } catch (e) {
        console.error('CRITICAL ERROR:', e.status, e.message, JSON.stringify(e.data));
    }
}

run();
