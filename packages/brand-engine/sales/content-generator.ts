import 'dotenv/config';

export type Segment = 'experts' | 'b2b_events' | 'sites_selling' | 'unknown';
export type ABVariant = 'A' | 'B';

export interface LeadInfo {
    id?: number | string;
    business_name: string;
    niche?: string;
    segment?: Segment;
}

export interface SequenceEmail {
    subject: string;
    html: string;
    ab_variant: ABVariant;
}

export const STRATEGY_TRIGGERS = {
    REFERRAL_PAIN: "dependência de indicações",
    PREDICTABILITY: "previsibilidade de caixa",
    GOD_TIER: "framework de conversão B2B"
};

// ─── Segment detection ────────────────────────────────────────────────────────

const EXPERT_KEYWORDS = [
    'palestrante', 'treinador', 'consultor', 'consultoria', 'coach',
    'mentor', 'formação', 'curso', 'workshop', 'keynote', 'expert',
];

const B2B_EVENTS_KEYWORDS = [
    'produtora', 'cenografia', 'locação', 'espaço para eventos', 'casa de eventos',
    'audiovisual', 'buffet corporativo', 'evento corporativo', 'events', 'cerimônia',
];

const SITES_SELLING_STATUSES = ['no_website', 'broken_website'];

export function detectSegment(lead: LeadInfo & { status?: string; client_id?: string }): Segment {
    if (lead.client_id === 'SitesSales' || SITES_SELLING_STATUSES.includes(lead.status || '')) return 'sites_selling';
    const text = `${lead.niche || ''} ${lead.business_name || ''}`.toLowerCase();
    if (EXPERT_KEYWORDS.some(k => text.includes(k))) return 'experts';
    if (B2B_EVENTS_KEYWORDS.some(k => text.includes(k))) return 'b2b_events';
    return 'unknown';
}

// ─── A/B variant selection ────────────────────────────────────────────────────

export function selectVariant(leadId: number | string | undefined): ABVariant {
    const id = Number(leadId) || 0;
    return id % 2 === 0 ? 'A' : 'B';
}

// ─── Copy templates ───────────────────────────────────────────────────────────

interface StepTemplates {
    subjects: { A: string; B: string };
    html: (businessName: string) => string;
}

// Experts — Step 1
const EXPERTS_S1: StepTemplates = {
    subjects: {
        A: `{businessName} está crescendo por indicação ou por estratégia?`,
        B: `Uma pergunta incômoda sobre a {businessName}`,
    },
    html: (n) => `<p>Olá,</p>
<p>Vou direto ao ponto.</p>
<p>Acompanho o segmento de experts no Brasil e existe um padrão que se repete: profissionais com entrega excelente, reputação sólida e um modelo de aquisição de clientes que depende 100% de quem lembra de indicar.</p>
<p>Indicação é consequência de bom trabalho. Mas não é estratégia de crescimento. Quando ela é o único motor, o faturamento vira refém de timing e sorte.</p>
<p>A BKS Grow estrutura o que chamamos de <b>máquina de demanda previsível</b> — especificamente para experts e consultorias que faturam acima de 100k/mês e querem parar de viver no modo "espera".</p>
<p>Não vendemos posts bonitos. Estruturamos funis que colocam o decisor certo na sua agenda toda semana.</p>
<p><b>Pergunta honesta:</b> a <b>${n}</b> tem hoje um processo ativo de aquisição de clientes, ou o crescimento depende da sua rede de contatos?</p>
<br/><p>Abs,<br/>[Nome] — BKS Grow</p>`,
};

// B2B Events — Step 1
const B2B_EVENTS_S1: StepTemplates = {
    subjects: {
        A: `O calendário da {businessName} em 90 dias — você sabe o que tem?`,
        B: `{businessName}: indicação não escala. E agora?`,
    },
    html: (n) => `<p>Olá,</p>
<p>Pergunta direta: você sabe quantos contratos corporativos a <b>${n}</b> vai fechar nos próximos 90 dias?</p>
<p>Se a resposta depende de "ver como o mercado vai reagir" ou "esperar as indicações chegarem", você tem um problema de previsibilidade — não de competência.</p>
<p>A BKS Grow é especializada exclusivamente no setor de eventos corporativos. Produtoras, casas de eventos, cenografia, audiovisual. Não somos agência generalista. Entendemos que o seu ciclo de venda é longo, o decisor é C-Level e o ticket é alto.</p>
<p>Estruturamos funis de aquisição B2B que colocam oportunidades qualificadas no pipeline da sua equipe comercial — sem depender de quem lembra de você.</p>
<p>Como a <b>${n}</b> está gerando demanda ativa hoje, fora indicação?</p>
<br/><p>Abs,<br/>[Nome] — BKS Grow</p>`,
};

// Unknown — Step 1 (original copy as fallback)
const UNKNOWN_S1: StepTemplates = {
    subjects: {
        A: `O teto de crescimento da {businessName}`,
        B: `Uma pergunta sobre a {businessName}`,
    },
    html: (n) => `<p>Olá, equipe da <b>${n}</b>.</p>
<p>Acompanho o trabalho de vocês e fica claro o alto nível técnico que entregam.</p>
<p>Mas trabalhando com experts e negócios de alta performance, notei um padrão perigoso: <b>a dependência quase exclusiva de indicações (boca a boca).</b></p>
<p>Indicações são ótimas, mas não são previsíveis. Elas criam uma "montanha-russa" financeira que impede o negócio de cruzar com segurança e constância a barreira dos R$ 100k/mês.</p>
<p>Foi exatamente esse o gargalo que nós resolvemos para alguns dos principais players do mercado, implementando uma máquina de aquisição que não depende de sorte.</p>
<p>Como vocês estão resolvendo a entrada de clientes frios hoje?</p>
<br/><p>Abs,<br/>Equipe BKSGrow</p>`,
};

// Experts — Step 2
const EXPERTS_S2: StepTemplates = {
    subjects: {
        A: `Re: O guia que experts de 100k+ usam para previsibilidade`,
        B: `Re: 3 engrenagens que matam a montanha-russa de caixa`,
    },
    html: (n) => `<p>Olá novamente,</p>
<p>Na última mensagem eu provoquei sobre a dependência de indicação. Agora quero ir além e entregar algo prático.</p>
<p>Compilamos um guia com o framework que aplicamos com experts e consultorias para resolver 3 problemas específicos:</p>
<ul>
  <li>Como gerar demanda qualificada sem depender da sua rede de contatos</li>
  <li>Como estruturar um funil que atrai o decisor certo (e repele o curioso)</li>
  <li>Como sair da precificação por projeto e entrar em recorrência previsível</li>
</ul>
<p>O material é direto, sem enrolação, e baseado no que implementamos no mercado real — não em teoria de palestra.</p>
<p><a href="https://bksgrow.com.br/guia-previsibilidade">Acessar o guia sem custo aqui</a></p>
<p>Se fizer sentido, me responda com um "faz sentido" que eu compartilho um diagnóstico rápido da <b>${n}</b> em cima do framework.</p>
<br/><p>Abs,<br/>[Nome] — BKS Grow</p>`,
};

// B2B Events — Step 2
const B2B_EVENTS_S2: StepTemplates = {
    subjects: {
        A: `Re: O framework de previsibilidade para o setor de eventos`,
        B: `Re: Como fornecedores de eventos estão saindo da indicação`,
    },
    html: (n) => `<p>Olá novamente,</p>
<p>Você provavelmente já ouviu que "funil é coisa de infoproduto". No setor de eventos corporativos, essa crença é o maior sabotador de crescimento.</p>
<p>A verdade é que ciclo de venda longo + ticket alto + decisor C-Level é o cenário perfeito para funil B2B. Você só precisa do framework certo.</p>
<p>Montamos um guia específico para fornecedores do setor de eventos que mostra:</p>
<ul>
  <li>Por que indicação sozinha cria um teto de faturamento invisível</li>
  <li>Como mapear e alcançar o decisor corporativo antes da concorrência</li>
  <li>O modelo de pipeline que funciona quando o ciclo de venda é 30-90 dias</li>
</ul>
<p><a href="https://bksgrow.com.br/guia-previsibilidade">Acessar o guia aqui</a></p>
<p>Se você ler e quiser um diagnóstico rápido do funil atual da <b>${n}</b>, é só responder esse email.</p>
<br/><p>Abs,<br/>[Nome] — BKS Grow</p>`,
};

// Unknown — Step 2 (original copy as fallback)
const UNKNOWN_S2: StepTemplates = {
    subjects: {
        A: `Re: O teto de crescimento da {businessName}`,
        B: `Re: Framework de Previsibilidade — {businessName}`,
    },
    html: (_n) => `<p>Oi novamente,</p>
<p>Para não ficar só na teoria sobre o problema das indicações, resolvi abrir a "caixa preta".</p>
<p>Compilei o exato framework de <b>Previsibilidade de Caixa para Experts e B2B</b> que utilizamos para estabilizar o faturamento de parceiros que já entregam um serviço de excelência, mas pecam na tração.</p>
<p>Você pode acessar o material sem custo aqui: <a href="https://bksgrow.com.br/guia-previsibilidade">Acessar o Framework de Previsibilidade</a></p>
<br/><p>Espero que traga clareza para os próximos passos de vocês.</p>
<p>Abs,<br/>Equipe BKSGrow</p>`,
};

// Experts — Step 3
const EXPERTS_S3: StepTemplates = {
    subjects: {
        A: `Última mensagem para a {businessName}`,
        B: `Fechando o ciclo — {businessName}`,
    },
    html: (n) => `<p>Olá,</p>
<p>Essa é a última mensagem que envio.</p>
<p>Sei que a caixa de entrada de um expert é disputada. Não vou fingir que meu email é mais importante que os outros.</p>
<p>Mas vou deixar uma observação final: se a <b>${n}</b> fecha clientes hoje exclusivamente porque alguém indicou, vocês estão operando com um modelo que não escala. E que coloca o faturamento na mão de terceiros.</p>
<p>Nos últimos meses, estruturamos máquinas de aquisição para experts e consultorias que precisavam sair desse ciclo. O resultado: agenda previsível, pipeline ativo e margem maior por contrato.</p>
<p>Se isso faz sentido para o momento de vocês, a conversa leva 15 minutos e é direta:</p>
<table width="100%" cellspacing="0" cellpadding="0"><tr><td><table cellspacing="0" cellpadding="0"><tr><td style="border-radius: 4px; background-color: #25D366;">
  <a href="https://wa.me/5511998577077?text=Ol%C3%A1%2C%20vi%20o%20email%20sobre%20previsibilidade%20e%20quero%20entender%20como%20aplicar%20na%20${encodeURIComponent(n)}" target="_blank" style="padding: 12px 24px; border-radius: 4px; border: 1px solid #25D366; color: #ffffff; background-color: #25D366; font-family: sans-serif; font-size: 16px; font-weight: bold; text-decoration: none; display: inline-block;">
    Falar agora no WhatsApp — 15 min
  </a>
</td></tr></table></td></tr></table>
<br/><p>Se não fizer sentido agora, sem problema. Você sabe onde nos encontrar.</p>
<p>Abs,<br/>[Nome] — BKS Grow</p>`,
};

// B2B Events — Step 3
const B2B_EVENTS_S3: StepTemplates = {
    subjects: {
        A: `Última mensagem — {businessName}`,
        B: `Vou parar de escrever, mas antes...`,
    },
    html: (n) => `<p>Olá,</p>
<p>Essa é a terceira e última mensagem.</p>
<p>Vou resumir em uma frase: se a <b>${n}</b> depende de indicação para fechar contratos corporativos, vocês têm um teto de crescimento que nenhuma competência técnica vai resolver. Porque o problema não é o serviço. É o motor de vendas.</p>
<p>A BKS Grow trabalha exclusivamente com o setor de eventos — produtoras, casas de eventos, cenografia, audiovisual. Sabemos que o seu mercado funciona diferente de qualquer outro.</p>
<p>Uma conversa de 15 minutos é suficiente para mostrar onde está o gargalo e se faz sentido trabalharmos juntos.</p>
<table width="100%" cellspacing="0" cellpadding="0"><tr><td><table cellspacing="0" cellpadding="0"><tr><td style="border-radius: 4px; background-color: #25D366;">
  <a href="https://wa.me/5511998577077?text=Ol%C3%A1%2C%20vi%20o%20email%20sobre%20previsibilidade%20e%20quero%20entender%20como%20aplicar%20na%20${encodeURIComponent(n)}" target="_blank" style="padding: 12px 24px; border-radius: 4px; border: 1px solid #25D366; color: #ffffff; background-color: #25D366; font-family: sans-serif; font-size: 16px; font-weight: bold; text-decoration: none; display: inline-block;">
    Agendar conversa no WhatsApp — 15 min
  </a>
</td></tr></table></td></tr></table>
<br/><p>Se o timing não é agora, respeito. Mas se o mês que vem começar com a mesma incerteza de hoje, lembre desta mensagem.</p>
<p>Abs,<br/>[Nome] — BKS Grow</p>`,
};

// Unknown — Step 3 (original copy as fallback)
const UNKNOWN_S3: StepTemplates = {
    subjects: {
        A: `Última tentativa - O próximo passo para a {businessName}`,
        B: `Fechando — {businessName}`,
    },
    html: (n) => `<p>Oi, equipe da ${n}.</p>
<p>Essa é a minha última mensagem por aqui. Meu objetivo não é lotar a caixa de vocês, mas sim trazer uma provocação real sobre o modelo de crescimento de vocês.</p>
<p>Se vocês têm uma entrega de excelência, mas ainda sentem a incerteza do caixa no início de cada mês porque dependem da rede de contatos para fechar contratos... vocês estão deixando muito dinheiro na mesa.</p>
<p>Nós construímos a máquina que lota a agenda de grandes nomes do seu setor todos os dias.</p>
<p>Se vocês estão prontos para parar de depender da sorte e construir previsibilidade de R$ 100k+ todos os meses, vamos conversar brevemente.</p>
<table width="100%" cellspacing="0" cellpadding="0"><tr><td><table cellspacing="0" cellpadding="0"><tr><td style="border-radius: 4px; bgcolor: #25D366;">
  <a href="https://wa.me/5511998577077?text=Ol%C3%A1%2C%20vi%20o%20email%20sobre%20previsibilidade%20e%20quero%20entender%20como%20aplicar%20na%20${encodeURIComponent(n)}" target="_blank" style="padding: 12px 24px; border-radius: 4px; border: 1px solid #25D366; color: #ffffff; background-color: #25D366; font-family: sans-serif; font-size: 16px; font-weight: bold; text-decoration: none; display: inline-block;">
    Falar com Consultor no WhatsApp
  </a>
</td></tr></table></td></tr></table>
<br/><p>Abs,<br/>Equipe BKSGrow</p>`,
};

// Sites Selling — Step 1 (Método Autoridade Digital — ego + exemplo direto sem pedir permissão)
const SITES_S1: StepTemplates = {
    subjects: {
        A: `{businessName}: sua autoridade online está à altura do que você entrega?`,
        B: `Pesquisei a {businessName} antes de escrever`,
    },
    html: (n) => `<p>Olá,</p>
<p>Pesquisei a <b>${n}</b> antes de escrever.</p>
<p>Profissionais do seu nível constroem autoridade ao longo de anos. O problema é quando a presença online não reflete essa autoridade — e o potencial cliente que pesquisa antes de contratar encontra algo que não está à altura do serviço que você entrega.</p>
<p>Para quem cobra pelo valor do trabalho, presença digital fraca tem custo direto: o cliente pesquisa, não se convence, e escolhe o concorrente. Sem que você saiba.</p>
<p>Aplico o <b>Método Autoridade Digital</b> para profissionais liberais — site entregue em 7 dias, posicionado no Google e construído para converter visita em contato.</p>
<p>Um exemplo: <a href="https://revela-odontologia.pages.dev" target="_blank">Revela Odontologia</a> — entregue em 5 dias, já aparece no Google para buscas locais, WhatsApp integrado direto na página.</p>
<p>Se quiser ver como ficaria para a <b>${n}</b>, responda esse email.</p>
<br/><p>Erick<br/><a href="https://erick-sena-portfolio.pages.dev" target="_blank">erick-sena-portfolio.pages.dev</a></p>`,
};

// Sites Selling — Step 2 (Método Autoridade Digital — mais prova + o que está incluso)
const SITES_S2: StepTemplates = {
    subjects: {
        A: `Re: Mais 2 projetos entregues — veja o padrão`,
        B: `Re: O que o Método Autoridade Digital entrega na prática`,
    },
    html: (n) => `<p>Olá novamente,</p>
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
<p>Para um profissional como você, um único cliente novo já cobre o investimento. Se quiser ver como ficaria para a <b>${n}</b>, responda com um "quero ver".</p>
<br/><p>Erick<br/><a href="https://erick-sena-portfolio.pages.dev" target="_blank">erick-sena-portfolio.pages.dev</a></p>`,
};

// Sites Selling — Step 3 (Método Autoridade Digital — ego + urgência + CTA direto)
const SITES_S3: StepTemplates = {
    subjects: {
        A: `Última mensagem — {businessName}`,
        B: `Encerrando — {businessName}`,
    },
    html: (n) => `<p>Olá,</p>
<p>Última mensagem.</p>
<p>Profissional do seu nível não pode ter a presença digital comprometendo a autoridade que levou anos para construir. Cada semana é uma semana onde o potencial cliente pesquisa, não se convence, e vai para o concorrente.</p>
<p>O <b>Método Autoridade Digital</b> resolve isso em 7 dias. Investimento único, sem contrato longo.</p>
<p>A conversa leva 15 minutos — você sai sabendo exatamente o que vai receber e o que vai custar:</p>
<table width="100%" cellspacing="0" cellpadding="0"><tr><td><table cellspacing="0" cellpadding="0"><tr><td style="border-radius: 4px; background-color: #25D366;">
  <a href="https://wa.me/5531991072407?text=Ol%C3%A1%20Erick%2C%20vi%20seu%20email%20sobre%20o%20site%20da%20${encodeURIComponent(n)}" target="_blank" style="padding: 12px 24px; border-radius: 4px; border: 1px solid #25D366; color: #ffffff; background-color: #25D366; font-family: sans-serif; font-size: 16px; font-weight: bold; text-decoration: none; display: inline-block;">
    Garantir meu site em 7 dias →
  </a>
</td></tr></table></td></tr></table>
<br/><p>Daqui a 30 dias, quando um paciente pesquisar seu nome e clicar no site do concorrente, esse email ainda vai estar aqui.</p>
<p>Erick<br/><a href="https://erick-sena-portfolio.pages.dev" target="_blank">erick-sena-portfolio.pages.dev</a></p>`,
};

// Sites Selling — Step 4 (Nurture 30d — novo resultado como gancho)
const SITES_S4: StepTemplates = {
    subjects: {
        A: `{businessName} — novo projeto entregue essa semana`,
        B: `Atualização rápida para a {businessName}`,
    },
    html: (n) => `<p>Olá,</p>
<p>Faz um mês desde que escrevi para a <b>${n}</b>.</p>
<p>Essa semana entrei mais um projeto com o <b>Método Autoridade Digital</b> — e quis te atualizar porque o resultado reforça exatamente o que falei antes.</p>
<p>Profissional que não tinha presença online estruturada. Em 7 dias: site no ar, aparecendo no Google, WhatsApp integrado. Primeira semana: novos contatos chegando pelo site sem nenhum anúncio.</p>
<p>Se o timing antes não era certo, talvez agora seja diferente. Para um profissional como você, um único cliente novo já cobre o investimento.</p>
<p>Se quiser retomar a conversa, é só responder esse email.</p>
<br/><p>Erick<br/><a href="https://erick-sena-portfolio.pages.dev" target="_blank">erick-sena-portfolio.pages.dev</a></p>`,
};

// Sites Selling — Step 5 (Nurture 60d — encerramento definitivo, deixa contato)
const SITES_S5: StepTemplates = {
    subjects: {
        A: `Última vez — {businessName}`,
        B: `Saindo da sua caixa de entrada — {businessName}`,
    },
    html: (n) => `<p>Olá,</p>
<p>Essa é minha última mensagem.</p>
<p>Escrevi 4 vezes para a <b>${n}</b>. Vou respeitar sua caixa de entrada a partir de agora.</p>
<p>Se em algum momento a presença digital virar prioridade — ou se um concorrente aparecer na frente de você no Google e isso custar um cliente — você sabe onde me encontrar:</p>
<p><a href="https://erick-sena-portfolio.pages.dev" target="_blank">erick-sena-portfolio.pages.dev</a><br/>
<a href="https://wa.me/5531991072407" target="_blank">WhatsApp direto</a></p>
<p>O <b>Método Autoridade Digital</b> continua disponível. 7 dias para ter um site que transmite o nível do seu trabalho.</p>
<br/><p>Erick</p>`,
};

// ─── Template map ─────────────────────────────────────────────────────────────

const TEMPLATES: Record<Segment, StepTemplates[]> = {
    experts:       [EXPERTS_S1,    EXPERTS_S2,    EXPERTS_S3],
    b2b_events:    [B2B_EVENTS_S1, B2B_EVENTS_S2, B2B_EVENTS_S3],
    sites_selling: [SITES_S1,      SITES_S2,      SITES_S3,      SITES_S4, SITES_S5],
    unknown:       [UNKNOWN_S1,    UNKNOWN_S2,    UNKNOWN_S3],
};

// ─── Main export ──────────────────────────────────────────────────────────────

export function generateBrevoSequence(lead: LeadInfo, step: number = 1): SequenceEmail {
    const segment: Segment = lead.segment ?? detectSegment(lead);
    const variant: ABVariant = selectVariant(lead.id);
    const templates = TEMPLATES[segment];
    const stepIndex = Math.min(Math.max(step, 1), templates.length) - 1;
    const template = TEMPLATES[segment][stepIndex];
    const businessName = lead.business_name;

    const rawSubject = template.subjects[variant].replace(/\{businessName\}/g, businessName);

    return {
        subject: rawSubject,
        html: template.html(businessName),
        ab_variant: variant,
    };
}

/**
 * Strategy enhancement: TOFU Asset generation logic
 */
export function getTOFOLink() {
    return 'https://bksgrow.com.br/guia-previsibilidade-eventos';
}
