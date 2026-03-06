# Alpha Business Academy - Design System

## 1. Visão Geral
Este Design System padroniza a interface da Alpha Business Academy garantindo consistência, escalabilidade e acessibilidade. Ele utiliza **tokens semânticos**, onde cada valor representa uma intenção (ex: `text-primary`) e nunca um valor arbitrário.

## 2. Princípios de Design
- **Semântica Primeira:** Tokens representam o *propósito* (ex: `action-primary`), não a aparência (ex: `#D4A847`).
- **Mobile-First:** A interface é construída considerando o menor viewport primeiro.
- **Acessível por Padrão:** Contraste mínimo WCAG AA e áreas de clique de pelo menos `space-8` (32px).
- **Sem Magic Numbers:** Proibido o uso de `16px`, `#000` em arquivos CSS/React. Tudo deve vir do `design-tokens.json`.

## 3. Arquitetura de Tokens
O sistema é dividido em três camadas:
1. **Core Tokens (JSON):** Valores literais (`#D4A847`, `16px`).
2. **Semantic Tokens (CSS):** Variáveis CSS que consomem Core Tokens (`--action-primary: var(--amber)`).
3. **Component Tokens (Tailwind):** Classes utilitárias (`bg-action-primary`).

*(Veja as próximas seções mapeadas em `tokens/design-tokens.json` e `tokens/tokens.css`)*

## 4. Tokens de Cor
- **Texto:** `text-primary`, `text-secondary`, `text-muted`, `text-on-dark`, `text-on-brand`
- **Superfícies:** `surface-page`, `surface-section`, `surface-card`, `surface-subtle`, `surface-elevated`
- **Ações:** `action-primary`, `action-primary-hover`, `action-primary-active`, `action-secondary`, `action-strong`, `action-strong-hover`
- **Bordas:** `border-default`, `border-subtle`, `border-focus`
- **Status:** `status-success`, `status-warning`, `status-error`
- **Overlay:** `overlay-backdrop`, `overlay-modal`, `overlay-popover`

## 5. Tokens de Tipografia
- **Escala:** `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, `text-5xl`
- **Pesos:** `font-normal` (400), `font-medium` (500), `font-semibold` (600), `font-bold` (700)
- **Line Height:** `leading-tight` (1.2), `leading-normal` (1.5), `leading-relaxed` (1.75)
- **Letter Spacing:** `tracking-tight` (-0.025em), `tracking-normal` (0), `tracking-wide` (0.025em)

## 6. Tokens de Espaçamento
Base 4px (0.25rem):
- `space-1` (4px), `space-2` (8px), `space-3` (12px), `space-4` (16px)
- `space-6` (24px), `space-8` (32px), `space-12` (48px)
- `space-16` (64px), `space-20` (80px)

### Espaçamento Semântico
- `stack-xs` → `space-1`
- `stack-sm` → `space-2`
- `stack-md` → `space-3`
- `stack-lg` → `space-4`
- `component-gap` → `space-4`
- `section-gap` → `space-8`
- `section-padding` → `space-12`
- `hero-padding` → `space-20`

## 7. Tokens de Layout
- **Containers:** `container-sm`, `container-md`, `container-lg`, `container-xl`
- **Grid:** `grid-columns` (12), `grid-gap` (`space-6`)

## 8. Tokens de Borda (Radius)
- `radius-sm` (0.125rem), `radius-md` (0.375rem), `radius-lg` (0.5rem)
- `radius-xl` (0.75rem), `radius-2xl` (1rem), `radius-full` (9999px)

## 9. Tokens de Sombra
- `shadow-sm`, `shadow-md`, `shadow-lg`
- `shadow-card`, `shadow-card-hover`
- `shadow-button-primary`

## 10. Tokens de Motion
- `motion-fast` (150ms), `motion-normal` (300ms), `motion-slow` (500ms)

## 11. Componentes Base
Os componentes devem ser importados da pasta `/components/ui`. A biblioteca completa inclui:
- `Button`, `Input`, `Textarea`, `Select`
- `Card`, `Modal`, `Popover`, `Tooltip`
- `Alert`, `Badge`, `Toast`
- `Checkbox`, `Radio`, `Switch`
- `Avatar`, `Dropdown`, `Tabs`

## 12. Estados de Interação Obrigatórios
Todo componente interativo possui:
- `Default`
- `Hover`
- `Active`
- `Focus` (usando `border-focus` / anel visível)
- `Disabled` (usando `text-muted`, `surface-subtle`, `cursor-not-allowed`)

## 13. Padrões de Layout
- **Heading stack (H1 + H2):** `gap: space-4`
- **Paragraph stack:** `gap: space-4`
- **Section stack:** `gap: space-8`
- **Card grid:** `grid gap: space-6`

## 14. Exemplos de Interface e Acessibilidade
Veja os utilitários de contraste e focus ring configurados no Tailwind. Todo o sistema é verificado para aderência ao padrão WCAG AA.
