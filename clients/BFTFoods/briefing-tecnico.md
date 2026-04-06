# 📑 Briefing Técnico — BFT News Scout

## 🎯 Objetivo
Criar uma sonda automática de notícias focada em trading de commodities alimentares (Boi e Frango) e logística internacional, com foco em oportunidades de mercado e conformidade institucional.

## 🔍 Nichos e Palavras-Chave
- **Produtos:** Carne Bovina (Beef), Frango (Poultry), Halal Food.
- **Geografia:** Dubai (Logística/Hub), China (Consumo), Arábia Saudita (Liderança Halal), Brasil (Exportação), EUA (Trading).
- **Temas Críticos:** 
    - Tarifas de Importação/Exportação.
    - Acordos comerciais (ex: Mercosul-UE).
    - Recordes de consumo e exportação.
    - Certificações Halal.

## 🛠️ Regras de Operação (Core Logic)
1.  **Janela Temporal (Currency):** 
    - O agente deve ignorar notícias com mais de **7 dias** de idade. 
    - *Exemplo:* Se hoje é dia 30, a busca deve retroceder no máximo até o dia 23.
2.  **Output Estruturado:**
    - Toda notícia deve ser entregue em formato de tabela Markdown:
    `| Fonte | Data | Manchete | Link |`
3.  **Filtro Institucional (Brand Guardrail):**
    - ❌ **Proibido:** Críticas a governos, especulações negativas ou conteúdo que denigra a imagem da BFT ou parceiros.
    - ✅ **Obrigatório:** Foco em dados de mercado, comunicados oficiais e tendências de supply chain.

## 🏗️ Estrutura de Concepção
- **Agente:** `bft-scout`
- **Output Path:** `clients/BFTFoods/data/news-feed.json`
- **Manual de Referência:** Baseado nos padrões visuais enviados (Trading Headlines).

---
*Documento concebido por Aria (@architect) — 30/03/2026*
