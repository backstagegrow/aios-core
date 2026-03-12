# 🔎 FASE 1 — INVENTÁRIO DO REPOSITÓRIO AIOS

## 1. Visão Geral da Estrutura

O repositório `aios-core` segue uma arquitetura em formato de monorepo, organizado por "squads" (times de agentes) focados em operações de marketing, vendas e tecnologia, com namespaces compartilhados para governança, políticas e observabilidade.

### Organização de Pastas de Alto Nível
| Pasta / Arquivo | Finalidade | Mapeamento de Uso |
| --- | --- | --- |
| `.ai/`, `.aios/`, `.aios-core/`, `.antigravity/` | Arquivos de configuração internos de engines e frameworks AIOS. | Metadados do agente antigravity. |
| `.env` & `.env.example` | Variáveis de ambiente secretas (API keys, Supabase, Integrações). | Lidas no momento do start pelas ferramentas e conexões. |
| `agents/` | Definições globais e fluxos de trabalho (ex: `client-onboarding.md`). | Referenciado por fluxos globais que cruzam squads. |
| `squads/` | Core do sistema: Contém todos os times de agentes categorizados por domínio (ver detalhes abaixo). | Centro ativo da inteligência de negócios. |
| `knowledge/` | Base de conhecimento e *Decision Logs* da engenharia e arquitetura. | RAG e contexto de longo prazo. |
| `clients/` | Workspaces de clientes específicos com regras isoladas (ex: BKSGrow, GTHouse, SpHaus). | Isolamento e execução fim-a-fim para agência. |
| `packages/` | Core packages e pacotes distribuíveis (`aios-install`, `aios-pro-cli`, plugins, etc.). | Dependências principais do sistema interno. |
| `tests/` | QA Automatizado e testes de unidade globais. | Validação de código e CI/CD. |
| `docs/` | Artefatos e manuais estáticos do projeto, incluindo modelagem de banco de dados. | Registro do Agente. |
| `scripts/`, `src/` | Inicializadores utilitários e lógicas customizadas da Engine (ex: `services`). | Operações customizadas de infra. |

---

## 2. Estrutura de Squads (O Coração do Sistema)

Identificamos a descentralização de agentes nos seguintes domínios:

1. **`squads/_shared/`**:
   - `contracts/`: Contratos de output de agentes.
   - `governance/`: Matriz de permissões e versionamento de prompts.
   - `observability/`: Logs, métricas e RLS policies.
   - `ops/`: Playbooks de incidentes e fallbacks (dependências críticas internas).
   - `policies/`: Regras de negócio restritivas (ex: Security Baseline, Guardrails).

2. **`squads/bks-campaign-vanguard/`**: Operações táticas de campanhas e inteligência de mídia.
3. **`squads/nexus-copy-elite/`**: Guilda de Copywriting (ideação, QA, redação, pesquisa).
4. **`squads/bks-devops/`**: Monitoria de Agents e saúde do sistema (`agent_doctor`).
5. **`squads/bks-executive-board/`**: Orquestração central (CEO, CFO, CMO, COO simulators).
6. **`squads/bks-growth-ops/`**: Tráfego pago, funil e engenharia de Landing Pages.
7. **`squads/bks-sales-page-ops/`**: Implementação especializada no fluxo de vendas (UX/UI, Copys, Dev Integrations).

---

## 3. Variáveis de Ambiente Críticas (`.env.example`)

Os agentes consomem recursos que precisam ser estritamente controlados:

| Serviço / Integração | Chave | Criticidade | Responsável Primário |
| --- | --- | --- | --- |
| **LLMs (Providers)** | `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY` | Alta | Todos os agentes delegam inferência a essas chaves. |
| **Operações & PM** | `CLICKUP_API_KEY`, `CLICKUP_TEAM_ID` | Média | Execução de tarefas e organização externa. |
| **Design** | `CANVA_API_KEY` | Baixa/Média | Agentes de Design / Social Media. |
| **Ads / Growth** | `META_ADS_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID` | Alta | `performance_campaign_architect`, `meta_ads_optimizer`. |
| **Versionamento** | `GITHUB_TOKEN` | Alta | DevOps / Engenharia CI/CD. |
| **Memória & BD** | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_PROJECT_ID`, `SUPABASE_DB_URL` | Crítica | Engine principal para Logs, Memória RAG e Execuções. |

---

## 4. Integrações Externas / Pipelines

1. Supabase (DB e Vector Store - fase de setup).
2. ClickUp (Gerenciamento de Tarefas).
3. Integração com Meta Ads (via Graph API).
4. GitHub Actions / CI/CD (identificado pelos repos e `.github/` folder nativo).
5. CodeRabbit & Husky (Linting e Quality Code pipeline).
