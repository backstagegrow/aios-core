/**
 * ClickUp Task Creation Script — 2026-04-15 Meeting Tasks
 * Creates 16 tasks + subtasks across multiple lists
 */

const https = require('https');

const TOKEN = 'pk_111906470_QM1SY8YME1786FAD3T37JL5YTFYZS5C4';
const TEAM_ID = '90132645314';
const BASE = 'https://api.clickup.com/api/v2';

// Assignee IDs
const LUCAS = '248595236';
const ERICK = '111906470';
const VITORIA = '112048722';

// List IDs + their open status names
const LISTS = {
  BKS_SOCIAL: '901324771638',
  BKS_AUTO: '901325044221',
  GT_SOCIAL: '901324517019',
  GT_TRAFEGO: '901324526554',
  ABA_SOCIAL: '901325984602',
  ABA_TRAFEGO: '901325984626',
  VIABR_SOCIAL: '901324514634',
  GESTAO_REL: '901325819456',
};

const STATUS_MAP = {
  '901324771638': 'aberto',
  '901325044221': 'backlog',
  '901324517019': 'aberto',
  '901324526554': 'a fazer',
  '901325984602': 'aberto',
  '901325984626': 'a fazer',
  '901324514634': 'aberto',
  '901325819456': 'aberto',
};

// Today timestamp in ms
const TODAY = new Date();
TODAY.setHours(23, 59, 0, 0);
const TODAY_TS = TODAY.getTime();

function apiRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE + path);
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        'Authorization': TOKEN,
        'Content-Type': 'application/json',
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          reject(new Error(`Parse error: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function createTask(listId, taskData) {
  const res = await apiRequest('POST', `/list/${listId}/task`, taskData);
  return res;
}

async function createSubtask(listId, parentId, name, assigneeId) {
  return createTask(listId, {
    name,
    assignees: [parseInt(assigneeId)],
    parent: parentId,
    status: STATUS_MAP[listId] || 'aberto',
  });
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

const report = [];

async function createWithSubtasks(listId, taskData, subtasks, label) {
  try {
    // Auto-resolve status from STATUS_MAP
    if (taskData.status === 'TO DO' || !taskData.status) {
      taskData.status = STATUS_MAP[listId] || 'aberto';
    }
    console.log(`\nCreating: ${label} — ${taskData.name} [status: ${taskData.status}]`);
    const task = await createTask(listId, taskData);
    const entry = {
      label,
      name: task.name,
      id: task.id,
      list: task.list?.name || listId,
      url: task.url,
      subtasks: [],
      error: null,
    };

    for (const st of subtasks) {
      await sleep(300); // rate limit
      try {
        const sub = await createSubtask(listId, task.id, st.name, st.assignee);
        entry.subtasks.push({ name: sub.name, id: sub.id });
        console.log(`  Subtask: ${sub.name} (${sub.id})`);
      } catch (e) {
        entry.subtasks.push({ name: st.name, id: null, error: e.message });
        console.log(`  FAIL subtask: ${st.name} — ${e.message}`);
      }
    }

    report.push(entry);
    return task;
  } catch (e) {
    report.push({ label, name: taskData.name, id: null, error: e.message, subtasks: [] });
    console.log(`  FAIL: ${e.message}`);
    return null;
  }
}

async function findGestaoList() {
  try {
    const spaces = await apiRequest('GET', `/team/${TEAM_ID}/space?archived=false`);
    for (const space of spaces.spaces || []) {
      const folders = await apiRequest('GET', `/space/${space.id}/folder?archived=false`);
      for (const folder of folders.folders || []) {
        for (const list of folder.lists || []) {
          if (list.name.toLowerCase().includes('gest') && list.name.toLowerCase().includes('relat')) {
            return list.id;
          }
        }
        // Check sublists
      }
      // Check folderless lists
      const lists = await apiRequest('GET', `/space/${space.id}/list?archived=false`);
      for (const list of lists.lists || []) {
        if (list.name.toLowerCase().includes('gest') && list.name.toLowerCase().includes('relat')) {
          return list.id;
        }
      }
    }
    return null;
  } catch (e) {
    console.log(`Error finding Gestao list: ${e.message}`);
    return null;
  }
}

async function main() {
  console.log('=== ClickUp Task Creation — 2026-04-15 ===\n');

  // --- TASK 1: Playbook Espaco de Eventos ---
  await createWithSubtasks(LISTS.BKS_SOCIAL, {
    name: 'Playbook "Espaço de Eventos" — Estratégia de Divulgação',
    assignees: [parseInt(VITORIA)],
    status: STATUS_MAP[LISTS.BKS_SOCIAL],
    description: 'Playbook criado por Lucas como produto isca para atrair clientes para o Backstage Grow. Formato de entrega a definir: Live R$47 + acesso ao playbook. Arquivo base já pronto em HTML — precisa converter para PDF/Google Doc. Pensar estratégia de divulgação nas redes.',
    custom_fields: [
      { id: 'bab7ab8a-b178-4dcf-bf47-c39fe7164476', value: '9addfe3e-211b-42ea-acf2-1e606faaddde' },
      { id: '00ecc8c2-310d-4d99-a2c8-1401c8a308f9', value: 'ea379384-5c42-432e-ae58-00bfe8074e61' },
    ],
  }, [
    { name: 'Converter HTML do playbook → PDF/Google Doc', assignee: ERICK },
    { name: 'Definir formato de entrega: Live ou gravado', assignee: LUCAS },
    { name: 'Criar copy de divulgação do produto', assignee: VITORIA },
    { name: 'Criar arte/card para social mídia', assignee: ERICK },
  ], 'Task 1 — BKS Social');

  await sleep(500);

  // --- TASK 2: Backstage News ---
  await createWithSubtasks(LISTS.BKS_SOCIAL, {
    name: 'Backstage News — Retomada da iniciativa',
    assignees: [parseInt(LUCAS)],
    status: 'TO DO',
    description: 'Retomar iniciativa "Backstage News" — newsletter/blog de notícias do setor de eventos. Foi levantada com Robson, precisa ser assumida internamente. Levantar o que já foi produzido, definir formato e periodicidade, criar primeiro artigo.',
  }, [
    { name: 'Levantar material produzido com Robson sobre Backstage News', assignee: LUCAS },
    { name: 'Definir formato e periodicidade da newsletter', assignee: LUCAS },
  ], 'Task 2 — BKS Social');

  await sleep(500);

  // --- TASK 3: Push repositorio AIOS ---
  await createWithSubtasks(LISTS.BKS_AUTO, {
    name: 'Push repositório AIOS — Atualizar Lucas e Vitória',
    assignees: [parseInt(ERICK)],
    status: 'TO DO',
    priority: 2,
    description: 'Erick finalizou atualização do AIOS com 2 novos agentes ClickUp e novas automações (custom fields em todas as áreas, automação por responsável, templates). Fazer push do repositório e instruir Lucas e Vitória a fazerem update. Instrução para Lucas/Vitória: copiar link do repositório e falar "Atualize o sistema atual com as atualizações do repositório".',
  }, [], 'Task 3 — BKS Automacoes');

  await sleep(500);

  // --- TASK 4: Auditoria sistema Robson ---
  await createWithSubtasks(LISTS.BKS_AUTO, {
    name: 'Auditoria sistema Robson — Backstage/Meta',
    assignees: [parseInt(ERICK)],
    status: 'TO DO',
    description: 'Com saída do Robson, usar agentes AIOS para auditar tudo que foi construído: banco de dados, automações, meta reports API. Colocar no padrão que o agente AIOS consiga ler e operar. Prazo estimado: ~4 dias.',
  }, [
    { name: 'Auditar sistema backstage criado por Robson com agentes AIOS', assignee: ERICK },
    { name: 'Corrigir API Meta Reports — usar chave ADM account (não conta comum)', assignee: ERICK },
    { name: 'Mapear banco de dados e dependências do sistema Robson', assignee: ERICK },
    { name: 'Documentar sistema para operação interna', assignee: ERICK },
  ], 'Task 4 — BKS Automacoes');

  await sleep(500);

  // --- TASK 5: Reuniao transicao Henrique ---
  await createWithSubtasks(LISTS.BKS_AUTO, {
    name: 'Reunião transição Henrique — 15h hoje',
    assignees: [parseInt(LUCAS), parseInt(ERICK)],
    status: 'TO DO',
    priority: 1,
    due_date: TODAY_TS,
    description: 'Henrique comunicou possível saída esta manhã. Reunião às 15h para acertar transição de tráfego pago. Lucas assumirá responsabilidades de tráfego pago temporariamente. Pontos a alinhar: ferramentas, senhas, campanhas ativas, clientes sob responsabilidade.',
  }, [
    { name: 'Levantar todas as campanhas ativas sob responsabilidade de Henrique', assignee: LUCAS },
    { name: 'Documentar acesso às ferramentas de tráfego pago', assignee: ERICK },
    { name: 'Definir cronograma de transição', assignee: LUCAS },
  ], 'Task 5 — BKS Automacoes');

  await sleep(500);

  // --- TASK 6: Conteudo Dia do Trabalho GT House ---
  await createWithSubtasks(LISTS.GT_SOCIAL, {
    name: 'Conteúdo Dia do Trabalho — GT House (01/05)',
    assignees: [parseInt(VITORIA)],
    status: 'TO DO',
    description: 'Criar conteúdo comemorativo para o Dia do Trabalho (01/05). O mercado de eventos vive de freelancers — enaltecer quem faz a "infraestrutura invisível dos grandes eventos". Tem rascunho no ClickUp para ajustar copy. Lucas pode gravar vídeo na sexta se necessário.',
    custom_fields: [
      { id: 'bab7ab8a-b178-4dcf-bf47-c39fe7164476', value: '9addfe3e-211b-42ea-acf2-1e606faaddde' },
      { id: 'e7b5800d-1547-4221-acf8-beaf94212a68', value: '866f0a68-2102-4709-a0b4-f42657a7c438' },
      { id: '00ecc8c2-310d-4d99-a2c8-1401c8a308f9', value: '9ba43941-d3e1-4129-9a8f-a9bc074395a7' },
    ],
  }, [
    { name: 'Ajustar copy existente no ClickUp para Dia do Trabalho', assignee: VITORIA },
    { name: 'Criar arte final', assignee: ERICK },
  ], 'Task 6 — GT Social');

  await sleep(500);

  // --- TASK 7: Unificar V1+V2+V3 ---
  await createWithSubtasks(LISTS.GT_SOCIAL, {
    name: 'Unificar V1+V2+V3 — Vídeo Q&A Lucas para Social Media',
    assignees: [parseInt(LUCAS)],
    status: 'TO DO',
    description: 'Alan editou 3 vídeos Q&A separados (Lucas de frente para câmera). V2 tem elemento rosa para retirar (manter padrão dos 3). Unificar V1+V2+V3 em 1 vídeo para social mídia. Subir também no Palco quando finalizado.',
    custom_fields: [
      { id: 'bab7ab8a-b178-4dcf-bf47-c39fe7164476', value: '8eb367da-1037-4aaa-9a39-845910008c18' },
      { id: 'e7b5800d-1547-4221-acf8-beaf94212a68', value: '9a9a9d2e-8d5d-462f-afec-453bc936a000' },
      { id: '00ecc8c2-310d-4d99-a2c8-1401c8a308f9', value: 'e8ca18bf-39e1-4879-a036-3f0c089a2226' },
    ],
  }, [
    { name: 'Alan: retirar elemento rosa do V2 e entregar versão final', assignee: LUCAS },
    { name: 'Lucas: unificar V1+V2+V3 em 1 vídeo', assignee: LUCAS },
    { name: 'Subir vídeo unificado no social + Palco', assignee: VITORIA },
  ], 'Task 7 — GT Social');

  await sleep(500);

  // --- TASK 8: Copa do Mundo 2026 ---
  await createWithSubtasks(LISTS.GT_SOCIAL, {
    name: 'Copa do Mundo 2026 — Comunicação pacotes corporativos GT House',
    assignees: [parseInt(LUCAS), parseInt(VITORIA)],
    status: 'TO DO',
    description: 'Estratégia: NÃO "venha assistir o jogo" → SIM "pacotes exclusivos para ativação corporativa". Copy base: "Sua empresa está procurando espaço para ativação na Copa 2026? Conheça nossos pacotes exclusivos sobre medida." Dois públicos: agências (linguagem "ativação") e empresa final (mais simples/mastigado). Lucas grava vídeo na sexta.',
    custom_fields: [
      { id: 'bab7ab8a-b178-4dcf-bf47-c39fe7164476', value: '8eb367da-1037-4aaa-9a39-845910008c18' },
      { id: 'e7b5800d-1547-4221-acf8-beaf94212a68', value: '4e2572de-7b33-4419-ac61-a1a3f568258b' },
      { id: '00ecc8c2-310d-4d99-a2c8-1401c8a308f9', value: 'ea379384-5c42-432e-ae58-00bfe8074e61' },
    ],
  }, [
    { name: 'Definir copy por público: agência vs. empresa final', assignee: LUCAS },
    { name: 'Lucas: gravar vídeo Copa na sexta-feira', assignee: LUCAS },
    { name: 'Criar arte estática Copa do Mundo', assignee: ERICK },
  ], 'Task 8 — GT Social');

  await sleep(500);

  // --- TASK 9: Subir novos criativos Copa ---
  await createWithSubtasks(LISTS.GT_TRAFEGO, {
    name: 'Subir novos criativos Copa do Mundo — GT House Ads',
    assignees: [parseInt(LUCAS)],
    status: 'TO DO',
    description: '3 vídeos Copa editados por Alan. Aguardar entrega final e subir nos ads. Campanhas atuais rodando — adicionar novos criativos sem pausar campanha existente.',
    custom_fields: [
      { id: '89800538-d8c3-4cf2-9427-19e8b384f0a3', value: false },
    ],
  }, [], 'Task 9 — GT Trafego');

  await sleep(500);

  // --- TASK 10: Fechar 8 posts ABA ---
  await createWithSubtasks(LISTS.ABA_SOCIAL, {
    name: 'Fechar 8 posts do mês — ABA',
    assignees: [parseInt(VITORIA)],
    status: 'TO DO',
    priority: 2,
    description: 'Status: 2 reels prontos para agendar, 3 aguardando Lucas gravar (André confirmou que Lucas está gravando), 1 estático para Vitória finalizar. Total atual: 6. Faltam 2 para fechar 8. Usar roteiros disponíveis para criar estático/carrossel com IA para imagem de fundo se necessário.',
  }, [
    { name: 'Vitória: finalizar 1 estático (template no Notion do Erick)', assignee: VITORIA },
    { name: 'Desenvolver 1 conteúdo extra (estático ou carrossel com IA)', assignee: VITORIA },
    { name: 'Agendar os 8 posts quando todos prontos', assignee: VITORIA },
    { name: 'Aguardar 3 vídeos de Lucas (André confirmou gravação)', assignee: LUCAS },
  ], 'Task 10 — ABA Social');

  await sleep(500);

  // --- TASK 11: Depoimentos ABA ---
  await createWithSubtasks(LISTS.ABA_SOCIAL, {
    name: 'Depoimentos ABA — Estratégia de coleta urgente',
    assignees: [parseInt(LUCAS)],
    status: 'TO DO',
    description: 'Problema: apenas 3-4 depoimentos disponíveis, todos com ICP errado (perfil jovem vs. empresário 30+ do setor alimentício). André foi solicitado mas não entregou vídeo. Alternativa: pedir depoimentos por texto ou áudio como substituto imediato.',
  }, [
    { name: 'Lucas: solicitar ao André depoimentos por texto ou áudio dos alunos', assignee: LUCAS },
    { name: 'Criar template de pedido de depoimento para enviar aos alunos', assignee: VITORIA },
    { name: 'Vitória: criar carrossel de prints de depoimentos quando disponíveis', assignee: VITORIA },
  ], 'Task 11 — ABA Social');

  await sleep(500);

  // --- TASK 12: Assumir campanhas ABA ---
  await createWithSubtasks(LISTS.ABA_TRAFEGO, {
    name: 'Assumir e estruturar campanhas ABA — Lucas',
    assignees: [parseInt(LUCAS)],
    status: 'TO DO',
    priority: 1,
    description: 'Com saída de Henrique, Lucas assume tráfego pago da ABA. Estrutura: campanhas por etapa de funil. URL do site ABA disponível (Erick enviou no grupo). Formulário nativo Facebook → redirecionar para SITE (não WhatsApp direto — parte alta do funil). Criativos aprovados prontos para subir.',
    custom_fields: [
      { id: '89800538-d8c3-4cf2-9427-19e8b384f0a3', value: true },
    ],
  }, [
    { name: 'Confirmar URL do site ABA no ClickUp (Erick enviou no grupo)', assignee: LUCAS },
    { name: 'Subir artes estáticas aprovadas nas campanhas', assignee: LUCAS },
    { name: 'Subir vídeos ABA após edição final', assignee: LUCAS },
    { name: 'Estruturar campanhas: topo → site | fundo → WhatsApp', assignee: LUCAS },
    { name: 'Configurar formulário nativo Facebook → redirect site', assignee: LUCAS },
  ], 'Task 12 — ABA Trafego');

  await sleep(500);

  // --- TASK 13: Estrategia AEO/SEO Via BR ---
  await createWithSubtasks(LISTS.VIABR_SOCIAL, {
    name: 'Estratégia AEO/SEO Via BR — LinkedIn + GMB + Blog',
    assignees: [parseInt(LUCAS), parseInt(VITORIA)],
    status: 'TO DO',
    description: 'Maríla (Via BR) aprovou nova estratégia. Prioridade: LinkedIn (B2B) > Instagram (vitrine). Ações: Google Meu Negócio otimizado, reviews, blog no novo site. Comportamento de usuário: empresas pesquisam cenografia no ChatGPT — estar referenciado nas IAs é crítico. Reuniões semanais acordadas.',
    custom_fields: [
      { id: 'e7b5800d-1547-4221-acf8-beaf94212a68', value: '9a9a9d2e-8d5d-462f-afec-453bc936a000' },
      { id: '00ecc8c2-310d-4d99-a2c8-1401c8a308f9', value: 'ea379384-5c42-432e-ae58-00bfe8074e61' },
    ],
  }, [
    { name: 'Criar calendário editorial LinkedIn mensal para Via BR', assignee: VITORIA },
    { name: 'Criar template de pedido de avaliação Google para clientes Via BR', assignee: VITORIA },
    { name: 'Planejar blog: 1 artigo/mês mínimo — temas de cenografia/eventos', assignee: LUCAS },
    { name: 'Otimizar Google Meu Negócio Via BR (fotos, categorias, horários)', assignee: LUCAS },
  ], 'Task 13 — Via BR Social');

  await sleep(500);

  // --- TASKS 14-16: Gestao Empresarial Prospects ---
  console.log('\n--- Creating Gestao Empresarial prospects (list: ' + LISTS.GESTAO_REL + ') ---');
  const gestaoListId = LISTS.GESTAO_REL;

  if (gestaoListId) {
    await createWithSubtasks(gestaoListId, {
      name: 'Prospect: Rodrigo — Empresa segurança para eventos',
      assignees: [parseInt(LUCAS)],
      status: 'TO DO',
      description: 'Rodrigo tem empresa de segurança para eventos (ambulâncias, equipe de segurança). Respondeu contato de Lucas. Agendar reunião de apresentação. Mercado: segurança em eventos — nicho menos competitivo para marketing.',
    }, [], 'Task 14 — Gestao');

    await sleep(500);

    await createWithSubtasks(gestaoListId, {
      name: 'Prospect: Empresa documentação para eventos (Lucas conhece o dono)',
      assignees: [parseInt(LUCAS)],
      status: 'TO DO',
      description: 'Empresa faz documentação para realização de eventos (licenças, alvarás, etc.). Lucas conhece o dono. Dificuldade de vendas do serviço — existe dor dupla (vendedor e comprador). Entrar em contato para prospecção.',
    }, [], 'Task 15 — Gestao');

    await sleep(500);

    await createWithSubtasks(gestaoListId, {
      name: 'Prospect: Pessoa com 3 espaços de eventos em SP',
      assignees: [parseInt(LUCAS)],
      status: 'TO DO',
      description: 'Reunião já agendada. Pessoa tem 3 espaços diferentes em SP. Alto potencial — GT House como case de referência. Preparar apresentação com resultados GT House.',
    }, [], 'Task 16 — Gestao');
  } else {
    console.log('WARN: Could not find Gestao Empresarial - Relatórios list. Skipping Tasks 14-16.');
    report.push({ label: 'Tasks 14-16', name: 'Prospects Gestao', id: null, error: 'List not found via API search', subtasks: [] });
  }

  // --- FINAL REPORT ---
  console.log('\n\n========== RELATORIO FINAL ==========\n');
  let totalTasks = 0;
  let totalSubtasks = 0;
  let errors = 0;

  for (const r of report) {
    const status = r.id ? 'OK' : 'FAIL';
    console.log(`[${status}] ${r.label}: ${r.name}`);
    if (r.id) {
      console.log(`       ID: ${r.id} | Lista: ${r.list}`);
      if (r.url) console.log(`       URL: ${r.url}`);
      totalTasks++;
    } else {
      console.log(`       ERROR: ${r.error}`);
      errors++;
    }
    for (const s of r.subtasks) {
      if (s.id) {
        console.log(`       └─ ${s.name} (${s.id})`);
        totalSubtasks++;
      } else {
        console.log(`       └─ FAIL: ${s.name} — ${s.error}`);
        errors++;
      }
    }
  }

  console.log(`\n--- Summary ---`);
  console.log(`Tasks created: ${totalTasks}`);
  console.log(`Subtasks created: ${totalSubtasks}`);
  console.log(`Errors: ${errors}`);
  console.log(`Total items: ${totalTasks + totalSubtasks}`);
}

main().catch(e => {
  console.error('FATAL:', e.message);
  process.exit(1);
});
