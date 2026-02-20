# Meta Campaign Architecture: GT House
**Date:** 2026-02-20
**Module:** meta_campaign_builder (BKS Growth Ops Squad)
**Ticket Goal:** R$ 60.000+ (Eventos B2B Premium)

## 1. Strategic Campaign Recommendation
Para um ticket médio estimado em R$ 60k a R$ 120k, focar em volume de leads baratos é um erro letal. A estratégia principal será a **qualificação em duas etapas**: capturar o interesse topo/meio de funil com posicionamento premium, seguido por um atrito intencional (perguntas customizadas) para afastar curiosos antes que o evento de conversão dispare e leve ao relacionamento via WhatsApp.

## 2. Campaign Objective & Optimization
- **Objetivo Primário:** Conversão / Cadastros (Leads).
- **Destino:** Formulário Instantâneo do Meta (Formulário Nativo).
- **Por que Lead Form e não LP direta no Volume 1?** Porque permite inserir perguntas qualificadoras fortes que a IA do Meta usará para otimizar os próximos CPMs, garantindo que o CPL possa ser um pouco maior, mas o Custo por MQL (Lead Qualificado Comercial) caia, dado o atrito introduzido.
- **Otimização:** Leads de Maior Intenção (Higher Intent).

## 3. Lead Form Strategy
- **Tipo de Formulário:** Maior Intenção (Higher Intent) - Com tela de revisão obrigatória.
- **Intro Copy:** "O palco para as decisões estratégicas da sua empresa. Reserve sua data no Alto de Pinheiros."
- **Perguntas de Qualificação (Atrito Intencional):**
  1. *Qual o perfil do evento que você está planejando?* (Opções: Kick-off/Convenção Corporativa, Treinamento/Imersão Liderança, Confraternização, Formatura/Casamento [Descarte]).
  2. *Qual é a estimativa do número de convidados?* (Opções: Menos de 50, 50 a 100, 100 a 200, Mais de 200).
- **Disqualification Logic:** Operadores que selecionarem "Formatura/Casamento" ou eventos sociais serão removidos do fluxo prioritário de atendimento no CRM e o pixel não os contará como conversão primária de alto valor caso utilizemos CAPI com eventos customizados.

## 4. Campaign Structure
**Nome:** `[Q1/Q2-2026] CBO_GTHouse_Sazonalidade_AltoTicket`
**Orçamento:** CBO (Campaign Budget Optimization) R$ 100 - R$ 150/dia para iniciar testes, focando verba onde a audiência qualificada responde.

**Ad Set 1: C-Level & Diretoria (Cold) - Foco: Urgência Pós-Carnaval**
- **Público:** CEO, Head de Eventos, Head de RH (CHRO), Diretor de Marketing. Idade 30-55. 
- **Geo:** São Paulo (Faria Lima, Berrini, Paulista) + Alphaville (Raio de 5-10km).

**Ad Set 2: Lookalike & Interesses Corporativos (Cold) - Foco: Autoridade/Contraste**
- **Público:** LAL 1% (Lista CRM/Base Atual ou Engajamento Alto) + Interesses: Forbes, HSM Management, Gestão Empresarial.
- **Geo:** São Paulo Metropolitana.

**Ad Set 3: Remarketing Institucional (Warm)**
- **Público:** Engajamento IG 90 dias + Acessos ao Site 90 dias.
- **Oferta:** Foco exclusivo no agendamento da visita técnica (Cenários/Grandes Marcas).

## 5. Creative Testing Framework
Testes a nível de anúncio (DCO manual - 3 ads por conjunto).

- **Angles/Vetores:**
  - *Angle 1 (Sazonal/Urgência):* Fevereiro como mês de decisão. Foco em garantir a agenda de Mar/Abril para Kick-offs.
  - *Angle 2 (Social/Diversidade):* Mês da mulher e conferências de liderança inclusiva (Março).
  - *Angle 3 (Posicionamento/Comparação):* Tire sua diretoria da "sala fria de hotel". O impacto do ambiente na tomada de decisão.
- **Variações:** Mesmo roteiro/copy, mudando os três primeiros segundos (Hook da imagem/vídeo).
  - *Hook A:* Fachada e Natureza (Sofisticação)
  - *Hook B:* Auditório cheio com marca rodando (Autoridade)
  - *Hook C:* Pessoa influente/Speaker no palco (Ação)

## 6. CRM & WhatsApp Integration
- O Lead Form do Meta não ficará órfão. Integração via Make.com/Zapier escutará o evento de novo lead.
- *Fluxo:* Lead cadastrado -> Criação de Deal no CRM de Vendas -> Automação dispara alerta interno no Slack/WhatsApp para o SDR de Eventos. Se o lead marcou opções Premium (Eventos >100 pax, Corporativo), o lead é rotulado como HOT e notificação de urgência (15 min SLA).

## 7. Scaling Logic
- Se um Ad Set mantiver Custo por Reunião Agendada (visita técnica) abaixo de R$ 500, e taxa de comparecimento > 60%, escalar o budget da campanha em 20% a cada 2 dias. 
- Para escalar lateralmente (Horizontal), duplicar os Ad Sets vencedores trocando a segmentação por listas de CNPJs (Lookalike de B2B).

## 8. Kill Logic
- Se um Ad atingir R$ 200 de gasto e 0 leads: Desligar Criativo.
- Se o Custo por Visita Técnica for maior que R$ 1.500: Pausar e reavaliar atrito do formulário.
- Se MQLs forem preenchidos por "Curiosos" ou eventos não corporativos: Fechar mais a segmentação demográfica e adicionar a idade mínima (ex: 35+).

## 9. 14-Day Optimization Plan
- **Dias 1-3:** Aprender quais ganchos visuais têm menor CTR-Out (fuga). Não mexer no orçamento.
- **Dias 4-7:** Avaliar taxa de preenchimento (Lead Form abandons). Ajustar as perguntas de qualificação se o atrito estiver excessivamente alto ou nulo. Avaliar primeiros feedbacks do SDR.
- **Dias 8-10:** Matar os anúncios com custo por lead muito alto (acima de R$ 100/lead caso a qualidade do pipeline não compense). Concentrar orçamento nos criativos que trazem agendamentos reais.
- **Dias 11-14:** Escalar orçamento diário para acelerar lotação da grade de maio/junho e consolidar o funil warm (remarketing).
