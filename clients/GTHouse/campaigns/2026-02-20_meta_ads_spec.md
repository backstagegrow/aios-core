# Meta Ads Strategy & Spec: GT House - Sazonalidade Q1/Q2 2026
**Date:** 2026-02-20
**Operator:** Growth Operations Orchestrator (BKS Growth Ops Squad)

## 1. Strategic Executive Summary
**Objetivo:** Antecipar a demanda de eventos corporativos estratégicos (kick-offs, meetups de diretoria e estratégias de Q2) para os meses fortes de Março a Junho, ocupando a agenda do GT House com clientes de alto ticket (R$ 60k+).
**Oportunidade:** Aproveitar o período pós-Carnaval (Fevereiro) onde decisores C-Level e Heads de Eventos finalmente fecham o orçamento e confirmam as pautas do semestre.
**Gargalo Atacado:** Previsibilidade de ocupação e dependência de indicações.
**Funnel Path:** Tráfego Pago (Instagram Reels/Feed) ➔ Landing Page de Posicionamento (Foco em Agendamento de Visita Técnica) ➔ WhatsApp Direto (Relacionamento/Concierge).

## 2. Technical Campaign Setup

| Element | Setup Detail |
| :--- | :--- |
| **Objective** | Engajamento (Destino: Mensagens/WhatsApp) ou Cadastro (Lead Form focado em qualificação) - Recomendado: Tráfego/Conversão para Página de Destino que leva ao WhatsApp, otimizando para Eventos de "Contato". |
| **Budget Strategy** | ABO (Ad Set Budget Optimization) para testar os ângulos de sazonalidade vs marcas vs dor corporativa. |
| **Geofencing** | São Paulo (Raio focado em centros empresariais: Faria Lima, Berrini, Paulista, Vila Olímpia) e Alphaville. |
| **Audiences A (Cold)** | Cargos: CEO, Diretor Executivo, Head de Marketing, Head de Eventos, Brand Manager, Chief Human Resources Officer (CHRO). |
| **Audiences B (Cold)** | Interesses corporativos premium: Forbes Brasil, Exame, Eventos B2B, HSM Management. LAL (Lookalike) de clientes atuais se houver base. |
| **Audiences C (Warm)** | Retargeting 90 dias (Engajamento IG) + Acessos ao Site + Base CRM. |
| **Placements** | Advantage+ com foco em Feed do Instagram, Reels e LinkedIn Audience Network (se aplicável via Meta, mas foco em IG). |

## 3. Creative Briefs & Copy
*Direcionamentos informados via BKS Copy Elite*

### Angle 1: Urgência Pós-Carnaval (Planejamento de Q2)
- **Formato:** Vídeo Reels (Tour Dinâmico)
- **Visual:** Cenas de integração com a natureza no Alto de Pinheiros, transição rápida para o auditório impecável e reuniões de liderança. Textos na tela elegantes.
- **Copy:** "A maioria das empresas usa fevereiro como desculpa para adiar. As que ditam o ritmo usam para blindar suas estratégias. As agendas para eventos corporativos premium de Março e Abril no GT House (cenário de gigantes como Stone e Adidas) já estão fechando. Não confine suas melhores cabeças em um hotel genérico. Dê o palco que a sua marca merece."
- **CTA:** Fale com nosso concierge e agende uma visita técnica.

### Angle 2: Mês da Mulher (Eventos Institucionais)
- **Formato:** Carrossel / Imagem Única Alta Resolução
- **Visual:** Ambientes claros, luz natural, coffee break premium e estrutura de painel (talks).
- **Copy:** "Onde as grandes líderes do mercado se encontram? Em março, a demanda por encontros corporativos sobre liderança e inclusão atinge o pico. O GT House é a escolha de grandes marcas (Boticário, Caixa) para criar conexões reais em São Paulo, longe da impessoalidade dos escritórios convencionais."
- **CTA:** Reserve a data para o seu evento executivo. Saiba mais.

### Angle 3: Contraste de Valor (Quebrando a Objeção de Preço/Aparência Genérica)
- **Formato:** Vídeo (Estilo Documentário/Bastidores de Montagem de Evento)
- **Visual:** Time-lapse de uma montagem incrível no GT House, contrastando o espaço vazio com a estrutura de naming rights corporativo rodando.
- **Copy:** "Qual o custo de um ambiente que não inspira decisões? O ambiente dita o nível da decisão que será tomada nele. Quando se trata do evento mais importante do ano para o seu conselho ou time de líderes, não arrisque seu branding em soluções commoditizadas."
- **CTA:** Descubra o diferencial do GT House. Agende sua visita técnica.

## 4. Automation & Tracking Checklist
- [x] **Pixel & CAPI:** Validar integração da API de Conversões do Meta na Landing Page.
- [x] **UTM Strategy:** Implementar padrão `?utm_source=meta&utm_medium=paid_social&utm_campaign=q1_corporativo&utm_content=[nome_anuncio]`.
- [x] **WhatsApp Tracking:** Configurar disparo de evento "Lead" ou "Contact" via GTM ao clicar no botão flutuante de WhatsApp da LP.
- [x] **CRM CRM/Webhook:** Configurar automação Z-API / Make.com para registrar a origem do lead no CRM assim que iniciar a conversa no WhatsApp, mapeando "Origem = Meta Ads (Campanha Q1)".
- [x] **SLA de Atendimento:** Garantir que o time comercial (ou IA concierge) atenda o lead em menos de 10 minutos para qualificar (Tamanho do evento e Data desejada).
