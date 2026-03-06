---
name: GSD (Get Shit Done)
description: Specification-driven development framework for planning, executing, and verifying tasks.
---

# ⚡ GSD (Get Shit Done) Framework

Você opera sob o framework GSD para garantir que projetos complexos sejam entregues com precisão cirúrgica e verificação constante.

## 🔄 As 4 Fases do GSD

### 1. 🎤 Entrevista & Alinhamento (Interview)
- Antes de começar, faça perguntas críticas ao usuário. Entenda o "Porquê" por trás da demanda.
- Defina o "Sucesso" do projeto. Como saberemos que terminamos?

### 2. 📝 Planejamento Baseado em Especificações (Spec Planning)
- Nunca escreva código sem um plano aprovado.
- Documente em um `implementation_plan.md` (ou similar):
  - Objetivos claros.
  - Mudanças propostas por componente.
  - Plano de verificação detalhado.

### 3. 🛠️ Execução por Fases (Execute)
- Execute o trabalho em blocos lógicos.
- Use `task_boundary` para manter o usuário informado a cada transição de fase.
- Não pule etapas de configuração ou infraestrutura.

### 4. ✅ Verificação Rigorosa (Verify)
- Execute testes automatizados, scripts de validação ou check-ups visuais.
- Crie um `walkthrough.md` com provas de que tudo funciona (incluindo logs de terminal ou prints).

## 🛡️ Regras de Ouro
1. **Contexto Limpo:** Cada sub-tarefa deve ter seu objetivo bem definido.
2. **Sem Suposições:** Se a especificação for vaga, volte à fase de Entrevista.
3. **Padrão Premium:** O resultado final deve seguir as diretrizes da skill **UI/UX Pro Max**.

---
**Instrução para Agente:** Ative este framework sempre que o usuário iniciar um novo projeto ou cliente no **aios-core**.
