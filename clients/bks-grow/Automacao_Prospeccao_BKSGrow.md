# Automação de Prospecção — BKS Grow
## Stack 90% gratuita + IA

*Arquitetura: n8n (orquestrador) + Claude API (cérebro) + stack free existente*
*Premissa: humano só aprova e envia. Máquina faz o resto.*

---

## VISÃO GERAL DA ARQUITETURA

```
LEADS (Apollo / LinkedIn)
  ↓
n8n (orquestrador central)
  ↓
Claude API (personalização + classificação)
  ↓
Brevo (email auto) | Z-API (WhatsApp draft) | HubSpot CRM
  ↓
Calendly (agendamento auto)
  ↓
Humano: aprova DMs + posta no grupo (2 toques/dia)
```

**Meta:** 600 contatos/mês com 2–3 horas de trabalho humano/semana.

---

## STACK COMPLETA

| Ferramenta | Função | Custo |
|-----------|--------|-------|
| **n8n** (Docker self-hosted) | Orquestrador de todos os fluxos | Grátis |
| **Claude API** | Personalização + classificação de respostas | ~R$5–15/mês no volume atual |
| **Apollo.io** | Encontrar leads (cargo + setor + email) | Grátis (50 créditos/mês) |
| **Brevo** | Sequência de email automática | Grátis (300 emails/dia) |
| **HubSpot CRM** | Rastrear leads, temperatura, histórico | Grátis |
| **Z-API** | Receber webhooks WhatsApp + envio programático | ~R$50/mês |
| **Calendly** | Agendamento automático do diagnóstico | Grátis |
| **Google Sheets** | Base de leads + log de interações | Grátis |

**Custo total:** R$50–65/mês (só Z-API + Claude API)

---

## FLUXO 1 — Encontrar e Preparar Leads

**Acionamento:** manual 1x/semana (30 min)

```
Apollo.io → exporta CSV (cargo + empresa + email + LinkedIn)
  ↓
n8n processa CSV linha por linha
  ↓
Claude API gera:
  - Primeira linha personalizada (menciona algo real da empresa)
  - Score de fit (1–10 baseado em cargo + tamanho + setor)
  ↓
Google Sheets atualiza planilha de leads com status "novo"
  ↓
HubSpot cria contato automaticamente
```

**Prompt Claude para personalização:**
```
Empresa: {nome}
Setor: {setor}
Cargo do contato: {cargo}
Site/LinkedIn da empresa: {url}

Gere uma primeira linha de email cold que:
- Mencione algo específico e real da empresa (não genérico)
- Não assuma que eles têm problema
- Soe como escrito por humano, não por IA
- Máximo 1 frase
```

---

## FLUXO 2 — Sequência de Email (100% automático)

**Acionamento:** automático quando lead entra no HubSpot com status "novo"

```
HubSpot detecta novo lead
  ↓
n8n aciona Brevo — inicia sequência de 5 emails
  ↓
Email 1 → Dia 0   (personalizado com linha do Claude)
Email 2 → Dia 4   (pergunta rápida)
Email 3 → Dia 9   (case anônimo)
Email 4 → Dia 14  (reply thread — parece humano)
Email 5 → Dia 21  (breakup)
  ↓
Brevo detecta resposta → para sequência automaticamente
  ↓
n8n recebe webhook de resposta → aciona Fluxo 3
```

**Regras automáticas no Brevo:**
- Abriu email mas não respondeu → marca como "morno" no HubSpot
- Não abriu nenhum → marca como "frio" após email 5
- Respondeu → para tudo, aciona classificação

---

## FLUXO 3 — Classificação de Respostas (95% automático)

**Acionamento:** qualquer resposta recebida (email ou WhatsApp)

```
Resposta chega (Brevo webhook ou Z-API webhook)
  ↓
n8n captura texto da mensagem
  ↓
Claude API classifica:
  - Tipo de resposta (interesse / objeção tempo / objeção verba / curioso / negativo)
  - Temperatura (quente / morno / frio)
  - Script recomendado (número do gatilho 1–6)
  - Rascunho da resposta personalizada
  ↓
n8n atualiza HubSpot (temperatura + próxima ação)
  ↓
Notificação para o humano com:
  - Nome do lead
  - O que ele disse
  - Script recomendado
  - Rascunho pronto para enviar
  ↓
Humano: lê, ajusta se necessário, clica enviar (30 segundos)
```

**Prompt Claude para classificação:**
```
Contexto: prospecção B2B para consultoria de crescimento no setor de eventos.
Mensagem recebida: "{texto_da_resposta}"

Classifique:
1. Tipo: [interesse_direto | curioso_travado | objecao_tempo | objecao_verba | negativo]
2. Temperatura: [quente | morno | frio]
3. Script: [1_indicacao | 2_trafego | 3_outbound | 4_misto | 5_so_reagiu | 6_comentou | diagnostico_direto]
4. Rascunho de resposta: [escreva a resposta ideal em português informal, voz de fundador, máximo 4 linhas]

Responda em JSON.
```

---

## FLUXO 4 — WhatsApp Grupo (80% automático, 20% humano)

**O que NÃO dá para automatizar:** postar no grupo (ToS do WhatsApp)
**O que dá:** tudo que vem depois.

```
Humano posta no grupo (1 post, 2x/semana — 5 min)
  ↓
Z-API monitora grupo via webhook
  ↓
Alguém reage ou comenta
  ↓
n8n captura: quem foi, o que fez, qual post
  ↓
Claude API gera rascunho de DM personalizada
  (baseado no gatilho: reagiu / comentou / respondeu enquete)
  ↓
Notificação no celular do fundador:
  "[Nome] reagiu ao post. Rascunho de DM pronto. Enviar?"
  ↓
Humano: revisa em 10 segundos, clica enviar
```

**Fluxo de DM após envio:**
```
Lead responde DM
  ↓
Z-API webhook → n8n
  ↓
Claude API classifica resposta + gera próximo rascunho
  ↓
Notificação com rascunho pronto
  ↓
Humano envia (30 segundos)
```

---

## FLUXO 5 — Agendamento (100% automático)

```
Lead quente confirmado (temperatura = quente no HubSpot)
  ↓
n8n insere link do Calendly na próxima mensagem automaticamente
  ↓
Lead escolhe horário
  ↓
Calendly cria evento + manda confirmação automática
  ↓
n8n atualiza HubSpot para "reunião agendada"
  ↓
1 hora antes da reunião: WhatsApp automático de lembrete
  "Oi [Nome], só confirmando nossa conversa hoje às [hora]. Até já!"
  ↓
Após reunião: n8n agenda follow-up automático 24h depois
```

---

## FLUXO 6 — Nurture de Leads Frios (100% automático)

```
Lead marcado como "frio" no HubSpot
  ↓
n8n agenda reativação automática em 30 dias
  ↓
Brevo dispara email de reativação:
  "Oi [Nome], passaram 30 dias desde nosso contato.
   Compartilhando algo que saiu sobre o setor que pode ser relevante. [insight]"
  ↓
Se abrir → sobe para "morno" → inicia sequência leve de 3 emails
Se não abrir → arquiva após 90 dias
```

---

## IMPLEMENTAÇÃO — Ordem de Prioridade

### Semana 1 — Base
- [ ] Instalar n8n via Docker (`docker run -d n8nio/n8n`)
- [ ] Conectar Brevo ao n8n
- [ ] Configurar HubSpot gratuito + integração n8n
- [ ] Subir planilha de leads no Google Sheets
- [ ] Configurar Calendly com link do diagnóstico

### Semana 2 — Email Auto
- [ ] Montar sequência de 5 emails no Brevo
- [ ] Fluxo n8n: Apollo CSV → Sheets → HubSpot → Brevo
- [ ] Integrar Claude API para personalização da primeira linha
- [ ] Testar com 10 leads reais

### Semana 3 — WhatsApp
- [ ] Ativar Z-API (instância WhatsApp Business)
- [ ] Webhook grupo → n8n → classificação → notificação
- [ ] Fluxo de DM: recebe → classifica → rascunho → notifica humano

### Semana 4 — Classificação + Nurture
- [ ] Fluxo de classificação de respostas (email + WhatsApp)
- [ ] Nurture automático de leads frios
- [ ] Dashboard no HubSpot: pipeline, temperatura, taxa de resposta

---

## O QUE SOBRA PARA O HUMANO

| Ação | Tempo/semana |
|------|-------------|
| Exportar leads do Apollo | 30 min |
| Postar 2x no grupo WhatsApp | 10 min |
| Aprovar e enviar DMs (30s cada) | 45 min |
| Fazer reuniões de diagnóstico | variável |
| **Total** | **~2h/semana** |

---

## CUSTO vs RESULTADO ESPERADO

| Item | Custo/mês |
|------|-----------|
| Z-API | R$50 |
| Claude API | R$15 |
| n8n (Docker próprio) | R$0 |
| Brevo / HubSpot / Calendly | R$0 |
| **Total** | **R$65/mês** |

| Métrica | Projeção |
|---------|----------|
| Leads prospectados/mês | 600 |
| Respostas (~10%) | 60 |
| Reuniões (~30% das respostas) | 18 |
| Propostas (~60% das reuniões) | 10–11 |
| **CPR (Custo por Reunião)** | **R$3,60** |
