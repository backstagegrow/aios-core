import { FinchAgent } from '../src/llm/finch-agent';
import fs from 'fs';
import path from 'path';

async function runGTHouseAudit() {
    console.log('[FinchAudit] Inciando auditoria GT House...');

    const finch = new FinchAgent();

    // Ler a LP da GT House
    const lpPath = path.resolve(process.cwd(), 'clients/GTHouse/imersao.html');
    if (!fs.existsSync(lpPath)) {
        console.error('[FinchAudit] LP imersao.html não encontrada!');
        return;
    }

    const htmlContent = fs.readFileSync(lpPath, 'utf8');

    const context = `Landing Page de um espaço de eventos premium em SP chamado GT House. 
    Público-alvo: Experts, palestrantes e infoprodutores que faturam alto e querem um espaço "plug-and-play".`;

    console.log('[FinchAudit] Chamando persona Thiago Finch para análise...');
    const result = await finch.analyze(htmlContent, context);

    console.log('\n--- FEEDBACK IMPLACÁVEL — THIAGO FINCH ---\n');
    console.log(result);
    console.log('\n------------------------------------------\n');

    // Salvar resultado
    const outPath = path.resolve(process.cwd(), 'clients/GTHouse/finch_audit_results.md');
    fs.writeFileSync(outPath, `# Auditoria Thiago Finch — GT House imersao.html\n\n${result}`);
    console.log(`[FinchAudit] Relatório salvo em: ${outPath}`);
}

runGTHouseAudit().catch(console.error);
