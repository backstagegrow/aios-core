# clickup-publish-task

Purpose: publicar saida de agentes (copy, ads, social, onboarding, automacao) como task pronta no ClickUp com briefing na descricao, campos personalizados, responsavel correto e arquivo local opcional.

## Inputs

required:
- `client` (ex: `gt_house`, `sp_haus`, `via_br_cenografia`)
- `lane` (`social_media` | `trafego_pago` | `onboarding` | `automacoes`)
- `task_type` (`copy` | `design` | `social_media` | `paid_media` | `onboarding` | `automacao` | `relatorio` | `revisao`)
- `title`
- `briefing_markdown`

optional:
- `status`
- `priority`
- `due_date`
- `custom_fields` (mapa semantico, ex: `objetivo: antecipar`)
- `create_local_file` (default: true)

## Source Of Truth

- Mapeamentos: `clients/clickup_ops.yaml`
  - `lists` (resolucao de `list_id`)
  - `routing` (resolucao de assignee por `task_type`)
  - `status_by_list` (status validos)
  - `custom_fields` por lista (field_id + option_id)

## Execution

### 1) Resolver lista alvo
- Montar chave: `{client}_{lane}` (ex: `gt_house_social_media`).
- Buscar `list_id` em `clients/clickup_ops.yaml`.
- Se nao existir, interromper com erro de mapeamento.

### 2) Resolver responsavel
- Usar `routing[task_type]`.
- Se vazio/ausente, usar `routing.fallback_assignee`.

### 3) Validar status
- Se `status` informado, validar em `status_by_list[chave]`.
- Se nao houver bloco especifico, usar `status_by_list.default`.
- Se `status` ausente, usar `REVISÃO` quando disponivel; caso contrario, primeiro status da lista.

### 4) Traduzir custom fields semanticos
- Para cada campo em `custom_fields`:
  - localizar `field_id` na lista alvo.
  - se for `drop_down`, converter valor semantico -> `option_id`.
  - se for `date`, converter para formato aceito pelo ClickUp.
- Se valor nao for valido, retornar erro com opcoes possiveis.

### 5) Montar descricao final (briefing)
- Usar `briefing_markdown` como corpo principal da descricao.
- Acrescentar metadados no rodape:
  - `task_type`
  - `client`
  - `lane`
  - timestamp de publicacao

### 6) Criar task no ClickUp
- Criar em `list_id` com:
  - `name = title`
  - `description = briefing_markdown + metadata`
  - `assignees = [resolved_assignee]`
  - `status`
  - `priority` (se enviado)
  - `due_date` (se enviado)
  - `custom_fields` convertidos

### 7) Criar arquivo local do cliente (opcional)
- Se `create_local_file` true:
  - caminho base por cliente (via mapeamento local do repositorio)
  - pasta:
    - `campaigns/` para social/copy/design/paid_media
    - `reports/` para `relatorio`
    - raiz para demais tipos
  - nome: `YYYY-MM-DD_<slug-title>.md`
  - incluir:
    - titulo
    - link da task
    - briefing
    - campos aplicados

### 8) Resposta final
- Retornar:
  - `task_id`
  - `task_url`
  - `list_id`
  - `assignee_id`
  - `status`
  - `custom_fields_applied`
  - `local_file_path` (quando criado)

## Error Handling

- Mapeamento ausente: informar chave esperada (`{client}_{lane}`).
- Status invalido: listar status permitidos para a lista.
- Custom field invalido: listar valores aceitos por campo.
- Falha de arquivo local: manter task criada e retornar erro parcial.
