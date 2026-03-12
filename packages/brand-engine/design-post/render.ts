/**
 * Design Post Generator — render.ts
 * 
 * Calls Hugging Face Inference API for zero-cost image generation.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { HfInference } from '@huggingface/inference'
import 'dotenv/config'
import type { RenderJobParams, RenderResult } from './types.ts'
import { buildImagePrompt } from './workflow-router.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ─── Config ───────────────────────────────────────────────────────────────────

const HF_TOKEN = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY
// Using a fast, high quality open model on HF that does well with text
const MODEL_ID = 'black-forest-labs/FLUX.1-schnell'
const OUTPUT_DIR = path.join(__dirname, 'output')

type BlobWithArrayBuffer = Blob & {
    arrayBuffer(): Promise<ArrayBuffer>
}

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error)
}

// ─── Main Entry Point ─────────────────────────────────────────────────────────

export async function renderPost(
    params: RenderJobParams
): Promise<RenderResult> {
    if (!HF_TOKEN) {
        throw new Error('[render] Missing HF_TOKEN in environment variables.')
    }

    const hf = new HfInference(HF_TOKEN)
    const prompt = buildImagePrompt(params)
    const jobId = `hf_${Date.now()}`

    console.log('[render] Requesting image from Hugging Face:', MODEL_ID)
    console.log('[render] Prompt:', prompt)

    try {
        const blob = await hf.textToImage({
            inputs: prompt,
            model: MODEL_ID,
            parameters: {
                // width/height mapping roughly based on aspect ratio
                // FLUX does well with 1024x1024 base
                ...getDimensions(params.format)
            }
        })

        const assets = await downloadAssets(blob, jobId)

        return {
            job_id: jobId,
            status: 'done',
            assets,
            seed: 0,
        }
    } catch (err: unknown) {
        console.error('[render] Hugging Face API error:', getErrorMessage(err))
        throw err
    }
}

// ─── Dimensions ───────────────────────────────────────────────────────────────

function getDimensions(format: string): { width: number, height: number } {
    // Basic mapping for FLUX or SDXL
    switch (format) {
        case 'instagram-square': return { width: 1024, height: 1024 }
        case 'instagram-story': return { width: 768, height: 1344 } // 9:16
        case 'facebook-post': return { width: 1024, height: 768 }   // 4:3
        case 'linkedin-post': return { width: 768, height: 1024 }   // 3:4
        case 'banner': return { width: 1344, height: 768 }          // 16:9
        default: return { width: 1024, height: 1024 }
    }
}

// ─── Asset Save ───────────────────────────────────────────────────────────────

async function downloadAssets(
    blob: Blob,
    jobId: string
): Promise<RenderResult['assets']> {
    const jobDir = path.join(OUTPUT_DIR, jobId)
    fs.mkdirSync(jobDir, { recursive: true })

    const png: string[] = []
    const webp: string[] = []
    const thumbnail: string[] = []

    // Need to cast to any since fetch Blob implementation sometimes varies
    const buffer = Buffer.from(await (blob as BlobWithArrayBuffer).arrayBuffer())
    const filename = `generation_${Date.now()}.png`
    const outPath = path.join(jobDir, filename)

    fs.writeFileSync(outPath, buffer)
    png.push(outPath)
    thumbnail.push(outPath) // use original as thumbnail for now

    // Write metadata
    const metadataPath = path.join(jobDir, 'metadata.json')
    fs.writeFileSync(metadataPath, JSON.stringify({ job_id: jobId, png, webp, thumbnail }, null, 2))

    return { png, webp, thumbnail, metadata_path: metadataPath }
}

