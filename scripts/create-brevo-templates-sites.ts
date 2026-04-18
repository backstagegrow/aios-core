/**
 * create-brevo-templates-sites.ts
 * Cria os 5 modelos da sequência do Erick Sena (Método Autoridade Digital) no Brevo.
 * Uso: npx tsx scripts/create-brevo-templates-sites.ts
 */

import 'dotenv/config';

const API_KEY = process.env.BREVO_API_KEY;
if (!API_KEY) {
    console.error('❌ BREVO_API_KEY não encontrada no .env — abortando.');
    process.exit(1);
}

const SENDER_NAME  = process.env.SITES_SENDER_NAME;
const SENDER_EMAIL = process.env.SITES_SENDER_EMAIL;
if (!SENDER_NAME || !SENDER_EMAIL) {
    console.error('❌ SITES_SENDER_NAME e SITES_SENDER_EMAIL são obrigatórios no .env — abortando.');
    process.exit(1);
}

const BASE = 'https://api.brevo.com/v3';

const headers = {
    'api-key': API_KEY as string,
    'Content-Type': 'application/json',
};

// ─── Templates — usa {{ contact.FIRSTNAME }} do Brevo ─────────────────────────

const TEMPLATES = [
    {
        name: 'Sites_S1 — Autoridade Digital (Step 1)',
        subject: '{{ contact.FIRSTNAME }}: sua autoridade online está à altura do que você entrega?',
        htmlContent: `<p>Olá,</p>
<p>Pesquisei a <b>{{ contact.FIRSTNAME }}</b> antes de escrever.</p>
<p>Profissionais do seu nível constroem autoridade ao longo de anos. O problema é quando a presença online não reflete essa autoridade — e o potencial cliente que pesquisa antes de contratar encontra algo que não está à altura do serviço que você entrega.</p>
<p>Para quem cobra pelo valor do trabalho, presença digital fraca tem custo direto: o cliente pesquisa, não se convence, e escolhe o concorrente. Sem que você saiba.</p>
<p>Aplico o <b>Método Autoridade Digital</b> para profissionais liberais — site entregue em 7 dias, posicionado no Google e construído para converter visita em contato.</p>
<p>Um exemplo: <a href="https://revela-odontologia.pages.dev" target="_blank">Revela Odontologia</a> — entregue em 5 dias, já aparece no Google para buscas locais, WhatsApp integrado direto na página.</p>
<p>Se quiser ver como ficaria para a <b>{{ contact.FIRSTNAME }}</b>, responda esse email.</p>
<br/><p>Erick<br/><a href="https://erick-sena-portfolio.pages.dev" target="_blank">erick-sena-portfolio.pages.dev</a></p>`,
    },
    {
        name: 'Sites_S2 — Autoridade Digital (Step 2)',
        subject: 'Re: Mais 2 projetos entregues — veja o padrão',
        htmlContent: `<p>Olá novamente,</p>
<p>No email anterior mostrei a Revela Odontologia. Quero mostrar mais dois projetos entregues com o <b>Método Autoridade Digital</b>:</p>
<p>→ <a href="https://clinica-vertice.pages.dev" target="_blank">Clínica Vértice</a> — clínica médica, entregue em 6 dias<br/>
→ <a href="https://gthouse.pages.dev/landing_page/" target="_blank">GT House</a> — espaço de eventos, entregue em 7 dias</p>
<p>Os três têm em comum: aparecem no Google, têm WhatsApp integrado e transmitem o nível de profissional que o cliente busca antes de contratar.</p>
<p>O que está incluso em todo projeto:</p>
<ul>
  <li>Site que comunica autoridade e aparece no Google</li>
  <li>WhatsApp integrado para contato direto</li>
  <li>Ficha do Google Meu Negócio configurada e vinculada</li>
  <li>Entrega em até 7 dias úteis</li>
</ul>
<p>Para um profissional como você, um único cliente novo já cobre o investimento. Se quiser ver como ficaria para a <b>{{ contact.FIRSTNAME }}</b>, responda com um "quero ver".</p>
<br/><p>Erick<br/><a href="https://erick-sena-portfolio.pages.dev" target="_blank">erick-sena-portfolio.pages.dev</a></p>`,
    },
    {
        name: 'Sites_S3 — Autoridade Digital (Step 3 — CTA WhatsApp)',
        subject: 'Última mensagem — {{ contact.FIRSTNAME }}',
        htmlContent: `<p>Olá,</p>
<p>Última mensagem.</p>
<p>Profissional do seu nível não pode ter a presença digital comprometendo a autoridade que levou anos para construir. Cada semana é uma semana onde o potencial cliente pesquisa, não se convence, e vai para o concorrente.</p>
<p>O <b>Método Autoridade Digital</b> resolve isso em 7 dias. Investimento único, sem contrato longo.</p>
<p>A conversa leva 15 minutos — você sai sabendo exatamente o que vai receber e o que vai custar:</p>
<table width="100%" cellspacing="0" cellpadding="0"><tr><td><table cellspacing="0" cellpadding="0"><tr><td style="border-radius:4px;background-color:#25D366;">
  <a href="https://wa.me/5531991072407?text=Ol%C3%A1%20Erick%2C%20vi%20seu%20email%20sobre%20o%20site" target="_blank" style="padding:12px 24px;border-radius:4px;color:#ffffff;background-color:#25D366;font-family:sans-serif;font-size:16px;font-weight:bold;text-decoration:none;display:inline-block;">
    Garantir meu site em 7 dias →
  </a>
</td></tr></table></td></tr></table>
<br/><p>Daqui a 30 dias, quando um potencial cliente pesquisar seu nome e clicar no site do concorrente, esse email ainda vai estar aqui.</p>
<p>Erick<br/><a href="https://erick-sena-portfolio.pages.dev" target="_blank">erick-sena-portfolio.pages.dev</a></p>`,
    },
    {
        name: 'Sites_S4 — Autoridade Digital (Nurture 30d)',
        subject: '{{ contact.FIRSTNAME }} — novo projeto entregue essa semana',
        htmlContent: `<p>Olá,</p>
<p>Faz um mês desde que escrevi para a <b>{{ contact.FIRSTNAME }}</b>.</p>
<p>Essa semana entrei mais um projeto com o <b>Método Autoridade Digital</b> — e quis te atualizar porque o resultado reforça exatamente o que falei antes.</p>
<p>Profissional que não tinha presença online estruturada. Em 7 dias: site no ar, aparecendo no Google, WhatsApp integrado. Primeira semana: novos contatos chegando pelo site sem nenhum anúncio.</p>
<p>Se o timing antes não era certo, talvez agora seja diferente. Para um profissional como você, um único cliente novo já cobre o investimento.</p>
<p>Se quiser retomar a conversa, é só responder esse email.</p>
<br/><p>Erick<br/><a href="https://erick-sena-portfolio.pages.dev" target="_blank">erick-sena-portfolio.pages.dev</a></p>`,
    },
    {
        name: 'Sites_S5 — Autoridade Digital (Encerramento 60d)',
        subject: 'Última vez — {{ contact.FIRSTNAME }}',
        htmlContent: `<p>Olá,</p>
<p>Essa é minha última mensagem.</p>
<p>Escrevi 4 vezes para a <b>{{ contact.FIRSTNAME }}</b>. Vou respeitar sua caixa de entrada a partir de agora.</p>
<p>Se em algum momento a presença digital virar prioridade — ou se um concorrente aparecer na frente de você no Google e isso custar um cliente — você sabe onde me encontrar:</p>
<p><a href="https://erick-sena-portfolio.pages.dev" target="_blank">erick-sena-portfolio.pages.dev</a><br/>
<a href="https://wa.me/5531991072407" target="_blank">WhatsApp direto</a></p>
<p>O <b>Método Autoridade Digital</b> continua disponível. 7 dias para ter um site que transmite o nível do seu trabalho.</p>
<br/><p>Erick</p>`,
    },
];

// ─── Create templates ─────────────────────────────────────────────────────────

async function createTemplate(tpl: typeof TEMPLATES[0], index: number) {
    const res = await fetch(`${BASE}/smtp/templates`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            templateName: tpl.name,
            subject: tpl.subject,
            htmlContent: tpl.htmlContent,
            sender: { name: SENDER_NAME, email: SENDER_EMAIL },
            isActive: true,
        }),
    });

    const data = await res.json() as any;

    if (!res.ok) {
        console.error(`[S${index + 1}] Erro:`, data);
    } else {
        console.log(`[S${index + 1}] Criado — ID ${data.id} → "${tpl.name}"`);
    }
}

console.log(`\nCriando 5 modelos Brevo para: ${SENDER_NAME} <${SENDER_EMAIL}>\n`);

for (let i = 0; i < TEMPLATES.length; i++) {
    await createTemplate(TEMPLATES[i], i);
}

console.log('\nConcluído. Acesse Brevo → Marketing → Modelos para verificar.');
