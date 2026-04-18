/**
 * task_ops.cjs — Operações avançadas em Tasks do ClickUp
 *
 * Checklists, comentários, tags e anexos via API v2.
 *
 * Uso:
 *   -- CHECKLISTS --
 *   node scripts/task_ops.cjs --task <task_id> --list-checklists
 *   node scripts/task_ops.cjs --task <task_id> --add-checklist --name "Pre-check"
 *   node scripts/task_ops.cjs --task <task_id> --add-checklist-item --checklist <checklist_id> --name "Item"
 *   node scripts/task_ops.cjs --task <task_id> --complete-item --checklist <checklist_id> --item <item_id>
 *   node scripts/task_ops.cjs --task <task_id> --delete-checklist --checklist <checklist_id>
 *
 *   -- COMENTÁRIOS --
 *   node scripts/task_ops.cjs --task <task_id> --comment --text "Mensagem do AIOS"
 *   node scripts/task_ops.cjs --task <task_id> --list-comments
 *
 *   -- TAGS --
 *   node scripts/task_ops.cjs --task <task_id> --add-tag --tag "agent"
 *   node scripts/task_ops.cjs --task <task_id> --remove-tag --tag "agent"
 *   node scripts/task_ops.cjs --space <space_id> --create-tag --tag "nome" --color "#FF0000"
 *
 *   -- ANEXOS --
 *   node scripts/task_ops.cjs --task <task_id> --attach --file "/caminho/do/arquivo.jpg"
 */

const path = require('path');
const fs = require('fs');
const https = require('https');
const { clickupRequest, API_KEY } = require('./lib/clickup-env.cjs');
const { log, logError } = require('./lib/clickup-logger.cjs');

function uploadAttachment(taskId, filePath) {
    return new Promise((resolve, reject) => {
        const fileContent = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);
        const boundary = `----FormBoundary${Date.now()}`;
        const header = Buffer.from(
            `--${boundary}\r\nContent-Disposition: form-data; name="attachment"; filename="${fileName}"\r\nContent-Type: application/octet-stream\r\n\r\n`
        );
        const footer = Buffer.from(`\r\n--${boundary}--\r\n`);
        const body = Buffer.concat([header, fileContent, footer]);

        const options = {
            hostname: 'api.clickup.com',
            port: 443,
            path: `/api/v2/task/${taskId}/attachment`,
            method: 'POST',
            headers: {
                'Authorization': API_KEY,
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
                'Content-Length': body.length,
            },
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                let parsed;
                try { parsed = JSON.parse(data); } catch { parsed = data; }
                if (res.statusCode >= 200 && res.statusCode < 300) resolve(parsed);
                else { const err = new Error(`Upload Error: ${res.statusCode}`); err.data = parsed; reject(err); }
            });
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

function parseArgs() {
    const args = process.argv.slice(2);
    const result = {};
    for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith('--')) {
            const key = args[i].slice(2);
            const next = args[i + 1];
            if (next && !next.startsWith('--')) { result[key] = next; i++; }
            else result[key] = true;
        }
    }
    return result;
}

async function main() {
    const args = parseArgs();

    try {
        // CHECKLISTS
        if (args['list-checklists']) {
            if (!args.task) { console.error('❌ Informe --task <task_id>'); process.exit(1); }
            const task = await clickupRequest('GET', `/task/${args.task}`);
            const checklists = task.checklists || [];
            if (!checklists.length) { console.log('Nenhum checklist encontrado.'); return; }
            for (const cl of checklists) {
                console.log(`\n📋 ${cl.name} [ID: ${cl.id}]`);
                for (const item of (cl.items || [])) {
                    const icon = item.resolved ? '✅' : '⬜';
                    console.log(`   ${icon} ${item.name} [ID: ${item.id}]`);
                }
            }

        } else if (args['add-checklist']) {
            if (!args.task) { console.error('❌ Informe --task <task_id>'); process.exit(1); }
            const res = await clickupRequest('POST', `/task/${args.task}/checklist`, { name: args.name || 'Checklist' });
            console.log(`✅ Checklist criado! ID: ${res.checklist.id}`);

        } else if (args['add-checklist-item']) {
            if (!args.task || !args.checklist) { console.error('❌ Informe --task e --checklist'); process.exit(1); }
            const res = await clickupRequest('POST', `/task/${args.task}/checklist/${args.checklist}/checklist_item`, { name: args.name || 'Item' });
            console.log(`✅ Item adicionado! ID: ${res.checklist.items?.slice(-1)[0]?.id}`);

        } else if (args['complete-item']) {
            if (!args.task || !args.checklist || !args.item) { console.error('❌ Informe --task, --checklist e --item'); process.exit(1); }
            await clickupRequest('PUT', `/task/${args.task}/checklist/${args.checklist}/checklist_item/${args.item}`, { resolved: true });
            console.log('✅ Item marcado como concluído!');

        } else if (args['delete-checklist']) {
            if (!args.task || !args.checklist) { console.error('❌ Informe --task e --checklist'); process.exit(1); }
            await clickupRequest('DELETE', `/task/${args.task}/checklist/${args.checklist}`);
            console.log('✅ Checklist deletado!');

        // COMENTÁRIOS
        } else if (args.comment) {
            if (!args.task || !args.text) { console.error('❌ Informe --task e --text "mensagem"'); process.exit(1); }
            await clickupRequest('POST', `/task/${args.task}/comment`, { comment_text: args.text });
            console.log('✅ Comentário adicionado!');

        } else if (args['list-comments']) {
            if (!args.task) { console.error('❌ Informe --task <task_id>'); process.exit(1); }
            const res = await clickupRequest('GET', `/task/${args.task}/comment`);
            const comments = res.comments || [];
            if (!comments.length) { console.log('Nenhum comentário.'); return; }
            for (const c of comments) {
                console.log(`\n[${c.date ? new Date(parseInt(c.date)).toLocaleDateString('pt-BR') : '?'}] ${c.user?.username || '?'}: ${c.comment_text}`);
            }

        // TAGS
        } else if (args['add-tag']) {
            if (!args.task || !args.tag) { console.error('❌ Informe --task e --tag'); process.exit(1); }
            await clickupRequest('POST', `/task/${args.task}/tag/${encodeURIComponent(args.tag)}`);
            console.log(`✅ Tag "${args.tag}" adicionada!`);

        } else if (args['remove-tag']) {
            if (!args.task || !args.tag) { console.error('❌ Informe --task e --tag'); process.exit(1); }
            await clickupRequest('DELETE', `/task/${args.task}/tag/${encodeURIComponent(args.tag)}`);
            console.log(`✅ Tag "${args.tag}" removida!`);

        } else if (args['create-tag']) {
            if (!args.space || !args.tag) { console.error('❌ Informe --space e --tag'); process.exit(1); }
            await clickupRequest('POST', `/space/${args.space}/tag`, { tag: { name: args.tag, tag_fg: args.color || '#ffffff', tag_bg: args.color || '#000000' } });
            console.log(`✅ Tag "${args.tag}" criada no Space!`);

        // ANEXOS
        } else if (args.attach) {
            if (!args.task || !args.file) { console.error('❌ Informe --task e --file "/caminho/arquivo"'); process.exit(1); }
            if (!fs.existsSync(args.file)) { console.error(`❌ Arquivo não encontrado: ${args.file}`); process.exit(1); }
            const res = await uploadAttachment(args.task, args.file);
            console.log(`✅ Anexo enviado! URL: ${res.url}`);

        } else {
            console.error('❌ Informe uma ação: --list-checklists, --add-checklist, --add-checklist-item, --complete-item, --delete-checklist,');
            console.error('                    --comment, --list-comments, --add-tag, --remove-tag, --create-tag, --attach');
            process.exit(1);
        }
    } catch (err) {
        console.error(`\n❌ Erro: ${err.message}`);
        if (err.data) console.error('Detalhes:', JSON.stringify(err.data, null, 2));
        process.exit(1);
    }
}

main();
