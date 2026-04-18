/**
 * time_tracking.cjs — Time Tracking no ClickUp
 *
 * Loga, lista e deleta entradas de tempo em tasks via API v2.
 *
 * Uso:
 *   node scripts/time_tracking.cjs --task <task_id> --log --minutes 90 --desc "Produção de Reels"
 *   node scripts/time_tracking.cjs --task <task_id> --log --hours 1 --minutes 30
 *   node scripts/time_tracking.cjs --task <task_id> --list
 *   node scripts/time_tracking.cjs --task <task_id> --delete --entry <interval_id>
 *
 * Workspace ID: 90132645314
 */

const { clickupRequest } = require('./lib/clickup-env.cjs');
const { log, logError } = require('./lib/clickup-logger.cjs');

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

function formatDuration(ms) {
    const totalMin = Math.round(ms / 60000);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

async function main() {
    const args = parseArgs();

    if (!args.task) { console.error('❌ Informe --task <task_id>'); process.exit(1); }

    try {
        if (args.log) {
            const hours = parseFloat(args.hours || 0);
            const minutes = parseFloat(args.minutes || 0);
            const totalMs = Math.round((hours * 60 + minutes) * 60 * 1000);

            if (totalMs <= 0) { console.error('❌ Informe --hours e/ou --minutes com valor > 0'); process.exit(1); }

            const body = {
                duration: totalMs,
                start: Date.now() - totalMs,
                ...(args.desc ? { description: args.desc } : {}),
            };

            const res = await clickupRequest('POST', `/task/${args.task}/time`, body);
            console.log(`✅ Tempo logado: ${formatDuration(totalMs)}${args.desc ? ` — "${args.desc}"` : ''}`);
            console.log(`   Entry ID: ${res.data?.id || res.id || '?'}`);

        } else if (args.list) {
            const res = await clickupRequest('GET', `/task/${args.task}/time`);
            const entries = res.data || [];
            if (!entries.length) { console.log('Nenhuma entrada de tempo.'); return; }

            let totalMs = 0;
            console.log(`\n⏱️  Entradas de tempo — Task ${args.task}\n`);
            for (const e of entries) {
                const dur = parseInt(e.duration || 0);
                totalMs += dur;
                console.log(`  [${e.id}] ${formatDuration(dur)}${e.description ? ` — ${e.description}` : ''}`);
            }
            console.log(`\n  Total: ${formatDuration(totalMs)}`);

        } else if (args.delete) {
            if (!args.entry) { console.error('❌ Informe --entry <interval_id>'); process.exit(1); }
            await clickupRequest('DELETE', `/task/${args.task}/time/${args.entry}`);
            console.log('✅ Entrada de tempo deletada!');

        } else {
            console.error('❌ Informe uma ação: --log, --list ou --delete');
            process.exit(1);
        }
    } catch (err) {
        console.error(`\n❌ Erro: ${err.message}`);
        if (err.data) console.error('Detalhes:', JSON.stringify(err.data, null, 2));
        process.exit(1);
    }
}

main();
