const https = require('https');
const fs = require('fs');

const API_KEY = 'pk_111906470_L5VDUBKWMGS3CGWAFMKE6TJ5QL3154JA';
const LIST_ID = '901325910804'; // Lista de Processos e Onboarding criada no step anterior

function clickupPost(method, path, body) {
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
        try { resolve(JSON.parse(data)); } catch (e) { resolve(data); }
      });
    });

    req.on('error', (e) => reject(e));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

const salesScript = `
# 📞 SCRIPT DE VENDAS MASTER: WhatsApp Elite (BKS Grow)

Este script deve ser usado para leads que chegam via anúncios ou social media. O objetivo é **QUALIFICAR** rápido e gerar **AUTORIDADE**.

---

### 1️⃣ Fase: Acolhimento e Sinal de Filtro
**Time:** "Oi [Nome]! Aqui é o [Seu Nome] da Backstage Grow. Vi seu interesse em estruturar seu crescimento. Para eu te direcionar para o estrategista certo, me conta uma coisa rápida: Qual é o seu principal gargalo hoje: **Atrair leads qualificados** ou **Organizar o processo comercial**?"

---

### 2️⃣ Fase: O Diagnóstico (Gerando Valor)
**Se o lead responder, você usa o Hook BKS:**
"Entendi perfeitamente. Muita gente no mercado de eventos foca no post bonito, mas o que trava o lucro é o **Backstage caótico**. Aqui na Grow, nós não fazemos apenas marketing; nós instalamos um **sistema de previsibilidade**."

---

### 3️⃣ Fase: A Pergunta de Ouro (Filtro 4D)
"Hoje, quanto da sua agenda depende de indicação e quanto vem de um canal que você controla? (Anúncios/Google/Processo ativo)"

---

### 4️⃣ Fase: O Fechamento para Call de Análise
"Pelo que você me disse, nossa consultoria estratégica pode poupar uns 6 meses de erro no seu operacional. Tenho uma janela com nosso Diretor Estratégico na **[Dia]** às **[Hora]** para fazermos um diagnóstico do seu pipeline. Faz sentido para você?"
`;

async function run() {
  try {
    console.log('Subindo Script de Vendas Master para o ClickUp...');
    const task = await clickupPost('POST', `/list/${LIST_ID}/task`, {
      name: '📞 SCRIPT COMERCIAL: WhatsApp Elite (BKS)',
      markdown_description: salesScript,
      priority: 1,
      tags: ['vendas', 'processos', 'script'],
    });
    console.log(`Script de Vendas ativado: ${task.url}`);
  } catch (e) {
    console.error(e.message);
  }
}

run();
