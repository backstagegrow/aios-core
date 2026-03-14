/**
 * dynamic-copy-generator.ts — Gerador dinâmico de copy via LLM
 *
 * Substitui templates hard-coded por geração contextual.
 * Usa callLLM (Gemini/Claude) com DNA do segmento como system prompt.
 *
 * Usage:
 *   import { generateDynamicCopy } from './dynamic-copy-generator'
 *   const copy = await generateDynamicCopy({ businessName: 'Acme', niche: 'consultoria', step: 1 })
 */

import 'dotenv/config';
import { callLLM } from '../../../src/llm/client.js';
import { detectSegment, type LeadInfo, type Segment } from './content-generator.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DynamicCopyInput {
    businessName: string;
    niche?: string;
    step: 1 | 2 | 3;
    segment?: Segment;
    abVariant?: 'A' | 'B';
    /** Optional extra context about the lead (website excerpt, review, etc.) */
    leadContext?: string;
}

export interface DynamicCopyOutput {
    subject: string;
    html: string;
    ab_variant: 'A' | 'B';
    segment: Segment;
    generated: true;
}

// ─── Segment DNA ─────────────────────────────────────────────────────────────

const SEGMENT_DNA: Record<Segment, string> = {
    experts: `
Você escreve cold emails para Experts B2B (Palestrantes, Consultores, Treinadores Corporativos).
Dores: dependência de indicação, montanha-russa de caixa, faturamento imprevisível.
ICP: faturamento R$ 100k+/mês, ticket alto, querem escalar sem contratar mais gente.
Tom: direto, provocador, sem enrolação. Nunca começa com "Ótima pergunta" ou elogios.
CTA final (step 3): WhatsApp link.
Empresa remetente: BKS Grow — especialista em funis B2B e previsibilidade de caixa.`.trim(),

    b2b_events: `
Você escreve cold emails para Fornecedores de Eventos B2B (Produtoras, Cenografia, Locação, Audiovisual).
Dores: calendário vazio em épocas de baixa demanda, dependência de licitação/indicação, ciclo de venda longo.
ICP: empresa com ticket corporativo, decisor C-Level, contratos de R$ 30k+.
Tom: pragmático, setorial, mostra entendimento do setor de eventos. Sem jargão genérico.
CTA final (step 3): WhatsApp link.
Empresa remetente: BKS Grow — especialista em pipeline B2B para o setor de eventos.`.trim(),

    unknown: `
Você escreve cold emails para empresas B2B com modelo de aquisição dependente de indicação.
Dores: previsibilidade de receita, aquisição de clientes escalável.
Tom: consultivo, direto. Não faz suposições sem dados.
CTA final (step 3): WhatsApp link.
Empresa remetente: BKS Grow — especialista em máquinas de demanda previsível.`.trim(),
};

// ─── Step context ─────────────────────────────────────────────────────────────

const STEP_CONTEXT: Record<number, string> = {
    1: 'Primeiro contato. Objetivo: provocar a dor, abrir diálogo. Sem pitch de venda. Termina com pergunta aberta.',
    2: 'Follow-up. Mencione que enviou email antes. Entregue valor concreto (framework, guia, insight). CTA: link para material gratuito.',
    3: 'Último email da sequência. Seja direto sobre ser o último contato. Reforce a transformação possível. CTA: WhatsApp.',
};

const WA_LINK = 'https://wa.me/5511998577077';

// ─── Generator ────────────────────────────────────────────────────────────────

export async function generateDynamicCopy(input: DynamicCopyInput): Promise<DynamicCopyOutput> {
    const lead: LeadInfo = { id: input.businessName, business_name: input.businessName, niche: input.niche };
    const segment = input.segment ?? detectSegment(lead);
    const variant = input.abVariant ?? (Math.random() > 0.5 ? 'A' : 'B');

    const systemPrompt = SEGMENT_DNA[segment];
    const userPrompt = `
Gere um cold email para a empresa "${input.businessName}"${input.niche ? ` (nicho: ${input.niche})` : ''}.

Contexto do step: ${STEP_CONTEXT[input.step]}
Variante A/B: ${variant} (se A: subject mais direto/afirmativo; se B: subject mais questionador/provocador)
${input.leadContext ? `Contexto adicional do lead: ${input.leadContext}` : ''}
${input.step === 3 ? `WhatsApp CTA link: ${WA_LINK}` : ''}

Retorne APENAS um JSON válido com esta estrutura (sem markdown):
{
  "subject": "assunto do email",
  "html": "<p>conteúdo HTML completo do email</p>"
}

Regras para o HTML:
- Use tags <p>, <b>, <ul>, <li>, <a href="..."> apenas
- Não inclua <html>, <body>, <head>
- Assine como: [Nome] — BKS Grow
- Máximo 250 palavras no corpo
`.trim();

    const raw = await callLLM(userPrompt, {
        system: systemPrompt,
        temperature: 0.7,
        model: 'gemini-2.5-flash',
    });

    let subject: string;
    let html: string;

    try {
        const cleaned = raw.replace(/```(?:json)?/g, '').trim();
        const parsed = JSON.parse(cleaned);
        subject = String(parsed.subject || '').replace(/\{businessName\}/g, input.businessName);
        html = String(parsed.html || '').replace(/\{businessName\}/g, input.businessName);
    } catch {
        // Fallback: extract subject from first line, rest is HTML
        const lines = raw.split('\n').filter(Boolean);
        subject = lines[0].replace(/^subject:/i, '').trim().replace(/\{businessName\}/g, input.businessName);
        html = lines.slice(1).join('\n').replace(/\{businessName\}/g, input.businessName);
    }

    return { subject, html, ab_variant: variant, segment, generated: true };
}

// ─── Batch generator ──────────────────────────────────────────────────────────

export async function generateBatchCopy(
    leads: Array<{ businessName: string; niche?: string; segment?: Segment; leadContext?: string }>,
    step: 1 | 2 | 3
): Promise<DynamicCopyOutput[]> {
    const results: DynamicCopyOutput[] = [];
    for (const lead of leads) {
        try {
            const copy = await generateDynamicCopy({ ...lead, step });
            results.push(copy);
            console.log(`[dynamic-copy] Generated step ${step} for ${lead.businessName} (${copy.segment})`);
        } catch (e: unknown) {
            console.error(`[dynamic-copy] Failed for ${lead.businessName}:`, e instanceof Error ? e.message : e);
        }
    }
    return results;
}
