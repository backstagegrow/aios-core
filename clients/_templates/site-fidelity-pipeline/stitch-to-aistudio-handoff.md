# Stitch -> AiStudio Handoff (Template)

## 1) Contexto
- Cliente: <NOME_CLIENTE>
- Projeto/Campanha: <NOME_PROJETO>
- Data: <YYYY-MM-DD>
- Responsavel: <NOME>

## 2) Fontes de verdade
- Arquivo de estrategia: `clients/<CLIENTE>/memory_strategy.md`
- Configuracao cliente: `clients/<CLIENTE>/client_config.yaml`
- Link/projeto Stitch: <URL>

## 3) Paginas/Telas
- Tela 01: <nome + objetivo>
- Tela 02: <nome + objetivo>
- Tela 03: <nome + objetivo>

## 4) Tokens (obrigatorio)
- Cores: <hex + uso>
- Tipografia: <familia, peso, tamanho, line-height>
- Spacing: <escala ex: 4/8/12/16/24/32>
- Radius: <escala>
- Shadows: <valores>
- Border: <larguras/cores>

## 5) Grid e Responsividade
- Breakpoints: <ex: 360, 768, 1024, 1440>
- Grid desktop: <colunas/gutter/margens>
- Grid mobile: <colunas/gutter/margens>
- Regras de reflow: <como componentes quebram>

## 6) Componentes e Estados
- Componentes: <lista>
- Estados por componente: hover / focus / active / disabled
- Feedbacks: loading / sucesso / erro

## 7) Assets
- Lista de SVG/PNG/video e caminho final esperado
- Regras de compressao e fallback

## 8) Animacao e interacao
- Entrada de secao
- Hover/transicoes
- Duracao/easing
- Regras de performance

## 9) Criterios de fidelidade
- Nao reinterpretar visualmente
- Reproduzir 1:1 tokens e medidas
- Variacao maxima aceitavel: <= 2px em layout/spacing

## 10) Entregaveis esperados do AiStudio
- `design-tokens.json`
- `components-spec.md`
- `responsive-map.md`
- `assets-manifest.md`
