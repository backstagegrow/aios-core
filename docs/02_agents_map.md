# 🤖 FASE 2 — MAPEAMENTO DE AGENTES

Identificada uma rede coesa e interdependente de **36 agentes especialistas** e orquestradores estruturados em Squads distintos. Foi validada a arquitetura técnica com base nos manifestos `.yaml` de cada Agente.

## 2.1 Análise Arquitetural dos Agentes

Cada agente no sistema segue o padrão de metadados:
- **Nome único** e **Papel Estratégico** (ex: `role: Sales Page Operations Orchestrator`).
- **Modelo Designado** (Maioria `claude-sonnet-4-20250514` ou `claude-3-5-sonnet-20241022`).
- **Modelo de Fallback** (Ex: `claude-3-5-haiku-20241022` para contingência de latência ou timeout).
- **Contratos Globais**: Invocação das regras em `_shared/contracts/agent-output-contracts.md`.

---

## 2.2 Inventário Completo por Squad

### 🛡️ **Squad: BKS Campaign Vanguard**
Foco: *Engenharia e Otimização de Campanhas Diretas*
- **`performance_campaign_architect`** (Orquestrador)
- **`media_intelligence_spy`** (Pesquisa & Spy)

### ✍️ **Squad: Nexus Copy Elite**
Foco: *Conversão, Redação e Estratégia de Mensagem Premium*
- **`nexus_copy_chief`** (Orquestrador QA e Direção Criativa)
- **`nexus_brand_positioning_writer`** (Copywriting - Posicionamento)
- **`nexus_conversion_copywriter`** (Copywriting - Alta conversão DR)
- **`nexus_script_specialist`** (VSL e Áudio)
- **`nexus_big_idea_architect`** (Ideação de Hooks & Big Ideas)
- **`nexus_offer_specialist`** (Criação do pacote de oferta irresistível)
- **`nexus_persuasion_optimizer`** (QA de nível de persuasão e leitura)
- **`nexus_market_strategist`** (Pesquisa de dor/desejo/ICP)

### 🩺 **Squad: BKS DevOps**
Foco: *Ciência, Monitoramento e Resiliência da Infraestrutura*
- **`agent_doctor`** (Orquestrador - Healing e Diagnóstico do Sistema de IA)

### ♟️ **Squad: BKS Executive Board**
Foco: *Estratégia C-Level, Simulação de Negócios e Orçamento*
- **`board_orchestrator`** (General Orquestrador)
- **`ceo_scenario_simulator`** (Simulações de impacto global e risco)
- **`cfo_growth_analyst`** (Unit Economics, CAC, LTV)
- **`cmo_strategic_director`** (Visão de funil e posicionamento de marca)
- **`coo_operations_architect`** (Eficiência e entrega de squads ops)

### 🚀 **Squad: BKS Growth Ops**
Foco: *Tráfego Pago, Aquisição de Usuários, Construção Ágil de Funil*
- **`growth_operator`** (Orquestrador)
- **`backend_developer`**, **`frontend_developer`**, **`landing_page_builder`** (Build técnico de assets)
- **`paid_ads_copywriter`**, **`social_media_copywriter`** (Copy para aquisição)
- **`document_parser`**, **`memory_curator`**, **`memory_loader`**, **`performance_updater`**, **`performance_validator`** (Pipelines de Memória RAG e Performance)
- **`campaign_auditor`** (QA de Campanhas)
- **`campaign_strategist`**, **`client_intelligence_analyst`**, **`decision_engine`**, **`market_opportunity_analyst`** (Estratégia e Dados)
- **`creative_brief_generator`**, **`market_performance_researcher`**, **`meta_ads_optimizer`**, **`meta_campaign_builder`**, **`whatsapp_flow_builder`** (Traffic e Criação)

### 🛒 **Squad: BKS Sales Page Ops**
Foco: *Lançamento, Desenvolvimento UI/UX, Backend para Vendas*
- **`sales_page_operator`** (Orquestrador)
- **`backend_page_developer`**, **`frontend_page_developer`** (Desenvolvedores da LP)
- **`sales_page_copywriter`** (Draft da LP)
- **`design_system_curator`**, **`ux_ui_page_designer`** (Design e Experiência do Usuário)
- **`sales_page_validator`** (QA de Qualidade da LP)
- **`client_requirements_analyst`** (Ingestão de Requisitos de Vendas)

---

## 2.3 Perfil Estrutural Padrão e Diagnóstico de Riscos (Exemplo: Sales Page Operator)

Mapeamento feito a partir de `squads/bks-sales-page-ops/sales_page_operator.yaml`:

- **Nome Curto**: `sales_page_operator`
- **Versão Atual**: `1.0.0`
- **Objetivo**: Entrega completa de interface validada, com UX/UI premium e funil configurado.
- **Fluxo de Decisão**:
  1. Intake de Requisitos (`client_requirements_analyst`).
  2. Geração de Copy (`sales_page_copywriter`).
  3. UI/UX estruturado (`ux_ui_page_designer` -> `design_system_curator`).
  4. Execução Dev Frontend/Backend.
  5. QA Gate MANDATÓRIO (`sales_page_validator`).
- **Dependências Internas**:
  - `../_shared/policies/security-privacy-baseline.md`
  - `../_shared/contracts/agent-output-contracts.md`
  - `benchmark-library.md`, `qa-scoring-rubric.md`
- **Fallback**: Modelo `claude-3-5-haiku-20241022`
- **Observabilidade**: Baseada em `../_shared/observability/observability-spec.md`. Score QA logado obrigatoriamente.
- **Riscos Técnicos Gerais Encontrados (Todos os Agentes)**:
  - *Dependência Circular*: O Orquestrador chama o Validator, que depende de políticas guardrail. Se a política quebrar ou falhar no load, a página inteira falha na compilação.
  - *Custo*: Calls a `claude-sonnet-4-20250514` (hipótese de modelo custom) são intensivos; orquestradores que delegam até 6 passos podem empilhar `~50k` tokens_in/out facilmente por build.
