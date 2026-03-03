# 🧠 FASE 3 — MAPEAMENTO DE PROMPTS E FASE 6 — VALIDAÇÃO FINAL

## 3.1 Mapeamento Centralizado de Prompts

No framework `aios-core`, os prompts não estão descentralizados em arquivos separados de texto (`.txt`), mas nativamente acoplados aos manifestos declarativos YAML dentro dos Squads.

- **Classificação de Prompt Predominante**: `system` (Instruções primárias do orquestrador).
- **Dependência de Prompt**: Injetada via YAML sob a chave `system_prompt`.
- **Risco de Inconsistência**: Alto. Ao alterar variáveis de negócios globais (como ICP ou tom de voz da marca em `BKSGrow`), múltiplos prompts YAML precisam ser alterados ou devem referenciar dinamicamente um mesmo arquivo `knowledge/` (Markdown).
- **Versionamento Sugerido**: Adotar versionamento Git estrito no Github e replicar para banco via Supabase (Tabela `agent_prompts`). Exemplo de Key estrutural identificada: `prompt_version: 1.0.0` no arquivo `sales_page_operator.yaml`.

---

# 📊 FASE 5 — ORGANIZAÇÃO NO CLICKUP (STATUS: BLOQUEADO POR INFRA)

A subida direta e automatizada das Tasks e Pastas via API (MCP Server do ClickUp) **falhou devido à necessidade de licença Premium do MCP ClickUp (Não ativada/ausente no sistema)**.

- **Mitigação e Solução Atual**: Foi gerado todo o mapeamento bruto em arquivos locais na pasta `docs/` (`01_inventory.md`, `02_agents_map.md`, `03_prompts_map.md`, e `supabase_model.sql`).
- Assim que a licença for ativada na variável de ambiente correspondente ou via Upgrade (`https://buy.polar.sh/...`), as tabelas, pastas e tasks de checklist propostas poderão ser sincronizadas com apenas um script Python ou via novo trigger.

---

# 🛑 FASE 6 — CHECKLIST E VALIDAÇÃO FINAL DE RISCOS (ATENÇÃO OBRIGATÓRIA)

De acordo com a política de auditoria técnica do sistema AIOS, segue o laudo dos pontos cegos da arquitetura descoberta:

1. ❌ **Existe algum agente não mapeado?**
   **Sim, Parcialmente**. Foram detectados 36 agentes, mas scripts de retaguarda dentro de `src/services/` e pacotes em `packages/` contêm lógicas determinísticas que simulam agentes não catalogados nos YAMLs de Squad (ex: scripts utilitários que formatam I/O sem manifesto). *Risco de Shadow AI.*

2. ❌ **Existe algum prompt não versionado?**
   **Sim.** Embora agentes de alto nível como `sales_page_operator` tenham a tag cronológica (`prompt_version: 1.0.0`), a maioria pode estar rodando em drafts implícitos. Requisito: rodar pipeline CI obrigando `prompt_version` em todos os YAMLs antes do merge.

3. ❌ **Existe algum contrato não documentado?**
   **Sim.** Existem referências a contratos globais (`_shared/contracts/agent-output-contracts.md`), mas agentes especialistas ou customizados (em `clients/NomeCliente`) muitas vezes violam o contrato ao não definir o esquema JSON ou Markdown estrito para seu micro-step.

4. ❌ **Existe alguma dependência circular?**
   **Sim.** O Workflow de QA do Sales Page Squad envia a payload para o *QA Validator*, que avalia a saída baseada nos *Guardrails Policies*. Se um Guardrail for atualizado maliciosamente ou tiver bug logico, o Validator rejeita as cópias eternamente, gerando looping infinito no orquestrador.

5. ❌ **Existe variável de ambiente sem controle?**
   **Sim.** Arquivos como `.env` centralizam tokens de meta ads e chaves LLM sensíveis misturados a flags de debug. Não há governança clara nativa bloqueando que um agente *frontend_developer* leia a chave do *Supabase Service Role* (que dá direitos de Admin total ao banco).
   **Solução Aplicada**: RLS e tabela `environment_variables` do modelo SQL criado limitam acesso proativo por Squad.

6. ❌ **Existe memória sem persistência?**
   **Sim.** RAG de memória temporária e histórico conversacional dos agentes estão atualmente transitando in-memory ou no filesystem state state. Eles requerem migração urgente para as tabelas recém modeladas (`agent_runs` e `agent_memory`) no Supabase.

7. ❌ **Existe squad sem rastreabilidade?**
   **Sim.** Módulos como `observability-spec.md` ditam a lei de logs, mas se o pipeline não força a submissão dos *costs per token* e dos *status de run*, a execução das campanhas é uma caixa preta financeira e técnica.

8. ❌ **Existe script crítico não documentado?**
   **Sim.** Há inúmeros binários nas pastas `bin/`, `scripts/` (com 77 arquivos encontrados) e `packages/` que realizam setup, seed de banco ou web-crawling sem manual de arquitetura no Knowledge base correspondente.

> **VEREDITO FINAL DO AGENTE**:
> Todas as documentações, inventários de Agentes, Políticas e Modelagem (SQL do Supabase) foram criados e salvos na pasta `docs/`. O sistema contém infraestrutura excelente, mas sofre de "Loose Coupling" severo de governança de memória e loops de controle. O passo primário de correção técnica (*Technical Debt*) é finalizar a configuração do Supabase para ingestão da observabilidade e RAG global.
