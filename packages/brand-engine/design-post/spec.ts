/**
 * Design Post Generator — spec.ts
 * 
 * THE ONLY PLACE IN THE PIPELINE THAT CALLS THE LLM.
 * 
 * Responsibilities:
 *   1. Check brand cache → skip if already have brand tokens
 *   2. Check reference cache → skip if reference was already analyzed
 *   3. Build a SHORT prompt → call LLM once → return DesignSpec JSON
 *   4. Save everything to cache
 * 
 * LLM is NEVER called for:
 *   - Image generation
 *   - Upscaling
 *   - Inpainting
 *   - Layout composition
 *   - Variations
 */

import type { BriefingInput, DesignSpec, ReferenceSummary } from './types.ts'
import {
    getBrandCache, setBrandCache,
    getReferenceCache, setReferenceCache,
} from './cache.ts'

// Swap this import for whichever LLM client you're using (OpenAI, Gemini, etc.)
// The interface is simple: string prompt → string JSON response
import { callLLM } from '../../../src/llm/client.ts'
import { getClientContext } from '../../../src/db/supabase.ts'
import { queryNotebookLM } from '../../../src/llm/notebooklm.ts'

// ─── Main Entry Point ─────────────────────────────────────────────────────────

export async function generateDesignSpec(briefing: BriefingInput): Promise<DesignSpec> {
    console.log('[spec] Starting design spec generation for:', briefing.brand_name)

    // 1. Resolve brand tokens (from cache or inline briefing)
    const brandTokens = await resolveBrandTokens(briefing)

    // 2. Resolve reference summary (from cache if already analyzed)
    const refSummary = briefing.reference_image
        ? await resolveReferenceImage(briefing.reference_image)
        : undefined

    // 3. Fetch Design System from Supabase Multi-tenant context
    let rawDesignSystem = '';
    if (briefing.brand_name) {
        console.log(`[spec] Fetching design_system context for ${briefing.brand_name} from Supabase...`);
        const result = await getClientContext(briefing.brand_name.replace(/\s+/g, ''), 'design_system');
        if (result) {
            console.log(`[spec] Injecting Supabase Design System context (${result.substring(0, 50)}...)`);
            rawDesignSystem = result;
        }

        // Active RAG: Ask NotebookLM for any extra guidelines mapping or strategic context for this brand
        console.log(`[spec] Doing Live RAG NotebookLM query for extra guidelines on ${briefing.brand_name}...`);
        const query = `What are the visual styling, formatting, and branding restrictions for the client ${briefing.brand_name}? Format as short bullet points. Is that ALL you need to know? No.`;
        const ragContext = await queryNotebookLM(query, briefing.brand_name);

        if (ragContext && !ragContext.includes('Not available')) {
            console.log(`[spec] Injected NotebookLM context.`);
            rawDesignSystem += `\n\n### NotebookLM RAG Context:\n${ragContext}`;
        }
    }

    // 4. Parse and validate the spec 
    const prompt = buildPrompt(briefing, brandTokens, refSummary, rawDesignSystem)
    const raw = await callLLM(prompt)
    const spec = parseSpec(raw)

    // 5. Cache brand tokens for next time
    setBrandCache({
        brand_name: briefing.brand_name,
        brand_colors: briefing.brand_colors,
        brand_assets: briefing.brand_assets,
        visual_style: briefing.visual_style,
        cached_at: new Date().toISOString(),
    })

    console.log('[spec] Done. Recommended workflow:', spec.recommended_workflow)
    return spec
}

// ─── Brand Token Resolution ───────────────────────────────────────────────────

async function resolveBrandTokens(briefing: BriefingInput) {
    const cached = getBrandCache(briefing.brand_name)
    if (cached) {
        console.log('[spec] Brand cache hit:', briefing.brand_name)
        return cached
    }
    // No cache → use briefing values directly
    return {
        brand_name: briefing.brand_name,
        brand_colors: briefing.brand_colors,
        brand_assets: briefing.brand_assets,
        visual_style: briefing.visual_style,
        cached_at: new Date().toISOString(),
    }
}

// ─── Reference Image Resolution ───────────────────────────────────────────────

async function resolveReferenceImage(imageUrl: string): Promise<ReferenceSummary> {
    const cached = getReferenceCache(imageUrl)
    if (cached) {
        console.log('[spec] Reference cache hit:', imageUrl)
        return cached.summary
    }

    // Not cached → ask LLM to summarize only (not generate)
    console.log('[spec] Analyzing reference image (first time)...')
    const prompt = `
Analyze this reference image and return ONLY a JSON object with these keys:
- composition: string (layout description)
- style: string (visual style)
- color_logic: string (color usage pattern)
- hierarchy: string (visual hierarchy description)
- key_elements: string[] (top 3-5 design elements)

Reference image URL: ${imageUrl}

Return ONLY the JSON. No explanation.
`.trim()

    const raw = await callLLM(prompt, { vision: true, image_url: imageUrl })
    const summary: ReferenceSummary = JSON.parse(raw)

    // Cache so LLM is never called again for this reference
    setReferenceCache(imageUrl, summary)
    return summary
}

// ─── Prompt Builder ───────────────────────────────────────────────────────────

function buildPrompt(
    briefing: BriefingInput,
    brandTokens: ReturnType<typeof getBrandCache>,
    refSummary?: ReferenceSummary,
    designSystemContext: string = ''
): string {
    const refBlock = refSummary
        ? `Reference Summary (pre-analyzed):
${JSON.stringify(refSummary, null, 2)}`
        : 'No reference image.'

    return `
You are a design director. Generate a concise design spec JSON for a visual post.

## Briefing
- Brand: ${briefing.brand_name}
- Objective: ${briefing.campaign_objective}
- Format: ${briefing.format}
- Headline: "${briefing.headline}"
${briefing.subheadline ? `- Subheadline: "${briefing.subheadline}"` : ''}
- CTA: "${briefing.cta}"
- Visual Style: ${briefing.visual_style}
- Brand Colors: ${briefing.brand_colors.join(', ')}
${briefing.restrictions?.length ? `- Restrictions: ${briefing.restrictions.join('; ')}` : ''}

${designSystemContext ? `## Design System & Branding Context\n${designSystemContext}\n` : ''}

## ${refBlock}

## Output Format
Return ONLY this JSON. No explanation. No markdown.

{
  "layout_type": "string",
  "style_direction": "string",
  "palette_mode": "string",
  "background_type": "string",
  "text_density": "low|medium|high",
  "composition_notes": ["string", ...],
  "reference_summary": { ... } or null,
  "recommended_workflow": "reference_post_v1 | minimal_clean_v1 | story_bold_v1"
}
`.trim()
}

// ─── Parser ───────────────────────────────────────────────────────────────────

function parseSpec(raw: string): DesignSpec {
    // Strip markdown fences if LLM wrapped the response
    const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(cleaned)

    // Validate required fields
    const required: (keyof DesignSpec)[] = [
        'layout_type', 'style_direction', 'palette_mode',
        'background_type', 'text_density', 'composition_notes', 'recommended_workflow',
    ]
    for (const key of required) {
        if (!parsed[key]) throw new Error(`[spec] Missing required field in LLM response: ${key}`)
    }

    return parsed as DesignSpec
}

