# Security & Privacy Baseline (Sales Pages)

Este documento define regras obrigatórias para páginas de vendas com captura de leads.

## O que fazer (DO)
- Coletar apenas dados mínimos necessários para o objetivo comercial.
- Exibir aviso claro de consentimento no formulário.
- Validar todos os campos no backend, nunca só no frontend.
- Normalizar e sanitizar payload antes de enviar ao CRM/webhook.
- Usar HTTPS em produção para página e endpoint.
- Definir timeout, tratamento de erro e fallback no envio para integrações externas.
- Armazenar segredos apenas em variáveis de ambiente.
- Registrar logs sem dados sensíveis desnecessários.
- Incluir links de Política de Privacidade e Termos quando houver captura de dados.
- Implementar proteção básica anti-spam (honeypot, rate limit ou desafio simples).

## O que não fazer (DON'T)
- Não coletar dados sensíveis sem necessidade legal e base clara.
- Não expor tokens, chaves, webhooks ou credenciais no frontend.
- Não confiar em validação somente no navegador.
- Não persistir dados pessoais em logs completos sem necessidade.
- Não enviar dados para terceiros sem mapeamento de finalidade.
- Não deixar endpoint de leads sem limite de tamanho de payload.
- Não aprovar página sem revisão mínima de privacidade/LGPD.

## Requisitos técnicos mínimos
- Endpoint de lead com validação e mensagens de erro seguras.
- Payload size limit e resposta consistente (2xx/4xx/5xx).
- Campos UTM aceitos e normalizados.
- Campo de consentimento explícito no formulário.
- Status page/health endpoint sem exposição de segredo.

## Quality Gate de segurança (bloqueante)
A página NÃO pode ser aprovada se houver:
- Segredo hardcoded no código.
- Coleta de dados sem aviso de consentimento.
- Endpoint sem validação básica de entrada.
- Exposição de stack trace ou erro sensível para usuário final.
