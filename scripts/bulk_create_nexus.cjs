/**
 * bulk_create_nexus.cjs — Criação em massa de tasks via AIOS
 *
 * Uso:
 *   node scripts/bulk_create_nexus.cjs --list <list_id> --name "Tarefa" [--priority 1] [--assignee <id>] [--due YYYY-MM-DD]
 *   node scripts/bulk_create_nexus.cjs --run-session   (executa a sessão definida em run())
 *   node scripts/bulk_create_nexus.cjs --log           (exibe últimas operações)
 *
 * Idempotência: verifica se já existe task com o mesmo nome antes de criar.
 * Guarda AIOS: bloqueia criação em listas de clientes inativos.
 */

const { clickupRequest } = require('./lib/clickup-env.cjs');
const { isListSafe } = require('./lib/clickup-yaml.cjs');
const { log, logError, tail } = require('./lib/clickup-logger.cjs');
const { sleep } = require('./lib/throttle.cjs');

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

/**
 * Verifica se já existe uma task com o mesmo nome na lista (idempotência).
 */
async function taskExists(listId, name) {
    try {
        const res = await clickupRequest('GET', `/list/${listId}/task?page=0`);
        const tasks = res.tasks || [];
        return tasks.some(t => t.name === name);
    } catch {
        return false; // na dúvida, permite criação
    }
}

/**
 * Cria uma task com proteção de idempotência e guarda de cliente inativo.
 */
async function createTask(listId, name, description = '', options = {}) {
    // Guarda: cliente inativo
    if (!isListSafe(listId)) {
        logError('task.blocked', { listId, name, reason: 'inactive_client' });
        return null;
    }

    // Idempotência: evitar duplicatas
    if (await taskExists(listId, name)) {
        console.log(`⏭️  Já existe: "${name}" em ${listId} — pulando.`);
        log('task.skipped', { listId, name, reason: 'already_exists' });
        return null;
    }

    const assignee = options.assignee || 112048722; // Vitória (default creative)
    const payload = {
        name,
        markdown_description: description,
        assignees: [parseInt(assignee)],
        priority: options.priority || 3,
        ...(options.due_date ? { due_date: options.due_date } : {}),
        ...(options.custom_fields ? { custom_fields: options.custom_fields } : {}),
    };

    console.log(`🔨 Criando "${name}" em lista ${listId}...`);
    try {
        const res = await clickupRequest('POST', `/list/${listId}/task`, payload);
        console.log(`✅ Criada! ID: ${res.id} — ${res.url}`);
        log('task.created', { listId, taskId: res.id, name, priority: payload.priority });
        return res;
    } catch (err) {
        console.error(`❌ Erro: ${err.message}`);
        logError('task.created', { listId, name, error: err.message, detail: JSON.stringify(err.data) });
        return null;
    }
}

// ─── Sessão padrão (modo --run-session) ───────────────────────────────────────

async function runSession() {
    console.log('[AIOS Nexus] Iniciando distribuição de tasks...\n');

    const deadlineTask1 = new Date('2026-04-13T21:00:00Z').getTime();
    const deadlineTask2 = new Date('2026-04-11T12:00:00Z').getTime();

    // Criativos — Imersão ABA Tráfego
    await createTask('901325984626', '[Agent] 🎬 Criativos em Vídeo (PRIORIDADE MÁXIMA)',
        `- [ ] Acessar pasta de vídeos enviada pelo Israel no grupo\n- [ ] Fazer curadoria — selecionar os vídeos mais relevantes\n- [ ] Editar criativos em vídeo para Meta Ads (vertical, com legenda)\n- [ ] Entregar mínimo 2-3 vídeos editados para aprovação`,
        { due_date: deadlineTask1, priority: 1 });

    await createTask('901325984626', '[Agent] 🖼️ Criativos Estáticos',
        `- [ ] Levantar criativos estáticos disponíveis\n- [ ] Ajustar conforme brief do Erick\n- [ ] Entregar 3-4 estáticos prontos para aprovação`,
        { due_date: deadlineTask2, priority: 2 });

    // Curadoria — Alpha Business Design Web
    await createTask('901326596794', '[Agent] ⭐ Curadoria de Depoimentos (LP)',
        `- [ ] Acessar pasta/links de depoimentos enviados pelo Israel\n- [ ] Selecionar os mais emocionais para a LP\n- [ ] Entregar seleção para Erick implementar na página`,
        { priority: 3 });

    // Planejamento de conteúdo — clientes ativos (sem sp HAUS — inativo)
    const smLists = [
        { id: '901324514634', name: 'Via BR Cenografia' },
        { id: '901324517019', name: 'GT House' },
        { id: '901325984602', name: 'Imersão ABA' },
        { id: '901324771638', name: 'Backstage Grow' },
    ];

    for (const list of smLists) {
        await createTask(list.id, `[Agent] 📅 Planejamento de Conteúdo - ${list.name}`,
            `- [ ] Montar cronograma de conteúdo de Maio para ${list.name}\n- [ ] Curadoria → edição → entrega sem precisar ser cobrada`,
            { priority: 3 });
        await sleep(200);
    }

    console.log('\n[AIOS Nexus] Distribuição concluída.');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
    const args = parseArgs();

    if (args.log) {
        tail(30);
        return;
    }

    if (args['run-session']) {
        await runSession();
        return;
    }

    if (args.list && args.name) {
        const dueDate = args.due ? new Date(args.due).getTime() : undefined;
        await createTask(args.list, args.name, args.description || '', {
            priority: args.priority ? parseInt(args.priority) : 3,
            assignee: args.assignee,
            due_date: dueDate,
        });
        return;
    }

    console.error('❌ Uso:');
    console.error('  node scripts/bulk_create_nexus.cjs --list <id> --name "Tarefa" [--priority 1] [--due YYYY-MM-DD]');
    console.error('  node scripts/bulk_create_nexus.cjs --run-session');
    console.error('  node scripts/bulk_create_nexus.cjs --log');
    process.exit(1);
}

main();
