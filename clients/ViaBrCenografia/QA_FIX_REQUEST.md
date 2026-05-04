# QA Fix Request: Via BR Cenografia

**Origem:** @qa (Quinn)
**Destino:** @dev (Dex)
**Arquivo Principal:** `Via BR Cenografia.html`
**Prioridade Geral:** HIGH ⚠️

---

## 🛑 Problemas Identificados (Débitos Técnicos)

### 1. Performance & Arquitetura (CRITICAL 🚨)
**Problema:** O site está utilizando `@babel/standalone` (`<script type="text/babel">`) para transpilamento do React e Tailwind via CDN em tempo real no navegador do usuário.
**Impacto:** Penalidade brutal em tempo de carregamento (LCP), performance e SEO (Core Web Vitals). Impróprio para produção.
**Ação Requerida:** 
- Converter a estrutura do `Via BR Cenografia.html` para um setup de build real (ex: inicializar um projeto rápido com Vite + React puro).
- O HTML final da pasta `dist` deve conter apenas HTML, CSS compilado e JS minificado.

### 2. Acessibilidade de Formulários (a11y) (MEDIUM 🟡)
**Problema:** As tags `<label>` não possuem conexão semântica com as tags `<input>`.
**Impacto:** Leitores de tela não conseguem associar qual campo pertence a qual rótulo.
**Ação Requerida:** 
- Adicionar propriedades `htmlFor` aos `<label>` e propriedades `id` correspondentes aos seus `<input>` e `<textarea>`.
- *Onde procurar:* No componente `<Hero />` e no componente `<ContactForm />`.

### 3. Links Sociais "Mortos" (MEDIUM 🟡)
**Problema:** Os links das redes sociais no componente `<Footer />` estão apontando para as âncoras locais `#instagram`, `#linkedin` e `#facebook`.
**Impacto:** Redirecionamento quebrado, frustração de UX e erros em rastreamento de SEO.
**Ação Requerida:** 
- Substituir as âncoras por propriedades vazias (ex: `href="#"`) ou links provisórios/reais da marca e adicionar atributos `target="_blank"` e `rel="noopener noreferrer"`.

---

## ✅ Critérios de Aceite para o Retorno (Re-Review)
- [ ] O código-fonte não utiliza mais `@babel/standalone` e foi migrado para um *build* otimizado (se aplicável) ou convertido para Vanilla JS. (Caso o cliente escolha manter React CDN provisoriamente, isso deve ser avisado e registrado como débito técnico aceito).
- [ ] Todos os `inputs` e `textareas` têm um `id` único.
- [ ] Todos os `labels` usam `htmlFor` apontando para o respectivo `id`.
- [ ] Links sociais do Footer estão formatados corretamente.
- [ ] A dupla funcionalidade do formulário de contato (Supabase + Web3Forms) foi mantida intacta após os ajustes.

---
**Nota QA:** Por favor, ao finalizar, me chame via `*review` para que eu valide os reparos.
— Quinn, guardião da qualidade 🛡️
