import 'dotenv/config'

type ImagenResponse = {
    predictions?: Array<{ bytesBase64Encoded?: string }>
}

async function test() {
    const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    if (!API_KEY) throw new Error('No API key')

    // Testing imagen-4.0-generate-001
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            instances: [{ prompt: 'A tiny green apple' }],
            parameters: { sampleCount: 1 },
        })
    })

    if (!res.ok) {
        console.error('predict failed:', await res.text())
    } else {
        const json = await res.json() as ImagenResponse
        console.log('predict succeeded', json.predictions?.length)
        if (json.predictions?.[0]?.bytesBase64Encoded) {
            console.log('Got base64 bytes length:', json.predictions[0].bytesBase64Encoded.length)
        }
    }
}
test()
