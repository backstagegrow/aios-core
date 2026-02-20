# GT House - Playbook de Otimizacao Meta Ads (D1-D14)

**Data base:** 2026-02-20  
**Conta:** GT House  
**Objetivo:** reduzir custo por resultado qualificado e aumentar reunioes/visitas tecnicas

## 1. Diagnostico Inicial
- Canal mais eficiente: WhatsApp
- Canal com melhor volume: Lead Form
- Gargalo atual: campanhas de Site com `TestEvent` (sem sinal de otimização valido)

## 2. Regras Globais (sempre ativas)
- Pausar anuncio com gasto > R$ 100 e 0 resultado.
- Pausar anuncio com CPL > 1.7x media da campanha apos 2x janela de aprendizado.
- Escalar apenas adsets com resultado consistente por 48h.
- Nunca escalar e trocar criativo no mesmo dia para o mesmo adset.

## 3. Fluxo D1-D14

## D1 - Correcoes Criticas
- Pausar todos os adsets/campanhas com `TestEvent`.
- Validar evento primario correto no site (`Lead` ou `Contact`) no Events Manager.
- Confirmar UTM em 100% dos anuncios.
- Confirmar captura CRM com origem (campaign/adset/ad).

Checklist:
- [ ] TestEvent removido das campanhas ativas
- [ ] Evento final validado
- [ ] CRM recebendo parametros

## D2 - Limpeza de Perdedores
- Revisar anuncios por campanha.
- Cortar criativos sem tracao (regra de corte global).
- Manter no maximo 2-3 criativos por adset para concentrar entrega.

Checklist:
- [ ] Perdedores pausados
- [ ] Top criativos priorizados

## D3 - Refino de Mensagem
- Ajustar copy dos perdedores com base em objeções do comercial.
- Rodar 3 angulos:
  1. Autoridade (cases e marcas)
  2. Risco de commodity
  3. Previsibilidade operacional

Checklist:
- [ ] Novas variacoes publicadas
- [ ] Hipotese por criativo registrada

## D4 - Qualidade de Lead
- Auditar qualidade dos leads com SDR/comercial.
- Marcar origem por canal (WhatsApp vs Form).
- Ajustar perguntas de qualificação no formulário se necessário.

Checklist:
- [ ] Feedback comercial incorporado
- [ ] Ajuste de qualificação executado

## D5 - Escala Vertical Inicial
- Escalar apenas vencedores: +15% a +20% no budget.
- Nao alterar segmentacao no mesmo dia da escala.

Checklist:
- [ ] Escala aplicada apenas em vencedores
- [ ] Performance monitorada por 24h

## D6 - Monitoramento de Estabilidade
- Verificar impacto da escala em CPL, CTR, volume.
- Reverter escala se houver degradação acima de 25% no custo.

Checklist:
- [ ] Estabilidade confirmada
- [ ] Rollback aplicado se necessario

## D7 - Revisao Semanal 1
- Consolidar KPIs da semana:
  - CPL
  - custo por conversa
  - taxa lead -> reuniao
  - custo por reuniao
- Decidir alocacao de verba para semana 2.

Checklist:
- [ ] Scorecard semanal fechado
- [ ] Decisoes de budget documentadas

## D8 - Escala Horizontal
- Duplicar adset vencedor com nova audiencia (LAL/interesse adjacente).
- Manter criativos vencedores com 1 nova variacao de hook.

Checklist:
- [ ] Novo adset horizontal ativo
- [ ] Aprendizado monitorado

## D9 - Ajuste de Frequencia e Fatiga
- Revisar frequencia por criativo.
- Se fadiga, trocar gancho inicial mantendo estrutura vencedora.

Checklist:
- [ ] Fadiga mapeada
- [ ] Refresh criativo aplicado

## D10 - Reentrada Controlada de Site (se tracking ok)
- Reativar campanha de site com evento correto (Lead/Contact).
- Budget inicial baixo (10%-15% da verba total) para validacao.

Checklist:
- [ ] Site conversion reativado com evento correto
- [ ] Janela de teste definida

## D11 - Comparativo de Canal
- Comparar custo por resultado qualificado entre:
  - WhatsApp
  - Form
  - Site
- Rebalancear budget para canal mais rentavel.

Checklist:
- [ ] Canal vencedor da semana identificado
- [ ] Rebalanceamento aplicado

## D12 - Otimizacao de Conversao Final
- Ajustar CTA e fluxo de atendimento para reduzir perda pos-lead.
- Alinhar SLA comercial (<10 min) e script inicial.

Checklist:
- [ ] SLA validado
- [ ] Script comercial atualizado

## D13 - Preparacao de Escala
- Consolidar apenas criativos e adsets vencedores.
- Congelar grandes mudancas e preparar sprint de escala.

Checklist:
- [ ] Stack vencedora consolidada
- [ ] Plano de escala pronto

## D14 - Revisao Semanal 2 + Proximo Ciclo
- Fechar scorecard D1-D14.
- Definir:
  - o que escalar
  - o que pausar
  - quais testes entram no proximo ciclo.

Checklist:
- [ ] Scorecard final concluido
- [ ] Backlog de testes do proximo ciclo aprovado

## 4. Scorecard Padrao (preencher semanalmente)
- Spend total:
- Leads (Form):
- Conversas (WhatsApp):
- CPL medio:
- Custo por conversa:
- Reunioes agendadas:
- Custo por reuniao:
- Show rate reuniao:
- Canal vencedor:

## 5. Decisao Rapida (Playbook de Crise)
- Se CPL subir >30% em 48h:
  - cortar perdedores
  - reduzir escala
  - reforcar criativos de autoridade
- Se volume cair >30%:
  - ampliar audiencia horizontal
  - aumentar budget no canal vencedor
- Se lead ruim aumentar:
  - endurecer qualificação no form
  - revisar copy e promessa
