#!/usr/bin/env node
'use strict';

/**
 * Gera arquivos .md de agentes Claude Code para cada expert clone.
 * Lê o system_prompt do YAML e adiciona instruções de RAG do Pinecone.
 *
 * Uso: node packages/clones/cli/generate-agents.cjs
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../../..');
const EXPERTS_DIR = path.join(ROOT, 'experts');
const AGENTS_DIR = path.join(ROOT, '.claude', 'agents');

const EXPERT_MAP = {
  alex_hormozi:    { name: 'Alex Hormozi',    slug: 'alex-hormozi' },
  charlie_munger:  { name: 'Charlie Munger',   slug: 'charlie-munger' },
  chris_do:        { name: 'Chris Do',          slug: 'chris-do' },
  depesh_mandalia: { name: 'Depesh Mandalia',   slug: 'depesh-mandalia' },
  eli_goldratt:    { name: 'Eli Goldratt',      slug: 'eli-goldratt' },
  eugene_schwartz: { name: 'Eugene Schwartz',   slug: 'eugene-schwartz' },
  kasim_aslam:     { name: 'Kasim Aslam',       slug: 'kasim-aslam' },
  marty_neumeier:  { name: 'Marty Neumeier',    slug: 'marty-neumeier' },
  nassim_taleb:    { name: 'Nassim Taleb',       slug: 'nassim-taleb' },
  robert_mckee:    { name: 'Robert McKee',       slug: 'robert-mckee' },
  russell_brunson: { name: 'Russell Brunson',    slug: 'russell-brunson' },
  stefan_georgi:   { name: 'Stefan Georgi',      slug: 'stefan-georgi' },
  tallis_gomes:    { name: 'Tallis Gomes',       slug: 'tallis-gomes' },
  thiago_finch:    { name: 'Thiago Finch',       slug: 'thiago-finch' },
  todd_brown:      { name: 'Todd Brown',         slug: 'todd-brown' },
  tom_breeze:      { name: 'Tom Breeze',         slug: 'tom-breeze' },
};

/**
 * Extrai o system_prompt de um arquivo YAML sem depender de parser externo.
 * Busca o bloco `system_prompt: |` e coleta as linhas indentadas seguintes.
 */
function extractSystemPrompt(yamlContent) {
  const lines = yamlContent.split('\n');
  let inPrompt = false;
  let promptLines = [];
  let baseIndent = null;

  for (const line of lines) {
    if (!inPrompt) {
      if (line.match(/^system_prompt:\s*\|/)) {
        inPrompt = true;
      }
      continue;
    }

    // Detecta fim do bloco (linha não vazia sem indentação, ou nova chave YAML)
    if (line.trim() === '') {
      promptLines.push('');
      continue;
    }

    const indent = line.match(/^(\s*)/)[1].length;
    if (baseIndent === null) {
      baseIndent = indent;
    }

    // Se indentação menor ou igual à base (nova chave YAML), encerra
    if (indent < baseIndent) {
      break;
    }

    promptLines.push(line.slice(baseIndent));
  }

  // Remove trailing empty lines
  while (promptLines.length > 0 && promptLines[promptLines.length - 1].trim() === '') {
    promptLines.pop();
  }

  return promptLines.join('\n');
}

/**
 * Extrai o role do YAML para usar na description do agente.
 */
function extractRole(yamlContent) {
  const match = yamlContent.match(/^role:\s*(.+)$/m);
  return match ? match[1].trim() : 'Expert Clone';
}

/**
 * Gera o conteúdo do arquivo .md do agente Claude Code.
 */
function generateAgentMd(expertKey, systemPrompt, role) {
  const { name, slug } = EXPERT_MAP[expertKey];

  const ragInstructions = `
## INSTRUÇÕES DE USO DO RAG (Base de Conhecimento Dinâmica)

Antes de responder qualquer pergunta substantiva, SEMPRE execute o seguinte comando para buscar contexto relevante da sua base de conhecimento:

\`\`\`bash
node packages/clones/rag-query.cjs ${slug} "<pergunta do usuário em 5-10 palavras-chave>" 5
\`\`\`

Use os chunks retornados como contexto adicional para enriquecer sua resposta com referências específicas do material documentado. Se o RAG retornar resultados relevantes (score > 60%), cite-os naturalmente na resposta. Se não retornar nada útil, responda apenas com o DNA estático acima.

Exemplo de uso:
- Usuário pergunta: "Como criar uma oferta irresistível?"
- Execute: \`node packages/clones/rag-query.cjs ${slug} "oferta irresistível grand slam valor" 5\`
- Incorpore os chunks relevantes na resposta.
`;

  return `---
name: clone_${slug.replace(/-/g, '_')}
description: Clone digital de ${name} — ${role}. Use para consultas sobre os frameworks, metodologias e princípios de ${name}.
model: claude-sonnet-4-6
---

${systemPrompt}
${ragInstructions}`;
}

// Main
let created = 0;
let failed = 0;

for (const [expertKey, { name, slug }] of Object.entries(EXPERT_MAP)) {
  const yamlPath = path.join(EXPERTS_DIR, expertKey, `clone_${expertKey}.yaml`);

  if (!fs.existsSync(yamlPath)) {
    console.warn(`⚠️  ${name} — YAML não encontrado: ${yamlPath}`);
    failed++;
    continue;
  }

  const yamlContent = fs.readFileSync(yamlPath, 'utf-8');
  const systemPrompt = extractSystemPrompt(yamlContent);
  const role = extractRole(yamlContent);

  if (!systemPrompt || systemPrompt.trim().length < 50) {
    console.warn(`⚠️  ${name} — system_prompt vazio ou muito curto`);
    failed++;
    continue;
  }

  const agentContent = generateAgentMd(expertKey, systemPrompt, role);
  const agentPath = path.join(AGENTS_DIR, `clone_${slug.replace(/-/g, '_')}.md`);

  fs.writeFileSync(agentPath, agentContent, 'utf-8');
  const lines = systemPrompt.split('\n').length;
  console.log(`✅ ${name.padEnd(20)} → .claude/agents/clone_${slug.replace(/-/g, '_')}.md (${lines} linhas)`);
  created++;
}

console.log(`\n=== ${created} agentes criados | ${failed} falhas ===`);
