const https = require('https');
const fs = require('fs');
const path = require('path');

function getApiKey() {
    const envPath = path.resolve(__dirname, '..', '.env');
    let apiKey = null;
    try {
        const content = fs.readFileSync(envPath, 'utf-8');
        for (const line of content.split('\n')) {
            if (line.trim().startsWith('CLICKUP_API_KEY=')) {
                apiKey = line.split('=')[1].trim().replace(/^['"]|['"]$/g, '');
                break;
            }
        }
    } catch (e) {
        console.error("No .env found", e);
    }
    return apiKey || process.env.CLICKUP_API_KEY;
}

const CLICKUP_API_KEY = getApiKey();

function request(method, endpoint) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.clickup.com',
            path: `/api/v2${endpoint}`,
            method: method,
            headers: {
                'Authorization': CLICKUP_API_KEY,
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(options, res => {
            let body = '';
            res.on('data', d => body += d);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve(parsed);
                } catch (e) {
                    resolve(body);
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

async function scanWorkspace() {
    console.log("Iniciando varredura global do ClickUp...");

    // 1. Get Teams (Workspaces)
    const teamsData = await request('GET', '/team');
    if (!teamsData.teams) {
        console.log("Erro ao buscar Teams:", teamsData);
        return;
    }

    for (const team of teamsData.teams) {
        console.log(`\n🏢 WORKSPACE: ${team.name} (ID: ${team.id})`);

        // 2. Get Spaces
        const spacesData = await request('GET', `/team/${team.id}/space`);
        if (!spacesData.spaces) continue;

        for (const space of spacesData.spaces) {
            console.log(`  🌌 ESPAÇO: ${space.name} (Privado: ${space.private})`);

            // 3. Get Folders
            const foldersData = await request('GET', `/space/${space.id}/folder`);
            const folders = foldersData.folders || [];

            for (const folder of folders) {
                console.log(`    📁 FOLDER: ${folder.name}`);

                // Get Lists inside folder
                for (const list of (folder.lists || [])) {
                    console.log(`      📋 LISTA: ${list.name}`);
                    // Fetch generic tasks stats
                    const tasksData = await request('GET', `/list/${list.id}/task?include_closed=true`);
                    const tasks = tasksData.tasks || [];
                    const open = tasks.filter(t => t.status && t.status.type !== 'closed' && t.status.type !== 'done').length;
                    const closed = tasks.length - open;
                    console.log(`         -> ${tasks.length} Tarefas Totais (${open} abertas, ${closed} concluídas)`);

                    // Show 3 recent tasks for context
                    tasks.slice(0, 3).forEach(t => console.log(`           - [${t.status?.status}] ${t.name}`));
                    if (tasks.length > 3) console.log(`           ... mais ${tasks.length - 3} tarefas`);
                }
            }

            // 4. Get Folderless Lists
            const folderlessListsData = await request('GET', `/space/${space.id}/list`);
            const folderlessLists = folderlessListsData.lists || [];
            for (const list of folderlessLists) {
                console.log(`    📋 LISTA (Sem Pasta): ${list.name}`);
                const tasksData = await request('GET', `/list/${list.id}/task?include_closed=true`);
                const tasks = tasksData.tasks || [];
                const open = tasks.filter(t => t.status && t.status.type !== 'closed' && t.status.type !== 'done').length;
                const closed = tasks.length - open;
                console.log(`       -> ${tasks.length} Tarefas Totais (${open} abertas, ${closed} concluídas)`);

                tasks.slice(0, 3).forEach(t => console.log(`         - [${t.status?.status}] ${t.name}`));
                if (tasks.length > 3) console.log(`         ... mais ${tasks.length - 3} tarefas`);
            }
        }
    }
}

scanWorkspace().catch(console.error);
