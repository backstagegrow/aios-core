# 📬 Sites Sales — Populate Log

**Data:** 2026-04-15  
**Script:** `scripts/sites-sales-automation.ts populate`  
**Lista Brevo:** `Erick_Sites_001` (ID 13 | Limite: 300)

---

## 📊 Resumo das Execuções

| Execução | Leads no Supabase | Únicos | Adicionados | Falhas | Total na Lista |
|---|---|---|---|---|---|
| #1 | 13 | 11 | 4 | 7 | 288/300 |
| #2 | 12 | 11 | 4 | 7 | 291/300 |
| #3 | 9 | 8 | 1 | 7 | 292/300 |

**Status atual:** 292/300 — faltam **8 contatos** para completar a lista.

---

## ✅ Leads Adicionados com Sucesso

| Email | Execução |
|---|---|
| suporte@doctoralia.com.br | #1, #2, #3 (já existe — contado 1x) |
| exemplo@meusite.com | #1 |
| 0fd2930120484402ac9adfb9e05cacd5@o37417.ingest.sentry.io | #1 |
| contato@lefsaudetotal.com.br | #1 |
| administracao@clinicasantamed.com.br | #2 |
| comercial2@clinicadocentro.com.br | #2 |
| central@doutornacasa.com.br | #2 |

> ⚠️ `exemplo@meusite.com` e o email Sentry parecem **leads de teste** — validar e remover se necessário.

---

## ❌ Leads com Erro — Emails Inválidos (URL Encoded)

Estes emails têm **espaço no início** (`%20`) causando rejeição pelo Brevo:

| Email Inválido | Correção Sugerida |
|---|---|
| `%20biasfortes@biasfortes.com.br` | `biasfortes@biasfortes.com.br` |
| `%20luiz@ezcontabil.com.br` | `luiz@ezcontabil.com.br` |
| `%20ers@erscontabilidade.com.br` | `ers@erscontabilidade.com.br` |
| `%20contato@gustavosouzaadvogados.adv.br` | `contato@gustavosouzaadvogados.adv.br` |
| `%20comercial@coutinho.com.br` | `comercial@coutinho.com.br` |
| `%20falavinha@falavinhacontabil.com.br` | `falavinha@falavinhacontabil.com.br` |
| `%20operacional@lumiercontabilidade.com` | `operacional@lumiercontabilidade.com` |

**Root cause:** Dados salvos no Supabase com espaço no início do campo `email`.  
**Fix necessário:** Sanitização no script (`.trim()`) ou limpeza direto no banco.

---

## 🔧 Próximos Passos

- [ ] **Fix urgente:** Aplicar `.trim()` nos emails antes de enviar para o Brevo
- [ ] Limpar os 7 leads inválidos no Supabase (`UPDATE leads SET email = TRIM(email)`)
- [ ] Verificar se `exemplo@meusite.com` e o email Sentry são leads reais
- [ ] Disparar campanha manualmente no Brevo após lista completar
- [ ] Monitorar abertura e clique após disparo

---

## 📝 Notas

- Disparo deve ser feito **manualmente no Brevo** após o populate
- Script de deduplicação está funcionando corretamente
- Lista atinge limite em 300 — novo lote exigirá nova lista (`Erick_Sites_002`)

---
*Gerado automaticamente — AIOS Core · 2026-04-15*
