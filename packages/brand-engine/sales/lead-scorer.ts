import { callLLM } from '../../../src/llm/client.ts';

export interface LeadInfo {
    id: number | string;
    business_name: string;
    niche?: string;
    google_maps_url?: string;
    website?: string;
}

export interface LeadScore {
    total: number;
    tier: 'HIGH' | 'MEDIUM' | 'LOW';
    breakdown: {
        icp_fit: number;      // 0-40
        revenue_signal: number; // 0-30
        intent_signal: number;  // 0-30
    };
    reasoning: string;
}

const CONSERVATIVE_FALLBACK: LeadScore = {
    total: 35,
    tier: 'LOW',
    breakdown: { icp_fit: 20, revenue_signal: 10, intent_signal: 5 },
    reasoning: 'LLM parse failed — conservative fallback applied',
};

function computeTier(total: number): 'HIGH' | 'MEDIUM' | 'LOW' {
    if (total > 70) return 'HIGH';
    if (total >= 45) return 'MEDIUM';
    return 'LOW';
}

export async function scoreLeadLLM(lead: LeadInfo): Promise<LeadScore> {
    const prompt = `Você é um qualificador de leads B2B preciso.

ICP alvo: Experts (Palestrantes, Treinadores Corporativos, Consultores) ou Empresas de Eventos B2B (Produtoras, Cenografia, Locações) com faturamento aparente acima de R$ 100.000/mês.

Analise o lead abaixo e atribua scores numéricos:

- icp_fit (0-40): Quanto o tipo de negócio corresponde ao ICP. 40 = Expert ou Empresa de Eventos B2B premium. 0 = negócio local irrelevante ou B2C.
- revenue_signal (0-30): Sinais de maturidade e faturamento. 30 = empresa consolidada, ticket alto evidente. 0 = sem sinais.
- intent_signal (0-30): Indicadores de que o negócio pode estar buscando crescimento ou sofre com aquisição imprevisível. 30 = sinais claros de expansão. 0 = sem sinais.

Lead:
- Nome: "${lead.business_name}"
- Nicho: "${lead.niche || 'não informado'}"
- Website: "${lead.website || 'não informado'}"
- URL Maps: "${lead.google_maps_url || 'não informado'}"

Retorne APENAS um JSON válido (sem markdown, sem explicação fora do JSON):
{
  "icp_fit": <número 0-40>,
  "revenue_signal": <número 0-30>,
  "intent_signal": <número 0-30>,
  "reasoning": "<1 frase resumindo a avaliação>"
}`;

    try {
        const response = await callLLM(prompt, { temperature: 0.1, model: 'gemini-2.5-flash' });

        // Strip markdown code fences if present
        const cleaned = response.replace(/```(?:json)?/g, '').trim();
        const parsed = JSON.parse(cleaned);

        const icp_fit = Math.min(40, Math.max(0, Number(parsed.icp_fit) || 0));
        const revenue_signal = Math.min(30, Math.max(0, Number(parsed.revenue_signal) || 0));
        const intent_signal = Math.min(30, Math.max(0, Number(parsed.intent_signal) || 0));
        const total = icp_fit + revenue_signal + intent_signal;

        return {
            total,
            tier: computeTier(total),
            breakdown: { icp_fit, revenue_signal, intent_signal },
            reasoning: String(parsed.reasoning || ''),
        };
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error('[LeadScorer] Failed to parse LLM response, applying conservative fallback:', msg);
        return { ...CONSERVATIVE_FALLBACK };
    }
}
