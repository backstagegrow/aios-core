import { callLLM } from './client';
import fs from 'fs';
import path from 'path';
// @ts-expect-error js-yaml typings expose a broad load() return type for runtime parsing here.
import yaml from 'js-yaml';

type FinchPersona = {
    system_prompt?: string;
};

const FINCH_DEBUG_ENABLED = process.env.AIOS_DEBUG === 'true' || process.env.AIOS_LLM_DEBUG === 'true';

/**
 * FinchAgent — O motor de decisão baseado no DNA de Thiago Finch.
 */
export class FinchAgent {
    private systemPrompt: string = '';

    constructor() {
        this.loadPersona();
    }

    private loadPersona() {
        try {
            const yamlPath = path.resolve(process.cwd(), 'experts/thiago_finch/clone_thiago_finch.yaml');
            const fileContents = fs.readFileSync(yamlPath, 'utf8');
            const data = yaml.load(fileContents) as FinchPersona;
            this.systemPrompt = data.system_prompt || 'VocÃª Ã© Thiago Finch. Pense em escala, lucro e trÃ¡fego.';
        } catch (e) {
            if (FINCH_DEBUG_ENABLED) {
                console.error('[FinchAgent] Error loading YAML persona:', e);
            }
            // Fallback mental scale principles
            this.systemPrompt = "Você é Thiago Finch. Pense em escala, lucro e tráfego.";
        }
    }

    async analyze(input: string, context: string = ''): Promise<string> {
        const fullPrompt = `CONTEXTO DA OPERAÇÃO:
${context}

DESAFIO/CONTEÚDO PARA ANALISAR:
${input}

Thiago, dê o seu feedback implacável. Foque em:
1. A headline é fraca ou magnética?
2. Estamos vendendo o sistema ou o profissional? (Deveria ser o sistema)
3. Onde estamos perdendo margem ou autoridade?
4. Como reescreveria esse argumento para confrontar o cliente e levá-lo à compra?`;

        return callLLM(fullPrompt, {
            system: this.systemPrompt,
            temperature: 0.7,
            model: 'gpt-4o-mini'
        });
    }

    async generateCopy(leadInfo: Record<string, unknown>, step: number): Promise<string> {
        const prompt = `Crie um email de outreach (Passo ${step}) para o lead: ${JSON.stringify(leadInfo)}.
Foque no problema da "Dependência de Indicações" vs "Máquina de Vendas".
Seja direto, provocativo e foque em ROI.`;

        return callLLM(prompt, {
            system: this.systemPrompt,
            temperature: 0.8,
            model: 'gpt-4o-mini'
        });
    }
}
