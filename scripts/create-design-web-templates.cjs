/**
 * create-design-web-templates.cjs
 * Cria 4 task templates em cada uma das 3 listas de Design Web
 * Total: 12 tasks
 */

const { clickupRequest } = require('./lib/clickup-env.cjs');

const ERICK_ID = '111906470';

const LISTS = [
  { name: 'GT House Design Web',        id: '901326596709' },
  { name: 'Alpha Business Design Web',  id: '901326596794' },
  { name: 'BKS Grow Design Web',        id: '901326596815' },
];

const TEMPLATES = [
  {
    name: '[TEMPLATE] Landing Page',
    description: [
      '## Checklist — Landing Page',
      '',
      '### Briefing',
      '- [ ] Receber objetivo da LP (captura, venda, evento)',
      '- [ ] Definir público-alvo e proposta de valor',
      '- [ ] Coletar referências visuais e conteúdo (copy, imagens)',
      '',
      '### Wireframe & Estrutura',
      '- [ ] Montar estrutura de seções (hero, benefícios, prova social, CTA)',
      '- [ ] Validar wireframe com BKS Grow',
      '',
      '### Desenvolvimento',
      '- [ ] Implementar design na plataforma do cliente',
      '- [ ] Configurar formulário / integração de conversão',
      '- [ ] Responsivo mobile e desktop',
      '',
      '### Revisão',
      '- [ ] Revisar textos e CTAs',
      '- [ ] Revisar visual e identidade da marca',
      '- [ ] Aprovação final BKS Grow',
      '',
      '### Deploy & Entrega',
      '- [ ] Publicar no domínio do cliente',
      '- [ ] Testar links e formulários em produção',
      '- [ ] Entregar URL final ao cliente',
    ].join('\n'),
  },
  {
    name: '[TEMPLATE] Banner',
    description: [
      '## Checklist — Banner',
      '',
      '### Briefing',
      '- [ ] Receber objetivo e formato (tamanhos, plataforma)',
      '- [ ] Definir mensagem principal e CTA',
      '- [ ] Coletar assets da marca (logo, cores, fontes)',
      '',
      '### Conceito',
      '- [ ] Criar 2-3 conceitos visuais',
      '- [ ] Apresentar opções para aprovação BKS Grow',
      '',
      '### Produção',
      '- [ ] Desenvolver versão aprovada em todos os tamanhos',
      '- [ ] Ajustar para cada plataforma (feed, stories, display)',
      '',
      '### Aprovação & Entrega',
      '- [ ] Revisar identidade visual e copy',
      '- [ ] Aprovação final BKS Grow',
      '- [ ] Exportar arquivos finais e entregar',
    ].join('\n'),
  },
  {
    name: '[TEMPLATE] Ajuste de Site',
    description: [
      '## Checklist — Ajuste de Site',
      '',
      '### Briefing',
      '- [ ] Mapear exatamente o que precisa ser ajustado (seção, elemento)',
      '- [ ] Confirmar acesso ao CMS / plataforma do cliente',
      '',
      '### Desenvolvimento',
      '- [ ] Executar ajuste conforme briefing',
      '- [ ] Testar em ambiente de staging ou backup',
      '',
      '### Revisão',
      '- [ ] Verificar responsivo mobile e desktop',
      '- [ ] Revisão visual com BKS Grow',
      '',
      '### Deploy',
      '- [ ] Aplicar em produção no domínio do cliente',
      '- [ ] Confirmar funcionamento pós-deploy',
      '- [ ] Registrar alteração realizada',
    ].join('\n'),
  },
  {
    name: '[TEMPLATE] Atualização de Conteúdo',
    description: [
      '## Checklist — Atualização de Conteúdo',
      '',
      '### Identificação',
      '- [ ] Listar conteúdos que precisam ser atualizados (textos, imagens, links)',
      '- [ ] Confirmar novo conteúdo aprovado pelo cliente',
      '',
      '### Execução',
      '- [ ] Substituir conteúdos no site / plataforma',
      '- [ ] Verificar formatação e alinhamento visual',
      '',
      '### Revisão',
      '- [ ] Conferir todas as alterações no site',
      '- [ ] Aprovação BKS Grow',
      '',
      '### Entrega',
      '- [ ] Publicar em produção',
      '- [ ] Confirmar que conteúdo antigo foi removido',
    ].join('\n'),
  },
];

async function createTemplates() {
  let created = 0;
  let failed = 0;

  for (const list of LISTS) {
    console.log(`\n📁 ${list.name} [${list.id}]`);

    for (const tmpl of TEMPLATES) {
      try {
        const task = await clickupRequest('POST', `/list/${list.id}/task`, {
          name: tmpl.name,
          description: tmpl.description,
          status: 'BRIEFING',
          assignees: [parseInt(ERICK_ID)],
        });
        console.log(`  ✅ ${task.name} [${task.id}]`);
        created++;
      } catch (e) {
        console.error(`  ❌ ${tmpl.name} — Erro ${e.status || '?'}: ${e.message}`);
        if (e.data) console.error('     ', JSON.stringify(e.data));
        failed++;
      }
    }
  }

  console.log(`\n--- Concluído: ${created} criadas, ${failed} falhas ---`);
}

createTemplates();
