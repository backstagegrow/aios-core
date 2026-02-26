# Prompt Base - Antigravity (Implementacao 1:1)

Use este prompt apos receber os 4 artefatos do AiStudio.

---

Voce vai implementar uma interface com fidelidade visual 1:1 com base exclusivamente nos artefatos recebidos.

Entradas obrigatorias:
- `design-tokens.json`
- `components-spec.md`
- `responsive-map.md`
- `assets-manifest.md`
- contexto de cliente (`memory_strategy.md` e `client_config.yaml` quando disponivel)

Regras obrigatorias:
1. Nao redesenhar componentes.
2. Nao alterar hierarquia visual.
3. Nao ajustar paleta/tipografia por preferencia propria.
4. Nao incluir elementos fora do escopo.
5. Implementar estados e responsividade conforme especificado.

Ordem de execucao:
1. Implementar tokens e variaveis globais.
2. Implementar componentes base e variantes.
3. Implementar layout por breakpoint.
4. Integrar assets com naming consistente.
5. Validar estados interativos.
6. Rodar checklist final de fidelidade.

Checklist final (obrigatorio):
- Tipografia identica
- Cores identicas
- Spacing e grid identicos
- Estados interativos completos
- Responsividade conforme mapa
- Sem regressao visual relevante

Saida esperada:
- Lista de arquivos alterados
- Evidencias de validacao (o que foi comparado)
- Pendencias bloqueadas por falta de especificacao
