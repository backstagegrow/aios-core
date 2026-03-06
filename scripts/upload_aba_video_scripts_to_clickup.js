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
const LIST_ID = '901325984602';

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

const ads = [
    {
        name: "🎬 Roteiro 1: Ad Direto — O Custo do Operacional",
        markdown_description: "**Objetivo:** Conversão Direta para a Imersão (Foco na dor principal)\n**Formato:** Ad (Facebook/Instagram/YouTube) - 45 a 60 seg\n**Visual:** Ambiente de escritório dentro de um restaurante (fundo desfocado). Lucas ou José Ricardo falando direto para a câmera, tom de conversa séria.\n\n**[Hook - 0-5s]:** Você abriu o seu restaurante para ter liberdade. Mas hoje, se você não está lá, a operação inteira entra em colapso.\n\n**[Corpo - 5-30s]:** Você é o primeiro a chegar, o último a sair, e se decide tirar um dia de folga, seu celular toca 15 vezes. Isso acontece porque o seu negócio não tem estrutura, ele tem você apagando incêndios. Esforço sem método é apenas improviso. E o improviso custa a sua margem de lucro e a sua sanidade. \n\nO que você precisa não é trabalhar mais horas. É de um sistema. Nós ajudamos mais de 500 operações no food service a instalar processos, prever receitas e construir times autônomos.\n\n**[CTA - 30-45s]:** Nos dias 21 e 22 de Março, em São Paulo, nós vamos realizar a Imersão O Caminho do Dono. Serão 2 dias para você diagnosticar seu negócio e sair com um plano de execução de 90 dias para parar de ser operador e voltar a ser dono. Clique em \"Saiba Mais\" e faça sua aplicação. Não é para iniciantes, é para quem já está no jogo e quer escalar."
    },
    {
        name: "🎬 Roteiro 2: Reels — O Mito do Faturamento",
        markdown_description: "**Objetivo:** Conscientização e Autoridade (Pilar: Margem Protegida)\n**Formato:** Reels Orgânico - 30 a 45 seg\n**Visual:** Câmera dinâmica, andando pelo salão de um restaurante antes de abrir.\n\n**[Hook - 0-5s]:** O seu faturamento está crescendo, mas no fim do mês, o dinheiro não sobra na conta da empresa. Por que isso acontece?\n\n**[Corpo - 5-30s]:** Muitos donos de food service caem na ilusão do faturamento. Eles vendem mais, contratam mais, giram mais estoque, mas continuam sem clareza da sua DRE real e do seu fluxo de caixa. O resultado? Você trabalha mais e ganha proporcionalmente menos. Crescimento sem gestão financeira estruturada é o caminho mais rápido para quebrar uma operação que parecia saudável.\n\nA diferença entre o dono que escala e o dono que se afoga é que o primeiro toma decisões baseadas em números reais, não em feeling. Cada real gasto é justificado na margem final.\n\n**[CTA - 30-45s]:** Se você fatura bem, mas sente que o negócio está caro demais em energia e margem, você precisa de processos financeiros claros. Salve esse vídeo para não esquecer: faturamento é vaidade, margem é sanidade. E se você quer resolver isso na prática, clique no link da bio e conheça a nossa imersão."
    },
    {
        name: "🎬 Roteiro 3: Reels — Time Autônomo vs. Apagador de Incêndios",
        markdown_description: "**Objetivo:** Conscientização (Pilar: Pessoas Autônomas / Turnover)\n**Formato:** Reels Orgânico - 30 seg\n**Visual:** Takes rápidos do dia a dia (cozinha, salão) intercalados com o porta-voz focando na câmera com postura firme.\n\n**[Hook - 0-5s]:** Se você acha impossível achar mão de obra decente no food service hoje em dia, o problema pode estar no seu espelho.\n\n**[Corpo - 5-25s]:** É duro ouvir isso, mas você contrata rápido, treina na correria e perde o funcionário em três meses. O turnover alto está comendo a sua margem. O problema raramente é só \"a geração que não quer trabalhar\". O problema é que a sua empresa não tem um processo claro de integração, não tem métricas de desempenho e não tem cultura.\n\nNão dá para cobrar excelência de um time que foi treinado no improviso. Você precisa de um framework de contratação pelo caráter e treinamento pelo processo.\n\n**[CTA - 25-30s]:** Quer montar uma equipe que entrega resultado mesmo quando você não está na loja? Assuma a responsabilidade de construir processos. Comenta \"TIME\" aqui embaixo que eu te envio mais detalhes no direct."
    },
    {
        name: "🎬 Roteiro 4: Ad — Quebrando a Objeção de Tempo",
        markdown_description: "**Objetivo:** Retargeting / Ad Direto para a Imersão\n**Formato:** Ad (Story/Reels) - 40 seg\n**Visual:** Close no rosto do mentor (Robert, Lucas ou José Ricardo), transmitindo seriedade e clareza. Contraste alto, iluminação premium.\n\n**[Hook - 0-8s]:** \"Eu não tenho tempo para parar o meu restaurante por dois dias\". Se essa foi a desculpa que você deu ao ver a nossa imersão, preste atenção.\n\n**[Corpo - 8-25s]:** O fato da sua loja não conseguir rodar 48 horas sem a sua presença física é a maior prova de que você **precisa** estar no Caminho do Dono. Se você continuar adiando a profissionalização do seu negócio por falta de tempo, você vai passar os próximos 5 anos refém do próprio balcão. O custo de não parar agora é a sua liberdade financeira e o crescimento da sua empresa a médio prazo.\n\n**[CTA - 25-40s]:** Nos dias 21 e 22 de Março, nós vamos te dar a estrutura exata para sair dessa armadilha operacional. Clique no botão abaixo, pare de dar desculpas para a sua própria gestão, e venha construir a escala da sua empresa com método. A aplicação leva 3 minutos."
    },
    {
        name: "🎬 Roteiro 5: Reels — O Framework do Crescimento (Mecanismo)",
        markdown_description: "**Objetivo:** Autoridade (Apresentação do Mecanismo Único)\n**Formato:** Reels Orgânico - 45 seg\n**Visual:** O mentor desenhando rapidamente 4 pilares em um quadro de vidro ou iPad, olhando diretamente para a câmera.\n\n**[Hook - 0-5s]:** A diferença entre o dono que estagna com 1 loja e o que expande para 10 não é talento. É estrutura.\n\n**[Corpo - 5-30s]:** Depois de escalar mais de 500 operações no food service, nós documentamos que todo negócio previsível se apoia no que chamamos de Tripé da Excelência Empresarial. E ele exige:\n1. Receita previsível, que não depende apenas de boca a boca.\n2. Escala com estrutura e processos documentados.\n3. Pessoas autônomas, para que a loja rode sem você.\n4. Margem protegida, com uma DRE que você entende de verdade.\n\nQuando um ou mais desses pilares falta, você tem caos e perda de dinheiro.\n\n**[CTA - 30-45s]:** Você sabe qual desses 4 pontos é o gargalo da sua empresa hoje? Leia a legenda onde eu explico como auditar o seu próprio negócio agora. Se quiser dar um passo além, o link da nossa imersão está na bio."
    },
    {
        name: "🎬 Roteiro 6: Ad — Filtro e Qualificação (Público Frio/Morno)",
        markdown_description: "**Objetivo:** Ad para Imersão (Exclusão de Curiosos / Foco no ICP)\n**Formato:** Ad Fiel ao \"PROCEDURE Tier\" - 45 a 60 seg\n**Visual:** Estilo institucional/documental moderno. Sem música alta, apenas voz limpa e imagens de uma operação organizada funcionando ao fundo.\n\n**[Hook - 0-8s]:** Este vídeo não é para você que está \"pensando em empreender\" ou quer abrir seu primeiro negocinho para fugir do chefe. Pode pular.\n\n**[Corpo - 8-35s]:** Agora, se você já tem um negócio de food service operando, já fatura, mas sente que virou escravo da sua própria empresa... continue aqui. A Alpha Business Academy não dá palestras motivacionais. Nós instalamos sistemas de gestão. \n\nNós desenhamos a Imersão O Caminho do Dono para empresários que entenderam que precisam de processos, previsibilidade financeira e um time sólido para deixar de ser os melhores funcionários de si mesmos. É um ambiente apenas para decisores que já operam no mercado, focado exclusivamente no plano de execução dos seus próximos 90 dias.\n\n**[CTA - 35-45s]:** Nós mantemos uma curadoria rígida. Se você entende que precisa estruturar sua operação para escalar com lucro, clique em \"Saiba Mais\" e preencha o formulário de aplicação. Se for o seu momento, nossa equipe entrará em contato."
    }
];

// Helper to delay execution
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.log("Iniciando upload de 6 roteiros de vídeo para o ClickUp...");

    for (let i = 0; i < ads.length; i++) {
        const ad = ads[i];
        try {
            const taskBody = {
                name: ad.name,
                markdown_description: ad.markdown_description
            };

            console.log(`[${i + 1}/${ads.length}] Criando roteiro: ${ad.name}`);
            const res = await clickupRequest('POST', `/list/${LIST_ID}/task`, taskBody);
            console.log(`✅ Roteiro criado com sucesso! URL: ${res.data.url}`);

            // Wait 500ms between requests to avoid rate limits
            await delay(500);
        } catch (error) {
            console.error(`❌ Erro ao criar roteiro: ${ad.name}`);
            console.error(error);
        }
    }

    console.log("Upload concluído!");
}

main();
