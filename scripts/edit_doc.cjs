/**
 * edit_doc.cjs — ClickUp Docs Editor
 *
 * Lê, cria e edita páginas de Docs do ClickUp via API v3.
 *
 * Uso:
 *   node scripts/edit_doc.cjs --doc <doc_id> --list
 *   node scripts/edit_doc.cjs --doc <doc_id> --read --page <page_id>
 *   node scripts/edit_doc.cjs --doc <doc_id> --edit --page <page_id> --content "Novo conteúdo"
 *   node scripts/edit_doc.cjs --doc <doc_id> --create-page --name "Nome" --content "Conteúdo"
 *   node scripts/edit_doc.cjs --doc <doc_id> --create-subpage --parent-page <page_id> --name "Sub" --content "..."
 *   node scripts/edit_doc.cjs --doc <doc_id> --create-table --name "Tabela" --columns "Col1,Col2,Col3" --rows "A,B,C|D,E,F"
 *   node scripts/edit_doc.cjs --doc <doc_id> --rename-page --page <page_id> --name "Novo Nome"
 *   node scripts/edit_doc.cjs --doc <doc_id> --delete-page --page <page_id>
 *
 * Doc IDs conhecidos (Manuais de Clientes):
 *   sp HAUS:          2ky561e2-2453
 *   Via BR:           2ky561e2-3093
 *   GT House:         2ky561e2-3053
 *   Backstage Grow:   2ky561e2-3033
 *   Imersão ABA:      2ky561e2-4173
 *
 * Sintaxe de tabela markdown (--rows):
 *   Separe colunas com vírgula, linhas com pipe: "Val1,Val2,Val3|Val4,Val5,Val6"
 */

const { clickupV3 } = require('./lib/clickup-env.cjs');
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

async function listPages(docId) {
    console.log(`\n📄 Listando páginas do Doc: ${docId}\n`);
    const res = await clickupV3('GET', `/${docId}/pages`);
    const pages = res.pages || (Array.isArray(res) ? res : []);
    if (!pages.length) { console.log('Nenhuma página encontrada.'); return; }
    for (const p of pages) {
        console.log(`  📝 ${p.name || '(sem nome)'} — ID: ${p.id}`);
    }
}

async function readPage(docId, pageId) {
    console.log(`\n📖 Lendo página ${pageId} do Doc ${docId}\n`);
    const page = await clickupV3('GET', `/${docId}/pages/${pageId}`);
    console.log(`Nome: ${page.name || '(sem nome)'}`);
    console.log(`\nConteúdo:\n${'─'.repeat(50)}`);
    console.log(page.content || '(sem conteúdo)');
    console.log('─'.repeat(50));
}

async function editPage(docId, pageId, content) {
    console.log(`\n✏️  Editando página ${pageId} do Doc ${docId}...`);
    await clickupV3('PUT', `/${docId}/pages/${pageId}`, { content });
    console.log('✅ Página atualizada com sucesso!');
    log('doc.page.edited', { docId, pageId });
}

async function renamePage(docId, pageId, name) {
    console.log(`\n🏷️  Renomeando página ${pageId} para "${name}"...`);
    await clickupV3('PUT', `/${docId}/pages/${pageId}`, { name });
    console.log('✅ Página renomeada com sucesso!');
    log('doc.page.renamed', { docId, pageId, name });
}

async function createPage(docId, name, content, parentPageId = null) {
    const label = parentPageId ? `sub-página "${name}" (parent: ${parentPageId})` : `página "${name}"`;
    console.log(`\n➕ Criando ${label} no Doc ${docId}...`);
    const body = { name, content: content || '' };
    if (parentPageId) body.parent_page_id = parentPageId;
    const res = await clickupV3('POST', `/${docId}/pages`, body);
    console.log(`✅ Criado! ID: ${res.id}`);
    log('doc.page.created', { docId, pageId: res.id, name, parent: parentPageId });
    return res;
}

async function deletePage(docId, pageId) {
    console.log(`\n🗑️  Deletando página ${pageId} do Doc ${docId}...`);
    await clickupV3('DELETE', `/${docId}/pages/${pageId}`);
    console.log('✅ Página deletada!');
    log('doc.page.deleted', { docId, pageId });
}

function buildMarkdownTable(columns, rows) {
    const cols = columns.split(',').map(c => c.trim());
    const header = `| ${cols.join(' | ')} |`;
    const separator = `| ${cols.map(() => '---').join(' | ')} |`;
    const rowLines = rows
        ? rows.split('|').map(row => {
              const cells = row.split(',').map(c => c.trim());
              while (cells.length < cols.length) cells.push('');
              return `| ${cells.join(' | ')} |`;
          })
        : [];
    return [header, separator, ...rowLines].join('\n');
}

async function createTablePage(docId, name, columns, rows, parentPageId = null) {
    if (!columns) { console.error('❌ Informe --columns "Col1,Col2,Col3"'); process.exit(1); }
    const content = buildMarkdownTable(columns, rows || '');
    return createPage(docId, name, content, parentPageId);
}

async function main() {
    const args = parseArgs();

    if (!args.doc) {
        console.error('❌ Informe o Doc ID com --doc <id>');
        console.error('\nExemplos:');
        console.error('  node scripts/edit_doc.cjs --doc 2ky561e2-3053 --list');
        console.error('  node scripts/edit_doc.cjs --doc 2ky561e2-3053 --read --page <page_id>');
        console.error('  node scripts/edit_doc.cjs --doc 2ky561e2-3053 --edit --page <page_id> --content "Novo texto"');
        console.error('  node scripts/edit_doc.cjs --doc 2ky561e2-3053 --create-page --name "Título" --content "Conteúdo"');
        process.exit(1);
    }

    try {
        if (args.list) {
            await listPages(args.doc);
        } else if (args.read) {
            if (!args.page) { console.error('❌ Informe --page <page_id>'); process.exit(1); }
            await readPage(args.doc, args.page);
        } else if (args.edit) {
            if (!args.page) { console.error('❌ Informe --page <page_id>'); process.exit(1); }
            if (!args.content) { console.error('❌ Informe --content "texto"'); process.exit(1); }
            await editPage(args.doc, args.page, args.content);
        } else if (args['create-page']) {
            if (!args.name) { console.error('❌ Informe --name "Nome da Página"'); process.exit(1); }
            await createPage(args.doc, args.name, args.content || '');
        } else if (args['create-subpage']) {
            if (!args.name) { console.error('❌ Informe --name "Nome"'); process.exit(1); }
            if (!args['parent-page']) { console.error('❌ Informe --parent-page <page_id>'); process.exit(1); }
            await createPage(args.doc, args.name, args.content || '', args['parent-page']);
        } else if (args['create-table']) {
            if (!args.name) { console.error('❌ Informe --name "Nome da Tabela"'); process.exit(1); }
            await createTablePage(args.doc, args.name, args.columns, args.rows, args['parent-page'] || null);
        } else if (args['rename-page']) {
            if (!args.page) { console.error('❌ Informe --page <page_id>'); process.exit(1); }
            if (!args.name) { console.error('❌ Informe --name "Novo Nome"'); process.exit(1); }
            await renamePage(args.doc, args.page, args.name);
        } else if (args['delete-page']) {
            if (!args.page) { console.error('❌ Informe --page <page_id>'); process.exit(1); }
            await deletePage(args.doc, args.page);
        } else {
            console.error('❌ Ações: --list, --read, --edit, --rename-page, --create-page, --create-subpage, --create-table, --delete-page');
            process.exit(1);
        }
    } catch (err) {
        logError('doc.operation', { error: err.message, doc: args.doc });
        console.error(`\n❌ Erro: ${err.message}`);
        if (err.data) console.error('Detalhes:', JSON.stringify(err.data, null, 2));
        process.exit(1);
    }
}

main();
