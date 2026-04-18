/**
 * setup-gestao-empresarial.cjs
 *
 * Reestrutura as 3 pastas da gestão empresarial BKS Grow:
 * 1. Contratos — renomeia lista + adiciona campos + cria template
 * 2. Financeiro — renomeia lista existente (Receitas) + cria Despesas + campos + templates
 * 3. Relatórios — renomeia 3 listas + adiciona campos + cria templates
 */

const { clickupRequest } = require('./lib/clickup-env.cjs');

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function renameList(listId, name) {
  return clickupRequest('PUT', `/list/${listId}`, { name });
}

async function createList(folderId, name) {
  return clickupRequest('POST', `/folder/${folderId}/list`, { name });
}

async function addField(listId, field) {
  return clickupRequest('POST', `/list/${listId}/field`, field);
}

async function createTask(listId, task) {
  return clickupRequest('POST', `/list/${listId}/task`, task);
}

// ─── Contratos ────────────────────────────────────────────────────────────────
// Folder: 901316467953 | Lista atual: 901324518015

async function setupContratos() {
  console.log('\n━━━ CONTRATOS ━━━');
  const LIST_ID = '901324518015';

  // 1. Renomear lista
  await renameList(LIST_ID, 'Contratos Ativos');
  console.log('  ✅ Lista renomeada → Contratos Ativos');

  // 2. Custom fields
  const fields = [
    {
      name: '💰 Valor Mensal',
      type: 'currency',
      type_config: { default: 0, precision: 2, separator: 'comma' },
    },
    {
      name: '📋 Tipo de Serviço',
      type: 'drop_down',
      type_config: {
        options: [
          { name: 'Gestão de Tráfego',  color: '#3e63dd' },
          { name: 'Social Media',       color: '#30a46c' },
          { name: 'Full Service',       color: '#9333ea' },
          { name: 'Design Web',         color: '#f76808' },
          { name: 'Consultoria',        color: '#12a594' },
        ],
      },
    },
    {
      name: '📅 Início do Contrato',
      type: 'date',
      type_config: {},
    },
    {
      name: '🔄 Renovação',
      type: 'date',
      type_config: {},
    },
    {
      name: '🔗 Link do Contrato',
      type: 'url',
      type_config: {},
    },
  ];

  for (const f of fields) {
    try {
      await addField(LIST_ID, f);
      console.log('  ✅ Campo: ' + f.name);
    } catch (e) {
      console.error('  ❌ Campo ' + f.name + ': ' + e.message);
    }
  }

  // 3. Templates — um por cliente ativo
  const clientes = ['Via BR', 'GT House', 'Backstage Grow', 'Imersão ABA'];
  for (const cliente of clientes) {
    try {
      const t = await createTask(LIST_ID, {
        name: cliente,
        status: 'aberto',
        description: [
          '## Contrato — ' + cliente,
          '',
          '### Dados do Contrato',
          '- **Cliente:** ' + cliente,
          '- **Tipo de Serviço:** (preencher)',
          '- **Valor Mensal:** R$ (preencher)',
          '- **Início:** (preencher)',
          '- **Renovação:** (preencher)',
          '',
          '### Escopo dos Serviços',
          '- [ ] Listar serviços contratados',
          '- [ ] Definir entregáveis mensais',
          '- [ ] Definir SLA e prazos',
          '',
          '### Documentos',
          '- [ ] Contrato assinado (link acima)',
          '- [ ] Proposta comercial',
          '- [ ] NF/Recibo mensal',
        ].join('\n'),
      });
      console.log('  ✅ Task: ' + t.name + ' [' + t.id + ']');
    } catch (e) {
      console.error('  ❌ Task ' + cliente + ': ' + e.message);
    }
  }

  // 4. Nota sobre statuses (via UI)
  console.log('\n  ⚠️  Configure os statuses via UI:');
  console.log('     EM ELABORAÇÃO → ENVIADO → ASSINADO → ATIVO → RENOVAÇÃO → ENCERRADO');
}

// ─── Financeiro ───────────────────────────────────────────────────────────────
// Folder: 901316467965 | Lista atual: 901324518030 (virar Receitas)

async function setupFinanceiro() {
  console.log('\n━━━ FINANCEIRO ━━━');
  const FOLDER_ID = '901316467965';
  const RECEITAS_ID = '901324518030';

  // 1. Renomear lista atual para Receitas
  await renameList(RECEITAS_ID, '💰 Receitas');
  console.log('  ✅ Lista renomeada → 💰 Receitas');

  // 2. Criar lista Despesas
  const despesasRes = await createList(FOLDER_ID, '💸 Despesas');
  const DESPESAS_ID = despesasRes.id;
  console.log('  ✅ Lista criada → 💸 Despesas [' + DESPESAS_ID + ']');

  // 3. Campos — Receitas
  const receitasFields = [
    {
      name: '💵 Valor',
      type: 'currency',
      type_config: { default: 0, precision: 2, separator: 'comma' },
    },
    {
      name: '📅 Data de Recebimento',
      type: 'date',
      type_config: {},
    },
    {
      name: '🏷️ Status Financeiro',
      type: 'drop_down',
      type_config: {
        options: [
          { name: 'A Receber', color: '#f76808' },
          { name: 'Recebido',  color: '#30a46c' },
          { name: 'Atrasado',  color: '#e93d82' },
        ],
      },
    },
    {
      name: '🔗 Comprovante',
      type: 'url',
      type_config: {},
    },
  ];

  console.log('\n  📋 Campos — Receitas:');
  for (const f of receitasFields) {
    try {
      await addField(RECEITAS_ID, f);
      console.log('    ✅ ' + f.name);
    } catch (e) {
      console.error('    ❌ ' + f.name + ': ' + e.message);
    }
  }

  // 4. Campos — Despesas
  const despesasFields = [
    {
      name: '💵 Valor',
      type: 'currency',
      type_config: { default: 0, precision: 2, separator: 'comma' },
    },
    {
      name: '📅 Data de Vencimento',
      type: 'date',
      type_config: {},
    },
    {
      name: '🏷️ Status Financeiro',
      type: 'drop_down',
      type_config: {
        options: [
          { name: 'A Pagar', color: '#f76808' },
          { name: 'Pago',    color: '#30a46c' },
          { name: 'Atrasado',color: '#e93d82' },
        ],
      },
    },
    {
      name: '🗂️ Categoria',
      type: 'drop_down',
      type_config: {
        options: [
          { name: 'Ferramentas / SaaS', color: '#3e63dd' },
          { name: 'Freelancer',         color: '#9333ea' },
          { name: 'Infraestrutura',     color: '#12a594' },
          { name: 'Marketing',          color: '#f76808' },
          { name: 'Impostos / Taxas',   color: '#e93d82' },
          { name: 'Outros',             color: '#888' },
        ],
      },
    },
    {
      name: '🔄 Recorrente',
      type: 'checkbox',
      type_config: {},
    },
  ];

  console.log('\n  📋 Campos — Despesas:');
  for (const f of despesasFields) {
    try {
      await addField(DESPESAS_ID, f);
      console.log('    ✅ ' + f.name);
    } catch (e) {
      console.error('    ❌ ' + f.name + ': ' + e.message);
    }
  }

  // 5. Templates Receitas — um por cliente
  const clientes = ['Via BR', 'GT House', 'Backstage Grow', 'Imersão ABA'];
  console.log('\n  📋 Tasks — Receitas:');
  for (const c of clientes) {
    try {
      const t = await createTask(RECEITAS_ID, {
        name: c + ' — Mensalidade',
        status: 'aberto',
        description: '- Referente ao contrato de gestão mensal\n- Preencher valor e data de recebimento',
      });
      console.log('    ✅ ' + t.name + ' [' + t.id + ']');
    } catch (e) {
      console.error('    ❌ ' + c + ': ' + e.message);
    }
  }

  // 6. Templates Despesas — recorrentes comuns
  const despesas = [
    { name: 'ClickUp',           cat: 'Ferramentas / SaaS' },
    { name: 'Claude / Anthropic',cat: 'Ferramentas / SaaS' },
    { name: 'Meta Business Suite',cat: 'Ferramentas / SaaS' },
    { name: 'Cloudflare',        cat: 'Infraestrutura' },
    { name: 'Freelancer — Vitória', cat: 'Freelancer' },
    { name: 'Imposto / DAS MEI', cat: 'Impostos / Taxas' },
  ];
  console.log('\n  📋 Tasks — Despesas:');
  for (const d of despesas) {
    try {
      const t = await createTask(DESPESAS_ID, {
        name: d.name,
        status: 'aberto',
        description: '- Categoria: ' + d.cat + '\n- Preencher valor e data de vencimento',
      });
      console.log('    ✅ ' + t.name + ' [' + t.id + ']');
    } catch (e) {
      console.error('    ❌ ' + d.name + ': ' + e.message);
    }
  }

  console.log('\n  ⚠️  Configure os statuses via UI:');
  console.log('     Receitas: A RECEBER → RECEBIDO → ATRASADO');
  console.log('     Despesas: A PAGAR → PAGO → ATRASADO');
}

// ─── Relatórios ───────────────────────────────────────────────────────────────
// Folder: 901317383741
// Listas: Relatório Total (819456) | Processos/Onboarding (910804) | Squad Alta Diretoria (890751)

async function setupRelatorios() {
  console.log('\n━━━ RELATÓRIOS ━━━');

  const LISTAS = [
    { id: '901325819456', novoNome: '📊 Relatórios de Clientes' },
    { id: '901325910804', novoNome: '💰 Relatórios Financeiros' },
    { id: '901325890751', novoNome: '⚙️ Relatórios Operacionais' },
  ];

  // 1. Renomear
  for (const l of LISTAS) {
    try {
      await renameList(l.id, l.novoNome);
      console.log('  ✅ Renomeada → ' + l.novoNome);
    } catch (e) {
      console.error('  ❌ Rename ' + l.id + ': ' + e.message);
    }
  }

  // 2. Campos comuns a todas as listas de relatório
  const camposRelatorio = [
    {
      name: '📅 Período de Referência',
      type: 'date',
      type_config: {},
    },
    {
      name: '👤 Cliente / Área',
      type: 'drop_down',
      type_config: {
        options: [
          { name: 'Via BR',          color: '#3e63dd' },
          { name: 'GT House',        color: '#30a46c' },
          { name: 'Backstage Grow',  color: '#f76808' },
          { name: 'Imersão ABA',     color: '#9333ea' },
          { name: 'Interno BKS',     color: '#12a594' },
        ],
      },
    },
    {
      name: '🔗 Link do Relatório',
      type: 'url',
      type_config: {},
    },
  ];

  for (const l of LISTAS) {
    console.log('\n  📁 ' + l.novoNome + ':');
    for (const f of camposRelatorio) {
      try {
        await addField(l.id, f);
        console.log('    ✅ ' + f.name);
      } catch (e) {
        console.error('    ❌ ' + f.name + ': ' + e.message);
      }
    }
  }

  // 3. Templates — Relatório de Clientes (mensal)
  const [relClientes, relFinanceiro, relOperacional] = LISTAS;
  const clientes = ['Via BR', 'GT House', 'Backstage Grow', 'Imersão ABA'];

  console.log('\n  📋 Templates — Relatórios de Clientes:');
  for (const c of clientes) {
    try {
      const t = await createTask(relClientes.id, {
        name: '[TEMPLATE] Relatório Mensal — ' + c,
        status: 'aberto',
        description: [
          '## Relatório Mensal — ' + c,
          '',
          '### Resultados de Social Media',
          '- Alcance total: ',
          '- Impressões: ',
          '- Engajamento médio: ',
          '- Melhor post do mês: ',
          '',
          '### Resultados de Tráfego Pago',
          '- Investimento: R$',
          '- CPL (Custo por Lead): R$',
          '- Leads gerados: ',
          '- ROAS: ',
          '',
          '### Entregas do Mês',
          '- [ ] Posts publicados: (N)',
          '- [ ] Campanhas rodando: (N)',
          '- [ ] Páginas/peças entregues: (N)',
          '',
          '### Próximos Passos',
          '- [ ] ',
          '- [ ] ',
          '',
          '### Observações',
          '(Campo livre para anotações e insights)',
        ].join('\n'),
      });
      console.log('    ✅ ' + t.name + ' [' + t.id + ']');
    } catch (e) {
      console.error('    ❌ ' + c + ': ' + e.message);
    }
  }

  // 4. Template — Relatório Financeiro (DRE mensal)
  console.log('\n  📋 Templates — Relatórios Financeiros:');
  try {
    const t = await createTask(relFinanceiro.id, {
      name: '[TEMPLATE] DRE Mensal — BKS Grow',
      status: 'aberto',
      description: [
        '## DRE Mensal — BKS Grow',
        '**Mês/Ano:** ',
        '',
        '### Receitas',
        '| Cliente | Valor |',
        '|---------|-------|',
        '| Via BR | R$ |',
        '| GT House | R$ |',
        '| Backstage Grow | R$ |',
        '| Imersão ABA | R$ |',
        '| **Total Receitas** | **R$** |',
        '',
        '### Despesas',
        '| Item | Valor |',
        '|------|-------|',
        '| Ferramentas / SaaS | R$ |',
        '| Freelancers | R$ |',
        '| Impostos | R$ |',
        '| Outros | R$ |',
        '| **Total Despesas** | **R$** |',
        '',
        '### Resultado',
        '- **Receita Bruta:** R$',
        '- **Total Despesas:** R$',
        '- **Lucro Líquido:** R$',
        '- **Lucro por Sócio:** R$',
      ].join('\n'),
    });
    console.log('    ✅ ' + t.name + ' [' + t.id + ']');
  } catch (e) {
    console.error('    ❌ DRE: ' + e.message);
  }

  // 5. Template — Relatório Operacional
  console.log('\n  📋 Templates — Relatórios Operacionais:');
  try {
    const t = await createTask(relOperacional.id, {
      name: '[TEMPLATE] Review Operacional Semanal',
      status: 'aberto',
      description: [
        '## Review Operacional Semanal',
        '**Semana:** ',
        '',
        '### Entregas da Semana',
        '- [ ] Social Media: posts publicados?',
        '- [ ] Tráfego: campanhas ativas?',
        '- [ ] Design: entregas concluídas?',
        '- [ ] Relatórios de clientes: enviados?',
        '',
        '### Pendências em Aberto',
        '- (listar)',
        '',
        '### Time',
        '- **Vitória:** (status)',
        '- **Henrique:** (status)',
        '- **Erick:** (status)',
        '',
        '### Alertas / Riscos',
        '- (listar qualquer cliente com problema ou risco de churn)',
        '',
        '### Prioridades da Próxima Semana',
        '- [ ] ',
        '- [ ] ',
        '- [ ] ',
      ].join('\n'),
    });
    console.log('    ✅ ' + t.name + ' [' + t.id + ']');
  } catch (e) {
    console.error('    ❌ Review Operacional: ' + e.message);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function run() {
  await setupContratos();
  await setupFinanceiro();
  await setupRelatorios();
  console.log('\n━━━ Reestruturação concluída ━━━');
}

run().catch(console.error);
