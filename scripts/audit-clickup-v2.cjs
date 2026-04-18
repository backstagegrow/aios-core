/**
 * audit-clickup-v2.cjs — Full audit pulling custom fields from tasks
 */
const { clickupRequest } = require('./lib/clickup-env.cjs');
const fs = require('fs');
const path = require('path');

const LISTS = {
  'SM — Via BR':        '901324514634',
  'SM — GT House':      '901324517019',
  'SM — ABA':           '901325984602',
  'SM — Grow':          '901324771638',
  'Trafego — Via BR':   '901324526552',
  'Trafego — GT':       '901324526554',
  'Trafego — Grow':     '901324771662',
  'Trafego — ABA':      '901325984626',
  'Design Web — GT':    '901326596709',
  'Design Web — Alpha': '901326596794',
  'Design Web — BKS':   '901326596815',
  'Contratos':          '901324518015',
  'Despesas':           '901326820533',
  'AIOS — Clones':      '901326820623',
  'AIOS — Comandos':    '901326820624',
  'AIOS — Roadmap':     '901326820625',
  'BackstageFY Dev':    '901325828552',
};

async function auditList(label, listId) {
  try {
    const list = await clickupRequest('GET', `/list/${listId}`);
    const statuses = (list.statuses || []).map(s => s.status);

    // Get tasks to extract custom fields
    const tasksResp = await clickupRequest('GET', `/list/${listId}/task?page=0&subtasks=false&include_closed=true`);
    const tasks = tasksResp.tasks || [];
    const taskCount = tasks.length;
    const templateTasks = tasks.filter(t => t.name.startsWith('[TEMPLATE]'));
    const templateNames = templateTasks.map(t => t.name);

    // Extract unique custom fields from first task that has them
    let fields = [];
    for (const t of tasks) {
      if (t.custom_fields && t.custom_fields.length > 0) {
        fields = t.custom_fields.map(f => ({
          name: f.name,
          type: f.type,
          id: f.id,
        }));
        break;
      }
    }

    return {
      label, listId,
      name: list.name,
      taskCount,
      templateCount: templateTasks.length,
      templateNames,
      statuses,
      fieldCount: fields.length,
      fields,
      folder: list.folder ? list.folder.name : null,
      space: list.space ? list.space.name : null,
    };
  } catch (err) {
    return { label, listId, error: err.message };
  }
}

async function main() {
  console.log('=== ClickUp Audit v2 — BKS Grow ===');
  console.log(`Date: ${new Date().toISOString().slice(0, 10)}\n`);

  const results = [];
  for (const [label, id] of Object.entries(LISTS)) {
    process.stdout.write(`  ${label}...`);
    const r = await auditList(label, id);
    results.push(r);
    console.log(r.error ? ` ERR` : ` ${r.taskCount}t/${r.fieldCount}f/${r.templateCount}tpl`);
  }

  // Output full JSON
  const jsonPath = path.resolve(__dirname, 'audit-clickup-v2-result.json');
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  console.log(`\nJSON: ${jsonPath}`);

  // Print summary table
  console.log('\n=== SUMMARY TABLE ===\n');
  console.log('| Lista | Tasks | Fields | Templates | Statuses |');
  console.log('|-------|-------|--------|-----------|----------|');
  for (const r of results) {
    if (r.error) {
      console.log(`| ${r.label} | ERROR | - | - | ${r.error} |`);
    } else {
      console.log(`| ${r.name} | ${r.taskCount} | ${r.fieldCount} | ${r.templateCount} | ${r.statuses.join(' > ')} |`);
    }
  }

  // Print fields per area
  console.log('\n=== CUSTOM FIELDS BY LIST ===\n');
  for (const r of results) {
    if (r.error || r.fields.length === 0) continue;
    console.log(`${r.name}:`);
    for (const f of r.fields) {
      console.log(`  - ${f.name} (${f.type})`);
    }
  }

  // Print templates
  console.log('\n=== TEMPLATES ===\n');
  for (const r of results) {
    if (r.error || r.templateNames.length === 0) continue;
    console.log(`${r.name}:`);
    for (const t of r.templateNames) {
      console.log(`  - ${t}`);
    }
  }
}

main().catch(err => { console.error(err); process.exit(1); });
