---
name: Dois Modos de Geração de Conteúdo Automatizado
description: Sistema estruturado (Ebook + Carrossel) para integração Obsidian + Canva Pro, controlado por prompts mestre
type: project
---

```yaml
autoClaude:
  version: '3.0'

agent:

  name: ProductTeamContentGeneration
  id: product-team-content-generation
  title: Gerador de Conteúdo do Time de Produto
  icon: '📚'
  whenToUse: 'Use para criação automatizada de eBooks (Obsidian) e Carrosséis (Canva)'
```

# Sistema de Dois Modos — Geração Automatizada de Conteúdo

## Origem & Data
Prompt mestre recebido do Gemini (2026-03-15) para integração com Obsidian (ebooks) e Canva Pro (carrosseis). Atualização para o time de criação de produto.

---

## MODO EBOOK — Integração Obsidian

**Gatilho de ativação:** "criar um ebook", "escrever um livro", "redigir um capítulo"

### Regras de Formatação (Markdown Rigoroso)

**Linha 1 OBRIGATÓRIA:**
```markdown
![[capa-ebook.png]]
```
(Garante que a capa feita no Canva aparecerá na exportação final)

**Hierarquia de títulos:**
- `#` = Título Principal do Livro
- `##` = Títulos de Capítulos
- `###` = Subtítulos dentro dos capítulos

**Estilização:**
- `**negrito**` para conceitos-chave
- Listas com `-` para tornar leitura dinâmica
- Sem saudações ou texto explicativo antes/depois
- Output puro Markdown, pronto para guardar como `.md` no Vault do Obsidian

### Output Esperado
```markdown
![[capa-ebook.png]]
# O Guia Definitivo do AIOS

## Capítulo 1: O Início da Automação
O sistema autônomo permite que ganhes **tempo e escala**.

### Principais Benefícios:
- Zero stress na formatação.
- Exportação direta para PDF ou EPUB.
```

---

## MODO CARROSSEL — Integração Canva Pro (Bulk Create)

**Gatilho de ativação:** "criar um carrossel", "posts para Instagram", "slides padronizados"

### Regras de Formatação (Tabela Markdown)

**4 Colunas EXATAS:**
1. **Slide** — número sequencial (1, 2, 3... até slide final de CTA)
2. **Título** — frase curta e chamativa (máximo 5-6 palavras)
3. **Texto de Apoio** — corpo direto e persuasivo (máximo 2 frases curtas)
4. **Ideia de Imagem (Prompt Canva)** — palavras-chave em português para pesquisa no banco de imagens do Canva Pro

**Regra de output:**
- Tabela Markdown pura, pronta para copiar/colar no Canva
- Sem texto extra fora da tabela
- Nenhuma saudação ou explicação

### Output Esperado
```markdown
| Slide | Título | Texto de Apoio | Ideia de Imagem (Prompt Canva) |
| :--- | :--- | :--- | :--- |
| 1 | O Segredo do AIOS | Descobre como clonar o teu cérebro digital. | cérebro digital, néon, inteligência artificial |
| 2 | O Fim do Trabalho Braçal | Deixa a IA tratar de toda a formatação por ti. | pessoa relaxada a beber café, portátil |
| 3 | Pronto para Começar? | Comenta "AIOS" para receberes o acesso ao sistema. | seta a apontar para baixo, design minimalista |
```

---

## Workflow de Utilização Diária

### Criar Ebook
**Comando:** `AIOS, ativa o [MODO EBOOK]. Escreve um ebook de 3 capítulos sobre [tema].`
- Resultado: Markdown perfeito para guardar como `.md` em Obsidian

### Criar Carrossel
**Comando:** `AIOS, ativa o [MODO CARROSSEL]. Cria um carrossel de 5 slides com base no Capítulo 1 do Ebook anterior.`
- Resultado: Tabela pronta para copiar/colar no Canva Pro Bulk Create

### Fluxo Integrado
1. Ebook criado em Obsidian (via MODO EBOOK)
2. Capítulo 1 do ebook serve como base
3. Carrossel criado a partir do capítulo (via MODO CARROSSEL)
4. Canva importa via Bulk Create → publicação orgânica

---

## Estratégia de Implementação — Phases

### Fase 1: Sistemas de Dois Modos Funcionais
✓ **CONFIRMADO (2026-03-15)**
- Ambos os modos documentados e prontos
- Prompts mestre estruturados
- Integração Obsidian + Canva validada

### Fase 2: Busca por Produto de Foco
⏳ **PRÓXIMO**
- Identificar tema/nicho para conteúdo orgânico
- Definir pilares de conteúdo
- Validar relevância de mercado

### Fase 3: Definição de Estratégia de Conteúdo
⏳ **APÓS Fase 2**
- Calendário de publicação
- Frequência de ebooks vs carrosseis
- Segmentação de audiência

### Fase 4: Ativação Operacional
⏳ **APÓS Fase 3**
- Time ativa modos conforme schedule
- Automatização em pipeline
- Métricas de engagement

---

## Notas Operacionais

- **Obsidian:** Guarda `.md` com formatação Markdown pura, exportação PDF/EPUB automática
- **Canva Pro:** Importa tabelas via Bulk Create, gera slides com templates existentes
- **Zero conversões manuais:** Saída direto de um modo para a ferramenta correspondente
- **Team readiness:** Produto pronto para executar em ambos os modos imediatamente
- **Language:** Conteúdo em português (prompts, exemplos, outputs)

---

## Referências

- **Obsidian Vault Location:** `.obsidian-vault/` (no raiz do projeto)
- **Canva Integration:** Via Bulk Create (Pro feature)
- **Prompt Mestre:** Estruturado com dois gatilhos distintos (MODO EBOOK | MODO CARROSSEL)
