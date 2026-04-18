---
created: 2026-04-16
updated: 2026-04-16
author: @antigravity (with inputs from @aiosmaster)
tags: [#audit, #backstagefy, #ai-concierge, #v7, #modular]
status: fase6-completa — aguardando deploy
client: BackStageFy
---

# Auditoria Técnica e Mapa de Migração: AI Concierge v7

## 🎯 Objetivo
Refatorar o monólito `ai-concierge-v5-final` (844+ linhas) para uma arquitetura modular e testável (`ai-concierge-v7`), utilizando o padrão `_shared/` do ecossistema AIOS para garantir estabilidade e facilitar a troca de provedores de LLM.

---

## 📊 FASE 1: Diagnóstico e Recuperação Operacional (Concluído)

- **Instâncias UAZAPI:** Verificadas e sincronizadas para `Auto Nobre` (bsf_04a07217) e `Backstage Grow` (bsf_fad8107f).
- **Status da Tabela `leads`:** Identificado erro de restrição de check (`leads_status_check`).
    - **Causa:** O sistema tentava inserir status não permitidos pela constraint do banco.
    - **Status Permitidos:** `{'quente', 'morno', 'frio'}`. Valor `novo` ou `convertido` causa falha na função.
- **Reachability:** Função v5-final está acessível via webhook, mas vulnerável a falhas de banco e timeout de API.

---

## 🗺️ Mapa de Ataque (Análise do Monólito)

Foram identificadas 8 responsabilidades principais dentro de um único arquivo, com diferentes níveis de risco (FASE 2):

| # | Módulo | Linhas | Risco | Status |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Webhook Parser | 10-89 | 🟢 Baixo | Mapeado |
| 2 | Tenant Context | 91-159 | 🟢 Baixo | Mapeado |
| 3 | Lead Manager | 164-213 | 🟡 Médio | Mapeado |
| 4 | Media Processor (Whisper) | 214-297 | 🟡 Médio | Mapeado |
| 5 | RAG Builder | 320-347 | 🟢 Baixo | Mapeado |
| 6 | LLM Orchestrator | 356-590 | 🔴 Alto | Mapeado |
| 7 | Tool Executor (8 if-blocks) | 591-787 | 🔴 Alto | Mapeado |
| 8 | Output Formatter | 788-844 | 🟡 Médio | Mapeado |

**Obs:** OpenAI hardcoded em 8 linhas específicas (6, 161, 263, 577, 580, 743, 786) — extraível.

---

## ⚠️ Riscos Críticos Identificados

1. **Dependência de Provedor Único:** Se a OpenAI apresentar instabilidade ou timeout, a função crasha e o lead é perdido. Não há fallback implementado.
2. **Complexidade de Manutenção:** O bloco de Tool Executor possui 8 condicionais aninhadas, dificultando a adição de novas ferramentas sem quebrar o fluxo existente.
3. **Erros de Constraint no DB:** Inconsistência entre os status enviados pela IA e as regras de `CHECK` do Postgres.

---

## 🚀 Estratégia de Execução (v7)

A migração seguirá os seguintes passos, sem impactar a `v5-final` em produção:

1. [x] **Criar `_shared/`:** Implementar módulos isolados para Webhook Parser, Tenant Context e RAG Builder.
2. [x] **LLM Orchestrator (Agnóstico):** Criar camada de abstração para suportar Gemini/OpenAI com fallback automático.
3. [x] **Tool Executor:** Refatorar os blocos `if` para um padrão de Switch/Case tipado.
4. [x] **Testes Unitários:** Implementado suíte de testes para Parser e Contexto.
5. [x] **Script de Simulação:** Criado `simulate-webhook.ts` para testes E2E sem custo de API em massa.
6. [x] **Deploy e Teste Real:** Deploy da `v7` em ambiente isolado.
7. [x] **Transição de LLM:** Modelo primário alterado de OpenAI (429/Error) para Gemini 2.5 Flash, estabilizando a operação.

---

## 📦 FASE 5: Features Avançadas (Concluído)

| # | Task | Arquivo | Status |
|---|------|---------|--------|
| 5.1 | State Machine de Funil | `_shared/funnel-state-machine.ts` | ✅ |
| 5.2 | Vision Real (análise de imagens) | `_shared/vision-helper.ts` | ✅ |
| 5.3 | Memória de Longo Prazo (resumo JSON a cada 5 msgs) | `_shared/memory-builder.ts` | ✅ |
| 5.4 | Horário Comercial (guards) | `_shared/tenant-context.ts` | ✅ |
| 5.5 | LLM Agnóstico (Gemini primary + OpenAI fallback) | `_shared/llm-orchestrator.ts` | ✅ |

---

## 🔒 FASE 6: Monitoramento e Escala (Concluído)

| # | Task | Arquivo | Status |
|---|------|---------|--------|
| 6.1 | Rate Limiting (5 msgs/min por lead) | `_shared/rate-limiter.ts` | ✅ |
| 6.2 | Health Check (`GET /ai-concierge-v7`) | `index.ts` | ✅ |
| 6.3 | Performance Metrics (`latency_ms` em debug_logs) | `index.ts` | ✅ |
| 6.4 | Alertas de Erro (fatal errors → debug_logs) | `index.ts` | ✅ |
| 6.5 | Retry Queue + Worker (backoff 30s→2min→5min) | `_shared/retry-queue.ts`, `functions/retry-worker/index.ts` | ✅ |

**Migrations necessárias:**
- `20260416_message_retry_queue.sql`
- `20260416_retry_worker_cron.sql`

---

## ⚠️ Gap Identificado: Whisper / Áudio

O monólito v5-final tinha um **Media Processor com Whisper** (linhas 214-297) para transcrição de áudio recebido via WhatsApp. Este módulo **não foi portado para a v7** e não virou task em nenhuma FASE.

**Decisão:** portar como FASE 7 ✅ confirmado em 2026-04-16

---

## 📝 Log de Progresso

- **2026-04-16 (14:20):** Refatoração modular concluída. Testes locais prontos e blindados contra falhas de Jid/Lid e Formatação de Data.
- **2026-04-16 (14:21):** Análise do Spec da Uazapi concluída, garantindo compatibilidade total com os endpoints de mídia e status.
- **2026-04-16 (15:00):** Deploy da `v7` na nuvem efetuado com sucesso.
- **2026-04-16 (15:05):** Cérebro principal trocado de OpenAI para Gemini-2.5-Flash (devido ao erro 429 de créditos). Testes de simulação retornando 200 OK consistentes.
- **2026-04-16 (sessão FASE 5+6):** Vision Real, Memória de Longo Prazo, Rate Limiting, Health Check, Retry Queue + Worker implementados.

---

## 🚦 Checklist de Deploy Final

- [ ] Habilitar extensões: `pg_cron`, `pg_net` (Supabase Dashboard → Database → Extensions)
- [ ] Rodar migration: `20260416_message_retry_queue.sql`
- [ ] Rodar migration: `20260416_retry_worker_cron.sql`
- [ ] Configurar secrets: `UAZAPI_BASE_URL`, `OPENAI_API_KEY`, `GEMINI_API_KEY`
- [ ] `supabase functions deploy ai-concierge-v7`
- [ ] `supabase functions deploy retry-worker`
- [ ] Testar health check: `GET /functions/v1/ai-concierge-v7`
- [x] **Mudar URL do Webhook no painel UAZAPI** para a nova `ai-concierge-v7` ✅ feito em 2026-04-16
- [ ] Rollout gradual para clientes
