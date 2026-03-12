/**
 * Design Post Generator — Cache Layer
 * 
 * Saves brand tokens and reference image summaries to disk.
 * LLM is NEVER called again for the same brand or same reference image.
 * 
 * Cache location: packages/brand-engine/design-post/.cache/
 */

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import type { BrandTokenCache, ReferenceCache, ReferenceSummary } from './types.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CACHE_DIR = path.join(__dirname, '.cache')
const BRAND_CACHE = path.join(CACHE_DIR, 'brands')
const REF_CACHE = path.join(CACHE_DIR, 'references')

function ensure(dir: string) {
    fs.mkdirSync(dir, { recursive: true })
}

function sha256(str: string): string {
    return crypto.createHash('sha256').update(str).digest('hex')
}

// ─── Brand Token Cache ────────────────────────────────────────────────────────

export function getBrandCache(brandName: string): BrandTokenCache | null {
    const filePath = path.join(BRAND_CACHE, `${slugify(brandName)}.json`)
    if (!fs.existsSync(filePath)) return null
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

export function setBrandCache(data: BrandTokenCache): void {
    ensure(BRAND_CACHE)
    const filePath = path.join(BRAND_CACHE, `${slugify(data.brand_name)}.json`)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

// ─── Reference Image Cache ────────────────────────────────────────────────────

export function getReferenceCache(imageUrl: string): ReferenceCache | null {
    const hash = sha256(imageUrl)
    const filePath = path.join(REF_CACHE, `${hash}.json`)
    if (!fs.existsSync(filePath)) return null
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

export function setReferenceCache(imageUrl: string, summary: ReferenceSummary): void {
    ensure(REF_CACHE)
    const hash = sha256(imageUrl)
    const filePath = path.join(REF_CACHE, `${hash}.json`)
    const entry: ReferenceCache = {
        url_hash: hash,
        summary,
        cached_at: new Date().toISOString(),
    }
    fs.writeFileSync(filePath, JSON.stringify(entry, null, 2), 'utf-8')
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str: string): string {
    return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

