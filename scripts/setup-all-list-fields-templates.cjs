/**
 * setup-all-list-fields-templates.cjs
 *
 * 1. Cria 4 task templates nas 4 listas de Social Media (com Formato pré-definido)
 * 2. Cria 4 novos custom fields nas 4 listas de Tráfego Pago
 * 3. Cria 2 novos custom fields nas 3 listas de Design Web
 * 4. Cria template Otimização nas 3 listas de Design Web
 */

const { clickupRequest } = require('./lib/clickup-env.cjs');

// ─── Social Media ────────────────────────────────────────────────────────────

const SM_LISTS = [
  { name: 'Via BR SM',    id: '901324514634' },
  { name: 'GT House SM',  id: '901324517019' },
  { name: 'ABA SM',       id: '901325984602' },
  { name: 'Grow SM',      id: '901324771638' },
];

// workspace-shared field — mesmo ID em todas as listas SM
const SM_FORMATO_FIELD_ID = 'bab7ab8a-b178-4dcf-bf47-c39fe7164476';

const SM_TEMPLATES = [
  {
    name: '[TEMPLATE] Reels',
    formatoOptionId: '8eb367da-1037-4aaa-9a39-845910008c18',
    description: [
      '## Checklist — Reels',
      '',
      '### Briefing & Roteiro',
      '- [ ] Definir objetivo do Reels (atrair, educar, conectar)',
      '- [ ] Escrever roteiro ou bullet points do conteúdo',
      '- [ ] Escolher gancho inicial (primeiros 3 segundos)',
      '- [ ] Definir CTA final (comentar, salvar, compartilhar, link bio)',
      '',
      '### Produção',
      '- [ ] Gravar ou separar clipes de vídeo',
      '- [ ] Editar com ritmo, cortes e legendas',
      '- [ ] Adicionar trilha sonora (trending ou branded)',
      '- [ ] Revisar qualidade visual e áudio',
      '',
      '### Copy & Identidade',
      '- [ ] Escrever legenda com gancho + valor + CTA',
      '- [ ] Selecionar hashtags relevantes',
      '- [ ] Verificar identidade visual da marca',
      '',
      '### Revisão & Aprovação',
      '- [ ] Revisão interna BKS Grow',
      '- [ ] Aprovação do cliente',
      '',
      '### Publicação',
      '- [ ] Agendar ou publicar no horário ideal',
      '- [ ] Monitorar performance nas primeiras 24h',
    ].join('\n'),
  },
  {
    name: '[TEMPLATE] Carrossel',
    formatoOptionId: 'dde7fc87-9cb6-46a5-9402-a98cd04c099b',
    description: [
      '## Checklist — Carrossel',
      '',
      '### Briefing & Estrutura',
      '- [ ] Definir tema e objetivo do carrossel',
      '- [ ] Escrever estrutura dos slides (slide 1 = gancho, slides 2-N = valor, último = CTA)',
      '- [ ] Validar número de slides (ideal: 5-10)',
      '',
      '### Design',
      '- [ ] Criar slides com identidade visual do cliente',
      '- [ ] Garantir consistência de fontes, cores e ícones',
      '- [ ] Slide de capa impactante (thumbnail)',
      '- [ ] Slide final com CTA claro',
      '',
      '### Copy',
      '- [ ] Escrever texto de cada slide (direto e escaneável)',
      '- [ ] Escrever legenda com gancho + valor + CTA',
      '- [ ] Selecionar hashtags',
      '',
      '### Revisão & Aprovação',
      '- [ ] Revisão interna BKS Grow',
      '- [ ] Aprovação do cliente',
      '',
      '### Publicação',
      '- [ ] Agendar ou publicar no horário ideal',
      '- [ ] Monitorar salvamentos e compartilhamentos nas primeiras 24h',
    ].join('\n'),
  },
  {
    name: '[TEMPLATE] Post Estático',
    formatoOptionId: '9addfe3e-211b-42ea-acf2-1e606faaddde',
    description: [
      '## Checklist — Post Estático',
      '',
      '### Briefing',
      '- [ ] Definir mensagem principal e objetivo',
      '- [ ] Coletar referências visuais ou assets necessários',
      '',
      '### Design',
      '- [ ] Criar arte com identidade visual do cliente',
      '- [ ] Garantir hierarquia visual clara (headline → suporte → CTA)',
      '- [ ] Verificar legibilidade em mobile (preview 1:1 e 4:5)',
      '',
      '### Copy',
      '- [ ] Escrever legenda alinhada ao pilar de conteúdo',
      '- [ ] CTA claro na legenda',
      '- [ ] Selecionar hashtags',
      '',
      '### Revisão & Aprovação',
      '- [ ] Revisão interna BKS Grow',
      '- [ ] Aprovação do cliente',
      '',
      '### Publicação',
      '- [ ] Agendar ou publicar',
      '- [ ] Monitorar engajamento',
    ].join('\n'),
  },
  {
    name: '[TEMPLATE] Stories',
    formatoOptionId: 'cbc79c4d-0411-4cae-b1ff-08aa7ee011f8',
    description: [
      '## Checklist — Stories',
      '',
      '### Briefing',
      '- [ ] Definir objetivo (engajamento, tráfego, venda, bastidores)',
      '- [ ] Definir sequência de stories (3-7 telas)',
      '',
      '### Produção',
      '- [ ] Criar/montar cada tela no formato 9:16',
      '- [ ] Adicionar elemento interativo se aplicável (enquete, pergunta, quiz, link)',
      '- [ ] Verificar identidade visual e tom de voz',
      '',
      '### Copy',
      '- [ ] Texto de cada story: direto, escaneável, sem excesso',
      '- [ ] CTA na última tela (swipe up, responder, clicar no link)',
      '',
      '### Revisão & Aprovação',
      '- [ ] Revisão interna BKS Grow',
      '- [ ] Aprovação do cliente',
      '',
      '### Publicação',
      '- [ ] Publicar ou agendar',
      '- [ ] Verificar que links e elementos interativos estão funcionando',
    ].join('\n'),
  },
];

// ─── Tráfego Pago ─────────────────────────────────────────────────────────────

const TRAFEGO_LISTS = [
  { name: 'Via BR Tráfego',  id: '901324526552' },
  { name: 'GT Tráfego',      id: '901324526554' },
  { name: 'Grow Tráfego',    id: '901324771662' },
  { name: 'ABA Tráfego',     id: '901325984626' },
];

const TRAFEGO_NEW_FIELDS = [
  {
    name: '🎯 Objetivo do Anúncio',
    type: 'drop_down',
    type_config: {
      options: [
        { name: 'Alcance',              color: '#3e63dd' },
        { name: 'Tráfego',              color: '#30a46c' },
        { name: 'Engajamento',          color: '#f76808' },
        { name: 'Geração de Leads',     color: '#e93d82' },
        { name: 'Conversão',            color: '#9333ea' },
        { name: 'Visualização de Vídeo',color: '#12a594' },
      ],
    },
  },
  {
    name: '📣 Plataforma',
    type: 'drop_down',
    type_config: {
      options: [
        { name: 'Meta Ads',    color: '#3e63dd' },
        { name: 'Google Ads',  color: '#30a46c' },
        { name: 'TikTok Ads',  color: '#0091ff' },
        { name: 'YouTube Ads', color: '#e93d82' },
      ],
    },
  },
  {
    name: '🖥️ Formato do Anúncio',
    type: 'drop_down',
    type_config: {
      options: [
        { name: 'Imagem Estática', color: '#12a594' },
        { name: 'Carrossel',       color: '#f76808' },
        { name: 'Vídeo',           color: '#9333ea' },
        { name: 'Stories / Reels', color: '#e93d82' },
        { name: 'Texto',           color: '#30a46c' },
      ],
    },
  },
  {
    name: '📅 Data de Veiculação',
    type: 'date',
    type_config: {},
  },
];

// ─── Design Web ───────────────────────────────────────────────────────────────

const DESIGN_WEB_LISTS = [
  { name: 'GT Design Web',    id: '901326596709' },
  { name: 'Alpha Design Web', id: '901326596794' },
  { name: 'BKS Design Web',   id: '901326596815' },
];

const DESIGN_WEB_NEW_FIELDS = [
  {
    name: '📱 Responsivo Verificado',
    type: 'checkbox',
    type_config: {},
  },
  {
    name: '🔗 Link de Staging',
    type: 'url',
    type_config: {},
  },
];

const OTIMIZACAO_TEMPLATE = {
  name: '[TEMPLATE] Otimização de Página',
  status: 'BRIEFING',
  assignees: [111906470], // Erick Sena
  description: [
    '## Checklist — Otimização de Página Existente',
    '',
    '### Diagnóstico Inicial',
    '- [ ] Mapear o que está funcionando e o que precisa melhorar',
    '- [ ] Revisar métricas da página atual (taxa de conversão, bounce, heatmap)',
    '- [ ] Listar todas as alterações solicitadas pelo cliente',
    '',
    '### Visual & Layout',
    '- [ ] Revisar hierarquia visual — headline, subhead, imagem de apoio',
    '- [ ] Verificar fontes, cores e consistência com identidade da marca',
    '- [ ] Ajustar imagens: foto no hero, vídeo em seção dedicada (se aplicável)',
    '- [ ] Verificar espaçamentos e alinhamentos em todas as seções',
    '- [ ] Revisar responsividade mobile — checar cada seção no celular',
    '',
    '### Copy & CTAs',
    '- [ ] Substituir termos genéricos por linguagem específica do nicho',
    '- [ ] Tornar copy mais direta, provocativa e orientada a dor real',
    '- [ ] Revisar headline principal — está gerando impacto nos primeiros 3s?',
    '- [ ] Ajustar textos de botão — CTA com verbo de ação + benefício',
    '- [ ] Posicionar "vagas limitadas" / urgência acima do CTA principal',
    '- [ ] Revisar seções de cenários / dores — usar linguagem que aponta para o leitor',
    '',
    '### Prova Social & Autoridade',
    '- [ ] Atualizar ou curar depoimentos — manter só os mais impactantes',
    '- [ ] Adicionar logos de clientes/empresas atendidas próximo à primeira dobra',
    '- [ ] Verificar fotos e nomes dos mentores/responsáveis — dados corretos',
    '- [ ] Revisar números e resultados exibidos — conferir veracidade e impacto',
    '',
    '### Oferta & Conversão',
    '- [ ] Revisar clareza da oferta — o que o visitante recebe ao converter?',
    '- [ ] Verificar se benefícios estão acima da linha do clique',
    '- [ ] Testar se formulário / botão CTA está funcionando corretamente',
    '- [ ] Confirmar integração com CRM / ferramenta de captura',
    '',
    '### Técnico & Deploy',
    '- [ ] Verificar responsividade em mobile, tablet e desktop',
    '- [ ] Testar velocidade de carregamento (PageSpeed / GTmetrix)',
    '- [ ] Revisar meta title e meta description para SEO básico',
    '- [ ] Publicar em staging para aprovação antes do deploy final',
    '- [ ] Deploy em produção no domínio do cliente',
    '- [ ] Confirmar todos os links e formulários funcionando em produção',
  ].join('\n'),
};

// ─── Runner ───────────────────────────────────────────────────────────────────

async function createField(listId, fieldDef) {
  return clickupRequest('POST', `/list/${listId}/field`, fieldDef);
}

async function createTask(listId, taskDef) {
  return clickupRequest('POST', `/list/${listId}/task`, taskDef);
}

async function run() {
  let ok = 0, fail = 0;

  // 1. SM Templates
  console.log('\n━━━ SOCIAL MEDIA TEMPLATES ━━━');
  for (const list of SM_LISTS) {
    console.log(`\n📁 ${list.name}`);
    for (const tmpl of SM_TEMPLATES) {
      try {
        const task = await createTask(list.id, {
          name: tmpl.name,
          description: tmpl.description,
          status: 'aberto',
          custom_fields: [
            { id: SM_FORMATO_FIELD_ID, value: tmpl.formatoOptionId },
          ],
        });
        console.log(`  ✅ ${task.name} [${task.id}]`);
        ok++;
      } catch (e) {
        console.error(`  ❌ ${tmpl.name} — ${e.status}: ${e.message}`);
        fail++;
      }
    }
  }

  // 2. Tráfego Pago — novos campos
  console.log('\n━━━ TRÁFEGO PAGO — NOVOS CAMPOS ━━━');
  for (const list of TRAFEGO_LISTS) {
    console.log(`\n📁 ${list.name}`);
    for (const field of TRAFEGO_NEW_FIELDS) {
      try {
        const res = await createField(list.id, field);
        console.log(`  ✅ ${field.name} [${res.id}]`);
        ok++;
      } catch (e) {
        console.error(`  ❌ ${field.name} — ${e.status}: ${e.message}`);
        if (e.data) console.error('    ', JSON.stringify(e.data));
        fail++;
      }
    }
  }

  // 3. Design Web — novos campos
  console.log('\n━━━ DESIGN WEB — NOVOS CAMPOS ━━━');
  for (const list of DESIGN_WEB_LISTS) {
    console.log(`\n📁 ${list.name}`);
    for (const field of DESIGN_WEB_NEW_FIELDS) {
      try {
        const res = await createField(list.id, field);
        console.log(`  ✅ ${field.name} [${res.id}]`);
        ok++;
      } catch (e) {
        console.error(`  ❌ ${field.name} — ${e.status}: ${e.message}`);
        if (e.data) console.error('    ', JSON.stringify(e.data));
        fail++;
      }
    }
  }

  // 4. Design Web — template Otimização
  console.log('\n━━━ DESIGN WEB — TEMPLATE OTIMIZAÇÃO ━━━');
  for (const list of DESIGN_WEB_LISTS) {
    try {
      const task = await createTask(list.id, { ...OTIMIZACAO_TEMPLATE });
      console.log(`  ✅ ${list.name} → ${task.name} [${task.id}]`);
      ok++;
    } catch (e) {
      console.error(`  ❌ ${list.name} — ${e.status}: ${e.message}`);
      fail++;
    }
  }

  console.log(`\n━━━ Concluído: ${ok} criados, ${fail} falhas ━━━`);
}

run();
