/**
 * fix-gaps-audit.cjs
 * Corrige os gaps identificados na auditoria:
 * 1. Renomeia "Alpha Bussines" → "ABA Design Web"
 * 2. Custom fields nas 3 listas AIOS
 * 3. Campos + templates nas 3 listas de Onboarding
 * 4. Templates em Contratos, Receitas, Despesas
 */

const { clickupRequest } = require('./lib/clickup-env.cjs');
const { log, logError } = require('./lib/clickup-logger.cjs');
const { sleep } = require('./lib/throttle.cjs');

let ok = 0, fail = 0;

async function addField(listId, field) {
  try {
    await clickupRequest('POST', `/list/${listId}/field`, field);
    console.log(`  OK campo: ${field.name}`);
    log('field.created', { listId, name: field.name, type: field.type });
    ok++;
  } catch (e) {
    // 409/400 = já existe — não é falha real
    if (e.status === 409 || (e.message && e.message.includes('already exists'))) {
      console.log(`  ↩️  Campo já existe: ${field.name} — pulando`);
    } else {
      console.error(`  ERR campo ${field.name}: ${e.message}`);
      logError('field.created', { listId, name: field.name, error: e.message });
      fail++;
    }
  }
  await sleep(100);
}

async function createTask(listId, taskDef) {
  try {
    const info = await clickupRequest('GET', `/list/${listId}`);
    const status = info.statuses?.[0]?.status ?? 'to do';
    const task = await clickupRequest('POST', `/list/${listId}/task`, { ...taskDef, status });
    console.log(`  OK task: ${task.name}`);
    log('task.created', { listId, taskId: task.id, name: task.name });
    ok++;
  } catch (e) {
    console.error(`  ERR task ${taskDef.name}: ${e.message}`);
    logError('task.created', { listId, name: taskDef.name, error: e.message });
    fail++;
  }
  await sleep(150);
}

// ─── 1. Renomear Alpha Bussines ───────────────────────────────────────────────

async function fixTypo() {
  console.log('\n=== 1. RENOMEAR Alpha Bussines → ABA Design Web ===');
  try {
    await clickupRequest('PUT', '/list/901326596794', { name: 'ABA Design Web' });
    console.log('  OK renomeado');
    ok++;
  } catch (e) {
    console.error(`  ERR: ${e.message}`);
    fail++;
  }
}

// ─── 2. AIOS Custom Fields ────────────────────────────────────────────────────

async function setupAiosFields() {
  console.log('\n=== 2. AIOS CUSTOM FIELDS ===');

  // Clones & Agentes
  console.log('\n  Clones & Agentes (901326820623)');
  await addField('901326820623', {
    name: 'Tipo',
    type: 'drop_down',
    type_config: { options: [
      { name: 'Clone',  color: '#9333ea' },
      { name: 'Agente', color: '#0091ff' },
    ]},
  });
  await addField('901326820623', { name: 'Dominio', type: 'text', type_config: {} });
  await addField('901326820623', { name: 'Ativacao', type: 'text', type_config: {} });

  // Comandos & Prompts
  console.log('\n  Comandos & Prompts (901326820624)');
  await addField('901326820624', {
    name: 'Categoria',
    type: 'drop_down',
    type_config: { options: [
      { name: 'Desenvolvimento', color: '#0091ff' },
      { name: 'Analise',         color: '#30a46c' },
      { name: 'Copy',            color: '#e93d82' },
      { name: 'Design',          color: '#f76808' },
      { name: 'Gestao',          color: '#3e63dd' },
      { name: 'Utilitario',      color: '#888'    },
    ]},
  });
  await addField('901326820624', { name: 'Agente', type: 'text', type_config: {} });

  // Roadmap AIOS
  console.log('\n  Roadmap AIOS (901326820625)');
  await addField('901326820625', {
    name: 'Fase',
    type: 'drop_down',
    type_config: { options: [
      { name: 'Q2 2026', color: '#30a46c' },
      { name: 'Q3 2026', color: '#3e63dd' },
      { name: 'Q4 2026', color: '#9333ea' },
      { name: 'Backlog',  color: '#888'   },
    ]},
  });
  await addField('901326820625', {
    name: 'Prioridade Tecnica',
    type: 'drop_down',
    type_config: { options: [
      { name: 'Critico', color: '#e93d82' },
      { name: 'Alto',    color: '#f76808' },
      { name: 'Medio',   color: '#3e63dd' },
      { name: 'Baixo',   color: '#888'   },
    ]},
  });
}

// ─── 3. Onboarding ────────────────────────────────────────────────────────────

const ONBOARDING_LISTS = [
  { name: 'Via BR Cenografia', id: '901324526597' },
  { name: 'GT House',          id: '901324526598' },
  { name: 'Imersao ABA',       id: '901325984637' },
];

const ONBOARDING_FIELDS = [
  {
    name: 'Fase',
    type: 'drop_down',
    type_config: { options: [
      { name: 'Briefing',      color: '#f76808' },
      { name: 'Acessos',       color: '#3e63dd' },
      { name: 'Configuracao',  color: '#9333ea' },
      { name: 'Treinamento',   color: '#12a594' },
      { name: 'Go Live',       color: '#30a46c' },
    ]},
  },
  { name: 'Responsavel Cliente', type: 'text', type_config: {} },
  { name: 'Link Drive',          type: 'url',  type_config: {} },
];

const ONBOARDING_TEMPLATE = {
  name: '[TEMPLATE] Onboarding Cliente',
  description: [
    '## Onboarding — Checklist Completo',
    '',
    '### Briefing',
    '- [ ] Reuniao de kick-off realizada',
    '- [ ] Objetivos e metas definidos',
    '- [ ] Contrato assinado',
    '- [ ] Dados do cliente coletados (CNPJ, responsavel, contato)',
    '',
    '### Acessos',
    '- [ ] Acesso ao Meta Business Manager',
    '- [ ] Acesso ao Google Ads (se aplicavel)',
    '- [ ] Acesso ao site/hospedagem (se aplicavel)',
    '- [ ] Pasta compartilhada no Google Drive criada',
    '- [ ] Cliente adicionado ao ClickUp',
    '',
    '### Configuracao',
    '- [ ] Pixel Meta instalado e testado',
    '- [ ] Google Analytics configurado',
    '- [ ] BackstageFY configurado para o cliente',
    '- [ ] Listas do ClickUp configuradas',
    '',
    '### Treinamento',
    '- [ ] Cliente treinado no ClickUp (aprovacoes)',
    '- [ ] Cliente treinado no BackstageFY (se aplicavel)',
    '- [ ] Processo de aprovacao de conteudo explicado',
    '',
    '### Go Live',
    '- [ ] Primeiro conteudo publicado',
    '- [ ] Primeira campanha no ar (se aplicavel)',
    '- [ ] Relatorio de inicio enviado',
    '- [ ] Reuniao de alinhamento mensal agendada',
  ].join('\n'),
};

async function setupOnboarding() {
  console.log('\n=== 3. ONBOARDING — CAMPOS + TEMPLATES ===');
  for (const list of ONBOARDING_LISTS) {
    console.log(`\n  ${list.name}`);
    for (const field of ONBOARDING_FIELDS) {
      await addField(list.id, field);
    }
    await createTask(list.id, ONBOARDING_TEMPLATE);
  }
}

// ─── 4. Templates Financeiro ──────────────────────────────────────────────────

async function setupFinanceiroTemplates() {
  console.log('\n=== 4. TEMPLATES — CONTRATOS / RECEITAS / DESPESAS ===');

  // Busca lista Receitas no folder Financeiro
  const folder = await clickupRequest('GET', '/folder/901316467965');
  const receitas = folder.lists?.find(l => l.name.toLowerCase().includes('receita'));
  const despesas = folder.lists?.find(l => l.name.toLowerCase().includes('despesa'));

  // Contratos
  console.log('\n  Contratos (901324518015)');
  await createTask('901324518015', {
    name: '[TEMPLATE] Contrato Ativo',
    description: [
      '## Contrato — Checklist de Gestao',
      '',
      '### Inicio',
      '- [ ] Contrato assinado pelas duas partes',
      '- [ ] Data de inicio registrada no campo "Inicio"',
      '- [ ] Data de renovacao configurada no campo "Renovacao"',
      '- [ ] Valor mensal registrado',
      '- [ ] Link do contrato adicionado no campo "Link Contrato"',
      '',
      '### Manutencao',
      '- [ ] Servicos sendo entregues conforme contrato',
      '- [ ] Reunioes mensais realizadas',
      '',
      '### Renovacao (30 dias antes)',
      '- [ ] Proposta de renovacao enviada',
      '- [ ] Negociacao concluida',
      '- [ ] Novo contrato assinado ou encerramento formalizado',
    ].join('\n'),
  });

  // Receitas
  if (receitas) {
    console.log(`\n  Receitas (${receitas.id})`);
    await createTask(receitas.id, {
      name: '[TEMPLATE] Receita Mensal',
      description: [
        '## Receita — Registro Mensal',
        '',
        '- [ ] Valor registrado no campo "Valor (R$)"',
        '- [ ] Data de recebimento registrada',
        '- [ ] Nota fiscal emitida',
        '- [ ] Lancamento confirmado no financeiro',
      ].join('\n'),
    });
  }

  // Despesas
  if (despesas) {
    console.log(`\n  Despesas (${despesas.id})`);
    await createTask(despesas.id, {
      name: '[TEMPLATE] Despesa Recorrente',
      description: [
        '## Despesa — Registro',
        '',
        '- [ ] Categoria definida (campo "Categoria")',
        '- [ ] Valor registrado no campo "Valor (R$)"',
        '- [ ] Data de vencimento registrada',
        '- [ ] Comprovante anexado',
        '- [ ] Pago e confirmado',
      ].join('\n'),
    });
  } else {
    // fallback com ID conhecido
    console.log('\n  Despesas (901326820533)');
    await createTask('901326820533', {
      name: '[TEMPLATE] Despesa Recorrente',
      description: [
        '## Despesa — Registro',
        '',
        '- [ ] Categoria definida (campo "Categoria")',
        '- [ ] Valor registrado no campo "Valor (R$)"',
        '- [ ] Data de vencimento registrada',
        '- [ ] Comprovante anexado',
        '- [ ] Pago e confirmado',
      ].join('\n'),
    });
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  await fixTypo();
  await setupAiosFields();
  await setupOnboarding();
  await setupFinanceiroTemplates();
  console.log(`\n=== Concluido: ${ok} OK, ${fail} falhas ===`);
}

run().catch(console.error);
