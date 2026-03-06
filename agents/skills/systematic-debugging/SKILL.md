---
name: systematic-debugging
description: 4-phase root cause analysis process for debugging complex failures without guessing.
---

# 🔍 Systematic Debugging Skill

**Ativar quando:** Algo quebra inesperadamente ou não funciona como esperado.

## 🚫 Nunca Adivinhe
Antes de tentar qualquer fix, execute as 4 fases abaixo.

## 🔄 As 4 Fases

### Fase 1: OBSERVAR — Colete Evidências
- Reproduza o erro de forma confiável.
- Documente exatamente: "O que aconteceu?" vs "O que deveria acontecer?"
- Capture logs, stack traces e outputs completos.

### Fase 2: ISOLAR — Reduza o Escopo
- Crie o menor caso possível que reproduz o problema.
- Teste hipóteses eliminando variáveis uma de cada vez.
- Nunca mude múltiplas coisas ao mesmo tempo.

### Fase 3: IDENTIFICAR — Encontre a Causa Raiz
- Trace o fluxo de execução de fora para dentro.
- Verifique as suposições sobre estado e dados de entrada.
- A causa raiz é geralmente diferente do sintoma.

### Fase 4: CORRIGIR & VERIFICAR
- Aplique o fix mínimo necessário.
- Escreva um teste que teria capturado o bug.
- Execute todos os testes para confirmar que nada quebrou.

## 🔧 Ferramentas Práticas
- **Para Node.js:** `console.log` estratégico, `node --inspect`.
- **Para APIs:** Valide o `status code` e o body completo da resposta.
- **Para YAML/configs:** Valide a indentação e as chaves obrigatórias.

---
*Parte do ecossistema [Superpowers](https://github.com/obra/superpowers) — integrado ao aios-core.*
