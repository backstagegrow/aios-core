# BKS Sales Page Ops (V2)

Squad para criação e validação de páginas de vendas com fluxo multiagente.

## Agentes
- `sales_page_operator` (orquestrador/gestor)
- `client_requirements_analyst`
- `sales_page_copywriter`
- `ux_ui_page_designer`
- `design_system_curator`
- `frontend_page_developer`
- `backend_page_developer`
- `sales_page_validator`

## Workflow
- `workflows/sales-page-delivery.yaml`

## V2 Enhancements (1-8)
- `memory/agent-learning-log-template.md` - memoria por agente
- `tests/qa-scoring-rubric.md` - scoring objetivo
- `benchmarks/benchmark-library.md` - benchmark interno versionado
- `tests/automated-quality-gates.md` - runbook de testes automatizados
- `config/maturity-profiles.yaml` - modo por maturidade (starter/growth/scale)
- `finance/cfo-unit-economics-template.md` - camada financeira (CFO mode)
- `policies/operational-guardrails.md` - playbooks anti-erro operacional
- `design/bksgrow-visual-signature.md` - assinatura visual BKSGrow

## V3/V4 Enhancements
- `contracts/agent-output-contracts.md` - contratos de entrada/saida dos agentes
- `ops/retry-fallback-policy.md` - politica de retry/fallback
- `tests/test-backlog-priority.md` - priorizacao por impacto financeiro
- `memory/memory-delta-rules.md` - atualizacao de memoria por delta
- `policies/commercial-claims-guardrails.md` - guardrails de claims comerciais
- `ops/incident-playbook.md` - resposta a incidentes
- `templates/ab-experiment-template.md` - template de experimento A/B
- `templates/executive-summary-auto-template.md` - resumo executivo automatico
- `observability/observability-spec.md` - observabilidade por agente/workflow
- `evals/offline-eval-dataset-spec.md` - avaliacao offline e regressao
- `governance/prompt-versioning.md` - versionamento e rollback de prompts
- `governance/permission-matrix.md` - matriz de permissoes operacionais

## Resultado Esperado
- Copy completa da página
- Estrutura UX/UI
- Frontend e backend implementados
- Relatório de validação com Go/No-Go
- Log de aprendizado por agente
- Nota financeira para decisão de escala
