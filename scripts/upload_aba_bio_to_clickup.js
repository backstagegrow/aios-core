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

const listId = "901325984602"; // ID provided by user earlier for ABA
const task = {
    name: "📝 Opções de Nova BIO do Instagram - Alpha Business Academy",
    markdown_description: "A partir da estratégia para atrair empresários e focar em lucro/escala, formulamos 3 opções para atualizar a Bio do Instagram:\n\n### Opção 1: Direta e Focada no Ponto de Dor (Recomendada)\n**Alpha Business Academy - ABA**\nTransformando donos exaustos em líderes que escalam. 🏛️\nSaia do operacional, estruture processos e blinde seu lucro.\n👇 Garanta sua vaga na Imersão:\n[Link]\n\n### Opção 2: Foco em Autoridade e Método\n**Alpha Business Academy - ABA**\nA estrutura que falta para o seu negócio crescer com segurança. ⚙️\n🔥 Imersão ABA: 2 dias intensos de plano prático focado em lucro e escala.\n👇 Aplique agora:\n[Link]\n\n### Opção 3: Curta e Direta ao Ponto\n**Alpha Business Academy - ABA**\nEstratégia. Processos. Lucro. Liderança. 📈\nMentoria para empresários que decidiram blindar o caixa e focar no crescimento estratégico.\n👇 Próxima Imersão:\n[Link]\n\n**Motivos da Atualização:**\n*   **Filtro:** Identifica logo de cara para quem é (empresários/donos de negócios).\n*   **Dor:** Toca na dor principal (sair do operacional e focar no estratégico/lucro).\n*   **CTA:** Direciona a atenção para o link da imersão de forma objetiva."
};

async function main() {
    console.log("Iniciando upload de task de BIO para o ClickUp...");

    try {
        const res = await clickupRequest('POST', `/list/${listId}/task`, task);
        console.log(`✅ Tarefa criada com sucesso! URL: ${res.data.url}`);
    } catch (error) {
        console.error(`❌ Erro ao criar tarefa`);
        console.error(error);
    }
}

main();
