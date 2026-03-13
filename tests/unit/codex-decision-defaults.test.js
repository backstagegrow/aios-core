'use strict';

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..', '..');

function readProjectFile(relativePath) {
  return fs.readFileSync(path.join(PROJECT_ROOT, relativePath), 'utf8');
}

describe('Codex decision defaults operationalization', () => {
  test('codex template includes decision defaults section', () => {
    const template = readProjectFile('.aios-core/product/templates/ide-rules/codex-rules.md');

    expect(template).toContain('## Decision Defaults');
    expect(template).toContain('Classifique antes de agir');
    expect(template).toContain('Fonte de referencia: `docs/plans/2026-03-13-user-decision-map.md`');
  });

  test('AGENTS.md reflects decision defaults section', () => {
    const agents = readProjectFile('AGENTS.md');

    expect(agents).toContain('## Decision Defaults');
    expect(agents).toContain('Prefira regra explicita, playbook e fonte unica de verdade');
    expect(agents).toContain('Escale ao usuario apenas quando a decisao mudar direcao de negocio');
  });
});
