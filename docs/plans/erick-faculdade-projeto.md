# Projetos - Erick - Faculdade Projeto

## 📋 Resumo da Reunião de Alinhamento
**Participantes:** Erick Moreira Sena Silveira, Luciana Paula Reis (Coordenadora de Pós-graduação UFOP)
**Data:** 17/04/2026
**Objetivo:** Criação de um SaaS para automatizar a gestão de dados acadêmicos e indicadores da CAPES.

---

## 🚀 Mapeamento de Requisitos e Funcionalidades

### 1. Módulo Lattes Intelligence
*   **Extração Automatizada:** Consumir dados públicos do Currículo Lattes dos professores via links fixos.
*   **KPIs Extraídos:**
    *   Índice H (Métricas de impacto).
    *   FWCI (Field-Weighted Citation Impact) via Scopus.
    *   Lista de publicações e validação de Journals (JCR/Scopus/Qualis).
    *   Projetos de pesquisa (com e sem financiamento).
    *   Orientações de Mestrado (em andamento e concluídas).
*   **Automação:** Cruzamento sistemático para evitar preenchimento manual anual/semestral pelos professores.

### 2. Integração SRA UFOP (Academic Registry)
*   **Processamento de Dados:** Importação de planilhas XLS/CSV exportadas do sistema oficial da UFOP.
*   **Funcionalidades:**
    *   Controle de alunos ativos (atualmente ~89-90 alunos).
    *   Monitoramento de prazos para evitar jubilamento (jubilamento precoce).
    *   Gestão de bolsas (atualmente 12 bolsas no programa).
    *   Média de orientados por professor.

### 3. Smart Forms System (Substituição do Google Forms)
*   **Unificação de Formulários:** Substituir os ~6 formulários atuais por uma interface única no SaaS.
*   **Formulários Mapeados:**
    *   Marcação de Bancas/Defesas (Demanda espontânea).
    *   Coleta de Artigos e Produção.
    *   Disciplinas Lecionadas.
    *   Registro Acadêmico de ingressantes.
    *   Distribuição de Bolsas.
*   **Automação de Site/Redes:** Publicação automática de bancas no site oficial (WordPress/HTML) e Instagram assim que o formulário for preenchido.

### 4. Dashboards e Indicadores CAPES
*   **Visão Geral:** Dashboard centralizado com os indicadores macro da CAPES (Articulação, Planejamento, Infraestrutura).
*   **Alertas:** Notificações de prazos de defesa e vencimento de bolsas.
*   **Multi-tenant/Acesso:** Login e senha para Coordenadores, Secretários e Professores (com visões limitadas).

---

## 🛠️ Definição Técnica (MVP)

*   **Database:** Supabase (PostgreSQL) - Camada gratuita suporta até 500MB de dados/1GB arquivos (suficiente para o volume de texto/planilhas mapeado).
*   **Frontend:** Dashboard em React/Next.js.
*   **Versionamento:** Repositório privado no GitHub.
*   **IA:** Utilização de Gemini/Claude para processamento de transcrições e automação de extração de dados brutos.
*   **Hosting:** Deploy inicial em servidor de parceiro ou infraestrutura própria da UFOP após registro.

---

## 📅 Plano de Ação e Próximos Passos

1.  **Semana 1 (MVP - 3 a 7 dias):**
    *   **Setup:** Estruturar o banco de dados no Supabase com tabelas de Alunos, Professores e Publicações.
    *   **Frontend:** Dashboard inicial com upload de CSV do SRA e visualização de lista de alunos.
    *   **Auth:** Interface de login e gestão de acessos.
2.  **Semana 2 (Automações):**
    *   Configurar script de scrapping/API para Currículo Lattes.
    *   Mapear automação do site (WordPress) com Felipe (TI).
3.  **Formalização:**
    *   Registro do software na UFOP.
    *   Relatório de horas para corte de carga horária (Clarissa/Marisa).
    *   Potencial projeto de Iniciação Científica (IC) ou Mestrado.

---

## ⚡ Lista de Pontos Críticos e Dores (Bloqueios)
- **Cultura Técnica:** Resistência à migração de infraestruturas complexas/caras (GCP/AWS) para soluções modernas (Supabase).
- **Dados Descentralizados:** Info espalhada em 3 fontes (Lattes, SRA, Google Forms).
- **Tempo Manual:** Excesso de burocracia manual que consome meses de trabalho da coordenação.

— Orion, orquestrando o sistema 🎯
