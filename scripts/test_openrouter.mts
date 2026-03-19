import { callLLM } from '../src/llm/client.ts'

async function testOpenRouter() {
    const brand = 'GT House'
    const context = 'Foco em mostrar praticidade operacional e estrutura premium para imersões. A GT House resolve a logística e estrutura para que o cliente foque no conteúdo.'

    // Slugs manuais para garantir que o teste rode mesmo se o export falhar na detecção experimental
    const ORCHESTRATOR = "minimax/minimax-m2.5:free"

    const prompt = `
Atue como um Master Copywriter de Resposta Direta.
Gere 3 variações de copy de alta conversão para um post de Instagram da marca "${brand}".

Briefing: ${context}

Estrutura de cada variação:
1. Headline Impactante
2. Corpo do texto (focado em dor/solução)
3. CTA (Call to Action)

Use um tom premium, minimalista e pragmático.
Model: MiniMax M2.5 via OpenRouter
`

    console.log(`\n🚀 Iniciando teste com OpenRouter [${ORCHESTRATOR}]...`)

    try {
        const response = await callLLM(prompt, {
            model: ORCHESTRATOR,
            temperature: 0.7,
            max_tokens: 1500
        })

        console.log('\n--- RESULTADO DA OPENROUTER (MiniMax M2.5) ---\n')
        console.log(response)
        console.log('\n----------------------------------------------\n')
    } catch (error: any) {
        console.error('❌ Erro no teste:', error.message)
        if (error.stack) console.error(error.stack)
    }
}

testOpenRouter()
