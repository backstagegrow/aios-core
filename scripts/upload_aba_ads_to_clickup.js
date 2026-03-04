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
const LIST_ID = '901325984626';

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
        name: "📢 Copy 1: A ilusão da liberdade",
        markdown_description: "**Ângulo:** Prisão Operacional (O dono faz tudo)\n\n**[Headline]:** Você abriu um restaurante para ter liberdade, mas acabou virando o funcionário mais barato da sua própria empresa?\n\n**[Corpo]:**\nSe você é o primeiro a chegar e o último a sair, e se o seu celular não para de tocar no seu único dia de folga... você não tem uma empresa. Você tem um emprego que paga mal pela quantidade de estresse que gera. \nNa Imersão O Caminho do Dono, nós instalamos o Tripé da Excelência Empresarial para donos de food service. Chega de apagar incêndios. É hora de construir processos que funcionam sem você no balcão.\n\n**[CTA]:** Faça sua aplicação para a Imersão (Vagas Limitadas)"
    },
    {
        name: "📢 Copy 2: O gargalo é você",
        markdown_description: "**Ângulo:** Prisão Operacional (O dono faz tudo)\n\n**[Headline]:** O maior gargalo do crescimento do seu restaurante é você mesmo.\n\n**[Corpo]:**\nDói ouvir isso, mas é a verdade. Enquanto você insistir em controlar cada prato que sai da cozinha e cada centavo do caixa, sua operação nunca vai escalar. O segredo das grandes redes de food service não é talento, é ESTRUTURA.\nDias 21 e 22 de março, em São Paulo, vamos abrir as portas do método que usamos para escalar mais de 500 operações. Não é palestra motivacional, é plano de execução.\n\n**[CTA]:** Clique aqui e aplique para uma das vagas."
    },
    {
        name: "📢 Copy 3: \"Se eu não fizer, ninguém faz\"",
        markdown_description: "**Ângulo:** Prisão Operacional (O dono faz tudo)\n\n**[Headline]:** \"Se eu não estiver aqui, o negócio para.\" — Até quando você vai aceitar isso?\n\n**[Corpo]:**\nUma operação de food service que depende do dono 100% do tempo está com os dias contados. O cansaço cobra a conta. E sem energia, você não inova, não expande.\nNa Imersão O Caminho do Dono, vamos desenhar o mapa de saída do seu operacional. Você vai voltar para o seu negócio com um plano de 90 dias para delegar com segurança e focar no que importa: crescimento e lucro.\n\n**[CTA]:** Aplique agora. Processo seletivo de 3 minutos."
    },
    {
        name: "📢 Copy 4: O dinheiro que some",
        markdown_description: "**Ângulo:** Faturamento Alto x Lucro Baixo\n\n**[Headline]:** Seu restaurante fatura R$ 100k, R$ 200k, R$ 500k... mas no final do mês, onde está o dinheiro?\n\n**[Corpo]:**\nVender muito e não ver a cor do lucro é o pesadelo de muitos donos de food service. Faturamento é ego. Margem é sanidade. Sem uma DRE clara e sem controle de custos, você está apenas girando dinheiro e trabalhando de graça.\nVamos mudar esse jogo nos dias 21 e 22 de março. Dois dias intensivos para consertar o vazamento de lucro da sua operação usando as mesmas planilhas dos tubarões do mercado. \n\n**[CTA]:** Faça sua aplicação para O Caminho do Dono."
    },
    {
        name: "📢 Copy 5: Crescer quebrando",
        markdown_description: "**Ângulo:** Faturamento Alto x Lucro Baixo\n\n**[Headline]:** Crescer desorganizado custa muito mais caro do que não crescer.\n\n**[Corpo]:**\nSe você abrir uma segunda unidade hoje com a falta de processos da primeira, você vai dobrar seus problemas, não o seu lucro. A Alpha Business Academy construiu um ecossistema focado na Margem Protegida. Vamos te entregar a engenharia financeira que sustenta grandes operações para crescer sem medo de quebrar.\n\n**[CTA]:** Toque em saiba mais e aplique para a imersão."
    },
    {
        name: "📢 Copy 6: Precificação e DRE",
        markdown_description: "**Ângulo:** Faturamento Alto x Lucro Baixo\n\n**[Headline]:** Você sabe exatamente qual prato do seu cardápio está levando o seu lucro embora?\n\n**[Corpo]:**\nA grande maioria dos donos de restaurantes precifica no \"feeling\" ou copiando o concorrente da rua. O resultado? Você paga para trabalhar sem perceber em cada pedido.\nNa Imersão O Caminho do Dono, o Robert CFO vai mergulhar na saúde financeira da sua operação. Chega de surpresas no fim do mês. Trabalhe com números reais. \n\n**[CTA]:** Vagas sujeitas a aprovação. Aplique agora."
    },
    {
        name: "📢 Copy 7: A rotatividade que sangra o caixa",
        markdown_description: "**Ângulo:** Equipe e Turnover\n\n**[Headline]:** Contrata, treina, o funcionário sai depois de 3 meses. Você já cansou desse ciclo?\n\n**[Corpo]:**\nO turnover é o imposto invisível que destrói o food service. Você não consegue reter talentos porque não tem uma cultura forte nem processos claros. Pessoas de alto nível não ficam em ambientes onde tudo é urgência e desespero.\nAprenda o framework de contratação e retenção do José Ricardo (Ponto Alpha). Descubra como montar um time que entrega o padrão sem que você precise estar de bedel 24 horas por dia.\n\n**[CTA]:** Garanta sua cadeira na Imersão. Aplique aqui."
    },
    {
        name: "📢 Copy 8: Empresa refém de cozinheiro",
        markdown_description: "**Ângulo:** Equipe e Turnover\n\n**[Headline]:** Você tem medo de cobrar o seu funcionário e ele pedir demissão na sexta-feira à noite?\n\n**[Corpo]:**\nSe você é refém da sua equipe, você JÁ perdeu o controle da sua empresa de alimentação. A culpa não é do mercado que \"não tem mão de obra\". A culpa é da sua estrutura, que hoje depende de \"estrelas\" heroicas no salão ou na chapa.\nDias 21 e 22 de Março, em São Paulo. Você vai aprender a construir as três pernas: contratação por caráter, treinamento milimétrico, desligamento natural.\n\n**[CTA]:** Verifique se o seu perfil se qualifica. Aplique hoje."
    },
    {
        name: "📢 Copy 9: Como delegar sem delargar",
        markdown_description: "**Ângulo:** Equipe e Turnover\n\n**[Headline]:** \"Sempre que eu deixo na mão da equipe, sai errado ou me decepciono.\"\n\n**[Corpo]:**\nSabe por que sai errado? Porque você delarga em vez de delegar. Sem checklist, sem POP (Procedimento Operacional Padrão), a sua meta é \"o que você acha certo\" e não o que está escrito. Na Imersão O Caminho do Dono, você vai levar o mapa para blindar a sua operação das incertezas, seja num restaurante, padaria ou loja de sushi.\n\n**[CTA]:** Clique e faça sua aplicação de 3 minutos."
    },
    {
        name: "📢 Copy 10: O segredo de 500 operações",
        markdown_description: "**Ângulo:** Sistema e Método\n\n**[Headline]:** O que mais de 500 operações de food service de sucesso no Brasil descobriram antes de você?\n\n**[Corpo]:**\nA resposta: elas aboliram a figura do dono-faz-tudo. Elas operam sob ESTRUTURA. \n1. Previsibilidade nas vendas.\n2. Escala documentada.\n3. Pessoas treinadas no processo.\n4. Margem defendida a cada real gasto. \nEsse é o Tripé da Excelência Empresarial. Lucas Silva, José Ricardo e Robert CFO vão instalar essa estrutura na sua cabeça nos dias 21 e 22 de março, São Paulo.\n\n**[CTA]:** Reivindique sua vaga. Aplique agora."
    },
    {
        name: "📢 Copy 11: Não é palestra, é planejamento tático",
        markdown_description: "**Ângulo:** Sistema e Método\n\n**[Headline]:** Se você quer palco e frases motivacionais, este evento NÃO é para você.\n\n**[Corpo]:**\nA Imersão O Caminho do Dono é um ambiente de negócios. Chega de blá-blá-blá. Vamos discutir o mercado real. Falar de DRE, analisar gargalos reais da cozinha ao salão, desenhar fluxo de caixa ideal. Você vai sair de lá no domingo com um caderninho sujo de tinta contendo exatamente os passos dos seus próximos 90 dias.\n\n**[CTA]:** Aplique agora e junte-se a donos sérios."
    },
    {
        name: "📢 Copy 12: Muito esforço, pouca inteligência",
        markdown_description: "**Ângulo:** Sistema e Método\n\n**[Headline]:** Acorde cedinho, trabalhe muito, durma cansado e tenha os mesmos resultados de dez anos atrás.\n\n**[Corpo]:**\nA romantização do esforço só faz sentido quando ele se paga rápido. Senão, se torna castigo. Para saltar para os patamares em que operadoras lucram, estruturam e lideram, você precisa aplicar inteligência de negócios. É isso que vamos entregar em dois dias completos focados 100% no seu mercado alimentício.\n\n**[CTA]:** Iniciar minha aplicação."
    },
    {
        name: "📢 Copy 13: O filtro invisível",
        markdown_description: "**Ângulo:** Exclusividade e Qualificação\n\n**[Headline]:** AVISO: A Imersão 'O Caminho do Dono' exige qualificação prévia. Não é porque você quer pagar, que vai entrar.\n\n**[Corpo]:**\nNós desenhamos um evento exclusivo para donos de restaurantes, cafeterias, hamburguerias e franquias que JÁ têm equipe, JÁ estão com a barriga no balcão e JÁ enxergam a necessidade de escalar para se blindar.\nSe o seu negócio ainda é só uma ideia de bar, isso não vai funcionar para você agora. Mas se você já sangra na praça, essa imersão vai curar as feridas e alavancar seus números.\n\n**[CTA]:** Clique aqui para ver se a sua operação passa no crivo."
    },
    {
        name: "📢 Copy 14: Liberdade de tempo é tempo comprado",
        markdown_description: "**Ângulo:** Exclusividade e Qualificação\n\n**[Headline]:** \"Puxa, eu adoraria, mas eu não consigo sair da minha hamburgueria dois dias...\"\n\n**[Corpo]:**\nSe o seu negócio para sem você, então você não é um dono. É um escravo dele.\nA recusa de investir tempo no \"trabalhar NA empresa\" e continuar apenas \"trabalhando PELA empresa\", vai manter seu faturamento nesse teto invisível nos próximos três anos. \nQual é o custo de continuar assim? Vá para São Paulo em Março. Você nunca mais será a mesma pessoa de negócios.\n\n**[CTA]:** As aplicações estão abertas (por pouco tempo)."
    },
    {
        name: "📢 Copy 15: O poder da mesa de decisão",
        markdown_description: "**Ângulo:** Exclusividade e Qualificação\n\n**[Headline]:** Até que ponto você vai tentar acertar a rota sozinho?\n\n**[Corpo]:**\nA solidão do dono de food service é perigosa. Você precisa decidir tudo e não tem ninguem da área, que fale a mesma língua que as contas exigem, para debater.\nEm O Caminho do Dono, você vai estar numa sala apenas com gente do mercado, liderada pelos especialistas que instalaram a base de uma rede de centenas de quiosques da Monster Dog e Ponto Alpha Café. Fazer network é lucro.\n\n**[CTA]:** Inicie seu processo seletivo aqui."
    }
];

// Helper to delay execution
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.log("Iniciando upload de 15 tarefas (Copys - Alpha Business Academy) para o ClickUp...");

    for (let i = 0; i < ads.length; i++) {
        const ad = ads[i];
        try {
            const taskBody = {
                name: ad.name,
                markdown_description: ad.markdown_description
            };

            console.log(`[${i + 1}/${ads.length}] Criando tarefa: ${ad.name}`);
            const res = await clickupRequest('POST', `/list/${LIST_ID}/task`, taskBody);
            console.log(`✅ Tarefa criada com sucesso! URL: ${res.data.url}`);

            // Wait 500ms between requests to avoid rate limits
            await delay(500);
        } catch (error) {
            console.error(`❌ Erro ao criar tarefa: ${ad.name}`);
            console.error(error);
        }
    }

    console.log("Upload concluído!");
}

main();
