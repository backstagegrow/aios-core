# clickup-generate-management-report

Purpose: auditar lanes/pastas específicas no ClickUp (social_media, trafego_pago, automacoes, onboarding), gerar relatório gerencial consolidado e publicar em documento na área Gestão Empresarial > Relatórios.

## Inputs

required:
- `period_start` (YYYY-MM-DD)
- `period_end` (YYYY-MM-DD)

optional:
- `lanes` (default: `["social_media","trafego_pago","automacoes","onboarding"]`)
- `clients` (default: todos do `clients/clickup_ops.yaml`)
- `publish_doc` (default: true)
- `doc_target_id` (id do doc/lista de Relatórios na Gestão Empresarial; se ausente, executar dry-run de publicação)
- `executive_roles` (default: `["CEO","CMO","CFO","CTO","COO"]`)
- `executive_mode` (`ai_lens` | `human_feedback` | `hybrid`, default: `hybrid`)

## Source Of Truth

- `clients/clickup_ops.yaml` para:
  - mapeamento de listas por cliente/lane
  - responsáveis e fallback
  - status padrão por lista

## Execution

### 1) Resolver escopo
- Carregar `clients/clickup_ops.yaml`.
- Filtrar listas por `lanes` e `clients`.
- Construir plano de coleta com pares `{client, lane, list_id}`.

### 2) Coletar dados no ClickUp
- Para cada lista no escopo:
  - buscar tasks do período
  - coletar: status, responsável, due_date, prioridade, atraso, campos customizados relevantes
- Calcular métricas por lista:
  - total de tasks
  - tasks por status
  - concluídas no período
  - atrasadas
  - sem responsável

### 3) Consolidar por lane e por cliente
- Agrupar por lane (`social_media`, `trafego_pago`, `automacoes`, `onboarding`).
- Agrupar por cliente.
- Identificar:
  - top gargalos (ex: alta taxa em revisão, alto atraso)
  - top riscos (ex: sem responsável, vencimento sem status final)

### 4) Gerar relatório em markdown
- Estrutura mínima:
  - Sumário executivo
  - KPIs gerais
  - KPIs por lane
  - KPIs por cliente
  - Riscos e alertas
  - Recomendações de ação
  - Mesa executiva (insights e melhorias por papel)
- Persistir cópia local em:
  - `clients/reports/YYYY-MM-DD_clickup-management-report.md`

### 4.1) Mesa Executiva (CEO/CMO/CFO/CTO/COO)
- Gerar seção por papel executivo:
  - `insights` (o que está funcionando / não está)
  - `pontos_de_melhoria` (3-5 ações priorizadas)
  - `impacto_esperado`
- Modo de composição:
  - `ai_lens`: gerar perspectivas por lente executiva com base nos KPIs
  - `human_feedback`: incorporar feedback humano fornecido no contexto da execução
  - `hybrid`: combinar ambos e destacar divergências

### 5) Publicar documento no ClickUp (opcional)
- Se `publish_doc=true`:
  - se `doc_target_id` informado: criar/atualizar documento na Gestão Empresarial > Relatórios
  - se `doc_target_id` ausente: usar `clients/clickup_ops.yaml -> reporting.management_space.reports_doc_target_id`
  - se ambos ausentes: retornar instrução de bind do alvo e manter relatório local gerado

### 6) Saída final
- Retornar:
  - `scope_lists`
  - `summary_kpis`
  - `risk_items`
  - `local_report_path`
  - `doc_url` (quando publicado)

## Error Handling

- Falha em lista específica: continuar com as demais e marcar parcial.
- Falha de publicação em doc: manter relatório local e retornar erro parcial.
- Mapeamento ausente em `clickup_ops.yaml`: reportar chave esperada e pular item.
