import { callLLM } from '../../../src/llm/client.ts';
import type { BriefingInput, DesignSpec } from './types.ts';

export async function validatePost(briefing: BriefingInput, spec: DesignSpec, copy: string): Promise<boolean> {
    console.log(`[validator] Checking alignment between copy and UI spec...`);

    const prompt = `You are a strict QA Validator Agent.
You must review the following Design Spec and generated Copy, and ensure they align with the Original Briefing.

## Briefing
${JSON.stringify(briefing, null, 2)}

## Design Spec
${JSON.stringify(spec, null, 2)}

## Generated Copy
${copy}

Does the generated Copy fit the proposed UI density layout (${spec.text_density}) and align with the visual style (${spec.style_direction})? 
Reply with EXACTLY "VALID" or "INVALID". No other text.`;

    const raw = await callLLM(prompt);

    const isValid = raw.includes('VALID') && !raw.includes('INVALID');
    console.log(`[validator] Result: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
    return isValid;
}
