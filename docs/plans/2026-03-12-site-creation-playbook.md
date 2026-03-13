# Site Creation Playbook

Data: 2026-03-12

## Objetivo

Padronizar a criacao de sites no AIOS com um fluxo operacional simples de consumir, cobrindo:

- briefing minimo
- decisao de fluxo
- ordem recomendada dos agentes
- checklist tecnico de fechamento

Este documento nao cria novas regras. Ele aplica ao caso de criacao de sites o que ja esta definido na Constituicao, no Bob e nos workflow chains.

## Fontes de verdade

- Constituicao: `.aios-core/constitution.md`
- Roteamento do Bob: `.aios-core/core/orchestration/bob-orchestrator.js`
- Fluxos canonicos: `.aios-core/data/workflow-chains.yaml`
- Consolidado operacional: `docs/plans/2026-03-12-operational-orchestration-priority-and-clone-governance.md`

## Quando usar este playbook

Use este playbook para:

- landing pages
- sites institucionais
- portfolios
- sites de produto
- microsites e campanhas

Nao use este playbook sozinho quando o trabalho for principalmente:

- aplicacao SaaS com regras complexas
- backoffice pesado
- plataforma com forte dependencia de integracoes

Nesses casos, este playbook continua valendo, mas deve ser combinado com o Spec Pipeline antes da implementacao.

## Briefing minimo obrigatorio

Sem este briefing, o fluxo ate executa, mas a qualidade do site cai e o retrabalho sobe.

## Dados do negocio

- nome da marca ou projeto
- produto ou servico principal
- publico-alvo
- objetivo principal do site
- CTA principal
- diferencial competitivo

## Escopo do site

- tipo de site
- paginas obrigatorias
- secoes obrigatorias por pagina
- idiomas
- prazo
- stack ou restricoes tecnicas

## Conteudo

- headline principal
- prova social disponivel
- oferta e beneficios
- links externos obrigatorios
- assets existentes: logo, imagens, videos, brand guide

## Direcao criativa

- referencias visuais
- referencias a evitar
- tom de voz
- nivel desejado de ousadia visual
- concorrentes ou benchmarks

## Decisao de fluxo

## 1. Classificar o projeto

1. Se o projeto ainda nao existe, tratar como `Greenfield`.
2. Se o projeto existe, mas sem documentacao suficiente, tratar como `Brownfield Discovery`.
3. Se o projeto existe e ja tem docs e estrutura clara, entrar no `Story Development Cycle`.

## 2. Classificar a complexidade do site

Use fluxo simples quando houver:

- poucas paginas
- copy e estrutura claras
- nenhuma integracao relevante
- pouca incerteza de arquitetura

Use fluxo complexo quando houver qualquer um destes pontos:

- rebrand relevante
- multiplas jornadas e CTAs
- integracao com CMS, CRM, analytics, auth ou automacao
- necessidade de pesquisa competitiva ou definicao de arquitetura
- dependencia forte de performance, SEO tecnico ou internacionalizacao

## Fluxo recomendado para site simples

Este e o caminho padrao para sites bem especificados.

1. `@sm` -> `*draft`
Cria a story com acceptance criteria, checklist e file list.

2. `@po` -> `*validate-story-draft {story-id}`
Fecha escopo, corta invencao e garante que a story esta implementavel.

3. `@ux-design-expert`
Define estrutura, direcao visual, hierarquia de paginas, secoes e componentes.

4. `@dev` -> `*develop {story-id}`
Implementa o site seguindo a story e o direcionamento de UX.

5. `@qa` -> `*review {story-id}`
Revisa comportamento, regressao, riscos e qualidade do resultado.

6. `@devops` -> `*push`
Executa o fechamento operacional de push, PR e release quando o gate estiver aprovado.

## Fluxo recomendado para site complexo

Este e o caminho quando o briefing ainda nao e suficiente para implementar com seguranca.

1. `@pm` -> `*gather-requirements`
Consolida requisitos do site, paginas, jornadas, objetivos e restricoes.

2. `@architect` -> `*analyze-impact`
Define impacto tecnico, risco e necessidade de arquitetura.

3. `@analyst` -> `*research {topic}`
Pesquisa mercado, benchmark, concorrencia ou requisitos complementares, quando necessario.

4. `@pm` -> `*write-spec`
Escreve a spec sem invencao, derivada dos requisitos.

5. `@qa` -> `*critique-spec {story-id}`
Valida clareza, rastreabilidade e riscos antes de codar.

6. `@architect` -> `*plan`
Fecha o plano de implementacao.

7. `@sm` -> `*draft`
Abre a story implementavel.

8. `@po` -> `*validate-story-draft {story-id}`
Confirma readiness da story.

9. `@ux-design-expert`
Traduz a spec em direcao visual e estrutura de interface.

10. `@dev` -> `*develop {story-id}`
Implementa.

11. `@qa` -> `*review {story-id}`
Executa gate de qualidade.

12. `@devops` -> `*push`
Fecha o fluxo autorizado de entrega.

## Fluxo de correcao quando QA reprova

Quando o gate falha, nao reinicie o processo inteiro. Use o QA Loop:

1. `@qa` revisa e registra os problemas
2. `@dev` corrige
3. `@qa` revalida

Repita esse ciclo ate o gate ficar aprovado ou bloqueado com motivo explicito.

## Papel dos clones

Clones ajudam em consistencia de linguagem, posicionamento e especializacao de saida, mas nao substituem o fluxo canonico de agentes.

Use clones principalmente para:

- copy orientada por persona
- tom de marca
- variacoes de angulo comercial
- material de apoio para UX e conteudo

Nao use clones como atalho para pular:

- story valida
- validacao do `@po`
- implementacao pelo executor correto
- gate do `@qa`
- autoridade do `@devops`

## Checklist de prontidao antes de implementar

- [ ] briefing minimo fechado
- [ ] referencias visuais ou anti-referencias registradas
- [ ] CTA principal definido
- [ ] paginas e secoes definidas
- [ ] stack e restricoes tecnicas registradas
- [ ] story criada
- [ ] story validada pelo `@po`
- [ ] decisao tomada entre fluxo simples e fluxo complexo

## Checklist tecnico antes de deploy

- [ ] escopo da story implementado
- [ ] checklist e file list atualizados
- [ ] `npm run lint` sem erros
- [ ] `npm run typecheck` sem erros
- [ ] `npm test` sem falhas
- [ ] `npm run build` ou build do app concluido com sucesso
- [ ] QA aprovado
- [ ] push e PR executados pelo `@devops`

## Definicao pratica de sucesso

Um site pode ser tratado como pronto quando:

- o briefing foi convertido em paginas e secoes sem invencao
- o fluxo correto foi seguido para o nivel de complexidade
- o design tem direcao intencional, nao boilerplate generico
- o build fecha sem regressao
- o QA aprova
- a entrega segue a autoridade operacional correta

## Resumo operacional

Para site simples:

1. briefing
2. `@sm`
3. `@po`
4. `@ux-design-expert`
5. `@dev`
6. `@qa`
7. `@devops`

Para site complexo:

1. briefing
2. `@pm`
3. `@architect`
4. `@analyst` quando necessario
5. `@pm`
6. `@qa`
7. `@architect`
8. `@sm`
9. `@po`
10. `@ux-design-expert`
11. `@dev`
12. `@qa`
13. `@devops`

Esse e o fluxo mais seguro hoje para reduzir dificuldade operacional na criacao de sites dentro do AIOS.
