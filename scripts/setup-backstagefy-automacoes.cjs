/**
 * setup-backstagefy-automacoes.cjs
 *
 * 1. Arquiva 3 tasks de setup concluídas no Grow
 * 2. Adiciona custom fields nas 3 listas de cliente (Via BR, GT, Grow)
 * 3. Adiciona custom fields na lista BackstageFY Dev
 * 4. Cria templates de automação nas listas de cliente
 */

const { clickupRequest } = require('./lib/clickup-env.cjs');

const CLIENT_LISTS = [
  { name: 'Via BR',  id: '901325044224' },
  { name: 'GT House',id: '901325044211' },
  { name: 'Grow',    id: '901325044221' },
];

const BACKSTAGEFY_DEV_LIST = '901325828552';

// ─── 1. Arquivar tasks de setup concluídas (Grow) ─────────────────────────────

async function archiveSetupTasks() {
  console.log('\n━━━ ARQUIVANDO TASKS DE SETUP (Grow) ━━━');
  const toArchive = [
    { id: '86af0vd86', name: 'Fazer Gmail do Dev' },
    { id: '86af0vcwg', name: 'Fazer conta GitHub' },
    { id: '86af0vche', name: 'Fazer conta SupaBase' },
  ];
  for (const t of toArchive) {
    try {
      await clickupRequest('PUT', `/task/${t.id}`, { archived: true });
      console.log('  ✅ Arquivada: ' + t.name);
    } catch (e) {
      console.error('  ❌ ' + t.name + ': ' + e.message);
    }
  }
}

// ─── 2. Custom fields — listas de cliente ─────────────────────────────────────

const CLIENT_FIELDS = [
  {
    name: '🔧 Tipo de Automação',
    type: 'drop_down',
    type_config: {
      options: [
        { name: 'CRM / Pipeline',          color: '#3e63dd' },
        { name: 'WhatsApp Bot',             color: '#30a46c' },
        { name: 'Funil de Vendas',          color: '#9333ea' },
        { name: 'Blog / Conteúdo',          color: '#f76808' },
        { name: 'Ads / Marketing',          color: '#e93d82' },
        { name: 'Relatório Automático',     color: '#12a594' },
        { name: 'Integração de Sistemas',   color: '#888' },
        { name: 'IA / Agente',              color: '#0091ff' },
      ],
    },
  },
  {
    name: '🟢 Ambiente',
    type: 'drop_down',
    type_config: {
      options: [
        { name: 'Desenvolvimento', color: '#f76808' },
        { name: 'Staging',         color: '#3e63dd' },
        { name: 'Produção',        color: '#30a46c' },
      ],
    },
  },
  {
    name: '🔗 Link da Automação',
    type: 'url',
    type_config: {},
  },
  {
    name: '📝 Notas Técnicas',
    type: 'text',
    type_config: {},
  },
];

async function setupClientFields() {
  console.log('\n━━━ CAMPOS — LISTAS DE CLIENTE ━━━');
  for (const list of CLIENT_LISTS) {
    console.log('\n  📁 ' + list.name);
    for (const f of CLIENT_FIELDS) {
      try {
        await clickupRequest('POST', `/list/${list.id}/field`, f);
        console.log('    ✅ ' + f.name);
      } catch (e) {
        console.error('    ❌ ' + f.name + ': ' + e.message);
      }
    }
  }
}

// ─── 3. Custom fields — BackstageFY Dev ───────────────────────────────────────

const DEV_FIELDS = [
  {
    name: '🧩 Módulo',
    type: 'drop_down',
    type_config: {
      options: [
        { name: 'CRM / Pipeline',       color: '#3e63dd' },
        { name: 'WhatsApp',             color: '#30a46c' },
        { name: 'Base de Conhecimento', color: '#9333ea' },
        { name: 'Funil de Vendas',      color: '#f76808' },
        { name: 'Agenda',               color: '#12a594' },
        { name: 'Blog / Conteúdo',      color: '#e93d82' },
        { name: 'Infra / Setup',        color: '#888' },
        { name: 'IA / Agente',          color: '#0091ff' },
      ],
    },
  },
  {
    name: '🔗 Documentação',
    type: 'url',
    type_config: {},
  },
  {
    name: '⚠️ Bloqueio',
    type: 'text',
    type_config: {},
  },
];

async function setupDevFields() {
  console.log('\n━━━ CAMPOS — BACKSTAGEFY DEV ━━━');
  for (const f of DEV_FIELDS) {
    try {
      await clickupRequest('POST', `/list/${BACKSTAGEFY_DEV_LIST}/field`, f);
      console.log('  ✅ ' + f.name);
    } catch (e) {
      console.error('  ❌ ' + f.name + ': ' + e.message);
    }
  }
}

// ─── 4. Templates por lista de cliente ────────────────────────────────────────

const AUTOMATION_TEMPLATES = [
  {
    name: '[TEMPLATE] WhatsApp Bot',
    description: [
      '## Automação — WhatsApp Bot',
      '',
      '### Briefing',
      '- [ ] Definir objetivo do bot (atendimento, qualificação, agendamento, vendas)',
      '- [ ] Mapear fluxo de conversa (gatilhos, respostas, fallbacks)',
      '- [ ] Definir tom de voz e persona do bot',
      '',
      '### Desenvolvimento',
      '- [ ] Configurar agente de IA no BackstageFY',
      '- [ ] Conectar número de WhatsApp',
      '- [ ] Alimentar base de conhecimento (FAQs, produtos, serviços)',
      '- [ ] Montar funil de qualificação de leads',
      '- [ ] Configurar integração com CRM/Pipeline',
      '',
      '### Testes',
      '- [ ] Testar fluxo completo em staging',
      '- [ ] Testar mensagens fora do escopo (fallback funciona?)',
      '- [ ] Revisar tom e respostas com cliente',
      '',
      '### Go Live',
      '- [ ] Aprovação do cliente',
      '- [ ] Ativar em produção',
      '- [ ] Monitorar primeiros 7 dias',
      '- [ ] Documentar link e credenciais',
    ].join('\n'),
  },
  {
    name: '[TEMPLATE] CRM / Pipeline',
    description: [
      '## Automação — CRM / Pipeline',
      '',
      '### Briefing',
      '- [ ] Mapear etapas do processo comercial do cliente',
      '- [ ] Definir campos e informações de cada lead',
      '- [ ] Identificar integrações necessárias (WhatsApp, email, formulário)',
      '',
      '### Configuração',
      '- [ ] Criar estágios do pipeline no BackstageFY',
      '- [ ] Configurar campos personalizados por lead',
      '- [ ] Configurar automações de movimentação (triggers)',
      '- [ ] Integrar com fonte de entrada de leads (formulário, WhatsApp, ads)',
      '',
      '### Testes',
      '- [ ] Simular entrada de lead e percurso completo no funil',
      '- [ ] Verificar notificações e alertas',
      '- [ ] Revisar com cliente',
      '',
      '### Go Live',
      '- [ ] Aprovação do cliente',
      '- [ ] Treinar equipe do cliente no uso',
      '- [ ] Ativar em produção e documentar',
    ].join('\n'),
  },
  {
    name: '[TEMPLATE] Relatório Automático',
    description: [
      '## Automação — Relatório Automático',
      '',
      '### Briefing',
      '- [ ] Definir quais métricas devem constar no relatório',
      '- [ ] Definir frequência de envio (semanal / quinzenal / mensal)',
      '- [ ] Definir destinatários (cliente, sócios, time)',
      '',
      '### Desenvolvimento',
      '- [ ] Conectar fontes de dados (Meta Ads, GA, ClickUp, BackstageFY)',
      '- [ ] Montar template do relatório',
      '- [ ] Configurar automação de geração e envio',
      '',
      '### Testes',
      '- [ ] Gerar relatório de teste com dados reais',
      '- [ ] Revisar formatação e clareza das métricas',
      '- [ ] Aprovar com cliente',
      '',
      '### Go Live',
      '- [ ] Ativar envio automático',
      '- [ ] Documentar configuração',
    ].join('\n'),
  },
  {
    name: '[TEMPLATE] Integração de Sistemas',
    description: [
      '## Automação — Integração de Sistemas',
      '',
      '### Briefing',
      '- [ ] Identificar sistemas a integrar (ex: formulário → CRM → WhatsApp)',
      '- [ ] Mapear fluxo de dados entre sistemas',
      '- [ ] Definir ferramenta de integração (Make, Zapier, n8n, API direta)',
      '',
      '### Desenvolvimento',
      '- [ ] Configurar conexão entre sistemas',
      '- [ ] Mapear campos e transformações de dados',
      '- [ ] Configurar tratamento de erros e fallbacks',
      '',
      '### Testes',
      '- [ ] Testar fluxo completo end-to-end',
      '- [ ] Verificar consistência dos dados transferidos',
      '- [ ] Testar cenários de erro',
      '',
      '### Go Live',
      '- [ ] Aprovação do cliente',
      '- [ ] Ativar em produção',
      '- [ ] Documentar e monitorar nas primeiras 48h',
    ].join('\n'),
  },
];

async function createClientTemplates() {
  console.log('\n━━━ TEMPLATES — LISTAS DE CLIENTE ━━━');
  for (const list of CLIENT_LISTS) {
    console.log('\n  📁 ' + list.name);
    for (const tmpl of AUTOMATION_TEMPLATES) {
      try {
        const t = await clickupRequest('POST', `/list/${list.id}/task`, {
          name: tmpl.name,
          description: tmpl.description,
          status: 'aberto',
        });
        console.log('    ✅ ' + t.name + ' [' + t.id + ']');
      } catch (e) {
        console.error('    ❌ ' + tmpl.name + ': ' + e.message);
      }
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  await archiveSetupTasks();
  await setupClientFields();
  await setupDevFields();
  await createClientTemplates();

  console.log('\n━━━ Concluído ━━━');
  console.log('\n⚠️  Statuses via UI (todas as listas):');
  console.log('   Cliente: BACKLOG → EM DESENVOLVIMENTO → EM TESTE → APROVAÇÃO → EM PRODUÇÃO → PAUSADO');
  console.log('   BackstageFY Dev: BACKLOG → EM ANDAMENTO → EM REVISÃO → CONCLUÍDO → BLOQUEADO');
}

run().catch(console.error);
