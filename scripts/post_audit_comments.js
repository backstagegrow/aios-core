const https = require('https');

const API_KEY = 'pk_111906470_L5VDUBKWMGS3CGWAFMKE6TJ5QL3154JA';

const ADVISORIES = {
  '86afhe4ej': "🚀 **AUDITORIA COPY ELITE:** A headline é forte, mas o corpo está muito 'checklist'. Vamos agitar mais a dor: 'Agenda cheia sem sistema é uma prisão lucrativa'. Sugestão: Substitua a lista de serviços por 'Instalamos o Mecanismo que separa o dono da execução'.",
  '86afhc1x7': "🔥 **AUDITORIA COPY ELITE:** Conceito 10/10. Para escalar a conversão, mude o CTA: 'Comenta ESTRUTURA se você quer ver os bastidores do nosso dashboard de guerra no WhatsApp'. Isso gera curiosidade real.",
  '86af8jk15': "🎯 **AUDITORIA COPY ELITE:** O ponto alto aqui é o 'Autoengano'. Use isso no Hook. Headline sugerida: 'Por que o seu marketing isolado é a sua maior perda de tempo em 2026?'. Fuja do óbvio.",
  '86aequcf4': "🏗️ **AUDITORIA COPY ELITE (sp HAUS):** No desafio da escada, foque no 'DNA de Inovação'. Em vez de 'Não deixe de contar', use: 'Comenta ARQUITETURA se seu espaço também tem um desafio que ninguém resolveu'.",
  '86af471uv': "📢 **AUDITORIA COPY ELITE (Via BR):** Advertorial precisa de tom de notícia. Headline sugerida: 'ESTUDO: Cenografia estratégica aumenta em 40% a retenção em estandes corporativos'. Use autoridade técnica.",
};

function clickupRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.clickup.com',
      port: 443,
      path: `/api/v2${path}`,
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
        console.log(`[DEBUG] ${method} ${path} -> Status ${res.statusCode}`);
        resolve({ status: res.statusCode });
      });
    });

    req.on('error', (e) => reject(e));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log('Iniciando injeção de feedbacks do Squad de Copy...');
  for (const [taskId, comment] of Object.entries(ADVISORIES)) {
    await clickupRequest('POST', `/task/${taskId}/comment`, {
      comment_text: comment,
      notify_all: true,
    });
  }
  console.log('Auditoria enviada para o ClickUp!');
}

run();
