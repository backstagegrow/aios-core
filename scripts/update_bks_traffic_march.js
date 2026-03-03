const https = require('https');

const { API_KEY, clickupRequest } = require('./lib/clickup-env');
const LIST_ID = '901324771638'; // Backstage Grow

const TASKS = [
    {
        name: '🚀 [MARÇO] - Setup Qualificação (Lead Form)',
        content: `# EXECUTAR AGORA: Transição para Lead Form (Filtro Procedure) ✅\n\n**OBJETIVO:** Substituir o WhatsApp direto (que está trazendo leads ruins) por um formulário de alta qualificação.\n\n--- \n\n### 🖋️ COPYS AJUSTADAS (PROCEDURE DNA)\n\n**Variação 1: O "Anti-Curioso"**\n*   **Headline:** Não fazemos posts. Construímos Máquinas de Vendas B2B.\n*   **Texto:** Se o crescimento do seu negócio de eventos depende de indicação ou de posts "bonitinhos", você está em risco operacional. Decisores de alta complexidade não compram por impulso. Eles compram **Método**. A BKS Grow implementa o Playbook Andromeda: uma estrutura de aquisição desenhada exclusivamente para quem vende segurança e impacto no setor de eventos.\n*   **Filtro Explícito:** [Ação exclusiva para CEOs e Diretores comerciais de infraestrutura e produção de eventos].\n*   **CTA:** Baixar Dossiê de Estrutura B2B.\n\n**Variação 2: O Diferencial Técnico**\n*   **Headline:** Por que o tráfego comum falha com fornecedores de eventos?\n*   **Texto:** Porque o setor de eventos não é um e-commerce. É B2B de alto ticket. O seu cliente busca um parceiro, não um preço. Nós unimos a inteligência de dados da **BackStageFy** com estratégias de tráfego que falam a língua do C-Level. Pare de queimar verba com anúncios genéricos e comece a gerar oportunidades com quem realmente assina o cheque.\n*   **CTA:** Agendar Diagnóstico de Crescimento.\n\n--- \n\n### 📋 CHECKLIST DE EXECUÇÃO:\n* [ ] Criar novo Formulário Instantâneo no Meta Ads.\n* [ ] Adicionar Pergunta de Filtro: "Qual o faturamento mensal ou volume de eventos da sua empresa?"\n* [ ] Subir as 02 variações de copy acima.\n* [ ] Pausar campanha de WhatsApp Direto.`,
        priority: 1
    },
    {
        name: '🔧 [MARÇO] - Auditoria Performance Site',
        content: `# AUDITORIA TÉCNICA OBRIGATÓRIA ✅\n\n**CONTEXTO:** O site consumiu verba sem conversões registradas em fevereiro.\n\n### 📋 CHECKLIST:\n* [ ] Testar disparo de Pixel na Landing Page.\n* [ ] Conferir se o evento de "Lead" (Success Page) está mapeado corretamente no GTM ou Meta Pixel.\n* [ ] Ajustar Headline da LP para: "Cresça sua Produtora com Previsibilidade Estratégica" (Alinhamento Procedure).\n* [ ] Reativar com orçamento reduzido apenas para validação de tráfego.`,
        priority: 2
    },
    {
        name: '💰 [MARÇO] - Redistribuição de Budget (WA -> Forms)',
        content: `# AJUSTE DE CBO/ABO ✅\n\n**AÇÃO:**\n* [ ] Retirar budget da campanha de WhatsApp (Leads Desqualificados).\n* [ ] Alocar orçamento total disponível (~R$ 800 - R$ 900) na campanha de Lead Form.\n* [ ] Definir CPL Qualificado Alvo: R$ 35,00.`,
        priority: 1
    }
];

function clickupRequest(method, path, body) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.clickup.com',
            port: 443,
            path: '/api/v2' + path,
            method: method,
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/json',
            },
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, data: JSON.parse(data) }); } catch (e) { resolve({ status: res.statusCode, data: data }); }
            });
        });

        req.on('error', (e) => reject(e));
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function run() {
    console.log('--- INICIANDO CRIAÇÃO DE TAREFAS DE QUALIFICAÇÃO (MARÇO) ---');
    for (const task of TASKS) {
        console.log('Criando tarefa: ' + task.name + '...');
        const res = await clickupRequest('POST', '/list/' + LIST_ID + '/task', {
            name: task.name,
            markdown_description: task.content,
            priority: task.priority,
            status: 'aberto' // Portuguese for "open" in this workspace
        });
        if (res.status === 200 || res.status === 201) {
            console.log('  ✅ Criada: ' + res.data.url);
        } else {
            console.error('  ❌ Erro: ', res.data);
        }
    }
    console.log('--- OPERAÇÃO CONCLUÍDA ---');
}

run();
