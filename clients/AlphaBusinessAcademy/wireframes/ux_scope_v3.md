# Escopo UX: Landing Page de Vendas (ABA - O Caminho do Dono)

**Objetivo:** Criar uma experiência de alta conversão com design "Elite/Adulto/Provocativo" (Dark Mode + Gold).

---

## 1. ARQUITETURA DE SEÇÕES (High-Conversion Flow)

| Seção | Objetivo UX | Conteúdo Visual |
| :--- | :--- | :--- |
| **01. Hero (Antes/Depois)** | Choque de realidade + Autoridade | **Visual Central:** Foto de Transformação (`hero_transformation.jpg`). **Texto:** Headline agressiva abaixo da imagem. |
| **02. O Diagnóstico** | Identificação com a dor | Grid de cards com as 4 dores principais (Escravo da Operação, Lucro Baixo, etc). |
| **03. O Mecanismo (Tripé)** | Apresentação da solução única | Infográfico minimalista em Gold: Receita, Escala, Pessoas. |
| **04. Autoridade (Mentores)** | Transferência de confiança | Fotos de Lucas Silva, José Ricardo e Robert CFO com bios curtas. |
| **05. Prova Social** | Validação massiva | Carrossel de depoimentos em vídeo (3 vídeos MP4/MOV) + Logotipos das redes (Monster Dog, Ponto Alpha). |
| **06. Oferta & Escopo** | Fechamento lógico | Card Premium detalhando o que será construído na imersão (Plano 90 dias, Diagnóstico). |
| **07. CTA Final & FAQ** | Remoção de fricção | Botão de aplicação para processo seletivo + Acordeão de dúvidas frequentes. |

---

## 2. DESIGN SYSTEM (Aura x Gemini v3.0)

*   **Paleta de Cores:**
    *   Fundo: `#0A0A0A` (Dark Mode Profundo)
    *   Acento Primário: `#C9A24A` (Gold Premium)
    *   Textos: `#EBEBEB` (Off-white) / `#888888` (Secondary)
*   **Tipografia:**
    *   Headlines: **Inter** (Extra Bold / Black) - Tracking apertado (`tracking-tighter`).
    *   Corpo: **Inter** (Light / Regular) - Leitura limpa.
*   **Componentes-Chave:**
    *   **Glassmorphism:** Cards com `backdrop-blur-xl` e bordas finas em Gold (opacity 10%).
    *   **Micro-interações:** Efeito Flashlight (Gemini) nos cards de dor e oferta.
    *   **Animações:** Text Reveal no Hero e Animate-on-scroll nas seções de método.

---

## 3. ASSETS PARA O BUILD

*   **Imagens:**
    *   `hero_transformation.jpg` (Visual Central Hero)
    *   Logos ABA e Ponto Alpha (Header)
*   **Vídeos (Depoimentos):**
    *   `Criativo ABA - Aplicou e aumentou 50% do faturamento.mp4`
    *   `Criativo ABA - Depoimento Recorde de Vendas.mp4`
    *   `IMG_5336.MOV` (Depoimento 3)
*   **Ícones:** Iconify (Solar Duotone Set).

---

## 4. ESTRATÉGIA DE CONVERSÃO (MOBILE-FIRST)

*   **Sticky Header:** Botão [APLICAR] sempre visível em mobile.
*   **Hierarquia Visual:** Imagem de transformação no topo é o primeiro elemento a carregar para gerar curiosidade imediata.
*   **Escassez:** Badge de "Vagas Limitadas - Processo Seletivo" próximo a todos os CTAs.
