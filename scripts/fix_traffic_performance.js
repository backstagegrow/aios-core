const https = require('https');

const API_KEY = 'pk_111906470_L5VDUBKWMGS3CGWAFMKE6TJ5QL3154JA';

const TRAFFIC_UPDATES = {
  '86af8kzpz': { // Indicação não é Estratégia
    'name': '🚀 BKS | E1 | Estático | O Fim da Sorte (Indicação)',
    'content': '# AUDITORIA PERFORMANCE VANGUARD ✅\n\n**HEADLINE:** "Empresário de Eventos: Sua previsibilidade de caixa não pode depender de indicação espontânea."\n\n**TEXTO DO ANÚNCIO:**\n\nEmpresa de eventos que vive de indicação não tem dono, tem torcida. Se você não controla seu fluxo de leads qualificados, você não tem uma empresa, tem um hobby arriscado.\n\nNa BKS Grow, nós instalamos o **Pipeline B2B** que o mercado de eventos ignora. Saia do amadorismo das indicações e entre na era do crescimento previsível.\n\n**CTA:** Clique em Saiba Mais e veja como estruturar sua máquina de aquisição.',
  },
  '86af8kzr2': { // O Ralo do WhatsApp
    'name': '🔥 BKS | E2 | Estático | O Ralo do WhatsApp (Venda Silenciosa)',
    'content': '# AUDITORIA PERFORMANCE VANGUARD ✅\n\n**HEADLINE:** "80% dos seus leads morrem no limbo do WhatsApp sem atendimento estratégico."\n\n**TEXTO DO ANÚNCIO:**\n\nEnquanto seu vendedor está sobrecarregado ou seu time está em montagem, seu lucro está escorrendo pelo ralo do WhatsApp. \n\nO caos do atendimento é o maior inimigo do seu ROI. Nós não vendemos "automação de chat", nós entregamos **Venda Silenciosa**. O sistema qualifica, filtra e prepara o fechamento 24h por dia.\n\n**CTA:** Digite "FLUXO" e veja o sistema rodando agora.',
  },
  '86af8kzr8': { // Além dos Posts Bonitos
    'name': '🧥 BKS | E3 | Estático | Além dos Posts Bonitos (Padrão Elite)',
    'content': '# AUDITORIA PERFORMANCE VANGUARD ✅\n\n**HEADLINE:** "Post bonito gera like. Processo estratégico gera contrato assinado."\n\n**TEXTO DO ANÚNCIO:**\n\nVocê não precisa de mais um feed \'estético\' que ninguém converte. Você precisa de **Direção de Negócio**.\n\nO mercado de eventos corporativos está saturado de \'agências de postagem\'. A BKS Grow é a única especializada em arquitetar o seu crescimento através de dados, IA e processos comerciais reais.\n\n**CTA:** Saiba por que os maiores players do mercado confiam na BKS.',
  },
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
  console.log('Reescrevendo tarefas de tráfego para Alta Performance...');
  for (const [taskId, update] of Object.entries(TRAFFIC_UPDATES)) {
    await clickupRequest('PUT', `/task/${taskId}`, {
      name: update.name,
      markdown_description: update.content,
      priority: 1, // High priority for updated items
    });
  }
  console.log('Tráfego Andromedizado com sucesso! 🚀');
}

run();
