# Clone Readiness Matrix

Data: 2026-03-12  
Escopo auditado: `experts/alex_hormozi`, `charlie_munger`, `chris_do`, `depesh_mandalia`, `eli_goldratt`, `eugene_schwartz`, `kasim_aslam`, `lucas_silva`, `marty_neumeier`, `robert_mckee`, `russell_brunson`, `stefan_georgi`, `thiago_finch`, `todd_brown`, `tom_breeze`

## Criterio de classificacao

- `Operational`: YAML no schema completo do template atual, com `system_prompt` utilizavel e sinais claros de governanca/calibracao.
- `Draft`: schema completo, mas com base documental ainda insuficiente para promocao a ativo.
- `Profile-only`: DNA e YAML existem, mas o YAML ainda nao segue o schema operacional atual.

## Resumo Executivo

- `Operational`: 14 clones
- `Draft`: 1 clone
- `Profile-only`: 0 clones
- Principal risco: coexistencia de dois schemas incompatíveis no catalogo historico.
- Principal evidencia tecnica: [finch-agent.ts](/d:/001Gravity/aios-core/src/llm/finch-agent.ts#L19) *(coming soon)* le `data.system_prompt`, o que so funciona com clones no schema completo.

## Matriz

| Clone | Schema atual | Readiness | Evidencias principais | Gaps para fechar |
| --- | --- | --- | --- | --- |
| `thiago_finch` | Completo | Operational | `clone_thiago_finch.yaml`, `dna/compiled_dna.md`, `README.md`, `raw/`, notebooks, integracao em `src/llm/finch-agent.ts`, referencia em `squads/nexus-copy-elite/persuasion_maestro.yaml` | Calibracao real ainda pendente; padronizar `status` final |
| `todd_brown` | Completo | Operational | `clone_todd_brown.yaml`, `dna/compiled_dna.md`, 6 notebooks, `clone_metadata`, `calibration_questions` | Adicionar `README.md` e material bruto para melhorar auditabilidade |
| `alex_hormozi` | Completo | Operational | `clone_alex_hormozi.yaml`, `dna/compiled_dna.md`, 4 notebooks, `README.md`, `clone_metadata`, `calibration_questions` | Integrar a um consumidor real quando houver necessidade |
| `eugene_schwartz` | Completo | Operational | `clone_eugene_schwartz.yaml`, `dna/compiled_dna.md`, 2 notebooks, `README.md`, `clone_metadata`, `calibration_questions` | Integrar a um consumidor real quando houver necessidade |
| `chris_do` | Completo | Operational | `clone_chris_do.yaml`, `dna/compiled_dna.md`, 2 notebooks, `README.md`, `clone_metadata`, `calibration_questions` | Integrar a pipeline de paginas e direcao visual |
| `russell_brunson` | Completo | Operational | `clone_russell_brunson.yaml`, `dna/compiled_dna.md`, 4 notebooks, `README.md`, `clone_metadata`, `calibration_questions` | Integrar a pipeline de funis e jornada de oferta |
| `stefan_georgi` | Completo | Operational | `clone_stefan_georgi.yaml`, `dna/compiled_dna.md`, 2 notebooks, `README.md`, `clone_metadata`, `calibration_questions` | Integrar a pipeline de copy/VSL e validacao de mecanismo |
| `tom_breeze` | Completo | Operational | `clone_tom_breeze.yaml`, `dna/compiled_dna.md`, 2 notebooks, `README.md`, `clone_metadata`, `calibration_questions` | Integrar a pipeline de YouTube Ads, VSL curta e video sequencing |
| `depesh_mandalia` | Completo | Operational | `clone_depesh_mandalia.yaml`, `dna/compiled_dna.md`, 4 notebooks, `README.md`, `clone_metadata`, `calibration_questions` | Integrar a pipeline de Meta scaling, creative testing e AC-4 |
| `kasim_aslam` | Completo | Operational | `clone_kasim_aslam.yaml`, `dna/compiled_dna.md`, 2 notebooks, `README.md`, `clone_metadata`, `calibration_questions` | Integrar a pipeline de Google intent, PMax e aquisicao |
| `charlie_munger` | Completo | Operational | `clone_charlie_munger.yaml`, `dna/compiled_dna.md`, 3 notebooks, `README.md`, `clone_metadata`, `calibration_questions` | Integrar a checkpoints de decisao, governance e filtros de risco |
| `eli_goldratt` | Completo | Operational | `clone_eli_goldratt.yaml`, `dna/compiled_dna.md`, 3 notebooks, `README.md`, `clone_metadata`, `calibration_questions` | Integrar a diagnostico de gargalos, operacao e capacidade |
| `marty_neumeier` | Completo | Operational | `clone_marty_neumeier.yaml`, `dna/compiled_dna.md`, 2 notebooks, `README.md`, `clone_metadata`, `calibration_questions` | Integrar a pipeline de branding, positioning e page review |
| `robert_mckee` | Completo | Operational | `clone_robert_mckee.yaml`, `dna/compiled_dna.md`, 2 notebooks, `README.md`, `clone_metadata`, `calibration_questions` | Integrar a pipeline de narrativa, VSL e estrutura dramatica |
| `lucas_silva` | Completo | Draft | `clone_lucas_silva.yaml`, `dna/compiled_dna.md`, `README.md`, `raw/`, metadata padronizada de draft | Consolidar DNA real, preencher fontes e notebooks, calibrar e promover para `1.0.0` |

## Evidencias-base

- Template atual do schema completo: [clone_agent.yaml](/d:/001Gravity/aios-core/experts/_templates/clone_agent.yaml#L10) *(coming soon)*
- Exemplo de schema completo draft: [clone_lucas_silva.yaml](/d:/001Gravity/aios-core/experts/lucas_silva/clone_lucas_silva.yaml#L1) *(coming soon)*
- Exemplo de schema completo operacional: [clone_thiago_finch.yaml](/d:/001Gravity/aios-core/experts/thiago_finch/clone_thiago_finch.yaml#L9) *(coming soon)*
- Exemplo adicional operacional: [clone_todd_brown.yaml](/d:/001Gravity/aios-core/experts/todd_brown/clone_todd_brown.yaml#L9) *(coming soon)*
- Consumidor atual que exige `system_prompt`: [finch-agent.ts](/d:/001Gravity/aios-core/src/llm/finch-agent.ts#L22) *(coming soon)*
- Integracao de DNA com squad ativo: [persuasion_maestro.yaml](/d:/001Gravity/aios-core/squads/nexus-copy-elite/persuasion_maestro.yaml#L9) *(coming soon)*

## Plano de fechamento

### Fase 1 - Normalizar schema

Objetivo: eliminar a duplicidade de formatos.

1. Manter os clones operacionais no schema completo do template.
2. Preservar conteudo existente de dominio, archetype, specialties, persona_profile e rules dentro de um `system_prompt` estruturado.
3. Adicionar campos obrigatorios:
   - `name`
   - `role`
   - `model`
   - `temperature`
   - `system_prompt`
   - `prompt_version`
   - `fallback_model`
   - `clone_metadata`
   - `output_contract`

### Fase 2 - Fechar governanca minima

Objetivo: impedir clones bonitos, mas sem rastreabilidade.

1. Preencher `clone_metadata.sources_count`.
2. Preencher `clone_metadata.notebooks_used`.
3. Definir `status` por clone: `draft`, `calibrating` ou `active`.
4. Adicionar `calibration_questions` para todos os clones convertidos.

### Fase 3 - Fechar rastreabilidade

Objetivo: deixar claro de onde o clone veio.

1. Criar `README.md` por clone com:
   - escopo do expert
   - origem do material
   - pilares cobertos
   - limite de uso do clone
2. Onde houver material disponivel, adicionar ou referenciar `raw/`.
3. Garantir que `compiled_dna.md` continue como fonte canonica do clone.

### Fase 4 - Promover os clones

Objetivo: sair de catalogo passivo para uso operacional.

1. Promover `lucas_silva` de `Draft` para `Operational` quando houver DNA consolidado.
2. Substituir o placeholder de `dna/compiled_dna.md` por um compilado real baseado em fontes e notebooks.
3. Integrar pelo menos um clone convertido a um consumidor real ou squad.

## Ordem recomendada

1. `lucas_silva`  
Motivo: ja esta no schema correto; falta consolidar a base documental.

## Definicao de pronto para "clone fechado"

Um clone so deve ser tratado como fechado quando cumprir todos os itens abaixo:

- YAML no schema completo do template atual
- `system_prompt` carregavel por consumidor real
- `compiled_dna.md` presente
- `clone_metadata` preenchido
- `calibration_questions` presentes
- Sem `TODO`, `pending` ou placeholders
- Ao menos uma prova de integracao real ou teste de consumo

## Recomendacao operacional

Com o ultimo `Profile-only` convertido, o unico trabalho estrutural remanescente e consolidar `lucas_silva` para promocao de `Draft` para `Operational`.

Isso reduz variacao, facilita padronizacao de prompt e cria um benchmark interno de qualidade antes de tocar o catalogo inteiro.
