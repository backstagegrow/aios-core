# User Decision Map

Data: 2026-03-13

## Objetivo

Consolidar, a partir do historico operacional disponivel no workspace, um mapa do padrao de comportamento e do processo decisorio do usuario para que a IA possa assumir escolhas recorrentes com menos friccao.

## Limite da analise

Este mapa nao usa um historico total de chats externos. Ele foi derivado das fontes realmente disponiveis no repositório e no runtime local:

- stories e planos em `docs/stories/` e `docs/plans/`
- estado operacional em `.aios/`
- decision logs em `.ai/`
- tendencias de qualidade em `.aios/data/quality-metrics.json`
- historico de commits recente
- interacoes desta sessao

Onde houver inferencia, ela foi feita a partir de repeticao de padrao em mais de uma fonte.

## Fontes com mais sinal

1. `docs/plans/2026-03-12-operational-orchestration-priority-and-clone-governance.md`
2. `docs/plans/2026-03-12-site-creation-playbook.md`
3. `docs/stories/workspace/story-model-switch-quality-guardrails.md`
4. `docs/stories/workspace/story-antigravity-agent-parity.md`
5. `docs/stories/workspace/story-system-audit-remediation.md`
6. `git log --oneline -n 25`
7. `.aios/data/quality-metrics.json`

## Perfil sintetico

O usuario pensa como operador-arquiteto. Ele nao decide por gosto momentaneo; ele decide por:

1. reducao de atrito operacional
2. confiabilidade do sistema em producao
3. padronizacao reaproveitavel
4. qualidade minima obrigatoria antes de escalar
5. clareza de autoridade e responsabilidade

Em termos praticos, ele prefere um sistema que tome decisoes sozinho desde que:

- o fluxo esteja codificado
- os limites estejam claros
- a qualidade seja mensuravel
- os gates sejam verificaveis

## Padrroes centrais de decisao

## 1. Primeiro classificar, depois executar

O usuario evita pular direto para implementacao. O padrao recorrente e:

1. classificar o contexto
2. escolher o fluxo certo
3. so entao executar

Exemplos recorrentes:

- greenfield vs brownfield vs story cycle
- site simples vs site complexo
- tarefa critica vs tarefa simples para escolha de modelo
- clone operacional vs draft

### Default para a IA

Antes de agir, classifique explicitamente:

- estado do projeto
- complexidade
- risco
- agente ou executor correto

Se a classificacao for obvia a partir do contexto local, nao perguntar.

## 2. Governanca acima de velocidade bruta

O usuario aceita automacao forte, mas nao automacao caotica. Ele quer:

- autoridade exclusiva por agente
- fluxo story-driven
- gates antes de fechar
- documento de operacao unico

Ele tolera autonomia quando a autonomia respeita trilha operacional.

### Default para a IA

- nao pular story, checklist ou file list quando houver mudanca estrutural
- nao misturar papeis quando houver agente/autoridade mais correta
- nao tratar "funcionou localmente" como suficiente sem gate correspondente

## 3. Qualidade minima obrigatoria, nao opcional

O historico mostra insistencia em:

- `lint`
- `typecheck`
- `test`
- `build`
- paridade de integracao

Mesmo quando o workspace ja esta "verde", o usuario volta para remover falso positivo, ruido, gate ausente ou cobertura enganosa.

### Default para a IA

Se uma entrega tocar codigo, assumir que o fechamento ideal inclui:

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build` quando existir build relevante

Se algum gate estiver mascarando sinal real, priorizar corrigir o gate, nao apenas passar por ele.

## 4. Root cause over patch cosmetico

O usuario prefere corrigir a causa estrutural:

- path/source-of-truth incorreto
- contrato de compatibilidade desalinhado
- gate inexistente
- heuristica superficial de modelo
- estrutura SaaS quebrada

Ele nao demonstra preferencia por "jeitinho" temporario quando o problema e de base.

### Default para a IA

- procurar a origem do problema antes do patch
- consolidar fonte de verdade
- remover split-brain entre docs, config e runtime
- adicionar teste que trave a regressao

## 5. Determinismo antes de heuristica opaca

A arquitetura consolidada privilegia:

- roteamento codificado no Bob
- assignment deterministico
- workflow chains explicitas
- guardrails de modelo por criticidade

Isso sugere preferencia por regras auditaveis em vez de "deixar a IA decidir tudo".

### Default para a IA

Quando houver escolha recorrente, preferir:

1. regra explicita
2. matriz de decisao
3. fallback heuristico so quando a regra nao cobrir o caso

## 6. Documentar para reaplicar

O usuario transforma solucoes repetidas em:

- playbooks
- matrizes
- artefatos de consolidacao
- stories com checklist/file list

Ele nao quer so resolver uma vez; quer transformar em rotina confiavel.

### Default para a IA

Quando um tema aparecer pela segunda vez e tiver valor operacional recorrente, propor ou criar:

- playbook
- checklist
- matriz de decisao
- validacao automatizada

## 7. Sites: premium, orientados a CTA e nao genericos

Os commits e o playbook de sites indicam preferencias claras:

- design intencional
- identidade visual forte
- assets reais quando disponiveis
- experiencia premium
- paginas e secoes guiadas por briefing
- CTA principal definido
- pouca tolerancia a boilerplate genico

No caso GTHouse, os sinais foram:

- hero video
- galerias reais
- mapa local
- formulario atualizado
- subpaginas dedicadas
- animacoes de scroll
- design system unificado

### Default para a IA em sites

- assumir que o site precisa de direcao visual forte
- pedir ou inferir CTA principal cedo
- estruturar por paginas e secoes, nao por blocos soltos
- usar prova social, oferta, beneficios e ativos reais quando existirem
- evitar layout "templatezasso"

## 8. Conteudo: buyer-first, direto e com prova

Os artefatos e commits apontam para um estilo de conteudo:

- headline clara
- diferencial competitivo explicito
- foco comercial/pratico
- prova social e beneficios
- pouca paciencia para copy vaga
- orientacao a conversao

### Default para a IA em conteudo

- escrever em termos de beneficio e acao
- destacar diferencial, CTA e prova
- evitar texto abstrato e institucional demais
- assumir que copy deve servir a uma jornada real

## 9. Tecnologia: pragmatismo orientado a deploy real

Os commits mostram repeticao de decisoes ligadas a:

- Cloudflare compatibility
- edge/runtime constraints
- Supabase config correta
- estrutura SaaS limpa
- build real fechando

Isso indica que o usuario valoriza tecnologia em funcao do deploy e da operacao, nao de elegancia abstrata.

### Default para a IA em desenvolvimento

- preferir solucoes compativeis com o ambiente de deploy real
- tratar incompatibilidade de runtime/build como prioridade alta
- manter estrutura limpa e coerente com o alvo de producao

## 10. Multi-IDE e ecossistema: consistencia acima de tool lock-in

O trabalho recente mostra investimento em:

- Claude
- Codex
- Gemini
- Cursor
- GitHub Copilot
- AntiGravity

O objetivo nao e apego a uma IDE, mas paridade operacional entre canais.

### Default para a IA

- quando mudar regras/agentes, verificar reflexo nas integracoes relevantes
- preferir fonte de verdade unica com sincronizacao
- tratar drift entre docs, config e integracoes como defeito real

## 11. Gestao: reduzir gargalo humano

A solicitacao atual confirma uma meta explicita:

- ensinar a IA a assumir decisoes rotineiras
- eliminar perguntas repetidas
- remover gargalos do dia a dia

Mas o historico mostra que isso nao significa liberar tudo. Significa automatizar o previsivel e escalar ao usuario so o que muda direcao.

### Default para a IA

Assumir autonomia total em:

- organizacao do fluxo
- escolha de checklist
- sequenciamento de agentes
- fechamento de gates
- defaults tecnicos e de qualidade
- estruturacao de sites e docs dentro do padrao ja consolidado

Escalar ao usuario apenas quando houver:

- mudanca de posicionamento de marca
- escolha irreversivel de produto/arquitetura
- trade-off financeiro relevante
- conflito entre duas direcoes de negocio igualmente plausiveis

## Processo decisorio inferido

## Etapa 1. Identificar o tipo de problema

Pergunta implicita do usuario:

- isso e operacao, produto, conteudo, design, ou infraestrutura?

## Etapa 2. Determinar o fluxo certo

Pergunta implicita:

- isso pede fluxo simples, fluxo complexo, discovery, spec pipeline, QA loop ou remediacao?

## Etapa 3. Fixar fonte de verdade

Pergunta implicita:

- onde este assunto deve morar para nao ficar fragmentado?

## Etapa 4. Executar com gate

Pergunta implicita:

- como eu garanto que a solucao fecha tecnicamente e nao so conceitualmente?

## Etapa 5. Transformar em padrao

Pergunta implicita:

- essa solucao precisa virar playbook, regra, teste ou matriz?

## Mapa operacional para a IA

## Defaults aprovados para assumir sem perguntar

### Em gestao e processo

- usar story-driven development
- separar executor de quality gate
- consolidar conhecimento em um artefato unico quando o assunto se repetir
- priorizar clareza operacional sobre flexibilidade abstrata

### Em desenvolvimento

- corrigir causa raiz
- adicionar teste de regressao para mudanca estrutural
- alinhar docs, config, runtime e validações
- preservar qualidade minima antes de fechar

### Em sites

- começar por briefing, CTA, paginas e secoes
- seguir fluxo simples ou complexo conforme risco
- evitar design generico
- privilegiar conversao, prova e identidade forte

### Em conteudo

- buyer-first
- beneficio explicito
- CTA claro
- pouco floreio institucional

## Coisas que ainda exigem confirmacao

- redefinicao de oferta ou pricing
- tom de voz completamente novo para uma marca
- troca de stack com impacto de longo prazo
- automacoes que tocam servicos externos/credenciais
- decisao entre duas direcoes visuais/estrategicas muito diferentes

## Como a IA deve se comportar daqui para frente

1. Assumir que o usuario prefere defaults operacionais fortes.
2. Perguntar menos sobre escolhas que ja estao padronizadas no historico.
3. Perguntar apenas sobre mudancas de direcao, nao sobre execucao rotineira.
4. Sempre que possivel, converter uma decisao recorrente em regra, teste, playbook ou memoria.
5. Em caso de duvida, escolher o caminho mais auditavel, mais reproduzivel e com melhor fechamento de qualidade.

## Veredito

O padrao decisorio dominante do usuario e:

`sistema > improviso`

Desdobrado:

- classificar antes de agir
- padronizar antes de escalar
- validar antes de concluir
- documentar para nao decidir duas vezes
- automatizar tudo o que ja virou rotina

Esse e o melhor modelo mental para a IA operar no seu contexto sem te transformar em gargalo.
