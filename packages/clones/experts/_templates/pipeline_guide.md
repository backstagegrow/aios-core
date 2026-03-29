# 🔬 PIPELINE GUIDE — Clonagem de Experts via NotebookLM

## Visão Geral
Este guia detalha o processo completo de criação de um "Clone Digital"
de um expert usando o Google NotebookLM como motor de extração de DNA.

## Pré-requisitos
- Acesso ao Google NotebookLM (https://notebooklm.google.com)
- Links dos vídeos do YouTube do expert (ou transcrições em .txt)
- PDFs/Docs de materiais produzidos pelo expert
- Opcional: yt-dlp + Whisper instalados para transcrever vídeos sem legenda

---

## FASE 0 — Inventário de Fontes (30 min)

1. Liste TODOS os conteúdos disponíveis do expert:
   - Vídeos do YouTube
   - Cursos gravados
   - Lives e podcasts
   - Livros/artigos/posts
   - Reuniões gravadas
   - Mensagens relevantes

2. Classifique cada fonte por pilar temático:
   - Vendas & Comercial
   - Gestão & Pessoas
   - Expansão & Franquias
   - Finanças & Margem
   - Mentalidade & Posicionamento

3. Salve o inventário no `experts/[nome]/README.md`

---

## FASE 1 — Pré-processamento de Vídeos sem Legenda

### Para vídeos com legendas no YouTube:
Nenhuma ação necessária. O NotebookLM aceita o link direto.

### Para vídeos SEM legenda:
```powershell
# 1. Baixar áudio (instalar yt-dlp se necessário)
yt-dlp -x --audio-format mp3 "URL_DO_VIDEO" -o "experts/[expert]/raw/%(title)s.mp3"

# 2. Transcrever com Whisper
whisper "experts/[expert]/raw/video.mp3" --model large-v3 --language pt --output_dir "experts/[expert]/raw/"

# 3. O arquivo .txt gerado pode ser carregado no NotebookLM
```

### Batch de múltiplos vídeos:
```powershell
# Criar arquivo urls.txt com um link por linha, depois:
yt-dlp -x --audio-format mp3 -a urls.txt -o "experts/[expert]/raw/%(title)s.mp3"

# Transcrever todos de uma vez:
Get-ChildItem "experts/[expert]/raw/*.mp3" | ForEach-Object {
    whisper $_.FullName --model large-v3 --language pt --output_dir "experts/[expert]/raw/"
}
```

---

## FASE 2 — Criação dos Notebooks no NotebookLM

1. Acesse https://notebooklm.google.com
2. Crie 5 notebooks com os nomes:
   - `[Expert] — NB01 Vendas & Comercial`
   - `[Expert] — NB02 Gestão & Pessoas`
   - `[Expert] — NB03 Expansão & Franquias`
   - `[Expert] — NB04 Finanças & Margem`
   - `[Expert] — NB05 Mentalidade & Posicionamento`

3. Em cada notebook, adicione até 50 fontes do pilar correspondente:
   - Links de YouTube (cola direto)
   - PDFs (upload)
   - Arquivos .txt (upload das transcrições)
   - Google Docs (link direto)

### Limite de 50 fontes por notebook
Se o expert tem mais de 50 vídeos sobre vendas, por exemplo:
- Crie `NB01a Vendas — Parte 1` e `NB01b Vendas — Parte 2`
- Na compilação final, faça cross-reference entre as partes

---

## FASE 3 — Extração de DNA (Perguntas)

1. Abra o notebook temático no NotebookLM
2. Abra o arquivo de perguntas correspondente:
   - `_templates/notebook_questions/NB01_vendas_comercial.md`
   - `_templates/notebook_questions/NB02_gestao_pessoas.md`
   - `_templates/notebook_questions/NB03_expansao_franquias.md`
   - `_templates/notebook_questions/NB04_financas_margem.md`
   - `_templates/notebook_questions/NB05_mentalidade_posicionamento.md`

3. Faça CADA pergunta ao NotebookLM, uma por vez
4. Copie a resposta completa (com citações de fonte)
5. Cole no arquivo `experts/[expert]/notebooks/notebooklm_outputs.md`

### Dica: A Meta-Pergunta Final
A ÚLTIMA pergunta de cada notebook pede ao NotebookLM para compilar
um "Manual" daquele pilar. Esse output é o mais valioso — ele é 
praticamente uma seção pronta do `system_prompt` do clone.

---

## FASE 4 — Compilação do DNA

1. Abra `experts/[expert]/dna/compiled_dna.md`
2. Para cada seção, consolide os outputs dos 5 notebooks:
   - Princípios: merge das crenças-raiz de todos os pilares
   - Frameworks: lista todos os processos/métodos encontrados
   - Tom: síntese das expressões e estilo
   - Anti-padrões: tudo que ele condena, de todos os pilares
   - Cases: as melhores histórias, de todos os pilares

3. Identifique PADRÕES que aparecem em múltiplos notebooks
   (esses são os princípios mais fortes e devem ter prioridade)

---

## FASE 5 — Montagem do YAML do Clone

1. Copie `_templates/clone_agent.yaml`
2. Configure para `experts/[expert]/clone_[nome].yaml`
3. Preencha cada seção do `system_prompt` com o DNA compilado
4. Defina `temperature`:
   - 0.2 para respostas mais previsíveis/técnicas
   - 0.4 para respostas mais criativas/conversacionais
   - 0.3 é o sweet spot para a maioria dos experts

---

## FASE 6 — Calibração com o Expert

1. Monte 10 perguntas de teste que cubram os 5 pilares
2. Rode as perguntas contra o clone
3. Mostre as respostas ao expert real
4. Peça nota de 1-10 para cada resposta em:
   - Precisão (ele diria isso?)
   - Tom (parece com ele?)
   - Profundidade (faltou algo?)
5. Ajuste o YAML baseado no feedback
6. Repita até calibration_score >= 8

---

## FASE 7 — Deploy e Integração

1. Mova o YAML final para `squads/` ou mantenha em `experts/`
2. Registre no ClickUp como agente ativo
3. Configure no Supabase (tabela `agents` + `agent_prompts`)
4. Integre com o fluxo do `growth_operator` ou outro orquestrador

---

## Tempos Estimados por Fase

| Fase | Tempo | Paralelizável? |
|---|---|---|
| 0 — Inventário | 30 min | — |
| 1 — Pré-processamento | 2-4h (batch automático) | ✅ |
| 2 — Criação de Notebooks | 1-2h | ✅ |
| 3 — Extração (perguntas) | 5-10h (1-2h/notebook) | Parcial |
| 4 — Compilação | 2-3h | — |
| 5 — Montagem YAML | 1h | — |
| 6 — Calibração | 1-2h | — |
| **TOTAL** | **2-3 dias úteis** | — |

---

## Troubleshooting

### NotebookLM não aceita o link do YouTube
→ O vídeo pode ser privado/não listado ou sem transcrição automática.
→ Solução: Baixar áudio com yt-dlp e transcrever com Whisper.

### Output do NotebookLM está genérico
→ Seja mais específico na pergunta: "Baseado APENAS nas fontes carregadas..."
→ Use "cite as fontes" para forçar grounding.

### Expert tem pouquíssimo conteúdo (< 10 fontes)
→ Priorize a entrevista dirigida (`_templates/interview_script.md`)
→ 2-3 horas de entrevista = material suficiente para 2-3 notebooks.

### DNA parece contraditório entre notebooks
→ Normal. O expert pode ter evoluído ao longo do tempo.
→ Use o conteúdo MAIS RECENTE como referência principal.
→ Documente a contradição no DNA como "evolução de pensamento".
