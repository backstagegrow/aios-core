/**
 * setup-aios-space.cjs
 *
 * Reestrutura o espaço AIOS no ClickUp:
 * 1. Cria 3 novas listas no folder Agents
 * 2. Popula com dados reais (clones, agentes, comandos, roadmap)
 * 3. Arquiva tasks obsoletas da lista antiga
 * 4. Renomeia lista antiga para Arquivo Legado
 */

const { clickupRequest } = require('./lib/clickup-env.cjs');
const { log, logError } = require('./lib/clickup-logger.cjs');
const { sleep } = require('./lib/throttle.cjs');

const FOLDER_ID    = '901317503817';
const OLD_LIST_ID  = '901325989273';

// ─── Tasks antigas para arquivar ──────────────────────────────────────────────

const TO_ARCHIVE = [
  '86ag601pn', // O Que falta fazer
  '86ag5zve6', // Briefing GROW (migrado para .yaml)
  '86ag5zum3', // Briefing ABA
  '86ag5zukn', // Briefing GT
  '86ag5zujb', // Briefing VIA
  '86ag5zra0', // Briefing clientes
  '86agca7bj', // Comandos design
  '86agb5tgf', // Email Novo BKS
  '86aga87xr', // Clones
  '86ag91qxa', // Conselho e afins
  '86ag6bh6p', // Comandos Obsidian
  '86ag66q2e', // Conselheiros
  '86ag650du', // Criação de produtos
  '86ag5zzv6', // Comando automação Email
  '86ag5zem0', // Comandos Copys
  '86ag5qutn', // Comandos Paginas
];

// ─── Dados reais ──────────────────────────────────────────────────────────────

const CLONES = [
  { name: 'Alex Hormozi',     dominio: 'Business Scaling · Offers · Pricing · Acquisition',        ativacao: '@clone_alex_hormozi',    uso: 'Estruturar ofertas, precificação, escala de negócio, aquisição de clientes' },
  { name: 'Charlie Munger',   dominio: 'Mental Models · Inversão · Psicologia · Decisão',           ativacao: '@clone_charlie_munger',  uso: 'Análise de negócios, evitar erros de julgamento, modelos mentais multidisciplinares' },
  { name: 'Chris Do',         dominio: 'Branding · Precificação por Valor · Vendas Socráticas',     ativacao: '@clone_chris_do',        uso: 'Posicionamento de marca, vendas para criativos, personal brand' },
  { name: 'Depesh Mandalia',  dominio: 'Facebook/Meta Ads · BPM Method · AC-4 Framework',          ativacao: '@clone_depesh_mandalia', uso: 'Estratégia Meta Ads, diagnóstico de campanhas, escala lucrativa' },
  { name: 'Eliyahu Goldratt', dominio: 'Theory of Constraints (TOC) · Critical Chain · Throughput',ativacao: '@clone_eliyahu_goldratt',uso: 'Gestão de restrições, melhoria contínua, gerenciamento de projetos' },
  { name: 'Eugene Schwartz',  dominio: 'Copywriting · Breakthrough Advertising · Níveis de Consciência', ativacao: '@clone_eugene_schwartz', uso: 'Copy de resposta direta, headlines, sofisticação de mercado' },
  { name: 'John Carmack',     dominio: 'Game Engine · Performance Optimization · Low-Level Systems', ativacao: '@clone_john_carmack',   uso: 'Otimização de performance, arquitetura de engines, decisões técnicas' },
  { name: 'Kasim Aslam',      dominio: 'Google Ads · Performance Max · AEO · Agency Growth',        ativacao: '@clone_kasim_aslam',    uso: 'Google Ads, Performance Max, AEO/SEO para IA, escala de agência' },
  { name: 'Linus Torvalds',   dominio: 'Kernel Engineering · Code Quality · Systems Design',        ativacao: '@clone_linus_torvalds', uso: 'Code review brutal, arquitetura de sistemas, padrões de qualidade' },
  { name: 'Marty Neumeier',   dominio: 'Brand Strategy · Zag · Diferenciação Radical · Onlyness',  ativacao: '@clone_marty_neumeier', uso: 'Estratégia de marca, Onlyness Statement, diferenciação radical' },
  { name: 'Nassim Taleb',     dominio: 'Cisne Negro · Antifragilidade · Barbell Strategy · Skin in the Game', ativacao: '@clone_nassim_taleb', uso: 'Risco, incerteza, sistemas complexos, tomada de decisão sob opacidade' },
  { name: 'Philip Kotler',    dominio: 'Marketing Strategy · STP · 4Ps · Marketing 5.0',            ativacao: '@clone_philip_kotler',  uso: 'Estratégia de marketing, segmentação, posicionamento, mix de marketing' },
  { name: 'Raiam Santos',     dominio: 'Arquetipo Fora da Lei · Marketing da Controvérsia · Hacking de Sistemas', ativacao: '@clone_raiam_santos', uso: 'Marketing de controvérsia, nomadismo digital, monetização de audiência' },
  { name: 'Robert McKee',     dominio: 'Story · Estrutura Dramática · Conflito · Storytelling',     ativacao: '@clone_robert_mckee',   uso: 'Estrutura narrativa, construção de personagens, storytelling em marketing' },
  { name: 'Russell Brunson',  dominio: 'Funis de Vendas · Value Ladder · Direct Response · ClickFunnels', ativacao: '@clone_russell_brunson', uso: 'Estrutura de funis, escada de valor, webinars de vendas, aquisição' },
  { name: 'Stefan Georgi',    dominio: 'Copywriting · RMBC Method · VSL · Mecanismo Único',         ativacao: '@clone_stefan_georgi',  uso: 'Estrutura de copy, VSLs, leads, mecanismo único, briefing e conversão' },
  { name: 'Tallis Gomes',     dominio: 'Empreendedorismo Serial · G4 Educação · Bootstrap vs VC',   ativacao: '@clone_tallis_gomes',   uso: 'Scale-ups brasileiras, gestão por inputs, contratação AAA, liderança' },
  { name: 'Thiago Finch',     dominio: 'Infoprodutos · Tráfego Pago · Funis de Alta Conversão · SaaS', ativacao: '@clone_thiago_finch', uso: 'Tráfego pago, criação de ofertas, lançamentos, transição para holding digital' },
  { name: 'Todd Brown',       dominio: 'Campaign Engineering · E5 Method · Big Idea Formula · Unique Mechanism', ativacao: '@clone_todd_brown', uso: 'Engenharia de campanhas, Big Idea, Mecanismo Único, oferta S.I.N.' },
  { name: 'Tom Breeze',       dominio: 'YouTube Ads · VSL · Método ADUCATE · Cornerstone VSL',      ativacao: '@clone_tom_breeze',    uso: 'Vídeos que vendem, estrutura de anúncios YouTube, escala em performance' },
];

const AIOS_AGENTS = [
  // Story-Driven Dev
  { nome: '@dev — Dex',              tipo: 'Dev',      escopo: 'Implementação de código, stories, TypeScript/React/Node', ativacao: '/AIOS:agents:dev' },
  { nome: '@architect — Aria',       tipo: 'Dev',      escopo: 'Arquitetura de sistemas, stack selection, API design, infra', ativacao: '/AIOS:agents:architect' },
  { nome: '@pm — Morgan',            tipo: 'Dev',      escopo: 'Product Management, PRDs, roadmap, direção estratégica', ativacao: '/AIOS:agents:pm' },
  { nome: '@po — Pax',               tipo: 'Dev',      escopo: 'Product Owner, stories, epics, backlog, coerência de contexto', ativacao: '/AIOS:agents:po' },
  { nome: '@sm — River',             tipo: 'Dev',      escopo: 'Scrum Master, criação e expansão de stories, nunca implementa', ativacao: '/AIOS:agents:sm' },
  { nome: '@analyst — Alex',         tipo: 'Dev',      escopo: 'Pesquisa, análise competitiva, ROI, deep research', ativacao: '/AIOS:agents:analyst' },
  { nome: '@qa — Quinn',             tipo: 'Dev',      escopo: 'Testes, quality gates, security scans, PASS/CONCERNS/FAIL', ativacao: '/AIOS:agents:qa' },
  { nome: '@data-engineer — Dara',   tipo: 'Dev',      escopo: 'Database design, migrations, RLS, query optimization', ativacao: '/AIOS:agents:data-engineer' },
  { nome: '@ux-design-expert — Uma', tipo: 'Dev',      escopo: 'Frontend architecture, UI/UX, wireframes, design system', ativacao: '/AIOS:agents:ux-design-expert' },
  { nome: '@devops — Gage',          tipo: 'Dev',      escopo: 'CI/CD, git push (EXCLUSIVO), PR automation, versioning', ativacao: '/AIOS:agents:devops' },
  // Utilitários
  { nome: '@clickup-ops — Clio',     tipo: 'Utilitário', escopo: 'ClickUp MCP: criar/atualizar tasks, docs, goals, automações', ativacao: '/AIOS:agents:clickup-ops' },
  { nome: '@clickup-reporting — Atlas', tipo: 'Utilitário', escopo: 'ClickUp audits, KPI summaries, relatórios de workspace', ativacao: '/AIOS:agents:clickup-reporting' },
  { nome: '@aios-master',            tipo: 'Utilitário', escopo: 'Front-door universal — triage e roteamento para qualquer agente', ativacao: '/AIOS:agents:aios-master' },
  // Chiefs
  { nome: '@copy-chief',             tipo: 'Chief',    escopo: '24 copywriters lendários — copy de alta conversão, VSL, emails, ads', ativacao: '/AIOS:agents:copy-chief' },
  { nome: '@traffic-masters-chief',  tipo: 'Chief',    escopo: '7 especialistas em mídia paga — Meta, Google, TikTok, YouTube', ativacao: 'Ativação direta' },
  { nome: '@design-chief',           tipo: 'Chief',    escopo: '9 especialistas de design — brand, visual, UX, motion', ativacao: 'Ativação direta' },
  { nome: '@story-chief',            tipo: 'Chief',    escopo: '12 storytellers — narrativa, roteiro, storytelling em marketing', ativacao: 'Ativação direta' },
  { nome: '@data-chief',             tipo: 'Chief',    escopo: '7 especialistas de dados — analytics, métricas, dashboards', ativacao: 'Ativação direta' },
  { nome: '@cyber-chief',            tipo: 'Chief',    escopo: '6 especialistas de segurança — pentest, hardening, compliance', ativacao: 'Ativação direta' },
  { nome: '@legal-chief',            tipo: 'Chief',    escopo: '8 especialistas jurídicos — contratos, compliance, LGPD', ativacao: 'Ativação direta' },
  { nome: '@squad-creator',          tipo: 'Chief',    escopo: 'Criação, clonagem e validação de squads e clones', ativacao: 'Ativação direta' },
  // Conteúdo
  { nome: '@content-planner',        tipo: 'Conteúdo', escopo: 'Planejamento de conteúdo, calendário editorial, pautas', ativacao: 'Ativação direta' },
  { nome: '@copy-specialist',        tipo: 'Conteúdo', escopo: 'Copywriting de conteúdo, legendas, roteiros, posts', ativacao: 'Ativação direta' },
  { nome: '@visual-director',        tipo: 'Conteúdo', escopo: 'Direção visual, briefings de design, identidade visual', ativacao: 'Ativação direta' },
  { nome: '@post-assembler',         tipo: 'Conteúdo', escopo: 'Montagem final de posts — texto + visual + legenda', ativacao: 'Ativação direta' },
  { nome: '@conselho-dos-sabios',    tipo: 'Conteúdo', escopo: 'Conselho estratégico multi-perspectiva com clones lendários', ativacao: 'Ativação direta' },
];

const COMANDOS = [
  {
    name: '🎨 Comandos — Design & Visual',
    description: [
      '## Comandos de Design & Visual',
      '',
      '### @visual-director',
      '```',
      '@visual-director — Criar briefing visual para [CLIENTE] — [TIPO: post/banner/LP]',
      '@visual-director — Revisar identidade visual da peça [DESCRIÇÃO]',
      '@visual-director — Propor paleta e tipografia para nova campanha',
      '```',
      '',
      '### @design-chief',
      '```',
      '@design-chief — Criar sistema visual completo para [CLIENTE]',
      '@design-chief — Audit de identidade visual — o que está fora do padrão?',
      '```',
      '',
      '### Design Web (Erick)',
      '```',
      'Briefing para LP: objetivo=[OBJETIVO], público=[PÚBLICO], referências=[LINKS]',
      'Ajuste de site: página=[URL], o que mudar=[DESCRIÇÃO], prazo=[DATA]',
      '```',
    ].join('\n'),
  },
  {
    name: '✍️ Comandos — Copy & Conteúdo',
    description: [
      '## Comandos de Copy & Conteúdo',
      '',
      '### @copy-chief (orquestra 24 copywriters)',
      '```',
      '@copy-chief — Criar copy para [TIPO: LP/VSL/Email/Ad] — Cliente: [NOME] — Objetivo: [OBJETIVO]',
      '@copy-chief — Revisar e fortalecer a copy desta LP: [URL ou TEXTO]',
      '@copy-chief — Criar sequência de emails de nurture — nicho: [NICHO], produto: [PRODUTO]',
      '```',
      '',
      '### @copy-specialist',
      '```',
      '@copy-specialist — Legenda para [FORMATO: reels/carrossel/post] — cliente [CLIENTE] — pilar: [PILAR]',
      '@copy-specialist — Roteiro de Reels — duração: [SEG]s — gancho: [TEMA]',
      '```',
      '',
      '### @content-planner',
      '```',
      '@content-planner — Calendário editorial [MÊS] para [CLIENTE] — pilares: [PILARES]',
      '@content-planner — Pautas semanais baseadas em [EVENTO/TENDÊNCIA/CAMPANHA]',
      '```',
      '',
      '### Clones para Copy',
      '```',
      '@clone_eugene_schwartz — Nível de consciência desta copy? Como elevar?',
      '@clone_stefan_georgi — Revisar VSL pelo método RMBC',
      '@clone_russell_brunson — Montar Value Ladder para [PRODUTO]',
      '@clone_todd_brown — Criar Big Idea para campanha de [PRODUTO/NICHO]',
      '```',
    ].join('\n'),
  },
  {
    name: '📣 Comandos — Tráfego Pago',
    description: [
      '## Comandos de Tráfego Pago',
      '',
      '### @traffic-masters-chief',
      '```',
      '@traffic-masters-chief — Estratégia Meta Ads para [CLIENTE] — objetivo: [OBJETIVO] — verba: R$[VALOR]/mês',
      '@traffic-masters-chief — Audit de campanhas — o que otimizar? [DADOS DE DESEMPENHO]',
      '@traffic-masters-chief — Criar estrutura de campanha Google Ads para [NICHO]',
      '```',
      '',
      '### Clones para Tráfego',
      '```',
      '@clone_depesh_mandalia — BPM Method para [CLIENTE] — público frio vs quente',
      '@clone_depesh_mandalia — AC-4 Framework — estruturar conta Meta Ads',
      '@clone_kasim_aslam — Performance Max setup para [PRODUTO/SERVIÇO]',
      '@clone_kasim_aslam — AEO strategy — como otimizar para busca por IA?',
      '@clone_tom_breeze — Roteiro ADUCATE para YouTube Ad — produto: [PRODUTO]',
      '```',
      '',
      '### Scripts ClickUp',
      '```bash',
      'node scripts/task_ops.cjs --list [LIST_ID]  # listar tasks',
      'node scripts/task_ops.cjs --create --list [ID] --name "[NOME]" --status "A FAZER"',
      'node scripts/time_tracking.cjs --list [LIST_ID]  # ver time tracking',
      '```',
    ].join('\n'),
  },
  {
    name: '🤖 Comandos — Automações & Dev',
    description: [
      '## Comandos de Automações & Dev AIOS',
      '',
      '### @dev (Dex) — Implementação',
      '```',
      '@dev — Implementar [FEATURE] conforme story [ID]',
      '@dev — Corrigir bug: [DESCRIÇÃO] — arquivo: [PATH]',
      '```',
      '',
      '### @architect (Aria) — Arquitetura',
      '```',
      '@architect — Criar arquitetura para [SISTEMA/FEATURE]',
      '@architect — Analisar impacto de mudança em [MÓDULO]',
      '```',
      '',
      '### @clickup-ops (Clio) — Operações ClickUp',
      '```',
      '@clickup-ops — Criar task em [LISTA]: nome=[NOME], status=[STATUS]',
      '@clickup-ops — Editar doc [DOC_ID] página [PAGE_ID]: [O QUE MUDAR]',
      '@clickup-ops — Bulk create tasks a partir de [DESCRIÇÃO]',
      '```',
      '',
      '### Scripts Disponíveis',
      '```bash',
      'node scripts/task_ops.cjs --help',
      'node scripts/edit_doc.cjs --help',
      'node scripts/bulk_create_nexus.cjs',
      'node scripts/verify_manuals.cjs',
      'node scripts/goals.cjs --list',
      'node scripts/webhooks.cjs --list',
      '```',
    ].join('\n'),
  },
  {
    name: '💡 Comandos — Estratégia & Negócios',
    description: [
      '## Comandos de Estratégia & Negócios',
      '',
      '### @conselho-dos-sabios',
      '```',
      '@conselho-dos-sabios — Preciso decidir entre [OPÇÃO A] e [OPÇÃO B] para [CONTEXTO]',
      '@conselho-dos-sabios — Como escalar [SERVIÇO/PRODUTO] sem aumentar custo?',
      '```',
      '',
      '### Clones Estratégicos',
      '```',
      '@clone_alex_hormozi — Estruturar oferta irrecusável para [SERVIÇO]',
      '@clone_alex_hormozi — Como precificar [SERVIÇO] — custo atual: R$[X], valor entregue: [Y]',
      '@clone_charlie_munger — Quais são os riscos ocultos em [DECISÃO]?',
      '@clone_nassim_taleb — Como tornar [NEGÓCIO/SISTEMA] antifrágil?',
      '@clone_tallis_gomes — Como contratar profissional AAA para [FUNÇÃO]?',
      '@clone_marty_neumeier — Onlyness Statement para [MARCA/SERVIÇO]',
      '```',
      '',
      '### @analyst (Alex)',
      '```',
      '@analyst — Pesquisar [TEMA/CONCORRENTE/MERCADO] e retornar insights acionáveis',
      '@analyst — Calcular ROI de [INVESTIMENTO] com base em [DADOS]',
      '```',
    ].join('\n'),
  },
  {
    name: '📧 Comandos — Email & Automação',
    description: [
      '## Comandos de Email & Automação',
      '',
      '### Sequências de Email',
      '```',
      '@copy-chief — Sequência de 5 emails de nurture — lead frio — produto: [PRODUTO]',
      '@copy-chief — Email de reativação para leads inativos — nicho: [NICHO]',
      '@clone_stefan_georgi — Lead de email — mecanismo único de [PROBLEMA → SOLUÇÃO]',
      '```',
      '',
      '### Automações BackstageFY',
      '```',
      'WhatsApp Bot: objetivo=[OBJETIVO], funil=[ETAPAS], tom=[TOM]',
      'CRM Pipeline: etapas=[ETAPAS], campos=[DADOS DO LEAD], triggers=[AUTOMAÇÕES]',
      'Relatório automático: métricas=[MÉTRICAS], frequência=[FREQ], destinatários=[EMAILS]',
      '```',
      '',
      '### Obsidian / Knowledge Base',
      '```',
      'Salvar em: D:\\01 -Arquivos\\Obsidian\\AIOS\\[PASTA]\\[NOME].md',
      'Template: frontmatter (date, tags, client, type) + conteúdo',
      '```',
    ].join('\n'),
  },
];

const ROADMAP_ITEMS = [
  {
    name: '🔗 Webhooks ClickUp — Automações em Tempo Real',
    description: [
      '## Feature: Webhooks ClickUp',
      '',
      '**Objetivo:** Automatizar ações baseadas em mudanças de status/tasks no ClickUp',
      '',
      '### Casos de Uso',
      '- Task movida para "APROVADO" → notificar cliente via WhatsApp (BackstageFY)',
      '- Nova task em Social Media → criar doc no Manual do cliente',
      '- Task "VEICULANDO" → atualizar dashboard de tráfego',
      '- Relatório mensal criado → enviar email automático para cliente',
      '',
      '### Próximos Passos',
      '- [ ] Definir endpoint de recebimento (server ou serverless)',
      '- [ ] Mapear eventos prioritários (taskStatusUpdated, taskCreated)',
      '- [ ] Implementar com scripts/webhooks.cjs como base',
      '- [ ] Testar em ambiente de staging',
    ].join('\n'),
  },
  {
    name: '📊 Dashboard de Observabilidade AIOS',
    description: [
      '## Feature: Dashboard de Observabilidade',
      '',
      '**Objetivo:** Visualizar em tempo real o que os agentes AIOS estão executando',
      '',
      '### O que mostrar',
      '- Agentes ativos na sessão',
      '- Tasks criadas/atualizadas nas últimas 24h por cliente',
      '- Métricas de uso (Social Media, Tráfego, Design Web) por semana',
      '- Status dos manuais dos clientes (BackstageFY docs)',
      '- Alertas de tasks atrasadas ou bloqueadas',
      '',
      '### Stack',
      '- Backend: scripts ClickUp existentes como source',
      '- Frontend: página HTML/JS simples (Cloudflare Pages)',
      '- Atualização: polling a cada 5min ou webhook',
      '',
      '### Próximos Passos',
      '- [ ] Definir métricas prioritárias (3-5 KPIs por cliente)',
      '- [ ] Criar script de aggregation dos dados',
      '- [ ] Montar layout minimalista do dashboard',
    ].join('\n'),
  },
  {
    name: '🧠 Memória Persistente dos Clientes',
    description: [
      '## Feature: Memória Persistente por Cliente',
      '',
      '**Objetivo:** AIOS lembrar automaticamente do contexto de cada cliente entre sessões',
      '',
      '### O que incluir',
      '- Brand voice, tom, pilares de conteúdo',
      '- Histórico de decisões importantes',
      '- Performance de campanhas anteriores',
      '- Padrões que funcionam vs não funcionam',
      '- Contatos, acessos, ferramentas do cliente',
      '',
      '### Implementação',
      '- Arquivo `clients/{slug}/memory_strategy.md` por cliente (já existe base)',
      '- Atualização automática após cada sessão de trabalho',
      '- Integração com CLAUDE.md para injeção automática de contexto',
      '',
      '### Próximos Passos',
      '- [ ] Definir estrutura padronizada de memory file',
      '- [ ] Preencher arquivos dos 4 clientes ativos',
      '- [ ] Criar hook de atualização pós-sessão',
    ].join('\n'),
  },
  {
    name: '🚀 Pipeline de Onboarding de Novos Clientes',
    description: [
      '## Feature: Pipeline de Onboarding Automatizado',
      '',
      '**Objetivo:** Novo cliente assinado → estrutura completa criada em <30 min',
      '',
      '### O que deve ser criado automaticamente',
      '- Listas ClickUp (Social Media, Tráfego, Design Web, Onboarding, Automações)',
      '- Templates de tasks em todas as listas',
      '- Custom fields padronizados',
      '- Doc Manual do cliente (BackstageFY)',
      '- Arquivo `clients/{slug}.yaml` com perfil',
      '- Memory files de estratégia e performance',
      '',
      '### Script base',
      '- agents/workflows/client-onboarding.md já existe',
      '- Precisa de script CLI unificado que execute tudo',
      '',
      '### Próximos Passos',
      '- [ ] Criar script `scripts/onboard-client.cjs --name [NOME] --space [SPACE_ID]`',
      '- [ ] Testar com cliente fictício',
      '- [ ] Validar com próximo cliente real',
    ].join('\n'),
  },
  {
    name: '📱 Relatório Mensal Automatizado por Cliente',
    description: [
      '## Feature: Relatório Mensal Automático',
      '',
      '**Objetivo:** No dia 1 de cada mês, relatório de cada cliente gerado e enviado automaticamente',
      '',
      '### Fluxo',
      '1. Script coleta tasks do mês anterior por lista (Social Media, Tráfego, Design)',
      '2. AIOS (@clickup-reporting) gera narrativa com insights e métricas',
      '3. Relatório salvo no doc do cliente (BackstageFY)',
      '4. PDF/email enviado ao cliente',
      '',
      '### Dados por área',
      '- Social Media: posts publicados, formatos, pilares de conteúdo',
      '- Tráfego: campanhas rodando, investimento, resultados',
      '- Design: entregas concluídas, tipos',
      '',
      '### Próximos Passos',
      '- [ ] Implementar agregação de tasks por data via API',
      '- [ ] Criar template de relatório (já existe em Relatórios de Clientes)',
      '- [ ] Integrar com BackstageFY para envio automático',
    ].join('\n'),
  },
  {
    name: '⚙️ n8n / Make — Automações Externas',
    description: [
      '## Feature: Automações com n8n / Make',
      '',
      '**Objetivo:** Conectar AIOS/ClickUp com ferramentas externas via automação visual',
      '',
      '### Automações prioritárias',
      '- Instagram → ClickUp: novo post publicado → criar task de monitoramento',
      '- Meta Ads → ClickUp: alerta de CPL acima do limite → criar task de revisão',
      '- ClickUp → WhatsApp: task aprovada → notificação para cliente',
      '- Formulário → CRM → WhatsApp: lead capturado → qualificação automática',
      '',
      '### Stack',
      '- n8n (self-hosted) ou Make (cloud)',
      '- Webhooks ClickUp como trigger',
      '- BackstageFY para WhatsApp/CRM',
      '',
      '### Próximos Passos',
      '- [ ] Definir prioridade entre n8n e Make',
      '- [ ] Mapear os 3 primeiros fluxos a automatizar',
      '- [ ] Configurar ambiente (Robson)',
    ].join('\n'),
  },
];

// ─── Runner ───────────────────────────────────────────────────────────────────

async function run() {
  let ok = 0, fail = 0;

  // 1. Arquivar tasks antigas
  console.log('\n━━━ ARQUIVANDO TASKS ANTIGAS ━━━');
  for (const id of TO_ARCHIVE) {
    try {
      await clickupRequest('PUT', `/task/${id}`, { archived: true });
      process.stdout.write('  ✅ ' + id + '\n');
      ok++;
    } catch (e) {
      process.stdout.write('  ❌ ' + id + ': ' + e.message + '\n');
      fail++;
    }
  }

  // 2. Renomear lista antiga
  console.log('\n━━━ RENOMEANDO LISTA ANTIGA ━━━');
  try {
    await clickupRequest('PUT', `/list/${OLD_LIST_ID}`, { name: '🗄️ Arquivo Legado' });
    console.log('  ✅ bks-growth-ops → 🗄️ Arquivo Legado');
    ok++;
  } catch (e) {
    console.error('  ❌ Rename: ' + e.message);
    fail++;
  }

  // 3. Criar lista Clones & Agentes
  console.log('\n━━━ CRIANDO LISTA: 🤖 Clones & Agentes ━━━');
  let clonesListId;
  try {
    const res = await clickupRequest('POST', `/folder/${FOLDER_ID}/list`, { name: '🤖 Clones & Agentes' });
    clonesListId = res.id;
    console.log('  ✅ Lista criada [' + clonesListId + ']');
    ok++;
  } catch (e) {
    console.error('  ❌ Criar lista: ' + e.message);
    fail++;
    return;
  }

  // 4. Custom fields — Clones & Agentes
  const clonesFields = [
    { name: '🏷️ Tipo', type: 'drop_down', type_config: { options: [
      { name: 'Clone Estratégico', color: '#9333ea' },
      { name: 'Clone Técnico',     color: '#3e63dd' },
      { name: 'Clone Marketing',   color: '#e93d82' },
      { name: 'Agente Dev',        color: '#30a46c' },
      { name: 'Agente Utilitário', color: '#f76808' },
      { name: 'Chief / Squad',     color: '#0091ff' },
      { name: 'Agente Conteúdo',   color: '#12a594' },
    ]}},
    { name: '⚡ Ativação', type: 'text', type_config: {} },
    { name: '✅ Ativo', type: 'checkbox', type_config: {} },
  ];
  for (const f of clonesFields) {
    try {
      await clickupRequest('POST', `/list/${clonesListId}/field`, f);
      console.log('  ✅ Campo: ' + f.name);
      ok++;
    } catch (e) {
      console.error('  ❌ Campo ' + f.name + ': ' + e.message);
      fail++;
    }
  }

  // 5. Criar tasks — Clones
  console.log('\n  📋 Clones:');
  for (const c of CLONES) {
    try {
      const t = await clickupRequest('POST', `/list/${clonesListId}/task`, {
        name: c.name,
        status: 'aberto',
        description: [
          '## Clone — ' + c.name,
          '',
          '**Domínio:** ' + c.dominio,
          '**Ativação:** `' + c.ativacao + '`',
          '',
          '### Quando usar',
          c.uso,
          '',
          '### Exemplos de uso',
          '```',
          c.ativacao + ' — [DESCREVA O QUE PRECISA]',
          '```',
        ].join('\n'),
      });
      console.log('    ✅ ' + t.name + ' [' + t.id + ']');
      log('task.created', { listId: clonesListId, taskId: t.id, name: t.name, type: 'clone' });
      ok++;
    } catch (e) {
      console.error('    ❌ ' + c.name + ': ' + e.message);
      logError('task.created', { listId: clonesListId, name: c.name, error: e.message });
      fail++;
    }
    await sleep(150);
  }

  // 6. Criar tasks — Agentes AIOS
  console.log('\n  📋 Agentes AIOS:');
  for (const a of AIOS_AGENTS) {
    try {
      const t = await clickupRequest('POST', `/list/${clonesListId}/task`, {
        name: a.nome,
        status: 'aberto',
        description: [
          '## Agente AIOS — ' + a.nome,
          '',
          '**Tipo:** ' + a.tipo,
          '**Ativação:** `' + a.ativacao + '`',
          '',
          '### Escopo',
          a.escopo,
        ].join('\n'),
      });
      console.log('    ✅ ' + t.name + ' [' + t.id + ']');
      log('task.created', { listId: clonesListId, taskId: t.id, name: t.name, type: 'agent' });
      ok++;
    } catch (e) {
      console.error('    ❌ ' + a.nome + ': ' + e.message);
      logError('task.created', { listId: clonesListId, name: a.nome, error: e.message });
      fail++;
    }
    await sleep(150);
  }

  // 7. Criar lista Comandos & Prompts
  console.log('\n━━━ CRIANDO LISTA: 📋 Comandos & Prompts ━━━');
  let comandosListId;
  try {
    const res = await clickupRequest('POST', `/folder/${FOLDER_ID}/list`, { name: '📋 Comandos & Prompts' });
    comandosListId = res.id;
    console.log('  ✅ Lista criada [' + comandosListId + ']');
    ok++;
  } catch (e) {
    console.error('  ❌ Criar lista: ' + e.message);
    fail++;
    return;
  }

  // 8. Custom fields — Comandos
  const comandosFields = [
    { name: '🎯 Categoria', type: 'drop_down', type_config: { options: [
      { name: 'Design & Visual',    color: '#e93d82' },
      { name: 'Copy & Conteúdo',    color: '#9333ea' },
      { name: 'Tráfego Pago',       color: '#3e63dd' },
      { name: 'Automação & Dev',    color: '#30a46c' },
      { name: 'Estratégia',         color: '#f76808' },
      { name: 'Email & Automação',  color: '#12a594' },
    ]}},
    { name: '🤖 Agente Principal', type: 'text', type_config: {} },
  ];
  for (const f of comandosFields) {
    try {
      await clickupRequest('POST', `/list/${comandosListId}/field`, f);
      console.log('  ✅ Campo: ' + f.name);
      ok++;
    } catch (e) {
      console.error('  ❌ Campo ' + f.name + ': ' + e.message);
      fail++;
    }
  }

  // 9. Criar tasks de comandos
  console.log('\n  📋 Comandos:');
  for (const cmd of COMANDOS) {
    try {
      const t = await clickupRequest('POST', `/list/${comandosListId}/task`, {
        name: cmd.name,
        status: 'aberto',
        description: cmd.description,
      });
      console.log('    ✅ ' + t.name + ' [' + t.id + ']');
      log('task.created', { listId: comandosListId, taskId: t.id, name: t.name, type: 'comando' });
      ok++;
    } catch (e) {
      console.error('    ❌ ' + cmd.name + ': ' + e.message);
      logError('task.created', { listId: comandosListId, name: cmd.name, error: e.message });
      fail++;
    }
    await sleep(150);
  }

  // 10. Criar lista Roadmap AIOS
  console.log('\n━━━ CRIANDO LISTA: 🗺️ Roadmap AIOS ━━━');
  let roadmapListId;
  try {
    const res = await clickupRequest('POST', `/folder/${FOLDER_ID}/list`, { name: '🗺️ Roadmap AIOS' });
    roadmapListId = res.id;
    console.log('  ✅ Lista criada [' + roadmapListId + ']');
    ok++;
  } catch (e) {
    console.error('  ❌ Criar lista: ' + e.message);
    fail++;
    return;
  }

  // 11. Custom fields — Roadmap
  const roadmapFields = [
    { name: '🏷️ Área', type: 'drop_down', type_config: { options: [
      { name: 'ClickUp / Ops',   color: '#3e63dd' },
      { name: 'BackstageFY',     color: '#30a46c' },
      { name: 'AIOS Core',       color: '#9333ea' },
      { name: 'Automação',       color: '#f76808' },
      { name: 'Clientes',        color: '#12a594' },
      { name: 'Infraestrutura',  color: '#e93d82' },
    ]}},
    { name: '⚡ Impacto', type: 'drop_down', type_config: { options: [
      { name: 'Alto',   color: '#e93d82' },
      { name: 'Médio',  color: '#f76808' },
      { name: 'Baixo',  color: '#30a46c' },
    ]}},
  ];
  for (const f of roadmapFields) {
    try {
      await clickupRequest('POST', `/list/${roadmapListId}/field`, f);
      console.log('  ✅ Campo: ' + f.name);
      ok++;
    } catch (e) {
      console.error('  ❌ Campo ' + f.name + ': ' + e.message);
      fail++;
    }
  }

  // 12. Criar tasks do roadmap
  console.log('\n  📋 Roadmap items:');
  for (const item of ROADMAP_ITEMS) {
    try {
      const t = await clickupRequest('POST', `/list/${roadmapListId}/task`, {
        name: item.name,
        status: 'aberto',
        description: item.description,
      });
      console.log('    ✅ ' + t.name + ' [' + t.id + ']');
      log('task.created', { listId: roadmapListId, taskId: t.id, name: t.name, type: 'roadmap' });
      ok++;
    } catch (e) {
      console.error('    ❌ ' + item.name + ': ' + e.message);
      logError('task.created', { listId: roadmapListId, name: item.name, error: e.message });
      fail++;
    }
    await sleep(150);
  }

  console.log('\n━━━ Concluído: ' + ok + ' ações OK, ' + fail + ' falhas ━━━');
  console.log('\n⚠️  Statuses via UI (todas as novas listas):');
  console.log('   Clones & Agentes: ATIVO | BETA | INATIVO');
  console.log('   Comandos & Prompts: VALIDADO | RASCUNHO | DESCONTINUADO');
  console.log('   Roadmap AIOS: BACKLOG | EM ANDAMENTO | CONCLUÍDO | CANCELADO');
}

run().catch(console.error);
