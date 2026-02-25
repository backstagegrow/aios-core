---
description: Onboarding de novo cliente para BKS Growth Ops
---

Este workflow automatiza a criação da infraestrutura de dados para um novo cliente corporativo.

// turbo
1. Criar estrutura de diretórios do cliente (PascalCase):
```bash
# Substitua [ClientName] pelo nome real do cliente
New-Item -ItemType Directory -Force -Path "d:\001Gravity\aios-core\clients\[ClientName]\campaigns", "d:\001Gravity\aios-core\clients\[ClientName]\reports"
```

2. Criar o arquivo `client_config.yaml` básico:
```yaml
name: [ClientName]
id: [auto_gen]
status: onboarding
timezone: America/Sao_Paulo
currency: BRL
meta_ads:
  pixel_id: ""
  account_id: ""
tags: []
```

3. Criar os templates de Memória:
   - Crie `memory_strategy.md` baseando-se no `clients/NomeCliente/memory_strategy.md`.
   - Crie `memory_performance.md` baseando-se no `clients/NomeCliente/memory_performance.md`.

4. Atualizar o Master Registry:
   - Adicione o novo cliente na tabela em `d:\001Gravity\aios-core\clients\CLIENTS.md`.

5. Ativar Agentes Iniciais:
   - Rode o `client_intelligence_analyst` para preencher as memórias com base no briefing do usuário.
