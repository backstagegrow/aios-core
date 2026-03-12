/**
 * Design Post Generator — Types
 * 
 * Source of truth for the full pipeline:
 * Briefing → DesignSpec (LLM) → RenderJob → ComfyUI → Assets
 */

// ─── Input ────────────────────────────────────────────────────────────────────

export type PostFormat =
    | 'instagram-square'
    | 'instagram-story'
    | 'linkedin-post'
    | 'facebook-post'
    | 'banner'

export type TextDensity = 'low' | 'medium' | 'high'

export interface BriefingInput {
    brand_name: string
    campaign_objective: string
    format: PostFormat
    headline: string
    subheadline?: string
    cta: string
    copy_support?: string
    visual_style: string
    brand_colors: string[]       // hex array, e.g. ["#0F5B63", "#D9F3F2"]
    brand_assets: string[]       // file paths or URLs to logo/assets
    reference_image?: string     // URL or null — used to extract style tokens only
    restrictions?: string[]
}

// ─── Design Spec (LLM output) ─────────────────────────────────────────────────

export interface ReferenceSummary {
    composition: string          // e.g. "central subject, dark background"
    style: string                // e.g. "clean modern editorial"
    color_logic: string          // e.g. "dark base with vibrant accent"
    hierarchy: string            // e.g. "headline dominant, cta below fold"
    key_elements: string[]       // e.g. ["bold type", "negative space", "texture"]
}

export interface DesignSpec {
    layout_type: string          // e.g. "headline-top, product-center, cta-bottom"
    style_direction: string      // e.g. "premium corporate minimal"
    palette_mode: string         // e.g. "brand-primary with high contrast"
    background_type: string      // e.g. "soft gradient with subtle texture"
    text_density: TextDensity
    composition_notes: string[]
    reference_summary?: ReferenceSummary
    recommended_workflow: string // maps to workflow file in /workflows
}

export interface RenderJobParams {
    workflow: string             // kept for compatibility/metadata
    format: PostFormat
    layout_type: string
    style_direction: string
    palette_mode: string
    background_type: string
    text_density: TextDensity
    headline: string
    subheadline?: string
    cta: string
    brand_assets: string[]
    brand_colors: string[]
    reference_image?: string
    brand_name: string
    variations: number           // default: 1 for HF to save time
}

export interface RenderResult {
    job_id: string
    status: 'queued' | 'processing' | 'done' | 'error'
    assets?: {
        png: string[]    // HF returns array buffers which we will save as png
        webp: string[]   // We can convert or leave empty
        thumbnail: string[]
        metadata_path: string
    }
    seed?: number
    error?: string
}

// ─── Cache ────────────────────────────────────────────────────────────────────

export interface BrandTokenCache {
    brand_name: string
    brand_colors: string[]
    brand_assets: string[]
    visual_style: string
    cached_at: string            // ISO date
}

export interface ReferenceCache {
    url_hash: string             // SHA-256 of reference_image URL
    summary: ReferenceSummary
    cached_at: string
}

// ─── Pipeline result ──────────────────────────────────────────────────────────

export interface DesignPostResult {
    briefing: BriefingInput
    spec: DesignSpec
    render: RenderResult
    token_cost_estimate: {
        spec_tokens: number        // estimated tokens used for LLM spec call
        image_tokens: number       // for HF we can put 0 or estimate
    }
}
