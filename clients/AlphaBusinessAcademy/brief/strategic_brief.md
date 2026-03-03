# Strategic Brief — Alpha Business Academy
## "O Caminho do Dono" — Landing Page de Inscrição para Evento Presencial

**Pipeline Version:** 2.0
**Phase:** 0 (Briefing & Intake)
**Data:** 02/03/2026

---

## 1. Client Snapshot
- **Client Name:** Alpha Business Academy
- **Segment:** Educação empresarial / Mentorias high ticket
- **Product/Service:** Imersão presencial "O Caminho do Dono" + Mentoria R$35k
- **Offer Type:** Evento presencial → funil de qualificação → mentoria high ticket
- **Ticket Range:** Imersão (a definir) → Mentoria R$35.000
- **Region/Language:** São Paulo/Grande SP — Português BR

## 2. Business Goal
- **Primary Goal:** Inscrições qualificadas para o evento presencial
- **Secondary Goal:** Pré-qualificação para mentoria high ticket (R$35k)
- **Monthly Target:** A definir com cliente
- **Deadline / Campaign Window:** Evento em 21-22 de Março de 2026

## 3. ICP and Buyer Context
- **ICP:** Dono(a) de pequeno/médio negócio da área alimentícia (cafeterias, restaurantes, franquias). 28-54 anos, SP/Grande SP
- **Decision Maker Role:** Dono/CEO/Gestor decisor
- **Buying Stage:** Problem-aware → Solution-aware (sabe que precisa mudar, mas não sabe como)
- **Main Pain:** Preso no operacional — tudo depende dele(a); falta processo e delegação
- **Desired Outcome:** Liberdade de tempo, lucro previsível, escala com time e processo

## 4. Offer and Mechanism
- **Core Offer:** Imersão presencial de 2 dias "O Caminho do Dono"
- **Offer Components:**
  - 2 dias de imersão presencial
  - Coquetel/networking no dia anterior
  - Acesso direto a mentores (Lucas Silva, José Ricardo, Robert CFO)
  - Tripé da Excelência Empresarial™ (Receita, Escala, Pessoas, Margem)
- **Delivery Format:** Presencial — Edifício Morumbi Office Tower, São Paulo
- **Unique Mechanism:** Tripé da Excelência Empresarial™
- **Pricing Anchor:** NÃO divulgar preço na LP — inscrição via aplicação (processo seletivo)
- **Risk Reversal:** Vagas limitadas + processo seletivo = exclusividade e curadoria

## 5. Proof and Authority
- **Case Studies:** Ponto Alpha Café (de camelô à expansão +500 lojas)
- **Social Proof:**
  - Lucas Silva — CEO Ponto Alpha Café, Executivo Monster Dog
  - José Ricardo — Fundador Ponto Alpha, jornada real
  - Robert — Mentor e CFO, estratégia e governança
  - Eduardo Oliveira / Victor Silva — branding, marketing, COO, expansão
- **Hard Metrics:** +500 lojas (José Ricardo), números de expansão
- **Awards / Certifications:** A levantar com cliente
- **Media / Partnerships:** A levantar com cliente

## 6. Objections and Friction
- **Top 5 Objections:**
  1. "Não tenho tempo para parar 2 dias" → O custo de NÃO parar é maior
  2. "Será que é prático?" → Foco 100% em execução, não teoria/motivação
  3. "É para o meu segmento?" → Especificamente para food service/alimentícia
  4. "Não sei se minha equipe aguenta sem mim" → Esse é exatamente o problema que resolvemos
  5. "O investimento é alto" → Processo seletivo, não é para qualquer um
- **Legal/Compliance Boundaries:** LGPD (consentimento para captura de dados)
- **Claims NOT allowed:** Garantias de faturamento específico
- **Sensitive Terms to avoid:** Consultoria (somos operadores), fórmula mágica, motivacional

## 7. Messaging Guidelines
- **Brand Voice:** Direto, adulto, responsável
- **Tone:** Premium, consultivo, firme
- **Mandatory Phrases:** "Tripé da Excelência Empresarial™", "O Caminho do Dono"
- **Forbidden Phrases:** "Consultoria", "fórmula mágica", "transformação pessoal", "coach"
- **Competitors to avoid citing:** Nenhum específico

## 8. UX/UI Direction
- **Visual References:** Site atual: https://pontoacafe.com/evento-presencial-o-caminho-do-dono/
- **Preferred Style:** Premium, editorial, dark-mode com toques dourados
- **Typography Preference:** Inter (conforme brand manual) — NÃO Poppins
- **Mandatory Sections:** Hero, Problema, Mecanismo, Prova Social, Palestrantes, Sobre o Evento, FAQ, CTA Final
- **Optional Sections:** Timer de urgência, galeria de eventos anteriores
- **Need Gallery/Carousel section?** Sim — fotos de eventos anteriores
- **Animation Preferences:** Moderate — premium, sem exagero
- **CTA Interaction Style:** Gradient shift com glow sutil
- **Accessibility Requirements:** Básico (contraste, focus states, tamanhos legíveis)

## 9. Technical Requirements (Frontend/Backend)
- **Target Path:** `clients/AlphaBusinessAcademy/builds/`
- **Existing Stack Constraints:** HTML/CSS/JS puro (sem framework)
- **Form Fields Required:** Nome, Email, Telefone/WhatsApp, Nome da Empresa, Segmento, Faturamento mensal (range), "Como soube do evento?"
- **Validation Rules:** Email válido, telefone com DDD, campos obrigatórios marcados
- **Success/Error UX Behavior:** Modal de confirmação → redirect para WhatsApp da equipe
- **CRM/Webhook Endpoint:** A definir (Supabase leads table + webhook)
- **Required Metadata:** UTM source, medium, campaign, content, term

## 10. Security & Privacy (LGPD)
- **Legal basis/consent requirement:** Consentimento explícito (checkbox obrigatório)
- **Data minimization scope:** Só campos listados acima
- **Privacy policy URL:** A fornecer pelo cliente
- **Terms URL:** A fornecer pelo cliente
- **Retention policy summary:** Dados de leads mantidos enquanto relevantes para contato comercial
- **Third-party processors:** Supabase (hosting/DB), WhatsApp Business
- **What must NOT be collected:** CPF, dados sensíveis, informações financeiras detalhadas

## 11. Tracking and Analytics
- **Pixel IDs:** A fornecer pelo cliente (Meta Pixel)
- **Events Required:** Lead, Contact, SubmitForm, ViewContent, InitiateCheckout
- **UTM Pattern:** utm_source=meta/google, utm_medium=cpc/cpm, utm_campaign=[nome_campanha]
- **Attribution Window:** 7 dias click, 1 dia view
- **Dashboard / Reporting Destination:** A definir

## 12. Acceptance Criteria (Go/No-Go)
- **Copy score minimum:** 8/10
- **UX score minimum:** 8/10
- **Frontend quality minimum:** 8/10
- **Backend reliability minimum:** 8/10
- **Tracking readiness minimum:** 8/10
- **Final approver:** Humano (via Phase 9 — Localhost Review Gate)

## 13. Assets Checklist
- [ ] Logo pack (Alpha Business Academy)
- [ ] Brand manual ✅ (disponível: brand_manual.md)
- [x] ICP definido ✅ (disponível: icp.md)
- [x] Estratégia do evento ✅ (disponível: event_strategy.md)
- [x] Manual estratégico ✅ (disponível: manual_estrategico.md)
- [x] Mapa de sentimento ✅ (disponível: sentiment_map.md)
- [ ] Fotos do evento / palestrantes
- [ ] Depoimentos aprovados
- [ ] Privacy policy URL
- [ ] Terms URL
- [ ] Thank-you message

## 14. Open Questions
- Q1: Qual o preço da inscrição? (ou é apenas aplicação?)
- Q2: Fotos disponíveis de eventos anteriores?
- Q3: Pixel IDs já configurados?

---

## Quick Assessment
- **Maturity Profile:** 📊 GROWTH (tem produto validado, precisa escalar funil)
- **B2B Matrix Classification:** 📋 PROCEDURE (vende via metodologia, cases, resultados)
- **Page Type Recomendado:** Single LP longa com formulário de aplicação
- **Complexidade Estimada:** Média-Alta (high ticket, processo seletivo, múltiplos palestrantes)
