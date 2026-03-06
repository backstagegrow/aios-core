---
name: test-driven-development
description: Enforces RED-GREEN-REFACTOR cycle. No code is written before a failing test exists.
---

# 🧪 Test-Driven Development (TDD) Skill

**Ativar durante:** Toda implementação de código ou lógica de automação.

## 🔄 O Ciclo RED-GREEN-REFACTOR

### 🔴 RED — Escreva o Teste Primeiro
1. Escreva um teste para a funcionalidade que você ainda vai construir.
2. Execute o teste — ele **deve falhar**. Se passar, o teste está errado.
3. Confirme o erro esperado antes de prosseguir.

### 🟢 GREEN — Faça Passar
1. Escreva o **mínimo de código** necessário para o teste passar.
2. Não otimize. Não adicione funcionalidades extras.
3. Execute o teste — ele deve passar agora.

### 🔵 REFACTOR — Limpe
1. Melhore o código sem mudar o comportamento.
2. Remova duplicações. Aplique princípios SOLID.
3. Execute todos os testes novamente — nada pode quebrar.
4. **Commit** após cada ciclo bem-sucedido.

## 🚫 Anti-patterns a Evitar
- Escrever código antes do teste.
- Testes que sempre passam (vazios ou falsos positivos).
- Deixar código comentado ou dead code no projeto.
- Pular o passo de verificação de falha (RED).

## ⚡ No Contexto do AIOS
Para scripts de automação (Node.js), validações de API e integrações ClickUp, escreva sempre:
1. Um script de teste simples antes do script principal.
2. Valide o contexto e os parâmetros antes de fazer chamadas de API.

---
*Parte do ecossistema [Superpowers](https://github.com/obra/superpowers) — integrado ao aios-core.*
