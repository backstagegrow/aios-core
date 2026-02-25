# clickup-create-update-task

Purpose: criar/atualizar tasks no ClickUp via MCP, atribuir ao membro correto, criar arquivo local no cliente escolhido e preencher campos personalizados validos.

## Inputs

required:
- `action`: `create` | `update`

for `create`:
- `list_id`
- `name`

for `update`:
- `task_id`

optional:
- `description`
- `status`
- `priority`
- `assignees` (array)
- `due_date`
- `client_name` (ex: `EventiaTech`)
- `task_type` (ex: `copy`, `design`, `paid_media`, `dev`, `ops`)
- `custom_fields` (objeto chave/valor)
- `create_local_file` (boolean)

## Preconditions

- MCP ClickUp conectado e autenticado
- IDs validos (`list_id` para create, `task_id` para update)
- Cliente existe em `clients/<client_name>/` quando `client_name` informado

## Execution

### 1) Validar entrada
- Se faltar campo obrigatorio, interromper e pedir dados faltantes.

### 2) Montar payload
- Incluir apenas campos enviados pelo usuario.

### 3) Resolver responsavel (roteamento)
- Se `assignees` foi informado, usar valor explicitamente.
- Se `assignees` nao foi informado e `task_type` existe:
  - mapear `task_type` -> membro responsavel (config local da equipe)
  - definir assignee automaticamente
- Se nao houver regra de roteamento, pedir confirmacao do membro.

### 4) Validar e preencher custom fields
- Obter definicao dos custom fields da lista via MCP.
- Para cada item de `custom_fields`:
  - validar se campo existe na lista alvo
  - validar se valor pertence as opcoes disponiveis quando campo for select/multiselect
  - converter formato conforme tipo esperado (texto, numero, data, select, labels)
- Se valor invalido, mostrar opcoes validas e solicitar ajuste antes de enviar.

### 5) Executar operacao no ClickUp MCP
- `create`: criar task na lista alvo.
- `update`: atualizar task existente.

### 6) Criar arquivo local do cliente (opcional)
- Condicao: `create_local_file = true` e `client_name` informado.
- Caminho base: `clients/<client_name>/`
- Pasta-alvo sugerida:
  - `campaigns/` para task_type marketing/comunicacao
  - `reports/` para task_type analise/performance
  - raiz do cliente para demais casos
- Nome de arquivo sugerido: `YYYY-MM-DD_<slug-da-task>.md`
- Conteudo minimo:
  - titulo da task
  - id/url ClickUp
  - status
  - assignee
  - custom fields aplicados

### 7) Confirmar resultado
- Retornar ao usuario:
  - `task_id`
  - `name`
  - `status`
  - `url` (se disponivel)
  - `assignee`
  - `custom_fields_applied`
  - `local_file_path` (quando criado)

## Error Handling

- Erro de autenticacao: pedir revalidacao do token/MCP.
- Erro de permissao/lista inexistente: confirmar `list_id` e workspace.
- Erro de status invalido: listar status validos da lista e pedir novo valor.
- Erro em custom field: mostrar campo, valor recebido e opcoes permitidas.
- Erro no arquivo local: manter task no ClickUp e retornar erro parcial com caminho esperado.
