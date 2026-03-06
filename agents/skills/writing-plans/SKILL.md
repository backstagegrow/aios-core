---
name: writing-plans
description: Transforms an approved design into a granular, executable implementation plan with exact file paths, code, and verification steps.
---

# 📝 Writing Plans Skill

**Ativar após:** Aprovação do design pelo usuário na fase de `brainstorming`.

## 🎯 Objetivo
Criar um plano tão detalhado que qualquer agente (ou pessoa) sem contexto consiga executá-lo perfeitamente.

## 🔄 Processo

### 1. Revisar Design Aprovado
- Leia o arquivo de design em `docs/plans/YYYY-MM-DD-<topico>-design.md`.
- Identifique todos os componentes a serem modificados/criados.

### 2. Quebrar em Tarefas de 2-5 Min
- Cada tarefa deve ter:
  - **Objetivo** claro e único.
  - **Arquivo(s) exato(s)** a serem modificados (caminho completo).
  - **Código** completo e pronto para copiar.
  - **Verificação** — como confirmar que funcionou.

### 3. Ordenar por Dependência
- Execute do mais simples ao mais complexo.
- Nunca crie dependência circular entre tarefas.

### 4. Salvar Plano
- Salve em `docs/plans/YYYY-MM-DD-<feature-name>.md`.

## 📋 Template de Tarefa
```
### Tarefa N: [Nome Claro]
**Arquivo:** `caminho/completo/para/arquivo.ext`
**Objetivo:** [Uma linha explicando o que deve ser feito]
**Código:**
```[linguagem]
[código completo aqui]
```
**Verificação:** [Como confirmar que está correto]
```

## 🚫 Regras
- Nunca pule etapas de verificação.
- Planos vagos causam retrabalho. Seja cirurgicamente específico.

---
*Parte do ecossistema [Superpowers](https://github.com/obra/superpowers) — integrado ao aios-core.*
