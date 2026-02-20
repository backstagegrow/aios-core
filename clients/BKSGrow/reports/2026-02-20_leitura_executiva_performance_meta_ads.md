# BKSGrow - Leitura Executiva de Performance (Meta Ads)

**Data:** 2026-02-20  
**Origem dos dados:** Painel Meta Ads (prints operacionais)

## 1. Resumo Executivo
- Existe tração real em canais de resposta direta (WhatsApp e Lead Form).
- Há perda de eficiência por campanhas de site otimizando para `TestEvent`.
- A operação é promissora, mas ainda não está madura para escala agressiva sem correção de tracking.

## 2. Visão por C-Level

## CEO
- "Temos sinais de demanda e canal validado."
- "Ainda falta previsibilidade de crescimento porque parte da verba está em aprendizado inválido (`TestEvent`)."
- Foco: corrigir base de mensuração e escalar só o que converte em reuniões e receita.

## CMO
- "WhatsApp e Form provaram aderência de mensagem e oferta."
- "Site está subotimizado por evento incorreto."
- Foco: rotina de otimização criativa + tracking correto + comparação por canal (não só CPL, mas custo por reunião).

## CFO
- "Há eficiência parcial, mas unit economics incompletos."
- "Sem custo por reunião, custo por proposta e custo por fechamento, não existe ROI consolidado."
- Foco: cortar spend improdutivo e realocar para canais com resultado comprovado.

## Head de Receita / Comercial
- "Volume de lead não garante receita sem velocidade de atendimento e qualificação."
- "SLA de contato precisa ser <10 min para preservar performance de mídia."
- Foco: medir Lead -> Reunião -> Proposta -> Fechamento por canal.

## 3. Decisão de Board (BKSGrow)
- Escalar com controle WhatsApp e Lead Form.
- Pausar/reconstruir campanhas de site até evento de conversão final estar correto.
- Instituir scorecard semanal com métricas de funil completo até receita.

## 4. Ações Prioritárias (próximos 7 dias)
1. Remover `TestEvent` das campanhas ativas e validar evento final (`Lead`/`Contact`) com Pixel + CAPI.
2. Rebalancear verba para canais com resultado real (WhatsApp/Form).
3. Aplicar regras de corte de criativos e adsets de baixo desempenho.
4. Integrar CRM com origem de campanha/adset/anúncio.
5. Fechar scorecard executivo com:
   - CPL
   - custo por conversa
   - custo por reunião
   - taxa reunião -> proposta
   - taxa proposta -> fechamento

## 5. Risco de não executar
- Escala com sinal de otimização errado.
- Aumento de gasto sem ganho proporcional de receita.
- Decisão executiva baseada em métricas intermediárias, não em resultado financeiro.
