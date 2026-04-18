/**
 * create-trafego-templates.cjs
 * Cria template de anúncio nas 4 listas de Tráfego Pago
 * com subtask de monitoramento integrada ao fluxo
 */

const { clickupRequest } = require('./lib/clickup-env.cjs');

const TRAFEGO_LISTS = [
  { name: 'Via BR Trafego', id: '901324526552' },
  { name: 'GT Trafego',     id: '901324526554' },
  { name: 'Grow Trafego',   id: '901324771662' },
  { name: 'ABA Trafego',    id: '901325984626' },
];

const TEMPLATE = {
  name: '[TEMPLATE] Anuncio',
  description: [
    '## Anuncio — Fluxo Completo',
    '',
    '### Briefing',
    '- [ ] Definir objetivo do anuncio (campo: Objetivo do Anuncio)',
    '- [ ] Definir plataforma (campo: Plataforma)',
    '- [ ] Definir formato (campo: Formato do Anuncio)',
    '- [ ] Alinhar publico-alvo e segmentacao',
    '- [ ] Definir orcamento e periodo de veiculacao',
    '',
    '### Criativo',
    '- [ ] Solicitar/produzir criativo (Design Web ou Social Media)',
    '- [ ] Revisar copy e CTA do anuncio',
    '- [ ] Aprovar criativo com cliente',
    '',
    '### Configuracao',
    '- [ ] Subir criativo na plataforma',
    '- [ ] Configurar segmentacao e orcamento',
    '- [ ] Revisao final antes de publicar',
    '- [ ] Aprovacao do cliente',
    '',
    '### Go Live',
    '- [ ] Publicar anuncio',
    '- [ ] Mudar status para "Veiculando nos Ads"',
    '- [ ] Criar subtask: "Monitorar: [nome do anuncio]" com prazo 7 dias',
    '',
    '### Monitoramento (subtask)',
    '- [ ] Verificar CTR, CPC e CPL no D+2',
    '- [ ] Verificar resultados no D+7',
    '- [ ] Escalar ou pausar conforme performance',
    '- [ ] Registrar aprendizados no campo Notas',
    '',
    '### Encerramento',
    '- [ ] Pausar anuncio',
    '- [ ] Fechar subtask de monitoramento',
    '- [ ] Mudar status para "Concluido"',
    '- [ ] Registrar resultado final',
  ].join('\n'),
};

async function run() {
  let ok = 0, fail = 0;
  console.log('\n=== TEMPLATES — TRAFEGO PAGO ===');

  for (const list of TRAFEGO_LISTS) {
    console.log(`\n${list.name}`);
    try {
      // get first available status
      const info = await clickupRequest('GET', `/list/${list.id}`);
      const status = info.statuses?.[0]?.status ?? 'to do';

      const task = await clickupRequest('POST', `/list/${list.id}/task`, {
        ...TEMPLATE,
        status,
      });
      console.log(`  OK  ${task.name} [${task.id}] (status: ${status})`);
      ok++;
    } catch (e) {
      console.error(`  ERR ${list.name} -- ${e.status}: ${e.message}`);
      fail++;
    }
  }

  console.log(`\n=== Concluido: ${ok} criados, ${fail} falhas ===`);
}

run().catch(console.error);
