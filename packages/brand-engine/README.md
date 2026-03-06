# Brand Engine — Guia do Agente

Este pacote é responsável por gerar os Design Systems de múltiplos clientes de forma automática.

## Como Adicionar um Cliente Novo

1.  Crie uma pasta em `packages/brand-engine/clients/<slug-do-cliente>`.
2.  Crie um arquivo `client.config.json` seguindo este padrão:

```json
{
  "client": { "name": "Nome do Cliente", "slug": "slug" },
  "brand": {
    "colors": {
      "brandPrimary": "#HEX",
      "brandSecondary": "#HEX",
      "brandAccent": "#HEX"
    },
    "typography": {
      "fontHeading": "Nome da Fonte",
      "fontBody": "Nome da Fonte"
    }
  }
}
```

3.  Roda o comando de geração:
    ```bash
    npm run ds:sync
    ```

## Arquitetura de 3 Camadas

1.  **Input**: `client.config.json` (Fonte de verdade).
2.  **Generator**: `generator/generate.mjs` (Transforma JSON em CSS).
3.  **Output**: `dist/<slug>/` (Tokens semânticos e Bridge para Tailwind).

---

## Console Local

O console de agentes (Next.js) está em `apps/brand-console`.
Acesse `http://localhost:3000/clients` para ver a lista de marcas disponíveis.
