# 🧬 EXPERTS — Pipeline de Clonagem de Especialistas

## O que é esta pasta?
Aqui ficam os dados brutos, processados e os agentes-clone de cada expert que alimenta o Mega Brain (Jarvis) da BKS Grow.

## Estrutura por Expert
```
experts/
├── _templates/              # Templates reutilizáveis
│   ├── notebook_questions/  # Perguntas por pilar temático
│   ├── clone_agent.yaml     # Template YAML do agente clone
│   └── interview_script.md  # Roteiro de entrevista dirigida
│
├── lucas_silva/             # Expert 1
│   ├── README.md            # Ficha do expert
│   ├── raw/                 # Conteúdo bruto (transcrições, PDFs)
│   ├── notebooks/           # Outputs do NotebookLM por pilar
│   ├── dna/                 # DNA compilado (princípios, frameworks, tom)
│   └── clone_lucas_silva.yaml  # Agente-clone final
│
├── jose_ricardo/            # Expert 2
├── robert_cfo/              # Expert 3
└── ...
```

## Pipeline de Criação de Clone
1. **Ingestão** → Coletar material bruto em `raw/`
2. **NotebookLM** → Carregar em notebooks temáticos e extrair DNA com perguntas dirigidas
3. **Compilação** → Consolidar respostas em `dna/`
4. **Montagem** → Gerar o YAML do clone
5. **Calibração** → Testar e refinar com feedback do expert real

## Tempo Médio: 2-3 dias úteis por expert (com NotebookLM)
