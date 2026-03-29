/**
 * AIOS LLM Client
 * 
 * Unified interface for calling LLM providers.
 * Reads from .env: AIOS_DEFAULT_MODEL, ANTHROPIC_API_KEY, OPENAI_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY, OPENROUTER_API_KEY
 */

import 'dotenv/config'

export type LLMOptions = {
    /** Set to true when the prompt references an image URL */
    vision?: boolean
    /** Required when vision: true */
    image_url?: string
    /** Model override — defaults to AIOS_DEFAULT_MODEL env var */
    model?: string
    /** Max tokens in the response */
    max_tokens?: number
    /** Temperature (0–1). Default 0.3 for structured outputs */
    temperature?: number
    /** Optional system prompt for persona/constraints */
    system?: string
}

type LLMResponse = {
    content?: Array<{ text?: string }>
    choices?: Array<{ message?: { content?: string } }>
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_MODEL = process.env.AIOS_DEFAULT_MODEL ?? 'gpt-4o-mini'
const LLM_DEBUG_ENABLED = process.env.AIOS_DEBUG === 'true' || process.env.AIOS_LLM_DEBUG === 'true'

// ─── Model Mapping (Recommended) ──────────────────────────────────────────────

export const FREE_MODELS = {
    ORCHESTRATOR: "minimax/minimax-m2.5:free",
    CODER: "qwen/qwen3-next-80b-a3b-instruct:free",
    ANALYST: "stepfun/step-3.5-flash:free",
    GEMINI_FLASH: "gemini-1.5-flash"
}

function debugLog(message: string): void {
    if (LLM_DEBUG_ENABLED) {
        console.log(message)
    }
}

/** Detect provider from model string */
function detectProvider(model: string): 'anthropic' | 'openai' | 'google' | 'openrouter' {
    if (model.includes(':free') || model.startsWith('minimax/') || model.startsWith('qwen/') || model.startsWith('stepfun/')) return 'openrouter'
    if (model.startsWith('claude')) return 'anthropic'
    if (model.startsWith('gemini')) return 'google'
    return 'openai'
}

// ─── Main Call ────────────────────────────────────────────────────────────────

export async function callLLM(prompt: string, opts: LLMOptions = {}): Promise<string> {
    const model = opts.model ?? DEFAULT_MODEL
    const provider = detectProvider(model)

    debugLog(`[llm] Calling ${provider} / ${model}`)

    try {
        switch (provider) {
            case 'anthropic': return await callAnthropic(prompt, model, opts)
            case 'google': return await callGoogle(prompt, model, opts)
            case 'openrouter': return await callOpenRouter(prompt, model, opts)
            case 'openai': return await callOpenAI(prompt, model, opts)
            default: throw new Error(`[llm] Unknown provider for model: ${model}`)
        }
    } catch (error) {
        console.error(`[llm] Error calling ${provider}:`, error)
        // Auto-fallback to OpenRouter if configured and not already calling it
        if (provider !== 'openrouter' && process.env.OPENROUTER_API_KEY) {
            debugLog(`[llm] Attempting fallback to OpenRouter...`)
            return await callOpenRouter(prompt, FREE_MODELS.ORCHESTRATOR, opts)
        }
        throw error
    }
}

// ─── OpenRouter (OpenAI Compatible) ───────────────────────────────────────────

async function callOpenRouter(prompt: string, model: string, opts: LLMOptions): Promise<string> {
    const API_KEY = process.env.OPENROUTER_API_KEY
    if (!API_KEY) throw new Error('[llm] Missing OPENROUTER_API_KEY in .env')

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://aios-core.internal', // Optional for OpenRouter
            'X-Title': 'AIOS Core',
        },
        body: JSON.stringify({
            model,
            max_tokens: opts.max_tokens ?? 1024,
            temperature: opts.temperature ?? 0.3,
            messages: [
                ...(opts.system ? [{ role: 'system', content: opts.system }] : []),
                { role: 'user', content: prompt }
            ],
        }),
    })

    if (!res.ok) {
        const err = await res.text()
        throw new Error(`[llm] OpenRouter API error ${res.status}: ${err}`)
    }

    const json = await res.json() as LLMResponse
    return json.choices?.[0]?.message?.content ?? ''
}

// ─── Anthropic ────────────────────────────────────────────────────────────────

async function callAnthropic(prompt: string, model: string, opts: LLMOptions): Promise<string> {
    const API_KEY = process.env.ANTHROPIC_API_KEY
    if (!API_KEY) throw new Error('[llm] Missing ANTHROPIC_API_KEY in .env')

    const content: any[] = opts.vision && opts.image_url
        ? [
            { type: 'image', source: { type: 'url', url: opts.image_url } },
            { type: 'text', text: prompt },
        ]
        : [{ type: 'text', text: prompt }]

    const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'anthropic-version': '2023-06-01',
            'x-api-key': API_KEY,
            'content-type': 'application/json',
        },
        body: JSON.stringify({
            model,
            system: opts.system,
            max_tokens: opts.max_tokens ?? 1024,
            temperature: opts.temperature ?? 0.3,
            messages: [{ role: 'user', content }],
        }),
    })

    if (!res.ok) {
        const err = await res.text()
        throw new Error(`[llm] Anthropic API error ${res.status}: ${err}`)
    }

    const json = await res.json() as LLMResponse
    return json.content?.[0]?.text ?? ''
}

// ─── OpenAI ───────────────────────────────────────────────────────────────────

async function callOpenAI(prompt: string, model: string, opts: LLMOptions): Promise<string> {
    const API_KEY = process.env.OPENAI_API_KEY
    if (!API_KEY) throw new Error('[llm] Missing OPENAI_API_KEY in .env')

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model,
            max_tokens: opts.max_tokens ?? 1024,
            temperature: opts.temperature ?? 0.3,
            messages: [
                ...(opts.system ? [{ role: 'system', content: opts.system }] : []),
                { role: 'user', content: prompt }
            ],
        }),
    })

    if (!res.ok) {
        const err = await res.text()
        throw new Error(`[llm] OpenAI API error ${res.status}: ${err}`)
    }

    const json = await res.json() as LLMResponse
    return json.choices?.[0]?.message?.content ?? ''
}

// ─── Google Gemini ────────────────────────────────────────────────────────────

async function callGoogle(prompt: string, model: string, opts: LLMOptions): Promise<string> {
    const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!API_KEY) throw new Error('[llm] Missing GOOGLE_GENERATIVE_AI_API_KEY in .env')

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`

    const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            system_instruction: opts.system ? { parts: [{ text: opts.system }] } : undefined,
            generationConfig: {
                maxOutputTokens: opts.max_tokens ?? 1014,
                temperature: opts.temperature ?? 0.3,
            },
        }),
    })

    if (!res.ok) {
        const err = await res.text()
        throw new Error(`[llm] Google API error ${res.status}: ${err}`)
    }

    const json = await res.json() as LLMResponse
    return json.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}
