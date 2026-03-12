const { clickupRequest } = require('./lib/clickup-env');

const FOLDER_ID = '901316473884';

async function run() {
    try {
        const listsRes = await clickupRequest('GET', `/folder/${FOLDER_ID}/list`);
        if (listsRes.lists) {
            for (const list of listsRes.lists) {
                console.log(`\nSEARCHING IN LIST: ${list.name} (${list.id})`);
                try {
                    const tasksRes = await clickupRequest('GET', `/list/${list.id}/task?include_closed=false`);
                    if (tasksRes.tasks) {
                        const found = tasksRes.tasks.filter(t =>
                            /meta|traffic|tráfego|performance|anúncio|ads/i.test(t.name)
                        );
                        if (found.length > 0) {
                            found.forEach(t => console.log(`  - MATCH: ${t.name} (ID: ${t.id})`));
                        } else {
                            console.log('  No direct matches found.');
                        }
                    }
                } catch (e) {
                    console.log(`  ❌ Access Denied: ${list.name}`);
                }
            }
        }
    } catch (e) { console.error(e.message); }
}

run();
