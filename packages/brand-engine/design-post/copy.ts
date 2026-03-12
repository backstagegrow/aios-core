import { callLLM } from '../../../src/llm/client.ts';
import { getClientContext } from '../../../src/db/supabase.ts';
import type { BriefingInput } from './types.ts';

export async function generateCopy(briefing: BriefingInput): Promise<string> {
    console.log(`[copy-agent] Fetching tone of voice for ${briefing.brand_name} from Supabase...`);
    const toneOfVoice = await getClientContext(briefing.brand_name.replace(/\s+/g, ''), 'tone_of_voice') || 'Standard corporate tone.';

    const prompt = `You are an expert copywriter. Generate the exact final copy for the following social media post:
Brand: ${briefing.brand_name}
Format: ${briefing.format}
Objective: ${briefing.campaign_objective}
Support context: ${briefing.copy_support || 'None'}
Subheadline: ${briefing.subheadline || 'None'}
CTA: ${briefing.cta || 'None'}

Brand Tone of Voice Rules:
${toneOfVoice}

Write ONLY the final copy text. No explanations.`;

    const raw = await callLLM(prompt);
    return raw;
}
