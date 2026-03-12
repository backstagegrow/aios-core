import { chromium } from 'playwright';
import path from 'path';
import { callLLM } from '../../../src/llm/client.ts';

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

export async function captureAndQA(urlOrFilePath: string, briefingContext: string): Promise<string> {
    console.log(`[qa-agent] Booting headless chromium for visual capture...`);
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        const isUrl = urlOrFilePath.startsWith('http://') || urlOrFilePath.startsWith('https://');
        const target = isUrl ? urlOrFilePath : `file://${path.resolve(urlOrFilePath)}`;

        await page.goto(target, { waitUntil: 'networkidle' });

        // Convert to base64 to pipe into vision model
        const screenshotBuffer = await page.screenshot({ fullPage: true, type: 'png' });
        const base64Image = screenshotBuffer.toString('base64');
        const dataUrl = `data:image/png;base64,${base64Image}`;

        console.log(`[qa-agent] Captured screenshot successfully.`);

        const prompt = `You are a strict QA Visual Engineer. Use the following context and the provided screenshot to QA the result.
Ensure visual hierarchy, text alignment, density map, and styling conform to:
${briefingContext}

Is there anything completely broken with this layout? Reply with your analysis.`;

        const qaResult = await callLLM(prompt, { vision: true, image_url: dataUrl });
        console.log(`[qa-agent] Multimodal QA Result: ${qaResult.slice(0, 100)}...`);
        return qaResult;

    } catch (e: unknown) {
        const message = getErrorMessage(e);
        console.error(`[qa-agent] Playwright Error:`, message);
        return `QA Failed due to navigation error: ${message}`;
    } finally {
        await browser.close();
    }
}
