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
                apiKey = line.split('=')[1].trim();
                break;
            }
        }
    } catch (e) {
        console.error("No .env found", e);
    }
    return apiKey || process.env.CLICKUP_API_KEY;
}

const CLICKUP_API_KEY = getApiKey();

function clickupRequest(method, endpoint, body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.clickup.com',
            path: `/api/v2${endpoint}`,
            method,
            headers: {
                'Authorization': CLICKUP_API_KEY,
                'Content-Type': 'application/json',
            },
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                let parsed;
                try {
                    parsed = JSON.parse(data);
                } catch (e) {
                    parsed = data;
                }
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve({ status: res.statusCode, data: parsed });
                } else {
                    reject({ status: res.statusCode, data: parsed });
                }
            });
        });

        req.on('error', reject);
        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

const clientTasks = [
    {
        clientName: "BKS Grow",
        listId: "901324771662",
        task: {
            name: "📊 [REPORT] - Relatório Executivo de Performance Meta Ads",
            markdown_description: "**Data de Extração:** 05 de Março de 2026\n**Framework de Execução:** Modular BGE (BKS Growth Engine)\n\n### 🚀 BKS Grow (Agência / B2B)\n**Objetivo:** Geração de Leads Qualificados e Agendamento de Reuniões.\n**Status do Funil:** Validação de Otimização (Gargalo no evento do site, migrando para MQL via Form/WhatsApp).\n\n*   **Comportamento do Público:** Alta rejeição a jargões generalistas; engajamento focado em conteúdos específicos para o setor de eventos.\n*   **Crítivos Vencedores (Winning Hooks):**\n    *   “Indicação não é estratégia de crescimento” (Alta tração provocativa).\n    *   Carrosséis detalhando o funil B2B para eventos.\n    *   Vídeos com \"Lucas Vendado\" e \"Lucas Dados\".\n*   **Próximos Passos (Ops):**\n    1.  Corrigir disparo do evento no site via Pixel + CAPI.\n    2.  Pausar/adaptar campanhas que rodam com o evento incorreto TestEvent.\n    3.  Reidratar orçamento em fluxos de Form e WhatsApp temporariamente."
        }
    },
    {
        clientName: "GT House",
        listId: "901324526554",
        task: {
            name: "📊 [REPORT] - Relatório Executivo de Performance Meta Ads",
            markdown_description: "**Data de Extração:** 05 de Março de 2026\n**Framework de Execução:** Modular BGE (BKS Growth Engine)\n\n### 🏛️ GT House (Espaço de Alta Categoria)\n**Objetivo:** Captação de C-Levels e Heads de Marketing para Imersões Corporativas.\n**Status do Funil:** Qualificação Avançada (Ticket Médio de Captação: R$ 60k+).\n\n*   **Comportamento do Público:** Pessoas sensíveis à exclusividade e diferenciação de marca. Comparação direta com players de altíssimo padrão (Villaggio JK, Casa Petra).\n*   **Crítivos Vencedores (Winning Hooks):**\n    *   Cases validados com marcas globais (Adidas, Red Bull, Stone).\n    *   Foco em \"Ecossistema Plug-and-Play\" (\"100% Palco. 0% Estresse\").\n    *   Material institucional focado em estética impecável.\n*   **Ações Recentes (Ops):**\n    *   Subida de campanhas de WhatsApp focadas em decisores.\n    *   Renovação intensa da bateria de criativos para \"Especialistas\" e fomento de locação para \"Imersões\"."
        }
    },
    {
        clientName: "Via Br Cenografia",
        listId: "901324526552",
        task: {
            name: "📊 [REPORT] - Relatório Executivo de Performance Meta Ads",
            markdown_description: "**Data de Extração:** 05 de Março de 2026\n**Framework de Execução:** Modular BGE (BKS Growth Engine)\n\n### 🏗️ Via Br Cenografia\n**Objetivo:** Posicionamento de Autoridade e Prospecção de Contas Enterprise.\n**Status do Funil:** Relacionamento B2B de ciclo longo (30-120 dias).\n\n*   **Comportamento do Público:** Gestores de Marca que fogem de \"stand de feira genérico\" e buscam segurança na montagem e UX de espaço.\n*   **Crítivos Vencedores (Winning Hooks):**\n    *   “Cenografia não é decoração. É ferramenta de vendas.”\n    *   Time-lapses de montagem (Provam a capacidade de execução de 35 anos).\n    *   Storytelling em cima de cases difíceis (Heineken, Brazil Games).\n*   **Ações Recentes (Ops):**\n    *   Upload de campanhas de Geração de Formulários e atualização rotineira de criativos mostrando novos cases em tempo real."
        }
    },
    {
        clientName: "spHaus",
        listId: "901324526553",
        task: {
            name: "📊 [REPORT] - Relatório Executivo de Performance Meta Ads",
            markdown_description: "**Data de Extração:** 05 de Março de 2026\n**Framework de Execução:** Modular BGE (BKS Growth Engine)\n\n### 🎥 spHaus (Conteúdo 360º & Estética)\n**Objetivo:** Venda de cotas / espaço de evento para agências criativas.\n**Status do Funil:** Showroom Virtual → Cotação Personalizada.\n\n*   **Comportamento do Público:** Diretores de Arte e Brand Managers hiper-sensíveis ao \"Instagramável\". Buscam locais que gerem mídia espontânea.\n*   **Crítivos Vencedores (Winning Hooks):**\n    *   Vídeos exaltando texturas, projeções e arquitetura moderna.\n    *   Calls to Action sugerindo que \"cada formato de evento pede um espaço à altura\".\n*   **Ações Recentes (Ops):**\n    *   Correções de Landing Page recém implementadas e testes de audiência ampliados. Lançamento de novos materiais visuais provando a capacidade volumétrica do ambiente."
        }
    },
    {
        clientName: "Espaço Network Constru",
        listId: "901324526551",
        task: {
            name: "📊 [REPORT] - Relatório Executivo de Performance Meta Ads",
            markdown_description: "**Data de Extração:** 05 de Março de 2026\n**Framework de Execução:** Modular BGE (BKS Growth Engine)\n\n### 🤝 Espaço Network Constru\n**Objetivo:** Reuniões Comerciais e Fechamentos Regionais (Alphaville).\n**Status do Funil:** Geração de Demanda Local + Visitas Técnicas Táticas.\n\n*   **Comportamento do Público:** Profissionais Liberais, empresários de Barueri e região buscando estrutura e ambiente resolutivo. Retorno rápido (7-30 dias).\n*   **Crítivos Vencedores (Winning Hooks):**\n    *   Abordagem regionalizada (\"O endereço onde os novos contratos de Alphaville são assinados\").\n    *   Anúncios provocativos: \"O fim do networking superficial\".\n*   **Ações Recentes (Ops):**\n    *   Ajustes de identidade visual (nova logo aplicável em ADS), implementação de campanhas de Remarketing, e criação de públicos personalizados baseados em leads entrantes."
        }
    }
];

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.log("Iniciando upload de Relatórios para o ClickUp...");

    for (let i = 0; i < clientTasks.length; i++) {
        const client = clientTasks[i];
        try {
            console.log(`[${i + 1}/${clientTasks.length}] Criando relatório para: ${client.clientName}`);
            const res = await clickupRequest('POST', `/list/${client.listId}/task`, client.task);
            console.log(`✅ Relatório criado para ${client.clientName}! URL: ${res.data.url}`);

            await delay(500);
        } catch (error) {
            console.error(`❌ Erro ao criar relatório para: ${client.clientName}`);
            console.error(error);
        }
    }

    console.log("Upload de relatórios concluído!");
}

main();
