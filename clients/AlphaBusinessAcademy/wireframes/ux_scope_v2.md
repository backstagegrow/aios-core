# Escopo de UX - Nova Landing Page Alpha Business Academy

**Objetivo:** Maximizar a conversão através de uma arquitetura de informação focada em gatilhos visuais e prova social.

## 1. Arquitetura da Página (Seções)

### A. Hero Section (A Transformação)
*   **Elemento Central:** Imagem de alta fidelidade (Chef exausto vs Chef de sucesso).
*   **Layout:** Imagem centralizada com overlay de texto (Headline) ou Headline logo abaixo da imagem em dispositivos mobile.
*   **Responsividade:** No desktop, a imagem ocupa 60% da largura central. No mobile, a imagem é o primeiro elemento visual, seguida pela headline e o botão CTA "sticky" (ou próximo ao topo).

### B. Seção de Dor & Agitação
*   **Design:** Background Dark Mode (#0A0A0A) com tipografia Inter em destaque.
*   **Elementos:** Bullet points com ícones de alerta para os problemas do "dono operacional".

### C. Seção de Autoridade & Mentoria
*   **Design:** Fotos em PB com detalhes em Gold (#C9A24A).
*   **Foco:** Mostrar a proximidade física e o ambiente de elite da imersão.

### D. Galeria de Prova Social (Multimodal)
*   **Vídeos:** Grid de 3 colunas para depoimentos (Mobile: Carrossel horizontal).
*   **Fotos de Edições Anteriores:** Masonry layout para fotos reais de networking e palestras.
*   **Legendas:** Pequenos textos abaixo das fotos reforçando o "Ambiente de Elite".

### E. Seção de Oferta & Checkout
*   **Design:** Card flutuante com sombra suave (Glassmorphism leve).
*   **CTA:** Cor Gold vibrante para destaque máximo.

## 2. Padrões de Build & Organização (Mapping)

*   **Repo Separado:** Seguir o padrão de pasta `clients/AlphaBusinessAcademy/web/` (ou conforme as outras páginas mapeadas).
*   **Assets:**
    *   `/assets/logos/` -> Logos oficiais (Alpha, Ponto Alpha, etc).
    *   `/assets/img/hero/` -> Foto do Chef e fotos de fundo.
    *   `/assets/img/edicoes/` -> Galeria de fotos de eventos anteriores.
    *   `/assets/videos/` -> Depoimentos (preferencialmente embed de alta performance).

## 3. Guia de Estilo (Tokens)
*   **Fundo:** #0A0A0A
*   **Destaque:** #C9A24A (Gold)
*   **Fonte:** Inter (Font-weights: 400, 700, 900)
*   **Botões:** Border-radius baixo (4px) para ar de seriedade/premium.

---
**UX Designer:** Orion (aios-master)
**Data:** 2026-05-01
