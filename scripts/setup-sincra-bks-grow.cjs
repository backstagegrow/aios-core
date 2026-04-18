/**
 * setup-sincra-bks-grow.cjs
 *
 * Aplica Método Síncra adaptado ao BKS Grow:
 * 1. Campo 🤖 Executor (Humano / AIOS / Híbrido) → SM, Tráfego, Design Web
 * 2. Campo 📋 Contexto Mínimo (Journey Log) → SM (4 listas)
 * 3. Campo 🧬 Tom de Voz → SM (4 listas)
 */

const { clickupRequest } = require('./lib/clickup-env.cjs');

const SM_LISTS = [
  { name: 'Via BR SM',   id: '901324514634' },
  { name: 'GT House SM', id: '901324517019' },
  { name: 'ABA SM',      id: '901325984602' },
  { name: 'Grow SM',     id: '901324771638' },
];

const TRAFEGO_LISTS = [
  { name: 'Via BR Tráfego', id: '901324526552' },
  { name: 'GT Tráfego',     id: '901324526554' },
  { name: 'Grow Tráfego',   id: '901324771662' },
  { name: 'ABA Tráfego',    id: '901325984626' },
];

const DESIGN_WEB_LISTS = [
  { name: 'GT Design Web',    id: '901326596709' },
  { name: 'Alpha Design Web', id: '901326596794' },
  { name: 'BKS Design Web',   id: '901326596815' },
];

// ─── Campo Executor (todas as listas operacionais) ────────────────────────────

const EXECUTOR_FIELD = {
  name: 'Executor',
  type: 'drop_down',
  type_config: {
    options: [
      { name: 'Humano',  color: '#30a46c' },
      { name: 'AIOS',    color: '#0091ff' },
      { name: 'Híbrido', color: '#9333ea' },
    ],
  },
};

// ─── Campos exclusivos das listas de Social Media ─────────────────────────────

const CONTEXTO_MINIMO_FIELD = {
  name: 'Contexto Minimo',
  type: 'text',
  type_config: {},
};

const TOM_DE_VOZ_FIELD = {
  name: 'Tom de Voz',
  type: 'text',
  type_config: {},
};

// ─── Runner ───────────────────────────────────────────────────────────────────

async function addField(list, fieldDef) {
  try {
    const res = await clickupRequest('POST', `/list/${list.id}/field`, fieldDef);
    console.log(`  OK  ${fieldDef.name} [${res.id}]`);
    return true;
  } catch (e) {
    console.error(`  ERR ${fieldDef.name} -- ${e.status}: ${e.message}`);
    return false;
  }
}

async function run() {
  let ok = 0, fail = 0;

  // 1. Executor em Social Media
  console.log('\n=== EXECUTOR — SOCIAL MEDIA ===');
  for (const list of SM_LISTS) {
    console.log(`\n${list.name}`);
    (await addField(list, EXECUTOR_FIELD)) ? ok++ : fail++;
  }

  // 2. Executor em Tráfego Pago
  console.log('\n=== EXECUTOR — TRAFEGO PAGO ===');
  for (const list of TRAFEGO_LISTS) {
    console.log(`\n${list.name}`);
    (await addField(list, EXECUTOR_FIELD)) ? ok++ : fail++;
  }

  // 3. Executor em Design Web
  console.log('\n=== EXECUTOR — DESIGN WEB ===');
  for (const list of DESIGN_WEB_LISTS) {
    console.log(`\n${list.name}`);
    (await addField(list, EXECUTOR_FIELD)) ? ok++ : fail++;
  }

  // 4. Contexto Mínimo em Social Media (Journey Log)
  console.log('\n=== CONTEXTO MINIMO — SOCIAL MEDIA ===');
  for (const list of SM_LISTS) {
    console.log(`\n${list.name}`);
    (await addField(list, CONTEXTO_MINIMO_FIELD)) ? ok++ : fail++;
  }

  // 5. Tom de Voz em Social Media
  console.log('\n=== TOM DE VOZ — SOCIAL MEDIA ===');
  for (const list of SM_LISTS) {
    console.log(`\n${list.name}`);
    (await addField(list, TOM_DE_VOZ_FIELD)) ? ok++ : fail++;
  }

  console.log(`\n=== Concluido: ${ok} criados, ${fail} falhas ===`);
}

run().catch(console.error);
