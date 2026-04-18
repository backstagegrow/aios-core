# Auditoria CRM BackstageFY - Modulos & Funcionalidades

**Data:** 2026-04-17 | **Analista:** Atlas (AIOS Analyst)
**Escopo:** `backstagefy-monorepo/apps/crm/src/components/`
**Contexto:** CRM/Dashboard para PMEs brasileiras (servico de gestao BKS Grow)

---

## 1. Mapa dos Modulos Atuais

| # | Tab ID | Label na Sidebar | Componente | Status |
|---|--------|-----------------|------------|--------|
| 1 | `dashboard` | Painel Geral | `DashboardStats` | Implementado |
| 2 | `leads` | Pipeline de Leads | `LeadPipeline` | Implementado |
| 3 | `agents` | Meus Agentes | `AgentConfigurator` | Implementado |
| 4 | `whatsapp` | WhatsApp & Canais | `WhatsAppConfig` | Implementado |
| 5 | `knowledge` | Base de Conhecimento | `KnowledgeBase` | Implementado |
| 6 | `funnel` | Editor de Funil | `FunnelBuilder` (via FunnelGuard) | Implementado (locked) |
| 7 | `sales` | Vendas & Plataformas | `TicketDashboard` | Implementado |
| 8 | `viewings` | Agenda | `ScheduleView` | Implementado |
| 9 | `finance` | Financeiro | `FinanceDashboard` | Implementado |
| 10 | `billing` | Plano & Uso | `ComingSoon` (placeholder) | NAO implementado |

**Componentes auxiliares encontrados no diretorio mas sem tab propria:**
- `LandingPage.tsx` — pagina publica pre-login
- `Login.tsx` — tela de autenticacao
- `Onboarding.tsx` — wizard pos-registro
- `NewLeadModal.tsx` — modal de criacao de lead
- `NewAppointmentModal.tsx` — modal de agendamento
- `LeadDetailModal.tsx` — detalhe do lead
- `MediaGallery.tsx` — galeria de midia (sem referencia visivel no App.tsx)
- `TestimonialsColumns.tsx` — depoimentos (provavelmente usado na LandingPage)
- `MatrixRain.tsx` / `MatrixExplosion.tsx` — efeitos visuais decorativos
- `DashboardCharts.tsx` — graficos (provavelmente sub-componente do DashboardStats)

---

## 2. Modulos que Fazem Sentido para o Produto

| Modulo | Veredicto | Justificativa |
|--------|-----------|---------------|
| Painel Geral | ESSENCIAL | Dashboard de KPIs e visao geral. Nucleo de qualquer CRM. |
| Pipeline de Leads | ESSENCIAL | Gestao de pipeline e qualificacao. Core do CRM. |
| Meus Agentes | ESSENCIAL | Diferencial do produto — configuracao da IA de atendimento. |
| WhatsApp & Canais | ESSENCIAL | Canal primario de comunicacao de PMEs brasileiras. |
| Base de Conhecimento | ESSENCIAL | Alimenta a IA. Sem KB, a IA nao funciona. |
| Editor de Funil | RELEVANTE | Personaliza fluxo de atendimento. Dependencia da KB esta correta. |
| Vendas & Plataformas | RELEVANTE | Centraliza vendas de multiplas plataformas. Bom para infoprodutores. |
| Agenda | RELEVANTE | Agendamento + Google Calendar. Util para qualquer negocio local. |
| Financeiro | RELEVANTE | Contas a pagar/receber + catalogo de produtos/servicos. |
| Plano & Uso | NECESSARIO | Billing/limites de uso do SaaS. Precisa ser implementado. |

---

## 3. Problemas de Nomenclatura e Contexto

### 3.1 CRITICO: "viewings" sugere imoveis

- **Tab ID:** `viewings`
- **Componente:** `ScheduleView`
- **Problema:** O ID `viewings` vem de "viewings" (visitas a imoveis), um resquicio de quando o sistema foi pensado para o mercado imobiliario. No header do App.tsx, o subtitle diz "Visitas e agendamentos programados".
- **Na Sidebar:** O label ja foi corrigido para "Agenda", mas o ID interno continua `viewings`.
- **No ScheduleView:** A descricao diz "visitas guiadas" na config de horarios, outro resquicio imobiliario.
- **Recomendacao:** Renomear tab ID para `schedule` ou `agenda`. Trocar todas as referencias a "visitas" por "agendamentos" ou "reunioes".

### 3.2 MEDIO: "TicketDashboard" para "Vendas & Plataformas"

- **Componente:** `TicketDashboard.tsx`
- **Problema:** O nome "Ticket" sugere sistema de suporte/helpdesk. O componente na verdade e uma central de vendas com integracao a plataformas (Hotmart, Kiwify, Sympla, Blinket, Eventin), metricas de receita, abandono de carrinho e recuperacao via IA.
- **Recomendacao:** Renomear para `SalesDashboard.tsx` ou `SalesHub.tsx`.

### 3.3 MENOR: "AgentConfigurator" vs "Meus Agentes"

- **Na Sidebar:** "Meus Agentes" — bom
- **No componente:** `AgentConfigurator` — ok, mas poderia ser `AgentManager` para alinhar com o label "Meus Agentes"

### 3.4 MENOR: Header subtitle de "viewings"

- No `App.tsx`, o titulo diz "Agenda" mas o subtitle diz "Visitas e agendamentos programados"
- **Recomendacao:** Mudar para "Calendario e agendamentos"

---

## 4. Redundancias e Sobreposicoes

### 4.1 FinanceDashboard vs TicketDashboard — Sobreposicao de Metricas

- **TicketDashboard** tem: receita total, vendas aprovadas, meios de pagamento, graficos de vendas por plataforma
- **FinanceDashboard** tem: receita, despesas, fluxo de caixa, catalogo de produtos/servicos, transacoes
- **Sobreposicao:** Ambos mostram receita e vendas. O TicketDashboard foca em vendas de plataformas externas, o FinanceDashboard foca em gestao financeira interna.
- **Veredicto:** NAO sao redundantes — tem escopos distintos. Mas precisam de melhor delimitacao:
  - TicketDashboard = vendas externas (plataformas de e-commerce/infoprodutos)
  - FinanceDashboard = financeiro operacional (contas, catalogo, fluxo de caixa)
- **Risco:** Cliente pode confundir "Vendas" com "Financeiro". Considerar renomear a tab de vendas para "Integracao de Plataformas" ou "Central de Vendas Online".

### 4.2 DashboardStats vs DashboardCharts

- `DashboardCharts.tsx` existe como arquivo separado. Provavelmente e um sub-componente do `DashboardStats`. Nao e redundancia, mas a separacao deveria seguir um padrao de composicao mais claro.

### 4.3 MediaGallery — Componente Orfao?

- `MediaGallery.tsx` nao aparece referenciado no `App.tsx`. Pode estar em uso dentro de outro componente ou pode ser codigo morto.

---

## 5. O que Esta Faltando

### 5.1 ALTA PRIORIDADE

| Funcionalidade | Justificativa |
|----------------|---------------|
| **Billing / Plano & Uso** | Tab existe na sidebar mas renderiza `ComingSoon`. Critico para monetizacao SaaS. |
| **Relatorios / Analytics** | Nenhum modulo dedicado a relatorios consolidados. O DashboardStats mostra metricas, mas falta exportacao, relatorios periodicos, e comparativos. |
| **Gestao de Contatos / CRM Contacts** | O pipeline de leads existe, mas nao ha um modulo de "Clientes" ou "Contatos" pos-conversao. Leads que convertem somem do pipeline — onde ficam? |
| **Historico de Conversas** | WhatsApp & Canais configura o canal, mas nao ha visualizacao do historico de conversas/atendimentos da IA. |

### 5.2 MEDIA PRIORIDADE

| Funcionalidade | Justificativa |
|----------------|---------------|
| **Configuracoes Gerais / Settings** | Nao ha modulo de configuracoes da conta (dados da empresa, logo, fuso horario, etc). O onboarding coleta dados iniciais, mas nao ha como editar depois. |
| **Automacoes / Workflows** | Falta modulo de automacoes (ex: quando lead chega no estagio X, enviar mensagem Y). O funil trata disso parcialmente, mas e limitado. |
| **Notificacoes / Central de Alertas** | O header tem icone de notificacao mas sem funcionalidade implementada (e decorativo). |
| **Multi-usuario / Equipe** | Sem gestao de membros da equipe, permissoes, ou atribuicao de leads a vendedores. |

### 5.3 BAIXA PRIORIDADE (futuro)

| Funcionalidade | Justificativa |
|----------------|---------------|
| **Integracao com Instagram/Meta Ads** | PMEs brasileiras usam muito Meta Ads. Seria diferencial. |
| **Templates de Mensagem** | Templates pre-prontos para respostas da IA e follow-ups manuais. |
| **NPS / Pesquisa de Satisfacao** | Feedback pos-atendimento para medir qualidade do servico. |

---

## 6. Sugestoes Concretas de Renaming / Reorganizacao

### Renaming Imediato (breaking changes minimos)

| Atual | Proposto | Tipo |
|-------|----------|------|
| Tab ID `viewings` | `schedule` | ID interno |
| `TicketDashboard.tsx` | `SalesDashboard.tsx` | Nome do arquivo |
| Header subtitle "Visitas e agendamentos" | "Calendario e agendamentos" | String |
| ScheduleView descricao "visitas guiadas" | "reunioes e atendimentos" | String |
| Tab `sales` subtitle | "Central de vendas online e integracao de plataformas" | String |

### Reorganizacao de Menu (sugestao)

Agrupar os 10 itens em secoes logicas na sidebar:

```
--- OPERACAO ---
  Painel Geral
  Pipeline de Leads
  Agenda

--- INTELIGENCIA ---
  Meus Agentes
  WhatsApp & Canais
  Base de Conhecimento
  Editor de Funil

--- COMERCIAL ---
  Central de Vendas
  Financeiro

--- SISTEMA ---
  Plano & Uso
  Configuracoes (novo)
```

### FinanceDashboard — Observacao de Scope Creep

O `FinanceDashboard` e extremamente robusto (~2000+ linhas) com 3 sub-tabs internas (dashboard, transacoes, catalogo de produtos), IA generativa via Gemini para analise de fluxo de caixa, CRUD completo de categorias/produtos/transacoes, e graficos. Para um CRM de gestao de PMEs, isso e adequado, mas beira o escopo de um ERP financeiro. Monitorar se nao esta absorvendo complexidade demais para o publico-alvo.

---

## 7. Nivel de Confianca

| Aspecto | Confianca |
|---------|-----------|
| Mapeamento de modulos | ALTA (100% — leitura direta do codigo) |
| Analise de nomenclatura | ALTA (evidencias claras no codigo) |
| Sobreposicoes | ALTA (comparacao direta de funcionalidades) |
| Funcionalidades faltantes | MEDIA (baseado em benchmark de CRMs + contexto do negocio) |
| Sugestoes de reorganizacao | MEDIA (depende de validacao com usuarios reais) |

---

*Auditoria conduzida por Atlas (AIOS Analyst) em 2026-04-17*
