---
description: Fluxo Completo de Generative UI (Do Briefing ao Deploy e QA A/B)
---
# Workflow de Generative UI (Visual Engineering & Conversion Pipeline)

Este é o pipeline definitivo para a criação lógica, técnica e autônoma de landing pages e interfaces de alta conversão. Ele evita projetos genéricos através da aplicação das leis estéticas de Chris Do e do direcionamento estratégico de Marty Neumeier.

## Passo 1: Briefing Analysis (The Gap Check)
**Responsáveis:** `@copy_chief`, `@analyst`
Análise cruzada entre as informações do cliente e o framework do produto.
- Liste as perguntas vitais ausentes no escopo atual.
- Extraia ou force a definição do "Value at Risk" (Qual o custo de não resolver o problema?) e da "Onlyness Statement" (O que torna a oferta única).

## Passo 2: Design System Sync (Aesthetic Anchors)
**Responsável:** `@ux-design-expert`
Fundação de tipografia e estilo.
- Garanta que todos os design tokens (Cores, Fontes, Espaçamento) do projeto estejam injetados no contexto.
- Forçar os princípios de **Visual Engineering**: Respeitar a identidade visual (Dark ou Light), aplicando profundidade (Glassmorphism ou Soft-shadows), minimalismo luxuoso e alinhamento *Swiss Grid* em vez de temas flat genéricos.

## Passo 3: Section Architect (Narrative Mapping)
**Responsáveis:** `@copy_chief` e `@ux-design-expert`
Construção dinâmica das dobras da interface.
- Com a copy validada, use o Dicionário Dinâmico de Arquétipos (atualizado no agente de UX) para traduzir textos em mapas de layout visual (Ex: "Agitation" vira layout assimétrico; "Mechanism" vira um Bento Grid).
- O número de seções obedece apenas à intenção da copy, garantindo fluidez e retenção, sem se prender a antigos modelos de 6 blocos.

## Passo 4: Style Definition (Form & Friction Strategy)
**Responsável:** `@ux-design-expert`
Aqui focamos na porta de dinheiro (Captura/Checkout).
- Escolha ativamente o estilo de captura: **Progressivo** (baixo atrito inicial), **Multi-step** (qualificação B2B intensiva) ou **Direct CTA** (urgência).
- Imposição técnica obrigatória: inputs não-nativos super dimensionados (`p-4`), states com *glowing focus* e botões que destaquem drasticamente do resto do dark background. 

## Passo 5: Integration & Automation (Antigravity Connection)
**Responsavelmente:** `@dev`, `@devops`
Conexão do repositório em modo *hands-off*.
- Acionar ferramentas internas para push da estrutura para o repositório principal.
- Acoplar Webhooks / API do Antigravity (ou infraestrutura atual) automatizando a etapa de monitoramento (Telemetry/Observability) logo no deploy.

## Passo 6: QA Absoluto & A/B Testing Protocol
**Responsáveis:** `@qa`, `@copy_chief`
Teste contra estresse e otimização de conversão.
- Protocolo de simulação: rodar validação de *Accessibility (WCAG AA)* e testes visuais/E2E para confirmar inexistência de erros técnicos em formulários.
- Iniciar bateria de Variantes: Rotatividade de 2 Headlines e de 2 Calls-to-Action gerados pelo `@copy_chief` nas primeiras horas do deploy para capturar o "Sweet Spot" do mercado.
