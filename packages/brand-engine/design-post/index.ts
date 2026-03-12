/**
 * Design Post Generator — index.ts
 * 
 * Main pipeline orchestrator. Call this to run the full flow end-to-end.
 * 
 * Usage:
 *   import { generateDesignPost } from './design-post/index.ts'
 *   const result = await generateDesignPost(briefing)
 * 
 * Or via CLI:
 *   node --loader ts-node/esm packages/brand-engine/design-post/index.ts \
 *     --brand "GT House" --headline "Sua imersão, sem a guerra."
 */

import type { BriefingInput, DesignPostResult } from './types.ts'
import { generateDesignSpec } from './spec.ts'
import { generateCopy } from './copy.ts'
import { validatePost } from './validator.ts'
import { buildRenderJob } from './workflow-router.ts'
import { renderPost } from './render.ts'
import { queryNotebookLM } from '../../../src/llm/notebooklm.ts'

// ─── Pipeline ─────────────────────────────────────────────────────────────────

export async function generateDesignPost(briefing: BriefingInput): Promise<DesignPostResult> {
    console.log('\n🎨 [design-post] Pipeline started')
    console.log('  Brand:', briefing.brand_name)
    console.log('  Format:', briefing.format)
    console.log('  Headline:', briefing.headline)

    // STEP 1 — LLM Parallel Generation (Design Spec + Copy)
    console.log('\n[1/3] Generating design spec & copy in parallel (LLM)...')
    let [spec, copy] = await Promise.all([
        generateDesignSpec(briefing),
        generateCopy(briefing)
    ])

    // STEP 1.25 — NotebookLM Copy Review
    console.log('\n[1.25/3] Consulting NotebookLM for Copywriting mastery...')
    const improvedCopy = await queryNotebookLM(
        `Atuando como um Master Copywriter (Gary Halbert, Eugene Schwartz, etc), critique e reescreva este texto de post de rede social para maximizar conversão e impacto. Retorne APENAS o texto final e otimizado, sem explicações adicionais:\n\n${copy}`,
        briefing.brand_name
    )

    if (improvedCopy && improvedCopy.trim().length > 0 && !improvedCopy.includes('Not available')) {
        console.log('  [NotebookLM] Copy improved successfully.')
        copy = improvedCopy.trim()
    } else {
        console.log('  [NotebookLM] Fallback to original copy.')
    }

    // Inject the newly generated copy back into the briefing so the renderer uses it
    briefing.headline = copy.split('\n')[0] || briefing.headline
    // This is a naive heuristic for prototype, ideally LLM formats the copy to a JSON schema

    // STEP 1.5 — Validator Agent (Check alignment)
    console.log('\n[1.5/3] Validating alignment...')
    const isValid = await validatePost(briefing, spec, copy)
    if (!isValid) {
        console.warn(`[validator] Validation failed. The UI spec and copy do not align with the briefing! Generating anyway, but results might be sub-optimal.`);
    }

    // STEP 2 — Workflow resolution (deterministic, no LLM)
    console.log('\n[2/3] Resolving prompt...')
    const renderJob = buildRenderJob(briefing, spec)

    // STEP 3 — Render (Hugging Face, no LLM tokens used)
    console.log('\n[3/3] Rendering via Hugging Face API...')
    const renderResult = await renderPost(renderJob)

    const result: DesignPostResult = {
        briefing,
        spec,
        render: renderResult,
        token_cost_estimate: {
            spec_tokens: 1200,  // conservative estimate for spec + copy
            image_tokens: 0,    // using free HF API
        },
    }

    // STEP 4 — QA Visual Over HF Renders
    if (renderResult.assets && renderResult.assets.png && renderResult.assets.png.length > 0) {
        console.log('\n[4/4] Starting Visual QA pass...');
        const _firstImagePath = 'data:image/png;base64,' + renderResult.assets.png[0];
        // We simulate passing the base64 output right to QA (our existing `qa/playwright.ts` uses URL paths usually, but could accept raw blobs via integration updates).

        console.log(`[qa-agent] (Stubbed) Visual check on generated output resolving contrast ratios and padding checks...`);
    }

    console.log('\n✅ [design-post] Done!')
    console.log('  Assets:', renderResult.assets?.png?.length, 'PNG(s)')
    console.log('  Tokens used (est.):', result.token_cost_estimate.spec_tokens)
    console.log('  Image tokens:', result.token_cost_estimate.image_tokens, '(zero)')

    return result
}

// ─── CLI ──────────────────────────────────────────────────────────────────────
// Quick test run: npx ts-node --esm packages/brand-engine/design-post/index.ts

if (process.argv[1] && process.argv[1].includes('design-post')) {
    const exampleBriefing: BriefingInput = {
        brand_name: 'GT House',
        campaign_objective: 'post institucional de conversão',
        format: 'instagram-square',
        headline: 'Sua imersão não precisa virar uma operação de guerra.',
        subheadline: 'Centralize estrutura e execução para focar no que realmente gera resultado.',
        cta: 'Fale com um especialista',
        copy_support: 'Post com foco em mostrar praticidade operacional e estrutura premium.',
        visual_style: 'premium corporate minimal',
        brand_colors: ['#0F5B63', '#D9F3F2', '#FFFFFF'],
        brand_assets: ['clients/GTHouse/assets/logos/GT-House-Logo-branca (para fundos escuros) horizontal (2).png'],
        reference_image: undefined,
        restrictions: [
            'manter identidade premium',
            'não poluir visual',
            'priorizar legibilidade',
        ],
    }

    // Small hack to resolve env vars correctly if run directly from this dir
    process.env.HF_TOKEN = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY

    generateDesignPost(exampleBriefing)
        .then(result => console.log('\nResult:', JSON.stringify(result.spec, null, 2)))
        .catch(console.error)
}

