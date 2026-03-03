---
name: supabase-sync
description: Sincronização e preparação da infraestrutura de dados antes do desenvolvimento
author: @db-sage
version: 1.0.0
---

# 🔄 Supabase Sync & Data Infrastructure Prep

Esta skill deve ser executada para garantir que a infraestrutura de dados, especificamente o banco Supabase, esteja pronta e alinhada antes que qualquer codificação de funcionalidade comece.

## 👥 Agentes Envolvidos e Regras de Execução

1. **🌊 @sm (Scrum Master)**
   - Inicia o processo verificando as pendências no backlog do projeto.
   - Identifica histórias de usuário (stories) que requerem persistência de dados.
   - Gera uma tarefa/história específica de dados e chama o `@db-sage`.

2. **📊 @db-sage (Data Engine)**
   - Ao ser acionado pelo Scrum Master, a primeira ação é extrair e ler o esquema atual do Supabase via protocolo MCP.
   - Em seguida, compara o esquema atual com o documento de arquitetura (`ARCHITECT.md` ou equivalente).
   - Realiza as adaptações, criando tabelas, colunas, relações e RLS (Row Level Security) de forma *incremental* (nunca reescrevendo do zero).
   - Confirma a prontidão da infraestrutura de dados e documenta as estruturas SQL no backlog da story.

3. **💻 @dev (Developer)**
   - O `@dev` **SÓ PODE AGIR** (codificar regras de negócio, APIs, front-end) após o `@db-sage` confirmar oficialmente que a infraestrutura de dados para aquela funcionalidade está pronta e operante.

## 🛑 Quality Gates
- Nenhuma migration pode ser executada sem validação cruzada com o planejamento arquitetural.
- O resultado do `supabase-sync` deve ser registrado no `EntityRegistry` (Supabase).
