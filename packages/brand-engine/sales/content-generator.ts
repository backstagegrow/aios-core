import 'dotenv/config';

interface LeadInfo {
    business_name: string;
    niche?: string;
}

export const STRATEGY_TRIGGERS = {
    REFERRAL_PAIN: "dependência de indicações",
    PREDICTABILITY: "previsibilidade de caixa",
    GOD_TIER: "framework de conversão B2B"
};

export function generateBrevoSequence(lead: LeadInfo, step: number = 1) {
    const businessName = lead.business_name;

    if (step === 1) {
        return {
            subject: `O teto de crescimento da ${businessName}`,
            html: `<p>Olá, equipe da <b>${businessName}</b>.</p>
            <p>Acompanho o trabalho de vocês e fica claro o alto nível técnico que entregam.</p>
            <p>Mas trabalhando com experts e negócios de alta performance, notei um padrão perigoso: <b>a dependência quase exclusiva de indicações (boca a boca).</b></p>
            <p>Indicações são ótimas, mas não são previsíveis. Elas criam uma "montanha-russa" financeira que impede o negócio de cruzar com segurança e constância a barreira dos R$ 100k/mês.</p>
            <p>Foi exatamente esse o gargalo que nós resolvemos para alguns dos principais players do mercado, implementando uma máquina de aquisição que não depende de sorte.</p>
            <p>Como vocês estão resolvendo a entrada de clientes frios hoje?</p>
            <br/><p>Abs,<br/>Equipe BKSGrow</p>`
        };
    } else if (step === 2) {
        return {
            subject: `Re: O teto de crescimento da ${businessName}`,
            html: `<p>Oi novamente,</p>
            <p>Para não ficar só na teoria sobre o problema das indicações, resolvi abrir a "caixa preta".</p>
            <p>Compilei o exato framework de <b>Previsibilidade de Caixa para Experts e B2B</b> que utilizamos para estabilizar o faturamento de parceiros que já entregam um serviço de excelência, mas pecam na tração.</p>
            <p>Você pode acessar o material sem custo aqui: <a href="https://bksgrow.com.br/guia-previsibilidade">Acessar o Framework de Previsibilidade</a></p>
            <br/><p>Espero que traga clareza para os próximos passos de vocês.</p>
            <p>Abs,<br/>Equipe BKSGrow</p>`
        };
    } else {
        return {
            subject: `Última tentativa - O próximo passo para a ${businessName}`,
            html: `<p>Oi, equipe da ${businessName}.</p>
            <p>Essa é a minha última mensagem por aqui. Meu objetivo não é lotar a caixa de vocês, mas sim trazer uma provocação real sobre o modelo de crescimento de vocês.</p>
            <p>Se vocês têm uma entrega de excelência, mas ainda sentem a incerteza do caixa no início de cada mês porque dependem da rede de contatos para fechar contratos... vocês estão deixando muito dinheiro na mesa.</p>
            <p>Nós construímos a máquina que lota a agenda de grandes nomes do seu setor todos os dias.</p>
            <p>Se vocês estão prontos para parar de depender da sorte e construir previsibilidade de R$ 100k+ todos os meses, vamos conversar brevemente.</p>
            <table width="100%" cellspacing="0" cellpadding="0">
              <tr>
                  <td>
                      <table cellspacing="0" cellpadding="0">
                          <tr>
                              <td style="border-radius: 4px; bgcolor: #25D366;">
                                  <a href="https://wa.me/5511998577077?text=Ol%C3%A1%2C%20vi%20o%20email%20sobre%20previsibilidade%20e%20quero%20entender%20como%20aplicar%20na%20${encodeURIComponent(businessName)}" target="_blank" style="padding: 12px 24px; border-radius: 4px; border: 1px solid #25D366; color: #ffffff; background-color: #25D366; font-family: sans-serif; font-size: 16px; font-weight: bold; text-decoration: none; display: inline-block;">
                                      Falar com Consultor no WhatsApp
                                  </a>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
            </table>
            <br/><p>Abs,<br/>Equipe BKSGrow</p>`
        };
    }
}

/**
 * Strategy enhancement: TOFU Asset generation logic
 * (In a real scenario, this would generate a personalized PDF or link)
 */
export function getTOFOLink() {
    return 'https://bksgrow.com.br/guia-previsibilidade-eventos';
}
