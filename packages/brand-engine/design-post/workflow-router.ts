/**
 * Design Post Generator — workflow-router.ts
 * 
 * Maps DesignSpec → Text Prompts for Hugging Face image generation.
 * (Migrated from ComfyUI JSON workflows to direct prompting)
 */

import type { DesignSpec, PostFormat, RenderJobParams, BriefingInput } from './types.ts'

// ─── Format to Aspect Ratio ───────────────────────────────────────────────────

export function getAspectRatio(format: PostFormat): "1:1" | "9:16" | "16:9" | "4:3" | "3:4" {
    switch (format) {
        case 'instagram-square': return "1:1"
        case 'instagram-story': return "9:16"
        case 'facebook-post': return "4:3"
        case 'linkedin-post': return "3:4"
        case 'banner': return "16:9"
        default: return "1:1"
    }
}

// ─── Prompt Builder ───────────────────────────────────────────────────────────
// Builds the actual text prompt for the image generation model (e.g. FLUX)

export function buildImagePrompt(params: RenderJobParams): string {
    const {
        brand_name,
        layout_type,
        style_direction,
        background_type,
        palette_mode,
        brand_colors,
        headline,
        subheadline
    } = params

    // For text-to-image we need to explicitly ask the model to draw the text if possible (like Flux does well)
    const textPrompt = `The image must contain the following text prominently: "${headline}". ` +
        (subheadline ? `Below it, smaller text: "${subheadline}". ` : '')

    return `A professional promotional graphic design for ${brand_name}.
Style: ${style_direction}.
Layout: ${layout_type}.
Background: ${background_type}.
Color Palette: ${palette_mode} using hex colors ${brand_colors.join(', ')}.
${textPrompt}
High quality, award-winning corporate design, clean typography, hyper-detailed, marketing layout.`
}


// ─── Job Builder ──────────────────────────────────────────────────────────────
// Builds the full RenderJobParams from briefing + resolved spec

export function buildRenderJob(
    briefing: BriefingInput,
    spec: DesignSpec
): RenderJobParams {
    return {
        workflow: spec.recommended_workflow,
        format: briefing.format,
        layout_type: spec.layout_type,
        style_direction: spec.style_direction,
        palette_mode: spec.palette_mode,
        background_type: spec.background_type,
        text_density: spec.text_density,
        headline: briefing.headline,
        subheadline: briefing.subheadline,
        cta: briefing.cta,
        brand_assets: briefing.brand_assets,
        brand_colors: briefing.brand_colors,
        brand_name: briefing.brand_name,
        reference_image: briefing.reference_image,
        variations: 1, // Only 1 to save HF bandwidth
    }
}

