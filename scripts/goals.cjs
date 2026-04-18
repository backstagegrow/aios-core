/**
 * goals.cjs — Goals / Metas no ClickUp
 *
 * Cria e gerencia Goals e Key Results (OKRs) via API v2.
 *
 * Uso:
 *   node scripts/goals.cjs --list
 *   node scripts/goals.cjs --create --name "Meta Abril" --due "2026-04-30" --color "#6B46C1"
 *   node scripts/goals.cjs --add-kr --goal <goal_id> --name "Alcançar 15k seguidores" --type number --current 12000 --target 15000 --unit "seguidores"
 *   node scripts/goals.cjs --add-kr --goal <goal_id> --name "Taxa de conversão" --type percentage --current 2 --target 5
 *   node scripts/goals.cjs --add-kr --goal <goal_id> --name "Entregar 20 posts" --type number --current 0 --target 20 --unit "posts"
 *   node scripts/goals.cjs --update-kr --goal <goal_id> --kr <kr_id> --current 14500
 *   node scripts/goals.cjs --delete --goal <goal_id>
 *
 * Tipos de Key Result (--type):
 *   number      — Valor numérico com unidade
 *   percentage  — 0 a 100%
 *   boolean     — Sim/Não (true/false)
 *   currency    — Valor monetário
 *
 * Workspace ID: 90132645314
 */

const { clickupRequest } = require('./lib/clickup-env.cjs');
const { log, logError } = require('./lib/clickup-logger.cjs');

const WORKSPACE_ID = process.env.CLICKUP_WORKSPACE_ID || '90132645314';

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

function progressBar(current, target) {
    const pct = Math.min(100, Math.round((current / target) * 100));
    const filled = Math.round(pct / 10);
    return `[${'█'.repeat(filled)}${'░'.repeat(10 - filled)}] ${pct}%`;
}

async function main() {
    const args = parseArgs();

    try {
        if (args.list) {
            const res = await clickupRequest('GET', `/team/${WORKSPACE_ID}/goal`);
            const goals = res.goals || [];
            if (!goals.length) { console.log('Nenhuma meta encontrada.'); return; }
            console.log(`\n🎯 Goals — Workspace BKS Grow\n`);
            for (const g of goals) {
                const pct = g.percent_completed || 0;
                console.log(`  [${g.id}] ${g.name} — ${pct}% completo`);
                if (g.key_results?.length) {
                    for (const kr of g.key_results) {
                        const cur = parseFloat(kr.current_value || 0);
                        const tgt = parseFloat(kr.goal_value || 1);
                        console.log(`    • ${kr.name}: ${progressBar(cur, tgt)} (${cur}/${tgt}${kr.unit ? ' ' + kr.unit : ''})`);
                    }
                }
            }

        } else if (args.create) {
            if (!args.name) { console.error('❌ Informe --name "Nome da Meta"'); process.exit(1); }
            const dueDate = args.due ? new Date(args.due).getTime() : undefined;
            const body = {
                name: args.name,
                due_date: dueDate,
                color: args.color || '#6B46C1',
                multiple_owners: false,
                owners: [],
            };
            const res = await clickupRequest('POST', `/team/${WORKSPACE_ID}/goal`, body);
            console.log(`✅ Goal criado!`);
            console.log(`   ID: ${res.goal.id}`);
            console.log(`   Nome: ${res.goal.name}`);

        } else if (args['add-kr']) {
            if (!args.goal || !args.name) { console.error('❌ Informe --goal <goal_id> e --name'); process.exit(1); }
            const validTypes = ['number', 'percentage', 'boolean', 'currency'];
            const type = args.type || 'number';
            if (!validTypes.includes(type)) { console.error(`❌ --type deve ser: ${validTypes.join(', ')}`); process.exit(1); }

            const body = {
                name: args.name,
                type,
                steps_start: parseFloat(args.current || 0),
                steps_end: parseFloat(args.target || 100),
                ...(args.unit ? { unit: args.unit } : {}),
            };
            const res = await clickupRequest('POST', `/goal/${args.goal}/key_result`, body);
            console.log(`✅ Key Result adicionado!`);
            console.log(`   ID: ${res.key_result.id}`);
            console.log(`   ${args.name}: ${args.current || 0} → ${args.target || 100}${args.unit ? ' ' + args.unit : ''}`);

        } else if (args['update-kr']) {
            if (!args.goal || !args.kr) { console.error('❌ Informe --goal e --kr <kr_id>'); process.exit(1); }
            if (args.current === undefined) { console.error('❌ Informe --current <valor>'); process.exit(1); }
            const body = { steps_current: parseFloat(args.current) };
            await clickupRequest('PUT', `/goal/${args.goal}/key_result/${args.kr}`, body);
            console.log(`✅ Key Result atualizado! Valor atual: ${args.current}`);

        } else if (args.delete) {
            if (!args.goal) { console.error('❌ Informe --goal <goal_id>'); process.exit(1); }
            await clickupRequest('DELETE', `/goal/${args.goal}`);
            console.log(`✅ Goal deletado!`);

        } else {
            console.error('❌ Informe uma ação: --list, --create, --add-kr, --update-kr ou --delete');
            process.exit(1);
        }
    } catch (err) {
        console.error(`\n❌ Erro: ${err.message}`);
        if (err.data) console.error('Detalhes:', JSON.stringify(err.data, null, 2));
        process.exit(1);
    }
}

main();
