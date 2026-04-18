/**
 * populate-aios-space.cjs — popula as 3 listas AIOS com status correto
 */

const { clickupRequest } = require('./lib/clickup-env.cjs');
const { log, logError } = require('./lib/clickup-logger.cjs');
const { sleep } = require('./lib/throttle.cjs');

const CLONES_LIST   = '901326820623';
const COMANDOS_LIST = '901326820624';
const ROADMAP_LIST  = '901326820625';
const S             = 'to do';

const CLONES = [
  { name: 'Alex Hormozi',     info: 'Dominio: Business Scaling, Offers, Pricing, Acquisition | Ativacao: @clone_alex_hormozi | Uso: Estruturar ofertas, precificacao, escala de negocio' },
  { name: 'Charlie Munger',   info: 'Dominio: Mental Models, Inversao, Psicologia, Decisao | Ativacao: @clone_charlie_munger | Uso: Analise de negocios, evitar erros de julgamento' },
  { name: 'Chris Do',         info: 'Dominio: Branding, Precificacao por Valor, Vendas Socraticas | Ativacao: @clone_chris_do | Uso: Posicionamento de marca, vendas para criativos' },
  { name: 'Depesh Mandalia',  info: 'Dominio: Facebook/Meta Ads, BPM Method, AC-4 Framework | Ativacao: @clone_depesh_mandalia | Uso: Estrategia Meta Ads, diagnostico de campanhas' },
  { name: 'Eliyahu Goldratt', info: 'Dominio: Theory of Constraints (TOC), Critical Chain | Ativacao: @clone_eliyahu_goldratt | Uso: Gestao de restricoes, melhoria continua' },
  { name: 'Eugene Schwartz',  info: 'Dominio: Copywriting, Breakthrough Advertising, Niveis de Consciencia | Ativacao: @clone_eugene_schwartz | Uso: Copy direta, headlines, sofisticacao' },
  { name: 'John Carmack',     info: 'Dominio: Game Engine, Performance Optimization, Low-Level Systems | Ativacao: @clone_john_carmack | Uso: Otimizacao de performance, arquitetura' },
  { name: 'Kasim Aslam',      info: 'Dominio: Google Ads, Performance Max, AEO, Agency Growth | Ativacao: @clone_kasim_aslam | Uso: Google Ads, PMax, AEO para IA, escala de agencia' },
  { name: 'Linus Torvalds',   info: 'Dominio: Kernel Engineering, Code Quality, Systems Design | Ativacao: @clone_linus_torvalds | Uso: Code review brutal, arquitetura de sistemas' },
  { name: 'Marty Neumeier',   info: 'Dominio: Brand Strategy, Zag, Diferenciacao Radical, Onlyness | Ativacao: @clone_marty_neumeier | Uso: Estrategia de marca, Onlyness Statement' },
  { name: 'Nassim Taleb',     info: 'Dominio: Cisne Negro, Antifragilidade, Barbell Strategy | Ativacao: @clone_nassim_taleb | Uso: Risco, incerteza, sistemas complexos, antifragilidade' },
  { name: 'Philip Kotler',    info: 'Dominio: Marketing Strategy, STP, 4Ps, Marketing 5.0 | Ativacao: @clone_philip_kotler | Uso: Estrategia de marketing, segmentacao, posicionamento' },
  { name: 'Raiam Santos',     info: 'Dominio: Marketing da Controversia, Hacking de Sistemas | Ativacao: @clone_raiam_santos | Uso: Marketing de controversia, nomadismo, monetizacao' },
  { name: 'Robert McKee',     info: 'Dominio: Story, Estrutura Dramatica, Conflito, Storytelling | Ativacao: @clone_robert_mckee | Uso: Narrativa, personagens, storytelling em marketing' },
  { name: 'Russell Brunson',  info: 'Dominio: Funis de Vendas, Value Ladder, Direct Response | Ativacao: @clone_russell_brunson | Uso: Estrutura de funis, escada de valor, webinars' },
  { name: 'Stefan Georgi',    info: 'Dominio: Copywriting, RMBC Method, VSL, Mecanismo Unico | Ativacao: @clone_stefan_georgi | Uso: VSLs, leads, mecanismo unico, conversao' },
  { name: 'Tallis Gomes',     info: 'Dominio: Empreendedorismo Serial, G4 Educacao, Bootstrap vs VC | Ativacao: @clone_tallis_gomes | Uso: Scale-ups, gestao por inputs, contratacao AAA' },
  { name: 'Thiago Finch',     info: 'Dominio: Infoprodutos, Trafego Pago, Funis Alta Conversao, SaaS | Ativacao: @clone_thiago_finch | Uso: Trafego pago, lancamentos, holding digital' },
  { name: 'Todd Brown',       info: 'Dominio: Campaign Engineering, E5 Method, Big Idea, Unique Mechanism | Ativacao: @clone_todd_brown | Uso: Engenharia de campanhas, Big Idea, SIN' },
  { name: 'Tom Breeze',       info: 'Dominio: YouTube Ads, VSL, Metodo ADUCATE, Cornerstone VSL | Ativacao: @clone_tom_breeze | Uso: Videos que vendem, anuncios YouTube, performance' },
];

const AGENTS = [
  { name: '@dev — Dex',                info: 'Tipo: Dev | Ativacao: /AIOS:agents:dev | Escopo: Implementacao de codigo, stories, TypeScript/React/Node' },
  { name: '@architect — Aria',         info: 'Tipo: Dev | Ativacao: /AIOS:agents:architect | Escopo: Arquitetura de sistemas, stack, API design, infra' },
  { name: '@pm — Morgan',              info: 'Tipo: Dev | Ativacao: /AIOS:agents:pm | Escopo: Product Management, PRDs, roadmap, direcao estrategica' },
  { name: '@po — Pax',                 info: 'Tipo: Dev | Ativacao: /AIOS:agents:po | Escopo: Product Owner, stories, epics, backlog' },
  { name: '@sm — River',               info: 'Tipo: Dev | Ativacao: /AIOS:agents:sm | Escopo: Scrum Master, criacao e expansao de stories' },
  { name: '@analyst — Alex',           info: 'Tipo: Dev | Ativacao: /AIOS:agents:analyst | Escopo: Pesquisa, analise competitiva, ROI, deep research' },
  { name: '@qa — Quinn',               info: 'Tipo: Dev | Ativacao: /AIOS:agents:qa | Escopo: Testes, quality gates, security scans, PASS/CONCERNS/FAIL' },
  { name: '@data-engineer — Dara',     info: 'Tipo: Dev | Ativacao: /AIOS:agents:data-engineer | Escopo: Database design, migrations, RLS, query optimization' },
  { name: '@ux-design-expert — Uma',   info: 'Tipo: Dev | Ativacao: /AIOS:agents:ux-design-expert | Escopo: Frontend architecture, UI/UX, wireframes, design system' },
  { name: '@devops — Gage',            info: 'Tipo: Dev | Ativacao: /AIOS:agents:devops | Escopo: CI/CD, git push EXCLUSIVO, PR automation, versioning' },
  { name: '@clickup-ops — Clio',       info: 'Tipo: Utilitario | Ativacao: /AIOS:agents:clickup-ops | Escopo: ClickUp MCP — criar/atualizar tasks, docs, goals, automacoes' },
  { name: '@clickup-reporting — Atlas',info: 'Tipo: Utilitario | Ativacao: /AIOS:agents:clickup-reporting | Escopo: ClickUp audits, KPI summaries, relatorios de workspace' },
  { name: '@aios-master',              info: 'Tipo: Utilitario | Ativacao: /AIOS:agents:aios-master | Escopo: Front-door universal — triage e roteamento para qualquer agente' },
  { name: '@copy-chief',               info: 'Tipo: Chief | Ativacao: /AIOS:agents:copy-chief | Escopo: 24 copywriters lendarios — copy de alta conversao, VSL, emails, ads' },
  { name: '@traffic-masters-chief',    info: 'Tipo: Chief | Escopo: 7 especialistas em midia paga — Meta, Google, TikTok, YouTube' },
  { name: '@design-chief',             info: 'Tipo: Chief | Escopo: 9 especialistas de design — brand, visual, UX, motion' },
  { name: '@story-chief',              info: 'Tipo: Chief | Escopo: 12 storytellers — narrativa, roteiro, storytelling em marketing' },
  { name: '@data-chief',               info: 'Tipo: Chief | Escopo: 7 especialistas de dados — analytics, metricas, dashboards' },
  { name: '@cyber-chief',              info: 'Tipo: Chief | Escopo: 6 especialistas de seguranca — pentest, hardening, compliance' },
  { name: '@legal-chief',              info: 'Tipo: Chief | Escopo: 8 especialistas juridicos — contratos, compliance, LGPD' },
  { name: '@squad-creator',            info: 'Tipo: Chief | Escopo: Criacao, clonagem e validacao de squads e clones' },
  { name: '@content-planner',          info: 'Tipo: Conteudo | Escopo: Planejamento de conteudo, calendario editorial, pautas' },
  { name: '@copy-specialist',          info: 'Tipo: Conteudo | Escopo: Copywriting de conteudo, legendas, roteiros, posts' },
  { name: '@visual-director',          info: 'Tipo: Conteudo | Escopo: Direcao visual, briefings de design, identidade visual' },
  { name: '@post-assembler',           info: 'Tipo: Conteudo | Escopo: Montagem final de posts — texto + visual + legenda' },
  { name: '@conselho-dos-sabios',      info: 'Tipo: Conteudo | Escopo: Conselho estrategico multi-perspectiva com clones lendarios' },
];

const COMANDOS = [
  { name: 'Comandos — Design e Visual',       desc: 'Agentes: @visual-director, @design-chief\nUso: briefings visuais, identidade, paleta, tipografia, revisao de pecas\nExemplo: @visual-director — Criar briefing visual para [CLIENTE] — [TIPO: post/banner/LP]' },
  { name: 'Comandos — Copy e Conteudo',        desc: 'Agentes: @copy-chief (24 copywriters), @copy-specialist, @content-planner\nUso: LP, VSL, email, legenda, calendario editorial, roteiros de Reels\nExemplo: @copy-chief — Criar copy para [TIPO] — Cliente: [NOME] — Objetivo: [OBJ]' },
  { name: 'Comandos — Trafego Pago',           desc: 'Agentes: @traffic-masters-chief, @clone_depesh_mandalia (Meta/BPM), @clone_kasim_aslam (Google/PMax), @clone_tom_breeze (YouTube/ADUCATE)\nExemplo: @clone_depesh_mandalia — BPM Method para [CLIENTE] — publico frio vs quente' },
  { name: 'Comandos — Automacoes e Dev',       desc: 'Agentes: @dev (implementacao), @architect (arquitetura), @clickup-ops (operacoes ClickUp)\nScripts: task_ops.cjs, edit_doc.cjs, bulk_create_nexus.cjs, verify_manuals.cjs, goals.cjs, webhooks.cjs' },
  { name: 'Comandos — Estrategia e Negocios',  desc: 'Agentes: @conselho-dos-sabios, @analyst\nClones: @clone_alex_hormozi (ofertas/pricing), @clone_charlie_munger (modelos mentais), @clone_nassim_taleb (risco), @clone_marty_neumeier (marca)\nExemplo: @clone_alex_hormozi — Estruturar oferta irrecusavel para [SERVICO]' },
  { name: 'Comandos — Email e Automacao',      desc: 'Agentes: @copy-chief (sequencias email), BackstageFY (WhatsApp/CRM), Obsidian (knowledge base)\nVault: D:\\01 -Arquivos\\Obsidian\\AIOS\\\nClones: @clone_stefan_georgi (RMBC), @clone_russell_brunson (funis), @clone_todd_brown (Big Idea)' },
];

const ROADMAP = [
  { name: 'Webhooks ClickUp — Automacoes em Tempo Real',    desc: 'Task aprovada -> notificacao WhatsApp cliente. Nova task Social Media -> cria doc no Manual. Requer endpoint serverless. Base: scripts/webhooks.cjs' },
  { name: 'Dashboard de Observabilidade AIOS',              desc: 'Visualizar: agentes ativos, tasks por cliente nas ultimas 24h, metricas SM/Trafego/Design por semana, alertas de atrasados. Stack: scripts ClickUp + HTML/JS no Cloudflare Pages.' },
  { name: 'Memoria Persistente dos Clientes',               desc: 'clients/{slug}/memory_strategy.md atualizado automaticamente apos cada sessao. Injeta contexto do cliente via CLAUDE.md. Base: arquivos de cliente ja existem em clients/.' },
  { name: 'Pipeline de Onboarding de Novos Clientes',       desc: 'Script CLI onboard-client.cjs: novo cliente -> listas ClickUp + templates + campos + manual BackstageFY + yaml + memory files em menos de 30 min. Base: agents/workflows/client-onboarding.md' },
  { name: 'Relatorio Mensal Automatizado por Cliente',      desc: 'Dia 1 do mes: coleta tasks do mes anterior (Social Media, Trafego, Design), @clickup-reporting gera narrativa com metricas, salva no doc BackstageFY e envia ao cliente. Templates ja existem em Relatorios de Clientes.' },
  { name: 'n8n / Make — Automacoes Externas',               desc: 'Instagram -> ClickUp, Meta Ads alertas -> task de revisao, ClickUp task aprovada -> WhatsApp cliente, formulario -> CRM -> qualificacao. Robson executa setup. Decide: n8n self-hosted ou Make cloud.' },
];

async function addField(listId, field) {
  try { await clickupRequest('POST', '/list/' + listId + '/field', field); }
  catch(e) { /* skip if exists */ }
}

async function run() {
  let ok = 0, fail = 0;

  // Fields — Clones
  await addField(CLONES_LIST, { name: 'Tipo', type: 'drop_down', type_config: { options: [
    {name:'Clone Estrategico',color:'#9333ea'},{name:'Clone Tecnico',color:'#3e63dd'},
    {name:'Clone Marketing',color:'#e93d82'},{name:'Agente Dev',color:'#30a46c'},
    {name:'Agente Utilitario',color:'#f76808'},{name:'Chief / Squad',color:'#0091ff'},
    {name:'Agente Conteudo',color:'#12a594'},
  ]}});
  await addField(CLONES_LIST, { name: 'Ativo', type: 'checkbox', type_config: {} });

  // Clones tasks
  console.log('Clones:');
  for (const c of CLONES) {
    try {
      const t = await clickupRequest('POST', '/list/' + CLONES_LIST + '/task', { name: c.name, status: S, description: c.info });
      console.log('  ok: ' + t.name); ok++;
      log('task.created', { listId: CLONES_LIST, taskId: t.id, name: t.name, type: 'clone' });
    } catch(e) { console.error('  fail: ' + c.name); fail++; logError('task.created', { listId: CLONES_LIST, name: c.name, error: e.message }); }
    await sleep(150);
  }

  // Agents tasks
  console.log('Agentes:');
  for (const a of AGENTS) {
    try {
      const t = await clickupRequest('POST', '/list/' + CLONES_LIST + '/task', { name: a.name, status: S, description: a.info });
      console.log('  ok: ' + t.name); ok++;
      log('task.created', { listId: CLONES_LIST, taskId: t.id, name: t.name, type: 'agent' });
    } catch(e) { console.error('  fail: ' + a.name); fail++; logError('task.created', { listId: CLONES_LIST, name: a.name, error: e.message }); }
    await sleep(150);
  }

  // Fields — Comandos
  await addField(COMANDOS_LIST, { name: 'Categoria', type: 'drop_down', type_config: { options: [
    {name:'Design e Visual',color:'#e93d82'},{name:'Copy e Conteudo',color:'#9333ea'},
    {name:'Trafego Pago',color:'#3e63dd'},{name:'Automacao e Dev',color:'#30a46c'},
    {name:'Estrategia',color:'#f76808'},{name:'Email e Automacao',color:'#12a594'},
  ]}});

  console.log('Comandos:');
  for (const c of COMANDOS) {
    try {
      const t = await clickupRequest('POST', '/list/' + COMANDOS_LIST + '/task', { name: c.name, status: S, description: c.desc });
      console.log('  ok: ' + t.name); ok++;
      log('task.created', { listId: COMANDOS_LIST, taskId: t.id, name: t.name, type: 'comando' });
    } catch(e) { console.error('  fail: ' + c.name); fail++; logError('task.created', { listId: COMANDOS_LIST, name: c.name, error: e.message }); }
    await sleep(150);
  }

  // Fields — Roadmap
  await addField(ROADMAP_LIST, { name: 'Area', type: 'drop_down', type_config: { options: [
    {name:'ClickUp / Ops',color:'#3e63dd'},{name:'BackstageFY',color:'#30a46c'},
    {name:'AIOS Core',color:'#9333ea'},{name:'Automacao',color:'#f76808'},
    {name:'Clientes',color:'#12a594'},{name:'Infraestrutura',color:'#e93d82'},
  ]}});
  await addField(ROADMAP_LIST, { name: 'Impacto', type: 'drop_down', type_config: { options: [
    {name:'Alto',color:'#e93d82'},{name:'Medio',color:'#f76808'},{name:'Baixo',color:'#30a46c'},
  ]}});

  console.log('Roadmap:');
  for (const r of ROADMAP) {
    try {
      const t = await clickupRequest('POST', '/list/' + ROADMAP_LIST + '/task', { name: r.name, status: S, description: r.desc });
      console.log('  ok: ' + t.name); ok++;
      log('task.created', { listId: ROADMAP_LIST, taskId: t.id, name: t.name, type: 'roadmap' });
    } catch(e) { console.error('  fail: ' + r.name); fail++; logError('task.created', { listId: ROADMAP_LIST, name: r.name, error: e.message }); }
    await sleep(150);
  }

  console.log('\nTotal: ' + ok + ' ok, ' + fail + ' fail');
}

run().catch(console.error);
