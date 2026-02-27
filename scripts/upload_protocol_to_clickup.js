const https = require('https');

const API_KEY = 'pk_111906470_L5VDUBKWMGS3CGWAFMKE6TJ5QL3154JA';
const SPACE_ID = '901311391143'; // Gestão Empresárial

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

const protocolContent = `
# 🛠️ Protocolo Interno: Onboarding "Zero Atrito" - Backstage Grow

Este documento define o novo fluxo de onboarding estratégico da Grow, integrando Inteligência Artificial (Antigravity) e ClickUp para escala.

---

### 📥 1. O Gatilho de Entrada (Briefing)
Sempre que um novo cliente entrar na operação, o gestor deve fornecer à IA (Antigravity) os seguintes dados:
1. **Link do Notion:** Briefing ou planejamento atual.
2. **Link do Site Oficial:** Para análise de autoridade.
3. **Link do Instagram:** Para análise de tom de voz e estética.
4. **Meta 90 Dias:** Objetivo central do trimestre.

---

### ⚙️ 2. O Processamento por IA
A IA realizará as seguintes tarefas automaticamente:
- **Análise DNA:** Extração de diferenciais competitivos.
- **Criação da Memória Local:** Geração do arquivo \`memory_strategy.md\` no repositório.
- **Prompt Mestre:** Geração do Copy Mestre (Eu ajudo... a... porque...) e Personas 4D.
- **Setup ClickUp:** Criação da Lista e preenchimento estratégico.

---

### 🎯 3. O Resultado Estruturado (ClickUp)
O time terá acesso imediato a:
- **Descrição da Lista:** Resumo tático sempre visível.
- **Tarefa Master:** Manual estratégico completo formatado em Markdown.
- **Documento Oficial:** Link para o Doc de acompanhamento (Backup).

---

### 🛡️ Visão da Diretoria
> **"Nosso objetivo é produtização total. O onboarding deve ser um sistema, não um serviço artesanal."**
`;

async function run() {
  try {
    console.log("Criando lista '📦 Processos e Onboarding'...");
    const list = await clickupPost('POST', `/space/${SPACE_ID}/list`, {
      name: '📦 Processos e Onboarding',
      content: 'Diretrizes e protocolos oficiais da Backstage Grow.',
    });

    if (list.id) {
      console.log(`Lista criada: ${list.id}. Criando tarefa de protocolo...`);
      const task = await clickupPost('POST', `/list/${list.id}/task`, {
        name: '📜 PROTOCOLO: Onboarding Zero Atrito (IA)',
        markdown_description: protocolContent,
        priority: 1,
        tags: ['processos', 'ia', 'onboarding'],
      });
      console.log(`Tarefa criada com sucesso: ${task.url}`);
    } else {
      console.error('Erro ao criar lista:', list);
    }
  } catch (e) {
    console.error(e.message);
  }
}

run();
