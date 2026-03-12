---
description: Seletor inteligente de skills para cada tipo de projeto de cliente
---

# Skill Selector — Puxar Skills por Tipo de Projeto

Este workflow orienta quais skills devem ser ativadas dependendo do tipo de entrega
para o cliente. Todas as 1.232+ skills já estão instaladas globalmente em
`~/.gemini/antigravity/skills/`. Basta referenciar pelo nome durante a conversa.

---

## 1. Identificar o Tipo de Projeto

Antes de iniciar, classifique o projeto em uma das categorias abaixo:

| Código | Tipo de Projeto               | Exemplo Real               |
|--------|-------------------------------|----------------------------|
| LP     | Landing Page / Site One-Page  | GTHouse, Espaço Constru    |
| SA     | SaaS / Web App                | Plataforma com login       |
| BR     | Branding / Identidade Visual  | Logo + Design System       |
| MK     | Campanha de Marketing Digital | Funil Meta Ads + Email     |
| AI     | Agente / Automação com IA     | Chatbot, Pipeline LLM     |

---

## 2. Skills por Categoria

### 🎨 LP — Landing Page / Site One-Page
Skills essenciais para criar páginas premium com conversão alta.

```
@frontend-design       → Estética e UI Guidelines
@seo-audit             → Otimização para Google
@form-cro              → Formulários que convertem
@copywriting           → Copy de venda persuasiva
@tailwind-patterns     → Classes utilitárias modernas
@scroll-experience     → Animações scroll-driven
@fixing-accessibility  → WCAG e acessibilidade
@fixing-metadata       → SEO meta tags + Open Graph
@canvas-design         → Criação de assets visuais
```

### 🚀 SA — SaaS / Web App
Skills para construir aplicações completas com backend e auth.

```
@senior-fullstack          → Guia fullstack end-to-end
@react-best-practices      → React 19+ / Next.js patterns
@nextjs-best-practices     → App Router e SSR
@backend-dev-guidelines    → Node.js/Express/TypeScript
@api-design-principles     → REST vs GraphQL vs tRPC
@database-design           → Schema, ORM, migrations
@stripe-integration        → Pagamentos e assinaturas
@auth-implementation-patterns → JWT, OAuth2, RBAC
@test-driven-development   → TDD red-green-refactor
@deployment-procedures     → Deploy seguro e rollback
```

### 🎯 BR — Branding / Identidade Visual
Skills para definir identidade de marca e design system.

```
@ui-ux-pro-max         → Design tokens e sistemas visuais
@frontend-design       → Base estética do projeto
@canvas-design         → Posters, banners, artes
@algorithmic-art       → Artes generativas com código
@3d-web-experience     → Three.js e experiências 3D
@interactive-portfolio → Portfólios interativos
@copy-editing          → Revisão e polimento de texto
```

### 📈 MK — Campanha de Marketing Digital
Skills para construir funis, e-mail marketing e growth hacking.

```
@content-creator       → Conteúdo SEO-optimized
@seo-audit             → Saúde técnica de SEO
@programmatic-seo      → Páginas em escala
@analytics-tracking    → GA4, PostHog, eventos
@ab-test-setup         → Testes A/B validados
@email-sequence        → Automação de e-mails
@copywriting           → Copy para anúncios e pages
@launch-strategy       → Plano de lançamento
@social-content        → Posts para redes sociais
@competitor-alternatives → Páginas de comparação
```

### 🤖 AI — Agente / Automação com IA
Skills para criar pipelines de IA, chatbots e agentes autônomos.

```
@ai-agents-architect   → Arquitetura de agentes
@agent-tool-builder    → Criar ferramentas para agentes
@rag-engineer          → Sistemas RAG com vetores
@prompt-engineering    → Engenharia de prompts
@langgraph             → Orquestração multi-agente
@vercel-ai-sdk-expert  → SDK de IA da Vercel
@mcp-builder           → Criar servidores MCP
@llm-evaluation        → Avaliação de qualidade
@context-window-management → Gestão de contexto
```

---

## 3. Como Usar na Prática

Ao iniciar qualquer sessão de trabalho com um cliente:

// turbo-all
1. Consulte o tipo de projeto na tabela do passo 1
2. Copie o bloco de skills relevante do passo 2
3. No início da conversa, diga:

```
Estou trabalhando em um projeto tipo [LP/SA/BR/MK/AI] para o cliente [Nome].
Use as skills: @skill1, @skill2, @skill3 para guiar o trabalho.
```

4. Combine categorias quando necessário:
   - **LP + MK** → Landing page de campanha com funil
   - **SA + AI** → SaaS com funcionalidades de IA
   - **BR + LP** → Branding completo + site showcase

---

## 4. Regras de Ouro

- **Sempre** comece com `@brainstorming` para planejar antes de executar
- **Sempre** finalize com `@lint-and-validate` para checar qualidade
- Para cada cliente, o **design system próprio** deve existir em `clients/[ClientName]/design_system.html`
- Skills são **cumulativas** — você pode combinar livremente entre categorias
