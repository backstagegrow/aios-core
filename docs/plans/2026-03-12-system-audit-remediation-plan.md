# Plano de Remediacao - Auditoria do Sistema

## Status geral em 12 de marco de 2026

### Concluido
- Remocao de execucao insegura em parsers e despachadores (`eval`, `execSync(string)`, `sh -c`, `shell: true` em caminhos acionaveis).
- Endurecimento dos quality gates e runners internos com parsing seguro de comandos.
- Eliminacao da dependencia de `jest --forceExit` com runner dedicado e limpeza de open handles relevantes.
- Cobertura adicional para modulos de maior risco operacional e de seguranca.
- Correcoes de runtime/UI nos apps auditados na primeira rodada.

### Residual monitorado
- Suites skipped continuam existindo quando dependem de ambiente externo, Windows real, submodulos opcionais, `.synapse/` local ou servicos nao presentes no workspace.
- O sandbox atual bloqueia `spawn` de workers com `EPERM`, mas os builds finais foram validados com sucesso fora dele.

## Rodada 1

### Item 1: Remover execucao insegura no test-discovery
**Arquivos:** `.aios-core/infrastructure/scripts/test-discovery.js`, `tests/unit/test-discovery.test.js`
**Status:** Concluido
**Resultado:** parser de coverage deixou de executar codigo arbitrario; adicionado teste de regressao para config JS sem `eval`.

### Item 2: Blindar execucao do gerador em lote do brand-engine
**Arquivos:** `packages/brand-engine/generator/generate-all.mjs`
**Status:** Concluido
**Resultado:** execucao passou a usar argumentos separados em vez de interpolacao shell insegura.

### Item 3: Corrigir classes Tailwind dinamicas no brand-console
**Arquivos:** `apps/brand-console/app/design-system/[slug]/page.tsx`
**Status:** Concluido
**Resultado:** classes passaram a ser resolvidas por mapas estaticos compativeis com o build de producao.

### Item 4: Fechar os gaps de navegacao do portfolio-porto
**Arquivos:** `apps/portfolio-porto/src/App.jsx`, `apps/portfolio-porto/src/components/Header.jsx`, `apps/portfolio-porto/src/pages/Home.jsx`, `apps/portfolio-porto/src/pages/ProjectDetail.jsx`
**Status:** Concluido
**Resultado:** roteamento real configurado, paths de assets corrigidos e link publico incorreto ajustado.

## Rodada 2

### Item 5: Remover interpolacao shell do subagent-dispatcher
**Arquivos:** `.aios-core/core/execution/subagent-dispatcher.js`, `tests/core/subagent-dispatcher-security.test.js`
**Status:** Concluido
**Resultado:** Claude passou a ser invocado sem shell intermediario e com prompt via `stdin`.

### Item 6: Remover interpolacao shell do build-orchestrator
**Arquivos:** `.aios-core/core/execution/build-orchestrator.js`, `tests/core/build-orchestrator-security.test.js`
**Status:** Concluido
**Resultado:** execucao do agente passou a usar `spawn` direto e ficou protegida contra injecao por prompt/comando.

## Rodada 3

### Item 7: Padronizar parsing seguro de comandos nos quality gates e CLIs
**Arquivos:** `scripts/lib/command-utils.js`, `.aios-core/core/quality-gates/layer1-precommit.js`, `.aios-core/core/quality-gates/layer2-pr-automation.js`, `.aios-core/infrastructure/scripts/test-discovery.js`, `.aios-core/infrastructure/scripts/subtask-verifier.js`, `.aios-core/infrastructure/scripts/sandbox-tester.js`, `bin/aios-init.js`, `packages/aios-pro-cli/bin/aios-pro.js`
**Status:** Concluido
**Resultado:** comandos passaram a ser resolvidos com parsing estruturado, rejeicao de metacaracteres shell e normalizacao cross-platform para executaveis como `npm.cmd`.

### Item 8: Cobrir regressao de seguranca e parsing
**Arquivos:** `tests/unit/command-utils.test.js`, `tests/unit/subtask-verifier-security.test.js`, `tests/unit/sandbox-tester-security.test.js`
**Status:** Concluido
**Resultado:** suites novas validam parsing de comandos, rejeicao de operadores shell e execucao sem interpolacao insegura.

### Item 9: Eliminar open handles relevantes do runtime
**Arquivos:** `.aios-core/core/config/config-cache.js`, `.aios-core/infrastructure/scripts/config-cache.js`, `.aios-core/core/execution/wave-executor.js`, `packages/aios-pro-cli/src/recover.js`, `tests/unit/config-cache-interval.test.js`, `tests/core/wave-executor.test.js`, `tests/pro-recover.test.js`
**Status:** Concluido
**Resultado:** timers de limpeza e timeout passaram a usar `unref()` e cleanup explicito; prompt interativo em teste deixou de prender `stdin` e `stdout`.

### Item 10: Remover dependencia de `--forceExit` nos testes
**Arquivos:** `scripts/run-jest.js`, `package.json`
**Status:** Concluido
**Resultado:** `npm test` agora roda com wrapper dedicado baseado em `runCLI` e encerra sem precisar forcar o processo.

## Verificacao

### Quality gates
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm test`

### Builds de apps
- [x] `npm --prefix apps/brand-console run build`
- [x] `npm --prefix apps/portfolio-porto run build`
Observacao: no sandbox atual os dois comandos falham com `spawn EPERM`, mas a validacao final foi concluida fora do sandbox.

## Notas finais

- Os skips remanescentes estao concentrados em testes dependentes de Windows real, rede, ClickUp MCP, submodulos opcionais e fixtures locais nao versionadas.
- A cobertura foi ampliada exatamente nos modulos de maior risco identificados pela auditoria.
