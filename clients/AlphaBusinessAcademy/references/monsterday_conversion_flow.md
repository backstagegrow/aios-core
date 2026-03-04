# 🔄 Fluxo de Conversão Completo — Monster Day LP

> **Capturado em:** 2026-03-03
> **Fonte:** [Monster Day LP](https://lps.monsterday.com.br/)
> **Objetivo:** Documentar o fluxo LP → Popup → Checkout para replicar na Alpha Business Academy

---

## 📊 Jornada do Usuário (3 Etapas)

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  LANDING    │     │   POPUP MODAL   │     │    CHECKOUT     │
│   PAGE      │ ──► │  (Formulário)   │ ──► │   (Ingressos)   │
│             │     │                 │     │                 │
│ Botão CTA   │     │ Nome            │     │ Página de       │
│ "QUERO      │     │ Email           │     │ pagamento       │
│ PARTICIPAR" │     │ Telefone        │     │ do evento       │
│             │     │                 │     │                 │
│ (repete a   │     │ "GARANTIR MEU   │     │ (checkout       │
│ cada 2-3    │     │  INGRESSO"      │     │  externo)       │
│ seções)     │     │                 │     │                 │
└─────────────┘     └─────────────────┘     └─────────────────┘
```

---

## 🔹 ETAPA 1: Landing Page — Botões CTA

### Comportamento
- **TODOS** os botões "QUERO PARTICIPAR" na página abrem o **mesmo popup**
- O botão **NÃO** redireciona para outra página — ele abre um modal overlay
- Gatilho técnico: `#elementor-action:action=popup:open&settings=...`
- Botões distribuídos a cada 2-3 seções da página

### Design do Botão
| Propriedade | Valor |
|---|---|
| **Cor de fundo** | Verde-limão (#C0E000) |
| **Cor do texto** | Preto |
| **Texto** | "→ QUERO PARTICIPAR" |
| **Formato** | Retangular, cantos levemente arredondados |
| **Largura** | ~60% da coluna (não full-width) |
| **Posição** | Centralizado na seção |

---

## 🔹 ETAPA 2: Popup Modal — Formulário de Captura

### Design do Popup
| Propriedade | Valor |
|---|---|
| **Overlay** | Fundo semi-transparente escuro (blur no conteúdo atrás) |
| **Modal** | Fundo cinza escuro (#1D1D1D), cantos arredondados (~15px) |
| **Largura** | ~450px centralizado |
| **Fechar** | Botão "X" no canto superior direito |
| **Logo** | Logo completo do Monster Day no topo do modal |
| **Headline** | "PREENCHA O FORMULÁRIO ABAIXO E GARANTA SEU INGRESSO" |

### Campos do Formulário
| # | Campo | Tipo | Placeholder | Obrigatório |
|---|---|---|---|---|
| 1 | Nome | text | "Digite seu nome" | ✅ |
| 2 | Email | email | "Digite seu melhor email" | ✅ |
| 3 | Telefone | tel (intl) | "11 96123-4567" com bandeira 🇧🇷 +55 | ✅ |

### Botão de Submit
| Propriedade | Valor |
|---|---|
| **Texto** | "GARANTIR MEU INGRESSO" |
| **Cor** | Verde-limão (#C0E000) — mesmo padrão dos CTAs |
| **Largura** | 100% do modal |
| **Formato** | Retangular, cantos arredondados |

### Campos Ocultos (Tracking)
- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `utm_id`

> **Integração:** ActiveCampaign via `proc.php` — os dados são enviados para o CRM antes do redirecionamento.

---

## 🔹 ETAPA 3: Redirecionamento para Checkout

### Comportamento
- Ao clicar em "GARANTIR MEU INGRESSO", os dados vão para o ActiveCampaign
- O backend processa o formulário e **redireciona automaticamente** para a página de checkout
- URL de checkout identificada: `nov25.monsterday.com.br/ingressos-...`
- O usuário já é um **lead capturado** antes de chegar no checkout

### Lógica Estratégica
```
1. CAPTURA o lead PRIMEIRO (nome, email, telefone)
2. Salva no CRM (ActiveCampaign)
3. SÓ DEPOIS redireciona para o checkout
4. Se não comprar, já tem os dados para remarketing/follow-up
```

> **INSIGHT CRÍTICO:** O formulário NÃO é o formulário de compra. É um formulário de CAPTURA. A compra acontece na página de checkout separada. Isso permite:
> - Remarketing para quem preencheu mas não comprou
> - Sequência de emails/WhatsApp automática
> - Segmentação por UTMs no CRM

---

## 🎯 Adaptação para Alpha Business Academy

### Fluxo Proposto (3 Etapas)

```
┌─────────────────┐     ┌──────────────────────┐     ┌──────────────────┐
│  LANDING PAGE   │     │    POPUP MODAL       │     │   CHECKOUT /     │
│  Alpha Academy  │     │   (Lead Capture)     │     │   WHATSAPP       │
│                 │ ──► │                      │ ──► │                  │
│ "QUERO APLICAR  │     │ • Nome               │     │ Redirecionamento │
│  PARA A         │     │ • Email              │     │ para checkout    │
│  IMERSÃO"       │     │ • WhatsApp           │     │ OU grupo de     │
│                 │     │ • Empresa            │     │ WhatsApp do     │
│ (botões em      │     │ • Segmento           │     │ processo        │
│  várias seções) │     │ • Faturamento        │     │ seletivo        │
│                 │     │                      │     │                  │
│                 │     │ "FAZER MINHA         │     │                  │
│                 │     │  APLICAÇÃO AGORA"    │     │                  │
└─────────────────┘     └──────────────────────┘     └──────────────────┘
```

### Diferenças vs. Monster Day

| Aspecto | Monster Day | Alpha Academy |
|---|---|---|
| **Campos** | 3 (nome, email, tel) | 6+ (nome, email, tel, empresa, segmento, faturamento) |
| **Objetivo** | Lead → Checkout direto | Lead → Processo seletivo → Venda consultiva |
| **Pós-form** | Redireciona para checkout | Redireciona para WhatsApp ou página de confirmação |
| **CRM** | ActiveCampaign | A definir (Supabase + webhook?) |
| **Posicionamento** | "Garanta seu ingresso" (urgência) | "Faça sua aplicação" (exclusividade) |

### O que Implementar

1. **Transformar o form atual** (que está no final da página) em um **popup modal**
2. **Adicionar botões CTA** nas seções intermediárias que abrem o popup
3. **Manter o form grande** (6 campos) mas apresentar de forma mais limpa no modal
4. **Após submit:** redirecionar para página de confirmação ou grupo WhatsApp
5. **Tracking:** adicionar campos ocultos de UTMs para rastreamento de campanhas

### Implementação Técnica (HTML/CSS/JS)

```html
<!-- Botão CTA (repetir em várias seções) -->
<button class="btn btn--primary btn--glow" onclick="openApplicationModal()">
    QUERO APLICAR PARA A IMERSÃO
</button>

<!-- Modal Popup -->
<div id="application-modal" class="modal" aria-hidden="true">
    <div class="modal__backdrop" onclick="closeApplicationModal()"></div>
    <div class="modal__content">
        <button class="modal__close" onclick="closeApplicationModal()">×</button>
        <img src="logo.png" class="modal__logo" alt="Alpha Business Academy">
        <h3>PREENCHA E FAÇA SUA APLICAÇÃO</h3>
        <form id="popup-form">
            <!-- campos aqui -->
            <button type="submit" class="btn btn--primary btn--glow btn--full">
                FAZER MINHA APLICAÇÃO AGORA
            </button>
        </form>
    </div>
</div>
```

```javascript
// Fluxo popup + redirect
function openApplicationModal() {
    document.getElementById('application-modal').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeApplicationModal() {
    document.getElementById('application-modal').setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

document.getElementById('popup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    // 1. Envia dados para CRM/Supabase
    // 2. Captura UTMs da URL
    // 3. Redireciona para checkout ou WhatsApp
    window.location.href = 'https://checkout-url-aqui.com';
});
```

---

*Fluxo documentado pelo Growth Operator para uso na montagem da página oficial da Alpha Business Academy.*
