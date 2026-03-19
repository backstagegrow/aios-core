import { callLLM, FREE_MODELS } from '../src/llm/client.ts'

async function testOpenRouter() {
    const brand = 'GT House'
    const context = 'Foco em mostrar praticidade operacional e estrutura premium para imersões. A GT House resolve a logística e estrutura para que o cliente foque no conteúdo.'

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

    console.log(`\n🚀 Iniciando teste com OpenRouter [${FREE_MODELS.ORCHESTRATOR}]...`)

    try {
        const response = await callLLM(prompt, {
            model: FREE_MODELS.ORCHESTRATOR,
            temperature: 0.7,
            max_tokens: 1500
        })

        console.log('\n--- RESULTADO DA OPENROUTER (MiniMax M2.5) ---\n')
        console.log(response)
        console.log('\n----------------------------------------------\n')
    } catch (error) {
        console.error('❌ Erro no teste:', error)
    }
}

testOpenRouter()
