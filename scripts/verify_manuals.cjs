/**
 * verify_manuals.cjs — Verifica estado dos Manuais dos clientes via API v3
 */

const { clickupV3 } = require('./lib/clickup-env.cjs');

const manuals = [
    { name: 'sp HAUS',        id: '2ky561e2-2453', status: 'inactive' },
    { name: 'Via BR',         id: '2ky561e2-3093' },
    { name: 'GT House',       id: '2ky561e2-3053' },
    { name: 'Backstage Grow', id: '2ky561e2-3033' },
    { name: 'Imersão ABA',    id: '2ky561e2-4173' },
];

async function verifyDoc(manual) {
    const tag = manual.status === 'inactive' ? ' [INATIVO]' : '';
    try {
        const res = await clickupV3('GET', `/${manual.id}/pages`);
        const pages = res.pages || (Array.isArray(res) ? res : []);
        console.log(`\n✅ ${manual.name}${tag} — ${pages.length} página(s)`);
        for (const p of pages) {
            console.log(`   📝 ${p.name || '(sem nome)'} [${p.id}]`);
        }
    } catch (e) {
        console.error(`\n❌ ${manual.name}${tag} — Erro ${e.status || '?'}: ${e.message}`);
    }
}

async function run() {
    console.log('--- VERIFICANDO MANUAIS DOS CLIENTES (API v3) ---\n');
    for (const m of manuals) {
        await verifyDoc(m);
    }
    console.log('\n--- Verificação concluída ---');
}

run();
